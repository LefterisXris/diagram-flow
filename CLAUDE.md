# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**DiagramFlow** - Build, Simulate, Visualize

DiagramFlow is an interactive flow diagram tool for developers and architects. Create system diagrams with conditional logic, define example cases with real data, and simulate how data flows through your system step-by-step.

**Current Progress**: 60% Complete (Phases 0-5 Done, 6-9 Remaining)

**Implemented Features** (Phases 0-5):
- ✅ Interactive flow diagrams with drag & drop
- ✅ Multiple node types (Service, Database, Client, Decision, Generic)
- ✅ Rich metadata support (descriptions, tags, owners, links, status, version)
- ✅ Icon library with 700+ Lucide icons
- ✅ Conditional branching with decision nodes
- ✅ Conditional edges with expression evaluation (expr-eval)
- ✅ Example case manager (create, edit, delete test cases)
- ✅ Flow simulation engine with step-by-step execution
- ✅ Playback controls (play, pause, step, reset, speed 0.5x-3x)
- ✅ Real-time path highlighting (active, past, upcoming nodes/edges)
- ✅ Pulsing animations for active nodes
- ✅ Session management with cookies
- ✅ Save/load multiple diagrams
- ✅ VCS-friendly JSON export/import
- ✅ Mermaid flowchart import
- ✅ Dark/light theme system
- ✅ Auto-save with 30-second debounce
- ✅ 100% client-side (no backend server)

**Coming Soon** (Phases 6-9):
- 🔜 Data transformation tracking
- 🔜 Data inspector panel with diff view
- 🔜 Conditional evaluation display
- 🔜 Multiple case comparison
- 🔜 Pet Clinic template for onboarding
- 🔜 Advanced search and validation
- 🔜 Export formats (PNG, SVG, HTML)

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Implementation Workflow

**IMPORTANT**: When asked to "implement phase X step Y", follow this workflow:

### Step 1: Read the Implementation Template

Read the corresponding implementation template file:
- File naming: `implementation-phase0X-stepYY.md`
- Examples: `implementation-phase00-step01.md`, `implementation-phase03-step06.md`

**If the template file does not exist, DO NOT proceed. Inform the user that the template is missing.**

### Step 2: Follow Template Instructions

The template contains:
1. Related architect.md sections to read
2. Specific requirements from architect.md
3. Implementation steps from plan.md
4. Verification checklist
5. Reference files (if applicable)

### Step 3: Execute Implementation

1. Read all referenced sections from architect.md
2. Read the corresponding section from plan.md
3. Implement exactly as specified
4. Use C:\Development\Code\system-design-visualizer ONLY as reference (never modify)
5. Update tasks.md as you complete each sub-task

### Step 4: Verify & Report

1. Complete all verification checklist items from the template
2. Mark all tasks as completed in tasks.md
3. Provide summary of implementation

### Example Usage

User: "implement phase 0 step 1"

1. Read `implementation-phase00-step01.md`
2. Follow all instructions in the template
3. Read architect.md Section 11.1 (as specified in template)
4. Read plan.md Phase 0 Step 1
5. Implement the project setup
6. Verify all checklist items
7. Report completion

## Reference Project

**Location**: C:\Development\Code\system-design-visualizer

**Usage**: This is the **reference project** for theme system, React Flow setup, and component patterns.

**CRITICAL**:
- Use ONLY as reference (read files for examples)
- NEVER modify files in the reference project
- Copy/adapt code to DiagramFlow project

**Key Reference Files**:
- `src/themes/index.js` - Theme definitions
- `src/contexts/ThemeContext.jsx` - Theme provider
- `src/components/ThemeToggle.jsx` - Theme toggle button
- `src/components/CustomNodes.jsx` - Node styling examples

## Project Structure

