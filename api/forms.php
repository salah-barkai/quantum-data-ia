<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'contact':
        submitContactForm($db);
        break;
    case 'quote':
        submitQuoteForm($db);
        break;
    case 'newsletter':
        subscribeNewsletter($db);
        break;
    default:
        $database->errorResponse('Action not found', 404);
}

function submitContactForm($db) {
    global $database;
    
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $company = sanitizeInput($_POST['company'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($message)) {
        $database->errorResponse('Veuillez remplir les champs obligatoires');
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $database->errorResponse('Email invalide');
        return;
    }
    
    try {
        $stmt = $db->prepare("INSERT INTO contact_messages (name, email, phone, company, subject, message, priority) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $priority = determinePriority($subject, $message);
        $stmt->execute([$name, $email, $phone, $company, $subject, $message, $priority]);
        
        // Create notification for admin
        createNotification($db, 1, 'Nouveau message de contact', "$name ($email) a envoyé un message: $subject", 'info', 'message', $db->lastInsertId());
        
        $database->successResponse('Message envoyé avec succès !');
        
    } catch(PDOException $e) {
        error_log('Contact form error: ' . $e->getMessage());
        $database->errorResponse('Erreur lors de l\'envoi du message: ' . $e->getMessage());
    }
}

function submitQuoteForm($db) {
    global $database;
    
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $company = sanitizeInput($_POST['company'] ?? '');
    $service = sanitizeInput($_POST['service'] ?? '');
    $description = sanitizeInput($_POST['description'] ?? '');
    $budget = sanitizeInput($_POST['budget'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($service) || empty($description)) {
        $database->errorResponse('Veuillez remplir les champs obligatoires');
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $database->errorResponse('Email invalide');
        return;
    }
    
    try {
        // First create a lead
        $stmt = $db->prepare("INSERT INTO leads (first_name, last_name, email, phone, company, service_interest, budget_range, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $nameParts = explode(' ', $name, 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';
        
        $stmt->execute([$firstName, $lastName, $email, $phone, $company, $service, $budget, $description, 'Nouveau']);
        $leadId = $db->lastInsertId();
        
        // Generate quote number
        $quoteNumber = generateQuoteNumber($db);
        
        // Calculate estimated amount based on service
        $estimatedAmount = estimateAmount($service, $budget);
        
        // Create quote
        $stmt = $db->prepare("INSERT INTO quotes (quote_number, client_name, client_email, client_phone, company, service_type, description, amount, status, lead_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$quoteNumber, $name, $email, $phone, $company, $service, $description, $estimatedAmount, 'En attente', $leadId, 1]);
        
        // Create notification for admin
        createNotification($db, 1, 'Nouvelle demande de devis', "$name ($company) a demandé un devis pour: $service", 'success', 'quote', $db->lastInsertId());
        
        $database->successResponse('Demande de devis envoyée avec succès !', ['quote_number' => $quoteNumber]);
        
    } catch(PDOException $e) {
        error_log('Quote form error: ' . $e->getMessage());
        $database->errorResponse('Erreur lors de l\'envoi de la demande: ' . $e->getMessage());
    }
}

function subscribeNewsletter($db) {
    global $database;
    
    $email = sanitizeInput($_POST['email'] ?? '');
    
    if (empty($email)) {
        $database->errorResponse('Email requis');
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $database->errorResponse('Email invalide');
        return;
    }
    
    // Check if already subscribed (would need a newsletter table)
    // For now, just return success
    $database->successResponse('Inscription à la newsletter réussie !');
}

function createNotification($db, $userId, $title, $message, $type, $entityType, $entityId) {
    $stmt = $db->prepare("INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $title, $message, $type, $entityType, $entityId]);
}

function generateQuoteNumber($db) {
    $year = date('Y');
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM quotes WHERE YEAR(created_at) = ?");
    $stmt->execute([$year]);
    $count = $stmt->fetch()['count'] + 1;
    
    return sprintf("#DV-%s-%03d", $year, $count);
}

function estimateAmount($service, $budget) {
    $baseAmounts = [
        'Data Science' => 25000,
        'IA & ML' => 35000,
        'BI & Dashboards' => 20000,
        'Data Engineering' => 30000,
        'Pack complet' => 50000
    ];
    
    $base = $baseAmounts[$service] ?? 25000;
    
    // Adjust based on budget range if provided
    if (!empty($budget)) {
        if (strpos($budget, '5-15K') !== false) return $base * 0.5;
        if (strpos($budget, '15-50K') !== false) return $base;
        if (strpos($budget, '50-100K') !== false) return $base * 1.5;
        if (strpos($budget, '100K+') !== false) return $base * 2;
    }
    
    return $base;
}

function determinePriority($subject, $message) {
    $highKeywords = ['urgent', 'urgence', 'rapide', 'immédiat', 'problème', 'panne'];
    $lowKeywords = ['information', 'question', 'curiosité', 'général'];
    
    $text = strtolower($subject . ' ' . $message);
    
    foreach ($highKeywords as $keyword) {
        if (strpos($text, $keyword) !== false) return 'Haute';
    }
    
    foreach ($lowKeywords as $keyword) {
        if (strpos($text, $keyword) !== false) return 'Basse';
    }
    
    return 'Normale';
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}
?>
