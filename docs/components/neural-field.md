# NeuralField

**File:** `packages/ui/src/NeuralField.tsx`  
**Type:** High-performance Canvas Component  
**Usage:** Глобален фон на приложението, подчертаващ технологичната му същност.

## Description

NeuralField е централен визуален елемент, който рендира динамична мрежа от частици (neural network), реагираща на движенията на мишката и промяната на състоянието на приложението.

## Core Features

1. **Modes:**
   - `brain`: Центрирана, гъста мрежа за Dashboard.
   - `wander`: Хаотично, плавно движение за Library и Prompts.
   - `grid`: Структурирана решетка за Settings.
   - `extension`: Линейно движение, имитиращо поток на информация.
2. **Theming:** Цветът на частиците и линиите се променя динамично спрямо активната тема (`emerald`, `blue`, `orange`, `gray`, `amber`).
3. **Interactivity:** Частиците се отблъскват или привличат от курсора на мишката.

## Technical Details

- **Rendering:** Използва HTML5 Canvas API чрез `requestAnimationFrame`.
- **Performance:** Оптимизиран за 60FPS чрез кеширане на цветове и минимално количество обекти.
- **Dynamic Imports:** Винаги трябва да се импортира с `dynamic(() => import(...), { ssr: false })` поради използване на `window` и `canvas`.

## Example

```tsx
<NeuralField
  mode="wander"
  theme="blue"
  particleCount={50}
  speedMultiplier={1}
/>
```

## Known Limitations

- При смяна на табове е важно компонентът да не се unmount-ва, за да не се губи визуалния континуитет.

## Last Updated

2026-04-16
