// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// NAV scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 50 ? 'rgba(4,5,15,0.97)' : 'rgba(4,5,15,0.85)';
});

// PORTFOLIO FILTER
function filterPortfolio(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.portfolio-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.opacity = '1';
      card.style.transform = '';
    } else {
      card.style.opacity = '0.2';
      card.style.transform = 'scale(0.97)';
    }
  });
}

// FORMS
function submitContact() {
  const name = document.getElementById('firstName').value;
  const email = document.getElementById('email').value;
  if (!name || !email) {
    showToast('⚠️ Veuillez remplir les champs obligatoires');
    return;
  }
  document.getElementById('contactFormBody').style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';
  showToast('✅ Message envoyé avec succès !');
}

function submitDevis() {
  const name = document.getElementById('d-name').value;
  const email = document.getElementById('d-email').value;
  if (!name || !email) {
    showToast('⚠️ Veuillez remplir les champs obligatoires');
    return;
  }
  document.getElementById('devisSuccess').style.display = 'block';
  showToast('🎉 Demande de devis envoyée !');
}

// TOAST
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// MODAL
function openCalendly() { document.getElementById('calendlyModal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function bookSlot(slot) {
  closeModal('calendlyModal');
  showToast(`📅 RDV réservé : ${slot}`);
}

// DOWNLOAD BROCHURE
function downloadBrochure() {
  showToast('📄 Téléchargement de la brochure en cours...');
  // In prod: window.location.href = '/brochure-quantum.pdf';
}

// LANGUAGE TOGGLE
function setLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const msgs = {
    fr: '🇫🇷 Version française active',
    en: '🇬🇧 English version active',
    es: '🇪🇸 Versión en español activa'
  };
  showToast(msgs[lang]);
}

// HAMBURGER
function toggleMenu() {
  const ul = document.querySelector('nav ul');
  if (ul.style.display === 'flex') {
    ul.style.display = 'none';
  } else {
    ul.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:70px;left:0;right:0;background:var(--deep);padding:2rem;gap:1.5rem;z-index:100;border-bottom:1px solid var(--border);';
  }
}

// CLOSE MODALS ON OVERLAY CLICK
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});
