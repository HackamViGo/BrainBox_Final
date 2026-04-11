# Components

## Съдържание
1. [Inventory](#1-inventory)
2. [Buttons](#2-buttons)
3. [Inputs & Forms](#3-inputs--forms)
4. [Modals & Dialogs](#4-modals--dialogs)
5. [Navigation (Sidebar)](#5-navigation-sidebar)
6. [Cards & Containers](#6-cards--containers)
7. [Custom Components](#7-custom-components)

---

## 1. Inventory
| Име | Път | Описание |
|-----|-----|----------|
| **Sidebar** | `src/components/Sidebar.tsx` | Централна навигация с лимит от 3 елемента на папка. |
| **AmbientLight** | `src/components/AmbientLight.tsx` | Фоново осветление. |
| **NeuralField** | `src/components/NeuralField.tsx` | Интерактивен фон с частици. Режими: `brain`, `wander`, `extension`, `monochrome`. |
| **ApiKeyModal** | `src/components/ApiKeyModal.tsx` | Конфигурация на ключове. |
| **SmartSwitchModal** | `src/components/SmartSwitchModal.tsx` | Диалог за бърза смяна на настройки или контекст. |
| **GlassNode** | `src/components/workspace/GlassNode.tsx` | Workspace възел с Glassmorphism стил. |

---

## 2. Buttons
Бутоните са дефинирани чрез Tailwind класове:
- **Primary**: `bg-white text-black font-semibold hover:bg-white/90`
- **Ghost**: `bg-white/5 border border-white/10 hover:bg-white/10`
- **Danger**: `border-red-500/30 text-red-400 hover:bg-red-500/10`

---

## 3. Inputs & Forms
- **Text Input**: `bg-black/40 border border-white/10 rounded-lg focus:border-amber-400/50`
- **Toggle**: Анимиран плъзгач за настройки.
- **Validation**: Визуална обратна връзка чрез икони (`CheckCircle2`).

---

## 4. Modals & Dialogs
Използват `AnimatePresence` за анимации.
- **ApiKeyModal**: Управление на ключове за OpenAI, Google, Anthropic и др.
- **New Folder/Chat**: Диалози в Sidebar за организация.

---

## 5. Navigation (Sidebar)
`Sidebar.tsx` поддържа 5 режима (`switchMode`):
1. **Global**: Основно меню.
2. **Folders**: Библиотека/Промпти (с лимит от 3 видими елемента и скрол).
3. **Feathers**: AI Модели.
4. **Pulse**: История.
5. **Workspace**: Ресурси за платното.

### Sidebar States
- **isExpanded**: Ховър състояние за разкриване на етикети.
- **isPinned**: Персистентно състояние, което измества основното съдържание.
- **slideDirection**: Контролира посоката на анимацията при смяна на режима.

---

## 6. Cards & Containers
- **.glass-panel**: Основен контейнер с blur и border.
- **Matte Containers**: `bg-[#050505]` без рамки за чат балончета. Хедърите са прозрачни.
- **Dashboard Hero**: Центриран контейнер с анимация на текста.
- **Settings Section**: Групирани карти с настройки.
- **Folder Scroll**: Автоматичен скрол при повече от 3 елемента в папка.

---

## 7. Custom Components
- **NeuralField**: HTML5 Canvas ефект. Режими: `brain` (Dashboard), `wander` (Global) и `extension` (Extension Screen).
- **AmbientLight**: CSS Glow ефект, променящ позицията си според темата (ChatGPT, Gemini и т.н.).
- **GlassNode**: Custom React Flow възел с Glassmorphism стил.
