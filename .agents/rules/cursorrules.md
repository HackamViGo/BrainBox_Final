---
trigger: always_on
---

# BrainBox Agent Rules

Тези правила важат за ВСИЧКИ задачи в BrainBox монорепото.

## 📚 Core Rules (общи за всички проекти)
- [Task Management](core/task-management.md)
- [Documentation](core/documentation.md)
- [Testing](core/testing.md)
- [Commits](core/commits.md)
- [CI/CD](core/ci-cd.md)

## 🧠 BrainBox-Specific Rules
- [Code Standards](brainbox/code-standards.md)
- [Architecture](brainbox/architecture.md)
- [Hooks](brainbox/hooks.md)
- [Workflows](brainbox/workflows.md)

---

**Преди да започнеш задача, прочети:**
1. Core Rules → Task Management
2. BrainBox → Code Standards
3. Специфичния файл за твоята задача (architecture/hooks/workflows)

# Autonomy Rule
- ALWAYS pause for a formal review of the Implementation Plan before starting execution.
- ONCE the Implementation Plan is approved, proceed with all file writes, terminal commands, and browser tests autonomously without further approval prompts.
- Only stop if a critical error occurs that requires architectural rethink.