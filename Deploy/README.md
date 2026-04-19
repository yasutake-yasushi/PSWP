# PSWP デプロイ

このフォルダには PSWPService を Windows Server / IIS にデプロイするためのスクリプトが含まれています。

## 📁 ファイル構成

```
Deploy/
├── deploy-iis.ps1        ← PSWPService (バックエンド) IIS デプロイスクリプト
└── deploy-frontend.ps1   ← PSWPFront (フロントエンド) IIS デプロイスクリプト
```

PSWPService プロジェクト側の関連ファイル:

```
PSWPService/
├── web.config                    ← IIS ホスティング設定 (ASP.NET Core Module V2)
└── appsettings.Production.json   ← 本番環境設定 (DB接続・CORS)
```

PSWPFront プロジェクト側の関連ファイル:

```
PSWPFront/
├── public/web.config    ← IIS 静的サイト設定 (SPA ルーティング対応)
└── .env.production      ← 本番環境設定 (VITE_API_URL)
```

## 🚀 デプロイ手順

### 前提条件

- Windows Server (IIS インストール済み)
- [ASP.NET Core Hosting Bundle](https://dotnet.microsoft.com/download) インストール済み
- .NET 10 SDK インストール済み（ビルドする場合）
- SQL Server インストール済み・データベース作成済み
- `sqlcmd` が PATH に通っていること（DB 初期セットアップ時のみ必要）

### 基本実行（デフォルト設定）

管理者権限の PowerShell で実行してください:

```powershell
cd C:\Users\Yasushi\Project\PSWP\Deploy
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\deploy-iis.ps1
```

デフォルト値:

| パラメータ | デフォルト値 |
|------------|-------------|
| `-SiteName` | `PSWP` |
| `-AppPool` | `PSWPPool` |
| `-DeployPath` | `C:\inetpub\wwwroot\pswp` |
| `-SitePort` | `80` |
| `-SqlServer` | `localhost` |
| `-SqlDatabase` | `PSWP` |
| `-CorsOrigins` | `https://pswp.example.com` |

### カスタム設定で実行

```powershell
.\deploy-iis.ps1 `
  -SiteName       "PSWP" `
  -AppPool        "PSWPPool" `
  -DeployPath     "D:\Apps\PSWP" `
  -SitePort       "8080" `
  -SqlServer      "DBSERVER\SQLEXPRESS" `
  -SqlDatabase    "PSWP_PROD" `
  -CorsOrigins    "https://pswp.example.com"
```

接続文字列を直接指定する場合:

```powershell
.\deploy-iis.ps1 `
  -SqlConnStr "Server=DBSERVER;Database=PSWP_PROD;User Id=pswp_user;Password=***;TrustServerCertificate=True;"
```

### オプション

| オプション | 説明 |
|------------|------|
| `-SkipBuild` | `dotnet publish` をスキップ（既にビルド済みの場合） |
| `-SkipDbSetup` | DB テーブル作成スクリプトの実行をスキップ（2回目以降のデプロイ） |

2回目以降のデプロイ（DB は既に作成済み）:

```powershell
.\deploy-iis.ps1 -SkipDbSetup
```

## 🔧 デプロイの流れ

```
1. dotnet publish (Release ビルド)
       ↓
2. IIS アプリケーションプール作成・設定
       ↓
3. デプロイフォルダ準備 (logs/ 作成)
       ↓
4. IIS サイト停止 → ファイルコピー → 起動
       ↓
5. IIS サイト作成または設定更新
       ↓
6. DB テーブル作成 (sqlcmd, 初回のみ)
```

## 🗃️ DB 設定について

### 開発環境 (SQLite)

`appsettings.json` の設定をそのまま使用します:

```json
{
  "DbProvider": "Sqlite",
  "ConnectionStrings": {
    "Default": "Data Source=pswp.db"
  }
}
```

### 本番環境 (SQL Server)

`appsettings.Production.json` に SQL Server の接続先を設定します:

```json
{
  "DbProvider": "SqlServer",
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=PSWP;Integrated Security=True;TrustServerCertificate=True;"
  },
  "CorsOrigins": "https://pswp.example.com"
}
```

デプロイスクリプト実行時に `-SqlServer`, `-SqlDatabase`, `-CorsOrigins` パラメータで自動的に書き換えられます。

### DB テーブル作成（手動実行）

sqlcmd が利用できる環境で手動実行する場合:

```bat
cd PSWPService\sql\sqlserver
install_all.bat DBSERVER PSWP_PROD
```

## ↩️ ロールバック

```powershell
Stop-Website -Name 'PSWP'
# 前バージョンのファイルを DeployPath に上書きコピー
Start-Website -Name 'PSWP'
```

## ✅ 動作確認

```powershell
# バックエンドのヘルスチェック
Invoke-WebRequest http://localhost/swagger

# フロントエンドをブラウザで開く
Start-Process http://localhost:3000

# IIS サイト状態確認
Get-Website | Where-Object { $_.Name -like "PSWP*" } | Select-Object Name, State, PhysicalPath
```

---

## 🖥️ PSWPFront (フロントエンド) のデプロイ

### 概要

PSWPFront は React (Vite) の SPA (シングルページアプリケーション) です。  
`npm run build` で生成した静的ファイル (`build/`) を IIS の静的サイトとして配信します。  
バックエンド API への接続先は `VITE_API_URL` 環境変数でビルド時に埋め込みます。

### 前提条件

- IIS インストール済み
- [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite) インストール済み（SPA ルーティング対応に必須）
- Node.js / npm インストール済み（ビルドする場合）

### 基本実行

```powershell
cd C:\Users\Yasushi\Project\PSWP\Deploy
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\deploy-frontend.ps1
```

デフォルト値:

| パラメータ | デフォルト値 |
|------------|-------------|
| `-SiteName` | `PSWPFront` |
| `-AppPool` | `PSWPFrontPool` |
| `-DeployPath` | `C:\inetpub\wwwroot\pswp-front` |
| `-SitePort` | `3000` |
| `-ApiUrl` | `https://api.pswp.example.com` |

### カスタム設定で実行

```powershell
.\deploy-frontend.ps1 `
  -SiteName   "PSWPFront" `
  -AppPool    "PSWPFrontPool" `
  -DeployPath "D:\wwwroot\pswp-front" `
  -SitePort   "80" `
  -ApiUrl     "https://api.pswp.example.com"
```

### デプロイの流れ

```
1. .env.production に VITE_API_URL を書き込み
       ↓
2. npm ci && npm run build (build/ フォルダ生成)
       ↓
3. IIS アプリケーションプール作成・設定
       ↓
4. IIS サイト停止 → ファイルコピー → 起動
       ↓
5. IIS サイト作成または設定更新
```

### VITE_API_URL について

`src/api/http.ts` で `import.meta.env.VITE_API_URL` を参照しています。  
ビルド時に値が静的に埋め込まれるため、デプロイスクリプトが `.env.production` を更新した後にビルドする必要があります。

```typescript
// src/api/http.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5232';
```

### SPA ルーティングの仕組み

`public/web.config` に URL Rewrite ルールが設定されています。  
`/mca`、`/strategy` などのパスへの直接アクセスも `index.html` にリダイレクトされ、React Router が正しく動作します。

```xml
<rule name="SPA Fallback" stopProcessing="true">
  <match url=".*" />
  <conditions logicalGrouping="MatchAll">
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
  </conditions>
  <action type="Rewrite" url="/index.html" />
</rule>
```
