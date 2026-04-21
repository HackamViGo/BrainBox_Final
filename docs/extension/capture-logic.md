# Capture Logic

**Files:** `src/background/index.ts`, `src/content/adapters/`

## Methods of Capturing Knowledge

### 1. Context Menu (Manual Selection)

Позволява на потребителя да маркира текст в произволен сайт и да го изпрати към своята библиотека.

- **Workflow:** `Selection` -> `Right Click` -> `Save to BrainBox`.
- **Logic:** Background скриптът получава селектирания текст и URL, пакетира ги като "fragment" и ги изпраща към Dashboard.

### 2. Full Conversation Extraction (Platform Specific)

Автоматизирано извличане на целия чат лог от ChatGPT или Gemini.

- **Workflow:** Потребителят натиска бутон "Extract" (в popup-а) -> Content скриптът активира адаптера -> Адаптерът парсва всички мехурчета със съобщения.
- **Data Structure:** Масив от обекти с полета `role` (`user`/`assistant`) и `content`.

## Rules for Extraction

1. **Sanitization:** Премахване на излишни HTML тагове и форматиране.
2. **Metadata:** Автоматично добавяне на източника (platform id) и оригиналния URL.
3. **No Overhead:** Процесът трябва да бъде мигновен и да не прекъсва работата на изкуствения интелект на страницата.

## Last Updated

2026-04-16
