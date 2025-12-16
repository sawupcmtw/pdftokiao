# Java/Kotlin Review Rules

## Java-Specific

### Null Safety

```java
// BAD: potential NPE
String name = user.getName().trim();
// GOOD
String name = Optional.ofNullable(user.getName())
    .map(String::trim)
    .orElse("");

// Use @Nullable/@NonNull annotations
```

### Resource Management

```java
// BAD: resource leak
InputStream is = new FileInputStream(file);
// GOOD
try (InputStream is = new FileInputStream(file)) {
    // use stream
}
```

### Concurrency

```java
// BAD: shared mutable state
private List<User> users = new ArrayList<>();
public void add(User u) { users.add(u); }

// GOOD: thread-safe
private final List<User> users = Collections.synchronizedList(new ArrayList<>());
// OR use ConcurrentHashMap, CopyOnWriteArrayList, etc.

// Prefer immutable objects
// Use CompletableFuture over raw threads
```

### Security

```java
// BAD: SQL injection
stmt.execute("SELECT * FROM users WHERE id = " + userId);
// GOOD
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
ps.setString(1, userId);
```

## Kotlin-Specific

### Null Safety

```kotlin
// Use nullable types properly
val name: String? = user?.name
val trimmed = name?.trim() ?: ""

// Avoid !! except when truly impossible
val value = nullable!! // BAD in most cases
```

### Idioms

```kotlin
// Use data classes for DTOs
data class User(val id: Long, val name: String)

// Use sealed classes for state
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
}

// Prefer val over var
// Use when instead of if-else chains
// Use scope functions appropriately (let, run, apply, also, with)
```

### Coroutines

```kotlin
// Use structured concurrency
coroutineScope {
    launch { task1() }
    launch { task2() }
}

// Handle exceptions properly
supervisorScope { /* for independent child failures */ }

// Avoid GlobalScope
```

## Style (Both)

- Follow official style guides
- Meaningful names (avoid abbreviations)
- Keep classes focused (SRP)
- Prefer composition over inheritance
- Document public APIs with KDoc/Javadoc
