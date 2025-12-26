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
