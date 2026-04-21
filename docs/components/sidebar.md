# Sidebar

**File:** `apps/web-app/components/Sidebar.tsx`  
**Type:** Stateful Navigation Component  
**Store dependencies:** useAppStore, useLibraryStore

## Description

Интелигентна навигационна лента, която поддържа няколко режима на работа и визуални състояния (Expanded, Rail, Mobile, Pinned). Тя е основният навигатор в BrainBox OS.

## Core Features

1. **Dynamic Rails:** Превключване между Global Menu, Folder Explorer, Model Selector и History (Pulse).
2. **Persistence:** Запомня състоянието си (pinned/expanded) чрез `useAppStore`.
3. **Internal NeuralField:** Притежава своя собствена NeuralField инстанция за визуално отделяне от основния фон.
4. **Drag-to-Switch:** Поддържа жестове (swipe/drag) за смяна на режимите (напр. от Глобално меню към Папки).
5. **Smart Folders:** Рекурсивно изобразяване на папки и техните елементи директно в менюто.

## Interaction Model

- **Hover:** Разширява се временно, за да покаже етикетите.
- **Pin:** Заключва се в разширено състояние.
- **Search:** Филтрира в реално време папките и фрагментите в активния режим.

## State Management

| Action            | Store           | Effect                                        |
| ----------------- | --------------- | --------------------------------------------- |
| setActiveScreen   | useAppStore     | Сменя активния екран на приложението.         |
| setModalOpen      | useAppStore     | Отваря модали за нови папки или чатове.       |
| updateItem/Folder | useLibraryStore | Синхронизира размествания чрез Custom Events. |

## Last Updated

2026-04-16
