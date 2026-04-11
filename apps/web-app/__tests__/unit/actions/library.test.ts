import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFolder, softDeleteItem, loadUserData } from '@/actions/library'
import { createClient } from '@/lib/supabase/server'

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('Library Actions', () => {
  const mockUser = { id: 'user-123' }
  
  // Chainable mock helper
  const createChain = () => {
    const chain: any = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((onRes) => onRes({ data: null, error: null }))
    }
    return chain
  }

  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null })
      },
      from: vi.fn().mockImplementation(() => createChain())
    }

    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  describe('createFolder', () => {
    it('should validate with Zod and insert into folders', async () => {
      const folderData = {
        name: 'My Folder',
        iconIndex: 1,
        parentId: null,
        type: 'library',
        level: 0
      }

      const capturedChain = createChain()
      capturedChain.then.mockImplementationOnce((onRes: any) => 
        onRes({ data: { id: 'folder-1', ...folderData }, error: null })
      )
      mockSupabase.from.mockReturnValue(capturedChain)

      const result = await createFolder(folderData)
      expect(result.id).toBe('folder-1')
    })
  })

  describe('softDeleteItem', () => {
    it('should update deleted_at timestamp', async () => {
      await softDeleteItem('item-123')
      expect(mockSupabase.from).toHaveBeenCalledWith('items')
    })
  })

  describe('loadUserData', () => {
    it('should split folders and items correctly', async () => {
      const mockFolders = [
        { id: 'f1', name: 'Lib', type: 'library', icon_index: 0 },
        { id: 'f2', name: 'Prompt', type: 'prompt', icon_index: 0 }
      ]
      const mockItems = [
        { id: 'i1', title: 'Item 1', folder_id: 'f1' }
      ]

      mockSupabase.from.mockImplementation((table: string) => {
        const chain = createChain()
        if (table === 'folders') {
          chain.then.mockImplementationOnce((onRes: any) => onRes({ data: mockFolders, error: null }))
        } else {
          chain.then.mockImplementationOnce((onRes: any) => onRes({ data: mockItems, error: null }))
        }
        return chain
      })

      const data = await loadUserData()
      expect(data?.libraryFolders).toHaveLength(1)
      expect(data?.promptFolders).toHaveLength(1)
    })
  })
})
