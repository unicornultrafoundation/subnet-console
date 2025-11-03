import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Server, Square, Play, Database, HardDrive, Clock, Activity } from "lucide-react";
import { Deployment, Service } from "./types";
import { getStatusColor, getRemainingTime, formatRemainingTime } from "./utils";

interface DeploymentDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDeployment: Deployment | null;
  selectedService: { deployment: Deployment; service: Service } | null;
  nowTs: number;
  onViewService: (deployment: Deployment, service: Service) => void;
  onStartService?: (deploymentId: string, serviceId: string) => void;
  onStopService?: (deploymentId: string, serviceId: string) => void;
}

export default function DeploymentDetailModal({
  isOpen,
  onOpenChange,
  selectedDeployment,
  selectedService,
  nowTs,
  onViewService,
  onStartService,
  onStopService,
}: DeploymentDetailModalProps) {
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

  if (!selectedDeployment) return null;

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <Server size={20} />
                <span>
                  {selectedService
                    ? `${selectedDeployment.name} - ${selectedService.service.name}`
                    : selectedDeployment.name}
                </span>
                <Chip
                  color={getStatusColor(selectedDeployment.status)}
                  size="sm"
                  variant="flat"
                >
                  {selectedDeployment.status}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {selectedService ? (
                  // Service Details
                  <>
                    <div>
                      <h3 className="font-semibold mb-3">Service Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-default-600">Name</span>
                          <p className="font-medium">{selectedService.service.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Image</span>
                          <p className="font-mono text-sm">{selectedService.service.image}</p>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Status</span>
                          <Chip
                            color={getStatusColor(selectedService.service.status)}
                            size="sm"
                            variant="flat"
                          >
                            {selectedService.service.status}
                          </Chip>
                        </div>
                        {selectedService.service.status === "running" && (
                          <div>
                            <span className="text-sm text-default-600">Uptime</span>
                            <p className="font-medium">{selectedService.service.uptime}%</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedService.service.ports &&
                      selectedService.service.ports.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Ports</h3>
                          <div className="space-y-2">
                            {selectedService.service.ports.map((port, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-default-50 rounded"
                              >
                                <div>
                                  <span className="font-mono text-sm">
                                    {port.containerPort} → {port.hostPort}
                                  </span>
                                  {port.url && (
                                    <p className="text-xs text-default-600 mt-1">{port.url}</p>
                                  )}
                                </div>
                                <Chip size="sm" variant="flat">
                                  {port.protocol.toUpperCase()}
                                </Chip>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div>
                      <h3 className="font-semibold mb-3">Replicas</h3>
                      <div className="mb-3">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-3 bg-success-100 rounded">
                            <div className="text-sm text-default-600 mb-1">Running</div>
                            <div className="text-2xl font-bold text-success-600">
                              {selectedService.service.replicasStatus.running}
                            </div>
                          </div>
                          <div className="p-3 bg-warning-100 rounded">
                            <div className="text-sm text-default-600 mb-1">Pending</div>
                            <div className="text-2xl font-bold text-warning-600">
                              {selectedService.service.replicasStatus.pending}
                            </div>
                          </div>
                          <div className="p-3 bg-danger-100 rounded">
                            <div className="text-sm text-default-600 mb-1">Failed</div>
                            <div className="text-2xl font-bold text-danger-600">
                              {selectedService.service.replicasStatus.failed}
                            </div>
                          </div>
                          <div className="p-3 bg-default-100 rounded">
                            <div className="text-sm text-default-600 mb-1">Total</div>
                            <div className="text-2xl font-bold">
                              {selectedService.service.replicas}
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedService.service.replicasList &&
                        selectedService.service.replicasList.length > 0 && (
                          <div className="space-y-2">
                            {selectedService.service.replicasList.map((replica) => (
                              <div
                                key={replica.id}
                                className="flex items-center justify-between p-2 bg-default-50 rounded border border-default-200"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{replica.name}</span>
                                    <Chip
                                      color={getStatusColor(replica.status)}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {replica.status}
                                    </Chip>
                                    {replica.nodeName && (
                                      <span className="text-xs text-default-600">
                                        on {replica.nodeName}
                                      </span>
                                    )}
                                  </div>
                                  {replica.uptime !== undefined && (
                                    <div className="flex items-center gap-1 text-xs text-default-600 mt-1">
                                      <Activity className="text-success" size={10} />
                                      <span>{replica.uptime}% uptime</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Resources (per replica)</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-default-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="text-primary" size={16} />
                            <span className="text-sm text-default-600">CPU</span>
                          </div>
                          <p className="text-lg font-bold">
                            {selectedService.service.resources.cpu} cores
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Total:{" "}
                            {selectedService.service.resources.cpu *
                              selectedService.service.replicas}{" "}
                            cores
                          </p>
                        </div>
                        <div className="p-3 bg-default-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <HardDrive className="text-secondary" size={16} />
                            <span className="text-sm text-default-600">Memory</span>
                          </div>
                          <p className="text-lg font-bold">
                            {selectedService.service.resources.memory} GB
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Total:{" "}
                            {selectedService.service.resources.memory *
                              selectedService.service.replicas}{" "}
                            GB
                          </p>
                        </div>
                        <div className="p-3 bg-default-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <HardDrive className="text-success" size={16} />
                            <span className="text-sm text-default-600">Storage</span>
                          </div>
                          <p className="text-lg font-bold">
                            {selectedService.service.resources.storage} GB
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Total:{" "}
                            {selectedService.service.resources.storage *
                              selectedService.service.replicas}{" "}
                            GB
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Deployment Details
                  <>
                    <div>
                      <h3 className="font-semibold mb-3">Deployment Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-default-600">Application</span>
                          <p className="font-medium">{selectedDeployment.application}</p>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Status</span>
                          <Chip
                            color={getStatusColor(selectedDeployment.status)}
                            size="sm"
                            variant="flat"
                          >
                            {selectedDeployment.status}
                          </Chip>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Price</span>
                          <p className="font-medium">{selectedDeployment.pricePerHour} SCU/hour</p>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Services</span>
                          <p className="font-medium">{selectedDeployment.services.length}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Services</h3>
                      <div className="space-y-2">
                        {selectedDeployment.services.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 bg-default-50 rounded"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{service.name}</span>
                                <Chip
                                  color={getStatusColor(service.status)}
                                  size="sm"
                                  variant="flat"
                                >
                                  {service.status}
                                </Chip>
                              </div>
                              <p className="text-xs text-default-600 font-mono mt-1">
                                {service.image}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => onViewService(selectedDeployment, service)}
                            >
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Resources</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-default-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="text-primary" size={16} />
                            <span className="text-sm text-default-600">CPU</span>
                          </div>
                          <p className="text-lg font-bold">
                            {selectedDeployment.totalResources.cpu} cores
                          </p>
                        </div>
                        <div className="p-3 bg-default-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <HardDrive className="text-secondary" size={16} />
                            <span className="text-sm text-default-600">Memory</span>
                          </div>
                          <p className="text-lg font-bold">
                            {selectedDeployment.totalResources.memory} GB
                          </p>
                        </div>
                        <div className="p-3 bg-default-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <HardDrive className="text-success" size={16} />
                            <span className="text-sm text-default-600">Storage</span>
                          </div>
                          <p className="text-lg font-bold">
                            {selectedDeployment.totalResources.storage} GB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">User</h3>
                      <div className="p-3 bg-default-50 rounded">
                        <p className="font-mono text-sm">{selectedDeployment.user.address}</p>
                        {selectedDeployment.user.name && (
                          <p className="text-sm text-default-600 mt-1">
                            {selectedDeployment.user.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Lease Information</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-default-600">Expires In</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock
                              className={
                                getRemainingTime(selectedDeployment.leaseEndAt, currentTs) === 0
                                  ? "text-danger"
                                  : getRemainingTime(selectedDeployment.leaseEndAt, currentTs) <
                                      1000 * 60 * 60 * 24
                                    ? "text-warning"
                                    : "text-default-400"
                              }
                              size={16}
                            />
                            <p
                                    className={`font-medium ${
                                      getRemainingTime(selectedDeployment.leaseEndAt, currentTs) === 0
                                        ? "text-danger"
                                        : getRemainingTime(selectedDeployment.leaseEndAt, currentTs) <
                                            1000 * 60 * 60 * 24
                                          ? "text-warning"
                                          : "text-default-900"
                                    }`}
                                  >
                                    {formatRemainingTime(selectedDeployment.leaseEndAt, currentTs)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Expiry Time</span>
                          <p className="text-sm font-medium">
                            {new Date(selectedDeployment.leaseEndAt).toLocaleString()}
                          </p>
                        </div>
                        {selectedDeployment.commitment && (
                          <div>
                            <span className="text-sm text-default-600">Commitment</span>
                            <p className="text-sm font-medium capitalize">
                              {selectedDeployment.commitment}
                            </p>
                          </div>
                        )}
                        {selectedDeployment.autoRenew !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-default-600">Auto-Renew</span>
                            <Chip
                              color={selectedDeployment.autoRenew ? "success" : "default"}
                              size="sm"
                              variant="flat"
                            >
                              {selectedDeployment.autoRenew ? "Enabled" : "Disabled"}
                            </Chip>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Timestamps</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-default-600">Created</span>
                          <p className="text-sm">
                            {new Date(selectedDeployment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-default-600">Last Updated</span>
                          <p className="text-sm">
                            {new Date(selectedDeployment.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Close
              </Button>
              {selectedService && onStartService && onStopService && (
                <>
                  {selectedService.service.status === "running" ? (
                    <Button
                      color="warning"
                      startContent={<Square size={16} />}
                      variant="flat"
                      onPress={() => {
                        onStopService(selectedDeployment.id, selectedService.service.id);
                      }}
                    >
                      Stop Service
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      startContent={<Play size={16} />}
                      onPress={() => {
                        onStartService(selectedDeployment.id, selectedService.service.id);
                      }}
                    >
                      Start Service
                    </Button>
                  )}
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

