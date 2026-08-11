#!/bin/bash
set -e

echo "Configurando SSL para UXFLOW Portal..."

# Install certbot
apt update
apt install -y certbot

# Stop nginx container temporarily
docker stop uxflow-nginx

# Get SSL certificate using standalone mode
certbot certonly --standalone \
    -d timesheet.uxflow.tech \
    -d www.timesheet.uxflow.tech \
    --non-interactive \
    --agree-tos \
    --email vladimir.ribeiro.abreu@gmail.com \
    --http-01-port 8080

# Create SSL nginx config
cat > /etc/nginx/sites-available/timesheet-ssl.conf << 'EOF'
server {
    listen 8080;
    server_name timesheet.uxflow.tech www.timesheet.uxflow.tech;
    return 301 https://$server_name:8443$request_uri;
}

server {
    listen 8443 ssl http2;
    server_name timesheet.uxflow.tech www.timesheet.uxflow.tech;

    ssl_certificate /etc/letsencrypt/live/timesheet.uxflow.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timesheet.uxflow.tech/privkey.pem;

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

# Start nginx with SSL
docker rm -f uxflow-nginx
docker run -d --name uxflow-nginx \
    -p 8080:80 \
    -p 8443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -v /etc/nginx/sites-available/timesheet-ssl.conf:/etc/nginx/conf.d/default.conf \
    nginx:alpine

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "✅ SSL configurado!"
echo "Portal disponível em: https://timesheet.uxflow.tech:8443"