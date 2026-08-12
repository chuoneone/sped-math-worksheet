# 數題數題 (sped-math-worksheet)

> 專為特教教師與資源班設計的特教數學雙版本「點讀報讀 HTML 網頁」與「微軟原生 OMML Word 學習單」生成器 Agent Skill。

---

## 🌟 核心特色

- **🎯 題目與解題邏輯 100% 一致**：給定任一數學題目，自動生成 5 題「題型、解題邏輯、算式步驟行數 100% 完全相同」的同型練習題。
- **✨ 純淨單純化標籤**：題頭僅標示 **`第 1 題`** ~ **`第 5 題`**，無任何干擾學生視線的提示詞。
- **🧩 倒序漸進式挖空 (Reverse Scaffolding Fading)**：所有題目步驟行數完全一致，從最後一步倒數向前漸進擴大挖空範圍，符合特教學生的記憶曲線。
- **↩️ 算式化簡強制獨立換行**：算式中的每一步化簡與步驟轉換皆獨自換行，呈現清晰對齊的直向結構。
- **👥 自動產出雙版本（學生版 ＋ 教師版）**：
  - **學生練習版 (Student Version)**：
    - **點讀報讀 HTML 網頁**：內建 Web Speech API 語音報讀工具列與發音高亮，填空處純底線 `_______` **絕對無答案**。
    - **原生 OMML Word (.docx) 檔**：填空處純底線 `_______` **絕對無答案**。
  - **教師解析版 (Teacher Version)**：
    - **純靜態解答 HTML 網頁**（無報讀工具列，填空處帶入藍色加粗正確解答，方便教師快速閱覽與對答案）。
    - **原生 OMML Word (.docx) 檔**（填空處帶入藍色加粗正確解答）。
- **➗ Unicode 除號 `÷` 無亂碼**：數學方程式嚴格採用 Unicode `÷`，徹底解決 Word OMML 的 `&#x00F7;` XML 轉義亂碼。
- **🖨️ A4 高密度列印優化**：預設 `@media print` 隱藏報讀工具列，每頁可高密度容納 2~3 題，防止卡片分割破頁。

---

## 📁 檔案結構

```text
├── SKILL.md                                 # Antigravity Agent Skill 核心定義檔
├── README.md                                # 專案說明文件
└── .agents/
    └── skills/
        └── sped-math-worksheet/
            └── SKILL.md                     # Workspace Skill 定義檔
```

---

## 🚀 如何在 Antigravity 安裝與使用

1. 將本 Repository 複製或下載至您的專案目錄 `.agents/skills/sped-math-worksheet/` 或全域設定 `~/.gemini/config/skills/sped-math-worksheet/`。
2. 對 Agent 貼上數學題目（文字或圖片說明），並說：
   > 「**數題數題 2x-1=11**」 或 「**幫我做成特教學習單**」
3. Agent 會自動生成 5 題倒序漸進挖空的同型題，並一次輸出 **4 個檔案**（學生版 HTML/Word ＋ 教師版 HTML/Word）！
