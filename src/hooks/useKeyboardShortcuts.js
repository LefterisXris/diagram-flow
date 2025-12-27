import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 *
 * Handles all application keyboard shortcuts and provides a clean interface
 * for registering shortcut handlers.
 *
 * @param {Object} handlers - Object containing shortcut handlers
 * @param {Function} handlers.onSave - Handler for Ctrl/Cmd + S
 * @param {Function} handlers.onOpen - Handler for Ctrl/Cmd + O
 * @param {Function} handlers.onDelete - Handler for Delete key
 * @param {Function} handlers.onUndo - Handler for Ctrl/Cmd + Z
 * @param {Function} handlers.onRedo - Handler for Ctrl/Cmd + Shift + Z
 * @param {Function} handlers.onDuplicate - Handler for Ctrl/Cmd + D
 * @param {Function} handlers.onFocusSearch - Handler for / key
 * @param {Function} handlers.onShowCheatsheet - Handler for ? key
 * @param {boolean} enabled - Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(handlers = {}, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Detect if Cmd (Mac) or Ctrl (Windows/Linux) is pressed
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      // Ignore shortcuts when typing in input fields (except for specific keys)
      const isInputField =
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable;

      // Ctrl/Cmd + S: Save
      if (modKey && event.key === 's') {
        event.preventDefault();
        if (handlers.onSave) {
          handlers.onSave();
        }
        return;
      }

      // Ctrl/Cmd + O: Open
      if (modKey && event.key === 'o') {
        event.preventDefault();
        if (handlers.onOpen) {
          handlers.onOpen();
        }
        return;
      }

      // Ctrl/Cmd + Shift + Z: Redo
      if (modKey && event.shiftKey && event.key === 'z') {
        event.preventDefault();
        if (handlers.onRedo) {
          handlers.onRedo();
        }
        return;
      }

      // Ctrl/Cmd + Z: Undo
      if (modKey && event.key === 'z') {
        event.preventDefault();
        if (handlers.onUndo) {
          handlers.onUndo();
        }
        return;
      }

      // Ctrl/Cmd + D: Duplicate
      if (modKey && event.key === 'd') {
        event.preventDefault();
        if (handlers.onDuplicate) {
          handlers.onDuplicate();
        }
        return;
      }

      // Delete: Delete selected node/edge
      if ((event.key === 'Delete' || event.key === 'Backspace') && !isInputField) {
        event.preventDefault();
        if (handlers.onDelete) {
          handlers.onDelete();
        }
        return;
      }

      // /: Focus search
      if (event.key === '/' && !isInputField) {
        event.preventDefault();
        if (handlers.onFocusSearch) {
          handlers.onFocusSearch();
        }
        return;
      }

      // ?: Show cheatsheet
      if (event.key === '?' && !isInputField) {
        event.preventDefault();
        if (handlers.onShowCheatsheet) {
          handlers.onShowCheatsheet();
        }
        return;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
}

/**
 * Get the display name for the modifier key based on platform
 * @returns {string} - "Cmd" on Mac, "Ctrl" on other platforms
 */
export function getModKeyDisplay() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return isMac ? '⌘' : 'Ctrl';
}

/**
 * Get all keyboard shortcuts with their descriptions
 * @returns {Array} - Array of shortcut objects
 */
export function getKeyboardShortcuts() {
  const modKey = getModKeyDisplay();

  return [
    {
      category: 'File Operations',
      shortcuts: [
        { keys: `${modKey} + S`, description: 'Save or Export diagram' },
        { keys: `${modKey} + O`, description: 'Open diagram' },
      ],
    },
    {
      category: 'Editing',
      shortcuts: [
        { keys: 'Delete', description: 'Delete selected node or edge' },
        { keys: `${modKey} + D`, description: 'Duplicate selected node' },
        { keys: `${modKey} + Z`, description: 'Undo last action' },
        { keys: `${modKey} + Shift + Z`, description: 'Redo last action' },
      ],
    },
    {
      category: 'Navigation',
      shortcuts: [
        { keys: '/', description: 'Focus search bar' },
        { keys: 'Space + Drag', description: 'Pan canvas' },
      ],
    },
    {
      category: 'Help',
      shortcuts: [
        { keys: '?', description: 'Show keyboard shortcuts' },
      ],
    },
  ];
}
