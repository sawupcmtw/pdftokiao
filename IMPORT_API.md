1. 建立適當的教材結構（各單元裡放符合限制、適量的內容）
2. 目前限制如下：
   1. 題目
      1. 題目的 text 欄位允許簡單的 HTML tag 如 p, br, u, b, i 等，但必須自行加上適當的 p 或 br 換行
      2. 所有題目（Question）都必須放在題目群組（QuestionGroup）裡，即使是題目彼此無相關，數量建議不多於 10 題
      3. EMI 類型 (如：配合題) 的 QuestionGroup，因為選項會在 QuestionGroup 內的題目之間共用，因此不得與其他類型的題目共用 QuestionGroup
      4. 請避免對 EMI 配合題的「選項」寫翻譯/解析，應該寫在題目的翻譯/解析欄位，呈現較為適合
      5. 無法自訂各小題的配分（如第 1, 2 小題答對得 1 分，第 3 題答對得 2 分）
   2. 字卡堆
      1. 一個字卡堆的字卡上限數量為 200 張，但根據經驗，50 左右的體驗最好
      2. 可使用的詞性如下： n / n[C] / n[U] / adj / v / vi / vt / adv / prep / phrase / conj / aux / int / pron / det / art / abbr

▼取得內容範例如下
但以下介紹的 import 只接受 type=“component”）
{
 "material": {
   "id": 198,
   "name": "普高英文第一冊參考書"
 },
 "toc": {
   "id": 4435,
   "type": "root",
   "name": "root",
   "import_key": null,
   "children": [
     {
       "id": 4436,
       "type": "chapter", // <= 此 chapter/section 的結構跟與後台一致
       "name": "Unit 1",
       "import_key": "cc752f19-eea0-400f-ae03-d4df9f66a498", // <= 章節的 import_key，這次尚不會使用到
       "children": [
         {
           "id": 4438,
           "type": "section", // <= 此 chapter/section 的結構跟與後台一致
           "name": "Section 1",
           "import_key": "25907069-def1-49d2-b6e6-f6e72e532f01",
           "children": [
             {
               "id": 24891,
               "type": "component",
               "composable_type": "article",
               "name": "課文",
               "import_key": "d8adfbde-15ac-4524-83ed-5df70a741f71", // <= 用來匯入的 import_key
               "previewable": false
             },
             {
               "id": 26101,
               "type": "component",
               "composable_type": "deck",
               "name": "重點單字",
               "import_key": "5399749e-a567-4d84-821a-4b0dd74d5621",
               "previewable": false
             },
             {
               "id": 24904,
               "type": "component",
               "composable_type": "question_group",
               "name": "小試身手",
               "import_key": "6ee160fc-6b84-4d7f-b366-204b586ff047",
               "previewable": false
             },
             {
               // ...
             }
           ]
         }
       ]
     },
     {
       // ...
     }
   ]
 },
 "meta": {
   "version": "1.0.0"
 }
}


文章 Article 類型

```json
{
 "data": {
   "type": "article",
   "attributes": {
     "material_id": "198",
     "import_key": "25907069-def1-49d2-b6e6-f6e72e532f01",
      "audio_urls": ["https://example.com/audio.mp3"],
     "html": "<h1 class=\"p1\">title</h1><p>article<br />content</p>"
   }
 }
}
```

題目：單選題 Single-select

```json
{
 "data": {
   "type": "question_group",
   "attributes": {
     "material_id": 172,
     "import_key": "89bab3c9-48a3-48c7-affa-f20c49d39e3e"
   },
   "questions": [
     {
       "attributes": {
         "position": 1,
         "assessment_form": "single_select",
          "blank_identifier": "1", // 搭配題目裡有挖空+編號（像是 ___1___）的題型提供，若不是那種題型則不需要填
         "text": "<p>This is question stem.</p>",
         "latex": null, // 若無，可以忽略 attribute
         "audio_urls": { "default": "https://example.com/audio.mp3" }, // 新增音檔網址
         "image_url": "https://example.com/image.png", // 新增圖片網址
         "answer": [
           [
             "B"
           ]
         ],
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>這是一題單選題的題目解析</p>",
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       },
       "options": [
         {
           "attributes": {
             "symbol": "A",
             "text": "Apple",
             "latex": null,
             "audio_urls": { "default": "https://example.com/audio.mp3" },
             "image_url": "https://example.com/image.png"
           },
           "explanation": {
             "attributes": {
               "note": "",
               "translation": "蘋果",
               "vocabs_note": null
             }
           }
         },
         {
           "attributes": {
             "symbol": "B",
             "text": "Banana",
             "latex": null,
             "audio_url": null,
             "audio_urls": null,
             "image_url": null
           },
           "explanation": {
             "attributes": {
               "note": "",
               "translation": "香蕉",
               "vocabs_note": null
             }
           }
         },
         {
           "attributes": {
             "symbol": "C",
             "text": "Blueberry",
             "latex": null,
             "audio_url": null,
             "audio_urls": null,
             "image_url": null
           },
           "explanation": {
             "attributes": {
               "note": "",
               "translation": "藍莓",
               "vocabs_note": null
             }
           }
         }
       ]
     },
      {
        // ...
      }
   ]
 }
}
```


