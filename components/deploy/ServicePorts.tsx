"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Code, ChevronUp, ChevronDown } from "lucide-react";

import PortExposureConfiguration from "./PortExposureConfiguration";

interface ServicePortsProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
  availableServices?: string[];
}

export default function ServicePorts({
  service,
  onUpdateService,
  availableServices = [],
}: ServicePortsProps) {
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);

    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  return (
    <Card className="subnet-card">
      <CardHeader
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection("ports")}
      >
        <div className="flex items-center gap-2">
          <Code className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Port Exposure</h2>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={(e) => {
            e.stopPropagation();
            toggleSection("ports");
          }}
        >
          {collapsedSections.has("ports") ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronUp size={16} />
          )}
        </Button>
      </CardHeader>
      {!collapsedSections.has("ports") && (
        <CardBody>
          <PortExposureConfiguration
            availableServices={availableServices}
            service={service}
            onUpdateService={onUpdateService}
          />
        </CardBody>
      )}
    </Card>
  );
}
