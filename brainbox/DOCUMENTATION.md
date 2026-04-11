# Project Documentation: Nexus AI

This document provides a comprehensive overview of the technical implementation, design patterns, and architectural decisions of the Nexus AI project.

---

## 1. DESIGN SYSTEM

### 1.1 Foundations
The visual identity of Nexus AI is built on a "Neural Dark" aesthetic, prioritizing high contrast, depth through glassmorphism, and subtle ambient lighting.

### 1.2 Color Palette
| Token | HEX | Usage |
| :--- | :--- | :--- |
| **Background** | `#000000` | Primary background (OLED Black) |
| **Foreground** | `#FFFFFF` | Primary text and icons |
| **Surface** | `#050505` | Sidebar and panel backgrounds |
| **Border** | `#FFFFFF14` | Divider lines (8% opacity) |

### 1.3 AI Model Themes
Each AI model has a dedicated color token that influences the `AmbientLight` and `NeuralField` colors when active:
- **ChatGPT**: `#10a37f` (Emerald)
- **Gemini**: `#8ab4f8` (Blue)
- **Claude**: `#d97757` (Amber)
- **Grok**: `#e5e5e5` (White)
- **Perplexity**: `#22d3ee` (Cyan)
- **DeepSeek**: `#2563eb` (Blue)
- **Qwen**: `#a855f7` (Purple)

### 1.4 Glassmorphism & Matte
- **.glass-panel**: `rgba(20, 20, 20, 0.4)` | Blur: `12px` | Border: `1px solid rgba(255, 255, 255, 0.08)` | Shadow: `0 4px 30px rgba(0, 0, 0, 0.1)`
- **.glass-panel-light**: `rgba(255, 255, 255, 0.03)` | Blur: `12px` | Border: `1px solid rgba(255, 255, 255, 0.05)`
- **Matte Style**: `bg-[#050505]` (Opaque) | Използва се за чат балончета и инпути в AI Nexus за по-добра четимост. Хедърите са прозрачни за плавно сливане с фона.

### 1.5 Textures & Overlays
- **Grainy Noise**: Използва се `.bg-grain` с инлайн SVG филтър (`feTurbulence`) за добавяне на органична текстура върху градиентите. Опацитет: `0.03`.
- **Neural Fog**: Градиентно затъмнение (`from-black/40 via-transparent`) в долната част на екраните за подобряване на контраста на контролите.

### 1.6 Typography
- **Primary Interface**: `Inter` (Sans-serif) - Clean, legible, and modern.
- **Technical/Code**: `JetBrains Mono` - Used for API keys, code snippets, and metadata.

---

## 2. COMPONENTS INVENTORY

### 2.1 Core UI Elements
- **Sidebar**: `src/components/Sidebar.tsx` - Multi-modal navigation system.
- **AmbientLight**: `src/components/AmbientLight.tsx` - Dynamic glow effect that follows the active theme.
- **NeuralField**: `src/components/NeuralField.tsx` - Interactive HTML5 Canvas particle system. Режими: `brain`, `wander`, `extension`, `monochrome`.
- **ApiKeyModal**: `src/components/ApiKeyModal.tsx` - Secure configuration for third-party AI keys.
- **SmartSwitchModal**: `src/components/SmartSwitchModal.tsx` - Диалог за бърза смяна на настройки или контекст.
- **GlassNode**: `src/components/workspace/GlassNode.tsx` - Custom node for the Workspace canvas.

### 2.2 Styling Patterns
- **Glassmorphism**: `.glass-panel` uses `rgba(20, 20, 20, 0.4)` with a `12px` backdrop-blur and a subtle white border.
- **Matte Style**: Used for chat bubbles in AI Nexus (`bg-[#050505]`) to ensure maximum readability against the dynamic background.

---

## 3. PAGES & SCREENS

### 3.1 Primary Navigation
- **Dashboard**: The entry point, featuring the `brain` mode of the NeuralField.
- **Extension**: Onboarding screen for the Chrome Extension integration.
- **AI Nexus**: The central hub for AI interaction and model switching.
- **Workspace**: A visual canvas for connecting ideas and resources.

