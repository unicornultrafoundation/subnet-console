"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import {
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Terminal,
  Download,
  RefreshCw,
  Server,
  Database,
  Globe,
  Users,
  Send,
  Hourglass,
} from "lucide-react";

interface DeployStepProps {
  isSubmitting: boolean;
  onDeploy: () => void;
  deploymentMethod?: "bidding" | "direct-accept" | "select-provider" | null;
  selectedProvider?: string | null;
  availableProviders?: Array<{
    id: string;
    name: string;
    region: string;
    price: string;
  }>;
}

type DeploymentStatus =
  | "idle"
  | "preparing"
  | "pulling"
  | "building"
  | "deploying"
  | "completed"
  | "failed"
  | "waiting-provider" // For select-provider: waiting for provider to accept
  | "provider-accepted" // Provider accepted, now deploying
  | "provider-timeout"; // Provider didn't accept within timeout

interface DeploymentLog {
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "pending" | "active" | "completed" | "failed";
  progress: number;
}

export default function DeployStep({
  isSubmitting,
  onDeploy,
  deploymentMethod = null,
  selectedProvider = null,
  availableProviders = [],
}: DeployStepProps) {
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatus>("preparing");
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [deploymentUrl, setDeploymentUrl] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState(true);
  
  // For Direct Accept: track provider acceptance status
  const [providerStatuses, setProviderStatuses] = useState<
    Array<{
      id: string;
      name: string;
      status: "pending" | "accepted" | "rejected";
      acceptedAt?: string;
    }>
  >([]);

  // For Select Provider: track single provider acceptance
  const [waitingStartTime, setWaitingStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(1 * 60 * 1000); // 1 minute in ms
  const [selectedProviderAccepted, setSelectedProviderAccepted] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: "preparing",
      name: "Preparing Environment",
      description: "Setting up deployment infrastructure",
      icon: Server,
      status: "pending",
      progress: 0,
    },
    {
      id: "pulling",
      name:
        deploymentMethod === "direct-accept"
          ? "Sending Order to Providers"
          : "Pulling Images",
      description:
        deploymentMethod === "direct-accept"
          ? "Submitting deployment order to eligible providers"
          : "Downloading Docker images",
      icon: deploymentMethod === "direct-accept" ? Send : Download,
      status: "pending",
      progress: 0,
    },
    {
      id: "building",
      name:
        deploymentMethod === "direct-accept"
          ? "Waiting for Provider Responses"
          : "Building Containers",
      description:
        deploymentMethod === "direct-accept"
          ? "Waiting for providers to accept or decline the order"
          : "Creating application containers",
      icon: deploymentMethod === "direct-accept" ? Users : Database,
      status: "pending",
      progress: 0,
    },
    {
      id: "deploying",
      name:
        deploymentMethod === "direct-accept"
          ? "Processing Accepted Orders"
          : "Deploying Application",
      description:
        deploymentMethod === "direct-accept"
          ? "Processing and deploying to providers that accepted"
          : "Launching on provider infrastructure",
      icon: Globe,
      status: "pending",
      progress: 0,
    },
  ]);

  // Auto-start deployment when component mounts
  useEffect(() => {
    // Update steps based on deployment method
    if (deploymentMethod === "direct-accept") {
      setDeploymentSteps([
        {
          id: "preparing",
          name: "Preparing Order",
          description: "Preparing deployment order",
          icon: Server,
          status: "pending",
          progress: 0,
        },
        {
          id: "pulling",
          name: "Sending Order to Providers",
          description: "Submitting deployment order to eligible providers",
          icon: Send,
          status: "pending",
          progress: 0,
        },
        {
          id: "building",
          name: "Waiting for Provider Responses",
          description: "Waiting for providers to accept or decline the order",
          icon: Users,
          status: "pending",
          progress: 0,
        },
        {
          id: "deploying",
          name: "Processing Accepted Orders",
          description: "Processing and deploying to providers that accepted",
          icon: Globe,
          status: "pending",
          progress: 0,
        },
      ]);
    } else if (deploymentMethod === "select-provider") {
      setDeploymentSteps([
        {
          id: "preparing",
          name: "Sending Request",
          description: "Sending deployment request to selected provider",
          icon: Send,
          status: "pending",
          progress: 0,
        },
        {
          id: "pulling",
          name: "Waiting for Provider Acceptance",
          description: "Waiting for provider to accept the deployment request",
          icon: Clock,
          status: "pending",
          progress: 0,
        },
        {
          id: "building",
          name: "Preparing Environment",
          description: "Setting up deployment infrastructure",
          icon: Server,
          status: "pending",
          progress: 0,
        },
        {
          id: "deploying",
          name: "Deploying Application",
          description: "Launching on provider infrastructure",
          icon: Globe,
          status: "pending",
          progress: 0,
        },
      ]);
    }
    
    if (deploymentMethod === "direct-accept" && availableProviders.length > 0) {
      // Initialize provider statuses for Direct Accept
      setProviderStatuses(
        availableProviders.map((p) => ({
          id: p.id,
          name: p.name,
          status: "pending" as const,
        })),
      );
      simulateDirectAcceptDeployment();
    } else if (deploymentMethod === "select-provider" && selectedProvider) {
      simulateSelectProviderDeployment();
    } else if (deploymentMethod !== "direct-accept" && deploymentMethod !== "select-provider") {
      simulateDeployment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deploymentMethod, availableProviders.length, selectedProvider]);

  const addLog = (level: DeploymentLog["level"], message: string) => {
    const newLog: DeploymentLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };

    setLogs((prev) => [...prev, newLog]);
  };

  const updateStepStatus = (
    stepId: string,
    status: DeploymentStep["status"],
    progress: number,
  ) => {
    setDeploymentSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status, progress } : step,
      ),
    );
  };

  const simulateDeployment = async () => {
    setIsDeploying(true);
    setDeploymentStatus("preparing");
    setDeploymentProgress(0);
    setLogs([]);

    addLog("info", "🚀 Starting deployment process...");

    // Step 1: Preparing
    updateStepStatus("preparing", "active", 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("preparing", "active", 50);
    addLog("info", "📋 Preparing deployment environment...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("preparing", "completed", 100);
    addLog("success", "✅ Environment prepared successfully");
    setDeploymentProgress(25);

    // Step 2: Pulling Images
    updateStepStatus("pulling", "active", 0);
    setDeploymentStatus("pulling");
    addLog("info", "📦 Pulling Docker images...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateStepStatus("pulling", "active", 60);
    addLog("info", "⬇️ Downloading nginx:latest...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("pulling", "completed", 100);
    addLog("success", "✅ Image nginx:latest pulled successfully");
    setDeploymentProgress(50);

    // Step 3: Building
    updateStepStatus("building", "active", 0);
    setDeploymentStatus("building");
    addLog("info", "🔨 Building application containers...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateStepStatus("building", "active", 70);
    addLog("info", "⚙️ Configuring container settings...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("building", "completed", 100);
    addLog("success", "✅ Container build completed");
    setDeploymentProgress(75);

    // Step 4: Deploying
    updateStepStatus("deploying", "active", 0);
    setDeploymentStatus("deploying");
    addLog("info", "🌐 Deploying to provider infrastructure...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateStepStatus("deploying", "active", 80);
    addLog("info", "🔗 Establishing network connections...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("deploying", "completed", 100);
    addLog("success", "✅ Application deployed successfully");
    setDeploymentProgress(100);

    // Completed
    setDeploymentStatus("completed");
    const appUrl = "https://your-app.provider.com";

    setDeploymentUrl(appUrl);
    addLog("success", "🎉 Deployment completed successfully!");
    addLog("info", "🌍 Your application is now live and accessible");
    addLog("info", "🔗 Access your app at: " + appUrl);

    setIsDeploying(false);
  };

  const simulateDirectAcceptDeployment = async () => {
    setIsDeploying(true);
    setDeploymentStatus("preparing");
    setDeploymentProgress(0);
    setLogs([]);

    // Step 1: Preparing & Submitting Order (quick, no visible progress)
    addLog("info", "📋 Preparing deployment order...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    addLog("success", "✅ Deployment order prepared successfully");

    // Step 2: Sending to Providers (quick, no visible progress)
    addLog(
      "info",
      `📨 Sending deployment order to ${availableProviders.length} eligible providers...`,
    );
    
    // Simulate sending to each provider quickly
    for (let i = 0; i < availableProviders.length; i++) {
      const provider = availableProviders[i];
      addLog("info", `📤 Order sent to ${provider.name} (${provider.region})`);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    
    addLog(
      "success",
      `✅ Deployment order sent to all ${availableProviders.length} providers successfully`,
    );

    // Mark as completed - order sent, now waiting for provider responses
    setDeploymentStatus("completed");
    setDeploymentProgress(100);
    addLog("success", "🎉 Deployment order submitted successfully!");
    addLog(
      "info",
      `⏳ Waiting for ${availableProviders.length} provider${availableProviders.length !== 1 ? "s" : ""} to review and accept your order...`,
    );

    setIsDeploying(false);
  };

  const simulateSelectProviderDeployment = async () => {
    setIsDeploying(true);
    setDeploymentStatus("preparing");
    setDeploymentProgress(0);
    setLogs([]);
    setWaitingStartTime(Date.now());
    setTimeRemaining(1 * 60 * 1000); // 1 minute
    setSelectedProviderAccepted(false);

    // Step 1: Send request to provider
    updateStepStatus("preparing", "active", 0);
    addLog("info", "📤 Sending deployment request to selected provider...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("preparing", "active", 50);
    const selectedProviderData = availableProviders?.find(
      (p) => p.id === selectedProvider,
    ) || { id: selectedProvider || "", name: "Selected Provider", region: "Unknown" };
    if (selectedProviderData) {
      addLog(
        "info",
        `📨 Request sent to ${selectedProviderData.name} (${selectedProviderData.region})...`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("preparing", "completed", 100);
    addLog("success", "✅ Deployment request sent successfully");
    setDeploymentProgress(25);

    // Step 2: Wait for provider acceptance (with timeout)
    updateStepStatus("pulling", "active", 0);
    setDeploymentStatus("waiting-provider");
    addLog("info", "⏳ Waiting for provider to accept the deployment request...");
    addLog(
      "info",
      "⏰ You have 1 minute. The request will expire if not accepted.",
    );

    // Simulate provider acceptance after a delay (10-50 seconds)
    // The countdown timer is handled by the useEffect hook
    const acceptDelay = 10000 + Math.random() * 40000; // 10-50 seconds
    const timeoutId = setTimeout(() => {
      // 80% chance of acceptance
      if (Math.random() > 0.2) {
        setSelectedProviderAccepted(true);
        handleProviderAcceptance(selectedProviderData);
      }
    }, acceptDelay);

    // Store timeout ID for cleanup if needed
    return () => {
      clearTimeout(timeoutId);
    };
  };

  const handleProviderAcceptance = async (provider: any) => {
    setSelectedProviderAccepted(true);
    setDeploymentStatus("provider-accepted");
    addLog("success", `✅ ${provider?.name || "Provider"} accepted the deployment request!`);
    addLog("info", "🚀 Starting deployment process...");

    updateStepStatus("pulling", "completed", 100);
    setDeploymentProgress(50);

    // Step 3: Prepare Environment
    updateStepStatus("building", "active", 0);
    setDeploymentStatus("preparing");
    addLog("info", "📋 Preparing deployment environment...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateStepStatus("building", "active", 50);
    addLog("info", "⚙️ Configuring resources...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("building", "completed", 100);
    addLog("success", "✅ Environment prepared successfully");
    setDeploymentProgress(75);

    // Step 4: Deploy
    updateStepStatus("deploying", "active", 0);
    setDeploymentStatus("deploying");
    addLog("info", "🌐 Deploying to provider infrastructure...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateStepStatus("deploying", "active", 80);
    addLog("info", "🔗 Establishing connections...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStepStatus("deploying", "completed", 100);
    addLog("success", "✅ Application deployed successfully");
    setDeploymentProgress(100);

    // Completed
    setDeploymentStatus("completed");
    const appUrl = "https://your-app.provider.com";
    setDeploymentUrl(appUrl);
    addLog("success", "🎉 Deployment completed successfully!");
    addLog("info", "🌍 Your application is now live and accessible");
    addLog("info", "🔗 Access your app at: " + appUrl);

    setIsDeploying(false);
  };

  const handleProviderTimeout = () => {
    setDeploymentStatus("provider-timeout");
    setDeploymentProgress(25);
    addLog("error", "⏰ Request timeout: Provider did not accept within 1 minute");
    addLog(
      "info",
      "💡 You can try again or select a different provider",
    );
    setIsDeploying(false);
  };

  // Countdown timer for select-provider
  useEffect(() => {
    if (
      deploymentMethod === "select-provider" &&
      deploymentStatus === "waiting-provider" &&
      timeRemaining > 0 &&
      !selectedProviderAccepted
    ) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            if (!selectedProviderAccepted) {
              handleProviderTimeout();
            }
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deploymentMethod, deploymentStatus, timeRemaining, selectedProviderAccepted]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case "idle":
        return <Play className="text-primary" size={24} />;
      case "preparing":
      case "pulling":
      case "building":
      case "deploying":
        return <RefreshCw className="text-blue-500 animate-spin" size={24} />;
      case "completed":
        return <CheckCircle className="text-green-500" size={24} />;
      case "failed":
      case "provider-timeout":
        return <XCircle className="text-red-500" size={24} />;
      case "waiting-provider":
        return <Clock className="text-warning animate-pulse" size={24} />;
      case "provider-accepted":
        return <CheckCircle className="text-success animate-pulse" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = () => {
    switch (deploymentStatus) {
      case "completed":
        return "success";
      case "failed":
      case "provider-timeout":
        return "danger";
      case "waiting-provider":
        return "warning";
      case "provider-accepted":
        return "success";
      case "preparing":
      case "pulling":
      case "building":
      case "deploying":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (deploymentStatus) {
      case "idle":
        return "Ready to Deploy";
      case "preparing":
        return "Preparing Environment";
      case "pulling":
        return "Pulling Images";
      case "building":
        return "Building Containers";
      case "deploying":
        return "Deploying Application";
      case "waiting-provider":
        return "Waiting for Provider Acceptance";
      case "provider-accepted":
        return "Provider Accepted - Deploying";
      case "provider-timeout":
        return "Request Timeout";
      case "completed":
        return "Deployment Complete";
      case "failed":
        return "Deployment Failed";
      default:
        return "Unknown Status";
    }
  };

  const getLogIcon = (level: DeploymentLog["level"]) => {
    switch (level) {
      case "success":
        return <CheckCircle className="text-green-500" size={14} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={14} />;
      case "error":
        return <AlertCircle className="text-red-500" size={14} />;
      default:
        return <Terminal className="text-blue-500" size={14} />;
    }
  };

  const getStepIcon = (step: DeploymentStep) => {
    const IconComponent = step.icon;
    const iconClass =
      step.status === "completed"
        ? "text-green-500"
        : step.status === "active"
          ? "text-blue-500 animate-pulse"
          : "text-gray-400";

    return <IconComponent className={iconClass} size={20} />;
  };

  // Calculate provider counts for Direct Accept
  const acceptedProviders =
    deploymentMethod === "direct-accept"
      ? providerStatuses.filter((p) => p.status === "accepted")
      : [];
  const pendingProviders =
    deploymentMethod === "direct-accept"
      ? providerStatuses.filter((p) => p.status === "pending")
      : [];
  const rejectedProviders =
    deploymentMethod === "direct-accept"
      ? providerStatuses.filter((p) => p.status === "rejected")
      : [];

  return (
    <div className="space-y-6">
      {/* Deployment Status Header */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-2xl font-bold">{getStatusText()}</h2>
              <p className="text-sm text-default-600">
                {deploymentMethod === "direct-accept"
                  ? deploymentStatus === "idle"
                    ? "Submit your deployment order to eligible providers"
                    : deploymentStatus === "completed"
                      ? "Deployment order has been submitted. Waiting for providers to review and accept."
                      : "Preparing deployment order..."
                  : deploymentMethod === "select-provider"
                    ? deploymentStatus === "waiting-provider"
                      ? `Waiting for provider to accept. Time remaining: ${formatTimeRemaining(timeRemaining)}`
                      : deploymentStatus === "provider-timeout"
                        ? "Provider did not accept within 1 minute"
                        : deploymentStatus === "provider-accepted"
                          ? "Provider accepted! Starting deployment..."
                          : deploymentStatus === "completed"
                            ? "Your application is now live and running"
                            : deploymentStatus === "idle"
                              ? "Send deployment request to selected provider"
                              : "Deploying your application"
                    : deploymentStatus === "idle"
                      ? "Configure your deployment and launch your application"
                      : deploymentStatus === "completed"
                        ? "Your application is now live and running"
                        : "Deploying your application to the cloud"}
              </p>
            </div>
          </div>
          <Chip color={getStatusColor()} size="lg" variant="flat">
            {deploymentStatus === "idle"
              ? "Ready"
              : deploymentStatus === "completed"
                ? "Success"
                : deploymentStatus === "failed" || deploymentStatus === "provider-timeout"
                  ? "Failed"
                  : deploymentStatus === "waiting-provider"
                    ? "Waiting"
                    : deploymentStatus === "provider-accepted"
                      ? "Accepted"
                      : "In Progress"}
          </Chip>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Overall Progress - For Bidding and Select Provider (after acceptance) */}
          {deploymentStatus !== "idle" &&
            deploymentMethod !== "direct-accept" &&
            deploymentStatus !== "waiting-provider" &&
            deploymentStatus !== "provider-timeout" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold text-primary">
                    {deploymentProgress}%
                  </span>
                </div>
                <Progress
                  className="w-full h-3"
                  color={
                    deploymentStatus === "completed" ? "success" : "primary"
                  }
                  value={deploymentProgress}
                />
              </div>
            )}

          {/* Direct Accept: Order Submitted Successfully */}
          {deploymentMethod === "direct-accept" &&
            deploymentStatus === "completed" && (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold mb-2 text-success">
                  Deployment Order Submitted Successfully!
                </h3>
                <p className="text-default-600 mb-4 max-w-md mx-auto">
                  Your deployment order has been sent to{" "}
                  {availableProviders.length} eligible provider
                  {availableProviders.length !== 1 ? "s" : ""}. They are now
                  reviewing your requirements and will respond soon.
                </p>
              </div>
            )}

          {/* Provider Status (Direct Accept only) */}
          {deploymentMethod === "direct-accept" &&
            providerStatuses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Provider Responses</h3>
                <div className="grid gap-3">
                  {providerStatuses.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-default-200"
                    >
                      <div className="flex items-center gap-3">
                        {provider.status === "accepted" && (
                          <CheckCircle className="text-success" size={20} />
                        )}
                        {provider.status === "pending" && (
                          <Hourglass className="text-warning animate-pulse" size={20} />
                        )}
                        {provider.status === "rejected" && (
                          <AlertCircle className="text-danger" size={20} />
                        )}
                        <div>
                          <p className="font-semibold">{provider.name}</p>
                          {provider.acceptedAt && (
                            <p className="text-xs text-default-500">
                              Accepted at {provider.acceptedAt}
                            </p>
                          )}
                        </div>
                      </div>
                      <Chip
                        color={
                          provider.status === "accepted"
                            ? "success"
                            : provider.status === "rejected"
                              ? "danger"
                              : "warning"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {provider.status === "accepted"
                          ? "Accepted"
                          : provider.status === "rejected"
                            ? "Declined"
                            : "Waiting..."}
                      </Chip>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    <span>
                      {acceptedProviders.length} Accepted
                    </span>
                  </div>
                  {pendingProviders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Hourglass className="text-warning" size={16} />
                      <span>{pendingProviders.length} Pending</span>
                    </div>
                  )}
                  {rejectedProviders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="text-danger" size={16} />
                      <span>{rejectedProviders.length} Declined</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Deployment Steps - For Bidding and Select Provider (after acceptance) */}
          {deploymentStatus !== "idle" &&
            deploymentMethod !== "direct-accept" &&
            deploymentStatus !== "waiting-provider" &&
            deploymentStatus !== "provider-timeout" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deployment Steps</h3>
                <div className="grid gap-4">
                {deploymentSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/50"
                  >
                    <div className="flex-shrink-0">{getStepIcon(step)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{step.name}</h4>
                        <Chip
                          color={
                            step.status === "completed"
                              ? "success"
                              : step.status === "active"
                                ? "primary"
                                : "default"
                          }
                          size="sm"
                          variant="flat"
                        >
                          {step.status === "completed"
                            ? "Completed"
                            : step.status === "active"
                              ? "In Progress"
                              : "Pending"}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">
                        {step.description}
                      </p>
                      {step.status === "active" && (
                        <Progress
                          className="w-full h-2"
                          color="primary"
                          value={step.progress}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Accept: Waiting Message */}
          {deploymentMethod === "direct-accept" &&
            deploymentStatus === "completed" && (
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Hourglass className="text-success animate-pulse" size={20} />
                  <div>
                    <h4 className="font-semibold text-success">
                      Waiting for Provider Responses
                    </h4>
                    <p className="text-sm text-default-600 mt-1">
                      Providers are reviewing your deployment order. You will be
                      notified once they accept or decline. This may take a few
                      minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Select Provider: Waiting for Acceptance */}
          {deploymentMethod === "select-provider" &&
            deploymentStatus === "waiting-provider" && (
              <div className="text-center py-6">
                <Clock className="mx-auto mb-4 text-warning animate-pulse" size={48} />
                <h3 className="text-2xl font-semibold mb-2 text-warning">
                  Waiting for Provider Acceptance
                </h3>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4 max-w-md mx-auto">
                  <div className="text-3xl font-bold text-warning mb-2">
                    {formatTimeRemaining(timeRemaining)}
                  </div>
                  <p className="text-sm text-default-600">
                    Time remaining before request expires
                  </p>
                </div>
                <p className="text-default-600 mb-2">
                  Your deployment request has been sent to the selected provider.
                </p>
                <p className="text-sm text-default-500">
                  The provider has 1 minute to accept. Deployment will start
                  automatically once accepted.
                </p>
              </div>
            )}

          {/* Select Provider: Timeout */}
          {deploymentMethod === "select-provider" &&
            deploymentStatus === "provider-timeout" && (
              <div className="text-center py-6">
                <XCircle className="mx-auto mb-4 text-danger" size={48} />
                <h3 className="text-2xl font-semibold mb-2 text-danger">
                  Request Timeout
                </h3>
                <p className="text-default-600 mb-4 max-w-md mx-auto">
                  The provider did not accept your deployment request within 1
                  minute. The request has expired.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    color="primary"
                    startContent={<RefreshCw size={20} />}
                    onClick={() => {
                      setDeploymentStatus("preparing");
                      setDeploymentProgress(0);
                      setLogs([]);
                      setWaitingStartTime(null);
                      setTimeRemaining(1 * 60 * 1000);
                      setSelectedProviderAccepted(false);
                      setIsDeploying(true);
                      setTimeout(() => {
                        simulateSelectProviderDeployment();
                      }, 100);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

          {/* Action Buttons */}

          {deploymentStatus === "completed" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold mb-2 text-green-600">
                Deployment Successful!
              </h3>
              <p className="text-default-600 mb-4 max-w-md mx-auto">
                Your application has been successfully deployed and is now live.
              </p>
              {deploymentUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-800">
                      Your Application URL:
                    </span>
                  </div>
                  <a
                    className="text-green-600 hover:text-green-700 font-mono text-sm break-all"
                    href={deploymentUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {deploymentUrl}
                  </a>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Button
                  color="success"
                  startContent={<Globe size={20} />}
                  onClick={() => {
                    // Open deployment URL in new tab
                    window.open(deploymentUrl, "_blank");
                  }}
                >
                  View Deployment
                </Button>
                <Button
                  color="primary"
                  startContent={<Download size={20} />}
                  variant="bordered"
                >
                  Download Logs
                </Button>
                <Button
                  color="primary"
                  startContent={<RefreshCw size={20} />}
                  onClick={() => {
                    setDeploymentStatus("preparing");
                    setDeploymentProgress(0);
                    setLogs([]);
                    setDeploymentSteps((prev) =>
                      prev.map((step) => ({
                        ...step,
                        status: "pending",
                        progress: 0,
                      })),
                    );
                    setIsDeploying(true);
                    // Restart deployment
                    setTimeout(() => {
                      simulateDeployment();
                    }, 100);
                  }}
                >
                  Deploy Again
                </Button>
              </div>
            </div>
          )}

          {/* Direct Accept: Action Buttons */}
          {deploymentMethod === "direct-accept" &&
            deploymentStatus === "completed" && (
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  color="primary"
                  startContent={<Download size={20} />}
                  variant="bordered"
                >
                  Download Order Details
                </Button>
                <Button
                  color="primary"
                  startContent={<RefreshCw size={20} />}
                  onClick={() => {
                    setDeploymentStatus("preparing");
                    setDeploymentProgress(0);
                    setLogs([]);
                    setProviderStatuses(
                      availableProviders.map((p) => ({
                        id: p.id,
                        name: p.name,
                        status: "pending" as const,
                      })),
                    );
                    setIsDeploying(true);
                    setTimeout(() => {
                      simulateDirectAcceptDeployment();
                    }, 100);
                  }}
                >
                  Resubmit Order
                </Button>
              </div>
            )}
        </CardBody>
      </Card>

      {/* Deployment Logs */}
      {logs.length > 0 && (
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-2">
            <Terminal className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Deployment Logs</h2>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 mb-1">
                  <span className="text-gray-500 text-xs mt-0.5">
                    [{log.timestamp}]
                  </span>
                  <div className="flex items-center gap-1">
                    {getLogIcon(log.level)}
                  </div>
                  <span
                    className={`
                    ${
                      log.level === "success"
                        ? "text-green-400"
                        : log.level === "warning"
                          ? "text-yellow-400"
                          : log.level === "error"
                            ? "text-red-400"
                            : "text-blue-400"
                    }
                  `}
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
