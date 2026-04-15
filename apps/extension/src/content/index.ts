/**
 * BrainBox Content Script Entry Point
 * ⚠️ READ-ONLY DOM. The ONLY permitted DOM write is textarea value injection.
 * Rules:
 *   - NO injecting buttons, overlays, or toolbars into AI platforms.
 *   - NO fetch to supabase.co directly.
 *   - Only READ page state and inject into textareas.
 */

import { ChatGPTAdapter } from './adapters/chatgpt.adapter';
import { GeminiAdapter } from './adapters/gemini.adapter';
import type { BaseAdapter } from './adapters/base.adapter';

const hostname = window.location.hostname;

// Listen for the Auth Handshake from the web-app's extension-auth page
window.addEventListener('message', (event) => {
  if (event.data?.type === 'BRAINBOX_AUTH_HANDSHAKE') {
    const { token, user } = event.data.payload;
    if (token) {
      chrome.runtime.sendMessage({
        type: 'SET_AUTH',
        payload: { token, user }
      });
      console.log('BrainBox: Auth Handshake captured.');
    }
  }
});

// Pick the right adapter for this platform (READ-ONLY)
let adapter: BaseAdapter | null = null;

if (hostname.includes('chatgpt.com')) {
  adapter = new ChatGPTAdapter();
} else if (hostname.includes('gemini.google.com')) {
  adapter = new GeminiAdapter();
}

// Listen for messages from the service worker / popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'EXTRACT_CHAT' && adapter) {
    // Read-only extraction of chat data
    const chat = adapter.extract();
    sendResponse({ success: true, data: chat });
  }

  if (message.type === 'INJECT_TEXT') {
    // The ONLY allowed DOM write: inject text into the platform's active textarea
    const textarea = document.querySelector<HTMLTextAreaElement>('textarea');
    if (textarea) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(textarea, message.payload.text);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, reason: 'No textarea found' });
    }
  }
  return true;
});
