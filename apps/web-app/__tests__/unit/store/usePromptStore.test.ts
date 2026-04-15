import { describe, it, expect, beforeEach } from 'vitest';
import { usePromptStore } from '../../../store/usePromptStore';
import type { Folder, Item } from '@brainbox/types';

const mockFolder: Folder = {
  id: 'f1',
  name: 'Test Folder',
  type: 'prompt',
  iconIndex: 0,
  level: 0,
  parentId: null,
};

const mockItem: Item = {
  id: 'i1',
  folderId: 'f1',
  title: 'Test Item',
  description: 'Test description',
  content: 'Test Content',
  type: 'prompt',
};

describe('usePromptStore', () => {
  beforeEach(() => {
    // Reset state before each test
    usePromptStore.setState({
      folders: [],
      items: [],
      activeFolder: null,
    });
  });

  it('should initialize with empty state', () => {
    const state = usePromptStore.getState();
    expect(state.folders).toEqual([]);
    expect(state.items).toEqual([]);
    expect(state.activeFolder).toBeNull();
  });

  it('should add a folder', () => {
    const { addFolder } = usePromptStore.getState();
    addFolder(mockFolder);
    
    expect(usePromptStore.getState().folders).toHaveLength(1);
    expect(usePromptStore.getState().folders[0]).toEqual(mockFolder);
  });

  it('should add an item', () => {
    const { addItem } = usePromptStore.getState();
    addItem(mockItem);
    
    expect(usePromptStore.getState().items).toHaveLength(1);
    expect(usePromptStore.getState().items[0]).toEqual(mockItem);
  });

  it('should update a folder', () => {
    const { addFolder, updateFolder } = usePromptStore.getState();
    addFolder(mockFolder);
    updateFolder('f1', { name: 'Updated Name' });
    
    const updated = usePromptStore.getState().folders.find(f => f.id === 'f1');
    expect(updated?.name).toBe('Updated Name');
  });

  it('should update an item', () => {
    const { addItem, updateItem } = usePromptStore.getState();
    addItem(mockItem);
    updateItem('i1', { content: 'Updated Content' });
    
    const updated = usePromptStore.getState().items.find(i => i.id === 'i1');
    expect(updated?.content).toBe('Updated Content');
  });

  it('should delete a folder', () => {
    const { addFolder, deleteFolder } = usePromptStore.getState();
    addFolder(mockFolder);
    deleteFolder('f1');
    
    expect(usePromptStore.getState().folders).toHaveLength(0);
  });

  it('should delete an item', () => {
    const { addItem, deleteItem } = usePromptStore.getState();
    addItem(mockItem);
    deleteItem('i1');
    
    expect(usePromptStore.getState().items).toHaveLength(0);
  });

  it('should set active folder', () => {
    const { setActiveFolder } = usePromptStore.getState();
    setActiveFolder('f1');
    
    expect(usePromptStore.getState().activeFolder).toBe('f1');
  });

  it('should bulk set folders and items', () => {
    const { setFolders, setItems } = usePromptStore.getState();
    setFolders([mockFolder]);
    setItems([mockItem]);
    
    expect(usePromptStore.getState().folders).toEqual([mockFolder]);
    expect(usePromptStore.getState().items).toEqual([mockItem]);
  });
});
