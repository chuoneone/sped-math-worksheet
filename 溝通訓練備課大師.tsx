import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Loader2, BookOpen, User, FileText, Copy, Check, Download, Image as ImageIcon, Circle, X, ListChecks, Plus, Minus, MessageSquare, ListOrdered, ClipboardCheck, RefreshCw, ExternalLink, Ear, Volume2 } from 'lucide-react';

// --- 選項資料 ---
const gradeOptions = ["國小低年級", "國小中年級", "國小高年級", "國中七年級", "國中八年級", "國中九年級", "高中職", "特教學校(高中部)"];
const traitOptionsList = [
  "聽損/配戴助聽輔具", "無口語/低口語", "口齒不清/構音障礙", "自閉症/固執性溝通", 
  "注意力分散", "需要溝通板/AAC輔具", "識字能力偏弱", "人際互動被動", "情緒表達困難"
];

const outputOptionsList = [
  { id: 'lessonPlan', label: '教案 (含目標、準備、流程)' },
  { id: 'outline', label: '簡報大綱 (可作為 NotebookLM 來源)' },
  { id: 'worksheet', label: '結構化學習單 (展開設定題型)', isWorksheetParent: true },
  { id: 'roleplay', label: '互動對話稿 (實作演練)' },
  { id: 'steps', label: '溝通步驟提示卡 (行為SOP)' },
  { id: 'checklist', label: '溝通自我檢核表 (生活類化追蹤)' },
  { id: 'story', label: '溝通情境故事 (含單張四格漫畫)' }
];

const worksheetSubOptions = [
  { id: 'tf', label: '情境圈叉題 (O/X)' },
  { id: 'mc', label: '選擇題 (單選)' },
  { id: 'check', label: '勾選題 (複選)' },
  { id: 'shortAns', label: '問答題' },
  { id: 'custom', label: '自訂題型' }
];

