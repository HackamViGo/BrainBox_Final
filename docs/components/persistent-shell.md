# PersistentShell

**File:** `apps/web-app/components/PersistentShell.tsx`  
**Type:** Layout Wrapper / Root Orchestrator  
**Store dependencies:** useAppStore

## Description

Най-важният структурен и функционален компонент, който обвива цялото приложение. Той се грижи за това фоновите ефекти, навигацията и глобалните състояния да останат непроменени при навигация между екраните.

## Responsibilities

1. **Background Rendering:** Управлява глобалните инстанции на `NeuralField` и `AmbientLight`.
2. **Theme Management:** Изчислява `effectiveTheme` (`hoverTheme ?? theme`) и го прилага към фоновите ефекти.
3. **Screen Switching:** Рендира активния екран (`Dashboard`, `Library` и др.) с анимирани преходи.
4. **Hydration Protection:** Показва Initial Loading екран, докато Zustand store-овете се хидратират от хранилището.
5. **Modals Host:** Място за рендиране на всички глобални модали (`NewChatModal`, `ApiKeyModal`, `SmartSwitchModal`).

## Visual Hierarchy (Z-Index)

1. `NeuralField` / `AmbientLight` (Най-отдолу)
2. Main Content Screens
3. `Sidebar`
4. Modal Overlays (Най-отгоре)

## Last Updated

2026-04-16
