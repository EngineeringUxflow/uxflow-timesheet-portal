# Docker Hub Build Script - UXFLOW SAP Timesheet Portal
# Account: vladimirib

Write-Host "=== DOCKER HUB BUILD - UXFLOW SAP TIMESHEET ===" -ForegroundColor Cyan
Write-Host ""

# Configurações
$DOCKER_USERNAME = "vladimirib"
$PROJECT_NAME = "uxflow-sap-timesheet"
$VERSION = "latest"

Write-Host "Docker Username: $DOCKER_USERNAME" -ForegroundColor Yellow
Write-Host "Project: $PROJECT_NAME" -ForegroundColor Yellow
Write-Host "Version: $VERSION" -ForegroundColor Yellow
Write-Host ""

# Login no Docker Hub
Write-Host "1. Fazendo login no Docker Hub..." -ForegroundColor Green
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no login do Docker Hub" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Build Frontend
Write-Host "2. Building Frontend Image..." -ForegroundColor Green
Set-Location "frontend"
docker build -t "$DOCKER_USERNAME/${PROJECT_NAME}-frontend:$VERSION" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no build do frontend" -ForegroundColor Red
    exit 1
}

# Push Frontend
Write-Host "3. Pushing Frontend to Docker Hub..." -ForegroundColor Green
docker push "$DOCKER_USERNAME/${PROJECT_NAME}-frontend:$VERSION"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no push do frontend" -ForegroundColor Red
    exit 1
}

Set-Location ".."

# Build Backend
Write-Host "4. Building Backend Image..." -ForegroundColor Green
Set-Location "backend"
docker build -t "$DOCKER_USERNAME/${PROJECT_NAME}-backend:$VERSION" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no build do backend" -ForegroundColor Red
    exit 1
}

# Push Backend
Write-Host "5. Pushing Backend to Docker Hub..." -ForegroundColor Green
docker push "$DOCKER_USERNAME/${PROJECT_NAME}-backend:$VERSION"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no push do backend" -ForegroundColor Red
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "=== BUILD COMPLETO ===" -ForegroundColor Green
Write-Host "Frontend: $DOCKER_USERNAME/${PROJECT_NAME}-frontend:$VERSION" -ForegroundColor Cyan
Write-Host "Backend: $DOCKER_USERNAME/${PROJECT_NAME}-backend:$VERSION" -ForegroundColor Cyan
Write-Host ""
Write-Host "Imagens disponíveis em: https://hub.docker.com/u/$DOCKER_USERNAME" -ForegroundColor Blue