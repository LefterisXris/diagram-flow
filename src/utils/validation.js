/**
 * Validation & Linting Utilities
 *
 * Provides validation rules for diagrams to detect common issues.
 */

/**
 * Validation severity levels
 */
export const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Validation rule types
 */
export const RULE_TYPE = {
  ORPHAN_NODE: 'orphan_node',
  DEAD_END: 'dead_end',
  MISSING_FIELD: 'missing_field',
  CIRCULAR_DEPENDENCY: 'circular_dependency',
};

/**
 * Detect orphan nodes (nodes with no connections)
 *
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Array} Array of validation warnings for orphan nodes
 */
export function detectOrphanNodes(nodes, edges) {
  const warnings = [];
  const connectedNodeIds = new Set();

  // Collect all nodes that have at least one connection
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  // Find nodes with no connections
  nodes.forEach(node => {
    if (!connectedNodeIds.has(node.id)) {
      warnings.push({
        id: `orphan-${node.id}`,
        type: RULE_TYPE.ORPHAN_NODE,
        severity: SEVERITY.WARNING,
        nodeId: node.id,
        nodeName: node.data?.label || 'Unnamed Node',
        message: `"${node.data?.label || 'Unnamed Node'}" has no connections`,
        description: 'This node is not connected to any other nodes. Consider connecting it or removing it.',
      });
    }
  });

  return warnings;
}

/**
 * Detect dead ends (nodes with no outgoing edges)
 * Excludes certain node types that are expected to be terminal (e.g., database, client in some contexts)
 *
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Array} Array of validation warnings for dead-end nodes
 */
export function detectDeadEnds(nodes, edges) {
  const warnings = [];
  const nodesWithOutgoing = new Set();

  // Collect nodes that have outgoing edges
  edges.forEach(edge => {
    nodesWithOutgoing.add(edge.source);
  });

  // Terminal node types that are expected to have no outgoing edges
  const terminalTypes = ['database', 'client'];

  // Find nodes with no outgoing edges (excluding terminal types and decision nodes without conditions)
  nodes.forEach(node => {
    const hasOutgoing = nodesWithOutgoing.has(node.id);
    const isTerminal = terminalTypes.includes(node.type);

    if (!hasOutgoing && !isTerminal) {
      // Check if node has incoming edges (not an orphan)
      const hasIncoming = edges.some(edge => edge.target === node.id);

      if (hasIncoming) {
        warnings.push({
          id: `dead-end-${node.id}`,
          type: RULE_TYPE.DEAD_END,
          severity: SEVERITY.WARNING,
          nodeId: node.id,
          nodeName: node.data?.label || 'Unnamed Node',
          message: `"${node.data?.label || 'Unnamed Node'}" has no outgoing connections`,
          description: 'This node receives connections but has no outgoing edges. Consider adding connections or changing the node type.',
        });
      }
    }
  });

  return warnings;
}

/**
 * Detect nodes with missing required fields
 *
 * @param {Array} nodes - Array of nodes
 * @returns {Array} Array of validation warnings for missing fields
 */
export function detectMissingFields(nodes) {
  const warnings = [];

  nodes.forEach(node => {
    const data = node.data || {};
    const label = data.label || '';

    // Check for missing or empty label
    if (!label || label.trim() === '') {
      warnings.push({
        id: `missing-field-${node.id}`,
        type: RULE_TYPE.MISSING_FIELD,
        severity: SEVERITY.ERROR,
        nodeId: node.id,
        nodeName: 'Unnamed Node',
        message: 'Node is missing a name',
        description: 'Every node must have a name. Click to edit this node and add a name.',
      });
    }
  });

  return warnings;
}

/**
 * Detect circular dependencies in the graph
 * Uses DFS to detect cycles
 *
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Array} Array of validation warnings for circular dependencies
 */
export function detectCircularDependencies(nodes, edges) {
  const warnings = [];
  const nodeIds = new Set(nodes.map(n => n.id));

  // Build adjacency list
  const adjacencyList = {};
  nodeIds.forEach(id => {
    adjacencyList[id] = [];
  });

  edges.forEach(edge => {
    if (adjacencyList[edge.source]) {
      adjacencyList[edge.source].push(edge.target);
    }
  });

  // Track visited nodes and nodes in current path
  const visited = new Set();
  const inPath = new Set();
  const cycles = [];

  /**
   * DFS to detect cycles
   */
  function dfs(nodeId, path = []) {
    if (inPath.has(nodeId)) {
      // Found a cycle
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart);
      cycle.push(nodeId); // Complete the cycle
      cycles.push(cycle);
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    inPath.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacencyList[nodeId] || [];
    neighbors.forEach(neighbor => {
      dfs(neighbor, [...path]);
    });

    inPath.delete(nodeId);
  }

  // Run DFS from each unvisited node
  nodeIds.forEach(nodeId => {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  });

  // Create warnings for each unique cycle
  const seenCycles = new Set();
  cycles.forEach(cycle => {
    // Normalize cycle (sort and join to create unique identifier)
    const normalized = [...cycle].sort().join('-');
    if (!seenCycles.has(normalized)) {
      seenCycles.add(normalized);

      const nodeNames = cycle.map(id => {
        const node = nodes.find(n => n.id === id);
        return node?.data?.label || 'Unnamed Node';
      });

      const cycleDescription = nodeNames.join(' → ');

      warnings.push({
        id: `circular-${normalized}`,
        type: RULE_TYPE.CIRCULAR_DEPENDENCY,
        severity: SEVERITY.WARNING,
        nodeId: cycle[0], // First node in cycle
        nodeName: nodeNames[0],
        message: `Circular dependency detected: ${cycleDescription}`,
        description: 'This node is part of a circular dependency chain. Consider restructuring the flow to remove the cycle.',
        affectedNodes: cycle,
      });
    }
  });

  return warnings;
}

/**
 * Run all validation rules and return combined warnings
 *
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Object} Object with warnings array and counts by severity
 */
export function validateDiagram(nodes, edges) {
  const orphanWarnings = detectOrphanNodes(nodes, edges);
  const deadEndWarnings = detectDeadEnds(nodes, edges);
  const missingFieldWarnings = detectMissingFields(nodes);
  const circularWarnings = detectCircularDependencies(nodes, edges);

  const allWarnings = [
    ...missingFieldWarnings,  // Errors first
    ...circularWarnings,
    ...deadEndWarnings,
    ...orphanWarnings,
  ];

  // Count by severity
  const counts = {
    [SEVERITY.ERROR]: 0,
    [SEVERITY.WARNING]: 0,
    [SEVERITY.INFO]: 0,
  };

  allWarnings.forEach(warning => {
    counts[warning.severity]++;
  });

  return {
    warnings: allWarnings,
    counts,
    hasErrors: counts[SEVERITY.ERROR] > 0,
    hasWarnings: counts[SEVERITY.WARNING] > 0,
    total: allWarnings.length,
  };
}
