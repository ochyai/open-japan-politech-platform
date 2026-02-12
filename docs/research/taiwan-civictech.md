# 台湾におけるシビックテック・デジタル民主主義の展開

## 概要

台湾は、アジアにおけるデジタル民主主義の最先端事例として国際的に注目されている。Economist Intelligence Unit（EIU）の2024年民主主義指数において、台湾はスコア8.78で世界第12位、アジア第1位にランクされている（EIU, 2025）。この背景には、2012年のg0vコミュニティの発足以来、市民主導のシビックテック運動と政府のオープンガバメント政策が相互に影響し合いながら発展してきた独自の経緯がある。

本章では、台湾のシビックテック・エコシステムを構成する主要プラットフォームとプロジェクト——g0v、vTaiwan、Join、Pol.is、PDIS——を体系的に分析し、それらが政策形成・市民参加にもたらした定量的成果と、オードリー・タン（唐鳳）のデジタル大臣としての制度設計の役割を論じる。さらに、近年のAI活用によるブロードリスニング技術（Talk to the City, kouchou-ai）への展開についても検討する。

---

## 1. g0v（ガブゼロ / 零時政府）

### 1.1 設立経緯

g0vは2012年10月、高嘉良（Chia-liang Kao, clkao）、ipa、kirbyらによって設立されたオープンソース・オープンガバメントのコミュニティである（g0v.tw, n.d.）。その契機は、高嘉良が40秒の政府広告を見て「政府はどのように予算を使っているのか」という疑問を抱き、英国のOpen Knowledge Foundationのソースコードを参考に「中央政府予算可視化サイト」を開発したことにある。このプロジェクトはYahoo! Open Hack Day 2012で発表され、大きな反響を呼んだ（Taiwan Panorama, n.d.）。

g0vの名称は、政府ウェブサイトのドメイン「gov.tw」の「o」を「0」に置き換えたもので、「ゼロから政府を再構築する」という理念を象徴している。

### 1.2 組織構造とコミュニティ規模

g0vは中心的なリーダーを持たない分散型コミュニティであり、隔月で大規模ハッカソンを開催している。過去8年間で39回の大規模ハッカソンを開催し、各回100名以上が参加、累計参加者数は7,000名以上、数百の新規プロジェクトが生まれた（g0v Jothon, n.d.）。COVID-19パンデミック中にはオンラインハッカソンを実施し、台湾、日本、韓国、香港、シンガポール、米国からの参加者を集め、YouTube のライブストリームで3,000回以上の視聴を記録した。Slackでは400人以上が同時接続した（CommonWealth Magazine, 2021）。

主要なコミュニケーション基盤として、Slack、HackMD（共同編集マークダウンツール）、GitHub等を活用している。HackMDはg0vコミュニティから派生したプロジェクトであり、現在は独立したサービスとして世界中で利用されている。

### 1.3 主要プロジェクト

#### 1.3.1 中央政府予算可視化

g0vの原点となるプロジェクト。数百ページに及ぶ政府予算書を、インタラクティブなバブルチャートで視覚化した。各省庁への予算配分をクリックで確認でき、年間予算を「iPhone 30万台分」のような市民にとって身近な尺度に換算する機能を持つ。このプロジェクトは台北市を含む7つ以上の地方政府に採用された（Taiwan Panorama, n.d.）。

#### 1.3.2 Cofacts（真的假的）

LINEメッセンジャー上で動作するファクトチェックボットプロジェクト。ユーザーがLINE上のCofactsボットに疑わしいメッセージを転送すると、ボランティアエディタがファクトチェックを行い、結果を返信する仕組みである。2,000名以上のボランティアエディタが参加し、87,000件以上の疑わしい記事を検証済みである。30万人以上がチャットボットを利用し、毎週平均650件以上の新規メッセージを受信している（Rights CoLab, n.d.; CommonWealth Magazine, 2024）。タイでも同様の手法が展開されている。

#### 1.3.3 COVID-19マスクマップ（2020年）

COVID-19パンデミック時、台湾政府はマスクの配給制度（週2枚/人）を導入した。政府がリアルタイム在庫データのAPIを公開し、g0vコミュニティのエンジニアがわずか72時間で位置情報ベースのマスク在庫マップアプリを開発した。データは3分ごとに更新され、「BuyFaceMask」アプリは公開初日に約100万件の問い合わせを処理した（Foreign Affairs, 2020; CommonWealth Magazine, 2020）。このプロジェクトは、政府とシビックテックコミュニティの迅速な協働の成功事例として国際的に注目された。

