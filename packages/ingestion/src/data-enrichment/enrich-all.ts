/**
 * データ拡充オーケストレータ
 *
 * 全てのデータ拡充スクリプトを順番に実行する。
 *
 * 実行順序:
 *   1. 政党ロゴ・ブランド情報
 *   2. 政治家画像・プロフィールURL
 */

import { prisma } from "@ojpp/db";
import { enrichPartyLogos } from "./enrich-party-logos";
import { enrichPoliticianImages } from "./enrich-politician-images";

async function enrichAll(): Promise<void> {
  console.log("========================================");
  console.log("OJPP データ拡充パイプライン 開始");
  console.log("========================================\n");

  const startTime = Date.now();

  // 1. 政党ロゴ・ブランド情報の拡充
  console.log("--- ステップ 1/2: 政党ロゴ・ブランド情報 ---");
  await enrichPartyLogos();
  console.log();

  // 2. 政治家画像・プロフィールURLの拡充
  console.log("--- ステップ 2/2: 政治家画像・プロフィールURL ---");
  await enrichPoliticianImages();
  console.log();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("========================================");
  console.log(`OJPP データ拡充パイプライン 完了 (${elapsed}秒)`);
  console.log("========================================");
}

// CLI実行
enrichAll()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("データ拡充パイプラインでエラーが発生しました:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
