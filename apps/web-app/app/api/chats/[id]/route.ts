import { NextResponse } from 'next/server';

/**
 * GET /api/chats/[id]
 * Demonstrates Next.js 16.2 Async Params pattern.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return NextResponse.json({ 
    id, 
    message: `Chat ${id} retrieved successfully` 
  });
}
