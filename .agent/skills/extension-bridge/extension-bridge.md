---
name: extension-bridge
description: "Load when working on context menus, prompt injection, token bridge, or popup behavior. ALSO load when agent mentions 'inject buttons', 'DOM injection', 'middleware.ts', 'content script selectors for buttons'."
---

## ⛔ HARD STOPS — Read before writing a single line

```
❌ NEVER rename proxy.ts to middleware.ts
   Next.js 16 deprecated middleware.ts → use proxy.ts
   Codemod: npx @next/codemod@latest middleware-to-proxy .

❌ NEVER inject buttons, UI, or overlays into AI platform DOM
   Content scripts are READ-ONLY observers
   The ONLY DOM write allowed: injectText() into existing textareas

❌ NEVER ask "how should auth token be stored?"
   It's already decided: AES-GCM encrypted in chrome.storage.local
   See crypto.ts pattern in extension-mv3 skill

❌ NEVER create a background.ts or background/index.ts
   The file is service-worker.ts — Manifest V3 has no background pages

❌ NEVER call chrome.contextMenus.create() outside onInstalled
   Context menus ONLY in setupContextMenus() called from onInstalled
```

## Rules

- Context menus registered ONLY in `onInstalled` — never at every SW event
- No injected buttons in AI platform DOM — prompt injection into existing textareas only
- `waitForAuth()` required before every context menu action
- Popup only reads state — no direct API calls from popup
- `installationManager` opens login page ONLY on fresh install — never on update

## Auth Token Storage (already decided — do not re-open)

```
Token flow:
1. Fresh install → chrome.tabs.create({ url: dashboardUrl + '/extension-auth' })
2. /extension-auth page → postMessage({ type: 'BRAINBOX_AUTH_TOKEN', token: jwt })
3. content-dashboard-auth.ts listens → chrome.runtime.sendMessage({ type: 'AUTH_TOKEN_RECEIVED', token })
4. service-worker.ts receives → encryptToken(token) → chrome.storage.local.set({ encryptedToken })

Storage: AES-GCM encrypted ALWAYS — see extension-mv3 skill for crypto.ts pattern
Reading: decryptToken() → Bearer header in all API calls
```

## proxy.ts (Next.js 16 — NOT middleware.ts)

```typescript
// apps/web-app/proxy.ts  ← CORRECT filename for Next.js 16
// NOT middleware.ts — that name is deprecated in Next.js 16

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // ← function name is proxy()
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser(); // ← getUser() not getSession()
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
```

## 3 Context Menu Contexts

```
1. Page click (AI platform, no selection, no textarea)
   → "💾 Save Chat to BrainBox"
   → EXTRACT_CONVERSATION → sync-manager → POST /api/chats/extension
   → Dashboard: Library screen

2. Editable field (textarea)
   → "⚡ Inject Prompt"
   → Sub-items: prompts from 3 selected folders in Settings (max 7 per folder)
   → INJECT_PROMPT → prompt-inject.ts → writes to textarea value only
   → NO UI injection, NO overlay, NO buttons added to page

3. Selection (marked text)
   → "✨ BrainBox"
   → "💾 Save as Prompt" → POST /api/prompts (folder_id: null)
   → "📌 Save as Chunk" → POST /api/chunks
   → "🔮 Enhance →" → Gemini directly from SW (user's own API key)
       Styles: Структурирай | Направи по-ясен | Разшири | Съкрати
       Result: chrome.storage.local bb_enhance_result → openPopup()
```

## Context Menu Setup

