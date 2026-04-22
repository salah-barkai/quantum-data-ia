// Simple forms handler without database
class FormsHandler {
    constructor() {
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

    submitContactForm() {
        // Validate form
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!firstName || !lastName || !email || !message) {
            this.showToast('⚠️ Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Simulate success (no database)
        console.log('Contact form submitted:', {
            name: firstName + ' ' + lastName,
            email: email,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            message: message
        });

        // Show success message
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
        this.showToast('✅ Message envoyé avec succès !');

        // Reset form
        document.getElementById('contactForm').reset();
    }

    submitQuoteForm() {
        // Validate form
        const name = document.getElementById('d-name').value;
        const email = document.getElementById('d-email').value;
        const service = document.getElementById('d-service').value;
        const description = document.getElementById('d-description').value;

        if (!name || !email || !service || !description) {
            this.showToast('⚠️ Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Simulate success (no database)
        console.log('Quote form submitted:', {
            name: name,
            email: email,
            phone: document.getElementById('d-phone').value,
            company: document.getElementById('d-company').value,
            service: service,
            description: description,
            budget: document.getElementById('d-budget').value
        });

        // Show success message
        document.getElementById('devisForm').style.display = 'none';
        document.getElementById('devisSuccess').style.display = 'block';
        this.showToast('🎉 Demande de devis envoyée !');
        this.showToast('📋 Votre numéro de devis: #DV-2025-012');

        // Reset form
        document.getElementById('devisForm').reset();
    }

    submitNewsletterForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email) {
            this.showToast('⚠️ Veuillez entrer votre email');
            return;
        }

        // Simulate success (no database)
        console.log('Newsletter subscription:', email);
        this.showToast('✅ Inscription à la newsletter réussie !');
        form.reset();
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
