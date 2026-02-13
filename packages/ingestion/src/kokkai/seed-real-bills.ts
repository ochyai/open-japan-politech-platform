/**
 * seed-real-bills.ts
 *
 * 実際の国会法案データを投入するシードスクリプト。
 * 第210回〜第220回国会（2022〜2026年）の主要法案を含む。
 *
 * データソース:
 *   - 内閣法制局 (https://www.clb.go.jp/recent-laws/)
 *   - 衆議院 議案情報 (https://www.shugiin.go.jp/)
 *   - 参議院 議案情報 (https://www.sangiin.go.jp/)
 *   - 内閣官房 国会提出法案 (https://www.cas.go.jp/jp/houan/)
 *   - 各省庁 国会提出法案ページ
 */

import type { BillStatus, SessionType } from "@ojpp/db";
import { prisma } from "@ojpp/db";

// ============================================
// 国会会期データ（第210回〜第220回）
// ============================================

interface SessionData {
  number: number;
  type: SessionType;
  startDate: string;
  endDate: string;
}

const SESSIONS: SessionData[] = [
  // 第210回 臨時国会（2022年秋）岸田内閣
  {
    number: 210,
    type: "EXTRAORDINARY",
    startDate: "2022-10-03",
    endDate: "2022-12-10",
  },
  // 第211回 通常国会（2023年）岸田内閣
  {
    number: 211,
    type: "ORDINARY",
    startDate: "2023-01-23",
    endDate: "2023-06-21",
  },
  // 第212回 臨時国会（2023年秋）岸田内閣
  {
    number: 212,
    type: "EXTRAORDINARY",
    startDate: "2023-10-20",
    endDate: "2023-12-13",
  },
  // 第213回 通常国会（2024年）岸田内閣
  {
    number: 213,
    type: "ORDINARY",
    startDate: "2024-01-26",
    endDate: "2024-06-23",
  },
  // 第214回 臨時国会（2024年10月）石破内閣発足・衆院解散
  {
    number: 214,
    type: "EXTRAORDINARY",
    startDate: "2024-10-01",
    endDate: "2024-10-09",
  },
  // 第215回 特別国会（2024年11月）第50回衆院選後・石破首相再指名
  {
    number: 215,
    type: "SPECIAL",
    startDate: "2024-11-11",
    endDate: "2024-11-14",
  },
  // 第216回 臨時国会（2024年11-12月）政治改革・補正予算
  {
    number: 216,
    type: "EXTRAORDINARY",
    startDate: "2024-11-28",
    endDate: "2024-12-24",
  },
  // 第217回 通常国会（2025年）石破内閣
  {
    number: 217,
    type: "ORDINARY",
    startDate: "2025-01-24",
    endDate: "2025-06-22",
  },
  // 第218回 臨時国会（2025年8月）参院選後・5日間
  {
    number: 218,
    type: "EXTRAORDINARY",
    startDate: "2025-08-01",
    endDate: "2025-08-05",
  },
  // 第219回 臨時国会（2025年秋）
  {
    number: 219,
    type: "EXTRAORDINARY",
    startDate: "2025-10-21",
    endDate: "2025-12-17",
  },
  // 第220回 通常国会（2026年）高市内閣・召集日に衆院解散
  {
    number: 220,
    type: "ORDINARY",
    startDate: "2026-01-23",
    endDate: "2026-01-23",
  },
];

// ============================================
// 法案データ
// ============================================

interface RealBill {
  sessionNumber: number;
  number: string; // 「回次-種別-番号」形式
  title: string;
  summary: string;
  proposer: string;
  category: string;
  status: BillStatus;
  submittedAt: string;
  passedAt?: string;
  sourceUrl?: string;
}

