# Commit Rules (Conventional Commits)

Приложимо за: **всички проекти**

```text
feat:     нова функционалност
fix:      bug fix
chore:    build, deps, config
docs:     само документация
test:     добавяне/поправка на тестове
refactor: без нова функционалност или fix
style:    форматиране, без логика
perf:     performance optimization
```

## Примери:

```text
feat(auth): add OAuth login flow
fix(canvas): prevent memory leak on unmount
docs(decisions): add ADR-003 for state management pattern
test(store): add unit tests for CRUD actions
chore(deps): upgrade to React 19.2
```

## Правила:

- Scope в скоби след типа (по избор, но препоръчително)
- Описание в present tense, lowercase
- Body и footer по избор за сложни промени
