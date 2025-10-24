"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Settings } from "lucide-react";

interface DeploymentSummaryProps {
  deploymentName: string;
  description: string;
  maxPrice: string;
  selectedRegion: string;
  deploymentMode: "template" | "application";
  selectedTemplate: any;
  services: any[];
  totalCpu: number;
  totalMemory: string;
  totalStorage: string;
  totalGpu: number;
  selectedBid: string;
  bids: any[];
  onMaxPriceChange?: (price: string) => void;
}

export default function DeploymentSummary({
  deploymentName,
  description: _description,
  maxPrice,
  selectedRegion,
  deploymentMode,
  selectedTemplate,
  services,
  totalCpu,
  totalMemory,
  totalStorage,
  totalGpu,
  selectedBid,
  bids,
  onMaxPriceChange,
}: DeploymentSummaryProps) {
  const selectedBidData = bids.find((bid) => bid.id === selectedBid);

  // Calculate total resources including replicas
  const calculateTotalResources = () => {
    let totalCpuWithReplicas = 0;
    let totalMemoryWithReplicas = 0;
    let totalStorageWithReplicas = 0;
    let totalGpuWithReplicas = 0;

    services.forEach(service => {
      const replicas = service.replicas || 1;
      
      // CPU calculation
      const cpuUnits = parseFloat(service.resources.cpu.units) || 0;
      totalCpuWithReplicas += cpuUnits * replicas;
      
      // Memory calculation
      const memorySize = parseFloat(service.resources.memory.size) || 0;
      totalMemoryWithReplicas += memorySize * replicas;
      
      // Storage calculation
      if (service.resources.storage && service.resources.storage.length > 0) {
        const storageSize = parseFloat(service.resources.storage[0].size) || 0;
        totalStorageWithReplicas += storageSize * replicas;
      }
      
      // GPU calculation
      if (service.resources.gpu) {
        const gpuUnits = parseInt(service.resources.gpu.units) || 0;
        totalGpuWithReplicas += gpuUnits * replicas;
      }
    });

    return {
      totalCpu: totalCpuWithReplicas,
      totalMemory: totalMemoryWithReplicas,
      totalStorage: totalStorageWithReplicas,
      totalGpu: totalGpuWithReplicas
    };
  };

  const resourcesWithReplicas = calculateTotalResources();

  // Calculate GPU requirements
  const calculateGPURequirements = () => {
    let totalGpuUnits = 0;
    const gpuModels = new Set();
    
    services.forEach(service => {
      if (service.resources.gpu && service.resources.gpu.configs && service.resources.gpu.configs.length > 0) {
        const replicas = service.replicas || 1;
        const gpuUnits = parseInt(service.resources.gpu.units || "0") || 0;
        
        if (gpuUnits > 0) {
          totalGpuUnits += gpuUnits * replicas;
          service.resources.gpu.configs.forEach(config => {
            gpuModels.add(`${config.vendor}-${config.model}-${config.memory}-${config.interface}`);
          });
        }
      }
    });
    
    return {
      totalUnits: totalGpuUnits,
      models: Array.from(gpuModels).map(modelKey => {
        const [vendor, model, memory, gpuInterface] = modelKey.split('-');
        return { vendor, model, memory, interface: gpuInterface };
      })
    };
  };

  const gpuRequirements = calculateGPURequirements();
  
  // Calculate estimated price based on market data
  const calculateEstimatedPrice = () => {
    // Market price rates (per hour)
    const marketRates = {
      cpu: 0.05, // SCU per CPU unit per hour
      memory: 0.02, // SCU per GB per hour
      storage: 0.01, // SCU per GB per hour
      gpu: {
        'NVIDIA-RTX4090': 0.5, // SCU per GPU per hour
        'NVIDIA-A100': 0.8, // SCU per GPU per hour
        'AMD-RX7900XTX': 0.4, // SCU per GPU per hour
        'default': 0.3 // SCU per GPU per hour for unknown models
      }
    };

    let totalPrice = 0;

    // CPU cost
    totalPrice += resourcesWithReplicas.totalCpu * marketRates.cpu;

    // Memory cost
    totalPrice += resourcesWithReplicas.totalMemory * marketRates.memory;

    // Storage cost
    totalPrice += resourcesWithReplicas.totalStorage * marketRates.storage;

    // GPU cost
    if (gpuRequirements.totalUnits > 0) {
      gpuRequirements.models.forEach(model => {
        const gpuKey = `${model.vendor}-${model.model}`;
        const gpuRate = marketRates.gpu[gpuKey] || marketRates.gpu.default;
        totalPrice += gpuRequirements.totalUnits * gpuRate;
      });
    }

    return {
      hourly: totalPrice,
      daily: totalPrice * 24,
      monthly: totalPrice * 24 * 30
    };
  };

  const priceEstimate = calculateEstimatedPrice();

  return (
    <Card className="subnet-card shadow-lg">
      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Settings className="text-primary" size={16} />
          Summary
        </h3>
      </CardHeader>
      <CardBody className="space-y-3 pt-0">
        {/* Basic Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-default-700 text-sm">Basic Info</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-default-600">Name:</span>
              <span className="font-medium truncate ml-2 max-w-[180px]" title={deploymentName || "Not specified"}>
                {deploymentName || "Not specified"}
              </span>
            </div>
            {selectedTemplate && (
              <div className="flex justify-between">
                <span className="text-default-600">Template:</span>
                <span className="font-medium text-sm">
                  {selectedTemplate.name}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-default-600">Price:</span>
              <span className="font-semibold text-primary text-xs">{maxPrice} SCU/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Region:</span>
              <span className="font-medium text-xs truncate max-w-[180px]" title={selectedRegion}>
                {selectedRegion === "any" ? "Any" : selectedRegion}
              </span>
            </div>
          </div>
        </div>

        {/* Price Estimation */}
        <div className="space-y-2">
          <h4 className="font-semibold text-default-700 text-sm">Estimated Cost</h4>
          <div className="bg-success/5 p-3 rounded text-xs">
            <div 
              className="flex justify-between items-center mb-1 cursor-pointer hover:bg-success/10 rounded p-1 -m-1 transition-colors"
              onClick={() => onMaxPriceChange?.(priceEstimate.hourly.toFixed(2))}
              title="Click to set as max price"
            >
              <span className="font-medium text-success">Hourly:</span>
              <span className="font-semibold text-success">{priceEstimate.hourly.toFixed(2)} SCU</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-default-600">Daily:</span>
              <span className="font-medium">{priceEstimate.daily.toFixed(2)} SCU</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-600">Monthly:</span>
              <span className="font-medium">{priceEstimate.monthly.toFixed(2)} SCU</span>
            </div>
          </div>
          <div className="bg-success/10 p-2 rounded text-xs text-success-700">
            Based on current market rates • Click hourly to set max price
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-2">
          <h4 className="font-semibold text-default-700 text-sm">Resources</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-primary/5 p-2 rounded text-center">
              <div className="text-lg font-bold text-primary">{resourcesWithReplicas.totalCpu}</div>
              <div className="text-xs text-default-600">CPU</div>
            </div>
            <div className="bg-success/5 p-2 rounded text-center">
              <div className="text-lg font-bold text-success">{resourcesWithReplicas.totalMemory}</div>
              <div className="text-xs text-default-600">GB RAM</div>
            </div>
            <div className="bg-warning/5 p-2 rounded text-center">
              <div className="text-lg font-bold text-warning">{resourcesWithReplicas.totalStorage}</div>
              <div className="text-xs text-default-600">GB SSD</div>
            </div>
            {resourcesWithReplicas.totalGpu > 0 && (
              <div className="bg-danger/5 p-2 rounded text-center">
                <div className="text-lg font-bold text-danger">{resourcesWithReplicas.totalGpu}</div>
                <div className="text-xs text-default-600">GPU</div>
              </div>
            )}
          </div>
        </div>

        {/* GPU Requirements */}
        {gpuRequirements.totalUnits > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-default-700 text-sm">GPU Required</h4>
            <div className="bg-primary/5 p-2 rounded text-xs mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-primary">Total Units:</span>
                <span className="font-semibold text-primary">{gpuRequirements.totalUnits}</span>
              </div>
            </div>
            <div className="space-y-1">
              {gpuRequirements.models.map((model, index) => (
                <div key={index} className="bg-primary/5 p-2 rounded text-xs mb-1">
                  <div className="text-default-600">
                    {model.vendor} {model.model} {model.memory} {model.interface}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-primary/10 p-2 rounded text-xs text-primary-700">
              Provider must have one of these GPU types
            </div>
          </div>
        )}

        {/* Services */}
        <div className="space-y-2">
          <h4 className="font-semibold text-default-700 text-sm">Services</h4>
          <div className="space-y-2">
            {services.length === 0 ? (
              <p className="text-xs text-default-500 text-center py-2">No services</p>
            ) : (
              services.map((service, index) => (
                <div key={index} className="bg-default-50 p-2 rounded text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-default-500">{service.replicas || 1}x</span>
                  </div>
                  <div className="text-default-600">
                    {service.resources.cpu.units} CPU, {service.resources.memory.size}
                    {service.resources.gpu && parseInt(service.resources.gpu.units) > 0 && (
                      <>, {service.resources.gpu.units} GPU</>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Bid */}
        {selectedBidData && (
          <div className="space-y-3">
            <h4 className="font-semibold text-default-700">
              Selected Provider
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Provider:</span>
                <span className="font-medium">
                  {selectedBidData.provider.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Price:</span>
                <span className="font-medium text-primary">
                  {selectedBidData.price} SCU/hour
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Location:</span>
                <span className="font-medium">
                  {selectedBidData.provider.location}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
