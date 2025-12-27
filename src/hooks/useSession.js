import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'diagram_session';
const COOKIE_EXPIRES_DAYS = 7;

/**
 * Session management hook
 * Creates and manages user sessions with cookie-based persistence
 */
export function useSession() {
  const [sessionId, setSessionId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize session on first load
  useEffect(() => {
    initializeSession();
  }, []);

  /**
   * Initialize or restore session
   */
  const initializeSession = () => {
    // Check if session cookie exists
    let existingSessionId = Cookies.get(COOKIE_NAME);

    if (existingSessionId) {
      // Restore existing session
      setSessionId(existingSessionId);
      updateLastAccess(existingSessionId);
    } else {
      // Create new session
      const newSessionId = crypto.randomUUID();

      // Set session cookie with 7-day expiration
      Cookies.set(COOKIE_NAME, newSessionId, { expires: COOKIE_EXPIRES_DAYS });

      // Create session data structure
      const now = new Date().toISOString();
      const sessionData = {
        sessionId: newSessionId,
        createdAt: now,
        lastAccess: now,
        activeDiagramId: null,
        recentDiagrams: [],
        preferences: {
          theme: 'dark',
          autoSaveInterval: 30000,
          defaultNodeType: 'service'
        }
      };

      // Store session data in localStorage
      localStorage.setItem(`session_${newSessionId}`, JSON.stringify(sessionData));
      localStorage.setItem(`session_${newSessionId}_activeDiagram`, '');
      localStorage.setItem(`session_${newSessionId}_preferences`, JSON.stringify(sessionData.preferences));

      setSessionId(newSessionId);
    }

    setIsInitialized(true);
  };

  /**
   * Update last access timestamp
   */
  const updateLastAccess = (sid) => {
    const sessionKey = `session_${sid}`;
    const sessionDataStr = localStorage.getItem(sessionKey);

    if (sessionDataStr) {
      try {
        const sessionData = JSON.parse(sessionDataStr);
        sessionData.lastAccess = new Date().toISOString();
        localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      } catch (error) {
        console.error('Failed to update session last access:', error);
      }
    }
  };

  /**
   * Get session data from localStorage
   */
  const getSessionData = () => {
    if (!sessionId) return null;

    const sessionKey = `session_${sessionId}`;
    const sessionDataStr = localStorage.getItem(sessionKey);

    if (sessionDataStr) {
      try {
        return JSON.parse(sessionDataStr);
      } catch (error) {
        console.error('Failed to parse session data:', error);
        return null;
      }
    }

    return null;
  };

  /**
   * Update session data in localStorage
   */
  const updateSessionData = (updates) => {
    if (!sessionId) return;

    const sessionKey = `session_${sessionId}`;
    const sessionData = getSessionData();

    if (sessionData) {
      const updatedData = {
        ...sessionData,
        ...updates,
        lastAccess: new Date().toISOString()
      };

      localStorage.setItem(sessionKey, JSON.stringify(updatedData));

      // Update separate storage keys if relevant fields changed
      if (updates.activeDiagramId !== undefined) {
        localStorage.setItem(`session_${sessionId}_activeDiagram`, updates.activeDiagramId || '');
      }

      if (updates.preferences) {
        localStorage.setItem(`session_${sessionId}_preferences`, JSON.stringify(updates.preferences));
      }
    }
  };

  /**
   * Set active diagram ID
   */
  const setActiveDiagram = (diagramId) => {
    updateSessionData({ activeDiagramId: diagramId });
  };

  /**
   * Update preferences
   */
  const updatePreferences = (preferences) => {
    updateSessionData({ preferences });
  };

  /**
   * Add to recent diagrams
   */
  const addRecentDiagram = (diagram) => {
    const sessionData = getSessionData();
    if (!sessionData) return;

    const recentDiagrams = sessionData.recentDiagrams || [];

    // Remove existing entry if present
    const filtered = recentDiagrams.filter(d => d.id !== diagram.id);

    // Add to beginning
    const updated = [diagram, ...filtered].slice(0, 10); // Keep max 10 recent

    updateSessionData({ recentDiagrams: updated });
  };

  /**
   * Clear session (logout)
   */
  const clearSession = () => {
    if (sessionId) {
      // Remove from localStorage
      localStorage.removeItem(`session_${sessionId}`);
      localStorage.removeItem(`session_${sessionId}_activeDiagram`);
      localStorage.removeItem(`session_${sessionId}_preferences`);

      // Remove cookie
      Cookies.remove(COOKIE_NAME);

      setSessionId(null);
      setIsInitialized(false);
    }
  };

  return {
    sessionId,
    isInitialized,
    getSessionData,
    updateSessionData,
    setActiveDiagram,
    updatePreferences,
    addRecentDiagram,
    clearSession
  };
}
