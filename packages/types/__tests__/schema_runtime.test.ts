
import { describe, it, expect } from 'vitest';
import { ItemSchema } from '../src/schemas';

describe('ItemSchema Runtime Validation', () => {
  it('should accept null for theme', () => {
    const item = {
      id: 'test-item',
      title: 'Test Item',
      description: 'A test description',
      type: 'chat',
      folderId: null,
      theme: null,
    };
    const result = ItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('should accept null for deletedAt', () => {
    const item = {
      id: 'test-item',
      title: 'Test Item',
      description: 'A test description',
      type: 'chat',
      folderId: null,
      deletedAt: null,
    };
    const result = ItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('should accept null for platform', () => {
    const item = {
      id: 'test-item',
      title: 'Test Item',
      description: 'A test description',
      type: 'chat',
      folderId: null,
      platform: null,
    };
    const result = ItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });
});
