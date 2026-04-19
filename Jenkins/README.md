# Jenkins CI/CD パイプライン

このフォルダには、PSWP プロジェクトを Jenkins 上で自動実行するための設定ファイルと検証スクリプトが含まれています。

## 📁 ファイル構成

```
PSWP/
├── README.md
└── Jenkins/
    ├── README.md            ← このファイル
    ├── Jenkinsfile          ← Jenkins パイプライン定義
    ├── verify.sh            ← ローカル検証スクリプト (Linux/macOS)
    └── verify.ps1           ← ローカル検証スクリプト (Windows PowerShell)
```

## 🚀 クイックスタート

### 1. 前提条件

**Jenkins サーバー環境:**
- Jenkins 2.418+
- .NET SDK 10.0 以上
- Node.js 18.0 以上（推奨: 20.0 以上）
- npm 9.0 以上
- Git プラグイン（標準で含まれています）

**必要なプラグイン:**
1. **Pipeline** - Jenkins パイプライン機能
2. **Blue Ocean** - パイプラインの可視化（オプション）
3. **JUnit Plugin** - テスト結果の集約
4. **Timestamper** - ログのタイムスタンプ
5. **HTML Publisher** - HTMLレポート表示（カバレッジレポート用）

**プラグインのインストール手順:**
- Jenkins 管理画面 → プラグインの管理 → 利用可能 タブから検索
- チェックボックスを有効にして「インストール」をクリック

### 2. Jenkins でのパイプライン設定

#### 方法1: Jenkinsfile from SCM（推奨）

1. **New Item** をクリック
2. パイプライン名を入力（例: `PSWP-CI`）
3. **Pipeline** を選択して **OK**
4. **パイプライン** セクションで：
   - Definition: **Pipeline script from SCM** を選択
   - SCM: **Git** を選択
   - Repository URL: `https://github.com/yourusername/PSWP.git`
   - Branch: `*/master` または `*/main`
   - **Script Path: `Jenkins/Jenkinsfile` ⚠️ 必須**
5. **保存**

`checkout scm` エラーを避けるため、上記の **Pipeline script from SCM** を推奨します。

もし `Pipeline script` 方式で作成する場合は、Jenkins ジョブ側で `GIT_URL`（必要に応じて `BRANCH_NAME`）を環境変数として設定してください。

#### 方法2: Declarative Pipeline UI

1. **New Item** をクリック
2. パイプライン名を入力
3. **Pipeline** を選択して **OK**
4. **パイプライン** セクションで：
   - Definition: **Pipeline script** を選択
   - `Jenkinsfile` の内容を **Script** エリアにコピー＆ペースト
5. **保存**

この方式では、Jenkinsfile のビルドパラメータを設定して実行します。

- REPO_URL: 例 https://github.com/your-org/your-repo.git
- REPO_BRANCH: 例 master または main

### 3. ローカルでの検証

パイプラインと同じ処理をローカルで実行して検証できます。

**Linux/macOS:**
```bash
./Jenkins/verify.sh
```

**Windows PowerShell:**
  --no-build \
  --logger "trx;LogFileName=TestResults.trx" \
  --logger "junit;LogFilePath=TestResults/junit-results.xml" \
  --collect:"XPlat Code Coverage"
