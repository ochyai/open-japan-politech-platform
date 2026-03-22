/**
 * 政治家画像・プロフィールURL拡充スクリプト
 *
 * Wikipedia API を使って国会議員の顔写真URL・プロフィールURLを一括取得し、
 * DBの imageUrl / profileUrl フィールドに登録する。
 *
 * Wikimedia Commons の画像は CC BY-SA ライセンスで利用可能。
 *
 * API仕様:
 *   - MediaWiki API: action=query&prop=pageimages&pithumbsize=300
 *   - 日本語Wikipedia: https://ja.wikipedia.org/w/api.php
 *
 * 処理フロー:
 *   1. DBから全政治家を取得
 *   2. 50名ずつバッチでWikipedia APIに問い合わせ
 *   3. 画像URL・プロフィールURLが取得できた議員のDBレコードを更新
 *   4. 取得できなかった議員はスキップ（UIではイニシャルアバターで表示）
 */

import { prisma } from "@ojpp/db";

// ============================================
// 型定義
// ============================================

/** Wikipedia API のページ情報レスポンス */
interface WikiPage {
  pageid: number;
  title: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  /** ページ画像の完全URL */
  original?: {
    source: string;
  };
}

/** Wikipedia API のクエリレスポンス */
interface WikiQueryResponse {
  query?: {
    pages: Record<string, WikiPage>;
    normalized?: Array<{ from: string; to: string }>;
  };
}

// ============================================
// Wikipedia API クライアント
// ============================================

const WIKIPEDIA_API_BASE = "https://ja.wikipedia.org/w/api.php";
const WIKIPEDIA_PAGE_BASE = "https://ja.wikipedia.org/wiki/";

/** APIリクエスト間の待機時間（ミリ秒） - Wikipedia APIの礼儀的な利用 */
const API_DELAY_MS = 1000;

/** サムネイルサイズ（ピクセル） */
const THUMBNAIL_SIZE = 300;

/**
 * Wikipedia APIで政治家名からページ画像を取得する
 * 最大50タイトルまで一括クエリ可能
 */
async function fetchWikipediaImages(
  names: string[],
): Promise<Map<string, { imageUrl: string; profileUrl: string }>> {
  const results = new Map<string, { imageUrl: string; profileUrl: string }>();

  if (names.length === 0) return results;

  // Wikipedia APIは最大50タイトルまで
  const titles = names.join("|");
  const params = new URLSearchParams({
    action: "query",
    titles,
    prop: "pageimages",
    pithumbsize: String(THUMBNAIL_SIZE),
    format: "json",
    formatversion: "2",
  });

  try {
    const response = await fetch(`${WIKIPEDIA_API_BASE}?${params}`, {
      headers: {
        "User-Agent":
          "OJPP-DataEnrichment/1.0 (https://github.com/ochyai/open-japan-politech-platform)",
      },
    });

    if (!response.ok) {
      console.warn(`[politician-images] Wikipedia API エラー: ${response.status}`);
      return results;
    }

    const data = (await response.json()) as WikiQueryResponse;

    if (!data.query?.pages) return results;

    // 正規化マッピングを構築（APIが名前を正規化する場合がある）
    const normalizedMap = new Map<string, string>();
    if (data.query.normalized) {
      for (const norm of data.query.normalized) {
        normalizedMap.set(norm.to, norm.from);
      }
    }

    // ページ情報からformatversion=2のレスポンスを処理
    const pages = Array.isArray(data.query.pages)
      ? data.query.pages
      : Object.values(data.query.pages);

    for (const page of pages) {
      if (!page.thumbnail?.source) continue;

      // 元のクエリ名を特定
      const originalName = normalizedMap.get(page.title) ?? page.title;

      // 名前のマッチング（完全一致 or 元の名前リストに含まれるか）
      const matchedName = names.find((n) => n === originalName || n === page.title);
      if (!matchedName) continue;

      results.set(matchedName, {
        imageUrl: page.thumbnail.source,
        profileUrl: `${WIKIPEDIA_PAGE_BASE}${encodeURIComponent(page.title)}`,
      });
    }
  } catch (error) {
    console.error(
      `[politician-images] API呼び出しエラー: ${error instanceof Error ? error.message : error}`,
    );
  }

  return results;
}

/**
 * 指定ミリ秒だけ待機するユーティリティ
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// メイン処理
// ============================================

export async function enrichPoliticianImages(): Promise<void> {
  console.log("[politician-images] 政治家画像・プロフィールURLの拡充を開始...");

  // DB から全政治家を取得
  const politicians = await prisma.politician.findMany({
    where: { isActive: true },
    select: { id: true, name: true, imageUrl: true, profileUrl: true },
    orderBy: { name: "asc" },
  });

  console.log(`[politician-images] 対象議員数: ${politicians.length}名`);

  // 50名ずつのバッチに分割（Wikipedia API の制限）
  const BATCH_SIZE = 50;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalAlreadyHasImage = 0;

  for (let i = 0; i < politicians.length; i += BATCH_SIZE) {
    const batch = politicians.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(politicians.length / BATCH_SIZE);

    console.log(
      `[politician-images]   バッチ ${batchNumber}/${totalBatches} (${batch.length}名)...`,
    );

    // 既に画像がある議員はスキップ
    const needsImage = batch.filter((p) => !p.imageUrl);
    const alreadyHasImage = batch.length - needsImage.length;
    totalAlreadyHasImage += alreadyHasImage;

    if (needsImage.length === 0) {
      console.log(`[politician-images]     全員画像済み — スキップ`);
      continue;
    }

    // Wikipedia API で画像を取得
    const names = needsImage.map((p) => p.name);
    const imageResults = await fetchWikipediaImages(names);

    // DB更新
    for (const pol of needsImage) {
      const result = imageResults.get(pol.name);
      if (result) {
        await prisma.politician.update({
          where: { id: pol.id },
          data: {
            imageUrl: result.imageUrl,
            profileUrl: result.profileUrl,
          },
        });
        totalUpdated++;
      } else {
        totalSkipped++;
      }
    }

    console.log(
      `[politician-images]     取得: ${imageResults.size}名, スキップ: ${needsImage.length - imageResults.size}名`,
    );

    // API レートリミット対応
    if (i + BATCH_SIZE < politicians.length) {
      await sleep(API_DELAY_MS);
    }
  }

  // --- サマリー ---
  console.log("[politician-images] --- 結果サマリー ---");
  console.log(`[politician-images]   総議員数: ${politicians.length}名`);
  console.log(`[politician-images]   既存画像: ${totalAlreadyHasImage}名`);
  console.log(`[politician-images]   新規取得: ${totalUpdated}名`);
  console.log(`[politician-images]   取得失敗: ${totalSkipped}名（イニシャルアバターで表示）`);
  console.log("[politician-images] 完了");
}

// CLI実行
if (process.argv[1]?.includes("enrich-politician-images")) {
  enrichPoliticianImages()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
