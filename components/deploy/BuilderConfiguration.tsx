"use client";

import React from "react";
import ServiceBasicConfig from "./ServiceBasicConfig";
import ServiceResources from "./ServiceResources";
import ServiceVolumes from "./ServiceVolumes";
import ServicePorts from "./ServicePorts";

interface BuilderConfigurationProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
  availableServices?: string[];
}

export default function BuilderConfiguration({ service, onUpdateService, availableServices = [] }: BuilderConfigurationProps) {
  return (
    <div className="space-y-6">
      <ServiceBasicConfig service={service} onUpdateService={onUpdateService} />
      <ServiceResources service={service} onUpdateService={onUpdateService} />
      <ServiceVolumes service={service} onUpdateService={onUpdateService} />
      <ServicePorts service={service} onUpdateService={onUpdateService} availableServices={availableServices} />
    </div>
  );
}