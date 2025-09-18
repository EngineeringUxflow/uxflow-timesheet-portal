# 🚀 SETUP - UXFLOW SAP Timesheet Portal

## Pré-requisitos
- Docker Desktop instalado
- Git instalado
- Porta 3000, 8000, 5432, 6379 livres

## 📋 Passos para Subir a Aplicação

### 1. Clone e Navegue
```bash
cd "c:\Users\vladi\OneDrive\Área de Trabalho\Pool de Arquivos_\Uxflow Projetos_\.uxflowconsultoria\timesheet-sap-portal"
```

### 2. Suba os Containers
```bash
docker-compose up -d
```

### 3. Execute as Migrações do Banco
```bash
# Entre no container do backend
docker-compose exec backend sh

# Execute as migrações
npx prisma migrate dev --name init
npx prisma generate

# Saia do container
exit
```

### 4. Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 🔧 Comandos Úteis

### Ver Logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas frontend
docker-compose logs -f frontend

# Apenas backend
docker-compose logs -f backend
```

### Parar Aplicação
```bash
docker-compose down
```

### Rebuild (após mudanças)
```bash
docker-compose down
docker-compose up --build -d
```

### Acessar Banco de Dados
```bash
# Via container
docker-compose exec postgres psql -U postgres -d timesheet_db

# Via Prisma Studio
docker-compose exec backend npx prisma studio
```

## 🐛 Troubleshooting

### Erro de Porta Ocupada
```bash
# Verificar portas em uso
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Matar processo se necessário
taskkill /PID <PID_NUMBER> /F
```

### Erro de Permissão Docker
- Reinicie o Docker Desktop
- Execute como Administrador

### Banco não Conecta
```bash
# Verificar se PostgreSQL subiu
docker-compose ps

# Recriar volumes se necessário
docker-compose down -v
docker-compose up -d
```

## ✅ Verificação de Funcionamento

1. **Frontend**: Deve mostrar a página inicial com cards
2. **Backend**: http://localhost:8000/health deve retornar JSON
3. **Banco**: Conexão deve estar OK nos logs
4. **Redis**: Cache deve estar funcionando

## 🚀 Próximos Passos

Após subir com sucesso:
1. Testar endpoints da API
2. Criar usuários de teste
3. Implementar autenticação
4. Adicionar dados de exemplo