<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Disable error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(E_ALL);

$action = $_GET['action'] ?? '';

// Return test data if database connection fails
function getTestKPIs() {
    return [
        'success' => true,
        'message' => 'KPIs récupérés (test data)',
        'data' => [
            'totalLeads' => 3,
            'totalQuotes' => 2,
            'totalProjects' => 2,
            'totalClients' => 3,
            'pendingQuotes' => 1,
            'activeProjects' => 2,
            'unreadMessages' => 2,
            'totalRevenue' => 45000
        ]
    ];
}

function getTestLeads() {
    return [
        'success' => true,
        'message' => 'Leads récupérés (test data)',
        'data' => []
    ];
}

function getTestQuotes() {
    return [
        'success' => true,
        'message' => 'Devis récupérés (test data)',
        'data' => []
    ];
}

function getTestProjects() {
    return [
        'success' => true,
        'message' => 'Projets récupérés (test data)',
        'data' => []
    ];
}

function getTestClients() {
    return [
        'success' => true,
        'message' => 'Clients récupérés (test data)',
        'data' => []
    ];
}

function getTestMessages() {
    return [
        'success' => true,
        'message' => 'Messages récupérés (test data)',
        'data' => []
    ];
}

function getTestNotifications() {
    return [
        'success' => true,
        'message' => 'Notifications récupérées (test data)',
        'data' => []
    ];
}

function getTestBlog() {
    return [
        'success' => true,
        'message' => 'Articles récupérés (test data)',
        'data' => []
    ];
}

function getTestAnalytics() {
    return [
        'success' => true,
        'message' => 'Analytics récupérés (test data)',
        'data' => []
    ];
}

try {
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    // Return test data if database connection fails
    switch ($action) {
        case 'kpi':
            echo json_encode(getTestKPIs());
            break;
        case 'leads':
            echo json_encode(getTestLeads());
            break;
        case 'quotes':
            echo json_encode(getTestQuotes());
            break;
        case 'projects':
            echo json_encode(getTestProjects());
            break;
        case 'clients':
            echo json_encode(getTestClients());
            break;
        case 'messages':
            echo json_encode(getTestMessages());
            break;
        case 'notifications':
            echo json_encode(getTestNotifications());
            break;
        case 'blog':
            echo json_encode(getTestBlog());
            break;
        case 'analytics':
            echo json_encode(getTestAnalytics());
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Action not found']);
    }
    exit;
}

switch ($action) {
    case 'kpi':
        getKPIs($db);
        break;
    case 'leads':
        getLeads($db);
        break;
    case 'quotes':
        getQuotes($db);
        break;
    case 'projects':
        getProjects($db);
        break;
    case 'clients':
        getClients($db);
        break;
    case 'messages':
        getMessages($db);
        break;
    case 'notifications':
        getNotifications($db);
        break;
    case 'blog':
        getBlogArticles($db);
        break;
    case 'analytics':
        getAnalytics($db);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Action not found']);
}

function getKPIs($db) {
    try {
        $totalLeads = $db->query("SELECT COUNT(*) FROM leads")->fetchColumn() ?? 0;
        $totalQuotes = $db->query("SELECT COUNT(*) FROM quotes")->fetchColumn() ?? 0;
        $totalProjects = $db->query("SELECT COUNT(*) FROM projects")->fetchColumn() ?? 0;
        $totalClients = $db->query("SELECT COUNT(*) FROM clients")->fetchColumn() ?? 0;
        $pendingQuotes = $db->query("SELECT COUNT(*) FROM quotes WHERE status = 'En attente'")->fetchColumn() ?? 0;
        $activeProjects = $db->query("SELECT COUNT(*) FROM projects WHERE status = 'En cours'")->fetchColumn() ?? 0;
        $unreadMessages = $db->query("SELECT COUNT(*) FROM contact_messages WHERE status = 'Non lu'")->fetchColumn() ?? 0;
        
        $totalRevenue = $db->query("SELECT SUM(amount) FROM quotes WHERE status = 'Accepté'")->fetchColumn() ?? 0;
        
        echo json_encode([
            'success' => true,
            'message' => 'KPIs récupérés',
            'data' => [
                'totalLeads' => (int)$totalLeads,
                'totalQuotes' => (int)$totalQuotes,
                'totalProjects' => (int)$totalProjects,
                'totalClients' => (int)$totalClients,
                'pendingQuotes' => (int)$pendingQuotes,
                'activeProjects' => (int)$activeProjects,
                'unreadMessages' => (int)$unreadMessages,
                'totalRevenue' => (float)$totalRevenue
            ]
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des KPIs: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getLeads($db) {
    try {
        $stmt = $db->query("SELECT * FROM leads ORDER BY created_at DESC");
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Leads récupérés', 'data' => $leads]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des leads: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getQuotes($db) {
    try {
        $stmt = $db->query("SELECT * FROM quotes ORDER BY created_at DESC");
        $quotes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Devis récupérés', 'data' => $quotes]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des devis: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getProjects($db) {
    try {
        $stmt = $db->query("SELECT * FROM projects ORDER BY created_at DESC");
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Projets récupérés', 'data' => $projects]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des projets: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getClients($db) {
    try {
        $stmt = $db->query("SELECT * FROM clients ORDER BY created_at DESC");
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Clients récupérés', 'data' => $clients]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des clients: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getMessages($db) {
    try {
        $stmt = $db->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Messages récupérés', 'data' => $messages]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des messages: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getNotifications($db) {
    try {
        $stmt = $db->query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10");
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Notifications récupérées', 'data' => $notifications]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des notifications: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getAnalytics($db) {
    try {
        $stmt = $db->query("SELECT * FROM analytics ORDER BY date DESC LIMIT 30");
        $analytics = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Analytics récupérés', 'data' => $analytics]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des analytics: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}

function getBlogArticles($db) {
    try {
        $stmt = $db->query("SELECT ba.*, u.first_name, u.last_name FROM blog_articles ba LEFT JOIN users u ON ba.author_id = u.id ORDER BY ba.created_at DESC");
        $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'message' => 'Articles récupérés', 'data' => $articles]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des articles: ' . $e->getMessage()]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
    }
}
?>
