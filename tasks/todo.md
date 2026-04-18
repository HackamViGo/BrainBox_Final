# Task: Automation Documentation Update System

## Plan

- [x] Verify/Create `docs/KNOWLEDGE_GRAPH.json` if it doesn't exist (ensure it has the right structure) ✓
- [x] Create `.github/workflows/update-docs.yml` ✓
- [x] Create `scripts/update_docs.py` with the specified logic ✓
  - [x] Implement `DOC_MAP` with correct paths ✓
  - [x] Implement `get_diff` ✓
  - [x] Implement `update_doc` with GitHub Models API ✓
  - [x] Implement `update_knowledge_graph` ✓
  - [x] Implement `Main` block ✓
- [x] Update `.gitignore` to allow `scripts/update_docs.py` ✓

- [ ] Verify everything with a dry run or manual check (if possible)

## Done When

- [ ] `.github/workflows/update-docs.yml` exists and has correct triggers/steps
- [ ] `scripts/update_docs.py` handles all source files correctly
- [ ] `scripts/` is not ignored by git

## Review

- Завършено: [дата]
- Какво беше направени: ...
- Проблеми срещнати: ...
- Решения: ...
- Записвай всички промени в `docs/PROGRESS.md`.
