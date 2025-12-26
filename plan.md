# DiagramFlow - Implementation Plan

**Project Name**: DiagramFlow
**Tagline**: Build, Simulate, Visualize

## Overview

This plan breaks down the development of DiagramFlow into 9 phases, each delivering a working, presentable feature set. The approach is incremental: start with a minimal working product and progressively add complexity.

**Important Notes**:
- This is a **brand new project** built from scratch
- Reference project location: `C:\Development\Code\system-design-visualizer`
  - Use it as a reference for theme system, React Flow setup, and component patterns
  - DO NOT modify the reference project - create a new project
- Each phase includes detailed implementation guidance for Claude Code

**Total Estimated Duration**: ~12-16 weeks (individual developer, part-time)

---

## Phase 0: Project Foundation & Setup
**Duration**: 3-5 days
**Deliverable**: Working development environment with basic UI shell

### Steps:

1. **Create New Vite + React Project**
   ```bash
   # Create new project
   npm create vite@latest diagramflow -- --template react
   cd diagramflow
   npm install
   ```

   **Configure package.json**:
   ```json
   {
     "name": "diagramflow",
     "version": "0.1.0",
     "description": "Interactive flow diagram tool - Build, Simulate, Visualize",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "lint": "eslint ."
     }
   }
   ```

2. **Install Core Dependencies**
   ```bash
   # React Flow for diagram canvas
   npm install reactflow

   # Icons
   npm install lucide-react

   # Utilities
   npm install clsx tailwind-merge

   # Cookie management (for sessions)
   npm install js-cookie
   ```

3. **Install Tailwind CSS v4**
   ```bash
   npm install -D tailwindcss@next @tailwindcss/postcss@next autoprefixer postcss
   ```

   **Create `tailwind.config.js`**:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
   ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

   **Create `postcss.config.js`**:
   ```javascript
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   }
   ```

   **Update `src/index.css`**:
   ```css
   @import "tailwindcss";

   /* CSS custom properties for theming will be added here */
   :root {
     /* Variables will be set by ThemeContext */
   }
   ```

4. **Set Up Theme System** (Reference: `C:\Development\Code\system-design-visualizer\src\themes\index.js`)

   **Create `src/themes/index.js`**:
   ```javascript
   // Copy from reference project and adapt
   export const themes = {
     dark: {
       name: "dark",
       label: "Dark",
       colors: {
         "--bg-primary": "#020617",
         "--bg-secondary": "#0f172a",
         "--text-primary": "#f8fafc",
         "--text-secondary": "#94a3b8",
         "--border-primary": "rgba(255, 255, 255, 0.1)",
         "--accent-blue": "#3b82f6",
         // ... (copy full theme from reference)
       }
     },
     light: {
       name: "light",
       label: "Light",
       colors: {
         "--bg-primary": "#ffffff",
         "--bg-secondary": "#f8fafc",
         "--text-primary": "#0f172a",
         // ... (copy full theme from reference)
       }
     }
   };

   export const getTheme = (themeName) => themes[themeName] || themes.dark;

   export const applyTheme = (theme) => {
     const root = document.documentElement;
     Object.entries(theme.colors).forEach(([property, value]) => {
       root.style.setProperty(property, value);
     });
     root.setAttribute("data-theme", theme.name);
   };
   ```

5. **Create Theme Context** (Reference: `C:\Development\Code\system-design-visualizer\src\contexts\ThemeContext.jsx`)

   **Create `src/contexts/ThemeContextDef.js`**:
   ```javascript
   import { createContext } from "react";

   export const ThemeContext = createContext({
     theme: null,
     themeName: "dark",
     toggleTheme: () => {},
     setTheme: () => {},
     themes: {}
   });
   ```

   **Create `src/contexts/ThemeContext.jsx`**:
   ```javascript
   // Copy from reference project: C:\Development\Code\system-design-visualizer\src\contexts\ThemeContext.jsx
   // Manages theme state, localStorage persistence, system preference detection
   ```

   **Create `src/hooks/useTheme.js`**:
   ```javascript
   import { useContext } from "react";
   import { ThemeContext } from "../contexts/ThemeContextDef";

   export const useTheme = () => {
     const context = useContext(ThemeContext);
     if (!context) {
       throw new Error("useTheme must be used within ThemeProvider");
     }
     return context;
   };
   ```