### 3.2 Resource Management
- **Library**: Управление на запазени чатове и ресурси. Поддържа филтриране по папки и тагове.
- **Prompts**: A multi-view screen for creating, refining, and organizing prompt templates.
- **Archive**: "The Vault" — място за съхранение на изтрити елементи. Поддържа концепцията за "Echoes" (временно изтрити с плавно избледняване) и "Artifacts" (перманентно замразени).
- **MindGraph**: Визуална мрежа от знания, изградена с **D3.js**. Позволява изследване на връзките между промпти и чатове чрез интерактивна симулация на сили.
- **Identity**: Потребителски профил с динамична "Identity Sphere", която променя цвета си според най-използвания AI модел. Показва "Neural Charge" (токени) и "Intelligence Tier".

---

## 4. USER FLOWS

### 4.1 Onboarding & Setup
1. **Discovery**: User enters via Dashboard and explores the Extension info.
2. **Configuration**: User navigates to Settings to input their API keys via the `ApiKeyModal`.
3. **Activation**: User selects a model in AI Nexus, which updates the global theme and enables chat functionality.

### 4.2 Content Creation
1. **Capture**: Text is captured via the extension or manual input.
2. **Refinement**: The "Refine" view in Prompts uses AI to optimize the captured text.
3. **Organization**: Finished prompts are saved into hierarchical folders in the Sidebar.

### 4.3 Knowledge Exploration (Mind Mapping)
1. **MindGraph**: Преглед на цялата мрежа от знания.
2. **Focus**: Клик върху възел за центриране и преглед на детайли.
3. **Timeline**: Използване на Timeline Explorer за преглед на състоянието на мрежата в миналото.

### 4.4 Data Retention (The Vault)
1. **Delete**: Изтриване на елемент (преместване в Echoes).
2. **Fade**: Елементът постепенно избледнява (blur/opacity) с наближаване на крайния срок.
3. **Freeze**: Ръчно "замразяване" на елемент за превръщането му в постоянен Artifact.

---

## 5. WIREFRAMES (ASCII)

### 5.1 Dashboard Layout
```text
+---------------------------------------+
| [S] |                                 |
| [I] |      NEURAL FIELD (BRAIN)       |
| [D] |                                 |
| [E] |      Your AI Second Brain       |
| [B] |         NEXUS AI PLATFORM       |
| [A] |                                 |
| [R] |              [ V ]              |
+---------------------------------------+
```

### 5.2 Workspace Canvas
```text
+---------------------------------------+
| [S] | [ASSETS] |                      |
| [I] | [ Chat ] |   ( NODE )---( NODE )|
| [D] | [ Chat ] |      |               |
| [E] | [ Prmpt] |   ( NODE )           |
| [B] |          |                      |
| [A] |          | [ CONTROLS ]         |
| [R] |          |                      |
+---------------------------------------+
```

### 5.3 Identity
```text
+---------------------------------------+
| [S] |                                 |
| [I] |          ( SPHERE )             |
| [D] |           [ USER ]              |
| [E] |                                 |
| [B] | [ TIER ] [ CHARGE ] [ SYNC ]    |
| [A] |                                 |
| [R] |                                 |
+---------------------------------------+
```

---

## 6. STATE MANAGEMENT

### 6.1 Global State (App.tsx)
The application uses a centralized state pattern in the root `App.tsx` component:
- `activeScreen`: Controls routing and conditional rendering.
- `theme`: Manages the global color scheme and ambient lighting.
- `activeModelId`: Tracks the currently selected AI model.
- `libraryFolders` / `promptFolders`: Stores the hierarchical structure of the user's data.

### 6.2 Persistence
Data is persisted in `localStorage` using the `brainbox_` prefix to ensure continuity across sessions:
- `brainbox_is_logged_in`: Статус на сесията.
- `brainbox_items_v3`: Stores all chats and prompts.
- `brainbox_folders_v3`: Stores the folder structure.
- `brainbox_retention_days`: Настройка за автоматично изтриване.
- `*_API_KEY`: Securely stores user-provided keys for different AI providers.

---

## 7. ANIMATIONS - FULL DOCUMENTATION

### 7.1 Animation Catalog

