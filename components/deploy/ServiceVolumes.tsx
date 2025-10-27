"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { HardDrive, ChevronUp, ChevronDown } from "lucide-react";

import VolumeConfiguration from "./VolumeConfiguration";

interface ServiceVolumesProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function ServiceVolumes({
  service,
  onUpdateService,
}: ServiceVolumesProps) {
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
        onClick={() => toggleSection("volumes")}
      >
        <div className="flex items-center gap-2">
          <HardDrive className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Volumes</h2>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={(e) => {
            e.stopPropagation();
            toggleSection("volumes");
          }}
        >
          {collapsedSections.has("volumes") ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronUp size={16} />
          )}
        </Button>
      </CardHeader>
      {!collapsedSections.has("volumes") && (
        <CardBody>
          <VolumeConfiguration
            service={service}
            onUpdateService={onUpdateService}
          />
        </CardBody>
      )}
    </Card>
  );
}
