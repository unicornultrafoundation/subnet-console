"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  SortAsc,
  MapPin,
  Server,
  Zap,
  Database,
  Activity,
  ChevronDown,
} from "lucide-react";

interface FilterState {
  search: string;
  category: string;
  region: string;
  resource: string;
  gpuModel: string;
  sortBy: string;
  priceRange: string;
  uptime: string;
}

interface FiltersSectionProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  resultsCount: number;
  categories: Array<{ key: string; label: string }>;
  regions: Array<{ key: string; label: string }>;
  getCategoryIcon: (key: string) => React.ReactNode;
  getRegionIcon: (key: string) => React.ReactNode;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  resultsCount,
  categories,
  regions,
  getCategoryIcon,
  getRegionIcon,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };

    onFiltersChange(newFilters);

    // Update active filters
    const newActiveFilters = Object.entries(newFilters)
      .filter(([k, v]) => v && v !== "all" && k !== "search")
      .map(([k, v]) => `${k}:${v}`);

    setActiveFilters(newActiveFilters);
  };

  const clearFilter = (key: keyof FilterState) => {
    updateFilter(key, "all");
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "all",
      region: "all",
      resource: "all",
      gpuModel: "all",
      sortBy: "reputation",
      priceRange: "all",
      uptime: "all",
    };

    onFiltersChange(clearedFilters);
    setActiveFilters([]);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) => value && value !== "all" && value !== "",
    ).length;
  };

  return (
    <Card className="mb-6 shadow-sm border border-default-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Filter className="text-primary" size={16} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Filters & Search</h3>
              <p className="text-sm text-default-600">
                {resultsCount} providers found
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Filters Badge */}
            {getActiveFiltersCount() > 0 && (
              <Badge
                color="primary"
                content={getActiveFiltersCount()}
                variant="solid"
              >
                <Button
                  color="primary"
                  size="sm"
                  startContent={<SlidersHorizontal size={14} />}
                  variant="flat"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  Filters
                </Button>
              </Badge>
            )}

            {/* Clear All Button */}
            {getActiveFiltersCount() > 0 && (
              <Button
                color="danger"
                size="sm"
                startContent={<X size={14} />}
                variant="light"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            )}

            {/* Expand/Collapse Button */}
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                size={16}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <Input
          className="w-full"
          endContent={
            filters.search && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => updateFilter("search", "")}
              >
                <X size={14} />
              </Button>
            )
          }
          placeholder="Search providers, locations, or specialties..."
          size="lg"
          startContent={<Search className="text-default-400" size={18} />}
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => {
              const [key, value] = filter.split(":");

              return (
                <Chip
                  key={filter}
                  className="capitalize"
                  color="primary"
                  size="sm"
                  variant="flat"
                  onClose={() => clearFilter(key as keyof FilterState)}
                >
                  {key}: {value}
                </Chip>
              );
            })}
          </div>
        </div>
      )}

      {/* Expandable Filters */}
      {isExpanded && (
        <>
          <Divider />
          <CardBody className="pt-6">
            <div className="space-y-6">
              {/* Primary Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="category-filter"
                  >
                    Category
                  </label>
                  <Select
                    id="category-filter"
                    placeholder="All Categories"
                    selectedKeys={[filters.category]}
                    size="sm"
                    startContent={
                      <Server className="text-default-400" size={14} />
                    }
                    onSelectionChange={(keys) =>
                      updateFilter("category", Array.from(keys)[0] as string)
                    }
                  >
                    {categories.map((category) => (
                      <SelectItem
                        key={category.key}
                        startContent={getCategoryIcon(category.key)}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Region Filter */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="region-filter"
                  >
                    Region
                  </label>
                  <Select
                    id="region-filter"
                    placeholder="All Regions"
                    selectedKeys={[filters.region]}
                    size="sm"
                    startContent={
                      <MapPin className="text-default-400" size={14} />
                    }
                    onSelectionChange={(keys) =>
                      updateFilter("region", Array.from(keys)[0] as string)
                    }
                  >
                    {regions.map((region) => (
                      <SelectItem
                        key={region.key}
                        startContent={getRegionIcon(region.key)}
                      >
                        {region.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Resource Type Filter */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="resource-filter"
                  >
                    Resource Type
                  </label>
                  <Select
                    id="resource-filter"
                    placeholder="All Resources"
                    selectedKeys={[filters.resource]}
                    size="sm"
                    startContent={
                      <Database className="text-default-400" size={14} />
                    }
                    onSelectionChange={(keys) =>
                      updateFilter("resource", Array.from(keys)[0] as string)
                    }
                  >
                    <SelectItem key="all" startContent={<Server size={14} />}>
                      All Resources
                    </SelectItem>
                    <SelectItem key="cpu" startContent={<Database size={14} />}>
                      CPU Only
                    </SelectItem>
                    <SelectItem key="gpu" startContent={<Zap size={14} />}>
                      GPU Available
                    </SelectItem>
                    <SelectItem
                      key="high-memory"
                      startContent={<Activity size={14} />}
                    >
                      High Memory
                    </SelectItem>
                  </Select>
                </div>

                {/* Sort By Filter */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="sort-filter"
                  >
                    Sort By
                  </label>
                  <Select
                    id="sort-filter"
                    placeholder="Sort by"
                    selectedKeys={[filters.sortBy]}
                    size="sm"
                    startContent={
                      <SortAsc className="text-default-400" size={14} />
                    }
                    onSelectionChange={(keys) =>
                      updateFilter("sortBy", Array.from(keys)[0] as string)
                    }
                  >
                    <SelectItem key="reputation">Reputation</SelectItem>
                    <SelectItem key="price">Price</SelectItem>
                    <SelectItem key="uptime">Uptime</SelectItem>
                    <SelectItem key="nodes">Node Count</SelectItem>
                  </Select>
                </div>
              </div>

              {/* Secondary Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* GPU Model Filter */}
                {filters.resource === "gpu" && (
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-default-700"
                      htmlFor="gpu-model-filter"
                    >
                      GPU Model
                    </label>
                    <Select
                      id="gpu-model-filter"
                      placeholder="All GPU Models"
                      selectedKeys={[filters.gpuModel]}
                      size="sm"
                      startContent={
                        <Zap className="text-default-400" size={14} />
                      }
                      onSelectionChange={(keys) =>
                        updateFilter("gpuModel", Array.from(keys)[0] as string)
                      }
                    >
                      <SelectItem key="all" startContent={<Zap size={14} />}>
                        All GPU Models
                      </SelectItem>
                      <SelectItem
                        key="RTX 4090"
                        startContent={<Zap size={14} />}
                      >
                        RTX 4090 (24GB)
                      </SelectItem>
                      <SelectItem
                        key="RTX 4080"
                        startContent={<Zap size={14} />}
                      >
                        RTX 4080 (16GB)
                      </SelectItem>
                      <SelectItem key="A100" startContent={<Zap size={14} />}>
                        A100 (80GB)
                      </SelectItem>
                      <SelectItem
                        key="RTX 3090"
                        startContent={<Zap size={14} />}
                      >
                        RTX 3090 (24GB)
                      </SelectItem>
                      <SelectItem
                        key="RTX 3080"
                        startContent={<Zap size={14} />}
                      >
                        RTX 3080 (10GB)
                      </SelectItem>
                      <SelectItem key="V100" startContent={<Zap size={14} />}>
                        V100 (32GB)
                      </SelectItem>
                    </Select>
                  </div>
                )}

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="price-range-filter"
                  >
                    Price Range
                  </label>
                  <Select
                    id="price-range-filter"
                    placeholder="All Prices"
                    selectedKeys={[filters.priceRange]}
                    size="sm"
                    startContent={
                      <Activity className="text-default-400" size={14} />
                    }
                    onSelectionChange={(keys) =>
                      updateFilter("priceRange", Array.from(keys)[0] as string)
                    }
                  >
                    <SelectItem key="all">All Prices</SelectItem>
                    <SelectItem key="low">$0.01 - $0.50</SelectItem>
                    <SelectItem key="medium">$0.50 - $2.00</SelectItem>
                    <SelectItem key="high">$2.00+</SelectItem>
                  </Select>
                </div>

                {/* Uptime Filter */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-default-700"
                    htmlFor="uptime-filter"
                  >
                    Uptime
                  </label>
                  <Select
                    id="uptime-filter"
                    placeholder="All Uptime"
                    selectedKeys={[filters.uptime]}
                    size="sm"
                    startContent={
                      <Activity className="text-default-400" size={14} />
                    }
                    onSelectionChange={(keys) =>
                      updateFilter("uptime", Array.from(keys)[0] as string)
                    }
                  >
                    <SelectItem key="all">All Uptime</SelectItem>
                    <SelectItem key="99+">99%+ Uptime</SelectItem>
                    <SelectItem key="95+">95%+ Uptime</SelectItem>
                    <SelectItem key="90+">90%+ Uptime</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </CardBody>
        </>
      )}

      {/* View Controls */}
      <Divider />
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-default-600">
            <Activity size={16} />
            <span className="font-medium">{resultsCount}</span>
            <span>providers found</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-default-600">View:</span>
            <div className="flex items-center gap-1">
              <Button
                isIconOnly
                color={viewMode === "grid" ? "primary" : "default"}
                size="sm"
                variant={viewMode === "grid" ? "solid" : "flat"}
                onClick={() => onViewModeChange("grid")}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                isIconOnly
                color={viewMode === "list" ? "primary" : "default"}
                size="sm"
                variant={viewMode === "list" ? "solid" : "flat"}
                onClick={() => onViewModeChange("list")}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
