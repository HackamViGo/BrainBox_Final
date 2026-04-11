# Interactions

## Съдържание
1. [Hover Effects](#1-hover-effects)
2. [Click & Tap Actions](#2-click--tap-actions)
3. [Drag & Drop Logic](#3-drag--drop-logic)
4. [Keyboard Navigation](#4-keyboard-navigation)
5. [Gestures & Touch](#5-gestures--touch)

---

## 1. Hover Effects
- **Glass Glow**: Промяна на прозрачността и рамката на `glass-panel`.
- **Matte Focus**: Лека промяна на цвета на `bg-[#050505]` при фокус или ховър за интерактивни елементи.
- **Sidebar Expansion**: Автоматично разширяване при `onMouseEnter`.
- **Icon Scale**: `group-hover:scale-110` за навигационни икони.
- **Matrix Highlight**: 3D ефект и сияние в 7x7 матрицата.

---

## 2. Click & Tap Actions
- **Screen Navigation**: Смяна на `activeScreen` с плавна транзиция (Fade + Slide Up).
- **Theme Switch**: Промяна на `theme` в AI Nexus (мигновена актуализация на AmbientLight и NeuralField).
- **Sidebar Mode Switch**: Използва "Slide & Blur" транзакция. Посоката на плъзгане зависи от йерархията (навътре/навън).
- **Micro-interactions**: `whileTap={{ scale: 0.95 }}` за физическо усещане.
- **Neural Synthesis**: Анимация на въртене и пулсиране в AI Nexus по време на генериране на отговор.

---

## 3. Drag & Drop Logic
- **Workspace Canvas**: Централното място за пускане на обекти.
- **Source**: Sidebar (Library/Prompts). Елементите могат да се влачат само към Workspace.
- **Target**: React Flow Canvas (`onDrop` изчислява координати и създава възел). Използва `application/reactflow` MIME тип.
- **Restriction**: Влаченето на елементи между папки в Sidebar е деактивирано в полза на Workspace интеграцията.

---

## 4. Keyboard Navigation
- **Tab**: Навигация през интерактивни елементи.
- **Escape**: Затваряне на модали.
- **Shortcuts (Planned)**: `Cmd+K` за търсене, `Alt+1-5` за смяна на екрани.

---

## 5. Gestures & Touch
- **Vertical Swipe**: Навигация между Dashboard и Extension (с визуален ефект на разпръскване на частиците).
- **Horizontal Swipe**: Смяна на режимите на Sidebar.
- **Pinch to Zoom**: Мащабиране в Workspace (React Flow).
