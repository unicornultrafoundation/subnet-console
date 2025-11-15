"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  KeyRound,
  CheckCircle,
  AlertCircle,
  Save,
  Info,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import {
  updateProviderOperator,
  type UpdateOperatorParams,
  type ProviderInfo,
} from "@/lib/blockchain/provider-contract";

interface OperatorTabProps {
  providerInfo: ProviderInfo | null;
  providerAddress: string | null;
  currentOperator: string;
  onOperatorUpdate?: () => void;
}

export function OperatorTab({
  providerInfo,
  providerAddress,
  currentOperator,
  onOperatorUpdate,
}: OperatorTabProps) {
  const { address, isConnected } = useWallet();
  const [operatorAddress, setOperatorAddress] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize operator address from props
  useEffect(() => {
    if (currentOperator) {
      setOperatorAddress(currentOperator);
    } else if (providerInfo?.operator) {
      setOperatorAddress(providerInfo.operator);
    }
  }, [currentOperator, providerInfo]);

  // Validate address format
  const validateAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  // Check if operator address has changed
  const hasChanges = operatorAddress !== (providerInfo?.operator || currentOperator || "");

  // Handle update operator
  const handleUpdateOperator = async () => {
    if (!providerAddress || !isConnected || !address) {
      setUpdateError("Provider address or wallet connection is missing");
      return;
    }

    if (!operatorAddress) {
      setUpdateError("Please enter an operator address");
      return;
    }

    if (!validateAddress(operatorAddress)) {
      setUpdateError("Invalid address format. Please enter a valid blockchain address (0x...).");
      return;
    }

    // Check if address is the same as current
    if (operatorAddress.toLowerCase() === (providerInfo?.operator || currentOperator || "").toLowerCase()) {
      setUpdateError("Operator address is the same as current address");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const params: UpdateOperatorParams = {
        providerId: providerAddress,
        newOperator: operatorAddress,
      };

      console.log("=== Update Operator ===");
      console.log("Params:", params);

      const hash = await updateProviderOperator(params);
      console.log("=== Update Operator - Success ===");
      console.log("Transaction hash:", hash);

      setUpdateSuccess(true);
      
      // Refresh provider info after update
      if (onOperatorUpdate) {
        setTimeout(() => {
          onOperatorUpdate();
        }, 2000); // Wait 2 seconds for blockchain to update
      }
    } catch (err: any) {
      console.error("=== Update Operator - Error ===");
      console.error("Error updating operator:", err);
      setUpdateError(err.message || "Failed to update operator. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Current Operator Info */}
      {providerInfo && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound size={20} />
              <h2 className="text-xl font-bold">Current Operator</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="bg-info/10 p-4 rounded-lg border border-info/20">
              <div className="flex items-start gap-2">
                <Info size={20} className="text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-info mb-1">
                    Operator Address
                  </p>
                  <p className="text-xs text-default-600">
                    The operator address is used to authenticate and manage your provider&apos;s
                    nodes on the network. Only the provider owner can update this address.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Current Operator:</span>
                <span className="font-mono text-sm font-semibold">
                  {providerInfo.operator || currentOperator || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">Owner:</span>
                <span className="font-mono text-sm font-semibold">
                  {providerInfo.owner}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Update Operator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound size={20} />
            <h2 className="text-xl font-bold">Update Operator</h2>
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
                  Operator updated successfully! Refreshing provider info...
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Operator Address <span className="text-danger">*</span>
              </label>
              <Input
                className="font-mono text-sm"
                errorMessage={
                  operatorAddress.length > 0 && !validateAddress(operatorAddress)
                    ? "Invalid address format"
                    : undefined
                }
                isInvalid={
                  operatorAddress.length > 0 && !validateAddress(operatorAddress)
                }
                placeholder="0x..."
                value={operatorAddress}
                onChange={(e) => {
                  setOperatorAddress(e.target.value);
                  setUpdateError(null);
                  setUpdateSuccess(false);
                }}
                description="Enter the new operator address (0x followed by 40 hex characters)"
              />
            </div>

            {/* Warning */}
            {hasChanges && operatorAddress && validateAddress(operatorAddress) && (
              <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-warning mb-1">
                      Important: Operator Address Update
                    </p>
                    <p className="text-xs text-default-600">
                      Changing the operator address will transfer operational control to the new address.
                      Make sure you trust the new operator address and have verified it is correct.
                      This action requires a blockchain transaction and cannot be undone easily.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Update Button */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button
                variant="flat"
                onPress={() => {
                  setOperatorAddress(providerInfo?.operator || currentOperator || "");
                  setUpdateError(null);
                  setUpdateSuccess(false);
                }}
                isDisabled={!hasChanges || isUpdating}
              >
                Reset
              </Button>
              <Button
                color="primary"
                startContent={<Save size={16} />}
                isLoading={isUpdating}
                isDisabled={
                  !hasChanges ||
                  isUpdating ||
                  !operatorAddress ||
                  !validateAddress(operatorAddress) ||
                  !isConnected ||
                  !address
                }
                onPress={handleUpdateOperator}
              >
                {isUpdating ? "Updating..." : "Update Operator"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

