# BrainBox Hooks Rules

Приложимо за: **BrainBox монорепо**

## Кога се създава custom hook

Създавай hook (`hooks/use[Name].ts`) когато:
- Същата логика с `useEffect`/`useState` се повтаря в 2+ компонента
- Сложна side-effect логика, която замърсява компонент (>20 реда)
- Browser API abstraction (`useMediaQuery`, `useLocalStorage`)
- Subscription логика (WebSocket, Supabase Realtime)

**НЕ** прави hook ако логиката е само в един компонент и е под 10 реда.

## Задължителни hooks за BrainBox

```text
apps/web-app/hooks/
├── useThemeCycle.ts       ← тема auto-cycle (15s interval, спира на library/prompts/studio)
├── useDragDrop.ts         ← drag source за Library → Workspace
├── useScrollTransition.ts ← Dashboard↔Extension scroll detection
└── useSupabaseRealtime.ts ← (бъдеще) realtime subscriptions
```
