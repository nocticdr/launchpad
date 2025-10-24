// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Online/Offline Status
function updateOnlineStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('status-text');
    
    if (navigator.onLine) {
        statusDot.classList.remove('offline');
        statusDot.classList.add('online');
        statusText.textContent = 'Online';
    } else {
        statusDot.classList.remove('online');
        statusDot.classList.add('offline');
        statusText.textContent = 'Offline Mode';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Load and render dashboard
async function loadDashboard() {
    const dashboard = document.getElementById('dashboard');
    
    try {
        const response = await fetch('links.json');
        const data = await response.json();
        
        // Update last updated date
        const lastUpdated = document.getElementById('last-updated');
        lastUpdated.textContent = data.metadata.lastUpdated;
        
        // Clear loading state
        dashboard.innerHTML = '';
        
        // Render categories
        data.categories.forEach(category => {
            const categoryElement = createCategoryElement(category);
            dashboard.appendChild(categoryElement);
        });
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        dashboard.innerHTML = `
            <div class="loading">
                <p>Unable to load dashboard. Please check your connection.</p>
            </div>
        `;
    }
}

function createCategoryElement(category) {
    const section = document.createElement('section');
    section.className = 'category';
    
    const header = document.createElement('div');
    header.className = 'category-header';
    
    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category.name;
    
    header.appendChild(title);
    section.appendChild(header);
    
    const grid = document.createElement('div');
    grid.className = 'links-grid';
    
    if (category.links && category.links.length > 0) {
        category.links.forEach(link => {
            const card = createLinkCard(link);
            grid.appendChild(card);
        });
    } else {
        const empty = document.createElement('div');
        empty.className = 'empty-category';
        empty.textContent = 'No links in this category yet';
        grid.appendChild(empty);
    }
    
    section.appendChild(grid);
    return section;
}

function createLinkCard(link) {
    const card = document.createElement('a');
    card.className = 'link-card';
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    
    // External link icon (SVG)
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'external-icon');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>';
    
    const name = document.createElement('div');
    name.className = 'link-name';
    name.textContent = link.name;
    
    const url = document.createElement('div');
    url.className = 'link-url';
    url.textContent = link.url;
    
    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(url);
    
    return card;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateOnlineStatus();
    loadDashboard();
});

// Handle installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // You could show a custom install button here
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
});