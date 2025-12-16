# Playwright Testing

## Setup

### Installation

```bash
npm init playwright@latest
# or
pnpm create playwright
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Basic Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('displays login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('logs in with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })
})
```

## Locators

### Recommended (Accessibility First)

```typescript
// By role (best)
page.getByRole('button', { name: 'Submit' })
page.getByRole('heading', { level: 1 })
page.getByRole('link', { name: /learn more/i })
page.getByRole('checkbox', { checked: true })
page.getByRole('textbox', { name: 'Email' })

// By label
page.getByLabel('Email')
page.getByLabel('Password')

// By placeholder
page.getByPlaceholder('Enter your email')

// By text
page.getByText('Welcome')
page.getByText(/welcome/i) // Case insensitive

// By alt text
page.getByAltText('Profile picture')

// By title
page.getByTitle('Close dialog')
```

### Test IDs (Fallback)

```typescript
// HTML: <button data-testid="submit-btn">Submit</button>
page.getByTestId('submit-btn')
```

### CSS/XPath (Last Resort)

```typescript
page.locator('button.primary')
page.locator('#submit-form')
page.locator('//button[@type="submit"]')
```

### Chaining & Filtering

```typescript
// Chain locators
page.getByRole('listitem').filter({ hasText: 'Product A' })

// Within element
const card = page.locator('.product-card').filter({ hasText: 'iPhone' })
await card.getByRole('button', { name: 'Add to Cart' }).click()

// nth element
page.getByRole('listitem').nth(2)
page.getByRole('listitem').first()
page.getByRole('listitem').last()
```

## Actions

### Click & Type

```typescript
// Click
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByRole('link').click({ force: true }) // Skip checks
await page.getByRole('button').dblclick()
await page.getByRole('button').click({ button: 'right' })

// Type
await page.getByLabel('Email').fill('user@example.com')
await page.getByLabel('Search').type('query', { delay: 100 }) // Slow typing
await page.getByLabel('Name').clear()
await page.getByLabel('Name').pressSequentially('Alice')

// Keyboard
await page.keyboard.press('Enter')
await page.keyboard.press('Control+a')
await page.getByLabel('Search').press('Escape')
```

### Forms

```typescript
// Select
await page.getByLabel('Country').selectOption('us')
await page.getByLabel('Country').selectOption({ label: 'United States' })

// Checkbox/Radio
await page.getByRole('checkbox', { name: 'Subscribe' }).check()
await page.getByRole('checkbox').uncheck()
await page.getByRole('radio', { name: 'Express' }).check()

// File upload
await page.getByLabel('Upload').setInputFiles('file.pdf')
await page.getByLabel('Upload').setInputFiles(['file1.pdf', 'file2.pdf'])
```

### Navigation

```typescript
await page.goto('/')
await page.goto('/users/123')
await page.goBack()
await page.goForward()
await page.reload()

// Wait for navigation
await Promise.all([page.waitForNavigation(), page.getByRole('link').click()])
```

## Assertions

### Page Assertions

```typescript
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveURL(/\/users\/\d+/)
await expect(page).toHaveTitle('Dashboard')
await expect(page).toHaveTitle(/dashboard/i)
```

### Locator Assertions

```typescript
// Visibility
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeAttached()

// State
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toBeChecked()
await expect(locator).toBeFocused()
await expect(locator).toBeEditable()

// Content
await expect(locator).toHaveText('Hello')
await expect(locator).toHaveText(/hello/i)
await expect(locator).toContainText('Hello')
await expect(locator).toHaveValue('input value')
await expect(locator).toHaveAttribute('href', '/home')

// Count
await expect(locator).toHaveCount(5)

// CSS
await expect(locator).toHaveClass('active')
await expect(locator).toHaveCSS('color', 'rgb(0, 0, 0)')

// Screenshot
await expect(locator).toHaveScreenshot('button.png')
await expect(page).toHaveScreenshot('page.png')
```

### Soft Assertions (Don't Stop)

```typescript
await expect.soft(locator).toHaveText('Expected')
await expect.soft(locator).toBeVisible()
// Test continues even if above fails
```

### Negation

```typescript
await expect(locator).not.toBeVisible()
await expect(locator).not.toHaveText('Error')
```

## Waiting

### Auto-Waiting

