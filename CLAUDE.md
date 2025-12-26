# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**DiagramFlow** - Build, Simulate, Visualize

DiagramFlow is an interactive flow diagram tool for developers and architects. Create system diagrams with conditional logic, define example cases with real data, and simulate how data flows through your system step-by-step.

**Key Features**:
- Interactive flow diagrams with conditional branching
- Example cases with simulation and step-through debugging
- Rich metadata support for nodes (tech stack, owners, links)
- Mermaid-to-DiagramFlow migration tool
- 100% client-side (no backend server)
- VCS-friendly JSON export/import
- Pet Clinic template for onboarding

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
│   ├── components/       # React components
│   │   ├── nodes/       # Custom node types
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Canvas.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/        # React contexts
│   │   ├── ThemeContext.jsx
│   │   └── ThemeContextDef.js
│   ├── hooks/           # Custom hooks
│   │   ├── useTheme.js
│   │   └── useDiagramState.js
│   ├── themes/          # Theme definitions
│   │   └── index.js
│   ├── config/          # Configuration
│   │   └── nodeTypes.js
│   ├── templates/       # Diagram templates
│   │   └── petClinic.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── architect.md         # Requirements document (READ BEFORE IMPLEMENTING)
├── plan.md             # Implementation plan
├── tasks.md            # Task tracker
├── name.md             # Branding and SEO strategy
└── implementation-phase*-step*.md  # Implementation templates

## Core Technologies

- **React 19** - UI framework
- **React Flow 11** - Interactive diagrams
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
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

- **Diagram State**: `useDiagramState` hook manages nodes, edges, and auto-save
- **Session State**: Cookie-based sessions with localStorage persistence
- **Theme State**: ThemeContext for dark/light mode
- **Persistence**: localStorage for diagrams, sessionStorage for undo/redo

## Important Notes

- **100% Client-Side**: No backend server, all logic runs in browser
- **VCS-Friendly**: JSON export format designed for git diffs
- **Auto-Save**: 30-second debounce to localStorage
- **Reference Project**: Use C:\Development\Code\system-design-visualizer as reference ONLY
- **Architect.md First**: Always read architect.md sections before implementing
- **Tailwind v4**: Use @next version with CSS imports
- **React Flow v11**: Not v10 - API differences exist
