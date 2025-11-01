"use client";

import { useState } from "react";
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
  Play,
  Square,
  RefreshCw,
  Eye,
  Activity,
  ArrowLeft,
  Database,
  HardDrive,
  TrendingUp,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface HostingInstance {
  id: string;
  name: string;
  serviceType: "web" | "api" | "database" | "cache" | "other";
  status: "running" | "stopped" | "starting" | "stopping" | "error";
  image: string;
  version: string;
  domain?: string;
  ports: Array<{
    containerPort: number;
    hostPort: number;
    protocol: "tcp" | "udp";
  }>;
  resources: {
    cpu: number;
    memory: number; // GB
    storage: number; // GB
  };
  user: {
    address: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
  uptime: number; // percentage
}

export default function ProviderHostingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [selectedInstance, setSelectedInstance] =
    useState<HostingInstance | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Mock hosting instances
  const [instances, setInstances] = useState<HostingInstance[]>([
    {
      id: "host-1",
      name: "web-server-01",
      serviceType: "web",
      status: "running",
      image: "nginx:latest",
      version: "1.25.2",
      domain: "web-server-01.subnet.example.com",
      ports: [
        { containerPort: 80, hostPort: 8080, protocol: "tcp" },
        { containerPort: 443, hostPort: 8443, protocol: "tcp" },
      ],
      resources: {
        cpu: 2,
        memory: 4,
        storage: 20,
      },
      user: {
        address: "0x1234...5678",
        name: "Alice",
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      uptime: 99.5,
    },
    {
      id: "host-2",
      name: "api-backend-01",
      serviceType: "api",
      status: "running",
      image: "node:20-alpine",
      version: "20.10.0",
      domain: "api-backend-01.subnet.example.com",
      ports: [{ containerPort: 3000, hostPort: 3001, protocol: "tcp" }],
      resources: {
        cpu: 4,
        memory: 8,
        storage: 50,
      },
      user: {
        address: "0xabcd...ef01",
      },
      createdAt: "2024-01-18T08:00:00Z",
      updatedAt: "2024-01-20T15:00:00Z",
      uptime: 98.2,
    },
    {
      id: "host-3",
      name: "redis-cache",
      serviceType: "cache",
      status: "stopped",
      image: "redis:7-alpine",
      version: "7.2.3",
      ports: [{ containerPort: 6379, hostPort: 6379, protocol: "tcp" }],
      resources: {
        cpu: 1,
        memory: 2,
        storage: 10,
      },
      user: {
        address: "0x5678...9012",
      },
      createdAt: "2024-01-10T12:00:00Z",
      updatedAt: "2024-01-19T10:00:00Z",
      uptime: 0,
    },
  ]);

  // Calculate statistics
  const stats = {
    total: instances.length,
    running: instances.filter((i) => i.status === "running").length,
    stopped: instances.filter((i) => i.status === "stopped").length,
    totalCpu: instances.reduce((sum, i) => sum + i.resources.cpu, 0),
    totalMemory: instances.reduce((sum, i) => sum + i.resources.memory, 0),
    totalStorage: instances.reduce((sum, i) => sum + i.resources.storage, 0),
    avgUptime:
      instances.length > 0
        ? instances.reduce((sum, i) => sum + i.uptime, 0) / instances.length
        : 0,
  };

  // Filter instances
  const filteredInstances = instances.filter((instance) => {
    const matchesSearch =
      instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.user.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || instance.status === statusFilter;
    const matchesType =
      serviceTypeFilter === "all" || instance.serviceType === serviceTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (instance: HostingInstance) => {
    setSelectedInstance(instance);
    setIsDetailOpen(true);
  };

  const handleStart = (id: string) => {
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, status: "starting" as const } : inst,
      ),
    );
    // Simulate start
    setTimeout(() => {
      setInstances((prev) =>
        prev.map((inst) =>
          inst.id === id
            ? { ...inst, status: "running" as const, uptime: 100 }
            : inst,
        ),
      );
    }, 2000);
  };

  const handleStop = (id: string) => {
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, status: "stopping" as const } : inst,
      ),
    );
    // Simulate stop
    setTimeout(() => {
      setInstances((prev) =>
        prev.map((inst) =>
          inst.id === id
            ? { ...inst, status: "stopped" as const, uptime: 0 }
            : inst,
        ),
      );
    }, 2000);
  };

  const handleRestart = (id: string) => {
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, status: "starting" as const } : inst,
      ),
    );
    // Simulate restart
    setTimeout(() => {
      setInstances((prev) =>
        prev.map((inst) =>
          inst.id === id ? { ...inst, status: "running" as const } : inst,
        ),
      );
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setInstances((prev) => prev.filter((inst) => inst.id !== id));
    setIsDeleteOpen(false);
    setSelectedInstance(null);
  };

  const getStatusColor = (status: HostingInstance["status"]) => {
    switch (status) {
      case "running":
        return "success";
      case "stopped":
        return "default";
      case "starting":
      case "stopping":
        return "warning";
      case "error":
        return "danger";
      default:
        return "default";
    }
  };

  const getServiceTypeLabel = (type: HostingInstance["serviceType"]) => {
    switch (type) {
      case "web":
        return "Web";
      case "api":
        return "API";
      case "database":
        return "Database";
      case "cache":
        return "Cache";
      case "other":
        return "Other";
      default:
        return type;
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Server className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-dark-on-white">
                  Hosting Management
                </h1>
                <p className="text-lg text-dark-on-white-muted">
                  Manage hosted services and instances
                </p>
              </div>
            </div>
            <Button
              color="primary"
              size="lg"
              startContent={<Plus size={20} />}
              onPress={() => router.push("/deploy")}
            >
              Deploy Service
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">
                    Total Instances
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Server className="text-primary" size={24} />
              </div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">Running</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.running}
                  </p>
                </div>
                <Activity className="text-success" size={24} />
              </div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">
                    Resources Used
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalCpu} CPU / {stats.totalMemory} GB
                  </p>
                </div>
                <TrendingUp className="text-primary" size={24} />
              </div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600 mb-1">Avg. Uptime</p>
                  <p className="text-2xl font-bold">
                    {stats.avgUptime.toFixed(1)}%
                  </p>
                </div>
                <Activity className="text-secondary" size={24} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="subnet-card mb-6">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="flex-1"
                placeholder="Search by name or user address..."
                size="lg"
                startContent={<Search className="text-default-400" size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                className="w-[160px]"
                placeholder="All Status"
                selectedKeys={statusFilter ? [statusFilter] : []}
                size="md"
                onSelectionChange={(keys) =>
                  setStatusFilter(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Status</SelectItem>
                <SelectItem key="running">Running</SelectItem>
                <SelectItem key="stopped">Stopped</SelectItem>
                <SelectItem key="starting">Starting</SelectItem>
                <SelectItem key="stopping">Stopping</SelectItem>
                <SelectItem key="error">Error</SelectItem>
              </Select>
              <Select
                className="w-[160px]"
                placeholder="All Types"
                selectedKeys={serviceTypeFilter ? [serviceTypeFilter] : []}
                size="md"
                onSelectionChange={(keys) =>
                  setServiceTypeFilter(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Types</SelectItem>
                <SelectItem key="web">Web</SelectItem>
                <SelectItem key="api">API</SelectItem>
                <SelectItem key="database">Database</SelectItem>
                <SelectItem key="cache">Cache</SelectItem>
                <SelectItem key="other">Other</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Instances Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInstances.map((instance) => (
            <Card key={instance.id} className="subnet-card">
              <CardHeader className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{instance.name}</h3>
                    <Chip
                      color={getStatusColor(instance.status)}
                      size="sm"
                      variant="flat"
                    >
                      {instance.status.charAt(0).toUpperCase() +
                        instance.status.slice(1)}
                    </Chip>
                    <Chip color="default" size="sm" variant="flat">
                      {getServiceTypeLabel(instance.serviceType)}
                    </Chip>
                  </div>
                  <p className="text-sm text-default-600 font-mono">
                    {instance.image}:{instance.version}
                  </p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  {/* Resources */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Database className="text-primary" size={14} />
                      <span>{instance.resources.cpu} CPU</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="text-secondary" size={14} />
                      <span>{instance.resources.memory} GB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="text-success" size={14} />
                      <span>{instance.resources.storage} GB</span>
                    </div>
                  </div>

                  {/* Domain */}
                  {instance.domain && (
                    <div className="text-sm">
                      <span className="text-default-600">Domain: </span>
                      <span className="font-mono text-default-900">
                        {instance.domain}
                      </span>
                    </div>
                  )}

                  {/* User */}
                  <div className="text-sm">
                    <span className="text-default-600">User: </span>
                    <span className="font-mono text-default-900">
                      {instance.user.name || instance.user.address}
                    </span>
                  </div>

                  {/* Uptime */}
                  <div className="flex items-center gap-2">
                    <Activity className="text-success" size={14} />
                    <span className="text-sm text-default-600">
                      Uptime:{" "}
                      <span className="font-semibold">{instance.uptime}%</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-default-200">
                    <Button
                      size="sm"
                      startContent={<Eye size={14} />}
                      variant="flat"
                      onPress={() => handleViewDetails(instance)}
                    >
                      Details
                    </Button>
                    {instance.status === "running" ? (
                      <>
                        <Button
                          color="warning"
                          size="sm"
                          startContent={<Square size={14} />}
                          variant="flat"
                          onPress={() => handleStop(instance.id)}
                        >
                          Stop
                        </Button>
                        <Button
                          color="primary"
                          size="sm"
                          startContent={<RefreshCw size={14} />}
                          variant="flat"
                          onPress={() => handleRestart(instance.id)}
                        >
                          Restart
                        </Button>
                      </>
                    ) : (
                      <Button
                        color="success"
                        isDisabled={instance.status === "starting"}
                        size="sm"
                        startContent={<Play size={14} />}
                        variant="flat"
                        onPress={() => handleStart(instance.id)}
                      >
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {filteredInstances.length === 0 && (
          <Card className="subnet-card">
            <CardBody className="p-12 text-center">
              <Server className="mx-auto mb-4 text-default-300" size={48} />
              <h3 className="text-lg font-semibold mb-2">
                No hosting instances found
              </h3>
              <p className="text-default-600 mb-4">
                {searchQuery ||
                statusFilter !== "all" ||
                serviceTypeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Deploy your first service to get started"}
              </p>
              {!searchQuery &&
                statusFilter === "all" &&
                serviceTypeFilter === "all" && (
                  <Button
                    color="primary"
                    startContent={<Plus size={18} />}
                    onPress={() => router.push("/deploy")}
                  >
                    Deploy Service
                  </Button>
                )}
            </CardBody>
          </Card>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailOpen}
          scrollBehavior="inside"
          size="2xl"
          onOpenChange={setIsDetailOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-2">
                    <Server size={20} />
                    <span>{selectedInstance?.name}</span>
                    {selectedInstance && (
                      <Chip
                        color={getStatusColor(selectedInstance.status)}
                        size="sm"
                        variant="flat"
                      >
                        {selectedInstance.status}
                      </Chip>
                    )}
                  </div>
                </ModalHeader>
                <ModalBody>
                  {selectedInstance && (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div>
                        <h3 className="font-semibold mb-3">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-default-600">
                              Service Type
                            </span>
                            <p className="font-medium">
                              {getServiceTypeLabel(
                                selectedInstance.serviceType,
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Image
                            </span>
                            <p className="font-mono text-sm">
                              {selectedInstance.image}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Version
                            </span>
                            <p className="font-mono text-sm">
                              {selectedInstance.version}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Status
                            </span>
                            <Chip
                              color={getStatusColor(selectedInstance.status)}
                              size="sm"
                              variant="flat"
                            >
                              {selectedInstance.status}
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {/* Domain */}
                      {selectedInstance.domain && (
                        <div>
                          <h3 className="font-semibold mb-3">Domain</h3>
                          <p className="font-mono text-sm bg-default-50 p-2 rounded">
                            {selectedInstance.domain}
                          </p>
                        </div>
                      )}

                      {/* Ports */}
                      <div>
                        <h3 className="font-semibold mb-3">Ports</h3>
                        <div className="space-y-2">
                          {selectedInstance.ports.map((port, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-default-50 rounded"
                            >
                              <span className="font-mono text-sm">
                                {port.containerPort} → {port.hostPort}
                              </span>
                              <Chip size="sm" variant="flat">
                                {port.protocol.toUpperCase()}
                              </Chip>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h3 className="font-semibold mb-3">Resources</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-default-50 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Database className="text-primary" size={16} />
                              <span className="text-sm text-default-600">
                                CPU
                              </span>
                            </div>
                            <p className="text-lg font-bold">
                              {selectedInstance.resources.cpu} cores
                            </p>
                          </div>
                          <div className="p-3 bg-default-50 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="text-secondary" size={16} />
                              <span className="text-sm text-default-600">
                                Memory
                              </span>
                            </div>
                            <p className="text-lg font-bold">
                              {selectedInstance.resources.memory} GB
                            </p>
                          </div>
                          <div className="p-3 bg-default-50 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="text-success" size={16} />
                              <span className="text-sm text-default-600">
                                Storage
                              </span>
                            </div>
                            <p className="text-lg font-bold">
                              {selectedInstance.resources.storage} GB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div>
                        <h3 className="font-semibold mb-3">User Information</h3>
                        <div className="p-3 bg-default-50 rounded">
                          <p className="font-mono text-sm">
                            {selectedInstance.user.address}
                          </p>
                          {selectedInstance.user.name && (
                            <p className="text-sm text-default-600 mt-1">
                              {selectedInstance.user.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div>
                        <h3 className="font-semibold mb-3">Timestamps</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-default-600">
                              Created
                            </span>
                            <p className="text-sm">
                              {new Date(
                                selectedInstance.createdAt,
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-default-600">
                              Last Updated
                            </span>
                            <p className="text-sm">
                              {new Date(
                                selectedInstance.updatedAt,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Uptime */}
                      <div>
                        <h3 className="font-semibold mb-3">Uptime</h3>
                        <div className="flex items-center gap-2">
                          <Activity className="text-success" size={20} />
                          <span className="text-2xl font-bold">
                            {selectedInstance.uptime}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Close
                  </Button>
                  {selectedInstance && (
                    <>
                      {selectedInstance.status === "running" ? (
                        <>
                          <Button
                            color="warning"
                            startContent={<Square size={16} />}
                            variant="flat"
                            onPress={() => {
                              handleStop(selectedInstance.id);
                              onClose();
                            }}
                          >
                            Stop
                          </Button>
                          <Button
                            color="primary"
                            startContent={<RefreshCw size={16} />}
                            onPress={() => {
                              handleRestart(selectedInstance.id);
                            }}
                          >
                            Restart
                          </Button>
                        </>
                      ) : (
                        <Button
                          color="success"
                          startContent={<Play size={16} />}
                          onPress={() => {
                            handleStart(selectedInstance.id);
                            onClose();
                          }}
                        >
                          Start
                        </Button>
                      )}
                    </>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Delete Hosting Instance</ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedInstance?.name}</strong>? This action
                    cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => {
                      if (selectedInstance) {
                        handleDelete(selectedInstance.id);
                        onClose();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
