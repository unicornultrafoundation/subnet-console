"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Info, KeyRound, CheckCircle, AlertCircle } from "lucide-react";

import { ProviderConfig } from "./types";

interface GeneralTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  validateAddress: (address: string) => boolean;
  isVerifying: boolean;
  handleVerifyOperatorAddress: () => void;
}

export function GeneralTab({
  config,
  updateConfig,
  validateAddress,
  isVerifying,
  handleVerifyOperatorAddress,
}: GeneralTabProps) {
  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info size={20} />
          <h2 className="text-xl font-bold">Provider Information</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Operator Address Section */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <KeyRound className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Operator Address</h3>
              <p className="text-sm text-default-600 mb-4">
                The operator address is required to operate nodes. This address
                will be used to authenticate and manage your provider&apos;s
                nodes on the network.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Operator Address <span className="text-danger">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      className="flex-1 font-mono text-sm"
                      errorMessage={
                        config.operatorAddress.length > 0 &&
                        !validateAddress(config.operatorAddress)
                          ? "Invalid address format"
                          : undefined
                      }
                      isInvalid={
                        config.operatorAddress.length > 0 &&
                        !validateAddress(config.operatorAddress)
                      }
                      placeholder="0x..."
                      value={config.operatorAddress}
                      onChange={(e) => {
                        updateConfig("operatorAddress", e.target.value);
                        // Reset verification status if address changes
                        if (config.operatorAddressVerified) {
                          updateConfig("operatorAddressVerified", false);
                        }
                      }}
                    />
                    <Button
                      color="primary"
                      isDisabled={
                        !config.operatorAddress ||
                        !validateAddress(config.operatorAddress) ||
                        config.operatorAddressVerified
                      }
                      isLoading={isVerifying}
                      variant="flat"
                      onPress={handleVerifyOperatorAddress}
                    >
                      {config.operatorAddressVerified ? (
                        <>
                          <CheckCircle size={16} />
                          Verified
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>

                  {config.operatorAddressVerified && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-success">
                      <CheckCircle size={16} />
                      <span>Operator address verified and active</span>
                    </div>
                  )}

                  {config.operatorAddress &&
                    !config.operatorAddressVerified && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-warning">
                        <AlertCircle size={16} />
                        <span>
                          Operator address must be verified to operate nodes
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Basic Info */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Provider Name
          </label>
          <Input
            placeholder="Enter provider name"
            value={config.name}
            onChange={(e) => updateConfig("name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter provider description"
            value={config.description}
            onChange={(e) => updateConfig("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <Input
              placeholder="Country"
              value={config.location.country}
              onChange={(e) => updateConfig("location.country", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <Input
              placeholder="Region"
              value={config.location.region}
              onChange={(e) => updateConfig("location.region", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Input
              placeholder="City"
              value={config.location.city}
              onChange={(e) => updateConfig("location.city", e.target.value)}
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
              value={config.contact.email}
              onChange={(e) => updateConfig("contact.email", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Website (Optional)
            </label>
            <Input
              placeholder="https://example.com"
              value={config.contact.website || ""}
              onChange={(e) => updateConfig("contact.website", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specialties</label>
          <div className="flex flex-wrap gap-2">
            {config.specialties.map((specialty, index) => (
              <Chip
                key={index}
                color="primary"
                variant="flat"
                onClose={() => {
                  const newSpecialties = config.specialties.filter(
                    (_, i) => i !== index,
                  );

                  updateConfig("specialties", newSpecialties);
                }}
              >
                {specialty}
              </Chip>
            ))}
          </div>
          <Input
            className="mt-2"
            placeholder="Add specialty and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                updateConfig("specialties", [
                  ...config.specialties,
                  e.currentTarget.value,
                ]);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
}
