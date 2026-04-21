'use server'

import { createClient } from '@/lib/supabase/server'
import { FolderSchema, ItemSchema, type Folder, type Item, type ThemeName } from '@brainbox/types'
import { revalidatePath } from 'next/cache'

/**
 * FOLDERS
 */

export async function createFolder(data: unknown): Promise<Folder> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = FolderSchema.omit({ id: true }).parse(data)
  
  const { data: folder, error } = await supabase
    .from('folders')
    .insert({
      user_id: user.id,
      name: validated.name,
      icon_index: validated.iconIndex,
      parent_id: validated.parentId,
      type: validated.type,
      level: validated.level,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  return {
    id: folder.id,
    name: folder.name,
    iconIndex: folder.icon_index,
    parentId: folder.parent_id,
    type: folder.type,
    level: folder.level,
  }
}

export async function deleteFolder(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

/**
 * ITEMS
 */

export async function upsertItem(data: unknown): Promise<Item> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = ItemSchema.parse(data)
  
  const { data: item, error } = await supabase
    .from('items')
    .upsert({
      id: validated.id,
      user_id: user.id,
      title: validated.title,
      description: validated.description,
      type: validated.type,
      folder_id: validated.folderId,
      content: validated.content || '',
      theme: validated.theme,
      tags: validated.tags || [],
      is_frozen: validated.isFrozen || false,
      deleted_at: validated.deletedAt,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type,
    folderId: item.folder_id,
    content: item.content,
    theme: item.theme,
    tags: item.tags,
    isFrozen: item.is_frozen,
    deletedAt: item.deleted_at,
  }
}

export async function softDeleteItem(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('items')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function freezeItem(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('items')
    .update({ is_frozen: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

/**
 * LOAD ALL DATA
 */

export async function loadUserData(): Promise<{ libraryFolders: Folder[], promptFolders: Folder[], items: Item[] } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: folders }, { data: items }] = await Promise.all([
    supabase.from('folders').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase.from('items').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
  ])

  // Transform snake_case back to camelCase for the frontend
  const transformFolder = (f: { id: string; name: string; icon_index: number; parent_id: string | null; type: 'library' | 'prompt'; level: number }): Folder => ({
    id: f.id,
    name: f.name,
    iconIndex: f.icon_index,
    parentId: f.parent_id,
    type: f.type,
    level: f.level,
  })

  const transformItem = (i: { id: string; title: string; description: string | null; type: 'chat' | 'prompt'; folder_id: string | null; content: string; theme: string; tags: string[]; is_frozen: boolean; deleted_at: string | null }): Item => ({
    id: i.id,
    title: i.title,
    description: i.description ?? '',
    type: i.type as 'chat' | 'prompt',
    folderId: i.folder_id,
    content: i.content,
    theme: i.theme as ThemeName,
    tags: i.tags,
    isFrozen: i.is_frozen,
    deletedAt: i.deleted_at,
  })

  const allFolders = folders || []
  const allItems = items || []

  return {
    libraryFolders: allFolders.filter(f => f.type === 'library').map(transformFolder),
    promptFolders: allFolders.filter(f => f.type === 'prompt').map(transformFolder),
    items: allItems.map(transformItem),
  }
}
