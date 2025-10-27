"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Code, Plus, Trash2 } from "lucide-react";

interface PortExposureConfigurationProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
  availableServices?: string[];
}

export default function PortExposureConfiguration({
  service,
  onUpdateService,
  availableServices = [],
}: PortExposureConfigurationProps) {
  const [domainInputs, setDomainInputs] = React.useState<{
    [key: number]: string;
  }>({});

  const handleAddPort = () => {
    const newPort = {
      port: 80,
      protocol: "http",
      domains: [],
      toServices: [],
    };

    const currentPorts = service.ports || [];

    onUpdateService("ports", [...currentPorts, newPort]);
  };

  const handleRemovePort = (index: number) => {
    const currentPorts = service.ports || [];
    const newPorts = currentPorts.filter((_: any, i: number) => i !== index);

    onUpdateService("ports", newPorts);

    // Clean up domain inputs
    const newDomainInputs = { ...domainInputs };

    delete newDomainInputs[index];
    setDomainInputs(newDomainInputs);
  };

  const handleUpdatePort = (index: number, field: string, value: any) => {
    const currentPorts = service.ports || [];
    const newPorts = [...currentPorts];

    newPorts[index] = { ...newPorts[index], [field]: value };
    onUpdateService("ports", newPorts);
  };

  const handleAddDomain = (portIndex: number) => {
    const domain = domainInputs[portIndex]?.trim();

    if (!domain) return;

    const currentPorts = service.ports || [];
    const newPorts = [...currentPorts];
    const currentDomains = newPorts[portIndex].domains || [];

    if (!currentDomains.includes(domain)) {
      newPorts[portIndex].domains = [...currentDomains, domain];
      onUpdateService("ports", newPorts);
    }

    // Clear input
    setDomainInputs((prev) => ({ ...prev, [portIndex]: "" }));
  };

  const handleRemoveDomain = (portIndex: number, domainIndex: number) => {
    const currentPorts = service.ports || [];
    const newPorts = [...currentPorts];
    const currentDomains = newPorts[portIndex].domains || [];

    newPorts[portIndex].domains = currentDomains.filter(
      (_: any, i: number) => i !== domainIndex,
    );
    onUpdateService("ports", newPorts);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="text-primary" size={16} />
          <span className="text-sm font-medium text-default-700">
            Port Configuration
          </span>
        </div>
        <Button
          color="primary"
          size="sm"
          startContent={<Plus size={14} />}
          variant="bordered"
          onClick={handleAddPort}
        >
          Add Port
        </Button>
      </div>

      {service.ports?.length > 0 && (
        <div className="space-y-4">
          {service.ports.map((port: any, index: number) => (
            <div
              key={index}
              className="p-4 bg-default-50 rounded-lg border border-default-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="text-primary" size={16} />
                  <span className="text-sm font-medium">Port {index + 1}</span>
                </div>
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="light"
                  onClick={() => handleRemovePort(index)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Input
                  label="Port"
                  placeholder="80"
                  size="sm"
                  value={port.port?.toString() || ""}
                  onChange={(e) =>
                    handleUpdatePort(
                      index,
                      "port",
                      parseInt(e.target.value) || 80,
                    )
                  }
                />
                <Select
                  label="Protocol"
                  selectedKeys={[port.protocol]}
                  size="sm"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleUpdatePort(index, "protocol", selected);
                  }}
                >
                  <SelectItem key="http">HTTP</SelectItem>
                  <SelectItem key="https">HTTPS</SelectItem>
                  <SelectItem key="tcp">TCP</SelectItem>
                  <SelectItem key="udp">UDP</SelectItem>
                </Select>
                <Select
                  label="To Service"
                  placeholder="Select services"
                  selectedKeys={port.toServices || []}
                  selectionMode="multiple"
                  size="sm"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys) as string[];

                    handleUpdatePort(index, "toServices", selected);
                  }}
                >
                  {availableServices.map((serviceName) => (
                    <SelectItem key={serviceName}>{serviceName}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Accept Domains */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-default-700 block mb-1">
                  Accept Domains
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    className="flex-1"
                    placeholder="example.com"
                    size="sm"
                    value={domainInputs[index] || ""}
                    onChange={(e) =>
                      setDomainInputs((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDomain(index);
                      }
                    }}
                  />
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<Plus size={14} />}
                    variant="bordered"
                    onClick={() => handleAddDomain(index)}
                  >
                    Add
                  </Button>
                </div>

                {port.domains?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {port.domains.map((domain: string, domainIndex: number) => (
                      <Chip
                        key={domainIndex}
                        color="primary"
                        size="sm"
                        variant="flat"
                        onClose={() => handleRemoveDomain(index, domainIndex)}
                      >
                        {domain}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
