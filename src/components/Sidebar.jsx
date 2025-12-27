import { useState } from "react";
import { Plus, Box, Server, Database, Monitor, GitBranch, Wrench, FlaskConical, Play, History } from "lucide-react";
import * as Icons from "lucide-react";
import IconPicker from "./IconPicker";
import ExampleCasesList from "./ExampleCasesList";
import ExampleCaseForm from "./ExampleCaseForm";
import SimulationPanel from "./SimulationPanel";
import SimulationHistory from "./SimulationHistory";

const nodeTypeOptions = [
  { type: "generic", label: "Generic", icon: Box, color: "#3b82f6" },
  { type: "service", label: "Service", icon: Server, color: "#3b82f6" },
  { type: "database", label: "Database", icon: Database, color: "#10b981" },
  { type: "client", label: "Client", icon: Monitor, color: "#a855f7" },
  { type: "decision", label: "Decision", icon: GitBranch, color: "#f97316" },
];

const tabs = [
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "cases", label: "Example Cases", icon: FlaskConical },
  { id: "history", label: "History", icon: History },
];

const Sidebar = ({
  onAddNode,
  exampleCases = [],
  onAddExampleCase,
  onUpdateExampleCase,
  onDeleteExampleCase,
  nodes = [],
  edges = [],
  onSimulationStateChange,
  simulationHistory = [],
  onReplaySimulation,
  onDeleteHistoryItem,
  onClearHistory,
  onSimulationComplete,
}) => {
  const [activeTab, setActiveTab] = useState("tools");
  const [selectedType, setSelectedType] = useState("generic");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCaseForSimulation, setSelectedCaseForSimulation] = useState(null);

  const handleSimulationStateChange = (simulationState) => {
    if (onSimulationStateChange) {
      onSimulationStateChange(simulationState);
    }
  };

  const handleAddNode = () => {
    onAddNode({ x: 250, y: 150 }, selectedType, selectedIcon);
  };

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setShowIconPicker(false);
  };

  const handleAddCaseClick = () => {
    setEditingCase(null);
    setShowCaseForm(true);
  };

  const handleEditCase = (exampleCase) => {
    setEditingCase(exampleCase);
    setShowCaseForm(true);
  };

  const handleSaveCase = (caseData) => {
    if (editingCase) {
      onUpdateExampleCase(editingCase.id, caseData);
    } else {
      onAddExampleCase(caseData);
    }
    setShowCaseForm(false);
    setEditingCase(null);
  };

  const handleDeleteCase = (caseId) => {
    onDeleteExampleCase(caseId);
  };

  // Handle replay from history
  const handleReplayFromHistory = (historyItem) => {
    // Find the case
    const caseToReplay = exampleCases.find(c => c.id === historyItem.caseId);
    if (caseToReplay) {
      // Switch to cases tab and run simulation
      setActiveTab('cases');
      setSelectedCaseForSimulation(caseToReplay);
    } else if (onReplaySimulation) {
      // Fallback to parent handler if case not found
      onReplaySimulation(historyItem);
    }
  };

  // Get the icon component for display
  const SelectedIconComponent = selectedIcon && Icons[selectedIcon] ? Icons[selectedIcon] : null;

  return (
    <>
      <aside
        className="w-64 border-r flex flex-col"
        style={{
          borderColor: "var(--border-primary)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        {/* Tabs */}
        <div
          className="flex border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2"
                style={{
                  borderColor: isActive ? "var(--accent-blue)" : "transparent",
                  color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "rgba(59, 130, 246, 0.05)" : "transparent",
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "tools" && (
            <div className="p-4 space-y-4">
              <h2 className="text-sm font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
                Node Tools
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
          )}

          {activeTab === "cases" && (
            <div className="space-y-4">
              {selectedCaseForSimulation ? (
                // Simulation Panel View
                <div>
                  <div
                    className="p-4 border-b flex items-center justify-between"
                    style={{ borderColor: "var(--border-primary)" }}
                  >
                    <div>
                      <button
                        onClick={() => setSelectedCaseForSimulation(null)}
                        className="text-sm hover:underline"
                        style={{ color: "var(--accent-blue)" }}
                      >
                        ← Back to Cases
                      </button>
                      <h3 className="font-semibold mt-1" style={{ color: "var(--text-primary)" }}>
                        Simulation Mode
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {exampleCases.length} case{exampleCases.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                  <SimulationPanel
                    exampleCases={exampleCases}
                    selectedCaseId={selectedCaseForSimulation?.id}
                    nodes={nodes}
                    edges={edges}
                    onSimulationStateChange={handleSimulationStateChange}
                    onCaseChange={(caseId) => {
                      const newCase = exampleCases.find(c => c.id === caseId);
                      setSelectedCaseForSimulation(newCase);
                    }}
                    onSimulationComplete={onSimulationComplete}
                  />
                </div>
              ) : (
                // Cases List View
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
                      Example Cases
                    </h2>
                    <button
                      onClick={handleAddCaseClick}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      style={{
                        backgroundColor: "var(--accent-blue)",
                        color: "#ffffff",
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      Add Case
                    </button>
                  </div>

                  <ExampleCasesList
                    exampleCases={exampleCases}
                    onEdit={handleEditCase}
                    onDelete={handleDeleteCase}
                    onRunSimulation={setSelectedCaseForSimulation}
                    nodes={nodes}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-4">
              <SimulationHistory
                history={simulationHistory}
                onReplay={handleReplayFromHistory}
                onDelete={onDeleteHistoryItem}
                onClear={onClearHistory}
                nodes={nodes}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Example Case Form Modal */}
      <ExampleCaseForm
        isOpen={showCaseForm}
        onClose={() => {
          setShowCaseForm(false);
          setEditingCase(null);
        }}
        onSave={handleSaveCase}
        exampleCase={editingCase}
        nodes={nodes}
      />
    </>
  );
};

export default Sidebar;
