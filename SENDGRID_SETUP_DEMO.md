# 📧 CONFIGURAÇÃO SENDGRID PARA DEMO - UXFLOW TIMESHEET

## 🚨 **CONFIGURAÇÃO NECESSÁRIA PARA EMAILS FUNCIONAREM**

### **1. ✅ Obter API Key Real do SendGrid:**

**Passo 1:** Acesse https://sendgrid.com/
**Passo 2:** Faça login na conta UXFLOW
**Passo 3:** Settings → API Keys → Create API Key
**Passo 4:** Nome: `UXFLOW_Timesheet_Demo`
**Passo 5:** Permissions: **Full Access**
**Passo 6:** Copie a chave gerada (SG.xxxxxxx...)

### **2. ✅ Atualizar .env Backend:**
```env
# Substitua pela chave REAL do SendGrid
SENDGRID_API_KEY="SG.sua_chave_real_sendgrid_aqui"
SENDGRID_FROM_EMAIL="noreply@uxflow.tech"
SENDGRID_FROM_NAME="UXFLOW Portal SAP"

# Destinatários dos emails
EMAIL_COMERCIAL="comercial@uxflow.tech"
EMAIL_VLADIMIR="vladimir.ribeiro.abreu@gmail.com"
```

### **3. ✅ Verificar Sender (Recomendado):**

**Single Sender Verification:**
- SendGrid → Settings → Sender Authentication
- Verify a Single Sender
- Email: `noreply@uxflow.tech`
- Verificar email recebido

### **4. ✅ Testar Envio:**

**Via Interface:**
1. Login: demo@uxflow.com / demo123
2. Dashboard → Novo Registro
3. Preencher dados
4. Clicar "Enviar para Aprovação"

**Via API:**
```bash
curl -X POST http://localhost:8000/api/email/send-approval \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{
    "consultantName": "Demo UXFLOW",
    "consultantEmail": "demo@uxflow.com",
    "managerName": "Vladimir Ribeiro",
    "managerEmail": "vladimir.ribeiro.abreu@gmail.com",
    "projectName": "SAP S/4HANA - Petrobras",
    "hours": 8,
    "date": "2025-09-18",
    "activity": "DEVELOPMENT",
    "description": "Teste de envio de email para demo"
  }'
```

## 🎯 **TEMPLATE DE EMAIL PROFISSIONAL**

### **📧 Conteúdo do Email:**
- **Cabeçalho**: Branding UXFLOW com gradiente
- **Dados**: Consultor, projeto, horas, valor
- **Botão**: "APROVAR TIMESHEET" (call-to-action)
- **Detalhes**: Data, atividade, descrição completa
- **Rodapé**: Copyright UXFLOW

### **📱 Destinatários Automáticos:**
- **Manager**: Email específico do aprovador
- **Comercial**: comercial@uxflow.tech (sempre)
- **Vladimir**: vladimir.ribeiro.abreu@gmail.com (sempre)

## 🧪 **TESTE PARA DEMO COM CLIENTES**

### **Cenário de Demonstração:**
1. **Consultor registra 8h** no projeto SAP S/4HANA
2. **Clica "Enviar para Aprovação"**
3. **Email enviado instantaneamente** para 3 destinatários
4. **Template profissional** com todos os detalhes
5. **Botão de aprovação** funcional

### **Logs Esperados:**
```
📧 ENVIANDO EMAIL REAL VIA SENDGRID...
Para: vladimir.ribeiro.abreu@gmail.com, comercial@uxflow.tech
Assunto: ⏰ Nova Solicitação de Aprovação - Demo UXFLOW
✅ Email enviado com sucesso via SendGrid!
```

## 🚨 **TROUBLESHOOTING**

### **Se Email Não Chegar:**
1. **Verificar Spam**: Pasta de lixo eletrônico
2. **API Key**: Confirmar se é real e válida
3. **Sender**: Verificar noreply@uxflow.tech no SendGrid
4. **Logs**: Verificar erros no backend

### **Comandos de Diagnóstico:**
```bash
# Ver logs do backend
docker-compose logs backend --tail=10

# Testar API diretamente
curl http://localhost:8000/health

# Reiniciar serviços
docker-compose restart backend
```

## 💼 **VALOR PARA DEMO**

### **Impacto Visual:**
- Email profissional com branding UXFLOW
- Template responsivo e moderno
- Informações completas e organizadas

### **Funcionalidade Real:**
- Envio automático via SendGrid
- Múltiplos destinatários
- Integração completa com timesheet

### **Diferencial Competitivo:**
- Workflow automatizado
- Comunicação profissional
- Rastreabilidade completa

---

**🎯 CONFIGURAR API KEY REAL = DEMO PERFEITA PARA CLIENTES!**