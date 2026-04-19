---
name: logging
description: "Load when writing any log, creating logger.ts, or writing phase log entries. Never use console.log."
---

## Rules

- Zero `console.log/error/warn/debug` in source — use `logger.ts` only
- `DEBUG_MODE=false` in `.env.production`
- Every phase MUST call `update-log.js start` before work begins
- Every async error path MUST call `logger.error`

## logger.ts API

```typescript
// In web-app (apps/web-app/):
import { logger } from "@/lib/logger";

// In packages (packages/utils/):
import { logger } from "@brainbox/utils";

logger.debug("ModuleName", "Message", { optional: "context" });
logger.info("ModuleName", "Something happened");
logger.warn("ModuleName", "Possible issue", details);
logger.error("ModuleName", "Failed to do X", error);
```

## Implementation (`packages/utils/src/logger.ts`)

```typescript
const DEBUG =
  typeof process !== "undefined" ? process.env["DEBUG_MODE"] === "true" : false;

type Level = "debug" | "info" | "warn" | "error";

function log(
  level: Level,
  module: string,
  message: string,
  data?: unknown,
): void {
  if (level === "debug" && !DEBUG) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    module,
    message,
    ...(data ? { data } : {}),
  };
  if (DEBUG) {
    if (level === "error") console.error(JSON.stringify(entry));
    else console.log(JSON.stringify(entry));
  }
  // Production: send errors to Sentry via monitoring.ts
}

export const logger = {
  debug: (m: string, msg: string, d?: unknown) => log("debug", m, msg, d),
  info: (m: string, msg: string, d?: unknown) => log("info", m, msg, d),
  warn: (m: string, msg: string, d?: unknown) => log("warn", m, msg, d),
  error: (m: string, msg: string, d?: unknown) => log("error", m, msg, d),
};
```

## Phase Logging

> ℹ️ Phase logging scripts live in `scripts/` at monorepo root.

```bash
# Log current phase progress (optional tooling)
node scripts/update-log.js start    LOG-003 "dashboard-ui" "PHASE-3"
node scripts/update-log.js log      LOG-003 info "Migrating AmbientLight component"
node scripts/update-log.js log      LOG-003 warn "Found localStorage usage in Settings"
node scripts/update-log.js finish   LOG-003 "UI migration complete."
node scripts/update-log.js fail     LOG-003 "Build failed — missing peer dep"
node scripts/update-log.js status   # human-readable overview
```

## Anti-patterns

```typescript
❌ console.log('data:', data)
❌ console.error('failed:', err)
❌ catch (_) {}           // empty catch
❌ Starting a phase without update-log.js start
```
