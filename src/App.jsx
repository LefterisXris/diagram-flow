import { useState } from "react";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NodeDetailPanel from "./components/NodeDetailPanel";
import { useDiagramState } from "./hooks/useDiagramState";
import { exportDiagram } from "./utils/exportDiagram";
import { importDiagram } from "./utils/importDiagram";

// Wrapper component to access ReactFlow context
function DiagramContent({ nodes, edges, onNodesChange, onEdgesChange, addNode, onNodeClick, setEdges, setNodes, selectedNode, handleClosePanel, updateNode, onExport }) {
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

  return (
    <>
      <Header onExport={handleExport} onImport={handleImport} />
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
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNode,
    setEdges,
    setNodes,
  } = useDiagramState();

  const [selectedNode, setSelectedNode] = useState(null);

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
        />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
