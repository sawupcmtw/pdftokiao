# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm build          # Compile TypeScript to dist/
pnpm dev            # Watch mode compilation
pnpm test           # Run vitest tests
pnpm test:watch     # Run tests in watch mode
pnpm lint           # Run ESLint
pnpm format         # Format with Prettier
```

## CLI Usage

After building, the CLI is available at `./dist/cli/index.js`:

```bash
node dist/cli/index.js test --list              # List test cases in test_files/
node dist/cli/index.js test <name>              # View test case info
node dist/cli/index.js test <name> --run        # Run parser on test case
node dist/cli/index.js parse --pdf file.pdf --pages 1-5 --hints hint1.png
```

## Architecture

### Pipeline Flow

The PDF parsing pipeline (defined in `src/trigger/orchestrator.task.ts`) follows this sequence:

1. **Load files** - PDF and hint images via loaders (`src/core/loader/`)
2. **Tag hints** - `tagHints()` analyzes hint images to detect question types (single_select, multi_select, fill_in, short_answer, emi_single_select, deck)
3. **Analyze pages** - `analyzePages()` maps PDF pages to questions using hint context, assigns `crossId` and `groupId`
4. **Group questions** - Questions are grouped by `groupId`, then by `crossId` within each group
5. **Parse questions** - Type-specific parsers extract question data in parallel (per group)
6. **Enrich answers** - `enrichAnswers()` extracts answers/explanations from SUPP PDFs (per group)
7. **Build output** - Results compiled into multiple `QuestionGroup` JSON objects matching the Kiao import API format

**Note**: PDF-to-image extraction (`extractPages`) is not yet implemented - needs a library like pdf-to-png-converter.

### AI Integration

All AI calls go through `src/core/ai/gemini-client.ts`:

- Uses `generateStructured()` with Zod schemas for type-safe structured output
- Model: `gemini-3-pro-preview` by default
- Automatic retry with exponential backoff (3 attempts)
- LRU cache for responses (`src/core/cache/`)

### Zod Schemas

All data structures use Zod schemas (`src/core/schemas/`):

- `QuestionGroup` - Final output format for Kiao import API
- Question types: `SingleSelectQuestion`, `MultiSelectQuestion`, `FillInQuestion`, `ShortAnswerQuestion`, `EMISingleSelectQuestion`
- `Deck` - Vocabulary flashcard format with `Card` items
- Each question has `attributes`, optional `explanation`, and `options` (for select types)
- EMI questions share options at the QuestionGroup level

### Question Grouping

The page analyzer assigns two IDs to each detected item:

- **`crossId`** - Links pages of the same question (for multi-page questions)
- **`groupId`** - Separates independent question sets into different `QuestionGroup` outputs

**Grouping Rules (AI-determined):**

Questions belong to the **same group** if they:
- Share a common reading passage or context
- Are part of the same EMI question set (with shared options)
- Appear under the same section header
- Are clearly meant to be answered together

Questions belong to **different groups** if they:
- Have different section headers (e.g., "Part A", "Part B", "Section 1")
- Have separate reading passages or contexts
- Are clearly independent question sets

**Output Format:**

```json
[
  { "data": { "type": "question_group", "questions": [...] } },
  { "data": { "type": "question_group", "questions": [...] } },
  { "data": { "type": "deck", ... } }
]
```

**Position Numbering:** Global positions across all groups (1, 2, 3...) for SUPP PDF compatibility.

**EMI Constraint:** EMI questions with shared options must stay in the same group.

### Test Files Structure

Test cases live in `test_files/` with this structure:

```
test_files/<name>/
├── CONTENT-[1].pdf      # Required: PDF with page range in filename
├── INST.txt             # Optional: parsing instructions
├── IMAGE-*.jpg|png      # Optional: hint images
└── SUPP-*.pdf           # Optional: supplementary PDFs (answers/explanations)
```

Page range formats: `[1]` for single page, `[1,5]` for pages 1-5.

### Supplementary PDFs (SUPP)

SUPP files provide answer keys, explanations, and vocabulary notes to enrich parsed questions. Processing is handled by `src/trigger/answer-enricher.task.ts`.

**Naming Convention:**

| Format                     | Example                     | Description              |
| -------------------------- | --------------------------- | ------------------------ |
| `SUPP-all.pdf`             | `SUPP-all.pdf`              | Applies to all questions |
| `SUPP-pages-X.pdf`         | `SUPP-pages-5.pdf`          | Single page scope        |
| `SUPP-pages-X-Y.pdf`       | `SUPP-pages-1-5.pdf`        | Page range scope         |
| `SUPP-type-TYPE.pdf`       | `SUPP-type-emi_single_select.pdf` | Question type scope |
| `SUPP-questions-X,Y,Z.pdf` | `SUPP-questions-1,5,10.pdf` | Specific questions       |

**Supported Types:** `single_select`, `multi_select`, `fill_in`, `short_answer`, `emi_single_select`

**Enrichment Fields:**

- `answer` - Correct answer(s)
- `explanation.note` - Detailed explanation
- `explanation.translation` - Translation (for language questions)
- `explanation.vocabs_note` - Vocabulary notes

### Deck Pipeline

For vocabulary/flashcard content, use the separate deck pipeline (`src/trigger/deck-orchestrator.task.ts`):

1. **Load PDF** - PDF file via loader
2. **Parse vocabulary** - `parseDeck()` extracts vocabulary cards with definitions, examples, synonyms
3. **Build deck** - Results compiled into `Deck` JSON matching the Kiao import API format

**Deck Card Structure:**

- `word` - The vocabulary word
- `text_content.explanations[]` - Array of definitions with:
  - `translations` - Word meanings
  - `sentences` - Example sentences
  - `synonyms`, `antonyms`, `similars` - Related words
  - `word_types` - Part of speech (n, v, adj, adv, etc.)

**Allowed Word Types:** `n`, `n[C]`, `n[U]`, `adj`, `v`, `vi`, `vt`, `adv`, `prep`, `phrase`, `conj`, `aux`, `int`, `pron`, `det`, `art`, `abbr`
