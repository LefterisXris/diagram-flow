import { Parser } from 'expr-eval';

/**
 * Simulation Engine - Executes flow simulation with example cases
 *
 * Takes an example case and diagram (nodes, edges) and simulates the flow:
 * 1. Starts at the input node specified in the example case
 * 2. Traverses edges based on conditional logic
 * 3. Evaluates conditions at decision nodes using expr-eval
 * 4. Builds a path array of node IDs
 * 5. Tracks data transformations at each step
 * 6. Handles errors (invalid conditions, circular paths, dead ends)
 */

const MAX_STEPS = 100; // Prevent infinite loops

/**
 * Simulate flow execution for an example case
 * @param {Object} exampleCase - The example case to simulate
 * @param {Array} nodes - All nodes in the diagram
 * @param {Array} edges - All edges in the diagram
 * @returns {Object} Simulation result with path, steps, and errors
 */
export function simulateFlow(exampleCase, nodes, edges) {
  // Validate inputs
  if (!exampleCase || !exampleCase.input || !exampleCase.input.nodeId) {
    return {
      success: false,
      error: 'Invalid example case: missing input node',
      path: [],
      steps: [],
    };
  }

  if (!nodes || nodes.length === 0) {
    return {
      success: false,
      error: 'No nodes in diagram',
      path: [],
      steps: [],
    };
  }

  // Find starting node
  const startNode = nodes.find(n => n.id === exampleCase.input.nodeId);
  if (!startNode) {
    return {
      success: false,
      error: `Starting node not found: ${exampleCase.input.nodeId}`,
      path: [],
      steps: [],
    };
  }

  // Initialize simulation state
  const path = [startNode.id];
  const steps = [];
  let currentNodeId = startNode.id;
  let currentData = { ...exampleCase.input.data };
  let stepCount = 0;
  const visitedNodes = new Set([startNode.id]);

  // Track first step
  steps.push({
    stepIndex: 0,
    nodeId: currentNodeId,
    nodeName: startNode.data?.label || currentNodeId,
    nodeType: startNode.type,
    inputData: currentData,
    outputData: currentData,
    transformations: [],
    edgeTaken: null,
    conditionEvaluated: null,
  });

  // Simulate flow
  while (stepCount < MAX_STEPS) {
    stepCount++;

    // Find outgoing edges from current node
    const outgoingEdges = edges.filter(e => e.source === currentNodeId);

    // If no outgoing edges, simulation ends (terminal node)
    if (outgoingEdges.length === 0) {
      return {
        success: true,
        path,
        steps,
        endReason: 'terminal_node',
        message: 'Simulation completed: reached terminal node',
      };
    }

    // Get current node
    const currentNode = nodes.find(n => n.id === currentNodeId);

    // Evaluate which edge to take
    let selectedEdge = null;
    let conditionResult = null;

    if (currentNode.type === 'decision') {
      // Decision node: evaluate conditions
      const result = evaluateDecisionNode(outgoingEdges, currentData);

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          path,
          steps,
        };
      }

      selectedEdge = result.edge;
      conditionResult = result.evaluation;
    } else {
      // Non-decision node: take first edge (or only edge)
      selectedEdge = outgoingEdges[0];
      conditionResult = {
        condition: null,
        result: true,
        message: 'Single path node',
      };
    }

    if (!selectedEdge) {
      return {
        success: false,
        error: 'No valid edge found',
        path,
        steps,
      };
    }

    // Move to next node
    const nextNodeId = selectedEdge.target;
    const nextNode = nodes.find(n => n.id === nextNodeId);

    if (!nextNode) {
      return {
        success: false,
        error: `Target node not found: ${nextNodeId}`,
        path,
        steps,
      };
    }

    // Check for circular path
    if (visitedNodes.has(nextNodeId)) {
      return {
        success: false,
        error: `Circular path detected at node: ${nextNode.data?.label || nextNodeId}`,
        path,
        steps,
      };
    }

    // Update path and visited nodes
    path.push(nextNodeId);
    visitedNodes.add(nextNodeId);
    currentNodeId = nextNodeId;

    // For now, data passes through unchanged (transformations in Phase 6)
    const nextData = { ...currentData };

    // Track step
    steps.push({
      stepIndex: steps.length,
      nodeId: nextNodeId,
      nodeName: nextNode.data?.label || nextNodeId,
      nodeType: nextNode.type,
      inputData: currentData,
      outputData: nextData,
      transformations: [],
      edgeTaken: {
        id: selectedEdge.id,
        label: selectedEdge.label || selectedEdge.data?.label,
      },
      conditionEvaluated: conditionResult,
    });

    currentData = nextData;
  }

  // Max steps reached
  return {
    success: false,
    error: `Maximum steps (${MAX_STEPS}) exceeded - possible infinite loop`,
    path,
    steps,
  };
}

