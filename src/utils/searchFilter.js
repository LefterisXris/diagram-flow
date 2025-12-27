/**
 * Search and Filter Utilities
 *
 * Provides functions to search and filter nodes based on various criteria.
 */

/**
 * Search nodes by query string
 * Searches across: node label, shortDescription, detailedDescription, tags, metadata
 *
 * @param {Array} nodes - Array of nodes to search
 * @param {string} query - Search query string
 * @returns {Set} Set of node IDs that match the search query
 */
export function searchNodes(nodes, query) {
  if (!query || query.trim() === '') {
    return new Set(nodes.map(n => n.id));
  }

  const lowerQuery = query.toLowerCase().trim();
  const matchingIds = new Set();

  nodes.forEach(node => {
    const data = node.data || {};
    const metadata = data.metadata || {};

    // Search in label
    if (data.label?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }

    // Search in short description
    if (data.shortDescription?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }

    // Search in detailed description
    if (data.detailedDescription?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }

    // Search in tags
    if (Array.isArray(metadata.tags)) {
      if (metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        matchingIds.add(node.id);
        return;
      }
    }

    // Search in metadata fields
    if (metadata.owner?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }

    if (metadata.status?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }

    if (metadata.version?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }

    // Search in node type
    if (node.type?.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(node.id);
      return;
    }
  });

  return matchingIds;
}

/**
 * Filter nodes by type, status, owner, and tags
 *
 * @param {Array} nodes - Array of nodes to filter
 * @param {Object} filters - Filter criteria
 * @param {Array} filters.types - Node types to include (empty = all)
 * @param {Array} filters.statuses - Statuses to include (empty = all)
 * @param {Array} filters.owners - Owners to include (empty = all)
 * @param {Array} filters.tags - Tags to include (empty = all)
 * @returns {Set} Set of node IDs that match the filters
 */
export function filterNodes(nodes, filters) {
  const { types = [], statuses = [], owners = [], tags = [] } = filters;

  // If all filters are empty, return all nodes
  const hasActiveFilters = types.length > 0 || statuses.length > 0 ||
                          owners.length > 0 || tags.length > 0;

  if (!hasActiveFilters) {
    return new Set(nodes.map(n => n.id));
  }

  const matchingIds = new Set();

  nodes.forEach(node => {
    const data = node.data || {};
    const metadata = data.metadata || {};
    let matches = true;

    // Filter by type
    if (types.length > 0) {
      if (!types.includes(node.type)) {
        matches = false;
      }
    }

    // Filter by status
    if (statuses.length > 0 && matches) {
      if (!statuses.includes(metadata.status)) {
        matches = false;
      }
    }

    // Filter by owner
    if (owners.length > 0 && matches) {
      if (!owners.includes(metadata.owner)) {
        matches = false;
      }
    }

    // Filter by tags (node must have at least one of the selected tags)
    if (tags.length > 0 && matches) {
      const nodeTags = metadata.tags || [];
      const hasMatchingTag = tags.some(tag => nodeTags.includes(tag));
      if (!hasMatchingTag) {
        matches = false;
      }
    }

    if (matches) {
      matchingIds.add(node.id);
    }
  });

  return matchingIds;
}

/**
 * Combine search and filter results
 * Returns nodes that match BOTH search query AND filters
 *
 * @param {Array} nodes - Array of nodes
 * @param {string} searchQuery - Search query string
 * @param {Object} filters - Filter criteria
 * @returns {Object} Object with visibleNodeIds Set and count
 */
export function getVisibleNodes(nodes, searchQuery, filters) {
  const searchMatches = searchNodes(nodes, searchQuery);
  const filterMatches = filterNodes(nodes, filters);

  // Intersection: nodes must match both search AND filters
  const visibleNodeIds = new Set(
    [...searchMatches].filter(id => filterMatches.has(id))
  );

  return {
    visibleNodeIds,
    totalCount: nodes.length,
    visibleCount: visibleNodeIds.size,
  };
}

/**
 * Extract unique values from nodes for filter options
 *
 * @param {Array} nodes - Array of nodes
 * @returns {Object} Object with arrays of unique types, statuses, owners, tags
 */
export function extractFilterOptions(nodes) {
  const types = new Set();
  const statuses = new Set();
  const owners = new Set();
  const tags = new Set();

  nodes.forEach(node => {
    const data = node.data || {};
    const metadata = data.metadata || {};

    // Add type
    if (node.type) {
      types.add(node.type);
    }

    // Add status
    if (metadata.status) {
      statuses.add(metadata.status);
    }

    // Add owner
    if (metadata.owner && metadata.owner.trim() !== '') {
      owners.add(metadata.owner);
    }

    // Add tags
    if (Array.isArray(metadata.tags)) {
      metadata.tags.forEach(tag => tags.add(tag));
    }
  });

  return {
    types: Array.from(types).sort(),
    statuses: Array.from(statuses).sort(),
    owners: Array.from(owners).sort(),
    tags: Array.from(tags).sort(),
  };
}
