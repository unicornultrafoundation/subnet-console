// Blockchain configuration for Subnet Console
export const blockchainConfig = {
  // Supported networks
  networks: {
    u2u: {
      chainId: 39,
      name: "U2U Solaris Mainnet",
      rpcUrl:
        process.env.NEXT_PUBLIC_U2U_RPC_URL || "https://rpc-mainnet.u2u.xyz",
      explorerUrl: "https://u2uscan.xyz",
      nativeCurrency: {
        name: "U2U",
        symbol: "U2U",
        decimals: 18,
      },
    },
    nebulas: {
      chainId: 2484,
      name: "U2U Nebulas Testnet",
      rpcUrl:
        process.env.NEXT_PUBLIC_U2U_RPC_URL || "https://rpc-nebulas-testnet.uniultra.xyz",
      explorerUrl: "https://testnet.u2uscan.xyz",
      nativeCurrency: {
        name: "U2U",
        symbol: "U2U",
        decimals: 18,
      },
    }
  },

  // Contract addresses
  contracts: {
    subnetToken: process.env.NEXT_PUBLIC_SUBNET_TOKEN_ADDRESS || "",
    stakingContract: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || "",
    verificationContract:
      process.env.NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS || "",
    marketplaceContract:
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || "",
    providerContract:
      process.env.NEXT_PUBLIC_PROVIDER_CONTRACT_ADDRESS || "0xd07f43C636F7842A69FF22E36e3c0E1811040c2d",
    stakeToken:
      process.env.NEXT_PUBLIC_STAKE_TOKEN_ADDRESS || "0x9b1F378683CA345aB210b4cB48Dbf6fa2c072f9F",
  },

  // Default network
  defaultNetwork: "u2u",

  // Wallet connection settings
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  },
};