題目：複選題 Multi-select

```json
{
 "data": {
   "type": "question_group",
   "attributes": {
     "material_id": 172,
     "import_key": "9f70952c-3b71-46a0-94d7-a523b8ea9b73"
   },
   "questions": [
     {
       "attributes": {
         "position": 1,
         "assessment_form": "multi_select", // <= 跟單選題的主要差異
          "blank_identifier": "1",
         "text": "<p>This is question stem.</p>",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null,
         "answer": [
           [
             "B",
             "C" // <= 跟單選題的主要差異
           ]
         ],
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>這是一題單選題的題目解析</p>",
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       },
       "options": [
         {
           "attributes": {
             "symbol": "A",
             "text": "Apple",
             "latex": null,
             "audio_url": null,
             "audio_urls": null,
             "image_url": null
           },
           "explanation": {
             "attributes": {
               "note": "",
               "translation": "蘋果",
               "vocabs_note": null
             }
           }
         },
         {
           "attributes": {
             "symbol": "B",
             "text": "Banana",
             "latex": null,
             "audio_url": null,
             "audio_urls": null,
             "image_url": null
           },
           "explanation": {
             "attributes": {
               "note": "",
               "translation": "香蕉",
               "vocabs_note": null
             }
           }
         },
         {
           "attributes": {
             "symbol": "C",
             "text": "Blueberry",
             "latex": null,
             "audio_url": null,
             "audio_urls": null,
             "image_url": null
           },
           "explanation": {
             "attributes": {
               "note": "",
               "translation": "藍莓",
               "vocabs_note": null
             }
           }
         }
       ]
     },
      {
        // ...
      }
   ]
 }
}
```


題目：填充 Fill-in

```json
{
 "data": {
   "type": "question_group",
   "attributes": {
     "material_id": 172,
     "import_key": "9f70952c-3b71-46a0-94d7-a523b8ea9b73"
   },
   "questions": [
     {
       "attributes": {
         "position": 1,
         "assessment_form": "fill_in", // <= 跟單選題的主要差異
         "text": "<p>This __ the question stem.</p>",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null,
         "answer": [
           [
             "is" // <= 跟單選題的主要差異
           ]
         ],
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>這是一題單選題的題目解析</p>",
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       }
     },
      {
        // ...
      }
   ]
 }
}
```

多格、多種可能答案的狀況（同樣原則也適用於選擇題）

```json
{
 "data": {
   "type": "question_group",
   "attributes": {
     "material_id": 172,
     "import_key": "9f70952c-3b71-46a0-94d7-a523b8ea9b73"
   },
   "questions": [
     {
       "attributes": {
         "position": 1,
         "assessment_form": "fill_in",
         "text": "<p>The quick brown fox _____ over the lazy ___.</p>",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null,
         "answer": [ // <= 注意 array of array 的結構
           [
             "jumps"
           ],
            [
             "dog",
              "cat"
           ],
         ],
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>正確答案是: The quick brown fox jumps over the lazy dog/cat.</p>",
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       }
     },
      {
        // ...
      }
   ]
 }
}
```


題目：簡答題 Short answer

此種題型類似填充，但有幾個不同特性：
1. 沒有標準答案
2. 學生交卷不會自動批改，必須有教師透過後台批改
3. 介面上填寫的欄位較大

```
{
 "data": {
   "type": "question_group",
   "attributes": {
     "material_id": 172,
     "import_key": "9f70952c-3b71-46a0-94d7-a523b8ea9b73"
   },
   "questions": [
     {
       "attributes": {
         "position": 1,
         "assessment_form": "short_answer", // <= 跟填充題的主要差異
         "text": "<p>This __ the question stem.</p>",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null,
         "answer": [[]], // <= 跟填充題的主要差異，因為沒有標準答案，答案留空的 array of array
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>這是參考解答</p>", // <= 因為沒有標準答案，參考答案應該透過解析欄位提供
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       }
     },
      {
        // ...
      }
   ]
 }
}
```


