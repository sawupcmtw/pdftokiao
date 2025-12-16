---
name: code-review
description: Automated code review agent supporting multiple languages (JavaScript/TypeScript, Python, Go, Rust, Java, C/C++, Ruby, PHP, Swift, Kotlin). Use when reviewing PRs, code changes, entire files, or directories. Triggers on "review this code", "code review", "check my code", "PR review", or when analyzing code quality, security, performance, or best practices.
---

# Code Review Agent

Single execution agent with multi-language skill modules for comprehensive code reviews.

## When to Use

| Timing                  | Scope                | Focus                                                                      |
| ----------------------- | -------------------- | -------------------------------------------------------------------------- |
| **During development**  | Single file/function | Quick feedback on current work. Catch issues early before they compound.   |
| **End of task/feature** | Feature branch       | Full review before PR. Ensure completeness, edge cases, no leftover TODOs. |
| **PR review**           | Diff only            | Changed lines + context. Verify no regressions, meets standards.           |
| **Pre-merge**           | Critical paths       | Security & performance focus on auth, payments, data handling.             |
| **Refactoring**         | Module/directory     | Architecture review. Check patterns, duplication, abstraction levels.      |
| **Onboarding/learning** | Any                  | Educational mode. Explain _why_ issues matter, not just _what_.            |

## Workflow

```
1. Detect language(s) → Load language skill from references/
2. Analyze code → Apply language-specific + universal rules
3. Generate report → Structured findings with severity levels
```

## Quick Start

```bash
# Review single file
python scripts/review.py path/to/file.py

# Review directory
python scripts/review.py src/ --recursive

# Review with specific focus
python scripts/review.py file.ts --focus security,performance
```

## Review Categories

| Category     | What to Check                                                |
| ------------ | ------------------------------------------------------------ |
| **Critical** | Security vulns, data leaks, injection, auth bypass           |
| **Error**    | Bugs, race conditions, null refs, resource leaks             |
| **Warning**  | Code smells, complexity, poor naming, missing error handling |
| **Info**     | Style, docs, minor improvements                              |

## Language Detection

Auto-detect by extension, fallback to shebang/content analysis:

| Extensions                           | Language              |
| ------------------------------------ | --------------------- |
| `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs` | JavaScript/TypeScript |
| `.py`, `.pyi`                        | Python                |
| `.go`                                | Go                    |
| `.rs`                                | Rust                  |
| `.java`                              | Java                  |
| `.c`, `.h`, `.cpp`, `.hpp`, `.cc`    | C/C++                 |
| `.rb`                                | Ruby                  |
| `.php`                               | PHP                   |
| `.swift`                             | Swift                 |
| `.kt`, `.kts`                        | Kotlin                |

For language-specific rules, load: `references/{language}.md`

## Code Quality Rules (Strict)

### 1. No Redundant Comments

Code must be self-explanatory. Flag and remove:

```typescript
// BAD: comment restates the code
const isAdmin = user.role === 'admin' // check if user is admin

// BAD: obvious comment
i++ // increment i

// BAD: changelog in code
// Added by John on 2024-01-15 to fix bug #123

// GOOD: comment explains WHY, not WHAT
const timeout = 30000 // matches upstream API gateway limit
```

**Action:** Flag redundant comments as WARNING. Suggest renaming variables/functions for clarity instead.

### 2. No `any` Without Justification

TypeScript's `any` defeats type safety. When detected:

1. Flag as ERROR
2. **Ask user to confirm the reason** before approving
3. Acceptable only when:
   - Interfacing with untyped third-party lib (temporary)
   - Complex type inference breaks compiler
   - Migration from JS (must have TODO to fix)

```typescript
// BAD
const data: any = fetchData()

// GOOD: narrow the type
const data: unknown = fetchData()
if (isUserResponse(data)) {
  /* now typed */
}

// If `any` is unavoidable, require comment
const legacy: any = oldLib.call() // TODO: type when @types/oldLib available
```

**Action:** Always pause and confirm with user: "I see `any` at line X. What's the reason? Can we use `unknown` + type guard instead?"

### 3. No Redundant Guards

Do not duplicate validation when data source is already verified upstream.

```typescript
// BAD: over-guarding - API already validates auth
async function getProfile(userId: string) {
  if (!userId) throw new Error('userId required') // ❌ already validated by auth middleware
  if (!isValidUUID(userId)) throw new Error('invalid') // ❌ already validated by route param schema

  const user = await db.users.find(userId)
  if (!user) throw new Error('not found') // ✅ this is valid - DB could return null
}

// GOOD: trust verified boundaries
async function getProfile(userId: string) {
  // userId validated by: auth middleware + zod schema
  const user = await db.users.find(userId)
  if (!user) throw new Error('not found')
}
```

**Identification:**

- Check where data originates (API layer, validated form, typed DB result)
- If upstream already guarantees validity, guard is redundant
- Redundant guards add noise, hurt readability, and signal distrust in architecture

**Action:** Flag as WARNING. Ask: "This guard seems redundant—`{source}` already validates this. Remove?"

---

## Universal Review Checklist

### Security (All Languages)

- [ ] No hardcoded secrets/credentials
- [ ] Input validation on external data
- [ ] Proper auth/authz checks
- [ ] Safe SQL/command construction
- [ ] Secure random for crypto operations

### Logic & Correctness

- [ ] Edge cases handled (null, empty, boundary)
- [ ] Error paths don't leak state
- [ ] Async operations properly awaited
- [ ] Resources cleaned up (files, connections)
- [ ] No infinite loops/recursion without bounds

### Performance

- [ ] No N+1 queries or O(n²) in hot paths
- [ ] Appropriate caching strategy
- [ ] No memory leaks (event listeners, closures)
- [ ] Lazy loading for expensive operations

### Maintainability

- [ ] Functions do one thing (< 100 lines ideal)
- [ ] Clear naming (verbs for functions, nouns for vars)
- [ ] No magic numbers/strings
- [ ] DRY without over-abstraction

## Output Format

```markdown
## Code Review: {filename}

### Category

- **Issue**
- **Suggestion**

### Critical Issues (must fix)

- **[LINE:XX]** {issue description}
  - Why: {explanation}
  - Fix: {suggestion}

### Errors (should fix)

...

### Warnings (consider fixing)

...
```

## Multi-File Reviews

For PRs/directories with multiple languages:

1. Group files by language
2. Apply respective language skill to each group
3. Cross-file analysis: imports, dependencies, API consistency
4. Aggregate into single report with file-by-file breakdown

## Focus Modes

Use `--focus` to prioritize specific aspects:

| Mode              | Emphasis                               |
| ----------------- | -------------------------------------- |
| `security`        | Vulns, injection, auth, data exposure  |
| `performance`     | Complexity, memory, queries, caching   |
| `maintainability` | Readability, SOLID, naming, docs       |
| `testing`         | Coverage, edge cases, mocking patterns |
| `all`             | Balanced review (default)              |

## Integration

### With Git

```bash
# Review staged changes
git diff --cached | python scripts/review.py --stdin

# Review PR diff
gh pr diff 123 | python scripts/review.py --stdin
```

### CI/CD Output

```bash
python scripts/review.py src/ --format json --output review.json
python scripts/review.py src/ --format sarif  # GitHub Security tab
```