#### 1.3.4 HackMD

g0vコミュニティの共同作業から生まれたリアルタイム協調マークダウンエディタ。オープンソース版（CodiMD）と商用版（HackMD）がある。g0vのハッカソンやプロジェクトで広く使われ、現在はグローバルに展開されている。

#### 1.3.5 GitHubリポジトリ

g0vのGitHubオーガナイゼーション（github.com/g0v）には多数のリポジトリが公開されており、予算可視化、政策提案ツール、初心者向けガイド等が含まれる。

### 1.4 学術論文での分析

- **IPSA World Congress 2021**: 「Incubating Democracy with Civic Technology: The Case of G0V.tw Community in Taiwan」——g0vが政治参加の戦略を再構築し、政治動員の方法を再構造化し、政府と社会の関係を再定義していることを論じた（IPSA, 2021）。
- **Lee (2020)**: 「Free the Data from the Birdcage: Opening Up Data and Crowdsourcing Activism in Taiwan」——選挙資金データのデジタル化プロジェクト（Campaign Finance Digitization）を事例に、g0vのクラウドソーシング活動を人類学的に分析した（PoLAR: Political and Legal Anthropology Review）。
- **Cheng (2017)**: 「Keyboard Participation: A Case Study of 'G0v.Tw' on Open-Source Collaborative Citizen Engagement in Hacking Community」——国立台湾大学修士論文。

---

## 2. ひまわり運動（太陽花運動）とシビックテックの転換点

2014年3月、台湾で「ひまわり学生運動」（太陽花運動, Sunflower Movement）が発生した。中国との「サービス貿易協定」に反対する学生・市民が23日間にわたり立法院を占拠した抗議運動である（EPD, 2023）。

この運動においてg0vメンバーは技術的支援者として重要な役割を果たした。占拠された立法院内でインターネット接続を構築し、抗議者と外部との通信を可能にした。また、貿易協定の草案をオープンデータとして公開し、市民が内容を精査できるようにした（SocialTech Thailand, n.d.）。

ひまわり運動は二つの重要な帰結をもたらした。第一に、シビックテックコミュニティと市民社会・社会運動グループとの連携が強化された。第二に、与党国民党に打撃を与え、その後成立した新政権がシビックテックコミュニティとの協働を積極的に推進し、vTaiwanプラットフォームの創設やオードリー・タンのデジタル大臣就任に繋がった。

---

## 3. vTaiwan

### 3.1 プロセス設計

vTaiwanは2014年に開始された、オンラインとオフラインを組み合わせたオープン・コンサルテーション・プロセスである。台湾市民と政府をオンライン・オフライン双方の空間で結びつけ、国家的課題について熟議し、「ラフ・コンセンサス」（rough consensus）に到達することを目的とする（Hsiao et al., 2018）。

プロセスは以下の4段階で構成される:

1. **提案（Proposal）**: 議題の設定。政府機関または市民が課題を提起する。
2. **意見収集（Opinion）**: Pol.isを用いた大規模オンライン意見収集。参加者はステートメントに対して「賛成」「反対」「パス」で投票し、自らステートメントを追加できる。
3. **熟考（Reflection）**: 意見収集の結果をもとに、参加者と政府代表がオンライン・オフラインで議論し、「ラフ・コンセンサス」の所在を特定する。80%以上の合意を得た提案が次の段階のアジェンダとなる。
4. **立法（Legislation）**: コンセンサスを政策ガイドラインまたは法案に転換し、政府機関や議会に提出する。

### 3.2 具体的な政策反映事例

#### 3.2.1 UberX規制（2015年）

vTaiwanの最も代表的な成功事例である。6年間の膠着状態にあったライドシェアリングサービスUberの規制問題を、vTaiwanプロセスを通じて解決した。Pol.is上の意見収集段階で925名が参加し、145のステートメントが投稿され、31,115票が投じられた（vTaiwan史上最多）。2時間のライブストリーム協議会議には1,875名がオンラインで参加した。結果として、交通通信省はPol.is上で達成されたコンセンサスを批准し、Uber Inc.、台北タクシー運転手協会、台湾タクシー、関連省庁間で合意された7つの条件付きでUberサービスを合法化する既存規制の改正を行った（CrowdLaw for Congress, n.d.）。

