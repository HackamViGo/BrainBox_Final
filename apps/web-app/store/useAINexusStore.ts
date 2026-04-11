'use client'

import { create } from 'zustand'

interface AINexusState {
  activeModelId: string
  pendingModelId: string | null
}

interface AINexusActions {
  selectModel: (id: string) => void
  confirmModel: () => void
  cancelModel: () => void
}

export type AINexusStore = AINexusState & AINexusActions

export const useAINexusStore = create<AINexusStore>()((set) => ({
  activeModelId: 'chatgpt',
  pendingModelId: null,

  selectModel: (id) => set({ pendingModelId: id }),
  confirmModel: () => 
    set((state) => ({ 
      activeModelId: state.pendingModelId || state.activeModelId,
      pendingModelId: null 
    })),
  cancelModel: () => set({ pendingModelId: null }),
}))
