# Base de Données Quantum Data & AI

## 📋 Vue d'ensemble

Ce projet inclut une base de données MySQL complète qui relie le site web principal et le dashboard administratif.

## 🗄️ Structure de la Base de Données

### Tables Principales

- **`users`** - Utilisateurs et administrateurs
- **`leads`** - Leads et prospects
- **`quotes`** - Devis et propositions commerciales
- **`projects`** - Projets en cours
- **`clients`** - Base clients
- **`blog_articles`** - Articles du blog
- **`portfolio_projects`** - Projets du portfolio
- **`contact_messages`** - Messages du formulaire de contact
- **`analytics`** - Statistiques et analytics
- **`notifications`** - Système de notifications
- **`settings`** - Paramètres du site

## 🚀 Installation

### Prérequis
- PHP 7.4+ ou 8.0+
- MySQL 5.7+ ou 8.0+
- Serveur web (Apache/Nginx)

### Étapes d'Installation

1. **Configurer la base de données**
   ```bash
   # Importer le schéma
   mysql -u root -p < database/schema.sql
   ```

2. **Utiliser le script d'installation**
   ```bash
   # Via le navigateur
   http://localhost/quantum-data-ai/setup/install.php
   ```

3. **Configurer la connexion**
   - Éditer `config/database.php`
   - Modifier les identifiants MySQL si nécessaire

## 🔐 Identifiants par Défaut

- **Admin Dashboard**: admin@quantumdataai.com / admin123
- **MySQL**: root / (pas de mot de passe par défaut)

## 📡 API Endpoints

### Dashboard API (`api/dashboard.php`)
- `GET ?action=kpi` - Données KPI du tableau de bord
- `GET ?action=leads` - Liste des leads
- `GET ?action=quotes` - Liste des devis
- `GET ?action=projects` - Liste des projets
- `GET ?action=clients` - Liste des clients
- `GET ?action=analytics` - Statistiques analytics
- `GET ?action=notifications` - Notifications
- `GET ?action=messages` - Messages de contact

### Forms API (`api/forms.php`)
- `POST action=contact` - Soumettre formulaire de contact
- `POST action=quote` - Soumettre demande de devis
- `POST action=newsletter` - S'inscrire à la newsletter

## 🔄 Flux de Données

### Site Web → Base de Données
1. **Formulaire de contact** → `contact_messages`
2. **Demande de devis** → `leads` + `quotes`
3. **Inscription newsletter** → `newsletter` (à implémenter)

### Base de Données → Dashboard
1. **KPIs** → Calculés en temps réel
2. **Leads/Devis/Projets** → Affichés dans les tableaux
3. **Notifications** → Système d'alertes
4. **Analytics** → Statistiques de visite

## 🛠️ Maintenance

### Sauvegardes
```bash
# Sauvegarder la base de données
mysqldump -u root -p quantum_data_ai > backup_$(date +%Y%m%d).sql

# Restaurer
mysql -u root -p quantum_data_ai < backup_20250110.sql
```

### Nettoyage
- Archiver les anciens messages (> 6 mois)
- Nettoyer les notifications lues (> 30 jours)
- Optimiser les tables mensuellement

## 🔒 Sécurité

- **Passwords** hashés avec bcrypt
- **Requêtes préparées** contre les injections SQL
- **CORS configuré** pour les API
- **.htaccess** pour protéger les fichiers sensibles

## 📊 Statistiques Incluses

- Nombre de leads par mois
- Taux de conversion
- Chiffre d'affaires par trimestre
- Pages les plus visitées
- Répartition géographique des visiteurs

## 🎯 Fonctionnalités Avancées

- **Système de notifications** en temps réel
- **Gestion des priorités** de leads
- **Suivi des projets** avec progression
- **Analytics intégré** avec graphiques
- **Export des données** en CSV

## 🐛 Dépannage

### Problèmes Communs
1. **Connexion MySQL refusée**
   - Vérifier les identifiants dans `config/database.php`
   - S'assurer que MySQL est démarré

2. **API qui ne répond pas**
   - Vérifier les permissions des fichiers
   - Activer les erreurs PHP pour le debugging

3. **Données qui ne s'affichent pas**
   - Vérifier la console du navigateur
   - Contrôler les réponses réseau dans les dev tools

### Logs et Debug
```php
// Activer le mode debug dans config/database.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## 📈 Évolutions Possibles

- Système de tickets de support
- Intégration avec des services externes (Mailchimp, Stripe)
- API REST complète pour applications mobiles
- Système de rapports automatisés
- Tableaux de bord clients

---

**Support**: Pour toute question technique, consultez la documentation ou contactez l'administrateur système.
