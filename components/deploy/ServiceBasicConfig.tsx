"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Server } from "lucide-react";

interface ServiceBasicConfigProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function ServiceBasicConfig({ service, onUpdateService }: ServiceBasicConfigProps) {
  const [showRegistryAuth, setShowRegistryAuth] = React.useState(false);

  return (
    <Card className="subnet-card">
      <CardHeader className="flex items-center gap-2">
        <Server className="text-primary" size={20} />
        <h3 className="text-lg font-semibold">Basic Configuration</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input
            label="Service Name"
            placeholder="my-service"
            value={service.name}
            onChange={(e) => onUpdateService("name", e.target.value)}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Docker Image"
                placeholder="nginx:latest"
                value={service.image}
                onChange={(e) => onUpdateService("image", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showRegistryAuth}
                  onChange={(e) => setShowRegistryAuth(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    showRegistryAuth
                      ? 'bg-primary border-primary'
                      : 'bg-background border-default-300 hover:border-primary/50'
                  }`}
                  onClick={() => setShowRegistryAuth(!showRegistryAuth)}
                >
                  {showRegistryAuth && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <label
                className="text-sm text-default-600 cursor-pointer select-none"
                onClick={() => setShowRegistryAuth(!showRegistryAuth)}
              >
                Registry Auth
              </label>
            </div>
          </div>
        </div>

        {showRegistryAuth && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-default-50 rounded-lg border border-default-200">
            <Input
              label="Registry URL"
              placeholder="registry.example.com"
              value={service.registryUrl || ""}
              onChange={(e) => onUpdateService("registryUrl", e.target.value)}
              size="sm"
            />
            <Input
              label="Username"
              placeholder="username"
              value={service.registryUsername || ""}
              onChange={(e) => onUpdateService("registryUsername", e.target.value)}
              size="sm"
            />
            <Input
              label="Password"
              placeholder="password"
              type="password"
              value={service.registryPassword || ""}
              onChange={(e) => onUpdateService("registryPassword", e.target.value)}
              size="sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input
            label="Replicas"
            placeholder="1"
            value={service.replicas?.toString() || "1"}
            onChange={(e) => onUpdateService("replicas", parseInt(e.target.value) || 1)}
          />
        </div>
      </CardBody>
    </Card>
  );
}
