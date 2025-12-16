# Python Guidelines

## Project Structure

```
project/
├── pyproject.toml        # Package config (prefer over setup.py)
├── src/
│   └── package_name/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── models/
│       │   └── __init__.py
│       └── services/
│           └── __init__.py
├── tests/
│   ├── conftest.py       # Pytest fixtures
│   ├── test_main.py
│   └── integration/
├── .env.example
└── README.md
```

## Type Hints

### Basic Typing

```python
from typing import Optional, Union
from collections.abc import Sequence, Mapping

def greet(name: str, excited: bool = False) -> str:
    suffix = "!" if excited else "."
    return f"Hello, {name}{suffix}"

def find_user(user_id: str) -> Optional[User]:
    """Returns None if not found."""
    ...

def process(items: Sequence[int]) -> list[int]:
    return [x * 2 for x in items]
```

### Modern Syntax (3.10+)

```python
# ✓ Union with pipe
def parse(value: str | int) -> float: ...

# ✓ Optional shorthand
def find(id: str) -> User | None: ...

# ✓ Built-in generics
def process(items: list[str]) -> dict[str, int]: ...
```

### TypedDict for Structured Data

```python
from typing import TypedDict, NotRequired

class UserDict(TypedDict):
    id: str
    name: str
    email: str
    age: NotRequired[int]  # Optional key
```

### Protocols for Duck Typing

```python
from typing import Protocol

class Readable(Protocol):
    def read(self, n: int = -1) -> bytes: ...

def process(source: Readable) -> None:
    data = source.read()
    # Works with any object that has read()
```

## Dataclasses & Pydantic

### Dataclasses for Internal Data

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class User:
    id: str
    name: str
    email: str
    created_at: datetime = field(default_factory=datetime.now)
    tags: list[str] = field(default_factory=list)

    def __post_init__(self):
        self.email = self.email.lower()

# ✓ Frozen for immutability
@dataclass(frozen=True)
class Point:
    x: float
    y: float
```

### Pydantic for External Data

```python
from pydantic import BaseModel, EmailStr, Field, field_validator

class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('name cannot be blank')
        return v.strip()

# ✓ Automatic validation on instantiation
user = CreateUserRequest(name="Alice", email="alice@example.com", age=30)
```

## Error Handling

### Custom Exceptions

```python
class AppError(Exception):
    """Base application error."""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR"):
        super().__init__(message)
        self.code = code

class NotFoundError(AppError):
    def __init__(self, resource: str):
        super().__init__(f"{resource} not found", "NOT_FOUND")

class ValidationError(AppError):
    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR")
```

### Exception Handling

```python
# ✓ Specific exceptions
try:
    user = find_user(user_id)
except NotFoundError:
    return None
except DatabaseError as e:
    logger.error("Database error", exc_info=True)
    raise AppError("Service unavailable") from e

# ✗ Avoid bare except
try:
    ...
except:  # Catches everything including KeyboardInterrupt
    pass

# ✓ Use Exception or specific types
except Exception as e:
    ...
```

### Context Managers

```python
from contextlib import contextmanager

@contextmanager
def database_transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# Usage
with database_transaction(get_connection()) as conn:
    conn.execute(...)
```

## Async Python

### Async/Await

```python
import asyncio
import httpx

async def fetch_user(user_id: str) -> User:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"/users/{user_id}")
        response.raise_for_status()
        return User(**response.json())

# ✓ Concurrent execution
async def fetch_all(ids: list[str]) -> list[User]:
    tasks = [fetch_user(id) for id in ids]
    return await asyncio.gather(*tasks)
```

### Async Context Managers

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_session():
    session = await create_session()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
```

## Code Style

### Naming Conventions

```python
# Variables, functions: snake_case
user_name = "alice"
def get_user_by_id(user_id: str) -> User: ...

# Classes: PascalCase
class UserService: ...

# Constants: UPPER_SNAKE_CASE
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30

# Private: leading underscore
def _internal_helper(): ...
class _PrivateClass: ...
```

### Imports

```python
# ✓ Standard order: stdlib, third-party, local
import os
import sys
from datetime import datetime

import httpx
from pydantic import BaseModel

from .models import User
from .services import user_service

# ✗ Avoid wildcard imports
from module import *

# ✓ Explicit imports
from module import specific_function, SpecificClass
```

### f-strings

```python
# ✓ Prefer f-strings
name = "Alice"
message = f"Hello, {name}!"

# ✓ Format specifiers
value = 3.14159
formatted = f"{value:.2f}"  # "3.14"

# ✓ Expressions
items = [1, 2, 3]
message = f"Count: {len(items)}"
```

## Testing

### Pytest Basics

```python
import pytest

def test_user_creation():
    user = User(name="Alice", email="alice@example.com")
    assert user.name == "Alice"
    assert user.email == "alice@example.com"

def test_invalid_email_raises():
    with pytest.raises(ValidationError):
        User(name="Alice", email="invalid")

@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
])
def test_uppercase(input: str, expected: str):
    assert input.upper() == expected
```

### Fixtures

```python
# conftest.py
import pytest

@pytest.fixture
def sample_user() -> User:
    return User(id="1", name="Test", email="test@example.com")

@pytest.fixture
async def async_client():
    async with httpx.AsyncClient(app=app) as client:
        yield client

# Usage in tests
def test_user_service(sample_user: User):
    result = process(sample_user)
    assert result.processed
```

### Mocking

```python
from unittest.mock import Mock, patch, AsyncMock

def test_with_mock():
    mock_service = Mock()
    mock_service.get_user.return_value = User(...)

    result = handler(mock_service)

    mock_service.get_user.assert_called_once_with("123")

@patch("module.external_api")
def test_with_patch(mock_api):
    mock_api.return_value = {"status": "ok"}
    result = function_using_api()
    assert result.success

# Async mocking
async def test_async():
    mock = AsyncMock(return_value=User(...))
    result = await service_using(mock)
```

## Tools

### pyproject.toml

```toml
[project]
name = "myproject"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.24",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "ruff>=0.1",
    "mypy>=1.0",
]

[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "UP", "B"]

[tool.mypy]
strict = true
```

### Ruff for Linting

```bash
ruff check .          # Lint
ruff check --fix .    # Auto-fix
ruff format .         # Format (like black)
```

### uv for Package Management

```bash
uv venv              # Create virtualenv
uv pip install -e ".[dev]"  # Install with dev deps
uv pip compile       # Lock dependencies
```
