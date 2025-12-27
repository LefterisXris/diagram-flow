import { X } from "lucide-react";
import { createConditionalEdgeData, normalizeConditionalEdge } from "../utils/edgeConditions";

const EdgeConditionPanel = ({ edge, sourceNode, onClose, onUpdateEdge }) => {
  if (!edge || !sourceNode || sourceNode.type !== "decision") {
    return null;
  }

  const edgeData = createConditionalEdgeData(edge.data);

  const updateEdgeData = (field, value) => {
    onUpdateEdge(edge.id, (current) =>
      normalizeConditionalEdge({
        ...current,
        data: {
          ...current.data,
          [field]: value,
        },
      })
    );
  };

  return (
    <aside
      className="w-80 border-l flex flex-col h-full overflow-hidden"
      style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Condition Editor
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-opacity-10"
          style={{ color: "var(--text-secondary)" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Condition Label
          </label>
          <input
            type="text"
            value={edgeData.label}
            onChange={(e) => updateEdgeData("label", e.target.value)}
            placeholder="e.g., Eligible users"
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Condition Expression
          </label>
          <input
            type="text"
            value={edgeData.condition}
            onChange={(e) => updateEdgeData("condition", e.target.value)}
            placeholder="e.g., input.age > 18"
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Priority
          </label>
          <input
            type="number"
            min="1"
            value={edgeData.priority}
            onChange={(e) => updateEdgeData("priority", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Condition Type
          </label>
          <select
            value={edgeData.conditionType}
            onChange={(e) => updateEdgeData("conditionType", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            <option value="true">True path</option>
            <option value="false">False path</option>
            <option value="default">Default</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default EdgeConditionPanel;
