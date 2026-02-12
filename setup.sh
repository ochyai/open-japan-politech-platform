#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
#  Open Japan PoliTech Platform — ✨ マジカルセットアップスクリプト ✨
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
LIME='\033[38;5;154m'

# Brand colors
MG_COLOR='\033[38;5;33m'    # MoneyGlass  — electric blue
PD_COLOR='\033[38;5;48m'    # PolicyDiff  — neon green
PS_COLOR='\033[38;5;141m'   # ParliScope  — vivid purple
MGA_COLOR='\033[38;5;75m'   # MG Admin    — soft blue
PSA_COLOR='\033[38;5;183m'  # PS Admin    — lavender

# Rainbow hues
RAINBOW_HUES=(196 202 208 214 220 226 190 154 118 82 46 47 48 49 50 51 45 39 33 27 21 57 93 129 165 201 200 199 198 197)

# -- State --------------------------------------------------------------------
LOG="/tmp/ojpp-setup-$(date +%Y%m%d-%H%M%S).log"
SKIP_DOCKER=false
COMPOSE=""
TOTAL_START=$SECONDS
STEP=0
TOTAL_STEPS=11
APP_PIDS=()

# Ensure cursor is visible on exit
trap 'printf "${SHOW}"' EXIT

# ─────────────────────────────────────────────────────────────────────────────
#  Visual helpers
# ─────────────────────────────────────────────────────────────────────────────

rainbow_bar() {
  local hues=(196 202 208 214 220 226 190 154 118 82 46 48 51 39 21 57 93 129 165 201 199 197)
  echo -ne "  "
  for h in "${hues[@]}"; do printf "\033[38;5;%sm▀▀▀" "$h"; done
  echo -e "${R}"
}

rainbow_bar_block() {
  local hues=(196 202 208 214 220 226 190 154 118 82 46 48 51 39 21 57 93 129 165 201 199 197)
  echo -ne "  "
  for h in "${hues[@]}"; do printf "\033[48;5;%sm   " "$h"; done
  echo -e "${R}"
}

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
      hi=$((hi + 1))
    fi
  done
  printf "${R}"
}

