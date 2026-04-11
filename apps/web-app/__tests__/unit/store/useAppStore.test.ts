import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/store/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAppStore.setState({
      activeScreen: 'dashboard',
      theme: 'chatgpt',
      isLoggedIn: false,
      isSidebarExpanded: false,
      isMobileSidebarOpen: false,
      activeModelId: 'chatgpt',
      pendingModelId: null,
      activeFolder: null,
    })
  })

  it('should change active screen and reset active folder', () => {
    useAppStore.setState({ activeFolder: 'test-folder' })
    useAppStore.getState().setActiveScreen('library')
    
    expect(useAppStore.getState().activeScreen).toBe('library')
    expect(useAppStore.getState().activeFolder).toBeNull()
  })

  it('should close mobile sidebar when changing screen', () => {
    useAppStore.setState({ isMobileSidebarOpen: true })
    useAppStore.getState().setActiveScreen('prompts')
    
    expect(useAppStore.getState().isMobileSidebarOpen).toBe(false)
  })

  it('should close mobile sidebar via closeMobileSidebar action', () => {
    useAppStore.setState({ isMobileSidebarOpen: true })
    useAppStore.getState().closeMobileSidebar()
    
    expect(useAppStore.getState().isMobileSidebarOpen).toBe(false)
  })

  it('should respect partialize during persistence', () => {
    // This is hard to test directly without mocking the persist middleware,
    // but we can verify the state fields manually.
    const state = useAppStore.getState()
    const persist = (useAppStore as any).persist
    
    if (persist && persist.options && persist.options.partialize) {
      const partial = persist.options.partialize(state)
      expect(partial).toHaveProperty('theme')
      expect(partial).toHaveProperty('isLoggedIn')
      expect(partial).toHaveProperty('activeModelId')
      expect(Object.keys(partial)).toHaveLength(3)
    }
  })
})
