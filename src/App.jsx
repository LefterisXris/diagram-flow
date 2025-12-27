import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NodeDetailPanel from "./components/NodeDetailPanel";
import { useDiagramState } from "./hooks/useDiagramState";

function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNode,
    setEdges,
  } = useDiagramState();

  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div
      className="h-screen flex flex-col"
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
            onNodeClick={handleNodeClick}
            setEdges={setEdges}
          />
        </ReactFlowProvider>
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={handleClosePanel}
            onUpdate={updateNode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