const REAL_BILLS: RealBill[] = [
  // ============================================================
  // 第210回国会（2022年臨時国会）— 岸田内閣
  // 閣法22本提出・全成立
  // ============================================================
  {
    sessionNumber: 210,
    number: "210-閣法-1",
    title: "一般職の職員の給与に関する法律等の一部を改正する法律案",
    summary:
      "人事院勧告に基づく国家公務員の給与改定。3年ぶりのボーナス引上げ、初任給・若年層の俸給月額の引上げ等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-11",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-5",
    title: "感染症の予防及び感染症の患者に対する医療に関する法律等の一部を改正する法律案",
    summary:
      "次の感染症危機に備えた医療提供体制の強化。都道府県と医療機関との間の協定締結の仕組み等を規定。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-12-02",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-12",
    title: "民法等の一部を改正する法律案",
    summary:
      "嫡出推定制度の見直し。女性の再婚禁止期間の廃止、嫡出否認制度の見直し、親権者の懲戒権規定の削除と体罰禁止規定の追加等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-10-14",
    passedAt: "2022-12-10",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-22",
    title: "法人等による寄附の不当な勧誘の防止等に関する法律案",
    summary:
      "旧統一教会被害者救済法。法人等による寄附の不当な勧誘を防止し、被害者の救済を図る。不当な勧誘による困惑行為の禁止、寄附の意思表示の取消権等を規定。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-12-01",
    passedAt: "2022-12-10",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-4",
    title: "特別職の職員の給与に関する法律の一部を改正する法律案",
    summary:
      "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の給与改定に準じた改定。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-11",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-6",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary:
      "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-11",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-7",
    title: "地方交付税法及び特別会計に関する法律の一部を改正する法律案",
    summary:
      "令和4年度第2次補正予算に伴う地方財政措置。地方交付税の追加交付等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-11-08",
    passedAt: "2022-12-02",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-8",
    title: "独立行政法人国立病院機構法の一部を改正する法律案",
    summary:
      "国立病院機構が積立金を感染症の対応に必要な施設・設備の整備に充てることを可能とする改正。次のパンデミックに備えた医療体制強化。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-10-28",
    passedAt: "2022-11-28",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-14",
    title: "南海トラフ地震に係る地震防災対策の推進に関する特別措置法の一部を改正する法律案",
    summary:
      "南海トラフ地震特措法の期限延長。地震防災対策推進地域における特別強化地域の指定、津波避難対策の推進等に関する特別措置の延長。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-11-01",
    passedAt: "2022-11-18",
  },

  // ============================================================
  // 第211回国会（2023年通常国会）— 岸田内閣 主要法案
  // 閣法60本提出・全法成立
  // ============================================================
  {
    sessionNumber: 211,
    number: "211-閣法-1",
    title: "我が国の防衛力の抜本的な強化等のために必要な財源の確保に関する特別措置法案",
    summary:
      "防衛力強化のための財源確保に関する特別措置。決算剰余金の活用、税外収入の確保、防衛力強化資金の設置等を規定。5年間で43兆円の防衛費確保を目指す。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2023-02-03",
    passedAt: "2023-06-16",
    sourceUrl:
      "https://www.shugiin.go.jp/internet/itdb_gian.nsf/html/gian/keika/1DD5AEE.htm",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-2",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "令和5年度税制改正。NISA制度の拡充・恒久化、インボイス制度の負担軽減措置、防衛力強化に係る税制措置等を含む。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-03",
    passedAt: "2023-03-28",
    sourceUrl:
      "https://www.mof.go.jp/about_mof/bills/211diet/index.htm",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-6",
    title: "新型インフルエンザ等対策特別措置法及び内閣法の一部を改正する法律案",
    summary:
      "感染症危機管理統括庁の設置。内閣官房に感染症危機に対応する司令塔機能を一元化し、初動対応の迅速化を図る。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-02-07",
    passedAt: "2023-04-21",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-12",
    title: "脱炭素成長型経済構造への円滑な移行の推進に関する法律案",
    summary:
      "GX推進法。グリーントランスフォーメーションの推進に向け、GX経済移行債の発行、カーボンプライシング導入等を規定。10年間で150兆円超の投資を見込む。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2023-02-10",
    passedAt: "2023-05-12",
    sourceUrl:
      "https://www.cas.go.jp/jp/houan/211.html",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-16",
    title: "全世代対応型の持続可能な社会保障制度を構築するための健康保険法等の一部を改正する法律案",
    summary:
      "出産育児一時金の引上げ（42万→50万円）、後期高齢者医療制度への拠出金見直し、かかりつけ医機能の制度整備等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-02-10",
    passedAt: "2023-05-12",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-19",
    title: "防衛省設置法の一部を改正する法律案",
    summary:
      "防衛省の体制強化。自衛官定数の変更、サイバー防衛隊の拡充、統合司令部準備等。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-14",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-20",
    title: "防衛省が調達する装備品等の開発及び生産のための基盤の強化に関する法律案",
    summary:
      "防衛産業基盤強化法。装備品のサプライチェーン強靭化、事業承継支援、製造工程の効率化支援等を規定。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-26",
    title: "脱炭素社会の実現に向けた電気供給体制の確立を図るための電気事業法等の一部を改正する法律案",
    summary:
      "GX脱炭素電源法。原子力発電所の60年超運転を可能とする規制見直し、再エネ特措法の改正等。原発の運転期間制限を見直し。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-05-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-36",
    title: "孤独・孤立対策推進法案",
    summary:
      "孤独・孤立対策を国・地方の責務と位置づけ、対策推進本部を設置。NPO等との連携強化、地域協議会の設置等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-02-24",
    passedAt: "2023-05-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-39",
    title: "地方自治法の一部を改正する法律案",
    summary:
      "議会のオンライン出席の恒久化、会計年度任用職員への勤勉手当支給等。デジタル技術活用の促進。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-04-26",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-40",
    title: "放送法及び電波法の一部を改正する法律案",
    summary:
      "放送事業者の経営基盤強化。複数放送対象地域における放送番組の同一化、複数事業者による中継局設備の共同利用、業務管理体制の確保等を規定。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-03",
    passedAt: "2023-05-26",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-46",
    title: "行政手続における特定の個人を識別するための番号の利用等に関する法律等の一部を改正する法律案",
    summary:
      "改正マイナンバー法。マイナンバーカードと健康保険証の一体化（マイナ保険証）、マイナンバーの利用範囲拡大、公金受取口座の登録促進等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-07",
    passedAt: "2023-06-02",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-48",
    title: "出入国管理及び難民認定法及び日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法の一部を改正する法律案",
    summary:
      "改正入管法。難民認定申請中の送還停止効の例外規定を新設。監理措置制度の創設、補完的保護対象者の認定制度等。送還忌避問題への対応。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-03-07",
    passedAt: "2023-06-09",
    sourceUrl:
      "https://www.moj.go.jp/hisho/kouhou/houan211.html",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-23",
    title: "特定受託事業者に係る取引の適正化等に関する法律案",
    summary:
      "フリーランス保護新法。発注事業者に対し、書面等による取引条件の明示義務、報酬の60日以内支払義務等を規定。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-24",
    passedAt: "2023-04-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-47",
    title: "デジタル社会の形成を図るための規制改革を推進するためのデジタル社会形成基本法等の一部を改正する法律案",
    summary:
      "アナログ規制の一括見直し。書面・対面・目視等のアナログ規制をデジタル技術で代替可能とする法改正。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-07",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-41",
    title: "刑事訴訟法等の一部を改正する法律案",
    summary:
      "被疑者の逃亡を防止するためGPS端末装着命令制度の創設。保釈中の被告人の逃亡防止強化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-03-14",
    passedAt: "2023-05-10",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-3",
    title: "関税定率法等の一部を改正する法律案",
    summary:
      "関税率の改定。暫定税率の延長、知的財産侵害物品の水際取締り強化等。令和5年度の関税改正。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-03",
    passedAt: "2023-03-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-4",
    title: "地方税法等の一部を改正する法律案",
    summary:
      "令和5年度地方税制改正。個人住民税の特別税額控除、固定資産税の負担調整措置、車体課税の見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-03",
    passedAt: "2023-03-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-5",
    title: "地方交付税法等の一部を改正する法律案",
    summary:
      "令和5年度地方財政計画に基づく地方交付税の総額確保。交付税率の改定等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-03",
    passedAt: "2023-03-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-13",
    title: "原子力基本法の一部を改正する法律案",
    summary:
      "原子力基本法にエネルギー安全保障への寄与を追加。原子力利用の安全確保と原子力規制委員会の独立性確保を明記。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-05-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-45",
    title: "不当景品類及び不当表示防止法の一部を改正する法律案",
    summary:
      "改正景品表示法。確約手続（課徴金納付命令に代わる自主改善の仕組み）の導入、課徴金の割増率の引上げ等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-03-03",
    passedAt: "2023-05-10",
  },
  // 議員立法
  {
    sessionNumber: 211,
    number: "211-衆法-25",
    title: "性的指向及びジェンダーアイデンティティの多様性に関する国民の理解の増進に関する法律案",
    summary:
      "LGBT理解増進法。性的指向及びジェンダーアイデンティティの多様性に関する国民の理解増進を図るための基本理念、国・地方の施策等を規定。",
    proposer: "自由民主党",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-06-09",
    passedAt: "2023-06-16",
  },

  // ============================================================
  // 第212回国会（2023年臨時国会）— 岸田内閣
  // 閣法12本（新規）+ 継続2本、全14本成立
  // ============================================================
  {
    sessionNumber: 212,
    number: "212-閣法-1",
    title: "一般職の職員の給与に関する法律等の一部を改正する法律案",
    summary:
      "人事院勧告に基づく国家公務員の給与改定。月例給・ボーナスの引上げ。初任給の大幅引上げを含む。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-11-15",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-5",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary:
      "自衛官等の給与改定。一般職に準じた処遇改善。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-11-17",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-6",
    title: "国立研究開発法人情報通信研究機構法の一部を改正する等の法律案",
    summary:
      "NICT法改正。サイバーセキュリティ対策の強化、量子技術等の研究開発推進、安全保障分野での情報通信技術の活用強化。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-11-29",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-7",
    title: "大麻取締法及び麻薬及び向精神薬取締法の一部を改正する法律案",
    summary:
      "大麻の「使用罪」新設。大麻由来医薬品の使用を可能とする制度の整備。大麻草の栽培に関する規制の見直し。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-10-24",
    passedAt: "2023-12-06",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-8",
    title: "官報の発行に関する法律案",
    summary:
      "官報の電子化。官報のインターネット発行を正本化し、法令公布の電子化を実現。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-10-27",
    passedAt: "2023-11-29",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-10",
    title: "国立大学法人法の一部を改正する法律案",
    summary:
      "大規模国立大学法人（東京大学、京都大学等）に運営方針会議の設置を義務付け。外部人材の登用等によるガバナンス強化。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-12-13",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-12",
    title: "国立研究開発法人宇宙航空研究開発機構法の一部を改正する法律案",
    summary:
      "JAXA法改正。宇宙戦略基金の設置。民間の宇宙事業を支援するため、JAXAに10年間で1兆円規模の基金を設置。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-12-13",
  },

  // ============================================================
  // 第213回国会（2024年通常国会）— 岸田内閣
  // 閣法62本提出・61本成立（成立率98.4%）、議員立法8本成立
  // ============================================================
  {
    sessionNumber: 213,
    number: "213-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "令和6年度税制改正。定額減税の実施（所得税3万円・住民税1万円）、賃上げ税制の強化、ストックオプション税制の拡充等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-02",
    passedAt: "2024-03-28",
    sourceUrl:
      "https://www.mof.go.jp/about_mof/bills/213diet/index.htm",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-2",
    title: "地方税法等の一部を改正する法律案",
    summary:
      "個人住民税の定額減税（1万円）、固定資産税の負担調整措置の延長、森林環境譲与税の配分見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-02",
    passedAt: "2024-03-28",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-14",
    title: "防衛省設置法等の一部を改正する法律案",
    summary:
      "統合作戦司令部の設置。自衛隊の統合運用体制を強化し、陸海空を一元的に指揮する統合作戦司令官を新設。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2024-02-13",
    passedAt: "2024-04-16",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-16",
    title: "脱炭素成長型経済構造移行推進のための低炭素水素等の供給及び利用の促進に関する法律案",
    summary:
      "水素社会推進法。低炭素水素等の供給・利用促進のための支援措置、価格差支援制度の創設等。GXの柱の一つ。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2024-02-13",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-17",
    title: "二酸化炭素の貯留事業に関する法律案",
    summary:
      "CCS事業法。二酸化炭素の地下貯留に関する許可制度の創設、事業者の義務、安全基準等を規定。2050年カーボンニュートラル実現に向けた基盤整備。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2024-02-13",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-19",
    title: "流通業務の総合化及び効率化の促進に関する法律及び貨物自動車運送事業法の一部を改正する法律案",
    summary:
      "物流2024年問題対応法。トラックドライバーの時間外労働規制に伴う輸送力不足への対策。荷主・物流事業者の連携強化、多重下請構造の是正等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-13",
    passedAt: "2024-04-12",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-20",
    title: "令和六年能登半島地震災害の被災者に係る所得税法及び災害被害者に対する租税の減免、徴収猶予等に関する法律の臨時特例に関する法律案",
    summary:
      "能登半島地震被災者への税制支援。令和5年分の所得税について、雑損控除の特例、災害減免法の特例、事業用資産の損失を必要経費に算入する特例等を措置。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-16",
    passedAt: "2024-02-21",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-22",
    title: "子ども・子育て支援法等の一部を改正する法律案",
    summary:
      "こども未来戦略の実現。児童手当の拡充（所得制限撤廃・高校生まで延長・第3子以降3万円）、こども誰でも通園制度の創設、育児休業給付の充実等。年間3.6兆円規模の少子化対策パッケージ。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-02-16",
    passedAt: "2024-06-05",
    sourceUrl:
      "https://www.cfa.go.jp/laws/houan/e81845c0",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-24",
    title: "重要経済安保情報の保護及び活用に関する法律案",
    summary:
      "セキュリティ・クリアランス法。重要な経済安全保障情報にアクセスできる者を適性評価によって選別する制度を創設。経済安全保障推進法の補完。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-10",
    sourceUrl:
      "https://www.cas.go.jp/jp/houan/213.html",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-26",
    title: "食料・農業・農村基本法の一部を改正する法律案",
    summary:
      "25年ぶりの農業基本法改正。食料安全保障の強化を法の目的に追加。食料自給率向上、環境と調和のとれた食料システムの確立、スマート農業の推進等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-29",
    sourceUrl:
      "https://www.maff.go.jp/j/law/bill/213/index.html",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-27",
    title: "食料供給困難事態対策法案",
    summary:
      "食料危機対応法。食料供給が困難になった場合の政府の対策措置を規定。備蓄の放出、輸入の促進、生産転換の指示等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-29",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-31",
    title: "地方自治法の一部を改正する法律案",
    summary:
      "国の補充的指示権の創設。大規模災害や感染症危機等の非常時に、国が地方自治体に対して必要な指示を行うことができる規定を新設。コロナ禍の教訓を踏まえた対応。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-03-01",
    passedAt: "2024-06-19",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-32",
    title: "放送法の一部を改正する法律案",
    summary:
      "改正NHK放送法。NHKのインターネット配信を「必須業務」に格上げ。テレビを持たずスマホのみでNHKを視聴する場合の受信料制度を整備。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-03-01",
    passedAt: "2024-05-17",
    sourceUrl:
      "https://www.shugiin.go.jp/internet/itdb_gian.nsf/html/gian/keika/1DDBA96.htm",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-33",
    title: "日本電信電話株式会社等に関する法律の一部を改正する法律案",
    summary:
      "NTT法改正。NTTの研究成果の公開義務の廃止、外国人役員規制の緩和、ユニバーサルサービスの見直し。NTTの国際競争力強化が目的。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-03-01",
    passedAt: "2024-04-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-38",
    title: "道路交通法の一部を改正する法律案",
    summary:
      "自動運転レベル4に対応した制度整備。特定自動運行の許可制度、自転車の酒酔い運転等に対する罰則強化等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-03-05",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-47",
    title: "民法等の一部を改正する法律案",
    summary:
      "共同親権導入。離婚後も父母が共同で親権を行使することを選択できる制度を導入。子の利益を最優先とする規定の整備。77年ぶりの親権制度の大改正。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-03-08",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-54",
    title: "育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律及び次世代育成支援対策推進法の一部を改正する法律案",
    summary:
      "改正育児介護休業法。男性育休取得促進のための措置義務、テレワークの努力義務、子の看護休暇の拡充等。次世代法の延長。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-12",
    passedAt: "2024-05-24",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-58",
    title: "出入国管理及び難民認定法及び出入国管理及び難民認定法及び日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法の一部を改正する法律案",
    summary:
      "育成就労制度の創設。技能実習制度を発展的に解消し、外国人材の育成・確保を目的とする新制度を創設。転籍の柔軟化、人権侵害の防止強化。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-15",
    passedAt: "2024-06-14",
    sourceUrl:
      "https://www.moj.go.jp/hisho/kouhou/houan213.html",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-61",
    title: "学校設置者等及び民間教育保育等事業者による児童対象性暴力等の防止等のための措置に関する法律案",
    summary:
      "日本版DBS法。子どもに接する仕事に就く者の性犯罪歴を確認する仕組みを創設。学校・保育所・塾等に確認義務を課す。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2024-03-19",
    passedAt: "2024-06-19",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-62",
    title: "スマートフォンにおいて利用される特定ソフトウェアに係る競争の促進に関する法律案",
    summary:
      "スマホソフトウェア競争促進法。Apple・Googleのアプリストア独占に対応し、サイドローディングの義務化等。日本版デジタル市場法。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-04-26",
    passedAt: "2024-06-12",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-23",
    title: "産業競争力強化法等の一部を改正する法律案",
    summary:
      "半導体・蓄電池等の戦略分野の国内投資促進。大規模投資に対する減税措置（最大10年間・税額控除40%）、中堅企業の成長支援等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-22",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-30",
    title: "銃砲刀剣類所持等取締法の一部を改正する法律案",
    summary:
      "銃刀法改正。クロスボウ（ボーガン）の所持許可制の導入、模造銃規制の強化、猟銃所持の厳格化。2023年長野事件を受けた対策。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-06-05",
  },
  // 第213回 議員立法
  {
    sessionNumber: 213,
    number: "213-衆法-16",
    title: "政治資金規正法の一部を改正する法律案",
    summary:
      "改正政治資金規正法。自民党派閥の裏金問題を受けた政治資金の透明化。政治資金パーティー収入の公開基準引下げ（20万円→5万円超）、政策活動費の使途公開（10年後）、国会議員関係政治団体への厳格化。",
    proposer: "自由民主党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-05-31",
    passedAt: "2024-06-19",
  },
  // 議員立法 否決・未了分
  {
    sessionNumber: 213,
    number: "213-衆法-8",
    title: "消費税率の引下げ等に関する法律案",
    summary:
      "消費税率の時限的な5%への引下げ。物価高騰対策としての消費税減税を提案。",
    proposer: "日本維新の会",
    category: "経済",
    status: "REJECTED",
    submittedAt: "2024-03-01",
  },
  {
    sessionNumber: 213,
    number: "213-参法-3",
    title: "選択的夫婦別姓制度を導入する民法の一部を改正する法律案",
    summary:
      "婚姻時に夫婦が各自の氏を称することを選択できる制度の導入。",
    proposer: "立憲民主党",
    category: "司法",
    status: "COMMITTEE",
    submittedAt: "2024-02-14",
  },

  // ============================================================
  // 第214回国会（2024年10月臨時国会）— 石破内閣発足
  // 実質審議なし。首相指名後、10月9日に衆議院解散。
  // ============================================================
  // 第214回は法案審議は行われていない

  // ============================================================
  // 第215回国会（2024年11月特別国会）— 第50回衆院選後
  // 首相指名（決選投票で石破再指名）のみ。会期4日間。
  // ============================================================
  // 第215回も法案審議は行われていない

  // ============================================================
  // 第216回国会（2024年11-12月臨時国会）— 石破内閣
  // 閣法9本・議員立法7本、計16本成立
  // ============================================================
  {
    sessionNumber: 216,
    number: "216-閣法-1",
    title: "一般職の職員の給与に関する法律等の一部を改正する法律案",
    summary:
      "人事院勧告に基づく国家公務員の給与改定。月例給・ボーナスの引上げ、初任給の大幅引上げ（大卒初任給を民間水準に近づける）。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-17",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-2",
    title: "特別職の職員の給与に関する法律の一部を改正する法律案",
    summary:
      "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じた引上げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-17",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-4",
    title: "情報通信技術を活用した行政の推進等に関する法律の一部を改正する法律案",
    summary:
      "行政手続のデジタル化推進。マイナンバーカードを活用した行政手続のオンライン化促進等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-20",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-5",
    title: "地方交付税法及び特別会計に関する法律の一部を改正する法律案",
    summary:
      "地方交付税の追加交付。令和6年度補正予算に伴う地方財政措置。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-21",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-9",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary:
      "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-17",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-3",
    title: "裁判官の報酬等に関する法律の一部を改正する法律案",
    summary:
      "裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-17",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-6",
    title: "検察官の俸給等に関する法律の一部を改正する法律案",
    summary:
      "検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-17",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-7",
    title: "国の補正予算により増額される地方交付税の交付時期の特例に関する法律案",
    summary:
      "令和6年度補正予算に伴い増額される地方交付税を早期に交付するための特例措置。地方の経済対策の迅速な実施を支援。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-21",
  },
  {
    sessionNumber: 216,
    number: "216-閣法-8",
    title: "復興財源確保法及び復興特別所得税の特例に関する法律案",
    summary:
      "復興特別所得税の税率引下げ・課税期間延長。防衛費財源確保のための税制措置の一環として、復興特別所得税の一部を防衛費に充当。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-21",
  },
  // 第216回 議員立法（政治改革関連）
  {
    sessionNumber: 216,
    number: "216-衆法-2",
    title: "政治資金規正法の一部を改正する法律案（政策活動費廃止）",
    summary:
      "政策活動費の廃止。政党から議員個人に支給される政策活動費を渡切りの方法により支出することを禁止。自民党裏金問題を受けた政治改革の柱。",
    proposer: "立憲民主党・日本維新の会・国民民主党・日本共産党・参政党・日本保守党・社会民主党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-04",
    passedAt: "2024-12-24",
  },
  {
    sessionNumber: 216,
    number: "216-衆法-6",
    title: "政治資金規正法等の一部を改正する法律案（外国人パーティー券購入禁止・デジタル化）",
    summary:
      "外国人・外国法人による政治資金パーティー券購入の禁止。収支報告書のデータベース化・オンライン検索システムの整備。政治資金の透明性向上。",
    proposer: "自由民主党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-24",
  },
  {
    sessionNumber: 216,
    number: "216-衆法-11",
    title: "政治資金監視委員会等の設置その他の政治資金の透明性を確保するための措置等に関する法律案",
    summary:
      "国会に独立性の高い「政治資金監視委員会」を設置し、政治資金の監視・検査機能を強化。外国人の政治資金パーティー券購入禁止規定も含む。",
    proposer: "国民民主党・公明党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-24",
  },
  {
    sessionNumber: 216,
    number: "216-衆法-20",
    title: "国会議員の歳費、旅費及び手当等に関する法律の一部を改正する法律案（調査研究広報滞在費の使途公開）",
    summary:
      "旧文書通信交通滞在費（現・調査研究広報滞在費）の使途公開義務化。月額100万円の使途を領収書付きで公開。余剰分の国庫返還を義務化。",
    proposer: "超党派",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-12-09",
    passedAt: "2024-12-20",
  },

  // ============================================================
  // 第217回国会（2025年通常国会）— 石破内閣
  // 閣法59本中58本成立、議員立法17本成立、計75本成立
  // ============================================================
  {
    sessionNumber: 217,
    number: "217-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "令和7年度税制改正。いわゆる「103万円の壁」の見直し（基礎控除・給与所得控除の引上げ）、防衛特別法人税の創設、賃上げ税制の延長等。与党修正を経て成立。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-04",
    passedAt: "2025-03-31",
    sourceUrl:
      "https://www.mof.go.jp/about_mof/bills/217diet/index.html",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-2",
    title: "地方税法及び地方税法等の一部を改正する法律の一部を改正する法律案",
    summary:
      "個人住民税の基礎控除引上げ等、所得税法改正に連動した地方税の改正。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-04",
    passedAt: "2025-03-31",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-4",
    title: "重要電子計算機に対する不正な行為による被害の防止に関する法律案",
    summary:
      "サイバー対処能力強化法（能動的サイバー防御法）。基幹インフラ事業者のサイバーセキュリティ対策を強化し、政府の能動的サイバー防御を可能とする制度を創設。衆院修正。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-05-16",
    sourceUrl:
      "https://www.cas.go.jp/jp/houan/217.html",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-5",
    title: "重要電子計算機に対する不正な行為による被害の防止に関する法律の施行に伴う関係法律の整備等に関する法律案",
    summary:
      "サイバー対処能力強化法整備法。能動的サイバー防御法の施行に伴い、電気通信事業法等の関連法律を改正。通信の秘密に関する例外規定等を整備。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-8",
    title: "大学等における修学の支援に関する法律の一部を改正する法律案",
    summary:
      "高等教育の修学支援制度の拡充。給付型奨学金・授業料減免の対象拡大、多子世帯への支援強化等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-04-04",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-16",
    title: "防衛省設置法等の一部を改正する法律案",
    summary:
      "防衛省の組織強化。自衛官定数の見直し、サイバー防衛体制の拡充等。防衛力整備計画に基づく体制強化。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-04-11",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-21",
    title: "医療法等の一部を改正する法律案",
    summary:
      "医師の働き方改革の推進、地域医療構想の実現に向けた医療提供体制の改革等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-02-18",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-29",
    title: "人工知能関連技術の研究開発及び活用の推進に関する法律案",
    summary:
      "AI推進法（AI新法）。人工知能関連技術の研究開発・活用推進のための基本理念、人工知能戦略本部の設置、基本計画の策定等を規定。日本初のAI基本法。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2025-02-28",
    passedAt: "2025-05-28",
    sourceUrl:
      "https://www8.cao.go.jp/cstp/ai/ai_act/ai_act.html",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-36",
    title: "日本学術会議法案",
    summary:
      "日本学術会議の組織改革。会員選考プロセスの透明化、外部有識者による選考委員会の設置等。会員任命問題を受けた制度改革。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-06-18",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-59",
    title: "社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律案",
    summary:
      "年金制度改革法。いわゆる「106万円の壁」の撤廃（厚生年金の適用拡大）、在職老齢年金制度の見直し、基礎年金の給付水準底上げ等。衆院修正を経て成立。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-05-16",
    passedAt: "2025-06-13",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-3",
    title: "関税定率法等の一部を改正する法律案",
    summary:
      "関税率の改定。暫定税率の延長、知的財産侵害物品の水際取締り強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-03-31",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-6",
    title: "裁判所職員定員法の一部を改正する法律案",
    summary:
      "裁判所の職員定員の改定。判事の員数増加及び裁判所書記官等の定員見直し。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-03-19",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-7",
    title: "地方交付税法等の一部を改正する法律案",
    summary:
      "令和7年度地方財政計画に基づく地方交付税の総額確保。交付税率の改定等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-03-31",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-10",
    title: "児童福祉法等の一部を改正する法律案",
    summary:
      "こどもの安全に関する制度の強化。児童相談所の体制強化、里親制度の充実、児童養護施設の環境改善等。こども家庭庁設置後の制度整備。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-05-23",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-13",
    title: "地方税法等の一部を改正する法律案",
    summary:
      "令和7年度地方税制改正。個人住民税の定額減税の精算、固定資産税の負担調整措置等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-03-31",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-18",
    title: "食料供給基盤強化法案",
    summary:
      "食料安全保障の強化。農地の集約化・大規模化の推進、スマート農業技術の導入支援、農業経営の法人化促進等。食料・農業・農村基本法改正を受けた具体化法。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2025-02-21",
    passedAt: "2025-05-30",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-22",
    title: "介護保険法等の一部を改正する法律案",
    summary:
      "介護制度改革。介護職員の処遇改善、ケアマネジメントの質の向上、地域包括ケアシステムの深化・推進等。2025年度介護報酬改定に対応。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-02-28",
    passedAt: "2025-05-30",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-25",
    title: "特定商取引に関する法律の一部を改正する法律案",
    summary:
      "SNS等を利用した詐欺的商法への対策強化。通信販売における不当表示の罰則強化、クーリングオフ制度の拡充等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-03-04",
    passedAt: "2025-05-23",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-33",
    title: "金融商品取引法等の一部を改正する法律案",
    summary:
      "資産運用立国の実現に向けた改正。投資助言業の規制合理化、暗号資産に関する規制の整備、企業開示制度の見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-06-06",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-37",
    title: "環境影響評価法の一部を改正する法律案",
    summary:
      "環境アセスメント制度の合理化。再エネ発電設備設置に関する環境影響評価手続の迅速化等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-05-28",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-42",
    title: "盗難特定金属等の処分の防止等に関する法律案",
    summary:
      "金属盗難対策法。銅線等の金属の盗難が相次いでいることを受け、盗難金属の処分防止、古物営業法の適用強化等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-06-13",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-44",
    title: "災害対策基本法の一部を改正する法律案",
    summary:
      "能登半島地震の教訓を踏まえた災害対策の強化。国のプッシュ型支援の制度化、応急対応の迅速化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-09",
  },
  // 第217回 議員立法
  {
    sessionNumber: 217,
    number: "217-衆法-7",
    title: "ギャンブル等依存症対策基本法の一部を改正する法律案",
    summary:
      "ギャンブル依存症対策の強化。オンラインカジノ等の新たな依存リスクへの対応、相談・治療体制の充実等。",
    proposer: "立憲民主党・日本維新の会",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-03-18",
    passedAt: "2025-06-18",
  },
  {
    sessionNumber: 217,
    number: "217-衆法-11",
    title: "手話言語法案",
    summary:
      "手話を言語として法的に位置づけ、手話の普及・研究・利用促進に関する施策を規定。",
    proposer: "超党派",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-04-22",
    passedAt: "2025-06-18",
  },

  // ============================================================
  // 第219回国会（2025年秋臨時国会）
  // 閣法10本・議員立法5本（+裁判官報酬・検察官俸給を含む）、計16本成立
  // ============================================================
  {
    sessionNumber: 219,
    number: "219-閣法-1",
    title: "ストーカー行為等の規制等に関する法律の一部を改正する法律案",
    summary:
      "改正ストーカー規制法。GPS機器を用いた位置情報の取得規制強化、SNS等を通じたつきまとい行為への対応強化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-11-04",
    passedAt: "2025-12-10",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-2",
    title: "配偶者からの暴力の防止及び被害者の保護等に関する法律の一部を改正する法律案",
    summary:
      "改正DV防止法。接近禁止命令の対象拡大、精神的DV（モラハラ）に対する保護命令の適用等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-11-04",
    passedAt: "2025-12-10",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-3",
    title: "更生保護制度の充実を図るための保護司法等の一部を改正する法律案",
    summary:
      "保護司法改正。保護司の処遇改善、なり手不足への対応等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-10-28",
    passedAt: "2025-12-05",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-4",
    title: "気象業務法及び水防法の一部を改正する法律案",
    summary:
      "線状降水帯等の予測精度向上に向けた観測体制の強化、水防情報の高度化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-11-04",
    passedAt: "2025-12-05",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-5",
    title: "一般職の職員の給与に関する法律等の一部を改正する法律案",
    summary:
      "人事院勧告に基づく国家公務員の給与改定。月例給・ボーナスの引上げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2025-10-31",
    passedAt: "2025-11-28",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-6",
    title: "特別職の職員の給与に関する法律の一部を改正する法律案",
    summary:
      "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じた引上げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2025-10-31",
    passedAt: "2025-11-28",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-7",
    title: "地方交付税法及び特別会計に関する法律の一部を改正する法律案",
    summary:
      "令和7年度補正予算に伴う地方財政措置。地方交付税の追加交付等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-11-21",
    passedAt: "2025-12-17",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-10",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary:
      "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2025-10-31",
    passedAt: "2025-11-28",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-8",
    title: "裁判官の報酬等に関する法律の一部を改正する法律案",
    summary:
      "裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-10-31",
    passedAt: "2025-11-28",
  },
  {
    sessionNumber: 219,
    number: "219-閣法-9",
    title: "検察官の俸給等に関する法律の一部を改正する法律案",
    summary:
      "検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-10-31",
    passedAt: "2025-11-28",
  },
  // 第219回 議員立法（第218回からの継続審議含む）
  {
    sessionNumber: 219,
    number: "219-衆法-1",
    title: "租税特別措置法及び東日本大震災の被災者等に係る国税関係法律の臨時特例に関する法律の一部を改正する法律案",
    summary:
      "ガソリン税暫定税率の廃止。旧暫定税率（1リットルあたり約25.1円）を2025年12月31日付で廃止し、ガソリン価格の引下げを実現。第218回国会で野党7党が提出し、第219回で与野党6党合意の修正を経て成立。",
    proposer: "立憲民主党・日本維新の会・国民民主党・日本共産党・参政党・日本保守党・社会民主党",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-08-01",
    passedAt: "2025-11-28",
  },
  {
    sessionNumber: 219,
    number: "219-衆法-10",
    title: "高次脳機能障害者支援法案",
    summary:
      "高次脳機能障害者の支援に関する基本法。基本理念の設定、国・地方公共団体の責務、支援センターの指定、支援地域協議会の設置等を規定。",
    proposer: "超党派",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-12-05",
    passedAt: "2025-12-16",
  },
];

