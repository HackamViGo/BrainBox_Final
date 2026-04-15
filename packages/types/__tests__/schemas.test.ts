import { describe, it, expect } from 'vitest';
import { FolderSchema, ItemSchema, ThemeNameSchema } from '../src/schemas';

describe('schemas', () => {
  describe('FolderSchema', () => {
    it('should validate a valid folder', () => {
      const folder = {
        id: '123',
        name: 'My Folder',
        iconIndex: 10,
        parentId: null,
        type: 'library',
        level: 0,
      };
      expect(() => FolderSchema.parse(folder)).not.toThrow();
    });

    it('should throw for invalid iconIndex (> 76)', () => {
      const folder = {
        id: '123',
        name: 'My Folder',
        iconIndex: 77,
        parentId: null,
        type: 'library',
        level: 0,
      };
      expect(() => FolderSchema.parse(folder)).toThrow();
    });
  });

  describe('ItemSchema', () => {
    it('should validate chat and prompt types', () => {
      const chatItem = {
        id: '123',
        title: 'My Chat',
        description: 'A chat',
        type: 'chat',
        folderId: null,
        content: 'content',
      };
      const promptItem = {
        id: '124',
        title: 'My Prompt',
        description: 'A prompt',
        type: 'prompt',
        folderId: null,
        content: 'content',
      };
      expect(() => ItemSchema.parse(chatItem)).not.toThrow();
      expect(() => ItemSchema.parse(promptItem)).not.toThrow();
    });

    it('should validate extension-specific fields', () => {
      const extensionItem = {
        id: '125',
        title: 'Captured Chat',
        description: 'From platform',
        type: 'chat',
        folderId: null,
        sourceId: 'conv_123',
        platform: 'chatgpt',
        url: 'https://chatgpt.com/c/123',
        messages: [{ role: 'user', content: 'hello' }],
      };
      expect(() => ItemSchema.parse(extensionItem)).not.toThrow();
    });
  });

  describe('ThemeNameSchema', () => {
    it('should throw on unknown theme', () => {
      expect(() => ThemeNameSchema.parse('unknown')).toThrow();
    });
  });
});
