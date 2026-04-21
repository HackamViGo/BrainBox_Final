# Settings

**File:** `apps/web-app/screens/Settings.tsx`  
**Route:** `activeScreen === 'settings'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Персонализиране на приложението, управление на API ключове и системни настройки.

## UI Structure

- **Sidebar-like Tabs:** Избор между Profile, Security, General, Data.
- **Config Panels:** Интуитивни превключватели и полета за API ключове.
- **Folder Manager:** Високотехнологичен интерфейс за управление на дървовидната структура на папките.

## State

| Variable       | Source          | Description                                                 |
| -------------- | --------------- | ----------------------------------------------------------- |
| apiKeys        | useAppStore     | Управлява съхранението на ключовете за Gemini, OpenAI и др. |
| libraryFolders | useLibraryStore | Конфигуриране на имена и икони на папки.                    |
| theme          | useAppStore     | Глобалната тема на приложението.                            |

## User Flows

1. Потребителят отваря Settings → Може да смени глобалната тема.
2. Потребителят въвежда API ключ → Ключът се криптира и запазва в сигурно хранилище.

## Known Issues

- [ ] Нужда от по-детайлна валидация на промените преди запис.

## Placeholders

- [ ] Export to PDF/Markdown — настройки на форматите за експорт.

## Last Updated

2026-04-16
