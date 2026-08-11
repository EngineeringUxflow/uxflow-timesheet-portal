#!/bin/bash
set -e

echo "=========================================="
echo "🚀 UXFLOW PORTAL - AUTOMAÇÃO COMPLETA"
echo "=========================================="
echo "🌐 Domínio: timesheet.uxflow.tech"
echo "🔒 SSL: Let's Encrypt automático"
echo "📍 VPS: 31.97.175.224"
echo ""

# Step 1: Configure DNS (manual prompt)
echo "STEP 1: Configuração DNS"
echo "⚠️  AÇÃO NECESSÁRIA: Configure DNS no Hostinger:"
echo "    A     timesheet    31.97.175.224"
echo "    CNAME www.timesheet timesheet.uxflow.tech"
echo ""
echo "Verificando DNS..."

# Wait for DNS propagation
DNS_READY=false
for i in {1..60}; do
    if nslookup timesheet.uxflow.tech 8.8.8.8 | grep -q "31.97.175.224"; then
        echo "✅ DNS configurado e propagado!"
        DNS_READY=true
        break
    fi
    echo "⏳ Tentativa $i/60 - Aguardando DNS... (configure no Hostinger se ainda não fez)"
    sleep 10
done

if [ "$DNS_READY" = false ]; then
    echo "❌ DNS não propagado. Configure manualmente no Hostinger e execute novamente."
    exit 1
fi

# Step 2: Install dependencies
echo ""
echo "STEP 2: Instalando dependências..."
apt update
apt install -y certbot curl dnsutils

# Step 3: Configure SSL
echo ""
echo "STEP 3: Configurando SSL..."

# Stop existing nginx
docker stop uxflow-nginx 2>/dev/null || true
docker rm uxflow-nginx 2>/dev/null || true

# Get SSL certificate
echo "Obtendo certificado SSL..."
certbot certonly --standalone \
    -d timesheet.uxflow.tech \
    --non-interactive \
    --agree-tos \
    --email vladimir.ribeiro.abreu@gmail.com \
    --http-01-port 8080

# Create SSL nginx config
mkdir -p /etc/nginx/ssl-configs
cat > /etc/nginx/ssl-configs/uxflow-ssl.conf << 'EOF'
server {
    listen 80;
    server_name timesheet.uxflow.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name timesheet.uxflow.tech;

    ssl_certificate /etc/letsencrypt/live/timesheet.uxflow.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timesheet.uxflow.tech/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

# Start nginx with SSL on alternative ports
echo "Iniciando Nginx com SSL..."
docker run -d --name uxflow-nginx \
    --restart unless-stopped \
    -p 8080:80 \
    -p 8443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -v /etc/nginx/ssl-configs/uxflow-ssl.conf:/etc/nginx/conf.d/default.conf \
    nginx:alpine

# Setup auto-renewal
echo "Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker restart uxflow-nginx") | crontab -

# Wait and test
sleep 10

echo ""
echo "STEP 4: Testando configuração..."
echo "🔍 Testando HTTP..."
if curl -I http://localhost:8080 2>/dev/null | grep -q "301\|200"; then
    echo "✅ HTTP funcionando"
else
    echo "⚠️ HTTP com problemas"
fi

echo "🔍 Testando HTTPS..."
if curl -k -I https://localhost:8443 2>/dev/null | grep -q "200"; then
    echo "✅ HTTPS funcionando"
else
    echo "⚠️ HTTPS com problemas"
fi

echo ""
echo "=========================================="
echo "🎉 CONFIGURAÇÃO COMPLETA!"
echo "=========================================="
echo ""
echo "🌐 URLs de Acesso:"
echo "   HTTP:  http://timesheet.uxflow.tech:8080"
echo "   HTTPS: https://timesheet.uxflow.tech:8443"
echo ""
echo "📊 Status dos Serviços:"
docker ps | grep uxflow
echo ""
echo "🔒 Certificado SSL:"
certbot certificates | grep timesheet || echo "Verificar certificados manualmente"
echo ""
echo "✅ Portal UXFLOW pronto para produção!"