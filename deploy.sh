#!/bin/bash
# Deployment Script for AI Chat Admin Dashboard
# Bash Script for Git Bash/Linux/Mac

set -e

# Configuration
SSH_KEY="${SSH_KEY:-$HOME/.ssh/troika-calling-dashboard.pem}"
SERVER_USER="ubuntu"
SERVER_HOST="13.204.53.119"
REMOTE_PATH="/var/www/ai-chat-admin"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Parse arguments
SKIP_BUILD=false
BACKUP=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --no-backup)
            BACKUP=false
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: ./deploy.sh [--skip-build] [--no-backup]"
            exit 1
            ;;
    esac
done

echo "========================================"
echo "AI Chat Admin Dashboard Deployment"
echo "========================================"
echo ""

# Step 1: Build the application
if [ "$SKIP_BUILD" = false ]; then
    echo "[1/5] Building application..."
    npm run build
    echo "✓ Build completed successfully!"
    echo ""
else
    echo "[1/5] Skipping build (using existing dist folder)..."
    echo ""
fi

# Step 2: Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "Error: dist folder not found. Run without --skip-build flag."
    exit 1
fi

# Step 3: Create backup on server
if [ "$BACKUP" = true ]; then
    echo "[2/5] Creating backup on server..."
    ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_HOST}" \
        "sudo cp -r $REMOTE_PATH ${REMOTE_PATH}-backup-$TIMESTAMP"
    echo "✓ Backup created: ${REMOTE_PATH}-backup-$TIMESTAMP"
    echo ""
else
    echo "[2/5] Skipping backup..."
    echo ""
fi

# Step 4: Upload files to server
echo "[3/5] Uploading files to server..."
echo "This may take a few moments..."

# Using rsync with proper permissions
rsync -avz --chmod=D755,F644 \
    -e "ssh -i $SSH_KEY" \
    dist/ "${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/"

echo "✓ Files uploaded successfully!"
echo ""

# Step 5: Fix permissions on server
echo "[4/5] Fixing permissions on server..."
ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_HOST}" << 'EOF'
sudo chmod 755 /var/www/ai-chat-admin/assets
sudo chmod 644 /var/www/ai-chat-admin/assets/*
sudo chown -R ubuntu:ubuntu /var/www/ai-chat-admin
ls -la /var/www/ai-chat-admin/
EOF

echo "✓ Permissions fixed!"
echo ""

# Step 6: Verify deployment
echo "[5/5] Verifying deployment..."
RESPONSE=$(ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_HOST}" \
    "curl -I https://ai-chat-admin.0804.in/ 2>/dev/null | head -n 1")

if [[ $RESPONSE == *"200 OK"* ]]; then
    echo "✓ Deployment successful!"
    echo "$RESPONSE"
else
    echo "⚠ Warning: Server responded with: $RESPONSE"
fi

echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo "URL: https://ai-chat-admin.0804.in/"
echo "Backup: ${REMOTE_PATH}-backup-$TIMESTAMP"
echo ""
echo "Remember to clear your browser cache (Ctrl+Shift+R)"
