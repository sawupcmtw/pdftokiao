# Jest Testing

## Setup

### jest.config.js

```javascript
/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom', // or 'node' for backend
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}', '!src/**/*.d.ts', '!src/**/index.ts'],
  testMatch: ['**/*.test.{js,ts,tsx}'],
}
```

### jest.setup.js

```javascript
import '@testing-library/jest-dom'

// Global mocks
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
})
```

## Basic Tests

### Structure

```typescript
describe('UserService', () => {
  // Setup/teardown
  beforeAll(() => {
    /* once before all tests */
  })
  afterAll(() => {
    /* once after all tests */
  })
  beforeEach(() => {
    /* before each test */
  })
  afterEach(() => {
    /* after each test */
  })

  describe('createUser', () => {
    it('creates user with valid data', () => {
      // Arrange
      const data = { name: 'Alice', email: 'alice@example.com' }

      // Act
      const user = createUser(data)

      // Assert
      expect(user.name).toBe('Alice')
      expect(user.email).toBe('alice@example.com')
    })

    it('throws for invalid email', () => {
      expect(() => createUser({ name: 'Alice', email: 'invalid' })).toThrow('Invalid email')
    })
  })
})
```

### Common Matchers

```typescript
// Equality
expect(value).toBe(exact) // ===
expect(value).toEqual(deep) // Deep equality
expect(value).toStrictEqual(obj) // Deep + undefined props

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(num).toBeGreaterThan(3)
expect(num).toBeLessThanOrEqual(5)
expect(0.1 + 0.2).toBeCloseTo(0.3)

// Strings
expect(str).toMatch(/pattern/)
expect(str).toContain('substring')

// Arrays/Iterables
expect(arr).toContain(item)
expect(arr).toHaveLength(3)
expect(arr).toContainEqual({ id: 1 })

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('nested.key', 'value')
expect(obj).toMatchObject({ partial: 'match' })

// Exceptions
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('message')
expect(() => fn()).toThrow(ErrorClass)

// Async
await expect(promise).resolves.toBe(value)
await expect(promise).rejects.toThrow('error')
```

### Async Tests

```typescript
// async/await
it('fetches user', async () => {
  const user = await fetchUser('123')
  expect(user.name).toBe('Alice')
})

// Promises
it('fetches user', () => {
  return fetchUser('123').then(user => {
    expect(user.name).toBe('Alice')
  })
})

// Callbacks (use done)
it('calls back with data', done => {
  fetchWithCallback('123', (err, user) => {
    expect(err).toBeNull()
    expect(user.name).toBe('Alice')
    done()
  })
})
```

## Mocking

### Mock Functions

```typescript
// Create mock
const mockFn = jest.fn()
const mockWithReturn = jest.fn().mockReturnValue(42)
const mockAsync = jest.fn().mockResolvedValue({ data: 'value' })

// Implementation
const mockImpl = jest.fn((x: number) => x * 2)

// Verify calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenLastCalledWith('lastArg')

// Access call info
mockFn.mock.calls // [['arg1'], ['arg2']]
mockFn.mock.results // [{ type: 'return', value: ... }]

// Reset
mockFn.mockClear() // Clear calls
mockFn.mockReset() // Clear + remove implementation
mockFn.mockRestore() // Restore original (spies only)
```

### Mock Modules

```typescript
// Mock entire module
jest.mock('./userService')
import { getUser } from './userService'

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>
mockGetUser.mockResolvedValue({ id: '1', name: 'Alice' })

// Partial mock
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn(() => '2024-01-01'),
}))

// Mock with factory
jest.mock('./api', () => ({
  fetchData: jest.fn(),
}))
```

### Spies

```typescript
// Spy on method
const spy = jest.spyOn(object, 'method')
spy.mockImplementation(() => 'mocked')

// Spy on module
import * as utils from './utils'
jest.spyOn(utils, 'calculate').mockReturnValue(100)

// Always restore
afterEach(() => {
  jest.restoreAllMocks()
})
```

