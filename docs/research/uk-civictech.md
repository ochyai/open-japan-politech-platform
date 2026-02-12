# 英国（UK）のCivicTech・政治デジタル化・オープンガバメント

## 概要

英国は世界のCivicTech（シビックテック）領域において最も先進的な国の一つである。2003年のmySociety設立以降、市民社会組織、政府機関、学術研究機関が三位一体となって、議会監視、情報公開、市民報告、選挙データ、ファクトチェック、行政デジタル化の各領域でオープンソース・オープンデータのエコシステムを構築してきた。本章では、英国CivicTechの主要プロジェクト、制度的基盤、技術アーキテクチャ、学術的知見を体系的に整理し、その影響と課題を論じる。

---

## 1. mySociety：英国CivicTechの礎

### 1.1 組織概要

mySociety（https://www.mysociety.org/）は2003年に設立された英国の非営利団体であり、デジタルツールを通じた市民の民主的参加を支援する世界CivicTechの先駆者である。全サービスを合わせた年間セッション数は**3,000万**に達する（2024-25年度）[1]。

### 1.2 主要プラットフォーム

#### TheyWorkForYou（議員活動追跡）

- **URL**: https://www.theyworkforyou.com/
- **GitHub**: https://github.com/mysociety/theyworkforyou
- **技術スタック**: PHP, MySQL
- **ライセンス**: AGPL v3
- **機能**: Hansard（議事録）の構造化・検索、議員の投票記録・発言追跡、メールアラート
- **2024-25年度実績**:
  - 訪問数：**268万8,874件**（議論・議員ページ）
  - 2024年総選挙期間（6週間）の訪問数：**140万件**
  - 数十万人がメールアラートを受信（議員発言時に通知）
- **API**: 議員情報、投票データ、発言記録等を提供

TheyWorkForYouは、英国議会下院（House of Commons）、上院（House of Lords）、スコットランド議会、北アイルランド議会の議事録を構造化し、市民が自分の選挙区の議員の活動を容易に追跡できるようにした。議員ごとの投票パターン分析や発言頻度の可視化は、選挙時の有権者の判断材料として広く利用されている。

#### FixMyStreet（市民報告プラットフォーム）

- **URL**: https://www.fixmystreet.com/
- **GitHub**: https://github.com/mysociety/fixmystreet（Star: 406, Fork: 202）
- **技術スタック**: Perl（Catalystフレームワーク）, Template Toolkit, PostgreSQL
- **ライセンス**: GNU AGPL v3
- **機能**: 地図ベースの地域問題報告（道路の穴、街灯故障等）→自治体への自動通報
- **2024-25年度実績**:
  - 報告件数：**102万731件**
  - 商用版（FixMyStreet Pro）を複数自治体が採用
- **国際展開**: 多言語・多法制度対応で世界各国にデプロイ可能

FixMyStreetは「市民報告→自治体通報→修繕」のサイクルを可視化することで、行政サービスの応答性を向上させた。ただし後述するように、利用者の70%以上が45歳以上という年齢偏りが指摘されている[2]。

#### WriteToThem（議員への手紙）

- **URL**: https://www.writetothem.com/
- **GitHub**: https://github.com/mysociety/writetothem
- **技術スタック**: PHP, Perl
- **ライセンス**: AGPL v3
- **機能**: 郵便番号から選出議員を特定し、オンラインで手紙を送付
- **2024-25年度実績**: **13万5,000通**の手紙が選出代表者に送付
- **影響測定**: 送信2週間後にフォローアップ調査を実施し、議員の応答率を公開

WriteToThemは「議員の応答率を可視化する」という手法により、議員の説明責任（accountability）を高める機能を果たしている。年1回の統計更新により、議員ごとの対応率がランキング化される。

#### WhatDoTheyKnow / Alaveteli（情報公開請求）

- **URL**: https://www.whatdotheyknow.com/（UK版）
- **Alaveteli**: https://alaveteli.org/（国際版プラットフォーム）
- **GitHub**: https://github.com/mysociety/alaveteli
- **技術スタック**: Ruby on Rails, PostgreSQL
- **ライセンス**: GNU AGPL v3
- **実績**:
  - FOI（情報公開）請求提出数：**15万2,567件**（2024-25年度）
  - アーカイブ閲覧数：**764万9,955回**
  - 累計FOI請求数：約**125万件**
  - 英国中央政府へのFOI請求の15-20%がWhatDoTheyKnow経由
- **国際展開**: 6大陸25以上の法域でデプロイ（ハンガリー、ニュージーランド、ウクライナ、イスラエル、EU等）
  - チェコ（Infoprovsechny）：約12,000公的機関にアクセス
  - EU（AskTheEU）：EU機関への情報公開請求
  - リベリア（InfoLib）、ウガンダ等

