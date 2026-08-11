# 🌐 CONFIGURAÇÃO DNS - HOSTINGER

## 📋 **REGISTROS DNS NECESSÁRIOS**

### **VPS IP:** `31.97.175.224`
### **Domínio:** `timesheet.uxflow.tech`

---

## 🔧 **CONFIGURAÇÃO NO PAINEL HOSTINGER**

### **1. Acesse o Painel DNS:**
- Login: https://hpanel.hostinger.com
- Vá em: **Domínios** → **uxflow.tech** → **DNS Zone**

### **2. Adicione os Registros:**

#### **Registro A (Principal):**
```
Tipo: A
Nome: timesheet
Valor: 31.97.175.224
TTL: 3600
```

#### **Registro CNAME (WWW):**
```
Tipo: CNAME
Nome: www.timesheet
Valor: timesheet.uxflow.tech
TTL: 3600
```

#### **Registro A (API - Opcional):**
```
Tipo: A
Nome: api.timesheet
Valor: 31.97.175.224
TTL: 3600
```

---

## ✅ **RESULTADO ESPERADO:**

Após configuração, os seguintes URLs devem funcionar:
- ✅ `https://timesheet.uxflow.tech` → Portal Frontend
- ✅ `https://www.timesheet.uxflow.tech` → Portal Frontend  
- ✅ `https://timesheet.uxflow.tech/api/health` → API Backend
- ✅ `https://api.timesheet.uxflow.tech/health` → API Backend (opcional)

---

## ⏱️ **TEMPO DE PROPAGAÇÃO:**

- **Mínimo:** 5-15 minutos
- **Máximo:** 24-48 horas
- **Típico:** 30 minutos

### **Verificar Propagação:**
```bash
# Windows
nslookup timesheet.uxflow.tech

# Online
https://dnschecker.org
```

---

## 🔒 **CERTIFICADO SSL:**

Após DNS propagado, o script executará automaticamente:
```bash
certbot --nginx -d timesheet.uxflow.tech --non-interactive --agree-tos --email vladimir.ribeiro.abreu@gmail.com
```

**Resultado:** Portal acessível via HTTPS com certificado válido.

---

## 🚨 **TROUBLESHOOTING:**

### **DNS não resolve:**
1. Verificar se registros foram salvos
2. Aguardar mais tempo (até 24h)
3. Limpar cache DNS: `ipconfig /flushdns`

### **SSL falha:**
1. Verificar se DNS está propagado
2. Verificar se porta 80/443 estão abertas
3. Re-executar: `certbot --nginx -d timesheet.uxflow.tech`

### **Portal não carrega:**
1. Verificar containers: `docker-compose ps`
2. Verificar logs: `docker-compose logs`
3. Verificar Nginx: `nginx -t && systemctl status nginx`

---

## 📞 **SUPORTE:**

**Hostinger Support:**
- Chat: 24/7 no painel
- Email: support@hostinger.com
- Docs: https://support.hostinger.com

**UXFLOW Technical:**
- Email: vladimir.ribeiro.abreu@gmail.com
- VPS: ssh root@31.97.175.224