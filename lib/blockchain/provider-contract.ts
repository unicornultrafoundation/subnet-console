import { Contract, BrowserProvider, formatUnits, parseUnits } from "ethers";
import { blockchainConfig } from "@/config/blockchain";

// ERC20 Token ABI - Standard ERC20 functions for allowance and approve
export const ERC20_TOKEN_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Provider Contract ABI - Full ABI from Subnet Provider Contract
export const PROVIDER_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPeriod",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPeriod",
        type: "uint256",
      },
    ],
    name: "LockPeriodUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlocktime",
        type: "uint256",
      },
    ],
    name: "ProviderDeactivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakedAmount",
        type: "uint256",
      },
    ],
    name: "ProviderRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newReputation",
        type: "uint256",
      },
    ],
    name: "ProviderReputationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "additionalStake",
        type: "uint256",
      },
    ],
    name: "ProviderSpecsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "ProviderUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "verified",
        type: "bool",
      },
    ],
    name: "ProviderVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cpuPricePerSecond",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gpuPricePerSecond",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "memoryPricePerSecond",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "diskPricePerSecond",
        type: "uint256",
      },
    ],
    name: "ResourcePriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
    ],
    name: "ResourcesLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
    ],
    name: "ResourcesUnlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "revenueRatioBps",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "revenueDays",
        type: "uint256",
      },
    ],
    name: "StakeConfigurationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "StakeSlashed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "StakeWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "authorizedLockers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskPricePerSecond",
        type: "uint256",
      },
    ],
    name: "calculateRequiredStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "claimWithdrawal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "deactivateProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "getLockedResources",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "cpuCores",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gpuCores",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "memoryMB",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "diskGB",
            type: "uint256",
          },
        ],
        internalType: "struct SubnetProvider.LockedResources",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "getProvider",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "registered",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "reputation",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalStaked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pendingWithdrawals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "slashedAmount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isSlashed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "verified",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "machineType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "region",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cpuCores",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gpuCores",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "memoryMB",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "diskGB",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cpuPricePerSecond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gpuPricePerSecond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "memoryPricePerSecond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "diskPricePerSecond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "removedAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "withdrawalProcessed",
            type: "bool",
          },
        ],
        internalType: "struct SubnetProvider.Provider",
        name: "provider",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "getProviderOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "getProviderReputation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "getProviderSlashedAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "getResourcePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "cpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskPricePerSecond",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "isProviderActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isProviderOperatorOrOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
    ],
    name: "isVerified",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lockPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
    ],
    name: "lockResources",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lockedResources",
    outputs: [
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "providers",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "registered",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "reputation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pendingWithdrawals",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slashedAmount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isSlashed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "verified",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "machineType",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "region",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakeAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "removedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "withdrawalProcessed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "machineType",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "region",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskPricePerSecond",
        type: "uint256",
      },
    ],
    name: "registerProvider",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "locker",
        type: "address",
      },
      {
        internalType: "bool",
        name: "authorized",
        type: "bool",
      },
    ],
    name: "setAuthorizedLocker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newLockPeriod",
        type: "uint256",
      },
    ],
    name: "setLockPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "newOperator",
        type: "address",
      },
    ],
    name: "setProviderOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newReputation",
        type: "uint256",
      },
    ],
    name: "setProviderReputation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        internalType: "bool",
        name: "verified_",
        type: "bool",
      },
    ],
    name: "setProviderVerified",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "cpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryPricePerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskPricePerSecond",
        type: "uint256",
      },
    ],
    name: "setResourcePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newRevenueRatioBps",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newRevenueDays",
        type: "uint256",
      },
    ],
    name: "setStakeConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "slashStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeRevenueDays",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeRevenueRatioBps",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSlashed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
    ],
    name: "unlockResources",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "updateProviderInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "machineType",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "region",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "memoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "diskGB",
        type: "uint256",
      },
    ],
    name: "updateProviderSpecs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "machineType",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "providerId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minCpuCores",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minMemoryMB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minDiskGB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minGpuCores",
        type: "uint256",
      },
    ],
    name: "validateProviderRequirements",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawSlashedFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export interface ProviderInfo {
  operator: string;
  owner: string;
  registered: boolean;
  reputation: bigint;
  createdAt: bigint;
  updatedAt: bigint;
  totalStaked: bigint;
  pendingWithdrawals: bigint;
  slashedAmount: bigint;
  metadata: string;
  isSlashed: boolean;
  isActive: boolean;
  verified: boolean;
  machineType: bigint;
  region: bigint;
  cpuCores: bigint;
  gpuCores: bigint;
  memoryMB: bigint;
  diskGB: bigint;
  cpuPricePerSecond: bigint;
  gpuPricePerSecond: bigint;
  memoryPricePerSecond: bigint;
  diskPricePerSecond: bigint;
  stakeAmount: bigint;
  removedAt: bigint;
  unlockTime: bigint;
  withdrawalProcessed: boolean;
}

