# Testing Strategies

### Test Pyramid (top to bottom)

1. **E2E** (few) — Critical user journeys, slow, high maintenance
2. **Integration** (some) — API contracts, DB queries
3. **Unit** (many) — Business logic, fast, isolated

### Layer Characteristics

| Layer       | Speed        | Cost   | Confidence | Scope                 |
| ----------- | ------------ | ------ | ---------- | --------------------- |
| Unit        | Fast (ms)    | Low    | Narrow     | Single function/class |
| Integration | Medium (s)   | Medium | Medium     | Multiple components   |
| E2E         | Slow (s-min) | High   | High       | Full system           |

## What to Test

### Unit Test These

```
✓ Business logic and calculations
✓ Data transformations
✓ Validation rules
✓ State machines
✓ Edge cases and boundaries
✓ Error handling paths
✓ Pure functions
```

### Integration Test These

```
✓ API endpoints (request → response)
✓ Database queries and transactions
✓ External service integrations
✓ Message queue consumers
✓ Authentication flows
✓ Component interactions
```

### E2E Test These

```
✓ Critical user journeys (checkout, signup)
✓ Cross-browser compatibility
✓ Authentication/authorization flows
✓ Payment flows
✓ Multi-step workflows
```

### Don't Test These

```
✗ Third-party library internals
✗ Framework code
✗ Simple getters/setters
✗ Configuration files
✗ Type definitions
✗ Private implementation details
```

## Test Naming

### Describe Behavior, Not Implementation

```typescript
// ✓ Good: describes behavior
test('returns null when user is not found')
test('throws ValidationError when email format is invalid')
test('sends welcome email after successful registration')

// ✗ Bad: describes implementation
test('test getUserById function')
test('calls validateEmail method')
test('test email service')
```

### Pattern: Given-When-Then

```typescript
// Unit
test('[unit] returns discount when user has premium membership')
test('[unit] throws error when quantity is negative')

// Integration
test('[api] POST /users returns 201 with valid data')
test('[db] persists user with hashed password')

// E2E
test('[e2e] user can complete checkout with credit card')
```

## Test Structure

### Arrange-Act-Assert

```typescript
test('calculates total with discount', () => {
  // Arrange: set up test data
  const cart = createCart([
    { product: 'Widget', price: 100 },
    { product: 'Gadget', price: 50 },
  ])
  const discount = { type: 'percentage', value: 10 }

  // Act: execute code under test
  const total = calculateTotal(cart, discount)

  // Assert: verify result
  expect(total).toBe(135) // 150 - 10%
})
```

### One Concept Per Test

```typescript
// ✓ Good: focused tests
test('creates user with provided name', () => {
  const user = createUser({ name: 'Alice' })
  expect(user.name).toBe('Alice')
})

test('generates unique ID for new user', () => {
  const user = createUser({ name: 'Alice' })
  expect(user.id).toBeDefined()
  expect(user.id).toMatch(/^[a-f0-9-]{36}$/)
})

// ✗ Bad: multiple unrelated assertions
test('creates user', () => {
  const user = createUser({ name: 'Alice' })
  expect(user.name).toBe('Alice')
  expect(user.id).toBeDefined()
  expect(user.createdAt).toBeInstanceOf(Date)
  expect(user.email).toBeNull()
  expect(user.role).toBe('member')
})
```

## Test Data

### Factories Over Fixtures

```typescript
// ✓ Factory: explicit, flexible
function createUser(overrides: Partial<User> = {}): User {
  return {
    id: randomUUID(),
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    role: 'member',
    createdAt: new Date(),
    ...overrides,
  }
}

// Usage: clear what's being tested
const adminUser = createUser({ role: 'admin' })
const inactiveUser = createUser({ status: 'inactive' })
```

### Builder Pattern for Complex Objects

```typescript
class OrderBuilder {
  private data: Partial<Order> = {}

  withCustomer(customer: Customer) {
    this.data.customer = customer
    return this
  }

  withItems(items: OrderItem[]) {
    this.data.items = items
    return this
  }

  shipped() {
    this.data.status = 'shipped'
    this.data.shippedAt = new Date()
    return this
  }

  build(): Order {
    return {
      id: randomUUID(),
      status: 'pending',
      items: [],
      ...this.data,
    } as Order
  }
}

// Usage
const order = new OrderBuilder().withCustomer(customer).withItems([itemA, itemB]).shipped().build()
```

### Avoid Magic Values

```typescript
// ✗ Bad: magic values
expect(result.total).toBe(157.5)

// ✓ Good: explicit calculation
const itemsTotal = 150
const taxRate = 0.05
const expectedTotal = itemsTotal * (1 + taxRate)
expect(result.total).toBe(expectedTotal)
```

