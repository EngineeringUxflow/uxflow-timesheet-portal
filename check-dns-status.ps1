# DNS Status Check - UXFLOW Timesheet Portal

Write-Host "=== VERIFICACAO DNS - TIMESHEET PORTAL ===" -ForegroundColor Cyan
Write-Host ""

# Verificar registro A principal
Write-Host "Verificando registro A principal..." -ForegroundColor Yellow
try {
    $result = Resolve-DnsName -Name "timesheet.uxflow.tech" -Type A -Server "8.8.8.8" -ErrorAction Stop
    Write-Host "OK - Registro A encontrado: $($result.IPAddress)" -ForegroundColor Green
    
    if ($result.IPAddress -eq "31.97.175.224") {
        Write-Host "OK - IP correto!" -ForegroundColor Green
    } else {
        Write-Host "ERRO - IP incorreto! Esperado: 31.97.175.224" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO - Registro A nao encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar CNAME
Write-Host "Verificando registro CNAME..." -ForegroundColor Yellow
try {
    $result = Resolve-DnsName -Name "www.timesheet.uxflow.tech" -Type CNAME -Server "8.8.8.8" -ErrorAction Stop
    Write-Host "OK - CNAME encontrado: $($result.NameHost)" -ForegroundColor Green
} catch {
    Write-Host "ERRO - CNAME nao encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TESTE COM MULTIPLOS DNS ===" -ForegroundColor Cyan

$dnsServers = @("8.8.8.8", "1.1.1.1", "208.67.222.222")

foreach ($dns in $dnsServers) {
    Write-Host "Testando DNS $dns..." -ForegroundColor Yellow
    try {
        $result = Resolve-DnsName -Name "timesheet.uxflow.tech" -Type A -Server $dns -ErrorAction Stop
        Write-Host "  OK - IP: $($result.IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "  ERRO - Nao resolve" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "IP Esperado: 31.97.175.224" -ForegroundColor Magenta
Write-Host "Verificacao online: https://dnschecker.org/#A/timesheet.uxflow.tech" -ForegroundColor Blue