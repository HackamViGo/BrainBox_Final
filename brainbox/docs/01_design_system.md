# Design System

## Съдържание
1. [Foundations](#1-foundations)
2. [Color Tokens](#2-color-tokens)
3. [Typography Scale](#3-typography-scale)
4. [Spacing & Grid](#4-spacing--grid)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Borders & Radius](#6-borders--radius)
7. [Motion & Animations](#7-motion--animations)
8. [Iconography](#8-iconography)

---

## 1. Foundations
**Последна актуализация**: 28 март 2026
**Версия**: 1.5.0

### Описание
Основни визуални градивни елементи на BrainBox Extension — цветове, шрифтове и отстояния.

### Цветове
| Име | HEX | Употреба |
|-----|-----|----------|
| **Background** | #000000 | Основен фон (OLED Black) |
| **Foreground** | #FFFFFF | Основен текст и икони |
| **Surface** | #050505 | Фон на Sidebar и панели |
| **Border** | #FFFFFF14 | Разделителни линии (8% opacity) |

### Тематични цветове (AI Модели)
| Модел | HEX |
|-------|-----|
| **ChatGPT** | #10a37f |
| **Gemini** | #8ab4f8 |
| **Claude** | #d97757 |
| **Grok** | #e5e5e5 |
| **Perplexity** | #22d3ee |
| **DeepSeek** | #2563eb |
| **Qwen** | #a855f7 |

### Glassmorphism & Matte
- **.glass-panel**: `rgba(20, 20, 20, 0.4)` | Blur: `12px` | Border: `1px solid rgba(255, 255, 255, 0.08)` | Shadow: `0 4px 30px rgba(0, 0, 0, 0.1)`
- **.glass-panel-light**: `rgba(255, 255, 255, 0.03)` | Blur: `12px` | Border: `1px solid rgba(255, 255, 255, 0.05)`
- **Matte Style**: `bg-[#050505]` (Opaque) | Използва се за чат балончета и инпути в AI Nexus за по-добра четимост. Хедърите са прозрачни за плавно сливане с фона.

### Textures & Overlays
- **Grainy Noise**: Използва се `.bg-grain` с инлайн SVG филтър (`feTurbulence`) за добавяне на органична текстура върху градиентите. Опацитет: `0.03`.
- **Neural Fog**: Градиентно затъмнение (`from-black/40 via-transparent`) в долната част на екраните за подобряване на контраста на контролите.

---

## 2. Color Tokens
### Semantic Tokens
| Token | Стойност | Употреба |
|-------|----------|----------|
| **bg-primary** | #000000 | Основен фон |
| **text-primary** | #FFFFFF | Основен текст |
| **text-secondary** | #FFFFFF80 | Вторичен текст (50%) |
| **border-primary** | #FFFFFF14 | Основна рамка (8%) |

### Dynamic Theme Tokens (CSS Variables)
Приложението динамично инжектира цветове според избрания модел:
- `--theme-color`: Основен цвят на активния модел (напр. `#10a37f` за ChatGPT).
- `--theme-glow`: Използва се в `AmbientLight` за създаване на фоново сияние.

---

## 3. Typography Scale
### Font Families
- **Primary**: `Inter`, sans-serif (Основен интерфейс)
- **Monospace**: `JetBrains Mono` (Код, API ключове)

### Type Scale
| Token | Size (px) | Usage |
|-------|-----------|-------|
| **text-[9px]** | 9px | Етикети в Timeline Explorer |
| **text-[10px]** | 10px | Метаданни, моноширинни етикети |
| **text-xs** | 12px | Малки описания |
| **text-sm** | 14px | Основен текст |
| **text-base** | 16px | Бутони, инпути |
| **text-lg** | 18px | Подзаглавия в карти |
| **text-2xl** | 24px | Заглавия на страници |
| **text-4xl** | 36px | Hero заглавия в Dashboard |

---

## 4. Spacing & Grid
Използва се 4px базова единица (Tailwind scale).
- **4 (16px)**: Padding на карти.
- **6 (24px)**: Padding на големи панели.
- **8 (32px)**: Отстояния между секции.

---

## 5. Elevation & Shadows
В BrainBox дълбочината се постига чрез **Glassmorphism** и **Z-index**, а не чрез традиционни сенки.
- **Level 1**: NeuralField (Background)
- **Level 2**: AmbientLight (Glow)
- **Level 3**: Glass Panels (Content)
- **Level 4**: Modals & Tooltips (Overlay)

---

## 6. Borders & Radius
- **Border Width**: `1px` (стандарт за всички панели).
- **Border Opacity**: 5% до 15% бяло.
- **Border Radius**:
  - `rounded-xl` (12px): Бутони, инпути.
  - `rounded-2xl` (16px): Карти.
  - `rounded-3xl` (24px): Големи контейнери.

---

## 7. Motion & Animations
Използва се `motion/react` (Framer Motion).

### Patterns
- **Page Transitions**: Fade + Slide Up (0.5s, `easeInOut`).
- **Hover Scale**: `whileHover={{ scale: 1.02 }}` за карти.
- **Tap Scale**: `whileTap={{ scale: 0.98 }}` за бутони.
- **Neural Edge**: 
  - `dashdraw` keyframes: `stroke-dashoffset` от 100 до 0.
  - Стандартна: 2s linear.
  - Бърза (`.neural-edge-path-fast`): 0.5s linear.
- **Identity Pulse**: Безкрайна анимация на мащаба и опацитета за "живи" елементи.

---

## 8. Iconography
Използва се `lucide-react`.
- **Размер**: 16px (w-4) или 20px (w-5).
- **Stroke Width**: 2px.
- **Стил**: Минималистичен, контурен.