題目：配合題 Extended Matching Items (EMI) single-select

```json
{
 "data": {
   "type": "question_group",
   "attributes": {
     "material_id": 172,
     "text": "This is reading passage",
      "audio_urls": { "default": "https://example.com/audio.mp3" },
     "image_url": "https://example.com/image.png",
     "import_key": "9f70952c-3b71-46a0-94d7-a523b8ea9b73"
   },
   "explanation": {
     "attributes": {
       "note": "<p>這是整個題組的解說</p>",
       "translation": "<p>這是文章本身的翻譯</p>"
     }
   },
   "options": [ // <= options 放在 question_group 的階層
     {
       "attributes": {
         "symbol": "A",
         "text": "Apple",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null
       },
       "explanation": {
         "attributes": {
           "note": "",
           "translation": "蘋果",
           "vocabs_note": null
         }
       }
     },
     {
       "attributes": {
         "symbol": "B",
         "text": "Banana",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null
       },
       "explanation": {
         "attributes": {
           "note": "",
           "translation": "香蕉",
           "vocabs_note": null
         }
       }
     },
     {
       "attributes": {
         "symbol": "C",
         "text": "Blueberry",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null
       },
       "explanation": {
         "attributes": {
           "note": "",
           "translation": "藍莓",
           "vocabs_note": null
         }
       }
     }
   ],
   "questions": [
     {
       "attributes": {
         "position": 1,
         "assessment_form": "emi_single_select",  // <= 指定為 emi_single_select
         "text": "<p>This is question stem.</p>",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null,
         "answer": [
           [
             "B"  // <= 這裡的選項代號，參考到位於 question_group 階層的選項
           ]
         ],
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>這是一題單選題的題目解析</p>",
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       }
     },
     {
       "attributes": {
         "position": 1,
         "assessment_form": "emi_single_select",
         "text": "<p>This is question stem.</p>",
         "latex": null,
         "audio_url": null,
         "audio_urls": null,
         "image_url": null,
         "answer": [
           [
             "C"
           ]
         ],
         "custom": null
       },
       "meta": {},
       "explanation": {
         "attributes": {
           "note": "<p>這是一題單選題的題目解析</p>",
           "translation": "<p>這是題目翻譯</p>",
           "vocabs_note": null
         }
       }
     }
   ]
 }
}
```

------------------------

字卡堆 Deck

```json
{
 "type": "deck",
 "attributes": {
   "name": "字卡集",
   "description": "",
   "last_review_time": null,
   "removed_card_ids": [

   ],
   "ref_deck_id": null,
   "is_referenced": true,
   "discarded_at": null,
   "starred_card_ids": [

   ],
   "familiarity": null,
   "previewable": false,
   "study_due_on": null,
   "position": 1,
   "mastered_cards_count": 0,
   "is_default": false,
   "import_key": "b7387d5f-603a-4abf-959a-42c7e6e91765"
 },
 "cards": [
   {
     "attributes": {
       "word": "read",
       "text_content": {
         "explanations": [
           {
             "translations": [
               "to look at words or symbols and understand what they mean",
               "閱讀；看懂；讀到"
             ],
             "sentences": [
               "It was too dark to read our map and we took a wrong turning.",
               "天太黑看不清地圖，所以我們轉錯了彎。"
             ],
             "synonyms": [

             ],
             "antonyms": [

             ],
             "similars": [

             ],
             "word_types": [
               "v"
             ]
           }
         ]
       },
       "tags": [

       ],
       "word_root": null,
       "notes": [

       ]
     }
   },
   {
     "attributes": {
       "word": "book",
       "text_content": {
         "explanations": [
           {
             "translations": [
               "(紙版或電子版的)書",
               "a written text that can be published in printed or electronic form"
             ],
             "sentences": [
               "Have you read any good books recently?",
               "你最近讀到了什麼好書嗎？"
             ],
             "synonyms": [

             ],
             "antonyms": [

             ],
             "similars": [

             ],
             "word_types": [
               "n"
             ]
           },
           {
             "translations": [
               "預訂；預約",
               "to arrange to have a seat, room, performer, etc. at a particular time in the future"
             ],
             "synonyms": [

             ],
             "antonyms": [

             ],
             "similars": [

             ],
             "word_types": [
               "v"
             ],
             "notes": [
               "[片語動詞] book in/book into somewhere"
             ]
           }
         ]
       },
       "tags": [

       ],
       "word_root": null,
       "notes": [

       ]
     }
   }
 ]
}
```