#### 3.2.2 その他の政策事例

- **遠距離医療（Telemedicine）**: 遠隔医療の規制枠組みに関する協議。
- **フィンテック・サンドボックス法（FinTech Sandbox Act）**: 金融技術分野で、現行法では規制されていない小規模実験を透明かつ説明責任を持って実施するための規制枠組み。
- **オンラインアルコール販売**: 電子商取引における酒類販売の規制。
- **電動スクーター規制**: e-scooterの法的枠組み。

### 3.3 定量データ

- 2015年〜2018年の間に**26件の議題**が議論された（Nesta, n.d.）。
- そのうち**80%が何らかの政府アクション**につながった。
- 2020年時点で、vTaiwanのメーリングリストには**200,000名**が登録（Participedia, n.d.）。
- 累計**200,000人以上**がオープン・ポリシーメイキング・プロセスに参加（MIT Technology Review, 2018）。
- **26件の法案**がデジタル経済に関連して策定された。

### 3.4 主要学術論文

- **Hsiao, Y.-T., Lin, S.-Y., Tang, A., Narayanan, D., & Sarahe, C. (2018)**. "vTaiwan: An Empirical Study of Open Consultation Process in Taiwan." SocArXiv. DOI: 10.31235/osf.io/xyhft ——vTaiwanの背景、プロセスフレームワーク、使用ツールを文書化し、UberXケーススタディを通じてオープンフォーマットとクラウドソーシング特性を分析。
- **Siddarth, D., Weyl, E. G., et al. (2020)**. "Taiwan: Grassroots Digital Democracy That Works." RadicalxChange Foundation ——台湾のデジタル民主主義の包括的分析。24百万人の市民の半数以上が参加した実験を記録。
- **2025 ACM FAccT論文**: "Bridging Voting and Deliberation with Algorithms: Field Insights from vTaiwan and Kultur Komitee"（ACM Conference on Fairness, Accountability, and Transparency, 2025）——Preference-based Clustering for Deliberation (PCD)、Human-in-the-loop MES、ReadTheRoom手法の3つの計算手法をvTaiwanに適用した研究。

---

## 4. Join（公共政策網路參與平臺）

### 4.1 プラットフォーム設計

Joinは2015年に国家発展委員会（NDC: National Development Council）が設立した政府公式のオンライン市民参加プラットフォームである（join.gov.tw）。台湾に法的に登録されたすべての市民（2018年以降は居住者も含む）が利用可能で、以下の機能を提供する:

- **請願（e-Petition）**: 市民が国家政府に対して提案を行い、支持を集めることができる。**5,000名以上の支持を得た提案は、関連政府機関が議論し、項目ごとに賛否の理由を説明する義務がある**。
- **政策討論（Policy Discussion）**: 政策策定・実施段階における意見収集。
- **政策レビュー**: 既存政策への意見提出。

### 4.2 参加規模

- 2018年時点で、台湾の2,300万人口のうち**約500万人**がJoinに登録（MIT Technology Review, 2018）。
- 2021年時点で**400万人以上**が参加（OpenGov Asia, 2021）。
- Bertelsmann Stiftungの報告では「台湾人口の半数近くがアクティブに利用」と記述（Bertelsmann Stiftung, n.d.）。

### 4.3 g0v/vTaiwanとの関係

Joinは政府が運営する公式プラットフォームであるのに対し、vTaiwanは市民社会主導のコンサルテーション・プロセスである。両者は補完的な関係にある。vTaiwanがデジタル経済・新興技術に関する専門的な政策協議に特化しているのに対し、Joinはより広範な政策領域を対象とし、市民の日常的な政策参加のチャネルとして機能している。我國公共政策網路參與機制之研究として、vTaiwanとJoinの比較分析を行った学位論文も存在する（台湾の大学, 2016）。

### 4.4 学術論文

- **IEEE (2021)**: "Towards a Model of Online Petition Signing Dynamics on the Join Platform in Taiwan"——Join上のオンライン請願の署名ダイナミクスのモデル化。
- **ACM DG.O 2024**: "A BERT-based Approach to Alleviate Civic Tech Tools Overcrowding: A case study of Taiwan's JOIN e-petition system"——BERTを用いたJoinプラットフォームの自然言語処理分析。
- **Taylor & Francis (2025)**: "When does digital democracy work? How policy domains shape government responses to online petitions in Taiwan"——政策領域がオンライン請願への政府対応にどう影響するかの分析。
- **MDPI Applied Sciences (2025)**: "Content Analysis of E-Participation Platforms in Taiwan with Topic Modeling"——トピックモデリングを用いた台湾の電子参加プラットフォームのコンテンツ分析。

