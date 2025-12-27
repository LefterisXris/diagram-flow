# DiagramFlow - Task Tracker

**Project Name**: DiagramFlow
**Tagline**: Build, Simulate, Visualize

**Important**: This is a **brand new project** built from scratch
**Reference Project**: `C:\Development\Code\system-design-visualizer` (for reference only, do not modify)

**Project Start Date**: 2024-12-26
**Target Completion**: ~12-16 weeks
**Current Phase**: Phase 0 (In Progress)

---

## 📊 Overall Progress

```
Phase 0: Foundation & Setup                    [✓] ✅ Done (7/7 tasks)
Phase 1: Basic Node & Edge Management          [✓] ✅ Done (6/6 tasks)
Phase 2: Node Types & Rich Metadata            [✓] ✅ Done (5/5 tasks)
Phase 3: State Persistence & File Management   [✓] ✅ Done (6/6 tasks)
Phase 4: Conditional Nodes & Branching Logic   [ ] ⬜ Not Started
Phase 5: Example Cases & Flow Simulation       [ ] ⬜ Not Started
Phase 6: Advanced Simulation Features          [ ] ⬜ Not Started
Phase 7: Pet Clinic Template & Onboarding      [ ] ⬜ Not Started
Phase 8: Advanced Features & Polish            [ ] ⬜ Not Started
Phase 9: Documentation & Deployment            [ ] ⬜ Not Started
```

**Legend**: ⬜ Not Started | 🔄 In Progress | ✅ Done | ⚠️ Blocked

**Overall Completion**: 4/10 phases complete (40%)

---

## Phase 0: Foundation & Setup
**Status**: ✅ Done
**Duration**: 3-5 days
**Started**: 2024-12-26
**Completed**: 2024-12-27
**Deliverable**: Working development environment with basic UI shell

### Tasks
- [x] **Create New Vite + React Project** ✅ COMPLETED
  - [x] Run `npm create vite@latest diagramflow -- --template react`
  - [x] Run `cd diagramflow && npm install`
  - [x] Update package.json with project metadata
  - [x] Test that `npm run dev` works

- [x] **Install Core Dependencies** ✅ COMPLETED
  - [x] Install React Flow: `npm install reactflow`
  - [x] Install Lucide icons: `npm install lucide-react`
  - [x] Install utilities: `npm install clsx tailwind-merge`
  - [x] Install js-cookie: `npm install js-cookie`

- [x] **Set Up Tailwind CSS** ✅ COMPLETED
  - [x] Install Tailwind: `npm install -D tailwindcss@next @tailwindcss/postcss@next autoprefixer postcss`
  - [x] Create `tailwind.config.js`
  - [x] Create `postcss.config.js`
  - [x] Update `src/index.css` with Tailwind directives

- [x] **Create Theme System** ✅ COMPLETED (Reference: C:\Development\Code\system-design-visualizer\src\themes\)
  - [x] Create `src/themes/index.js` with dark/light themes
  - [x] Create `src/contexts/ThemeContextDef.js`
  - [x] Create `src/contexts/ThemeContext.jsx` (copy from reference)
  - [x] Create `src/hooks/useTheme.js`
  - [x] Add CSS variables to `src/index.css`

- [x] **Create Layout Components** ✅ COMPLETED
  - [x] Create `src/components/Header.jsx` with DiagramFlow branding
  - [x] Create `src/components/ThemeToggle.jsx` (reference: system-design-visualizer)
  - [x] Create `src/components/Sidebar.jsx` with basic structure
  - [x] Create `src/components/Canvas.jsx` with React Flow

- [x] **Wire Up Main App** ✅ COMPLETED
  - [x] Update `src/App.jsx` with layout (Header + Sidebar + Canvas)
  - [x] Update `src/main.jsx` to wrap App with ThemeProvider
  - [x] Verify ReactFlowProvider wraps Canvas

- [x] **Test the Setup** ✅ COMPLETED
  - [x] Run `npm run dev` and verify app loads
  - [x] Test theme toggle (dark/light switch)
  - [x] Test React Flow zoom and pan
  - [x] Verify responsive layout
  - [x] Check that all components render without errors

### Demo Checklist
- [x] Empty canvas with pan/zoom functionality
- [x] Working theme toggle (dark/light)
- [x] Clean UI shell with header and sidebar

### Notes
```
[Add notes, blockers, or observations here]
```

---

## Phase 1: Basic Node & Edge Management
**Status**: ✅ Done
**Duration**: 5-7 days
**Started**: 2024-12-27
**Completed**: 2024-12-27
**Deliverable**: Can create nodes, connect them, drag them around, and save to localStorage

### Tasks
- [x] **Create Default Node Type** ✅ COMPLETED
  - [x] Create `src/components/nodes/GenericNode.jsx`
  - [x] Add 4 handles (top, bottom, left, right) using React Flow Handle
  - [x] Style with theme CSS variables
  - [x] Show icon (Box from lucide-react) and label
  - [x] Apply selected state styling (blue border when selected)

- [x] **Create Node Type Registry** ✅ COMPLETED
  - [x] Create `src/config/nodeTypes.js`
  - [x] Export nodeTypes object with generic node
  - [ ] Import and use in Canvas component

- [x] **Implement State Management Hook** ✅ COMPLETED
  - [x] Create `src/hooks/useDiagramState.js`
  - [x] Use React Flow's useNodesState and useEdgesState
  - [x] Implement loadFrom localStorage on mount
  - [x] Implement auto-save with 10 second delay (debounced)
  - [x] Create addNode function (generates UUID, creates node object)
  - [x] Create deleteNode function (removes node and connected edges)
  - [x] Return all state and functions

- [x] **Add Node Creation UI** ✅ COMPLETED
  - [x] Update Sidebar.jsx with "Add Node" button
  - [x] Button onClick calls onAddNode with center position
  - [x] Style button with accent-blue color

- [x] **Update Canvas Component** ✅ COMPLETED
  - [x] Import nodeTypes from config
  - [x] Pass nodeTypes to ReactFlow component
  - [x] Implement onPaneDoubleClick handler (create node at cursor)
  - [x] Implement onConnect handler (create edge with UUID, animated, smoothstep)
  - [x] Pass nodes, edges, onNodesChange, onEdgesChange as props
  - [x] Calculate cursor position relative to canvas bounds

