pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_DIR = "${WORKSPACE}"
        GITHUB_REPO = "https://github.com/yourusername/Connect_Aid.git"
        BRANCH_NAME = "main"
    }
    
    triggers {
        pollSCM('H/5 * * * *')
    }
    
    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the latest code from GitHub...'
                git branch: "${BRANCH_NAME}", 
                    url: "${GITHUB_REPO}", 
                    credentialsId: 'github-credentials'
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh 'docker compose down --remove-orphans'
                }
            }
        }
        
        stage('Clean Up Docker') {
            steps {
                echo 'Cleaning up dangling Docker images to save disk space...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh 'docker image prune -f'
                }
            }
        }
        
        stage('Build and Start Containers') {
            steps {
                echo 'Building and starting the updated stack...'
                sh 'docker compose up -d --build'
            }
        }
        
        stage('Wait for Services') {
            steps {
                echo 'Waiting for services to be fully operational...'
                sleep(time: 30, unit: 'SECONDS')
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying the deployment...'
                sh 'docker compose ps'
                sh 'curl -s --head --fail http://localhost:80 || echo "Website not responding yet"'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully! The web application is now running.'
        }
        failure {
            echo 'Pipeline execution failed. The web application may not be running correctly.'
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                sh 'docker compose down --remove-orphans'
            }
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
} 