# 🐳 DOCKER HUB BUILD - UXFLOW SAP TIMESHEET PORTAL

## 📋 **INSTRUÇÕES PARA BUILD NO DOCKER HUB**

### **🔑 Pré-requisitos:**
1. Conta Docker Hub: `vladimirib`
2. Docker Desktop instalado e funcionando
3. Login no Docker Hub via CLI

---

## 🚀 **PROCESSO DE BUILD**

### **1. Login no Docker Hub**
```powershell
docker login
# Username: vladimirib
# Password: [sua senha]
```

### **2. Executar Script Automatizado**
```powershell
.\docker-hub-build.ps1
```

**OU fazer manualmente:**

### **3. Build Manual - Frontend**
```powershell
cd frontend
docker build -t vladimirib/uxflow-sap-timesheet-frontend:latest .
docker push vladimirib/uxflow-sap-timesheet-frontend:latest
cd ..
```

### **4. Build Manual - Backend**
```powershell
cd backend
docker build -t vladimirib/uxflow-sap-timesheet-backend:latest .
docker push vladimirib/uxflow-sap-timesheet-backend:latest
cd ..
```

---

## 📦 **IMAGENS RESULTANTES**

### **Frontend:**
- **Nome**: `vladimirib/uxflow-sap-timesheet-frontend:latest`
- **Porta**: 3000
- **Tecnologia**: Next.js 14 + SAP Fiori Design System

### **Backend:**
- **Nome**: `vladimirib/uxflow-sap-timesheet-backend:latest`
- **Porta**: 8000
- **Tecnologia**: Node.js + Express + Prisma

---

## 🔧 **USAR IMAGENS DO DOCKER HUB**

### **Docker Compose com Imagens Remotas:**
```powershell
docker-compose -f docker-compose.hub.yml up -d
```

### **Verificar Status:**
```powershell
docker-compose -f docker-compose.hub.yml ps
```

### **Logs:**
```powershell
docker-compose -f docker-compose.hub.yml logs -f
```

---

## 🌐 **ACESSO APÓS DEPLOY**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Postgres**: localhost:5432
- **Redis**: localhost:6379

---

## 📊 **MONITORAMENTO**

### **Docker Hub Repository:**
- https://hub.docker.com/u/vladimirib
- https://hub.docker.com/r/vladimirib/uxflow-sap-timesheet-frontend
- https://hub.docker.com/r/vladimirib/uxflow-sap-timesheet-backend

### **Verificar Imagens Locais:**
```powershell
docker images | grep vladimirib
```

### **Verificar Containers:**
```powershell
docker ps
```

---

## 🔄 **ATUALIZAÇÕES**

### **Para atualizar as imagens:**
1. Fazer alterações no código
2. Executar novamente: `.\docker-hub-build.ps1`
3. Restart containers: `docker-compose -f docker-compose.hub.yml restart`

### **Para forçar pull de novas imagens:**
```powershell
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

---

## ✅ **VALIDAÇÃO DO NOVO LAYOUT SAP FIORI**

Após o build, o portal terá:
- ✅ Cores SAP Fiori (#0070f2, #30914c, #ff8c00)
- ✅ Tipografia Inter seguindo padrões SAP
- ✅ Componentes com design system SAP
- ✅ Layout shell SAP (header/content/footer)
- ✅ Cards com elevação sutil
- ✅ Botões com border-radius 4px
- ✅ Status indicators coloridos

---

## 🚨 **TROUBLESHOOTING**

### **Erro de Login:**
```powershell
docker logout
docker login
```

### **Erro de Build:**
```powershell
docker system prune -f
docker-compose -f docker-compose.hub.yml down
docker-compose -f docker-compose.hub.yml up --build -d
```

### **Verificar Logs de Erro:**
```powershell
docker-compose -f docker-compose.hub.yml logs backend
docker-compose -f docker-compose.hub.yml logs frontend
```