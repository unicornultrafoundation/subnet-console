import { create } from "zustand";

import { Node, NodeMetrics } from "@/types";

interface NodeStore {
  nodes: Node[];
  selectedNode: Node | null;
  metrics: Record<string, NodeMetrics[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  removeNode: (id: string) => void;
  selectNode: (node: Node | null) => void;
  setMetrics: (nodeId: string, metrics: NodeMetrics[]) => void;
  addMetric: (nodeId: string, metric: NodeMetrics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  nodes: [],
  selectedNode: null,
  metrics: {},
  isLoading: false,
  error: null,

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },

  addNode: (node: Node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (id: string, updates: Partial<Node>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node,
      ),
    }));
  },

  removeNode: (id: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
    }));
  },

  selectNode: (node: Node | null) => {
    set({ selectedNode: node });
  },

  setMetrics: (nodeId: string, metrics: NodeMetrics[]) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        [nodeId]: metrics,
      },
    }));
  },

  addMetric: (nodeId: string, metric: NodeMetrics) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        [nodeId]: [...(state.metrics[nodeId] || []), metric],
      },
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
