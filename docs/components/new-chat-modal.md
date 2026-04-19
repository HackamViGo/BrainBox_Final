# New Chat Modal

**File:** `apps/web-app/components/NewChatModal.tsx`  
**Type:** Form Modal Component  
**Store dependencies:** useAppStore, useLibraryStore

## Description

Интерфейс за ръчно добавяне на нови фрагменти/чатове в библиотеката. Позволява дефиниране на заглавие, URL, източник и описание.

## Form Fields

- **Title (Required):** Кратко и ясно име на фрагмента.
- **Chat URL (Optional):** Линк към оригиналния източник (OpenAI, Gemini и т.н.).
- **Source Platform:** Дропдаун за избор на икона и тема (ChatGPT, Gemini, Claude, Perplexity).
- **Description:** Резюме на съдържанието.

## Integration

- Използва `createItem` от `useLibraryStore` за запис в базата.
- Автоматично асоциира новия елемент с `activeFolder` от `useAppStore`.
- Контролира своята видимост чрез глобалния `isNewChatModalOpen` флаг.

## Last Updated

2026-04-16
