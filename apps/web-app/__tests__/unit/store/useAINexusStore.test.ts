import { describe, it, expect, beforeEach } from 'vitest';
import { useAINexusStore } from '../../../store/useAINexusStore';

describe('useAINexusStore', () => {
  beforeEach(() => {
    // Reset store state manually to clean state
    useAINexusStore.setState({
      messages: [],
      isGenerating: false,
      modelVersion: 'basic',
    });
  });

  it('should have default state', () => {
    const state = useAINexusStore.getState();
    expect(state.messages).toHaveLength(0);
    expect(state.isGenerating).toBe(false);
    expect(state.modelVersion).toBe('basic');
  });

  it('should add a message', () => {
    const { addMessage } = useAINexusStore.getState();
    addMessage({ id: 'msg-1', role: 'user', content: 'Test message' });
    
    const state = useAINexusStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]!.content).toBe('Test message');
  });

  it('should set isGenerating state', () => {
    const { setIsGenerating } = useAINexusStore.getState();
    setIsGenerating(true);
    
    expect(useAINexusStore.getState().isGenerating).toBe(true);
  });

  it('should set modelVersion', () => {
    const { setModelVersion } = useAINexusStore.getState();
    setModelVersion('latest');
    
    expect(useAINexusStore.getState().modelVersion).toBe('latest');
  });

  it('should clear all messages', () => {
    const { addMessage, clearMessages } = useAINexusStore.getState();
    addMessage({ id: 'msg-1', role: 'user', content: 'Test message' });
    clearMessages();
    
    const state = useAINexusStore.getState();
    expect(state.messages).toHaveLength(0);
  });
});
