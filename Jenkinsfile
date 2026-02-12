pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
        NGINX_PORT = '80'
    }

    stages {
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh "${DOCKER_COMPOSE} down --volumes --remove-orphans"
                }
            }
        }

        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace...'
                sh '''
                    rm -rf * || true
                    rm -rf .* || true
                '''
            }
        }

        stage('Checkout') {
            steps {
                echo 'Checking out the latest code from GitHub...'
                checkout scm
            }
        }

        stage('Prepare Environment Files') {
            steps {
                echo 'Creating environment files...'
                withCredentials([
                    string(credentialsId: 'connect-aid-server-ip', variable: 'SERVER_IP'),
                    string(credentialsId: 'connect-aid-mongo-uri', variable: 'MONGO_URI'),
                    string(credentialsId: 'connect-aid-jwt-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'connect-aid-jwt-expire', variable: 'JWT_EXPIRE'),
                    string(credentialsId: 'connect-aid-frontend-port', variable: 'FRONTEND_PORT'),
                    string(credentialsId: 'connect-aid-backend-port', variable: 'BACKEND_PORT'),
                    string(credentialsId: 'connect-aid-vite-api-url', variable: 'VITE_API_URL')
                ]) {
                    writeFile file: 'backEnd/.env', text: """
NODE_ENV=production
PORT=${BACKEND_PORT}
CURRENT_HOST=${SERVER_IP}
FRONTEND_PORT=${FRONTEND_PORT}
ADDITIONAL_ORIGINS=http://${SERVER_IP},http://${SERVER_IP}:${FRONTEND_PORT},http://nginx,http://nginx:${NGINX_PORT}
MONGO_URI=${MONGO_URI}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=${JWT_EXPIRE}
"""
                    writeFile file: 'frontEnd/.env', text: """
VITE_API_URL=${VITE_API_URL}
"""
                    // Create root .env for docker-compose
                    writeFile file: '.env', text: """
NODE_ENV=production
CURRENT_HOST=${SERVER_IP}
FRONTEND_PORT=${FRONTEND_PORT}
ADDITIONAL_ORIGINS=http://${SERVER_IP},http://${SERVER_IP}:${FRONTEND_PORT},http://nginx,http://nginx:80
MONGO_URI=${MONGO_URI}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=${JWT_EXPIRE}
"""
                }
            }
        }

        stage('Build and Start Containers') {
            steps {
                echo 'Building and starting the updated stack...'
                sh "${DOCKER_COMPOSE} up -d --build"
                // Give containers more time to start
                sleep(time: 45, unit: 'SECONDS')
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                sh '''
                    # Check if containers are running
                    docker ps
                    
                    # Check nginx logs
                    docker logs connect-aid-nginx
                    
                    # Check backend logs
                    docker logs connect-aid-backend
                    
                    # Check frontend logs
                    docker logs connect-aid-frontend
                    
                    # Try to access the health endpoint with retries
                    for i in {1..5}; do
                        echo "Attempt $i to verify deployment..."
                        if curl -f http://localhost:80/api/health; then
                            echo "Deployment verified successfully"
                            exit 0
                        fi
                        echo "Attempt $i failed, waiting 15 seconds..."
                        sleep 15
                    done
                    
                    echo "Deployment verification failed after 5 attempts"
                    exit 1
                '''
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Running End-to-End Selenium Tests...'
                script {
                    try {
                        // Run Selenium tests using the testing profile
                        sh '''
                            echo "Setting up E2E Test Environment..."
                            
                            # Create test results directory
                            mkdir -p tests/selenium/test-results tests/selenium/screenshots
                            
                            # Set test environment variables
                            export TEST_BASE_URL=http://nginx:80
                            export CI=true
                            
                            echo "Starting Selenium test container..."
                            ${DOCKER_COMPOSE} --profile testing up --build --abort-on-container-exit selenium-tests
                        '''
                        
                        echo "E2E Tests completed successfully!"
                        
                    } catch (Exception e) {
                        echo "E2E Tests failed: ${e.getMessage()}"
                        
                        // Show test container logs for debugging
                        sh '''
                            echo "=== Selenium Test Logs ==="
                            docker logs connect-aid-selenium-tests || echo "No selenium test logs available"
                        '''
                        
                        // Mark stage as unstable but continue pipeline
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
            post {
                always {
                    // Archive test results and screenshots
                    script {
                        try {
                            archiveArtifacts artifacts: 'tests/selenium/test-results/**/*', allowEmptyArchive: true
                            archiveArtifacts artifacts: 'tests/selenium/screenshots/**/*', allowEmptyArchive: true
                        } catch (Exception e) {
                            echo "Note: No test artifacts to archive"
                        }
                    }
                    
                    // Cleanup test container only
                    sh '''
                        echo "Cleaning up test containers..."
                        docker stop connect-aid-selenium-tests || true
                        docker rm connect-aid-selenium-tests || true
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            script {
                try {
                    sh '''
                        # Show container status
                        echo "=== Current Container Status ==="
                        docker ps -a
                        
                        # Show final container logs if containers exist
                        if docker ps -q -f name=connect-aid-nginx; then
                            echo "=== Nginx Logs (last 20 lines) ==="
                            docker logs connect-aid-nginx --tail 20
                        fi
                        
                        if docker ps -q -f name=connect-aid-backend; then
                            echo "=== Backend Logs (last 20 lines) ==="
                            docker logs connect-aid-backend --tail 20
                        fi
                        
                        if docker ps -q -f name=connect-aid-frontend; then
                            echo "=== Frontend Logs (last 20 lines) ==="
                            docker logs connect-aid-frontend --tail 20
                        fi
                    '''
                } catch (Exception e) {
                    echo "Could not retrieve container logs: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo 'Deployment and E2E Tests completed successfully!'
            // You can add notifications here (Slack, email, etc.)
        }
        
        unstable {
            echo 'Deployment successful but E2E tests had issues. Check test results.'
            // You can add specific notifications for test failures
        }
        
        failure {
            echo 'Pipeline failed. Check logs for details.'
            script {
                try {
                    sh '''
                        # Additional debugging information
                        echo "=== Error Investigation ==="
                        docker ps -a
                        
                        # Show logs for any existing containers
                        for container in connect-aid-nginx connect-aid-backend connect-aid-frontend connect-aid-selenium-tests; do
                            if docker ps -a -q -f name=$container; then
                                echo "=== $container Logs ==="
                                docker logs $container --tail 50 || echo "Could not get logs for $container"
                            fi
                        done
                    '''
                } catch (Exception e) {
                    echo "Could not retrieve error investigation logs: ${e.getMessage()}"
                }
            }
        }
    }
}