---
name: skill-creator
description: |
  Scaffold and refine custom AI agent skills. Covers structure, instructions, progressive disclosure, and context window management. 
  Use when: creating new skills in .agent/skills/, optimizing existing skills, or designing instruction sets for specific workflows.
---

# Skill Creator

**Status**: Production Ready  
**Reference**: [Anthropic's skill-creator](https://github.com/anthropics/skills/tree/main/skill-creator)

## 📍 Core Philosophies

1. **Brevity is King**: Every token in a skill is context window space. Avoid duplication of base AI knowledge.
2. **Progressive Disclosure**: Structure info in layers (Metadata -> SKILL.md -> resources/).
3. **Actionable Instructions**: Match detail level to complexity. Use high-level text for flexibility, structured formats for precision.

## 📁 Structure

```text
.agent/skills/my-skill/
├── SKILL.md       # Target instructions & metadata (Required)
├── scripts/        # Executable helpers & automation
├── references/    # Extended docs (optional, linked from SKILL.md)
└── assets/        # Templates, boilerplate, or design tokens
```

## 🛠️ Metadata Template

```markdown
---
name: lowercase-hyphen-case
description: |
  [250-350 characters] 
  Use when: [trigger condition 1], [trigger condition 2], or troubleshooting [specific error].
---
```

## ⚠️ Critical Checks

- **No placeholders**: No `[TODO]` or `[INSERT]`.
- **Unique IDs**: Use descriptive titles.
- **Rationals**: Provide "Why" for rigid rules.
- **Production Examples**: Document tested use cases.
