import { useState } from "react";
import { X, Download, Image, FileCode, FileText } from "lucide-react";

/**
 * ExportDialog Component
 *
 * Modal dialog for exporting diagrams in various formats (PNG, SVG, HTML).
 * Provides options for each export format.
 */
const ExportDialog = ({ isOpen, onClose, onExport, diagramName = "diagram" }) => {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [exportOptions, setExportOptions] = useState({
    backgroundColor: '#ffffff',
    includeBackground: true,
    title: diagramName,
    description: '',
  });

  if (!isOpen) return null;

  const formats = [
    {
      id: 'png',
      label: 'PNG Image',
      icon: Image,
      description: 'High-quality raster image (recommended for presentations)',
      extension: '.png',
    },
    {
      id: 'svg',
      label: 'SVG Vector',
      icon: FileCode,
      description: 'Scalable vector graphics (best for print and scaling)',
      extension: '.svg',
    },
    {
      id: 'html',
      label: 'Standalone HTML',
      icon: FileText,
      description: 'Self-contained interactive viewer (opens in any browser)',
      extension: '.html',
    },
  ];

  const handleExport = () => {
    const format = selectedFormat;
    const fileName = `${diagramName}${formats.find(f => f.id === format)?.extension || '.png'}`;

    onExport(format, fileName, exportOptions);
    onClose();
  };

  const handleBackgroundColorChange = (color) => {
    setExportOptions(prev => ({ ...prev, backgroundColor: color }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl shadow-2xl"
        style={{ backgroundColor: "var(--bg-elevated)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Export Diagram
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Choose a format and configure export options
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Export Format
            </label>
            <div className="grid gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.id;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className="flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left"
                    style={{
                      borderColor: isSelected
                        ? "var(--accent-blue)"
                        : "var(--border-primary)",
                      backgroundColor: isSelected
                        ? "rgba(59, 130, 246, 0.05)"
                        : "transparent",
                    }}
                  >
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--accent-blue)"
                          : "var(--bg-tertiary)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color: isSelected ? "#ffffff" : "var(--text-muted)",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-medium"
                        style={{
                          color: isSelected
                            ? "var(--accent-blue)"
                            : "var(--text-primary)",
                        }}
                      >
                        {format.label}
                      </div>
                      <div
                        className="text-sm mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {format.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <label
              className="block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Options
            </label>

            {/* Background Color (for PNG/SVG) */}
            {(selectedFormat === 'png' || selectedFormat === 'svg') && (
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Background Color
                </label>
                <div className="flex gap-2">
                  {['#ffffff', '#f5f5f5', '#1a1a1a', 'transparent'].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleBackgroundColorChange(color)}
                      className="w-12 h-12 rounded-lg border-2 transition-all"
                      style={{
                        backgroundColor: color === 'transparent' ? 'transparent' : color,
                        borderColor:
                          exportOptions.backgroundColor === color
                            ? "var(--accent-blue)"
                            : "var(--border-primary)",
                        backgroundImage:
                          color === 'transparent'
                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                            : 'none',
                        backgroundSize: '10px 10px',
                        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                      }}
                      title={color === 'transparent' ? 'Transparent' : color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Title and Description (for HTML) */}
            {selectedFormat === 'html' && (
              <>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={exportOptions.title}
                    onChange={(e) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Diagram title"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Description (optional)
                  </label>
                  <textarea
                    value={exportOptions.description}
                    onChange={(e) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border outline-none resize-none"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-primary)",
                    }}
                    rows={3}
                    placeholder="Add a description for your diagram"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              color: "var(--text-secondary)",
              backgroundColor: "var(--bg-tertiary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "#ffffff",
            }}
          >
            <Download className="w-4 h-4" />
            Export {selectedFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
