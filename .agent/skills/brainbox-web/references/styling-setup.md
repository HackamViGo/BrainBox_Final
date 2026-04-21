---
name: brainbox-styling-setup
description: >
  Tailwind CSS v4 + shadcn/ui конфигурация за BrainBox Next.js 16.2 монорепо.
  Ползвай при: първоначален setup на Tailwind v4 в apps/web-app, инсталиране на shadcn/ui,
  миграция на BrainBox CSS (glass-panel, bg-grain, neural-edge) от Vite към Next.js,
  конфигурация на PostCSS, или при проблеми с CSS variables и темите в монорепо контекст.
  Задължително преди да пипаш globals.css, postcss.config, или components.json.
---

# BrainBox — Tailwind v4 + shadcn/ui Setup

## Ключови разлики Tailwind v4 vs v3

| v3                                    | v4                             |
| ------------------------------------- | ------------------------------ |
| `tailwind.config.js` с `content[]`    | CSS-first конфигурация         |
| `@tailwind base/components/utilities` | `@import "tailwindcss"`        |
| `autoprefixer` нужен                  | Вграден в v4                   |
| `postcss-import` нужен                | Вграден в v4                   |
| Plugin: `tailwindcss`                 | Plugin: `@tailwindcss/postcss` |

---

## 1. Инсталация (apps/web-app)

```bash
pnpm add tailwindcss @tailwindcss/postcss
pnpm add -D tw-animate-css
```

---

## 2. PostCSS конфигурация

```js
// apps/web-app/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    // autoprefixer и postcss-import НЕ са нужни — вградени в v4
  },
};
```

---

## 3. globals.css — пълен файл за BrainBox

```css
/* apps/web-app/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

/* ── BrainBox Font ── */
@theme {
  --font-sans: "Inter", ui-sans-serif, system-serif, sans-serif;
}

/* ── shadcn/ui CSS Variables ── */
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}

/* BrainBox е изцяло тъмен — само dark vars */
:root {
  --radius: 0.5rem;
  --background: oklch(0.06 0 0); /* #050505 — от Vite */
  --foreground: oklch(1 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.145 0 0);
  --muted: oklch(0.2 0 0);
  --muted-foreground: oklch(0.6 0 0);
  --border: oklch(1 0 0 / 8%); /* rgba(255,255,255,0.08) */
  --ring: oklch(0.5 0 0);
}

/* ── BrainBox Custom Classes (от Vite src/index.css) ── */
html,
body {
  background-color: #000000;
  color: #ffffff;
  overflow: hidden;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#root,
main {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Scrollbar hidden */
::-webkit-scrollbar {
  display: none;
}
* {
  scrollbar-width: none;
}

/* Glass panels */
.glass-panel {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-panel-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Grain texture overlay */
.bg-grain {
  position: relative;
}
.bg-grain::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Neural edge animations (Workspace) */
@keyframes dashdraw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.neural-edge-path {
  stroke-dasharray: 5, 5;
  animation: dashdraw 2s linear infinite;
}
.neural-edge-path-fast {
  stroke-dasharray: 5, 5;
  animation: dashdraw 0.5s linear infinite;
}

/* h-dvh за мобилен viewport fix */
.h-dvh {
  height: 100dvh;
}
```

---

## 4. shadcn/ui инсталация

```bash
# В apps/web-app
cd apps/web-app
pnpm dlx shadcn@latest init
```

При `init` избери:

- Style: **Default** (не New York — BrainBox е custom dark)
- Base color: **Neutral**
- CSS variables: **Yes**

---

## 5. components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## 6. shadcn компоненти за BrainBox

Инсталирай само нужните:

```bash
# Dialogs — за ApiKeyModal, NewFolderModal, SmartSwitchModal
pnpm dlx shadcn@latest add dialog

# Dropdowns — за контекстни менюта в Library
pnpm dlx shadcn@latest add dropdown-menu

# Tooltips — за Sidebar иконите
pnpm dlx shadcn@latest add tooltip

# Input — за Settings форми
pnpm dlx shadcn@latest add input

# ScrollArea — за Sidebar папки
pnpm dlx shadcn@latest add scroll-area

# Tabs — за Prompts sub-views (Hub/Frameworks/Refine/Saved)
pnpm dlx shadcn@latest add tabs
```

> ⚠️ shadcn НЕ замества custom BrainBox компоненти (NeuralField, AmbientLight, glass cards).
> Ползва се само за accessibility primitives.

---

## 7. packages/config — споделен Tailwind

```typescript
// packages/config/tailwind.config.ts
// В Next.js 16 + Tailwind v4: НЕ е нужен content[] масив
// v4 открива класовете автоматично чрез CSS @source

export default {};
// Файлът съществува само за @brainbox/config dependency reference
```

```css
/* packages/config/styles/brainbox.css — импортирай в globals.css */
/* Съдържа glass-panel, bg-grain и neural-edge — виж globals.css по-горе */
```

---

## 8. Inter шрифт (Next.js font optimization)

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"], // BrainBox има BG текст
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="bg" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Честа грешка: Tailwind класове от packages/ui не се detect-ват

```css
/* apps/web-app/app/globals.css — добави @source за monorepo пакети */
@import "tailwindcss";
@source "../../packages/ui/src/**/*.{ts,tsx}"; /* ← ЗАДЪЛЖИТЕЛНО */
@source "../../packages/utils/src/**/*.{ts,tsx}";
```

Без `@source` директивите, Tailwind v4 не сканира `packages/` и класовете от
`@brainbox/ui` компоненти ще липсват в production build.
