# TypeScript Guidelines

## Strict Mode Essentials

### tsconfig.json Baseline

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Never Disable Strict Checks

```ts
// ✗ Avoid
// @ts-ignore
// @ts-expect-error (unless temporary with issue link)
as any
```

## Type Design

### Prefer Interfaces for Objects

```ts
// ✓ Interface: extendable, clear intent
interface User {
  id: string
  name: string
  email: string
}

// ✓ Type: unions, intersections, mapped types
type Status = 'idle' | 'loading' | 'success' | 'error'
type UserWithRole = User & { role: Role }
```

### Be Explicit About Nullability

```ts
// ✓ Clear contract
interface Config {
  required: string
  optional?: string // May be undefined
  nullable: string | null // Explicitly null
}

// ✓ Handle with narrowing
function greet(name: string | null) {
  if (name === null) return 'Hello, guest'
  return `Hello, ${name}`
}
```

### Discriminated Unions for State

```ts
// ✓ Exhaustive, type-safe state handling
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function render(state: AsyncState<User>) {
  switch (state.status) {
    case 'idle': return <Idle />
    case 'loading': return <Spinner />
    case 'success': return <Profile user={state.data} />
    case 'error': return <Error message={state.error.message} />
  }
}
```

### Const Assertions

```ts
// ✓ Literal types, readonly
const ROUTES = {
  home: '/',
  about: '/about',
  user: '/user/:id',
} as const

type Route = (typeof ROUTES)[keyof typeof ROUTES]
// => '/' | '/about' | '/user/:id'
```

## Functions

### Parameter Objects Over Many Args

```ts
// ✗ Hard to read, easy to misorder
function createUser(name: string, email: string, age: number, role: string)

// ✓ Clear, extensible
interface CreateUserParams {
  name: string
  email: string
  age: number
  role: Role
}
function createUser(params: CreateUserParams)
```

### Return Type Inference vs Explicit

```ts
// ✓ Let TS infer for internal functions
function double(n: number) {
  return n * 2 // TS infers: number
}

// ✓ Explicit for public APIs, complex returns
export function fetchUser(id: string): Promise<User | null> {
  // ...
}
```

### Generic Constraints

```ts
// ✓ Constrain generics meaningfully
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// ✓ Default generic parameters
function createStore<T = Record<string, unknown>>(): Store<T>
```

## Type Utilities

### Built-in Utilities

```ts
Partial<T> // All properties optional
Required<T> // All properties required
Readonly<T> // All properties readonly
Pick<T, K> // Subset of properties
Omit<T, K> // Exclude properties
Record<K, V> // Object with key type K, value type V
ReturnType<F> // Return type of function
Parameters<F> // Parameter types as tuple
Awaited<P> // Unwrap Promise type
```

### Custom Utility Types

```ts
// Non-nullable version
type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
```

## Type Guards

### User-Defined Type Guards

```ts
// ✓ Narrows type in conditional branches
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'email' in value
}

// Usage
if (isUser(data)) {
  console.log(data.email) // TS knows it's User
}
```

### Assertion Functions

```ts
function assertNonNull<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Expected non-null value')
  }
}
```

## Module Patterns

### Barrel Exports (index.ts)

```ts
// components/index.ts
export { Button } from './Button'
export { Input } from './Input'
export type { ButtonProps, InputProps } from './types'

// ✓ Explicit type exports for clarity
```

### Avoid Circular Dependencies

```ts
// ✗ types.ts imports from utils.ts which imports from types.ts

// ✓ Shared types in dedicated file
// ✓ Dependency injection over direct import
```

## Anti-Patterns

| Avoid                        | Instead                    |
| ---------------------------- | -------------------------- |
| `any`                        | `unknown` + type guard     |
| Type assertion without check | Type guard or validation   |
| `!` non-null assertion       | Proper null handling       |
| Enum (runtime overhead)      | `as const` object or union |
| `namespace`                  | ES modules                 |
| `/// <reference>`            | Import statements          |

## Zod for Runtime Validation

```ts
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().positive(),
})

type User = z.infer<typeof UserSchema>

// Runtime validation
const result = UserSchema.safeParse(data)
if (result.success) {
  // result.data is typed as User
}
```
