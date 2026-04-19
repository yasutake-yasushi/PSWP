# Windows タスクスケジューラーに Jenkins Agent を登録
# 管理者権限で実行してください

$TaskName = "JenkinsAgent-PSWP-Worker1"
$WorkDir = "C:\Users\Yasushi\Project\PSWP\Jenkins"
$JarPath = "$WorkDir\agent.jar"

# タスク用PowerShellスクリプト作成
$TaskScript = @"
cd "$WorkDir"
`$jarExists = Test-Path "$JarPath"
if (-not `$jarExists) {
    Write-Host "Downloading agent.jar..."
    curl.exe -sO http://localhost:8090/jnlpJars/agent.jar
}

Write-Host "Starting Jenkins Agent..."
java -jar "$JarPath" `
  -url http://localhost:8090/ `
  -secret c823492687c5384017af42f05df6e752b80d900e3060cf4d4cfedbcc5b9df4d4 `
  -name PSWP-Worker1 `
  -workDir "$WorkDir"
"@

$ScriptPath = "$WorkDir\run-jenkins-agent.ps1"
Set-Content -Path $ScriptPath -Value $TaskScript -Encoding UTF8

# 既存タスクがあれば削除
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "既存タスクを削除中..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# タスク実行時の設定
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`"" `
    -WorkingDirectory $WorkDir

$trigger = New-ScheduledTaskTrigger -AtStartup

$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries

# 現在のユーザーで実行するため、SYSTEM ではなく実ユーザー指定
$principal = New-ScheduledTaskPrincipal `
    -UserId "$($env:USERDOMAIN)\$($env:USERNAME)" `
    -LogonType Interactive `
    -RunLevel Highest

# タスク作成・登録
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Automatically start Jenkins Agent PSWP-Worker1 at system startup" `
    -Force

Write-Host ""
Write-Host "✓ タスク '$TaskName' が登録されました"
Write-Host "  スクリプト: $ScriptPath"
Write-Host "  実行ユーザー: $($env:USERDOMAIN)\$($env:USERNAME)"
Write-Host ""
Write-Host "次回起動時に自動実行されます。"
Write-Host ""
Write-Host "管理用コマンド:"
Write-Host "  確認:   Get-ScheduledTask -TaskName '$TaskName' | Select-Object State, LastRunTime"
Write-Host "  実行:   Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "  削除:   Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
