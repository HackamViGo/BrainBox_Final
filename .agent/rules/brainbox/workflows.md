# BrainBox Rules: Workflows

## Кога се създава Workflow

Създавай Workflow файл (`.agent/workflows/name.md`), когато:

- Задача се повтаря повече от 2 пъти.
- Процесът включва 5+ стъпки в определен ред.
- Има сложна конфигурация (напр. нов Platform Adapter).
- Onboarding стъпки за нови функционалности.

## Задължителни workflows

- `new-screen.md`: Scaffold нов екран в Dashboard.
- `migrate-screen.md`: Миграция от Vite скелета към Next.js.
- `new-server-action.md`: Scaffold на Server Action със Zod и Supabase.
- `extension-adapter-setup.md`: Добавяне на поддръжка за нова AI платформа.
- `extension-auth-sync.md`: Имплементация на синхронизационна логика.
- `deploy.md`: Стандартен build & deploy пайплайн.

## Структура на Workflow

1. **Заглавие**: `# Workflow: [Name]`
2. **Контекст**: Кратко описание кога се ползва.
3. **Стъпки**: Номериран списък със специфични команди или файлови промени.
4. **Критерии (Done When)**: Checkbox списък за проверка.

## Правило

- Всеки нов Workflow трябва да бъде добавен в `docs/AGENTS_GRAPH.json` като възел от тип `workflow`.
