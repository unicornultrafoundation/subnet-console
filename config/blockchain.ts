// Blockchain configuration for Subnet Console
export const blockchainConfig = {
  // Supported networks
  networks: {
    ethereum: {
      chainId: 1,
      name: "Ethereum Mainnet",
      rpcUrl:
        process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
      explorerUrl: "https://etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    polygon: {
      chainId: 137,
      name: "Polygon",
      rpcUrl:
        process.env.NEXT_PUBLIC_POLYGON_RPC_URL ||
        "https://polygon.llamarpc.com",
      explorerUrl: "https://polygonscan.com",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
    },
    arbitrum: {
      chainId: 42161,
      name: "Arbitrum One",
      rpcUrl:
        process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
        "https://arb1.arbitrum.io/rpc",
      explorerUrl: "https://arbiscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
  },

  // Contract addresses
  contracts: {
    subnetToken: process.env.NEXT_PUBLIC_SUBNET_TOKEN_ADDRESS || "",
    stakingContract: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || "",
    verificationContract:
      process.env.NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS || "",
    marketplaceContract:
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || "",
  },

  // Default network
  defaultNetwork: "ethereum",

  // Wallet connection settings
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  },
};
