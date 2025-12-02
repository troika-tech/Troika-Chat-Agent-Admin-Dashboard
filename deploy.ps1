# Deployment Script for AI Chat Admin Dashboard
# PowerShell Script for Windows

param(
    [switch]$SkipBuild = $false,
    [switch]$Backup = $true
)

$ErrorActionPreference = "Stop"

# Configuration
$SSH_KEY = "C:\Users\USER\.ssh\troika-calling-dashboard.pem"
$SERVER_USER = "ubuntu"
$SERVER_HOST = "13.204.53.119"
$REMOTE_PATH = "/var/www/ai-chat-admin"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI Chat Admin Dashboard Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the application
if (-not $SkipBuild) {
    Write-Host "[1/5] Building application..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[1/5] Skipping build (using existing dist folder)..." -ForegroundColor Yellow
    Write-Host ""
}

# Step 2: Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist folder not found. Run without -SkipBuild flag." -ForegroundColor Red
    exit 1
}

# Step 3: Create backup on server
if ($Backup) {
    Write-Host "[2/5] Creating backup on server..." -ForegroundColor Yellow
    $backupCmd = "sudo cp -r $REMOTE_PATH ${REMOTE_PATH}-backup-$TIMESTAMP"
    ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_HOST}" $backupCmd
    Write-Host "Backup created: ${REMOTE_PATH}-backup-$TIMESTAMP" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[2/5] Skipping backup..." -ForegroundColor Yellow
    Write-Host ""
}

# Step 4: Upload files to server
Write-Host "[3/5] Uploading files to server..." -ForegroundColor Yellow
Write-Host "This may take a few moments..." -ForegroundColor Gray

# Using SCP to upload (rsync alternative for Windows)
scp -i $SSH_KEY -r dist/* "${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Files uploaded successfully!" -ForegroundColor Green
Write-Host ""

# Step 5: Fix permissions on server
Write-Host "[4/5] Fixing permissions on server..." -ForegroundColor Yellow
$permissionCmd = @"
sudo chmod 755 $REMOTE_PATH/assets && \
sudo chmod 644 $REMOTE_PATH/assets/* && \
sudo chown -R ubuntu:ubuntu $REMOTE_PATH && \
ls -la $REMOTE_PATH/
"@

ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_HOST}" $permissionCmd
Write-Host "Permissions fixed!" -ForegroundColor Green
Write-Host ""

# Step 6: Verify deployment
Write-Host "[5/5] Verifying deployment..." -ForegroundColor Yellow
$verifyCmd = "curl -I https://ai-chat-admin.0804.in/ | head -n 1"
$response = ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_HOST}" $verifyCmd

if ($response -match "200 OK") {
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host $response -ForegroundColor Green
} else {
    Write-Host "Warning: Server responded with: $response" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URL: https://ai-chat-admin.0804.in/" -ForegroundColor Cyan
Write-Host "Backup: ${REMOTE_PATH}-backup-$TIMESTAMP" -ForegroundColor Gray
Write-Host ""
Write-Host "Remember to clear your browser cache (Ctrl+Shift+R)" -ForegroundColor Yellow
