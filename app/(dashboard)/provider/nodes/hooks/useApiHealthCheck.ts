import { useState, useEffect } from "react";
import { subnetAgentClient } from "@/lib/api/subnet-agent";

type ApiHealthStatus = "checking" | "healthy" | "unhealthy" | "needs-api-key";

export function useApiHealthCheck() {
  const [apiHealthStatus, setApiHealthStatus] = useState<ApiHealthStatus>("checking");
  const [apiHealthError, setApiHealthError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");

  // Helper function to check and handle API key validation
  const checkApiKeyValidity = async (): Promise<boolean> => {
    const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
    if (!storedApiKey && !process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
      setApiHealthStatus("needs-api-key");
      return false;
    }

    try {
      const apiKeyToCheck = storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY || "";
      const validationResult = await subnetAgentClient.validateApiKey(apiKeyToCheck);
      if (!validationResult.valid) {
        setApiHealthStatus("needs-api-key");
        setApiHealthError(validationResult.message || "API key is invalid");
        return false;
      }
      return true;
    } catch (error) {
      // If validation fails, might be connection issue, don't change status
      return true; // Assume valid if we can't check
    }
  };

  // Handle API errors and check for invalid API key
  const handleApiError = (error: unknown) => {
    if (error && typeof error === "object" && "isAuthError" in error && (error as any).isAuthError) {
      // API key is invalid, show API key form
      setApiHealthStatus("needs-api-key");
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any).message || "API key is invalid or expired. Please enter a new API key.";
      setApiHealthError(errorMessage);
      return true; // Indicates auth error was handled
    }
    return false; // Not an auth error
  };

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
    setApiKey(storedApiKey);
  }, []);

  // Health check on mount and periodically
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setApiHealthStatus("checking");
        setApiHealthError(null);
        
        // Check if we have API key
        const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
        
        // Try health check (may work without API key)
        await subnetAgentClient.healthCheck();
        
        // If health check succeeds but no API key, show API key form
        if (!storedApiKey && !process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
          setApiHealthStatus("needs-api-key");
          return;
        }
        
        // If we have API key, validate it
        if (storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
          const apiKeyToCheck = storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY || "";
          try {
            const validationResult = await subnetAgentClient.validateApiKey(apiKeyToCheck);
            if (!validationResult.valid) {
              setApiHealthStatus("needs-api-key");
              setApiHealthError(validationResult.message || "API key is invalid");
              return;
            }
          } catch (validationError) {
            // If validation fails, might be connection issue, don't change status
            console.error("Failed to validate API key:", validationError);
          }
        }
        
        setApiHealthStatus("healthy");
      } catch (error) {
        console.error("API health check failed:", error);
        // Check if it's an auth error
        if (handleApiError(error)) {
          return; // Auth error handled
        }
        setApiHealthStatus("unhealthy");
        setApiHealthError(
          error instanceof Error
            ? error.message
            : "Failed to connect to Subnet Agent API",
        );
      }
    };

    checkApiHealth();
    
    // Check API key validity periodically (every 5 minutes)
    const interval = setInterval(() => {
      const storedApiKey = localStorage.getItem("subnet_agent_api_key") || "";
      if (storedApiKey || process.env.NEXT_PUBLIC_SUBNET_AGENT_API_KEY) {
        checkApiKeyValidity();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [apiKey]);

  // Handle save API key
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;

    try {
      setApiHealthStatus("checking");
      setApiHealthError(null);
      
      // Validate API key first
      const validationResult = await subnetAgentClient.validateApiKey(apiKeyInput.trim());
      
      if (!validationResult.valid) {
        setApiHealthError(validationResult.message || "API key is invalid");
        setApiHealthStatus("needs-api-key");
        return;
      }
      
      // API key is valid, save it
      localStorage.setItem("subnet_agent_api_key", apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      
      // Update client
      subnetAgentClient.setApiKey(apiKeyInput.trim());
      
      setApiHealthStatus("healthy");
      setApiKeyInput(""); // Clear input
    } catch (error) {
      console.error("Failed to save API key:", error);
      if (handleApiError(error)) {
        return; // Auth error handled
      }
      setApiHealthError(
        error instanceof Error
          ? error.message
          : "Failed to validate API key",
      );
      setApiHealthStatus("needs-api-key");
    }
  };

  return {
    apiHealthStatus,
    apiHealthError,
    apiKey,
    apiKeyInput,
    setApiKeyInput,
    setApiHealthStatus,
    setApiHealthError,
    handleSaveApiKey,
    checkApiKeyValidity,
    handleApiError,
  };
}

