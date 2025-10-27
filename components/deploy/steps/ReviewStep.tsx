"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  CheckCircle,
  Cpu,
  MemoryStick,
  HardDrive,
  Gpu,
  DollarSign,
} from "lucide-react";

interface ReviewStepProps {
  deploymentName: string;
  description: string;
  maxPrice: string;
  services: any[];
  totalCpu: string;
  totalMemory: string;
  totalStorage: string;
  estimatedPrice: string;
}

export default function ReviewStep({
  deploymentName,
  description,
  maxPrice,
  services,
  totalCpu,
  totalMemory,
  totalStorage,
  estimatedPrice,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      {/* Deployment Summary */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <CheckCircle className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Deployment Summary</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-default-600">Name:</span>{" "}
              <span className="font-medium">{deploymentName}</span>
            </div>
            <div>
              <span className="text-default-600">Description:</span>{" "}
              <span className="font-medium">
                {description || "No description"}
              </span>
            </div>
            <div>
              <span className="text-default-600">Max Price:</span>{" "}
              <span className="font-medium text-primary">
                {maxPrice} SCU/hour
              </span>
            </div>
            <div>
              <span className="text-default-600">Estimated Price:</span>{" "}
              <span className="font-medium text-success">
                {estimatedPrice} SCU/hour
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Resource Requirements */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <Cpu className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Resource Requirements</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="text-primary" size={16} />
              <span className="text-default-600">Total CPU:</span>
              <span className="font-medium">{totalCpu} units</span>
            </div>
            <div className="flex items-center gap-2">
              <MemoryStick className="text-primary" size={16} />
              <span className="text-default-600">Total Memory:</span>
              <span className="font-medium">{totalMemory}Gi</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="text-primary" size={16} />
              <span className="text-default-600">Total Storage:</span>
              <span className="font-medium">{totalStorage}Gi</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-primary" size={16} />
              <span className="text-default-600">Estimated Cost:</span>
              <span className="font-medium text-success">
                {estimatedPrice} SCU/hour
              </span>
            </div>
          </div>

          {/* GPU Requirements */}
          {(() => {
            const gpuRequirements = new Map();
            let totalGpuUnits = 0;
            const gpuModels = new Set();

            services.forEach((service) => {
              if (
                service.resources.gpu &&
                service.resources.gpu.configs &&
                service.resources.gpu.configs.length > 0
              ) {
                const replicas = service.replicas || 1;
                const gpuUnits =
                  parseInt(service.resources.gpu.units || "0") || 0;

                if (gpuUnits > 0) {
                  totalGpuUnits += gpuUnits * replicas;
                  service.resources.gpu.configs.forEach((config) => {
                    gpuModels.add(
                      `${config.vendor}-${config.model}-${config.memory}-${config.interface}`,
                    );
                  });
                }
              }
            });

            const gpuReqs = {
              totalUnits: totalGpuUnits,
              models: Array.from(gpuModels).map((modelKey) => {
                const [vendor, model, memory, gpuInterface] =
                  modelKey.split("-");

                return { vendor, model, memory, interface: gpuInterface };
              }),
            };

            return gpuReqs.totalUnits > 0 ? (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">
                  GPU Requirements
                </h4>
                <div className="bg-primary/5 p-3 rounded mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-primary">
                      Total GPU Units:
                    </span>
                    <span className="font-semibold text-primary text-lg">
                      {gpuReqs.totalUnits}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {gpuReqs.models.map((model, index) => (
                    <div
                      key={index}
                      className="bg-primary/5 p-2 rounded text-xs"
                    >
                      <div className="font-medium text-primary">
                        {model.vendor} {model.model} {model.memory}{" "}
                        {model.interface}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-primary/10 rounded text-xs text-primary-700">
                  <strong>Note:</strong> Provider must have one of these GPU
                  types available.
                </div>
              </div>
            ) : null;
          })()}
        </CardBody>
      </Card>

      {/* Services Configuration */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <CheckCircle className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Services Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-default-200 rounded-lg p-4 bg-gradient-to-br from-default-50 to-default-100/50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <Chip color="primary" size="sm" variant="flat">
                    Service {index + 1}
                  </Chip>
                </div>

                {/* Service Info Cards */}
                <div className="space-y-3">
                  {/* Basic Resources */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 p-3 rounded-lg border border-default-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="text-primary" size={14} />
                        <span className="text-xs font-medium text-default-600">
                          CPU
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {(service.resources.cpu as any)?.units || "0"} cores
                      </div>
                    </div>

                    <div className="bg-white/60 p-3 rounded-lg border border-default-200">
                      <div className="flex items-center gap-2 mb-1">
                        <MemoryStick className="text-success" size={14} />
                        <span className="text-xs font-medium text-default-600">
                          Memory
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-success">
                        {(service.resources.memory as any)?.size ||
                          (service.resources.memory as any)?.units + "Gi" ||
                          "0Gi"}
                      </div>
                    </div>

                    <div className="bg-white/60 p-3 rounded-lg border border-default-200">
                      <div className="flex items-center gap-2 mb-1">
                        <HardDrive className="text-warning" size={14} />
                        <span className="text-xs font-medium text-default-600">
                          Storage
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-warning">
                        {Array.isArray(service.resources.storage) &&
                        service.resources.storage.length > 0
                          ? (service.resources.storage[0] as any)?.size
                          : (service.resources.storage as any)?.size ||
                            (service.resources.storage as any)?.units + "Gi" ||
                            "0Gi"}
                      </div>
                    </div>

                    <div className="bg-white/60 p-3 rounded-lg border border-default-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Gpu className="text-danger" size={14} />
                        <span className="text-xs font-medium text-default-600">
                          GPU
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-danger">
                        {(service.resources.gpu as any)?.units || "0"} units
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-white/40 p-3 rounded-lg border border-default-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-default-500">Image:</span>
                        <div
                          className="font-medium text-default-700 truncate"
                          title={service.image}
                        >
                          {service.image}
                        </div>
                      </div>
                      <div>
                        <span className="text-default-500">Replicas:</span>
                        <div className="font-medium text-default-700">
                          {service.replicas || 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Configuration */}
                {(service.command ||
                  service.args ||
                  (service as any).registryUrl ||
                  (service.volumes && service.volumes.length > 0) ||
                  ((service as any).expose &&
                    (service as any).expose.length > 0) ||
                  ((service as any).ports &&
                    (service as any).ports.length > 0) ||
                  ((service as any).env && (service as any).env.length > 0) ||
                  ((service as any).environment &&
                    (service as any).environment.length > 0)) && (
                  <div className="mt-3 space-y-3">
                    {/* Command & Args */}
                    {(service.command || service.args) && (
                      <div className="bg-white/30 p-3 rounded-lg border border-default-200">
                        <div className="text-xs font-medium text-default-600 mb-2">
                          Execution
                        </div>
                        {service.command && (
                          <div className="text-xs">
                            <span className="text-default-500">Command:</span>
                            <div className="font-mono text-default-700 bg-default-100 px-2 py-1 rounded mt-1">
                              {Array.isArray(service.command)
                                ? service.command.join(" ")
                                : service.command}
                            </div>
                          </div>
                        )}
                        {service.args && (
                          <div className="text-xs mt-2">
                            <span className="text-default-500">Args:</span>
                            <div className="font-mono text-default-700 bg-default-100 px-2 py-1 rounded mt-1">
                              {Array.isArray(service.args)
                                ? service.args.join(" ")
                                : service.args}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Volumes */}
                    {service.volumes && service.volumes.length > 0 && (
                      <div className="bg-white/30 p-3 rounded-lg border border-default-200">
                        <div className="text-xs font-medium text-default-600 mb-2">
                          Volumes ({service.volumes.length})
                        </div>
                        <div className="space-y-2">
                          {service.volumes.map(
                            (volume: any, volIndex: number) => (
                              <div
                                key={volIndex}
                                className="bg-white/60 p-2 rounded text-xs"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    {volume.name}
                                  </span>
                                  <span className="text-default-500">
                                    {volume.size}
                                    {volume.sizeUnit}
                                  </span>
                                </div>
                                <div className="text-default-600 mt-1">
                                  {volume.type} → {volume.mount}{" "}
                                  {volume.readOnly ? "(read-only)" : ""}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ports */}
                    {(((service as any).expose &&
                      (service as any).expose.length > 0) ||
                      ((service as any).ports &&
                        (service as any).ports.length > 0)) && (
                      <div className="bg-white/30 p-3 rounded-lg border border-default-200">
                        <div className="text-xs font-medium text-default-600 mb-2">
                          Ports (
                          {(service as any).ports?.length ||
                            (service as any).expose?.length ||
                            0}
                          )
                        </div>
                        <div className="space-y-2">
                          {(
                            (service as any).ports ||
                            (service as any).expose ||
                            []
                          ).map((port: any, portIndex: number) => (
                            <div
                              key={portIndex}
                              className="bg-white/60 p-2 rounded text-xs"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {port.port}→{port.as || port.port}
                                </span>
                                <span className="text-default-500">
                                  ({port.protocol})
                                </span>
                              </div>
                              {(port.domains && port.domains.length > 0) ||
                              (port.acceptDomains &&
                                port.acceptDomains.length > 0) ? (
                                <div className="text-default-600 mt-1">
                                  Domains:{" "}
                                  <span className="font-medium">
                                    {(
                                      port.domains ||
                                      port.acceptDomains ||
                                      []
                                    ).join(", ")}
                                  </span>
                                </div>
                              ) : null}
                              {port.toServices && port.toServices.length > 0 ? (
                                <div className="text-default-600 mt-1">
                                  To Services:{" "}
                                  <span className="font-medium">
                                    {port.toServices.join(", ")}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Environment Variables */}
                    {(((service as any).env &&
                      (service as any).env.length > 0) ||
                      ((service as any).environment &&
                        (service as any).environment.length > 0)) && (
                      <div className="bg-white/30 p-3 rounded-lg border border-default-200">
                        <div className="text-xs font-medium text-default-600 mb-2">
                          Environment (
                          {(service as any).environment?.length ||
                            (service as any).env?.length ||
                            0}
                          )
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(
                            (service as any).environment ||
                            (service as any).env ||
                            []
                          ).map((env: any, envIndex: number) => (
                            <Chip
                              key={envIndex}
                              color="default"
                              size="sm"
                              variant="flat"
                            >
                              {env.key}={env.value}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