6. **Create Basic Layout Components**

   **Create `src/components/Header.jsx`**:
   ```javascript
   import { Layout } from "lucide-react";
   import ThemeToggle from "./ThemeToggle";

   const Header = () => {
     return (
       <header
         className="border-b backdrop-blur-md sticky top-0 z-50"
         style={{
           borderColor: "var(--border-primary)",
           backgroundColor: "var(--bg-elevated)",
           boxShadow: "var(--shadow-lg)",
         }}
       >
         <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
               <Layout className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
               DiagramFlow
             </h1>
           </div>

           <div className="flex items-center gap-3">
             <ThemeToggle />
           </div>
         </div>
       </header>
     );
   };

   export default Header;
   ```

   **Create `src/components/ThemeToggle.jsx`** (Reference: `C:\Development\Code\system-design-visualizer\src\components\ThemeToggle.jsx`):
   ```javascript
   // Copy from reference project - simple sun/moon toggle button
   ```

   **Create `src/components/Sidebar.jsx`**:
   ```javascript
   const Sidebar = () => {
     return (
       <aside
         className="w-64 border-r flex flex-col"
         style={{
           borderColor: "var(--border-primary)",
           backgroundColor: "var(--bg-secondary)",
         }}
       >
         <div className="p-4">
           <h2 className="text-sm font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
             Tools
           </h2>
         </div>
         {/* Tool palette will go here */}
       </aside>
     );
   };

   export default Sidebar;
   ```

   **Create `src/components/Canvas.jsx`**:
   ```javascript
   import ReactFlow, { Background, Controls } from "reactflow";
   import "reactflow/dist/style.css";

   const Canvas = () => {
     return (
       <div className="flex-1 relative" style={{ backgroundColor: "var(--bg-primary)" }}>
         <ReactFlow
           nodes={[]}
           edges={[]}
           fitView
           style={{ backgroundColor: "var(--bg-primary)" }}
         >
           <Background color="var(--border-primary)" gap={20} />
           <Controls />
         </ReactFlow>
       </div>
     );
   };

   export default Canvas;
   ```

7. **Update Main App Component**

   **Update `src/App.jsx`**:
   ```javascript
   import { ReactFlowProvider } from "reactflow";
   import Header from "./components/Header";
   import Sidebar from "./components/Sidebar";
   import Canvas from "./components/Canvas";

   function App() {
     return (
       <div
         className="min-h-screen flex flex-col"
         style={{
           backgroundColor: "var(--bg-primary)",
           color: "var(--text-primary)",
         }}
       >
         <Header />
         <div className="flex-1 flex overflow-hidden">
           <Sidebar />
           <ReactFlowProvider>
             <Canvas />
           </ReactFlowProvider>
         </div>
       </div>
     );
   }

   export default App;
   ```

   **Update `src/main.jsx`**:
   ```javascript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App.jsx';
   import { ThemeProvider } from './contexts/ThemeContext.jsx';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <ThemeProvider>
         <App />
       </ThemeProvider>
     </React.StrictMode>,
   );
   ```

8. **Test the Setup**
   ```bash
   npm run dev
   ```

   **Verify**:
   - ✅ App runs on http://localhost:5173
   - ✅ Header with "DiagramFlow" title visible
   - ✅ Theme toggle button works (switches dark/light)
   - ✅ Empty React Flow canvas visible with grid background
   - ✅ Zoom (mouse wheel) and pan (drag) work
   - ✅ Sidebar visible on left
   - ✅ Responsive layout (try resizing browser)

**Demo**: Empty canvas with pan/zoom, working theme toggle, clean UI shell

**Reference Files**:
- `C:\Development\Code\system-design-visualizer\src\themes\index.js`
- `C:\Development\Code\system-design-visualizer\src\contexts\ThemeContext.jsx`
- `C:\Development\Code\system-design-visualizer\src\components\ThemeToggle.jsx`

---

## Phase 1: Basic Node & Edge Management
**Duration**: 5-7 days
**Deliverable**: Can create nodes, connect them, drag them around, and save to localStorage

### Steps:

1. **Create Default Node Type**

   **Create `src/components/nodes/GenericNode.jsx`**:
   ```javascript
   import { Handle, Position } from "reactflow";
   import { Box } from "lucide-react";

   const GenericNode = ({ data, selected }) => {
     return (
       <div
         className="px-4 py-2 rounded-lg border-2 min-w-[120px]"
         style={{
           backgroundColor: selected ? "var(--accent-blue)" : "var(--node-bg)",
           borderColor: selected ? "var(--accent-blue)" : "var(--node-border)",
           color: selected ? "#ffffff" : "var(--text-primary)",
         }}
       >
         <Handle type="target" position={Position.Top} />
         <Handle type="target" position={Position.Left} />

         <div className="flex items-center gap-2">
           <Box className="w-4 h-4" />
           <div className="font-medium">{data.label || "Node"}</div>
         </div>

         <Handle type="source" position={Position.Bottom} />
         <Handle type="source" position={Position.Right} />
       </div>
     );
   };

   export default GenericNode;
   ```

   **Create `src/config/nodeTypes.js`**:
   ```javascript
   import GenericNode from "../components/nodes/GenericNode";

   export const nodeTypes = {
     generic: GenericNode,
   };
   ```

