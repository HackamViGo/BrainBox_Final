---
name: supabase-rls
description: "Load when writing DB migrations, creating new tables, generating types, or verifying RLS policies."
---

## Rules

- Every new table MUST have RLS migration — no exceptions
- Use `(SELECT auth.uid())` not `auth.uid()` — PostgreSQL caches the subquery
- Migration files are append-only — never edit an existing migration
- After every migration: `pnpm db:gen` to regenerate types
- `auth.getUser()` not `auth.getSession()` in server code

## RLS Policy Template

```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "{table}_select_own" ON {table}
  FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "{table}_insert_own" ON {table}
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "{table}_update_own" ON {table}
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "{table}_delete_own" ON {table}
  FOR DELETE USING (user_id = (SELECT auth.uid()));
```

## Migration Naming

```
supabase/migrations/
  001_initial_schema.sql    ← all tables
  002_rls_policies.sql      ← RLS for every table
  003_indexes.sql           ← performance indexes
  004_add_tags_to_chats.sql ← new feature (never edit 001-003)
```

## Workflow

```bash
supabase start          # local dev
supabase db reset       # reset + re-run all migrations (DESTRUCTIVE)
pnpm db:gen             # regenerate packages/database/src/types.ts
supabase db push        # apply to cloud staging
```

## Verify RLS

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- ALL must show rowsecurity = TRUE
```

## Anti-patterns

```sql
❌ CREATE TABLE chats (...);  -- without RLS policies
❌ auth.uid() = user_id       -- use (SELECT auth.uid())
❌ Editing existing migration files
```
