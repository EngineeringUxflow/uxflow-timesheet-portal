#!/bin/bash
set -e

echo "Configurando SSL Certificate..."

# Get SSL certificate
certbot --nginx -d timesheet.uxflow.tech -d www.timesheet.uxflow.tech \
    --non-interactive \
    --agree-tos \
    --email vladimir.ribeiro.abreu@gmail.com

# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal
certbot renew --dry-run

echo "✅ SSL configurado com sucesso!"
echo "Portal disponível em: https://timesheet.uxflow.tech"