2. **Implement Node State Management**

   **Create `src/hooks/useDiagramState.js`**:
   ```javascript
   import { useCallback, useEffect, useState } from "react";
   import { useNodesState, useEdgesState } from "reactflow";

   const STORAGE_KEY = "diagram_current";
   const AUTOSAVE_DELAY = 10000; // 10 seconds

   export const useDiagramState = () => {
     const [nodes, setNodes, onNodesChange] = useNodesState([]);
     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
     const [lastSaved, setLastSaved] = useState(null);

     // Load from localStorage on mount
     useEffect(() => {
       const saved = localStorage.getItem(STORAGE_KEY);
       if (saved) {
         try {
           const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
           setNodes(savedNodes || []);
           setEdges(savedEdges || []);
         } catch (e) {
           console.error("Failed to load diagram:", e);
         }
       }
     }, [setNodes, setEdges]);

     // Auto-save to localStorage
     useEffect(() => {
       const timer = setTimeout(() => {
         const data = { nodes, edges, lastModified: Date.now() };
         localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
         setLastSaved(Date.now());
       }, AUTOSAVE_DELAY);

       return () => clearTimeout(timer);
     }, [nodes, edges]);

     const addNode = useCallback((position) => {
       const newNode = {
         id: crypto.randomUUID(),
         type: "generic",
         position,
         data: { label: "New Node" },
       };
       setNodes((nds) => [...nds, newNode]);
     }, [setNodes]);

     const deleteNode = useCallback((nodeId) => {
       setNodes((nds) => nds.filter((n) => n.id !== nodeId));
       setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
     }, [setNodes, setEdges]);

     return {
       nodes,
       edges,
       onNodesChange,
       onEdgesChange,
       addNode,
       deleteNode,
       setNodes,
       setEdges,
       lastSaved,
     };
   };
   ```

3. **Implement Node Creation UI**

   **Update `src/components/Sidebar.jsx`**:
   ```javascript
   import { Plus } from "lucide-react";

   const Sidebar = ({ onAddNode }) => {
     return (
       <aside
         className="w-64 border-r flex flex-col"
         style={{
           borderColor: "var(--border-primary)",
           backgroundColor: "var(--bg-secondary)",
         }}
       >
         <div className="p-4 space-y-4">
           <h2 className="text-sm font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
             Tools
           </h2>

           <button
             onClick={() => onAddNode({ x: 250, y: 150 })}
             className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
             style={{
               backgroundColor: "var(--accent-blue)",
               color: "#ffffff",
             }}
           >
             <Plus className="w-4 h-4" />
             Add Node
           </button>
         </div>
       </aside>
     );
   };

   export default Sidebar;
   ```

4. **Update Canvas with Node Management**

   **Update `src/components/Canvas.jsx`**:
   ```javascript
   import { useCallback } from "react";
   import ReactFlow, { Background, Controls, addEdge } from "reactflow";
   import "reactflow/dist/style.css";
   import { nodeTypes } from "../config/nodeTypes";

   const Canvas = ({ nodes, edges, onNodesChange, onEdgesChange, onAddNode, setEdges }) => {
     // Handle double-click to create node
     const onPaneDoubleClick = useCallback((event) => {
       const reactFlowBounds = event.currentTarget.getBoundingClientRect();
       const position = {
         x: event.clientX - reactFlowBounds.left - 60,
         y: event.clientY - reactFlowBounds.top - 20,
       };
       onAddNode(position);
     }, [onAddNode]);

     // Handle edge creation
     const onConnect = useCallback((params) => {
       const newEdge = {
         ...params,
         id: crypto.randomUUID(),
         animated: true,
         type: "smoothstep",
       };
       setEdges((eds) => addEdge(newEdge, eds));
     }, [setEdges]);

     // Handle keyboard delete
     const onKeyDown = useCallback((event) => {
       if (event.key === "Delete") {
         // Will implement in next step
       }
     }, []);

     return (
       <div className="flex-1 relative" style={{ backgroundColor: "var(--bg-primary)" }}>
         <ReactFlow
           nodes={nodes}
           edges={edges}
           onNodesChange={onNodesChange}
           onEdgesChange={onEdgesChange}
           onConnect={onConnect}
           onPaneDoubleClick={onPaneDoubleClick}
           onKeyDown={onKeyDown}
           nodeTypes={nodeTypes}
           fitView
           style={{ backgroundColor: "var(--bg-primary)" }}
         >
           <Background color="var(--border-primary)" gap={20} />
           <Controls />
         </ReactFlow>
       </div>
     );
   };

   export default Canvas;
   ```

