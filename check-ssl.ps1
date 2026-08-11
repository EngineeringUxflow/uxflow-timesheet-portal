# PowerShell script para verificar status SSL
Write-Host "🔍 Verificando status SSL de cloudsolutionssap.com" -ForegroundColor Green

# 1. Verificar DNS
Write-Host "`n📋 Verificando DNS..." -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName -Name "cloudsolutionssap.com" -Type A
    Write-Host "✅ DNS resolvido: $($dns.IPAddress)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no DNS: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Verificar conectividade HTTP
Write-Host "`n🌐 Verificando HTTP..." -ForegroundColor Yellow
try {
    $http = Invoke-WebRequest -Uri "http://cloudsolutionssap.com" -Method Head -TimeoutSec 10
    Write-Host "✅ HTTP Status: $($http.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTP Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Verificar HTTPS
Write-Host "`n🔒 Verificando HTTPS..." -ForegroundColor Yellow
try {
    $https = Invoke-WebRequest -Uri "https://cloudsolutionssap.com" -Method Head -TimeoutSec 10
    Write-Host "✅ HTTPS Status: $($https.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTPS Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verificar certificado SSL
Write-Host "`n📜 Verificando certificado SSL..." -ForegroundColor Yellow
try {
    $cert = [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    $req = [System.Net.WebRequest]::Create("https://cloudsolutionssap.com")
    $req.GetResponse() | Out-Null
    $cert = $req.ServicePoint.Certificate
    if ($cert) {
        Write-Host "✅ Certificado encontrado" -ForegroundColor Green
        Write-Host "   Emissor: $($cert.Issuer)" -ForegroundColor Cyan
        Write-Host "   Válido até: $($cert.GetExpirationDateString())" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Certificado SSL Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Sugestões de correção
Write-Host "`n💡 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute ssl-fix.sh no servidor para configurar SSL" -ForegroundColor White
Write-Host "2. Execute deploy-website.sh para fazer deploy" -ForegroundColor White
Write-Host "3. Verifique configuração DNS no painel Hostinger" -ForegroundColor White
Write-Host "4. Aguarde propagação DNS (até 24h)" -ForegroundColor White

Write-Host "`n🔗 Links úteis:" -ForegroundColor Yellow
Write-Host "• SSL Test: https://www.ssllabs.com/ssltest/analyze.html?d=cloudsolutionssap.com" -ForegroundColor Cyan
Write-Host "• DNS Check: https://dnschecker.org/#A/cloudsolutionssap.com" -ForegroundColor Cyan