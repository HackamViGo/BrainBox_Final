# Core Rules: Testing

## Философия

**Arrange → Act → Assert**. Тествай поведение, а не детайли на имплементацията.

## Unit & Component Tests (Vitest)

- Файлове: `__tests__/**/*.test.ts(x)`.
- **Zustand Stores**: Тествай actions и трансформации на стейта.
- **Server Actions**: Използвай mocks за Supabase клиента.
- **UI Components**: Тествай интеракции и accessibility (RTL).
- **React 19.2**: Тествай `<Activity>` компоненти чрез симулация на `mode` промяна.

## E2E Tests (Playwright)

- Файлове: `e2e/**/*.spec.ts`.
- Фокус: Критични user flows (Login, Capture Chat, Sync).
- **Extension Testing**: Стартирай Playwright с лоуднат extension артефакт.

## Пътна карта на тестването

| Тип | Кога | Покритие |
| :--- | :--- | :--- |
| Logic / Utils | При създаване | 100% |
| Stores / Actions | При създаване | 90% |
| UI Components | Преди PR | 80% |
| User Flow (E2E) | Преди Release | 100% на критичните пътища |

## Правила

- Mock-вай всички външни API-та (Supabase, Chrome APIs, Gemini).
- Не използвай реална база данни в unit тестове.
- Тестовете не трябва да имат side effects.
