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

// Mock nodes for testing
const mockNodes: Node[] = [
  {
    id: "node-1",
    providerId: "provider-1",
    name: "Production Node 1",
    description: "High-performance compute node",
    status: "active",
    clusterId: "cluster-1",
    clusterName: "Production Cluster",
    role: "worker",
    nodeName: "worker-1",
    kubernetesVersion: "v1.28.0",
    containerRuntime: "containerd://1.7.0",
    osImage: "Ubuntu 22.04 LTS",
    kernelVersion: "5.15.0",
    kubeletVersion: "v1.28.0",
    specs: {
      cpu: 32,
      memory: 128,
      storage: 2000,
      bandwidth: 10000,
      pods: 110,
    },
    usage: {
      cpu: 45,
      memory: 60,
      storage: 30,
      pods: 25,
    },
    pods: {
      running: 20,
      pending: 2,
      failed: 0,
      succeeded: 5,
      total: 27,
      capacity: 110,
    },
    location: {
      country: "USA",
      region: "North America",
      city: "San Francisco",
      zone: "us-west1-a",
    },
    uptime: 99.5,
    reputation: 98,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "node-2",
    providerId: "provider-1",
    name: "Production Node 2",
    description: "High-performance compute node with GPU",
    status: "active",
    clusterId: "cluster-1",
    clusterName: "Production Cluster",
    role: "worker",
    nodeName: "worker-2",
    kubernetesVersion: "v1.28.0",
    containerRuntime: "containerd://1.7.0",
    osImage: "Ubuntu 22.04 LTS",
    kernelVersion: "5.15.0",
    kubeletVersion: "v1.28.0",
    specs: {
      cpu: 64,
      memory: 256,
      storage: 5000,
      bandwidth: 20000,
      pods: 110,
    },
    usage: {
      cpu: 30,
      memory: 45,
      storage: 20,
      pods: 15,
    },
    pods: {
      running: 12,
      pending: 1,
      failed: 0,
      succeeded: 3,
      total: 16,
      capacity: 110,
    },
    location: {
      country: "USA",
      region: "North America",
      city: "San Francisco",
      zone: "us-west1-b",
    },
    uptime: 99.2,
    reputation: 97,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
];

export const useNodeStore = create<NodeStore>((set, get) => ({
  nodes: mockNodes,
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
