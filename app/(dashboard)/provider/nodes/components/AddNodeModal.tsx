"use client";

import { useEffect } from "react";
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
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Server,
  Activity,
  XCircle,
  Trash2,
} from "lucide-react";
import { Node } from "@/types";

export interface NewNodeForm {
  target: "host" | "remote";
  serverIP: string;
  sshPort: string;
  sshUser: string;
  sshKey: string;
  sshPassword: string;
  authMethod: "key" | "password";
  name: string;
  description: string;
  clusterId: string;
  clusterName: string;
  roles: Array<"server" | "agent">;
  k3sVersion: string;
  installMode: "server" | "agent";
  serverURL: string;
  token: string;
  flannelBackend: "vxlan" | "host-gw" | "wireguard";
  disableComponents: string[];
  location: {
    country: string;
    region: string;
    city: string;
    zone: string;
  };
  specs: {
    cpu: string;
    memory: string;
    storage: string;
    bandwidth: string;
    pods: string;
  };
  labels: Array<{ key: string; value: string }>;
  taints: Array<{
    key: string;
    value: string;
    effect: "NoSchedule" | "PreferNoSchedule" | "NoExecute";
  }>;
}

export interface InstallationStatus {
  step: string;
  status:
    | "idle"
    | "connecting"
    | "installing"
    | "configuring"
    | "verifying"
    | "success"
    | "error";
  message: string;
  logs: string[];
  jobId?: string;
}

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newNodeForm: NewNodeForm;
  onFormChange: (field: string, value: any) => void;
  currentStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  installationStatus: InstallationStatus;
  onInstallK3s: () => void;
  onTestConnection: () => void;
  existingNodes: Node[];
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
  cloudZones: Array<{ region: string; zones: string[] }>;
}

