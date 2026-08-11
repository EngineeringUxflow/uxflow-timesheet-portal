@echo off
echo Fazendo upload dos arquivos do website para o servidor...

REM Usando SCP para copiar arquivos (requer WinSCP ou similar)
echo Copiando index.html...
scp website/index.html root@31.97.175.224:/var/www/cloudsolutionssap.com/

echo Copiando styles.css...
scp website/styles.css root@31.97.175.224:/var/www/cloudsolutionssap.com/

echo Copiando script.js...
scp website/script.js root@31.97.175.224:/var/www/cloudsolutionssap.com/

echo Upload concluído!
echo Acesse: https://cloudsolutionssap.com

pause