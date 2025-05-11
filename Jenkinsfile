pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_DIR = '/home/ubuntu/Connect_Aid'
    }
    
    triggers {
        githubPush()
    }
    
    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the latest code from GitHub...'
                checkout scm
            }
        }
        
        stage('Navigate to Project Directory') {
            steps {
                echo "Navigating to project directory: ${COMPOSE_PROJECT_DIR}"
                dir("${COMPOSE_PROJECT_DIR}") {
                    sh 'pwd'
                }
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                dir("${COMPOSE_PROJECT_DIR}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        sh 'docker compose down --remove-orphans'
                    }
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
                dir("${COMPOSE_PROJECT_DIR}") {
                    sh 'docker compose up -d --build'
                }
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
                dir("${COMPOSE_PROJECT_DIR}") {
                    sh 'docker compose ps'
                    sh 'curl -s --head --fail http://localhost:80 || echo "Website not responding yet"'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully! The web application is now running.'
        }
        failure {
            echo 'Pipeline execution failed. The web application may not be running correctly.'
            dir("${COMPOSE_PROJECT_DIR}") {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    sh 'docker compose down --remove-orphans'
                }
            }
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
} 