"use client";

import React, { useState, useEffect } from "react";

import WalletRequiredModal from "./WalletRequiredModal";

import { useWallet } from "@/hooks/use-wallet";

interface WalletAuthGuardProps {
  children: React.ReactNode;
}

export const WalletAuthGuard: React.FC<WalletAuthGuardProps> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { isConnected, isLoading, isMetaMaskInstalled } = useWallet();

  // Ensure we're on the client side before rendering wallet-dependent content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while checking wallet connection or during hydration
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking wallet connection...</p>
        </div>
      </div>
    );
  }

  // If MetaMask is not installed, show installation prompt
  if (!isMetaMaskInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🦊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              MetaMask Not Installed
            </h2>
            <p className="text-gray-600 mb-6">
              To use the deploy feature, you need to install the MetaMask
              extension.
            </p>
            <a
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              href="https://metamask.io/download/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Install MetaMask
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If wallet is not connected, show connection modal
  if (!isConnected) {
    return <WalletRequiredModal />;
  }

  // If wallet is connected, render the protected content
  return <>{children}</>;
};

export default WalletAuthGuard;
