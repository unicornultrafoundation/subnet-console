"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";
import { Trash2 } from "lucide-react";
import { Node } from "@/types";

export interface EditNodeForm {
  name: string;
  description: string;
  clusterId: string;
  clusterName: string;
  roles: Array<"server" | "agent">;
  status: Node["status"];
  location: {
    country: string;
    region: string;
    city: string;
    zone: string;
  };
  labels: Array<{ key: string; value: string }>;
  taints: Array<{
    key: string;
    value: string;
    effect: "NoSchedule" | "PreferNoSchedule" | "NoExecute";
  }>;
}

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
  editNodeForm: EditNodeForm;
  onFormChange: (field: string, value: any) => void;
  onAddLabel: () => void;
  onRemoveLabel: (index: number) => void;
  onUpdateLabel: (index: number, key: string, value: string) => void;
  onAddTaint: () => void;
  onRemoveTaint: (index: number) => void;
  onUpdateTaint: (
    index: number,
    key: string,
    value: string | "NoSchedule" | "PreferNoSchedule" | "NoExecute",
  ) => void;
  onSave: () => void;
}

export function EditNodeModal({
  isOpen,
  onClose,
  selectedNode,
  editNodeForm,
  onFormChange,
  onAddLabel,
  onRemoveLabel,
  onUpdateLabel,
  onAddTaint,
  onRemoveTaint,
  onUpdateTaint,
  onSave,
}: EditNodeModalProps) {
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
            <ModalHeader>Edit Node: {selectedNode?.name || ""}</ModalHeader>
            <ModalBody>
              {selectedNode && (
                <div className="space-y-6">
                  <Tabs aria-label="Edit node configuration">
                    <Tab key="basic" title="Basic Info">
                      <div className="space-y-4 pt-4">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-default-600">
                            <strong>Node ID:</strong> {selectedNode.id}
                          </p>
                          {selectedNode.nodeName && (
                            <p className="text-sm text-default-600 mt-1">
                              <strong>Kubernetes Node:</strong>{" "}
                              <span className="font-mono text-xs">
                                {selectedNode.nodeName}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Node Name <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="worker-node-01"
                              value={editNodeForm.name}
                              onChange={(e) =>
                                onFormChange("name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Node Roles <span className="text-danger">*</span>
                            </label>
                            <Select
                              selectionMode="multiple"
                              selectedKeys={new Set(editNodeForm.roles)}
                              onSelectionChange={(keys) => {
                                const selectedRoles = Array.from(keys) as Array<
                                  "server" | "agent"
                                >;
                                onFormChange("roles", selectedRoles);
                              }}
                            >
                              <SelectItem key="server">
                                Server (Control Plane)
                              </SelectItem>
                              <SelectItem key="agent">Agent (Worker)</SelectItem>
                            </Select>
                            <p className="text-xs text-default-500 mt-1">
                              k3s has two node types: Server (control-plane) and
                              Agent (worker)
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Node description..."
                            value={editNodeForm.description}
                            onChange={(e) =>
                              onFormChange("description", e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Cluster Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="Production Cluster"
                              value={editNodeForm.clusterName}
                              onChange={(e) =>
                                onFormChange("clusterName", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Cluster ID
                            </label>
                            <Input
                              placeholder="cluster-prod-01"
                              value={editNodeForm.clusterId}
                              onChange={(e) =>
                                onFormChange("clusterId", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Status
                          </label>
                          <Select
                            selectedKeys={[editNodeForm.status]}
                            onSelectionChange={(keys) => {
                              onFormChange(
                                "status",
                                Array.from(keys)[0] as Node["status"],
                              );
                            }}
                          >
                            <SelectItem key="active">Active</SelectItem>
                            <SelectItem key="inactive">Inactive</SelectItem>
                            <SelectItem key="maintenance">Maintenance</SelectItem>
                            <SelectItem key="offline">Offline</SelectItem>
                          </Select>
                        </div>
                      </div>
                    </Tab>

                    <Tab key="location" title="Location">
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Country
                            </label>
                            <Input
                              placeholder="USA"
                              value={editNodeForm.location.country}
                              onChange={(e) =>
                                onFormChange("location.country", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Region
                            </label>
                            <Input
                              placeholder="North America"
                              value={editNodeForm.location.region}
                              onChange={(e) =>
                                onFormChange("location.region", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              City
                            </label>
                            <Input
                              placeholder="San Francisco"
                              value={editNodeForm.location.city}
                              onChange={(e) =>
                                onFormChange("location.city", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Zone
                            </label>
                            <Input
                              placeholder="us-west-2a"
                              value={editNodeForm.location.zone}
                              onChange={(e) =>
                                onFormChange("location.zone", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab key="labels" title="Labels & Taints">
                      <div className="space-y-6 pt-4">
                        {/* Labels Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium">
                              Labels
                            </label>
                            <Button size="sm" variant="flat" onPress={onAddLabel}>
                              Add Label
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {editNodeForm.labels.map((label, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  className="flex-1"
                                  placeholder="Key"
                                  value={label.key}
                                  onChange={(e) =>
                                    onUpdateLabel(index, "key", e.target.value)
                                  }
                                />
                                <Input
                                  className="flex-1"
                                  placeholder="Value (optional)"
                                  value={label.value}
                                  onChange={(e) =>
                                    onUpdateLabel(
                                      index,
                                      "value",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  variant="light"
                                  onPress={() => onRemoveLabel(index)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))}
                            {editNodeForm.labels.length === 0 && (
                              <p className="text-sm text-default-500 text-center py-4">
                                No labels. Click "Add Label" to add one.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Taints Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium">
                              Taints
                            </label>
                            <Button size="sm" variant="flat" onPress={onAddTaint}>
                              Add Taint
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {editNodeForm.taints.map((taint, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  className="flex-1"
                                  placeholder="Key"
                                  value={taint.key}
                                  onChange={(e) =>
                                    onUpdateTaint(index, "key", e.target.value)
                                  }
                                />
                                <Input
                                  className="flex-1"
                                  placeholder="Value (optional)"
                                  value={taint.value}
                                  onChange={(e) =>
                                    onUpdateTaint(index, "value", e.target.value)
                                  }
                                />
                                <Select
                                  className="w-40"
                                  selectedKeys={[taint.effect]}
                                  onSelectionChange={(keys) => {
                                    onUpdateTaint(
                                      index,
                                      "effect",
                                      Array.from(keys)[0] as
                                        | "NoSchedule"
                                        | "PreferNoSchedule"
                                        | "NoExecute",
                                    );
                                  }}
                                >
                                  <SelectItem key="NoSchedule">
                                    NoSchedule
                                  </SelectItem>
                                  <SelectItem key="PreferNoSchedule">
                                    PreferNoSchedule
                                  </SelectItem>
                                  <SelectItem key="NoExecute">
                                    NoExecute
                                  </SelectItem>
                                </Select>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  variant="light"
                                  onPress={() => onRemoveTaint(index)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))}
                            {editNodeForm.taints.length === 0 && (
                              <p className="text-sm text-default-500 text-center py-4">
                                No taints. Click "Add Taint" to add one.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab key="info" title="Node Info">
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Kubernetes Version
                            </h4>
                            <p className="text-default-600">
                              {selectedNode.kubernetesVersion || "N/A"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">
                              Container Runtime
                            </h4>
                            <p className="text-default-600">
                              {selectedNode.containerRuntime || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">OS Image</h4>
                            <p className="text-default-600">
                              {selectedNode.osImage || "N/A"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">
                              Kernel Version
                            </h4>
                            <p className="text-default-600 font-mono text-sm">
                              {selectedNode.kernelVersion || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div>
                            <h4 className="font-semibold mb-2">CPU Cores</h4>
                            <p className="text-2xl font-bold text-primary">
                              {selectedNode.specs.cpu}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Memory</h4>
                            <p className="text-2xl font-bold text-secondary">
                              {selectedNode.specs.memory} GB
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Storage</h4>
                            <p className="text-2xl font-bold text-warning">
                              {selectedNode.specs.storage} GB
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-semibold mb-2">Usage</h4>
                          {selectedNode.usage && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">CPU</span>
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.cpu}%
                                  </span>
                                </div>
                                <Progress
                                  className="h-2"
                                  color="primary"
                                  value={selectedNode.usage.cpu}
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Memory</span>
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.memory}%
                                  </span>
                                </div>
                                <Progress
                                  className="h-2"
                                  color="secondary"
                                  value={selectedNode.usage.memory}
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Storage</span>
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.storage}%
                                  </span>
                                </div>
                                <Progress
                                  className="h-2"
                                  color="warning"
                                  value={selectedNode.usage.storage}
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Pods</span>
                                  <span className="text-sm font-semibold">
                                    {selectedNode.usage.pods}%
                                  </span>
                                </div>
                                <Progress
                                  className="h-2"
                                  color="success"
                                  value={selectedNode.usage.pods}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onSave}>
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

