# PDF to Kiao - Setup Guide

This document describes Phase 1 setup completion and next steps.

## Phase 1 Completed

### Project Configuration
- **Package Manager**: pnpm 10.13.1
- **Module System**: ESM (type: "module")
- **TypeScript**: v5.x with strict mode enabled
- **Node Target**: ES2022

### Dependencies Installed

#### Runtime Dependencies
- `@trigger.dev/sdk` (^3.0.0) - Background job processing
- `@ai-sdk/google` (^1.0.0) - Google AI integration
- `ai` (^4.0.0) - AI SDK core
- `zod` (^3.0.0) - Schema validation
- `pdf-parse` (^1.0.0) - PDF parsing
- `lru-cache` (^11.0.0) - Conversation caching
- `commander` (^12.0.0) - CLI framework

#### Dev Dependencies
- `typescript` (^5.0.0)
- `vitest` (^2.0.0) - Testing framework
- `eslint` + TypeScript plugin - Linting
- `prettier` - Code formatting
- `@types/node` (^22.0.0)
- `@types/pdf-parse`

### Directory Structure
```
src/
├── trigger/
│   └── parsers/          # Trigger.dev job definitions
├── core/
│   ├── loader/           # PDF loading and extraction
│   ├── ai/               # AI model integration
│   ├── merger/           # Result merging logic
│   ├── cache/            # LRU cache implementation
│   └── schemas/          # Zod validation schemas
├── cli/
│   └── commands/         # CLI command implementations
└── types/                # TypeScript type definitions
```

### Configuration Files
- `tsconfig.json` - TypeScript with NodeNext modules, strict mode
- `eslint.config.js` - ESLint with TypeScript plugin
- `.prettierrc` - Prettier formatting rules
- `vitest.config.ts` - Vitest test configuration
- `.gitignore` - Comprehensive ignore patterns

## Next Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Commit Phase 1 Setup
```bash
# Stage all files
git add .

# Commit with descriptive message
git commit -m "feat: initialize TypeScript project with ESM support and tooling (Phase 1)

Set up the foundational TypeScript project structure for PDF to Kiao parser:

- Configure package.json with ESM module type and all required dependencies
  - Runtime: @trigger.dev/sdk, @ai-sdk/google, ai, zod, pdf-parse, lru-cache, commander
  - Dev: TypeScript 5.x, Vitest 2.x, ESLint, Prettier
- Add comprehensive npm scripts for build, dev, lint, format, and test workflows
- Create tsconfig.json with strict mode and ESM/NodeNext module resolution
- Establish directory structure:
  - src/trigger/parsers/ - Trigger.dev integration
  - src/core/{loader,ai,merger,cache,schemas}/ - Core functionality
  - src/cli/commands/ - CLI interface
  - src/types/ - Type definitions
- Configure ESLint with TypeScript plugin and strict rules
- Set up Prettier for consistent code formatting
- Add Vitest configuration for testing with coverage support
- Create placeholder index.ts files in all modules for structure

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 3. Verify Setup
```bash
# Build the project
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format

# Run tests (will pass with empty test suite)
pnpm test
```

### 4. Environment Setup
Create a `.env` file in the project root with:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
TRIGGER_SECRET_KEY=your_trigger_key_here
```

## Available Scripts

- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm dev` - Watch mode compilation
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check formatting
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm clean` - Remove dist folder

## Phase 2 Preview

Next phase will implement:
- Core type definitions for Kiao import API
- Zod schemas for validation
- PDF loader with page range support
- AI client configuration for Gemini
- LRU cache implementation

## Notes

- The project uses ESM modules exclusively
- All imports must use `.js` extensions (TypeScript requirement for ESM)
- Strict TypeScript mode is enabled for maximum type safety
- Placeholder index.ts files are in place for all modules
