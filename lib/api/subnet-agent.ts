// Subnet Agent API Client
import { apiConfig } from "@/config/api";

export interface InstallK3sRequest {
  target: "local" | "remote";
  node_name: string;
  cluster_name: string;
  install_mode: "server" | "agent";
  k3s_version?: string;
  flannel_backend?: "vxlan" | "host-gw" | "wireguard";
  // Remote only fields
  server_ip?: string;
  ssh_port?: number;
  ssh_user?: string;
  ssh_key?: string;
  ssh_password?: string;
  auth_method?: "key" | "password";
  // Agent only fields
  server_url?: string;
  token?: string;
}

export interface InstallK3sResponse {
  job_id: string;
  status: "pending" | "running" | "completed" | "failed";
  message: string;
}

export interface GetNodesRequest {
  target: "local" | "remote";
  server_ip?: string;
  ssh_user?: string;
  ssh_key?: string;
  ssh_password?: string;
  auth_method?: "key" | "password";
}

export interface K3sNode {
  name: string;
  status: string;
  roles: string[];
  version: string;
  internal_ip: string;
  external_ip: string;
  os_image: string;
  kernel_version: string;
  container_runtime: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  cpu?: string;
  memory?: string;
  storage?: string;
  allocatable_cpu?: string;
  allocatable_memory?: string;
  allocatable_storage?: string;
  cpu_usage?: string;
  memory_usage?: string;
  storage_usage?: string;
  cpu_usage_percent?: number;
  memory_usage_percent?: number;
  storage_usage_percent?: number;
  total_pods?: number;
  running_pods?: number;
  pending_pods?: number;
  failed_pods?: number;
  succeeded_pods?: number;
}

export interface GetNodesResponse {
  nodes: K3sNode[];
  count: number;
}

export interface JobStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  output: string;
  started_at?: string;
  completed_at?: string;
}

export interface JobStatus {
  job_id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  current_step: number;
  message: string;
  steps: JobStep[];
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface DeployOperatorRequest {
  target: "local" | "remote";
  helm_repo_url?: string;
  namespace?: string;
  chart_name?: string;
  release_name?: string;
  // Remote only fields
  server_ip?: string;
  ssh_user?: string;
  ssh_key?: string;
  ssh_password?: string;
  auth_method?: "key" | "password";
}

export interface DeployOperatorResponse {
  job_id: string;
  status: "pending" | "running" | "completed" | "failed";
  message: string;
}

class SubnetAgentClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = apiConfig.subnetAgent.baseUrl;
    // Get API key from env or localStorage
    if (typeof window !== "undefined") {
      this.apiKey = apiConfig.subnetAgent.apiKey || localStorage.getItem("subnet_agent_api_key") || "";
    } else {
      this.apiKey = apiConfig.subnetAgent.apiKey || "";
    }
  }

  // Method to update API key
  public setApiKey(key: string) {
    this.apiKey = key;
    if (typeof window !== "undefined") {
      localStorage.setItem("subnet_agent_api_key", key);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Get API key (from env, localStorage, or instance)
    let apiKeyToUse = this.apiKey;
    if (typeof window !== "undefined") {
      apiKeyToUse = apiKeyToUse || localStorage.getItem("subnet_agent_api_key") || "";
    }

    // Add API key authentication
    if (apiKeyToUse) {
      headers["X-API-Key"] = apiKeyToUse;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Check for authentication errors (401/403)
      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({
          message: "API key is invalid or expired",
        }));
        const error = new Error(errorData.message || "API key is invalid or expired");
        (error as any).status = response.status;
        (error as any).isAuthError = true;
        throw error;
      }
      
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Install k3s on local or remote server
   */
  async installK3s(
    request: InstallK3sRequest,
  ): Promise<InstallK3sResponse> {
    return this.request<InstallK3sResponse>(
      apiConfig.subnetAgent.endpoints.installK3s,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
  }

  /**
   * Get k3s cluster nodes
   */
  async getNodes(request: GetNodesRequest): Promise<GetNodesResponse> {
    return this.request<GetNodesResponse>(
      apiConfig.subnetAgent.endpoints.nodes,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>(
      apiConfig.subnetAgent.endpoints.jobStatus(jobId),
      {
        method: "GET",
      },
    );
  }

  /**
   * Deploy subnet operator
   */
  async deployOperator(
    request: DeployOperatorRequest,
  ): Promise<DeployOperatorResponse> {
    return this.request<DeployOperatorResponse>(
      apiConfig.subnetAgent.endpoints.deployOperator,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
  }

  /**
   * Update subnet operator
   */
  async updateOperator(
    request: DeployOperatorRequest,
  ): Promise<DeployOperatorResponse> {
    return this.request<DeployOperatorResponse>(
      apiConfig.subnetAgent.endpoints.updateOperator,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>(
      apiConfig.subnetAgent.endpoints.health,
      {
        method: "GET",
      },
    );
  }

  /**
   * Validate API key
   */
  async validateApiKey(apiKey: string): Promise<{ valid: boolean; message: string }> {
    // Use a temporary client instance with the provided API key
    const tempHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (apiKey) {
      tempHeaders["X-API-Key"] = apiKey;
    }

    const url = `${this.baseUrl}${apiConfig.subnetAgent.endpoints.validateKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: tempHeaders,
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!response.ok) {
      throw new Error("Failed to validate API key");
    }

    return response.json();
  }
}

export const subnetAgentClient = new SubnetAgentClient();

