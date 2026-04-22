# Déploiement Vercel + API PHP Externe

## Structure du déploiement

- **Frontend (Vercel)** : HTML/CSS/JS statique
- **Backend (Hébergement PHP)** : API PHP + MySQL

---

## Étape 1 : Déployer le Frontend sur Vercel

### 1.1 Préparation
```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login
```

### 1.2 Déploiement
```bash
# Dans le dossier du projet
cd c:\Users\User\CascadeProjects\quantum-data-ai

# Déployer
vercel --prod
```

Ou utilisez Git + Vercel Dashboard :
1. Poussez le code sur GitHub
2. Connectez le repo à Vercel
3. Déployez automatiquement

---

## Étape 2 : Déployer l'API PHP

### Option A : 000webhost (Gratuit)
1. Créez un compte sur [000webhost.com](https://www.000webhost.com)
2. Créez un nouveau site
3. Upload via File Manager :
   - Dossier `api/` → `public_html/api/`
   - Dossier `config/` → `public_html/config/`
4. Créez la base de données dans le panel
5. Modifiez `config/database.php` avec les credentials

### Option B : InfinityFree (Gratuit)
1. [infinityfree.net](https://www.infinityfree.net)
2. Même procédure que 000webhost

### Option C : Heroku (Payant mais fiable)
```bash
# Créer l'app
heroku create votre-api-quantum

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini

# Déployer
git push heroku main
```

---

## Étape 3 : Configuration

### 3.1 Modifier l'URL de l'API
Dans `js/config.js` :
```javascript
baseURL: 'https://votre-site.000webhostapp.com/api/',
```

### 3.2 Redéployer le frontend
```bash
vercel --prod
```

---

## URLs après déploiement

| Composant | URL locale | URL production |
|-----------|-----------|----------------|
| Frontend | http://localhost/quantum-data-ai/ | https://votre-site.vercel.app |
| API | http://localhost/quantum-data-ai/api/ | https://votre-api-php.com/api/ |

---

## Vérification

Testez le formulaire de contact après déploiement :
1. Remplissez le formulaire
2. Vérifiez dans la console (F12) la réponse de l'API
3. Vérifiez le dashboard admin de l'API PHP

---

## Troubleshooting

**Erreur CORS** :
L'API PHP doit avoir ces headers (déjà présents dans forms.php) :
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
```

**Formulaire ne fonctionne pas** :
- Vérifiez l'URL dans `js/config.js`
- Ouvrez la console (F12) → onglet Network
- Vérifiez la requête vers l'API

---

## Commandes utiles

```bash
# Vercel CLI
vercel --prod          # Déploiement production
vercel dev             # Mode développement
vercel logs            # Voir les logs

# Git
 git add .
 git commit -m "Deploy"
 git push origin main
```
