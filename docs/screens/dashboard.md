# Dashboard

**File:** `apps/web-app/screens/Dashboard.tsx`  
**Route:** `activeScreen === 'dashboard'`  
**NeuralField mode:** brain  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Посреща потребителя с вдъхновяващо послание и дава достъп до основния интерфейс на "втория мозък".

## UI Structure

- **Централна секция:** Заглавие с градиент и подзаглавие.
- **Индикатор:** "Neural Interface Online" статус.
- **Интерактивност:** Wheel/Touch детектор за превключване към Extension екрана (scroll down/swipe up).
- **Подсказка:** Анимирана стрелка за достъп до Extension секцията.

## State

| Variable        | Source          | Description                                            |
| --------------- | --------------- | ------------------------------------------------------ |
| setActiveScreen | useAppStore     | Сменя активния екран при скрол или клик.               |
| libraryFolders  | useLibraryStore | Информация за папките (за бъдещо ползване в дашборда). |
| promptFolders   | useLibraryStore | Информация за папките с промпти.                       |
| items           | useLibraryStore | Списък с всички фрагменти/чатове.                      |
| showHint        | Local State     | Управлява видимостта на подсказката за скрол.          |

## User Flows

1. Потребителят отваря Dashboard → Вижда анимирано заглавие и NeuralField в режим `brain`.
2. Потребителят скролва надолу или суайпва нагоре → Системата го прехвърля към `extension` екрана.
3. Потребителят кликва върху иконата за подсказка → Навигация към `extension`.

## Known Issues

- [ ] Оптимизация на TouchEnd събитието за по-гладък преход при мобилни устройства.

## Placeholders

- [ ] Секция "Recent Items" — планирана за следващи версии за по-бърз достъп.

## Last Updated

2026-04-18