| Name/Description | Location | Trigger | Dependency | Implementation | Duration | Easing | Delay | Properties |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Transition** | `App.tsx` | Screen Change | `activeScreen` | Framer Motion | 0.5s | `easeInOut` | None | `opacity`, `y` (20 to 0) |
| **Sidebar Slide** | `Sidebar.tsx` | Toggle | `isSidebarExpanded` | Framer Motion | 0.4s | `easeOut` | None | `width`, `x` |
| **Modal Scale** | `ApiKeyModal.tsx` | Mount | `isOpen` | Framer Motion | 0.3s | `backOut` | None | `opacity`, `scale` (0.9 to 1) |
| **Neural Field Pulse** | `NeuralField.tsx` | Continuous | None | Framer Motion | 4s | `easeInOut` | Random | `opacity`, `scale` |
| **Node Hover** | `GlassNode.tsx` | Hover | Mouse Event | CSS/Tailwind | 0.2s | `ease` | None | `border-color`, `shadow` |
| **Sidebar Mode Switch** | `Sidebar.tsx` | Mode Change | `switchMode` | Framer Motion | 0.6s | `circOut` | None | `x`, `opacity`, `scale` |
| **Neural Synthesis** | `AINexus.tsx` | Generation | `isGenerating` | Framer Motion | 2s (Loop) | `linear` | None | `rotate`, `opacity` |
| **Edge Pulse** | `Workspace.tsx` | Connection | `isConnecting` | Framer Motion | 1.5s (Loop) | `easeInOut` | None | `stroke-dashoffset`, `opacity` |
| **Whisper Panel Slide** | `Workspace.tsx` | Toggle | `isWhisperOpen` | Framer Motion | 0.4s | `easeOut` | None | `x`, `opacity` |

### 7.2 Global Transitions
The application uses `AnimatePresence` in the root `App.tsx` to handle smooth exits and entrances between screens. This ensures that as one screen unmounts, it fades out while the new one slides in, preventing "jumpy" UI.

---

## 8. CONDITIONAL RENDERING

### 8.1 Authentication Logic
- **Login Screen**: Rendered if `isLoggedIn` is `false`.
- **Main App**: Rendered if `isLoggedIn` is `true`.
- **Protected Actions**: AI generation in `AINexus` and `Library` checks for the presence of an API key in `localStorage` before proceeding.

### 8.2 UI State Management
- **Sidebar Expansion**: Controls the visibility of text labels and sub-navigation items using `isSidebarExpanded`.
- **Mobile View**: Uses `isMobileSidebarOpen` to toggle a full-screen overlay menu on small screens.
- **Loading States**: 
  - `isGenerating` in `AINexus` shows the "Neural Synthesis" indicator.
  - `isLoggingIn` in `Login` shows a spinner and disables the submit button.
- **Empty States**: `Archive` and `Library` render a "The void is empty" message when no items match filters.

---

## 9. API COMMUNICATION

### 9.1 Gemini API Integration
The app communicates with Google's Gemini API via the `@google/genai` SDK.

- **Service**: `src/services/gemini.ts`
- **Endpoints**:
  - `generateContent`: Used for chat responses and text analysis.
- **Data Flow**:
  1. User enters prompt in `AINexus`.
  2. `AINexus` calls `generateGeminiResponse` with the prompt and stored API key.
  3. The response is streamed or returned as a single block and added to the local `messages` state.

### 9.2 Mock Services
- **Other Models**: GPT and Claude interactions are currently simulated in `AINexus` and `Settings` to demonstrate the UI flow.
- **Login**: The `Login` screen simulates a server request with a 1.5s delay.

---

## 10. FORMS

### 10.1 Login Form
- **Fields**: Email (type: email), Password (type: password).
- **Validation**: Basic HTML5 validation + check for empty strings.
- **Feedback**: Error messages appear above the button if the simulation "fails" (e.g., empty fields).

### 10.2 Settings Forms
- **API Keys**: Individual inputs for Gemini, OpenAI, and Claude. Keys are masked and saved to `localStorage`.
- **Retention**: A slider or dropdown to set "The Echoes" auto-delete duration.

### 10.3 Sidebar Modals
- **New Folder/Chat**: Simple text inputs with "Create" and "Cancel" actions.

---

## 11. MODALS / DIALOGS

### 11.1 Key Modals
- **ApiKeyModal**: Prompted when a user tries to use AI features without a configured key.
- **SmartSwitchModal**: A branching interface in `AINexus` for selecting model versions.
- **Workspace Context Menu**: A custom-built floating menu for adding nodes to the canvas.

### 11.2 Behavior
All modals use a backdrop blur (`backdrop-blur-md`) and are dismissible by clicking the backdrop or an "X" button, except for critical configuration steps.

---

## 12. RESPONSIVE DESIGN

