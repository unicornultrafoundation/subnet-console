"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  CheckCircle,
  AlertCircle,
  Heart,
  MapPin,
  Users,
  Activity,
  Shield,
  Clock,
  Eye,
  Star,
  Zap,
} from "lucide-react";

import ProviderDetailsModal from "../ProviderDetailsModal";

interface Provider {
  id: string;
  name: string;
  region: string;
  rating: number;
  uptime: string;
  activeDeployments: string;
  capacity: string;
  responseTime: string;
  successRate: string;
  features: string[];
  availableResources: {
    cpu: number;
    memory: number;
    storage: number;
    gpu: number;
  };
  cpuUtilization: string;
  memoryUtilization: string;
  storageUtilization: string;
  gpuUtilization: string;
  price: string; // SCU/hour
}

interface DirectAcceptStepProps {
  providers: Provider[];
  favouriteProviders: string[];
  validationErrors: string[];
  onToggleFavouriteProvider: (providerId: string) => void;
}

export default function DirectAcceptStep({
  providers,
  favouriteProviders,
  validationErrors,
  onToggleFavouriteProvider,
}: DirectAcceptStepProps) {
  const [selectedProviderDetail, setSelectedProviderDetail] =
    useState<Provider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (provider: Provider) => {
    setSelectedProviderDetail(provider);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-danger" size={20} />
              <h3 className="font-semibold text-danger">
                Please fix the following errors:
              </h3>
            </div>
            <ul className="mt-2 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-danger-600">
                  • {error}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {/* Info Banner */}
      <Card className="border-success/20 bg-success/5">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="text-success" size={20} />
            <div>
              <h3 className="font-semibold text-success">
                Direct Accept - Order Submission
              </h3>
              <p className="text-sm text-default-600 mt-1">
                Your deployment order will be sent to all providers listed below that meet your resource requirements and price constraints. 
                These providers will review your order and can choose to accept it. You&apos;ll receive notifications when providers accept or decline.
                Multiple providers can accept your order simultaneously, allowing for redundancy and load distribution.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Providers List */}
      {providers.length > 0 ? (
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-success">
                {providers.length} Provider{providers.length !== 1 ? "s" : ""}{" "}
                Eligible for Your Order
              </h2>
              <p className="text-sm text-default-600">
                {providers.length > 3
                  ? `Showing 3 of ${providers.length} providers. Your order will be sent to all ${providers.length} providers that meet your requirements. Each provider can independently accept or decline.`
                  : `Your order will be sent to all ${providers.length} provider${providers.length !== 1 ? "s" : ""} listed below. Each provider can independently accept or decline your deployment order.`}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {providers.slice(0, 3).map((provider) => (
                <div
                  key={provider.id}
                  className="p-4 rounded-xl border-2 border-success/30 bg-success/5 transition-all hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle className="text-success" size={16} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-default-900">
                          {provider.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-default-600">
                          <MapPin size={12} />
                          <span>{provider.region}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavouriteProvider(provider.id);
                        }}
                      >
                        <Heart
                          className={
                            favouriteProviders.includes(provider.id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }
                          size={16}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Compact Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/60 p-2 rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="text-yellow-500" size={12} />
                        <span className="text-xs text-default-600">Rating</span>
                      </div>
                      <div className="font-bold text-sm text-yellow-600">
                        {provider.rating}
                      </div>
                    </div>

                    <div className="bg-white/60 p-2 rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="text-green-500" size={12} />
                        <span className="text-xs text-default-600">Uptime</span>
                      </div>
                      <div className="font-bold text-sm text-green-600">
                        {provider.uptime}
                      </div>
                    </div>

                    <div className="bg-white/60 p-2 rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="text-blue-500" size={12} />
                        <span className="text-xs text-default-600">
                          Deployments
                        </span>
                      </div>
                      <div className="font-bold text-sm text-blue-600">
                        {provider.activeDeployments}
                      </div>
                    </div>
                  </div>

                  {/* Resource Availability */}
                  <div className="bg-default-50 p-2 rounded mb-3">
                    <div className="text-xs text-default-600 mb-1">
                      Available Resources
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-default-500">CPU:</span>{" "}
                        <span className="font-semibold">
                          {provider.availableResources.cpu}
                        </span>
                      </div>
                      <div>
                        <span className="text-default-500">RAM:</span>{" "}
                        <span className="font-semibold">
                          {provider.availableResources.memory}GB
                        </span>
                      </div>
                      <div>
                        <span className="text-default-500">Storage:</span>{" "}
                        <span className="font-semibold">
                          {provider.availableResources.storage}TB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-success/10 to-success/5 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-success text-sm">
                        Price
                      </h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-success">
                          {provider.price} SCU/h
                        </div>
                        <div className="text-xs text-default-500">per hour</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {provider.features && provider.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.features.slice(0, 3).map((feature, idx) => (
                        <Chip key={idx} size="sm" variant="flat" color="default">
                          {feature}
                        </Chip>
                      ))}
                      {provider.features.length > 3 && (
                        <Chip size="sm" variant="flat" color="default">
                          +{provider.features.length - 3}
                        </Chip>
                      )}
                    </div>
                  )}

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Shield className="text-green-500" size={12} />
                        <span className="text-default-600">Verified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="text-blue-500" size={12} />
                        <span className="text-default-600">
                          {provider.responseTime}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(provider);
                      }}
                    >
                      <Eye size={14} />
                      <span className="ml-1 text-xs">Details</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="subnet-card">
          <CardBody className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-default-400" size={48} />
            <h3 className="text-xl font-semibold mb-2">
              No Providers Available
            </h3>
            <p className="text-default-600 mb-4">
              There are no providers that currently meet your resource
              requirements or price constraints.
            </p>
            <p className="text-sm text-default-500">
              Try adjusting your requirements or use the Bidding method to
              request bids from providers.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        isOpen={isModalOpen}
        provider={selectedProviderDetail}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

