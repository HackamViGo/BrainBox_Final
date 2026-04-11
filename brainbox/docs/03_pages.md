# Pages

## Съдържание
1. [Dashboard](#1-dashboard)
2. [Extension Info](#2-extension-info)
3. [Prompts Library](#3-prompts-library)
4. [Settings](#4-settings)
5. [AI Nexus](#5-ai-nexus)
6. [Workspace](#6-workspace)
7. [Library, MindGraph, Archive, Identity](#7-other-screens)
8. [Login Screen](#8-login-screen)

---

## 1. Dashboard
**Файл**: `src/screens/Dashboard.tsx`
- **Описание**: Начален екран с NeuralField в режим `brain`.
- **Интеракции**: Скрол надолу води към Extension Info.

---

## 2. Extension Info
**Файл**: `src/screens/Extension.tsx`
- **Описание**: Информация за Chrome разширението и линк за изтегляне. NeuralField в режим `extension` (разпръснати частици).
- **Елементи**: Download Card с икона `Puzzle`.
- **Интеракции**: Скрол нагоре връща към Dashboard.

---

## 3. Prompts Library
**Файл**: `src/screens/Prompts.tsx`
- **Под-изгледи**:
  - **Hub**: Prompt of the Day + Gateways.
  - **Frameworks**: 7x7 матрица от структури.
  - **Refine**: AI оптимизатор със 7 "Кристала".
  - **Saved**: Списък с промпти, филтрирани по папка.

---

## 4. Settings
**Файл**: `src/screens/Settings.tsx`
- **Секции**: API Configuration, General (Language, Auto-sync), Data Management (Export/Clear).

---

## 5. AI Nexus
**Файл**: `src/screens/AINexus.tsx`
- **Описание**: Център за избор на активен модел. Променя глобалната тема на приложението.
- **Дизайн**: Използва **Matte Style** за чат балончетата и инпута. Хедърът е прозрачен за безшевен преход към диалоговия поток.
- **Модели**: ChatGPT, Gemini, Claude, Grok, Perplexity, DeepSeek, Qwen.

---

## 6. Workspace
**Файл**: `src/screens/Workspace.tsx`
- **Описание**: Визуално платно (React Flow) за организиране на идеи.
- **Функции**: Drag & Drop от Asset Library, NeuralEdges, StickyNodes.

---

## 7. Other Screens
- **Library**: Управление на запазени чатове и ресурси. Поддържа филтриране по папки и тагове.
- **MindGraph**: Визуална мрежа от знания, изградена с **D3.js**. Позволява изследване на връзките между промпти и чатове чрез интерактивна симулация на сили.
- **Archive**: "The Vault" — място за съхранение на изтрити елементи. Поддържа концепцията за "Echoes" (временно изтрити с плавно избледняване) и "Artifacts" (перманентно замразени).
- **Identity**: Потребителски профил с динамична "Identity Sphere", която променя цвета си според най-използвания AI модел. Показва "Neural Charge" (токени) и "Intelligence Tier".

---

## 8. Login Screen
**Файл**: `src/screens/Login.tsx`
- **Описание**: Екран за автентикация с фокус върху идентичността и сигурността.
- **Дизайн**: Бруталистичен стил с Glassmorphism ефекти. Показва Dashboard на заден план със силно замъгляване (blur).
- **Функции**: Полета за имейл и парола, симулирана анимация на зареждане, запазване на сесията в `localStorage`.
- **Интеракции**: При успешно логване се задейства "zoom-out" анимация, която разпада логин формата и плавно фокусира Dashboard-а отзад.
