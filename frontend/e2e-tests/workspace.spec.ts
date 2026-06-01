import { test, expect } from '@playwright/test';

test('workspace planning page loads', async ({ page }) => {
  // Inject auth tokens to simulate logged-in user
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
    localStorage.setItem('brandflow_token', 'test-session-token');
    localStorage.setItem('brandflow_is_admin', 'true');
    localStorage.setItem('brandflow_user_id', '1');
  });

  // Navigate to planning page
  await page.goto('/planning');
  await page.waitForTimeout(3000);

  // The page should load without crashing (no white screen)
  // Check that the body has rendered content
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.length).toBeGreaterThan(10);

  // Check page is not showing an error
  const pageTitle = await page.title();
  expect(pageTitle).not.toContain('500');
  expect(pageTitle).not.toContain('Error');
});

test('workspace a1-mission page loads', async ({ page }) => {
  // Inject auth tokens
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
    localStorage.setItem('brandflow_token', 'test-session-token');
    localStorage.setItem('brandflow_is_admin', 'true');
    localStorage.setItem('brandflow_user_id', '1');
  });

  // Navigate to a1-mission
  await page.goto('/planning/a1-mission');
  await page.waitForTimeout(3000);

  // Page should load and have form inputs or text areas
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.length).toBeGreaterThan(10);

  // Check for common UI elements (inputs, textareas, or buttons)
  const interactiveElements = page.locator('input, textarea, button');
  const count = await interactiveElements.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('admin page loads for admin user', async ({ page }) => {
  // Inject admin auth tokens
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
    localStorage.setItem('brandflow_token', 'test-session-token');
    localStorage.setItem('brandflow_is_admin', 'true');
    localStorage.setItem('brandflow_user_id', '1');
  });

  // Navigate to admin panel
  await page.goto('/admin');
  await page.waitForTimeout(3000);

  // Page should not crash
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.length).toBeGreaterThan(5);
});

test('daily-content page loads', async ({ page }) => {
  // Inject auth tokens
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
    localStorage.setItem('brandflow_token', 'test-session-token');
    localStorage.setItem('brandflow_is_admin', 'true');
    localStorage.setItem('brandflow_user_id', '1');
  });

  // Navigate to daily content
  await page.goto('/daily-content');
  await page.waitForTimeout(3000);

  // Page should load
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.length).toBeGreaterThan(5);
});
