import type { CapturedChat } from './base.adapter';
import { BaseAdapter } from './base.adapter';

export class GeminiAdapter extends BaseAdapter {
  platformId = 'gemini';

  extract(): CapturedChat {
    const messages: CapturedChat['messages'] = [];
    
    try {
      // Logic ported from legacy brainbox_master.js
      const chatHistoryContainer = document.querySelector('#chat-history');
      if (!chatHistoryContainer) return this.emptyResult();

      const conversationBlocks = chatHistoryContainer.querySelectorAll('.conversation-container');
      
      conversationBlocks.forEach((block) => {
        // Extract user messages
        const userQueryContainer = block.querySelector('user-query .query-text');
        if (userQueryContainer) {
          const content = this.extractFormattedContent(userQueryContainer as HTMLElement);
          if (content) {
            messages.push({ role: 'user', content });
          }
        }

        // Extract assistant messages
        const modelResponseEntity = block.querySelector('model-response');
        if (modelResponseEntity) {
          const messageContentContainer = modelResponseEntity.querySelector('.model-response-text');
          if (messageContentContainer) {
            const content = this.extractFormattedContent(messageContentContainer as HTMLElement);
            if (content) {
              messages.push({ role: 'assistant', content });
            }
          }
        }
      });

    } catch (error) {
      console.error('[GeminiAdapter] DOM Extraction Error:', error);
    }

    return {
      title: this.extractTitle(),
      messages,
      url: window.location.href,
    };
  }

  private extractFormattedContent(element: HTMLElement): string {
    return (element.innerText || element.textContent || '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  private extractTitle(): string {
    const titleDiv = document.querySelector('.conversation-title');
    if (titleDiv) {
      // Remove child divs like .conversation-title-cover
      const clone = titleDiv.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('div').forEach(div => div.remove());
      return clone.textContent?.trim() || 'Untitled Chat';
    }
    return document.title.replace(' - Gemini', '').trim() || 'Untitled Chat';
  }

  private emptyResult(): CapturedChat {
    return {
      title: 'Untitled Chat',
      messages: [],
      url: window.location.href,
    };
  }
}
