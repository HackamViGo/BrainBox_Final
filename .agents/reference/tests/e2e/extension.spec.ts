// tests/e2e/extension.spec.ts
test('context menu should trigger chat capture', async ({ browserContext }) => {
  const page = await browserContext.newPage();
  await page.goto('https://chatgpt.com');
  // Simulate context menu click via chrome.contextMenus.onClicked
  // Verify API call to /api/chats/extension
});
