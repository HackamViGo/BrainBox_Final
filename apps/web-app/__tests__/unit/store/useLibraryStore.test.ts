import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLibraryStore } from '@/store/useLibraryStore'
import * as actions from '@/actions/library'

// Mock the server actions
vi.mock('@/actions/library', () => ({
  loadUserData: vi.fn(),
  createFolder: vi.fn(),
  deleteFolder: vi.fn(),
  upsertItem: vi.fn(),
  softDeleteItem: vi.fn(),
  freezeItem: vi.fn(),
}))

describe('useLibraryStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useLibraryStore.setState({
      libraryFolders: [],
      promptFolders: [],
      items: [],
      isLoading: false,
    })
  })

  it('should implement optimistic addFolder and update with server result', async () => {
    const mockCreatedFolder = { id: 'real-id', name: 'New Folder', type: 'library' }
    vi.mocked(actions.createFolder).mockResolvedValue(mockCreatedFolder as any)

    const promise = useLibraryStore.getState().addFolder({ name: 'New Folder', type: 'library', iconIndex: 0, parentId: null, level: 0 })
    
    // Check optimistic state
    expect(useLibraryStore.getState().libraryFolders).toHaveLength(1)
    expect(useLibraryStore.getState().libraryFolders[0].id).toBeDefined()

    await promise

    // Check final state
    expect(useLibraryStore.getState().libraryFolders[0].id).toBe('real-id')
  })

  it('should rollback addFolder on server error', async () => {
    vi.mocked(actions.createFolder).mockRejectedValue(new Error('Server error'))

    try {
      await useLibraryStore.getState().addFolder({ name: 'New Folder', type: 'library', iconIndex: 0, parentId: null, level: 0 })
    } catch (e) {
      // expected
    }

    expect(useLibraryStore.getState().libraryFolders).toHaveLength(0)
  })

  it('should soft delete item optimistically', async () => {
    const originalItem = { id: 'item-1', title: 'Test', type: 'chat', folderId: null, content: '' }
    useLibraryStore.setState({ items: [originalItem as any] })

    const promise = useLibraryStore.getState().deleteItem('item-1')
    
    expect(useLibraryStore.getState().items[0].deletedAt).toBeDefined()

    await promise
    expect(actions.softDeleteItem).toHaveBeenCalledWith('item-1')
  })

  it('should load and split data correctly', async () => {
    const mockData = {
      libraryFolders: [{ id: 'l1', type: 'library' }],
      promptFolders: [{ id: 'p1', type: 'prompt' }],
      items: [{ id: 'i1' }]
    }
    vi.mocked(actions.loadUserData).mockResolvedValue(mockData as any)

    await useLibraryStore.getState().loadData()

    expect(useLibraryStore.getState().libraryFolders).toHaveLength(1)
    expect(useLibraryStore.getState().promptFolders).toHaveLength(1)
    expect(useLibraryStore.getState().items).toHaveLength(1)
  })
})
