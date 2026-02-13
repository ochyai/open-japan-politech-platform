/**
 * 選挙データのシード — 衆議院・参議院の実選挙結果（2013〜2026）
 *
 * 総務省選挙関連資料に基づく実データ。
 * https://www.soumu.go.jp/senkyo/
 */

import { prisma } from "@ojpp/db";

// ============================================
// 消滅・過去政党の定義（既存シードにない政党）
// ============================================

interface HistoricalParty {
  name: string;
  shortName: string;
  color: string;
  founded: string;
  dissolved?: string;
}

const HISTORICAL_PARTIES: HistoricalParty[] = [
  {
    name: "民主党",
    shortName: "民主",
    color: "#E30011",
    founded: "1998-04-27",
    dissolved: "2016-03-27",
  },
  {
    name: "民進党",
    shortName: "民進",
    color: "#1B468D",
    founded: "2016-03-27",
    dissolved: "2018-05-07",
  },
  {
    name: "希望の党",
    shortName: "希望",
    color: "#1B8E3A",
    founded: "2017-09-25",
    dissolved: "2018-05-07",
  },
  {
    name: "維新の党",
    shortName: "維新の党",
    color: "#00A651",
    founded: "2014-09-21",
    dissolved: "2016-03-27",
  },
  {
    name: "次世代の党",
    shortName: "次世代",
    color: "#003366",
    founded: "2014-08-01",
    dissolved: "2015-12-21",
  },
  {
    name: "生活の党",
    shortName: "生活",
    color: "#006633",
    founded: "2012-12-28",
    dissolved: "2019-04-26",
  },
  {
    name: "みんなの党",
    shortName: "みんな",
    color: "#F7C100",
    founded: "2009-08-08",
    dissolved: "2014-11-28",
  },
  {
    name: "減税日本・ゆうこく連合",
    shortName: "減税ゆ",
    color: "#FFD700",
    founded: "2025-12-01",
  },
  {
    name: "安楽死制度を考える会",
    shortName: "安楽死",
    color: "#9370DB",
    founded: "2020-06-01",
  },
];

// ============================================
// 選挙データ型定義
// ============================================

interface PartyResult {
  /** 政党名（DBの Party.name と一致させる） */
  partyName: string;
  /** 獲得総議席数 */
  seatsWon: number;
  /** 小選挙区/選挙区の獲得議席数 */
  districtSeats: number;
  /** 比例代表の獲得議席数 */
  proportionalSeats: number;
  /** 比例代表得票数 */
  totalVotes?: bigint;
  /** 比例代表得票率 (%) */
  voteShare?: number;
}

interface ElectionData {
  name: string;
  chamber: "HOUSE_OF_REPRESENTATIVES" | "HOUSE_OF_COUNCILLORS";
  date: string; // YYYY-MM-DD
  totalSeats: number;
  districtSeats: number;
  proportionalSeats: number;
  turnout: number | null;
  results: PartyResult[];
}

// ============================================
// 衆議院選挙データ（2014〜2026）
// ============================================

