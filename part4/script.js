// script.js

// Fonction pour obtenir un cookie spécifique
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fonction pour vérifier l'authentification
function isAuthenticated() {
    const token = getCookie('token');
    return token !== undefined && token !== '';
}

// Exemple de redirection si non authentifié
if (!isAuthenticated()) {
    window.location.href = "login.html";
}

