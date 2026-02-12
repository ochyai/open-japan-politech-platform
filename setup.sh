#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  Open Japan PoliTech Platform — ワンクリックセットアップ
#
#  Usage:
#    git clone https://github.com/ochyai/open-japan-politech-platform.git
#    cd open-japan-politech-platform && bash setup.sh
#
#  前提: Docker + Git がインストール済み
#  Node.js / pnpm は自動でインストールされます
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()    { echo -e "  ${BLUE}>>>${NC} $*"; }
success() { echo -e "  ${GREEN}✓${NC}  $*"; }
warn()    { echo -e "  ${YELLOW}!${NC}  $*"; }
fail()    { echo -e "\n  ${RED}✗ $*${NC}" >&2; exit 1; }

STEPS=7
step() { echo -e "\n${BOLD}[$1/${STEPS}]${NC} $2"; }

# --- Banner ---
echo ""
echo -e "${BOLD}  ┌─────────────────────────────────────────────────┐${NC}"
echo -e "${BOLD}  │  Open Japan PoliTech Platform v0.1              │${NC}"
echo -e "${BOLD}  │  ${DIM}AIエージェント時代の政治インフラ${NC}${BOLD}                │${NC}"
echo -e "${BOLD}  └─────────────────────────────────────────────────┘${NC}"

# --- Sanity check ---
[ -f package.json ] || fail "open-japan-politech-platform ディレクトリで実行してください"

# ===================== Step 1: Docker =====================
step 1 "Docker の確認"

command -v docker &>/dev/null \
  || fail "Docker が見つかりません\n\n  macOS:   brew install --cask docker\n  Linux:   https://docs.docker.com/engine/install/\n  Windows: https://docs.docker.com/desktop/install/windows-install/"

docker info &>/dev/null 2>&1 \
  || fail "Docker デーモンが起動していません → Docker Desktop を起動してから再実行してください"

# Detect compose command
COMPOSE="docker compose"
if ! $COMPOSE version &>/dev/null 2>&1; then
  if command -v docker-compose &>/dev/null; then
    COMPOSE="docker-compose"
  else
    fail "docker compose が見つかりません"
  fi
fi

success "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"

# ===================== Step 2: Node.js =====================
step 2 "Node.js 22+ の確認"

install_node() {
  info "Node.js 22 をインストールします..."

  if command -v fnm &>/dev/null; then
    fnm install 22 && eval "$(fnm env)" && fnm use 22
  elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "$HOME/.nvm/nvm.sh"
    nvm install 22 && nvm use 22
  elif command -v mise &>/dev/null; then
    mise install node@22 && eval "$(mise activate bash)" && mise use --env local node@22
  else
    info "fnm (Fast Node Manager) をインストール中..."
    curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell >/dev/null 2>&1

    FNM_DIR="${FNM_DIR:-$HOME/.local/share/fnm}"
    [ -d "$FNM_DIR" ] || FNM_DIR="$HOME/.fnm"
    export PATH="$FNM_DIR:$PATH"
    eval "$(fnm env 2>/dev/null)" || eval "$("$FNM_DIR/fnm" env)"

    fnm install 22 && fnm use 22
  fi
}

if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 22 ]; then
    success "Node.js $(node -v)"
  else
    warn "Node.js $(node -v) が検出されましたが v22+ が必要です"
    install_node
    success "Node.js $(node -v) インストール完了"
  fi
else
  install_node
  success "Node.js $(node -v) インストール完了"
fi

# ===================== Step 3: pnpm =====================
step 3 "pnpm の確認"

if ! command -v pnpm &>/dev/null; then
  info "pnpm をインストール中..."
  if command -v corepack &>/dev/null; then
    corepack enable 2>/dev/null || true
    corepack prepare pnpm@10.4.0 --activate 2>/dev/null || npm install -g pnpm@10
  else
    npm install -g pnpm@10
  fi
fi
success "pnpm $(pnpm --version)"

# ===================== Step 4: PostgreSQL =====================
step 4 "PostgreSQL を起動"

$COMPOSE up -d db

info "PostgreSQL の起動を待機中..."
for i in $(seq 1 30); do
  if $COMPOSE exec -T db pg_isready -U postgres &>/dev/null; then
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    fail "PostgreSQL の起動がタイムアウトしました（30秒）"
  fi
done
success "PostgreSQL 起動完了 (localhost:54322)"

# ===================== Step 5: Dependencies =====================
step 5 "依存関係をインストール"

if [ ! -f .env ]; then
  cp .env.example .env
  info ".env ファイルを作成しました（デフォルト設定）"
fi

pnpm install
success "依存関係インストール完了"

# ===================== Step 6: Database =====================
step 6 "データベースをセットアップ"

info "Prisma Client を生成中..."
pnpm db:generate

info "スキーマを反映中..."
pnpm --filter @ojpp/db push

info "初期データを投入中..."
pnpm db:seed || warn "初期データ投入をスキップ（既にデータがある可能性）"

info "データソースを取り込み中..."
pnpm ingest:all || warn "データ取り込みをスキップ（既にデータがある可能性）"

success "データベースセットアップ完了"

# ===================== Step 7: Launch =====================
step 7 "開発サーバーを起動"

LOG_FILE="/tmp/ojpp-dev-$(date +%s).log"
pnpm dev > "$LOG_FILE" 2>&1 &
DEV_PID=$!

# Cleanup handler
cleanup() {
  echo ""
  info "サーバーを停止中..."
  kill "$DEV_PID" 2>/dev/null || true
  wait "$DEV_PID" 2>/dev/null || true
  $COMPOSE down 2>/dev/null || true
  success "停止完了"
}
trap cleanup INT TERM

info "アプリの起動を待機中（初回はビルドに時間がかかります）..."

wait_for_port() {
  local port=$1 name=$2
  for i in $(seq 1 120); do
    if curl -sf -o /dev/null --connect-timeout 1 "http://localhost:$port" 2>/dev/null; then
      success "$name → http://localhost:$port"
      return 0
    fi
    # Check if dev process is still running
    if ! kill -0 "$DEV_PID" 2>/dev/null; then
      fail "開発サーバーが異常終了しました。ログを確認してください:\n  cat $LOG_FILE"
    fi
    sleep 1
  done
  warn "$name (localhost:$port) の応答待機がタイムアウトしました"
}

wait_for_port 3000 "MoneyGlass"
wait_for_port 3002 "PolicyDiff"
wait_for_port 3003 "ParliScope"

# --- Done ---
echo ""
echo -e "  ${GREEN}${BOLD}=========================================${NC}"
echo -e "  ${GREEN}${BOLD}  セットアップ完了！${NC}"
echo -e "  ${GREEN}${BOLD}=========================================${NC}"
echo ""
echo -e "  ${BOLD}MoneyGlass${NC}   ${CYAN}http://localhost:3000${NC}   政治資金可視化"
echo -e "  ${BOLD}PolicyDiff${NC}   ${CYAN}http://localhost:3002${NC}   政策比較"
echo -e "  ${BOLD}ParliScope${NC}   ${CYAN}http://localhost:3003${NC}   議会監視"
echo ""
echo -e "  ${DIM}停止: Ctrl+C${NC}"
echo -e "  ${DIM}ログ: $LOG_FILE${NC}"
echo -e "  ${DIM}DB削除: docker compose down -v${NC}"
echo ""

# Keep running until Ctrl+C
wait "$DEV_PID" 2>/dev/null || true
