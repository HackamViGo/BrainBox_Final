# Archive

**File:** `apps/web-app/screens/Archive.tsx`  
**Route:** `activeScreen === 'archive'`  
**NeuralField mode:** wander (low speed, monochrome)  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Място за преглед на деактивирани или изтрити фрагменти преди окончателното им премахване.

## UI Structure

Сходна със секция Library, но със силно забавени анимации и черно-бяла цветова схема за подчертаване на статуса "архив".

## State

| Variable | Source          | Description                                          |
| -------- | --------------- | ---------------------------------------------------- |
| items    | useLibraryStore | Филтрира само елементи с попълнено поле `deletedAt`. |

## User Flows

1. Потребителят отваря Archive → Вижда списък с изтрити елементи.
2. Потребителят избира "Restore" → Елементът се връща в оригиналната си папка.

## Known Issues

- [ ] Все още няма функционалност за автоматично почистване на стари записи.

## Placeholders

- [ ] "Deep Storage Sync" — интеграция с външни облачни архиви.

## Last Updated

2026-04-16
