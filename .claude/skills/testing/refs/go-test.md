# Go Testing

## Basic Tests

### Test File Structure

```go
// user_test.go (same package)
package user

import "testing"

func TestCreateUser(t *testing.T) {
    user := CreateUser("Alice", "alice@example.com")

    if user.Name != "Alice" {
        t.Errorf("expected name Alice, got %s", user.Name)
    }

    if user.Email != "alice@example.com" {
        t.Errorf("expected email alice@example.com, got %s", user.Email)
    }
}
```

### Test Functions

```go
func TestXxx(t *testing.T)      // Test function
func BenchmarkXxx(b *testing.B) // Benchmark
func ExampleXxx()                // Example (doc + test)
func FuzzXxx(f *testing.F)      // Fuzz test (Go 1.18+)
```

### t.Error vs t.Fatal

```go
func TestMultipleChecks(t *testing.T) {
    result := Process(input)

    // Continue after failure
    if result.Status != "ok" {
        t.Errorf("status: got %s, want ok", result.Status)
    }

    // Stop immediately on failure
    if result == nil {
        t.Fatal("result is nil")
    }

    // With formatting
    t.Fatalf("unexpected error: %v", err)
}
```

## Table-Driven Tests

### Basic Pattern

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, 1, 0},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
```

### With Errors

```go
func TestParse(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    int
        wantErr bool
    }{
        {"valid", "42", 42, false},
        {"negative", "-10", -10, false},
        {"invalid", "abc", 0, true},
        {"empty", "", 0, true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Parse(tt.input)

            if (err != nil) != tt.wantErr {
                t.Errorf("error = %v, wantErr %v", err, tt.wantErr)
                return
            }

            if got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

### Parallel Subtests

```go
func TestFetch(t *testing.T) {
    tests := []struct {
        name string
        url  string
        want int
    }{
        {"google", "https://google.com", 200},
        {"github", "https://github.com", 200},
    }

    for _, tt := range tests {
        tt := tt // Capture range variable
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel() // Run in parallel

            resp, _ := http.Get(tt.url)
            if resp.StatusCode != tt.want {
                t.Errorf("got %d, want %d", resp.StatusCode, tt.want)
            }
        })
    }
}
```

## Test Helpers

### Helper Functions

```go
func TestWithHelper(t *testing.T) {
    user := createTestUser(t)
    // ...
}

func createTestUser(t *testing.T) *User {
    t.Helper() // Marks as helper - errors report caller's line

    user, err := NewUser("test", "test@example.com")
    if err != nil {
        t.Fatalf("failed to create user: %v", err)
    }
    return user
}
```

### Test Fixtures

```go
func TestWithDB(t *testing.T) {
    db := setupTestDB(t)
    // db is cleaned up automatically via t.Cleanup

    // Use db...
}

func setupTestDB(t *testing.T) *sql.DB {
    t.Helper()

    db, err := sql.Open("sqlite3", ":memory:")
    if err != nil {
        t.Fatalf("failed to open db: %v", err)
    }

    // Register cleanup
    t.Cleanup(func() {
        db.Close()
    })

    return db
}
```

### testdata Directory

```
package/
├── parser.go
├── parser_test.go
└── testdata/
    ├── valid.json
    ├── invalid.json
    └── golden/
        └── expected_output.txt
```

```go
func TestParser(t *testing.T) {
    data, err := os.ReadFile("testdata/valid.json")
    if err != nil {
        t.Fatalf("failed to read testdata: %v", err)
    }
    // ...
}
```

## Mocking

### Interface-Based Mocking

```go
// Define interface at consumer
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
    Save(ctx context.Context, user *User) error
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
    user, ok := m.users[id]
    if !ok {
        return nil, ErrNotFound
    }
    return user, nil
}

func (m *mockUserRepo) Save(ctx context.Context, user *User) error {
    if m.err != nil {
        return m.err
    }
    m.users[user.ID] = user
    return nil
}

// Usage in test
func TestUserService_GetUser(t *testing.T) {
    repo := &mockUserRepo{
        users: map[string]*User{
            "123": {ID: "123", Name: "Alice"},
        },
    }
    svc := NewUserService(repo)

    user, err := svc.GetUser(context.Background(), "123")

    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if user.Name != "Alice" {
        t.Errorf("got name %s, want Alice", user.Name)
    }
}
```

### Functional Mocks

```go
type Service struct {
    fetchFn func(url string) ([]byte, error)
}

func TestService(t *testing.T) {
    svc := &Service{
        fetchFn: func(url string) ([]byte, error) {
            return []byte(`{"status":"ok"}`), nil
        },
    }

    result := svc.Process()
    // ...
}
```

## HTTP Testing

### httptest Server

```go
func TestAPIClient(t *testing.T) {
    // Create test server
    server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/users/123" {
            t.Errorf("unexpected path: %s", r.URL.Path)
        }

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"id":"123","name":"Alice"}`))
    }))
    defer server.Close()

    // Use server.URL as base URL
    client := NewAPIClient(server.URL)
    user, err := client.GetUser("123")

    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if user.Name != "Alice" {
        t.Errorf("got %s, want Alice", user.Name)
    }
}
```

### httptest Recorder

```go
func TestHandler(t *testing.T) {
    req := httptest.NewRequest("GET", "/users/123", nil)
    rec := httptest.NewRecorder()

    handler := NewUserHandler(mockRepo)
    handler.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Errorf("status = %d, want 200", rec.Code)
    }

    var user User
    json.NewDecoder(rec.Body).Decode(&user)
    if user.Name != "Alice" {
        t.Errorf("name = %s, want Alice", user.Name)
    }
}
```

## Benchmarks

### Basic Benchmark

```go
func BenchmarkProcess(b *testing.B) {
    input := prepareInput()

    b.ResetTimer() // Exclude setup time

    for i := 0; i < b.N; i++ {
        Process(input)
    }
}

