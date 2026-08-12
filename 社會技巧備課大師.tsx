import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Loader2, BookOpen, User, FileText, Copy, Check, Download, Image as ImageIcon, Circle, X, ListChecks, Plus, Minus, MessageCircle, ListOrdered, ClipboardCheck, RefreshCw, ExternalLink } from 'lucide-react';

// --- 選項資料 ---
const gradeOptions = ["國小低年級", "國小中年級", "國小高年級", "國中七年級", "國中八年級", "國中九年級", "高中職"];
const traitOptionsList = [
  "口語表達佳", "口語表達弱", "容易衝動", "固執性高",
  "難以察覺他人情緒", "容易分心", "缺乏自信", "人際衝突多", "需要視覺提示", "識字能力偏弱"
];

const outputOptionsList = [
  { id: 'lessonPlan', label: '教案 (含目標、準備、流程)' },
  { id: 'outline', label: '簡報大綱 (可作為 NotebookLM 來源)' },
  { id: 'worksheet', label: '結構化學習單 (展開設定題型)', isWorksheetParent: true },
  { id: 'roleplay', label: '角色扮演對話稿 (實作演練)' },
  { id: 'steps', label: '視覺化步驟提示卡 (行為 SOP)' },
  { id: 'checklist', label: '自我檢核表 (生活類化追蹤)' },
  { id: 'story', label: '社會性故事 (含圖卡)' }
];

const worksheetSubOptions = [
  { id: 'tf', label: '情境圈叉題 (O/X)' },
  { id: 'mc', label: '選擇題 (單選)' },
  { id: 'check', label: '勾選題 (複選)' },
  { id: 'shortAns', label: '問答題' },
  { id: 'custom', label: '自訂題型' }
];

