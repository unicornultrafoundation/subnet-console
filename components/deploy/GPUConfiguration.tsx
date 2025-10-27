"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Gpu, Plus, Trash2 } from "lucide-react";

// GPU Data
const GPU_VENDORS = [
  { id: "nvidia", name: "NVIDIA" },
  { id: "amd", name: "AMD" },
  { id: "intel", name: "Intel" },
];

const GPU_MODELS = {
  nvidia: [
    { id: "rtx-4090", name: "RTX 4090" },
    { id: "rtx-4080", name: "RTX 4080" },
    { id: "rtx-4070", name: "RTX 4070" },
    { id: "rtx-3090", name: "RTX 3090" },
    { id: "rtx-3080", name: "RTX 3080" },
    { id: "rtx-3070", name: "RTX 3070" },
    { id: "a100", name: "A100" },
    { id: "v100", name: "V100" },
    { id: "t4", name: "T4" },
  ],
  amd: [
    { id: "rx-7900xtx", name: "RX 7900 XTX" },
    { id: "rx-7900xt", name: "RX 7900 XT" },
    { id: "rx-7800xt", name: "RX 7800 XT" },
    { id: "rx-7700xt", name: "RX 7700 XT" },
    { id: "mi250", name: "MI250" },
    { id: "mi200", name: "MI200" },
  ],
  intel: [
    { id: "arc-a770", name: "Arc A770" },
    { id: "arc-a750", name: "Arc A750" },
    { id: "arc-a580", name: "Arc A580" },
    { id: "pvc", name: "PVC" },
  ],
};

// GPU Memory options by model
const GPU_MEMORY_BY_MODEL = {
  // NVIDIA Models
  "rtx-4090": [{ id: "24GB", name: "24GB" }],
  "rtx-4080": [{ id: "16GB", name: "16GB" }],
  "rtx-4070": [{ id: "12GB", name: "12GB" }],
  "rtx-3090": [{ id: "24GB", name: "24GB" }],
  "rtx-3080": [
    { id: "10GB", name: "10GB" },
    { id: "12GB", name: "12GB" },
  ],
  "rtx-3070": [{ id: "8GB", name: "8GB" }],
  a100: [
    { id: "40GB", name: "40GB" },
    { id: "80GB", name: "80GB" },
  ],
  v100: [
    { id: "16GB", name: "16GB" },
    { id: "32GB", name: "32GB" },
  ],
  t4: [{ id: "16GB", name: "16GB" }],

  // AMD Models
  "rx-7900xtx": [{ id: "24GB", name: "24GB" }],
  "rx-7900xt": [{ id: "20GB", name: "20GB" }],
  "rx-7800xt": [{ id: "16GB", name: "16GB" }],
  "rx-7700xt": [{ id: "12GB", name: "12GB" }],
  mi250: [{ id: "128GB", name: "128GB" }],
  mi200: [{ id: "64GB", name: "64GB" }],

  // Intel Models
  "arc-a770": [{ id: "16GB", name: "16GB" }],
  "arc-a750": [{ id: "8GB", name: "8GB" }],
  "arc-a580": [{ id: "8GB", name: "8GB" }],
  pvc: [{ id: "16GB", name: "16GB" }],
};

