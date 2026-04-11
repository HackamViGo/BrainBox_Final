---
description: 
---

# Workflow: Deploy BrainBox

Процес на разгръщане за BrainBox монорепото.

## Стъпки

1. **Изпълни Typecheck**:

   ```bash
   pnpm typecheck
   ```

2. **Изпълни Тестове**:

   ```bash
   pnpm test
   ```

3. **Build**:

   ```bash
   pnpm build
   ```

4. **Провери за линтер грешки**:

   ```bash
   pnpm lint
   ```

5. **Push към `main` branch**.
6. **Vercel/GitHub Actions** ще поемат автоматичното разгръщане.

## Критерии

- [ ] 0 TypeScript грешки
- [ ] Всички unit тестове минават
- [ ] Build стъпката е успешна
