import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import ExportDialog from "./components/ExportDialog";
import WelcomeScreen from "./components/WelcomeScreen";
import TutorialOverlay from "./components/TutorialOverlay";
import KeyboardCheatsheet from "./components/KeyboardCheatsheet";
import { useDiagramState } from "./hooks/useDiagramState";
import { useSession } from "./hooks/useSession";
import { useSimulationHistory } from "./hooks/useSimulationHistory";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useHistory } from "./hooks/useHistory";
import { exportDiagram } from "./utils/exportDiagram";
import { importDiagram } from "./utils/importDiagram";
import { saveDiagram, loadDiagram } from "./utils/diagramLibrary";
import { applyConditionalEdgeHighlight, normalizeConditionalEdge } from "./utils/edgeConditions";
import { normalizeExampleCases } from "./utils/exampleCases";
import { petClinicTemplate } from "./templates/petClinic";
import { getVisibleNodes, extractFilterOptions } from "./utils/searchFilter";
import { validateDiagram } from "./utils/validation";
import { exportToPNG, exportToSVG, exportToHTML } from "./utils/advancedExport";

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
  templateJustLoaded,
  setTemplateJustLoaded,
  setSelectedNode,
  onStartTutorial,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  filterOptions,
  visibleCount,
  totalCount,
  onClearFilters,
  validationResult,
  onValidationWarningClick,
  reactFlowWrapperRef,
}) {
  const { getViewport, setViewport, fitView } = useReactFlow();
  const reactFlowWrapper = useRef(null);

  // Apply visual highlighting based on search/filter
  const styledNodes = useMemo(() => {
    const { visibleNodeIds } = getVisibleNodes(nodes, searchQuery, filters);
    const hasActiveSearchOrFilter = searchQuery ||
      filters.types.length > 0 ||
      filters.statuses.length > 0 ||
      filters.owners.length > 0 ||
      filters.tags.length > 0;

    if (!hasActiveSearchOrFilter) {
      // No filters active, return nodes as-is
      return nodes;
    }

    return nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: visibleNodeIds.has(node.id) ? 1 : 0.25,
      },
    }));
  }, [nodes, searchQuery, filters]);

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

  // Handle template loading - fit view and select first node
  useEffect(() => {
    if (templateJustLoaded && nodes.length > 0) {
      // Fit view to show all nodes with padding
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 100);

      // Auto-select first node to show detail panel
      setTimeout(() => {
        const firstNode = nodes[0];
        if (firstNode) {
          setSelectedNode(firstNode);
          console.log('💡 Tip: Click the "Example Cases" tab in the sidebar to run simulations!');
        }
      }, 500);

      // Reset flag
      setTemplateJustLoaded(false);
    }
  }, [templateJustLoaded, nodes, fitView, setSelectedNode, setTemplateJustLoaded]);

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
        onStartTutorial={onStartTutorial}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <div ref={reactFlowWrapperRef} className="flex-1 flex overflow-hidden">
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
          filters={filters}
          onFiltersChange={onFiltersChange}
          filterOptions={filterOptions}
          visibleCount={visibleCount}
          totalCount={totalCount}
          onClearFilters={onClearFilters}
          validationResult={validationResult}
          onValidationWarningClick={onValidationWarningClick}
        />
        <Canvas
          nodes={styledNodes}
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
  const [templateJustLoaded, setTemplateJustLoaded] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  // Ref for React Flow container (for advanced exports)
  const reactFlowWrapperRef = useRef(null);

  // Ref for search input (for focus shortcut)
  const searchInputRef = useRef(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [], // Array of node types to show (empty = show all)
    statuses: [], // Array of statuses to show (empty = show all)
    owners: [], // Array of owners to show (empty = show all)
    tags: [], // Array of tags to show (empty = show all)
  });

  // Simulation history tracking
  const {
    history: simulationHistory,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
  } = useSimulationHistory(currentDiagramId);

  // Undo/Redo history management
  const handleRestoreState = useCallback((state) => {
    setNodes(state.nodes);
    setEdges(state.edges);
    setExampleCases(state.exampleCases);
  }, [setNodes, setEdges, setExampleCases]);

  const {
    undo,
    redo,
    canUndo,
    canRedo,
    pushState,
  } = useHistory(
    { nodes, edges, exampleCases },
    handleRestoreState,
    `diagram_history_${currentDiagramId || 'default'}`
  );

  // Push state to history whenever diagram changes (debounced)
  useEffect(() => {
    pushState({ nodes, edges, exampleCases });
  }, [nodes, edges, exampleCases, pushState]);

  // Search & Filter computed values
  const { visibleNodeIds, visibleCount, totalCount } = useMemo(() => {
    return getVisibleNodes(nodes, searchQuery, filters);
  }, [nodes, searchQuery, filters]);

  const filterOptions = useMemo(() => {
    return extractFilterOptions(nodes);
  }, [nodes]);

  // Validation computed values (debounced via useMemo dependencies)
  const validationResult = useMemo(() => {
    return validateDiagram(nodes, edges);
  }, [nodes, edges]);

  // Handlers for search & filter
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      types: [],
      statuses: [],
      owners: [],
      tags: [],
    });
  };

  // Handler for validation warning click
  const handleValidationWarningClick = (warning) => {
    // Find the node
    const node = nodes.find(n => n.id === warning.nodeId);
    if (node) {
      // Select the node to show in detail panel
      setSelectedNode(node);

      // Close any open edge panel
      setSelectedEdgeId(null);

      console.log(`Highlighted node: ${warning.nodeName} (${warning.type})`);
    }
  };

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
    // Show export dialog instead of direct export
    setShowExportDialog(true);
  };

  const handleAdvancedExport = async (format, fileName, options) => {
    try {
      if (format === 'png') {
        // Export as PNG
        const element = reactFlowWrapperRef.current?.querySelector('.react-flow');
        if (element) {
          await exportToPNG(element, fileName, {
            backgroundColor: options.backgroundColor,
          });
          console.log('PNG export successful');
        } else {
          console.error('React Flow element not found');
        }
      } else if (format === 'svg') {
        // Export as SVG
        const element = reactFlowWrapperRef.current?.querySelector('.react-flow');
        if (element) {
          await exportToSVG(element, fileName, {
            backgroundColor: options.backgroundColor,
          });
          console.log('SVG export successful');
        } else {
          console.error('React Flow element not found');
        }
      } else if (format === 'html') {
        // Export as standalone HTML
        const viewport = reactFlowWrapperRef.current?.querySelector('.react-flow__viewport');
        // Get viewport transform if available, otherwise use default
        let viewportData = { x: 0, y: 0, zoom: 1 };
        if (viewport) {
          const transform = viewport.style.transform;
          // Parse transform matrix if available
          const match = transform.match(/translate\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px\)\s*scale\((-?\d+\.?\d*)\)/);
          if (match) {
            viewportData = {
              x: parseFloat(match[1]),
              y: parseFloat(match[2]),
              zoom: parseFloat(match[3]),
            };
          }
        }

        exportToHTML(nodes, edges, viewportData, fileName, {
          title: options.title || currentDiagramName || 'DiagramFlow Export',
          description: options.description || '',
        });
        console.log('HTML export successful');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
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

    // Load Pet Clinic template
    setNodes(petClinicTemplate.nodes);
    setEdges(petClinicTemplate.edges);
    setExampleCases(normalizeExampleCases(petClinicTemplate.exampleCases));

    // Set flag to trigger viewport fit and node selection in DiagramContent
    setTemplateJustLoaded(true);

    // Close welcome screen
    setShowWelcomeScreen(false);

    console.log('Pet Clinic template loaded successfully');
  };

  const handleStartEmpty = () => {
    // Mark as visited
    localStorage.setItem('has_visited', 'true');

    // Close welcome screen
    setShowWelcomeScreen(false);

    // Empty canvas is the default state (nodes and edges already empty)
    console.log('User chose: Start with Empty Canvas');
  };

  const handleCloseWelcome = () => {
    setShowWelcomeScreen(false);
  };

  // Tutorial handlers
  const handleStartTutorial = () => {
    setShowTutorial(true);
  };

  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    console.log('Tutorial completed! You\'re ready to build amazing diagrams.');
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    console.log('Tutorial skipped. You can restart it anytime from the Help menu.');
  };

  // Keyboard shortcut handlers
  const handleDeleteKey = () => {
    if (selectedNode) {
      // Delete selected node
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      console.log(`Deleted node: ${selectedNode.data.label}`);
    } else if (selectedEdgeId) {
      // Delete selected edge
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
      console.log(`Deleted edge: ${selectedEdgeId}`);
    }
  };

  const handleDuplicateNode = () => {
    if (selectedNode) {
      const newNode = {
        ...selectedNode,
        id: `${selectedNode.type}-${Date.now()}`,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50,
        },
        data: {
          ...selectedNode.data,
          label: `${selectedNode.data.label} (Copy)`,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newNode);
      console.log(`Duplicated node: ${selectedNode.data.label}`);
    }
  };

  const handleFocusSearch = () => {
    // Focus the search input
    const searchInput = document.querySelector('input[placeholder="Search nodes..."]');
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleShowCheatsheet = () => {
    setShowCheatsheet(true);
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      console.log('Undo: Restored previous state');
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
      console.log('Redo: Restored next state');
    }
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleExportComplete,
    onOpen: handleOpenClick,
    onDelete: handleDeleteKey,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDuplicate: handleDuplicateNode,
    onFocusSearch: handleFocusSearch,
    onShowCheatsheet: handleShowCheatsheet,
  });

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
          templateJustLoaded={templateJustLoaded}
          setTemplateJustLoaded={setTemplateJustLoaded}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          filterOptions={filterOptions}
          visibleCount={visibleCount}
          totalCount={totalCount}
          onClearFilters={handleClearFilters}
          validationResult={validationResult}
          onValidationWarningClick={handleValidationWarningClick}
          setSelectedNode={setSelectedNode}
          onStartTutorial={handleStartTutorial}
          reactFlowWrapperRef={reactFlowWrapperRef}
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

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleAdvancedExport}
        diagramName={currentDiagramName || 'diagram'}
      />

      {/* Keyboard Cheatsheet */}
      <KeyboardCheatsheet
        isOpen={showCheatsheet}
        onClose={() => setShowCheatsheet(false)}
      />

      {/* Welcome Screen */}
      {showWelcomeScreen && (
        <WelcomeScreen
          onStartWithTemplate={handleStartWithTemplate}
          onStartEmpty={handleStartEmpty}
          onClose={handleCloseWelcome}
        />
      )}

      {/* Interactive Tutorial */}
      <TutorialOverlay
        isActive={showTutorial}
        onComplete={handleCompleteTutorial}
        onSkip={handleSkipTutorial}
      />
    </div>
  );
}

export default App;