/**
 * Evaluate conditions at a decision node
 * @param {Array} edges - Outgoing edges from decision node
 * @param {Object} data - Current data context for evaluation
 * @returns {Object} Selected edge and evaluation result
 */
function evaluateDecisionNode(edges, data) {
  // Sort edges by priority (if specified in data.priority)
  const sortedEdges = [...edges].sort((a, b) => {
    const priorityA = a.data?.priority || a.priority || 999;
    const priorityB = b.data?.priority || b.priority || 999;
    return priorityA - priorityB;
  });

  // Track all evaluations for debugging
  const evaluations = [];

  // Try each edge condition in priority order
  for (const edge of sortedEdges) {
    const condition = edge.data?.condition || edge.condition;

    // If no condition, treat as default/fallback path
    if (!condition || condition.trim() === '') {
      const conditionType = edge.data?.conditionType || 'default';

      if (conditionType === 'default') {
        return {
          success: true,
          edge,
          evaluation: {
            condition: null,
            result: true,
            message: 'Default path (no condition)',
            conditionType: 'default',
          },
          allEvaluations: evaluations,
        };
      }
    }

    // Evaluate condition
    try {
      const parser = new Parser();
      const expr = parser.parse(condition);

      // Create evaluation context with 'input' prefix
      const context = { input: data, ...data };

      const result = expr.evaluate(context);
      const boolResult = Boolean(result);

      evaluations.push({
        edge: edge.id,
        condition,
        result: boolResult,
        data: context,
      });

      // If condition is true, take this path
      if (boolResult) {
        return {
          success: true,
          edge,
          evaluation: {
            condition,
            result: true,
            message: `Condition evaluated to true: ${condition}`,
            conditionType: edge.data?.conditionType || 'conditional',
          },
          allEvaluations: evaluations,
        };
      }
    } catch (error) {
      // Invalid condition - return error
      return {
        success: false,
        error: `Invalid condition: "${condition}" - ${error.message}`,
      };
    }
  }

  // No condition evaluated to true and no default path
  return {
    success: false,
    error: 'No condition matched and no default path defined',
    allEvaluations: evaluations,
  };
}

/**
 * Validate a condition expression without executing it
 * @param {string} condition - The condition expression to validate
 * @returns {Object} Validation result
 */
export function validateCondition(condition) {
  if (!condition || condition.trim() === '') {
    return {
      valid: true,
      message: 'Empty condition (will be treated as default path)',
    };
  }

  try {
    const parser = new Parser();
    parser.parse(condition);
    return {
      valid: true,
      message: 'Condition is valid',
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      message: `Invalid condition syntax: ${error.message}`,
    };
  }
}

/**
 * Test evaluate a condition with sample data
 * @param {string} condition - The condition expression
 * @param {Object} data - Sample data for testing
 * @returns {Object} Evaluation result
 */
export function testCondition(condition, data) {
  try {
    const parser = new Parser();
    const expr = parser.parse(condition);
    const context = { input: data, ...data };
    const result = expr.evaluate(context);

    return {
      success: true,
      result: Boolean(result),
      rawResult: result,
      message: `Condition evaluated to: ${result}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Evaluation failed: ${error.message}`,
    };
  }
}
