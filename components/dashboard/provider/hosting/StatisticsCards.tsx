import { Card, CardBody } from "@heroui/card";
import { Package, Server, Activity, TrendingUp } from "lucide-react";

interface StatisticsCardsProps {
  stats: {
    total: number;
    running: number;
    totalReplicas: number;
    runningReplicas: number;
    totalCpu: number;
    totalMemory: number;
  };
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-600 mb-1">
                Total Deployments
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="text-primary" size={24} />
          </div>
        </CardBody>
      </Card>

      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-600 mb-1">Total Replicas</p>
              <p className="text-2xl font-bold">{stats.totalReplicas}</p>
              <p className="text-xs text-default-500 mt-1">
                {stats.runningReplicas} running
              </p>
            </div>
            <Server className="text-secondary" size={24} />
          </div>
        </CardBody>
      </Card>

      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-600 mb-1">Running</p>
              <p className="text-2xl font-bold text-success">{stats.running}</p>
            </div>
            <Activity className="text-success" size={24} />
          </div>
        </CardBody>
      </Card>

      <Card className="subnet-card">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-600 mb-1">Resources Used</p>
              <p className="text-2xl font-bold">
                {stats.totalCpu} CPU / {stats.totalMemory} GB
              </p>
            </div>
            <TrendingUp className="text-primary" size={24} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

