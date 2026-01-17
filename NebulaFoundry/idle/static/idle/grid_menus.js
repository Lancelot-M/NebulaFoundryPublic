import { getCookie } from '../idle/credentials_and_co.js';

export async function menu_functions() {
    /**
    Appels les fonctionnalitées liées aux menus
    Hors PIXI
    */
    listen_back_home_station();
}

export function listen_back_home_station(app) {
    document.getElementById('back_home_station').addEventListener(
        'click',
        async function() {
            // Empêcher les clics multiples
            if (this.dataset.processing === 'true') {
                return;
            }

            this.dataset.processing = 'true';

            // Sauvegarder le contenu original
            const originalHTML = this.innerHTML;

            // Afficher un loader
            this.innerHTML = `Retour en cous ...`;
            this.style.opacity = '0.7';
            this.style.cursor = 'wait';


            try {
            // Afficher un feedback visuel (optionnel)
            this.style.opacity = '0.5';
            this.style.pointerEvents = 'none';

            // Récupérer l'ID du joueur/ship (à adapter selon votre structure)
            const shipId = 1; // À remplacer par l'ID réel de votre ship

            // Appel PUT au serveur Django
            const response = await fetch(`http://localhost:8000/back_home_station`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },

            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response;
            console.log('✅ Ordre docking envoyé:', data);



        } catch (error) {
                console.error('❌ Erreur lors de l\'envoi de l\'ordre docking:', error);

                // Réactiver le bouton en cas d'erreur
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';

                // Afficher un message d'erreur à l'utilisateur (optionnel)
                //alert('❌ Erreur: Impossible de lancer l\'ordre de mining. Veuillez réessayer.');
            }
    }
    );
}