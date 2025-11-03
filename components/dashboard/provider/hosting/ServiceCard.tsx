import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Eye, Play, Square, Copy, Database, Activity } from "lucide-react";
import { Service, Deployment } from "./types";
import { getStatusColor } from "./utils";

interface ServiceCardProps {
  service: Service;
  deployment: Deployment;
  onViewDetails: (deployment: Deployment, service: Service) => void;
  onScale: (deploymentId: string, serviceId: string, currentReplicas: number) => void;
  onStart: (deploymentId: string, serviceId: string) => void;
  onStop: (deploymentId: string, serviceId: string) => void;
}

export default function ServiceCard({
  service,
  deployment,
  onViewDetails,
  onScale,
  onStart,
  onStop,
}: ServiceCardProps) {
  return (
    <Card className="bg-default-50 border border-default-200">
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{service.name}</h4>
              <Chip
                color={getStatusColor(service.status)}
                size="sm"
                variant="flat"
              >
                {service.status}
              </Chip>
              <Chip
                color="default"
                size="sm"
                variant="flat"
                startContent={<Copy size={12} />}
              >
                {service.replicasStatus.running}/{service.replicas}
              </Chip>
              {service.status === "running" && (
                <div className="flex items-center gap-1 text-xs text-default-600">
                  <Activity className="text-success" size={12} />
                  <span>{service.uptime}% uptime</span>
                </div>
              )}
            </div>
            <p className="text-sm text-default-600 font-mono mb-2">
              {service.image}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Database className="text-primary" size={12} />
                <span>
                  {service.resources.cpu} CPU / {service.resources.memory} GB /{" "}
                  {service.resources.storage} GB
                </span>
              </div>
              {service.ports && service.ports.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-default-600">
                    {service.ports.length} port{service.ports.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              startContent={<Eye size={14} />}
              variant="flat"
              onPress={() => onViewDetails(deployment, service)}
            >
              Details
            </Button>
            <Button
              size="sm"
              startContent={<Copy size={14} />}
              variant="flat"
              onPress={() => onScale(deployment.id, service.id, service.replicas)}
            >
              Scale ({service.replicas})
            </Button>
            {service.status === "running" ? (
              <Button
                color="warning"
                size="sm"
                startContent={<Square size={14} />}
                variant="flat"
                onPress={() => onStop(deployment.id, service.id)}
              >
                Stop
              </Button>
            ) : (
              <Button
                color="success"
                size="sm"
                startContent={<Play size={14} />}
                variant="flat"
                onPress={() => onStart(deployment.id, service.id)}
                isDisabled={service.status === "starting"}
              >
                Start
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