Alaveteli は WhatDoTheyKnow の国際展開版として設計された。Ruby on Railsで構築され、多言語対応・多法制度対応を実現している。FOI請求の提出、追跡、公開の一連のプロセスを市民が行えるようにすることで、政府の透明性向上に貢献してきた。累計100万件を超える請求は、英国のFOI制度の実効性を支えるインフラとなっている。

### 1.3 その他のプロジェクト

#### WhoFundsThem

mySocietyは議員の資金的利益（寄付、贈答、副業）を調査・データベース化するWhoFundsThemプロジェクトも運営。ボランティアによるデータ収集と議員への回答機会（Right of Reply）を組み合わせた手法を採用している。

#### 気候・環境データプラットフォーム

- **CAPE / Scorecards / Local Intelligence Hub**: 自治体・選挙区レベルの気候行動データを公開
  - 閲覧数：**65万回以上**
  - 200以上の組織がLocal Intelligence Hubを定期利用
  - 利用者の40%がその後議員に連絡
  - 英国の30%の自治体がScorecardsを環境政策に活用
  - 57以上の自治体が委員会でScorecardsを戦略策定に使用

#### TICTeC（The Impacts of Civic Technology Conference）

mySocietyが主催するCivicTech影響評価の国際学会。2024年は242名（研究者、活動家、資金提供者、技術者）が参加し、51セッションが実施された。

### 1.4 利用統計サマリー（2024-25年度）

| サービス | 主要指標 |
|---|---|
| TheyWorkForYou | 268万訪問（議論・議員ページ）、140万訪問（選挙6週間） |
| FixMyStreet | 102万件の地域問題報告 |
| WriteToThem | 13.5万通の手紙送付 |
| WhatDoTheyKnow | 15.3万件のFOI請求、765万アーカイブ閲覧 |
| 全サービス合計 | 3,000万セッション |

### 1.5 技術スタック・ライセンスまとめ

| プロジェクト | 言語/フレームワーク | ライセンス |
|---|---|---|
| TheyWorkForYou | PHP, MySQL | AGPL v3 |
| FixMyStreet | Perl (Catalyst), PostgreSQL | GNU AGPL v3 |
| WriteToThem | PHP, Perl | AGPL v3 |
| Alaveteli | Ruby on Rails, PostgreSQL | GNU AGPL v3 |

全プロジェクトがAGPL v3ライセンスを採用している点は注目に値する。AGPLはネットワーク経由のサービス提供時にもソースコード公開を義務付けるため、CivicTechプラットフォームの国際展開・派生開発を促進しつつ、コードの公開性を保証する戦略的選択と評価できる。

---

## 2. UK Parliament Digital Service（議会デジタルサービス）

### 2.1 概要

英国議会のParliamentary Digital Service（PDS）は、議会データのオープン化とデジタルアクセシビリティを推進する専門組織である。複数のAPIとデータプラットフォームを通じて、議会の活動データを構造化された形式で公開している。

### 2.2 主要APIとデータサービス

#### api.parliament.uk

- **URL**: https://api.parliament.uk/
- **Developer Hub**: https://developer.parliament.uk/
- **ライセンス**: Open Parliament Licence
- **提供API**:
  - **Members API**: 議員情報（所属政党、選挙区、写真、登録利益）
  - **Bills API**: 両院の法案データ（進捗状況、修正案、投票結果）
  - **Commons Divisions API**: 下院投票データ
  - **Lords Divisions API**: 上院投票データ
  - **Oral Questions API**: 口頭質問・動議
  - **Written Questions API**: 書面質問と回答、大臣声明
  - **Committees API**: 両院委員会（メンバーシップ、調査、出版物）
  - **Register of Members' Financial Interests API**: 議員利益登録簿

#### data.parliament.uk

- **URL**: https://data.parliament.uk/
- **Dataset Explorer**: https://explore.data.parliament.uk/
- PDSが管理するオープンデータセットのディレクトリ

#### Historic Hansard

- **URL**: https://api.parliament.uk/historic-hansard/
- 1803年から2005年までの歴史的議事録をデジタル化
- HTML、OPML、JSON形式で提供
- hansard.parliament.ukへの統合が進行中

### 2.3 データ利活用エコシステム

議会APIのオープン化により、TheyWorkForYou等の市民社会ツールとのデータ連携が実現している。Rパッケージ「hansard」（https://github.com/evanodell/hansard）など、サードパーティの分析ツールも開発されている。データはOpen Parliament Licenceの下で公開されており、商用・非商用を問わず再利用が可能である。

### 2.4 技術的特徴

