# BrainBox Architecture Rules

Приложимо за: **BrainBox монорепо**

## Zustand

- `skipHydration: true` в ВСЕКИ persist store — без изключение
- `partialize` — persist само необходимото (не целия state)
- Optimistic updates за всички CRUD операции — update state веднага, rollback при грешка
- Store actions не трябва да знаят за UI — само state трансформации

## NeuralField — критично правило

- NeuralField canvas НЕ СЕ unmount-ва между screens — само `mode` prop се сменя
- NeuralField и AmbientLight винаги с `dynamic(() => import(...), { ssr: false })`
- Sidebar има СВОЯ отделна NeuralField инстанция — това е умишлено, не го премахвай

## GRAPH.json — Dependency Graph

Проектът поддържа два живи dependency graph файла:

| Файл | Покрива | Поддържа се |
|------|---------|-------------|
| `docs/GRAPH.json` | Целия монорепо (packages/ + apps/) | Скрипт + агент |
| `docs/AGENTS_GRAPH.json` | .agents/ папката (skills, rules, workflows) | Само агент (ръчно) |

### Кога се обновява GRAPH.json

**Автоматично** — скриптът обновява `dependencies` и `dependents`:

```bash
npx tsx scripts/generate-graph.ts         # обнови
npx tsx scripts/generate-graph.ts --check # само провери (CI)
```

**Ръчно от агента** — при всяка от следните промени:
- Създаден нов файл → добави нов node
- Изтрит файл → смени `"status": "deleted"`, не изтривай node
- Преименуван файл → обнови `id` и всички references
- Сменено `responsibility` на модул → обнови полето
- Открит нов `side_effect` → добави в масив
