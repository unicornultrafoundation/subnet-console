"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Server, Plus, ArrowLeft } from "lucide-react";
import { Deployment, Service } from "@/components/dashboard/provider/hosting/types";
import { mockDeployments } from "@/components/dashboard/provider/hosting/mockData";
import StatisticsCards from "@/components/dashboard/provider/hosting/StatisticsCards";
import Filters from "@/components/dashboard/provider/hosting/Filters";
import DeploymentCard from "@/components/dashboard/provider/hosting/DeploymentCard";
import EmptyState from "@/components/dashboard/provider/hosting/EmptyState";
import DeploymentDetailModal from "@/components/dashboard/provider/hosting/DeploymentDetailModal";
import ScaleModal from "@/components/dashboard/provider/hosting/ScaleModal";
import DeleteModal from "@/components/dashboard/provider/hosting/DeleteModal";

export default function ProviderHostingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedDeployments, setExpandedDeployments] = useState<Set<string>>(
    new Set(),
  );
  const [selectedDeployment, setSelectedDeployment] =
    useState<Deployment | null>(null);
  const [selectedService, setSelectedService] = useState<{
    deployment: Deployment;
    service: Service;
  } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isScaleOpen, setIsScaleOpen] = useState(false);
  const [scaleTarget, setScaleTarget] = useState<{
    deploymentId: string;
    serviceId: string;
    currentReplicas: number;
  } | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(1);
  const [nowTs, setNowTs] = useState<number>(0);
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);

  // Clock tick for lease countdown - only on client side
  useEffect(() => {
    setNowTs(Date.now());
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Calculate statistics
  const stats = {
    total: deployments.length,
    running: deployments.filter((d) => d.status === "running").length,
    stopped: deployments.filter((d) => d.status === "stopped").length,
    totalServices: deployments.reduce((sum, d) => sum + d.services.length, 0),
    runningServices: deployments.reduce(
      (sum, d) =>
        sum + d.services.filter((s) => s.status === "running").length,
      0,
    ),
    totalReplicas: deployments.reduce(
      (sum, d) =>
        sum + d.services.reduce((sSum, s) => sSum + s.replicasStatus.total, 0),
      0,
    ),
    runningReplicas: deployments.reduce(
      (sum, d) =>
        sum +
        d.services.reduce((sSum, s) => sSum + s.replicasStatus.running, 0),
      0,
    ),
    totalCpu: deployments.reduce(
      (sum, d) => sum + d.totalResources.cpu,
      0,
    ),
    totalMemory: deployments.reduce(
      (sum, d) => sum + d.totalResources.memory,
      0,
    ),
    totalStorage: deployments.reduce(
      (sum, d) => sum + d.totalResources.storage,
      0,
    ),
  };

  // Filter deployments
  const filteredDeployments = deployments.filter((deployment) => {
    const matchesSearch =
      deployment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deployment.application.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deployment.user.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deployment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleExpanded = (deploymentId: string) => {
    setExpandedDeployments((prev) => {
      const next = new Set(prev);
      if (next.has(deploymentId)) {
        next.delete(deploymentId);
      } else {
        next.add(deploymentId);
      }
      return next;
    });
  };

  const handleViewDetails = (deployment: Deployment, service?: Service) => {
    setSelectedDeployment(deployment);
    if (service) {
      setSelectedService({ deployment, service });
    } else {
      setSelectedService(null);
    }
    setIsDetailOpen(true);
  };

  const handleStartDeployment = (id: string) => {
    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === id ? { ...dep, status: "starting" as const } : dep,
      ),
    );
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((dep) =>
          dep.id === id
            ? {
                ...dep,
                status: "running" as const,
                services: dep.services.map((s) => ({
                  ...s,
                  status: "running" as const,
                  uptime: 100,
                })),
              }
            : dep,
        ),
      );
    }, 2000);
  };

  const handleStopDeployment = (id: string) => {
    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === id ? { ...dep, status: "stopping" as const } : dep,
      ),
    );
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((dep) =>
          dep.id === id
            ? {
                ...dep,
                status: "stopped" as const,
                services: dep.services.map((s) => ({
                  ...s,
                  status: "stopped" as const,
                  uptime: 0,
                })),
              }
            : dep,
        ),
      );
    }, 2000);
  };

  const handleRestartDeployment = (id: string) => {
    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === id ? { ...dep, status: "starting" as const } : dep,
      ),
    );
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((dep) =>
          dep.id === id
            ? {
                ...dep,
                status: "running" as const,
                services: dep.services.map((s) => ({
                  ...s,
                  status: "running" as const,
                })),
              }
            : dep,
        ),
      );
    }, 2000);
  };

  const handleStartService = (deploymentId: string, serviceId: string) => {
    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === deploymentId
          ? {
              ...dep,
              services: dep.services.map((s) =>
                s.id === serviceId
                  ? { ...s, status: "starting" as const }
                  : s,
              ),
            }
          : dep,
      ),
    );
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((dep) =>
          dep.id === deploymentId
            ? {
                ...dep,
                services: dep.services.map((s) =>
                  s.id === serviceId
                    ? { ...s, status: "running" as const, uptime: 100 }
                    : s,
                ),
              }
            : dep,
        ),
      );
    }, 2000);
  };

  const handleStopService = (deploymentId: string, serviceId: string) => {
    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === deploymentId
          ? {
              ...dep,
              services: dep.services.map((s) =>
                s.id === serviceId
                  ? { ...s, status: "stopping" as const }
                  : s,
              ),
            }
          : dep,
      ),
    );
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((dep) =>
          dep.id === deploymentId
            ? {
                ...dep,
                services: dep.services.map((s) =>
                  s.id === serviceId
                    ? { ...s, status: "stopped" as const, uptime: 0 }
                    : s,
                ),
              }
            : dep,
        ),
      );
    }, 2000);
  };

  const handleDeleteDeployment = (id: string) => {
    setDeployments((prev) => prev.filter((dep) => dep.id !== id));
    setIsDeleteOpen(false);
    setSelectedDeployment(null);
  };

  const handleScaleService = (
    deploymentId: string,
    serviceId: string,
    currentReplicas: number,
  ) => {
    setScaleTarget({ deploymentId, serviceId, currentReplicas });
    setScaleValue(currentReplicas);
    setIsScaleOpen(true);
  };

  const confirmScale = () => {
    if (!scaleTarget) return;

    setDeployments((prev) =>
      prev.map((dep) =>
        dep.id === scaleTarget.deploymentId
          ? {
              ...dep,
              services: dep.services.map((s) => {
                if (s.id === scaleTarget.serviceId) {
                  const newReplicas = scaleValue;
                  const runningReplicas = Math.min(
                    s.replicasStatus.running,
                    newReplicas,
                  );
                  const pendingReplicas = Math.max(
                    0,
                    newReplicas - s.replicasStatus.running,
                  );

                  let newReplicasList = [...(s.replicasList || [])];
                  if (newReplicas > s.replicas) {
                    for (let i = s.replicas; i < newReplicas; i++) {
                      newReplicasList.push({
                        id: `pod-${s.id}-${i + 1}`,
                        name: `${s.name}-${Math.random().toString(36).substring(7)}`,
                        status: "pending" as const,
                        nodeId: undefined,
                        nodeName: undefined,
                        startedAt: undefined,
                        uptime: undefined,
                      });
                    }
                  } else if (newReplicas < s.replicas) {
                    newReplicasList = newReplicasList.slice(0, newReplicas);
                  }

                  return {
                    ...s,
                    replicas: newReplicas,
                    replicasStatus: {
                      running: runningReplicas,
                      pending: pendingReplicas,
                      failed: s.replicasStatus.failed,
                      succeeded: s.replicasStatus.succeeded,
                      total: newReplicas,
                    },
                    replicasList: newReplicasList,
                  };
                }
                return s;
              }),
            }
          : dep,
      ),
    );

    if (scaleValue > scaleTarget.currentReplicas) {
      setTimeout(() => {
        setDeployments((prev) =>
          prev.map((dep) =>
            dep.id === scaleTarget.deploymentId
              ? {
                  ...dep,
                  services: dep.services.map((s) => {
                    if (s.id === scaleTarget.serviceId) {
                      return {
                        ...s,
                        replicasStatus: {
                          ...s.replicasStatus,
                          running: s.replicas,
                          pending: 0,
                        },
                        replicasList: s.replicasList?.map((r) =>
                          r.status === "pending"
                            ? {
                                ...r,
                                status: "running" as const,
                                nodeId: `node-${Math.floor(Math.random() * 3) + 1}`,
                                nodeName: `worker-0${Math.floor(Math.random() * 3) + 1}`,
                                startedAt: new Date().toISOString(),
                                uptime: 100,
                              }
                            : r,
                        ),
                      };
                    }
                    return s;
                  }),
                }
              : dep,
          ),
        );
      }, 2000);
    }

    setIsScaleOpen(false);
    setScaleTarget(null);
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
                  Manage deployments and services
                </p>
              </div>
            </div>
            <Button
              color="primary"
              size="lg"
              startContent={<Plus size={20} />}
              onPress={() => router.push("/deploy")}
            >
              Deploy Application
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <StatisticsCards stats={stats} />

        {/* Filters */}
        <Filters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Deployments List */}
        <div className="space-y-4">
          {filteredDeployments.map((deployment) => (
            <DeploymentCard
              key={deployment.id}
              deployment={deployment}
              isExpanded={expandedDeployments.has(deployment.id)}
              nowTs={nowTs}
              onToggleExpand={toggleExpanded}
              onViewDetails={handleViewDetails}
              onStart={handleStartDeployment}
              onStop={handleStopDeployment}
              onRestart={handleRestartDeployment}
              onViewServiceDetails={handleViewDetails}
              onScaleService={handleScaleService}
              onStartService={handleStartService}
              onStopService={handleStopService}
            />
          ))}
        </div>

        {filteredDeployments.length === 0 && (
          <EmptyState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onDeploy={() => router.push("/deploy")}
          />
        )}

        {/* Modals */}
        <DeploymentDetailModal
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          selectedDeployment={selectedDeployment}
          selectedService={selectedService}
          nowTs={nowTs}
          onViewService={(deployment, service) => {
            setSelectedService({ deployment, service });
          }}
          onStartService={handleStartService}
          onStopService={handleStopService}
        />

        <ScaleModal
          isOpen={isScaleOpen}
          onOpenChange={setIsScaleOpen}
          currentReplicas={scaleTarget?.currentReplicas || 1}
          scaleValue={scaleValue}
          onScaleValueChange={setScaleValue}
          onConfirm={confirmScale}
        />

        <DeleteModal
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          deploymentName={selectedDeployment?.name || ""}
          onConfirm={() => {
            if (selectedDeployment) {
              handleDeleteDeployment(selectedDeployment.id);
            }
          }}
        />
      </div>
    </div>
  );
}
