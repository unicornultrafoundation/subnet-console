"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Settings, Save, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { useWallet } from "@/hooks/use-wallet";
import {
  getProviderInfo,
  isProviderRegistered,
  type ProviderInfo,
} from "@/lib/blockchain/provider-contract";

import { ProviderConfig } from "@/components/dashboard/provider/settings/types";
import { GeneralTab } from "@/components/dashboard/provider/settings/GeneralTab";
import { NetworkTab } from "@/components/dashboard/provider/settings/NetworkTab";
import { GpuTab } from "@/components/dashboard/provider/settings/GpuTab";
import { PricingTab } from "@/components/dashboard/provider/settings/PricingTab";
import { ResourcesTab } from "@/components/dashboard/provider/settings/ResourcesTab";
import { OperatorTab } from "@/components/dashboard/provider/settings/OperatorTab";
import { BlockchainProviderInfo } from "@/components/dashboard/provider/settings/BlockchainProviderInfo";

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

const regions = [
  { value: 0, label: "North America" },
  { value: 1, label: "Europe" },
  { value: 2, label: "Asia Pacific" },
  { value: 3, label: "South America" },
  { value: 4, label: "Africa" },
];


export default function ProviderSettingsPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const [isLoadingProviderInfo, setIsLoadingProviderInfo] = useState(true);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [metadata, setMetadata] = useState<ProviderMetadata>({});
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState<ProviderConfig>({
    name: "Quantum Computing Solutions",
    description:
      "High-performance compute infrastructure provider specializing in AI/ML workloads",
    location: {
      country: "USA",
      region: "North America",
      city: "San Francisco",
    },
    specialties: ["AI/ML", "Quantum Computing", "High Performance Computing"],
    contact: {
      email: "contact@quantum-computing.com",
      website: "https://quantum-computing.com",
    },
    operatorAddress: "",
    operatorAddressVerified: false,
    ip: "",
    ingressDomain: "",
    supportedGpuType: null,
    pricing: {
      cpu: 0.05,
      memory: 0.02,
      storage: 0.01,
      gpu: 0.25,
      bandwidth: 0.001,
      minimumCharge: 0.15,
    },
    limits: {
      maxCpuPerDeployment: 64,
      maxMemoryPerDeployment: 256,
      maxStoragePerDeployment: 2000,
      maxGpuPerDeployment: 8,
      maxDeploymentsPerUser: 20,
    },
    availability: {
      autoAcceptDeployments: false,
      requireApproval: true,
      maxConcurrentDeployments: 100,
    },
    notifications: {
      emailOnDeployment: true,
      emailOnError: true,
      emailOnLowResources: true,
    },
    // Blockchain stored resources (mock - would come from smart contract in production)
    blockchainResources: {
      cpu: 80, // Different from calculated (96) to show mismatch
      memory: 320,
      storage: 6000,
      bandwidth: 25000,
      lastUpdated: "2024-01-18T10:00:00Z",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch provider info from contract
  useEffect(() => {
    const fetchProviderInfo = async () => {
      if (!isConnected || !address) {
        setIsLoadingProviderInfo(false);
        return;
      }

      setIsLoadingProviderInfo(true);
      setError(null);

      try {
        const registered = await isProviderRegistered(address);
        if (registered) {
          const info = await getProviderInfo(address);
          setProviderInfo(info);

          // Parse metadata JSON
          if (info?.metadata) {
            try {
              const parsedMetadata = JSON.parse(info.metadata);
              setMetadata(parsedMetadata);
              
              // Update config with contract data
              setConfig((prev) => ({
                ...prev,
                name: parsedMetadata.name || prev.name,
                description: parsedMetadata.description || prev.description,
                location: {
                  country: parsedMetadata.country || prev.location.country,
                  region: regions[Number(info.region)]?.label || prev.location.region,
                  city: parsedMetadata.location || prev.location.city,
                },
                contact: {
                  email: parsedMetadata.email || prev.contact.email,
                  website: parsedMetadata.website || prev.contact.website,
                },
                operatorAddress: info.operator || prev.operatorAddress,
                operatorAddressVerified: info.verified || prev.operatorAddressVerified,
                ip: parsedMetadata.ip || prev.ip,
                ingressDomain: parsedMetadata.ingressDomain || prev.ingressDomain,
                supportedGpuType: parsedMetadata.supportedGpuType || prev.supportedGpuType,
                blockchainResources: {
                  cpu: Number(info.cpuCores) / 1000, // Convert mCPU to cores
                  memory: Number(info.memoryMB),
                  storage: Number(info.diskGB),
                  bandwidth: 0, // Not available in contract
                  lastUpdated: new Date(Number(info.updatedAt) * 1000).toISOString(),
                },
              }));
            } catch (e) {
              console.error("Error parsing metadata:", e);
            }
          }
        } else {
          setError("Provider is not registered on the blockchain");
        }
      } catch (err: any) {
        console.error("Error fetching provider info:", err);
        setError(err.message || "Failed to fetch provider information");
      } finally {
        setIsLoadingProviderInfo(false);
      }
    };

    fetchProviderInfo();
  }, [address, isConnected]);

  const refreshProviderInfo = useCallback(async () => {
    if (!isConnected || !address) return;
    
    setIsLoadingProviderInfo(true);
    setError(null);

    try {
      const registered = await isProviderRegistered(address);
      if (registered) {
        const info = await getProviderInfo(address);
        setProviderInfo(info);

        // Parse metadata JSON
        if (info?.metadata) {
          try {
            const parsedMetadata = JSON.parse(info.metadata);
            setMetadata(parsedMetadata);
            
            // Update config with contract data
            setConfig((prev) => ({
              ...prev,
              name: parsedMetadata.name || prev.name,
              description: parsedMetadata.description || prev.description,
              location: {
                country: parsedMetadata.country || prev.location.country,
                region: regions[Number(info.region)]?.label || prev.location.region,
                city: parsedMetadata.location || prev.location.city,
              },
              contact: {
                email: parsedMetadata.email || prev.contact.email,
                website: parsedMetadata.website || prev.contact.website,
              },
              operatorAddress: info.operator || prev.operatorAddress,
              operatorAddressVerified: info.verified || prev.operatorAddressVerified,
              ip: parsedMetadata.ip || prev.ip,
              ingressDomain: parsedMetadata.ingressDomain || prev.ingressDomain,
              supportedGpuType: parsedMetadata.supportedGpuType || prev.supportedGpuType,
              blockchainResources: {
                cpu: Number(info.cpuCores) / 1000, // Convert mCPU to cores
                memory: Number(info.memoryMB),
                storage: Number(info.diskGB),
                bandwidth: 0, // Not available in contract
                lastUpdated: new Date(Number(info.updatedAt) * 1000).toISOString(),
              },
            }));
          } catch (e) {
            console.error("Error parsing metadata:", e);
          }
        }
      }
    } catch (err: any) {
      console.error("Error refreshing provider info:", err);
      setError(err.message || "Failed to refresh provider information");
    } finally {
      setIsLoadingProviderInfo(false);
    }
  }, [address, isConnected]);

  const validateAddress = (address: string): boolean => {
    // Basic validation: Ethereum-like address (0x followed by 40 hex characters)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateIpAddress = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (!ipv4Regex.test(ip)) return false;
    const parts = ip.split(".").map(Number);

    return parts.every((part) => part >= 0 && part <= 255);
  };

  const validateDomain = (domain: string): boolean => {
    const domainRegex =
      /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

    return domainRegex.test(domain);
  };

  const generateRandomString = (length: number): string => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  };

  const generateIngressDomain = (
    serviceName: string,
    deploymentName: string,
  ): string => {
    if (!config.ingressDomain) {
      return "";
    }
    // Normalize service name and deployment name: lowercase, no accents, replace spaces with hyphens
    const normalize = (str: string): string => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    };

    const normalizedServiceName = normalize(serviceName);
    const normalizedDeploymentName = normalize(deploymentName);
    const randomString = generateRandomString(8);

    return `${normalizedServiceName}-${normalizedDeploymentName}.${config.ingressDomain}-${randomString}`;
  };


  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    // Show success message
    alert("Settings saved successfully!");
  };

  const updateConfig = useCallback((path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      const keys = path.split(".");
      let current: any = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      setHasChanges(true);

      return newConfig;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Button
              className="mb-4"
              startContent={<ArrowLeft size={16} />}
              variant="light"
              onPress={() => router.push("/provider")}
            >
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Settings className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-dark-on-white">
                  Provider Settings
                </h1>
                <p className="text-lg text-dark-on-white-muted">
                  Configure your provider information and pricing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                color="default"
                variant="flat"
                size="lg"
                startContent={<RefreshCw size={20} />}
                isLoading={isLoadingProviderInfo}
                onPress={refreshProviderInfo}
              >
                Refresh
              </Button>
              <Button
                color="primary"
                isDisabled={!hasChanges}
                isLoading={isSaving}
                size="lg"
                startContent={!isSaving ? <Save size={20} /> : undefined}
                onPress={handleSave}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-danger/20 bg-danger/10">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-danger">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Blockchain Provider Info */}
        <BlockchainProviderInfo
          providerInfo={providerInfo}
          isLoading={isLoadingProviderInfo}
          address={address}
        />

        <Tabs aria-label="Settings tabs" className="w-full">
          <Tab key="general" title="General">
            <GeneralTab
              config={config}
              updateConfig={updateConfig}
              providerInfo={providerInfo}
              metadata={metadata}
              providerAddress={address}
              onMetadataUpdate={refreshProviderInfo}
            />
          </Tab>

          <Tab key="operator" title="Operator">
            <OperatorTab
              providerInfo={providerInfo}
              providerAddress={address}
              currentOperator={config.operatorAddress}
              onOperatorUpdate={refreshProviderInfo}
            />
          </Tab>

          <Tab key="network" title="Network">
            <NetworkTab
              config={config}
              generateIngressDomain={generateIngressDomain}
              updateConfig={updateConfig}
              validateDomain={validateDomain}
              validateIpAddress={validateIpAddress}
              providerInfo={providerInfo}
              metadata={metadata}
              providerAddress={address || ""}
              onMetadataUpdate={refreshProviderInfo}
            />
          </Tab>

          <Tab key="gpu" title="GPU">
            <GpuTab
              config={config}
              updateConfig={updateConfig}
              providerInfo={providerInfo}
              metadata={metadata}
              providerAddress={address || ""}
              onMetadataUpdate={refreshProviderInfo}
            />
          </Tab>

          <Tab key="pricing" title="Pricing">
            <PricingTab
              config={config}
              updateConfig={updateConfig}
              providerInfo={providerInfo}
              providerAddress={address}
              onPriceUpdate={refreshProviderInfo}
            />
          </Tab>

          <Tab key="resources" title="Resources">
            <ResourcesTab
              config={config}
              updateConfig={updateConfig}
              providerInfo={providerInfo}
              providerAddress={address}
              onResourceUpdate={refreshProviderInfo}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