export interface RegisterProviderParams {
  operator: string;
  metadata: string;
  machineType: number;
  region: number;
  cpuCores: number;
  gpuCores: number;
  memoryMB: number;
  diskGB: number;
  cpuPricePerSecond: string; // in tokens (will be converted to wei)
  gpuPricePerSecond: string; // in tokens (will be converted to wei)
  memoryPricePerSecond: string; // in tokens (will be converted to wei)
  diskPricePerSecond: string; // in tokens (will be converted to wei)
}

/**
 * Get provider contract instance (read-only)
 */
export function getProviderContract() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const contractAddress = blockchainConfig.contracts.providerContract;

  if (!contractAddress) {
    throw new Error("Provider contract address is not configured");
  }

  return new Contract(contractAddress, PROVIDER_CONTRACT_ABI, provider);
}

/**
 * Get provider contract instance with signer (for transactions)
 */
export function getProviderContractWithSigner() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const contractAddress = blockchainConfig.contracts.providerContract;

  if (!contractAddress) {
    throw new Error("Provider contract address is not configured");
  }

  return provider.getSigner().then((signer) => {
    return new Contract(contractAddress, PROVIDER_CONTRACT_ABI, signer);
  });
}

/**
 * Check if an address is registered as a provider
 */
export async function isProviderRegistered(
  providerId: string,
): Promise<boolean> {
  try {
    const contract = getProviderContract();
    const provider = await contract.getProvider(providerId);
    return provider.registered;
  } catch (error) {
    console.error("Error checking provider registration:", error);
    return false;
  }
}

/**
 * Check if a provider is active
 */
export async function isProviderActive(
  providerId: string,
): Promise<boolean> {
  try {
    const contract = getProviderContract();
    return await contract.isProviderActive(providerId);
  } catch (error) {
    console.error("Error checking provider active status:", error);
    return false;
  }
}

/**
 * Get provider information
 */
export async function getProviderInfo(
  providerId: string,
): Promise<ProviderInfo | null> {
  try {
    const contract = getProviderContract();
    const provider = await contract.getProvider(providerId);
    return provider as ProviderInfo;
  } catch (error) {
    console.error("Error getting provider info:", error);
    return null;
  }
}

/**
 * Calculate required stake for provider registration
 */
