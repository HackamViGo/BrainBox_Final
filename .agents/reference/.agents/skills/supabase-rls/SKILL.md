---
name: supabase-rls
description: "Database migrations and RLS."
---

## RLS Pattern
Every table must have:
```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
CREATE POLICY "{table}_select_own" ON {table} FOR SELECT USING (auth.uid() = user_id);
```

## Type Generation
Run `pnpm db:gen` to update `packages/database/src/types.ts`.
