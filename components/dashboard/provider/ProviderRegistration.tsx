"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Server,
  MapPin,
  Cpu,
  HardDrive,
  DollarSign,
  FileText,
  Loader2,
  TrendingUp,
  Shield,
} from "lucide-react";
import { parseUnits, formatUnits } from "ethers";
import { useWallet } from "@/hooks/use-wallet";
import {
  registerProvider,
  calculateRequiredStake,
  formatEther,
  checkTokenAllowance,
  approveToken,
  type RegisterProviderParams,
} from "@/lib/blockchain/provider-contract";
import { blockchainConfig } from "@/config/blockchain";

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
}

const steps: RegistrationStep[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Enter your provider details",
  },
  {
    id: 2,
    title: "Hardware Specifications",
    description: "Configure your hardware resources",
  },
  {
    id: 3,
    title: "Pricing",
    description: "Set your resource pricing",
  },
  {
    id: 4,
    title: "Review & Register",
    description: "Review and submit your registration",
  },
];

const machineTypes = [
  { value: 0, label: "Kubernetes" },
];

const regions = [
  { value: 0, label: "North America" },
  { value: 1, label: "Europe" },
  { value: 2, label: "Asia Pacific" },
  { value: 3, label: "South America" },
  { value: 4, label: "Africa" },
];

interface ProviderMetadata {
  name: string;
  description: string;
  website?: string;
  email?: string;
  location?: string; // city
  country?: string;
  [key: string]: string | undefined;
}

