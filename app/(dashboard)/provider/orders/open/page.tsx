"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Server,
  Cpu,
  HardDrive,
  Zap,
  DollarSign,
  User,
  MapPin,
  Calendar,
  ClipboardCheck,
  Download,
  Trash2,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { DeploymentOrder } from "../types";
import { openOrders as mockOpenOrders } from "../mockData";

export default function OpenOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<DeploymentOrder | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Only orders without expiration
  const [orders, setOrders] = useState<DeploymentOrder[]>(mockOpenOrders);

  // Filter orders - only show orders without expiresAt
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.application.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    // Only show orders without expiration
    const hasNoExpiration = !order.expiresAt;

    return matchesSearch && matchesStatus && hasNoExpiration;
  });

  // Calculate statistics
  const stats = {
    total: orders.filter((o) => !o.expiresAt).length,
    pending: orders.filter((o) => o.status === "pending" && !o.expiresAt).length,
    installed: orders.filter((o) => o.status === "installed" && !o.expiresAt).length,
  };

  // Handle install order
  const handleInstallOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "installed" as const } : order,
      ),
    );
    setIsDetailOpen(false);
  };

  // Handle uninstall order
  const handleUninstallOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "pending" as const } : order,
      ),
    );
    setIsDetailOpen(false);
  };

  // Get status color
  const getStatusColor = (
    status: DeploymentOrder["status"],
  ): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (status) {
      case "pending":
        return "warning";
      case "installed":
        return "success";
      case "expired":
        return "default";
      default:
        return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status: DeploymentOrder["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="text-success" size={16} />;
      case "installed":
        return <CheckCircle className="text-success" size={16} />;
      case "expired":
        return <XCircle className="text-default-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            className="mb-4"
            variant="light"
            startContent={<ArrowLeft size={16} />}
            onPress={() => router.push("/provider")}
          >
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-dark-on-white mb-2">
            Open Orders
          </h1>
          <p className="text-lg text-dark-on-white-muted">
            Review and install deployment orders without expiration time - install anytime
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Total Orders</p>
                  <p className="text-2xl font-bold text-dark-on-white">
                    {stats.total}
                  </p>
                </div>
                <ClipboardCheck className="text-primary" size={24} />
              </div>
            </CardBody>
          </Card>
          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="text-success" size={24} />
              </div>
            </CardBody>
          </Card>
          <Card className="subnet-card">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Installed</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.installed}
                  </p>
                </div>
                <CheckCircle className="text-success" size={24} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="subnet-card mb-6">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="flex-1"
                placeholder="Search orders..."
                startContent={<Search size={16} />}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <Select
                className="w-full md:w-48"
                label="Status"
                selectedKeys={[statusFilter]}
                onSelectionChange={(keys) =>
                  setStatusFilter(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all" value="all">
                  All Status
                </SelectItem>
                <SelectItem key="pending" value="pending">
                  Pending
                </SelectItem>
                <SelectItem key="installed" value="installed">
                  Installed
                </SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="subnet-card">
            <CardBody className="p-12 text-center">
              <ClipboardCheck className="mx-auto text-default-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-dark-on-white mb-2">
                No open orders found
              </h3>
              <p className="text-default-600">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No open orders without expiration time available"}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              return (
                <Card key={order.id} className="subnet-card h-full flex flex-col">
                  <CardBody className="p-6 flex flex-col flex-1">
                    <div className="flex flex-col gap-4 flex-1">
                      {/* Order Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-dark-on-white mb-1">
                              {order.name}
                            </h3>
                            <p className="text-sm text-default-600">
                              {order.application}
                            </p>
                          </div>
                          <Chip
                            color={getStatusColor(order.status)}
                            variant="flat"
                            startContent={getStatusIcon(order.status)}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Chip>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="text-default-500" size={16} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-default-600">User</p>
                              <p className="text-sm font-semibold text-dark-on-white truncate">
                                {order.user.name || order.user.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-default-500" size={16} />
                            <div>
                              <p className="text-xs text-default-600">Price</p>
                              <p className="text-sm font-semibold text-dark-on-white">
                                ${order.pricePerHour}/hour
                              </p>
                            </div>
                          </div>
                          {order.region && (
                            <div className="flex items-center gap-2">
                              <MapPin className="text-default-500" size={16} />
                              <div>
                                <p className="text-xs text-default-600">Region</p>
                                <p className="text-sm font-semibold text-dark-on-white">
                                  {order.region}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="text-default-500" size={16} />
                            <div>
                              <p className="text-xs text-default-600">Requested</p>
                              <p className="text-sm font-semibold text-dark-on-white">
                                {new Date(order.requestedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Cpu className="text-primary" size={16} />
                            <span className="text-sm text-default-600">
                              <span className="font-semibold text-dark-on-white">
                                {order.resources.cpu}
                              </span>{" "}
                              CPU
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="text-secondary" size={16} />
                            <span className="text-sm text-default-600">
                              <span className="font-semibold text-dark-on-white">
                                {order.resources.memory}
                              </span>{" "}
                              GB
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="text-success" size={16} />
                            <span className="text-sm text-default-600">
                              <span className="font-semibold text-dark-on-white">
                                {order.resources.storage}
                              </span>{" "}
                              GB
                            </span>
                          </div>
                          {order.resources.gpu && (
                            <div className="flex items-center gap-2">
                              <Server className="text-warning" size={16} />
                              <span className="text-sm text-default-600">
                                <span className="font-semibold text-dark-on-white">
                                  {order.resources.gpu.count}x
                                </span>{" "}
                                GPU
                              </span>
                            </div>
                          )}
                        </div>

                        {order.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Clock className="text-success" size={16} />
                            <span className="text-sm text-success font-semibold">
                              No expiration - Install anytime
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Server className="text-default-500" size={16} />
                          <span className="text-sm text-default-600">
                            {order.services.length} service
                            {order.services.length !== 1 ? "s" : ""} •{" "}
                            {order.services.reduce(
                              (sum, s) => sum + s.replicas,
                              0,
                            )}{" "}
                            replica{order.services.reduce((sum, s) => sum + s.replicas, 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <Button
                          variant="flat"
                          startContent={<Eye size={16} />}
                          onPress={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            color="success"
                            startContent={<Download size={16} />}
                            onPress={() => handleInstallOrder(order.id)}
                          >
                            Install
                          </Button>
                        )}
                        {order.status === "installed" && (
                          <Button
                            color="danger"
                            variant="flat"
                            startContent={<Trash2 size={16} />}
                            onPress={() => handleUninstallOrder(order.id)}
                          >
                            Uninstall
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Order Detail Modal */}
        <Modal
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h2 className="text-2xl font-bold text-dark-on-white">
                    Order Details
                  </h2>
                </ModalHeader>
                <ModalBody>
                  {selectedOrder && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-on-white mb-3">
                          Basic Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-default-600">Order ID:</span>
                            <span className="font-semibold text-dark-on-white">
                              {selectedOrder.id}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-default-600">Name:</span>
                            <span className="font-semibold text-dark-on-white">
                              {selectedOrder.name}
                            </span>
                          </div>
                          {selectedOrder.status === "pending" && (
                            <div className="flex justify-between">
                              <span className="text-default-600">
                                Expiration:
                              </span>
                              <span className="font-semibold text-success">
                                No expiration - Install anytime
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Close
                  </Button>
                  {selectedOrder?.status === "pending" && (
                    <Button
                      color="success"
                      startContent={<Download size={16} />}
                      onPress={() => {
                        if (selectedOrder) {
                          handleInstallOrder(selectedOrder.id);
                          onClose();
                        }
                      }}
                    >
                      Install
                    </Button>
                  )}
                  {selectedOrder?.status === "installed" && (
                    <Button
                      color="danger"
                      variant="flat"
                      startContent={<Trash2 size={16} />}
                      onPress={() => {
                        if (selectedOrder) {
                          handleUninstallOrder(selectedOrder.id);
                          onClose();
                        }
                      }}
                    >
                      Uninstall
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

