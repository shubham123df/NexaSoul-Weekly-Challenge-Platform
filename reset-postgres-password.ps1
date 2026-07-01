# Reset PostgreSQL password script
# This script will reset the postgres user password to 'postgres'

$pgDataPath = "C:\Program Files\PostgreSQL\18\data"
$pgHbaConf = "$pgDataPath\pg_hba.conf"
$pgHbaBackup = "$pgDataPath\pg_hba.conf.backup"

Write-Host "Stopping PostgreSQL service..." -ForegroundColor Yellow
Stop-Service -Name postgresql-x64-18 -Force

Write-Host "Backing up pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $pgHbaConf $pgHbaBackup -Force

Write-Host "Modifying pg_hba.conf to use trust authentication..." -ForegroundColor Yellow
(Get-Content $pgHbaConf) -replace 'scram-sha-256', 'trust' | Set-Content $pgHbaConf

Write-Host "Starting PostgreSQL service..." -ForegroundColor Yellow
Start-Service -Name postgresql-x64-18

Write-Host "Waiting for PostgreSQL to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Resetting postgres user password to 'postgres'..." -ForegroundColor Yellow
$env:PGPASSWORD = ""
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"

Write-Host "Restoring pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $pgHbaBackup $pgHbaConf -Force

Write-Host "Restarting PostgreSQL service..." -ForegroundColor Yellow
Restart-Service -Name postgresql-x64-18 -Force

Write-Host "Waiting for PostgreSQL to restart..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "✅ Password reset complete! The postgres user password is now 'postgres'" -ForegroundColor Green
