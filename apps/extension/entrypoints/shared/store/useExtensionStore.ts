import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ExtensionState {
  isActive: boolean;
  toggleActive: () => void;
}

/**
 * Extension Store
 * Follows BrainBox rules: skipHydration: true
 */
export const useExtensionStore = create<ExtensionState>()(
  persist(
    (set): ExtensionState => ({
      isActive: true,
      toggleActive: () => set((state: ExtensionState) => ({ isActive: !state.isActive })),
    }),
    {
      name: 'brainbox-extension-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => chrome.storage.local.get(name).then(res => res[name]),
        setItem: (name: string, value: string) => chrome.storage.local.set({ [name]: value }),
        removeItem: (name: string) => chrome.storage.local.remove(name),
      })),
      skipHydration: true, // MANDATORY
    }
  )
);