rainbow_wave() {
  local text="$1"
  local offset="${2:-0}"
  local hues=(196 202 208 214 220 226 190 154 118 82 46 48 51 39 21 57 93 129 165 201)
  local hi="$offset"
  for ((i=0; i<${#text}; i++)); do
    local c="${text:$i:1}"
    if [[ "$c" == " " ]]; then
      printf " "
    else
      printf "\033[1;38;5;%sm%s" "${hues[$((hi % ${#hues[@]}))]}" "$c"
      hi=$((hi + 1))
    fi
  done
  printf "${R}"
}

draw_bar() {
  local pct="$1"
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

step_pct() {
  STEP=$((STEP + 1))
  local pct=$((STEP * 100 / TOTAL_STEPS))
  if [ "$pct" -gt 100 ]; then pct=100; fi
  draw_bar "$pct"
  echo ""
}

# ─────────────────────────────────────────────────────────────────────────────
#  Logging helpers  ✧  ポップで可愛い
# ─────────────────────────────────────────────────────────────────────────────
msg()     { echo -e "  ${DGRAY}│${R}  $*"; }
ok()      { echo -e "  ${DGRAY}│${R}  ${GRN}✔${R} $*${CLR}"; }
wrn()     { echo -e "  ${DGRAY}│${R}  ${GOLD}⚡${R} $*${CLR}"; }
section() { echo -e "\n  ${HOT}♦${R}  ${B}$*${R}"; }

die() {
  printf "\r${SHOW}"
  echo ""
  echo -e "  ${PINK}┌─────────────────────────────────────────────────────────────${R}"
  echo -e "  ${PINK}│${R}"
  echo -e "  ${PINK}│${R}  ${HOT}(>_<)${R}  ${B}あわわ…うまくいかなかったよ${R}"
  echo -e "  ${PINK}│${R}"
  printf  "  ${PINK}│${R}  %b\n" "$1"
  echo -e "  ${PINK}│${R}"
  echo -e "  ${PINK}│${R}  ${GRAY}📋 ログ →${R} ${CYN}${LOG}${R}"
  echo -e "  ${PINK}│${R}  ${GRAY}🔄 もう一度 →${R} ${CYN}bash setup.sh${R}"
  echo -e "  ${PINK}│${R}"
  echo -e "  ${PINK}└─────────────────────────────────────────────────────────────${R}"
  echo ""
  exit 1
}

run_spin() {
  local label="$1"; shift
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local colors=(196 208 220 46 51 21 129 201)
  local idx=0 t=$SECONDS

  printf "${HIDE}"
  "$@" >> "$LOG" 2>&1 &
  local cmd_pid=$!

  while kill -0 "$cmd_pid" 2>/dev/null; do
    local col="${colors[$((idx % ${#colors[@]}))]}"
    printf "\r  ${DGRAY}│${R}  \033[38;5;%sm%s${R} %s${CLR}" "$col" "${frames[$((idx % ${#frames[@]}))]}" "$label"
    idx=$((idx + 1))
    sleep 0.08
  done

  wait "$cmd_pid" 2>/dev/null
  local rc=$?
  printf "${SHOW}"
  local dt=$((SECONDS - t))
  local ts=""
  if [ "$dt" -gt 2 ]; then ts=" ${GRAY}(${dt}s)${R}"; fi

  if [ "$rc" -eq 0 ]; then
    printf "\r  ${DGRAY}│${R}  ${GRN}✔${R} %b%b${CLR}\n" "$label" "$ts"
  else
    printf "\r  ${DGRAY}│${R}  ${RED}✖${R} %s${CLR}\n" "$label"
  fi
  return "$rc"
}

# ─────────────────────────────────────────────────────────────────────────────
#  Port helpers
# ─────────────────────────────────────────────────────────────────────────────

port_in_use() {
  (echo >/dev/tcp/localhost/"$1") 2>/dev/null
}

find_free_port() {
  local port=$1
  while port_in_use "$port"; do
    port=$((port + 1))
  done
  echo "$port"
}

kill_ports() {
  for p in "$@"; do
    local pids
    pids=$(lsof -ti :"$p" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      echo "$pids" | xargs kill -9 2>/dev/null || true
    fi
  done
  sleep 0.5
}

# =============================================================================
#  🌈 BANNER
# =============================================================================
clear 2>/dev/null || true
echo ""
rainbow_bar_block
echo ""
echo ""

echo -e "  \033[38;5;196m  ██████╗ \033[38;5;208m     ██╗\033[38;5;220m██████╗ \033[38;5;226m██████╗ ${R}"
echo -e "  \033[38;5;196m ██╔═══██╗\033[38;5;208m     ██║\033[38;5;220m██╔══██╗\033[38;5;226m██╔══██╗${R}"
echo -e "  \033[38;5;46m ██║   ██║\033[38;5;48m     ██║\033[38;5;51m██████╔╝\033[38;5;39m██████╔╝${R}"
echo -e "  \033[38;5;46m ██║   ██║\033[38;5;48m██   ██║\033[38;5;51m██╔═══╝ \033[38;5;39m██╔═══╝ ${R}"
echo -e "  \033[38;5;129m ╚██████╔╝\033[38;5;165m╚█████╔╝\033[38;5;201m██║     \033[38;5;198m██║     ${R}"
echo -e "  \033[38;5;129m  ╚═════╝ \033[38;5;165m ╚════╝ \033[38;5;201m╚═╝     \033[38;5;198m╚═╝     ${R}"

echo ""
echo -ne "  "; rainbow "Open Japan PoliTech Platform"; echo -e "  ${DGRAY}v0.1${R}"
echo ""
echo -e "  ${LAVD}🏛️  ${B}AIエージェント時代の政治インフラ${R} ${PINK}*:${R}${HOT}.${R}${GOLD}*${R}"
echo -e "  ${GRAY}政党にも企業にもよらない、完全オープンな政治テクノロジー基盤${R}"
echo -e "  ${DGRAY}${B}MoneyGlass${R}${DGRAY} · ${B}PolicyDiff${R}${DGRAY} · ${B}ParliScope${R}${DGRAY} — 15政党対応 🎌${R}"
echo ""
rainbow_bar_block
echo ""

# Sanity check
grep -q "open-japan-politech-platform" package.json 2>/dev/null \
  || die "ここは OJPP のディレクトリじゃないみたい…\n     ${CYN}cd open-japan-politech-platform && bash setup.sh${R} してね♪"

# =============================================================================
#  0. Homebrew  (macOS のみ — brew がなければ自動インストール)
# =============================================================================
if [[ "$OSTYPE" == darwin* ]] && ! command -v brew &>/dev/null; then
  section "🍺 Homebrew セットアップ ～はじめの一歩だよ～"
  echo ""
  echo -e "  ${PEACH}┌───────────────────────────────────────────────────────────${R}"
  echo -e "  ${PEACH}│${R}  ${B}🍺 Homebrew が見つからないよ！${R}"
  echo -e "  ${PEACH}│${R}  ${GRAY}macOS のパッケージマネージャーを自動インストールするね${R}"
  echo -e "  ${PEACH}│${R}  ${GOLD}🔑 sudo パスワードを聞かれたら入力してね${R}"
  echo -e "  ${PEACH}└───────────────────────────────────────────────────────────${R}"
  echo ""

  # NONINTERACTIVE=1 → "Press RETURN" プロンプトをスキップ
  # sudo は直接ターミナルからパスワードを聞く
  if NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
    # Apple Silicon or Intel — PATH を通す
    if [ -x "/opt/homebrew/bin/brew" ]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -x "/usr/local/bin/brew" ]; then
      eval "$(/usr/local/bin/brew shellenv)"
    fi

    if command -v brew &>/dev/null; then
      echo ""
      ok "Homebrew インストール完了！やったね 🍺✨"
    else
      die "Homebrew の PATH が通らなかった…\n     ターミナルを再起動して ${CYN}bash setup.sh${R} してみて"
    fi
  else
    die "Homebrew のインストールに失敗しちゃった…\n     ${CYN}https://brew.sh${R} から手動でインストールしてみてね"
  fi
fi

# =============================================================================
#  1. Docker  ～コンテナの魔法使い～
# =============================================================================
section "✨ まずは環境チェックだよ！"
draw_bar 0
echo ""

install_docker_mac() {
  echo ""
  echo -e "  ${SKY}┌───────────────────────────────────────────────────────────${R}"
  echo -e "  ${SKY}│${R}  ${B}🐳 Docker Desktop をインストールするよ！${R}"
  echo -e "  ${SKY}│${R}  ${GRAY}brew でダウンロード (~1 GB)${R} ${PEACH}ちょっとだけ待ってね ☕${R}"
  echo -e "  ${SKY}│${R}  ${GRAY}↓ 進捗がリアルタイムで見えるよ${R}"
  echo -e "  ${SKY}└───────────────────────────────────────────────────────────${R}"
  echo ""

  # Show brew output directly — progress bar 見せる！
  if brew install --cask docker 2>&1 | while IFS= read -r line; do
      echo -e "  ${DGRAY}│${R}  ${GRAY}${line}${R}"
    done; then
    echo ""
    ok "Docker Desktop インストール完了 🐳🎉"
    echo ""
    echo -e "  ${GOLD}┌───────────────────────────────────────────────────────────${R}"
    echo -e "  ${GOLD}│${R}  ${B}🐳 Docker Desktop を起動してね！${R}"
    echo -e "  ${GOLD}│${R}"
    echo -e "  ${GOLD}│${R}  ${CYN}  open -a Docker${R}"
    echo -e "  ${GOLD}│${R}"
    echo -e "  ${GOLD}│${R}  メニューバーに 🐳 アイコンが出たら:"
    echo -e "  ${GOLD}│${R}  ${CYN}  bash setup.sh${R}  ${GRAY}← もう一回これ実行♪${R}"
    echo -e "  ${GOLD}└───────────────────────────────────────────────────────────${R}"
    echo ""
    rainbow_bar
    echo ""
    exit 0
  else
    return 1
  fi
}

if ! command -v docker &>/dev/null; then
  if [[ "$OSTYPE" == darwin* ]] && command -v brew &>/dev/null; then
    msg "${SKY}🍺 Homebrew 検出！Docker を自動インストールするね${R}"
    install_docker_mac || die "Docker のインストールに失敗しちゃった…\n     ${CYN}brew install --cask docker${R} を手動で試してみて"
  elif [[ "$OSTYPE" == darwin* ]]; then
    echo ""
    echo -e "  ${PINK}┌───────────────────────────────────────────────────────────${R}"
    echo -e "  ${PINK}│${R}  ${B}🐳 Docker Desktop が必要だよ！${R}"
    echo -e "  ${PINK}│${R}  ${CYN}  brew install --cask docker${R}"
    echo -e "  ${PINK}│${R}  ${WHT}or${R} ${CYN}https://docker.com/products/docker-desktop${R}"
    echo -e "  ${PINK}│${R}  インストールしたら → ${CYN}bash setup.sh${R}"
    echo -e "  ${PINK}└───────────────────────────────────────────────────────────${R}"
    echo ""; exit 1
  else
    echo ""
    echo -e "  ${PINK}┌───────────────────────────────────────────────────────────${R}"
    echo -e "  ${PINK}│${R}  ${B}🐳 Docker が必要だよ！${R}"
    echo -e "  ${PINK}│${R}  ${CYN}  https://docs.docker.com/engine/install/${R}"
    echo -e "  ${PINK}│${R}  インストールしたら → ${CYN}bash setup.sh${R}"
    echo -e "  ${PINK}└───────────────────────────────────────────────────────────${R}"
    echo ""; exit 1
  fi
fi

# Docker daemon — auto-start on macOS
if ! docker info >> "$LOG" 2>&1; then
  if [[ "$OSTYPE" == darwin* ]]; then
    msg "${SKY}🐳 Docker Desktop をよいしょっと起動...${R}"
    open -a Docker 2>/dev/null || true
    _fi=0; _start=$SECONDS
    _frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    printf "${HIDE}"
    while ! docker info >> "$LOG" 2>&1; do
      _e=$((SECONDS - _start))
      printf "\r  ${DGRAY}│${R}  \033[38;5;%sm%s${R} 🐳 Docker が目を覚ますのを待ってるよ... ${GRAY}(%ds)${R}${CLR}" \
        "${RAINBOW_HUES[$((_fi % ${#RAINBOW_HUES[@]}))]}" \
        "${_frames[$((_fi % 10))]}" "$_e"
      _fi=$((_fi + 1))
      sleep 1
      if [ "$_e" -gt 60 ]; then printf "${SHOW}"; die "Docker タイムアウト (60s)\n     Docker Desktop を手動で起動してから ${CYN}bash setup.sh${R}"; fi
    done
    printf "${SHOW}\r  ${DGRAY}│${R}  ${GRN}✔${R} 🐳 Docker Desktop 起きた！おはよう！${CLR}\n"
  else
    die "Docker が起動してないよ\n     ${CYN}sudo systemctl start docker${R}"
  fi
fi

COMPOSE="docker compose"
if ! $COMPOSE version >> "$LOG" 2>&1; then
  command -v docker-compose &>/dev/null && COMPOSE="docker-compose" || die "docker compose が見つからないよ…"
fi
DOCKER_VER=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | /usr/bin/head -1)
ok "🐳 Docker ${DOCKER_VER} — いい感じ！"
step_pct

# =============================================================================
#  2. Node.js  ～JavaScriptの心臓～
# =============================================================================

install_node() {
  if command -v fnm &>/dev/null; then
    fnm install 22 >> "$LOG" 2>&1 && eval "$(fnm env)" && fnm use 22 >> "$LOG" 2>&1
  elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"; nvm install 22 >> "$LOG" 2>&1 && nvm use 22 >> "$LOG" 2>&1
  elif command -v mise &>/dev/null; then
    mise install node@22 >> "$LOG" 2>&1 && eval "$(mise activate bash)" && mise use --env local node@22 >> "$LOG" 2>&1
  else
    run_spin "⬇️ fnm をインストール" bash -c "curl -fsSL https://fnm.vercel.app/install 2>/dev/null | bash -s -- --skip-shell >> '$LOG' 2>&1" || true
    FNM_DIR="${FNM_DIR:-$HOME/.local/share/fnm}"; [ -d "$FNM_DIR" ] || FNM_DIR="$HOME/.fnm"
    export PATH="$FNM_DIR:$PATH"
    eval "$(fnm env 2>/dev/null)" || eval "$("$FNM_DIR/fnm" env 2>/dev/null)"
    run_spin "💚 Node.js 22 をインストール" bash -c "fnm install 22 >> '$LOG' 2>&1 && fnm use 22 >> '$LOG' 2>&1"
  fi
}

if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 22 ]; then
    ok "💚 Node.js $(node -v) — バッチリ！"
  else
    wrn "Node $(node -v) → v22+ にアップグレード中"
    install_node
    ok "💚 Node.js $(node -v) — アップグレード完了！"
  fi
else
  msg "${SKY}💚 Node.js を自動インストールするね${R}"
  install_node
  ok "💚 Node.js $(node -v) — ピカピカの新品！"
fi
step_pct

# =============================================================================
#  3. pnpm  ～高速パッケージマネージャー～
# =============================================================================

if ! command -v pnpm &>/dev/null; then
  if command -v corepack &>/dev/null; then
    run_spin "📦 pnpm をインストール" bash -c "corepack enable >> '$LOG' 2>&1; corepack prepare pnpm@10.4.0 --activate >> '$LOG' 2>&1 || npm install -g pnpm@10 >> '$LOG' 2>&1"
  else
    run_spin "📦 pnpm をインストール" npm install -g pnpm@10
  fi
fi
ok "📦 pnpm $(pnpm --version) — 爆速パッケージマネージャー！"
step_pct

# =============================================================================
#  4. PostgreSQL  ～データの守護者～
# =============================================================================
section "🐘 データベースをセットアップ ～ここ大事！～"

if port_in_use 54322; then
  ok "🐘 既存 PostgreSQL 発見 (localhost:54322) → そのまま使うよ 🎯"
  SKIP_DOCKER=true
else
  run_spin "🐘 PostgreSQL 16 コンテナを召喚" $COMPOSE up -d db \
    || die "PostgreSQL の起動に失敗しちゃった…"
  _fi=0
  printf "${HIDE}"
  _pg_frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  for attempt in $(seq 1 30); do
    printf "\r  ${DGRAY}│${R}  ${SKY}%s${R} 🐘 PostgreSQL の準備を待ってるよ...${CLR}" "${_pg_frames[$((_fi % 10))]}"
    _fi=$((_fi + 1))
    if $COMPOSE exec -T db pg_isready -U postgres >> "$LOG" 2>&1; then
      printf "${SHOW}\r  ${DGRAY}│${R}  ${GRN}✔${R} 🐘 PostgreSQL 起動完了！象さん元気！${CLR}\n"
      break
    fi
    sleep 0.5
    if [ "$attempt" -eq 30 ]; then printf "${SHOW}"; die "PostgreSQL タイムアウト…象さんが起きない"; fi
  done
fi
step_pct

# =============================================================================
#  5. .env + environment variables  ～秘密の設定ファイル～
# =============================================================================
section "📦 依存関係をぜんぶ入れちゃうぞ！"

if [ ! -f .env ]; then
  cp .env.example .env
  ok "📝 .env を作成したよ"
else
  ok "📝 .env はもうあるね（上書きしないよ）"
fi

# CRITICAL: Export all env vars so child processes (Next.js, Prisma) can see them
set -a
source .env
set +a

# Also symlink .env into each app directory — Next.js reads .env from CWD only
for app_dir in apps/*/; do
  if [ -d "$app_dir" ] && [ ! -e "${app_dir}.env" ]; then
    ln -sf "../../.env" "${app_dir}.env"
  fi
done
ok "🔗 環境変数を全5アプリに配布完了 (DATABASE_URL etc.)"
step_pct

# =============================================================================
#  6. pnpm install  ～パッケージもりもりタイム～
# =============================================================================

run_spin "📦 パッケージをもりもりインストール中..." pnpm install \
  || die "pnpm install に失敗しちゃった…\n     ${GRAY}ログ: $LOG${R}"
step_pct

# =============================================================================
#  7. Database schema + seed  ～データの種まき～
# =============================================================================
section "🗄️ データベースにデータを流し込むよ！"

run_spin "⚡ Prisma Client をシャキッと生成" pnpm db:generate \
  || die "Prisma Client の生成に失敗しちゃった…"

run_spin "🗄️ スキーマを DB に書き込み" pnpm --filter @ojpp/db push \
  || die "スキーマの反映に失敗…\n     ${GRAY}DATABASE_URL を確認してみて${R}"
step_pct

if run_spin "🌱 初期データをたっぷり投入 (15政党・47都道府県・議員)" pnpm db:seed; then :
else wrn "スキップ（もうデータ入ってるみたい）"; fi

if run_spin "📊 政治データをごっそり取り込み (資金・議会・政策)" pnpm ingest:all; then :
else wrn "スキップ（もうデータ入ってるみたい）"; fi
step_pct

# =============================================================================
#  8. Clean caches + find free ports + start apps  ～いよいよ起動！～
# =============================================================================
section "🚀 アプリをぜんぶ起動するよ！ワクワク"

# Clean stale caches
run_spin "🧹 キャッシュをピカピカにお掃除" bash -c "rm -rf apps/*/.next apps/*/.turbo .turbo node_modules/.cache 2>/dev/null; echo ok"

# Kill any leftover OJPP processes on default ports
kill_ports 3000 3001 3002 3003 3004
sleep 0.5

# Find 5 free ports — auto-assign if defaults are occupied
PORT_MG=$(find_free_port 3000)
PORT_MGA=$(find_free_port $((PORT_MG + 1)))
PORT_PD=$(find_free_port $((PORT_MGA + 1)))
PORT_PS=$(find_free_port $((PORT_PD + 1)))
PORT_PSA=$(find_free_port $((PORT_PS + 1)))

if [ "$PORT_MG" -ne 3000 ] || [ "$PORT_MGA" -ne 3001 ] || [ "$PORT_PD" -ne 3002 ] || [ "$PORT_PS" -ne 3003 ] || [ "$PORT_PSA" -ne 3004 ]; then
  wrn "一部のポートが使用中 → 空いてるポートを見つけたよ！"
fi

ok "🎯 ポート割り当て: ${CYN}${PORT_MG}${R} ${CYN}${PORT_MGA}${R} ${CYN}${PORT_PD}${R} ${CYN}${PORT_PS}${R} ${CYN}${PORT_PSA}${R}"

# Start each Next.js app individually with the assigned port
NEXT_BIN=""
if [ -f "apps/moneyglass-web/node_modules/.bin/next" ]; then
  NEXT_BIN="node_modules/.bin/next"
elif [ -f "node_modules/.bin/next" ]; then
  NEXT_BIN="../../node_modules/.bin/next"
fi

start_one_app() {
  local dir="$1" port="$2" name="$3"
  local log="/tmp/ojpp-${name}-$(date +%s).log"
  if [ -n "$NEXT_BIN" ]; then
    (cd "$dir" && exec "$NEXT_BIN" dev --port "$port") > "$log" 2>&1 &
  else
    (cd "$dir" && PATH="./node_modules/.bin:../../node_modules/.bin:$PATH" exec next dev --port "$port") > "$log" 2>&1 &
  fi
  APP_PIDS+=($!)
}

start_all_apps() {
  APP_PIDS=()
  start_one_app "apps/moneyglass-web"   "$PORT_MG"  "mg-web"
  start_one_app "apps/moneyglass-admin"  "$PORT_MGA" "mg-admin"
  start_one_app "apps/policydiff-web"    "$PORT_PD"  "pd-web"
  start_one_app "apps/parliscope-web"    "$PORT_PS"  "ps-web"
  start_one_app "apps/parliscope-admin"  "$PORT_PSA" "ps-admin"
}

start_all_apps

# Cleanup handler — kill all app processes + release ports
cleanup() {
  printf "${SHOW}\n"
  printf "  ${PINK}♦${R}  停止中...\r"
  for pid in "${APP_PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  for pid in "${APP_PIDS[@]}"; do
    wait "$pid" 2>/dev/null || true
  done
  kill_ports "$PORT_MG" "$PORT_MGA" "$PORT_PD" "$PORT_PS" "$PORT_PSA"
  if [ "$SKIP_DOCKER" = false ]; then
    $COMPOSE down >> "$LOG" 2>&1 || true
  fi
  echo ""
  echo -e "  ${PINK}♦${R}  ${B}おつかれさまでした！${R} ${PEACH}またね♪${R} ${GRAY}(^_^)/~${R}"
  echo ""
}
trap cleanup INT TERM

msg "${GRAY}☕ 初回コンパイル中...ちょっとだけ待ってね${R}"

# Wait for each public app to be ready
RETRY_DONE=false

any_app_alive() {
  for pid in "${APP_PIDS[@]}"; do
    kill -0 "$pid" 2>/dev/null && return 0
  done
  return 1
}

wait_for_app() {
  local port=$1 name=$2 emoji=$3 color=$4
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local _f=0 start=$SECONDS

  printf "${HIDE}"
  while true; do
    local col_i=$((_f % ${#RAINBOW_HUES[@]}))
    printf "\r  ${DGRAY}│${R}  \033[38;5;%sm%s${R} %s を起動中...${CLR}" \
      "${RAINBOW_HUES[$col_i]}" "${frames[$((_f % 10))]}" "$name"
    _f=$((_f + 1))

    if curl -sf -o /dev/null --max-time 0.5 "http://localhost:$port" 2>/dev/null; then
      local dt=$((SECONDS - start))
      local ts=""
      if [ "$dt" -gt 3 ]; then ts=" ${GRAY}(${dt}s)${R}"; fi
      printf "${SHOW}\r  ${DGRAY}│${R}  ${GRN}✔${R} %s ${color}${B}%s${R} → ${CYN}localhost:%s${R}%b${CLR}\n" "$emoji" "$name" "$port" "$ts"
      return 0
    fi

    # All processes dead — retry once
    if ! any_app_alive; then
      if [ "$RETRY_DONE" = false ]; then
        RETRY_DONE=true
        printf "${SHOW}\r  ${DGRAY}│${R}  ${GOLD}⚡${R} アプリ再起動するね...ちょっと待って${CLR}\n"
        rm -rf apps/*/.next 2>/dev/null || true
        kill_ports "$PORT_MG" "$PORT_MGA" "$PORT_PD" "$PORT_PS" "$PORT_PSA"
        sleep 1
        start_all_apps
        sleep 2
        start=$SECONDS
        _f=0
        printf "${HIDE}"
        continue
      fi
      printf "${SHOW}\r  ${DGRAY}│${R}  ${RED}✖${R} %s${CLR}\n" "$name"
      die "全アプリが落ちちゃった…\n     ${GRAY}ログ: /tmp/ojpp-*.log を見てみて${R}"
    fi

    if [ $((SECONDS - start)) -gt 120 ]; then
      printf "${SHOW}\r"
      wrn "${name} — 手動で確認してみて: ${CYN}http://localhost:${port}${R}"
      return 0
    fi

    sleep 0.15
  done
}

wait_for_app "$PORT_MG"  "MoneyGlass"  "🏦" "$MG_COLOR"
wait_for_app "$PORT_PD"  "PolicyDiff"  "📋" "$PD_COLOR"
wait_for_app "$PORT_PS"  "ParliScope"  "🏛️ " "$PS_COLOR"
step_pct

# =============================================================================
#  ✧  COMPLETE — 祝！完成！ ✧
# =============================================================================
ELAPSED=$((SECONDS - TOTAL_START))
MINS=$((ELAPSED / 60))
SECS=$((ELAPSED % 60))

printf "\a"  # bell

echo ""
echo ""
rainbow_bar_block
rainbow_bar_block
echo ""

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

# Dynamic URL display
echo -e "  ${DGRAY}╔══════════════════════════════════════════════════════════════╗${R}"
echo -e "  ${DGRAY}║${R}                                                              ${DGRAY}║${R}"
echo -e "  ${DGRAY}║${R}    🏦 ${MG_COLOR}${B}MoneyGlass${R}    ${CYN}${UL}http://localhost:${PORT_MG}${R}    ${PEACH}政治資金の流れ${R}   ${DGRAY}║${R}"
echo -e "  ${DGRAY}║${R}                                                              ${DGRAY}║${R}"
echo -e "  ${DGRAY}║${R}    📋 ${PD_COLOR}${B}PolicyDiff${R}    ${CYN}${UL}http://localhost:${PORT_PD}${R}    ${MINT}政策を比較${R}       ${DGRAY}║${R}"
echo -e "  ${DGRAY}║${R}                                                              ${DGRAY}║${R}"
echo -e "  ${DGRAY}║${R}    🏛️  ${PS_COLOR}${B}ParliScope${R}    ${CYN}${UL}http://localhost:${PORT_PS}${R}    ${LAVD}国会を可視化${R}     ${DGRAY}║${R}"
echo -e "  ${DGRAY}║${R}                                                              ${DGRAY}║${R}"
echo -e "  ${DGRAY}╚══════════════════════════════════════════════════════════════╝${R}"

echo ""
echo -e "  ${DGRAY}管理画面${R}  ${MGA_COLOR}localhost:${PORT_MGA}${R} (MoneyGlass)  ${PSA_COLOR}localhost:${PORT_PSA}${R} (ParliScope)"
echo ""

echo -ne "  "; rainbow "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧  セットアップ完了！！"; echo ""
echo -e "  ${WHT}${B}${MINS}分${SECS}秒${R}${GRAY}で全環境が整ったよ！さあ政治を見に行こう！${R}"
echo ""

echo -e "  ${DGRAY}┌──────────────────────────────────────────────────┐${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}停止${R}      ${WHT}Ctrl+C${R}                              ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}再起動${R}    ${WHT}bash setup.sh${R}                       ${DGRAY}│${R}"
echo -e "  ${DGRAY}│${R}  ${GRAY}DB削除${R}    ${WHT}docker compose down -v${R}              ${DGRAY}│${R}"
echo -e "  ${DGRAY}└──────────────────────────────────────────────────┘${R}"
echo ""
rainbow_bar
echo ""

# Keep running — wait for any app to exit, then wait for all
wait "${APP_PIDS[@]}" 2>/dev/null || true
