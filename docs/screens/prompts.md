# Prompts

**File:** `apps/web-app/screens/Prompts.tsx`  
**Route:** `activeScreen === 'prompts'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Централизиран хъб за prompt инженерство — управление на шаблони, рефиниране на инструкции и събиране на фрагменти.

## UI Structure

Компонентът използва `AnimatePresence` за превключване между няколко изгледа (SubViews):

- **HubView:** Начална точка със статистика.
- **FrameworksView:** Библиотека с готови prompt структури.
- **RefineView:** Интерактивен Gemini интерфейс за подобряване на промпти.
- **CapturesView:** Списък с уловени текстове за преработка.
- **SavedPromptsView:** Организиран архив от готови за ползване промпти.

## State

| Variable      | Source          | Description                                        |
| ------------- | --------------- | -------------------------------------------------- |
| currentView   | Local State     | Управлява кой SubView се изобразява.               |
| items         | useLibraryStore | Филтрирани елементи от тип `prompt` или `capture`. |
| promptFolders | useLibraryStore | Папки, предназначени за съхранение на промпти.     |
| theme         | useAppStore     | Текуща визуална тема за поддържане на контекст.    |

## User Flows

1. Потребителят отваря Prompts → Попада в HubView.
2. Потребителят избира "Refine" → Преминава в RefineView, където Gemini му помага да структурира по-добре своята заявка.
3. Потребителят влачи текст в CapturesView → Текстът се запазва като `capture` фрагмент.

## Known Issues

- [ ] Преходите между изгледите се нуждаят от фина настройка при ниска производителност.

## Placeholders

- [ ] "Prompts Marketplace" — планирана интеграция за споделяне на шаблони.

## Last Updated

2026-04-16
