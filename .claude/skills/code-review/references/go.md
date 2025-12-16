# Go Review Rules

## Error Handling

```go
// BAD: ignored error
result, _ := doSomething()

// GOOD
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doSomething failed: %w", err)
}

// BAD: panic for recoverable errors
panic("user not found")
// Reserve panic for truly unrecoverable states
```

## Common Issues

### Concurrency

```go
// BAD: data race
go func() { shared++ }()

// GOOD: use mutex or channel
mu.Lock()
shared++
mu.Unlock()

// BAD: goroutine leak
go func() {
    for v := range ch { process(v) }
}()
// Ensure channel is closed or use context cancellation

// BAD: unbounded goroutines
for _, item := range items {
    go process(item) // could spawn millions
}
// GOOD: use worker pool or semaphore
```

### Resource Leaks

```go
// BAD: unclosed response body
resp, _ := http.Get(url)
// GOOD
resp, err := http.Get(url)
if err != nil { return err }
defer resp.Body.Close()

// BAD: unclosed rows
rows, _ := db.Query(query)
for rows.Next() { ... }
// GOOD
defer rows.Close()
```

### Context

```go
// BAD: context.Background() in request handler
// GOOD: propagate request context
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    result, err := service.Do(ctx, input)
}

// Always check context cancellation in long operations
select {
case <-ctx.Done():
    return ctx.Err()
case result := <-ch:
    return result, nil
}
```

### Nil Checks

```go
// BAD: nil map write
var m map[string]int
m["key"] = 1 // panic
// GOOD
m := make(map[string]int)

// Check interface nil correctly
var i interface{} = (*MyType)(nil)
if i != nil { } // true! interface wraps typed nil
```

## Style

- `gofmt` / `goimports` for formatting
- Short variable names in small scopes
- Receiver names: 1-2 letters, consistent
- Don't stutter: `http.Server` not `http.HTTPServer`
- Accept interfaces, return structs
