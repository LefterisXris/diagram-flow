# Deployment Guide

This document explains how to deploy DiagramFlow to GitHub Pages.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- GitHub repository with write access

## Local Build & Test

1. **Build the production bundle:**
   ```bash
   npm run build
   ```

2. **Test the production build locally:**
   ```bash
   npm run preview
   ```
   Open http://localhost:4173 to test.

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment.

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment", set:
     - Source: "GitHub Actions"

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to "Actions" tab in your GitHub repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete, your site will be live at: `https://<username>.github.io/diagram-flow/`

### Manual Deployment

If you prefer manual deployment:

1. **Build with GitHub Pages flag:**
   ```bash
   export GITHUB_PAGES=true
   npm run build
   ```

2. **Deploy dist folder:**
   - Upload the `dist` folder contents to your hosting provider
   - Or use `gh-pages` npm package:
     ```bash
     npm install -g gh-pages
     gh-pages -d dist
     ```

## GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) automatically:
- Triggers on push to `main` branch
- Installs dependencies
- Builds the application with `GITHUB_PAGES=true`
- Deploys to GitHub Pages

## Configuration

### Base Path

The application uses a conditional base path configured in `vite.config.js`:

```javascript
base: process.env.GITHUB_PAGES === 'true' ? '/diagram-flow/' : '/'
```

- **Local development:** Base path is `/`
- **GitHub Pages:** Base path is `/diagram-flow/`

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` directory with your domain:
   ```
   example.com
   ```

2. Configure DNS:
   - Add a CNAME record pointing to `<username>.github.io`
   - Or add A records pointing to GitHub Pages IPs

3. Enable HTTPS in GitHub Pages settings

## Netlify Deployment (Alternative)

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Drag the `dist` folder to Netlify Drop
   - Or connect your GitHub repository to Netlify

3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - No environment variables needed (base path will be `/`)

## Vercel Deployment (Alternative)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Or connect GitHub repository to Vercel dashboard**

## Troubleshooting

### 404 on Refresh

If you get 404 errors when refreshing on routes, configure your hosting to serve `index.html` for all routes.

**GitHub Pages:** Add a `404.html` that redirects to `index.html`

**Netlify:** Add `_redirects` file to `public`:
```
/*    /index.html   200
```

### Assets Not Loading

Ensure the base path is configured correctly:
- GitHub Pages: Use `GITHUB_PAGES=true` environment variable
- Other hosts: Remove the base path or set to `/`

### Build Fails

Check that all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Live Site

After deployment, your site will be available at:
- **GitHub Pages:** https://LefterisXris.github.io/diagram-flow/
- **Custom domain:** Your configured domain
- **Netlify/Vercel:** Auto-generated URL or custom domain

## Production Checklist

- [ ] Production build completes without errors
- [ ] Preview works locally (npm run preview)
- [ ] All features work in production build
- [ ] No console errors in browser
- [ ] GitHub Actions workflow succeeds
- [ ] Live site is accessible
- [ ] Landing page loads correctly
- [ ] Application loads at /app.html
- [ ] All links work (navigation, documentation, GitHub)
- [ ] Dark/light theme works
- [ ] All node types render correctly
- [ ] Simulation works
- [ ] Save/load works
- [ ] Import/export works
