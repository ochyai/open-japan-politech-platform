#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
#  Open Japan PoliTech Platform — Setup Script
#  github.com/ochyai/open-japan-politech-platform
# =============================================================================

# -- 256-color palette --------------------------------------------------------
R='\033[0m'
B='\033[1m'
D='\033[2m'
IT='\033[3m'
UL='\033[4m'
CLR='\033[K'
HIDE='\033[?25l'
SHOW='\033[?25h'

PINK='\033[38;5;213m'
HOT='\033[38;5;198m'
PURP='\033[38;5;141m'
LAVD='\033[38;5;183m'
SKY='\033[38;5;117m'
MINT='\033[38;5;121m'
PEACH='\033[38;5;216m'
GOLD='\033[38;5;220m'
GRAY='\033[38;5;245m'
DGRAY='\033[38;5;239m'
RED='\033[38;5;196m'
GRN='\033[38;5;48m'
CYN='\033[38;5;87m'
BLU='\033[38;5;33m'
WHT='\033[38;5;255m'
ORNG='\033[38;5;208m'

# Brand colors
MG_COLOR='\033[38;5;33m'    # MoneyGlass  — electric blue
PD_COLOR='\033[38;5;48m'    # PolicyDiff  — neon green
PS_COLOR='\033[38;5;141m'   # ParliScope  — vivid purple
MGA_COLOR='\033[38;5;75m'   # MG Admin    — soft blue
PSA_COLOR='\033[38;5;183m'  # PS Admin    — lavender

# Rainbow hues (smooth gradient)
RAINBOW_HUES=(196 202 208 214 220 226 190 154 118 82 46 47 48 49 50 51 45 39 33 27 21 57 93 129 165 201 200 199 198 197)

# -- State --------------------------------------------------------------------
LOG="/tmp/ojpp-setup-$(date +%Y%m%d-%H%M%S).log"
SKIP_DOCKER=false
DEV_PID=""
COMPOSE=""
TOTAL_START=$SECONDS
STEP=0
TOTAL_STEPS=10

# Ensure cursor is visible on exit
trap 'printf "${SHOW}"' EXIT

# ─────────────────────────────────────────────────────────────────────────────
#  Visual helpers
# ─────────────────────────────────────────────────────────────────────────────

# Rainbow gradient bar (full width, double-density)
rainbow_bar() {
  local hues=(196 202 208 214 220 226 190 154 118 82 46 48 51 39 21 57 93 129 165 201 199 197)
  echo -ne "  "
  for h in "${hues[@]}"; do printf "\033[38;5;%sm▀▀▀" "$h"; done
  echo -e "${R}"
}

# Thicker rainbow bar (block char)
rainbow_bar_block() {
  local hues=(196 202 208 214 220 226 190 154 118 82 46 48 51 39 21 57 93 129 165 201 199 197)
  echo -ne "  "
  for h in "${hues[@]}"; do printf "\033[48;5;%sm   " "$h"; done
  echo -e "${R}"
}

