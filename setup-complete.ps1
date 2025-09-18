Write-Host "🚀 UXFLOW SAP Timesheet Portal - Setup Completo" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Construindo imagens Docker..." -ForegroundColor Yellow
docker-compose build

Write-Host ""
Write-Host "🗄️ Iniciando banco de dados..." -ForegroundColor Yellow
docker-compose up -d postgres redis

Write-Host ""
Write-Host "⏳ Aguardando banco de dados..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🔧 Executando migrações..." -ForegroundColor Yellow
docker-compose exec -T backend npx prisma migrate dev --name init

Write-Host ""
Write-Host "🌱 Populando banco com dados iniciais..." -ForegroundColor Yellow
docker-compose exec -T backend npm run seed

Write-Host ""
Write-Host "🚀 Iniciando aplicação completa..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📊 Prisma Studio: docker-compose exec backend npx prisma studio" -ForegroundColor Cyan
Write-Host ""
Write-Host "👤 Credenciais de teste:" -ForegroundColor Magenta
Write-Host "   Super Admin: admin@uxflow.com / admin123" -ForegroundColor White
Write-Host "   Demo Company: empresa@demo.com / demo123" -ForegroundColor White
Write-Host ""
Read-Host "Pressione Enter para continuar"