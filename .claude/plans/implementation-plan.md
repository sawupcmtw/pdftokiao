# PDF to Kiao Implementation Plan

## Overview

Build a Node.js library + CLI tool to parse educational material PDFs using a multi-agent architecture. Outputs structured question data compatible with the Kiao import API. Designed for future migration to NestJS.

**Task Orchestration**: [Trigger.dev](https://trigger.dev) for managing agent tasks, parallel execution, and job queuing.

## Multi-Agent Pipeline

```
                    ┌─────────────────────────┐
                    │  User Input             │
                    │  - PDF pages (Buffer)   │
                    │  - Hint images (Buffer) │
                    │  - Page range [1, 3]    │
                    │  - Instruction text     │
                    └───────────┬─────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│  AGENT 1: Hint Image Tagger                                       │
│  Input: Hint images (user-provided)                               │
│  Output: Tagged hints with question type + description            │
│  Example: { type: 'single_select', description: 'circle answer'}  │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│  AGENT 2: Page Analyzer                                           │
│  Input: PDF pages + Tagged hints                                  │
│  Output: Page-question mapping with crossId for multi-page        │
│  Example:                                                         │
│  [                                                                │
│    { page: 1, included: [                                         │
│        { type: 'single_select', description: '...' },             │
│        { type: 'multi_select', crossId: 1 }                       │
│    ]},                                                            │
│    { page: 2, included: [                                         │
│        { type: 'multi_select', crossId: 1 }                       │
│    ]}                                                             │
│  ]                                                                │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│  DISPATCHER: Group by type + crossId                              │
│  - Group all single_select on page 1 → dispatch to Agent 3a      │
│  - Group multi_select crossId:1 (pages 1,2) → dispatch to Agent 3b│
└───────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ AGENT 3a:         │ │ AGENT 3b:         │ │ AGENT 3c:         │
│ Single Select     │ │ Multi Select      │ │ Fill In           │
│ Parser            │ │ Parser            │ │ Parser            │
│                   │ │                   │ │                   │
│ Output: JSON file │ │ Output: JSON file │ │ Output: JSON file │
└─────────┬─────────┘ └─────────┬─────────┘ └─────────┬─────────┘
          │                     │                     │
          └──────────┬──────────┴──────────┬──────────┘
                     ▼
        ┌────────────────────────┐
        │  MERGE (no agent)      │
        │  Combine all JSON      │
        │  files into final      │
        │  question_group        │
        └────────────────────────┘
                     │
                     ▼
              Final Output JSON
```

## Architecture

```
src/
├── trigger/                   # Trigger.dev tasks
│   ├── hint-tagger.task.ts    # Agent 1: Tag hint images
│   ├── page-analyzer.task.ts  # Agent 2: Analyze pages → question map
│   ├── parsers/               # Agent 3: Question type parsers
│   │   ├── single-select.task.ts
│   │   ├── multi-select.task.ts
│   │   ├── fill-in.task.ts
│   │   └── short-answer.task.ts
│   ├── orchestrator.task.ts   # Main pipeline orchestrator
│   └── index.ts
├── core/                      # Core library (NestJS-ready)
│   ├── loader/
│   │   ├── pdf-loader.ts      # Load PDF from file path → Buffer
│   │   ├── image-loader.ts    # Load images from file path → Buffer
│   │   └── index.ts
│   ├── ai/
│   │   ├── gemini-client.ts   # Gemini via AI SDK
│   │   └── index.ts
│   ├── merger/
│   │   └── output-merger.ts   # Merge agent outputs (no AI)
│   ├── cache/
│   │   └── response-cache.ts  # LRU cache for AI responses
│   ├── schemas/
│   │   ├── input.schema.ts    # Zod: input validation
│   │   ├── hint.schema.ts     # Zod: hint tagger output
│   │   ├── page-map.schema.ts # Zod: page analyzer output
│   │   ├── question.schema.ts # Zod: parser outputs
│   │   └── output.schema.ts   # Zod: final import API format
│   └── index.ts
├── cli/
│   ├── index.ts               # CLI entry point
│   └── commands/
│       └── parse.ts           # Parse command (triggers orchestrator)
├── types/
│   └── index.ts
└── index.ts
```

## Trigger.dev Task Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  orchestrator.task.ts (Main Pipeline)                           │
│                                                                 │
│  1. Receive input (pdf, pages, hints, instruction)              │
│  2. trigger hintTaggerTask → wait for result                    │
│  3. trigger pageAnalyzerTask → wait for result                  │
│  4. Group by type + crossId                                     │
│  5. batchTrigger parser tasks (parallel)                        │
│     - singleSelectTask × N                                      │
│     - multiSelectTask × N                                       │
│     - fillInTask × N                                            │
│     - shortAnswerTask × N                                       │
│  6. Wait for all parser tasks                                   │
│  7. Merge outputs → write final JSON files                      │
└─────────────────────────────────────────────────────────────────┘
```

### Task Definitions

```ts
// src/trigger/orchestrator.task.ts
import { task } from "@trigger.dev/sdk/v3";
import { hintTaggerTask } from "./hint-tagger.task";
import { pageAnalyzerTask } from "./page-analyzer.task";
import { singleSelectTask, multiSelectTask, fillInTask, shortAnswerTask } from "./parsers";

export const orchestratorTask = task({
  id: "orchestrator",
  run: async (payload: ParseInput) => {
    // 1. Tag hints
    const hints = await hintTaggerTask.triggerAndWait({ images: payload.hints });

    // 2. Analyze pages
    const pageMap = await pageAnalyzerTask.triggerAndWait({
      pdf: payload.pdf,
      pages: payload.pages,
      hints: hints.output
    });

    // 3. Group and dispatch parsers in parallel
    const parserTasks = groupByTypeAndCrossId(pageMap.output);
    const results = await Promise.all(
      parserTasks.map(task => task.parser.triggerAndWait(task.payload))
    );

    // 4. Merge and write outputs
    return mergeOutputs(results);
  }
});
```

## Implementation Steps

### Phase 1: Project Setup

1. **Initialize project**
   - TypeScript + ESLint + Prettier
   - Dependencies:
     - `@trigger.dev/sdk` (task orchestration)
     - `@ai-sdk/google` + `ai` (Gemini via AI SDK)
     - `zod` (schema validation)
     - `pdf-parse` (PDF text/image extraction)
     - `lru-cache` (response caching)
     - `commander` (CLI)

2. **Trigger.dev setup**
   - `npx trigger.dev@latest init`
   - Configure trigger.config.ts
   - Set up dev environment

3. **Define Zod schemas**
   - Input schema: pages, hints, instruction
   - Hint schema: `{ type, description }`
   - Page map schema: `{ page, included: [...] }`
   - Question schemas per type
   - Output schema: Match IMPORT_API.md

### Phase 2: Core Library

4. **Gemini client**
   - AI SDK initialization
   - LRU cache integration
   - Structured output with Zod
   - Error handling + retries

5. **File loaders**
   - PDF loader: file path → Buffer
   - Image loader: file path → Buffer

6. **Output merger**
   - Merge parser outputs into final JSON
   - Pure TypeScript (no AI)

### Phase 3: Trigger.dev Tasks

7. **Hint Tagger Task** (`hint-tagger.task.ts`)
   - Input: Array of hint image Buffers
   - Process: Analyze each image via Gemini
   - Output: `HintTag[]`
   ```ts
   interface HintTag {
     imageIndex: number;
     type: 'single_select' | 'multi_select' | 'fill_in' | 'short_answer';
     description: string;
   }
   ```

8. **Page Analyzer Task** (`page-analyzer.task.ts`)
   - Input: PDF page Buffers + HintTags
   - Process: Match hints to pages, detect question types
   - Output: Page-question mapping with crossId
   ```ts
   interface PageMap {
     page: number;
     included: Array<{
       type: QuestionType;
       description?: string;
       crossId?: number;
     }>;
   }
   ```

9. **Parser Tasks** (`parsers/*.task.ts`)
   - `single-select.task.ts`
   - `multi-select.task.ts`
   - `fill-in.task.ts`
   - `short-answer.task.ts`
   - Each returns questions in import API format

10. **Orchestrator Task** (`orchestrator.task.ts`)
    - Main pipeline coordinator
    - Triggers hint tagger → page analyzer → parsers (parallel)
    - Merges outputs → writes JSON files

### Phase 4: CLI

11. **CLI Implementation**
    ```
    pdftokiao parse [options]

    Options:
      -p, --pdf <path>           PDF file path
      --pages <range>            Page range (e.g., "1" or "1,3")
      -h, --hints <paths...>     Hint image file paths
      -i, --instruction <text>   Additional instructions
      -o, --output <dir>         Output directory for JSON files
      --material-id <id>         Material ID
      --import-key <key>         Import key
    ```

### Phase 5: Testing

12. **Unit tests**
    - Schema validation
    - Gemini client (mock)
    - Merger logic

13. **Integration tests**
    - Trigger.dev task tests
    - Full pipeline with sample materials

## Data Structures

### Input
```ts
interface ParseInput {
  pdf: Buffer;                    // PDF file content
  pages: [number] | [number, number]; // Single page or range
  hints: Buffer[];                // Hint images (user-provided)
  instruction?: string;           // Additional parsing instructions
  materialId: number;
  importKey: string;
}
```

### Page Analyzer Output
```ts
interface PageAnalysis {
  pages: Array<{
    page: number;
    included: Array<{
      type: 'single_select' | 'multi_select' | 'fill_in' | 'short_answer';
      description?: string;
      crossId?: number;  // Links questions across pages
    }>;
  }>;
}
```

### Parser Agent Output (per file)
```ts
// Each parser outputs a file like: single_select_p1.json
{
  "data": {
    "type": "question_group",
    "attributes": { "material_id": 172, "import_key": "..." },
    "questions": [...]
  }
}
```

## Key Design Decisions

1. **Trigger.dev orchestration** - Reliable task execution, parallel processing, retries
2. **Multi-agent pipeline** - Better quality through specialized agents
3. **User-provided hints** - Handle edge cases with visual guidance
4. **CrossId for multi-page** - Track questions spanning pages
5. **Separate output files** - Each parser writes own JSON, merge is simple
6. **Local file paths only** - Simplified input handling
7. **LRU cache on AI responses** - Reduce API costs

## Dependencies

```json
{
  "dependencies": {
    "@trigger.dev/sdk": "^3.x",
    "@ai-sdk/google": "^1.x",
    "ai": "^4.x",
    "zod": "^3.x",
    "pdf-parse": "^1.x",
    "lru-cache": "^11.x",
    "commander": "^12.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vitest": "^2.x",
    "@types/node": "^22.x"
  }
}
```

## Questions Resolved

- PDF pages provided manually (no auto-detection needed)
- File inputs are local paths → Buffer
- Hint images are user-provided (not from PDF)
- CrossId tracks multi-page questions
- Each parser outputs own JSON file
- Merging is pure code (no agent)
- Task orchestration via Trigger.dev
