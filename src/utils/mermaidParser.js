/**
 * Mermaid to DiagramFlow Parser
 * Parses Mermaid flowchart syntax and converts to DiagramFlow format
 */

import { createConditionalEdgeData, normalizeConditionalEdge } from "./edgeConditions";

/**
 * Parse Mermaid code and convert to DiagramFlow nodes and edges
 * @param {string} mermaidCode - Mermaid flowchart code
 * @returns {Object} { nodes, edges, warnings, direction }
 */
export function parseMermaid(mermaidCode) {
  const warnings = [];
  const nodesMap = new Map(); // id -> node data
  const edges = [];
  let direction = 'TD'; // top-down by default

  // Clean and split into lines
  const lines = mermaidCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('%%')); // Remove comments

  // Extract direction from first line
  const firstLine = lines[0] || '';
  if (firstLine.match(/^(graph|flowchart)\s+(TD|LR|TB|RL)/i)) {
    const match = firstLine.match(/^(graph|flowchart)\s+(TD|LR|TB|RL)/i);
    direction = match[2].toUpperCase();
  }

  // Process each line
  for (const line of lines) {
    // Skip diagram declaration and subgraph lines (simplified)
    if (line.match(/^(graph|flowchart|subgraph|end)/i)) {
      if (line.match(/^subgraph/i)) {
        warnings.push('Subgraphs are not fully supported - nodes will be imported without grouping');
      }
      continue;
    }

    // Parse edges (connections between nodes)
    const edgeMatch = parseEdge(line);
    if (edgeMatch) {
      const { source, target, label, style } = edgeMatch;

      // Ensure nodes exist
      if (!nodesMap.has(source)) {
        nodesMap.set(source, createDefaultNode(source));
      }
      if (!nodesMap.has(target)) {
        nodesMap.set(target, createDefaultNode(target));
      }

      // Create edge
      edges.push(
        normalizeConditionalEdge({
          id: crypto.randomUUID(),
          source,
          target,
          label: label || '',
          animated: style.animated,
          type: 'smoothstep',
          style: style.edgeStyle,
          data: createConditionalEdgeData({ label: label || "" }),
        })
      );
      continue;
    }

    // Parse standalone node definition
    const nodeMatch = parseNode(line);
    if (nodeMatch) {
      const { id, label, shape } = nodeMatch;
      const nodeType = mapShapeToType(shape);

      if (!nodesMap.has(id)) {
        nodesMap.set(id, {
          id,
          label,
          type: nodeType,
          shape,
        });
      } else {
        // Update existing node with label and type
        const existing = nodesMap.get(id);
        existing.label = label;
        existing.type = nodeType;
        existing.shape = shape;
      }
    }
  }

  // Convert nodes map to array with full node structure
  const nodes = Array.from(nodesMap.values()).map(node => createDiagramFlowNode(node));

  return {
    nodes,
    edges,
    warnings,
    direction,
  };
}

/**
 * Parse edge syntax from a line
 * Supports: A --> B, A -- label --> B, A -->|label| B, A -.-> B, A ==> B
 */
function parseEdge(line) {
  // Pattern: source [edge] target
  // Edge patterns: -->, --->, -.-> , ==>, -- label -->, -->|label|

  // Try different edge patterns
  const patterns = [
    // A -->|label| B
    /^(\w+)\s+--+>?\|([^|]+)\|\s+(\w+)/,
    // A -- label --> B or A -. label .-> B
    /^(\w+)\s+(-+\.?|-\.+)\s+(.+?)\s+(-+\.?>|\.?-+>)\s+(\w+)/,
    // A --> B, A ---> B, A -.-> B, A ==> B
    /^(\w+)\s+(--+>|\.?-+\.?>|==+>)\s+(\w+)/,
    // A --- B (undirected)
    /^(\w+)\s+(---+)\s+(\w+)/,
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      if (pattern.source.includes('|')) {
        // Pattern with |label|
        return {
          source: match[1],
          target: match[3],
          label: match[2].trim(),
          style: getEdgeStyle(match[2].includes('-.') ? '-.->': '-->'),
        };
      } else if (match.length === 6) {
        // Pattern with -- label -->
        return {
          source: match[1],
          target: match[5],
          label: match[3].trim(),
          style: getEdgeStyle(match[4]),
        };
      } else if (match.length === 4) {
        // Simple pattern A --> B
        return {
          source: match[1],
          target: match[3],
          label: '',
          style: getEdgeStyle(match[2]),
        };
      }
    }
  }

  return null;
}

/**
 * Parse node definition from a line
 * Supports: A[Label], B(Label), C{Label}, D[(Label)], etc.
 */
