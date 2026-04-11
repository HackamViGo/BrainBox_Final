export interface Folder {
  id: string;
  name: string;
  iconIndex: number;
  parentId: string | null;
  type: 'library' | 'prompt';
  level: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'prompt';
  folderId: string | null;
  url?: string;
  source?: string;
  theme?: ThemeName;
  content?: string;
}

export type ThemeName = 'chatgpt' | 'gemini' | 'claude' | 'grok' | 'perplexity' | 'lmarena' | 'deepseek' | 'qwen';

export interface Theme {
  name: ThemeName;
  color: string;
  lightPosition: string;
}

export const THEMES: Record<ThemeName, Theme> = {
  chatgpt: { name: 'chatgpt', color: '#10a37f', lightPosition: 'top-left' },
  gemini: { name: 'gemini', color: '#8ab4f8', lightPosition: 'bottom-right' },
  claude: { name: 'claude', color: '#d97757', lightPosition: 'top-right' },
  grok: { name: 'grok', color: '#e5e5e5', lightPosition: 'bottom-left' },
  perplexity: { name: 'perplexity', color: '#22d3ee', lightPosition: 'top-center' },
  lmarena: { name: 'lmarena', color: '#fbbf24', lightPosition: 'center' },
  deepseek: { name: 'deepseek', color: '#2563eb', lightPosition: 'bottom-center' },
  qwen: { name: 'qwen', color: '#a855f7', lightPosition: 'center-right' },
};
