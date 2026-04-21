# Architecture: Data Flow & Synchronization

## Overview

BrainBox uses a distributed architecture across the Web Dashboard (Next.js) and the Browser Extension (Vite/CRXJS). This document defines how data flows between these components and the backend (Supabase).

## 1. Store Lifecycle & Persistence

- **State Engine:** Zustand v5 with `persist` middleware.
- **Storage:** `localStorage` for Web Dashboard, `chrome.storage.local` for Extension.
- **Rules:**
  - `skipHydration: true` is mandatory for all persisted stores to prevent SSR mismatches.
  - `_hasHydrated` flag must be used to ensure UI only renders after data is available.

## 2. Extension Normalizers Strategy

The Browser Extension is strictly decoupled from the Supabase client to minimize bundle size and bypass RLS complexity in limited environments (service workers).

### The "No Direct Fetch" Rule

- **Extension:** NEVER calls `supabase.co` directly.
- **Communication:** Extension sends raw captures to the Dashboard via `ExtensionBridge` (Message passing).
- **Dashboard:** acts as the "Normalizer" and "Persistence Layer".
- **Pros:** Centralized validation (Zod), easier debugging, and consistent data structures.

## 3. Screen Navigation (Dashboard)

- **Single Source of Truth:** `useAppStore` contains `activeScreen`.
- **Navigation:** The entire Dashboard is a single `page.tsx` that switches components based on `activeScreen`.
- **Naming:** Screens are clean (Library, Prompts, Workspace, Studio). Legacy "Main " prefixes are forbidden.

## 4. Animation Synchronization

- **AmbientLight & NeuralField:** Shared tokens from `@brainbox/types` and `@brainbox/config`.
- **State:** Theme changes in any screen trigger global state updates in `useAppStore`, which propagates to UI atoms.

## 5. Security & Tokens

- **Encryption:** Auth tokens are stored **AES-GCM encrypted** in `chrome.storage.local`.
- **Flow:** Auth happens on the Dashboard → Secret is shared with Extension → Extension uses Secret to sign requests via the Dashboard API Layer.
