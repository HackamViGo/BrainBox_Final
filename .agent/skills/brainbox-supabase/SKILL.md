---
name: brainbox-supabase
description: >
  Пълна Supabase интеграция за BrainBox — database schema, RLS политики, Auth setup,
  Server Actions за CRUD операции, и миграция от localStorage към Supabase.
  Използвай при: настройка на Supabase проект, писане на Server Actions за folders/items, Auth issues.
---

# BrainBox — Supabase Integration

## Core Principles

1. **Supabase changes frequently — verify against current docs before implementing.**
2. **Verify your work.** After implementing a fix, run a test query.
3. **Recover from errors, don't loop.**
4. **RLS by default in exposed schemas.**
5. **Never use `user_metadata` for authorization.** Store it in `app_metadata`.

## BrainBox Специфични Правила

1. **Middleware е задължителен** за token refresh.
2. **`getUser()`** се ползва навсякъде, НЕ `getSession()`.
3. **`createBrowserClient`** — за `'use client'` компоненти.
4. **`createServerClient`** — за Server Components, Server Actions, middleware.
5. **`@supabase/ssr`** е единственият пакет (НЕ auth-helpers-nextjs).

## Database Schema & RLS Pattern

```sql
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

-- RLS
alter table public.folders enable row level security;
alter table public.items   enable row level security;

create policy "Users manage own folders" on public.folders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own items" on public.items
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Type Generation:** Run `pnpm db:gen` to update `packages/database/src/types.ts`.

## Supabase Clients & Middleware

- **Browser:** `createBrowserClient(URL, KEY)`
- **Server:** `createServerClient` with `cookies()`.
- **Middleware:** Must manually refresh session via `getUser()` and forward cookies using `setAll`.

## Server Actions & Zustand Integration

BrainBox uses Optimistic Updates in Zustand and persists to Supabase via Server Actions (`createFolder`, `deleteFolder`, `upsertItem`, `softDeleteItem`, `freezeItem`, `loadUserData`).

```typescript
// Optimistic update in Zustand Store Example
addFolder: async (data) => {
  const tempId = crypto.randomUUID();
  // set optimistic state...
  try {
    const saved = await createFolder(data);
    // replace tempId with real...
  } catch {
    // rollback...
  }
};
```

## Migration от localStorage → Supabase

A one-time migration script `apps/web-app/scripts/migrate-localstorage.ts` logic maps local folders and items by inserting them without ID (so Supabase generates it), adding the `user_id`.

## Supabase CLI & MCP

Always discover commands via `supabase --help`.
Prefer MCP tools:

- `execute_sql` (for ad-hoc schema changes rather than `apply_migration` every time).
- `get_advisors` to check for security misconfigurations.
  Do NOT use `apply_migration` to iterate locally. Use `execute_sql`, then `supabase db pull <name> --local` to generate a final migration file.