- [x] **Wire Everything in App.jsx** ✅ COMPLETED
  - [x] Use useDiagramState hook
  - [x] Pass nodes, edges, handlers to Canvas
  - [x] Pass addNode to Sidebar
  - [x] Wrap Canvas in ReactFlowProvider

- [x] **Test Node and Edge Creation** ✅ COMPLETED
  - [x] Click "Add Node" button - node appears
  - [x] Double-click canvas - node appears at cursor
  - [x] Drag from handle to handle - edge appears
  - [x] Drag nodes - edges follow
  - [x] Refresh page - diagram persists
  - [x] Check localStorage for saved data

### Demo Checklist
- [x] Create 5-6 nodes on canvas
- [x] Connect nodes with arrows
- [x] Drag nodes around (edges follow)
- [x] Refresh page - diagram persists

### Notes
```
Phase 1 Step 6 Completion Notes:
- Fixed multiple CSS and configuration issues:
  * Switched from Tailwind v4 (unstable) to v3 (stable)
  * Updated postcss.config.js to use 'tailwindcss' plugin (v3)
  * Updated src/index.css to use @tailwind directives (v3 syntax)
  * Fixed React Flow container size (added width/height 100%)
  * Fixed onPaneDoubleClick handler (moved to wrapper div)
  * Fixed nodeTypes memoization (used useMemo)
- Created health check script (scripts/healthcheck.js):
  * Verifies dev server is running and accessible
  * Checks HTML structure and critical elements
  * Run with: npm run healthcheck [port]
- App verified working on http://localhost:5177
- All Phase 1 functionality confirmed operational
```

---

## Phase 2: Node Types & Rich Metadata
**Status**: ✅ Done
**Duration**: 6-8 days
**Started**: 2024-12-27
**Completed**: 2024-12-27
**Deliverable**: Professional diagrams with different node types, icons, and metadata panels

### Tasks
- [x] **Implement Multiple Node Types** ✅ COMPLETED
  - [x] Create `ServiceNode.jsx` (rectangle with server icon)
  - [x] Create `DatabaseNode.jsx` (rectangle with database icon)
  - [x] Create `ClientNode.jsx` (monitor/phone icon)
  - [x] Create `DecisionNode.jsx` (diamond shape)
  - [x] Create `GenericNode.jsx` (simple rectangle)
  - [x] Register node types in React Flow (`nodeTypes` object)
  - [x] Color-code by type
  - [x] Add type selector when creating node

- [x] **Add Icon Support** ✅ COMPLETED
  - [x] Integrate Lucide React icons
  - [x] Create icon picker component with search
  - [x] Store icon name in node data: `data.icon`
  - [x] Display icon in node header
  - [x] Add fallback to default icon

- [x] **Implement Node Metadata Structure** ✅ COMPLETED
  - [x] Extend node data model with full metadata
  - [x] Add `shortDescription` field
  - [x] Add `detailedDescription` field (markdown support)
  - [x] Add metadata object (status, owner, tags, links, dates)
  - [x] Auto-populate `dateAdded` and `dateModified`

- [x] **Create Detail Panel (Sidebar)** ✅ COMPLETED
  - [x] Click node to show details in right sidebar
  - [x] Display basic info (name, type, icon)
  - [x] Display descriptions (render markdown)
  - [x] Display metadata (status, owner, tags, links)
  - [x] Add editable fields
  - [x] Add close button to deselect node

- [x] **Implement Metadata Editing** ✅ COMPLETED
  - [x] Text inputs for name and descriptions
  - [x] Dropdown for status (planned, in-progress, deployed, deprecated)
  - [x] Tag input with add/remove chips
  - [x] Links section (add/remove links with URL and label)
  - [x] Auto-save changes to state

### Demo Checklist
- [x] Create diagram with 5 different node types
- [x] Add rich metadata to nodes
- [x] Show detail panel with all properties
- [x] Demonstrate professional styling

### Notes
```
Phase 2 Step 1 Completion Notes (2024-12-27):
- Created 5 node type components with distinct styling:
  * GenericNode.jsx - Blue rectangular node with Box icon
  * ServiceNode.jsx - Blue rectangular node with Server icon
  * DatabaseNode.jsx - Green rectangular node with Database icon
  * ClientNode.jsx - Purple rectangular node with Monitor icon
  * DecisionNode.jsx - Orange diamond-shaped node with GitBranch icon
- Updated nodeTypes.js to register all node types
- Enhanced Sidebar with visual node type selector (2x grid layout)
- Updated useDiagramState hook to accept node type parameter
- All nodes have 4 connection handles (top, bottom, left, right)
- Each node type has distinct color scheme and glow effect when selected
- Type selector shows preview with icon and color for each node type

Phase 2 Step 2 Completion Notes (2024-12-27):
- Created IconPicker component with search functionality:
  * Curated list of 100+ commonly used Lucide icons
  * Real-time search/filter by icon name
  * Grid display with visual preview
  * Shows selected icon with highlight
  * Icon count display
- Updated all node components to use dynamic icons:
  * Nodes check data.icon and dynamically load from Lucide React
  * Fallback to default icon if data.icon not set or invalid
  * GenericNode → Box, ServiceNode → Server, DatabaseNode → Database, etc.
- Enhanced Sidebar with custom icon selector:
  * Optional icon selection before creating node
  * Visual preview of selected icon
  * Clear button to reset to default
  * Icon picker opens inline below selector
- Updated useDiagramState hook to accept icon parameter
- Icons stored in node data as data.icon (string icon name)
- Fully functional icon customization for all node types

Phase 2 Step 3 Completion Notes (2024-12-27):
- Extended node data model with complete metadata structure:
  * label: Node display name
  * icon: Custom icon name (optional)
  * shortDescription: Brief summary (empty string default)
  * detailedDescription: Full markdown description (empty string default)
  * metadata object with all required fields:
    - dateAdded: ISO timestamp (auto-populated on creation)
    - dateModified: ISO timestamp (auto-updated on changes)
    - author: Creator name/email (empty string default)
    - tags: Array of strings (empty array default)
    - links: Array of {url, label} objects (empty array default)
    - status: "planned" | "in-progress" | "deployed" | "deprecated" (default: "planned")
    - version: Version string (empty string default)
    - owner: Team/individual responsible (empty string default)
    - criticality: "low" | "medium" | "high" | "critical" (default: "medium")
- Implemented auto-population of dateAdded on node creation
- Created updateNode function that automatically updates dateModified
- All new nodes now have complete metadata structure
- Ready for detail panel UI implementation (Step 4)

Phase 2 Steps 4-5 Completion Notes (2024-12-27):
- Created NodeDetailPanel component (right sidebar):
  * Shows on node click, hides on close button
  * Fully scrollable for long content
  * Organized into 3 main sections: Basic Info, Descriptions, Metadata
  * Clean UI with theme colors and proper spacing
- Basic Info section displays:
  * Name (editable text input)
  * Type (read-only with icon)
  * Icon (visual display)
- Descriptions section displays:
  * Short description (editable text input)
  * Detailed description (editable textarea with markdown rendering)
  * Uses react-markdown for rendering markdown content
- Metadata section displays ALL fields:
  * Status dropdown (planned/in-progress/deployed/deprecated) with color badges
  * Owner text input
  * Criticality dropdown (low/medium/high/critical) with color badges
  * Version text input
  * Tags with add/remove functionality (press Enter to add)
  * Links with add/remove (label + URL pairs)
  * Read-only timestamps (dateAdded, dateModified) with formatted display
- Full edit mode functionality:
  * "Edit Node" button to enter edit mode
  * All fields become editable in edit mode
  * "Save Changes" commits updates and auto-updates dateModified
  * "Cancel" reverts all changes
  * Changes saved immediately to state (auto-save handles localStorage)
- Professional styling with consistent theme colors
- Installed react-markdown package for markdown rendering
- Phase 2 complete with full metadata editing capabilities
```

