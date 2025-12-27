import { useState, useEffect } from "react";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NodeDetailPanel from "./components/NodeDetailPanel";
import EdgeConditionPanel from "./components/EdgeConditionPanel";
import ConditionalEvaluationPopup from "./components/ConditionalEvaluationPopup";
import DataInspectorPanel from "./components/DataInspectorPanel";
import SaveDiagramDialog from "./components/SaveDiagramDialog";
import OpenDiagramDialog from "./components/OpenDiagramDialog";
import MermaidImportDialog from "./components/MermaidImportDialog";
import WelcomeScreen from "./components/WelcomeScreen";
import { useDiagramState } from "./hooks/useDiagramState";
import { useSession } from "./hooks/useSession";
import { useSimulationHistory } from "./hooks/useSimulationHistory";
import { exportDiagram } from "./utils/exportDiagram";
import { importDiagram } from "./utils/importDiagram";
import { saveDiagram, loadDiagram } from "./utils/diagramLibrary";
import { applyConditionalEdgeHighlight, normalizeConditionalEdge } from "./utils/edgeConditions";
import { normalizeExampleCases } from "./utils/exampleCases";

// Wrapper component to access ReactFlow context
function DiagramContent({
  nodes,
  edges,
  exampleCases,
  onNodesChange,
  onEdgesChange,
  addNode,
  addExampleCase,
  updateExampleCase,
  deleteExampleCase,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
  setEdges,
  setNodes,
  setExampleCases,
  selectedNode,
  selectedEdge,
  selectedEdgeSource,
  handleClosePanel,
  handleCloseEdgePanel,
  updateNode,
  updateEdge,
  onExport,
  onSave,
  onOpen,
  onImportMermaid,
  isDirty,
  lastSaved,
  triggerAutoSave,
  simulationState,
  onSimulationStateChange,
  simulationHistory,
  onReplaySimulation,
  onDeleteHistoryItem,
  onClearHistory,
  onSimulationComplete,
}) {
  const { getViewport, setViewport } = useReactFlow();

  const handleExport = () => {
    const viewport = getViewport();
    exportDiagram(nodes, edges, viewport, "DiagramFlow", exampleCases);
    onExport();
  };

  const handleImport = async (file) => {
    const result = await importDiagram(file);

    if (result.success) {
      // Replace nodes and edges
      setNodes(result.data.nodes);
      setEdges(result.data.edges);
      setExampleCases(result.data.exampleCases || []);

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
        <Sidebar
          onAddNode={addNode}
          exampleCases={exampleCases}
          onAddExampleCase={addExampleCase}
          onUpdateExampleCase={updateExampleCase}
          onDeleteExampleCase={deleteExampleCase}
          nodes={nodes}
          edges={edges}
          onSimulationStateChange={onSimulationStateChange}
          simulationHistory={simulationHistory}
          onReplaySimulation={onReplaySimulation}
          onDeleteHistoryItem={onDeleteHistoryItem}
          onClearHistory={onClearHistory}
          onSimulationComplete={onSimulationComplete}
        />
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onAddNode={addNode}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          setEdges={setEdges}
          simulationState={simulationState}
        />
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={handleClosePanel}
            onUpdate={updateNode}
          />
        )}
        <EdgeConditionPanel
          edge={selectedEdge}
          sourceNode={selectedEdgeSource}
          onClose={handleCloseEdgePanel}
          onUpdateEdge={updateEdge}
        />
      </div>

      {/* Conditional Evaluation Popup - shows during simulation at decision nodes */}
      {simulationState?.conditionalEvaluationData && (
        <ConditionalEvaluationPopup
          evaluationData={simulationState.conditionalEvaluationData}
          onClose={() => {
            // Popup will auto-hide when moving to next step
          }}
        />
      )}

      {/* Data Inspector Panel - shows current step data during simulation */}
      {simulationState?.isActive && simulationState?.steps && simulationState?.currentStepIndex >= 0 && (
        <DataInspectorPanel
          currentStep={simulationState.steps[simulationState.currentStepIndex]}
          isActive={true}
          onClose={null} // Panel stays open during simulation
        />
      )}
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
    exampleCases,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNode,
    addExampleCase,
    updateExampleCase,
    deleteExampleCase,
    setEdges,
    setNodes,
    setExampleCases,
    isDirty,
    lastSaved,
    triggerAutoSave,
    saveState,
  } = useDiagramState();

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [hoveredDecisionNodeId, setHoveredDecisionNodeId] = useState(null);
  const [currentDiagramId, setCurrentDiagramId] = useState(null);
  const [currentDiagramName, setCurrentDiagramName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showMermaidImportDialog, setShowMermaidImportDialog] = useState(false);
  const [pendingViewport, setPendingViewport] = useState(null);
  const [simulationState, setSimulationState] = useState(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  // Simulation history tracking
  const {
    history: simulationHistory,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
  } = useSimulationHistory(currentDiagramId);

  const handleSimulationStateChange = (newState) => {
    setSimulationState(newState);
  };

  // Replay a simulation from history
  const handleReplaySimulation = (historyItem) => {
    // Find the case
    const caseToReplay = exampleCases.find(c => c.id === historyItem.caseId);
    if (caseToReplay) {
      // This will trigger the simulation in the Sidebar
      // We need to switch to the cases tab and run the simulation
      // For now, just log - will be implemented with Sidebar state
      console.log('Replaying simulation:', historyItem);
      alert(`Replay functionality: Switch to Example Cases tab and run "${historyItem.caseName}"`);
    } else {
      alert('Case not found. It may have been deleted.');
    }
  };

  // Add simulation to history (called from SimulationPanel when simulation completes)
  const handleSimulationComplete = (simulationData) => {
    addToHistory(simulationData);
  };

  // Log session initialization (for verification)
  if (isInitialized && sessionId) {
    console.log(`Session initialized: ${sessionId}`);
  }

  // Check if this is the first visit and show welcome screen
  useEffect(() => {
    const hasVisited = localStorage.getItem('has_visited');
    if (!hasVisited) {
      setShowWelcomeScreen(true);
    }
  }, []);

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
    setSelectedEdgeId(null);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  const handleEdgeClick = (event, edge) => {
    setSelectedNode(null);
    setSelectedEdgeId(edge.id);
  };

  const handleCloseEdgePanel = () => {
    setSelectedEdgeId(null);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
    setSelectedEdgeId(null);
  };

  const handleNodeMouseEnter = (event, node) => {
    if (node.type === "decision") {
      setHoveredDecisionNodeId(node.id);
    }
  };

  const handleNodeMouseLeave = (event, node) => {
    if (node.type === "decision") {
      setHoveredDecisionNodeId(null);
    }
  };

  const updateEdge = (edgeId, updater) => {
    setEdges((eds) =>
      eds.map((edge) => (edge.id === edgeId ? normalizeConditionalEdge(updater(edge)) : edge))
    );
  };

  const selectedEdge = selectedEdgeId
    ? edges.find((edge) => edge.id === selectedEdgeId)
    : null;
  const selectedEdgeSource = selectedEdge
    ? nodes.find((node) => node.id === selectedEdge.source)
    : null;

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const normalized = normalizeConditionalEdge(edge);
        const isOutgoing = hoveredDecisionNodeId && normalized.source === hoveredDecisionNodeId;
        const style = applyConditionalEdgeHighlight(normalized.style, isOutgoing);

        return {
          ...normalized,
          style,
        };
      })
    );
  }, [hoveredDecisionNodeId, setEdges]);

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
      exampleCases,
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
      setExampleCases(normalizeExampleCases(diagram.exampleCases));
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
    setExampleCases([]);
    console.log(`Mermaid diagram imported: ${nodes.length} nodes, ${edges.length} edges`);
  };

  // Welcome screen handlers
  const handleStartWithTemplate = () => {
    // Mark as visited
    localStorage.setItem('has_visited', 'true');

    // TODO: Phase 7 Step 4 - Load Pet Clinic template
    // For now, just close the welcome screen
    console.log('User chose: Start with Pet Clinic Template');
    // Template loading will be implemented in Phase 7 Step 4
  };

  const handleStartEmpty = () => {
    // Mark as visited
    localStorage.setItem('has_visited', 'true');

    // Empty canvas is the default state, so just close welcome screen
    console.log('User chose: Start with Empty Canvas');
  };

  const handleCloseWelcome = () => {
    setShowWelcomeScreen(false);
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
          exampleCases={exampleCases}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          addNode={addNode}
          addExampleCase={addExampleCase}
          updateExampleCase={updateExampleCase}
          deleteExampleCase={deleteExampleCase}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={handlePaneClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          setEdges={setEdges}
          setNodes={setNodes}
          setExampleCases={setExampleCases}
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          selectedEdgeSource={selectedEdgeSource}
          handleClosePanel={handleClosePanel}
          handleCloseEdgePanel={handleCloseEdgePanel}
          updateNode={updateNode}
          updateEdge={updateEdge}
          onExport={handleExportComplete}
          onSave={handleSaveClick}
          onOpen={handleOpenClick}
          onImportMermaid={handleMermaidImportClick}
          isDirty={isDirty}
          lastSaved={lastSaved}
          triggerAutoSave={triggerAutoSave}
          simulationState={simulationState}
          onSimulationStateChange={handleSimulationStateChange}
          simulationHistory={simulationHistory}
          onReplaySimulation={handleReplaySimulation}
          onDeleteHistoryItem={deleteHistoryItem}
          onClearHistory={clearHistory}
          onSimulationComplete={handleSimulationComplete}
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

      {/* Welcome Screen */}
      {showWelcomeScreen && (
        <WelcomeScreen
          onStartWithTemplate={handleStartWithTemplate}
          onStartEmpty={handleStartEmpty}
          onClose={handleCloseWelcome}
        />
      )}
    </div>
  );
}

export default App;
