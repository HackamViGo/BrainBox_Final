import { describe, it, expect, beforeEach } from 'vitest';
import { useAINexusStore } from '../../../store/useAINexusStore';

describe('useAINexusStore', () => {
  beforeEach(() => {
    // Reset store state manually if needed, but for simple stores
    // we just use the default state each time if we don't persist it.
    // AINexusStore is not persisted in the current implementation.
    const state = useAINexusStore.getState();
    useAINexusStore.setState({
      activeModelId: 'chatgpt',
      pendingModelId: null,
    });
  });

  it('should have default state', () => {
    const state = useAINexusStore.getState();
    expect(state.activeModelId).toBe('chatgpt');
    expect(state.pendingModelId).toBeNull();
  });

  it('should set pendingModelId when selectModel is called', () => {
    const { selectModel } = useAINexusStore.getState();
    selectModel('gemini');
    
    expect(useAINexusStore.getState().pendingModelId).toBe('gemini');
    expect(useAINexusStore.getState().activeModelId).toBe('chatgpt');
  });

  it('should update activeModelId and clear pendingModelId on confirmModel', () => {
    const { selectModel, confirmModel } = useAINexusStore.getState();
    
    selectModel('gemini');
    confirmModel();
    
    expect(useAINexusStore.getState().activeModelId).toBe('gemini');
    expect(useAINexusStore.getState().pendingModelId).toBeNull();
  });

  it('should clear pendingModelId on cancelModel', () => {
    const { selectModel, cancelModel } = useAINexusStore.getState();
    
    selectModel('claude');
    cancelModel();
    
    expect(useAINexusStore.getState().activeModelId).toBe('chatgpt');
    expect(useAINexusStore.getState().pendingModelId).toBeNull();
  });

  it('should keep current activeModelId if confirmModel is called without pending', () => {
    const { confirmModel } = useAINexusStore.getState();
    
    confirmModel();
    
    expect(useAINexusStore.getState().activeModelId).toBe('chatgpt');
    expect(useAINexusStore.getState().pendingModelId).toBeNull();
  });
});
