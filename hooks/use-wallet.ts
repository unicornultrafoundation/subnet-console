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
    isLoading: false,
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
        } catch (balanceError) {
          console.warn("Failed to fetch balance:", balanceError);
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
        } catch (storageError) {
          console.warn(
            "Failed to save wallet state to localStorage:",
            storageError,
          );
        }

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
    } catch (storageError) {
      console.warn(
        "Failed to clear wallet state from localStorage:",
        storageError,
      );
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
    const isConnected = localStorage.getItem("walletConnected") === "true";
    const savedAddress = localStorage.getItem("walletAddress");

    if (isConnected && savedAddress && isMetaMaskInstalled()) {
      // Verify the connection is still valid
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.includes(savedAddress)) {
            setWalletState((prev) => ({
              ...prev,
              address: savedAddress,
              isConnected: true,
            }));
          } else {
            disconnectWallet();
          }
        })
        .catch(() => {
          disconnectWallet();
        });
    }
  }, [isMetaMaskInstalled, disconnectWallet]);

  // Listen for wallet events
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

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

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
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
