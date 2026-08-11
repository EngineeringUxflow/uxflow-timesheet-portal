#!/bin/bash

# Deploy website to cloudsolutionssap.com
echo "🚀 Fazendo deploy do website para cloudsolutionssap.com"

# 1. Copiar arquivos do website
echo "📁 Copiando arquivos..."
sudo cp -r website/* /var/www/cloudsolutionssap.com/

# 2. Definir permissões corretas
echo "🔐 Configurando permissões..."
sudo chown -R www-data:www-data /var/www/cloudsolutionssap.com
sudo chmod -R 755 /var/www/cloudsolutionssap.com

# 3. Verificar arquivos copiados
echo "📋 Verificando arquivos..."
ls -la /var/www/cloudsolutionssap.com/

# 4. Testar nginx
echo "🧪 Testando nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://cloudsolutionssap.com"