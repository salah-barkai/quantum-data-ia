-- Quantum Data & AI Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS quantum_data_ai 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE quantum_data_ai;

-- Users table for admin authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Leads/Prospects table
CREATE TABLE leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    sector VARCHAR(100),
    service_interest ENUM('Data Science', 'IA & ML', 'BI & Dashboards', 'Data Engineering', 'Pack complet'),
    priority ENUM('Haute', 'Moyenne', 'Faible') DEFAULT 'Moyenne',
    budget_range VARCHAR(50),
    message TEXT,
    status ENUM('Nouveau', 'En cours', 'Converti', 'Perdu') DEFAULT 'Nouveau',
    source VARCHAR(100) DEFAULT 'Site web',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Quotes/Devis table
CREATE TABLE quotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_number VARCHAR(20) UNIQUE NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20),
    company VARCHAR(200),
    service_type ENUM('Data Science', 'IA & ML', 'BI & Dashboards', 'Data Engineering', 'Pack complet') NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    validity_date DATE,
    status ENUM('En attente', 'Envoyé', 'Accepté', 'Refusé', 'Expiré') DEFAULT 'En attente',
    lead_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(200) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    service_type ENUM('Data Science', 'IA & ML', 'BI & Dashboards', 'Data Engineering') NOT NULL,
    description TEXT,
    budget DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE,
    deadline DATE,
    actual_end_date DATE,
    status ENUM('Planifié', 'En cours', 'En pause', 'Terminé', 'Annulé') DEFAULT 'Planifié',
    progress_percentage INT DEFAULT 0,
    quote_id INT,
    project_manager INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id),
    FOREIGN KEY (project_manager) REFERENCES users(id)
);

-- Clients table
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    sector VARCHAR(100),
    country VARCHAR(100),
    website VARCHAR(200),
    total_projects INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    status ENUM('Actif', 'Inactif') DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog articles table
CREATE TABLE blog_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100) NOT NULL,
    author_id INT NOT NULL,
    featured_image VARCHAR(300),
    meta_title VARCHAR(200),
    meta_description VARCHAR(300),
    status ENUM('Brouillon', 'Publié', 'Archivé') DEFAULT 'Brouillon',
    views_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Portfolio projects table
CREATE TABLE portfolio_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    category ENUM('IA', 'BI', 'Data Science', 'Data Engineering') NOT NULL,
    description TEXT NOT NULL,
    key_result VARCHAR(200),
    technologies TEXT,
    project_url VARCHAR(300),
    image_url VARCHAR(300),
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('Non lu', 'Lu', 'Répondu') DEFAULT 'Non lu',
    priority ENUM('Haute', 'Normale', 'Basse') DEFAULT 'Normale',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Analytics data table