5. **Wire Everything in App Component**

   **Update `src/App.jsx`**:
   ```javascript
   import { ReactFlowProvider } from "reactflow";
   import Header from "./components/Header";
   import Sidebar from "./components/Sidebar";
   import Canvas from "./components/Canvas";
   import { useDiagramState } from "./hooks/useDiagramState";

   function App() {
     const {
       nodes,
       edges,
       onNodesChange,
       onEdgesChange,
       addNode,
       setEdges,
     } = useDiagramState();

     return (
       <div
         className="min-h-screen flex flex-col"
         style={{
           backgroundColor: "var(--bg-primary)",
           color: "var(--text-primary)",
         }}
       >
         <Header />
         <div className="flex-1 flex overflow-hidden">
           <Sidebar onAddNode={addNode} />
           <ReactFlowProvider>
             <Canvas
               nodes={nodes}
               edges={edges}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
               onAddNode={addNode}
               setEdges={setEdges}
             />
           </ReactFlowProvider>
         </div>
       </div>
     );
   }

   export default App;
   ```

6. **Test Node Creation and Connections**
   - Click "Add Node" button → node appears in center
   - Double-click canvas → node appears at cursor position
   - Drag from node handle to another node handle → edge created with animation
   - Drag nodes around → edges follow
   - Refresh page → nodes and edges persist

**Demo**: Create 5-6 nodes, connect them with arrows, drag them around, refresh page to see persistence

**Reference Files**:
- `C:\Development\Code\system-design-visualizer\src\components\CustomNodes.jsx` (for node styling ideas)

---

## Phase 2: Node Types & Rich Metadata
**Duration**: 6-8 days
**Deliverable**: Professional diagrams with different node types, icons, and metadata panels

### Steps:

1. **Implement Multiple Node Types**
   - Create custom node components:
     - `ServiceNode.jsx` - Rectangle with server icon
     - `DatabaseNode.jsx` - Cylinder shape with database icon
     - `ClientNode.jsx` - Monitor/phone icon
     - `DecisionNode.jsx` - Diamond shape (for later)
     - `GenericNode.jsx` - Simple rectangle
   - Register node types in React Flow: `nodeTypes` object
   - Color-code by type (blue for service, green for database, purple for client, etc.)
   - Add type selector when creating node

2. **Add Icon Support**
   - Integrate Lucide React icons
   - Create icon picker component with search
   - Store icon name in node data: `data.icon`
   - Display icon in node header
   - Fallback to default icon if custom icon not set

3. **Implement Node Metadata Structure**
   - Extend node data model:
     ```javascript
     {
       id: "uuid",
       type: "service",
       position: { x, y },
       data: {
         label: "API Gateway",
         icon: "server",
         shortDescription: "Main entry point",
         detailedDescription: "# API Gateway\n...",
         metadata: {
           status: "deployed",
           owner: "Platform Team",
           tags: ["core", "api"],
           links: [],
           dateAdded: "2024-01-15T..."
         }
       }
     }
     ```
   - Auto-populate `dateAdded` and `dateModified`

4. **Create Detail Panel (Sidebar)**
   - Click node to show details in right sidebar
   - Display all node properties in organized sections:
     - Basic Info: name, type, icon
     - Descriptions: short & detailed (markdown rendered)
     - Metadata: status, owner, tags, links
   - Editable fields (input boxes, dropdowns, tag chips)
   - Close button to deselect node

5. **Implement Metadata Editing**
   - Text inputs for name, descriptions
   - Dropdown for status (planned, in-progress, deployed, deprecated)
   - Tag input with add/remove chips
   - Links section: add/remove links with URL and label
   - Save changes immediately to state (auto-save handles localStorage)

**Demo**: Create diagram with 5 different node types, add rich metadata, show detail panel, demonstrate professional styling

---

