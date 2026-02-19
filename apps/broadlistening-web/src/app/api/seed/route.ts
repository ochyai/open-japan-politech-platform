export const dynamic = "force-dynamic";

import { jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";

const SEED_TOPICS = [
  {
    title: "少子化対策の優先施策について",
    description:
      "日本の合計特殊出生率が過去最低を更新する中、限られた財源で何を優先すべきか。児童手当の拡充、保育所整備、教育費無償化、働き方改革など、多角的に議論します。",
    opinions: [
      {
        content:
          "児童手当を月5万円に引き上げるべき。フランスの家族手当モデルが参考になる。経済的な安心感が出生率回復に直結する。",
        stance: "FOR",
        authorId: "citizen-1",
      },
      {
        content:
          "現金給付だけでは効果が薄い。保育所の待機児童ゼロ、病児保育の充実、男性育休取得率の向上が先決。",
        stance: "AGAINST",
        authorId: "citizen-2",
      },
      {
        content:
          "大学教育費の完全無償化が最も効果的。教育費への不安が2人目、3人目を諦める最大の理由。",
        stance: "FOR",
        authorId: "citizen-3",
      },
      {
        content:
          "少子化は個人の選択の結果であり、政府が介入すべきではない。むしろ移民政策の議論を進めるべき。",
        stance: "AGAINST",
        authorId: "citizen-4",
      },
      {
        content:
          "企業の働き方改革こそ本丸。残業規制の強化と、テレワーク・フレックスの義務化で、育児と仕事の両立を構造的に支援すべき。",
        stance: "NEUTRAL",
        authorId: "citizen-5",
      },
      {
        content:
          "地方自治体への子育て支援予算の大幅な権限移譲が必要。都市部と地方で必要な施策は大きく異なる。",
        stance: "FOR",
        authorId: "citizen-6",
      },
      {
        content:
          "AI・ロボット技術を活用した育児支援サービスを国が推進すべき。テクノロジーの力で育児の物理的負担を軽減する。",
        stance: "NEUTRAL",
        authorId: "citizen-7",
      },
      {
        content:
          "住宅政策との連携が不足。家族向け公営住宅の大幅拡充と、住宅ローン優遇措置の強化が、子育て環境の基盤となる。",
        stance: "FOR",
        authorId: "citizen-8",
      },
      {
        content:
          "北欧型の育休制度を導入すべき。父親に最低3ヶ月の育休を義務化し、取得しなければ権利が消滅する仕組みに。",
        stance: "FOR",
        authorId: "citizen-9",
      },
      {
        content:
          "出産費用の完全無償化は最低限必要。出産一時金の引き上げではなく、窓口負担をゼロにする制度設計を。",
        stance: "FOR",
        authorId: "citizen-10",
      },
      {
        content:
          "不妊治療への保険適用拡大をさらに進めるべき。年齢制限の緩和と、治療回数制限の撤廃が求められる。",
        stance: "FOR",
        authorId: "citizen-11",
      },
      {
        content:
          "子育て世帯の所得税を大幅減税すべき。第3子以降は所得税免除くらいの大胆な施策が必要。",
        stance: "FOR",
        authorId: "citizen-12",
      },
      {
        content:
          "問題は経済的支援ではなく社会の価値観。子どもを持つことへのプレッシャーや完璧主義的な育児観を変えることが先。",
        stance: "AGAINST",
        authorId: "citizen-13",
      },
      {
        content:
          "企業内保育所の設置義務化を。従業員100人以上の企業には必須とし、中小企業には補助金を出す。",
        stance: "FOR",
        authorId: "citizen-14",
      },
      {
        content:
          "晩婚化・非婚化が根本原因。若者の賃金を上げ、正規雇用を増やすことが少子化対策の本質。",
        stance: "NEUTRAL",
        authorId: "citizen-15",
      },
      {
        content:
          "少子化対策に年間10兆円規模の予算を投入すべき。防衛費と同等の予算を子育てに充てる発想が必要。",
        stance: "FOR",
        authorId: "citizen-16",
      },
      {
        content:
          "祖父母世代の育児参加を促す仕組みが必要。孫育て休暇制度の創設や、三世代近居への住宅補助など。",
        stance: "NEUTRAL",
        authorId: "citizen-17",
      },
      {
        content:
          "産後ケアセンターを各市区町村に設置義務化すべき。出産後の母親の孤立が育児放棄や虐待の温床になっている。",
        stance: "FOR",
        authorId: "citizen-18",
      },
      {
        content:
          "学校教育にライフプランニング教育を導入すべき。キャリアと家族形成の両立について早い段階から考える機会を。",
        stance: "NEUTRAL",
        authorId: "citizen-19",
      },
      {
        content: "子どもの医療費無償化を高校卒業まで全国統一で実施すべき。自治体間の格差が問題。",
        stance: "FOR",
        authorId: "citizen-20",
      },
      {
        content:
          "結局、出生率の低下は先進国共通の現象であり、日本だけの問題ではない。人口減少を前提とした社会設計に舵を切るべき。",
        stance: "AGAINST",
        authorId: "citizen-21",
      },
      {
        content:
          "里親・養子縁組制度の大幅な改革が必要。血縁にこだわらない家族のあり方を社会が受け入れるべき。",
        stance: "NEUTRAL",
        authorId: "citizen-22",
      },
      {
        content:
          "男女の賃金格差の解消が最優先。女性が経済的に自立できる社会でなければ、安心して子どもを産めない。",
        stance: "FOR",
        authorId: "citizen-23",
      },
      {
        content:
          "保育士の給与を一般企業並みに引き上げるべき。低賃金が人材不足の根本原因であり、待機児童問題に直結している。",
        stance: "FOR",
        authorId: "citizen-24",
      },
      {
        content:
          "妊娠・出産を理由としたマタニティハラスメントへの罰則を強化すべき。法律はあっても実効性が不足している。",
        stance: "FOR",
        authorId: "citizen-25",
      },
      {
        content:
          "多子世帯への奨学金返済免除制度を導入すべき。第2子で半額免除、第3子で全額免除にすれば、若者の出産意欲が高まる。",
        stance: "FOR",
        authorId: "citizen-26",
      },
      {
        content:
          "少子化対策の財源として高齢者医療費の自己負担を引き上げるのは世代間の分断を煽るだけ。安易な財源論は危険。",
        stance: "AGAINST",
        authorId: "citizen-27",
      },
      {
        content:
          "放課後の子どもの居場所づくりが急務。学童保育の質と量の充実なしに、共働き世帯は安心して子どもを持てない。",
        stance: "FOR",
        authorId: "citizen-28",
      },
      {
        content:
          "婚活支援に公費を投入するのは個人の自由への侵害。結婚しない選択も尊重される社会であるべき。",
        stance: "AGAINST",
        authorId: "citizen-29",
      },
      {
        content:
          "ベビーシッター利用の補助金制度を拡充すべき。一時保育の選択肢が増えれば、親の精神的負担が大幅に軽減される。",
        stance: "FOR",
        authorId: "citizen-30",
      },
      {
        content:
          "企業の育児支援実績を上場審査や公共入札の評価基準に組み込むべき。経済的インセンティブが企業行動を変える。",
        stance: "FOR",
        authorId: "citizen-31",
      },
      {
        content:
          "少子化対策はもう手遅れだ。今から出生率が回復しても労働力人口の回復は30年後。自動化・AI化で対応すべき。",
        stance: "AGAINST",
        authorId: "citizen-32",
      },
      {
        content:
          "夫婦別姓の実現が先決。姓を変えることへの抵抗が結婚のハードルになっている人は少なくない。",
        stance: "NEUTRAL",
        authorId: "citizen-33",
      },
      {
        content:
          "双子・多胎児世帯への特別支援を強化すべき。多胎育児の過酷さに対して、現行の支援は全く不十分。",
        stance: "FOR",
        authorId: "citizen-34",
      },
      {
        content:
          "通勤時間の長さが子育て世帯の最大の敵。職住近接を促す都市計画と企業誘致が少子化対策になる。",
        stance: "NEUTRAL",
        authorId: "citizen-35",
      },
      {
        content:
          "ひとり親世帯への支援を大幅に拡充すべき。養育費の立替払い制度と、就労支援の両輪が必要。",
        stance: "FOR",
        authorId: "citizen-36",
      },
      {
        content:
          "少子化を「国家の危機」として煽るのは問題。子どもを産むことを国に義務づけられるような空気は自由の侵害。",
        stance: "AGAINST",
        authorId: "citizen-37",
      },
      {
        content:
          "保育所のICT化を推進し、保育士の事務負担を軽減すべき。書類作成に追われて子どもと向き合えない現状を変える。",
        stance: "FOR",
        authorId: "citizen-38",
      },
      {
        content:
          "小児科・産婦人科医の偏在を解消すべき。地方では出産できる病院が年々減少しており、安心して産める環境がない。",
        stance: "FOR",
        authorId: "citizen-39",
      },
      {
        content:
          "子育てに関する情報があまりに多すぎて親が疲弊している。公的な信頼できる情報ポータルの整備が急務。",
        stance: "NEUTRAL",
        authorId: "citizen-40",
      },
    ],
  },
  {
    title: "AI規制のあり方 — イノベーションと安全性のバランス",
    description:
      "生成AIの急速な発展に対し、日本はどのような規制枠組みを構築すべきか。EUのAI Act型の包括規制か、日本型のソフトロー（ガイドライン）アプローチか。産業競争力と市民の安全の両立を議論します。",
    opinions: [
      {
        content:
          "EU型の包括的なリスクベース規制を早期に導入すべき。高リスクAI（医療、司法、採用）には事前審査を義務化する。",
        stance: "FOR",
        authorId: "citizen-41",
      },
      {
        content:
          "過度な規制はイノベーションを阻害する。日本はソフトロー（業界ガイドライン+自主規制）で柔軟に対応すべき。",
        stance: "AGAINST",
        authorId: "citizen-42",
      },
      {
        content:
          "AI開発者の説明責任（Accountability）を法制化すべき。ブラックボックスなAIによる意思決定は許容できない。",
        stance: "FOR",
        authorId: "citizen-43",
      },
      {
        content:
          "規制の前に、AI人材の育成と研究開発投資を優先すべき。規制ばかりでは日本のAI競争力が致命的に低下する。",
        stance: "AGAINST",
        authorId: "citizen-44",
      },
      {
        content:
          "セクター別の段階的規制が現実的。医療・金融・教育など影響の大きい分野から個別に規制を整備する。",
        stance: "NEUTRAL",
        authorId: "citizen-45",
      },
      {
        content:
          "AIが生成したコンテンツには必ず透かし（ウォーターマーク）を義務化すべき。ディープフェイク対策は喫緊の課題。",
        stance: "FOR",
        authorId: "citizen-46",
      },
      {
        content:
          "AIの学習データに使われた著作物の権利者への対価還元の仕組みを構築すべき。クリエイターの権利を守る。",
        stance: "FOR",
        authorId: "citizen-47",
      },
      {
        content:
          "AI規制は国際協調が不可欠。日本単独の規制は無意味。G7やOECDの枠組みで統一基準を作るべき。",
        stance: "NEUTRAL",
        authorId: "citizen-48",
      },
      {
        content:
          "AIによる雇用喪失への対策として、ベーシックインカムの検討を開始すべき。技術的失業は不可避。",
        stance: "FOR",
        authorId: "citizen-49",
      },
      {
        content:
          "教育現場でのAI利用ガイドラインを早急に策定すべき。レポートの自動生成が学習の本質を壊している。",
        stance: "FOR",
        authorId: "citizen-50",
      },
      {
        content:
          "AI開発のオープンソース化を推進すべき。透明性の確保と、少数企業への権力集中を防ぐために。",
        stance: "FOR",
        authorId: "citizen-51",
      },
      {
        content: "AIの軍事利用に関する国際条約を主導すべき。自律型致死兵器の禁止は人類共通の課題。",
        stance: "FOR",
        authorId: "citizen-52",
      },
      {
        content:
          "中小企業のAI導入を支援する公的プログラムが必要。大企業とのデジタル格差が拡大している。",
        stance: "NEUTRAL",
        authorId: "citizen-53",
      },
      {
        content:
          "個人データの利用に関して、オプトイン方式を徹底すべき。AIの学習に個人データが無断で使われる現状は問題。",
        stance: "FOR",
        authorId: "citizen-54",
      },
      {
        content:
          "AIの出力に対する法的責任の所在を明確にすべき。AIが誤った医療診断をした場合、誰が責任を取るのか。",
        stance: "FOR",
        authorId: "citizen-55",
      },
      {
        content:
          "規制サンドボックスを拡充し、スタートアップが規制を気にせずAI実験できる環境を作るべき。",
        stance: "AGAINST",
        authorId: "citizen-56",
      },
      {
        content:
          "AIリテラシー教育を義務教育に組み込むべき。AIの仕組みと限界を理解する市民を育てることが最大の安全保障。",
        stance: "NEUTRAL",
        authorId: "citizen-57",
      },
      {
        content:
          "AIによる選挙干渉への対策が急務。政治広告へのAI利用を規制し、有権者の判断を守るべき。",
        stance: "FOR",
        authorId: "citizen-58",
      },
      {
        content:
          "日本はAI規制ではなくAI活用で世界をリードすべき。規制に時間を費やすより、AIで社会課題を解決する方が生産的。",
        stance: "AGAINST",
        authorId: "citizen-59",
      },
      {
        content:
          "AI倫理委員会を内閣府に常設すべき。技術者、法学者、哲学者、市民代表が参加する独立組織として。",
        stance: "FOR",
        authorId: "citizen-60",
      },
      {
        content:
          "AIの環境負荷を考慮すべき。大規模言語モデルの訓練に必要な電力消費量は看過できないレベルに達している。",
        stance: "NEUTRAL",
        authorId: "citizen-61",
      },
      {
        content:
          "顔認識AIの公共空間での使用を厳しく制限すべき。監視社会化のリスクは民主主義の根幹に関わる。",
        stance: "FOR",
        authorId: "citizen-62",
      },
      {
        content: "AI開発における多様性の確保が重要。開発チームの偏りがAIのバイアスに直結する。",
        stance: "NEUTRAL",
        authorId: "citizen-63",
      },
      {
        content:
          "AI規制は技術の進化速度に追いつけない。原則ベースの規制にして、具体的な適用は行政裁量に委ねるべき。",
        stance: "NEUTRAL",
        authorId: "citizen-64",
      },
      {
        content:
          "AIによるプロファイリングを規制すべき。信用スコアリングや行動予測が個人の自由と平等を脅かしている。",
        stance: "FOR",
        authorId: "citizen-65",
      },
      {
        content:
          "日本のAI規制は米中の動向を見極めてからでも遅くない。拙速な規制は国際競争力を失わせる。",
        stance: "AGAINST",
        authorId: "citizen-66",
      },
      {
        content:
          "AIの判断による差別（アルゴリズムバイアス）を禁止する法律が必要。採用・融資・保険でのAI利用に公平性監査を義務化すべき。",
        stance: "FOR",
        authorId: "citizen-67",
      },
      {
        content:
          "生成AIによるフェイクニュースの拡散は民主主義への直接的脅威。プラットフォーム企業に検出・削除義務を課すべき。",
        stance: "FOR",
        authorId: "citizen-68",
      },
      {
        content:
          "AI規制よりもAI保険制度の整備を優先すべき。AIが引き起こした損害を補償する仕組みがあれば、過度な事前規制は不要。",
        stance: "AGAINST",
        authorId: "citizen-69",
      },
      {
        content:
          "公共調達におけるAI利用基準を策定すべき。政府が使うAIこそ最も厳格な透明性と説明責任が求められる。",
        stance: "FOR",
        authorId: "citizen-70",
      },
      {
        content:
          "AIが創作した作品の著作権帰属を明確にすべき。現行著作権法はAI時代に対応できていない。",
        stance: "NEUTRAL",
        authorId: "citizen-71",
      },
      {
        content:
          "自動運転AIの事故責任ルールを早急に整備すべき。技術は進んでいるのに法制度が追いついていない。",
        stance: "FOR",
        authorId: "citizen-72",
      },
      {
        content:
          "AIの「人格権」に関する議論を始めるべき。高度なAIが意識を持つ可能性を完全には否定できない。",
        stance: "NEUTRAL",
        authorId: "citizen-73",
      },
      {
        content:
          "医療分野のAI活用は規制ではなく推進すべき。画像診断AIは既に人間の医師を上回る精度を示しており、導入の遅れは命に関わる。",
        stance: "AGAINST",
        authorId: "citizen-74",
      },
      {
        content:
          "AI開発企業にアルゴリズム監査を義務化し、第三者機関による定期検査を実施すべき。自主規制では不十分。",
        stance: "FOR",
        authorId: "citizen-75",
      },
      {
        content:
          "子どもに対するAIの影響を特別に規制すべき。AIチャットボットへの依存や、レコメンドアルゴリズムによる有害コンテンツ露出を防ぐ。",
        stance: "FOR",
        authorId: "citizen-76",
      },
      {
        content:
          "日本語LLMの開発を国策として支援すべき。海外製AIへの依存は言語主権・文化主権の問題。",
        stance: "NEUTRAL",
        authorId: "citizen-77",
      },
      {
        content:
          "AI規制の議論にAI開発者だけでなく、影響を受ける当事者（労働者、障害者、マイノリティ）の声を反映すべき。",
        stance: "NEUTRAL",
        authorId: "citizen-78",
      },
      {
        content:
          "企業がAIを使って従業員を監視することを制限すべき。キーストローク記録や感情分析は労働者の尊厳を侵害する。",
        stance: "FOR",
        authorId: "citizen-79",
      },
      {
        content:
          "規制強化は日本のAIスタートアップを殺す。シンガポールやUAEのような規制の緩い国に人材が流出するだけ。",
        stance: "AGAINST",
        authorId: "citizen-80",
      },
    ],
  },
  {
    title: "エネルギー政策 — 原発再稼働と再生可能エネルギー",
    description:
      "2050年カーボンニュートラル達成に向けた日本のエネルギーミックスについて。原子力発電の再稼働・新増設と、再生可能エネルギーの大量導入のバランスをどう取るか。",
    opinions: [
      {
        content:
          "安全基準を満たした原発の再稼働は不可避。再エネだけでは安定供給とカーボンニュートラルの両立は不可能。",
        stance: "FOR",
        authorId: "citizen-81",
      },
      {
        content:
          "福島の教訓を忘れてはならない。原発ゼロを目指し、再エネ100%へのロードマップを策定すべき。",
        stance: "AGAINST",
        authorId: "citizen-82",
      },
      {
        content:
          "洋上風力発電のポテンシャルは巨大。日本の排他的経済水域を活用した大規模開発を国策として推進すべき。",
        stance: "FOR",
        authorId: "citizen-83",
      },
      {
        content:
          "蓄電池技術（全固体電池など）の開発加速が鍵。再エネの間欠性問題を解決しないと大量導入は困難。",
        stance: "NEUTRAL",
        authorId: "citizen-84",
      },
      {
        content:
          "核融合発電の実用化を国家プロジェクトとして加速すべき。2040年代の商用化を目標に研究開発投資を倍増する。",
        stance: "NEUTRAL",
        authorId: "citizen-85",
      },
      {
        content:
          "送電網のスマートグリッド化を最優先で進めるべき。分散型電源を活かすにはインフラの根本的な更新が必要。",
        stance: "FOR",
        authorId: "citizen-86",
      },
      {
        content:
          "原発の新増設は経済的にも非合理。建設費の高騰と工期の遅延を考えれば、再エネ+蓄電池の方がコスト優位。",
        stance: "AGAINST",
        authorId: "citizen-87",
      },
      {
        content:
          "水素エネルギーの社会実装を加速すべき。再エネの余剰電力でグリーン水素を製造し、産業用途に活用する。",
        stance: "FOR",
        authorId: "citizen-88",
      },
      {
        content:
          "電力自由化をさらに推進し、新電力の参入を促すべき。競争原理がイノベーションと低価格化をもたらす。",
        stance: "FOR",
        authorId: "citizen-89",
      },
      {
        content:
          "地熱発電の開発規制を緩和すべき。火山国日本のポテンシャルを活かしきれていない。温泉事業者との共存も可能。",
        stance: "FOR",
        authorId: "citizen-90",
      },
      {
        content:
          "原発の使用済み核燃料の最終処分問題が未解決のまま再稼働を進めるのは無責任。まず処分場を決めるべき。",
        stance: "AGAINST",
        authorId: "citizen-91",
      },
      {
        content:
          "カーボンプライシング（炭素税）を導入し、化石燃料の外部コストを内部化すべき。再エネへの移行が自然と進む。",
        stance: "FOR",
        authorId: "citizen-92",
      },
      {
        content:
          "省エネ技術への投資を倍増すべき。エネルギー消費量自体を減らすことが最もコスト効率が高い。",
        stance: "NEUTRAL",
        authorId: "citizen-93",
      },
      {
        content:
          "離島や過疎地域こそ再エネによるエネルギー自給を進めるべき。地域の経済自立にもつながる。",
        stance: "FOR",
        authorId: "citizen-94",
      },
      {
        content:
          "原発は安全保障上も重要。エネルギー供給源の多様化は地政学リスクへの対策として不可欠。",
        stance: "FOR",
        authorId: "citizen-95",
      },
      {
        content:
          "太陽光パネルの廃棄問題に今から対策を講じるべき。2030年代に大量廃棄が始まる。リサイクル義務化を。",
        stance: "NEUTRAL",
        authorId: "citizen-96",
      },
      {
        content:
          "小型モジュール炉（SMR）の開発に投資すべき。従来型原発のリスクを大幅に低減できる次世代技術。",
        stance: "FOR",
        authorId: "citizen-97",
      },
      {
        content:
          "メタンハイドレートの商業化研究を継続すべき。日本近海の埋蔵量は膨大で、エネルギー安全保障の切り札になる。",
        stance: "NEUTRAL",
        authorId: "citizen-98",
      },
      {
        content:
          "電力消費のピークシフトを促すダイナミックプライシングを全面導入すべき。需給調整が再エネ大量導入の前提条件。",
        stance: "FOR",
        authorId: "citizen-99",
      },
      {
        content:
          "建物の断熱基準を欧州並みに引き上げるべき。住宅・ビルのエネルギー効率改善は即効性のある温暖化対策。",
        stance: "FOR",
        authorId: "citizen-100",
      },
      {
        content:
          "ペロブスカイト太陽電池の実用化を国策として推進すべき。軽量・柔軟で、ビルの壁面にも設置可能な日本発の技術。",
        stance: "FOR",
        authorId: "citizen-101",
      },
      {
        content:
          "原発の運転延長（60年超）は老朽化リスクが高すぎる。新設よりも延長の方が危険な場合がある。",
        stance: "AGAINST",
        authorId: "citizen-102",
      },
      {
        content:
          "バイオマス発電をもっと活用すべき。林業と連携し、間伐材を燃料にすれば山林の荒廃対策にもなる。",
        stance: "FOR",
        authorId: "citizen-103",
      },
      {
        content:
          "電気自動車（EV）の普及を加速し、V2H（Vehicle to Home）で家庭の蓄電池として活用する仕組みを整備すべき。",
        stance: "FOR",
        authorId: "citizen-104",
      },
      {
        content:
          "原発立地自治体の経済的依存構造を変えるべき。交付金に頼らない地域経済モデルへの移行支援が必要。",
        stance: "NEUTRAL",
        authorId: "citizen-105",
      },
      {
        content:
          "LNG火力発電を過渡期の主力電源として維持すべき。再エネ100%は理想だが、現実の安定供給を無視してはならない。",
        stance: "NEUTRAL",
        authorId: "citizen-106",
      },
      {
        content:
          "農地でのソーラーシェアリング（営農型太陽光発電）を推進すべき。農業とエネルギー生産の両立で農家の収入も安定する。",
        stance: "FOR",
        authorId: "citizen-107",
      },
      {
        content:
          "再エネの固定価格買取制度（FIT）は国民負担が大きすぎる。市場原理に委ねる形にシフトすべき。",
        stance: "AGAINST",
        authorId: "citizen-108",
      },
      {
        content:
          "アンモニア混焼による石炭火力のCO2削減は過渡的技術としては有効。即座に全廃するのは非現実的。",
        stance: "NEUTRAL",
        authorId: "citizen-109",
      },
      {
        content:
          "CCS（二酸化炭素回収・貯留）技術への投資を増やすべき。排出ゼロが難しい産業分野のために必要な技術。",
        stance: "NEUTRAL",
        authorId: "citizen-110",
      },
      {
        content:
          "自然公園内でのメガソーラー建設は景観破壊であり規制すべき。再エネ推進と環境保全は両立させねばならない。",
        stance: "AGAINST",
        authorId: "citizen-111",
      },
      {
        content:
          "エネルギー安全保障の観点から、化石燃料の中東依存度を下げるべき。再エネは国産エネルギーであり安全保障そのもの。",
        stance: "FOR",
        authorId: "citizen-112",
      },
      {
        content:
          "潮力発電・波力発電の研究開発をもっと支援すべき。四方を海に囲まれた日本の地理的優位を活かせていない。",
        stance: "FOR",
        authorId: "citizen-113",
      },
      {
        content:
          "原発避難計画の実効性が担保されていない。半径30km圏内の住民が安全に避難できる計画なしに再稼働は認められない。",
        stance: "AGAINST",
        authorId: "citizen-114",
      },
      {
        content:
          "家庭用太陽光パネルと蓄電池のセット導入に大幅な補助金を出すべき。エネルギーの地産地消を個人レベルで実現する。",
        stance: "FOR",
        authorId: "citizen-115",
      },
      {
        content:
          "電力会社の発送電分離を徹底すべき。送電網を公共インフラとして開放しなければ、再エネ事業者の公平な競争は実現しない。",
        stance: "FOR",
        authorId: "citizen-116",
      },
      {
        content:
          "エネルギーミックスは一つの技術に偏るべきではない。原発・再エネ・火力のバランスが安定供給の鍵。",
        stance: "NEUTRAL",
        authorId: "citizen-117",
      },
      {
        content:
          "企業のRE100（再エネ100%）宣言を後押しする制度設計が必要。グリーン電力証書の市場を拡大すべき。",
        stance: "FOR",
        authorId: "citizen-118",
      },
      {
        content:
          "原発は核拡散リスクの観点からも問題。プルトニウムの大量保有は国際社会からの懸念材料になっている。",
        stance: "AGAINST",
        authorId: "citizen-119",
      },
      {
        content:
          "エネルギー政策は50年単位で考えるべき。短期的なコスト比較だけでなく、廃炉費用や廃棄物管理のライフサイクルコストで判断すべき。",
        stance: "NEUTRAL",
        authorId: "citizen-120",
      },
    ],
  },
  {
    title: "デジタル民主主義の未来 — テクノロジーと市民参加",
    description:
      "テクノロジーは民主主義をどう変えるか。オンライン投票、AI熟議、ブロックチェーン投票、市民参加プラットフォームなど、デジタル時代の民主主義のあり方を議論します。",
    opinions: [
      {
        content:
          "オンライン投票を早期に実現すべき。投票率の低下は民主主義の危機。スマホで投票できれば若者の政治参加が劇的に増える。",
        stance: "FOR",
        authorId: "citizen-121",
      },
      {
        content:
          "オンライン投票はセキュリティリスクが高すぎる。秘密投票の原則を技術的に担保できるまで導入すべきでない。",
        stance: "AGAINST",
        authorId: "citizen-122",
      },
      {
        content:
          "BroadListeningのような市民熟議プラットフォームを地方自治体に標準導入すべき。パブリックコメントの進化系として。",
        stance: "FOR",
        authorId: "citizen-123",
      },
      {
        content:
          "AIによる政策シミュレーションを公開すべき。政策Aを採用した場合の10年後の社会の姿をAIが予測し、市民が議論する。",
        stance: "FOR",
        authorId: "citizen-124",
      },
      {
        content:
          "デジタル民主主義以前に、既存の民主主義の仕組みを改善すべき。投票日の休日化、選挙運動のルール改正が先。",
        stance: "AGAINST",
        authorId: "citizen-125",
      },
      {
        content:
          "ブロックチェーンによる透明な投票システムの実験を始めるべき。改ざん不可能な投票記録は民主主義の信頼性を高める。",
        stance: "FOR",
        authorId: "citizen-126",
      },
      {
        content:
          "デジタルデバイドの解消が前提条件。高齢者やデジタル弱者が排除される民主主義は真の民主主義ではない。",
        stance: "NEUTRAL",
        authorId: "citizen-127",
      },
      {
        content:
          "市民陪審（Citizens' Assembly）をデジタルプラットフォーム上で常設すべき。無作為抽出された市民がオンラインで政策審議する。",
        stance: "FOR",
        authorId: "citizen-128",
      },
      {
        content:
          "SNSのアルゴリズムが分断を助長している。政治的対話の場として設計されたプラットフォームが必要。",
        stance: "NEUTRAL",
        authorId: "citizen-129",
      },
      {
        content:
          "AIを使った「デジタルツイン市民」で政策の影響をシミュレーションする構想は面白いが、倫理的検討が不十分。",
        stance: "NEUTRAL",
        authorId: "citizen-130",
      },
      {
        content:
          "議会のリアルタイム配信と、AIによる要約・翻訳を標準化すべき。国会の議論を誰もが理解できる形にする。",
        stance: "FOR",
        authorId: "citizen-131",
      },
      {
        content:
          "地方議会にLiquid Democracy（委任投票）の実験を導入すべき。直接民主主義と代議制の良いとこ取り。",
        stance: "FOR",
        authorId: "citizen-132",
      },
      {
        content:
          "政治家のファクトチェックをAIでリアルタイム実施し、発言の信頼性スコアを公開すべき。",
        stance: "FOR",
        authorId: "citizen-133",
      },
      {
        content:
          "デジタル民主主義は結局、声の大きい人が支配する。匿名性の確保と、少数意見の保護メカニズムが不可欠。",
        stance: "NEUTRAL",
        authorId: "citizen-134",
      },
      {
        content:
          "マイナンバーカードをデジタル民主主義のインフラとして活用すべき。本人認証問題が解決する。",
        stance: "FOR",
        authorId: "citizen-135",
      },
      {
        content:
          "テクノロジーへの過度な依存は危険。停電やサイバー攻撃で民主主義が機能停止するリスクを考慮すべき。",
        stance: "AGAINST",
        authorId: "citizen-136",
      },
      {
        content:
          "公的なオープンデータの充実が先決。データに基づいた市民の議論なしに、デジタル投票だけ進めても意味がない。",
        stance: "NEUTRAL",
        authorId: "citizen-137",
      },
      {
        content:
          "若者専用の政策提案プラットフォームを作るべき。18歳選挙権だけでは不十分。15歳から政策提案できる仕組みを。",
        stance: "FOR",
        authorId: "citizen-138",
      },
      {
        content:
          "台湾のvTaiwan/Join.govのモデルを日本に導入すべき。市民参加型の規制策定プロセスは実績がある。",
        stance: "FOR",
        authorId: "citizen-139",
      },
      {
        content:
          "AI熟議（Habermas Machine的アプローチ）は、多数派の意見を強化するだけ。少数派の権利保護には人間の判断が必要。",
        stance: "AGAINST",
        authorId: "citizen-140",
      },
      {
        content:
          "請願制度をデジタル化し、一定数の電子署名が集まれば国会で審議を義務化すべき。英国のペティション制度が参考になる。",
        stance: "FOR",
        authorId: "citizen-141",
      },
      {
        content:
          "選挙公報をインタラクティブ化すべき。候補者のAIアバターに政策質問できるプラットフォームで、有権者の理解が深まる。",
        stance: "FOR",
        authorId: "citizen-142",
      },
      {
        content:
          "デジタル民主主義の実験は地方自治体から始めるべき。国政でいきなり導入するのはリスクが大きすぎる。",
        stance: "NEUTRAL",
        authorId: "citizen-143",
      },
      {
        content:
          "ポピュリズムを加速させるリスクがある。テクノロジーが感情的な政策決定を助長しないよう、熟議の設計が重要。",
        stance: "AGAINST",
        authorId: "citizen-144",
      },
      {
        content:
          "政党のマニフェストをオープンデータとして標準化し、AI比較ツールで有権者が政策を横断的に比較できるようにすべき。",
        stance: "FOR",
        authorId: "citizen-145",
      },
      {
        content:
          "直接民主主義的な仕組みは衆愚政治を招く。代議制民主主義を補完するツールとして位置づけるべき。",
        stance: "NEUTRAL",
        authorId: "citizen-146",
      },
      {
        content:
          "予算配分への市民参加（参加型予算）をデジタルプラットフォームで全国展開すべき。パリやソウルの事例が参考になる。",
        stance: "FOR",
        authorId: "citizen-147",
      },
      {
        content:
          "政治資金の透明化にブロックチェーンを活用すべき。全ての献金と支出をリアルタイムで公開する。",
        stance: "FOR",
        authorId: "citizen-148",
      },
      {
        content:
          "デジタルプラットフォームでの議論はエコーチェンバーを生みやすい。意図的に多様な意見に触れる仕組みの設計が必要。",
        stance: "NEUTRAL",
        authorId: "citizen-149",
      },
      {
        content:
          "在外邦人の投票をオンラインで可能にすべき。現行制度では投票までに2ヶ月かかる場合があり、参政権の侵害。",
        stance: "FOR",
        authorId: "citizen-150",
      },
      {
        content:
          "AIを活用した「市民の声」分析は、パブリックコメントのサイレントマジョリティの意見を可視化する有効な手段。",
        stance: "FOR",
        authorId: "citizen-151",
      },
      {
        content:
          "デジタル民主主義は都市部のIT企業関係者の自己満足。農村部の高齢者の声こそ拾うべき。",
        stance: "AGAINST",
        authorId: "citizen-152",
      },
      {
        content:
          "国民投票のデジタル実施を可能にすべき。憲法改正の手続きにもテクノロジーを活用する時代。",
        stance: "FOR",
        authorId: "citizen-153",
      },
      {
        content:
          "政策のA/Bテストをデジタル上で実施すべき。限られた地域で実験し、データに基づいて全国展開を判断する。",
        stance: "FOR",
        authorId: "citizen-154",
      },
      {
        content:
          "デジタル民主主義の前提として、メディアリテラシー教育の義務化が必要。偽情報に基づく投票は民主主義の劣化。",
        stance: "NEUTRAL",
        authorId: "citizen-155",
      },
      {
        content:
          "障害者のアクセシビリティを最優先で設計すべき。視覚・聴覚・認知障害のある人が使えないプラットフォームは排除的。",
        stance: "NEUTRAL",
        authorId: "citizen-156",
      },
      {
        content:
          "NPO・市民団体とテック企業の協働でデジタル民主主義ツールを開発すべき。政府主導では官僚的になりがち。",
        stance: "NEUTRAL",
        authorId: "citizen-157",
      },
      {
        content:
          "デジタル技術で議員と有権者の常時コミュニケーションを実現すべき。選挙期間だけでなく日常的な対話が民主主義を強化する。",
        stance: "FOR",
        authorId: "citizen-158",
      },
      {
        content:
          "オンライン投票の導入は買収や脅迫のリスクを高める。投票所という物理的空間こそが秘密投票を守っている。",
        stance: "AGAINST",
        authorId: "citizen-159",
      },
      {
        content:
          "デジタル民主主義はグローバルな市民参加を可能にする。気候変動など国境を超える課題に、国際的な市民議会を設置すべき。",
        stance: "FOR",
        authorId: "citizen-160",
      },
    ],
  },
  {
    title: "教育改革 — 2030年代の学校のあり方",
    description:
      "AIネイティブ世代の子どもたちに何を教えるべきか。暗記中心の教育からの脱却、プログラミング教育、批判的思考力、創造性教育、不登校対策など包括的に議論します。",
    opinions: [
      {
        content:
          "暗記テスト中心の入試制度を廃止すべき。AI時代に記憶力を競う意味はない。思考プロセスを評価する入試に。",
        stance: "FOR",
        authorId: "citizen-161",
      },
      {
        content:
          "基礎学力（読み書き計算）の徹底なくして応用力は育たない。ゆとり教育の二の舞を避けるべき。",
        stance: "AGAINST",
        authorId: "citizen-162",
      },
      {
        content:
          "全生徒にAIチューターを提供すべき。一人ひとりの学習進度に合わせた完全個別最適化教育が技術的に可能になった。",
        stance: "FOR",
        authorId: "citizen-163",
      },
      {
        content:
          "学校の役割は知識伝達ではなく社会性の育成にシフトすべき。プロジェクト型学習、チーム活動、対話を中心に。",
        stance: "FOR",
        authorId: "citizen-164",
      },
      {
        content:
          "不登校の子どもにオンライン教育の卒業資格を認めるべき。学校に行くことだけが教育ではない。",
        stance: "FOR",
        authorId: "citizen-165",
      },
      {
        content:
          "教員の給与を大幅に引き上げ、教職の社会的地位を回復すべき。優秀な人材が教育現場に来なくなっている。",
        stance: "FOR",
        authorId: "citizen-166",
      },
      {
        content:
          "プログラミング教育よりも計算論的思考（Computational Thinking）の教育を重視すべき。言語は変わるが思考法は普遍。",
        stance: "NEUTRAL",
        authorId: "citizen-167",
      },
      {
        content:
          "英語教育をAI翻訳前提で再設計すべき。日常会話の英語力よりも、異文化理解と論理的表現力に集中する。",
        stance: "FOR",
        authorId: "citizen-168",
      },
      {
        content:
          "アート・デザイン教育を必修化すべき。AI時代に最も価値があるのは人間の創造性と美的感覚。",
        stance: "FOR",
        authorId: "citizen-169",
      },
      {
        content:
          "1学級の人数を20人以下に制限すべき。きめ細かい教育には教員と生徒の適切な比率が不可欠。",
        stance: "FOR",
        authorId: "citizen-170",
      },
      {
        content:
          "金融リテラシー教育を中学校から必修にすべき。投資、保険、税金の基礎知識は生活に直結する。",
        stance: "FOR",
        authorId: "citizen-171",
      },
      {
        content:
          "哲学教育を小学校から導入すべき。「なぜ？」と問い続ける力がAI時代の最も重要なスキル。",
        stance: "FOR",
        authorId: "citizen-172",
      },
      {
        content:
          "部活動の地域移行を加速すべき。教員の過重労働の最大要因であり、専門コーチによる指導の方が質も高い。",
        stance: "FOR",
        authorId: "citizen-173",
      },
      {
        content:
          "大学入学年齢の柔軟化を。ギャップイヤーや社会人経験後の入学を奨励し、多様な学生が混ざる環境を。",
        stance: "NEUTRAL",
        authorId: "citizen-174",
      },
      {
        content:
          "教科書のデジタル化を全面推進すべき。リアルタイムに更新される教材は、紙の教科書より教育効果が高い。",
        stance: "FOR",
        authorId: "citizen-175",
      },
      {
        content:
          "学校給食を無償化し、栄養管理を徹底すべき。食育は教育の基盤であり、貧困家庭の子どもの命綱でもある。",
        stance: "FOR",
        authorId: "citizen-176",
      },
      {
        content:
          "メンタルヘルス教育とスクールカウンセラーの常勤配置を義務化すべき。子どものメンタルヘルス危機は深刻。",
        stance: "FOR",
        authorId: "citizen-177",
      },
      {
        content:
          "起業家教育を高校に導入すべき。ビジネスプラン作成、プレゼンテーション、チームマネジメントを実践的に学ぶ。",
        stance: "FOR",
        authorId: "citizen-178",
      },
      {
        content:
          "教育のICT化は格差を拡大させるリスクがある。端末配布だけでなく、家庭のネットワーク環境整備も必須。",
        stance: "NEUTRAL",
        authorId: "citizen-179",
      },
      {
        content:
          "詰め込み教育を批判するが、世界の教育先進国（フィンランド等）も基礎学力は重視している。極端な改革は危険。",
        stance: "AGAINST",
        authorId: "citizen-180",
      },
      {
        content:
          "教員免許制度を改革し、民間経験者が教壇に立ちやすくすべき。多様なバックグラウンドの教員が教育を豊かにする。",
        stance: "FOR",
        authorId: "citizen-181",
      },
      {
        content:
          "STEAM教育（科学・技術・工学・芸術・数学の統合教育）を全校で導入すべき。教科の縦割りが創造性を阻害している。",
        stance: "FOR",
        authorId: "citizen-182",
      },
      {
        content:
          "学校の9月入学制への移行を再検討すべき。国際標準に合わせることで、留学や国際交流のハードルが下がる。",
        stance: "NEUTRAL",
        authorId: "citizen-183",
      },
      {
        content: "教育への市場原理導入は危険。学校間競争は格差を拡大させ、教育の公共性を損なう。",
        stance: "AGAINST",
        authorId: "citizen-184",
      },
      {
        content:
          "特別支援教育の充実が急務。インクルーシブ教育の理念は良いが、現場の人員と専門性が全く足りていない。",
        stance: "FOR",
        authorId: "citizen-185",
      },
      {
        content:
          "環境教育・サステナビリティ教育を教科横断で強化すべき。気候変動世代の子どもたちに当事者意識を育てる。",
        stance: "FOR",
        authorId: "citizen-186",
      },
      {
        content:
          "宿題を全面的に廃止すべき。家庭学習の強制は家庭環境の格差を助長し、子どもの自由時間を奪っている。",
        stance: "FOR",
        authorId: "citizen-187",
      },
      {
        content: "宿題廃止は極端。自律的な学習習慣を身につけるためには、適切な量の家庭学習は必要。",
        stance: "AGAINST",
        authorId: "citizen-188",
      },
      {
        content:
          "学校建築自体を根本から見直すべき。教室の画一的な配置ではなく、多様な学びの空間を設計する。",
        stance: "NEUTRAL",
        authorId: "citizen-189",
      },
      {
        content:
          "教員の事務作業をAIで自動化し、子どもと向き合う時間を増やすべき。成績処理や書類作成に時間を取られすぎている。",
        stance: "FOR",
        authorId: "citizen-190",
      },
      {
        content:
          "通知表の評定方式を廃止し、ポートフォリオ型の評価に移行すべき。数値で子どもを序列化する教育は時代遅れ。",
        stance: "FOR",
        authorId: "citizen-191",
      },
      {
        content:
          "評価の客観性は必要。ポートフォリオ評価だけでは教員の主観が入りすぎ、公平性が担保できない。",
        stance: "AGAINST",
        authorId: "citizen-192",
      },
      {
        content:
          "異年齢学級（モンテッソーリ的アプローチ）を公教育に取り入れるべき。年齢で区切る画一的な学年制度は合理性を欠く。",
        stance: "FOR",
        authorId: "citizen-193",
      },
      {
        content:
          "デジタルシティズンシップ教育を小学校低学年から必修にすべき。SNSのリスクやネットいじめへの対応力を早期に育てる。",
        stance: "FOR",
        authorId: "citizen-194",
      },
      {
        content:
          "大学教育の無償化よりも、専門学校・職業訓練校の充実が先。全員が大学に行く必要はなく、多様なキャリアパスを尊重すべき。",
        stance: "NEUTRAL",
        authorId: "citizen-195",
      },
      {
        content:
          "校則の大幅な緩和が必要。髪型・服装の規制は人権侵害に近い。ブラック校則は生徒の自主性を奪っている。",
        stance: "FOR",
        authorId: "citizen-196",
      },
      {
        content:
          "校則にも教育的意義がある。規律を学ぶ機会を全て奪うのは、社会に出てから困る子どもを増やすだけ。",
        stance: "AGAINST",
        authorId: "citizen-197",
      },
      {
        content:
          "教員養成課程にメンタルヘルスケアと危機対応のカリキュラムを追加すべき。現場で求められるスキルが変化している。",
        stance: "FOR",
        authorId: "citizen-198",
      },
      {
        content:
          "地域の大人（企業人、職人、農家など）が授業に参加する「社会人講師」制度を拡充すべき。実社会との接点が学びを深める。",
        stance: "FOR",
        authorId: "citizen-199",
      },
      {
        content:
          "日本の教育は国際比較でも依然高水準。PISA成績は上位を維持しており、過度な危機感を煽る必要はない。冷静な改善が重要。",
        stance: "AGAINST",
        authorId: "citizen-200",
      },
    ],
  },
];

export async function POST() {
  try {
    // Clean up existing data before seeding (reverse FK order)
    await prisma.bLArgumentEdge.deleteMany();
    await prisma.bLArgument.deleteMany();
    await prisma.bLSupport.deleteMany();
    await prisma.bLPheromone.deleteMany();
    await prisma.bLEcosystemSnapshot.deleteMany();
    await prisma.bLOpinion.deleteMany();
    await prisma.bLCluster.deleteMany();
    await prisma.bLTopic.deleteMany();

    let totalOpinions = 0;

    const createdTopics = await Promise.all(
      SEED_TOPICS.map(async (seed) => {
        const topic = await prisma.bLTopic.create({
          data: {
            title: seed.title,
            description: seed.description,
            phase: "OPEN",
            quorumThreshold: 0.6,
          },
        });

        const opinions = await Promise.all(
          seed.opinions.map(async (op) => {
            const opinion = await prisma.bLOpinion.create({
              data: {
                content: op.content,
                stance: op.stance as "FOR" | "AGAINST" | "NEUTRAL",
                authorId: op.authorId,
                topicId: topic.id,
                fitness: 0.1 + Math.random() * 0.8,
              },
            });

            await prisma.bLPheromone.create({
              data: {
                intensity: 0.3 + Math.random() * 0.7,
                quality: 0.3 + Math.random() * 0.5,
                decayRate: 0.01,
                opinionId: opinion.id,
              },
            });

            return opinion;
          }),
        );

        totalOpinions += opinions.length;
        return topic;
      }),
    );

    return jsonResponse({
      message: "Seed data created successfully",
      topics: createdTopics.length,
      opinions: totalOpinions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
