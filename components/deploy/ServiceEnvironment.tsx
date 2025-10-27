"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Plus, Trash2, Settings } from "lucide-react";

interface ServiceEnvironmentProps {
  service: any;
  onUpdateService: (field: string, value: any) => void;
}

export default function ServiceEnvironment({
  service,
  onUpdateService,
}: ServiceEnvironmentProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const environmentVars = service.environment || [];

  const handleAddEnvironment = () => {
    const newEnv = [...environmentVars, { key: "", value: "" }];

    onUpdateService("environment", newEnv);
  };

  const handleUpdateEnvironment = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newEnv = [...environmentVars];

    newEnv[index] = { ...newEnv[index], [field]: value };
    onUpdateService("environment", newEnv);
  };

  const handleRemoveEnvironment = (index: number) => {
    const newEnv = environmentVars.filter((_: any, i: number) => i !== index);

    onUpdateService("environment", newEnv);
  };

  return (
    <Card className="subnet-card">
      <CardHeader
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Settings className="text-primary" size={20} />
          <h3 className="text-lg font-semibold">Environment Variables</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-default-500">
            {environmentVars.length} variables
          </span>
          <div
            className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg
              className="w-5 h-5 text-default-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardBody className="space-y-4">
          {environmentVars.length === 0 ? (
            <div className="text-center py-8 text-default-500">
              <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="text-default-400" size={20} />
              </div>
              <p className="text-sm">No environment variables configured</p>
              <p className="text-xs text-default-400 mt-1">
                Click "Add Variable" to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {environmentVars.map((env: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-default-50 rounded-lg border border-default-200"
                >
                  <div className="flex-1">
                    <label className="text-sm text-default-600 mb-1 block">
                      Key
                    </label>
                    <Input
                      placeholder="DATABASE_URL"
                      size="sm"
                      value={env.key}
                      onChange={(e) =>
                        handleUpdateEnvironment(index, "key", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-default-600 mb-1 block">
                      Value
                    </label>
                    <Input
                      placeholder="postgresql://user:pass@localhost:5432/db"
                      size="sm"
                      value={env.value}
                      onChange={(e) =>
                        handleUpdateEnvironment(index, "value", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      isIconOnly
                      className="h-8 w-8"
                      color="danger"
                      size="sm"
                      variant="light"
                      onClick={() => handleRemoveEnvironment(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              color="primary"
              size="sm"
              startContent={<Plus size={16} />}
              variant="light"
              onClick={handleAddEnvironment}
            >
              Add Variable
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  );
}
