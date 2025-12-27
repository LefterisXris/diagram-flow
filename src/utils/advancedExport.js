/**
 * Advanced Export Utilities
 *
 * Provides export functionality for PNG, SVG, and standalone HTML formats.
 */

import { toPng, toSvg } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from 'reactflow';

/**
 * Export diagram as PNG image
 *
 * @param {HTMLElement} element - The React Flow wrapper element to capture
 * @param {string} fileName - Name for the downloaded file
 * @param {Object} options - Export options
 * @param {number} options.width - Image width (default: current width)
 * @param {number} options.height - Image height (default: current height)
 * @param {string} options.backgroundColor - Background color (default: white)
 * @returns {Promise<void>}
 */
export async function exportToPNG(element, fileName = 'diagram.png', options = {}) {
  const {
    width,
    height,
    backgroundColor = '#ffffff',
  } = options;

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor,
      width,
      height,
      pixelRatio: 2, // Higher quality
      filter: (node) => {
        // Exclude controls and other UI elements
        if (node.classList) {
          return !node.classList.contains('react-flow__controls') &&
                 !node.classList.contains('react-flow__minimap') &&
                 !node.classList.contains('react-flow__attribution');
        }
        return true;
      },
    });

    // Create download link
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw error;
  }
}

/**
 * Export diagram as SVG image
 *
 * @param {HTMLElement} element - The React Flow wrapper element to capture
 * @param {string} fileName - Name for the downloaded file
 * @param {Object} options - Export options
 * @returns {Promise<void>}
 */
export async function exportToSVG(element, fileName = 'diagram.svg', options = {}) {
  const {
    backgroundColor = '#ffffff',
  } = options;

  try {
    const dataUrl = await toSvg(element, {
      cacheBust: true,
      backgroundColor,
      filter: (node) => {
        // Exclude controls and other UI elements
        if (node.classList) {
          return !node.classList.contains('react-flow__controls') &&
                 !node.classList.contains('react-flow__minimap') &&
                 !node.classList.contains('react-flow__attribution');
        }
        return true;
      },
    });

    // Create download link
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw error;
  }
}

/**
 * Export diagram as standalone HTML file
 *
 * Creates a self-contained HTML file that can be opened in any browser
 * without requiring a server. Includes the diagram data and a simple viewer.
 *
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @param {Object} viewport - Current viewport state
 * @param {string} fileName - Name for the downloaded file
 * @param {Object} metadata - Optional metadata (title, description, etc.)
 * @returns {void}
 */
export function exportToHTML(nodes, edges, viewport, fileName = 'diagram.html', metadata = {}) {
  const {
    title = 'DiagramFlow Export',
    description = '',
    author = '',
    createdAt = new Date().toISOString(),
  } = metadata;

  // Sanitize diagram data for embedding
  const diagramData = {
    nodes,
    edges,
    viewport,
    metadata: {
      title,
      description,
      author,
      createdAt,
      exportedAt: new Date().toISOString(),
    },
  };

  // Create the standalone HTML content
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${escapeHtml(author)}">
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.jsdelivr.net/npm/reactflow@11/dist/umd/index.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      background: #f5f5f5;
    }

    #header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 16px 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    #header h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    #header p {
      font-size: 14px;
      color: #666;
    }

    #diagram-container {
      width: 100vw;
      height: calc(100vh - 80px);
    }

    .react-flow__node {
      font-size: 12px;
      padding: 10px;
      border-radius: 8px;
      border: 2px solid;
      background: white;
      min-width: 120px;
      text-align: center;
    }

    .react-flow__node-generic { border-color: #3b82f6; }
    .react-flow__node-service { border-color: #3b82f6; }
    .react-flow__node-database { border-color: #10b981; }
    .react-flow__node-client { border-color: #a855f7; }
    .react-flow__node-decision { border-color: #f97316; }

    .react-flow__edge-path {
      stroke: #b1b1b7;
      stroke-width: 2;
    }

    .react-flow__edge.selected .react-flow__edge-path {
      stroke: #3b82f6;
    }

    .react-flow__handle {
      width: 8px;
      height: 8px;
      background: #3b82f6;
    }

    #info {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-size: 12px;
      color: #666;
      max-width: 300px;
    }

    #info strong {
      color: #1a1a1a;
    }
  </style>
</head>
<body>
  <div id="header">
    <h1>${escapeHtml(title)}</h1>
    ${description ? `<p>${escapeHtml(description)}</p>` : ''}
  </div>
  <div id="diagram-container"></div>
  <div id="info">
    <div><strong>Nodes:</strong> ${nodes.length}</div>
    <div><strong>Edges:</strong> ${edges.length}</div>
    <div><strong>Exported:</strong> ${new Date().toLocaleString()}</div>
    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0; font-size: 11px;">
      Created with <strong>DiagramFlow</strong>
    </div>
  </div>

  <script>
    // Diagram data embedded
    const diagramData = ${JSON.stringify(diagramData, null, 2)};

    // Initialize React Flow
    const { ReactFlow, Background, Controls } = ReactFlow;

    function DiagramViewer() {
      return React.createElement(ReactFlow, {
        nodes: diagramData.nodes,
        edges: diagramData.edges,
        defaultViewport: diagramData.viewport || { x: 0, y: 0, zoom: 1 },
        fitView: !diagramData.viewport,
        nodesDraggable: false,
        nodesConnectable: false,
        elementsSelectable: true,
        panOnScroll: true,
        zoomOnScroll: true,
        zoomOnPinch: true,
        panOnDrag: true,
        minZoom: 0.1,
        maxZoom: 4,
      }, [
        React.createElement(Background, { gap: 16, size: 1, color: '#e0e0e0' }),
        React.createElement(Controls, { showInteractive: false })
      ]);
    }

    // Mount the viewer
    const container = document.getElementById('diagram-container');
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(DiagramViewer));
  </script>
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper function to escape HTML special characters
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get optimal image dimensions based on nodes
 */
export function getImageDimensions(nodes, padding = 50) {
  if (!nodes || nodes.length === 0) {
    return { width: 800, height: 600 };
  }

  const bounds = getNodesBounds(nodes);
  return {
    width: Math.ceil(bounds.width + padding * 2),
    height: Math.ceil(bounds.height + padding * 2),
  };
}
