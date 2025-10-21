"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import {
  Star,
  MapPin,
  Server,
  Shield,
  Award,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Zap,
  Globe,
  Bot,
  Code,
  Database,
  Activity,
  BarChart3,
} from "lucide-react";

import { Provider } from "@/components/marketplace/types";
import { FiltersSection } from "@/components/marketplace/filters-section";

export default function ProvidersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    region: "all",
    resource: "all",
    gpuModel: "all",
    sortBy: "reputation",
    priceRange: "all",
    uptime: "all",
  });

  // Mock data
  const providers: Provider[] = [
    {
      id: "1",
      name: "Quantum Computing Solutions",
      location: "San Francisco, CA",
      region: "north-america",
      uptime: 99.8,
      reputation: 4.9,
      nodesCount: 150,
      totalDeployments: 1250,
      featured: true,
      verified: true,
      specialties: ["AI/ML", "Quantum Computing", "High Performance Computing"],
      pricing: {
        min: 0.15,
        max: 2.5,
        average: 0.8,
        cpu: 0.05,
        memory: 0.02,
        storage: 0.01,
        gpu: 0.25,
        gpuTypes: ["RTX 4090"],
      },
      resources: {
        cpu: { cores: 32, threads: 64 },
        memory: { total: 128, available: 64 },
        storage: { total: 2000, available: 1000 },
        gpu: { count: 8, types: ["RTX 4090"], vram: [24], available: 4 },
        network: { bandwidth: 1000, latency: 5 },
      },
      responseTime: "< 1ms",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "CloudTech Infrastructure",
      location: "New York, NY",
      region: "north-america",
      uptime: 99.5,
      reputation: 4.7,
      nodesCount: 200,
      totalDeployments: 2100,
      featured: false,
      verified: true,
      specialties: ["Web Hosting", "Database Management", "CDN"],
      pricing: {
        min: 0.12,
        max: 2.0,
        average: 0.6,
        cpu: 0.04,
        memory: 0.015,
        storage: 0.008,
        gpu: 0.2,
        gpuTypes: ["RTX 4080"],
      },
      resources: {
        cpu: { cores: 24, threads: 48 },
        memory: { total: 96, available: 48 },
        storage: { total: 1500, available: 750 },
        gpu: { count: 4, types: ["RTX 4080"], vram: [16], available: 2 },
        network: { bandwidth: 800, latency: 8 },
      },
      responseTime: "< 2ms",
      lastActive: "5 minutes ago",
    },
    {
      id: "3",
      name: "Edge Computing Network",
      location: "London, UK",
      region: "europe",
      uptime: 99.2,
      reputation: 4.6,
      nodesCount: 75,
      totalDeployments: 890,
      featured: true,
      verified: false,
      specialties: ["Edge Computing", "IoT", "Real-time Processing"],
      pricing: {
        min: 0.18,
        max: 3.0,
        average: 1.2,
        cpu: 0.06,
        memory: 0.025,
        storage: 0.012,
        gpu: 0.3,
        gpuTypes: ["RTX 4070"],
      },
      resources: {
        cpu: { cores: 16, threads: 32 },
        memory: { total: 64, available: 32 },
        storage: { total: 1000, available: 500 },
        gpu: { count: 2, types: ["RTX 4070"], vram: [12], available: 1 },
        network: { bandwidth: 600, latency: 12 },
      },
      responseTime: "< 3ms",
      lastActive: "1 minute ago",
    },
    {
      id: "4",
      name: "Blockchain Infrastructure",
      location: "Singapore",
      region: "asia",
      uptime: 98.9,
      reputation: 4.5,
      nodesCount: 120,
      totalDeployments: 1560,
      featured: false,
      verified: true,
      specialties: ["Blockchain", "DeFi", "Smart Contracts"],
      pricing: {
        min: 0.14,
        max: 2.2,
        average: 0.9,
        cpu: 0.045,
        memory: 0.018,
        storage: 0.009,
        gpu: 0.22,
        gpuTypes: ["RTX 4090"],
      },
      resources: {
        cpu: { cores: 20, threads: 40 },
        memory: { total: 80, available: 40 },
        storage: { total: 1200, available: 600 },
        gpu: { count: 6, types: ["RTX 4090"], vram: [24], available: 3 },
        network: { bandwidth: 900, latency: 6 },
      },
      responseTime: "< 2ms",
      lastActive: "3 minutes ago",
    },
    {
      id: "5",
      name: "Data Analytics Hub",
      location: "Tokyo, Japan",
      region: "asia",
      uptime: 99.1,
      reputation: 4.8,
      nodesCount: 90,
      totalDeployments: 980,
      featured: true,
      verified: true,
      specialties: ["Data Analytics", "Machine Learning", "Big Data"],
      pricing: {
        min: 0.16,
        max: 2.8,
        average: 1.1,
        cpu: 0.055,
        memory: 0.022,
        storage: 0.011,
        gpu: 0.28,
        gpuTypes: ["RTX 4090"],
      },
      resources: {
        cpu: { cores: 28, threads: 56 },
        memory: { total: 112, available: 56 },
        storage: { total: 1800, available: 900 },
        gpu: { count: 10, types: ["RTX 4090"], vram: [24], available: 5 },
        network: { bandwidth: 1200, latency: 4 },
      },
      responseTime: "< 1ms",
      lastActive: "1 minute ago",
    },
  ];

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "ai-ml", label: "AI/ML" },
    { key: "web-hosting", label: "Web Hosting" },
    { key: "blockchain", label: "Blockchain" },
    { key: "edge-computing", label: "Edge Computing" },
    { key: "data-analytics", label: "Data Analytics" },
  ];

  const regions = [
    { key: "all", label: "All Regions" },
    { key: "north-america", label: "North America" },
    { key: "europe", label: "Europe" },
    { key: "asia", label: "Asia" },
    { key: "oceania", label: "Oceania" },
  ];

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: { [key: string]: any } = {
      all: <Globe size={16} />,
      "ai-ml": <Bot size={16} />,
      "web-hosting": <Code size={16} />,
      blockchain: <Database size={16} />,
      "edge-computing": <Zap size={16} />,
      "data-analytics": <BarChart3 size={16} />,
    };

    return iconMap[categoryId] || <Globe size={16} />;
  };

  const getRegionIcon = (_regionId: string) => {
    return <MapPin size={16} />;
  };

  // Filter and sort providers
  const filteredProviders = providers
    .filter((provider) => {
      if (
        filters.search &&
        !provider.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category !== "all") {
        // Simple category matching - in real app, this would be more sophisticated
        return true;
      }
      if (filters.region !== "all") {
        // Simple region matching - in real app, this would be more sophisticated
        return true;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.pricing.min - b.pricing.min;
        case "uptime":
          return b.uptime - a.uptime;
        case "reputation":
          return b.reputation - a.reputation;
        default:
          return b.reputation - a.reputation;
      }
    });

  const handleProviderClick = (provider: Provider) => {
    router.push(`/providers/${provider.id}`);
  };

  const ProviderCard = ({ provider }: { provider: Provider }) => (
    <Card
      className="subnet-card hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => handleProviderClick(provider)}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Server className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark-on-white">
                {provider.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-dark-on-white-muted">
                <MapPin size={14} />
                <span>{provider.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {provider.featured && (
              <Chip
                color="warning"
                size="sm"
                startContent={<Star size={12} />}
                variant="flat"
              >
                Featured
              </Chip>
            )}
            {provider.verified && (
              <Chip
                color="success"
                size="sm"
                startContent={<Shield size={12} />}
                variant="flat"
              >
                Verified
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <div className="text-2xl font-bold text-primary">
              {provider.nodesCount}
            </div>
            <div className="text-xs text-default-600">Nodes</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/5">
            <div className="text-2xl font-bold text-secondary">
              {provider.uptime}%
            </div>
            <div className="text-xs text-default-600">Uptime</div>
          </div>
        </div>

        {/* Resource Pricing & Availability */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-sm text-default-600 mb-1">Starting from</div>
            <div className="text-xl font-bold text-primary">
              ${provider.pricing.min}/hr
            </div>
          </div>

          <div className="space-y-2">
            {/* CPU */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Database className="text-primary" size={14} />
                <span className="text-default-600">CPU</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">
                  ${provider.pricing.cpu}/hr
                </div>
                <div className="text-xs text-default-500">
                  {provider.resources.cpu.cores} cores
                </div>
              </div>
            </div>

            {/* Memory */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Activity className="text-secondary" size={14} />
                <span className="text-default-600">Memory</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-secondary">
                  ${provider.pricing.memory}/hr
                </div>
                <div className="text-xs text-default-500">
                  {provider.resources.memory.available}GB available
                </div>
              </div>
            </div>

            {/* Storage */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Server className="text-warning" size={14} />
                <span className="text-default-600">Storage</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-warning">
                  ${provider.pricing.storage}/hr
                </div>
                <div className="text-xs text-default-500">
                  {provider.resources.storage.available}GB available
                </div>
              </div>
            </div>

            {/* GPU */}
            {provider.resources.gpu && provider.resources.gpu.available > 0 && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="text-danger" size={14} />
                  <span className="text-default-600">GPU</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-danger">
                    ${provider.pricing.gpu}/hr
                  </div>
                  <div className="text-xs text-default-500">
                    {provider.resources.gpu.available} units available
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-default-700">
            Specialties
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.specialties.slice(0, 3).map((specialty, index) => (
              <Chip key={index} color="primary" size="sm" variant="flat">
                {specialty}
              </Chip>
            ))}
            {provider.specialties.length > 3 && (
              <Chip color="default" size="sm" variant="flat">
                +{provider.specialties.length - 3}
              </Chip>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          color="primary"
          size="sm"
          onClick={() => handleProviderClick(provider)}
        >
          View Details
          <ChevronRight size={16} />
        </Button>
      </CardBody>
    </Card>
  );

  const ProviderListItem = ({ provider }: { provider: Provider }) => (
    <Card
      className="subnet-card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => handleProviderClick(provider)}
    >
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Server className="text-primary" size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-dark-on-white">
                  {provider.name}
                </h3>
                {provider.featured && (
                  <Chip
                    color="warning"
                    size="sm"
                    startContent={<Star size={12} />}
                    variant="flat"
                  >
                    Featured
                  </Chip>
                )}
                {provider.verified && (
                  <Chip
                    color="success"
                    size="sm"
                    startContent={<Shield size={12} />}
                    variant="flat"
                  >
                    Verified
                  </Chip>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-dark-on-white-muted mb-3">
                <MapPin size={14} />
                <span>{provider.location}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Server className="text-primary" size={14} />
                  <span>{provider.nodesCount} nodes</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="text-secondary" size={14} />
                  <span>{provider.uptime}% uptime</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="text-warning" size={14} />
                  <span>{provider.reputation}/5 rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Resource Pricing */}
            <div className="text-center min-w-[120px]">
              <div className="text-lg font-bold text-primary">
                ${provider.pricing.min}/hr
              </div>
              <div className="text-xs text-default-600 space-y-1">
                <div>CPU: ${provider.pricing.cpu}/hr</div>
                <div>RAM: ${provider.pricing.memory}/hr</div>
                {provider.resources.gpu &&
                  provider.resources.gpu.available > 0 && (
                    <div>GPU: ${provider.pricing.gpu}/hr</div>
                  )}
              </div>
            </div>

            {/* Resource Availability */}
            <div className="text-center min-w-[100px]">
              <div className="text-sm font-semibold text-success">
                Available
              </div>
              <div className="text-xs text-default-600 space-y-1">
                <div>{provider.resources.memory.available}GB RAM</div>
                <div>{provider.resources.storage.available}GB Storage</div>
                {provider.resources.gpu &&
                  provider.resources.gpu.available > 0 && (
                    <div>{provider.resources.gpu.available} GPU</div>
                  )}
              </div>
            </div>

            {/* Action */}
            <Button
              color="primary"
              size="sm"
              onClick={() => handleProviderClick(provider)}
            >
              View Details
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative">
          <div className="mb-8">
            <Button
              as={Link}
              className="text-default-600 hover:text-primary"
              href="/marketplace"
              startContent={<ArrowRight className="rotate-180" size={16} />}
              variant="light"
            >
              Back to Marketplace
            </Button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-dark-on-white mb-6">
              Subnet Providers
            </h1>
            <p className="text-xl text-dark-on-white-muted mb-8">
              Discover and connect with verified subnet providers offering
              compute resources, storage, and specialized services.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {providers.length}
                </div>
                <div className="text-sm text-default-600">Total Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">
                  {providers.filter((p) => p.verified).length}
                </div>
                <div className="text-sm text-default-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">
                  {providers.filter((p) => p.featured).length}
                </div>
                <div className="text-sm text-default-600">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">
                  {(
                    providers.reduce((sum, p) => sum + p.uptime, 0) /
                    providers.length
                  ).toFixed(2)}
                  %
                </div>
                <div className="text-sm text-default-600">Avg Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <FiltersSection
            categories={categories}
            filters={filters}
            getCategoryIcon={getCategoryIcon}
            getRegionIcon={getRegionIcon}
            regions={regions}
            resultsCount={filteredProviders.length}
            viewMode={viewMode}
            onFiltersChange={setFilters}
            onViewModeChange={setViewMode}
          />
        </div>
      </section>

      {/* Providers Grid/List */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-default-600 mb-2">
                No providers found
              </h3>
              <p className="text-default-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <ProviderListItem key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
