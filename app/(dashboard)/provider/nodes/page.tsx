"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
  Server,
  Plus,
  ArrowLeft,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";

import { Node } from "@/types";
import { useNodeStore } from "@/store/node-store";
import {
  subnetAgentClient,
  InstallK3sRequest,
} from "@/lib/api/subnet-agent";

// Components
import {
  ApiHealthChecking,
  ApiKeyRequired,
  ApiConnectionFailed,
} from "./components/ApiHealthCheck";
import { StatsOverview } from "./components/StatsOverview";
import { NodeFilters } from "./components/NodeFilters";
import { NodeList } from "./components/NodeList";
import { DeleteNodeModal } from "./components/DeleteNodeModal";
import { AddNodeModal } from "./components/AddNodeModal";
import type { NewNodeForm, InstallationStatus } from "./components/AddNodeModal";
import { EditNodeModal } from "./components/EditNodeModal";
import type { EditNodeForm } from "./components/EditNodeModal";
import { NodeDetailsModal } from "./components/NodeDetailsModal";

// Constants
import { cloudZones } from "./constants/cloudZones";

// Hooks
import { useApiHealthCheck } from "./hooks/useApiHealthCheck";
import { useWizardSteps } from "./hooks/useWizardSteps";

export default function NodesManagementPage() {
  const router = useRouter();
  const { nodes, setNodes, addNode, updateNode, removeNode, metrics } =
    useNodeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form state for adding new node with k3s installation
  const [newNodeForm, setNewNodeForm] = useState({
    // Target type
    target: "host" as "host" | "remote",

    // Server connection info
    serverIP: "",
    sshPort: "22",
    sshUser: "root",
    sshKey: "",
    sshPassword: "",
    authMethod: "key" as "key" | "password",

    // Node basic info
    name: "",
    description: "",
    clusterId: "",
    clusterName: "",
    roles: ["server", "agent"] as Array<"server" | "agent">,

    // k3s installation config
    k3sVersion: "latest",
    installMode: "agent" as "server" | "agent",
    serverURL: "", // For agent nodes
    token: "", // For agent nodes
    flannelBackend: "vxlan" as "vxlan" | "host-gw" | "wireguard",
    disableComponents: [] as string[],

    // Location
    location: {
      country: "",
      region: "",
      city: "",
      zone: "",
    },

    // Optional: Pre-configured specs (will be auto-detected if empty)
    specs: {
      cpu: "",
      memory: "",
      storage: "",
      bandwidth: "",
      pods: "110",
    },

    labels: [] as Array<{ key: string; value: string }>,
    taints: [] as Array<{
      key: string;
      value: string;
      effect: "NoSchedule" | "PreferNoSchedule" | "NoExecute";
    }>,
  });

  const [installationStatus, setInstallationStatus] = useState<{
    step: string;
    status:
      | "idle"
      | "connecting"
      | "installing"
      | "configuring"
      | "verifying"
      | "success"
      | "error";
    message: string;
    logs: string[];
    jobId?: string;
  }>({
    step: "",
    status: "idle",
    message: "",
    logs: [],
    jobId: undefined,
  });

  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Use custom hooks
  const {
    apiHealthStatus,
    apiHealthError,
    apiKey,
    apiKeyInput,
    setApiKeyInput,
    setApiHealthStatus,
    setApiHealthError,
    handleSaveApiKey,
    checkApiKeyValidity,
    handleApiError,
  } = useApiHealthCheck();

  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    resetStep,
  } = useWizardSteps(newNodeForm);

  const onAddOpen = () => {
    resetStep(); // Reset to first step
    // Auto-set cluster name, ID, and location from existing nodes if available
    if (nodes.length > 0) {
      if (nodes[0].clusterName) {
        updateNewNodeForm("clusterName", nodes[0].clusterName);
      }
      if (nodes[0].clusterId) {
        updateNewNodeForm("clusterId", nodes[0].clusterId);
      }
      if (nodes[0].location) {
        if (nodes[0].location.country) {
          updateNewNodeForm("location.country", nodes[0].location.country);
        }
        if (nodes[0].location.city) {
          updateNewNodeForm("location.city", nodes[0].location.city);
        }
        if (nodes[0].location.zone) {
          updateNewNodeForm("location.zone", nodes[0].location.zone);
        }
      }
    }
    setIsAddOpen(true);
  };
  const onAddClose = () => {
    // Clear polling interval if exists
    if (pollingInterval) {
      clearTimeout(pollingInterval);
      setPollingInterval(null);
    }
    resetStep(); // Reset step
    setIsAddOpen(false);
  };
  const onEditOpen = () => setIsEditOpen(true);
  const onEditClose = () => setIsEditOpen(false);
  const onDetailOpen = () => setIsDetailOpen(true);
  const onDetailClose = () => setIsDetailOpen(false);
  const onDeleteOpen = () => setIsDeleteOpen(true);
  const onDeleteClose = () => setIsDeleteOpen(false);

  // Mock data initialization
  useEffect(() => {
    if (nodes.length === 0) {
      const mockNodes: Node[] = [
        {
          id: "node-1",
          providerId: "provider-1",
          name: "worker-node-01",
          nodeName: "ip-10-0-1-101.us-west-2.compute.internal",
          description:
            "Worker node in production cluster - Primary compute node",
          clusterId: "cluster-prod-01",
          clusterName: "Production Cluster",
          role: "worker",
          status: "active",
          kubernetesVersion: "v1.28.3",
          containerRuntime: "containerd://1.7.8",
          osImage: "Ubuntu 22.04.3 LTS",
          kernelVersion: "5.15.0-91-generic",
          kubeletVersion: "v1.28.3",
          labels: {
            "kubernetes.io/arch": "amd64",
            "kubernetes.io/os": "linux",
            "node-role.kubernetes.io/worker": "",
            "topology.kubernetes.io/zone": "us-west-2a",
          },
          taints: [],
          specs: {
            cpu: 32,
            memory: 128,
            storage: 2000,
            bandwidth: 1000,
            pods: 110,
          },
          usage: {
            cpu: 65,
            memory: 72,
            storage: 45,
            pods: 82,
          },
          pods: {
            running: 75,
            pending: 2,
            failed: 0,
            succeeded: 5,
            total: 82,
            capacity: 110,
          },
          location: {
            country: "USA",
            region: "North America",
            city: "San Francisco",
            zone: "us-west-2a",
          },
          uptime: 99.8,
          reputation: 4.9,
          createdAt: "2024-01-10T08:00:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "node-2",
          providerId: "provider-1",
          name: "worker-node-02",
          nodeName: "ip-10-0-1-102.us-west-2.compute.internal",
          description: "Worker node in production cluster - General workloads",
          clusterId: "cluster-prod-01",
          clusterName: "Production Cluster",
          role: "worker",
          status: "active",
          kubernetesVersion: "v1.28.3",
          containerRuntime: "containerd://1.7.8",
          osImage: "Ubuntu 22.04.3 LTS",
          kernelVersion: "5.15.0-91-generic",
          kubeletVersion: "v1.28.3",
          labels: {
            "kubernetes.io/arch": "amd64",
            "kubernetes.io/os": "linux",
            "node-role.kubernetes.io/worker": "",
            "topology.kubernetes.io/zone": "us-west-2b",
          },
          taints: [],
          specs: {
            cpu: 16,
            memory: 64,
            storage: 1000,
            bandwidth: 500,
            pods: 110,
          },
          usage: {
            cpu: 45,
            memory: 58,
            storage: 35,
            pods: 56,
          },
          pods: {
            running: 52,
            pending: 1,
            failed: 0,
            succeeded: 3,
            total: 56,
            capacity: 110,
          },
          location: {
            country: "USA",
            region: "North America",
            city: "New York",
            zone: "us-west-2b",
          },
          uptime: 99.5,
          reputation: 4.7,
          createdAt: "2024-01-12T09:00:00Z",
          updatedAt: "2024-01-15T11:20:00Z",
        },
        {
          id: "node-3",
          providerId: "provider-1",
          name: "gpu-node-01",
          nodeName: "ip-10-0-2-101.eu-central-1.compute.internal",
          description: "GPU-accelerated worker node for AI/ML workloads",
          clusterId: "cluster-ml-01",
          clusterName: "ML Cluster",
          role: "worker",
          status: "maintenance",
          kubernetesVersion: "v1.28.2",
          containerRuntime: "containerd://1.7.7",
          osImage: "Ubuntu 22.04.2 LTS",
          kernelVersion: "5.15.0-89-generic",
          kubeletVersion: "v1.28.2",
          labels: {
            "kubernetes.io/arch": "amd64",
            "kubernetes.io/os": "linux",
            "node-role.kubernetes.io/worker": "",
            accelerator: "nvidia-gpu",
            "topology.kubernetes.io/zone": "eu-central-1a",
          },
          taints: [
            {
              key: "nvidia.com/gpu",
              value: "present",
              effect: "NoSchedule",
            },
          ],
          specs: {
            cpu: 64,
            memory: 256,
            storage: 4000,
            bandwidth: 2000,
            pods: 110,
          },
          usage: {
            cpu: 0,
            memory: 0,
            storage: 0,
            pods: 0,
          },
          pods: {
            running: 0,
            pending: 0,
            failed: 0,
            succeeded: 0,
            total: 0,
            capacity: 110,
          },
          location: {
            country: "Germany",
            region: "Europe",
            city: "Frankfurt",
            zone: "eu-central-1a",
          },
          uptime: 98.9,
          reputation: 4.8,
          createdAt: "2024-01-08T10:00:00Z",
          updatedAt: "2024-01-15T08:45:00Z",
        },
        {
          id: "node-4",
          providerId: "provider-1",
          name: "storage-node-01",
          nodeName: "ip-10-0-3-101.ap-southeast-1.compute.internal",
          description: "Storage-optimized node for data workloads",
          clusterId: "cluster-storage-01",
          clusterName: "Storage Cluster",
          role: "worker",
          status: "inactive",
          kubernetesVersion: "v1.28.1",
          containerRuntime: "containerd://1.7.6",
          osImage: "Ubuntu 22.04.1 LTS",
          kernelVersion: "5.15.0-87-generic",
          kubeletVersion: "v1.28.1",
          labels: {
            "kubernetes.io/arch": "amd64",
            "kubernetes.io/os": "linux",
            "node-role.kubernetes.io/worker": "",
            storage: "high-capacity",
            "topology.kubernetes.io/zone": "ap-southeast-1a",
          },
          taints: [],
          specs: {
            cpu: 8,
            memory: 32,
            storage: 10000,
            bandwidth: 250,
            pods: 110,
          },
          usage: {
            cpu: 0,
            memory: 0,
            storage: 0,
            pods: 0,
          },
          pods: {
            running: 0,
            pending: 0,
            failed: 0,
            succeeded: 0,
            total: 0,
            capacity: 110,
          },
          location: {
            country: "Singapore",
            region: "Asia Pacific",
            city: "Singapore",
            zone: "ap-southeast-1a",
          },
          uptime: 99.2,
          reputation: 4.6,
          createdAt: "2024-01-05T07:00:00Z",
          updatedAt: "2024-01-14T16:30:00Z",
        },
      ];

      setNodes(mockNodes);
    }
  }, [nodes.length, setNodes]);

  // Filter nodes
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || node.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: nodes.length,
    active: nodes.filter((n) => n.status === "active").length,
    maintenance: nodes.filter((n) => n.status === "maintenance").length,
    inactive: nodes.filter((n) => n.status === "inactive").length,
    offline: nodes.filter((n) => n.status === "offline").length,
    averageUptime:
      nodes.reduce((sum, n) => sum + n.uptime, 0) / nodes.length || 0,
    totalCpu: nodes.reduce((sum, n) => sum + n.specs.cpu, 0),
    totalMemory: nodes.reduce((sum, n) => sum + n.specs.memory, 0),
    totalStorage: nodes.reduce((sum, n) => sum + n.specs.storage, 0),
    totalPods: nodes.reduce((sum, n) => sum + (n.pods?.total || 0), 0),
    totalPodsCapacity: nodes.reduce((sum, n) => sum + (n.specs.pods || 0), 0),
    clusters: new Set(nodes.map((n) => n.clusterId).filter(Boolean)).size,
  };

  // Handlers
  const handleAddNode = () => {
    // Reset form
    setNewNodeForm({
      target: "host",
      serverIP: "",
      sshPort: "22",
      sshUser: "root",
      sshKey: "",
      sshPassword: "",
      authMethod: "key",
      name: "",
      description: "",
      clusterId: "",
      clusterName: "",
      roles: ["server", "agent"],
      k3sVersion: "latest",
      installMode: "agent",
      serverURL: "",
      token: "",
      flannelBackend: "vxlan",
      disableComponents: [],
      location: {
        country: "",
        region: "",
        city: "",
        zone: "",
      },
      specs: {
        cpu: "",
        memory: "",
        storage: "",
        bandwidth: "",
        pods: "110",
      },
      labels: [],
      taints: [],
    });
    setInstallationStatus({
      step: "",
      status: "idle",
      message: "",
      logs: [],
    });
    onAddOpen();
  };

  const handleTestConnection = async () => {
    setInstallationStatus({
      step: "Testing connection",
      status: "connecting",
      message: "Connecting to server...",
      logs: ["Testing SSH connection to " + newNodeForm.serverIP],
    });

    // Simulate connection test
    setTimeout(() => {
      setInstallationStatus((prev) => ({
        ...prev,
        status: "success",
        message: "Connection successful!",
        logs: [
          ...prev.logs,
          "✓ SSH connection established",
          "✓ Server reachable",
          "✓ Ready for k3s installation",
        ],
      }));
    }, 2000);
  };

  // Poll job status
  const pollJobStatus = async (jobId: string) => {
    try {
      const status = await subnetAgentClient.getJobStatus(jobId);
      
      // Update installation status based on job status
      const currentStep = status.steps.find(
        (s) => s.status === "running" || s.status === "pending",
      ) || status.steps[status.steps.length - 1];

      const allLogs = status.steps.flatMap((step) => {
        if (step.output) {
          return [`[${step.name}] ${step.output}`];
        }
        return [];
      });

      setInstallationStatus((prev) => ({
        step: currentStep?.name || status.message,
        status:
          status.status === "completed"
            ? "success"
            : status.status === "failed"
              ? "error"
              : status.status === "running"
                ? "installing"
                : "connecting",
        message: status.message,
        logs: allLogs.length > 0 ? allLogs : prev.logs,
        jobId: status.job_id,
      }));

      // Continue polling if job is still running
      if (status.status === "pending" || status.status === "running") {
        // Clear previous interval
        if (pollingInterval) {
          clearTimeout(pollingInterval);
        }
        const interval = setTimeout(() => pollJobStatus(jobId), 2000);
        setPollingInterval(interval);
      } else if (status.status === "completed") {
        // Clear polling when completed
        if (pollingInterval) {
          clearTimeout(pollingInterval);
          setPollingInterval(null);
        }
        // Job completed successfully - fetch nodes and add to list
        try {
          // Check API key validity before fetching nodes
          const isApiKeyValid = await checkApiKeyValidity();
          if (!isApiKeyValid) {
            setInstallationStatus((prev) => ({
              ...prev,
              status: "error",
              message: "API key is invalid. Please update your API key.",
            }));
            return;
          }

          const nodesResponse = await subnetAgentClient.getNodes({
            target: newNodeForm.target === "host" ? "local" : "remote",
            ...(newNodeForm.target === "remote"
              ? {
                  server_ip: newNodeForm.serverIP,
                  ssh_user: newNodeForm.sshUser,
                  ssh_key: newNodeForm.sshKey,
                  ssh_password: newNodeForm.sshPassword,
                  auth_method: newNodeForm.authMethod,
                }
              : {}),
          });

          // Get cluster name and ID - use from existing nodes if available
          const clusterNameForNode =
            nodes.length > 0
              ? nodes[0].clusterName || newNodeForm.clusterName
              : newNodeForm.clusterName;
          const clusterIdForNode =
            nodes.length > 0
              ? nodes[0].clusterId || newNodeForm.clusterId
              : newNodeForm.clusterId;
          
          // Get location from existing nodes if available
          const locationForNode =
            nodes.length > 0 && nodes[0].location
              ? {
                  country: nodes[0].location.country || newNodeForm.location.country,
                  region: nodes[0].location.region || newNodeForm.location.region,
                  city: nodes[0].location.city || newNodeForm.location.city,
                  zone: nodes[0].location.zone || newNodeForm.location.zone,
                }
              : newNodeForm.location;

          // Convert API nodes to our Node format and add them
          nodesResponse.nodes.forEach((apiNode) => {
            const newNode: Node = {
              id: `node-${Date.now()}-${apiNode.name}`,
              providerId: "provider-1",
              name: newNodeForm.name || apiNode.name,
              nodeName: apiNode.name,
              description:
                newNodeForm.description ||
                `k3s ${apiNode.roles.join(",")} node`,
              clusterId: clusterIdForNode || `cluster-${Date.now()}`,
              clusterName: clusterNameForNode,
              role: apiNode.roles.includes("control-plane") || apiNode.roles.includes("master")
                ? "master"
                : "worker",
              status: apiNode.status === "Ready" ? "active" : "inactive",
              kubernetesVersion: apiNode.version,
              containerRuntime: apiNode.container_runtime,
              osImage: apiNode.os_image,
              kernelVersion: apiNode.kernel_version,
              kubeletVersion: apiNode.version,
              labels: apiNode.labels,
              taints: [],
              specs: {
                cpu: 0, // Will be auto-detected
                memory: 0,
                storage: 0,
                bandwidth: 0,
                pods: 110,
              },
              usage: {
                cpu: 0,
                memory: 0,
                storage: 0,
                pods: 0,
              },
              pods: {
                running: 0,
                pending: 0,
                failed: 0,
                succeeded: 0,
                total: 0,
                capacity: 110,
              },
              location: locationForNode,
              uptime: 100,
              reputation: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            addNode(newNode);
          });

          setTimeout(() => {
            onAddClose();
            setInstallationStatus({
              step: "",
              status: "idle",
              message: "",
              logs: [],
              jobId: undefined,
            });
          }, 2000);
        } catch (error) {
          console.error("Failed to fetch nodes after installation:", error);
          // Check if it's an auth error
          if (handleApiError(error)) {
            setInstallationStatus((prev) => ({
              ...prev,
              status: "error",
              message: "API key is invalid. Please update your API key.",
            }));
            return;
          }
          setInstallationStatus((prev) => ({
            ...prev,
            status: "error",
            message: "Installation completed but failed to fetch node info",
          }));
        }
      } else if (status.status === "failed") {
        // Clear polling when failed
        if (pollingInterval) {
          clearTimeout(pollingInterval);
          setPollingInterval(null);
        }
        setInstallationStatus((prev) => ({
          ...prev,
          status: "error",
          message: "Installation failed",
        }));
      }
    } catch (error) {
      console.error("Failed to poll job status:", error);
      // Check if it's an auth error
      if (handleApiError(error)) {
        return; // Auth error handled, stop polling
      }
      setInstallationStatus((prev) => ({
        ...prev,
        status: "error",
        message: `Failed to check job status: ${error instanceof Error ? error.message : "Unknown error"}`,
      }));
    }
  };

  const handleInstallK3s = async () => {
    // Validation
    if (!newNodeForm.name) {
      alert("Please fill in required fields: Node Name");

      return;
    }

    // Only require cluster name if no existing nodes
    if (nodes.length === 0 && !newNodeForm.clusterName) {
      alert("Please fill in required fields: Cluster Name");

      return;
    }

    // Only require server connection info for remote targets
    if (newNodeForm.target === "remote") {
      if (!newNodeForm.serverIP) {
        alert("Please fill in required fields: Server IP");

        return;
      }

      if (newNodeForm.authMethod === "key" && !newNodeForm.sshKey) {
        alert("Please provide SSH key for authentication");

        return;
      }

      if (newNodeForm.authMethod === "password" && !newNodeForm.sshPassword) {
        alert("Please provide SSH password for authentication");

        return;
      }
    }


    try {
      setInstallationStatus({
        step: "Creating installation job",
        status: "connecting",
        message: "Submitting installation request...",
        logs: [],
        jobId: undefined,
      });

      // Get cluster name - use from existing nodes if available
      const clusterName =
        nodes.length > 0
          ? nodes[0].clusterName || newNodeForm.clusterName
          : newNodeForm.clusterName;

      // Prepare request
      const request: InstallK3sRequest = {
        target: newNodeForm.target === "host" ? "local" : "remote",
        node_name: newNodeForm.name,
        cluster_name: clusterName,
        install_mode: newNodeForm.installMode,
        k3s_version: newNodeForm.k3sVersion === "latest" ? undefined : newNodeForm.k3sVersion,
        flannel_backend: newNodeForm.flannelBackend,
        ...(newNodeForm.target === "remote"
          ? {
              server_ip: newNodeForm.serverIP,
              ssh_port: parseInt(newNodeForm.sshPort) || 22,
              ssh_user: newNodeForm.sshUser,
              ...(newNodeForm.authMethod === "key"
                ? { ssh_key: newNodeForm.sshKey, auth_method: "key" }
                : {
                    ssh_password: newNodeForm.sshPassword,
                    auth_method: "password",
                  }),
            }
          : {}),
        // Server URL and token will be automatically handled by Subnet Agent
      };

      // Call API
      const response = await subnetAgentClient.installK3s(request);

      setInstallationStatus({
        step: "Job created",
        status: "connecting",
        message: response.message,
        logs: [response.message],
        jobId: response.job_id,
      });

      // Start polling
      pollJobStatus(response.job_id);
    } catch (error) {
      console.error("Failed to install k3s:", error);
      // Check if it's an auth error
      if (handleApiError(error)) {
        setInstallationStatus({
          step: "Error",
          status: "error",
          message: "API key is invalid or expired. Please update your API key.",
          logs: [
            `Error: ${error instanceof Error ? error.message : "API key is invalid or expired"}`,
          ],
          jobId: undefined,
        });
        return;
      }
      setInstallationStatus({
        step: "Error",
        status: "error",
        message: `Failed to start installation: ${error instanceof Error ? error.message : "Unknown error"}`,
        logs: [
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        jobId: undefined,
      });
    }
  };

  const updateNewNodeForm = (field: string, value: any) => {
    setNewNodeForm((prev) => {
      const keys = field.split(".");
      const newForm = { ...prev };
      let current: any = newForm;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return newForm;
    });
  };

  const addLabel = () => {
    setNewNodeForm((prev) => ({
      ...prev,
      labels: [...prev.labels, { key: "", value: "" }],
    }));
  };

  const removeLabel = (index: number) => {
    setNewNodeForm((prev) => ({
      ...prev,
      labels: prev.labels.filter((_, i) => i !== index),
    }));
  };

  const updateLabel = (index: number, key: string, value: string) => {
    setNewNodeForm((prev) => ({
      ...prev,
      labels: prev.labels.map((label, i) =>
        i === index ? { ...label, [key]: value } : label,
      ),
    }));
  };

  const addTaint = () => {
    setNewNodeForm((prev) => ({
      ...prev,
      taints: [...prev.taints, { key: "", value: "", effect: "NoSchedule" }],
    }));
  };

  const removeTaint = (index: number) => {
    setNewNodeForm((prev) => ({
      ...prev,
      taints: prev.taints.filter((_, i) => i !== index),
    }));
  };

  const updateTaint = (
    index: number,
    key: string,
    value: string | "NoSchedule" | "PreferNoSchedule" | "NoExecute",
  ) => {
    setNewNodeForm((prev) => ({
      ...prev,
      taints: prev.taints.map((taint, i) =>
        i === index ? { ...taint, [key]: value } : taint,
      ),
    }));
  };

  // Form state for editing node
  const [editNodeForm, setEditNodeForm] = useState({
    name: "",
    description: "",
    clusterId: "",
    clusterName: "",
    roles: ["server", "agent"] as Array<"server" | "agent">,
    status: "active" as Node["status"],
    location: {
      country: "",
      region: "",
      city: "",
      zone: "",
    },
    labels: [] as Array<{ key: string; value: string }>,
    taints: [] as Array<{
      key: string;
      value: string;
      effect: "NoSchedule" | "PreferNoSchedule" | "NoExecute";
    }>,
  });

  const handleEditNode = (node: Node) => {
    setSelectedNode(node);
    // Populate form with node data
    setEditNodeForm({
      name: node.name,
      description: node.description,
      clusterId: node.clusterId || "",
      clusterName: node.clusterName || "",
      roles: node.role === "master" || node.role === "control-plane" ? ["server"] : ["agent"],
      status: node.status,
      location: {
        country: node.location.country,
        region: node.location.region,
        city: node.location.city,
        zone: node.location.zone || "",
      },
      labels: node.labels
        ? Object.entries(node.labels).map(([key, value]) => ({ key, value }))
        : [],
      taints: (node.taints || []).map((t) => ({
        key: t.key,
        value: t.value || "",
        effect: t.effect,
      })),
    });
    onEditOpen();
  };

  const handleUpdateNode = () => {
    if (!selectedNode) return;

    // Validation
    if (!editNodeForm.name || !editNodeForm.clusterName) {
      alert("Please fill in required fields: Name and Cluster Name");

      return;
    }

    // Update node
    const updatedNode: Node = {
      ...selectedNode,
      name: editNodeForm.name,
      description: editNodeForm.description,
      clusterId: editNodeForm.clusterId || selectedNode.clusterId,
      clusterName: editNodeForm.clusterName,
      role: editNodeForm.roles.includes("server") ? "master" : "worker", // Convert k3s roles to Node type
      status: editNodeForm.status,
      location: editNodeForm.location,
      labels: editNodeForm.labels.reduce(
        (acc, label) => {
          if (label.key) {
            acc[label.key] = label.value || "";
          }

          return acc;
        },
        {} as Record<string, string>,
      ),
      taints: editNodeForm.taints
        .filter((t) => t.key)
        .map((t) => ({
          key: t.key,
          value: t.value || undefined,
          effect: t.effect,
        })),
      updatedAt: new Date().toISOString(),
    };

    if (selectedNode) {
      updateNode(selectedNode.id, updatedNode);
    }
    onEditClose();
  };

  const updateEditNodeForm = (field: string, value: any) => {
    setEditNodeForm((prev) => {
      const keys = field.split(".");
      const newForm = { ...prev };
      let current: any = newForm;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return newForm;
    });
  };

  const addEditLabel = () => {
    setEditNodeForm((prev) => ({
      ...prev,
      labels: [...prev.labels, { key: "", value: "" }],
    }));
  };

  const removeEditLabel = (index: number) => {
    setEditNodeForm((prev) => ({
      ...prev,
      labels: prev.labels.filter((_, i) => i !== index),
    }));
  };

  const updateEditLabel = (index: number, key: string, value: string) => {
    setEditNodeForm((prev) => ({
      ...prev,
      labels: prev.labels.map((label, i) =>
        i === index ? { ...label, [key]: value } : label,
      ),
    }));
  };

  const addEditTaint = () => {
    setEditNodeForm((prev) => ({
      ...prev,
      taints: [...prev.taints, { key: "", value: "", effect: "NoSchedule" }],
    }));
  };

  const removeEditTaint = (index: number) => {
    setEditNodeForm((prev) => ({
      ...prev,
      taints: prev.taints.filter((_, i) => i !== index),
    }));
  };

  const updateEditTaint = (
    index: number,
    key: string,
    value: string | "NoSchedule" | "PreferNoSchedule" | "NoExecute",
  ) => {
    setEditNodeForm((prev) => ({
      ...prev,
      taints: prev.taints.map((taint, i) =>
        i === index ? { ...taint, [key]: value } : taint,
      ),
    }));
  };

  const handleViewDetails = (node: Node) => {
    setSelectedNode(node);
    setIsDetailOpen(true);
  };

  const handleDeleteNode = (node: Node) => {
    setSelectedNode(node);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (selectedNode) {
      removeNode(selectedNode.id);
      onDeleteClose();
      setSelectedNode(null);
    }
  };

  const handleStatusChange = (nodeId: string, newStatus: Node["status"]) => {
    updateNode(nodeId, { status: newStatus });
  };

  const getStatusColor = (status: Node["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "maintenance":
        return "warning";
      case "offline":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: Node["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} />;
      case "inactive":
        return <XCircle size={16} />;
      case "maintenance":
        return <AlertCircle size={16} />;
      case "offline":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  // Show health check status
  if (apiHealthStatus === "checking") {
    return <ApiHealthChecking />;
  }

  if (apiHealthStatus === "needs-api-key") {
    return (
      <ApiKeyRequired
        apiKeyInput={apiKeyInput}
        onApiKeyInputChange={setApiKeyInput}
        onSaveApiKey={handleSaveApiKey}
        error={apiHealthError}
      />
    );
  }

  if (apiHealthStatus === "unhealthy") {
    return (
      <ApiConnectionFailed
        error={apiHealthError}
        onRetry={() => {
          setApiHealthStatus("checking");
          subnetAgentClient.healthCheck()
            .then(() => {
              const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
              if (!storedApiKey && !process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
                setApiHealthStatus("needs-api-key");
              } else {
                setApiHealthStatus("healthy");
              }
            })
            .catch((error) => {
              setApiHealthStatus("unhealthy");
              setApiHealthError(
                error instanceof Error
                  ? error.message
                  : "Failed to connect to Subnet Agent API",
              );
            });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Button
              className="mb-4"
              startContent={<ArrowLeft size={16} />}
              variant="light"
              onPress={() => router.push("/provider")}
            >
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Server className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-dark-on-white">
                  Kubernetes Node Management
                </h1>
                <p className="text-lg text-dark-on-white-muted">
                  Manage and monitor Kubernetes nodes in your cluster
                </p>
              </div>
            </div>
            <Button
              color="primary"
              size="lg"
              startContent={<Plus size={20} />}
              onPress={handleAddNode}
            >
              Add New Node
            </Button>
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={stats} />
        </div>

        {/* Filters */}
        <NodeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Nodes List */}
        <NodeList
          nodes={nodes}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onViewDetails={handleViewDetails}
          onEdit={handleEditNode}
          onDelete={handleDeleteNode}
          onStatusChange={handleStatusChange}
          onAddNode={handleAddNode}
        />
      </div>

      {/* Add Node Modal */}
      <AddNodeModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        newNodeForm={newNodeForm}
        onFormChange={updateNewNodeForm}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        installationStatus={installationStatus}
        onInstallK3s={handleInstallK3s}
        onTestConnection={handleTestConnection}
        existingNodes={nodes}
        onAddLabel={addLabel}
        onRemoveLabel={removeLabel}
        onUpdateLabel={updateLabel}
        onAddTaint={addTaint}
        onRemoveTaint={removeTaint}
        onUpdateTaint={updateTaint}
        cloudZones={cloudZones}
      />

      {/* Edit Node Modal */}
      <EditNodeModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        selectedNode={selectedNode}
        editNodeForm={editNodeForm}
        onFormChange={updateEditNodeForm}
        onAddLabel={addEditLabel}
        onRemoveLabel={removeEditLabel}
        onUpdateLabel={updateEditLabel}
        onAddTaint={addEditTaint}
        onRemoveTaint={removeEditTaint}
        onUpdateTaint={updateEditTaint}
        onSave={handleUpdateNode}
      />

      {/* Node Details Modal */}
      <NodeDetailsModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        selectedNode={selectedNode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteNodeModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        node={selectedNode}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
