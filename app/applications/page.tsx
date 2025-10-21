"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Star,
  Zap,
  Database,
  BarChart3,
  ArrowLeft,
  Play,
  Search,
  Grid3X3,
  List,
  Download,
  Eye,
  Bot,
  Code,
  Image,
  Globe,
} from "lucide-react";

import { App } from "@/components/marketplace/types";

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    rating: "all",
    price: "all",
    sortBy: "rating",
  });

  // Mock apps data
  const apps: App[] = [
    {
      id: "app-1",
      name: "AI Model Training",
      category: "AI/ML",
      price: 0.45,
      rating: 4.8,
      downloads: 1250,
      provider: "Quantum Computing Solutions",
      description:
        "Advanced AI model training application with GPU acceleration for machine learning workflows",
      image: "/images/ai-training.jpg",
      tags: ["AI", "Machine Learning", "GPU", "TensorFlow"],
      featured: true,
    },
    {
      id: "app-2",
      name: "Web Analytics Dashboard",
      category: "Web Hosting",
      price: 0.18,
      rating: 4.5,
      downloads: 890,
      provider: "CloudTech Infrastructure",
      description:
        "Real-time web analytics and monitoring dashboard with customizable widgets",
      image: "/images/analytics.jpg",
      tags: ["Analytics", "Dashboard", "Monitoring", "React"],
      featured: false,
    },
    {
      id: "app-3",
      name: "Blockchain Node",
      category: "Blockchain",
      price: 0.89,
      rating: 4.9,
      downloads: 2100,
      provider: "Blockchain Infrastructure",
      description:
        "High-performance blockchain node with smart contract support and consensus mechanisms",
      image: "/images/blockchain.jpg",
      tags: ["Blockchain", "Smart Contracts", "Node", "Ethereum"],
      featured: true,
    },
    {
      id: "app-4",
      name: "Data Processing Pipeline",
      category: "Data Analytics",
      price: 0.32,
      rating: 4.6,
      downloads: 1560,
      provider: "Data Analytics Hub",
      description:
        "Scalable data processing pipeline for big data analytics and ETL operations",
      image: "/images/data-pipeline.jpg",
      tags: ["Data Processing", "ETL", "Big Data", "Apache Spark"],
      featured: false,
    },
    {
      id: "app-5",
      name: "Edge Computing Runtime",
      category: "Edge Computing",
      price: 0.25,
      rating: 4.7,
      downloads: 980,
      provider: "Edge Computing Network",
      description:
        "Lightweight runtime environment for edge computing applications and IoT devices",
      image: "/images/edge-computing.jpg",
      tags: ["Edge Computing", "IoT", "Runtime", "Microservices"],
      featured: true,
    },
    {
      id: "app-6",
      name: "Database Management System",
      category: "Database",
      price: 0.15,
      rating: 4.4,
      downloads: 3200,
      provider: "CloudTech Infrastructure",
      description:
        "Enterprise-grade database management system with high availability and backup",
      image: "/images/database.jpg",
      tags: ["Database", "SQL", "Backup", "High Availability"],
      featured: false,
    },
    {
      id: "app-7",
      name: "Image Processing Service",
      category: "Computer Vision",
      price: 0.22,
      rating: 4.3,
      downloads: 750,
      provider: "Quantum Computing Solutions",
      description:
        "Advanced image processing service with AI-powered enhancement and analysis",
      image: "/images/image-processing.jpg",
      tags: ["Computer Vision", "Image Processing", "AI", "OpenCV"],
      featured: false,
    },
    {
      id: "app-8",
      name: "API Gateway",
      category: "Web Hosting",
      price: 0.12,
      rating: 4.6,
      downloads: 1800,
      provider: "CloudTech Infrastructure",
      description:
        "High-performance API gateway with rate limiting, authentication, and monitoring",
      image: "/images/api-gateway.jpg",
      tags: ["API", "Gateway", "Authentication", "Rate Limiting"],
      featured: true,
    },
  ];

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "ai-ml", label: "AI/ML" },
    { key: "web-hosting", label: "Web Hosting" },
    { key: "blockchain", label: "Blockchain" },
    { key: "data-analytics", label: "Data Analytics" },
    { key: "edge-computing", label: "Edge Computing" },
    { key: "database", label: "Database" },
    { key: "computer-vision", label: "Computer Vision" },
  ];

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      "AI/ML": <Bot size={16} />,
      "Web Hosting": <Code size={16} />,
      Blockchain: <Database size={16} />,
      "Data Analytics": <BarChart3 size={16} />,
      "Edge Computing": <Zap size={16} />,
      Database: <Database size={16} />,
      "Computer Vision": <Image size={16} />,
    };

    return iconMap[category] || <Globe size={16} />;
  };

  // Filter and sort apps
  const filteredApps = apps
    .filter((app) => {
      if (
        filters.search &&
        !app.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !app.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.category !== "all" &&
        app.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }
      if (filters.rating !== "all") {
        const ratingThreshold = parseFloat(filters.rating);

        if (app.rating < ratingThreshold) return false;
      }
      if (filters.price !== "all") {
        const priceThreshold = parseFloat(filters.price);

        if (app.price > priceThreshold) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "downloads":
          return b.downloads - a.downloads;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.rating - a.rating;
      }
    });

  const AppCard = ({ app }: { app: App }) => (
    <Card className="subnet-card hover:scale-105 transition-transform duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {getCategoryIcon(app.category)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark-on-white">
                {app.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-dark-on-white-muted">
                <span>{app.category}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {app.featured && (
              <Chip
                color="warning"
                size="sm"
                startContent={<Star size={12} />}
                variant="flat"
              >
                Featured
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0 space-y-4">
        {/* Description */}
        <p className="text-sm text-default-600 line-clamp-2">
          {app.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <div className="text-2xl font-bold text-primary">{app.rating}</div>
            <div className="text-xs text-default-600">Rating</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/5">
            <div className="text-2xl font-bold text-secondary">
              {app.downloads}
            </div>
            <div className="text-xs text-default-600">Downloads</div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-default-700">Tags</div>
          <div className="flex flex-wrap gap-1">
            {app.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} color="default" size="sm" variant="flat">
                {tag}
              </Chip>
            ))}
            {app.tags.length > 3 && (
              <Chip color="default" size="sm" variant="flat">
                +{app.tags.length - 3}
              </Chip>
            )}
          </div>
        </div>

        {/* Provider & Price */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-default-600">
            by <span className="font-semibold">{app.provider}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              ${app.price}/hr
            </div>
            <div className="text-xs text-default-500">Starting price</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            color="primary"
            size="sm"
            startContent={<Play size={16} />}
          >
            Deploy
          </Button>
          <Button
            as={Link}
            href={`/applications/${app.id}`}
            size="sm"
            startContent={<Eye size={16} />}
            variant="bordered"
          >
            View
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  const AppListItem = ({ app }: { app: App }) => (
    <Card className="subnet-card hover:shadow-lg transition-shadow duration-300">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {getCategoryIcon(app.category)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-dark-on-white">
                  {app.name}
                </h3>
                {app.featured && (
                  <Chip
                    color="warning"
                    size="sm"
                    startContent={<Star size={12} />}
                    variant="flat"
                  >
                    Featured
                  </Chip>
                )}
              </div>
              <p className="text-sm text-dark-on-white-muted mb-3 line-clamp-1">
                {app.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="text-warning" size={14} />
                  <span>{app.rating}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="text-primary" size={14} />
                  <span>{app.downloads} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-default-600">{app.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Provider */}
            <div className="text-center min-w-[150px]">
              <div className="text-sm font-semibold text-default-700">
                {app.provider}
              </div>
              <div className="text-xs text-default-500">Provider</div>
            </div>

            {/* Price */}
            <div className="text-center min-w-[100px]">
              <div className="text-lg font-bold text-primary">
                ${app.price}/hr
              </div>
              <div className="text-xs text-default-500">Starting price</div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                color="primary"
                size="sm"
                startContent={<Play size={16} />}
              >
                Deploy
              </Button>
              <Button
                as={Link}
                href={`/applications/${app.id}`}
                size="sm"
                startContent={<Eye size={16} />}
                variant="bordered"
              >
                View
              </Button>
            </div>
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
              startContent={<ArrowLeft size={16} />}
              variant="light"
            >
              Back to Marketplace
            </Button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-dark-on-white mb-6">
              Applications
            </h1>
            <p className="text-xl text-dark-on-white-muted mb-8">
              Discover and deploy powerful applications from verified providers
              across the subnet ecosystem.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {apps.length}
                </div>
                <div className="text-sm text-default-600">Total Apps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">
                  {apps.filter((a) => a.featured).length}
                </div>
                <div className="text-sm text-default-600">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">
                  {apps.reduce((sum, a) => sum + a.downloads, 0)}
                </div>
                <div className="text-sm text-default-600">Total Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">
                  {(
                    apps.reduce((sum, a) => sum + a.rating, 0) / apps.length
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-default-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <Input
                  className="w-full"
                  placeholder="Search applications..."
                  startContent={<Search size={18} />}
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 items-center">
                <Select
                  className="min-w-[150px]"
                  placeholder="Category"
                  selectedKeys={[filters.category]}
                  onSelectionChange={(keys) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: Array.from(keys)[0] as string,
                    }))
                  }
                >
                  {categories.map((category) => (
                    <SelectItem key={category.key}>{category.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  className="min-w-[120px]"
                  placeholder="Rating"
                  selectedKeys={[filters.rating]}
                  onSelectionChange={(keys) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: Array.from(keys)[0] as string,
                    }))
                  }
                >
                  <SelectItem key="all">All Ratings</SelectItem>
                  <SelectItem key="4.5">4.5+ Stars</SelectItem>
                  <SelectItem key="4.0">4.0+ Stars</SelectItem>
                  <SelectItem key="3.5">3.5+ Stars</SelectItem>
                </Select>

                <Select
                  className="min-w-[120px]"
                  placeholder="Price"
                  selectedKeys={[filters.price]}
                  onSelectionChange={(keys) =>
                    setFilters((prev) => ({
                      ...prev,
                      price: Array.from(keys)[0] as string,
                    }))
                  }
                >
                  <SelectItem key="all">All Prices</SelectItem>
                  <SelectItem key="0.5">Under $0.5/hr</SelectItem>
                  <SelectItem key="1.0">Under $1.0/hr</SelectItem>
                  <SelectItem key="2.0">Under $2.0/hr</SelectItem>
                </Select>

                <Select
                  className="min-w-[120px]"
                  placeholder="Sort by"
                  selectedKeys={[filters.sortBy]}
                  onSelectionChange={(keys) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: Array.from(keys)[0] as string,
                    }))
                  }
                >
                  <SelectItem key="rating">Rating</SelectItem>
                  <SelectItem key="downloads">Downloads</SelectItem>
                  <SelectItem key="price">Price</SelectItem>
                  <SelectItem key="name">Name</SelectItem>
                </Select>
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  color={viewMode === "grid" ? "primary" : "default"}
                  size="sm"
                  startContent={<Grid3X3 size={16} />}
                  variant={viewMode === "grid" ? "solid" : "bordered"}
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  color={viewMode === "list" ? "primary" : "default"}
                  size="sm"
                  startContent={<List size={16} />}
                  variant={viewMode === "list" ? "solid" : "bordered"}
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-default-600">
              Showing {filteredApps.length} of {apps.length} applications
            </div>
          </div>
        </div>
      </section>

      {/* Applications Grid/List */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-default-600 mb-2">
                No applications found
              </h3>
              <p className="text-default-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <AppListItem key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
