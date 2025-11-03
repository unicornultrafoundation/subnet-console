"use client";

import React, { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
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
  Search,
  Store,
  List,
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

interface SelectProviderStepProps {
  providers: Provider[];
  selectedProvider: string | null;
  favouriteProviders: string[];
  marketplaceProviders?: Provider[]; // Additional providers from marketplace
  validationErrors: string[];
  onSelectProvider: (providerId: string) => void;
  onToggleFavouriteProvider: (providerId: string) => void;
}

export default function SelectProviderStep({
  providers,
  selectedProvider,
  favouriteProviders,
  marketplaceProviders = [],
  validationErrors,
  onSelectProvider,
  onToggleFavouriteProvider,
}: SelectProviderStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("favourites");
  const [selectedProviderDetail, setSelectedProviderDetail] =
    useState<Provider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (provider: Provider) => {
    setSelectedProviderDetail(provider);
    setIsModalOpen(true);
  };

  // Separate providers into favourites and marketplace
  const favouriteProvidersList = useMemo(() => {
    return providers.filter((p) => favouriteProviders.includes(p.id));
  }, [providers, favouriteProviders]);

  // Combine marketplace providers with remaining non-favourite providers
  const marketplaceProvidersList = useMemo(() => {
    const nonFavourite = providers.filter(
      (p) => !favouriteProviders.includes(p.id),
    );
    // Merge with additional marketplace providers, avoiding duplicates
    const allMarketplace = [...nonFavourite, ...marketplaceProviders];
    const uniqueIds = new Set<string>();
    return allMarketplace.filter((p) => {
      if (uniqueIds.has(p.id)) return false;
      uniqueIds.add(p.id);
      return true;
    });
  }, [providers, favouriteProviders, marketplaceProviders]);

  // Filter providers based on search and selected tab
  const filteredProviders = useMemo(() => {
    const sourceList =
      selectedTab === "favourites"
        ? favouriteProvidersList
        : marketplaceProvidersList;

    if (!searchQuery.trim()) {
      return sourceList;
    }

    const query = searchQuery.toLowerCase();
    return sourceList.filter(
      (provider) =>
        provider.name.toLowerCase().includes(query) ||
        provider.region.toLowerCase().includes(query),
    );
  }, [selectedTab, favouriteProvidersList, marketplaceProvidersList, searchQuery]);

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
      <Card className="border-primary/20 bg-primary/5">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <List className="text-primary" size={20} />
            <div>
              <h3 className="font-semibold text-primary">
                Select a Provider
              </h3>
              <p className="text-sm text-default-600 mt-1">
                Browse and choose a specific provider for your deployment. Review
                their capabilities, pricing, and features before making your
                selection.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs and Search */}
      <Card className="subnet-card">
        <CardBody className="p-4 space-y-4">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            classNames={{
              tabList: "w-full",
              cursor: "bg-primary",
              tab: "max-w-fit",
            }}
          >
            <Tab
              key="favourites"
              title={
                <div className="flex items-center gap-2">
                  <Heart
                    className={
                      selectedTab === "favourites"
                        ? "text-red-500 fill-red-500"
                        : "text-default-400"
                    }
                    size={16}
                  />
                  <span>
                    Favourites ({favouriteProvidersList.length})
                  </span>
                </div>
              }
            />
            <Tab
              key="marketplace"
              title={
                <div className="flex items-center gap-2">
                  <Store
                    className={
                      selectedTab === "marketplace"
                        ? "text-primary"
                        : "text-default-400"
                    }
                    size={16}
                  />
                  <span>Marketplace ({marketplaceProvidersList.length})</span>
                </div>
              }
            />
          </Tabs>

          <Input
            placeholder="Search providers by name or region..."
            size="md"
            startContent={<Search className="text-default-400" size={16} />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            classNames={{
              input: "text-sm",
              inputWrapper: "border-default-200",
            }}
          />
        </CardBody>
      </Card>

      {/* Providers List */}
      {filteredProviders.length > 0 ? (
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {selectedTab === "favourites" ? (
                <Heart className="text-red-500 fill-red-500" size={24} />
              ) : (
                <Store className="text-primary" size={24} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-primary">
                {filteredProviders.length} Provider
                {filteredProviders.length !== 1 ? "s" : ""} Available
              </h2>
              <p className="text-sm text-default-600">
                {searchQuery
                  ? `Showing ${filteredProviders.length} provider${
                      filteredProviders.length !== 1 ? "s" : ""
                    } matching "${searchQuery}"`
                  : selectedTab === "favourites"
                    ? "Select from your favourite providers"
                    : "Browse providers from marketplace"}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedProvider === provider.id
                      ? "border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg"
                      : "border-default-200 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:shadow-md"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectProvider(provider.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectProvider(provider.id);
                    }
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
                        {selectedProvider === provider.id && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
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
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-primary text-sm">
                        Price
                      </h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
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
            {selectedTab === "favourites" && favouriteProvidersList.length === 0 ? (
              <>
                <Heart className="mx-auto mb-4 text-default-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">
                  No Favourite Providers
                </h3>
                <p className="text-default-600 mb-4">
                  You haven&apos;t added any providers to your favourites yet.
                </p>
                <p className="text-sm text-default-500">
                  Switch to Marketplace tab to browse and select providers, or
                  mark providers as favourites to see them here.
                </p>
              </>
            ) : searchQuery ? (
              <>
                <Search className="mx-auto mb-4 text-default-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">
                  No Providers Found
                </h3>
                <p className="text-default-600 mb-4">
                  No providers match your search query &quot;{searchQuery}&quot;.
                </p>
                <p className="text-sm text-default-500">
                  Try a different search term or clear the search to see all
                  providers.
                </p>
              </>
            ) : (
              <>
                <Store className="mx-auto mb-4 text-default-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">
                  No Providers Available
                </h3>
                <p className="text-default-600 mb-4">
                  There are no providers available in the marketplace at this
                  time.
                </p>
              </>
            )}
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

