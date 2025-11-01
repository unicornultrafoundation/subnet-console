"use client";

import NextLink from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Network } from "lucide-react";

import { ProviderConfig } from "./types";

interface NetworkTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
  validateIpAddress: (ip: string) => boolean;
  validateDomain: (domain: string) => boolean;
  generateIngressDomain: (
    serviceName: string,
    deploymentName: string,
  ) => string;
}

export function NetworkTab({
  config,
  updateConfig,
  validateIpAddress,
  validateDomain,
  generateIngressDomain,
}: NetworkTabProps) {
  return (
    <Card className="subnet-card mt-4">
      <CardBody className="space-y-6">
        {/* Network Configuration */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <Network className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Network Configuration</h3>
              <p className="text-sm text-default-600 mb-4">
                Configure IP address and ingress domain for service routing
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Public IP or VPN IP <span className="text-danger">*</span>
                  </label>
                  <Input
                    className="font-mono text-sm"
                    errorMessage={
                      config.ip.length > 0 && !validateIpAddress(config.ip)
                        ? "Invalid IP address format"
                        : undefined
                    }
                    isInvalid={
                      config.ip.length > 0 && !validateIpAddress(config.ip)
                    }
                    placeholder="203.0.113.0 or VPN IP"
                    value={config.ip}
                    onChange={(e) => updateConfig("ip", e.target.value)}
                  />
                  <p className="text-xs text-default-500 mt-1">
                    Public IP address of your provider, or VPN IP from{" "}
                    <NextLink
                      className="text-primary hover:underline"
                      href="/vpn"
                    >
                      VPN Settings
                    </NextLink>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ingress Domain{" "}
                    <span className="text-default-500">(optional)</span>
                  </label>
                  <Input
                    className="font-mono text-sm"
                    errorMessage={
                      config.ingressDomain.length > 0 &&
                      !validateDomain(config.ingressDomain)
                        ? "Invalid domain format"
                        : undefined
                    }
                    isInvalid={
                      config.ingressDomain.length > 0 &&
                      !validateDomain(config.ingressDomain)
                    }
                    placeholder="subnet.example.com"
                    value={config.ingressDomain}
                    onChange={(e) =>
                      updateConfig("ingressDomain", e.target.value)
                    }
                  />
                  <p className="text-xs text-default-500 mt-1">
                    Base domain for service ingress. Services will be accessible
                    at:
                    <br />
                    <code className="text-xs bg-default-100 px-2 py-1 rounded">
                      {
                        "{service-name}-{deployment-name}.{ingress-domain}-{random-8-chars}"
                      }
                    </code>
                  </p>

                  {config.ingressDomain && (
                    <div className="mt-3 p-3 bg-info-50 rounded-lg border border-info-200">
                      <p className="text-xs font-semibold text-info-900 mb-2">
                        Example Ingress Domain:
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-info-700 font-mono">
                          {generateIngressDomain("Web-Server", "web") ||
                            "Enter ingress domain to see example"}
                        </p>
                        <p className="text-xs text-info-600">
                          Service: "Web-Server", Deployment: "web"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
