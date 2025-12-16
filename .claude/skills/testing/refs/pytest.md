# Pytest Testing

## Setup

### pyproject.toml

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_functions = ["test_*"]
addopts = "-ra -q --strict-markers"
markers = [
    "slow: marks tests as slow",
    "integration: integration tests",
]

[tool.coverage.run]
source = ["src"]
branch = true

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "if TYPE_CHECKING:",
]
```

### conftest.py

```python
# tests/conftest.py
import pytest

# Shared fixtures available to all tests
@pytest.fixture
def sample_user():
    return {"id": "1", "name": "Alice", "email": "alice@example.com"}
```

## Basic Tests

### Structure

```python
# test_user.py
import pytest
from myapp.user import create_user, UserError


class TestCreateUser:
    """Group related tests in classes."""

    def test_creates_user_with_valid_data(self):
        # Arrange
        data = {"name": "Alice", "email": "alice@example.com"}

        # Act
        user = create_user(data)

        # Assert
        assert user.name == "Alice"
        assert user.email == "alice@example.com"

    def test_raises_for_invalid_email(self):
        with pytest.raises(UserError, match="Invalid email"):
            create_user({"name": "Alice", "email": "invalid"})


# Or standalone functions
def test_user_has_id():
    user = create_user({"name": "Bob", "email": "bob@example.com"})
    assert user.id is not None
```

### Assertions

```python
# Basic
assert value == expected
assert value != other
assert value is None
assert value is not None

# Collections
assert item in collection
assert len(items) == 3
assert set(result) == {1, 2, 3}

# Approximate
assert value == pytest.approx(3.14, rel=1e-3)
assert value == pytest.approx(100, abs=0.5)

# Exceptions
with pytest.raises(ValueError):
    risky_function()

with pytest.raises(ValueError, match=r"invalid.*format"):
    parse("bad input")

# Warnings
with pytest.warns(DeprecationWarning):
    deprecated_function()
```

## Fixtures

### Basic Fixtures

```python
@pytest.fixture
def database():
    """Create test database."""
    db = create_test_db()
    yield db  # Provide to test
    db.close()  # Cleanup after test


def test_query(database):
    result = database.query("SELECT 1")
    assert result == [(1,)]
```

### Fixture Scopes

```python
@pytest.fixture(scope="function")  # Default: per test
def fresh_data(): ...

@pytest.fixture(scope="class")     # Per test class
def class_resource(): ...

@pytest.fixture(scope="module")    # Per test file
def module_db(): ...

@pytest.fixture(scope="session")   # Per test run
def expensive_setup(): ...
```

### Fixture Factories

```python
@pytest.fixture
def make_user():
    """Factory fixture for creating users."""
    created = []

    def _make_user(name: str = "Test", **kwargs):
        user = User(name=name, **kwargs)
        created.append(user)
        return user

    yield _make_user

    # Cleanup all created users
    for user in created:
        user.delete()


def test_multiple_users(make_user):
    alice = make_user("Alice", role="admin")
    bob = make_user("Bob", role="user")
    assert alice.role != bob.role
```

### Autouse Fixtures

```python
@pytest.fixture(autouse=True)
def reset_environment():
    """Runs before every test automatically."""
    os.environ.clear()
    yield
    os.environ.clear()
```

### Fixture Composition

```python
@pytest.fixture
def client(database, cache):
    """Depends on other fixtures."""
    return APIClient(db=database, cache=cache)
```

## Parametrization

### Basic Parametrize

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("PyTest", "PYTEST"),
])
def test_uppercase(input: str, expected: str):
    assert input.upper() == expected


@pytest.mark.parametrize("a,b,result", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a: int, b: int, result: int):
    assert add(a, b) == result
```

### Named Parameters

```python
@pytest.mark.parametrize("input,expected", [
    pytest.param("valid@email.com", True, id="valid_email"),
    pytest.param("no-at-sign", False, id="missing_at"),
    pytest.param("@no-local", False, id="missing_local"),
])
def test_email_validation(input: str, expected: bool):
    assert is_valid_email(input) == expected
```

### Multiple Parametrize (Cartesian Product)

```python
@pytest.mark.parametrize("x", [1, 2])
@pytest.mark.parametrize("y", [10, 20])
def test_multiply(x, y):
    # Runs 4 times: (1,10), (1,20), (2,10), (2,20)
    assert multiply(x, y) == x * y
```

### Parametrize Fixtures

```python
@pytest.fixture(params=["sqlite", "postgres"])
def database(request):
    db = create_db(request.param)
    yield db
    db.close()


def test_query(database):
    # Runs twice: once for sqlite, once for postgres
    assert database.query("SELECT 1")
```

