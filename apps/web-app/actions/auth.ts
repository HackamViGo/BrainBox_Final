'use server'

import { createClient } from '@/lib/supabase/server'

export async function signIn(email: string, password: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getUser(): Promise<any> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
