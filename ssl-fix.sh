#!/bin/bash

# SSL Certificate Fix for cloudsolutionssap.com
echo "🔒 Configurando SSL para cloudsolutionssap.com"

# 1. Verificar status atual do domínio
echo "📋 Verificando DNS e SSL atual..."
nslookup cloudsolutionssap.com
curl -I https://cloudsolutionssap.com/ || echo "SSL não configurado"

# 2. Instalar Certbot se não existir
if ! command -v certbot &> /dev/null; then
    echo "📦 Instalando Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 3. Parar nginx temporariamente
echo "⏸️ Parando nginx..."
sudo systemctl stop nginx

# 4. Gerar certificado SSL Let's Encrypt
echo "🔐 Gerando certificado SSL..."
sudo certbot certonly --standalone \
    --email contato@uxflow.tech \
    --agree-tos \
    --no-eff-email \
    -d cloudsolutionssap.com \
    -d www.cloudsolutionssap.com

# 5. Configurar nginx com SSL
echo "⚙️ Configurando nginx com SSL..."
sudo tee /etc/nginx/sites-available/cloudsolutionssap.com > /dev/null <<EOF
server {
    listen 80;
    server_name cloudsolutionssap.com www.cloudsolutionssap.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cloudsolutionssap.com www.cloudsolutionssap.com;

    ssl_certificate /etc/letsencrypt/live/cloudsolutionssap.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cloudsolutionssap.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    root /var/www/cloudsolutionssap.com;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

# 6. Ativar site
sudo ln -sf /etc/nginx/sites-available/cloudsolutionssap.com /etc/nginx/sites-enabled/

# 7. Criar diretório do site
sudo mkdir -p /var/www/cloudsolutionssap.com
sudo chown -R www-data:www-data /var/www/cloudsolutionssap.com

# 8. Testar configuração nginx
echo "🧪 Testando configuração nginx..."
sudo nginx -t

# 9. Reiniciar nginx
echo "🔄 Reiniciando nginx..."
sudo systemctl start nginx
sudo systemctl reload nginx

# 10. Configurar renovação automática
echo "🔄 Configurando renovação automática..."
sudo crontab -l | grep -q certbot || (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -

echo "✅ SSL configurado com sucesso!"
echo "🌐 Teste: https://cloudsolutionssap.com"
echo "📋 Verificar certificado: https://www.ssllabs.com/ssltest/"