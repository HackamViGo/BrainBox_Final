---
name: zustand
description: "Load when writing Zustand stores, useShallow, optimistic updates, or replacing localStorage with stores."
---

## Rules

- `useShallow` mandatory for multi-field store reads
- Every mutating action: snapshot → optimistic → API → rollback on failure
- NO `persist` middleware on auth or UI stores — reset on reload
- Explicit return types on all async actions
- `zustand` version: `^5.0.10`

## Core Pattern (every mutating action)

```typescript
deleteChat: async (id: string): Promise<void> => {
  const snapshot = get().chats; // 1. snapshot
  set((s) => ({ chats: s.chats.filter((c) => c.id !== id) })); // 2. optimistic update
  const res = await fetch(`/api/chats/${id}`, { method: "DELETE" });
  if (!res.ok) {
    set({ chats: snapshot }); // 3. rollback
    logger.error("ChatStore", "Delete failed", { id });
  }
};
```

## useShallow — always for multi-field reads

```typescript
import { useShallow } from "zustand/react/shallow";

// ✅ correct
const { chats, isLoading } = useChatStore(
  useShallow((s) => ({ chats: s.chats, isLoading: s.isLoading })),
);

// ❌ forbidden — causes unnecessary re-renders
const store = useChatStore();
const { chats, isLoading } = store;
```

## Store Template

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { Chat } from "@brainbox/types";
import { logger } from "@/lib/logger";

interface ChatStore {
  chats: Chat[];
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  fetchChats: () => Promise<void>;
  updateChat: (id: string, patch: Partial<Chat>) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  isLoading: false,
  setChats: (chats) => set({ chats }),

  fetchChats: async (): Promise<void> => {
    set({ isLoading: true });
    const res = await fetch("/api/chats");
    if (res.ok) {
      const data: Chat[] = await res.json();
      set({ chats: data, isLoading: false });
    } else {
      set({ isLoading: false });
      logger.error("ChatStore", "fetchChats failed");
    }
  },

  updateChat: async (id, patch): Promise<void> => {
    const snapshot = get().chats;
    set((s) => ({
      chats: s.chats.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    const res = await fetch(`/api/chats/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      set({ chats: snapshot });
      logger.error("ChatStore", "updateChat failed", { id });
    }
  },

  deleteChat: async (id): Promise<void> => {
    const snapshot = get().chats;
    set((s) => ({ chats: s.chats.filter((c) => c.id !== id) }));
    const res = await fetch(`/api/chats/${id}`, { method: "DELETE" });
    if (!res.ok) {
      set({ chats: snapshot });
      logger.error("ChatStore", "deleteChat failed", { id });
    }
  },
}));
```

## Replacing localStorage (Phase 5)

```typescript
// ❌ Phase 3 temporary (remove in Phase 5):
const [chats, setChats] = useState<Chat[]>([]);
const [folders, setFolders] = useState<Folder[]>([]);

// ✅ Phase 5:
const { chats } = useChatStore(useShallow((s) => ({ chats: s.chats })));
const libraryFolders = useFolderStore(
  useShallow((s) => s.folders.filter((f) => f.type === "library")),
);
```

## Init on App Load

```typescript
// In dashboard/page.tsx after auth check:
useEffect(() => {
  fetchChats();
  fetchFolders();
  fetchPrompts();
}, []);
```

## Anti-patterns

```typescript
❌ const store = useChatStore()  // without useShallow for multi-field
❌ localStorage.setItem('chats', JSON.stringify(chats))
❌ Missing rollback on API failure
❌ Missing explicit return type on async actions
```
