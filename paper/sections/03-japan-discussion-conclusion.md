# セクション5〜7：日本のケーススタディ、考察、結論

---

## 5. 日本のケーススタディ

### 5.1 日本の政治デジタル化の現状

日本の「デジタル化」は、行政DXと政治のデジタル化のあいだに著しい非対称性を抱えている。デジタル庁（2021年発足）を司令塔とする行政DXは着実に進展しており、マイナンバーカードの普及、電子申請サービスの整備、マイナポータルの機能拡充など、行政サービスのオンライン化は加速している。しかし、政治の意思決定プロセスそのもの――政策形成への市民参加、政治資金の透明化、立法過程の可視化――のデジタル化はほとんど手つかずの状態にある。

政治資金の領域では、2024年12月に可決された改正政治資金規正法が一定の前進を示すものの、その射程は極めて限定的である。同法は2027年から政治資金収支報告書のオンライン提出を義務化し、2028年4月までに検索可能なデータベースを構築することを定めた。しかし、オンライン提出が義務化される対象は政党本部、政治資金団体、国会議員関係政治団体のみであり、全政治団体のわずか約5%（約3,000団体）にすぎない。残りの大多数の政治団体はデータベース化の対象外である。さらに、現行制度では収支報告書は公開から3年で削除・廃棄されるという根本的な問題がある。米国のFEC（連邦選挙委員会）が1990年代中盤以降の全データをオンラインで永続保存し、RESTful APIを通じて構造化データとして提供しているのとは対照的である。

国会のデジタル化も「手続きの電子化」にとどまっている。衆議院では官報・会議録のペーパーレス化が進み年間約9,700万円の経費削減を実現したが、これは業務効率化の域を出ない。英国議会のParliamentary Digital Serviceがapi.parliament.ukを通じて議員情報、法案データ、投票記録、委員会情報をRESTful APIで公開し、TheyWorkForYouのようなNGOがそのデータを市民向けに再構成するエコシステムが形成されているのとは、質的に異なる段階にある。

地方自治体レベルでは、Decidimの導入事例がいくつか見られる。兵庫県加古川市（2020年〜、日本初導入）、福島県西会津町、京都府与謝野町、岩手県釜石市などでは、市民参加型合意形成プラットフォームとしてDecidimが実践されている。しかし、バルセロナ市が約40,000人と1,500の組織から10,000件の提案を集め、累計で参加型予算に3,000万ユーロを配分している規模と比較すると、日本のDecidim導入は実験的段階にとどまっている。

### 5.2 市民社会の取り組み

日本の政治デジタル化において、市民社会のアクターは限られた資源のなかで重要な役割を果たしてきた。

**Code for Japan**は、台湾のg0vに相当する日本のシビックテックコミュニティであり、Decidimの日本語化をはじめとする市民参加ツールの普及に取り組んでいる。しかし、g0vが隔月の大規模ハッカソンに累計7,000名以上が参加し、Cofacts（30万人以上が利用するファクトチェックボット）やマスクマップ（公開初日に100万件の問い合わせを処理）のようなプロジェクトを生み出してきたスケールと比較すると、日本のシビックテックコミュニティの規模と政策的影響力にはなお大きな差がある。

政治資金の透明化については、複数の民間プロジェクトが活動している。**一般社団法人政策推進機構**は、総務省と全47都道府県の選管データを統合した「政治資金収支報告書データベース」を構築した。約6万5千ページ、約50万件のデータレコードを専用OCRとAI（約90%の精度）で構造化し、無料で公開している。**公益財団法人政治資金センター**は、Google News Initiativeの支援を受けた専用OCRで約7万件の報告書をアーカイブし、3年で削除されるデータの永久保存を実現している。いずれも重要な取り組みであるが、米国のOpenSecretsがFECの構造化データを基盤として寄附者の名寄せ・業界分類・「回転ドア」追跡・ダークマネー追跡まで行い、マスメディアや研究者が日常的に参照するインフラとなっているのとは、エコシステムの成熟度が根本的に異なる。

**デジタルデモクラシー2030（DD2030）**は、台湾のvTaiwanやg0vに触発された超党派のオープンソースプロジェクトであり、広聴AI（Talk to the Cityの日本語実装）、いどばた（大規模熟議プラットフォーム）、Polimoney（政治資金可視化ダッシュボード、AGPL-3.0ライセンス）の3つの柱で活動している。DD2030は、後述するチームみらいとは組織的に関連があるものの、超党派利用を前提とした設計思想を持つ点で区別される。

### 5.3 チームみらいの事例

