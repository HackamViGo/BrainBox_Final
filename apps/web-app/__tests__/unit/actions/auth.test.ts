import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signIn, signOut, getUser } from '@/actions/auth'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}))

describe('Auth Actions', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn()
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  describe('signIn', () => {
    it('should call signInWithPassword and succeed', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })
      
      await signIn('test@example.com', 'password123')
      
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('should throw error if Supabase returns error', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid credentials' } })
      
      await expect(signIn('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('getUser', () => {
    it('should return user object if authenticated', async () => {
      const mockUser = { id: 'user-1' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
      
      const user = await getUser()
      expect(user).toEqual(mockUser)
    })

    it('should return null if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
      
      const user = await getUser()
      expect(user).toBeNull()
    })
  })
})
