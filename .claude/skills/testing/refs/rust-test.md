# Rust Testing

## Unit Tests

### In-Module Tests

```rust
// src/lib.rs or src/module.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_add_negative() {
        assert_eq!(add(-1, 1), 0);
    }
}
```

### Test Attributes

```rust
#[test]
fn basic_test() { }

#[test]
#[ignore]  // Skip by default, run with --ignored
fn slow_test() { }

#[test]
#[should_panic]
fn test_panic() {
    panic!("expected");
}

#[test]
#[should_panic(expected = "invalid input")]
fn test_specific_panic() {
    panic!("invalid input: foo");
}
```

## Assertions

### Standard Macros

```rust
// Equality
assert_eq!(result, expected);
assert_ne!(result, other);

// Boolean
assert!(condition);
assert!(value > 0);

// With message
assert_eq!(result, expected, "result was {}", result);
assert!(valid, "validation failed for {}", input);

// Debug output on failure
assert_eq!(complex_struct, expected);  // Uses Debug trait
```

### Floating Point

```rust
// Don't use assert_eq! for floats
assert!((result - expected).abs() < f64::EPSILON);

// Or use approx crate
use approx::assert_relative_eq;
assert_relative_eq!(result, expected, epsilon = 1e-10);
```

## Result-Based Tests

```rust
#[test]
fn test_parse() -> Result<(), ParseError> {
    let value = parse("42")?;
    assert_eq!(value, 42);
    Ok(())
}

// With anyhow
use anyhow::Result;

#[test]
fn test_complex() -> Result<()> {
    let config = load_config("test.toml")?;
    let result = process(&config)?;
    assert_eq!(result.status, Status::Ok);
    Ok(())
}
```

## Integration Tests

### Structure

```
project/
├── src/
│   ├── lib.rs
│   └── main.rs
├── tests/           # Integration tests
│   ├── common/
│   │   └── mod.rs   # Shared helpers
│   ├── api_tests.rs
│   └── db_tests.rs
└── Cargo.toml
```

### Integration Test File

```rust
// tests/api_tests.rs
use my_crate::Client;

mod common;

#[test]
fn test_api_request() {
    let client = common::setup_client();
    let response = client.get("/users").unwrap();
    assert_eq!(response.status(), 200);
}
```

### Shared Test Utilities

```rust
// tests/common/mod.rs
use my_crate::Client;

pub fn setup_client() -> Client {
    Client::new("http://localhost:8080")
}

pub fn create_test_user() -> User {
    User {
        id: "test-123".to_string(),
        name: "Test User".to_string(),
    }
}
```

## Test Organization

### Module Tests

```rust
// src/user.rs
pub struct User { /* ... */ }

impl User {
    pub fn new(name: &str) -> Self { /* ... */ }
    pub fn validate(&self) -> bool { /* ... */ }
}

#[cfg(test)]
mod tests {
    use super::*;

    mod new {
        use super::*;

        #[test]
        fn creates_user_with_name() {
            let user = User::new("Alice");
            assert_eq!(user.name, "Alice");
        }
    }

    mod validate {
        use super::*;

        #[test]
        fn returns_true_for_valid_user() {
            let user = User::new("Alice");
            assert!(user.validate());
        }

        #[test]
        fn returns_false_for_empty_name() {
            let user = User::new("");
            assert!(!user.validate());
        }
    }
}
```

## Test Fixtures & Setup

### Setup/Teardown Pattern

```rust
struct TestContext {
    db: Database,
    client: Client,
}

impl TestContext {
    fn new() -> Self {
        Self {
            db: Database::new_test(),
            client: Client::new_test(),
        }
    }
}

impl Drop for TestContext {
    fn drop(&mut self) {
        self.db.cleanup();
    }
}

#[test]
fn test_with_context() {
    let ctx = TestContext::new();
    // Test code...
    // Cleanup happens automatically via Drop
}
```

### Test Builders

```rust
#[derive(Default)]
struct UserBuilder {
    name: Option<String>,
    email: Option<String>,
    age: Option<u32>,
}

impl UserBuilder {
    fn name(mut self, name: &str) -> Self {
        self.name = Some(name.to_string());
        self
    }

    fn email(mut self, email: &str) -> Self {
        self.email = Some(email.to_string());
        self
    }

    fn build(self) -> User {
        User {
            name: self.name.unwrap_or_else(|| "Test".to_string()),
            email: self.email.unwrap_or_else(|| "test@example.com".to_string()),
            age: self.age.unwrap_or(25),
        }
    }
}

#[test]
fn test_user_creation() {
    let user = UserBuilder::default()
        .name("Alice")
        .email("alice@example.com")
        .build();

    assert_eq!(user.name, "Alice");
}
```

## Mocking

### Trait-Based Mocking

