import { useCallback, useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { normalizeConditionalEdge } from "../utils/edgeConditions";
import { normalizeExampleCase, normalizeExampleCases } from "../utils/exampleCases";

const STORAGE_KEY = "diagram_current";
const AUTOSAVE_DELAY = 30000; // 30 seconds

export const useDiagramState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [exampleCases, setExampleCases] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges, exampleCases: savedCases } = JSON.parse(saved);
        const normalizedEdges = (savedEdges || []).map((edge) => normalizeConditionalEdge(edge));
        setNodes(savedNodes || []);
        setEdges(normalizedEdges);
        setExampleCases(normalizeExampleCases(savedCases));
        setIsDirty(false);
      } catch (e) {
        console.error("Failed to load diagram:", e);
      }
    }
  }, [setNodes, setEdges]);

  // Mark as dirty when nodes or edges change
  useEffect(() => {
    if (lastSaved !== null) {
      setIsDirty(true);
    }
  }, [nodes, edges, exampleCases, lastSaved]);

  const addNode = useCallback((position, type = "generic", icon = null) => {
    const now = new Date().toISOString();
    const newNode = {
      id: crypto.randomUUID(),
      type,
      position,
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        ...(icon && { icon }),
        shortDescription: "",
        detailedDescription: "",
        metadata: {
          dateAdded: now,
          dateModified: now,
          author: "",
          tags: [],
          links: [],
          status: "planned",
          version: "",
          owner: "",
          criticality: "medium",
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addExampleCase = useCallback((exampleCase) => {
    setExampleCases((cases) => [...cases, normalizeExampleCase(exampleCase)]);
  }, []);

  const updateExampleCase = useCallback((exampleCaseId, updates) => {
    setExampleCases((cases) =>
      cases.map((exampleCase) =>
        exampleCase.id === exampleCaseId
          ? normalizeExampleCase({
            ...exampleCase,
            ...updates,
            id: exampleCase.id,
          })
          : exampleCase
      )
    );
  }, []);

  const deleteExampleCase = useCallback((exampleCaseId) => {
    setExampleCases((cases) => cases.filter((exampleCase) => exampleCase.id !== exampleCaseId));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
              metadata: {
                ...node.data.metadata,
                ...(updates.metadata || {}),
                dateModified: new Date().toISOString(),
              },
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Manual save function that can include viewport
  const saveState = useCallback((viewport = null) => {
    const data = {
      nodes,
      edges,
      exampleCases,
      viewport,
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastSaved(Date.now());
    setIsDirty(false);
  }, [nodes, edges, exampleCases]);

  // Auto-save with debounce (called from parent with viewport)
  const triggerAutoSave = useCallback((viewport) => {
    saveState(viewport);
  }, [saveState]);

  return {
    nodes,
    edges,
    exampleCases,
    onNodesChange,
    onEdgesChange,
    addNode,
    deleteNode,
    updateNode,
    addExampleCase,
    updateExampleCase,
    deleteExampleCase,
    setNodes,
    setEdges,
    setExampleCases,
    lastSaved,
    isDirty,
    saveState,
    triggerAutoSave,
  };
};
