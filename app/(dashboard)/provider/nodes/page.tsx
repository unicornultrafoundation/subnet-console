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
    role: "worker" as "master" | "worker" | "control-plane",

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
  }>({
    step: "",
    status: "idle",
    message: "",
    logs: [],
  });

  const onAddOpen = () => setIsAddOpen(true);
  const onAddClose = () => setIsAddOpen(false);
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
      role: "worker",
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

  const handleInstallK3s = async () => {
    // Validation
    if (
      !newNodeForm.serverIP ||
      !newNodeForm.name ||
      !newNodeForm.clusterName
    ) {
      alert(
        "Please fill in required fields: Server IP, Node Name, and Cluster Name",
      );

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

    if (
      newNodeForm.installMode === "agent" &&
      (!newNodeForm.serverURL || !newNodeForm.token)
    ) {
      alert("For agent nodes, please provide Server URL and Token");

      return;
    }

    setInstallationStatus({
      step: "Installing k3s",
      status: "installing",
      message: "Starting k3s installation...",
      logs: [
        `Connecting to ${newNodeForm.serverIP}...`,
        "Checking system requirements...",
      ],
    });

    // Simulate installation steps
    const steps = [
      {
        delay: 1000,
        message: "✓ System requirements checked",
        step: "installing",
      },
      { delay: 2000, message: "Downloading k3s...", step: "installing" },
      { delay: 3000, message: "✓ k3s downloaded", step: "installing" },
      { delay: 2000, message: "Installing k3s...", step: "installing" },
      {
        delay: 3000,
        message: "✓ k3s installed successfully",
        step: "configuring",
      },
      { delay: 2000, message: "Configuring k3s node...", step: "configuring" },
      { delay: 2000, message: "✓ Node configured", step: "verifying" },
      { delay: 2000, message: "Verifying installation...", step: "verifying" },
      { delay: 2000, message: "✓ k3s is running", step: "success" },
      {
        delay: 1000,
        message: "✓ Node registered successfully",
        step: "success",
      },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setInstallationStatus((prev) => ({
        ...prev,
        status: step.step as any,
        logs: [...prev.logs, step.message],
      }));
    }

    // After successful installation, create node entry
    const newNode: Node = {
      id: `node-${Date.now()}`,
      providerId: "provider-1",
      name: newNodeForm.name,
      nodeName: newNodeForm.serverIP,
      description:
        newNodeForm.description ||
        `k3s ${newNodeForm.role} node at ${newNodeForm.serverIP}`,
      clusterId: newNodeForm.clusterId || `cluster-${Date.now()}`,
      clusterName: newNodeForm.clusterName,
      role: newNodeForm.role,
      status: "active",
      kubernetesVersion: "v1.28.0+k3s1", // k3s version format
      containerRuntime: "containerd",
      osImage: "Detected from server",
      kernelVersion: "Auto-detected",
      kubeletVersion: "v1.28.0+k3s1",
      labels: newNodeForm.labels.reduce(
        (acc, label) => ({ ...acc, [label.key]: label.value }),
        {},
      ),
      taints: newNodeForm.taints,
      specs: {
        cpu: parseInt(newNodeForm.specs.cpu) || 0,
        memory: parseInt(newNodeForm.specs.memory) || 0,
        storage: parseInt(newNodeForm.specs.storage) || 0,
        bandwidth: parseInt(newNodeForm.specs.bandwidth) || 0,
        pods: parseInt(newNodeForm.specs.pods) || 110,
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
        capacity: parseInt(newNodeForm.specs.pods) || 110,
      },
      location: newNodeForm.location,
      uptime: 100,
      reputation: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addNode(newNode);

    setTimeout(() => {
      onAddClose();
      setInstallationStatus({
        step: "",
        status: "idle",
        message: "",
        logs: [],
      });
    }, 2000);
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
    role: "worker" as "master" | "worker" | "control-plane",
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
      role: node.role || "worker",
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
      role: editNodeForm.role,
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
                Add New k3s Node - Automated Installation
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  <Tabs aria-label="Node configuration">
                    <Tab key="connection" title="Server Connection">
                      <div className="space-y-4 pt-4">
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
                    </Tab>

                    <Tab key="config" title="Node Config">
                      <div className="space-y-4 pt-4">
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
                              Node Role <span className="text-danger">*</span>
                            </label>
                            <Select
                              selectedKeys={[newNodeForm.role]}
                              onSelectionChange={(keys) => {
                                const role = Array.from(
                                  keys,
                                )[0] as Node["role"];

                                updateNewNodeForm("role", role);
                                // Auto-set install mode based on role
                                updateNewNodeForm(
                                  "installMode",
                                  role === "worker" ? "agent" : "server",
                                );
                              }}
                            >
                              <SelectItem key="worker">Worker</SelectItem>
                              <SelectItem key="master">
                                Master (Server)
                              </SelectItem>
                              <SelectItem key="control-plane">
                                Control Plane
                              </SelectItem>
                            </Select>
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
                            Zone (Availability Zone)
                          </label>
                          <Input
                            placeholder="us-west-2a"
                            value={newNodeForm.location.zone}
                            onChange={(e) =>
                              updateNewNodeForm("location.zone", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </Tab>

                    <Tab key="k3s" title="k3s Settings">
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              k3s Version
                            </label>
                            <Select
                              selectedKeys={[newNodeForm.k3sVersion]}
                              onSelectionChange={(keys) => {
                                updateNewNodeForm(
                                  "k3sVersion",
                                  Array.from(keys)[0] as string,
                                );
                              }}
                            >
                              <SelectItem key="latest">Latest</SelectItem>
                              <SelectItem key="v1.28.6+k3s1">
                                v1.28.6+k3s1
                              </SelectItem>
                              <SelectItem key="v1.27.10+k3s1">
                                v1.27.10+k3s1
                              </SelectItem>
                              <SelectItem key="v1.26.13+k3s1">
                                v1.26.13+k3s1
                              </SelectItem>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Install Mode
                            </label>
                            <Select
                              isDisabled={newNodeForm.role !== "worker"}
                              selectedKeys={[newNodeForm.installMode]}
                              onSelectionChange={(keys) => {
                                updateNewNodeForm(
                                  "installMode",
                                  Array.from(keys)[0] as "server" | "agent",
                                );
                              }}
                            >
                              <SelectItem key="server">
                                Server (Standalone)
                              </SelectItem>
                              <SelectItem key="agent">
                                Agent (Join Cluster)
                              </SelectItem>
                            </Select>
                            {newNodeForm.role === "worker" && (
                              <p className="text-xs text-default-500 mt-1">
                                Worker nodes must be agents
                              </p>
                            )}
                          </div>
                        </div>

                        {newNodeForm.installMode === "agent" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                k3s Server URL{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="https://192.168.1.10:6443"
                                value={newNodeForm.serverURL}
                                onChange={(e) =>
                                  updateNewNodeForm("serverURL", e.target.value)
                                }
                              />
                              <p className="text-xs text-default-500 mt-1">
                                URL of the k3s server to join
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Node Token{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="K10c98e5f6e5f..."
                                type="password"
                                value={newNodeForm.token}
                                onChange={(e) =>
                                  updateNewNodeForm("token", e.target.value)
                                }
                              />
                              <p className="text-xs text-default-500 mt-1">
                                Token from k3s server (usually in
                                /var/lib/rancher/k3s/server/node-token)
                              </p>
                            </div>
                          </>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Flannel Backend
                          </label>
                          <Select
                            selectedKeys={[newNodeForm.flannelBackend]}
                            onSelectionChange={(keys) => {
                              updateNewNodeForm(
                                "flannelBackend",
                                Array.from(keys)[0] as
                                  | "vxlan"
                                  | "host-gw"
                                  | "wireguard",
                              );
                            }}
                          >
                            <SelectItem key="vxlan">VXLAN (Default)</SelectItem>
                            <SelectItem key="host-gw">host-gw</SelectItem>
                            <SelectItem key="wireguard">WireGuard</SelectItem>
                          </Select>
                        </div>
                      </div>
                    </Tab>

                    <Tab key="advanced" title="Labels & Taints">
                      <div className="space-y-6 pt-4">
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
                    </Tab>

                    <Tab key="install" title="Installation">
                      <div className="space-y-4 pt-4">
                        {installationStatus.status === "idle" ? (
                          <div className="text-center py-8">
                            <Server
                              className="mx-auto mb-4 text-default-400"
                              size={48}
                            />
                            <p className="text-default-600 mb-4">
                              Configure your node settings in the previous tabs,
                              then click "Install k3s" to begin automated
                              installation.
                            </p>
                            <Button
                              color="primary"
                              size="lg"
                              startContent={<Plus size={20} />}
                              onPress={handleInstallK3s}
                            >
                              Install k3s on Server
                            </Button>
                          </div>
                        ) : (
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
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                {installationStatus.status === "idle" && (
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
                                Node Role <span className="text-danger">*</span>
                              </label>
                              <Select
                                selectedKeys={[editNodeForm.role]}
                                onSelectionChange={(keys) => {
                                  updateEditNodeForm(
                                    "role",
                                    Array.from(keys)[0] as Node["role"],
                                  );
                                }}
                              >
                                <SelectItem key="worker">Worker</SelectItem>
                                <SelectItem key="master">Master</SelectItem>
                                <SelectItem key="control-plane">
                                  Control Plane
                                </SelectItem>
                              </Select>
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
