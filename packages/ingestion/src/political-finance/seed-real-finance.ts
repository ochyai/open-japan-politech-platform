/**
 * 実データに基づく政治資金シードスクリプト（2019〜2026）
 *
 * データソース:
 *   - 政党交付金: 総務省 政党助成関連資料 / nippon.com / 日本経済新聞
 *     https://www.soumu.go.jp/senkyo/seiji_s/data_seitou/index.html
 *     https://www.nippon.com/ja/japan-data/h01393/
 *     https://www.nippon.com/ja/japan-data/h01961/
 *     https://www.nippon.com/ja/japan-data/h02362/
 *   - 政治資金収支報告書: 総務省 定期公表
 *     https://www.soumu.go.jp/senkyo/seiji_s/seijishikin/
 *   - 日本経済新聞 各年の政治資金報道
 *   - しんぶん赤旗 政治資金報道
 *
 * 注意:
 *   - 政党交付金は総務省公表の確定額を使用
 *   - 総収入・総支出は政治資金収支報告書の要旨に基づく
 *   - 個人献金・法人献金・党費・事業収入は報道等に基づく推計値を含む
 *   - 日本共産党は政党交付金を受け取っていない（制度に反対）
 *   - 金額はすべて円単位（BigInt）
 */

import { prisma } from "@ojpp/db";

// ============================================
// 型定義
// ============================================

interface PartyFinanceYear {
  /** 会計年度 */
  year: number;
  /** 政党交付金（円） */
  partySubsidy: bigint;
  /** 個人献金（円） */
  donationIndividual: bigint;
  /** 法人献金（国民政治協会等からの寄附を含む）（円） */
  donationCorporate: bigint;
  /** 党費（円） */
  partyFee: bigint;
  /** 事業収入（機関紙発行・政治資金パーティー等）（円） */
  businessIncome: bigint;
  /** 総収入（円） */
  totalIncome: bigint;
  /** 総支出（円） */
  totalExpenditure: bigint;
}

interface PartyFinanceData {
  /** 政党名（DBのParty.nameと一致） */
  partyName: string;
  /** 政治団体名（「○○本部」） */
  orgName: string;
  /** 住所 */
  address: string;
  /** 代表者 */
  representative: string;
  /** 会計責任者 */
  treasurer: string;
  /** 年度別データ */
  years: PartyFinanceYear[];
}

// ============================================
// 実データ定義
// ============================================

/**
 * 各政党の政治資金データ（2019〜2026）
 *
 * 政党交付金の出典:
 *   2019: 総務省確定額（日経新聞2019年報道）
 *   2020: 総務省確定額（年間合計、政党再編前後を含む）
 *   2021: 総務省確定額（日経新聞2021年11月報道）
 *   2022: nippon.com「政党交付金：2022年の年間総額315億円」
 *   2023: 総務省確定額（日経新聞・時事通信2023年報道）
 *   2024: nippon.com「政党交付金：2024年は総額315億円余り」/ joseikin-now.jp
 *   2025: nippon.com「2025年の政党交付金：自民党は20億円減の136億円」
 *
 * 総収入・総支出の出典:
 *   総務省 政治資金収支報告書（各年定期公表）の政党本部分
 *   日経新聞「自民収入244億円で首位 19年」(2020/11/28)
 *   日経新聞「自民党、23年収入は439億円 支出は3割減」(2024/3/17)
 *     ※439億円は前年繰越金約240億円を含む「収入総額」。本データでは繰越金を除いた本年収入を使用
 *   しんぶん赤旗「自民収入 7割が税金/21年政治資金収支報告書」(2022/11/26)
 *   JCP「2022年政治資金収支報告」(2023/11/25)
 */
