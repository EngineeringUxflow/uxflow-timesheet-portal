#!/bin/bash
set -e

echo "========================================="
echo "UXFLOW TIMESHEET PORTAL - VPS SETUP"
echo "========================================="

# Update system
echo "Atualizando sistema..."
apt update && apt upgrade -y

# Install Docker
echo "Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
echo "Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
echo "Instalando Nginx..."
apt install nginx -y
systemctl enable nginx
systemctl start nginx

# Install Certbot
echo "Instalando Certbot..."
apt install certbot python3-certbot-nginx -y

# Install utilities
apt install jq curl wget -y

# Load Docker images
echo "Carregando imagens Docker..."
cd /root
docker load -i uxflow-portal.tar

# Start containers
echo "Iniciando containers..."
docker-compose up -d

# Wait for containers
echo "Aguardando containers..."
sleep 30

# Check status
echo "Status dos containers:"
docker-compose ps

echo "✅ VPS setup concluído!"