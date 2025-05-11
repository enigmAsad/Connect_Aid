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
                    sh 'docker compose down --remove-orphans || true'
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
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying the deployment...'
                dir("${COMPOSE_PROJECT_DIR}") {
                    sh 'docker compose ps'
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
                sh 'docker compose down --remove-orphans || true'
            }
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
} 