export interface CapturedChat {
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  url: string;
}

export abstract class BaseAdapter {
  abstract platformId: string;
  abstract extract(): CapturedChat;
}
