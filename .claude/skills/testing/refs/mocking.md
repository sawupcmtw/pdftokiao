# Mocking Patterns

## When to Mock

### Mock These

```
✓ External APIs and services
✓ Databases (in unit tests)
✓ File system operations
✓ Network requests
✓ Time/dates
✓ Random number generation
✓ Environment variables
✓ Expensive computations (in some tests)
```

### Don't Mock These

```
✗ The code under test
✗ Simple value objects
✗ Pure functions
✗ Internal implementation details
✗ Everything (over-mocking)
```

## Mock Minimally

### The Problem with Over-Mocking

```typescript
// ✗ Over-mocked: tests implementation, not behavior
test('creates user', () => {
  const mockHash = jest.fn().mockReturnValue('hashed')
  const mockSave = jest.fn().mockResolvedValue({ id: '1' })
  const mockValidate = jest.fn().mockReturnValue(true)
  const mockLog = jest.fn()

  createUser(data, { hash: mockHash, save: mockSave, validate: mockValidate, log: mockLog })

  expect(mockHash).toHaveBeenCalledWith('password')
  expect(mockValidate).toHaveBeenCalledWith(data)
  expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alice' }))
  expect(mockLog).toHaveBeenCalledWith('user_created', { id: '1' })
})

// ✓ Better: test behavior, mock only boundaries
test('creates user with hashed password', async () => {
  const repo = new InMemoryUserRepo()
  const service = new UserService(repo)

  const user = await service.createUser({ name: 'Alice', password: 'secret' })

  const saved = await repo.findById(user.id)
  expect(saved.name).toBe('Alice')
  expect(saved.passwordHash).not.toBe('secret') // Password was hashed
})
```

## Mocking Patterns by Language

### JavaScript/TypeScript

#### Jest/Vitest Mocks

```typescript
// Mock function
const mockFn = jest.fn()
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue({ data: 'value' })
mockFn.mockImplementation(x => x * 2)

// Verify
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg')
expect(mockFn).toHaveBeenCalledTimes(2)
```

#### Module Mocks

```typescript
// Auto-mock entire module
jest.mock('./userService')

// Partial mock
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn(() => '2024-01-01'),
}))

// Manual mock (in __mocks__/module.ts)
export const fetchUser = jest.fn()
```

#### Spies

```typescript
const spy = jest.spyOn(object, 'method')
spy.mockReturnValue('mocked')

// Restore after test
afterEach(() => jest.restoreAllMocks())
```

### Python

#### unittest.mock

```python
from unittest.mock import Mock, patch, MagicMock

# Mock object
mock_service = Mock()
mock_service.get_user.return_value = User(name='Alice')

# Patch decorator
@patch('myapp.external.api_call')
def test_with_patch(mock_api):
    mock_api.return_value = {'status': 'ok'}
    result = function_using_api()
    mock_api.assert_called_once_with(timeout=30)

# Context manager
with patch('myapp.time.now') as mock_now:
    mock_now.return_value = datetime(2024, 1, 1)
    assert get_current_date() == '2024-01-01'
```

#### pytest-mock

```python
def test_with_mocker(mocker):
    mock_fetch = mocker.patch('myapp.api.fetch_data')
    mock_fetch.return_value = {'status': 'ok'}

    result = process_data()

    mock_fetch.assert_called_once()
```

### Go

#### Interface-Based Mocking

```go
// Define interface at consumer
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
}

// Mock implementation
type mockUserRepo struct {
    users map[string]*User
    err   error
}

func (m *mockUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
    if m.err != nil {
        return nil, m.err
    }
    return m.users[id], nil
}

// Test
func TestGetUser(t *testing.T) {
    repo := &mockUserRepo{
        users: map[string]*User{"123": {Name: "Alice"}},
    }
    svc := NewUserService(repo)

    user, err := svc.GetUser(context.Background(), "123")
    // assertions...
}
```

### Rust

#### Trait-Based Mocking

```rust
trait UserRepository {
    fn find(&self, id: &str) -> Option<User>;
}

#[cfg(test)]
struct MockUserRepo {
    users: HashMap<String, User>,
}

#[cfg(test)]
impl UserRepository for MockUserRepo {
    fn find(&self, id: &str) -> Option<User> {
        self.users.get(id).cloned()
    }
}
```

#### mockall Crate

```rust
use mockall::{automock, predicate::*};

#[automock]
trait Database {
    fn get(&self, key: &str) -> Option<String>;
}

#[test]
fn test_with_mock() {
    let mut mock = MockDatabase::new();
    mock.expect_get()
        .with(eq("key"))
        .returning(|_| Some("value".to_string()));

    // Use mock...
}
```

## HTTP Mocking

