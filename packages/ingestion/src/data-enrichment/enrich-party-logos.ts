/**
 * 政党ロゴURL・ブランド情報の拡充スクリプト
 *
 * 各政党の公式サイトからロゴ画像URLを収集し、DBに登録する。
 * 政党カラーやウェブサイトURLも併せて更新する。
 *
 * データソース:
 *   - 各政党公式ウェブサイト
 *   - Wikipedia（CC BY-SA ライセンス）
 */

import { prisma } from "@ojpp/db";

// ============================================
// 政党ブランド情報の定義
// ============================================

interface PartyBrandInfo {
  /** DB上の政党名（Party.name と一致） */
  name: string;
  /** 政党ロゴ画像URL */
  logoUrl: string;
  /** ブランドカラー（#RRGGBB） */
  color: string;
  /** 公式ウェブサイトURL */
  website: string;
}

/**
 * 主要政党のブランド情報
 *
 * ロゴURL: 各政党の公式サイト・Wikimedia Commons から取得
 * カラー: 各政党の公式ブランドカラー
 */
const PARTY_BRANDS: PartyBrandInfo[] = [
  {
    name: "自由民主党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Liberal_Democratic_Party_of_Japan_logo.svg/250px-Liberal_Democratic_Party_of_Japan_logo.svg.png",
    color: "#E2001A",
    website: "https://www.jimin.jp/",
  },
  {
    name: "立憲民主党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Constitutional_Democratic_Party_of_Japan_%28Rikken%29.svg/250px-Constitutional_Democratic_Party_of_Japan_%28Rikken%29.svg.png",
    color: "#1E4D8C",
    website: "https://cdp-japan.jp/",
  },
  {
    name: "日本維新の会",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2b/Nippon_Ishin_no_Kai_Text_Logo.png",
    color: "#00884B",
    website: "https://o-ishin.jp/",
  },
  {
    name: "国民民主党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Logo_of_Democratic_Party_For_the_People.svg/250px-Logo_of_Democratic_Party_For_the_People.svg.png",
    color: "#F5A800",
    website: "https://new-kokumin.jp/",
  },
  {
    name: "公明党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Komeito_logo.svg/250px-Komeito_logo.svg.png",
    color: "#F39800",
    website: "https://www.komei.or.jp/",
  },
  {
    name: "日本共産党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Japanese_Communist_Party_logo.svg/250px-Japanese_Communist_Party_logo.svg.png",
    color: "#CC0000",
    website: "https://www.jcp.or.jp/",
  },
  {
    name: "れいわ新選組",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Logo_Reiwa.svg/250px-Logo_Reiwa.svg.png",
    color: "#ED6EA0",
    website: "https://reiwa-shinsengumi.com/",
  },
  {
    name: "社会民主党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Social_Democratic_Party_Logo.svg/250px-Social_Democratic_Party_Logo.svg.png",
    color: "#2E8B57",
    website: "https://sdp.or.jp/",
  },
  {
    name: "参政党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Sanseito_Logo_%282025%29.svg/250px-Sanseito_Logo_%282025%29.svg.png",
    color: "#FF8C00",
    website: "https://www.sanseito.jp/",
  },
  {
    name: "日本保守党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/The_Logo_of_the_Conservative_Party_of_Japan%2C_2024.svg/250px-The_Logo_of_the_Conservative_Party_of_Japan%2C_2024.svg.png",
    color: "#1B3A6B",
    website: "https://hoshuto.jp/",
  },
  {
    name: "NHK党",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/The_Party_that_Teaches_How_to_Not_Pay_the_NHK_License_Fee_logo.svg/250px-The_Party_that_Teaches_How_to_Not_Pay_the_NHK_License_Fee_logo.svg.png",
    color: "#00BFFF",
    website: "https://www.nhk-party.jp/",
  },
];

// ============================================
// メイン処理
// ============================================

export async function enrichPartyLogos(): Promise<void> {
  console.log("[party-logos] 政党ロゴ・ブランド情報の拡充を開始...");

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const brand of PARTY_BRANDS) {
    const party = await prisma.party.findFirst({
      where: { name: brand.name },
    });

    if (!party) {
      console.warn(`[party-logos]   政党が見つかりません: ${brand.name}`);
      notFoundCount++;
      continue;
    }

    await prisma.party.update({
      where: { id: party.id },
      data: {
        logoUrl: brand.logoUrl,
        color: brand.color,
        website: brand.website,
      },
    });

    updatedCount++;
    console.log(`[party-logos]   更新: ${brand.name} (ロゴ・カラー・サイト)`);
  }

  console.log(`[party-logos] 完了 — ${updatedCount}政党更新, ${notFoundCount}政党未検出`);
}

// CLI実行
if (process.argv[1]?.includes("enrich-party-logos")) {
  enrichPartyLogos()
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
