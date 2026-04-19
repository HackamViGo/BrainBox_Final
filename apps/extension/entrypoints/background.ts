
/**
 * BrainBox Service Worker (WXT / Manifest V3)
 * WXT automatically registers this as the service worker.
 */
export default defineBackground(() => {
  const DASHBOARD_URL = 'http://localhost:3000';

  chrome.runtime.onInstalled.addListener(() => {
    // Set up context menu for capturing text selections
    chrome.contextMenus.create({
      id: 'brainbox-capture',
      title: 'Save to BrainBox',
      contexts: ['selection'],
    });
  });

  // Handle context menu clicks — relay to sync engine
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'brainbox-capture' && info.selectionText) {
      const captureData = {
        id: `capture-${Date.now()}`,
        title: 'Captured Snippet',
        description: `From: ${tab?.title || 'Unknown Page'}`,
        content: info.selectionText,
        url: tab?.url,
        platform: 'chatgpt', // Default for general captures
        type: 'chat',
        messages: [{ role: 'user', content: info.selectionText }]
      };

      await syncToDashboard(captureData);
    }
  });

  // Handle messages from content scripts and popup
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'PING') {
      sendResponse({ status: 'alive' });
    }

    if (message.type === 'SET_AUTH') {
      chrome.storage.local.set({ auth: message.payload });
      // use logger instead of console.log eventually
      sendResponse({ success: true });
    }

    if (message.type === 'SYNC_CHAT') {
      syncToDashboard(message.payload)
        .then(res => sendResponse(res))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true; // Keep channel open
    }

    // Return true to keep the channel open for async responses
    return true;
  });

  async function syncToDashboard(data: any) {
    const { auth } = await chrome.storage.local.get('auth');
    
    if (!auth?.token) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const response = await fetch(`${DASHBOARD_URL}/api/chats/extension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
});
