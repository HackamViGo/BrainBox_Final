import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const chunkSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  url: z.string().url().optional(),
  type: z.enum(['code', 'text', 'quote']).default('text'),
  folderId: z.string().uuid().nullable().optional()
})

/**
 * Extension Chunks API
 * Receives snippets captured by the user from AI platforms.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = chunkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.flatten() }, { status: 400 })
    }

    // Chunks are stored in the 'items' table with type 'chat' or 'prompt'? 
    // Actually, BrainBox reference uses 'library' vs 'prompt' folders.
    // We'll store them as 'chat' items for now but tagged as snippets.
    const { data, error } = await supabase
      .from('items')
      .insert({
        user_id: user.id,
        title: result.data.title,
        content: result.data.content,
        type: 'chat', // default to chat for the library
        folder_id: result.data.folderId || null,
        url: result.data.url,
        tags: ['snippet', result.data.type],
        theme: 'gemini' // default brainbox theme
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, chunk: data })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}
