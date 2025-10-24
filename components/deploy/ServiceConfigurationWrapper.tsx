"use client";

import React from "react";
import BuilderConfiguration from "./BuilderConfiguration";

interface ServiceConfigurationWrapperProps {
  service: any;
  onUpdateService: (serviceName: string, field: string, value: any) => void;
  availableServices: string[];
}

export default function ServiceConfigurationWrapper({ 
  service, 
  onUpdateService, 
  availableServices 
}: ServiceConfigurationWrapperProps) {
  const handleUpdateService = (field: string, value: any) => {
    onUpdateService(service.name, field, value);
  };

  return (
    <BuilderConfiguration
      service={service}
      onUpdateService={handleUpdateService}
      availableServices={availableServices}
    />
  );
}
