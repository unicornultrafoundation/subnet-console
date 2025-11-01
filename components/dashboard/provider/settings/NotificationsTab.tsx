"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Bell } from "lucide-react";

import { ProviderConfig } from "./types";

interface NotificationsTabProps {
  config: ProviderConfig;
  updateConfig: (path: string, value: any) => void;
}

export function NotificationsTab({
  config,
  updateConfig,
}: NotificationsTabProps) {
  return (
    <Card className="subnet-card mt-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell size={20} />
          <h2 className="text-xl font-bold">Notification Settings</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              checked={config.notifications.emailOnDeployment}
              className="w-5 h-5 rounded border-gray-300"
              type="checkbox"
              onChange={(e) =>
                updateConfig(
                  "notifications.emailOnDeployment",
                  e.target.checked,
                )
              }
            />
            <div>
              <div className="font-medium">Email on New Deployment</div>
              <div className="text-sm text-default-600">
                Receive email notifications when new deployments are created
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              checked={config.notifications.emailOnError}
              className="w-5 h-5 rounded border-gray-300"
              type="checkbox"
              onChange={(e) =>
                updateConfig("notifications.emailOnError", e.target.checked)
              }
            />
            <div>
              <div className="font-medium">Email on Errors</div>
              <div className="text-sm text-default-600">
                Receive email notifications when deployment errors occur
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              checked={config.notifications.emailOnLowResources}
              className="w-5 h-5 rounded border-gray-300"
              type="checkbox"
              onChange={(e) =>
                updateConfig(
                  "notifications.emailOnLowResources",
                  e.target.checked,
                )
              }
            />
            <div>
              <div className="font-medium">Email on Low Resources</div>
              <div className="text-sm text-default-600">
                Receive email notifications when resource availability is low
              </div>
            </div>
          </label>
        </div>
      </CardBody>
    </Card>
  );
}