### Timer Mocks

```typescript
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

it('debounces calls', () => {
  const callback = jest.fn()
  const debounced = debounce(callback, 1000)

  debounced()
  debounced()
  debounced()

  expect(callback).not.toHaveBeenCalled()

  jest.advanceTimersByTime(1000)

  expect(callback).toHaveBeenCalledTimes(1)
})

// Other timer methods
jest.runAllTimers()
jest.runOnlyPendingTimers()
jest.advanceTimersToNextTimer()
```

## React Testing Library

### Setup

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
```

### Rendering

```typescript
// Basic render
render(<Button onClick={handleClick}>Click me</Button>)

// With providers
const AllProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryClientProvider>
)

render(<MyComponent />, { wrapper: AllProviders })

// Custom render helper
function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: AllProviders })
}
```

### Queries

```typescript
// Priority (use in this order):
// 1. Accessible queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')
screen.getByText('Welcome')
screen.getByDisplayValue('current value')

// 2. Semantic queries
screen.getByAltText('Profile photo')
screen.getByTitle('Close')

// 3. Test IDs (last resort)
screen.getByTestId('custom-element')

// Query variants
getBy*      // Throws if not found
queryBy*    // Returns null if not found
findBy*     // Async, waits for element

getAllBy*   // Returns array, throws if empty
queryAllBy* // Returns array, empty if none
findAllBy*  // Async array
```

### User Events

```typescript
it('submits form with user data', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn()

  render(<LoginForm onSubmit={onSubmit} />)

  // Type in fields
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Password'), 'password123')

  // Click submit
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})

// Other interactions
await user.clear(input)
await user.selectOptions(select, 'option-value')
await user.upload(fileInput, file)
await user.hover(element)
await user.tab()
await user.keyboard('{Enter}')
```

### Async Testing

```typescript
// waitFor: poll until assertion passes
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// findBy: combined query + waitFor
const element = await screen.findByText('Loaded')

// waitForElementToBeRemoved
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'

it('increments counter', () => {
  const { result } = renderHook(() => useCounter())

  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})

// With wrapper
const { result } = renderHook(() => useAuth(), {
  wrapper: AuthProvider,
})
```

## Snapshot Testing

```typescript
// Create/update snapshot
it('renders correctly', () => {
  const { container } = render(<Button>Click</Button>)
  expect(container).toMatchSnapshot()
})

// Inline snapshot
it('formats date', () => {
  expect(formatDate(new Date('2024-01-15'))).toMatchInlineSnapshot(
    `"January 15, 2024"`
  )
})

// Update snapshots: jest --updateSnapshot
```

## Test Patterns

### Testing Error Boundaries

```typescript
// Suppress console.error for expected errors
const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

it('displays fallback on error', () => {
  const ThrowError = () => { throw new Error('Test') }

  render(
    <ErrorBoundary fallback={<div>Error occurred</div>}>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText('Error occurred')).toBeInTheDocument()
})

afterEach(() => consoleSpy.mockRestore())
```

### Testing Context

```typescript
it('uses theme from context', () => {
  render(
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  )

  expect(screen.getByRole('button')).toHaveClass('dark')
})
```

### Testing with React Query

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

it('displays user data', async () => {
  server.use(
    rest.get('/api/user', (req, res, ctx) =>
      res(ctx.json({ name: 'Alice' }))
    )
  )

  render(<UserProfile />, { wrapper })

  await screen.findByText('Alice')
})
```

## CLI Commands

```bash
# Run all tests
jest

# Watch mode
jest --watch

# Run specific file
jest user.test.ts

# Run tests matching pattern
jest -t "creates user"

# Coverage
jest --coverage

# Update snapshots
jest -u

# Run only changed
jest --onlyChanged

# Verbose output
jest --verbose
```
