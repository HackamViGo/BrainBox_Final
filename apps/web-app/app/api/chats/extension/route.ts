import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ItemSchema } from '@brainbox/types';
import { logger } from '@brainbox/utils';

import { isRateLimited } from '@/lib/rate-limit';

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 1000;

/**
 * Extension Sync API (ADR-012)
 * Receives captured chats from the Chrome Extension with isolated platform tracking.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 30 req/min per user
    if (isRateLimited(user.id)) {
      logger.warn('API:extension:sync', 'Rate limit exceeded', { userId: user.id })
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate incoming data (Chat objects from extension)
    const result = ItemSchema.safeParse({
      ...body,
      type: 'chat',
    });

    if (!result.success) {
      logger.warn('API:extension:sync', 'Validation failed', result.error.flatten());
      return NextResponse.json({ error: 'Validation failed', details: result.error.flatten() }, { status: 400 });
    }

    const { data: validatedData } = result;

    // Save to Supabase (map camelCase to snake_case)
    const { data, error } = await supabase
      .from('items')
      .upsert({
        id: validatedData.id,
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        folder_id: validatedData.folderId,
        content: validatedData.content,
        theme: validatedData.theme || validatedData.platform, // Fallback to platform if theme missing
        tags: validatedData.tags,
        is_frozen: validatedData.isFrozen,
        deleted_at: validatedData.deletedAt,
        // Extension Specific Fields
        source_id: validatedData.sourceId,
        platform: validatedData.platform,
        url: validatedData.url,
        messages: validatedData.messages
      }, {
        onConflict: 'user_id, source_id, platform'
      })
      .select()
      .single();

    if (error) {
      logger.error('API:extension:sync', 'Database upsert failed', error);
      throw error;
    }

    return NextResponse.json({ success: true, item: data });

  } catch (error: any) {
    logger.error('API:extension:sync', 'Sync failed', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: error.status || 500 }
    );
  }
}
