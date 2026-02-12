import { prisma } from "@ojpp/db";
import type { BillStatus, Chamber } from "@ojpp/db";

interface SampleBill {
  sessionNumber: number;
  number: string;
  title: string;
  summary: string;
  proposer: string;
  category: string;
  status: BillStatus;
  submittedAt: string;
  passedAt?: string;
}

const SAMPLE_BILLS: SampleBill[] = [
  // 第213回（2024通常国会）
  {
    sessionNumber: 213,
    number: "213-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary: "定額減税の実施、扶養控除の見直し等を含む税制改正法案。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-02",
    passedAt: "2024-03-28",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-2",
    title: "地方税法等の一部を改正する法律案",
    summary: "個人住民税の定額減税、固定資産税の負担調整措置等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-02",
    passedAt: "2024-03-28",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-5",
    title: "子ども・子育て支援法等の一部を改正する法律案",
    summary: "児童手当の拡充、こども誰でも通園制度の創設等。少子化対策の加速プラン。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-02-16",
    passedAt: "2024-06-05",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-8",
    title: "重要経済安保情報の保護及び活用に関する法律案",
    summary: "セキュリティ・クリアランス制度を創設し、経済安全保障上重要な情報を保護。",
    proposer: "内閣",
    category: "外交",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-10",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-10",
    title: "食料・農業・農村基本法の一部を改正する法律案",
    summary: "食料安全保障の強化、環境と調和のとれた食料システムの確立。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-29",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-15",
    title: "地方自治法の一部を改正する法律案",
    summary: "国の補充的指示権の創設。大規模災害や感染症危機時の対応強化。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-03-01",
    passedAt: "2024-06-19",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-20",
    title: "入管法及び入管特例法の一部を改正する法律案",
    summary: "育成就労制度の創設による外国人材の受入れ・育成。技能実習制度の発展的解消。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-15",
    passedAt: "2024-06-14",
  },
  {
    sessionNumber: 213,
    number: "213-衆法-3",
    title: "政治資金規正法の一部を改正する法律案",
    summary: "政治資金パーティー収入の透明化、政策活動費の公開等。",
    proposer: "自由民主党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-05-17",
    passedAt: "2024-06-19",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-25",
    title: "学校教育法の一部を改正する法律案",
    summary: "教員の働き方改革、部活動の地域移行推進等。",
    proposer: "内閣",
    category: "教育",
    status: "COMMITTEE",
    submittedAt: "2024-03-22",
  },
  {
    sessionNumber: 213,
    number: "213-参法-5",
    title: "選択的夫婦別姓制度導入に関する法律案",
    summary: "婚姻時に夫婦が各自の氏を称することを選択できる制度の導入。",
    proposer: "立憲民主党",
    category: "社会保障",
    status: "COMMITTEE",
    submittedAt: "2024-02-14",
  },
  // 第212回（2023臨時国会）
  {
    sessionNumber: 212,
    number: "212-閣法-1",
    title: "補正予算（令和5年度）",
    summary: "物価高対策、賃上げ支援、国民の安全安心確保のための総合経済対策。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-11-02",
    passedAt: "2023-11-29",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-3",
    title: "防衛省設置法等の一部を改正する法律案",
    summary: "統合作戦司令部の設置等、防衛体制の抜本的強化。",
    proposer: "内閣",
    category: "外交",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-12-08",
  },
  // 第211回（2023通常国会）
  {
    sessionNumber: 211,
    number: "211-閣法-1",
    title: "令和5年度予算",
    summary: "防衛力の抜本的強化、子ども・子育て政策の充実を含む予算。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-01-23",
    passedAt: "2023-03-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-5",
    title: "GX推進法案",
    summary: "グリーントランスフォーメーション推進のための脱炭素成長型経済構造への移行。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2023-02-10",
    passedAt: "2023-05-12",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-8",
    title: "マイナンバー法等の一部を改正する法律案",
    summary: "マイナンバーカードと健康保険証の一体化等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-07",
    passedAt: "2023-06-02",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-12",
    title: "入管法改正案（送還忌避問題）",
    summary: "難民認定申請中の送還停止効の例外規定等。入管収容の見直し。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-03-07",
    passedAt: "2023-06-09",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-15",
    title: "LGBT理解増進法案",
    summary: "性的指向及びジェンダーアイデンティティの多様性に関する国民の理解の増進。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-05-18",
    passedAt: "2023-06-16",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-20",
    title: "防衛財源確保法案",
    summary: "防衛力強化のための財源確保。決算剰余金の活用等。",
    proposer: "内閣",
    category: "外交",
    status: "ENACTED",
    submittedAt: "2023-02-03",
    passedAt: "2023-06-16",
  },
  // 第210回（2022臨時国会）
  {
    sessionNumber: 210,
    number: "210-閣法-1",
    title: "補正予算（令和4年度第2次）",
    summary: "電気・ガス価格激変緩和対策等の物価高騰対策。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-10-28",
    passedAt: "2022-12-02",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-5",
    title: "感染症法等の一部を改正する法律案",
    summary: "次の感染症危機に備えた医療提供体制の強化。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-12-02",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-8",
    title: "旧統一教会被害者救済法案",
    summary: "法人等による寄附の不当な勧誘の防止に関する法律案。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-11-08",
    passedAt: "2022-12-10",
  },
  // 第208回（2022通常国会）
  {
    sessionNumber: 208,
    number: "208-閣法-1",
    title: "令和4年度予算",
    summary: "新型コロナ対策予備費5兆円、防衛費増額等を含む予算。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-01-17",
    passedAt: "2022-03-22",
  },
  {
    sessionNumber: 208,
    number: "208-閣法-10",
    title: "経済安全保障推進法案",
    summary: "サプライチェーン強靭化、基幹インフラの安全性確保、先端技術開発等。",
    proposer: "内閣",
    category: "外交",
    status: "ENACTED",
    submittedAt: "2022-02-25",
    passedAt: "2022-05-11",
  },
  {
    sessionNumber: 208,
    number: "208-閣法-15",
    title: "こども家庭庁設置法案",
    summary: "子ども政策の司令塔としてのこども家庭庁の設置。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-02-25",
    passedAt: "2022-06-15",
  },
  {
    sessionNumber: 208,
    number: "208-衆法-5",
    title: "AV出演被害防止・救済法案",
    summary: "アダルトビデオ出演被害の防止及び被害者の救済。",
    proposer: "自由民主党",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-05-19",
    passedAt: "2022-06-15",
  },
  // 第204回（2021通常国会）
  {
    sessionNumber: 204,
    number: "204-閣法-1",
    title: "令和3年度予算",
    summary: "新型コロナ対策の継続、デジタル社会の実現等を含む予算。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2021-01-18",
    passedAt: "2021-03-26",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-5",
    title: "デジタル社会形成基本法案",
    summary: "デジタル社会の形成に関する基本理念、施策の策定に係る基本方針等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2021-02-09",
    passedAt: "2021-05-12",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-6",
    title: "デジタル庁設置法案",
    summary: "デジタル社会の形成に関する司令塔としてのデジタル庁の設置。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2021-02-09",
    passedAt: "2021-05-12",
  },
  {
    sessionNumber: 204,
    number: "204-衆法-10",
    title: "国民投票法改正案",
    summary: "憲法改正国民投票の投票環境の整備。投票所の設置基準緩和等。",
    proposer: "自由民主党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2021-04-27",
    passedAt: "2021-06-11",
  },
  // いくつか否決・撤回のステータス
  {
    sessionNumber: 211,
    number: "211-衆法-20",
    title: "原発ゼロ基本法案",
    summary: "全ての原子力発電所の廃炉と再生可能エネルギーへの転換。",
    proposer: "立憲民主党",
    category: "環境",
    status: "REJECTED",
    submittedAt: "2023-02-17",
  },
  {
    sessionNumber: 213,
    number: "213-衆法-15",
    title: "消費税減税法案",
    summary: "消費税率の時限的な5%への引き下げ。",
    proposer: "日本維新の会",
    category: "経済",
    status: "REJECTED",
    submittedAt: "2024-03-01",
  },
];