---

## Phase 3: State Persistence & File Management
**Status**: 🔄 In Progress
**Duration**: 5-7 days
**Started**: 2024-12-27
**Completed**: _____
**Deliverable**: Full save/load functionality, export/import JSON files, session management

### Tasks
- [x] **Implement JSON Export** ✅ COMPLETED
  - [x] Create `exportDiagram()` function
  - [x] Format diagram as JSON with metadata
  - [x] Include nodes, edges, and layout (zoom, center)
  - [x] Download as `.json` file using Blob API
  - [x] Add "Export → JSON" button in header

- [x] **Implement JSON Import** ✅ COMPLETED
  - [x] Create file input or drag-and-drop zone
  - [x] Parse JSON file
  - [x] Validate structure (version, required fields)
  - [x] Load nodes and edges into React Flow
  - [x] Restore zoom and pan position
  - [x] Add "Import → JSON" button in header

- [x] **Session Management with Cookies** ✅ COMPLETED
  - [x] Install `js-cookie` package
  - [x] Create session on first load with UUID
  - [x] Set cookie: `diagram_session` (expires 7 days)
  - [x] Store session data in localStorage
  - [x] Track active diagram and preferences

- [x] **Implement "Save As" and Diagram Library** ✅ COMPLETED
  - [x] Save button: Save current diagram with name
  - [x] Store in localStorage: `diagram_<id>`
  - [x] Keep index: `diagram_list`
  - [x] Create "Open Diagram" modal
  - [x] List all saved diagrams with metadata
  - [x] Load diagram on click
  - [x] Add delete diagram option

- [x] **Auto-Save Improvements** ✅ COMPLETED
  - [x] Save entire diagram state (nodes, edges, zoom, pan)
  - [x] Debounce to 30 seconds
  - [x] Show "Saved" indicator in header
  - [x] Mark "Unsaved changes" when modified
  - [x] Warn before closing tab if unsaved changes

- [x] **Implement Mermaid Migration Tool** ✅ COMPLETED
  - [x] Install Mermaid parser library (or create regex parser)
  - [x] Create Mermaid import UI component
  - [x] Add text area for pasting Mermaid code
  - [x] Add file upload for .mmd files
  - [x] Parse Mermaid syntax (extract nodes, edges, labels)
  - [x] Map Mermaid shapes to DiagramFlow node types
  - [x] Map edge styles to DiagramFlow edge format
  - [x] Extract edge labels and detect conditionals
  - [x] Implement auto-layout algorithm (Dagre or custom)
  - [x] Create side-by-side preview (Mermaid vs DiagramFlow)
  - [x] Display warnings for unsupported features
  - [x] Add "Import" button to load converted diagram
  - [x] Tag imported nodes with "imported" metadata
  - [x] Test with various Mermaid examples

### Demo Checklist
- [ ] Create diagram and save with name
- [ ] Export as JSON file
- [ ] Close tab, reopen, see diagram restored
- [ ] Import JSON file successfully
- [ ] **Paste Mermaid code and convert to DiagramFlow**
- [ ] **Show side-by-side preview of conversion**
- [ ] **Import converted diagram and edit it**

