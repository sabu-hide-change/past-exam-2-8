// npm install lucide-react recharts firebase

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Check, X, Home, ChevronRight, RefreshCw, BookOpen, AlertTriangle, List, Shield, HelpCircle, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Firebase configuration using environment variables as strictly required
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const APP_ID = "QuizApp_Smart_2_8";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Complete data model mapping all questions from the provided document
const quizQuestions = [
  {
    id: 1,
    title: "資本市場と資金調達",
    tag: "基本問題",
    text: "企業にとっての資金調達は、投資家にとっての（　Ａ　）となる。よって、企業の資金調達のコストである資本コストは、投資家にとっては（　Ａ　）に対する（　Ｂ　）となる。ここで、投資家が（　Ａ　）をするにあたり、資本市場において、（　Ｃ　）を購入するか（　Ｄ　）を購入するかの選択肢がある。リスクの少ない（　Ｃ　）と、リスクの大きい（　Ｄ　）の期待するリターンが同じであれば、投資家はリスクの少ない（　Ｃ　）を選ぶ。投資家はリスクが大きい投資に対しては、大きなリターンを望むからである。",
    options: [
      { key: "ア", text: "Ａ：投資　Ｂ：リスク　Ｃ：社債　Ｄ：株式" },
      { key: "イ", text: "Ａ：消費　Ｂ：リスク　Ｃ：株式　Ｄ：社債" },
      { key: "ウ", text: "Ａ：消費　Ｂ：リターン　Ｃ：社債　Ｄ：株式" },
      { key: "エ", text: "Ａ：投資　Ｂ：リターン　Ｃ：株式　Ｄ：社債" },
      { key: "オ", text: "Ａ：投資　Ｂ：リターン　Ｃ：社債　Ｄ：株式" }
    ],
    answer: "オ",
    explanation: {
      summary: "企業にとっての資金調達は投資家にとっての投資であり、そのコスト（資本コスト）は投資家のリターンとなります。また、社債は元本や金利が確定しているため株式よりもリスクが小さい資産です。",
      details: [
        { label: "Ａ：投資", content: "企業にとっての資金調達は、投資家にとっての投資となります。" },
        { label: "Ｂ：リターン", content: "企業の資金調達のコストである資本コストは、投資家にとっては投資に対するリターンとなります。" },
        { label: "Ｃ：社債、Ｄ：株式", content: "社債は、株式に比べてリスクが小さいものとなります。社債は利回りが投資する時点で確定されています。これに対し、株式は株式市場で株価が決まるため、利回りは確定していません。よって、社債の方が株式よりもリスクが少なくなります。社債や借入金などの負債は、基本的に会社が倒産しない限りは確実に金利分を上乗せした額がリターンとして期待できます。これに対して、株式の配当や売却益は業績や市場変動の影響を大きく受けるためリスクが高いといえます。" }
      ]
    }
  },
  {
    id: 2,
    title: "投資のリスクとリターン",
    tag: "計算問題",
    text: "次の資料は、ある株式の投資収益率について予想される分布を示したものである。株式の投資のリスクの尺度として標準偏差が用いられるが、この資料に基づいた場合、この株式の標準偏差として、最も適切なものを下記の解答群から選べ。",
    hasTable: true,
    tableData: [
      { label: "4%", prob: "0.2" },
      { label: "6%", prob: "0.5" },
      { label: "8%", prob: "0.3" }
    ],
    options: [
      { key: "ア", text: "－1" },
      { key: "イ", text: "0" },
      { key: "ウ", text: "1" },
      { key: "エ", text: "1.41" },
      { key: "オ", text: "1.4" }
    ],
    answer: "オ",
    explanation: {
      summary: "期待値を算出した後、各値の偏差の2乗に確率を掛けて合計（分散）を求め、その平方根をとることで標準偏差を算出します。",
      calcSteps: [
        { title: "(1) 期待値の計算", formula: "4% × 0.2 ＋ 6% × 0.5 ＋ 8% × 0.3 ＝ 0.8% ＋ 3.0% ＋ 2.4% ＝ 6.2%" },
        { title: "(2) 分散の計算", formula: "Σ(偏差² × 確率) ＝ (4% － 6.2%)² × 0.2 ＋ (6% － 6.2%)² × 0.5 ＋ (8% － 6.2%)² × 0.3 ＝ (-2.2%)² × 0.2 ＋ (-0.2%)² × 0.5 ＋ (1.8%)² × 0.3 ＝ 4.84 × 0.2 ＋ 0.04 × 0.5 ＋ 3.24 × 0.3 ＝ 0.968 ＋ 0.02 ＋ 0.972 ＝ 1.96" },
        { title: "(3) 標準偏差の計算", formula: "√分散 ＝ √1.96 ＝ 1.4" }
      ]
    }
  },
  {
    id: 3,
    title: "リスクの種類",
    tag: "ポートフォリオ理論",
    text: "ポートフォリオ理論におけるリスクに関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "流動性リスクとは、取引相手の財務状況の悪化や倒産により貸付金の受取利息や元本の回収が滞ってしまうリスクのことである。" },
      { key: "イ", text: "カントリー・リスクとは、外貨建て金融商品における国と国との為替変動により資産価値が変動するリスクのことである。" },
      { key: "ウ", text: "価格変動リスクとは、市場で取引量が少ないために資産を換金しようとしたときにすぐに売ることができない、あるいは希望する価格で売ることができなくなるリスクのことである。" },
      { key: "エ", text: "信用リスクとは、その国の政治や経済などによって資産価値が変動するリスクのことである。" },
      { key: "オ", text: "システマティック・リスクとは、市場全体との相関によるリスクであり、分散化によって消去することができないリスクのことである。" }
    ],
    answer: "オ",
    explanation: {
      summary: "ポートフォリオ理論におけるリスクとは「リターンの不確実性（ばらつき）」を指します。分散投資で消去できない市場全体の変動リスクをシステマティック・リスクと呼びます。",
      details: [
        { label: "ア ×", content: "取引相手の財務状況の悪化や倒産に伴うリスクは「信用リスク」です。" },
        { label: "イ ×", content: "国と国との為替変動によるリスクは「為替リスク」です。" },
        { label: "ウ ×", content: "換金が困難になるリスクは「流動性リスク」です。" },
        { label: "エ ×", content: "その国の政治や経済環境によるリスクは「カントリー・リスク」です。" },
        { label: "オ ○", content: "記述の通り、システマティック・リスクは市場全体に連動するため、分散投資によって消去することができません。市場リスクとも呼ばれます。" }
      ]
    }
  },
  {
    id: 4,
    title: "リスクに対する投資家の選好",
    tag: "無差別曲線",
    text: "図を基に、投資家の選好を表す組み合わせとして最も適切なものを選べ。縦軸にリターン（期待収益率）、横軸にリスク（標準偏差）をとり、満足度のレベルはU1＜U2＜U3である。\n・曲線A：右上がりの凸曲線\n・直線B：水平な直線\n・曲線C：右下がりの凹曲線",
    options: [
      { key: "ア", text: "Ａ：リスク回避者　　　 Ｂ：リスク中立者　　　　Ｃ：リスク愛好者" },
      { key: "イ", text: "Ａ：リスク回避者　　　 Ｂ：リスク愛好者　　　　Ｃ：リスク中立者" },
      { key: "ウ", text: "Ａ：リスク愛好者　　　 Ｂ：リスク中立者　　　　Ｃ：リスク回避者" },
      { key: "エ", text: "Ａ：リスク愛好者　　　 Ｂ：リスク回避者　　　　Ｃ：リスク中立者" }
    ],
    answer: "ア",
    explanation: {
      summary: "リスクに対する評価は投資家の選好により異なります。無差別曲線（同じ満足度を結んだ線）の形状で識別します。",
      details: [
        { label: "Ａ：リスク回避者", content: "同一のリターンであればリスクがより小さいものを選好する投資家。リスクが増える分、より多くのリターンを要求するため曲線は右上がりになります。" },
        { label: "Ｂ：リスク中立者", content: "リスクと無関係に高いリターンのみを選好する投資家。リスクの大小が満足度に影響しないため、無差別曲線は水平になります。" },
        { label: "Ｃ：リスク愛好者", content: "同一のリターンならばリスクがより大きいものを選好する投資家。リスクを取ること自体を好むため、曲線は右下がり（外側へ膨らむ形）になります。" }
      ]
    }
  },
  {
    id: 5,
    title: "ポートフォリオのリスク低減効果",
    tag: "ポートフォリオ理論",
    text: "ポートフォリオのリスク低減効果に関する次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n「（　Ａ　）とは、複数の資産を組み合わせてつくられた資産全体のことをいう。マコービッツは個々の証券の（　Ｂ　）とその組み合わせである（　Ａ　）の（　Ｂ　）を区別して調べることにより、（　Ａ　）を組むことによって（　Ｂ　）の（　Ｃ　）が可能になることを提唱した。個別の証券に集中して投資する（　Ｂ　）よりも、資産が（　Ｃ　）化された（　Ａ　）のほうが（　Ｂ　）は小さくなることを、（　Ａ　）の（　Ｄ　）という。」",
    options: [
      { key: "ア", text: "Ａ：ポートフォリオ　Ｂ：リスク　Ｃ：分散　Ｄ：リスク低減効果" },
      { key: "イ", text: "Ａ：ポートフォリオ　Ｂ：リターン　Ｃ：集中　Ｄ：ポートフォリオ効果" },
      { key: "ウ", text: "Ａ：投資家の選好　Ｂ：リターン　Ｃ：分散　Ｄ：リスク低減効果" },
      { key: "エ", text: "Ａ：投資家の選好　Ｂ：リスク　Ｃ：集中　Ｄ：ポートフォリオ効果" }
    ],
    answer: "ア",
    explanation: {
      summary: "ハリー・マコービッツが提唱したポートフォリオ選択理論の根幹をなす、分散投資によるリスク低減の仕組みに関する問題です。",
      details: [
        { label: "Ａ：ポートフォリオ", content: "複数の資産を組み合わせて構築された資産全体を指します。" },
        { label: "Ｂ：リスク / Ｃ：分散", content: "個別証券が持つリスクを、ポートフォリオを構築し分散させることで、全体のリスクをコントロール可能にしました。" },
        { label: "Ｄ：リスク低減効果", content: "特定の個別銘柄へ集中投資を行う場合に比べて、適切に資産を分散したポートフォリオの方が全体リスクが抑制される効果のことです。" }
      ]
    }
  },
  {
    id: 6,
    title: "ポートフォリオのリターンとリスク",
    tag: "ポートフォリオ理論",
    text: "2つの株式XとYについて、ポートフォリオの組み入れ比率を変化させたときのリターンとリスクの特性に関する記述として、最も適切なものを選べ。\n【特性データ】\n・株式X単独(100%): 期待収益率 10 / 標準偏差 8.12\n・株式Y単独(100%): 期待収益率 8 / 標準偏差 4.65\n・最適分散(X:37%, Y:63%): 期待収益率 8.74 / 標準偏差 1.02",
    options: [
      { key: "ア", text: "株式Xにだけ単独に投資するというのは、ローリスク・ローリターンの投資家行動といえる。" },
      { key: "イ", text: "株式Yにだけ単独に投資するというのは、ハイリスク・ハイリターンの投資家行動といえる。" },
      { key: "ウ", text: "リスクが最も小さくなるのは、組み入れ比率が株式X37%・株式Y63％であるときである。" },
      { key: "エ", text: "組み入れ比率が株式X37%・株式Y63％であるとき以外の組み入れ比率の場合、個別の証券に集中して投資する場合に比べて、リスクは高い。" }
    ],
    answer: "ウ",
    explanation: {
      summary: "2証券を組み合わせることで、それぞれの単独投資のラインを結んだ直線よりも内側（左側）にリスクが低減する曲線が描かれます。",
      details: [
        { label: "ア ×", content: "株式X単独投資はリターンが最大（10）ですがリスクも最大（8.12）となるため、「ハイリスク・ハイリターン」の行動です。" },
        { label: "イ ×", content: "株式Y単独投資はリターンが最小（8）となります。「ローリターン」の行動です。" },
        { label: "ウ ○", content: "データが示す通り、標準偏差が最も小さくなる極値は、X37%・Y63%を保有したときの「1.02」です。" },
        { label: "エ ×", content: "最小値となるポイント以外であっても、単独集中投資（X100%やY100%）に比べれば、多くの比率で標準偏差が下回るため、リスク低減効果はしっかりと働いています。" }
      ]
    }
  },
  {
    id: 7,
    title: "相関係数とリスク",
    tag: "ポートフォリオ理論",
    text: "相関係数が－1、0、1の場合における、2つの株式XとYを組み合わせたポートフォリオのリターンとリスクに関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "相関係数が－1のとき、ポートフォリオのリスク低減効果は最も小さくなる。" },
      { key: "イ", text: "相関係数が1のとき、ポートフォリオのリスク低減効果は最も大きくなる。" },
      { key: "ウ", text: "相関係数が0のとき、ポートフォリオのリスクを低減することができない。" },
      { key: "エ", text: "相関係数が1以外のとき、ポートフォリオのリスク低減効果がある。" }
    ],
    answer: "エ",
    explanation: {
      summary: "相関係数（2つの証券の値動きの連動性を表す指標：-1から+1の範囲）の数値によって、リスク分散効果の大きさが決定されます。",
      details: [
        { label: "相関係数 ＝ －1", content: "2つの証券が完全に逆の動きをします。このときリスク低減効果は「最大」となり、特定の比率で全体のリスク（標準偏差）をゼロにすることが可能です。" },
        { label: "相関係数 ＝ 0", content: "2つの証券の動きには何の関係もありませんが、ポートフォリオを組むことでリスクを「低減することができます」。" },
        { label: "相関係数 ＝ 1", content: "2つの証券が完全に同じ動きをします。この場合はリスクが直線的に変化するだけで、分散投資によるリスク低減効果は「ゼロ（一切ない）」となります。" },
        { label: "結論", content: "したがって、相関係数が「1以外」であれば、大なり小なり必ずリスク低減効果が発揮されます。" }
      ]
    }
  },
  {
    id: 8,
    title: "システマティックリスクと非システマティックリスク",
    tag: "CAPM",
    text: "ポートフォリオのリスクとリターン、分散効果について述べた文中の空欄Ａ～Ｃに入る語句の組み合わせとして、最も適切なものはどれか。\n「ポートフォリオの総リスクは、（　Ａ　）と（　Ｂ　）から構成される。（　Ａ　）は、ポートフォリオを構成する銘柄数が多くなると減少するが（　Ｂ　）は、減少することはない。これは（　Ｂ　）が株式市場のリスクを表すためである。（　Ｃ　）は、横軸にベータ、縦軸に期待リターンをとったときに、CAPMにおけるベータと期待リターンの関係を表した直線です。（　Ｃ　）は、ベータの一次関数で表され、切片は安全利子率であり、傾きは市場ポートフォリオのリスクプレミアムである。」",
    options: [
      { key: "ア", text: "Ａ：システマティック・リスク　　 Ｂ：アンシステマティック・リスク　　Ｃ：資本市場線" },
      { key: "イ", text: "Ａ：システマティック・リスク　　 Ｂ：アンシステマティック・リスク　　Ｃ：証券市場線" },
      { key: "ウ", text: "Ａ：アンシステマティック・リスク　　 Ｂ：システマティック・リスク　　Ｃ：証券市場線" },
      { key: "エ", text: "Ａ：アンシステマティック・リスク　　 Ｂ：システマティック・リスク　　Ｃ：資本市場線" }
    ],
    answer: "ウ",
    explanation: {
      summary: "株式のリスクの分解と、CAPMをグラフィックに表した代表的な２つの概念を区別して整理する重要な問題です。",
      details: [
        { label: "Ａ：アンシステマティック・リスク", content: "銘柄固有の不祥事や業績悪化などの要因によるリスク。多数の多様な銘柄を組み合わせる（分散投資）ことで消去可能です（非システマティック・リスク）。" },
        { label: "Ｂ：システマティック・リスク", content: "景気後退や金利変動など、市場全体が受けるシステム起因のリスク。どんなに銘柄数を増やしても相殺できず、減少させることはできません。" },
        { label: "Ｃ：証券市場線（SML）", content: "横軸に『β（ベータ値：市場感応度）』、縦軸に『期待リターン』をとる、個別資産の評価直線です。（※『資本市場線（CML）』は横軸に『標準偏差（総リスク）』をとるため、混同に注意してください）。" }
      ]
    }
  },
  {
    id: 9,
    title: "効率的フロンティア",
    tag: "ポートフォリオ理論",
    text: "資本市場にたくさん存在する株式を自由に組み合わせたポートフォリオを作成し、リターンとリスクの分布を示したモデルに関する記述として、最も【不適切】なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "効率的フロンティアとは、特定のリスクの大きさに対して、最低のリターンをあげることが期待されるポートフォリオのことをいう。" },
      { key: "イ", text: "ポートフォリオAとポートフォリオBを比較してみると、合理的な投資家は必ず効率的フロンティアの上にあるAを選ぶ。" },
      { key: "ウ", text: "ローリスク・ローリターンを好む投資家は、効率的フロンティアの左側の線上のポートフォリオを選ぶ。" },
      { key: "エ", text: "ハイリスク・ハイリターンを好む投資家は、効率的フロンティアの右側の線上のポートフォリオを選ぶ。" }
    ],
    answer: "ア",
    explanation: {
      summary: "投資の限界効率を示した「効率的フロンティア」の定義を問う問題です。もっとも効率の良い最外殻の境界線を指します。",
      details: [
        { label: "ア ×不適切", content: "効率的フロンティアとは、特定のリスクに対して『最高（最大）』のリターンをもたらす組み合わせ、または一定のリターンに対して『最小』のリスクとなるポイントの集合体です。よって不適切です。" },
        { label: "イ ○", content: "同じリスク値であれば、内部にあるB点より、最上部のフロンティア線上にあるA点の方が高い期待収益を得られるため、合理的な投資家は必ずAを選びます。" },
        { label: "ウ・エ ○", content: "フロンティア線上の中であれば、投資家のリスクに対する好み（選好）に合わせて、左側（ローリスク）か右側（ハイリスク）のいずれかを選択することになります。" }
      ]
    }
  },
  {
    id: 10,
    title: "リスクフリー資産",
    tag: "ポートフォリオ理論",
    text: "株式Xと国債をポートフォリオに組み込んだ場合におけるリターンとリスクの分布を示した特性を基に、最も適切な記述を選べ。\n【特性データ】\n・国債100% (X:0%): 期待収益率 2% / 標準偏差 0\n・半分ずつ (X:50%, 国債:50%): 期待収益率 6% / 標準偏差 4.06\n・株式X100% (国債:0%): 期待収益率 10% / 標準偏差 8.12",
    options: [
      { key: "ア", text: "国債の期待収益率は、10％である。" },
      { key: "イ", text: "国債は、リスクフリー資産である。" },
      { key: "ウ", text: "国債を購入する比率が低くなるほど、リスクは小さくなる。" },
      { key: "エ", text: "国債をポートフォリオに入れると、株式だけのポートフォリオよりも、リスクを嫌う投資家は、よりリスクの低いポートフォリオを選択できなくなる。" }
    ],
    answer: "イ",
    explanation: {
      summary: "国債に代表されるリスクがゼロの安全資産（リスクフリー資産）をポートフォリオに組み入れた場合の軌跡は直線になります。",
      details: [
        { label: "ア ×", content: "国債100%のときの期待収益率は縦軸の切片である「2%」です。" },
        { label: "イ ○", content: "国債100%のとき、リスクの指標である標準偏差は「0」となっています。これはリスクが一切ないことを意味し、リスクフリー資産の定義に完全に合致します。" },
        { label: "ウ ×", content: "国債の比率を下げ、株式Xの比率を高めるほど、グラフは右上に進み、リスク（標準偏差）は拡大していきます。" },
        { label: "エ ×", content: "リスクのない選択肢が加わることで、投資家はよりボラティリティを抑えたポートフォリオを構築できるため、選択の幅は広がります。" }
      ]
    }
  },
  {
    id: 11,
    title: "市場ポートフォリオ",
    tag: "資本市場線",
    text: "リスクフリー資産である国債と、全ての株式を自由に組み合わせた場合の効率的フロンティアと資本市場線（CML）の関係に関する記述として、最も適切なものを下記の解答群から選べ。",
    options: [
      { key: "ア", text: "資本市場線とは、資本市場において、リスクフリー資産だけを購入した場合を示すものである。" },
      { key: "イ", text: "A点とB点を比較すると、B点の方が同じリスクで高いリターンを実現できる。" },
      { key: "ウ", text: "合理的な投資家は、必ず資本市場線の上のポートフォリオを選択する。" },
      { key: "エ", text: "市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小である。" }
    ],
    answer: "ウ",
    explanation: {
      summary: "リスクフリー資産の金利ポイントから、株式のみの効率的フロンティアへ向けて接線を引いたものが「資本市場線（CML）」であり、その接点を「市場ポートフォリオ」と呼びます。",
      details: [
        { label: "ア ×", content: "資本市場線は、安全資産と『リスク資産（株式ポートフォリオ）』を組み合わせた最適な直線のことです。" },
        { label: "イ ×", content: "同一のリスク（横軸の標準偏差）で比較した場合、フロンティア上のB点よりも、上方にある資本市場線上のA点の方が高いリターンを確保できます。" },
        { label: "ウ ○", content: "上記の通り、資本市場線上の組み合わせは、株式のみの効率的フロンティアを常に上回る優れた効率性を持つため、合理的な投資家は必ずこの直線の上のポートフォリオを選択します。" },
        { label: "エ ×", content: "最小のリスクを持つのは安全資産（リスクゼロ）であり、市場ポートフォリオはある程度のリスクを保有しています。" }
      ]
    }
  },
  {
    id: 12,
    title: "CAPMによる期待収益率の計算",
    tag: "計算問題",
    text: "次の資料に基づいた場合、CAPM（資本資産評価モデル）によりG証券の期待収益率を計算する数式として、最も適切なものを下記の解答群から選べ。\n【資　料】\n・リスクフリーレート：2%\n・β値：1.2\n・市場ポートフォリオの期待収益率：8%",
    options: [
      { key: "ア", text: "8％ ＋ 1.2 × (8％ － 2％)" },
      { key: "イ", text: "8％ － 1.2 × (8％ ＋ 2％)" },
      { key: "ウ", text: "2％ ＋ 1.2 × (8％ ＋ 2％)" },
      { key: "エ", text: "2％ － 1.2 × (8％ － 2％)" },
      { key: "オ", text: "2％ ＋ 1.2 × (8％ － 2％)" }
    ],
    answer: "オ",
    explanation: {
      summary: "CAPMの基本公式を適用して、個別株式の要求リターン（期待収益率）を導出する頻出の計算問題です。",
      calcSteps: [
        { title: "基本計算公式", formula: "個別株式の期待収益率 ＝ リスクフリーレート ＋ β × 市場リスクプレミアム" },
        { title: "市場リスクプレミアムの分解", formula: "市場リスクプレミアム ＝ 市場ポートフォリオの期待収益率 － リスクフリーレート" },
        { title: "数式への数値のあてはめ", formula: "＝ 2% ＋ 1.2 × (8% － 2%)" },
        { title: "計算結果", formula: "＝ 2% ＋ 1.2 × 6% ＝ 2% ＋ 7.2% ＝ 9.2%" }
      ]
    }
  },
  {
    id: 13,
    title: "加重平均資本コスト（WACC）",
    tag: "計算問題",
    text: "次の資料に基づいた場合、H社の加重平均資本コスト（WACC）を計算する数式として、最も適切なものを下記の解答群から選べ。\n【資　料】\n1. 普通株式と社債で調達\n2. 社債: 帳簿価額400万円 / 時価400万円\n3. 普通株式: 帳簿価額400万円 / 時価600万円\n4. 投資家要求収益率: 社債3% / 普通株式13%\n5. 実効税率: 40%",
    options: [
      { key: "ア", text: "0.5 × (1 － 0.4) × 3％ ＋ 0.5 × 13％" },
      { key: "イ", text: "0.5 × 0.4 × 3％ ＋ 0.5 × 13％" },
      { key: "ウ", text: "0.4 × 3％ ＋ 0.6 × 13％" },
      { key: "エ", text: "0.4 × (1 － 0.4) × 3％ ＋ 0.6 × 13％" },
      { key: "オ", text: "0.4 × 0.4 × 3％ ＋ 0.6 × 13％" }
    ],
    answer: "エ",
    explanation: {
      summary: "WACCの計算では、負債と自己資本の金額に『帳簿価額ではなく時価を用いる』点、および『負債コストにのみ税効果（1 - 税率）を適用する』点が最大のポイントです。",
      calcSteps: [
        { title: "(1) 時価による総資産額と構成比の算出", formula: "総時価 ＝ 社債400万円 ＋ 株式600万円 ＝ 1000万円\n・負債比率 ＝ 400 / 1000 ＝ 0.4\n・資本比率 ＝ 600 / 1000 ＝ 0.6" },
        { title: "(2) WACC公式への代入", formula: "WACC ＝ 負債比率 × (1 － 実効税率) × 負債利子率 ＋ 資本比率 × 資本コスト" },
        { title: "数式の確定", formula: "＝ 0.4 × (1 － 0.4) × 3% ＋ 0.6 × 13%" },
        { title: "最終計算結果", formula: "＝ 0.72% ＋ 7.8% ＝ 8.52%" }
      ]
    }
  },
  {
    id: 14,
    title: "資金調達方法の分類",
    tag: "企業財務",
    text: "企業の資金調達方法に関する説明として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "内部留保と減価償却費は、内部金融に該当する。" },
      { key: "イ", text: "内部金融とは、企業外部から資金調達を行うことである。" },
      { key: "ウ", text: "直接金融とは、金融仲介機関から直接的に資金を融通することである。" },
      { key: "エ", text: "間接金融とは、金融仲介機関を経由せずに、間接的に資金を融通することである。" }
    ],
    answer: "ア",
    explanation: {
      summary: "資金調達は、「内部か外部か（資金の発生源）」および「直接か間接か（市場の介在方法）」によりマトリクス分類されます。",
      details: [
        { label: "ア ○ 適切", content: "内部金融（自己金融）とは、企業が自らの活動の過程で生み出した資金を充てる方法であり、利益の蓄積である『内部留保』と、キャッシュの流出を伴わない費用である『減価償却費』がこれに該当します。" },
        { label: "イ ×", content: "外部から調達するのは『外部金融』の定義です。銀行借入や社債・株式発行が該当します。" },
        { label: "ウ ×", content: "直接金融は、銀行などの仲介を受けず、金融市場を通じて投資家から直接資金を募る（株式・社債の発行など）方法です。" },
        { label: "エ ×", content: "間接金融は、銀行などの金融仲介機関が預金者から集めた資金を、機関の判断とリスクのもとで企業へ融資する方法です。仲介機関を『経由する』のが特徴です。" }
      ]
    }
  },
  {
    id: 15,
    title: "ファイナンス・リース取引",
    tag: "企業財務",
    text: "ファイナンス・リース取引に関する説明として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "ファイナンス・リース取引とは、リース契約に基づくリース期間の中途において当該契約を解除することができないリース取引またはこれに準ずるリース取引で、借手が、当該契約に基づき使用する物件からもたらされる経済的利益を実質的に享受することができ、かつ、当該リース物件の使用に伴って生じるコストを実質的に負担することとなるリース取引をいう。" },
      { key: "イ", text: "ファイナンス・リース取引とは、リース契約に基づくリース期間の中途において当該契約を解除することができるリース取引またはこれに準ずるリース取引で、借手が、当該契約に基づき使用する物件からもたらされる経済的利益を実質的に享受することができ、かつ、当該リース物件の使用に伴って生じるコストを実質的に負担しなくてもよいリース取引をいう。" },
      { key: "ウ", text: "ファイナンス・リース取引については、通常の賃貸借取引に係る方法に準じて会計処理を行う。" },
      { key: "エ", text: "ファイナンス・リース取引については、通常の資本取引に係る方法に準じて会計処理を行う。" }
    ],
    answer: "ア",
    explanation: {
      summary: "ファイナンス・リースは、その実態が「お金を借りて資産を購入した」のと同様であるため、売買取引に準じた厳しい法解釈・会計処理が適用されます。",
      details: [
        { label: "ア ○ 適切", content: "ファイナンス・リースの二大要件である『ノンキャンセラブル（中途解約不能）』と『フルペイアウト（経済的利益の享受と、コストの全面負担）』を正確に満たす正しい記述です。" },
        { label: "イ ×", content: "解約可能・コストを負担しなくてよいとする記述は間違いであり、これはオペレーティング・リースに近い性質です。" },
        { label: "ウ・エ ×", content: "会計上は『通常の売買取引に準じた処理』を行います。よって、借り手は該当リース資産を貸借対照表（B/S）へオンバランス計上し、自社で減価償却を行います。" }
      ]
    }
  },
  {
    id: 16,
    title: "効率的市場仮説の分類",
    tag: "市場仮説",
    text: "効率的市場仮説に関する空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものはどれか。\n「（　Ａ　）では、チャート分析などテクニカル分析の有効性が否定されている。（　Ｂ　）では、株価が上昇するか下落するかは五分五分の可能性なので、株価の将来の値動きを予測することは不可能とされる。インサイダー情報を利用しても将来の株価を予測することはできないとする説は（　Ｃ　）である。一方、（　Ｄ　）ではファンダメンタル分析の有効性が否定されている。」",
    options: [
      { key: "ア", text: "Ａ：ストロング・フォームの効率的市場仮説　　Ｂ：ウィーク・フォームの効率的市場仮説　　Ｃ：ランダムウォーク理論　　Ｄ：セミストロング・フォームの効率的市場仮説" },
      { key: "イ", text: "Ａ：ウィーク・フォームの効率的市場仮説　　Ｂ：ランダムウォーク理論　　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：セミストロング・フォームの効率的市場仮説" },
      { key: "ウ", text: "Ａ：ランダムウォーク理論　　Ｂ：セミストロング・フォームの効率的市場仮説　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：ウィーク・フォームの効率的市場仮説" },
      { key: "エ", text: "Ａ：ランダムウォーク理論　　Ｂ：ウィーク・フォームの効率的市場仮説　　Ｃ：ストロング・フォームの効率的市場仮説　　Ｄ：セミストロング・フォームの効率的市場仮説" }
    ],
    answer: "イ",
    explanation: {
      summary: "株価にどこまでの情報（過去のデータ、公開情報、未公開情報）が織り込まれているかというレベルに基づき分類する理論です。",
      details: [
        { label: "Ａ：ウィーク・フォーム", content: "過去の株価情報がすべて織り込み済みであるため、過去チャートを追う『テクニカル分析』は無効とされます。" },
        { label: "Ｂ：ランダムウォーク理論", content: "値動きは過去と独立した確率的な歩みであり、五分五分で予測不能とする数理モデルです。" },
        { label: "Ｃ：ストロング・フォーム", content: "未公開のインサイダー情報さえもすでに市場価格へ反映されているため、いかなる情報でも超過リターンは狙えないとします。" },
        { label: "Ｄ：セミストロング・フォーム", content: "財務諸表など公開された企業情報すべてが瞬時に反映されるため、企業分析を行う『ファンダメンタル分析』は無効であるとされます。" }
      ]
    }
  }
];

