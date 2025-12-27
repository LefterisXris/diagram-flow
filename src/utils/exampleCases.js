export const normalizeExampleCase = (exampleCase = {}) => ({
  id: exampleCase.id || crypto.randomUUID(),
  name: exampleCase.name || "",
  description: exampleCase.description || "",
  input: {
    nodeId: exampleCase.input?.nodeId || "",
    data: exampleCase.input?.data || {},
  },
  expectedPath: Array.isArray(exampleCase.expectedPath)
    ? exampleCase.expectedPath
    : [],
  highlights: Array.isArray(exampleCase.highlights)
    ? exampleCase.highlights
    : [],
});

export const normalizeExampleCases = (exampleCases = []) =>
  (Array.isArray(exampleCases) ? exampleCases : []).map(normalizeExampleCase);
