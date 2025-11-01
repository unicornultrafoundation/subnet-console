export interface ProviderConfig {
  // Provider Information
  name: string;
  description: string;
  location: {
    country: string;
    region: string;
    city: string;
  };
  specialties: string[];
  contact: {
    email: string;
    website?: string;
  };
  // Operator Configuration
  operatorAddress: string;
  operatorAddressVerified: boolean;

  // Network Configuration
  ip: string;
  ingressDomain: string; // e.g., "subnet.example.com"

  // GPU Configuration (only one GPU type supported)
  supportedGpuType: {
    vendor: string;
    model: string;
    memory: number; // GB
    interface: string; // e.g., "PCIe 4.0", "NVLink", "PCIe 3.0"
  } | null;

  // Pricing Configuration
  pricing: {
    cpu: number; // per hour
    memory: number; // per GB per hour
    storage: number; // per GB per hour
    gpu: number; // per GPU per hour
    bandwidth: number; // per Mbps per hour
    minimumCharge: number; // minimum hourly charge
  };

  // Resource Limits
  limits: {
    maxCpuPerDeployment: number;
    maxMemoryPerDeployment: number; // GB
    maxStoragePerDeployment: number; // GB
    maxGpuPerDeployment: number;
    maxDeploymentsPerUser: number;
  };

  // Availability Settings
  availability: {
    autoAcceptDeployments: boolean;
    requireApproval: boolean;
    maxConcurrentDeployments: number;
  };

  // Notification Settings
  notifications: {
    emailOnDeployment: boolean;
    emailOnError: boolean;
    emailOnLowResources: boolean;
  };

  // Blockchain stored resources (from smart contract)
  blockchainResources?: {
    cpu: number;
    memory: number;
    storage: number;
    bandwidth: number;
    lastUpdated: string;
  };
}