## Phase 3: State Persistence & File Management
**Duration**: 6-9 days (extended to include Mermaid migration tool)
**Deliverable**: Full save/load functionality, export/import JSON files, session management, **Mermaid-to-DiagramFlow conversion**

### Steps:

1. **Implement JSON Export**
   - Create `exportDiagram()` function
   - Format as YAML-like structure (but use JSON for simplicity in Phase 3):
     ```json
     {
       "version": "1.0",
       "metadata": {
         "name": "My Diagram",
         "description": "...",
         "created": "...",
         "modified": "..."
       },
       "nodes": [...],
       "edges": [...],
       "layout": {
         "zoom": 1.0,
         "center": { x: 500, y: 400 }
       }
     }
     ```
   - Download as `.json` file using `Blob` and `URL.createObjectURL()`
   - Button in header: "Export → JSON"

2. **Implement JSON Import**
   - File input or drag-and-drop zone
   - Parse JSON file
   - Validate structure (version, required fields)
   - Load nodes and edges into React Flow
   - Restore zoom and pan position
   - Button in header: "Import → JSON"

3. **Session Management with Cookies**
   - Install `js-cookie` package
   - Create session on first load:
     ```javascript
     const sessionId = crypto.randomUUID();
     Cookies.set('diagram_session', sessionId, { expires: 7 });
     ```
   - Store session data in localStorage:
     - `session_<id>`: session metadata
     - `session_<id>_activeDiagram`: current diagram ID
     - `session_<id>_preferences`: user preferences

4. **Implement "Save As" and Diagram Library**
   - Save button: Save current diagram with name
   - Store in localStorage: `diagram_<id>`
   - Keep index: `diagram_list` (array of diagram metadata)
   - Create "Open Diagram" modal:
     - List all saved diagrams
     - Show name, last modified, thumbnail (optional)
     - Click to load diagram
     - Delete diagram option

5. **Auto-Save Improvements**
   - Save entire diagram state (nodes, edges, zoom, pan)
   - Debounce to 30 seconds
   - Show "Saved" indicator in header
   - Detect changes and mark as "Unsaved changes"
   - Warn before closing tab if unsaved changes exist

6. **Implement Mermaid Migration Tool**
   - Install Mermaid parser library or create regex parser
   - Create Mermaid import UI (text area for paste, file upload)
   - Parse Mermaid syntax (nodes, edges, labels, styles)
   - Map Mermaid shapes to DiagramFlow node types:
     - `[` `]` → service, `[(` `)]` → database, `{` `}` → decision, etc.
   - Map edge styles (-->, --->, -.->)  to DiagramFlow edges
   - Extract labels and detect conditionals from edge labels
   - Apply auto-layout algorithm (Dagre hierarchical layout)
   - Show side-by-side preview (Mermaid vs DiagramFlow)
   - Display warnings for unsupported Mermaid features
   - "Import" button to load converted diagram
   - Add "Imported from Mermaid" tag to all nodes

**Demo**:
- Create diagram, save with name, export JSON
- Close tab, reopen, see diagram restored
- Import JSON file successfully
- **Paste Mermaid code and convert to DiagramFlow**
- **Show side-by-side preview (original Mermaid vs DiagramFlow)**
- **Import converted diagram and edit it**

---

## Phase 4: Conditional Nodes & Branching Logic
**Duration**: 6-8 days
**Deliverable**: Decision nodes with multiple outputs, condition definitions, visual indicators

### Steps:

1. **Create Decision Node Component**
   - Diamond-shaped node (using CSS `transform: rotate(45deg)` or SVG)
   - Special handles: 1 input (top), 2+ outputs (sides/bottom)
   - Label in center
   - Distinct color scheme (yellow/orange warning colors)

2. **Implement Conditional Edges**
   - Extend edge data model:
     ```javascript
     {
       id: "edge-1",
       source: "decision-node-id",
       target: "next-node-id",
       label: "if age > 18",
       data: {
         condition: "input.age > 18",
         priority: 1,
         conditionType: "true" // or "false" or "default"
       },
       style: { stroke: "#10b981" } // green for true path
     }
     ```
   - Color-code edges: green for true, red for false, gray for default

3. **Create Condition Editor UI**
   - When edge is selected (from decision node), show condition panel
   - Input field for condition expression
   - Priority number input (for ordering multiple conditions)
   - Condition type dropdown: "True path", "False path", "Default"
   - Syntax helper/validator (optional)

