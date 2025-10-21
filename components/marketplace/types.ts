export interface Provider {
  id: string;
  name: string;
  location: string;
  region: string;
  nodesCount: number;
  uptime: number;
  reputation: number;
  pricing: {
    min: number;
    max: number;
    average: number;
    cpu: number;
    memory: number;
    storage: number;
    gpu?: number;
    gpuTypes?: string[];
  };
  resources: {
    cpu: { cores: number; threads: number };
    memory: { total: number; available: number };
    storage: { total: number; available: number };
    gpu?: {
      count: number;
      types: string[];
      vram: number[];
      available: number;
    };
    network: { bandwidth: number; latency: number };
  };
  verified: boolean;
  featured: boolean;
  specialties: string[];
  totalDeployments: number;
  responseTime: string;
  lastActive: string;
  owner?: string;
  verifiers?: {
    id: string;
    name: string;
    wallet: string;
    verifiedAt: string;
    verificationType: string;
    status: string;
  }[];
}

export interface App {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  provider: string;
  description: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export interface Stats {
  totalProviders: number;
  totalApps: number;
  totalDeployments: number;
  averageUptime: number;
}