export default function App() {
  // Application states
  const [userId, setUserId] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  
  const [currentView, setCurrentView] = useState("auth"); // auth, menu, quiz, history
  const [quizMode, setQuizMode] = useState("all"); // all, wrong, review
  
  const [activeList, setActiveList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Cloud sync data state
  const [userRecords, setUserRecords] = useState({}); // { [qId]: { isCorrect: boolean, isReview: boolean } }
  const [pendingProgress, setPendingProgress] = useState(null); // { index: number, mode: string }

  // Anonymous Authentication & Sign-in handler
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    
    setSyncLoading(true);
    console.log(`[Firebase] Authenticating and syncing user: ${userId}`);
    try {
      await signInAnonymously(auth);
      const userDocRef = doc(db, APP_ID, userId.trim());
      const userDocSnap = await getDoc(userDocRef);
      
      let records = {};
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        records = data.records || {};
        setUserRecords(records);
        
        if (data.progressIndex !== undefined && data.progressIndex !== null && data.progressIndex > 0) {
          console.log(`[Firebase] Progress found: Index ${data.progressIndex}, Mode ${data.progressMode}`);
          setPendingProgress({
            index: data.progressIndex,
            mode: data.progressMode || "all"
          });
        } else {
          setPendingProgress(null);
        }
      } else {
        // Initialize new user document container securely
        await setDoc(userDocRef, { records: {}, progressIndex: 0, progressMode: "all" });
        setUserRecords({});
        setPendingProgress(null);
      }
      
      setIsAuthed(true);
      setCurrentView("menu");
    } catch (error) {
      console.error("Critical error inside Firebase flow:", error);
      alert("通信に失敗しました。接続環境をご確認ください。");
    } finally {
      setSyncLoading(false);
    }
  };

  // Sync state mutations to Firestore helper
  const syncToCloud = async (updatedRecords, pIndex = null, pMode = null) => {
    if (!userId.trim()) return;
    try {
      const userDocRef = doc(db, APP_ID, userId.trim());
      const payload = { records: updatedRecords };
      if (pIndex !== null) payload.progressIndex = pIndex;
      if (pMode !== null) payload.progressMode = pMode;
      
      await updateDoc(userDocRef, payload);
      console.log("[Firebase] Successfully saved changes to cloud.");
    } catch (e) {
      console.error("[Firebase] Network update failed:", e);
    }
  };

  // Build current executable quiz question array based on filtered user scopes
  const startQuizFlow = (mode, resumeIndex = 0) => {
    console.log(`[Quiz Flow] Constructing problem matrix for Mode: ${mode}`);
    let list = [];
    if (mode === "all") {
      list = [...quizQuestions];
    } else if (mode === "wrong") {
      list = quizQuestions.filter(q => userRecords[q.id] && userRecords[q.id].isCorrect === false);
    } else if (mode === "review") {
      list = quizQuestions.filter(q => userRecords[q.id] && userRecords[q.id].isReview === true);
    }
    
    if (list.length === 0) {
      alert("該当する問題がありません。別モードをお選びください。");
      return;
    }

    setQuizMode(mode);
    setActiveList(list);
    
    // Boundary structural checks for clean load resets
    const indexToLoad = resumeIndex < list.length ? resumeIndex : 0;
    setCurrentIndex(indexToLoad);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentView("quiz");
    
    // Immediate persistent sync tracking
    syncToCloud(userRecords, indexToLoad, mode);
  };

  const handleAnswerSelection = (optionKey) => {
    if (isAnswered) return;
    setSelectedAnswer(optionKey);
    setIsAnswered(true);
    
    const currentQuestion = activeList[currentIndex];
    const isCorrect = optionKey === currentQuestion.answer;
    
    const nextRecords = {
      ...userRecords,
      [currentQuestion.id]: {
        ...userRecords[currentQuestion.id],
        isCorrect: isCorrect
      }
    };
    
    setUserRecords(nextRecords);
    
    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= activeList.length;
    
    // Clear out progress indices if fully cleared, otherwise update
    const savedIndex = isFinished ? 0 : currentIndex;
    syncToCloud(nextRecords, savedIndex, quizMode);
    console.log(`[Answer Submit] Q_ID: ${currentQuestion.id}, Selected: ${optionKey}, Result: ${isCorrect ? "Correct" : "Incorrect"}`);
  };

  const handleReviewToggle = () => {
    const currentQuestion = activeList[currentIndex];
    const currentReviewState = userRecords[currentQuestion.id]?.isReview || false;
    
    const nextRecords = {
      ...userRecords,
      [currentQuestion.id]: {
        ...userRecords[currentQuestion.id],
        isReview: !currentReviewState
      }
    };
    
    setUserRecords(nextRecords);
    syncToCloud(nextRecords, currentIndex, quizMode);
    console.log(`[Review Toggle] Q_ID: ${currentQuestion.id}, State to: ${!currentReviewState}`);
  };

  const advanceNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < activeList.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      syncToCloud(userRecords, nextIndex, quizMode);
    } else {
      // Completed current iteration chain
      console.log("[Quiz Flow] All items evaluated inside active matrix.");
      alert("全ての出題を完了しました！");
      setCurrentView("menu");
      setPendingProgress(null);
      syncToCloud(userRecords, 0, "all");
    }
  };

  const cancelAndReturnToMenu = () => {
    console.log(`[Navigation] Suspending quiz flow at index tracking position: ${currentIndex}`);
    syncToCloud(userRecords, currentIndex, quizMode);
    setCurrentView("menu");
  };

  const clearCloudSessionProgress = async () => {
    console.log("[Firebase] Manual execution resetting active cloud state hooks.");
    setPendingProgress(null);
    syncToCloud(userRecords, 0, "all");
  };

  // Generate aggregate dashboard analytical insights safely
  const calculateMetrics = () => {
    const totalQuestions = quizQuestions.length;
    let correctCount = 0;
    let answeredCount = 0;
    let reviewCount = 0;

    quizQuestions.forEach(q => {
      const rec = userRecords[q.id];
      if (rec) {
        answeredCount++;
        if (rec.isCorrect) correctCount++;
        if (rec.isReview) reviewCount++;
      }
    });

    return { totalQuestions, answeredCount, correctCount, reviewCount };
  };

  const metrics = calculateMetrics();

  // Create valid safe chart mapping for visualization dashboard integration logic
  const chartData = [
    { name: "全体問題数", 件数: metrics.totalQuestions },
    { name: "解答済み", 件数: metrics.answeredCount },
    { name: "正解数", 件数: metrics.correctCount },
    { name: "要復習マーク", 件数: metrics.reviewCount }
  ];

  if (syncLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full text-center border border-slate-100">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">クラウド同期中</h2>
          <p className="text-sm text-slate-500">データを安全に取得しています。少々お待ちください...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 antialiased">
      {/* Header element styling definitions block */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => isAuthed && setCurrentView("menu")}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-md">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">スマート問題集</span>
              <span className="text-xs block text-slate-400 font-medium">2-8 資本市場と資本コスト</span>
            </div>
          </div>
          
          {isAuthed && (
            <div className="flex items-center space-x-2 text-xs bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-bold text-slate-600">ID: {userId}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* VIEW 1: AUTHENTICATION DECK AND USER SYNC HUB */}
        {currentView === "auth" && (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mt-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">学習同期システムの有効化</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                PCやスマートフォン間で学習の進捗・履歴・要復習フラグをリアルタイムに自動同期します。共通で利用する任意の合言葉を入力してください。
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">ユーザー識別キー / 任意の合言葉</label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="例: kenshu-2026-user"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono transition-colors text-slate-800"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:opacity-95 transform active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <span>同期を開始して進む</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: HOME SYSTEM LANDING & NAVIGATION CONTROLS DASHBOARD */}
        {currentView === "menu" && (
          <div className="space-y-8">
            
            {/* Conditional continuation interruption card framework render */}
            {pendingProgress && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl mt-0.5 shadow-sm">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-base">前回の学習中断データが検出されました</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      モード: <span className="font-bold uppercase bg-amber-200 px-1.5 py-0.5 rounded text-xs text-amber-800">{pendingProgress.mode === "all" ? "すべての問題" : pendingProgress.mode === "wrong" ? "前回不正解のみ" : "要復習のみ"}</span> の <span className="font-bold">問題 【{pendingProgress.index + 1}】</span> から再開可能です。
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button 
                    onClick={() => startQuizFlow(pendingProgress.mode, pendingProgress.index)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <span>続きから再開する</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={clearCloudSessionProgress}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-amber-300 text-amber-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    最初から始める
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => startQuizFlow("all")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-sm text-left group transition-all transform hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  全
                </div>
                <h3 className="font-bold text-slate-950 text-base mb-1">すべての問題</h3>
                <p className="text-xs text-slate-400 leading-relaxed">収録されている全16問のカリキュラムを順番に網羅して基礎・応用力を固めます。</p>
              </button>

              <button 
                onClick={() => startQuizFlow("wrong")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-rose-500 shadow-sm text-left group transition-all transform hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  ✕
                </div>
                <h3 className="font-bold text-slate-950 text-base mb-1">前回不正解の問題</h3>
                <p className="text-xs text-slate-400 leading-relaxed">過去の回答セッション中、誤判定をマークした弱点問題のみに絞って効率的な復習をサポートします。</p>
              </button>

              <button 
                onClick={() => startQuizFlow("review")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-sm text-left group transition-all transform hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  ★
                </div>
                <h3 className="font-bold text-slate-950 text-base mb-1">要復習の問題</h3>
                <p className="text-xs text-slate-400 leading-relaxed">解説画面で「要復習」チェックボックスを手動で有効化した、要警戒問題に集中します。</p>
              </button>
            </div>

            {/* DASHBOARD GRAPH MATRIX METRIC REPORT MODULE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <List className="h-4 w-4 text-slate-500" />
                  <h3 className="font-bold text-slate-900 text-base">あなたの現在の学習達成度ステータス</h3>
                </div>
                <button 
                  onClick={() => setCurrentView("history")} 
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>詳細な全履歴を個別確認</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">総問題数</span>
                  <span className="text-xl font-black text-slate-800">{metrics.totalQuestions} 問</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">解答完了</span>
                  <span className="text-xl font-black text-blue-600">{metrics.answeredCount} 問</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">正解レコード</span>
                  <span className="text-xl font-black text-emerald-600">{metrics.correctCount} 問</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">要復習設定</span>
                  <span className="text-xl font-black text-amber-600">{metrics.reviewCount} 問</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="件数" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ACTIVE TEST EXECUTION ENGINE ENVIRONMENT */}
        {currentView === "quiz" && activeList[currentIndex] && (() => {
          const item = activeList[currentIndex];
          const hasCloudReviewFlag = userRecords[item.id]?.isReview || false;
          
          return (
            <div className="space-y-6">
              
              {/* Card Navigation Utility Topline */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={cancelAndReturnToMenu}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>ダッシュボードに戻る</span>
                </button>
                <div className="text-xs font-black text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                  進行状況: <span className="text-blue-600">{currentIndex + 1}</span> / {activeList.length} 問
                </div>
              </div>

              {/* Main functional problem block */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-black text-xs rounded-md border border-blue-100">
                    問題 {item.id}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-md">
                    {item.tag}
                  </span>
                </div>

                <h2 className="text-base md:text-lg font-black text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {item.text}
                </h2>

                {/* Sub-component embedded layout table context matrix generation block if configuration maps true */}
                {item.hasTable && item.tableData && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-w-sm mx-auto shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-amber-100 text-amber-900 border-b border-slate-200 font-bold text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-2.5">投資収益率</th>
                          <th className="px-4 py-2.5">確率</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {item.tableData.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2.5 bg-slate-50/50">{row.label}</td>
                            <td className="px-4 py-2.5 font-mono">{row.prob}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Option Choice Button Selection List Module Area */}
                <div className="space-y-3 pt-2">
                  {item.options.map((opt) => {
                    let btnStyle = "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300";
                    let iconNode = null;

                    if (isAnswered) {
                      if (opt.key === item.answer) {
                        btnStyle = "border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold ring-2 ring-emerald-500/20";
                        iconNode = <Check className="h-4 w-4 text-emerald-600 shrink-0" />;
                      } else if (selectedAnswer === opt.key) {
                        btnStyle = "border-rose-500 bg-rose-50/60 text-rose-950 font-semibold ring-2 ring-rose-500/20";
                        iconNode = <X className="h-4 w-4 text-rose-600 shrink-0" />;
                      } else {
                        btnStyle = "border-slate-100 bg-slate-50/30 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleAnswerSelection(opt.key)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-xl border-2 text-left text-xs md:text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className={`h-5 w-5 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${isAnswered && opt.key === item.answer ? 'bg-emerald-600 text-white' : isAnswered && selectedAnswer === opt.key ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {opt.key}
                          </span>
                          <span className="leading-relaxed">{opt.text}</span>
                        </div>
                        {iconNode}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* POST SOLUTION DISPLAY COMPONENT METADATA CONTAINER */}
              {isAnswered && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
                  
                  {/* Status header banner segment */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center space-x-2.5">
                      {selectedAnswer === item.answer ? (
                        <div className="bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>正解</span>
                        </div>
                      ) : (
                        <div className="bg-rose-100 text-rose-800 font-black px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                          <X className="h-3 w-3" />
                          <span>不正解</span>
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-400">正解：選択肢【 {item.answer} 】</span>
                    </div>

                    {/* Bookmark interactive checklist handler button */}
                    <label className="inline-flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer select-none hover:bg-slate-100 transition-colors text-xs font-bold">
                      <input 
                        type="checkbox"
                        checked={hasCloudReviewFlag}
                        onChange={handleReviewToggle}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span className={hasCloudReviewFlag ? "text-amber-700 font-black" : "text-slate-500"}>この問題を要復習リストに登録</span>
                    </label>
                  </div>

                  {/* Core theoretical breakdown block layout parser mapping wrapper */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1 text-slate-900 font-bold text-sm">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span>解説レジュメ</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                      {item.explanation.summary}
                    </p>

                    {/* Sequential custom calculation math matrix block if mapped definitions provide steps */}
                    {item.explanation.calcSteps && (
                      <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/70">
                        {item.explanation.calcSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-xs">
                            <span className="block font-black text-blue-900 mb-0.5">{step.title}</span>
                            <code className="block bg-white px-2 py-1.5 rounded border border-blue-100 font-mono text-slate-700 whitespace-pre-wrap">{step.formula}</code>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Detail items textual blocks array container */}
                    {item.explanation.details && (
                      <div className="space-y-3 pt-1">
                        {item.explanation.details.map((detail, dIdx) => (
                          <div key={dIdx} className="text-xs border-l-2 border-slate-200 pl-3 py-0.5">
                            <span className="block font-bold text-slate-900 mb-0.5">{detail.label}</span>
                            <span className="text-slate-500 leading-relaxed block font-medium">{detail.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action step continuous dynamic movement engine button control */}
                  <button
                    onClick={advanceNextQuestion}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1 text-xs md:text-sm"
                  >
                    <span>{currentIndex + 1 === activeList.length ? "セッション結果を確定して終了" : "次の問題へ進む"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>
              )}

            </div>
          );
        })()}

        {/* VIEW 4: GRANULAR COMPREHENSIVE RECOVERY TRACKING LOG LIST VIEW */}
        {currentView === "history" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-black text-slate-950">問題別同期データログ一覧</h2>
              </div>
              <button 
                onClick={() => setCurrentView("menu")}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
              >
                メニューに戻る
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-200">
                {quizQuestions.map((q) => {
                  const record = userRecords[q.id];
                  return (
                    <div key={q.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-400">ID: {q.id}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{q.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">{q.tag}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 font-medium">{q.text}</p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-slate-400 block">解答履歴</span>
                          {record ? (
                            record.isCorrect ? (
                              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">正解</span>
                            ) : (
                              <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">不正解</span>
                            )
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">未解答</span>
                          )}
                        </div>

                        <div className="flex flex-col items-end border-l border-slate-200 pl-3">
                          <span className="text-[10px] font-bold text-slate-400 block">要復習</span>
                          {record && record.isReview ? (
                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">★ ON</span>
                          ) : (
                            <span className="text-xs font-bold text-slate-300">--</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}