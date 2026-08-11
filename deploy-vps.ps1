# UXFLOW TIMESHEET PORTAL - DEPLOY VPS HOSTINGER
# IP: 31.97.175.224
# Domain: timesheet.uxflow.tech

param(
    [string]$Step = "all"
)

$VPS_IP = "31.97.175.224"
$VPS_USER = "root"
$DOMAIN = "timesheet.uxflow.tech"
$SSH_KEY = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC8GDpwls941zSG47+mofnwm6KNeM6TOb1jbhMMAtswfNfEOYlhY+jeeuu9mRUcVW5mm3kV9gIRKRWsATPzobAXro9t/+sZb8iy8m2oSeyOD3+ECWi2LlMGqo9OeWlM53KjrvYQuG5VNP7hHI6ztcGnQM5oHgiOe+whFX4F9NuC3u0XtsnaEqXGo1yB6ApVDBXFbINfNoXI4qC5+tPnRxDzrExLMsw5zMvWzNaLeO+4feWDajssnkv9AS5/HLPlp29BY3xkVYak8kVmqdALIOm09iSQ92QxVgSxUF+r5m3UGK2sfOVCP1Te4HYw8Jhx8x/PKdjubKZXKJG8U0XZMvXDDA04mqQkHq8trQHP3yoCaat+1Qe0J1HbswCbRj33ix3IlNyuQ8WZD6fxtkw2gvaTrxQ+cMkYByU2f8nwCFYiGRsKW9qbIg4euazZ5ceV0otD9JDrMEb7n710ODVLogUEXGrbS/1y1GJh5jedJkGYBfMvEE3G0yCpHy8OIRUab+FtzgogLKc5blVOAlBf31/jPQZYYk590eE2nAXes8j0bjBcBmgTNX2De3VDbQez6t79zQbvHOc9DKSA9EH7ruErMH5nCH0uTur4+nQuS14VvmNplikpQZC/Klem7wCBDe7C/WMzf2TbNNi7AWCvxVQsoYZFi8aHVeYMJlHnUTCXzw=="

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UXFLOW TIMESHEET PORTAL - DEPLOY VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VPS IP: $VPS_IP" -ForegroundColor Yellow
Write-Host "Domain: $DOMAIN" -ForegroundColor Yellow
Write-Host ""

function Step-1-Package {
    Write-Host "STEP 1: Empacotando imagens Docker..." -ForegroundColor Green
    
    Write-Host "Salvando imagens..."
    docker save timesheet-sap-portal-backend:latest timesheet-sap-portal-frontend:latest | gzip > uxflow-portal.tar.gz
    
    Write-Host "Criando arquivo de configuração SSH..."
    @"
Host uxflow-vps
    HostName $VPS_IP
    User $VPS_USER
    IdentityFile ~/.ssh/uxflow_key
    StrictHostKeyChecking no
"@ | Out-File -FilePath "ssh_config" -Encoding UTF8
    
    Write-Host "✅ Pacote criado: uxflow-portal.tar.gz" -ForegroundColor Green
}

function Step-2-Upload {
    Write-Host "STEP 2: Upload para VPS..." -ForegroundColor Green
    
    # Criar diretório SSH se não existir
    if (!(Test-Path "$env:USERPROFILE\.ssh")) {
        New-Item -ItemType Directory -Path "$env:USERPROFILE\.ssh"
    }
    
    # Salvar chave SSH
    $SSH_KEY | Out-File -FilePath "$env:USERPROFILE\.ssh\uxflow_key.pub" -Encoding UTF8
    
    Write-Host "Fazendo upload dos arquivos..."
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" uxflow-portal.tar.gz ${VPS_USER}@${VPS_IP}:/root/
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" docker-compose.yml ${VPS_USER}@${VPS_IP}:/root/
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" docker-compose.override.yml ${VPS_USER}@${VPS_IP}:/root/
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" .env.production ${VPS_USER}@${VPS_IP}:/root/.env
    
    Write-Host "✅ Upload concluído" -ForegroundColor Green
}

function Step-3-VPS-Setup {
    Write-Host "STEP 3: Configurando VPS..." -ForegroundColor Green
    
    $commands = @"
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Nginx
apt install nginx -y

# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Carregar imagens Docker
cd /root
gunzip -c uxflow-portal.tar.gz | docker load

# Iniciar containers
docker-compose up -d

echo "✅ VPS configurada com sucesso!"
"@
    
    $commands | Out-File -FilePath "vps-setup.sh" -Encoding UTF8
    
    Write-Host "Executando setup na VPS..."
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" vps-setup.sh ${VPS_USER}@${VPS_IP}:/root/
    ssh -i "$env:USERPROFILE\.ssh\uxflow_key.pub" ${VPS_USER}@${VPS_IP} "chmod +x /root/vps-setup.sh && /root/vps-setup.sh"
    
    Write-Host "✅ VPS configurada" -ForegroundColor Green
}

function Step-4-Nginx {
    Write-Host "STEP 4: Configurando Nginx..." -ForegroundColor Green
    
    $nginxConfig = @"
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
"@
    
    $nginxConfig | Out-File -FilePath "nginx-uxflow.conf" -Encoding UTF8
    
    Write-Host "Configurando Nginx na VPS..."
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" nginx-uxflow.conf ${VPS_USER}@${VPS_IP}:/etc/nginx/sites-available/$DOMAIN
    
    ssh -i "$env:USERPROFILE\.ssh\uxflow_key.pub" ${VPS_USER}@${VPS_IP} @"
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
"@
    
    Write-Host "✅ Nginx configurado" -ForegroundColor Green
}