// --- 資料整理：溝通訓練學習重點 (特溝) ---
const curriculumData = {
  performances: {
    title: "學習表現",
    categories: [
      {
        name: "訊息理解 (特溝1)",
        stages: {
          "初階 (sP)": [
            "特溝1-sP-1 覺察、分辨與理解聲音。",
            "特溝1-sP-2 覺察、分辨各種溝通訊息。",
            "特溝1-sP-3 專注於溝通者的聲音、唇型、動作手勢與表情。",
            "特溝1-sP-4 了解日常的溝通訊息。",
            "特溝1-sP-5 理解常用指令與基本句型。",
            "特溝1-sP-6 理解與他人對話的主題內容。"
          ],
          "進階 (sA)": [
            "特溝1-sA-1 注意及分辨溝通情境中的多重訊息。",
            "特溝1-sA-2 解讀較長或複雜的訊息內容。",
            "特溝1-sA-3 理解複雜的指令與句型。",
            "特溝1-sA-4 解讀他人表達訊息時的意圖、情緒或感受。",
            "特溝1-sA-5 理解與他人對話的內容。"
          ]
        }
      },
      {
        name: "訊息表達 (特溝2)",
        stages: {
          "初階 (sP)": [
            "特溝2-sP-1 發展出個人適切的溝通形式。",
            "特溝2-sP-2 發出清楚明確的訊息。",
            "特溝2-sP-3 表現出與人溝通的意圖。",
            "特溝2-sP-4 表達正確且符合情境的訊息。",
            "特溝2-sP-5 表達日常的基本溝通訊息。",
            "特溝2-sP-6 以基本句型進行對話。"
          ],
          "進階 (sA)": [
            "特溝2-sA-1 結合不同的溝通形式進行表達。",
            "特溝2-sA-2 依情境需求調整適切的溝通形式。",
            "特溝2-sA-3 表達複雜的溝通訊息。",
            "特溝2-sA-4 以複雜句型進行對話。"
          ]
        }
      },
      {
        name: "互動交流 (特溝3)",
        stages: {
          "初階 (sP)": [
            "特溝3-sP-1 表達參與活動的意圖。",
            "特溝3-sP-2 視情境主動回應他人。",
            "特溝3-sP-3 確認對方注意後再表達訊息。",
            "特溝3-sP-4 根據主題起始對話、加入對話或終止對話。"
          ],
          "進階 (sA)": [
            "特溝3-sA-1 依情境進行持續的對話輪替。",
            "特溝3-sA-2 對不明明確的訊息請求澄清。",
            "特溝3-sA-3 適切轉換對話焦點。",
            "特溝3-sA-4 溝通中斷時能進行修補。"
          ]
        }
      },
      {
        name: "合作參與 (特溝4)",
        stages: {
          "初階 (sP)": [
            "特溝4-sP-1 運用溝通技巧參與日常活動。",
            "特溝4-sP-2 運用溝通技巧參與遊戲或團體活動。",
            "特溝4-sP-3 接納他人的溝通形式。"
          ],
          "進階 (sA)": [
            "特溝4-sA-1 就與人合作的內容進行溝通協調。",
            "特溝4-sA-2 對他人提供指導與建議。",
            "特溝4-sA-3 回應他人的指導與建議。",
            "特溝4-sA-4 進行主題式的討論、發表與分享。",
            "特溝4-sA-5 依據他人的理解狀況調整自己的溝通方式與策略。"
          ]
        }
      }
    ]
  },
  contents: {
    title: "學習內容",
    categories: [
      {
        name: "非口語訊息 (特溝A)",
        stages: {
          "初階 (sP)": [
            "特溝A-sP-1 眼神注視。",
            "特溝A-sP-2 動作、手勢與表情的模仿。",
            "特溝A-sP-3 有溝通意義的身體姿勢與動作。",
            "特溝A-sP-4 有溝通意義的手勢。",
            "特溝A-sP-5 基本情緒的表情。"
          ],
          "進階 (sA)": [
            "特溝A-sA-1 傳達情緒感受的手勢及肢體動作。",
            "特溝A-sA-2 符合不同文化的手勢及肢體動作。"
          ]
        }
      },
      {
        name: "口語 (特溝B)",
        stages: {
          "初階 (sP)": [
            "特溝B-sP-1 符合個人口語需求之輔具選用。",
            "特溝B-sP-2 構音、音量及說話節奏。",
            "特溝B-sP-3 常用詞彙。",
            "特溝B-sP-4 符合口語語法的基本句型。",
            "特溝B-sP-5 日常生活用語。",
            "特溝B-sP-6 語意明確的說話內容。"
          ],
          "進階 (sA)": [
            "特溝B-sA-1 符合語法的複雜句型。",
            "特溝B-sA-2 敘事的技巧。",
            "特溝B-sA-3 聊天或討論的技巧。",
            "特溝B-sA-4 摘要他人說話內容的技巧。",
            "特溝B-sA-5 評論事物或分享想法的技巧。",
            "特溝B-sA-6 參與活動時的應對技巧。"
          ]
        }
      },
      {
        name: "手語 (特溝C)",
        stages: {
          "初階 (sP)": [
            "特溝C-sP-1 手語的空間位置、手形、方向、動作及表情。",
            "特溝C-sP-2 手語詞彙。",
            "特溝C-sP-3 符合手語語法的基本句型。",
            "特溝C-sP-4 語意明確的手語內容。",
            "特溝C-sP-5 聾文化的認識。"
          ],
          "進階 (sA)": [
            "特溝C-sA-1 符合手語語法的複雜句型。",
            "特溝C-sA-2 手語敘事的技巧。",
            "特溝C-sA-3 手語聊天或討論的技巧。",
            "特溝C-sA-4 摘要他人手語內容的技巧。",
            "特溝C-sA-5 以手語評論事物或分享想法的技巧。",
            "特溝C-sA-6 參與活動時的手語應對技巧。",
            "特溝C-sA-7 手語翻譯服務的認識與應用。",
            "特溝C-sA-8 聾文化的倡議。"
          ]
        }
      },
      {
        name: "輔助性溝通符號 (特溝D)",
        stages: {
          "初階 (sP)": [
            "特溝D-sP-1 符合溝通需求之實物（體）或小模型。",
            "特溝D-sP-2 符合溝通需求之照片。",
            "特溝D-sP-3 符合溝通需求之圖像或線條圖。",
            "特溝D-sP-4 符合溝通需求之其他溝通符號。",
            "特溝D-sP-5 符合溝通需求之文字符號。",
            "特溝D-sP-6 國語口手語或手指語。",
            "特溝D-sP-7 使用溝通符號進行溝通的技巧。"
          ],
          "進階 (sA)": [
            "特溝D-sA-1 連續性溝通符號的運用技巧。",
            "特溝D-sA-2 依據溝通目的選用溝通輔具及溝通策略之技巧。",
            "特溝D-sA-3 以輔助溝通系統參與社交活動的技巧。",
            "特溝D-sA-4 輔助溝通系統應用的回饋。"
          ]
        }
      }
    ]
  }
};

