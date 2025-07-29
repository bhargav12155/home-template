# Deployment Guide

## Deployment Issue Fix

This project had a deployment issue where the Vite build configuration outputs static files to `dist/public` but the deployment process expects them in just `dist`. 

### The Problem

- **Vite Build Output**: Files are built to `dist/public/`
- **Deployment Expectation**: Files should be in `dist/`
- **Application Type**: This is a full-stack Express application, not just a static site

### Solution Applied

Since the Vite configuration and server files are protected and cannot be modified, I've created a deployment fix script that addresses the file structure mismatch.

### Using the Deployment Fix

#### Option 1: Use the Deployment Fix Script (Recommended)

1. Run the deployment fix script:
   ```bash
   ./deploy-fix.sh
   ```

This script will:
- Run the standard build process (`npm run build`)
- Copy static files from `dist/public/` to `dist/` root
- Ensure `index.html` is in the correct location for deployment

#### Option 2: Manual Build and Copy

If you prefer to run the steps manually:

1. Build the application:
   ```bash
   npm run build
   ```

2. Copy static files to the deployment directory:
   ```bash
   cp -r dist/public/* dist/
   ```

3. Ensure index.html is in the root:
   ```bash
   cp dist/public/index.html dist/
   ```

### Deployment Type Recommendation

This application is a **full-stack Express.js application** with both API routes and static file serving. For optimal deployment:

1. **Autoscale Deployment** (Recommended): Use Replit's Autoscale deployment type for full-stack applications
2. **Static Deployment**: If using static deployment, ensure you run the deployment fix script first

### File Structure After Fix

```
dist/
├── index.html           # Main HTML file (copied to root)
├── assets/             # Static assets (copied to root)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── index.js            # Server bundle
├── public/             # Original Vite output location
│   ├── index.html      # Original location
│   └── assets/         # Original assets location
```

### Notes

- The deployment fix script is safe to run multiple times
- The original `dist/public` directory is preserved as a backup
- This solution maintains compatibility with both development and production environments