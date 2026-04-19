# Antigravity Rules Guide (March 2026)

_Summary from https://antigravity.codes/blog/user-rules_

## Rules Hierarchy & Precedence

1. **System Rules (Immutable):** Core directives from Google Deepmind.
2. **GEMINI.md (Highest User Priority):** Antigravity-specific overrides.
3. **AGENTS.md (Cross-Tool Foundation):** Shared rules for Antigravity, Cursor, and Claude Code.
4. **.agent/rules/ (Workspace Supplements):** Folder for organized rule files.

## File Locations

- **Global:** `~/.gemini/GEMINI.md` and `~/.gemini/AGENTS.md`
- **Workspace:** Project root `GEMINI.md`, `AGENTS.md`, and `.agent/rules/`
- **Nested:** Subdirectory `AGENTS.md` (applies only to that folder).

## Best Practices

- **AGENTS.md** should contain shared code standards, tech stack, and quality requirements.
- **GEMINI.md** should contain Antigravity-specific behavior (e.g., Artifact rules, specific design philosophy).
- **.agent/rules/** should be used to organize rules into separate concerns (e.g., `testing.md`, `ci-cd.md`).
- **Commit Rules:** Always commit `GEMINI.md` and `AGENTS.md` to version control.
- **Task Management:** Antigravity uses "Artifacts" like `task.md` (checklist) and `implementation_plan.md` (blueprint).

## Specific Features

- **Turbo Mode (`// turbo`):** Place above commands in workflows for auto-execution.
- **Design Philosophy:** Default is premium/vibrant. Override in `GEMINI.md` if needed.
- **Nested Rules:** Enabling "Load nested AGENTS.md files" in settings allows folder-specific scoping.
