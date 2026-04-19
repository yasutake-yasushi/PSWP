# ============================================================
# deploy-iis.ps1 - PSWPService IIS デプロイスクリプト
# 管理者権限で実行してください
# ============================================================
# 使用方法:
#   .\deploy-iis.ps1
#   .\deploy-iis.ps1 -SiteName MySite -AppPool MyPool -DeployPath D:\Apps\PSWP
# ============================================================

param(
    [string]$SiteName       = "PSWP",
    [string]$AppPool        = "PSWPPool",
    [string]$DeployPath     = "C:\inetpub\wwwroot\pswp",
    [string]$SitePort       = "80",
    [string]$CorsOrigins    = "https://pswp.example.com",
    [string]$SqlServer      = "localhost",
    [string]$SqlDatabase    = "PSWP",
    [string]$SqlConnStr     = "",  # 空の場合は SqlServer/SqlDatabase から自動生成
    [switch]$SkipBuild      = $false,
    [switch]$SkipDbSetup    = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$ServiceProject = Join-Path $ProjectRoot "PSWPService\PSWPService.csproj"
$PublishDir = Join-Path $ProjectRoot "PSWPService\bin\publish"
$SqlScriptDir = Join-Path $ProjectRoot "PSWPService\sql\sqlserver"

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

if (-not (Get-Command "dotnet" -ErrorAction SilentlyContinue)) {
    Write-Error ".NET SDK が見つかりません。インストールしてください: https://dotnet.microsoft.com/download"
    exit 1
}

if (-not (Get-WindowsFeature -Name Web-Server -ErrorAction SilentlyContinue)?.Installed) {
    # Get-WindowsFeature が使えない環境（Windows クライアント）でも続行
    Write-Host "警告: IIS のインストール確認をスキップしました" -ForegroundColor Yellow
}

# 接続文字列の組み立て
if ([string]::IsNullOrEmpty($SqlConnStr)) {
    $SqlConnStr = "Server=$SqlServer;Database=$SqlDatabase;Integrated Security=True;TrustServerCertificate=True;"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " PSWPService IIS デプロイ" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  サイト名     : $SiteName"
Write-Host "  アプリプール : $AppPool"
Write-Host "  デプロイ先   : $DeployPath"
Write-Host "  ポート       : $SitePort"
Write-Host "  CORS オリジン: $CorsOrigins"
Write-Host "  DB 接続文字列: $SqlConnStr"
Write-Host "============================================================" -ForegroundColor Green

# ============================================================
# 1. ビルド & パブリッシュ
# ============================================================
if (-not $SkipBuild) {
    Write-Step "1. dotnet publish"

    if (Test-Path $PublishDir) {
        Remove-Item -Recurse -Force $PublishDir
    }

    dotnet publish $ServiceProject `
        --configuration Release `
        --output $PublishDir `
        --self-contained false

    if ($LASTEXITCODE -ne 0) {
        Write-Error "dotnet publish が失敗しました"
        exit 1
    }

    Write-Host "✓ パブリッシュ完了: $PublishDir" -ForegroundColor Green
} else {
    Write-Host "ビルドをスキップしました (-SkipBuild)" -ForegroundColor Yellow
}

# ============================================================
# 2. IIS アプリケーションプール作成・設定
# ============================================================
Write-Step "2. アプリケーションプール設定"

Import-Module WebAdministration -ErrorAction Stop

$pool = Get-WebConfiguration "system.applicationHost/applicationPools/add[@name='$AppPool']"
if ($null -eq $pool) {
    New-WebAppPool -Name $AppPool
    Write-Host "✓ アプリプール '$AppPool' を作成しました" -ForegroundColor Green
} else {
    Write-Host "  アプリプール '$AppPool' は既に存在します"
}

# .NET CLR バージョンなし（ASP.NET Core = No Managed Code）
Set-ItemProperty "IIS:\AppPools\$AppPool" managedRuntimeVersion ""
# 64bit 有効
Set-ItemProperty "IIS:\AppPools\$AppPool" enable32BitAppOnWin64 $false
# アイドルタイムアウト無効（常時起動）
Set-ItemProperty "IIS:\AppPools\$AppPool" processModel.idleTimeout "00:00:00"

Write-Host "✓ アプリプールを設定しました" -ForegroundColor Green

# ============================================================
# 3. デプロイ先フォルダ作成
# ============================================================
Write-Step "3. デプロイフォルダ準備"

if (-not (Test-Path $DeployPath)) {
    New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
    Write-Host "✓ フォルダ作成: $DeployPath" -ForegroundColor Green
}

# logs フォルダ作成（stdout ログ用）
$LogDir = Join-Path $DeployPath "logs"
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# ============================================================
# 4. IIS サイト停止 → ファイルコピー → 起動
# ============================================================
Write-Step "4. ファイルデプロイ"

$site = Get-Website -Name $SiteName -ErrorAction SilentlyContinue
if ($null -ne $site) {
    Write-Host "  サイト '$SiteName' を停止中..."
    Stop-Website -Name $SiteName
    Start-Sleep -Seconds 2
}

# ファイルコピー（ログ・DB ファイルは上書きしない）
$ExcludePatterns = @("*.log", "*.db", "*.db-shm", "*.db-wal")
Get-ChildItem -Path $PublishDir | ForEach-Object {
    $dest = Join-Path $DeployPath $_.Name
    $skip = $ExcludePatterns | Where-Object { $_.Name -like $_ }
    if (-not $skip) {
        Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
    }
}

Write-Host "✓ ファイルのコピーが完了しました" -ForegroundColor Green

# appsettings.Production.json の接続文字列を書き換え
$AppSettingsPath = Join-Path $DeployPath "appsettings.Production.json"
if (Test-Path $AppSettingsPath) {
    $json = Get-Content $AppSettingsPath -Raw | ConvertFrom-Json
    $json.ConnectionStrings.Default = $SqlConnStr
    $json.CorsOrigins = $CorsOrigins
    $json | ConvertTo-Json -Depth 10 | Set-Content $AppSettingsPath -Encoding UTF8
    Write-Host "✓ appsettings.Production.json を更新しました" -ForegroundColor Green
}

# ============================================================
# 5. IIS サイト作成または更新
# ============================================================
Write-Step "5. IIS サイト設定"

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
# 6. DB セットアップ（初回のみ）
# ============================================================
if (-not $SkipDbSetup) {
    Write-Step "6. DB テーブル作成 (sqlcmd)"

    if (-not (Get-Command "sqlcmd" -ErrorAction SilentlyContinue)) {
        Write-Host "警告: sqlcmd が見つかりません。DB セットアップをスキップします。" -ForegroundColor Yellow
        Write-Host "  手動で実行: $SqlScriptDir\install_all.bat $SqlServer $SqlDatabase" -ForegroundColor Yellow
    } else {
        $SqlFiles = Get-ChildItem -Path $SqlScriptDir -Filter "*.sql" | Sort-Object Name
        foreach ($sqlFile in $SqlFiles) {
            Write-Host "  実行: $($sqlFile.Name)"
            sqlcmd -S $SqlServer -d $SqlDatabase -E -i $sqlFile.FullName
            if ($LASTEXITCODE -ne 0) {
                Write-Error "SQL スクリプト '$($sqlFile.Name)' の実行に失敗しました"
                exit 1
            }
        }
        Write-Host "✓ DB セットアップ完了" -ForegroundColor Green
    }
} else {
    Write-Host "DB セットアップをスキップしました (-SkipDbSetup)" -ForegroundColor Yellow
}

# ============================================================
# 完了
# ============================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " デプロイ完了!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  URL: http://localhost:$SitePort"
Write-Host ""
Write-Host "動作確認:"
Write-Host "  Invoke-WebRequest http://localhost:$SitePort/swagger"
Write-Host ""
Write-Host "ロールバックしたい場合:"
Write-Host "  Stop-Website -Name '$SiteName'"
Write-Host "  # 前バージョンのファイルを $DeployPath に上書き"
Write-Host "  Start-Website -Name '$SiteName'"
