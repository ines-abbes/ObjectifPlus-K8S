# Création de l'image Build de React
FROM node:22-alpine AS build
#Répertoire de travail du container frontend
WORKDIR /app
#copier le fichier contenant les dépendances de l'application et comment l'exécuter
COPY package*.json ./
#installer npm
RUN npm install
#copier le contenu de la partie frontend dans le répertoire de travail du container
COPY . .
#Construire le build de la partie frontend, qui va générer la création du répertoire build
RUN npm run build

# Création de l'image nginx basée sur l'image build
FROM nginx:alpine
#Copier le répertoire build, déjà crée, dans le container 
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
