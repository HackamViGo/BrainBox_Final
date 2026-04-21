---
name: zustand-v5
description: "Zustand v5 state management patterns with persistence and shallowing."
---

# Zustand v5 Standards

## 1. Store Setup

Use `create` with explicit type definitions.

```typescript
interface AppState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "chatgpt",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "app-storage", skipHydration: true },
  ),
);
```

## 2. skipHydration: true

ALL persistent stores MUST use `skipHydration: true` to prevent Next.js hydration mismatches. Components must manually call `useStore.persist.rehydrate()` in a `useEffect`.

## 3. Selective Shallowing

Use `useShallow` from `zustand/react/shallow` to prevent unnecessary re-renders when selecting multiple properties.

```typescript
const { theme, setTheme } = useAppStore(
  useShallow((s) => ({
    theme: s.theme,
    setTheme: s.setTheme,
  })),
);
```
