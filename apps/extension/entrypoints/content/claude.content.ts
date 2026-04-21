export default defineContentScript({
  matches: ['https://claude.ai/*'],
  runAt: 'document_idle',
  main() {
    // Placeholder for Claude adapter logic
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'EXTRACT_CHAT') {
        sendResponse({ success: false, reason: 'Claude adapter not implemented yet' });
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
