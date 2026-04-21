# System Architecture

BrainBox е изграден като съвременен **Monorepo** проект, осигуряващ споделяне на типове, конфигурации и компоненти между уеб приложението и разширението.

## Technology Stack

- **Framework:** Next.js 16.2 (App Router)
- **Runtime:** React 19.2
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 + Vanilla CSS
- **State Management:** Zustand v5 (with Persistence)
- **Database / Auth:** Supabase (PostgreSQL + RLS)
- **Animations:** Framer Motion (motion/react)
- **Build System:** pnpm Workspaces + Vite 8 (for Extension)

## Core Components

### 1. Web App (`apps/web-app`)

Основното Next.js приложение. Служи като Dashboard за управление на знанията и хоства API прокси слоевете.

### 2. Browser Extension (`apps/extension`)

Инструментът за "улавяне" на знания. Интегрира се директно в AI платформи и синхронизира данни с Web App.

### 3. Shared Library (`packages/`)

- `@brainbox/types`: Дефиниции и Zod схеми.
- `@brainbox/ui`: Споделени визуални компоненти (NeuralField, AmbientLight).
- `@brainbox/utils`: Помощни функции, логери и константи.

## Deployment Model

- **Web App:** Деплой в Vercel или произволна Node.js среда с поддръжка на Server Actions.
- **Extension:** Публикуване в Chrome Web Store или ръчно зареждане в режим на разработка.

## Last Updated

2026-04-16
