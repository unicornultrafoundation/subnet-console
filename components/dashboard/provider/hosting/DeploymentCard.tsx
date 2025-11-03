import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Play,
  Square,
  RefreshCw,
  User,
  Database,
  Clock,
} from "lucide-react";
import { Deployment } from "./types";
import { getStatusColor, getRemainingTime, formatRemainingTime } from "./utils";
import ServiceCard from "./ServiceCard";

interface DeploymentCardProps {
  deployment: Deployment;
  isExpanded: boolean;
  nowTs: number;
  onToggleExpand: (deploymentId: string) => void;
  onViewDetails: (deployment: Deployment) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onViewServiceDetails: (deployment: Deployment, service: any) => void;
  onScaleService: (deploymentId: string, serviceId: string, currentReplicas: number) => void;
  onStartService: (deploymentId: string, serviceId: string) => void;
  onStopService: (deploymentId: string, serviceId: string) => void;
}

export default function DeploymentCard({
  deployment,
  isExpanded,
  nowTs,
  onToggleExpand,
  onViewDetails,
  onStart,
  onStop,
  onRestart,
  onViewServiceDetails,
  onScaleService,
  onStartService,
  onStopService,
}: DeploymentCardProps) {
  const [clientNowTs, setClientNowTs] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setClientNowTs(Date.now());
    const id = setInterval(() => setClientNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Use client timestamp if available, otherwise use server timestamp (only for initial render)
  const currentTs = isMounted && clientNowTs !== null ? clientNowTs : nowTs;
  const remainingTime = getRemainingTime(deployment.leaseEndAt, currentTs);
  const isExpiringSoon = remainingTime > 0 && remainingTime < 1000 * 60 * 60 * 24;
  const isExpired = remainingTime === 0;

  return (
    <Card className="subnet-card">
      <CardHeader className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">{deployment.name}</h3>
            <Chip
              color={getStatusColor(deployment.status)}
              size="sm"
              variant="flat"
            >
              {deployment.status.charAt(0).toUpperCase() +
                deployment.status.slice(1)}
            </Chip>
            <Chip color="default" size="sm" variant="flat">
              {deployment.services.length} service
              {deployment.services.length !== 1 ? "s" : ""}
            </Chip>
          </div>
          <p className="text-sm text-default-600 mb-2">
            {deployment.application}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <User className="text-default-400" size={14} />
              <span className="text-default-600">
                {deployment.user.name || deployment.user.address}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="text-primary" size={14} />
              <span>
                {deployment.totalResources.cpu} CPU /{" "}
                {deployment.totalResources.memory} GB /{" "}
                {deployment.totalResources.storage} GB
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-default-600">Price:</span>
              <span className="font-semibold">
                {deployment.pricePerHour} SCU/h
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock
                className={`${
                  isExpired
                    ? "text-danger"
                    : isExpiringSoon
                      ? "text-warning"
                      : "text-default-400"
                }`}
                size={14}
              />
              <span
                className={`text-xs ${
                  isExpired
                    ? "text-danger font-semibold"
                    : isExpiringSoon
                      ? "text-warning font-semibold"
                      : "text-default-600"
                }`}
              >
                {formatRemainingTime(deployment.leaseEndAt, currentTs)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onToggleExpand(deployment.id)}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardBody className="pt-0">
          <div className="space-y-3">
            {/* Services List */}
            <div className="space-y-2">
              {deployment.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  deployment={deployment}
                  onViewDetails={onViewServiceDetails}
                  onScale={onScaleService}
                  onStart={onStartService}
                  onStop={onStopService}
                />
              ))}
            </div>

            {/* Deployment Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-default-200">
              <Button
                size="sm"
                startContent={<Eye size={14} />}
                variant="flat"
                onPress={() => onViewDetails(deployment)}
              >
                View Details
              </Button>
              {deployment.status === "running" ? (
                <>
                  <Button
                    color="warning"
                    size="sm"
                    startContent={<Square size={14} />}
                    variant="flat"
                    onPress={() => onStop(deployment.id)}
                  >
                    Stop All
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<RefreshCw size={14} />}
                    variant="flat"
                    onPress={() => onRestart(deployment.id)}
                  >
                    Restart All
                  </Button>
                </>
              ) : (
                <Button
                  color="success"
                  size="sm"
                  startContent={<Play size={14} />}
                  variant="flat"
                  onPress={() => onStart(deployment.id)}
                  isDisabled={deployment.status === "starting"}
                >
                  Start All
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  );
}

