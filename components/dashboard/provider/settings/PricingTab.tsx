"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DollarSign } from "lucide-react";

import { ProviderConfig } from "./types";

interface PricingTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
}

export function PricingTab({ config, updateConfig }: PricingTabProps) {
  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign size={20} />
          <h2 className="text-xl font-bold">Pricing Configuration</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="bg-primary/5 p-4 rounded-lg">
          <p className="text-sm text-default-600">
            Configure your resource pricing per hour. These prices will be
            applied to all deployments across your provider infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              CPU Price (per core/hour)
            </label>
            <Input
              min="0"
              placeholder="0.05"
              startContent="$"
              step="0.01"
              type="number"
              value={config.pricing.cpu.toString()}
              onChange={(e) =>
                updateConfig("pricing.cpu", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Memory Price (per GB/hour)
            </label>
            <Input
              min="0"
              placeholder="0.02"
              startContent="$"
              step="0.01"
              type="number"
              value={config.pricing.memory.toString()}
              onChange={(e) =>
                updateConfig("pricing.memory", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Storage Price (per GB/hour)
            </label>
            <Input
              min="0"
              placeholder="0.01"
              startContent="$"
              step="0.01"
              type="number"
              value={config.pricing.storage.toString()}
              onChange={(e) =>
                updateConfig("pricing.storage", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              GPU Price (per GPU/hour)
            </label>
            <Input
              min="0"
              placeholder="0.25"
              startContent="$"
              step="0.01"
              type="number"
              value={config.pricing.gpu.toString()}
              onChange={(e) =>
                updateConfig("pricing.gpu", parseFloat(e.target.value))
              }
            />
            <p className="text-xs text-default-500 mt-1">
              Price for the GPU type configured in the General tab.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Bandwidth Price (per Mbps/hour)
            </label>
            <Input
              min="0"
              placeholder="0.001"
              startContent="$"
              step="0.001"
              type="number"
              value={config.pricing.bandwidth.toString()}
              onChange={(e) =>
                updateConfig("pricing.bandwidth", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Charge (per hour)
            </label>
            <Input
              min="0"
              placeholder="0.15"
              startContent="$"
              step="0.01"
              type="number"
              value={config.pricing.minimumCharge.toString()}
              onChange={(e) =>
                updateConfig(
                  "pricing.minimumCharge",
                  parseFloat(e.target.value),
                )
              }
            />
          </div>
        </div>

        <div className="bg-success-50 p-4 rounded-lg border border-success-200">
          <h4 className="font-semibold mb-2">Estimated Monthly Revenue</h4>
          <p className="text-sm text-default-600">
            Based on current pricing and average resource usage, your estimated
            monthly revenue would be calculated here.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
