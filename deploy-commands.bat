@echo off
echo ========================================
echo UXFLOW TIMESHEET PORTAL - DEPLOY PACKAGE
echo ========================================

echo.
echo 1. Salvando imagens Docker...
docker save timesheet-sap-portal-backend:latest > uxflow-backend.tar
docker save timesheet-sap-portal-frontend:latest > uxflow-frontend.tar

echo.
echo 2. Criando pacote completo...
docker save timesheet-sap-portal-backend:latest timesheet-sap-portal-frontend:latest > uxflow-portal-complete.tar

echo.
echo 3. Verificando arquivos criados...
dir *.tar

echo.
echo ========================================
echo PACOTE PRONTO PARA DEPLOY VPS HOSTINGER
echo ========================================
echo.
echo Arquivos criados:
echo - uxflow-backend.tar (Backend)
echo - uxflow-frontend.tar (Frontend)  
echo - uxflow-portal-complete.tar (Completo)
echo - docker-compose.yml
echo - docker-compose.override.yml
echo - .env.production
echo.
echo Proximo passo: Upload para VPS Hostinger
echo Comando: scp uxflow-portal-complete.tar user@vps:/home/uxflow/
echo.
pause