function Step-5-SSL {
    Write-Host "STEP 5: Configurando SSL Certificate..." -ForegroundColor Green
    
    Write-Host "Obtendo certificado SSL Let's Encrypt..."
    ssh -i "$env:USERPROFILE\.ssh\uxflow_key.pub" ${VPS_USER}@${VPS_IP} @"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email vladimir.ribeiro.abreu@gmail.com
systemctl enable certbot.timer
"@
    
    Write-Host "✅ SSL configurado" -ForegroundColor Green
}

function Step-6-DNS {
    Write-Host "STEP 6: Configuração DNS..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "CONFIGURE MANUALMENTE NO HOSTINGER:" -ForegroundColor Red
    Write-Host "1. Acesse o painel DNS do Hostinger" -ForegroundColor White
    Write-Host "2. Adicione os seguintes registros:" -ForegroundColor White
    Write-Host ""
    Write-Host "   Tipo: A" -ForegroundColor Cyan
    Write-Host "   Nome: timesheet" -ForegroundColor Cyan
    Write-Host "   Valor: $VPS_IP" -ForegroundColor Cyan
    Write-Host "   TTL: 3600" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Tipo: CNAME" -ForegroundColor Cyan
    Write-Host "   Nome: www.timesheet" -ForegroundColor Cyan
    Write-Host "   Valor: timesheet.uxflow.tech" -ForegroundColor Cyan
    Write-Host "   TTL: 3600" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Aguarde propagação DNS (5-30 minutos)" -ForegroundColor White
    Write-Host ""
}

function Step-7-Test {
    Write-Host "STEP 7: Testando deploy..." -ForegroundColor Green
    
    Write-Host "Testando containers na VPS..."
    ssh -i "$env:USERPROFILE\.ssh\uxflow_key.pub" ${VPS_USER}@${VPS_IP} "docker-compose ps"
    
    Write-Host "Testando endpoints..."
    try {
        $response = Invoke-WebRequest -Uri "http://$VPS_IP:8000/health" -TimeoutSec 10
        Write-Host "✅ Backend: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend não responde" -ForegroundColor Red
    }
    
    try {
        $response = Invoke-WebRequest -Uri "http://$VPS_IP:3000" -TimeoutSec 10
        Write-Host "✅ Frontend: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend não responde" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "URLs para testar após DNS:" -ForegroundColor Yellow
    Write-Host "- https://$DOMAIN" -ForegroundColor Cyan
    Write-Host "- https://$DOMAIN/api/health" -ForegroundColor Cyan
}

function Step-8-Monitor {
    Write-Host "STEP 8: Configurando monitoramento..." -ForegroundColor Green
    
    $monitorScript = @"
#!/bin/bash
# Monitor UXFLOW Portal
echo "=== UXFLOW Portal Status ==="
echo "Data: `$(date)"
echo ""

echo "Containers:"
docker-compose ps

echo ""
echo "Health Checks:"
curl -s http://localhost:8000/health | jq .
curl -s http://localhost:8000/health/detailed | jq .

echo ""
echo "Disk Usage:"
df -h

echo ""
echo "Memory Usage:"
free -h
"@
    
    $monitorScript | Out-File -FilePath "monitor.sh" -Encoding UTF8
    
    scp -i "$env:USERPROFILE\.ssh\uxflow_key.pub" monitor.sh ${VPS_USER}@${VPS_IP}:/root/
    ssh -i "$env:USERPROFILE\.ssh\uxflow_key.pub" ${VPS_USER}@${VPS_IP} "chmod +x /root/monitor.sh"
    
    Write-Host "✅ Monitoramento configurado" -ForegroundColor Green
    Write-Host "Execute na VPS: ./monitor.sh" -ForegroundColor Yellow
}

# Executar steps
switch ($Step) {
    "1" { Step-1-Package }
    "2" { Step-2-Upload }
    "3" { Step-3-VPS-Setup }
    "4" { Step-4-Nginx }
    "5" { Step-5-SSL }
    "6" { Step-6-DNS }
    "7" { Step-7-Test }
    "8" { Step-8-Monitor }
    "all" {
        Step-1-Package
        Step-2-Upload
        Step-3-VPS-Setup
        Step-4-Nginx
        Step-5-SSL
        Step-6-DNS
        Step-7-Test
        Step-8-Monitor
    }
    default {
        Write-Host "Uso: .\deploy-vps.ps1 [-Step <1-8|all>]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Steps disponíveis:" -ForegroundColor White
        Write-Host "1 - Empacotar imagens" -ForegroundColor Cyan
        Write-Host "2 - Upload para VPS" -ForegroundColor Cyan
        Write-Host "3 - Setup VPS (Docker, Nginx)" -ForegroundColor Cyan
        Write-Host "4 - Configurar Nginx" -ForegroundColor Cyan
        Write-Host "5 - Configurar SSL" -ForegroundColor Cyan
        Write-Host "6 - Instruções DNS" -ForegroundColor Cyan
        Write-Host "7 - Testar deploy" -ForegroundColor Cyan
        Write-Host "8 - Configurar monitoramento" -ForegroundColor Cyan
        Write-Host "all - Executar todos os steps" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Portal: https://$DOMAIN" -ForegroundColor Yellow
Write-Host "API: https://$DOMAIN/api/health" -ForegroundColor Yellow
Write-Host "VPS: ssh root@$VPS_IP" -ForegroundColor Yellow