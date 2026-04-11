# BrainBox Workflows

Приложимо за: **BrainBox монорепо**

## Кога се създава Workflow

Създавай Workflow файл (`/workflow-name`) когато:
- Задача се повтаря повече от 2 пъти
- Multi-step процес с определен ред
- Onboarding стъпки за нов dev

## Задължителни workflows за BrainBox

```text
.agents/workflows/
├── new-screen.md         ← scaffold нов screen с 'use client', store imports, placeholder
├── migrate-screen.md     ← стъпки за миграция на screen от Vite
├── new-server-action.md  ← scaffold action с Zod validation + Supabase + error handling
└── deploy.md             ← build → typecheck → test → deploy
```
