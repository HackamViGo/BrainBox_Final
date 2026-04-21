# Database Schema

BrainBox използва PostgreSQL, хостван в Supabase, с релационен модел за папки и фрагменти.

## Schema Overview

### 1. `folders` Table

Съхранява йерархичната структура на знанието.

- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `name` (text)
- `icon_index` (int) - Референция към ICON_LIBRARY
- `parent_id` (uuid, self-reference) - Поддържа неограничена вложеност
- `type` (text) - 'library' или 'prompt'
- `level` (int)

### 2. `items` Table

Основните информационни единици (фрагменти, чатове, уловени данни).

- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `folder_id` (uuid, FK to folders)
- `title` (text)
- `description` (text)
- `content` (text) - Пълно съдържание или JSON за разговори
- `tags` (text[])
- `type` (text) - 'chat', 'prompt', 'capture'
- `is_frozen` (boolean)
- `deleted_at` (timestamp) - За soft delete функционалност

### 3. `profiles` Table

Разширена информация за потребителите.

- `id` (uuid, PK, references auth.users)
- `display_name` (text)
- `avatar_url` (text)

## Constraints & Indexes

- **RLS:** Всички таблици имат активиран Row Level Security.
- **Indexes:** Индекси по `user_id` и `deleted_at` за бързо филтриране.

## Last Updated

2026-04-16
