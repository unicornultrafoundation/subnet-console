"use client";

import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { AlertCircle } from "lucide-react";
import { formatEther, formatUnits } from "ethers";
import { type ProviderInfo } from "@/lib/blockchain/provider-contract";

interface BlockchainProviderInfoProps {
  providerInfo: ProviderInfo | null;
  isLoading: boolean;
  address: string | null;
}

const machineTypes = [
  { value: 0, label: "Kubernetes" },
  { value: 1, label: "Kubernetes GPU" },
];

const regions = [
  { value: 0, label: "North America" },
  { value: 1, label: "Europe" },
  { value: 2, label: "Asia Pacific" },
  { value: 3, label: "South America" },
  { value: 4, label: "Africa" },
];

export function BlockchainProviderInfo({
  providerInfo,
  isLoading,
  address,
}: BlockchainProviderInfoProps) {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardBody className="p-8 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-dark-on-white-muted">
            Loading provider information from blockchain...
          </p>
        </CardBody>
      </Card>
    );
  }

  if (!providerInfo || !address) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-dark-on-white">
            Blockchain Provider Information
          </h2>
          <div className="flex items-center gap-2">
            {providerInfo.isActive ? (
              <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-default/20 text-default-600 text-sm font-semibold">
                Inactive
              </span>
            )}
            {providerInfo.verified && (
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Provider Address</p>
            <p className="font-mono text-sm text-dark-on-white break-all">{address}</p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Operator Address</p>
            <p className="font-mono text-sm text-dark-on-white break-all">
              {providerInfo.operator}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Owner Address</p>
            <p className="font-mono text-sm text-dark-on-white break-all">
              {providerInfo.owner}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Machine Type</p>
            <p className="text-dark-on-white">
              {machineTypes[Number(providerInfo.machineType)]?.label || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Region</p>
            <p className="text-dark-on-white">
              {regions[Number(providerInfo.region)]?.label || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Reputation</p>
            <p className="text-dark-on-white">{providerInfo.reputation.toString()}</p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Total Staked</p>
            <p className="text-dark-on-white font-semibold">
              {formatEther(providerInfo.totalStaked)} tokens
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">CPU Cores</p>
            <p className="text-dark-on-white">
              {Number(providerInfo.cpuCores) / 1000} cores (
              {providerInfo.cpuCores.toString()} mCPU)
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">GPU Cores</p>
            <p className="text-dark-on-white">{providerInfo.gpuCores.toString()}</p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Memory</p>
            <p className="text-dark-on-white">
              {Number(providerInfo.memoryMB)} MB ({Number(providerInfo.memoryMB) / 1024} GB)
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Disk</p>
            <p className="text-dark-on-white">{providerInfo.diskGB.toString()} GB</p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Stake Amount</p>
            <p className="text-dark-on-white font-semibold">
              {formatEther(providerInfo.stakeAmount)} tokens
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">CPU Price</p>
            <p className="text-dark-on-white">
              {formatUnits(providerInfo.cpuPricePerSecond, 18)} tokens/sec
            </p>
            <p className="text-xs text-dark-on-white-muted mt-1">
              ({(() => {
                const perSecond = parseFloat(
                  formatUnits(providerInfo.cpuPricePerSecond, 18),
                );
                return (perSecond * 3600).toFixed(6);
              })()}{" "}
              tokens/hour/core)
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">GPU Price</p>
            <p className="text-dark-on-white">
              {formatUnits(providerInfo.gpuPricePerSecond, 18)} tokens/sec
            </p>
            <p className="text-xs text-dark-on-white-muted mt-1">
              ({(() => {
                const perSecond = parseFloat(
                  formatUnits(providerInfo.gpuPricePerSecond, 18),
                );
                return (perSecond * 3600).toFixed(6);
              })()}{" "}
              tokens/hour)
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Memory Price</p>
            <p className="text-dark-on-white">
              {formatUnits(providerInfo.memoryPricePerSecond, 18)} tokens/sec
            </p>
            <p className="text-xs text-dark-on-white-muted mt-1">
              ({(() => {
                const perSecond = parseFloat(
                  formatUnits(providerInfo.memoryPricePerSecond, 18),
                );
                return (perSecond * 3600).toFixed(6);
              })()}{" "}
              tokens/hour/GB)
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Disk Price</p>
            <p className="text-dark-on-white">
              {formatUnits(providerInfo.diskPricePerSecond, 18)} tokens/sec
            </p>
            <p className="text-xs text-dark-on-white-muted mt-1">
              ({(() => {
                const perSecond = parseFloat(
                  formatUnits(providerInfo.diskPricePerSecond, 18),
                );
                return (perSecond * 3600).toFixed(6);
              })()}{" "}
              tokens/hour/GB)
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Created At</p>
            <p className="text-dark-on-white">
              {new Date(Number(providerInfo.createdAt) * 1000).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-on-white-muted mb-1">Updated At</p>
            <p className="text-dark-on-white">
              {new Date(Number(providerInfo.updatedAt) * 1000).toLocaleString()}
            </p>
          </div>
        </div>

        {providerInfo.isSlashed && (
          <div className="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-lg">
            <div className="flex items-center gap-2 text-danger">
              <AlertCircle size={20} />
              <span className="font-semibold">Provider has been slashed</span>
            </div>
            <p className="text-sm text-danger mt-2">
              Slashed Amount: {formatEther(providerInfo.slashedAmount)} tokens
            </p>
          </div>
        )}

        {providerInfo.pendingWithdrawals > BigInt(0) && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle size={20} />
              <span className="font-semibold">Pending Withdrawals</span>
            </div>
            <p className="text-sm text-warning mt-2">
              Amount: {formatEther(providerInfo.pendingWithdrawals)} tokens
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

