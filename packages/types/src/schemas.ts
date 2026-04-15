import { z } from 'zod';

export const ThemeNameSchema = z.enum([
  'chatgpt', 'gemini', 'claude', 'grok', 'perplexity', 'lmarena', 'deepseek', 'qwen'
]);

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  iconIndex: z.number().int().min(0).max(76),
  parentId: z.string().nullable(),
  type: z.enum(['library', 'prompt']),
  level: z.number().int().min(0).max(5),
});

export const ItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string(),
  type: z.enum(['chat', 'prompt', 'capture']),
  folderId: z.string().nullable(),
  content: z.string().optional(),
  url: z.string().optional(),
  source: z.string().optional(),
  sourceId: z.string().optional(),
  platform: ThemeNameSchema.optional(),
  messages: z.array(z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  theme: ThemeNameSchema.optional(),
  isFrozen: z.boolean().optional(),
  deletedAt: z.string().optional(),
});

export const ScreenNameSchema = z.enum([
  'dashboard', 'login', 'settings', 'identity', 'profile', 'archive', 
  'library', 'prompts', 'ainexus', 'studio', 'extension', 
  'mindgraph', 'analytics', 'workspace'
]);

export type ScreenName = z.infer<typeof ScreenNameSchema>;
