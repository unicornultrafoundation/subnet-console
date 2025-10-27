"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Settings } from "lucide-react";

interface BasicInfoStepProps {
  deploymentName: string;
  description: string;
  maxPrice: string;
  onDeploymentNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  validationErrors: string[];
}

export default function BasicInfoStep({
  deploymentName,
  description,
  maxPrice,
  onDeploymentNameChange,
  onDescriptionChange,
  onMaxPriceChange,
  validationErrors,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 text-danger">
              <Settings size={16} />
              <span className="font-medium">
                Please fix the following issues:
              </span>
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

      {/* Basic Information */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <Settings className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Basic Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              isRequired
              label="Deployment Name"
              placeholder="Enter deployment name"
              value={deploymentName}
              onChange={(e) => onDeploymentNameChange(e.target.value)}
            />
            <Input
              isRequired
              label="Max Price (SCU/hour)"
              min="0"
              placeholder="1.0"
              step="0.1"
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </div>
          <Input
            multiline
            label="Description"
            minRows={3}
            placeholder="Enter deployment description (optional)"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </CardBody>
      </Card>
    </div>
  );
}
