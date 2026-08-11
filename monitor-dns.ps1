# Monitor DNS Propagation
$maxAttempts = 30
$attempt = 1

Write-Host "=== MONITORANDO PROPAGACAO DNS ===" -ForegroundColor Cyan
Write-Host "Aguardando propagacao dos registros..." -ForegroundColor Yellow

while ($attempt -le $maxAttempts) {
    Write-Host "`nTentativa $attempt/$maxAttempts..." -ForegroundColor Yellow
    
    try {
        $result = Resolve-DnsName -Name "timesheet.uxflow.tech" -Type A -Server "8.8.8.8" -ErrorAction Stop
        
        if ($result.IPAddress -eq "31.97.175.224") {
            Write-Host "SUCCESS! DNS propagado com sucesso!" -ForegroundColor Green
            Write-Host "IP: $($result.IPAddress)" -ForegroundColor Green
            
            # Testar CNAME também
            try {
                $cname = Resolve-DnsName -Name "www.timesheet.uxflow.tech" -Type CNAME -Server "8.8.8.8" -ErrorAction Stop
                Write-Host "CNAME: $($cname.NameHost)" -ForegroundColor Green
            } catch {
                Write-Host "CNAME ainda nao propagado" -ForegroundColor Yellow
            }
            
            break
        }
    } catch {
        Write-Host "Ainda nao propagado..." -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 30
    $attempt++
}

if ($attempt -gt $maxAttempts) {
    Write-Host "Timeout - Verifique os registros no Hostinger" -ForegroundColor Red
}