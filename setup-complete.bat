@echo off
echo 🚀 UXFLOW SAP Timesheet Portal - Setup Completo
echo.

echo 📦 Construindo imagens Docker...
docker-compose build

echo.
echo 🗄️ Iniciando banco de dados...
docker-compose up -d postgres redis

echo.
echo ⏳ Aguardando banco de dados...
timeout /t 10

echo.
echo 🔧 Executando migrações...
docker-compose exec -T backend npx prisma migrate dev --name init

echo.
echo 🌱 Populando banco com dados iniciais...
docker-compose exec -T backend npm run seed

echo.
echo 🚀 Iniciando aplicação completa...
docker-compose up -d

echo.
echo ✅ Setup concluído!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📊 Prisma Studio: docker-compose exec backend npx prisma studio
echo.
echo 👤 Credenciais de teste:
echo    Super Admin: admin@uxflow.com / admin123
echo    Demo Company: empresa@demo.com / demo123
echo.
pause