"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  balance: string | null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WalletConnection: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return (
      typeof window !== "undefined" &&
      window.ethereum &&
      window.ethereum.isMetaMask
    );
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue.",
      );

      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });

        setWalletState({
          address,
          isConnected: true,
          chainId,
          balance: (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4),
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
    });
    setError(null);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
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
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  if (!isMetaMaskInstalled()) {
    return (
      <Card className="glass-enhanced-dark border-primary/20">
        <CardBody className="p-6 text-center">
          <div className="text-4xl mb-4">🦊</div>
          <h3 className="text-xl font-bold text-white-on-gradient mb-2">
            MetaMask Required
          </h3>
          <p className="text-white-on-gradient-light mb-4">
            Please install MetaMask to connect your wallet and access the Subnet
            Console.
          </p>
          <Button
            as="a"
            className="subnet-button-primary"
            color="primary"
            href="https://metamask.io/download/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Install MetaMask
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (walletState.isConnected) {
    return (
      <Card className="glass-enhanced-dark border-primary/20">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-lg">🦊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white-on-gradient">
                  Wallet Connected
                </h3>
                <p className="text-white-on-gradient-light text-sm">
                  {formatAddress(walletState.address!)}
                </p>
              </div>
            </div>
            <Chip color="success" size="sm" variant="flat">
              Connected
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-sm text-white-on-gradient-light">
                Balance
              </div>
              <div className="text-lg font-bold text-white-on-gradient">
                {walletState.balance} ETH
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/10">
              <div className="text-sm text-white-on-gradient-light">
                Network
              </div>
              <div className="text-lg font-bold text-white-on-gradient">
                {walletState.chainId === "0x1"
                  ? "Mainnet"
                  : walletState.chainId === "0x89"
                    ? "Polygon"
                    : "Unknown"}
              </div>
            </div>
          </div>

          <Button
            className="w-full subnet-button-secondary"
            variant="bordered"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="glass-enhanced-dark border-primary/20">
      <CardBody className="p-6 text-center">
        <div className="text-4xl mb-4">🦊</div>
        <h3 className="text-xl font-bold text-white-on-gradient mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-white-on-gradient-light mb-6">
          Connect your MetaMask wallet to access the decentralized Subnet
          Console.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <Button
          className="w-full subnet-button-primary"
          color="primary"
          disabled={isConnecting}
          size="lg"
          onClick={connectWallet}
        >
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>

        <div className="mt-4 text-xs text-white-on-gradient-muted">
          By connecting, you agree to our Terms of Service
        </div>
      </CardBody>
    </Card>
  );
};
