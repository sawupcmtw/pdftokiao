# JavaScript/TypeScript Review Rules

## Type Safety (TS)

- Avoid `any` - use `unknown` + type guards
- Prefer strict mode: `"strict": true`
- Use discriminated unions over type assertions
- Generic constraints over loose generics

## Common Issues

### Security

```typescript
// BAD: XSS risk
element.innerHTML = userInput
// GOOD
element.textContent = userInput

// BAD: prototype pollution
Object.assign(target, userInput)
// GOOD
const safe = { ...defaults, allowed: userInput.allowed }

// BAD: eval family
eval(code)
new Function(code)
setTimeout(code)
```

### Async/Promises

```typescript
// BAD: unhandled rejection
async function bad() {
  fetch(url)
}
// GOOD
async function good() {
  try {
    await fetch(url)
  } catch (e) {
    handleError(e)
  }
}

// BAD: floating promise
arr.map(async x => process(x))
// GOOD
await Promise.all(arr.map(x => process(x)))
```

### Memory Leaks

```typescript
// BAD: listener not cleaned
useEffect(() => {
  window.addEventListener('resize', handler)
}, [])
// GOOD
useEffect(() => {
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])
```

### React-Specific

- Missing keys in lists
- Stale closures in hooks (missing deps)
- Inline object/function props causing rerenders
- State updates on unmounted components

## Style Preferences

- `const` > `let` > `var` (never var)
- Optional chaining: `obj?.prop` over `obj && obj.prop`
- Nullish coalescing: `??` over `||` for defaults
- Template literals over string concat
