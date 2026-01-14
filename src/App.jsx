/**
 * 依存関係インストール:
 * npm install lucide-react recharts clsx tailwind-merge
 * * ビルド失敗時の対策:
 * CI=false npm run build
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, List, ArrowLeft, 
  ChevronRight, RefreshCcw, Save, Bookmark, Info, Check
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter 
} from 'recharts';

// --- 図表コンポーネント ---

const IndifferenceCurveDiagram = () => (
  <div className="w-full h-48 bg-white border rounded-lg p-2 flex items-center justify-around text-[10px]">
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 border-l border-b border-slate-400">
        <svg viewBox="0 0 100 100" className="absolute inset-0">
          <path d="M10,90 Q20,30 80,10" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M30,90 Q40,50 90,30" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6"/>
          <path d="M50,90 Q60,70 95,50" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3"/>
        </svg>
        <div className="absolute top-0 -left-6 text-[8px] rotate-[-90deg] translate-y-8">期待収益率</div>
        <div className="absolute -bottom-4 left-4 text-[8px]">標準偏差</div>
      </div>
      <span className="mt-2 font-bold">リスク回避者</span>
    </div>
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 border-l border-b border-slate-400">
        <svg viewBox="0 0 100 100" className="absolute inset-0">
          <line x1="0" y1="20" x2="100" y2="20" stroke="#3b82f6" strokeWidth="2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6"/>
          <line x1="0" y1="80" x2="100" y2="80" stroke="#3b82f6" strokeWidth="1" opacity="0.3"/>
        </svg>
      </div>
      <span className="mt-2 font-bold">リスク中立者</span>
    </div>
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 border-l border-b border-slate-400">
        <svg viewBox="0 0 100 100" className="absolute inset-0">
          <path d="M10,10 Q80,20 90,90" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M10,30 Q60,40 70,95" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6"/>
        </svg>
      </div>
      <span className="mt-2 font-bold">リスク愛好者</span>
    </div>
  </div>
);

const CorrelationDiagram = () => (
  <div className="w-full h-48 bg-white border rounded-lg p-4 flex flex-col items-center">
    <div className="relative w-64 h-32 border-l border-b border-slate-400">
      <svg viewBox="0 0 200 100" className="absolute inset-0">
        {/* ρ = 1 */}
        <line x1="40" y1="80" x2="180" y2="20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
        {/* ρ = -1 */}
        <polyline points="40,80 10,50 180,20" fill="none" stroke="#ef4444" strokeWidth="2" />
        {/* ρ = 0 */}
        <path d="M40,80 Q30,40 180,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="40" cy="80" r="3" fill="#000" /> <text x="42" y="90" fontSize="8">B</text>
        <circle cx="180" cy="20" r="3" fill="#000" /> <text x="182" y="15" fontSize="8">A</text>
      </svg>
      <div className="absolute top-2 left-2 text-[8px] text-red-500">④ 相関係数 = -1</div>
      <div className="absolute top-10 left-10 text-[8px] text-blue-500">③ 相関係数 = 0</div>
      <div className="absolute top-14 right-10 text-[8px] text-slate-500">① 相関係数 = 1</div>
    </div>
    <div className="flex justify-between w-64 mt-2 text-[8px]">
      <span>標準偏差</span>
      <span>期待収益率</span>
    </div>
  </div>
);

const WACCBoxDiagram = () => (
  <div className="w-full max-w-md mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex h-32 w-full text-[10px]">
      <div className="w-1/3 border-2 border-slate-800 bg-blue-100 flex items-center justify-center font-bold">
        10,000万円
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="h-2/5 border-2 border-l-0 border-slate-800 bg-white flex items-center justify-center">
          負債 4,000万円
        </div>
        <div className="h-3/5 border-2 border-l-0 border-t-0 border-slate-800 bg-green-50 flex items-center justify-center text-center">
          資本 6,000万円<br/>(1,200円×5万株)
        </div>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] font-mono">
      <div className="p-2 border rounded bg-white">負債: 40/100 × (1-0.3) × 4% = 1.12</div>
      <div className="p-2 border rounded bg-white">資本: 60/100 × 12% = 7.20</div>
      <div className="col-span-2 p-2 bg-slate-800 text-white rounded text-center font-bold">WACC合計: 8.32%</div>
    </div>
  </div>
);

