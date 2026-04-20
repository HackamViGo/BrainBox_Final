import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../utils/storage';

describe('Extension Storage Smoke Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be able to get a value from storage', async () => {
    // @ts-expect-error - Mocking chrome API
    chrome.storage.local.get.mockResolvedValue({ testKey: 'testValue' });
    
    const result = await storage.get('testKey');
    
    expect(chrome.storage.local.get).toHaveBeenCalledWith('testKey');
    expect(result).toBe('testValue');
  });

  it('should be able to set a value in storage', async () => {
    await storage.set('testKey', 'testValue');
    
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: 'testValue' });
  });

  it('should return null if key is not found', async () => {
    // @ts-expect-error - Mocking chrome API
    chrome.storage.local.get.mockResolvedValue({});
    
    const result = await storage.get('notFound');
    
    expect(result).toBeNull();
  });
});
