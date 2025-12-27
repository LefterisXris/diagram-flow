import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";

const DecisionNode = ({ data, selected }) => {
  // Dynamically get icon component, fallback to GitBranch if not found
  const IconComponent = data.icon && Icons[data.icon] ? Icons[data.icon] : Icons.GitBranch;

  return (
    <div
      className="relative px-4 py-3 min-w-[180px] transition-all duration-200 shadow-lg"
      style={{
        backgroundColor: "var(--node-bg)",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        border: `2px solid ${selected ? "var(--accent-orange)" : "#f97316"}`,
        boxShadow: selected ? "0 0 0 3px rgba(249, 115, 22, 0.3)" : "var(--shadow-lg)",
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#f97316", top: "-2px" }}
      />

      {/* Node content - centered in diamond */}
      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            color: "#f97316",
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="text-sm font-bold text-center" style={{ color: "var(--text-primary)" }}>
          {data.label || "Decision"}
        </div>
      </div>

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#f97316", bottom: "-2px" }}
      />

      {/* Left handle */}
      <Handle
        type="source"
        position={Position.Left}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#f97316" }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#f97316" }}
      />
    </div>
  );
};

export default DecisionNode;
