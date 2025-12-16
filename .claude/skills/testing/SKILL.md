---
name: test
description: Testing guidelines, patterns, and best practices. Use when writing tests, setting up test infrastructure, debugging test failures, or asking about testing strategies for Jest, Vitest, Pytest, Go, Rust, or Playwright.
---

# Testing Guidelines

## How to Use

1. Identify the testing framework/language from context
2. Load the relevant reference(s) below
3. Apply patterns consistently

## References

### JavaScript/TypeScript

- [Jest](refs/jest.md) — Jest + React Testing Library
- [Vitest](refs/vitest.md) — Vite-native, Jest-compatible

### Other Languages

- [Pytest](refs/pytest.md) — Python testing
- [Go](refs/go-test.md) — Go testing patterns
- [Rust](refs/rust-test.md) — Rust testing idioms

### E2E & Integration

- [Playwright](refs/playwright.md) — Browser automation, E2E

### Cross-Cutting

- [Strategies](refs/strategies.md) — Test pyramid, what to test, coverage
- [Mocking](refs/mocking.md) — Mocking patterns across languages

## Quick Reference

### Test Pyramid (top to bottom)

1. **E2E** (few) — Critical user journeys, slow, high maintenance
2. **Integration** (some) — API contracts, DB queries
3. **Unit** (many) — Business logic, fast, isolated

### Naming Pattern

```
test('[unit] [action] [expected result]')
test('UserService creates user with hashed password')
test('CartService throws when adding negative quantity')
```

### Structure: Arrange-Act-Assert

```
// Arrange: set up test data and dependencies
// Act: execute the code under test
// Assert: verify the expected outcome
```