// ============================================
// シード実行
// ============================================

async function seedSessions() {
  console.log("=== 国会会期データの投入 ===");

  for (const session of SESSIONS) {
    const existing = await prisma.dietSession.findFirst({
      where: { number: session.number },
    });

    if (existing) {
      await prisma.dietSession.update({
        where: { id: existing.id },
        data: {
          type: session.type,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
      });
      console.log(`  更新: 第${session.number}回国会（${session.type}）`);
    } else {
      await prisma.dietSession.create({
        data: {
          number: session.number,
          type: session.type,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
      });
      console.log(`  作成: 第${session.number}回国会（${session.type}）`);
    }
  }

  console.log(`  合計: ${SESSIONS.length}会期\n`);
}

async function seedBills() {
  console.log("=== 法案データの投入 ===");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const bill of REAL_BILLS) {
    const session = await prisma.dietSession.findFirst({
      where: { number: bill.sessionNumber },
    });

    if (!session) {
      console.warn(
        `  スキップ: 第${bill.sessionNumber}回国会が見つかりません — ${bill.number} ${bill.title}`,
      );
      skipped++;
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
      sourceUrl: bill.sourceUrl ?? null,
    };

    if (existing) {
      await prisma.bill.update({
        where: { id: existing.id },
        data,
      });
      updated++;
    } else {
      await prisma.bill.create({ data });
      created++;
    }
  }

  console.log(`  作成: ${created}件`);
  console.log(`  更新: ${updated}件`);
  if (skipped > 0) {
    console.log(`  スキップ: ${skipped}件`);
  }
  console.log(`  合計: ${REAL_BILLS.length}件の法案データ\n`);
}

async function printStats() {
  console.log("=== 投入結果の統計 ===");

  const sessionCount = await prisma.dietSession.count();
  const billCount = await prisma.bill.count();

  const statusCounts = await prisma.bill.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const categoryCounts = await prisma.bill.groupBy({
    by: ["category"],
    _count: { category: true },
    orderBy: { _count: { category: "desc" } },
  });

  console.log(`  会期数: ${sessionCount}`);
  console.log(`  法案数: ${billCount}`);
  console.log("\n  ステータス別:");
  for (const s of statusCounts) {
    console.log(`    ${s.status}: ${s._count.status}件`);
  }
  console.log("\n  カテゴリ別:");
  for (const c of categoryCounts) {
    console.log(`    ${c.category ?? "未分類"}: ${c._count.category}件`);
  }
}

async function main() {
  console.log("========================================================");
  console.log("  実データシード: 国会法案データ (第210回〜第220回)");
  console.log("========================================================\n");

  try {
    await seedSessions();
    await seedBills();
    await printStats();

    console.log("\nシードが正常に完了しました。");
  } catch (error) {
    console.error("\nシード実行中にエラーが発生しました:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
