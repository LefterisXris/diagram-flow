import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { SEVERITY, RULE_TYPE } from "../utils/validation";

/**
 * ValidationPanel Component
 *
 * Displays validation warnings and errors for the diagram.
 * Allows clicking on warnings to highlight the offending node.
 */
const ValidationPanel = ({ validationResult, onWarningClick }) => {
  const { warnings = [], counts = {}, total = 0 } = validationResult || {};

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case SEVERITY.ERROR:
        return <AlertCircle className="w-4 h-4" style={{ color: "#ef4444" }} />;
      case SEVERITY.WARNING:
        return <AlertTriangle className="w-4 h-4" style={{ color: "#f59e0b" }} />;
      case SEVERITY.INFO:
        return <Info className="w-4 h-4" style={{ color: "#3b82f6" }} />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case SEVERITY.ERROR:
        return "#ef4444";
      case SEVERITY.WARNING:
        return "#f59e0b";
      case SEVERITY.INFO:
        return "#3b82f6";
      default:
        return "var(--text-muted)";
    }
  };

  const getRuleTypeLabel = (type) => {
    switch (type) {
      case RULE_TYPE.ORPHAN_NODE:
        return "Orphan Node";
      case RULE_TYPE.DEAD_END:
        return "Dead End";
      case RULE_TYPE.MISSING_FIELD:
        return "Missing Field";
      case RULE_TYPE.CIRCULAR_DEPENDENCY:
        return "Circular Dependency";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Validation
          </h2>
        </div>
      </div>

      {/* Summary */}
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: "var(--border-primary)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        {total === 0 ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: "#10b981" }}>
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">No issues found</span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {total} issue{total !== 1 ? 's' : ''} found
            </div>
            <div className="flex gap-4 text-xs">
              {counts[SEVERITY.ERROR] > 0 && (
                <span style={{ color: "#ef4444" }}>
                  {counts[SEVERITY.ERROR]} error{counts[SEVERITY.ERROR] !== 1 ? 's' : ''}
                </span>
              )}
              {counts[SEVERITY.WARNING] > 0 && (
                <span style={{ color: "#f59e0b" }}>
                  {counts[SEVERITY.WARNING]} warning{counts[SEVERITY.WARNING] !== 1 ? 's' : ''}
                </span>
              )}
              {counts[SEVERITY.INFO] > 0 && (
                <span style={{ color: "#3b82f6" }}>
                  {counts[SEVERITY.INFO]} info
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Warnings List */}
      <div className="flex-1 overflow-y-auto">
        {total === 0 ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#10b981" }} />
            <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
              Your diagram looks good!
            </p>
            <p className="mt-1">No validation issues detected.</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {warnings.map((warning) => (
              <button
                key={warning.id}
                onClick={() => onWarningClick && onWarningClick(warning)}
                className="w-full text-left p-3 rounded-lg border transition-all hover:shadow-md"
                style={{
                  borderColor: getSeverityColor(warning.severity),
                  borderLeftWidth: "4px",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <div className="flex items-start gap-2">
                  {getSeverityIcon(warning.severity)}
                  <div className="flex-1 min-w-0">
                    {/* Rule Type Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${getSeverityColor(warning.severity)}20`,
                          color: getSeverityColor(warning.severity),
                        }}
                      >
                        {getRuleTypeLabel(warning.type)}
                      </span>
                    </div>

                    {/* Message */}
                    <div
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {warning.message}
                    </div>

                    {/* Description */}
                    <div
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {warning.description}
                    </div>

                    {/* Affected Nodes (for circular dependencies) */}
                    {warning.affectedNodes && warning.affectedNodes.length > 0 && (
                      <div className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span className="font-medium">Affected nodes: </span>
                        {warning.affectedNodes.length}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {total > 0 && (
        <div
          className="px-4 py-3 border-t text-xs"
          style={{
            borderColor: "var(--border-primary)",
            color: "var(--text-muted)",
          }}
        >
          Click on an issue to highlight the node
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
