"use client";

import { useState } from "react";
import {
  Bot,
  Code,
  Database,
  Shield,
  Globe,
  Zap,
  Activity,
  Clock,
  Server,
  MapPin,
} from "lucide-react";

import HeroSection from "@/components/marketplace/hero-section";
import { FiltersSection } from "@/components/marketplace/filters-section";
import FeaturedProvidersSection from "@/components/marketplace/featured-providers-section";
import AllProvidersSection from "@/components/marketplace/all-providers-section";
import ApplicationsSection from "@/components/marketplace/applications-section";
import CTASection from "@/components/marketplace/cta-section";
import { Provider, App, Stats } from "@/components/marketplace/types";

export default function MarketplacePage() {
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "AI/ML", label: "AI/ML" },
    { key: "Web Apps", label: "Web Apps" },
    { key: "Databases", label: "Databases" },
    { key: "Blockchain", label: "Blockchain" },
    { key: "Web3", label: "Web3" },
    { key: "Edge Computing", label: "Edge Computing" },
    { key: "IoT", label: "IoT" },
    { key: "Real-time", label: "Real-time" },
  ];

  const regions = [
    { key: "all", label: "All Regions" },
    { key: "Asia Pacific", label: "Asia Pacific" },
    { key: "Europe", label: "Europe" },
    { key: "North America", label: "North America" },
    { key: "South America", label: "South America" },
    { key: "Africa", label: "Africa" },
    { key: "Middle East", label: "Middle East" },
  ];

  const getCategoryIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case "AI/ML":
        return <Bot size={14} />;
      case "Web Apps":
        return <Code size={14} />;
      case "Databases":
        return <Database size={14} />;
      case "Blockchain":
        return <Shield size={14} />;
      case "Web3":
        return <Globe size={14} />;
      case "Edge Computing":
        return <Zap size={14} />;
      case "IoT":
        return <Activity size={14} />;
      case "Real-time":
        return <Clock size={14} />;
      default:
        return <Server size={14} />;
    }
  };

  const getRegionIcon = (regionKey: string) => {
    switch (regionKey) {
      case "Asia Pacific":
        return <Globe size={14} />;
      case "Europe":
        return <MapPin size={14} />;
      case "North America":
        return <MapPin size={14} />;
      case "South America":
        return <MapPin size={14} />;
      case "Africa":
        return <MapPin size={14} />;
      case "Middle East":
        return <MapPin size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  const providers: Provider[] = [
    {
      id: "1",
      name: "CloudTech Solutions",
      location: "Singapore",
      region: "Asia Pacific",
      nodesCount: 15,
      uptime: 99.9,
      reputation: 4.8,
      pricing: {
        min: 0.1,
        max: 2.5,
        average: 0.8,
        cpu: 0.05,
        memory: 0.02,
        storage: 0.01,
        gpu: 0.5,
        gpuTypes: ["RTX 4090", "RTX 4080", "A100"],
      },
      resources: {
        cpu: { cores: 64, threads: 128 },
        memory: { total: 512, available: 256 },
        storage: { total: 10000, available: 5000 },
        gpu: {
          count: 8,
          types: ["RTX 4090", "RTX 4080", "A100"],
          vram: [24, 16, 80],
          available: 5,
        },
        network: { bandwidth: 10000, latency: 2 },
      },
      verified: true,
      featured: true,
      specialties: ["AI/ML", "Web Apps", "Databases"],
      totalDeployments: 2847,
      responseTime: "2.3s",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "Decentralized Compute",
      location: "Germany",
      region: "Europe",
      nodesCount: 8,
      uptime: 99.7,
      reputation: 4.6,
      pricing: {
        min: 0.15,
        max: 3.0,
        average: 1.2,
        cpu: 0.08,
        memory: 0.03,
        storage: 0.015,
        gpu: 0.8,
        gpuTypes: ["RTX 3090", "RTX 3080"],
      },
      resources: {
        cpu: { cores: 32, threads: 64 },
        memory: { total: 256, available: 128 },
        storage: { total: 5000, available: 2500 },
        gpu: {
          count: 4,
          types: ["RTX 3090", "RTX 3080"],
          vram: [24, 10],
          available: 2,
        },
        network: { bandwidth: 5000, latency: 5 },
      },
      verified: true,
      featured: false,
      specialties: ["Blockchain", "Web3", "DeFi"],
      totalDeployments: 1923,
      responseTime: "1.8s",
      lastActive: "5 minutes ago",
    },
    {
      id: "3",
      name: "NodeMaster Pro",
      location: "USA",
      region: "North America",
      nodesCount: 25,
      uptime: 99.8,
      reputation: 4.9,
      pricing: {
        min: 0.08,
        max: 2.0,
        average: 0.6,
        cpu: 0.04,
        memory: 0.015,
        storage: 0.008,
        gpu: 0.3,
        gpuTypes: ["RTX 4070", "RTX 4060"],
      },
      resources: {
        cpu: { cores: 128, threads: 256 },
        memory: { total: 1024, available: 512 },
        storage: { total: 20000, available: 10000 },
        gpu: {
          count: 16,
          types: ["RTX 4070", "RTX 4060"],
          vram: [12, 8],
          available: 12,
        },
        network: { bandwidth: 20000, latency: 1 },
      },
      verified: true,
      featured: true,
      specialties: ["Enterprise", "High Performance", "Security"],
      totalDeployments: 4567,
      responseTime: "1.2s",
      lastActive: "1 minute ago",
    },
    {
      id: "4",
      name: "Edge Computing Hub",
      location: "Japan",
      region: "Asia Pacific",
      nodesCount: 12,
      uptime: 99.5,
      reputation: 4.7,
      pricing: {
        min: 0.12,
        max: 2.8,
        average: 0.9,
        cpu: 0.06,
        memory: 0.025,
        storage: 0.012,
        gpu: 0.6,
        gpuTypes: ["RTX 4080", "RTX 4070"],
      },
      resources: {
        cpu: { cores: 48, threads: 96 },
        memory: { total: 384, available: 192 },
        storage: { total: 8000, available: 4000 },
        gpu: {
          count: 6,
          types: ["RTX 4080", "RTX 4070"],
          vram: [16, 12],
          available: 3,
        },
        network: { bandwidth: 8000, latency: 3 },
      },
      verified: true,
      featured: false,
      specialties: ["Edge Computing", "IoT", "Real-time"],
      totalDeployments: 1234,
      responseTime: "3.1s",
      lastActive: "3 minutes ago",
    },
    {
      id: "5",
      name: "AI Compute Network",
      location: "UK",
      region: "Europe",
      nodesCount: 18,
      uptime: 99.6,
      reputation: 4.8,
      pricing: {
        min: 0.2,
        max: 4.0,
        average: 1.5,
        cpu: 0.1,
        memory: 0.04,
        storage: 0.02,
        gpu: 1.0,
        gpuTypes: ["A100", "H100", "RTX 4090"],
      },
      resources: {
        cpu: { cores: 72, threads: 144 },
        memory: { total: 576, available: 288 },
        storage: { total: 15000, available: 7500 },
        gpu: {
          count: 12,
          types: ["A100", "H100", "RTX 4090"],
          vram: [80, 80, 24],
          available: 8,
        },
        network: { bandwidth: 15000, latency: 2 },
      },
      verified: true,
      featured: true,
      specialties: ["AI/ML", "Deep Learning", "GPU Computing"],
      totalDeployments: 3456,
      responseTime: "2.1s",
      lastActive: "1 minute ago",
    },
    {
      id: "6",
      name: "Green Cloud Solutions",
      location: "Norway",
      region: "Europe",
      nodesCount: 6,
      uptime: 99.4,
      reputation: 4.5,
      pricing: {
        min: 0.18,
        max: 2.2,
        average: 0.7,
        cpu: 0.09,
        memory: 0.035,
        storage: 0.018,
        gpu: 0.4,
        gpuTypes: ["RTX 3060", "RTX 3070"],
      },
      resources: {
        cpu: { cores: 24, threads: 48 },
        memory: { total: 192, available: 96 },
        storage: { total: 4000, available: 2000 },
        gpu: {
          count: 3,
          types: ["RTX 3060", "RTX 3070"],
          vram: [12, 8],
          available: 2,
        },
        network: { bandwidth: 4000, latency: 4 },
      },
      verified: true,
      featured: false,
      specialties: ["Sustainable", "Green Energy", "Eco-friendly"],
      totalDeployments: 987,
      responseTime: "2.8s",
      lastActive: "4 minutes ago",
    },
  ];

  const apps: App[] = [
    {
      id: "1",
      name: "AI Chat Bot",
      category: "AI/ML",
      price: 0.5,
      rating: 4.7,
      downloads: 1250,
      provider: "CloudTech Solutions",
      description:
        "Advanced conversational AI with natural language processing",
      image: "/api/placeholder/300/200",
      tags: ["AI", "Chat", "NLP"],
      featured: true,
    },
    {
      id: "2",
      name: "Web Server",
      category: "Web Apps",
      price: 0.3,
      rating: 4.5,
      downloads: 890,
      provider: "Decentralized Compute",
      description: "High-performance web server with auto-scaling",
      image: "/api/placeholder/300/200",
      tags: ["Web", "Server", "Scalable"],
      featured: false,
    },
    {
      id: "3",
      name: "Database Cluster",
      category: "Data",
      price: 1.2,
      rating: 4.8,
      downloads: 567,
      provider: "NodeMaster Pro",
      description: "Distributed database with automatic failover",
      image: "/api/placeholder/300/200",
      tags: ["Database", "Cluster", "Reliable"],
      featured: true,
    },
    {
      id: "4",
      name: "Image Processing API",
      category: "AI/ML",
      price: 0.8,
      rating: 4.6,
      downloads: 743,
      provider: "AI Compute Network",
      description: "Real-time image processing and computer vision",
      image: "/api/placeholder/300/200",
      tags: ["Image", "AI", "Vision"],
      featured: false,
    },
    {
      id: "5",
      name: "Blockchain Node",
      category: "Blockchain",
      price: 1.5,
      rating: 4.9,
      downloads: 432,
      provider: "Decentralized Compute",
      description: "Full blockchain node with validator capabilities",
      image: "/api/placeholder/300/200",
      tags: ["Blockchain", "Validator", "Crypto"],
      featured: true,
    },
    {
      id: "6",
      name: "IoT Data Collector",
      category: "IoT",
      price: 0.4,
      rating: 4.4,
      downloads: 321,
      provider: "Edge Computing Hub",
      description: "Collect and process IoT sensor data in real-time",
      image: "/api/placeholder/300/200",
      tags: ["IoT", "Sensors", "Real-time"],
      featured: false,
    },
  ];

  const stats: Stats = {
    totalProviders: 156,
    totalApps: 2847,
    totalDeployments: 45678,
    averageUptime: 99.7,
  };

  const filteredProviders = providers
    .filter((provider) => {
      const matchesSearch =
        !filters.search ||
        provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        provider.location
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        provider.specialties.some((s) =>
          s.toLowerCase().includes(filters.search.toLowerCase()),
        );

      const matchesCategory =
        filters.category === "all" ||
        provider.specialties.includes(filters.category);
      const matchesRegion =
        filters.region === "all" || provider.region === filters.region;

      let matchesResource = true;

      if (filters.resource === "gpu") {
        matchesResource = !!(
          provider.resources.gpu && provider.resources.gpu.available > 0
        );
      } else if (filters.resource === "high-memory") {
        matchesResource = provider.resources.memory.total >= 256;
      } else if (filters.resource === "cpu") {
        matchesResource =
          !provider.resources.gpu || provider.resources.gpu.available === 0;
      }

      let matchesGpuModel = true;

      if (filters.gpuModel !== "all" && provider.resources.gpu) {
        matchesGpuModel = provider.resources.gpu.types.includes(
          filters.gpuModel,
        );
      }

      let matchesPriceRange = true;

      if (filters.priceRange === "low") {
        matchesPriceRange = provider.pricing.average <= 0.5;
      } else if (filters.priceRange === "medium") {
        matchesPriceRange =
          provider.pricing.average > 0.5 && provider.pricing.average <= 2.0;
      } else if (filters.priceRange === "high") {
        matchesPriceRange = provider.pricing.average > 2.0;
      }

      let matchesUptime = true;

      if (filters.uptime === "99+") {
        matchesUptime = provider.uptime >= 99;
      } else if (filters.uptime === "95+") {
        matchesUptime = provider.uptime >= 95;
      } else if (filters.uptime === "90+") {
        matchesUptime = provider.uptime >= 90;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRegion &&
        matchesResource &&
        matchesGpuModel &&
        matchesPriceRange &&
        matchesUptime
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.pricing.average - b.pricing.average;
        case "uptime":
          return b.uptime - a.uptime;
        case "nodes":
          return b.nodesCount - a.nodesCount;
        case "reputation":
        default:
          return b.reputation - a.reputation;
      }
    });

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      !filters.search ||
      app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase()),
      );
    const matchesCategory =
      filters.category === "all" || app.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <HeroSection
        searchQuery={filters.search}
        setSearchQuery={(value) => setFilters({ ...filters, search: value })}
        stats={stats}
      />

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

      <FeaturedProvidersSection providers={filteredProviders} />

      <AllProvidersSection providers={filteredProviders} />

      <ApplicationsSection apps={filteredApps} />

      <CTASection />
    </div>
  );
}
