// login.js

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.querySelector("input[type='email']").value;
    const password = document.querySelector("input[type='password']").value;

    fetch("VOTRE_API_URL/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            document.cookie = `token=${data.token}; path=/`;
            window.location.href = 'index.html'; // Redirection vers la page principale
        } else {
            alert("Identifiants incorrects");
        }
    })
    .catch(error => {
        console.error("Erreur lors de la connexion:", error);
    });
});

