// Fonction pour obtenir un cookie par son nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Fonction pour vérifier l'authentification
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const addReviewSection = document.getElementById('add-review');

    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }

    if (addReviewSection) {
        addReviewSection.style.display = token ? 'block' : 'none';
    }

    return token;
}

// Gestion du formulaire de connexion
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://0.0.0.0:5001/api/v1/auth/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`;
                    window.location.href = 'index.html';
                } else {
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Échec de la connexion. Vérifiez vos identifiants.';
                }
            } catch (error) {
                console.error('Erreur:', error);
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
            }
        });
    }
});

// Fonction pour récupérer les lieux
async function fetchPlaces(token) {
    try {
        const response = await fetch('http://0.0.0.0:5001/api/v1/places/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            // Ajout de deux nouveaux appartements
            const additionalPlaces = [
                {
                    id: 'new1',
                    name: 'Appartement Vue Mer',
                    description: 'Magnifique appartement avec vue panoramique sur la mer. Proche des commerces et des transports.',
                    price_by_night: 120
                },
                {
                    id: 'new2',
                    name: 'Studio Moderne Centre-Ville',
                    description: 'Studio entièrement rénové au cœur de la ville. Idéal pour les séjours courts.',
                    price_by_night: 85
                }
            ];
            const allPlaces = [...places, ...additionalPlaces];
            displayPlaces(allPlaces);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des lieux:', error);
    }
}

// Fonction pour afficher les lieux
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '';
    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p>Prix par nuit: ${place.price_by_night}€</p>
            <a href="place.html?id=${place.id}" class="details-button">Voir les détails</a>
        `;
        placesList.appendChild(placeCard);
    });
}

// Fonction pour récupérer les détails d'un lieu
async function fetchPlaceDetails(placeId, token) {
    try {
        const response = await fetch(`http://0.0.0.0:5001/api/v1/places/${placeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
            fetchReviews(placeId, token);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
    }
}

// Fonction pour afficher les détails d'un lieu
function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) return;

    placeDetails.innerHTML = `
        <h2>${place.name}</h2>
        <div class="place-info">
            <p>${place.description}</p>
            <p>Prix par nuit: ${place.price_by_night}€</p>
            <p>Nombre de chambres: ${place.number_rooms}</p>
            <p>Nombre de salles de bain: ${place.number_bathrooms}</p>
            <p>Nombre maximum d'invités: ${place.max_guest}</p>
        </div>
    `;
}

// Fonction pour récupérer les avis
async function fetchReviews(placeId, token) {
    try {
        const response = await fetch(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const reviews = await response.json();
            displayReviews(reviews);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
    }
}

// Fonction pour afficher les avis
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    reviewsList.innerHTML = '';
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <p>${review.text}</p>
            <p>Par: ${review.user_id}</p>
        `;
        reviewsList.appendChild(reviewCard);
    });
}

// Gestion du formulaire d'ajout d'avis
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.querySelector('.add-review-form');
    const errorMessage = document.querySelector('.error-message');
    const placeIdInput = document.getElementById('place-id');

    // Récupérer l'ID de l'appartement depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('place_id');
    
    if (placeId && placeIdInput) {
        placeIdInput.value = placeId;
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rating = document.querySelector('input[name="rating"]:checked');
            const reviewText = document.querySelector('textarea[name="review"]').value.trim();
            const placeId = placeIdInput.value;

            if (!rating) {
                errorMessage.textContent = 'Veuillez sélectionner une note';
                errorMessage.style.display = 'block';
                return;
            }

            if (!reviewText) {
                errorMessage.textContent = 'Veuillez écrire votre avis';
                errorMessage.style.display = 'block';
                return;
            }

            // Ici, vous pouvez ajouter le code pour envoyer les données au serveur
            // Par exemple, en utilisant fetch() pour faire une requête POST
            const reviewData = {
                place_id: placeId,
                rating: rating.value,
                text: reviewText,
                user_id: 'Utilisateur', // À remplacer par l'ID réel de l'utilisateur connecté
                date: new Date().toLocaleDateString()
            };

            // Ajouter l'avis à la liste des avis existants
            const reviewsList = document.getElementById('reviews-list');
            if (reviewsList) {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-card';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <span class="review-rating">${'★'.repeat(rating.value)}${'☆'.repeat(5-rating.value)}</span>
                        <span class="review-date">${reviewData.date}</span>
                    </div>
                    <p class="review-text">${reviewText}</p>
                    <p class="review-author">Par: ${reviewData.user_id}</p>
                `;
                reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
            }

            // Simulation d'envoi réussi
            alert('Votre avis a été publié avec succès !');
            window.location.href = `place.html?id=${placeId}`;
        });
    }
});

