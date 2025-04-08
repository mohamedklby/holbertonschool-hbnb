     Résumé du Projet - Web Client (Phase 4)

Dans ce projet, l'objectif est de créer une interface utilisateur interactive pour un système de gestion des lieux en utilisant HTML5, CSS3, et JavaScript ES6. Cette interface se connecte à un backend API développé dans les étapes précédentes du projet.

Objectifs Principaux :
Développement Front-End : Créer une interface simple et moderne permettant à l'utilisateur d'interagir avec l'application sans recharger la page.

Authentification : Implémenter un mécanisme de connexion permettant aux utilisateurs de s'authentifier via un formulaire de connexion. Le token JWT retourné lors de l'authentification sera utilisé pour gérer les sessions.

Interaction avec l'API Backend : Utiliser des requêtes AJAX ou la Fetch API pour récupérer des données depuis l'API, comme la liste des lieux, les détails d'un lieu, et les critiques des utilisateurs.

Gestion des critiques : Permettre aux utilisateurs authentifiés d'ajouter des critiques pour des lieux spécifiques.

Sécurisation de l'application : L'accès à certaines pages et fonctionnalités (comme l'ajout de critiques) sera restreint aux utilisateurs authentifiés.

Pages principales du projet :
Page de connexion (login.html) : Un formulaire pour se connecter avec un email et un mot de passe. Une fois connecté, un token JWT est stocké pour maintenir la session active.

Liste des lieux (index.html) : Une page affichant une liste de lieux sous forme de cartes. Chaque carte contient des informations de base comme le nom du lieu, son prix par nuit, et un bouton permettant de voir les détails.

Détails du lieu (place.html) : Cette page affiche des informations détaillées sur un lieu, comme son hôte, son prix, sa description, et ses commodités. Les critiques sont également affichées si elles existent.

Ajouter une critique (add_review.html) : Formulaire permettant à un utilisateur authentifié d'ajouter une critique pour un lieu spécifique.

Structure du projet :
HTML : Structure des pages (index.html, login.html, place.html).

CSS : Styles pour rendre l'interface attractive et responsive.

JavaScript : Gestion des interactions côté client, récupération des données via la Fetch API, et gestion de l'authentification.

Fonctionnalités principales :
Connexion/Inscription : L'utilisateur peut se connecter via un formulaire et être redirigé vers les autres pages de l'application une fois authentifié.

Affichage des lieux : La page principale affiche une liste dynamique de lieux, et l'utilisateur peut filtrer cette liste selon des critères comme le pays.

Détails du lieu : Lorsqu'un utilisateur clique sur un lieu, il peut voir les informations détaillées et les critiques existantes.

Ajout de critiques : L'utilisateur authentifié peut ajouter des critiques pour chaque lieu.

Objectifs d'apprentissage :
Utiliser HTML5, CSS3, et JavaScript ES6 dans un projet web réel.

Comprendre l'interaction avec une API backend via la Fetch API.

Implémenter un mécanisme d'authentification sécurisé avec des tokens JWT.

Apprendre à gérer les sessions utilisateur et les permissions côté client.

Concevoir une interface utilisateur dynamique qui améliore l'expérience sans avoir à recharger la page.

En résumé, ce projet permet de créer une application web interactive où les utilisateurs peuvent se connecter, voir une liste de lieux, obtenir des informations détaillées et ajouter des critiques, tout en interagissant avec un backend API pour récupérer et envoyer des données.
