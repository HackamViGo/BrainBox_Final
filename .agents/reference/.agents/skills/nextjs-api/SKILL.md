---
name: nextjs-api
description: "Next.js 16.2 Async Patterns."
---

## Async Request APIs
```typescript
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = await cookieStore.get('token');
}
```

## Cache Life
`revalidateTag('tag', { cacheLife: 'minutes' })` - Second argument is mandatory.
