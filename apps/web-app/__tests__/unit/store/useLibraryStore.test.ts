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

  it('should implement optimistic createFolder and update with server result', async () => {
    const mockCreatedFolder = { 
      id: 'real-id', 
      name: 'New Folder', 
      type: 'library',
      iconIndex: 0,
      parentId: null,
      level: 0
    }
    vi.mocked(actions.createFolder).mockResolvedValue(mockCreatedFolder as unknown as import('@brainbox/types').Folder)

    const promise = useLibraryStore.getState().createFolder({ 
      name: 'New Folder', 
      type: 'library', 
      iconIndex: 0, 
      parentId: null, 
      level: 0 
    })
    
    // Check optimistic state
    expect(useLibraryStore.getState().libraryFolders).toHaveLength(1)
    expect(useLibraryStore.getState().libraryFolders[0]!.id).toBeDefined()

    await promise

    // Check final state
    expect(useLibraryStore.getState().libraryFolders[0]!.id).toBe('real-id')
  })

  it('should rollback createFolder on server error', async () => {
    vi.mocked(actions.createFolder).mockRejectedValue(new Error('Server error'))

    try {
      await useLibraryStore.getState().createFolder({ 
        name: 'New Folder', 
        type: 'library', 
        iconIndex: 0, 
        parentId: null, 
        level: 0 
      })
    } catch {
      // expected
    }

    expect(useLibraryStore.getState().libraryFolders).toHaveLength(0)
  })

  it('should soft delete item optimistically', async () => {
    const originalItem = { 
      id: '00000000-0000-0000-0000-000000000001', 
      title: 'Test', 
      description: 'Desc',
      type: 'chat', 
      folderId: null, 
      content: '' 
    }
    useLibraryStore.setState({ items: [originalItem as unknown as import('@brainbox/types').Item] })

    const promise = useLibraryStore.getState().deleteItem(originalItem.id)
    
    expect(useLibraryStore.getState().items[0]!.deletedAt).toBeDefined()

    await promise
    expect(actions.softDeleteItem).toHaveBeenCalledWith(originalItem.id)
  })

  it('should load and split data correctly and filter corrupt items', async () => {
    const validItemId = '00000000-0000-0000-0000-000000000001'
    const mockData = {
      libraryFolders: [
        { 
          id: '00000000-0000-0000-0000-000000000002', 
          name: 'L1', 
          type: 'library', 
          iconIndex: 0, 
          parentId: null, 
          level: 0 
        }
      ],
      promptFolders: [
        { 
          id: '00000000-0000-0000-0000-000000000003', 
          name: 'P1', 
          type: 'prompt', 
          iconIndex: 0, 
          parentId: null, 
          level: 0 
        }
      ],
      items: [
        { 
          id: validItemId, 
          title: 'Valid Item', 
          description: 'Valid Desc',
          type: 'chat', 
          folderId: null
        },
        { 
          id: 'invalid-id-not-uuid', 
          title: 'Invalid Item' 
          // missing description and type
        }
      ]
    }
    vi.mocked(actions.loadUserData).mockResolvedValue(mockData as unknown as { libraryFolders: import('@brainbox/types').Folder[], promptFolders: import('@brainbox/types').Folder[], items: import('@brainbox/types').Item[] })

    await useLibraryStore.getState().loadData()

    expect(useLibraryStore.getState().libraryFolders).toHaveLength(1)
    expect(useLibraryStore.getState().promptFolders).toHaveLength(1)
    // Only the valid item should be kept
    expect(useLibraryStore.getState().items).toHaveLength(1)
    expect(useLibraryStore.getState().items[0]!.id).toBe(validItemId)
  })

  it('should create item optimistically and pass ID to server', async () => {
    const mockItem = { 
      title: 'New Chat', 
      description: 'Desc',
      type: 'chat' as const, 
      folderId: null 
    }
    vi.mocked(actions.upsertItem).mockImplementation(async (item) => item as unknown as import('@brainbox/types').Item)

    const promise = useLibraryStore.getState().createItem(mockItem as unknown as Parameters<ReturnType<typeof useLibraryStore.getState>['createItem']>[0])
    
    // Check optimistic state
    const items = useLibraryStore.getState().items
    expect(items).toHaveLength(1)
    const tempId = items[0]!.id
    expect(tempId).toBeDefined()
    expect(items[0]!.title).toBe('New Chat')

    await promise

    // Verify server action was called with the item INCLUDING the ID
    expect(actions.upsertItem).toHaveBeenCalledWith(expect.objectContaining({
      id: tempId,
      title: 'New Chat'
    }))
  })

  it('should throw and rollback createItem on server error', async () => {
    vi.mocked(actions.upsertItem).mockRejectedValue(new Error('Server error'))

    await expect(useLibraryStore.getState().createItem({ 
      title: 'New Chat', 
      description: 'Desc',
      type: 'chat', 
      folderId: null 
    } as unknown as Parameters<ReturnType<typeof useLibraryStore.getState>['createItem']>[0])).rejects.toThrow('Server error')

    expect(useLibraryStore.getState().items).toHaveLength(0)
  })
})