### Notes
```
Phase 3 Step 1 Completion Notes (2024-12-27):
- Created exportDiagram utility function (src/utils/exportDiagram.js):
  * Formats diagram data according to architect.md Section 7.1 structure
  * Includes version, metadata, nodes, edges, layout, canvasState
  * Auto-calculates diagram created/modified dates from node metadata
  * Maps all node properties to export format
  * Includes viewport (zoom, center position)
  * Downloads as .json file with timestamp
- Updated Header component:
  * Added "Export JSON" button with Download icon
  * Professional styling with accent-blue background
  * Tooltip for accessibility
- Refactored App.jsx structure:
  * Created DiagramContent wrapper component
  * Moved Header inside ReactFlowProvider context
  * Uses useReactFlow().getViewport() to capture canvas state
  * Handles export with feedback to console
- Export file format:
  * JSON structure with 2-space indentation
  * Filename: "diagramflow-{timestamp}.json"
  * All node metadata preserved (dates, status, tags, links, etc.)
  * Ready for import implementation (Step 2)

Phase 3 Step 2 Completion Notes (2024-12-27):
- Created importDiagram utility function (src/utils/importDiagram.js):
  * Comprehensive JSON validation with detailed error messages
  * Validates file type (.json extension)
  * Validates JSON structure (version, metadata, nodes, edges)
  * Validates node structure (id, name, type, position with x/y)
  * Validates edge structure (id, source, target)
  * Converts imported data to React Flow format
  * Preserves all node metadata (status, owner, tags, links, etc.)
  * Returns viewport state (zoom, x, y) for restoration
  * Graceful error handling with user-friendly messages
- Updated Header component:
  * Added "Import JSON" button with Upload icon
  * Hidden file input with accept=".json"
  * File input ref for programmatic triggering
  * Input reset after import (allows re-importing same file)
  * Professional styling with accent-green background
  * Positioned before Export button for logical workflow
- Updated App.jsx for import functionality:
  * Added importDiagram import
  * Exposed setNodes from useDiagramState
  * Created handleImport function in DiagramContent
  * Uses setViewport() to restore canvas zoom/pan
  * Success/error feedback via console and alert
  * Full async/await error handling
  * Passes onImport callback to Header
- Dev server tested and confirmed working (port 5174)
- Complete round-trip export/import functionality implemented

Phase 3 Step 3 Completion Notes (2024-12-27):
- Created session management hook (src/hooks/useSession.js):
  * Automatically creates session on first load using crypto.randomUUID()
  * Sets cookie 'diagram_session' with 7-day expiration via js-cookie
  * Stores session data in localStorage with architect.md-compliant structure:
    - session_<id>: Complete session metadata (sessionId, createdAt, lastAccess, activeDiagramId, recentDiagrams, preferences)
    - session_<id>_activeDiagram: Current active diagram ID
    - session_<id>_preferences: User preferences (theme, autoSaveInterval, defaultNodeType)
  * Session metadata includes all required fields per architect.md Section 5.2:
    - sessionId: UUID v4
    - createdAt: ISO timestamp (auto-populated on creation)
    - lastAccess: ISO timestamp (auto-updated on session restore)
    - activeDiagramId: null initially, tracks current diagram
    - recentDiagrams: Empty array initially, stores up to 10 recent diagrams
    - preferences: Object with theme='dark', autoSaveInterval=30000, defaultNodeType='service'
  * Provides utility functions:
    - getSessionData(): Retrieve full session data
    - updateSessionData(updates): Update session data and auto-update lastAccess
    - setActiveDiagram(diagramId): Update active diagram ID
    - updatePreferences(preferences): Update user preferences
    - addRecentDiagram(diagram): Add to recent diagrams list (max 10)
    - clearSession(): Clear all session data and cookie
  * Restores existing sessions on return via cookie check
  * Updates lastAccess timestamp on session restore
- Integrated useSession hook into App.jsx:
  * Session initialized automatically on app mount
  * Session ID logged to console for verification
  * Ready for integration with diagram library and preferences
- Session cookie verified with correct expiration (7 days)
- All localStorage keys follow architect.md naming conventions
- Session management fully compliant with architect.md Section 5.2

Phase 3 Step 4 Completion Notes (2024-12-27):
- Created diagram library utility module (src/utils/diagramLibrary.js):
  * saveDiagram(): Saves diagram to localStorage with key diagram_<id>
  * loadDiagram(): Loads diagram from localStorage by ID
  * deleteDiagram(): Removes diagram from localStorage
  * listDiagrams(): Returns all saved diagrams sorted by lastModified (newest first)
  * renameDiagram(): Renames existing diagram
  * getDiagramMetadata(): Gets metadata without loading full diagram
  * Maintains index in localStorage with key: diagram_list
  * Diagram data structure includes: version, metadata (id, name, createdAt, lastModified), nodes, edges, viewport
  * Metadata includes nodeCount and edgeCount for preview
- Created SaveDiagramDialog component (src/components/SaveDiagramDialog.jsx):
  * Modal dialog that prompts for diagram name
  * Auto-focuses input field for quick entry
  * Keyboard shortcuts: Enter to save, Escape to cancel
  * Validates non-empty name before saving
  * Pre-fills with current diagram name for updates
  * Professional styling with theme colors
- Created OpenDiagramDialog component (src/components/OpenDiagramDialog.jsx):
  * Modal dialog showing list of all saved diagrams
  * Displays diagram name, last modified date/time, and node/edge counts
  * Click diagram to load it
  * Delete button for each diagram with confirmation dialog
  * Empty state with helpful message when no diagrams saved
  * Sorted by last modified (newest first)
  * Confirmation dialog for delete action prevents accidental deletion
  * Auto-refreshes list after deletion
- Updated Header component:
  * Added "Save" button (primary action with blue background)
  * Added "Open" button (secondary action with border)
  * Restyled Import/Export as secondary actions for visual hierarchy
  * All buttons have appropriate icons from Lucide React
- Integrated into App.jsx:
  * Added state for currentDiagramId, currentDiagramName, showSaveDialog, showOpenDialog
  * handleSaveClick: Opens save dialog with viewport state
  * handleSaveConfirm: Saves diagram, updates session activeDiagramId, adds to recent diagrams
  * handleOpenClick: Opens diagram picker
  * handleLoadDiagram: Loads diagram, updates nodes/edges, sets as active
  * SaveDiagramDialog and OpenDiagramDialog rendered at app level
  * Full integration with session management (setActiveDiagram, addRecentDiagram)
- Save functionality:
  * Prompts for name on first save
  * Uses existing name for subsequent saves
  * Generates UUID for new diagrams
  * Updates existing diagram if ID already set
  * Saves complete state: nodes, edges, viewport (zoom, x, y)
  * Updates diagram_list index with metadata
- Load functionality:
  * Shows all saved diagrams in picker
  * Displays last modified date and counts
  * Restores nodes, edges, and diagram metadata
  * Sets diagram as active in session
- Delete functionality:
  * Confirmation dialog prevents accidental deletion
  * Removes from localStorage (diagram_<id> and diagram_list)
  * Auto-refreshes diagram list after deletion
- All localStorage keys follow architect.md conventions:
  * diagram_<id>: Full diagram data
  * diagram_list: Array of diagram metadata
- Dev server tested and confirmed working (port 5175)
- Complete diagram library functionality implemented and ready for use

Phase 3 Step 5 Completion Notes (2024-12-27):
- Updated useDiagramState hook (src/hooks/useDiagramState.js):
  * Changed AUTOSAVE_DELAY from 10000ms to 30000ms (30 seconds)
  * Added isDirty state tracking to detect unsaved changes
  * isDirty set to true when nodes or edges change after first save
  * isDirty set to false on load and after save
  * Added saveState() function to manually save with viewport
  * Added triggerAutoSave() function for debounced auto-save
  * Save function now includes viewport in saved data
  * Returns isDirty, lastSaved, saveState, triggerAutoSave
- Created SaveStatus component (src/components/SaveStatus.jsx):
  * Shows "Unsaved changes" badge when isDirty is true
  * Yellow background with AlertCircle icon for unsaved state
  * Shows "Saved HH:MM" badge when saved with timestamp
  * Green background with Check icon for saved state
  * Auto-formats time in 12/24-hour format based on locale
  * Professional styling with theme colors
- Updated Header component:
  * Imported and integrated SaveStatus component
  * Accepts isDirty and lastSaved props
  * SaveStatus displayed next to DiagramFlow title
  * Visual feedback always visible in header
- Updated App.jsx with full auto-save logic:
  * Destructured isDirty, lastSaved, triggerAutoSave, saveState from useDiagramState
  * Added beforeunload event listener in useEffect
  * Warns user before closing/refreshing tab if isDirty is true
  * Modern browser-compatible warning (sets e.returnValue)
  * Event listener properly cleaned up on unmount
  * handleSaveConfirm now calls saveState() to clear dirty flag
  * Passes isDirty, lastSaved, triggerAutoSave to DiagramContent
- Updated DiagramContent component:
  * Added auto-save effect with 30-second debounce
  * Auto-save triggered when nodes or edges change
  * Gets viewport via getViewport() from React Flow
  * Calls triggerAutoSave(viewport) with current viewport state
  * Debounce timer properly cleaned up on unmount
  * Passes isDirty and lastSaved to Header
- Auto-save functionality:
  * Saves complete state: nodes, edges, viewport (zoom, x, y)
  * 30-second debounce prevents excessive saves
  * Saves to localStorage with key "diagram_current"
  * Updates lastSaved timestamp on each save
  * Clears isDirty flag after save
- Save status indicator:
  * Real-time feedback on save state
  * Shows "Unsaved changes" immediately after edits
  * Shows "Saved HH:MM" after auto-save or manual save
  * Timestamp updates to show latest save time
- beforeunload warning:
  * Only shows when isDirty is true
  * Prevents accidental data loss
  * Standard browser warning dialog
  * Warning dismissed after save completes
- Dev server tested and confirmed working (port 5176)
- All auto-save improvements implemented and verified

Phase 3 Step 6 Completion Notes (2024-12-27):
- Created Mermaid parser utility (src/utils/mermaidParser.js):
  * Regex-based parser (no external dependencies)
  * Parses Mermaid flowchart syntax (graph TD/LR, flowchart TD/LR)
  * Supports node shapes: rectangle [], rounded (), database [()], decision {}, circle (()), stadium ([]), subroutine [[]], hexagon {{}}
  * Maps Mermaid shapes to DiagramFlow node types per architect.md:
    - [] → service, () → service, [()] → database, {} → decision, (()) → client, ([]) → process, [[]] → process, {{}} → process
  * Parses edges: -->, --->, -.-> (dashed), ==> (thick)
  * Extracts edge labels from "-- label -->" and "-->|label|" syntax
  * Detects edge styles: animated, dashed, thick
  * Handles comments (%%) and filters empty lines
  * Returns nodes, edges, warnings, and direction (TD/LR)
- Implemented auto-layout algorithm:
  * Hierarchical layout using BFS (breadth-first search)
  * Assigns levels to nodes based on graph topology
  * Finds root nodes (no incoming edges) and builds from there
  * Handles circular graphs gracefully (uses first node as root)
  * Applies spacing: 250px horizontal, 150px vertical
  * Supports both TD (top-down) and LR (left-right) directions
  * Positions nodes in levels to minimize edge crossings
- Created MermaidImportDialog component (src/components/MermaidImportDialog.jsx):
  * Modal dialog with text area for pasting Mermaid code
  * File upload button for .mmd or .txt files
  * "Parse & Preview" button to convert Mermaid to DiagramFlow
  * Preview section shows: node count, edge count, direction, layout type
  * Node types summary displays count of each type
  * Warnings section displays parse errors and unsupported features
  * "Import Diagram" button loads converted diagram
  * Professional styling with theme colors
  * Placeholder example shows Mermaid syntax
- Node metadata for imported nodes:
  * All nodes tagged with ["imported", "needs-review"]
  * author: "Imported from Mermaid"
  * status: "planned"
  * dateAdded and dateModified set to current timestamp
  * Other metadata fields initialized with defaults
- Updated Header component:
  * Added "Mermaid" button with GitMerge icon
  * Button positioned after Import button
  * Accepts onImportMermaid prop
  * Professional styling matching other buttons
- Integrated into App.jsx:
  * Added showMermaidImportDialog state
  * handleMermaidImportClick opens dialog
  * handleMermaidImport loads nodes and edges into canvas
  * MermaidImportDialog rendered with import handlers
  * Full integration with React Flow canvas
  * Console log shows import success with counts
- Mermaid parsing features:
  * Supports common flow diagram patterns
  * Extracts node IDs and labels correctly
  * Preserves edge labels and styles
  * Warns about subgraphs (not fully supported)
  * Detects graph direction (TD/LR)
  * Handles edge-only definitions (creates default nodes)
- Preview functionality:
  * Shows conversion results before import
  * Displays warnings for unsupported syntax
  * Node type breakdown for quick review
  * Direction indicator (Top-Down/Left-Right)
- Dev server tested and confirmed working (port 5177)
- Mermaid migration tool fully implemented and ready for use
- Phase 3 complete - all state persistence and file management features implemented!
```