---

## 5. Pol.is の台湾での運用

### 5.1 技術的仕組み

Pol.isは、参加型ウィキサーベイプラットフォームであり、大規模な熟議を可能にする。参加者はステートメント（短い意見文）に対して「賛成」「反対」「パス」で投票し、自らもステートメントを追加できる。プラットフォームは機械学習アルゴリズムを用いてリアルタイムで意見の地図を生成する（The Computational Democracy Project, n.d.）。

具体的には、**主成分分析（PCA: Principal Components Analysis）** と **K-means クラスタリング** を組み合わせ、類似の投票パターンを持つ参加者をグループ化する。K-meansは異なるK値で適用され、**シルエット係数（silhouette coefficient）** を用いて最適なクラスタ数を決定し、安定性を確保する。

### 5.2 「ブリッジング」の概念

Pol.isの革新的な特徴は、「ブリッジング・ステートメント」——異なる意見クラスタ間で高い合意を得るステートメント——を特定する機能にある。これにより、対立するグループ間の共通項を見出し、分極化を超えた合意形成を促進する。Pol.isは「既存の権力構造やヒエラルキーを覆すよう設計されており、参加者自身がリアルタイムで会話のアジェンダを設定し、テクノクラート的なサーベイメカニズムではなく、コミュニティのニーズの草の根的な表現を生み出す」（Siddarth, 2020）。

### 5.3 台湾での具体的運用

- **vTaiwan**: 意見収集段階の主要ツールとして使用。UberX事案では925名が参加し31,115票を投じた。
- **情報安全に関する熟議**: 政府が200,000人にランダムにテキストメッセージを送信し、層化無作為抽出で選ばれた450名が10人ずつのオンラインルームで熟議を行った。
- **AI規制に関する協議**: 2023年にvTaiwanはPol.isを使ってAIガバナンスに関する市民協議を実施。

### 5.4 関連論文

- **Hsiao, Y.-T. et al. (2018)**: vTaiwanでのPol.is運用を実証的に分析（前述）。
- **Aviv, R. et al. (2022)**: "Bridging-Based Ranking"——Belfer Center（Harvard Kennedy School）発表の論文。Pol.isのブリッジングに基づくランキングメカニズムの理論的分析。

---

## 6. オードリー・タン（唐鳳）の役割

### 6.1 経歴とg0vとの関係

オードリー・タン（1981年生）は、14歳で学校を中退した後、独学でプログラミングを学び、Perlコミュニティのコア開発者として世界的に知られるようになった。g0vコミュニティの活発な参加者であり、2014年のひまわり運動後、2016年に蔡英文政権下で史上最年少の35歳でデジタル大臣（政務委員）に就任した。台湾初のトランスジェンダーの閣僚でもある（Harvard Business School, n.d.; 80,000 Hours, n.d.）。

### 6.2 デジタル大臣としての制度設計

タンは「人民のために働くのではなく、人民と共に働く」（"Not working for the people, but working with the people"）という理念のもと、以下の制度設計を推進した:

- **ラディカル・トランスペアレンシー**: すべての公式ロビイング会議の完全な議事録を即日公開。逆監査（reverse audit）の仕組みにより、市民が政府の透明性を確保。
- **参加型ガバナンス**: 32省庁にわたる70人のイノベーション・オフィサー（Participation Officer, PO）のネットワークを構築。
- **サンドボックス・アプローチ**: 新しい規制枠組みの小規模実験を可能にする制度設計。
- **COVID-19対応**: マスクマップに見られるように、政府データのAPI公開とシビックテックコミュニティとの迅速な協働体制を構築。

### 6.3 理論的フレームワーク: Plurality（数位）

タンはE. Glen Weyl（マイクロソフト研究員）と共に、2024年4月に著書 "⿻ 數位 Plurality: The Future of Collaborative Technology and Democracy" を出版した（Tang & Weyl, 2024）。100名以上のオンライン共同執筆者による、史上初のオープンソース・自治型の書籍プロジェクトでもある（github.com/pluralitybook/plurality）。

