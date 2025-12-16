# Node.js Guidelines

## Project Structure

```
project/
├── src/
│   ├── index.ts          # Entry point
│   ├── app.ts            # App setup (Express/Fastify)
│   ├── config/           # Environment, constants
│   │   └── index.ts
│   ├── routes/           # Route definitions
│   │   └── users.ts
│   ├── controllers/      # Request handlers
│   │   └── users.ts
│   ├── services/         # Business logic
│   │   └── user.service.ts
│   ├── repositories/     # Data access
│   │   └── user.repo.ts
│   ├── middleware/       # Express/Fastify middleware
│   ├── lib/              # Shared utilities
│   └── types/            # TypeScript types
├── tests/
├── .env.example
└── package.json
```

## Error Handling

### Custom Error Classes

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}
```

### Global Error Handler

```ts
// middleware/error-handler.ts
import { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    })
  }

  // Don't leak internal errors
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  })
}
```

### Async Route Wrapper

```ts
// ✓ Catches async errors automatically
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Usage
router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await userService.findById(req.params.id)
    if (!user) throw new NotFoundError('User')
    res.json(user)
  }),
)
```

## Configuration

### Environment Variables

```ts
// config/index.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
})

export const config = envSchema.parse(process.env)

// ✓ Fails fast on startup if env is invalid
```

### Never Commit Secrets

```
# .env.example (commit this)
DATABASE_URL=postgresql://localhost:5432/myapp
JWT_SECRET=your-secret-here

# .env (gitignored)
DATABASE_URL=postgresql://user:pass@prod:5432/myapp
JWT_SECRET=actual-secret
```

## API Design

### Response Format

```ts
// ✓ Consistent shape
interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// Controller
res.json({ data: users, meta: { page: 1, limit: 20, total: 100 } })
```

### Input Validation

```ts
import { z } from 'zod'

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
    password: z.string().min(8),
  }),
})

// Middleware
export function validate<T extends z.ZodSchema>(schema: T) {
  return asyncHandler(async (req, res, next) => {
    const result = schema.safeParse(req)
    if (!result.success) {
      throw new ValidationError(result.error.message)
    }
    next()
  })
}

// Usage
router.post('/users', validate(createUserSchema), createUser)
```

## Database

### Connection Pool

```ts
// ✓ Single pool instance
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
})

// Graceful shutdown
process.on('SIGTERM', () => pool.end())
```

### Transactions

```ts
export async function transferFunds(from: string, to: string, amount: number) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, from])
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, to])
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
```

## Logging

### Structured Logging

```ts
import pino from 'pino'

export const logger = pino({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: config.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
})

// ✓ Structured context
logger.info({ userId: user.id, action: 'login' }, 'User logged in')

// ✗ Avoid string interpolation
logger.info(`User ${user.id} logged in`)
```

### Request Logging

```ts
import pinoHttp from 'pino-http'

app.use(pinoHttp({ logger }))
```

## Security

### Helmet + CORS

```ts
import helmet from 'helmet'
import cors from 'cors'

app.use(helmet())
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS.split(','),
    credentials: true,
  }),
)
```

### Rate Limiting

```ts
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
})

app.use('/api', limiter)
```

## Graceful Shutdown

```ts
const server = app.listen(config.PORT)

async function shutdown() {
  console.log('Shutting down...')

  server.close()
  await pool.end()
  // Close other connections...

  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
```

## Testing

```ts
// ✓ Supertest for HTTP tests
import request from 'supertest'
import { app } from '../src/app'

describe('GET /users/:id', () => {
  it('returns 404 for non-existent user', async () => {
    const res = await request(app).get('/users/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})
```
