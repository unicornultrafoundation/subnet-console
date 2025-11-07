// API configuration for Subnet Console
export const apiConfig = {
  // Base URLs
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",

  // API endpoints
  endpoints: {
    auth: {
      login: "/api/auth/login",
      logout: "/api/auth/logout",
      refresh: "/api/auth/refresh",
      profile: "/api/auth/profile",
    },
    nodes: {
      list: "/api/nodes",
      create: "/api/nodes",
      get: (id: string) => `/api/nodes/${id}`,
      update: (id: string) => `/api/nodes/${id}`,
      delete: (id: string) => `/api/nodes/${id}`,
      metrics: (id: string) => `/api/nodes/${id}/metrics`,
    },
    deployments: {
      list: "/api/deployments",
      create: "/api/deployments",
      get: (id: string) => `/api/deployments/${id}`,
      update: (id: string) => `/api/deployments/${id}`,
      delete: (id: string) => `/api/deployments/${id}`,
      logs: (id: string) => `/api/deployments/${id}/logs`,
      metrics: (id: string) => `/api/deployments/${id}/metrics`,
    },
    marketplace: {
      providers: "/api/marketplace/providers",
      apps: "/api/marketplace/apps",
      categories: "/api/marketplace/categories",
    },
    billing: {
      balance: "/api/billing/balance",
      transactions: "/api/billing/transactions",
      invoices: "/api/billing/invoices",
      topup: "/api/billing/topup",
    },
    staking: {
      stake: "/api/staking/stake",
      unstake: "/api/staking/unstake",
      rewards: "/api/staking/rewards",
      claim: "/api/staking/claim",
    },
  },

  // Subnet Agent API configuration
  subnetAgent: {
    baseUrl: process.env.NEXT_PUBLIC_SUBNET_AGENT_URL || "http://127.0.0.1:8585",
    apiKey: process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY || "",
    endpoints: {
      installK3s: "/api/install-k3s",
      nodes: "/api/nodes",
      deployOperator: "/api/deploy/subnet-operator",
      updateOperator: "/api/deploy/subnet-operator/update",
      jobStatus: (jobId: string) => `/api/status/${jobId}`,
      health: "/health",
      validateKey: "/api/validate-key",
    },
  },

  // Request timeout
  timeout: 30000,

  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
  },

  // WebSocket configuration
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws",
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  },
};
