#!/bin/bash
# deploy.sh

# Exit on error
set -e

# Install dependencies
npm install

# Clean dist directory
rm -rf dist/

# Build for production
npm run build

# Deploy to server
rsync -avz --delete dist/ vader@schuhvana.store:/var/www/schuhvana.store/html/
