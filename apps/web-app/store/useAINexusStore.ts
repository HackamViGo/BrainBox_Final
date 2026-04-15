'use client'

import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isCode?: boolean
}

interface AINexusState {
  messages: Message[]
  isGenerating: boolean
  modelVersion: 'basic' | 'latest'
}

interface AINexusActions {
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setIsGenerating: (isGenerating: boolean) => void
  setModelVersion: (version: 'basic' | 'latest') => void
  clearMessages: () => void
}

export type AINexusStore = AINexusState & AINexusActions

export const useAINexusStore = create<AINexusStore>((set) => ({
  // State
  messages: [],
  isGenerating: false,
  modelVersion: 'basic',

  // Actions
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setModelVersion: (version) => set({ modelVersion: version }),
  clearMessages: () => set({ messages: [] }),
}))
