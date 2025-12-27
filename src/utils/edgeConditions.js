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

  return {
    ...style,
    stroke,
  };
};
