"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Settings } from "lucide-react";

interface Region {
  id: string;
  name: string;
  description: string;
}

interface BasicInfoProps {
  deploymentName: string;
  description: string;
  maxPrice: string;
  selectedRegion: string;
  regions: Region[];
  onDeploymentNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}

export default function BasicInfo({
  deploymentName,
  description,
  maxPrice,
  selectedRegion,
  regions,
  onDeploymentNameChange,
  onDescriptionChange,
  onMaxPriceChange,
  onRegionChange,
}: BasicInfoProps) {
  return (
    <Card className="subnet-card">
      <CardHeader className="flex items-center gap-2">
        <Settings className="text-primary" size={20} />
        <h2 className="text-xl font-semibold">Deployment Information</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <Input
          isRequired
          label="Deployment Name"
          placeholder="my-web-app"
          value={deploymentName}
          onChange={(e) => onDeploymentNameChange(e.target.value)}
        />
        <Input
          label="Description"
          placeholder="Describe your deployment..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />

        <div className="space-y-4">
          <Input
            label="Max Price (SCU/hour)"
            min="0"
            placeholder="1.0"
            startContent="$"
            step="0.1"
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />

          <Select
            className="w-full"
            defaultSelectedKeys={new Set(["any"])}
            label="Region"
            placeholder="Select region"
            selectedKeys={new Set([selectedRegion])}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;

              console.log("Region selected:", selectedKey);
              onRegionChange(selectedKey || "any");
            }}
          >
            {regions.map((region) => (
              <SelectItem key={region.id} textValue={region.name}>
                <div className="flex flex-col">
                  <span className="font-medium">{region.name}</span>
                  <span className="text-xs text-default-500">
                    {region.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
          <p className="text-xs text-primary mt-1">
            Current selection:{" "}
            {regions.find((r) => r.id === selectedRegion)?.name || "Any Region"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
