# Assets

## Съдържание
1. [Images & Icons](#1-images--icons)
2. [Fonts](#2-fonts)
3. [External Libraries](#3-external-libraries)

---

## 1. Images & Icons
- **Icons**: Използва се `lucide-react` (LayoutGrid, Library, Sparkles, Zap, Puzzle, Settings).
- **Images**: Приложението не използва растерни изображения. Всичко е SVG, Canvas или CSS Gradients.
- **Noise**: SVG филтър за "grain" ефект върху фона.

---

## 2. Fonts
- **Inter (Sans-serif)**: Основен шрифт (300 до 900 weight).
- **JetBrains Mono (Monospace)**: Технически данни и API ключове.
- **Tailwind Config**:
  ```css
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  ```

---

## 3. External Libraries
- **React 19**: UI Framework.
- **Tailwind CSS 4**: Styling.
- **motion/react**: Animations.
- **@xyflow/react**: Workspace Graph.
- **@google/genai**: Gemini AI SDK.
