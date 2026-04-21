# Sync Bridge

**Files:** `src/background/index.ts`, Dashboard API `/api/chats/extension`

## The Bridge Mechanism

Синхронизационният "мост" е връзката, която позволява на браузър разширението да записва данни в "втория мозък" на потребителя сигурно и надеждно.

## Communication Flow

1. **Trigger:** Content скрипт или Background скрипт установява нова информация (напр. нов фрагмент).
2. **Auth Verification:** Извличане наBearer token от `chrome.storage.local`.
3. **HTTP Dispatch:** Изпращане на `POST` заявка към Dashboard API.
4. **Acknowledgement:** Уеб-апът връща `id` на новия запис или съобщение за успех.
5. **UI Update:** Разширението дава визуална сигнализация (напр. иконата светва в синьо) за успешния запис.

## Failure Handling

- **Retry Logic:** Ако мрежата е нестабилна, разширението съхранява фрагмента временно локално.
- **Unauthorized:** Ако токенът е изтекъл, потребителят се подканва да отвори Dashboard, за да поднови сесията си (Auth Handshake).

## Last Updated

2026-04-16
