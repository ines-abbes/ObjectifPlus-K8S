pipeline {
    agent any

    // tools {
    //     maven 'maven384'
    // }

    environment {
        // Variables pour les images Docker
        DOCKERHUB_USER = "inesabbes"
        backendimage = "objplus-backend-img"
        frontendimage = "objplus-frontend-img"     
        
        // Tags d'images
        BACKEND_TAG = "latest"
        FRONTEND_TAG = "latest"
        
        // Dossiers sources
        backendF = "backend"
        frontendF = "frontend"

        GIT_REPO = "https://github.com/ines-abbes/ObjectifPlus-K8S.git"
        
        // Variables pour Minikube
        K8S_NAMESPACE = "objplus"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "==> Récupération du code source depuis GitHub"

                /* Clone le repo avec tes identifiants Jenkins ''
                   - branch: mets 'main' ou 'master' selon ta branche */
                    git branch: 'master',
                    credentialsId: 'github-cred',
                    url: "${GIT_REPO}"
                }
        }
        stage('Build Docker Image - Backend') {
            steps {
                echo "==> Build de l'image Docker backend"
                bat """
                    docker build -t ${backendimage}:latest ${backendF}
                """
            }
        }

        stage('Push Docker Image - Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )]) {
                        bat """
                            echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin
                            docker push ${env.DOCKERHUB_USER}/${env.backendimage}:latest                        
                            """
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                echo "==> Build de l'image Docker frontend"
                bat """
                     docker build -t ${frontendimage}:latest ${frontendF}
                """
            }
        }

        stage('Push Docker Image - Frontend') {
            steps {
                script {
                    
                        bat """
                            echo "%DOCKERHUB_PASS%" | docker login -u "%DOCKERHUB_USER%" --password-stdin
                            docker push %DOCKERHUB_USER%/%frontendimage%:%FRONTEND_TAG%
                            
                        """
                    
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    // Utiliser les credentials kubeconfig portable
                    withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                      //  Déployer le backend
                      //chmod 600 ./kubeconfig
                        bat """
                            copy /Y "${env.KUBECONFIG_FILE}" kubeconfig
                                                    
                            set KUBECONFIG=./kubeconfig
                            
                            kubectl apply -f Manifests/express-deploy.yaml -n %K8S_NAMESPACE%
                            
                        """
                        
                      //  Attendre 30 secondes
                       sleep 30
                        
                      //  Déployer le frontend
                        bat """
                            export KUBECONFIG= kubeconfig
                            kubectl apply -f Manifests/react-deploy.yaml -n %K8S_NAMESPACE%
                        """
                        
                        // Vérification finale
                        bat """
                            export KUBECONFIG=./kubeconfig
                            echo "=== Pods ==="
                            kubectl get pods -n %K8S_NAMESPACE%
                            echo "=== Services ==="
                            kubectl get services -n %K8S_NAMESPACE%
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
            //bat 'rm -f ./kubeconfig'
        }
    }
}

