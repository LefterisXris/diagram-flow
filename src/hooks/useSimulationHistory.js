import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for tracking simulation history
 * Stores all simulation runs with timestamp, paths, and results
 */
export const useSimulationHistory = (diagramId) => {
  const [history, setHistory] = useState([]);
  const STORAGE_KEY = diagramId ? `simulation_history_${diagramId}` : 'simulation_history_current';
  const MAX_HISTORY_ITEMS = 50; // Limit history to 50 items per diagram

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load simulation history:', error);
      setHistory([]);
    }
  }, [STORAGE_KEY]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save simulation history:', error);
    }
  }, [history, STORAGE_KEY]);

  /**
   * Add a simulation run to history
   * @param {Object} run - Simulation run data
   * @param {string} run.caseId - Example case ID
   * @param {string} run.caseName - Example case name
   * @param {Array<string>} run.actualPath - Actual path taken
   * @param {Array<string>} run.expectedPath - Expected path
   * @param {boolean} run.success - Whether simulation succeeded
   * @param {number} run.duration - Duration in milliseconds
   * @param {Object} run.inputData - Input data for the case
   */
  const addToHistory = useCallback((run) => {
    const historyItem = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      caseId: run.caseId,
      caseName: run.caseName,
      actualPath: run.actualPath,
      expectedPath: run.expectedPath || [],
      success: run.success,
      pathMatches: run.pathMatches !== undefined ? run.pathMatches : false,
      duration: run.duration,
      inputData: run.inputData || {},
    };

    setHistory((prev) => {
      // Add new item at the beginning
      const updated = [historyItem, ...prev];
      // Limit to MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });

    return historyItem;
  }, []);

  /**
   * Get history for a specific case
   * @param {string} caseId - Case ID to filter by
   * @returns {Array} History items for the case
   */
  const getHistoryForCase = useCallback((caseId) => {
    return history.filter(item => item.caseId === caseId);
  }, [history]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  /**
   * Delete a specific history item
   * @param {string} historyId - ID of the history item to delete
   */
  const deleteHistoryItem = useCallback((historyId) => {
    setHistory((prev) => prev.filter(item => item.id !== historyId));
  }, []);

  /**
   * Get statistics for history
   */
  const getStatistics = useCallback(() => {
    const total = history.length;
    const successful = history.filter(h => h.success && h.pathMatches).length;
    const failed = total - successful;
    const averageDuration = total > 0
      ? history.reduce((sum, h) => sum + h.duration, 0) / total
      : 0;

    return {
      total,
      successful,
      failed,
      averageDuration,
      successRate: total > 0 ? (successful / total) * 100 : 0,
    };
  }, [history]);

  return {
    history,
    addToHistory,
    getHistoryForCase,
    clearHistory,
    deleteHistoryItem,
    getStatistics,
  };
};
