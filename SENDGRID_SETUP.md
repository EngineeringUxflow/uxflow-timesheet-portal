# 📧 CONFIGURAÇÃO SENDGRID - UXFLOW PORTAL

## 🚀 Passos para Ativar o Envio de Emails

### 1. **Criar Conta SendGrid**
- Acesse: https://sendgrid.com/
- Crie conta gratuita (100 emails/dia)
- Verifique seu email

### 2. **Gerar API Key**
- Dashboard SendGrid → Settings → API Keys
- Clique "Create API Key"
- Nome: `UXFLOW_Portal_SAP`
- Permissions: **Full Access**
- Copie a chave gerada

### 3. **Configurar Domínio (Opcional)**
- Settings → Sender Authentication
- Authenticate Your Domain
- Adicione: `uxflow.tech`
- Configure DNS records

### 4. **Atualizar .env Backend**
```env
# Substitua pela sua chave real do SendGrid
SENDGRID_API_KEY="SG.sua_chave_real_aqui"
SENDGRID_FROM_EMAIL="noreply@uxflow.tech"
SENDGRID_FROM_NAME="UXFLOW Portal SAP"
FRONTEND_URL="http://localhost:3000"

# Emails de destino
EMAIL_COMERCIAL="comercial@uxflow.tech"
EMAIL_VLADIMIR="vladimir.ribeiro.abreu@gmail.com"
```

### 5. **Testar Envio**
- Reinicie o backend: `docker-compose restart backend`
- Dashboard → Registrar Horas → Enviar para Aprovação
- Verifique inbox dos emails configurados

## 📊 **Template de Email Inclui:**
- ✅ Header com branding UXFLOW
- ✅ Dados do timesheet (horas, projeto, valor)
- ✅ Botão de aprovação
- ✅ Informações do consultor
- ✅ Footer profissional

## 🔧 **Troubleshooting**
- **Erro 401**: API Key inválida
- **Erro 403**: Domínio não verificado
- **Não recebe**: Verifique spam/lixeira
- **Template quebrado**: Verifique HTML no SendGrid

## 💡 **Dica Pro**
Para produção, configure:
- Domínio próprio verificado
- Templates no SendGrid Dashboard
- Webhooks para tracking
- Suppressions lists

---
**UXFLOW - Software Engineering & Cloud Solutions**