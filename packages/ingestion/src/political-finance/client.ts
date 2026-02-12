/**
 * political-finance-database.com クライアント（モックデータ版）
 *
 * 実際のAPIが利用可能になるまで、日本の政治資金の実態に近いサンプルデータを返す。
 */

export interface RawOrganization {
  name: string;
  type: "PARTY_BRANCH" | "FUND_MANAGEMENT";
  partyName: string;
  address: string;
  representative: string;
  treasurer: string;
}

export interface RawFundReport {
  organizationName: string;
  fiscalYear: number;
  reportingBody: string;
  totalIncome: bigint;
  totalExpenditure: bigint;
  balance: bigint;
}

export interface RawIncome {
  organizationName: string;
  fiscalYear: number;
  category: string;
  subcategory?: string;
  source?: string;
  amount: bigint;
  date?: string;
  description?: string;
}

export interface RawExpenditure {
  organizationName: string;
  fiscalYear: number;
  category: string;
  subcategory?: string;
  recipient?: string;
  amount: bigint;
  date?: string;
  description?: string;
}

interface PartyData {
  name: string;
  shortName: string;
  color: string;
  website: string;
  founded: string;
  isActive: boolean;
}

const PARTIES: PartyData[] = [
  { name: "自由民主党", shortName: "自民", color: "#E8383D", website: "https://www.jimin.jp", founded: "1955-11-15", isActive: true },
  { name: "立憲民主党", shortName: "立憲", color: "#1B5DA6", website: "https://cdp-japan.jp", founded: "2020-09-15", isActive: true },
  { name: "日本維新の会", shortName: "維新", color: "#00A651", website: "https://o-ishin.jp", founded: "2015-11-02", isActive: true },
  { name: "公明党", shortName: "公明", color: "#F39800", website: "https://www.komei.or.jp", founded: "1964-11-17", isActive: true },
  { name: "日本共産党", shortName: "共産", color: "#DB001C", website: "https://www.jcp.or.jp", founded: "1922-07-15", isActive: true },
  { name: "国民民主党", shortName: "国民", color: "#FF6B00", website: "https://new-kokumin.jp", founded: "2020-09-11", isActive: true },
  { name: "れいわ新選組", shortName: "れいわ", color: "#ED6EA0", website: "https://reiwa-shinsengumi.com", founded: "2019-04-01", isActive: true },
  { name: "社会民主党", shortName: "社民", color: "#4AA657", website: "https://sdp.or.jp", founded: "1996-01-19", isActive: true },
  { name: "参政党", shortName: "参政", color: "#F5A623", website: "https://www.sanseito.jp", founded: "2020-04-11", isActive: true },
  { name: "NHK党", shortName: "NHK", color: "#00BFFF", website: "https://www.nhk-party.jp", founded: "2013-06-17", isActive: true },
  { name: "政治家女子48党", shortName: "女子48", color: "#FF69B4", website: "", founded: "2023-03-01", isActive: false },
];

export function getParties(): PartyData[] {
  return PARTIES;
}

function generateBranchName(party: PartyData): string {
  return `${party.name}本部`;
}

function generateFundManagementName(party: PartyData): string {
  return `${party.shortName}政策研究会`;
}

export function getOrganizations(): RawOrganization[] {
  const orgs: RawOrganization[] = [];
  for (const party of PARTIES) {
    orgs.push({
      name: generateBranchName(party),
      type: "PARTY_BRANCH",
      partyName: party.name,
      address: "東京都千代田区永田町",
      representative: `${party.shortName}代表`,
      treasurer: `${party.shortName}会計`,
    });
    orgs.push({
      name: generateFundManagementName(party),
      type: "FUND_MANAGEMENT",
      partyName: party.name,
      address: "東京都千代田区永田町",
      representative: `${party.shortName}代表`,
      treasurer: `${party.shortName}会計`,
    });
  }
  return orgs;
}

/**
 * 各政党の年間収支規模（概算・億円単位）を元にデータを生成。
 * 自民党が最大（200〜250億）、小規模政党は数千万〜数億。
 */
const PARTY_INCOME_SCALE: Record<string, number> = {
  "自由民主党": 23_000_000_000,
  "立憲民主党": 7_500_000_000,
  "日本維新の会": 4_500_000_000,
  "公明党": 14_000_000_000,
  "日本共産党": 20_000_000_000,
  "国民民主党": 3_500_000_000,
  "れいわ新選組": 800_000_000,
  "社会民主党": 400_000_000,
  "参政党": 600_000_000,
  "NHK党": 300_000_000,
  "政治家女子48党": 150_000_000,
};

