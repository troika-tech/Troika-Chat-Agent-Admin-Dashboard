# Quick Single-Command Deployment Script for AI Chat Admin Dashboard
# Usage: .\deploy-quick.ps1

$ErrorActionPreference = "Stop"

Write-Host "Starting quick deployment..." -ForegroundColor Cyan

# Build, upload to temp, move to production, fix permissions, reload nginx
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Set-Location dist
scp -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" -r . ubuntu@13.204.53.119:/tmp/ai-chat-admin-new
if ($LASTEXITCODE -ne 0) { Set-Location ..; exit 1 }

ssh -i "C:\Users\USER\.ssh\troika-calling-dashboard.pem" ubuntu@13.204.53.119 "sudo rm -rf /var/www/ai-chat-admin/* && sudo cp -r /tmp/ai-chat-admin-new/* /var/www/ai-chat-admin/ && sudo chmod 755 /var/www/ai-chat-admin/assets && sudo chmod 644 /var/www/ai-chat-admin/assets/* && sudo chown -R ubuntu:ubuntu /var/www/ai-chat-admin && rm -rf /tmp/ai-chat-admin-new && sudo systemctl reload nginx"

Set-Location ..

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-chat-admin.0804.in/" -ForegroundColor Cyan
