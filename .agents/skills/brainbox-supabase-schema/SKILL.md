---
name: brainbox-supabase-schema
description: >
  Пълна Supabase интеграция за BrainBox — database schema, RLS политики, Auth setup,
  Server Actions за CRUD операции, и миграция от localStorage към Supabase.
  Използвай при: настройка на Supabase проект, писане на Server Actions за folders/items,
  замяна на localStorage persistence, имплементация на auth с @supabase/ssr,
  или работа с Supabase client в Next.js 16.2 контекст.
  Задължително прочети преди да пишеш какъвто и да е Supabase код за BrainBox.
---

# BrainBox — Supabase Integration

## Правила (верифицирани от @supabase/ssr документация)

1. **Middleware е задължителен** за token refresh — без него сесията изтича тихо
2. **`getUser()`** — винаги, НЕ `getSession()` (getSession е unverified cookie data)
3. **`createBrowserClient`** — за `'use client'` компоненти
4. **`createServerClient`** — за Server Components, Server Actions, middleware
5. **`@supabase/ssr`** — единственият правилен пакет. НЕ `@supabase/auth-helpers-nextjs`

---

## Database Schema

```sql
-- Изпълни в Supabase SQL Editor

-- FOLDERS
create table public.folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null check (char_length(name) between 1 and 100),
  icon_index  integer not null default 0 check (icon_index between 0 and 76),
  parent_id   uuid references public.folders(id) on delete cascade,
  type        text not null check (type in ('library', 'prompt')),
  level       integer not null default 0 check (level between 0 and 5),
  created_at  timestamptz default now() not null
);

-- ITEMS (chats + prompts)
create table public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  type        text not null check (type in ('chat', 'prompt')),
  folder_id   uuid references public.folders(id) on delete set null,
  content     text not null default '',
  theme       text check (theme in (
                'chatgpt','gemini','claude','grok',
                'perplexity','lmarena','deepseek','qwen'
              )),
  tags        text[] default '{}',
  is_frozen   boolean not null default false,
  deleted_at  timestamptz,              -- null = active, set = Echo (soft delete)
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_items_updated
  before update on public.items
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.folders enable row level security;
alter table public.items   enable row level security;

create policy "Users manage own folders" on public.folders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own items" on public.items
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes за performance
create index on public.folders (user_id, type);
create index on public.folders (parent_id);
create index on public.items   (user_id, type);
create index on public.items   (folder_id);
create index on public.items   (deleted_at) where deleted_at is not null;
```

---

## Supabase Clients

```typescript
// apps/web-app/lib/supabase/client.ts
'use client'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// apps/web-app/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // Server Components четат само — setAll не е нужно тук
      },
    }
  )
}
```

```typescript
// apps/web-app/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session (не redirect — BrainBox ползва overlay login)
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

---

## Server Actions — CRUD

```typescript
// apps/web-app/actions/library.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { FolderSchema, ItemSchema } from '@brainbox/types'
import { revalidatePath } from 'next/cache'

// ---- FOLDERS ----

