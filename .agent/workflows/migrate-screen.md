# Workflow: Migrate Screen from Vite

Гайд за миграция на съществуващ екран от BrainBox Vite версията към новия Next.js монорепо.

## Стъпки

1. **Копирай файла** от `/brainbox/src/screens/[Name].tsx` в `apps/web-app/screens/`.
2. **Адаптирай импортите**:
   - Замени `framer-motion` с `motion/react`.
   - Замени локални `stores/` с `@/store/useAppStore` и т.н.
   - Замени `utils` с `@brainbox/utils`.
   - Замени `types` с `@brainbox/types`.
3. **Премини към Zustand**:
   - Премахни локалните `useState` за състояния, които вече са в global store.
   - Използвай `useAppStore` за навигация и теми.
4. **Адаптирай Animation**:
   - Увери се, че `LayoutGroup` или споделени анимации работят с `motion/react`.
5. **Тествай**:
   - Провери дали се рендира правилно в `PersistentShell`.

## Критерии

- [ ] 0 импорт грешки
- [ ] Работи в рамките на PersistentShell
- [ ] Следва новия дизайн език (Tailwind v4)
