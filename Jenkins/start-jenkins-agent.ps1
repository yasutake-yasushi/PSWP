# Jenkins Agent 自動起動スクリプト
# 管理者権限で実行してください

param(
    [string]$Action = "start"
)

$JenkinsMasterUrl = "http://localhost:8090"
$AgentSecret = "c823492687c5384017af42f05df6e752b80d900e3060cf4d4cfedbcc5b9df4d4"
$AgentName = "PSWP-Worker1"
$WorkDir = "C:\Users\Yasushi\Project\Jenkins"
$JarPath = "$WorkDir\agent.jar"

function Test-Admin {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
    Write-Error "このスクリプトは管理者権限で実行してください"
    exit 1
}

# agent.jar をダウンロード（存在しない場合）
if (-not (Test-Path $JarPath)) {
    Write-Host "agent.jar をダウンロード中..."
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri "$JenkinsMasterUrl/jnlpJars/agent.jar" -OutFile $JarPath
    Write-Host "ダウンロード完了: $JarPath"
}

$ServiceName = "JenkinsAgent-$AgentName"
$DisplayName = "Jenkins Agent - $AgentName"

if ($Action -eq "install") {
    Write-Host "Windowsサービスをインストール中..."
    
    # ServiceScript を作成
    $ServiceScript = @"
`$JarPath = "$JarPath"
`$JenkinsMasterUrl = "$JenkinsMasterUrl"
`$AgentSecret = "$AgentSecret"
`$AgentName = "$AgentName"
`$WorkDir = "$WorkDir"

java -jar `$JarPath -url `$JenkinsMasterUrl -secret `$AgentSecret -name `$AgentName -workDir `$WorkDir
"@
    
    $ServiceScriptPath = "$WorkDir\run-agent.ps1"
    Set-Content -Path $ServiceScriptPath -Value $ServiceScript -Encoding UTF8
    
    # NSSMでサービス化（NSSMがなければ nssm.exe をダウンロード）
    $NssmUrl = "https://nssm.cc/download/nssm-2.24-101-g897c7ad.zip"
    $NssmZip = "$WorkDir\nssm.zip"
    $NssmPath = "$WorkDir\nssm\nssm.exe"
    
    if (-not (Test-Path $NssmPath)) {
        Write-Host "NSSM (Non-Sucking Service Manager) をダウンロード中..."
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $NssmUrl -OutFile $NssmZip
        Expand-Archive -Path $NssmZip -DestinationPath $WorkDir -Force
        Get-ChildItem -Path $WorkDir -Filter "nssm*.exe" -Recurse | Move-Item -Destination $NssmPath -Force
        Remove-Item -Path $NssmZip -Force
    }
    
    # サービス作成
    & $NssmPath install $ServiceName "powershell.exe" "-NoProfile -ExecutionPolicy Bypass -File `"$ServiceScriptPath`""
    & $NssmPath set $ServiceName DisplayName $DisplayName
    & $NssmPath set $ServiceName Description "Jenkins Agent for PSWP project"
    & $NssmPath set $ServiceName Start SERVICE_AUTO_START
    & $NssmPath set $ServiceName AppDirectory $WorkDir
    & $NssmPath set $ServiceName AppNoConsole 0
    & $NssmPath set $ServiceName AppStdout "$WorkDir\logs\stdout.log"
    & $NssmPath set $ServiceName AppStderr "$WorkDir\logs\stderr.log"
    
    # ログディレクトリ作成
    $LogDir = "$WorkDir\logs"
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    
    Write-Host "✓ サービス '$DisplayName' がインストールされました"
    Write-Host "  起動コマンド: .\start-jenkins-agent.ps1 -Action start"
}
elseif ($Action -eq "start") {
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($null -eq $service) {
        Write-Error "サービス '$ServiceName' が見つかりません。まずインストールしてください: .\start-jenkins-agent.ps1 -Action install"
        exit 1
    }
    
    if ($service.Status -eq "Running") {
        Write-Host "✓ サービスは既に起動しています"
    } else {
        Write-Host "サービスを起動中..."
        Start-Service -Name $ServiceName
        Start-Sleep -Seconds 2
        $service = Get-Service -Name $ServiceName
        Write-Host "✓ サービス状態: $($service.Status)"
    }
}
elseif ($Action -eq "stop") {
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($null -eq $service) {
        Write-Host "サービスが見つかりません"
        exit 0
    }
    
    Write-Host "サービスを停止中..."
    Stop-Service -Name $ServiceName
    Write-Host "✓ サービスが停止しました"
}
elseif ($Action -eq "status") {
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($null -eq $service) {
        Write-Host "サービス '$ServiceName' が見つかりません"
    } else {
        Write-Host "サービス: $DisplayName"
        Write-Host "状態: $($service.Status)"
        Write-Host "スタートアップ: $($service.StartType)"
    }
}
elseif ($Action -eq "uninstall") {
    $NssmPath = "$WorkDir\nssm\nssm.exe"
    if (Test-Path $NssmPath) {
        Write-Host "サービスをアンインストール中..."
        & $NssmPath remove $ServiceName confirm
        Write-Host "✓ サービスがアンインストールされました"
    }
}
else {
    Write-Host "使用方法: .\start-jenkins-agent.ps1 -Action [install|start|stop|status|uninstall]"
}
