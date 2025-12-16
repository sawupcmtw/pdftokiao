# Go Guidelines

## Project Structure

```
project/
├── cmd/
│   └── server/
│       └── main.go       # Entry point
├── internal/             # Private packages
│   ├── config/
│   ├── handler/
│   ├── service/
│   └── repository/
├── pkg/                  # Public packages (optional)
├── api/                  # API definitions (OpenAPI, proto)
├── migrations/
├── go.mod
├── go.sum
└── Makefile
```

### Package Naming

```go
// ✓ Short, lowercase, no underscores
package user
package httputil

// ✗ Avoid
package userService
package http_util
package utils  // Too generic
```

## Error Handling

### Error Values

```go
// ✓ Sentinel errors for expected cases
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
)

// ✓ Custom error types for rich info
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}
```

### Error Wrapping

```go
// ✓ Add context with %w
if err != nil {
    return fmt.Errorf("failed to fetch user %s: %w", userID, err)
}

// ✓ Check wrapped errors
if errors.Is(err, ErrNotFound) {
    return http.StatusNotFound
}

// ✓ Extract error types
var validationErr *ValidationError
if errors.As(err, &validationErr) {
    log.Printf("validation failed: %s", validationErr.Field)
}
```

### Error Handling Patterns

```go
// ✓ Handle immediately
result, err := doSomething()
if err != nil {
    return err
}
// use result

// ✗ Don't ignore errors
result, _ := doSomething()  // Silent failure

// ✓ Explicit ignore with comment
_ = writer.Close()  // Best-effort cleanup
```

## Interfaces

### Keep Interfaces Small

```go
// ✓ Focused interface
type Reader interface {
    Read(p []byte) (n int, err error)
}

// ✓ Compose interfaces
type ReadWriter interface {
    Reader
    Writer
}

// ✗ Avoid large interfaces
type Everything interface {
    Read() error
    Write() error
    Close() error
    Flush() error
    // ...20 more methods
}
```

### Accept Interfaces, Return Structs

```go
// ✓ Interface parameter = flexibility
func Process(r io.Reader) error {
    // Can accept *os.File, *bytes.Buffer, http.Response.Body, etc.
}

// ✓ Concrete return = clarity
func NewServer(cfg Config) *Server {
    return &Server{...}
}
```

### Define Interfaces at Consumer

```go
// ✓ Define where used, not where implemented
package handler

type UserStore interface {
    FindByID(ctx context.Context, id string) (*User, error)
}

func NewHandler(store UserStore) *Handler {
    return &Handler{store: store}
}
```

## Concurrency

### Goroutines

```go
// ✓ Always handle goroutine lifecycle
func (s *Server) Start(ctx context.Context) error {
    g, ctx := errgroup.WithContext(ctx)

    g.Go(func() error {
        return s.runHTTP(ctx)
    })

    g.Go(func() error {
        return s.runGRPC(ctx)
    })

    return g.Wait()
}
```

### Channels

```go
// ✓ Prefer directional channels in signatures
func produce(out chan<- int)
func consume(in <-chan int)

// ✓ Close from sender only
func generate(n int) <-chan int {
    ch := make(chan int)
    go func() {
        defer close(ch)  // Sender closes
        for i := 0; i < n; i++ {
            ch <- i
        }
    }()
    return ch
}

// ✓ Select for multiple channels
select {
case msg := <-msgCh:
    handle(msg)
case <-ctx.Done():
    return ctx.Err()
case <-time.After(timeout):
    return ErrTimeout
}
```

### Sync Primitives

```go
// ✓ Mutex for shared state
type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

// ✓ RWMutex for read-heavy
type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func (c *Cache) Get(key string) (string, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    v, ok := c.data[key]
    return v, ok
}

// ✓ Once for initialization
var (
    instance *Service
    once     sync.Once
)

func GetService() *Service {
    once.Do(func() {
        instance = newService()
    })
    return instance
}
```

