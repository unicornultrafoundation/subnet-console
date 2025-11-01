"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import {
  TrendingUp,
  Shield,
  Server,
  ArrowLeft,
  Plus,
  Minus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Coins,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";

import { useNodeStore } from "@/store/node-store";

interface StakingRequirement {
  resource: string;
  unit: string;
  amount: number;
  stakePerUnit: number; // tokens per unit
  totalRequired: number; // amount * stakePerUnit
}

interface UnstakeRequest {
  id: string;
  amount: number;
  requestedAt: string;
  unlockDate: string; // requestedAt + 21 days
  status: "pending" | "ready" | "claimed";
}

interface StakingStatus {
  totalRequired: number;
  totalStaked: number;
  rewards: number;
  unstaked: number;
  lastUpdated: string;
  unstakeRequests: UnstakeRequest[];
}

export default function ProviderStakingPage() {
  const router = useRouter();
  const { nodes } = useNodeStore();

  // Calculate total resources from nodes
  const calculateTotalResources = () => {
    return nodes.reduce(
      (acc, node) => ({
        cpu: acc.cpu + node.specs.cpu,
        memory: acc.memory + node.specs.memory,
        storage: acc.storage + node.specs.storage,
        bandwidth: acc.bandwidth + node.specs.bandwidth,
        nodes: acc.nodes + 1,
      }),
      { cpu: 0, memory: 0, storage: 0, bandwidth: 0, nodes: 0 },
    );
  };

  const totalResources = calculateTotalResources();

  // Staking requirements per unit (in tokens)
  const stakePerUnit = {
    cpu: 10, // 10 tokens per CPU core
    memory: 5, // 5 tokens per GB memory
    storage: 1, // 1 token per GB storage
    bandwidth: 0.5, // 0.5 tokens per Mbps
    nodeBase: 100, // Base stake per node
  };

  // Calculate staking requirements
  const calculateStakingRequirements = (): StakingRequirement[] => {
    return [
      {
        resource: "CPU Cores",
        unit: "cores",
        amount: totalResources.cpu,
        stakePerUnit: stakePerUnit.cpu,
        totalRequired: totalResources.cpu * stakePerUnit.cpu,
      },
      {
        resource: "Memory",
        unit: "GB",
        amount: totalResources.memory,
        stakePerUnit: stakePerUnit.memory,
        totalRequired: totalResources.memory * stakePerUnit.memory,
      },
      {
        resource: "Storage",
        unit: "GB",
        amount: totalResources.storage,
        stakePerUnit: stakePerUnit.storage,
        totalRequired: totalResources.storage * stakePerUnit.storage,
      },
      {
        resource: "Bandwidth",
        unit: "Mbps",
        amount: totalResources.bandwidth,
        stakePerUnit: stakePerUnit.bandwidth,
        totalRequired: totalResources.bandwidth * stakePerUnit.bandwidth,
      },
      {
        resource: "Base Stake",
        unit: "nodes",
        amount: totalResources.nodes,
        stakePerUnit: stakePerUnit.nodeBase,
        totalRequired: totalResources.nodes * stakePerUnit.nodeBase,
      },
    ];
  };

  const requirements = calculateStakingRequirements();
  const totalRequired = requirements.reduce(
    (sum, req) => sum + req.totalRequired,
    0,
  );

  // Mock staking status
  const [stakingStatus, setStakingStatus] = useState<StakingStatus>({
    totalRequired,
    totalStaked: 8500, // Mock: currently staked
    rewards: 245.5, // Mock: pending rewards
    unstaked: 0,
    lastUpdated: new Date().toISOString(),
    unstakeRequests: [
      // Mock: example pending unstake request
      {
        id: "unstake-1",
        amount: 500,
        requestedAt: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 5 days ago
        unlockDate: new Date(
          Date.now() + 16 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 16 days from now
        status: "pending",
      },
    ],
  });

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const deficit = totalRequired - stakingStatus.totalStaked;
  const coverage =
    totalRequired > 0 ? (stakingStatus.totalStaked / totalRequired) * 100 : 100;

  useEffect(() => {
    setStakingStatus((prev) => ({
      ...prev,
      totalRequired,
    }));
  }, [totalRequired]);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert("Please enter a valid amount to stake");

      return;
    }

    const amount = parseFloat(stakeAmount);

    setIsStaking(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStakingStatus((prev) => ({
      ...prev,
      totalStaked: prev.totalStaked + amount,
      lastUpdated: new Date().toISOString(),
    }));
    setStakeAmount("");
    setIsStaking(false);
    alert(`Successfully staked ${amount.toLocaleString()} SCU tokens!`);
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      alert("Please enter a valid amount to unstake");

      return;
    }

    if (parseFloat(unstakeAmount) > stakingStatus.totalStaked) {
      alert("Cannot unstake more than currently staked");

      return;
    }

    const remaining = stakingStatus.totalStaked - parseFloat(unstakeAmount);

    if (remaining < totalRequired) {
      alert(
        `Cannot unstake. Minimum required stake is ${totalRequired.toLocaleString()} SCU tokens.`,
      );

      return;
    }

    setIsUnstaking(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const requestedAt = new Date();
    const unlockDate = new Date(requestedAt);

    unlockDate.setDate(unlockDate.getDate() + 21); // 21 days cooldown

    const newUnstakeRequest: UnstakeRequest = {
      id: `unstake-${Date.now()}`,
      amount: parseFloat(unstakeAmount),
      requestedAt: requestedAt.toISOString(),
      unlockDate: unlockDate.toISOString(),
      status: "pending",
    };

    setStakingStatus((prev) => ({
      ...prev,
      totalStaked: prev.totalStaked - parseFloat(unstakeAmount),
      unstakeRequests: [...prev.unstakeRequests, newUnstakeRequest],
      lastUpdated: new Date().toISOString(),
    }));
    setUnstakeAmount("");
    setIsUnstaking(false);
    alert(
      `Unstaking request submitted. SCU tokens will be unlocked in 21 days (${unlockDate.toLocaleDateString()}).`,
    );
  };

  const handleClaimUnstaked = async (requestId: string) => {
    setStakingStatus((prev) => {
      const updatedRequests = prev.unstakeRequests.map((req) =>
        req.id === requestId ? { ...req, status: "claimed" as const } : req,
      );
      const request = prev.unstakeRequests.find((r) => r.id === requestId);

      return {
        ...prev,
        unstakeRequests: updatedRequests,
        unstaked: prev.unstaked + (request?.amount || 0),
        lastUpdated: new Date().toISOString(),
      };
    });
    alert("Unstaked SCU tokens claimed successfully!");
  };

  const getDaysRemaining = (unlockDate: string): number => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diffTime = unlock.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  const handleClaimRewards = async () => {
    if (stakingStatus.rewards <= 0) {
      alert("No rewards to claim");

      return;
    }

    const rewardAmount = stakingStatus.rewards;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStakingStatus((prev) => ({
      ...prev,
      rewards: 0,
      lastUpdated: new Date().toISOString(),
    }));
    alert(`Successfully claimed ${rewardAmount.toFixed(2)} SCU tokens!`);
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <TrendingUp className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-dark-on-white">
                Provider Staking
              </h1>
              <p className="text-lg text-dark-on-white-muted">
                Stake tokens based on your resource capacity to secure the
                network
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-default-600">Required Stake</span>
                <Shield className="text-primary" size={20} />
              </div>
              <div className="text-2xl font-bold text-primary">
                {totalRequired.toLocaleString()}
              </div>
              <div className="text-xs text-default-500 mt-1">SCU</div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-default-600">Total Staked</span>
                <Coins className="text-success" size={20} />
              </div>
              <div className="text-2xl font-bold text-success">
                {stakingStatus.totalStaked.toLocaleString()}
              </div>
              <div className="text-xs text-default-500 mt-1">SCU</div>
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-default-600">Coverage</span>
                {coverage >= 100 ? (
                  <CheckCircle className="text-success" size={20} />
                ) : (
                  <AlertCircle className="text-warning" size={20} />
                )}
              </div>
              <div className="text-2xl font-bold">{coverage.toFixed(1)}%</div>
              <Progress
                className="mt-2"
                color={coverage >= 100 ? "success" : "warning"}
                value={Math.min(coverage, 100)}
              />
            </CardBody>
          </Card>

          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-default-600">
                  Pending Rewards
                </span>
                <DollarSign className="text-secondary" size={20} />
              </div>
              <div className="text-2xl font-bold text-secondary">
                {stakingStatus.rewards.toFixed(2)}
              </div>
              <div className="text-xs text-default-500 mt-1">SCU</div>
            </CardBody>
          </Card>
        </div>

        {/* Warning if insufficient stake */}
        {deficit > 0 && (
          <Card className="subnet-card mb-6 border-warning-200 bg-warning-50">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-warning-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-warning-900 mb-1">
                    Insufficient Stake
                  </h3>
                  <p className="text-sm text-warning-700">
                    You need to stake an additional{" "}
                    <strong>{deficit.toLocaleString()} SCU tokens</strong> to
                    meet the required staking amount for your resources. Please
                    stake more SCU tokens to continue providing services.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resource Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="text-primary" size={20} />
                  <h2 className="text-xl font-bold">Resource Breakdown</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {requirements.map((req, index) => {
                    const resourceIcon =
                      {
                        "CPU Cores": Cpu,
                        Memory: MemoryStick,
                        Storage: HardDrive,
                        Bandwidth: Zap,
                        "Base Stake": Shield,
                      }[req.resource] || Server;

                    const Icon = resourceIcon;
                    const stakePercentage =
                      totalRequired > 0
                        ? (req.totalRequired / totalRequired) * 100
                        : 0;

                    return (
                      <div key={index} className="p-4 bg-default-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="text-primary" size={18} />
                            <span className="font-semibold">
                              {req.resource}
                            </span>
                          </div>
                          <Chip color="primary" size="sm" variant="flat">
                            {req.totalRequired.toLocaleString()} SCU
                          </Chip>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-default-600">Amount:</span>{" "}
                            <span className="font-semibold">
                              {req.amount.toLocaleString()} {req.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-default-600">Rate:</span>{" "}
                            <span className="font-semibold">
                              {req.stakePerUnit} SCU/{req.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-default-600">Share:</span>{" "}
                            <span className="font-semibold">
                              {stakePercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Progress
                          className="h-2"
                          color="primary"
                          value={stakePercentage}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Required Stake</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalRequired.toLocaleString()} SCU
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Current Resources Summary */}
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="text-primary" size={20} />
                  <h2 className="text-xl font-bold">Current Resources</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <Cpu className="mx-auto text-primary mb-2" size={24} />
                    <div className="text-2xl font-bold">
                      {totalResources.cpu}
                    </div>
                    <div className="text-xs text-default-600">CPU Cores</div>
                  </div>
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <MemoryStick
                      className="mx-auto text-secondary mb-2"
                      size={24}
                    />
                    <div className="text-2xl font-bold">
                      {totalResources.memory}
                    </div>
                    <div className="text-xs text-default-600">GB Memory</div>
                  </div>
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <HardDrive
                      className="mx-auto text-warning mb-2"
                      size={24}
                    />
                    <div className="text-2xl font-bold">
                      {totalResources.storage.toLocaleString()}
                    </div>
                    <div className="text-xs text-default-600">GB Storage</div>
                  </div>
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <Server className="mx-auto text-success mb-2" size={24} />
                    <div className="text-2xl font-bold">
                      {totalResources.nodes}
                    </div>
                    <div className="text-xs text-default-600">Nodes</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Staking Actions */}
          <div className="space-y-6">
            {/* Stake Tokens */}
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Plus className="text-success" size={20} />
                  <h2 className="text-xl font-bold">Stake Tokens</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="stake-amount-input"
                  >
                    Amount to Stake
                  </label>
                  <Input
                    endContent={
                      <span className="text-default-500 text-sm">SCU</span>
                    }
                    id="stake-amount-input"
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  {deficit > 0 && (
                    <p className="text-xs text-warning-600 mt-1">
                      Recommended: {deficit.toLocaleString()} SCU tokens to meet
                      requirement
                    </p>
                  )}
                </div>
                <Button
                  className="w-full"
                  color="primary"
                  isLoading={isStaking}
                  startContent={!isStaking ? <Plus size={16} /> : undefined}
                  onPress={handleStake}
                >
                  {isStaking ? "Staking..." : "Stake Tokens"}
                </Button>
              </CardBody>
            </Card>

            {/* Unstake Tokens */}
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Minus className="text-warning" size={20} />
                  <h2 className="text-xl font-bold">Unstake Tokens</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="bg-warning-50 p-3 rounded-lg border border-warning-200">
                  <p className="text-xs text-warning-700">
                    <strong>21-day cooldown:</strong> SCU tokens will be locked
                    for 21 days after unstaking before they can be claimed.
                  </p>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="unstake-amount-input"
                  >
                    Amount to Unstake
                  </label>
                  <Input
                    endContent={
                      <span className="text-default-500 text-sm">SCU</span>
                    }
                    id="unstake-amount-input"
                    max={stakingStatus.totalStaked - totalRequired}
                    min="0"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                  />
                  <p className="text-xs text-default-500 mt-1">
                    Available:{" "}
                    {Math.max(
                      0,
                      stakingStatus.totalStaked - totalRequired,
                    ).toLocaleString()}{" "}
                    SCU tokens
                  </p>
                </div>
                <Button
                  className="w-full"
                  color="warning"
                  isDisabled={
                    stakingStatus.totalStaked - totalRequired <= 0 ||
                    coverage < 100
                  }
                  isLoading={isUnstaking}
                  startContent={!isUnstaking ? <Minus size={16} /> : undefined}
                  variant="flat"
                  onPress={handleUnstake}
                >
                  {isUnstaking ? "Unstaking..." : "Unstake Tokens"}
                </Button>
                {coverage < 100 && (
                  <p className="text-xs text-warning-600">
                    Cannot unstake while below required stake
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Pending Unstake Requests */}
            {stakingStatus.unstakeRequests.filter((r) => r.status !== "claimed")
              .length > 0 && (
              <Card className="subnet-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-warning" size={20} />
                    <h2 className="text-xl font-bold">Pending Unstakes</h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {stakingStatus.unstakeRequests
                      .filter((req) => req.status !== "claimed")
                      .map((req) => {
                        const daysRemaining = getDaysRemaining(req.unlockDate);
                        const isReady =
                          daysRemaining === 0 && req.status === "pending";

                        return (
                          <div
                            key={req.id}
                            className={`p-4 rounded-lg border ${
                              isReady
                                ? "bg-success-50 border-success-200"
                                : "bg-warning-50 border-warning-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">
                                {req.amount.toLocaleString()} SCU
                              </span>
                              {isReady ? (
                                <Chip color="success" size="sm">
                                  Ready to Claim
                                </Chip>
                              ) : (
                                <Chip color="warning" size="sm">
                                  {daysRemaining} days left
                                </Chip>
                              )}
                            </div>
                            <div className="text-xs text-default-600 space-y-1">
                              <p>
                                Requested:{" "}
                                {new Date(req.requestedAt).toLocaleDateString()}
                              </p>
                              <p>
                                Unlock date:{" "}
                                {new Date(req.unlockDate).toLocaleDateString()}
                              </p>
                            </div>
                            {isReady && (
                              <Button
                                className="w-full mt-3"
                                color="success"
                                size="sm"
                                variant="flat"
                                onPress={() => handleClaimUnstaked(req.id)}
                              >
                                Claim Unstaked Tokens
                              </Button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Claim Rewards */}
            {stakingStatus.rewards > 0 && (
              <Card className="subnet-card border-secondary-200 bg-secondary-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-secondary" size={20} />
                    <h2 className="text-xl font-bold">Claim Rewards</h2>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-secondary mb-1">
                      {stakingStatus.rewards.toFixed(2)}
                    </div>
                    <div className="text-sm text-default-600">
                      SCU available
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    color="secondary"
                    startContent={<DollarSign size={16} />}
                    onPress={handleClaimRewards}
                  >
                    Claim Rewards
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Info Card */}
            <Card className="subnet-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-default-400" size={20} />
                  <h2 className="text-xl font-bold">Staking Info</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 text-sm text-default-600">
                <p>
                  Staking requirements are calculated based on your total
                  resource capacity across all nodes.
                </p>
                <p>
                  <strong>Staking Rates (SCU tokens):</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>CPU: {stakePerUnit.cpu} SCU/core</li>
                  <li>Memory: {stakePerUnit.memory} SCU/GB</li>
                  <li>Storage: {stakePerUnit.storage} SCU/GB</li>
                  <li>Bandwidth: {stakePerUnit.bandwidth} SCU/Mbps</li>
                  <li>Base: {stakePerUnit.nodeBase} SCU/node</li>
                </ul>
                <p className="pt-2 border-t border-default-200">
                  Last updated:{" "}
                  {new Date(stakingStatus.lastUpdated).toLocaleString()}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