export async function calculateRequiredStake(
  params: Omit<RegisterProviderParams, "operator" | "metadata">,
): Promise<bigint> {
  try {
    // Parse prices to wei (decimal 18)
    const cpuPriceWei = parseUnits(params.cpuPricePerSecond, 18);
    const gpuPriceWei = parseUnits(params.gpuPricePerSecond, 18);
    const memoryPriceWei = parseUnits(params.memoryPricePerSecond, 18);
    const diskPriceWei = parseUnits(params.diskPricePerSecond, 18);
    
    const contract = getProviderContract();
    
    const stake = await contract.calculateRequiredStake(
      params.cpuCores,
      params.gpuCores,
      params.memoryMB,
      params.diskGB,
      cpuPriceWei,
      gpuPriceWei,
      memoryPriceWei,
      diskPriceWei,
    );
    
    return stake;
  } catch (error: any) {
    console.error("Error calculating required stake:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      data: error.data,
      reason: error.reason,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Register a new provider
 */
export async function registerProvider(
  params: RegisterProviderParams,
): Promise<string> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = blockchainConfig.contracts.providerContract;

    if (!contractAddress) {
      throw new Error("Provider contract address is not configured");
    }

    console.log("=== registerProvider Function - Contract Setup ===");
    console.log("Contract address:", contractAddress);
    console.log("Signer address:", await signer.getAddress());

    const contract = new Contract(contractAddress, PROVIDER_CONTRACT_ABI, signer);

    // Convert prices from decimal 18 format (e.g., "0.000002777") to wei using parseUnits
    // parseUnits handles decimal 18 precision correctly for smart contract
    const cpuPriceWei = parseUnits(params.cpuPricePerSecond, 18);
    const gpuPriceWei = parseUnits(params.gpuPricePerSecond, 18);
    const memoryPriceWei = parseUnits(params.memoryPricePerSecond, 18);
    const diskPriceWei = parseUnits(params.diskPricePerSecond, 18);

    console.log("=== registerProvider Function - Parameters ===");
    console.log("Raw params:", {
      operator: params.operator,
      metadata: params.metadata,
      machineType: params.machineType,
      region: params.region,
      cpuCores: params.cpuCores,
      gpuCores: params.gpuCores,
      memoryMB: params.memoryMB,
      diskGB: params.diskGB,
      cpuPricePerSecond: params.cpuPricePerSecond,
      gpuPricePerSecond: params.gpuPricePerSecond,
      memoryPricePerSecond: params.memoryPricePerSecond,
      diskPricePerSecond: params.diskPricePerSecond,
    });
    console.log("=== registerProvider Function - Parsed Values ===");
    console.log("Prices (strings -> wei):", {
      cpuPricePerSecond: {
        string: params.cpuPricePerSecond,
        wei: cpuPriceWei.toString(),
        ether: formatUnits(cpuPriceWei, 18),
      },
      gpuPricePerSecond: {
        string: params.gpuPricePerSecond,
        wei: gpuPriceWei.toString(),
        ether: formatUnits(gpuPriceWei, 18),
      },
      memoryPricePerSecond: {
        string: params.memoryPricePerSecond,
        wei: memoryPriceWei.toString(),
        ether: formatUnits(memoryPriceWei, 18),
      },
      diskPricePerSecond: {
        string: params.diskPricePerSecond,
        wei: diskPriceWei.toString(),
        ether: formatUnits(diskPriceWei, 18),
      },
    });
    console.log("=== registerProvider Function - Contract Call Parameters ===");
    console.log("Function: registerProvider");
    console.log("Arguments:", [
      params.operator,
      params.metadata,
      params.machineType,
      params.region,
      params.cpuCores,
      params.gpuCores,
      params.memoryMB,
      params.diskGB,
      cpuPriceWei.toString(),
      gpuPriceWei.toString(),
      memoryPriceWei.toString(),
      diskPriceWei.toString(),
    ]);

    const tx = await contract.registerProvider(
      params.operator,
      params.metadata,
      params.machineType,
      params.region,
      params.cpuCores,
      params.gpuCores,
      params.memoryMB,
      params.diskGB,
      cpuPriceWei, // Convert to wei (decimal 18)
      gpuPriceWei, // Convert to wei (decimal 18)
      memoryPriceWei, // Convert to wei (decimal 18)
      diskPriceWei, // Convert to wei (decimal 18)
    );

    console.log("=== registerProvider Function - Transaction Sent ===");
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("=== registerProvider Function - Transaction Confirmed ===");
    console.log("Receipt:", {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      status: receipt.status,
    });
    
    // Extract provider address from event if available, otherwise return tx hash
    if (receipt.logs) {
      console.log("=== registerProvider Function - Parsing Logs ===");
      console.log("Total logs:", receipt.logs.length);
      // Try to find ProviderRegistered event
      const eventInterface = contract.interface;
      for (const log of receipt.logs) {
        try {
          const parsedLog = eventInterface.parseLog(log);
          console.log("Parsed log:", parsedLog?.name, parsedLog?.args);
          if (parsedLog && parsedLog.name === "ProviderRegistered") {
            // Return the provider address from the event
            console.log("ProviderRegistered event found:", parsedLog.args);
            return parsedLog.args.provider || receipt.hash;
          }
        } catch (e) {
          // Not the event we're looking for
          console.log("Failed to parse log:", e);
        }
      }
    }
    
    return receipt.hash;
  } catch (error: any) {
    console.error("=== registerProvider Function - Error ===");
    console.error("Error registering provider:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      data: error.data,
      reason: error.reason,
      transaction: error.transaction,
      receipt: error.receipt,
      stack: error.stack,
    });
    
    // Try to decode error if it's a contract error
    if (error.data) {
      try {
        const contract = new Contract(
          blockchainConfig.contracts.providerContract || "",
          PROVIDER_CONTRACT_ABI,
        );
        const errorFragment = contract.interface.parseError(error.data);
        console.error("Decoded error:", errorFragment);
      } catch (e) {
        console.error("Could not decode error:", e);
      }
    }
    
    throw new Error(error.message || "Failed to register provider");
  }
}

