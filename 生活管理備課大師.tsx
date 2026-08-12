import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Loader2, BookOpen, User, FileText, Copy, Check, Download, Image as ImageIcon, Circle, X, ListChecks, Plus, Minus, MessageCircle, ListOrdered, ClipboardCheck, RefreshCw, ExternalLink, Home } from 'lucide-react';

// --- 選項資料 ---
const gradeOptions = ["國小低年級", "國小中年級", "國小高年級", "國中七年級", "國中八年級", "國中九年級", "高中職", "特教學校(高中部)"];
const traitOptionsList = [
  "認知能力佳", "認知能力弱", "精細動作佳", "精細動作弱",
  "需要視覺提示", "識字能力偏弱", "抗壓性低", "人際互動佳", "人際互動弱", "生活自理弱", "容易分心"
];

const outputOptionsList = [
  { id: 'lessonPlan', label: '教案 (含目標、準備、流程)' },
  { id: 'outline', label: '簡報大綱 (可作為 NotebookLM 來源)' },
  { id: 'worksheet', label: '結構化學習單 (展開設定題型)', isWorksheetParent: true },
  { id: 'roleplay', label: '生活情境對話稿 (實作演練)' },
  { id: 'steps', label: '生活步驟提示卡 (行為SOP)' },
  { id: 'checklist', label: '生活自我檢核表 (自我管理)' },
  { id: 'story', label: '生活情境故事 (含圖卡)' }
];

const worksheetSubOptions = [
  { id: 'tf', label: '情境圈叉題 (O/X)' },
  { id: 'mc', label: '選擇題 (單選)' },
  { id: 'check', label: '勾選題 (複選)' },
  { id: 'shortAns', label: '問答題' },
  { id: 'custom', label: '自訂題型' }
];

