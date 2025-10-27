"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Heart, Server, Cpu, HardDrive, MemoryStick, Gpu } from "lucide-react";

import ApplicationConfiguration from "./ApplicationConfiguration";

interface ConfigurationProps {
  applications: any[];
  deploymentMode: string;
  favouriteApps: string[];
  selectedApp: string;
  selectedTemplate: any;
  services: any[];
  onAddService: () => void;
  onApplicationSelect: (appId: string) => void;
  onRemoveService: (serviceName: string) => void;
  onToggleFavouriteApp: (appId: string) => void;
  onUpdateService: (serviceName: string, field: string, value: any) => void;
  hideApplicationSelection?: boolean;
}

export default function Configuration({
  applications,
  deploymentMode,
  favouriteApps,
  selectedApp,
  selectedTemplate,
  services,
  onAddService,
  onApplicationSelect,
  onRemoveService,
  onToggleFavouriteApp,
  onUpdateService,
  hideApplicationSelection = false,
}: ConfigurationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter applications based on search term and category
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || app.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    ...new Set(applications.map((app) => app.category).filter(Boolean)),
  ];

  return (
    <div className="space-y-6">
      {/* Available Applications */}
      {!hideApplicationSelection && (
        <Card className="subnet-card">
          <CardHeader className="flex items-center gap-2">
            <Server className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Available Applications</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-default-600">
              Choose from pre-built applications or create your own custom
              deployment.
            </p>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <Input
                className="flex-1"
                placeholder="Search applications..."
                startContent={<Server size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                className="w-48"
                placeholder="All Categories"
                selectedKeys={selectedCategory ? [selectedCategory] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  setSelectedCategory(selected || "");
                }}
              >
                <SelectItem key="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category}>{category}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Applications Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map((app) => (
                <Card
                  key={app.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedApp === app.id
                      ? "ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => onApplicationSelect(app.id)}
                >
                  <CardHeader className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Chip color="primary" size="sm" variant="flat">
                          {app.category || "Custom"}
                        </Chip>
                        <Button
                          isIconOnly
                          color={
                            favouriteApps.includes(app.id)
                              ? "danger"
                              : "default"
                          }
                          size="sm"
                          variant="light"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavouriteApp(app.id);
                          }}
                        >
                          <Heart
                            fill={
                              favouriteApps.includes(app.id)
                                ? "currentColor"
                                : "none"
                            }
                            size={14}
                          />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-default-900 mb-1">
                        {app.name}
                      </h3>
                      <p className="text-sm text-default-600 mb-2">
                        {app.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-default-500">
                        <div className="flex items-center gap-1">
                          <Cpu className="text-primary" size={14} />
                          <span>
                            {app.resources?.cpu
                              ? typeof app.resources.cpu === "string"
                                ? app.resources.cpu
                                : (app.resources.cpu as any)?.units
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MemoryStick className="text-primary" size={14} />
                          <span>
                            {app.resources?.memory
                              ? typeof app.resources.memory === "string"
                                ? app.resources.memory
                                : (app.resources.memory as any)?.size
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="text-primary" size={14} />
                          <span>
                            {app.resources?.storage
                              ? typeof app.resources.storage === "string"
                                ? app.resources.storage
                                : (app.resources.storage as any)?.[0]?.size
                              : "N/A"}
                          </span>
                        </div>
                        {(app.resources as any)?.gpu && (
                          <div className="flex items-center gap-1">
                            <Gpu className="text-primary" size={14} />
                            <span>
                              {typeof (app.resources as any).gpu === "string"
                                ? (app.resources as any).gpu
                                : `${(app.resources as any).gpu?.units || 0} ${(app.resources as any).gpu?.model || "GPU"}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Application Configuration */}
      {selectedApp && (
        <ApplicationConfiguration
          services={services}
          onRemoveService={onRemoveService}
          onUpdateService={onUpdateService}
        />
      )}
    </div>
  );
}
