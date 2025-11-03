"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { DollarSign, CheckCircle, ArrowRight, Info, List } from "lucide-react";

interface MethodSelectionStepProps {
  selectedMethod: "bidding" | "direct-accept" | "select-provider" | null;
  onSelectMethod: (method: "bidding" | "direct-accept" | "select-provider") => void;
  maxPrice: string;
  totalCpu: string;
  totalMemory: string;
  totalStorage: string;
}

export default function MethodSelectionStep({
  selectedMethod,
  onSelectMethod,
  maxPrice,
  totalCpu,
  totalMemory,
  totalStorage,
}: MethodSelectionStepProps) {
  return (
    <div className="space-y-6">
      <Card className="subnet-card">
        <CardHeader className="flex items-center gap-2">
          <Info className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">Choose Deployment Method</h2>
        </CardHeader>
        <CardBody>
          <p className="text-default-600 mb-6">
            Select how you want to find a provider for your deployment. Choose
            the method that best fits your needs.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bidding Method */}
            <div
              className={`cursor-pointer transition-all rounded-xl ${
                selectedMethod === "bidding"
                  ? "border-2 border-primary bg-primary/5 shadow-lg"
                  : "border border-default-200 hover:border-primary/50 hover:shadow-md"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectMethod("bidding")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectMethod("bidding");
                }
              }}
            >
              <Card className="border-none shadow-none bg-transparent">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        selectedMethod === "bidding"
                          ? "bg-primary/20"
                          : "bg-default-100"
                      }`}
                    >
                      <DollarSign
                        className={
                          selectedMethod === "bidding" ? "text-primary" : "text-default-600"
                        }
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Bidding</h3>
                      <p className="text-sm text-default-600">Request competitive bids</p>
                    </div>
                  </div>
                  {selectedMethod === "bidding" && (
                    <CheckCircle className="text-primary" size={24} />
                  )}
                </div>

                <div className="space-y-2 text-sm text-default-600 mb-4">
                  <p>• Providers submit competitive bids</p>
                  <p>• Compare multiple offers</p>
                  <p>• Choose the best price/quality ratio</p>
                  <p>• Typically takes 2-5 minutes</p>
                </div>

                <div className="pt-4 border-t border-default-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-default-500">
                      Max Price: {maxPrice} SCU/h
                    </span>
                    <ArrowRight
                      className={
                        selectedMethod === "bidding" ? "text-primary" : "text-default-400"
                      }
                      size={16}
                    />
                  </div>
                </div>
              </CardBody>
              </Card>
            </div>

            {/* Direct Accept Method */}
            <div
              className={`cursor-pointer transition-all rounded-xl ${
                selectedMethod === "direct-accept"
                  ? "border-2 border-primary bg-primary/5 shadow-lg"
                  : "border border-default-200 hover:border-primary/50 hover:shadow-md"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectMethod("direct-accept")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectMethod("direct-accept");
                }
              }}
            >
              <Card className="border-none shadow-none bg-transparent">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        selectedMethod === "direct-accept"
                          ? "bg-success/20"
                          : "bg-default-100"
                      }`}
                    >
                      <CheckCircle
                        className={
                          selectedMethod === "direct-accept"
                            ? "text-success"
                            : "text-default-600"
                        }
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Direct Accept</h3>
                      <p className="text-sm text-default-600">Send order to eligible providers</p>
                    </div>
                  </div>
                  {selectedMethod === "direct-accept" && (
                    <CheckCircle className="text-success" size={24} />
                  )}
                </div>

                <div className="space-y-2 text-sm text-default-600 mb-4">
                  <p>• Send deployment order to providers that meet your requirements</p>
                  <p>• Providers can review and accept your order</p>
                  <p>• Multiple providers can accept simultaneously</p>
                  <p>• Faster than bidding - typically 1-3 minutes</p>
                </div>

                <div className="pt-4 border-t border-default-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-default-500">
                      Resources: {totalCpu} CPU / {totalMemory}GB / {totalStorage}GB
                    </span>
                    <ArrowRight
                      className={
                        selectedMethod === "direct-accept"
                          ? "text-success"
                          : "text-default-400"
                      }
                      size={16}
                    />
                  </div>
                </div>
              </CardBody>
              </Card>
            </div>

            {/* Select Provider Method */}
            <div
              className={`cursor-pointer transition-all rounded-xl ${
                selectedMethod === "select-provider"
                  ? "border-2 border-primary bg-primary/5 shadow-lg"
                  : "border border-default-200 hover:border-primary/50 hover:shadow-md"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectMethod("select-provider")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectMethod("select-provider");
                }
              }}
            >
              <Card className="border-none shadow-none bg-transparent">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        selectedMethod === "select-provider"
                          ? "bg-primary/20"
                          : "bg-default-100"
                      }`}
                    >
                      <List
                        className={
                          selectedMethod === "select-provider"
                            ? "text-primary"
                            : "text-default-600"
                        }
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Select Provider</h3>
                      <p className="text-sm text-default-600">
                        Choose a specific provider
                      </p>
                    </div>
                  </div>
                  {selectedMethod === "select-provider" && (
                    <CheckCircle className="text-primary" size={24} />
                  )}
                </div>

                <div className="space-y-2 text-sm text-default-600 mb-4">
                  <p>• Browse available providers</p>
                  <p>• Select provider manually</p>
                  <p>• Review provider details</p>
                  <p>• Direct deployment option</p>
                </div>

                <div className="pt-4 border-t border-default-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-default-500">
                      Choose from all providers
                    </span>
                    <ArrowRight
                      className={
                        selectedMethod === "select-provider"
                          ? "text-primary"
                          : "text-default-400"
                      }
                      size={16}
                    />
                  </div>
                </div>
              </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

