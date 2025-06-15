pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
        SERVER_IP = '18.206.159.67'  // Add server IP as environment variable
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
                writeFile file: 'backEnd/.env', text: """
NODE_ENV=production
PORT=5000
CURRENT_HOST=${SERVER_IP}
FRONTEND_PORT=80
ADDITIONAL_ORIGINS=http://${SERVER_IP},http://${SERVER_IP}:80
MONGO_URI=mongodb+srv://root:12345@connectaid-cluster.yv9ci.mongodb.net/?retryWrites=true&w=majority&appName=ConnectAid-Cluster
JWT_SECRET=9b773c7c41a6c77042443a60c24477af6003c6108422540d99ddd04f23ed26206a7739d50586227e8066b8894d112d00a1557438b442815bc3c246cd7b8e7c95
JWT_EXPIRE=24h
"""
                writeFile file: 'frontEnd/.env', text: """
VITE_API_URL=http://${SERVER_IP}/api
"""
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
                            echo "🧪 Setting up E2E Test Environment..."
                            
                            # Create test results directory
                            mkdir -p tests/selenium/test-results tests/selenium/screenshots
                            
                            # Set test environment variables
                            export TEST_BASE_URL=http://localhost:80
                            export CI=true
                            
                            echo "🚀 Starting Selenium test container..."
                            ${DOCKER_COMPOSE} --profile testing up --build --abort-on-container-exit selenium-tests
                        '''
                        
                        echo "✅ E2E Tests completed successfully!"
                        
                    } catch (Exception e) {
                        echo "❌ E2E Tests failed: ${e.getMessage()}"
                        
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
                    archiveArtifacts artifacts: 'tests/selenium/test-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'tests/selenium/screenshots/**/*', allowEmptyArchive: true
                    
                    // Cleanup test container
                    sh '''
                        echo "🧹 Cleaning up test containers..."
                        ${DOCKER_COMPOSE} --profile testing down --remove-orphans || true
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            sh '''
                # Show container status
                docker ps -a
                
                # Show final container logs
                echo "=== Final Container Status ==="
                docker logs connect-aid-nginx --tail 20
                docker logs connect-aid-backend --tail 20  
                docker logs connect-aid-frontend --tail 20
            '''
        }
        
        success {
            echo '🎉 Deployment and E2E Tests completed successfully!'
            // You can add notifications here (Slack, email, etc.)
        }
        
        unstable {
            echo '⚠️ Deployment successful but E2E tests had issues. Check test results.'
            // You can add specific notifications for test failures
        }
        
        failure {
            echo '❌ Pipeline failed. Check logs for details.'
            sh '''
                # Additional debugging information
                echo "=== Error Investigation ==="
                docker ps -a
                docker logs connect-aid-nginx
                docker logs connect-aid-backend
                docker logs connect-aid-frontend
                docker logs connect-aid-selenium-tests || true
            '''
        }
    }
}