import { memo } from "react";
import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";

const ClientNode = memo(({ data, selected }) => {
  // Dynamically get icon component, fallback to Monitor if not found
  const IconComponent = data.icon && Icons[data.icon] ? Icons[data.icon] : Icons.Monitor;

  return (
    <div
      className="px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-200 shadow-lg"
      style={{
        backgroundColor: "var(--node-bg)",
        borderColor: selected ? "var(--accent-purple)" : "#a855f7",
        color: "var(--text-primary)",
        boxShadow: selected ? "0 0 0 3px rgba(168, 85, 247, 0.3)" : "var(--shadow-lg)",
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#a855f7" }}
      />

      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#a855f7" }}
      />

      {/* Node content */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: "rgba(168, 85, 247, 0.2)",
            color: "#a855f7",
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {data.label || "Client"}
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
        style={{ backgroundColor: "#a855f7" }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#a855f7" }}
      />
    </div>
  );
});

ClientNode.displayName = 'ClientNode';

export default ClientNode;
