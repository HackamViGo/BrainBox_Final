---
name: react-19
description: "React 19.2 features: Activity mode, useActionState, and async rendering."
---

# React 19.2 Standards

## 1. Activity Mode

Use `<Activity>` (formerly Offscreen) for managing background screens in the extension or dashboard without losing state.

## 2. useActionState & useFormStatus

Prefer these hooks for handling form submissions and Server Action pending states.

```typescript
const [state, action, isPending] = useActionState(upsertItem, initialState);
```

## 3. use(Promise)

Use the `use` hook to unwrap promises in render (e.g., for `params` in Next.js 16).

```typescript
const params = use(paramsPromise);
```

## 4. useEffectEvent

Use `useEffectEvent` for callback logic that needs to read stable state without triggering re-runs of the effect.
