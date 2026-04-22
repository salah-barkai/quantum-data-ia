// Database-integrated forms for the main website
class FormsHandler {
    constructor() {
        this.apiBase = './api/';
        this.init();
    }

    init() {
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitContactForm();
            });
        }

        // Quote form
        const quoteForm = document.getElementById('devisForm');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitQuoteForm();
            });
        }

        // Newsletter form (if exists)
        const newsletterForms = document.querySelectorAll('form[action*="newsletter"]');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitNewsletterForm(form);
            });
        });
    }

    async submitContactForm() {
        // Récupération des valeurs
        const firstName = document.getElementById('firstName')?.value?.trim() || '';
        const lastName = document.getElementById('lastName')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const phone = document.getElementById('phone')?.value?.trim() || '';
        const company = document.getElementById('company')?.value?.trim() || '';
        const subject = document.getElementById('subject')?.value?.trim() || 'Formulaire de contact';
        const message = document.getElementById('message')?.value?.trim() || '';
        
        // Validation
        if (!firstName || !lastName) {
            this.showToast('⚠️ Veuillez entrer votre prénom et nom');
            return;
        }
        if (!email) {
            this.showToast('⚠️ Veuillez entrer votre email');
            return;
        }
        if (!message) {
            this.showToast('⚠️ Veuillez entrer votre message');
            return;
        }
        
        const formData = new FormData();
        formData.append('action', 'contact');
        formData.append('name', firstName + ' ' + lastName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('company', company);
        formData.append('subject', subject);
        formData.append('message', message);

        try {
            const response = await fetch(`${this.apiBase}forms.php`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                // Show success message - cacher le formulaire
                const form = document.getElementById('contactForm');
                if (form) form.style.display = 'none';
                const success = document.getElementById('contactSuccess');
                if (success) success.style.display = 'block';
                this.showToast('✅ Message envoyé avec succès !');
                
                // Reset form après 3 secondes
                setTimeout(() => {
                    if (form) {
                        form.reset();
                        form.style.display = 'block';
                    }
                    if (success) success.style.display = 'none';
                }, 5000);
            } else {
                this.showToast('❌ Erreur: ' + (result.error || 'Veuillez réessayer'));
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            this.showToast('❌ Erreur réseau. Vérifiez votre connexion.');
        }
    }

    async submitQuoteForm() {
        // Récupération des valeurs
        const name = document.getElementById('d-name')?.value?.trim() || '';
        const email = document.getElementById('d-email')?.value?.trim() || '';
        const phone = document.getElementById('d-phone')?.value?.trim() || '';
        const company = document.getElementById('d-company')?.value?.trim() || '';
        const service = document.getElementById('d-service')?.value?.trim() || '';
        const description = document.getElementById('d-description')?.value?.trim() || '';
        const budget = document.getElementById('d-budget')?.value?.trim() || '';
        
        // Validation
        if (!name) {
            this.showToast('⚠️ Veuillez entrer votre nom');
            return;
        }
        if (!email) {
            this.showToast('⚠️ Veuillez entrer votre email');
            return;
        }
        if (!service) {
            this.showToast('⚠️ Veuillez sélectionner un type de service');
            return;
        }
        if (!description) {
            this.showToast('⚠️ Veuillez décrire votre projet');
            return;
        }
        
        const formData = new FormData();
        formData.append('action', 'quote');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('company', company);
        formData.append('service', service);
        formData.append('description', description);
        formData.append('budget', budget);

        try {
            const response = await fetch(`${this.apiBase}forms.php`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                // Show success message - cacher le formulaire
                const form = document.getElementById('devisForm');
                if (form) form.style.display = 'none';
                const success = document.getElementById('devisSuccess');
                if (success) {
                    success.style.display = 'block';
                    // Afficher le numéro de devis dans le message
                    if (result.data && result.data.quote_number) {
                        success.innerHTML = `🎉 Demande reçue !<br>Votre numéro: <strong>${result.data.quote_number}</strong><br>Vous recevrez notre proposition sous 48h.`;
                    }
                }
                this.showToast('🎉 Demande de devis envoyée !');
                
                // Reset form après 5 secondes
                setTimeout(() => {
                    if (form) {
                        form.reset();
                        form.style.display = 'block';
                    }
                    if (success) {
                        success.style.display = 'none';
                        success.innerHTML = '🎉 Demande reçue ! Vous recevrez notre proposition sous 48h ouvrables.';
                    }
                }, 8000);
            } else {
                this.showToast('❌ Erreur: ' + (result.error || 'Veuillez réessayer'));
            }
        } catch (error) {
            console.error('Error submitting quote form:', error);
            this.showToast('❌ Erreur réseau. Vérifiez votre connexion.');
        }
    }

    async submitNewsletterForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email) {
            this.showToast('⚠️ Veuillez entrer votre email');
            return;
        }

        const formData = new FormData();
        formData.append('action', 'newsletter');
        formData.append('email', email);

        try {
            const response = await fetch(`${this.apiBase}forms.php`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.showToast('✅ Inscription à la newsletter réussie !');
                form.reset();
            } else {
                this.showToast('❌ Erreur: ' + (result.error || 'Veuillez réessayer'));
            }
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            this.showToast('❌ Erreur lors de l\'inscription');
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3500);
        }
    }
}

// Initialize forms handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormsHandler();
});

// Override existing form functions for compatibility
function submitContact() {
    const formsHandler = new FormsHandler();
    formsHandler.submitContactForm();
}

function submitDevis() {
    const formsHandler = new FormsHandler();
    formsHandler.submitQuoteForm();
}
