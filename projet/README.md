# Agile Practice Modeler


Un outil web graphique pour visualiser et modéliser des pratiques agiles sous forme de cartes interactives, dans le cadre du framework AMQuICk / Agilia.





## Description


Cet outil permet aux équipes agiles de :
- Créer et organiser des cartes de pratiques sur un espace de travail interactif (drag & drop)
- Modéliser les composants d'une pratique : activités, rôles, workproducts, goals, métriques, guidelines, pitfalls, benefits, contextes, critères de complétion, recommandations
- Gérer des équipes, des univers et des versions de pratiques
- Associer des méthodes et des pratiques entre elles
- Suivre les profils Big Five des membres d'équipe
- Exporter l'espace de travail en image PNG





## Stack technique

- **Frontend** : React (Create React App), React Router
- **Backend** : Node.js / Express
- **Base de données** : PostgreSQL (via `pg`)
- **Tests** : Jest + Supertest
- **Authentification** : bcrypt (hash des mots de passe)
- **Export image** : html2canvas





## Prérequis

- Node.js >= 16
- PostgreSQL
- npm







## Installation




### 1. Cloner le dépôt
```bash
git clone 
```



### 2. Configurer le backend

Dans le dossier backend, créer un fichier `.env` :
```env
DB_USER=your_user
DB_HOST=localhost
DB_NAME=your_database
DB_PASSWORD=your_password
DB_PORT=5432
```

Installer les dépendances et démarrer le serveur :
```bash
cd backend
npm install
node server.js
```



Le serveur démarre sur `http://localhost:5000`.




### 3. Configurer le frontend
```bash
cd src
npm install
npm start
```


L'application démarre sur `http://localhost:3000`.





## Scripts disponibles


### Frontend




`npm start`  Démarre l'application en mode développement 
`npm run build` Compile l'application pour la production 






### Backend


`node server.js`  Démarre le serveur Express 
`npm test` Lance les tests d'intégration (Jest + Supertest) 










## Fonctionnalités principales





### Espace de travail (`/espace-travail/:practiceVersionId`)

- Glisser-déposer des éléments (activités, rôles, goals, etc.) sur un canvas
- Sauvegarde automatique des positions en base de données
- Liens SVG entre la carte de pratique et les éléments
- Tooltips détaillés au survol
- Menus contextuels (clic droit) pour actions avancées
- Verrouillage de session (empêche l'édition simultanée)
- Export PNG via html2canvas



### Gestion des pratiques

- Création de pratiques et de versions de pratiques
- Association pratique : méthode
- Association entre versions de pratiques



### Gestion des équipes

- Création d'équipes et d'univers
- Ajout de membres
- Profils Big Five des membres








## API

Le backend expose une API REST sur `http://localhost:5000`. Principales routes :

GET `/pratiques`  Liste des pratiques 
POST `/practice`  Créer une pratique 
POST `/practiceVersion` Créer une version de pratique 
GET `/practiceVersion/:id/activities` Activités d'une version 
POST `/activity`  Ajouter une activité 
POST `/login`  Connexion 
POST `/register` Inscription 
GET `/universes/:teamId`  Univers d'une équipe 






## Tests

Les tests d'intégration couvrent toutes les routes de l'API avec mock de PostgreSQL
```bash
cd backend
npm test
```