CREATE TABLE analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    leads_count INT DEFAULT 0,
    quotes_count INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    related_entity_type ENUM('lead', 'quote', 'project', 'client', 'message', 'blog'),
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Settings table
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@quantumdataai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur Quantum', 'admin');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES 
('company_name', 'Quantum Data & AI', 'string', 'Nom de l''entreprise'),
('company_email', 'contact@quantumdataai.com', 'string', 'Email de contact'),
('company_phone', '+235 61 00 59 53', 'string', 'Numéro de téléphone'),
('company_whatsapp', '+23561005953', 'string', 'Numéro WhatsApp'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance'),
('blog_active', 'true', 'boolean', 'Blog actif');

-- Insert sample data for demonstration
INSERT INTO leads (first_name, last_name, email, phone, company, sector, service_interest, priority, budget_range, message, status) VALUES 
('Amina', 'Sarr', 'a.sarr@agrochad.td', '+235 60 12 34 56', 'Société AgroChad', 'Agriculture', 'Data Science', 'Haute', '15-50K$', 'Bonjour, je souhaite avoir plus d''informations sur vos services de Data Science pour notre secteur agricole...', 'Nouveau'),
('Ibrahim', 'Oumar', 'i.oumar@bnt.td', '+235 60 23 45 67', 'Banque Nationale', 'Finance', 'IA & ML', 'Moyenne', '50-100K$', 'Suite à notre échange, je soumets officiellement une demande pour l''implémentation d''un dashboard...', 'En cours'),
('Kofi', 'Diallo', 'k.diallo@telecomtchad.td', '+235 60 34 56 78', 'TelecomTchad', 'Télécoms', 'BI & Dashboards', 'Moyenne', '25-75K$', 'Excellent travail sur le dashboard ! Notre équipe est très satisfaite. Pouvons-nous planifier la phase 2 ?', 'Converti');

INSERT INTO quotes (quote_number, client_name, client_email, client_phone, company, service_type, description, amount, status, created_by) VALUES 
('#DV-2025-011', 'Banque Nationale', 'i.oumar@bnt.td', '+235 60 23 45 67', 'Banque Nationale', 'BI & Dashboards', 'Dashboard exécutif avec 12 KPIs temps réel', 45000.00, 'Accepté', 1),
('#DV-2025-010', 'AgroChad SARL', 'a.sarr@agrochad.td', '+235 60 12 34 56', 'AgroChad SARL', 'Data Science', 'Analyse de données et modélisation prédictive', 8200.00, 'Refusé', 1);

INSERT INTO projects (project_name, client_name, service_type, description, budget, start_date, deadline, status, progress_percentage, project_manager) VALUES 
('Dashboard Bancaire', 'Banque Nationale', 'BI & Dashboards', 'Tableau de bord exécutif avec KPIs temps réel', 45000.00, '2024-12-01', '2025-01-15', 'En cours', 75, 1),
('Chatbot NLP Support', 'TelecomTchad', 'Intelligence Artificielle', 'Chatbot basé sur NLP pour le support client', 35000.00, '2024-12-15', '2025-02-01', 'En cours', 40, 1),
('Pipeline ETL Santé', 'ONG Santé Plus', 'Data Engineering', 'Pipeline ETL pour les données de santé', 15000.00, '2024-11-01', '2025-01-12', 'En cours', 95, 1);

INSERT INTO clients (company_name, contact_person, email, phone, sector, country, total_projects, total_revenue) VALUES 
('Banque Nationale du Tchad', 'Ibrahim Oumar', 'b.contact@bnt.td', '+235 60 23 45 67', 'Finance & Banque', 'Tchad', 3, 67000.00),
('TelecomTchad', 'Kofi Diallo', 'contact@telecomtchad.td', '+235 60 34 56 78', 'Télécoms', 'Tchad', 2, 34500.00),
('Santé Plus ONG', 'Dr. Marie Toure', 'admin@santeplus.org', '+235 60 45 67 89', 'Santé / ONG', 'Tchad', 1, 8200.00);

INSERT INTO blog_articles (title, slug, content, excerpt, category, author_id, status, views_count, published_at) VALUES 
('Comment les LLMs transforment le business en Afrique', 'llms-business-africa', 'Les grands modèles de langage révolutionnent le paysage business africain...', 'Découvrez comment l''IA générative transforme les entreprises africaines', 'IA Générative', 1, 'Publié', 1247, '2025-01-08 10:00:00'),
('5 pipelines ETL indispensables pour les PME africaines', 'etl-pipelines-pme-africa', 'Les pipelines ETL sont essentiels pour la gestion des données...', 'Guide complet pour mettre en place des pipelines ETL efficaces', 'Data Engineering', 1, 'Publié', 834, '2025-01-02 14:30:00'),
('Prédiction de churn : guide complet', 'prediction-churn-guide', 'De la collecte des données au déploiement du modèle en production, tout ce que vous devez savoir sur la prédiction de churn.', 'Guide complet pour implémenter un système de prédiction de churn efficace', 'Machine Learning', 1, 'Publié', 567, '2025-01-03 09:00:00'),
('Dashboards KPI : les 10 métriques essentielles', 'dashboards-kpi-metrics', 'Quels indicateurs surveiller pour piloter votre croissance et prendre des décisions éclairées avec vos dashboards.', 'Les 10 métriques KPI les plus importantes pour vos dashboards business', 'Power BI', 1, 'Publié', 423, '2025-01-01 16:00:00');

INSERT INTO portfolio_projects (title, client_name, category, description, key_result, is_visible) VALUES 
('Chatbot bancaire NLP', 'Banque Nationale', 'IA', 'Chatbot intelligent pour le service client bancaire', '-40% appels support', TRUE),
('Dashboard exécutif Télécoms', 'TelecomTchad', 'BI', 'Tableau de bord avec indicateurs de performance temps réel', '12 KPIs temps réel', TRUE),
('Modèle prédictif churn', 'Assurance Africa', 'Data Science', 'Modèle de machine learning pour prédire le churn clients', '92% précision', FALSE);

INSERT INTO contact_messages (name, email, phone, company, subject, message, status, priority) VALUES 
('Amina Sarr', 'a.sarr@agrochad.td', '+235 60 12 34 56', 'Société AgroChad', 'Demande d''informations Data Science', 'Bonjour, je souhaite avoir plus d''informations sur vos services de Data Science pour notre secteur agricole...', 'Non lu', 'Haute'),
('Ibrahim Oumar', 'i.oumar@bnt.td', '+235 60 23 45 67', 'Banque Nationale', 'Dashboard exécutif', 'Suite à notre échange, je soumets officiellement une demande pour l''implémentation d''un dashboard...', 'Non lu', 'Haute'),
('Kofi Diallo', 'k.diallo@telecomtchad.td', '+235 60 34 56 78', 'TelecomTchad', 'Feedback projet', 'Excellent travail sur le dashboard ! Notre équipe est très satisfaite. Pouvons-nous planifier la phase 2 ?', 'Lu', 'Normale');

INSERT INTO analytics (date, page_views, unique_visitors, leads_count, quotes_count, conversion_rate, bounce_rate) VALUES 
('2025-01-08', 1247, 4231, 2, 1, 4.2, 38.0),
('2025-01-07', 1156, 3987, 1, 0, 3.8, 39.5),
('2025-01-06', 1089, 3765, 3, 2, 4.5, 37.2);

INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id, is_read) VALUES 
(1, 'Nouveau lead qualifié reçu', 'Amina Sarr de Société AgroChad a soumis un formulaire de contact avec un budget estimé à 15-50K$.', 'success', 'lead', 1, FALSE),
(1, 'Devis #DV-2025-011 accepté !', 'La Banque Nationale a accepté votre devis de 45,000$. Vous pouvez maintenant démarrer le projet.', 'success', 'quote', 1, FALSE),
(1, 'Record de trafic sur le blog', 'L''article "LLMs en Afrique" a atteint 1,247 vues en 48h — votre meilleur article de l''année !', 'info', 'blog', 1, FALSE),
(1, 'Rappel : Deadline projet approche', 'Le projet "Pipeline ETL Santé" doit être livré dans 3 jours. Progression actuelle : 95%.', 'warning', 'project', 3, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_blog_articles_status ON blog_articles(status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_analytics_date ON analytics(date);
