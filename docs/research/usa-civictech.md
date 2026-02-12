# 米国CivicTech・オープンガバメント深掘り調査レポート

## 概要

本レポートは、米国（USA）における政治デジタル化・CivicTech・オープンガバメントの包括的調査である。主要プロジェクト、技術的実装、学術研究、定量データを網羅し、日本との比較を含む。米国はCivicTechの発祥地であり、世界最大規模のエコシステムを有する。Knight Foundationの調査（2013）によれば、CivicTech企業は2008〜2013年に年間約23%成長しており、連邦・州・地方レベルで多層的なイノベーションが展開されている。

---

## 1. Code for America

### 1.1 設立経緯と組織

Code for America（CfA）は2009年、Jennifer Pahlkaによって設立された501(c)(3)非営利組織である。「21世紀のテクノロジーを政府にもたらす」ことをミッションとし、「シビックハッキング」の推進を掲げた。Pahlkaは後にオバマ政権下で米国CTO副官（Deputy CTO）を務め、CfAの理念を連邦レベルに拡大した。

2025年は設立15周年にあたり、組織は「政府のドアを叩く」段階から「テーブルに席を与えられる」段階へ移行したと位置づけている。

### 1.2 ブリゲード（Brigade）ネットワーク

2012年にCode for Americaは地方ボランティアグループ「ブリゲード」の支援を開始した。ミシガン州グランドラピッズのFriendly Codeが初期ブリゲードの一つで、最終的にネットワークは全米60支部、25,000人規模に成長した。

**ブリゲードの活動実績：**
- 2020年：パンデミック対応で100以上のCOVID-19特化プロジェクト、合計307プロジェクトを実施
- 500万人にリーチし、70万人以上に直接サービスを提供
- Knight Foundationから強化資金を獲得

**ブリゲードの終了と再編：**
2023年1月、CfAはブリゲードプログラムを終了し、地方支部との提携を段階的に解消した。理由として「地方ボランティアグループの組織者・招集者としての役割はもはやCfAのものではない」と表明。元ブリゲードの多くは独立組織として再編されている（例：SF Civic Tech）。

### 1.3 主要プロジェクト

#### GetCalFresh（SNAP給付申請支援）
- **概要**: カリフォルニア州のSNAP（補助栄養支援プログラム、州名CalFresh）のオンライン申請支援
- **開始**: 2013年に申請プロセスの観察から着手
- **定量的成果**:
  - 620万世帯が128億ドル以上の食料支援にアクセス
  - 700万人以上のカリフォルニア住民が利用
  - 2019〜2025年にカリフォルニア州のオンラインSNAP申請の70%以上をGetCalFresh経由で処理
  - 申請時間を45分から約8分に短縮
- **経済効果**: SNAP給付1ドルにつき地域経済に1.50ドルの効果
- **展開**: 2019年に全58郡でサービス開始

#### ClearMyRecord（前科記録自動消去）
- **概要**: 犯罪記録の自動消去（Automatic Record Clearance）を全国標準にするプロジェクト
- **背景**: 米国では3人に1人が通常のバックグラウンドチェックに表示される犯罪記録を持つ。既存の請願プロセスは複雑・高コストで、対象者のごく一部しか救済を受けていない
- **定量的成果**:
  - 2018年以降、カリフォルニア・ユタ両州で50万人の記録を消去
  - カリフォルニアで14.4万件の記録消去を特定
  - 5郡パイロットで約7.5万件の大麻関連有罪判決を棄却・軽減
- **政策影響**: 12州が自動記録消去法を成立。20州以上でCfAが政策設計を支援

#### FileYourStateTaxes（州税電子申告）
- アリゾナ・ニューヨーク州と提携
- IRSのDirect File（連邦税無料電子申告）利用者向けの州税申告コンパニオン製品

### 1.4 GitHubリポジトリ

- **URL**: https://github.com/codeforamerica
- **リポジトリ数**: 792（2025年時点）
- **主要リポジトリ**: gcf-microsite（GetCalFresh）、health、ohana-api（社会サービスディレクトリ）等
- **技術スタック**: Ruby on Rails、Python、JavaScript等多岐にわたる

### 1.5 学術的評価

CfAの影響は主に以下の観点から評価されている：
- 政府のデジタルサービスと政策立案の間のサイロを解消
- 刑事司法改革、社会セーフティネット拡大、労働力開発において数百万人にサービスを提供
- 州・地方政府にデジタルサービスチーム設立のモデルを提供

---

## 2. GovTrack.us

### 2.1 概要と歴史

GovTrack.usは、当時学生だったJoshua Tauberer（Ph.D.）が2004年に開発した議会法案追跡サイトである。連邦立法情報を包括的にオープン・構造化データとして無料公開した最初のプラットフォームであり、数十のオープンガバメントプロジェクトの基盤となった。

### 2.2 技術的実装

**初期アーキテクチャ：**
- THOMAS.gov（議会図書館の立法データベース）からのスクリーンスクレイピング
- Taubererが自作したソフトウェアで自動収集
- 構造化データ（XML、JSON）として再公開

