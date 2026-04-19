# Library

**File:** `apps/web-app/screens/Library.tsx`  
**Route:** `activeScreen === 'library'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Достъп до организираната интелигентност — управление на папки и фрагменти (чатове), с вграден AI анализ чрез Gemini.

## UI Structure

- **Header:** Заглавие на активната папка с икона и навигация назад.
- **Search & Action Bar:** Търсене в архива и бутон "New Fragment".
- **Folder Grid:** Визуализация на папките в текущото ниво.
- **Chat Feed:** Списък с ChatCard компоненти.
- **Overlay:** Детайлен преглед на избрания фрагмент с AI анализ.

## State

| Variable       | Source          | Description                                    |
| -------------- | --------------- | ---------------------------------------------- |
| items          | useLibraryStore | Всички фрагменти, филтрирани по папка и тип.   |
| libraryFolders | useLibraryStore | Списък с папките от тип library.               |
| activeFolder   | useAppStore     | Идентификатор на текущо избраната папка.       |
| searchQuery    | Local State     | Текст за филтриране на резултатите.            |
| analysisResult | Local State     | Резултатът от AI анализа на избрания фрагмент. |

## User Flows

1. Потребителят отваря Library → Вижда съдържанието на коренната папка.
2. Потребителят кликва върху папка → Влиза в нея и вижда нейните подпапки и елементи.
3. Потребителят избира AI активност (Summarize/Analyze) върху ChatCard → Изпълнява се Gemini prompt и резултатът се показва в детайлния преглед.

## Known Issues

- [ ] Големи масиви от данни могат леко да забавят филтрирането на клиентско ниво.

## Placeholders

- [ ] Drag-and-drop организация между папки — в процес на имплементация.

## Last Updated

2026-04-16
