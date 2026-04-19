# Authentication & Security

Сигурността в BrainBox се базира на Supabase Auth и строги Row Level Security (RLS) политики.

## Auth Model

- **Provider:** Supabase Auth (Email/Password + OAuth).
- **Session:** Управлява се чрез HTTP-Only бисквитки (`sb-auth-token`), които са защитени от XSS атаки.
- **Middleware/Proxy:** Всички заявки към сървъра се проверяват в `lib/supabase/server.ts` чрез `supabase.auth.getUser()`.

## Extension Auth Bridge

Тъй като разширението работи на различен домейн (`chrome-extension://`), то няма директен достъп до бисквитките на Web App.

- **Handshake:** Когато потребителят отвори Dashboard, специална страница (`/extension-auth`) изпраща JWT токена към разширението чрез `window.postMessage`.
- **LocalStorage:** Разширението съхранява токена криптирано в `chrome.storage.local`.

## Security Rules

1. **Never use `getSession()`:** Данните от сесията трябва винаги да се верифицират чрез `getUser()`.
2. **RLS Mandatory:** Нито една таблица в базата няма публичен достъп. Всеки запис е обвързан с `user_id`.
3. **API Integrity:** Всички изходящи заявки от разширението се подписват с активния JWT токен.

## Last Updated

2026-04-16
