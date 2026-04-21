'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { ExtensionChatPayload } from '@brainbox/types'
import { logger } from '@brainbox/utils'

interface ExtensionState {
  /** List of raw captures received from the extension */
  captures: ExtensionChatPayload[]
  isLoading: boolean
  isConnected: boolean
  version: string
  lastSyncAt: number | null
  error: string | null
  activePlatforms: string[]
}

interface ExtensionActions {
  /** Adds a new capture to the local feed */
  addCapture: (capture: ExtensionChatPayload) => void
  /** Removes a capture from the local feed */
  removeCapture: (id: string) => void
  /** Clears all local captures */
  clearCaptures: () => void
}

type ExtensionStore = ExtensionState & ExtensionActions

/**
 * useExtensionStore
 * Manages the "Raw Feed" of captures coming from the Chrome Extension.
 * Persisted in localStorage with SSR hydration skip.
 */
export const useExtensionStore = create<ExtensionStore>()(
  persist(
    (set) => ({
      // ── Initial State ──
      captures: [],
      isLoading: false,
      isConnected: false,
      version: '1.0.0',
      lastSyncAt: null,
      error: null,
      activePlatforms: [],

      // ── Actions ──
      addCapture: (capture) => {
        logger.info('ExtensionStore', 'Adding new capture', { id: capture.id });
        set((state) => ({
          captures: [capture, ...state.captures]
        }))
      },

      removeCapture: (id) => {
        set((state) => ({
          captures: state.captures.filter((c) => c.id !== id)
        }))
      },

      clearCaptures: () => set({ captures: [] }),
    }),
    {
      name: 'brainbox-extension-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        captures: state.captures,
      }),
    }
  )
)

// ── Selector Hooks ──────────────────────────────────────────────────────────

export const useExtensionCaptures = () => useExtensionStore((s) => s.captures)

export const useExtensionStoreActions = () =>
  useExtensionStore(
    useShallow((s) => ({
      addCapture: s.addCapture,
      removeCapture: s.removeCapture,
      clearCaptures: s.clearCaptures,
    }))
  )
