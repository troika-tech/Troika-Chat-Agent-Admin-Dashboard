# Deployment Guide

This guide explains how to deploy the AI Chat Admin Dashboard to the production server.

## Prerequisites

- SSH key located at: `C:\Users\USER\.ssh\troika-calling-dashboard.pem`
- Node.js and npm installed locally
- Access to the production server: `ubuntu@13.204.53.119`

## Quick Deployment

### Option 1: Super Fast (Recommended)

**For Windows (PowerShell):**
```powershell
.\deploy-quick.ps1
```

**For Git Bash / Linux / Mac:**
```bash
chmod +x deploy-quick.sh  # First time only
./deploy-quick.sh
```

This single command does everything:
- Builds the app
- Uploads to temp location
- Moves to production atomically
- Fixes all permissions
- Reloads Nginx

### Option 2: Advanced Deployment (with backups)

**For Windows (PowerShell):**
```powershell
# Full deployment (build + upload + fix permissions + backup)
.\deploy.ps1

# Skip build (use existing dist folder)
.\deploy.ps1 -SkipBuild

# Deploy without backup
.\deploy.ps1 -Backup:$false
```

**For Git Bash / Linux / Mac:**
```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Full deployment (build + upload + fix permissions + backup)
./deploy.sh

# Skip build (use existing dist folder)
./deploy.sh --skip-build

# Deploy without backup
./deploy.sh --no-backup
```

## What the Script Does

1. **Builds the application** - Runs `npm run build` to create production files
2. **Creates backup** - Backs up the current deployment on the server
3. **Uploads files** - Transfers all files from `dist/` to the server
4. **Fixes permissions** - Sets correct permissions (755 for directories, 644 for files)
5. **Verifies deployment** - Checks if the site is accessible

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Build locally
```bash
npm run build
```

### 2. Upload to server
```bash
# Using SCP
scp -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" -r dist/* ubuntu@13.204.53.119:/var/www/ai-chat-admin/

# OR using rsync (recommended)
rsync -avz --chmod=D755,F644 -e "ssh -i C:\Users\USER\.ssh\troika-calling-dashboard.pem" dist/ ubuntu@13.204.53.119:/var/www/ai-chat-admin/
```

### 3. SSH into server and fix permissions
```bash
ssh -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" ubuntu@13.204.53.119

# Fix permissions
sudo chmod 755 /var/www/ai-chat-admin/assets
sudo chmod 644 /var/www/ai-chat-admin/assets/*
sudo chown -R ubuntu:ubuntu /var/www/ai-chat-admin
```

## Server Configuration

- **Server:** 13.204.53.119
- **Web Root:** `/var/www/ai-chat-admin`
- **Domain:** https://ai-chat-admin.0804.in/
- **Web Server:** Nginx
- **SSL:** Let's Encrypt (managed by Certbot)

## Troubleshooting

### 403 Forbidden Errors

If you see 403 errors for CSS/JS files:
```bash
ssh -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" ubuntu@13.204.53.119
sudo chmod 755 /var/www/ai-chat-admin/assets
sudo chmod 644 /var/www/ai-chat-admin/assets/*
```

### Check Nginx Logs
```bash
ssh -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" ubuntu@13.204.53.119
sudo tail -f /var/log/nginx/error.log
```

### Verify File Permissions
```bash
ssh -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" ubuntu@13.204.53.119
ls -la /var/www/ai-chat-admin/
ls -la /var/www/ai-chat-admin/assets/
```

### Restore from Backup
```bash
ssh -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" ubuntu@13.204.53.119

# List available backups
ls -la /var/www/ | grep backup

# Restore from a backup
sudo rm -rf /var/www/ai-chat-admin/*
sudo cp -r /var/www/ai-chat-admin-backup-YYYYMMDD-HHMMSS/* /var/www/ai-chat-admin/
sudo chmod 755 /var/www/ai-chat-admin/assets
sudo chown -R ubuntu:ubuntu /var/www/ai-chat-admin
```

## Post-Deployment

1. Clear your browser cache: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. Verify the site loads: https://ai-chat-admin.0804.in/
3. Test key functionality to ensure everything works

## Configuration File

Deployment settings are stored in [.deployrc.json](.deployrc.json). You can modify this file to change:
- Server details
- Remote paths
- Build commands
- Backup settings

## Security Notes

- Never commit the SSH key to version control
- The `.deployrc.json` file contains server details - keep it secure
- Backups are stored on the server and should be cleaned up periodically

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Nginx error logs
3. Verify file permissions on the server
4. Ensure the build completes successfully locally