interface SamplePolitician {
  name: string;
  nameKana: string;
  partyName: string;
  chamber: Chamber;
  district: string;
  prefectureCode: string;
}

const SAMPLE_POLITICIANS: SamplePolitician[] = [
  { name: "岸田文雄", nameKana: "キシダ フミオ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "広島1区", prefectureCode: "34" },
  { name: "石破茂", nameKana: "イシバ シゲル", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "鳥取1区", prefectureCode: "31" },
  { name: "河野太郎", nameKana: "コウノ タロウ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "神奈川15区", prefectureCode: "14" },
  { name: "高市早苗", nameKana: "タカイチ サナエ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "奈良2区", prefectureCode: "29" },
  { name: "茂木敏充", nameKana: "モテギ トシミツ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "栃木5区", prefectureCode: "09" },
  { name: "萩生田光一", nameKana: "ハギウダ コウイチ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "東京24区", prefectureCode: "13" },
  { name: "西村康稔", nameKana: "ニシムラ ヤストシ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "兵庫9区", prefectureCode: "28" },
  { name: "林芳正", nameKana: "ハヤシ ヨシマサ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "山口3区", prefectureCode: "35" },
  { name: "加藤勝信", nameKana: "カトウ カツノブ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "岡山5区", prefectureCode: "33" },
  { name: "松野博一", nameKana: "マツノ ヒロカズ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "千葉3区", prefectureCode: "12" },
  { name: "泉健太", nameKana: "イズミ ケンタ", partyName: "立憲民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "京都3区", prefectureCode: "26" },
  { name: "野田佳彦", nameKana: "ノダ ヨシヒコ", partyName: "立憲民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "千葉4区", prefectureCode: "12" },
  { name: "枝野幸男", nameKana: "エダノ ユキオ", partyName: "立憲民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "埼玉5区", prefectureCode: "11" },
  { name: "蓮舫", nameKana: "レンホウ", partyName: "立憲民主党", chamber: "HOUSE_OF_COUNCILLORS", district: "東京都", prefectureCode: "13" },
  { name: "辻元清美", nameKana: "ツジモト キヨミ", partyName: "立憲民主党", chamber: "HOUSE_OF_COUNCILLORS", district: "大阪府", prefectureCode: "27" },
  { name: "馬場伸幸", nameKana: "ババ ノブユキ", partyName: "日本維新の会", chamber: "HOUSE_OF_REPRESENTATIVES", district: "大阪17区", prefectureCode: "27" },
  { name: "藤田文武", nameKana: "フジタ フミタケ", partyName: "日本維新の会", chamber: "HOUSE_OF_REPRESENTATIVES", district: "大阪12区", prefectureCode: "27" },
  { name: "音喜多駿", nameKana: "オトキタ シュン", partyName: "日本維新の会", chamber: "HOUSE_OF_COUNCILLORS", district: "東京都", prefectureCode: "13" },
  { name: "吉村洋文", nameKana: "ヨシムラ ヒロフミ", partyName: "日本維新の会", chamber: "HOUSE_OF_REPRESENTATIVES", district: "大阪府", prefectureCode: "27" },
  { name: "山口那津男", nameKana: "ヤマグチ ナツオ", partyName: "公明党", chamber: "HOUSE_OF_COUNCILLORS", district: "東京都", prefectureCode: "13" },
  { name: "石井啓一", nameKana: "イシイ ケイイチ", partyName: "公明党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "比例北関東", prefectureCode: "11" },
  { name: "志位和夫", nameKana: "シイ カズオ", partyName: "日本共産党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "比例南関東", prefectureCode: "12" },
  { name: "田村智子", nameKana: "タムラ トモコ", partyName: "日本共産党", chamber: "HOUSE_OF_COUNCILLORS", district: "比例", prefectureCode: "13" },
  { name: "玉木雄一郎", nameKana: "タマキ ユウイチロウ", partyName: "国民民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "香川2区", prefectureCode: "37" },
  { name: "前原誠司", nameKana: "マエハラ セイジ", partyName: "国民民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "京都2区", prefectureCode: "26" },
  { name: "福島瑞穂", nameKana: "フクシマ ミズホ", partyName: "社会民主党", chamber: "HOUSE_OF_COUNCILLORS", district: "比例", prefectureCode: "13" },
  { name: "山本太郎", nameKana: "ヤマモト タロウ", partyName: "れいわ新選組", chamber: "HOUSE_OF_COUNCILLORS", district: "東京都", prefectureCode: "13" },
  { name: "大石あきこ", nameKana: "オオイシ アキコ", partyName: "れいわ新選組", chamber: "HOUSE_OF_REPRESENTATIVES", district: "大阪5区", prefectureCode: "27" },
  { name: "鈴木宗男", nameKana: "スズキ ムネオ", partyName: "日本維新の会", chamber: "HOUSE_OF_COUNCILLORS", district: "比例", prefectureCode: "01" },
  { name: "世耕弘成", nameKana: "セコウ ヒロシゲ", partyName: "自由民主党", chamber: "HOUSE_OF_COUNCILLORS", district: "和歌山県", prefectureCode: "30" },
  { name: "小池晃", nameKana: "コイケ アキラ", partyName: "日本共産党", chamber: "HOUSE_OF_COUNCILLORS", district: "比例", prefectureCode: "13" },
  { name: "片山さつき", nameKana: "カタヤマ サツキ", partyName: "自由民主党", chamber: "HOUSE_OF_COUNCILLORS", district: "比例", prefectureCode: "13" },
  { name: "小泉進次郎", nameKana: "コイズミ シンジロウ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "神奈川11区", prefectureCode: "14" },
  { name: "上川陽子", nameKana: "カミカワ ヨウコ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "静岡1区", prefectureCode: "22" },
  { name: "鈴木俊一", nameKana: "スズキ シュンイチ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "岩手2区", prefectureCode: "03" },
  { name: "浜田靖一", nameKana: "ハマダ ヤスカズ", partyName: "自由民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "千葉12区", prefectureCode: "12" },
  { name: "長妻昭", nameKana: "ナガツマ アキラ", partyName: "立憲民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "東京7区", prefectureCode: "13" },
  { name: "安住淳", nameKana: "アズミ ジュン", partyName: "立憲民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "宮城5区", prefectureCode: "04" },
  { name: "大串博志", nameKana: "オオグシ ヒロシ", partyName: "立憲民主党", chamber: "HOUSE_OF_REPRESENTATIVES", district: "佐賀2区", prefectureCode: "41" },
  { name: "松井一郎", nameKana: "マツイ イチロウ", partyName: "日本維新の会", chamber: "HOUSE_OF_REPRESENTATIVES", district: "大阪府", prefectureCode: "27" },
];

export async function ingestBills() {
  console.log("Ingesting bills and politicians...");

  // Upsert politicians
  for (const pol of SAMPLE_POLITICIANS) {
    const party = await prisma.party.findFirst({
      where: { name: pol.partyName },
    });

    const prefecture = await prisma.prefecture.findFirst({
      where: { code: pol.prefectureCode },
    });

    const existing = await prisma.politician.findFirst({
      where: { name: pol.name },
    });

    if (existing) {
      await prisma.politician.update({
        where: { id: existing.id },
        data: {
          nameKana: pol.nameKana,
          partyId: party?.id ?? null,
          chamber: pol.chamber,
          district: pol.district,
          prefectureId: prefecture?.id ?? null,
        },
      });
    } else {
      await prisma.politician.create({
        data: {
          name: pol.name,
          nameKana: pol.nameKana,
          partyId: party?.id ?? null,
          chamber: pol.chamber,
          district: pol.district,
          prefectureId: prefecture?.id ?? null,
        },
      });
    }
  }
  console.log(`  Upserted ${SAMPLE_POLITICIANS.length} politicians.`);

  // Upsert bills
  for (const bill of SAMPLE_BILLS) {
    const session = await prisma.dietSession.findFirst({
      where: { number: bill.sessionNumber },
    });

    if (!session) {
      console.warn(`  Session #${bill.sessionNumber} not found, skipping bill ${bill.number}`);
      continue;
    }

    const existing = await prisma.bill.findFirst({
      where: { number: bill.number, sessionId: session.id },
    });

    const data = {
      sessionId: session.id,
      number: bill.number,
      title: bill.title,
      summary: bill.summary,
      proposer: bill.proposer,
      category: bill.category,
      status: bill.status,
      submittedAt: new Date(bill.submittedAt),
      passedAt: bill.passedAt ? new Date(bill.passedAt) : null,
    };

    if (existing) {
      await prisma.bill.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.bill.create({ data });
    }
  }
  console.log(`  Upserted ${SAMPLE_BILLS.length} bills.`);
}

if (require.main === module) {
  ingestBills()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