チームみらいは、AIエンジニア安野貴博（1990年生）が2025年5月に設立した政党であり、日本の政治デジタル化において最も注目すべき事例の一つである。2024年東京都知事選で結成された「チーム安野」を前身とし、2025年7月の参院選で政党要件を達成、2026年衆院選では比例で約381万票を得て衆院11議席を獲得した。「テクノロジーで政治をかえる」をミッションに掲げ、永田町に常駐するエンジニアチーム8名が「95%以上のコードをLLMが実装する」開発手法で、約45日で中規模アプリケーションをリリースする能力を持つ。

チームみらいが開発・運営するデジタルツール群は以下の7つである。

**みらい議会（Mirai Gikai）**は、国会で審議中の法案を一覧表示し、AIアシスタント機能で法案の内容を質問できるプラットフォームである。「やさしく」モードと「詳しく」モードの切替、ルビ機能など、情報のアクセシビリティに配慮した設計が特徴的である。ただし、チームみらいの賛否スタンスが表示される点で、情報提供と党派的立場表明が混在している。

**声が届くマニフェスト**は、市民が政策改善提案を投稿し、優れた提案が実際にマニフェストに反映される対話型政策プラットフォームである。約38,758件の質問と約6,198件の改善提案が寄せられた。GitHubのPRワークフローを政策策定に転用するという試みは技術的に先進的であり、policyリポジトリには5,000件以上の市民からのPRが提出された。しかし、対象はチームみらいのマニフェストに限定されており、全政党のマニフェストを比較検討できるプラットフォームではない。

**まる見え政治資金（Marumie）**は、サンキーダイアグラムによる政治資金の収支フロー可視化ツールであり、GitHub上で666スターを獲得している。AGPL-3.0ライセンスのオープンソースであり、クラウド会計システムとの連携による自動データ収集を実現している。公開2日間で約20万PVを記録し、自民党所属議員からも「全議員に義務化すべき」と評価された。しかし、現状ではチームみらい自身の政治資金のみが公開対象であり、全政党・全政治団体の政治資金を横断的に可視化するインフラではない。

そのほか、**AIあんの**（党首のデジタルツインによるAI政策質疑応答）、**アクションボード**（ゲーミフィケーション型政治参加プラットフォーム）、**広聴AI/いどばた**（ブロードリスニング・AI熟議プラットフォーム）、**AIファクトチェッカー**（SNS偽情報検証システム）が開発されている。AIファクトチェッカーは公明党が2025年の都議選・参院選向けに導入しており、AGPLライセンスによる他党への技術移転の実績を持つ。

技術的実装において、チームみらいはNext.js + Supabase + Prisma + Vercelを共通基盤とし、Langfuse（LLMOps）によるトレース・評価・コスト管理を統合した効率的な開発体制を確立している。GitHubにおいては、team-mirai org（8リポジトリ）とteam-mirai-volunteer（30リポジトリ）の合計38リポジトリ、約1,512スターという規模であり、日本の政党としては例外的なオープンソース開発体制を持つ。

**本論文の分析枠組みから見た構造的課題。** チームみらいのツール群は、技術的完成度において日本の政治デジタル化の最前線に位置する。しかし、本論文がセクション2で提示した4軸評価の観点からは、看過できない構造的課題が存在する。これらのツールは本質的に**政党に紐づいたツール**であり、**民主主義のインフラ**ではない。Marumieは自党の政治資金のみを公開し、声が届くマニフェストは自党の政策のみを対象とし、みらい議会は自党の賛否スタンスを併記する。これは、英国のmySocietyがTheyWorkForYouで全議員の活動を非党派的に追跡し、Electoral Commissionが全政党の政治資金データをAPIで公開している構造とは根本的に異なる。

チームみらいが強調する「他党でも利用可能」という設計思想は、AGPLライセンスの採用によって法的には担保されている。しかし、他党がチームみらいのブランドとドメイン（team-mir.ai）の下で自党の情報を公開するインセンティブは低い。marumie.team-mir.aiに自民党の政治資金が掲載される事態は、技術的に可能であっても政治的には想像しがたい。ツールが政党のサブドメインで運営されている限り、非党派的インフラとしての信頼性は構造的に制約される。

台湾のg0vが政府（gov.tw）のドメインを「ゼロから再構築する」という象徴的行為から始まったように、シビックテックの非党派性は単にライセンスの問題ではなく、ガバナンス構造、ブランディング、運営主体の独立性を含む総合的な設計の問題である。

### 5.4 日本への示唆

以上の分析から、日本の政治デジタル化に向けて3つの方向性が示唆される。

第一に、**FEC型の政治資金データ基盤の構築**が急務である。2028年に予定されている総務省のデータベースは第一歩として歓迎されるが、対象が全政治団体の5%にとどまる限り、本質的な透明化には至らない。全政党・全政治団体を対象とし、構造化データをAPIで提供し、無期限に保存する米国FECモデルに倣った包括的データ基盤が必要である。

