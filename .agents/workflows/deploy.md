---
description: "Пълен deploy процес за BrainBox монорепото — typecheck, lint, test, graph-check, build."
---

# Workflow: Deploy BrainBox

Процес на разгръщане за BrainBox монорепото.

> **Правило:** Никой не merge-ва директно в `main` без PR + минали CI checks.

---

## Стъпки

### 1. Typecheck (0 грешки задължително)

```bash
pnpm typecheck
```

Ако има грешки — **СПРИ**. Не продължавай.

### 2. Lint

```bash
pnpm lint
```

### 3. Unit тестове

```bash
pnpm test --run
```

Очаквано: всички тестове минават, coverage ≥ 85%.

### 4. Graph check (dependency integrity)

```bash
npx tsx scripts/generate-graph.ts --check
```

Ако има orphan nodes или несъответствия — обнови `docs/GRAPH.json` преди да продължиш.

### 5. Build

```bash
pnpm build
```

Web-app: Next.js production build.  
Extension: `pnpm --filter @brainbox/extension build`

### 6. E2E тестове (преди merge в main)

```bash
pnpm --filter web-app exec playwright test
```

### 7. Push към `main` branch

```bash
git push origin main
```

**Vercel/GitHub Actions** ще поемат автоматичното разгръщане.

---

## GitHub Actions (автоматично)

| Workflow | Тригер | Jobs |
|---|---|---|
| `ci.yml` | push/PR | typecheck → lint → unit tests → graph-check |
| `e2e.yml` | PR към main | Playwright E2E |
| `preview.yml` | PR | Vercel preview + PR comment |
| `deploy.yml` | push main | Vercel production |

---

## Критерии за завършване

- [ ] `pnpm typecheck` → 0 грешки
- [ ] `pnpm lint` → 0 warnings за production код
- [ ] Всички unit тестове минават
- [ ] `graph-check` → OK
- [ ] Build стъпката е успешна
- [ ] E2E тестове минават (при merge в main)

---

## Rollback

При проблем в production:
```bash
# Върни предишния deployment в Vercel dashboard
# или revert commit:
git revert HEAD --no-edit
git push origin main
```
