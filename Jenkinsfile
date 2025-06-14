pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_DIR = "${WORKSPACE}"
        GITHUB_REPO = "https://github.com/FrozenEnigma51051/Connect_Aid.git"
        BRANCH_NAME = "main"
        SELENIUM_HOST = "selenium"
        SELENIUM_PORT = "4444"
    }

    triggers {
        githubPush()
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the latest code from GitHub...'
                git branch: "${BRANCH_NAME}", url: "${GITHUB_REPO}"
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh 'docker-compose down --volumes --remove-orphans'
                }
            }
        }

        stage('Clean Up Docker') {
            steps {
                echo 'Performing thorough Docker cleanup to free disk space...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh '''
                    # Remove all stopped containers
                    docker container prune -f
                    
                    # Remove unused images
                    docker image prune -a -f
                    
                    # Remove unused volumes
                    docker volume prune -f
                    
                    # Remove unused networks
                    docker network prune -f
                    
                    # System prune as a final measure
                    docker system prune -f
                    
                    # Check available disk space
                    df -h
                    '''
                }
            }
        }

        stage('Prepare .env File') {
            steps {
                echo 'Creating .env file for backend...'
                writeFile file: 'backEnd/.env', text: '''
MONGO_URI=mongodb+srv://root:12345@connectaid-cluster.yv9ci.mongodb.net/?retryWrites=true&w=majority&appName=ConnectAid-Cluster
PORT=5000
JWT_SECRET=ConnectAid_SecureJWT_Key_2024_!@#$
'''
            }
        }

        stage('Build and Start Containers') {
            steps {
                echo 'Building and starting the updated stack...'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Wait for Services') {
            steps {
                echo 'Waiting for services to be fully operational...'
                script {
                    // Wait for backend health check
                    sh '''
                    for i in {1..30}; do
                        if curl -fs http://localhost:5000/test; then
                            echo "Backend is ready"
                            break
                        fi
                        if [ $i -eq 30 ]; then
                            echo "Backend failed to start"
                            exit 1
                        fi
                        sleep 2
                    done
                    '''
                    
                    // Wait for frontend
                    sh '''
                    for i in {1..30}; do
                        if curl -fs http://localhost:5173; then
                            echo "Frontend is ready"
                            break
                        fi
                        if [ $i -eq 30 ]; then
                            echo "Frontend failed to start"
                            exit 1
                        fi
                        sleep 2
                    done
                    '''
                    
                    // Wait for Selenium
                    sh '''
                    for i in {1..30}; do
                        if curl -fs http://localhost:4444/status; then
                            echo "Selenium is ready"
                            break
                        fi
                        if [ $i -eq 30 ]; then
                            echo "Selenium failed to start"
                            exit 1
                        fi
                        sleep 2
                    done
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                script {
                    try {
                        sh '''
                        # Create test results directory
                        mkdir -p test-results
                        
                        # Run all test files
                        docker-compose run --rm test-runner npm test
                        
                        # Check if tests passed
                        if [ $? -eq 0 ]; then
                            echo "All tests passed successfully"
                        else
                            echo "Some tests failed"
                            exit 1
                        fi
                        '''
                    } catch (exc) {
                        echo "Tests failed: ${exc}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
            post {
                always {
                    // Archive test results
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying the deployment...'
                sh 'docker-compose ps'
                sh '''
                if ! curl -fs http://localhost:80; then
                    echo "App not responding"
                    exit 1
                fi
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully. The web application is now running.'
            emailext (
                subject: "Pipeline Successful: ${currentBuild.fullDisplayName}",
                body: "Your pipeline has completed successfully. View the results at ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
        failure {
            echo 'Pipeline execution failed. Cleaning up...'
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                sh 'docker-compose down --volumes --remove-orphans'
            }
            emailext (
                subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                body: "Your pipeline has failed. View the results at ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
        always {
            echo 'Pipeline execution completed.'
            cleanWs()
        }
    }
}