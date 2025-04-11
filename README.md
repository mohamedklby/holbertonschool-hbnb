# HBnB - Documentation Complète

## Table des matières
1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Installation](#installation)
4. [Utilisation](#utilisation)
5. [API Documentation](#api-documentation)
6. [FAQ](#faq)
7. [Exemples de Code](#exemples-de-code)

## Introduction

HBnB est une application web de location de logements qui permet aux utilisateurs de :
- Parcourir les annonces de logements
- Réserver des logements
- Gérer leurs réservations
- Publier des avis

Le projet est divisé en trois parties principales :
1. **Partie 1** : Interface en ligne de commande (CLI)
2. **Partie 2** : API REST avec Flask
3. **Partie 3** : Authentification et gestion des utilisateurs

## Architecture du Projet

### Structure des dossiers
```
holbertonschool-hbnb/
├── PART 1/                 # Interface CLI
├── PART 2/                 # API REST
│   ├── api/
│   │   ├── models/        # Modèles de données
│   │   ├── repositories/  # Gestion du stockage
│   │   ├── services/      # Logique métier
│   │   └── v1/           # Endpoints API
│   └── requirements.txt
└── PART 3/                 # Authentification
    ├── app/
    │   ├── api/          # Routes d'authentification
    │   ├── models/       # Modèles utilisateur
    │   └── repositories/ # Stockage utilisateurs
    └── requirements.txt
```

## Installation

### Prérequis
- Python 3.8+
- pip (gestionnaire de paquets Python)
- Git

### Étapes d'installation

1. Cloner le dépôt :
```bash
git clone https://github.com/aaymenb/holbertonschool-hbnb.git
cd holbertonschool-hbnb
```

2. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
```

3. Installer les dépendances :
```bash
# Pour la Partie 2 (API REST)
cd "PART 2"
pip install -r requirements.txt

# Pour la Partie 3 (Authentification)
cd "PART 3"
pip install -r requirements.txt
```

4. Configurer les variables d'environnement :
```bash
# Dans PART 3/.env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=votre_clé_secrète
DATABASE_URL=sqlite:///hbnb.db
```

## Utilisation

### Démarrer l'API REST (Partie 2)
```bash
cd "PART 2"
python run.py
```

### Démarrer l'API avec authentification (Partie 3)
```bash
cd "PART 3"
python run.py
```

L'API sera accessible à l'adresse : http://127.0.0.1:5000

## API Documentation

### Endpoints disponibles

#### Partie 2 - API REST
- `GET /api/v1/amenities` - Liste des commodités
- `GET /api/v1/places` - Liste des logements
- `GET /api/v1/reviews` - Liste des avis
- `GET /api/v1/users` - Liste des utilisateurs

#### Partie 3 - Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `GET /api/v1/auth/test` - Test de l'API

### Exemple de requête
```bash
# Créer un utilisateur
curl -X POST http://127.0.0.1:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Se connecter
curl -X POST http://127.0.0.1:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## FAQ

### Questions générales

**Q: Comment fonctionne l'authentification ?**
R: L'authentification utilise JWT (JSON Web Tokens). Lors de la connexion, l'API génère un token qui doit être inclus dans les en-têtes des requêtes suivantes.

**Q: Comment sécuriser mes routes ?**
R: Utilisez le décorateur `@jwt_required()` pour protéger les routes :
```python
@jwt_required()
def protected_route():
    return {"message": "Route protégée"}
```

**Q: Comment gérer les erreurs ?**
R: L'API utilise un système de gestion d'erreurs centralisé :
```python
@api.errorhandler(Exception)
def handle_error(error):
    return {"error": str(error)}, 500
```

### Questions techniques

**Q: Comment ajouter une nouvelle route ?**
R: Créez un nouveau fichier dans le dossier `api/v1/endpoints/` et enregistrez-le dans `__init__.py` :
```python
from flask_restx import Namespace, Resource

api = Namespace('nouvelle_route', description='Description de la route')

@api.route('/')
class NouvelleRoute(Resource):
    def get(self):
        return {"message": "Nouvelle route"}
```

**Q: Comment tester l'API ?**
R: Utilisez les outils comme Postman ou curl. Exemple avec curl :
```bash
# Test de la route /test
curl http://127.0.0.1:5000/api/v1/auth/test
```

## Exemples de Code

### Création d'un modèle
```python
from app.models.base import Base
from app import db

class User(Base):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
```

### Création d'une route protégée
```python
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('protected', description='Routes protégées')

@api.route('/profile')
class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        return {"user_id": current_user_id}
```

### Gestion des erreurs
```python
from flask import jsonify

def handle_not_found_error(error):
    return jsonify({
        "error": "Not Found",
        "message": "La ressource demandée n'existe pas"
    }), 404

app.register_error_handler(404, handle_not_found_error)
```

## Support

Pour toute question ou problème, n'hésitez pas à :
1. Consulter la documentation Swagger à http://127.0.0.1:5000/api/v1/
2. Vérifier les logs de l'application
3. Créer une issue sur GitHub

## Contribution

Pour contribuer au projet :
1. Fork le dépôt
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Créer une Pull Request
