import { create } from 'zustand'
import { logger } from '@brainbox/utils'

interface ExtensionState {
  isConnected: boolean
  lastSyncAt: string | null
  activePaltforms: string[]
  version: string | null
  error: string | null
  
  // Actions
  setConnection: (status: boolean) => void
  updateSyncStatus: (platforms: string[]) => void
  setError: (error: string | null) => void
  setVersion: (version: string) => void
}

/**
 * Extension Store
 * Manages the client-side state of the BrainBox Chrome Extension connection.
 */
export const useExtensionStore = create<ExtensionState>((set) => ({
  isConnected: false,
  lastSyncAt: null,
  activePaltforms: [],
  version: null,
  error: null,

  setConnection: (status) => {
    set({ isConnected: status })
    if (status) {
      logger.info('ExtensionStore', 'Extension connected')
    }
  },

  updateSyncStatus: (platforms) => {
    set({ 
      activePaltforms: platforms,
      lastSyncAt: new Date().toISOString()
    })
  },

  setError: (error) => set({ error }),
  
  setVersion: (version) => set({ version })
}))