**データソースの変遷：**
1. 2004〜2016年：THOMAS.govスクレイピング → 構造化データとして公開
2. 2016年：議会が公式にバルクデータ・構造化データを公開開始
3. 現在：Congress.govの公式APIおよびバルクデータを利用（自前のスクレイパーを廃止）

**提供機能：**
- 法案の状態追跡・横断検索
- 投票記録の議員別集計
- 法案成立確率の予測（機械学習活用）
- 包括法案（omnibus bill）への条文組み込み追跡

### 2.3 利用者層とインパクト

- ジャーナリスト、ロビイスト、議会スタッフ、活動家、学生、教育者、一般市民が利用
- mySocietyの調査: GovTrack利用者の55%が55歳以上
- Taubererは2019年に下院小委員会で証言、議会の情報公開改善を提言
- 著書 *Open Government Data: The Book*（2012）で原則を体系化

### 2.4 議会のオープンデータへの影響

GovTrackの存在が、議会自身がデータを構造化公開する動機となった。Taubererのデータの有用性は、Mike Honda議員の立法データ新規公開法案のインスピレーションの一部となった。2016年の公式構造化データ公開後、Taubererは自前データベースを削除し、公式データに移行した。

---

## 3. OpenSecrets（旧Center for Responsive Politics）

### 3.1 組織概要

OpenSecretsは、米国の選挙資金・ロビイング活動を追跡・公開する非営利組織（ワシントンD.C.拠点）である。2021年にCenter for Responsive Politics（CRP、1983年設立）とNational Institute on Money in Politics（NIMP）が合併して設立された。

**設立経緯：**
- 1983年: 退職上院議員Frank Church（民主党・アイダホ州）とHugh Scott（共和党・ペンシルベニア州）が超党派でCRPを設立
- 1990年: 初のデータ公開
- 1996年: OpenSecrets.orgウェブサイト開設

### 3.2 データソースとFEC連携

**データソース：**
- **FEC（連邦選挙委員会）**: 議会・大統領選の選挙資金データ
- **上院公開事務局**: ロビイング登録・報告
- **IRS**: 501(c)組織の開示
- **各種政府機関**: 個人資産開示等

**データ処理の付加価値：**
- FECの生データを「清浄化」（名寄せ、業種分類等）
- 寄附者を雇用主・業界別に分類
- 「回転ドア」データベース（官民間の人材移動追跡）
- ダークマネー（Dark Money）追跡

### 3.3 提供ツール・API

- **バルクダウンロード**: 全データをCSV/テキスト形式で非商用無料ダウンロード可能
- **API**: 開発者向けデータアクセスAPI
- **可視化ツール**: 選挙サイクル別の資金フロー、業界別献金パターン等
- **Personal Finances**: 連邦議員の個人資産データベース

### 3.4 ミッションと公共的意義

「アメリカの政治における金の流れに関する信頼できる権威として機能する」ことをミッションとし、政策立案者・ジャーナリスト・市民にデータ・分析・ツールを提供。MacArthur Foundation等から助成を受けている。

---

## 4. FEC（Federal Election Commission）データ基盤

### 4.1 組織とデータ公開の枠組み

FEC（連邦選挙委員会）は1975年設立の独立規制機関で、連邦選挙の選挙資金法を管理・執行する。データ公開は民主主義の透明性確保の中核的役割を果たす。

### 4.2 OpenFEC API

18F（後述）との協働で開発された、FEC初のRESTful APIである。

**エンドポイント構成：**

| カテゴリ | 主要エンドポイント | 概要 |
|----------|-------------------|------|
| **Candidate** | `/candidates/search` | 候補者情報検索。FEC候補者IDで一意識別 |
| **Committee** | `/committees/search` | 委員会（PAC、政党委員会、選挙委員会等）検索 |
| **Financial** | 各種 | 財務サマリー、会計期間別データ |
| **Filings** | `/filings` | 提出書類（報告書、修正等）の検索 |
| **Schedule A** | `/schedules/schedule_a` | 個人献金の詳細（献金者名検索可能） |
| **Schedule B** | `/schedules/schedule_b` | 支出の詳細 |

**技術的実装：**
- Flask（Python）アプリケーション
- gunicorn WSGIサーバー + nginx リバースプロキシ
- GitHubリポジトリ: https://github.com/fecgov/openFEC
- APIキー取得で無料利用可能

### 4.3 バルクデータダウンロード

FECは以下のバルクデータファイルを提供する：

| ファイル | 内容 | 更新頻度 |
|----------|------|----------|
| **Committee Master** | FEC登録全委員会（PAC、政党、選挙委員会等） | 週次 |
| **Candidate Master** | 全候補者基本情報 | 週次 |
| **Individual Contributions** | 個人から連邦委員会への全献金 | 日次〜週次 |
| **Committee-to-Committee** | 委員会間の資金移動 | 週次 |
| **Electronic Filings** | 電子提出された報告書（.fecファイル） | 日次 |
| **Paper Filings** | 紙提出報告書のデジタル化 | 随時 |

