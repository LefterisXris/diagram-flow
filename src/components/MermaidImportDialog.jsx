import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle, Check } from 'lucide-react';
import { parseMermaid, applyLayout } from '../utils/mermaidParser';

/**
 * Mermaid Import Dialog
 * Allows users to paste Mermaid code or upload .mmd files
 * Shows preview and warnings before importing
 */
export default function MermaidImportDialog({ isOpen, onClose, onImport }) {
  const [mermaidCode, setMermaidCode] = useState('');
  const [preview, setPreview] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!mermaidCode.trim()) {
      setWarnings(['Please enter Mermaid code']);
      return;
    }

    try {
      const result = parseMermaid(mermaidCode);
      const { nodes, edges, warnings: parseWarnings, direction } = result;

      // Apply layout
      const layoutNodes = applyLayout(nodes, edges, direction);

      setPreview({
        nodes: layoutNodes,
        edges,
        nodeCount: layoutNodes.length,
        edgeCount: edges.length,
        direction,
      });

      setWarnings(parseWarnings);
    } catch (error) {
      setWarnings([`Parse error: ${error.message}`]);
      setPreview(null);
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview.nodes, preview.edges);
      handleClose();
    }
  };

  const handleClose = () => {
    setMermaidCode('');
    setPreview(null);
    setWarnings([]);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMermaidCode(event.target.result);
      };
      reader.readAsText(file);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-4xl rounded-lg p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Import from Mermaid</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Paste Mermaid flowchart code or upload a .mmd file
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded p-1 transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Input Section */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Mermaid Code</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".mmd,.txt"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-1 rounded px-3 py-1 text-sm transition-colors hover:bg-white/10"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <Upload size={14} />
                  Upload File
                </button>
              </div>
            </div>
            <textarea
              value={mermaidCode}
              onChange={(e) => setMermaidCode(e.target.value)}
              placeholder={`graph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Action 1]\n  B -->|No| D[Action 2]\n  C --> E[End]\n  D --> E`}
              className="w-full rounded border p-3 font-mono text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
                minHeight: '200px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Parse Button */}
          <div className="mb-4">
            <button
              onClick={handleParse}
              disabled={!mermaidCode.trim()}
              className="w-full rounded px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: mermaidCode.trim() ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                color: 'white',
              }}
            >
              Parse & Preview
            </button>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div
              className="mb-4 rounded-lg border p-3"
              style={{
                backgroundColor: 'var(--accent-yellow)',
                borderColor: '#d97706',
                color: '#000',
              }}
            >
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <AlertTriangle size={16} />
                Warnings
              </div>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Check size={16} style={{ color: 'var(--accent-green)' }} />
                Preview
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Nodes:</span>
                  <span className="ml-2 font-medium">{preview.nodeCount}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Edges:</span>
                  <span className="ml-2 font-medium">{preview.edgeCount}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Direction:</span>
                  <span className="ml-2 font-medium">
                    {preview.direction === 'TD' ? 'Top-Down' : 'Left-Right'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Layout:</span>
                  <span className="ml-2 font-medium">Hierarchical</span>
                </div>
              </div>

              {/* Node Types Summary */}
              <div className="mt-3">
                <div className="mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Node Types:
                </div>
                <div className="flex flex-wrap gap-2">
                  {getNodeTypeSummary(preview.nodes).map(({ type, count }) => (
                    <span
                      key={type}
                      className="rounded px-2 py-1 text-xs"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {type}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded px-4 py-2 transition-colors hover:bg-white/10"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!preview}
            className="rounded px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: preview ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              color: 'white',
            }}
          >
            Import Diagram
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Get summary of node types
 */
function getNodeTypeSummary(nodes) {
  const typeCounts = {};

  nodes.forEach(node => {
    const type = node.type || 'generic';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}
