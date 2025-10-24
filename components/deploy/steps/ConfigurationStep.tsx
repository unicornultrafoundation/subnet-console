"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Code } from "lucide-react";
import Configuration from "../Configuration";

interface ConfigurationStepProps {
  applications: any[];
  deploymentMode: "template" | "application";
  favouriteApps: string[];
  selectedApplication: any;
  services: any[];
  onApplicationSelect: (application: any) => void;
  onUpdateService: (index: number, updatedService: any) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onMaxPriceChange: (price: string) => void;
  validationErrors: string[];
}

export default function ConfigurationStep({
  applications,
  deploymentMode,
  favouriteApps,
  selectedApplication,
  services,
  onApplicationSelect,
  onUpdateService,
  onAddService,
  onRemoveService,
  onMaxPriceChange,
  validationErrors
}: ConfigurationStepProps) {
  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 text-danger">
              <Code size={16} />
              <span className="font-medium">Please fix the following issues:</span>
            </div>
            <ul className="mt-2 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-danger-600">
                  • {error}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {/* Configuration */}
      <Configuration
        applications={applications}
        deploymentMode={deploymentMode}
        favouriteApps={favouriteApps}
        selectedApp={selectedApplication?.id || ""}
        selectedTemplate={null}
        services={services}
        onAddService={onAddService}
        onApplicationSelect={(appId) => {
          const app = applications.find(a => a.id === appId);
          if (app) onApplicationSelect(app);
        }}
        onRemoveService={(serviceName) => {
          const index = services.findIndex(s => s.name === serviceName);
          if (index !== -1) onRemoveService(index);
        }}
        onToggleFavouriteApp={() => {}}
        onUpdateService={(serviceName, field, value) => {
          const index = services.findIndex(s => s.name === serviceName);
          if (index !== -1) {
            const updatedService = { ...services[index] };
            
            // Handle nested field updates
            if (field === "gpu_units") {
              updatedService.resources = {
                ...updatedService.resources,
                gpu: {
                  ...updatedService.resources.gpu,
                  units: value
                }
              };
            } else if (field === "cpu") {
              updatedService.resources = {
                ...updatedService.resources,
                cpu: { units: value }
              };
            } else if (field === "memory") {
              updatedService.resources = {
                ...updatedService.resources,
                memory: { size: value }
              };
            } else if (field === "storage") {
              updatedService.resources = {
                ...updatedService.resources,
                storage: [{ size: value }]
              };
            } else if (field === "gpu_configs") {
              updatedService.resources = {
                ...updatedService.resources,
                gpu: {
                  ...updatedService.resources.gpu,
                  configs: value
                }
              };
            } else {
              // Direct field update
              updatedService[field] = value;
            }
            
            onUpdateService(index, updatedService);
          }
        }}
      />
    </div>
  );
}
