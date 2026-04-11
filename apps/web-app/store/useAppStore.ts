import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeName, ScreenName } from '@brainbox/types';
import { STORAGE_KEYS } from '@brainbox/utils';

interface AppState {
  activeScreen: ScreenName;
  activeTheme: ThemeName;
  isSidebarExpanded: boolean;
  isPinned: boolean;
  isLoggedIn: boolean;
  
  // Actions
  setActiveScreen: (screen: ScreenName) => void;
  setActiveTheme: (theme: ThemeName) => void;
  toggleSidebar: (expanded?: boolean) => void;
  setPinned: (pinned: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeScreen: 'dashboard',
      activeTheme: 'chatgpt',
      isSidebarExpanded: false,
      isPinned: false,
      isLoggedIn: false,

      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setActiveTheme: (theme) => set({ activeTheme: theme }),
      toggleSidebar: (expanded) => 
        set((state) => ({ isSidebarExpanded: expanded ?? !state.isSidebarExpanded })),
      setPinned: (pinned) => set({ isPinned: pinned }),
      setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
    }),
    {
      name: 'brainbox-app-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // Mandatory for Next.js to prevent hydration mismatch
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        isPinned: state.isPinned,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