// Gestion du filtre de prix
document.addEventListener('DOMContentLoaded', () => {
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const maxPrice = event.target.value;
            const places = document.querySelectorAll('.place-card');
            
            places.forEach(place => {
                const price = parseInt(place.querySelector('p').textContent.match(/\d+/)[0]);
                if (maxPrice === 'all' || price <= parseInt(maxPrice)) {
                    place.style.display = 'block';
                } else {
                    place.style.display = 'none';
                }
            });
        });
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuthentication();
    
    // Si on est sur la page d'accueil, charger les lieux
    if (document.getElementById('places-list')) {
        fetchPlaces(token);
    }
    
    // Si on est sur la page de détails, charger les détails du lieu
    const placeId = new URLSearchParams(window.location.search).get('id');
    if (placeId) {
        fetchPlaceDetails(placeId, token);
    }
});

// Fonction pour charger les détails d'un appartement
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page de détails
    const placeDetails = document.getElementById('place-details');
    if (placeDetails) {
        // Récupérer l'ID de l'appartement depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const placeId = urlParams.get('id');
        
        if (placeId) {
            // Charger les détails de l'appartement
            loadPlaceDetails(placeId);
            
            // Charger les avis
            const token = checkAuthentication();
            if (token) {
                fetchReviews(placeId, token);
            }
        } else {
            placeDetails.innerHTML = '<p>Aucun appartement sélectionné.</p>';
        }
    }
});

// Fonction pour charger les détails d'un appartement
function loadPlaceDetails(placeId) {
    // Données des appartements (simulation d'une base de données)
    const places = {
        '1': {
            name: 'Appartement Vue Mer',
            description: 'Magnifique appartement avec vue panoramique sur la mer. Proche des commerces et des transports.',
            price_by_night: 120,
            number_rooms: 2,
            number_bathrooms: 1,
            max_guest: 4,
            amenities: ['WiFi', 'Climatisation', 'Cuisine équipée', 'Balcon'],
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7d',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7e'
            ]
        },
        '2': {
            name: 'Studio Moderne Centre-Ville',
            description: 'Studio entièrement rénové au cœur de la ville. Idéal pour les séjours courts. Proche des monuments historiques et des restaurants.',
            price_by_night: 85,
            number_rooms: 1,
            number_bathrooms: 1,
            max_guest: 2,
            amenities: ['WiFi', 'Chauffage', 'Cuisine équipée', 'TV Smart', 'Machine à laver'],
            images: [
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7f',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7g',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7h',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7i'
            ]
        },
        '3': {
            name: 'Maison de Campagne',
            description: 'Charmante maison traditionnelle entourée de nature. Parfaite pour les familles et les amis.',
            price_by_night: 150,
            number_rooms: 3,
            number_bathrooms: 2,
            max_guest: 6,
            amenities: ['WiFi', 'Chauffage', 'Cuisine équipée', 'Jardin', 'Parking', 'BBQ'],
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7j',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7k',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7l',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7m'
            ]
        },
        '4': {
            name: 'Loft Industriel',
            description: 'Espace de vie moderne dans un ancien entrepôt rénové. Style industriel et confortable.',
            price_by_night: 110,
            number_rooms: 1,
            number_bathrooms: 1,
            max_guest: 3,
            amenities: ['WiFi', 'Climatisation', 'Cuisine équipée', 'TV Smart', 'Machine à laver', 'Bureau'],
            images: [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7n',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7o',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7p',
                'https://images.unsplash.com/photo-1560449017-7c4b3c4e8c7q'
            ]
        }
    };

    // Récupérer les détails de l'appartement
    const place = places[placeId];
    if (!place) {
        document.getElementById('place-details').innerHTML = '<p>Appartement non trouvé.</p>';
        return;
    }

    // Afficher les détails
    const placeDetails = document.getElementById('place-details');
    placeDetails.innerHTML = `
        <div class="place-info">
            <h2>${place.name}</h2>
            <div class="place-images">
                <img src="${place.images[0]}" alt="${place.name}" class="main-image">
                <div class="image-gallery">
                    ${place.images.slice(1).map(img => `<img src="${img}" alt="${place.name}">`).join('')}
                </div>
            </div>
            <p>${place.description}</p>
            <p>Prix par nuit: ${place.price_by_night}€</p>
            <p>Nombre de chambres: ${place.number_rooms}</p>
            <p>Nombre de salles de bain: ${place.number_bathrooms}</p>
            <p>Nombre maximum d'invités: ${place.max_guest}</p>
            <div class="amenities">
                <h3>Équipements</h3>
                <ul>
                    ${place.amenities.map(amenity => `<li>${amenity}</li>`).join('')}
                </ul>
            </div>
            <div class="add-review-button-container">
                <a href="add_review.html?place_id=${placeId}" class="btn">Ajouter un avis</a>
            </div>
        </div>
    `;

    // Mettre à jour le titre de la page
    document.title = `HBNB - ${place.name}`;
}

