"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Info, Lock, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

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
  [key: string]: string | string[] | undefined;
}

interface GeneralTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  providerInfo: ProviderInfo | null;
  metadata: ProviderMetadata;
  providerAddress: string | null;
  onMetadataUpdate?: () => void;
}

const machineTypes = [
  { value: 0, label: "Kubernetes" },
  { value: 1, label: "Kubernetes GPU" },
];

const regions = [
  { value: 0, label: "North America" },
  { value: 1, label: "Europe" },
  { value: 2, label: "Asia Pacific" },
  { value: 3, label: "South America" },
  { value: 4, label: "Africa" },
];

export function GeneralTab({
  config,
  updateConfig,
  providerInfo,
  metadata,
  providerAddress,
  onMetadataUpdate,
}: GeneralTabProps) {
  const { address, isConnected } = useWallet();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Get machine type label from providerInfo
  const machineTypeLabel = useMemo(() => {
    if (!providerInfo) return "";
    const machineTypeIndex = Number(providerInfo.machineType);
    return machineTypes[machineTypeIndex]?.label || "Unknown";
  }, [providerInfo]);

  // Get region label from providerInfo
  const regionLabel = useMemo(() => {
    if (!providerInfo) return "";
    const regionIndex = Number(providerInfo.region);
    return regions[regionIndex]?.label || "";
  }, [providerInfo]);

  // Get values from metadata (smart contract) or empty string if not available
  const metadataProviderName = metadata.name || "";
  const metadataDescription = metadata.description || "";
  const metadataEmail = metadata.email || "";
  const metadataWebsite = metadata.website || "";
  const metadataCity = metadata.location || "";
  const metadataCountry = metadata.country || "";

  // Local state for editing fields
  const [editingProviderName, setEditingProviderName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingWebsite, setEditingWebsite] = useState("");
  const [editingCity, setEditingCity] = useState("");
  const [editingCountry, setEditingCountry] = useState("");

  // Initialize editing fields from metadata
  useEffect(() => {
    setEditingProviderName(metadataProviderName);
    setEditingDescription(metadataDescription);
    setEditingEmail(metadataEmail);
    setEditingWebsite(metadataWebsite);
    setEditingCity(metadataCity);
    setEditingCountry(metadataCountry);
  }, [metadataProviderName, metadataDescription, metadataEmail, metadataWebsite, metadataCity, metadataCountry]);

  // Get specialties from metadata (can be array or string, convert to array)
  const metadataSpecialties = useMemo(() => {
    if (!metadata.specialties) return [];
    if (Array.isArray(metadata.specialties)) {
      return metadata.specialties;
    }
    // If it's a string, try to parse it as JSON array first
    if (typeof metadata.specialties === "string") {
      try {
        const parsed = JSON.parse(metadata.specialties);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // If parsing fails, it's not JSON, so it might be a comma-separated string
        // But since metadata is typically JSON, we'll just return empty array
        // to avoid incorrect parsing
        return [];
      }
    }
    return [];
  }, [metadata.specialties]);

  // Local state for editing specialties
  const [editingSpecialties, setEditingSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");

  // Initialize editingSpecialties from metadata
  useEffect(() => {
    setEditingSpecialties(metadataSpecialties);
  }, [metadataSpecialties]);

  // Check if specialties have changed
  const hasSpecialtiesChanges = useMemo(() => {
    if (editingSpecialties.length !== metadataSpecialties.length) return true;
    return editingSpecialties.some((s, i) => s !== metadataSpecialties[i]);
  }, [editingSpecialties, metadataSpecialties]);

  // Add new specialty
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !editingSpecialties.includes(newSpecialty.trim())) {
      setEditingSpecialties([...editingSpecialties, newSpecialty.trim()]);
      setNewSpecialty("");
      // Update config
      updateConfig("specialties", [...editingSpecialties, newSpecialty.trim()]);
    }
  };

  // Remove specialty
  const handleRemoveSpecialty = (index: number) => {
    const newSpecialties = editingSpecialties.filter((_, i) => i !== index);
    setEditingSpecialties(newSpecialties);
    // Update config
    updateConfig("specialties", newSpecialties);
  };

  // Reset specialties to metadata values
  const handleResetSpecialties = () => {
    setEditingSpecialties(metadataSpecialties);
    setNewSpecialty("");
    updateConfig("specialties", metadataSpecialties);
  };

  // Check if any fields have changed
  const hasChanges = useMemo(() => {
    return (
      editingProviderName !== metadataProviderName ||
      editingDescription !== metadataDescription ||
      editingEmail !== metadataEmail ||
      editingWebsite !== metadataWebsite ||
      editingCity !== metadataCity ||
      editingCountry !== metadataCountry ||
      hasSpecialtiesChanges
    );
  }, [
    editingProviderName,
    editingDescription,
    editingEmail,
    editingWebsite,
    editingCity,
    editingCountry,
    hasSpecialtiesChanges,
    metadataProviderName,
    metadataDescription,
    metadataEmail,
    metadataWebsite,
    metadataCity,
    metadataCountry,
  ]);

  // Handle update provider info
  const handleUpdateProviderInfo = async () => {
    if (!providerAddress || !isConnected || !address) {
      setUpdateError("Provider address or wallet connection is missing");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Build metadata object from editing fields
      // Merge with existing metadata to preserve other fields (e.g., ip, ingressDomain)
      const metadataObj: any = { ...metadata };
      if (editingProviderName.trim()) metadataObj.name = editingProviderName.trim();
      if (editingDescription.trim()) metadataObj.description = editingDescription.trim();
      if (editingEmail.trim()) metadataObj.email = editingEmail.trim();
      if (editingWebsite.trim()) metadataObj.website = editingWebsite.trim();
      if (editingCity.trim()) metadataObj.location = editingCity.trim();
      if (editingCountry.trim()) metadataObj.country = editingCountry.trim();
      if (editingSpecialties.length > 0) metadataObj.specialties = editingSpecialties;

      // Convert to JSON string
      const metadataJson = JSON.stringify(metadataObj, null, 2);

      console.log("=== Update Provider Metadata ===");
      console.log("Metadata object:", metadataObj);
      console.log("Metadata JSON:", metadataJson);

      const params: UpdateProviderMetadataParams = {
        providerId: providerAddress,
        metadata: metadataJson,
      };

      const hash = await updateProviderMetadata(params);
      console.log("=== Update Provider Metadata - Success ===");
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
      console.error("=== Update Provider Metadata - Error ===");
      console.error("Error updating provider metadata:", err);
      setUpdateError(err.message || "Failed to update provider info. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Info size={20} />
            <h2 className="text-xl font-bold">Provider Information</h2>
          </div>
          <Button
            color="primary"
            size="sm"
            startContent={isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            isLoading={isUpdating}
            isDisabled={!hasChanges || !isConnected || !address || isUpdating}
            onPress={handleUpdateProviderInfo}
          >
            {isUpdating ? "Updating..." : "Update Provider Info"}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Error Message */}
        {updateError && (
          <div className="bg-danger/10 p-4 rounded-lg border border-danger/20">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{updateError}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {updateSuccess && (
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
              <p className="text-sm text-success">
                Provider info updated successfully! Refreshing provider info...
              </p>
            </div>
          </div>
        )}

        {/* Provider Basic Info */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Provider Name
          </label>
          <Input
            placeholder="Enter provider name"
            value={editingProviderName}
            onChange={(e) => {
              setEditingProviderName(e.target.value);
              updateConfig("name", e.target.value);
            }}
            description="Stored on blockchain (metadata)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter provider description"
            value={editingDescription}
            onChange={(e) => {
              setEditingDescription(e.target.value);
              updateConfig("description", e.target.value);
            }}
          />
          <p className="text-xs text-default-500 mt-1">
            Stored on blockchain (metadata)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Machine Type <span className="text-default-400 text-xs">(read-only)</span>
          </label>
          <Input
            placeholder="Machine Type"
            value={machineTypeLabel}
            isReadOnly
            startContent={<Lock size={16} className="text-default-400" />}
            description="Machine type is set on blockchain and cannot be changed"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <Input
              placeholder="Country"
              value={editingCountry}
              onChange={(e) => {
                setEditingCountry(e.target.value);
                updateConfig("location.country", e.target.value);
              }}
              description="Stored on blockchain (metadata.country)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Region <span className="text-default-400 text-xs">(read-only)</span>
            </label>
            <Input
              placeholder="Region"
              value={regionLabel}
              isReadOnly
              startContent={<Lock size={16} className="text-default-400" />}
              description="Region is set on blockchain and cannot be changed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Input
              placeholder="City"
              value={editingCity}
              onChange={(e) => {
                setEditingCity(e.target.value);
                updateConfig("location.city", e.target.value);
              }}
              description="Stored on blockchain (metadata.location)"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Email
            </label>
            <Input
              placeholder="contact@example.com"
              type="email"
              value={editingEmail}
              onChange={(e) => {
                setEditingEmail(e.target.value);
                updateConfig("contact.email", e.target.value);
              }}
              description="Stored on blockchain (metadata)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Website (Optional)
            </label>
            <Input
              placeholder="https://example.com"
              value={editingWebsite}
              onChange={(e) => {
                setEditingWebsite(e.target.value);
                updateConfig("contact.website", e.target.value);
              }}
              description="Stored on blockchain (metadata)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specialties</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {editingSpecialties.length > 0 ? (
              editingSpecialties.map((specialty, index) => (
                <Chip
                  key={index}
                  color="primary"
                  variant="flat"
                  onClose={() => handleRemoveSpecialty(index)}
                >
                  {specialty}
                </Chip>
              ))
            ) : (
              <p className="text-sm text-default-400">No specialties specified</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add specialty and press Enter"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSpecialty();
                }
              }}
              description="Stored on blockchain (metadata.specialties)"
            />
            <Button
              color="primary"
              variant="flat"
              onPress={handleAddSpecialty}
              isDisabled={!newSpecialty.trim() || editingSpecialties.includes(newSpecialty.trim())}
            >
              Add
            </Button>
          </div>
          {hasSpecialtiesChanges && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                variant="flat"
                onPress={handleResetSpecialties}
                isDisabled={isUpdating}
              >
                Reset
              </Button>
              <p className="text-xs text-default-500">
                Changes have been made. Click "Update Provider Info" at the top to save.
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