export default function ProviderRegistration() {
  const { address, isConnected, connectWallet } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingStake, setIsCalculatingStake] = useState(false);
  const [requiredStake, setRequiredStake] = useState<string>("0");
  const [requiredStakeWei, setRequiredStakeWei] = useState<bigint>(BigInt(0)); // Store original wei value
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tokenAllowance, setTokenAllowance] = useState<bigint>(BigInt(0));
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);

  // Metadata fields
  const [metadataFields, setMetadataFields] = useState<ProviderMetadata>({
    name: "",
    description: "",
    website: "",
    email: "",
    location: "",
    country: "",
  });

  // CPU cores display value (decimal 3, e.g., 0.1, 1, 2.5 cores)
  const [cpuCoresDisplay, setCpuCoresDisplay] = useState<string>("0");

  // Pricing fields (per hour) - displayed to user
  const [pricingPerHour, setPricingPerHour] = useState({
    cpuPricePerHour: "0",
    gpuPricePerHour: "0",
    memoryPricePerHour: "0",
    diskPricePerHour: "0",
  });

  // Form data (prices in per second for smart contract)
  // cpuCores will be in mCPU (milliCPU) format for smart contract
  const [formData, setFormData] = useState<RegisterProviderParams>({
    operator: "",
    metadata: "",
    machineType: 0,
    region: 0,
    cpuCores: 0, // This will be mCPU (milliCPU) - 1000 mCPU = 1 core
    gpuCores: 0,
    memoryMB: 0,
    diskGB: 0,
    cpuPricePerSecond: "0",
    gpuPricePerSecond: "0",
    memoryPricePerSecond: "0",
    diskPricePerSecond: "0",
  });

  // Convert CPU cores (decimal 3) to mCPU (multiply by 1000)
  useEffect(() => {
    const cores = parseFloat(cpuCoresDisplay) || 0;
    const mCpu = Math.round(cores * 1000); // Convert to mCPU (decimal 3 -> integer)
    setFormData((prev) => ({
      ...prev,
      cpuCores: mCpu,
    }));
  }, [cpuCoresDisplay]);

  // Convert hourly prices to per second and update formData
  // Prices are in decimal 18 format (e.g., 0.01 tokens/hour)
  // CPU price is per core per hour, need to convert to per mCPU per second
  // Other prices are per unit per hour, convert to per unit per second
  // Use ethers parseUnits/formatUnits for precise decimal 18 conversion
  useEffect(() => {
    const convertHourToSecond = (hourlyPrice: string): string => {
      if (!hourlyPrice || parseFloat(hourlyPrice) <= 0) return "0";
      try {
        // Parse hourly price to wei (decimal 18)
        const priceWei = parseUnits(hourlyPrice, 18);
        // Convert hour to second: divide by 3600
        // Use BigInt division, then format back
        const pricePerSecondWei = priceWei / BigInt(3600);
        // Format back to string with decimal 18 precision
        return formatUnits(pricePerSecondWei, 18);
      } catch (error) {
        console.error("Error converting hour to second:", error);
        return "0";
      }
    };

    // Convert CPU price from per core per hour to per core per second
    // Price is per core per hour, only need to convert hour -> second (divide by 3600)
    const convertCpuPriceToPerMcpuPerSecond = (pricePerCorePerHour: string): string => {
      if (!pricePerCorePerHour || parseFloat(pricePerCorePerHour) <= 0) return "0";
      try {
        // Parse price per core per hour to wei (decimal 18)
        const priceWei = parseUnits(pricePerCorePerHour, 18);
        // Convert per hour -> per second (divide by 3600)
        // Price is still per core, not per mCPU
        const pricePerCorePerSecondWei = priceWei / BigInt(3600);
        // Format back to string with decimal 18 precision
        return formatUnits(pricePerCorePerSecondWei, 18);
      } catch (error) {
        console.error("Error converting CPU price:", error);
        return "0";
      }
    };

    const cpuPricePerSecond = convertCpuPriceToPerMcpuPerSecond(pricingPerHour.cpuPricePerHour);
    const gpuPricePerSecond = convertHourToSecond(pricingPerHour.gpuPricePerHour);
    const memoryPricePerSecond = convertHourToSecond(pricingPerHour.memoryPricePerHour);
    const diskPricePerSecond = convertHourToSecond(pricingPerHour.diskPricePerHour);

    console.log("Price conversion - Per Hour -> Per Second:", {
      input: pricingPerHour,
      output: {
        cpuPricePerSecond,
        gpuPricePerSecond,
        memoryPricePerSecond,
        diskPricePerSecond,
      },
    });

    setFormData((prev) => ({
      ...prev,
      cpuPricePerSecond,
      gpuPricePerSecond,
      memoryPricePerSecond,
      diskPricePerSecond,
    }));
  }, [pricingPerHour]);

  // Update metadata JSON when fields change
  useEffect(() => {
    const metadataObj: Partial<ProviderMetadata> = {};
    if (metadataFields.name) metadataObj.name = metadataFields.name;
    if (metadataFields.description) metadataObj.description = metadataFields.description;
    if (metadataFields.website) metadataObj.website = metadataFields.website;
    if (metadataFields.email) metadataObj.email = metadataFields.email;
    if (metadataFields.location) metadataObj.location = metadataFields.location;
    if (metadataFields.country) metadataObj.country = metadataFields.country;

    const metadataJson = Object.keys(metadataObj).length > 0 
      ? JSON.stringify(metadataObj, null, 2)
      : "";
    
    setFormData((prev) => ({ ...prev, metadata: metadataJson }));
  }, [metadataFields]);

  // Set operator to connected wallet address
  useEffect(() => {
    if (address) {
      setFormData((prev) => ({ ...prev, operator: address }));
    }
  }, [address]);

  // Calculate required stake when relevant fields change
  useEffect(() => {
    if (
      currentStep >= 3 &&
      formData.cpuCores > 0 &&
      formData.memoryMB > 0 &&
      formData.diskGB > 0 &&
      parseFloat(pricingPerHour.cpuPricePerHour) > 0
    ) {
      calculateStake();
    }
  }, [
    formData.cpuCores,
    formData.gpuCores,
    formData.memoryMB,
    formData.diskGB,
    formData.cpuPricePerSecond,
    formData.gpuPricePerSecond,
    formData.memoryPricePerSecond,
    formData.diskPricePerSecond,
    pricingPerHour.cpuPricePerHour,
    cpuCoresDisplay,
    currentStep,
  ]);

  const calculateStake = async () => {
    setIsCalculatingStake(true);
    setError(null);
    try {
      const params = {
        machineType: formData.machineType,
        region: formData.region,
        cpuCores: formData.cpuCores,
        gpuCores: formData.gpuCores,
        memoryMB: formData.memoryMB,
        diskGB: formData.diskGB,
        cpuPricePerSecond: formData.cpuPricePerSecond,
        gpuPricePerSecond: formData.gpuPricePerSecond,
        memoryPricePerSecond: formData.memoryPricePerSecond,
        diskPricePerSecond: formData.diskPricePerSecond,
      };

      const stake = await calculateRequiredStake(params);
      const stakeFormatted = formatEther(stake);
      
      // Store original wei value for precise calculations
      setRequiredStakeWei(stake);
      
      // Round UP (ceil) to 2 decimal places for display, but add a small buffer (0.01) to ensure enough
      // This ensures we always approve slightly more than needed
      const stakeValue = parseFloat(stakeFormatted);
      // Round up to 2 decimal places: multiply by 100, ceil, divide by 100
      const stakeRoundedUp = Math.ceil(stakeValue * 100) / 100;
      // Add 0.01 buffer to ensure we have enough (1% or minimum 0.01)
      const stakeWithBuffer = Math.max(stakeRoundedUp + 0.01, stakeRoundedUp * 1.01);
      const stakeDisplay = stakeWithBuffer.toFixed(2);
      
      console.log("=== Calculate Stake ===");
      console.log("Original stake (wei):", stake.toString());
      console.log("Original stake (ether):", stakeFormatted);
      console.log("Rounded up (2 decimals):", stakeRoundedUp);
      console.log("With buffer:", stakeWithBuffer);
      console.log("Display value:", stakeDisplay);
      
      setRequiredStake(stakeDisplay);
    } catch (err: any) {
      console.error("Error calculating stake:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        data: err.data,
        stack: err.stack,
      });
      setError(err.message || "Failed to calculate required stake");
    } finally {
      setIsCalculatingStake(false);
    }
  };

  // Calculate estimated revenue
  // Prices are in decimal 18 format (e.g., 0.01 tokens/hour)
  // Calculations maintain precision for decimal 18
  // CPU price is per CPU core per hour (decimal 3), not per mCPU
  // IMPORTANT: Uses pricingPerHour (per hour) for revenue calculation
  const calculateEstimatedRevenue = () => {
    // Parse prices with full precision (decimal 18) - using PER HOUR prices
    const cpuPrice = parseFloat(pricingPerHour.cpuPricePerHour) || 0;
    const gpuPrice = parseFloat(pricingPerHour.gpuPricePerHour) || 0;
    const memoryPrice = parseFloat(pricingPerHour.memoryPricePerHour) || 0;
    const diskPrice = parseFloat(pricingPerHour.diskPricePerHour) || 0;

    // Use CPU cores in decimal 3 format (e.g., 0.1, 1, 2.5 cores)
    // Price is per core per hour, so multiply cores by price
    const cpuCores = parseFloat(cpuCoresDisplay) || 0;
    const gpuCores = formData.gpuCores || 0;
    const memoryMB = formData.memoryMB || 0;
    const diskGB = formData.diskGB || 0;

    // Calculate revenue per hour (assuming 100% utilization)
    // CPU: cores (decimal 3) × price per core per hour
    // Memory: convert MB to GB (divide by 1024), then multiply by price per GB per hour
    // All prices are in decimal 18 format, so calculations maintain that precision
    const cpuRevenue = cpuCores * cpuPrice;
    const gpuRevenue = gpuCores * gpuPrice;
    const memoryGB = memoryMB / 1024; // Convert MB to GB
    const memoryRevenue = memoryGB * memoryPrice;
    const diskRevenue = diskGB * diskPrice;
    const revenuePerHour = cpuRevenue + gpuRevenue + memoryRevenue + diskRevenue;

    return {
      perHour: revenuePerHour,
      perDay: revenuePerHour * 24,
      perWeek: revenuePerHour * 24 * 7,
      perMonth: revenuePerHour * 24 * 30,
    };
  };

  const formatCurrency = (value: number): string => {
    if (value === 0) return "0";
    if (value < 0.01) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    return value.toFixed(2);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        setError(null);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const validateStep = (step: number): boolean => {
    setError(null);

    switch (step) {
      case 1:
        if (!metadataFields.name.trim()) {
          setError("Please enter provider name");
          return false;
        }
        if (!metadataFields.description.trim()) {
          setError("Please enter provider description");
          return false;
        }
        if (!formData.operator) {
          setError("Please connect your wallet");
          return false;
        }
        return true;

      case 2:
        if (parseFloat(cpuCoresDisplay) <= 0) {
          setError("CPU cores must be greater than 0");
          return false;
        }
        if (formData.memoryMB <= 0) {
          setError("Memory must be greater than 0");
          return false;
        }
        if (formData.diskGB <= 0) {
          setError("Disk space must be greater than 0");
          return false;
        }
        return true;

      case 3:
        if (parseFloat(pricingPerHour.cpuPricePerHour) <= 0) {
          setError("CPU core price per hour must be greater than 0");
          return false;
        }
        if (parseFloat(pricingPerHour.memoryPricePerHour) <= 0) {
          setError("Memory price per hour must be greater than 0");
          return false;
        }
        if (parseFloat(pricingPerHour.diskPricePerHour) <= 0) {
          setError("Disk price per hour must be greater than 0");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Check token allowance
  const checkAllowance = useCallback(async () => {
    if (!isConnected || !address) {
      return;
    }

    setIsCheckingAllowance(true);
    setError(null);

    try {
      const providerContractAddress = blockchainConfig.contracts.providerContract;
      if (!providerContractAddress) {
        throw new Error("Provider contract address is not configured");
      }

      const allowance = await checkTokenAllowance(address, providerContractAddress);
      setTokenAllowance(allowance);
    } catch (err: any) {
      console.error("Error checking allowance:", err);
      setError(err.message || "Failed to check token allowance");
    } finally {
      setIsCheckingAllowance(false);
    }
  }, [isConnected, address]);

  // Check token allowance when entering step 4 (Review)
  useEffect(() => {
    if (currentStep === 4 && isConnected && address && requiredStake !== "0") {
      checkAllowance();
    }
  }, [currentStep, isConnected, address, requiredStake, checkAllowance]);

  // Approve token
  const handleApprove = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (requiredStake === "0") {
      setError("Please calculate required stake first");
      return;
    }

    setIsApproving(true);
    setError(null);

    try {
      const providerContractAddress = blockchainConfig.contracts.providerContract;
      if (!providerContractAddress) {
        throw new Error("Provider contract address is not configured");
      }

      // Use the original wei value + buffer to ensure we approve enough
      // Calculate buffer: add 1% or minimum 0.01 token worth of wei
      const bufferWei = requiredStakeWei / BigInt(100); // 1% buffer
      const minBufferWei = parseUnits("0.01", 18); // Minimum 0.01 token buffer
      const totalBufferWei = bufferWei > minBufferWei ? bufferWei : minBufferWei;
      const stakeAmount = requiredStakeWei + totalBufferWei;
      
      console.log("=== Approve Token ===");
      console.log("Required stake (wei):", requiredStakeWei.toString());
      console.log("Buffer (wei):", totalBufferWei.toString());
      console.log("Total to approve (wei):", stakeAmount.toString());
      console.log("Total to approve (ether):", formatEther(stakeAmount));
      
      // Approve the token with the required stake amount + buffer
      const hash = await approveToken(stakeAmount, providerContractAddress);
      setApproveTxHash(hash);
      
      // Refresh allowance after approval
      await checkAllowance();
    } catch (err: any) {
      console.error("Approval error:", err);
      setError(err.message || "Failed to approve token. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    // Check token allowance before registration
    const providerContractAddress = blockchainConfig.contracts.providerContract;
    if (!providerContractAddress) {
      setError("Provider contract address is not configured");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the original wei value (without buffer) for checking allowance
      // The contract will use the exact required amount
      const stakeAmount = requiredStakeWei;
      const allowance = await checkTokenAllowance(address, providerContractAddress);
      
      console.log("=== Register Provider - Allowance Check ===");
      console.log("Address:", address);
      console.log("Required Stake (display):", requiredStake);
      console.log("Required Stake (wei, exact):", stakeAmount.toString());
      console.log("Required Stake (ether, exact):", formatEther(stakeAmount));
      console.log("Current Allowance (wei):", allowance.toString());
      console.log("Current Allowance (ether):", formatEther(allowance));
      console.log("Allowance sufficient:", allowance >= stakeAmount);
      
      if (allowance < stakeAmount) {
        setError(
          `Insufficient token allowance. Please approve at least ${requiredStake} tokens first.`,
        );
        setIsLoading(false);
        return;
      }

      // Prepare registration data
      const registrationData = {
        ...formData,
        operator: address, // Ensure we use the connected address
      };

      console.log("=== Register Provider - Registration Data ===");
      console.log("Full formData:", JSON.stringify(formData, null, 2));
      console.log("Registration params:", {
        operator: registrationData.operator,
        metadata: registrationData.metadata,
        machineType: registrationData.machineType,
        region: registrationData.region,
        cpuCores: registrationData.cpuCores,
        gpuCores: registrationData.gpuCores,
        memoryMB: registrationData.memoryMB,
        diskGB: registrationData.diskGB,
        cpuPricePerSecond: registrationData.cpuPricePerSecond,
        gpuPricePerSecond: registrationData.gpuPricePerSecond,
        memoryPricePerSecond: registrationData.memoryPricePerSecond,
        diskPricePerSecond: registrationData.diskPricePerSecond,
      });
      console.log("Price values (strings):", {
        cpuPricePerSecond: registrationData.cpuPricePerSecond,
        gpuPricePerSecond: registrationData.gpuPricePerSecond,
        memoryPricePerSecond: registrationData.memoryPricePerSecond,
        diskPricePerSecond: registrationData.diskPricePerSecond,
      });

      // Proceed with registration
      const hash = await registerProvider(registrationData);
      console.log("=== Register Provider - Success ===");
      console.log("Transaction hash:", hash);
      setTxHash(hash);
      setCurrentStep(5); // Success step
    } catch (err: any) {
      console.error("=== Register Provider - Error ===");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);
      console.error("Error data:", err.data);
      console.error("Error reason:", err.reason);
      console.error("Error stack:", err.stack);
      setError(err.message || "Failed to register provider. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} />
                Provider Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Provider Name"
                  placeholder="e.g., My Cloud Provider"
                  value={metadataFields.name}
                  onChange={(e) =>
                    setMetadataFields((prev) => ({ ...prev, name: e.target.value }))
                  }
                  isRequired
                  description="The name of your provider service"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-default-700">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-default-200 bg-background text-foreground focus:border-primary focus:outline-none resize-y"
                    placeholder="Describe your provider service, capabilities, and any relevant information"
                    value={metadataFields.description}
                    onChange={(e) =>
                      setMetadataFields((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                  <p className="text-xs text-default-500">
                    Provide a detailed description of your provider service
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    placeholder="https://example.com"
                    value={metadataFields.website || ""}
                    onChange={(e) =>
                      setMetadataFields((prev) => ({ ...prev, website: e.target.value }))
                    }
                    description="Your provider website URL (optional)"
                  />

                  <Input
                    label="Email"
                    placeholder="contact@example.com"
                    type="email"
                    value={metadataFields.email || ""}
                    onChange={(e) =>
                      setMetadataFields((prev) => ({ ...prev, email: e.target.value }))
                    }
                    description="Contact email (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    placeholder="e.g., Singapore"
                    value={metadataFields.country || ""}
                    onChange={(e) =>
                      setMetadataFields((prev) => ({ ...prev, country: e.target.value }))
                    }
                    description="Country of your provider (optional)"
                  />
                  <Input
                    label="City"
                    placeholder="e.g., Singapore"
                    value={metadataFields.location || ""}
                    onChange={(e) =>
                      setMetadataFields((prev) => ({ ...prev, location: e.target.value }))
                    }
                    description="City of your provider (optional)"
                  />
                </div>

                {formData.metadata && (
                  <Card className="bg-default-50 border-default-200">
                    <CardBody className="p-4">
                      <p className="text-xs font-semibold text-default-600 mb-2">
                        Metadata JSON Preview:
                      </p>
                      <pre className="text-xs text-default-700 overflow-x-auto">
                        {formData.metadata}
                      </pre>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Machine Type"
                selectedKeys={[formData.machineType.toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setFormData((prev) => ({
                    ...prev,
                    machineType: parseInt(value),
                  }));
                }}
              >
                {machineTypes.map((type) => (
                  <SelectItem key={type.value.toString()}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Region"
                selectedKeys={[formData.region.toString()]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setFormData((prev) => ({
                    ...prev,
                    region: parseInt(value),
                  }));
                }}
              >
                {regions.map((region) => (
                  <SelectItem key={region.value.toString()}>
                    {region.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Server size={20} />
                Hardware Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  inputMode="decimal"
                  label="CPU Cores"
                  placeholder="e.g., 0.1, 1, 2.5"
                  value={cpuCoresDisplay}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setCpuCoresDisplay(value);
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setCpuCoresDisplay("0");
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setCpuCoresDisplay("0");
                    } else {
                      setCpuCoresDisplay(numValue.toString());
                    }
                  }}
                  description="Number of CPU cores (decimal 3, e.g., 0.1 = 100 mCPU, 1 = 1000 mCPU)"
                />

                <Input
                  type="number"
                  label="GPU Cores"
                  placeholder="e.g., 0"
                  value={formData.gpuCores.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gpuCores: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={0}
                  description="Number of GPU cores (0 if no GPU)"
                />

                <Input
                  type="number"
                  label="Memory (MB)"
                  placeholder="e.g., 8192"
                  value={formData.memoryMB.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      memoryMB: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={1}
                  description="Total memory in megabytes"
                />

                <Input
                  type="number"
                  label="Disk Space (GB)"
                  placeholder="e.g., 100"
                  value={formData.diskGB.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      diskGB: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={1}
                  description="Total disk space in gigabytes"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Resource Pricing
              </h3>
              <p className="text-sm text-dark-on-white-muted mb-4">
                Set your pricing per hour for each resource (in tokens). Prices will be automatically converted to per second for the smart contract.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  inputMode="decimal"
                  label="CPU Core Price per Hour"
                  placeholder="e.g., 0.1"
                  value={pricingPerHour.cpuPricePerHour}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        cpuPricePerHour: value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        cpuPricePerHour: "0",
                      }));
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        cpuPricePerHour: "0",
                      }));
                    } else {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        cpuPricePerHour: numValue.toString(),
                      }));
                    }
                  }}
                  description="Price per CPU core per hour (decimal 3, e.g., 0.1 core = 100 mCPU)"
                />

                <Input
                  type="text"
                  inputMode="decimal"
                  label="GPU Price per Hour"
                  placeholder="e.g., 1.0"
                  value={pricingPerHour.gpuPricePerHour}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        gpuPricePerHour: value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        gpuPricePerHour: "0",
                      }));
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        gpuPricePerHour: "0",
                      }));
                    } else {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        gpuPricePerHour: numValue.toString(),
                      }));
                    }
                  }}
                  description="Price per GPU core per hour"
                />

                <Input
                  type="text"
                  inputMode="decimal"
                  label="Memory Price per Hour (per GB)"
                  placeholder="e.g., 0.01"
                  value={pricingPerHour.memoryPricePerHour}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        memoryPricePerHour: value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        memoryPricePerHour: "0",
                      }));
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        memoryPricePerHour: "0",
                      }));
                    } else {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        memoryPricePerHour: numValue.toString(),
                      }));
                    }
                  }}
                  description="Price per GB of memory per hour"
                />

                <Input
                  type="text"
                  inputMode="decimal"
                  label="Disk Price per Hour (per GB)"
                  placeholder="e.g., 0.001"
                  value={pricingPerHour.diskPricePerHour}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        diskPricePerHour: value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        diskPricePerHour: "0",
                      }));
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        diskPricePerHour: "0",
                      }));
                    } else {
                      setPricingPerHour((prev) => ({
                        ...prev,
                        diskPricePerHour: numValue.toString(),
                      }));
                    }
                  }}
                  description="Price per GB of disk per hour"
                />
              </div>

              {/* Summary Cards */}
              <div className="space-y-4 mt-6">
              {/* Estimated Revenue */}
              {parseFloat(cpuCoresDisplay) > 0 &&
                parseFloat(pricingPerHour.cpuPricePerHour) > 0 && (
                    <Card className="bg-success/10 border-success/20">
                      <CardBody className="p-4">
                        <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                          <TrendingUp size={18} />
                          Estimated Revenue (100% Utilization)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-dark-on-white-muted mb-1">Per Hour</p>
                            <p className="text-lg font-bold text-success">
                              {formatCurrency(calculateEstimatedRevenue().perHour)} tokens
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-on-white-muted mb-1">Per Day</p>
                            <p className="text-lg font-bold text-success">
                              {formatCurrency(calculateEstimatedRevenue().perDay)} tokens
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-on-white-muted mb-1">Per Week</p>
                            <p className="text-lg font-bold text-success">
                              {formatCurrency(calculateEstimatedRevenue().perWeek)} tokens
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-on-white-muted mb-1">Per Month</p>
                            <p className="text-lg font-bold text-success">
                              {formatCurrency(calculateEstimatedRevenue().perMonth)} tokens
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-dark-on-white-muted mt-3">
                          * Revenue estimates assume 100% resource utilization. Actual revenue may vary.
                        </p>
                      </CardBody>
                    </Card>
                  )}

                {/* Required Stake */}
                {isCalculatingStake ? (
                  <Card className="bg-default-50 border-default-200">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 text-sm text-dark-on-white-muted">
                        <Loader2 className="animate-spin" size={16} />
                        Calculating required stake...
                      </div>
                    </CardBody>
                  </Card>
                ) : requiredStake !== "0" ? (
                  <Card className="bg-primary/10 border-primary/20">
                    <CardBody className="p-4">
                      <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                        <Shield size={18} />
                        Required Stake
                      </h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dark-on-white-muted">Amount to stake:</span>
                        <span className="text-2xl font-bold text-primary">
                          {requiredStake} tokens
                        </span>
                      </div>
                      <p className="text-xs text-dark-on-white-muted mt-2">
                        You will need to stake this amount to register as a provider
                      </p>
                    </CardBody>
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
              <div className="space-y-4">
                <Card>
                  <CardBody className="p-4 space-y-3">
                    {metadataFields.name && (
                      <div>
                        <span className="text-sm font-semibold text-dark-on-white-muted">
                          Provider Name:
                        </span>
                        <p className="text-dark-on-white">{metadataFields.name}</p>
                      </div>
                    )}
                    {metadataFields.description && (
                      <div>
                        <span className="text-sm font-semibold text-dark-on-white-muted">
                          Description:
                        </span>
                        <p className="text-dark-on-white">{metadataFields.description}</p>
                      </div>
                    )}
                    {(metadataFields.website || metadataFields.email || metadataFields.location || metadataFields.country) && (
                      <div>
                        <span className="text-sm font-semibold text-dark-on-white-muted">
                          Contact Information:
                        </span>
                        <div className="text-dark-on-white space-y-1">
                          {metadataFields.website && <p>Website: {metadataFields.website}</p>}
                          {metadataFields.email && <p>Email: {metadataFields.email}</p>}
                          {metadataFields.country && <p>Country: {metadataFields.country}</p>}
                          {metadataFields.location && <p>City: {metadataFields.location}</p>}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-semibold text-dark-on-white-muted">
                        Machine Type:
                      </span>
                      <p className="text-dark-on-white">
                        {machineTypes.find((t) => t.value === formData.machineType)
                          ?.label || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-dark-on-white-muted">
                        Region:
                      </span>
                      <p className="text-dark-on-white">
                        {regions.find((r) => r.value === formData.region)?.label ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-dark-on-white-muted">
                        Resources:
                      </span>
                      <p className="text-dark-on-white">
                        {cpuCoresDisplay || "0"} CPU cores ({formData.cpuCores} mCPU), {formData.gpuCores} GPU cores,{" "}
                        {formData.memoryMB} MB RAM, {formData.diskGB} GB disk
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-dark-on-white-muted">
                        Pricing (per hour):
                      </span>
                      <p className="text-dark-on-white">
                        CPU Core: {pricingPerHour.cpuPricePerHour || "0"} tokens/hour/core, GPU:{" "}
                        {pricingPerHour.gpuPricePerHour || "0"} tokens/hour, Memory:{" "}
                        {pricingPerHour.memoryPricePerHour || "0"} tokens/hour/GB, Disk:{" "}
                        {pricingPerHour.diskPricePerHour || "0"} tokens/hour/GB
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Summary Cards in Review */}
                <div className="space-y-4">
                  {/* Estimated Revenue in Review */}
                  {parseFloat(cpuCoresDisplay) > 0 &&
                    parseFloat(pricingPerHour.cpuPricePerHour) > 0 && (
                      <Card className="bg-success/10 border-success/20">
                        <CardBody className="p-4">
                          <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                            <TrendingUp size={18} />
                            Estimated Revenue (100% Utilization)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-dark-on-white-muted mb-1">Per Hour</p>
                              <p className="text-lg font-bold text-success">
                                {formatCurrency(calculateEstimatedRevenue().perHour)} tokens
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-on-white-muted mb-1">Per Day</p>
                              <p className="text-lg font-bold text-success">
                                {formatCurrency(calculateEstimatedRevenue().perDay)} tokens
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-on-white-muted mb-1">Per Week</p>
                              <p className="text-lg font-bold text-success">
                                {formatCurrency(calculateEstimatedRevenue().perWeek)} tokens
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-on-white-muted mb-1">Per Month</p>
                              <p className="text-lg font-bold text-success">
                                {formatCurrency(calculateEstimatedRevenue().perMonth)} tokens
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-dark-on-white-muted mt-3">
                            * Revenue estimates assume 100% resource utilization. Actual revenue may vary.
                          </p>
                        </CardBody>
                      </Card>
                    )}

                  {/* Required Stake in Review */}
                  {requiredStake !== "0" && (
                    <Card className="bg-primary/10 border-primary/20">
                      <CardBody className="p-4">
                        <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                          <Shield size={18} />
                          Required Stake
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-dark-on-white-muted">Amount to stake:</span>
                          <span className="text-2xl font-bold text-primary">
                            {requiredStake} tokens
                          </span>
                        </div>
                        <p className="text-xs text-dark-on-white-muted mt-2">
                          You will need to stake this amount to register as a provider
                        </p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Token Allowance Status */}
                  {requiredStake !== "0" && parseFloat(requiredStake) > 0 && requiredStakeWei > BigInt(0) && (
                    <Card
                      className={
                        isCheckingAllowance
                          ? "bg-default-50 border-default-200"
                          : tokenAllowance >= requiredStakeWei
                            ? "bg-success/10 border-success/20"
                            : "bg-warning/10 border-warning/20"
                      }
                    >
                      <CardBody className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Shield size={18} />
                          Token Approval Status
                        </h4>
                        {isCheckingAllowance ? (
                          <div className="flex items-center gap-2 text-sm text-dark-on-white-muted">
                            <Loader2 className="animate-spin" size={16} />
                            Checking token allowance...
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-dark-on-white-muted">
                                Current Allowance:
                              </span>
                              <span className="text-lg font-bold">
                                {formatEther(tokenAllowance)} tokens
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-dark-on-white-muted">
                                Required Amount (exact):
                              </span>
                              <span className="text-lg font-bold">{formatEther(requiredStakeWei)} tokens</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-dark-on-white-muted">
                                Display Value (with buffer):
                              </span>
                              <span className="text-sm font-semibold">{requiredStake} tokens</span>
                            </div>
                            {tokenAllowance < requiredStakeWei ? (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm text-warning">
                                  You need to approve tokens before registering as a provider.
                                </p>
                                {approveTxHash && (
                                  <p className="text-xs text-success">
                                    Approval transaction: {approveTxHash.slice(0, 10)}...
                                    {approveTxHash.slice(-8)}
                                  </p>
                                )}
                                <Button
                                  color="warning"
                                  onClick={handleApprove}
                                  isLoading={isApproving}
                                  className="w-full"
                                >
                                  {isApproving
                                    ? "Approving Tokens..."
                                    : `Approve ${requiredStake} Tokens`}
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-success mt-2">
                                ✓ Token allowance is sufficient. You can proceed with registration.
                              </p>
                            )}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6 py-8">
            <CheckCircle2 size={64} className="mx-auto text-success" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
              <p className="text-dark-on-white-muted">
                Your provider registration has been submitted to the blockchain.
              </p>
            </div>
            {txHash && (
              <Card className="bg-primary/10">
                <CardBody className="p-4">
                  <p className="text-sm text-dark-on-white-muted mb-2">
                    Transaction Hash:
                  </p>
                  <p className="font-mono text-xs break-all">{txHash}</p>
                </CardBody>
              </Card>
            )}
            <Button
              color="primary"
              onClick={() => window.location.reload()}
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardBody className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Connect Your Wallet</h3>
          <p className="text-dark-on-white-muted mb-6">
            Please connect your wallet to register as a provider
          </p>
          <Button color="primary" onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="p-6 border-b">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-2">Provider Registration</h2>
            <p className="text-dark-on-white-muted">
              Complete the steps below to register as a provider
            </p>
            <div className="mt-4">
              <Progress
                value={(currentStep / steps.length) * 100}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-dark-on-white-muted">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {/* Step Indicators */}
          {currentStep < 5 && (
            <div className="flex justify-between mb-8">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div className="flex items-center w-full">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep > step.id
                          ? "bg-success border-success text-white"
                          : currentStep === step.id
                            ? "bg-primary border-primary text-white"
                            : "bg-transparent border-default-300 text-default-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <span className="font-semibold">{step.id}</span>
                      )}
                    </div>
                    {step.id < steps.length && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          currentStep > step.id
                            ? "bg-success"
                            : "bg-default-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-semibold ${
                        currentStep >= step.id
                          ? "text-dark-on-white"
                          : "text-dark-on-white-muted"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="min-h-[400px]">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="flat"
                onClick={handleBack}
                isDisabled={currentStep === 1 || isLoading || isApproving}
                startContent={<ArrowLeft size={16} />}
              >
                Back
              </Button>

              {currentStep < steps.length ? (
                <Button
                  color="primary"
                  onClick={handleNext}
                  isDisabled={isLoading || isApproving}
                  endContent={<ArrowRight size={16} />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={
                    isLoading ||
                    isApproving ||
                    isCheckingAllowance ||
                    (requiredStakeWei > BigInt(0) && tokenAllowance < requiredStakeWei)
                  }
                  endContent={<ArrowRight size={16} />}
                >
                  Register Provider
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

