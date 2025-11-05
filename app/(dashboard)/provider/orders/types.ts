export interface DeploymentOrder {
  id: string;
  name: string;
  application: string;
  user: {
    address: string;
    name?: string;
  };
  status: "pending" | "installed" | "expired";
  method: "direct-accept" | "select-provider";
  requestedAt: string;
  expiresAt?: string;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
    gpu?: {
      model: string;
      count: number;
    };
  };
  pricePerHour: string;
  commitment?: "hour" | "day" | "week" | "month";
  services: Array<{
    id: string;
    name: string;
    image: string;
    replicas: number;
    ports?: Array<{
      containerPort: number;
      hostPort: number;
      protocol: "tcp" | "udp";
    }>;
  }>;
  region?: string;
}

