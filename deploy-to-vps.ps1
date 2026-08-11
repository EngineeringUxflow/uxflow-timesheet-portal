# Deploy to VPS and Build Docker Images

$VPS_IP = "31.97.175.224"
$VPS_USER = "root"
$PROJECT_PATH = "/root/timesheet-sap-portal"

Write-Host "=== DEPLOY E BUILD NO VPS ===" -ForegroundColor Cyan

# 1. Upload project to VPS
Write-Host "1. Uploading project..." -ForegroundColor Yellow
scp -r . ${VPS_USER}@${VPS_IP}:${PROJECT_PATH}

# 2. Execute build on VPS
Write-Host "2. Building on VPS..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_IP} "cd ${PROJECT_PATH} && chmod +x vps-docker-build.sh && ./vps-docker-build.sh"

Write-Host "=== COMPLETO ===" -ForegroundColor Green