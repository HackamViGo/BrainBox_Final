# BrainBox Monorepo

Agentic AI Library and Neural Dashboard.

## Architecture

- **apps/web-app**: Next.js 16.2 Dashboard & Neural Engine.
- **apps/extension**: Chrome Extension (MV3) for AI platform capture.
- **packages/types**: Shared Zod schemas and TypeScript models.
- **packages/utils**: Centralized logging, error handling, and helpers.
- **packages/ui**: Shared BrainBox component library.

## Getting Started

1. **Install Dependencies**: 
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and configure your Supabase and Gemini keys.

3. **Development**:
   ```bash
   pnpm dev
   ```

4. **Testing**:
   ```bash
   pnpm test
   ```

5. **Build**:
   ```bash
   pnpm build
   ```

## Documentation

- [Progress Tracking](docs/PROGRESS.md)
- [Architectural Decisions (ADR)](docs/DECISIONS.md)
- [Dependency Graph](docs/GRAPH.json)
