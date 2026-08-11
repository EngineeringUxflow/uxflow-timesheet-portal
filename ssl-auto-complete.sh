#!/bin/bash
set -e

echo "🔒 Configurando SSL automaticamente..."

# Install certbot if not exists
if ! command -v certbot &> /dev/null; then
    echo "Instalando Certbot..."
    apt update
    apt install -y certbot
fi

# Stop nginx container temporarily
echo "Parando Nginx temporariamente..."
docker stop uxflow-nginx || true
docker rm uxflow-nginx || true

# Get SSL certificate using standalone mode on port 8080
echo "Obtendo certificado SSL..."
certbot certonly --standalone \
    -d timesheet.uxflow.tech \
    --non-interactive \
    --agree-tos \
    --email vladimir.ribeiro.abreu@gmail.com \
    --http-01-port 8080 \
    --force-renewal || echo "Certificado já existe ou erro na obtenção"

# Create SSL nginx config
echo "Criando configuração Nginx com SSL..."
mkdir -p /etc/nginx/ssl-configs

cat > /etc/nginx/ssl-configs/timesheet-ssl.conf << 'EOF'
server {
    listen 80;
    server_name timesheet.uxflow.tech www.timesheet.uxflow.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name timesheet.uxflow.tech www.timesheet.uxflow.tech;

    ssl_certificate /etc/letsencrypt/live/timesheet.uxflow.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timesheet.uxflow.tech/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Frontend
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

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

# Start nginx with SSL on port 8443 (to avoid conflict with finops)
echo "Iniciando Nginx com SSL..."
docker run -d --name uxflow-nginx \
    --restart unless-stopped \
    -p 8080:80 \
    -p 8443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -v /etc/nginx/ssl-configs/timesheet-ssl.conf:/etc/nginx/conf.d/default.conf \
    nginx:alpine

# Setup auto-renewal
echo "Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker restart uxflow-nginx") | crontab -

# Wait for nginx to start
sleep 5

# Test configuration
echo "Testando configuração..."
if curl -k -I https://localhost:8443 2>/dev/null | grep -q "200 OK"; then
    echo "✅ SSL configurado com sucesso!"
    echo "🌐 Portal disponível em:"
    echo "   HTTP:  http://timesheet.uxflow.tech:8080"
    echo "   HTTPS: https://timesheet.uxflow.tech:8443"
else
    echo "⚠️ Verificar configuração SSL"
fi

echo "✅ Configuração SSL completa!"