```rust
trait UserRepository {
    fn find(&self, id: &str) -> Option<User>;
    fn save(&self, user: &User) -> Result<(), Error>;
}

// Real implementation
struct PostgresUserRepo { /* ... */ }
impl UserRepository for PostgresUserRepo { /* ... */ }

// Mock implementation
#[cfg(test)]
struct MockUserRepo {
    users: std::collections::HashMap<String, User>,
}

#[cfg(test)]
impl UserRepository for MockUserRepo {
    fn find(&self, id: &str) -> Option<User> {
        self.users.get(id).cloned()
    }

    fn save(&self, _user: &User) -> Result<(), Error> {
        Ok(())
    }
}

#[test]
fn test_user_service() {
    let mut repo = MockUserRepo { users: HashMap::new() };
    repo.users.insert("123".to_string(), User::new("Alice"));

    let service = UserService::new(Box::new(repo));
    let user = service.get_user("123").unwrap();

    assert_eq!(user.name, "Alice");
}
```

### mockall Crate

```rust
use mockall::{automock, predicate::*};

#[automock]
trait Database {
    fn get(&self, key: &str) -> Option<String>;
    fn set(&self, key: &str, value: &str) -> Result<(), Error>;
}

#[test]
fn test_with_mockall() {
    let mut mock = MockDatabase::new();

    mock.expect_get()
        .with(eq("user:123"))
        .returning(|_| Some("Alice".to_string()));

    mock.expect_set()
        .times(1)
        .returning(|_, _| Ok(()));

    // Use mock...
}
```

## Async Testing

### tokio::test

```rust
#[tokio::test]
async fn test_async_function() {
    let result = fetch_data().await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_with_timeout() {
    let result = tokio::time::timeout(
        Duration::from_secs(5),
        slow_operation()
    ).await;

    assert!(result.is_ok());
}
```

### Multi-threaded Runtime

```rust
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_concurrent() {
    let (tx, mut rx) = tokio::sync::mpsc::channel(10);

    tokio::spawn(async move {
        tx.send("hello").await.unwrap();
    });

    let msg = rx.recv().await.unwrap();
    assert_eq!(msg, "hello");
}
```

## Property Testing (proptest)

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_sort_is_sorted(mut vec: Vec<i32>) {
        vec.sort();
        for window in vec.windows(2) {
            prop_assert!(window[0] <= window[1]);
        }
    }

    #[test]
    fn test_parse_roundtrip(value: i32) {
        let s = value.to_string();
        let parsed: i32 = s.parse().unwrap();
        prop_assert_eq!(parsed, value);
    }
}

// Custom strategies
proptest! {
    #[test]
    fn test_email(
        local in "[a-z]{1,10}",
        domain in "[a-z]{1,10}\\.(com|org|net)"
    ) {
        let email = format!("{}@{}", local, domain);
        prop_assert!(is_valid_email(&email));
    }
}
```

## Snapshot Testing (insta)

```rust
use insta::assert_snapshot;
use insta::assert_debug_snapshot;
use insta::assert_json_snapshot;

#[test]
fn test_render() {
    let output = render_template(data);
    assert_snapshot!(output);
}

#[test]
fn test_struct() {
    let user = get_user();
    assert_debug_snapshot!(user);
}

#[test]
fn test_json() {
    let response = api_call();
    assert_json_snapshot!(response);
}

// Review: cargo insta review
// Update: cargo insta accept
```

## Benchmarking (criterion)

### Cargo.toml

```toml
[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "my_benchmark"
harness = false
```

### Benchmark File

```rust
// benches/my_benchmark.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn bench_fibonacci(c: &mut Criterion) {
    c.bench_function("fib 20", |b| {
        b.iter(|| fibonacci(black_box(20)))
    });
}

fn bench_comparison(c: &mut Criterion) {
    let mut group = c.benchmark_group("sorting");

    for size in [100, 1000, 10000] {
        group.bench_with_input(
            format!("size_{}", size),
            &size,
            |b, &size| {
                let data: Vec<i32> = (0..size).collect();
                b.iter(|| data.clone().sort())
            },
        );
    }

    group.finish();
}

criterion_group!(benches, bench_fibonacci, bench_comparison);
criterion_main!(benches);
```

## Test Configuration

### Cargo.toml Features

```toml
[features]
test-utils = []

[dev-dependencies]
tokio = { version = "1", features = ["test-util", "macros", "rt-multi-thread"] }
```

### Conditional Compilation

```rust
#[cfg(test)]
mod tests {
    // Only compiled for tests
}

#[cfg(feature = "test-utils")]
pub mod test_helpers {
    // Only with test-utils feature
}
```

## CLI Commands

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run tests in module
cargo test module_name::

# Run ignored tests
cargo test -- --ignored

# Run all including ignored
cargo test -- --include-ignored

# Show output
cargo test -- --nocapture

# Single thread
cargo test -- --test-threads=1

# List tests
cargo test -- --list

# Run benchmarks
cargo bench

# Doc tests only
cargo test --doc

# Integration tests only
cargo test --test integration_test_file
```

## Useful Crates

| Crate      | Purpose                 |
| ---------- | ----------------------- |
| mockall    | Mocking framework       |
| proptest   | Property-based testing  |
| insta      | Snapshot testing        |
| criterion  | Benchmarking            |
| fake       | Test data generation    |
| wiremock   | HTTP mocking            |
| tokio-test | Async testing utilities |
| assert_cmd | CLI testing             |
| tempfile   | Temporary files/dirs    |
