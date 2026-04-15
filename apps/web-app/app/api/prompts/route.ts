import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Extension Prompts API
 * Returns the user's saved prompts for injection into AI platforms.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch items of type 'prompt'
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'prompt')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, prompts: data })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}