// --- 資料整理：社會技巧學習重點 ---
const curriculumData = {
  performances: {
    title: "學習表現",
    categories: [
      {
        name: "處己（特社 1）",
        stages: {
          "第一階段（Ⅰ）": [
            "特社1-I-1 分辨與表達基本的正向或負向情緒。",
            "特社1-I-2 藉由生理反應察覺及辨識壓力與情緒的反應。",
            "特社1-I-3 學習面對可能遭遇的失敗。",
            "特社1-I-4 察覺自己與他人對自己的看法或態度。",
            "特社1-I-5 在遭逢不如意事件時，接受他人安慰並適當發洩情緒。"
          ],
          "第二階段（Ⅱ）": [
            "特社1-II-1 嘗試因應與處理基本的情緒及壓力。",
            "特社1-II-2 以實質的增強物自我激勵。",
            "特社1-II-3 在成人的引導下擬訂解決問題的計畫。",
            "特社1-II-4 嘗試使用策略解決問題並接納後果。"
          ],
          "第三階段（Ⅲ）": [
            "特社1-III-1 聽從建議選擇較佳的情緒處理技巧。",
            "特社1-III-2 嘗試使用抒解壓力的方法。",
            "特社1-III-3 接納自己與接受不可能每個人都喜歡自己的事實。",
            "特社1-III-4 以各種形式自我安慰與獎勵。",
            "特社1-III-5 使用策略解決問題，但不過度重視結果或成敗。"
          ],
          "第四階段（Ⅳ）": [
            "特社1-IV-1 分辨與表達矛盾的情緒。",
            "特社1-IV-2 分析不同處理方式引發的行為後果。",
            "特社1-IV-3 在面對壓力時，適當的調整情緒。",
            "特社1-IV-4 聽從他人的建議，嘗試解決被拒絕的困境。",
            "特社1-IV-5 從可行策略中，選擇適當的抒解壓力方式。",
            "特社1-IV-6 分析失敗的原因，並從成功的經驗自我肯定。",
            "特社1-IV-7 根據優弱勢能力，設定努力或學習的目標。",
            "特社1-IV-8 遭遇不如意時，主動轉移注意力，並以內在語言自我鼓勵。",
            "特社1-IV-9 主動擬定與分析問題解決方式的優缺點及其後果。"
          ],
          "第五階段（Ⅴ）": [
            "特社1-V-1 根據情緒的情境或程度，適當的運用各種情緒，促進成長。",
            "特社1-V-2 在面對壓力時有效處理自己的情緒。",
            "特社1-V-3 主動尋求資源或策略以處理被拒絕的困境。",
            "特社1-V-4 持續嘗試與使用有效的方式抒解壓力。",
            "特社1-V-5 發揮自己的優勢去解決問題。",
            "特社1-V-6 遭遇不如意時，以正向思考方式調整心態。",
            "特社1-V-7 從失敗經驗中自我鼓勵，並調整解決問題的方式或策略。",
            "特社1-V-8 事先評估結果，並選擇對自己及他人皆有利的解決方法。",
            "特社1-V-9 勇於面對自己的選擇和承擔後果。"
          ]
        }
      },
      {
        name: "處人（特社 2）",
        stages: {
          "第一階段（Ⅰ）": [
            "特社2-I-1 了解別人發出的訊息，是要我注意或是有事情要溝通。",
            "特社2-I-2 了解人與人之間喜歡、親密與不喜歡、排斥的表現及差異。",
            "特社2-I-3 適當使用口語、非口語或輔具與人溝通。",
            "特社2-I-4 以身體動作適度表現出傾聽的態度。",
            "特社2-I-5 依情境適當回答問題。",
            "特社2-I-6 主動打招呼和自我介紹。",
            "特社2-I-7 了解與人相處的情境、簡單規則，建立友善的關係。",
            "特社2-I-8 分辨與表達衝突的原因、情境與後果。",
            "特社2-I-9 避免爭鬥或危險的場合以保護自己。",
            "特社2-I-10 在面對抱怨或拒絕情境時，維持心情的平穩。",
            "特社2-I-11 在被他人誤解或誣賴時，主動尋求大人或同儕的協助。",
            "特社2-I-12 與他人相處時，遵守基本的禮儀。",
            "特社2-I-13 分辨與因應不適當的觸摸或語言，必要時主動尋求協助。",
            "特社2-I-14 尊重他人的身體界限與自主權。"
          ],
          "第二階段（Ⅱ）": [
            "特社2-II-1 解讀他人口語與非口語溝通的情緒及目的，並反思自己是否有應留意或改善之處。",
            "特社2-II-2 主動引起話題，並禮貌地表達和傾聽他人的意見。",
            "特社2-II-3 遵守團體規範，並依情境回應他人的邀請或主動加入團體。",
            "特社2-II-4 分辨與採用適當的方式解決衝突，並能理性評估和接受衝突的後果。",
            "特社2-II-5 無法執行他人的期待，以適當的方式回應困境。",
            "特社2-II-6 了解性器官的隱私性及轉移觸摸的注意力。",
            "特社2-II-7 與他人相處時，分辨安全或危險的情境與人物。"
          ],
          "第三階段（Ⅲ）": [
            "特社2-III-1 以善意正向的觀點，看待與人相處的各種互動行為。",
            "特社2-III-2 區辨別人非善意行為是提醒，還是威脅到了自己的適應與生存。",
            "特社2-III-3 使用適當的技巧與人談話，並禮貌的結束話題。",
            "特社2-III-4 依據情境，用適當的方式與他人分享自己喜歡的物品或生活經驗。",
            "特社2-III-5 明瞭每個人都有獨特的地方，交友時不以單一標準或條件選擇。",
            "特社2-III-6 展現合宜行為以維持長時間的友誼。",
            "特社2-III-7 在無法接受個人或團體的要求時，禮貌地表示拒絕。",
            "特社2-III-8 理性評估與接受被拒絕的原因。",
            "特社2-III-9 理性評估被誤解的原因，並清楚表達自己的立場以及說明事實。",
            "特社2-III-10 檢視發生衝突的原因並設法自我修正。",
            "特社2-III-11 面對兩難的情境時，說明情境的利弊得失。",
            "特社2-III-12 評估與遵守虛擬世界的規則，並清楚表達自己的需求和感受。",
            "特社2-III-13 覺察與因應身體碰觸或情感互動時不對等的權力關係。",
            "特社2-III-14 勇敢表達對他人不當觸摸或語言的反感。",
            "特社2-III-15 保持與他人相處時的身體界限。",
            "特社2-III-16 以平等、尊重的態度與方式欣賞與對待各種性別的人。",
            "特社2-III-17 在虛擬世界進行人際互動時，能維持平等、尊重的態度。"
          ],
          "第四階段（Ⅳ）": [
            "特社2-IV-1 運用科技媒體接收他人的訊息，以及解讀科技媒體訊息上的意義。",
            "特社2-IV-2 區辨各種溝通訊息的情緒和意圖，並能保留正向內容激勵自己，察覺負向內容保護自己。",
            "特社2-IV-3 正確解讀性別間傳遞的訊息，是正向合理，或是歧視，還是具有高度的性暗示。",
            "特社2-IV-4 具備正確使用網路的基本法律常識。",
            "特社2-IV-5 運用科技媒體表達和接受不同的意見或感受。",
            "特社2-IV-6 適當介紹自己獨特的地方，主動尋求志同道合的朋友。",
            "特社2-IV-7 欣賞不同朋友的獨特性，建立不同層次的友誼。",
            "特社2-IV-8 根據喜好主動加入團體，並替團體爭取榮譽。",
            "特社2-IV-9 與他人共同從事活動，分享彼此的感受或想法。",
            "特社2-IV-10 在同儕友誼關係出現狀況時有修補的策略。",
            "特社2-IV-11 在面對衝突情境時，控制自己情緒並選擇可被接受的方式回應。",
            "特社2-IV-12 面對他人的抱怨，安撫對方情緒緩和衝突，並有效分析自己的困難。",
            "特社2-IV-13 在面對兩難的情境時，主主動選擇對自己較為有利的情境。",
            "特社2-IV-14 在無法接受個人或團體的要求時，禮貌的說明拒絕的原因。",
            "特社2-IV-15 與他人相處，分辨危險情境或危險人物，采取正當的防衛措施。",
            "特社2-IV-16 使用技巧拒絕他人不當的觸摸或語言。",
            "特社2-IV-17 以平等、尊重的態度與他人共同參與團體或活動。",
            "特社2-IV-18 使用適當方式表達對人的欣賞，以及接受各種結果。",
            "特社2-IV-19 懂得保護自己，正確判斷及因應禮物或金錢的誘惑。",
            "特社2-IV-20 分辨他人愛慕的言語及行為。",
            "特社2-IV-21 能以適當方式抒解自己的性衝動。",
            "特社2-IV-22 尊重他人的性傾向或性別認同。",
            "特社2-IV-23 在面對爭吵或分手的情境，冷靜面對結果，並尋求適當協助保護自己。",
            "特社2-IV-24 遵守法律對於性關係的規範。",
            "特社2-IV-25 在法律與師長的協助下，處理與他人發生性關係的後果。"
          ],
          "第五階段（Ⅴ）": [
            "特社2-V-1 理解各種有趣及善意的訊息，讓自己快樂生活。",
            "特社2-V-2 區辨與查證科技媒體訊息的真實性，不被誤導。",
            "特社2-V-3 了解惡意欺騙或具有性侵害意圖的各種訊息。",
            "特社2-V-4 用適當方式表達和接受不同的意見或評論。",
            "特社2-V-5 根據對話中隱含的情緒和目的，選擇適當的因應方法。",
            "特社2-V-6 依情境變化適當展現自己的優勢能力，以降低弱勢能力帶來的負面影響。",
            "特社2-V-7 與不同特質的朋友互動，選擇適當的回饋，調整自己的行為以維持友誼。",
            "特社2-V-8 積極參與團體，爭取團體的接納。",
            "特社2-V-9 在團體中適當分享自己的感受或想法。",
            "特社2-V-10 在面對衝突情境，有效處理自己的情緒。",
            "特社2-V-11 主動與他人協商，提出雙方都可接受的方法解決衝突。",
            "特社2-V-12 反省衝突原因，以便事前避免正面衝突。",
            "特社2-V-13 在被他人誤解或誣賴時主動澄清。",
            "特社2-V-14 在無法執行他人的要求時，尋求可能的替代方案和有效的資源。",
            "特社2-V-15 了解與人相處時的安全情境條件。",
            "特社2-V-16 面對他人不當的觸摸或語言時，能有效使用自我保護及求助技巧。",
            "特社2-V-17 尋求適當途徑告發他人不當的觸摸或語言。",
            "特社2-V-18 了解與他人單獨約會時的安全。",
            "特社2-V-19 禮貌地拒絕他人愛慕的言語及行為。",
            "特社2-V-20 負責任地處理與他人發生性關係的後果。",
            "特社2-V-21 培養與人建立健康親密關係的方法。"
          ]
        }
      },
      {
        name: "處環境（特社 3）",
        stages: {
          "第一階段（Ⅰ）": [
            "特社3-I-1 在課堂中持續傾聽他人說話。",
            "特社3-I-2 依指示完成簡單的工作。",
            "特社3-I-3 遇到困難時，等待時機求助。",
            "特社3-I-4 以適當的身體動作或口語表達需求。",
            "特社3-I-5 遵守教室規則。",
            "特社3-I-6 在學校、家庭、社區或部落活動時，有禮貌地詢問或回應他人。",
            "特社3-I-7 在節慶或傳統祭儀時說出簡單的應景的話。",
            "特社3-I-8 在親人或他人遭逢不如意或喪事的場合，保持安靜不吵鬧。",
            "特社3-I-9 在社區或部落活動時，有禮貌地詢問或回應他人的問話。"
          ],
          "第二階段（Ⅱ）": [
            "特社3-II-1 在課堂或小組討論中適當表達與回應意見。",
            "特社3-II-2 在小組中分工合作完成自己的工作。",
            "特社3-II-3 在監督或協助下完成複雜的工作。",
            "特社3-II-4 遇到困難時，具體說明需要的協助。",
            "特社3-II-5 在知悉他人生病或受傷時，主主動報告師長並表達安慰之意。",
            "特社3-II-6 認識學校或家中不同國籍或文化的師長、同學與親友。",
            "特社3-II-7 在家庭、社區或部落情境時，主動向人問候或表達感謝。",
            "特社3-II-8 與不同國籍或文化的人進行簡單互動。"
          ],
          "第三階段（Ⅲ）": [
            "特社3-III-1 遵守不同課堂的規則。",
            "特社3-III-2 主動參與課堂或小組討論，並在小組中主動對他人提供協助。",
            "特社3-III-3 服從小組決議並完成指派的工作。",
            "特社3-III-4 在節慶或傳統祭儀遇到熟悉的人時，使用有簡單主題的方式說出應景的話。",
            "特社3-III-5 在親友或他人遭逢不如意或喪事的場合，表現出適當合宜的行為。",
            "特社3-III-6 與不同文化的鄰居進行簡單的溝通。",
            "特社3-III-7 願意陪同傷病的同學或家人到健康中心或就醫。",
            "特社3-III-8 與學校不同國籍或文化的師長、同學進行簡單的聯繫與溝通。"
          ],
          "第四階段（Ⅳ）": [
            "特社3-IV-1 能在課堂或小組討論尊重他人不同的意見。",
            "特社3-IV-2 服從指令規劃步驟完成複雜的工作。",
            "特社3-IV-3 配合老師的指令，遵守不同學習情境和器材的使用規則與安全。",
            "特社3-IV-4 在遇到困難時，依問題性質尋求特定對象或資源的協助。",
            "特社3-IV-5 願意參與學校、家庭、社區或部落的活動與聚會。",
            "特社3-IV-6 在節慶或傳統祭儀的情境時，適切地回應應景的話。",
            "特社3-IV-7 在親友遭逢不如意或喪事的場合時，主動安慰對方。",
            "特社3-IV-8 在節慶、傳統祭儀或喪事時，察覺不同文化背景，有不同的儀式或因應方式。"
          ],
          "第五階段（Ⅴ）": [
            "特社3-V-1 服從指令規劃執行工作的步驟。",
            "特社3-V-2 在執行工作過程中自我檢查、自我回饋以解決問題。",
            "特社3-V-3 在遭遇困難時，根據分析結果掌握有效資源尋求解決困難。",
            "特社3-V-4 在課堂或小組討論時，給予適當的回饋或評論。",
            "特社3-V-5 小組中能協調不同意見，盡力與他人合作爭取團隊榮譽。",
            "特社3-V-6 願意協助策劃及辦理學校活動。",
            "特社3-V-7 在親友遭逢不如意或喪事的場合時，協助處理事情，並同理不同的人有不同的自我療癒方式。",
            "特社3-V-8 在節慶或傳統祭儀時，主動愉悅地說出應景的話。",
            "特社3-V-9 與家人參與社區或部落的聚會或活動時，主動表達及協助處理事務。"
          ]
        }
      }
    ]
  },
  contents: {
    title: "學習內容",
    categories: [
      {
        name: "自我的行為與效能（特社 A）",
        stages: {
          "第一階段（Ⅰ）": ["特社A-Ⅰ-1 基本情緒的認識與分辨。", "特社A-Ⅰ-2 壓力的察覺與面對。", "特社A-Ⅰ-3 自我優弱勢的察覺。"],
          "第二階段（Ⅱ）": ["特社A-Ⅱ-1 基本情緒的表達。", "特社A-Ⅱ-2 壓力源的評估與處理。", "特社A-Ⅱ-3 自我接納與激勵。"],
          "第三階段（Ⅲ）": ["特社A-Ⅲ-1 複雜情緒的處理。", "特社A-Ⅲ-2 壓力的替代與紓解方法。", "特社A-Ⅲ-3 行為與後果之間的關係與評估。"],
          "第四階段（Ⅳ）": ["特社A-Ⅳ-1 兩難情緒的處理。", "特社A-Ⅳ-2 壓力的控制與調整。", "特社A-Ⅳ-3 問題解決的技巧。"],
          "第五階段（Ⅴ）": ["特社A-Ⅴ-1 強烈情緒的表達。", "特社A-Ⅴ-2 問題解決的外立資源。", "特社A-Ⅴ-3 正向思考的技巧。"]
        }
      },
      {
        name: "溝通與人際的互動（特社 B）",
        stages: {
          "第一階段（Ⅰ）": ["特社B-Ⅰ-1 溝通訊息的意義。", "特社B-Ⅰ-2 溝通的媒介。", "特社B-Ⅰ-3 人際關係的建立。", "特社B-Ⅰ-4 衝突的原因及情境分析。", "特社B-Ⅰ-5 性別互動的基本禮儀。"],
          "第二階段（Ⅱ）": ["特社B-Ⅱ-1 訊息解讀的技巧。", "特社B-Ⅱ-2 表達與傾聽的時機。", "特社B-Ⅱ-3 團體的基本規範。", "特社B-Ⅱ-4 衝突情境的因應。", "特社B-Ⅱ-5 危險情境的判別。"],
          "第三階段（Ⅲ）": ["特社B-Ⅲ-1 正負向訊息的判斷。", "特社B-Ⅲ-2 話題的開啟與延續。", "特社B-Ⅲ-3 自我經驗的分享。", "特社B-Ⅲ-4 自我需求與困難的表達。", "特社B-Ⅲ-5 多元性別互動與自主。"],
          "第四階段（Ⅳ）": ["特社B-Ⅳ-1 科技媒體的運用。", "特社B-Ⅳ-2 同理心的培養。", "特社B-Ⅳ-3 優勢的呈現與表達。", "特社B-Ⅳ-4 拒絕的技巧。", "特社B-Ⅳ-5 愛慕與追求的方式。"],
          "第五階段（Ⅴ）": ["特社B-Ⅴ-1 訊息真偽與詐騙的防範。", "特社B-Ⅴ-2 同理他人的技巧。", "特社B-Ⅴ-3 友誼維持的技巧。", "特社B-Ⅴ-4 協商技巧與求助資源。", "特社B-Ⅴ-5 危險預防與責任的處理。"]
        }
      },
      {
        name: "家庭與社會的參與（特社 C）",
        stages: {
          "第一階段（Ⅰ）": ["特社C-Ⅰ-1 學校規則的認識與遵守。", "特社C-Ⅰ-2 家庭成員互動的技巧。", "特社C-Ⅰ-3 社區成員互動的技巧。"],
          "第二階段（Ⅱ）": ["特社C-Ⅱ-1 學習成員之間的關懷與表達。", "特社C-Ⅱ-2 家庭成員之間的關懷與表達。", "特社C-Ⅱ-3 社區成員之間的關懷與表達。"],
          "第三階段（Ⅲ）": ["特社C-Ⅲ-1 不同學習情境變化的適應與調整。", "特社C-Ⅲ-2 不同家庭情境變化的適應與調整。", "特社C-Ⅲ-3 不同社區或部落情境變化的適應與調整。"],
          "第四階段（Ⅳ）": ["特社C-Ⅳ-1 尊重與接納學校的多元意見。", "特社C-Ⅳ-2 尊重與接納家庭的多元文化。", "特社C-Ⅳ-3 尊重與接納社區的多元文化。"],
          "第五階段（Ⅴ）": ["特社C-Ⅴ-1 學校的參與及合作。", "特社C-Ⅴ-2 家庭的參與及合作。", "特社C-Ⅴ-3 社區或部落的參與及合作。"]
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
  const [perfTab, setPerfTab] = useState({ catIdx: 0, stage: '第一階段（Ⅰ）' });
  const [contTab, setContTab] = useState({ catIdx: 0, stage: '第一階段（Ⅰ）' });

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
                  ? 'bg-blue-600 text-white' 
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
                  ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-sm' 
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
              <div className="mt-0.5 text-blue-600 flex-shrink-0">
                {selectedItems[typeKey].includes(item) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
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
      roleplay: "角色扮演對話稿",
      steps: "行為步驟提示卡",
      checklist: "自我檢核表",
      story: "社會性故事"
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
         extraInstructions = "必須提供剛好 4 筆資料，組成四格漫畫。請給出固定的主角外觀設定(characterProfile)，確保四張圖主角長相一致。";
         schemaProperties.socialStoryConfig = {
           type: "OBJECT",
           properties: {
             characterProfile: { type: "STRING", description: "主角的固定外觀與服裝設定(英文)，例如：A 10-year-old Taiwanese boy with short black hair, wearing a yellow T-shirt." },
             storyPanels: {
               type: "ARRAY",
               items: { type: "OBJECT", properties: { actionAndScene: { type: "STRING" }, text: { type: "STRING" } }, required: ["actionAndScene", "text"] }
             }
           },
           required: ["characterProfile", "storyPanels"]
         };
         requiredFields = ["socialStoryConfig"];
         break;
      }
      default:
         break;
    }

    const systemPrompt = `你是一位資深特教老師。我們正在編寫一份教材。
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

      if (sectionId === 'story' && parsedData.socialStoryConfig) {
        const charProfile = parsedData.socialStoryConfig.characterProfile || "A young student";
        let panels = parsedData.socialStoryConfig.storyPanels || [];
        if(panels.length > 4) panels = panels.slice(0, 4);
        while(panels.length < 4) {
            panels.push({ actionAndScene: "standing in a classroom", text: "..." });
        }
        
        parsedData.socialStory = panels.map(p => ({
            imagePrompt: `${charProfile}, ${p.actionAndScene}`,
            text: p.text
        }));
        
        setLessonData(prev => ({ ...prev, socialStory: parsedData.socialStory }));
        
        const updatedStories = [...parsedData.socialStory];
        for (let i = 0; i < updatedStories.length; i++) {
            try {
                const base64 = await fetchImage(updatedStories[i].imagePrompt);
                updatedStories[i].base64 = base64;
                updatedStories[i].error = false;
            } catch (e) {
                console.error("Image generation error:", e);
                updatedStories[i].error = true;
            }
            setLessonData(prev => ({ ...prev, socialStory: [...updatedStories] }));
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
      textToCopy += `角色扮演對話稿：\n${lessonData.roleplay.map(r => `【${r.role}】：「${r.line}」 (*${r.action}*)`).join('\n')}\n\n`;
    }

    if (lessonData.steps && lessonData.steps.length > 0) {
      textToCopy += `視覺化步驟提示卡：\n${lessonData.steps.map((s, i) => `步驟 ${i + 1}：${s}`).join('\n')}\n\n`;
    }

    if (lessonData.checklist && lessonData.checklist.length > 0) {
      textToCopy += `自我檢核表：\n${lessonData.checklist.map(c => `□ ${c}`).join('\n')}\n\n`;
    }

    if (lessonData.socialStory && lessonData.socialStory.length > 0) {
      textToCopy += `社會性故事：\n${lessonData.socialStory.map((s, i) => `畫面 ${i + 1}：${s.text}`).join('\n\n')}`;
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

      docChildren.push(new Paragraph({ text: "社會技巧教材", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));

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
        docChildren.push(new Paragraph({ text: "社會技巧學習單", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));
        
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
        docChildren.push(new Paragraph({ text: "角色扮演對話稿", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
        needsPageBreak = false;
        
        lessonData.roleplay.forEach(r => {
          docChildren.push(new Paragraph({
            children: [
              new TextRun({ text: `【${r.role}】 `, font: fontName, size: 24, bold: true, color: "2563EB" }),
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
        docChildren.push(new Paragraph({ text: "自我檢核表", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: needsPageBreak }));
        needsPageBreak = false;

        lessonData.checklist.forEach(c => {
          docChildren.push(new Paragraph({
            children: [new TextRun({ text: `□ ${c}`, font: fontName, size: 28, color: "333333" })],
            spacing: { before: 120, after: 120 },
            indent: { left: 360 }
          }));
        });
      }

      if (lessonData.socialStory && lessonData.socialStory.length > 0) {
        docChildren.push(new Paragraph({ text: "社會性故事", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: docChildren.length > 1 }));

        const storyRows = [];
        for (let i = 0; i < 4; i += 2) {
          const createCell = (story) => {
            if (!story) return new TableCell({ children: [] });
            const cellContent = [];
            if (story.base64) {
              cellContent.push(new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: base64ToUint8Array(story.base64),
                    transformation: { width: 250, height: 250 }
                  })
                ]
              }));
            }
            cellContent.push(new Paragraph({
              children: [new TextRun({ text: story.text, font: fontName, size: 24, color: "333333" })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 160 }
            }));

            return new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 200, bottom: 200, left: 200, right: 200 },
              verticalAlign: VerticalAlign.CENTER,
              children: cellContent
            });
          };

          storyRows.push(new TableRow({ children: [createCell(lessonData.socialStory[i]), createCell(lessonData.socialStory[i+1])] }));
        }

        const storyTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: storyRows,
          borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "CBD5E1" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
          }
        });
        docChildren.push(storyTable);
      }

      const doc = new Document({
        styles: {
            default: {
                heading1: { 
                    run: { font: fontName, size: 36, bold: true, color: "1E40AF" }, 
                    paragraph: { 
                        spacing: { before: 240, after: 180 }, 
                        border: { bottom: { color: "BFDBFE", space: 10, style: BorderStyle.SINGLE, size: 12 } } 
                    } 
                },
                heading2: { 
                    run: { font: fontName, size: 30, bold: true, color: "2563EB" }, 
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
      window.saveAs(blob, '社會技巧教案與學習單.docx');

    } catch (err) {
      console.error(err);
      alert("Word 下載發生錯誤。");
    } finally {
      setIsExporting(false);
    }
  };

  const regenerateSingleImage = async (index, imagePrompt) => {
    setLessonData(prev => {
      const newData = { ...prev };
      const updatedStories = [...newData.socialStory];
      updatedStories[index] = { ...updatedStories[index], isRegenerating: true, error: false };
      newData.socialStory = updatedStories;
      return newData;
    });

    try {
      const base64 = await fetchImage(imagePrompt);
      setLessonData(prev => {
        const newData = { ...prev };
        const updatedStories = [...newData.socialStory];
        updatedStories[index] = { ...updatedStories[index], base64: base64, isRegenerating: false, error: false };
        newData.socialStory = updatedStories;
        return newData;
      });
    } catch (error) {
      console.error("Single image generation error:", error);
      setLessonData(prev => {
        const newData = { ...prev };
        const updatedStories = [...newData.socialStory];
        updatedStories[index] = { ...updatedStories[index], isRegenerating: false, error: true };
        newData.socialStory = updatedStories;
        return newData;
      });
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

    const systemPrompt = `你是一位資深的特教老師。請根據使用者選擇的學習重點與學生現況，設計實用的教材。
必須嚴格依照要求的 JSON 格式輸出。${selectedOutputs.includes('story') ? '社會性故事必須剛好為 4 節，且 imagePrompt 必須以英文撰寫，描述皮克斯動畫風格的情境。' : ''}

【重要設計指引】
1. 核心目標優先：教學內容必須「絕對緊扣」所選的「學習表現」或「學習內容」。若使用者僅提供其中一項，請以此為核心，自行推導合適的教學脈絡。
2. 學生現況為輔（適性調整）：學生特質與現況是用來設定「教學策略、情境故事背景、難易度」（例如：若識字弱，句型應簡短；若有特定興趣，可融入情境）。
3. 易讀性原則：請盡量使用簡短、具體的語句，避免冗長抽象的說明，確保低識字學生能理解。
4. 衝突處理原則：若「學生現況」與「學習重點」看似無直接關聯，請「堅守學習重點」為這堂課的唯一主軸，僅利用學生現況來設計切入點，不可偏離主題。
${worksheetPrompt}`;

    let studentProfile = "";
    if (grade || selectedTraits.length > 0 || studentStatus.trim()) {
      if (grade) studentProfile += `年級：${grade}\n`;
      if (selectedTraits.length > 0) studentProfile += `特質：${selectedTraits.join("、")}\n`;
      if (studentStatus.trim()) studentProfile += `補充說明：${studentStatus.trim()}\n`;
    } else {
      studentProfile = "無提供特定現況，請依一般特教學生程度設計。";
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
            role: { type: "STRING", description: "角色名稱，例如：自己、同學A" },
            line: { type: "STRING", description: "簡短具體的台詞內容" },
            action: { type: "STRING", description: "動作提示，例如：深呼吸、看著對方的眼睛" }
          },
          required: ["role", "line", "action"]
        },
        description: "角色扮演對話稿，設計約 4-6 句來回的短對話供師生或同儕演練"
      };
      requiredFields.push("roleplay");
    }

    if (selectedOutputs.includes('steps')) {
      schemaProperties.steps = {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "將核心社會技巧拆解成 3~4 個具體、簡短的執行步驟 (SOP)"
      };
      requiredFields.push("steps");
    }

    if (selectedOutputs.includes('checklist')) {
      schemaProperties.checklist = {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "設計 2~3 個具體的自我檢核行為目標，讓學生在日常生活中打勾紀錄"
      };
      requiredFields.push("checklist");
    }

    if (selectedOutputs.includes('story')) {
      schemaProperties.socialStoryConfig = {
        type: "OBJECT",
        properties: {
          characterProfile: { type: "STRING", description: "主角的固定外觀與服裝設定(英文)，例如：A 10-year-old Taiwanese boy with short black hair, wearing a yellow T-shirt and blue jeans." },
          storyPanels: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                actionAndScene: { type: "STRING", description: "主角在這個畫面的動作與場景(英文)，例如：sitting at a desk looking frustrated." },
                text: { type: "STRING", description: "給學生看的故事內文" }
              },
              required: ["actionAndScene", "text"]
            },
            description: "必須提供剛好 4 筆資料，組成四格漫畫。"
          }
        },
        required: ["characterProfile", "storyPanels"]
      };
      requiredFields.push("socialStoryConfig");
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

      if (parsedData.socialStoryConfig) {
        const charProfile = parsedData.socialStoryConfig.characterProfile || "A young student";
        let panels = parsedData.socialStoryConfig.storyPanels || [];
        if(panels.length > 4) panels = panels.slice(0, 4);
        while(panels.length < 4) {
            panels.push({ actionAndScene: "standing in a classroom", text: "..." });
        }
        
        parsedData.socialStory = panels.map(p => ({
            imagePrompt: `${charProfile}, ${p.actionAndScene}`,
            text: p.text
        }));
        delete parsedData.socialStoryConfig;
      }

      setLessonData(parsedData);

      if (parsedData.socialStory) {
        const updatedStories = [...parsedData.socialStory];
        for (let i = 0; i < updatedStories.length; i++) {
            setProgressText(`正在為社會性故事繪製圖卡 (${i + 1}/${updatedStories.length})...`);
            try {
                const base64 = await fetchImage(updatedStories[i].imagePrompt);
                updatedStories[i].base64 = base64;
                updatedStories[i].error = false;
            } catch (e) {
                console.error("Image generation error:", e);
                updatedStories[i].error = true;
            }
            setLessonData(prev => ({ ...prev, socialStory: [...updatedStories] }));
            setProgress(40 + Math.round(((i + 1) / updatedStories.length) * 60));
        }
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
        placeholder={`想微調${label}嗎？請輸入指令 (例如：更簡單一點、加入捷運情境...)`}
        value={sectionPrompts[sectionId] || ''}
        onChange={(e) => setSectionPrompts(prev => ({ ...prev, [sectionId]: e.target.value }))}
        className="flex-1 w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 bg-white"
        onKeyDown={(e) => {
          if (e.key === 'Enter') regenerateSpecificContent(sectionId);
        }}
      />
      <button
        onClick={() => regenerateSpecificContent(sectionId)}
        disabled={regeneratingId === sectionId}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
      >
        {regeneratingId === sectionId ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        重新生成此區塊
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800 print:bg-white print:p-0" style={{ fontFamily: "'Chiron GoRound TC', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:space-y-0">
        
        <header className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-blue-600 print:hidden">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">社會技巧備課大師v2</h1>
            <p className="text-slate-500 text-sm mt-1">依據特教社會技巧課綱核心素養設計，自動生成教案、結構化題型學習單與皮克斯風社會故事圖卡。</p>
          </div>
        </header>

        <div className="flex flex-col gap-8 print:gap-0">
          
          <div className="space-y-6 print:hidden">
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
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
                  <Plus className="w-4 h-4 text-blue-500" />
                  3. 或輸入自訂教學主題 (若課綱未涵蓋)
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 bg-white"
                  placeholder="例如：認識捷運路線圖、如何用手機叫外送、防範網路交友詐騙..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>

              <div className="mt-5 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-xs text-blue-500 font-bold mb-1">學習表現</div>
                  <div className="text-lg font-bold text-blue-700">
                    {selectedItems.performances.length} <span className="text-sm text-blue-400">/ 3</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-blue-200"></div>
                <div className="text-center">
                  <div className="text-xs text-blue-500 font-bold mb-1">學習內容</div>
                  <div className="text-lg font-bold text-blue-700">
                    {selectedItems.contents.length} <span className="text-sm text-blue-400">/ 3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  步驟二：填寫學生現況 (選填)
                </h2>
                <button
                  onClick={() => {
                      setGrade("國中八年級");
                      setSelectedTraits(["口語表達佳", "難以察覺他人情緒", "人際衝突多"]);
                      setStudentStatus("容易在別人開玩笑時當真而生氣，進而引發人際衝突。在團體討論時，也常堅持己見。希望他能學習分辨正向與負向的情緒，並學習在衝突情境中適當表達與協商。");
                  }}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  匯入範例
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">年級</label>
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 bg-white"
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
                            ? 'bg-blue-100 border-blue-300 text-blue-700' 
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
                    className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm text-slate-700"
                    placeholder="例如：特定的人際衝突事件、感興趣的事物(可用於增強)、識字能力狀況..."
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-indigo-500" />
                步驟三：選擇產出內容
              </h2>
              <div className="columns-1 md:columns-2 gap-4">
                {outputOptionsList.map(opt => (
                  <div key={opt.id} className="flex flex-col gap-2 break-inside-avoid mb-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${selectedOutputs.includes(opt.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="mt-0.5 text-blue-600 flex-shrink-0">
                          {selectedOutputs.includes(opt.id) ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${selectedOutputs.includes(opt.id) ? 'text-blue-800' : 'text-slate-700'}`}>
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
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
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
                                  <span className="text-sm font-bold w-4 text-center text-blue-600">{worksheetCounts[subOpt.id]}</span>
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
                                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 bg-white"
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
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2"
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
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已複製' : '複製文字'}
                    </button>
                    <button 
                      onClick={exportToWord}
                      disabled={isExporting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 text-white transition-colors shadow-sm disabled:opacity-50"
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
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6" />
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-3 border border-slate-200 overflow-hidden shadow-inner">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute top-0 left-0 bottom-0 w-full bg-white/20 animate-[translate_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <span className="font-medium text-slate-600">{progressText}</span>
                      <span className="font-bold text-blue-600">{progress}%</span>
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
                        <h1 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">社會技巧教案</h1>
                        
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-blue-600 mb-2">教學目標</h2>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                            {lessonData.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                          </ul>
                        </div>

                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-blue-600 mb-2">教學準備</h2>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                            {lessonData.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                          </ul>
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-blue-600 mb-2">教學流程</h2>
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-purple-200 pb-4 gap-4">
                          <h1 className="text-2xl font-bold text-purple-800">課程簡報大綱</h1>
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
                            <div key={i} className="bg-white border border-purple-100 rounded-xl p-5 shadow-sm print-avoid-break">
                              <div className="flex items-center gap-3 mb-3 border-b border-purple-50 pb-3">
                                <span className="bg-purple-100 text-purple-700 text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-purple-200">
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-blue-200 pb-4 gap-4">
                            <h1 className="text-2xl font-bold text-blue-800 text-center flex-1">社會技巧學習單</h1>
                            <div className="flex gap-2 print:hidden w-full md:w-auto">
                              <button
                                onClick={() => {
                                  // 準備學習單文字內容
                                  let worksheetText = "";
                                  
                                  // 1. 動態加入 Prompt (咒語) 前綴
                                  worksheetText += `請幫我美化並排版以下這份特教生「社會技巧」學習單，給我圖片。請注意以下需求：\n\n`;
                                  worksheetText += `【目標學生背景】\n`;
                                  if (grade) {
                                      worksheetText += `- 年級/階段：${grade}\n`;
                                      worksheetText += `  *(請確保排版、用語難度、插圖風格或情境描述，要符合「${grade}」學生的年齡心智發展。例如國中生不要用太幼兒的語氣。)*\n`;
                                  } else {
                                      worksheetText += `- 年級/階段：未指定 (請依一般特教學生程度，使用清晰、具體、簡明的用語。)\n`;
                                  }
                                  
                                  if (selectedTraits.length > 0) {
                                      worksheetText += `- 學生特質：${selectedTraits.join("、")}\n`;
                                  }
                                  
                                  worksheetText += `\n【排版與設計要求】\n`;
                                  worksheetText += `1. 請維持原有的題型與題數不變。\n`;
                                  worksheetText += `2. 版面必須「高度結構化」，留白要夠，字體大小適中，減輕特教生視覺負擔。\n`;
                                  worksheetText += `3. **請為每個題目或情境提供合適的圖片**\n`;
                                  worksheetText += `4. 可適度加入符合上述學生背景的 Emoji 或簡單符號作為視覺提示。\n`;
                                  worksheetText += `5. 請直接輸出圖片。\n\n`;
                                  worksheetText += `-------------------\n\n`;
                                  worksheetText += `【原始學習單內容】\n\n`;

                                  // 2. 加入原始學習單題目
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
                                  
                                  // 3. 複製到剪貼簿並開啟新分頁
                                  fallbackCopyTextToClipboard(worksheetText);
                                  alert("已將包含背景設定的學習單內容與 Prompt 複製到剪貼簿！即將為您開啟 ChatGPT...");
                                  window.open("https://chatgpt.com/g/g-6a1a588150d881918a2a7dc8f67ae06b-xue-xi-dan-mei-hua-zhu-shou", "_blank");
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
                                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-2 py-1 rounded whitespace-nowrap">
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
                                                  <span className="text-blue-500 mt-0.5">•</span> 
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
                        <h1 className="text-2xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2 text-center">實作：角色扮演對話稿</h1>
                        <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
                          <div className="space-y-4">
                            {lessonData.roleplay.map((r, i) => (
                              <div key={i} className="flex flex-col print-avoid-break">
                                <span className="text-indigo-800 font-bold text-base bg-indigo-50 self-start px-3 py-1 rounded mb-1">{r.role}</span>
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
                        <h1 className="text-2xl font-bold text-emerald-800 mb-6 border-b-2 border-emerald-200 pb-2 text-center">類化：行為步驟提示卡</h1>
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
                        <h1 className="text-2xl font-bold text-amber-800 mb-6 border-b-2 border-amber-200 pb-2 text-center">追蹤：課後自我檢核表</h1>
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

                    {lessonData.socialStory && lessonData.socialStory.length > 0 && (
                      <section className="relative result-section">
                        <div className="page-divider relative text-center mb-10 mt-2 print:hidden">
                          <hr className="border-t-2 border-dashed border-slate-300" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">
                            ✂ 列印與匯出時自動獨立一頁
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2 text-center">社會性故事</h1>
                        <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-xl bg-slate-100 print:border-0 print:bg-transparent print:p-0">
                          {lessonData.socialStory.map((story, i) => (
                            <div key={i} className="flex flex-col items-center justify-start p-4 bg-white border border-slate-200 rounded-lg shadow-sm print-avoid-break">
                              <div className="w-full aspect-square bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-slate-200 relative group">
                                  
                                  {story.isRegenerating && (
                                      <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center text-blue-500 backdrop-blur-sm">
                                          <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                                          <span className="text-sm font-bold">重新繪製中...</span>
                                      </div>
                                  )}

                                  {story.imagePrompt && !story.isRegenerating && (
                                      <button
                                          onClick={() => regenerateSingleImage(i, story.imagePrompt)}
                                          className={`absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-md border border-slate-200 transition-opacity z-10 print:hidden ${
                                              story.error ? 'opacity-100 ring-2 ring-red-400' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                                          }`}
                                          title="重新生成這張圖片"
                                      >
                                          <RefreshCw className="w-4 h-4" />
                                      </button>
                                  )}

                                  {story.base64 && !story.isRegenerating ? (
                                      <img src={`data:image/png;base64,${story.base64}`} alt="故事畫面" className="w-full h-full object-cover" />
                                  ) : story.error && !story.isRegenerating ? (
                                      <div className="flex flex-col items-center text-slate-400">
                                          <ImageIcon className="w-8 h-8 mb-2 text-red-400" />
                                          <span className="text-sm font-medium text-red-500">圖片生成失敗</span>
                                          <span className="text-xs mt-1 text-slate-400 text-center px-2">可點擊右上角重試</span>
                                      </div>
                                  ) : !story.isRegenerating ? (
                                      <div className="flex flex-col items-center text-slate-400">
                                          <ImageIcon className="w-8 h-8 mb-2 animate-pulse" />
                                          <span className="text-sm">繪製圖片中...</span>
                                      </div>
                                  ) : null}
                              </div>
                              <p className="text-slate-700 text-center font-medium">{story.text}</p>
                            </div>
                          ))}
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