# Install Docker Desktop
Write-Host "=== INSTALANDO DOCKER DESKTOP ===" -ForegroundColor Cyan

# Download Docker Desktop
$dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$dockerInstaller = "$env:TEMP\DockerDesktopInstaller.exe"

Write-Host "Baixando Docker Desktop..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $dockerUrl -OutFile $dockerInstaller

Write-Host "Executando instalador..." -ForegroundColor Yellow
Start-Process -FilePath $dockerInstaller -ArgumentList "install", "--quiet" -Wait

Write-Host "Docker Desktop instalado!" -ForegroundColor Green
Write-Host "REINICIE o computador e execute: docker-hub-build.ps1" -ForegroundColor Yellow