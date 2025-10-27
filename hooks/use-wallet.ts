"use client";

import { useState, useEffect, useCallback } from "react";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null,
    isLoading: true, // Start with loading true to prevent hydration mismatch
    error: null,
  });

  const isMetaMaskInstalled = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.ethereum &&
      window.ethereum.isMetaMask
    );
  }, []);

  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState((prev) => ({
        ...prev,
        error:
          "MetaMask is not installed. Please install MetaMask to continue.",
      }));

      return false;
    }

    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];

        // Get chain ID
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Get balance
        let balance = "0";

        try {
          const balanceHex = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"],
          });

          balance = (parseInt(balanceHex, 16) / Math.pow(10, 18)).toFixed(4);
        } catch {
          // Failed to fetch balance
          balance = "0";
        }

        setWalletState({
          address,
          isConnected: true,
          chainId,
          balance,
          isLoading: false,
          error: null,
        });

        // Store connection state in localStorage
        try {
          localStorage.setItem("walletConnected", "true");
          localStorage.setItem("walletAddress", address);
        } catch {
          // Failed to save wallet state to localStorage
        }

        // Force a re-render by dispatching a custom event
        window.dispatchEvent(
          new CustomEvent("walletConnected", {
            detail: { address, chainId, balance },
          }),
        );

        return true;
      } else {
        setWalletState((prev) => ({
          ...prev,
          isLoading: false,
          error: "No accounts found. Please unlock your wallet.",
        }));
      }
    } catch (err: any) {
      let errorMessage = "Failed to connect wallet";

      // Handle specific MetaMask errors
      if (err.code === 4001) {
        errorMessage = "Connection rejected by user";
      } else if (err.code === -32002) {
        errorMessage = "Connection request already pending";
      } else if (err.code === -32603) {
        errorMessage = "Internal error. Please try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }

    return false;
  }, [isMetaMaskInstalled]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
      isLoading: false,
      error: null,
    });

    // Clear localStorage
    try {
      localStorage.removeItem("walletConnected");
      localStorage.removeItem("walletAddress");
    } catch {
      // Failed to clear wallet state from localStorage
    }
  }, []);

  const clearError = useCallback(() => {
    setWalletState((prev) => ({ ...prev, error: null }));
  }, []);

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const getNetworkName = useCallback((chainId: string) => {
    switch (chainId) {
      case "0x1":
        return "Ethereum Mainnet";
      case "0x89":
        return "Polygon";
      case "0xa":
        return "Optimism";
      case "0xa4b1":
        return "Arbitrum One";
      default:
        return "Unknown Network";
    }
  }, []);

  // Initialize wallet state from localStorage
  useEffect(() => {
    const initializeWallet = async () => {
      // Only run on client side
      if (typeof window === "undefined") return;

      const isConnected = localStorage.getItem("walletConnected") === "true";
      const savedAddress = localStorage.getItem("walletAddress");

      if (isConnected && savedAddress && isMetaMaskInstalled()) {
        try {
          // Verify the connection is still valid
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.includes(savedAddress)) {
            // Get updated chain ID and balance
            const chainId = await window.ethereum.request({
              method: "eth_chainId",
            });
            let balance = "0";

            try {
              const balanceHex = await window.ethereum.request({
                method: "eth_getBalance",
                params: [savedAddress, "latest"],
              });

              balance = (parseInt(balanceHex, 16) / Math.pow(10, 18)).toFixed(
                4,
              );
            } catch {
              // Failed to fetch balance
            }

            setWalletState({
              address: savedAddress,
              isConnected: true,
              chainId,
              balance,
              isLoading: false,
              error: null,
            });
          } else {
            disconnectWallet();
          }
        } catch {
          // Failed to verify wallet connection
          disconnectWallet();
        }
      } else {
        // No saved connection, set loading to false
        setWalletState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeWallet();
  }, [isMetaMaskInstalled, disconnectWallet]);

  // Listen for wallet events
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      connectWallet();
    };

    // Listen for custom wallet connection events
    const handleWalletConnected = (event: CustomEvent) => {
      const { address, chainId, balance } = event.detail;

      setWalletState((prev) => ({
        ...prev,
        address,
        isConnected: true,
        chainId,
        balance,
        isLoading: false,
        error: null,
      }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.addEventListener(
      "walletConnected",
      handleWalletConnected as EventListener,
    );

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.removeEventListener(
        "walletConnected",
        handleWalletConnected as EventListener,
      );
    };
  }, [connectWallet, disconnectWallet, isMetaMaskInstalled]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    clearError,
    formatAddress,
    getNetworkName,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};