// --- 資料整理：生活管理學習重點 ---
const curriculumData = {
  performances: {
    title: "學習表現",
    categories: [
      {
        name: "自我照顧",
        stages: {
          "初階 (sP)": [
            "特生1-sP-1 覺察及表達飢餓和飽足的生理反應。",
            "特生1-sP-2 使用適當的餐具進食。",
            "特生1-sP-3 食用前進行洗滌、剝皮或打開包裝等。",
            "特生1-sP-4 表現合宜的用餐禮儀與協助餐後整理。",
            "特生1-sP-5 選擇乾淨新鮮且於保存期限內的食物。",
            "特生1-sP-6 自我檢視並控制飲食行為和習慣。",
            "特生1-sP-7 表達穿著衣物的不適感並請求更換。",
            "特生1-sP-8 維持衣著整潔，並每日換洗貼身衣物。",
            "特生1-sP-9 選擇適當場所並完成衣物穿脫與更換。",
            "特生1-sP-10 視天氣、場合、年齡、個人喜好，選擇適合的衣著。",
            "特生1-sP-11 分類衣物並收納保管。",
            "特生1-sP-12 覺察並表達如廁需求，能自行或由他人協助前往廁所。",
            "特生1-sP-13 依個人需求選擇合適且乾淨的便器。",
            "特生1-sP-14 精熟如廁技巧，如攜帶衛生紙、穿脫褲子、擦拭、沖水、洗手等。",
            "特生1-sP-15 表現如廁時的禮儀。",
            "特生1-sP-16 具備洗手、洗臉、刷牙及使用牙線的技能。",
            "特生1-sP-17 完整清潔身體各部位。",
            "特生1-sP-18 具備洗髮、梳髮、整髮的技能。",
            "特生1-sP-19 隨時整理與保持儀容整潔。",
            "特生1-sP-20 具備良好的口鼻衛生習慣。",
            "特生1-sP-21 辨識及避免食用不潔或遭受汙染的食物。",
            "特生1-sP-22 具備危險意識，並能主動或依指示遠離危險情境。",
            "特生1-sP-23 描述不適症狀，請求協助或表達就醫需求。",
            "特生1-sP-24 認識身體構造、器官、常見疾病及症狀。",
            "特生1-sP-25 在協助下接受體適能測驗及身體健康檢查。",
            "特生1-sP-26 表現規律的生活習慣與作息，從事適當的運動與休閒。",
            "特生1-sP-27 覺察並接受青春期之身心理變化。",
            "特生1-sP-28 使用家中常備藥品，遵守用藥安全，並配合醫囑。"
          ],
          "進階 (sA)": [
            "特生1-sA-1 烹調用具使用前後能清洗潔淨。",
            "特生1-sA-2 使用適當方式加熱、沖泡、烹調簡易餐食。",
            "特生1-sA-3 選擇適宜的用餐場所與安全的飲食行為。",
            "特生1-sA-4 遵守有益身體健康的飲食原則，並理解飲食與疾病的關係。",
            "特生1-sA-5 選購適合自己的衣物。",
            "特生1-sA-6 使用適當方式洗濯及晾曬衣物。",
            "特生1-sA-7 整理及收納個人衣物。",
            "特生1-sA-8 檢查衣物破損情形並加以處理。",
            "特生1-sA-9 適時修剪指甲與頭髮。",
            "特生1-sA-10 處理青春期的身體變化及性需求。",
            "特生1-sA-11 選用適合自己的盥洗清潔及美容美髮用品。",
            "特生1-sA-12 表現疾病預防的健康行為。",
            "特生1-sA-13 描述受傷害的經過並尋求適當協助。",
            "特生1-sA-14 使用急救箱處理簡易外傷。",
            "特生1-sA-15 熟悉社區醫療資源並能自行就醫。",
            "特生1-sA-16 養成良好的運動與休閒習慣。",
            "特生1-sA-17 主動吸取健康知識，增進自我健康。"
          ]
        }
      },
      {
        name: "家庭生活",
        stages: {
          "初階 (sP)": [
            "特生2-sP-1 妥善保管個人財物並避免遺失。",
            "特生2-sP-2 建立簡單的儲蓄行為。",
            "特生2-sP-3 使用物品時表現節約與珍惜資源的態度和行為。",
            "特生2-sP-4 尊重他人的物權。",
            "特生2-sP-5 記錄個人日常生活收支，購物前衡量自身財力與實際需求。",
            "特生2-sP-6 維持個人物品與環境的整齊清潔。",
            "特生2-sP-7 正確使用環境清潔用品，並從事簡單的家務清潔工作與資源回收。",
            "特生2-sP-8 安全使用個人及家中物品或家電。",
            "特生2-sP-9 辨識家中潛在危險處並注意自身與門戶安全。",
            "特生2-sP-10 處理家中損壞物品並注意自身安全。",
            "特生2-sP-11 辨識並了解居家緊急事件與天然災害的因應措施，及其適宜的求助方式。",
            "特生2-sP-12 培養對休閒活動的認識與興趣。",
            "特生2-sP-13 區辨隱私的場所和行為，並維護自己和家人的隱私權。",
            "特生2-sP-14 接受自己的性別氣質，保護自己並尊重他人的身體自主權。",
            "特生2-sP-15 辨識家庭暴力、性騷擾、性侵害、性霸凌等行為，並能自我保護及求助。"
          ],
          "進階 (sA)": [
            "特生2-sA-1 具備儲蓄、使用塑膠貨幣及行動支付的技能。",
            "特生2-sA-2 規劃日常生活的費用及收支管理事宜。",
            "特生2-sA-3 落實資源回收與再利用。",
            "特生2-sA-4 完成家庭常見的維護及修繕工作。",
            "特生2-sA-5 從事安全的個人和家庭休閒活動。",
            "特生2-sA-6 遵守網路及各類資訊平台的使用規範。",
            "特生2-sA-7 熟練居家緊急事件及天然災害的因應措施。"
          ]
        }
      },
      {
        name: "社區參與",
        stages: {
          "初階 (sP)": [
            "特生3-sP-1 獨立行動的能力。",
            "特生3-sP-2 認識社區環境與資源。",
            "特生3-sP-3 認識及避免常見的危險情境。",
            "特生3-sP-4 認識消費場所及完成消費行為。",
            "特生3-sP-5 遵守公共場所及設施的使用規範。",
            "特生3-sP-6 能描述自己所在的位置。"
          ],
          "進階 (sA)": [
            "特生3-sA-1 能處理自身所遇的意外事件。",
            "特生3-sA-2 依需求善用社區資源。",
            "特生3-sA-3 辨識各種詐騙行為及避免受騙。",
            "特生3-sA-4 因應不同的危險情境，採取適當的措施。",
            "特生3-sA-5 認識及使用身心障礙服務資源。"
          ]
        }
      },
      {
        name: "自我決策",
        stages: {
          "初階 (sP)": [
            "特生4-sP-1 認識自己並接受自己的特質。",
            "特生4-sP-2 具備日常生活中做決定的能力。",
            "特生4-sP-3 能自行設定目標。",
            "特生4-sP-4 能解決日常生活的問題。",
            "特生4-sP-5 能反省自己的行為與學習表現。",
            "特生4-sP-6 能自我激勵。"
          ],
          "進階 (sA)": [
            "特生4-sA-1 規劃與管理自己的生活。",
            "特生4-sA-2 能為自己做的決定負責。",
            "特生4-sA-3 能表達對生涯規劃的想法，並與他人討論。",
            "特生4-sA-4 執行自訂的目標並檢核結果。",
            "特生4-sA-5 省思先前做決定的結果，必要時加以調整。",
            "特生4-sA-6 獨立解決問題。",
            "特生4-sA-7 參與和自身權益相關的活動，並表達意見。",
            "特生4-sA-8 爭取自我表達、決定或行動的機會。",
            "特生4-sA-9 肯定自己的能力與表現。",
            "特生4-sA-10 願意持續付出時間與心力，充分發揮優勢。"
          ]
        }
      }
    ]
  },
  contents: {
    title: "學習內容",
    categories: [
      {
        name: "飲食",
        stages: {
          "初階 (sP)": ["特生A-sP-1 飲食需求的表達。", "特生A-sP-2 進食技巧。", "特生A-sP-3 餐具的辨認與選擇。", "特生A-sP-4 食物的認識。", "特生A-sP-5 食物的處理。", "特生A-sP-6 飲食的衛生習慣。", "特生A-sP-7 餐前準備與餐後收拾的技巧。", "特生A-sP-8 用餐禮儀。", "特生A-sP-9 簡易餐食的製作。"],
          "進階 (sA)": ["特生A-sA-1 烹調用具的認識與使用。", "特生A-sA-2 食物烹調前的處理。", "特生A-sA-3 食物的選購。", "特生A-sA-4 食物的烹調方式。", "特生A-sA-5 食物的保存方法。", "特生A-sA-6 廚房的清洗及收納。"]
        }
      },
      {
        name: "衣著",
        stages: {
          "初階 (sP)": ["特生B-sP-1 衣物穿脫技巧。", "特生B-sP-2 衣物的認識。", "特生B-sP-3 衣物的清潔與收納。"],
          "進階 (sA)": ["特生B-sA-1 衣物選購。", "特生B-sA-2 服裝禮儀。"]
        }
      },
      {
        name: "個人衛生",
        stages: {
          "初階 (sP)": ["特生C-sP-1 如廁技巧。", "特生C-sP-2 如廁禮儀。", "特生C-sP-3 身體的清潔方式。", "特生C-sP-4 個人清潔用品的認識。", "特生C-sP-5 個人清潔。"],
          "進階 (sA)": ["特生C-sA-1 青春期的清潔衛生。", "特生C-sA-2 個人清潔用品的選用。", "特生C-sA-3 簡易儀容裝扮的技巧。"]
        }
      },
      {
        name: "健康管理",
        stages: {
          "初階 (sP)": ["特生D-sP-1 身體器官與功能的認識。", "特生D-sP-2 身體構造與系統的認識。", "特生D-sP-3 常見疾病的預防與處理。", "特生D-sP-4 健康的生活習慣。", "特生D-sP-5 安全用藥。", "特生D-sP-6 簡易外傷的處理。", "特生D-sP-7 社區醫療資源的認識。"],
          "進階 (sA)": ["特生D-sA-1 青春期的身心健康。", "特生D-sA-2 簡易急救措施。", "特生D-sA-3 就醫知能。", "特生D-sA-4 健康檢查的認識。", "特生D-sA-5 社區醫療資源的運用。"]
        }
      },
      {
        name: "財物管理",
        stages: {
          "初階 (sP)": ["特生E-sP-1 日常財物的使用與保管。", "特生E-sP-2 金錢的概念。", "特生E-sP-3 塑膠貨幣與行動支付的認識與使用。", "特生E-sP-4 消費與儲蓄。", "特生E-sP-5 記帳的技能。", "特生E-sP-6 金融機構的認識。"],
          "進階 (sA)": ["特生E-sA-1 物品再利用的方式。", "特生E-sA-2 金融機構的運用。", "特生E-sA-3 個人預算、收支與管理。", "特生E-sA-4 繳納費用的方式。", "特生E-sA-5 金融詐騙的認識與防範。"]
        }
      },
      {
        name: "環境衛生",
        stages: {
          "初階 (sP)": ["特生F-sP-1 環境衛生的觀念。", "特生F-sP-2 清潔用品的認識與使用。", "特生F-sP-3 清掃工作的技能。", "特生F-sP-4 垃圾分類與資源回收。"],
          "進階 (sA)": ["特生F-sA-1 居家物品的擺放與收納。", "特生F-sA-2 家電用品的清潔。", "特生F-sA-3 環境美化的知能。"]
        }
      },
      {
        name: "居家安全",
        stages: {
          "初階 (sP)": ["特生G-sP-1 家電用品的認識。", "特生G-sP-2 家用修繕工具的認識與使用。", "特生G-sP-3 用電安全。", "特生G-sP-4 使用瓦斯及用火安全。", "特生G-sP-5 其他居家安全。", "特生G-sP-6 意外事件的認識。", "特生G-sP-7 天然災害的認識。"],
          "進階 (sA)": ["特生G-sA-1 家電用品的使用與維護。", "特生G-sA-2 家用修繕工具的使用。", "特生G-sA-3 意外事件的處理。", "特生G-sA-4 天然災害的應變。"]
        }
      },
      {
        name: "休閒活動",
        stages: {
          "初階 (sP)": ["特生H-sP-1 休閒活動的認識。", "特生H-sP-2 休閒活動的選擇。"],
          "進階 (sA)": ["特生H-sA-1 休閒活動內容與時間的規劃。", "特生H-sA-2 邀請他人共同從事休閒活動的技巧。"]
        }
      },
      {
        name: "家庭關係與自我保護",
        stages: {
          "初階 (sP)": ["特生I-sP-1 家庭成員的互動和家庭倫理。", "特生I-sP-2 家庭生活的參與技能。", "特生I-sP-3 家庭成員的角色。", "特生I-sP-4 身體隱私與界限的認識與保護。", "特生I-sP-5 身體自主權的維護與尊重。", "特生I-sP-6 性騷擾、性侵害與性霸凌的認識。", "特生I-sP-7 家庭暴力的認識。"],
          "進階 (sA)": ["特生I-sA-1 家庭成員間適當的互動方式。", "特生I-sA-2 家庭成員的責任。", "特生I-sA-3 性別多樣性的認識與尊重。", "特生I-sA-4 親密關係建立、發展、結束過程中的風險與自我保護。", "特生I-sA-5 性騷擾、性侵害與性霸凌的防護及求助。", "特生I-sA-6 家庭暴力的自我保護與求助。"]
        }
      },
      {
        name: "行動與交通安全",
        stages: {
          "初階 (sP)": ["特生J-sP-1 交通工具的認識。", "特生J-sP-2 道路交通規則的認識與遵守。", "特生J-sP-3 各類交通工具資訊的辨識與使用。"],
          "進階 (sA)": ["特生J-sA-1 交通路線規劃與轉乘技能。", "特生J-sA-2 交通事故的處理。"]
        }
      },
      {
        name: "社區生活",
        stages: {
          "初階 (sP)": ["特生K-sP-1 就讀學校的認識。", "特生K-sP-2 社區環境與資源的認識。", "特生K-sP-3 社區活動的參與。", "特生K-sP-4 社區危險情境的辨識與防範。", "特生K-sP-5 購物的流程與技巧。"],
          "進階 (sA)": ["特生K-sA-1 社區資源與設施的運用。", "特生K-sA-2 消費者權益的認識。", "特生K-sA-3 各種詐騙行為的認識與防範。", "特生K-sA-4 身心障礙服務資源的認識與利用。"]
        }
      },
      {
        name: "獨立自主與自我管理",
        stages: {
          "初階 (sP)": ["特生L-sP-1 自我目標的設定。", "特生L-sP-2 生活事務作決定的策略。", "特生L-sP-3 簡易生活問題的解決策略。", "特生L-sP-4 自我管理技巧。", "特生L-sP-5 自我負責。"],
          "進階 (sA)": ["特生L-sA-1 自我生涯規劃的技巧。", "特生L-sA-2 目標的執行與檢核。", "特生L-sA-3 複雜問題的解決策略。", "特生L-sA-4 自我回饋。"]
        }
      },
      {
        name: "心理賦權與自我實現",
        stages: {
          "初階 (sP)": ["特生M-sP-1 自我倡導的認識。", "特生M-sP-2 自我覺察。"],
          "進階 (sA)": ["特生M-sA-1 自我倡導的實踐。", "特生M-sA-2 自我效能。", "特生M-sA-3 自我增強。", "特生M-sA-4 自我實現。"]
        }
      }
    ]
  }
};

// --- 組件：可折疊的選項區塊 ---
const ExpandableSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg mb-4 overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors font-semibold text-slate-800"
      >
        <span className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
          {title}
        </span>
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
};

