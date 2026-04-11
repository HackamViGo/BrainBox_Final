# Architectural Decisions (ADR)

## [ADR-001] Next.js 16.2 Monorepo Migration
**Date:** 2026-04-11
**Status:** Прието

### Контекст
Проектът BrainBox трябва да се мигрира от Vite към Next.js за по-добра поддръжка на SSR, SEO и по-лесна интеграция със Supabase.

### Решение
Използване на Next.js 16.2 (Canary/Latest) с React 19.2 в pnpm monorepo структура.
- `@brainbox/types`: споделени Zod схеми и типове.
- `@brainbox/utils`: споделени хелпъри.
- `@brainbox/ui`: споделени UI компоненти.
- `apps/web-app`: основното приложение.
- `apps/extension`: Chrome extension (Vite 7).

### Причини
- Next.js 16/React 19 предлагат подобрен Server Component модел.
- Monorepo позволява споделяне на код между уеб приложението и разширението.

### Последици
- Трябва да се внимава с Persistent SPA shell заради NeuralField canvas-а.
- Всички Zustand stores трябва да използват `skipHydration: true`.

---

## [ADR-002] Persistent Shell Pattern
**Date:** 2026-04-11
**Status:** Прието

### Контекст
`NeuralField` (canvas анимация) не трябва да се unmount-ва при навигация между страници, за да се запази визуалната приемственост.

### Решение
Имплементиране на `PersistentShell` компонент в `apps/web-app/components`, който се поставя в Root Layout. Той рендерва `NeuralField` и `AmbientLight` само веднъж и използва Next.js `children` за рендерване на страниците върху тях.

### Причини
- Избягване на премигване/рестарт на анимациите.
- По-добро UX (плавни преходи).

### Последици
- Всички страници в приложението споделят един и същ фон и анимационен слой.
