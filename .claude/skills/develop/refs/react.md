# React Guidelines

## Component Design

### Structure

```
ComponentName/
├── index.ts          # Re-export
├── ComponentName.tsx # Implementation
├── ComponentName.test.tsx
├── ComponentName.module.css  # or .styles.ts
└── useComponentLogic.ts      # Complex hook extraction
```

### Prefer Functional Components

```tsx
// ✓ Good
function UserCard({ user, onSelect }: UserCardProps) {
  return (...)
}

// ✗ Avoid class components for new code
```

### Props Interface Naming

```tsx
// Component props: [ComponentName]Props
interface UserCardProps {
  user: User
  onSelect?: (id: string) => void
}
```

## Hooks

### State Selection

| Scenario              | Hook                |
| --------------------- | ------------------- |
| Simple value          | `useState`          |
| Complex/related state | `useReducer`        |
| Server data           | React Query / SWR   |
| Global app state      | Zustand / Jotai     |
| Cross-cutting         | Context (sparingly) |

### Custom Hook Patterns

```tsx
// ✓ Extract when: reused OR complex logic
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// ✓ Prefix with "use"
// ✓ Return consistent shape (value, or { data, actions })
```

### Effect Rules

```tsx
// ✗ Avoid: derived state in effect
useEffect(() => {
  setFullName(`${first} ${last}`)
}, [first, last])

// ✓ Better: compute directly
const fullName = `${first} ${last}`

// ✗ Avoid: data fetching in plain useEffect
useEffect(() => {
  fetch('/api/user').then(...)
}, [])

// ✓ Better: React Query / SWR / loader pattern
const { data: user } = useQuery(['user'], fetchUser)
```

## Performance

### When to Memoize

```tsx
// useMemo: expensive computation
const sorted = useMemo(() => items.toSorted((a, b) => a.score - b.score), [items])

// useCallback: stable reference for child props
const handleClick = useCallback(
  (id: string) => {
    onSelect(id)
  },
  [onSelect],
)

// memo(): prevent re-render from parent
const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  return items.map(item => <ExpensiveRow key={item.id} item={item} />)
})
```

### Don't Over-Optimize

- Profile first, optimize second
- Memoizing primitives/simple objects is noise
- Most components don't need `memo()`

### Lists

```tsx
// ✓ Stable, unique key
{
  items.map(item => <Row key={item.id} item={item} />)
}

// ✗ Index key for dynamic lists
{
  items.map((item, i) => <Row key={i} item={item} />)
}

// ✓ Virtualize 100+ items
import { FixedSizeList } from 'react-window'
```

## Patterns

### Compound Components

```tsx
// Flexible, composable API
<Select value={value} onChange={onChange}>
  <Select.Trigger>{label}</Select.Trigger>
  <Select.Content>
    <Select.Item value='a'>Option A</Select.Item>
    <Select.Item value='b'>Option B</Select.Item>
  </Select.Content>
</Select>
```

### Render Props (when needed)

```tsx
<Tooltip content='Help text'>
  {({ ref, props }) => (
    <button ref={ref} {...props}>
      Hover me
    </button>
  )}
</Tooltip>
```

### Error Boundaries

```tsx
// Place at route/feature level
<ErrorBoundary fallback={<ErrorPage />}>
  <FeatureSection />
</ErrorBoundary>
```

## Anti-Patterns

| Avoid                     | Instead                                  |
| ------------------------- | ---------------------------------------- |
| Prop drilling 3+ levels   | Context or composition                   |
| Nested ternaries in JSX   | Early returns or extract component       |
| `any` in event handlers   | Proper event types                       |
| Inline object/array props | Extract to constant or useMemo           |
| String refs               | `useRef`                                 |
| Direct DOM manipulation   | Refs when necessary, state when possible |

## File Organization

```
src/
├── components/       # Shared/reusable
│   └── Button/
├── features/         # Feature-specific
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── api.ts
├── hooks/            # Shared hooks
├── lib/              # Utilities, clients
├── types/            # Shared types
└── app/ or pages/    # Routes
```
