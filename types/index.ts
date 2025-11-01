// Icon types
export interface IconSvgProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any;
}

// Authentication types
export interface User {
  id: string;
  address: string;
  role: "user" | "provider" | "admin";
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  address: string;
  signature: string;
  message: string;
}

// Node types
export interface Node {
  id: string;
  providerId: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance" | "offline";
  // Kubernetes-specific fields
  clusterId?: string;
  clusterName?: string;
  role?: "master" | "worker" | "control-plane";
  nodeName?: string; // Kubernetes node name
  labels?: Record<string, string>;
  taints?: Array<{
    key: string;
    value?: string;
    effect: "NoSchedule" | "PreferNoSchedule" | "NoExecute";
  }>;
  kubernetesVersion?: string;
  containerRuntime?: string;
  osImage?: string;
  kernelVersion?: string;
  kubeletVersion?: string;
  // Pod information
  pods?: {
    running: number;
    pending: number;
    failed: number;
    succeeded: number;
    total: number;
    capacity: number;
  };
  // Resource specs
  specs: {
    cpu: number;
    memory: number; // in GB
    storage: number; // in GB
    bandwidth: number; // in Mbps
    pods: number; // max pods per node
  };
  // Resource usage
  usage?: {
    cpu: number; // percentage
    memory: number; // percentage
    storage: number; // percentage
    pods: number; // actual pods running
  };
  location: {
    country: string;
    region: string;
    city: string;
    zone?: string; // Kubernetes zone
  };
  uptime: number;
  reputation: number;
  createdAt: string;
  updatedAt: string;
}

export interface NodeMetrics {
  cpu: number;
  memory: number;
  storage: number;
  bandwidth: number;
  uptime: number;
  pods?: number;
  timestamp: string;
}

// Kubernetes Pod interface
export interface Pod {
  id: string;
  name: string;
  namespace: string;
  nodeId: string;
  nodeName: string;
  status: "Running" | "Pending" | "Succeeded" | "Failed" | "Unknown";
  phase: string;
  containers: Array<{
    name: string;
    image: string;
    status: "running" | "waiting" | "terminated";
    restartCount: number;
  }>;
  resources: {
    cpu: string;
    memory: string;
  };
  createdAt: string;
  startedAt?: string;
}

// Deployment types
export interface Deployment {
  id: string;
  userId: string;
  nodeId: string;
  name: string;
  description: string;
  status: "pending" | "running" | "stopped" | "failed" | "terminated";
  type: "container" | "vm" | "ai-model" | "web-app";
  image: string;
  ports: number[];
  environment: Record<string, string>;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  stoppedAt?: string;
}

export interface DeploymentLog {
  id: string;
  deploymentId: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: string;
}

// Marketplace types
export interface Provider {
  id: string;
  name: string;
  description: string;
  logo?: string;
  location: string;
  nodesCount: number;
  totalCapacity: {
    cpu: number;
    memory: number;
    storage: number;
  };
  averageUptime: number;
  reputation: number;
  pricing: {
    min: number;
    max: number;
    average: number;
  };
  verified: boolean;
}

export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  price: number;
  rating: number;
  downloads: number;
  provider: Provider;
  createdAt: string;
}

// Billing types
export interface Transaction {
  id: string;
  userId: string;
  type: "deployment" | "topup" | "refund" | "reward";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

// Staking types
export interface Stake {
  id: string;
  userId: string;
  amount: number;
  duration: number;
  rewards: number;
  status: "active" | "unstaking" | "completed";
  createdAt: string;
  unlockAt: string;
}

export interface StakingReward {
  id: string;
  userId: string;
  amount: number;
  period: string;
  claimed: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface CreateNodeForm {
  name: string;
  description: string;
  specs: {
    cpu: number;
    memory: number;
    storage: number;
    bandwidth: number;
  };
  location: {
    country: string;
    region: string;
    city: string;
  };
  pricing: {
    hourly: number;
    daily: number;
    monthly: number;
  };
}

export interface CreateDeploymentForm {
  name: string;
  description: string;
  type: "container" | "vm" | "ai-model" | "web-app";
  image: string;
  ports: number[];
  environment: Record<string, string>;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
}
