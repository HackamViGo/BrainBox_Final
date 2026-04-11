# BrainBox Web App

Основното уеб приложение на BrainBox, изградено с Next.js 16.2 и React 19.2.

## Setup

1. **Инсталиране на зависимости**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Създайте `.env.local` в `apps/web-app/` със следните променливи:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=вашият_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=вашият_supabase_anon_key
   GEMINI_API_KEY=вашият_gemini_api_key (server side)
   ```

3. **Стартиране на dev сървър**:
   ```bash
   pnpm dev
   ```

## Тестване

- **Unit Тестове (Vitest)**:
  ```bash
  pnpm test --run
  ```

- **E2E Тестове (Playwright)**:
  ```bash
  pnpm exec playwright test
  ```

## Структура на проекта

- `app/`: Next.js App Router (layouts, providers, globals.css)
- `screens/`: Единственият `page.tsx` рендерва тези 11 SPA екрана
- `components/`: UI компоненти, разделени на категории (ui, prompts, workspace)
- `store/`: Zustand stores със SSR рехидратация
- `actions/`: Server Actions за Supabase и AI
- `hooks/`: Custom React hooks (D&D, Scroll, Theme cycle)
- `lib/`: Shared utilities и Supabase client factories

## Документация

- [Архитектурни решения (ADR)](../../docs/DECISIONS.md)
- [Dependency Graph](../../docs/GRAPH.json)
- [Agent Skills & Rules](../../docs/AGENTS_GRAPH.json)