# Rainbow text — each character gets a different hue
rainbow() {
  local text="$1"
  local hues=(196 208 220 226 46 48 51 39 21 57 129 201 199 198)
  local hi=0
  for ((i=0; i<${#text}; i++)); do
    local c="${text:$i:1}"
    if [[ "$c" == " " ]]; then
      printf " "
    else
      printf "\033[1;38;5;%sm%s" "${hues[$((hi % ${#hues[@]}))]}" "$c"
      ((hi++))
    fi
  done
  printf "${R}"
}

# Animated rainbow wave for big text
rainbow_wave() {
  local text="$1"
  local offset="${2:-0}"
  local hues=(196 202 208 214 220 226 190 154 118 82 46 48 51 39 21 57 93 129 165 201)
  local hi=$offset
  for ((i=0; i<${#text}; i++)); do
    local c="${text:$i:1}"
    if [[ "$c" == " " ]]; then
      printf " "
    else
      printf "\033[1;38;5;%sm%s" "${hues[$((hi % ${#hues[@]}))]}" "$c"
      ((hi++))
    fi
  done
  printf "${R}"
}

# Rainbow progress bar with percentage
draw_bar() {
  local pct=$1
  local w=36
  local f=$((pct * w / 100))
  local e=$((w - f))
  echo -ne "\r  ${DGRAY}│${R}  "
  for ((i=0; i<f; i++)); do
    printf "\033[38;5;%sm█" "${RAINBOW_HUES[$((i % ${#RAINBOW_HUES[@]}))]}"
  done
  printf "${DGRAY}"
  for ((i=0; i<e; i++)); do printf "░"; done
  printf "${R} ${WHT}%3d%%${R}${CLR}" "$pct"
}

# Step progress
step_pct() {
  STEP=$((STEP + 1))
  local pct=$((STEP * 100 / TOTAL_STEPS))
  [ "$pct" -gt 100 ] && pct=100
  draw_bar "$pct"
  echo ""
}

# ─────────────────────────────────────────────────────────────────────────────
#  Logging helpers
# ─────────────────────────────────────────────────────────────────────────────
msg()   { echo -e "  ${DGRAY}│${R}  $*"; }
ok()    { echo -e "  ${DGRAY}│${R}  ${GRN}✔${R} $*${CLR}"; }
wrn()   { echo -e "  ${DGRAY}│${R}  ${GOLD}⚠${R}  $*${CLR}"; }
section()  { echo -e "\n  ${HOT}◇${R}  ${B}$*${R}"; }

die() {
  printf "\r${SHOW}"
  echo ""
  echo -e "  ${RED}┌─────────────────────────────────────────────────────────────${R}"
  printf  "  ${RED}│${R}  ${RED}${B}✖ エラー${R}: %b\n" "$1"
  echo -e "  ${RED}│${R}"
  echo -e "  ${RED}│${R}  ${GRAY}ログ: ${LOG}${R}"
  echo -e "  ${RED}└─────────────────────────────────────────────────────────────${R}"
  echo ""
  exit 1
}

# Animated spinner — runs command in background with braille animation
run_spin() {
  local label="$1"; shift
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local colors=(196 208 220 46 51 21 129 201)
  local i=0 t=$SECONDS

  printf "${HIDE}"
  "$@" >> "$LOG" 2>&1 &
  local cmd_pid=$!

  while kill -0 "$cmd_pid" 2>/dev/null; do
    local col="${colors[$((i % ${#colors[@]}))]}"
    printf "\r  ${DGRAY}│${R}  \033[38;5;%sm%s${R} %s${CLR}" "$col" "${frames[$((i % ${#frames[@]}))]}" "$label"
    i=$((i + 1))
    sleep 0.08
  done

  wait "$cmd_pid" 2>/dev/null
  local rc=$?
  printf "${SHOW}"
  local dt=$((SECONDS - t))
  local ts=""
  [ "$dt" -gt 2 ] && ts=" ${GRAY}(${dt}s)${R}"

  if [ "$rc" -eq 0 ]; then
    printf "\r  ${DGRAY}│${R}  ${GRN}✔${R} %b%b${CLR}\n" "$label" "$ts"
  else
    printf "\r  ${DGRAY}│${R}  ${RED}✖${R} %s${CLR}\n" "$label"
  fi
  return "$rc"
}

port_in_use() {
  (echo >/dev/tcp/localhost/"$1") 2>/dev/null
}

# Kill all processes occupying OJPP ports (3000-3004)
kill_port_users() {
  local ports=(3000 3001 3002 3003 3004)
  local killed=false
  for p in "${ports[@]}"; do
    local pids
    pids=$(lsof -ti :"$p" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      echo "$pids" | xargs kill -9 2>/dev/null || true
      killed=true
    fi
  done
  if [ "$killed" = true ]; then
    sleep 1
  fi
}

# =============================================================================
#  BANNER
# =============================================================================
clear 2>/dev/null || true
echo ""
rainbow_bar_block
echo ""
echo ""

# Big ASCII art with per-line rainbow offset
echo -e "  \033[38;5;196m  ██████╗ \033[38;5;208m     ██╗\033[38;5;220m██████╗ \033[38;5;226m██████╗ ${R}"
echo -e "  \033[38;5;196m ██╔═══██╗\033[38;5;208m     ██║\033[38;5;220m██╔══██╗\033[38;5;226m██╔══██╗${R}"
echo -e "  \033[38;5;46m ██║   ██║\033[38;5;48m     ██║\033[38;5;51m██████╔╝\033[38;5;39m██████╔╝${R}"
echo -e "  \033[38;5;46m ██║   ██║\033[38;5;48m██   ██║\033[38;5;51m██╔═══╝ \033[38;5;39m██╔═══╝ ${R}"
echo -e "  \033[38;5;129m ╚██████╔╝\033[38;5;165m╚█████╔╝\033[38;5;201m██║     \033[38;5;198m██║     ${R}"
echo -e "  \033[38;5;129m  ╚═════╝ \033[38;5;165m ╚════╝ \033[38;5;201m╚═╝     \033[38;5;198m╚═╝     ${R}"

echo ""
echo -ne "  "; rainbow "Open Japan PoliTech Platform"; echo -e "  ${DGRAY}v0.1${R}"
echo ""
echo -e "  ${LAVD}🏛️  AIエージェント時代の政治インフラ${R}"
echo -e "  ${GRAY}政党にも企業にもよらない、完全オープンな政治テクノロジー基盤${R}"
echo -e "  ${DGRAY}MoneyGlass · PolicyDiff · ParliScope — 15政党対応${R}"
echo ""
rainbow_bar_block
echo ""

# Sanity check
grep -q "open-japan-politech-platform" package.json 2>/dev/null \
  || die "open-japan-politech-platform ディレクトリで実行してください"

# =============================================================================
#  1. Docker
# =============================================================================
section "🔍 環境チェック"
draw_bar 0
echo ""

install_docker_mac() {
  echo ""
  msg "${SKY}Docker Desktop をインストールします...${R}"
  msg "${GRAY}(Homebrew 経由でダウンロード — 数分かかります)${R}"
  echo ""
  if run_spin "Docker Desktop をインストール" brew install --cask docker; then
    msg ""
    msg "${GOLD}${B}Docker Desktop を起動してください:${R}"
    msg ""
    msg "  ${CYN}open -a Docker${R}"
    msg ""
    msg "${GRAY}Docker のアイコンがメニューバーに表示されたら、もう一度このスクリプトを実行:${R}"
    msg ""
    msg "  ${CYN}bash setup.sh${R}"
    msg ""
    rainbow_bar
    echo ""
    exit 0
  else
    return 1
  fi
}

if ! command -v docker &>/dev/null; then
  echo ""
  msg "${GOLD}Docker が見つかりません${R}"
  msg ""

  # macOS: try auto-install via Homebrew
  if [[ "$OSTYPE" == darwin* ]] && command -v brew &>/dev/null; then
    msg "${SKY}Homebrew を検出 — 自動インストールを試みます${R}"
    install_docker_mac || {
      echo ""
      msg "${PINK}${B}Docker Desktop のインストール:${R}"
      msg ""
      msg "  ${CYN}brew install --cask docker${R}"
      msg ""
      msg "  インストール後、Docker Desktop を起動してから再実行:"
      msg "  ${CYN}bash setup.sh${R}"
      echo ""
      rainbow_bar
      echo ""
      exit 1
    }
  elif [[ "$OSTYPE" == darwin* ]]; then
    echo ""
    echo -e "  ${PINK}┌───────────────────────────────────────────────────────────${R}"
    echo -e "  ${PINK}│${R}  ${B}Docker Desktop が必要です${R}"
    echo -e "  ${PINK}│${R}"
    echo -e "  ${PINK}│${R}  ${WHT}方法1: Homebrew${R} ${GRAY}(おすすめ)${R}"
    echo -e "  ${PINK}│${R}  ${CYN}  brew install --cask docker${R}"
    echo -e "  ${PINK}│${R}"
    echo -e "  ${PINK}│${R}  ${WHT}方法2: 公式サイト${R}"
    echo -e "  ${PINK}│${R}  ${CYN}  https://docker.com/products/docker-desktop${R}"
    echo -e "  ${PINK}│${R}"
    echo -e "  ${PINK}│${R}  インストール後、Docker Desktop を起動してから:"
    echo -e "  ${PINK}│${R}  ${CYN}  bash setup.sh${R}"
    echo -e "  ${PINK}└───────────────────────────────────────────────────────────${R}"
    echo ""
    exit 1
  else
    echo ""
    echo -e "  ${PINK}┌───────────────────────────────────────────────────────────${R}"
    echo -e "  ${PINK}│${R}  ${B}Docker が必要です${R}"
    echo -e "  ${PINK}│${R}"
    echo -e "  ${PINK}│${R}  ${WHT}インストール:${R}"
    echo -e "  ${PINK}│${R}  ${CYN}  https://docs.docker.com/engine/install/${R}"
    echo -e "  ${PINK}│${R}"
    echo -e "  ${PINK}│${R}  インストール後:"
    echo -e "  ${PINK}│${R}  ${CYN}  bash setup.sh${R}"
    echo -e "  ${PINK}└───────────────────────────────────────────────────────────${R}"
    echo ""
    exit 1
  fi
fi

# Docker daemon running? — auto-start on macOS
if ! docker info >> "$LOG" 2>&1; then
  if [[ "$OSTYPE" == darwin* ]]; then
    msg "${SKY}Docker Desktop を自動起動します...${R} 🐳"
    open -a Docker 2>/dev/null || true

    # Wait for Docker to be ready (up to 60s)
    docker_frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    docker_fi=0
    docker_start=$SECONDS
    printf "${HIDE}"
    while ! docker info >> "$LOG" 2>&1; do
      local_elapsed=$((SECONDS - docker_start))
      printf "\r  ${DGRAY}│${R}  \033[38;5;%sm%s${R} Docker 起動中... ${GRAY}(%ds)${R}${CLR}" \
        "${RAINBOW_HUES[$((docker_fi % ${#RAINBOW_HUES[@]}))]}" \
        "${docker_frames[$((docker_fi % ${#docker_frames[@]}))]}" \
        "$local_elapsed"
      docker_fi=$((docker_fi + 1))
      sleep 1
      if [ "$local_elapsed" -gt 60 ]; then
        printf "${SHOW}\r"
        die "Docker の起動タイムアウト (60s)\n     Docker Desktop を手動で起動してから ${CYN}bash setup.sh${R}"
      fi
    done
    printf "${SHOW}\r  ${DGRAY}│${R}  ${GRN}✔${R} Docker Desktop 起動完了 🐳${CLR}\n"
  else
    echo ""
    echo -e "  ${GOLD}┌───────────────────────────────────────────────────────────${R}"
    echo -e "  ${GOLD}│${R}  ${B}Docker デーモンが起動していません${R}"
    echo -e "  ${GOLD}│${R}"
    echo -e "  ${GOLD}│${R}  ${CYN}  sudo systemctl start docker${R}"
    echo -e "  ${GOLD}│${R}"
    echo -e "  ${GOLD}│${R}  起動後、再実行:"
    echo -e "  ${GOLD}│${R}  ${CYN}  bash setup.sh${R}"
    echo -e "  ${GOLD}└───────────────────────────────────────────────────────────${R}"
    echo ""
    exit 1
  fi
fi

COMPOSE="docker compose"
if ! $COMPOSE version >> "$LOG" 2>&1; then
  if command -v docker-compose &>/dev/null; then
    COMPOSE="docker-compose"
  else
    die "docker compose が見つかりません"
  fi
fi
DOCKER_VER=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | /usr/bin/head -1)
ok "🐳 Docker ${DOCKER_VER}"
step_pct

# =============================================================================
#  2. Node.js
# =============================================================================

install_node() {
  if command -v fnm &>/dev/null; then
    fnm install 22 >> "$LOG" 2>&1 && eval "$(fnm env)" && fnm use 22 >> "$LOG" 2>&1
  elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
    nvm install 22 >> "$LOG" 2>&1 && nvm use 22 >> "$LOG" 2>&1
  elif command -v mise &>/dev/null; then
    mise install node@22 >> "$LOG" 2>&1 && eval "$(mise activate bash)" && mise use --env local node@22 >> "$LOG" 2>&1
  else
    run_spin "fnm (Node バージョン管理) をインストール" bash -c "curl -fsSL https://fnm.vercel.app/install 2>/dev/null | bash -s -- --skip-shell >> '$LOG' 2>&1" || true
    FNM_DIR="${FNM_DIR:-$HOME/.local/share/fnm}"
    [ -d "$FNM_DIR" ] || FNM_DIR="$HOME/.fnm"
    export PATH="$FNM_DIR:$PATH"
    eval "$(fnm env 2>/dev/null)" || eval "$("$FNM_DIR/fnm" env 2>/dev/null)"
    run_spin "Node.js 22 をインストール" bash -c "fnm install 22 >> '$LOG' 2>&1 && fnm use 22 >> '$LOG' 2>&1"
  fi
}

if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 22 ]; then
    ok "💚 Node.js $(node -v)"
  else
    wrn "Node.js $(node -v) → v22+ にアップグレード中"
    install_node
    ok "💚 Node.js $(node -v)"
  fi
else
  msg "${SKY}Node.js がインストールされていません — 自動インストール${R}"
  install_node
  ok "💚 Node.js $(node -v)"
fi
step_pct

# =============================================================================
#  3. pnpm
# =============================================================================

if ! command -v pnpm &>/dev/null; then
  if command -v corepack &>/dev/null; then
    run_spin "pnpm をインストール" bash -c "corepack enable >> '$LOG' 2>&1; corepack prepare pnpm@10.4.0 --activate >> '$LOG' 2>&1 || npm install -g pnpm@10 >> '$LOG' 2>&1"
  else
    run_spin "pnpm をインストール" npm install -g pnpm@10
  fi
fi
ok "📦 pnpm $(pnpm --version)"
step_pct

# =============================================================================
#  4. PostgreSQL
# =============================================================================
section "🐘 データベース"

if port_in_use 54322; then
  ok "既存の PostgreSQL を検出 (localhost:54322) → 再利用 🎯"
  SKIP_DOCKER=true
else
  run_spin "PostgreSQL 16 コンテナを起動" $COMPOSE up -d db \
    || die "PostgreSQL の起動に失敗しました"

  # Wait for postgres with animated spinner
  spin_frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  spin_i=0
  printf "${HIDE}"
  for attempt in $(seq 1 30); do
    printf "\r  ${DGRAY}│${R}  ${SKY}%s${R} PostgreSQL ready チェック...${CLR}" "${spin_frames[$spin_i]}"
    spin_i=$(( (spin_i + 1) % ${#spin_frames[@]} ))
    if $COMPOSE exec -T db pg_isready -U postgres >> "$LOG" 2>&1; then
      printf "${SHOW}\r  ${DGRAY}│${R}  ${GRN}✔${R} PostgreSQL 起動完了 🐘${CLR}\n"
      break
    fi
    sleep 0.5
    if [ "$attempt" -eq 30 ]; then
      printf "${SHOW}"
      die "PostgreSQL の起動タイムアウト (15s)"
    fi
  done
fi
step_pct

# =============================================================================
#  5. .env
# =============================================================================
section "📦 依存関係"

if [ ! -f .env ]; then
  cp .env.example .env
  ok ".env 作成完了"
else
  ok ".env 既存（上書きなし）"
fi
step_pct

# =============================================================================
#  6. pnpm install
# =============================================================================

run_spin "依存関係をインストール (ง •̀_•́)ง" pnpm install \
  || die "pnpm install に失敗\n     ${GRAY}ログ: $LOG${R}"
step_pct

# =============================================================================
#  7. Database schema + seed
# =============================================================================
section "🗄️ データベースセットアップ"

run_spin "Prisma Client を生成" pnpm db:generate \
  || die "Prisma Client の生成に失敗"

run_spin "スキーマを DB に反映" pnpm --filter @ojpp/db push \
  || die "スキーマの反映に失敗\n     ${GRAY}DATABASE_URL を確認${R}"
step_pct

if run_spin "初期データを投入 (15政党・47都道府県・議員)" pnpm db:seed; then
  :
else
  wrn "スキップ（既にデータが存在）"
fi

if run_spin "データソースを取り込み (政治資金・議会・政策)" pnpm ingest:all; then
  :
else
  wrn "スキップ（既にデータが存在）"
fi
step_pct

# =============================================================================
#  8. Clean stale caches & start dev
# =============================================================================
section "🚀 アプリ起動"

# IMPORTANT: Remove stale .next caches to prevent module-not-found errors
run_spin "ビルドキャッシュをクリーン 🧹" bash -c "rm -rf apps/*/.next apps/*/.turbo .turbo node_modules/.cache 2>/dev/null; echo ok"

# Kill any leftover processes on OJPP ports (from previous runs)
kill_port_users
if port_in_use 3000 || port_in_use 3002 || port_in_use 3003; then
  wrn "ポート 3000-3004 の既存プロセスを終了しました"
fi

DEV_LOG="/tmp/ojpp-dev-$(date +%s).log"

start_dev() {
  kill_port_users
  pnpm dev > "$DEV_LOG" 2>&1 &
  DEV_PID=$!
}

start_dev

# Cleanup handler
cleanup() {
  printf "${SHOW}\n"
  printf "  ${HOT}◇${R}  停止中...\r"
  kill "$DEV_PID" 2>/dev/null || true
  wait "$DEV_PID" 2>/dev/null || true
  if [ "$SKIP_DOCKER" = false ]; then
    $COMPOSE down >> "$LOG" 2>&1 || true
  fi
  echo ""
  echo -e "  ${PINK}◆${R}  ${B}おつかれさまでした！${R} ${GRAY}(´・ω・\`)ﾉ${R}"
  echo ""
}
trap cleanup INT TERM

msg "${GRAY}初回コンパイル中... ☕${R}"

DEV_RETRIES=0

wait_for_app() {
  local port=$1 name=$2 emoji=$3 color=$4
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local fi=0 start=$SECONDS

  printf "${HIDE}"
  while true; do
    local col_i=$((fi % ${#RAINBOW_HUES[@]}))
    printf "\r  ${DGRAY}│${R}  \033[38;5;%sm%s${R} %s を起動中...${CLR}" "${RAINBOW_HUES[$col_i]}" "${frames[$((fi % ${#frames[@]}))]}" "$name"
    fi=$((fi + 1))

    if curl -sf -o /dev/null --max-time 0.5 "http://localhost:$port" 2>/dev/null; then
      local dt=$((SECONDS - start))
      local ts=""
      [ "$dt" -gt 3 ] && ts=" ${GRAY}(${dt}s)${R}"
      printf "${SHOW}\r  ${DGRAY}│${R}  ${GRN}✔${R} %s ${color}${B}%s${R}%b${CLR}\n" "$emoji" "$name" "$ts"
      return 0
    fi

    # Dev server crashed — auto-retry once
    if ! kill -0 "$DEV_PID" 2>/dev/null; then
      if [ "$DEV_RETRIES" -lt 1 ]; then
        DEV_RETRIES=$((DEV_RETRIES + 1))
        printf "${SHOW}\r  ${DGRAY}│${R}  ${GOLD}⚠${R}  開発サーバー再起動中...${CLR}\n"
        rm -rf apps/*/.next 2>/dev/null || true
        sleep 1
        DEV_LOG="/tmp/ojpp-dev-$(date +%s).log"
        start_dev
        sleep 2
        start=$SECONDS
        fi=0
        continue
      fi
      printf "${SHOW}\r  ${DGRAY}│${R}  ${RED}✖${R} %s${CLR}\n" "$name"
      die "開発サーバーが異常終了\n     ${GRAY}ログ: $DEV_LOG${R}"
    fi

    if [ $((SECONDS - start)) -gt 120 ]; then
      printf "${SHOW}\r"
      wrn "${name} タイムアウト — 手動で確認: http://localhost:${port}"
      return 0
    fi

    sleep 0.12
  done
}

wait_for_app 3000 "MoneyGlass"  "🏦" "$MG_COLOR"
wait_for_app 3002 "PolicyDiff"  "📋" "$PD_COLOR"
wait_for_app 3003 "ParliScope"  "🏛️ " "$PS_COLOR"
step_pct

# =============================================================================
#  COMPLETE — The big finale
# =============================================================================
ELAPSED=$((SECONDS - TOTAL_START))
MINS=$((ELAPSED / 60))
SECS=$((ELAPSED % 60))

# Terminal bell
printf "\a"

echo ""
echo ""
rainbow_bar_block
rainbow_bar_block
echo ""

# Big "READY" banner with per-character rainbow
echo -ne "  "; rainbow_wave "██████╗ ███████╗ █████╗ ██████╗ ██╗   ██╗" 0; echo ""
echo -ne "  "; rainbow_wave "██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝" 3; echo ""
echo -ne "  "; rainbow_wave "██████╔╝█████╗  ███████║██║  ██║ ╚████╔╝ " 6; echo ""
echo -ne "  "; rainbow_wave "██╔══██╗██╔══╝  ██╔══██║██║  ██║  ╚██╔╝  " 9; echo ""
echo -ne "  "; rainbow_wave "██║  ██║███████╗██║  ██║██████╔╝   ██║   " 12; echo ""
echo -ne "  "; rainbow_wave "╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝   " 15; echo ""

echo ""
rainbow_bar_block
rainbow_bar_block
echo ""
echo ""

# App showcase — boxed URLs
echo -e "  ${DGRAY}┌──────────────────────────────────────────────────────────────┐${R}"
echo -e "  ${DGRAY}│${R}                                                              ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}    🏦 ${MG_COLOR}${B}MoneyGlass${R}    ${CYN}${UL}http://localhost:3000${R}    ${PEACH}政治資金の流れ${R}   ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}                                                              ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}    📋 ${PD_COLOR}${B}PolicyDiff${R}    ${CYN}${UL}http://localhost:3002${R}    ${MINT}政策を比較${R}       ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}                                                              ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}    🏛️  ${PS_COLOR}${B}ParliScope${R}    ${CYN}${UL}http://localhost:3003${R}    ${LAVD}国会を可視化${R}     ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}                                                              ${DGRAY}│${R}"
echo -e "  ${DGRAY}└──────────────────────────────────────────────────────────────┘${R}"

echo ""
echo -e "  ${DGRAY}管理画面${R}  ${MGA_COLOR}localhost:3001${R} (MoneyGlass)  ${PSA_COLOR}localhost:3004${R} (ParliScope)"
echo ""

# Stats line
echo -ne "  "; rainbow "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧"; echo -e "  ${WHT}${B}${MINS}分${SECS}秒${R}${GRAY}で全環境構築完了${R}"
echo ""

# Tips box
echo -e "  ${DGRAY}┌──────────────────────────────────────────────────┐${R}"
echo -e "  ${DGRAY}│${R}  ${B}Tips${R}                                           ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}停止${R}      ${WHT}Ctrl+C${R}                              ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}ログ${R}      ${WHT}${DEV_LOG}${R}  ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}DB削除${R}    ${WHT}docker compose down -v${R}              ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}GitHub${R}    ${CYN}github.com/ochyai/open-japan-politech-platform${R}  ${DGRAY}│${R}"
echo -e "  ${DGRAY}└──────────────────────────────────────────────────┘${R}"
echo ""
rainbow_bar
echo ""

# Keep running until Ctrl+C
wait "$DEV_PID" 2>/dev/null || true