### JavaScript: MSW (Mock Service Worker)

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Alice' })
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '1', ...body }, { status: 201 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Python: responses

```python
import responses

@responses.activate
def test_api_call():
    responses.add(
        responses.GET,
        'https://api.example.com/users/1',
        json={'id': 1, 'name': 'Alice'},
        status=200
    )

    result = fetch_user(1)
    assert result['name'] == 'Alice'
```

### Go: httptest

```go
func TestClient(t *testing.T) {
    server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"name":"Alice"}`))
    }))
    defer server.Close()

    client := NewClient(server.URL)
    user, _ := client.GetUser("123")
    // assertions...
}
```

## Time Mocking

### JavaScript

```typescript
// Jest
jest.useFakeTimers()
jest.setSystemTime(new Date('2024-01-01'))
jest.advanceTimersByTime(1000)
jest.useRealTimers()

// Vitest
vi.useFakeTimers()
vi.setSystemTime(new Date('2024-01-01'))
vi.useRealTimers()
```

### Python

```python
from freezegun import freeze_time

@freeze_time('2024-01-01')
def test_with_frozen_time():
    assert datetime.now() == datetime(2024, 1, 1)

# Context manager
def test_time_travel():
    with freeze_time('2024-01-01') as frozen:
        assert datetime.now().year == 2024
        frozen.move_to('2024-06-01')
        assert datetime.now().month == 6
```

### Go

```go
// Inject time as dependency
type Clock interface {
    Now() time.Time
}

type realClock struct{}
func (realClock) Now() time.Time { return time.Now() }

type mockClock struct {
    time time.Time
}
func (m mockClock) Now() time.Time { return m.time }

func TestWithMockTime(t *testing.T) {
    clock := mockClock{time: time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)}
    svc := NewService(clock)
    // ...
}
```

## Database Mocking Strategies

### In-Memory Database

```typescript
// SQLite in-memory for testing
const db = new Database(':memory:')
await db.exec(schema)

// Test
const repo = new UserRepository(db)
await repo.save({ name: 'Alice' })
const user = await repo.findByName('Alice')
expect(user).toBeDefined()
```

### Repository Pattern

```typescript
// Interface
interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}

// In-memory implementation for tests
class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>()

  async findById(id: string) {
    return this.users.get(id) ?? null
  }

  async save(user: User) {
    this.users.set(user.id, user)
  }
}
```

### Test Containers

```typescript
// Real database in Docker for integration tests
import { PostgreSqlContainer } from '@testcontainers/postgresql'

let container: StartedPostgreSqlContainer

beforeAll(async () => {
  container = await new PostgreSqlContainer().start()
  // Run migrations
})

afterAll(async () => {
  await container.stop()
})
```

## Verification Patterns

### Verify Call Count

```typescript
expect(mockFn).toHaveBeenCalledTimes(1)
expect(mockFn).not.toHaveBeenCalled()
```

### Verify Arguments

```typescript
expect(mockFn).toHaveBeenCalledWith('exact', 'args')
expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ key: 'value' }))
expect(mockFn).toHaveBeenCalledWith(expect.any(String), expect.any(Number))
```

### Verify Order

```typescript
const calls = mockFn.mock.calls
expect(calls[0][0]).toBe('first call')
expect(calls[1][0]).toBe('second call')
```

### Capture Arguments

```typescript
const mockFn = jest.fn()
processData(mockFn)

const [[firstArg]] = mockFn.mock.calls
expect(firstArg.processed).toBe(true)
```

## Anti-Patterns

### Testing Implementation Details

```typescript
// ✗ Bad: tests internal method calls
test('creates user', () => {
  const mockHash = jest.fn()
  createUser(data, { hash: mockHash })
  expect(mockHash).toHaveBeenCalledWith('password', 10) // Salt rounds!
})

// ✓ Good: tests behavior
test('creates user with hashed password', () => {
  const user = createUser({ password: 'secret' })
  expect(user.passwordHash).not.toBe('secret')
})
```

### Mock Everything

```typescript
// ✗ Bad: mocks make test meaningless
test('calculates total', () => {
  const mockSum = jest.fn().mockReturnValue(100)
  const mockTax = jest.fn().mockReturnValue(10)
  expect(calculate(mockSum, mockTax)).toBe(110) // Just testing mocks!
})

// ✓ Good: test real calculation
test('calculates total with tax', () => {
  const items = [{ price: 50 }, { price: 50 }]
  const total = calculateTotal(items, { taxRate: 0.1 })
  expect(total).toBe(110)
})
```

### Brittle Verification

```typescript
// ✗ Bad: breaks when implementation changes
expect(mockLogger.info).toHaveBeenCalledWith('User created', {
  userId: '123',
  timestamp: '2024-01-01T00:00:00Z',
  ip: '127.0.0.1',
})

// ✓ Good: verify what matters
expect(mockLogger.info).toHaveBeenCalledWith(
  expect.stringContaining('User created'),
  expect.objectContaining({ userId: '123' }),
)
```