### 4.4 日本との比較（最重要）

| 比較項目 | 米国FEC | 日本（総務省） |
|----------|---------|---------------|
| **データ形式** | API（REST）、CSV、バルクダウンロード | PDF（スキャン/テキスト混在） |
| **構造化データ** | 完全な構造化データ（JSON/CSV） | XMLなし、CSVなし、APIなし |
| **更新頻度** | 日次〜週次 | 年1回（11月末定期公表） |
| **報告保存期間** | 1990年代中盤以降の全データをオンラインで永続保存 | 3年で廃棄（多くの選管） |
| **開示閾値** | 200ドル超の個人献金を開示 | 5万円超の個人献金（パーティー券は20万円） |
| **監視・執行** | FECが能動的に監視・執行 | 監視システムなし、法違反の取り締まり体制が脆弱 |
| **機械可読性** | 完全に機械可読 | PDF解析が必要（OCR含む） |
| **サードパーティAPI** | OpenSecrets API、ProPublica API等 | 民間プロジェクト（政治資金オープンデータ等）が限定的に構造化 |
| **データベース整備** | 1970年代から | 令和10年（2028年）4月までに開始予定 |
| **メディア報道** | 選挙資金の報道頻度が高い | 報道頻度が低い（年次報告のため速報性に欠ける） |

**構造的差異の根本原因：**
1. **法的枠組み**: 米国はFECA（連邦選挙運動法、1971年）以来、電子的開示を前提とした法整備が進んだ。日本の政治資金規正法は紙ベースの報告を前提としている
2. **独立機関**: FECは独立規制機関として監視・執行権を持つ。日本は総務省の一部門が管轄し、独立した監視機関が存在しない
3. **テクノロジー導入**: FECは18Fとの協働でOpenFEC APIを開発。日本は令和10年のデータベース化が初の本格的デジタル対応
4. **市民社会の圧力**: OpenSecrets、Sunlight Foundation等のNPOがデータ公開を継続的に要求。日本は政治資金データの市民活用が限定的

---

## 5. ProPublica

### 5.1 組織概要

ProPublicaは2008年設立の非営利調査報道機関で、独立系のデータジャーナリズムの先駆者である。ピューリッツァー賞を複数回受賞。

### 5.2 Congress API

**概要：**
- 2009年にThe New York Timesで開発されたAPIをProPublicaが引き継ぎ
- 下院・上院・議会図書館の立法データを提供
- 議員情報、投票記録、法案詳細、指名等を網羅

**技術仕様：**
- 大半のデータを日次更新、投票データは30分ごと更新
- RESTful API、JSON形式
- 無料利用可能（APIキー取得制）

**Sunlight Foundation Congress APIの継承：**
- 2016年にSunlight Labsが活動縮小
- ProPublicaがSunlight Foundation Congress APIの後継プロジェクト「Represent」を引き継ぎ
- Sunlight Foundationは10年間で42億回以上のAPIコールを処理

### 5.3 Nonprofit Explorer

**概要：**
- 2013年以降のIRS公開データを統合した非営利団体データベース
- 180万件以上の非営利税務申告データ

**提供内容：**
- 組織プロファイル（役員報酬、収支、活動内容）
- 2001年以降の税務申告書ダウンロード
- 無料API（組織検索、全文検索）
- ウェブサイト非掲載のフォーム固有フィールドもAPI経由で取得可能

### 5.4 その他のデータツール

- **Campaign Finance API**: FECファイリングデータの候補者・委員会サマリー
- **Free the Files**: FCC提出に基づく政治テレビ広告支出データ
- **Forensics**: 検死官・監察医制度の州・郡レベルデータ

---

## 6. US Digital Service（USDS）/ 18F

### 6.1 USDS（United States Digital Service）

**設立経緯：**
- 2013年10月: HealthCare.gov（オバマケアの保険マーケットプレイス）が壊滅的な障害
- Google等のエンジニアが緊急「レスキューチーム」として参集
- 2014年8月11日: オバマ大統領がUSDSを行政管理予算局（OMB）内に設立
- 初代所長: Mikey Dickerson（元Google、HealthCare.govレスキューに参加）

**主な成果（2014〜2024年）：**
- 31の連邦機関と協働
- 帰化申請の100%電子処理を実現（国土安全保障省）
- 社会保障庁のインフラ費用5年間で2.85億ドル削減見込み
- 988自殺・危機ライフラインの再構築
- 年間1兆ドルのメディケア請求処理システムの近代化

**2025年の激変：**
- トランプ第二期政権下でDOGE（Department of Government Efficiency）に統合・改名
- 「U.S. DOGE Service」として再編（大統領令14158号）
- 多数の元USDS職員が離職
- 2025年11月: 人事管理局（OPM）がDOGEの組織的存在を否定

### 6.2 18F

