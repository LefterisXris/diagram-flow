import { useState, useEffect } from 'react';
import { X, Folder, Trash2, Calendar, FileText } from 'lucide-react';
import { listDiagrams, deleteDiagram } from '../utils/diagramLibrary';

/**
 * Open Diagram Dialog
 * Shows list of saved diagrams with load and delete options
 */
export default function OpenDiagramDialog({ isOpen, onClose, onLoad }) {
  const [diagrams, setDiagrams] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load diagrams when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadDiagrams();
    }
  }, [isOpen]);

  const loadDiagrams = () => {
    const list = listDiagrams();
    setDiagrams(list);
  };

  const handleLoad = (diagramId) => {
    onLoad(diagramId);
    onClose();
  };

  const handleDelete = (diagramId, diagramName) => {
    setConfirmDelete({ id: diagramId, name: diagramName });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      deleteDiagram(confirmDelete.id);
      setConfirmDelete(null);
      loadDiagrams(); // Refresh list
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Open Diagram</h2>
          <button
            onClick={onClose}
            className="rounded p-1 transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Diagram List */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          {diagrams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Folder size={48} className="mb-3 opacity-50" />
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                No saved diagrams
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Save your current diagram to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {diagrams.map((diagram) => (
                <div
                  key={diagram.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-white/5"
                  style={{
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  <div className="flex-1 cursor-pointer" onClick={() => handleLoad(diagram.id)}>
                    <div className="flex items-center gap-2">
                      <FileText size={18} style={{ color: 'var(--accent-blue)' }} />
                      <h3 className="font-medium">{diagram.name}</h3>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(diagram.lastModified)}</span>
                      </div>
                      <span>
                        {diagram.nodeCount} node{diagram.nodeCount !== 1 ? 's' : ''}, {diagram.edgeCount} edge{diagram.edgeCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(diagram.id, diagram.name)}
                    className="ml-4 rounded p-2 transition-colors hover:bg-red-500/20"
                    style={{ color: 'var(--accent-red)' }}
                    aria-label="Delete diagram"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 transition-colors hover:bg-white/10"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-md rounded-lg p-6 shadow-xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-lg font-semibold">Delete Diagram?</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete &quot;{confirmDelete.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="rounded px-4 py-2 transition-colors hover:bg-white/10"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="rounded px-4 py-2 font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--accent-red)',
                  color: 'white',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
