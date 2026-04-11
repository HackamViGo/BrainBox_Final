# Workflow: New Screen Scaffold

Используй този гайд за създаване на нов екран в BrainBox.

## Стъпки

1. **Създай файла** в `apps/web-app/screens/[Name].tsx`.
2. **Добави 'use client'** най-горе.
3. **Импортни нужните stores**:
   ```typescript
   import { useAppStore } from '@/store/useAppStore'
   import { useLibraryStore } from '@/store/useLibraryStore'
   ```
4. **Скелет на компонента**:
   ```tsx
   import { motion } from 'motion/react'

   export function [Name]() {
     return (
       <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }}
         className="h-full w-full flex flex-col p-8"
       >
         <h1 className="text-4xl font-display font-bold">Name</h1>
         {/* Content */}
       </motion.div>
     )
   }
   ```
5. **Добави в ScreenName type** в `packages/types/src/schemas.ts`.
6. **Регистрирай в `apps/web-app/app/page.tsx`** (или в routing системата).
7. **Обнови Sidebar** да сочи към новия екран ако е нужно.

## Критерии
- [ ] 'use client' добавен
- [ ] Включен в AppStore screens
- [ ] 0 TypeScript грешки