// GPU Interface options by model
const GPU_INTERFACES_BY_MODEL = {
  // NVIDIA Models
  "rtx-4090": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "PCIe-5.0", name: "PCIe 5.0" },
  ],
  "rtx-4080": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "PCIe-5.0", name: "PCIe 5.0" },
  ],
  "rtx-4070": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "PCIe-5.0", name: "PCIe 5.0" },
  ],
  "rtx-3090": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "NVLink", name: "NVLink" },
  ],
  "rtx-3080": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "NVLink", name: "NVLink" },
  ],
  "rtx-3070": [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
  a100: [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "NVLink", name: "NVLink" },
  ],
  v100: [
    { id: "PCIe-3.0", name: "PCIe 3.0" },
    { id: "NVLink", name: "NVLink" },
  ],
  t4: [{ id: "PCIe-3.0", name: "PCIe 3.0" }],

  // AMD Models
  "rx-7900xtx": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "PCIe-5.0", name: "PCIe 5.0" },
  ],
  "rx-7900xt": [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "PCIe-5.0", name: "PCIe 5.0" },
  ],
  "rx-7800xt": [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
  "rx-7700xt": [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
  mi250: [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "Infinity-Fabric", name: "Infinity Fabric" },
  ],
  mi200: [
    { id: "PCIe-4.0", name: "PCIe 4.0" },
    { id: "Infinity-Fabric", name: "Infinity Fabric" },
  ],

  // Intel Models
  "arc-a770": [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
  "arc-a750": [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
  "arc-a580": [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
  pvc: [{ id: "PCIe-4.0", name: "PCIe 4.0" }],
};

interface GPUConfigurationProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function GPUConfiguration({
  service,
  onUpdateService,
}: GPUConfigurationProps) {
  const [selectedVendor, setSelectedVendor] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [selectedMemory, setSelectedMemory] = React.useState<string>("");
  const [selectedInterface, setSelectedInterface] = React.useState<string>("");

  const handleAddGPU = () => {
    if (
      !selectedVendor ||
      !selectedModel ||
      !selectedMemory ||
      !selectedInterface
    )
      return;

    const gpuConfig = {
      vendor: selectedVendor,
      model: selectedModel,
      memory: selectedMemory,
      interface: selectedInterface,
    };

    const currentGpus = service.resources.gpu?.configs || [];
    const newGpus = [...currentGpus, gpuConfig];

    onUpdateService("gpu_configs", newGpus);

    // Reset selections
    setSelectedVendor("");
    setSelectedModel("");
    setSelectedMemory("");
    setSelectedInterface("");
  };

  const handleRemoveGPU = (index: number) => {
    const currentGpus = service.resources.gpu?.configs || [];
    const newGpus = currentGpus.filter((_: any, i: number) => i !== index);

    onUpdateService("gpu_configs", newGpus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Gpu className="text-primary" size={16} />
        <span className="text-sm font-medium text-default-700">
          GPU Configuration
        </span>
      </div>

      {/* GPU Units */}
      <div className="space-y-4">
        <Input
          className="w-full"
          label="GPU Units"
          placeholder="0"
          size="sm"
          value={service.resources.gpu?.units || "0"}
          onChange={(e) => onUpdateService("gpu_units", e.target.value)}
        />
      </div>

      {/* GPU Configs */}
      {parseInt(service.resources.gpu?.units || "0") > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-default-700">GPU Models</div>

          {/* Add GPU Form */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              aria-label="Select GPU vendor"
              placeholder="Vendor"
              selectedKeys={selectedVendor ? [selectedVendor] : []}
              size="sm"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                setSelectedVendor(selected);
                setSelectedModel(""); // Reset model when vendor changes
                setSelectedMemory(""); // Reset memory when vendor changes
                setSelectedInterface(""); // Reset interface when vendor changes
              }}
            >
              {GPU_VENDORS.map((vendor) => (
                <SelectItem key={vendor.id}>{vendor.name}</SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Select GPU model"
              isDisabled={!selectedVendor}
              placeholder="Model"
              selectedKeys={selectedModel ? [selectedModel] : []}
              size="sm"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                setSelectedModel(selected);
                setSelectedMemory(""); // Reset memory when model changes
                setSelectedInterface(""); // Reset interface when model changes
              }}
            >
              {selectedVendor
                ? GPU_MODELS[selectedVendor as keyof typeof GPU_MODELS]?.map(
                    (model) => (
                      <SelectItem key={model.id}>{model.name}</SelectItem>
                    ),
                  )
                : []}
            </Select>

            <Select
              aria-label="Select GPU memory"
              isDisabled={!selectedVendor || !selectedModel}
              placeholder="Memory"
              selectedKeys={selectedMemory ? [selectedMemory] : []}
              size="sm"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                setSelectedMemory(selected);
                setSelectedInterface(""); // Reset interface when memory changes
              }}
            >
              {selectedModel
                ? GPU_MEMORY_BY_MODEL[
                    selectedModel as keyof typeof GPU_MEMORY_BY_MODEL
                  ]?.map((memory) => (
                    <SelectItem key={memory.id}>{memory.name}</SelectItem>
                  ))
                : []}
            </Select>

            <Select
              aria-label="Select GPU interface"
              isDisabled={!selectedVendor || !selectedModel || !selectedMemory}
              placeholder="Interface"
              selectedKeys={selectedInterface ? [selectedInterface] : []}
              size="sm"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                setSelectedInterface(selected);
              }}
            >
              {selectedModel
                ? GPU_INTERFACES_BY_MODEL[
                    selectedModel as keyof typeof GPU_INTERFACES_BY_MODEL
                  ]?.map((gpuInterface) => (
                    <SelectItem key={gpuInterface.id}>
                      {gpuInterface.name}
                    </SelectItem>
                  ))
                : []}
            </Select>
          </div>

          <Button
            color="primary"
            isDisabled={
              !selectedVendor ||
              !selectedModel ||
              !selectedMemory ||
              !selectedInterface
            }
            size="sm"
            startContent={<Plus size={14} />}
            variant="bordered"
            onClick={handleAddGPU}
          >
            Add GPU Model
          </Button>

          {/* GPU List */}
          {service.resources.gpu?.configs?.length > 0 && (
            <div className="space-y-2">
              {service.resources.gpu.configs.map((gpu: any, index: number) => (
                <div
                  key={`gpu-${gpu.vendor}-${gpu.model}-${gpu.memory}-${gpu.interface}-${index}`}
                  className="flex items-center justify-between p-3 bg-default-50 rounded-lg border border-default-200"
                >
                  <div className="flex items-center gap-3">
                    <Gpu className="text-primary" size={16} />
                    <div className="text-sm">
                      <span className="font-medium">
                        {gpu.vendor} {gpu.model} {gpu.memory} {gpu.interface}
                      </span>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    variant="light"
                    onClick={() => handleRemoveGPU(index)}
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
