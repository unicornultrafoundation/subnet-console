"use client";

import { useState, useEffect, useMemo } from "react";
import NextLink from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Network, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

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
  [key: string]: string | string[] | undefined;
}

interface NetworkTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  validateIpAddress: (ip: string) => boolean;
  validateDomain: (domain: string) => boolean;
  generateIngressDomain: (
    serviceName: string,
    deploymentName: string,
  ) => string;
  providerInfo: ProviderInfo | null;
  metadata: ProviderMetadata;
  providerAddress: string;
  onMetadataUpdate?: () => void;
}

export function NetworkTab({
  config,
  updateConfig,
  validateIpAddress,
  validateDomain,
  generateIngressDomain,
  providerInfo,
  metadata,
  providerAddress,
  onMetadataUpdate,
}: NetworkTabProps) {
  const { address, isConnected } = useWallet();

  // Get values from metadata (smart contract) or empty string if not available
  const metadataIp = metadata.ip || "";
  const metadataIngressDomain = metadata.ingressDomain || "";

  // Local state for editing fields
  const [editingIp, setEditingIp] = useState("");
  const [editingIngressDomain, setEditingIngressDomain] = useState("");

  // Update state
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize editing fields from metadata
  useEffect(() => {
    setEditingIp(metadataIp);
    setEditingIngressDomain(metadataIngressDomain);
  }, [metadataIp, metadataIngressDomain]);

  // Check if any fields have changed
  const hasChanges = useMemo(() => {
    return (
      editingIp !== metadataIp ||
      editingIngressDomain !== metadataIngressDomain
    );
  }, [editingIp, editingIngressDomain, metadataIp, metadataIngressDomain]);

  // Handle update network info
  const handleUpdateNetworkInfo = async () => {
    if (!providerAddress || !isConnected || !address) {
      setUpdateError("Provider address or wallet connection is missing");
      return;
    }

    // Validate IP if provided
    if (editingIp.trim() && !validateIpAddress(editingIp.trim())) {
      setUpdateError("Invalid IP address format");
      return;
    }

    // Validate domain if provided
    if (
      editingIngressDomain.trim() &&
      !validateDomain(editingIngressDomain.trim())
    ) {
      setUpdateError("Invalid domain format");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Build metadata object from editing fields
      // Merge with existing metadata to preserve other fields (e.g., name, description, country, etc.)
      const metadataObj: any = { ...metadata };
      
      // Update IP (always update, even if empty, to allow clearing)
      metadataObj.ip = editingIp.trim();
      
      // Update ingressDomain (always update, even if empty, to allow clearing)
      metadataObj.ingressDomain = editingIngressDomain.trim();

      // Convert to JSON string
      const metadataJson = JSON.stringify(metadataObj, null, 2);

      console.log("=== Update Provider Network Metadata ===");
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
      console.error("=== Update Provider Network Metadata - Error ===");
      console.error("Error updating provider network metadata:", err);
      setUpdateError(err.message || "Failed to update network info. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

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
              <p className="text-sm">
                Network information updated successfully!
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="subnet-card mt-4">
        <CardBody className="space-y-6">
          {/* Network Configuration */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Network className="text-primary flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Network Configuration</h3>
                <p className="text-sm text-default-600 mb-4">
                  Configure IP address and ingress domain for service routing.
                  These settings are stored on the blockchain.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Public IP or VPN IP <span className="text-danger">*</span>
                    </label>
                    <Input
                      className="font-mono text-sm"
                      errorMessage={
                        editingIp.length > 0 && !validateIpAddress(editingIp)
                          ? "Invalid IP address format"
                          : undefined
                      }
                      isInvalid={
                        editingIp.length > 0 && !validateIpAddress(editingIp)
                      }
                      placeholder="203.0.113.0 or VPN IP"
                      value={editingIp}
                      onChange={(e) => {
                        setEditingIp(e.target.value);
                        updateConfig("ip", e.target.value);
                      }}
                      description="Stored on blockchain (metadata.ip)"
                    />
                    <p className="text-xs text-default-500 mt-1">
                      Public IP address of your provider, or VPN IP from{" "}
                      <NextLink
                        className="text-primary hover:underline"
                        href="/vpn"
                      >
                        VPN Settings
                      </NextLink>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ingress Domain{" "}
                      <span className="text-default-500">(optional)</span>
                    </label>
                    <Input
                      className="font-mono text-sm"
                      errorMessage={
                        editingIngressDomain.length > 0 &&
                        !validateDomain(editingIngressDomain)
                          ? "Invalid domain format"
                          : undefined
                      }
                      isInvalid={
                        editingIngressDomain.length > 0 &&
                        !validateDomain(editingIngressDomain)
                      }
                      placeholder="subnet.example.com"
                      value={editingIngressDomain}
                      onChange={(e) => {
                        setEditingIngressDomain(e.target.value);
                        updateConfig("ingressDomain", e.target.value);
                      }}
                      description="Stored on blockchain (metadata.ingressDomain)"
                    />
                    <p className="text-xs text-default-500 mt-1">
                      Base domain for service ingress. Services will be
                      accessible at:
                      <br />
                      <code className="text-xs bg-default-100 px-2 py-1 rounded">
                        {
                          "{service-name}-{deployment-name}.{ingress-domain}-{random-8-chars}"
                        }
                      </code>
                    </p>

                    {editingIngressDomain && (
                      <div className="mt-3 p-3 bg-info-50 rounded-lg border border-info-200">
                        <p className="text-xs font-semibold text-info-900 mb-2">
                          Example Ingress Domain:
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs text-info-700 font-mono">
                            {generateIngressDomain("Web-Server", "web") ||
                              "Enter ingress domain to see example"}
                          </p>
                          <p className="text-xs text-info-600">
                            Service: "Web-Server", Deployment: "web"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Button */}
                <div className="mt-6 flex items-center justify-end gap-3">
                  <Button
                    color="primary"
                    isDisabled={!hasChanges || isUpdating}
                    isLoading={isUpdating}
                    startContent={!isUpdating ? <Save size={16} /> : undefined}
                    onPress={handleUpdateNetworkInfo}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Updating...
                      </>
                    ) : (
                      "Update Network"
                    )}
                  </Button>
                </div>

                {hasChanges && (
                  <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <p className="text-xs text-warning-700">
                      Changes have been made. Click "Update Network" to save to
                      blockchain.
                    </p>
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
