@echo off
echo 🚀 Iniciando UXFLOW SAP Timesheet Portal...

echo ⏳ Verificando Docker Desktop...
tasklist /FI "IMAGENAME eq Docker Desktop.exe" 2>NUL | find /I /N "Docker Desktop.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo 🔄 Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo ⏳ Aguardando Docker Desktop iniciar (60s)...
    timeout /t 60 /nobreak >nul
)

echo ⏳ Testando conexão Docker...
:DOCKER_CHECK
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Docker ainda não está pronto, aguardando...
    timeout /t 5 /nobreak >nul
    goto DOCKER_CHECK
)

echo ✅ Docker OK - Subindo aplicação...
docker-compose up -d

echo ⏳ Aguardando containers iniciarem...
timeout /t 15 /nobreak >nul

echo ✅ Aplicação rodando!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000/health
echo.
echo Pressione ENTER para abrir o navegador...
pause >nul

start http://localhost:3000