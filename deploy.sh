#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Deploy with rsync
echo "Deploying to server..."
rsync -avz --progress \
    --compress-level=9 \
    --delete \
    --exclude='.DS_Store' \
    --exclude='*.map' \
    -e "ssh -o TCPKeepAlive=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=20" \
    dist/ vader@157.230.115.93:/var/www/schuhvana.store/html/

echo "Deployment complete!"