// Fonction pour charger les avis d'un appartement
function loadReviews(placeId) {
    // Données des avis (simulation d'une base de données)
    const reviews = {
        '1': [
            { text: 'Superbe appartement avec une vue magnifique sur la mer. L\'emplacement est parfait, proche de tout. Je recommande vivement !', user_id: 'Marie D.' },
            { text: 'Très bel appartement, propre et bien équipé. Le balcon est un vrai plus pour profiter de la vue. Nous reviendrons !', user_id: 'Jean P.' },
            { text: 'Excellent séjour dans cet appartement. La décoration est moderne et l\'espace est bien optimisé. Parfait pour un couple ou une petite famille.', user_id: 'Sophie L.' }
        ],
        '2': [
            { text: 'Studio parfaitement situé au centre-ville. Tout est à pied, et l\'appartement est très confortable malgré sa petite taille. Je recommande !', user_id: 'Thomas B.' },
            { text: 'Très bon rapport qualité-prix pour ce studio moderne. La rénovation est impeccable et l\'équipement est complet. Parfait pour un weekend en ville.', user_id: 'Claire M.' },
            { text: 'Studio idéal pour un séjour court. Bien équipé et très propre. L\'emplacement est parfait pour visiter la ville.', user_id: 'Lucas R.' }
        ],
        '3': [
            { text: 'Magnifique maison de campagne, très spacieuse et confortable. Le jardin est un vrai plus, surtout pour les enfants. Nous avons passé un excellent séjour !', user_id: 'Famille Martin' },
            { text: 'Maison traditionnelle avec tout le confort moderne. Parfaite pour un séjour en famille ou entre amis. Le BBQ dans le jardin a été très apprécié.', user_id: 'Pierre D.' },
            { text: 'Très belle maison, calme et reposante. Les chambres sont spacieuses et le salon est très agréable. Nous reviendrons avec plaisir.', user_id: 'Marie L.' }
        ],
        '4': [
            { text: 'Loft industriel très original et confortable. Le style est unique et l\'espace est bien optimisé. Parfait pour un séjour en ville.', user_id: 'Antoine B.' },
            { text: 'Très bel espace de vie, le style industriel est bien réussi. L\'appartement est fonctionnel et agréable à vivre. Je recommande !', user_id: 'Julie M.' },
            { text: 'Loft moderne et confortable, idéalement situé. La décoration est soignée et l\'espace est bien aménagé. Parfait pour un couple ou un petit groupe.', user_id: 'Nicolas P.' }
        ]
    };

    // Récupérer les avis de l'appartement
    const placeReviews = reviews[placeId] || [];
    
    // Afficher les avis
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        if (placeReviews.length > 0) {
            reviewsList.innerHTML = placeReviews.map(review => `
                <div class="review-card">
                    <p>${review.text}</p>
                    <p>Par: ${review.user_id}</p>
                </div>
            `).join('');
        } else {
            reviewsList.innerHTML = '<p>Aucun avis pour cet appartement.</p>';
        }
    }
}

// Mettre à jour la fonction de chargement des détails pour inclure les avis
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page de détails
    const placeDetails = document.getElementById('place-details');
    if (placeDetails) {
        // Récupérer l'ID de l'appartement depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const placeId = urlParams.get('id');
        
        if (placeId) {
            // Charger les détails de l'appartement
            loadPlaceDetails(placeId);
            
            // Charger les avis
            loadReviews(placeId);
            
            // Vérifier l'authentification pour afficher le formulaire d'avis
            const token = checkAuthentication();
            const addReviewSection = document.getElementById('add-review');
            if (addReviewSection) {
                addReviewSection.style.display = token ? 'block' : 'none';
            }
        } else {
            placeDetails.innerHTML = '<p>Aucun appartement sélectionné.</p>';
        }
    }
}); 