第二に、**チームみらい型ツールの非党派・汎用版**の開発が求められる。Marumieの技術をベースに全政党の政治資金を可視化するプラットフォーム、みらい議会の技術をベースに全政党の立場を並列提示するプラットフォームなど、特定の政党に紐づかない「Open Civic Platform」構想の具体化である。DD2030のPolimoneyはその方向性の萌芽であるが、現時点でのデータ対象と機能は限定的である。

第三に、**台湾モデル（市民社会主導→政府取り込み）の日本版**の模索である。台湾では、g0vコミュニティが政府の外側でプロトタイプを作り、実証した上で制度化され、最終的にオードリー・タンのデジタル大臣就任という形で市民社会の人材が政府内に入った。日本でも、Code for Japanやシビックテックコミュニティが非党派的ツールの実証を蓄積し、それを制度的に取り込む経路を設計する必要がある。チームみらいの経路――すなわち政党としてデジタル議席を取り、党内からツールを開発する――は、一つの有効な経路であるが、それが唯一の経路ではないし、非党派性の観点からは最適でもない。

### 5.5 4軸評価

**非党派性: 極めて低い。** 日本の政治デジタル化において、非党派的な市民インフラはほぼ存在しない。最も技術的に先進的なチームみらいのツール群は政党に紐づいており、市民社会のプロジェクト（政策推進機構DB、政治資金センター）は重要であるが規模と機能が限定的である。英国のmySociety、米国のOpenSecrets、台湾のg0vに相当する、非党派的で包括的なシビックテック組織が不在である。

**OSS度: 部分的。** チームみらいはAGPL-3.0ライセンスで全ツールを公開しており、日本の政党としては例外的にオープンソースへのコミットメントが高い。DD2030のPolimoney（AGPL-3.0）やkouchou-aiも同様である。しかし、これらは自党用ツールのオープンソース化であり、非党派的OSSインフラとして設計されたものではない。市民社会側のプロジェクト（政策推進機構DB、政治資金センター）はクローズドソースである。

**制度的接合性: 低い。** 法制度が政治のデジタル化に追いついていない。改正政治資金規正法のオンライン義務化は全体の5%のみを対象とし、データベース化は2028年まで待たなければならない。国会のAPIは存在せず、議会データのオープン化は英国に大きく遅れている。Decidimの導入は地方自治体レベルにとどまり、国レベルの制度的統合は見られない。

**包摂性: 低い。** チームみらいのツール群の利用者はテック系に偏る傾向がある。ゲーミフィケーション型のアクションボードは若年テックリテラシー層には訴求するが、mySocietyの調査が示すように、CivicTech利用者は先進国では「高齢・高学歴・白人男性」（"Male, Pale and Stale"効果）に偏重する傾向があり（mySociety, 2015）、日本でも同様の課題が予想される。デジタルデバイドを考慮した包摂的設計は、今後の重要課題である。

---

## 6. 考察

### 6.1 非党派性の条件

本論文がセクション3〜5で分析した各国の事例を横断的に検討すると、政治デジタル化における非党派性を担保する条件として、3つの構造的要件が浮かび上がる。

第一に、**ガバナンスの独立性**である。台湾のg0v、英国のmySociety、米国のOpenSecretsに共通するのは、政治インフラの構築主体が政党や政府から独立した市民社会組織であるという点である。g0vは分散型コミュニティとして中心的リーダーを持たず、mySocietyは非営利団体として20年以上にわたり全党の議員活動を追跡し、OpenSecretsは退職した民主党・共和党双方の上院議員が超党派で設立した組織である。これらの事例では、インフラを作る主体と政治的アクターの間に明確な距離が置かれている。

第二に、**OSSによる透明性**である。mySocietyの全プロジェクトがAGPL v3ライセンスで公開され、Decidimがコミュニティ自身をDecidimで運営する再帰的ガバナンスを持ち、英国GDS（Government Digital Service）が "Coding in the Open" 方針で1,500以上のリポジトリをGitHubに公開しているように、コードの透明性は政治的中立性の検証を可能にする。ソースコードが公開されていれば、「このシステムは公平か」を誰もが検証できる。

第三に、**複数ステークホルダーの参加**である。英国のCivicTechエコシステムでは、市民社会（mySociety, Democracy Club, Full Fact）、政府（GDS, Parliamentary Digital Service, Electoral Commission）、学術（OII, Nesta）の三セクターが相互に連携し、データの循環を生み出している。議会APIのオープン化→市民社会によるデータの再構成→学術による影響評価→政策提言→制度改善という正のフィードバックループが形成されており、単一のアクターが独占する構造にはなっていない。

