"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import {
  Star,
  MapPin,
  Server,
  Clock,
  Shield,
  Award,
  Users,
  ChevronRight,
  Cpu,
  HardDrive,
  Zap,
  Database,
} from "lucide-react";

import { Provider } from "./types";

interface ProviderCardProps {
  provider: Provider;
  variant?: "featured" | "compact";
}

export default function ProviderCard({
  provider,
  variant = "compact",
}: ProviderCardProps) {
  if (variant === "featured") {
    return (
      <Card className="subnet-card hover:scale-105 transition-transform duration-300">
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
                  <span className="text-xs text-default-400">
                    • {provider.region}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {provider.featured && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                  <Award className="text-primary" size={12} />
                  <span className="text-xs font-semibold text-primary">
                    Featured
                  </span>
                </div>
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

        <CardBody className="pt-0">
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <div className="text-2xl font-bold text-primary">
                  {provider.nodesCount}
                </div>
                <div className="text-xs text-dark-on-white-muted">Nodes</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/5">
                <div className="text-2xl font-bold text-secondary">
                  {provider.uptime}%
                </div>
                <div className="text-xs text-dark-on-white-muted">Uptime</div>
              </div>
            </div>

            {/* Reputation */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-on-white-muted">
                Reputation
              </span>
              <div className="flex items-center gap-1">
                <Star className="text-warning-500 fill-current" size={14} />
                <span className="font-medium">{provider.reputation}</span>
              </div>
            </div>

            {/* Uptime Progress */}
            <div>
              <div className="flex justify-between text-xs text-dark-on-white-muted mb-1">
                <span>Uptime</span>
                <span>{provider.uptime}%</span>
              </div>
              <Progress
                className="w-full"
                color="success"
                size="sm"
                value={provider.uptime}
              />
            </div>

            {/* Pricing */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="text-sm text-dark-on-white-muted mb-2">
                Pricing
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Cpu className="text-primary" size={12} />
                    <span className="text-xs text-dark-on-white-muted">
                      CPU
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    ${provider.pricing.cpu}/hr
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <HardDrive className="text-primary" size={12} />
                    <span className="text-xs text-dark-on-white-muted">
                      Memory
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    ${provider.pricing.memory}/hr
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Database className="text-primary" size={12} />
                    <span className="text-xs text-dark-on-white-muted">
                      Storage
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    ${provider.pricing.storage}/hr
                  </span>
                </div>
                {provider.pricing.gpu && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Zap className="text-primary" size={12} />
                      <span className="text-xs text-dark-on-white-muted">
                        GPU
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      ${provider.pricing.gpu}/hr
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="text-sm text-dark-on-white-muted mb-3">
                Resources
              </div>
              <div className="space-y-3">
                {/* CPU Usage */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <Cpu className="text-primary" size={12} />
                      <span className="text-xs text-dark-on-white-muted">
                        CPU
                      </span>
                    </div>
                    <span className="text-xs font-medium text-dark-on-white">
                      {provider.resources.cpu.cores -
                        Math.floor(provider.resources.cpu.cores * 0.3)}
                      /{provider.resources.cpu.cores} cores
                    </span>
                  </div>
                  <Progress
                    className="w-full"
                    color="primary"
                    size="sm"
                    value={70}
                  />
                  <div className="text-xs text-default-500 mt-1">70% used</div>
                </div>

                {/* Memory Usage */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <HardDrive className="text-secondary" size={12} />
                      <span className="text-xs text-dark-on-white-muted">
                        Memory
                      </span>
                    </div>
                    <span className="text-xs font-medium text-dark-on-white">
                      {provider.resources.memory.total -
                        provider.resources.memory.available}
                      /{provider.resources.memory.total} GB
                    </span>
                  </div>
                  <Progress
                    className="w-full"
                    color="secondary"
                    size="sm"
                    value={
                      ((provider.resources.memory.total -
                        provider.resources.memory.available) /
                        provider.resources.memory.total) *
                      100
                    }
                  />
                  <div className="text-xs text-default-500 mt-1">
                    {Math.round(
                      ((provider.resources.memory.total -
                        provider.resources.memory.available) /
                        provider.resources.memory.total) *
                        100,
                    )}
                    % used
                  </div>
                </div>

                {/* Storage Usage */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <Database className="text-success-600" size={12} />
                      <span className="text-xs text-dark-on-white-muted">
                        Storage
                      </span>
                    </div>
                    <span className="text-xs font-medium text-dark-on-white">
                      {provider.resources.storage.total -
                        provider.resources.storage.available}
                      /{provider.resources.storage.total} GB
                    </span>
                  </div>
                  <Progress
                    className="w-full"
                    color="success"
                    size="sm"
                    value={
                      ((provider.resources.storage.total -
                        provider.resources.storage.available) /
                        provider.resources.storage.total) *
                      100
                    }
                  />
                  <div className="text-xs text-default-500 mt-1">
                    {Math.round(
                      ((provider.resources.storage.total -
                        provider.resources.storage.available) /
                        provider.resources.storage.total) *
                        100,
                    )}
                    % used
                  </div>
                </div>

                {/* GPU Usage */}
                {provider.resources.gpu && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <Zap className="text-warning-600" size={12} />
                        <span className="text-xs text-dark-on-white-muted">
                          GPU
                        </span>
                      </div>
                      <span className="text-xs font-medium text-dark-on-white">
                        {provider.resources.gpu.count -
                          provider.resources.gpu.available}
                        /{provider.resources.gpu.count} units
                      </span>
                    </div>
                    <Progress
                      className="w-full"
                      color="warning"
                      size="sm"
                      value={
                        ((provider.resources.gpu.count -
                          provider.resources.gpu.available) /
                          provider.resources.gpu.count) *
                        100
                      }
                    />
                    <div className="text-xs text-default-500 mt-1">
                      {Math.round(
                        ((provider.resources.gpu.count -
                          provider.resources.gpu.available) /
                          provider.resources.gpu.count) *
                          100,
                      )}
                      % used
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <div className="text-sm text-dark-on-white-muted mb-2">
                Specialties
              </div>
              <div className="flex flex-wrap gap-1">
                {provider.specialties.map((specialty) => (
                  <Chip
                    key={specialty}
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    {specialty}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-2 text-xs text-dark-on-white-muted">
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>
                  {provider.totalDeployments.toLocaleString()} deployments
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{provider.responseTime} response</span>
              </div>
            </div>
          </div>

          <Button
            as={Link}
            className="w-full mt-6 subnet-button-primary"
            color="primary"
            endContent={<ChevronRight size={16} />}
            href={`/providers/${provider.id}`}
          >
            View Details
          </Button>
        </CardBody>
      </Card>
    );
  }

  // Compact variant
  return (
    <Card className="subnet-card hover:scale-105 transition-transform duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Server className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-on-white">
                {provider.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-dark-on-white-muted">
                <MapPin size={12} />
                <span>{provider.location}</span>
                <span className="text-xs text-default-400">
                  • {provider.region}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {provider.featured && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                <Award className="text-primary" size={10} />
                <span className="text-xs font-semibold text-primary">
                  Featured
                </span>
              </div>
            )}
            {provider.verified && (
              <Chip
                color="success"
                size="sm"
                startContent={<Shield size={10} />}
                variant="flat"
              >
                Verified
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Nodes</span>
            <span className="font-medium">{provider.nodesCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Uptime</span>
            <span className="font-medium">{provider.uptime}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Reputation</span>
            <div className="flex items-center gap-1">
              <Star className="text-warning-500 fill-current" size={12} />
              <span className="font-medium">{provider.reputation}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dark-on-white-muted">Pricing</span>
            <span className="font-medium">
              ${provider.pricing.min}-${provider.pricing.max}/hr
            </span>
          </div>
        </div>

        <Button
          as={Link}
          className="w-full mt-4"
          color="primary"
          href={`/providers/${provider.id}`}
          variant="flat"
        >
          View Details
        </Button>
      </CardBody>
    </Card>
  );
}
