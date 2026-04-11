-- BRAINBOX SUPABASE SCHEMA
-- Last Updated: 2026-04-11

-- ENABLE EXTENSIONS
create extension if not exists "uuid-ossp";

-- FOLDERS
-- Stores both Library folders and Prompt folders (distinguished by 'type')
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
-- Stores the actual content. deleted_at is used for "Echo" (soft delete).
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

-- AUTO-UPDATE updated_at TRIGGER
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

-- ENABLE RLS
alter table public.folders enable row level security;
alter table public.items   enable row level security;

-- POLICIES
create policy "Users manage own folders" on public.folders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own items" on public.items
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- INDEXES
create index idx_folders_user_type on public.folders (user_id, type);
create index idx_folders_parent on public.folders (parent_id);
create index idx_items_user_type on public.items (user_id, type);
create index idx_items_folder on public.items (folder_id);
create index idx_items_deleted on public.items (deleted_at) where deleted_at is not null;
