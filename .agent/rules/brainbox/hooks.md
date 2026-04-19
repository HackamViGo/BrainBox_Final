# BrainBox Rules: Hooks

## Кога се създава custom hook

Създавай hook (`hooks/use[Name].ts`), когато:

- Същата логика с `useEffect`/`useState` се повтаря в 2+ компонента.
- Скрипта съдържа сложна side-effect логика (>20 реда).
- Използваш Browser API абстракции (`useMediaQuery`, `useLocalStorage`).
- Имплементираш Subscription логика (Supabase Realtime).

## React 19.2 Specifics

- **`useEffectEvent`**: Използвай ЗАДЪЛЖИТЕЛНО за Chrome Event Listeners и всякакви не-реактивни логики вътре в ефекти.
- **`useActionState`**: За форми в Dashboard (Server Actions).
- **`useOptimistic`**: За CRUD операции в Workspace.

## Задължителни hooks за BrainBox

- `useThemeCycle.ts`: Тема auto-cycle (спира на критични екрани).
- `useDragDrop.ts`: Drag source за Library → Workspace.
- `useScrollTransition.ts`: Dashboard↔Extension scroll detection.
- `useSupabaseRealtime.ts`: Realtime subscriptions.

## Правила

- НИКОГА не прави hook, ако логиката е само в един компонент и е под 10 реда.
- Всеки hook трябва да има JSDoc с описание на параметрите и връщания стейт.
