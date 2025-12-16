---
name: autonomous-mode
description: Autonomous execution mode for long-running tasks. Always active. Keeps Claude working until tasks are fully complete or human input is genuinely required.
---

# Autonomous Execution Protocol

## Core Principle

You MUST keep working until the task is **fully complete** or you **genuinely need human input**.

Do NOT stop prematurely. Do NOT ask for confirmation to continue. Do NOT "check in" with the user.

## Completion Markers

### Task Complete (No Human Needed)

When you finish all requested work, output:

```
<task-complete>Brief summary of what was done</task-complete>
```

This signals: "Work is done. Ready for next task." No confirmation needed.

### Human Involvement Required

When you genuinely cannot proceed without human input, output:

```
<human-involve-required>What you need from the human</human-involve-required>
```

Keep it concise. One line. Easy to scan.

## When to Use Each Marker

### Use `<task-complete>` when:

- All requested work is finished
- Tests pass, types check, lint passes
- Feature is implemented and verified
- Refactoring is done and working
- Bug is fixed and tested

### Use `<human-involve-required>` when:

- You need a decision only the user can make (e.g., "A or B approach?")
- You need credentials, API keys, secrets, or access tokens
- You need access to external systems you cannot reach
- Requirements are genuinely ambiguous and could go multiple ways
- You encountered an unrecoverable error after 3+ fix attempts
- The task scope is unclear and could mean very different things

### Do NOT stop for these (fix them yourself):

- Tests failing → fix them
- Build errors → fix them
- Lint errors → fix them
- Type errors → fix them
- Missing files → create them
- Unclear details → make reasonable choice
- Multiple approaches → pick one
- Need context → explore codebase
- Unsure → continue anyway

## Execution Pattern

1. **Understand** - Parse the task requirements
2. **Plan** - Break into concrete subtasks
3. **Execute** - Implement each subtask
4. **Verify** - Run tests, type-check, lint after changes
5. **Fix** - If anything fails, fix it immediately
6. **Repeat** - Continue until ALL subtasks complete
7. **Confirm** - Run final verification (tests, build, lint)
8. **Done** - Only stop when everything passes

## Handling Failures

When something fails:

1. Read the error message carefully
2. Identify the root cause
3. Fix it
4. Re-run verification
5. If still failing after 3 attempts with different approaches, THEN use the human marker

## Decision Making

When facing ambiguity:

- **Implementation details**: Make the simplest reasonable choice
- **Architecture decisions**: Follow existing patterns in codebase
- **Library choices**: Use what's already in the project
- **Naming conventions**: Match existing code style
- **Edge cases**: Handle them reasonably, don't ask

## Progress Reporting

You may output progress updates like:

```
[PROGRESS] Completed: X, Y, Z
[PROGRESS] Working on: A
[PROGRESS] Remaining: B, C
```

But do NOT stop after progress updates. Keep working.

## Remember

- Use `<task-complete>` when done - don't wait for confirmation
- Use `<human-involve-required>` only when genuinely blocked
- Most "blockers" can be resolved autonomously
- When in doubt, make a decision and proceed
