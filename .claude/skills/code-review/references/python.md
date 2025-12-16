# Python Review Rules

## Type Hints

- Use type hints for public APIs
- `Optional[X]` for nullable, `X | None` (3.10+)
- `typing.Protocol` for structural subtyping
- Prefer `list[str]` over `List[str]` (3.9+)

## Common Issues

### Security

```python
# BAD: SQL injection
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
# GOOD
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))

# BAD: command injection
os.system(f"process {filename}")
# GOOD
subprocess.run(["process", filename], check=True)

# BAD: unsafe pickle
pickle.loads(user_data)
# GOOD: use json, or validate source
json.loads(user_data)

# BAD: path traversal
open(f"uploads/{user_filename}")
# GOOD
safe_path = Path("uploads") / Path(user_filename).name
```

### Resource Management

```python
# BAD: resource leak
f = open("file.txt")
data = f.read()
# GOOD
with open("file.txt") as f:
    data = f.read()

# GOOD: multiple resources
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read())
```

### Exception Handling

```python
# BAD: bare except
try: risky()
except: pass
# GOOD
try: risky()
except SpecificError as e:
    logger.error(e)
    raise

# BAD: swallowing exceptions
except Exception: return None
```

### Performance

```python
# BAD: repeated list append in loop
result = []
for x in big_list:
    result.append(transform(x))
# GOOD
result = [transform(x) for x in big_list]

# BAD: string concat in loop
s = ""
for x in items: s += str(x)
# GOOD
s = "".join(str(x) for x in items)
```

## Style (PEP 8)

- `snake_case` for functions/variables
- `PascalCase` for classes
- `UPPER_CASE` for constants
- Max line length: 88-120 chars
- Docstrings for public functions (Google/NumPy style)
