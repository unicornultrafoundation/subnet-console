"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Code, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import ServiceConfigurationWrapper from "./ServiceConfigurationWrapper";

interface ApplicationConfigurationProps {
  services: any[];
  onUpdateService: (serviceName: string, field: string, value: any) => void;
  onRemoveService: (serviceName: string) => void;
}

export default function ApplicationConfiguration({
  services,
  onUpdateService,
  onRemoveService,
}: ApplicationConfigurationProps) {
  const [collapsedServices, setCollapsedServices] = useState<Set<number>>(
    new Set(),
  );

  const toggleServiceCollapse = (index: number) => {
    const newCollapsed = new Set(collapsedServices);

    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedServices(newCollapsed);
  };

  return (
    <Card className="subnet-card">
      <CardHeader className="flex items-center gap-2">
        <Code className="text-primary" size={20} />
        <h2 className="text-xl font-semibold">Application Configuration</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-default-600">
          Customize the selected application configuration. You can modify
          environment variables, resources, and other settings.
        </p>

        <div className="space-y-4">
          {services.map((service, index) => (
            <Card key={index} className="border border-default-200">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <Chip color="primary" size="sm" variant="flat">
                    Service {index + 1}
                  </Chip>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    color="default"
                    size="sm"
                    variant="light"
                    onClick={() => toggleServiceCollapse(index)}
                  >
                    {collapsedServices.has(index) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronUp size={16} />
                    )}
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    variant="light"
                    onClick={() => onRemoveService(service.name)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>
              {!collapsedServices.has(index) && (
                <CardBody>
                  <ServiceConfigurationWrapper
                    availableServices={services
                      .filter((s) => s.name !== service.name)
                      .map((s) => s.name)}
                    service={service}
                    onUpdateService={onUpdateService}
                  />
                </CardBody>
              )}
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
