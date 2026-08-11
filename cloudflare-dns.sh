#!/bin/bash
# Configuração DNS via CloudFlare API (alternativa ao Hostinger)

ZONE_ID="your_zone_id"
API_TOKEN="your_api_token"
DOMAIN="timesheet.uxflow.tech"
IP="31.97.175.224"

echo "🌐 Configurando DNS via CloudFlare..."

# Create A record
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{
       "type": "A",
       "name": "timesheet",
       "content": "'$IP'",
       "ttl": 3600
     }'

echo "✅ DNS configurado via CloudFlare"