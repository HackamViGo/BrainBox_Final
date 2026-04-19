---
name: shadcn-ui
description: "shadcn/ui component patterns and integration with Tailwind v4."
---

# shadcn/ui Standards

## 1. Component Location

- Components reside in `apps/web-app/components/ui/` or `packages/ui/src/components/`.

## 2. Philosophy

- Do NOT use shadcn for core BrainBox visuals (NeuralField, AmbientLight).
- Use shadcn for: Buttons, Dialogs, Tooltips, Accordions, and Forms to ensure accessibility (Radix-based).

## 3. Styling

- Custom shadcn themes must be defined in `globals.css` using the `@theme` block in Tailwind v4.
- Avoid modifying the base `ui` components directly unless necessary for BrainBox branding.
