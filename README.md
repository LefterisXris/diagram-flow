# DiagramFlow

**Build, Simulate, Visualize**

DiagramFlow is an interactive flow diagram tool for developers and architects. Create system diagrams with conditional logic, define example cases with real data, and simulate how data flows through your system step-by-step.

![DiagramFlow](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![React Flow](https://img.shields.io/badge/react--flow-11.11.4-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

### Current (Phase 1)
- ✅ **Interactive Node Creation** - Click button or double-click canvas to add nodes
- ✅ **Edge Connections** - Drag from node handles to create animated connections
- ✅ **Drag & Drop** - Move nodes freely; edges follow automatically
- ✅ **Auto-Save** - Changes persist to localStorage every 10 seconds
- ✅ **Theme Support** - Dark and light themes with smooth transitions
- ✅ **Professional UI** - Clean, modern interface with Tailwind CSS

### Coming Soon (Phases 2-9)
- 🔜 **Multiple Node Types** - Service, Database, Client, Decision, Infrastructure
- 🔜 **Rich Metadata** - Add descriptions, tags, owners, links to nodes
- 🔜 **Conditional Logic** - Define branching paths with decision nodes
- 🔜 **Flow Simulation** - Run example cases and watch data flow step-by-step
- 🔜 **Mermaid Import** - Convert existing Mermaid diagrams to DiagramFlow
- 🔜 **Export Formats** - Save as JSON, PNG, SVG, or standalone HTML

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

### Saving Your Work

- **Auto-save**: Changes save automatically every 10 seconds
- **Manual save**: Wait for auto-save or refresh to verify persistence
- **Clear data**: Open browser console (F12) and run `localStorage.clear()`

---

## 🛠️ Technology Stack

### Core
- **React 19** - UI framework with latest features
- **React Flow 11** - Interactive node-based diagrams
- **Vite** - Lightning-fast build tool and dev server

### Styling
- **Tailwind CSS v3** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **CSS Custom Properties** - Theme system with dark/light modes

### State Management
- **React Hooks** - useState, useCallback, useMemo, useEffect
- **localStorage** - Client-side persistence
- **js-cookie** - Session management

---

## 📁 Project Structure

```
diagramflow/
├── src/
│   ├── components/          # React components
│   │   ├── nodes/          # Custom node types
│   │   │   └── GenericNode.jsx
│   │   ├── Header.jsx      # Top navigation bar
│   │   ├── Sidebar.jsx     # Left tool panel
│   │   ├── Canvas.jsx      # React Flow canvas
│   │   └── ThemeToggle.jsx # Theme switcher
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.jsx
│   │   └── ThemeContextDef.js
│   ├── hooks/              # Custom hooks
│   │   ├── useTheme.js
│   │   └── useDiagramState.js
│   ├── themes/             # Theme definitions
│   │   └── index.js
│   ├── config/             # Configuration
│   │   └── nodeTypes.js
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── scripts/                # Utility scripts
│   └── healthcheck.js      # App health verification
├── architect.md            # Requirements document
├── plan.md                 # Implementation roadmap
├── tasks.md                # Task tracker
└── README.md               # This file
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

- `diagram_current` - Current diagram state (nodes, edges)
- `diagram_theme` - User's theme preference (dark/light)

### Data Format

```json
{
  "nodes": [
    {
      "id": "uuid",
      "type": "generic",
      "position": { "x": 250, "y": 150 },
      "data": { "label": "Node Name" }
    }
  ],
  "edges": [
    {
      "id": "uuid",
      "source": "node1-id",
      "target": "node2-id",
      "animated": true,
      "type": "smoothstep"
    }
  ],
  "lastModified": 1234567890
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

### Phase 0: Foundation ✅ COMPLETE
- Project setup with Vite + React
- Tailwind CSS integration
- Theme system (dark/light modes)
- Basic UI layout (Header, Sidebar, Canvas)

### Phase 1: Basic Node & Edge Management ✅ COMPLETE
- Node creation (button + double-click)
- Edge creation via drag-and-drop
- Node dragging with automatic edge adjustment
- State persistence with auto-save

### Phase 2: Node Types & Rich Metadata 🔜 NEXT
- Multiple node types (Service, Database, Client, etc.)
- Icon support with Lucide React
- Metadata editor (descriptions, tags, links)
- Detail panel for node properties

### Phases 3-9
See `plan.md` for complete roadmap including:
- File management (save/load diagrams)
- Conditional logic and decision nodes
- Flow simulation with example cases
- Mermaid import tool
- Advanced features (search, validation, export)
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
