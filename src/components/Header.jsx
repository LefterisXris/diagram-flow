import { Layout, Download, Upload, Save, FolderOpen, GitMerge, HelpCircle, Search, X, Undo2, Redo2 } from "lucide-react";
import { useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import SaveStatus from "./SaveStatus";
import { getModKeyDisplay } from "../hooks/useKeyboardShortcuts";

const Header = ({ onExport, onImport, onSave, onOpen, onImportMermaid, isDirty, lastSaved, onStartTutorial, searchQuery, onSearchChange, onUndo, onRedo, canUndo, canRedo }) => {
  const fileInputRef = useRef(null);
  const modKey = getModKeyDisplay();

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
      <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            DiagramFlow
          </h1>
          <SaveStatus isDirty={isDirty} lastSaved={lastSaved} />
        </div>

        {/* Search Bar */}
        {onSearchChange && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search nodes..."
                title="Search nodes (Press / to focus)"
                className="w-full pl-10 pr-10 py-2 rounded-lg text-sm border outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: searchQuery ? "var(--accent-blue)" : "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  title="Clear search"
                >
                  <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "#ffffff",
              }}
              title={`Save diagram (${modKey}+S)`}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          )}
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 rounded-lg transition-colors border"
              style={{
                borderColor: "var(--border-primary)",
                color: canUndo ? "var(--text-primary)" : "var(--text-muted)",
                opacity: canUndo ? 1 : 0.5,
                cursor: canUndo ? "pointer" : "not-allowed",
              }}
              title={`Undo (${modKey}+Z)`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}
          {onRedo && (
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 rounded-lg transition-colors border"
              style={{
                borderColor: "var(--border-primary)",
                color: canRedo ? "var(--text-primary)" : "var(--text-muted)",
                opacity: canRedo ? 1 : 0.5,
                cursor: canRedo ? "pointer" : "not-allowed",
              }}
              title={`Redo (${modKey}+Shift+Z)`}
            >
              <Redo2 className="w-4 h-4" />
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
              title={`Open saved diagram (${modKey}+O)`}
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
          {onStartTutorial && (
            <button
              onClick={onStartTutorial}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
              title="Start interactive tutorial (Press ? for keyboard shortcuts)"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
