import { GeminiAdapter } from '../background/platformAdapters/gemini.adapter';

export default defineContentScript({
  matches: ['https://gemini.google.com/*'],
  runAt: 'document_idle',
  main() {
    const adapter = new GeminiAdapter();

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'EXTRACT_CHAT') {
        const chat = adapter.extract();
        sendResponse({ success: true, data: chat });
      }

      if (message.type === 'INJECT_TEXT') {
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
