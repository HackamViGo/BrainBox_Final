---
name: error-handling
description: "AppError and Error Codes."
---

## AppError
```typescript
throw new AppError(ErrorCodes.AUTH_INVALID_CREDENTIALS, { detail: '...' });
```
- Ranges: 1000 (Auth), 2000 (Chat), 5000 (Sync), 9000 (System).