## Mocking

### With pytest-mock (mocker fixture)

```python
def test_api_call(mocker):
    # Mock function
    mock_fetch = mocker.patch("myapp.api.fetch_data")
    mock_fetch.return_value = {"status": "ok"}

    result = process_data()

    mock_fetch.assert_called_once_with(timeout=30)
    assert result["status"] == "ok"


def test_method(mocker):
    # Mock method
    mocker.patch.object(UserService, "get_user", return_value=User(name="Alice"))

    user = UserService().get_user("123")
    assert user.name == "Alice"
```

### With unittest.mock

```python
from unittest.mock import Mock, patch, MagicMock, AsyncMock


def test_with_mock():
    mock_service = Mock()
    mock_service.get_user.return_value = User(name="Alice")

    result = handler(mock_service)

    mock_service.get_user.assert_called_once_with("123")


@patch("myapp.external.api_call")
def test_with_patch(mock_api):
    mock_api.return_value = {"data": "value"}

    result = function_using_api()

    assert result == "value"


# Context manager
def test_context_patch():
    with patch("myapp.time.now") as mock_now:
        mock_now.return_value = datetime(2024, 1, 1)
        assert get_current_date() == "2024-01-01"
```

### Async Mocking

```python
@pytest.mark.asyncio
async def test_async_function(mocker):
    mock_fetch = mocker.patch("myapp.fetch", new_callable=AsyncMock)
    mock_fetch.return_value = {"data": "value"}

    result = await process_async()

    assert result == "value"
```

## Async Testing

### With pytest-asyncio

```python
import pytest

@pytest.mark.asyncio
async def test_async_operation():
    result = await async_function()
    assert result == "expected"


@pytest.mark.asyncio
async def test_concurrent():
    results = await asyncio.gather(
        fetch_user("1"),
        fetch_user("2"),
    )
    assert len(results) == 2
```

### Async Fixtures

```python
@pytest.fixture
async def async_client():
    client = await create_async_client()
    yield client
    await client.close()


@pytest.mark.asyncio
async def test_with_async_fixture(async_client):
    response = await async_client.get("/users")
    assert response.status == 200
```

## Markers

### Built-in Markers

```python
@pytest.mark.skip(reason="Not implemented yet")
def test_future_feature(): ...

@pytest.mark.skipif(sys.version_info < (3, 10), reason="Requires 3.10+")
def test_new_syntax(): ...

@pytest.mark.xfail(reason="Known bug #123")
def test_known_failure(): ...

@pytest.mark.parametrize(...)  # Parametrization
```

### Custom Markers

```python
# conftest.py
def pytest_configure(config):
    config.addinivalue_line("markers", "slow: marks tests as slow")
    config.addinivalue_line("markers", "integration: integration tests")


# test_file.py
@pytest.mark.slow
def test_heavy_computation(): ...

@pytest.mark.integration
def test_database_connection(): ...

# Run: pytest -m "not slow"
# Run: pytest -m integration
```

## Test Organization

### Directory Structure

```
project/
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── user.py
│       └── api.py
├── tests/
│   ├── conftest.py       # Shared fixtures
│   ├── unit/
│   │   ├── test_user.py
│   │   └── test_api.py
│   ├── integration/
│   │   └── test_database.py
│   └── e2e/
│       └── test_workflow.py
└── pyproject.toml
```

### Fixture Files

```
tests/
├── conftest.py           # Root fixtures
├── fixtures/
│   ├── users.py          # User-related fixtures
│   └── database.py       # DB fixtures
└── unit/
    └── conftest.py       # Unit-specific fixtures
```

## CLI Commands

```bash
# Run all tests
pytest

# Verbose output
pytest -v

# Stop on first failure
pytest -x

# Run specific file
pytest tests/test_user.py

# Run specific test
pytest tests/test_user.py::test_create_user

# Run tests matching pattern
pytest -k "user and not slow"

# Run marked tests
pytest -m integration

# Show print output
pytest -s

# Coverage
pytest --cov=src --cov-report=html

# Parallel execution (pytest-xdist)
pytest -n auto

# Last failed only
pytest --lf

# Failed first
pytest --ff
```

## Plugins

| Plugin           | Purpose            |
| ---------------- | ------------------ |
| pytest-cov       | Coverage reports   |
| pytest-asyncio   | Async test support |
| pytest-mock      | mocker fixture     |
| pytest-xdist     | Parallel execution |
| pytest-timeout   | Test timeouts      |
| pytest-randomly  | Random test order  |
| pytest-sugar     | Better output      |
| pytest-httpx     | httpx mocking      |
| pytest-freezegun | Time mocking       |
