import { useState } from "react";
import { Edit2, Trash2, Play, AlertCircle } from "lucide-react";

const ExampleCasesList = ({ exampleCases, onEdit, onDelete, onRunSimulation, nodes }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (caseId) => {
    setDeleteConfirm(caseId);
  };

  const handleConfirmDelete = (caseId) => {
    onDelete(caseId);
    setDeleteConfirm(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Get node name by ID
  const getNodeName = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.data?.label || nodeId;
  };

  if (!exampleCases || exampleCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="w-12 h-12 mb-4" style={{ color: "var(--text-secondary)", opacity: 0.5 }} />
        <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          No example cases yet.
        </p>
        <p className="text-center text-xs mt-2" style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
          Click "Add Case" to create your first example case for simulation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exampleCases.map((exampleCase) => (
        <div
          key={exampleCase.id}
          className="p-4 rounded-lg border transition-all"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
          }}
        >
          {/* Case Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {exampleCase.name}
              </h3>
              {exampleCase.description && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  {exampleCase.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(exampleCase)}
                className="p-1.5 rounded transition-colors hover:bg-opacity-10"
                style={{ color: "var(--accent-blue)" }}
                title="Edit case"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(exampleCase.id)}
                className="p-1.5 rounded transition-colors hover:bg-opacity-10"
                style={{ color: "#ef4444" }}
                title="Delete case"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Case Details */}
          <div className="space-y-2">
            {/* Starting Node */}
            <div className="flex items-center gap-2 text-xs">
              <span style={{ color: "var(--text-secondary)" }}>Starting node:</span>
              <span
                className="px-2 py-0.5 rounded font-mono"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "var(--accent-blue)",
                }}
              >
                {getNodeName(exampleCase.input?.nodeId)}
              </span>
            </div>

            {/* Input Data Preview */}
            {exampleCase.input?.data && Object.keys(exampleCase.input.data).length > 0 && (
              <div className="text-xs">
                <span style={{ color: "var(--text-secondary)" }}>Input data: </span>
                <span className="font-mono" style={{ color: "var(--text-primary)" }}>
                  {Object.keys(exampleCase.input.data).length} field
                  {Object.keys(exampleCase.input.data).length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Expected Path */}
            {exampleCase.expectedPath && exampleCase.expectedPath.length > 0 && (
              <div className="text-xs">
                <span style={{ color: "var(--text-secondary)" }}>Expected path: </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {exampleCase.expectedPath.length} node
                  {exampleCase.expectedPath.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Run Simulation Button */}
          {!deleteConfirm && onRunSimulation && (
            <div className="mt-3">
              <button
                onClick={() => onRunSimulation(exampleCase)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
                style={{
                  backgroundColor: 'var(--accent-blue)',
                  color: '#ffffff',
                }}
              >
                <Play className="w-4 h-4" />
                Run Simulation
              </button>
            </div>
          )}

          {/* Delete Confirmation */}
          {deleteConfirm === exampleCase.id && (
            <div
              className="mt-3 p-3 rounded-lg border-l-4"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                borderColor: "#ef4444",
              }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: "#ef4444" }}>
                Delete this example case?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConfirmDelete(exampleCase.id)}
                  className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-3 py-1.5 rounded text-sm transition-colors border"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExampleCasesList;