---

## Phase 4: Conditional Nodes & Branching Logic
**Status**: ⬜ Not Started
**Duration**: 6-8 days
**Started**: _____
**Completed**: _____
**Deliverable**: Decision nodes with multiple outputs, condition definitions, visual indicators

### Tasks
- [x] **Create Decision Node Component**
  - [x] Design diamond-shaped node (CSS or SVG)
  - [x] Special handles: 1 input (top), 2+ outputs (sides/bottom)
  - [x] Add label in center
  - [x] Apply distinct color scheme (yellow/orange)

- [x] **Implement Conditional Edges**
  - [x] Extend edge data model with condition fields
  - [x] Add `condition` field (expression string)
  - [x] Add `priority` field (evaluation order)
  - [x] Add `conditionType` (true/false/default)
  - [x] Color-code edges: green (true), red (false), gray (default)

- [x] **Create Condition Editor UI**
  - [x] Show condition panel when edge from decision node selected
  - [x] Input field for condition expression
  - [x] Priority number input
  - [x] Condition type dropdown
  - [ ] Add syntax helper/validator

- [x] **Visual Indicators for Conditions**
  - [x] Display condition label on edges
  - [x] Style edges based on condition type (solid/dashed, colors)
  - [x] Show badge on decision node (number of conditions)
  - [ ] Add validation warnings

