---
name: dev
description: Development guidelines and coding standards by language/framework. Use when writing, reviewing, or refactoring code in React, TypeScript, Rust, Python, Go, or Node.js. Activates for questions about best practices, patterns, or conventions.
---

# Development Guidelines

## How to Use

1. Identify the primary language/framework from context
2. Load the relevant reference(s) below
3. Apply conventions consistently throughout the task

## References

### Frontend

- [React](refs/react.md) — Components, hooks, state, performance
- [TypeScript](refs/typescript.md) — Types, patterns, strict mode practices

### Backend / Systems

- [Node.js](refs/nodejs.md) — APIs, error handling, project structure
- [Rust](refs/rust.md) — Ownership, error handling, idioms
- [Python](refs/python.md) — Style, typing, project layout
- [Go](refs/go.md) — Idioms, error handling, concurrency

### Cross-Cutting

- [Testing](refs/testing.md) — Unit, integration, E2E strategies
- [Git](refs/git.md) — Commits, branches, PR workflow

## Universal Principles

1. **Clarity over cleverness** — Code is read more than written
2. **Explicit over implicit** — Especially for errors and edge cases
3. **Small, focused units** — Functions, components, modules
4. **Test the behavior** — Not implementation details
5. **Document the why** — Code shows the what
