# useLibraryStore

**File:** `apps/web-app/store/useLibraryStore.ts`  
**Middleware:** `persist`  
**Responsibility:** Управление на потребителските данни (папки и фрагменти) със синхронизация към Supabase.

## State Properties

| Property       | Type     | Persisted? | Description                               |
| -------------- | -------- | ---------- | ----------------------------------------- |
| libraryFolders | Folder[] | No         | Списък с бизнес папките.                  |
| promptFolders  | Folder[] | No         | Списък с папките за промпти.              |
| items          | Item[]   | No         | Всички фрагменти, чатове и уловени данни. |
| isLoading      | boolean  | No         | Индикатор за зареждане от облака.         |

## Core Actions

- **loadData():** Извиква Server Action за изтегляне на всички данни от Supabase при старт.
- **createFolder/createItem:** Използва **Optimistic Updates** — добавя елемента веднага в локалния стейт и го синхронизира с базата в бекграунд.
- **deleteItem(id):** Изпълнява **Soft Delete** (маркира като изтрит с `deletedAt`), което премества елемента в Archive.

## Sync Logic

При всяка промяна store-ът вика съответния Server Action от `actions/library.ts`. При грешка в синхронизацията се прави автоматичен rollback на локалното състояние (Undo).

## Persistence Policy

- **Storage:** `localStorage`.
- **Skip Hydration:** `true`.
- **Partialize:** **Празен обекте (`{}`)**. Данните от библиотеката НЕ се пазят локално за постоянно, а се зареждат винаги от Supabase за максимална сигурност и актуалност.

## Last Updated

2026-04-16
