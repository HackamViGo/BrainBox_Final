# Lessons Learned — BrainBox

Грешки, корекции и научени уроци. Попълва се след всяка корекция или неочакван проблем.

---

<!-- TEMPLATE

## [YYYY-MM-DD] — [Кратко описание на проблема]
**Контекст:** В коя задача/файл се случи
**Грешка:** Какво беше направено грешно
**Решение:** Как беше оправено
**Правило напред:** Конкретно правило за избягване в бъдеще

-->

## 2026-04-11 — Next.js 16.2 Migration Lessons

**Контекст:** Миграция на BrainBox от Vite към Next.js монорепо.

### 1. Dynamic Imports & Named Exports
**Грешка:** Използване на `export default` в screens, докато `next/dynamic` очаква конкретен път или именован експорт при `.then()`.
**Решение:** Стандартизиране на именовани експорти за всички екрани (`export function Dashboard()...`) и използване на `.then(m => m.Dashboard)` в `dynamic()` дефинициите.

### 2. Canvas Persistence (NeuralField)
**Проблем:** `NeuralField` канвасът се маунтваше (рестартираше) при всяка навигация.
**Решение:** Имплементиране на `PersistentShell` компонент, който стои извън `AnimatePresence` на страниците или обвива `children` в `Page` компонента. Динамичните импорти на Canvas библиотеки (`d3`, `reactflow`) задължително с `ssr: false`.

### 3. Global Modal State
**Контекст:** `ApiKeyModal` и `SmartSwitchModal` бяха с prop drilling в Vite.
**Решение:** Преминаване към глобален `isModalOpen` стейт в `useAppStore`. Модалите се рендират веднъж в `PersistentShell`. Това прави навигацията и работата с API ключове консистентна от всеки екран.

### 4. Hydration Safety (Zustand)
**Проблем:** Hydration mismatch грешки при използване на `persist` и `localStorage`.
**Решение:** Използване на `skipHydration: true` и ръчно извикване на `useAppStore.persist.rehydrate()` в `useEffect` на `Providers.tsx`. Това гарантира, че първият рендер съвпада със сървъра (false/defaults), а след маунт се зареждат реалните данни на клиента.