const HOUSE_OF_REPRESENTATIVES_ELECTIONS: ElectionData[] = [
  {
    name: "第47回衆議院議員総選挙",
    chamber: "HOUSE_OF_REPRESENTATIVES",
    date: "2014-12-14",
    totalSeats: 475,
    districtSeats: 295,
    proportionalSeats: 180,
    turnout: 52.66,
    results: [
      { partyName: "自由民主党", seatsWon: 291, districtSeats: 223, proportionalSeats: 68 },
      { partyName: "民主党", seatsWon: 73, districtSeats: 38, proportionalSeats: 35 },
      { partyName: "維新の党", seatsWon: 41, districtSeats: 11, proportionalSeats: 30 },
      { partyName: "公明党", seatsWon: 35, districtSeats: 9, proportionalSeats: 26 },
      { partyName: "日本共産党", seatsWon: 21, districtSeats: 1, proportionalSeats: 20 },
      { partyName: "次世代の党", seatsWon: 2, districtSeats: 2, proportionalSeats: 0 },
      { partyName: "生活の党", seatsWon: 2, districtSeats: 2, proportionalSeats: 0 },
      { partyName: "社民党", seatsWon: 2, districtSeats: 1, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 8, districtSeats: 8, proportionalSeats: 0 },
    ],
  },
  {
    name: "第48回衆議院議員総選挙",
    chamber: "HOUSE_OF_REPRESENTATIVES",
    date: "2017-10-22",
    totalSeats: 465,
    districtSeats: 289,
    proportionalSeats: 176,
    turnout: 53.68,
    results: [
      { partyName: "自由民主党", seatsWon: 284, districtSeats: 218, proportionalSeats: 66 },
      { partyName: "立憲民主党", seatsWon: 55, districtSeats: 18, proportionalSeats: 37 },
      { partyName: "希望の党", seatsWon: 50, districtSeats: 18, proportionalSeats: 32 },
      { partyName: "公明党", seatsWon: 29, districtSeats: 8, proportionalSeats: 21 },
      { partyName: "日本共産党", seatsWon: 12, districtSeats: 1, proportionalSeats: 11 },
      { partyName: "日本維新の会", seatsWon: 11, districtSeats: 3, proportionalSeats: 8 },
      { partyName: "社民党", seatsWon: 2, districtSeats: 1, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 22, districtSeats: 22, proportionalSeats: 0 },
    ],
  },
  {
    name: "第49回衆議院議員総選挙",
    chamber: "HOUSE_OF_REPRESENTATIVES",
    date: "2021-10-31",
    totalSeats: 465,
    districtSeats: 289,
    proportionalSeats: 176,
    turnout: 55.93,
    results: [
      { partyName: "自由民主党", seatsWon: 261, districtSeats: 189, proportionalSeats: 72 },
      { partyName: "立憲民主党", seatsWon: 96, districtSeats: 57, proportionalSeats: 39 },
      { partyName: "日本維新の会", seatsWon: 41, districtSeats: 16, proportionalSeats: 25 },
      { partyName: "公明党", seatsWon: 32, districtSeats: 9, proportionalSeats: 23 },
      { partyName: "国民民主党", seatsWon: 11, districtSeats: 6, proportionalSeats: 5 },
      { partyName: "日本共産党", seatsWon: 10, districtSeats: 1, proportionalSeats: 9 },
      { partyName: "れいわ新選組", seatsWon: 3, districtSeats: 0, proportionalSeats: 3 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 1, proportionalSeats: 0 },
      { partyName: "無所属", seatsWon: 10, districtSeats: 10, proportionalSeats: 0 },
    ],
  },
  {
    name: "第50回衆議院議員総選挙",
    chamber: "HOUSE_OF_REPRESENTATIVES",
    date: "2024-10-27",
    totalSeats: 465,
    districtSeats: 289,
    proportionalSeats: 176,
    turnout: 53.85,
    results: [
      { partyName: "自由民主党", seatsWon: 191, districtSeats: 132, proportionalSeats: 59 },
      { partyName: "立憲民主党", seatsWon: 148, districtSeats: 104, proportionalSeats: 44 },
      { partyName: "日本維新の会", seatsWon: 38, districtSeats: 23, proportionalSeats: 15 },
      { partyName: "国民民主党", seatsWon: 28, districtSeats: 11, proportionalSeats: 17 },
      { partyName: "公明党", seatsWon: 24, districtSeats: 4, proportionalSeats: 20 },
      { partyName: "れいわ新選組", seatsWon: 9, districtSeats: 0, proportionalSeats: 9 },
      { partyName: "日本共産党", seatsWon: 8, districtSeats: 1, proportionalSeats: 7 },
      { partyName: "参政党", seatsWon: 3, districtSeats: 0, proportionalSeats: 3 },
      { partyName: "日本保守党", seatsWon: 3, districtSeats: 1, proportionalSeats: 2 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 1, proportionalSeats: 0 },
      { partyName: "無所属", seatsWon: 12, districtSeats: 12, proportionalSeats: 0 },
    ],
  },
  {
    name: "第51回衆議院議員総選挙",
    chamber: "HOUSE_OF_REPRESENTATIVES",
    date: "2026-02-08",
    totalSeats: 465,
    districtSeats: 289,
    proportionalSeats: 176,
    turnout: 56.26,
    results: [
      { partyName: "自由民主党", seatsWon: 316, districtSeats: 249, proportionalSeats: 67, totalVotes: 21026139n, voteShare: 36.72 },
      { partyName: "中道改革連合", seatsWon: 49, districtSeats: 7, proportionalSeats: 42, totalVotes: 10438801n, voteShare: 18.23 },
      { partyName: "日本維新の会", seatsWon: 36, districtSeats: 20, proportionalSeats: 16, totalVotes: 4943331n, voteShare: 8.63 },
      { partyName: "国民民主党", seatsWon: 28, districtSeats: 8, proportionalSeats: 20, totalVotes: 5572951n, voteShare: 9.73 },
      { partyName: "参政党", seatsWon: 15, districtSeats: 0, proportionalSeats: 15, totalVotes: 4260620n, voteShare: 7.44 },
      { partyName: "チームみらい", seatsWon: 11, districtSeats: 0, proportionalSeats: 11, totalVotes: 3813749n, voteShare: 6.66 },
      { partyName: "日本共産党", seatsWon: 4, districtSeats: 0, proportionalSeats: 4, totalVotes: 2519807n, voteShare: 4.40 },
      { partyName: "れいわ新選組", seatsWon: 1, districtSeats: 0, proportionalSeats: 1, totalVotes: 1672499n, voteShare: 2.92 },
      { partyName: "減税日本・ゆうこく連合", seatsWon: 1, districtSeats: 1, proportionalSeats: 0, totalVotes: 814874n, voteShare: 1.42 },
      { partyName: "無所属", seatsWon: 4, districtSeats: 4, proportionalSeats: 0 },
    ],
  },
];

