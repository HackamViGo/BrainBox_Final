'use client'

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Folder, Item } from '@brainbox/types';

interface PromptState {
  folders: Folder[];
  items: Item[];
  activeFolder: string | null;
  
  // Actions
  setFolders: (folders: Folder[]) => void;
  setItems: (items: Item[]) => void;
  setActiveFolder: (folderId: string | null) => void;
  addFolder: (folder: Folder) => void;
  addItem: (item: Item) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteFolder: (id: string) => void;
  deleteItem: (id: string) => void;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({
      folders: [],
      items: [],
      activeFolder: null,

      setFolders: (folders) => set({ folders }),
      setItems: (items) => set({ items }),
      setActiveFolder: (folderId) => set({ activeFolder: folderId }),
      
      addFolder: (folder) => 
        set((state) => ({ folders: [...state.folders, folder] })),
      
      addItem: (item) => 
        set((state) => ({ items: [...state.items, item] })),
      
      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
        
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
        
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
        })),
        
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
    }),
    {
      name: 'brainbox-prompt-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        folders: state.folders,
        items: state.items,
      }),
    }
  )
);
