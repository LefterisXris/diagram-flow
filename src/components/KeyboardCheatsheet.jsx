import { X, Keyboard } from 'lucide-react';
import { getKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

/**
 * KeyboardCheatsheet Component
 *
 * Modal that displays all available keyboard shortcuts.
 * Opens when user presses "?" key.
 */
const KeyboardCheatsheet = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = getKeyboardShortcuts();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl shadow-2xl"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              <Keyboard className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Keyboard Shortcuts
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Speed up your workflow with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {shortcuts.map((category, idx) => (
            <div key={idx}>
              <h3
                className="text-sm font-semibold uppercase mb-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, sidx) => (
                  <div
                    key={sidx}
                    className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {shortcut.description}
                    </span>
                    <kbd
                      className="px-2 py-1 rounded text-xs font-mono"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-primary)',
                      }}
                    >
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between p-6 border-t"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Press <kbd className="px-2 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'var(--bg-tertiary)' }}>?</kbd> anytime to show this cheatsheet
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--accent-blue)',
              color: '#ffffff',
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardCheatsheet;
