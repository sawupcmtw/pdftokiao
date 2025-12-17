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
2. **Tag hints** - `tagHints()` analyzes hint images to detect question types (single_select, multi_select, fill_in, short_answer)
3. **Analyze pages** - `analyzePages()` maps PDF pages to questions using hint context
4. **Parse questions** - Type-specific parsers extract question data in parallel
5. **Merge output** - Results compiled into `QuestionGroup` JSON matching the Kiao import API format

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
- Question types: `SingleSelectQuestion`, `MultiSelectQuestion`, `FillInQuestion`, `ShortAnswerQuestion`
- Each question has `attributes`, optional `explanation`, and `options` (for select types)

### Test Files Structure

Test cases live in `test_files/` with this structure:
```
test_files/<name>/
├── CONTENT-[1].pdf      # Required: PDF with page range in filename
├── INST.txt             # Optional: parsing instructions
└── IMAGE-*.jpg|png      # Optional: hint images
```

Page range formats: `[1]` for single page, `[1,5]` for pages 1-5.
