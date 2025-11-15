"use client";

import { useEffect, useState, useMemo } from "react";
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
  AlertCircle,
} from "lucide-react";

import { ProviderConfig } from "./types";
import { useNodeStore } from "@/store/node-store";
import { useWallet } from "@/hooks/use-wallet";
import {
  updateProviderSpecs,
  type UpdateProviderSpecsParams,
  type ProviderInfo,
} from "@/lib/blockchain/provider-contract";

interface ResourcesTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  providerInfo: ProviderInfo | null;
  providerAddress: string | null;
  onResourceUpdate?: () => void;
}

export function ResourcesTab({
  config,
  updateConfig,
  providerInfo,
  providerAddress,
  onResourceUpdate,
}: ResourcesTabProps) {
  const { nodes } = useNodeStore();
  const { address, isConnected } = useWallet();
  const [calculatedResources, setCalculatedResources] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    bandwidth: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  // Get blockchain resources from providerInfo
  const blockchainResources = useMemo(() => {
    if (!providerInfo) return null;
    return {
      cpu: Number(providerInfo.cpuCores) / 1000, // Convert mCPU to cores
      memory: Number(providerInfo.memoryMB),
      storage: Number(providerInfo.diskGB),
      bandwidth: 0, // Not available in contract
    };
  }, [providerInfo]);

  // Check if resources match blockchain
  const hasMismatch = useMemo(() => {
    if (!blockchainResources) return false;
    return (
      calculatedResources.cpu !== blockchainResources.cpu ||
      calculatedResources.memory !== blockchainResources.memory ||
      calculatedResources.storage !== blockchainResources.storage
    );
  }, [calculatedResources, blockchainResources]);

  // Check if blockchain resources are smaller than node resources (can update)
  const canUpdate = useMemo(() => {
    if (!blockchainResources) return false;
    return (
      calculatedResources.cpu > blockchainResources.cpu ||
      calculatedResources.memory > blockchainResources.memory ||
      calculatedResources.storage > blockchainResources.storage
    );
  }, [calculatedResources, blockchainResources]);

  // Check if node resources are smaller than blockchain (warning only)
  const hasWarning = useMemo(() => {
    if (!blockchainResources) return false;
    return (
      calculatedResources.cpu < blockchainResources.cpu ||
      calculatedResources.memory < blockchainResources.memory ||
      calculatedResources.storage < blockchainResources.storage
    );
  }, [calculatedResources, blockchainResources]);

  // Update resources to blockchain
  const handleUpdateToBlockchain = async () => {
    if (!providerAddress || !isConnected || !address || !providerInfo) {
      setUpdateError("Provider address or wallet connection is missing");
      return;
    }

    if (!canUpdate) {
      setUpdateError("Cannot update: Node resources are not greater than blockchain resources");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Convert CPU cores to mCPU (multiply by 1000)
      const cpuCoresMcpu = Math.floor(calculatedResources.cpu * 1000);

      const params: UpdateProviderSpecsParams = {
        providerId: providerAddress,
        machineType: Number(providerInfo.machineType),
        region: Number(providerInfo.region),
        cpuCores: cpuCoresMcpu,
        gpuCores: Number(providerInfo.gpuCores) || 0,
        memoryMB: calculatedResources.memory,
        diskGB: calculatedResources.storage,
      };

      console.log("=== Update Provider Specs ===");
      console.log("Params:", params);

      const hash = await updateProviderSpecs(params);
      console.log("=== Update Provider Specs - Success ===");
      console.log("Transaction hash:", hash);

      setUpdateSuccess(true);

      // Refresh provider info after update
      if (onResourceUpdate) {
        setTimeout(() => {
          onResourceUpdate();
        }, 2000); // Wait 2 seconds for blockchain to update
      }
    } catch (err: any) {
      console.error("=== Update Provider Specs - Error ===");
      console.error("Error updating provider specs:", err);
      setUpdateError(err.message || "Failed to update resources. Please try again.");
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
          {blockchainResources && (
            <div className="flex items-center gap-2">
              {canUpdate ? (
                <Button
                  color="primary"
                  isLoading={isUpdating}
                  size="sm"
                  startContent={<Upload size={16} />}
                  variant="flat"
                  onPress={handleUpdateToBlockchain}
                  isDisabled={!isConnected || !address}
                >
                  Update to Blockchain
                </Button>
              ) : hasMismatch ? (
                <div className="flex items-center gap-1 text-warning text-sm">
                  <AlertCircle size={16} />
                  <span>Mismatch</span>
                </div>
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
        {/* Error Message */}
        {updateError && (
          <div className="p-3 bg-danger/10 rounded-lg border border-danger/20 flex items-center gap-2">
            <AlertCircle className="text-danger" size={18} />
            <span className="text-sm text-danger">{updateError}</span>
          </div>
        )}

        {/* Success Message */}
        {updateSuccess && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20 flex items-center gap-2">
            <CheckCircle className="text-success" size={18} />
            <span className="text-sm text-success">
              Resources updated successfully! Refreshing provider info...
            </span>
          </div>
        )}

        {/* Status Banner */}
        {hasWarning && (
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-warning font-medium mb-1">
                  Warning: Node resources are smaller than blockchain resources
                </p>
                <p className="text-xs text-default-600">
                  Your node resources are less than what is registered on the blockchain.
                  You cannot update resources in this case. Consider adding more nodes or reducing blockchain resources.
                </p>
              </div>
            </div>
          </div>
        )}

        {canUpdate && !hasWarning && (
          <div className="p-3 bg-info/10 rounded-lg border border-info/20 flex items-center gap-2">
            <AlertCircle className="text-info" size={18} />
            <span className="text-sm text-info font-medium">
              Node resources are greater than blockchain. You can update to blockchain.
            </span>
          </div>
        )}

        {!hasMismatch && blockchainResources && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20 flex items-center gap-2">
            <CheckCircle className="text-success" size={18} />
            <span className="text-sm text-success">
              Resources are synced with blockchain
            </span>
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
            {blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.cpu !== blockchainResources.cpu
                    ? calculatedResources.cpu > blockchainResources.cpu
                      ? "text-info"
                      : "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {blockchainResources.cpu}
                {calculatedResources.cpu > blockchainResources.cpu && (
                  <span className="ml-1">(can update)</span>
                )}
                {calculatedResources.cpu < blockchainResources.cpu && (
                  <span className="ml-1">(warning)</span>
                )}
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
            {blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.memory !== blockchainResources.memory
                    ? calculatedResources.memory > blockchainResources.memory
                      ? "text-info"
                      : "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {blockchainResources.memory} GB
                {calculatedResources.memory > blockchainResources.memory && (
                  <span className="ml-1">(can update)</span>
                )}
                {calculatedResources.memory < blockchainResources.memory && (
                  <span className="ml-1">(warning)</span>
                )}
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
            {blockchainResources && (
              <div
                className={`text-xs ${
                  calculatedResources.storage !== blockchainResources.storage
                    ? calculatedResources.storage > blockchainResources.storage
                      ? "text-info"
                      : "text-warning"
                    : "text-default-500"
                }`}
              >
                Blockchain: {blockchainResources.storage} GB
                {calculatedResources.storage > blockchainResources.storage && (
                  <span className="ml-1">(can update)</span>
                )}
                {calculatedResources.storage < blockchainResources.storage && (
                  <span className="ml-1">(warning)</span>
                )}
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
            {blockchainResources && (
              <div className="text-xs text-default-500">
                Blockchain: N/A (not tracked)
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
