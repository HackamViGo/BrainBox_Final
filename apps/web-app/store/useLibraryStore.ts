'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Folder, Item } from '@brainbox/types'
import { STORAGE_KEYS } from '@brainbox/utils'
import { logger } from '@brainbox/utils'
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

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // State — empty initial state; populated via loadData() after Supabase auth
      libraryFolders: [],
      promptFolders: [],
      items: [],
      isLoading: false,

      // Actions
      loadData: async (): Promise<void> => {
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
          logger.error('useLibraryStore', 'loadData failed', error)
        } finally {
          set({ isLoading: false })
        }
      },

      setLibraryFolders: (folders) => set({ libraryFolders: folders }),
      setPromptFolders: (folders) => set({ promptFolders: folders }),
      setItems: (items) => set({ items: items }),

      createFolder: async (data: Omit<Folder, 'id'>): Promise<void> => {
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
          logger.error('useLibraryStore', 'createFolder failed', error)
          // Rollback
          set({
            libraryFolders: previousLibraryFolders,
            promptFolders: previousPromptFolders,
          })
        }
      },

      removeFolder: async (id): Promise<void> => {
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
          logger.error('useLibraryStore', 'removeFolder failed', error)
          // Rollback
          set({
            libraryFolders: previousLibraryFolders,
            promptFolders: previousPromptFolders,
          })
        }
      },

      createItem: async (data: Omit<Item, 'id'>): Promise<void> => {
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
          logger.error('useLibraryStore', 'createItem failed', error)
          set({ items: previousItems })
        }
      },

      saveItem: async (item): Promise<void> => {
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
          logger.error('useLibraryStore', 'saveItem failed', error)
          // No rollback for upsert as per constraints (dangerous)
        }
      },

      deleteItem: async (id): Promise<void> => {
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
          logger.error('useLibraryStore', 'deleteItem failed', error)
          // Rollback for soft delete is safe
          set({ items: previousItems })
        }
      },

      freezeItem: async (id): Promise<void> => {
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
          logger.error('useLibraryStore', 'freezeItem failed', error)
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

      addItem: async (data): Promise<void> => get().createItem(data),
      
      addCapture: async (data): Promise<void> => {
        await get().createItem({ ...data, type: 'capture' })
      },
    }),
    {
      name: STORAGE_KEYS.LIBRARY_STORE,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: () => ({}), // Don't persist library data
    }
  )
)
