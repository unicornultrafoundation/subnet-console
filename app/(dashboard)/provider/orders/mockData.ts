import { DeploymentOrder } from "./types";

// Mock orders without expiration (for open page)
export const openOrders: DeploymentOrder[] = [
  {
    id: "order-6",
    name: "Content Delivery Network",
    application: "CDN",
    user: {
      address: "0x3333...4444",
      name: "CDN Provider",
    },
    status: "pending",
    method: "direct-accept",
    requestedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    // No expiresAt - can accept anytime
    resources: {
      cpu: 6,
      memory: 16,
      storage: 100,
    },
    pricePerHour: "0.08",
    commitment: "month",
    services: [
      {
        id: "svc-1",
        name: "cdn-server",
        image: "nginx:latest",
        replicas: 5,
        ports: [
          {
            containerPort: 80,
            hostPort: 80,
            protocol: "tcp",
          },
          {
            containerPort: 443,
            hostPort: 443,
            protocol: "tcp",
          },
        ],
      },
    ],
    region: "Global",
  },
  {
    id: "order-7",
    name: "Backup Storage Service",
    application: "Storage",
    user: {
      address: "0x5555...6666",
    },
    status: "pending",
    method: "direct-accept",
    requestedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    // No expiresAt - can accept anytime
    resources: {
      cpu: 4,
      memory: 8,
      storage: 1000,
    },
    pricePerHour: "0.12",
    commitment: "month",
    services: [
      {
        id: "svc-1",
        name: "backup-service",
        image: "backup:latest",
        replicas: 2,
      },
    ],
  },
  {
    id: "order-8",
    name: "Long-term Analytics Service",
    application: "Analytics",
    user: {
      address: "0x7777...8888",
      name: "Analytics Corp",
    },
    status: "pending",
    method: "direct-accept",
    requestedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    // No expiresAt - can accept anytime
    resources: {
      cpu: 12,
      memory: 48,
      storage: 500,
    },
    pricePerHour: "0.20",
    commitment: "month",
    services: [
      {
        id: "svc-1",
        name: "analytics-service",
        image: "analytics:latest",
        replicas: 3,
        ports: [
          {
            containerPort: 3000,
            hostPort: 3000,
            protocol: "tcp",
          },
        ],
      },
    ],
    region: "US East",
  },
];

