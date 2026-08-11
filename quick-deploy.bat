@echo off
echo ========================================
echo UXFLOW TIMESHEET PORTAL - QUICK DEPLOY
echo ========================================
echo VPS: 31.97.175.224
echo Domain: timesheet.uxflow.tech
echo.

echo Executando deploy completo...
powershell -ExecutionPolicy Bypass -File "deploy-vps.ps1" -Step all

echo.
echo ========================================
echo DEPLOY FINALIZADO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Configure DNS no Hostinger (veja dns-config.md)
echo 2. Aguarde propagacao DNS (5-30 min)
echo 3. Acesse: https://timesheet.uxflow.tech
echo.
echo Para monitorar: ssh root@31.97.175.224
echo Comando monitor: ./monitor.sh
echo.
pause