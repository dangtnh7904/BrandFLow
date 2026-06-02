# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace.spec.ts >> workspace planning page loads
- Location: e2e-tests\workspace.spec.ts:3:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 10
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e8]:
      - generic [ref=e9]:
        - img [ref=e11]
        - heading "Welcome to BrandFlow" [level=2] [ref=e13]
        - paragraph [ref=e14]: Đăng nhập để tiếp tục vào Workspace
      - generic [ref=e15]:
        - generic [ref=e21]: Hoặc email
        - generic [ref=e22]:
          - generic [ref=e23]:
            - generic [ref=e25]:
              - generic:
                - img
            - generic [ref=e27]:
              - generic:
                - img
          - button "Chưa có tài khoản? Tạo mới" [ref=e29]
      - paragraph [ref=e30]: © 2026 BrandFlow AI. Protected by Advanced SSL.
  - alert [ref=e31]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('workspace planning page loads', async ({ page }) => {
  4  |   // Inject auth tokens to simulate logged-in user
  5  |   await page.goto('/login');
  6  |   await page.evaluate(() => {
  7  |     localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
  8  |     localStorage.setItem('brandflow_token', 'test-session-token');
  9  |     localStorage.setItem('brandflow_is_admin', 'true');
  10 |     localStorage.setItem('brandflow_user_id', '1');
  11 |   });
  12 | 
  13 |   // Navigate to planning page
  14 |   await page.goto('/planning');
  15 |   await page.waitForTimeout(3000);
  16 | 
  17 |   // The page should load without crashing (no white screen)
  18 |   // Check that the body has rendered content
  19 |   const bodyText = await page.locator('body').innerText();
> 20 |   expect(bodyText.length).toBeGreaterThan(10);
     |                           ^ Error: expect(received).toBeGreaterThan(expected)
  21 | 
  22 |   // Check page is not showing an error
  23 |   const pageTitle = await page.title();
  24 |   expect(pageTitle).not.toContain('500');
  25 |   expect(pageTitle).not.toContain('Error');
  26 | });
  27 | 
  28 | test('workspace a1-mission page loads', async ({ page }) => {
  29 |   // Inject auth tokens
  30 |   await page.goto('/login');
  31 |   await page.evaluate(() => {
  32 |     localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
  33 |     localStorage.setItem('brandflow_token', 'test-session-token');
  34 |     localStorage.setItem('brandflow_is_admin', 'true');
  35 |     localStorage.setItem('brandflow_user_id', '1');
  36 |   });
  37 | 
  38 |   // Navigate to a1-mission
  39 |   await page.goto('/planning/a1-mission');
  40 |   await page.waitForTimeout(3000);
  41 | 
  42 |   // Page should load and have form inputs or text areas
  43 |   const bodyText = await page.locator('body').innerText();
  44 |   expect(bodyText.length).toBeGreaterThan(10);
  45 | 
  46 |   // Check for common UI elements (inputs, textareas, or buttons)
  47 |   const interactiveElements = page.locator('input, textarea, button');
  48 |   const count = await interactiveElements.count();
  49 |   expect(count).toBeGreaterThanOrEqual(1);
  50 | });
  51 | 
  52 | test('admin page loads for admin user', async ({ page }) => {
  53 |   // Inject admin auth tokens
  54 |   await page.goto('/login');
  55 |   await page.evaluate(() => {
  56 |     localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
  57 |     localStorage.setItem('brandflow_token', 'test-session-token');
  58 |     localStorage.setItem('brandflow_is_admin', 'true');
  59 |     localStorage.setItem('brandflow_user_id', '1');
  60 |   });
  61 | 
  62 |   // Navigate to admin panel
  63 |   await page.goto('/admin');
  64 |   await page.waitForTimeout(3000);
  65 | 
  66 |   // Page should not crash
  67 |   const bodyText = await page.locator('body').innerText();
  68 |   expect(bodyText.length).toBeGreaterThan(5);
  69 | });
  70 | 
  71 | test('daily-content page loads', async ({ page }) => {
  72 |   // Inject auth tokens
  73 |   await page.goto('/login');
  74 |   await page.evaluate(() => {
  75 |     localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
  76 |     localStorage.setItem('brandflow_token', 'test-session-token');
  77 |     localStorage.setItem('brandflow_is_admin', 'true');
  78 |     localStorage.setItem('brandflow_user_id', '1');
  79 |   });
  80 | 
  81 |   // Navigate to daily content
  82 |   await page.goto('/daily-content');
  83 |   await page.waitForTimeout(3000);
  84 | 
  85 |   // Page should load
  86 |   const bodyText = await page.locator('body').innerText();
  87 |   expect(bodyText.length).toBeGreaterThan(5);
  88 | });
  89 | 
```