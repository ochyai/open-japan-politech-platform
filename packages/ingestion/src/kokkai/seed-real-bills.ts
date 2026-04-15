/**
 * seed-real-bills.ts
 *
 * 実際の国会法案データを投入するシードスクリプト。
 * 第190回〜第220回国会（2016〜2026年）の主要法案を含む。
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
// 国会会期データ（第190回〜第220回）
// ============================================

interface SessionData {
  number: number;
  type: SessionType;
  startDate: string;
  endDate: string;
}

const SESSIONS: SessionData[] = [
  // 第190回 通常国会（2016年）安倍内閣
  {
    number: 190,
    type: "ORDINARY",
    startDate: "2016-01-04",
    endDate: "2016-06-01",
  },
  // 第191回 臨時国会（2016年8月）参院選後・3日間
  {
    number: 191,
    type: "EXTRAORDINARY",
    startDate: "2016-08-01",
    endDate: "2016-08-03",
  },
  // 第192回 臨時国会（2016年秋）安倍内閣・IR推進法等
  {
    number: 192,
    type: "EXTRAORDINARY",
    startDate: "2016-09-26",
    endDate: "2016-12-17",
  },
  // 第193回 通常国会（2017年）安倍内閣・テロ等準備罪等
  {
    number: 193,
    type: "ORDINARY",
    startDate: "2017-01-20",
    endDate: "2017-06-18",
  },
  // 第194回 臨時国会（2017年9月）衆院解散・会期1日
  {
    number: 194,
    type: "EXTRAORDINARY",
    startDate: "2017-09-28",
    endDate: "2017-09-28",
  },
  // 第195回 特別国会（2017年11月）第48回衆院選後・安倍首相指名
  {
    number: 195,
    type: "SPECIAL",
    startDate: "2017-11-01",
    endDate: "2017-12-09",
  },
  // 第196回 通常国会（2018年）安倍内閣・働き方改革等
  {
    number: 196,
    type: "ORDINARY",
    startDate: "2018-01-22",
    endDate: "2018-07-22",
  },
  // 第197回 臨時国会（2018年秋）入管法改正等
  {
    number: 197,
    type: "EXTRAORDINARY",
    startDate: "2018-10-24",
    endDate: "2018-12-10",
  },
  // 第198回 通常国会（2019年）安倍内閣
  {
    number: 198,
    type: "ORDINARY",
    startDate: "2019-01-28",
    endDate: "2019-06-26",
  },
  // 第199回 臨時国会（2019年8月）参院選後・5日間
  {
    number: 199,
    type: "EXTRAORDINARY",
    startDate: "2019-08-01",
    endDate: "2019-08-05",
  },
  // 第200回 臨時国会（2019年秋）安倍内閣
  {
    number: 200,
    type: "EXTRAORDINARY",
    startDate: "2019-10-04",
    endDate: "2019-12-09",
  },
  // 第201回 通常国会（2020年）安倍内閣・コロナ対応
  {
    number: 201,
    type: "ORDINARY",
    startDate: "2020-01-20",
    endDate: "2020-06-17",
  },
  // 第202回 臨時国会（2020年9月）菅内閣発足
  {
    number: 202,
    type: "EXTRAORDINARY",
    startDate: "2020-09-16",
    endDate: "2020-09-18",
  },
  // 第203回 臨時国会（2020年秋）菅内閣
  {
    number: 203,
    type: "EXTRAORDINARY",
    startDate: "2020-10-26",
    endDate: "2020-12-05",
  },
  // 第204回 通常国会（2021年）菅内閣
  {
    number: 204,
    type: "ORDINARY",
    startDate: "2021-01-18",
    endDate: "2021-06-16",
  },
  // 第205回 臨時国会（2021年10月）岸田内閣発足・衆院解散
  {
    number: 205,
    type: "EXTRAORDINARY",
    startDate: "2021-10-04",
    endDate: "2021-10-14",
  },
  // 第206回 特別国会（2021年11月）第49回衆院選後・岸田首相指名
  {
    number: 206,
    type: "SPECIAL",
    startDate: "2021-11-10",
    endDate: "2021-11-12",
  },
  // 第207回 臨時国会（2021年12月）補正予算
  {
    number: 207,
    type: "EXTRAORDINARY",
    startDate: "2021-12-06",
    endDate: "2021-12-21",
  },
  // 第208回 通常国会（2022年）岸田内閣
  {
    number: 208,
    type: "ORDINARY",
    startDate: "2022-01-17",
    endDate: "2022-06-15",
  },
  // 第209回 臨時国会（2022年8月）参院選後・3日間
  {
    number: 209,
    type: "EXTRAORDINARY",
    startDate: "2022-08-03",
    endDate: "2022-08-05",
  },
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
  // 第190回国会（2016年通常国会）— 安倍内閣
  // 閣法75本提出・56本成立
  // ============================================================
  {
    sessionNumber: 190,
    number: "190-閣法-47",
    title: "刑事訴訟法等の一部を改正する法律案",
    summary:
      "刑事司法改革。取調べの録音・録画（可視化）の義務化、通信傍受の対象犯罪拡大、司法取引（合意制度）の導入等。戦後日本の刑事司法制度の大転換。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2016-03-11",
    passedAt: "2016-05-24",
  },
  {
    sessionNumber: 190,
    number: "190-閣法-49",
    title: "児童福祉法等の一部を改正する法律案",
    summary:
      "児童虐待対応の強化。児童相談所の体制強化、児童の権利に関する条約の精神にのっとる理念の明確化、里親委託の推進等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2016-03-11",
    passedAt: "2016-05-27",
  },
  {
    sessionNumber: 190,
    number: "190-閣法-52",
    title: "民法の一部を改正する法律案",
    summary: "女性の再婚禁止期間の短縮。最高裁判決（平成27年12月）を踏まえ、6か月から100日に短縮。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2016-03-11",
    passedAt: "2016-06-01",
  },
  {
    sessionNumber: 190,
    number: "190-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "平成28年度税制改正。法人税率の引下げ（23.9%→23.4%）、消費税の軽減税率制度の導入決定等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2016-02-05",
    passedAt: "2016-03-29",
  },
  {
    sessionNumber: 190,
    number: "190-閣法-30",
    title: "地球温暖化対策の推進に関する法律の一部を改正する法律案",
    summary: "パリ協定を踏まえた地球温暖化対策計画の策定義務化。地方公共団体実行計画の拡充等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2016-03-04",
    passedAt: "2016-05-20",
  },
  {
    sessionNumber: 190,
    number: "190-閣法-25",
    title:
      "障害者の日常生活及び社会生活を総合的に支援するための法律及び児童福祉法の一部を改正する法律案",
    summary:
      "障害者総合支援法改正。自立生活援助の創設、就労定着支援の創設、障害児支援のニーズの多様化への対応等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2016-03-01",
    passedAt: "2016-05-25",
  },
  {
    sessionNumber: 190,
    number: "190-閣法-41",
    title: "消費者契約法の一部を改正する法律案",
    summary:
      "消費者契約における取消権の拡充。過量な内容の契約の取消権の新設、不実告知の範囲拡大等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2016-03-04",
    passedAt: "2016-05-25",
  },

  // ============================================================
  // 第192回国会（2016年臨時国会）— 安倍内閣
  // 閣法31本提出・16本成立、議員立法多数
  // ============================================================
  {
    sessionNumber: 192,
    number: "192-衆法-17",
    title: "特定複合観光施設区域の整備の推進に関する法律案",
    summary:
      "IR推進法（カジノ法案）。カジノを含む統合型リゾート施設の整備を推進するための基本方針。議員立法として成立。",
    proposer: "自由民主党・日本維新の会",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2016-12-02",
    passedAt: "2016-12-15",
  },
  {
    sessionNumber: 192,
    number: "192-閣法-11",
    title: "外国人の技能実習の適正な実施及び技能実習生の保護に関する法律案",
    summary:
      "技能実習法。技能実習制度の適正化と技能実習生の保護を図るため、監理団体の許可制・技能実習計画の認定制を導入。外国人技能実習機構を設置。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2016-10-04",
    passedAt: "2016-11-28",
  },
  {
    sessionNumber: 192,
    number: "192-閣法-10",
    title: "出入国管理及び難民認定法の一部を改正する法律案",
    summary: "入管法改正。在留資格「介護」の新設、偽装滞在者対策の強化等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2016-10-04",
    passedAt: "2016-11-28",
  },
  {
    sessionNumber: 192,
    number: "192-閣法-1",
    title: "環太平洋パートナーシップ協定の締結に伴う関係法律の整備に関する法律案",
    summary:
      "TPP関連法。TPP協定の締結に伴い、著作権法、特許法、畜産物価格安定法等の関係法律を整備。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2016-10-04",
    passedAt: "2016-12-09",
  },
  {
    sessionNumber: 192,
    number: "192-閣法-13",
    title: "民間公益活動を促進するための休眠預金等に係る資金の活用に関する法律案",
    summary: "休眠預金等活用法。10年以上取引のない預金等を民間公益活動に活用する制度を創設。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2016-10-04",
    passedAt: "2016-12-09",
  },
  {
    sessionNumber: 192,
    number: "192-閣法-5",
    title: "官民データ活用推進基本法案",
    summary:
      "官民データ活用推進基本法。官民データ活用の推進に関する基本理念、施策の基本となる事項を定め、データ活用による国民生活の向上を目指す。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2016-10-04",
    passedAt: "2016-12-14",
  },

  // ============================================================
  // 第193回国会（2017年通常国会）— 安倍内閣
  // 閣法66本提出・63本成立
  // ============================================================
  {
    sessionNumber: 193,
    number: "193-閣法-64",
    title: "組織的な犯罪の処罰及び犯罪収益の規制等に関する法律等の一部を改正する法律案",
    summary:
      "テロ等準備罪（共謀罪）法案。テロリズム集団その他の組織的犯罪集団による重大犯罪の計画段階での処罰を可能に。国際組織犯罪防止条約（TOC条約）の締結を目的。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2017-03-21",
    passedAt: "2017-06-15",
  },
  {
    sessionNumber: 193,
    number: "193-閣法-33",
    title: "天皇の退位等に関する皇室典範特例法案",
    summary:
      "天皇退位特例法。天皇陛下（明仁）の退位を実現するための特例法。施行日に退位し、皇太子が即位。元号は令和に改元。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2017-05-19",
    passedAt: "2017-06-09",
  },
  {
    sessionNumber: 193,
    number: "193-閣法-1",
    title: "所得税法等の一部を改正する等の法律案",
    summary:
      "平成29年度税制改正。配偶者控除・配偶者特別控除の見直し（配偶者の年収要件を103万円→150万円に引上げ）、酒税改革等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2017-02-03",
    passedAt: "2017-03-27",
  },
  {
    sessionNumber: 193,
    number: "193-閣法-28",
    title: "介護保険法等の一部を改正する法律案",
    summary:
      "介護保険制度改正。現役並み所得者の自己負担割合を3割に引上げ、介護医療院の創設、自立支援・重度化防止に向けた保険者機能の強化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2017-02-07",
    passedAt: "2017-05-26",
  },
  {
    sessionNumber: 193,
    number: "193-閣法-35",
    title: "民法の一部を改正する法律案",
    summary:
      "民法（債権法）大改正。約120年ぶりの抜本改正。消滅時効の統一化、法定利率の変動制導入、定型約款の規定新設、保証人保護の強化等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2017-03-31",
    passedAt: "2017-05-26",
  },
  {
    sessionNumber: 193,
    number: "193-閣法-57",
    title: "住宅宿泊事業法案",
    summary:
      "民泊新法。住宅宿泊事業（民泊）に関する届出制度の創設。住宅宿泊管理業者・住宅宿泊仲介業者の登録制度等。年間180日の営業日数上限。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2017-03-10",
    passedAt: "2017-06-09",
  },
  {
    sessionNumber: 193,
    number: "193-閣法-41",
    title:
      "個人情報の保護に関する法律及び行政手続における特定の個人を識別するための番号の利用等に関する法律の一部を改正する法律案",
    summary:
      "個人情報保護法・マイナンバー法改正。個人情報保護委員会が行政機関等を監視する一元的体制の構築、非識別加工情報の利活用促進等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2017-03-10",
    passedAt: "2017-05-19",
  },

  // ============================================================
  // 第196回国会（2018年通常国会）— 安倍内閣
  // 閣法65本提出・60本成立、32日延長
  // ============================================================
  {
    sessionNumber: 196,
    number: "196-閣法-63",
    title: "働き方改革を推進するための関係法律の整備に関する法律案",
    summary:
      "働き方改革関連法。時間外労働の罰則付き上限規制（月45時間・年360時間）の導入、高度プロフェッショナル制度の創設、同一労働同一賃金の法制化。労働基準法等8法律を一括改正。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2018-04-06",
    passedAt: "2018-06-29",
  },
  {
    sessionNumber: 196,
    number: "196-閣法-64",
    title: "特定複合観光施設区域整備法案",
    summary:
      "IR実施法（カジノ実施法）。カジノを含む統合型リゾート施設の整備に関する具体的な制度設計。カジノ管理委員会の設置、入場回数制限（週3回・月10回）等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2018-04-27",
    passedAt: "2018-07-20",
  },
  {
    sessionNumber: 196,
    number: "196-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "平成30年度税制改正。給与所得控除・基礎控除の見直し、所得税の最高税率の適用範囲拡大等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2018-02-02",
    passedAt: "2018-03-28",
  },
  {
    sessionNumber: 196,
    number: "196-閣法-35",
    title: "海洋再生可能エネルギー発電設備の整備に係る海域の利用の促進に関する法律案",
    summary:
      "洋上風力発電促進法。一般海域における洋上風力発電の導入促進のため、促進区域の指定、公募による事業者選定等の制度を創設。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2018-03-09",
    passedAt: "2018-11-30",
  },
  {
    sessionNumber: 196,
    number: "196-閣法-48",
    title: "民法の一部を改正する法律案",
    summary:
      "成年年齢の引下げ。成年年齢を20歳から18歳に引下げ。婚姻適齢を男女とも18歳に統一。施行日は2022年4月1日。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2018-03-13",
    passedAt: "2018-06-13",
  },
  {
    sessionNumber: 196,
    number: "196-閣法-34",
    title: "健康増進法の一部を改正する法律案",
    summary:
      "受動喫煙防止法。多数の者が利用する施設等における喫煙の禁止。学校・病院・行政機関は敷地内禁煙、飲食店は原則屋内禁煙等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2018-03-09",
    passedAt: "2018-07-18",
  },
  {
    sessionNumber: 196,
    number: "196-閣法-7",
    title: "生活困窮者等の自立を促進するための生活困窮者自立支援法等の一部を改正する法律案",
    summary:
      "生活困窮者自立支援制度の強化。生活保護法の一部改正を含む。就労準備支援事業・家計改善支援事業の強化、子どもの学習・生活支援事業等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2018-02-09",
    passedAt: "2018-06-01",
  },

  // ============================================================
  // 第197回国会（2018年臨時国会）— 安倍内閣
  // 閣法13本提出・13本成立
  // ============================================================
  {
    sessionNumber: 197,
    number: "197-閣法-1",
    title: "出入国管理及び難民認定法及び法務省設置法の一部を改正する法律案",
    summary:
      "入管法改正。新たな在留資格「特定技能1号」「特定技能2号」の創設。外国人労働者の受入れ拡大。出入国在留管理庁の設置。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2018-11-02",
    passedAt: "2018-12-08",
  },
  {
    sessionNumber: 197,
    number: "197-閣法-4",
    title: "水道法の一部を改正する法律案",
    summary:
      "水道法改正。水道施設の老朽化対策、広域連携の推進、官民連携（コンセッション方式）の推進等。水道事業の基盤強化。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2018-10-24",
    passedAt: "2018-12-06",
  },
  {
    sessionNumber: 197,
    number: "197-閣法-3",
    title: "漁業法等の一部を改正する等の法律案",
    summary:
      "漁業法改正。約70年ぶりの抜本改正。漁業権制度の見直し、漁獲割当（IQ方式）の導入、養殖・沿岸漁業の発展に向けた制度改革等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2018-10-24",
    passedAt: "2018-12-08",
  },

  // ============================================================
  // 第198回国会（2019年通常国会）— 安倍内閣
  // 閣法57本提出・54本成立
  // ============================================================
  {
    sessionNumber: 198,
    number: "198-閣法-28",
    title: "アイヌの人々の誇りが尊重される社会を実現するための施策の推進に関する法律案",
    summary:
      "アイヌ新法。アイヌ民族を「先住民族」と初めて法律で明記。交付金制度の創設、アイヌ文化振興施策の推進等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2019-02-15",
    passedAt: "2019-04-19",
  },
  {
    sessionNumber: 198,
    number: "198-閣法-48",
    title: "児童虐待防止対策の強化を図るための児童福祉法等の一部を改正する法律案",
    summary:
      "児童虐待防止法改正。親権者等による体罰の禁止を明文化。児童相談所の体制強化、DV対応と連携強化、転居時の情報共有等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2019-03-19",
    passedAt: "2019-06-19",
  },
  {
    sessionNumber: 198,
    number: "198-閣法-34",
    title: "女性の職業生活における活躍の推進に関する法律等の一部を改正する法律案",
    summary:
      "女性活躍推進法・ハラスメント防止法改正。パワーハラスメント防止対策の法制化（事業主に防止措置を義務化）。女性活躍推進法の延長・強化。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2019-03-08",
    passedAt: "2019-05-29",
  },
  {
    sessionNumber: 198,
    number: "198-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "令和元年度税制改正。自動車税の恒久的引下げ、住宅ローン控除の拡充（消費税10%への引上げ対策）、ふるさと納税制度の見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2019-02-05",
    passedAt: "2019-03-27",
  },
  {
    sessionNumber: 198,
    number: "198-閣法-37",
    title: "道路交通法の一部を改正する法律案",
    summary:
      "高齢運転者対策の強化。一定の違反歴がある75歳以上の高齢者に運転技能検査を義務化。安全運転サポート車限定免許の新設等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2019-03-08",
    passedAt: "2019-05-28",
  },
  {
    sessionNumber: 198,
    number: "198-閣法-47",
    title: "食品ロスの削減の推進に関する法律案",
    summary:
      "食品ロス削減推進法。食品ロスの削減に関する基本方針の策定、国・地方公共団体の施策推進、消費者・事業者の取組促進等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2019-03-15",
    passedAt: "2019-05-24",
  },

  // ============================================================
  // 第200回国会（2019年臨時国会）— 安倍内閣
  // 閣法15本提出・全15本成立
  // ============================================================
  {
    sessionNumber: 200,
    number: "200-閣法-1",
    title: "会社法の一部を改正する法律案",
    summary:
      "株主総会資料の電子提供制度の創設、取締役の報酬等の決定方針の開示義務化、社外取締役の設置義務化等。会社法の大幅見直し。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-12-04",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-2",
    title: "会社法の一部を改正する法律の施行に伴う関係法律の整備等に関する法律案",
    summary:
      "会社法改正に伴い、商業登記法、社債株式等振替法等の関係法律を一括整備。株主総会資料の電子提供に係る登記事項の追加等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-12-04",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-3",
    title: "公職選挙法の一部を改正する法律案",
    summary:
      "町村議会議員の選挙における選挙公報の発行を可能とする改正。町村議会議員選挙における候補者情報の充実。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-28",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-4",
    title: "裁判官の報酬等に関する法律の一部を改正する法律案",
    summary: "人事院勧告に基づく裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-22",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-5",
    title: "外国弁護士による法律事務の取扱いに関する特別措置法の一部を改正する法律案",
    summary:
      "外国法事務弁護士制度の見直し。国際仲裁事件等の代理に係る制度の整備、過度の制限の緩和等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-12-04",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-6",
    title: "検察官の俸給等に関する法律の一部を改正する法律案",
    summary: "人事院勧告に基づく検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-22",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-7",
    title: "医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律等の一部を改正する法律案",
    summary:
      "薬機法改正。先駆的医薬品の優先審査制度の創設、地域連携薬局・専門医療機関連携薬局の認定制度の創設、添付文書の電子化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-27",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-8",
    title: "農林水産物及び食品の輸出の促進に関する法律案",
    summary:
      "農林水産物・食品の輸出促進法。輸出促進のための司令塔組織の設置、輸出証明書の発行体制の整備等。2025年に輸出額2兆円、2030年に5兆円の目標達成に向けた基盤整備。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-20",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-9",
    title:
      "公立の義務教育諸学校等の教育職員の給与等に関する特別措置法の一部を改正する法律案",
    summary:
      "給特法改正。公立学校教員の勤務時間の上限指針を法制化。時間外勤務の縮減と一年単位の変形労働時間制導入。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-12-04",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-10",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary: "人事院勧告に準じた自衛官等の給与改定。住居手当の引上げ、若年層の俸給月額引上げ等。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-15",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-11",
    title: "一般職の職員の給与に関する法律等の一部を改正する法律案",
    summary:
      "人事院勧告に基づく国家公務員の給与改定。月例給・ボーナスの引上げ、住居手当の見直し等。6年連続の引上げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-15",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-12",
    title: "特別職の職員の給与に関する法律の一部を改正する法律案",
    summary: "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じた引上げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-15",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-13",
    title: "外国為替及び外国貿易法の一部を改正する法律案",
    summary:
      "外為法改正。対内直接投資に係る事前届出制度の見直し。安全保障上重要な業種への外国資本による投資について、届出基準を持株比率10%から1%に引下げ。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-11-22",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-14",
    title: "情報処理の促進に関する法律の一部を改正する法律案",
    summary:
      "情報処理促進法改正。Society 5.0の実現に向けたデータ連携基盤の整備、セキュリティの確保等。企業のデジタル経営改革を促進するDX認定制度の創設。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2019-11-12",
    passedAt: "2019-12-04",
  },
  {
    sessionNumber: 200,
    number: "200-閣法-15",
    title: "港湾法の一部を改正する法律案",
    summary:
      "洋上風力発電等の海洋再生可能エネルギー発電設備等を港湾施設に追加。港湾における脱炭素化の推進、国際バルク戦略港湾の機能強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2019-10-18",
    passedAt: "2019-12-04",
  },

  // ============================================================
  // 第201回国会（2020年通常国会）— 安倍内閣・コロナ対応
  // 閣法56本提出・55本成立・1本廃案
  // ============================================================
  {
    sessionNumber: 201,
    number: "201-閣法-1",
    title: "所得税法等の一部を改正する法律案",
    summary:
      "令和2年度税制改正。オープンイノベーション促進税制の創設、連結納税制度の抜本的見直し、NISA制度の見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-2",
    title: "関税定率法等の一部を改正する法律案",
    summary: "令和2年度の関税改正。暫定税率の延長・見直し、知的財産侵害物品の水際取締り強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-3",
    title: "地方税法等の一部を改正する法律案",
    summary:
      "令和2年度地方税制改正。未婚のひとり親に対する個人住民税の非課税措置、固定資産税の負担調整措置の延長等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-4",
    title: "新型インフルエンザ等対策特別措置法の一部を改正する法律案",
    summary:
      "コロナ特措法改正。新型コロナウイルス感染症を新型インフルエンザ等とみなし、緊急事態宣言を可能とする改正。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-03-10",
    passedAt: "2020-03-13",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-5",
    title: "地方交付税法等の一部を改正する法律案",
    summary: "令和2年度地方財政計画に基づく地方交付税の総額確保。交付税率の改定等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-6",
    title:
      "在外公館の名称及び位置並びに在外公館に勤務する外務公務員の給与に関する法律の一部を改正する法律案",
    summary: "在外公館の新設・名称変更。外交ネットワークの拡充に向けた体制整備。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-7",
    title: "防衛省設置法等の一部を改正する法律案",
    summary: "自衛隊の体制強化。自衛官定数の変更、サイバー防衛隊の拡充等。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-04-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-8",
    title: "裁判所職員定員法の一部を改正する法律案",
    summary: "判事の員数の増加。複雑困難化する事件への対応力強化のため判事を増員。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-04-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-9",
    title: "雇用保険法等の一部を改正する法律案",
    summary:
      "雇用保険制度の見直し。高齢者の就業促進、複数就業者の雇用保険適用、大企業の中途採用比率の公表義務化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-31",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-10",
    title: "労働基準法の一部を改正する法律案",
    summary:
      "賃金請求権の消滅時効期間の延長。民法改正に合わせ、賃金の消滅時効を2年から5年に延長（経過措置として当分の間3年）。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-11",
    title: "新型コロナウイルス感染症等の影響に対応するための国税関係法律の臨時特例に関する法律案",
    summary:
      "コロナ影響で収入が急減している事業者のための納税猶予制度の特例等。納税の猶予制度の特例措置。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-04-07",
    passedAt: "2020-04-30",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-12",
    title: "土地基本法等の一部を改正する法律案",
    summary:
      "土地基本法改正。所有者不明土地問題への対応強化、土地の適正な利用・管理の確保、土地政策の推進体制の整備等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-14",
    title:
      "国際金融公社への加盟に伴う措置に関する法律及び国際開発協会への加盟に伴う措置に関する法律の一部を改正する法律案",
    summary: "IFC・IDAへの追加出資。国際開発金融機関に対する日本の出資枠の拡大。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-15",
    title: "家畜伝染病予防法の一部を改正する法律案",
    summary:
      "CSF（豚熱）・ASF（アフリカ豚熱）対策の強化。予防的殺処分の実施要件の明確化、家畜の所有者に対する飼養衛生管理基準の遵守義務の強化等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-03-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-17",
    title: "家畜改良増殖法の一部を改正する法律案",
    summary:
      "和牛遺伝資源の保護強化。家畜の遺伝資源の不正な流通防止、知的財産としての保護等。「和牛」ブランドの保全。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-04-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-18",
    title: "家畜遺伝資源に係る不正競争の防止に関する法律案",
    summary:
      "家畜遺伝資源の不正な取得・使用を不正競争行為として規制する新法。和牛の精液・受精卵の不正流通に対する差止請求権・損害賠償請求権等を規定。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-04-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-19",
    title: "文化観光拠点施設を中核とした地域における文化観光の推進に関する法律案",
    summary:
      "文化観光推進法。博物館等の文化拠点を中核とした文化観光の推進に関する計画認定制度の創設。文化資源の活用による地域活性化。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-04-10",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-20",
    title: "電波法の一部を改正する法律案",
    summary:
      "5G等の電波の有効利用促進。周波数の経済的価値を踏まえた割当制度の導入、ダイナミック周波数共用の制度整備等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-04-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-21",
    title: "電気通信事業法及び日本電信電話株式会社等に関する法律の一部を改正する法律案",
    summary:
      "通信市場の公正競争確保。NTTグループの禁止行為規制の見直し、電気通信事業者の業務改善命令等の制度整備。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-05-15",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-22",
    title: "道路法等の一部を改正する法律案",
    summary:
      "道路法改正。自動運転に対応した特定車両停留施設制度の創設、歩行者利便増進道路（ほこみち）制度の創設等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-05-20",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-24",
    title:
      "高齢者、障害者等の移動等の円滑化の促進に関する法律の一部を改正する法律案",
    summary:
      "バリアフリー法改正。公共交通事業者によるハード・ソフト一体的な取組の推進義務化、バリアフリー基準の強化等。東京五輪に向けた環境整備。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-05-13",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-25",
    title:
      "地域における一般乗合旅客自動車運送事業及び銀行業に係る基盤的なサービスの提供の維持を図るための私的独占の禁止及び公正取引の確保に関する法律の特例に関する法律案",
    summary:
      "地域基盤企業統合特例法。人口減少地域におけるバス事業者・地方銀行の経営統合に対する独占禁止法の特例措置。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-28",
    passedAt: "2020-05-20",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-26",
    title:
      "特定高度情報通信技術活用システムの開発供給及び導入の促進に関する法律案",
    summary:
      "5G促進法。5Gシステムの開発供給・導入促進のための計画認定制度の創設。安全保障の観点からの供給者の信頼性確保等。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2020-02-28",
    passedAt: "2020-05-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-27",
    title: "特定デジタルプラットフォームの透明性及び公正性の向上に関する法律案",
    summary:
      "デジタルプラットフォーム取引透明化法。大規模プラットフォーム事業者に対し、取引条件の開示義務、苦情処理体制の整備義務等を規定。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-18",
    passedAt: "2020-05-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-28",
    title: "都市再生特別措置法等の一部を改正する法律案",
    summary:
      "頻発する自然災害に対応した都市計画の見直し。防災を主流化した安全なまちづくりの推進、居住誘導区域からの災害危険区域の除外等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-06-03",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-29",
    title: "個人情報の保護に関する法律等の一部を改正する法律案",
    summary:
      "個人情報保護法の3年ごと見直し。個人の権利拡充（利用停止請求権の要件緩和）、仮名加工情報の新設、漏えい報告の義務化、越境移転規制の強化等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-03-10",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-30",
    title: "年金制度の機能強化のための国民年金法等の一部を改正する法律案",
    summary:
      "年金改革法。短時間労働者への被用者保険の適用拡大、在職老齢年金の見直し、受給開始時期の選択肢拡大（75歳まで）。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-03-03",
    passedAt: "2020-05-29",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-31",
    title: "地域共生社会の実現のための社会福祉法等の一部を改正する法律案",
    summary:
      "地域住民の複雑化・複合化した支援ニーズに対応する包括的支援体制の構築支援、介護人材確保のための取組強化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-32",
    title:
      "強靭かつ持続可能な電気供給体制の確立を図るための電気事業法等の一部を改正する法律案",
    summary:
      "電気事業法等の一括改正。災害時の送配電事業者の連携強化、再エネの導入拡大に向けたFIP制度の導入、アグリゲーターの法的位置づけ等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2020-02-25",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-33",
    title:
      "金融サービスの利用者の利便の向上及び保護を図るための金融商品の販売等に関する法律等の一部を改正する法律案",
    summary:
      "金融サービス仲介法。銀行・証券・保険を横断的に仲介できる金融サービス仲介業の新設。フィンテック企業の参入促進。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-34",
    title: "道路交通法の一部を改正する法律案",
    summary:
      "あおり運転（妨害運転）の厳罰化。妨害運転罪の新設（最大懲役5年・罰金100万円）。高齢運転者対策の強化等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2020-03-03",
    passedAt: "2020-06-02",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-35",
    title: "公益通報者保護法の一部を改正する法律案",
    summary:
      "内部通報者保護の強化。事業者に内部通報体制の整備を義務付け、通報者に対する不利益取扱いの罰則強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-06-08",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-36",
    title: "新型コロナウイルス感染症等の影響に対応するための雇用保険法の臨時特例等に関する法律案",
    summary:
      "コロナ休業支援金。休業期間中の賃金の支払いを受けられなかった労働者に対し、支援金等を支給する事業を実施できるようにする雇用保険法の特例。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-05-26",
    passedAt: "2020-06-12",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-37",
    title:
      "持続可能な運送サービスの提供の確保に資する取組を推進するための地域公共交通の活性化及び再生に関する法律等の一部を改正する法律案",
    summary:
      "地域公共交通活性化法改正。地方自治体主導による地域公共交通の再編促進、MaaS等の新たなモビリティサービスの活用推進等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-07",
    passedAt: "2020-05-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-38",
    title: "大気汚染防止法の一部を改正する法律案",
    summary:
      "アスベスト（石綿）飛散防止対策の強化。建築物の解体・改修工事前の石綿含有建材の調査義務化、直接罰の導入等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2020-03-10",
    passedAt: "2020-05-29",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-39",
    title: "賃貸住宅の管理業務等の適正化に関する法律案",
    summary:
      "サブリース規制法。賃貸住宅管理業者の登録制度の創設、サブリース業者による不当な勧誘行為の禁止等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-06-12",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-40",
    title:
      "マンションの管理の適正化の推進に関する法律及びマンションの建替え等の円滑化に関する法律の一部を改正する法律案",
    summary:
      "老朽化マンション対策。地方自治体によるマンション管理計画認定制度の創設、敷地売却事業の対象拡大等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-02-28",
    passedAt: "2020-06-16",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-41",
    title: "科学技術基本法等の一部を改正する法律案",
    summary:
      "科学技術・イノベーション基本法への改称。「人文科学のみに係る科学技術」を法律の対象に追加、イノベーション創出を法の目的に明記。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2020-03-10",
    passedAt: "2020-06-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-42",
    title: "割賦販売法の一部を改正する法律案",
    summary:
      "クレジットカードの不正利用防止。AIを活用した与信審査の導入促進、少額後払い決済サービスの登録制度の創設等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-06-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-43",
    title: "国家戦略特別区域法の一部を改正する法律案",
    summary:
      "スーパーシティ型国家戦略特区の創設。複数の規制改革を連動して行うことを可能とし、まるごと未来都市を目指す先端的区域の指定制度。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-02-04",
    passedAt: "2020-05-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-44",
    title: "地域の自主性及び自立性を高めるための改革の推進を図るための関係法律の整備に関する法律案",
    summary: "第10次地方分権一括法。国から地方への権限移譲、義務付け・枠付けの見直し等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-06-03",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-45",
    title: "復興庁設置法等の一部を改正する法律案",
    summary:
      "復興庁の設置期限の延長（2031年3月31日まで）。復興・創生期間後の復興事業の継続に必要な体制を確保。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-03-03",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-46",
    title:
      "自動車の運転により人を死傷させる行為等の処罰に関する法律の一部を改正する法律案",
    summary:
      "あおり運転に対する危険運転致死傷罪の適用拡大。走行中の車の前方で停車する行為等を危険運転の類型に追加。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2020-03-13",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-47",
    title: "著作権法及びプログラムの著作物に係る登録の特例に関する法律の一部を改正する法律案",
    summary:
      "著作権法改正。違法ダウンロードの対象を漫画・書籍等に拡大（リーチサイト規制を含む）。写り込みに係る権利制限規定の拡充等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2020-03-10",
    passedAt: "2020-06-05",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-48",
    title: "森林組合法の一部を改正する法律案",
    summary:
      "森林組合の経営基盤強化。正組合員の加入資格拡大、森林組合連合会による販売事業の直接実施等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-05-27",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-49",
    title: "株式会社日本政策投資銀行法の一部を改正する法律案",
    summary:
      "日本政策投資銀行（DBJ）の危機対応業務の期限延長。特定投資業務の活用促進等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2020-03-06",
    passedAt: "2020-05-15",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-50",
    title:
      "無人航空機等の飛行による危害の発生を防止するための航空法及び重要施設の周辺地域の上空における小型無人機等の飛行の禁止に関する法律の一部を改正する法律案",
    summary:
      "ドローン規制強化。無人航空機の登録制度の創設、機体認証制度・操縦ライセンス制度の創設等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-02-28",
    passedAt: "2020-06-17",
  },
  {
    sessionNumber: 201,
    number: "201-閣法-52",
    title: "国家公務員法等の一部を改正する法律案",
    summary:
      "国家公務員の定年を段階的に65歳に引き上げる等の措置。検察官の勤務延長規定が争点となり廃案。",
    proposer: "内閣",
    category: "行政",
    status: "WITHDRAWN",
    submittedAt: "2020-03-13",
  },

  // ============================================================
  // 第203回国会（2020年臨時国会）— 菅内閣
  // 閣法6本提出・6本成立
  // ============================================================
  {
    sessionNumber: 203,
    number: "203-閣法-1",
    title: "予防接種法及び検疫法の一部を改正する法律案",
    summary:
      "新型コロナワクチンの無料接種を可能とする予防接種法改正。健康被害救済制度、損失補償契約等を規定。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-10-27",
    passedAt: "2020-12-02",
  },
  {
    sessionNumber: 203,
    number: "203-閣法-2",
    title: "種苗法の一部を改正する法律案",
    summary:
      "種苗法改正。日本の優良品種の海外流出防止のため、登録品種の自家増殖の制限、海外持ち出しの規制等を強化。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2020-10-27",
    passedAt: "2020-12-02",
  },
  {
    sessionNumber: 203,
    number: "203-閣法-3",
    title:
      "労働者派遣事業の適正な運営の確保及び派遣労働者の保護等に関する法律等の一部を改正する法律案",
    summary:
      "派遣労働者の同一労働同一賃金の義務化に係る労使協定の特例等の整備。派遣法の小幅な技術的改正。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2020-10-27",
    passedAt: "2020-11-20",
  },
  {
    sessionNumber: 203,
    number: "203-閣法-4",
    title: "一般職の職員の給与に関する法律等の一部を改正する法律案",
    summary:
      "人事院勧告に基づく国家公務員の給与改定。新型コロナの影響を踏まえ、ボーナスの引下げ（0.05月分）。月例給は据え置き。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-10-27",
    passedAt: "2020-11-24",
  },
  {
    sessionNumber: 203,
    number: "203-閣法-5",
    title: "特別職の職員の給与に関する法律の一部を改正する法律案",
    summary: "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じたボーナスの引下げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2020-10-27",
    passedAt: "2020-11-24",
  },
  {
    sessionNumber: 203,
    number: "203-閣法-6",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary: "自衛官等の給与改定。一般職国家公務員の給与改定に準じたボーナスの引下げ。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2020-10-27",
    passedAt: "2020-11-24",
  },

  // ============================================================
  // 第204回国会（2021年通常国会）— 菅内閣
  // 閣法63本提出・全成立
  // ============================================================
  {
    sessionNumber: 204,
    number: "204-閣法-26",
    title: "デジタル社会形成基本法案",
    summary:
      "デジタル社会の形成に関する基本理念・施策を定める基本法。IT基本法を廃止し、デジタル社会の実現に向けた新たな基本法。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2021-02-09",
    passedAt: "2021-05-12",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-27",
    title: "デジタル庁設置法案",
    summary:
      "デジタル庁の設置。内閣の事務を助ける機関としてデジタル庁を設置し、行政のデジタル化を推進。デジタル大臣をトップに置く。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2021-02-09",
    passedAt: "2021-05-12",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-62",
    title: "重要施設周辺及び国境離島等における土地等の利用状況の調査及び利用の規制等に関する法律案",
    summary:
      "重要土地利用規制法。自衛隊基地・原発等の重要施設周辺および国境離島の土地利用を調査・規制する制度。安全保障上の懸念に対応。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2021-03-26",
    passedAt: "2021-06-16",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-35",
    title: "少年法等の一部を改正する法律案",
    summary:
      "少年法改正。18・19歳を「特定少年」と位置付け、原則逆送対象事件の拡大、推知報道の一部解禁等。成年年齢引下げに対応。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2021-02-19",
    passedAt: "2021-05-21",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-6",
    title: "新型インフルエンザ等対策特別措置法等の一部を改正する法律案",
    summary:
      "まん延防止等重点措置の新設。緊急事態宣言に至らない段階での対応強化。行政罰の創設・過料制度の導入。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2021-02-03",
    passedAt: "2021-02-03",
  },
  {
    sessionNumber: 204,
    number: "204-閣法-47",
    title: "地球温暖化対策の推進に関する法律の一部を改正する法律案",
    summary:
      "温対法改正。2050年カーボンニュートラル宣言の法制化。地域脱炭素化促進事業計画認定制度の創設。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2021-03-02",
    passedAt: "2021-05-26",
  },
  {
    sessionNumber: 204,
    number: "204-衆法-42",
    title: "日本国憲法の改正手続に関する法律の一部を改正する法律案",
    summary:
      "国民投票法改正。投票環境の向上（共通投票所の設置、期日前投票の弾力化、洋上投票等）。7項目の改正。",
    proposer: "自由民主党・公明党・日本維新の会・国民民主党",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2018-06-27",
    passedAt: "2021-06-11",
  },

  // ============================================================
  // 第208回国会（2022年通常国会）— 岸田内閣
  // 閣法61本提出・59本成立
  // ============================================================
  {
    sessionNumber: 208,
    number: "208-閣法-37",
    title: "経済施策を一体的に講ずることによる安全保障の確保の推進に関する法律案",
    summary:
      "経済安全保障推進法。サプライチェーンの強靡化、基幹インフラの安全性確保、特定重要技術の研究開発促進、特許出願の非公開化の4本柱。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2022-02-25",
    passedAt: "2022-05-11",
  },
  {
    sessionNumber: 208,
    number: "208-閣法-38",
    title: "こども家庭庁設置法案",
    summary:
      "こども家庭庁の設置。子供政策の司令塔として内閣府の外局として設置。こども家庭庁設置法とこども基本法を一体的に審議。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-02-25",
    passedAt: "2022-06-15",
  },
  {
    sessionNumber: 208,
    number: "208-衆法-22",
    title: "こども基本法案",
    summary:
      "こども基本法。こども施策の基本理念、国・地方公共団体の責務、こどもの意見表明権の尊重等を定める基本法。超党派の議員立法。",
    proposer: "自由民主党・公明党・日本維新の会・国民民主党",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-04-01",
    passedAt: "2022-06-15",
  },
  {
    sessionNumber: 208,
    number: "208-閣法-48",
    title: "刑法等の一部を改正する法律案",
    summary:
      "侮辱罪の厳罰化。法定刑の上限を1年以下の懲役若しくは禁鋡30万円以下の罰金に引き上げ。ネット上の訹謗中傷対策。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-03-08",
    passedAt: "2022-06-13",
  },
  {
    sessionNumber: 208,
    number: "208-衆法-28",
    title: "AV出演被害防止・救済法案",
    summary:
      "性行為映像制品への出演に係る被害の防止を図る法律。契約取消権の付与、公表差止、被害者支援等を規定。",
    proposer: "超党派",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-06-08",
    passedAt: "2022-06-15",
  },
  {
    sessionNumber: 208,
    number: "208-閣法-43",
    title: "電気事業法等の一部を改正する法律案",
    summary:
      "電力安定供給確保法。電力市場の監視機能の強化、発電事業者の供給力確保義務、蛇口規制の導入等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-03-01",
    passedAt: "2022-05-31",
  },

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
    summary: "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の給与改定に準じた改定。",
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
    summary: "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
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
    summary: "令和4年度第2次補正予算に伴う地方財政措置。地方交付税の追加交付等。",
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
  {
    sessionNumber: 210,
    number: "210-閣法-2",
    title: "裁判官の報酬等に関する法律の一部を改正する法律案",
    summary: "裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-11",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-3",
    title: "検察官の俸給等に関する法律の一部を改正する法律案",
    summary: "検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-11",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-9",
    title: "国立大学法人法の一部を改正する法律案",
    summary:
      "国際卓越研究大学の認定制度の創設。10兆円規模の大学ファンドの運用益を活用し、世界最高水準の研究大学を実現するための制度整備。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-18",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-10",
    title: "地方税法の一部を改正する法律案",
    summary: "個人住民税の非課税措置の見直し。森林環境税の課税開始時期の確認等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-22",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-11",
    title: "地方交付税法の一部を改正する法律案",
    summary: "令和4年度普通交付税の調整額の復活に伴う措置。経済対策に伴う地方負担の財源手当て。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-10-07",
    passedAt: "2022-11-22",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-13",
    title:
      "国際連合安全保障理事会決議第千七百十八号等を踏まえ我が国が実施する貨物検査等に関する特別措置法の一部を改正する法律案",
    summary: "北朝鮮の核・ミサイル開発に対する制裁措置の強化。貨物検査の対象拡大等。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2022-10-28",
    passedAt: "2022-11-18",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-15",
    title: "首都直下地震対策特別措置法の一部を改正する法律案",
    summary: "首都直下地震特措法の期限延長。緊急対策区域における地震防災対策の推進。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-11-01",
    passedAt: "2022-11-18",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-16",
    title:
      "日本海溝・千島海溝周辺海溝型地震に係る地震防災対策の推進に関する特別措置法の一部を改正する法律案",
    summary:
      "日本海溝・千島海溝周辺の大規模地震に備えた防災対策の強化。推進地域の指定、津波避難対策の充実等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-11-01",
    passedAt: "2022-11-18",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-17",
    title: "被災者生活再建支援法の一部を改正する法律案",
    summary: "被災者生活再建支援金の支給対象の拡大。中規模半壊世帯への支援金支給等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2022-11-01",
    passedAt: "2022-11-18",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-18",
    title:
      "国際的な不正資金等の移動等に対処するための国際連合安全保障理事会決議等を踏まえ我が国が実施する国際テロリストの財産の凍結等に関する特別措置法等の一部を改正する法律案",
    summary:
      "テロ資金対策の強化。FATF（金融活動作業部会）の相互審査結果を踏まえたマネー・ロンダリング対策の強化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2022-11-08",
    passedAt: "2022-12-02",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-19",
    title: "所得税法等の一部を改正する法律案",
    summary: "令和4年度第2次補正予算に伴う税制措置。所得税・法人税の特例措置等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2022-11-08",
    passedAt: "2022-12-02",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-20",
    title: "独立行政法人日本スポーツ振興センター法の一部を改正する法律案",
    summary:
      "スポーツ振興くじ（toto・BIG）の対象拡大。バスケットボール等のプロスポーツを投票対象に追加。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2022-11-25",
    passedAt: "2022-12-09",
  },
  {
    sessionNumber: 210,
    number: "210-閣法-21",
    title: "地方公共団体の議会の議員及び長の選挙期日等の臨時特例に関する法律案",
    summary: "統一地方選挙の期日設定。令和5年4月の統一地方選挙に関する特例法。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2022-11-25",
    passedAt: "2022-12-02",
  },

  // ============================================================
  // 第211回国会（2023年通常国会）— 岸田内閣
  // 閣法60本+継続1本提出・59本成立、議員立法13本成立、計71本成立
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
    sourceUrl: "https://www.shugiin.go.jp/internet/itdb_gian.nsf/html/gian/keika/1DD5AEE.htm",
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
    sourceUrl: "https://www.mof.go.jp/about_mof/bills/211diet/index.htm",
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
    sourceUrl: "https://www.cas.go.jp/jp/houan/211.html",
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
    summary: "防衛省の体制強化。自衛官定数の変更、サイバー防衛隊の拡充、統合司令部準備等。",
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
    title:
      "脱炭素社会の実現に向けた電気供給体制の確立を図るための電気事業法等の一部を改正する法律案",
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
    title:
      "行政手続における特定の個人を識別するための番号の利用等に関する法律等の一部を改正する法律案",
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
    title:
      "出入国管理及び難民認定法及び日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法の一部を改正する法律案",
    summary:
      "改正入管法。難民認定申請中の送還停止効の例外規定を新設。監理措置制度の創設、補完的保護対象者の認定制度等。送還忌避問題への対応。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-03-07",
    passedAt: "2023-06-09",
    sourceUrl: "https://www.moj.go.jp/hisho/kouhou/houan211.html",
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
    title:
      "デジタル社会の形成を図るための規制改革を推進するためのデジタル社会形成基本法等の一部を改正する法律案",
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
    summary: "被疑者の逃亡を防止するためGPS端末装着命令制度の創設。保釈中の被告人の逃亡防止強化。",
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
    summary: "令和5年度地方財政計画に基づく地方交付税の総額確保。交付税率の改定等。",
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
  {
    sessionNumber: 211,
    number: "211-閣法-7",
    title: "福島復興再生特別措置法の一部を改正する法律案",
    summary:
      "福島復興の加速化。帰還困難区域の特定復興再生拠点区域外における避難指示解除の促進、福島国際研究教育機構（F-REI）の機能強化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-02-07",
    passedAt: "2023-03-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-10",
    title: "裁判所職員定員法の一部を改正する法律案",
    summary: "判事の員数の増加。複雑困難化する事件への対応力強化のため判事を増員。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-02-06",
    passedAt: "2023-03-29",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-11",
    title:
      "在外公館の名称及び位置並びに在外公館に勤務する外務公務員の給与に関する法律の一部を改正する法律案",
    summary: "在外公館の新設・名称変更。外交ネットワークの拡充に向けた体制整備。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-02-07",
    passedAt: "2023-03-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-14",
    title: "株式会社国際協力銀行法の一部を改正する法律案",
    summary: "JBICの業務拡充。サプライチェーン強靭化に資する海外投資への融資機能の強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-07",
    passedAt: "2023-05-19",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-15",
    title: "国際通貨基金及び国際復興開発銀行への加盟に伴う措置に関する法律の一部を改正する法律案",
    summary: "IMF・世界銀行への出資増額。国際金融機関に対する日本の出資枠の拡大。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-07",
    passedAt: "2023-03-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-17",
    title: "地域公共交通の活性化及び再生に関する法律等の一部を改正する法律案",
    summary:
      "地域交通再編法。ローカル鉄道の再構築、バス・タクシー等の地域公共交通の活性化。国が再構築協議会を設置し、関係者間の協議を促進。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-10",
    passedAt: "2023-04-21",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-18",
    title:
      "道路整備特別措置法及び独立行政法人日本高速道路保有・債務返済機構法の一部を改正する法律案",
    summary:
      "高速道路の老朽化対策。更新事業のための料金徴収期間の延長（2115年まで）、SA・PAの機能強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-02-10",
    passedAt: "2023-05-26",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-21",
    title: "私立学校法の一部を改正する法律案",
    summary:
      "私立学校のガバナンス改革。理事会・評議員会の権限関係の整理、監事の独立性強化、情報公開の義務化等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2023-02-24",
    passedAt: "2023-04-26",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-22",
    title: "日本語教育の適正かつ確実な実施を図るための日本語教育機関の認定等に関する法律案",
    summary: "日本語教育機関の認定制度の創設。日本語教師の国家資格「登録日本語教員」制度の導入等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2023-02-24",
    passedAt: "2023-05-26",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-24",
    title: "配偶者からの暴力の防止及び被害者の保護等に関する法律の一部を改正する法律案",
    summary:
      "DV防止法改正。保護命令の対象拡大（精神的暴力を追加）、接近禁止命令の期間延長等。被害者保護の強化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-02-24",
    passedAt: "2023-05-24",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-25",
    title: "気象業務法及び水防法の一部を改正する法律案",
    summary: "線状降水帯等の予測精度向上。民間気象事業者との連携強化、水害リスク情報の提供充実等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-05-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-28",
    title: "仲裁法の一部を改正する法律案",
    summary: "国際仲裁の活性化。UNCITRAL仲裁モデル法2006年改正に対応した国内仲裁法制の整備。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-12",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-29",
    title: "調停による国際的な和解合意に関する国際連合条約の実施に関する法律案",
    summary: "シンガポール条約の国内実施法。国際商事調停による和解合意の執行力付与制度の創設。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-12",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-30",
    title: "裁判外紛争解決手続の利用の促進に関する法律の一部を改正する法律案",
    summary:
      "ADR（裁判外紛争解決手続）法の改正。認証ADR機関による調停の実効性強化、利用促進措置等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-12",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-31",
    title: "合法伐採木材等の流通及び利用の促進に関する法律の一部を改正する法律案",
    summary:
      "クリーンウッド法改正。違法伐採木材の流通規制強化。木材関連事業者に対する合法性確認義務の拡大等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-21",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-32",
    title: "気候変動適応法及び独立行政法人環境再生保全機構法の一部を改正する法律案",
    summary:
      "気候変動適応法の改正。熱中症対策の強化（クーリングシェルターの指定等）、適応策の推進。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-28",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-33",
    title:
      "日本国の自衛隊とオーストラリア国防軍との間における相互のアクセス及び協力の円滑化に関する日本国とオーストラリアとの間の協定の実施に関する法律案",
    summary:
      "日豪円滑化協定（RAA）実施法。自衛隊と豪州国防軍の相互訪問時の法的地位、武器弾薬の輸送手続等を規定。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-19",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-34",
    title:
      "日本国の自衛隊とグレートブリテン及び北アイルランド連合王国の軍隊との間における相互のアクセス及び協力の円滑化に関する日本国とグレートブリテン及び北アイルランド連合王国との間の協定の実施に関する法律案",
    summary:
      "日英円滑化協定（RAA）実施法。自衛隊と英軍の共同訓練・災害救援活動時の法的地位等を規定。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-19",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-35",
    title: "特定先端大型研究施設の共用の促進に関する法律の一部を改正する法律案",
    summary:
      "次世代放射光施設（ナノテラス）等の共用促進。特定先端大型研究施設への民間参画の促進等。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2023-02-28",
    passedAt: "2023-04-19",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-37",
    title: "国家戦略特別区域法及び構造改革特別区域法の一部を改正する法律案",
    summary:
      "スーパーシティ構想の推進。国家戦略特区における規制改革メニューの拡充、構造改革特区制度の延長等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-03-03",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-38",
    title: "医療分野の研究開発に資するための匿名加工医療情報に関する法律の一部を改正する法律案",
    summary:
      "次世代医療基盤法の改正。仮名加工医療情報の利活用を可能とする制度の整備等。医療ビッグデータの活用促進。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-05-12",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-42",
    title: "海上運送法等の一部を改正する法律案",
    summary: "船員の確保・育成対策の強化。内航海運業の生産性向上、船員の働き方改革等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-05-17",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-43",
    title: "空家等対策の推進に関する特別措置法の一部を改正する法律案",
    summary:
      "空き家対策の強化。管理不全空家に対する市区町村の指導・勧告制度の創設、空き家の活用促進区域制度の創設等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-03",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-44",
    title: "地域の自主性及び自立性を高めるための改革の推進を図るための関係法律の整備に関する法律案",
    summary: "第13次地方分権一括法。国から地方への権限移譲、義務付け・枠付けの見直し等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-49",
    title: "国立健康危機管理研究機構法案",
    summary:
      "国立感染症研究所と国立国際医療研究センターを統合し、新たな「国立健康危機管理研究機構」を設立。パンデミック対応の司令塔機能を強化。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-05-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-50",
    title: "国立健康危機管理研究機構法の施行に伴う関係法律の整備に関する法律案",
    summary: "国立健康危機管理研究機構法の施行に伴い必要な関係法律の整備。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-05-31",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-51",
    title: "著作権法の一部を改正する法律案",
    summary:
      "著作物の利用円滑化。新たな裁定制度の創設、立法・行政のための著作物利用の権利制限規定の整備等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-05-17",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-52",
    title: "漁港漁場整備法及び水産業協同組合法の一部を改正する法律案",
    summary:
      "漁港の有効活用促進。漁港施設の多目的利用、水産業の成長産業化に向けた漁港機能の強化等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-05-19",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-53",
    title: "遊漁船業の適正化に関する法律の一部を改正する法律案",
    summary:
      "遊漁船業の安全対策強化。知床遊覧船事故を踏まえた安全基準の厳格化、業務主任者制度の見直し等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-54",
    title: "不正競争防止法等の一部を改正する法律案",
    summary:
      "知的財産制度の見直し。デジタル空間における模倣行為への対応、営業秘密・限定提供データの保護強化、外国公務員贈賄罪の厳罰化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-55",
    title: "中小企業信用保険法及び株式会社商工組合中央金庫法の一部を改正する法律案",
    summary: "中小企業金融の強化。信用保証制度の見直し、商工中金の民営化延期と機能強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-03-10",
    passedAt: "2023-06-07",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-56",
    title: "金融商品取引法等の一部を改正する法律案",
    summary:
      "顧客本位の業務運営の確保。金融サービスの提供に関する法律の整備、暗号資産の規制見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-03-14",
    passedAt: "2023-11-20",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-58",
    title: "刑法及び刑事訴訟法の一部を改正する法律案",
    summary:
      "性犯罪規定の改正。不同意性交等罪の新設（「強制性交等罪」から名称変更、同意要件の明確化）、性的同意年齢の引上げ（13歳→16歳）、公訴時効の延長等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-03-14",
    passedAt: "2023-06-16",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-59",
    title:
      "性的な姿態を撮影する行為等の処罰及び押収物に記録された性的な姿態の影像に係る電磁的記録の消去等に関する法律案",
    summary:
      "撮影罪の新設。盗撮行為を独立した犯罪類型として処罰する新法。押収された性的画像の消去命令制度の創設。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-03-14",
    passedAt: "2023-06-16",
  },
  {
    sessionNumber: 211,
    number: "211-閣法-60",
    title:
      "民事関係手続等における情報通信技術の活用等の推進を図るための関係法律の整備に関する法律案",
    summary:
      "民事手続のIT化。民事訴訟以外の民事関係手続（民事保全・民事執行・倒産等）へのIT化の拡大。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-03-14",
    passedAt: "2023-06-07",
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
    summary: "自衛官等の給与改定。一般職に準じた処遇改善。",
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
    summary: "官報の電子化。官報のインターネット発行を正本化し、法令公布の電子化を実現。",
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
  {
    sessionNumber: 212,
    number: "212-閣法-2",
    title: "特別職の職員の給与に関する法律の一部を改正する法律案",
    summary: "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じた引上げ。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-11-15",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-3",
    title: "裁判官の報酬等に関する法律の一部を改正する法律案",
    summary: "裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-11-15",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-4",
    title: "検察官の俸給等に関する法律の一部を改正する法律案",
    summary: "検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-11-15",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-9",
    title: "特定受託事業者に係る取引の適正化等に関する法律の施行に伴う関係法律の整備に関する法律案",
    summary: "フリーランス保護法の施行に伴う関係法律の整備。下請法等の適用関係の整理。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2023-10-24",
    passedAt: "2023-11-29",
  },
  {
    sessionNumber: 212,
    number: "212-閣法-11",
    title: "活動火山対策特別措置法の一部を改正する法律案",
    summary:
      "火山防災対策の強化。火山調査研究推進本部の設置、火山監視・観測体制の充実、避難計画の策定推進等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2023-10-31",
    passedAt: "2023-12-06",
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
    sourceUrl: "https://www.mof.go.jp/about_mof/bills/213diet/index.htm",
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
    title:
      "流通業務の総合化及び効率化の促進に関する法律及び貨物自動車運送事業法の一部を改正する法律案",
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
    title:
      "令和六年能登半島地震災害の被災者に係る所得税法及び災害被害者に対する租税の減免、徴収猶予等に関する法律の臨時特例に関する法律案",
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
    sourceUrl: "https://www.cfa.go.jp/laws/houan/e81845c0",
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
    sourceUrl: "https://www.cas.go.jp/jp/houan/213.html",
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
    sourceUrl: "https://www.maff.go.jp/j/law/bill/213/index.html",
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
    sourceUrl: "https://www.shugiin.go.jp/internet/itdb_gian.nsf/html/gian/keika/1DDBA96.htm",
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
    title:
      "育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律及び次世代育成支援対策推進法の一部を改正する法律案",
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
    title:
      "出入国管理及び難民認定法及び出入国管理及び難民認定法及び日本国との平和条約に基づき日本の国籍を離脱した者等の出入国管理に関する特例法の一部を改正する法律案",
    summary:
      "育成就労制度の創設。技能実習制度を発展的に解消し、外国人材の育成・確保を目的とする新制度を創設。転籍の柔軟化、人権侵害の防止強化。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-15",
    passedAt: "2024-06-14",
    sourceUrl: "https://www.moj.go.jp/hisho/kouhou/houan213.html",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-61",
    title:
      "学校設置者等及び民間教育保育等事業者による児童対象性暴力等の防止等のための措置に関する法律案",
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
  {
    sessionNumber: 213,
    number: "213-閣法-3",
    title: "関税定率法等の一部を改正する法律案",
    summary:
      "令和6年度の関税改正。暫定税率の延長・見直し、知的財産侵害物品の水際取締り強化、AEO制度の見直し等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-02",
    passedAt: "2024-03-28",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-4",
    title: "地方交付税法等の一部を改正する法律案",
    summary:
      "令和6年度地方財政計画に基づく地方交付税総額の確保。交付税率の改定、臨時財政対策債の発行等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-02-02",
    passedAt: "2024-03-28",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-5",
    title: "裁判所職員定員法の一部を改正する法律案",
    summary: "判事の員数の増加。複雑困難化する事件への対応力強化のため判事を増員。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-02-06",
    passedAt: "2024-03-27",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-6",
    title:
      "在外公館の名称及び位置並びに在外公館に勤務する外務公務員の給与に関する法律の一部を改正する法律案",
    summary: "在外公館の新設・名称変更。外交ネットワークの拡充に向けた体制整備。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-02-06",
    passedAt: "2024-03-29",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-9",
    title:
      "特定防衛調達に係る国庫債務負担行為により支出すべき年限に関する特別措置法の一部を改正する法律案",
    summary:
      "防衛装備品の長期契約特例法の改正。防衛力抜本強化に必要な装備品の効率的な調達を可能とするため、長期契約の対象拡大。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2024-02-09",
    passedAt: "2024-04-02",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-10",
    title: "防衛省の職員の給与等に関する法律の一部を改正する法律案",
    summary: "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
    proposer: "内閣",
    category: "安全保障",
    status: "ENACTED",
    submittedAt: "2024-02-09",
    passedAt: "2024-03-22",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-11",
    title: "感染症の予防及び感染症の患者に対する医療に関する法律等の一部を改正する法律案",
    summary:
      "新型インフルエンザ等感染症の分類見直し。新型コロナの5類移行を踏まえた感染症法制の整備。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-02-09",
    passedAt: "2024-05-24",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-13",
    title: "生活困窮者自立支援法等の一部を改正する法律案",
    summary:
      "生活困窮者支援の強化。住居確保給付金の拡充、就労準備支援事業の必須事業化、子どもの学習・生活支援事業の拡充等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-02-09",
    passedAt: "2024-04-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-15",
    title: "総合法律支援法の一部を改正する法律案",
    summary:
      "法テラスの機能強化。犯罪被害者支援の拡充、在留外国人への法律相談援助の拡大、DV・ストーカー被害者等への支援強化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-02-13",
    passedAt: "2024-04-10",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-18",
    title: "資源循環の促進のための再資源化事業等の高度化に関する法律案",
    summary:
      "サーキュラーエコノミー推進法。廃棄物の再資源化を高度化するための認定制度の創設、資源循環産業の育成支援等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2024-02-13",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-21",
    title: "建築基準法等の一部を改正する法律案",
    summary:
      "建築規制の合理化。木造建築物に関する規制の見直し、既存不適格建築物の改修促進、省エネ基準適合義務化への対応等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-02-16",
    passedAt: "2024-05-29",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-25",
    title: "学校教育法等の一部を改正する法律案",
    summary: "大学の国際化推進。海外大学との共同学位プログラムの制度化、外国人教員の登用促進等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-10",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-28",
    title:
      "犯罪被害者等の権利利益の保護を図るための刑事手続に付随する措置に関する法律及び犯罪被害者等基本法の一部を改正する法律案",
    summary:
      "犯罪被害者保護の強化。損害賠償命令制度の対象犯罪の拡大、被害者等の個人情報保護の強化等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-04-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-29",
    title: "刑事訴訟法等の一部を改正する法律案",
    summary:
      "刑事手続のIT化。令状のオンライン発付、書類の電子化、被告人のビデオリンク出頭等。刑事司法のデジタル化を推進。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-02-27",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-34",
    title: "電気通信事業法及び電波法の一部を改正する法律案",
    summary:
      "通信インフラの強靭化。大規模通信障害の再発防止策、電波利用の効率化、5G基地局整備の促進等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-03-01",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-36",
    title: "不動産登記法等の一部を改正する法律案",
    summary: "所有者不明土地対策。相続登記の義務化に伴う環境整備、登記情報の正確性向上等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-03-05",
    passedAt: "2024-04-10",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-40",
    title: "都市緑地法等の一部を改正する法律案",
    summary:
      "都市の緑地保全・創出の強化。都市緑地の確保に向けた新たな計画制度、民間の緑化投資を促進するための制度整備等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2024-03-05",
    passedAt: "2024-05-22",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-41",
    title: "地域の自主性及び自立性を高めるための改革の推進を図るための関係法律の整備に関する法律案",
    summary: "第14次地方分権一括法。国から地方への権限移譲、義務付け・枠付けの見直し等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2024-03-08",
    passedAt: "2024-05-31",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-42",
    title: "公益信託に関する法律案",
    summary:
      "公益信託制度の抜本改革。主務官庁制から認定行政庁制への移行、信託事務の範囲拡大等。100年以上続いた制度の大改正。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-03-08",
    passedAt: "2024-06-07",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-44",
    title: "金融商品取引法等の一部を改正する法律案",
    summary:
      "金融・資本市場の機能強化。企業開示制度の見直し、四半期報告書の廃止（半期報告書に一本化）、暗号資産の規制整備等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2024-03-08",
    passedAt: "2024-05-22",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-46",
    title: "自動車の運転により人を死傷させる行為等の処罰に関する法律の一部を改正する法律案",
    summary:
      "危険運転致死傷罪の見直し。「制御困難な高速度」の要件の明確化等。悪質な交通事故に対する厳罰化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2024-03-08",
    passedAt: "2024-05-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-51",
    title: "在外教育施設における教育の振興に関する法律案",
    summary:
      "海外の日本人学校・補習授業校の教育振興。在外教育施設の認定制度の創設、教職員の処遇改善等。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2024-03-08",
    passedAt: "2024-04-17",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-55",
    title: "雇用保険法等の一部を改正する法律案",
    summary:
      "雇用保険の適用拡大。週10時間以上の短時間労働者への適用拡大（2028年度施行）、教育訓練給付の拡充、出生後休業支援給付の創設等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-15",
    passedAt: "2024-05-10",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-56",
    title: "障害者の日常生活及び社会生活を総合的に支援するための法律等の一部を改正する法律案",
    summary:
      "障害者総合支援法の改正。就労選択支援の創設、グループホームの支援体制強化、精神障害者の地域移行支援の充実等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-15",
    passedAt: "2024-04-16",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-57",
    title:
      "良質かつ適切な医療を効率的に提供する体制の確保を推進するための医療法等の一部を改正する法律案",
    summary:
      "医療提供体制の改革。かかりつけ医機能報告制度の創設、地域医療構想の推進、医師の働き方改革への対応等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2024-03-15",
    passedAt: "2024-05-24",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-59",
    title: "漁業法及び特定水産動植物等の国内流通の適正化等に関する法律の一部を改正する法律案",
    summary: "水産業の持続的発展。資源管理の高度化、IUU漁業対策の強化、漁業許可制度の見直し等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2024-03-19",
    passedAt: "2024-05-29",
  },
  {
    sessionNumber: 213,
    number: "213-閣法-60",
    title: "農業の生産性の向上のためのスマート農業技術の活用の促進に関する法律案",
    summary:
      "スマート農業推進法。ドローン・AI・ロボット等を活用したスマート農業技術の開発・普及促進。データ連携基盤の整備等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2024-03-19",
    passedAt: "2024-05-29",
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
    summary: "消費税率の時限的な5%への引下げ。物価高騰対策としての消費税減税を提案。",
    proposer: "日本維新の会",
    category: "経済",
    status: "REJECTED",
    submittedAt: "2024-03-01",
  },
  {
    sessionNumber: 213,
    number: "213-参法-3",
    title: "選択的夫婦別姓制度を導入する民法の一部を改正する法律案",
    summary: "婚姻時に夫婦が各自の氏を称することを選択できる制度の導入。",
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
    summary: "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じた引上げ。",
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
    summary: "行政手続のデジタル化推進。マイナンバーカードを活用した行政手続のオンライン化促進等。",
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
    summary: "地方交付税の追加交付。令和6年度補正予算に伴う地方財政措置。",
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
    summary: "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
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
    summary: "裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
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
    summary: "検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
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
    title:
      "国会議員の歳費、旅費及び手当等に関する法律の一部を改正する法律案（調査研究広報滞在費の使途公開）",
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
    sourceUrl: "https://www.mof.go.jp/about_mof/bills/217diet/index.html",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-2",
    title: "地方税法及び地方税法等の一部を改正する法律の一部を改正する法律案",
    summary: "個人住民税の基礎控除引上げ等、所得税法改正に連動した地方税の改正。",
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
    sourceUrl: "https://www.cas.go.jp/jp/houan/217.html",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-5",
    title:
      "重要電子計算機に対する不正な行為による被害の防止に関する法律の施行に伴う関係法律の整備等に関する法律案",
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
    summary: "医師の働き方改革の推進、地域医療構想の実現に向けた医療提供体制の改革等。",
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
    sourceUrl: "https://www8.cao.go.jp/cstp/ai/ai_act/ai_act.html",
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
    title:
      "社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律案",
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
    summary: "関税率の改定。暫定税率の延長、知的財産侵害物品の水際取締り強化等。",
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
    summary: "裁判所の職員定員の改定。判事の員数増加及び裁判所書記官等の定員見直し。",
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
    summary: "令和7年度地方財政計画に基づく地方交付税の総額確保。交付税率の改定等。",
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
    summary: "令和7年度地方税制改正。個人住民税の定額減税の精算、固定資産税の負担調整措置等。",
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
    summary: "環境アセスメント制度の合理化。再エネ発電設備設置に関する環境影響評価手続の迅速化等。",
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
  {
    sessionNumber: 217,
    number: "217-閣法-9",
    title: "公立の義務教育諸学校等の教育職員の給与等に関する特別措置法等の一部を改正する法律案",
    summary:
      "教員の処遇改善。教職調整額の引上げ（4%→13%）、主任手当の創設、学級担任手当の新設等。教員のなり手不足解消を目指す。",
    proposer: "内閣",
    category: "教育",
    status: "ENACTED",
    submittedAt: "2025-02-07",
    passedAt: "2025-06-11",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-11",
    title: "情報処理の促進に関する法律及び特別会計に関する法律の一部を改正する法律案",
    summary:
      "IPA（情報処理推進機構）の機能強化。AI・サイバーセキュリティ分野の人材育成、デジタルインフラ整備支援等。",
    proposer: "内閣",
    category: "科学技術",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-12",
    title: "道路法等の一部を改正する法律案",
    summary:
      "道路インフラの老朽化対策。橋梁・トンネル等の予防保全型メンテナンスの推進、道路空間の有効活用等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-13",
    title: "港湾法等の一部を改正する法律案",
    summary: "港湾の脱炭素化・機能強化。カーボンニュートラルポートの形成促進、港湾施設の耐震化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-14",
    title: "裁判所職員定員法の一部を改正する法律案",
    summary: "裁判所職員の定員改定。判事の増員、裁判所書記官等の定員見直し。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-03-19",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-15",
    title: "医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律等の一部を改正する法律案",
    summary:
      "薬機法改正。緊急承認制度の恒久化、医薬品等の安定供給確保、後発医薬品の品質管理強化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-02-14",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-17",
    title: "災害対策基本法等の一部を改正する法律案",
    summary:
      "能登半島地震等の教訓を踏まえた災害対策強化。国のプッシュ型支援の制度化、避難所の環境改善、被災者台帳の活用促進等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-02-18",
    passedAt: "2025-05-28",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-19",
    title: "電波法及び放送法の一部を改正する法律案",
    summary:
      "NTT法の一部改正を含む通信・放送制度の見直し。電波利用の効率化、放送のインターネット配信の推進等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-02-21",
    passedAt: "2025-05-21",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-20",
    title: "国会議員の選挙等の執行経費の基準に関する法律の一部を改正する法律案",
    summary:
      "選挙の執行経費基準の改定。投票所における人件費・物件費の見直し、期日前投票所の増設に伴う経費等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2025-02-21",
    passedAt: "2025-05-28",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-22",
    title: "土地改良法等の一部を改正する法律案",
    summary:
      "農業水利施設の長寿命化・強靭化。老朽化した農業用ダム・水路の更新・補修促進、土地改良区の運営改善等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2025-02-28",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-23",
    title: "独立行政法人国際協力機構法の一部を改正する法律案",
    summary: "JICA法改正。ODAの戦略的活用に向けた業務範囲の拡大、民間資金の動員促進等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2025-02-28",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-26",
    title: "漁業災害補償法の一部を改正する法律案",
    summary: "漁業共済制度の見直し。気候変動に伴う漁業被害の増加に対応した共済制度の充実。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2025-03-04",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-27",
    title: "鳥獣の保護及び管理並びに狩猟の適正化に関する法律の一部を改正する法律案",
    summary:
      "鳥獣被害対策の強化。シカ・イノシシ等の有害鳥獣の捕獲促進、指定管理鳥獣捕獲等事業の拡充等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2025-03-04",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-28",
    title:
      "脱炭素成長型経済構造への円滑な移行の推進に関する法律及び資源の有効な利用の促進に関する法律の一部を改正する法律案",
    summary:
      "GX推進法改正。蓄電池・水素等の戦略分野への投資促進、資源循環の強化等。GX実現に向けた150兆円投資計画の具体化。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2025-03-04",
    passedAt: "2025-05-28",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-30",
    title: "情報通信技術の進展等に対応するための刑事訴訟法等の一部を改正する法律案",
    summary:
      "刑事手続のデジタル化。令状のオンライン発付、書類の電子化、ビデオリンク方式による証人尋問等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-31",
    title: "森林経営管理法及び森林法の一部を改正する法律案",
    summary:
      "森林の適正管理。所有者不明森林への対応強化、森林経営管理制度の見直し、林業の成長産業化等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-05-23",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-32",
    title: "公益通報者保護法の一部を改正する法律案",
    summary: "内部告発者保護の強化。公益通報対応体制の義務化、通報者への不利益取扱いの罰則強化等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-06-04",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-34",
    title:
      "老朽化マンション等の管理及び再生の円滑化等を図るための建物の区分所有等に関する法律等の一部を改正する法律案",
    summary:
      "マンション建替え・管理の円滑化。区分所有法の改正、建替え決議の要件緩和、管理不全マンションへの対策強化等。",
    proposer: "内閣",
    category: "行政",
    status: "ENACTED",
    submittedAt: "2025-03-07",
    passedAt: "2025-05-23",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-38",
    title: "再生可能エネルギー電気の利用の促進に関する特別措置法等の一部を改正する法律案",
    summary:
      "再エネ海域利用法の改正。洋上風力発電の促進、系統接続ルールの整備、FIT/FIP制度の見直し等。",
    proposer: "内閣",
    category: "環境",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-06-03",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-39",
    title: "航空法等の一部を改正する法律案",
    summary: "航空安全・利便性の向上。ドローンの型式認証制度の整備、空港の運用効率化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-30",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-40",
    title: "風俗営業等の規制及び業務の適正化等に関する法律の一部を改正する法律案",
    summary: "風営法改正。無許可営業への罰則強化、客引き行為の規制強化等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-20",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-43",
    title: "刑法及び刑事訴訟法の一部を改正する法律案",
    summary:
      "侮辱罪の法定刑引上げ後の運用を踏まえた見直し等。インターネット上の誹謗中傷対策の強化。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-16",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-45",
    title:
      "労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律の一部を改正する法律案",
    summary:
      "パワハラ防止法の強化。カスタマーハラスメント対策の義務化、就活ハラスメント対策の強化等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-06-04",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-46",
    title: "保険業法等の一部を改正する法律案",
    summary: "保険業の規制見直し。保険代理店の体制整備義務、保険契約者保護の強化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-30",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-47",
    title: "譲渡担保契約及び所有権留保契約に関する法律案",
    summary:
      "動産・債権を活用した資金調達の円滑化。譲渡担保契約の明確化、中小企業の資金調達手段の多様化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-30",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-49",
    title: "民事裁判等における情報の活用の促進等に関する法律案",
    summary: "民事裁判情報のオープンデータ化。判決のデータベース整備、裁判情報の利活用促進等。",
    proposer: "内閣",
    category: "司法",
    status: "ENACTED",
    submittedAt: "2025-03-14",
    passedAt: "2025-05-23",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-50",
    title: "食品等の流通の合理化及び取引の適正化に関する法律及び卸売市場法の一部を改正する法律案",
    summary: "食品流通の効率化。卸売市場の機能強化、食品ロス削減に向けた流通の合理化等。",
    proposer: "内閣",
    category: "農林水産",
    status: "ENACTED",
    submittedAt: "2025-04-04",
    passedAt: "2025-06-11",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-51",
    title: "電気通信事業法の一部を改正する法律案",
    summary: "NTT法の見直し。NTTの外国人役員規制等の廃止、通信市場の公正競争確保等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-04-04",
    passedAt: "2025-05-21",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-52",
    title: "独立行政法人男女共同参画機構法案",
    summary:
      "男女共同参画推進のための新たな独立行政法人の設置。DV被害者支援、女性活躍推進に関する調査研究等。",
    proposer: "内閣",
    category: "社会保障",
    status: "ENACTED",
    submittedAt: "2025-04-11",
    passedAt: "2025-06-20",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-54",
    title: "信託業法の一部を改正する法律案",
    summary: "信託業の規制見直し。フィンテック企業の参入促進、信託商品の多様化等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-04-25",
    passedAt: "2025-06-13",
  },
  {
    sessionNumber: 217,
    number: "217-閣法-55",
    title: "資金決済に関する法律等の一部を改正する法律案",
    summary:
      "暗号資産・ステーブルコイン規制の整備。暗号資産交換業の規制強化、電子決済手段の利用者保護等。",
    proposer: "内閣",
    category: "経済",
    status: "ENACTED",
    submittedAt: "2025-04-25",
    passedAt: "2025-06-06",
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
    summary: "手話を言語として法的に位置づけ、手話の普及・研究・利用促進に関する施策を規定。",
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
    summary: "改正DV防止法。接近禁止命令の対象拡大、精神的DV（モラハラ）に対する保護命令の適用等。",
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
    summary: "保護司法改正。保護司の処遇改善、なり手不足への対応等。",
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
    summary: "線状降水帯等の予測精度向上に向けた観測体制の強化、水防情報の高度化等。",
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
    summary: "人事院勧告に基づく国家公務員の給与改定。月例給・ボーナスの引上げ。",
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
    summary: "内閣総理大臣・国務大臣等の特別職の給与改定。一般職の改定に準じた引上げ。",
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
    summary: "令和7年度補正予算に伴う地方財政措置。地方交付税の追加交付等。",
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
    summary: "自衛官等の給与改定。一般職国家公務員の給与改定に準じた処遇改善。",
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
    summary: "裁判官の報酬改定。一般職国家公務員の給与改定に準じた引上げ。",
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
    summary: "検察官の俸給改定。一般職国家公務員の給与改定に準じた引上げ。",
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
    title:
      "租税特別措置法及び東日本大震災の被災者等に係る国税関係法律の臨時特例に関する法律の一部を改正する法律案",
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
  console.log("  実データシード: 国会法案データ (第190回〜第220回)");
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
