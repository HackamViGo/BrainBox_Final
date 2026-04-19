---
name: tailwind-v4
description: "Tailwind CSS v4 (CSS-first) patterns and configuration."
---

# Tailwind CSS v4 Standards

## 1. CSS-First Architecture

- **NO `tailwind.config.ts`**.
- Configuration happens in `globals.css` or shared CSS files using `@theme {}`.

```css
@import "tailwindcss";

@theme {
  --color-bb-bg: #000000;
  --animate-pulse-slow: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 2. Token Usage

- Use BrainBox specific tokens: `text-bb-text`, `bg-bb-bg`, `border-bb-border`.
- Custom utility classes should be defined using standard CSS and applied via Tailwind if necessary, but prefer CSS variables for dynamic themes.

## 3. Directives

Use `@import "tailwindcss"` instead of the legacy `@tailwind` directives.
