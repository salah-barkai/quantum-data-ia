// API Configuration
const API_BASE = './api/';

// LOGIN
function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pwd = document.getElementById('loginPwd').value;
  if (email === 'admin@quantumdataai.com' && pwd === 'admin123') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'block';
    showToast('👋 Bienvenue Administrateur !');
    loadDashboardData();
    startAutoSync(); // Start automatic synchronization
  } else {
    showToast('❌ Identifiants incorrects');
  }
}

document.getElementById('loginPwd').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') doLogin();
});

// NAVIGATION
function showPage(id, navItem) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navItem) navItem.classList.add('active');

  const titles = {
    dashboard: ['Tableau de bord', 'Dashboard'],
    leads: ['Leads & Prospects', 'Leads'],
    devis: ['Gestion des Devis', 'Devis'],
    projets: ['Projets', 'Projets'],
    clients: ['Base Clients', 'Clients'],
    blog: ['Blog & Articles', 'Blog'],
    portfolio: ['Portfolio', 'Portfolio'],
    messages: ['Messages', 'Messages'],
    analytics: ['Analytics SEO', 'Analytics'],
    notifications: ['Notifications', 'Notifications'],
    settings: ['Paramètres', 'Settings'],
  };

  if (titles[id]) {
    document.getElementById('pageTitle').textContent = titles[id][0];
    document.getElementById('pagePath').textContent = titles[id][1];
  }

  // Load data for the current page
  loadPageData(id);
}

// MODALS
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// TOAST
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ADD LEAD
function addLead() {
  closeModal('addLeadModal');
  showToast('✅ Lead ajouté avec succès !');
}

// EXPORT
function exportData() {
  showToast('📥 Export CSV en cours...');
}

// LOGOUT
function doLogout() {
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  stopAutoSync(); // Stop automatic synchronization
  showToast('🚪 Déconnexion réussie');
}

// PERIOD BUTTONS
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.chart-period-btns').querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showToast('📊 Période mise à jour : ' + btn.textContent);
  });
});

// API FUNCTIONS
let syncInterval = null;

function startAutoSync() {
  // Clear existing interval if any
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Sync every 30 seconds
  syncInterval = setInterval(() => {
    loadDashboardData();
    // Reload current page data
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      const pageId = activePage.id.replace('page-', '');
      loadPageData(pageId);
    }
  }, 30000); // 30 seconds
  
  console.log('Auto-sync started (30s interval)');
}

function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('Auto-sync stopped');
  }
}