// ============================================
// 参議院選挙データ（2013〜2025）
// ============================================

const HOUSE_OF_COUNCILLORS_ELECTIONS: ElectionData[] = [
  {
    name: "第23回参議院議員通常選挙",
    chamber: "HOUSE_OF_COUNCILLORS",
    date: "2013-07-21",
    totalSeats: 121,
    districtSeats: 73,
    proportionalSeats: 48,
    turnout: 52.61,
    results: [
      { partyName: "自由民主党", seatsWon: 65, districtSeats: 47, proportionalSeats: 18 },
      { partyName: "民主党", seatsWon: 17, districtSeats: 10, proportionalSeats: 7 },
      { partyName: "公明党", seatsWon: 11, districtSeats: 4, proportionalSeats: 7 },
      { partyName: "日本維新の会", seatsWon: 8, districtSeats: 2, proportionalSeats: 6 },
      { partyName: "みんなの党", seatsWon: 8, districtSeats: 4, proportionalSeats: 4 },
      { partyName: "日本共産党", seatsWon: 8, districtSeats: 3, proportionalSeats: 5 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 3, districtSeats: 3, proportionalSeats: 0 },
    ],
  },
  {
    name: "第24回参議院議員通常選挙",
    chamber: "HOUSE_OF_COUNCILLORS",
    date: "2016-07-10",
    totalSeats: 121,
    districtSeats: 73,
    proportionalSeats: 48,
    turnout: 54.70,
    results: [
      { partyName: "自由民主党", seatsWon: 56, districtSeats: 37, proportionalSeats: 19 },
      { partyName: "民進党", seatsWon: 32, districtSeats: 21, proportionalSeats: 11 },
      { partyName: "公明党", seatsWon: 14, districtSeats: 7, proportionalSeats: 7 },
      { partyName: "日本維新の会", seatsWon: 7, districtSeats: 3, proportionalSeats: 4 },
      { partyName: "日本共産党", seatsWon: 6, districtSeats: 1, proportionalSeats: 5 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "生活の党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 4, districtSeats: 4, proportionalSeats: 0 },
    ],
  },
  {
    name: "第25回参議院議員通常選挙",
    chamber: "HOUSE_OF_COUNCILLORS",
    date: "2019-07-21",
    totalSeats: 124,
    districtSeats: 74,
    proportionalSeats: 50,
    turnout: 48.80,
    results: [
      { partyName: "自由民主党", seatsWon: 57, districtSeats: 38, proportionalSeats: 19 },
      { partyName: "立憲民主党", seatsWon: 17, districtSeats: 9, proportionalSeats: 8 },
      { partyName: "公明党", seatsWon: 14, districtSeats: 7, proportionalSeats: 7 },
      { partyName: "日本維新の会", seatsWon: 10, districtSeats: 5, proportionalSeats: 5 },
      { partyName: "日本共産党", seatsWon: 7, districtSeats: 3, proportionalSeats: 4 },
      { partyName: "国民民主党", seatsWon: 6, districtSeats: 3, proportionalSeats: 3 },
      { partyName: "れいわ新選組", seatsWon: 2, districtSeats: 0, proportionalSeats: 2 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "NHK党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 9, districtSeats: 9, proportionalSeats: 0 },
    ],
  },
  {
    name: "第26回参議院議員通常選挙",
    chamber: "HOUSE_OF_COUNCILLORS",
    date: "2022-07-10",
    totalSeats: 125,
    districtSeats: 75,
    proportionalSeats: 50,
    turnout: 52.05,
    results: [
      { partyName: "自由民主党", seatsWon: 63, districtSeats: 45, proportionalSeats: 18 },
      { partyName: "立憲民主党", seatsWon: 17, districtSeats: 10, proportionalSeats: 7 },
      { partyName: "公明党", seatsWon: 13, districtSeats: 7, proportionalSeats: 6 },
      { partyName: "日本維新の会", seatsWon: 12, districtSeats: 4, proportionalSeats: 8 },
      { partyName: "国民民主党", seatsWon: 5, districtSeats: 2, proportionalSeats: 3 },
      { partyName: "日本共産党", seatsWon: 4, districtSeats: 1, proportionalSeats: 3 },
      { partyName: "れいわ新選組", seatsWon: 3, districtSeats: 1, proportionalSeats: 2 },
      { partyName: "参政党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "NHK党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 5, districtSeats: 5, proportionalSeats: 0 },
    ],
  },
  {
    name: "第27回参議院議員通常選挙",
    chamber: "HOUSE_OF_COUNCILLORS",
    date: "2025-07-20",
    totalSeats: 125,
    districtSeats: 75,
    proportionalSeats: 50,
    turnout: 58.51,
    results: [
      { partyName: "自由民主党", seatsWon: 39, districtSeats: 27, proportionalSeats: 12 },
      { partyName: "立憲民主党", seatsWon: 22, districtSeats: 15, proportionalSeats: 7 },
      { partyName: "国民民主党", seatsWon: 17, districtSeats: 10, proportionalSeats: 7 },
      { partyName: "参政党", seatsWon: 14, districtSeats: 7, proportionalSeats: 7 },
      { partyName: "公明党", seatsWon: 8, districtSeats: 4, proportionalSeats: 4 },
      { partyName: "日本維新の会", seatsWon: 7, districtSeats: 3, proportionalSeats: 4 },
      { partyName: "日本共産党", seatsWon: 3, districtSeats: 1, proportionalSeats: 2 },
      { partyName: "れいわ新選組", seatsWon: 3, districtSeats: 0, proportionalSeats: 3 },
      { partyName: "日本保守党", seatsWon: 2, districtSeats: 0, proportionalSeats: 2 },
      { partyName: "社民党", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "チームみらい", seatsWon: 1, districtSeats: 0, proportionalSeats: 1 },
      { partyName: "無所属", seatsWon: 8, districtSeats: 8, proportionalSeats: 0 },
    ],
  },
];

// ============================================
// メイン処理
// ============================================

const ALL_ELECTIONS: ElectionData[] = [
  ...HOUSE_OF_REPRESENTATIVES_ELECTIONS,
  ...HOUSE_OF_COUNCILLORS_ELECTIONS,
];

const SOURCE_URL = "https://www.soumu.go.jp/senkyo/";

/**
 * 政党名から既存 Party を検索し、なければ過去政党として作成する。
 * 返り値は partyId。
 */
async function resolvePartyId(
  partyName: string,
  cache: Map<string, string>,
): Promise<string | null> {
  // キャッシュに存在すればそのまま返す
  if (cache.has(partyName)) {
    return cache.get(partyName)!;
  }

  // DB から検索
  const existing = await prisma.party.findFirst({
    where: { name: partyName },
  });

  if (existing) {
    cache.set(partyName, existing.id);
    return existing.id;
  }

  // 過去政党リストに該当するか確認
  const historical = HISTORICAL_PARTIES.find((p) => p.name === partyName);

  // "社民党" は DB 上 "社会民主党" として登録されている可能性がある
  if (partyName === "社民党") {
    const sdp = await prisma.party.findFirst({
      where: { name: "社会民主党" },
    });
    if (sdp) {
      cache.set(partyName, sdp.id);
      return sdp.id;
    }
  }

  // "共産党" → "日本共産党" のショートネーム検索
  if (!historical) {
    const byShortName = await prisma.party.findFirst({
      where: { shortName: partyName },
    });
    if (byShortName) {
      cache.set(partyName, byShortName.id);
      return byShortName.id;
    }
  }

  if (historical) {
    // 過去政党を isActive: false で作成
    const created = await prisma.party.create({
      data: {
        name: historical.name,
        shortName: historical.shortName,
        color: historical.color,
        founded: new Date(historical.founded),
        dissolved: historical.dissolved ? new Date(historical.dissolved) : null,
        isActive: false,
      },
    });
    console.log(`[elections] 過去政党を作成: ${historical.name} (${created.id})`);
    cache.set(partyName, created.id);
    return created.id;
  }

  console.warn(`[elections] 政党が見つかりません: ${partyName}`);
  return null;
}

export async function seedElections(): Promise<void> {
  console.log("[elections] 選挙データのシードを開始...");

  const partyCache = new Map<string, string>();
  let electionCount = 0;
  let resultCount = 0;

  for (const electionData of ALL_ELECTIONS) {
    const electionDate = new Date(electionData.date);

    // 選挙を upsert（@@unique([chamber, date])）
    const election = await prisma.election.upsert({
      where: {
        chamber_date: {
          chamber: electionData.chamber,
          date: electionDate,
        },
      },
      update: {
        name: electionData.name,
        totalSeats: electionData.totalSeats,
        districtSeats: electionData.districtSeats,
        proportionalSeats: electionData.proportionalSeats,
        turnout: electionData.turnout,
        sourceUrl: SOURCE_URL,
      },
      create: {
        name: electionData.name,
        chamber: electionData.chamber,
        date: electionDate,
        totalSeats: electionData.totalSeats,
        districtSeats: electionData.districtSeats,
        proportionalSeats: electionData.proportionalSeats,
        turnout: electionData.turnout,
        sourceUrl: SOURCE_URL,
      },
    });

    electionCount++;
    console.log(
      `[elections] 選挙: ${electionData.name} (${electionData.date}) — ${election.id}`,
    );

    // 各政党の選挙結果を upsert
    for (const result of electionData.results) {
      const partyId = await resolvePartyId(result.partyName, partyCache);
      if (!partyId) {
        console.warn(
          `[elections]   スキップ: ${result.partyName} (政党未解決)`,
        );
        continue;
      }

      await prisma.electionResult.upsert({
        where: {
          electionId_partyId: {
            electionId: election.id,
            partyId,
          },
        },
        update: {
          seatsWon: result.seatsWon,
          districtSeats: result.districtSeats,
          proportionalSeats: result.proportionalSeats,
          ...(result.totalVotes != null ? { totalVotes: result.totalVotes } : {}),
          ...(result.voteShare != null ? { voteShare: result.voteShare } : {}),
        },
        create: {
          electionId: election.id,
          partyId,
          seatsWon: result.seatsWon,
          districtSeats: result.districtSeats,
          proportionalSeats: result.proportionalSeats,
          ...(result.totalVotes != null ? { totalVotes: result.totalVotes } : {}),
          ...(result.voteShare != null ? { voteShare: result.voteShare } : {}),
        },
      });

      resultCount++;
      console.log(
        `[elections]   ${result.partyName}: ${result.seatsWon}議席 (小選挙区${result.districtSeats} + 比例${result.proportionalSeats})`,
      );
    }
  }

  console.log(
    `[elections] 完了 — ${electionCount}選挙, ${resultCount}件の結果を登録`,
  );
}

// CLI実行
if (process.argv[1]?.includes("elections/seed-elections")) {
  seedElections()
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
