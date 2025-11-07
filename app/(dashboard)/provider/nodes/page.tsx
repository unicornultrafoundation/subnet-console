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
  Search,
  Edit,
  Trash2,
  Eye,
  Activity,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Box,
  HardDrive,
  ArrowLeft,
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
  JobStatus,
} from "@/lib/api/subnet-agent";

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

  // API Health check state
  const [apiHealthStatus, setApiHealthStatus] = useState<"checking" | "healthy" | "unhealthy" | "needs-api-key">("checking");
  const [apiHealthError, setApiHealthError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");

  // Helper function to check and handle API key validation
  const checkApiKeyValidity = async (): Promise<boolean> => {
    const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
    if (!storedApiKey && !process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
      setApiHealthStatus("needs-api-key");
      return false;
    }

    try {
      const apiKeyToCheck = storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY || "";
      const validationResult = await subnetAgentClient.validateApiKey(apiKeyToCheck);
      if (!validationResult.valid) {
        setApiHealthStatus("needs-api-key");
        setApiHealthError(validationResult.message || "API key is invalid");
        return false;
      }
      return true;
    } catch (error) {
      // If validation fails, might be connection issue, don't change status
      return true; // Assume valid if we can't check
    }
  };

  // Handle API errors and check for invalid API key
  const handleApiError = (error: unknown) => {
    if (error && typeof error === "object" && "isAuthError" in error && (error as any).isAuthError) {
      // API key is invalid, show API key form
      setApiHealthStatus("needs-api-key");
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any).message || "API key is invalid or expired. Please enter a new API key.";
      setApiHealthError(errorMessage);
      return true; // Indicates auth error was handled
    }
    return false; // Not an auth error
  };

  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = newNodeForm.target === "host" ? 3 : 4; // Host has one less step (no connection)

  // Cloud Zones
  const cloudZones = [
    // US Regions
    { region: "US Central (Iowa)", zones: ["us-central1-a", "us-central1-b", "us-central1-c", "us-central1-f"] },
    { region: "US East (South Carolina)", zones: ["us-east1-b", "us-east1-c", "us-east1-d"] },
    { region: "US East (Virginia)", zones: ["us-east4-a", "us-east4-b", "us-east4-c"] },
    { region: "US West (Oregon)", zones: ["us-west1-a", "us-west1-b", "us-west1-c"] },
    { region: "US West (California)", zones: ["us-west2-a", "us-west2-b", "us-west2-c"] },
    { region: "US West (Los Angeles)", zones: ["us-west3-a", "us-west3-b", "us-west3-c"] },
    { region: "US West (Salt Lake City)", zones: ["us-west4-a", "us-west4-b", "us-west4-c"] },
    // Europe Regions
    { region: "Europe West (Belgium)", zones: ["europe-west1-b", "europe-west1-c", "europe-west1-d"] },
    { region: "Europe West (London)", zones: ["europe-west2-a", "europe-west2-b", "europe-west2-c"] },
    { region: "Europe West (Frankfurt)", zones: ["europe-west3-a", "europe-west3-b", "europe-west3-c"] },
    { region: "Europe West (Netherlands)", zones: ["europe-west4-a", "europe-west4-b", "europe-west4-c"] },
    { region: "Europe West (Milan)", zones: ["europe-west6-a", "europe-west6-b", "europe-west6-c"] },
    { region: "Europe West (Paris)", zones: ["europe-west9-a", "europe-west9-b", "europe-west9-c"] },
    { region: "Europe West (Warsaw)", zones: ["europe-west10-a", "europe-west10-b", "europe-west10-c"] },
    { region: "Europe Central (Belgium)", zones: ["europe-central2-a", "europe-central2-b", "europe-central2-c"] },
    { region: "Europe North (Finland)", zones: ["europe-north1-a", "europe-north1-b", "europe-north1-c"] },
    { region: "Europe South (Madrid)", zones: ["europe-southwest1-a", "europe-southwest1-b", "europe-southwest1-c"] },
    // Asia Regions
    { region: "Asia East (Taiwan)", zones: ["asia-east1-a", "asia-east1-b", "asia-east1-c"] },
    { region: "Asia Northeast (Tokyo)", zones: ["asia-northeast1-a", "asia-northeast1-b", "asia-northeast1-c"] },
    { region: "Asia Northeast (Osaka)", zones: ["asia-northeast2-a", "asia-northeast2-b", "asia-northeast2-c"] },
    { region: "Asia Northeast (Seoul)", zones: ["asia-northeast3-a", "asia-northeast3-b", "asia-northeast3-c"] },
    { region: "Asia South (Mumbai)", zones: ["asia-south1-a", "asia-south1-b", "asia-south1-c"] },
    { region: "Asia South (Delhi)", zones: ["asia-south2-a", "asia-south2-b", "asia-south2-c"] },
    { region: "Asia Southeast (Singapore)", zones: ["asia-southeast1-a", "asia-southeast1-b", "asia-southeast1-c"] },
    { region: "Asia Southeast (Jakarta)", zones: ["asia-southeast2-a", "asia-southeast2-b", "asia-southeast2-c"] },
    { region: "Asia Pacific (Hong Kong)", zones: ["asia-east2-a", "asia-east2-b", "asia-east2-c"] },
    // Other Regions
    { region: "South America (São Paulo)", zones: ["southamerica-east1-a", "southamerica-east1-b", "southamerica-east1-c"] },
    { region: "South America (Santiago)", zones: ["southamerica-west1-a", "southamerica-west1-b", "southamerica-west1-c"] },
    { region: "Australia (Sydney)", zones: ["australia-southeast1-a", "australia-southeast1-b", "australia-southeast1-c"] },
    { region: "Australia (Melbourne)", zones: ["australia-southeast2-a", "australia-southeast2-b", "australia-southeast2-c"] },
    { region: "North America (Montreal)", zones: ["northamerica-northeast1-a", "northamerica-northeast1-b", "northamerica-northeast1-c"] },
    { region: "North America (Toronto)", zones: ["northamerica-northeast2-a", "northamerica-northeast2-b", "northamerica-northeast2-c"] },
  ];

  // Update step when target changes
  useEffect(() => {
    if (newNodeForm.target === "host" && currentStep === 2) {
      // If switching to host and we're on connection step, go to node config
      setCurrentStep(2);
    } else if (newNodeForm.target === "remote" && currentStep === 2) {
      // If switching to remote and we're on step 2, stay on step 2 (connection)
      // No change needed
    }
  }, [newNodeForm.target]);

  const onAddOpen = () => {
    setCurrentStep(1); // Reset to first step
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
    setCurrentStep(1); // Reset step
    setIsAddOpen(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
    setApiKey(storedApiKey);
  }, []);

  // Health check on mount and periodically
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setApiHealthStatus("checking");
        setApiHealthError(null);
        
        // Check if we have API key
        const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
        
        // Try health check (may work without API key)
        await subnetAgentClient.healthCheck();
        
        // If health check succeeds but no API key, show API key form
        if (!storedApiKey && !process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
          setApiHealthStatus("needs-api-key");
          return;
        }
        
        // If we have API key, validate it
        if (storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
          const apiKeyToCheck = storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY || "";
          try {
            const validationResult = await subnetAgentClient.validateApiKey(apiKeyToCheck);
            if (!validationResult.valid) {
              setApiHealthStatus("needs-api-key");
              setApiHealthError(validationResult.message || "API key is invalid");
              return;
            }
          } catch (validationError) {
            // If validation fails, might be connection issue, don't change status
            console.error("Failed to validate API key:", validationError);
          }
        }
        
        setApiHealthStatus("healthy");
      } catch (error) {
        console.error("API health check failed:", error);
        // Check if it's an auth error
        if (handleApiError(error)) {
          return; // Auth error handled
        }
        setApiHealthStatus("unhealthy");
        setApiHealthError(
          error instanceof Error
            ? error.message
            : "Failed to connect to Subnet Agent API",
        );
      }
    };

    checkApiHealth();
    
    // Check API key validity periodically (every 5 minutes)
    const interval = setInterval(() => {
      const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
      if (storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
        checkApiKeyValidity();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [apiKey]);

  // Handle save API key
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;

    try {
      setApiHealthStatus("checking");
      setApiHealthError(null);
      
      // Validate API key first
      const validationResult = await subnetAgentClient.validateApiKey(apiKeyInput.trim());
      
      if (!validationResult.valid) {
        setApiHealthError(validationResult.message || "API key is invalid");
        setApiHealthStatus("needs-api-key");
        return;
      }
      
      // API key is valid, save it
      localStorage.setItem("subnet_agent_api_key", apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      
      // Update client
      subnetAgentClient.setApiKey(apiKeyInput.trim());
      
      // Verify with health check
      await subnetAgentClient.healthCheck();
      setApiHealthStatus("healthy");
      setApiKeyInput("");
      setApiHealthError(null);
    } catch (error) {
      setApiHealthError(
        error instanceof Error
          ? error.message
          : "Failed to validate API key. Please check your connection and try again.",
      );
      setApiHealthStatus("needs-api-key");
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearTimeout(pollingInterval);
      }
    };
  }, [pollingInterval]);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="subnet-card max-w-md">
              <CardBody className="p-6 text-center">
                <Activity className="mx-auto mb-4 text-primary animate-pulse" size={48} />
                <h3 className="text-lg font-semibold mb-2">Checking API Connection</h3>
                <p className="text-sm text-default-600">
                  Verifying Subnet Agent API health...
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (apiHealthStatus === "needs-api-key") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="subnet-card max-w-2xl">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <AlertCircle className="mx-auto mb-4 text-warning" size={48} />
                  <h3 className="text-lg font-semibold mb-2">API Key Required</h3>
                  <p className="text-sm text-default-600">
                    Please enter your Subnet Agent API key to manage nodes.
                  </p>
                </div>

                <div className="bg-default-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-3 text-sm">How to Get Your API Key:</h4>
                  <div className="space-y-3 text-sm text-default-600">
                    <div>
                      <p className="font-semibold mb-1">Step 1: Open Subnet Agent</p>
                      <p>Make sure Subnet Agent is running on your computer.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Step 2: Access Settings</p>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li><strong>Windows:</strong> Right-click the Subnet Agent icon in the system tray and select "Settings"</li>
                        <li><strong>macOS:</strong> Click the Subnet Agent icon in the menu bar and select "Settings"</li>
                        <li><strong>Linux:</strong> Open Subnet Agent and go to Settings menu</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Step 3: Find API Key</p>
                      <p>In the Settings window, look for the "API Key" section. You can either:</p>
                      <ul className="space-y-1 ml-4 list-disc mt-1">
                        <li>Copy the existing API key if one is already generated</li>
                        <li>Click "Generate New API Key" to create a new one</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Step 4: Copy and Paste</p>
                      <p>Copy the API key and paste it in the field below.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      API Key <span className="text-danger">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && apiKeyInput.trim()) {
                          handleSaveApiKey();
                        }
                      }}
                    />
                    <p className="text-xs text-default-500 mt-1">
                      This key will be stored locally in your browser for future use
                    </p>
                    {apiHealthError && (
                      <p className="text-xs text-danger mt-2">
                        {apiHealthError}
                      </p>
                    )}
                  </div>
                  <Button
                    color="primary"
                    className="w-full"
                    isDisabled={!apiKeyInput.trim()}
                    onPress={handleSaveApiKey}
                  >
                    Save API Key
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (apiHealthStatus === "unhealthy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="subnet-card max-w-2xl border-danger">
              <CardBody className="p-6">
                <div className="text-center mb-6">
                  <AlertCircle className="mx-auto mb-4 text-danger" size={48} />
                  <h3 className="text-lg font-semibold mb-2 text-danger">Unable to Connect to Subnet Agent</h3>
                  <p className="text-sm text-default-600">
                    The system cannot connect to Subnet Agent. Please follow these steps:
                  </p>
                </div>
                
                <div className="space-y-4 text-left">
                  <div className="bg-default-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-sm">Step 1: Download and Install Subnet Agent</h4>
                    <p className="text-sm text-default-600 mb-3">
                      Download Subnet Agent for your operating system:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="w-full"
                        onPress={() => {
                          window.open("https://github.com/subnet/subnet-agent/releases/latest", "_blank");
                        }}
                      >
                        Windows
                      </Button>
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="w-full"
                        onPress={() => {
                          window.open("https://github.com/subnet/subnet-agent/releases/latest", "_blank");
                        }}
                      >
                        macOS
                      </Button>
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="w-full"
                        onPress={() => {
                          window.open("https://github.com/subnet/subnet-agent/releases/latest", "_blank");
                        }}
                      >
                        Linux
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm text-default-600">
                      <p className="font-semibold">Installation Instructions:</p>
                      <ul className="space-y-2 ml-4 list-disc">
                        <li><strong>Windows:</strong> Run the downloaded .exe installer and follow the on-screen instructions. Subnet Agent will automatically set up WSL2 if needed.</li>
                        <li><strong>macOS:</strong> Open the downloaded .dmg file, drag Subnet Agent to Applications folder, then run it from Applications.</li>
                        <li><strong>Linux:</strong> Extract the downloaded archive and run the install script, or use the package manager for your distribution.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-default-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Step 2: Start Subnet Agent</h4>
                    <p className="text-sm text-default-600 mb-2">
                      After installation, start the Subnet Agent program:
                    </p>
                    <ul className="text-sm text-default-600 space-y-1 ml-4 list-disc">
                      <li><strong>Windows:</strong> Find Subnet Agent in the Start menu or system tray</li>
                      <li><strong>macOS:</strong> Open Subnet Agent from Applications folder</li>
                      <li><strong>Linux:</strong> Run Subnet Agent from the terminal or application menu</li>
                    </ul>
                    <p className="text-sm text-default-600 mt-2">
                      Make sure the program is running before proceeding.
                    </p>
                  </div>

                  <div className="bg-default-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Step 3: Check Your Internet Connection</h4>
                    <p className="text-sm text-default-600 mb-2">
                      Make sure your computer is connected to the internet and no firewall is blocking the connection.
                    </p>
                  </div>

                  <div className="bg-default-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Step 4: Try Again</h4>
                    <p className="text-sm text-default-600 mb-2">
                      After completing the steps above, click the "Retry Connection" button below.
                    </p>
                  </div>
                </div>

                {apiHealthError && (
                  <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                    <p className="text-xs text-danger font-semibold mb-1">Error Details:</p>
                    <p className="text-xs text-danger font-mono break-all">
                      {apiHealthError}
                    </p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Button
                    color="primary"
                    size="lg"
                    onPress={() => {
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
                  >
                    Retry Connection
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="subnet-card">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.total}
                  </div>
                  <div className="text-xs text-default-600">Total Nodes</div>
                  <div className="text-xs text-default-500 mt-1">
                    {stats.active} active
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="subnet-card">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.clusters}
                  </div>
                  <div className="text-xs text-default-600">Clusters</div>
                </div>
              </CardBody>
            </Card>
            <Card className="subnet-card">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {stats.totalPods}
                  </div>
                  <div className="text-xs text-default-600">Active Pods</div>
                  <div className="text-xs text-default-500 mt-1">
                    / {stats.totalPodsCapacity} capacity
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="subnet-card">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.totalCpu}
                  </div>
                  <div className="text-xs text-default-600">CPU Cores</div>
                </div>
              </CardBody>
            </Card>
            <Card className="subnet-card">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {stats.totalMemory}GB
                  </div>
                  <div className="text-xs text-default-600">Memory</div>
                </div>
              </CardBody>
            </Card>
            <Card className="subnet-card">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {stats.averageUptime.toFixed(1)}%
                  </div>
                  <div className="text-xs text-default-600">Avg Uptime</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="subnet-card mb-6">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="flex-1"
                placeholder="Search nodes by name, description, or location..."
                size="lg"
                startContent={<Search size={20} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                className="w-[160px]"
                placeholder="Filter by status"
                selectedKeys={[statusFilter]}
                size="md"
                onSelectionChange={(keys) =>
                  setStatusFilter(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Status</SelectItem>
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="inactive">Inactive</SelectItem>
                <SelectItem key="maintenance">Maintenance</SelectItem>
                <SelectItem key="offline">Offline</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Nodes List */}
        <div className="space-y-4">
          {filteredNodes.length === 0 ? (
            <Card className="subnet-card">
              <CardBody className="p-12 text-center">
                <Server className="text-default-300 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-default-600 mb-2">
                  No nodes found
                </h3>
                <p className="text-default-500 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first node"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button color="primary" onPress={handleAddNode}>
                    Add New Node
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            filteredNodes.map((node) => (
              <Card
                key={node.id}
                className="subnet-card hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Server className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-dark-on-white truncate">
                            {node.name}
                          </h3>
                          {node.clusterName && (
                            <Chip
                              className="flex-shrink-0"
                              color="primary"
                              size="sm"
                              variant="flat"
                            >
                              {node.clusterName}
                            </Chip>
                          )}
                          <Chip
                            className="flex-shrink-0"
                            color={getStatusColor(node.status)}
                            size="sm"
                            startContent={getStatusIcon(node.status)}
                            variant="flat"
                          >
                            {node.status}
                          </Chip>
                        </div>
                        <p className="text-sm text-dark-on-white-muted mb-2 line-clamp-1">
                          {node.description}
                        </p>

                        {/* Compact Info Row */}
                        <div className="flex items-center gap-3 text-xs text-default-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span className="truncate">
                              {node.location.city}
                              {node.location.zone && ` (${node.location.zone})`}
                            </span>
                          </div>
                          {node.pods && (
                            <div className="flex items-center gap-1">
                              <Box size={12} />
                              <span>
                                {node.pods.running}/{node.pods.capacity} pods
                              </span>
                            </div>
                          )}
                          {node.usage && (
                            <>
                              <div className="flex items-center gap-1">
                                <Activity size={12} />
                                <span>CPU {node.usage.cpu}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <HardDrive size={12} />
                                <span>Mem {node.usage.memory}%</span>
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp size={12} />
                            <span>{node.uptime}% uptime</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compact Specs */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">
                          {node.specs.cpu}C
                        </div>
                        <div className="text-xs text-default-500">
                          {node.specs.memory}GB
                        </div>
                        <div className="text-xs text-default-500">
                          {node.specs.storage}GB
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        isIconOnly
                        size="sm"
                        title="View Details"
                        variant="flat"
                        onPress={() => {
                          handleViewDetails(node);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        title="Edit"
                        variant="flat"
                        onPress={() => {
                          handleEditNode(node);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        title="Delete"
                        variant="flat"
                        onPress={() => {
                          handleDeleteNode(node);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Select
                        className="w-32"
                        selectedKeys={[node.status]}
                        size="sm"
                        onSelectionChange={(keys) => {
                          const newStatus = Array.from(
                            keys,
                          )[0] as Node["status"];

                          handleStatusChange(node.id, newStatus);
                        }}
                      >
                        <SelectItem key="active">Active</SelectItem>
                        <SelectItem key="inactive">Inactive</SelectItem>
                        <SelectItem key="maintenance">Maintenance</SelectItem>
                        <SelectItem key="offline">Offline</SelectItem>
                      </Select>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Node Modal */}
      <Modal
        isOpen={isAddOpen}
        scrollBehavior="inside"
        size="4xl"
        onClose={onAddClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="w-full">
                  <h2 className="text-xl font-bold">Add New k3s Node</h2>
                  <p className="text-sm text-default-600 mt-1">
                    Step {currentStep} of {totalSteps}
                  </p>
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <Progress
                      value={(currentStep / totalSteps) * 100}
                      className="w-full"
                      color="primary"
                    />
                  </div>
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between mt-4">
                    {[
                      "Target",
                      ...(newNodeForm.target === "remote" ? ["Connection"] : []),
                      "Node Config",
                      "Review",
                    ].map((stepName, index) => {
                      const stepNum = index + 1;
                      const isActive = stepNum === currentStep;
                      const isCompleted = stepNum < currentStep;
                      return (
                        <div
                          key={stepNum}
                          className={`flex flex-col items-center flex-1 ${
                            isActive ? "text-primary" : isCompleted ? "text-success" : "text-default-400"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                              isActive
                                ? "bg-primary text-white"
                                : isCompleted
                                  ? "bg-success text-white"
                                  : "bg-default-200"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle size={16} />
                            ) : (
                              stepNum
                            )}
                          </div>
                          <span className="text-xs mt-1 text-center">{stepName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Step Content */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Step 1: Select Target</h3>
                      <p className="text-sm text-default-600 mb-4">
                        Choose whether to install k3s on the local host or a remote server.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Target <span className="text-danger">*</span>
                          </label>
                          <Select
                            selectedKeys={[newNodeForm.target]}
                            onSelectionChange={(keys) => {
                              updateNewNodeForm(
                                "target",
                                Array.from(keys)[0] as "host" | "remote",
                              );
                            }}
                          >
                            <SelectItem key="host">Host</SelectItem>
                            <SelectItem key="remote">Remote</SelectItem>
                          </Select>
                        </div>

                        {newNodeForm.target === "remote" && (
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-default-600 mb-2">
                              <strong>How it works:</strong> Enter your server SSH
                              credentials. The system will automatically connect,
                              install k3s, and configure the node.
                            </p>
                          </div>
                        )}

                        {newNodeForm.target === "host" && (
                          <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                            <p className="text-sm text-default-600 mb-2">
                              <strong>Host Mode:</strong> Installing k3s on the local
                              host machine. No SSH credentials required.
                            </p>
                          </div>
                        )}

                        {newNodeForm.target === "remote" && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Server IP Address{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <Input
                                  placeholder="192.168.1.100"
                                  value={newNodeForm.serverIP}
                                  onChange={(e) =>
                                    updateNewNodeForm("serverIP", e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  SSH Port
                                </label>
                                <Input
                                  placeholder="22"
                                  type="number"
                                  value={newNodeForm.sshPort}
                                  onChange={(e) =>
                                    updateNewNodeForm("sshPort", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                SSH User
                              </label>
                              <Input
                                placeholder="root"
                                value={newNodeForm.sshUser}
                                onChange={(e) =>
                                  updateNewNodeForm("sshUser", e.target.value)
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Authentication Method
                              </label>
                              <Select
                                selectedKeys={[newNodeForm.authMethod]}
                                onSelectionChange={(keys) => {
                                  updateNewNodeForm(
                                    "authMethod",
                                    Array.from(keys)[0] as "key" | "password",
                                  );
                                }}
                              >
                                <SelectItem key="key">SSH Key</SelectItem>
                                <SelectItem key="password">Password</SelectItem>
                              </Select>
                            </div>

                            {newNodeForm.authMethod === "key" ? (
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  SSH Private Key{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <textarea
                                  className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                                  placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                                  value={newNodeForm.sshKey}
                                  onChange={(e) =>
                                    updateNewNodeForm("sshKey", e.target.value)
                                  }
                                />
                                <p className="text-xs text-default-500 mt-1">
                                  Paste your SSH private key here
                                </p>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  SSH Password{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <Input
                                  placeholder="Enter SSH password"
                                  type="password"
                                  value={newNodeForm.sshPassword}
                                  onChange={(e) =>
                                    updateNewNodeForm("sshPassword", e.target.value)
                                  }
                                />
                              </div>
                            )}

                            <Button
                              className="w-full"
                              color="primary"
                              variant="flat"
                              onPress={handleTestConnection}
                            >
                              Test Connection
                            </Button>
                          </>
                        )}

                        {installationStatus.status !== "idle" &&
                          installationStatus.step === "Testing connection" && (
                            <Card className="subnet-card">
                              <CardBody className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Activity
                                      className="text-primary"
                                      size={16}
                                    />
                                    <span className="text-sm font-medium">
                                      {installationStatus.message}
                                    </span>
                                  </div>
                                  <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {installationStatus.logs.map((log, idx) => (
                                      <p
                                        key={idx}
                                        className="text-xs text-default-600 font-mono"
                                      >
                                        {log}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Connection (only for remote) */}
                  {currentStep === 2 && newNodeForm.target === "remote" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Step 2: Server Connection</h3>
                      <p className="text-sm text-default-600 mb-4">
                        Enter SSH credentials to connect to the remote server.
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-default-600 mb-2">
                            <strong>How it works:</strong> Enter your server SSH
                            credentials. The system will automatically connect,
                            install k3s, and configure the node.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Server IP Address{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="192.168.1.100"
                              value={newNodeForm.serverIP}
                              onChange={(e) =>
                                updateNewNodeForm("serverIP", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              SSH Port
                            </label>
                            <Input
                              placeholder="22"
                              type="number"
                              value={newNodeForm.sshPort}
                              onChange={(e) =>
                                updateNewNodeForm("sshPort", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            SSH User
                          </label>
                          <Input
                            placeholder="root"
                            value={newNodeForm.sshUser}
                            onChange={(e) =>
                              updateNewNodeForm("sshUser", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Authentication Method
                          </label>
                          <Select
                            selectedKeys={[newNodeForm.authMethod]}
                            onSelectionChange={(keys) => {
                              updateNewNodeForm(
                                "authMethod",
                                Array.from(keys)[0] as "key" | "password",
                              );
                            }}
                          >
                            <SelectItem key="key">SSH Key</SelectItem>
                            <SelectItem key="password">Password</SelectItem>
                          </Select>
                        </div>

                        {newNodeForm.authMethod === "key" ? (
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              SSH Private Key{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                              placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                              value={newNodeForm.sshKey}
                              onChange={(e) =>
                                updateNewNodeForm("sshKey", e.target.value)
                              }
                            />
                            <p className="text-xs text-default-500 mt-1">
                              Paste your SSH private key here
                            </p>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              SSH Password{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="Enter SSH password"
                              type="password"
                              value={newNodeForm.sshPassword}
                              onChange={(e) =>
                                updateNewNodeForm("sshPassword", e.target.value)
                              }
                            />
                          </div>
                        )}

                        <Button
                          className="w-full"
                          color="primary"
                          variant="flat"
                          onPress={handleTestConnection}
                        >
                          Test Connection
                        </Button>

                        {installationStatus.status !== "idle" &&
                          installationStatus.step === "Testing connection" && (
                            <Card className="subnet-card">
                              <CardBody className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Activity
                                      className="text-primary"
                                      size={16}
                                    />
                                    <span className="text-sm font-medium">
                                      {installationStatus.message}
                                    </span>
                                  </div>
                                  <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {installationStatus.logs.map((log, idx) => (
                                      <p
                                        key={idx}
                                        className="text-xs text-default-600 font-mono"
                                      >
                                        {log}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Step 2/3: Node Config (step 2 for host, step 3 for remote) */}
                  {((newNodeForm.target === "host" && currentStep === 2) ||
                    (newNodeForm.target === "remote" && currentStep === 3)) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">
                        {newNodeForm.target === "host" ? "Step 2" : "Step 3"}: Node Configuration
                      </h3>
                      <p className="text-sm text-default-600 mb-4">
                        Configure basic node information and cluster settings.
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Node Name <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="worker-node-01"
                              value={newNodeForm.name}
                              onChange={(e) =>
                                updateNewNodeForm("name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Node Roles <span className="text-danger">*</span>
                            </label>
                            <Select
                              selectionMode="multiple"
                              selectedKeys={new Set(newNodeForm.roles)}
                              onSelectionChange={(keys) => {
                                const selectedRoles = Array.from(keys) as Array<
                                  "server" | "agent"
                                >;
                                updateNewNodeForm("roles", selectedRoles);
                                // Auto-set install mode based on roles
                                // If has agent, must be agent mode; if server, must be server mode
                                if (selectedRoles.includes("agent")) {
                                  updateNewNodeForm("installMode", "agent");
                                } else if (selectedRoles.includes("server")) {
                                  updateNewNodeForm("installMode", "server");
                                }
                              }}
                            >
                              <SelectItem key="server">Server (Control Plane)</SelectItem>
                              <SelectItem key="agent">Agent (Worker)</SelectItem>
                            </Select>
                            <p className="text-xs text-default-500 mt-1">
                              k3s has two node types: Server (control-plane) and Agent (worker)
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Worker node description..."
                            value={newNodeForm.description}
                            onChange={(e) =>
                              updateNewNodeForm("description", e.target.value)
                            }
                          />
                        </div>

                        {nodes.length === 0 && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Cluster Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="Production Cluster"
                                value={newNodeForm.clusterName}
                                onChange={(e) =>
                                  updateNewNodeForm("clusterName", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Cluster ID
                              </label>
                              <Input
                                placeholder="cluster-prod-01"
                                value={newNodeForm.clusterId}
                                onChange={(e) =>
                                  updateNewNodeForm("clusterId", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}
                        {nodes.length > 0 && (
                          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                            <p className="text-sm text-default-600">
                              <strong>Cluster:</strong> {nodes[0].clusterName || "N/A"}
                              {nodes[0].clusterId && (
                                <span className="ml-2 text-default-500">
                                  (ID: {nodes[0].clusterId})
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-default-500 mt-1">
                              Using cluster configuration from existing nodes
                            </p>
                          </div>
                        )}

                        {nodes.length === 0 && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Country
                                </label>
                                <Input
                                  placeholder="USA"
                                  value={newNodeForm.location.country}
                                  onChange={(e) =>
                                    updateNewNodeForm(
                                      "location.country",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  City
                                </label>
                                <Input
                                  placeholder="San Francisco"
                                  value={newNodeForm.location.city}
                                  onChange={(e) =>
                                    updateNewNodeForm(
                                      "location.city",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Zone
                              </label>
                              <Select
                                placeholder="Select a zone"
                                selectedKeys={newNodeForm.location.zone ? [newNodeForm.location.zone] : []}
                                onSelectionChange={(keys) => {
                                  const selectedZone = Array.from(keys)[0] as string;
                                  updateNewNodeForm("location.zone", selectedZone || "");
                                }}
                              >
                                {cloudZones.flatMap((regionGroup) =>
                                  regionGroup.zones.map((zone) => (
                                    <SelectItem key={zone}>
                                      {zone} ({regionGroup.region})
                                    </SelectItem>
                                  ))
                                )}
                              </Select>
                              <p className="text-xs text-default-500 mt-1">
                                Select a zone for this node
                              </p>
                            </div>
                          </>
                        )}
                        {nodes.length > 0 && (
                          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                            <p className="text-sm text-default-600 mb-2">
                              <strong>Location:</strong>
                            </p>
                            <div className="space-y-1 text-sm text-default-600">
                              {nodes[0].location.country && (
                                <p>
                                  <strong>Country:</strong> {nodes[0].location.country}
                                </p>
                              )}
                              {nodes[0].location.city && (
                                <p>
                                  <strong>City:</strong> {nodes[0].location.city}
                                </p>
                              )}
                              {nodes[0].location.zone && (
                                <p>
                                  <strong>Zone:</strong> {nodes[0].location.zone}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-default-500 mt-2">
                              Using location from existing nodes
                            </p>
                          </div>
                        )}

                        {/* Labels Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium">
                              Labels
                            </label>
                            <Button size="sm" variant="flat" onPress={addLabel}>
                              Add Label
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {newNodeForm.labels.map((label, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  className="flex-1"
                                  placeholder="Key"
                                  value={label.key}
                                  onChange={(e) =>
                                    updateLabel(index, "key", e.target.value)
                                  }
                                />
                                <Input
                                  className="flex-1"
                                  placeholder="Value (optional)"
                                  value={label.value}
                                  onChange={(e) =>
                                    updateLabel(index, "value", e.target.value)
                                  }
                                />
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  variant="light"
                                  onPress={() => removeLabel(index)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))}
                            {newNodeForm.labels.length === 0 && (
                              <p className="text-sm text-default-500 text-center py-4">
                                No labels added. Click "Add Label" to add one.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Taints Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium">
                              Taints
                            </label>
                            <Button size="sm" variant="flat" onPress={addTaint}>
                              Add Taint
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {newNodeForm.taints.map((taint, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  className="flex-1"
                                  placeholder="Key"
                                  value={taint.key}
                                  onChange={(e) =>
                                    updateTaint(index, "key", e.target.value)
                                  }
                                />
                                <Input
                                  className="flex-1"
                                  placeholder="Value (optional)"
                                  value={taint.value}
                                  onChange={(e) =>
                                    updateTaint(index, "value", e.target.value)
                                  }
                                />
                                <Select
                                  className="w-40"
                                  selectedKeys={[taint.effect]}
                                  onSelectionChange={(keys) => {
                                    updateTaint(
                                      index,
                                      "effect",
                                      Array.from(keys)[0] as
                                        | "NoSchedule"
                                        | "PreferNoSchedule"
                                        | "NoExecute",
                                    );
                                  }}
                                >
                                  <SelectItem key="NoSchedule">
                                    NoSchedule
                                  </SelectItem>
                                  <SelectItem key="PreferNoSchedule">
                                    PreferNoSchedule
                                  </SelectItem>
                                  <SelectItem key="NoExecute">
                                    NoExecute
                                  </SelectItem>
                                </Select>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  variant="light"
                                  onPress={() => removeTaint(index)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))}
                            {newNodeForm.taints.length === 0 && (
                              <p className="text-sm text-default-500 text-center py-4">
                                No taints added. Click "Add Taint" to add one.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3/4: Review & Install */}
                  {((newNodeForm.target === "host" && currentStep === 3) ||
                    (newNodeForm.target === "remote" && currentStep === 4)) && (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        {/* Summary Text */}
                        <Card className="subnet-card">
                          <CardBody className="p-6">
                            <p className="text-base leading-relaxed text-default-700">
                              You are about to install k3s on{" "}
                              <span className="font-semibold text-primary">
                                {newNodeForm.target === "host" ? "the local host" : `remote server ${newNodeForm.serverIP || ""}`}
                              </span>
                              {" "}as a{" "}
                              <span className="font-semibold text-primary">
                                {newNodeForm.roles.join(" and ")}
                              </span>
                              {" "}node named{" "}
                              <span className="font-semibold text-primary">
                                {newNodeForm.name || "N/A"}
                              </span>
                              {newNodeForm.description && (
                                <>
                                  {" "}({newNodeForm.description})
                                </>
                              )}
                              .{" "}
                              {nodes.length === 0 ? (
                                <>
                                  This will create a new cluster{" "}
                                  <span className="font-semibold text-primary">
                                    {newNodeForm.clusterName || "N/A"}
                                  </span>
                                  {newNodeForm.clusterId && (
                                    <>
                                      {" "}(ID: <span className="font-semibold text-primary">{newNodeForm.clusterId}</span>)
                                    </>
                                  )}
                                  {" "}located in{" "}
                                  <span className="font-semibold text-primary">
                                    {newNodeForm.location.city || "N/A"}
                                    {newNodeForm.location.country && `, ${newNodeForm.location.country}`}
                                    {newNodeForm.location.zone && ` (${newNodeForm.location.zone})`}
                                  </span>
                                  .
                                </>
                              ) : (
                                <>
                                  This node will join the existing cluster{" "}
                                  <span className="font-semibold text-primary">
                                    {nodes[0].clusterName || newNodeForm.clusterName || "N/A"}
                                  </span>
                                  {" "}in{" "}
                                  <span className="font-semibold text-primary">
                                    {nodes[0].location.city || newNodeForm.location.city || "N/A"}
                                    {(nodes[0].location.country || newNodeForm.location.country) && `, ${nodes[0].location.country || newNodeForm.location.country}`}
                                    {(nodes[0].location.zone || newNodeForm.location.zone) && ` (${nodes[0].location.zone || newNodeForm.location.zone})`}
                                  </span>
                                  .
                                </>
                              )}
                              {newNodeForm.target === "remote" && (
                                <>
                                  {" "}The installation will be performed via SSH using{" "}
                                  <span className="font-semibold text-primary">
                                    {newNodeForm.sshUser || "root"}
                                  </span>
                                  {" "}authentication.
                                </>
                              )}
                              {newNodeForm.roles.includes("agent") && (
                                <>
                                  {" "}The node will automatically join the cluster as an agent.
                                </>
                              )}
                              {newNodeForm.labels.length > 0 && (
                                <>
                                  {" "}Labels:{" "}
                                  {newNodeForm.labels.map((label, index) => (
                                    <span key={index}>
                                      <span className="font-semibold text-primary">
                                        {label.key}
                                        {label.value && `=${label.value}`}
                                      </span>
                                      {index < newNodeForm.labels.length - 1 && ", "}
                                    </span>
                                  ))}
                                  .
                                </>
                              )}
                              {newNodeForm.taints.length > 0 && (
                                <>
                                  {" "}Taints:{" "}
                                  {newNodeForm.taints.map((taint, index) => (
                                    <span key={index}>
                                      <span className="font-semibold text-warning">
                                        {taint.key}
                                        {taint.value && `=${taint.value}`}: {taint.effect}
                                      </span>
                                      {index < newNodeForm.taints.length - 1 && ", "}
                                    </span>
                                  ))}
                                  .
                                </>
                              )}
                            </p>
                          </CardBody>
                        </Card>

                        {/* Installation Status */}
                        {installationStatus.status !== "idle" && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Activity
                                className={
                                  installationStatus.status === "success"
                                    ? "text-success"
                                    : installationStatus.status === "error"
                                      ? "text-danger"
                                      : "text-primary"
                                }
                                size={24}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  {installationStatus.step}
                                </h4>
                                <p className="text-sm text-default-600">
                                  {installationStatus.message}
                                </p>
                              </div>
                              {installationStatus.status === "success" && (
                                <CheckCircle
                                  className="text-success"
                                  size={24}
                                />
                              )}
                              {installationStatus.status === "error" && (
                                <XCircle className="text-danger" size={24} />
                              )}
                            </div>

                            <Card className="subnet-card">
                              <CardHeader>
                                <h4 className="font-medium">
                                  Installation Logs
                                </h4>
                              </CardHeader>
                              <CardBody>
                                <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
                                  {installationStatus.logs.map((log, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-2 rounded ${
                                        log.includes("✓") || log.includes("✅")
                                          ? "bg-success-50 text-success-700"
                                          : log.includes("✗") ||
                                              log.includes("❌")
                                            ? "bg-danger-50 text-danger-700"
                                            : "bg-default-50 text-default-700"
                                      }`}
                                    >
                                      {log}
                                    </div>
                                  ))}
                                </div>
                              </CardBody>
                            </Card>

                            {installationStatus.status === "success" && (
                              <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle
                                    className="text-success"
                                    size={20}
                                  />
                                  <span className="font-semibold text-success-700">
                                    Installation Complete!
                                  </span>
                                </div>
                                <p className="text-sm text-success-600">
                                  k3s has been successfully installed and
                                  configured on the server. The node will be
                                  added to your cluster management.
                                </p>
                              </div>
                            )}

                            {installationStatus.status === "error" && (
                              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <XCircle className="text-danger" size={20} />
                                  <span className="font-semibold text-danger-700">
                                    Installation Failed
                                  </span>
                                </div>
                                <p className="text-sm text-danger-600">
                                  Please check the logs above and try again.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                {currentStep > 1 && (
                  <Button
                    variant="flat"
                    startContent={<ChevronLeft size={16} />}
                    onPress={prevStep}
                  >
                    Previous
                  </Button>
                )}
                {currentStep < totalSteps && installationStatus.status === "idle" && (
                  <Button
                    color="primary"
                    endContent={<ChevronRight size={16} />}
                    onPress={nextStep}
                  >
                    Next
                  </Button>
                )}
                {currentStep === totalSteps && installationStatus.status === "idle" && (
                  <Button
                    color="primary"
                    startContent={<Server size={16} />}
                    onPress={handleInstallK3s}
                  >
                    Install k3s
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Node Modal */}
      <Modal
        isOpen={isEditOpen}
        scrollBehavior="inside"
        size="4xl"
        onClose={onEditClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Node: {selectedNode?.name || ""}</ModalHeader>
              <ModalBody>
                {selectedNode && (
                  <div className="space-y-6">
                    <Tabs aria-label="Edit node configuration">
                      <Tab key="basic" title="Basic Info">
                        <div className="space-y-4 pt-4">
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-default-600">
                              <strong>Node ID:</strong> {selectedNode.id}
                            </p>
                            {selectedNode.nodeName && (
                              <p className="text-sm text-default-600 mt-1">
                                <strong>Kubernetes Node:</strong>{" "}
                                <span className="font-mono text-xs">
                                  {selectedNode.nodeName}
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Node Name <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="worker-node-01"
                                value={editNodeForm.name}
                                onChange={(e) =>
                                  updateEditNodeForm("name", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Node Roles <span className="text-danger">*</span>
                              </label>
                              <Select
                                selectionMode="multiple"
                                selectedKeys={new Set(editNodeForm.roles)}
                                onSelectionChange={(keys) => {
                                  const selectedRoles = Array.from(keys) as Array<
                                    "server" | "agent"
                                  >;
                                  updateEditNodeForm("roles", selectedRoles);
                                }}
                              >
                                <SelectItem key="server">Server (Control Plane)</SelectItem>
                                <SelectItem key="agent">Agent (Worker)</SelectItem>
                              </Select>
                              <p className="text-xs text-default-500 mt-1">
                                k3s has two node types: Server (control-plane) and Agent (worker)
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Description
                            </label>
                            <textarea
                              className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Node description..."
                              value={editNodeForm.description}
                              onChange={(e) =>
                                updateEditNodeForm(
                                  "description",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Cluster Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="Production Cluster"
                                value={editNodeForm.clusterName}
                                onChange={(e) =>
                                  updateEditNodeForm(
                                    "clusterName",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Cluster ID
                              </label>
                              <Input
                                placeholder="cluster-prod-01"
                                value={editNodeForm.clusterId}
                                onChange={(e) =>
                                  updateEditNodeForm(
                                    "clusterId",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Status
                            </label>
                            <Select
                              selectedKeys={[editNodeForm.status]}
                              onSelectionChange={(keys) => {
                                updateEditNodeForm(
                                  "status",
                                  Array.from(keys)[0] as Node["status"],
                                );
                              }}
                            >
                              <SelectItem key="active">Active</SelectItem>
                              <SelectItem key="inactive">Inactive</SelectItem>
                              <SelectItem key="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem key="offline">Offline</SelectItem>
                            </Select>
                          </div>
                        </div>
                      </Tab>

                      <Tab key="location" title="Location">
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Country
                              </label>
                              <Input
                                placeholder="USA"
                                value={editNodeForm.location.country}
                                onChange={(e) =>
                                  updateEditNodeForm(
                                    "location.country",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Region
                              </label>
                              <Input
                                placeholder="North America"
                                value={editNodeForm.location.region}
                                onChange={(e) =>
                                  updateEditNodeForm(
                                    "location.region",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                City
                              </label>
                              <Input
                                placeholder="San Francisco"
                                value={editNodeForm.location.city}
                                onChange={(e) =>
                                  updateEditNodeForm(
                                    "location.city",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Zone
                              </label>
                              <Input
                                placeholder="us-west-2a"
                                value={editNodeForm.location.zone}
                                onChange={(e) =>
                                  updateEditNodeForm(
                                    "location.zone",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab key="labels" title="Labels & Taints">
                        <div className="space-y-6 pt-4">
                          {/* Labels Section */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-medium">
                                Labels
                              </label>
                              <Button
                                size="sm"
                                variant="flat"
                                onPress={addEditLabel}
                              >
                                Add Label
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {editNodeForm.labels.map((label, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    className="flex-1"
                                    placeholder="Key"
                                    value={label.key}
                                    onChange={(e) =>
                                      updateEditLabel(
                                        index,
                                        "key",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Input
                                    className="flex-1"
                                    placeholder="Value (optional)"
                                    value={label.value}
                                    onChange={(e) =>
                                      updateEditLabel(
                                        index,
                                        "value",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Button
                                    isIconOnly
                                    color="danger"
                                    size="sm"
                                    variant="light"
                                    onPress={() => removeEditLabel(index)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              ))}
                              {editNodeForm.labels.length === 0 && (
                                <p className="text-sm text-default-500 text-center py-4">
                                  No labels. Click "Add Label" to add one.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Taints Section */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-medium">
                                Taints
                              </label>
                              <Button
                                size="sm"
                                variant="flat"
                                onPress={addEditTaint}
                              >
                                Add Taint
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {editNodeForm.taints.map((taint, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    className="flex-1"
                                    placeholder="Key"
                                    value={taint.key}
                                    onChange={(e) =>
                                      updateEditTaint(
                                        index,
                                        "key",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Input
                                    className="flex-1"
                                    placeholder="Value (optional)"
                                    value={taint.value}
                                    onChange={(e) =>
                                      updateEditTaint(
                                        index,
                                        "value",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Select
                                    className="w-40"
                                    selectedKeys={[taint.effect]}
                                    onSelectionChange={(keys) => {
                                      updateEditTaint(
                                        index,
                                        "effect",
                                        Array.from(keys)[0] as
                                          | "NoSchedule"
                                          | "PreferNoSchedule"
                                          | "NoExecute",
                                      );
                                    }}
                                  >
                                    <SelectItem key="NoSchedule">
                                      NoSchedule
                                    </SelectItem>
                                    <SelectItem key="PreferNoSchedule">
                                      PreferNoSchedule
                                    </SelectItem>
                                    <SelectItem key="NoExecute">
                                      NoExecute
                                    </SelectItem>
                                  </Select>
                                  <Button
                                    isIconOnly
                                    color="danger"
                                    size="sm"
                                    variant="light"
                                    onPress={() => removeEditTaint(index)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              ))}
                              {editNodeForm.taints.length === 0 && (
                                <p className="text-sm text-default-500 text-center py-4">
                                  No taints. Click "Add Taint" to add one.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab key="info" title="Node Info">
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">
                                Kubernetes Version
                              </h4>
                              <p className="text-default-600">
                                {selectedNode.kubernetesVersion || "N/A"}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Container Runtime
                              </h4>
                              <p className="text-default-600">
                                {selectedNode.containerRuntime || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">OS Image</h4>
                              <p className="text-default-600">
                                {selectedNode.osImage || "N/A"}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Kernel Version
                              </h4>
                              <p className="text-default-600 font-mono text-sm">
                                {selectedNode.kernelVersion || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                            <div>
                              <h4 className="font-semibold mb-2">CPU Cores</h4>
                              <p className="text-2xl font-bold text-primary">
                                {selectedNode.specs.cpu}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Memory</h4>
                              <p className="text-2xl font-bold text-secondary">
                                {selectedNode.specs.memory} GB
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Storage</h4>
                              <p className="text-2xl font-bold text-warning">
                                {selectedNode.specs.storage} GB
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-2">Usage</h4>
                            {selectedNode.usage && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">CPU</span>
                                    <span className="text-sm font-semibold">
                                      {selectedNode.usage.cpu}%
                                    </span>
                                  </div>
                                  <Progress
                                    className="h-2"
                                    color="primary"
                                    value={selectedNode.usage.cpu}
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Memory</span>
                                    <span className="text-sm font-semibold">
                                      {selectedNode.usage.memory}%
                                    </span>
                                  </div>
                                  <Progress
                                    className="h-2"
                                    color="secondary"
                                    value={selectedNode.usage.memory}
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Storage</span>
                                    <span className="text-sm font-semibold">
                                      {selectedNode.usage.storage}%
                                    </span>
                                  </div>
                                  <Progress
                                    className="h-2"
                                    color="warning"
                                    value={selectedNode.usage.storage}
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Pods</span>
                                    <span className="text-sm font-semibold">
                                      {selectedNode.usage.pods}%
                                    </span>
                                  </div>
                                  <Progress
                                    className="h-2"
                                    color="success"
                                    value={selectedNode.usage.pods}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdateNode}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Node Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        scrollBehavior="inside"
        size="4xl"
        onClose={onDetailClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{selectedNode?.name || "Node Details"}</ModalHeader>
              <ModalBody>
                {selectedNode && (
                  <div className="space-y-6">
                    <Tabs aria-label="Node details">
                      <Tab key="overview" title="Overview">
                        <div className="space-y-4 pt-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-default-600">
                              {selectedNode.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Cluster</h4>
                              <p className="text-default-600">
                                {selectedNode.clusterName || "N/A"}
                              </p>
                              {selectedNode.clusterId && (
                                <p className="text-xs text-default-500 font-mono">
                                  {selectedNode.clusterId}
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Node Name</h4>
                              <p className="text-default-600 font-mono text-sm">
                                {selectedNode.nodeName || selectedNode.name}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Role</h4>
                              <Chip color="secondary" size="sm" variant="flat">
                                {selectedNode.role || "worker"}
                              </Chip>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Status</h4>
                              <Chip
                                color={getStatusColor(selectedNode.status)}
                                size="sm"
                                startContent={getStatusIcon(
                                  selectedNode.status,
                                )}
                                variant="flat"
                              >
                                {selectedNode.status}
                              </Chip>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Location</h4>
                              <p className="text-default-600">
                                {selectedNode.location.city},{" "}
                                {selectedNode.location.region},{" "}
                                {selectedNode.location.country}
                              </p>
                              {selectedNode.location.zone && (
                                <p className="text-xs text-default-500">
                                  Zone: {selectedNode.location.zone}
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Uptime</h4>
                              <div className="flex items-center gap-2">
                                <Progress
                                  className="flex-1"
                                  color="success"
                                  value={selectedNode.uptime}
                                />
                                <span className="text-sm font-semibold">
                                  {selectedNode.uptime}%
                                </span>
                              </div>
                            </div>
                          </div>
                          {selectedNode.kubernetesVersion && (
                            <div>
                              <h4 className="font-semibold mb-2">
                                Kubernetes Info
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-default-600">
                                    Version:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {selectedNode.kubernetesVersion}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-default-600">
                                    Kubelet:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {selectedNode.kubeletVersion}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-default-600">
                                    Container Runtime:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {selectedNode.containerRuntime}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-default-600">
                                    OS Image:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {selectedNode.osImage}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-default-600">
                                    Kernel:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {selectedNode.kernelVersion}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedNode.labels &&
                            Object.keys(selectedNode.labels).length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Labels</h4>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(selectedNode.labels).map(
                                    ([key, value]) => (
                                      <Chip
                                        key={key}
                                        className="font-mono text-xs"
                                        size="sm"
                                        variant="flat"
                                      >
                                        {key}
                                        {value && `: ${value}`}
                                      </Chip>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          {selectedNode.taints &&
                            selectedNode.taints.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Taints</h4>
                                <div className="space-y-2">
                                  {selectedNode.taints.map((taint, index) => (
                                    <div
                                      key={index}
                                      className="p-2 rounded-lg bg-warning-50 border border-warning-200"
                                    >
                                      <div className="text-sm font-semibold">
                                        {taint.key}
                                        {taint.value && `: ${taint.value}`}
                                      </div>
                                      <div className="text-xs text-default-600">
                                        Effect: {taint.effect}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </Tab>
                      <Tab key="specs" title="Specifications">
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="p-4 rounded-lg bg-primary/5">
                            <div className="text-sm text-default-600 mb-1">
                              CPU Cores
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {selectedNode.specs.cpu}
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/5">
                            <div className="text-sm text-default-600 mb-1">
                              Memory
                            </div>
                            <div className="text-2xl font-bold text-secondary">
                              {selectedNode.specs.memory} GB
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-warning-100">
                            <div className="text-sm text-default-600 mb-1">
                              Storage
                            </div>
                            <div className="text-2xl font-bold text-warning-600">
                              {selectedNode.specs.storage} GB
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-success-100">
                            <div className="text-sm text-default-600 mb-1">
                              Bandwidth
                            </div>
                            <div className="text-2xl font-bold text-success-600">
                              {selectedNode.specs.bandwidth} Mbps
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab key="pods" title="Pods">
                        <div className="pt-4 space-y-4">
                          {selectedNode.pods ? (
                            <>
                              <div className="grid grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-success-100">
                                  <div className="text-2xl font-bold text-success-600">
                                    {selectedNode.pods.running}
                                  </div>
                                  <div className="text-sm text-default-600">
                                    Running
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-warning-100">
                                  <div className="text-2xl font-bold text-warning-600">
                                    {selectedNode.pods.pending}
                                  </div>
                                  <div className="text-sm text-default-600">
                                    Pending
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-danger-100">
                                  <div className="text-2xl font-bold text-danger-600">
                                    {selectedNode.pods.failed}
                                  </div>
                                  <div className="text-sm text-default-600">
                                    Failed
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg bg-default-100">
                                  <div className="text-2xl font-bold text-default-600">
                                    {selectedNode.pods.succeeded}
                                  </div>
                                  <div className="text-sm text-default-600">
                                    Succeeded
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Pod Capacity
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    className="flex-1"
                                    color="primary"
                                    value={
                                      (selectedNode.pods.total /
                                        selectedNode.pods.capacity) *
                                      100
                                    }
                                  />
                                  <span className="text-sm font-semibold">
                                    {selectedNode.pods.total}/
                                    {selectedNode.pods.capacity}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-default-600 text-center py-8">
                              No pod information available
                            </p>
                          )}
                        </div>
                      </Tab>
                      <Tab key="metrics" title="Metrics">
                        <div className="pt-4 space-y-4">
                          {selectedNode.usage ? (
                            <>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  CPU Usage
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    className="flex-1"
                                    color="primary"
                                    value={selectedNode.usage.cpu}
                                  />
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.cpu}%
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Memory Usage
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    className="flex-1"
                                    color="secondary"
                                    value={selectedNode.usage.memory}
                                  />
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.memory}%
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Storage Usage
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    className="flex-1"
                                    color="warning"
                                    value={selectedNode.usage.storage}
                                  />
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.storage}%
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-default-600 text-center py-8">
                              Real-time metrics and monitoring charts will be
                              displayed here
                            </p>
                          )}
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Node</ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedNode?.name}</span>?
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
