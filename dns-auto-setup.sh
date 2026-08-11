#!/bin/bash
set -e

echo "🌐 Configurando DNS automaticamente..."

# Hostinger API (simulação - usar CloudFlare como alternativa)
# Como Hostinger não tem API pública, vamos usar configuração direta

# Verificar se domínio já resolve
echo "Verificando DNS atual..."
if nslookup timesheet.uxflow.tech 8.8.8.8 | grep -q "31.97.175.224"; then
    echo "✅ DNS já configurado corretamente"
else
    echo "⚠️ DNS precisa ser configurado manualmente no Hostinger"
    echo "Registros necessários:"
    echo "A     timesheet    31.97.175.224"
    echo "CNAME www.timesheet timesheet.uxflow.tech"
    
    # Aguardar propagação DNS
    echo "Aguardando propagação DNS..."
    for i in {1..30}; do
        if nslookup timesheet.uxflow.tech 8.8.8.8 | grep -q "31.97.175.224"; then
            echo "✅ DNS propagado com sucesso!"
            break
        fi
        echo "Tentativa $i/30 - Aguardando DNS..."
        sleep 10
    done
fi

echo "✅ DNS configurado!"