日本やヨーロッパの一部では、政党や自治体がインフラ構築を主導する傾向がある。チームみらいのケースはその典型であり、政党が自らの資源でツールを開発する速度と技術力は高いものの、政党がインフラを「所有」する構造は党派性のリスクを内包する。AIチャットボットの事例が示すように、わずか数回のやり取りで利用者の政治的見解がモデルのバイアスに引き寄せられるリスクがあり（University of Washington, 2025）、政治的ツールの運営主体の独立性は単なる形式的要件ではなく、実質的な民主主義の品質に関わる問題である。

### 6.2 オープンソースと民主主義

オープンソースソフトウェア開発の原則を政治プロセスに適用することの意義は、3つの側面から整理できる。

第一に、**Linus' Lawの政治版**である。Eric Raymondが定式化した「十分な目があれば、全てのバグは浅い」（given enough eyeballs, all bugs are shallow）という原則は、政治プロセスにも適用可能である。ソースコードが公開されていれば、アルゴリズムの偏り、データの欠落、設計上の不公正を多数の目で検出・修正できる。mySocietyが全プロジェクトにAGPL v3を採用しているのは、単なる技術的選択ではなく、「政治的バグ」の検出を制度化する戦略的判断である。英国GDSの第10原則「Make things open: it makes things better」も、同様の認識に基づいている。

第二に、**フォークの自由が政治的多元性を保証する**。オープンソースのもう一つの本質的特徴は、特定の組織がプロジェクトを私物化しようとした場合、コミュニティがフォーク（分岐）して独立した版を運営できる点にある。これは政治的文脈では、プラットフォームの中立性が損なわれた場合のセーフガードとして機能する。Decidimのコードベースが世界30カ国以上、500以上の機関で採用されているのは、AGPLライセンスによるフォークの自由がプラットフォームの信頼性を担保しているからである。

第三に、**AGPLの戦略的意義**である。AGPL-3.0はGPLのネットワーク版であり、ネットワーク経由でサービスを提供する場合にもソースコード公開を義務づける。これは、CivicTechプラットフォームがSaaS形態で提供される場合にもコードの透明性を保証するものであり、政治的ツールに最も適したライセンスの一つである。チームみらいが全ツールにAGPLを採用している判断は、この観点から高く評価される。

### 6.3 制度的接合性のジレンマ

アイスランドのクラウドソーシング憲法の事例は、デジタル民主主義にとって最も重要な教訓の一つを含んでいる。950人の市民による原則議論、25人による公選起草委員会、1,092人の市民によるオンラインフィードバック、そして国民投票での3分の2の賛成多数という正統性の高いプロセスを経ながら、**最終的に当時の議会によって拒否された**。市民参加で作られた成果物であっても、既存の政治制度がそれを受け入れなければ実現しない。デジタル民主主義は、テクノロジーの問題であると同時に、既存の権力構造との接合点（interface）の設計の問題なのである。

この「制度的接合性のジレンマ」に対して、各国はそれぞれ異なる解を見出してきた。

**台湾の解**は、「市民社会→人材→政府」の経路である。g0vコミュニティが政府の外側でプロトタイプを作り、ひまわり運動（2014年）を契機に政治的影響力を獲得し、最終的にオードリー・タンがデジタル大臣として政府内に入るという経路を辿った。タンは「人民のために働くのではなく、人民と共に働く」（"Not working for the people, but working with the people"）という理念のもと、32省庁にわたる70人のイノベーション・オフィサー（Participation Officer）のネットワークを構築した。この経路の特徴は、市民社会が制度の外側で実績を蓄積し、その人材と方法論が制度の内側に取り込まれるという「浸透型」のアプローチにある。

**英国の解**は、「政府がAPIを提供→NGOが活用」というデータ開放型のアプローチである。英国議会のParliamentary Digital ServiceがOpen Parliament Licenceの下でデータを公開し、mySocietyやDemocracy ClubがそのデータをAPIで取得して市民向けに再構成する。議会がインフラ（データ）を提供し、市民社会がフロントエンド（利用者体験）を担うという分業構造である。Electoral Commissionが全政党の政治資金データを公開し、WhoFundsThemのようなプロジェクトがそのデータを分析するのも同様の構造である。

比較政治学的に見ると、**制度的接合なしの成功例は存在しない**。Decidimがバルセロナで成功したのはAda Colau市長の政治的意志があったからであり、vTaiwanの議論の80%が何らかの政府アクションにつながったのはオードリー・タンの制度設計があったからである。ドイツ海賊党のLiquidFeedbackが衰退したのは、液体民主主義の理論的魅力にもかかわらず、制度的な拘束力を持たなかったからである。テクノロジーだけでは政治的変革は実現しないのである。

### 6.4 AIと政治デジタル化の未来

