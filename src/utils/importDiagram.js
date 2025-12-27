/**
 * Import diagram data from JSON file
 * Validates structure and loads into React Flow
 */

/**
 * Validate the imported JSON structure
 * @param {Object} data - Parsed JSON data
 * @returns {Object} - { valid: boolean, error: string | null }
 */
const validateDiagramStructure = (data) => {
  // Check version
  if (!data.version) {
    return { valid: false, error: "Missing version field" };
  }

  // Check metadata
  if (!data.metadata || typeof data.metadata !== "object") {
    return { valid: false, error: "Missing or invalid metadata" };
  }

  // Check nodes array
  if (!Array.isArray(data.nodes)) {
    return { valid: false, error: "Missing or invalid nodes array" };
  }

  // Check edges array
  if (!Array.isArray(data.edges)) {
    return { valid: false, error: "Missing or invalid edges array" };
  }

  // Validate each node has required fields
  for (let i = 0; i < data.nodes.length; i++) {
    const node = data.nodes[i];
    if (!node.id || !node.name || !node.type || !node.position) {
      return {
        valid: false,
        error: `Node at index ${i} is missing required fields (id, name, type, or position)`
      };
    }
    if (typeof node.position !== "object" || node.position.x === undefined || node.position.y === undefined) {
      return {
        valid: false,
        error: `Node at index ${i} has invalid position (must have x and y coordinates)`
      };
    }
  }

  // Validate each edge has required fields
  for (let i = 0; i < data.edges.length; i++) {
    const edge = data.edges[i];
    if (!edge.id || !edge.source || !edge.target) {
      return {
        valid: false,
        error: `Edge at index ${i} is missing required fields (id, source, or target)`
      };
    }
  }

  return { valid: true, error: null };
};

/**
 * Convert imported node data to React Flow format
 * @param {Object} nodeData - Node from imported JSON
 * @returns {Object} - React Flow node object
 */
const convertNodeToReactFlow = (nodeData) => {
  return {
    id: nodeData.id,
    type: nodeData.type || "generic",
    position: nodeData.position,
    data: {
      label: nodeData.name,
      icon: nodeData.icon || null,
      shortDescription: nodeData.shortDescription || "",
      detailedDescription: nodeData.detailedDescription || "",
      metadata: {
        status: nodeData.metadata?.status || "planned",
        owner: nodeData.metadata?.owner || "",
        version: nodeData.metadata?.version || "",
        tags: nodeData.metadata?.tags || [],
        links: nodeData.metadata?.links || [],
        dateAdded: nodeData.metadata?.dateAdded || new Date().toISOString(),
        dateModified: nodeData.metadata?.dateModified || new Date().toISOString(),
        author: nodeData.metadata?.author || "",
        criticality: nodeData.metadata?.criticality || "medium",
      },
    },
  };
};

/**
 * Convert imported edge data to React Flow format
 * @param {Object} edgeData - Edge from imported JSON
 * @returns {Object} - React Flow edge object
 */
const convertEdgeToReactFlow = (edgeData) => {
  return {
    id: edgeData.id,
    source: edgeData.source,
    target: edgeData.target,
    label: edgeData.label || "",
    animated: edgeData.animated || false,
    type: edgeData.type || "default",
    style: edgeData.style || {},
    metadata: edgeData.metadata || {},
  };
};

/**
 * Import and parse diagram JSON file
 * @param {File} file - File object from input
 * @returns {Promise<Object>} - { success: boolean, data?: Object, error?: string }
 */
export const importDiagram = async (file) => {
  try {
    // Validate file type
    if (!file.name.endsWith(".json")) {
      return {
        success: false,
        error: "Invalid file type. Please select a JSON file."
      };
    }

    // Read file content
    const fileContent = await file.text();

    // Parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(fileContent);
    } catch (parseError) {
      return {
        success: false,
        error: "Invalid JSON format. Unable to parse file."
      };
    }

    // Validate structure
    const validation = validateDiagramStructure(parsedData);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid diagram structure: ${validation.error}`
      };
    }

    // Convert nodes and edges to React Flow format
    const nodes = parsedData.nodes.map(convertNodeToReactFlow);
    const edges = parsedData.edges.map(convertEdgeToReactFlow);

    // Extract layout info
    const layout = parsedData.layout || {};
    const viewport = {
      zoom: layout.zoom || 1.0,
      x: layout.center?.x || 0,
      y: layout.center?.y || 0,
    };

    // Return success with data
    return {
      success: true,
      data: {
        nodes,
        edges,
        viewport,
        metadata: parsedData.metadata || {},
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to import diagram: ${error.message}`
    };
  }
};
