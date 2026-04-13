'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Folder, Item } from '@brainbox/types'
import { STORAGE_KEYS } from '@brainbox/utils'
import { 
  loadUserData, 
  createFolder as serverCreateFolder, 
  deleteFolder as serverDeleteFolder,
  upsertItem as serverUpsertItem,
  softDeleteItem as serverSoftDeleteItem,
  freezeItem as serverFreezeItem
} from '@/actions/library'

interface LibraryState {
  libraryFolders: Folder[]
  promptFolders: Folder[]
  items: Item[]
  isLoading: boolean
}

interface LibraryActions {
  loadData: () => Promise<void>
  setLibraryFolders: (folders: Folder[]) => void
  setPromptFolders: (folders: Folder[]) => void
  setItems: (items: Item[]) => void
  createFolder: (data: Omit<Folder, 'id'>) => Promise<void>
  removeFolder: (id: string) => Promise<void>
  createItem: (data: Omit<Item, 'id'>) => Promise<void>
  saveItem: (item: Item) => Promise<void>
  updateItem: (id: string, updates: Partial<Item>) => void
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteItem: (id: string) => Promise<void>
  freezeItem: (id: string) => Promise<void>
  // Helper aliases for the screens
  addItem: (data: Omit<Item, 'id'>) => Promise<void>
  addCapture: (data: Omit<Item, 'id' | 'type'>) => Promise<void>
}

export type LibraryStore = LibraryState & LibraryActions

const MOCK_LIBRARY_FOLDERS: Folder[] = [
  { id: 'mock-lf-1', name: 'Q1 Launch', iconIndex: 0, level: 0, type: 'library', parentId: null },
  { id: 'mock-lf-2', name: 'Research', iconIndex: 12, level: 0, type: 'library', parentId: null },
  { id: 'mock-lf-3', name: 'Deep Dives', iconIndex: 4, level: 1, type: 'library', parentId: 'mock-lf-2' },
]

const MOCK_PROMPT_FOLDERS: Folder[] = [
  { id: 'mock-pf-1', name: 'Coding Agents', iconIndex: 8, level: 0, type: 'prompt', parentId: null },
  { id: 'mock-pf-2', name: 'Writing Styles', iconIndex: 21, level: 0, type: 'prompt', parentId: null }
]

