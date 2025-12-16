# C/C++ Review Rules

## Memory Safety

### Buffer Overflows

```c
// BAD: no bounds checking
char buf[64];
strcpy(buf, user_input);  // overflow risk
gets(buf);                // NEVER use

// GOOD
strncpy(buf, user_input, sizeof(buf) - 1);
buf[sizeof(buf) - 1] = '\0';
// Or use snprintf, strlcpy
```

### Memory Leaks

```c
// BAD: leak on error path
void* ptr = malloc(size);
if (error) return NULL;  // leak!

// GOOD
void* ptr = malloc(size);
if (error) {
    free(ptr);
    return NULL;
}

// C++: Use RAII
auto ptr = std::make_unique<MyClass>();
// auto cleanup on scope exit
```

### Use-After-Free / Double-Free

```c
// BAD
free(ptr);
ptr->field = value;  // UAF!
free(ptr);           // double-free!

// GOOD
free(ptr);
ptr = NULL;
```

## C++-Specific

### Smart Pointers

```cpp
// Prefer smart pointers over raw
std::unique_ptr<Foo> p = std::make_unique<Foo>();
std::shared_ptr<Bar> s = std::make_shared<Bar>();

// Use weak_ptr to break cycles
// Raw pointers OK for non-owning references
```

### RAII

```cpp
// BAD
mutex.lock();
doWork();  // exception = deadlock
mutex.unlock();

// GOOD
std::lock_guard<std::mutex> lock(mutex);
doWork();
// auto unlock on scope exit
```

### Move Semantics

```cpp
// Return by value (RVO/move)
std::vector<int> createVector();

// Accept by value + move for sink params
void setData(std::vector<int> data) {
    this->data = std::move(data);
}
```

## Security

```c
// Format string vulnerabilities
printf(user_input);           // BAD
printf("%s", user_input);     // GOOD

// Integer overflow
if (a + b > MAX) { }         // BAD: overflow before check
if (a > MAX - b) { }         // GOOD

// Use safe functions
// strncpy, snprintf, strncat over str*, sprintf, strcat
```

## Common Bugs

- Uninitialized variables
- Off-by-one errors in loops
- Signed/unsigned comparison
- Null pointer dereference
- Missing virtual destructor in base class (C++)
- Exception safety (C++)

## Style

- Consistent naming (snake_case or camelCase)
- Braces on all control structures
- Const correctness
- Prefer references over pointers when null not valid
- Include guards / #pragma once
