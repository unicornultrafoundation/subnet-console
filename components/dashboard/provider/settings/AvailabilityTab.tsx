"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Shield } from "lucide-react";

import { ProviderConfig } from "./types";

interface AvailabilityTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
}

export function AvailabilityTab({
  config,
  updateConfig,
}: AvailabilityTabProps) {
  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield size={20} />
          <h2 className="text-xl font-bold">Availability Settings</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              checked={config.availability.autoAcceptDeployments}
              className="w-5 h-5 rounded border-gray-300"
              type="checkbox"
              onChange={(e) =>
                updateConfig(
                  "availability.autoAcceptDeployments",
                  e.target.checked,
                )
              }
            />
            <div>
              <div className="font-medium">Auto-accept Deployments</div>
              <div className="text-sm text-default-600">
                Automatically accept deployment requests without manual approval
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              checked={config.availability.requireApproval}
              className="w-5 h-5 rounded border-gray-300"
              type="checkbox"
              onChange={(e) =>
                updateConfig("availability.requireApproval", e.target.checked)
              }
            />
            <div>
              <div className="font-medium">Require Approval</div>
              <div className="text-sm text-default-600">
                Require manual approval for all deployment requests
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Max Concurrent Deployments
          </label>
          <Input
            min="1"
            placeholder="100"
            type="number"
            value={config.availability.maxConcurrentDeployments.toString()}
            onChange={(e) =>
              updateConfig(
                "availability.maxConcurrentDeployments",
                parseInt(e.target.value),
              )
            }
          />
          <p className="text-xs text-default-500 mt-1">
            Maximum number of deployments that can run simultaneously
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
