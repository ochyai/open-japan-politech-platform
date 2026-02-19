export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

/**
 * GET /install
 *
 * `curl -fsSL https://ojpp.dev/install | sh` で実行されるインストーラースクリプト。
 * リポジトリを clone して setup.sh を実行する。
 */
export function GET() {
  const script = `#!/usr/bin/env bash
set -euo pipefail

# ── OJPP Installer ──
# curl -fsSL https://ojpp.dev/install | sh

REPO="https://github.com/ochyai/open-japan-politech-platform.git"
DIR="open-japan-politech-platform"

echo ""
echo "  ⚡ Open Japan PoliTech Platform — Installer"
echo "  ─────────────────────────────────────────────"
echo ""

if [ -d "\${DIR}" ]; then
  echo "  📂 \${DIR}/ は既に存在します — pull して更新します"
  cd "\${DIR}"
  git pull --ff-only 2>/dev/null || true
else
  echo "  📥 リポジトリをクローン中..."
  git clone "\${REPO}"
  cd "\${DIR}"
fi

echo ""
echo "  🚀 setup.sh を実行します..."
echo ""
exec bash setup.sh
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
