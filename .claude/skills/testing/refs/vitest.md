# Vitest Testing

## Why Vitest

- Native ESM support
- Vite-powered (fast HMR, instant watch)
- Jest-compatible API (easy migration)
- Out-of-box TypeScript support
- Built-in coverage (v8/istanbul)

## Setup

### vite.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
})
```

### setup.ts

```typescript
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## Basic Tests

### Imports

```typescript
// With globals: true (recommended)
// No imports needed for describe, it, expect, vi

// Without globals
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
```

### Structure

```typescript
describe('Calculator', () => {
  it('adds numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('handles negative numbers', () => {
    expect(add(-1, 1)).toBe(0)
  })

  // Skip/focus
  it.skip('skipped test', () => {})
  it.only('focused test', () => {})

  // Todo
  it.todo('implement later')

  // Concurrent
  it.concurrent('runs in parallel', async () => {})
})
```

### Matchers

```typescript
// Same as Jest
expect(value).toBe(5)
expect(value).toEqual({ a: 1 })
expect(value).toBeTruthy()
expect(arr).toContain(item)
expect(obj).toHaveProperty('key')
expect(() => fn()).toThrow()

// Vitest-specific
expect(value).toMatchFileSnapshot('./snapshot.txt')
expect(obj).toMatchObject({ partial: true })
```

### Async

```typescript
it('fetches data', async () => {
  const data = await fetchData()
  expect(data).toEqual({ id: 1 })
})

it('rejects with error', async () => {
  await expect(failingFetch()).rejects.toThrow('Network error')
})
```

## Mocking with `vi`

### Mock Functions

```typescript
// Create mock
const fn = vi.fn()
const fnWithReturn = vi.fn(() => 42)
const asyncFn = vi.fn().mockResolvedValue({ data: 'value' })

// Implementation
const mockImpl = vi.fn((x: number) => x * 2)

// Chained returns
const mock = vi.fn().mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValue(3)

// Verify
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith('arg')
expect(fn).toHaveBeenCalledTimes(2)

// Reset
fn.mockClear() // Clear call history
fn.mockReset() // Clear + reset implementation
fn.mockRestore() // Restore original (spies)
```

### Mock Modules

```typescript
// Auto-mock entire module
vi.mock('./userService')

// With implementation
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'Alice' }),
}))

// Partial mock
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils')
  return {
    ...actual,
    formatDate: vi.fn(() => '2024-01-01'),
  }
})

// Access mocked module
import { fetchUser } from './api'
vi.mocked(fetchUser).mockResolvedValue({ name: 'Bob' })
```

### Spies

```typescript
const spy = vi.spyOn(object, 'method')
spy.mockImplementation(() => 'mocked')

// Spy on module export
import * as utils from './utils'
vi.spyOn(utils, 'calculate').mockReturnValue(100)
```

### Timer Mocks

```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('debounces calls', async () => {
  const callback = vi.fn()
  const debounced = debounce(callback, 1000)

  debounced()
  debounced()

  expect(callback).not.toHaveBeenCalled()

  await vi.advanceTimersByTimeAsync(1000)

  expect(callback).toHaveBeenCalledTimes(1)
})

// Other timer methods
vi.runAllTimers()
vi.runOnlyPendingTimers()
vi.advanceTimersToNextTimer()
vi.setSystemTime(new Date('2024-01-01'))
```

### Mock Environment

```typescript
// Mock env variables
vi.stubEnv('API_URL', 'https://test.api.com')

// Mock globals
vi.stubGlobal('fetch', vi.fn())

// Reset
afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})
```

## React Testing

### With Testing Library

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('handles form submission', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(<Form onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
})
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'

it('manages counter state', () => {
  const { result } = renderHook(() => useCounter(0))

  expect(result.current.count).toBe(0)

  act(() => result.current.increment())

  expect(result.current.count).toBe(1)
})
```

## Snapshot Testing

```typescript
it('renders correctly', () => {
  const { container } = render(<Button>Click</Button>)
  expect(container).toMatchSnapshot()
})

// Inline snapshot
it('formats output', () => {
  expect(format('hello')).toMatchInlineSnapshot(`"HELLO"`)
})

// File snapshot
it('generates report', () => {
  const report = generateReport(data)
  expect(report).toMatchFileSnapshot('./fixtures/report.txt')
})
```

## Test Filtering

```typescript
// In test file
describe.only('focused suite', () => {})
it.only('focused test', () => {})
describe.skip('skipped suite', () => {})
it.skip('skipped test', () => {})

// Conditional
it.skipIf(process.env.CI)('skip in CI', () => {})
it.runIf(process.env.CI)('only in CI', () => {})
```

## Type Testing

```typescript
import { expectTypeOf, assertType } from 'vitest'

it('has correct types', () => {
  expectTypeOf(fn).toBeFunction()
  expectTypeOf(fn).parameter(0).toBeString()
  expectTypeOf(fn).returns.toBeNumber()

  // Assert specific type
  assertType<string>(getValue())
})
```

## In-Source Testing

```typescript
// math.ts
export function add(a: number, b: number) {
  return a + b
}

// Tests co-located in source (dev only)
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('add', () => {
    it('adds numbers', () => {
      expect(add(1, 2)).toBe(3)
    })
  })
}
```

Enable in config:

```typescript
export default defineConfig({
  test: {
    includeSource: ['src/**/*.ts'],
  },
  define: {
    'import.meta.vitest': 'undefined', // Strip in production
  },
})
```

## CLI Commands

```bash
# Run tests
vitest

# Watch mode (default)
vitest

# Run once
vitest run

# UI mode
vitest --ui

# Coverage
vitest --coverage

# Specific file
vitest user.test.ts

# Filter by name
vitest -t "creates user"

# Update snapshots
vitest -u

# Type checking
vitest typecheck

# Benchmark
vitest bench
```

## Migration from Jest

| Jest                   | Vitest               |
| ---------------------- | -------------------- |
| `jest.fn()`            | `vi.fn()`            |
| `jest.mock()`          | `vi.mock()`          |
| `jest.spyOn()`         | `vi.spyOn()`         |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `jest.requireActual()` | `vi.importActual()`  |
| `jest.mocked()`        | `vi.mocked()`        |

Most Jest code works with minimal changes. Main difference: ES modules native support.