- RESTful APIアーキテクチャ
- JSON/XML形式でのデータ提供
- Linked Open Data（LOD）の活用
- セマンティックウェブ技術による議会オントロジーの構築

---

## 3. GOV.UK / GDS（Government Digital Service）

### 3.1 概要と歴史

Government Digital Service（GDS）は2011年に設立された英国内閣府（現：科学・イノベーション・技術省）の組織であり、政府のデジタルサービス変革を主導してきた。GOV.UK（https://www.gov.uk/）を統合的な政府ウェブサイトとして構築し、「Government as a Platform（GaaP）」の概念を世界に先駆けて実践した。

2024年、労働党政権下でGDSとCDDO（Central Digital and Data Office）は科学・イノベーション・技術省に移管された。

### 3.2 GDS Design Principles（10原則）

GDSが策定した10のデザイン原則は、世界各国の行政デジタル化に影響を与えた[3]：

1. **Start with user needs**（ユーザーニーズから始めよ）
2. **Do less**（やることを減らせ）
3. **Design with data**（データとともにデザインせよ）
4. **Do the hard work to make it simple**（困難な作業をして、シンプルにせよ）
5. **Iterate. Then iterate again**（反復せよ、さらに反復せよ）
6. **This is for everyone**（これは全ての人のためのものだ）
7. **Understand context**（コンテキストを理解せよ）
8. **Build digital services, not websites**（ウェブサイトではなく、デジタルサービスを構築せよ）
9. **Be consistent, not uniform**（画一的ではなく、一貫性を持て）
10. **Make things open: it makes things better**（オープンにせよ、それがより良くする）

第10原則「Make things open」は、GDSの "Coding in the Open" 方針として具体化されている。コード、デザイン、アイデア、意図、失敗のすべてを可能な限り公開し、再利用可能なプラットフォームとAPIを提供することを求める。

### 3.3 オープンソース方針とGitHubリポジトリ

- **GitHub Organization**: https://github.com/alphagov
- **リポジトリ数**: **約1,500以上**（2025年時点）
- **The GDS Way**: https://gds-way.digital.cabinet-office.gov.uk/ （標準・実践ガイド）

主要リポジトリ：

| リポジトリ | 内容 |
|---|---|
| govuk-design-system | 政府サービスのデザインシステム（スタイル、コンポーネント、パターン） |
| govuk-frontend | GOV.UK Design System のフロントエンド実装 |
| govuk-design-system-architecture | アーキテクチャドキュメント |
| design-principles | デザイン原則の公開 |

### 3.4 Government as a Platform（GaaP）

GDSは共通基盤サービス群を "Government as a Platform" として提供している：

- **GOV.UK Notify**: テキストメッセージ、メール、手紙の送信サービス
- **GOV.UK Pay**: 政府サービスの決済プラットフォーム（Apple Pay / Google Pay対応）
- **GOV.UK Forms**: フォーム作成ツール
- **GOV.UK Design System**: 統一的なUI/UXコンポーネント
- **UK Emergency Alerts**: 緊急警報システム

これらの共通プラットフォームにより、各省庁はゼロからサービスを構築する必要がなくなり、迅速かつ低コストでのサービスデジタル化が可能となった。GaaPの概念は、Tim O'Reillyの「Government as a Platform」論に基づくが、GDSはこれを世界で最も体系的に実装した組織と評価される。

### 3.5 GOV.UKの技術アーキテクチャ

- マイクロサービスアーキテクチャ
- Helmチャートによるデプロイ（Kubernetes）
- コンテンツ管理システム（CMS）としてのパブリッシングプラットフォーム
- 全コードがGitHub上で公開（Coding in the Open）

---

## 4. Democracy Club（選挙データのオープン化）

### 4.1 組織概要

Democracy Club（https://democracyclub.org.uk/）は、英国の選挙データをオープン化する非営利・非党派のCommunity Interest Company（CIC）である。ボランティアベースのデータ収集とAPI提供を通じて、有権者への情報提供を行う。

### 4.2 主要プロジェクト

#### Every Election

- 英国のあらゆる選挙（地方補欠選挙から総選挙まで）のオープンデータベース
- 郵便番号による選挙・投票用紙検索API
- 選挙区変更・Electoral Change Ordersの追跡

#### Who Can I Vote For?（WCIVF）

- **URL**: https://whocanivotefor.co.uk/
- 有権者向け投票情報ウェブサイト
- 候補者情報、政党マニフェスト、写真等を統合的に提供

#### Candidates Database

- 英国選挙の全候補者のオープンソースデータベース
- 選挙管理委員会、SNS企業、全国紙が利用

#### Where Do I Vote?（WDIV）

- 投票所検索サービス

### 4.3 2024年総選挙の実績

