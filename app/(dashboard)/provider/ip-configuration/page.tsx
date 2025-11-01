"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Network, Globe, ArrowLeft } from "lucide-react";

export default function IpConfigurationPage() {
  const router = useRouter();

  const [publicIp, setPublicIp] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const validateIpAddress = (ip: string): boolean => {
    // IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (!ipv4Regex.test(ip)) return false;

    const parts = ip.split(".").map(Number);

    return parts.every((part) => part >= 0 && part <= 255);
  };

  const handleSave = async () => {
    if (!validateIpAddress(publicIp)) {
      alert("Please enter a valid public IP address");

      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("IP configuration saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Button
              className="mb-4"
              startContent={<ArrowLeft size={16} />}
              variant="light"
              onPress={() => router.push("/provider")}
            >
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Network className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-dark-on-white">
                  IP Configuration
                </h1>
                <p className="text-lg text-dark-on-white-muted">
                  Configure public IP address for your provider nodes
                </p>
              </div>
            </div>
            <Button
              color="primary"
              isLoading={isSaving}
              size="lg"
              startContent={!isSaving ? <Network size={20} /> : undefined}
              onPress={handleSave}
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>

        <Card className="subnet-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Network className="text-primary" size={20} />
              <h2 className="text-xl font-bold">IP Configuration</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-default-600">
                Configure your public IP address for provider nodes. If you
                don&apos;t have a public IP, you can purchase VPN IPs from{" "}
                <NextLink className="text-primary hover:underline" href="/vpn">
                  VPN Settings
                </NextLink>
                .
              </p>
            </div>

            {/* Public IP Configuration */}
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="public-ip-input"
                >
                  Public IP Address <span className="text-danger">*</span>
                </label>
                <Input
                  className="font-mono"
                  errorMessage={
                    publicIp.length > 0 && !validateIpAddress(publicIp)
                      ? "Invalid IP address format"
                      : undefined
                  }
                  id="public-ip-input"
                  isInvalid={
                    publicIp.length > 0 && !validateIpAddress(publicIp)
                  }
                  placeholder="203.0.113.0"
                  value={publicIp}
                  onChange={(e) => setPublicIp(e.target.value)}
                />
                <p className="text-xs text-default-500 mt-1">
                  Enter your public IP address that will be used for all
                  provider nodes
                </p>
              </div>

              <div className="bg-info-50 p-4 rounded-lg border border-info-200">
                <div className="flex items-start gap-3">
                  <Globe
                    className="text-info-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-info-900 mb-1">
                      Using Public IP
                    </h4>
                    <p className="text-sm text-info-700">
                      All your provider nodes will use this public IP address.
                      Make sure your infrastructure supports this configuration.
                      For VPN IPs, visit{" "}
                      <NextLink
                        className="text-info-900 font-semibold hover:underline"
                        href="/vpn"
                      >
                        VPN Settings
                      </NextLink>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