export function AddNodeModal({
  isOpen,
  onClose,
  newNodeForm,
  onFormChange,
  currentStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  installationStatus,
  onInstallK3s,
  onTestConnection,
  existingNodes,
  onAddLabel,
  onRemoveLabel,
  onUpdateLabel,
  onAddTaint,
  onRemoveTaint,
  onUpdateTaint,
  cloudZones,
}: AddNodeModalProps) {
  const stepNames = [
    "Target",
    ...(newNodeForm.target === "remote" ? ["Connection"] : []),
    "Node Config",
    "Review",
  ];

  // Auto-generate node name, cluster name, and cluster ID when entering Node Config step
  useEffect(() => {
    const isNodeConfigStep = 
      (newNodeForm.target === "host" && currentStep === 2) ||
      (newNodeForm.target === "remote" && currentStep === 3);
    
    if (isNodeConfigStep && isOpen) {
      // Auto-generate node name if empty
      if (!newNodeForm.name) {
        const timestamp = Date.now().toString().slice(-6);
        const nodeName = `k3s-node-${timestamp}`;
        onFormChange("name", nodeName);
      }
      
      // Auto-generate cluster name and ID if no existing nodes and fields are empty
      if (existingNodes.length === 0) {
        if (!newNodeForm.clusterName) {
          const timestamp = Date.now().toString().slice(-6);
          const nodeName = newNodeForm.name || `k3s-node-${timestamp}`;
          const clusterNameBase = nodeName.replace("k3s-", "k3s-cluster-");
          onFormChange("clusterName", clusterNameBase);
        }
        if (!newNodeForm.clusterId) {
          const nodeName = newNodeForm.name || `k3s-node-${Date.now().toString().slice(-6)}`;
          onFormChange("clusterId", `cluster-${nodeName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`);
        }
      }
    }
  }, [currentStep, isOpen, newNodeForm.target, newNodeForm.name, newNodeForm.clusterName, newNodeForm.clusterId, existingNodes.length, onFormChange]);

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
            <ModalHeader>
              <div className="w-full">
                <h2 className="text-xl font-bold">Add New k3s Node</h2>
                <p className="text-sm text-default-600 mt-1">
                  Step {currentStep} of {totalSteps}
                </p>
                {/* Progress Bar */}
                <div className="mt-4">
                  <Progress
                    value={(currentStep / totalSteps) * 100}
                    className="w-full"
                    color="primary"
                  />
                </div>
                {/* Step Indicators */}
                <div className="flex items-center justify-between mt-4">
                  {stepNames.map((stepName, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;
                    return (
                      <div
                        key={stepNum}
                        className={`flex flex-col items-center flex-1 ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                              ? "text-success"
                              : "text-default-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                            isActive
                              ? "bg-primary text-white"
                              : isCompleted
                                ? "bg-success text-white"
                                : "bg-default-200"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={16} />
                          ) : (
                            stepNum
                          )}
                        </div>
                        <span className="text-xs mt-1 text-center">
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Step 1: Target */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Step 1: Select Target
                    </h3>
                    <p className="text-sm text-default-600 mb-4">
                      Choose whether to install k3s on the local host or a remote
                      server.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Target <span className="text-danger">*</span>
                        </label>
                        <Select
                          selectedKeys={[newNodeForm.target]}
                          onSelectionChange={(keys) => {
                            onFormChange(
                              "target",
                              Array.from(keys)[0] as "host" | "remote",
                            );
                          }}
                        >
                          <SelectItem key="host">Host</SelectItem>
                          <SelectItem key="remote">Remote</SelectItem>
                        </Select>
                      </div>

                      {newNodeForm.target === "remote" && (
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-default-600 mb-2">
                            <strong>How it works:</strong> Enter your server SSH
                            credentials. The system will automatically connect,
                            install k3s, and configure the node.
                          </p>
                        </div>
                      )}

                      {newNodeForm.target === "host" && (
                        <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                          <p className="text-sm text-default-600 mb-2">
                            <strong>Host Mode:</strong> Installing k3s on the
                            local host machine. No SSH credentials required.
                          </p>
                        </div>
                      )}

                      {newNodeForm.target === "remote" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Server IP Address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="192.168.1.100"
                                value={newNodeForm.serverIP}
                                onChange={(e) =>
                                  onFormChange("serverIP", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                SSH Port
                              </label>
                              <Input
                                placeholder="22"
                                type="number"
                                value={newNodeForm.sshPort}
                                onChange={(e) =>
                                  onFormChange("sshPort", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              SSH User
                            </label>
                            <Input
                              placeholder="root"
                              value={newNodeForm.sshUser}
                              onChange={(e) =>
                                onFormChange("sshUser", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Authentication Method
                            </label>
                            <Select
                              selectedKeys={[newNodeForm.authMethod]}
                              onSelectionChange={(keys) => {
                                onFormChange(
                                  "authMethod",
                                  Array.from(keys)[0] as "key" | "password",
                                );
                              }}
                            >
                              <SelectItem key="key">SSH Key</SelectItem>
                              <SelectItem key="password">Password</SelectItem>
                            </Select>
                          </div>

                          {newNodeForm.authMethod === "key" ? (
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                SSH Private Key{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                                value={newNodeForm.sshKey}
                                onChange={(e) =>
                                  onFormChange("sshKey", e.target.value)
                                }
                              />
                              <p className="text-xs text-default-500 mt-1">
                                Paste your SSH private key here
                              </p>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                SSH Password{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Input
                                placeholder="Enter SSH password"
                                type="password"
                                value={newNodeForm.sshPassword}
                                onChange={(e) =>
                                  onFormChange("sshPassword", e.target.value)
                                }
                              />
                            </div>
                          )}

                          <Button
                            className="w-full"
                            color="primary"
                            variant="flat"
                            onPress={onTestConnection}
                          >
                            Test Connection
                          </Button>
                        </>
                      )}

                      {installationStatus.status !== "idle" &&
                        installationStatus.step === "Testing connection" && (
                          <Card className="subnet-card">
                            <CardBody className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Activity
                                    className="text-primary"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium">
                                    {installationStatus.message}
                                  </span>
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {installationStatus.logs.map((log, idx) => (
                                    <p
                                      key={idx}
                                      className="text-xs text-default-600 font-mono"
                                    >
                                      {log}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        )}
                    </div>
                  </div>
                )}

                {/* Step 2: Connection (only for remote) */}
                {currentStep === 2 && newNodeForm.target === "remote" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Step 2: Server Connection
                    </h3>
                    <p className="text-sm text-default-600 mb-4">
                      Enter SSH credentials to connect to the remote server.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-default-600 mb-2">
                          <strong>How it works:</strong> Enter your server SSH
                          credentials. The system will automatically connect,
                          install k3s, and configure the node.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Server IP Address{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Input
                            placeholder="192.168.1.100"
                            value={newNodeForm.serverIP}
                            onChange={(e) =>
                              onFormChange("serverIP", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            SSH Port
                          </label>
                          <Input
                            placeholder="22"
                            type="number"
                            value={newNodeForm.sshPort}
                            onChange={(e) =>
                              onFormChange("sshPort", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          SSH User
                        </label>
                        <Input
                          placeholder="root"
                          value={newNodeForm.sshUser}
                          onChange={(e) =>
                            onFormChange("sshUser", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Authentication Method
                        </label>
                        <Select
                          selectedKeys={[newNodeForm.authMethod]}
                          onSelectionChange={(keys) => {
                            onFormChange(
                              "authMethod",
                              Array.from(keys)[0] as "key" | "password",
                            );
                          }}
                        >
                          <SelectItem key="key">SSH Key</SelectItem>
                          <SelectItem key="password">Password</SelectItem>
                        </Select>
                      </div>

                      {newNodeForm.authMethod === "key" ? (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            SSH Private Key{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-default-200 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                            placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                            value={newNodeForm.sshKey}
                            onChange={(e) =>
                              onFormChange("sshKey", e.target.value)
                            }
                          />
                          <p className="text-xs text-default-500 mt-1">
                            Paste your SSH private key here
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            SSH Password{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Input
                            placeholder="Enter SSH password"
                            type="password"
                            value={newNodeForm.sshPassword}
                            onChange={(e) =>
                              onFormChange("sshPassword", e.target.value)
                            }
                          />
                        </div>
                      )}

                      <Button
                        className="w-full"
                        color="primary"
                        variant="flat"
                        onPress={onTestConnection}
                      >
                        Test Connection
                      </Button>

                      {installationStatus.status !== "idle" &&
                        installationStatus.step === "Testing connection" && (
                          <Card className="subnet-card">
                            <CardBody className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Activity
                                    className="text-primary"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium">
                                    {installationStatus.message}
                                  </span>
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {installationStatus.logs.map((log, idx) => (
                                    <p
                                      key={idx}
                                      className="text-xs text-default-600 font-mono"
                                    >
                                      {log}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        )}
                    </div>
                  </div>
                )}

                {/* Step 2/3: Node Config */}
                {((newNodeForm.target === "host" && currentStep === 2) ||
                  (newNodeForm.target === "remote" && currentStep === 3)) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">
                      {newNodeForm.target === "host" ? "Step 2" : "Step 3"}: Node
                      Configuration
                    </h3>
                    <p className="text-sm text-default-600 mb-4">
                      Configure basic node information and cluster settings.
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Node Name <span className="text-danger">*</span>
                          </label>
                          <Input
                            placeholder="worker-node-01"
                            value={newNodeForm.name}
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
                            selectedKeys={new Set(newNodeForm.roles)}
                            onSelectionChange={(keys) => {
                              const selectedRoles = Array.from(keys) as Array<
                                "server" | "agent"
                              >;
                              onFormChange("roles", selectedRoles);
                              // Auto-set install mode based on roles
                              if (selectedRoles.includes("agent")) {
                                onFormChange("installMode", "agent");
                              } else if (selectedRoles.includes("server")) {
                                onFormChange("installMode", "server");
                              }
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
                          placeholder="Worker node description..."
                          value={newNodeForm.description}
                          onChange={(e) =>
                            onFormChange("description", e.target.value)
                          }
                        />
                      </div>

                      {existingNodes.length === 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Cluster Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="Production Cluster"
                              value={newNodeForm.clusterName}
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
                              value={newNodeForm.clusterId}
                              onChange={(e) =>
                                onFormChange("clusterId", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}
                      {existingNodes.length > 0 && (
                        <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                          <p className="text-sm text-default-600">
                            <strong>Cluster:</strong>{" "}
                            {existingNodes[0].clusterName || "N/A"}
                            {existingNodes[0].clusterId && (
                              <span className="ml-2 text-default-500">
                                (ID: {existingNodes[0].clusterId})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            Using cluster configuration from existing nodes
                          </p>
                        </div>
                      )}

                      {existingNodes.length === 0 && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Country
                              </label>
                              <Input
                                placeholder="USA"
                                value={newNodeForm.location.country}
                                onChange={(e) =>
                                  onFormChange(
                                    "location.country",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                City
                              </label>
                              <Input
                                placeholder="San Francisco"
                                value={newNodeForm.location.city}
                                onChange={(e) =>
                                  onFormChange("location.city", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Zone
                            </label>
                            <Select
                              placeholder="Select a zone"
                              selectedKeys={
                                newNodeForm.location.zone
                                  ? [newNodeForm.location.zone]
                                  : []
                              }
                              onSelectionChange={(keys) => {
                                const selectedZone = Array.from(keys)[0] as string;
                                onFormChange(
                                  "location.zone",
                                  selectedZone || "",
                                );
                              }}
                            >
                              {cloudZones.flatMap((regionGroup) =>
                                regionGroup.zones.map((zone) => (
                                  <SelectItem 
                                    key={zone} 
                                    textValue={`${zone} (${regionGroup.region})`}
                                  >
                                    {zone} ({regionGroup.region})
                                  </SelectItem>
                                )),
                              )}
                            </Select>
                            <p className="text-xs text-default-500 mt-1">
                              Select a zone for this node
                            </p>
                          </div>
                        </>
                      )}
                      {existingNodes.length > 0 && (
                        <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                          <p className="text-sm text-default-600 mb-2">
                            <strong>Location:</strong>
                          </p>
                          <div className="space-y-1 text-sm text-default-600">
                            {existingNodes[0].location.country && (
                              <p>
                                <strong>Country:</strong>{" "}
                                {existingNodes[0].location.country}
                              </p>
                            )}
                            {existingNodes[0].location.city && (
                              <p>
                                <strong>City:</strong>{" "}
                                {existingNodes[0].location.city}
                              </p>
                            )}
                            {existingNodes[0].location.zone && (
                              <p>
                                <strong>Zone:</strong>{" "}
                                {existingNodes[0].location.zone}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-default-500 mt-2">
                            Using location from existing nodes
                          </p>
                        </div>
                      )}

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
                          {newNodeForm.labels.map((label, index) => (
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
                                  onUpdateLabel(index, "value", e.target.value)
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
                          {newNodeForm.labels.length === 0 && (
                            <p className="text-sm text-default-500 text-center py-4">
                              No labels added. Click "Add Label" to add one.
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
                          {newNodeForm.taints.map((taint, index) => (
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
                                <SelectItem key="NoExecute">NoExecute</SelectItem>
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
                          {newNodeForm.taints.length === 0 && (
                            <p className="text-sm text-default-500 text-center py-4">
                              No taints added. Click "Add Taint" to add one.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3/4: Review & Install */}
                {((newNodeForm.target === "host" && currentStep === 3) ||
                  (newNodeForm.target === "remote" && currentStep === 4)) && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {/* Summary Text */}
                      <Card className="subnet-card">
                        <CardBody className="p-6">
                          <p className="text-base leading-relaxed text-default-700">
                            You are about to install k3s on{" "}
                            <span className="font-semibold text-primary">
                              {newNodeForm.target === "host"
                                ? "the local host"
                                : `remote server ${newNodeForm.serverIP || ""}`}
                            </span>{" "}
                            as a{" "}
                            <span className="font-semibold text-primary">
                              {newNodeForm.roles.join(" and ")}
                            </span>{" "}
                            node named{" "}
                            <span className="font-semibold text-primary">
                              {newNodeForm.name || "N/A"}
                            </span>
                            {newNodeForm.description && (
                              <> ({newNodeForm.description})</>
                            )}
                            .{" "}
                            {existingNodes.length === 0 ? (
                              <>
                                This will create a new cluster{" "}
                                <span className="font-semibold text-primary">
                                  {newNodeForm.clusterName || "N/A"}
                                </span>
                                {newNodeForm.clusterId && (
                                  <>
                                    {" "}(ID:{" "}
                                    <span className="font-semibold text-primary">
                                      {newNodeForm.clusterId}
                                    </span>
                                    )
                                  </>
                                )}{" "}
                                located in{" "}
                                <span className="font-semibold text-primary">
                                  {newNodeForm.location.city || "N/A"}
                                  {newNodeForm.location.country &&
                                    `, ${newNodeForm.location.country}`}
                                  {newNodeForm.location.zone &&
                                    ` (${newNodeForm.location.zone})`}
                                </span>
                                .
                              </>
                            ) : (
                              <>
                                This node will join the existing cluster{" "}
                                <span className="font-semibold text-primary">
                                  {existingNodes[0].clusterName ||
                                    newNodeForm.clusterName ||
                                    "N/A"}
                                </span>{" "}
                                in{" "}
                                <span className="font-semibold text-primary">
                                  {existingNodes[0].location.city ||
                                    newNodeForm.location.city ||
                                    "N/A"}
                                  {(existingNodes[0].location.country ||
                                    newNodeForm.location.country) &&
                                    `, ${
                                      existingNodes[0].location.country ||
                                      newNodeForm.location.country
                                    }`}
                                  {(existingNodes[0].location.zone ||
                                    newNodeForm.location.zone) &&
                                    ` (${
                                      existingNodes[0].location.zone ||
                                      newNodeForm.location.zone
                                    })`}
                                </span>
                                .
                              </>
                            )}
                            {newNodeForm.target === "remote" && (
                              <>
                                {" "}The installation will be performed via SSH
                                using{" "}
                                <span className="font-semibold text-primary">
                                  {newNodeForm.sshUser || "root"}
                                </span>{" "}
                                authentication.
                              </>
                            )}
                            {newNodeForm.roles.includes("agent") && (
                              <>
                                {" "}The node will automatically join the cluster
                                as an agent.
                              </>
                            )}
                            {newNodeForm.labels.length > 0 && (
                              <>
                                {" "}Labels:{" "}
                                {newNodeForm.labels.map((label, index) => (
                                  <span key={index}>
                                    <span className="font-semibold text-primary">
                                      {label.key}
                                      {label.value && `=${label.value}`}
                                    </span>
                                    {index < newNodeForm.labels.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                                .
                              </>
                            )}
                            {newNodeForm.taints.length > 0 && (
                              <>
                                {" "}Taints:{" "}
                                {newNodeForm.taints.map((taint, index) => (
                                  <span key={index}>
                                    <span className="font-semibold text-warning">
                                      {taint.key}
                                      {taint.value && `=${taint.value}`}:{" "}
                                      {taint.effect}
                                    </span>
                                    {index < newNodeForm.taints.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                                .
                              </>
                            )}
                          </p>
                        </CardBody>
                      </Card>

                      {/* Installation Status */}
                      {installationStatus.status !== "idle" && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Activity
                              className={
                                installationStatus.status === "success"
                                  ? "text-success"
                                  : installationStatus.status === "error"
                                    ? "text-danger"
                                    : "text-primary"
                              }
                              size={24}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">
                                {installationStatus.step}
                              </h4>
                              <p className="text-sm text-default-600">
                                {installationStatus.message}
                              </p>
                            </div>
                            {installationStatus.status === "success" && (
                              <CheckCircle className="text-success" size={24} />
                            )}
                            {installationStatus.status === "error" && (
                              <XCircle className="text-danger" size={24} />
                            )}
                          </div>

                          <Card className="subnet-card">
                            <CardHeader>
                              <h4 className="font-medium">Installation Logs</h4>
                            </CardHeader>
                            <CardBody>
                              <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
                                {installationStatus.logs.map((log, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-2 rounded ${
                                      log.includes("✓") || log.includes("✅")
                                        ? "bg-success-50 text-success-700"
                                        : log.includes("✗") ||
                                            log.includes("❌")
                                          ? "bg-danger-50 text-danger-700"
                                          : "bg-default-50 text-default-700"
                                    }`}
                                  >
                                    {log}
                                  </div>
                                ))}
                              </div>
                            </CardBody>
                          </Card>

                          {installationStatus.status === "success" && (
                            <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="text-success" size={20} />
                                <span className="font-semibold text-success-700">
                                  Installation Complete!
                                </span>
                              </div>
                              <p className="text-sm text-success-600">
                                k3s has been successfully installed and
                                configured on the server. The node will be added
                                to your cluster management.
                              </p>
                            </div>
                          )}

                          {installationStatus.status === "error" && (
                            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <XCircle className="text-danger" size={20} />
                                <span className="font-semibold text-danger-700">
                                  Installation Failed
                                </span>
                              </div>
                              <p className="text-sm text-danger-600">
                                Please check the logs above and try again.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button
                  variant="flat"
                  startContent={<ChevronLeft size={16} />}
                  onPress={onPrevStep}
                >
                  Previous
                </Button>
              )}
              {currentStep < totalSteps &&
                installationStatus.status === "idle" && (
                  <Button
                    color="primary"
                    endContent={<ChevronRight size={16} />}
                    onPress={onNextStep}
                  >
                    Next
                  </Button>
                )}
              {currentStep === totalSteps &&
                installationStatus.status === "idle" && (
                  <Button
                    color="primary"
                    startContent={<Server size={16} />}
                    onPress={onInstallK3s}
                  >
                    Install k3s
                  </Button>
                )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
