import { create } from "zustand";

import { Deployment, DeploymentLog } from "@/types";

interface DeploymentStore {
  deployments: Deployment[];
  selectedDeployment: Deployment | null;
  logs: Record<string, DeploymentLog[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setDeployments: (deployments: Deployment[]) => void;
  addDeployment: (deployment: Deployment) => void;
  updateDeployment: (id: string, updates: Partial<Deployment>) => void;
  removeDeployment: (id: string) => void;
  selectDeployment: (deployment: Deployment | null) => void;
  setLogs: (deploymentId: string, logs: DeploymentLog[]) => void;
  addLog: (deploymentId: string, log: DeploymentLog) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDeploymentStore = create<DeploymentStore>((set, get) => ({
  deployments: [],
  selectedDeployment: null,
  logs: {},
  isLoading: false,
  error: null,

  setDeployments: (deployments: Deployment[]) => {
    set({ deployments });
  },

  addDeployment: (deployment: Deployment) => {
    set((state) => ({
      deployments: [...state.deployments, deployment],
    }));
  },

  updateDeployment: (id: string, updates: Partial<Deployment>) => {
    set((state) => ({
      deployments: state.deployments.map((deployment) =>
        deployment.id === id ? { ...deployment, ...updates } : deployment,
      ),
    }));
  },

  removeDeployment: (id: string) => {
    set((state) => ({
      deployments: state.deployments.filter(
        (deployment) => deployment.id !== id,
      ),
      selectedDeployment:
        state.selectedDeployment?.id === id ? null : state.selectedDeployment,
    }));
  },

  selectDeployment: (deployment: Deployment | null) => {
    set({ selectedDeployment: deployment });
  },

  setLogs: (deploymentId: string, logs: DeploymentLog[]) => {
    set((state) => ({
      logs: {
        ...state.logs,
        [deploymentId]: logs,
      },
    }));
  },

  addLog: (deploymentId: string, log: DeploymentLog) => {
    set((state) => ({
      logs: {
        ...state.logs,
        [deploymentId]: [...(state.logs[deploymentId] || []), log],
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
