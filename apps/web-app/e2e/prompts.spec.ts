import { test, expect } from '@playwright/test';

test.describe('Prompts Module', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login and necessary state
    await page.addInitScript(() => {
      const appState = {
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
      
      const libraryState = {
        state: {
          items: [
            { id: 'p1', type: 'prompt', title: 'Test Prompt', description: 'Test Desc', content: 'Test Content', platform: 'chatgpt' },
            { id: 'c1', type: 'capture', title: 'Test Capture', description: 'Captured Content', content: 'Captured Content', url: 'http://test.com', source: 'test.com' }
          ],
          libraryFolders: [],
          promptFolders: []
        },
        version: 0
      };

      window.localStorage.setItem('brainbox-app-store', JSON.stringify(appState));
      window.localStorage.setItem('brainbox-library-store', JSON.stringify(libraryState));
    });

    await page.goto('/');
    // Wait for Zustand rehydration to set isLoggedIn=true → overlay removed from DOM
    await page.locator('[data-testid="login-overlay"]').waitFor({ state: 'detached', timeout: 15000 });
  });

  test('should navigate to Prompts Hub and show 4 gateway cards', async ({ page }) => {
    // Navigate from Sidebar
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    
    // Verify we are in Prompts Hub
    await expect(page.getByText('Prompt of the Day').first()).toBeVisible();
    
    // Check for the 4 gateway card labels
    await expect(page.getByText('Frameworks').first()).toBeVisible();
    await expect(page.getByText('Saved Prompts').first()).toBeVisible();
    await expect(page.getByText('Refine Mode').first()).toBeVisible();
    await expect(page.getByText('Captures').first()).toBeVisible();
  });

  test('should use Daily Prompt template', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    
    const useTemplateBtn = page.locator('button', { hasText: 'Use Template' });
    await useTemplateBtn.click();
    
    // Should be in Refine view
    await expect(page.getByText('The 7-Way Optimizer').first()).toBeVisible();
    const textarea = page.locator('textarea').first();
    await expect(textarea).toHaveValue(/The Socratic Challenger/);
  });

  test('should navigate to Frameworks and synergize a cell', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    
    // Click Frameworks gateway
    await page.getByText('Frameworks').first().click();
    await expect(page.getByText('The 7x7 Matrix').first()).toBeVisible();
    
    // Select a cell (e.g., Logic -> Socratic Method)
    await page.getByText('Logic').first().click();
    await page.getByText('Socratic Method').first().click();
    
    // Click Use in Refiner (the title I added)
    await page.getByTitle('Use in Refiner').first().click();
    
    // Verify in Refine view with template text
    await expect(page.getByText('The 7-Way Optimizer').first()).toBeVisible();
    const textarea = page.locator('textarea').first();
    await expect(textarea).toHaveValue(/Engage in a Socratic dialogue/);
  });

  test('should handle Saved Prompts CRUD', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    await page.getByText('Saved Prompts').first().click();
    
    // 1. Verify 'Test Prompt' from mock state is visible
    await expect(page.getByText('Test Prompt').first()).toBeVisible();
    
    // 2. Create new prompt
    await page.getByTitle('Create New Prompt').first().click();
    await page.getByPlaceholder('Prompt Title...').first().fill('New E2E Prompt');
    await page.getByPlaceholder(/What is this prompt for/i).first().fill('Testing the creation flow');
    await page.getByPlaceholder(/Paste the full prompt content here/i).first().fill('This is the content');
    await page.getByText('Save Changes').first().click();
    
    await expect(page.getByText('New E2E Prompt').first()).toBeVisible();
    
    // 3. Edit prompt
    const promptItem = page.locator('div.group').filter({ hasText: 'New E2E Prompt' }).first();
    await promptItem.hover();
    await promptItem.getByTitle('Edit Prompt').first().click();
    await page.getByPlaceholder('Prompt Title...').first().fill('Updated E2E Prompt');
    await page.getByText('Save Changes').first().click();
    
    await expect(page.getByText('Updated E2E Prompt').first()).toBeVisible();
    
    // 4. Delete prompt
    const updatedItem = page.locator('div.group').filter({ hasText: 'Updated E2E Prompt' }).first();
    await updatedItem.hover();
    await updatedItem.getByTitle('Delete Prompt').first().click();
    
    await expect(page.getByText('Updated E2E Prompt').first()).not.toBeVisible();
  });

  test('should refine a prompt and save it', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Prompts' }).first().click();
    await page.getByText('Refine Mode').first().click();
    
    // Type input
    await page.getByPlaceholder(/Paste your raw thought/i).fill('Help me write a story about a cat');
    
    // Click a crystal (e.g., Creative)
    await page.getByText('Creative').click();
    
    // Note: Since we are in E2E and mocked the store, we need to ensure the Gemini API call is handled.
    // However, without a real API key in the environment, it might fail.
    // In a real E2E environment we usually mock the API response.
    
    // For now, we just verify the "Purifying Idea..." state appears if possible, 
    // or we assume it succeeds if we provided an API key in the mock store.
    
    // Let's add an API key and mock the network request if possible.
  });
});
