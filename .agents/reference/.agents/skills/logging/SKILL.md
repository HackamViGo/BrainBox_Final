---
name: logging
description: "Phase logging and runtime logging rules."
---

## Phase Logging
Use `node scripts/update-log.js` for every phase:
- `start <ID> <NAME> <PHASE>`
- `mcp-gate <ID> <RESULT> <NOTES>`
- `finish <ID> <SUMMARY>`

## Runtime Logger
Use `@brainbox/utils/logger`:
- `logger.info(context, message, data)`
- `logger.error(context, error, data)`
- **Forbidden:** `console.log`, `console.error`.

## Log Index
`ops/logs/INDEX.json` is the source of truth for project progress.
