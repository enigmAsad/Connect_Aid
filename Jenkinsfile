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

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh '''
                    # Wait for frontend to be fully ready
                    echo "Waiting for frontend to be fully ready..."
                    sleep 30
                    
                    # Build selenium tests container
                    echo "Building Selenium tests container..."
                    docker-compose build selenium-tests
                    
                    # Verify Chrome and ChromeDriver installation
                    echo "Verifying Chrome and ChromeDriver installation..."
                    docker-compose run --rm selenium-tests sh -c "
                        echo 'Chrome version:' && google-chrome --version && 
                        echo 'ChromeDriver version:' && chromedriver --version &&
                        echo 'ChromeDriver path:' && which chromedriver &&
                        echo 'ChromeDriver permissions:' && ls -l /usr/local/bin/chromedriver &&
                        echo 'Environment variables:' && env | grep -E 'CHROME|DISPLAY'
                    "
                    
                    # Run selenium tests with proper error handling
                    echo "Starting Selenium tests..."
                    if ! docker-compose up selenium-tests; then
                        echo "Selenium tests failed"
                        docker logs connect-aid-selenium-tests
                        
                        # Check if it's a Chrome/ChromeDriver issue
                        if docker logs connect-aid-selenium-tests | grep -i "chromedriver"; then
                            echo "ChromeDriver error detected. Checking versions and configuration..."
                            docker exec connect-aid-selenium-tests sh -c "
                                echo 'Chrome version:' && google-chrome --version &&
                                echo 'ChromeDriver version:' && chromedriver --version &&
                                echo 'ChromeDriver path:' && which chromedriver &&
                                echo 'ChromeDriver permissions:' && ls -l /usr/local/bin/chromedriver &&
                                echo 'Environment variables:' && env | grep -E 'CHROME|DISPLAY'
                            "
                        fi
                        
                        exit 1
                    fi
                    
                    # Check test results
                    TEST_EXIT_CODE=$(docker inspect connect-aid-selenium-tests --format='{{.State.ExitCode}}')
                    if [ "$TEST_EXIT_CODE" -ne 0 ]; then
                        echo "Selenium tests failed with exit code $TEST_EXIT_CODE"
                        docker logs connect-aid-selenium-tests
                        exit 1
                    fi
                    
                    echo "Selenium tests completed successfully"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            sh '''
                # Show container status
                docker ps -a
                
                # Show container logs if verification failed
                if [ $? -ne 0 ]; then
                    echo "=== Nginx Logs ==="
                    docker logs connect-aid-nginx
                    echo "=== Backend Logs ==="
                    docker logs connect-aid-backend
                    echo "=== Frontend Logs ==="
                    docker logs connect-aid-frontend
                    echo "=== Selenium Tests Logs ==="
                    docker logs connect-aid-selenium-tests
                fi
            '''
        }
    }
}