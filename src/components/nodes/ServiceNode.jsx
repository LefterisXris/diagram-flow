import { Handle, Position } from "reactflow";
import * as Icons from "lucide-react";

const ServiceNode = ({ data, selected }) => {
  // Dynamically get icon component, fallback to Server if not found
  const IconComponent = data.icon && Icons[data.icon] ? Icons[data.icon] : Icons.Server;

  return (
    <div
      className="px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-200 shadow-lg"
      style={{
        backgroundColor: "var(--node-bg)",
        borderColor: selected ? "var(--accent-blue)" : "#3b82f6",
        color: "var(--text-primary)",
        boxShadow: selected ? "0 0 0 3px rgba(59, 130, 246, 0.3)" : "var(--shadow-lg)",
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#3b82f6" }}
      />

      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#3b82f6" }}
      />

      {/* Node content */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            color: "#3b82f6",
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {data.label || "Service"}
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
        style={{ backgroundColor: "#3b82f6" }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3"
        style={{ backgroundColor: "#3b82f6" }}
      />
    </div>
  );
};

export default ServiceNode;
