# ============================================================
# deploy-frontend.ps1 - PSWPFront IIS デプロイスクリプト
# 管理者権限で実行してください
# ============================================================
# 使用方法:
#   .\deploy-frontend.ps1
#   .\deploy-frontend.ps1 -SiteName MySite -DeployPath D:\wwwroot\pswp-front -ApiUrl https://api.pswp.example.com
# ============================================================

param(
    [string]$SiteName   = "PSWPFront",
    [string]$AppPool    = "PSWPFrontPool",
    [string]$DeployPath = "C:\inetpub\wwwroot\pswp-front",
    [string]$SitePort   = "3000",
    [string]$ApiUrl     = "https://api.pswp.example.com",
    [switch]$SkipBuild  = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot  = Resolve-Path "$PSScriptRoot\.."
$FrontendDir  = Join-Path $ProjectRoot "PSWPFront"
$BuildDir     = Join-Path $FrontendDir "build"
$EnvProdFile  = Join-Path $FrontendDir ".env.production"

# ============================================================
# ヘルパー関数
# ============================================================
function Write-Step([string]$msg) {
    Write-Host ""
    Write-Host ">>> $msg" -ForegroundColor Cyan
}

function Test-Admin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    $p  = New-Object Security.Principal.WindowsPrincipal($id)
    return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# ============================================================
# 前提条件チェック
# ============================================================
if (-not (Test-Admin)) {
    Write-Error "管理者権限で実行してください"
    exit 1
}

if (-not $SkipBuild) {
    if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
        Write-Error "npm が見つかりません。Node.js をインストールしてください: https://nodejs.org/"
        exit 1
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " PSWPFront IIS デプロイ" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  サイト名     : $SiteName"
Write-Host "  アプリプール : $AppPool"
Write-Host "  デプロイ先   : $DeployPath"
Write-Host "  ポート       : $SitePort"
Write-Host "  API URL      : $ApiUrl"
Write-Host "============================================================" -ForegroundColor Green

# ============================================================
# 1. .env.production に API URL を設定
# ============================================================
Write-Step "1. .env.production に VITE_API_URL を設定"

Set-Content -Path $EnvProdFile -Value "VITE_API_URL=$ApiUrl" -Encoding UTF8
Write-Host "✓ .env.production: VITE_API_URL=$ApiUrl" -ForegroundColor Green

# ============================================================
# 2. npm build
# ============================================================
if (-not $SkipBuild) {
    Write-Step "2. npm run build"

    Push-Location $FrontendDir
    try {
        npm ci --include=dev
        if ($LASTEXITCODE -ne 0) { throw "npm ci に失敗しました" }

        npm run build
        if ($LASTEXITCODE -ne 0) { throw "npm run build に失敗しました" }
    }
    finally {
        Pop-Location
    }

    Write-Host "✓ ビルド完了: $BuildDir" -ForegroundColor Green
} else {
    Write-Host "ビルドをスキップしました (-SkipBuild)" -ForegroundColor Yellow
    if (-not (Test-Path $BuildDir)) {
        Write-Error "ビルド済みファイルが見つかりません: $BuildDir"
        exit 1
    }
}

# ============================================================
# 3. IIS アプリケーションプール作成・設定
# ============================================================
Write-Step "3. アプリケーションプール設定"

Import-Module WebAdministration -ErrorAction Stop

$pool = Get-WebConfiguration "system.applicationHost/applicationPools/add[@name='$AppPool']"
if ($null -eq $pool) {
    New-WebAppPool -Name $AppPool
    Write-Host "✓ アプリプール '$AppPool' を作成しました" -ForegroundColor Green
} else {
    Write-Host "  アプリプール '$AppPool' は既に存在します"
}

# 静的サイト: No Managed Code
Set-ItemProperty "IIS:\AppPools\$AppPool" managedRuntimeVersion ""
Set-ItemProperty "IIS:\AppPools\$AppPool" enable32BitAppOnWin64 $false

# ============================================================
# 4. デプロイ先フォルダ準備
# ============================================================
Write-Step "4. デプロイフォルダ準備"

if (-not (Test-Path $DeployPath)) {
    New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
    Write-Host "✓ フォルダ作成: $DeployPath" -ForegroundColor Green
}

# ============================================================
# 5. IIS サイト停止 → ファイルコピー → 起動
# ============================================================
Write-Step "5. ファイルデプロイ"

$site = Get-Website -Name $SiteName -ErrorAction SilentlyContinue
if ($null -ne $site) {
    Write-Host "  サイト '$SiteName' を停止中..."
    Stop-Website -Name $SiteName
    Start-Sleep -Seconds 1
}

# build/ の中身をすべてコピー
Copy-Item -Path "$BuildDir\*" -Destination $DeployPath -Recurse -Force
Write-Host "✓ ファイルのコピーが完了しました" -ForegroundColor Green

# ============================================================
# 6. IIS サイト作成または更新
# ============================================================
Write-Step "6. IIS サイト設定"

if ($null -eq $site) {
    New-Website -Name $SiteName `
        -PhysicalPath $DeployPath `
        -ApplicationPool $AppPool `
        -Port $SitePort `
        -Force | Out-Null
    Write-Host "✓ サイト '$SiteName' を作成しました (ポート: $SitePort)" -ForegroundColor Green
} else {
    Set-ItemProperty "IIS:\Sites\$SiteName" physicalPath $DeployPath
    Set-ItemProperty "IIS:\Sites\$SiteName" applicationPool $AppPool
    Write-Host "  サイト '$SiteName' の設定を更新しました" -ForegroundColor Green
}

Start-Website -Name $SiteName
Write-Host "✓ サイト '$SiteName' を起動しました" -ForegroundColor Green

# ============================================================
# 完了
# ============================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " デプロイ完了!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  URL: http://localhost:$SitePort"
Write-Host "  API: $ApiUrl"
Write-Host ""
Write-Host "動作確認:"
Write-Host "  Start-Process http://localhost:$SitePort"