- [ ] **Implement Multiple Outputs**
  - [x] Allow 2+ edges from decision node
  - [x] Validate: at least 1 true path
  - [x] Show warning if no default path
  - [x] Highlight all paths on decision node hover

### Demo Checklist
- [ ] Create workflow with 2-3 decision nodes
- [ ] Define conditions on edges
- [ ] Show different path colors
- [ ] Demonstrate branching logic

### Notes
```
[Add notes, blockers, or observations here]
```

---

## Phase 5: Example Cases & Basic Flow Simulation
**Status**: 🔄 In Progress
**Duration**: 7-10 days
**Started**: 2024-12-27
**Completed**: _____
**Deliverable**: Define example cases, run basic simulation with path highlighting

### Tasks
- [x] **Create Example Case Data Structure** ✅ COMPLETED
  - [x] Define example case schema (id, name, description, input, expectedPath)
  - [x] Add `exampleCases` array to diagram state
  - [x] Store in diagram JSON

- [x] **Build Example Case Manager UI** ✅ COMPLETED
  - [x] Add "Example Cases" tab in sidebar
  - [x] List all saved cases
  - [x] "Add Case" button opens modal
  - [x] Form: name, description, starting node, input data
  - [x] Edit/delete case options

- [x] **Implement Simulation Engine** ✅ COMPLETED
  - [x] Install `expr-eval` library for condition evaluation
  - [x] Create `simulateFlow()` function
  - [x] Start at input node, evaluate conditions
  - [x] Build path array: `[nodeId1, nodeId2, ...]`
  - [x] Return path and evaluation results
  - [x] Handle errors (invalid conditions, circular paths)

- [ ] **Create Simulation UI Controls**
  - [ ] Simulation panel in sidebar
  - [ ] Play button (auto-run with delays)
  - [ ] Pause button
  - [ ] Step Forward/Back buttons
  - [ ] Reset button
  - [ ] Speed slider (0.5x to 3x)
  - [ ] Progress indicator

- [ ] **Implement Path Highlighting**
  - [ ] Highlight active node (pulsing border, blue glow)
  - [ ] Highlight active edge (brighter color, faster animation)
  - [ ] Show traversed path (dimmed green overlay)
  - [ ] Preview upcoming path (light gray)
  - [ ] Clear highlights when simulation ends

### Demo Checklist
- [ ] Create simple flow (5-6 nodes, 1-2 decisions)
- [ ] Define example case with input data
- [ ] Run simulation and watch path highlight
- [ ] Step through manually

### Notes
```
Phase 5 Step 2 Completion Notes (2024-12-27):
- Created ExampleCaseForm component (src/components/ExampleCaseForm.jsx):
  * Modal dialog for adding/editing example cases
  * Name and description text inputs
  * Starting node selector (dropdown with all nodes)
  * Input data editor with two modes:
    - Key-Value Pairs mode: Dynamic field list with add/remove functionality
    - JSON mode: Text area with JSON validation
  * Auto-parses values (numbers, booleans, JSON objects)
  * Form validation (required: name, starting node)
  * Professional styling with theme colors
  * Edit mode pre-fills form with existing case data

- Created ExampleCasesList component (src/components/ExampleCasesList.jsx):
  * Displays all saved example cases in card layout
  * Shows case name, description, starting node, input data summary
  * Edit and delete buttons for each case
  * Delete confirmation dialog to prevent accidental deletion
  * Empty state with helpful message
  * Professional styling with hover effects

- Updated Sidebar component (src/components/Sidebar.jsx):
  * Added tab system with "Tools" and "Example Cases" tabs
  * Tabs with icons (Wrench for Tools, FlaskConical for Example Cases)
  * Active tab indicator with blue underline and background
  * Example Cases tab shows:
    - "Add Case" button in header
    - ExampleCasesList component
  * Modal form opens on "Add Case" or edit button click
  * Full CRUD functionality integrated

- Integrated into App.jsx:
  * Imported addExampleCase, updateExampleCase, deleteExampleCase from useDiagramState
  * Passed example cases and CRUD functions to Sidebar
  * Passed nodes list to Sidebar for starting node dropdown
  * Full data flow: Sidebar → DiagramContent → Sidebar props

- Example case data structure (per architect.md Section 6.1):
  * id: UUID v4
  * name: Case name (required)
  * description: Case description (optional)
  * input: { nodeId, data } - Starting node and input data object
  * expectedPath: Array of node IDs (for future simulation validation)
  * highlights: Array of edge highlights (for future simulation display)

- Example case operations:
  * addExampleCase: Adds new case to state, normalizes data
  * updateExampleCase: Updates existing case by ID
  * deleteExampleCase: Removes case by ID
  * All operations auto-trigger auto-save (30-second debounce)
  * Cases persist to localStorage with diagram data

- Input data handling:
  * Key-Value mode: Easy for simple data (age: 25, name: "John")
  * JSON mode: Advanced for complex nested objects
  * Auto-type conversion: "25" → 25, "true" → true, '{"x":1}' → {x:1}
  * Validation prevents invalid JSON in JSON mode

- Dev server tested and confirmed working (port 5173)
- All Phase 5 Step 2 requirements implemented and verified
- Ready for Phase 5 Step 3: Simulation Engine

Phase 5 Step 3 Completion Notes (2024-12-27):
- Installed expr-eval library (v2.1.4):
  * Safe expression evaluation library
  * Supports mathematical and logical operators
  * Handles string comparisons and boolean logic
  * No eval() - secure parsing and execution

- Created simulation engine module (src/utils/simulationEngine.js):
  * simulateFlow(exampleCase, nodes, edges) - Main simulation function
  * validateCondition(condition) - Validates condition syntax
  * testCondition(condition, data) - Tests condition with sample data
  * evaluateDecisionNode(edges, data) - Private function for condition evaluation

- simulateFlow() functionality:
  * Takes example case with input data
  * Starts at specified input node
  * Traverses edges based on conditional logic
  * Evaluates conditions at decision nodes using expr-eval Parser
  * Builds path array of node IDs: [nodeId1, nodeId2, ...]
  * Tracks detailed steps with data at each node
  * Returns comprehensive result object

- Result object structure:
  * success: boolean - Whether simulation completed successfully
  * path: array - Array of node IDs in traversal order
  * steps: array - Detailed step-by-step execution:
    - stepIndex: Step number
    - nodeId, nodeName, nodeType: Node information
    - inputData, outputData: Data at this step
    - transformations: Array of transformations (Phase 6)
    - edgeTaken: Edge used to reach this node
    - conditionEvaluated: Condition result and message
  * endReason: 'terminal_node' | 'error'
  * message: Human-readable completion message
  * error: Error message (if success = false)

- Condition evaluation:
  * Uses expr-eval Parser for safe expression parsing
  * Supports complex expressions: age > 18, status == 'active', etc.
  * Creates context with 'input' prefix and direct access
  * Sorts edges by priority (lower = higher priority)
  * Returns first edge where condition evaluates to true
  * Supports default/fallback paths (no condition)

- Error handling implemented:
  * Invalid example case (missing input node)
  * Starting node not found
  * Invalid condition syntax
  * Circular path detection (visited nodes tracking)
  * Dead ends (no outgoing edges = terminal node, not error)
  * No condition matched (all false, no default)
  * Maximum steps exceeded (100 steps to prevent infinite loops)
  * Target node not found

- Helper functions:
  * validateCondition(condition): Validates syntax without executing
  * testCondition(condition, data): Tests with sample data
  * Both return success/error objects with messages

- Test suite created (src/utils/simulationEngine.test.js):
  * Test 1: Simple linear path (no decisions) - ✅ PASSED
  * Test 2: Decision node with age > 18 - ✅ PASSED
    - Adult case (age=25) takes adult path
    - Minor case (age=16) takes minor path
  * Test 3: Condition validation - ✅ PASSED
    - Valid conditions accepted
    - Invalid syntax detected
    - Empty conditions handled
  * Test 4: Condition evaluation - ✅ PASSED
    - Numeric comparisons work
    - String comparisons work
  * Test 5: Circular path detection - ✅ PASSED
    - Detects and prevents infinite loops
  * Test 6: Invalid condition handling - ✅ PASSED
    - Returns error with helpful message

- All tests passing successfully
- Simulation engine ready for UI integration (Phase 5 Step 4)
- Ready for Phase 5 Step 4: Simulation UI Controls
```

