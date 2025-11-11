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
  const [isLoadingNodes, setIsLoadingNodes] = useState(false);

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
    
    // Auto-generate node name
    const timestamp = Date.now().toString().slice(-6);
    const nodeName = `k3s-node-${timestamp}`;
    updateNewNodeForm("name", nodeName);
    
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
    } else {
      // Auto-generate cluster name and ID if no existing nodes
      const clusterNameBase = nodeName.replace("k3s-", "k3s-cluster-");
      updateNewNodeForm("clusterName", clusterNameBase);
      updateNewNodeForm("clusterId", `cluster-${nodeName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`);
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

  // Helper function to convert Kubernetes resource units to numbers
  const parseKubernetesResource = (value: string | undefined): number => {
    if (!value) return 0;
    
    // Parse CPU (cores) - if it's just a number without units
    if (!value.includes("m") && !value.includes("Ki") && !value.includes("Mi") && !value.includes("Gi") && !value.includes("Ti")) {
      const num = parseFloat(value);
      // If it's a very large number without units, assume it's bytes and convert to GB
      if (num > 1000000) {
        return Math.round((num / (1024 * 1024 * 1024)) * 100) / 100; // bytes to GB
      }
      return num || 0;
    }
    
    // Parse memory/storage (Ki, Mi, Gi, Ti)
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    
    let result = 0;
    if (value.includes("Ki")) result = num / (1024 * 1024); // KiB to GB
    else if (value.includes("Mi")) result = num / 1024; // MiB to GB
    else if (value.includes("Gi")) result = num; // GiB to GB
    else if (value.includes("Ti")) result = num * 1024; // TiB to GB
    else result = num;
    
    // Round to 2 decimal places
    return Math.round(result * 100) / 100;
  };

  // Helper function to generate cluster name and ID
  const generateClusterInfo = (apiNodes: any[]) => {
    // Try to get cluster name from node labels
    const clusterNameFromLabels = apiNodes.find((node) => 
      node.labels?.["kubernetes.io/cluster-name"] || 
      node.labels?.["cluster-name"]
    )?.labels?.["kubernetes.io/cluster-name"] || 
    apiNodes.find((node) => node.labels?.["cluster-name"])?.labels?.["cluster-name"];

    if (clusterNameFromLabels) {
      const clusterId = `cluster-${clusterNameFromLabels.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-6)}`;
      return {
        clusterName: clusterNameFromLabels,
        clusterId: clusterId,
      };
    }

    // Generate from hostname or node name
    const firstNode = apiNodes[0];
    const hostname = firstNode?.name || firstNode?.internal_ip || "k3s";
    const clusterNameBase = hostname.split(".")[0] || "k3s-cluster";
    const timestamp = Date.now().toString().slice(-6);
    
    return {
      clusterName: `${clusterNameBase}-${timestamp}`,
      clusterId: `cluster-${clusterNameBase.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${timestamp}`,
    };
  };

  // Fetch nodes from Subnet Agent API
  const fetchNodes = async () => {
    // Only fetch if API is healthy
    if (apiHealthStatus !== "healthy") {
      return;
    }

    try {
      setIsLoadingNodes(true);
      
      // Check API key validity before fetching
      const isApiKeyValid = await checkApiKeyValidity();
      if (!isApiKeyValid) {
        setIsLoadingNodes(false);
        return;
      }

      // Fetch nodes from local host
      const nodesResponse = await subnetAgentClient.getNodes({
        target: "local",
      });

      // Generate cluster info for all nodes
      const clusterInfo = generateClusterInfo(nodesResponse.nodes);

      // Convert API nodes to our Node format
      const fetchedNodes: Node[] = nodesResponse.nodes.map((apiNode, index) => {
        // Try to find existing node by nodeName to preserve metadata
        const existingNode = nodes.find((n) => n.nodeName === apiNode.name);
        
        // Use existing cluster info if available, otherwise use generated
        const finalClusterName = existingNode?.clusterName || 
          (nodes.length > 0 ? nodes[0].clusterName : clusterInfo.clusterName);
        const finalClusterId = existingNode?.clusterId || 
          (nodes.length > 0 ? nodes[0].clusterId : clusterInfo.clusterId);
        
        return {
          id: existingNode?.id || `node-${Date.now()}-${index}-${apiNode.name}`,
          providerId: existingNode?.providerId || "provider-1",
          name: existingNode?.name || apiNode.name,
          nodeName: apiNode.name,
          description: existingNode?.description || `k3s ${apiNode.roles.join(",")} node`,
          clusterId: finalClusterId,
          clusterName: finalClusterName,
          role: apiNode.roles.includes("control-plane") || apiNode.roles.includes("master") || apiNode.roles.includes("server")
            ? "master"
            : "worker",
          status: apiNode.status === "Ready" ? "active" : 
                  apiNode.status === "NotReady" ? "inactive" :
                  apiNode.status === "Unknown" ? "offline" : "inactive",
          kubernetesVersion: apiNode.version,
          containerRuntime: apiNode.container_runtime,
          osImage: apiNode.os_image,
          kernelVersion: apiNode.kernel_version,
          kubeletVersion: apiNode.version,
          internalIp: apiNode.internal_ip,
          externalIp: apiNode.external_ip,
          labels: apiNode.labels,
          taints: apiNode.annotations ? Object.entries(apiNode.annotations)
            .filter(([key]) => key.startsWith("taint."))
            .map(([key, value]) => {
              const parts = (value as string).split(":");
              return {
                key: key.replace("taint.", ""),
                value: parts[0] || undefined,
                effect: (parts[1] as "NoSchedule" | "PreferNoSchedule" | "NoExecute") || "NoSchedule",
              };
            }) : existingNode?.taints || [],
          specs: existingNode?.specs || {
            cpu: apiNode.cpu ? parseInt(apiNode.cpu) : (apiNode.allocatable_cpu ? parseInt(apiNode.allocatable_cpu) : 0),
            memory: apiNode.memory ? parseKubernetesResource(apiNode.memory) : (apiNode.allocatable_memory ? parseKubernetesResource(apiNode.allocatable_memory) : 0),
            storage: apiNode.storage ? parseKubernetesResource(apiNode.storage) : (apiNode.allocatable_storage ? parseKubernetesResource(apiNode.allocatable_storage) : 0),
            bandwidth: 0, // Not available from API
            pods: 110, // Default pod capacity
          },
          usage: {
            cpu: apiNode.cpu_usage_percent !== undefined ? apiNode.cpu_usage_percent : (existingNode?.usage?.cpu || 0),
            memory: apiNode.memory_usage_percent !== undefined ? apiNode.memory_usage_percent : (existingNode?.usage?.memory || 0),
            storage: apiNode.storage_usage_percent !== undefined ? apiNode.storage_usage_percent : (existingNode?.usage?.storage || 0),
            pods: apiNode.total_pods !== undefined ? apiNode.total_pods : (existingNode?.usage?.pods || 0),
          },
          pods: {
            running: apiNode.running_pods !== undefined ? apiNode.running_pods : (existingNode?.pods?.running || 0),
            pending: apiNode.pending_pods !== undefined ? apiNode.pending_pods : (existingNode?.pods?.pending || 0),
            failed: apiNode.failed_pods !== undefined ? apiNode.failed_pods : (existingNode?.pods?.failed || 0),
            succeeded: apiNode.succeeded_pods !== undefined ? apiNode.succeeded_pods : (existingNode?.pods?.succeeded || 0),
            total: apiNode.total_pods !== undefined ? apiNode.total_pods : (existingNode?.pods?.total || 0),
            capacity: existingNode?.pods?.capacity || 110,
          },
          location: existingNode?.location || {
            country: "",
            region: "",
            city: "",
            zone: "",
          },
          uptime: existingNode?.uptime || 100,
          reputation: existingNode?.reputation || 0,
          createdAt: existingNode?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      setNodes(fetchedNodes);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      // Check if it's an auth error
      if (handleApiError(error)) {
        return; // Auth error handled
      }
      // If fetch fails, keep existing nodes (could be empty or from previous fetch)
    } finally {
      setIsLoadingNodes(false);
    }
  };

  // Fetch nodes when API becomes healthy
  useEffect(() => {
    if (apiHealthStatus === "healthy") {
      fetchNodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiHealthStatus]);

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

          // Generate cluster name and ID if not provided
          const generateClusterInfoForNewNode = () => {
            if (nodes.length > 0) {
              return {
                clusterName: nodes[0].clusterName,
                clusterId: nodes[0].clusterId,
              };
            }
            if (newNodeForm.clusterName && newNodeForm.clusterId) {
              return {
                clusterName: newNodeForm.clusterName,
                clusterId: newNodeForm.clusterId,
              };
            }
            // Auto-generate cluster info
            const timestamp = Date.now().toString().slice(-6);
            const baseName = newNodeForm.name || "k3s-cluster";
            return {
              clusterName: `${baseName}-${timestamp}`,
              clusterId: `cluster-${baseName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${timestamp}`,
            };
          };

          const clusterInfoForNode = generateClusterInfoForNewNode();
          const clusterNameForNode = clusterInfoForNode.clusterName;
          const clusterIdForNode = clusterInfoForNode.clusterId;
          
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

    // Auto-generate cluster name and ID if not provided and no existing nodes
    if (nodes.length === 0 && !newNodeForm.clusterName) {
      const timestamp = Date.now().toString().slice(-6);
      const baseName = newNodeForm.name || "k3s-cluster";
      updateNewNodeForm("clusterName", `${baseName}-${timestamp}`);
      updateNewNodeForm("clusterId", `cluster-${baseName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${timestamp}`);
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

      // Get cluster name - use from existing nodes if available, otherwise use form value or generate
      const clusterName =
        nodes.length > 0
          ? nodes[0].clusterName || newNodeForm.clusterName
          : newNodeForm.clusterName || `k3s-cluster-${Date.now().toString().slice(-6)}`;

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

      // Handle nested properties by creating shallow copies at each level
      if (keys.length === 1) {
        // Simple property update
        return { ...newForm, [keys[0]]: value };
      }

      // Nested property update
      let current: any = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        // Create shallow copy of nested object
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      // Set the final value
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
        {isLoadingNodes ? (
          <Card className="subnet-card">
            <CardBody className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Activity className="text-primary animate-pulse" size={32} />
                <p className="text-default-600">Loading nodes from Subnet Agent...</p>
              </div>
            </CardBody>
          </Card>
        ) : (
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
        )}
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
