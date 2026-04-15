/**
 * Central Rate Limiter Utility
 * Used to protect API endpoints from abuse.
 * Default: 30 requests per minute per user.
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const DEFAULT_LIMIT = 30
const DEFAULT_WINDOW_MS = 60 * 1000

/**
 * Checks if a user has exceeded their rate limit.
 * @param userId Unique identifier for the user (e.g. Supabase user ID)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if the user IS rate limited, false otherwise
 */
export function isRateLimited(
  userId: string, 
  limit: number = DEFAULT_LIMIT, 
  windowMs: number = DEFAULT_WINDOW_MS
): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  // Reset if window expired or no entry exists
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs })
    return false
  }

  // Already at/above limit?
  if (entry.count >= limit) {
    return true
  }

  // Increment within window
  entry.count++
  return false
}
