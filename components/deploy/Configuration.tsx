"use client";

import React from "react";
import ApplicationConfiguration from "./ApplicationConfiguration";

interface ConfigurationProps {
  applications: any[];
  deploymentMode: string;
  favouriteApps: string[];
  selectedApp: string;
  selectedTemplate: any;
  services: any[];
  onAddService: () => void;
  onApplicationSelect: (appId: string) => void;
  onRemoveService: (serviceName: string) => void;
  onToggleFavouriteApp: (appId: string) => void;
  onUpdateService: (serviceName: string, field: string, value: any) => void;
  hideApplicationSelection?: boolean;
}

export default function Configuration({
  applications,
  deploymentMode,
  favouriteApps,
  selectedApp,
  selectedTemplate,
  services,
  onAddService,
  onApplicationSelect,
  onRemoveService,
  onToggleFavouriteApp,
  onUpdateService,
  hideApplicationSelection = false,
}: ConfigurationProps) {
  return (
    <div className="space-y-6">
      {/* Application Configuration */}
      {selectedApp && (
        <ApplicationConfiguration
          services={services}
          onUpdateService={onUpdateService}
          onRemoveService={onRemoveService}
        />
      )}
    </div>
  );
}
