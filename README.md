# Quantum Data & AI - Site Web Professionnel

Un site web moderne et responsive pour Quantum Data & AI, une entreprise spécialisée dans la transformation digitale par la data science, l'intelligence artificielle et le business intelligence.

## Structure du Projet

```
quantum-data-ai/
├── index.html          # Page principale HTML
├── css/
│   └── styles.css      # Feuille de style CSS
├── js/
│   └── script.js       # Fonctionnalités JavaScript
├── assets/
│   ├── images/         # Images et illustrations
│   └── fonts/          # Polices personnalisées
└── README.md           # Documentation du projet
```

## Caractéristiques

### Design & UX
- **Thème sombre** moderne avec dégradé violet/cyan
- **Design responsive** adapté à tous les écrans
- **Animations fluides** et micro-interactions
- **Typographie moderne** avec Google Fonts (Syne, Space Mono, Inter)

### Sections du Site
- **Hero** : Accueil avec call-to-action et statistiques
- **Services** : Présentation des expertises (Data Science, IA, BI, Data Engineering)
- **À Propos** : Mission et valeurs de l'entreprise
- **Portfolio** : Réalisations avec système de filtrage
- **Blog** : Articles et ressources
- **Contact** : Formulaire de contact et informations
- **Devis** : Formulaire de demande de devis

### Fonctionnalités Interactives
- **Navigation sticky** avec effet de transparence au scroll
- **Filtre portfolio** dynamique
- **Formulaires fonctionnels** avec validation
- **Modal de prise de rendez-vous**
- **Notifications toast** pour les actions utilisateur
- **Sélecteur de langue** (FR/EN/ES)
- **Menu hamburger** pour mobile
- **Intégration WhatsApp** flottante

### Technologies Utilisées
- **HTML5** sémantique
- **CSS3** avec variables CSS et Grid/Flexbox
- **JavaScript vanilla** (ES6+)
- **Google Fonts** pour la typographie
- **SVG** pour les effets visuels

## Personnalisation

### Couleurs
Les couleurs sont définies via des variables CSS dans `css/styles.css` :
```css
:root {
  --midnight: #04050f;      /* Fond principal */
  --deep: #080b1a;          /* Fond secondaire */
  --violet: #7b2ff7;        /* Primaire */
  --cyan: #00e5ff;          /* Accent */
  /* ... */
}
```

### Contenu
- Modifier le contenu textuel directement dans `index.html`
- Adapter les informations de contact dans la section footer
- Personnaliser les projets dans la section portfolio

### Images
- Ajouter les images dans le dossier `assets/images/`
- Mettre à jour les chemins dans le HTML selon les besoins

## Déploiement

### Développement Local
1. Cloner le répertoire du projet
2. Lancer un serveur local :
   ```bash
   python -m http.server 8000
   ```
3. Ouvrir `http://localhost:8000` dans le navigateur

### Production
- Uploader les fichiers sur un serveur web
- Assurer que les chemins relatifs sont maintenus
- Configurer éventuellement un certificat SSL pour HTTPS

## Optimisations

### Performances
- CSS et JavaScript minifiés
- Images optimisées (format WebP recommandé)
- Chargement différé des images si nécessaire
- Cache HTTP configuré

### SEO
- Balises meta optimisées
- Structure HTML sémantique
- URLs propres
- Schema.org pour les données structurées

## Support et Maintenance

Pour toute modification ou question technique :
- Vérifier la console du navigateur pour les erreurs
- Tester sur différents navigateurs et appareils
- Maintenir les dépendances à jour

---

**© 2025 Quantum Data & AI - Tous droits réservés**