### 12.1 Breakpoints
- **Mobile (< 640px)**: Sidebar becomes a hamburger menu; grid layouts stack vertically.
- **Tablet (640px - 1024px)**: Sidebar can be pinned or collapsed; content padding reduces.
- **Desktop (> 1024px)**: Full multi-column layouts; sidebar expanded by default.

### 12.2 Component Adaptations
- **Sidebar**: Switches from a side-docked panel to a bottom-sheet or full-screen overlay on mobile.
- **Workspace**: Canvas supports pinch-to-zoom and touch-drag for mobile users.

---

## 13. THEME AND STYLES

### 13.1 Color Palette (Neural Dark)
- **Background**: `bg-black` / `bg-slate-950`
- **Surface**: `bg-white/5` with `backdrop-blur-xl`
- **Primary Accent**: Cyan (`text-cyan-400`, `bg-cyan-500`)
- **Secondary Accent**: Indigo / Purple for "Quantum" features.
- **Text**: `text-white` (Primary), `text-slate-400` (Secondary).

### 13.2 Typography
- **Headings**: Serif font (e.g., Playfair Display) for "The Vault" and "Identity" to give an editorial feel.
- **UI Text**: Sans-serif (Inter) for legibility.
- **Data/Code**: Monospace (JetBrains Mono) for tokens, dates, and snippets.

---

## 14. INTERACTIONS MAP

1. **Onboarding**: `Login` -> `Dashboard`.
2. **Navigation**: `Sidebar` -> `Library` / `AINexus` / `Workspace`.
3. **AI Loop**: `AINexus` -> Prompt -> `gemini.ts` -> Response -> Save to `Library`.
4. **Organization**: `Library` -> Drag to Folder -> `Archive` (if auto-delete is on).
5. **Visual Thinking**: `Workspace` -> Add Node -> Connect -> AI Analysis.

---

## 15. ERROR HANDLING

- **API Errors**: Caught in `gemini.ts` and displayed as a toast or inline message in `AINexus`.
- **Form Errors**: Visual red borders and descriptive text in `Login` and `Settings`.
- **Fallback UI**: "The void is empty" components for missing data.

---

## 16. NEURAL FIELD (BACKGROUND SYSTEM)

### 16.1 Overview
The `NeuralField` is a high-performance HTML5 Canvas visualization that serves as the dynamic background for the entire application. It symbolizes a neural network, with particles representing neurons and lines representing synapses.

### 16.2 Dynamic Modes
The component adapts its behavior based on the `activeScreen` prop passed from `App.tsx`:

| Mode | Screen(s) | Visual Behavior |
| :--- | :--- | :--- |
| **`brain`** | Dashboard | Particles cluster in a central, brain-like organic shape using sine-wave lobe offsets. |
| **`extension`** | Extension | Particles scatter across the entire screen with an initial "kick" (velocity boost) away from the center. |
| **`wander`** | Library, Studio, Workspace, etc. | Particles are distributed randomly and move slowly towards new random targets. |
| **`monochrome`** | Archive | Speed is reduced to 25% (`speedMultiplier: 0.25`) and color is fixed to a cold gray (`#333333`). |

### 16.3 Transitions & Transactions
Transitions between modes are handled seamlessly within the `useEffect` hook of `NeuralField.tsx`:
1. **Target Recalculation**: When the `mode` changes, the `baseX` and `baseY` (target coordinates) for every existing particle are updated.
2. **Fluid Movement**: Particles do not "teleport"; they use a `returnSpeed` constant to steer towards their new targets over several frames, creating a fluid morphing effect.
3. **Mode-Specific Physics**: 
   - In `brain` mode, the `returnSpeed` is higher (0.01) to maintain the structure.
   - In `wander` mode, it's lower (0.005) for a more relaxed feel.
   - Synapse connection distance also changes (40px in `brain`, 80px in others).

### 16.4 Color & Theming
The color of the field is strictly tied to the active AI model theme:
- **Source**: `THEMES[theme].color`.
- **Syncing**: The color updates instantly when the `theme` prop changes.
- **Monochrome Override**: When `monochrome={true}` (e.g., in the Archive), the theme color is ignored in favor of a static dark gray.

