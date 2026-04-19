# Library API

**File:** `apps/web-app/actions/library.ts`  
**Type:** Next.js Server Actions  
**Auth:** Requires valid Supabase user session.

## Functions

### `loadUserData()`

Изтегля всички данни за активния потребител.

- **Returns:** `{ libraryFolders: Folder[], promptFolders: Folder[], items: Item[] }`
- **Logic:** Едновременно извикване (Promise.all) на `folders` и `items` таблиците. Трансформира snake_case от DB към camelCase за JS.

### `createFolder(data)`

Създава нова папка.

- **Args:** `Omit<Folder, 'id'>`
- **Validation:** Използва `FolderSchema` от `@brainbox/types`.
- **Database:** Insert в `folders` таблицата.

### `upsertItem(data)`

Създава или обновява фрагмент/чат.

- **Args:** `Item` или `Omit<Item, 'id'>`
- **Validation:** `ItemSchema`.
- **Logic:** Използва `upsert` по `id`. Ако `id` присъства, обновява; ако не — създава.

### `softDeleteItem(id)`

Премества елемент в архив.

- **Logic:** Обновява `deleted_at` полето с текущото време. Елементът спира да се появява в Library, но остава в Archive.

### `freezeItem(id)`

Замразява елемент за четене само.

- **Logic:** Задава `is_frozen: true`.

## Data Transformation

API слоят служи като мост между PostgreSQL (snake_case) и React (camelCase). Винаги проверявайте съответствието на полетата в `transformFolder` и `transformItem` функциите при промяна на базата.

## Last Updated

2026-04-16
