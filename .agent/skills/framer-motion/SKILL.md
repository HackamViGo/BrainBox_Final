---
name: framer-motion
description: "Framer Motion (motion/react) animation standards."
---

# Framer Motion Standards

## 1. Package Usage

- **MANDATORY**: Use `motion/react` instead of `framer-motion`.
- Import: `import { motion, AnimatePresence } from 'motion/react'`.

## 2. Animation Patterns

- Use **layout animations** for fluid grid/list changes.
- Wrap dynamic screen components in `AnimatePresence` if mounting/unmounting (though BrainBox prefers state-based persistent shell).

## 3. Performance

- Use `whileHover` and `whileTap` for micro-interactions.
- Keep `transition` durations between 0.2s and 0.5s for a premium feel.
