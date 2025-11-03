export interface Replica {
  id: string;
  name: string;
  status: "running" | "pending" | "failed" | "succeeded" | "terminating";
  nodeId?: string;
  nodeName?: string;
  startedAt?: string;
  uptime?: number; // percentage
}

export interface Service {
  id: string;
  name: string;
  image: string;
  status: "running" | "stopped" | "starting" | "stopping" | "error";
  replicas: number; // desired replicas
  replicasStatus: {
    running: number;
    pending: number;
    failed: number;
    succeeded: number;
    total: number;
  };
  replicasList?: Replica[]; // list of actual replicas/pods
  ports?: Array<{
    containerPort: number;
    hostPort: number;
    protocol: "tcp" | "udp";
    url?: string;
  }>;
  resources: {
    cpu: number; // per replica
    memory: number; // GB per replica
    storage: number; // GB per replica
  };
  uptime: number; // percentage (average)
}

export interface Deployment {
  id: string;
  name: string;
  status: "running" | "stopped" | "starting" | "stopping" | "error";
  application: string;
  services: Service[];
  user: {
    address: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
  pricePerHour: string;
  leaseEndAt: string; // when the current lease expires
  autoRenew?: boolean;
  commitment?: "hour" | "day" | "week" | "month";
  totalResources: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

