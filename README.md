# 數題數題 (sped-math-worksheet)

> 專為特教教師與資源班設計的數學題目轉點讀報讀 HTML 網頁與原生 OMML Word 學習單生成器 Agent Skill。

## 🌟 核心特色

- **🎯 題目與解題邏輯 100% 一致**：給定任一數學題目，自動生成 N 題結構完全相同、僅更換數字的同型練習題。
- **❓ 互動問答引導 (`ask_question`)**：自動彈窗詢問題目數量 (3~10 題) 與算式挖空策略。
- **🧩 漸進式鷹架褪除 (Scaffolding Fading)**：第一題提示完整，後續逐步擴大算式挖空範圍，最後一題獨立思考作答。
- **🔊 學生點讀報讀 (Point-to-Read TTS)**：HTML 內建 Web Speech API 語音報讀工具列，點擊任一題目或算式即刻發音（直式分數與算式皆具備自然國語中文讀音）。
- **📄 微軟原生 OMML 方程式 Word 匯出**：Word (.docx) 檔內建 Office Math (OMML) 方程式物件，排版極致美觀，搭配標楷體與特教卡片框。
- **🖨️ A4 高密度列印優化**：預設 `@media print` 隱藏報讀列，每頁可容納 2~3 題，防止斷頁切割。

## 📁 檔案結構

```text
├── SKILL.md                                 # Antigravity Agent Skill 核心定義檔
├── .agents/
│   └── skills/
│       └── sped-math-worksheet/
│           └── SKILL.md                     # Workspace Skill 定義
├── examples/                                # 範例學習單與考卷
│   ├── 一元一次方程式_靜態學習單.html
│   ├── 一元一次方程式_靜態學習單.docx
│   ├── 一元一次方程式_10題小考卷.html
│   └── 一元一次方程式_10題小考卷.docx
└── README.md                                # 專案說明文件
```

## 🚀 如何在 Antigravity 安裝與使用

1. 將本 Repository 下載或複製至您的專案目錄 `.agents/skills/sped-math-worksheet/` 或全域設定 `~/.gemini/config/skills/sped-math-worksheet/`。
2. 對 Agent 貼上數學題目（文字或圖片說明），並說：
   > 「**幫我用數題數題生成學習單**」 或 「**數題數題 2x-1=10**」
3. Agent 會自動彈出互動問答選擇題目數量與鷹架策略，並即刻匯出 報讀 HTML 與 原生 OMML Word 學習單！
