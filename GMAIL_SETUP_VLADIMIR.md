# 📧 SETUP GMAIL - VLADIMIR RIBEIRO

## ⚡ **CONFIGURAÇÃO RÁPIDA (2 MINUTOS)**

### **1. Gerar App Password no Gmail:**
1. **Acesse**: https://myaccount.google.com/security
2. **2-Step Verification**: Ativar se não estiver
3. **App passwords**: Gerar nova senha
4. **Nome**: "UXFLOW Timesheet Demo"
5. **Copiar**: Senha de 16 caracteres gerada

### **2. Atualizar Código:**
```typescript
// Em demoEmailService.ts linha 15
auth: {
  user: 'vladimir.ribeiro.abreu@gmail.com',
  pass: 'COLE_A_APP_PASSWORD_AQUI' // 16 caracteres
}
```

### **3. Rebuild Backend:**
```bash
docker-compose build --no-cache backend
docker-compose up -d
```

## 🧪 **TESTE IMEDIATO:**

### **Via Dashboard:**
1. **Login**: demo@uxflow.com / demo123
2. **Novo Registro**: 8h SAP S/4HANA
3. **Enviar para Aprovação**
4. **Email chega**: vladimir.ribeiro.abreu@gmail.com

### **Via API:**
```bash
curl -X POST http://localhost:8000/api/email/send-demo \
  -H "Content-Type: application/json" \
  -d '{"hours":8,"description":"Teste email funcional"}'
```

## 📧 **EMAIL TEMPLATE:**
- **De**: UXFLOW Portal SAP <vladimir.ribeiro.abreu@gmail.com>
- **Para**: vladimir.ribeiro.abreu@gmail.com, comercial@uxflow.tech
- **Assunto**: ⏰ [DEMO] Nova Solicitação de Aprovação
- **Template**: HTML profissional com branding UXFLOW

## ✅ **RESULTADO ESPERADO:**
```json
{
  "success": true,
  "message": "✅ EMAIL DEMO ENVIADO COM SUCESSO!",
  "mode": "DEMO_REAL_EMAIL",
  "service": "Nodemailer + Gmail"
}
```

---
**🎯 CONFIGURE A APP PASSWORD E TESTE AGORA!**