export async function createFolder(data: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = FolderSchema.omit({ id: true }).parse(data)
  const { data: folder, error } = await supabase
    .from('folders')
    .insert({ ...validated, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return folder
}

export async function deleteFolder(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Каскадното изтриване се handle-ва от DB (on delete cascade)
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

// ---- ITEMS ----

export async function upsertItem(data: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = ItemSchema.parse(data)
  const { data: item, error } = await supabase
    .from('items')
    .upsert({ ...validated, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return item
}

export async function softDeleteItem(id: string) {
  // Echo: soft delete — появява се в Archive
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('items')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

export async function freezeItem(id: string) {
  // Artifact: freeze
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('items')
    .update({ is_frozen: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

// ---- LOAD ALL (initial hydration) ----
export async function loadUserData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: folders }, { data: items }] = await Promise.all([
    supabase.from('folders').select('*').eq('user_id', user.id),
    supabase.from('items').select('*').eq('user_id', user.id),
  ])

  return {
    libraryFolders: (folders ?? []).filter(f => f.type === 'library'),
    promptFolders: (folders ?? []).filter(f => f.type === 'prompt'),
    items: items ?? [],
  }
}
```

---

## Auth Actions

```typescript
// apps/web-app/actions/auth.ts
'use server'
import { createClient } from '@/lib/supabase/server'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

---

## Zustand + Supabase интеграция

```typescript
// store/useLibraryStore.ts
'use client' — НЕ е нужно тук, но store-ът се ползва само в client components

import { create } from 'zustand'
import type { Folder, Item } from '@brainbox/types'
import {
  createFolder, deleteFolder,
  upsertItem, softDeleteItem, freezeItem,
  loadUserData
} from '@/actions/library'

interface LibraryStore {
  libraryFolders: Folder[]
  promptFolders: Folder[]
  items: Item[]
  isLoading: boolean
  // Actions
  loadData: () => Promise<void>
  addFolder: (data: Omit<Folder, 'id'>) => Promise<void>
  removeFolder: (id: string) => Promise<void>
  saveItem: (item: Item) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  freezeItem: (id: string) => Promise<void>
}

export const useLibraryStore = create<LibraryStore>()((set, get) => ({
  libraryFolders: [],
  promptFolders: [],
  items: [],
  isLoading: false,

  loadData: async () => {
    set({ isLoading: true })
    const data = await loadUserData()
    if (data) {
      set({
        libraryFolders: data.libraryFolders,
        promptFolders: data.promptFolders,
        items: data.items,
      })
    }
    set({ isLoading: false })
  },

  addFolder: async (data) => {
    // Optimistic update
    const tempId = crypto.randomUUID()
    const folder = { ...data, id: tempId } as Folder
    const key = data.type === 'library' ? 'libraryFolders' : 'promptFolders'
    set(state => ({ [key]: [...state[key], folder] }))

    try {
      const saved = await createFolder(data)
      // Replace temp with real
      set(state => ({
        [key]: state[key].map(f => f.id === tempId ? saved : f)
      }))
    } catch {
      // Rollback
      set(state => ({ [key]: state[key].filter(f => f.id !== tempId) }))
    }
  },

  removeFolder: async (id) => {
    // Find which array
    const isLibrary = get().libraryFolders.some(f => f.id === id)
    const key = isLibrary ? 'libraryFolders' : 'promptFolders'
    const backup = get()[key]

    set(state => ({ [key]: state[key].filter(f => f.id !== id) }))
    try {
      await deleteFolder(id)
    } catch {
      set({ [key]: backup })
    }
  },

  saveItem: async (item) => {
    set(state => ({
      items: state.items.some(i => i.id === item.id)
        ? state.items.map(i => i.id === item.id ? item : i)
        : [...state.items, item]
    }))
    await upsertItem(item)
  },

  deleteItem: async (id) => {
    set(state => ({
      items: state.items.map(i =>
        i.id === id ? { ...i, deletedAt: new Date().toISOString() } : i
      )
    }))
    await softDeleteItem(id)
  },

  freezeItem: async (id) => {
    set(state => ({
      items: state.items.map(i => i.id === id ? { ...i, isFrozen: true } : i)
    }))
    await freezeItem(id)
  },
}))
```

---

## Initial Data Load (заменя localStorage seed)

```tsx
// app/providers.tsx
'use client'
import { useEffect } from 'react'
import { useLibraryStore } from '@/store/useLibraryStore'
import { useAppStore } from '@/store/useAppStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const loadData = useLibraryStore(s => s.loadData)
  const isLoggedIn = useAppStore(s => s.isLoggedIn)

  useEffect(() => {
    useAppStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (isLoggedIn) loadData()
  }, [isLoggedIn, loadData])

  return <>{children}</>
}
```

---

## Migration от localStorage → Supabase

```typescript
// apps/web-app/scripts/migrate-localstorage.ts
// Еднократна миграция на съществуващи данни

'use server'
export async function migrateFromLocalStorage(localData: {
  libraryFolders: Folder[]
  promptFolders: Folder[]
  items: Item[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in')

  // Insert folders (без id — Supabase генерира нов uuid)
  const allFolders = [...localData.libraryFolders, ...localData.promptFolders]
  const { error: fErr } = await supabase
    .from('folders')
    .insert(allFolders.map(({ id, ...rest }) => ({ ...rest, user_id: user.id })))

  // Insert items
  const { error: iErr } = await supabase
    .from('items')
    .insert(localData.items.map(({ id, ...rest }) => ({ ...rest, user_id: user.id })))

  if (fErr || iErr) throw new Error('Migration failed')
}
```

---

## Environment Variables

```bash
# apps/web-app/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Server-only (не NEXT_PUBLIC_ — не се излагат в клиента)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # само за admin операции
GEMINI_API_KEY=AIza...                  # за Server Actions
```
