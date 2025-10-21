"use client";

import React from "react";
import { Chip } from "@heroui/chip";

import { useWallet } from "@/hooks/use-wallet";

export const Web3StatusIndicator: React.FC = () => {
  const { isConnected, chainId, getNetworkName } = useWallet();

  // Chỉ hiển thị khi đã kết nối
  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Chip
        className="bg-success/20 text-success-foreground"
        color="success"
        size="sm"
        variant="flat"
      >
        <span className="text-xs mr-1">🟢</span>
        Connected
      </Chip>
      <Chip
        className="bg-primary/20 text-primary-foreground"
        color="primary"
        size="sm"
        variant="flat"
      >
        <span className="text-xs mr-1">🌐</span>
        {getNetworkName(chainId!)}
      </Chip>
    </div>
  );
};
