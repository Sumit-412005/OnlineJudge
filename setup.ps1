# Quick setup for the Online Judge (Windows / PowerShell).
# Run:  .\setup.ps1   then edit .env and run:  docker compose up --build

$ErrorActionPreference = "Stop"
$envPath = Join-Path $PSScriptRoot ".env"
$examplePath = Join-Path $PSScriptRoot ".env.example"

if (-not (Test-Path $envPath)) {
    Copy-Item $examplePath $envPath
    Write-Host "Created .env from .env.example." -ForegroundColor Green
    Write-Host "ACTION REQUIRED: open .env and paste your MongoDB Atlas string into MONGODB_URL." -ForegroundColor Yellow
} else {
    Write-Host ".env already exists - leaving it unchanged." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "When MONGODB_URL is set, start everything with:" -ForegroundColor White
Write-Host "    docker compose up --build" -ForegroundColor White
Write-Host ""
Write-Host "Frontend -> http://localhost:3000    Backend -> http://localhost:4000"