**概要：**
- 一般調達局（GSA）技術変革サービス（TTS）内のデジタルサービス機関
- デザイナー、ソフトウェアエンジニア、戦略家、プロダクトマネージャーで構成
- 他の政府機関のデジタル製品構築・調達・共有を支援

**オープンソース方針：**
- 18Fが作成・修正した全ソースコードを公開する方針
- 内部開発・契約開発を問わず公開対象
- GitHubリポジトリ数: 1,210以上（https://github.com/18f）

**主要オープンソースプロジェクト：**

| プロジェクト | 概要 |
|-------------|------|
| **Login.gov** | 連邦政府統一認証基盤（IdP）。市民が一つのアカウントで複数機関にアクセス |
| **Cloud.gov** | 連邦政府向けクラウドインフラ（FedRAMP認証済み）。PaaS型でセキュリティ・コンプライアンスを内包 |
| **USWDS（U.S. Web Design System）** | 2015年に18FとUSDSの協働で策定。連邦ウェブサイトのデザインシステム |
| **OpenFEC** | FEC初のRESTful API（前述） |
| **code.gov** | 連邦政府のオープンソースコードポータル |

**波及効果：**
- カリフォルニア、コロラド、ニュージャージー、ペンシルベニア、メリーランド等の州
- ニューヨーク市、ボストン、サンフランシスコ等の都市
- アジャイル開発、ユーザー中心設計、オープンソース手法を採用

**2025年3月の廃止：**
- トランプ第二期のDOGE関連の連邦大量解雇の一環で廃止
- 後継計画なし、多数の連邦機関がデジタル変革支援を喪失

---

## 7. Pol.is（米国での活用）

### 7.1 プラットフォーム概要

Pol.is（ポリス）は、シアトルの開発チームが開発した大規模グループ協議のためのオープンソースwiki surveyソフトウェアである。参加者が意見を共有し、コメントに賛否を表明する仕組みで、分極化を超えたコンセンサスの可視化を特徴とする。

**技術的特徴：**
- コメントへの返信を禁止（トロール対策）
- 主成分分析（PCA）による意見クラスターの可視化
- 分極化した意見群の間で共通する合意点を自動的に浮上
- GitHubでオープンソース公開: https://github.com/compdemocracy/polis

### 7.2 米国での活用事例

#### ケンタッキー州の事例（2018年）
- **背景**: 全国的なホットボタンイシューで分裂した中規模都市（人口65,000）
- **実施内容**: Pol.isを使って地域住民がコンセンサスのある地方課題を特定
- **参加率**: 人口の約3%（65,000人中2,000人）が参加 — 地方レベルでは高い参加率
- **成果**: 集合的意志の可視化 → 選出公務員への説明責任追及の基盤構築

#### その他の米国活用
- コロラド州議会: Democracy Earth FoundationがPol.isベースの二次投票（Quadratic Voting）を米国初実施
- 各種地方自治体での市民参加プロセス

### 7.3 国際比較における位置づけ

Pol.isは台湾のvTaiwanで最も成功した活用例を持つが、米国での活用は相対的に限定的である。台湾ではデジタル大臣（唐鳳）の主導で制度化されたのに対し、米国では個別の実験的プロジェクトにとどまっている。

---

## 8. 参加型予算（Participatory Budgeting）

### 8.1 概要

参加型予算（PB）は、市民が公共予算の一部の使途を直接決定する民主的プロセスである。ブラジル・ポルトアレグレ（1989年）が発祥で、米国では2000年代後半から導入が進んだ。

### 8.2 ニューヨーク市の事例

#### PBNYC（市議会プログラム）
- **開始**: 2012年
- **累計実績**: 2.1億ドルを706プロジェクトに配分
- **仕組み**: 参加議員の選挙区ごとに100万ドルを配分。住民がプロジェクトを提案・精査し、3〜4月に投票
- **対象**: 5万ドル以上、耐用年数5年以上の公共空間物理インフラプロジェクト
- **FY2026結果**: 2025年5月発表
- **データ公開**: NYC Open Dataでプロジェクトデータを公開（https://data.cityofnewyork.us）

#### The People's Money（市全体プログラム）
- **経緯**: 2018年の住民投票でCivic Engagement Commission（CEC）設立を決定
- **規模**: 年間500万ドルの市全体PBプログラム
- **投票**: デジタル投票25,339票 + 紙投票85,032票 = 計110,371票
- **参加規模**: 99,250人以上（11歳以上の全住民が参加資格）

### 8.3 Participatory Budgeting Project（PBP）

**概要：**
- 米国における参加型予算の中心的推進組織
- 自治体への技術支援・プロセス設計を提供
- シカゴ、ボストン、その他の都市で実施を支援

### 8.4 デジタルプラットフォームとの連携

米国の参加型予算は、Decidim（バルセロナ発のオープンソースプラットフォーム）等のデジタルツールとの統合が進んでいるが、紙投票と対面プロセスも重視される傾向にある。NYC PBNYCではデジタル投票と紙投票の両方を受け付けている。

---

