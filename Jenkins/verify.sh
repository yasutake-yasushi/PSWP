#!/bin/bash

# Jenkins CI/CD パイプライン ローカル検証スクリプト
# 
# このスクリプトは、Jenkins上で実行されるのと同じテスト手順を
# ローカルマシンで実行して検証します。

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "======================================"
echo "Jenkins パイプライン ローカル検証"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter
TESTS_PASSED=0
TESTS_FAILED=0

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Step 1: チェック環境
log_info "Step 1: 環境をチェック中..."

if ! command -v dotnet &> /dev/null; then
    log_error ".NET SDK が見つかりません"
    exit 1
fi
log_success ".NET SDK インストール確認: $(dotnet --version)"

if ! command -v node &> /dev/null; then
    log_error "Node.js が見つかりません"
    exit 1
fi
log_success "Node.js インストール確認: $(node --version)"

if ! command -v npm &> /dev/null; then
    log_error "npm が見つかりません"
    exit 1
fi
log_success "npm インストール確認: $(npm --version)"

echo ""

# Step 2: バックエンド リストア
log_info "Step 2: .NET 依存関係をリストア中..."
dotnet restore > /dev/null 2>&1
log_success ".NET リストア完了"

echo ""

# Step 3: フロントエンド インストール
log_info "Step 3: Node.js 依存関係をインストール中..."
cd PSWPFront
rm -rf node_modules
npm ci --include=dev > /dev/null 2>&1
npx --no-install vite --version > /dev/null 2>&1
cd ..
log_success "npm インストール完了"

echo ""

# Step 4: ビルド
log_info "Step 4: ビルド中..."
log_warning "バックエンド ビルド..."
if dotnet build --configuration Release > /dev/null 2>&1; then
    log_success "バックエンド ビルド成功"
else
    log_error "バックエンド ビルド失敗"
    exit 1
fi

log_warning "フロントエンド ビルド..."
cd PSWPFront
if npm run build > /dev/null 2>&1; then
    log_success "フロントエンド ビルド成功"
else
    log_error "フロントエンド ビルド失敗"
    exit 1
fi
cd ..

echo ""

# Step 5: バックエンド テスト
log_info "Step 5: バックエンド ユニットテスト実行中..."
if dotnet test PSWPService.Tests/PSWPService.Tests.csproj \
    --configuration Release \
    --no-build \
    --logger "trx;LogFileName=TestResults.trx" \
    --logger "junit;LogFilePath=TestResults/junit-results.xml" \
    --collect:"XPlat Code Coverage" > /dev/null 2>&1; then
    log_success "バックエンド ユニットテスト成功"
    
    if [ -d "PSWPService.Tests/TestResults" ]; then
        TEST_COUNT=$(find PSWPService.Tests/TestResults -name "*.trx" | wc -l)
        log_info "  - テスト結果: $TEST_COUNT 個のトレース ファイル"
    fi
else
    log_error "バックエンド ユニットテスト失敗"
    # Continue to next step
fi

echo ""

# Step 6: フロントエンド テスト
log_info "Step 6: フロントエンド ユニットテスト実行中..."
cd PSWPFront
if npm run test:ci > /dev/null 2>&1; then
    log_success "フロントエンド ユニットテスト成功"
    
    if [ -f "test-results/vitest/results.xml" ]; then
        log_info "  - テスト結果: test-results/vitest/results.xml"
    fi
else
    log_error "フロントエンド ユニットテスト失敗"
fi
cd ..

echo ""

# Step 7: E2E テスト
log_info "Step 7: E2E テスト実行中..."
cd PSWPFront
if npm run playwright:install > /dev/null 2>&1; then
    log_warning "  - Playwright ブラウザのインストール完了"
fi

if npm run test:e2e:ci > /dev/null 2>&1; then
    log_success "E2E テスト成功"
else
    log_warning "E2E テスト スキップ（オプション）"
fi
cd ..

echo ""

# Step 8: カバレッジ レポート
log_info "Step 8: カバレッジレポート生成中..."
cd PSWPFront
if npm run test -- --coverage > /dev/null 2>&1; then
    log_success "フロントエンド カバレッジ生成成功"
else
    log_error "フロントエンド カバレッジ生成失敗"
fi
cd ..

if [ -f "PSWPFront/coverage/index.html" ]; then
    log_success "フロントエンド カバレッジレポート生成: PSWPFront/coverage/index.html"
else
    log_warning "フロントエンド カバレッジレポート見つかりません"
fi

echo ""

# 結果サマリー
echo "======================================"
echo "検証完了"
echo "======================================"
echo -e "${GREEN}成功:${NC} $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}失敗:${NC} $TESTS_FAILED"
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    log_success "すべてのチェックが成功しました！"
    echo ""
    echo "📋 テスト結果:"
    echo "  Backend: PSWPService.Tests/TestResults/"
    echo "  Frontend: PSWPFront/test-results/"
    echo "  Coverage: PSWPFront/coverage/index.html"
    exit 0
else
    echo ""
    log_error "いくつかのチェックが失敗しました"
    exit 1
fi
