## Tech Stack

1. Nodejs
2. Output constraint: [zod](https://zod.dev/llms.txt)
3. AI SDK: [AI SDK](https://ai-sdk.dev/llms.txt)
4. Model: Gemini. I have API key.
5. Conversation cache: LRU Cache

## Test Files Structure

Organize test cases in `test_files/` folders. Page range is specified in the PDF filename:

```
test_files/
├── example/                      # Test case folder (any name)
│   ├── CONTENT-[1].pdf           # Required: PDF with page range
│   ├── INST.txt                  # Optional: Instructions
│   ├── IMAGE-*.jpg|png           # Optional: Hint images
│   └── SUPP-all.pdf              # Optional: Answer key
│
└── exam/
    ├── CONTENT-[3,7].pdf         # Pages 3-7
    └── SUPP-pages-3-7.pdf        # Answers for pages 3-7
```

### File Requirements

| File                  | Required | Description                                                             |
| --------------------- | -------- | ----------------------------------------------------------------------- |
| `CONTENT-[pages].pdf` | Yes      | PDF file with page range (e.g., `CONTENT-[1].pdf`, `CONTENT-[1,5].pdf`) |
| `INST.txt`            | No       | Plain text parsing instructions                                         |
| `IMAGE-*.jpg\|png`    | No       | Hint images (e.g., `IMAGE-1.jpg`)                                       |
| `SUPP-*.pdf`          | No       | Supplementary PDFs with answers/explanations                            |

### Supplementary PDFs (SUPP)

SUPP files enrich parsed questions with answer keys, explanations, and vocabulary notes.

**Naming formats:**

- `SUPP-all.pdf` - Applies to all questions
- `SUPP-pages-X.pdf` or `SUPP-pages-X-Y.pdf` - Page scope
- `SUPP-type-TYPE.pdf` - Question type scope (`single_select`, `multi_select`, `fill_in`, `short_answer`)
- `SUPP-questions-X,Y,Z.pdf` - Specific question numbers

### CLI Commands

Or using `node ./dist/cli/index.js [command]`

```bash
pdftokiao test --list         # List all test cases
pdftokiao test example        # View test case info
pdftokiao test example --run  # Run parser
```
