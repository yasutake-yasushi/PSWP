cd "C:\Users\Yasushi\Project\PSWP\Jenkins"
$jarExists = Test-Path "C:\Users\Yasushi\Project\PSWP\Jenkins\agent.jar"
if (-not $jarExists) {
    Write-Host "Downloading agent.jar..."
    curl.exe -sO http://localhost:8090/jnlpJars/agent.jar
}

Write-Host "Starting Jenkins Agent..."
java -jar "C:\Users\Yasushi\Project\PSWP\Jenkins\agent.jar" 
  -url http://localhost:8090/ 
  -secret c823492687c5384017af42f05df6e752b80d900e3060cf4d4cfedbcc5b9df4d4 
  -name PSWP-Worker1 
  -workDir "C:\Users\Yasushi\Project\PSWP\Jenkins"