## Test Isolation

### Each Test Should Be Independent

```typescript
// ✗ Bad: tests depend on each other
let user: User

test('creates user', () => {
  user = createUser({ name: 'Alice' }) // Shared state
  expect(user.id).toBeDefined()
})

test('updates user', () => {
  updateUser(user.id, { name: 'Bob' }) // Depends on previous test
  expect(user.name).toBe('Bob')
})

// ✓ Good: each test is self-contained
test('creates user', () => {
  const user = createUser({ name: 'Alice' })
  expect(user.id).toBeDefined()
})

test('updates user name', () => {
  const user = createUser({ name: 'Alice' }) // Own setup

  updateUser(user.id, { name: 'Bob' })

  expect(getUser(user.id).name).toBe('Bob')
})
```

### Clean Up After Tests

```typescript
// Using beforeEach/afterEach
let db: Database

beforeEach(async () => {
  db = await createTestDatabase()
})

afterEach(async () => {
  await db.truncate('users')
  await db.close()
})
```

## Testing Async Code

### Always Await Assertions

```typescript
// ✗ Bad: missing await
test('fetches user', () => {
  const user = fetchUser('123')
  expect(user.name).toBe('Alice') // Passes incorrectly!
})

// ✓ Good: awaited
test('fetches user', async () => {
  const user = await fetchUser('123')
  expect(user.name).toBe('Alice')
})
```

### Test Error Cases

```typescript
test('throws when user not found', async () => {
  await expect(fetchUser('nonexistent')).rejects.toThrow('User not found')
})

test('returns error result', async () => {
  const result = await fetchUser('nonexistent')
  expect(result.isErr()).toBe(true)
  expect(result.error.code).toBe('NOT_FOUND')
})
```

## Flaky Tests

### Common Causes

1. **Timing dependencies** - Race conditions, timeouts
2. **Shared state** - Tests affecting each other
3. **External dependencies** - Network, databases, APIs
4. **Random data** - Unpredictable test data
5. **Order dependence** - Tests rely on execution order

### Fixing Flaky Tests

```typescript
// ✗ Flaky: timing dependent
await new Promise(r => setTimeout(r, 1000))
expect(element).toBeVisible()

// ✓ Stable: wait for condition
await waitFor(() => expect(element).toBeVisible())

// ✗ Flaky: random data affects assertions
const user = { id: Math.random(), name: 'Test' }
expect(user.id).toBe(0.123) // Will fail

// ✓ Stable: controlled randomness
const user = { id: 'test-id', name: 'Test' }
// or use seeded random
```

### Quarantine Flaky Tests

```typescript
// Mark for fixing
test.skip('flaky test - TODO: fix timing issue #123', () => {
  // ...
})

// Or use retry as temporary measure
test(
  'sometimes flaky',
  async () => {
    // ...
  },
  { retries: 2 },
)
```

## Coverage

### Quality Over Quantity

```
80% meaningful coverage > 100% trivial coverage
```

### What Coverage Doesn't Tell You

- If tests are meaningful
- If edge cases are covered
- If tests are maintainable
- If the right things are tested

### Focus Areas

```
✓ Complex business logic: aim for 90%+
✓ Error handling paths: often overlooked
✓ Edge cases: boundaries, null, empty
✗ Configuration: low value
✗ Simple delegation: low value
```

## When to Write Tests

### Test-First (TDD)

```
1. Write failing test
2. Write minimal code to pass
3. Refactor
4. Repeat
```

**Good for:**

- Well-defined requirements
- Complex business logic
- Bug fixes (write test that reproduces)

### Test-After

```
1. Implement feature
2. Write tests for behavior
3. Refactor with test safety net
```

**Good for:**

- Exploratory development
- Prototyping
- UI components

### Test-During (Pragmatic)

```
1. Write tests for core logic first
2. Implement
3. Add edge case tests
4. Integration tests last
```

## Code Review Checklist

### Test Quality

- [ ] Tests describe behavior, not implementation
- [ ] Each test is focused on one concept
- [ ] Test data is clear and minimal
- [ ] No shared mutable state between tests
- [ ] Async code is properly awaited
- [ ] Error cases are tested

### Coverage

- [ ] Happy path covered
- [ ] Error/edge cases covered
- [ ] Boundary conditions tested
- [ ] Null/empty inputs handled

### Maintainability

- [ ] Test names are descriptive
- [ ] Duplication is minimized (use helpers)
- [ ] Tests are readable without comments
- [ ] No flaky patterns (timing, order)
