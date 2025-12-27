import { useCallback, useMemo } from "react";
import ReactFlow, { Background, Controls, addEdge, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "../config/nodeTypes";
import { createConditionalEdgeData, normalizeConditionalEdge } from "../utils/edgeConditions";

const Canvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onAddNode,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
  setEdges,
}) => {
  const { screenToFlowPosition } = useReactFlow();

  // Handle double-click to create node
  const handlePaneDoubleClick = useCallback((event) => {
    // Convert screen coordinates to flow coordinates
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    onAddNode(position);
  }, [onAddNode, screenToFlowPosition]);

  // Handle edge creation
  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const isDecisionSource = sourceNode?.type === "decision";
    const edgeData = createConditionalEdgeData({
      conditionType: isDecisionSource ? "true" : "",
    });

    const newEdge = normalizeConditionalEdge({
      ...params,
      id: crypto.randomUUID(),
      animated: true,
      type: "smoothstep",
      data: edgeData,
    });
    setEdges((eds) => addEdge(newEdge, eds));
  }, [nodes, setEdges]);

  // Memoize nodeTypes to prevent recreation
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <div
      className="flex-1 relative"
      style={{
        backgroundColor: "var(--bg-primary)",
        width: "100%",
        height: "100%"
      }}
      onDoubleClick={handlePaneDoubleClick}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={memoizedNodeTypes}
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