```typescript
// context-menu-manager.ts — called from onInstalled ONLY
export async function setupContextMenus(): Promise<void> {
  await new Promise<void>((resolve) => chrome.contextMenus.removeAll(resolve));

  chrome.contextMenus.create({
    id: "BB_SAVE_CHAT",
    title: "💾 Save Chat to BrainBox",
    contexts: ["page"],
    documentUrlPatterns: [
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "https://chat.deepseek.com/*",
      "https://perplexity.ai/*",
      "https://grok.com/*",
      "https://chat.qwen.ai/*",
      "https://chat.lmsys.org/*",
    ],
  });

  chrome.contextMenus.create({
    id: "BB_INJECT_PARENT",
    title: "⚡ Inject Prompt",
    contexts: ["editable"],
    documentUrlPatterns: [
      /* same 8 platforms */
    ],
  });
  // Dynamic sub-items from cached prompts (3 folders × max 7 prompts)

  chrome.contextMenus.create({
    id: "BB_SELECTION_PARENT",
    title: "✨ BrainBox",
    contexts: ["selection"],
  });
  // Sub-items: BB_SAVE_PROMPT, BB_SAVE_CHUNK, BB_ENHANCE_PARENT
}
```

## waitForAuth (required before every action)

```typescript
async function waitForAuth(
  maxAttempts = 3,
  intervalMs = 500,
): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const { encryptedToken } = await chrome.storage.local.get([
      "encryptedToken",
    ]);
    if (encryptedToken) {
      const token = await decryptToken(encryptedToken);
      if (token) return token;
    }
    if (i < maxAttempts - 1)
      await new Promise((r) => setTimeout(r, intervalMs));
  }
  // Not authenticated → open login
  chrome.tabs.create({ url: `${config.dashboardUrl}/extension-auth` });
  return null;
}
```

## prompt-inject.ts (ONLY allowed DOM write)

```typescript
// Writes to textarea value ONLY — no DOM injection of any kind
function injectText(element: HTMLElement, text: string): void {
  element.focus();
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  if (nativeSetter) {
    nativeSetter.call(element, text);
  } else {
    (element as HTMLElement).innerText = text; // contenteditable fallback
  }
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}
```

## Textarea Selectors by Platform

```typescript
const TEXTAREA_SELECTORS: Record<string, string> = {
  "chatgpt.com": "#prompt-textarea",
  "claude.ai": '[contenteditable="true"].ProseMirror',
  "gemini.google.com": "rich-textarea .ql-editor",
  "chat.deepseek.com": "textarea#chat-input",
  "perplexity.ai": "textarea[placeholder]",
  "grok.com": "textarea",
  "chat.qwen.ai": "textarea",
  "chat.lmsys.org": "textarea",
};
```

## Token Bridge (content-dashboard-auth.ts)

```typescript
// Runs ONLY on /extension-auth page (manifest content_scripts match)
window.addEventListener("message", (event) => {
  if (event.data?.type !== "BRAINBOX_AUTH_TOKEN") return;
  chrome.runtime.sendMessage({
    type: "AUTH_TOKEN_RECEIVED",
    token: event.data.token,
  });
});
```

## Installation Manager

```typescript
export function setupInstallation(): void {
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      const { encryptedToken } = await chrome.storage.local.get([
        "encryptedToken",
      ]);
      if (encryptedToken) return; // already logged in
      chrome.tabs.create({ url: `${config.dashboardUrl}/extension-auth` });
    }
    // 'update' → NOTHING — never redirect on update
  });
}
```

## Action → Dashboard Screen Mapping

| Extension Action | Dashboard                                       |
| ---------------- | ----------------------------------------------- |
| Save Chat        | Library screen                                  |
| Save Prompt      | Prompts screen (folder_id: null)                |
| Inject Prompt    | From 3 folders configured in Settings           |
| Enhance          | Popup EnhanceResultView (Gemini direct from SW) |

## Anti-patterns

```
❌ middleware.ts — use proxy.ts (Next.js 16)
❌ background.ts — use service-worker.ts (MV3)
❌ Injecting buttons, overlays, or UI into AI platform DOM
❌ chrome.contextMenus.create() outside onInstalled/setupContextMenus()
❌ Direct API calls from popup component
❌ waitForAuth() omitted before context menu action
❌ chrome.tabs.create() on 'update' in onInstalled
❌ getSession() — use getUser() (security skill rule)
❌ Storing token as plaintext — always AES-GCM (extension-mv3 skill)
```