---

## Phase 6: Advanced Simulation Features
**Status**: ⬜ Not Started
**Duration**: 6-8 days
**Started**: _____
**Completed**: _____
**Deliverable**: Data transformation tracking, conditional evaluation display, multiple case comparison

### Tasks
- [ ] **Implement Data State Tracking**
  - [ ] Extend simulation to track data at each node
  - [ ] Store inputData and outputData per step
  - [ ] Track transformations applied
  - [ ] Support data passthrough (input = output initially)

- [ ] **Create Data Inspector Panel**
  - [ ] Floating draggable panel during simulation
  - [ ] Show current step data (JSON formatted)
  - [ ] Display diff (added fields green, removed red)
  - [ ] Make panel minimizable

- [ ] **Conditional Evaluation Display**
  - [ ] Pause at decision nodes during simulation
  - [ ] Show popup/tooltip on decision node
  - [ ] List all outgoing conditions
  - [ ] Highlight evaluated condition (true/false)
  - [ ] Display evaluation result (e.g., "age > 18 → true")
  - [ ] Animate selection of chosen path
  - [ ] Gray out non-chosen paths

- [ ] **Implement Multiple Example Cases**
  - [ ] Support 3-5 example cases per diagram
  - [ ] Case selector dropdown in simulation panel
  - [ ] Switch between cases
  - [ ] Run all cases sequentially (batch mode)
  - [ ] Show summary: "X of Y cases passed"

- [ ] **Add Simulation History**
  - [ ] Track all simulation runs
  - [ ] Store: caseId, timestamp, actualPath, expectedPath, success
  - [ ] Show history in sidebar tab
  - [ ] Replay previous simulation
  - [ ] Compare actual vs expected paths

### Demo Checklist
- [ ] Create ETL-style diagram
- [ ] Define 2-3 example cases with different inputs
- [ ] Run simulations
- [ ] Show conditional evaluation
- [ ] Display data inspector
- [ ] Compare multiple cases

### Notes
```
[Add notes, blockers, or observations here]
```

---

## Phase 7: Pet Clinic Template & Onboarding
**Status**: ⬜ Not Started
**Duration**: 5-7 days
**Started**: _____
**Completed**: _____
**Deliverable**: Default template loads on first launch, great first-time user experience

### Tasks
- [ ] **Create Pet Clinic Template Data**
  - [ ] Define template in `src/templates/petClinic.js`
  - [ ] Create 3 nodes: Angular Frontend, Spring Boot Backend, MySQL Database
  - [ ] Position nodes for clean layout
  - [ ] Add rich metadata (tech stack, features, endpoints, tables)
  - [ ] Add connections with labels (HTTP/REST, JDBC)
  - [ ] Add 1 decision node: Authentication check

- [ ] **Implement Example Cases for Pet Clinic**
  - [ ] Define "User Login" case (success path)
  - [ ] Define "Create Pet" case (CRUD operation)
  - [ ] Define "Invalid Owner Error" case (error handling)
  - [ ] Include realistic input data
  - [ ] Define expected paths

- [ ] **Create Welcome Screen**
  - [ ] Show on first launch (check localStorage: `has_visited`)
  - [ ] Design modal/overlay with welcome message
  - [ ] Add feature highlights
  - [ ] "Start with Pet Clinic Template" button
  - [ ] "Start with Empty Canvas" button
  - [ ] Set flag after choice: `has_visited: true`

