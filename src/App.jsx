import { useState, useEffect } from "react";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NodeDetailPanel from "./components/NodeDetailPanel";
import SaveDiagramDialog from "./components/SaveDiagramDialog";
import OpenDiagramDialog from "./components/OpenDiagramDialog";
import MermaidImportDialog from "./components/MermaidImportDialog";
import { useDiagramState } from "./hooks/useDiagramState";
import { useSession } from "./hooks/useSession";
import { exportDiagram } from "./utils/exportDiagram";
import { importDiagram } from "./utils/importDiagram";
import { saveDiagram, loadDiagram } from "./utils/diagramLibrary";

// Wrapper component to access ReactFlow context
function DiagramContent({ nodes, edges, onNodesChange, onEdgesChange, addNode, onNodeClick, setEdges, setNodes, selectedNode, handleClosePanel, updateNode, onExport, onSave, onOpen, onImportMermaid, isDirty, lastSaved, triggerAutoSave }) {
  const { getViewport, setViewport } = useReactFlow();

  const handleExport = () => {
    const viewport = getViewport();
    exportDiagram(nodes, edges, viewport, "DiagramFlow");
    onExport();
  };

  const handleImport = async (file) => {
    const result = await importDiagram(file);

    if (result.success) {
      // Replace nodes and edges
      setNodes(result.data.nodes);
      setEdges(result.data.edges);

      // Restore viewport
      if (result.data.viewport) {
        setViewport(result.data.viewport);
      }

      console.log("Diagram imported successfully");
    } else {
      // Show error
      console.error("Import failed:", result.error);
      alert(`Import failed: ${result.error}`);
    }
  };

  const handleSave = () => {
    const viewport = getViewport();
    onSave(viewport);
  };

  // Auto-save with viewport (30-second debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const viewport = getViewport();
      triggerAutoSave(viewport);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [nodes, edges, getViewport, triggerAutoSave]);

  return (
    <>
      <Header
        onExport={handleExport}
        onImport={handleImport}
        onSave={handleSave}
        onOpen={onOpen}
        onImportMermaid={onImportMermaid}
        isDirty={isDirty}
        lastSaved={lastSaved}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAddNode={addNode} />
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onAddNode={addNode}
          onNodeClick={onNodeClick}
          setEdges={setEdges}
        />
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={handleClosePanel}
            onUpdate={updateNode}
          />
        )}
      </div>
    </>
  );
}

function App() {
  // Initialize session management
  const {
    sessionId,
    isInitialized,
    setActiveDiagram,
    updatePreferences,
    addRecentDiagram,
  } = useSession();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNode,
    setEdges,
    setNodes,
    isDirty,
    lastSaved,
    triggerAutoSave,
    saveState,
  } = useDiagramState();

  const [selectedNode, setSelectedNode] = useState(null);
  const [currentDiagramId, setCurrentDiagramId] = useState(null);
  const [currentDiagramName, setCurrentDiagramName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showMermaidImportDialog, setShowMermaidImportDialog] = useState(false);
  const [pendingViewport, setPendingViewport] = useState(null);

  // Log session initialization (for verification)
  if (isInitialized && sessionId) {
    console.log(`Session initialized: ${sessionId}`);
  }

  // Warn before closing tab if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Modern browsers require this
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  const handleExportComplete = () => {
    // Optional: Show toast notification or feedback
    console.log("Diagram exported successfully");
  };

  const handleSaveClick = (viewport) => {
    setPendingViewport(viewport);
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = (name) => {
    const metadata = saveDiagram({
      id: currentDiagramId,
      name,
      nodes,
      edges,
      viewport: pendingViewport,
    });

    setCurrentDiagramId(metadata.id);
    setCurrentDiagramName(metadata.name);
    setActiveDiagram(metadata.id);
    addRecentDiagram(metadata);

    // Mark as saved to clear dirty state
    saveState(pendingViewport);

    console.log(`Diagram saved: ${metadata.name} (${metadata.id})`);
  };

  const handleOpenClick = () => {
    setShowOpenDialog(true);
  };

  const handleLoadDiagram = (diagramId) => {
    const diagram = loadDiagram(diagramId);

    if (diagram) {
      setNodes(diagram.nodes);
      setEdges(diagram.edges);
      setCurrentDiagramId(diagram.metadata.id);
      setCurrentDiagramName(diagram.metadata.name);
      setActiveDiagram(diagram.metadata.id);

      console.log(`Diagram loaded: ${diagram.metadata.name}`);
    } else {
      alert('Failed to load diagram');
    }
  };

  const handleMermaidImportClick = () => {
    setShowMermaidImportDialog(true);
  };

  const handleMermaidImport = (nodes, edges) => {
    setNodes(nodes);
    setEdges(edges);
    console.log(`Mermaid diagram imported: ${nodes.length} nodes, ${edges.length} edges`);
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <ReactFlowProvider>
        <DiagramContent
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          addNode={addNode}
          onNodeClick={handleNodeClick}
          setEdges={setEdges}
          setNodes={setNodes}
          selectedNode={selectedNode}
          handleClosePanel={handleClosePanel}
          updateNode={updateNode}
          onExport={handleExportComplete}
          onSave={handleSaveClick}
          onOpen={handleOpenClick}
          onImportMermaid={handleMermaidImportClick}
          isDirty={isDirty}
          lastSaved={lastSaved}
          triggerAutoSave={triggerAutoSave}
        />
      </ReactFlowProvider>

      {/* Save Dialog */}
      <SaveDiagramDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveConfirm}
        currentName={currentDiagramName}
      />

      {/* Open Dialog */}
      <OpenDiagramDialog
        isOpen={showOpenDialog}
        onClose={() => setShowOpenDialog(false)}
        onLoad={handleLoadDiagram}
      />

      {/* Mermaid Import Dialog */}
      <MermaidImportDialog
        isOpen={showMermaidImportDialog}
        onClose={() => setShowMermaidImportDialog(false)}
        onImport={handleMermaidImport}
      />
    </div>
  );
}

export default App;