## 9. AI x 政治

### 9.1 Stanford HAIの研究

Stanford Institute for Human-Centered Artificial Intelligence（HAI）は、AIと政治の交差領域で以下の主要研究を行っている。

#### LLMの政治バイアス研究
- **主要発見**: Andrew Hall等の研究（2025年発表）により、主要LLMがユーザーから左寄りの政治的偏向を持つと圧倒的に認識されていることが判明
- **モデル別認識**: OpenAIモデルが最も強い左寄り認識（Googleの4倍）、Googleモデルが最小
- **暗黙的バイアス**: GPT-4やClaude 3 Sonnet等は明示的バイアス抑制措置があるが、暗黙的バイアスは残存
  - 黒人に対する否定的用語の不均衡な関連付け
  - 女性をSTEMよりも人文科学と関連付ける傾向
  - リーダーシップ役割での男性優遇

#### 政治的中立性のフレームワーク
- Stanford HAIが8つの手法からなるAI政治的中立性のフレームワークを提示
- 「真の政治的中立性は不可能だが、実用的な近似は開発者レベルで実装可能」
- データ選択、システム設計、ユーザー入力のすべてにバイアスが介入する構造的問題を指摘

#### AIの民主的プロセスへの影響
- AI生成メッセージは銃規制・気候変動等の争点に対する態度を変化させうる
- 予算配分等の政治的意思決定にも影響
- AI Index Report 2025で「責任あるAI」セクションとして体系化

### 9.2 議会向けAI政策分析ツール

#### AthenaAI
- 2024年にNational Defense Labが導入
- 議員向けの法案要約・分析AI

#### 議会調査局（CRS）のAI活用
- CRSが法案要約のためのAI活用を検討中
- 5つのモデルを開発中
- 下院事務局はAIを使ったコスト見積もり迅速化、既存法との関連分析を2024年から開始

### 9.3 民間AI政策分析ツール

| ツール | 機能 |
|--------|------|
| **Plural Policy** | AI法案要約、トピック自動分類、バージョン間差分 |
| **Quorum** | パーソナライズド要約、セマンティック検索（意味ベース） |
| **FiscalNote** | AI政策追跡ワークフロー、規制変更モニタリング |

### 9.4 学術的論点

- **バイアスの構造的不可避性**: 訓練データ・設計判断の全段階でバイアスが介入
- **説得力の問題**: AI生成プロパガンダの説得力に関する実証研究（Stanford HAI）
- **政治化の不可避性**: Brookings研究所「生成AIの政治化は不可避か？」

---

## 10. その他の主要プロジェクト

### 10.1 Sunlight Foundation

**概要：**
- 2006年設立の非営利組織
- シビックテック、オープンデータ、政策分析、ジャーナリズムのツールを活用
- 米国議会を皮切りに、地方・州・連邦・国際レベルに拡大

**主な成果：**
- 10年間で42億回以上のAPIコールを処理
- FOIA（情報自由法）改革、DATA Act（データ法）成立に貢献
- 連邦支出情報の公開方法を根本的に変革

**レガシープロジェクトの移管：**
- Sunlight Labs閉鎖後、主要プロジェクトを他組織に移管
- Congress API → ProPublica「Represent」
- Open States → 元Sunlightスタッフが独立運営（後にPlural Policyが採用）
- OpenCongress → GovTrack

### 10.2 Open States

**概要：**
- 全50州 + D.C. + プエルトリコの州議会情報を標準化・集約
- 州レベルの立法データのギャップを埋めるプロジェクト

**技術：**
- JSON API（v3: https://v3.openstates.org/）
- バルクダウンロード
- YAML形式の全選出公務員データ（openstates-people）
- 2021年にPlural Policyが採用（Plural Open Data Project）

### 10.3 Democracy Earth Foundation

**概要：**
- サンフランシスコ拠点の501(c)(3)非営利組織
- ブロックチェーンベースのオープンソース投票ソフトウェアを開発
- 共同創設者: Pia Mancini（アルゼンチン出身の政治学者）
- Y Combinator卒業の最初の非営利組織

**主要プラットフォーム: Sovereign**
- ブロックチェーン上の液体民主主義（Liquid Democracy）
- 法案提案、選挙実施、議論、投票、委任（と撤回）が可能
- 中央集権なしのセキュアネットワーク上で動作

**米国での実績：**
- コロラド州議会で米国初のQuadratic Voting（二次投票）を実装

---

## 11. 学術研究

### 11.1 主要研究機関

#### MIT Center for Civic Media（2007〜2020年）
- MIT Media LabとComparative Media Studiesの協働
- 2020年8月に閉鎖

**主要研究：**
- Erhardt Graeff: PhD論文 "Evaluating Civic Technology Design for Citizen Empowerment"（2018年）
- "Anonymization of Voices in Spaces for Civic Dialogue: Measuring Impact on Empathy, Trust, and Feeling Heard"（ACM CSCW, 2024年）
- "DataBasic: Design Principles, Tools and Activities for Data Literacy Learners"（Journal of Community Informatics, 2016年）
- 書籍: *Civic Media: Technology, Design, Practice*（MIT Press）