/**
 * Format wei to ether
 */
export function formatEther(value: bigint | string): string {
  return formatUnits(value, 18);
}

/**
 * Parse ether to wei
 */
export function parseEther(value: string): bigint {
  return parseUnits(value, 18);
}

/**
 * Get ERC20 token contract instance
 */
function getTokenContract(signer: any): Contract {
  const tokenAddress = blockchainConfig.contracts.stakeToken;
  if (!tokenAddress) {
    throw new Error("Stake token address is not configured");
  }
  return new Contract(tokenAddress, ERC20_TOKEN_ABI, signer);
}

/**
 * Check token allowance for provider contract
 */
export async function checkTokenAllowance(
  owner: string,
  spender: string = blockchainConfig.contracts.providerContract || "",
): Promise<bigint> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const tokenAddress = blockchainConfig.contracts.stakeToken;

    if (!tokenAddress) {
      throw new Error("Stake token address is not configured");
    }

    if (!spender) {
      throw new Error("Provider contract address is not configured");
    }

    const tokenContract = new Contract(tokenAddress, ERC20_TOKEN_ABI, provider);
    const allowance = await tokenContract.allowance(owner, spender);

    return allowance;
  } catch (error: any) {
    console.error("Error checking token allowance:", error);
    throw new Error(error.message || "Failed to check token allowance");
  }
}

/**
 * Approve token spending for provider contract
 */
export async function approveToken(
  amount: bigint,
  spender: string = blockchainConfig.contracts.providerContract || "",
): Promise<string> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenAddress = blockchainConfig.contracts.stakeToken;

    if (!tokenAddress) {
      throw new Error("Stake token address is not configured");
    }

    if (!spender) {
      throw new Error("Provider contract address is not configured");
    }

    const tokenContract = getTokenContract(signer);
    const tx = await tokenContract.approve(spender, amount);

    const receipt = await tx.wait();

    return receipt.hash;
  } catch (error: any) {
    console.error("Error approving token:", error);
    throw new Error(error.message || "Failed to approve token");
  }
}

export interface UpdateResourcePriceParams {
  providerId: string;
  cpuPricePerSecond: string; // in tokens (will be converted to wei)
  gpuPricePerSecond: string; // in tokens (will be converted to wei)
  memoryPricePerSecond: string; // in tokens (will be converted to wei)
  diskPricePerSecond: string; // in tokens (will be converted to wei)
}

export interface UpdateOperatorParams {
  providerId: string;
  newOperator: string; // new operator address
}

export interface UpdateProviderSpecsParams {
  providerId: string;
  machineType: number;
  region: number;
  cpuCores: number; // mCPU (decimal 3, e.g., 0.1 core = 100 mCPU)
  gpuCores: number;
  memoryMB: number;
  diskGB: number;
}

/**
 * Update resource prices for a provider
 */
