/**
 * Simulation Highlighting Utilities
 * Applies visual styles to nodes and edges during simulation
 */

/**
 * Apply simulation highlighting to nodes
 * @param {Array} nodes - All nodes in the diagram
 * @param {Object} simulationState - Current simulation state
 * @returns {Array} Nodes with updated styles
 */
export function applySimulationStylesToNodes(nodes, simulationState) {
  if (!simulationState || !simulationState.isActive) {
    // No simulation active, return nodes without simulation styles
    return nodes.map(node => ({
      ...node,
      className: node.className?.replace(/simulation-\w+-node/g, '').trim() || '',
    }));
  }

  const { currentStepIndex, path } = simulationState;

  if (!path || path.length === 0) {
    return nodes;
  }

  const currentNodeId = path[currentStepIndex];
  const pastNodeIds = new Set(path.slice(0, currentStepIndex));
  const upcomingNodeIds = new Set(path.slice(currentStepIndex + 1));

  return nodes.map(node => {
    let className = node.className || '';

    // Remove existing simulation classes
    className = className.replace(/simulation-\w+-node/g, '').trim();

    // Apply appropriate simulation class
    if (node.id === currentNodeId) {
      className += ' simulation-active-node';
    } else if (pastNodeIds.has(node.id)) {
      className += ' simulation-past-node';
    } else if (upcomingNodeIds.has(node.id)) {
      className += ' simulation-upcoming-node';
    }

    return {
      ...node,
      className: className.trim(),
    };
  });
}

/**
 * Apply simulation highlighting to edges
 * @param {Array} edges - All edges in the diagram
 * @param {Object} simulationState - Current simulation state
 * @returns {Array} Edges with updated styles
 */
export function applySimulationStylesToEdges(edges, simulationState) {
  if (!simulationState || !simulationState.isActive) {
    // No simulation active, return edges without simulation styles
    return edges.map(edge => ({
      ...edge,
      animated: edge.data?.defaultAnimated || false,
      style: {
        ...edge.style,
        stroke: edge.data?.defaultStroke || edge.style?.stroke,
        strokeWidth: edge.data?.defaultStrokeWidth || edge.style?.strokeWidth || 2,
      },
    }));
  }

  const { currentStepIndex, steps, path } = simulationState;

  if (!steps || steps.length === 0 || !path) {
    return edges;
  }

  // Build a set of edges that have been traversed
  const traversedEdges = new Set();
  const currentEdge = steps[currentStepIndex]?.edgeTaken?.id;

  // Collect all edges taken in previous steps
  for (let i = 1; i <= currentStepIndex; i++) {
    const edgeId = steps[i]?.edgeTaken?.id;
    if (edgeId) {
      traversedEdges.add(edgeId);
    }
  }

  // Build a set of upcoming edges
  const upcomingEdges = new Set();
  for (let i = currentStepIndex + 1; i < steps.length; i++) {
    const edgeId = steps[i]?.edgeTaken?.id;
    if (edgeId) {
      upcomingEdges.add(edgeId);
    }
  }

  return edges.map(edge => {
    // Store default values if not already stored
    const defaultAnimated = edge.data?.defaultAnimated !== undefined
      ? edge.data.defaultAnimated
      : edge.animated || false;
    const defaultStroke = edge.data?.defaultStroke || edge.style?.stroke;
    const defaultStrokeWidth = edge.data?.defaultStrokeWidth || edge.style?.strokeWidth || 2;

    let style = { ...edge.style };
    let animated = edge.animated;

    if (edge.id === currentEdge) {
      // Active edge: brighter color, faster animation, thicker
      style = {
        ...style,
        stroke: '#3b82f6',
        strokeWidth: 4,
      };
      animated = true;
    } else if (traversedEdges.has(edge.id)) {
      // Past edges: green overlay
      style = {
        ...style,
        stroke: '#10b981',
        strokeWidth: 3,
      };
      animated = false;
    } else if (upcomingEdges.has(edge.id)) {
      // Upcoming edges: gray preview
      style = {
        ...style,
        stroke: '#94a3b8',
        strokeWidth: 2,
        strokeDasharray: '5,5',
      };
      animated = false;
    } else {
      // Not in path: use default styles
      style = {
        ...style,
        stroke: defaultStroke,
        strokeWidth: defaultStrokeWidth,
      };
      animated = defaultAnimated;
    }

    return {
      ...edge,
      animated,
      style,
      data: {
        ...edge.data,
        defaultAnimated,
        defaultStroke,
        defaultStrokeWidth,
      },
    };
  });
}

/**
 * Clear all simulation styles
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 * @returns {Object} { nodes, edges } with cleared styles
 */
export function clearSimulationStyles(nodes, edges) {
  return {
    nodes: applySimulationStylesToNodes(nodes, null),
    edges: applySimulationStylesToEdges(edges, null),
  };
}
