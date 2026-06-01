import { test, expect } from '@playwright/test';

test('landing page loads correctly', async ({ page }) => {
  await page.goto('/');

  // Wait for splash screen to disappear and main content to load
  await page.waitForTimeout(4000);

  // Check core navigation elements
  await expect(page.locator('nav')).toBeVisible();

  // Check BrandFlow logo text
  await expect(page.getByText('BrandFlow', { exact: false }).first()).toBeVisible();

  // Check navigation links exist
  await expect(page.getByText('AI Services')).toBeVisible();
  await expect(page.getByText('Pricing Tiers')).toBeVisible();

  // Check the Login link now points to /login
  const loginLink = page.locator('nav a[href="/login"]').first();
  await expect(loginLink).toBeVisible();
});

test('resources page loads ebooks', async ({ page }) => {
  // Resources page requires auth - inject tokens first
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
    localStorage.setItem('brandflow_token', 'test-session-token');
    localStorage.setItem('brandflow_is_admin', 'true');
    localStorage.setItem('brandflow_user_id', '1');
  });

  await page.goto('/resources');
  await page.waitForTimeout(4000);

  // The resources page uses buttons (not <a> tags) for PDF downloads
  // Check for the download buttons
  const downloadButtons = page.locator('button', { hasText: /PDF/i });
  const count = await downloadButtons.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Check that book titles are rendered
  await expect(page.getByText('BRANDING MASTERCLASS')).toBeVisible();
  await expect(page.getByText('MARKETING PLAN MASTERCLASS')).toBeVisible();
});

test('clicking login navigates to login page', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(4000);

  // Click the Login text link in navbar
  const loginLink = page.locator('nav a[href="/login"]').first();
  await loginLink.click();

  // Should be on login page now
  await page.waitForURL('**/login');
  expect(page.url()).toContain('/login');

  // Check login form elements
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});
