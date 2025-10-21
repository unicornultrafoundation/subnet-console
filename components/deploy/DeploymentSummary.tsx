"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Settings } from "lucide-react";

interface DeploymentSummaryProps {
  deploymentName: string;
  description: string;
  maxPrice: string;
  selectedRegion: string;
  deploymentMode: "template" | "application";
  selectedTemplate: any;
  services: any[];
  totalCpu: number;
  totalMemory: string;
  totalStorage: string;
  totalGpu: number;
  selectedBid: string;
  bids: any[];
}

export default function DeploymentSummary({
  deploymentName,
  description: _description,
  maxPrice,
  selectedRegion,
  deploymentMode,
  selectedTemplate,
  services,
  totalCpu,
  totalMemory,
  totalStorage,
  totalGpu,
  selectedBid,
  bids,
}: DeploymentSummaryProps) {
  const selectedBidData = bids.find((bid) => bid.id === selectedBid);

  return (
    <Card className="subnet-card shadow-lg">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="text-primary" size={20} />
          Deployment Summary
        </h3>
      </CardHeader>
      <CardBody className="space-y-4 pt-0">
        {/* Basic Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-default-700">Basic Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-default-600">Name:</span>
              <span className="font-semibold">
                {deploymentName || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Mode:</span>
              <Chip color="primary" size="sm" variant="flat">
                {deploymentMode === "template"
                  ? "Template Builder"
                  : "Application"}
              </Chip>
            </div>
            {selectedTemplate && (
              <div className="flex justify-between">
                <span className="text-default-600">Template:</span>
                <span className="font-medium text-sm">
                  {selectedTemplate.name}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-default-600">Max Price:</span>
              <span className="font-semibold">{maxPrice} SCU/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Region:</span>
              <span className="font-semibold">{selectedRegion}</span>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="font-semibold text-default-700">Resources</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-default-600">CPU:</span>
              <span className="font-medium">{totalCpu} units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-default-600">Memory:</span>
              <span className="font-medium">{totalMemory}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-default-600">Storage:</span>
              <span className="font-medium">{totalStorage}</span>
            </div>
            {totalGpu > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-default-600">GPU:</span>
                <span className="font-medium">{totalGpu} units</span>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <h4 className="font-semibold text-default-700">Services</h4>
          <div className="space-y-2">
            {services.length === 0 ? (
              <p className="text-sm text-default-500">No services configured</p>
            ) : (
              services.map((service, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-default-600">{service.name}:</span>
                  <span className="font-medium">
                    {service.resources.cpu.units} CPU,{" "}
                    {service.resources.memory.size}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Bid */}
        {selectedBidData && (
          <div className="space-y-3">
            <h4 className="font-semibold text-default-700">
              Selected Provider
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Provider:</span>
                <span className="font-medium">
                  {selectedBidData.provider.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Price:</span>
                <span className="font-medium text-primary">
                  {selectedBidData.price} SCU/hour
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Location:</span>
                <span className="font-medium">
                  {selectedBidData.provider.location}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
