# UI Changelog

## [1.5.0] - 2026-03-28
### Added
- Matte UI Style: Replaced glassmorphism with matte, opaque backgrounds for chat bubbles, input areas, and headers in AI Nexus for better readability.
- Dynamic NeuralField: Background animation now syncs its mode and color with the active screen and selected AI model.
- Transparent MindGraph: NeuralField is now visible behind the Mind Graph explorer.

### Changed
- Mobile Header Refinement: Simplified mobile header to be transparent and blend with the background, removing redundant text and borders.
- Sidebar Centering: Fixed icon centering in collapsed sidebar state by optimizing text label transitions.
- Header Blending: Removed background and borders from AI Nexus header to create a seamless transition with the dialogue flow and NeuralField background.

## [1.4.0] - 2026-03-24
### Added
- Login Transition: Added a zoom-out/disintegrate transition upon successful login.
- Login Background: Login screen now shows the Dashboard behind it with a blur effect.

## [1.3.0] - 2026-03-24
### Added
- Login Screen: New brutalist/glassmorphism authentication screen with simulated session initialization.
- Persistent Session: Added `isLoggedIn` state persisted in `localStorage`.

### Fixed
- Drag & Drop: Fixed missing `draggable` attributes on root-level sidebar items in Workspace mode.

## [1.2.0] - 2026-03-24
### Changed
- Restricted Drag & Drop: Sidebar items are now only droppable into the Workspace canvas. Internal sidebar reorganization via drag-and-drop has been disabled to focus on the Workspace integration.

## [1.1.0] - 2026-03-24
### Added
- New `extension` mode for `NeuralField` with particle scattering effect.
- Scrollable item lists in Sidebar folders (max 3 visible items).
- Smooth transition between `brain` and `extension` modes in `NeuralField`.

## [1.0.0] - 2026-03-21
### Added
- Initial UI architecture with React 19 and Tailwind 4.
- Sidebar with 5 modes and folder management.
- NeuralField background effect.
- Dashboard, Library, Prompts, AI Nexus, Workspace, Settings screens.
- Glassmorphism design system.
- Gemini API integration for prompt refinement.
- React Flow integration for Workspace.

### Changed
- Refined folder structure for better scalability.
- Updated theme colors for all 8 supported AI models.

### Fixed
- Sidebar z-index issues on mobile.
- AmbientLight positioning logic.
