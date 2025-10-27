"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { HardDrive, Plus, Trash2 } from "lucide-react";

// Volume Units
const VOLUME_UNITS = [
  { id: "GB", name: "GB" },
  { id: "MB", name: "MB" },
  { id: "Gi", name: "Gi" },
  { id: "Mi", name: "Mi" },
];

// Volume Types
const VOLUME_TYPES = [
  { id: "ssd", name: "SSD" },
  { id: "nvme", name: "NVMe" },
  { id: "hdd", name: "HDD" },
];

interface VolumeConfigurationProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function VolumeConfiguration({
  service,
  onUpdateService,
}: VolumeConfigurationProps) {
  const handleAddVolume = () => {
    const newVolume = {
      name: "",
      size: "1GB",
      type: "ssd",
      mountPath: "",
      readOnly: false,
    };

    const currentVolumes = service.volumes || [];

    onUpdateService("volumes", [...currentVolumes, newVolume]);
  };

  const handleRemoveVolume = (index: number) => {
    const currentVolumes = service.volumes || [];
    const newVolumes = currentVolumes.filter(
      (_: any, i: number) => i !== index,
    );

    onUpdateService("volumes", newVolumes);
  };

  const handleUpdateVolume = (index: number, field: string, value: any) => {
    const currentVolumes = service.volumes || [];
    const newVolumes = [...currentVolumes];

    newVolumes[index] = { ...newVolumes[index], [field]: value };
    onUpdateService("volumes", newVolumes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="text-primary" size={16} />
          <span className="text-sm font-medium text-default-700">
            Volume Configuration
          </span>
        </div>
        <Button
          color="primary"
          size="sm"
          startContent={<Plus size={14} />}
          variant="bordered"
          onClick={handleAddVolume}
        >
          Add Volume
        </Button>
      </div>

      {service.volumes?.length > 0 && (
        <div className="space-y-3">
          {service.volumes.map((volume: any, index: number) => (
            <div
              key={index}
              className="p-4 bg-default-50 rounded-lg border border-default-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="text-primary" size={16} />
                  <span className="text-sm font-medium">
                    Volume {index + 1}
                  </span>
                </div>
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="light"
                  onClick={() => handleRemoveVolume(index)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-default-600 mb-1 block">
                    Volume Name
                  </label>
                  <Input
                    placeholder="my-volume"
                    size="sm"
                    value={volume.name}
                    onChange={(e) =>
                      handleUpdateVolume(index, "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-default-600 mb-1 block">
                    Type
                  </label>
                  <Select
                    aria-label="Select volume type"
                    selectedKeys={[
                      volume.type &&
                      VOLUME_TYPES.find((t) => t.id === volume.type)
                        ? volume.type
                        : "ssd",
                    ]}
                    size="sm"
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;

                      handleUpdateVolume(index, "type", selected);
                    }}
                  >
                    {VOLUME_TYPES.map((type) => (
                      <SelectItem key={type.id}>{type.name}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-sm text-default-600 mb-1 block">
                    Size
                  </label>
                  <Input
                    placeholder="1"
                    size="sm"
                    value={volume.size.replace(/[^\d.]/g, "")}
                    onChange={(e) => {
                      const value = e.target.value;
                      const unit = volume.size.replace(/[\d.]/g, "") || "GB";

                      handleUpdateVolume(index, "size", `${value}${unit}`);
                    }}
                  />
                </div>
                <div className="w-24">
                  <label className="text-sm text-default-600 mb-1 block">
                    Unit
                  </label>
                  <Select
                    aria-label="Select volume size unit"
                    selectedKeys={[volume.size.replace(/[\d.]/g, "") || "GB"]}
                    size="sm"
                    onSelectionChange={(keys) => {
                      const newUnit = Array.from(keys)[0] as string;
                      const value = volume.size.replace(/[^\d.]/g, "");

                      handleUpdateVolume(index, "size", `${value}${newUnit}`);
                    }}
                  >
                    {VOLUME_UNITS.map((unit) => (
                      <SelectItem key={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-default-600 mb-1 block">
                  Mount Path
                </label>
                <Input
                  placeholder="/data"
                  size="sm"
                  value={volume.mountPath}
                  onChange={(e) =>
                    handleUpdateVolume(index, "mountPath", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  checked={volume.readOnly}
                  className="rounded border-default-300"
                  id={`readonly-${index}`}
                  type="checkbox"
                  onChange={(e) =>
                    handleUpdateVolume(index, "readOnly", e.target.checked)
                  }
                />
                <label
                  className="text-sm text-default-600 cursor-pointer select-none"
                  htmlFor={`readonly-${index}`}
                >
                  Read Only
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