AIの政治プロセスへの導入は、新たな可能性と同時に深刻なリスクをもたらす。

Hall et al.の研究（Stanford, 2025）は、主要なLLM（ChatGPT、Claude、Gemini等）にユーザーから左寄りの政治的偏向を持つと圧倒的に認識されていることを明らかにした。OpenAIモデルが最も強い左寄り認識を受け、Googleモデルが最小であった。一方、XのGrokは右寄りにシフトしている。ワシントン大学の研究（2025）は、バイアスのあるAIチャットボットとの数回の対話だけで、ユーザーの政治的見解がモデルのバイアス方向にシフトすることを実証した。これらの知見は、AIを政治プロセスに導入する際の根本的な課題を示している。

この課題に対して、いくつかの方向性が模索されている。オードリー・タンが提唱する「アラインメント・アセンブリ」は、AIガバナンスを市民の集合知で行うモデルであり、AIの訓練データやファインチューニング方針を市民が協働で決定するという構想である。Consul DemocracyのLLM搭載Civic Assistantプロジェクト（Google Impact Fund支援、2025-2027年）は、音声入力対応、リアルタイム翻訳、AI生成の提案といった機能を完全オープンソースで開発する試みであり、CivicTechにおけるAI統合の最前線に位置する。

オープンソースAIモデルの重要性は、この文脈でとりわけ大きい。政治プロセスに使用するAIがプロプライエタリ（商用非公開）であれば、そのバイアスを検証する手段は限られる。オープンソースモデルであれば、多数の監視者がバイアスの検出・修正に参加できる。ソフトウェアの自由の4つの原則――実行、研究、改変、再配布の自由――は、政治的ツールにこそ不可欠な条件である。

### 6.5 限界と今後の課題

本研究にはいくつかの限界がある。

第一に、方法論上の限界として、本論文は定性的比較分析に依拠しており、各国の政治デジタル化の「成功」を厳密に定量的に測定する方法論を持たない。CivicTechの影響を定量的に評価する手法は、TICTeC（mySociety主催の国際学会）でも未確立の研究課題とされている。

第二に、事例選択のバイアスとして、本論文は台湾、英国、米国、ヨーロッパという成功事例に焦点を当てており、デジタル民主主義が失敗したケースや導入を断念したケースの体系的分析を行っていない。ドイツ海賊党のLiquidFeedbackの衰退やアイスランドのクラウドソーシング憲法の挫折を部分的に取り上げたが、「失敗のパターン」のより体系的な分析は今後の課題である。

第三に、時間的制約として、本論文のデータは2026年2月時点のものであり、急速に変化するデジタル政治の領域では、本論文の知見が短期間で陳腐化する可能性がある。特に、2028年に予定されている日本の政治資金データベース化、Consul DemocracyのLLM搭載Civic Assistantの成否、米国におけるUSDS/18Fの廃止の影響などは、今後のフォローアップが必要な論点である。

今後の研究課題として、以下が挙げられる。(1) CivicTechプラットフォームの利用者層の実証分析（デジタルデバイドの定量的評価）、(2) AIの政治的バイアスのオープンソース・モデルにおける低減手法の開発、(3) 日本の2028年政治資金データベースの設計に対する国際比較に基づく政策提言、(4) チームみらい型の「政党発シビックテック」と、g0v型の「市民社会発シビックテック」の長期的成果の比較評価。

---

## 7. 結論

本論文は、政治のデジタル化を行政のデジタル化（行政DX）から明確に区別したうえで、台湾、英国、米国、ヨーロッパ、日本の国際比較を通じて、非党派的・オープンソース的アプローチの有効性と条件を分析した。

分析の結果、以下の知見が導出された。

第一に、**政治のデジタル化は行政DXの延長線上にはない**。行政DXが「既に決まった政策をいかに効率的に届けるか」という問いに答えるのに対し、政治のデジタル化は「何を、誰が、どのように決めるか」という民主主義の根本問題に関わる。エストニアがe-VotingやX-Roadで世界最先端の行政DXを実現しながらも、政策形成プロセスへの市民参加という点では台湾やバルセロナに及ばないという事実が、この区別の重要性を裏づけている。日本のデジタル庁が構築するインフラは優秀であるが、そのインフラの上で何を実現するかを決めるプロセス自体がデジタル化されていない。

第二に、**非党派性は技術的要件ではなく制度設計の問題である**。AGPLライセンスによるコード公開は透明性の必要条件であるが、十分条件ではない。台湾のg0v、英国のmySociety、米国のOpenSecretsのように、ガバナンスの独立性、複数ステークホルダーの参加、運営主体のブランドの政治的中立性が組み合わさって、はじめて非党派的インフラとしての信頼性が確立される。チームみらいのツール群は技術的に先進的であるが、政党のサブドメインで運営される限り、この構造的課題を免れない。

