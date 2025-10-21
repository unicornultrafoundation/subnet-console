"use client";

import { useMemo } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Play,
  Search,
  Server,
  XCircle,
} from "lucide-react";

type DeploymentStatus = "pending" | "running" | "failed" | "completed";

interface DeploymentItem {
  id: string;
  name: string;
  application: string;
  provider: string;
  region: string;
  pricePerHour: string; // SCU/hour
  createdAt: string; // ISO string
  status: DeploymentStatus;
}

const STATUS_META: Record<
  DeploymentStatus,
  {
    label: string;
    color: "default" | "primary" | "success" | "warning" | "danger";
  }
> = {
  pending: { label: "Pending", color: "warning" },
  running: { label: "Running", color: "primary" },
  failed: { label: "Failed", color: "danger" },
  completed: { label: "Completed", color: "success" },
};

export default function DeploymentsPage() {
  const router = useRouter();

  // Mock data for user's deployments
  const deployments: DeploymentItem[] = useMemo(
    () => [
      {
        id: "dep-001",
        name: "my-nginx-site",
        application: "Nginx Web Server",
        provider: "Quantum Computing Solutions",
        region: "north-america",
        pricePerHour: "1.2",
        createdAt: "2025-10-18T10:12:00.000Z",
        status: "running",
      },
      {
        id: "dep-002",
        name: "ml-train-job-01",
        application: "ML Training",
        provider: "CloudTech Infrastructure",
        region: "asia-pacific",
        pricePerHour: "3.7",
        createdAt: "2025-10-17T08:45:00.000Z",
        status: "pending",
      },
      {
        id: "dep-003",
        name: "rpc-node-mainnet",
        application: "Blockchain Node",
        provider: "Edge Computing Network",
        region: "europe",
        pricePerHour: "2.4",
        createdAt: "2025-10-15T14:20:00.000Z",
        status: "failed",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">My Deployments</h1>
            <p className="text-default-600">
              Manage and monitor your active and past deployments.
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Play size={16} />}
            onClick={() => router.push("/deploy")}
          >
            New Deployment
          </Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search by name or app"
            startContent={<Search size={16} />}
          />
          <Input placeholder="Filter by provider" />
          <Input placeholder="Filter by status (running, pending...)" />
        </div>

        {/* List */}
        <div className="space-y-4">
          {deployments.map((d) => (
            <Card key={d.id} className="subnet-card">
              <CardBody className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {d.status === "running" && (
                        <Server className="text-primary" size={20} />
                      )}
                      {d.status === "pending" && (
                        <Clock className="text-warning" size={20} />
                      )}
                      {d.status === "failed" && (
                        <XCircle className="text-danger" size={20} />
                      )}
                      {d.status === "completed" && (
                        <CheckCircle className="text-success" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{d.name}</h3>
                        <Chip
                          color={STATUS_META[d.status].color}
                          size="sm"
                          variant="flat"
                        >
                          {STATUS_META[d.status].label}
                        </Chip>
                      </div>
                      <div className="text-sm text-default-600">
                        <span className="font-medium">App:</span>{" "}
                        {d.application} ·{" "}
                        <span className="font-medium">Provider:</span>{" "}
                        {d.provider} ·{" "}
                        <span className="font-medium">Region:</span> {d.region}
                      </div>
                      <div className="text-sm text-default-500 mt-1">
                        Started {new Date(d.createdAt).toLocaleString()} ·{" "}
                        {d.pricePerHour} SCU/hour
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:self-start">
                    <Button
                      variant="bordered"
                      onClick={() => router.push(`/deployments/${d.id}`)}
                    >
                      View Details
                    </Button>
                    {d.status === "running" && (
                      <Button color="danger" variant="flat">
                        Stop
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
