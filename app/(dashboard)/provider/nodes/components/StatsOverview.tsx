"use client";

import { Card, CardBody } from "@heroui/card";

interface StatsOverviewProps {
  stats: {
    total: number;
    active: number;
    clusters: number;
    totalPods: number;
    totalPodsCapacity: number;
    totalCpu: number;
    totalMemory: number;
    averageUptime: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.total}
            </div>
            <div className="text-xs text-default-600">Total Nodes</div>
            <div className="text-xs text-default-500 mt-1">
              {stats.active} active
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.clusters}
            </div>
            <div className="text-xs text-default-600">Clusters</div>
          </div>
        </CardBody>
      </Card>
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {stats.totalPods}
            </div>
            <div className="text-xs text-default-600">Active Pods</div>
            <div className="text-xs text-default-500 mt-1">
              / {stats.totalPodsCapacity} capacity
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalCpu}
            </div>
            <div className="text-xs text-default-600">CPU Cores</div>
          </div>
        </CardBody>
      </Card>
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {stats.totalMemory}GB
            </div>
            <div className="text-xs text-default-600">Memory</div>
          </div>
        </CardBody>
      </Card>
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {stats.averageUptime.toFixed(1)}%
            </div>
            <div className="text-xs text-default-600">Avg Uptime</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