### 16.5 Interactivity
- **Mouse Repulsion**: Particles are repelled by the cursor within a 150px radius. The repulsion force is calculated based on distance, creating a "magnetic" interaction.
- **Random Jitter**: A subtle random force is applied to each particle every frame to prevent a static, "frozen" look.
- **Responsive Density**: The number of particles scales based on screen width (e.g., 600 on desktop vs. 200 on mobile for `brain` mode) to ensure performance on all devices.

---

## 17. DATA PERSISTENCE

### 17.1 LocalStorage Strategy
The application uses `localStorage` to persist user data and UI preferences across sessions, as it currently lacks a dedicated backend database.

- **Folders & Items**: The entire library structure (folders and chat fragments) is stored under the `nexus_folders` and `nexus_items` keys.
- **API Keys**: Stored under `nexus_api_keys` (Gemini, OpenAI, Claude).
- **Theme & UI**: `nexus_theme`, `nexus_sidebar_expanded`, and `nexus_active_screen` are saved to maintain the user's workspace state.
- **Vault Retention**: `vault_retention_days` controls the auto-purge logic for "The Echoes".

### 17.2 Synchronization
The "Sync" feature in `Settings` is currently a UI simulation. In a production environment, this would trigger a background sync with a cloud provider (e.g., Firebase or a custom REST API).

---

## 19. SIDEBAR (NAVIGATION SYSTEM)

### 19.1 Overview
The `Sidebar` is the central navigation and resource management hub. It is a multi-modal, state-aware component that adapts its layout and content based on the user's current task and device.

### 19.2 Navigation Modes (`switchMode`)
The sidebar operates in five distinct modes, allowing it to act as both a high-level navigator and a deep resource explorer:

| Mode | Trigger | Content |
| :--- | :--- | :--- |
| **`global`** | Default / "Back" | Main app screens (Dashboard, Library, AI Nexus, etc.). |
| **`folders`** | Clicking Library/Prompts | Hierarchical folder tree for the active collection. |
| **`feathers`** | Clicking AI Nexus | Selection of AI Models (ChatGPT, Gemini, Claude, etc.). |
| **`pulse`** | Inside Feathers | Recent chat history and active threads. |
| **`workspace`** | Clicking Workspace | Combined view of Library and Prompts for drag-and-drop. |

### 19.3 State & Visibility
The sidebar's physical presence is controlled by three primary states:
- **`isExpanded`**: Triggered by hover. Temporarily reveals labels and sub-menus.
- **`isPinned`**: Locks the sidebar in the expanded state, pushing the main content area.
- **`isMobileOpen`**: A full-screen overlay mode for small devices, triggered by the hamburger menu.

### 19.4 Transitions & Animations
Mode switching uses a "Slide & Blur" transaction pattern:
1. **Directional Logic**: A `slideDirection` state (1 or -1) is calculated based on the hierarchy (e.g., going "deeper" slides right, "back" slides left).
2. **Framer Motion Variants**:
   - `enter`: Starts with `x` offset, `opacity: 0`, and `blur(10px)`.
   - `center`: Settles at `x: 0`, `opacity: 1`, and `blur(0px)`.
   - `exit`: Leaves with opposite `x` offset and increasing blur.
3. **Gesture Support**: On non-static screens, users can drag horizontally on the sidebar to switch between modes (e.g., dragging left in `global` mode opens `folders`).

### 19.5 Resource Management
- **Hierarchical Folders**: Supports infinite nesting. Folders can be toggled (`expandedFolders`) and items can be dragged between them.
- **Search**: A real-time filter in `workspace` and `folders` modes that recursively checks folder names and item titles.
- **Drag & Drop**: Items (Chats/Prompts) can be dragged from the sidebar into the `Workspace` canvas. This uses the `application/reactflow` data type.
- **Modals**: Integrated forms for creating new folders and chat fragments without leaving the current context.

### 19.6 Internal Neural Background
The sidebar contains its own instance of `NeuralField` set to `wander` mode with `monochrome` enabled and low particle density. This creates a subtle, cohesive "living" texture behind the navigation items.

---

## 21. WORKSPACE (VISUAL THINKING CANVAS)

### 21.1 Overview
The `Workspace` is a visual canvas built on `@xyflow/react` (React Flow) that allows users to map out their thoughts by connecting AI chats, prompts, and notes.

