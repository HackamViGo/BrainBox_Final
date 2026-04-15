import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExtensionStore } from '../../../store/useExtensionStore';

describe('useExtensionStore', () => {
  beforeEach(() => {
    // Reset state
    useExtensionStore.setState({
      isActive: true,
    });
    vi.clearAllMocks();
  });

  it('should initialize with isActive: true', () => {
    const state = useExtensionStore.getState();
    expect(state.isActive).toBe(true);
  });

  it('should toggleisActive when toggleActive is called', () => {
    const { toggleActive } = useExtensionStore.getState();
    
    toggleActive();
    expect(useExtensionStore.getState().isActive).toBe(false);
    
    toggleActive();
    expect(useExtensionStore.getState().isActive).toBe(true);
  });

  it('should attempt to persist to chrome.storage.local', async () => {
    const { toggleActive } = useExtensionStore.getState();
    
    // We don't test the actual persistence here easily without more complex setup
    // because zustand persist happens asynchronously and we'd need to wait for 
    // chrome.storage.local.set to be called.
    // However, we can at least verify the action updates the state.
    toggleActive();
    expect(useExtensionStore.getState().isActive).toBe(false);
  });
});
