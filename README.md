# PSWP

PSWP は以下で構成される業務アプリケーションです。

- PSWPService: ASP.NET Core Web API (.NET 10)
- PSWPFront: React + TypeScript + Vite フロントエンド
- Jenkins / Deploy: CI/CD と IIS デプロイ用スクリプト

## リポジトリ構成

```text
PSWP/
├── README.md
├── PSWP.sln
├── Jenkins/
│   ├── Jenkinsfile
│   ├── verify.ps1
│   ├── verify.sh
│   └── README.md
├── Deploy/
│   ├── deploy-iis.ps1
│   ├── deploy-frontend.ps1
│   └── README.md
├── PSWPService/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Production.json
│   ├── web.config
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── sql/
├── PSWPService.Tests/
└── PSWPFront/
    ├── package.json
    ├── vite.config.ts
    ├── .env.production
    ├── public/web.config
    ├── src/
    └── tests/
        ├── unit/
        └── e2e/
            ├── README.md
            ├── smoke.spec.ts
            ├── pages/
            └── support/
```

## 前提条件

- .NET SDK 10.x
- Node.js 20+
- npm
- （任意）sqlite3
- Playwright ブラウザ（E2E 実行用）

Playwright ブラウザが未導入の場合は一度だけ実行してください。

```bash
cd PSWPFront
npm run playwright:install
```

## ローカル開発

### バックエンド（PSWPService）

```powershell
cd PSWPService
dotnet run
```

既定 URL:

- http://localhost:5232

### フロントエンド（PSWPFront）

```powershell
cd PSWPFront
npm ci
npm run dev
```

既定 URL:

- http://localhost:5173

### フロントエンド API URL

フロントエンドは Vite の環境変数 `VITE_API_URL` を参照します。

例:

```env
VITE_API_URL=http://localhost:5232
```

## データベース

### 開発時の既定

- `PSWPService/appsettings.json` の SQLite を使用

### 本番想定

- `PSWPService/appsettings.Production.json` の SQL Server を使用
- 設定値 `DbProvider`（`Sqlite` / `SqlServer`）で切り替え

## 画面別 API エンドポイント

ベース URL:

- `http://localhost:5232`（または `VITE_API_URL` の値）

| 画面 | メソッド | エンドポイント | 用途 |
|------|----------|---------------|------|
| MCA (`MCAPage`) | GET | `/api/mcas` | 一覧取得 |
| MCA (`MCAPage`) | GET | `/api/mcas/{id}` | 1件取得 |
| MCA (`MCAPage`) | POST | `/api/mcas` | 新規作成 |
| MCA (`MCAPage`) | PUT | `/api/mcas/{id}` | 更新 |
| MCA (`MCAPage`) | DELETE | `/api/mcas/{id}` | 削除 |
| MCA Pattern (`MCAPatternPage`) | GET | `/api/mcapatterns` | 一覧取得 |
| MCA Pattern (`MCAPatternPage`) | GET | `/api/mcapatterns/{id}` | 1件取得 |
| MCA Pattern (`MCAPatternPage`) | POST | `/api/mcapatterns` | 新規作成 |
| MCA Pattern (`MCAPatternPage`) | PUT | `/api/mcapatterns/{id}` | 更新 |
| MCA Pattern (`MCAPatternPage`) | DELETE | `/api/mcapatterns/{id}` | 削除 |
| Mail Setting (`MailSettingPage`) | GET | `/api/mailsettings` | 一覧取得 |
| Mail Setting (`MailSettingPage`) | GET | `/api/mailsettings/{id}` | 1件取得 |
| Mail Setting (`MailSettingPage`) | POST | `/api/mailsettings` | 新規作成 |
| Mail Setting (`MailSettingPage`) | PUT | `/api/mailsettings/{id}` | 更新 |
| Mail Setting (`MailSettingPage`) | DELETE | `/api/mailsettings/{id}` | 削除 |
| Strategy (`StrategyPage`) | GET | `/api/strategies` | 一覧取得 |
| Strategy (`StrategyPage`) | POST | `/api/strategies` | 新規作成 |
| Strategy (`StrategyPage`) | PUT | `/api/strategies/{id}` | 更新 |
| Strategy (`StrategyPage`) | DELETE | `/api/strategies/{id}` | 削除 |
| System Setting (`SystemSettingPage`) | GET | `/api/systemsetting` | 取得（シングルトン） |
| System Setting (`SystemSettingPage`) | PUT | `/api/systemsetting` | 更新（シングルトン） |
| Contract Item (`ContractItemPage`) | GET | `/api/contractitems` | 一覧取得 |
| Contract Item (`ContractItemPage`) | GET | `/api/contractitems/{id}` | 1件取得 |
| Contract Item (`ContractItemPage`) | POST | `/api/contractitems` | 新規作成 |
| Contract Item (`ContractItemPage`) | PUT | `/api/contractitems/{id}` | 更新 |
| Contract Item (`ContractItemPage`) | DELETE | `/api/contractitems/{id}` | 削除 |

## ビルドとテスト

### バックエンドのビルド / テスト

```powershell
cd PSWPService
dotnet build

cd ..
dotnet test PSWPService.Tests/PSWPService.Tests.csproj --configuration Release
```

### フロントエンドのユニットテスト（Vitest）

```powershell
cd PSWPFront
npm run test:ci
```

### フロントエンドの E2E テスト（Playwright）

E2E 全体実行:

```powershell
cd PSWPFront
npm run test:e2e
```

CI モード実行:

```powershell
cd PSWPFront
npm run test:e2e:ci
```

ブラウザを表示して実行:

```powershell
cd PSWPFront
npm run test:e2e -- --headed
```

Playwright UI モード:

```powershell
cd PSWPFront
npx playwright test --ui
```

### Playwright テスト構成

- `PSWPFront/tests/e2e/smoke.spec.ts`
  - スモークテストと主要導線の確認
- `PSWPFront/tests/e2e/pages/*.spec.ts`
  - ページ単位のE2Eシナリオ（保守性向上）
- `PSWPFront/tests/e2e/support/guiTestSetup.ts`
  - 共通APIモック / 共通ナビゲーションヘルパー

E2E の詳細カバレッジとチェックリスト:

- `PSWPFront/tests/e2e/README.md`

## CI/CD（Jenkins）

Jenkins パイプラインでは以下を実行します。

1. Checkout
2. Setup（.NET / Node）
3. Build（Backend / Frontend）
4. Test（Unit + E2E）
5. Coverage / Test Report の集約

詳細:

- `Jenkins/README.md`
- `Jenkins/Jenkinsfile`

ローカルでの CI 再現:

```bash
# Linux/macOS
./Jenkins/verify.sh

# Windows PowerShell
.\Jenkins\verify.ps1
```

## デプロイ

IIS デプロイスクリプトと手順:

- バックエンド: `Deploy/deploy-iis.ps1`
- フロントエンド: `Deploy/deploy-frontend.ps1`
- 詳細手順: `Deploy/README.md`
