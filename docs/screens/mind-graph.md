# Mind Graph

**File:** `apps/web-app/screens/MindGraph.tsx`  
**Route:** `activeScreen === 'mindgraph'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Визуализация на връзките между различните фрагменти и знания в "втория мозък" чрез интерактивна мрежа.

## UI Structure

- **3D/2D Canvas:** Централна площ за графа.
- **Node details:** Страничен панел при избор на възел.

## State

| Variable       | Source          | Description                                          |
| -------------- | --------------- | ---------------------------------------------------- |
| items          | useLibraryStore | Зарежда всички елементи за визуализиране като възли. |
| libraryFolders | useLibraryStore | Групира възлите по папки.                            |

## User Flows

1. Потребителят отваря Mind Graph → Генерира се динамична мрежа от неговите знания.
2. Потребителят кликва върху възел → Отваря се бърз преглед на фрагмента.

## Known Issues

- [ ] Висока консумация на ресурси при графове с над 1000 елемента.

## Placeholders

- [ ] AI-suggested connections — автоматично свързване на сродни теми.

## Last Updated

2026-04-16
