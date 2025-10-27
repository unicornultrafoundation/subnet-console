"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Server } from "lucide-react";

interface ServiceBasicConfigProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function ServiceBasicConfig({
  service,
  onUpdateService,
}: ServiceBasicConfigProps) {
  const [showRegistryAuth, setShowRegistryAuth] = React.useState(false);

  return (
    <Card className="subnet-card">
      <CardHeader className="flex items-center gap-2">
        <Server className="text-primary" size={20} />
        <h3 className="text-lg font-semibold">Basic Configuration</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              label="Service Name"
              placeholder="my-service"
              value={service.name}
              onChange={(e) => onUpdateService("name", e.target.value)}
            />
          </div>
          <div className="w-24">
            <Input
              label="Replicas"
              placeholder="1"
              value={service.replicas?.toString() || "1"}
              onChange={(e) =>
                onUpdateService("replicas", parseInt(e.target.value) || 1)
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              label="Docker Image"
              placeholder="nginx:latest"
              value={service.image}
              onChange={(e) => onUpdateService("image", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                checked={showRegistryAuth}
                className="sr-only"
                type="checkbox"
                onChange={(e) => setShowRegistryAuth(e.target.checked)}
              />
              <div
                className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  showRegistryAuth
                    ? "bg-primary border-primary"
                    : "bg-background border-default-300 hover:border-primary/50"
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setShowRegistryAuth(!showRegistryAuth)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowRegistryAuth(!showRegistryAuth);
                  }
                }}
              >
                {showRegistryAuth && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      fillRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span
              className="text-sm text-default-600 cursor-pointer select-none"
              role="button"
              tabIndex={0}
              onClick={() => setShowRegistryAuth(!showRegistryAuth)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowRegistryAuth(!showRegistryAuth);
                }
              }}
            >
              Registry Auth
            </span>
          </div>
        </div>

        {showRegistryAuth && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-default-50 rounded-lg border border-default-200">
            <Input
              label="Registry URL"
              placeholder="registry.example.com"
              size="sm"
              value={service.registryUrl || ""}
              onChange={(e) => onUpdateService("registryUrl", e.target.value)}
            />
            <Input
              label="Username"
              placeholder="username"
              size="sm"
              value={service.registryUsername || ""}
              onChange={(e) =>
                onUpdateService("registryUsername", e.target.value)
              }
            />
            <Input
              label="Password"
              placeholder="password"
              size="sm"
              type="password"
              value={service.registryPassword || ""}
              onChange={(e) =>
                onUpdateService("registryPassword", e.target.value)
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input
            label="Command"
            placeholder="nginx -g 'daemon off;'"
            value={service.command || ""}
            onChange={(e) => onUpdateService("command", e.target.value)}
          />
          <Input
            label="Args"
            placeholder="['-c', '/etc/nginx/nginx.conf']"
            value={service.args || ""}
            onChange={(e) => onUpdateService("args", e.target.value)}
          />
        </div>
      </CardBody>
    </Card>
  );
}