function parseNode(line) {
  // Pattern: ID[label], ID(label), ID{label}, ID[(label)], etc.
  const patterns = [
    // Database: A[(Label)]
    { regex: /^(\w+)\[\(([^\]]+)\)\]/, shape: 'database' },
    // Decision: A{Label}
    { regex: /^(\w+)\{([^}]+)\}/, shape: 'decision' },
    // Circle: A((Label))
    { regex: /^(\w+)\(\(([^)]+)\)\)/, shape: 'circle' },
    // Stadium: A([Label])
    { regex: /^(\w+)\(\[([^\]]+)\]\)/, shape: 'stadium' },
    // Subroutine: A[[Label]]
    { regex: /^(\w+)\[\[([^\]]+)\]\]/, shape: 'subroutine' },
    // Hexagon: A{{Label}}
    { regex: /^(\w+)\{\{([^}]+)\}\}/, shape: 'hexagon' },
    // Rectangle: A[Label]
    { regex: /^(\w+)\[([^\]]+)\]/, shape: 'rectangle' },
    // Rounded: A(Label)
    { regex: /^(\w+)\(([^)]+)\)/, shape: 'rounded' },
  ];

  for (const { regex, shape } of patterns) {
    const match = line.match(regex);
    if (match) {
      return {
        id: match[1],
        label: match[2].trim(),
        shape,
      };
    }
  }

  return null;
}

/**
 * Map Mermaid shape to DiagramFlow node type
 */
function mapShapeToType(shape) {
  const mapping = {
    'database': 'database',
    'decision': 'decision',
    'circle': 'client',
    'stadium': 'process',
    'subroutine': 'process',
    'hexagon': 'process',
    'rectangle': 'service',
    'rounded': 'service',
  };

  return mapping[shape] || 'generic';
}

/**
 * Get edge style based on Mermaid edge syntax
 */
function getEdgeStyle(edgeSyntax) {
  if (edgeSyntax.includes('-.')) {
    return {
      animated: true,
      edgeStyle: { strokeDasharray: '5,5' },
    };
  } else if (edgeSyntax.includes('==')) {
    return {
      animated: true,
      edgeStyle: { strokeWidth: 3 },
    };
  } else if (edgeSyntax.includes('---')) {
    return {
      animated: false,
      edgeStyle: {},
    };
  } else {
    return {
      animated: true,
      edgeStyle: {},
    };
  }
}

/**
 * Create a default node when only ID is known
 */
function createDefaultNode(id) {
  return {
    id,
    label: id,
    type: 'generic',
    shape: 'rectangle',
  };
}

/**
 * Create full DiagramFlow node structure
 */
function createDiagramFlowNode(nodeData) {
  const now = new Date().toISOString();

  return {
    id: nodeData.id,
    type: nodeData.type,
    position: { x: 0, y: 0 }, // Will be set by layout algorithm
    data: {
      label: nodeData.label,
      shortDescription: '',
      detailedDescription: '',
      metadata: {
        dateAdded: now,
        dateModified: now,
        author: 'Imported from Mermaid',
        tags: ['imported', 'needs-review'],
        links: [],
        status: 'planned',
        version: '',
        owner: '',
        criticality: 'medium',
      },
    },
  };
}

/**
 * Apply simple hierarchical layout to nodes
 * @param {Array} nodes - DiagramFlow nodes
 * @param {Array} edges - DiagramFlow edges
 * @param {string} direction - Layout direction (TD or LR)
 */
export function applyLayout(nodes, edges, direction = 'TD') {
  if (nodes.length === 0) return nodes;

  // Build adjacency list to find node levels
  const adjacency = new Map();
  const inDegree = new Map();

  nodes.forEach(node => {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  edges.forEach(edge => {
    if (adjacency.has(edge.source)) {
      adjacency.get(edge.source).push(edge.target);
    }
    if (inDegree.has(edge.target)) {
      inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    }
  });

  // Find root nodes (no incoming edges)
  const roots = nodes.filter(node => inDegree.get(node.id) === 0);
  if (roots.length === 0) {
    // If no roots (circular), use first node
    roots.push(nodes[0]);
  }

  // BFS to assign levels
  const levels = new Map();
  const queue = [...roots];
  roots.forEach(node => levels.set(node.id, 0));

  while (queue.length > 0) {
    const current = queue.shift();
    const currentLevel = levels.get(current.id);
    const neighbors = adjacency.get(current.id) || [];

    neighbors.forEach(neighborId => {
      if (!levels.has(neighborId)) {
        levels.set(neighborId, currentLevel + 1);
        queue.push(nodes.find(n => n.id === neighborId));
      }
    });
  }

  // Assign positions based on levels
  const levelGroups = new Map();
  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level).push(node);
  });

  const horizontalSpacing = 250;
  const verticalSpacing = 150;

  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    const nodesInLevel = levelGroups.get(level);
    const indexInLevel = nodesInLevel.indexOf(node);

    if (direction === 'LR') {
      // Left to right
      node.position = {
        x: level * horizontalSpacing,
        y: indexInLevel * verticalSpacing,
      };
    } else {
      // Top to bottom (TD)
      node.position = {
        x: indexInLevel * horizontalSpacing,
        y: level * verticalSpacing,
      };
    }
  });

  return nodes;
}
