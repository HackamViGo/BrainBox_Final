# Auth API

**File:** `apps/web-app/actions/auth.ts`  
**Provider:** Supabase Auth  
**Type:** Next.js Server Actions

## Functions

### `signIn(email, password)`

Аутентифицира потребителя чрез имейл и парола.

- **Security:** Обработката на грешки става от Supabase, като се прехвърля чист текст към фронтенда при неуспех.

### `signOut()`

Прекратява текущата сесия.

- **Logic:** Извиква `supabase.auth.signOut()`, което изчиства Auth бисквитките (cookies).

### `getUser()`

Извлича данните за текущо логнатия потребител.

- **Critical Rule:** ВИНАГИ използвайте тази функция на сървъра вместо `getSession()`, за да сте сигурни, че данните са верифицирани от Supabase.

## Session Management

Сесиите се управляват автоматично от Supabase чрез HTTP-Only бисквитки. Бекендът (`lib/supabase/server.ts`) автоматично чете тези бисквитки при всяко извикване на Server Action.

## Last Updated

2026-04-16
