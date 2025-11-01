"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Server } from "lucide-react";

import { ProviderConfig } from "./types";

interface ResourceLimitsTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
}

export function ResourceLimitsTab({
  config,
  updateConfig,
}: ResourceLimitsTabProps) {
  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server size={20} />
          <h2 className="text-xl font-bold">Resource Limits</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
          <p className="text-sm text-default-600">
            Set maximum resource limits per deployment to prevent resource abuse
            and ensure fair usage across all users.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Max CPU per Deployment
            </label>
            <Input
              min="1"
              placeholder="64"
              type="number"
              value={config.limits.maxCpuPerDeployment.toString()}
              onChange={(e) =>
                updateConfig(
                  "limits.maxCpuPerDeployment",
                  parseInt(e.target.value),
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Max Memory per Deployment (GB)
            </label>
            <Input
              min="1"
              placeholder="256"
              type="number"
              value={config.limits.maxMemoryPerDeployment.toString()}
              onChange={(e) =>
                updateConfig(
                  "limits.maxMemoryPerDeployment",
                  parseInt(e.target.value),
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Max Storage per Deployment (GB)
            </label>
            <Input
              min="1"
              placeholder="2000"
              type="number"
              value={config.limits.maxStoragePerDeployment.toString()}
              onChange={(e) =>
                updateConfig(
                  "limits.maxStoragePerDeployment",
                  parseInt(e.target.value),
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Max GPU per Deployment
            </label>
            <Input
              min="0"
              placeholder="8"
              type="number"
              value={config.limits.maxGpuPerDeployment.toString()}
              onChange={(e) =>
                updateConfig(
                  "limits.maxGpuPerDeployment",
                  parseInt(e.target.value),
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Max Deployments per User
            </label>
            <Input
              min="1"
              placeholder="20"
              type="number"
              value={config.limits.maxDeploymentsPerUser.toString()}
              onChange={(e) =>
                updateConfig(
                  "limits.maxDeploymentsPerUser",
                  parseInt(e.target.value),
                )
              }
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
