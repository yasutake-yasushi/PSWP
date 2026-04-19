# Jenkins CI local verification script (PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File .\verify.ps1 [-SkipE2E]

param(
    [switch]$SkipE2E = $false
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "[OK]   $Message" -ForegroundColor Green
}

function Write-Ng {
    param([string]$Message)
    Write-Host "[NG]   $Message" -ForegroundColor Red
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Invoke-External {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [string[]]$Arguments = @(),
        [string]$WorkingDirectory
    )

    $argLine = if ($Arguments.Count -gt 0) { $Arguments -join ' ' } else { '' }
    Write-Host "  > $FilePath $argLine" -ForegroundColor DarkGray

    if ($WorkingDirectory) {
        Push-Location $WorkingDirectory
    }

    try {
        & $FilePath @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "$FilePath exited with code $LASTEXITCODE"
        }
    }
    finally {
        if ($WorkingDirectory) {
            Pop-Location
        }
    }
}

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)][string]$Title,
        [Parameter(Mandatory = $true)][scriptblock]$Action,
        [switch]$ContinueOnError
    )

    Write-Info $Title
    try {
        & $Action
        Write-Ok "${Title}: success"
        return $true
    }
    catch {
        Write-Ng "${Title}: failed - $($_.Exception.Message)"
        if (-not $ContinueOnError) {
            throw
        }
        return $false
    }
}

function Remove-IfExists {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (Test-Path $Path) {
        Remove-Item -LiteralPath $Path -Recurse -Force
    }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')

Write-Host ''
Write-Host '======================================' -ForegroundColor Cyan
Write-Host 'Jenkins pipeline local verification' -ForegroundColor Cyan
Write-Host '======================================' -ForegroundColor Cyan
Write-Host ''
Write-Info "Repo root: $repoRoot"

Push-Location $repoRoot
try {
    Invoke-Step -Title 'Step 1: Environment check (.NET / Node / npm)' -Action {
        Invoke-External -FilePath 'dotnet' -Arguments @('--version')
        Invoke-External -FilePath 'node' -Arguments @('--version')
        Invoke-External -FilePath 'npm' -Arguments @('--version')
    }

    Invoke-Step -Title 'Step 2: dotnet restore' -Action {
        Invoke-External -FilePath 'dotnet' -Arguments @('restore')
    }

    Invoke-Step -Title 'Step 3: npm install' -Action {
        Remove-IfExists -Path 'PSWPFront/node_modules'
        Invoke-External -FilePath 'npm' -Arguments @('ci', '--include=dev') -WorkingDirectory 'PSWPFront'
        Invoke-External -FilePath 'npx' -Arguments @('--no-install', 'vite', '--version') -WorkingDirectory 'PSWPFront'
    }

    Invoke-Step -Title 'Step 4: Build backend and frontend' -Action {
        Invoke-External -FilePath 'dotnet' -Arguments @('build', '--configuration', 'Release')
        Invoke-External -FilePath 'npm' -Arguments @('run', 'build') -WorkingDirectory 'PSWPFront'
    }

    Invoke-Step -Title 'Step 5: Backend unit tests' -Action {
        Invoke-External -FilePath 'dotnet' -Arguments @(
            'test', 'PSWPService.Tests/PSWPService.Tests.csproj',
            '--configuration', 'Release',
            '--no-build',
            '--logger', 'trx;LogFileName=TestResults.trx',
            '--logger', 'junit;LogFilePath=TestResults/junit-results.xml',
            '--collect:XPlat Code Coverage'
        )
    }

    Invoke-Step -Title 'Step 6: Frontend unit tests' -Action {
        Invoke-External -FilePath 'npm' -Arguments @('run', 'test:ci') -WorkingDirectory 'PSWPFront'
    }

    if ($SkipE2E) {
        Write-Warn 'Step 7: E2E skipped (-SkipE2E)'
    }
    else {
        Invoke-Step -Title 'Step 7: E2E tests' -Action {
            Invoke-External -FilePath 'npm' -Arguments @('run', 'playwright:install') -WorkingDirectory 'PSWPFront'
            Invoke-External -FilePath 'npm' -Arguments @('run', 'test:e2e:ci') -WorkingDirectory 'PSWPFront'
        } -ContinueOnError
    }

    Invoke-Step -Title 'Step 8: Frontend coverage report' -Action {
        Invoke-External -FilePath 'npm' -Arguments @('run', 'test', '--', '--coverage') -WorkingDirectory 'PSWPFront'
    }

    if (Test-Path 'PSWPFront/coverage/index.html') {
        Write-Ok 'Coverage report exists: PSWPFront/coverage/index.html'
    }
    else {
        Write-Warn 'Coverage report not found: PSWPFront/coverage/index.html'
    }

    Write-Host ''
    Write-Host '======================================' -ForegroundColor Cyan
    Write-Host 'Verification complete' -ForegroundColor Cyan
    Write-Host '======================================' -ForegroundColor Cyan
    Write-Host ''
    Write-Ok 'Main steps completed.'
    Write-Host 'Output paths:' -ForegroundColor Green
    Write-Host '  Backend: PSWPService.Tests/TestResults/' -ForegroundColor Gray
    Write-Host '  Frontend: PSWPFront/test-results/' -ForegroundColor Gray
    Write-Host '  Coverage: PSWPFront/coverage/index.html' -ForegroundColor Gray
}
finally {
    Pop-Location
}
