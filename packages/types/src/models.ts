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
  tags?: string[];
  isFrozen?: boolean;
  deletedAt?: string;
}

export type ThemeName = 'chatgpt' | 'gemini' | 'claude' | 'grok' | 'perplexity' | 'lmarena' | 'deepseek' | 'qwen';

export interface Theme {
  name: ThemeName;
  color: string;
  lightPosition: string;
}