4. **Visual Indicators for Conditions**
   - Display condition label on edges (always visible or on hover)
   - Edge styling based on condition type:
     - True: solid green line
     - False: solid red line
     - Default: dashed gray line
   - Decision node shows number of outgoing conditions as badge

5. **Implement Multiple Outputs**
   - Allow 2+ edges from decision node
   - Validate: At least 1 true path, optional false/default
   - Show warning if no default path defined
   - Visual feedback when hovering over decision node (highlight all outgoing paths)

**Demo**: Create workflow with 2-3 decision nodes, define conditions, show different path colors, demonstrate branching logic

---

## Phase 5: Example Cases & Basic Flow Simulation
**Duration**: 7-10 days
**Deliverable**: Define example cases, run basic simulation with path highlighting

### Steps:

1. **Create Example Case Data Structure**
   - Add `exampleCases` to diagram state:
     ```javascript
     {
       id: "case-1",
       name: "Adult User Registration",
       description: "User with age > 18",
       input: {
         nodeId: "start-node-id",
         data: { age: 25, name: "John" }
       },
       expectedPath: ["node-1", "node-2", "node-3"]
     }
     ```
   - Store in diagram JSON

2. **Build Example Case Manager UI**
   - New sidebar tab: "Example Cases"
   - List of saved cases
   - "Add Case" button opens modal:
     - Name and description inputs
     - Select starting node (dropdown)
     - Define input data (JSON editor or key-value pairs)
     - Save case
   - Edit/delete case options

3. **Implement Simulation Engine**
   - Create `simulateFlow()` function:
     - Takes example case as input
     - Starts at input node
     - Evaluates conditions at decision nodes using `expr-eval` library
     - Builds path array: `[nodeId1, nodeId2, ...]`
     - Returns path and evaluation results
   - Handle errors (invalid condition, circular paths, dead ends)

4. **Create Simulation UI Controls**
   - Simulation panel in sidebar (when case selected):
     - Play button: Auto-run simulation with 1-second delays
     - Pause button: Stop auto-run
     - Step Forward/Back buttons: Manual step-through
     - Reset button: Return to start
     - Speed slider: 0.5x to 3x
   - Progress indicator: "Step 3 of 7"

5. **Implement Path Highlighting**
   - During simulation, highlight:
     - **Active node**: Thick pulsing border, distinct color (blue glow)
     - **Active edge**: Brighter color, faster animation
     - **Traversed path**: Dimmed green overlay on visited nodes/edges
     - **Upcoming path**: Light gray preview (if path is predetermined)
   - Update React Flow node/edge styles dynamically
   - Clear highlights when simulation ends

**Demo**: Create simple flow (5-6 nodes, 1-2 decisions), define example case, run simulation, watch path highlight, step through manually

---

## Phase 6: Advanced Simulation Features
**Duration**: 6-8 days
**Deliverable**: Data transformation tracking, conditional evaluation display, multiple case comparison

### Steps:

1. **Implement Data State Tracking**
   - Extend simulation to track data at each node:
     ```javascript
     {
       nodeId: "node-2",
       stepIndex: 2,
       inputData: { age: 25, name: "John" },
       outputData: { age: 25, name: "John", status: "validated" },
       transformations: ["Added status field"]
     }
     ```
   - Allow nodes to define transformation functions (optional advanced feature)
   - For now, just track input = output (no transformation)

2. **Create Data Inspector Panel**
   - Floating panel during simulation (draggable)
   - Shows current step data:
     - Input data (JSON formatted)
     - Output data (JSON formatted)
     - Diff highlighting (added fields in green, removed in red)
   - Minimizable panel

3. **Conditional Evaluation Display**
   - When simulation reaches decision node:
     - Pause briefly (1-2 seconds)
     - Show popup/tooltip on decision node
     - List all outgoing conditions
     - Highlight evaluated condition:
       - `age > 18 → true` (green checkmark)
       - Other conditions grayed out with "false" badge
     - Show which path was chosen and why
   - Animate selection of chosen edge

4. **Implement Multiple Example Cases**
   - Support 3-5 example cases per diagram
   - Case selector dropdown in simulation panel
   - Switch between cases
   - Run all cases sequentially (batch mode)
   - Show summary: "3 of 5 cases passed expected path"

5. **Add Simulation History**
   - Track all simulation runs:
     ```javascript
     {
       caseId: "case-1",
       timestamp: "2024-01-20T10:30:00Z",
       actualPath: ["node-1", "node-2", "node-3"],
       expectedPath: ["node-1", "node-2", "node-3"],
       success: true,
       duration: 5000 // ms
     }
     ```
   - Show history in sidebar tab
   - Replay previous simulation
   - Compare actual vs expected paths