同書は、デジタル技術が民主主義と協働を、分極化や不平等ではなく、強化するための道筋を提示する。主要な概念として:

- **⿻（Plurality）**: 社会的多様性の潜在的エネルギーを、衝突ではなく進歩・成長に向けるためのデジタルツール群。
- **ブリッジング**: 異なる意見集団間の共通項を見出す計算手法。
- **協調的多様性（Collaborative Diversity）**: 多様性を資産として活用する技術的・制度的設計。

### 6.4 受賞・評価

- 2024年Right Livelihood Award受賞（「もう一つのノーベル賞」として知られる）。
- ハーバード・ビジネス・スクール ケーススタディ: "Audrey Tang: Using Technology to Strengthen Democracy in Taiwan"（HBS Case No. 723-033）。
- Oxford大学DPIR講演: "The Frontier of Democracy"（2024年）。

---

## 7. PDIS（Public Digital Innovation Space / 公共數位創新空間）

### 7.1 組織構造

PDISは行政院（Executive Yuan）においてデジタル大臣と共に活動するチームであり、デジタルトランスフォーメーションとオープンガバメント運動を推進する組織である（pdis.nat.gov.tw）。主な機能は以下の通り:

- 公共デジタルイノベーションとサービスのインキュベーションとファシリテーション
- デザイン思考を用いた公共サービスのプロセス・ツール最適化
- 社会イノベーションの採用とコラボレーションの公共セクターへのガイダンス
- 「人間中心」の政策立案プロセスの実践

### 7.2 活動

PDISは毎週水曜日に市民、実務家、学者、公務員が集まり政府への提案を行うためのスペースを運営している。また、vTaiwanプロセスのファシリテーション、各省庁のPO（Participation Officer）の調整、サービスデザインワークショップの実施等を行っている。

### 7.3 オープンソース成果物

PDISのGitHubオーガナイゼーション（github.com/PDIS）には、vTaiwanの運営に関連するツール、サービスデザインのテンプレート、オープンガバメントに関するドキュメント等が公開されている。

---

## 8. Talk to the City と kouchou-ai

### 8.1 Talk to the City（TttC）

Talk to the Cityは、AI Objectives Institute（カリフォルニア州の非営利団体）が開発したオープンソースのAIツールであり、大規模な民主的インプットの収集・分析を支援する。主な特徴は以下の通り（AI Objectives Institute, n.d.）:

- **LLMベースの意見分析**: 大量の市民意見を構造化し、テーマ・論点ごとにクラスタリングする。
- **引用ベースの透明性**: 各テーマ・要約が個別の参加者の引用に直接紐付けられており、LLMの幻覚（hallucination）のリスクを軽減する。
- **多様性の保存**: 多数派の意見だけでなく、少数派の視点も保存する設計。

### 8.2 学術的位置づけ

Turan & McKenzieによる論文では、TttCの3つの応用事例が分析されている: (1) 構成員内での共有原則の発見、(2) コミュニティ組織化における共有経験の編纂、(3) 分散型ガバナンスにおけるアクション志向の意思決定（AI Objectives Institute, n.d.）。

### 8.3 kouchou-ai（広聴AI）

kouchou-ai（広聴AI）は、日本の「デジタル民主主義2030」プロジェクトが開発した、Talk to the Cityの機能を改善・拡張したオープンソースツールである（github.com/digitaldemocracy2030/kouchou-ai）。

主な改善点:
- **非エンジニア向けUI**: CSVファイルをアップロードするだけで分析・レポート生成が可能なWebアプリケーション。
- **詳細分析機能**: Talk to the Cityの「全体像の把握」機能に加え、「詳細分析」「注目すべき領域の発見」機能を追加。
- **日本の地方自治体向け最適化**: 日本の自治体や政治家の実務ニーズに合わせた機能改善。

2025年3月16日にオープンソースとして公開され、衆議院選挙に関するSNS上の意見分析や、東京都の長期戦略「2050東京戦略」への市民意見分析等に活用されている（デジタル民主主義2030, 2025）。

### 8.4 ブロードリスニングの概念

「ブロードリスニング」（広聴）は、多様な市民の声を広く収集・可視化し、意思決定に活用する手法である。従来のタウンミーティングやパブリックコメントが「限られた参加者の声を聞く」モデルであったのに対し、AIを活用したブロードリスニングは「数千〜数万の声を構造化して聞く」モデルを提供する。2024年東京都知事選では、1,000名の東京都民の政策ニーズをTttCで分析する試みが行われた（AI Objectives Institute, n.d.）。

