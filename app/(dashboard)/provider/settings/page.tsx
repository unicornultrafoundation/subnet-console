"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Settings, Save, ArrowLeft } from "lucide-react";

import { ProviderConfig } from "@/components/dashboard/provider/settings/types";
import { GeneralTab } from "@/components/dashboard/provider/settings/GeneralTab";
import { NetworkTab } from "@/components/dashboard/provider/settings/NetworkTab";
import { GpuTab } from "@/components/dashboard/provider/settings/GpuTab";
import { PricingTab } from "@/components/dashboard/provider/settings/PricingTab";
import { ResourcesTab } from "@/components/dashboard/provider/settings/ResourcesTab";

export default function ProviderSettingsPage() {
  const router = useRouter();
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
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleVerifyOperatorAddress = async () => {
    if (!config.operatorAddress) {
      alert("Please enter an operator address first");

      return;
    }

    if (!validateAddress(config.operatorAddress)) {
      alert(
        "Invalid address format. Please enter a valid blockchain address (0x...).",
      );

      return;
    }

    setIsVerifying(true);
    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setConfig((prev) => ({
      ...prev,
      operatorAddressVerified: true,
    }));
    setHasChanges(true);
    setIsVerifying(false);
    alert("Operator address verified successfully!");
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

  const updateConfig = (path: string, value: any) => {
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
  };

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

        <Tabs aria-label="Settings tabs" className="w-full">
          <Tab key="general" title="General">
            <GeneralTab
              config={config}
              handleVerifyOperatorAddress={handleVerifyOperatorAddress}
              isVerifying={isVerifying}
              updateConfig={updateConfig}
              validateAddress={validateAddress}
            />
          </Tab>

          <Tab key="network" title="Network">
            <NetworkTab
              config={config}
              generateIngressDomain={generateIngressDomain}
              updateConfig={updateConfig}
              validateDomain={validateDomain}
              validateIpAddress={validateIpAddress}
            />
          </Tab>

          <Tab key="gpu" title="GPU">
            <GpuTab config={config} updateConfig={updateConfig} />
          </Tab>

          <Tab key="pricing" title="Pricing">
            <PricingTab config={config} updateConfig={updateConfig} />
          </Tab>

          <Tab key="resources" title="Resources">
            <ResourcesTab config={config} updateConfig={updateConfig} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
