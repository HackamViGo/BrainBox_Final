import { ChatGPTAdapter } from '@/content/adapters/chatgpt.adapter';
import { GeminiAdapter } from '@/content/adapters/gemini.adapter';
import type { BaseAdapter } from '@/content/adapters/base.adapter';

/**
 * BrainBox Content Script Entry Point (WXT)
 */
export default defineContentScript({
  matches: [
    'https://chatgpt.com/*',
    'https://gemini.google.com/*',
    'http://localhost:3000/extension-auth',
    'https://*.brainbox.ai/extension-auth'
  ],
  runAt: 'document_idle',
  main() {
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
  },
});
