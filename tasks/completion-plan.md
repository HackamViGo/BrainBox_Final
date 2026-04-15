# BrainBox Completion Plan

## Фаза 0: Завърши инфраструктурните задачи
- [ ] **pnpm Catalogs**: Допълни липсващите 5+ пакета в `catalog:` (ADR-009).
- [ ] **Dotenv-cli**: Провери `NODE_OPTIONS` в `package.json` за `web-app` (да е ПРЕД `dotenv`).
- [ ] **Environment**: Продължи `.env.example` с Google Gemini API ключове.

## Фаза 1: Web App — Реализация и Polish
- [ ] **MindGraph Integration**:
  - Свържи `d3` симулацията с реалните `items` от `useLibraryStore`.
  - Добави филтрация по `type` (chat vs prompt).
- [ ] **Identity Screen**:
  - Имплементирай реална `modelUsage` логика чрез агрегация на `items.modelId`.
  - Добави функционалност на `signOut` бутона чрез `auth.ts`.
- [ ] **Workspace Completion**:
  - `AssetLibrary.tsx`: Свържи със Supabase `storage` или `items` от тип 'asset'.
  - `WhisperPanel.tsx`: Интегрирай Web Speech API за транскрибция.

## Фаза 2: Extension — Core Implementation (КРИТИЧНА)
- [ ] **Entry Points**:
  - Създай `apps/extension/src/background/index.ts` (Service Worker).
  - Създай `apps/extension/src/content/index.ts` (Message listener & adapter router).
- [ ] **Auth Bridge**:
  - Имплементирай "Auth Handshake" в `content/index.ts`, който чете JWT от `extension-auth` скрития iframe.
- [ ] **Sync Engine**:
  - Имплементирай `CapturedChat` синхронизация към `api/chats/extension` endpoint-а в web-app.
- [ ] **Context Menus**:
  - Добави захващане на селектиран текст в background worker-а.

## Фаза 3: Testing (Unit + E2E)
- [ ] **Unit Tests**:
  - Добави тестове за `packages/types/src/schemas.ts`.
  - Добави тестове за `apps/web-app/lib/gemini.ts`.
- [ ] **E2E Tests (Playwright)**:
  - `auth.spec.ts`: Пълен login flow.
  - `library.spec.ts`: Folder CRUD и Item move.
  - `prompts.spec.ts`: Gemini Refine flow.

## Фаза 4: CI/CD & Documentation
- [ ] **GitHub Actions**: Активирайте `e2e.yml` за автоматично тестване при PR.
- [ ] **GRAPH.json**: Изпълни `npx tsx scripts/generate-graph.ts` за опресняване на зависимостите.
- [ ] **README**: Обнови `README.md` в root с monorepo setup инструкции.

## Фаза 5: Pre-launch Checklist
- [ ] Execute `pnpm -r typecheck` → 0 errors.
- [ ] Execute `pnpm -r lint` → fix accessibility warnings.
- [ ] Build verification: `pnpm build` за всички приложения.

## Неизвестни и блокери
- **Extension Background Logic**: Трябва да се реши дали background worker ще работи постоянно или ще се "събужда" само при активен таб за пестене на ресурси.
- **Supabase RLS**: Потребителят трябва да потвърди дали политиките са приложени в портала на Supabase.