**卒業生の活動：**
- Erhardt Graeff（Olin College）: 効果的な市民参加手法の設計
- Nathan Matias（Cornell CATLAB）: オンラインコミュニティのガバナンス
- Catherine D'Ignazio（MIT DUSP）: Data Feminism
- Rahul Bhargava（Northeastern）: データストーリーテリングのシビックインパクト

#### Stanford HAI
- 前述のLLM政治バイアス研究
- AI Index Report（年次）
- 政治的中立性フレームワーク

#### Harvard Kennedy School Data-Smart City Solutions
- 市民参加のテーマ・教訓のケーススタディ
- 地方政府のデータ活用事例研究

### 11.2 主要論文リスト

| 著者 | タイトル | 出版 | 年 |
|------|---------|------|-----|
| McNutt, J.G. et al. | "The diffusion of civic technology and open government in the United States" | Information Polity | 2016 |
| Graeff, E. | "Evaluating Civic Technology Design for Citizen Empowerment" | MIT PhD Thesis | 2018 |
| Hall, A. et al. | "Study finds perceived political bias in popular AI models" | Stanford Report | 2025 |
| Stanford HAI | "Toward Political Neutrality in AI" | HAI Policy Brief | 2025 |
| Stanford HAI | "AI Index Report 2025 Chapter 3: Responsible AI" | HAI Annual Report | 2025 |
| Sundberg, L. & Holmstrom, J. | "Citizen-centricity in digital government research: A literature review and integrative framework" | Information Polity | 2024 |
| Tauberer, J. | *Open Government Data: The Book* | 自費出版 | 2012 |
| Gordon, E. & Mihailidis, P. (eds.) | *Civic Media: Technology, Design, Practice* | MIT Press | 2016 |
| OECD | "Tackling civic participation challenges with emerging technologies" | OECD Report | 2025 |
| Knight Foundation | "The Emergence of Civic Tech: Investments in a Growing Field" | Knight Report | 2013 |
| Frontiers | "Digital governance and civic inclusion to enhance public participation" | Frontiers in Political Science | 2025 |
| ACM | "Citizen Participation and Machine Learning for a Better Democracy" | Digital Government: Research & Practice | 2021 |
| Springer | "Digital Democracy in Action: Impact of Civic Tech Innovation on Public Service Delivery" | Springer | 2024 |

### 11.3 定量データまとめ

| 指標 | 数値 | 出典 |
|------|------|------|
| CivicTech企業成長率 | 年間約23%（2008〜2013年） | Knight Foundation |
| Code for America GitHubリポジトリ数 | 792 | GitHub |
| GetCalFresh利用世帯数 | 620万世帯 | Code for America |
| GetCalFresh食料支援額 | 128億ドル以上 | Code for America |
| ClearMyRecord記録消去数 | 50万人 | Code for America |
| GovTrack利用者55歳以上比率 | 55% | mySociety |
| Sunlight Foundation APIコール累計 | 42億回以上 | Sunlight Foundation |
| NYC参加型予算累計配分額 | 2.1億ドル（706プロジェクト） | NYC Council |
| NYC PB参加者数 | 99,250人以上 | NYC Council |
| USDS協働機関数 | 31連邦機関 | USDS 2024 Impact Report |
| USDS SSA削減見込み | 2.85億ドル（5年間） | USDS |
| 18F GitHubリポジトリ数 | 1,210以上 | GitHub |
| OpenSecrets設立年 | 1983年（CRP） | OpenSecrets |
| FEC OpenFEC APIリリース年 | 2015年 | 18F |

---

## 12. 日本への示唆

### 12.1 米国CivicTechエコシステムの構造的特徴

米国のCivicTechエコシステムは以下の構造的特徴を持つ：

1. **多層的アクター**: 連邦（USDS/18F）、NPO（CfA/Sunlight/ProPublica）、学術（MIT/Stanford）、市民ボランティア（ブリゲード）、民間（FiscalNote/Quorum等）が相互補完的に機能
2. **データファースト**: FECの構造化データ公開が、OpenSecrets・ProPublica等のサードパーティイノベーションの基盤
3. **オープンソース文化**: 18Fの全コード公開方針がデフォルト。政府プロジェクトのコードが再利用可能
4. **失敗からの学習**: HealthCare.govの大失敗がUSDS設立の契機。危機が制度改革を駆動
5. **揺れ戻りのリスク**: 2025年のDOGE統合・18F廃止に見られるように、政権交代で制度が破壊されうる脆弱性

### 12.2 日本が参考にすべき点

1. **政治資金データの構造化**: FECモデルに倣い、機械可読なデータ公開を令和10年のデータベース化で実現すべき
2. **独立監視機関**: FECのような独立規制機関の設立検討
3. **サードパーティAPI促進**: 政府がAPIを公開することで、OpenSecrets型の民間監視組織が活動可能になる
4. **オープンソース戦略**: 18Fのように政府プロジェクトのデフォルトをオープンソースとする方針
5. **ブリゲードモデルの日本版**: Code for Japan（既に存在）のブリゲードネットワーク強化
6. **参加型予算の導入**: ニューヨーク市モデルの日本版実験

