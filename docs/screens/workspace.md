# Workspace

**File:** `apps/web-app/screens/Workspace.tsx`  
**Route:** `activeScreen === 'workspace'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Работно пространство за детайлна обработка на документи и създаване на проекти, базирани на събраните фрагменти.

## UI Structure

- **Multi-panel layout:** Лява колона за ресурси и дясна колона за редактор.
- **Canvas area:** Място за структуриране на информация чрез влачене и пускане.

## State

| Variable     | Source          | Description                                      |
| ------------ | --------------- | ------------------------------------------------ |
| items        | useLibraryStore | Достъп до всички подготвени фрагменти и промпти. |
| activeScreen | useAppStore     | Контролира режима на работа.                     |

## User Flows

1. Потребителят отваря Workspace → Вижда чисто платно или активен проект.
2. Потребителят добавя фрагмент от библиотеката → Елементът се появява за редакия.

## Known Issues

- [ ] Функционалността е в ранен стадий на разработка.

## Placeholders

- [ ] Collaborative editing — планирано за версии Pro.

## Last Updated

2026-04-16
