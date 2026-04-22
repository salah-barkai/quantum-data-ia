<?php
/**
 * Quantum Data & AI Database Installation Script
 * This script will create the database and populate it with initial data
 */

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'quantum_data_ai';

echo "<h2>🚀 Installation de la base de données Quantum Data & AI</h2>\n";

try {
    // Connect to MySQL without database
    $pdo = new PDO("mysql:host=$db_host", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connexion à MySQL réussie<br>\n";
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Base de données '$db_name' créée<br>\n";
    
    // Select the database
    $pdo->exec("USE `$db_name`");
    
    // Read and execute schema
    $schema = file_get_contents('../database/schema.sql');
    
    // Split schema into individual statements
    $statements = array_filter(array_map('trim', explode(';', $schema)));
    
    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                echo "⚠️ Erreur dans la requête: " . $e->getMessage() . "<br>\n";
                echo "Requête: " . substr($statement, 0, 100) . "...<br>\n";
            }
        }
    }
    
    echo "✅ Schéma de la base de données créé<br>\n";
    echo "✅ Données initiales insérées<br>\n";
    
    // Verify installation
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "✅ Tables créées: " . implode(', ', $tables) . "<br>\n";
    
    // Check admin user
    $adminCount = $pdo->query("SELECT COUNT(*) FROM users WHERE username = 'admin'")->fetchColumn();
    if ($adminCount > 0) {
        echo "✅ Utilisateur administrateur créé<br>\n";
        echo "📋 Identifiants: admin@quantumdataai.com / admin123<br>\n";
    }
    
    echo "<h3>🎉 Installation terminée avec succès !</h3>\n";
    echo "<p><a href='../admin.html'>🔐 Accéder au dashboard admin</a></p>\n";
    echo "<p><a href='../index.html'>🌐 Voir le site web</a></p>\n";
    
    // Create .htaccess for API security
    $htaccess = "Options -Indexes\n";
    $htaccess .= "# Restrict access to config files\n";
    $htaccess .= "<Files \"*.php\">\n";
    $htaccess .= "    Require all denied\n";
    $htaccess .= "</Files>\n";
    $htaccess .= "# Allow API access\n";
    $htaccess .= "<Files \"api/*.php\">\n";
    $htaccess .= "    Require all granted\n";
    $htaccess .= "</Files>\n";
    
    file_put_contents('../.htaccess', $htaccess);
    echo "✅ Fichier .htaccess de sécurité créé<br>\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur lors de l'installation: " . $e->getMessage() . "<br>\n";
    echo "<p>Vérifiez vos paramètres de connexion MySQL et réessayez.</p>\n";
}
?>
