'use client'

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Folder, Item } from '@brainbox/types';
import { STORAGE_KEYS } from '@brainbox/utils';

interface PromptState {
  folders: Folder[];
  items: Item[];
  activeFolder: string | null;
  _hasHydrated: boolean;
  
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
  setHasHydrated: (v: boolean) => void;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({
      folders: [],
      items: [],
      activeFolder: null,
      _hasHydrated: false,

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
      
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: STORAGE_KEYS.PROMPT_STORE || 'brainbox-prompt-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        folders: state.folders,
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
