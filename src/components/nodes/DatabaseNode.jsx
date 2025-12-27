import { memo } from "react";
import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";

const DatabaseNode = memo(({ data, selected }) => {
  // Dynamically get icon component, fallback to Database if not found
  const IconComponent = data.icon && Icons[data.icon] ? Icons[data.icon] : Icons.Database;

  return (
    <div
      className="px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-200 shadow-lg"
      style={{
        backgroundColor: "var(--node-bg)",
        borderColor: selected ? "var(--accent-emerald)" : "#10b981",
        color: "var(--text-primary)",
        boxShadow: selected ? "0 0 0 3px rgba(16, 185, 129, 0.3)" : "var(--shadow-lg)",
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#10b981" }}
      />

      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#10b981" }}
      />

      {/* Node content */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            color: "#10b981",
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {data.label || "Database"}
          </div>
          {data.tech && (
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {data.tech}
            </div>
          )}
        </div>
      </div>

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#10b981" }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#10b981" }}
      />
    </div>
  );
});

DatabaseNode.displayName = 'DatabaseNode';

export default DatabaseNode;
