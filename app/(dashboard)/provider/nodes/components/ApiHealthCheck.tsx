"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Activity, AlertCircle } from "lucide-react";
import { subnetAgentClient } from "@/lib/api/subnet-agent";

interface ApiHealthCheckProps {
  status: "checking" | "needs-api-key" | "unhealthy";
  error: string | null;
  apiKeyInput: string;
  onApiKeyInputChange: (value: string) => void;
  onSaveApiKey: () => void;
  onRetry: () => void;
}

export function ApiHealthChecking() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="subnet-card max-w-md">
            <CardBody className="p-6 text-center">
              <Activity className="mx-auto mb-4 text-primary animate-pulse" size={48} />
              <h3 className="text-lg font-semibold mb-2">Checking API Connection</h3>
              <p className="text-sm text-default-600">
                Verifying Subnet Agent API health...
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ApiKeyRequired({
  apiKeyInput,
  onApiKeyInputChange,
  onSaveApiKey,
  error,
}: {
  apiKeyInput: string;
  onApiKeyInputChange: (value: string) => void;
  onSaveApiKey: () => void;
  error: string | null;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="subnet-card max-w-2xl">
            <CardBody className="p-6">
              <div className="text-center mb-6">
                <AlertCircle className="mx-auto mb-4 text-warning" size={48} />
                <h3 className="text-lg font-semibold mb-2">API Key Required</h3>
                <p className="text-sm text-default-600">
                  Please enter your Subnet Agent API key to manage nodes.
                </p>
              </div>

              <div className="bg-default-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3 text-sm">How to Get Your API Key:</h4>
                <div className="space-y-3 text-sm text-default-600">
                  <div>
                    <p className="font-semibold mb-1">Step 1: Open Subnet Agent</p>
                    <p>Make sure Subnet Agent is running on your computer.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Step 2: Access Settings</p>
                    <ul className="space-y-1 ml-4 list-disc">
                      <li><strong>Windows:</strong> Right-click the Subnet Agent icon in the system tray and select "Settings"</li>
                      <li><strong>macOS:</strong> Click the Subnet Agent icon in the menu bar and select "Settings"</li>
                      <li><strong>Linux:</strong> Open Subnet Agent and go to Settings menu</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Step 3: Find API Key</p>
                    <p>In the Settings window, look for the "API Key" section. You can either:</p>
                    <ul className="space-y-1 ml-4 list-disc mt-1">
                      <li>Copy the existing API key if one is already generated</li>
                      <li>Click "Generate New API Key" to create a new one</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Step 4: Copy and Paste</p>
                    <p>Copy the API key and paste it in the field below.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    API Key <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKeyInput}
                    onChange={(e) => onApiKeyInputChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && apiKeyInput.trim()) {
                        onSaveApiKey();
                      }
                    }}
                  />
                  <p className="text-xs text-default-500 mt-1">
                    This key will be stored locally in your browser for future use
                  </p>
                  {error && (
                    <p className="text-xs text-danger mt-2">
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  color="primary"
                  className="w-full"
                  isDisabled={!apiKeyInput.trim()}
                  onPress={onSaveApiKey}
                >
                  Save API Key
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ApiConnectionFailed({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="subnet-card max-w-2xl border-danger">
            <CardBody className="p-6">
              <div className="text-center mb-6">
                <AlertCircle className="mx-auto mb-4 text-danger" size={48} />
                <h3 className="text-lg font-semibold mb-2 text-danger">Unable to Connect to Subnet Agent</h3>
                <p className="text-sm text-default-600">
                  The system cannot connect to Subnet Agent. Please follow these steps:
                </p>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="bg-default-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">Step 1: Download and Install Subnet Agent</h4>
                  <p className="text-sm text-default-600 mb-3">
                    Download Subnet Agent for your operating system:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="w-full"
                      onPress={() => {
                        window.open("https://github.com/subnet/subnet-agent/releases/latest", "_blank");
                      }}
                    >
                      Windows
                    </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="w-full"
                      onPress={() => {
                        window.open("https://github.com/subnet/subnet-agent/releases/latest", "_blank");
                      }}
                    >
                      macOS
                    </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="w-full"
                      onPress={() => {
                        window.open("https://github.com/subnet/subnet-agent/releases/latest", "_blank");
                      }}
                    >
                      Linux
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm text-default-600">
                    <p className="font-semibold">Installation Instructions:</p>
                    <ul className="space-y-2 ml-4 list-disc">
                      <li><strong>Windows:</strong> Run the downloaded .exe installer and follow the on-screen instructions. Subnet Agent will automatically set up WSL2 if needed.</li>
                      <li><strong>macOS:</strong> Open the downloaded .dmg file, drag Subnet Agent to Applications folder, then run it from Applications.</li>
                      <li><strong>Linux:</strong> Extract the downloaded archive and run the install script, or use the package manager for your distribution.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-default-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Step 2: Start Subnet Agent</h4>
                  <p className="text-sm text-default-600 mb-2">
                    After installation, start the Subnet Agent program:
                  </p>
                  <ul className="text-sm text-default-600 space-y-1 ml-4 list-disc">
                    <li><strong>Windows:</strong> Find Subnet Agent in the Start menu or system tray</li>
                    <li><strong>macOS:</strong> Open Subnet Agent from Applications folder</li>
                    <li><strong>Linux:</strong> Run Subnet Agent from the terminal or application menu</li>
                  </ul>
                  <p className="text-sm text-default-600 mt-2">
                    Make sure the program is running before proceeding.
                  </p>
                </div>

                <div className="bg-default-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Step 3: Check Your Internet Connection</h4>
                  <p className="text-sm text-default-600 mb-2">
                    Make sure your computer is connected to the internet and no firewall is blocking the connection.
                  </p>
                </div>

                <div className="bg-default-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Step 4: Try Again</h4>
                  <p className="text-sm text-default-600 mb-2">
                    After completing the steps above, click the "Retry Connection" button below.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <p className="text-xs text-danger font-semibold mb-1">Error Details:</p>
                  <p className="text-xs text-danger font-mono break-all">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-6 text-center">
                <Button
                  color="primary"
                  size="lg"
                  onPress={onRetry}
                >
                  Retry Connection
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

