import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

export default function DashboardPage() {
  const stats = [
    { label: "Active Deployments", value: "12", color: "success" },
    { label: "Total Nodes", value: "8", color: "primary" },
    { label: "Monthly Usage", value: "2.4 TB", color: "warning" },
    { label: "Balance", value: "1,250 SNT", color: "secondary" },
  ];

  const recentDeployments = [
    {
      id: "1",
      name: "AI Chat Bot",
      status: "running",
      node: "Node-001",
      uptime: "99.8%",
      cost: "$0.45/hr",
    },
    {
      id: "2",
      name: "Web Server",
      status: "running",
      node: "Node-003",
      uptime: "99.9%",
      cost: "$0.32/hr",
    },
    {
      id: "3",
      name: "Database",
      status: "stopped",
      node: "Node-002",
      uptime: "99.7%",
      cost: "$0.78/hr",
    },
  ];

  const nodeMetrics = [
    { label: "CPU Usage", value: 65, color: "primary" },
    { label: "Memory Usage", value: 78, color: "warning" },
    { label: "Storage Usage", value: 45, color: "success" },
    { label: "Network", value: 32, color: "secondary" },
  ];

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-default-600">
          Monitor your deployments and manage your resources
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="text-center">
              <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              <p className="text-sm text-default-600">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deployments */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Deployments</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentDeployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{deployment.name}</h3>
                      <Chip
                        color={
                          deployment.status === "running"
                            ? "primary"
                            : deployment.status === "stopped"
                              ? "default"
                              : "secondary"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {deployment.status}
                      </Chip>
                    </div>
                    <div className="text-sm text-default-600">
                      {deployment.node} • {deployment.uptime} •{" "}
                      {deployment.cost}
                    </div>
                  </div>
                  <Button size="sm" variant="flat">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Node Metrics */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Node Performance</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {nodeMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-sm text-default-600">
                      {metric.value}%
                    </span>
                  </div>
                  <Progress
                    className="w-full"
                    color={metric.color as any}
                    value={metric.value}
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              as="a"
              className="h-16"
              color="primary"
              href="/marketplace"
              variant="flat"
            >
              <div className="text-center">
                <div className="text-lg font-semibold">Deploy App</div>
                <div className="text-sm text-default-600">
                  Browse marketplace
                </div>
              </div>
            </Button>
            <Button
              as="a"
              className="h-16"
              color="secondary"
              href="/dashboard/user/monitoring"
              variant="flat"
            >
              <div className="text-center">
                <div className="text-lg font-semibold">View Metrics</div>
                <div className="text-sm text-default-600">
                  Monitor performance
                </div>
              </div>
            </Button>
            <Button
              as="a"
              className="h-16"
              color="success"
              href="/dashboard/user/billing"
              variant="flat"
            >
              <div className="text-center">
                <div className="text-lg font-semibold">Manage Billing</div>
                <div className="text-sm text-default-600">
                  View transactions
                </div>
              </div>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
