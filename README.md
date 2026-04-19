# PSWP

PSWP は、ASP.NET Core Web API（PSWPService）と React + TypeScript（PSWPFront）で構成された業務アプリです。

## 構成

- `PSWPService/` : バックエンド API（.NET 10 / EF Core）
- `PSWPFront/` : フロントエンド（React / TypeScript）
- `Jenkins/` : CI/CD パイプライン設定
- `PSWPService.Tests/` : バックエンド ユニットテスト
- `sql/` : テーブル定義（SQLite / SQL Server）

## 📁 プロジェクト構造

```
PSWP/
├── Jenkins/                       # CI/CD パイプライン設定
│   ├── Jenkinsfile                # Jenkins パイプライン定義
│   ├── README.md                  # Jenkins セットアップガイド
│   ├── verify.sh                  # ローカル検証スクリプト (Linux/macOS)
│   └── verify.ps1                 # ローカル検証スクリプト (Windows)
│
├── PSWPService/                   # バックエンド API (.NET 10)
│   ├── Program.cs
│   ├── PSWPService.csproj
│   ├── appsettings.json
│   ├── Controllers/               # API エンドポイント
│   ├── Models/                    # エンティティモデル
│   ├── Data/                      # DbContext
│   ├── Helpers/                   # ユーティリティ
│   ├── Migrations/                # (使用しません - SQL 主導)
│   ├── Properties/
│   ├── sql/                       # SQL スクリプト
│   │   ├── sqlite/                # SQLite 定義
│   │   └── sqlserver/             # SQL Server 定義
│   └── bin/, obj/
│
├── PSWPService.Tests/             # バックエンド ユニットテスト (xUnit)
│   ├── PSWPService.Tests.csproj
│   ├── coverlet.runsettings       # カバレッジ設定
│   ├── Helpers/                   # テストヘルパー
│   ├── Integration/               # 統合テスト
│   ├── TestInfrastructure/        # テスト基盤
│   └── bin/, obj/
│
├── PSWPFront/                     # フロントエンド (React + TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts             # カバレッジ設定を含む
│   ├── public/                    # 静的アセット
│   ├── src/
│   │   ├── App.tsx, index.tsx
│   │   ├── api/                   # API 呼び出し
│   │   ├── components/            # React コンポーネント
│   │   ├── pages/                 # ページコンポーネント
│   │   ├── routes/                # ルーティング定義
│   │   └── ...
│   ├── tests/
│   │   ├── README.md              # テストガイド
│   │   ├── unit/                  # ユニットテスト (Vitest)
│   │   └── e2e/                   # E2E テスト (Playwright)
│   ├── build/                     # ビルド成果物
│   ├── coverage/                  # テストカバレッジレポート
│   ├── test-results/              # テスト結果 XML
│   └── node_modules/
│
├── README.md                      # このファイル
├── PSWP.sln                       # Visual Studio ソリューション
├── PSWP.code-workspace            # VS Code ワークスペース
└── .gitignore                     # Git 除外設定
```

## 前提

- .NET SDK 10.x
- Node.js 18+（推奨 20+）
- npm
- （SQLite をローカル初期化する場合）sqlite3 コマンド

## 開発起動

### 1) バックエンド起動

`PSWPService` で実行:

```powershell
dotnet run
```

既定URL: `http://localhost:5232`

### 2) フロントエンド起動

`PSWPFront` で実行:

```powershell
npm install
npm start
```

既定URL: `http://localhost:3000`

必要に応じて `.env` に API URL を設定:

```env
REACT_APP_API_URL=http://localhost:5232
```

## データベース初期化（SQLite）

SQL 定義を順番に適用して初期化します。

`PSWPService/sql/sqlite` で実行:

```powershell
.\install_all.bat ..\..\pswp.db
```

※ `pswp.db` は `PSWPService/pswp.db` を想定。

## 運用方針（重要）

- **スキーマ変更は SQL 定義更新を正とする（SQL 主導）**
- `PSWPService/Migrations` は使用しない
- アプリ起動時の `Database.Migrate()` は無効化済み
- `08_ef_migrations_history.sql` は不要のため削除済み

本番/開発とも、DDL 更新履歴は作業ログや変更管理で追跡してください。

## 画面별 API エンドポイント一覧

ベース URL: `http://localhost:5232`（`REACT_APP_API_URL` 環境変数で上書き可）

