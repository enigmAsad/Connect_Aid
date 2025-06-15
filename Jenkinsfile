pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the latest code from GitHub...'
                checkout scm
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh "${DOCKER_COMPOSE} down --volumes --remove-orphans"
                }
            }
        }

        stage('Clean Up Docker') {
            steps {
                echo 'Performing thorough Docker cleanup to free disk space...'
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh '''
                        docker container prune -f
                        docker image prune -a -f
                        docker volume prune -f
                        docker network prune -f
                        docker system prune -f
                        df -h
                    '''
                }
            }
        }

        stage('Prepare Environment Files') {
            steps {
                echo 'Creating environment files...'
                writeFile file: 'backEnd/.env', text: '''
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://root:12345@connectaid-cluster.yv9ci.mongodb.net/?retryWrites=true&w=majority&appName=ConnectAid-Cluster
JWT_SECRET=9b773c7c41a6c77042443a60c24477af6003c6108422540d99ddd04f23ed26206a7739d50586227e8066b8894d112d00a1557438b442815bc3c246cd7b8e7c95
JWT_EXPIRE=24h
'''
                writeFile file: 'frontEnd/.env', text: '''
VITE_API_URL=http://backend:5000
'''
                sh '''
                    chmod 644 backEnd/.env frontEnd/.env
                    [ ! -f backEnd/.env ] && echo "Error: backEnd/.env not created" && exit 1
                    [ ! -f frontEnd/.env ] && echo "Error: frontEnd/.env not created" && exit 1
                    echo "Environment files created successfully"
                '''
                sleep(time: 5, unit: 'SECONDS')
            }
        }

        stage('Build and Start Containers') {
            steps {
                echo 'Building and starting the updated stack...'
                sh "${DOCKER_COMPOSE} up -d --build"
            }
        }

        stage('Wait for Services') {
            steps {
                echo 'Waiting for services to be healthy...'
                sh '''
                    # Wait for backend to be healthy
                    timeout 300 bash -c 'while ! docker ps | grep -q "connect-aid-backend.*healthy"; do sleep 5; done'
                    
                    # Wait for frontend to be healthy
                    timeout 300 bash -c 'while ! docker ps | grep -q "connect-aid-frontend.*healthy"; do sleep 5; done'
                    
                    # Additional wait to ensure services are fully ready
                    sleep 10
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh "${DOCKER_COMPOSE} exec -T test-runner npm test"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                sh '''
                    # Check if nginx is accessible (this is the main entry point)
                    curl -f http://localhost:80 || exit 1
                    
                    # Check if backend API is accessible through nginx
                    curl -f http://localhost:80/api/health || exit 1
                    
                    # Check if frontend is accessible through nginx
                    curl -f http://localhost:80 || exit 1
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