## Context

### Context Propagation

```go
// ✓ Context as first parameter
func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
    // Pass to downstream calls
    return s.repo.FindByID(ctx, id)
}

// ✓ Check cancellation in loops
for {
    select {
    case <-ctx.Done():
        return ctx.Err()
    default:
        // Continue work
    }
}
```

### Context Values (Sparingly)

```go
// ✓ Define key types
type contextKey string

const requestIDKey contextKey = "requestID"

func WithRequestID(ctx context.Context, id string) context.Context {
    return context.WithValue(ctx, requestIDKey, id)
}

func RequestIDFrom(ctx context.Context) string {
    if id, ok := ctx.Value(requestIDKey).(string); ok {
        return id
    }
    return ""
}
```

## HTTP

### Handler Pattern

```go
type Handler struct {
    userService UserService
    logger      *slog.Logger
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    userID := r.PathValue("id")  // Go 1.22+

    user, err := h.userService.GetByID(ctx, userID)
    if errors.Is(err, ErrNotFound) {
        http.Error(w, "user not found", http.StatusNotFound)
        return
    }
    if err != nil {
        h.logger.Error("failed to get user", "error", err)
        http.Error(w, "internal error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}
```

### Middleware

```go
func Logging(logger *slog.Logger) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            start := time.Now()

            next.ServeHTTP(w, r)

            logger.Info("request",
                "method", r.Method,
                "path", r.URL.Path,
                "duration", time.Since(start),
            )
        })
    }
}

// Usage with Go 1.22+ routing
mux := http.NewServeMux()
mux.HandleFunc("GET /users/{id}", handler.GetUser)
http.ListenAndServe(":8080", Logging(logger)(mux))
```

## Logging

### Structured Logging (slog)

```go
import "log/slog"

logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

// ✓ Structured fields
logger.Info("user created",
    "user_id", user.ID,
    "email", user.Email,
)

// ✓ With context
logger.InfoContext(ctx, "request processed",
    "duration_ms", duration.Milliseconds(),
)

// ✓ Error with stack
logger.Error("operation failed",
    "error", err,
    "user_id", userID,
)
```

## Testing

### Table-Driven Tests

```go
func TestParseSize(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    int64
        wantErr bool
    }{
        {"bytes", "100", 100, false},
        {"kilobytes", "1KB", 1024, false},
        {"invalid", "abc", 0, true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseSize(tt.input)
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

### Test Helpers

```go
func TestDB(t *testing.T) *sql.DB {
    t.Helper()
    db, err := sql.Open("sqlite3", ":memory:")
    if err != nil {
        t.Fatalf("failed to open db: %v", err)
    }
    t.Cleanup(func() { db.Close() })
    return db
}
```

### Mocks with Interfaces

```go
type mockUserRepo struct {
    users map[string]*User
}

func (m *mockUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
    if user, ok := m.users[id]; ok {
        return user, nil
    }
    return nil, ErrNotFound
}

func TestGetUser(t *testing.T) {
    repo := &mockUserRepo{
        users: map[string]*User{"1": {ID: "1", Name: "Alice"}},
    }
    svc := NewService(repo)

    user, err := svc.GetUser(context.Background(), "1")
    // assertions...
}
```

## Code Style

### Naming

```go
// ✓ MixedCaps, not underscores
var userID string      // not user_id
func GetHTTPClient()   // Acronyms in caps

// ✓ Short names for short scope
for i, v := range items { }
for _, user := range users { }

// ✓ Descriptive for package-level
var DefaultTimeout = 30 * time.Second
```

### Comments

```go
// ✓ Doc comments start with name
// Server handles HTTP requests for the user service.
type Server struct { ... }

// GetUser retrieves a user by ID.
// It returns ErrNotFound if the user doesn't exist.
func (s *Server) GetUser(ctx context.Context, id string) (*User, error)
```