export async function updateResourcePrice(
  params: UpdateResourcePriceParams,
): Promise<string> {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = blockchainConfig.contracts.providerContract;

    if (!contractAddress) {
      throw new Error("Provider contract address is not configured");
    }

    const contract = new Contract(contractAddress, PROVIDER_CONTRACT_ABI, signer);

    console.log("=== updateResourcePrice Function - Contract Setup ===");
    console.log("Contract address:", contractAddress);
    console.log("Signer address:", await signer.getAddress());

    // Convert prices from decimal 18 format (e.g., "0.000002777") to wei using parseUnits
    const cpuPriceWei = parseUnits(params.cpuPricePerSecond, 18);
    const gpuPriceWei = parseUnits(params.gpuPricePerSecond, 18);
    const memoryPriceWei = parseUnits(params.memoryPricePerSecond, 18);
    const diskPriceWei = parseUnits(params.diskPricePerSecond, 18);

    console.log("=== updateResourcePrice Function - Parameters ===");
    console.log("Raw params:", {
      providerId: params.providerId,
      cpuPricePerSecond: params.cpuPricePerSecond,
      gpuPricePerSecond: params.gpuPricePerSecond,
      memoryPricePerSecond: params.memoryPricePerSecond,
      diskPricePerSecond: params.diskPricePerSecond,
    });
    console.log("=== updateResourcePrice Function - Parsed Values ===");
    console.log("Prices (strings -> wei):", {
      cpuPricePerSecond: {
        string: params.cpuPricePerSecond,
        wei: cpuPriceWei.toString(),
        ether: formatUnits(cpuPriceWei, 18),
      },
      gpuPricePerSecond: {
        string: params.gpuPricePerSecond,
        wei: gpuPriceWei.toString(),
        ether: formatUnits(gpuPriceWei, 18),
      },
      memoryPricePerSecond: {
        string: params.memoryPricePerSecond,
        wei: memoryPriceWei.toString(),
        ether: formatUnits(memoryPriceWei, 18),
      },
      diskPricePerSecond: {
        string: params.diskPricePerSecond,
        wei: diskPriceWei.toString(),
        ether: formatUnits(diskPriceWei, 18),
      },
    });
    console.log("=== updateResourcePrice Function - Contract Call ===");
    console.log("Function: setResourcePrice");
    console.log("Arguments:", [
      params.providerId,
      cpuPriceWei.toString(),
      gpuPriceWei.toString(),
      memoryPriceWei.toString(),
      diskPriceWei.toString(),
    ]);

    const tx = await contract.setResourcePrice(
      params.providerId,
      cpuPriceWei,
      gpuPriceWei,
      memoryPriceWei,
      diskPriceWei,
    );

    console.log("=== updateResourcePrice Function - Transaction Sent ===");
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("=== updateResourcePrice Function - Transaction Confirmed ===");
    console.log("Receipt:", {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      status: receipt.status,
    });

    return receipt.hash;
  } catch (error: any) {
    console.error("=== updateResourcePrice Function - Error ===");
    console.error("Error updating resource price:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      data: error.data,
      reason: error.reason,
      transaction: error.transaction,
      receipt: error.receipt,
      stack: error.stack,
    });

    // Try to decode error if it's a contract error
    if (error.data) {
      try {
        const contract = new Contract(
          blockchainConfig.contracts.providerContract || "",
          PROVIDER_CONTRACT_ABI,
        );
        const errorFragment = contract.interface.parseError(error.data);
        console.error("Decoded error:", errorFragment);
      } catch (e) {
        console.error("Could not decode error:", e);
      }
    }

    throw new Error(error.message || "Failed to update resource price");
  }
}

/**
 * Update provider operator address
 */
export async function updateProviderOperator(
  params: UpdateOperatorParams,
): Promise<string> {
  try {
    console.log("=== Update Provider Operator ===");
    console.log("Params:", params);

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = blockchainConfig.contracts.providerContract;

    if (!contractAddress) {
      throw new Error("Provider contract address is not configured");
    }

    const contract = new Contract(
      contractAddress,
      PROVIDER_CONTRACT_ABI,
      signer,
    );

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(params.newOperator)) {
      throw new Error("Invalid operator address format");
    }

    // Call setProviderOperator function
    console.log("Calling setProviderOperator with:", {
      providerId: params.providerId,
      newOperator: params.newOperator,
    });

    const tx = await contract.setProviderOperator(
      params.providerId,
      params.newOperator,
    );

    console.log("=== Update Provider Operator - Transaction Sent ===");
    console.log("Transaction hash:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log("=== Update Provider Operator - Success ===");
    console.log("Transaction receipt:", receipt);

    return tx.hash;
  } catch (error: any) {
    console.error("=== Update Provider Operator - Error ===");
    console.error("Error updating operator:", error);

    // Try to decode error
    if (error.data) {
      try {
        const contract = new Contract(
          blockchainConfig.contracts.providerContract || "",
          PROVIDER_CONTRACT_ABI,
        );
        const decodedError = contract.interface.parseError(error.data);
        if (decodedError) {
          console.error("Decoded error:", decodedError);
          throw new Error(
            `Failed to update operator: ${decodedError.name} - ${decodedError.args}`,
          );
        }
      } catch (decodeError) {
        // If decoding fails, use original error
        console.error("Failed to decode error:", decodeError);
      }
    }

    throw new Error(
      error.message || "Failed to update provider operator. Please try again.",
    );
  }
}

