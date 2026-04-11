# Accessibility

## Съдържание
1. [WCAG Audit](#1-wcag-audit)
2. [Contrast Checks](#2-contrast-checks)
3. [ARIA Attributes](#3-aria-attributes)
4. [Screen Readers Support](#4-screen-readers-support)

---

## 1. WCAG Audit
- **Ниво A**: 70% съответствие.
- **Ниво AA**: 50% съответствие.
- **Основни цели**: Пълна поддръжка на клавиатура и подобрен контраст на метаданните.

---

## 2. Contrast Checks
| Елемент | Фон | Контраст | Статус |
|---------|-----|----------|--------|
| Бял текст | OLED Black | 21:1 | **AAA** |
| Сив текст (50%) | Glass Panel | 4.8:1 | **AA** |
| Amber текст | OLED Black | 12:1 | **AAA** |

---

## 3. ARIA Attributes
- **Roles**: `navigation` (Sidebar), `main` (Content), `dialog` (Modals).
- **States**: `aria-expanded` (Folders), `aria-hidden` (Decorations).
- **Labels**: `aria-label` за икони без текст.

---

## 4. Screen Readers Support
- **Йерархия**: Правилно използване на H1-H3 тагове.
- **Скриване**: `NeuralField` и декоративни елементи са скрити от четците.
- **Форми**: Всички инпути са свързани с етикети (Labels).