2024年は地方選挙と総選挙が重なり、Democracy Clubの活動が最大規模となった[4]：

| 指標 | 数値 |
|---|---|
| 郵便番号検索総数（4/1-7/4） | **2,000万件** |
| 総選挙週の検索数（5/22-7/4） | 1,447万件 |
| 投票所データ収集率 | **100%**（初の全自治体カバー）353/355自治体 |
| ユニーク投票所数 | 30,853箇所 |
| 総選挙候補者数 | 4,515人（史上最多） |
| 候補者写真カバー率 | **95%** |
| メールアドレス収集率 | 82.4% |
| ウェブリンク付き候補者率 | 88.5% |
| 候補者声明あり率 | 53.6% |
| サービスを利用した推定人数 | **1,400万人** |
| Democracy Clubツールを推奨した自治体 | **219（59%）** |
| ウィジェット埋め込み自治体 | 96（2023年の78から増加） |
| WCIVF満足度（総選挙） | 86% |
| WDIV満足度（総選挙） | 93% |
| WDIVで投票可能性が上がったユーザー | 78% |
| 新規ユーザー登録 | 7,250人 |
| メーリングリスト登録者 | 35,000人 |

#### 主要パートナーとトラフィック源

- Electoral Commission（YourVoteMatters）：選挙週の検索の20%
- BBC News：12%
- mySociety（TheyWorkForYou）：9%
- Labour Party API：14%
- Financial Times、YouGov、Electoral Calculus等の選挙予測サイトも利用

### 4.4 特筆すべき成果

- 候補者データベースは指名日翌日の午前1時までに完成
- チャリティ助成金に依存しない財政的独立を達成
- ウェールズ政府と連携し、600以上の投票所のアクセシビリティ情報を試験的に収集
- 選挙後には "your area" 代表者検索機能を新規ローンチ

---

## 5. Full Fact（自動ファクトチェック）

### 5.1 組織概要

Full Fact（https://fullfact.org/）は2009年設立の英国独立ファクトチェック組織であり、AI技術を活用した自動化ファクトチェックの世界的リーダーである。

### 5.2 AI技術アーキテクチャ

Full Fact AIの技術パイプラインは以下の構成をとる[5]：

1. **データ収集層**: オンラインニュース、ライブTV音声、ポッドキャスト、SNS、YouTubeからリアルタイムにデータ収集
2. **文分解（Atomization）**: 情報を個別の文（atomic unit）に分解
3. **主張分類（Claim Classification）**: BERT（Googleの事前学習済み言語モデル）をFull Fact独自のアノテーションデータでファインチューニングした分類器により、数十万文から数万の関連主張を抽出
4. **主張照合（Claim Matching）**: 文ベクトル化とエンティティ分析のハイブリッドアプローチ。最近は生成AIモデルも導入し、多言語対応の訓練データを削減
5. **有害性評価**: 主張の誤り度、信憑性、行動喚起の可能性を複合的に評価
6. **自動検証**: 経済統計等の定量的主張について、信頼性の高いデータとの自動比較

### 5.3 処理規模と実績

- **日次処理量**: 約**33万文**（平日典型値）
- **AIチーム**: Andy Dudfield率いる8名
- **展開国数**: **40カ国以上**
- **対応言語**: 英語、フランス語、アラビア語
- **利用組織数**: 30カ国以上の40以上のファクトチェック組織

### 5.4 2024年英国総選挙での活用

- **450時間以上**のモニタリング活動
- 約**1億3,600万語**を142,909件の記事・トランスクリプト・SNS投稿から分析
- 約**217件の判定（verdict）**を発出
- 150以上のウェブサイト・動画コンテンツを公開

### 5.5 Full Fact Report 2025の主要知見

Full Fact Report 2025は、英国の情報環境に関する包括的な分析を提供している[6]：

- **偽情報の規模**: サウスポート事件後、Xでの反ムスリムスラーは10日間で**2倍以上**（40,000件超）、Telegramでは反ムスリムヘイトが**276%増**、反移民ヘイトが**246%増**
- **ディープフェイク**: 2024年総選挙で確認されたバイラルなディープフェイクは16件。Alan Turing Institute調査で国民の5.7%のみが政治的ディープフェイクを想起可能、18%は合成コンテンツとの遭遇を判別不能
- **選挙管理委員会調査**: 回答者の61%が政党政策に関する誤情報を目撃、52%が不正確な候補者情報を目撃
- **規制の限界**: Online Safety Act は違法コンテンツのみを対象とし、有害な誤情報の大半が規制対象外

### 5.6 国際展開