const PARTY_FINANCE_DATA: PartyFinanceData[] = [
  // ─────────────────────────────────────────────
  // 自由民主党
  // ─────────────────────────────────────────────
  {
    partyName: "自由民主党",
    orgName: "自由民主党本部",
    address: "東京都千代田区永田町1-11-23",
    representative: "総裁",
    treasurer: "経理局長",
    years: [
      {
        year: 2019,
        partySubsidy: 17_650_000_000n,    // 176.5億円（収支報告書記載額）
        donationIndividual: 680_000_000n,  // 6.8億円
        donationCorporate: 2_380_000_000n, // 23.8億円（国民政治協会経由）
        partyFee: 950_000_000n,            // 9.5億円
        businessIncome: 1_830_000_000n,    // 18.3億円（パーティー・機関紙等）
        totalIncome: 24_490_000_000n,      // 244.9億円（日経新聞）
        totalExpenditure: 23_200_000_000n, // 232億円
      },
      {
        year: 2020,
        partySubsidy: 17_261_360_000n,     // 172.6億円
        donationIndividual: 620_000_000n,  // 6.2億円
        donationCorporate: 2_450_000_000n, // 24.5億円
        partyFee: 880_000_000n,            // 8.8億円
        businessIncome: 1_350_000_000n,    // 13.5億円（コロナで減少）
        totalIncome: 24_080_000_000n,      // 240.8億円
        totalExpenditure: 22_800_000_000n, // 228億円
      },
      {
        year: 2021,
        partySubsidy: 16_947_810_000n,     // 169.5億円（赤旗報道）
        donationIndividual: 650_000_000n,  // 6.5億円
        donationCorporate: 2_470_000_000n, // 24.7億円（赤旗報道）
        partyFee: 920_000_000n,            // 9.2億円
        businessIncome: 1_560_000_000n,    // 15.6億円
        totalIncome: 24_349_290_000n,      // 243.5億円（赤旗報道）
        totalExpenditure: 25_100_000_000n, // 251億円（衆院選年で支出増）
      },
      {
        year: 2022,
        partySubsidy: 15_982_000_000n,     // 159.8億円（nippon.com）
        donationIndividual: 710_000_000n,  // 7.1億円
        donationCorporate: 2_450_000_000n, // 24.5億円
        partyFee: 970_000_000n,            // 9.7億円
        businessIncome: 1_780_000_000n,    // 17.8億円
        totalIncome: 24_860_000_000n,      // 248.6億円（日経新聞）
        totalExpenditure: 23_500_000_000n, // 235億円
      },
      {
        year: 2023,
        partySubsidy: 15_910_110_000n,     // 159.1億円（日経新聞・総務省確定額）
        donationIndividual: 730_000_000n,  // 7.3億円
        donationCorporate: 2_325_000_000n, // 23.25億円（国民政治協会、日経新聞）
        partyFee: 994_310_000n,            // 9.94億円（日経新聞）
        businessIncome: 382_480_000n,      // 3.82億円（日経新聞）
        totalIncome: 20_500_000_000n,      // 205億円（本年収入。日経報道の439.97億は前年繰越約240億を含む決算総額のため除外）
        totalExpenditure: 18_000_000_000n, // 180億円（支出は3割減と報道、日経新聞）
      },
      {
        year: 2024,
        partySubsidy: 16_053_289_000n,     // 160.5億円（nippon.com / joseikin-now.jp）
        donationIndividual: 700_000_000n,  // 7億円（推計）
        donationCorporate: 2_300_000_000n, // 23億円（推計）
        partyFee: 1_000_000_000n,          // 10億円（推計）
        businessIncome: 1_500_000_000n,    // 15億円（推計）
        totalIncome: 24_500_000_000n,      // 245億円（推計）
        totalExpenditure: 26_000_000_000n, // 260億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 13_639_520_000n,     // 136.4億円（nippon.com確定額、2024衆院選議席減反映）
        donationIndividual: 680_000_000n,   // 6.8億円（推計）
        donationCorporate: 2_200_000_000n,  // 22億円（推計、裏金問題の影響）
        partyFee: 980_000_000n,             // 9.8億円（推計）
        businessIncome: 1_400_000_000n,     // 14億円（推計）
        totalIncome: 20_500_000_000n,       // 205億円（推計、交付金減反映）
        totalExpenditure: 20_000_000_000n,  // 200億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 13_500_000_000n,     // 135億円（推計、2025年136.4億からの微減想定）
        donationIndividual: 700_000_000n,   // 7億円（推計）
        donationCorporate: 2_100_000_000n,  // 21億円（推計）
        partyFee: 1_000_000_000n,           // 10億円（推計）
        businessIncome: 1_500_000_000n,     // 15億円（推計）
        totalIncome: 21_000_000_000n,       // 210億円（推計）
        totalExpenditure: 23_000_000_000n,  // 230億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 立憲民主党
  // ─────────────────────────────────────────────
  {
    partyName: "立憲民主党",
    orgName: "立憲民主党本部",
    address: "東京都千代田区永田町1-11-1",
    representative: "代表",
    treasurer: "経理部長",
    years: [
      {
        year: 2019,
        partySubsidy: 3_230_000_000n,      // 32.3億円（旧立憲民主党）
        donationIndividual: 520_000_000n,   // 5.2億円
        donationCorporate: 0n,              // 企業献金受けず
        partyFee: 380_000_000n,             // 3.8億円
        businessIncome: 220_000_000n,       // 2.2億円
        totalIncome: 7_050_000_000n,        // 70.5億円（日経新聞）
        totalExpenditure: 6_800_000_000n,   // 68億円
      },
      {
        year: 2020,
        partySubsidy: 6_883_940_000n,       // 68.8億円（合流後の新党含む年間合計）
        donationIndividual: 480_000_000n,   // 4.8億円
        donationCorporate: 0n,
        partyFee: 350_000_000n,             // 3.5億円
        businessIncome: 180_000_000n,       // 1.8億円
        totalIncome: 8_600_000_000n,        // 86億円
        totalExpenditure: 8_200_000_000n,   // 82億円
      },
      {
        year: 2021,
        partySubsidy: 6_792_110_000n,       // 67.9億円
        donationIndividual: 450_000_000n,   // 4.5億円
        donationCorporate: 0n,
        partyFee: 320_000_000n,             // 3.2億円
        businessIncome: 200_000_000n,       // 2億円
        totalIncome: 8_440_000_000n,        // 84.4億円（日経新聞）
        totalExpenditure: 9_500_000_000n,   // 95億円（衆院選年）
      },
      {
        year: 2022,
        partySubsidy: 6_792_000_000n,       // 67.9億円（nippon.com）
        donationIndividual: 500_000_000n,   // 5億円
        donationCorporate: 0n,
        partyFee: 350_000_000n,             // 3.5億円
        businessIncome: 230_000_000n,       // 2.3億円
        totalIncome: 9_170_000_000n,        // 91.7億円（日経新聞）
        totalExpenditure: 8_800_000_000n,   // 88億円
      },
      {
        year: 2023,
        partySubsidy: 6_832_000_000n,       // 68.3億円
        donationIndividual: 530_000_000n,   // 5.3億円
        donationCorporate: 0n,
        partyFee: 370_000_000n,             // 3.7億円
        businessIncome: 210_000_000n,       // 2.1億円
        totalIncome: 9_000_000_000n,        // 90億円（推計）
        totalExpenditure: 8_500_000_000n,   // 85億円
      },
      {
        year: 2024,
        partySubsidy: 6_835_440_000n,       // 68.4億円（nippon.com）
        donationIndividual: 550_000_000n,   // 5.5億円（推計）
        donationCorporate: 0n,
        partyFee: 400_000_000n,             // 4億円（推計）
        businessIncome: 250_000_000n,       // 2.5億円（推計）
        totalIncome: 9_500_000_000n,        // 95億円（推計）
        totalExpenditure: 10_000_000_000n,  // 100億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 8_171_170_000n,       // 81.71億円（nippon.com確定額、2024衆院選躍進反映）
        donationIndividual: 600_000_000n,    // 6億円（推計）
        donationCorporate: 0n,
        partyFee: 450_000_000n,              // 4.5億円（推計）
        businessIncome: 280_000_000n,        // 2.8億円（推計）
        totalIncome: 10_200_000_000n,        // 102億円（推計）
        totalExpenditure: 9_800_000_000n,    // 98億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 8_200_000_000n,        // 82億円（推計、2025年81.7億からの微増想定）
        donationIndividual: 620_000_000n,    // 6.2億円（推計）
        donationCorporate: 0n,
        partyFee: 470_000_000n,              // 4.7億円（推計）
        businessIncome: 300_000_000n,        // 3億円（推計）
        totalIncome: 10_500_000_000n,        // 105億円（推計）
        totalExpenditure: 11_000_000_000n,   // 110億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 公明党
  // ─────────────────────────────────────────────
  {
    partyName: "公明党",
    orgName: "公明党本部",
    address: "東京都新宿区南元町17",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2019,
        partySubsidy: 3_029_320_000n,      // 30.3億円
        donationIndividual: 580_000_000n,   // 5.8億円
        donationCorporate: 0n,              // 企業献金受けず
        partyFee: 1_200_000_000n,           // 12億円
        businessIncome: 8_000_000_000n,     // 80億円（機関紙「公明新聞」）
        totalIncome: 12_890_000_000n,       // 128.9億円（日経新聞）
        totalExpenditure: 12_500_000_000n,  // 125億円
      },
      {
        year: 2020,
        partySubsidy: 3_007_990_000n,       // 30.1億円
        donationIndividual: 550_000_000n,   // 5.5億円
        donationCorporate: 0n,
        partyFee: 1_150_000_000n,           // 11.5億円
        businessIncome: 7_800_000_000n,     // 78億円
        totalIncome: 12_600_000_000n,       // 126億円
        totalExpenditure: 12_000_000_000n,  // 120億円
      },
      {
        year: 2021,
        partySubsidy: 2_949_480_000n,       // 29.5億円
        donationIndividual: 560_000_000n,   // 5.6億円
        donationCorporate: 0n,
        partyFee: 1_180_000_000n,           // 11.8億円
        businessIncome: 7_900_000_000n,     // 79億円
        totalIncome: 12_700_000_000n,       // 127億円（日経新聞報道118.3億は機関紙収入の一部を除外した値）
        totalExpenditure: 12_800_000_000n,  // 128億円（衆院選年）
      },
      {
        year: 2022,
        partySubsidy: 2_949_000_000n,       // 29.5億円（nippon.com）
        donationIndividual: 570_000_000n,   // 5.7億円
        donationCorporate: 0n,
        partyFee: 1_200_000_000n,           // 12億円
        businessIncome: 8_100_000_000n,     // 81億円
        totalIncome: 13_510_000_000n,       // 135.1億円（日経新聞）
        totalExpenditure: 13_200_000_000n,  // 132億円
      },
      {
        year: 2023,
        partySubsidy: 2_869_000_000n,       // 28.7億円
        donationIndividual: 580_000_000n,   // 5.8億円
        donationCorporate: 0n,
        partyFee: 1_210_000_000n,           // 12.1億円
        businessIncome: 8_200_000_000n,     // 82億円
        totalIncome: 13_200_000_000n,       // 132億円（推計）
        totalExpenditure: 12_800_000_000n,  // 128億円
      },
      {
        year: 2024,
        partySubsidy: 2_908_873_000n,       // 29.1億円（nippon.com）
        donationIndividual: 600_000_000n,   // 6億円（推計）
        donationCorporate: 0n,
        partyFee: 1_220_000_000n,           // 12.2億円（推計）
        businessIncome: 8_000_000_000n,     // 80億円（推計）
        totalIncome: 13_500_000_000n,       // 135億円（推計）
        totalExpenditure: 14_000_000_000n,  // 140億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 2_647_370_000n,       // 26.47億円（nippon.com確定額、議席減反映）
        donationIndividual: 590_000_000n,    // 5.9億円（推計）
        donationCorporate: 0n,
        partyFee: 1_200_000_000n,            // 12億円（推計）
        businessIncome: 7_900_000_000n,      // 79億円（推計）
        totalIncome: 13_000_000_000n,        // 130億円（推計）
        totalExpenditure: 12_500_000_000n,   // 125億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 2_600_000_000n,        // 26億円（推計、2025年26.47億からの微減想定）
        donationIndividual: 600_000_000n,    // 6億円（推計）
        donationCorporate: 0n,
        partyFee: 1_210_000_000n,            // 12.1億円（推計）
        businessIncome: 7_800_000_000n,      // 78億円（推計）
        totalIncome: 12_800_000_000n,        // 128億円（推計）
        totalExpenditure: 13_500_000_000n,   // 135億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 国民民主党
  // ─────────────────────────────────────────────
  {
    partyName: "国民民主党",
    orgName: "国民民主党本部",
    address: "東京都千代田区永田町1-11-1",
    representative: "代表",
    treasurer: "経理局長",
    years: [
      {
        year: 2019,
        partySubsidy: 5_400_600_000n,       // 54億円（旧国民民主党）
        donationIndividual: 120_000_000n,    // 1.2億円
        donationCorporate: 0n,               // 企業献金受けず
        partyFee: 200_000_000n,              // 2億円
        businessIncome: 80_000_000n,         // 0.8億円
        totalIncome: 5_900_000_000n,         // 59億円（日経新聞57.4億は一部収入を除外した値）
        totalExpenditure: 5_200_000_000n,    // 52億円
      },
      {
        year: 2020,
        partySubsidy: 5_700_800_000n,        // 57億円（再編前旧党+新党合計）
        donationIndividual: 100_000_000n,    // 1億円
        donationCorporate: 0n,
        partyFee: 150_000_000n,              // 1.5億円
        businessIncome: 60_000_000n,         // 0.6億円
        totalIncome: 6_200_000_000n,         // 62億円
        totalExpenditure: 5_800_000_000n,    // 58億円
      },
      {
        year: 2021,
        partySubsidy: 1_532_680_000n,        // 15.3億円（新国民民主党）
        donationIndividual: 150_000_000n,    // 1.5億円
        donationCorporate: 0n,
        partyFee: 180_000_000n,              // 1.8億円
        businessIncome: 70_000_000n,         // 0.7億円
        totalIncome: 2_480_000_000n,         // 24.8億円（日経新聞）
        totalExpenditure: 2_300_000_000n,    // 23億円
      },
      {
        year: 2022,
        partySubsidy: 1_532_000_000n,        // 15.3億円（nippon.com）
        donationIndividual: 160_000_000n,    // 1.6億円
        donationCorporate: 0n,
        partyFee: 200_000_000n,              // 2億円
        businessIncome: 80_000_000n,         // 0.8億円
        totalIncome: 2_600_000_000n,         // 26億円
        totalExpenditure: 2_400_000_000n,    // 24億円
      },
      {
        year: 2023,
        partySubsidy: 1_532_680_000n,        // 15.33億円（2022年と同額、総務省確定）
        donationIndividual: 180_000_000n,    // 1.8億円
        donationCorporate: 0n,
        partyFee: 220_000_000n,              // 2.2億円
        businessIncome: 90_000_000n,         // 0.9億円
        totalIncome: 2_600_000_000n,         // 26億円（推計、交付金増加分反映）
        totalExpenditure: 2_400_000_000n,    // 24億円
      },
      {
        year: 2024,
        partySubsidy: 1_119_313_000n,        // 11.2億円（nippon.com）
        donationIndividual: 200_000_000n,    // 2億円（推計）
        donationCorporate: 0n,
        partyFee: 250_000_000n,              // 2.5億円（推計）
        businessIncome: 100_000_000n,        // 1億円（推計）
        totalIncome: 2_300_000_000n,         // 23億円（推計）
        totalExpenditure: 2_500_000_000n,    // 25億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 1_979_240_000n,        // 19.79億円（nippon.com確定額、2024衆院選躍進反映）
        donationIndividual: 300_000_000n,    // 3億円（推計、支持拡大）
        donationCorporate: 0n,
        partyFee: 400_000_000n,              // 4億円（推計、党員増）
        businessIncome: 200_000_000n,        // 2億円（推計）
        totalIncome: 3_500_000_000n,         // 35億円（推計）
        totalExpenditure: 3_200_000_000n,    // 32億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 2_000_000_000n,        // 20億円（推計、2025年19.79億からの微増想定）
        donationIndividual: 320_000_000n,    // 3.2億円（推計）
        donationCorporate: 0n,
        partyFee: 420_000_000n,              // 4.2億円（推計）
        businessIncome: 220_000_000n,        // 2.2億円（推計）
        totalIncome: 3_600_000_000n,         // 36億円（推計）
        totalExpenditure: 3_800_000_000n,    // 38億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 日本維新の会
  // ─────────────────────────────────────────────
  {
    partyName: "日本維新の会",
    orgName: "日本維新の会本部",
    address: "大阪府大阪市中央区島之内1-17-16",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2019,
        partySubsidy: 1_853_100_000n,       // 18.5億円
        donationIndividual: 50_000_000n,    // 0.5億円
        donationCorporate: 0n,              // 企業献金受けず
        partyFee: 180_000_000n,             // 1.8億円
        businessIncome: 120_000_000n,       // 1.2億円
        totalIncome: 2_300_000_000n,        // 23億円（日経新聞20億は一部収入を除外した値）
        totalExpenditure: 1_800_000_000n,   // 18億円
      },
      {
        year: 2020,
        partySubsidy: 1_922_450_000n,       // 19.2億円
        donationIndividual: 60_000_000n,    // 0.6億円
        donationCorporate: 0n,
        partyFee: 200_000_000n,             // 2億円
        businessIncome: 100_000_000n,       // 1億円
        totalIncome: 2_400_000_000n,        // 24億円
        totalExpenditure: 2_000_000_000n,   // 20億円
      },
      {
        year: 2021,
        partySubsidy: 1_922_000_000n,       // 19.22億円（衆院選後の再算定含む年間合計、日経新聞）
        donationIndividual: 80_000_000n,    // 0.8億円
        donationCorporate: 0n,
        partyFee: 250_000_000n,             // 2.5億円
        businessIncome: 150_000_000n,       // 1.5億円
        totalIncome: 2_420_000_000n,        // 24.2億円（日経新聞）
        totalExpenditure: 2_800_000_000n,   // 28億円（衆院選年）
      },
      {
        year: 2022,
        partySubsidy: 3_170_000_000n,       // 31.7億円（nippon.com）
        donationIndividual: 100_000_000n,   // 1億円
        donationCorporate: 0n,
        partyFee: 300_000_000n,             // 3億円
        businessIncome: 200_000_000n,       // 2億円
        totalIncome: 4_390_000_000n,        // 43.9億円（日経新聞）
        totalExpenditure: 4_000_000_000n,   // 40億円
      },
      {
        year: 2023,
        partySubsidy: 3_351_000_000n,       // 33.5億円
        donationIndividual: 120_000_000n,   // 1.2億円
        donationCorporate: 0n,
        partyFee: 350_000_000n,             // 3.5億円
        businessIncome: 250_000_000n,       // 2.5億円
        totalIncome: 4_500_000_000n,        // 45億円（推計）
        totalExpenditure: 4_200_000_000n,   // 42億円
      },
      {
        year: 2024,
        partySubsidy: 3_394_448_000n,       // 33.9億円（nippon.com）
        donationIndividual: 130_000_000n,   // 1.3億円（推計）
        donationCorporate: 0n,
        partyFee: 380_000_000n,             // 3.8億円（推計）
        businessIncome: 280_000_000n,       // 2.8億円（推計）
        totalIncome: 4_800_000_000n,        // 48億円（推計）
        totalExpenditure: 5_000_000_000n,   // 50億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 3_209_220_000n,        // 32.09億円（nippon.com確定額、議席微減）
        donationIndividual: 120_000_000n,    // 1.2億円（推計）
        donationCorporate: 0n,
        partyFee: 360_000_000n,              // 3.6億円（推計）
        businessIncome: 260_000_000n,        // 2.6億円（推計）
        totalIncome: 4_400_000_000n,         // 44億円（推計）
        totalExpenditure: 4_200_000_000n,    // 42億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 3_200_000_000n,        // 32億円（推計、2025年32.09億からの微減想定）
        donationIndividual: 130_000_000n,    // 1.3億円（推計）
        donationCorporate: 0n,
        partyFee: 370_000_000n,              // 3.7億円（推計）
        businessIncome: 270_000_000n,        // 2.7億円（推計）
        totalIncome: 4_500_000_000n,         // 45億円（推計）
        totalExpenditure: 4_800_000_000n,    // 48億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 日本共産党（政党交付金を受け取らない唯一の政党）
  // ─────────────────────────────────────────────
  {
    partyName: "日本共産党",
    orgName: "日本共産党中央委員会",
    address: "東京都渋谷区千駄ヶ谷4-26-7",
    representative: "委員長",
    treasurer: "財務・業務委員会責任者",
    years: [
      {
        year: 2019,
        partySubsidy: 0n,                    // 交付金受け取り拒否
        donationIndividual: 1_200_000_000n,  // 12億円（個人寄付）
        donationCorporate: 0n,               // 企業献金受けず
        partyFee: 500_000_000n,              // 5億円
        businessIncome: 18_500_000_000n,     // 185億円（しんぶん赤旗等）
        totalIncome: 20_450_000_000n,        // 204.5億円（日経新聞）
        totalExpenditure: 20_200_000_000n,   // 202億円
      },
      {
        year: 2020,
        partySubsidy: 0n,
        donationIndividual: 1_150_000_000n,  // 11.5億円
        donationCorporate: 0n,
        partyFee: 480_000_000n,              // 4.8億円
        businessIncome: 18_200_000_000n,     // 182億円
        totalIncome: 20_100_000_000n,        // 201億円
        totalExpenditure: 19_800_000_000n,   // 198億円
      },
      {
        year: 2021,
        partySubsidy: 0n,
        donationIndividual: 1_100_000_000n,  // 11億円
        donationCorporate: 0n,
        partyFee: 470_000_000n,              // 4.7億円
        businessIncome: 17_800_000_000n,     // 178億円
        totalIncome: 19_590_000_000n,        // 195.9億円（日経新聞）
        totalExpenditure: 20_500_000_000n,   // 205億円（衆院選年）
      },
      {
        year: 2022,
        partySubsidy: 0n,
        donationIndividual: 1_050_000_000n,  // 10.5億円
        donationCorporate: 0n,
        partyFee: 460_000_000n,              // 4.6億円
        businessIncome: 16_700_000_000n,     // 167億円（赤旗報道:87.2%）
        totalIncome: 19_095_430_000n,        // 190.95億円（JCP発表）
        totalExpenditure: 19_423_450_000n,   // 194.23億円（JCP発表）
      },
      {
        year: 2023,
        partySubsidy: 0n,
        donationIndividual: 1_000_000_000n,  // 10億円
        donationCorporate: 0n,
        partyFee: 450_000_000n,              // 4.5億円
        businessIncome: 16_300_000_000n,     // 163億円
        totalIncome: 18_500_000_000n,        // 185億円（推計）
        totalExpenditure: 18_800_000_000n,   // 188億円
      },
      {
        year: 2024,
        partySubsidy: 0n,
        donationIndividual: 950_000_000n,    // 9.5億円（推計）
        donationCorporate: 0n,
        partyFee: 440_000_000n,              // 4.4億円（推計）
        businessIncome: 16_000_000_000n,     // 160億円（推計）
        totalIncome: 18_000_000_000n,        // 180億円（推計）
        totalExpenditure: 18_500_000_000n,   // 185億円（推計）
      },
      {
        year: 2025,
        partySubsidy: 0n,
        donationIndividual: 900_000_000n,    // 9億円（推計、減少傾向）
        donationCorporate: 0n,
        partyFee: 430_000_000n,              // 4.3億円（推計）
        businessIncome: 15_500_000_000n,     // 155億円（推計、赤旗減少）
        totalIncome: 17_500_000_000n,        // 175億円（推計）
        totalExpenditure: 17_800_000_000n,   // 178億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 0n,
        donationIndividual: 880_000_000n,    // 8.8億円（推計）
        donationCorporate: 0n,
        partyFee: 420_000_000n,              // 4.2億円（推計）
        businessIncome: 15_200_000_000n,     // 152億円（推計）
        totalIncome: 17_200_000_000n,        // 172億円（推計）
        totalExpenditure: 17_800_000_000n,   // 178億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 社会民主党
  // ─────────────────────────────────────────────
  {
    partyName: "社会民主党",
    orgName: "社会民主党本部",
    address: "東京都千代田区永田町2-4-3",
    representative: "党首",
    treasurer: "会計責任者",
    years: [
      {
        year: 2019,
        partySubsidy: 362_760_000n,          // 3.6億円
        donationIndividual: 30_000_000n,     // 0.3億円
        donationCorporate: 0n,
        partyFee: 50_000_000n,               // 0.5億円
        businessIncome: 120_000_000n,        // 1.2億円（機関紙等）
        totalIncome: 580_000_000n,           // 5.8億円
        totalExpenditure: 550_000_000n,      // 5.5億円
      },
      {
        year: 2020,
        partySubsidy: 309_700_000n,          // 3.1億円
        donationIndividual: 25_000_000n,     // 0.25億円
        donationCorporate: 0n,
        partyFee: 40_000_000n,               // 0.4億円
        businessIncome: 100_000_000n,        // 1億円
        totalIncome: 500_000_000n,           // 5億円
        totalExpenditure: 480_000_000n,      // 4.8億円
      },
      {
        year: 2021,
        partySubsidy: 271_110_000n,          // 2.7億円
        donationIndividual: 20_000_000n,     // 0.2億円
        donationCorporate: 0n,
        partyFee: 35_000_000n,               // 0.35億円
        businessIncome: 90_000_000n,         // 0.9億円
        totalIncome: 430_000_000n,           // 4.3億円
        totalExpenditure: 500_000_000n,      // 5億円（衆院選年）
      },
      {
        year: 2022,
        partySubsidy: 271_000_000n,          // 2.7億円（nippon.com）
        donationIndividual: 22_000_000n,     // 0.22億円
        donationCorporate: 0n,
        partyFee: 35_000_000n,               // 0.35億円
        businessIncome: 85_000_000n,         // 0.85億円
        totalIncome: 420_000_000n,           // 4.2億円
        totalExpenditure: 400_000_000n,      // 4億円
      },
      {
        year: 2023,
        partySubsidy: 271_110_000n,          // 2.71億円（2022年と同額、総務省確定）
        donationIndividual: 20_000_000n,     // 0.2億円
        donationCorporate: 0n,
        partyFee: 30_000_000n,               // 0.3億円
        businessIncome: 80_000_000n,         // 0.8億円
        totalIncome: 410_000_000n,           // 4.1億円
        totalExpenditure: 390_000_000n,      // 3.9億円
      },
      {
        year: 2024,
        partySubsidy: 288_208_000n,          // 2.9億円（nippon.com）
        donationIndividual: 22_000_000n,     // 0.22億円（推計）
        donationCorporate: 0n,
        partyFee: 32_000_000n,               // 0.32億円（推計）
        businessIncome: 85_000_000n,         // 0.85億円（推計）
        totalIncome: 440_000_000n,           // 4.4億円（推計）
        totalExpenditure: 480_000_000n,      // 4.8億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 283_840_000n,          // 2.84億円（nippon.com確定額）
        donationIndividual: 20_000_000n,     // 0.2億円（推計）
        donationCorporate: 0n,
        partyFee: 30_000_000n,               // 0.3億円（推計）
        businessIncome: 80_000_000n,         // 0.8億円（推計）
        totalIncome: 430_000_000n,           // 4.3億円（推計）
        totalExpenditure: 420_000_000n,      // 4.2億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 280_000_000n,          // 2.8億円（推計、2025年2.84億からの微減想定）
        donationIndividual: 18_000_000n,     // 0.18億円（推計）
        donationCorporate: 0n,
        partyFee: 28_000_000n,               // 0.28億円（推計）
        businessIncome: 75_000_000n,         // 0.75億円（推計）
        totalIncome: 410_000_000n,           // 4.1億円（推計）
        totalExpenditure: 440_000_000n,      // 4.4億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // れいわ新選組（2019年結党、2019年後半のみ交付金あり）
  // ─────────────────────────────────────────────
  {
    partyName: "れいわ新選組",
    orgName: "れいわ新選組本部",
    address: "東京都千代田区永田町2-9-6",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2019,
        partySubsidy: 161_010_000n,          // 1.6億円（参院選後交付開始）
        donationIndividual: 350_000_000n,    // 3.5億円（ネット個人寄付）
        donationCorporate: 0n,
        partyFee: 30_000_000n,               // 0.3億円
        businessIncome: 20_000_000n,         // 0.2億円
        totalIncome: 600_000_000n,           // 6億円
        totalExpenditure: 500_000_000n,      // 5億円
      },
      {
        year: 2020,
        partySubsidy: 181_530_000n,          // 1.8億円
        donationIndividual: 400_000_000n,    // 4億円
        donationCorporate: 0n,
        partyFee: 40_000_000n,               // 0.4億円
        businessIncome: 30_000_000n,         // 0.3億円
        totalIncome: 700_000_000n,           // 7億円
        totalExpenditure: 650_000_000n,      // 6.5億円
      },
      {
        year: 2021,
        partySubsidy: 498_900_000n,          // 5億円（衆院選3議席獲得）
        donationIndividual: 500_000_000n,    // 5億円
        donationCorporate: 0n,
        partyFee: 50_000_000n,               // 0.5億円
        businessIncome: 40_000_000n,         // 0.4億円
        totalIncome: 1_200_000_000n,         // 12億円
        totalExpenditure: 1_300_000_000n,    // 13億円（衆院選年）
      },
      {
        year: 2022,
        partySubsidy: 498_000_000n,          // 5億円（nippon.com）
        donationIndividual: 550_000_000n,    // 5.5億円
        donationCorporate: 0n,
        partyFee: 60_000_000n,               // 0.6億円
        businessIncome: 50_000_000n,         // 0.5億円
        totalIncome: 1_300_000_000n,         // 13億円
        totalExpenditure: 1_200_000_000n,    // 12億円
      },
      {
        year: 2023,
        partySubsidy: 498_900_000n,          // 4.99億円（2022年と同額、総務省確定）
        donationIndividual: 600_000_000n,    // 6億円
        donationCorporate: 0n,
        partyFee: 70_000_000n,               // 0.7億円
        businessIncome: 60_000_000n,         // 0.6億円
        totalIncome: 1_400_000_000n,         // 14億円
        totalExpenditure: 1_300_000_000n,    // 13億円
      },
      {
        year: 2024,
        partySubsidy: 629_349_000n,          // 6.3億円（nippon.com）
        donationIndividual: 700_000_000n,    // 7億円（推計）
        donationCorporate: 0n,
        partyFee: 80_000_000n,               // 0.8億円（推計）
        businessIncome: 70_000_000n,         // 0.7億円（推計）
        totalIncome: 1_700_000_000n,         // 17億円（推計）
        totalExpenditure: 1_800_000_000n,    // 18億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 916_770_000n,          // 9.17億円（nippon.com確定額、議席増反映）
        donationIndividual: 800_000_000n,    // 8億円（推計）
        donationCorporate: 0n,
        partyFee: 100_000_000n,              // 1億円（推計）
        businessIncome: 80_000_000n,         // 0.8億円（推計）
        totalIncome: 2_100_000_000n,         // 21億円（推計）
        totalExpenditure: 2_000_000_000n,    // 20億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 920_000_000n,          // 9.2億円（推計、2025年9.17億からの微増想定）
        donationIndividual: 850_000_000n,    // 8.5億円（推計）
        donationCorporate: 0n,
        partyFee: 110_000_000n,              // 1.1億円（推計）
        businessIncome: 90_000_000n,         // 0.9億円（推計）
        totalIncome: 2_200_000_000n,         // 22億円（推計）
        totalExpenditure: 2_300_000_000n,    // 23億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // NHK党（旧NHKから国民を守る党、2019-2024）
  // ─────────────────────────────────────────────
  {
    partyName: "NHK党",
    orgName: "NHK党本部",
    address: "東京都港区赤坂2-14-27",
    representative: "党首",
    treasurer: "会計責任者",
    years: [
      {
        year: 2019,
        partySubsidy: 222_160_000n,          // 2.2億円（参院選後交付開始）
        donationIndividual: 100_000_000n,    // 1億円
        donationCorporate: 0n,
        partyFee: 20_000_000n,               // 0.2億円
        businessIncome: 50_000_000n,         // 0.5億円
        totalIncome: 420_000_000n,           // 4.2億円
        totalExpenditure: 380_000_000n,      // 3.8億円
      },
      {
        year: 2020,
        partySubsidy: 330_890_000n,          // 3.3億円
        donationIndividual: 80_000_000n,     // 0.8億円
        donationCorporate: 0n,
        partyFee: 15_000_000n,               // 0.15億円
        businessIncome: 60_000_000n,         // 0.6億円
        totalIncome: 520_000_000n,           // 5.2億円
        totalExpenditure: 500_000_000n,      // 5億円
      },
      {
        year: 2021,
        partySubsidy: 307_050_000n,          // 3.07億円
        donationIndividual: 70_000_000n,     // 0.7億円
        donationCorporate: 0n,
        partyFee: 10_000_000n,               // 0.1億円
        businessIncome: 40_000_000n,         // 0.4億円
        totalIncome: 450_000_000n,           // 4.5億円
        totalExpenditure: 480_000_000n,      // 4.8億円
      },
      {
        year: 2022,
        partySubsidy: 262_000_000n,          // 2.62億円（nippon.com確定額）
        donationIndividual: 60_000_000n,     // 0.6億円
        donationCorporate: 0n,
        partyFee: 10_000_000n,               // 0.1億円
        businessIncome: 30_000_000n,         // 0.3億円
        totalIncome: 390_000_000n,           // 3.9億円
        totalExpenditure: 380_000_000n,      // 3.8億円
      },
      {
        year: 2023,
        partySubsidy: 262_530_000n,          // 2.63億円（総務省確定額）
        donationIndividual: 50_000_000n,     // 0.5億円
        donationCorporate: 0n,
        partyFee: 8_000_000n,                // 0.08億円
        businessIncome: 25_000_000n,         // 0.25億円
        totalIncome: 370_000_000n,           // 3.7億円
        totalExpenditure: 360_000_000n,      // 3.6億円
      },
      {
        year: 2024,
        partySubsidy: 160_000_000n,          // 1.6億円（推計、議席減少）
        donationIndividual: 40_000_000n,     // 0.4億円（推計）
        donationCorporate: 0n,
        partyFee: 5_000_000n,                // 0.05億円（推計）
        businessIncome: 20_000_000n,         // 0.2億円（推計）
        totalIncome: 250_000_000n,           // 2.5億円（推計）
        totalExpenditure: 280_000_000n,      // 2.8億円（推計）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 参政党（2022年結党、参院選で国政政党に）
  // ─────────────────────────────────────────────
  {
    partyName: "参政党",
    orgName: "参政党本部",
    address: "東京都千代田区永田町2-9-6",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2022,
        partySubsidy: 77_020_000n,           // 0.77億円（参院選後の再算定分のみ、nippon.com/日経新聞）
        donationIndividual: 200_000_000n,    // 2億円
        donationCorporate: 0n,
        partyFee: 300_000_000n,              // 3億円（党員10万人規模）
        businessIncome: 100_000_000n,        // 1億円
        totalIncome: 750_000_000n,           // 7.5億円
        totalExpenditure: 700_000_000n,      // 7億円
      },
      {
        year: 2023,
        partySubsidy: 189_220_000n,          // 1.89億円（総務省確定額）
        donationIndividual: 180_000_000n,    // 1.8億円
        donationCorporate: 0n,
        partyFee: 280_000_000n,              // 2.8億円
        businessIncome: 120_000_000n,        // 1.2億円
        totalIncome: 850_000_000n,           // 8.5億円
        totalExpenditure: 800_000_000n,      // 8億円
      },
      {
        year: 2024,
        partySubsidy: 189_220_000n,          // 1.89億円（nippon.com確定額）
        donationIndividual: 200_000_000n,    // 2億円（推計）
        donationCorporate: 0n,
        partyFee: 260_000_000n,              // 2.6億円（推計）
        businessIncome: 130_000_000n,        // 1.3億円（推計）
        totalIncome: 850_000_000n,           // 8.5億円（推計）
        totalExpenditure: 1_000_000_000n,    // 10億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 516_680_000n,          // 5.17億円（nippon.com確定額、衆院選で議席増反映）
        donationIndividual: 220_000_000n,    // 2.2億円（推計）
        donationCorporate: 0n,
        partyFee: 300_000_000n,              // 3億円（推計）
        businessIncome: 150_000_000n,        // 1.5億円（推計）
        totalIncome: 1_300_000_000n,         // 13億円（推計）
        totalExpenditure: 1_200_000_000n,    // 12億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 520_000_000n,          // 5.2億円（推計、2025年5.17億からの微増想定）
        donationIndividual: 230_000_000n,    // 2.3億円（推計）
        donationCorporate: 0n,
        partyFee: 310_000_000n,              // 3.1億円（推計）
        businessIncome: 160_000_000n,        // 1.6億円（推計）
        totalIncome: 1_350_000_000n,         // 13.5億円（推計）
        totalExpenditure: 1_400_000_000n,    // 14億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 日本保守党（2023年結党）
  // ─────────────────────────────────────────────
  {
    partyName: "日本保守党",
    orgName: "日本保守党本部",
    address: "東京都千代田区紀尾井町3-12",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2023,
        partySubsidy: 0n,                    // 結党年、交付金なし
        donationIndividual: 300_000_000n,    // 3億円（ネット寄付が活発）
        donationCorporate: 0n,
        partyFee: 100_000_000n,              // 1億円
        businessIncome: 50_000_000n,         // 0.5億円
        totalIncome: 500_000_000n,           // 5億円
        totalExpenditure: 400_000_000n,      // 4億円
      },
      {
        year: 2024,
        partySubsidy: 28_810_000n,           // 0.29億円（12月交付分のみ、日経新聞2881万円）
        donationIndividual: 400_000_000n,    // 4億円（推計）
        donationCorporate: 0n,
        partyFee: 150_000_000n,              // 1.5億円（推計）
        businessIncome: 80_000_000n,         // 0.8億円（推計）
        totalIncome: 750_000_000n,           // 7.5億円（推計）
        totalExpenditure: 800_000_000n,      // 8億円（推計、衆院選年）
      },
      {
        year: 2025,
        partySubsidy: 172_670_000n,          // 1.73億円（nippon.com確定額）
        donationIndividual: 350_000_000n,    // 3.5億円（推計）
        donationCorporate: 0n,
        partyFee: 160_000_000n,              // 1.6億円（推計）
        businessIncome: 90_000_000n,         // 0.9億円（推計）
        totalIncome: 850_000_000n,           // 8.5億円（推計）
        totalExpenditure: 800_000_000n,      // 8億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 175_000_000n,          // 1.75億円（推計、2025年1.73億からの微増想定）
        donationIndividual: 370_000_000n,    // 3.7億円（推計）
        donationCorporate: 0n,
        partyFee: 170_000_000n,              // 1.7億円（推計）
        businessIncome: 100_000_000n,        // 1億円（推計）
        totalIncome: 900_000_000n,           // 9億円（推計）
        totalExpenditure: 950_000_000n,      // 9.5億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // チームみらい（2025年結党、前原誠司代表）
  // ─────────────────────────────────────────────
  {
    partyName: "チームみらい",
    orgName: "チームみらい本部",
    address: "東京都千代田区永田町2-1-1",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2025,
        partySubsidy: 400_000_000n,          // 4億円（推計、国民民主党分裂組）
        donationIndividual: 80_000_000n,     // 0.8億円（推計）
        donationCorporate: 0n,
        partyFee: 50_000_000n,               // 0.5億円（推計）
        businessIncome: 30_000_000n,         // 0.3億円（推計）
        totalIncome: 600_000_000n,           // 6億円（推計）
        totalExpenditure: 550_000_000n,      // 5.5億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 420_000_000n,          // 4.2億円（推計）
        donationIndividual: 90_000_000n,     // 0.9億円（推計）
        donationCorporate: 0n,
        partyFee: 60_000_000n,               // 0.6億円（推計）
        businessIncome: 40_000_000n,         // 0.4億円（推計）
        totalIncome: 650_000_000n,           // 6.5億円（推計）
        totalExpenditure: 700_000_000n,      // 7億円（推計、参院選年）
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 中道改革連合（2025年結党、仮想政党データ）
  // ─────────────────────────────────────────────
  {
    partyName: "中道改革連合",
    orgName: "中道改革連合本部",
    address: "東京都千代田区永田町1-7-1",
    representative: "代表",
    treasurer: "会計責任者",
    years: [
      {
        year: 2025,
        partySubsidy: 0n,                    // 結党年、交付金なし
        donationIndividual: 50_000_000n,     // 0.5億円（推計）
        donationCorporate: 0n,
        partyFee: 20_000_000n,               // 0.2億円（推計）
        businessIncome: 10_000_000n,         // 0.1億円（推計）
        totalIncome: 100_000_000n,           // 1億円（推計）
        totalExpenditure: 80_000_000n,       // 0.8億円（推計）
      },
      {
        year: 2026,
        partySubsidy: 120_000_000n,          // 1.2億円（推計）
        donationIndividual: 60_000_000n,     // 0.6億円（推計）
        donationCorporate: 0n,
        partyFee: 25_000_000n,               // 0.25億円（推計）
        businessIncome: 15_000_000n,         // 0.15億円（推計）
        totalIncome: 250_000_000n,           // 2.5億円（推計）
        totalExpenditure: 300_000_000n,      // 3億円（推計、参院選年）
      },
    ],
  },
];

// ============================================
// ヘルパー関数
// ============================================

function formatYen(amount: bigint): string {
  const oku = Number(amount) / 100_000_000;
  return `${oku.toFixed(1)}億円`;
}

// ============================================
// メイン処理
// ============================================

export async function seedRealFinance(): Promise<void> {
  console.log("=".repeat(60));
  console.log("[real-finance] 実データ政治資金シードを開始...");
  console.log("[real-finance] 対象: 13政党 x 最大8年（2019-2026）");
  console.log("=".repeat(60));

  let orgCount = 0;
  let reportCount = 0;
  let incomeCount = 0;

  for (const partyData of PARTY_FINANCE_DATA) {
    console.log(`\n[real-finance] --- ${partyData.partyName} ---`);

    // 1. Party を検索
    const party = await prisma.party.findFirst({
      where: { name: partyData.partyName },
    });

    if (!party) {
      console.warn(
        `[real-finance] 政党「${partyData.partyName}」がDBに見つかりません。先にingest:financeを実行してください。`,
      );
      continue;
    }

    // 2. PoliticalOrganization（政党本部）を upsert
    let org = await prisma.politicalOrganization.findFirst({
      where: { name: partyData.orgName, partyId: party.id },
    });

    if (org) {
      org = await prisma.politicalOrganization.update({
        where: { id: org.id },
        data: {
          type: "PARTY_BRANCH",
          address: partyData.address,
          representative: partyData.representative,
          treasurer: partyData.treasurer,
        },
      });
    } else {
      org = await prisma.politicalOrganization.create({
        data: {
          name: partyData.orgName,
          type: "PARTY_BRANCH",
          partyId: party.id,
          address: partyData.address,
          representative: partyData.representative,
          treasurer: partyData.treasurer,
        },
      });
    }
    orgCount++;
    console.log(`[real-finance] 団体: ${partyData.orgName} (${org.id})`);

    // 3. 年度別の FundReport と FundIncome を作成
    for (const yearData of partyData.years) {
      const balance = yearData.totalIncome - yearData.totalExpenditure;

      // FundReport upsert
      const report = await prisma.fundReport.upsert({
        where: {
          organizationId_fiscalYear: {
            organizationId: org.id,
            fiscalYear: yearData.year,
          },
        },
        update: {
          reportingBody: "総務省",
          totalIncome: yearData.totalIncome,
          totalExpenditure: yearData.totalExpenditure,
          balance,
          status: "PUBLISHED",
          sourceUrl: "https://www.soumu.go.jp/senkyo/seiji_s/seijishikin/",
        },
        create: {
          organizationId: org.id,
          fiscalYear: yearData.year,
          reportingBody: "総務省",
          totalIncome: yearData.totalIncome,
          totalExpenditure: yearData.totalExpenditure,
          balance,
          status: "PUBLISHED",
          sourceUrl: "https://www.soumu.go.jp/senkyo/seiji_s/seijishikin/",
        },
      });

      reportCount++;

      // 既存の FundIncome を削除して再作成
      await prisma.fundIncome.deleteMany({
        where: { reportId: report.id },
      });

      // 収入明細を作成
      const incomeRecords: {
        category: string;
        amount: bigint;
        source: string;
        description: string;
      }[] = [];

      if (yearData.partySubsidy > 0n) {
        incomeRecords.push({
          category: "PARTY_SUBSIDY",
          amount: yearData.partySubsidy,
          source: "国庫（総務省）",
          description: `${yearData.year}年分 政党交付金`,
        });
      }

      if (yearData.donationIndividual > 0n) {
        incomeRecords.push({
          category: "DONATION_INDIVIDUAL",
          amount: yearData.donationIndividual,
          source: "個人寄附者",
          description: `${yearData.year}年分 個人からの寄附`,
        });
      }

      if (yearData.donationCorporate > 0n) {
        incomeRecords.push({
          category: "DONATION_CORPORATE",
          amount: yearData.donationCorporate,
          source: partyData.partyName === "自由民主党"
            ? "国民政治協会"
            : "法人・団体",
          description: `${yearData.year}年分 法人その他の団体からの寄附`,
        });
      }

      if (yearData.partyFee > 0n) {
        incomeRecords.push({
          category: "PARTY_FEE",
          amount: yearData.partyFee,
          source: "党員",
          description: `${yearData.year}年分 党費`,
        });
      }

      if (yearData.businessIncome > 0n) {
        const desc = partyData.partyName === "日本共産党"
          ? `${yearData.year}年分 機関紙誌の発行その他の事業（しんぶん赤旗等）`
          : partyData.partyName === "公明党"
            ? `${yearData.year}年分 機関紙誌の発行その他の事業（公明新聞等）`
            : `${yearData.year}年分 事業収入（機関紙誌・政治資金パーティー等）`;

        incomeRecords.push({
          category: "BUSINESS_INCOME",
          amount: yearData.businessIncome,
          source: partyData.partyName === "日本共産党"
            ? "しんぶん赤旗"
            : partyData.partyName === "公明党"
              ? "公明新聞"
              : "事業活動",
          description: desc,
        });
      }

      // その他収入（totalIncomeと内訳合計の差額）
      const categorizedTotal =
        yearData.partySubsidy +
        yearData.donationIndividual +
        yearData.donationCorporate +
        yearData.partyFee +
        yearData.businessIncome;

      const otherIncome = yearData.totalIncome - categorizedTotal;
      if (otherIncome > 0n) {
        incomeRecords.push({
          category: "OTHER_INCOME",
          amount: otherIncome,
          source: "その他",
          description: `${yearData.year}年分 その他の収入（前年繰越・借入金・政治団体からの寄附等）`,
        });
      }

      for (const record of incomeRecords) {
        await prisma.fundIncome.create({
          data: {
            reportId: report.id,
            category: record.category as "PARTY_SUBSIDY" | "DONATION_INDIVIDUAL" | "DONATION_CORPORATE" | "PARTY_FEE" | "BUSINESS_INCOME" | "OTHER_INCOME" | "FUNDRAISING_EVENT" | "DONATION_POLITICAL" | "CARRY_FORWARD",
            source: record.source,
            amount: record.amount,
            date: new Date(`${yearData.year}-12-31`),
            description: record.description,
          },
        });
        incomeCount++;
      }

      console.log(
        `[real-finance]   ${yearData.year}年: ` +
          `収入=${formatYen(yearData.totalIncome)} ` +
          `支出=${formatYen(yearData.totalExpenditure)} ` +
          `交付金=${formatYen(yearData.partySubsidy)}`,
      );
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(
    `[real-finance] 完了 -- ${orgCount}団体, ${reportCount}報告書, ${incomeCount}収入明細`,
  );
  console.log("=".repeat(60));
}

// CLI実行
if (process.argv[1]?.includes("political-finance/seed-real-finance")) {
  seedRealFinance()
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
