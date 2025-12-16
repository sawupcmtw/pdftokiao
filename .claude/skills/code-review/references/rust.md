# Rust Review Rules

## Ownership & Borrowing

```rust
// Prefer borrowing over cloning
fn process(data: &Vec<u8>) // GOOD
fn process(data: Vec<u8>)  // takes ownership, maybe unnecessary

// BAD: unnecessary clone
let result = expensive_data.clone();
process(&result);
// GOOD
process(&expensive_data);

// Use Cow for conditional ownership
fn process(input: Cow<str>) -> String
```

## Common Issues

### Error Handling

```rust
// BAD: unwrap in library/production code
let value = result.unwrap();

// GOOD: propagate with ?
let value = result?;

// GOOD: provide context
let value = result.context("failed to parse config")?;

// Use thiserror for library errors, anyhow for apps
```

### Unsafe Code

```rust
// Review every unsafe block carefully:
// - Is it actually necessary?
// - Are invariants documented?
// - Is the unsafe surface minimized?

unsafe {
    // DOCUMENT: why this is safe
    // - pointer is valid because...
    // - no aliasing because...
}
```

### Performance Pitfalls

```rust
// BAD: repeated allocation
let mut v = Vec::new();
for i in 0..1000 { v.push(i); }
// GOOD
let mut v = Vec::with_capacity(1000);

// BAD: unnecessary collect
iter.collect::<Vec<_>>().iter().map(...)
// GOOD: chain iterators
iter.map(...)

// Avoid .clone() in hot paths
// Prefer references or Rc/Arc when needed
```

### Concurrency

```rust
// Prefer channels over shared state
// Use Arc<Mutex<T>> not Rc<RefCell<T>> for threads
// Consider parking_lot for better mutex perf

// Check for deadlock potential:
// - Consistent lock ordering
// - No holding locks across await points
```

### Lifetimes

```rust
// Explicit when clarity needed
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str

// Avoid 'static unless truly needed
// Watch for hidden 'static in async blocks
```

## Style

- `rustfmt` for formatting
- `clippy` lints should pass
- Prefer `expect("reason")` over `unwrap()` when used
- Document pub items with `///`
- Use `#[must_use]` for important return values
