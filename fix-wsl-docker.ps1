# Fix WSL Docker Desktop Error
Write-Host "=== CORRIGINDO ERRO WSL DOCKER ===" -ForegroundColor Cyan

# 1. Parar Docker Desktop
Write-Host "1. Parando Docker Desktop..." -ForegroundColor Yellow
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

# 2. Desregistrar distribuições WSL do Docker
Write-Host "2. Removendo distribuições WSL..." -ForegroundColor Yellow
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data

# 3. Limpar dados WSL do Docker
Write-Host "3. Limpando dados WSL..." -ForegroundColor Yellow
Remove-Item -Path "$env:LOCALAPPDATA\Docker\wsl" -Recurse -Force -ErrorAction SilentlyContinue

# 4. Reiniciar WSL
Write-Host "4. Reiniciando WSL..." -ForegroundColor Yellow
wsl --shutdown

# 5. Iniciar Docker Desktop
Write-Host "5. Iniciando Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

Write-Host "=== CORRIGIDO ===" -ForegroundColor Green
Write-Host "Aguarde Docker Desktop inicializar completamente" -ForegroundColor Yellow