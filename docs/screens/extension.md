# Extension

**File:** `apps/web-app/screens/Extension.tsx`  
**Route:** `activeScreen === 'extension'`  
**NeuralField mode:** extension  
**Store dependencies:** useAppStore

## Purpose

Информационен център за браузър разширението — инструкции за инсталация, статус на синхронизация и контроли.

## UI Structure

- **Connection Status:** Визуална обратна връзка дали разширението е свързано.
- **Tutorial Steps:** Анимирани карти с инструкции как да използваме BrainBox директно в ChatGPT/Gemini сайтовете.

## State

| Variable     | Source      | Description                                                                       |
| ------------ | ----------- | --------------------------------------------------------------------------------- |
| activeScreen | useAppStore | Контролира кога е лесно за потребителя да се върне в Dashboard чрез скрол нагоре. |

## User Flows

1. Потребителят отваря Extension → Получава насоки как да "улавя" знания от интернет.
2. Потребителят скролва нагоре → Преминава обратно в `dashboard`.

## Known Issues

- [ ] Нужда от директно изтегляне на .crx файла от интерфейса.

## Placeholders

- [ ] Active Sync Log — списък в реално време с последно уловените фрагменти.

## Last Updated

2026-04-16
