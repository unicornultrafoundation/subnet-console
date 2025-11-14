import { Contract, BrowserProvider, formatUnits, parseUnits } from "ethers";
import { blockchainConfig } from "@/config/blockchain";

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

    const contract = new Contract(contractAddress, PROVIDER_CONTRACT_ABI, signer);

    // Convert prices from decimal 18 format (e.g., "0.000002777") to wei using parseUnits
    // parseUnits handles decimal 18 precision correctly for smart contract
    const tx = await contract.registerProvider(
      params.operator,
      params.metadata,
      params.machineType,
      params.region,
      params.cpuCores,
      params.gpuCores,
      params.memoryMB,
      params.diskGB,
      parseUnits(params.cpuPricePerSecond, 18), // Convert to wei (decimal 18)
      parseUnits(params.gpuPricePerSecond, 18), // Convert to wei (decimal 18)
      parseUnits(params.memoryPricePerSecond, 18), // Convert to wei (decimal 18)
      parseUnits(params.diskPricePerSecond, 18), // Convert to wei (decimal 18)
    );

    const receipt = await tx.wait();
    
    // Extract provider address from event if available, otherwise return tx hash
    if (receipt.logs) {
      // Try to find ProviderRegistered event
      const eventInterface = contract.interface;
      for (const log of receipt.logs) {
        try {
          const parsedLog = eventInterface.parseLog(log);
          if (parsedLog && parsedLog.name === "ProviderRegistered") {
            // Return the provider address from the event
            return parsedLog.args.provider || receipt.hash;
          }
        } catch {
          // Not the event we're looking for
        }
      }
    }
    
    return receipt.hash;
  } catch (error: any) {
    console.error("Error registering provider:", error);
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