- 南アフリカ、ナイジェリア、リベリア、コンゴ民主共和国、セネガルの選挙をモニタリング
- 25のアラビア語圏組織が利用、200以上のファクトチェックが公開
- 2026年米国中間選挙に向け、米国報道機関へのツール提供を拡大中

---

## 6. Electoral Commission（選挙管理委員会）と政治資金透明化

### 6.1 制度的枠組み

英国の政治資金制度は、世界で最も透明な制度の一つとされる。Electoral Commission（選挙管理委員会）が政治資金データの収集・公開を担う。

### 6.2 Political Finance Online

- **URL**: https://www.electoralcommission.org.uk/political-registration-and-regulation/financial-reporting/political-finance-online
- **検索データベース**: https://search.electoralcommission.org.uk/
- **公開データ**:
  - 政党の四半期寄付報告
  - 選挙・住民投票時の支出報告
  - 年次会計報告書
  - 選挙後の候補者支出報告（候補者別の支出額・寄付額）
  - 非政党キャンペーン団体の資金データ
- **API提供**: 外部組織がデータを自身のアプリケーションに統合するためのAPIを公開
- **データ公開範囲**: 2017年7月以降の寄付・貸付データ（法的制約により、それ以前のデータは非公開）

### 6.3 2024年総選挙候補者データ

Electoral Commissionは2024年総選挙後、候補者の支出・寄付データを公開。候補者支出ツールでは、最も支出の多い候補者・少ない候補者、最も寄付を受けた候補者等の検索が可能。

### 6.4 透明性の課題

学術研究（Taylor & Francis, 2023）によれば、英国の政治資金透明性メカニズムには市民の理解度に関する課題がある[7]：

- **信頼度の低下**: 「政党・キャンペーン団体の資金に透明性がある」と同意する国民は**15%**（2011年の37%から低下）
- データの公開はされているものの、市民がデータを解釈し活用する能力・動機が不足している

---

## 7. シンクタンク・研究機関

### 7.1 Nesta（イノベーション財団）

Nesta（https://www.nesta.org.uk/）は、民主主義イノベーションとCivicTechに関する包括的な研究・支援を行うグローバルイノベーション財団である。

#### 主要研究・プロジェクト

- **Digital Democracy: The Tools Transforming Political Engagement**（2017年、Simon et al.）[8]
  - デジタル民主主義の類型論を提示
  - 4つの主要発見：(1) 定義の困難さ、(2) 技術先行の問題、(3) 有意義なエンゲージメントの有効性、(4) 評価の欠如
  - ブラジル・フランス・スペイン（Podemos）・アイスランド等の事例分析

- **Democracy Pioneers**: CivicTech革新に対する£100,000の賞金プログラム（最大10プロジェクト）

- **COLDIGIT（Collective Intelligence through Digital Tools for Democratic Innovation）**
  - ヘルシンキ大学、ヨーテボリ大学、Digidem Lab、SINTEFとの3年間の共同研究
  - ノルウェー・スウェーデン・フィンランドの参加型予算編成パイロット
  - 主要知見：地方政府の参加促進における最大の障壁は「資金不足」と「官僚主義」[9]
  - 成果物：集合知ツールリポジトリ、エコシステムモデル、政策提言

- **Democratic Innovation and Digital Participation Report**: 民主主義イノベーションの制度化・スケーリングに関する研究

- **Civic AI**: Nestaと Dark Matter Labs の共同プロジェクト（気候危機への市民的AI活用）

#### Nestaの分析フレームワーク

Nestaは民主主義イノベーションの成功要件として3つの要素を特定：
1. **明確な計画**: 利害関係者分析、包摂性のためのオフラインアウトリーチ
2. **制度的支援**: 議員の支持、十分な広報リソース、大量提出への対応システム
3. **ツール選定**: UXの向上、論点の明確化、プロセス操作の防止

### 7.2 Dark Matter Labs

Dark Matter Labs（https://darkmatterlabs.org/）は、建築家が設立したフィールドラボラトリーであり、根本的な市民社会のための制度的インフラ構築を目指す。

#### Civic Tech Studio

Dark Matter Labsの「クラフト層」として、10年間のプロトタイピングとテストから生まれた実践的部門。デジタル・物理的ツールの開発を通じて、ガバナンス、インフラ、価値の新理論を探求する。

> "21世紀のシビックテックは、単なるガバナンスのデジタル化ではなく、インフラストラクチャ的ケアの耕作である"

#### CivicAI

気候危機への市民的対応として、AIと集合知の組み合わせを探求する研究プロジェクト：
1. **Connected Urban Forest**: 人間と機械が協働して都市森林をマッピング・モニタリング
2. **Collective Climate Action**: 集合知とAIでコミュニティのセンスメイキングと気候ポジティブ行動を支援
3. **Participatory Energy**: 参加型エネルギー管理

