import { useState } from "react";
import { Plus, Box, Server, Database, Monitor, GitBranch } from "lucide-react";
import * as Icons from "lucide-react";
import IconPicker from "./IconPicker";

const nodeTypeOptions = [
  { type: "generic", label: "Generic", icon: Box, color: "#3b82f6" },
  { type: "service", label: "Service", icon: Server, color: "#3b82f6" },
  { type: "database", label: "Database", icon: Database, color: "#10b981" },
  { type: "client", label: "Client", icon: Monitor, color: "#a855f7" },
  { type: "decision", label: "Decision", icon: GitBranch, color: "#f97316" },
];

const Sidebar = ({ onAddNode }) => {
  const [selectedType, setSelectedType] = useState("generic");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleAddNode = () => {
    onAddNode({ x: 250, y: 150 }, selectedType, selectedIcon);
  };

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setShowIconPicker(false);
  };

  // Get the icon component for display
  const SelectedIconComponent = selectedIcon && Icons[selectedIcon] ? Icons[selectedIcon] : null;

  return (
    <aside
      className="w-64 border-r flex flex-col"
      style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="p-4 space-y-4">
        <h2 className="text-sm font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
          Tools
        </h2>

        <div className="space-y-2">
          <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Node Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {nodeTypeOptions.map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg transition-all border-2"
                style={{
                  backgroundColor: selectedType === type ? `${color}20` : "var(--node-bg)",
                  borderColor: selectedType === type ? color : "var(--border-primary)",
                  color: selectedType === type ? color : "var(--text-secondary)",
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Icon Selection */}
        <div className="space-y-2 relative">
          <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Custom Icon (Optional)
          </label>
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all"
            style={{
              backgroundColor: selectedIcon ? "rgba(59, 130, 246, 0.1)" : "var(--node-bg)",
              borderColor: showIconPicker ? "#3b82f6" : "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            <div className="flex items-center gap-2">
              {SelectedIconComponent ? (
                <>
                  <SelectedIconComponent className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  <span className="text-sm">{selectedIcon}</span>
                </>
              ) : (
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Choose icon...
                </span>
              )}
            </div>
            {selectedIcon && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIcon(null);
                }}
                className="text-xs px-2 py-1 rounded hover:bg-opacity-20"
                style={{ color: "var(--text-secondary)" }}
              >
                Clear
              </button>
            )}
          </button>

          {showIconPicker && (
            <div className="mt-2">
              <IconPicker
                selectedIcon={selectedIcon}
                onSelectIcon={handleIconSelect}
                onClose={() => setShowIconPicker(false)}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAddNode}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--accent-blue)",
            color: "#ffffff",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Node
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
