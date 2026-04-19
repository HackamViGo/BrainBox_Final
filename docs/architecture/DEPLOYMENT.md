# Deployment & Maintenance

BrainBox разчита на автоматизирани работни процеси за осигуряване на стабилност при всеки деплой.

## CI/CD Pipeline (GitHub Actions)

Всички нови промени минават през строги проверки в `.github/workflows/`:

1. **`typecheck`**: Валидация на TypeScript типовете в целия монорепо.
2. **`lint`**: Проверка за съответствие със стиловите правила.
3. **`unit-tests`**: Изпълнение на Vitest тестове за Store-овете и логиката.
4. **`graph-check`**: Валидация на Dependency Graph (`GRAPH.json`).

## Production Environments

- **Frontend (Web-App):** Деплойнато в Vercel. Използват се Environment Variables за Supabase API ключове.
- **Database:** Supabase Cloud (PostgreSQL).
- **Extension:** Билдва се с `pnpm build:extension` и се пакетира като `.zip` за разпространение.

## Reliability Rules

- **Versioning:** Всички публични API-та са версия-заключени.
- **Migrations:** Промените в базата се правят единствено чрез Supabase миграции, никога ръчно в Dashboard.
- **Error Tracking:** Локално логване (`@brainbox/utils/logger.ts`) с фази и контекст.

## Local Development

```bash
pnpm install
pnpm dev
```

Девон симулацията стартира паралелно Web App на порт 3000 и билдър за разширението с Hot Reload.

## Last Updated

2026-04-16
