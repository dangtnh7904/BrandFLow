import { test, expect } from '@playwright/test';

test('can navigate to workspace phase 1 and load data', async ({ page }) => {
  // Mock login by setting local storage directly, skipping the login screen
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('brandflow_email', 'admin@brandflow.ai');
    localStorage.setItem('brandflow_token', 'test-token');
    localStorage.setItem('brandflow_is_admin', 'true');
  });

  // Now go to planning dashboard
  await page.goto('/planning');
  // Navigate to phase 1 via sidebar or directly
  await page.goto('/planning/a1-mission');
  
  // Verify that the page loads and contains form elements
  const pageTitle = page.locator('h3').filter({ hasText: /Sứ mệnh/i }).first();
  await expect(pageTitle).toBeVisible();
});
