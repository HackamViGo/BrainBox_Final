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
  type: 'chat' | 'prompt' | 'capture';
  folderId: string | null;
  modelId?: string;
  updatedAt?: string;
  url?: string;
  source?: string;
  sourceId?: string;
  platform?: ThemeName;
  content?: string;
  messages?: any[];
  tags?: string[];
  isFrozen?: boolean;
  isPermanent?: boolean;
  deletedAt?: string;
}

export type ThemeName = 'chatgpt' | 'gemini' | 'claude' | 'grok' | 'perplexity' | 'lmarena' | 'deepseek' | 'qwen';

export interface Theme {
  name: ThemeName;
  color: string;
  lightPosition: string;
}
