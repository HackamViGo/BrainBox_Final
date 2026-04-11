# Workflow: New Server Action

Създаване на сигурен Server Action за BrainBox.

## Стъпки

1. **Създай файла** в `apps/web-app/actions/[category].ts`.
2. **Добави 'use server'** най-горе.
3. **Дефинирай input schema** с Zod.
4. **Имплементирай функцията**:
   ```typescript
   'use server'
   import { z } from 'zod'
   import { createClient } from '@/utils/supabase/server'

   const Schema = z.object({ ... })

   export async function myAction(data: z.infer<typeof Schema>) {
     const result = Schema.safeParse(data)
     if (!result.success) throw new Error('Invalid data')

     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) throw new Error('Unauthorized')

     // Logic...
   }
   ```
5. **Добави JSDoc** с `@throws` и `@returns`.

## Критерии
- [ ] Zod валидация добавена
- [ ] `getUser()` проверка е налице
- [ ] 'use server' директива
