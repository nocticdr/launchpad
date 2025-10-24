# LaunchPad PWA

A modern, minimalistic, offline-capable dashboard for quick access to all your tech platforms.

## Features

✅ **Fully Offline Capable** - Works even when Cloudflare is down or there's no internet

✅ **PWA (Progressive Web App)** - Installable on desktop and mobile

✅ **Single Page Design** - All links on one clean page

✅ **Easy Configuration** - Just edit `links.json` to add/remove links

✅ **Modern UI** - Dark theme with smooth animations

✅ **Responsive** - Works perfectly on all devices

✅ **Zero Dependencies** - Pure HTML, CSS, and JavaScript

## Quick Start

1. **Customize Your Links**
   - Open `links.json`
   - Add/edit/remove links and categories
   - Save the file

2. **Deploy to Cloudflare Pages**
   ```bash
   # Install Wrangler CLI (if not already installed)
   npm install -g wrangler
   
   # Login to Cloudflare
   wrangler login
   
   # Deploy
   wrangler pages deploy dashboard --project-name=launchpad
   ```

   Or use the Cloudflare Pages dashboard:
   - Go to Pages → Create a project
   - Upload the `dashboard` folder
   - Done!

3. **Access Your Dashboard**
   - Visit your Cloudflare Pages URL
   - Click "Install" in your browser to add it as an app
   - Now it works offline!

## Configuration

### Adding Links

Edit `links.json`:

```json
{
  "categories": [
    {
      "name": "Your Category Name",
      "links": [
        {
          "name": "Link Display Name",
          "url": "https://your-url.com"
        }
      ]
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-10-24"
  }
}
```

### Supported Categories

The dashboard comes with three default categories:
- **Infra** - Infrastructure and cloud platforms
- **Security** - Security and compliance tools
- **DevOps** - Development and CI/CD tools

You can add as many categories as you need!

### Adding More Categories

Simply add a new object to the `categories` array:

```json
{
  "name": "Finance",
  "links": [
    {
      "name": "SAP",
      "url": "https://sap.your-company.com"
    },
    {
      "name": "Expense Reports",
      "url": "https://expenses.your-company.com"
    }
  ]
}
```

## Customization

### Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --bg-primary: #0f172a;      /* Main background */
    --bg-secondary: #1e293b;    /* Card backgrounds */
    --accent: #3b82f6;          /* Accent color */
    --text-primary: #f1f5f9;    /* Main text */
}
```

### Title & Branding

Edit `index.html`:

```html
<h1>Your Company Name</h1>
<p class="subtitle">Your custom subtitle</p>
```

### Cache Version

When you make changes, update the cache version in `sw.js`:

```javascript
const CACHE_NAME = 'dashboard-v2'; // Increment version
```

## How It Works Offline

1. **First Visit** - Service worker caches all files
2. **Subsequent Visits** - Loads from cache instantly
3. **No Internet** - Still works from cache
4. **Updates** - Automatically updates when online

Even if Cloudflare Pages is down, the app will load from the browser cache!

## File Structure

```
dashboard/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── app.js              # Main app logic
├── sw.js               # Service worker (offline functionality)
├── manifest.json       # PWA manifest (installability)
├── links.json          # Your links configuration
└── README.md           # This file
```

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Opera

## Tips

1. **Install as App**: Click the install button in your browser's address bar
2. **Pin to Taskbar**: After installing, pin it for quick access
3. **Mobile Home Screen**: Add to home screen on iOS/Android
4. **Private Links**: Works great for internal company URLs
5. **Update Links**: Just edit `links.json` and redeploy

## Troubleshooting

**Links not updating?**
- Clear browser cache or hard refresh (Ctrl+Shift+R)
- Update cache version in `sw.js`

**Not working offline?**
- Visit the page at least once while online
- Check if service worker is registered (DevTools → Application → Service Workers)

**Can't install as app?**
- Make sure you're using HTTPS (Cloudflare Pages uses HTTPS by default)
- Some browsers require user interaction before showing install prompt

## Next Steps

Want to add the Wasm pricing calculator? That will be a separate app that you can link to from this dashboard!

## License

Free to use and modify for your organization.