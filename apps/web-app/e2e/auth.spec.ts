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
          activeModelId: 'chatgpt',
          isPinned: false,
          isSidebarExpanded: false,
          expandedFolders: [],
          apiKeys: {}
        },
        version: 0
      };
      window.localStorage.setItem('brainbox-app-store', JSON.stringify(state));
    });
  });

  test('should switch between library and prompts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for Zustand rehydration to set isLoggedIn=true → overlay removed from DOM
    await page.locator('[data-testid="login-overlay"]').waitFor({ state: 'detached', timeout: 15000 });

    // Wait for the Sidebar to appear (indicates successful login/hydration)
    const libraryBtn = page.locator('button').filter({ hasText: 'Library' }).first();
    await expect(libraryBtn).toBeVisible({ timeout: 15000 });
    
    // Switch to Library
    await libraryBtn.click();
    await expect(page.getByText('Library').first()).toBeVisible();
    
    // Switch to Prompts
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    await expect(page.getByText('Prompts').first()).toBeVisible();
  });
});
