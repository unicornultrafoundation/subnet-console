"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  Code,
  Server,
  Heart,
  Cpu,
  HardDrive,
  MemoryStick,
  Plus,
  Trash2,
} from "lucide-react";

interface Service {
  name: string;
  image: string;
  command: string[];
  args: string[];
  env: { key: string; value: string }[];
  volumes: { mount: string; size: string }[];
  expose: { port: number; as: number; to: { global: boolean }[] }[];
  resources: {
    cpu: { units: string };
    memory: { size: string };
    storage: { size: string }[];
    gpu?: { model: string };
  };
}

interface Application {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
}

interface ConfigurationProps {
  deploymentMode: "template" | "application";
  selectedApp: string;
  selectedTemplate: any;
  applications: Application[];
  services: Service[];
  favouriteApps: string[];
  onApplicationSelect: (appId: string) => void;
  onToggleFavouriteApp: (appId: string) => void;
  onAddService: () => void;
  onRemoveService: (serviceName: string) => void;
  onUpdateService: (serviceName: string, field: string, value: any) => void;
}

export default function Configuration({
  deploymentMode,
  selectedApp,
  selectedTemplate,
  applications,
  services,
  favouriteApps,
  onApplicationSelect,
  onToggleFavouriteApp,
  onAddService,
  onRemoveService,
  onUpdateService,
}: ConfigurationProps) {
  // If template is selected, show full template builder form
  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        {/* Template Info */}
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-2">
            <Code className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Template Configuration</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{selectedTemplate.name}</h3>
              <p className="text-default-600 mb-3">
                {selectedTemplate.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-default-600">Category:</span>
                  <Chip color="primary" size="sm" variant="flat">
                    {selectedTemplate.category}
                  </Chip>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-default-600">Provider:</span>
                  <span className="font-medium">
                    {selectedTemplate.provider}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-default-600">Services:</span>
                  <span>{selectedTemplate.services}</span>
                </div>
              </div>
            </div>

            <p className="text-default-600">
              This template is pre-configured. You can customize all settings
              below before deploying.
            </p>
          </CardBody>
        </Card>

        {/* Service Configuration - Full Template Builder Form */}
        <Card className="subnet-card">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="text-primary" size={20} />
              <h2 className="text-xl font-semibold">Service Configuration</h2>
            </div>
            <Button
              color="primary"
              size="sm"
              startContent={<Plus size={16} />}
              variant="flat"
              onClick={onAddService}
            >
              Add Service
            </Button>
          </CardHeader>
          <CardBody className="space-y-6">
            {services.length === 0 ? (
              <div className="text-center py-8">
                <Code className="text-default-300 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-default-600 mb-2">
                  No Services Added
                </h3>
                <p className="text-default-500 mb-4">
                  Add your first service to get started with your deployment
                  configuration.
                </p>
                <Button
                  color="primary"
                  startContent={<Plus size={16} />}
                  onClick={onAddService}
                >
                  Add Service
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index} className="border border-default-200">
                    <CardHeader className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {service.name}
                        </h3>
                        <Chip color="primary" size="sm" variant="flat">
                          Service {index + 1}
                        </Chip>
                      </div>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onClick={() => onRemoveService(service.name)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      {/* Basic Service Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Service Name"
                          value={service.name}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          label="Docker Image"
                          placeholder="nginx:latest"
                          value={service.image}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "image",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      {/* Resources */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-default-700">
                          Resources
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Cpu className="text-primary" size={16} />
                            <Input
                              label="CPU Units"
                              placeholder="1"
                              value={service.resources.cpu.units}
                              onChange={(e) =>
                                onUpdateService(
                                  service.name,
                                  "cpu",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <MemoryStick className="text-primary" size={16} />
                            <Input
                              label="Memory"
                              placeholder="1Gi"
                              value={service.resources.memory.size}
                              onChange={(e) =>
                                onUpdateService(
                                  service.name,
                                  "memory",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="text-primary" size={16} />
                            <Input
                              label="Storage"
                              placeholder="10Gi"
                              value={service.resources.storage[0]?.size || ""}
                              onChange={(e) =>
                                onUpdateService(
                                  service.name,
                                  "storage",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Environment Variables */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-default-700">
                          Environment Variables
                        </h4>
                        <div className="space-y-2">
                          {service.env.map((env, envIndex) => (
                            <div key={envIndex} className="flex gap-2">
                              <Input
                                className="flex-1"
                                placeholder="Key"
                                value={env.key}
                                onChange={(e) => {
                                  const newEnv = [...service.env];

                                  newEnv[envIndex] = {
                                    ...env,
                                    key: e.target.value,
                                  };
                                  onUpdateService(service.name, "env", newEnv);
                                }}
                              />
                              <Input
                                className="flex-1"
                                placeholder="Value"
                                value={env.value}
                                onChange={(e) => {
                                  const newEnv = [...service.env];

                                  newEnv[envIndex] = {
                                    ...env,
                                    value: e.target.value,
                                  };
                                  onUpdateService(service.name, "env", newEnv);
                                }}
                              />
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="light"
                                onClick={() => {
                                  const newEnv = service.env.filter(
                                    (_, i) => i !== envIndex,
                                  );

                                  onUpdateService(service.name, "env", newEnv);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            startContent={<Plus size={16} />}
                            variant="bordered"
                            onClick={() => {
                              const newEnv = [
                                ...service.env,
                                { key: "", value: "" },
                              ];

                              onUpdateService(service.name, "env", newEnv);
                            }}
                          >
                            Add Environment Variable
                          </Button>
                        </div>
                      </div>

                      {/* Volumes */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-default-700">
                          Volumes
                        </h4>
                        <div className="space-y-2">
                          {service.volumes.map((volume, volIndex) => (
                            <div key={volIndex} className="flex gap-2">
                              <Input
                                className="flex-1"
                                placeholder="Mount Path"
                                value={volume.mount}
                                onChange={(e) => {
                                  const newVolumes = [...service.volumes];

                                  newVolumes[volIndex] = {
                                    ...volume,
                                    mount: e.target.value,
                                  };
                                  onUpdateService(
                                    service.name,
                                    "volumes",
                                    newVolumes,
                                  );
                                }}
                              />
                              <Input
                                className="flex-1"
                                placeholder="Size"
                                value={volume.size}
                                onChange={(e) => {
                                  const newVolumes = [...service.volumes];

                                  newVolumes[volIndex] = {
                                    ...volume,
                                    size: e.target.value,
                                  };
                                  onUpdateService(
                                    service.name,
                                    "volumes",
                                    newVolumes,
                                  );
                                }}
                              />
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="light"
                                onClick={() => {
                                  const newVolumes = service.volumes.filter(
                                    (_, i) => i !== volIndex,
                                  );

                                  onUpdateService(
                                    service.name,
                                    "volumes",
                                    newVolumes,
                                  );
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            startContent={<Plus size={16} />}
                            variant="bordered"
                            onClick={() => {
                              const newVolumes = [
                                ...service.volumes,
                                { mount: "", size: "" },
                              ];

                              onUpdateService(
                                service.name,
                                "volumes",
                                newVolumes,
                              );
                            }}
                          >
                            Add Volume
                          </Button>
                        </div>
                      </div>

                      {/* Ports */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-default-700">
                          Ports
                        </h4>
                        <div className="space-y-2">
                          {service.expose.map((port, portIndex) => (
                            <div key={portIndex} className="flex gap-2">
                              <Input
                                className="flex-1"
                                placeholder="Container Port"
                                type="number"
                                value={port.port.toString()}
                                onChange={(e) => {
                                  const newExpose = [...service.expose];

                                  newExpose[portIndex] = {
                                    ...port,
                                    port: parseInt(e.target.value) || 0,
                                  };
                                  onUpdateService(
                                    service.name,
                                    "expose",
                                    newExpose,
                                  );
                                }}
                              />
                              <Input
                                className="flex-1"
                                placeholder="External Port"
                                type="number"
                                value={port.as.toString()}
                                onChange={(e) => {
                                  const newExpose = [...service.expose];

                                  newExpose[portIndex] = {
                                    ...port,
                                    as: parseInt(e.target.value) || 0,
                                  };
                                  onUpdateService(
                                    service.name,
                                    "expose",
                                    newExpose,
                                  );
                                }}
                              />
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="light"
                                onClick={() => {
                                  const newExpose = service.expose.filter(
                                    (_, i) => i !== portIndex,
                                  );

                                  onUpdateService(
                                    service.name,
                                    "expose",
                                    newExpose,
                                  );
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            startContent={<Plus size={16} />}
                            variant="bordered"
                            onClick={() => {
                              const newExpose = [
                                ...service.expose,
                                { port: 0, as: 0, to: [{ global: true }] },
                              ];

                              onUpdateService(
                                service.name,
                                "expose",
                                newExpose,
                              );
                            }}
                          >
                            Add Port
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  if (deploymentMode === "template") {
    return (
      <Card className="subnet-card">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Service Configuration</h2>
          </div>
          <Button
            color="primary"
            size="sm"
            startContent={<Plus size={16} />}
            variant="flat"
            onClick={onAddService}
          >
            Add Service
          </Button>
        </CardHeader>
        <CardBody className="space-y-6">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <Code className="text-default-300 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-default-600 mb-2">
                No Services Added
              </h3>
              <p className="text-default-500 mb-4">
                Add your first service to get started with your deployment
                configuration.
              </p>
              <Button
                color="primary"
                startContent={<Plus size={16} />}
                onClick={onAddService}
              >
                Add Service
              </Button>
            </div>
          ) : (
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
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onClick={() => onRemoveService(service.name)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Service Name"
                        value={service.name}
                        onChange={(e) =>
                          onUpdateService(service.name, "name", e.target.value)
                        }
                      />
                      <Input
                        label="Docker Image"
                        placeholder="nginx:latest"
                        value={service.image}
                        onChange={(e) =>
                          onUpdateService(service.name, "image", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="text-primary" size={16} />
                        <Input
                          label="CPU Units"
                          placeholder="1"
                          value={service.resources.cpu.units}
                          onChange={(e) =>
                            onUpdateService(service.name, "cpu", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MemoryStick className="text-primary" size={16} />
                        <Input
                          label="Memory"
                          placeholder="1Gi"
                          value={service.resources.memory.size}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "memory",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="text-primary" size={16} />
                        <Input
                          label="Storage"
                          placeholder="10Gi"
                          value={service.resources.storage[0]?.size || ""}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "storage",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Selection */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <Server className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Select Application</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p className="text-default-600">
              Choose from our pre-configured applications. You can customize the
              configuration after selection.
            </p>

            <div className="grid gap-4">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className={`cursor-pointer transition-all ${
                    selectedApp === app.id
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-default-200 hover:border-primary/50"
                  }`}
                  onClick={() => onApplicationSelect(app.id)}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{app.name}</h3>
                          <Chip color="primary" size="sm" variant="flat">
                            {app.category}
                          </Chip>
                          <Button
                            isIconOnly
                            className="text-default-400 hover:text-danger ml-auto"
                            size="sm"
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavouriteApp(app.id);
                            }}
                          >
                            <Heart
                              className={
                                favouriteApps.includes(app.id)
                                  ? "text-danger fill-danger"
                                  : ""
                              }
                              size={16}
                            />
                          </Button>
                        </div>
                        <p className="text-default-600 mb-3">
                          {app.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Cpu className="text-primary" size={14} />
                            <span>{app.resources.cpu}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MemoryStick className="text-primary" size={14} />
                            <span>{app.resources.memory}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="text-primary" size={14} />
                            <span>{app.resources.storage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Application Configuration */}
      {selectedApp && (
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
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Service Name"
                        value={service.name}
                        onChange={(e) =>
                          onUpdateService(service.name, "name", e.target.value)
                        }
                      />
                      <Input
                        label="Docker Image"
                        placeholder="nginx:latest"
                        value={service.image}
                        onChange={(e) =>
                          onUpdateService(service.name, "image", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="text-primary" size={16} />
                        <Input
                          label="CPU Units"
                          placeholder="1"
                          value={service.resources.cpu.units}
                          onChange={(e) =>
                            onUpdateService(service.name, "cpu", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MemoryStick className="text-primary" size={16} />
                        <Input
                          label="Memory"
                          placeholder="1Gi"
                          value={service.resources.memory.size}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "memory",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="text-primary" size={16} />
                        <Input
                          label="Storage"
                          placeholder="10Gi"
                          value={service.resources.storage[0]?.size || ""}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "storage",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