第三に、**制度的接合なしにデジタル民主主義は成功しない**。アイスランドのクラウドソーシング憲法の挫折は、市民参加の正統性と既存制度の拒否権のあいだの緊張を象徴している。台湾モデル（市民社会からの人材浸透）と英国モデル（政府によるデータ開放）は、この緊張を異なる方法で解決した成功例である。日本においても、テクノロジーの開発と並行して、制度的接合点の設計が不可欠である。

第四に、**AIの政治プロセスへの導入には、オープンソースモデルと市民的監査が不可欠である**。LLMの党派的バイアスが実証されている現在、プロプライエタリなAIを政治プロセスに導入することは、検証不能なバイアスを民主主義の中核に埋め込むことに等しい。オードリー・タンの「アラインメント・アセンブリ」構想のように、AIガバナンスそのものを民主的プロセスに組み込む制度設計が求められる。

以上の分析を踏まえ、日本への提言として以下の3点を提示する。

**第一に、FEC型の包括的政治資金データ基盤の構築。** 全政党・全政治団体を対象とし、構造化データをAPIで提供し、無期限に保存する独立データ基盤の整備である。2028年に予定されている総務省のデータベースは第一歩であるが、対象の拡大、データ形式のAPI化、保存期間の無期限化が不可欠である。

**第二に、市民社会主導の非党派的CivicTechインフラの構築。** チームみらいの技術的成果を参照しつつも、特定の政党に紐づかない汎用的なOpen Civic Platformを、Code for Japanのような市民社会組織が主導して構築する。全政党の政治資金を可視化するプラットフォーム、全政党のマニフェストを比較検討できるプラットフォーム、国会の審議データをAPIで提供する基盤などが具体的な射程に含まれる。

**第三に、制度的接合の設計。** 台湾モデル（市民社会→政府への人材浸透）と英国モデル（政府によるデータ開放）を参照しつつ、日本の制度的文脈に適合した接合点を設計する。国会のAPI公開、Decidimの国レベル導入の検討、シビックテック人材の政策過程への参加を促す制度的経路の整備などが含まれる。

政治のデジタル化のために、デジタル議席を取る必要は必ずしもない。チームみらいの試みは、政党としてのデジタル化を推進する一つの有効な経路であるが、民主主義のインフラは特定の政党の所有物であってはならない。台湾のg0vが政党ではなく市民ハッカーコミュニティとして政治のデジタル化を実現し、英国のmySocietyが政党ではなく非営利団体として議会監視のインフラを構築したように、政治のインフラは市民社会の手によって、全ての政治的立場に対して中立に、オープンソースの原則に基づいて構築されうる。その可能性を示すことが、本論文の結論である。

---

## 参考文献

### 台湾

- Hsiao, Y.-T., Lin, S.-Y., Tang, A., Narayanan, D., & Sarahe, C. (2018). "vTaiwan: An Empirical Study of Open Consultation Process in Taiwan." *SocArXiv*. DOI: 10.31235/osf.io/xyhft.
- Lee, C.-T. (2020). "Free the Data from the Birdcage: Opening Up Data and Crowdsourcing Activism in Taiwan." *PoLAR: Political and Legal Anthropology Review*, 43(2), 247-263.
- Siddarth, D. (2020). "Taiwan: Grassroots Digital Democracy That Works." *RadicalxChange Foundation*. https://www.radicalxchange.org/updates/papers/Taiwan_Grassroots_Digital_Democracy_That_Works_V1_DIGITAL_.pdf
- Tang, A., & Weyl, E. G. (2024). *⿻ 數位 Plurality: The Future of Collaborative Technology and Democracy*. RadicalxChange Foundation.
- Ho, M.-s. (2023). "Exploring Worldwide Democratic Innovations: A Case Study of Taiwan." *European Partnership for Democracy*. https://epd.eu/content/uploads/2023/07/Case-Study-Taiwan.pdf
- Bridging Voting and Deliberation with Algorithms: Field Insights from vTaiwan and Kultur Komitee. (2025). *Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency (FAccT)*. DOI: 10.1145/3715275.3732205.
- Aviv, R. et al. (2022). "Bridging-Based Ranking." *Belfer Center, Harvard Kennedy School*.
- Cheng, T.-Y. (2017). "Keyboard Participation: A Case Study of 'G0v.Tw' on Open-Source Collaborative Citizen Engagement in Hacking Community." Master's thesis, National Taiwan University.

### 英国

