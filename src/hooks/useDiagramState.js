import { useCallback, useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "reactflow";

const STORAGE_KEY = "diagram_current";
const AUTOSAVE_DELAY = 10000; // 10 seconds

export const useDiagramState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [lastSaved, setLastSaved] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
      } catch (e) {
        console.error("Failed to load diagram:", e);
      }
    }
  }, [setNodes, setEdges]);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = { nodes, edges, lastModified: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(Date.now());
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [nodes, edges]);

  const addNode = useCallback((position, type = "generic", icon = null) => {
    const newNode = {
      id: crypto.randomUUID(),
      type,
      position,
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        ...(icon && { icon }),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    deleteNode,
    setNodes,
    setEdges,
    lastSaved,
  };
};
