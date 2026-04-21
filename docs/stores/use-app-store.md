# useAppStore

**File:** `apps/web-app/store/useAppStore.ts`  
**Middleware:** `persist`  
**Responsibility:** Глобално състояние на интерфейса, теми, навигация и аутентикация.

## State Properties

| Property          | Type       | Persisted? | Description                       |
| ----------------- | ---------- | ---------- | --------------------------------- |
| activeScreen      | ScreenName | No         | Текущо видимият екран.            |
| theme             | ThemeName  | Yes        | Постоянната визуална тема.        |
| hoverTheme        | ThemeName  | No         | Временна тема при ховър на модел. |
| isLoggedIn        | boolean    | Yes        | Статус на сесията.                |
| isSidebarExpanded | boolean    | Yes        | Дали менюто е отворено.           |
| apiKeys           | Record     | Yes        | API ключове за моделите.          |
| \_hasHydrated     | boolean    | No         | Флаг за SSR безопасност.          |

## Core Actions

- **setActiveScreen(screen):** Сменя екрана и автоматично превключва режима на Sidebar (`switchMode`).
- **setTheme(theme):** Записва новата тема за постоянно.
- **setModalOpen(modal, open, data):** Универсален метод за управление на модални прозорци.
- **setApiKey(modelId, key):** Записва API ключ за конкретен AI модел.

## Persistence Policy

- **Storage:** `localStorage`.
- **Skip Hydration:** `true` (Предотвратява грешки при Server-Side Rendering).
- **Partialize:** Записват се само критични настройки като `theme`, `apiKeys` и `isPinned`.

## Last Updated

2026-04-16