### 21.2 Core Components
- **`GlassNode`**: A custom node that represents an AI chat or prompt. It features a glass-morphism effect and displays metadata like the model used and message count.
- **`StickyNode`**: A simple, editable note node for quick thoughts.
- **`NeuralEdge`**: A custom edge with a "pulse" animation that visually connects nodes. The animation speed and color are synchronized with the active theme.
- **`WhisperPanel`**: A side panel that provides AI-driven insights and suggestions based on the current canvas structure.

### 21.3 Interactions
- **Drag-and-Drop**: Users can drag items from the `Sidebar` directly onto the canvas. The `onDrop` handler in `Workspace.tsx` parses the `application/reactflow` and `application/json` data to create new nodes at the drop position.
- **Context Menu**: A custom right-click menu allows users to add new nodes anywhere on the canvas.
- **Node Hover Effects**: Hovering over a node highlights its connected edges using a `hoveredNodeId` state and CSS filters.

---

## 22. NEURAL EXPLORER (ANALYTICS)

### 22.1 Force-Directed Graph
The `MindGraph` screen uses **D3.js** to render a force-directed graph of the user's entire knowledge base.
- **Simulation**: Uses `d3.forceSimulation` with `charge`, `link`, and `center` forces to create an organic, self-organizing structure.
- **Interactivity**: Nodes can be dragged, and clicking a node triggers a smooth zoom-to-fit transition using `d3.zoom`.

### 22.2 Intelligence Stats
- **AI Mix Matrix**: A custom SVG-based radial gauge that visualizes the distribution of AI models used by the user.
- **Efficiency Matrix**: A set of metrics (Knowledge Growth, Time Optimized, Neural Sync) that track the user's productivity.
- **Topic Heatmap**: A tag-cloud visualization where the opacity and weight of each topic are determined by its frequency in the user's data.

---

## 23. IDENTITY (USER PROFILE)

### 23.1 The Identity Sphere
A central visual element in the `Identity` screen that represents the user's "AI Fingerprint."
- **Dynamic Styling**: The sphere's colors (Emerald for GPT, Blue for Gemini, Amber for Claude) change based on the user's most used model.
- **Particle System**: A custom particle system orbits the core, with animation properties (speed, radius, size) randomized for a unique look.

### 23.2 Intelligence Tier
The user's "Tier" (Neural, Quantum, Supernova) is displayed alongside a "Neural Charge" gauge, which represents token usage/availability.

---

## 24. THE VAULT (ARCHIVE)

### 24.1 Echoes vs. Artifacts
The `Archive` screen splits data into two layers:
- **The Echoes**: Temporary items that are subject to auto-deletion based on the `retentionDays` setting.
- **The Artifacts**: Permanent items that have been "frozen" and are protected from deletion.

### 24.2 Visual Fading Effect
Items in "The Echoes" feature a dynamic `opacity` and `blur` effect. The closer an item is to its expiration date, the more it "fades" into the background. This is implemented using a `fadeRatio` calculation based on `daysLeft / retentionDays`.

---

## 25. EXTENSION (CHROME INTEGRATION)

### 25.1 Overview
The `Extension` screen serves as a landing page and onboarding guide for the Nexus AI Chrome Extension. It features a "Particle Scattering" effect in the `NeuralField` to symbolize the extension's ability to capture data from anywhere on the web.

### 25.2 Features
- **Download Link**: A direct call-to-action for users to install the extension.
- **Feature Highlights**: A grid of cards explaining the extension's capabilities (e.g., "Smart Capture", "Neural Sync").

---

## 26. LOGIN (ONBOARDING)

### 26.1 Authentication Simulation
The `Login` screen simulates a secure authentication flow with a 1.5s delay to mimic server-side verification.

### 26.2 Exit Animation
When the user successfully logs in, the screen performs a high-impact exit animation:
- **Scale**: The login panel scales up to `1.2`.
- **Blur**: A heavy `20px` blur is applied.
- **Opacity**: The screen fades out smoothly over `0.8s`.
- **Main App Entrance**: Simultaneously, the main application (Sidebar and Content) transitions from a blurred, scaled-down state to its full, clear state.

---

## 27. PERFORMANCE

- **Code Splitting**: Handled automatically by Vite for each screen.
- **State Persistence**: `localStorage` is used for non-sensitive UI states to prevent layout shifts on reload.
- **Animation Optimization**: Uses `layout` prop in Framer Motion to handle complex list reordering without expensive DOM operations.
- **Asset Loading**: Icons are loaded on demand via `lucide-react`.
