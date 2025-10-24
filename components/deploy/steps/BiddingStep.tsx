"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Heart,
  MapPin,
  Users,
  Server,
  Activity,
  Shield,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";

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
  isBidAccepted,
  bids,
  selectedBid,
  isSubmitting,
  totalCpu,
  totalMemory,
  totalStorage,
  maxPrice,
  estimatedPrice,
  services,
  selectedRegion,
  isEditingBidPrice,
  editedBidPrice,
  favouriteProviders,
  validationErrors,
  onRequestBids,
  onAcceptBid,
  onSelectBid,
  onToggleFavouriteProvider,
  onEditBidPrice,
  onSaveBidPrice,
  onCancelBidPriceEdit,
  onEstimatedPriceClick,
  onEditedBidPriceChange
}: BiddingStepProps) {
  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-danger" size={20} />
              <h3 className="font-semibold text-danger">Please fix the following errors:</h3>
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
            <div className="space-y-6">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBid === bid.id
                      ? "border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg"
                      : "border-default-200 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:shadow-md"
                  }`}
                  onClick={() => onSelectBid(bid.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {selectedBid === bid.id && (
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-default-900 mb-1">
                          {bid.provider.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-default-600">
                          <MapPin size={14} />
                          <span>{bid.provider.region}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavouriteProvider(bid.provider.id);
                        }}
                      >
                        <Heart 
                          size={18} 
                          className={favouriteProviders.includes(bid.provider.id) ? "text-red-500 fill-red-500" : "text-gray-400"}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Provider Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white/60 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="text-green-500" size={16} />
                        <span className="text-xs text-default-600">Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="font-bold text-lg">{bid.provider.rating}</span>
                        <span className="text-xs text-default-500">/5.0</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/60 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="text-green-500" size={16} />
                        <span className="text-xs text-default-600">Uptime</span>
                      </div>
                      <div className="font-bold text-lg text-green-600">
                        {bid.provider.uptime}
                      </div>
                    </div>
                    
                    <div className="bg-white/60 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="text-blue-500" size={16} />
                        <span className="text-xs text-default-600">Deployments</span>
                      </div>
                      <div className="font-bold text-lg text-blue-600">
                        {bid.provider.activeDeployments || "1,247"}
                      </div>
                    </div>
                    
                    <div className="bg-white/60 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Server className="text-purple-500" size={16} />
                        <span className="text-xs text-default-600">Capacity</span>
                      </div>
                      <div className="font-bold text-lg text-purple-600">
                        {bid.provider.capacity || "87%"}
                      </div>
                    </div>
                  </div>

                  {/* Price & Resources */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-primary">Deployment Offer</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {bid.price} SCU/h
                        </div>
                        <div className="text-xs text-default-500">per hour</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/50 p-2 rounded text-center">
                        <div className="text-xs text-default-600">CPU</div>
                        <div className="font-semibold text-primary">
                          {bid.specs.cpu} cores
                        </div>
                      </div>
                      <div className="bg-white/50 p-2 rounded text-center">
                        <div className="text-xs text-default-600">Memory</div>
                        <div className="font-semibold text-primary">
                          {bid.specs.memory}
                        </div>
                      </div>
                      <div className="bg-white/50 p-2 rounded text-center">
                        <div className="text-xs text-default-600">Storage</div>
                        <div className="font-semibold text-primary">
                          {bid.specs.storage}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Provider Features & Trust Indicators */}
                  <div className="space-y-3">
                    {/* Features */}
                    {bid.provider.features && bid.provider.features.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="text-yellow-500" size={16} />
                          <span className="text-sm font-medium text-default-700">Features</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {bid.provider.features.map((feature: string, index: number) => (
                            <Chip
                              key={index}
                              color="default"
                              size="sm"
                              variant="flat"
                              className="bg-white/60"
                            >
                              {feature}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Shield className="text-green-500" size={14} />
                        <span className="text-default-600">Verified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="text-blue-500" size={14} />
                        <span className="text-default-600">Response: {bid.provider.responseTime || "< 5min"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="text-green-500" size={14} />
                        <span className="text-default-600">{bid.provider.successRate || "99.2%"} Success</span>
                      </div>
                    </div>
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
              We're contacting providers to get the best offers for your deployment.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}