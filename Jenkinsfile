pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_DIR = "${WORKSPACE}"
        GITHUB_REPO = "https://github.com/enigmAsad/Connect_Aid.git"
        BRANCH_NAME = "main"
        SELENIUM_HOST = "selenium"
        SELENIUM_PORT = "4444"
        SELENIUM_VNC_PORT = "7900"
        DOMAIN_NAME = "18.206.159.67"
        BACKEND_PORT = "5000"
        FRONTEND_PORT = "5173"
        NGINX_PORT = "80"
    }

    parameters {
        string(name: 'DOMAIN_NAME', defaultValue: '18.206.159.67', description: 'Domain name or EC2 public IP')
    }

    triggers {
        pollSCM('H/5 * * * *')
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

        stage('Prepare Environment Files') {
            steps {
                echo 'Creating environment files...'
                // Create root .env file
                writeFile file: '.env', text: """
DOMAIN_NAME=${DOMAIN_NAME}
BACKEND_PORT=${BACKEND_PORT}
FRONTEND_PORT=${FRONTEND_PORT}
NGINX_PORT=${NGINX_PORT}
SELENIUM_HOST=${SELENIUM_HOST}
SELENIUM_PORT=${SELENIUM_PORT}
SELENIUM_VNC_PORT=${SELENIUM_VNC_PORT}
"""
                // Create backend .env file
                writeFile file: 'backEnd/.env', text: """
MONGO_URI=mongodb+srv://root:12345@connectaid-cluster.yv9ci.mongodb.net/?retryWrites=true&w=majority&appName=ConnectAid-Cluster
PORT=${BACKEND_PORT}
NODE_ENV=production
JWT_SECRET=9b773c7c41a6c77042443a60c24477af6003c6108422540d99ddd04f23ed26206a7739d50586227e8066b8894d112d00a1557438b442815bc3c246cd7b8e7c95
JWT_EXPIRE=24h
"""
                // Create frontend .env file
                writeFile file: 'frontEnd/.env', text: """
VITE_API_URL=http://${DOMAIN_NAME}:${BACKEND_PORT}
VITE_API_PREFIX=/api
VITE_NODE_ENV=production
"""
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
                    for i in $(seq 1 30); do
                        if curl -fs http://${DOMAIN_NAME}:${BACKEND_PORT}/test; then
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
                    for i in $(seq 1 30); do
                        if curl -fs http://${DOMAIN_NAME}:${FRONTEND_PORT}; then
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
                    for i in $(seq 1 30); do
                        if curl -fs http://${DOMAIN_NAME}:${SELENIUM_PORT}/status; then
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
                        
                        # Run all test files with increased timeout
                        docker-compose run --rm test-runner npm test || true
                        
                        # Check if test results exist
                        if [ -d "test-results" ] && [ "$(ls -A test-results)" ]; then
                            echo "Tests completed with results"
                        else
                            echo "No test results found"
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
                    // Publish test results
                    junit 'test-results/**/*.xml'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying the deployment...'
                sh 'docker-compose ps'
                sh '''
                if ! curl -fs http://${DOMAIN_NAME}:${NGINX_PORT}; then
                    echo "App not responding"
                    exit 1
                fi
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            cleanWs()
        }
    }
}