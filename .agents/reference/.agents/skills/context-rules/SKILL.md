---
name: context-rules
description: "Meta-skill: How to use the agent system. Read this first."
---

## The Golden Rule
Before writing ANY code:
1. Read `.agents/skills/SKILLS_INDEX.md`.
2. Find the relevant skill.
3. Load the full `SKILL.md`.
4. Check `context7.resolve()` for library versions.

## Documentation Discovery
- Never scan `docs/` manually.
- Always read `docs/INDEX.json` to find the correct document.
- If a new decision is made, create an ADR in `docs/adr/` and update the index.

## File Creation Rules
- All docs go to `docs/`.
- All shared types go to `packages/types/`.
- All shared schemas go to `packages/validation/`.
