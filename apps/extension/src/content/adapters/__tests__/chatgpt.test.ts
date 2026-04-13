// apps/extension/src/content/adapters/__tests__/chatgpt.test.ts
import { describe, it, expect } from 'vitest';
import { ChatGPTAdapter } from '../chatgpt.adapter';

describe('ChatGPTAdapter', () => {
  it('should extract messages from valid DOM', () => {
    document.body.innerHTML = '<div data-message-author-role="user">Hello</div>';
    const adapter = new ChatGPTAdapter();
    const chat = adapter.extract();
    expect(chat.messages[0]!.content).toBe('Hello');
  });
});
