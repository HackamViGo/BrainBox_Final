# Web App Agent Rules

**Location:** apps/web-app/AGENTS.md

## Identity

Module: Next.js 16.2 App Router
Role: Command center — displays, organizes, enriches data.
Receives data from Extension via API. Stores in Supabase.

## Layer Rules (логика тече само надолу)

```
components/ → (reads from) → store/ → (calls) → actions/ → (uses) → Supabase
```

- Components: render + event handling ONLY
- Stores: UI state ONLY (no Supabase calls)
- Actions: ALL mutations (Server Actions with Zod validation)
- API routes: Extension sync, AI enrichment

## Critical Patterns

### Server Action template

```typescript
'use server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const InputSchema = z.object({ ... })

export async function myAction(input: z.infer<typeof InputSchema>): Promise<SpecificType> {
  const { user, error } = await auth.getUser() // NEVER getSession()
  if (error || !user) throw new Error('Unauthorized')

  const validated = InputSchema.parse(input)
  const supabase = createServerClient()
  // ... operation
}
```

### Zustand store template

```typescript
// skipHydration: true on ALL persisted stores
// partialize: exclude transient UI state from persistence
export const useMyStore = create<MyStore>()(
  persist((set, get) => ({ ... }), {
    name: 'brainbox-my-store',
    skipHydration: true,
    partialize: (state) => ({ persistedField: state.persistedField }),
  })
)
```

## SSR Rules

- `NeuralField`, `MindGraph`, `Workspace`: dynamic(ssr: false) MANDATORY
- `<body suppressHydrationWarning>`: required (browser extension attrs)
- Zustand: `useHasHydrated()` hook before reading persisted state

## Extension Integration

- `/api/chats/extension/route.ts`: 30 RPM rate limit (server-side)
- `/extension-auth/page.tsx`: `getUser()` only, postMessage to extension
- `useExtensionStore`: tracks connection status + pending captures

```

```