### 7.3 Oxford Internet Institute（OII）

Oxford Internet Institute（https://www.oii.ox.ac.uk/）は2001年設立のオックスフォード大学の研究機関であり、インターネットと関連技術の社会的・政治的・経済的影響を研究する世界最高峰の学術拠点である。

#### Programme on Democracy & Technology（DemTech）

- **URL**: https://demtech.oii.ox.ac.uk/
- 2012年から、アルゴリズム、自動化、計算プロパガンダの公共生活における利用を調査
- 定性的・比較的・定量的・計算的手法を組み合わせた厳密な社会科学研究

#### 主要研究テーマ

- **Open Data and Civic Engagement**: data.gov.uk等のオープンデータイニシアチブが市民参加に与える効果
- **Computational Propaganda**: 組織的SNS操作のグローバル調査（2020年時点で産業化されたディスインフォメーションを報告）
- **Digital Politics and Government**: デジタル技術が社会、経済、制度、個人の行動を形成する方法

---

## 8. 学術研究

### 8.1 主要文献

#### Helen Margetts et al., *Political Turbulence: How Social Media Shape Collective Action* (2016)

Oxford Internet InstituteのHelen Margetts教授による画期的著作[10]。

- **核心概念**: "tiny acts"（微小な政治参加行為）—いいね、共有、ツイート、リツイート、フォロー等—が参加のはしごを下方に拡張し、連鎖反応を通じて大規模な動員に発展しうる
- **知見**: オンラインでの集合行動の大半は失敗するが、一部は急速かつ劇的に成功する。成功する動員は予測不可能、不安定、持続困難
- **方法論**: ソーシャルデータを用いた実験とデータサイエンスの統合
- **受賞**: UK Political Studies Association W.J. McKenzie Prize（最優秀政治学書、2017年）

#### mySociety, "Who Benefits From Civic Technology?" (2015)

4カ国11プラットフォーム、3,705件の調査回答に基づく実証研究[2]：

- **先進国のユーザー層**: 年齢が高い（FixMyStreet利用者の70%が45歳以上、GovTrack利用者の74%が45歳以上）
- **性別**: 男性が支配的（FixMyStreet: 64%男性、GovTrack: 52%男性）
- **民族**: 少数民族の過少代表（英国: 利用者6% vs 人口9%）
- **教育**: 高学歴層に偏る（GovTrack: 59%学位保持 vs 全国平均39%）
- **政治的効果**: 80%以上がプラットフォームなしでは政府の行動が異なるだろうと回答
- **再利用意向**: 95%以上が再利用の意向
- **批判的含意**: "Male, Pale and Stale" 効果—先進国ではすでに政治参加している層（高齢・高学歴・白人男性）に偏重し、マイノリティの懸念が増幅されない

#### Hélène Landemore, "Open Democracy and Digital Technologies" (2020)

「開かれた民主主義（Open Democracy）」の概念を提示し、デジタル技術による実現可能性を論じた[11]：

- **5つの原則**: 参加の権利、熟議、多数決原理、民主的代表、透明性
- **技術的含意**: 拡張現実ツールが大規模会議を可能にし、「ミニ・パブリックス」（無作為抽出された市民による熟議）を促進

#### Bernholz, Landemore & Reich (eds.), *Digital Technology and Democratic Theory* (2021)

Lucy Bernholz, Hélène Landemore, Rob Reichによる編著[12]。デジタル技術と民主主義理論の交差点における体系的な学術論集。

#### Simon et al., "Digital Democracy: The Tools Transforming Political Engagement" (Nesta, 2017)

Nestaの研究レポート。デジタル民主主義ツールの類型論と国際事例分析を提供[8]。

#### Westminster Foundation for Democracy, "Using Digital Technology for Democratic Resilience, Transformation and Impact" (2024-2025)

デジタルアプローチが民主主義支援に有意義な違いをもたらすかについてのエビデンス構築を目的としたプログラム[13]：
- デジタル投票システムのパイロットで参加率が**50%以上**に（通常の約5%から劇的に改善）
- マージナライズされたグループからの参加も増加

#### Nature Humanities and Social Sciences Communications (2025)

"Citizen participation and technology: lessons from the fields of deliberative democracy and science and technology studies"—熟議民主主義とSTS（科学技術社会論）の両分野からの市民参加と技術に関するレビュー論文[14]。

#### OECD, "Tackling Civic Participation Challenges with Emerging Technologies" (2025)

OECDの政策ブリーフ。新興技術による市民参加の課題への取り組みを分析[15]。CivicTechの定義として「民主主義を強化するためのデジタル技術の使用であり、市民が情報を得て、意思決定・政策策定に参加し、政府の応答性と説明責任を高めるもの」を提示。

