"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Database,
  HardDrive,
  Network,
  Box,
  AlertTriangle,
  CheckCircle,
  Upload,
} from "lucide-react";

import { ProviderConfig } from "./types";

import { useNodeStore } from "@/store/node-store";

interface ResourcesTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
}

export function ResourcesTab({ config, updateConfig }: ResourcesTabProps) {
  const { nodes } = useNodeStore();
  const [calculatedResources, setCalculatedResources] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    bandwidth: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate total resources from active nodes (80% available, 20% reserved)
  useEffect(() => {
    const totals = nodes
      .filter((node) => node.status === "active")
      .reduce(
        (acc, node) => ({
          cpu: acc.cpu + node.specs.cpu,
          memory: acc.memory + node.specs.memory,
          storage: acc.storage + node.specs.storage,
          bandwidth: acc.bandwidth + node.specs.bandwidth,
        }),
        { cpu: 0, memory: 0, storage: 0, bandwidth: 0 },
      );

    // Apply 80% availability (20% reserved for system)
    setCalculatedResources({
      cpu: Math.floor(totals.cpu * 0.8),
      memory: Math.floor(totals.memory * 0.8),
      storage: Math.floor(totals.storage * 0.8),
      bandwidth: Math.floor(totals.bandwidth * 0.8),
    });
  }, [nodes]);

  // Check if resources match blockchain
  const hasMismatch =
    config.blockchainResources &&
    (calculatedResources.cpu !== config.blockchainResources.cpu ||
      calculatedResources.memory !== config.blockchainResources.memory ||
      calculatedResources.storage !== config.blockchainResources.storage ||
      calculatedResources.bandwidth !== config.blockchainResources.bandwidth);

  // Update resources to blockchain
  const handleUpdateToBlockchain = async () => {
    setIsUpdating(true);
    try {
      // Simulate blockchain update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      updateConfig("blockchainResources", {
        ...calculatedResources,
        lastUpdated: new Date().toISOString(),
      });

      alert("Resources updated to blockchain successfully!");
    } catch (error) {
      alert("Failed to update resources to blockchain. Please try again.");
      console.error("Blockchain update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Box size={20} />
            <h2 className="text-xl font-bold">Resources</h2>
          </div>
          {config.blockchainResources && (
            <div className="flex items-center gap-2">
              {hasMismatch ? (
                <Button
                  color="warning"
                  isLoading={isUpdating}
                  size="sm"
                  startContent={<Upload size={16} />}
                  variant="flat"
                  onPress={handleUpdateToBlockchain}
                >
                  Update to Blockchain
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-success text-sm">
                  <CheckCircle size={16} />
                  <span>Synced</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Status Banner */}
        {hasMismatch && (
          <div className="p-3 bg-warning-50 rounded-lg border border-warning-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-warning" size={18} />
              <span className="text-sm text-warning-700 font-medium">
                Resources mismatch with blockchain
              </span>
            </div>
          </div>
        )}

        {!hasMismatch && config.blockchainResources && (
          <div className="p-3 bg-success-50 rounded-lg border border-success-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-success" size={18} />
              <span className="text-sm text-success-700">
                Last synced:{" "}
                {new Date(
                  config.blockchainResources.lastUpdated,
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPU */}
          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
            <div className="flex items-center gap-2 mb-3">
              <Database className="text-primary" size={18} />
              <h3 className="font-semibold text-sm">CPU Cores</h3>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {calculatedResources.cpu.toLocaleString()}
            </div>
            {config.blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.cpu !== config.blockchainResources.cpu
                    ? "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {config.blockchainResources.cpu}
              </div>
            )}
            <div className="text-xs text-default-400 mt-2">
              {nodes.filter((n) => n.status === "active").length} active nodes
            </div>
          </div>

          {/* Memory */}
          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="text-secondary" size={18} />
              <h3 className="font-semibold text-sm">Memory</h3>
            </div>
            <div className="text-2xl font-bold text-secondary mb-1">
              {calculatedResources.memory.toLocaleString()}{" "}
              <span className="text-sm font-normal">GB</span>
            </div>
            {config.blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.memory !==
                  config.blockchainResources.memory
                    ? "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {config.blockchainResources.memory} GB
              </div>
            )}
            <div className="text-xs text-default-400 mt-2">
              {nodes.filter((n) => n.status === "active").length} active nodes
            </div>
          </div>

          {/* Storage */}
          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="text-success" size={18} />
              <h3 className="font-semibold text-sm">Storage</h3>
            </div>
            <div className="text-2xl font-bold text-success mb-1">
              {calculatedResources.storage.toLocaleString()}{" "}
              <span className="text-sm font-normal">GB</span>
            </div>
            {config.blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.storage !==
                  config.blockchainResources.storage
                    ? "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {config.blockchainResources.storage} GB
              </div>
            )}
            <div className="text-xs text-default-400 mt-2">
              {nodes.filter((n) => n.status === "active").length} active nodes
            </div>
          </div>

          {/* Bandwidth */}
          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
            <div className="flex items-center gap-2 mb-3">
              <Network className="text-warning" size={18} />
              <h3 className="font-semibold text-sm">Bandwidth</h3>
            </div>
            <div className="text-2xl font-bold text-warning mb-1">
              {calculatedResources.bandwidth.toLocaleString()}{" "}
              <span className="text-sm font-normal">Mbps</span>
            </div>
            {config.blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.bandwidth !==
                  config.blockchainResources.bandwidth
                    ? "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {config.blockchainResources.bandwidth} Mbps
              </div>
            )}
            <div className="text-xs text-default-400 mt-2">
              {nodes.filter((n) => n.status === "active").length} active nodes
            </div>
          </div>

          {/* GPU */}
          <div className="p-4 bg-default-50 rounded-lg border border-default-200">
            <div className="flex items-center gap-2 mb-3">
              <Box className="text-primary" size={18} />
              <h3 className="font-semibold text-sm">GPU</h3>
            </div>
            {config.supportedGpuType ? (
              <>
                <div className="text-lg font-bold text-primary mb-1">
                  {config.supportedGpuType.vendor}{" "}
                  {config.supportedGpuType.model}
                </div>
                <div className="text-sm text-default-600 mb-1">
                  {config.supportedGpuType.memory} GB VRAM
                </div>
              </>
            ) : (
              <div className="text-sm text-default-400">Not configured</div>
            )}
            <div className="text-xs text-default-400 mt-2">
              Configure in GPU tab
            </div>
          </div>
        </div>

        {nodes.filter((n) => n.status === "active").length === 0 && (
          <div className="p-4 bg-warning-50 rounded-lg border border-warning-200 text-center">
            <p className="text-sm text-warning-700">
              No active nodes. Add nodes in{" "}
              <a className="underline font-semibold" href="/provider/nodes">
                Node Management
              </a>
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
