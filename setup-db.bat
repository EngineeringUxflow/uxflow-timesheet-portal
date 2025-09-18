@echo off
echo 🔧 Configurando banco de dados...

echo 1. Criando tabelas...
docker-compose exec backend npx prisma db push

echo 2. Gerando cliente Prisma...
docker-compose exec backend npx prisma generate

echo 3. Populando com dados de exemplo...
docker-compose exec backend npx ts-node src/seed.ts

echo ✅ Banco configurado com sucesso!
echo 🌐 Acesse: http://localhost:3000
pause