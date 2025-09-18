@echo off
echo 🔧 Corrigindo problemas do Docker...

echo 1. Parando containers existentes...
docker-compose down 2>nul

echo 2. Limpando cache Docker...
docker system prune -f 2>nul

echo 3. Removendo volumes antigos...
docker volume prune -f 2>nul

echo 4. Verificando se Docker Desktop está rodando...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop não está rodando!
    echo.
    echo SOLUÇÕES:
    echo 1. Abra Docker Desktop manualmente
    echo 2. Aguarde ele inicializar completamente
    echo 3. Execute start.bat novamente
    echo.
    pause
    exit /b 1
)

echo ✅ Docker OK! Execute start.bat agora.
pause