const INCOME_CATEGORIES = [
  "PARTY_FEE",
  "DONATION_INDIVIDUAL",
  "DONATION_CORPORATE",
  "DONATION_POLITICAL",
  "PARTY_SUBSIDY",
  "FUNDRAISING_EVENT",
  "BUSINESS_INCOME",
  "OTHER_INCOME",
] as const;

const EXPENDITURE_CATEGORIES = [
  "PERSONNEL",
  "OFFICE",
  "EQUIPMENT",
  "PRINTING",
  "PUBLICITY",
  "POLITICAL_ACTIVITY",
  "DONATION_OUT",
  "OTHER_EXPENSE",
] as const;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateIncomeBreakdown(
  totalIncome: bigint,
  partyName: string,
  random: () => number,
): { category: string; ratio: number }[] {
  const isCommunist = partyName === "日本共産党";
  const isSmall = Number(totalIncome) < 1_000_000_000;

  const base = isCommunist
    ? [0.15, 0.05, 0.0, 0.02, 0.0, 0.01, 0.50, 0.27]
    : isSmall
      ? [0.10, 0.15, 0.05, 0.05, 0.30, 0.10, 0.15, 0.10]
      : [0.08, 0.10, 0.15, 0.10, 0.25, 0.12, 0.10, 0.10];

  const jittered = base.map((v) => Math.max(0.01, v + (random() - 0.5) * 0.05));
  const sum = jittered.reduce((a, b) => a + b, 0);
  return INCOME_CATEGORIES.map((cat, i) => ({ category: cat, ratio: jittered[i] / sum }));
}

function generateExpenditureBreakdown(
  random: () => number,
): { category: string; ratio: number }[] {
  const base = [0.20, 0.10, 0.05, 0.08, 0.15, 0.25, 0.10, 0.07];
  const jittered = base.map((v) => Math.max(0.01, v + (random() - 0.5) * 0.04));
  const sum = jittered.reduce((a, b) => a + b, 0);
  return EXPENDITURE_CATEGORIES.map((cat, i) => ({ category: cat, ratio: jittered[i] / sum }));
}

const FISCAL_YEARS = [2021, 2022, 2023];

export function getReportsWithDetails(): {
  reports: RawFundReport[];
  incomes: RawIncome[];
  expenditures: RawExpenditure[];
} {
  const reports: RawFundReport[] = [];
  const incomes: RawIncome[] = [];
  const expenditures: RawExpenditure[] = [];
  const orgs = getOrganizations();

  let seedCounter = 42;

  for (const org of orgs) {
    const baseScale = PARTY_INCOME_SCALE[org.partyName] ?? 500_000_000;
    const orgScale = org.type === "PARTY_BRANCH" ? baseScale * 0.7 : baseScale * 0.3;

    for (const year of FISCAL_YEARS) {
      const random = seededRandom(seedCounter++);
      const yearVariation = 0.85 + random() * 0.3;
      const totalIncome = BigInt(Math.round(orgScale * yearVariation));
      const expenditureRatio = 0.80 + random() * 0.15;
      const totalExpenditure = BigInt(Math.round(Number(totalIncome) * expenditureRatio));
      const balance = totalIncome - totalExpenditure;

      reports.push({
        organizationName: org.name,
        fiscalYear: year,
        reportingBody: "総務省",
        totalIncome,
        totalExpenditure,
        balance,
      });

      const incomeBreakdown = generateIncomeBreakdown(totalIncome, org.partyName, random);
      for (const { category, ratio } of incomeBreakdown) {
        const amount = BigInt(Math.round(Number(totalIncome) * ratio));
        if (amount > 0n) {
          incomes.push({
            organizationName: org.name,
            fiscalYear: year,
            category,
            source: category === "PARTY_SUBSIDY" ? "国庫" : undefined,
            amount,
            date: `${year}-03-31`,
            description: `${year}年度 ${category}`,
          });
        }
      }

      const expBreakdown = generateExpenditureBreakdown(random);
      for (const { category, ratio } of expBreakdown) {
        const amount = BigInt(Math.round(Number(totalExpenditure) * ratio));
        if (amount > 0n) {
          expenditures.push({
            organizationName: org.name,
            fiscalYear: year,
            category,
            amount,
            date: `${year}-12-31`,
            description: `${year}年度 ${category}`,
          });
        }
      }
    }
  }

  return { reports, incomes, expenditures };
}
