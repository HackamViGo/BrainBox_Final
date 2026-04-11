'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ThemeName, ScreenName } from '@brainbox/types'
import { STORAGE_KEYS } from '@brainbox/utils'

interface AppState {
  activeScreen: ScreenName
  theme: ThemeName
  isLoggedIn: boolean
  isSidebarExpanded: boolean
  isMobileSidebarOpen: boolean
  isPinned: boolean
  activeModelId: string
  pendingModelId: string | null
  activeFolder: string | null
}

interface AppActions {
  setActiveScreen: (screen: ScreenName) => void
  setTheme: (theme: ThemeName) => void
  setIsLoggedIn: (v: boolean) => void
  setPendingModelId: (id: string | null) => void
  setActiveFolder: (id: string | null) => void
  setIsSidebarExpanded: (v: boolean) => void
  setIsMobileSidebarOpen: (v: boolean) => void
  setPinned: (v: boolean) => void
  closeMobileSidebar: () => void
}

export type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // State
      activeScreen: 'dashboard',
      theme: 'chatgpt',
      isLoggedIn: false,
      isSidebarExpanded: false,
      isMobileSidebarOpen: false,
      isPinned: false,
      activeModelId: 'chatgpt',
      pendingModelId: null,
      activeFolder: null,

      // Actions
      setActiveScreen: (screen) => {
        const currentScreen = get().activeScreen
        if (screen !== currentScreen) {
          set({ activeFolder: null })
        }
        set({ activeScreen: screen, isMobileSidebarOpen: false })
      },
      setTheme: (theme) => set({ theme }),
      setIsLoggedIn: (v) => set({ isLoggedIn: v }),
      setPendingModelId: (id) => set({ pendingModelId: id }),
      setActiveFolder: (id) => set({ activeFolder: id }),
      setIsSidebarExpanded: (v) => set({ isSidebarExpanded: v }),
      setIsMobileSidebarOpen: (v) => set({ isMobileSidebarOpen: v }),
      setPinned: (v) => set({ isPinned: v }),
      closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        isLoggedIn: state.isLoggedIn,
        activeModelId: state.activeModelId,
      }),
    }
  )
)
