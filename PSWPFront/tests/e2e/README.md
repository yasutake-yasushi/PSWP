# E2E Test Coverage (Playwright)

このディレクトリには、PSWPFront の Playwright E2E テストを配置しています。

## 対象ファイル

- `smoke.spec.ts`
- `pages/contract-item.spec.ts`
- `pages/mca.spec.ts`
- `pages/mca-pattern.spec.ts`
- `pages/mail-setting.spec.ts`
- `pages/system-setting.spec.ts`
- `support/guiTestSetup.ts` （共通モック・遷移ヘルパー）

## テスト一覧（領域別）

### 1. Contract Item

- 必須項目未入力時のバリデーション表示
- 新規作成モーダルからの作成成功（POST payload 検証）

### 2. MCA

- 必須項目未入力時のバリデーション表示
- 新規作成モーダルからの作成成功（POST payload 検証）

### 3. MCA Pattern

- 必須項目未入力時のバリデーション表示
- MCA ID 選択・Special Notes 入力を含む作成成功（POST payload 検証）

### 4. Mail Setting

- 必須項目未入力時のバリデーション表示
- Message タブ入力を含む作成成功（POST payload 検証）

### 5. Strategy

- 新規作成モーダルからの作成成功
- 削除確認ダイアログ経由の削除成功
- 必須項目未入力時のバリデーション表示

### 6. System Setting

- 初期値表示と更新成功（PUT payload 検証）
- 更新 API 失敗時のエラーメッセージ表示

### 7. Navigation / Smoke

- ダッシュボード表示確認
- サイドバーから主要ページへの遷移確認

## 実行方法

```bash
# E2E 全体
npm run test:e2e

# スモークのみ
npx playwright test tests/e2e/smoke.spec.ts

# ページ分割されたGUIカバレッジ群
npx playwright test tests/e2e/pages

# 画面表示ありで実行
npm run test:e2e -- --headed

# Playwright UI
npx playwright test --ui
```

## 注意点

- 現在のテストは API をモックしており、フロントエンド UI 挙動の回帰検知を主目的としています。
- 実 API 連携の疎通確認は別途ステージング環境で実施してください。

## 未カバー項目チェックリスト

### Contract Item

- [ ] 編集（Edit）保存の正常系
- [ ] 削除（Delete）確認ダイアログ経由の正常系
- [ ] Data Type / Values の組み合わせバリデーション

### MCA

- [ ] Contract Item Selector（Edit ボタン）での選択反映
- [ ] 編集（Edit）保存の正常系
- [ ] 削除（Delete）確認ダイアログ経由の正常系

### MCA Pattern

- [ ] Contract / Trade タブの行追加・削除
- [ ] Bool / Enum 型の Value セレクト分岐
- [ ] 編集（Edit）保存の正常系

### Mail Setting

- [ ] Address タブの行追加・削除
- [ ] Kind（To/CC/BCC）切り替え保存
- [ ] 編集（Edit）保存の正常系

### Strategy

- [ ] 編集（Edit）保存の正常系
- [ ] API エラー時のメッセージ表示

### System Setting

- [ ] Reload ボタンでの再取得反映
- [ ] 初期取得（GET）失敗時のエラー表示

### Navigation / 共通

- [ ] 各ページの Reload ボタン動作確認
- [ ] 画面遷移後のURL直打ちリロード耐性（SPA fallback）
- [ ] テーブル空状態 / 大量データ時の表示崩れ確認
