export const CONDITIONAL_EDGE_COLORS = {
  true: "#10b981",
  false: "#ef4444",
  default: "#9ca3af",
};

export const createConditionalEdgeData = (overrides = {}) => ({
  condition: "",
  label: "",
  priority: 1,
  conditionType: "",
  ...overrides,
});

export const applyConditionalEdgeStyle = (style = {}, conditionType) => {
  const stroke = CONDITIONAL_EDGE_COLORS[conditionType];
  if (!stroke) {
    return style;
  }

  const nextStyle = { ...style, stroke };
  if (conditionType === "default") {
    nextStyle.strokeDasharray = "6,4";
  } else if ("strokeDasharray" in nextStyle) {
    delete nextStyle.strokeDasharray;
  }

  return nextStyle;
};

export const getConditionalEdgeLabel = (edge) => {
  const data = createConditionalEdgeData(edge?.data);
  return data.label || data.condition || edge?.label || "";
};

export const applyConditionalEdgeHighlight = (style = {}, isHighlighted) => {
  if (!isHighlighted) {
    return style;
  }

  const strokeWidth = style.strokeWidth || 2;
  return {
    ...style,
    strokeWidth: Math.max(strokeWidth, 3),
  };
};

export const normalizeConditionalEdge = (edge) => {
  const data = createConditionalEdgeData({
    ...edge.data,
    label: edge.data?.label || edge.label || "",
  });
  const label = getConditionalEdgeLabel({ ...edge, data });
  const style = applyConditionalEdgeStyle(edge.style || {}, data.conditionType);

  return {
    ...edge,
    data,
    label,
    style,
  };
};
