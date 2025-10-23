"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/react";
import {
  Code,
  Server,
  Heart,
  Cpu,
  HardDrive,
  MemoryStick,
  Plus,
  Trash2,
  Gpu,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// GPU Data
const GPU_VENDORS = [
  { id: "nvidia", name: "NVIDIA" },
  { id: "amd", name: "AMD" },
  { id: "intel", name: "Intel" },
];

const GPU_MODELS = {
  nvidia: [
    { id: "rtx4090", name: "RTX 4090" },
    { id: "rtx4080", name: "RTX 4080" },
    { id: "rtx4070", name: "RTX 4070" },
    { id: "a100", name: "A100" },
    { id: "h100", name: "H100" },
  ],
  amd: [
    { id: "rx7900xtx", name: "RX 7900 XTX" },
    { id: "rx7800xt", name: "RX 7800 XT" },
    { id: "rx7700xt", name: "RX 7700 XT" },
    { id: "mi200", name: "MI200" },
  ],
  intel: [
    { id: "arc770", name: "Arc A770" },
    { id: "arc750", name: "Arc A750" },
    { id: "arc580", name: "Arc A580" },
  ],
};

const GPU_MEMORY_OPTIONS = [
  { id: "8gb", name: "8GB" },
  { id: "12gb", name: "12GB" },
  { id: "16gb", name: "16GB" },
  { id: "24gb", name: "24GB" },
  { id: "32gb", name: "32GB" },
  { id: "48gb", name: "48GB" },
  { id: "80gb", name: "80GB" },
];

const GPU_INTERFACE_OPTIONS = [
  { id: "pcie", name: "PCIe" },
  { id: "nvlink", name: "NVLink" },
  { id: "infinity", name: "Infinity Fabric" },
];

// Volume Data
const VOLUME_TYPES = [
  { id: "ssd", name: "SSD" },
  { id: "hdd", name: "HDD" },
  { id: "nvme", name: "NVMe" },
];

const VOLUME_SIZE_UNITS = [
  { id: "GB", name: "GB" },
  { id: "TB", name: "TB" },
];

// Resource Units
const CPU_UNITS = [
  { id: "cores", name: "Cores" },
  { id: "mCores", name: "mCores" },
];

const MEMORY_UNITS = [
  { id: "GB", name: "GB" },
  { id: "MB", name: "MB" },
];

const STORAGE_UNITS = [
  { id: "GB", name: "GB" },
  { id: "TB", name: "TB" },
];

interface Service {
  id: string;
  name: string;
  image: string;
  command: string[];
  args: string[];
  env: { key: string; value: string }[];
  volumes: {
    id: string;
    name: string;
    size: string;
    sizeUnit: string;
    type: string;
    mount: string;
    readOnly: boolean;
  }[];
  expose: {
    id: string;
    port: number;
    as: number;
    protocol: string;
    acceptDomains: string[];
    toServices: string[];
  }[];
  resources: {
    cpu: { units: string };
    memory: { size: string };
    storage: { size: string }[];
    gpu: {
      units: string;
      configs: {
        vendor: string;
        model: string;
        memory: string;
        interface: string;
      }[];
    };
  };
  replicas?: number;
  registryUrl?: string;
  registryUsername?: string;
  registryPassword?: string;
}

interface BuilderConfigurationProps {
  service: Service;
  onUpdateService: (field: string, value: any) => void;
}

// Simple Resource Input Component
function ResourceInput({ 
  label,
  icon: Icon,
  value,
  unit,
  unitOptions,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
  unit: string;
  unitOptions: { id: string; name: string }[];
  onChange: (value: string, unit: string) => void;
}) {
  const [localValue, setLocalValue] = React.useState(value);
  const [localUnit, setLocalUnit] = React.useState(unit);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    setLocalUnit(unit);
  }, [unit]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue, localUnit);
  };

  const handleUnitChange = (keys: any) => {
    const newUnit = Array.from(keys)[0] as string;
    setLocalUnit(newUnit);
    onChange(localValue, newUnit);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="text-primary" size={16} />
        <span className="text-sm font-medium text-default-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={localValue}
          onChange={handleValueChange}
          placeholder="0"
          size="sm"
          className="flex-1"
        />
        <Select
          selectedKeys={[localUnit]}
          onSelectionChange={handleUnitChange}
          size="sm"
          className="w-20"
        >
                  {unitOptions.map((option) => (
                    <SelectItem key={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
        </Select>
      </div>
    </div>
  );
}

// GPU Configuration Component
function GPUConfiguration({ 
  service, 
  onUpdateService 
}: { 
  service: Service; 
  onUpdateService: (field: string, value: any) => void;
}) {
  const [selectedVendor, setSelectedVendor] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [selectedMemory, setSelectedMemory] = React.useState<string>("");
  const [selectedInterface, setSelectedInterface] = React.useState<string>("");

  const handleAddGPUConfig = () => {
    if (selectedVendor && selectedModel && selectedMemory && selectedInterface) {
      const newConfig = {
        vendor: selectedVendor,
        model: selectedModel,
        memory: selectedMemory,
        interface: selectedInterface,
      };
      
      const currentConfigs = service.resources.gpu?.configs || [];
      const updatedConfigs = [...currentConfigs, newConfig];
      
      onUpdateService("gpu_configs", updatedConfigs);
      
      // Reset selections
      setSelectedVendor("");
      setSelectedModel("");
      setSelectedMemory("");
      setSelectedInterface("");
    }
  };

  const handleRemoveGPUConfig = (index: number) => {
    const currentConfigs = service.resources.gpu?.configs || [];
    const updatedConfigs = currentConfigs.filter((_, i) => i !== index);
    onUpdateService("gpu_configs", updatedConfigs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Gpu className="text-primary" size={16} />
        <span className="text-sm font-medium text-default-700">GPU Configuration</span>
      </div>
      
      {/* GPU Units */}
      <div className="space-y-4">
        <Input
          label="GPU Units"
          placeholder="0"
          value={service.resources.gpu?.units || "0"}
          onChange={(e) => onUpdateService("gpu_units", e.target.value)}
          size="sm"
          className="w-full"
        />
      </div>

      {/* GPU Configs */}
      {parseInt(service.resources.gpu?.units || "0") > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-default-700">GPU Models</div>
          
          {/* Add GPU Config */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              placeholder="Vendor"
              selectedKeys={selectedVendor ? [selectedVendor] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedVendor(selected);
                setSelectedModel(""); // Reset model when vendor changes
              }}
              size="sm"
            >
              {GPU_VENDORS.map((vendor) => (
                <SelectItem key={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder="Model"
              selectedKeys={selectedModel ? [selectedModel] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedModel(selected);
              }}
              size="sm"
              isDisabled={!selectedVendor}
            >
              {selectedVendor ? GPU_MODELS[selectedVendor as keyof typeof GPU_MODELS]?.map((model) => (
                <SelectItem key={model.id}>
                  {model.name}
                </SelectItem>
              )) : []}
            </Select>

            <Select
              placeholder="Memory"
              selectedKeys={selectedMemory ? [selectedMemory] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedMemory(selected);
              }}
              size="sm"
            >
              {GPU_MEMORY_OPTIONS.map((memory) => (
                <SelectItem key={memory.id}>
                  {memory.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder="Interface"
              selectedKeys={selectedInterface ? [selectedInterface] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedInterface(selected);
              }}
              size="sm"
            >
              {GPU_INTERFACE_OPTIONS.map((gpuInterface) => (
                <SelectItem key={gpuInterface.id}>
                  {gpuInterface.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Button
            size="sm"
            color="primary"
            variant="bordered"
            onClick={handleAddGPUConfig}
            isDisabled={!selectedVendor || !selectedModel || !selectedMemory || !selectedInterface}
          >
            Add GPU Model
          </Button>

          {/* GPU Configs List */}
          {service.resources.gpu?.configs && service.resources.gpu.configs.length > 0 && (
            <div className="space-y-2">
              {service.resources.gpu.configs.map((config, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-default-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat" color="primary">
                      {config.vendor}
                    </Chip>
                    <span className="text-sm font-medium">{config.model}</span>
                    <span className="text-xs text-default-500">{config.memory}</span>
                    <span className="text-xs text-default-500">{config.interface}</span>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => handleRemoveGPUConfig(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Volume Configuration Component
function VolumeConfiguration({ 
  service, 
  onUpdateService 
}: { 
  service: Service; 
  onUpdateService: (field: string, value: any) => void;
}) {
  const handleAddVolume = () => {
    const newVolume = {
      id: `volume-${Date.now()}`,
      name: "data-volume",
      size: "10",
      sizeUnit: "GB",
      type: "ssd",
      mount: "/data",
      readOnly: false,
    };
    
    const currentVolumes = service.volumes || [];
    const updatedVolumes = [...currentVolumes, newVolume];
    onUpdateService("volumes", updatedVolumes);
  };

  const handleUpdateVolume = (index: number, field: string, value: any) => {
    const currentVolumes = service.volumes || [];
    const updatedVolumes = currentVolumes.map((volume, i) => 
      i === index ? { ...volume, [field]: value } : volume
    );
    onUpdateService("volumes", updatedVolumes);
  };

  const handleRemoveVolume = (index: number) => {
    const currentVolumes = service.volumes || [];
    const updatedVolumes = currentVolumes.filter((_, i) => i !== index);
    onUpdateService("volumes", updatedVolumes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="text-primary" size={16} />
          <span className="text-sm font-medium text-default-700">Volumes</span>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="bordered"
          startContent={<Plus size={14} />}
          onClick={handleAddVolume}
        >
          Add Volume
        </Button>
      </div>

      {service.volumes && service.volumes.length > 0 && (
        <div className="space-y-3">
          {service.volumes.map((volume, index) => (
            <Card key={volume.id} className="border border-default-200">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Volume {index + 1}</h4>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => handleRemoveVolume(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <Input
                    label="Name"
                    placeholder="volume-name"
                    value={volume.name}
                    onChange={(e) => handleUpdateVolume(index, "name", e.target.value)}
                    size="sm"
                  />
                  
                  <div className="flex gap-2">
                    <Input
                      label="Size"
                      placeholder="10"
                      value={volume.size}
                      onChange={(e) => handleUpdateVolume(index, "size", e.target.value)}
                      size="sm"
                    />
                    <Select
                      label="Unit"
                      selectedKeys={[volume.sizeUnit]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleUpdateVolume(index, "sizeUnit", selected);
                      }}
                      size="sm"
                    >
                      {VOLUME_SIZE_UNITS.map((unit) => (
                        <SelectItem key={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  
                  <Select
                    label="Type"
                    selectedKeys={[volume.type]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      handleUpdateVolume(index, "type", selected);
                    }}
                    size="sm"
                  >
                    {VOLUME_TYPES.map((type) => (
                      <SelectItem key={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Input
                    label="Mount Path"
                    placeholder="/data"
                    value={volume.mount}
                    onChange={(e) => handleUpdateVolume(index, "mount", e.target.value)}
                    size="sm"
                  />
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={volume.readOnly}
                      onChange={(e) => handleUpdateVolume(index, "readOnly", e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-sm text-default-600">Read Only</label>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Port Exposure Configuration Component
function PortExposureConfiguration({ 
  service, 
  onUpdateService 
}: { 
  service: Service; 
  onUpdateService: (field: string, value: any) => void;
}) {
  const [domainInputs, setDomainInputs] = React.useState<{ [key: string]: string }>({});

  const handleAddPort = () => {
    const newPort = {
      id: `port-${Date.now()}`,
      port: 80,
      as: 80,
      protocol: "http",
      acceptDomains: [],
      toServices: [],
    };
    
    const currentPorts = service.expose || [];
    const updatedPorts = [...currentPorts, newPort];
    onUpdateService("expose", updatedPorts);
  };

  const handleUpdatePort = (index: number, field: string, value: any) => {
    const currentPorts = service.expose || [];
    const updatedPorts = currentPorts.map((port, i) => 
      i === index ? { ...port, [field]: value } : port
    );
    onUpdateService("expose", updatedPorts);
  };

  const handleRemovePort = (index: number) => {
    const currentPorts = service.expose || [];
    const updatedPorts = currentPorts.filter((_, i) => i !== index);
    onUpdateService("expose", updatedPorts);
  };

  const handleAddDomain = (portIndex: number) => {
    const domainInput = domainInputs[`port-${portIndex}`] || "";
    if (domainInput.trim()) {
      const currentPorts = service.expose || [];
      const updatedPorts = currentPorts.map((port, i) => 
        i === portIndex 
          ? { ...port, acceptDomains: [...port.acceptDomains, domainInput.trim()] }
          : port
      );
      onUpdateService("expose", updatedPorts);
      setDomainInputs({ ...domainInputs, [`port-${portIndex}`]: "" });
    }
  };

  const handleRemoveDomain = (portIndex: number, domainIndex: number) => {
    const currentPorts = service.expose || [];
    const updatedPorts = currentPorts.map((port, i) => 
      i === portIndex 
        ? { ...port, acceptDomains: port.acceptDomains.filter((_, di) => di !== domainIndex) }
        : port
    );
    onUpdateService("expose", updatedPorts);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="text-primary" size={16} />
          <span className="text-sm font-medium text-default-700">Port Exposure</span>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="bordered"
          startContent={<Plus size={14} />}
          onClick={handleAddPort}
        >
          Add Port
        </Button>
      </div>

      {service.expose && service.expose.length > 0 && (
        <div className="space-y-3">
          {service.expose.map((port, index) => (
            <Card key={port.id} className="border border-default-200">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Port {index + 1}</h4>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => handleRemovePort(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <Input
                    label="Internal Port"
                    placeholder="80"
                    value={port.port.toString()}
                    onChange={(e) => handleUpdatePort(index, "port", parseInt(e.target.value) || 0)}
                    size="sm"
                  />
                  
                  <Input
                    label="External Port"
                    placeholder="80"
                    value={port.as.toString()}
                    onChange={(e) => handleUpdatePort(index, "as", parseInt(e.target.value) || 0)}
                    size="sm"
                  />
                  
                  <Select
                    label="Protocol"
                    selectedKeys={[port.protocol]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      handleUpdatePort(index, "protocol", selected);
                    }}
                    size="sm"
                  >
                    <SelectItem key="http">HTTP</SelectItem>
                    <SelectItem key="https">HTTPS</SelectItem>
                    <SelectItem key="tcp">TCP</SelectItem>
                    <SelectItem key="udp">UDP</SelectItem>
                  </Select>
                </div>

                {/* Accept Domains */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-default-700">Accept Domains</div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="example.com"
                      value={domainInputs[`port-${index}`] || ""}
                      onChange={(e) => setDomainInputs({ ...domainInputs, [`port-${index}`]: e.target.value })}
                      size="sm"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      color="primary"
                      variant="bordered"
                      onClick={() => handleAddDomain(index)}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {port.acceptDomains.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {port.acceptDomains.map((domain, domainIndex) => (
                        <Chip
                          key={domainIndex}
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
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuilderConfiguration({ service, onUpdateService }: BuilderConfigurationProps) {
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set());
  const [showRegistryAuth, setShowRegistryAuth] = React.useState(false);
  const [useGpu, setUseGpu] = React.useState(false);

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
    <div className="space-y-6">
      {/* Basic Service Configuration */}
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <Server className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Service Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              label="Service Name"
              placeholder="my-service"
              value={service.name}
              onChange={(e) => onUpdateService("name", e.target.value)}
            />
            
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Docker Image"
                    placeholder="nginx:latest"
                    value={service.image}
                    onChange={(e) => onUpdateService("image", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showRegistryAuth}
                        onChange={(e) => setShowRegistryAuth(e.target.checked)}
                        className="sr-only"
                      />
                      <div 
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                          showRegistryAuth 
                            ? 'bg-primary border-primary' 
                            : 'bg-background border-default-300 hover:border-primary/50'
                        }`}
                        onClick={() => setShowRegistryAuth(!showRegistryAuth)}
                      >
                        {showRegistryAuth && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <label 
                      className="text-sm text-default-600 cursor-pointer select-none"
                      onClick={() => setShowRegistryAuth(!showRegistryAuth)}
                    >
                      Registry Auth
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registry Authentication - Show when toggled */}
          {showRegistryAuth && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-default-50 rounded-lg border border-default-200">
              <Input
                label="Registry URL"
                placeholder="registry.example.com"
                value={service.registryUrl || ""}
                onChange={(e) => onUpdateService("registryUrl", e.target.value)}
                size="sm"
              />
              
              <Input
                label="Username"
                placeholder="username"
                value={service.registryUsername || ""}
                onChange={(e) => onUpdateService("registryUsername", e.target.value)}
                size="sm"
              />
              
              <Input
                label="Password"
                placeholder="password"
                type="password"
                value={service.registryPassword || ""}
                onChange={(e) => onUpdateService("registryPassword", e.target.value)}
                size="sm"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              label="Replicas"
              placeholder="1"
              value={service.replicas?.toString() || "1"}
              onChange={(e) => onUpdateService("replicas", parseInt(e.target.value) || 1)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Resources */}
      <Card className="subnet-card">
        <CardHeader 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("resources")}
        >
          <div className="flex items-center gap-2">
            <Cpu className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Resources</h2>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection("resources");
            }}
          >
            {collapsedSections.has("resources") ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </CardHeader>
        {!collapsedSections.has("resources") && (
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPU Resource */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Cpu className="text-white" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">CPU</h3>
                    <p className="text-xs text-blue-600">Processing power</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={service.resources.cpu.units.replace(/[^\d.]/g, "")}
                    onChange={(e) => {
                      const value = e.target.value;
                      const unit = service.resources.cpu.units.replace(/[\d.]/g, "") || "cores";
                      onUpdateService("cpu", `${value}${unit}`);
                    }}
                    placeholder="0"
                    size="sm"
                    className="flex-1"
                    classNames={{
                      input: "text-center font-medium",
                      inputWrapper: "border-blue-300 focus-within:border-blue-500"
                    }}
                  />
                  <Select
                    selectedKeys={[service.resources.cpu.units.replace(/[\d.]/g, "") || "cores"]}
                    onSelectionChange={(keys) => {
                      const newUnit = Array.from(keys)[0] as string;
                      const value = service.resources.cpu.units.replace(/[^\d.]/g, "") || "0";
                      onUpdateService("cpu", `${value}${newUnit}`);
                    }}
                    size="sm"
                    className="w-24"
                    classNames={{
                      trigger: "border-blue-300 focus-within:border-blue-500"
                    }}
                  >
                    {CPU_UNITS.map((option) => (
                      <SelectItem key={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Memory Resource */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <MemoryStick className="text-white" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-green-900">Memory</h3>
                    <p className="text-xs text-green-600">RAM allocation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={service.resources.memory.size.replace(/[^\d.]/g, "")}
                    onChange={(e) => {
                      const value = e.target.value;
                      const unit = service.resources.memory.size.replace(/[\d.]/g, "") || "GB";
                      onUpdateService("memory", `${value}${unit}`);
                    }}
                    placeholder="0"
                    size="sm"
                    className="flex-1"
                    classNames={{
                      input: "text-center font-medium",
                      inputWrapper: "border-green-300 focus-within:border-green-500"
                    }}
                  />
                  <Select
                    selectedKeys={[service.resources.memory.size.replace(/[\d.]/g, "") || "GB"]}
                    onSelectionChange={(keys) => {
                      const newUnit = Array.from(keys)[0] as string;
                      const value = service.resources.memory.size.replace(/[^\d.]/g, "") || "0";
                      onUpdateService("memory", `${value}${newUnit}`);
                    }}
                    size="sm"
                    className="w-24"
                    classNames={{
                      trigger: "border-green-300 focus-within:border-green-500"
                    }}
                  >
                    {MEMORY_UNITS.map((option) => (
                      <SelectItem key={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Use GPU Checkbox */}
            <div className="flex items-center gap-2 p-3 bg-default-50 rounded-lg border border-default-200">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useGpu}
                  onChange={(e) => setUseGpu(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    useGpu
                      ? 'bg-primary border-primary'
                      : 'bg-background border-default-300 hover:border-primary/50'
                  }`}
                  onClick={() => setUseGpu(!useGpu)}
                >
                  {useGpu && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gpu className="text-primary" size={16} />
                <label
                  className="text-sm font-medium text-default-700 cursor-pointer select-none"
                  onClick={() => setUseGpu(!useGpu)}
                >
                  Use GPU
                </label>
              </div>
            </div>

            {useGpu && (
              <GPUConfiguration service={service} onUpdateService={onUpdateService} />
            )}
          </CardBody>
        )}
      </Card>

      {/* Volumes */}
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
            {collapsedSections.has("volumes") ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </CardHeader>
        {!collapsedSections.has("volumes") && (
          <CardBody>
            <VolumeConfiguration service={service} onUpdateService={onUpdateService} />
          </CardBody>
        )}
      </Card>

      {/* Port Exposure */}
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
            {collapsedSections.has("ports") ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </CardHeader>
        {!collapsedSections.has("ports") && (
          <CardBody>
            <PortExposureConfiguration service={service} onUpdateService={onUpdateService} />
          </CardBody>
        )}
      </Card>
    </div>
  );
}
