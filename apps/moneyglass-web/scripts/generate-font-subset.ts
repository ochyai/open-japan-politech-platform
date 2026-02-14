/**
 * Noto Sans JP サブセットフォント生成スクリプト
 *
 * src/app/ 配下の TSX ファイルから日本語文字を抽出し、
 * Google Fonts API でサブセット woff2 を生成してダウンロードする。
 *
 * Usage: npx tsx scripts/generate-font-subset.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(__dirname, "../src/app");
const OUTPUT = join(APP_DIR, "fonts/noto-sans-jp-subset.woff2");
const WEIGHTS = "400;700";

// CJK Unified Ideographs, Hiragana, Katakana, CJK Symbols
const CJK_REGEX = /[\u3000-\u9FFF\uF900-\uFAFF\uFF65-\uFF9F]/g;

function collectFiles(dir: string, exts: string[]): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // fonts/ や node_modules は除外
      if (entry === "fonts" || entry === "node_modules") continue;
      results.push(...collectFiles(full, exts));
    } else if (exts.includes(extname(entry))) {
      results.push(full);
    }
  }
  return results;
}

function extractChars(files: string[]): string {
  const chars = new Set<string>();
  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const matches = content.match(CJK_REGEX);
    if (matches) {
      for (const ch of matches) chars.add(ch);
    }
  }
  const sorted = [...chars].sort();
  return sorted.join("");
}

async function downloadSubset(chars: string): Promise<Buffer> {
  const encoded = encodeURIComponent(chars);
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${WEIGHTS}&text=${encoded}&display=swap`;

  // Google Fonts CSS を取得 (woff2 URL 抽出のため)
  const cssRes = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!cssRes.ok) throw new Error(`Failed to fetch CSS: ${cssRes.status}`);
  const css = await cssRes.text();

  // woff2 URL を抽出 (variable font なので全 weight 同一ファイル)
  const urlMatch = css.match(/url\(([^)]+)\)\s*format\(/);
  if (!urlMatch) throw new Error(`No woff2 URL found in CSS response:\n${css.slice(0, 500)}`);
  const rawUrl = urlMatch[1];

  const fontRes = await fetch(rawUrl);
  if (!fontRes.ok) throw new Error(`Failed to fetch font: ${fontRes.status}`);
  return Buffer.from(await fontRes.arrayBuffer());
}

async function main() {
  const files = collectFiles(APP_DIR, [".tsx", ".ts"]);
  console.log(`Scanned ${files.length} files in ${APP_DIR}`);

  const chars = extractChars(files);
  console.log(`Found ${chars.length} unique CJK characters`);
  console.log(`Characters: ${chars}`);

  const font = await downloadSubset(chars);
  writeFileSync(OUTPUT, font);
  console.log(`Written ${(font.length / 1024).toFixed(1)}KB to ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
