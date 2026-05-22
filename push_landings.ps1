$repos = @(
    "C:\Users\titus\Desktop\Cotiza - App de presupuestos",
    "C:\Users\titus\Desktop\BrasaFlow - Gestion Hostelera",
    "C:\Users\titus\Desktop\Turnia - Citas",
    "C:\Users\titus\Desktop\ImpulsDigital - Website"
)

foreach ($repo in $repos) {
    Write-Host "`n=== $repo ===" -ForegroundColor Cyan
    Set-Location $repo

    $locks = @(".git\HEAD.lock", ".git\index.lock")
    foreach ($lock in $locks) {
        $path = Join-Path $repo $lock
        if (Test-Path $path) {
            Remove-Item -Force $path
            Write-Host "  Eliminado: $lock" -ForegroundColor Yellow
        }
    }

    git add index.html
    git add assets/ 2>$null
    git commit -m "fix: color coherencia por app"
    git push origin main
    Write-Host "  Listo." -ForegroundColor Green
}

Write-Host "`nTodo subido." -ForegroundColor Green
