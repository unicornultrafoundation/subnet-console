"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

import { useWallet } from "@/hooks/use-wallet";

const WalletRequiredModal: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { connectWallet, isLoading, error, clearError, isConnected } =
    useWallet();

  // Ensure we're on the client side before rendering wallet-dependent content
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    clearError();
    const success = await connectWallet();

    if (success) {
      // The modal will automatically disappear when isConnected becomes true
      // because WalletAuthGuard will render the protected content
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8">
        <Card className="shadow-xl">
          <CardBody className="p-8 text-center">
            <div className="text-6xl mb-6">🦊</div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect MetaMask
            </h2>

            <p className="text-gray-600 mb-6">
              To use the application deployment feature, you need to connect
              your MetaMask wallet.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              className="w-full mb-4"
              color="primary"
              disabled={isLoading || isConnected}
              isLoading={isLoading}
              size="lg"
              onClick={handleConnect}
            >
              {isLoading
                ? "Connecting..."
                : isConnected
                  ? "Connected!"
                  : "Connect MetaMask"}
            </Button>

            <div className="text-xs text-gray-500">
              By connecting, you agree to our{" "}
              <a className="text-blue-600 hover:underline" href="/terms">
                Terms of Service
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Chip color="primary" size="sm" variant="flat">
                  Secure
                </Chip>
                <span>•</span>
                <Chip color="secondary" size="sm" variant="flat">
                  Decentralized
                </Chip>
                <span>•</span>
                <Chip color="success" size="sm" variant="flat">
                  Safe
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default WalletRequiredModal;
