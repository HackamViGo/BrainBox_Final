import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { ItemSchema } from '@brainbox/types';

/**
 * Extension Sync API
 * Receives captured chats from the Chrome Extension.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate incoming data
    const validatedData = ItemSchema.parse({
      ...body,
      type: 'chat',
      folderId: body.folderId || null,
    });

    // Save to Supabase (map camelCase to snake_case)
    const { data, error } = await supabase
      .from('items')
      .insert({
        id: validatedData.id,
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        folder_id: validatedData.folderId,
        content: validatedData.content,
        theme: validatedData.theme,
        tags: validatedData.tags,
        is_frozen: validatedData.isFrozen,
        deleted_at: validatedData.deletedAt,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, item: data });

  } catch (error: any) {
    console.error('[API_EXTENSION_SYNC]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: error.status || 500 }
    );
  }
}