#### Sheridan & Reidy, "Public Understanding of Electoral Spending: Evaluating UK Transparency Mechanisms" (Taylor & Francis, 2023)

英国の選挙支出透明性メカニズムの市民理解度に関する実証研究[7]。

### 8.2 定量的知見の整理

| 指標 | 数値 | 出典 |
|---|---|---|
| FixMyStreet年間報告件数 | 102万件 | mySociety Impact Report 2025 |
| TheyWorkForYou選挙期間訪問 | 140万件 | 同上 |
| FOI請求累計（WhatDoTheyKnow） | 約125万件 | 同上 |
| 中央政府FOI請求のWDTK経由比率 | 15-20% | Alaveteli.org |
| CivicTech利用者の再利用意向 | 95%以上 | Who Benefits |
| FixMyStreet利用者の45歳以上比率 | 70% | Who Benefits |
| 先進国CivicTech利用者の男性比率 | 52-72% | Who Benefits |
| 政治資金透明性への信頼度 | 15% | Electoral Commission |
| Democracy Club郵便番号検索（2024選挙） | 2,000万件 | DC Report 2024 |
| Democracy Clubサービス利用者 | 1,400万人 | DC Report 2024 |
| Full Fact日次処理文数 | 33万文 | Full Fact AI |
| Full Fact総選挙分析語数 | 1.36億語 | Full Fact Report 2025 |
| alphagov GitHubリポジトリ数 | 1,500以上 | GitHub |
| デジタル投票パイロットの参加率向上 | 5%→50%以上 | WFD 2024 |

---

## 9. 総合分析：英国CivicTechの特徴と課題

### 9.1 エコシステムの構造

英国CivicTechの強みは、市民社会（mySociety, Democracy Club, Full Fact）、政府（GDS, Parliamentary Digital Service, Electoral Commission）、学術（OII, Nesta）の三セクターが相互に連携し、データの循環を生み出している点にある。議会APIのオープン化→TheyWorkForYouによる市民向け可視化→学術研究による影響評価→政策提言→制度改善、という正のフィードバックループが形成されている。

### 9.2 技術的共通特徴

- **オープンソース**: AGPL v3ライセンスの一貫採用（特にmySociety）
- **オープンデータ**: Open Parliament Licence / Open Government Licenceによるデータ公開
- **APIファースト**: RESTful APIによるデータ提供を基本設計に組み込み
- **国際展開可能性**: 多言語・多法制度対応の設計（Alaveteli、FixMyStreet等）
- **Coding in the Open**: GDSの方針として、政府コードのGitHub公開

### 9.3 主要課題

1. **デジタル・デバイド**: CivicTech利用者は「高齢・高学歴・白人男性」に偏り、社会的弱者の参加が不十分（"Male, Pale and Stale" 問題）
2. **透明性パラドックス**: データは公開されているが、市民の理解・活用能力が追いつかない（政治資金透明性への信頼度15%）
3. **持続可能性**: ボランティアベースのデータ収集の限界、チャリティ助成金への依存（Democracy Clubは財政独立を達成した稀有な例）
4. **偽情報・ディスインフォメーション**: Online Safety Actの規制範囲の限界、プラットフォーム企業の自主規制からの撤退（Metaのファクトチェック廃止等）
5. **評価の困難**: CivicTechの「影響」を定量的に測定する方法論が未確立

### 9.4 日本への示唆

英国の経験から日本のCivicTech推進に向けて以下の示唆が得られる：

1. **議会APIの標準化**: 英国のapi.parliament.ukに相当する、国会・地方議会のオープンAPI構築
2. **AGPL v3ライセンス戦略**: CivicTechプラットフォームのコード公開とフォーク促進
3. **GDS Design Principlesの参考**: 「ユーザーニーズから始める」「オープンにする」原則の行政デジタル化への適用
4. **影響評価の制度化**: mySocietyのTICTeC、"Who Benefits"に相当する日本版CivicTech影響評価研究
5. **政治資金データのAPI化**: Electoral CommissionのPolitical Finance Onlineに相当する、総務省政治資金収支報告書のAPI公開
6. **ファクトチェックのAI化**: Full FactのBERTベースパイプラインを参考にした日本語ファクトチェック基盤

---

## 参考文献

[1] mySociety, "Impact Report 2024-25," mySociety Research, 2025. https://research.mysociety.org/html/impact-report-2025/

[2] mySociety, "Who Benefits From Civic Technology?" mySociety Research, 2015. https://research.mysociety.org/html/who-benefits/

[3] Government Digital Service, "Government Design Principles," GOV.UK, 2012 (updated). https://www.gov.uk/guidance/government-design-principles

