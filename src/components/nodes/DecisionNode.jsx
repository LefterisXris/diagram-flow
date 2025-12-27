import { memo } from "react";
import { Handle, Position, useStore } from "reactflow";
import * as Icons from "lucide-react";

const DecisionNode = memo(({ id, data, selected }) => {
  // Dynamically get icon component, fallback to GitBranch if not found
  const IconComponent = data.icon && Icons[data.icon] ? Icons[data.icon] : Icons.GitBranch;
  const outgoingEdges = useStore((state) =>
    state.edges.filter((edge) => edge.source === id)
  );
  const outgoingCount = outgoingEdges.length;
  const hasTruePath = outgoingEdges.some((edge) => edge.data?.conditionType === "true");
  const hasDefaultPath = outgoingEdges.some((edge) => edge.data?.conditionType === "default");
  const showDefaultWarning = outgoingCount > 0 && !hasDefaultPath;
  const showTrueWarning = outgoingCount > 0 && !hasTruePath;

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
      {outgoingCount > 0 && (
        <div
          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: "#f59e0b",
            color: "#1f2937",
          }}
        >
          {outgoingCount}
        </div>
      )}
      {showDefaultWarning && (
        <div
          className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: "#fef3c7",
            color: "#b45309",
          }}
          title="No default path defined"
        >
          No default
        </div>
      )}
      {showTrueWarning && (
        <div
          className="absolute -bottom-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
          }}
          title="At least one true path required"
        >
          No true path
        </div>
      )}
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
});

DecisionNode.displayName = 'DecisionNode';

export default DecisionNode;