const FinanceTypeTable = () => (
  <div className="overflow-x-auto my-4">
    <table className="w-full text-xs border-collapse border border-slate-300">
      <thead>
        <tr className="bg-slate-100">
          <th className="border border-slate-300 p-1" rowSpan="2">外部金融</th>
          <th className="border border-slate-300 p-1">間接金融</th>
          <th className="border border-slate-300 p-1">借入金など</th>
          <th className="border border-slate-300 p-1">他人資本</th>
        </tr>
        <tr className="bg-slate-50">
          <th className="border border-slate-300 p-1">直接金融</th>
          <th className="border border-slate-300 p-1">株式・社債発行</th>
          <th className="border border-slate-300 p-1">資本市場から</th>
        </tr>
        <tr className="bg-white">
          <th className="border border-slate-300 p-1">内部金融</th>
          <th className="border border-slate-300 p-1" colSpan="2">減価償却・利益留保</th>
          <th className="border border-slate-300 p-1">自己資本</th>
        </tr>
      </thead>
    </table>
  </div>
);

// --- 問題データ ---

const QUESTIONS = [
  {
    id: 1,
    meta: "平成25年 第19問",
    title: "リスク回避者の無差別曲線",
    text: "縦軸に投資の期待収益率、横軸に当該投資収益率の標準偏差をとった平面上におけるリスク回避者の無差別曲線を表す図形として、最も適切なものはどれか。",
    choices: ["右上がりの曲線 (ア)", "右下がりの曲線 (イ)", "右上がりの凸曲線 (ウ)", "水平線 (エ)"],
    answer: 0,
    explanation: "「リスク回避者」とは、同一のリターン（期待収益率）ならば、リスク（標準偏差）のより小さいものを選好する投資家です。リスクが高くなるとき、リスクを嫌うこの投資家の満足度は低下するため、満足度の水準を一定に保つためには、リターンが上昇する必要があります。よって、右上がりの曲線となります。",
    visual: <IndifferenceCurveDiagram />
  },
  {
    id: 2,
    meta: "平成29年 第19問",
    title: "ポートフォリオのリターンとリスク",
    text: "A、B の2つの株式から構成されるポートフォリオにおいて、相関係数をさまざまに設定した場合のリターンとリスクを表した下図の①〜④のうち、相関係数が－1であるケースとして、最も適切なものはどれか。",
    choices: ["①", "②", "③", "④"],
    answer: 3,
    explanation: "相関係数が－1のとき、ポートフォリオのリスク低減効果は最も大きくなります。図では、標準偏差が0になる点を含む「折れ線」である④が相関係数 -1 に該当します。相関係数が 1 の場合は直線となります。",
    visual: <CorrelationDiagram />
  },
  {
    id: 3,
    meta: "令和3年 第20問",
    title: "証券投資論と市場ポートフォリオ",
    text: "証券投資論に関する記述として、最も適切なものはどれか。ただし、投資家はリスク回避的であり、安全資産への投資が可能であるものとする。",
    choices: [
      "効率的フロンティアは、安全資産より期待収益率の高いポートフォリオすべての集合である。",
      "最適なリスク・ポートフォリオは、投資家のリスク回避度とは無関係に決まる。",
      "市場ポートフォリオの有するリスクは、すべてのポートフォリオの中で最小である。",
      "投資家のリスク回避度は、効率的フロンティアに影響を与える。"
    ],
    answer: 1,
    explanation: "分離定理によれば、最適なリスク・ポートフォリオ（接点ポートフォリオ）は、投資家のリスク回避度（無差別曲線）とは無関係に、資本市場線と効率的フロンティアの接点として一意に決まります。",
    visual: null
  },
  {
    id: 4,
    meta: "令和4年 第16問",
    title: "ポートフォリオの選択と効率的フロンティア",
    text: "図（期待収益率-標準偏差平面）において、安全資産が存在する場合で、かつ資金の借り入れができないならば、効率的フロンティアはどのようになるか。",
    choices: [
      "曲線ABCDである。",
      "点Cのみである。",
      "曲線BCD上の点D寄りになる。",
      "FCDを結んだ線となる。"
    ],
    answer: 3,
    explanation: "安全資産Fが存在し、かつ資金の借入（レバレッジ）ができない場合、効率的フロンティアは、安全資産と接点ポートフォリオを結ぶ直線FCと、それよりリターンの高い曲線CDを組み合わせたFCDとなります。",
    visual: (
      <div className="w-full h-40 bg-white border rounded relative overflow-hidden">
        <svg viewBox="0 0 200 100" className="absolute inset-0">
          <path d="M40,90 Q50,40 160,20" fill="none" stroke="#ccc" strokeWidth="1" />
          <path d="M40,90 Q50,40 80,45" fill="none" stroke="red" strokeWidth="2" />
          <line x1="10" y1="60" x2="80" y2="45" stroke="red" strokeWidth="2" />
          <circle cx="10" cy="60" r="2" /> <text x="2" y="58" fontSize="8">F</text>
          <circle cx="80" cy="45" r="2" /> <text x="82" y="45" fontSize="8">C</text>
          <circle cx="160" cy="20" r="2" /> <text x="162" y="18" fontSize="8">D</text>
        </svg>
      </div>
    )
  },
  {
    id: 5,
    meta: "令和5年 第18問",
    title: "ポートフォリオ理論の基礎",
    text: "ポートフォリオ理論に関する記述として、最も適切なものはどれか。",
    choices: [
      "リスクは各資産のリスクを投資比率で加重平均した値である。",
      "リターンは各資産のリターンを投資比率で加重平均した値である。",
      "相関係数が大きいほど、リスク低減効果は顕著となる。",
      "ポートフォリオのリスクは、リスク資産への投資比率に反比例する。"
    ],
    answer: 1,
    explanation: "期待収益率（リターン）は単なる加重平均で求められますが、リスク（標準偏差）は相関係数を考慮する必要があるため、単純な加重平均にはなりません。",
    visual: null
  },
  {
    id: 6,
    meta: "平成27年 第18問",
    title: "資本資産評価モデル（CAPM）",
    text: "資本資産評価モデル（CAPM）に関する記述として、最も適切なものはどれか。",
    choices: [
      "βが0以上1未満である証券の期待収益率は、無リスク資産の利子率よりも低い。",
      "βがゼロである証券の期待収益率はゼロである。",
      "均衡状態においては、すべての投資家が、危険資産として市場ポートフォリオを所有する。",
      "市場ポートフォリオの期待収益率は、市場リスクプレミアムと呼ばれる。"
    ],
    answer: 2,
    explanation: "CAPMの均衡状態では、すべての投資家はリスク資産の組み合わせとして「市場ポートフォリオ」を同一の比率で保有します（分離定理）。市場リスクプレミアムは「市場収益率 － 無リスク利子率」です。",
    visual: null
  },
  {
    id: 7,
    meta: "平成28年 第12問",
    title: "CAPMによる期待収益率の計算",
    text: "以下の資料に基づき、株式の期待収益率を求めよ。：市場期待収益率 8%、無リスク資産 3%、β 1.4、実効税率 40%。",
    choices: ["4.4%", "7.0%", "10.0%", "11.2%"],
    answer: 2,
    explanation: "個別期待収益率 = 無リスク資産(3%) + β(1.4) × (市場収益率(8%) - 無リスク(3%)) = 3 + 1.4 × 5 = 10% となります。実効税率は計算に関係ありません。",
    visual: null
  },
  {
    id: 8,
    meta: "令和3年 第15問",
    title: "加重平均資本コスト(WACC)の算出",
    text: "以下の資料に基づきWACCを計算せよ。株価1,200円、発行済50,000株、負債簿価4,000万円(時価等しい)、自己資本コスト12%、社債利回り4%、実効税率30%。",
    choices: ["6.16%", "7.68%", "8.32%", "8.80%"],
    answer: 2,
    explanation: "時価ベースのウェイト：自己資本 = 1200円×5万株=6,000万円。総額=1億円（負債4000万：資本6000万）。WACC = (0.4 × 4% × (1-0.3)) + (0.6 × 12%) = 1.12% + 7.2% = 8.32% です。",
    visual: <WACCBoxDiagram />
  },
  {
    id: 9,
    meta: "平成28年 第10問",
    title: "直接金融と間接金融の定義",
    text: "直接金融と間接金融に関する記述として最も適切なものはどれか。",
    choices: [
      "企業の増資に応じて、投資家が証券会社を通し株式を取得したとき、企業にとっては直接金融となる。",
      "銀行が株式の発行を行った場合は間接金融となる。",
      "「貯蓄から投資へ」のスローガンは、間接金融の割合を増やすことを目指している。",
      "社債の発行による資金調達は、間接金融である。"
    ],
    answer: 0,
    explanation: "証券会社は仲介（ブローカー）に過ぎず、投資家から企業へ直接資金が流れるため、株式・社債発行は「直接金融」に分類されます。",
    visual: <FinanceTypeTable />
  },
  {
    id: 10,
    meta: "平成25年 第13問",
    title: "ファイナンス・リースの特徴",
    text: "ファイナンス・リースに関する記述として、最も不適切なものはどれか。",
    choices: [
      "借り手側は中途解約ができない（ノンキャンセラブル）。",
      "リース物件の維持管理費用は、貸し手が負担する。",
      "リース物件は、借り手側の貸借対照表上で開示される。",
      "リース物件は、借り手において減価償却費が算定される。"
    ],
    answer: 1,
    explanation: "ファイナンス・リースは「フルペイアウト」の原則に基づき、維持管理費用や公租公課などのコストはすべて借り手が負担します。",
    visual: null
  },
  {
    id: 11,
    meta: "平成30年 第6問",
    title: "リース会計の借手側の処理",
    text: "ファイナンス・リース取引の借手側の会計処理として、最も適切なものはどれか。",
    choices: [
      "減価償却費は、常にリース期間を耐用年数として算定する。",
      "リース債務は、1年以内に支払期限がくるものは流動負債に表示する。",
      "資産・債務の計上額は、常にリース料総額とする。",
      "1年以内に満了するリース資産は流動資産に表示する。"
    ],
    answer: 1,
    explanation: "リース債務は金銭債務と同様に、ワン・イヤー・ルールに基づき、1年以内に期限が到来するものは流動負債、それを超えるものは固定負債として表示します。",
    visual: null
  },
  {
    id: 12,
    meta: "平成27年 第19問",
    title: "ポートフォリオ理論におけるリスクの意味",
    text: "リスクに関する記述として最も適切なものはどれか。",
    choices: [
      "安全資産とは、期待収益率がゼロである資産のことである。",
      "完全な正の相関を有する2つの株式へ分散投資しても、リスク分散効果は得られない。",
      "同一企業の社債と株式を比較すると、リスクが高いのは社債である。",
      "分散投資によって、リスクを完全にゼロにすることができる。"
    ],
    answer: 1,
    explanation: "相関係数が 1（完全に同じ動き）の場合、組み合わせても振れ幅（標準偏差）は縮小せず、リスク分散効果は全く得られません。",
    visual: null
  },
  {
    id: 13,
    meta: "平成30年 第20問",
    title: "効率的市場仮説（ウィーク型）",
    text: "市場の効率性に関する記述として、最も不適切なものはどれか。",
    choices: [
      "ウィーク型仮説では、過去のデータから将来の株価を予測することは不可能であるとされる。",
      "情報が即座に価格に織り込まれることを、効率的価格形成と呼ぶ。",
      "取引上の効率性とは、手数料やシステム全般が円滑に機能しているかを意味する。",
      "セミストロング型仮説では、ファンダメンタル分析で超過収益を得られるとされる。"
    ],
    answer: 3,
    explanation: "セミストロング型仮説では、公開情報はすべて価格に反映済みとされるため、公開情報を分析するファンダメンタル分析でも超過収益を得ることは不可能とされます。",
    visual: null
  },
  {
    id: 14,
    meta: "令和5年 第19問",
    title: "効率的市場仮説の分類",
    text: "効率的市場仮説（セミストロング型）に関する記述として、最も適切なものはどれか。",
    choices: [
      "インサイダー取引によっても超過リターンを獲得できない。",
      "市場価格は公に入手可能な情報を反映する。",
      "市場価格は規則的に変動する。",
      "将来の価格は確実に予測できる。"
    ],
    answer: 1,
    explanation: "セミストロング型は「公開情報」が反映されているとする仮説です。インサイダー情報まで反映されているとするのは「ストロング型」です。",
    visual: null
  },
  {
    id: 15,
    meta: "令和5年 第21問",
    title: "サステナブル成長率",
    text: "サステナブル成長率に関する記述として、最も適切なものはどれか。",
    choices: [
      "全額を配当する場合、成長率はリスクフリーレートに一致する。",
      "サステナブル成長率は、ROEに配当性向を乗じることで求められる。",
      "サステナブル成長率は、内部留保率には左右されない。",
      "サステナブル成長率は、配当割引モデルにおける配当成長率として用いることができる。"
    ],
    answer: 3,
    explanation: "サステナブル成長率 = ROE × (1 － 配当性向) であり、これは企業の持続可能な内部的な成長率として配当割引モデルの g に適用可能です。",
    visual: null
  },
  {
    id: 16,
    meta: "令和5年 第22問",
    title: "市場リスクの定義",
    text: "市場リスクに関する適切な組み合わせを選べ。a.為替変動リスク、b.信用リスク、c.金利変動リスク、d.流動性リスク",
    choices: ["a と b", "a と c", "a と d", "b と c"],
    answer: 1,
    explanation: "市場リスクとは市場価格の変動による損失リスクで、為替(a)や金利(c)が該当します。bは信用リスク、dは流動性リスクという独立したカテゴリです。",
    visual: null
  }
];