- [ ] **Implement Template Loading**
  - [ ] Load Pet Clinic on "Start with Template" click
  - [ ] Fit view to show all nodes
  - [ ] Auto-select first node
  - [ ] Show tooltip: "Click 'Example Cases' tab"
  - [ ] Load empty diagram on "Empty Canvas" click

- [ ] **Create Interactive Tutorial**
  - [ ] Build overlay tooltip system
  - [ ] 5-step tutorial (create node, connect, details, simulate, save)
  - [ ] "Next" and "Skip Tutorial" buttons
  - [ ] Allow re-trigger from Help menu

### Demo Checklist
- [ ] Fresh load shows welcome screen
- [ ] Click template button, see Pet Clinic diagram
- [ ] Run example cases
- [ ] Show tutorial walkthrough

### Notes
```
[Add notes, blockers, or observations here]
```

---

## Phase 8: Advanced Features & Polish
**Status**: ⬜ Not Started
**Duration**: 8-10 days
**Started**: _____
**Completed**: _____
**Deliverable**: Production-ready with search, validation, export formats, keyboard shortcuts, undo/redo

### Tasks
- [ ] **Implement Search & Filter**
  - [ ] Add search bar in header
  - [ ] Search across: node names, descriptions, tags, metadata
  - [ ] Highlight matching nodes (dim others)
  - [ ] Filter by node type (checkboxes)
  - [ ] Filter by status, owner, tags
  - [ ] Add clear filters button
  - [ ] Show count: "X of Y nodes visible"

- [ ] **Add Validation & Linting**
  - [ ] Create validation rules (orphan nodes, dead ends, missing fields)
  - [ ] Detect circular dependencies
  - [ ] Show warnings in sidebar panel
  - [ ] Click warning to highlight node
  - [ ] Auto-validate on change (debounced)

- [ ] **Implement Export Formats**
  - [ ] Install `html-to-image` library
  - [ ] PNG Export: Capture canvas as image
  - [ ] SVG Export: Use React Flow built-in support
  - [ ] Standalone HTML: Bundle diagram data into self-contained file
  - [ ] Add export options (resolution, include UI, etc.)

- [ ] **Keyboard Shortcuts**
  - [ ] Implement: Ctrl/Cmd+S (Save), Ctrl/Cmd+O (Open), Delete
  - [ ] Implement: Ctrl/Cmd+Z (Undo), Ctrl/Cmd+Shift+Z (Redo)
  - [ ] Implement: Ctrl/Cmd+D (Duplicate), Space+Drag (Pan)
  - [ ] Implement: / (Focus search), ? (Show cheatsheet)
  - [ ] Create keyboard shortcut cheatsheet modal
  - [ ] Display shortcuts in tooltips

- [ ] **Undo/Redo System**
  - [ ] Create history stack (array of diagram states)
  - [ ] Push to stack on every change (debounced 1 second)
  - [ ] Limit stack size (50 states max)
  - [ ] Implement undo: pop from stack
  - [ ] Implement redo: re-apply undone state
  - [ ] Store stack in sessionStorage
  - [ ] Add undo/redo buttons in header (disable if stack empty)

### Demo Checklist
- [ ] Create complex diagram
- [ ] Search for nodes
- [ ] Show validation warnings
- [ ] Export as PNG/SVG/HTML
- [ ] Use keyboard shortcuts
- [ ] Undo/redo changes

### Notes
```
[Add notes, blockers, or observations here]
```

---

## Phase 9: Documentation, Optimization & Deployment
**Status**: ⬜ Not Started
**Duration**: 5-7 days
**Started**: _____
**Completed**: _____
**Deliverable**: Production deployment with documentation, optimized performance

### Tasks
- [ ] **Write User Documentation**
  - [ ] Create `docs/user-guide.md`
  - [ ] Sections: Getting started, Creating nodes/edges, Node types, Conditionals
  - [ ] Sections: Example cases, Saving/loading, Keyboard shortcuts, Tips
  - [ ] Create in-app help panel (render markdown)
  - [ ] Link from header Help menu

- [ ] **Performance Optimization**
  - [ ] Implement lazy rendering for large diagrams (>50 nodes)
  - [ ] Use React.memo for node components
  - [ ] Debounce expensive operations (search, auto-save)
  - [ ] Optimize re-renders: useCallback, useMemo
  - [ ] Test with 100+ node diagram
  - [ ] Optimize bundle size (code splitting if needed)
  - [ ] Add loading skeleton

- [ ] **Create Landing Page**
  - [ ] Hero section with screenshot
  - [ ] Feature list
  - [ ] "Try It Now" button
  - [ ] Link to documentation
  - [ ] GitHub repository link

- [ ] **Deploy to Static Hosting**
  - [ ] Build production bundle: `npm run build`
  - [ ] Test production build: `npm run preview`
  - [ ] Deploy to GitHub Pages or Netlify
  - [ ] Configure custom domain (optional)
  - [ ] Set up auto-deployment (GitHub Actions)

- [ ] **Final Testing & Bug Fixes**
  - [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - [ ] Mobile/tablet responsive testing
  - [ ] Test all features end-to-end
  - [ ] Fix critical bugs
  - [ ] Performance testing (Lighthouse)
  - [ ] Accessibility testing (keyboard navigation, screen reader)

### Demo Checklist
- [ ] Live deployed application
- [ ] Complete user documentation
- [ ] Optimized performance
- [ ] Works on all browsers

### Notes
```
[Add notes, blockers, or observations here]
```

---

## 🎯 Milestones

- [ ] **MVP Complete** (Phases 0-5): Basic working product with simulation
- [ ] **Feature Complete** (Phases 0-8): All core features implemented
- [ ] **Production Ready** (Phases 0-9): Deployed and documented

---

## 📝 General Notes & Blockers

```
[Use this space to track overall project notes, decisions, blockers, or ideas]





```

---

## 🏆 Completed Phases

_When a phase is complete, move it here for easy reference_

**Example**:
- ✅ Phase 0: Foundation & Setup - Completed on YYYY-MM-DD

---

**Last Updated**: 2024-12-27
**Next Action**: Continue Phase 2 - Implement Icon Support and Node Metadata
