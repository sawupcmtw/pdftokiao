# Rust Guidelines

## Project Structure

```
project/
├── Cargo.toml
├── src/
│   ├── main.rs           # Binary entry
│   ├── lib.rs            # Library root (if both bin and lib)
│   ├── config.rs
│   ├── error.rs          # Custom error types
│   ├── models/
│   │   └── mod.rs
│   └── services/
│       └── mod.rs
├── tests/                # Integration tests
│   └── integration.rs
├── benches/              # Benchmarks
└── examples/
```

## Error Handling

### Custom Error Type

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("not found: {0}")]
    NotFound(String),

    #[error("validation failed: {0}")]
    Validation(String),

    #[error("database error")]
    Database(#[from] sqlx::Error),

    #[error("io error")]
    Io(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, AppError>;
```

### Error Propagation

```rust
// ✓ Use ? operator
fn read_config(path: &Path) -> Result<Config> {
    let content = fs::read_to_string(path)?;
    let config: Config = toml::from_str(&content)?;
    Ok(config)
}

// ✓ Add context with anyhow
use anyhow::{Context, Result};

fn read_config(path: &Path) -> Result<Config> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("failed to read {}", path.display()))?;
    // ...
}
```

### When to Panic

```rust
// ✓ Panic: unrecoverable, programmer error
let config = Config::from_env().expect("CONFIG_PATH must be set");

// ✓ Result: recoverable, expected failure
fn find_user(id: &str) -> Result<Option<User>>

// ✗ Don't panic in libraries for recoverable errors
```

## Ownership Patterns

### Borrowing Rules

```rust
// ✓ Prefer borrowing over ownership transfer
fn process(data: &[u8]) -> Result<()>      // Borrow slice
fn process(data: &str) -> Result<()>       // Borrow string

// ✓ Take ownership when needed
fn spawn_task(data: Vec<u8>) -> JoinHandle  // Needs to own for thread
fn consume(item: Item)                       // Intentionally consumes
```

### Clone Consciously

```rust
// ✗ Avoid unnecessary clones
let name = user.name.clone();  // Do we need ownership?

// ✓ Borrow if possible
let name = &user.name;

// ✓ Clone when actually needed
let name = user.name.clone();  // Sending to another thread
```

### Interior Mutability

```rust
use std::cell::RefCell;
use std::sync::{Arc, Mutex, RwLock};

// Single-threaded
RefCell<T>    // Runtime borrow checking

// Multi-threaded
Arc<Mutex<T>>     // Exclusive access
Arc<RwLock<T>>    // Multiple readers, single writer
```

## Structs & Enums

### Builder Pattern

```rust
#[derive(Default)]
pub struct RequestBuilder {
    url: String,
    method: Method,
    headers: HashMap<String, String>,
    timeout: Option<Duration>,
}

impl RequestBuilder {
    pub fn url(mut self, url: impl Into<String>) -> Self {
        self.url = url.into();
        self
    }

    pub fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.insert(key.to_string(), value.to_string());
        self
    }

    pub fn build(self) -> Result<Request> {
        // Validate and construct
    }
}

// Usage
let req = RequestBuilder::default()
    .url("https://api.example.com")
    .header("Authorization", "Bearer token")
    .build()?;
```

### Newtype Pattern

```rust
// ✓ Type safety for primitives
pub struct UserId(String);
pub struct Email(String);

impl Email {
    pub fn new(s: &str) -> Result<Self> {
        // Validate email format
        Ok(Self(s.to_string()))
    }
}

// Compiler prevents: find_user(email) when expecting UserId
```

### Enum State Machines

```rust
pub enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { session_id: String },
    Error { reason: String },
}

impl ConnectionState {
    pub fn connect(&mut self) {
        *self = match self {
            Self::Disconnected => Self::Connecting { attempt: 1 },
            Self::Error { .. } => Self::Connecting { attempt: 1 },
            _ => return,
        };
    }
}
```

## Traits

### Defining Traits

```rust
pub trait Repository {
    type Item;
    type Error;

    fn find(&self, id: &str) -> Result<Option<Self::Item>, Self::Error>;
    fn save(&self, item: &Self::Item) -> Result<(), Self::Error>;
}
```

### Trait Bounds

```rust
// ✓ Single bound
fn print<T: Display>(item: T)

// ✓ Multiple bounds with where
fn process<T, U>(item: T, other: U) -> Result<()>
where
    T: Serialize + Send,
    U: Repository<Item = T>,
```

### Common Derives

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]  // Value types
#[derive(Debug, Default)]                       // Config/builder
#[derive(Serialize, Deserialize)]               // Data transfer
```

## Async Rust

### Tokio Patterns

```rust
use tokio::sync::{mpsc, oneshot};

// ✓ Spawn for background work
tokio::spawn(async move {
    process(data).await
});

// ✓ Channels for communication
let (tx, mut rx) = mpsc::channel(32);

// ✓ Select for multiple futures
tokio::select! {
    result = operation() => handle(result),
    _ = shutdown.recv() => return,
}
```

### Avoid Blocking

```rust
// ✗ Don't block async runtime
std::thread::sleep(Duration::from_secs(1));
std::fs::read_to_string(path);

// ✓ Use async equivalents or spawn_blocking
tokio::time::sleep(Duration::from_secs(1)).await;
tokio::fs::read_to_string(path).await;

// For CPU-heavy work
tokio::task::spawn_blocking(|| expensive_computation()).await
```

## Performance

### Prefer Stack Allocation

```rust
// ✓ Stack (fixed size, known at compile time)
let buffer: [u8; 1024] = [0; 1024];

// Heap (dynamic size)
let buffer: Vec<u8> = vec![0; size];
```

### Cow for Flexibility

```rust
use std::borrow::Cow;

fn process(input: Cow<str>) -> Cow<str> {
    if needs_modification(&input) {
        Cow::Owned(modify(&input))
    } else {
        input  // No allocation if unchanged
    }
}
```

## Idiomatic Patterns

### Option/Result Combinators

```rust
// ✓ Chain operations
let value = map.get("key")
    .filter(|v| v.is_valid())
    .map(|v| v.process())
    .unwrap_or_default();

// ✓ Early return with ?
let user = find_user(id)?.ok_or(AppError::NotFound)?;
```

### Iterators Over Loops

```rust
// ✓ Functional style
let sum: i32 = items.iter()
    .filter(|x| x.active)
    .map(|x| x.value)
    .sum();

// ✓ Collect with turbofish
let names: Vec<_> = users.iter().map(|u| &u.name).collect();
```

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_valid() {
        let result = parse("valid input");
        assert!(result.is_ok());
    }

    #[test]
    #[should_panic(expected = "invalid")]
    fn test_parse_panics() {
        parse("").unwrap();
    }
}

// Integration test in tests/
#[tokio::test]
async fn test_api_endpoint() {
    // ...
}
```

## Clippy Lints

```toml
# Cargo.toml or .clippy.toml
[lints.clippy]
pedantic = "warn"
nursery = "warn"
unwrap_used = "warn"
expect_used = "warn"
```
