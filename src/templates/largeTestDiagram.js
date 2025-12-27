/**
 * Large Test Diagram Template
 *
 * Generates a diagram with 100+ nodes for performance testing.
 * Creates a microservices architecture with services, databases, and decision nodes.
 */

/**
 * Generate a large test diagram for performance testing
 * @param {number} nodeCount - Number of nodes to generate (default: 120)
 * @returns {Object} - Diagram with nodes, edges, and example cases
 */
export function generateLargeTestDiagram(nodeCount = 120) {
  const nodes = [];
  const edges = [];

  // Calculate grid layout
  const nodesPerRow = Math.ceil(Math.sqrt(nodeCount));
  const horizontalSpacing = 300;
  const verticalSpacing = 200;

  // Node types distribution
  const nodeTypes = ['service', 'database', 'client', 'decision', 'generic'];
  const nodeTypeWeights = [0.4, 0.2, 0.1, 0.15, 0.15]; // 40% service, 20% database, etc.

  // Generate nodes
  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / nodesPerRow);
    const col = i % nodesPerRow;

    // Determine node type based on weights
    let typeIndex = 0;
    const random = Math.random();
    let cumulative = 0;
    for (let j = 0; j < nodeTypeWeights.length; j++) {
      cumulative += nodeTypeWeights[j];
      if (random < cumulative) {
        typeIndex = j;
        break;
      }
    }

    const type = nodeTypes[typeIndex];
    const nodeId = `${type}-${i}`;

    // Generate node data based on type
    let nodeData = {
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
    };

    if (type === 'service') {
      nodeData = {
        ...nodeData,
        tech: ['Node.js', 'Java', 'Python', 'Go', 'Ruby'][i % 5],
        description: `Microservice handling specific business logic ${i}`,
        owner: `Team ${String.fromCharCode(65 + (i % 10))}`,
        status: ['deployed', 'in-progress', 'planned'][i % 3],
        tags: ['backend', 'api', `service-${i}`],
      };
    } else if (type === 'database') {
      nodeData = {
        ...nodeData,
        tech: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB'][i % 5],
        description: `Data store for ${type} ${i}`,
        owner: `Team ${String.fromCharCode(65 + (i % 10))}`,
        tags: ['database', 'storage'],
      };
    } else if (type === 'client') {
      nodeData = {
        ...nodeData,
        tech: ['React', 'Angular', 'Vue', 'Mobile', 'Desktop'][i % 5],
        description: `Client application ${i}`,
        tags: ['frontend', 'ui'],
      };
    } else if (type === 'decision') {
      nodeData = {
        ...nodeData,
        description: `Decision point for routing logic ${i}`,
        tags: ['logic', 'routing'],
      };
    }

    nodes.push({
      id: nodeId,
      type: type,
      position: {
        x: col * horizontalSpacing + (row % 2) * (horizontalSpacing / 2), // Slight offset for alternating rows
        y: row * verticalSpacing,
      },
      data: nodeData,
    });
  }

  // Generate edges (connect nodes with some logic)
  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i];

    // Connect to next node
    if (i < nodes.length - 1) {
      edges.push({
        id: `edge-${i}-${i + 1}`,
        source: sourceNode.id,
        target: nodes[i + 1].id,
        animated: i % 3 === 0, // Animate every 3rd edge
        type: 'smoothstep',
        data: {
          label: i % 5 === 0 ? `Flow ${i}` : '',
        },
      });
    }

    // Add some cross-connections (every 10th node connects to a node 5 positions ahead)
    if (i % 10 === 0 && i + 5 < nodes.length) {
      edges.push({
        id: `edge-cross-${i}-${i + 5}`,
        source: sourceNode.id,
        target: nodes[i + 5].id,
        animated: false,
        type: 'smoothstep',
        data: {
          label: 'Cross-link',
        },
      });
    }

    // Decision nodes have multiple outgoing edges
    if (sourceNode.type === 'decision' && i + 2 < nodes.length) {
      edges.push({
        id: `edge-decision-${i}-${i + 2}`,
        source: sourceNode.id,
        target: nodes[i + 2].id,
        animated: true,
        type: 'smoothstep',
        data: {
          conditionType: 'expression',
          condition: `value > ${i}`,
          label: `if value > ${i}`,
        },
      });
    }
  }

  // Create example cases for simulation
  const exampleCases = [
    {
      id: 'test-case-1',
      name: 'Performance Test Case 1',
      description: 'Tests flow through first 20 nodes',
      startNodeId: nodes[0].id,
      inputData: { value: 100, testId: 1 },
      expectedPath: nodes.slice(0, 20).map(n => n.id),
    },
    {
      id: 'test-case-2',
      name: 'Performance Test Case 2',
      description: 'Tests flow through middle section',
      startNodeId: nodes[Math.floor(nodeCount / 2)].id,
      inputData: { value: 200, testId: 2 },
      expectedPath: nodes.slice(Math.floor(nodeCount / 2), Math.floor(nodeCount / 2) + 15).map(n => n.id),
    },
  ];

  return {
    metadata: {
      name: `Performance Test Diagram (${nodeCount} nodes)`,
      description: 'Large diagram for performance testing',
      version: '1.0.0',
      created: new Date().toISOString(),
    },
    nodes,
    edges,
    exampleCases,
  };
}

// Pre-generated 120-node test diagram
export const largeTestDiagram = generateLargeTestDiagram(120);
