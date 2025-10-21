"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Server, Code, CheckCircle } from "lucide-react";

interface TemplateSelectionProps {
  deploymentMode: "template" | "application";
  selectedTemplate: any;
  hasChosenMethod: boolean;
  onTemplateModalOpen: () => void;
  onCustomTemplateSelect: () => void;
}

export default function TemplateSelection({
  deploymentMode,
  selectedTemplate,
  hasChosenMethod,
  onTemplateModalOpen,
  onCustomTemplateSelect,
}: TemplateSelectionProps) {
  return (
    <Card className="subnet-card">
      <CardHeader className="flex items-center gap-2">
        <Server className="text-primary" size={20} />
        <h2 className="text-xl font-semibold">Choose Deployment Method</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Server className="text-primary" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              How would you like to deploy?
            </h3>
            <p className="text-default-600">
              Choose between pre-configured templates or build your own custom
              deployment.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pre-configured Templates */}
          <div
            className={`cursor-pointer transition-all rounded-lg border-2 p-6 text-center ${
              deploymentMode === "application"
                ? "border-primary bg-primary/5"
                : "border-default-200 hover:border-primary/50"
            }`}
            role="button"
            style={{ pointerEvents: "auto", zIndex: 1 }}
            tabIndex={0}
            onClick={() => {
              console.log("Pre-configured Templates clicked - opening modal");
              onTemplateModalOpen();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTemplateModalOpen();
              }
            }}
          >
            <div className="w-12 h-12 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Server className="text-success" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Pre-configured Templates
            </h3>
            <p className="text-default-600 mb-4">
              Choose from our curated collection of popular applications and
              services.
            </p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-success" size={16} />
                <span>Quick setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-success" size={16} />
                <span>Tested configurations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-success" size={16} />
                <span>Customizable after selection</span>
              </div>
            </div>
            {selectedTemplate && (
              <div className="mt-4">
                <Chip color="primary" variant="flat">
                  {selectedTemplate.name} Selected
                </Chip>
              </div>
            )}
          </div>

          {/* Custom Template */}
          <div
            className={`cursor-pointer transition-all rounded-lg border-2 p-6 text-center ${
              deploymentMode === "template"
                ? "border-primary bg-primary/5"
                : "border-default-200 hover:border-primary/50"
            }`}
            role="button"
            style={{ pointerEvents: "auto", zIndex: 1 }}
            tabIndex={0}
            onClick={() => {
              console.log("Custom template clicked");
              onCustomTemplateSelect();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCustomTemplateSelect();
              }
            }}
          >
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Code className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Custom Template</h3>
            <p className="text-default-600 mb-4">
              Build your own deployment from scratch with full control over
              configuration.
            </p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary" size={16} />
                <span>Full customization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary" size={16} />
                <span>Advanced configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary" size={16} />
                <span>Complete control</span>
              </div>
            </div>
            {deploymentMode === "template" && (
              <div className="mt-4">
                <Chip color="primary" variant="flat">
                  Selected
                </Chip>
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-4">
          {/* Debug Info */}
          <div className="text-xs text-default-500">
            Debug: Modal Open: No | Selected Template:{" "}
            {selectedTemplate ? selectedTemplate.name : "None"} | Has Chosen
            Method: {hasChosenMethod ? "Yes" : "No"}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
