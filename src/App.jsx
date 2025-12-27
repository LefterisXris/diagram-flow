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
            setEdges={setEdges}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
