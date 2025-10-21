"use client";

import { useState, use } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import {
  Star,
  MapPin,
  Server,
  Shield,
  Users,
  Zap,
  Database,
  Activity,
  BarChart3,
  CheckCircle,
  ArrowLeft,
  Play,
  Pause,
} from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";

import { Provider, App } from "@/components/marketplace/types";

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [isDeploying, setIsDeploying] = useState(false);

  // Mock data - in real app, this would be fetched based on resolvedParams.id
  const provider: Provider = {
    id: resolvedParams.id,
    name: "Quantum Computing Solutions",
    location: "San Francisco, CA",
    region: "north-america",
    uptime: 99.8,
    reputation: 4.9,
    nodesCount: 150,
    totalDeployments: 1250,
    featured: true,
    verified: true,
    specialties: ["AI/ML", "Quantum Computing", "High Performance Computing"],
    pricing: {
      min: 0.15,
      max: 2.5,
      average: 0.8,
      cpu: 0.05,
      memory: 0.02,
      storage: 0.01,
      gpu: 0.25,
      gpuTypes: ["RTX 4090"],
    },
    resources: {
      cpu: { cores: 32, threads: 64 },
      memory: { total: 128, available: 64 },
      storage: { total: 2000, available: 1000 },
      gpu: { count: 8, types: ["RTX 4090"], vram: [24], available: 4 },
      network: { bandwidth: 1000, latency: 5 },
    },
    responseTime: "< 1ms",
    lastActive: "2 minutes ago",
    owner:
      "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
    verifiers: [
      {
        id: "ver-1",
        name: "Blockchain Security Labs",
        wallet:
          "0x9f8e7d6c5b4a3928172635485964738291a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5",
        verifiedAt: "2024-01-10T08:30:00Z",
        verificationType: "Security Audit",
        status: "verified",
      },
      {
        id: "ver-2",
        name: "Infrastructure Validators",
        wallet:
          "0x5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z9a8b7c6d5e4f3",
        verifiedAt: "2024-01-08T14:15:00Z",
        verificationType: "Infrastructure Check",
        status: "verified",
      },
      {
        id: "ver-3",
        name: "Performance Monitors",
        wallet:
          "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4",
        verifiedAt: "2024-01-05T11:45:00Z",
        verificationType: "Performance Test",
        status: "verified",
      },
    ],
  };

  // Mock deployments data
  const deployments = [
    {
      id: "dep-1",
      appId: "app-1",
      status: "running",
      createdAt: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-15T14:22:00Z",
      resources: {
        cpu: 4,
        memory: 8,
        storage: 50,
        gpu: 1,
      },
      cost: 0.45,
      user: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    },
    {
      id: "dep-2",
      appId: "app-2",
      status: "running",
      createdAt: "2024-01-14T09:15:00Z",
      lastUpdated: "2024-01-15T08:45:00Z",
      resources: {
        cpu: 2,
        memory: 4,
        storage: 25,
        gpu: 0,
      },
      cost: 0.18,
      user: "0x8ba1f109551bD432803012645Hac136c",
    },
    {
      id: "dep-3",
      appId: "app-3",
      status: "running",
      createdAt: "2024-01-13T16:20:00Z",
      lastUpdated: "2024-01-15T12:10:00Z",
      resources: {
        cpu: 8,
        memory: 16,
        storage: 100,
        gpu: 2,
      },
      cost: 0.89,
      user: "0x3Cd5334eB4ebC39c0218bE4E9780f2B5Bc005b5",
    },
    {
      id: "dep-4",
      appId: "app-1",
      status: "running",
      createdAt: "2024-01-12T14:30:00Z",
      lastUpdated: "2024-01-15T11:20:00Z",
      resources: {
        cpu: 6,
        memory: 12,
        storage: 75,
        gpu: 1,
      },
      cost: 0.67,
      user: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    },
    {
      id: "dep-5",
      appId: "app-2",
      status: "running",
      createdAt: "2024-01-11T08:45:00Z",
      lastUpdated: "2024-01-15T09:15:00Z",
      resources: {
        cpu: 3,
        memory: 6,
        storage: 40,
        gpu: 0,
      },
      cost: 0.32,
      user: "0x617F2E2fD72FD9D550031709E0cD7B3b4A16B3c",
    },
  ];

  // Mock apps data
  const apps: App[] = [
    {
      id: "app-1",
      name: "AI Model Training",
      category: "AI/ML",
      price: 0.45,
      rating: 4.8,
      downloads: 1250,
      provider: provider.name,
      description:
        "Advanced AI model training application with GPU acceleration",
      image: "/images/ai-training.jpg",
      tags: ["AI", "Machine Learning", "GPU"],
      featured: true,
    },
    {
      id: "app-2",
      name: "Web Analytics Dashboard",
      category: "Web Hosting",
      price: 0.18,
      rating: 4.5,
      downloads: 890,
      provider: provider.name,
      description: "Real-time web analytics and monitoring dashboard",
      image: "/images/analytics.jpg",
      tags: ["Analytics", "Dashboard", "Monitoring"],
      featured: false,
    },
    {
      id: "app-3",
      name: "Blockchain Node",
      category: "Blockchain",
      price: 0.89,
      rating: 4.9,
      downloads: 2100,
      provider: provider.name,
      description:
        "High-performance blockchain node with smart contract support",
      image: "/images/blockchain.jpg",
      tags: ["Blockchain", "Smart Contracts", "Node"],
      featured: true,
    },
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      // In real app, redirect to deployment page or show success message
      alert("Deployment initiated successfully!");
    }, 2000);
  };

  const handleDeployWithTemplate = async (deployment: any) => {
    const app = apps.find((a) => a.id === deployment.appId);

    // In real app, this would redirect to deployment page with pre-filled template
    // const template = {
    //   appId: deployment.appId,
    //   appName: app?.name,
    //   resources: deployment.resources,
    //   estimatedCost: deployment.cost,
    //   providerId: provider.id,
    //   providerName: provider.name,
    // };

    // Simulate deployment process
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      alert(`Deploying ${app?.name} with template configuration...`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative">
          <div className="mb-8">
            <Button
              as={Link}
              className="text-default-600 hover:text-primary"
              href="/providers"
              startContent={<ArrowLeft size={16} />}
              variant="light"
            >
              Back to Providers
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Server className="text-primary" size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-dark-on-white">
                  {provider.name}
                </h1>
                {provider.featured && (
                  <Chip
                    color="warning"
                    size="lg"
                    startContent={<Star size={16} />}
                    variant="flat"
                  >
                    Featured
                  </Chip>
                )}
                {provider.verified && (
                  <Chip
                    color="success"
                    size="lg"
                    startContent={<Shield size={16} />}
                    variant="flat"
                  >
                    Verified
                  </Chip>
                )}
              </div>
              <div className="flex items-center gap-1 text-lg text-dark-on-white-muted">
                <MapPin size={18} />
                <span>{provider.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                ${provider.pricing.min}/hr
              </div>
              <div className="text-sm text-default-600">Starting from</div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-xl bg-primary/5">
              <div className="text-4xl font-bold text-primary">
                {provider.nodesCount}
              </div>
              <div className="text-sm text-default-600">Active Nodes</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-secondary/5">
              <div className="text-4xl font-bold text-secondary">
                {provider.uptime}%
              </div>
              <div className="text-sm text-default-600">Uptime</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-warning-100">
              <div className="text-4xl font-bold text-warning-600">
                {provider.reputation}
              </div>
              <div className="text-sm text-default-600">Rating</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-success-100">
              <div className="text-4xl font-bold text-success-600">
                {provider.totalDeployments}
              </div>
              <div className="text-sm text-default-600">Deployments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Pricing Details */}
              <Card className="subnet-card">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Pricing Details</h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        ${provider.pricing.cpu}
                      </div>
                      <div className="text-sm text-default-600">CPU/Hour</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/5">
                      <div className="text-2xl font-bold text-secondary">
                        ${provider.pricing.memory}
                      </div>
                      <div className="text-sm text-default-600">
                        Memory/Hour
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-warning-100">
                      <div className="text-2xl font-bold text-warning-600">
                        ${provider.pricing.storage}
                      </div>
                      <div className="text-sm text-default-600">
                        Storage/Hour
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-danger-100">
                      <div className="text-2xl font-bold text-danger-600">
                        ${provider.pricing.gpu}
                      </div>
                      <div className="text-sm text-default-600">GPU/Hour</div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Resources */}
              <Card className="subnet-card">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Available Resources</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    {/* CPU */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-default-50">
                      <div className="flex items-center gap-3">
                        <Database className="text-primary" size={20} />
                        <div>
                          <div className="font-semibold">CPU Cores</div>
                          <div className="text-sm text-default-600">
                            {provider.resources.cpu.cores} cores,{" "}
                            {provider.resources.cpu.threads} threads
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {provider.resources.cpu.cores}
                        </div>
                        <div className="text-xs text-default-500">
                          Available
                        </div>
                      </div>
                    </div>

                    {/* Memory */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-default-50">
                      <div className="flex items-center gap-3">
                        <Activity className="text-secondary" size={20} />
                        <div>
                          <div className="font-semibold">Memory</div>
                          <div className="text-sm text-default-600">
                            {provider.resources.memory.total}GB total
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-secondary">
                          {provider.resources.memory.available}GB
                        </div>
                        <div className="text-xs text-default-500">
                          Available
                        </div>
                      </div>
                    </div>

                    {/* Storage */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-default-50">
                      <div className="flex items-center gap-3">
                        <Server className="text-warning" size={20} />
                        <div>
                          <div className="font-semibold">Storage</div>
                          <div className="text-sm text-default-600">
                            {provider.resources.storage.total}GB total
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-warning">
                          {provider.resources.storage.available}GB
                        </div>
                        <div className="text-xs text-default-500">
                          Available
                        </div>
                      </div>
                    </div>

                    {/* GPU */}
                    {provider.resources.gpu && (
                      <div className="flex items-center justify-between p-4 rounded-lg bg-default-50">
                        <div className="flex items-center gap-3">
                          <Zap className="text-danger" size={20} />
                          <div>
                            <div className="font-semibold">GPU</div>
                            <div className="text-sm text-default-600">
                              {provider.resources.gpu.types.join(", ")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-danger">
                            {provider.resources.gpu.available}
                          </div>
                          <div className="text-xs text-default-500">
                            Available
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Specialties */}
              <Card className="subnet-card">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Specialties</h2>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-3">
                    {provider.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        color="primary"
                        size="lg"
                        variant="flat"
                      >
                        {specialty}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Verifiers & Deployments Tabs */}
              <Card className="subnet-card">
                <CardBody className="p-0">
                  <Tabs aria-label="Provider details" className="w-full">
                    <Tab
                      key="verifiers"
                      title={
                        <div className="flex items-center gap-2">
                          <Shield size={16} />
                          <span>Verified By</span>
                          <Chip color="success" size="sm" variant="flat">
                            {provider.verifiers?.length || 0}
                          </Chip>
                        </div>
                      }
                    >
                      <div className="p-6">
                        <div className="space-y-4">
                          {provider.verifiers?.map((verifier) => (
                            <div
                              key={verifier.id}
                              className="p-4 rounded-lg border border-success-200 bg-success-50/30"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success/20 to-success/40 flex items-center justify-center">
                                    <Shield
                                      className="text-success"
                                      size={20}
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {verifier.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-default-600">
                                      <Chip
                                        color="success"
                                        size="sm"
                                        startContent={<CheckCircle size={12} />}
                                        variant="flat"
                                      >
                                        {verifier.status}
                                      </Chip>
                                      <span>•</span>
                                      <span>{verifier.verificationType}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-success">
                                    {new Date(
                                      verifier.verifiedAt,
                                    ).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-default-500">
                                    Verified
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-default-600">
                                  Verifier Wallet:
                                </span>
                                <span className="font-mono text-xs">
                                  {verifier.wallet.slice(0, 6)}...
                                  {verifier.wallet.slice(-4)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Tab>

                    <Tab
                      key="deployments"
                      title={
                        <div className="flex items-center gap-2">
                          <Server size={16} />
                          <span>Active Deployments</span>
                          <Chip color="primary" size="sm" variant="flat">
                            {deployments.length}
                          </Chip>
                        </div>
                      }
                    >
                      <div className="p-6">
                        <div className="space-y-3">
                          {deployments.map((deployment) => {
                            const app = apps.find(
                              (a) => a.id === deployment.appId,
                            );
                            const statusColor =
                              deployment.status === "running"
                                ? "success"
                                : "default";
                            const statusIcon =
                              deployment.status === "running" ? (
                                <Play size={14} />
                              ) : (
                                <Pause size={14} />
                              );

                            return (
                              <div
                                key={deployment.id}
                                className="p-4 rounded-lg border border-default-200 hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                                      <Server
                                        className="text-primary"
                                        size={18}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-base mb-1">
                                        {app?.name}
                                      </h3>
                                      <p className="text-sm text-default-600 mb-2 line-clamp-2">
                                        {app?.description}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-default-600 mb-2">
                                        <Chip
                                          color={statusColor}
                                          size="sm"
                                          startContent={statusIcon}
                                          variant="flat"
                                        >
                                          {deployment.status}
                                        </Chip>
                                        <span>•</span>
                                        <span>{app?.category}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                          <Star
                                            className="text-warning"
                                            size={10}
                                          />
                                          <span>{app?.rating}</span>
                                        </div>
                                      </div>
                                      <div className="text-xs text-default-500">
                                        by {deployment.user.slice(0, 6)}...
                                        {deployment.user.slice(-4)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0 ml-4">
                                    <div className="text-lg font-bold text-primary mb-1">
                                      ${deployment.cost}/hr
                                    </div>
                                    <div className="text-xs text-default-500">
                                      Estimated cost
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-4 gap-3 mb-4">
                                  <div className="text-center p-2 rounded-lg bg-primary/5">
                                    <div className="text-sm font-semibold text-primary">
                                      {deployment.resources.cpu}
                                    </div>
                                    <div className="text-xs text-default-600">
                                      CPU Cores
                                    </div>
                                  </div>
                                  <div className="text-center p-2 rounded-lg bg-secondary/5">
                                    <div className="text-sm font-semibold text-secondary">
                                      {deployment.resources.memory}GB
                                    </div>
                                    <div className="text-xs text-default-600">
                                      RAM
                                    </div>
                                  </div>
                                  <div className="text-center p-2 rounded-lg bg-warning-100">
                                    <div className="text-sm font-semibold text-warning-600">
                                      {deployment.resources.storage}GB
                                    </div>
                                    <div className="text-xs text-default-600">
                                      Storage
                                    </div>
                                  </div>
                                  <div className="text-center p-2 rounded-lg bg-danger-100">
                                    <div className="text-sm font-semibold text-danger-600">
                                      {deployment.resources.gpu}
                                    </div>
                                    <div className="text-xs text-default-600">
                                      GPU Units
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-default-500">
                                    Deployed:{" "}
                                    {new Date(
                                      deployment.createdAt,
                                    ).toLocaleDateString()}
                                  </div>
                                  <Button
                                    color="primary"
                                    isLoading={isDeploying}
                                    size="sm"
                                    startContent={<Play size={14} />}
                                    onClick={() =>
                                      handleDeployWithTemplate(deployment)
                                    }
                                  >
                                    Deploy This Template
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Deploy Card */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Deploy Now</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      ${provider.pricing.min}/hr
                    </div>
                    <div className="text-sm text-default-600">
                      Starting price
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={isDeploying}
                    size="lg"
                    startContent={!isDeploying ? <Play size={20} /> : undefined}
                    onClick={handleDeploy}
                  >
                    {isDeploying ? "Deploying..." : "Deploy Now"}
                  </Button>

                  <div className="text-xs text-default-500 text-center">
                    You can stop and modify your deployment at any time
                  </div>
                </CardBody>
              </Card>

              {/* Provider Info */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Provider Info</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-default-600">Owner Wallet</span>
                    <span className="font-semibold text-xs">
                      {provider.owner?.slice(0, 6)}...
                      {provider.owner?.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Response Time</span>
                    <span className="font-semibold">
                      {provider.responseTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Last Active</span>
                    <span className="font-semibold">{provider.lastActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Region</span>
                    <span className="font-semibold">{provider.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Network Bandwidth</span>
                    <span className="font-semibold">
                      {provider.resources.network.bandwidth} Mbps
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Latency</span>
                    <span className="font-semibold">
                      {provider.resources.network.latency}ms
                    </span>
                  </div>
                </CardBody>
              </Card>

              {/* Deployment Stats */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Deployment Overview</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-success-100">
                      <div className="text-2xl font-bold text-success-600">
                        {
                          deployments.filter((d) => d.status === "running")
                            .length
                        }
                      </div>
                      <div className="text-xs text-default-600">Active</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary-100">
                      <div className="text-2xl font-bold text-primary-600">
                        {new Set(deployments.map((d) => d.user)).size}
                      </div>
                      <div className="text-xs text-default-600">Users</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-default-600">
                        Total Revenue/Hour
                      </span>
                      <span className="font-semibold">
                        $
                        {deployments
                          .reduce((sum, d) => sum + d.cost, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-default-600">CPU Utilization</span>
                      <span className="font-semibold">
                        {deployments.reduce(
                          (sum, d) => sum + d.resources.cpu,
                          0,
                        )}
                        /{provider.resources.cpu.cores}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-default-600">
                        Memory Utilization
                      </span>
                      <span className="font-semibold">
                        {deployments.reduce(
                          (sum, d) => sum + d.resources.memory,
                          0,
                        )}
                        /{provider.resources.memory.total}GB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-default-600">GPU Utilization</span>
                      <span className="font-semibold">
                        {deployments.reduce(
                          (sum, d) => sum + d.resources.gpu,
                          0,
                        )}
                        /{provider.resources.gpu?.count || 0}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Actions */}
              <Card className="subnet-card">
                <CardHeader>
                  <h3 className="text-xl font-bold">Actions</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button
                    className="w-full"
                    startContent={<BarChart3 size={16} />}
                    variant="bordered"
                  >
                    View Analytics
                  </Button>
                  <Button
                    className="w-full"
                    startContent={<Users size={16} />}
                    variant="bordered"
                  >
                    Contact Provider
                  </Button>
                  <Button
                    className="w-full"
                    startContent={<Star size={16} />}
                    variant="bordered"
                  >
                    Add to Favorites
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
