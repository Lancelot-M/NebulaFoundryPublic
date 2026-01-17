import { getCookie } from '../idle/credentials_and_co.js';

// Fonction main
export function mining_functions() {
    listen_mining_button();
}

export function listen_mining_button() {
    document.getElementById('action-grid-mining').addEventListener(
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
            this.innerHTML = `
                <div class="action-icon">⏳</div>
                <div class="action-title">Chargement...</div>
                <div class="action-desc">Envoi de l'ordre au vaisseau</div>
            `;
            this.style.opacity = '0.7';
            this.style.cursor = 'wait';


            try {
            // Afficher un feedback visuel (optionnel)
            this.style.opacity = '0.5';
            this.style.pointerEvents = 'none';

            // Récupérer l'ID du joueur/ship (à adapter selon votre structure)
            const shipId = 1; // À remplacer par l'ID réel de votre ship

            // Appel PUT au serveur Django
//            const response = await fetch(`http://localhost:8000/home`, {
//                method: 'PUT',
//                headers: {
//                    'Accept': 'application/json',
//                    'Content-Type': 'application/json',
//                    'X-CSRFToken': getCookie('csrftoken')
//                },
//
//            });
//
//            if (!response.ok) {
//                throw new Error(`HTTP error! status: ${response.status}`);
//            }
//
//            const data = await response.json();
//            console.log('✅ Ordre mining envoyé:', data);

            // Message de succès avant redirection
            this.innerHTML = `
                <div class="action-icon">✅</div>
                <div class="action-title">Ordre envoyé !</div>
                <div class="action-desc">Redirection...</div>
            `;


            // Redirection après 500ms
            setTimeout(() => {
                window.location.replace('http://localhost:8000/home');
            }, 500);



        } catch (error) {
                console.error('❌ Erreur lors de l\'envoi de l\'ordre mining:', error);

                // Réactiver le bouton en cas d'erreur
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';

                // Afficher un message d'erreur à l'utilisateur (optionnel)
                alert('❌ Erreur: Impossible de lancer l\'ordre de mining. Veuillez réessayer.');
            }
    }
    );
}