async function loadDashboardData() {
  try {
    // Load KPIs from real database
    const kpiResponse = await fetch(`${API_BASE}dashboard.php?action=kpi`);
    const kpiData = await kpiResponse.json();
    if (kpiData.success) {
      updateKPIs(kpiData.data);
      console.log('✅ KPIs chargés depuis la base de données:', kpiData.data);
    } else {
      console.error('❌ Erreur KPIs:', kpiData.message);
      showToast('❌ Erreur: ' + kpiData.message);
    }

    // Load notifications from real database
    const notifResponse = await fetch(`${API_BASE}dashboard.php?action=notifications`);
    const notifData = await notifResponse.json();
    if (notifData.success) {
      updateNotifications(notifData.data);
      console.log('✅ Notifications chargées:', notifData.data.length);
    } else {
      console.error('❌ Erreur notifications:', notifData.message);
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('❌ Erreur de connexion à la base de données');
  }
}

// Test data for fallback
function getTestKPIData() {
  return {
    totalLeads: 3,
    totalQuotes: 2,
    totalProjects: 1,
    totalClients: 1,
    pendingQuotes: 1,
    activeProjects: 1,
    unreadMessages: 2,
    totalRevenue: 15000
  };
}

function getTestNotifications() {
  return [
    {
      type: 'success',
      title: 'Nouveau lead reçu',
      message: 'John Doe (john@example.com) - Data Science',
      created_at: new Date().toISOString(),
      is_read: false
    },
    {
      type: 'info',
      title: 'Devis accepté',
      message: 'DEV-2025-001 - Projet Chatbot NLP',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_read: true
    }
  ];
}

function updateKPIs(data) {
  // Update KPI cards if they exist
  const kpiElements = {
    totalLeads: document.querySelector('[data-kpi="leads"]'),
    totalQuotes: document.querySelector('[data-kpi="quotes"]'),
    totalProjects: document.querySelector('[data-kpi="projects"]'),
    totalClients: document.querySelector('[data-kpi="clients"]'),
    pendingQuotes: document.querySelector('[data-kpi="pending-quotes"]'),
    activeProjects: document.querySelector('[data-kpi="active-projects"]'),
    unreadMessages: document.querySelector('[data-kpi="unread-messages"]'),
    totalRevenue: document.querySelector('[data-kpi="revenue"]')
  };

  if (kpiElements.totalLeads) kpiElements.totalLeads.textContent = data.totalLeads;
  if (kpiElements.totalQuotes) kpiElements.totalQuotes.textContent = data.totalQuotes;
  if (kpiElements.totalProjects) kpiElements.totalProjects.textContent = data.totalProjects;
  if (kpiElements.totalClients) kpiElements.totalClients.textContent = data.totalClients;
  if (kpiElements.pendingQuotes) kpiElements.pendingQuotes.textContent = data.pendingQuotes + ' en attente';
  if (kpiElements.activeProjects) kpiElements.activeProjects.textContent = data.activeProjects;
  if (kpiElements.unreadMessages) kpiElements.unreadMessages.textContent = data.unreadMessages;
  if (kpiElements.totalRevenue) kpiElements.totalRevenue.textContent = '$' + data.totalRevenue.toLocaleString();
  
  // Update counts in titles
  const leadsCount = document.getElementById('leadsCount');
  if (leadsCount) leadsCount.textContent = '(' + data.totalLeads + ')';
  
  const quotesCount = document.getElementById('quotesCount');
  if (quotesCount) quotesCount.textContent = '(' + data.totalQuotes + ')';
  
  const clientsCount = document.getElementById('clientsCount');
  if (clientsCount) clientsCount.textContent = '(' + data.totalClients + ')';
  
  const messagesCount = document.getElementById('messagesCount');
  if (messagesCount) messagesCount.textContent = '(' + data.unreadMessages + ' non lus)';
}

function updateNotifications(data) {
  const notifList = document.getElementById('notificationsList');
  if (notifList) {
    notifList.innerHTML = '';
    data.forEach(notif => {
      const item = document.createElement('div');
      item.className = `notif-item ${notif.is_read ? '' : 'unread'}`;
      
      // Get icon based on notification type
      const icon = getNotificationIcon(notif.type);
      const bgColor = getNotificationBgColor(notif.type);
      
      item.innerHTML = `
        <div class="notif-icon" style="background:${bgColor};">${icon}</div>
        <div class="notif-body">
          <div class="notif-title">${notif.title}</div>
          <div class="notif-desc">${notif.message}</div>
          <div class="notif-time">${formatNotificationTime(notif.created_at)}</div>
        </div>
        ${!notif.is_read ? '<div class="unread-dot"></div>' : ''}
      `;
      notifList.appendChild(item);
    });
    
    // Update notification count
    const unreadCount = data.filter(n => !n.is_read).length;
    const notifCount = document.getElementById('notificationsCount');
    if (notifCount) {
      notifCount.textContent = `(${unreadCount} nouvelles)`;
    }
  }
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'info': return 'ℹ️';
    default: return '🔔';
  }
}

function getNotificationBgColor(type) {
  switch (type) {
    case 'success': return 'rgba(0,230,118,.15)';
    case 'warning': return 'rgba(255,152,0,.12)';
    case 'error': return 'rgba(244,67,54,.15)';
    case 'info': return 'rgba(0,229,255,.12)';
    default: return 'rgba(123,47,247,.15)';
  }
}

function formatNotificationTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} minutes`;
  if (diffHours < 24) return `Il y a ${diffHours} heures`;
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR');
}

async function loadPageData(page) {
  try {
    let action = '';
    switch (page) {
      case 'leads': action = 'leads'; break;
      case 'devis': action = 'quotes'; break;
      case 'projets': action = 'projects'; break;
      case 'clients': action = 'clients'; break;
      case 'messages': action = 'messages'; break;
      case 'notifications': action = 'notifications'; break;
      case 'blog': action = 'blog'; break;
      case 'analytics': action = 'analytics'; break;
    }

    if (action) {
      const response = await fetch(`${API_BASE}dashboard.php?action=${action}`);
      const result = await response.json();
      if (result.success) {
        renderPageData(page, result.data);
        console.log(`✅ ${page} chargé:`, result.data.length || result.data, 'éléments');
      } else {
        console.error(`❌ Erreur ${page}:`, result.message);
        showToast(`❌ Erreur: ${result.message}`);
      }
    }
  } catch (error) {
    console.error(`Error loading ${page} data:`, error);
    showToast(`❌ Erreur de connexion pour ${page}`);
  }
}

function getTestDataForPage(page) {
  switch (page) {
    case 'leads':
      return [
        { first_name: 'John', last_name: 'Doe', company: 'Tech Corp', email: 'john@example.com', service_interest: 'Data Science', priority: 'Haute', status: 'Nouveau' },
        { first_name: 'Jane', last_name: 'Smith', company: 'Finance Inc', email: 'jane@example.com', service_interest: 'IA', priority: 'Moyenne', status: 'En cours' },
        { first_name: 'Bob', last_name: 'Martin', company: 'Retail SA', email: 'bob@example.com', service_interest: 'BI', priority: 'Faible', status: 'Converti' }
      ];
    case 'devis':
      return [
        { quote_number: 'DEV-2025-001', client_name: 'Tech Corp', company: 'Tech Corp', service_type: 'Chatbot NLP', amount: '15000', status: 'Accepté', created_at: '2025-01-15' },
        { quote_number: 'DEV-2025-002', client_name: 'Finance Inc', company: 'Finance Inc', service_type: 'Dashboard BI', amount: '8000', status: 'En attente', created_at: '2025-01-14' }
      ];
    case 'projets':
      return [
        { project_name: 'Chatbot Bancaire', client_name: 'Tech Corp', service_type: 'IA', progress_percentage: 75, deadline: '2025-03-15', status: 'En cours' }
      ];
    case 'clients':
      return [
        { company_name: 'Tech Corp', sector: 'Technologie', total_projects: 2, total_revenue: '25000', email: 'contact@techcorp.com', created_at: '2025-01-10' }
      ];
    case 'messages':
      return [
        { name: 'Alice Dupont', company: 'Consulting SA', message: 'Je souhaite avoir un devis pour un projet de data science.', status: 'Non lu', created_at: '2025-01-15T10:30:00' },
        { name: 'Marc Leroy', message: 'Merci pour votre réponse rapide.', status: 'Lu', created_at: '2025-01-14T16:45:00' }
      ];
    case 'blog':
      return [
        { title: 'Comment les LLMs transforment l\'analyse business', category: 'IA Générative', first_name: 'Admin', last_name: '', views_count: 125, status: 'Publié', created_at: '2025-01-08', id: 1 },
        { title: '5 pipelines ETL indispensables', category: 'Data Engineering', first_name: 'Admin', last_name: '', views_count: 89, status: 'Publié', created_at: '2025-01-05', id: 2 }
      ];
    default:
      return [];
  }
}

function renderPageData(page, data) {
  // Render data based on page type
  switch (page) {
    case 'leads':
      renderLeadsTable(data);
      break;
    case 'devis':
      renderQuotesTable(data);
      break;
    case 'projets':
      renderProjectsTable(data);
      break;
    case 'clients':
      renderClientsTable(data);
      break;
    case 'messages':
      renderMessagesList(data);
      break;
    case 'notifications':
      updateNotifications(data);
      break;
    case 'blog':
      renderBlogTable(data);
      break;
  }
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  leads.forEach(lead => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="td-name">${lead.first_name} ${lead.last_name}</div></td>
      <td><div class="td-company">${lead.company || '-'}</div></td>
      <td>${lead.service_interest}</td>
      <td style="color:var(--muted);font-size:.78rem;">${lead.email}</td>
      <td><span class="priority ${getPriorityClass(lead.priority)}">${getPriorityEmoji(lead.priority)} ${lead.priority}</span></td>
      <td><span class="status-badge ${getStatusClass(lead.status)}">${lead.status}</span></td>
      <td><div class="row-actions"><button class="row-btn" onclick="showToast('👁️ Détail lead')">👁️</button><button class="row-btn" onclick="showToast('✏️ Édition en cours')">✏️</button><button class="row-btn" onclick="showToast('📧 Email envoyé')">📧</button></div></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderQuotesTable(quotes) {
  const tbody = document.getElementById('quotesTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  quotes.forEach(quote => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:'Space Mono',monospace;font-size:.75rem;color:var(--cyan);">${quote.quote_number}</td>
      <td><div class="td-name">${quote.client_name}</div><div class="td-company">${quote.company || '-'}</div></td>
      <td>${quote.service_type}</td>
      <td style="font-family:'Space Mono',monospace;color:var(--green);">${parseFloat(quote.amount).toLocaleString()} $</td>
      <td><span class="status-badge ${getStatusClass(quote.status)}">${quote.status}</span></td>
      <td style="color:var(--muted);font-size:.78rem;">${new Date(quote.created_at).toLocaleDateString('fr-FR')}</td>
      <td><div class="row-actions"><button class="row-btn" onclick="showToast('👁️ Aperçu devis')">👁️</button><button class="row-btn" onclick="showToast('✏️ Édition')">✏️</button><button class="row-btn" onclick="showToast('📧 Envoyé')">📧</button></div></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  projects.forEach(project => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="td-name">${project.project_name}</div></td>
      <td style="color:var(--muted);font-size:.82rem;">${project.client_name}</td>
      <td>${project.service_type}</td>
      <td>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <div class="progress-track" style="width:80px;"><div class="progress-fill" style="width:${project.progress_percentage}%"></div></div>
          <span style="font-size:.72rem;color:var(--muted);">${project.progress_percentage}%</span>
        </div>
      </td>
      <td style="color:var(--muted);font-size:.78rem;">${project.deadline ? new Date(project.deadline).toLocaleDateString('fr-FR') : '-'}</td>
      <td><span class="status-badge ${getStatusClass(project.status)}">${project.status}</span></td>
      <td><div class="row-actions"><button class="row-btn" onclick="showToast('👁️ Détail projet')">👁️</button><button class="row-btn" onclick="showToast('✏️ Édition')">✏️</button></div></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderClientsTable(clients) {
  const tbody = document.getElementById('clientsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  clients.forEach(client => {
    const initials = client.company_name.substring(0, 2).toUpperCase();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display:flex;align-items:center;gap:.5rem;">
          <span class="avatar-sm">${initials}</span>
          <div><div class="td-name">${client.company_name}</div><div class="td-company">${client.email || '-'}</div></div>
        </div>
      </td>
      <td style="color:var(--muted);font-size:.82rem;">${client.sector || '-'}</td>
      <td style="text-align:center;font-family:'Space Mono',monospace;">${client.total_projects}</td>
      <td style="font-family:'Space Mono',monospace;color:var(--green);">${parseFloat(client.total_revenue).toLocaleString()} $</td>
      <td style="color:var(--muted);font-size:.78rem;">${new Date(client.created_at).toLocaleDateString('fr-FR')}</td>
      <td><div class="row-actions"><button class="row-btn" onclick="showToast('👁️ Profil client')">👁️</button><button class="row-btn" onclick="showToast('✏️ Édition')">✏️</button></div></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderMessagesList(messages) {
  const list = document.getElementById('messagesList');
  if (!list) return;
  
  list.innerHTML = '';
  messages.forEach(msg => {
    const item = document.createElement('div');
    item.className = `notif-item ${msg.status === 'Non lu' ? 'unread' : ''}`;
    item.innerHTML = `
      <div class="notif-icon" style="background:rgba(123,47,247,.15);">📧</div>
      <div class="notif-body">
        <div class="notif-title">${msg.name} ${msg.company ? '— ' + msg.company : ''}</div>
        <div class="notif-desc">${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}</div>
        <div class="notif-time">${new Date(msg.created_at).toLocaleString('fr-FR')}</div>
      </div>
      ${msg.status === 'Non lu' ? '<div class="unread-dot"></div>' : ''}
    `;
    list.appendChild(item);
  });
}

function renderBlogTable(articles) {
  const tbody = document.getElementById('blogTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  articles.forEach(article => {
    const tr = document.createElement('tr');
    const authorName = article.first_name && article.last_name ? `${article.first_name} ${article.last_name}` : 'Admin';
    const statusClass = article.status === 'Publié' ? 'done' : 'pending';
    
    tr.innerHTML = `
      <td><div class="td-name">${article.title}</div></td>
      <td><span class="tag" style="font-size:.62rem;">${article.category}</span></td>
      <td style="color:var(--muted);font-size:.82rem;">${authorName}</td>
      <td style="font-family:'Space Mono',monospace;color:${article.views_count > 0 ? 'var(--cyan)' : 'var(--muted)'};">${article.views_count || '—'}</td>
      <td><span class="status-badge ${statusClass}">${article.status}</span></td>
      <td style="color:var(--muted);font-size:.78rem;">${new Date(article.created_at).toLocaleDateString('fr-FR')}</td>
      <td><div class="row-actions"><button class="row-btn" onclick="showToast('✏️ Éditer article')">✏️</button><button class="row-btn" onclick="window.open('article.html?id=${article.id}', '_blank')">👁️</button><button class="row-btn" onclick="showToast('🗑️ Supprimé')">🗑️</button></div></td>
    `;
    tbody.appendChild(tr);
  });
  
  // Update count
  const blogCount = document.getElementById('blogCount');
  if (blogCount) blogCount.textContent = `(${articles.length})`;
}

// Helper functions for styling
function getPriorityClass(priority) {
  switch (priority) {
    case 'Haute': return 'high';
    case 'Moyenne': return 'med';
    case 'Faible': return 'low';
    default: return '';
  }
}

function getPriorityEmoji(priority) {
  switch (priority) {
    case 'Haute': return '🔴';
    case 'Moyenne': return '🟠';
    case 'Faible': return '🟢';
    default: return '';
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'Nouveau': case 'En attente': return 'new';
    case 'En cours': return 'inprogress';
    case 'Converti': case 'Accepté': case 'Terminé': return 'done';
    case 'Perdu': case 'Refusé': case 'Annulé': return 'cancelled';
    default: return '';
  }
}
