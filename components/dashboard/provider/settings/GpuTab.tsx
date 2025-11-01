"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Server, X } from "lucide-react";

import { ProviderConfig } from "./types";

interface GpuTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
}

export function GpuTab({ config, updateConfig }: GpuTabProps) {
  // GPU form state
  const [newGpu, setNewGpu] = useState({
    vendor: "",
    model: "",
    memory: "",
    interface: "",
  });

  // Auto-update config when all fields are filled
  useEffect(() => {
    // Only update if all 4 fields are filled AND none are empty strings
    if (
      newGpu.vendor &&
      newGpu.model &&
      newGpu.memory &&
      newGpu.interface &&
      newGpu.vendor.trim() !== "" &&
      newGpu.model.trim() !== "" &&
      newGpu.memory.trim() !== "" &&
      newGpu.interface.trim() !== ""
    ) {
      console.log("All fields filled, updating config:", newGpu);
      const gpuType = {
        vendor: newGpu.vendor,
        model: newGpu.model,
        memory: parseInt(newGpu.memory),
        interface: newGpu.interface,
      };

      // Use setTimeout to defer the update until after render
      const timer = setTimeout(() => {
        updateConfig("supportedGpuType", gpuType);

        // Reset form after update with a longer delay to ensure state is stable
        const resetTimer = setTimeout(() => {
          console.log("Resetting form");
          setNewGpu({
            vendor: "",
            model: "",
            memory: "",
            interface: "",
          });
        }, 200);

        return () => clearTimeout(resetTimer);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    newGpu.vendor,
    newGpu.model,
    newGpu.memory,
    newGpu.interface,
    updateConfig,
  ]);

  // GPU vendors and their models
  const gpuVendors = ["NVIDIA", "AMD", "Intel", "Other"];

  const gpuModels: Record<string, string[]> = {
    NVIDIA: [
      "A100",
      "H100",
      "V100",
      "RTX 3090",
      "RTX 4090",
      "RTX A6000",
      "RTX A5000",
      "RTX 3080",
      "RTX 4070",
      "T4",
      "Other",
    ],
    AMD: [
      "MI200 (Instinct MI250X)",
      "MI100 (Instinct MI100)",
      "MI50 (Instinct MI50)",
      "RX 6900 XT",
      "RX 7900 XTX",
      "Other",
    ],
    Intel: ["Arc A770", "Arc A750", "Data Center GPU Max", "Other"],
    Other: ["Custom"],
  };

  // GPU model memory specifications (GB)
  const gpuModelMemory: Record<string, string[]> = {
    // NVIDIA
    A100: ["40", "80"],
    H100: ["80"],
    V100: ["16", "32"],
    "RTX 3090": ["24"],
    "RTX 4090": ["24"],
    "RTX A6000": ["48"],
    "RTX A5000": ["24"],
    "RTX 3080": ["10", "12"],
    "RTX 4070": ["12"],
    T4: ["16"],
    // AMD
    "MI200 (Instinct MI250X)": ["128"],
    "MI100 (Instinct MI100)": ["32"],
    "MI50 (Instinct MI50)": ["32"],
    "RX 6900 XT": ["16"],
    "RX 7900 XTX": ["24"],
    // Intel
    "Arc A770": ["16"],
    "Arc A750": ["8"],
    "Data Center GPU Max": ["48", "96"],
    // Other/Custom - allow all options
    Other: [
      "4",
      "6",
      "8",
      "10",
      "12",
      "16",
      "20",
      "24",
      "32",
      "40",
      "48",
      "64",
      "80",
      "96",
      "128",
    ],
    Custom: [
      "4",
      "6",
      "8",
      "10",
      "12",
      "16",
      "20",
      "24",
      "32",
      "40",
      "48",
      "64",
      "80",
      "96",
      "128",
    ],
  };

  // GPU model interface specifications
  const gpuModelInterface: Record<string, string[]> = {
    // NVIDIA
    A100: ["PCIe 4.0 x16", "NVLink 3.0"],
    H100: ["PCIe 5.0 x16", "NVLink 3.0"],
    V100: ["PCIe 3.0 x16", "NVLink 2.0"],
    "RTX 3090": ["PCIe 4.0 x16"],
    "RTX 4090": ["PCIe 4.0 x16"],
    "RTX A6000": ["PCIe 4.0 x16"],
    "RTX A5000": ["PCIe 4.0 x16"],
    "RTX 3080": ["PCIe 4.0 x16"],
    "RTX 4070": ["PCIe 4.0 x16"],
    T4: ["PCIe 3.0 x16"],
    // AMD
    "MI200 (Instinct MI250X)": ["PCIe 4.0 x16"],
    "MI100 (Instinct MI100)": ["PCIe 4.0 x16"],
    "MI50 (Instinct MI50)": ["PCIe 4.0 x16"],
    "RX 6900 XT": ["PCIe 4.0 x16"],
    "RX 7900 XTX": ["PCIe 4.0 x16"],
    // Intel
    "Arc A770": ["PCIe 4.0 x16"],
    "Arc A750": ["PCIe 4.0 x16"],
    "Data Center GPU Max": ["PCIe 5.0 x16"],
    // Other/Custom - allow all options
    Other: [
      "PCIe 4.0 x16",
      "PCIe 3.0 x16",
      "PCIe 5.0 x16",
      "NVLink 3.0",
      "NVLink 2.0",
      "PCIe 4.0 x8",
      "PCIe 3.0 x8",
    ],
    Custom: [
      "PCIe 4.0 x16",
      "PCIe 3.0 x16",
      "PCIe 5.0 x16",
      "NVLink 3.0",
      "NVLink 2.0",
      "PCIe 4.0 x8",
      "PCIe 3.0 x8",
    ],
  };

  return (
    <Card className="subnet-card mt-4">
      <CardBody className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <Server className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">GPU Support</h3>
              <p className="text-sm text-default-600 mb-4">
                Specify the GPU type your provider supports. GPU pricing is
                configured in the Pricing tab.
              </p>

              {/* Current GPU Type */}
              {config.supportedGpuType && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Current GPU Type
                  </label>
                  <Card className="subnet-card">
                    <CardBody className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">
                              {config.supportedGpuType.vendor}{" "}
                              {config.supportedGpuType.model}
                            </span>
                            <Chip color="secondary" size="sm" variant="flat">
                              {config.supportedGpuType.memory} GB
                            </Chip>
                            <Chip color="default" size="sm" variant="flat">
                              {config.supportedGpuType.interface}
                            </Chip>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() => {
                            updateConfig("supportedGpuType", null);
                            setNewGpu({
                              vendor: "",
                              model: "",
                              memory: "",
                              interface: "",
                            });
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* GPU Form */}
              {!config.supportedGpuType && (
                <div>
                  <h4 className="text-sm font-semibold mb-4">
                    Configure GPU Type
                  </h4>
                  <div className="space-y-4">
                    {/* Step 1: Vendor */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        1. Vendor <span className="text-danger">*</span>
                      </label>
                      <Select
                        placeholder="Select vendor"
                        selectedKeys={
                          newGpu.vendor ? new Set([newGpu.vendor]) : new Set()
                        }
                        selectionMode="single"
                        onSelectionChange={(keys) => {
                          const vendor = Array.from(keys)[0] as string;

                          if (vendor) {
                            setNewGpu({
                              vendor,
                              model: "", // Reset model when vendor changes
                              memory: "", // Reset memory when vendor changes
                              interface: "", // Reset interface when vendor changes
                            });
                          }
                        }}
                      >
                        {gpuVendors.map((vendor) => (
                          <SelectItem key={vendor} textValue={vendor}>
                            {vendor}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Step 2: Model */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        2. Model <span className="text-danger">*</span>
                      </label>
                      <Select
                        isDisabled={!newGpu.vendor}
                        placeholder="Select model"
                        selectedKeys={
                          newGpu.model ? new Set([newGpu.model]) : new Set()
                        }
                        selectionMode="single"
                        onSelectionChange={(keys) => {
                          const model = Array.from(keys)[0] as string;

                          if (model) {
                            setNewGpu({
                              ...newGpu,
                              model,
                              memory: "", // Reset memory when model changes
                              interface: "", // Reset interface when model changes
                            });
                          }
                        }}
                      >
                        {(newGpu.vendor
                          ? gpuModels[newGpu.vendor] || []
                          : []
                        ).map((model) => (
                          <SelectItem key={model} textValue={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </Select>
                      {newGpu.vendor &&
                        (newGpu.model === "Other" ||
                          newGpu.model === "Custom") && (
                          <Input
                            className="mt-2"
                            placeholder="Enter custom model name"
                            onValueChange={(value) =>
                              setNewGpu({ ...newGpu, model: value })
                            }
                          />
                        )}
                    </div>

                    {/* Step 3: Memory - based on model */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        3. Memory (GB) <span className="text-danger">*</span>
                      </label>
                      <Select
                        isDisabled={!newGpu.model}
                        placeholder="Select memory"
                        selectedKeys={
                          newGpu.memory ? new Set([newGpu.memory]) : new Set()
                        }
                        selectionMode="single"
                        onSelectionChange={(keys) => {
                          const selectedKeys = Array.from(keys);
                          const memoryValue =
                            selectedKeys.length > 0
                              ? (selectedKeys[0] as string)
                              : "";

                          console.log(
                            "Memory selected:",
                            memoryValue,
                            "from keys:",
                            selectedKeys,
                          );
                          if (memoryValue) {
                            setNewGpu((prev) => {
                              console.log(
                                "Updating memory state from",
                                prev.memory,
                                "to",
                                memoryValue,
                              );

                              return {
                                ...prev,
                                memory: memoryValue,
                              };
                            });
                          } else {
                            // Handle deselection
                            setNewGpu((prev) => ({
                              ...prev,
                              memory: "",
                            }));
                          }
                        }}
                      >
                        {(newGpu.model
                          ? gpuModelMemory[newGpu.model] || []
                          : []
                        ).map((memory) => (
                          <SelectItem key={memory} textValue={`${memory} GB`}>
                            {memory} GB
                          </SelectItem>
                        ))}
                      </Select>
                      {newGpu.model && !gpuModelMemory[newGpu.model] && (
                        <p className="text-xs text-warning mt-1">
                          Please select a valid model from the list above
                        </p>
                      )}
                    </div>

                    {/* Step 4: Interface - based on model */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        4. Interface <span className="text-danger">*</span>
                      </label>
                      <Select
                        isDisabled={!newGpu.model}
                        placeholder="Select interface"
                        selectedKeys={
                          newGpu.interface
                            ? new Set([newGpu.interface])
                            : new Set()
                        }
                        selectionMode="single"
                        onSelectionChange={(keys) => {
                          const interfaceValue = Array.from(keys)[0] as string;

                          if (interfaceValue) {
                            setNewGpu((prev) => ({
                              ...prev,
                              interface: interfaceValue,
                            }));
                          }
                        }}
                      >
                        {(newGpu.model
                          ? gpuModelInterface[newGpu.model] || []
                          : []
                        ).map((iface) => (
                          <SelectItem key={iface} textValue={iface}>
                            {iface}
                          </SelectItem>
                        ))}
                      </Select>
                      {newGpu.model && !gpuModelInterface[newGpu.model] && (
                        <p className="text-xs text-warning mt-1">
                          Please select a valid model from the list above
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {config.supportedGpuType && (
                <div className="mt-4 p-3 bg-info-50 rounded-lg border border-info-200">
                  <p className="text-xs text-info-700">
                    To update the GPU type, remove the current one first. GPU
                    pricing is configured in the <strong>Pricing</strong> tab.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
