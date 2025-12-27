/**
 * Export diagram data as JSON file
 * Follows the structure defined in architect.md Section 7.1
 */

import { createConditionalEdgeData, getConditionalEdgeLabel } from "./edgeConditions";
import { normalizeExampleCases } from "./exampleCases";

export const exportDiagram = (nodes, edges, viewport, diagramName = "diagram", exampleCases = []) => {
  // Get current timestamp
  const now = new Date().toISOString();

  // Find earliest and latest modification dates from nodes
  const nodeDates = nodes.map(n => n.data?.metadata?.dateAdded).filter(Boolean);
  const created = nodeDates.length > 0
    ? nodeDates.reduce((earliest, date) => date < earliest ? date : earliest, nodeDates[0])
    : now;

  const modifiedDates = nodes.map(n => n.data?.metadata?.dateModified).filter(Boolean);
  const modified = modifiedDates.length > 0
    ? modifiedDates.reduce((latest, date) => date > latest ? date : latest, modifiedDates[0])
    : now;

  // Build diagram export structure
  const diagramData = {
    version: "1.0",
    metadata: {
      name: diagramName,
      description: "",
      created,
      modified,
      authors: [],
    },
    nodes: nodes.map(node => ({
      id: node.id,
      name: node.data.label,
      type: node.type,
      icon: node.data.icon || null,
      position: node.position,
      shortDescription: node.data.shortDescription || "",
      detailedDescription: node.data.detailedDescription || "",
      metadata: {
        status: node.data.metadata?.status || "planned",
        owner: node.data.metadata?.owner || "",
        version: node.data.metadata?.version || "",
        tags: node.data.metadata?.tags || [],
        links: node.data.metadata?.links || [],
        dateAdded: node.data.metadata?.dateAdded || now,
        dateModified: node.data.metadata?.dateModified || now,
        author: node.data.metadata?.author || "",
        criticality: node.data.metadata?.criticality || "medium",
      },
    })),
    edges: edges.map(edge => {
      const edgeData = createConditionalEdgeData({
        ...edge.data,
        label: edge.data?.label || edge.label || "",
      });
      const label = getConditionalEdgeLabel({ ...edge, data: edgeData });

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label,
        animated: edge.animated || false,
        type: edge.type || "default",
        style: edge.style || {},
        data: edgeData,
        metadata: edge.metadata || {},
      };
    }),
    exampleCases: normalizeExampleCases(exampleCases),
    layout: {
      zoom: viewport?.zoom || 1.0,
      center: {
        x: viewport?.x || 0,
        y: viewport?.y || 0,
      },
    },
    canvasState: {
      background: "dots",
      snapToGrid: false,
      gridSize: 20,
    },
  };

  // Convert to JSON string with formatting
  const jsonString = JSON.stringify(diagramData, null, 2);

  // Create blob and download
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create temporary link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = `${diagramName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