// --- 組件：可折疊的選項區塊 ---
const ExpandableSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-purple-200 rounded-lg mb-4 overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100/50 transition-colors font-semibold text-purple-900"
      >
        <span className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-5 h-5 text-purple-500" /> : <ChevronRight className="w-5 h-5 text-purple-500" />}
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
  const [errorMessage, setErrorMessage] = useState("");
  
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

  const apiKey = ""; // API key 由平台注入

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
  };

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
    setErrorMessage("");
    setSelectedItems(prev => {
      const currentList = prev[type];
      if (currentList.includes(item)) {
        return { ...prev, [type]: currentList.filter(i => i !== item) };
      } else {
        if (currentList.length >= 3) {
          const typeName = type === 'performances' ? '學習表現' : '學習內容';
          setErrorMessage(`為了確保教學目標聚焦，【${typeName}】最多只能選擇 3 項喔！少即是多，對特教學生學習更有幫助。`);
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
                  ? 'bg-purple-600 text-white' 
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
                  ? 'text-purple-700 bg-purple-50 border border-purple-200 shadow-sm' 
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
              <div className="mt-0.5 text-purple-600 flex-shrink-0">
                {selectedItems[typeKey].includes(item) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 group-hover:text-purple-400" />
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
            { text: "3D Pixar animation style, highly detailed, vivid colors, standard Traditional Chinese captions (繁體中文), " + prompt }
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
    
    throw new Error("Image generation returned invalid format.");
  };

  const regenerateSpecificContent = async (sectionId) => {
    setRegeneratingId(sectionId);
    setErrorMessage("");
    
    const userAdjustment = sectionPrompts[sectionId] || "請重新生成一個更適合溝通障礙特教生的版本，調整句型或加入更生活化的溝通情境。";
    const sectionNames = {
      lessonPlan: "教案 (含目標、準備、流程)",
      outline: "簡報大綱",
      worksheet: "結構化學習單",
      roleplay: "互動對話稿",
      steps: "溝通步驟提示卡",
      checklist: "溝通自我檢核表",
      story: "溝通情境故事"
    };

    let studentProfile = "";
    if (grade || selectedTraits.length > 0 || studentStatus.trim()) {
      if (grade) studentProfile += `年級：${grade}\n`;
      if (selectedTraits.length > 0) studentProfile += `特質：${selectedTraits.join("、")}\n`;
      if (studentStatus.trim()) studentProfile += `補充說明：${studentStatus.trim()}\n`;
    } else {
      studentProfile = "無提供特定現況，請依一般溝通障礙或特教學生程度設計。";
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
           setErrorMessage("請先在左側面板勾選需要的學習單題型！");
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
         extraInstructions = "必須產出一個生成單一圖片四格漫畫的英文提示詞(imagePrompt)。四格漫畫的情境必須要包含正確的繁體中文(Traditional Chinese)對白文字標示在圖像中。";
         schemaProperties.socialStory = {
           type: "OBJECT",
           properties: {
             imagePrompt: { type: "STRING", description: "一個用來生成單張四格漫畫(4-panel comic strip)的英文提示詞，角色外觀必須一致，且指定各面板標有繁體中文(Traditional Chinese text captions/captions in Traditional Chinese characters)對白。" }
           },
           required: ["imagePrompt"]
         };
         requiredFields = ["socialStory"];
         break;
      }
      default:
         break;
    }

    const systemPrompt = `你是一位資深的特教溝通訓練老師。我們正在編寫一份溝通障礙與溝通訓練教材。
請根據原始的教學設定與學生的現況，特別針對「${sectionNames[sectionId]}」這個區塊進行重新設計與微調。

【使用者的微調指令】：${userAdjustment}

【重要設計指引】
1. 請確保內容符合溝通訓練特教生之易讀性，用語具體簡短。
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
      setErrorMessage("重新生成失敗，請稍後再試。");
    } finally {
      setRegeneratingId(null);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const musicBox = document.createElement("textarea");
    musicBox.value = text;
    musicBox.style.position = "fixed";
    musicBox.style.left = "-999999px";
    musicBox.style.top = "-999999px";
    document.body.appendChild(musicBox);
    musicBox.focus();
    musicBox.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    musicBox.remove();
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
      textToCopy += `互動對話稿：\n${lessonData.roleplay.map(r => `【${r.role}】：「${r.line}」 (*${r.action}*)`).join('\n')}\n\n`;
    }

    if (lessonData.steps && lessonData.steps.length > 0) {
      textToCopy += `溝通步驟提示卡：\n${lessonData.steps.map((s, i) => `步驟 ${i + 1}：${s}`).join('\n')}\n\n`;
    }

    if (lessonData.checklist && lessonData.checklist.length > 0) {
      textToCopy += `溝通自我檢核表：\n${lessonData.checklist.map(c => `□ ${c}`).join('\n')}\n\n`;
    }

    if (lessonData.socialStory && lessonData.socialStory.imagePrompt) {
      textToCopy += `溝通情境故事四格漫畫圖片 (請參考網頁中生成的單張繁體中文對白四格圖卡)\n\n`;
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
    setErrorMessage("");

    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, AlignmentType, ImageRun, HeadingLevel } = window.docx;
      const fontName = "Chiron GoRound TC"; 
      const docChildren = [];

      docChildren.push(new Paragraph({ text: "溝通訓練教材", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));

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
        docChildren.push(new Paragraph({ text: "溝通技巧學習單", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));
        
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
        docChildren.push(new Paragraph({ text: "互動對話稿", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
        needsPageBreak = false;
        
        lessonData.roleplay.forEach(r => {
          docChildren.push(new Paragraph({
            children: [
              new TextRun({ text: `【${r.role}】 `, font: fontName, size: 24, bold: true, color: "7C3AED" }),
              new TextRun({ text: `「${r.line}」 `, font: fontName, size: 24, color: "333333" }),
              new TextRun({ text: `(*${r.action}*)`, font: fontName, size: 20, color: "64748B", italics: true })
            ],
            spacing: { after: 160 }
          }));
        });
      }

      if (lessonData.steps && lessonData.steps.length > 0) {
        docChildren.push(new Paragraph({ text: "行為步驟提示卡", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
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
        docChildren.push(new Paragraph({ text: "溝通自我檢核表", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
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
        docChildren.push(new Paragraph({ text: "溝通情境故事", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));

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
                    run: { font: fontName, size: 36, bold: true, color: "5B21B6" }, 
                    paragraph: { 
                        spacing: { before: 240, after: 180 }, 
                        border: { bottom: { color: "DDD6FE", space: 10, style: BorderStyle.SINGLE, size: 12 } } 
                    } 
                },
                heading2: { 
                    run: { font: fontName, size: 30, bold: true, color: "6D28D9" }, 
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
      window.saveAs(blob, '溝通訓練教案與學習單.docx');

    } catch (err) {
      console.error(err);
      setErrorMessage("Word 下載發生錯誤。");
    } finally {
      setIsExporting(false);
    }
  };

  const regenerateSingleImage = async (imagePrompt) => {
    setLessonData(prev => ({
        ...prev,
        socialStory: { ...prev.socialStory, isRegenerating: true, error: false }
    }));
    setErrorMessage("");

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
      setErrorMessage("漫畫圖片生成失敗，您可以點選右上角圖標重試。");
    }
  };

  const generateLessonPlan = async () => {
    setErrorMessage("");
    if (selectedItems.performances.length === 0 && selectedItems.contents.length === 0 && !customTopic.trim()) {
      setErrorMessage("請至少選擇一項學習表現/學習內容，或是輸入「自訂教學主題」！");
      return;
    }
    if (selectedOutputs.length === 0) {
      setErrorMessage("請至少勾選一項要產出的內容！");
      return;
    }
    if (selectedOutputs.includes('worksheet') && selectedWorksheetTypes.length === 0) {
      setErrorMessage("您勾選了結構化學習單，請至少在下方選擇一種題型喔！");
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

      worksheetPrompt = `\n【學習單設計特別要求】\n學習單必須「高度結構化」，適合特教或溝通障礙學生。請務必嚴格依照以下要求的題型與「指定的題數」進行設計，不可多也不可少：\n`;
      if (selectedWorksheetTypes.includes('tf')) worksheetPrompt += `1. 「情境圈叉題」(是非題)：描述一個具體溝通情境，讓學生判斷溝通行為或方式是否適當。請出剛好 ${worksheetCounts.tf} 題。\n`;
      if (selectedWorksheetTypes.includes('mc')) worksheetPrompt += `2. 「選擇題」：提供具體的社交溝通選項。請出剛好 ${worksheetCounts.mc} 題。\n`;
      if (selectedWorksheetTypes.includes('check')) worksheetPrompt += `3. 「勾選題(圈選題)」：可複選的具體口語或非口語策略。請出剛好 ${worksheetCounts.check} 題。\n`;
      if (selectedWorksheetTypes.includes('shortAns')) worksheetPrompt += `4. 「問答題」：提供一個與溝通訓練學習目標相關的具體情境，讓學生簡答其想法或應對溝通做法。請出剛好 ${worksheetCounts.shortAns} 題。\n`;
      if (selectedWorksheetTypes.includes('custom') && customWorksheetType.trim() !== '') worksheetPrompt += `5. 「${customWorksheetType.trim()}」：這是使用者自訂的題型，請出剛好 ${worksheetCounts.custom} 題，並依據題型名稱提供適合特教溝通障礙生的作答方式。\n`;
      worksheetPrompt += `絕對不要設計需要大量書寫的開放式問答。選擇或勾選題務必在 options 中提供具體的選項。`;
    }

    const systemPrompt = `你是一位資深的特教老師，專精於溝通障礙與溝通訓練。請根據使用者選擇的學習重點與學生現況，設計實用的溝通技巧與溝通訓練教材。
必須嚴格依照要求的 JSON 格式輸出。${selectedOutputs.includes('story') ? '溝通情境故事只需生成 1 個 imagePrompt (要求繪製 4-panel comic strip，並且畫面中包含正確的 Traditional Chinese/繁體中文 caption對白描述)，不需其他內文文字。' : ''}

【重要設計指引】
1. 核心目標優先：教學內容必須「絕對緊扣」所選的「學習表現」或「學習內容」。若使用者僅提供其中一項，請以此為核心，自行推導合適的教學脈絡。
2. 溝通訓練特色：內容應著重於眼神、表情、姿勢、口語、輔具(AAC)或手語、語法语用訓練等技能。
3. 學生現況為輔（適性調整）：學生特質與現況是用來設定「教學策略、情境故事背景、難易度」（例如：若是聽損，句型應簡短具體並配合視覺輔具；若需要AAC，應融入符號)。
4. 易讀性原則：請盡量使用簡短、具體的語句，避免冗長抽象的說明，確保低口語或低識字學生能理解。
5. 實用性原則：提供的溝通策略和步驟必須是在日常生活中可以實際操作的。
${worksheetPrompt}`;

    let studentProfile = "";
    if (grade || selectedTraits.length > 0 || studentStatus.trim()) {
      if (grade) studentProfile += `年級/階段：${grade}\n`;
      if (selectedTraits.length > 0) studentProfile += `特質：${selectedTraits.join("、")}\n`;
      if (studentStatus.trim()) studentProfile += `補充說明：${studentStatus.trim()}\n`;
    } else {
      studentProfile = "無提供特定現況，請依一般特教生(溝通訓練)程度設計。";
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
            role: { type: "STRING", description: "角色名稱，例如：學生、教師、同儕" },
            line: { type: "STRING", description: "簡短具體的台詞內容" },
            action: { type: "STRING", description: "動作提示，例如：看著對方的眼睛、深呼吸、按下溝通板鍵" }
          },
          required: ["role", "line", "action"]
        },
        description: "社交溝通對話稿，設計約 4-6 句來回的短對話供師生或同儕演練"
      };
      requiredFields.push("roleplay");
    }

    if (selectedOutputs.includes('steps')) {
      schemaProperties.steps = {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "將核心溝通技能拆解成 3~4 個具體、簡短的執行步驟 (SOP)"
      };
      requiredFields.push("steps");
    }

    if (selectedOutputs.includes('checklist')) {
      schemaProperties.checklist = {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "設計 2~3 個具體的生活溝通行為自我檢核項目，讓學生在日常中打勾紀錄"
      };
      requiredFields.push("checklist");
    }

    if (selectedOutputs.includes('story')) {
      schemaProperties.socialStory = {
        type: "OBJECT",
        properties: {
          imagePrompt: { type: "STRING", description: "生成單張四格漫畫的英文提示詞，必須描述主角特徵及四個畫面的連貫動作，並要求在圖片上標示 Traditional Chinese (繁體中文) characters captions，例如：A 4-panel comic strip showing a child... with Standard Traditional Chinese characters text on each panel. Panel 1: ... Panel 2: ... Panel 3: ... Panel 4: ..." }
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
      setProgressText("正在根據特教課綱生成結構化溝通教材...");
      
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
        setProgressText(`正在為溝通情境故事繪製繁體中文對白四格漫畫...`);
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
            setErrorMessage("漫畫圖片生成失敗，但文字資料已為您準備完畢，可點選漫畫旁的重試圖標重新嘗試。");
        }
        setProgress(100);
      } else {
        setProgress(100);
      }
      
      setProgressText("所有教材生成完成！");
      setTimeout(() => setLoading(false), 600); 
      
    } catch (error) {
      console.error(error);
      setErrorMessage("生成失敗，請稍後再試或檢查您的網路連線。");
      setLoading(false);
    }
  };

  const renderRegenerateBlock = (sectionId, label) => (
    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-center gap-3 print:hidden">
      <input
        type="text"
        placeholder={`想微調${label}嗎？請輸入指令 (例如：更簡單一點、加入圖卡溝通、加入課堂情境...)`}
        value={sectionPrompts[sectionId] || ''}
        onChange={(e) => setSectionPrompts(prev => ({ ...prev, [sectionId]: e.target.value }))}
        className="flex-1 w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none text-sm text-slate-700 bg-white"
        onKeyDown={(e) => {
          if (e.key === 'Enter') regenerateSpecificContent(sectionId);
        }}
      />
      <button
        onClick={() => regenerateSpecificContent(sectionId)}
        disabled={regeneratingId === sectionId}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
      >
        {regeneratingId === sectionId ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        重新生成此區塊
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800 print:bg-white print:p-0" style={{ fontFamily: "'Chiron GoRound TC', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:space-y-0">
        
        <header className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-purple-600 print:hidden">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600 flex-shrink-0">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">溝通訓練備課大師</h1>
            <p className="text-slate-500 text-sm mt-1">依據特教溝通訓練領綱設計，自動生成教案、結構化學習單與繁體中文四格溝通漫畫。</p>
          </div>
        </header>

        {/* 系統提醒訊息 */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-2 print:hidden shadow-sm">
            <div className="bg-red-100 text-red-600 rounded-full p-1 mt-0.5 shrink-0">
              <X className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">系統提示</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 print:gap-0">
          
          <div className="space-y-6 print:hidden">
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                步驟一：選擇學習重點 (特溝領綱)
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
                  <Plus className="w-4 h-4 text-purple-500" />
                  3. 或輸入自訂教學主題 (若課綱未涵蓋)
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-slate-700 bg-white"
                  placeholder="例如：認識情緒表情線條圖、如何使用溝通板指認、日常生活需求表達..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>

              <div className="mt-5 bg-purple-50 p-4 rounded-lg border border-purple-100 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-xs text-purple-500 font-bold mb-1">學習表現</div>
                  <div className="text-lg font-bold text-purple-700">
                    {selectedItems.performances.length} <span className="text-sm text-purple-400">/ 3</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-purple-200"></div>
                <div className="text-center">
                  <div className="text-xs text-purple-500 font-bold mb-1">學習內容</div>
                  <div className="text-lg font-bold text-purple-700">
                    {selectedItems.contents.length} <span className="text-sm text-purple-400">/ 3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  步驟二：填寫學生溝通現況 (選填)
                </h2>
                <button
                  onClick={() => {
                      setGrade("國小中年級");
                      setSelectedTraits(["無口語/低口語", "需要溝通板/AAC輔具", "人際互動被動"]);
                      setStudentStatus("學生目前在班級中缺乏主動溝通的意圖，平時主要以手勢或生氣哭鬧表達需求。希望教導學生學習主動指認溝通板(圖卡輔具)的步驟，並建立日常情境主動回應同儕的能力。");
                  }}
                  className="text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
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
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 bg-white"
                  >
                    <option value="">請選擇年級...</option>
                    {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">學生溝通特質 (可複選)</label>
                  <div className="flex flex-wrap gap-2">
                    {traitOptionsList.map(trait => (
                      <button
                        key={trait}
                        onClick={() => handleToggleTrait(trait)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          selectedTraits.includes(trait) 
                            ? 'bg-purple-100 border-purple-300 text-purple-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">其他溝通現況或困難點補充說明</label>
                  <textarea
                    className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-sm text-slate-700"
                    placeholder="例如：發音清晰度、輔具使用熟悉度、在班級的人際障礙、對特殊增強物的反應..."
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
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${selectedOutputs.includes(opt.id) ? 'bg-purple-50 border-purple-200' : 'hover:bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="mt-0.5 text-purple-600 flex-shrink-0">
                          {selectedOutputs.includes(opt.id) ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 group-hover:text-purple-400" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${selectedOutputs.includes(opt.id) ? 'text-purple-800' : 'text-slate-700'}`}>
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
                                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
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
                                  <span className="text-sm font-bold w-4 text-center text-purple-600">{worksheetCounts[subOpt.id]}</span>
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
                                  placeholder="請輸入自訂題型名稱 (例如：連連看、指認配對)"
                                  value={customWorksheetType}
                                  onChange={(e) => setCustomWorksheetType(e.target.value)}
                                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none text-sm text-slate-700 bg-white"
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
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI 正在努力生成中...
                </>
              ) : (
                '開始生成選定溝通訓練內容'
              )}
            </button>

          </div>

          {}
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
                      {copied ? <Check className="w-4 h-4 text-purple-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已複製' : '複製文字'}
                    </button>
                    <button 
                      onClick={exportToWord}
                      disabled={isExporting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 border border-purple-600 rounded-md hover:bg-purple-700 text-white transition-colors shadow-sm disabled:opacity-50"
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
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-6" />
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-3 border border-slate-200 overflow-hidden shadow-inner">
                      <div 
                        className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute top-0 left-0 bottom-0 w-full bg-white/20 animate-[translate_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <span className="font-medium text-slate-600">{progressText}</span>
                      <span className="font-bold text-purple-600">{progress}%</span>
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
                        <h1 className="text-2xl font-bold text-purple-800 mb-4 border-b-2 border-purple-200 pb-2">溝通訓練教案</h1>
                        
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-600 mb-2">教學目標</h2>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                            {lessonData.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                          </ul>
                        </div>

                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-600 mb-2">教學準備</h2>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                            {lessonData.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-purple-600 mb-2">教學流程</h2>
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-indigo-200 pb-4 gap-4">
                          <h1 className="text-2xl font-bold text-indigo-800">課程簡報大綱</h1>
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
                            <div key={i} className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm print-avoid-break">
                              <div className="flex items-center gap-3 mb-3 border-b border-indigo-50 pb-3">
                                <span className="bg-indigo-100 text-indigo-700 text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-indigo-200">
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-purple-200 pb-4 gap-4">
                            <h1 className="text-2xl font-bold text-purple-800 text-center flex-1">溝通技巧學習單</h1>
                            <div className="flex gap-2 print:hidden w-full md:w-auto">
                              <button
                                onClick={() => {
                                  let worksheetText = "";
                                  worksheetText += `請幫我美化並排版以下這份特教生「溝通訓練」學習單，給我圖片。請注意以下需求：\n\n`;
                                  worksheetText += `【目標學生背景】\n`;
                                  if (grade) {
                                      worksheetText += `- 年級/階段：${grade}\n`;
                                      worksheetText += `  *(請確保排版、用語難度、插圖風格或情境描述，要符合「${grade}」學生的年齡心智與溝通障礙特質發展。)*\n`;
                                  } else {
                                      worksheetText += `- 年級/階段：未指定 (請依一般特教溝通障礙生程度，使用清晰、具體的用語。)\n`;
                                  }
                                  
                                  if (selectedTraits.length > 0) {
                                      worksheetText += `- 學生溝通特質：${selectedTraits.join("、")}\n`;
                                  }
                                  
                                  worksheetText += `\n【排版與設計要求】\n`;
                                  worksheetText += `1. 請維持原有的題型與題數不變。\n`;
                                  worksheetText += `2. 版面必須「高度結構化」，留白要夠，字體大小與行距要大，多加點圖片、降低視覺負擔，適合溝通學習。\n`;
                                  worksheetText += `3. **請為每個題目或情境提供合適的圖片**\n`;
                                  worksheetText += `4. 可適度加入簡單符號與表情線條作為視覺提示。\n`;
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
                                  window.open("https://chatgpt.com/g/g-6a1a588150d881918a2a7dc8f67ae06b-xue-xi-dan-mei-hua-da-shi", "_blank");
                                }}
                                className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-pink-600 text-white hover:bg-pink-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                              >
                                <Copy className="w-4 h-4" />
                                複製文字到GPT美化
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                        </div>
                        <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                          {lessonData.worksheet.map((item, i) => (
                            <div key={i} className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm print-avoid-break">
                              <div className="flex items-start gap-2 mb-4">
                                <span className="bg-purple-100 text-purple-700 text-sm font-bold px-2 py-1 rounded whitespace-nowrap">
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
                                                  <span className="text-purple-500 mt-0.5">•</span> 
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
                        <h1 className="text-2xl font-bold text-purple-800 mb-6 border-b-2 border-purple-200 pb-2 text-center">實作：溝通互動對話稿</h1>
                        <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
                          <div className="space-y-4">
                            {lessonData.roleplay.map((r, i) => (
                              <div key={i} className="flex flex-col print-avoid-break">
                                <span className="text-purple-800 font-bold text-base bg-purple-50 self-start px-3 py-1 rounded mb-1">{r.role}</span>
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
                        <h1 className="text-2xl font-bold text-purple-800 mb-6 border-b-2 border-purple-200 pb-2 text-center">類化：溝通步驟提示卡 (SOP)</h1>
                        <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
                          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-purple-200 before:to-transparent">
                            {lessonData.steps.map((step, i) => (
                              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active print-avoid-break">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-purple-100 text-purple-600 font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xl">
                                  {i + 1}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm text-slate-800 font-bold text-xl">
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
                        <h1 className="text-2xl font-bold text-amber-800 mb-6 border-b-2 border-amber-200 pb-2 text-center">追蹤：溝通自我檢核表</h1>
                        <div className="bg-white border-2 border-purple-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
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
                        <h1 className="text-2xl font-bold text-purple-800 mb-6 border-b-2 border-purple-200 pb-2 text-center">溝通情境故事 (四格漫畫)</h1>
                        <div className="bg-white border-2 border-purple-100 p-6 rounded-xl shadow-sm print:border-0 print:shadow-none print:p-0 print-avoid-break">
                          
                          <div className="w-full flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative group min-h-[400px]">
                              {lessonData.socialStory.isRegenerating && (
                                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center text-purple-500 backdrop-blur-sm">
                                      <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                                      <span className="text-sm font-bold">重新繪製繁體中文對白四格漫畫中...</span>
                                  </div>
                              )}

                              {lessonData.socialStory.imagePrompt && !lessonData.socialStory.isRegenerating && (
                                  <button
                                      onClick={() => {
                                        if (lessonData.socialStory.imagePrompt) {
                                          regenerateSingleImage(lessonData.socialStory.imagePrompt);
                                        }
                                      }}
                                      className={`absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-600 hover:text-purple-600 rounded-lg shadow-md border border-slate-200 transition-opacity z-10 print:hidden ${
                                          lessonData.socialStory.error ? 'opacity-100 ring-2 ring-red-400' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                                      }`}
                                      title="重新生成這張圖片"
                                  >
                                      <RefreshCw className="w-5 h-5" />
                                  </button>
                              )}

                              {lessonData.socialStory.base64 && !lessonData.socialStory.isRegenerating ? (
                                  <img src={`data:image/png;base64,${lessonData.socialStory.base64}`} alt="繁體中文四格溝通故事漫畫" className="w-full h-auto max-h-[800px] object-contain" />
                              ) : lessonData.socialStory.error && !lessonData.socialStory.isRegenerating ? (
                                  <div className="flex flex-col items-center text-slate-400">
                                      <ImageIcon className="w-10 h-10 mb-2 text-red-400" />
                                      <span className="text-sm font-medium text-red-500">圖片生成失敗</span>
                                      <span className="text-xs mt-1 text-slate-400 text-center px-2">可點擊右上角重試</span>
                                  </div>
                              ) : !lessonData.socialStory.isRegenerating ? (
                                  <div className="flex flex-col items-center text-slate-400">
                                      <ImageIcon className="w-10 h-10 mb-2 animate-pulse text-purple-300" />
                                      <span className="text-sm">繪製圖片中...</span>
                                  </div>
                              ) : null}
                          </div>

                        </div>

                        {renderRegenerateBlock("story", "社會溝通故事")}
                      </section>
                    )}

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <BookOpen className="w-16 h-16 mb-4 text-slate-200" />
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
            本作品採用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh_TW" target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors">CC BY-NC-SA 4.0 創用CC授權</a>。
          </p>
          <p>歡迎非商業用途轉載、引用或改編，請保留「米克師」署名並附上原始連結。</p>
          <p>
            研習合作邀約：<a href="mailto:rouwanyellow@gmail.com" className="text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors">rouwanyellow@gmail.com</a>
          </p>
        </footer>

      </div>
      
      {}
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