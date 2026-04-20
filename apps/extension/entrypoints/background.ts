import { ExtensionChatPayload } from '@brainbox/types';
import { encryptData } from '@brainbox/utils';
import { SyncManager } from './background/syncManager';

/**
 * BrainBox Service Worker (WXT / Manifest V3)
 * WXT automatically registers this as the service worker.
 */
export default defineBackground(() => {
  // Secret for local encryption - in production this should be more dynamic
  const INTERNAL_SECRET = 'brainbox-secure-bridge-2026';
  
  // Initialize Managers
  const syncManager = new SyncManager();

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
      const captureData: ExtensionChatPayload = {
        id: `capture-${Date.now()}`,
        title: 'Captured Snippet',
        description: `From: ${tab?.title || 'Unknown Page'}`,
        content: info.selectionText,
        url: tab?.url,
        platform: 'chatgpt', // Default for general captures
        type: 'chat',
        messages: [{ role: 'user', content: info.selectionText }]
      };

      await syncManager.addToQueue(captureData);
    }
  });

  // Handle messages from content scripts and popup
  chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    const msg = message as { type: string; payload?: unknown };
    
    if (msg.type === 'PING') {
      sendResponse({ status: 'alive' });
      return true;
    }

    if (msg.type === 'SET_AUTH') {
      // Encrypt sensitive auth data before saving to storage
      encryptData(JSON.stringify(msg.payload), INTERNAL_SECRET)
        .then(encrypted => {
          chrome.storage.local.set({ auth_secure: encrypted });
          sendResponse({ success: true });
        })
        .catch(err => {
          sendResponse({ success: false, error: err.message });
        });
      return true; // Keep channel open
    }

    if (msg.type === 'SYNC_CHAT') {
      syncManager.addToQueue(msg.payload as ExtensionChatPayload)
        .then(res => sendResponse(res))
        .catch((err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          sendResponse({ success: false, error: errorMessage });
        });
      return true; // Keep channel open
    }

    return true;
  });
});
