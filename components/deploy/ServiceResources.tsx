"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Cpu, MemoryStick, Gpu, ChevronUp, ChevronDown } from "lucide-react";
import GPUConfiguration from "./GPUConfiguration";

// CPU Units
const CPU_UNITS = [
  { id: "cores", name: "Cores" },
  { id: "mCores", name: "mCores" },
];

// Memory Units
const MEMORY_UNITS = [
  { id: "GB", name: "GB" },
  { id: "MB", name: "MB" },
  { id: "Gi", name: "Gi" },
  { id: "Mi", name: "Mi" },
];

interface ServiceResourcesProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function ServiceResources({ service, onUpdateService }: ServiceResourcesProps) {
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set());
  const [useGpu, setUseGpu] = React.useState(parseInt(service.resources.gpu?.units || "0") > 0);

  // Sync useGpu state when GPU units change
  React.useEffect(() => {
    const gpuUnits = parseInt(service.resources.gpu?.units || "0");
    setUseGpu(gpuUnits > 0);
  }, [service.resources.gpu?.units]);

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
                  aria-label="CPU unit selector"
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
                  aria-label="Memory unit selector"
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
                onChange={(e) => {
                  const checked = e.target.checked;
                  console.log("GPU checkbox onChange:", checked);
                  setUseGpu(checked);
                  if (!checked) {
                    // Reset GPU units to 0 when unchecked
                    onUpdateService("gpu_units", "0");
                  } else {
                    // Set GPU units to 1 when checked
                    onUpdateService("gpu_units", "1");
                  }
                }}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  useGpu
                    ? 'bg-primary border-primary'
                    : 'bg-background border-default-300 hover:border-primary/50'
                }`}
                onClick={() => {
                  const newChecked = !useGpu;
                  console.log("GPU div onClick:", newChecked);
                  setUseGpu(newChecked);
                  if (!newChecked) {
                    // Reset GPU units to 0 when unchecked
                    onUpdateService("gpu_units", "0");
                  } else {
                    // Set GPU units to 1 when checked
                    onUpdateService("gpu_units", "1");
                  }
                }}
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
                onClick={() => {
                  const newChecked = !useGpu;
                  setUseGpu(newChecked);
                  if (!newChecked) {
                    // Reset GPU units to 0 when unchecked
                    onUpdateService("gpu_units", "0");
                  } else {
                    // Set GPU units to 1 when checked
                    onUpdateService("gpu_units", "1");
                  }
                }}
              >
                Use GPU
              </label>
            </div>
          </div>

          {(() => {
            const gpuUnits = parseInt(service.resources.gpu?.units || "0");
            console.log("GPU units:", gpuUnits, "useGpu:", useGpu, "service.resources.gpu:", service.resources.gpu);
            return gpuUnits > 0 && (
              <GPUConfiguration service={service} onUpdateService={onUpdateService} />
            );
          })()}
        </CardBody>
      )}
    </Card>
  );
}
