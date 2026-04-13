import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storage } from './storage'

describe('Extension Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get value from chrome.storage.local', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({ 'test-key': 'test-value' })
    
    const value = await storage.get('test-key')
    
    expect(chrome.storage.local.get).toHaveBeenCalledWith('test-key')
    expect(value).toBe('test-value')
  })

  it('should return null if key not found', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({})
    
    const value = await storage.get('missing-key')
    
    expect(value).toBeNull()
  })

  it('should set value in chrome.storage.local', async () => {
    await storage.set('new-key', { data: 123 })
    
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ 'new-key': { data: 123 } })
  })

  it('should remove key', async () => {
    await storage.remove('old-key')
    
    expect(chrome.storage.local.remove).toHaveBeenCalledWith('old-key')
  })
})
