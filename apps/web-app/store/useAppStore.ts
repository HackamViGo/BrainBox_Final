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
  // Sidebar State
  switchMode: 'global' | 'folders' | 'feathers' | 'pulse' | 'workspace'
  slideDirection: number
  searchQuery: string
  expandedFolders: string[]
  // Modal States
  isNewFolderModalOpen: boolean
  isNewChatModalOpen: boolean
  isSmartSwitchModalOpen: boolean
  isApiKeyModalOpen: boolean
  // Modal Data
  targetModel: any | null
  apiKeyModelId: string | null
  apiKeyModelName: string | null
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
  setSwitchMode: (mode: 'global' | 'folders' | 'feathers' | 'pulse' | 'workspace', direction?: number) => void
  setSearchQuery: (query: string) => void
  toggleFolder: (folderId: string) => void
  setExpandedFolders: (ids: string[]) => void
  setModalOpen: (modal: 'newFolder' | 'newChat' | 'smartSwitch' | 'apiKey', open: boolean, data?: any) => void
  setActiveModelId: (id: string) => void
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

      // Sidebar Initial State
      switchMode: 'global',
      slideDirection: 1,
      searchQuery: '',
      expandedFolders: [],

      // Modal Initial State
      isNewFolderModalOpen: false,
      isNewChatModalOpen: false,
      isSmartSwitchModalOpen: false,
      isApiKeyModalOpen: false,

      targetModel: null,
      apiKeyModelId: null,
      apiKeyModelName: null,

      // Actions
      setActiveScreen: (screen) => {
        const currentScreen = get().activeScreen;
        const currentMode = get().switchMode;
        
        if (screen !== currentScreen) {
          // Logic for auto-switching modes based on selection
          if (screen === 'library' || screen === 'prompts') {
            set({ switchMode: 'folders', slideDirection: currentMode === 'global' ? 1 : -1, activeFolder: null });
          } else if (screen === 'studio') {
            set({ switchMode: 'feathers', slideDirection: currentMode === 'global' ? 1 : -1, activeFolder: null });
          } else if (screen === 'workspace') {
            set({ switchMode: 'workspace', slideDirection: currentMode === 'global' ? 1 : -1 });
          } else if (currentMode !== 'global') {
            set({ switchMode: 'global', slideDirection: -1 });
          }
        }
        set({ activeScreen: screen, isMobileSidebarOpen: false });
      },
      setTheme: (theme) => set({ theme }),
      setIsLoggedIn: (v) => set({ isLoggedIn: v }),
      setPendingModelId: (id) => set({ pendingModelId: id }),
      setActiveFolder: (id) => set({ activeFolder: id }),
      setIsSidebarExpanded: (v) => set({ isSidebarExpanded: v }),
      setIsMobileSidebarOpen: (v) => set({ isMobileSidebarOpen: v }),
      setPinned: (v) => set({ isPinned: v }),
      closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
      setSwitchMode: (mode, direction) => {
        const currentMode = get().switchMode;
        if (mode === currentMode) return;
        
        // Default direction logic if not provided
        let dir = direction;
        if (dir === undefined) {
          if (mode === 'global') dir = -1;
          else if (currentMode === 'global') dir = 1;
          else dir = mode === 'pulse' || mode === 'workspace' ? 1 : -1;
        }
        
        set({ switchMode: mode, slideDirection: dir });
      },
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleFolder: (folderId) => {
        const current = get().expandedFolders;
        if (current.includes(folderId)) {
          set({ expandedFolders: current.filter(id => id !== folderId) });
        } else {
          set({ expandedFolders: [...current, folderId] });
        }
      },
      setExpandedFolders: (ids) => set({ expandedFolders: ids }),
      setModalOpen: (modal, open, data) => {
        switch (modal) {
          case 'newFolder': set({ isNewFolderModalOpen: open }); break;
          case 'newChat': set({ isNewChatModalOpen: open }); break;
          case 'smartSwitch': set({ isSmartSwitchModalOpen: open, targetModel: data }); break;
          case 'apiKey': set({ isApiKeyModalOpen: open, apiKeyModelId: data?.id, apiKeyModelName: data?.name }); break;
        }
      },
      setActiveModelId: (id) => set({ activeModelId: id }),
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        isLoggedIn: state.isLoggedIn,
        activeModelId: state.activeModelId,
        isPinned: state.isPinned,
        isSidebarExpanded: state.isSidebarExpanded,
        expandedFolders: state.expandedFolders,
      }),
    }
  )
)
