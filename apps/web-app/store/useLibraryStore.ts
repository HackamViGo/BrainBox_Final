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
  addFolder: (data: Omit<Folder, 'id'>) => Promise<void>
  removeFolder: (id: string) => Promise<void>
  saveItem: (item: Item) => Promise<void>
  updateItem: (id: string, updates: Partial<Item>) => void
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteItem: (id: string) => Promise<void>
  freezeItem: (id: string) => Promise<void>
}

export type LibraryStore = LibraryState & LibraryActions

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // State
      libraryFolders: [],
      promptFolders: [],
      items: [],
      isLoading: false,

      // Actions
      loadData: async () => {
        set({ isLoading: true })
        try {
          const data = await loadUserData()
          if (data) {
            set({
              libraryFolders: data.libraryFolders,
              promptFolders: data.promptFolders,
              items: data.items,
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

      addFolder: async (data) => {
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
    }),
    {
      name: STORAGE_KEYS.LIBRARY_STORE,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
