"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
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
} from "lucide-react";

import ProviderDetailsModal from "../ProviderDetailsModal";

interface BiddingStepProps {
  isBidAccepted: boolean;
  bids: any[];
  selectedBid: string;
  isSubmitting: boolean;
  totalCpu: string;
  totalMemory: string;
  totalStorage: string;
  maxPrice: string;
  estimatedPrice: string;
  services: any[];
  selectedRegion: string;
  isEditingBidPrice: boolean;
  editedBidPrice: string;
  favouriteProviders: string[];
  validationErrors: string[];
  onRequestBids: () => void;
  onAcceptBid: () => void;
  onSelectBid: (bidId: string) => void;
  onToggleFavouriteProvider: (providerId: string) => void;
  onEditBidPrice: () => void;
  onSaveBidPrice: () => void;
  onCancelBidPriceEdit: () => void;
  onEstimatedPriceClick: () => void;
  onEditedBidPriceChange: (value: string) => void;
}

export default function BiddingStep({
  isBidAccepted: _isBidAccepted,
  bids,
  selectedBid,
  isSubmitting: _isSubmitting,
  totalCpu: _totalCpu,
  totalMemory: _totalMemory,
  totalStorage: _totalStorage,
  maxPrice: _maxPrice,
  estimatedPrice: _estimatedPrice,
  services: _services,
  selectedRegion: _selectedRegion,
  isEditingBidPrice: _isEditingBidPrice,
  editedBidPrice: _editedBidPrice,
  favouriteProviders,
  validationErrors,
  onRequestBids: _onRequestBids,
  onAcceptBid: _onAcceptBid,
  onSelectBid,
  onToggleFavouriteProvider,
  onEditBidPrice: _onEditBidPrice,
  onSaveBidPrice: _onSaveBidPrice,
  onCancelBidPriceEdit: _onCancelBidPriceEdit,
  onEstimatedPriceClick: _onEstimatedPriceClick,
  onEditedBidPriceChange: _onEditedBidPriceChange,
}: BiddingStepProps) {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (bid: any) => {
    setSelectedProvider(bid.provider);
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

      {/* Provider Bids */}
      {bids.length > 0 && (
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-success">
                Provider Bids Received
              </h2>
              <p className="text-sm text-default-600">
                Choose the best provider for your deployment
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBid === bid.id
                      ? "border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg"
                      : "border-default-200 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:shadow-md"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectBid(bid.id)}
                  onKeyDown={(e) => e.key === "Enter" && onSelectBid(bid.id)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                        {selectedBid === bid.id && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-default-900">
                          {bid.provider.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-default-600">
                          <MapPin size={12} />
                          <span>{bid.provider.region}</span>
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
                          onToggleFavouriteProvider(bid.provider.id);
                        }}
                      >
                        <Heart
                          className={
                            favouriteProviders.includes(bid.provider.id)
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
                        {bid.provider.rating}
                      </div>
                    </div>

                    <div className="bg-white/60 p-2 rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="text-green-500" size={12} />
                        <span className="text-xs text-default-600">Uptime</span>
                      </div>
                      <div className="font-bold text-sm text-green-600">
                        {bid.provider.uptime}
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
                        {bid.provider.activeDeployments || "1,247"}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-primary text-sm">
                        Price
                      </h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {bid.price} SCU/h
                        </div>
                        <div className="text-xs text-default-500">per hour</div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Trust Indicators */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Shield className="text-green-500" size={12} />
                        <span className="text-default-600">Verified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="text-blue-500" size={12} />
                        <span className="text-default-600">
                          {bid.provider.responseTime || "< 5min"}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(bid);
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
      )}

      {/* No Bids Message */}
      {bids.length === 0 && (
        <Card className="subnet-card">
          <CardBody className="text-center py-12">
            <div className="text-6xl mb-4">📡</div>
            <h3 className="text-xl font-semibold mb-2">Requesting Bids...</h3>
            <p className="text-default-600">
              We&apos;re contacting providers to get the best offers for your
              deployment.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        isOpen={isModalOpen}
        provider={selectedProvider}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
