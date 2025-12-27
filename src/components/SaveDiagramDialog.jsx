import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Save Diagram Dialog
 * Prompts user for diagram name before saving
 */
export default function SaveDiagramDialog({ isOpen, onClose, onSave, currentName = '' }) {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Save Diagram</h2>
          <button
            onClick={onClose}
            className="rounded p-1 transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label htmlFor="diagram-name" className="mb-2 block text-sm font-medium">
            Diagram Name
          </label>
          <input
            id="diagram-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter diagram name..."
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 transition-colors hover:bg-white/10"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: name.trim() ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              color: 'white',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
