import { Handle, Position } from "reactflow";
import { Box } from "lucide-react";

const GenericNode = ({ data, selected }) => {
  return (
    <div
      className="px-4 py-2 rounded-lg border-2 min-w-[120px] transition-all duration-200"
      style={{
        backgroundColor: "var(--node-bg)",
        borderColor: selected ? "var(--accent-blue)" : "var(--node-border)",
        color: "var(--text-primary)",
        boxShadow: selected ? "var(--accent-blue-glow)" : "var(--shadow-lg)",
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3"
        style={{ backgroundColor: "var(--text-muted)" }}
      />

      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3"
        style={{ backgroundColor: "var(--text-muted)" }}
      />

      {/* Node content */}
      <div className="flex items-center gap-2">
        <Box className="w-4 h-4" />
        <div className="font-medium">{data.label || "Node"}</div>
      </div>

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3"
        style={{ backgroundColor: "var(--text-muted)" }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3"
        style={{ backgroundColor: "var(--text-muted)" }}
      />
    </div>
  );
};

export default GenericNode;
