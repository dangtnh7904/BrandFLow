import { test, expect } from '@playwright/test';

test('landing page loads and shows navigation', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the main heading to ensure the page loaded
  await expect(page.locator('h1').filter({ hasText: /BrandFlow/i })).toBeVisible();

  // Check if navigation links are present
  await expect(page.getByText('AI Services', { exact: true })).toBeVisible();
  await expect(page.getByText('Pricing Tiers', { exact: true })).toBeVisible();
  
  // Check the Start for free button
  const startBtn = page.getByRole('button', { name: /Start for free/i }).first();
  await expect(startBtn).toBeVisible();
});

test('can navigate to resources page', async ({ page }) => {
  await page.goto('/resources');
  
  // Check if resources page has ebooks
  await expect(page.locator('h2').filter({ hasText: /Bộ 3 Cẩm Nang/i })).toBeVisible();
  await expect(page.getByText('Tải Miễn Phí').first()).toBeVisible();
});
