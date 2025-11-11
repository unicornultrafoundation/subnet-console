"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Node } from "@/types";

interface NodeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
}

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

export function NodeDetailsModal({
  isOpen,
  onClose,
  selectedNode,
}: NodeDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{selectedNode?.name || "Node Details"}</ModalHeader>
            <ModalBody>
              {selectedNode && (
                <div className="space-y-6">
                  <Tabs aria-label="Node details">
                    <Tab key="overview" title="Overview">
                      <div className="space-y-4 pt-4">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-default-600">
                            {selectedNode.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Cluster</h4>
                            <p className="text-default-600">
                              {selectedNode.clusterName || "N/A"}
                            </p>
                            {selectedNode.clusterId && (
                              <p className="text-xs text-default-500 font-mono">
                                {selectedNode.clusterId}
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Node Name</h4>
                            <p className="text-default-600 font-mono text-sm">
                              {selectedNode.nodeName || selectedNode.name}
                            </p>
                          </div>
                          {selectedNode.internalIp && (
                            <div>
                              <h4 className="font-semibold mb-2">Internal IP</h4>
                              <p className="text-default-600 font-mono text-sm">
                                {selectedNode.internalIp}
                              </p>
                            </div>
                          )}
                          {selectedNode.externalIp && (
                            <div>
                              <h4 className="font-semibold mb-2">External IP</h4>
                              <p className="text-default-600 font-mono text-sm">
                                {selectedNode.externalIp}
                              </p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold mb-2">Role</h4>
                            <Chip color="secondary" size="sm" variant="flat">
                              {selectedNode.role || "worker"}
                            </Chip>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Status</h4>
                            <Chip
                              color={getStatusColor(selectedNode.status)}
                              size="sm"
                              startContent={getStatusIcon(selectedNode.status)}
                              variant="flat"
                            >
                              {selectedNode.status}
                            </Chip>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Location</h4>
                            <p className="text-default-600">
                              {selectedNode.location.city},{" "}
                              {selectedNode.location.region},{" "}
                              {selectedNode.location.country}
                            </p>
                            {selectedNode.location.zone && (
                              <p className="text-xs text-default-500">
                                Zone: {selectedNode.location.zone}
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Uptime</h4>
                            <div className="flex items-center gap-2">
                              <Progress
                                className="flex-1"
                                color="success"
                                value={selectedNode.uptime}
                              />
                              <span className="text-sm font-semibold">
                                {selectedNode.uptime}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedNode.kubernetesVersion && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              Kubernetes Info
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-default-600">
                                  Version:
                                </span>{" "}
                                <span className="font-semibold">
                                  {selectedNode.kubernetesVersion}
                                </span>
                              </div>
                              <div>
                                <span className="text-default-600">
                                  Kubelet:
                                </span>{" "}
                                <span className="font-semibold">
                                  {selectedNode.kubeletVersion}
                                </span>
                              </div>
                              <div>
                                <span className="text-default-600">
                                  Container Runtime:
                                </span>{" "}
                                <span className="font-semibold">
                                  {selectedNode.containerRuntime}
                                </span>
                              </div>
                              <div>
                                <span className="text-default-600">
                                  OS Image:
                                </span>{" "}
                                <span className="font-semibold">
                                  {selectedNode.osImage}
                                </span>
                              </div>
                              <div>
                                <span className="text-default-600">
                                  Kernel:
                                </span>{" "}
                                <span className="font-semibold">
                                  {selectedNode.kernelVersion}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedNode.labels &&
                          Object.keys(selectedNode.labels).length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Labels</h4>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(selectedNode.labels).map(
                                  ([key, value]) => (
                                    <Chip
                                      key={key}
                                      className="font-mono text-xs"
                                      size="sm"
                                      variant="flat"
                                    >
                                      {key}
                                      {value && `: ${value}`}
                                    </Chip>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        {selectedNode.taints &&
                          selectedNode.taints.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Taints</h4>
                              <div className="space-y-2">
                                {selectedNode.taints.map((taint, index) => (
                                  <div
                                    key={index}
                                    className="p-2 rounded-lg bg-warning-50 border border-warning-200"
                                  >
                                    <div className="text-sm font-semibold">
                                      {taint.key}
                                      {taint.value && `: ${taint.value}`}
                                    </div>
                                    <div className="text-xs text-default-600">
                                      Effect: {taint.effect}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </Tab>
                    <Tab key="specs" title="Specifications">
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-lg bg-primary/5">
                          <div className="text-sm text-default-600 mb-1">
                            CPU Cores
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {selectedNode.specs.cpu}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/5">
                          <div className="text-sm text-default-600 mb-1">
                            Memory
                          </div>
                          <div className="text-2xl font-bold text-secondary">
                            {selectedNode.specs.memory} GB
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-warning-100">
                          <div className="text-sm text-default-600 mb-1">
                            Storage
                          </div>
                          <div className="text-2xl font-bold text-warning-600">
                            {selectedNode.specs.storage} GB
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-success-100">
                          <div className="text-sm text-default-600 mb-1">
                            Bandwidth
                          </div>
                          <div className="text-2xl font-bold text-success-600">
                            {selectedNode.specs.bandwidth} Mbps
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab key="pods" title="Pods">
                      <div className="pt-4 space-y-4">
                        {selectedNode.pods ? (
                          <>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="p-4 rounded-lg bg-success-100">
                                <div className="text-2xl font-bold text-success-600">
                                  {selectedNode.pods.running}
                                </div>
                                <div className="text-sm text-default-600">
                                  Running
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-warning-100">
                                <div className="text-2xl font-bold text-warning-600">
                                  {selectedNode.pods.pending}
                                </div>
                                <div className="text-sm text-default-600">
                                  Pending
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-danger-100">
                                <div className="text-2xl font-bold text-danger-600">
                                  {selectedNode.pods.failed}
                                </div>
                                <div className="text-sm text-default-600">
                                  Failed
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-default-100">
                                <div className="text-2xl font-bold text-default-600">
                                  {selectedNode.pods.succeeded}
                                </div>
                                <div className="text-sm text-default-600">
                                  Succeeded
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Pod Capacity
                              </h4>
                              <div className="flex items-center gap-2">
                                <Progress
                                  className="flex-1"
                                  color="primary"
                                  value={
                                    (selectedNode.pods.total /
                                      selectedNode.pods.capacity) *
                                    100
                                  }
                                />
                                <span className="text-sm font-semibold">
                                  {selectedNode.pods.total}/
                                  {selectedNode.pods.capacity}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-default-600 text-center py-8">
                            No pod information available
                          </p>
                        )}
                      </div>
                    </Tab>
                    <Tab key="metrics" title="Metrics">
                      <div className="pt-4 space-y-4">
                        {selectedNode.usage ? (
                          <>
                            <div>
                              <h4 className="font-semibold mb-2">CPU Usage</h4>
                              <div className="flex items-center gap-2">
                                <Progress
                                  className="flex-1"
                                  color="primary"
                                  value={selectedNode.usage.cpu}
                                />
                                <span className="text-sm font-semibold">
                                  {selectedNode.usage.cpu.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Memory Usage
                              </h4>
                              <div className="flex items-center gap-2">
                                <Progress
                                  className="flex-1"
                                  color="secondary"
                                  value={selectedNode.usage.memory}
                                />
                                <span className="text-sm font-semibold">
                                  {selectedNode.usage.memory.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Storage Usage
                              </h4>
                              <div className="flex items-center gap-2">
                                <Progress
                                  className="flex-1"
                                  color="warning"
                                  value={selectedNode.usage.storage}
                                />
                                <span className="text-sm font-semibold">
                                  {selectedNode.usage.storage}%
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-default-600 text-center py-8">
                            Real-time metrics and monitoring charts will be
                            displayed here
                          </p>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

