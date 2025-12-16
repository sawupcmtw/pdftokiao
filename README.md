# What we need to do

建立一個封裝可以 parse material.

It will available take input:

- material's PDF(currently will download from URL)
- specific PDF pages(e.g. `[1]` for single page, `[1, 3]` for multiple pages that represent from page 1 to page 3)
- instruction text
- files:
  - pdf: attachment of material's PDF for completion of the content.
  - image(jpg, png): explain special case about points that need to be care while parse material page/question.
      

And it's output should fit [import api body](./IMPORT_API.md)

**Current Goal**:

Support single_select, multi_select, fill_in, short_answer only

## Tech Stack

1. Nodejs
2. Output constraint: [zod](https://zod.dev/llms.txt)
3. AI SDK: [AI SDK](https://ai-sdk.dev/llms.txt)
4. Model: Gemini. I have API key.
5. Conversation cache: LRU Cache
