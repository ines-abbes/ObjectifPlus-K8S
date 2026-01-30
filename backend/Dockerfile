#Image du backend 
FROM node:16.20.2-alpine
#Répertoire de travail du container backend
WORKDIR /app
#copier le fichier contenant les dépendances de l'application et comment l'exécuter
COPY package*.json ./
#installer npm
RUN npm install
#copier le contenu de l'application dans le répertoire de travail du container
COPY . .
#Le port 5000 est défini à l'intérieur de l'application pour exposer l'API du backend
EXPOSE 5000
#Lancer l'application dans l'environnement de production
ENV process.env.APP_ENV=production
#Lancer l'application du backend dès le démarrage du container
CMD ["npm", "start"]
