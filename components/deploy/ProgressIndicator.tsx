"use client";

import { Card, CardBody } from "@heroui/card";

interface Tab {
  id: string;
  title: string;
  icon: any;
}

interface ProgressIndicatorProps {
  tabs: Tab[];
  currentTab: number;
}

export default function ProgressIndicator({
  tabs,
  currentTab,
}: ProgressIndicatorProps) {
  return (
    <Card className="subnet-card mb-8">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  index === currentTab
                    ? "bg-primary text-white"
                    : index < currentTab
                      ? "bg-success text-white"
                      : "bg-default-100 text-default-600"
                }`}
              >
                <tab.icon size={16} />
                <span className="font-medium">{tab.title}</span>
              </div>
              {index < tabs.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 ${
                    index < currentTab ? "bg-success" : "bg-default-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
