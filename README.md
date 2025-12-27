# DiagramFlow

**Build, Simulate, Visualize**

DiagramFlow is an interactive flow diagram tool for developers and architects. Create system diagrams with conditional logic, define example cases with real data, and simulate how data flows through your system step-by-step.

![DiagramFlow](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![React Flow](https://img.shields.io/badge/react--flow-11.11.4-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

### Phase 0-5 Complete (60% Done)

**Foundation & Core**
- ✅ **Interactive Node Creation** - Click button or double-click canvas to add nodes
- ✅ **Multiple Node Types** - Service, Database, Client, Decision, Generic nodes with icons
- ✅ **Edge Connections** - Drag from node handles to create animated connections
- ✅ **Drag & Drop** - Move nodes freely; edges follow automatically
- ✅ **Theme Support** - Dark and light themes with smooth transitions
- ✅ **Professional UI** - Clean, modern interface with Tailwind CSS v4

**Rich Metadata**
- ✅ **Node Details Panel** - Add descriptions, metadata, tags, and custom links
- ✅ **Icon Library** - Choose from hundreds of Lucide icons for each node
- ✅ **Node Status** - Track deployment status (Planned, In Progress, Deployed, Deprecated)
- ✅ **Ownership** - Assign owners, teams, and criticality levels
- ✅ **Versioning** - Track when nodes were added and last modified

**State Persistence & File Management**
- ✅ **Auto-Save** - Changes persist to localStorage with 30-second debounce
- ✅ **Session Management** - Cookie-based sessions with localStorage persistence
- ✅ **Save/Load Diagrams** - Save multiple diagrams and switch between them
- ✅ **Export/Import JSON** - VCS-friendly JSON format for version control
- ✅ **Mermaid Import** - Convert Mermaid flowcharts to DiagramFlow diagrams

**Conditional Logic & Branching**
- ✅ **Decision Nodes** - Create branching logic with decision nodes
- ✅ **Conditional Edges** - Define conditions on edges (true/false paths)
- ✅ **Condition Editor** - Visual editor for edge conditions and priorities
- ✅ **Conditional Highlighting** - Edges highlight when hovering over decision nodes

**Flow Simulation**
- ✅ **Example Cases** - Define test cases with input data and expected paths
- ✅ **Case Manager UI** - Create, edit, delete example cases with rich editor
- ✅ **Simulation Engine** - Execute flows with conditional evaluation (expr-eval)
- ✅ **Playback Controls** - Play, pause, step forward/back, reset, speed control (0.5x-3x)
- ✅ **Path Highlighting** - Active nodes pulse with blue glow, past nodes green, upcoming gray
- ✅ **Edge Animation** - Active edges brighten and animate during simulation
- ✅ **Progress Tracking** - Step counter and progress bar during simulation

### Coming Soon (Phases 6-9)
- 🔜 **Data Transformation Tracking** - See how data changes at each node
- 🔜 **Data Inspector Panel** - View input/output data at each step
- 🔜 **Conditional Evaluation Display** - See which conditions evaluated to true/false
- 🔜 **Multiple Case Comparison** - Run and compare multiple cases side-by-side
- 🔜 **Pet Clinic Template** - Pre-built example diagram for onboarding
- 🔜 **Advanced Search** - Find nodes, edges, and metadata across diagrams
- 🔜 **Diagram Validation** - Check for errors, circular paths, dead ends
- 🔜 **Export Formats** - Export as PNG, SVG, or standalone HTML

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/diagramflow.git
cd diagramflow

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173**

### Health Check

Verify the app is running correctly:

```bash
npm run healthcheck
```

---

## 📖 Usage

### Creating Nodes

**Method 1: Add Node Button**
1. Click the blue **"Add Node"** button in the left sidebar
2. Node appears at the center of the canvas

**Method 2: Double-Click**
1. Double-click anywhere on the canvas
2. Node appears exactly where you clicked

### Connecting Nodes

1. Hover over a node to see 4 **connection handles** (small circles)
2. Click and drag from one handle to another node's handle
3. An animated edge appears connecting the nodes

### Moving Nodes

1. Click and drag any node to reposition it
2. Connected edges automatically adjust

### Zooming & Panning

- **Zoom**: Scroll wheel or use +/- buttons (bottom-left)
- **Pan**: Click and drag on empty canvas space
- **Fit View**: Click the frame icon to see all nodes

### Editing Node Details

1. **Click on any node** to open the detail panel (right side)
2. Edit node properties:
   - **Label** - Node display name
   - **Icon** - Choose from icon library
   - **Description** - Short and detailed descriptions (Markdown supported)
   - **Status** - Planned, In Progress, Deployed, Deprecated
   - **Metadata** - Owner, version, criticality, tech stack
   - **Tags** - Categorize with custom tags
   - **Links** - Add documentation, repository, monitoring links
3. Changes save automatically

### Creating Conditional Logic

1. **Add a Decision node** from the sidebar (orange diamond icon)
2. **Create edges** from the decision node to other nodes
3. **Click on an edge** to open the condition editor (right side)
4. Define the condition:
   - **Condition Type** - True path, False path, or Default
   - **Expression** - e.g., `age > 18`, `status == "active"`
   - **Priority** - Evaluation order (lower = higher priority)
5. Edges will show condition labels and highlight on hover

### Running Simulations

1. **Navigate to "Example Cases" tab** in the sidebar
2. **Click "Add Case"** to create a new test case:
   - **Name & Description** - Describe the scenario
   - **Starting Node** - Select where the flow starts
   - **Input Data** - Define test data (key-value or JSON mode)
3. **Click "Run Simulation"** to start the simulation
4. **Use playback controls**:
   - ▶️ Play - Auto-advance through steps
   - ⏸️ Pause - Stop auto-play
   - ⏮️ Step Back - Go to previous step
   - ⏭️ Step Forward - Go to next step
   - 🔄 Reset - Return to start
   - 🎚️ Speed - Adjust playback speed (0.5x to 3x)
5. **Watch the diagram**:
   - Current node pulses with blue glow
   - Past nodes show green with check marks
   - Upcoming nodes shown in gray
   - Edges highlight as they're traversed

### Saving & Loading Diagrams

- **Auto-save**: Changes save automatically every 30 seconds to current session
- **Save Diagram**: Click "Save" in header to save to library
- **Load Diagram**: Click "Open" to see all saved diagrams
- **Export/Import**: Use "Export" to download JSON, "Import" to load from file
- **Clear data**: Open browser console (F12) and run `localStorage.clear()`

---

## 🛠️ Technology Stack

### Core
- **React 19** - UI framework with latest features
- **React Flow 11** - Interactive node-based diagrams
- **Vite 7** - Lightning-fast build tool and dev server
- **expr-eval** - Safe expression evaluation for conditional logic

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework (latest @next version)
- **Lucide React** - Beautiful icon library (700+ icons)
- **CSS Custom Properties** - Theme system with dark/light modes
- **CSS Animations** - Smooth pulsing effects for simulation

### State Management
- **React Hooks** - useState, useCallback, useMemo, useEffect
- **Custom Hooks** - useDiagramState, useSimulation, useTheme, useSession
- **localStorage** - Client-side persistence for diagrams and sessions
- **sessionStorage** - Undo/redo state (future feature)
- **js-cookie** - Cookie-based session management

---

## 📁 Project Structure

```
diagramflow/
├── src/
│   ├── components/                # React components
│   │   ├── nodes/                # Custom node types
│   │   │   ├── GenericNode.jsx
│   │   │   ├── ServiceNode.jsx
│   │   │   ├── DatabaseNode.jsx
│   │   │   ├── ClientNode.jsx
│   │   │   └── DecisionNode.jsx
│   │   ├── Header.jsx            # Top navigation bar
│   │   ├── Sidebar.jsx           # Left tool panel with tabs
│   │   ├── Canvas.jsx            # React Flow canvas
│   │   ├── ThemeToggle.jsx       # Theme switcher
│   │   ├── IconPicker.jsx        # Icon library picker
│   │   ├── NodeDetailPanel.jsx   # Node metadata editor
│   │   ├── EdgeConditionPanel.jsx # Edge condition editor
│   │   ├── ExampleCaseForm.jsx   # Create/edit case modal
│   │   ├── ExampleCasesList.jsx  # List of test cases
│   │   ├── SimulationPanel.jsx   # Simulation controls
│   │   ├── SaveDiagramDialog.jsx # Save dialog
│   │   ├── OpenDiagramDialog.jsx # Load dialog
│   │   └── MermaidImportDialog.jsx # Mermaid import
│   ├── contexts/                 # React contexts
│   │   ├── ThemeContext.jsx
│   │   └── ThemeContextDef.js
│   ├── hooks/                    # Custom hooks
│   │   ├── useTheme.js
│   │   ├── useDiagramState.js
│   │   ├── useSimulation.js
│   │   └── useSession.js
│   ├── themes/                   # Theme definitions
│   │   └── index.js
│   ├── config/                   # Configuration
│   │   └── nodeTypes.js
│   ├── utils/                    # Utility functions
│   │   ├── diagramLibrary.js     # Save/load diagrams
│   │   ├── exportDiagram.js      # Export to JSON
│   │   ├── importDiagram.js      # Import from JSON
│   │   ├── mermaidImport.js      # Mermaid parser
│   │   ├── edgeConditions.js     # Edge condition utilities
│   │   ├── exampleCases.js       # Case normalization
│   │   ├── simulationEngine.js   # Flow execution engine
│   │   └── simulationHighlighting.js # Visual highlighting
│   ├── templates/                # Diagram templates
│   │   └── petClinic.js          # Pet Clinic example (future)
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + animations
├── scripts/                      # Utility scripts
│   └── healthcheck.js            # App health verification
├── implementation-phase*.md      # Step-by-step guides
├── architect.md                  # Requirements document
├── plan.md                       # Implementation roadmap
├── tasks.md                      # Task tracker
├── CLAUDE.md                     # AI assistant guidelines
└── README.md                     # This file
```

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Health check
npm run healthcheck [port]
```

### Development Workflow

1. **Make changes** in `src/` directory
2. **Hot reload** updates automatically
3. **Test** functionality in browser
4. **Run health check** to verify no errors

### Adding New Features

See `plan.md` for the complete implementation roadmap organized by phases.

---

## 🎨 Theming

DiagramFlow uses CSS custom properties for theming:

```javascript
// Toggle between dark and light themes
const { toggleTheme } = useTheme();

// Available themes
const themes = {
  dark: { /* dark theme colors */ },
  light: { /* light theme colors */ }
};
```

Themes persist to `localStorage` with key `diagram_theme`.

---

## 💾 Data Persistence

### localStorage Keys

- `diagram_current` - Current diagram state (nodes, edges, example cases, viewport)
- `diagram_<id>` - Saved diagrams with metadata
- `diagram_list` - Index of all saved diagrams
- `diagram_theme` - User's theme preference (dark/light)
- `diagram_session_*` - Session-specific data (cookie-based)

### Data Format

```json
{
  "version": "1.0.0",
  "metadata": {
    "id": "uuid",
    "name": "My Diagram",
    "createdAt": "2024-12-27T10:00:00Z",
    "lastModified": "2024-12-27T15:30:00Z"
  },
  "nodes": [
    {
      "id": "uuid",
      "type": "service",
      "position": { "x": 250, "y": 150 },
      "data": {
        "label": "API Gateway",
        "icon": "Server",
        "shortDescription": "Main entry point",
        "detailedDescription": "# API Gateway\nHandles all requests...",
        "metadata": {
          "status": "deployed",
          "owner": "Platform Team",
          "version": "2.3.1",
          "criticality": "high",
          "tags": ["core", "infrastructure"],
          "links": [
            { "url": "https://docs.example.com", "label": "Documentation" }
          ],
          "dateAdded": "2024-12-26T10:00:00Z",
          "dateModified": "2024-12-27T15:30:00Z"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "uuid",
      "source": "node1-id",
      "target": "node2-id",
      "animated": true,
      "type": "smoothstep",
      "label": "if age > 18",
      "data": {
        "condition": "age > 18",
        "conditionType": "true",
        "priority": 1
      }
    }
  ],
  "exampleCases": [
    {
      "id": "uuid",
      "name": "Adult User Registration",
      "description": "User with age > 18",
      "input": {
        "nodeId": "start-node-id",
        "data": { "age": 25, "name": "John" }
      },
      "expectedPath": ["node-1", "node-2", "node-3"],
      "highlights": []
    }
  ],
  "viewport": { "zoom": 1, "x": 0, "y": 0 }
}
```

---

## 🐛 Troubleshooting

### App Not Loading

1. Check dev server is running: `npm run dev`
2. Verify port is available (default: 5173)
3. Run health check: `npm run healthcheck`

### Nodes Not Visible

1. Open browser console (F12)
2. Check for errors (red messages)
3. Try clearing localStorage: `localStorage.clear()`
4. Refresh the page

### CSS Not Working

1. Verify Tailwind CSS v3 is installed: `npm list tailwindcss`
2. Check `postcss.config.js` uses `tailwindcss` plugin
3. Restart dev server

---

## 🗺️ Roadmap

### Phase 0: Foundation ✅ COMPLETE (Dec 26-27)
- Project setup with Vite + React 19
- Tailwind CSS v4 integration
- Theme system (dark/light modes)
- Basic UI layout (Header, Sidebar, Canvas)

### Phase 1: Basic Node & Edge Management ✅ COMPLETE (Dec 27)
- Node creation (button + double-click)
- Edge creation via drag-and-drop
- Node dragging with automatic edge adjustment
- State persistence with auto-save

### Phase 2: Node Types & Rich Metadata ✅ COMPLETE (Dec 27)
- Multiple node types (Service, Database, Client, Decision, Generic)
- Icon support with Lucide React (700+ icons)
- Metadata editor (descriptions, tags, links, ownership)
- Detail panel for node properties

### Phase 3: State Persistence & File Management ✅ COMPLETE (Dec 27)
- Session management with cookies
- Save/load multiple diagrams
- Export/import JSON (VCS-friendly format)
- Mermaid flowchart import
- Auto-save with debounce

### Phase 4: Conditional Nodes & Branching Logic ✅ COMPLETE (Dec 27)
- Decision node type with diamond shape
- Conditional edge editor (condition, type, priority)
- Visual condition indicators
- Edge highlighting on decision node hover

### Phase 5: Example Cases & Flow Simulation ✅ COMPLETE (Dec 27)
- Example case manager UI (create, edit, delete)
- Simulation engine with expr-eval
- Playback controls (play, pause, step, reset, speed)
- Path highlighting (active, past, upcoming nodes/edges)
- Real-time visual feedback with animations

### Phase 6: Advanced Simulation Features 🔜 NEXT
- Data transformation tracking at each node
- Data inspector panel with diff view
- Conditional evaluation display
- Multiple case comparison
- Simulation history and replay

### Phases 7-9
See `plan.md` for complete roadmap including:
- Pet Clinic template for onboarding
- Advanced search and validation
- Export formats (PNG, SVG, HTML)
- Documentation and deployment

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome!

---

## 📞 Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Review the **Console** for error messages (F12)
3. Run `npm run healthcheck` to verify setup
4. Check `tasks.md` for known issues

---

**Made with ❤️ using React, React Flow, and Tailwind CSS**
