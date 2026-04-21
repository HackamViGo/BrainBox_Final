# AI Nexus

**File:** `apps/web-app/screens/AINexus.tsx`  
**Route:** `activeScreen === 'ainexus'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore, useLibraryStore

## Purpose

Мулти-моделен чат интерфейс, позволяващ работа с различни AI платформи в единна среда.

## UI Structure

- **Model Selector:** Горна лента за превключване между ChatGPT, Gemini, Claude и др.
- **Chat History:** Вертикален поток от съобщения с Markdown поддръжка.
- **Input Area:** Стъклен панел с контроли за изпращане, прикачване и избор на инструменти.
- **Sidebar Actions:** Бързи команди за резюмиране или промяна на стила.

## State

| Variable      | Source          | Description                                   |
| ------------- | --------------- | --------------------------------------------- |
| activeModelId | useAppStore     | Текущо избраният AI модел.                    |
| items         | useLibraryStore | Зарежда и запазва разговорите в реално време. |
| messages      | Local State     | Масив от съобщения в текущата сесия.          |
| isGenerating  | Local State     | Статус на изчакване при отговор от AI.        |

## User Flows

1. Потребителят избира модел от селектора → Темата на приложението се променя мигновено.
2. Потребителят изпраща съобщение → Системата извиква съответния API прокси.
3. Потребителят сменя модела по време на разговор → Предлага се "Smart Switch" за пренасяне на контекста.

## Known Issues

- [ ] Оптимизация на дълги чат сесии за избягване на лаг при скролване.

## Placeholders

- [ ] Мулти-модални съобщения (изображения/файлове) — в начален етап на разработка.

## Last Updated

2026-04-16
