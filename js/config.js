// Configuration de l'API
// Pour le déploiement Vercel, remplacez par l'URL de votre API PHP externe
const API_CONFIG = {
    // URL de l'API PHP (à modifier avec votre hébergement PHP)
    // Exemples d'hébergements PHP gratuits :
    // - 000webhost: https://votre-site.000webhostapp.com/api/
    // - InfinityFree: https://votre-site.epizy.com/api/
    // - Heroku: https://votre-app.herokuapp.com/api/
    baseURL: './api/',  // Mode local (XAMPP)
    
    // Pour production, décommentez et modifiez :
    // baseURL: 'https://votre-api-php-externe.com/api/',
    
    // Timeout des requêtes (en ms)
    timeout: 10000
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
