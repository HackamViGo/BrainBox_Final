# Task Management Rules

Приложимо за: **всички проекти**

## Принцип: Plan → Verify → Execute → Document

### Стъпка 1 — Plan First

Преди да пишеш код, създай `tasks/todo.md` с checkable items:

```markdown
## Task: [name]

### Plan

- [ ] Стъпка 1
- [ ] Стъпка 2
- [ ] Стъпка 3

### Done When

- [ ] typecheck → 0 грешки
- [ ] [feature-specific criteria]
```

### Стъпка 2 — Verify Plan

След като напишеш плана, СПРИ и изчакай approval преди да започнеш имплементация.
Изключение: ако Artifact Review Policy е "Always Proceed" — продължи.

### Стъпка 3 — Track Progress

Маркирай всяка стъпка като завършена веднага щом приключи:

```markdown
- [x] Стъпка 1 ✓
- [ ] Стъпка 2 ← в момента
```

### Стъпка 4 — Explain Changes

При всяка значима стъпка добави кратко обяснение в чата:
`"Завърших X. Причина за подхода: Y. Следва: Z."`

### Стъпка 5 — Document Results

В края на задачата добави `## Review` секция в `tasks/todo.md`:

```markdown
## Review

- Завършено: [дата]
- Какво беше направено: ...
- Проблеми срещнати: ...
- Решения: ...
```

### Стъпка 6 — Capture Lessons

Ако е имало корекция или неочакван проблем, добави в `tasks/lessons.md`:

```markdown
## [дата] — [кратко описание на проблема]

**Контекст:** ...
**Грешка:** ...
**Решение:** ...

## Autonomy Rule

- ALWAYS pause for a formal review of the Implementation Plan before starting execution.
- ONCE the Implementation Plan is approved, proceed with all file writes, terminal commands, and browser tests autonomously without further approval prompts.
- Only stop if a critical error occurs that requires architectural rethink.
```
