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
        statusText.textContent = 'Offline';
    }
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-mode', currentTheme === 'light');
    updateThemeButton(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
    
    function updateThemeButton(theme) {
        if (theme === 'light') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
        }
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
    
    // Apply color to category border and header
    const color = category.color || '#3b82f6';
    section.style.borderColor = color;
    section.style.color = color;
    
    const header = document.createElement('div');
    header.className = 'category-header';
    header.style.borderColor = color;
    
    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category.name;
    title.style.color = color;
    
    header.appendChild(title);
    section.appendChild(header);
    
    const grid = document.createElement('div');
    grid.className = 'links-grid';
    
    if (category.links && category.links.length > 0) {
        category.links.forEach(link => {
            const card = createLinkCard(link, color);
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

function createLinkCard(link, categoryColor) {
    const card = document.createElement('a');
    card.className = 'link-card';
    
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.style.color = categoryColor;
    
    // Check if this card has environments
    const hasEnvironments = link.prodUrl || link.devUrl;
    
    if (hasEnvironments) {
        // Create top section wrapper for environment cards
        const topSection = document.createElement('div');
        topSection.className = 'top-section';
        
        // Logo
        if (link.logo) {
            const logo = document.createElement('div');
            
            // Check if logo is emoji or URL
            if (link.logo.startsWith('http')) {
                const img = document.createElement('img');
                img.src = link.logo;
                img.alt = link.title;
                img.className = 'link-logo';
                img.onerror = function() {
                    // Fallback to emoji if image fails
                    this.outerHTML = '<div class="link-logo emoji">🔗</div>';
                };
                logo.appendChild(img);
            } else {
                // Assume emoji
                logo.className = 'link-logo emoji';
                logo.textContent = link.logo;
            }
            
            topSection.appendChild(logo);
        }
        
        // Content wrapper (title + tagline)
        const content = document.createElement('div');
        content.className = 'link-content';
        
        // Title
        const title = document.createElement('div');
        title.className = 'link-title';
        title.textContent = link.title;
        content.appendChild(title);
        
        // Tagline
        if (link.tagline) {
            const tagline = document.createElement('div');
            tagline.className = 'link-tagline';
            tagline.textContent = link.tagline;
            content.appendChild(tagline);
        }
        
        topSection.appendChild(content);
        card.appendChild(topSection);
    } else {
        // Regular cards without environments
        // Logo
        if (link.logo) {
            const logo = document.createElement('div');
            
            // Check if logo is emoji or URL
            if (link.logo.startsWith('http')) {
                const img = document.createElement('img');
                img.src = link.logo;
                img.alt = link.title;
                img.className = 'link-logo';
                img.onerror = function() {
                    // Fallback to emoji if image fails
                    this.outerHTML = '<div class="link-logo emoji">🔗</div>';
                };
                logo.appendChild(img);
            } else {
                // Assume emoji
                logo.className = 'link-logo emoji';
                logo.textContent = link.logo;
            }
            
            card.appendChild(logo);
        }
        
        // Content wrapper (title + tagline)
        const content = document.createElement('div');
        content.className = 'link-content';
        
        // Title
        const title = document.createElement('div');
        title.className = 'link-title';
        title.textContent = link.title;
        content.appendChild(title);
        
        // Tagline
        if (link.tagline) {
            const tagline = document.createElement('div');
            tagline.className = 'link-tagline';
            tagline.textContent = link.tagline;
            content.appendChild(tagline);
        }
        
        card.appendChild(content);
    }
    
    // Environment badges (PROD/DEV)
    if (hasEnvironments) {
        card.classList.add('has-environments');
        
        const badges = document.createElement('div');
        badges.className = 'env-badges';
        
        if (link.prodUrl) {
            const prodBadge = document.createElement('a');
            prodBadge.className = 'env-badge prod';
            prodBadge.href = link.prodUrl;
            prodBadge.target = '_blank';
            prodBadge.rel = 'noopener noreferrer';
            prodBadge.textContent = 'PROD';
            badges.appendChild(prodBadge);
        }
        
        if (link.devUrl) {
            const devBadge = document.createElement('a');
            devBadge.className = 'env-badge dev';
            devBadge.href = link.devUrl;
            devBadge.target = '_blank';
            devBadge.rel = 'noopener noreferrer';
            devBadge.textContent = 'DEV';
            badges.appendChild(devBadge);
        }
        
        card.appendChild(badges);
        
        // Don't add external icon for cards with environments
    } else {
        // External link icon (SVG) - only for regular links
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'external-icon');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>';
        
        card.appendChild(icon);
    }
    
    return card;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateOnlineStatus();
    initThemeToggle();
    loadDashboard();
});

// Handle installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
});