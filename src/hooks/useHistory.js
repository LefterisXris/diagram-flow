import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for undo/redo history management
 *
 * Manages a history stack of diagram states with undo/redo functionality.
 * Persists to sessionStorage and includes debounced state tracking.
 *
 * @param {Object} currentState - The current diagram state { nodes, edges, exampleCases }
 * @param {Function} onRestore - Callback to restore a previous state
 * @param {string} sessionKey - Key for sessionStorage (default: 'diagram_history')
 * @returns {Object} - { undo, redo, canUndo, canRedo, pushState, clearHistory }
 */
export function useHistory(currentState, onRestore, sessionKey = 'diagram_history') {
  const MAX_HISTORY_SIZE = 50;
  const DEBOUNCE_DELAY = 1000; // 1 second

  // History stacks
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Flag to prevent recording during undo/redo operations
  const isRestoringRef = useRef(false);

  // Load history from sessionStorage on mount
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem(sessionKey);
      if (savedHistory) {
        const { history, redo } = JSON.parse(savedHistory);
        setHistoryStack(history || []);
        setRedoStack(redo || []);
      }
    } catch (error) {
      console.error('Failed to load history from sessionStorage:', error);
    }
  }, [sessionKey]);

  // Save history to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({
          history: historyStack,
          redo: redoStack,
        })
      );
    } catch (error) {
      console.error('Failed to save history to sessionStorage:', error);
    }
  }, [historyStack, redoStack, sessionKey]);

  /**
   * Push current state to history (debounced)
   */
  const pushState = useCallback((state) => {
    // Don't record if we're currently restoring
    if (isRestoringRef.current) return;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      setHistoryStack((prev) => {
        // Create new state entry
        const newState = {
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
          exampleCases: JSON.parse(JSON.stringify(state.exampleCases || [])),
          timestamp: Date.now(),
        };

        // Check if state actually changed (deep comparison of essential properties)
        const lastState = prev[prev.length - 1];
        if (lastState) {
          const nodesChanged = JSON.stringify(lastState.nodes) !== JSON.stringify(newState.nodes);
          const edgesChanged = JSON.stringify(lastState.edges) !== JSON.stringify(newState.edges);
          const casesChanged = JSON.stringify(lastState.exampleCases) !== JSON.stringify(newState.exampleCases);

          if (!nodesChanged && !edgesChanged && !casesChanged) {
            // State hasn't actually changed, don't add to history
            return prev;
          }
        }

        // Add to history stack
        const newHistory = [...prev, newState];

        // Limit stack size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
        }

        return newHistory;
      });

      // Clear redo stack when new change is made
      setRedoStack([]);
    }, DEBOUNCE_DELAY);
  }, []);

  /**
   * Undo last change
   */
  const undo = useCallback(() => {
    if (historyStack.length === 0) return;

    isRestoringRef.current = true;

    // Save current state to redo stack
    const currentSnapshot = {
      nodes: JSON.parse(JSON.stringify(currentState.nodes)),
      edges: JSON.parse(JSON.stringify(currentState.edges)),
      exampleCases: JSON.parse(JSON.stringify(currentState.exampleCases || [])),
      timestamp: Date.now(),
    };

    setRedoStack((prev) => [...prev, currentSnapshot]);

    // Pop from history stack
    const newHistory = [...historyStack];
    const previousState = newHistory.pop();
    setHistoryStack(newHistory);

    // Restore previous state
    if (previousState && onRestore) {
      onRestore({
        nodes: previousState.nodes,
        edges: previousState.edges,
        exampleCases: previousState.exampleCases,
      });
    }

    // Reset flag after a short delay to allow state to settle
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 100);
  }, [historyStack, currentState, onRestore]);

  /**
   * Redo last undone change
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    isRestoringRef.current = true;

    // Save current state to history stack
    const currentSnapshot = {
      nodes: JSON.parse(JSON.stringify(currentState.nodes)),
      edges: JSON.parse(JSON.stringify(currentState.edges)),
      exampleCases: JSON.parse(JSON.stringify(currentState.exampleCases || [])),
      timestamp: Date.now(),
    };

    setHistoryStack((prev) => [...prev, currentSnapshot]);

    // Pop from redo stack
    const newRedo = [...redoStack];
    const nextState = newRedo.pop();
    setRedoStack(newRedo);

    // Restore next state
    if (nextState && onRestore) {
      onRestore({
        nodes: nextState.nodes,
        edges: nextState.edges,
        exampleCases: nextState.exampleCases,
      });
    }

    // Reset flag after a short delay to allow state to settle
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 100);
  }, [redoStack, currentState, onRestore]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistoryStack([]);
    setRedoStack([]);
    sessionStorage.removeItem(sessionKey);
  }, [sessionKey]);

  /**
   * Get history stats
   */
  const getStats = useCallback(() => {
    return {
      historyCount: historyStack.length,
      redoCount: redoStack.length,
      canUndo: historyStack.length > 0,
      canRedo: redoStack.length > 0,
    };
  }, [historyStack.length, redoStack.length]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    undo,
    redo,
    canUndo: historyStack.length > 0,
    canRedo: redoStack.length > 0,
    pushState,
    clearHistory,
    getStats,
  };
}