// Run: go test -bench=. -benchmem
```

### Benchmark with Sub-benchmarks

```go
func BenchmarkSort(b *testing.B) {
    sizes := []int{100, 1000, 10000}

    for _, size := range sizes {
        b.Run(fmt.Sprintf("size-%d", size), func(b *testing.B) {
            data := generateData(size)
            b.ResetTimer()

            for i := 0; i < b.N; i++ {
                Sort(data)
            }
        })
    }
}
```

### Memory Benchmarks

```go
func BenchmarkAllocations(b *testing.B) {
    b.ReportAllocs()

    for i := 0; i < b.N; i++ {
        _ = make([]byte, 1024)
    }
}
```

## Fuzz Testing (Go 1.18+)

```go
func FuzzParse(f *testing.F) {
    // Seed corpus
    f.Add("42")
    f.Add("-10")
    f.Add("0")

    f.Fuzz(func(t *testing.T, input string) {
        result, err := Parse(input)
        if err != nil {
            return // Invalid input is ok
        }

        // Property: re-formatting should match
        if fmt.Sprint(result) != input {
            t.Errorf("roundtrip failed: %s -> %d -> %s", input, result, fmt.Sprint(result))
        }
    })
}

// Run: go test -fuzz=FuzzParse
```

## Test Coverage

```bash
# Generate coverage
go test -coverprofile=coverage.out ./...

# View coverage
go tool cover -html=coverage.out

# Coverage percentage
go test -cover ./...

# Per-function coverage
go tool cover -func=coverage.out
```

## Testing Patterns

### Golden Files

```go
var update = flag.Bool("update", false, "update golden files")

func TestOutput(t *testing.T) {
    got := GenerateOutput(input)
    golden := filepath.Join("testdata", "golden", t.Name()+".txt")

    if *update {
        os.WriteFile(golden, got, 0644)
    }

    want, _ := os.ReadFile(golden)
    if !bytes.Equal(got, want) {
        t.Errorf("output mismatch, run with -update to update golden file")
    }
}

// Update: go test -update
```

### Test Main

```go
func TestMain(m *testing.M) {
    // Setup
    db := setupDB()

    // Run tests
    code := m.Run()

    // Cleanup
    db.Close()

    os.Exit(code)
}
```

## CLI Commands

```bash
# Run all tests
go test ./...

# Verbose
go test -v ./...

# Run specific test
go test -run TestCreateUser ./...

# Run subtests
go test -run TestParse/valid ./...

# Short mode (skip slow tests)
go test -short ./...

# Race detector
go test -race ./...

# Timeout
go test -timeout 30s ./...

# Parallel
go test -parallel 4 ./...

# Benchmarks
go test -bench=. -benchmem ./...

# With coverage
go test -cover -coverprofile=coverage.out ./...
```

## Packages

| Package  | Purpose           |
| -------- | ----------------- |
| testing  | Standard library  |
| testify  | Assertions, mocks |
| gomock   | Interface mocking |
| httptest | HTTP testing      |
| iotest   | IO testing        |
| quick    | Property testing  |