### 12.3 米国の課題と日本への警告

1. **デジタルデバイド**: GovTrack利用者の55%が55歳以上、若年層の参加が課題
2. **政治的分極化**: AIバイアス問題に見られるように、テクノロジーが分極化を助長するリスク
3. **制度的脆弱性**: USDS/18Fの廃止は、政府内デジタル組織が政権交代に脆弱であることを示す
4. **インパクト測定の困難**: Sunlight Foundationの指摘通り、「オープンデータセット数」等の出力指標では真のインパクトを測定できない

---

## 参考文献

### 組織・プロジェクト公式サイト

1. Code for America. https://codeforamerica.org/
2. Code for America. "2024 Impact Report." https://codeforamerica.org/impact/2024/
3. Code for America. "Reflecting on 10 Years of Food Assistance in California." https://codeforamerica.org/news/reflecting-on-10-years-of-getcalfresh/
4. Code for America. "Automatic Record Clearance." https://codeforamerica.org/programs/criminal-justice/automatic-record-clearance/
5. Code for America GitHub. https://github.com/codeforamerica
6. GovTrack.us. https://www.govtrack.us/
7. GovTrack.us. "About Our Data." https://www.govtrack.us/about-our-data
8. OpenSecrets. https://www.opensecrets.org/
9. OpenSecrets. "Our Vision and Mission." https://www.opensecrets.org/about/
10. FEC. "Campaign Finance Data." https://www.fec.gov/data/
11. FEC. "Browse Data." https://www.fec.gov/data/browse-data/
12. OpenFEC API Documentation. https://api.open.fec.gov/developers/
13. OpenFEC GitHub. https://github.com/fecgov/openFEC
14. ProPublica Congress API. https://projects.propublica.org/api-docs/congress-api/
15. ProPublica Nonprofit Explorer. https://projects.propublica.org/nonprofits/
16. ProPublica Nonprofit Explorer API v2. https://projects.propublica.org/nonprofits/api
17. 18F. https://18f.gsa.gov/
18. 18F GitHub. https://github.com/18f
19. 18F. "Open Source Policy." https://18f.gsa.gov/open-source-policy/
20. 18F. "Introducing the Federal Election Commission's First API." https://18f.gsa.gov/2015/07/08/openfec-api/
21. USDS. https://www.usds.gov/
22. USDS. "2024 Impact Report." https://www.usds.gov/resources/USDS-2024-Impact-Report.pdf
23. Login.gov GitHub. https://github.com/18F/identity-idp
24. Cloud.gov GitHub. https://github.com/cloud-gov
25. Pol.is. https://pol.is/
26. Computational Democracy Project. https://compdemocracy.org/
27. Pol.is GitHub. https://github.com/compdemocracy/polis
28. Participatory Budgeting Project. https://www.participatorybudgeting.org/
29. NYC Council PB. https://council.nyc.gov/pb/
30. NYC PB Open Data. https://data.cityofnewyork.us/City-Government/Participatory-Budgeting-Projects/wwhr-5ven
31. Sunlight Foundation. https://sunlightfoundation.com/
32. Open States / Plural Policy. https://openstates.org/
33. Open States API v3. https://docs.openstates.org/api-v3/
34. Democracy Earth Foundation. https://democracy.earth/
35. Democracy Earth GitHub. https://github.com/DemocracyEarth/paper
36. Decidim. https://decidim.org/
37. Decidim GitHub. https://github.com/decidim/decidim

### 学術論文・報告書

