import { Item, ThemeName } from '@brainbox/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CapturedChat {
  id: string; // conversationId
  title: string;
  messages: ChatMessage[];
  platform: ThemeName;
  url: string;
  metadata?: Record<string, any>;
}

export interface ExtensionState {
  isCapturing: boolean;
  lastSyncTime?: number;
  syncQueue: CapturedChat[];
}

export type ExtensionAction = 
  | { type: 'SAVE_CHAT'; payload: CapturedChat }
  | { type: 'SYNC_NOW' }
  | { type: 'SET_THEME'; payload: ThemeName };
