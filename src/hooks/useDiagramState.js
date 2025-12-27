import { useCallback, useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { applyConditionalEdgeStyle, createConditionalEdgeData } from "../utils/edgeConditions";

const STORAGE_KEY = "diagram_current";
const AUTOSAVE_DELAY = 30000; // 30 seconds

export const useDiagramState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        const normalizedEdges = (savedEdges || []).map((edge) => {
          const data = createConditionalEdgeData({
            ...edge.data,
            label: edge.data?.label || edge.label || "",
          });
          const style = applyConditionalEdgeStyle(edge.style || {}, data.conditionType);

          return {
            ...edge,
            data,
            style,
          };
        });
        setNodes(savedNodes || []);
        setEdges(normalizedEdges);
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
  }, [nodes, edges, lastSaved]);

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
      viewport,
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastSaved(Date.now());
    setIsDirty(false);
  }, [nodes, edges]);

  // Auto-save with debounce (called from parent with viewport)
  const triggerAutoSave = useCallback((viewport) => {
    saveState(viewport);
  }, [saveState]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    deleteNode,
    updateNode,
    setNodes,
    setEdges,
    lastSaved,
    isDirty,
    saveState,
    triggerAutoSave,
  };
};
