# Extension Integration

Браузър разширението е "сетвата" на BrainBox, която позволява безпроблемно взаимодействие с AI платформи.

## Design Philosophy (The "Ghost" Principle)

Разширението трябва да бъде невидимо и да не променя дизайна на ChatGPT или Gemini.

- **No Overlays:** Не се инжектират странични панели или бутони.
- **Context Only:** Всички действия се активират през десен бутон (Context Menu) или чрез иконата на разширението (Popup).

## Platform Adapters

За всяка поддържана платформа разширението има специфичен адаптер:

- **`ChatGPTAdapter`**: Парсва селектори като `.markdown` и селектирани съобщения.
- **`GeminiAdapter`**: Навигира през вложените компоненти на Google Gemini.

## API Bridge

Синхронизацията се извършва през защитен API маршрут в уеб-апа:
`POST /api/chats/extension`
Заявките съдържат `Bearer JWT`, извлечен при Auth Handshake.

## Capabilities

| Feature           | Implementation   | Status |
| ----------------- | ---------------- | ------ |
| Selection Capture | Context Menu     | Active |
| Chat Extraction   | Content Script   | Active |
| Text Injection    | DOM proto setter | Active |
| Real-time Sync    | Service Worker   | Active |

## Last Updated

2026-04-16
