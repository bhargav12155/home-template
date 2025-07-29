#!/bin/bash

# Fix deployment structure for Replit deployment
# This script addresses the mismatch between Vite build output and deployment expectations

echo "Starting deployment fix..."

# Run the standard build process
echo "Running standard build..."
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Build failed, exiting..."
    exit 1
fi

echo "Build completed successfully"

# Copy static files from dist/public to dist root for deployment
if [ -d "dist/public" ]; then
    echo "Copying static files from dist/public to dist root..."
    cp -r dist/public/* dist/
    echo "Static files copied successfully"
else
    echo "Warning: dist/public directory not found"
fi

# Ensure index.html is in the correct location
if [ -f "dist/public/index.html" ]; then
    cp dist/public/index.html dist/
    echo "index.html copied to dist root"
fi

echo "Deployment fix completed successfully"
echo "Files are now ready for static deployment"