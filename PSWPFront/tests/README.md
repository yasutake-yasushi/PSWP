# PSWPFront Tests

このディレクトリは PSWPFront のテストコードをまとめたものです。

## テスト構成

- unit: [tests/unit](unit)
  - Vitest + Testing Library を使ったユニット/コンポーネントテスト
  - API ラッパー、ページ、モーダル、共通部品の振る舞いを検証
- e2e: [tests/e2e](e2e)
  - Playwright を使ったブラウザ E2E テスト
  - 主要画面の表示と基本導線を検証

## 実行コマンド

PSWPFront ディレクトリで実行します。

- Unit: npm run test:ci
- E2E: npm run test:e2e:ci
- Coverage: npm run test -- --coverage

## テスト対象コード

アプリ本体として以下を対象にしています。

Vitest の coverage 設定（vite.config.ts）では、`src/**/*.{ts,tsx}` を計測対象にしています。

- src 配下
  - src/api
  - src/components
  - src/pages
  - src/routes
  - src/App.tsx
  - src/main.tsx

## テスト対象外コード

以下はテスト対象外、またはカバレッジ評価対象外とします。

- build 配下
  - 理由: ビルド成果物(生成コード)であり、手書きコードではないため。
- dist 配下
  - 理由: ビルド成果物(生成コード)であり、手書きコードではないため。
- node_modules 配下
  - 理由: 外部ライブラリであり、プロジェクトの責務外のため。
- test-results 配下
  - 理由: 実行時レポート出力であり、検証対象のソースコードではないため。
- coverage 配下
  - 理由: カバレッジレポートの生成結果であり、ソースコードではないため。
- 設定ファイル (例: playwright.config.ts, vite.config.ts, tsconfig.json)
  - 理由: 実行設定・開発設定のため。coverage 対象を src 配下に限定しているため。

## カバレッジの確認方法

PSWPFront ディレクトリで以下を実行します。

- コマンド: npm run test -- --coverage
- HTML レポート: coverage/index.html
- Cobertura レポート: coverage/cobertura-coverage.xml

確認時の注意点:
- 本プロジェクトでは `src` 配下をカバレッジ評価対象とします。
- `tests`、`build`、`dist`、`node_modules`、設定ファイルは評価対象外です。

## 補足

- Unit テストは「UI ロジック/API 呼び出し/分岐」を重視しています。
- E2E テストは「ユーザー操作の主要シナリオ」を重視しています。
- 仕様変更時は、対象コードと対象外コードの定義をこの README で更新してください。