```
diagramflow/
├── src/
│   ├── components/               # React components
│   │   ├── nodes/               # Custom node types (5 types)
│   │   │   ├── GenericNode.jsx
│   │   │   ├── ServiceNode.jsx
│   │   │   ├── DatabaseNode.jsx
│   │   │   ├── ClientNode.jsx
│   │   │   └── DecisionNode.jsx
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Left tool panel with tabs
│   │   ├── Canvas.jsx           # React Flow canvas
│   │   ├── ThemeToggle.jsx      # Theme switcher
│   │   ├── IconPicker.jsx       # Icon library picker
│   │   ├── NodeDetailPanel.jsx  # Node metadata editor
│   │   ├── EdgeConditionPanel.jsx # Edge condition editor
│   │   ├── ExampleCaseForm.jsx  # Create/edit case modal
│   │   ├── ExampleCasesList.jsx # List of test cases
│   │   ├── SimulationPanel.jsx  # Simulation controls
│   │   ├── SaveDiagramDialog.jsx # Save dialog
│   │   ├── OpenDiagramDialog.jsx # Load dialog
│   │   └── MermaidImportDialog.jsx # Mermaid import
│   ├── contexts/                # React contexts
│   │   ├── ThemeContext.jsx
│   │   └── ThemeContextDef.js
│   ├── hooks/                   # Custom hooks
│   │   ├── useTheme.js
│   │   ├── useDiagramState.js
│   │   ├── useSimulation.js
│   │   └── useSession.js
│   ├── themes/                  # Theme definitions
│   │   └── index.js
│   ├── config/                  # Configuration
│   │   └── nodeTypes.js
│   ├── utils/                   # Utility functions
│   │   ├── diagramLibrary.js    # Save/load diagrams
│   │   ├── exportDiagram.js     # Export to JSON
│   │   ├── importDiagram.js     # Import from JSON
│   │   ├── mermaidImport.js     # Mermaid parser
│   │   ├── edgeConditions.js    # Edge condition utilities
│   │   ├── exampleCases.js      # Case normalization
│   │   ├── simulationEngine.js  # Flow execution engine
│   │   └── simulationHighlighting.js # Visual highlighting
│   ├── templates/               # Diagram templates
│   │   └── petClinic.js         # Pet Clinic example (future)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Global styles + animations
├── architect.md                 # Requirements document (READ BEFORE IMPLEMENTING)
├── plan.md                      # Implementation plan
├── tasks.md                     # Task tracker
├── name.md                      # Branding and SEO strategy
├── CLAUDE.md                    # This file
└── implementation-phase*-step*.md  # Implementation templates

## Core Technologies

- **React 19** - UI framework with latest features
- **React Flow 11** - Interactive node-based diagrams
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework (@next version)
- **Lucide React** - Icon library (700+ icons)
- **expr-eval** - Safe expression evaluation for conditional logic
- **js-cookie** - Cookie management for sessions

## Theme System

DiagramFlow uses CSS custom properties for theming:
- Theme definitions: `src/themes/index.js`
- Theme context: `src/contexts/ThemeContext.jsx`
- Theme hook: `src/hooks/useTheme.js`
- Themes: dark (default) and light
- Persists to localStorage with key `diagram_theme`
- Detects system preference on first load

## State Management

- **Diagram State**: `useDiagramState` hook manages nodes, edges, example cases, and auto-save
- **Simulation State**: `useSimulation` hook manages playback controls and highlighting
- **Session State**: `useSession` hook with cookie-based sessions and localStorage persistence
- **Theme State**: `useTheme` hook via ThemeContext for dark/light mode
- **Persistence**:
  - localStorage for diagrams (`diagram_current`, `diagram_<id>`, `diagram_list`)
  - localStorage for theme (`diagram_theme`)
  - sessionStorage for undo/redo (future feature)
  - cookies for session management

## Important Notes

- **100% Client-Side**: No backend server, all logic runs in browser
- **VCS-Friendly**: JSON export format designed for git diffs
- **Auto-Save**: 30-second debounce to localStorage
- **Reference Project**: Use C:\Development\Code\system-design-visualizer as reference ONLY
- **Architect.md First**: Always read architect.md sections before implementing
- **Tailwind v4**: Use @next version with CSS imports
- **React Flow v11**: Not v10 - API differences exist
- **expr-eval**: Used for safe conditional evaluation (no eval())
- **Simulation**: Uses CSS animations for pulsing effects
- **Memoization**: Heavy use of useMemo for performance (highlighting, node types)

## Key Features Summary

### Completed (Phases 0-5)

**Phase 0**: Foundation & Setup
- Vite + React 19 setup
- Tailwind CSS v4 integration
- Theme system (dark/light)
- UI layout (Header, Sidebar, Canvas)

**Phase 1**: Basic Node & Edge Management
- Interactive node creation
- Edge connections with drag & drop
- State persistence with auto-save

**Phase 2**: Node Types & Rich Metadata
- 5 node types with custom styling
- Icon library with 700+ icons
- Metadata editor (descriptions, tags, links)
- Node detail panel

**Phase 3**: State Persistence & File Management
- Session management
- Save/load multiple diagrams
- JSON export/import
- Mermaid flowchart import

**Phase 4**: Conditional Nodes & Branching Logic
- Decision node type
- Conditional edge editor
- Expression evaluation with expr-eval
- Visual condition indicators

**Phase 5**: Example Cases & Flow Simulation
- Example case manager UI
- Simulation engine with step-by-step execution
- Playback controls (play, pause, step, reset, speed)
- Real-time path highlighting
- Pulsing animations for active nodes

### In Development (Phase 6)

**Phase 6**: Advanced Simulation Features
- Data transformation tracking
- Data inspector panel
- Conditional evaluation display
- Multiple case comparison
- Simulation history
