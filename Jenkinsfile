pipeline {
    //agent any

    // tools {
    //     maven 'maven384'
    // }
    agent { label 'linux' }

    environment {
        // Variables pour les images Docker
        DOCKERHUB_USER = "inesabbes"
        backendimage = "objplus-backend-img"
        frontendimage = "objplus-frontkend-img"     
        
        // Tags d'images
        BACKEND_TAG = "latest"
        FRONTEND_TAG = "latest"
        
        // Dossiers sources
        backendF = "backend"
        frontendF = "frontend"

        GIT_REPO = "objplus-backend-img"
        
        // Variables pour Minikube
        K8S_NAMESPACE = "objplus"
    }

    stages {
        stage('Build Docker Image - Backend') {
            steps {
                echo "==> Build de l'image Docker backend"
                sh """
                    docker build -t ${backendimage}:${BACKEND_TAG} ${backendF}
                """
            }
        }

        stage('Push Docker Image - Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: '',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )]) {
                        sh """
                            echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin
                            docker push ${backendimage}:${BACKEND_TAG}
                            docker logout
                        """
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                echo "==> Build de l'image Docker frontend"
                sh """
                    docker build -t ${frontendimage}:${FRONTEND_TAG} ${frontendF}
                """
            }
        }

        stage('Push Docker Image - Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: '',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )]) {
                        sh """
                            echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin
                            docker push ${frontendimage}:${FRONTEND_TAG}
                            docker logout
                        """
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    // Utiliser les credentials kubeconfig portable
                    withCredentials([file(credentialsId: '', variable: 'KUBECONFIG_FILE')]) {
                      //  Déployer le backend
                        sh """
                            cp ${KUBECONFIG_FILE} ./kubeconfig
                            chmod 600 ./kubeconfig
                            export KUBECONFIG=./kubeconfig
                            
                            # Appliquer les manifests
                            kubectl apply -f Manifests-k8s/spring-deploy.yaml -n ${K8S_NAMESPACE}
                            
                            # Attendre le déploiement
                        """
                        
                      //  Attendre 30 secondes
                       sleep 30
                        
                      //  Déployer le frontend
                        sh """
                            export KUBECONFIG=./kubeconfig
                            kubectl apply -f Manifests-k8s/angular-deploy.yaml -n ${K8S_NAMESPACE}
                        """
                        
                        // Vérification finale
                        sh """
                            export KUBECONFIG=./kubeconfig
                            echo "=== Pods ==="
                            kubectl get pods -n ${K8S_NAMESPACE}
                            echo "=== Services ==="
                            kubectl get services -n ${K8S_NAMESPACE}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline terminé."
            // Nettoyage du kubeconfig temporaire
            sh 'rm -f ./kubeconfig'
        }
    }
}

