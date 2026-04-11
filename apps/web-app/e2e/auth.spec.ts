import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login overlay by default', async ({ page }) => {
    await page.goto('/');
    
    // Check for login overlay via the Login component content
    const loginHeading = page.getByText('BrainBox').first();
    await expect(loginHeading).toBeVisible();
    
    // Check if the main app content is blurred
    const shell = page.locator('.blur-2xl');
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login for all navigation tests
    await page.addInitScript(() => {
      const state = {
        state: { 
          isLoggedIn: true, 
          theme: 'chatgpt',
          activeScreen: 'dashboard'
        },
        version: 0
      };
      window.localStorage.setItem('brainbox-app-store', JSON.stringify(state));
    });
  });

  test('should switch between library and prompts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the login overlay to disappear (AnimatePresence)
    await expect(page.getByText('Initialize Session')).toBeHidden({ timeout: 10000 });
    
    // Check if Dashboard is visible
    await expect(page.getByText(/Вторият ти мозък/i)).toBeVisible();
    
    // Switch to Library
    await page.locator('button').filter({ hasText: 'Library' }).first().click();
    await expect(page.getByText('Main Library')).toBeVisible();
    
    // Switch to Prompts
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    await expect(page.getByText('Main Prompts')).toBeVisible();
  });
});
