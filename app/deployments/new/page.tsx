"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Server,
  Shield,
  Star,
  Zap,
  AlertCircle,
} from "lucide-react";

interface Bid {
  id: string;
  providerId: string;
  providerName: string;
  price: number;
  estimatedUptime: number;
  reputation: number;
  location: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
  estimatedDeployTime: string;
}

interface Deployment {
  id: string;
  name: string;
  status: "bidding" | "deploying" | "running" | "stopped";
  maxPrice: number;
  sdl: any;
  createdAt: string;
  bids: Bid[];
}

function BiddingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deploymentName = searchParams.get("name");

  const [deployment, setDeployment] = useState<Deployment>({
    id: "deploy-001",
    name: deploymentName || "my-web-app",
    status: "bidding",
    maxPrice: 1000,
    sdl: {},
    createdAt: new Date().toISOString(),
    bids: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Mock data for bids
  const mockBids: Bid[] = [
    {
      id: "bid-001",
      providerId: "provider-001",
      providerName: "CloudTech Solutions",
      price: 850,
      estimatedUptime: 99.5,
      reputation: 4.8,
      location: "US East",
      resources: {
        cpu: "200m",
        memory: "256Mi",
        storage: "2Gi",
      },
      status: "pending",
      submittedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      estimatedDeployTime: "2-3 minutes",
    },
    {
      id: "bid-002",
      providerId: "provider-002",
      providerName: "Global Compute",
      price: 920,
      estimatedUptime: 99.9,
      reputation: 4.9,
      location: "EU West",
      resources: {
        cpu: "150m",
        memory: "200Mi",
        storage: "1.5Gi",
      },
      status: "pending",
      submittedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      estimatedDeployTime: "1-2 minutes",
    },
    {
      id: "bid-003",
      providerId: "provider-003",
      providerName: "FastDeploy Inc",
      price: 750,
      estimatedUptime: 98.8,
      reputation: 4.6,
      location: "Asia Pacific",
      resources: {
        cpu: "100m",
        memory: "128Mi",
        storage: "1Gi",
      },
      status: "pending",
      submittedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      estimatedDeployTime: "3-4 minutes",
    },
  ];

  useEffect(() => {
    // Simulate loading bids
    const timer = setTimeout(() => {
      setDeployment((prev) => ({
        ...prev,
        bids: mockBids,
      }));
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptBid = async (bidId: string) => {
    setDeployment((prev) => ({
      ...prev,
      bids: prev.bids.map((bid) =>
        bid.id === bidId
          ? { ...bid, status: "accepted" as const }
          : { ...bid, status: "rejected" as const },
      ),
      status: "deploying" as const,
    }));

    // Simulate deployment process
    setTimeout(() => {
      setDeployment((prev) => ({
        ...prev,
        status: "running" as const,
      }));

      // Redirect to deployment detail page
      router.push(`/deployments/${deployment.id}`);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bidding":
        return "warning";
      case "deploying":
        return "primary";
      case "running":
        return "success";
      case "stopped":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "bidding":
        return <Clock size={16} />;
      case "deploying":
        return <Zap size={16} />;
      case "running":
        return <CheckCircle size={16} />;
      case "stopped":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            isIconOnly
            className="text-default-600"
            variant="light"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{deployment.name}</h1>
              <Chip
                color={getStatusColor(deployment.status)}
                startContent={getStatusIcon(deployment.status)}
                variant="flat"
              >
                {deployment.status.charAt(0).toUpperCase() +
                  deployment.status.slice(1)}
              </Chip>
            </div>
            <p className="text-default-600">
              Max Price: {deployment.maxPrice} SCU/hour • Created:{" "}
              {new Date(deployment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-default-600">Waiting for provider bids...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bidding Status */}
            <Card className="subnet-card">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Provider Bids</h2>
                  <span className="text-sm text-default-600">
                    {deployment.bids.length} bids received
                  </span>
                </div>

                {deployment.bids.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock
                      className="text-default-400 mx-auto mb-4"
                      size={48}
                    />
                    <p className="text-default-600">No bids received yet</p>
                    <p className="text-sm text-default-500">
                      Providers are evaluating your deployment request
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deployment.bids
                      .sort((a, b) => a.price - b.price)
                      .map((bid) => (
                        <Card
                          key={bid.id}
                          className={`border-2 transition-all ${
                            bid.status === "accepted"
                              ? "border-success bg-success-50"
                              : bid.status === "rejected"
                                ? "border-danger bg-danger-50"
                                : "border-default-200 hover:border-primary"
                          }`}
                        >
                          <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                  <Server className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {bid.providerName}
                                  </h3>
                                  <p className="text-sm text-default-600">
                                    {bid.location}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  {bid.price} SCU/hour
                                </div>
                                <div className="text-sm text-default-600">
                                  {bid.estimatedDeployTime}
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Star className="text-warning" size={16} />
                                <span className="text-sm">
                                  <span className="font-semibold">
                                    {bid.reputation}
                                  </span>
                                  <span className="text-default-600">
                                    {" "}
                                    reputation
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Shield className="text-success" size={16} />
                                <span className="text-sm">
                                  <span className="font-semibold">
                                    {bid.estimatedUptime}%
                                  </span>
                                  <span className="text-default-600">
                                    {" "}
                                    uptime
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="text-primary" size={16} />
                                <span className="text-sm">
                                  <span className="font-semibold">
                                    {bid.resources.cpu}
                                  </span>
                                  <span className="text-default-600"> CPU</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Server className="text-secondary" size={16} />
                                <span className="text-sm">
                                  <span className="font-semibold">
                                    {bid.resources.memory}
                                  </span>
                                  <span className="text-default-600"> RAM</span>
                                </span>
                              </div>
                            </div>

                            {bid.status === "pending" && (
                              <div className="flex gap-3">
                                <Button
                                  className="flex-1"
                                  color="success"
                                  startContent={<CheckCircle size={16} />}
                                  onClick={() => handleAcceptBid(bid.id)}
                                >
                                  Accept Bid
                                </Button>
                                <Button
                                  className="flex-1"
                                  color="danger"
                                  variant="bordered"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}

                            {bid.status === "accepted" && (
                              <div className="flex items-center gap-2 text-success">
                                <CheckCircle size={16} />
                                <span className="font-semibold">
                                  Bid Accepted - Deploying...
                                </span>
                              </div>
                            )}

                            {bid.status === "rejected" && (
                              <div className="flex items-center gap-2 text-danger">
                                <AlertCircle size={16} />
                                <span className="font-semibold">
                                  Bid Rejected
                                </span>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Deployment Progress */}
            {deployment.status === "deploying" && (
              <Card className="subnet-card">
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Deployment Progress
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Initializing deployment...</span>
                      <span className="text-sm text-default-600">30%</span>
                    </div>
                    <Progress color="primary" value={30} />
                    <p className="text-sm text-default-600">
                      Your application is being deployed. This usually takes 2-5
                      minutes.
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BiddingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BiddingPageContent />
    </Suspense>
  );
}
