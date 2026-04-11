# CI/CD Rules

Приложимо за: **всички проекти**

## GitHub Actions структура

```text
.github/workflows/
├── ci.yml          ← на всеки PR: typecheck + lint + unit tests
├── e2e.yml         ← на PR към main: E2E tests
└── deploy.yml      ← на push към main: build + deploy
```

## ci.yml — задължителни checks

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - # setup package manager
      - run: [install command]
      - run: [typecheck command]  # 0 TypeScript errors
      - run: [lint command]       # Linter
      - run: [test command]       # Unit tests
```

## PR правила

- Никой не merge-ва директно в `main` без PR
- PR трябва да има: описание на промяната, линк към task, скрийншот ако е UI
- Всички CI checks трябва да минават преди merge
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/`