---

## 9. 台湾デジタル民主主義の定量的評価

### 9.1 民主主義指標

| 指標 | スコア / ランク | 出典 |
|------|---------------|------|
| EIU民主主義指数（2024年） | 8.78 / 世界12位 / アジア1位 | EIU (2025) |
| インターネット普及率（2019年） | 人口の93% | 各種報告 |
| モバイルインターネット利用率 | インターネットユーザーの98% | 同上 |
| Facebook利用率 | 人口の約90% | 同上 |

### 9.2 プラットフォーム参加データ

| プラットフォーム | 参加規模 | 期間 |
|----------------|---------|------|
| vTaiwan メーリングリスト | 200,000名 | 〜2020年 |
| vTaiwan 議論議題数 | 26件 | 2015〜2018年 |
| vTaiwan 政策反映率 | 80% | 2015〜2018年 |
| Join 登録者数 | 約500万人 | 〜2018年 |
| Cofacts 利用者数 | 300,000人以上 | 累計 |
| Cofacts 検証記事数 | 87,000件以上 | 累計 |
| Cofacts ボランティアエディタ | 2,000名以上 | 累計 |
| g0v ハッカソン累計参加者 | 7,000名以上 | 〜2020年 |

### 9.3 比較政治学的位置づけ

台湾のデジタル民主主義は、以下の点で比較政治学的に重要な位置を占める:

1. **ボトムアップ型**: 市民社会のシビックテックコミュニティ（g0v）が先行し、政府がそれを制度化した「ボトムアップ→制度化」モデルである。これはエストニアの「トップダウン型」デジタルガバメントとは対照的である。
2. **ハイブリッド型熟議**: オンライン（Pol.is, vTaiwan）とオフライン（対面協議）を組み合わせたハイブリッド型の熟議設計。
3. **オープンソース原則**: すべてのツール・プラットフォームがオープンソースで開発・公開されている。
4. **社会運動との連続性**: ひまわり運動という社会運動の経験が、シビックテックの発展に直接的に寄与した。
5. **スケーラビリティの実証**: 人口2,300万人規模の国家レベルで、デジタル熟議が政策に反映される仕組みが機能することを実証した。

---

## 10. 課題と限界

台湾のデジタル民主主義にもいくつかの課題が指摘されている:

1. **デジタルデバイド**: 高いインターネット普及率にもかかわらず、高齢者や低所得者層の参加率には偏りがある可能性がある。
2. **vTaiwanの活動低下**: 2018年以降、vTaiwanの新規議題数は減少傾向にあり、政府のコミットメントの持続性が課題となっている。
3. **Joinの限界**: 5,000署名のハードルを超えた請願に対する政府の対応が形式的にとどまるケースが指摘されている。
4. **対象領域の限定**: vTaiwanは主にデジタル経済関連の議題に特化しており、より広範な政策領域への拡張が求められている。
5. **制度的持続性**: オードリー・タンの個人的リーダーシップに依存する面があり、人事異動後の持続性が問題となりうる。

---

## 参考文献

### 学術論文・研究報告

