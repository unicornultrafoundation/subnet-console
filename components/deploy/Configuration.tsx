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
    { 
      id: "rtx4090", 
      name: "RTX 4090", 
      memory: "24GB", 
      interface: "PCIe 4.0",
      availableMemory: ["24GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "rtx4080", 
      name: "RTX 4080", 
      memory: "16GB", 
      interface: "PCIe 4.0",
      availableMemory: ["16GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "rtx4070", 
      name: "RTX 4070", 
      memory: "12GB", 
      interface: "PCIe 4.0",
      availableMemory: ["12GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "a100", 
      name: "A100", 
      memory: "40GB", 
      interface: "PCIe 4.0",
      availableMemory: ["40GB", "80GB"],
      availableInterfaces: ["PCIe 4.0", "NVLink"]
    },
    { 
      id: "a6000", 
      name: "A6000", 
      memory: "48GB", 
      interface: "PCIe 4.0",
      availableMemory: ["48GB"],
      availableInterfaces: ["PCIe 4.0", "NVLink"]
    },
    { 
      id: "v100", 
      name: "V100", 
      memory: "32GB", 
      interface: "PCIe 3.0",
      availableMemory: ["16GB", "32GB"],
      availableInterfaces: ["PCIe 3.0", "NVLink"]
    },
  ],
  amd: [
    { 
      id: "rx7900xtx", 
      name: "RX 7900 XTX", 
      memory: "24GB", 
      interface: "PCIe 4.0",
      availableMemory: ["24GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "rx7800xt", 
      name: "RX 7800 XT", 
      memory: "16GB", 
      interface: "PCIe 4.0",
      availableMemory: ["16GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "rx7700xt", 
      name: "RX 7700 XT", 
      memory: "12GB", 
      interface: "PCIe 4.0",
      availableMemory: ["12GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "mi100", 
      name: "MI100", 
      memory: "32GB", 
      interface: "PCIe 4.0",
      availableMemory: ["32GB"],
      availableInterfaces: ["PCIe 4.0", "Infinity Fabric"]
    },
  ],
  intel: [
    { 
      id: "arc770", 
      name: "Arc A770", 
      memory: "16GB", 
      interface: "PCIe 4.0",
      availableMemory: ["16GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
    { 
      id: "arc750", 
      name: "Arc A750", 
      memory: "8GB", 
      interface: "PCIe 4.0",
      availableMemory: ["8GB"],
      availableInterfaces: ["PCIe 4.0"]
    },
  ],
};

// Resource Unit Data
const CPU_UNITS = [
  { id: "cores", name: "Cores" },
  { id: "vcpu", name: "vCPU" },
  { id: "millicores", name: "mCores" },
];

const MEMORY_UNITS = [
  { id: "MB", name: "MB" },
  { id: "GB", name: "GB" },
  { id: "TB", name: "TB" },
];

// Volume Data
const VOLUME_SIZE_UNITS = [
  { id: "GB", name: "GB" },
  { id: "TB", name: "TB" },
  { id: "PB", name: "PB" },
];

const VOLUME_TYPES = [
  { id: "ssd", name: "SSD" },
  { id: "hdd", name: "HDD" },
  { id: "nvme", name: "NVMe" },
];

// Port Exposure Data
const PROTOCOL_TYPES = [
  { id: "http", name: "HTTP" },
  { id: "https", name: "HTTPS" },
  { id: "tcp", name: "TCP" },
  { id: "udp", name: "UDP" },
  { id: "grpc", name: "gRPC" },
];

interface GPUConfig {
  id: string;
  vendor: string;
  model: string;
  memory: string;
  interface: string;
}

interface Volume {
  id: string;
  name: string;
  size: string;
  sizeUnit: string;
  type: string;
  mount: string;
  readOnly: boolean;
}

interface PortExposure {
  id: string;
  port: number;
  as: number;
  protocol: string;
  acceptDomains: string[];
  toServices: string[];
}

interface Service {
  name: string;
  image: string;
  replicas: number;
  command: string[];
  args: string[];
  env: { key: string; value: string }[];
  volumes: Volume[];
  expose: PortExposure[];
  registryUrl?: string;
  registryUsername?: string;
  registryPassword?: string;
  resources: {
    cpu: { units: string; unitType: string };
    memory: { size: string; unitType: string };
    storage: { size: string; unitType: string }[];
    gpu?: { 
      units: string;
      configs: GPUConfig[];
    };
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
  hideApplicationSelection?: boolean;
}

// Simple Resource Slider Component
function ResourceSlider({ 
  label,
  icon: Icon,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit,
  unitOptions,
  onValueChange,
  onUnitChange,
  className = "",
  service
}: {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
  min?: number;
  max?: number;
  step?: number;
  unit: string;
  unitOptions: { id: string; name: string }[];
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  className?: string;
  service?: any;
}) {
  // Parse value correctly - handle formats like "10Gi", "1GB", "2cores"
  const parseValue = (val: string): number => {
    if (!val) return 0;
    // Extract numeric part from strings like "10Gi", "1GB", "2cores"
    const match = val.match(/^(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };
  
  const numericValue = parseValue(value);
  
  // Local state for real-time sync between slider and input
  const [localValue, setLocalValue] = React.useState(numericValue);
  
  // Update local value when prop value changes
  React.useEffect(() => {
    setLocalValue(numericValue);
  }, [numericValue]);
  
  console.log('ResourceSlider render:', { 
    label, value, numericValue, localValue, min, max, step, unit,
    unitType: service?.resources?.cpu?.unitType || 'undefined',
    memoryUnitType: service?.resources?.memory?.unitType || 'undefined',
    storageUnitType: service?.resources?.storage?.[0]?.unitType || 'undefined'
  });
  
  return (
    <div className={`bg-gradient-to-r from-default-50 to-default-100 rounded-lg p-4 border border-default-200 hover:border-primary-300 transition-all duration-200 ${className}`}>
      {/* Header with icon and label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Icon className="text-primary-600" size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-default-800">{label}</h4>
          <p className="text-xs text-default-500">Resource allocation</p>
        </div>
      </div>
      
      {/* Input and Unit controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            size="sm"
            type="number"
            value={localValue.toString()}
            onChange={(e) => {
              const newValue = e.target.value;
              const numericNewValue = parseFloat(newValue) || 0;
              console.log('Resource input changed:', { label, newValue, numericNewValue, oldValue: value });
              setLocalValue(numericNewValue);
              onValueChange(newValue);
            }}
            min={min}
            max={max}
            step={step}
            className="w-full"
            classNames={{
              input: "text-center font-bold text-primary-600 bg-white border-primary-200 focus:border-primary-500",
              inputWrapper: "bg-white shadow-sm"
            }}
            placeholder="0"
          />
        </div>
        <div className="w-24">
          <Select
            size="sm"
            value={unit}
            defaultSelectedKeys={[unit]}
            onSelectionChange={(keys) => {
              const selectedUnit = Array.from(keys)[0] as string;
              onUnitChange(selectedUnit);
            }}
            className="w-full"
            classNames={{
              trigger: "bg-white border-primary-200 hover:border-primary-300 shadow-sm",
              value: "text-primary-600 font-medium"
            }}
          >
            {unitOptions.map((option) => (
              <SelectItem key={option.id} className="text-primary-600">
                {option.name}
              </SelectItem>
            ))}
          </Select>
        </div>
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
  onUpdateService: (serviceName: string, field: string, value: any) => void;
}) {
  const gpuUnits = parseInt(service.resources.gpu?.units || "0");
  const gpuConfigs = service.resources.gpu?.configs || [];

  const addGPUConfig = () => {
    const newConfig: GPUConfig = {
      id: `gpu-${Date.now()}`,
      vendor: "nvidia",
      model: "rtx4090",
      memory: "24GB",
      interface: "PCIe 4.0",
    };
    
    const updatedConfigs = [...gpuConfigs, newConfig];
    onUpdateService(service.name, "gpu_configs", updatedConfigs);
  };

  const removeGPUConfig = (configId: string) => {
    const updatedConfigs = gpuConfigs.filter(config => config.id !== configId);
    onUpdateService(service.name, "gpu_configs", updatedConfigs);
  };

  const updateGPUConfig = (configId: string, field: string, value: string) => {
    const updatedConfigs = gpuConfigs.map(config => {
      if (config.id === configId) {
        const updatedConfig = { ...config, [field]: value };
        
        // If vendor changed, reset model to first available and update memory/interface
        if (field === "vendor") {
          const vendorModels = GPU_MODELS[value as keyof typeof GPU_MODELS] || [];
          if (vendorModels.length > 0) {
            updatedConfig.model = vendorModels[0].id;
            updatedConfig.memory = vendorModels[0].memory;
            updatedConfig.interface = vendorModels[0].interface;
          }
        }
        
        // If model changed, update memory and interface to model defaults
        if (field === "model") {
          const vendorModels = GPU_MODELS[config.vendor as keyof typeof GPU_MODELS] || [];
          const selectedModel = vendorModels.find(m => m.id === value);
          if (selectedModel) {
            updatedConfig.memory = selectedModel.memory;
            updatedConfig.interface = selectedModel.interface;
          }
        }
        
        return updatedConfig;
      }
      return config;
    });
    
    onUpdateService(service.name, "gpu_configs", updatedConfigs);
  };

  if (gpuUnits === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-default-700">GPU Configuration</h4>
        <Button
          color="primary"
          size="sm"
          startContent={<Plus size={16} />}
          variant="flat"
          onClick={addGPUConfig}
        >
          Add GPU
        </Button>
      </div>
      
      <div className="space-y-3">
        {gpuConfigs.map((config, index) => {
          const vendorModels = GPU_MODELS[config.vendor as keyof typeof GPU_MODELS] || [];
          const selectedModel = vendorModels.find(m => m.id === config.model);
          
          // Get available memory and interface options for the selected model
          const availableMemoryOptions = selectedModel?.availableMemory || [];
          const availableInterfaceOptions = selectedModel?.availableInterfaces || [];
          
          return (
            <Card key={config.id} className="border border-default-200">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gpu className="text-primary" size={16} />
                  <span className="font-medium">GPU {index + 1}</span>
                </div>
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="light"
                  onClick={() => removeGPUConfig(config.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select
                    label="Vendor"
                    selectedKeys={config.vendor ? [config.vendor] : []}
                    onSelectionChange={(keys) => {
                      const selectedVendor = Array.from(keys)[0] as string;
                      updateGPUConfig(config.id, "vendor", selectedVendor);
                    }}
                  >
                    {GPU_VENDORS.map((vendor) => (
                      <SelectItem key={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Model"
                    selectedKeys={config.model ? [config.model] : []}
                    onSelectionChange={(keys) => {
                      const selectedModel = Array.from(keys)[0] as string;
                      updateGPUConfig(config.id, "model", selectedModel);
                    }}
                  >
                    {vendorModels.map((model) => (
                      <SelectItem key={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Memory"
                    selectedKeys={config.memory ? [config.memory] : []}
                    onSelectionChange={(keys) => {
                      const selectedMemory = Array.from(keys)[0] as string;
                      updateGPUConfig(config.id, "memory", selectedMemory);
                    }}
                    isDisabled={availableMemoryOptions.length === 0}
                  >
                    {availableMemoryOptions.map((memory) => (
                      <SelectItem key={memory}>
                        {memory}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Interface"
                    selectedKeys={config.interface ? [config.interface] : []}
                    onSelectionChange={(keys) => {
                      const selectedInterface = Array.from(keys)[0] as string;
                      updateGPUConfig(config.id, "interface", selectedInterface);
                    }}
                    isDisabled={availableInterfaceOptions.length === 0}
                  >
                    {availableInterfaceOptions.map((interfaceOption) => (
                      <SelectItem key={interfaceOption}>
                        {interfaceOption}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Volume Configuration Component
function VolumeConfiguration({ 
  service, 
  onUpdateService 
}: { 
  service: Service; 
  onUpdateService: (serviceName: string, field: string, value: any) => void;
}) {
  const volumes = service.volumes || [];

  const addVolume = () => {
    const newVolume: Volume = {
      id: `volume-${Date.now()}`,
      name: `volume-${volumes.length + 1}`,
      size: "10",
      sizeUnit: "GB",
      type: "ssd",
      mount: "/data",
      readOnly: false,
    };
    
    const updatedVolumes = [...volumes, newVolume];
    onUpdateService(service.name, "volumes", updatedVolumes);
  };

  const removeVolume = (volumeId: string) => {
    const updatedVolumes = volumes.filter(volume => volume.id !== volumeId);
    onUpdateService(service.name, "volumes", updatedVolumes);
  };

  const updateVolume = (volumeId: string, field: string, value: any) => {
    const updatedVolumes = volumes.map(volume => {
      if (volume.id === volumeId) {
        return { ...volume, [field]: value };
      }
      return volume;
    });
    
    onUpdateService(service.name, "volumes", updatedVolumes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-default-700">Volumes</h4>
        <Button
          color="primary"
          size="sm"
          startContent={<Plus size={16} />}
          variant="flat"
          onClick={addVolume}
        >
          Add Volume
        </Button>
      </div>
      
      <div className="space-y-3">
        {volumes.map((volume, index) => (
          <Card key={volume.id} className="border border-default-200">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="text-primary" size={16} />
                <span className="font-medium">Volume {index + 1}</span>
              </div>
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onClick={() => removeVolume(volume.id)}
              >
                <Trash2 size={16} />
              </Button>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Volume Name"
                  placeholder="data-volume"
                  value={volume.name}
                  onChange={(e) => updateVolume(volume.id, "name", e.target.value)}
                />
                <Input
                  label="Mount Path"
                  placeholder="/data"
                  value={volume.mount}
                  onChange={(e) => updateVolume(volume.id, "mount", e.target.value)}
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Size"
                  placeholder="10"
                  type="number"
                  min="1"
                  value={volume.size}
                  onChange={(e) => updateVolume(volume.id, "size", e.target.value)}
                />
                <Select
                  label="Size Unit"
                  selectedKeys={volume.sizeUnit ? [volume.sizeUnit] : []}
                  onSelectionChange={(keys) => {
                    const selectedUnit = Array.from(keys)[0] as string;
                    updateVolume(volume.id, "sizeUnit", selectedUnit);
                  }}
                >
                  {VOLUME_SIZE_UNITS.map((unit) => (
                    <SelectItem key={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Storage Type"
                  selectedKeys={volume.type ? [volume.type] : []}
                  onSelectionChange={(keys) => {
                    const selectedType = Array.from(keys)[0] as string;
                    updateVolume(volume.id, "type", selectedType);
                  }}
                >
                  {VOLUME_TYPES.map((type) => (
                    <SelectItem key={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`readonly-${volume.id}`}
                  checked={volume.readOnly}
                  onChange={(e) => updateVolume(volume.id, "readOnly", e.target.checked)}
                  className="rounded border-default-300"
                />
                <label htmlFor={`readonly-${volume.id}`} className="text-sm text-default-600">
                  Read Only
                </label>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Port Exposure Configuration Component
function PortExposureConfiguration({ 
  service, 
  onUpdateService,
  allServices 
}: { 
  service: Service; 
  onUpdateService: (serviceName: string, field: string, value: any) => void;
  allServices: Service[];
}) {
  const exposePorts = service.expose || [];
  const [domainInputs, setDomainInputs] = React.useState<Record<string, string>>({});

  const addPortExposure = () => {
    const newExposure: PortExposure = {
      id: `port-${Date.now()}`,
      port: 80,
      as: 80,
      protocol: "http",
      acceptDomains: [],
      toServices: [],
    };
    
    const updatedExposures = [...exposePorts, newExposure];
    onUpdateService(service.name, "expose", updatedExposures);
  };

  const removePortExposure = (exposureId: string) => {
    const updatedExposures = exposePorts.filter(exposure => exposure.id !== exposureId);
    onUpdateService(service.name, "expose", updatedExposures);
  };

  const updatePortExposure = (exposureId: string, field: string, value: any) => {
    const updatedExposures = exposePorts.map(exposure => {
      if (exposure.id === exposureId) {
        return { ...exposure, [field]: value };
      }
      return exposure;
    });
    
    onUpdateService(service.name, "expose", updatedExposures);
  };

  const addDomain = (exposureId: string, domain: string) => {
    const trimmedDomain = domain.trim();
    if (trimmedDomain) {
      const updatedExposures = exposePorts.map(exposure => {
        if (exposure.id === exposureId) {
          // Check if domain already exists
          if (exposure.acceptDomains.includes(trimmedDomain)) {
            return exposure; // Don't add duplicate
          }
          return {
            ...exposure,
            acceptDomains: [...exposure.acceptDomains, trimmedDomain]
          };
        }
        return exposure;
      });
      onUpdateService(service.name, "expose", updatedExposures);
      // Clear the input after adding
      setDomainInputs(prev => ({ ...prev, [exposureId]: '' }));
    }
  };

  const updateDomainInput = (exposureId: string, value: string) => {
    setDomainInputs(prev => ({ ...prev, [exposureId]: value }));
  };

  const removeDomain = (exposureId: string, domainIndex: number) => {
    const updatedExposures = exposePorts.map(exposure => {
      if (exposure.id === exposureId) {
        return {
          ...exposure,
          acceptDomains: exposure.acceptDomains.filter((_, index) => index !== domainIndex)
        };
      }
      return exposure;
    });
    onUpdateService(service.name, "expose", updatedExposures);
  };

  const toggleService = (exposureId: string, serviceName: string) => {
    const updatedExposures = exposePorts.map(exposure => {
      if (exposure.id === exposureId) {
        const isSelected = exposure.toServices.includes(serviceName);
        return {
          ...exposure,
          toServices: isSelected 
            ? exposure.toServices.filter(s => s !== serviceName)
            : [...exposure.toServices, serviceName]
        };
      }
      return exposure;
    });
    onUpdateService(service.name, "expose", updatedExposures);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-default-700">Port Exposure</h4>
        <Button
          color="primary"
          size="sm"
          startContent={<Plus size={16} />}
          variant="flat"
          onClick={addPortExposure}
        >
          Add Port
        </Button>
      </div>
      
      <div className="space-y-3">
        {exposePorts.map((exposure, index) => (
          <Card key={exposure.id} className="border border-default-200">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="text-primary" size={16} />
                <span className="font-medium">Port {index + 1}</span>
              </div>
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onClick={() => removePortExposure(exposure.id)}
              >
                <Trash2 size={16} />
              </Button>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Internal Port"
                  placeholder="80"
                  type="number"
                  min="1"
                  max="65535"
                  value={exposure.port.toString()}
                  onChange={(e) => updatePortExposure(exposure.id, "port", parseInt(e.target.value))}
                />
                <Input
                  label="External Port"
                  placeholder="80"
                  type="number"
                  min="1"
                  max="65535"
                  value={exposure.as.toString()}
                  onChange={(e) => updatePortExposure(exposure.id, "as", parseInt(e.target.value))}
                />
                <Select
                  label="Protocol"
                  selectedKeys={exposure.protocol ? [exposure.protocol] : []}
                  onSelectionChange={(keys) => {
                    const selectedProtocol = Array.from(keys)[0] as string;
                    updatePortExposure(exposure.id, "protocol", selectedProtocol);
                  }}
                >
                  {PROTOCOL_TYPES.map((protocol) => (
                    <SelectItem key={protocol.id}>
                      {protocol.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              {/* Accept Domains */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-default-700">Accept Domains</label>
                
                {/* Display existing domains */}
                {exposure.acceptDomains.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exposure.acceptDomains.map((domain, domainIndex) => (
                      <Chip
                        key={domainIndex}
                        color="primary"
                        variant="flat"
                        onClose={() => removeDomain(exposure.id, domainIndex)}
                        className="cursor-pointer"
                      >
                        {domain}
                      </Chip>
                    ))}
                  </div>
                )}
                
                {/* Add new domain */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter domain (e.g., example.com)"
                    className="flex-1"
                    value={domainInputs[exposure.id] || ''}
                    onChange={(e) => updateDomainInput(exposure.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const domain = domainInputs[exposure.id] || '';
                        if (domain.trim()) {
                          addDomain(exposure.id, domain);
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onClick={() => {
                      const domain = domainInputs[exposure.id] || '';
                      if (domain.trim()) {
                        addDomain(exposure.id, domain);
                      }
                    }}
                  >
                    Add Domain
                  </Button>
                </div>
                
                {exposure.acceptDomains.length === 0 && (
                  <p className="text-xs text-default-500">
                    No domains configured. Add domains to restrict access to specific domains.
                  </p>
                )}
              </div>
              
              {/* To Services */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-default-700">To Services</label>
                <div className="grid grid-cols-2 gap-2">
                  {allServices.map((svc) => (
                    <div key={svc.name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`service-${exposure.id}-${svc.name}`}
                        checked={exposure.toServices.includes(svc.name)}
                        onChange={() => toggleService(exposure.id, svc.name)}
                        className="rounded border-default-300"
                      />
                      <label htmlFor={`service-${exposure.id}-${svc.name}`} className="text-sm text-default-600">
                        {svc.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
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
  hideApplicationSelection = false,
}: ConfigurationProps) {
  // State for service collapse/expand
  const [collapsedServices, setCollapsedServices] = React.useState<Set<number>>(new Set());
  const [showRegistryAuth, setShowRegistryAuth] = React.useState<Set<number>>(new Set());

  const toggleServiceCollapse = (index: number) => {
    const newCollapsed = new Set(collapsedServices);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedServices(newCollapsed);
  };

  const toggleRegistryAuth = (index: number) => {
    const newShow = new Set(showRegistryAuth);
    if (newShow.has(index)) {
      newShow.delete(index);
    } else {
      newShow.add(index);
    }
    setShowRegistryAuth(newShow);
  };

  // If pre-configured template is selected, show template info only
  if (selectedTemplate && deploymentMode === "application") {
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
              This template is pre-configured and ready to deploy. The configuration is fixed and cannot be modified.
            </p>

            {/* Template Resources Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Template Resources</h3>
              <div className="bg-default-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-primary" size={16} />
                    <span className="text-default-600">CPU:</span>
                    <span className="font-medium">As configured in template</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MemoryStick className="text-primary" size={16} />
                    <span className="text-default-600">Memory:</span>
                    <span className="font-medium">As configured in template</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="text-primary" size={16} />
                    <span className="text-default-600">Storage:</span>
                    <span className="font-medium">As configured in template</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Gpu className="text-primary" size={16} />
                  <span className="text-default-600">GPU:</span>
                  <span className="font-medium">As configured in template</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Custom Template Mode - Full template builder with GPU configuration
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
                      <h3 className="text-lg font-semibold">
                        {service.name}
                      </h3>
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
                        {collapsedServices.has(index) ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
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
                    <CardBody className="space-y-4">
                    {/* Basic Service Info */}
                    <div className="grid md:grid-cols-3 gap-4">
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
                      <Input
                        label="Replicas"
                        type="number"
                        min="1"
                        max="100"
                        value={service.replicas?.toString() || "1"}
                        onChange={(e) =>
                          onUpdateService(
                            service.name,
                            "replicas",
                            parseInt(e.target.value) || 1,
                          )
                        }
                      />
                    </div>

                    {/* Docker Registry Authentication Toggle */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`registry-auth-${index}`}
                          checked={showRegistryAuth.has(index)}
                          onChange={() => toggleRegistryAuth(index)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <label htmlFor={`registry-auth-${index}`} className="text-sm font-medium text-default-700">
                          Use Private Docker Registry
                        </label>
                      </div>
                      
                      {showRegistryAuth.has(index) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-default-700">Docker Registry Authentication</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <Input
                              label="Registry URL"
                              placeholder="registry.example.com"
                              value={service.registryUrl || ""}
                              onChange={(e) =>
                                onUpdateService(
                                  service.name,
                                  "registryUrl",
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              label="Username"
                              placeholder="username"
                              value={service.registryUsername || ""}
                              onChange={(e) =>
                                onUpdateService(
                                  service.name,
                                  "registryUsername",
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              label="Password"
                              type="password"
                              placeholder="password"
                              value={service.registryPassword || ""}
                              onChange={(e) =>
                                onUpdateService(
                                  service.name,
                                  "registryPassword",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <p className="text-xs text-default-500">
                            Required for private registries. Leave empty for public Docker Hub.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Command and Args */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-default-700">Command & Arguments</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Command"
                          placeholder="nginx"
                          value={service.command.join(' ')}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "command",
                              e.target.value.split(' ').filter(cmd => cmd.trim() !== '')
                            )
                          }
                        />
                        <Input
                          label="Arguments"
                          placeholder="-g daemon off;"
                          value={service.args.join(' ')}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "args",
                              e.target.value.split(' ').filter(arg => arg.trim() !== '')
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-default-700">
                        Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* CPU */}
                        <ResourceSlider
                          label="CPU"
                          icon={Cpu}
                          value={service.resources.cpu.units}
                          min={0}
                          max={32}
                          step={1}
                          unit={service.resources.cpu.unitType || "cores"}
                          unitOptions={CPU_UNITS}
                          onValueChange={(value) => {
                            console.log('CPU onValueChange called:', { serviceName: service.name, field: "cpu_units", value });
                            onUpdateService(service.name, "cpu_units", value);
                          }}
                          onUnitChange={(unit) => onUpdateService(service.name, "cpu_unitType", unit)}
                          service={service}
                        />

                        {/* Memory */}
                        <ResourceSlider
                          label="Memory"
                          icon={MemoryStick}
                          value={service.resources.memory.size}
                          min={0}
                          max={128}
                          step={1}
                          unit={service.resources.memory.unitType || "GB"}
                          unitOptions={MEMORY_UNITS}
                          onValueChange={(value) => onUpdateService(service.name, "memory_size", value)}
                          onUnitChange={(unit) => onUpdateService(service.name, "memory_unitType", unit)}
                          service={service}
                        />

                        {/* GPU */}
                        <ResourceSlider
                          label="GPU"
                          icon={Gpu}
                          value={service.resources.gpu?.units || "0"}
                          min={0}
                          max={8}
                          step={1}
                          unit="units"
                          unitOptions={[{ id: "units", name: "units" }]}
                          onValueChange={(value) => onUpdateService(service.name, "gpu_units", value)}
                          onUnitChange={() => {}} // GPU không có unit type
                          service={service}
                        />
                      </div>
                        
                      <GPUConfiguration 
                        service={service} 
                        onUpdateService={onUpdateService} 
                      />
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
                                  ...newEnv[envIndex],
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
                                  ...newEnv[envIndex],
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
                          color="primary"
                          size="sm"
                          startContent={<Plus size={16} />}
                          variant="flat"
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
                    <VolumeConfiguration 
                      service={service} 
                      onUpdateService={onUpdateService} 
                    />

                    {/* Port Exposure */}
                    <PortExposureConfiguration 
                      service={service} 
                      onUpdateService={onUpdateService}
                      allServices={services}
                    />
                  </CardBody>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  // Application Mode - Show applications and allow GPU configuration
  return (
    <div className="space-y-6">
      {/* Applications - Only show if not hidden */}
      {!hideApplicationSelection && (
        <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <Code className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Available Applications</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-default-600">
            Choose from pre-built applications or create your own custom
            deployment.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`cursor-pointer transition-all rounded-lg border-2 p-4 ${
                  selectedApp === app.id
                    ? "border-primary bg-primary/5"
                    : "border-default-200 hover:border-primary/50"
                }`}
                onClick={() => onApplicationSelect(app.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code className="text-primary" size={16} />
                    </div>
                    <h3 className="font-semibold text-sm">{app.name}</h3>
                  </div>
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
            ))}
          </div>
        </CardBody>
      </Card>
      )}

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
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        color="default"
                        size="sm"
                        variant="light"
                        onClick={() => toggleServiceCollapse(index)}
                      >
                        {collapsedServices.has(index) ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
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
                    <CardBody className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
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
                      <Input
                        label="Replicas"
                        type="number"
                        min="1"
                        max="100"
                        value={service.replicas?.toString() || "1"}
                        onChange={(e) =>
                          onUpdateService(
                            service.name,
                            "replicas",
                            parseInt(e.target.value) || 1,
                          )
                        }
                      />
                    </div>

                    {/* Docker Registry Authentication Toggle */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`registry-auth-app-${index}`}
                          checked={showRegistryAuth.has(index)}
                          onChange={() => toggleRegistryAuth(index)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <label htmlFor={`registry-auth-app-${index}`} className="text-sm font-medium text-default-700">
                          Use Private Docker Registry
                        </label>
                      </div>
                      
                      {showRegistryAuth.has(index) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-default-700">Docker Registry Authentication</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <Input
                              label="Registry URL"
                              placeholder="registry.example.com"
                              value={service.registryUrl || ""}
                              onChange={(e) =>
                                onUpdateService(service.name, "registryUrl", e.target.value)
                              }
                            />
                            <Input
                              label="Username"
                              placeholder="username"
                              value={service.registryUsername || ""}
                              onChange={(e) =>
                                onUpdateService(service.name, "registryUsername", e.target.value)
                              }
                            />
                            <Input
                              label="Password"
                              type="password"
                              placeholder="password"
                              value={service.registryPassword || ""}
                              onChange={(e) =>
                                onUpdateService(service.name, "registryPassword", e.target.value)
                              }
                            />
                          </div>
                          <p className="text-xs text-default-500">
                            Required for private registries. Leave empty for public Docker Hub.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Command and Args */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-default-700">Command & Arguments</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Command"
                          placeholder="nginx"
                          value={service.command.join(' ')}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "command",
                              e.target.value.split(' ').filter(cmd => cmd.trim() !== '')
                            )
                          }
                        />
                        <Input
                          label="Arguments"
                          placeholder="-g daemon off;"
                          value={service.args.join(' ')}
                          onChange={(e) =>
                            onUpdateService(
                              service.name,
                              "args",
                              e.target.value.split(' ').filter(arg => arg.trim() !== '')
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* CPU */}
                      <ResourceSlider
                        label="CPU"
                        icon={Cpu}
                        value={service.resources.cpu.units}
                        min={0}
                        max={32}
                        step={1}
                        unit={service.resources.cpu.unitType || "cores"}
                        unitOptions={CPU_UNITS}
                        onValueChange={(value) => {
                          console.log('CPU onValueChange called (App mode):', { serviceName: service.name, field: "cpu_units", value });
                          onUpdateService(service.name, "cpu_units", value);
                        }}
                        onUnitChange={(unit) => onUpdateService(service.name, "cpu_unitType", unit)}
                        service={service}
                      />

                      {/* Memory */}
                      <ResourceSlider
                        label="Memory"
                        icon={MemoryStick}
                        value={service.resources.memory.size}
                        min={0}
                        max={128}
                        step={1}
                        unit={service.resources.memory.unitType || "GB"}
                        unitOptions={MEMORY_UNITS}
                        onValueChange={(value) => onUpdateService(service.name, "memory_size", value)}
                        onUnitChange={(unit) => onUpdateService(service.name, "memory_unitType", unit)}
                        service={service}
                      />

                      {/* GPU */}
                      <ResourceSlider
                        label="GPU"
                        icon={Gpu}
                        value={service.resources.gpu?.units || "0"}
                        min={0}
                        max={8}
                        step={1}
                        unit="units"
                        unitOptions={[{ id: "units", name: "units" }]}
                        onValueChange={(value) => onUpdateService(service.name, "gpu_units", value)}
                        onUnitChange={() => {}} // GPU không có unit type
                        service={service}
                      />
                    </div>
                      
                    <GPUConfiguration 
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
      )}
    </div>
  );
}