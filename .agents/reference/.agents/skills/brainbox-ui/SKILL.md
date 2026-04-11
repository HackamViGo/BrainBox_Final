---
name: brainbox-ui
description: "React 19.2 UI Patterns."
---

## Activity Component
Use for keeping state in hidden tabs:
```typescript
<Activity mode={active ? 'visible' : 'hidden'}>
  <ChatList />
</Activity>
```

## useId
Prefix is `_r_` for View Transitions compatibility.