export default function App() {
  const [selectedItems, setSelectedItems] = useState({ performances: [], contents: [] });
  const [grade, setGrade] = useState("");
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [studentStatus, setStudentStatus] = useState("");
  const [customTopic, setCustomTopic] = useState(""); 
  
  // 分層選擇的狀態管理
  const [perfTab, setPerfTab] = useState({ catIdx: 0, stage: '初階 (sP)' });
  const [contTab, setContTab] = useState({ catIdx: 0, stage: '初階 (sP)' });

  // 產出設定的 state (預設只選教案和學習單)
  const [selectedOutputs, setSelectedOutputs] = useState(['lessonPlan', 'worksheet']); 
  const [selectedWorksheetTypes, setSelectedWorksheetTypes] = useState(worksheetSubOptions.map(opt => opt.id));
  const [worksheetCounts, setWorksheetCounts] = useState({ tf: 3, mc: 3, check: 3, shortAns: 2, custom: 3 }); 
  const [customWorksheetType, setCustomWorksheetType] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [lessonData, setLessonData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 單獨重新生成的狀態管理
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [sectionPrompts, setSectionPrompts] = useState({});

  const apiKey = ""; // API key is provided by the execution environment

  // 確保 docx 與 FileSaver 腳本掛載
  useEffect(() => {
    if (!window.docx) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/docx@7.1.0/build/index.js";
      script.async = true;
      document.body.appendChild(script);
    }
    if (!window.saveAs) {
      const script2 = document.createElement('script');
      script2.src = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js";
      script2.async = true;
      document.body.appendChild(script2);
    }
  }, []);

  const handleToggleTrait = (trait) => {
    setSelectedTraits(prev =>
      prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
    );
  };

  const handleToggleOutput = (outputId) => {
    setSelectedOutputs(prev =>
      prev.includes(outputId) ? prev.filter(id => id !== outputId) : [...prev, outputId]
    );
  };

  const handleToggleWorksheetType = (typeId) => {
    setSelectedWorksheetTypes(prev => 
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  }

  const handleCountChange = (id, delta) => {
    setWorksheetCounts(prev => {
      const newCount = (prev[id] || 0) + delta;
      if (newCount >= 1 && newCount <= 10) { 
        return { ...prev, [id]: newCount };
      }
      return prev;
    });
  };

  const handleToggleItem = (type, item) => {
    setSelectedItems(prev => {
      const currentList = prev[type];
      if (currentList.includes(item)) {
        return { ...prev, [type]: currentList.filter(i => i !== item) };
      } else {
        if (currentList.length >= 3) {
          const typeName = type === 'performances' ? '學習表現' : '學習內容';
          alert(`為了確保教學目標聚焦，【${typeName}】最多只能選擇 3 項喔！少即是多，對特教學生學習更有幫助。`);
          return prev; 
        }
        return { ...prev, [type]: [...currentList, item] };
      }
    });
  };

  const renderCascadingSelection = (dataSection, typeKey, tabState, setTabState) => {
    const categories = dataSection.categories;
    const activeCat = categories[tabState.catIdx];
    const stages = Object.keys(activeCat.stages);
    const activeItems = activeCat.stages[tabState.stage] || [];

    return (
      <div className="flex flex-col gap-4">
        {/* 第一層：選擇類別 (主題) */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setTabState({ catIdx: idx, stage: Object.keys(categories[idx].stages)[0] })}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors shadow-sm ${
                tabState.catIdx === idx 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 第二層：選擇階段 */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {stages.map(stage => (
            <button
              key={stage}
              onClick={() => setTabState(prev => ({ ...prev, stage }))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                tabState.stage === stage 
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* 第三層：勾選指標 */}
        <div className="space-y-1.5 pl-1 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          {activeItems.map(item => (
            <label key={item} className="flex items-start gap-2 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <div className="mt-0.5 text-emerald-600 flex-shrink-0">
                {selectedItems[typeKey].includes(item) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 group-hover:text-emerald-400" />
                )}
              </div>
              <span className="text-sm text-slate-700 leading-tight pt-0.5">{item}</span>
              <input
                type="checkbox"
                className="hidden"
                checked={selectedItems[typeKey].includes(item)}
                onChange={() => handleToggleItem(typeKey, item)}
              />
            </label>
          ))}
          {activeItems.length === 0 && (
            <p className="text-sm text-slate-400 italic p-2">此階段無相關指標。</p>
          )}
        </div>
      </div>
    );
  };

  const fetchWithBackoff = async (url, options, maxRetries = 5) => {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || ''}`);
            }
            return await response.json();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(res => setTimeout(res, delay));
            delay *= 2;
        }
    }
  };

  const fetchImage = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: "皮克斯風格, 3D Pixar animation style, vivid colors, " + prompt }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    };
    
    const result = await fetchWithBackoff(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const inlineDataPart = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (inlineDataPart && inlineDataPart.inlineData && inlineDataPart.inlineData.data) {
        return inlineDataPart.inlineData.data;
    }
    
    throw new Error("Image generation returned invalid format: " + JSON.stringify(result));
  };

  const regenerateSpecificContent = async (sectionId) => {
    setRegeneratingId(sectionId);
    
    const userAdjustment = sectionPrompts[sectionId] || "請重新生成一個更適合的版本，可以換個情境或是改變難度。";
    const sectionNames = {
      lessonPlan: "教案 (含目標、準備、流程)",
      outline: "簡報大綱",
      worksheet: "結構化學習單",
      roleplay: "生活情境對話稿",
      steps: "生活步驟提示卡",
      checklist: "生活自我檢核表",
      story: "生活情境故事"
    };

    let studentProfile = "";
    if (grade || selectedTraits.length > 0 || studentStatus.trim()) {
      if (grade) studentProfile += `年級：${grade}\n`;
      if (selectedTraits.length > 0) studentProfile += `特質：${selectedTraits.join("、")}\n`;
      if (studentStatus.trim()) studentProfile += `補充說明：${studentStatus.trim()}\n`;
    } else {
      studentProfile = "無提供特定現況，請依一般特教學生程度設計。";
    }

    const baseContext = `
【原本的教學目標設定】
學習表現：${selectedItems.performances.length > 0 ? selectedItems.performances.join(", ") : "無"}
學習內容：${selectedItems.contents.length > 0 ? selectedItems.contents.join(", ") : "無"}
自訂教學主題：${customTopic.trim() ? customTopic.trim() : "無"}

【學生現況描述】
${studentProfile}
    `;

    let schemaProperties = {};
    let requiredFields = [];
    let extraInstructions = "";

    switch (sectionId) {
      case 'lessonPlan': {
         schemaProperties.objectives = { type: "ARRAY", items: { type: "STRING" } };
         schemaProperties.materials = { type: "ARRAY", items: { type: "STRING" } };
         schemaProperties.process = {
           type: "ARRAY",
           items: { type: "OBJECT", properties: { phase: { type: "STRING" }, time: { type: "STRING" }, activity: { type: "STRING" }, guidance: { type: "STRING" } }, required: ["phase", "time", "activity", "guidance"] }
         };
         requiredFields = ["objectives", "materials", "process"];
         break;
      }
      case 'outline': {
         schemaProperties.outline = {
           type: "ARRAY",
           items: { type: "OBJECT", properties: { slideTitle: { type: "STRING" }, bulletPoints: { type: "ARRAY", items: { type: "STRING" } } }, required: ["slideTitle", "bulletPoints"] }
         };
         requiredFields = ["outline"];
         break;
      }
      case 'worksheet': {
         let wTypes = [];
         if (selectedWorksheetTypes.includes('tf')) wTypes.push("'圈叉'");
         if (selectedWorksheetTypes.includes('mc')) wTypes.push("'選擇'");
         if (selectedWorksheetTypes.includes('check')) wTypes.push("'勾選'");
         if (selectedWorksheetTypes.includes('shortAns')) wTypes.push("'問答'");
         if (selectedWorksheetTypes.includes('custom') && customWorksheetType.trim() !== '') wTypes.push(`'${customWorksheetType.trim()}'`);

         if (wTypes.length === 0) {
           alert("請先在左側面板勾選需要的學習單題型！");
           setRegeneratingId(null);
           return;
         }
         extraInstructions = `\n【學習單設計特別要求】\n必須嚴格依照要求的題型與題數：\n`;
         if (selectedWorksheetTypes.includes('tf')) extraInstructions += `1. 「情境圈叉題」：剛好 ${worksheetCounts.tf} 題。\n`;
         if (selectedWorksheetTypes.includes('mc')) extraInstructions += `2. 「選擇題」：剛好 ${worksheetCounts.mc} 題。\n`;
         if (selectedWorksheetTypes.includes('check')) extraInstructions += `3. 「勾選題(圈選題)」：剛好 ${worksheetCounts.check} 題。\n`;
         if (selectedWorksheetTypes.includes('shortAns')) extraInstructions += `4. 「問答題」：提供具體情境，請學生簡答。剛好 ${worksheetCounts.shortAns} 題。\n`;
         if (selectedWorksheetTypes.includes('custom') && customWorksheetType.trim() !== '') extraInstructions += `5. 「${customWorksheetType.trim()}」：剛好 ${worksheetCounts.custom} 題。\n`;

         schemaProperties.worksheet = {
           type: "ARRAY",
           items: {
             type: "OBJECT",
             properties: {
               questionType: { type: "STRING", description: `題型，只能填入：${wTypes.join(', ')}` },
               question: { type: "STRING" },
               options: { type: "ARRAY", items: { type: "STRING" } }
             },
             required: ["questionType", "question"]
           }
         };
         requiredFields = ["worksheet"];
         break;
      }
      case 'roleplay': {
         schemaProperties.roleplay = {
           type: "ARRAY",
           items: { type: "OBJECT", properties: { role: { type: "STRING" }, line: { type: "STRING" }, action: { type: "STRING" } }, required: ["role", "line", "action"] }
         };
         requiredFields = ["roleplay"];
         break;
      }
      case 'steps': {
         schemaProperties.steps = { type: "ARRAY", items: { type: "STRING" } };
         requiredFields = ["steps"];
         break;
      }
      case 'checklist': {
         schemaProperties.checklist = { type: "ARRAY", items: { type: "STRING" } };
         requiredFields = ["checklist"];
         break;
      }
      case 'story': {
         extraInstructions = "必須產出一個生成四格漫畫的英文提示詞(imagePrompt)，不需其他內文。";
         schemaProperties.socialStory = {
           type: "OBJECT",
           properties: {
             imagePrompt: { type: "STRING", description: "主角的固定外觀與四個情境畫面的英文描述，必須指定為 4-panel comic 格式，例如：A 4-panel comic strip of a 12-year-old Taiwanese child. Panel 1: ... Panel 2: ... Panel 3: ... Panel 4: ..." }
           },
           required: ["imagePrompt"]
         };
         requiredFields = ["socialStory"];
         break;
      }
      default:
         break;
    }

    const systemPrompt = `你是一位資深特教老師。我們正在編寫一份生活管理教材。
請根據原始的教學設定與學生的現況，特別針對「${sectionNames[sectionId]}」這個區塊進行重新設計與微調。

【使用者的微調指令】：${userAdjustment}

【重要設計指引】
1. 請確保內容符合特教生易讀性，用語具體簡短。
2. 緊扣使用者所提的微調指令進行修改。
3. 完全依照要求的 JSON 格式輸出。${extraInstructions}`;

    const payload = {
      contents: [{ parts: [{ text: baseContext }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: schemaProperties,
          required: requiredFields
        }
      }
    };

    try {
      const response = await fetchWithBackoff(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text generated");

      const parsedData = JSON.parse(text);

      if (sectionId === 'story' && parsedData.socialStory) {
        setLessonData(prev => ({ ...prev, socialStory: parsedData.socialStory }));

        try {
            const base64 = await fetchImage(parsedData.socialStory.imagePrompt);
            setLessonData(prev => ({
                ...prev,
                socialStory: { ...prev.socialStory, base64: base64, error: false }
            }));
        } catch (e) {
            console.error("Image generation error:", e);
            setLessonData(prev => ({
                ...prev,
                socialStory: { ...prev.socialStory, error: true }
            }));
        }
      } else {
        setLessonData(prev => ({ ...prev, ...parsedData }));
      }
      
      setSectionPrompts(prev => ({ ...prev, [sectionId]: "" }));

    } catch (error) {
      console.error(error);
      alert("重新生成失敗，請稍後再試。");
    } finally {
      setRegeneratingId(null);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    textArea.remove();
  };

  const handleCopy = () => {
    if (!lessonData) return;
    
    let textToCopy = "";

    if (lessonData.objectives && lessonData.materials && lessonData.process) {
      textToCopy += `教學目標：\n${lessonData.objectives.map(o => `- ${o}`).join('\n')}\n\n`;
      textToCopy += `教學準備：\n${lessonData.materials.map(m => `- ${m}`).join('\n')}\n\n`;
      textToCopy += `教學流程：\n${lessonData.process.map(p => `【${p.phase}】(${p.time})\n活動：${p.activity}\n指導語：${p.guidance}`).join('\n\n')}\n\n`;
    }

    if (lessonData.outline && lessonData.outline.length > 0) {
      textToCopy += `簡報大綱：\n${lessonData.outline.map((slide, i) => `【第 ${i + 1} 張】${slide.slideTitle}\n${slide.bulletPoints.map(bp => `  - ${bp}`).join('\n')}`).join('\n\n')}\n\n`;
    }

    if (lessonData.worksheet && lessonData.worksheet.length > 0) {
      const worksheetText = lessonData.worksheet.map((w, i) => {
          let text = `${i + 1}. [${w.questionType}] ${w.question}\n`;
          
          if (w.questionType === '圈叉' || w.questionType === '情境圈叉題') {
              text += `   (   ) O   (   ) X\n`;
          } else if (w.questionType === '問答題' || w.questionType === '問答') {
              text += `   答：______________________________________\n       ______________________________________\n`;
          } else if (w.options && w.options.length > 0) {
              if (w.questionType === '選擇' || w.questionType === '選擇題') {
                  const labels = ["(A)", "(B)", "(C)", "(D)"];
                  text += w.options.map((opt, idx) => `   ${labels[idx] || ''} ${opt}`).join('\n');
              } else if (w.questionType === '勾選' || w.questionType === '勾選題') {
                  text += w.options.map(opt => `   □ ${opt}`).join('\n');
              } else {
                  text += w.options.map(opt => `   • ${opt}`).join('\n');
              }
          } else {
              text += `   答：_____________________`;
          }
          return text;
      }).join('\n\n');
      textToCopy += `學習單：\n${worksheetText}\n\n`;
    }

    if (lessonData.roleplay && lessonData.roleplay.length > 0) {
      textToCopy += `生活情境對話稿：\n${lessonData.roleplay.map(r => `【${r.role}】：「${r.line}」 (*${r.action}*)`).join('\n')}\n\n`;
    }

    if (lessonData.steps && lessonData.steps.length > 0) {
      textToCopy += `生活步驟提示卡：\n${lessonData.steps.map((s, i) => `步驟 ${i + 1}：${s}`).join('\n')}\n\n`;
    }

    if (lessonData.checklist && lessonData.checklist.length > 0) {
      textToCopy += `生活自我檢核表：\n${lessonData.checklist.map(c => `□ ${c}`).join('\n')}\n\n`;
    }

    if (lessonData.socialStory && lessonData.socialStory.imagePrompt) {
      textToCopy += `生活情境故事：\n(請參考系統產出的四格繁體中文的漫畫圖卡)\n\n`;
    }

    fallbackCopyTextToClipboard(textToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const base64ToUint8Array = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const exportToWord = async () => {
    if (!lessonData || !window.docx || !window.saveAs) return;
    setIsExporting(true);

    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, AlignmentType, ImageRun, HeadingLevel } = window.docx;
      const fontName = "Chiron GoRound TC"; 
      const docChildren = [];

      docChildren.push(new Paragraph({ text: "生活管理教材", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));

      if (lessonData.objectives && lessonData.materials && lessonData.process) {
        const processTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "教學階段", bold: true, font: fontName, size: 24 })] })], shading: { fill: "F1F5F9" }, margins: { top: 120, bottom: 120, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "時間", bold: true, font: fontName, size: 24 })] })], shading: { fill: "F1F5F9" }, margins: { top: 120, bottom: 120, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "活動內容", bold: true, font: fontName, size: 24 })] })], shading: { fill: "F1F5F9" }, margins: { top: 120, bottom: 120, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "教師指導語", bold: true, font: fontName, size: 24 })] })], shading: { fill: "F1F5F9" }, margins: { top: 120, bottom: 120, left: 120, right: 120 } })
              ]
            }),
            ...lessonData.process.map(p => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.phase, font: fontName, size: 24, color: "333333" })] })], margins: { top: 120, bottom: 120, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.time, font: fontName, size: 24, color: "333333" })] })], margins: { top: 120, bottom: 120, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.activity, font: fontName, size: 24, color: "333333" })] })], margins: { top: 120, bottom: 120, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.guidance, font: fontName, size: 24, color: "333333" })] })], margins: { top: 120, bottom: 120, left: 120, right: 120 } })
              ]
            }))
          ]
        });

        docChildren.push(
          new Paragraph({ text: "教學目標", heading: HeadingLevel.HEADING_2 }),
          ...lessonData.objectives.map(o => new Paragraph({ children: [new TextRun({ text: `• ${o}`, font: fontName, size: 24, color: "333333" })], indent: { left: 360 }, spacing: { after: 80 } })),
          new Paragraph({ text: "教學準備", heading: HeadingLevel.HEADING_2 }),
          ...lessonData.materials.map(m => new Paragraph({ children: [new TextRun({ text: `• ${m}`, font: fontName, size: 24, color: "333333" })], indent: { left: 360 }, spacing: { after: 80 } })),
          new Paragraph({ text: "教學流程", heading: HeadingLevel.HEADING_2 }),
          processTable
        );
      }

      if (lessonData.outline && lessonData.outline.length > 0) {
        docChildren.push(new Paragraph({ text: "簡報大綱", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));
        
        lessonData.outline.forEach((slide, idx) => {
          docChildren.push(new Paragraph({
            children: [new TextRun({ text: `第 ${idx + 1} 張：${slide.slideTitle}`, font: fontName, size: 28, bold: true, color: "333333" })],
            spacing: { before: 180, after: 120 }
          }));
          slide.bulletPoints.forEach(bp => {
             docChildren.push(new Paragraph({
                children: [new TextRun({ text: `• ${bp}`, font: fontName, size: 24, color: "333333" })],
                indent: { left: 480 },
                spacing: { after: 80 }
             }));
          });
        });
      }

      if (lessonData.worksheet && lessonData.worksheet.length > 0) {
        docChildren.push(new Paragraph({ text: "生活管理學習單", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));
        
        lessonData.worksheet.forEach((item, index) => {
          docChildren.push(new Paragraph({
              children: [new TextRun({ text: `${index + 1}. [${item.questionType}] ${item.question}`, font: fontName, size: 26, bold: true, color: "1E293B" })],
              spacing: { before: 240, after: 120 }
          }));
          
          if (item.questionType === "圈叉" || item.questionType === "情境圈叉題") {
              docChildren.push(new Paragraph({
                  children: [new TextRun({ text: "(   ) O      (   ) X", font: fontName, size: 28, color: "333333", bold: true })],
                  indent: { left: 480 },
                  spacing: { after: 240 }
              }));
          } else if (item.questionType === "問答" || item.questionType === "問答題") {
              docChildren.push(new Paragraph({
                  children: [new TextRun({ text: "答：______________________________________", font: fontName, size: 24, color: "333333" })],
                  indent: { left: 480 },
                  spacing: { after: 120 }
              }));
              docChildren.push(new Paragraph({
                  children: [new TextRun({ text: "    ______________________________________", font: fontName, size: 24, color: "333333" })],
                  indent: { left: 480 },
                  spacing: { after: 240 }
              }));
          } else if (item.options && item.options.length > 0) {
              if (item.questionType === "選擇" || item.questionType === "選擇題") {
                  const labels = ["(A)", "(B)", "(C)", "(D)", "(E)"];
                  item.options.forEach((opt, optIdx) => {
                      docChildren.push(new Paragraph({
                          children: [new TextRun({ text: `${labels[optIdx] || ''} ${opt}`, font: fontName, size: 24, color: "333333" })],
                          indent: { left: 480 },
                          spacing: { after: 100 }
                      }));
                  });
              } else if (item.questionType === "勾選" || item.questionType === "勾選題") {
                  item.options.forEach(opt => {
                      docChildren.push(new Paragraph({
                          children: [new TextRun({ text: `□ ${opt}`, font: fontName, size: 24, color: "333333" })],
                          indent: { left: 480 },
                          spacing: { after: 100 }
                      }));
                  });
              } else {
                  item.options.forEach(opt => {
                      docChildren.push(new Paragraph({
                          children: [new TextRun({ text: `• ${opt}`, font: fontName, size: 24, color: "333333" })],
                          indent: { left: 480 },
                          spacing: { after: 100 }
                      }));
                  });
              }
          } else {
              docChildren.push(new Paragraph({
                  children: [new TextRun({ text: "答：______________________________________", font: fontName, size: 24, color: "333333" })],
                  indent: { left: 480 },
                  spacing: { after: 240 }
              }));
          }
        });
      }

      let needsPageBreak = docChildren.length > 1;
      
      if (lessonData.roleplay && lessonData.roleplay.length > 0) {
        docChildren.push(new Paragraph({ text: "生活情境對話稿", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
        needsPageBreak = false;
        
        lessonData.roleplay.forEach(r => {
          docChildren.push(new Paragraph({
            children: [
              new TextRun({ text: `【${r.role}】 `, font: fontName, size: 24, bold: true, color: "10B981" }),
              new TextRun({ text: `「${r.line}」 `, font: fontName, size: 24, color: "333333" }),
              new TextRun({ text: `(*${r.action}*)`, font: fontName, size: 20, color: "64748B", italics: true })
            ],
            spacing: { after: 160 }
          }));
        });
      }

      if (lessonData.steps && lessonData.steps.length > 0) {
        docChildren.push(new Paragraph({ text: "生活步驟提示卡", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
        needsPageBreak = false;

        lessonData.steps.forEach((s, idx) => {
          docChildren.push(new Paragraph({
            children: [new TextRun({ text: `步驟 ${idx + 1}：${s}`, font: fontName, size: 28, bold: true, color: "333333" })],
            spacing: { before: 120, after: 120 },
            indent: { left: 360 }
          }));
        });
      }

      if (lessonData.checklist && lessonData.checklist.length > 0) {
        docChildren.push(new Paragraph({ text: "生活自我檢核表", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
        needsPageBreak = false;

        lessonData.checklist.forEach(c => {
          docChildren.push(new Paragraph({
            children: [new TextRun({ text: `□ ${c}`, font: fontName, size: 28, color: "333333" })],
            spacing: { before: 120, after: 120 },
            indent: { left: 360 }
          }));
        });
      }

      if (lessonData.socialStory && lessonData.socialStory.imagePrompt) {
        docChildren.push(new Paragraph({ text: "生活情境故事", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));

        if (lessonData.socialStory.base64) {
          docChildren.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: base64ToUint8Array(lessonData.socialStory.base64),
                transformation: { width: 500, height: 500 }
              })
            ],
            spacing: { after: 240 }
          }));
        }
      }

      const doc = new Document({
        styles: {
            default: {
                heading1: { 
                    run: { font: fontName, size: 36, bold: true, color: "047857" }, 
                    paragraph: { 
                        spacing: { before: 240, after: 180 }, 
                        border: { bottom: { color: "A7F3D0", space: 10, style: BorderStyle.SINGLE, size: 12 } } 
                    } 
                },
                heading2: { 
                    run: { font: fontName, size: 30, bold: true, color: "059669" }, 
                    paragraph: { spacing: { before: 240, after: 120 } } 
                }
            }
        },
        sections: [{
          properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
          children: docChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      window.saveAs(blob, '生活管理教案與學習單.docx');

    } catch (err) {
      console.error(err);
      alert("Word 下載發生錯誤。");
    } finally {
      setIsExporting(false);
    }
  };

  const regenerateSingleImage = async (imagePrompt) => {
    setLessonData(prev => ({
        ...prev,
        socialStory: { ...prev.socialStory, isRegenerating: true, error: false }
    }));

    try {
      const base64 = await fetchImage(imagePrompt);
      setLessonData(prev => ({
          ...prev,
          socialStory: { ...prev.socialStory, base64: base64, isRegenerating: false, error: false }
      }));
    } catch (error) {
      console.error("Single image generation error:", error);
      setLessonData(prev => ({
          ...prev,
          socialStory: { ...prev.socialStory, isRegenerating: false, error: true }
      }));
    }
  };

  const generateLessonPlan = async () => {
    if (selectedItems.performances.length === 0 && selectedItems.contents.length === 0 && !customTopic.trim()) {
      alert("請至少選擇一項學習表現/學習內容，或是輸入「自訂教學主題」！");
      return;
    }
    if (selectedOutputs.length === 0) {
      alert("請至少勾選一項要產出的內容！");
      return;
    }
    if (selectedOutputs.includes('worksheet') && selectedWorksheetTypes.length === 0) {
      alert("您勾選了結構化學習單，請至少在下方選擇一種題型喔！");
      return;
    }

    setLoading(true);
    setProgress(5);
    setProgressText("正在初始化設定與學生特質...");
    setLessonData(null);
    setCopied(false);
    setSectionPrompts({}); 
    
    setTimeout(() => {
      document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    let worksheetPrompt = "";
    const wTypes = [];
    if (selectedOutputs.includes('worksheet') && selectedWorksheetTypes.length > 0) {
      if (selectedWorksheetTypes.includes('tf')) wTypes.push("'圈叉'");
      if (selectedWorksheetTypes.includes('mc')) wTypes.push("'選擇'");
      if (selectedWorksheetTypes.includes('check')) wTypes.push("'勾選'");
      if (selectedWorksheetTypes.includes('shortAns')) wTypes.push("'問答'");
      if (selectedWorksheetTypes.includes('custom') && customWorksheetType.trim() !== '') wTypes.push(`'${customWorksheetType.trim()}'`);

      worksheetPrompt = `\n【學習單設計特別要求】\n學習單必須「高度結構化」，適合特教學生。請務必嚴格依照以下要求的題型與「指定的題數」進行設計，不可多也不可少：\n`;
      if (selectedWorksheetTypes.includes('tf')) worksheetPrompt += `1. 「情境圈叉題」(是非題)：描述一個具體情境，讓學生判斷行為是否適當。請出剛好 ${worksheetCounts.tf} 題。\n`;
      if (selectedWorksheetTypes.includes('mc')) worksheetPrompt += `2. 「選擇題」：提供具體的選項。請出剛好 ${worksheetCounts.mc} 題。\n`;
      if (selectedWorksheetTypes.includes('check')) worksheetPrompt += `3. 「勾選題(圈選題)」：可複選的具體選項。請出剛好 ${worksheetCounts.check} 題。\n`;
      if (selectedWorksheetTypes.includes('shortAns')) worksheetPrompt += `4. 「問答題」：提供一個與學習目標相關的具體情境，讓學生簡答其想法或做法。請出剛好 ${worksheetCounts.shortAns} 題。\n`;
      if (selectedWorksheetTypes.includes('custom') && customWorksheetType.trim() !== '') worksheetPrompt += `5. 「${customWorksheetType.trim()}」：這是使用者自訂的題型，請出剛好 ${worksheetCounts.custom} 題，並依據題型名稱提供適合特教生的作答方式。\n`;
      worksheetPrompt += `絕對不要設計需要大量書寫的開放式問答。選擇或勾選題務必在 options 中提供具體的選項。`;
    }

    const systemPrompt = `你是一位資深的特教老師，專精於生活管理。請根據使用者選擇的學習重點與學生現況，設計實用的生活管理教材。
必須嚴格依照要求的 JSON 格式輸出。${selectedOutputs.includes('story') ? '生活情境故事只需生成 1 個 imagePrompt (要求繪製 4-panel comic strip)，不需文字內文。' : ''}

【重要設計指引】
1. 核心目標優先：教學內容必須「絕對緊扣」所選的「學習表現」或「學習內容」。若使用者僅提供其中一項，請以此為核心，自行推導合適的教學脈絡。
2. 生活管理特色：內容應著重於自我照顧、家庭生活、社區參與或自我決策等生活技能。
3. 學生現況為輔（適性調整）：學生特質與現況是用來設定「教學策略、情境故事背景、難易度」（例如：若識字弱，句型應簡短；若精細動作弱，應提供替代方案）。
4. 易讀性原則：請盡量使用簡短、具體的語句，避免冗長抽象的說明，確保低識字學生能理解。
5. 實用性原則：提供的策略和步驟必須是在日常生活中可以實際操作的。
${worksheetPrompt}`;

    let studentProfile = "";
    if (grade || selectedTraits.length > 0 || studentStatus.trim()) {
      if (grade) studentProfile += `年級/階段：${grade}\n`;
      if (selectedTraits.length > 0) studentProfile += `特質：${selectedTraits.join("、")}\n`;
      if (studentStatus.trim()) studentProfile += `補充說明：${studentStatus.trim()}\n`;
    } else {
      studentProfile = "無提供特定現況，請依一般特教生(生活管理)程度設計。";
    }

    const promptText = `
【選擇的學習重點】
學習表現：
${selectedItems.performances.length > 0 ? selectedItems.performances.map(i => "- " + i).join("\n") : "無"}
學習內容：
${selectedItems.contents.length > 0 ? selectedItems.contents.map(i => "- " + i).join("\n") : "無"}
自訂教學主題：
${customTopic.trim() ? customTopic.trim() : "無"}

【學生現況描述】
${studentProfile}
`;

    const schemaProperties = {};
    const requiredFields = [];

    if (selectedOutputs.includes('lessonPlan')) {
      schemaProperties.objectives = { type: "ARRAY", items: { type: "STRING" }, description: "教學目標" };
      schemaProperties.materials = { type: "ARRAY", items: { type: "STRING" }, description: "教學準備" };
      schemaProperties.process = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            phase: { type: "STRING", description: "例如：引起動機、發展活動、綜合活動" },
            time: { type: "STRING" },
            activity: { type: "STRING", description: "活動內容與步驟" },
            guidance: { type: "STRING", description: "教師指導語" }
          },
          required: ["phase", "time", "activity", "guidance"]
        }
      };
      requiredFields.push("objectives", "materials", "process");
    }

    if (selectedOutputs.includes('outline')) {
      schemaProperties.outline = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            slideTitle: { type: "STRING", description: "投影片標題" },
            bulletPoints: { type: "ARRAY", items: { type: "STRING" }, description: "投影片內容重點" }
          },
          required: ["slideTitle", "bulletPoints"]
        },
        description: "課程簡報大綱，約 5-8 張投影片"
      };
      requiredFields.push("outline");
    }

    if (selectedOutputs.includes('worksheet') && wTypes.length > 0) {
      schemaProperties.worksheet = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            questionType: { type: "STRING", description: `題型，只能填入：${wTypes.join(', ')}` },
            question: { type: "STRING", description: "題目內容或情境描述" },
            options: { type: "ARRAY", items: { type: "STRING" }, description: "選項或句型提示" }
          },
          required: ["questionType", "question"]
        },
        description: "結構化的學習單題目陣列。"
      };
      requiredFields.push("worksheet");
    }

    if (selectedOutputs.includes('roleplay')) {
      schemaProperties.roleplay = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            role: { type: "STRING", description: "角色名稱，例如：學生、家長、店員" },
            line: { type: "STRING", description: "簡短具體的台詞內容" },
            action: { type: "STRING", description: "動作提示，例如：點頭、面帶微笑、操作器具" }
          },
          required: ["role", "line", "action"]
        },
        description: "生活情境對話稿，設計約 4-6 句來回的短對話供師生或同儕演練"
      };
      requiredFields.push("roleplay");
    }

    if (selectedOutputs.includes('steps')) {
      schemaProperties.steps = {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "將核心生活技能或流程拆解成 3~4 個具體、簡短的執行步驟 (SOP)"
      };
      requiredFields.push("steps");
    }

    if (selectedOutputs.includes('checklist')) {
      schemaProperties.checklist = {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "設計 2~3 個具體的生活行為自我檢核項目，讓學生在日常中打勾紀錄"
      };
      requiredFields.push("checklist");
    }

    if (selectedOutputs.includes('story')) {
      schemaProperties.socialStory = {
        type: "OBJECT",
        properties: {
          imagePrompt: { type: "STRING", description: "生成四格漫畫的英文提示詞，必須包含主角特徵及四個畫面的動作描述，例如：A 4-panel comic strip. Panel 1: ... Panel 2: ... Panel 3: ... Panel 4: ..." }
        },
        required: ["imagePrompt"]
      };
      requiredFields.push("socialStory");
    }

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: schemaProperties,
          required: requiredFields.length > 0 ? requiredFields : undefined
        }
      }
    };

    try {
      setProgress(15);
      setProgressText("正在根據特教課綱生成結構化教材...");
      
      const response = await fetchWithBackoff(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text generated");

      const parsedData = JSON.parse(text);
      
      setProgress(40);
      setProgressText("文字內容生成完畢！");

      setLessonData(parsedData);

      if (parsedData.socialStory) {
        setProgressText(`正在為生活情境故事繪製四格漫畫...`);
        try {
            const base64 = await fetchImage(parsedData.socialStory.imagePrompt);
            setLessonData(prev => ({
                ...prev,
                socialStory: { ...prev.socialStory, base64: base64, error: false }
            }));
        } catch (e) {
            console.error("Image generation error:", e);
            setLessonData(prev => ({
                ...prev,
                socialStory: { ...prev.socialStory, error: true }
            }));
        }
        setProgress(100);
      } else {
        setProgress(100);
      }
      
      setProgressText("所有教材生成完成！");
      setTimeout(() => setLoading(false), 600); 
      
    } catch (error) {
      console.error(error);
      alert("生成失敗，請稍後再試或檢查網路連線。");
      setLoading(false);
    }
  };

  const renderRegenerateBlock = (sectionId, label) => (
    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-center gap-3 print:hidden">
      <input
        type="text"
        placeholder={`想微調${label}嗎？請輸入指令 (例如：更簡單一點、加入超商情境...)`}
        value={sectionPrompts[sectionId] || ''}
        onChange={(e) => setSectionPrompts(prev => ({ ...prev, [sectionId]: e.target.value }))}
        className="flex-1 w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-700 bg-white"
        onKeyDown={(e) => {
          if (e.key === 'Enter') regenerateSpecificContent(sectionId);
        }}
      />
      <button
        onClick={() => regenerateSpecificContent(sectionId)}
        disabled={regeneratingId === sectionId}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
      >
        {regeneratingId === sectionId ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        重新生成此區塊
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800 print:bg-white print:p-0" style={{ fontFamily: "'Chiron GoRound TC', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:space-y-0">
        
        <header className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-emerald-600 print:hidden">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 flex-shrink-0">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">生活管理備課大師</h1>
            <p className="text-slate-500 text-sm mt-1">依據特教生活管理領綱設計，自動生成教案、結構化學習單與生活情境四格漫畫。</p>
          </div>
        </header>

        <div className="flex flex-col gap-8 print:gap-0">
          
          <div className="space-y-6 print:hidden">
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                步驟一：選擇學習重點
              </h2>
              <p className="text-sm text-slate-500 mb-4">請選擇本節課的核心目標（每種最多 3 項），或直接輸入您想教的自訂主題。</p>
              
              <ExpandableSection title={`1. 學習表現 - 已選 ${selectedItems.performances.length}/3`} defaultOpen={true}>
                {renderCascadingSelection(curriculumData.performances, 'performances', perfTab, setPerfTab)}
              </ExpandableSection>

              <ExpandableSection title={`2. 學習內容 - 已選 ${selectedItems.contents.length}/3`} defaultOpen={true}>
                {renderCascadingSelection(curriculumData.contents, 'contents', contTab, setContTab)}
              </ExpandableSection>
              
              <div className="mt-4 border-t border-slate-200 pt-5">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  3. 或輸入自訂教學主題 (若課綱未涵蓋)
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-700 bg-white"
                  placeholder="例如：認識洗衣機操作、如何去便利商店買東西、整理書包的步驟..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>

              <div className="mt-5 bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-xs text-emerald-500 font-bold mb-1">學習表現</div>
                  <div className="text-lg font-bold text-emerald-700">
                    {selectedItems.performances.length} <span className="text-sm text-emerald-400">/ 3</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-emerald-200"></div>
                <div className="text-center">
                  <div className="text-xs text-emerald-500 font-bold mb-1">學習內容</div>
                  <div className="text-lg font-bold text-emerald-700">
                    {selectedItems.contents.length} <span className="text-sm text-emerald-400">/ 3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  步驟二：填寫學生現況 (選填)
                </h2>
                <button
                  onClick={() => {
                      setGrade("國小高年級");
                      setSelectedTraits(["生活自理弱", "容易分心", "需要視覺提示"]);
                      setStudentStatus("學生在家很少自己動手做家事，對於日常清潔的步驟不熟悉。希望透過課程讓他學習簡單的桌面清潔，並建立自我檢核的習慣。");
                  }}
                  className="text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  匯入範例
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">年級/階段</label>
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 bg-white"
                  >
                    <option value="">請選擇年級...</option>
                    {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">學生特質 (可複選)</label>
                  <div className="flex flex-wrap gap-2">
                    {traitOptionsList.map(trait => (
                      <button
                        key={trait}
                        onClick={() => handleToggleTrait(trait)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          selectedTraits.includes(trait) 
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">其他補充說明</label>
                  <textarea
                    className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm text-slate-700"
                    placeholder="例如：特定的生活自理困難點、感興趣的日常活動、操作工具時的注意事項..."
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-teal-500" />
                步驟三：選擇產出內容
              </h2>
              <div className="columns-1 md:columns-2 gap-4">
                {outputOptionsList.map(opt => (
                  <div key={opt.id} className="flex flex-col gap-2 break-inside-avoid mb-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${selectedOutputs.includes(opt.id) ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="mt-0.5 text-emerald-600 flex-shrink-0">
                          {selectedOutputs.includes(opt.id) ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 group-hover:text-emerald-400" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${selectedOutputs.includes(opt.id) ? 'text-emerald-800' : 'text-slate-700'}`}>
                          {opt.label}
                        </span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedOutputs.includes(opt.id)}
                          onChange={() => handleToggleOutput(opt.id)}
                        />
                      </label>
                    </div>

                    {opt.isWorksheetParent && selectedOutputs.includes(opt.id) && (
                      <div className="ml-8 mr-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                        <p className="text-xs font-bold text-slate-500 border-b border-slate-200 pb-1 mb-2">設定需要的題型與題數</p>
                        {worksheetSubOptions.map(subOpt => (
                          <div key={subOpt.id} className="flex flex-col gap-2">
                            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
                              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                                  checked={selectedWorksheetTypes.includes(subOpt.id)}
                                  onChange={() => handleToggleWorksheetType(subOpt.id)}
                                />
                                <span className="text-sm text-slate-700">{subOpt.label}</span>
                              </label>
                              
                              {selectedWorksheetTypes.includes(subOpt.id) && (
                                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded shadow-sm border border-slate-200 flex-shrink-0">
                                  <button 
                                    onClick={() => handleCountChange(subOpt.id, -1)} 
                                    className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                    disabled={worksheetCounts[subOpt.id] <= 1}
                                  >
                                    <Minus className="w-4 h-4"/>
                                  </button>
                                  <span className="text-sm font-bold w-4 text-center text-emerald-600">{worksheetCounts[subOpt.id]}</span>
                                  <button 
                                    onClick={() => handleCountChange(subOpt.id, 1)} 
                                    className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                    disabled={worksheetCounts[subOpt.id] >= 10}
                                  >
                                    <Plus className="w-4 h-4"/>
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {/* 自訂題型的輸入框 */}
                            {selectedWorksheetTypes.includes('custom') && subOpt.id === 'custom' && (
                              <div className="pl-6 pb-2">
                                <input
                                  type="text"
                                  placeholder="請輸入自訂題型名稱 (例如：連連看、造句)"
                                  value={customWorksheetType}
                                  onChange={(e) => setCustomWorksheetType(e.target.value)}
                                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-700 bg-white"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generateLessonPlan}
              disabled={loading || (selectedItems.performances.length === 0 && selectedItems.contents.length === 0 && !customTopic.trim()) || selectedOutputs.length === 0}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI 正在努力生成中...
                </>
              ) : (
                '開始生成選定內容'
              )}
            </button>

          </div>

          <div id="preview-section" className="w-full">
            <div className="bg-white rounded-xl shadow-sm min-h-[500px] flex flex-col overflow-hidden print:shadow-none print:min-h-0 print:block">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center print:hidden">
                <h2 className="font-bold text-slate-700">預覽與匯出</h2>
                {lessonData && !loading && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已複製' : '複製文字'}
                    </button>
                    <button 
                      onClick={exportToWord}
                      disabled={isExporting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-700 text-white transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {isExporting ? '匯出中...' : '匯出完美 Word'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto bg-white print:p-0 print:overflow-visible">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-6" />
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-3 border border-slate-200 overflow-hidden shadow-inner">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute top-0 left-0 bottom-0 w-full bg-white/20 animate-[translate_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <span className="font-medium text-slate-600">{progressText}</span>
                      <span className="font-bold text-emerald-600">{progress}%</span>
                    </div>
                  </div>
                ) : lessonData ? (
                  <div className="flex flex-col gap-12 print:gap-0">
                    
                    {lessonData.objectives && lessonData.materials && lessonData.process && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-emerald-800 mb-4 border-b-2 border-emerald-200 pb-2">生活管理教案</h1>
                        
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-emerald-600 mb-2">教學目標</h2>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                            {lessonData.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                          </ul>
                        </div>

                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-emerald-600 mb-2">教學準備</h2>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                            {lessonData.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-emerald-600 mb-2">教學流程</h2>
                          <div className="overflow-x-auto border border-slate-200 rounded-lg">
                            <table className="min-w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-100 border-b border-slate-200">
                                  <th className="p-3 font-bold text-slate-700 border-r w-1/5">階段</th>
                                  <th className="p-3 font-bold text-slate-700 border-r w-1/6">時間</th>
                                  <th className="p-3 font-bold text-slate-700 border-r w-1/3">活動內容</th>
                                  <th className="p-3 font-bold text-slate-700">教師指導語</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lessonData.process.map((p, i) => (
                                  <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50 print-avoid-break">
                                    <td className="p-3 border-r font-medium text-slate-800 align-top">{p.phase}</td>
                                    <td className="p-3 border-r text-slate-600 align-top">{p.time}</td>
                                    <td className="p-3 border-r text-slate-600 align-top">{p.activity}</td>
                                    <td className="p-3 text-slate-600 align-top">{p.guidance}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {renderRegenerateBlock("lessonPlan", "教案內容")}
                      </section>
                    )}

                    {lessonData.outline && lessonData.outline.length > 0 && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-teal-200 pb-4 gap-4">
                          <h1 className="text-2xl font-bold text-teal-800">課程簡報大綱</h1>
                          <div className="flex gap-2 print:hidden w-full md:w-auto">
                            <button
                              onClick={() => {
                                const outlineText = lessonData.outline.map((slide, i) => `【第 ${i + 1} 張】${slide.slideTitle}\n${slide.bulletPoints.map(bp => `  - ${bp}`).join('\n')}`).join('\n\n');
                                fallbackCopyTextToClipboard(outlineText);
                                window.open("https://notebooklm.google.com/?utm_source=app_launcher&utm_medium=referral&authuser=0&pli=1", "_blank");
                              }}
                              className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                            >
                              <Copy className="w-4 h-4" /> 
                              複製並前往 NotebookLM
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {lessonData.outline.map((slide, i) => (
                            <div key={i} className="bg-white border border-teal-100 rounded-xl p-5 shadow-sm print-avoid-break">
                              <div className="flex items-center gap-3 mb-3 border-b border-teal-50 pb-3">
                                <span className="bg-teal-100 text-teal-700 text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-teal-200">
                                  {i + 1}
                                </span>
                                <h3 className="font-bold text-lg text-slate-800 leading-tight">{slide.slideTitle}</h3>
                              </div>
                              <ul className="list-disc list-outside space-y-1.5 text-slate-600 ml-4">
                                {slide.bulletPoints.map((bp, idx) => (
                                  <li key={idx} className="pl-1">{bp}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {renderRegenerateBlock("outline", "簡報大綱")}
                      </section>
                    )}

                    {lessonData.worksheet && lessonData.worksheet.length > 0 && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-emerald-200 pb-4 gap-4">
                            <h1 className="text-2xl font-bold text-emerald-800 text-center flex-1">生活管理學習單</h1>
                            <div className="flex gap-2 print:hidden w-full md:w-auto">
                              <button
                                onClick={() => {
                                  let worksheetText = "";
                                  worksheetText += `請幫我美化並排版以下這份特教生「生活管理」學習單，給我圖片。請注意以下需求：\n\n`;
                                  worksheetText += `【目標學生背景】\n`;
                                  if (grade) {
                                      worksheetText += `- 年級/階段：${grade}\n`;
                                      worksheetText += `  *(請確保排版、用語難度、插圖風格或情境描述，要符合「${grade}」學生的年齡心智發展。)*\n`;
                                  } else {
                                      worksheetText += `- 年級/階段：未指定 (請依一般特教生程度，使用清晰、具體的用語。)\n`;
                                  }
                                  
                                  if (selectedTraits.length > 0) {
                                      worksheetText += `- 學生特質：${selectedTraits.join("、")}\n`;
                                  }
                                  
                                  worksheetText += `\n【排版與設計要求】\n`;
                                  worksheetText += `1. 請維持原有的題型與題數不變。\n`;
                                  worksheetText += `2. 版面必須「高度結構化」，留白要夠，字體大小適中，減輕特教生視覺負擔。\n`;
                                  worksheetText += `3. **請為每個題目或情境提供合適的圖片**\n`;
                                  worksheetText += `4. 可適度加入符合上述學生背景的簡單符號作為視覺提示。\n`;
                                  worksheetText += `5. 請直接輸出圖片。\n\n`;
                                  worksheetText += `-------------------\n\n`;
                                  worksheetText += `【原始學習單內容】\n\n`;

                                  worksheetText += lessonData.worksheet.map((w, i) => {
                                      let text = `${i + 1}. [${w.questionType}] ${w.question}\n`;
                                      
                                      if (w.questionType === '圈叉' || w.questionType === '情境圈叉題') {
                                          text += `   (   ) O   (   ) X\n`;
                                      } else if (w.questionType === '問答題' || w.questionType === '問答') {
                                          text += `   答：______________________________________\n       ______________________________________\n`;
                                      } else if (w.options && w.options.length > 0) {
                                          if (w.questionType === '選擇' || w.questionType === '選擇題') {
                                              const labels = ["(A)", "(B)", "(C)", "(D)"];
                                              text += w.options.map((opt, idx) => `   ${labels[idx] || ''} ${opt}`).join('\n');
                                          } else if (w.questionType === '勾選' || w.questionType === '勾選題') {
                                              text += w.options.map(opt => `   □ ${opt}`).join('\n');
                                          } else {
                                              text += w.options.map(opt => `   • ${opt}`).join('\n');
                                          }
                                      } else {
                                          text += `   答：_____________________`;
                                      }
                                      return text;
                                  }).join('\n\n');
                                  
                                  fallbackCopyTextToClipboard(worksheetText);
                                  alert("已將包含背景設定的學習單內容與 Prompt 複製到剪貼簿！即將為您開啟 ChatGPT...");
                                  window.open("https://chatgpt.com/g/g-6a1a588150d881918a2a7dc8f67ae06b-xue-xi-dan-mei-hua-da-shi", "_blank");
                                }}
                                className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-pink-600 text-white hover:bg-pink-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                              >
                                <Copy className="w-4 h-4" />
                                複製內容並至 ChatGPT 美化
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                        </div>
                        <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                          {lessonData.worksheet.map((item, i) => (
                            <div key={i} className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm print-avoid-break">
                              <div className="flex items-start gap-2 mb-4">
                                <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2 py-1 rounded whitespace-nowrap">
                                  {item.questionType}
                                </span>
                                <p className="font-bold text-slate-800 mt-0.5">{i + 1}. {item.question}</p>
                              </div>
                              
                              {item.questionType === '圈叉' || item.questionType === '情境圈叉題' ? (
                                  <div className="ml-12 flex gap-8 mt-2">
                                      <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-slate-300 transition-all">
                                          <Circle className="w-8 h-8 text-green-500" />
                                          <span className="font-bold text-xl text-slate-600">適當 (O)</span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-slate-300 transition-all">
                                          <X className="w-8 h-8 text-red-500" />
                                          <span className="font-bold text-xl text-slate-600">不適當 (X)</span>
                                      </label>
                                  </div>
                              ) : item.questionType === '問答題' || item.questionType === '問答' ? (
                                  <div className="ml-12 mt-4 space-y-4">
                                      <div className="border-b-2 border-slate-400 w-full h-8 bg-white rounded-t bg-opacity-50"></div>
                                      <div className="border-b-2 border-slate-400 w-full h-8 bg-white rounded-t bg-opacity-50"></div>
                                  </div>
                              ) : item.options && item.options.length > 0 ? (
                                  <div className="ml-12 space-y-2">
                                      {item.questionType === '選擇' || item.questionType === '選擇題' ? (
                                          item.options.map((opt, idx) => (
                                              <label key={idx} className="flex items-start gap-3 p-2 hover:bg-white rounded cursor-pointer border border-transparent hover:border-slate-200">
                                                  <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                      <span className="text-xs font-bold text-slate-500">{['A','B','C','D','E'][idx]}</span>
                                                  </div>
                                                  <span>{opt}</span>
                                              </label>
                                          ))
                                      ) : item.questionType === '勾選' || item.questionType === '勾選題' ? (
                                          item.options.map((opt, idx) => (
                                              <label key={idx} className="flex items-start gap-3 p-2 hover:bg-white rounded cursor-pointer border border-transparent hover:border-slate-200">
                                                  <Square className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" /> 
                                                  <span>{opt}</span>
                                              </label>
                                          ))
                                      ) : (
                                          item.options.map((opt, idx) => (
                                              <div key={idx} className="flex items-start gap-3 p-2">
                                                  <span className="text-emerald-500 mt-0.5">•</span> 
                                                  <span>{opt}</span>
                                              </div>
                                          ))
                                      )}
                                  </div>
                              ) : (
                                  <div className="ml-12 mt-4 space-y-4">
                                      <div className="border-b-2 border-slate-400 w-full h-8 bg-white rounded-t bg-opacity-50"></div>
                                      <div className="border-b-2 border-slate-400 w-full h-8 bg-white rounded-t bg-opacity-50"></div>
                                  </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {renderRegenerateBlock("worksheet", "學習單題目")}
                      </section>
                    )}

                    {lessonData.roleplay && lessonData.roleplay.length > 0 && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-sky-800 mb-6 border-b-2 border-sky-200 pb-2 text-center">實作：生活情境對話稿</h1>
                        <div className="bg-white border-2 border-sky-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
                          <div className="space-y-4">
                            {lessonData.roleplay.map((r, i) => (
                              <div key={i} className="flex flex-col print-avoid-break">
                                <span className="text-sky-800 font-bold text-base bg-sky-50 self-start px-3 py-1 rounded mb-1">{r.role}</span>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg rounded-tl-none p-4 relative">
                                  <p className="text-slate-800 font-medium text-lg">{r.line}</p>
                                  {r.action && <p className="text-base text-slate-500 mt-2 italic">(* {r.action} *)</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                          {renderRegenerateBlock("roleplay", "對話內容")}
                        </div>
                      </section>
                    )}

                    {lessonData.steps && lessonData.steps.length > 0 && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-emerald-800 mb-6 border-b-2 border-emerald-200 pb-2 text-center">類化：生活步驟提示卡</h1>
                        <div className="bg-white border-2 border-emerald-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
                          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-emerald-200 before:to-transparent">
                            {lessonData.steps.map((step, i) => (
                              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active print-avoid-break">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xl">
                                  {i + 1}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-emerald-50 p-4 rounded-lg border border-emerald-200 shadow-sm text-slate-800 font-bold text-xl">
                                  {step}
                                </div>
                              </div>
                            ))}
                          </div>
                          {renderRegenerateBlock("steps", "步驟卡")}
                        </div>
                      </section>
                    )}
                          
                    {lessonData.checklist && lessonData.checklist.length > 0 && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-amber-800 mb-6 border-b-2 border-amber-200 pb-2 text-center">追蹤：生活自我檢核表</h1>
                        <div className="bg-white border-2 border-amber-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
                          <div className="flex flex-col gap-4">
                            {lessonData.checklist.map((item, i) => (
                              <label key={i} className="flex items-center gap-5 bg-amber-50 p-5 rounded-xl border border-amber-200 cursor-pointer print-avoid-break hover:bg-amber-100 transition-colors">
                                <div className="w-10 h-10 rounded border-2 border-amber-400 bg-white flex-shrink-0"></div>
                                <span className="text-2xl font-bold text-slate-800">{item}</span>
                              </label>
                            ))}
                          </div>
                          {renderRegenerateBlock("checklist", "檢核項目")}
                        </div>
                      </section>
                    )}

                    {lessonData.socialStory && lessonData.socialStory.imagePrompt && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-emerald-800 mb-6 border-b-2 border-emerald-200 pb-2 text-center">生活情境故事</h1>
                        <div className="bg-white border-2 border-emerald-100 p-6 rounded-xl shadow-sm print:border-0 print:shadow-none print:p-0 print-avoid-break">
                          
                          <div className="w-full flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative group min-h-[400px]">
                              {lessonData.socialStory.isRegenerating && (
                                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center text-emerald-500 backdrop-blur-sm">
                                      <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                                      <span className="text-sm font-bold">重新繪製四格漫畫中...</span>
                                  </div>
                              )}

                              {lessonData.socialStory.imagePrompt && !lessonData.socialStory.isRegenerating && (
                                  <button
                                      onClick={() => regenerateSingleImage(lessonData.socialStory.imagePrompt)}
                                      className={`absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-600 hover:text-emerald-600 rounded-lg shadow-md border border-slate-200 transition-opacity z-10 print:hidden ${
                                          lessonData.socialStory.error ? 'opacity-100 ring-2 ring-red-400' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                                      }`}
                                      title="重新生成這張圖片"
                                  >
                                      <RefreshCw className="w-5 h-5" />
                                  </button>
                              )}

                              {lessonData.socialStory.base64 && !lessonData.socialStory.isRegenerating ? (
                                  <img src={`data:image/png;base64,${lessonData.socialStory.base64}`} alt="故事畫面" className="w-full h-auto max-h-[800px] object-contain" />
                              ) : lessonData.socialStory.error && !lessonData.socialStory.isRegenerating ? (
                                  <div className="flex flex-col items-center text-slate-400">
                                      <ImageIcon className="w-10 h-10 mb-2 text-red-400" />
                                      <span className="text-sm font-medium text-red-500">圖片生成失敗</span>
                                      <span className="text-xs mt-1 text-slate-400 text-center px-2">可點擊右上角重試</span>
                                  </div>
                              ) : !lessonData.socialStory.isRegenerating ? (
                                  <div className="flex flex-col items-center text-slate-400">
                                      <ImageIcon className="w-10 h-10 mb-2 animate-pulse" />
                                      <span className="text-sm">繪製圖片中...</span>
                                  </div>
                              ) : null}
                          </div>

                        </div>

                        {renderRegenerateBlock("story", "社會故事")}
                      </section>
                    )}

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText className="w-16 h-16 mb-4 text-slate-200" />
                    <p>選擇左側指標並填寫現況後，點擊生成即可在此預覽。</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <footer className="mt-16 pt-8 border-t border-slate-300 text-center text-sm text-slate-500 space-y-2 pb-8 print:hidden">
          <p className="font-bold text-slate-600 text-base">© 2026 SPEDMIX 米克師</p>
          <p>
            本作品採用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh_TW" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">CC BY-NC-SA 4.0 創用CC授權</a>。
          </p>
          <p>歡迎非商業用途轉載、引用或改編，請保留「米克師」署名並附上原始連結。</p>
          <p>
            研習合作邀約：<a href="mailto:rouwanyellow@gmail.com" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">rouwanyellow@gmail.com</a>
          </p>
        </footer>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@200..900&display=swap');

        .result-section:first-child .page-divider {
          display: none;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          
          .result-section ~ .result-section {
            page-break-before: always !important;
            break-before: page !important;
          }
          
          .print-avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}