- mySociety. (2025). "Impact Report 2024-25." mySociety Research. https://research.mysociety.org/html/impact-report-2025/
- mySociety. (2015). "Who Benefits From Civic Technology?" mySociety Research. https://research.mysociety.org/html/who-benefits/
- Government Digital Service. (2012, updated). "Government Design Principles." GOV.UK. https://www.gov.uk/guidance/government-design-principles
- Democracy Club. (2024). "2024 Local and General Elections Report." https://democracyclub.org.uk/report_2024/
- Full Fact. (2025). "Full Fact AI." https://fullfact.org/ai/
- Full Fact. (2025). "Full Fact Report 2025." https://fullfact.org/policy/reports/full-fact-report-2025/
- Sheridan & Reidy. (2023). "Public Understanding of Electoral Spending: Evaluating UK Transparency Mechanisms." *Representation*, Taylor & Francis. https://www.tandfonline.com/doi/full/10.1080/00344893.2023.2207170
- Simon, J., Bass, T., Boelman, V. & Mulgan, G. (2017). "Digital Democracy: The Tools Transforming Political Engagement." Nesta. https://www.nesta.org.uk/report/digital-democracy-the-tools-transforming-political-engagement/
- Nesta. (2023-2025). "COLDIGIT: Collective Intelligence through Digital Tools for Democratic Innovation." https://www.nesta.org.uk/project/collective-intelligence-through-digital-tools-coldigit-democratic-innovation/
- Margetts, H., John, P., Hale, S. & Yasseri, T. (2016). *Political Turbulence: How Social Media Shape Collective Action*. Princeton University Press.
- Landemore, H. (2021). "Open Democracy and Digital Technologies." In Bernholz, Landemore & Reich (eds.), *Digital Technology and Democratic Theory*, University of Chicago Press.
- Westminster Foundation for Democracy. (2024-2025). "Using Digital Technology for Democratic Resilience, Transformation and Impact." https://www.wfd.org/what-we-do/resources/using-digital-technology-democratic-resilience-transformation-and-impact
- "Citizen participation and technology: lessons from the fields of deliberative democracy and science and technology studies." (2025). *Humanities and Social Sciences Communications*, Nature. https://www.nature.com/articles/s41599-025-04606-4
- OECD. (2025). "Tackling Civic Participation Challenges with Emerging Technologies." https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/04/tackling-civic-participation-challenges-with-emerging-technologies_bbe2a7f5/ec2ca9a2-en.pdf
- Electoral Commission. "Political Finance Online." https://www.electoralcommission.org.uk/political-registration-and-regulation/financial-reporting/political-finance-online

### 米国

- Code for America. (2024). "2024 Impact Report." https://codeforamerica.org/impact/2024/
- OpenSecrets. https://www.opensecrets.org/
- FEC. "Campaign Finance Data." https://www.fec.gov/data/
- OpenFEC API Documentation. https://api.open.fec.gov/developers/
- ProPublica Congress API. https://projects.propublica.org/api-docs/congress-api/
- 18F. "Open Source Policy." https://18f.gsa.gov/open-source-policy/
- USDS. (2024). "2024 Impact Report." https://www.usds.gov/resources/USDS-2024-Impact-Report.pdf
- Tauberer, J. (2012). *Open Government Data: The Book*. https://opengovdata.io/
- McNutt, J.G. et al. (2016). "The diffusion of civic technology and open government in the United States." *Information Polity*, 21(2), 153-170.
- Graeff, E. (2018). "Evaluating Civic Technology Design for Citizen Empowerment." MIT PhD Thesis.
- Knight Foundation. (2013). "The Emergence of Civic Tech: Investments in a Growing Field." https://knightfoundation.org/reports/emergence-of-civic-tech/
- Sunlight Foundation. https://sunlightfoundation.com/

### ヨーロッパ