```

### フロントエンド依存関係とテスト実行

```bash
cd PSWPFront
rm -rf node_modules
npm ci --include=dev
npx --no-install vite --version
npm run test:ci
npm run test:e2e:ci
npm run test -- --coverage
```

Windows では `rm -rf node_modules` の代わりに PowerShell で削除するか、ローカル検証用の [Jenkins/verify.ps1](Jenkins/verify.ps1) を使用してください。

### Jenkins コンソールに `\u001b[90m` のような文字が出る

原因:
- Vitest や npm の ANSI カラー制御コードが Jenkins のコンソールにそのまま表示されている

現在の [Jenkins/Jenkinsfile](Jenkins/Jenkinsfile) では、以下の環境変数で色付き出力を抑制しています。

```groovy
environment {
    CI = 'true'
    NO_COLOR = '1'
    FORCE_COLOR = '0'
    npm_config_color = 'false'
}
```

そのため、最新の Jenkinsfile を使っていれば通常は読みにくい制御コードは大きく減ります。

### フロントエンドテストで `act(...)` 警告が出る

これは Jenkins の表示崩れではなく、React テスト中の state update が `act(...)` で適切にラップされていないことを示す警告です。

現状:
- ビルド失敗要因ではない
- ログには出るがテスト自体は通る場合がある

警告自体を消すには、対象テストコードを修正する必要があります。
1. Checkout          : リポジトリから最新コードを取得
2. Setup             : .NET と Node.js 環境をセットアップ（並行実行）
3. Build             : バックエンド・フロントエンドをビルド（並行実行）
4. Test              : ユニットテスト実行（並行実行）
   - Backend: dotnet test + Code Coverage
   - Frontend: npm run test:ci (JUnit 形式)
5. E2E Tests         : Playwright E2E テスト実行
6. Coverage Reports  : カバレッジレポート生成
7. Post Actions      : テスト結果の集約・キャッシュクリア
```

### 実行フローの図

```
Checkout
  ↓
Setup (並行実行)
  ├─ Setup .NET
  └─ Setup Node.js
  ↓
Build (並行実行)
  ├─ Build Backend
  └─ Build Frontend
  ↓
Test (並行実行)
  ├─ Backend Unit Tests
  └─ Frontend Unit Tests
  ↓
E2E Tests
  ↓
Coverage Reports
  ↓
Post Actions
  ├─ テスト結果の集約
  ├─ カバレッジレポート生成
  └─ キャッシュクリア
```

## 📊 テスト結果の見方

### バックエンド テスト結果

- **テスト結果**: Jenkins ダッシュボード → パイプライン → **テスト結果**
  - xUnit 形式で PSWPService.Tests の結果を表示
  - **Code Coverage**: TestResults ディレクトリ内

### フロントエンド テスト結果

- **テスト結果**: Jenkins ダッシュボード → パイプライン → **テスト結果**
  - JUnit 形式で PSWPFront の結果を表示

### カバレッジレポート

- Jenkins ビルド結果ページの **Frontend Coverage Report** リンク
- `PSWPFront/coverage/index.html` を表示
- 行・分岐・関数のカバレッジ統計が確認可能

## 🔄 ビルド トリガーの設定

### GitHub Webhook トリガー（推奨）

1. **パイプライン設定** → **ビルドトリガー** セクション
2. **GitHub hook trigger for GITScm polling** を有効化
3. GitHub リポジトリ設定：
   - Settings → Webhooks → **Add webhook**
   - Payload URL: `http://your-jenkins-domain/github-webhook/`
   - Content type: `application/json`
   - **Add webhook**

### ポーリング トリガー

1. **ビルドトリガー** → **Poll SCM** を有効化
2. スケジュール例：
   ```
   # 毎日午前1時
   0 1 * * *
   
   # 営業日の毎時間
   H * * * 1-5
   ```

## 🧪 テスト実行スクリプト

### バックエンドテスト実行

```bash
dotnet test PSWPService.Tests/PSWPService.Tests.csproj \
  --configuration Release \
  --logger "xunit;LogFileName=xunit-results.xml" \
  --collect:"XPlat Code Coverage"
```

### フロントエンドテスト実行

```bash
cd PSWPFront
npm install
npm run test:ci
npm run test:e2e:ci
```

## 🔧 トラブルシューティング

### 1. ".NET SDK が見つからない" エラー

**解決方法:**
- Jenkins マシンに .NET 10 SDK がインストールされていることを確認
- Jenkins ジョブの環境変数に PATH を設定

```groovy
environment {
    PATH = "/usr/bin/dotnet:${PATH}"
}
```

**確認コマンド:**
```bash
dotnet --version
```

### 2. "npm: command not found" エラー

**解決方法:**
- Jenkins マシンに Node.js がインストールされていることを確認
- Jenkins ジョブの環境変数に PATH を設定

```groovy
environment {
    PATH = "/usr/bin/node:${PATH}"
}
```

**確認コマンド:**
```bash
node --version
npm --version
```

### 3. テスト結果が表示されない

**確認項目:**
- JUnit Plugin がインストール済みか確認
- テスト結果 XML ファイルが生成されているか確認
- `post` ブロックの `junit` パターンが正しいか確認

### 4. Source checkout is not configured エラー

エラー例:

```
ERROR: Source checkout is not configured. Use "Pipeline script from SCM" or set GIT_URL/BRANCH_NAME.
```

解決方法:
1. 推奨: ジョブ定義を Pipeline script from SCM にする
2. もしくは、Build with Parameters で REPO_URL と REPO_BRANCH を設定して実行する

例:
- REPO_URL: https://github.com/your-org/your-repo.git
- REPO_BRANCH: master

### 5. `MSB1009` や `npm error Missing script: test:ci` が同時に出る

症状例:
- `MSBUILD : error MSB1009: プロジェクト ファイルが存在しません。`
- `npm error Missing script: "test:ci"`

原因:
- PSWP とは異なるリポジトリ、または誤ったブランチをチェックアウトしている

解決方法:
1. REPO_URL が PSWP リポジトリを指していることを確認
2. REPO_BRANCH が正しいブランチ（master/main）であることを確認
3. Jenkins ジョブの Workspace を一度削除して再実行
4. 可能なら `Pipeline script from SCM` に切り替える

### 6. E2E テスト がタイムアウト

**解決方法:**
- `timeout(time: 30, unit: 'MINUTES')` の値を増やす
- または E2E テストを別パイプラインに分離

### 5. `checkout scm` エラー

エラー例:

```
ERROR: 'checkout scm' is only available when using "Multibranch Pipeline" or "Pipeline script from SCM"
```

**原因:**
- ジョブ定義が `Pipeline script` で、SCM 情報を Jenkins が自動的に持っていない

**解決方法:**
1. ジョブ定義を `Pipeline script from SCM` に変更する（推奨）
2. もしくはジョブに `GIT_URL`（必要なら `BRANCH_NAME`）を設定する

## ✅ ビルド成功時の期待動作

### 成功メッセージ

```
✅ ビルド・テスト成功！
```

### テスト結果の表示

- Backend: xUnit 形式
- Frontend: JUnit 形式
- Coverage: HTML レポート（Frontend Coverage Report）

## ❌ ビルド失敗時

### エラーメッセージ

```
❌ ビルド・テスト失敗！
```

### 確認方法

1. Jenkins ビルドログを確認
2. 失敗したテストのスタックトレースを確認
3. ローカルで同じコマンドを実行してリプロデュース

## 🔗 ローカルテストとの同期

### Jenkins 環境でテストを実行

```bash
# バックエンド
dotnet test PSWPService.Tests/PSWPService.Tests.csproj

# フロントエンド
cd PSWPFront
npm run test:ci
npm run test:e2e:ci
```

### ローカル開発環境での同等実行

```bash
# バックエンド
dotnet test PSWPService.Tests/PSWPService.Tests.csproj \
  --configuration Release

# フロントエンド
npm run test:ci
npm run test:e2e
```

## 📚 参考資料

- [Jenkinsfile Documentation](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)
- [Jenkins Plugins](https://plugins.jenkins.io/)
- [xUnit Plugin](https://plugins.jenkins.io/xunit/)
- [Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