- Hsiao, Y.-T., Lin, S.-Y., Tang, A., Narayanan, D., & Sarahe, C. (2018). "vTaiwan: An Empirical Study of Open Consultation Process in Taiwan." *SocArXiv*. DOI: 10.31235/osf.io/xyhft.
- Lee, C.-T. (2020). "Free the Data from the Birdcage: Opening Up Data and Crowdsourcing Activism in Taiwan." *PoLAR: Political and Legal Anthropology Review*, 43(2), 247–263.
- Cheng, T.-Y. (2017). "Keyboard Participation: A Case Study of 'G0v.Tw' on Open-Source Collaborative Citizen Engagement in Hacking Community." Master's thesis, National Taiwan University.
- Siddarth, D. (2020). "Taiwan: Grassroots Digital Democracy That Works." *RadicalxChange Foundation*. https://www.radicalxchange.org/updates/papers/Taiwan_Grassroots_Digital_Democracy_That_Works_V1_DIGITAL_.pdf
- Tang, A., & Weyl, E. G. (2024). *⿻ 數位 Plurality: The Future of Collaborative Technology and Democracy*. RadicalxChange Foundation.
- Ho, M.-s. (2023). "Exploring Worldwide Democratic Innovations: A Case Study of Taiwan." *European Partnership for Democracy*. https://epd.eu/content/uploads/2023/07/Case-Study-Taiwan.pdf
- Bridging Voting and Deliberation with Algorithms: Field Insights from vTaiwan and Kultur Komitee. (2025). *Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency (FAccT)*. DOI: 10.1145/3715275.3732205.
- Aviv, R. et al. (2022). "Bridging-Based Ranking." *Belfer Center, Harvard Kennedy School*.
- IEEE (2021). "Towards a Model of Online Petition Signing Dynamics on the Join Platform in Taiwan." *IEEE Conference Publication*.
- ACM DG.O (2024). "A BERT-based Approach to Alleviate Civic Tech Tools Overcrowding: A case study of Taiwan's JOIN e-petition system." *Proceedings of the 25th Annual International Conference on Digital Government Research*.
- Taylor & Francis (2025). "When does digital democracy work? How policy domains shape government responses to online petitions in Taiwan." *Information, Communication & Society*.
- MDPI (2025). "Content Analysis of E-Participation Platforms in Taiwan with Topic Modeling." *Applied Sciences*, 15(5), 2263.
- IPSA World Congress (2021). "Incubating Democracy with Civic Technology: The Case of G0V.tw Community in Taiwan."
- Nature (2025). "Internet use, support for democracy and political participation: a comparative study of Chinese mainland and Taiwan." *Humanities and Social Sciences Communications*.

### 書籍・報告書

- Harvard Business School (n.d.). "Audrey Tang: Using Technology to Strengthen Democracy in Taiwan." HBS Case No. 723-033.
- Economist Intelligence Unit (2025). *Democracy Index 2024*.
- Bertelsmann Stiftung (n.d.). "Trailblazers of digital participation: Taiwan's Join platform and vTaiwan." *Shortcut 8*.
- Nesta (n.d.). "vTaiwan." *Six Pioneers of Digital Democracy*.

### ウェブリソース・プラットフォーム

- g0v.tw (n.d.). https://g0v.tw/intl/en/
- g0v Jothon (n.d.). https://jothon.g0v.tw/about/en/
- vTaiwan (n.d.). https://info.vtaiwan.tw/
- Join (n.d.). https://join.gov.tw/
- PDIS (n.d.). https://pdis.nat.gov.tw/en/
- Pol.is / The Computational Democracy Project (n.d.). https://compdemocracy.org/
- AI Objectives Institute (n.d.). "Talk to the City." https://ai.objectives.institute/talk-to-the-city
- kouchou-ai (n.d.). https://github.com/digitaldemocracy2030/kouchou-ai
- CrowdLaw for Congress (n.d.). "vTaiwan." https://congress.crowd.law/case-vtaiwan.html
- Participedia (n.d.). "vTaiwan." https://participedia.net/method/vtaiwan

### メディア記事

- MIT Technology Review (2018). "The simple but ingenious system Taiwan uses to crowdsource its laws." https://www.technologyreview.com/2018/08/21/240284/
- Foreign Affairs (2020). "Civic Technology Can Help Stop a Pandemic." https://www.foreignaffairs.com/articles/asia/2020-03-20/
- TIME (2024). "Inside Audrey Tang's Plan to Align Technology with Democracy." https://time.com/6979012/
- CommonWealth Magazine (2021). "How the open source 'jothon online' collaborated during the pandemic."
- CommonWealth Magazine (2024). "The Evolving Role of Civic Tech against Disinformation in Digital Democracy."
- GovInsider (n.d.). "Exclusive: How Taiwan is reinventing government."
- Taiwan Panorama (n.d.). "Pioneers of Open Government: g0v's Civic Hackers."
- The Conversation (2020). "Hacking the pandemic: how Taiwan's digital democracy holds COVID-19 at bay."
- NPR (2020). "Audrey Tang brings civic tech to Taiwan's coronavirus pandemic response."

### GitHub リポジトリ

- g0v: https://github.com/g0v
- PDIS: https://github.com/PDIS
- Cofacts: https://github.com/cofacts
- Plurality Book: https://github.com/pluralitybook/plurality
- kouchou-ai: https://github.com/digitaldemocracy2030/kouchou-ai
- HackMD/CodiMD: https://github.com/hackmdio/codimd
