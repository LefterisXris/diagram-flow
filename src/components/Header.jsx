import { Layout, Download, Upload, Save, FolderOpen, GitMerge } from "lucide-react";
import { useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import SaveStatus from "./SaveStatus";

const Header = ({ onExport, onImport, onSave, onOpen, onImportMermaid, isDirty, lastSaved }) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      // Reset input so same file can be imported again
      event.target.value = "";
    }
  };

  return (
    <header
      className="border-b backdrop-blur-md sticky top-0 z-50"
      style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-elevated)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            DiagramFlow
          </h1>
          <SaveStatus isDirty={isDirty} lastSaved={lastSaved} />
        </div>

        <div className="flex items-center gap-3">
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "#ffffff",
              }}
              title="Save diagram"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          )}
          {onOpen && (
            <button
              onClick={onOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
              title="Open saved diagram"
            >
              <FolderOpen className="w-4 h-4" />
              Open
            </button>
          )}
          {onImport && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: "none" }}
              />
              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
                title="Import diagram from JSON"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </>
          )}
          {onImportMermaid && (
            <button
              onClick={onImportMermaid}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
              title="Import from Mermaid"
            >
              <GitMerge className="w-4 h-4" />
              Mermaid
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
              title="Export diagram as JSON"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