38. McNutt, J.G., Justice, J.B., Melitski, J.M., Ahn, M.J., Siddiqui, S.R., Carter, D.T., & Kline, A.D. (2016). "The diffusion of civic technology and open government in the United States." *Information Polity*, 21(2), 153-170. https://journals.sagepub.com/doi/abs/10.3233/IP-160385
39. Graeff, E. (2018). "Evaluating Civic Technology Design for Citizen Empowerment." MIT PhD Thesis. https://www.media.mit.edu/projects/empowering-civic-tech/overview/
40. Hall, A. et al. (2025). "Study finds perceived political bias in popular AI models." *Stanford Report*. https://news.stanford.edu/stories/2025/05/ai-models-llms-chatgpt-claude-gemini-partisan-bias-research-study
41. Stanford HAI. (2025). "Toward Political Neutrality in AI." https://hai.stanford.edu/policy/toward-political-neutrality-in-ai
42. Stanford HAI. (2025). "How Persuasive is AI-Generated Propaganda?" https://hai.stanford.edu/policy-brief/how-persuasive-ai-generated-propaganda
43. Stanford HAI. (2025). *AI Index Report 2025*. https://hai.stanford.edu/ai-index/2025-ai-index-report/responsible-ai
44. Sundberg, L. & Holmstrom, J. (2024). "Citizen-centricity in digital government research: A literature review and integrative framework." *Information Polity*. https://journals.sagepub.com/doi/10.3233/IP-220047
45. Tauberer, J. (2012). *Open Government Data: The Book*. https://opengovdata.io/
46. Tauberer, J. (2019). Testimony before the U.S. House Modernization Committee. https://docs.house.gov/meetings/MH/MH00/20190510/109468/HHRG-116-MH00-Wstate-TaubererJ-20190510-U2.pdf
47. Gordon, E. & Mihailidis, P. (eds.) (2016). *Civic Media: Technology, Design, Practice*. MIT Press. https://direct.mit.edu/books/book/3469/Civic-MediaTechnology-Design-Practice
48. Knight Foundation. (2013). "The Emergence of Civic Tech: Investments in a Growing Field." https://knightfoundation.org/reports/emergence-of-civic-tech/
49. Knight Foundation. "Trends in Civic Tech." https://knightfoundation.org/features/civictech/
50. OECD. (2025). "Tackling civic participation challenges with emerging technologies." https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/04/tackling-civic-participation-challenges-with-emerging-technologies_bbe2a7f5/ec2ca9a2-en.pdf
51. Springer. (2024). "Digital Democracy in Action: Impact of Civic Tech Innovation on Public Service Delivery." https://link.springer.com/chapter/10.1007/978-3-031-75079-3_8
52. Frontiers. (2025). "Digital governance and civic inclusion to enhance public participation in political decision-making processes." https://www.frontiersin.org/journals/political-science/articles/10.3389/fpos.2025.1671373/full
53. ACM. (2021). "Citizen Participation and Machine Learning for a Better Democracy." *Digital Government: Research and Practice*. https://dl.acm.org/doi/10.1145/3452118
54. arxiv. (2022). "A Review of Research on Civic Technology: Definitions, Theories, History and Methodologies." https://arxiv.org/pdf/2204.11461

### ニュース・解説記事

55. The Conversation. (2025). "How 18F transformed government technology — and why its elimination matters." https://theconversation.com/how-18f-transformed-government-technology-and-why-its-elimination-matters-251333
56. Lawfare. (2025). "Learning From the Legacy of 18F." https://www.lawfaremedia.org/article/learning-from-the-legacy-of-18f
57. Federal News Network. (2025). "How Healthcare.gov's botched rollout led to a digital services revolution in government." https://federalnewsnetwork.com/technology-main/2025/07/how-healthcare-gov-botched-rollout-led-to-a-digital-services-revolution-in-government/
58. StateScoop. "Cut loose, Code for America's former local brigades look to regroup." https://statescoop.com/code-for-america-former-brigades-regroup/
59. StateScoop. "Now 10 years old, Code for America hopes for government to walk alone." https://statescoop.com/ux-user-experience-code-for-america-10-years-old-digital-services/
60. MIT Technology Review. (2018). "The simple but ingenious system Taiwan uses to crowdsource its laws." https://www.technologyreview.com/2018/08/21/240284/
61. Nippon.com. "Is Japan's Political Funds Control Act Working as Intended?" https://www.nippon.com/en/japan-data/h01909/
62. Nippon.com. "Attacking the Roots of Japan's Slush Fund Scandal: A Call for Transparency in Political Finance." https://www.nippon.com/en/in-depth/d00973/
63. Investigative Reporting Workshop. "Loopholes keep voters in the dark in Japan." https://archive.investigativereportingworkshop.org/news/loopholes-keep-voters-in-the-dark-in-japan/
64. Brookings. "Is the politicization of generative AI inevitable?" https://www.brookings.edu/articles/is-the-politicization-of-generative-ai-inevitable/
65. Wikipedia. "Code for America." https://en.wikipedia.org/wiki/Code_for_America
66. Wikipedia. "GovTrack." https://en.wikipedia.org/wiki/GovTrack
67. Wikipedia. "OpenSecrets." https://en.wikipedia.org/wiki/OpenSecrets
68. Wikipedia. "United States Digital Service." https://en.wikipedia.org/wiki/United_States_Digital_Service
69. Wikipedia. "18F." https://en.wikipedia.org/wiki/18F
70. Wikipedia. "Pol.is." https://en.wikipedia.org/wiki/Pol.is
71. Wikipedia. "Political funding in Japan." https://en.wikipedia.org/wiki/Political_funding_in_Japan

### 日本関連

72. 総務省. "政治資金収支報告書." https://www.soumu.go.jp/senkyo/seiji_s/seijishikin/
73. Library of Congress. "Regulation of Campaign Finance and Free Advertising: Japan." https://maint.loc.gov/law/help/campaign-finance-regulation/japan.php
74. Lexology. "In brief: political finance in Japan." https://www.lexology.com/library/detail.aspx?g=f0d7a3de-ceed-44f4-b2c4-844666cf2e72

---

*本レポートは2026年2月12日時点の調査に基づく。*
