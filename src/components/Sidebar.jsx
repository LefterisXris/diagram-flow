import { Plus } from "lucide-react";

const Sidebar = ({ onAddNode }) => {
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

        <button
          onClick={() => onAddNode({ x: 250, y: 150 })}
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