```typescript
// Playwright auto-waits for:
// - Element to be visible
// - Element to be stable
// - Element to be enabled
// - Element to receive events

await page.getByRole('button').click() // Waits automatically
```

### Explicit Waits

```typescript
// Wait for element
await page.waitForSelector('.loaded')
await page.getByRole('button').waitFor({ state: 'visible' })

// Wait for condition
await expect(page.getByText('Success')).toBeVisible({ timeout: 10000 })

// Wait for network
await page.waitForResponse('/api/users')
await page.waitForRequest('/api/users')

// Wait for load state
await page.waitForLoadState('networkidle')
await page.waitForLoadState('domcontentloaded')

// Wait for function
await page.waitForFunction(() => window.loaded === true)
```

## Page Object Model

### Page Class

```typescript
// pages/login.page.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.submitButton = page.getByRole('button', { name: 'Sign In' })
    this.errorMessage = page.getByRole('alert')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
```

### Using Page Objects

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page'

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')

  await expect(page).toHaveURL('/dashboard')
})
```

### Fixtures for Page Objects

```typescript
// fixtures.ts
import { test as base } from '@playwright/test'
import { LoginPage } from './pages/login.page'
import { DashboardPage } from './pages/dashboard.page'

type Pages = {
  loginPage: LoginPage
  dashboardPage: DashboardPage
}

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  },
})

// Usage
test('login flow', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password')
  await dashboardPage.expectWelcomeMessage()
})
```

## API Testing

### Request Context

```typescript
import { test, expect } from '@playwright/test'

test('API: create user', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  })

  expect(response.ok()).toBeTruthy()
  expect(response.status()).toBe(201)

  const user = await response.json()
  expect(user.name).toBe('Alice')
})

test('API: with auth', async ({ request }) => {
  const response = await request.get('/api/profile', {
    headers: {
      Authorization: 'Bearer token123',
    },
  })

  expect(response.ok()).toBeTruthy()
})
```

## Network Mocking

### Mock API Responses

```typescript
test('mock API', async ({ page }) => {
  await page.route('/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]),
    })
  })

  await page.goto('/users')
  await expect(page.getByText('Alice')).toBeVisible()
})

// Modify response
await page.route('/api/users', async route => {
  const response = await route.fetch()
  const json = await response.json()
  json.push({ id: 99, name: 'Test User' })

  await route.fulfill({ response, json })
})

// Abort request
await page.route('**/*.png', route => route.abort())
```

## Authentication

### Storage State

```typescript
// Save auth state
test('login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Sign In' }).click()

  await page.context().storageState({ path: 'auth.json' })
})

// Reuse auth state
test.use({ storageState: 'auth.json' })

test('authenticated test', async ({ page }) => {
  await page.goto('/dashboard') // Already logged in
})
```

### Global Setup

```typescript
// global-setup.ts
import { chromium } from '@playwright/test'

export default async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:3000/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill('admin123')
  await page.getByRole('button', { name: 'Sign In' }).click()

  await page.context().storageState({ path: 'admin-auth.json' })
  await browser.close()
}
```

## Visual Testing

```typescript
// Full page screenshot
await expect(page).toHaveScreenshot('homepage.png')

// Element screenshot
await expect(page.getByRole('main')).toHaveScreenshot('main-content.png')

// Options
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 100,
  maxDiffPixelRatio: 0.1,
  animations: 'disabled',
  mask: [page.locator('.dynamic-content')],
})

// Update snapshots: npx playwright test --update-snapshots
```

## CLI Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test login.spec.ts

# Run specific test
npx playwright test -g "login flow"

# Run in headed mode
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# Show report
npx playwright show-report

# Generate code
npx playwright codegen http://localhost:3000

# Update snapshots
npx playwright test --update-snapshots
```

## Configuration Tips

### Parallel by File

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true, // Tests in same file run in parallel
  workers: 4,
})
```

### Retries

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
})

// Per-test retry
test(
  'flaky test',
  async ({ page }) => {
    test.info().annotations.push({ type: 'issue', description: '#123' })
    // ...
  },
  { retries: 3 },
)
```

### Timeouts

```typescript
export default defineConfig({
  timeout: 30000, // Per test
  expect: {
    timeout: 5000, // Per assertion
  },
})

// Per-test timeout
test('slow test', async ({ page }) => {
  test.setTimeout(60000)
  // ...
})
```
