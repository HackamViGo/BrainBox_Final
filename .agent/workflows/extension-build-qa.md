# Workflow: Extension Build & QA

Verify extension integrity before release.

## Steps

1. **Build**: Run `pnpm --filter extension build` (Vite 8 + CRXJS).
2. **Manifest Check**: Ensure `manifest.json` matches MV3 spec and has correct permissions.
3. **CSP Audit**:
   - Check `manifest.json` for strict CSP.
   - Ensure no external scripts/styles are imported.
4. **Manual QA**:
   - Load as unpacked in Chrome.
   - Verify Context Menus appear on ChatGPT/Claude.
   - Verify Sync to local dev Dashboard.
5. **E2E**: Run Playwright tests on the loaded extension artifact.

## Criteria

- [ ] Successful build with Vite 8.
- [ ] No CSP warnings in Chrome.
- [ ] Extension -> Dashboard API communication verified.
