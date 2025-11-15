"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { DollarSign, Info, Lock, Save, RefreshCw, Shield, Loader2, AlertCircle } from "lucide-react";
import { formatUnits, parseUnits } from "ethers";
import {
  type ProviderInfo,
  updateResourcePrice,
  type UpdateResourcePriceParams,
  calculateRequiredStake,
  checkTokenAllowance,
  approveToken,
  formatEther,
} from "@/lib/blockchain/provider-contract";
import { useWallet } from "@/hooks/use-wallet";
import { blockchainConfig } from "@/config/blockchain";

import { ProviderConfig } from "./types";

interface PricingTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  providerInfo: ProviderInfo | null;
  providerAddress: string | null;
  onPriceUpdate?: () => void;
}

export function PricingTab({
  config,
  updateConfig,
  providerInfo,
  providerAddress,
  onPriceUpdate,
}: PricingTabProps) {
  const { address, isConnected } = useWallet();
  
  // Local state for editing prices (per hour)
  const [editingPrices, setEditingPrices] = useState({
    cpu: "",
    gpu: "",
    memory: "",
    storage: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Required stake states
  const [currentRequiredStake, setCurrentRequiredStake] = useState<bigint>(BigInt(0));
  const [newRequiredStake, setNewRequiredStake] = useState<bigint>(BigInt(0));
  const [isCalculatingStake, setIsCalculatingStake] = useState(false);
  const [tokenAllowance, setTokenAllowance] = useState<bigint>(BigInt(0));
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);
  const [additionalStakeNeeded, setAdditionalStakeNeeded] = useState<bigint>(BigInt(0));
  
  // Use ref to track if calculation is in progress (to prevent infinite loops)
  const isCalculatingRef = useRef(false);

  // Convert prices from per second (blockchain) to per hour
  const getPricePerHour = (pricePerSecond: bigint): string => {
    if (!pricePerSecond) return "0";
    const perSecond = parseFloat(formatUnits(pricePerSecond, 18));
    return (perSecond * 3600).toFixed(6);
  };

  // Get prices from blockchain (memoized to prevent unnecessary recalculations)
  const blockchainPricing = useMemo(() => {
    if (!providerInfo) return null;
    return {
      cpu: getPricePerHour(providerInfo.cpuPricePerSecond),
      gpu: getPricePerHour(providerInfo.gpuPricePerSecond),
      memory: getPricePerHour(providerInfo.memoryPricePerSecond),
      storage: getPricePerHour(providerInfo.diskPricePerSecond),
    };
  }, [
    providerInfo?.cpuPricePerSecond,
    providerInfo?.gpuPricePerSecond,
    providerInfo?.memoryPricePerSecond,
    providerInfo?.diskPricePerSecond,
  ]);

  // Check if there are changes (compare with tolerance for floating point)
  const hasChanges = useMemo(() => {
    if (!providerInfo || !blockchainPricing) return false;
    
    const tolerance = 0.000001; // Small tolerance for floating point comparison
    const cpuValue = parseFloat(editingPrices.cpu || "0");
    const gpuValue = parseFloat(editingPrices.gpu || "0");
    const memoryValue = parseFloat(editingPrices.memory || "0");
    const storageValue = parseFloat(editingPrices.storage || "0");
    
    const cpuChanged = Math.abs(cpuValue - parseFloat(blockchainPricing.cpu)) > tolerance;
    const gpuChanged = Math.abs(gpuValue - parseFloat(blockchainPricing.gpu)) > tolerance;
    const memoryChanged = Math.abs(memoryValue - parseFloat(blockchainPricing.memory)) > tolerance;
    const storageChanged = Math.abs(storageValue - parseFloat(blockchainPricing.storage)) > tolerance;
    
    return cpuChanged || gpuChanged || memoryChanged || storageChanged;
  }, [editingPrices.cpu, editingPrices.gpu, editingPrices.memory, editingPrices.storage, blockchainPricing, providerInfo]);

  // Initialize editing prices from blockchain when providerInfo changes
  useEffect(() => {
    if (providerInfo) {
      const cpuPrice = getPricePerHour(providerInfo.cpuPricePerSecond);
      const gpuPrice = getPricePerHour(providerInfo.gpuPricePerSecond);
      const memoryPrice = getPricePerHour(providerInfo.memoryPricePerSecond);
      const storagePrice = getPricePerHour(providerInfo.diskPricePerSecond);
      
      setEditingPrices({
        cpu: cpuPrice !== "0" ? cpuPrice : "",
        gpu: gpuPrice !== "0" ? gpuPrice : "",
        memory: memoryPrice !== "0" ? memoryPrice : "",
        storage: storagePrice !== "0" ? storagePrice : "",
      });
      
      // Set current required stake (current stake amount)
      setCurrentRequiredStake(providerInfo.stakeAmount || BigInt(0));
      
      setUpdateError(null);
      setUpdateSuccess(false);
    }
  }, [providerInfo]);
  
  // Use refs to track allowance checking state to prevent infinite loops
  const isCheckingAllowanceRef = useRef(false);
  const lastCheckedAdditionalStakeRef = useRef<bigint>(BigInt(0));
  const checkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check token allowance (defined first to avoid dependency issues)
  const checkAllowance = useCallback(async () => {
    if (!isConnected || !address) {
      return;
    }
    
    // Prevent multiple simultaneous checks
    if (isCheckingAllowanceRef.current) {
      console.log("Already checking allowance, skipping...");
      return;
    }
    
    isCheckingAllowanceRef.current = true;
    setIsCheckingAllowance(true);
    setUpdateError(null);
    
    try {
      const providerContractAddress = blockchainConfig.contracts.providerContract;
      if (!providerContractAddress) {
        throw new Error("Provider contract address is not configured");
      }
      
      console.log("=== Checking Token Allowance ===");
      const allowance = await checkTokenAllowance(address, providerContractAddress);
      console.log("=== Allowance Checked ===");
      console.log("Allowance (wei):", allowance.toString());
      console.log("Allowance (ether):", formatEther(allowance));
      setTokenAllowance(allowance);
    } catch (err: any) {
      console.error("Error checking allowance:", err);
      setUpdateError(err.message || "Failed to check token allowance");
    } finally {
      isCheckingAllowanceRef.current = false;
      setIsCheckingAllowance(false);
    }
  }, [isConnected, address]);
  
  // Convert price per hour to per second (for blockchain) - memoized
  const convertHourToSecond = useCallback((pricePerHour: string): string => {
    if (!pricePerHour || parseFloat(pricePerHour) <= 0) return "0";
    try {
      const priceWei = parseUnits(pricePerHour, 18);
      const pricePerSecondWei = priceWei / BigInt(3600);
      return formatUnits(pricePerSecondWei, 18);
    } catch (error) {
      console.error("Error converting hour to second:", error);
      return "0";
    }
  }, []);
  
  // Calculate new required stake based on new prices
  const calculateNewRequiredStake = useCallback(async () => {
    if (!providerInfo || !isConnected || !address) {
      setNewRequiredStake(BigInt(0));
      setAdditionalStakeNeeded(BigInt(0));
      return;
    }
    
    // Calculate current blockchain prices from providerInfo (to avoid dependency on blockchainPricing object)
    const currentCpuPrice = getPricePerHour(providerInfo.cpuPricePerSecond);
    const currentGpuPrice = getPricePerHour(providerInfo.gpuPricePerSecond);
    const currentMemoryPrice = getPricePerHour(providerInfo.memoryPricePerSecond);
    const currentStoragePrice = getPricePerHour(providerInfo.diskPricePerSecond);
    
    // Check if there are changes directly
    const tolerance = 0.000001;
    const cpuValue = parseFloat(editingPrices.cpu || "0");
    const gpuValue = parseFloat(editingPrices.gpu || "0");
    const memoryValue = parseFloat(editingPrices.memory || "0");
    const storageValue = parseFloat(editingPrices.storage || "0");
    
    const cpuChanged = Math.abs(cpuValue - parseFloat(currentCpuPrice)) > tolerance;
    const gpuChanged = Math.abs(gpuValue - parseFloat(currentGpuPrice)) > tolerance;
    const memoryChanged = Math.abs(memoryValue - parseFloat(currentMemoryPrice)) > tolerance;
    const storageChanged = Math.abs(storageValue - parseFloat(currentStoragePrice)) > tolerance;
    
    const hasPriceChanges = cpuChanged || gpuChanged || memoryChanged || storageChanged;
    
    // Skip if no changes
    if (!hasPriceChanges) {
      setNewRequiredStake(BigInt(0));
      setAdditionalStakeNeeded(BigInt(0));
      return;
    }
    
    // Prevent multiple simultaneous calculations using ref
    if (isCalculatingRef.current) {
      console.log("Already calculating stake, skipping...");
      return;
    }
    
    isCalculatingRef.current = true;
    setIsCalculatingStake(true);
    setUpdateError(null);
    
    try {
      const params = {
        machineType: Number(providerInfo.machineType),
        region: Number(providerInfo.region),
        cpuCores: Number(providerInfo.cpuCores),
        gpuCores: Number(providerInfo.gpuCores),
        memoryMB: Number(providerInfo.memoryMB),
        diskGB: Number(providerInfo.diskGB),
        cpuPricePerSecond: convertHourToSecond(editingPrices.cpu || currentCpuPrice || "0"),
        gpuPricePerSecond: convertHourToSecond(editingPrices.gpu || currentGpuPrice || "0"),
        memoryPricePerSecond: convertHourToSecond(editingPrices.memory || currentMemoryPrice || "0"),
        diskPricePerSecond: convertHourToSecond(editingPrices.storage || currentStoragePrice || "0"),
      };
      
      console.log("=== Calculating New Required Stake ===");
      console.log("Params:", params);
      
      const stake = await calculateRequiredStake(params);
      console.log("=== Calculated Stake ===");
      console.log("New stake (wei):", stake.toString());
      console.log("New stake (ether):", formatEther(stake));
      
      setNewRequiredStake(stake);
      
      // Calculate additional stake needed
      if (stake > currentRequiredStake) {
        const additional = stake - currentRequiredStake;
        
        setAdditionalStakeNeeded(additional);
        console.log("Additional stake needed (wei):", additional.toString());
        console.log("Additional stake needed (ether):", formatEther(additional));
      } else {
        setAdditionalStakeNeeded(BigInt(0));
        lastCheckedAdditionalStakeRef.current = BigInt(0);
        // Clear any pending timeout
        if (checkingTimeoutRef.current) {
          clearTimeout(checkingTimeoutRef.current);
          checkingTimeoutRef.current = null;
        }
        console.log("No additional stake needed");
      }
    } catch (err: any) {
      console.error("Error calculating new required stake:", err);
      setUpdateError(err.message || "Failed to calculate required stake");
      setNewRequiredStake(BigInt(0));
      setAdditionalStakeNeeded(BigInt(0));
      lastCheckedAdditionalStakeRef.current = BigInt(0);
      // Clear any pending timeout
      if (checkingTimeoutRef.current) {
        clearTimeout(checkingTimeoutRef.current);
        checkingTimeoutRef.current = null;
      }
    } finally {
      isCalculatingRef.current = false;
      setIsCalculatingStake(false);
    }
  }, [
    providerInfo?.machineType,
    providerInfo?.region,
    providerInfo?.cpuCores,
    providerInfo?.gpuCores,
    providerInfo?.memoryMB,
    providerInfo?.diskGB,
    providerInfo?.cpuPricePerSecond?.toString(),
    providerInfo?.gpuPricePerSecond?.toString(),
    providerInfo?.memoryPricePerSecond?.toString(),
    providerInfo?.diskPricePerSecond?.toString(),
    isConnected,
    address,
    editingPrices.cpu,
    editingPrices.gpu,
    editingPrices.memory,
    editingPrices.storage,
    currentRequiredStake?.toString(),
    convertHourToSecond,
  ]);
  
  // Calculate new required stake when prices change (with debounce)
  useEffect(() => {
    // Skip if already calculating to prevent infinite loops
    if (isCalculatingRef.current) {
      return;
    }
    
    if (!providerInfo || !isConnected || !address) {
      setNewRequiredStake(BigInt(0));
      setAdditionalStakeNeeded(BigInt(0));
      return;
    }
    
    // Debounce calculation to avoid too many calls
    const timeoutId = setTimeout(() => {
      // Double check before calling to prevent race conditions
      if (!isCalculatingRef.current) {
        calculateNewRequiredStake();
      }
    }, 1000); // Wait 1 second after user stops typing
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    editingPrices.cpu,
    editingPrices.gpu,
    editingPrices.memory,
    editingPrices.storage,
    isConnected,
    address,
    calculateNewRequiredStake,
  ]);
  
  // Check allowance when additional stake is needed (separate effect to avoid loops)
  useEffect(() => {
    // Early return if conditions not met
    if (!isConnected || !address) {
      return;
    }
    
    // Clear any existing timeout
    if (checkingTimeoutRef.current) {
      clearTimeout(checkingTimeoutRef.current);
      checkingTimeoutRef.current = null;
    }
    
    // Skip if already checking or calculating
    if (isCheckingAllowanceRef.current || isCalculatingRef.current) {
      return;
    }
    
    // Skip if no additional stake needed
    if (additionalStakeNeeded <= BigInt(0)) {
      lastCheckedAdditionalStakeRef.current = BigInt(0);
      return;
    }
    
    // Skip if we've already checked for this exact value
    if (lastCheckedAdditionalStakeRef.current === additionalStakeNeeded) {
      return;
    }
    
    // Store current value to avoid stale closure
    const currentStake = additionalStakeNeeded;
    
    // Debounce to avoid too many calls
    checkingTimeoutRef.current = setTimeout(() => {
      // Final check before calling
      if (
        !isCheckingAllowanceRef.current &&
        !isCalculatingRef.current &&
        currentStake > BigInt(0) &&
        lastCheckedAdditionalStakeRef.current !== currentStake
      ) {
        // Mark as checked BEFORE calling to prevent re-triggering
        lastCheckedAdditionalStakeRef.current = currentStake;
        console.log("=== Triggering Allowance Check ===");
        console.log("Additional stake (wei):", currentStake.toString());
        checkAllowance().catch((err) => {
          console.error("Error in checkAllowance:", err);
          // Reset on error so we can retry next time
          lastCheckedAdditionalStakeRef.current = BigInt(0);
        });
      }
      checkingTimeoutRef.current = null;
    }, 1500); // Wait 1.5 seconds after stake calculation completes
    
    return () => {
      if (checkingTimeoutRef.current) {
        clearTimeout(checkingTimeoutRef.current);
        checkingTimeoutRef.current = null;
      }
    };
  }, [
    // Only trigger when additionalStakeNeeded value actually changes
    // Compare BigInt directly, not string (to avoid string recreation issues)
    additionalStakeNeeded,
    isConnected,
    address,
  ]);
  
  // Approve additional tokens
  const handleApprove = async () => {
    if (!isConnected || !address) {
      setUpdateError("Please connect your wallet first");
      return;
    }
    
    if (additionalStakeNeeded <= BigInt(0)) {
      setUpdateError("No additional stake needed");
      return;
    }
    
    setIsApproving(true);
    setUpdateError(null);
    
    try {
      const providerContractAddress = blockchainConfig.contracts.providerContract;
      if (!providerContractAddress) {
        throw new Error("Provider contract address is not configured");
      }
      
      // Approve the new required stake (total, not just additional)
      // The contract will handle the total stake amount
      const bufferWei = newRequiredStake / BigInt(100); // 1% buffer
      const minBufferWei = parseUnits("0.01", 18); // Minimum 0.01 token buffer
      const totalBufferWei = bufferWei > minBufferWei ? bufferWei : minBufferWei;
      const stakeAmount = newRequiredStake + totalBufferWei;
      
      console.log("=== Approve Additional Stake ===");
      console.log("Current stake (wei):", currentRequiredStake.toString());
      console.log("New stake (wei):", newRequiredStake.toString());
      console.log("Additional needed (wei):", additionalStakeNeeded.toString());
      console.log("Total to approve (wei, with buffer):", stakeAmount.toString());
      console.log("Total to approve (ether, with buffer):", formatEther(stakeAmount));
      
      const hash = await approveToken(stakeAmount, providerContractAddress);
      setApproveTxHash(hash);
      
      // Reset last checked value so we can check again after approval
      lastCheckedAdditionalStakeRef.current = BigInt(0);
      
      // Refresh allowance after approval (with delay to wait for transaction)
      setTimeout(() => {
        if (!isCheckingAllowanceRef.current && additionalStakeNeeded > BigInt(0)) {
          // Reset to trigger check in useEffect
          lastCheckedAdditionalStakeRef.current = BigInt(0);
          // Force re-trigger by calling checkAllowance directly
          checkAllowance().then(() => {
            // Mark as checked after successful check
            if (additionalStakeNeeded > BigInt(0)) {
              lastCheckedAdditionalStakeRef.current = additionalStakeNeeded;
            }
          });
        }
      }, 2000); // Wait 2 seconds for transaction to be mined
    } catch (err: any) {
      console.error("Approval error:", err);
      setUpdateError(err.message || "Failed to approve token. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleUpdatePrices = async () => {
    if (!providerAddress || !providerInfo || !isConnected || !address) {
      setUpdateError("Provider address, info, or wallet connection is missing");
      return;
    }

    // Check if additional stake is needed and if allowance is sufficient
    if (newRequiredStake > currentRequiredStake) {
      const providerContractAddress = blockchainConfig.contracts.providerContract;
      if (!providerContractAddress) {
        setUpdateError("Provider contract address is not configured");
        return;
      }
      
      // Check current allowance
      const allowance = await checkTokenAllowance(address, providerContractAddress);
      const currentStake = providerInfo.stakeAmount || BigInt(0);
      const additionalNeeded = newRequiredStake - currentStake;
      
      console.log("=== Update Prices - Stake Check ===");
      console.log("Current stake (wei):", currentStake.toString());
      console.log("New required stake (wei):", newRequiredStake.toString());
      console.log("Additional needed (wei):", additionalNeeded.toString());
      console.log("Current allowance (wei):", allowance.toString());
      console.log("Current allowance (ether):", formatEther(allowance));
      
      // Check if allowance is sufficient for the new required stake
      if (allowance < newRequiredStake) {
        setUpdateError(
          `Insufficient token allowance. New required stake is ${formatEther(newRequiredStake)} tokens, but current allowance is ${formatEther(allowance)} tokens. Please approve additional tokens first.`
        );
        return;
      }
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const params: UpdateResourcePriceParams = {
        providerId: providerAddress,
        cpuPricePerSecond: convertHourToSecond(editingPrices.cpu || blockchainPricing?.cpu || "0"),
        gpuPricePerSecond: convertHourToSecond(editingPrices.gpu || blockchainPricing?.gpu || "0"),
        memoryPricePerSecond: convertHourToSecond(editingPrices.memory || blockchainPricing?.memory || "0"),
        diskPricePerSecond: convertHourToSecond(editingPrices.storage || blockchainPricing?.storage || "0"),
      };

      console.log("=== Update Prices ===");
      console.log("Editing prices (per hour):", editingPrices);
      console.log("Params (per second):", params);

      const hash = await updateResourcePrice(params);
      console.log("=== Update Prices - Success ===");
      console.log("Transaction hash:", hash);

      setUpdateSuccess(true);
      
      // Refresh provider info after update
      if (onPriceUpdate) {
        setTimeout(() => {
          onPriceUpdate();
        }, 2000); // Wait 2 seconds for blockchain to update
      }
    } catch (err: any) {
      console.error("=== Update Prices - Error ===");
      console.error("Error updating prices:", err);
      setUpdateError(err.message || "Failed to update prices. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Blockchain Pricing Info */}
      {blockchainPricing && providerInfo && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign size={20} />
              <h2 className="text-xl font-bold">Blockchain Pricing</h2>
              <Chip color="primary" variant="flat" size="sm">
                On-chain
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="bg-info/10 p-4 rounded-lg border border-info/20">
              <div className="flex items-start gap-2">
                <Info size={20} className="text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-info mb-1">
                    Prices are stored on the blockchain
                  </p>
                  <p className="text-xs text-default-600">
                    You can update your resource prices on the blockchain. Changes
                    will require a transaction and will update your pricing
                    configuration.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {updateError && (
              <div className="bg-danger/10 p-4 rounded-lg border border-danger/20">
                <p className="text-sm text-danger">{updateError}</p>
              </div>
            )}

            {/* Success Message */}
            {updateSuccess && (
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <p className="text-sm text-success">
                  Prices updated successfully! Refreshing provider info...
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="CPU Price (per core/hour)"
                  value={editingPrices.cpu !== "" ? editingPrices.cpu : (blockchainPricing?.cpu || "")}
                  placeholder={blockchainPricing?.cpu || "0"}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    // Remove leading zeros except for decimal numbers like "0.5"
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setEditingPrices((prev) => ({ ...prev, cpu: value }));
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure valid number on blur, but allow empty for user to clear
                    const value = e.target.value.trim();
                    if (value === "") {
                      // Keep empty, will be treated as 0 when converting
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setEditingPrices((prev) => ({
                        ...prev,
                        cpu: blockchainPricing?.cpu || "",
                      }));
                    } else {
                      // Normalize the value (remove unnecessary zeros)
                      setEditingPrices((prev) => ({
                        ...prev,
                        cpu: numValue.toString(),
                      }));
                    }
                  }}
                  startContent="tokens"
                  type="text"
                  inputMode="decimal"
                  description={`Current: ${formatUnits(providerInfo.cpuPricePerSecond, 18)} tokens/sec on-chain`}
                />
              </div>

              <div>
                <Input
                  label="Memory Price (per GB/hour)"
                  value={editingPrices.memory !== "" ? editingPrices.memory : (blockchainPricing?.memory || "")}
                  placeholder={blockchainPricing?.memory || "0"}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setEditingPrices((prev) => ({
                        ...prev,
                        memory: value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure valid number on blur, but allow empty for user to clear
                    const value = e.target.value.trim();
                    if (value === "") {
                      // Keep empty, will be treated as 0 when converting
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setEditingPrices((prev) => ({
                        ...prev,
                        memory: blockchainPricing?.memory || "",
                      }));
                    } else {
                      // Normalize the value (remove unnecessary zeros)
                      setEditingPrices((prev) => ({
                        ...prev,
                        memory: numValue.toString(),
                      }));
                    }
                  }}
                  startContent="tokens"
                  type="text"
                  inputMode="decimal"
                  description={`Current: ${formatUnits(providerInfo.memoryPricePerSecond, 18)} tokens/sec on-chain`}
                />
              </div>

              <div>
                <Input
                  label="Storage Price (per GB/hour)"
                  value={editingPrices.storage !== "" ? editingPrices.storage : (blockchainPricing?.storage || "")}
                  placeholder={blockchainPricing?.storage || "0"}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setEditingPrices((prev) => ({
                        ...prev,
                        storage: value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure valid number on blur, but allow empty for user to clear
                    const value = e.target.value.trim();
                    if (value === "") {
                      // Keep empty, will be treated as 0 when converting
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setEditingPrices((prev) => ({
                        ...prev,
                        storage: blockchainPricing?.storage || "",
                      }));
                    } else {
                      // Normalize the value (remove unnecessary zeros)
                      setEditingPrices((prev) => ({
                        ...prev,
                        storage: numValue.toString(),
                      }));
                    }
                  }}
                  startContent="tokens"
                  type="text"
                  inputMode="decimal"
                  description={`Current: ${formatUnits(providerInfo.diskPricePerSecond, 18)} tokens/sec on-chain`}
                />
              </div>

              <div>
                <Input
                  label="GPU Price (per GPU/hour)"
                  value={editingPrices.gpu !== "" ? editingPrices.gpu : (blockchainPricing?.gpu || "")}
                  placeholder={blockchainPricing?.gpu || "0"}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setEditingPrices((prev) => ({ ...prev, gpu: value }));
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure valid number on blur, but allow empty for user to clear
                    const value = e.target.value.trim();
                    if (value === "") {
                      // Keep empty, will be treated as 0 when converting
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      setEditingPrices((prev) => ({
                        ...prev,
                        gpu: blockchainPricing?.gpu || "",
                      }));
                    } else {
                      // Normalize the value (remove unnecessary zeros)
                      setEditingPrices((prev) => ({
                        ...prev,
                        gpu: numValue.toString(),
                      }));
                    }
                  }}
                  startContent="tokens"
                  type="text"
                  inputMode="decimal"
                  description={`Current: ${formatUnits(providerInfo.gpuPricePerSecond, 18)} tokens/sec on-chain`}
                />
              </div>
            </div>

            {/* Required Stake Warning */}
            {newRequiredStake > currentRequiredStake && additionalStakeNeeded > BigInt(0) && (
              <Card className="bg-warning/10 border-warning/20">
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-warning mb-2">
                        Additional Stake Required
                      </h4>
                      <p className="text-sm text-default-600 mb-3">
                        Updating prices will increase the required stake. You need to approve additional tokens before updating.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-default-600">Current Stake:</span>
                          <span className="font-semibold">{formatEther(currentRequiredStake)} tokens</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-default-600">New Required Stake:</span>
                          <span className="font-semibold text-warning">{formatEther(newRequiredStake)} tokens</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-default-600">Additional Needed:</span>
                          <span className="font-semibold text-warning">{formatEther(additionalStakeNeeded)} tokens</span>
                        </div>
                        {isCalculatingStake ? (
                          <div className="flex items-center gap-2 text-sm text-default-600">
                            <Loader2 className="animate-spin" size={16} />
                            Calculating required stake...
                          </div>
                        ) : isCheckingAllowance ? (
                          <div className="flex items-center gap-2 text-sm text-default-600">
                            <Loader2 className="animate-spin" size={16} />
                            Checking token allowance...
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-600">Current Allowance:</span>
                            <span className="font-semibold">{formatEther(tokenAllowance)} tokens</span>
                          </div>
                        )}
                      </div>
                      {tokenAllowance < newRequiredStake ? (
                        <div className="space-y-2">
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
                            startContent={<Shield size={16} />}
                            className="w-full"
                          >
                            {isApproving
                              ? "Approving Tokens..."
                              : `Approve ${formatEther(newRequiredStake)} Tokens`}
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-success">
                          ✓ Token allowance is sufficient. You can proceed with updating prices.
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Update Button */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button
                variant="flat"
                startContent={<RefreshCw size={16} />}
                onPress={() => {
                  if (providerInfo && blockchainPricing) {
                    setEditingPrices({
                      cpu: blockchainPricing.cpu,
                      gpu: blockchainPricing.gpu,
                      memory: blockchainPricing.memory,
                      storage: blockchainPricing.storage,
                    });
                    setUpdateError(null);
                    setUpdateSuccess(false);
                    setNewRequiredStake(BigInt(0));
                    setAdditionalStakeNeeded(BigInt(0));
                  }
                }}
                isDisabled={!hasChanges || isUpdating || isApproving || isCalculatingStake}
              >
                Reset
              </Button>
              <Button
                color="primary"
                startContent={<Save size={16} />}
                isLoading={isUpdating || isCalculatingStake}
                isDisabled={
                  !hasChanges ||
                  isUpdating ||
                  isApproving ||
                  isCalculatingStake ||
                  (newRequiredStake > currentRequiredStake && tokenAllowance < newRequiredStake)
                }
                onPress={handleUpdatePrices}
              >
                {isUpdating ? "Updating..." : isCalculatingStake ? "Calculating..." : "Update Prices"}
              </Button>
            </div>

          </CardBody>
        </Card>
      )}

      {/* Estimated Revenue */}
      {blockchainPricing && providerInfo && (() => {
        // Calculate estimated revenue based on pricing and resources
        // Use editing prices if available and different from blockchain, otherwise use blockchain prices
        const calculateEstimatedRevenue = () => {
          // Use editing prices if they have values, otherwise fall back to blockchain prices
          const cpuPrice = parseFloat(editingPrices.cpu || blockchainPricing.cpu) || 0;
          const gpuPrice = parseFloat(editingPrices.gpu || blockchainPricing.gpu) || 0;
          const memoryPrice = parseFloat(editingPrices.memory || blockchainPricing.memory) || 0;
          const storagePrice = parseFloat(editingPrices.storage || blockchainPricing.storage) || 0;

          // Get resources from providerInfo
          // cpuCores is mCPU (bigint), convert to cores (decimal 3) by dividing by 1000
          const cpuCores = Number(providerInfo.cpuCores) / 1000;
          const gpuCores = Number(providerInfo.gpuCores) || 0;
          const memoryMB = Number(providerInfo.memoryMB) || 0;
          const diskGB = Number(providerInfo.diskGB) || 0;

          // Calculate revenue per hour (assuming 100% utilization)
          // CPU: cores (decimal 3) × price per core per hour
          // GPU: gpuCores × price per GPU per hour
          // Memory: convert MB to GB (divide by 1024), then multiply by price per GB per hour
          // Storage: diskGB × price per GB per hour
          const cpuRevenue = cpuCores * cpuPrice;
          const gpuRevenue = gpuCores * gpuPrice;
          const memoryGB = memoryMB / 1024; // Convert MB to GB
          const memoryRevenue = memoryGB * memoryPrice;
          const diskRevenue = diskGB * storagePrice;
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

        const estimatedRevenue = calculateEstimatedRevenue();

        return (
          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign size={20} />
                <h2 className="text-xl font-bold">Estimated Revenue</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Resource Configuration */}
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="font-semibold mb-2 text-success">
                  Resource Configuration
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-default-500 mb-1">CPU Cores</p>
                    <p className="text-lg font-bold text-success">
                      {(Number(providerInfo.cpuCores) / 1000).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">GPU Cores</p>
                    <p className="text-lg font-bold text-success">
                      {Number(providerInfo.gpuCores) || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Memory</p>
                    <p className="text-lg font-bold text-success">
                      {(Number(providerInfo.memoryMB) / 1024).toFixed(2)} GB
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Storage</p>
                    <p className="text-lg font-bold text-success">
                      {Number(providerInfo.diskGB)} GB
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Overview */}
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="font-semibold mb-2 text-success">
                  Pricing Overview (per hour)
                  {hasChanges && (
                    <Chip color="warning" variant="flat" size="sm" className="ml-2">
                      Preview
                    </Chip>
                  )}
                </h4>
                <p className="text-sm text-default-600 mb-4">
                  {hasChanges
                    ? "Showing estimated revenue with your new pricing (not yet saved to blockchain)."
                    : "Current blockchain pricing used for revenue calculation."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-default-500 mb-1">CPU (per core/hour)</p>
                    <p className="text-lg font-bold text-success">
                      {editingPrices.cpu || blockchainPricing.cpu} tokens
                      {hasChanges && editingPrices.cpu && editingPrices.cpu !== blockchainPricing.cpu && (
                        <span className="text-xs text-warning ml-1">
                          (was {blockchainPricing.cpu})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">GPU (per GPU/hour)</p>
                    <p className="text-lg font-bold text-success">
                      {editingPrices.gpu || blockchainPricing.gpu} tokens
                      {hasChanges && editingPrices.gpu && editingPrices.gpu !== blockchainPricing.gpu && (
                        <span className="text-xs text-warning ml-1">
                          (was {blockchainPricing.gpu})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Memory (per GB/hour)</p>
                    <p className="text-lg font-bold text-success">
                      {editingPrices.memory || blockchainPricing.memory} tokens
                      {hasChanges && editingPrices.memory && editingPrices.memory !== blockchainPricing.memory && (
                        <span className="text-xs text-warning ml-1">
                          (was {blockchainPricing.memory})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Storage (per GB/hour)</p>
                    <p className="text-lg font-bold text-success">
                      {editingPrices.storage || blockchainPricing.storage} tokens
                      {hasChanges && editingPrices.storage && editingPrices.storage !== blockchainPricing.storage && (
                        <span className="text-xs text-warning ml-1">
                          (was {blockchainPricing.storage})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estimated Revenue Calculations */}
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="font-semibold mb-2 text-success">
                  Estimated Revenue (100% Utilization)
                </h4>
                <p className="text-sm text-default-600 mb-4">
                  Based on your current resource configuration and blockchain pricing, your estimated revenue at 100% resource utilization.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-default-500 mb-1">Per Hour</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(estimatedRevenue.perHour)} tokens
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Per Day</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(estimatedRevenue.perDay)} tokens
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Per Week</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(estimatedRevenue.perWeek)} tokens
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Per Month</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(estimatedRevenue.perMonth)} tokens
                    </p>
                  </div>
                </div>
                <p className="text-xs text-default-500 mt-4 italic">
                  * Revenue estimates assume 100% resource utilization. Actual revenue may vary based on actual usage.
                </p>
              </div>
            </CardBody>
          </Card>
        );
      })()}
    </div>
  );
}
