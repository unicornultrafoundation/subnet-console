"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
  Server,
  Edit,
  Trash2,
  Eye,
  Activity,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Box,
  HardDrive,
} from "lucide-react";
import { Node } from "@/types";

interface NodeCardProps {
  node: Node;
  onViewDetails: (node: Node) => void;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
  onStatusChange: (nodeId: string, newStatus: Node["status"]) => void;
}

export function NodeCard({
  node,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
}: NodeCardProps) {
  const getStatusColor = (status: Node["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "maintenance":
        return "warning";
      case "offline":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: Node["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} />;
      case "inactive":
        return <XCircle size={16} />;
      case "maintenance":
        return <AlertCircle size={16} />;
      case "offline":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="subnet-card hover:shadow-lg transition-shadow"
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
              <Server className="text-primary" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-bold text-dark-on-white truncate">
                  {node.name}
                </h3>
                {node.clusterName && (
                  <Chip
                    className="flex-shrink-0"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    {node.clusterName}
                  </Chip>
                )}
                <Chip
                  className="flex-shrink-0"
                  color={getStatusColor(node.status)}
                  size="sm"
                  startContent={getStatusIcon(node.status)}
                  variant="flat"
                >
                  {node.status}
                </Chip>
              </div>
              <p className="text-sm text-dark-on-white-muted mb-2 line-clamp-1">
                {node.description}
              </p>

              {/* Compact Info Row */}
              <div className="flex items-center gap-3 text-xs text-default-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span className="truncate">
                    {node.location.city}
                    {node.location.zone && ` (${node.location.zone})`}
                  </span>
                </div>
                {node.pods && (
                  <div className="flex items-center gap-1">
                    <Box size={12} />
                    <span>
                      {node.pods.running}/{node.pods.capacity} pods
                    </span>
                  </div>
                )}
                {node.usage && (
                  <>
                    <div className="flex items-center gap-1">
                      <Activity size={12} />
                      <span>CPU {node.usage.cpu}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive size={12} />
                      <span>Mem {node.usage.memory}%</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  <span>{node.uptime}% uptime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Specs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-sm font-bold text-primary">
                {node.specs.cpu}C
              </div>
              <div className="text-xs text-default-500">
                {node.specs.memory}GB
              </div>
              <div className="text-xs text-default-500">
                {node.specs.storage}GB
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              isIconOnly
              size="sm"
              title="View Details"
              variant="flat"
              onPress={() => onViewDetails(node)}
            >
              <Eye size={16} />
            </Button>
            <Button
              isIconOnly
              color="primary"
              size="sm"
              title="Edit"
              variant="flat"
              onPress={() => onEdit(node)}
            >
              <Edit size={16} />
            </Button>
            <Button
              isIconOnly
              color="danger"
              size="sm"
              title="Delete"
              variant="flat"
              onPress={() => onDelete(node)}
            >
              <Trash2 size={16} />
            </Button>
            <Select
              className="w-32"
              selectedKeys={[node.status]}
              size="sm"
              onSelectionChange={(keys) => {
                const newStatus = Array.from(
                  keys,
                )[0] as Node["status"];

                onStatusChange(node.id, newStatus);
              }}
            >
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
              <SelectItem key="maintenance">Maintenance</SelectItem>
              <SelectItem key="offline">Offline</SelectItem>
            </Select>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