**Demo**: Create ETL-style diagram, define 2-3 example cases with different inputs, run simulations, show conditional evaluation, display data inspector, compare cases

---

## Phase 7: Pet Clinic Template & Onboarding
**Duration**: 5-7 days
**Deliverable**: Default template loads on first launch, great first-time user experience

### Steps:

1. **Create Pet Clinic Template Data**
   - Define complete diagram structure in `src/templates/petClinic.js`:
     - 3 nodes: Angular Frontend, Spring Boot Backend, MySQL Database
     - Node positions for clean layout
     - Rich metadata (tech stack, features, endpoints, tables)
     - Connections with labels (HTTP/REST, JDBC)
     - 1 decision node: Authentication check
   - Export as importable object

2. **Implement Example Cases for Pet Clinic**
   - Define 3 example cases:
     1. **User Login**: Success path through auth flow
     2. **Create Pet**: CRUD operation with validation
     3. **Invalid Owner Error**: Error handling path
   - Include realistic input data
   - Define expected paths
   - Add to template

3. **Create Welcome Screen**
   - Show on first launch (check localStorage: `has_visited`)
   - Modal or full-screen overlay:
     - Welcome message
     - Feature highlights (bullets)
     - "Start with Pet Clinic Template" button
     - "Start with Empty Canvas" button
   - Set flag after choice: `has_visited: true`

4. **Implement Template Loading**
   - On "Start with Template" click:
     - Load Pet Clinic nodes and edges
     - Fit view to show all nodes
     - Auto-select first node to show detail panel
     - Show tooltip: "Click 'Example Cases' tab to see simulations"
   - On "Empty Canvas" click:
     - Load empty diagram
     - Show quick tutorial overlay (optional)

5. **Create Interactive Tutorial**
   - Overlay tooltip system (highlight + text)
   - 5-step tutorial:
     1. "This is the canvas. Double-click to add a node"
     2. "Drag from here to connect nodes"
     3. "Click a node to see details"
     4. "Click 'Example Cases' to run simulations"
     5. "Save your work with Export button"
   - "Next" and "Skip Tutorial" buttons
   - Can be retriggered from Help menu

**Demo**: Fresh load shows welcome screen, click template button, see Pet Clinic diagram, run example cases, show tutorial walkthrough

---

## Phase 8: Advanced Features & Polish
**Duration**: 8-10 days
**Deliverable**: Production-ready tool with search, validation, export formats, keyboard shortcuts, undo/redo

### Steps:

1. **Implement Search & Filter**
   - Search bar in header
   - Search across: node names, descriptions, tags, metadata
   - Highlight matching nodes (dim others)
   - Filter by node type (checkboxes in sidebar)
   - Filter by status, owner, tags
   - Clear filters button
   - Show count: "5 of 12 nodes visible"

2. **Add Validation & Linting**
   - Create validation rules:
     - Orphan nodes (no connections)
     - Dead ends (no outgoing edges from non-terminal nodes)
     - Missing required fields (name)
     - Circular dependencies in paths
   - Show warnings in sidebar panel
   - Click warning to highlight offending node
   - Auto-validate on change (debounced)

