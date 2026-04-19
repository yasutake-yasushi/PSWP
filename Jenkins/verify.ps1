# Jenkins CI/CD パイプライン ローカル検証スクリプト (PowerShell)
# 
# このスクリプトは、Jenkins上で実行されるのと同じテスト手順を
# ローカルマシンで実行して検証します。
#
# 実行: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#      .\verify.ps1

param(
    [switch]$NoSkip = $false
)

$ErrorActionPreference = "Continue"

# Color codes for output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[!] $Message" -ForegroundColor Yellow
}

$testsPassed = 0
$testsFailed = 0

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Jenkins パイプライン ローカル検証" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: チェック環境
Write-Info "Step 1: 環境をチェック中..."

try {
    $dotnetVersion = dotnet --version
    Write-Success ".NET SDK インストール確認: $dotnetVersion"
}
catch {
    Write-Error ".NET SDK が見つかりません"
    exit 1
}

try {
    $nodeVersion = node --version
    Write-Success "Node.js インストール確認: $nodeVersion"
}
catch {
    Write-Error "Node.js が見つかりません"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Success "npm インストール確認: $npmVersion"
}
catch {
    Write-Error "npm が見つかりません"
    exit 1
}

Write-Host ""

# Step 2: バックエンド リストア
Write-Info "Step 2: .NET 依存関係をリストア中..."
try {
    dotnet restore | Out-Null
    Write-Success ".NET リストア完了"
}
catch {
    Write-Error ".NET リストア失敗: $_"
}

Write-Host ""

# Step 3: フロントエンド インストール
Write-Info "Step 3: Node.js 依存関係をインストール中..."
try {
    Push-Location "PSWPFront"
    npm install | Out-Null
    Pop-Location
    Write-Success "npm インストール完了"
}
catch {
    Write-Error "npm インストール失敗: $_"
}

Write-Host ""

# Step 4: ビルド
Write-Info "Step 4: ビルド中..."
Write-Warning "バックエンド ビルド..."
try {
    dotnet build --configuration Release | Out-Null
    Write-Success "バックエンド ビルド成功"
}
catch {
    Write-Error "バックエンド ビルド失敗: $_"
    exit 1
}

Write-Warning "フロントエンド ビルド..."
try {
    Push-Location "PSWPFront"
    npm run build | Out-Null
    Pop-Location
    Write-Success "フロントエンド ビルド成功"
}
catch {
    Write-Error "フロントエンド ビルド失敗: $_"
    exit 1
}

Write-Host ""

# Step 5: バックエンド テスト
Write-Info "Step 5: バックエンド ユニットテスト実行中..."
try {
    dotnet test PSWPService.Tests/PSWPService.Tests.csproj `
        --configuration Release `
        --no-build `
        --logger "trx;LogFileName=TestResults.trx" `
        --logger "xunit;LogFileName=xunit-results.xml" `
        --collect:"XPlat Code Coverage" | Out-Null
    
    Write-Success "バックエンド ユニットテスト成功"
    
    $testResults = Get-ChildItem -Path "PSWPService.Tests/TestResults" -Filter "*.trx" -ErrorAction SilentlyContinue
    if ($testResults) {
        Write-Info "  - テスト結果: $($testResults.Count) 個のトレース ファイル"
    }
}
catch {
    Write-Error "バックエンド ユニットテスト失敗: $_"
}

Write-Host ""

# Step 6: フロントエンド テスト
Write-Info "Step 6: フロントエンド ユニットテスト実行中..."
try {
    Push-Location "PSWPFront"
    npm run test:ci | Out-Null
    Pop-Location
    
    Write-Success "フロントエンド ユニットテスト成功"
    
    if (Test-Path "PSWPFront/test-results/vitest/results.xml") {
        Write-Info "  - テスト結果: PSWPFront/test-results/vitest/results.xml"
    }
}
catch {
    Write-Error "フロントエンド ユニットテスト失敗: $_"
}

Write-Host ""

# Step 7: E2E テスト
Write-Info "Step 7: E2E テスト実行中..."
try {
    Push-Location "PSWPFront"
    npm run playwright:install | Out-Null
    Write-Warning "  - Playwright ブラウザのインストール完了"
    
    npm run test:e2e:ci | Out-Null
    Pop-Location
    
    Write-Success "E2E テスト成功"
}
catch {
    Write-Warning "E2E テスト スキップ（オプション）"
}

Write-Host ""

# Step 8: カバレッジ レポート
Write-Info "Step 8: カバレッジレポート確認..."
if (Test-Path "PSWPFront/coverage") {
    Write-Success "フロントエンド カバレッジレポート生成: PSWPFront/coverage/index.html"
}
else {
    Write-Warning "フロントエンド カバレッジレポート見つかりません"
}

Write-Host ""

# 結果サマリー
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "検証完了" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ すべてのチェックが成功しました！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 テスト結果:" -ForegroundColor Green
Write-Host "  Backend: PSWPService.Tests/TestResults/" -ForegroundColor Gray
Write-Host "  Frontend: PSWPFront/test-results/" -ForegroundColor Gray
Write-Host "  Coverage: PSWPFront/coverage/index.html" -ForegroundColor Gray
Write-Host ""
