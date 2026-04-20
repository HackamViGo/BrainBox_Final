import type { CapturedChat } from './base';
import { BaseAdapter } from './base';

export class ChatGPTAdapter extends BaseAdapter {
  platformId = 'chatgpt';

  extract(): CapturedChat {
    const messages: CapturedChat['messages'] = [];
    const messageElements = document.querySelectorAll('[data-message-author-role]');

    messageElements.forEach((el) => {
      const role = el.getAttribute('data-message-author-role') as 'user' | 'assistant';
      const content = el.textContent || '';
      messages.push({ role, content });
    });

    return {
      title: document.title,
      messages,
      url: window.location.href,
    };
  }
}