3. **Implement Export Formats**
   - **PNG Export**: Use `html-to-image` library
     - Capture canvas as image
     - Download as PNG
     - Options: Include/exclude UI, resolution
   - **SVG Export**: React Flow built-in support
   - **Standalone HTML**:
     - Bundle diagram data into self-contained HTML file
     - Include minified React Flow and viewer code
     - Can be opened without server (file://)

4. **Keyboard Shortcuts**
   - Implement shortcuts:
     - `Ctrl/Cmd + S`: Save/Export
     - `Ctrl/Cmd + O`: Open diagram
     - `Delete`: Delete selected node/edge
     - `Ctrl/Cmd + Z`: Undo
     - `Ctrl/Cmd + Shift + Z`: Redo
     - `Ctrl/Cmd + D`: Duplicate node
     - `Space + Drag`: Pan canvas
     - `/`: Focus search
   - Show cheatsheet modal: `?` key
   - Display shortcuts in tooltips

5. **Undo/Redo System**
   - Create history stack (array of diagram states)
   - Push to stack on every change (debounced 1 second)
   - Limit stack size (50 states max)
   - Undo: Pop from stack, restore previous state
   - Redo: Re-apply undone state
   - Store stack in sessionStorage (clear on tab close)
   - Show undo/redo buttons in header (disabled if stack empty)

**Demo**: Create complex diagram, search for nodes, show validation warnings, export as PNG/SVG/HTML, use keyboard shortcuts, undo/redo changes

---

## Phase 9: Documentation, Optimization & Deployment
**Duration**: 5-7 days
**Deliverable**: Production deployment with documentation, optimized performance

### Steps:

1. **Write User Documentation**
   - Create `docs/user-guide.md`:
     - Getting started
     - Creating nodes and edges
     - Node types and metadata
     - Conditional logic and branching
     - Example cases and simulation
     - Saving and loading diagrams
     - Keyboard shortcuts
     - Tips and tricks
   - Create in-app help panel (markdown rendered)
   - Link to documentation from header Help menu

2. **Performance Optimization**
   - Implement lazy rendering for large diagrams (>50 nodes)
   - Use React.memo for node components
   - Debounce expensive operations (search, auto-save)
   - Optimize re-renders: useCallback, useMemo
   - Test with 100+ node diagram
   - Optimize bundle size (code splitting if needed)
   - Add loading skeleton for initial load

3. **Create Landing Page**
   - Simple landing page with:
     - Hero section with screenshot
     - Feature list
     - "Try It Now" button (opens app)
     - Link to documentation
     - GitHub repository link
   - Deploy to `index.html` with app as `/app.html`

4. **Deploy to Static Hosting**
   - Build production bundle: `npm run build`
   - Test production build locally: `npm run preview`
   - Deploy to GitHub Pages:
     - Create `gh-pages` branch
     - Configure Vite base path
     - Set up GitHub Actions for auto-deployment
   - Alternative: Netlify drop (drag dist folder)
   - Configure custom domain (optional)

5. **Final Testing & Bug Fixes**
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - Mobile/tablet testing (responsive layout)
   - Test all features end-to-end
   - Fix critical bugs
   - Performance testing (Lighthouse score)
   - Accessibility testing (keyboard navigation, screen reader)
   - Create bug tracker (GitHub Issues)

**Demo**: Live deployed application, complete user documentation, optimized performance, works on all browsers

---

## Phase 10 (Future Enhancements - Out of Scope)

These features can be added after Phase 9 based on user feedback:

1. **Collaboration Features**
   - Real-time collaboration using WebRTC (P2P)
   - Comments and annotations
   - User presence indicators

2. **Advanced Analysis**
   - Dependency analysis tools
   - Path finding algorithms
   - Impact analysis

3. **Integrations**
   - Import from architecture-as-code tools
   - Export to documentation platforms
   - API for programmatic diagram creation

4. **AI Features**
   - Diagram generation from text descriptions
   - Auto-layout suggestions
   - Smart node recommendations

---

## Success Metrics

At the end of each phase, evaluate against these criteria:

- ✅ **Functional**: Feature works as specified
- ✅ **Presentable**: Can demo to stakeholders
- ✅ **Tested**: Manually tested, no critical bugs
- ✅ **Documented**: README or inline comments explain usage
- ✅ **Committed**: Code committed to Git with clear message

---

## Risk Management

**Potential Risks & Mitigation**:

1. **React Flow Learning Curve**
   - Mitigation: Start with simple examples, read official docs
   - Fallback: Use existing system-design-visualizer as reference

2. **Complex State Management**
   - Mitigation: Use Zustand or Context API, keep state simple
   - Fallback: Start with useState, refactor later if needed

3. **Simulation Engine Complexity**
   - Mitigation: Use existing expression evaluator library (`expr-eval`)
   - Fallback: Support only simple boolean conditions initially

4. **Performance with Large Diagrams**
   - Mitigation: Test with 100+ nodes early (Phase 8)
   - Fallback: Add virtualization, lazy loading

5. **Browser Compatibility**
   - Mitigation: Use modern but widely-supported APIs
   - Fallback: Add polyfills, test on all major browsers

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Set up project** tracking (GitHub Projects, Trello, etc.)
3. **Begin Phase 0** - Foundation & Setup
4. **Iterate**: After each phase, gather feedback and adjust plan

---

## Notes

- **Flexibility**: Phases can be reordered based on priorities
- **Timeline**: Estimates assume 15-20 hours/week per developer
- **Dependencies**: Each phase builds on previous phases (sequential)
- **MVP**: Phases 0-5 constitute a Minimum Viable Product
- **Full Feature Set**: Phases 0-9 deliver complete product per requirements

**Good luck building! 🚀**
