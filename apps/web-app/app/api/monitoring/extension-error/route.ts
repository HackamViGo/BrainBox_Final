import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@brainbox/utils'
import { z } from 'zod'

const extensionErrorSchema = z.object({
  platform: z.string().optional(),
  message: z.string(),
  stack: z.string().optional(),
  url: z.string().optional(),
  version: z.string().optional(),
  context: z.record(z.unknown()).optional()
})

/**
 * Extension Error Monitoring API
 * Passive observation of failures in the extension adapters.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // We allow logging even for unauthenticated users if the extension is failing at login,
    // but we tag it appropriately.
    const body = await request.json()
    const result = extensionErrorSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid error report' }, { status: 400 })
    }

    const { platform, message, stack, url, version, context } = result.data

    logger.error('EXT_MONITOR', `Extension Error [${platform || 'unknown'}]: ${message}`, {
      userId: user?.id || 'anonymous',
      platform,
      stack,
      url,
      version,
      context
    })

    // In a real Sentry setup, we would capture the exception here
    // captureException(new Error(message), { extra: { ...context, platform, userId: user?.id } })

    return NextResponse.json({ success: true })

  } catch (error) {
    // Avoid circular logging if logger fails
    console.error('[CRITICAL_EXT_MONITOR_FAILURE]', error)
    return NextResponse.json({ error: 'Internal failure' }, { status: 500 })
  }
}
