# PSWP

PSWP は、ASP.NET Core Web API（PSWPService）と React + TypeScript（PSWPFront）で構成された業務アプリです。

## 構成

- `PSWPService/` : バックエンド API（.NET 10 / EF Core）
- `PSWPFront/` : フロントエンド（React / TypeScript）
- `PSWPService/sql/` : テーブル定義（SQLite / SQL Server）

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

## テストとカバレッジ

`PSWP` ルートで実行:

```powershell
dotnet test .\PSWP.sln -c Release --settings .\PSWPService.Tests\coverlet.runsettings --logger:"junit;LogFilePath=TestResults/{assembly}.xml" --collect:"XPlat Code Coverage" --results-directory TestResults
```

この設定では、カバレッジから以下を除外します。

- `obj` 配下の生成コード
- `*.g.cs`, `*.g.i.cs`, `*generated*.cs`
- テストアセンブリ（`PSWPService.Tests`）
