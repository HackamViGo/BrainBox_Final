# State Management

## Съдържание
1. [Global State (App.tsx)](#1-global-state-apptsx)
2. [Local Storage & Persistence](#2-local-storage--persistence)
3. [API Integration](#3-api-integration)
4. [Context Providers (Future)](#4-context-providers-future)

---

## 1. Global State (App.tsx)
Приложението използва централизирано състояние в `App.tsx`:
- `activeScreen`: Текущ екран.
- `theme`: Визуална тема.
- `activeModelId`: Избран AI модел.
- `libraryFolders` / `promptFolders`: Йерархия на папките.
- `items`: Всички чатове и промпти.

---

## 2. Local Storage & Persistence
Данните се съхраняват в `localStorage` за офлайн достъп:
- `brainbox_is_logged_in`: Статус на сесията.
- `brainbox_library_folders_v3`: Йерархия на чат папките.
- `brainbox_prompt_folders_v3`: Йерархия на промпт папките.
- `brainbox_items_v3`: Масив от всички обекти (`Item`).
- `brainbox_retention_days`: Настройка за автоматично изтриване.
- `*_API_KEY`: Ключове за моделите (ChatGPT, Gemini и т.н.).

---

## 3. Data Structures
### Item
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'prompt';
  folderId: string | null;
  model: ThemeName;
  tags: string[];
  date: string;
  messages?: number;
  content: string;
  isFrozen?: boolean; // За Archive
  deletedAt?: string; // За Echoes
}
```

### Folder
```typescript
interface Folder {
  id: string;
  name: string;
  iconIndex: number;
  parentId: string | null;
  type: 'library' | 'prompt';
  level: number;
}
```

---

## 4. API Integration
- **Gemini Service**: `src/services/gemini.ts` управлява комуникацията с Google AI.
- **Refine Logic**: Използва `generateGeminiResponse` за оптимизация на промпти.
- **Chrome Pipeline**: Подготвено за приемане на данни от разширението чрез `Captures`.

---

## 4. Context Providers (Future)
Планирано е преминаване към React Context за:
- **ThemeContext**: Глобални цветови токени.
- **AuthContext**: Сигурно управление на API ключове.
- **LibraryContext**: Споделено състояние за папки и елементи.
