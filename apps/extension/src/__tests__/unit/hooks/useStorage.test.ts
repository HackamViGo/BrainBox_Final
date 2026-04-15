import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStorage } from '../../../hooks/useStorage';
import { storage } from '../../../utils/storage';

vi.mock('../../../utils/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe('useStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock behavior
    (storage.get as any).mockResolvedValue(null);
  });

  it('should initialize with initialValue', () => {
    const { result } = renderHook(() => useStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should fetch stored value on mount', async () => {
    (storage.get as any).mockResolvedValue('stored-value');
    
    let rendered: any;
    await act(async () => {
      rendered = renderHook(() => useStorage('test-key', 'default'));
    });
    
    expect(storage.get).toHaveBeenCalledWith('test-key');
    // We expect the state to eventually be 'stored-value' after the effect runs
    // Note: useEffect runs after render, so we might need to wait
    expect(rendered.result.current[0]).toBe('stored-value');
  });

  it('should update value and storage when updateValue is called', async () => {
    const { result } = renderHook(() => useStorage('test-key', 'default'));
    
    await act(async () => {
      await result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(storage.set).toHaveBeenCalledWith('test-key', 'new-value');
  });

  it('should respond to chrome.storage.onChanged events', () => {
    const { result } = renderHook(() => useStorage('test-key', 'default'));
    
    // Find the listener passed to addListener
    const listener = (chrome.storage.onChanged.addListener as any).mock.calls[0][0];
    
    act(() => {
      listener({ 'test-key': { newValue: 'remote-change', oldValue: 'default' } }, 'local');
    });
    
    expect(result.current[0]).toBe('remote-change');
  });
});