// --- アプリメインコンポーネント ---

export default function App() {
  const [view, setView] = useState('list'); // 'list', 'quiz'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'incorrect', 'review'
  
  // 学習状況の状態保持
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('sm_finance_stats');
    return saved ? JSON.parse(saved) : {
      history: {}, // qId: { correct: boolean }
      reviews: {}  // qId: boolean
    };
  });

  useEffect(() => {
    localStorage.setItem('sm_finance_stats', JSON.stringify(stats));
    console.log("Stats Updated:", stats);
  }, [stats]);

  // フィルタリングされた問題リスト
  const filteredQuestions = useMemo(() => {
    if (filter === 'incorrect') {
      return QUESTIONS.filter(q => stats.history[q.id]?.correct === false);
    }
    if (filter === 'review') {
      return QUESTIONS.filter(q => stats.reviews[q.id]);
    }
    return QUESTIONS;
  }, [filter, stats]);

  const handleSelectChoice = (idx) => {
    if (showAnswer) return;
    setSelectedChoice(idx);
    setShowAnswer(true);
    
    const isCorrect = idx === filteredQuestions[currentIdx].answer;
    setStats(prev => ({
      ...prev,
      history: { ...prev.history, [filteredQuestions[currentIdx].id]: { correct: isCorrect } }
    }));
  };

  const toggleReview = (qId) => {
    setStats(prev => ({
      ...prev,
      reviews: { ...prev.reviews, [qId]: !prev.reviews[qId] }
    }));
  };

  const startQuiz = (mode) => {
    setFilter(mode);
    setCurrentIdx(0);
    setShowAnswer(false);
    setSelectedChoice(null);
    setView('quiz');
    console.log("Quiz Started. Mode:", mode);
  };

  const nextQuestion = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowAnswer(false);
      setSelectedChoice(null);
    } else {
      setView('list');
    }
  };

  // --- レンダリング ---

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
        <div className="max-w-2xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-blue-700">資本市場と資本コスト問題集</h1>
            <p className="text-sm text-slate-500">中小企業診断士 財務・会計</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => startQuiz('all')} className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition">
              <RefreshCcw size={18} /> 全件チャレンジ
            </button>
            <button 
              disabled={!QUESTIONS.some(q => stats.history[q.id]?.correct === false)}
              onClick={() => startQuiz('incorrect')} 
              className="flex items-center justify-center gap-2 p-4 bg-white text-red-600 border border-red-200 rounded-xl shadow hover:bg-red-50 transition disabled:opacity-50"
            >
              <XCircle size={18} /> 不正解のみ
            </button>
            <button 
              disabled={!QUESTIONS.some(q => stats.reviews[q.id])}
              onClick={() => startQuiz('review')} 
              className="flex items-center justify-center gap-2 p-4 bg-white text-orange-600 border border-orange-200 rounded-xl shadow hover:bg-orange-50 transition disabled:opacity-50"
            >
              <Bookmark size={18} /> 要復習のみ
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-100 border-b font-semibold flex justify-between items-center text-sm">
              <span>問題リスト</span>
              <span className="text-xs text-slate-500">{QUESTIONS.length}問 収録</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto">
              {QUESTIONS.map((q, idx) => {
                const history = stats.history[q.id];
                const isReview = stats.reviews[q.id];
                return (
                  <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-mono">{q.meta}</span>
                      <span className="text-sm font-medium leading-tight">{q.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isReview && <Bookmark size={14} className="text-orange-500 fill-orange-500" />}
                      {history && (
                        history.correct 
                          ? <CheckCircle2 size={18} className="text-green-500" />
                          : <XCircle size={18} className="text-red-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = filteredQuestions[currentIdx];

  if (!q) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-slate-500">対象の問題が見つかりませんでした。</p>
          <button onClick={() => setView('list')} className="text-blue-600 font-bold">リストに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:py-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white min-h-screen md:min-h-0 md:rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Progress Header */}
        <div className="px-6 py-4 bg-white border-b flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question</span>
            <span className="text-sm font-bold font-mono">{currentIdx + 1} / {filteredQuestions.length}</span>
          </div>
          <button 
            onClick={() => toggleReview(q.id)}
            className={`p-2 rounded-full transition ${stats.reviews[q.id] ? 'bg-orange-100 text-orange-500' : 'text-slate-300'}`}
          >
            <Bookmark size={20} fill={stats.reviews[q.id] ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Quiz Content */}
        <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                {q.meta}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{q.text}</h2>
          </div>

          {q.visual && <div className="mt-4">{q.visual}</div>}

          {/* Choices */}
          <div className="grid grid-cols-1 gap-3 pt-4">
            {q.choices.map((choice, idx) => {
              let btnClass = "w-full p-4 text-left border-2 rounded-2xl transition-all flex items-center justify-between group ";
              if (!showAnswer) {
                btnClass += "border-slate-100 hover:border-blue-300 hover:bg-blue-50 bg-slate-50";
              } else {
                if (idx === q.answer) {
                  btnClass += "border-green-500 bg-green-50 text-green-700 font-bold";
                } else if (idx === selectedChoice) {
                  btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                  btnClass += "border-slate-50 opacity-40 bg-slate-50";
                }
              }

              return (
                <button 
                  key={idx} 
                  disabled={showAnswer}
                  onClick={() => handleSelectChoice(idx)}
                  className={btnClass}
                >
                  <span className="text-sm md:text-base leading-tight">{choice}</span>
                  {showAnswer && idx === q.answer && <Check size={20} className="text-green-500" />}
                  {showAnswer && idx === selectedChoice && idx !== q.answer && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswer && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-blue-700">
                  <Info size={20} />
                  <h3 className="font-bold">解説</h3>
                </div>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  {q.explanation}
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" 
                      checked={stats.reviews[q.id] || false}
                      onChange={() => toggleReview(q.id)}
                    />
                    要復習に追加
                  </label>
                  <button 
                    onClick={nextQuestion}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg active:scale-[0.98]"
                  >
                    {currentIdx < filteredQuestions.length - 1 ? "次の問題へ" : "結果を保存して終了"}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}