"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  MapPin,
  Users,
  Server,
  Activity,
  Shield,
  Clock,
  TrendingUp,
  Zap,
  Star,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
} from "lucide-react";

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: any;
}

const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  isOpen,
  onClose,
  provider,
}) => {
  if (!provider) return null;

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div>
            <h2 className="text-2xl font-bold text-default-900">
              {provider.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-default-600 mt-1">
              <MapPin size={16} />
              <span>{provider.region}</span>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Provider Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="text-yellow-500" size={20} />
                <span className="text-sm text-default-600">Rating</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {provider.rating}
              </div>
              <div className="text-xs text-default-500">/5.0</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="text-green-500" size={20} />
                <span className="text-sm text-default-600">Uptime</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {provider.uptime}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="text-blue-500" size={20} />
                <span className="text-sm text-default-600">Deployments</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {provider.activeDeployments || "1,247"}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="text-purple-500" size={20} />
                <span className="text-sm text-default-600">Capacity</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {provider.capacity || "87%"}
              </div>
            </div>
          </div>

          {/* Available Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default-900">
              Available Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="text-blue-500" size={20} />
                  <span className="font-medium text-default-700">
                    CPU Cores
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {provider.availableResources?.cpu || "128"} cores
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  {provider.cpuUtilization || "45%"} utilized
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MemoryStick className="text-green-500" size={20} />
                  <span className="font-medium text-default-700">Memory</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {provider.availableResources?.memory || "512"} GB
                </div>
                <div className="text-xs text-green-500 mt-1">
                  {provider.memoryUtilization || "62%"} utilized
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="text-purple-500" size={20} />
                  <span className="font-medium text-default-700">Storage</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {provider.availableResources?.storage || "10"} TB
                </div>
                <div className="text-xs text-purple-500 mt-1">
                  {provider.storageUtilization || "38%"} utilized
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="text-orange-500" size={20} />
                  <span className="font-medium text-default-700">GPU</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {provider.availableResources?.gpu || "8"} units
                </div>
                <div className="text-xs text-orange-500 mt-1">
                  {provider.gpuUtilization || "23%"} utilized
                </div>
              </div>
            </div>
          </div>

          {/* GPU Support Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default-900">
              GPU Support
            </h3>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="text-orange-500" size={16} />
                    <span className="font-medium text-default-700">
                      GPU Models
                    </span>
                  </div>
                  <div className="space-y-1">
                    {(
                      provider.gpuModels || [
                        "RTX 4090",
                        "RTX 4080",
                        "RTX 4070",
                        "Tesla V100",
                      ]
                    ).map((model: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700">
                        • {model}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick className="text-orange-500" size={16} />
                    <span className="font-medium text-default-700">
                      GPU Memory
                    </span>
                  </div>
                  <div className="space-y-1">
                    {(
                      provider.gpuMemory || [
                        "24GB GDDR6X",
                        "16GB GDDR6X",
                        "12GB GDDR6X",
                        "32GB HBM2e",
                      ]
                    ).map((memory: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700">
                        • {memory}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-orange-500" size={16} />
                    <span className="font-medium text-default-700">
                      Interface
                    </span>
                  </div>
                  <div className="space-y-1">
                    {(
                      provider.gpuInterface || [
                        "PCIe 4.0 x16",
                        "PCIe 3.0 x16",
                        "NVLink",
                        "Infinity Fabric",
                      ]
                    ).map((gpuInterface: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700">
                        • {gpuInterface}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default-900">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-blue-500" size={16} />
                  <span className="font-medium text-default-700">
                    Response Time
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {provider.responseTime || "< 5min"}
                </div>
              </div>

              <div className="bg-white/60 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-500" size={16} />
                  <span className="font-medium text-default-700">
                    Success Rate
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {provider.successRate || "99.2%"}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {provider.features && provider.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-default-900">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.features.map((feature: string, index: number) => (
                  <Chip
                    key={index}
                    className="bg-primary/10"
                    color="primary"
                    size="md"
                    variant="flat"
                  >
                    {feature}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default-900">
              Trust & Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="text-green-500" size={20} />
                <div>
                  <div className="font-medium text-green-700">
                    Verified Provider
                  </div>
                  <div className="text-xs text-green-600">
                    Identity confirmed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="text-blue-500" size={20} />
                <div>
                  <div className="font-medium text-blue-700">High Uptime</div>
                  <div className="text-xs text-blue-600">Reliable service</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Zap className="text-purple-500" size={20} />
                <div>
                  <div className="font-medium text-purple-700">
                    Fast Response
                  </div>
                  <div className="text-xs text-purple-600">Quick support</div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={onClose}>
            Select Provider
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProviderDetailsModal;
