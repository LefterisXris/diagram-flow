import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const ExampleCaseForm = ({ isOpen, onClose, onSave, exampleCase, nodes }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingNodeId, setStartingNodeId] = useState("");
  const [inputData, setInputData] = useState([{ key: "", value: "" }]);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("{}");
  const [jsonError, setJsonError] = useState("");

  // Initialize form with existing case data
  useEffect(() => {
    if (exampleCase) {
      setName(exampleCase.name || "");
      setDescription(exampleCase.description || "");
      setStartingNodeId(exampleCase.input?.nodeId || "");

      // Convert existing data to key-value pairs
      const data = exampleCase.input?.data || {};
      const pairs = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value)
      }));
      setInputData(pairs.length > 0 ? pairs : [{ key: "", value: "" }]);
      setJsonText(JSON.stringify(data, null, 2));
    } else {
      // Reset form for new case
      setName("");
      setDescription("");
      setStartingNodeId("");
      setInputData([{ key: "", value: "" }]);
      setJsonText("{}");
    }
    setJsonError("");
  }, [exampleCase, isOpen]);

  const handleAddField = () => {
    setInputData([...inputData, { key: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    setInputData(inputData.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const newData = [...inputData];
    newData[index][field] = value;
    setInputData(newData);
  };

  const handleJsonChange = (value) => {
    setJsonText(value);
    setJsonError("");

    // Validate JSON
    try {
      JSON.parse(value);
    } catch (error) {
      setJsonError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name.trim()) {
      alert("Please enter a case name");
      return;
    }
    if (!startingNodeId) {
      alert("Please select a starting node");
      return;
    }

    // Convert input data to object
    let data = {};

    if (jsonMode) {
      // Use JSON mode
      try {
        data = JSON.parse(jsonText);
      } catch (error) {
        alert("Invalid JSON: " + error.message);
        return;
      }
    } else {
      // Convert key-value pairs to object
      inputData.forEach(({ key, value }) => {
        if (key.trim()) {
          // Try to parse value as JSON (for numbers, booleans, objects)
          try {
            data[key] = JSON.parse(value);
          } catch {
            // If parsing fails, treat as string
            data[key] = value;
          }
        }
      });
    }

    // Create case object
    const caseData = {
      id: exampleCase?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      input: {
        nodeId: startingNodeId,
        data,
      },
      expectedPath: exampleCase?.expectedPath || [],
      highlights: exampleCase?.highlights || [],
    };

    onSave(caseData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-primary)",
          border: "1px solid",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between p-6 border-b"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {exampleCase ? "Edit Example Case" : "Add Example Case"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: "var(--text-secondary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Case Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Adult User Registration"
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this example case..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border resize-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Starting Node */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Starting Node *
            </label>
            <select
              value={startingNodeId}
              onChange={(e) => setStartingNodeId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">Select starting node...</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data.label || node.id} ({node.type})
                </option>
              ))}
            </select>
          </div>

          {/* Input Data */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Input Data
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setJsonMode(!jsonMode)}
                  className="text-xs px-3 py-1 rounded transition-colors"
                  style={{
                    backgroundColor: jsonMode ? "var(--accent-blue)" : "transparent",
                    color: jsonMode ? "#ffffff" : "var(--accent-blue)",
                    border: `1px solid ${jsonMode ? "var(--accent-blue)" : "var(--border-primary)"}`,
                  }}
                >
                  {jsonMode ? "Key-Value Mode" : "JSON Mode"}
                </button>
              </div>
            </div>

            {jsonMode ? (
              // JSON Editor
              <div className="space-y-2">
                <textarea
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder='{"key": "value"}'
                  rows={8}
                  className="w-full px-3 py-2 rounded-lg border font-mono text-sm resize-none"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: jsonError ? "#ef4444" : "var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                />
                {jsonError && (
                  <p className="text-xs" style={{ color: "#ef4444" }}>
                    Invalid JSON: {jsonError}
                  </p>
                )}
              </div>
            ) : (
              // Key-Value Pairs
              <div className="space-y-2">
                {inputData.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                      placeholder="Key"
                      className="flex-1 px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                      placeholder="Value (string, number, true/false, or JSON)"
                      className="flex-[2] px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-primary)",
                        color: "var(--text-primary)",
                      }}
                    />
                    {inputData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddField}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: "var(--border-primary)",
                    color: "var(--accent-blue)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "#ffffff",
              }}
            >
              {exampleCase ? "Save Changes" : "Add Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExampleCaseForm;
