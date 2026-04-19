---
name: vite-8
description: "Vite 8, Rolldown build system, and Oxc parser configuration."
---

# Vite 8 & Rolldown Standards

## 1. Build System

- **Rolldown**: The default bundler for Vite 8. Replaces Rollup internals. Use `rolldownOptions` (NOT `rollupOptions`).
- **Oxc**: The default parser and transformer. Replaces SWC/Babel/esbuild for transforms.
- **lightningcss**: Default CSS minifier. Do NOT use `cssnano` or `esbuild` for CSS.

## 2. React Plugin (Critical)

**MANDATORY**: Use `@vitejs/plugin-react-oxc` — NOT `@vitejs/plugin-react` (babel).

```typescript
// ✅ Correct — Vite 8 + Oxc
import react from "@vitejs/plugin-react-oxc";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "lightningcss",
    target: "esnext",
  },
});
```

```typescript
// ❌ WRONG — babel-based (old)
import react from "@vitejs/plugin-react";
```

## 3. Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-oxc";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    minify: "lightningcss",
    target: "esnext",
    // ✅ rolldownOptions (NOT rollupOptions)
    rolldownOptions: {
      external: ["chrome"],
    },
  },
});
```

## 4. Deprecations (Remove These)

| Old                        | New                        |
| -------------------------- | -------------------------- |
| `@vitejs/plugin-react`     | `@vitejs/plugin-react-oxc` |
| `rollupOptions`            | `rolldownOptions`          |
| `minify: 'terser'`         | `minify: 'lightningcss'`   |
| `minify: 'esbuild'`        | `minify: 'lightningcss'`   |
| `@vitejs/plugin-react-swc` | `@vitejs/plugin-react-oxc` |

## 5. BrainBox Extension Context

The extension uses **CRXJS 2.4.x** with Vite 8:

- `@crxjs/vite-plugin` must be version `^2.4.0` (Vite 8 support).
- HMR works in development mode for popup and content scripts.
- Service worker (`service-worker.ts`) is NOT HMR-enabled — full reload required.

## 6. Performance Notes

- Oxc parse + transform is ~10x faster than Babel in CI.
- Rolldown is ~5x faster than Rollup on large bundles.
- Use `pnpm --filter extension build` for isolated extension builds.
