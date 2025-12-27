/**
 * Diagram Library - Manages saved diagrams in localStorage
 * Stores diagrams with key: diagram_<id>
 * Maintains index in: diagram_list
 */

import { normalizeExampleCases } from './exampleCases';

const DIAGRAM_LIST_KEY = 'diagram_list';
const DIAGRAM_PREFIX = 'diagram_';

/**
 * Get all saved diagrams metadata
 * @returns {Array} Array of diagram metadata objects
 */
export function listDiagrams() {
  const listStr = localStorage.getItem(DIAGRAM_LIST_KEY);

  if (!listStr) {
    return [];
  }

  try {
    const list = JSON.parse(listStr);
    // Sort by lastModified descending (most recent first)
    return list.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  } catch (error) {
    console.error('Failed to parse diagram list:', error);
    return [];
  }
}

/**
 * Save a diagram to localStorage
 * @param {Object} diagram - The diagram data
 * @param {string} diagram.name - Diagram name
 * @param {Array} diagram.nodes - React Flow nodes
 * @param {Array} diagram.edges - React Flow edges
 * @param {Object} diagram.viewport - Viewport state (zoom, x, y)
 * @param {Array} diagram.exampleCases - Example cases
 * @param {string} [diagram.id] - Optional diagram ID (generates UUID if not provided)
 * @returns {Object} Saved diagram metadata
 */
export function saveDiagram({ name, nodes, edges, viewport, exampleCases, id }) {
  // Generate ID if not provided
  const diagramId = id || crypto.randomUUID();
  const now = new Date().toISOString();

  // Calculate created date from oldest node or use now
  let createdAt = now;
  if (nodes && nodes.length > 0) {
    const oldestNode = nodes.reduce((oldest, node) => {
      const nodeDate = node.data?.metadata?.dateAdded;
      if (!nodeDate) return oldest;
      if (!oldest || new Date(nodeDate) < new Date(oldest)) {
        return nodeDate;
      }
      return oldest;
    }, null);

    if (oldestNode) {
      createdAt = oldestNode;
    }
  }

  // Create diagram data
  const diagramData = {
    version: '1.0.0',
    metadata: {
      id: diagramId,
      name: name || 'Untitled Diagram',
      createdAt,
      lastModified: now,
    },
    nodes: nodes || [],
    edges: edges || [],
    viewport: viewport || { zoom: 1, x: 0, y: 0 },
    exampleCases: normalizeExampleCases(exampleCases),
  };

  // Save diagram data
  const diagramKey = `${DIAGRAM_PREFIX}${diagramId}`;
  localStorage.setItem(diagramKey, JSON.stringify(diagramData));

  // Update diagram list index
  const list = listDiagrams();
  const existingIndex = list.findIndex(d => d.id === diagramId);

  const metadata = {
    id: diagramId,
    name: diagramData.metadata.name,
    createdAt: diagramData.metadata.createdAt,
    lastModified: now,
    nodeCount: nodes ? nodes.length : 0,
    edgeCount: edges ? edges.length : 0,
  };

  if (existingIndex >= 0) {
    // Update existing entry
    list[existingIndex] = metadata;
  } else {
    // Add new entry
    list.push(metadata);
  }

  localStorage.setItem(DIAGRAM_LIST_KEY, JSON.stringify(list));

  return metadata;
}

/**
 * Load a diagram from localStorage
 * @param {string} diagramId - The diagram ID to load
 * @returns {Object|null} Diagram data or null if not found
 */
export function loadDiagram(diagramId) {
  const diagramKey = `${DIAGRAM_PREFIX}${diagramId}`;
  const diagramStr = localStorage.getItem(diagramKey);

  if (!diagramStr) {
    console.error(`Diagram not found: ${diagramId}`);
    return null;
  }

  try {
    return JSON.parse(diagramStr);
  } catch (error) {
    console.error('Failed to parse diagram:', error);
    return null;
  }
}

/**
 * Delete a diagram from localStorage
 * @param {string} diagramId - The diagram ID to delete
 * @returns {boolean} True if deleted successfully
 */
export function deleteDiagram(diagramId) {
  // Remove diagram data
  const diagramKey = `${DIAGRAM_PREFIX}${diagramId}`;
  localStorage.removeItem(diagramKey);

  // Update diagram list index
  const list = listDiagrams();
  const updatedList = list.filter(d => d.id !== diagramId);
  localStorage.setItem(DIAGRAM_LIST_KEY, JSON.stringify(updatedList));

  return true;
}

/**
 * Rename a diagram
 * @param {string} diagramId - The diagram ID to rename
 * @param {string} newName - New diagram name
 * @returns {boolean} True if renamed successfully
 */
export function renameDiagram(diagramId, newName) {
  const diagram = loadDiagram(diagramId);

  if (!diagram) {
    return false;
  }

  // Update diagram data
  diagram.metadata.name = newName;
  diagram.metadata.lastModified = new Date().toISOString();

  const diagramKey = `${DIAGRAM_PREFIX}${diagramId}`;
  localStorage.setItem(diagramKey, JSON.stringify(diagram));

  // Update diagram list index
  const list = listDiagrams();
  const entry = list.find(d => d.id === diagramId);

  if (entry) {
    entry.name = newName;
    entry.lastModified = diagram.metadata.lastModified;
    localStorage.setItem(DIAGRAM_LIST_KEY, JSON.stringify(list));
  }

  return true;
}

/**
 * Get diagram metadata without loading full diagram
 * @param {string} diagramId - The diagram ID
 * @returns {Object|null} Diagram metadata or null if not found
 */
export function getDiagramMetadata(diagramId) {
  const list = listDiagrams();
  return list.find(d => d.id === diagramId) || null;
}