- Barandiaran, X. E., Calleja-Lopez, A., Monterde, A., & Romero, C. (2024). *Decidim, a Technopolitical Network for Participatory Democracy*. Springer. (Open Access)
- Borge, R., Balcells, J., & Padro-Solanet, A. (2023). "Democratic Disruption or Continuity? Analysis of the Decidim Platform in Catalan Municipalities." *American Behavioral Scientist*, 67(7). DOI: 10.1177/00027642221092798
- Blum, C., & Zuber, C. I. (2016). "Liquid Democracy: Potentials, Problems, and Perspectives." *The Journal of Political Philosophy*, 24(2), 162-182.
- Kling, C. C. et al. (2015). "Voting Behaviour and Power in Online Democracy: A Study of LiquidFeedback in Germany's Pirate Party." *Proceedings of ICWSM*. arXiv:1503.07723
- Kahng, A., Mackenzie, S., & Procaccia, A. D. (2021). "The Fluid Mechanics of Liquid Democracy." *ACM Transactions on Economics and Computation*, 9(4).
- Landemore, H. (2015). "Inclusive Constitution-Making: The Icelandic Experiment." *Journal of Political Philosophy*, 23(2), 166-191.
- Badouard, R., Mabi, C., & Monnoyer-Smith, L. (2017). "Can the French Republic Be Digital?" In *Participation, Privacy, and Power*, Springer.
- Solvak, M., & Vassil, K. (2016). *E-voting in Estonia: Technological diffusion and other developments over ten years*. University of Tartu.
- Springall, D. et al. (2014). "Security Analysis of the Estonian Internet Voting System." *Proceedings of ACM CCS '14*, 703-715.
- Kerikmae, T., & Rull, A. (2016). *The Future of Law and eTechnologies*. Springer.
- Pateman, C. (1970). *Participation and Democratic Theory*. Cambridge University Press.
- Barber, B. (1984). *Strong Democracy: Participatory Politics for a New Age*. University of California Press.
- Fishkin, J. S. (2009). *When the People Speak: Deliberative Democracy and Public Consultation*. Oxford University Press.
- Consul Democracy. https://consuldemocracy.org/
- Decidim. https://decidim.org/

### AIと政治

- Hall, A. et al. (2025). "Study finds perceived political bias in popular AI models." *Stanford Report*. https://news.stanford.edu/stories/2025/05/ai-models-llms-chatgpt-claude-gemini-partisan-bias-research-study
- Stanford HAI. (2025). "Toward Political Neutrality in AI." https://hai.stanford.edu/policy/toward-political-neutrality-in-ai
- University of Washington. (2025). "Biased AI chatbots swayed people's political views." https://www.washington.edu/news/2025/08/06/biased-ai-chatbots-swayed-peoples-political-views/
- Brookings Institution. "Is the politicization of generative AI inevitable?" https://www.brookings.edu/articles/is-the-politicization-of-generative-ai-inevitable/
- Stanford HAI. (2025). *AI Index Report 2025*. https://hai.stanford.edu/ai-index/2025-ai-index-report/responsible-ai
- Reboot Democracy AI. "Audrey Tang: Alignment Assemblies." https://rebootdemocracy.ai/blog/audrey-tang-ai-democracy/

### 日本

- デジタル庁. https://www.digital.go.jp/
- 総務省. "政治資金収支報告書." https://www.soumu.go.jp/senkyo/seiji_s/seijishikin/
- 一般社団法人政策推進機構. "政治資金収支報告書データベース." https://political-finance-database.com/
- 公益財団法人政治資金センター. https://www.openpolitics.or.jp/
- Polimoney（デジタル民主主義2030）. https://github.com/digitaldemocracy2030/polimoney
- チームみらい公式サイト. https://team-mir.ai/
- チームみらいGitHub. https://github.com/team-mirai
- デジタル民主主義2030. https://dd2030.org/
- 山田健太, 青田雅輝, 並木亮, 横山源太朗. (2023). "政治資金収支報告書のOCRによる政治資金データベースへの試み." *JSAI 2023*. https://www.jstage.jst.go.jp/article/pjsai/JSAI2023/0/JSAI2023_2H1OS3a01/_article/-char/ja/
- 日経クロステック. "政治資金はDB化するも対象は5%." https://xtech.nikkei.com/atcl/nxt/column/18/03201/052200002/
- 経済同友会. (2025). "政治資金の徹底した透明化を." https://www.doyukai.or.jp/policyproposals/2024/250311.html
- Nippon.com. "Is Japan's Political Funds Control Act Working as Intended?" https://www.nippon.com/en/japan-data/h01909/
- Nippon.com. "Attacking the Roots of Japan's Slush Fund Scandal." https://www.nippon.com/en/in-depth/d00973/
- Investigative Reporting Workshop. "Loopholes keep voters in the dark in Japan." https://archive.investigativereportingworkshop.org/news/loopholes-keep-voters-in-the-dark-in-japan/
- Code for Japan. https://www.code4japan.org/

### 国際比較・理論

- Bernholz, L., Landemore, H. & Reich, R. (eds.). (2021). *Digital Technology and Democratic Theory*. University of Chicago Press.
- OECD OPSI. Observatory of Public Sector Innovation. https://oecd-opsi.org/
- Participedia. https://participedia.net/
- People Powered. https://www.peoplepowered.org/
- Democracy Technologies Database. https://democracy-technologies.org/database/
- International IDEA. (2024). "Digital Technologies Become a Strong Factor in Democracy."
- Economist Intelligence Unit. (2025). *Democracy Index 2024*.
- Verfassungsblog. (2025). "When Failure Succeeds and Success Fails: A Reality Check on the European Citizens' Initiative."
- Raymond, E. S. (1999). *The Cathedral and the Bazaar*. O'Reilly Media.
