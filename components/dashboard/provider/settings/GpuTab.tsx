"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Server, X, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { ProviderConfig } from "./types";
import {
  type ProviderInfo,
  updateProviderMetadata,
  type UpdateProviderMetadataParams,
} from "@/lib/blockchain/provider-contract";
import { useWallet } from "@/hooks/use-wallet";

interface ProviderMetadata {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  location?: string; // city
  country?: string;
  specialties?: string[] | string;
  ip?: string;
  ingressDomain?: string;
  supportedGpuType?: {
    vendor: string;
    model: string;
    memory: number; // GB
    interface: string;
  } | null;
  [key: string]: string | string[] | object | null | undefined;
}

interface GpuTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  providerInfo: ProviderInfo | null;
  metadata: ProviderMetadata;
  providerAddress: string;
  onMetadataUpdate?: () => void;
}

export function GpuTab({
  config,
  updateConfig,
  providerInfo,
  metadata,
  providerAddress,
  onMetadataUpdate,
}: GpuTabProps) {
  const { address, isConnected } = useWallet();

  // Get GPU config from metadata (smart contract) or null if not available
  // Memoize to prevent unnecessary re-renders by comparing actual values
  const metadataGpuType = useMemo(() => {
    const gpu = metadata.supportedGpuType;
    if (!gpu) return null;
    
    // Return a new object with the same values to ensure stable reference
    return {
      vendor: gpu.vendor,
      model: gpu.model,
      memory: gpu.memory,
      interface: gpu.interface,
    };
  }, [
    metadata.supportedGpuType?.vendor,
    metadata.supportedGpuType?.model,
    metadata.supportedGpuType?.memory,
    metadata.supportedGpuType?.interface,
  ]);

  // Local state for editing GPU
  const [editingGpuType, setEditingGpuType] = useState<{
    vendor: string;
    model: string;
    memory: number;
    interface: string;
  } | null>(null);

  // Update state
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // GPU form state
  const [newGpu, setNewGpu] = useState({
    vendor: "",
    model: "",
    memory: "",
    interface: "",
  });

  // Initialize editing GPU from metadata
  // Use a ref to track the last metadata value to prevent loops
  const lastMetadataGpuTypeRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Create a stable string representation for comparison
    const currentMetadataStr = metadataGpuType 
      ? `${metadataGpuType.vendor}|${metadataGpuType.model}|${metadataGpuType.memory}|${metadataGpuType.interface}`
      : null;
    
    // Only update if metadata actually changed
    if (lastMetadataGpuTypeRef.current !== currentMetadataStr) {
      lastMetadataGpuTypeRef.current = currentMetadataStr;
      
      if (metadataGpuType) {
        setEditingGpuType(metadataGpuType);
      } else {
        setEditingGpuType(null);
      }
    }
  }, [metadataGpuType]);

  // Track if we've already processed this GPU combination to prevent loops
  const processedGpuRef = useRef<string | null>(null);

  // Auto-update local editing state when all fields are filled
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
      // Create a unique key for this GPU combination
      const gpuKey = `${newGpu.vendor}|${newGpu.model}|${newGpu.memory}|${newGpu.interface}`;
      
      // Only process if we haven't processed this exact combination
      if (processedGpuRef.current !== gpuKey) {
        processedGpuRef.current = gpuKey;
        
        console.log("All fields filled, updating local state:", newGpu);
        const gpuType = {
          vendor: newGpu.vendor,
          model: newGpu.model,
          memory: parseInt(newGpu.memory),
          interface: newGpu.interface,
        };

        // Update local editing state
        setEditingGpuType(gpuType);
        // Also update config for local display
        // Use setTimeout to defer the update and prevent immediate re-render loops
        setTimeout(() => {
          updateConfig("supportedGpuType", gpuType);
        }, 0);

        // Reset form after update with a longer delay to ensure state is stable
        const resetTimer = setTimeout(() => {
          console.log("Resetting form");
          setNewGpu({
            vendor: "",
            model: "",
            memory: "",
            interface: "",
          });
          // Clear the processed ref after reset so user can add the same GPU again if needed
          processedGpuRef.current = null;
        }, 200);

        return () => clearTimeout(resetTimer);
      }
    }
  }, [
    newGpu.vendor,
    newGpu.model,
    newGpu.memory,
    newGpu.interface,
    updateConfig,
  ]);

  // Check if GPU has changed
  const hasChanges = useMemo(() => {
    if (!editingGpuType && !metadataGpuType) return false;
    if (!editingGpuType || !metadataGpuType) return true;
    return (
      editingGpuType.vendor !== metadataGpuType.vendor ||
      editingGpuType.model !== metadataGpuType.model ||
      editingGpuType.memory !== metadataGpuType.memory ||
      editingGpuType.interface !== metadataGpuType.interface
    );
  }, [editingGpuType, metadataGpuType]);

  // Handle update GPU info
  const handleUpdateGpuInfo = async () => {
    if (!providerAddress || !isConnected || !address) {
      setUpdateError("Provider address or wallet connection is missing");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Build metadata object from editing fields
      // Merge with existing metadata to preserve other fields
      const metadataObj: any = { ...metadata };
      metadataObj.supportedGpuType = editingGpuType;

      // Convert to JSON string
      const metadataJson = JSON.stringify(metadataObj, null, 2);

      console.log("=== Update Provider GPU Metadata ===");
      console.log("Metadata object:", metadataObj);
      console.log("Metadata JSON:", metadataJson);

      const params: UpdateProviderMetadataParams = {
        providerId: providerAddress,
        metadata: metadataJson,
      };

      const hash = await updateProviderMetadata(params);

      console.log("Transaction hash:", hash);

      setUpdateSuccess(true);
      setUpdateError(null);

      // Refresh provider info after update
      if (onMetadataUpdate) {
        setTimeout(() => {
          onMetadataUpdate();
        }, 2000); // Wait 2 seconds for blockchain to update
      }
    } catch (err: any) {
      console.error("=== Update Provider GPU Metadata - Error ===");
      console.error("Error updating provider GPU metadata:", err);
      setUpdateError(err.message || "Failed to update GPU info. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

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

  // Use editingGpuType for display, fallback to config for backward compatibility
  const displayGpuType = editingGpuType || config.supportedGpuType;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {updateError && (
        <Card className="mb-6 border-danger/20 bg-danger/10">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 text-danger">
              <AlertCircle size={20} />
              <p className="text-sm">{updateError}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Success Message */}
      {updateSuccess && (
        <Card className="mb-6 border-success/20 bg-success/10">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle size={20} />
              <p className="text-sm">GPU information updated successfully!</p>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="subnet-card mt-4">
        <CardBody className="space-y-6">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Server className="text-primary flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">GPU Support</h3>
                <p className="text-sm text-default-600 mb-4">
                  Specify the GPU type your provider supports. GPU pricing is
                  configured in the Pricing tab. These settings are stored on the blockchain.
                </p>

                {/* Current GPU Type */}
                {displayGpuType && (
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
                              {displayGpuType.vendor}{" "}
                              {displayGpuType.model}
                            </span>
                            <Chip color="secondary" size="sm" variant="flat">
                              {displayGpuType.memory} GB
                            </Chip>
                            <Chip color="default" size="sm" variant="flat">
                              {displayGpuType.interface}
                            </Chip>
                            {hasChanges && (
                              <Chip color="warning" size="sm" variant="flat">
                                Unsaved changes
                              </Chip>
                            )}
                          </div>
                          <p className="text-xs text-default-500 mt-1">
                            Stored on blockchain (metadata.supportedGpuType)
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setEditingGpuType(null);
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
              {!displayGpuType && (
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

              {displayGpuType && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-info-50 rounded-lg border border-info-200">
                    <p className="text-xs text-info-700">
                      To update the GPU type, remove the current one first. GPU
                      pricing is configured in the <strong>Pricing</strong> tab.
                    </p>
                  </div>

                  {/* Update Button */}
                  {hasChanges && (
                    <>
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          color="primary"
                          isDisabled={isUpdating}
                          isLoading={isUpdating}
                          startContent={!isUpdating ? <Save size={16} /> : undefined}
                          onPress={handleUpdateGpuInfo}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={16} />
                              Updating...
                            </>
                          ) : (
                            "Update GPU"
                          )}
                        </Button>
                      </div>
                      <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                        <p className="text-xs text-warning-700">
                          Changes have been made. Click "Update GPU" to save to
                          blockchain.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
    </div>
  );
}