[4] Democracy Club, "2024 Local and General Elections Report," 2024. https://democracyclub.org.uk/report_2024/

[5] Full Fact, "Full Fact AI," Full Fact, 2025. https://fullfact.org/ai/

[6] Full Fact, "Full Fact Report 2025," Full Fact, 2025. https://fullfact.org/policy/reports/full-fact-report-2025/

[7] Sheridan & Reidy, "Public Understanding of Electoral Spending: Evaluating UK Transparency Mechanisms," *Representation*, Taylor & Francis, 2023. https://www.tandfonline.com/doi/full/10.1080/00344893.2023.2207170

[8] Simon, J., Bass, T., Boelman, V. & Mulgan, G., "Digital Democracy: The Tools Transforming Political Engagement," Nesta, 2017. https://www.nesta.org.uk/report/digital-democracy-the-tools-transforming-political-engagement/

[9] Nesta, "COLDIGIT: Collective Intelligence through Digital Tools for Democratic Innovation," 2023-2025. https://www.nesta.org.uk/project/collective-intelligence-through-digital-tools-coldigit-democratic-innovation/

[10] Margetts, H., John, P., Hale, S. & Yasseri, T., *Political Turbulence: How Social Media Shape Collective Action*, Princeton University Press, 2016. https://press.princeton.edu/books/hardcover/9780691159225/political-turbulence

[11] Landemore, H., "Open Democracy and Digital Technologies," in Bernholz, Landemore & Reich (eds.), *Digital Technology and Democratic Theory*, University of Chicago Press, 2021. https://www.degruyterbrill.com/document/doi/10.7208/9780226748603-003/html

[12] Bernholz, L., Landemore, H. & Reich, R. (eds.), *Digital Technology and Democratic Theory*, University of Chicago Press, 2021.

[13] Westminster Foundation for Democracy, "Using Digital Technology for Democratic Resilience, Transformation and Impact," 2024-2025. https://www.wfd.org/what-we-do/resources/using-digital-technology-democratic-resilience-transformation-and-impact

[14] "Citizen participation and technology: lessons from the fields of deliberative democracy and science and technology studies," *Humanities and Social Sciences Communications*, Nature, 2025. https://www.nature.com/articles/s41599-025-04606-4

[15] OECD, "Tackling Civic Participation Challenges with Emerging Technologies," OECD, 2025. https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/04/tackling-civic-participation-challenges-with-emerging-technologies_bbe2a7f5/ec2ca9a2-en.pdf

[16] mySociety, "ICT and Citizen Efficacy: The Role of Civic Technology in Facilitating Government Accountability and Citizen Confidence," mySociety Research. https://research.mysociety.org/html/ict-and-citizen-efficacy/

[17] UK Parliament, "Developer Hub," UK Parliament, 2025. https://developer.parliament.uk/

[18] Electoral Commission, "Political Finance Online," Electoral Commission, 2025. https://www.electoralcommission.org.uk/political-registration-and-regulation/financial-reporting/political-finance-online

[19] Dark Matter Labs, "Civic Tech Studio," 2025. https://civictech.darkmatterlabs.org/

[20] Dark Matter Labs, "CivicAI," 2025. https://darkmatterlabs.org/feed/civic-ai

[21] Oxford Internet Institute, "Programme on Democracy and Technology," University of Oxford, 2025. https://demtech.oii.ox.ac.uk/

[22] Oxford Internet Institute, "Digital Politics and Government," University of Oxford, 2025. https://www.oii.ox.ac.uk/research/digital-politics-and-government/

[23] Nesta, "Democratic Innovation and Digital Participation Report," Nesta, 2023. https://www.nesta.org.uk/report/democratic-innovation-and-digital-participation-report/

[24] Government Digital Service, "The GDS Way," 2025. https://gds-way.digital.cabinet-office.gov.uk/

[25] GitHub (alphagov), "Government Digital Service," 2025. https://github.com/alphagov

[26] mySociety GitHub Organization, 2025. https://github.com/mysociety

[27] Alaveteli, "Deployments," mySociety, 2025. https://alaveteli.org/deployments/

[28] Democracy Club, "Data and APIs," 2025. https://democracyclub.org.uk/projects/data/

[29] Full Fact, "The AI Election: How Full Fact is Leveraging New Technology for UK General Election Fact Checking," 2024. https://fullfact.org/blog/2024/jun/the-ai-election-how-full-fact-is-leveraging-new-technology-for-uk-general-election-fact-checking/

[30] Electoral Commission, "General election candidate spending and donation data published," 2025. https://www.electoralcommission.org.uk/media-centre/general-election-candidate-spending-and-donation-data-published