/**
 * Update provider specifications (resources)
 */
export async function updateProviderSpecs(
  params: UpdateProviderSpecsParams,
): Promise<string> {
  try {
    console.log("=== Update Provider Specs ===");
    console.log("Params:", params);

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = blockchainConfig.contracts.providerContract;

    if (!contractAddress) {
      throw new Error("Provider contract address is not configured");
    }

    const contract = new Contract(
      contractAddress,
      PROVIDER_CONTRACT_ABI,
      signer,
    );

    // Convert CPU cores to mCPU (multiply by 1000)
    // cpuCores is already in mCPU format from the params
    const cpuCoresMcpu = params.cpuCores; // Already in mCPU

    console.log("Calling updateProviderSpecs with:", {
      providerId: params.providerId,
      machineType: params.machineType,
      region: params.region,
      cpuCores: cpuCoresMcpu,
      gpuCores: params.gpuCores,
      memoryMB: params.memoryMB,
      diskGB: params.diskGB,
    });

    const tx = await contract.updateProviderSpecs(
      params.providerId,
      params.machineType,
      params.region,
      cpuCoresMcpu,
      params.gpuCores,
      params.memoryMB,
      params.diskGB,
    );

    console.log("=== Update Provider Specs - Transaction Sent ===");
    console.log("Transaction hash:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log("=== Update Provider Specs - Success ===");
    console.log("Transaction receipt:", receipt);

    return tx.hash;
  } catch (error: any) {
    console.error("=== Update Provider Specs - Error ===");
    console.error("Error updating provider specs:", error);

    // Try to decode error
    if (error.data) {
      try {
        const contract = new Contract(
          blockchainConfig.contracts.providerContract || "",
          PROVIDER_CONTRACT_ABI,
        );
        const decodedError = contract.interface.parseError(error.data);
        if (decodedError) {
          console.error("Decoded error:", decodedError);
          throw new Error(
            `Failed to update provider specs: ${decodedError.name} - ${decodedError.args}`,
          );
        }
      } catch (decodeError) {
        // If decoding fails, use original error
        console.error("Failed to decode error:", decodeError);
      }
    }

    throw new Error(
      error.message || "Failed to update provider specs. Please try again.",
    );
  }
}

export interface UpdateProviderMetadataParams {
  providerId: string;
  metadata: string; // JSON string
}

/**
 * Update provider metadata
 */
export async function updateProviderMetadata(
  params: UpdateProviderMetadataParams,
): Promise<string> {
  try {
    console.log("=== Update Provider Metadata ===");
    console.log("Params:", params);

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = blockchainConfig.contracts.providerContract;

    if (!contractAddress) {
      throw new Error("Provider contract address is not configured");
    }

    const contract = new Contract(
      contractAddress,
      PROVIDER_CONTRACT_ABI,
      signer,
    );

    console.log("Calling updateProviderInfo with:", {
      providerId: params.providerId,
      metadata: params.metadata,
    });

    const tx = await contract.updateProviderInfo(
      params.providerId,
      params.metadata,
    );

    console.log("=== Update Provider Metadata - Transaction Sent ===");
    console.log("Transaction hash:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log("=== Update Provider Metadata - Success ===");
    console.log("Transaction receipt:", receipt);

    return tx.hash;
  } catch (error: any) {
    console.error("=== Update Provider Metadata - Error ===");
    console.error("Error updating provider metadata:", error);

    // Try to decode error
    if (error.data) {
      try {
        const contract = new Contract(
          blockchainConfig.contracts.providerContract || "",
          PROVIDER_CONTRACT_ABI,
        );
        const decodedError = contract.interface.parseError(error.data);
        if (decodedError) {
          console.error("Decoded error:", decodedError);
          throw new Error(
            `Failed to update provider metadata: ${decodedError.name} - ${decodedError.args}`,
          );
        }
      } catch (decodeError) {
        // If decoding fails, use original error
        console.error("Failed to decode error:", decodeError);
      }
    }

    throw new Error(
      error.message || "Failed to update provider metadata. Please try again.",
    );
  }
}
