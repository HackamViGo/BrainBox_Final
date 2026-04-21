# AmbientLight

**File:** `packages/ui/src/AmbientLight.tsx`  
**Type:** Layout Decoration Component  
**Usage:** Добавя мека, цветна атмосфера зад основния интерфейс.

## Description

AmbientLight създава големи, размити градиентни "петна", които се движат едва забележимо и променят цвета си спрямо текущата тема. Този компонент придава на приложението "glassmorphism" усещане.

## Core Features

1. **Dynamic Gradients:** Използва `radial-gradient` със силен `blur` (60px - 100px).
2. **Smooth Transitions:** Всички промени в цветовата схема стават плавно чрез `framer-motion`.
3. **Low Profile:** Работи с ниско `opacity` (0.1 - 0.2), за да не пречи на четимостта на текста.

## Technical Details

- Използва `motion.div` от `framer-motion`.
- Разчита на CSS променливи за цветовете, дефинирани в основната тема.
- SSR safe, но се препоръчва dynamic import за консистенция с NeuralField.

## Last Updated

2026-04-16