| 画面 | メソッド | エンドポイント | 用途 |
|------|----------|---------------|------|
| **MCA 管理** (`MCAPage`) | GET | `/api/mcas` | 一覧取得 |
| | GET | `/api/mcas/{id}` | 1件取得 |
| | POST | `/api/mcas` | 新規作成 |
| | PUT | `/api/mcas/{id}` | 更新 |
| | DELETE | `/api/mcas/{id}` | 削除 |
| **MCAパターン管理** (`MCAPatternPage`) | GET | `/api/mcapatterns` | 一覧取得 |
| | GET | `/api/mcapatterns/{id}` | 1件取得 |
| | POST | `/api/mcapatterns` | 新規作成 |
| | PUT | `/api/mcapatterns/{id}` | 更新 |
| | DELETE | `/api/mcapatterns/{id}` | 削除 |
| **メール設定** (`MailSettingPage`) | GET | `/api/mailsettings` | 一覧取得 |
| | GET | `/api/mailsettings/{id}` | 1件取得 |
| | POST | `/api/mailsettings` | 新規作成 |
| | PUT | `/api/mailsettings/{id}` | 更新 |
| | DELETE | `/api/mailsettings/{id}` | 削除 |
| **ストラテジー管理** (`StrategyPage`) | GET | `/api/strategies` | 一覧取得 |
| | POST | `/api/strategies` | 新規作成 |
| | PUT | `/api/strategies/{id}` | 更新 |
| | DELETE | `/api/strategies/{id}` | 削除 |
| **システム設定** (`SystemSettingPage`) | GET | `/api/systemsetting` | 取得（シングルトン） |
| | PUT | `/api/systemsetting` | 更新（シングルトン） |
| **契約項目管理** (`ContractItemPage`) | GET | `/api/contractitems` | 一覧取得 |
| | GET | `/api/contractitems/{id}` | 1件取得 |
| | POST | `/api/contractitems` | 新規作成 |
| | PUT | `/api/contractitems/{id}` | 更新 |
| | DELETE | `/api/contractitems/{id}` | 削除 |

## ビルドチェック

バックエンド:

```powershell
cd PSWPService
dotnet build
```

フロントエンド:

```powershell
cd PSWPFront
npx tsc --noEmit
```

## 🧪 テストとカバレッジ

### テスト構成

- **バックエンド**: xUnit（PSWPService.Tests/）
  - ユニットテスト: 各機能の単体テスト
  - Code Coverage: Coverlet で計測
  
- **フロントエンド**: Vitest + Testing Library（PSWPFront/tests/unit/）
  - ユニットテスト: コンポーネントと API テスト
  - E2E テスト: Playwright（PSWPFront/tests/e2e/）
  - Code Coverage: v8 プロバイダで計測

### ローカルでのテスト実行

**バックエンド ユニットテスト:**

```powershell
dotnet test PSWPService.Tests/PSWPService.Tests.csproj --configuration Release
```

**フロントエンド ユニットテスト:**

```powershell
cd PSWPFront
npm run test:ci           # テスト実行 + JUnit 形式で出力
npm run test -- --ui      # UI モードでインタラクティブ実行
```

**E2E テスト:**

```powershell
cd PSWPFront
npm run test:e2e          # 開発モード
npm run test:e2e:ci       # CI モード
```

**カバレッジレポート生成:**

```powershell
cd PSWPFront
npm run test -- --coverage
# 結果: PSWPFront/coverage/index.html
```

### テスト結果のディレクトリ

```
PSWPService.Tests/
└── TestResults/           # バックエンド テスト結果
    ├── *.trx              # .NET トレース形式
    └── *.xml              # xUnit 形式

PSWPFront/
├── test-results/          # フロントエンド テスト結果
│   └── vitest/
│       └── results.xml    # JUnit 形式
└── coverage/              # カバレッジレポート
    └── index.html         # HTML レポート
```

詳細は [PSWPFront/tests/README.md](./PSWPFront/tests/README.md) および [PSWPService.Tests/README.md](./PSWPService.Tests/README.md) を参照。

### CI/CD パイプライン (Jenkins)

Jenkins 上で自動実行される CI/CD パイプラインを構成しています。

**パイプラインの処理:**
1. リポジトリをチェックアウト
2. .NET と Node.js 環境をセットアップ（並行実行）
3. バックエンド・フロントエンドをビルド（並行実行）
4. ユニットテストを実行（並行実行）
5. E2E テストを実行
6. テスト結果とカバレッジレポートを集約

**Jenkins 設定ガイド:**

詳細は [Jenkins/README.md](./Jenkins/README.md) を参照してください。

初期設定時は、Jenkins の **Script Path** に `Jenkins/Jenkinsfile` を指定してください。

**ローカルでの検証:**

```bash
# Linux/macOS
./Jenkins/verify.sh

# Windows PowerShell
.\Jenkins\verify.ps1
```

### カバレッジ除外設定

カバレッジ計測から以下を除外しています。

**バックエンド (.NET):**
- `obj` 配下の生成コード
- `*.g.cs`, `*.g.i.cs`, `*generated*.cs`
- テストアセンブリ（`PSWPService.Tests`）

**フロントエンド (TypeScript/React):**
- `src/**/*.d.ts`
- `src/react-app-env.d.ts`