const MOCK_ITEMS: Item[] = [
  { id: 'mock-i-1', title: 'Next.js 16 Migration', description: 'Chat about App Router and React 19', type: 'chat', folderId: 'mock-lf-1', content: '', theme: 'chatgpt' },
  { id: 'mock-i-2', title: 'Supabase RLS Rules', description: 'Debugging policies', type: 'chat', folderId: 'mock-lf-3', content: '', theme: 'claude' },
  { id: 'mock-i-3', title: 'Vite vs Farm', description: 'Performance comparison', type: 'chat', folderId: null, content: '', theme: 'gemini' }, // unassigned
  { id: 'mock-i-4', title: 'Senior Frontend Dev', description: 'System prompt with strict rules', type: 'prompt', folderId: 'mock-pf-1', content: 'You are...', theme: 'deepseek' },
  { id: 'mock-i-5', title: 'Creative Writer', description: 'Tone and voice guidelines', type: 'prompt', folderId: 'mock-pf-2', content: 'Write with flair...', theme: 'claude' }
]

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // State
      libraryFolders: MOCK_LIBRARY_FOLDERS,
      promptFolders: MOCK_PROMPT_FOLDERS,
      items: MOCK_ITEMS,
      isLoading: false,

      // Actions
      loadData: async () => {
        set({ isLoading: true })
        try {
          const data = await loadUserData()
          if (data) {
            // Merge data with deduplication by ID
            const mergeById = <T extends { id: string }>(...arrays: T[][]) => {
              const map = new Map<string, T>()
              arrays.flat().forEach(item => map.set(item.id, item))
              return Array.from(map.values())
            }

            set({
              libraryFolders: mergeById<Folder>(data.libraryFolders),
              promptFolders: mergeById<Folder>(data.promptFolders),
              items: mergeById<Item>(data.items),
            })
          }
        } catch (error) {
          console.error('Failed to load library data:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      setLibraryFolders: (folders) => set({ libraryFolders: folders }),
      setPromptFolders: (folders) => set({ promptFolders: folders }),
      setItems: (items) => set({ items: items }),

      createFolder: async (data: Omit<Folder, 'id'>) => {
        const tempId = crypto.randomUUID()
        const newFolder: Folder = { ...data, id: tempId }
        
        const previousLibraryFolders = get().libraryFolders
        const previousPromptFolders = get().promptFolders

        // Optimistic update
        if (data.type === 'library') {
          set({ libraryFolders: [...previousLibraryFolders, newFolder] })
        } else {
          set({ promptFolders: [...previousPromptFolders, newFolder] })
        }

        try {
          const created = await serverCreateFolder(data)
          // Update temp id with real id
          if (data.type === 'library') {
            set({
              libraryFolders: get().libraryFolders.map((f) => (f.id === tempId ? created : f)),
            })
          } else {
            set({
              promptFolders: get().promptFolders.map((f) => (f.id === tempId ? created : f)),
            })
          }
        } catch (error) {
          console.error('Failed to create folder:', error)
          // Rollback
          set({
            libraryFolders: previousLibraryFolders,
            promptFolders: previousPromptFolders,
          })
        }
      },

      removeFolder: async (id) => {
        const previousLibraryFolders = get().libraryFolders
        const previousPromptFolders = get().promptFolders

        // Optimistic remove
        set({
          libraryFolders: previousLibraryFolders.filter((f) => f.id !== id),
          promptFolders: previousPromptFolders.filter((f) => f.id !== id),
        })

        try {
          await serverDeleteFolder(id)
        } catch (error) {
          console.error('Failed to delete folder:', error)
          // Rollback
          set({
            libraryFolders: previousLibraryFolders,
            promptFolders: previousPromptFolders,
          })
        }
      },

      createItem: async (data: Omit<Item, 'id'>) => {
        const tempId = crypto.randomUUID()
        const newItem: Item = { ...data, id: tempId }
        
        const previousItems = get().items
        set({ items: [...previousItems, newItem] })

        try {
          const created = await serverUpsertItem(data)
          set({
            items: get().items.map((i) => (i.id === tempId ? created : i)),
          })
        } catch (error) {
          console.error('Failed to create item:', error)
          set({ items: previousItems })
        }
      },

      saveItem: async (item) => {
        // Optimistic upsert
        const previousItems = get().items
        const exists = previousItems.some((i) => i.id === item.id)
        
        if (exists) {
          set({
            items: previousItems.map((i) => (i.id === item.id ? item : i)),
          })
        } else {
          set({ items: [...previousItems, item] })
        }

        try {
          await serverUpsertItem(item)
        } catch (error) {
          console.error('Failed to save item:', error)
          // No rollback for upsert as per constraints (dangerous)
        }
      },

      deleteItem: async (id) => {
        const previousItems = get().items
        const deletedAt = new Date().toISOString()

        // Optimistic soft delete
        set({
          items: previousItems.map((i) => 
            i.id === id ? { ...i, deletedAt } : i
          ),
        })

        try {
          await serverSoftDeleteItem(id)
        } catch (error) {
          console.error('Failed to delete item:', error)
          // Rollback for soft delete is safe
          set({ items: previousItems })
        }
      },

      freezeItem: async (id) => {
        const previousItems = get().items

        // Optimistic freeze
        set({
          items: previousItems.map((i) => 
            i.id === id ? { ...i, isFrozen: true } : i
          ),
        })

        try {
          await serverFreezeItem(id)
        } catch (error) {
          console.error('Failed to freeze item:', error)
          set({ items: previousItems })
        }
      },

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),

      updateFolder: (id, updates) =>
        set((state) => ({
          libraryFolders: state.libraryFolders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
          promptFolders: state.promptFolders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),

      addItem: async (data) => get().createItem(data),
      
      addCapture: async (data) => {
        await get().createItem({ ...data, type: 'capture' })
      },
    }),
    {
      name: STORAGE_KEYS.LIBRARY_STORE,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
