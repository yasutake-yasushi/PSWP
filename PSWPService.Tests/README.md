# PSWPService.Tests

この README は、PSWPService.Tests における「カバレッジ計測対象」と「除外対象」を明示するためのドキュメントです。

## 1. カバレッジ計測の前提

- カバレッジ設定ファイル: PSWPService.Tests/coverlet.runsettings
- 収集形式: Cobertura
- テスト種別: xUnit（単体テスト + API 統合テスト）

## 2. テスト対象となっているコード（計測対象）

coverlet.runsettings の Include 設定により、PSWPService アセンブリを計測対象としています。

- Include: [PSWPService]*

主な対象コードは以下です。

- PSWPService/Controllers 配下
  - ContractItemsController
  - MCAsController
  - MCAPatternsController
  - MailSettingsController
  - StrategiesController
  - SystemSettingController
- PSWPService/Helpers 配下
  - AuditHelper
  - DbSetExtensions
- PSWPService/Data 配下
  - AppDbContext
- PSWPService/Models 配下
  - ContractItem
  - MCA
  - MCAPattern
  - MailSetting
  - Strategy
  - SystemSetting
- PSWPService/Program.cs

注記:
- 実際にどこまでヒットするかはテストケースに依存します。
- 本プロジェクトでは、上記業務コードをカバレッジ指標の評価対象とします。

## 3. 除外されているコード（計測対象外）

coverlet.runsettings の Exclude / ExcludeByFile 設定で、以下を除外しています。

### 3.1 テストアセンブリの除外

- Exclude: [PSWPService.Tests]*
- 除外理由:
  - テストコード自体の実行率を業務コード品質の指標に混ぜないため。
  - CI のカバレッジ値を「本番で動くアプリケーションコード」に限定するため。

### 3.2 テストフレームワーク由来コードの除外

- Exclude: [xunit.*]*
- 除外理由:
  - xUnit ランタイム内部のコードはプロダクトコードではないため。
  - 外部フレームワークの実行分をカバレッジに含めると指標が歪むため。

### 3.3 生成コードの除外

- ExcludeByFile:
  - **/obj/**
  - **/*generated*.cs
  - **/*.g.cs
  - **/*.g.i.cs
- 除外理由:
  - ビルド・ソースジェネレータが自動生成するコードであり、手書きの業務ロジックではないため。
  - 生成コードを含めると、変更不能な実装によりカバレッジが不当に低下するため。
  - チームの改善アクション（テスト追加）で直接コントロールできる範囲に指標を限定するため。

## 4. CI での実行コマンド

PSWP ルートで以下を実行します。

dotnet test .\PSWP.sln -c Release --settings .\PSWPService.Tests\coverlet.runsettings --logger:"junit;LogFilePath=TestResults/{assembly}.xml" --collect:"XPlat Code Coverage" --results-directory TestResults

## 5. 運用ルール

## 5. カバレッジの確認方法

PSWP ルートで以下を実行します。

dotnet test .\PSWP.sln -c Release --settings .\PSWPService.Tests\coverlet.runsettings --logger:"junit;LogFilePath=TestResults/{assembly}.xml" --collect:"XPlat Code Coverage" --results-directory TestResults

確認時の目安:
- カバレッジXML: TestResults 配下の `coverage.cobertura.xml`
- テスト結果XML: TestResults 配下の `*.xml`
- 評価対象: 本README「2. テスト対象となっているコード（計測対象）」

## 6. 運用ルール

- カバレッジ改善の対象は、原則として「2. テスト対象となっているコード」に限定します。
- 新しい生成コードパターンが追加された場合は、coverlet.runsettings の ExcludeByFile を更新してください。
- 除外設定を変更した場合は、必ずこの README も同時更新してください。
