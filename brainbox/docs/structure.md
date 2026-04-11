# BrainBox - Project Structure & Architecture

This document serves as a guide for AI agents and developers to understand the architecture, state management, and future integration points of the BrainBox application.

## 📁 Directory Structure

```text
src/
├── components/       # Reusable UI components (Buttons, Modals, Cards, Sidebar)
├── screens/          # Main page views (Dashboard, Library, Workspace, etc.)
├── types/            # TypeScript interfaces and global types
├── App.tsx           # Main application entry point and router
├── index.css         # Tailwind CSS entry and global styles
├── main.tsx          # React DOM rendering
└── services/         # External API integrations (Gemini, etc.)
```

## 🖥️ Screens & Routing

The application uses a state-based router (`activeScreen` in `App.tsx`) to navigate between the following screens:

1. **Dashboard (`/src/screens/Dashboard.tsx`)**
   - The landing page featuring the "Neural Core" visualization.
   - Uses `NeuralField` in `brain` mode.

2. **AI Nexus (`/src/screens/AINexus.tsx`)**
   - The central hub for AI interaction.
   - Allows switching between different AI "minds" (ChatGPT, Gemini, Claude, etc.).
   - Updates the global application theme based on the selected model.

3. **Workspace (`/src/screens/Workspace.tsx`)**
   - A visual thinking canvas built with React Flow.
   - Supports drag-and-drop of resources from the Sidebar.
   - Features custom nodes (`GlassNode`, `StickyNode`) and animated edges (`NeuralEdge`).

4. **Library (`/src/screens/Library.tsx`)**
   - Management of saved chat sessions and resources.
   - Supports filtering by model and hierarchical folder navigation.

5. **Prompts (`/src/screens/Prompts.tsx`)**
   - A dedicated space for prompt engineering.
   - Includes a "Refine" tool for AI-powered prompt optimization.

6. **MindGraph (`/src/screens/MindGraph.tsx`)**
   - A D3.js powered force-directed graph of the user's knowledge network.
   - Includes analytics like "AI Mix Matrix" and "Topic Heatmap".

7. **Identity (`/src/screens/Identity.tsx`)**
   - User profile and personalization screen.
   - Features the "Identity Sphere" and "Neural Charge" metrics.

8. **Archive (`/src/screens/Archive.tsx`)**
   - "The Vault" for deleted or frozen items.
   - Implements the "Echoes" (fading) and "Artifacts" (frozen) storage logic.

9. **Extension (`/src/screens/Extension.tsx`)**
   - Onboarding and information page for the Chrome Extension.
   - Uses `NeuralField` in `extension` (scattering) mode.

10. **Settings (`/src/screens/Settings.tsx`)**
    - Global configuration for API keys, language, and data management.

11. **Login (`/src/screens/Login.tsx`)**
    - Secure authentication portal with high-impact transitions.

## 🧠 Core Components

- **`NeuralField`**: The interactive background/visualization. Adapts its mode (`brain`, `wander`, `extension`, `monochrome`) based on the active screen.
- **`Sidebar`**: The multi-modal navigation system. Supports pinning, expansion, and 5 distinct content modes.
- **`AmbientLight`**: Dynamic background lighting that reacts to the selected theme.

## 🔌 Future Integrations

1. **Database Integration**:
   - Replace `localStorage` persistence with a real backend (e.g., Firebase or Supabase).
   - Recommended schema: `User`, `Folder`, `Item` (Chat/Prompt), `Settings`.

2. **Authentication**:
   - Replace the simulated login with a real Auth provider (OAuth, JWT).

3. **State Management**:
   - For complex state (like the Workspace canvas), consider adding Zustand or Redux to avoid prop drilling from `App.tsx`.
