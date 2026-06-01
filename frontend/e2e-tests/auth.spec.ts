import { test, expect } from '@playwright/test';

test('can navigate to login and proceed to onboarding', async ({ page }) => {
  await page.goto('/login');
  
  // Try login - we know the default admin is admin@brandflow.ai
  const emailInput = page.getByPlaceholder('Địa chỉ Email');
  await emailInput.fill('admin@brandflow.ai');
  
  const passwordInput = page.getByPlaceholder('Mật khẩu');
  await passwordInput.fill('dinhmanhcvp2005');
  
  // Click continue
  const continueBtn = page.getByRole('button', { name: 'Đăng nhập' });
  await continueBtn.click();
  
  // We expect a redirection to either /onboarding or /dashboard or /planning
  // Wait for network idle or wait for URL change
  await page.waitForURL(/\/(onboarding|dashboard|planning)/);
  
  const url = page.url();
  expect(url).toMatch(/\/(onboarding|dashboard|planning)/);
});
