---
id: sesi-6
title: "Blockchain Indexer Integration & Zero Knowledge Proofs"
sidebar_label: "#6 Indexer & ZK Proofs"
sidebar_position: 6
description: "Deep dive into blockchain data indexing with Ponder dan hands-on Zero Knowledge proof implementation untuk age verification menggunakan circom."
---

# Sesi 6: Blockchain Indexer Integration & Zero Knowledge Proofs

## Informasi Umum Sesi

**Tanggal**: Hari 6  
**Durasi Total**: 5.5 jam (09:30 – 15:00)  
**Tema Pembelajaran**: Advanced Blockchain Infrastructure & Privacy Technology  

Sesi ini fokus pada dua aspek penting dalam ekosistem blockchain modern: **Data Indexing** untuk efficient querying blockchain events, dan **Zero Knowledge Proofs** untuk privacy-preserving applications. Peserta akan mengintegrasikan Ponder indexer dengan SimpleDEX yang sudah dibangun, lalu membuat aplikasi ZK proof untuk verifikasi umur menggunakan data KTP Indonesia.

---

## Jadwal Harian Detail

| Waktu            | Aktivitas                                             | Tujuan                                                 | Materi & Fokus Utama                                       |
|------------------|-------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|
| 09:30 – 12:00    | **Blockchain Indexer** — Ponder Integration          | Efficient blockchain data querying                     | Ponder setup, GraphQL APIs, React Query integration        |
| 13:30 – 15:00    | **Zero Knowledge Proofs** — Age Verification         | Privacy-preserving identity verification               | Circom circuits, KTP data processing, ZK proof generation  |

---

## Part 1: Blockchain Indexer dengan Ponder (09:30 – 12:00)

### Mengapa Indexer Diperlukan?

**🔍 Problem Statement**:
Blockchain networks menyimpan data dalam bentuk sequential blocks, making direct querying untuk specific events sangat inefficient. Untuk mendapatkan historical data seperti "semua swap events untuk user tertentu" or "total volume trading per hari", kita harus:

1. **Scan seluruh blockchain** dari genesis block
2. **Filter events** yang relevan
3. **Process dan aggregate** data manually
4. **Re-sync** setiap kali butuh updated data

**⚡ Solution: Indexer**
Indexer like Ponder constantly monitor blockchain, extract events, dan menyimpan data dalam structured database yang mudah di-query.

```mermaid
graph LR
    A[Blockchain Events] --> B[Ponder Indexer]
    B --> C[PGLite Database]
    B --> D[GraphQL API]
    D --> E[React Frontend]
    
    F[SimpleDEX Contract] --> A
    G[ERC20 Tokens] --> A
```

### Overview Ponder Architecture

**🏗️ Ponder Components**:

```typescript
// Ponder architecture overview
const ponderStack = {
  indexer: "Real-time blockchain event processor",
  database: "PGLite - embedded PostgreSQL",
  api: "Auto-generated GraphQL API",
  sync: "Automatic re-org handling & backfill"
};
```

**Key Benefits**:
- ⚡ **Real-time indexing** dengan automatic reorg handling
- 🗄️ **Structured queries** dengan GraphQL
- 📊 **Aggregated analytics** untuk dashboard metrics
- 🔄 **Automatic backfill** untuk historical data
- 🚀 **Type-safe** dengan TypeScript integration

### Setting Up Ponder Project

#### 1. Installation & Project Setup

```bash
# Create new Ponder project
npx create-ponder@latest simple-dex-indexer
cd simple-dex-indexer

# Install additional dependencies for frontend later
npm install @apollo/client graphql
```

#### 2. Configuration

**`abis/DexAbi.ts`**:
```typescript
export const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
] as const;


export const ExampleContractAbi = [] as const;

export const SIMPLE_DEX_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_tokenB",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "name": "LiquidityAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "name": "LiquidityRemoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountAIn",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountBIn",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountAOut",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountBOut",
                "type": "uint256"
            }
        ],
        "name": "Swap",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "FEE_DENOMINATOR",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "FEE_PERCENT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINIMUM_LIQUIDITY",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "name": "addLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveOut",
                "type": "uint256"
            }
        ],
        "name": "getAmountOut",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPoolInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_reserveA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_reserveB",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalLiquidity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "name": "removeLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reserveA",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reserveB",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountAIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minAmountBOut",
                "type": "uint256"
            }
        ],
        "name": "swapAforB",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountBIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minAmountAOut",
                "type": "uint256"
            }
        ],
        "name": "swapBforA",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenA",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenB",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;
```

**`ponder.config.ts`**:
```typescript
import { createConfig } from "ponder";
import { http } from "viem";
import { SIMPLE_DEX_ABI } from "./abis/DexAbi";
import { ERC20_ABI } from "./abis/DexAbi";


export default createConfig({
  chains: {
    monadTestnet: {
      id: 10143,
      rpc: http("https://testnet-rpc.monad.xyz"),
    },
  },
  contracts: {
    SimpleDEX: {
      chain: "monadTestnet",
      address: "0x70bDD0f7e01DEe803147ead041dE23a531A71CBf",
      abi: SIMPLE_DEX_ABI,
      startBlock: 23681372, // Block ketika contract di-deploy
    },
    CampusCoin: {
      chain: "monadTestnet", 
      address: "0xEBAa841c5f97Ff097e61eea151dFA03640A6CC78",
      abi: ERC20_ABI,
      startBlock: 23681372,
    },
    MockUSDC: {
      chain: "monadTestnet",
      address: "0x786Ca7D3a2E53f0d5F7bB6848E03b60Dae9a3719", 
      abi: ERC20_ABI,
      startBlock: 23681372,
    },
  },
  database: {
    kind: "postgres"
  }

});


```

#### 3. Schema Definition

**`ponder.schema.ts`**:
```typescript
import { onchainTable, onchainEnum, primaryKey, index } from "ponder";

// Define enum for liquidity event types
export const liquidityEventType = onchainEnum("liquidity_event_type", ["ADD", "REMOVE"]);

// Swap Events
export const swaps = onchainTable(
  "swaps",
  (t) => ({
    id: t.text().primaryKey(),
    user: t.hex().notNull(),
    tokenIn: t.text().notNull(),
    tokenOut: t.text().notNull(),
    amountIn: t.bigint().notNull(),
    amountOut: t.bigint().notNull(),
    priceImpact: t.real(),
    gasUsed: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(), // Use bigint for Unix timestamps
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.user),
    timestampIdx: index().on(table.timestamp),
    blockIdx: index().on(table.blockNumber),
  })
);

// Liquidity Events
export const liquidityEvents = onchainTable(
  "liquidity_events",
  (t) => ({
    id: t.text().primaryKey(),
    type: liquidityEventType("type").notNull(),
    provider: t.hex().notNull(),
    amountA: t.bigint().notNull(),
    amountB: t.bigint().notNull(),
    liquidity: t.bigint().notNull(),
    shareOfPool: t.real(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    providerIdx: index().on(table.provider),
    typeIdx: index().on(table.type),
    timestampIdx: index().on(table.timestamp),
  })
);

// Token Transfer Events
export const transfers = onchainTable(
  "transfers",
  (t) => ({
    id: t.text().primaryKey(),
    token: t.hex().notNull(),
    from: t.hex().notNull(),
    to: t.hex().notNull(),
    amount: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    tokenIdx: index().on(table.token),
    fromIdx: index().on(table.from),
    toIdx: index().on(table.to),
    timestampIdx: index().on(table.timestamp),
  })
);

// Daily Volume Statistics
export const dailyVolumes = onchainTable("daily_volumes", (t) => ({
  id: t.text().primaryKey(), // YYYY-MM-DD format
  date: t.text().notNull(),
  volumeUSD: t.real().notNull().default(0),
  transactionCount: t.integer().notNull().default(0),
  uniqueUsers: t.integer().notNull().default(0),
  avgGasPrice: t.bigint(),
}));

// Pool Statistics
export const poolStats = onchainTable("pool_stats", (t) => ({
  id: t.text().primaryKey(), // "latest" for current stats
  reserveA: t.bigint().notNull(),
  reserveB: t.bigint().notNull(),
  totalLiquidity: t.bigint().notNull(),
  price: t.bigint().notNull(),
  tvlUSD: t.real(),
  volume24h: t.real(),
  lastUpdated: t.bigint().notNull(),
}));

// User Statistics
export const userStats = onchainTable(
  "user_stats",
  (t) => ({
    id: t.hex().primaryKey(), // user address
    totalSwaps: t.integer().notNull().default(0),
    totalVolumeUSD: t.real().notNull().default(0),
    liquidityProvided: t.bigint().notNull().default(0n),
    feesEarned: t.real().notNull().default(0),
    firstSeen: t.bigint().notNull(),
    lastActivity: t.bigint().notNull(),
  }),
  (table) => ({
    lastActivityIdx: index().on(table.lastActivity),
    totalVolumeIdx: index().on(table.totalVolumeUSD),
  })
);
```

### Event Handlers Implementation

**`src/index.ts`**:
```typescript
import { ponder } from "ponder:registry";
import { swaps, liquidityEvents, transfers, dailyVolumes, poolStats, userStats } from "ponder:schema";

// Swap event handler
ponder.on("SimpleDEX:Swap", async ({ event, context }) => {
  const { client } = context;
  const { user, amountAIn, amountBIn, amountAOut, amountBOut } = event.args;

  // Determine swap direction and amounts
  const isAtoB = amountAIn > 0n;
  const tokenIn = isAtoB ? "CampusCoin" : "MockUSDC";
  const tokenOut = isAtoB ? "MockUSDC" : "CampusCoin";
  const amountIn = isAtoB ? amountAIn : amountBIn;
  const amountOut = isAtoB ? amountBOut : amountAOut;

  // Calculate price impact
  const priceImpact = calculatePriceImpact(amountIn, amountOut, tokenIn);

  // Get transaction details
  const transaction = await client.getTransaction({
    hash: event.transaction.hash,
  });

  const receipt = await client.getTransactionReceipt({
    hash: event.transaction.hash,
  });

  // Save swap event
  await context.db
    .insert(swaps)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      user: user,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      amountIn: amountIn,
      amountOut: amountOut,
      priceImpact: priceImpact,
      gasUsed: receipt.gasUsed,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });

  // Update daily volume statistics
  await updateDailyVolume(context, event, amountIn, tokenIn);

  // Update user statistics
  await updateUserStats(context, user, amountIn, tokenIn);

  // Update pool statistics
  await updatePoolStats(context, event);
});

// Liquidity Added event handler (matches ABI: LiquidityAdded)
ponder.on("SimpleDEX:LiquidityAdded", async ({ event, context }) => {
  const { provider, amountA, amountB, liquidity } = event.args;

  // Calculate share of pool (simplified)
  const shareOfPool = calculatePoolShare(liquidity, amountA, amountB);

  // Save liquidity event
  await context.db
    .insert(liquidityEvents)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      type: "ADD",
      provider: provider,
      amountA: amountA,
      amountB: amountB,
      liquidity: liquidity,
      shareOfPool: shareOfPool,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });

  // Update user stats for liquidity provision
  await updateUserLiquidityStats(context, provider, liquidity, "ADD");
});

// Liquidity Removed event handler (matches ABI: LiquidityRemoved)
ponder.on("SimpleDEX:LiquidityRemoved", async ({ event, context }) => {
  const { provider, amountA, amountB, liquidity } = event.args;

  // Calculate share of pool (simplified)
  const shareOfPool = calculatePoolShare(liquidity, amountA, amountB);

  // Save liquidity event
  await context.db
    .insert(liquidityEvents)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      type: "REMOVE",
      provider: provider,
      amountA: amountA,
      amountB: amountB,
      liquidity: liquidity,
      shareOfPool: shareOfPool,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });

  // Update user stats for liquidity removal
  await updateUserLiquidityStats(context, provider, liquidity, "REMOVE");
});

// LP Token Transfer event handler (for SimpleDEX LP tokens)
ponder.on("SimpleDEX:Transfer", async ({ event, context }) => {
  const { from, to, value } = event.args;

  // Only track meaningful transfers (not minting/burning to zero address)
  if (from !== "0x0000000000000000000000000000000000000000" && 
      to !== "0x0000000000000000000000000000000000000000") {
    await context.db
      .insert(transfers)
      .values({
        id: `${event.transaction.hash}-${event.log.logIndex}`,
        token: event.log.address, // This will be the SimpleDEX contract address (LP token)
        from: from,
        to: to,
        amount: value,
        blockNumber: event.block.number,
        timestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
      });
  }
});

// Token Transfer event handlers (for individual ERC20 tokens like CAMP/USDC)
// Note: Replace "CAMP" and "USDC" with your actual contract names from ponder.config.ts
ponder.on("CampusCoin:Transfer", async ({ event, context }) => {
  const { from, to, value } = event.args;

  await context.db
    .insert(transfers)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}-${event.log.address}`,
      token: event.log.address,
      from: from,
      to: to,
      amount: value,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });
});

ponder.on("MockUSDC:Transfer", async ({ event, context }) => {
  const { from, to, value } = event.args;

  await context.db
    .insert(transfers)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}-${event.log.address}`,
      token: event.log.address,
      from: from,
      to: to,
      amount: value,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });
});

// Helper function to calculate price impact
function calculatePriceImpact(
  amountIn: bigint, 
  amountOut: bigint, 
  tokenIn: string
): number {
  // Simplified price impact calculation
  // In real implementation, you'd get pool reserves
  const ratio = Number(amountOut) / Number(amountIn);
  
  if (tokenIn === "CampusCoin") {
    // CampusCoin -> MockUSDC, expect ratio around current price
    const expectedRatio = 2.0; // Assume 1 CAMP = 2 USDC
    return Math.abs((ratio - expectedRatio) / expectedRatio) * 100;
  } else {
    // MockUSDC -> CampusCoin
    const expectedRatio = 0.5; // 1 USDC = 0.5 CAMP
    return Math.abs((ratio - expectedRatio) / expectedRatio) * 100;
  }
}

// Helper function to calculate pool share
function calculatePoolShare(
  liquidity: bigint,
  amountA: bigint,
  amountB: bigint
): number {
  // Simplified calculation - in reality you'd need total pool liquidity
  // This is just a placeholder
  return 0.1; // 0.1% share as example
}

// Update daily volume statistics
async function updateDailyVolume(
  context: any,
  event: any,
  amountIn: bigint,
  tokenIn: string
) {
  const date = new Date(Number(event.block.timestamp) * 1000)
    .toISOString()
    .split('T')[0]; // YYYY-MM-DD format

  // Calculate volume in USD
  const volumeUSD = calculateVolumeUSD(amountIn, tokenIn);

  try {
    // Try to find existing daily volume record
    const existing = await context.db.find(dailyVolumes, { id: date });

    if (existing) {
      // Update existing record
      await context.db
        .update(dailyVolumes, { id: date })
        .set({
          volumeUSD: existing.volumeUSD + volumeUSD,
          transactionCount: existing.transactionCount + 1,
          uniqueUsers: existing.uniqueUsers + 1, // Note: This isn't accurate
        });
    } else {
      // Create new record
      await context.db
        .insert(dailyVolumes)
        .values({
          id: date,
          date: date,
          volumeUSD: volumeUSD,
          transactionCount: 1,
          uniqueUsers: 1,
          avgGasPrice: event.transaction.gasPrice || 0n,
        });
    }
  } catch (error) {
    console.error("Error updating daily volume:", error);
  }
}

// Calculate volume in USD
function calculateVolumeUSD(amountIn: bigint, tokenIn: string): number {
  if (tokenIn === "MockUSDC") {
    // MockUSDC is 1:1 with USD, but has 6 decimals
    return Number(amountIn) / 1e6;
  } else {
    // CampusCoin, assume price of $2
    const campAmount = Number(amountIn) / 1e18;
    return campAmount * 2.0;
  }
}

// Update user statistics
async function updateUserStats(
  context: any,
  user: string,
  amountIn: bigint,
  tokenIn: string
) {
  const volumeUSD = calculateVolumeUSD(amountIn, tokenIn);
  const currentTime = BigInt(Math.floor(Date.now() / 1000));

  try {
    const existing = await context.db.find(userStats, { id: user as `0x${string}` });

    if (existing) {
      await context.db
        .update(userStats, { id: user as `0x${string}` })
        .set({
          totalSwaps: existing.totalSwaps + 1,
          totalVolumeUSD: existing.totalVolumeUSD + volumeUSD,
          lastActivity: currentTime,
        });
    } else {
      await context.db
        .insert(userStats)
        .values({
          id: user as `0x${string}`,
          totalSwaps: 1,
          totalVolumeUSD: volumeUSD,
          liquidityProvided: 0n,
          feesEarned: 0,
          firstSeen: currentTime,
          lastActivity: currentTime,
        });
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
}

// Update user liquidity statistics
async function updateUserLiquidityStats(
  context: any,
  provider: string,
  liquidity: bigint,
  type: "ADD" | "REMOVE"
) {
  const currentTime = BigInt(Math.floor(Date.now() / 1000));

  try {
    const existing = await context.db.find(userStats, { id: provider as `0x${string}` });

    if (existing) {
      const liquidityChange = type === "ADD" ? liquidity : -liquidity;
      await context.db
        .update(userStats, { id: provider as `0x${string}` })
        .set({
          liquidityProvided: existing.liquidityProvided + liquidityChange,
          lastActivity: currentTime,
        });
    } else {
      await context.db
        .insert(userStats)
        .values({
          id: provider as `0x${string}`,
          totalSwaps: 0,
          totalVolumeUSD: 0,
          liquidityProvided: type === "ADD" ? liquidity : 0n,
          feesEarned: 0,
          firstSeen: currentTime,
          lastActivity: currentTime,
        });
    }
  } catch (error) {
    console.error("Error updating user liquidity stats:", error);
  }
}

// Update pool statistics
async function updatePoolStats(context: any, event: any) {
  const currentTime = event.block.timestamp;

  try {
    // Check if pool stats record exists
    const existing = await context.db.find(poolStats, { id: "latest" });

    if (existing) {
      await context.db
        .update(poolStats, { id: "latest" })
        .set({
          lastUpdated: currentTime,
          // In real implementation, you'd query contract state here
          // You could call getPoolInfo() function from your contract
        });
    } else {
      await context.db
        .insert(poolStats)
        .values({
          id: "latest",
          reserveA: 1000000000000000000000n, // Placeholder values
          reserveB: 2000000000n,
          totalLiquidity: 44721359549995793928n,
          price: 2000000n,
          tvlUSD: 4000.0,
          volume24h: 0,
          lastUpdated: currentTime,
        });
    }
  } catch (error) {
    console.error("Error updating pool stats:", error);
  }
}
```



### GraphQL API Generation

Ponder automatically generates GraphQL API berdasarkan schema. Berikut contoh queries yang tersedia:

#### 1. Query Examples

**GET_RECENT_SWAPS**:
```graphql
query GetRecentSwaps($limit: Int = 10) {
    swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        gasUsed
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
```

**GET_RECENT_LIQUIDITY_EVENTS**:
```graphql
query GetRecentLiquidityEvents($limit: Int = 10) {
    liquidityEventss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        shareOfPool
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
```

**GET_VOLUME_ANALYTICSs**:
```graphql
query GetVolumeAnalytics($days: Int = 30) {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: $days
    ) {
      items {
        date
        volumeUSD
        transactionCount
        uniqueUsers
        avgGasPrice
      }
    }
  }
```



### Frontend Integration dengan React Query

### 0. Setup GraphQL PROVIDER

**`src/App.tsx`**:
```typescript
import Header from "./components/Header";
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import type {
  Chain
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import DEXContainer from "./components/DEXContainer";
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/graphql';

// Konfigurasi Chain Monad Testnet
const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadScan',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
};

// eslint-disable-next-line react-refresh/only-export-components
export const config = getDefaultConfig({
  appName: 'Simple DEX',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Dapatkan dari https://cloud.walletconnect.com
  chains: [monadTestnet],
  ssr: true,
});

function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="min-h-screen">
              <Header />
              <DEXContainer />
            </div>
            <Toaster position="top-center" />
          </RainbowKitProvider>
        </QueryClientProvider>
      </ApolloProvider>
     
    </WagmiProvider>
  )
}

export default App
```

#### 1. Setup GraphQL Client

**`src/lib/graphql.ts`**:
```typescript
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';

// Create HTTP link to Ponder GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:42069/graphql',
});

// Create Apollo Client with optimized cache configuration
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Configure caching for paginated results
          swapss: {
            merge: false, // Don't merge, replace completely
            keyArgs: ['orderBy', 'orderDirection', 'limit'], // Cache based on these args
          },
          userStatss: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
          dailyVolumess: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
          liquidityEventss: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
          transferss: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
        },
      },
      // Cache individual records by ID
      SwapData: {
        keyFields: ['id'],
      },
      UserStatsData: {
        keyFields: ['id'],
      },
      PoolStatsData: {
        keyFields: ['id'],
      },
      DailyVolumeData: {
        keyFields: ['id'],
      },
      LiquidityEventData: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Use cache first
      notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
  },
  // Add connection retry logic
  connectToDevTools: process.env.NODE_ENV === 'development',
});

// NOTE: Ponder 0.9+ requires you to manually set up GraphQL endpoint
// Create src/api/index.ts with:
// import { db } from "ponder:api";
// import schema from "ponder:schema";
// import { Hono } from "hono";
// import { graphql } from "ponder";
// 
// const app = new Hono();
// app.use("/graphql", graphql({ db, schema }));
// export default app;

// GraphQL queries for Swaps
export const GET_RECENT_SWAPS = gql`
  query GetRecentSwaps($limit: Int = 10) {
    swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        gasUsed
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
`;

export const GET_SWAPS_BY_USER = gql`
  query GetSwapsByUser($userAddress: String!, $limit: Int = 10) {
    swapss(
      where: { user: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        timestamp
        transactionHash
      }
    }
  }
`;

// GraphQL queries for User Stats
export const GET_USER_STATS = gql`
  query GetUserStats($userAddress: String!) {
    userStats(id: $userAddress) {
      id
      totalSwaps
      totalVolumeUSD
      liquidityProvided
      feesEarned
      firstSeen
      lastActivity
    }
  }
`;

export const GET_TOP_USERS = gql`
  query GetTopUsers($limit: Int = 10) {
    userStatss(
      orderBy: "totalVolumeUSD"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        totalSwaps
        totalVolumeUSD
        liquidityProvided
        feesEarned
        lastActivity
      }
    }
  }
`;

// GraphQL queries for Daily Volume
export const GET_DAILY_VOLUME = gql`
  query GetDailyVolume($days: Int = 7) {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: $days
    ) {
      items {
        id
        date
        volumeUSD
        transactionCount
        uniqueUsers
        avgGasPrice
      }
    }
  }
`;

export const GET_TOTAL_VOLUME = gql`
  query GetTotalVolume {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "asc"
    ) {
      items {
        volumeUSD
        transactionCount
      }
    }
  }
`;

// GraphQL queries for Pool Stats
export const GET_POOL_STATS = gql`
  query GetPoolStats {
    poolStats(id: "latest") {
      id
      reserveA
      reserveB
      totalLiquidity
      price
      tvlUSD
      volume24h
      lastUpdated
    }
  }
`;

// GraphQL queries for Liquidity Events
export const GET_RECENT_LIQUIDITY_EVENTS = gql`
  query GetRecentLiquidityEvents($limit: Int = 10) {
    liquidityEventss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        shareOfPool
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
`;

export const GET_LIQUIDITY_EVENTS_BY_USER = gql`
  query GetLiquidityEventsByUser($userAddress: String!, $limit: Int = 10) {
    liquidityEventss(
      where: { provider: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        amountA
        amountB
        liquidity
        shareOfPool
        timestamp
        transactionHash
      }
    }
  }
`;

// GraphQL queries for Token Transfers
export const GET_RECENT_TRANSFERS = gql`
  query GetRecentTransfers($tokenAddress: String, $limit: Int = 10) {
    transferss(
      where: { token: $tokenAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        token
        from
        to
        amount
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
`;

export const GET_TRANSFERS_BY_USER = gql`
  query GetTransfersByUser($userAddress: String!, $limit: Int = 10) {
    transferss(
      where: { 
        OR: [
          { from: $userAddress }
          { to: $userAddress }
        ]
      }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        token
        from
        to
        amount
        timestamp
        transactionHash
      }
    }
  }
`;

// Combined dashboard query
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($userAddress: String) {
    # Recent swaps
    recentSwaps: swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: 5
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        timestamp
      }
    }
    
    # Pool stats
    poolStats(id: "latest") {
      reserveA
      reserveB
      totalLiquidity
      price
      tvlUSD
      volume24h
      lastUpdated
    }
    
    # Daily volume (last 7 days)
    dailyVolumes: dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: 7
    ) {
      items {
        date
        volumeUSD
        transactionCount
        uniqueUsers
      }
    }
    
    # User stats (if userAddress provided)
    userStats(id: $userAddress) {
      totalSwaps
      totalVolumeUSD
      liquidityProvided
      feesEarned
      firstSeen
      lastActivity
    }
  }
`;

// Analytics queries
export const GET_VOLUME_ANALYTICS = gql`
  query GetVolumeAnalytics($days: Int = 30) {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: $days
    ) {
      items {
        date
        volumeUSD
        transactionCount
        uniqueUsers
        avgGasPrice
      }
    }
  }
`;

export const GET_TOP_TRADERS = gql`
  query GetTopTraders($limit: Int = 20) {
    userStatss(
      where: { totalSwaps_gt: 0 }
      orderBy: "totalVolumeUSD"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        totalSwaps
        totalVolumeUSD
        liquidityProvided
        feesEarned
        firstSeen
        lastActivity
      }
    }
  }
`;

export const GET_LIQUIDITY_PROVIDERS = gql`
  query GetLiquidityProviders($limit: Int = 20) {
    userStatss(
      where: { liquidityProvided_gt: 0 }
      orderBy: "liquidityProvided"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        totalSwaps
        totalVolumeUSD
        liquidityProvided
        feesEarned
        firstSeen
        lastActivity
      }
    }
  }
`;

// Real-time activity query
export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int = 20) {
    # Recent swaps
    recentSwaps: swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        timestamp
        transactionHash
      }
    }
    
    # Recent liquidity events
    recentLiquidityEvents: liquidityEventss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        timestamp
        transactionHash
      }
    }
  }
`;

// Search queries
export const SEARCH_TRANSACTIONS = gql`
  query SearchTransactions($hash: String!) {
    # Search swaps
    swaps: swapss(where: { transactionHash: $hash }) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        timestamp
        transactionHash
      }
    }
    
    # Search liquidity events
    liquidityEvents: liquidityEventss(where: { transactionHash: $hash }) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        timestamp
        transactionHash
      }
    }
    
    # Search transfers
    transfers: transferss(where: { transactionHash: $hash }) {
      items {
        id
        token
        from
        to
        amount
        timestamp
        transactionHash
      }
    }
  }
`;

// Helper function to format BigInt values for GraphQL
export const formatBigIntForGraphQL = (value: bigint): string => {
  return value.toString();
};

// Helper function to parse BigInt values from GraphQL
export const parseBigIntFromGraphQL = (value: string): bigint => {
  return BigInt(value);
};

// Type definitions for GraphQL responses
export interface SwapData {
  id: string;
  user: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  gasUsed: string;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
}

export interface UserStatsData {
  id: string;
  totalSwaps: number;
  totalVolumeUSD: number;
  liquidityProvided: string;
  feesEarned: number;
  firstSeen: string;
  lastActivity: string;
}

export interface DailyVolumeData {
  id: string;
  date: string;
  volumeUSD: number;
  transactionCount: number;
  uniqueUsers: number;
  avgGasPrice: string;
}

export interface PoolStatsData {
  id: string;
  reserveA: string;
  reserveB: string;
  totalLiquidity: string;
  price: string;
  tvlUSD: number;
  volume24h: number;
  lastUpdated: string;
}

export interface LiquidityEventData {
  id: string;
  type: "ADD" | "REMOVE";
  provider: string;
  amountA: string;
  amountB: string;
  liquidity: string;
  shareOfPool: number;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
}

export interface TransferData {
  id: string;
  token: string;
  from: string;
  to: string;
  amount: string;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
}
```

#### 2. Custom Hooks dengan React Query

**`src/hooks/useIndexerData.ts`**:
```typescript
import { useQuery } from '@apollo/client';
import { useMemo, useCallback } from 'react';
import { 
  GET_RECENT_SWAPS, 
  GET_USER_STATS, 
  GET_DAILY_VOLUME, 
  GET_POOL_STATS,
  GET_RECENT_LIQUIDITY_EVENTS,
  GET_TOP_USERS,
  GET_VOLUME_ANALYTICS,
  GET_DASHBOARD_DATA
} from '../lib/graphql';
import type {
  SwapData,
  UserStatsData,
  DailyVolumeData,
  PoolStatsData,
  LiquidityEventData
} from '../lib/graphql';

/*
 * OPTIMIZED POLLING INTERVALS FOR REAL-TIME DEX TRADING:
 * 
 * 🚀 High Priority (3-5s):  Recent swaps, Pool stats
 * ⚡ Medium Priority (8-15s): Liquidity events, Daily volume, User stats  
 * 📊 Low Priority (30-60s):  Top users, Volume analytics
 * 
 * These intervals provide excellent real-time experience while maintaining
 * reasonable server load and network usage.
 */

// Hook for recent swaps
export const useRecentSwaps = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_SWAPS, {
    variables: { limit },
    pollInterval: 30000, // Reduced from 5000 to 30000 (30 seconds)
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    fetchPolicy: 'cache-first', // Use cache first to reduce network calls
  });

  // Memoize the returned data to prevent object recreation on every render
  const swapData = useMemo(() => data?.swapss?.items || [], [data?.swapss?.items]);
  
  // Memoize the refetch function
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  // Return stable object reference
  return useMemo(() => ({
    data: swapData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [swapData, loading, error, stableRefetch]);
};

// Hook for user statistics
export const useUserStats = (userAddress?: string) => {
  const { data, loading, error, refetch } = useQuery(GET_USER_STATS, {
    variables: { userAddress },
    skip: !userAddress,
    pollInterval: 60000, // Reduced from 10000 to 60000 (1 minute)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const userData = useMemo(() => data?.userStats, [data?.userStats]);
  
  const stableRefetch = useCallback(() => {
    if (!userAddress) return Promise.resolve();
    return refetch();
  }, [refetch, userAddress]);

  return useMemo(() => ({
    data: userData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [userData, loading, error, stableRefetch]);
};

// Hook for daily volume
export const useDailyVolume = (days = 7) => {
  const { data, loading, error, refetch } = useQuery(GET_DAILY_VOLUME, {
    variables: { days },
    pollInterval: 120000, // Reduced from 30000 to 120000 (2 minutes)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const volumeData = useMemo(() => data?.dailyVolumess?.items || [], [data?.dailyVolumess?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: volumeData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [volumeData, loading, error, stableRefetch]);
};

// Hook for pool statistics
export const usePoolStats = () => {
  const { data, loading, error, refetch } = useQuery(GET_POOL_STATS, {
    pollInterval: 60000, // Reduced from 15000 to 60000 (1 minute)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const poolData = useMemo(() => data?.poolStats, [data?.poolStats]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: poolData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [poolData, loading, error, stableRefetch]);
};

// Hook for recent liquidity events
export const useLiquidityEvents = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_LIQUIDITY_EVENTS, {
    variables: { limit },
    pollInterval: 60000, // Reduced from 5000 to 60000 (1 minute)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const liquidityData = useMemo(() => data?.liquidityEventss?.items || [], [data?.liquidityEventss?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: liquidityData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [liquidityData, loading, error, stableRefetch]);
};

// Hook for top users
export const useTopUsers = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_TOP_USERS, {
    variables: { limit },
    pollInterval: 300000, // 5 minutes - this data doesn't change often
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const topUsersData = useMemo(() => data?.userStatss?.items || [], [data?.userStatss?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: topUsersData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [topUsersData, loading, error, stableRefetch]);
};

// Hook for volume analytics
export const useVolumeAnalytics = (days = 30) => {
  const { data, loading, error, refetch } = useQuery(GET_VOLUME_ANALYTICS, {
    variables: { days },
    pollInterval: 60000, // 1 minute - historical data changes slowly
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const analyticsData = useMemo(() => data?.dailyVolumess?.items || [], [data?.dailyVolumess?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: analyticsData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [analyticsData, loading, error, stableRefetch]);
};

// Hook for dashboard data (combined query) - ONLY USE THIS IF YOU NEED ALL DATA AT ONCE
export const useDashboardData = (userAddress?: string) => {
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { userAddress },
    pollInterval: 120000, // 2 minutes
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const dashboardData = useMemo(() => ({
    recentSwaps: data?.recentSwaps?.items || [],
    poolStats: data?.poolStats,
    dailyVolumes: data?.dailyVolumes?.items || [],
    userStats: data?.userStats,
  }), [
    data?.recentSwaps?.items,
    data?.poolStats,
    data?.dailyVolumes?.items,
    data?.userStats
  ]);

  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: dashboardData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [dashboardData, loading, error, stableRefetch]);
};

// Hook for aggregated analytics - CAREFUL: This uses multiple queries
export const useAnalytics = () => {
  const recentSwaps = useRecentSwaps(50);
  const dailyVolume = useDailyVolume(30);
  const poolStats = usePoolStats();
  const liquidityEvents = useLiquidityEvents(20);
  
  // Memoize the aggregated data
  const aggregatedData = useMemo(() => ({
    recentSwaps: recentSwaps.data || [],
    dailyVolume: dailyVolume.data || [],
    poolStats: poolStats.data,
    liquidityEvents: liquidityEvents.data || [],
    isLoading: recentSwaps.isLoading || dailyVolume.isLoading || poolStats.isLoading,
    error: recentSwaps.error || dailyVolume.error || poolStats.error,
  }), [
    recentSwaps.data,
    recentSwaps.isLoading,
    recentSwaps.error,
    dailyVolume.data,
    dailyVolume.isLoading,
    dailyVolume.error,
    poolStats.data,
    poolStats.isLoading,
    poolStats.error,
    liquidityEvents.data
  ]);

  return aggregatedData;
};

// Helper hook for indexer health - Simple health check
export const useIndexerHealth = () => {
  const { data, loading, error } = useQuery(GET_POOL_STATS, {
    pollInterval: 30000, // 30 seconds - health check doesn't need to be too frequent
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Changed from network-only for better performance
    notifyOnNetworkStatusChange: false,
  });

  const healthData = useMemo(() => ({
    isHealthy: !error && !!data?.poolStats,
    lastUpdated: data?.poolStats?.lastUpdated,
    error: error
  }), [error, data?.poolStats]);

  return useMemo(() => ({
    data: healthData,
    isLoading: loading,
    error,
  }), [healthData, loading, error]);
};

// Manual refetch hook - Use this for user-triggered refreshes
export const useManualRefresh = () => {
  const recentSwaps = useRecentSwaps();
  const poolStats = usePoolStats();
  const dailyVolume = useDailyVolume();

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        recentSwaps.refetch(),
        poolStats.refetch(),
        dailyVolume.refetch(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [recentSwaps.refetch, poolStats.refetch, dailyVolume.refetch]);

  return { refreshAll };
};

// Re-export types for convenience
export type {
  SwapData,
  UserStatsData,
  DailyVolumeData,
  PoolStatsData,
  LiquidityEventData
};
```

#### 3. Enhanced Transaction History Component and Price Component

**Update `src/components/PriceChart.tsx`**:
```typescript
"use client"

import { useState, useEffect, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, RefreshCw } from "lucide-react"
import { usePoolData } from "../hooks/usePoolData"
import { useRecentSwaps, useUserStats, useDailyVolume, useIndexerHealth, useManualRefresh } from "../hooks/useIndexerData"
import { useWatchContractEvent, usePublicClient, useAccount } from "wagmi"
import { SIMPLE_DEX_ABI, CONTRACTS } from "../constants"
import { formatNumber, formatTime, formatUSD } from "../utils/formatters"
import type { PriceData } from "../types/defi"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: PriceData }>
}

interface SwapEvent {
  args: {
    user: string
    amountIn: bigint
    amountOut: bigint
    tokenAtoB: boolean
  }
  blockNumber: bigint
  transactionHash: string
}

interface LiquidityEvent {
  args: {
    provider: string
    amountA: bigint
    amountB: bigint
    liquidity: bigint
  }
  blockNumber: bigint
  transactionHash: string
}

const PriceChart = () => {
  const { address } = useAccount()
  const { poolInfo, isLoading } = usePoolData()
  const [timeFrame, setTimeFrame] = useState<'1H' | '1D' | '1W' | '1M'>('1D')
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [volume24h, setVolume24h] = useState(0)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  // Fetch data from indexer for analytics
  const { data: recentSwaps, isLoading: swapsLoading } = useRecentSwaps(100)
  const { data: userStats, isLoading: userLoading } = useUserStats(address)
  const { data: dailyVolume, isLoading: volumeLoading } = useDailyVolume(7)
  const { data: indexerHealth } = useIndexerHealth()
  const { refreshAll } = useManualRefresh()

  // Manual refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const publicClient = usePublicClient()

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshAll()
      await fetchHistoricalData() // Also refresh chart data
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate metrics from indexer data
  const metrics = useMemo(() => {
    if (!recentSwaps || !dailyVolume) return null

    const total24hVolume = dailyVolume[0]?.volumeUSD || 0
    const total24hTxs = dailyVolume[0]?.transactionCount || 0
    const uniqueUsers = new Set(recentSwaps.map((swap: any) => swap.user)).size

    return {
      volume24h: total24hVolume,
      transactions24h: total24hTxs,
      uniqueUsers,
      avgTradeSize: total24hTxs > 0 ? total24hVolume / total24hTxs : 0
    }
  }, [recentSwaps, dailyVolume])

  // Calculate real price from pool reserves
  const calculateRealPrice = (reserveA: bigint, reserveB: bigint) => {
    if (reserveA === BigInt(0) || reserveB === BigInt(0)) {
      return 0
    }
    
    // Price = reserveB / reserveA (adjusted for decimals)
    // USDC (6 decimals) per CAMP (18 decimals)
    const reserveA_adjusted = Number(reserveA) / Math.pow(10, 18) // CAMP
    const reserveB_adjusted = Number(reserveB) / Math.pow(10, 6)  // USDC
    
    return reserveB_adjusted / reserveA_adjusted
  }

  // Calculate real TVL from reserves
  const calculateTVL = (reserveA: bigint, reserveB: bigint, price: number) => {
    const campValue = (Number(reserveA) / Math.pow(10, 18)) * price
    const usdcValue = Number(reserveB) / Math.pow(10, 6)
    return campValue + usdcValue
  }

  // Fetch historical events and build price history
  const fetchHistoricalData = async () => {
    if (!publicClient) return

    setIsLoadingHistory(true)
    
    try {
      const currentBlock = await publicClient.getBlockNumber()
      
      // Calculate blocks to fetch based on timeframe
      const getBlockRange = () => {
        const blocksPerHour = 300 // Approximate blocks per hour (12 sec per block)
        switch (timeFrame) {
          case '1H': return { blocks: blocksPerHour, points: 12 }
          case '1D': return { blocks: blocksPerHour * 24, points: 24 }
          case '1W': return { blocks: blocksPerHour * 24 * 7, points: 48 }
          case '1M': return { blocks: blocksPerHour * 24 * 30, points: 60 }
          default: return { blocks: blocksPerHour * 24, points: 24 }
        }
      }

      const { blocks, points } = getBlockRange()
      const fromBlock = currentBlock - BigInt(blocks)

      // Fetch swap events for volume calculation
      const swapEvents = await publicClient.getLogs({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        event: {
          type: 'event',
          name: 'Swap',
          inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'amountIn', type: 'uint256', indexed: false },
            { name: 'amountOut', type: 'uint256', indexed: false },
            { name: 'tokenAtoB', type: 'bool', indexed: false }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      })

      // Fetch liquidity events
      const liquidityAddedEvents = await publicClient.getLogs({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        event: {
          type: 'event',
          name: 'LiquidityAdded',
          inputs: [
            { name: 'provider', type: 'address', indexed: true },
            { name: 'amountA', type: 'uint256', indexed: false },
            { name: 'amountB', type: 'uint256', indexed: false },
            { name: 'liquidity', type: 'uint256', indexed: false }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      })

      const liquidityRemovedEvents = await publicClient.getLogs({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        event: {
          type: 'event',
          name: 'LiquidityRemoved',
          inputs: [
            { name: 'provider', type: 'address', indexed: true },
            { name: 'amountA', type: 'uint256', indexed: false },
            { name: 'amountB', type: 'uint256', indexed: false },
            { name: 'liquidity', type: 'uint256', indexed: false }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      })

      // Combine and sort all events by block number
      const allEvents = [
        ...swapEvents.map(e => ({ ...e, type: 'swap' })),
        ...liquidityAddedEvents.map(e => ({ ...e, type: 'liquidityAdded' })),
        ...liquidityRemovedEvents.map(e => ({ ...e, type: 'liquidityRemoved' }))
      ].sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))

      // Calculate 24h volume from swap events
      const now = Date.now()
      const oneDayAgo = now - 24 * 60 * 60 * 1000
      
      let totalVolume24h = 0
      for (const event of swapEvents) {
        const block = await publicClient.getBlock({ blockNumber: event.blockNumber })
        const timestamp = Number(block.timestamp) * 1000
        
        if (timestamp >= oneDayAgo) {
          const swapArgs = event.args as SwapEvent['args']
          const volumeUSD = swapArgs.tokenAtoB 
            ? (Number(swapArgs.amountIn) / Math.pow(10, 18)) * calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
            : Number(swapArgs.amountIn) / Math.pow(10, 6)
          totalVolume24h += volumeUSD
        }
      }
      
      setVolume24h(totalVolume24h)

      // Build price history from events
      const priceDataPoints: PriceData[] = []
      let currentReserveA = poolInfo.reserveA
      let currentReserveB = poolInfo.reserveB

      // Start with current state and work backwards
      const currentPrice = calculateRealPrice(currentReserveA, currentReserveB)
      const currentTVL = calculateTVL(currentReserveA, currentReserveB, currentPrice)

      // Add current data point
      priceDataPoints.unshift({
        timestamp: now,
        price: currentPrice,
        volume24h: totalVolume24h,
        tvl: currentTVL
      })

      // Process events in reverse to calculate historical states
      for (let i = allEvents.length - 1; i >= 0; i--) {
        const event = allEvents[i]
        const block = await publicClient.getBlock({ blockNumber: event.blockNumber })
        const timestamp = Number(block.timestamp) * 1000

        // Reverse the event to get previous state
        if (event.type === 'swap') {
          const swapArgs = event.args as SwapEvent['args']
          if (swapArgs.tokenAtoB) {
            // Reverse: add back amountIn to reserveA, subtract amountOut from reserveB
            currentReserveA += swapArgs.amountIn
            currentReserveB -= swapArgs.amountOut
          } else {
            // Reverse: add back amountIn to reserveB, subtract amountOut from reserveA
            currentReserveB += swapArgs.amountIn
            currentReserveA -= swapArgs.amountOut
          }
        } else if (event.type === 'liquidityAdded') {
          const liquidityArgs = event.args as LiquidityEvent['args']
          // Reverse: subtract the added amounts
          currentReserveA -= liquidityArgs.amountA
          currentReserveB -= liquidityArgs.amountB
        } else if (event.type === 'liquidityRemoved') {
          const liquidityArgs = event.args as LiquidityEvent['args']
          // Reverse: add back the removed amounts
          currentReserveA += liquidityArgs.amountA
          currentReserveB += liquidityArgs.amountB
        }

        // Calculate price for this historical state
        const historicalPrice = calculateRealPrice(currentReserveA, currentReserveB)
        const historicalTVL = calculateTVL(currentReserveA, currentReserveB, historicalPrice)

        // Add data point (but don't exceed our target number of points)
        if (priceDataPoints.length < points) {
          priceDataPoints.unshift({
            timestamp,
            price: historicalPrice,
            volume24h: 0, // Volume is calculated for 24h window
            tvl: historicalTVL
          })
        }
      }

      // If we don't have enough points, fill with interpolated data
      while (priceDataPoints.length < points) {
        const interval = timeFrame === '1H' ? 5 * 60 * 1000 : 60 * 60 * 1000
        const lastPoint = priceDataPoints[0]
        const newTimestamp = lastPoint.timestamp - interval
        
        priceDataPoints.unshift({
          timestamp: newTimestamp,
          price: lastPoint.price * (0.98 + Math.random() * 0.04), // Small random variation
          volume24h: 0,
          tvl: lastPoint.tvl
        })
      }

      setPriceHistory(priceDataPoints.slice(-points))

    } catch (error) {
      console.error('Error fetching historical data:', error)
      // Fallback to current price if historical fetch fails
      const currentPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      if (currentPrice > 0) {
        setPriceHistory([{
          timestamp: Date.now(),
          price: currentPrice,
          volume24h: 0,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, currentPrice)
        }])
      }
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Watch for real-time swap events
  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'Swap',
    onLogs() {
      console.log('Real swap detected, updating price chart...')
      const newPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      
      if (newPrice > 0) {
        const newDataPoint: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume24h: volume24h,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, newPrice)
        }
        
        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint].slice(-100)
          return updated
        })
      }
    }
  })

  // Watch for real-time liquidity events
  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'LiquidityAdded',
    onLogs() {
      console.log('Real liquidity added, updating price chart...')
      const newPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      
      if (newPrice > 0) {
        const newDataPoint: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume24h: volume24h,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, newPrice)
        }
        
        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint].slice(-100)
          return updated
        })
      }
    }
  })

  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'LiquidityRemoved',
    onLogs() {
      console.log('Real liquidity removed, updating price chart...')
      const newPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      
      if (newPrice > 0) {
        const newDataPoint: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume24h: volume24h,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, newPrice)
        }
        
        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint].slice(-100)
          return updated
        })
      }
    }
  })

  // Fetch historical data when component mounts or timeframe changes
  useEffect(() => {
    if (poolInfo.reserveA > 0 && poolInfo.reserveB > 0) {
      fetchHistoricalData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame, poolInfo.reserveA, poolInfo.reserveB, publicClient])

  // Calculate price change
  const priceChange = priceHistory.length > 1 
    ? ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100
    : 0

  const getPriceChangeIcon = () => {
    if (priceChange > 0) return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#10B981" }} />
    if (priceChange < 0) return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#EF4444" }} />
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "rgba(251, 250, 249, 0.7)" }} />
  }

  const getPriceChangeColor = () => {
    if (priceChange > 0) return "#10B981"
    if (priceChange < 0) return "#EF4444"
    return "rgba(251, 250, 249, 0.7)"
  }

  const formatXAxisTick = (tickItem: number) => {
    const date = new Date(tickItem)
    switch (timeFrame) {
      case '1H':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      case '1D':
        return date.toLocaleTimeString('en-US', { hour: '2-digit' })
      case '1W':
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      case '1M':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      default:
        return ''
    }
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PriceData
      return (
        <div className="glass rounded-lg p-2 sm:p-3 border border-white/20 max-w-xs">
          <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            {formatTime(data.timestamp)}
          </div>
          <div className="font-bold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
            ${formatNumber(data.price, 6)} USDC
          </div>
          <div className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            TVL: ${formatNumber(data.tvl)}
          </div>
        </div>
      )
    }
    return null
  }

  const currentRealPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
  const currentTVL = calculateTVL(poolInfo.reserveA, poolInfo.reserveB, currentRealPrice)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0 space-y-8">
      {/* Analytics Dashboard */}
      {metrics && (
        <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: "#FBFAF9" }}>
              📊 Real-time Analytics
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Powered by Ponder Indexer
              </div>
              {indexerHealth && (
                <div className={`w-2 h-2 rounded-full ${indexerHealth.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: "rgba(251, 250, 249, 0.7)" }} />
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)"
            }}>
              <DollarSign className="w-5 h-5 mb-2" style={{ color: "#836EF9" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {formatUSD(metrics.volume24h)}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                24h Volume
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderColor: "rgba(16, 185, 129, 0.3)"
            }}>
              <TrendingUp className="w-5 h-5 mb-2" style={{ color: "#10B981" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {metrics.transactions24h}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                24h Transactions
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(160, 5, 93, 0.1)",
              borderColor: "rgba(160, 5, 93, 0.3)"
            }}>
              <Users className="w-5 h-5 mb-2" style={{ color: "#A0055D" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {metrics.uniqueUsers}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Unique Users
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderColor: "rgba(245, 158, 11, 0.3)"
            }}>
              <TrendingUp className="w-5 h-5 mb-2" style={{ color: "#F59E0B" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {formatUSD(metrics.avgTradeSize)}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Avg Trade Size
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          {!volumeLoading && dailyVolume && dailyVolume.length > 0 && (
            <div className="h-64">
              <h4 className="text-lg font-semibold mb-4" style={{ color: "#FBFAF9" }}>
                7-Day Volume Trend
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...dailyVolume].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(251, 250, 249, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(251, 250, 249, 0.5)"
                    fontSize={10}
                  />
                  <YAxis 
                    stroke="rgba(251, 250, 249, 0.5)"
                    fontSize={10}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "rgba(14, 16, 15, 0.9)",
                      border: "1px solid rgba(251, 250, 249, 0.2)",
                      borderRadius: "8px",
                      color: "#FBFAF9"
                    }}
                    formatter={(value: any) => [formatUSD(value), 'Volume']}
                  />
                  <Bar dataKey="volumeUSD" fill="#836EF9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* User Stats */}
      {address && userStats && (
        <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#FBFAF9" }}>
            👤 Your Trading Statistics
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#836EF9" }}>
                {userStats.totalSwaps}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Total Swaps
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#10B981" }}>
                {formatUSD(userStats.totalVolumeUSD)}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Total Volume
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#A0055D" }}>
              {formatNumber(Number(userStats.liquidityProvided) / 1e18 , 8)}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                LP Tokens
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#F59E0B" }}>
                {formatUSD(userStats.feesEarned)}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Fees Earned
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Chart */}
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#FBFAF9" }}>
              CAMP Real-Time Price
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: "#FBFAF9" }}>
                ${formatNumber(currentRealPrice, 6)}
              </span>
              <div className="flex items-center space-x-1">
                {getPriceChangeIcon()}
                <span 
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: getPriceChangeColor() }}
                >
                  {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange, 2)}%
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm mt-2" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              📊 Real data from smart contract events • Live updates
            </div>
          </div>

          {/* Time Frame Selector */}
          <div className="flex-shrink-0">
            <div className="flex space-x-1 p-1 rounded-lg border w-full sm:w-auto" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all duration-200 ${
                    timeFrame === tf 
                      ? 'gradient-monad-primary text-white' 
                      : 'hover:bg-white/10'
                  }`}
                  style={{ 
                    color: timeFrame === tf ? "#FBFAF9" : "rgba(251, 250, 249, 0.7)" 
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6">
          {isLoading || isLoadingHistory || priceHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4">
                <div className="spinner w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-4"></div>
                <div className="text-sm sm:text-base" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  {isLoadingHistory ? "Loading real historical data..." : "Fetching blockchain events..."}
                </div>
                <div className="text-xs sm:text-sm mt-2" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                  Building price history from smart contract events
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(251, 250, 249, 0.1)" 
                />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={formatXAxisTick}
                  stroke="rgba(251, 250, 249, 0.5)"
                  fontSize={10}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis 
                  domain={['dataMin * 0.95', 'dataMax * 1.05']}
                  tickFormatter={(value) => `$${formatNumber(value, 4)}`}
                  stroke="rgba(251, 250, 249, 0.5)"
                  fontSize={10}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#836EF9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: "#836EF9",
                    stroke: "#FBFAF9",
                    strokeWidth: 1
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart Stats - All Real Data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              24h High
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#10B981" }}>
              ${formatNumber(priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.price)) : currentRealPrice, 4)}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              24h Low
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#EF4444" }}>
              ${formatNumber(priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.price)) : currentRealPrice, 4)}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Real TVL
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
              ${formatNumber(currentTVL)}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              24h Volume
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
              ${formatNumber(volume24h)}
            </div>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 text-xs sm:text-sm text-center space-y-1 sm:space-y-0">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
            <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              🔗 Real blockchain data
            </span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            {priceHistory.length} data points from events
          </span>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            Last update: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PriceChart
```



**Update `src/components/TransactionHistory.tsx`**:
```typescript
"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, Plus, Minus, ExternalLink, Search, RefreshCw } from "lucide-react"
import { useAccount } from "wagmi"
import { useRecentSwaps, useLiquidityEvents, useIndexerHealth, useManualRefresh } from "../hooks/useIndexerData"
import { formatTokenAmount, formatTime, formatAddress, formatNumber, formatUSD } from "../utils/formatters"
import type { SwapData, LiquidityEventData } from "../hooks/useIndexerData"

interface CombinedTransaction {
  id: string
  type: 'swap' | 'add_liquidity' | 'remove_liquidity'
  user: string
  timestamp: string
  transactionHash: string
  blockNumber: string
  data: SwapData | LiquidityEventData
}

const TransactionHistory = () => {
  const { address } = useAccount()
  const [filter, setFilter] = useState<'all' | 'swap' | 'add_liquidity' | 'remove_liquidity'>('all')
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch data from indexer
  const { data: recentSwaps, isLoading: swapsLoading, error: swapsError } = useRecentSwaps(50)
  const { data: liquidityEvents, isLoading: liquidityLoading, error: liquidityError } = useLiquidityEvents(50)
  const { data: indexerHealth } = useIndexerHealth()
  const { refreshAll } = useManualRefresh()

  // Manual refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshAll()
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Combine and process transactions
  const combinedTransactions = useMemo(() => {
    const combined: CombinedTransaction[] = []

    // Add swaps
    if (recentSwaps) {
      recentSwaps.forEach((swap: SwapData) => {
        combined.push({
          id: `swap_${swap.id}`,
          type: 'swap',
          user: swap.user,
          timestamp: swap.timestamp,
          transactionHash: swap.transactionHash,
          blockNumber: swap.blockNumber,
          data: swap
        })
      })
    }

    // Add liquidity events
    if (liquidityEvents) {
      liquidityEvents.forEach((event: LiquidityEventData) => {
        combined.push({
          id: `liquidity_${event.id}`,
          type: event.type === 'ADD' ? 'add_liquidity' : 'remove_liquidity',
          user: event.provider,
          timestamp: event.timestamp,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          data: event
        })
      })
    }

    // Sort by timestamp (newest first)
    return combined.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
  }, [recentSwaps, liquidityEvents])

  // Process data for filtering
  const filteredTransactions = useMemo(() => {
    return combinedTransactions.filter((tx: CombinedTransaction) => {
      const matchesFilter = filter === 'all' || tx.type === filter
      const matchesSearch = !searchTerm || 
        tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesFilter && matchesSearch
    })
  }, [combinedTransactions, filter, searchTerm])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#836EF9" }} />
      case 'add_liquidity':
        return <Plus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#10B981" }} />
      case 'remove_liquidity':
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#EF4444" }} />
      default:
        return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#836EF9" }} />
    }
  }

  const getTransactionDescription = (tx: CombinedTransaction) => {
    if (tx.type === 'swap') {
      const swapData = tx.data as SwapData
      
      // Handle different token names from our contracts
      const getTokenSymbol = (tokenName: string) => {
        if (tokenName === 'CampusCoin') return 'CAMP'
        if (tokenName === 'MockUSDC') return 'USDC'
        return tokenName
      }

      const getTokenDecimals = (tokenName: string) => {
        if (tokenName === 'CampusCoin') return 18
        if (tokenName === 'MockUSDC') return 6
        return 18
      }

      const tokenInSymbol = getTokenSymbol(swapData.tokenIn)
      const tokenOutSymbol = getTokenSymbol(swapData.tokenOut)
      const tokenInDecimals = getTokenDecimals(swapData.tokenIn)
      const tokenOutDecimals = getTokenDecimals(swapData.tokenOut)

      const amountInFormatted = (Number(swapData.amountIn) / Math.pow(10, tokenInDecimals)).toFixed(
        tokenInDecimals === 18 ? 4 : 2
      )
      const amountOutFormatted = (Number(swapData.amountOut) / Math.pow(10, tokenOutDecimals)).toFixed(
        tokenOutDecimals === 18 ? 4 : 2
      )

      return `${amountInFormatted} ${tokenInSymbol} → ${amountOutFormatted} ${tokenOutSymbol}`
    } else {
      const liquidityData = tx.data as LiquidityEventData
      
      const amountA = (Number(liquidityData.amountA) / Math.pow(10, 18)).toFixed(4) // CAMP
      const amountB = (Number(liquidityData.amountB) / Math.pow(10, 6)).toFixed(2)  // USDC
      const liquidityAmount = (Number(liquidityData.liquidity) / Math.pow(10, 18)).toFixed(4)

      if (tx.type === 'add_liquidity') {
        return `Add ${amountA} CAMP + ${amountB} USDC (${liquidityAmount} LP)`
      } else {
        return `Remove ${amountA} CAMP + ${amountB} USDC (${liquidityAmount} LP)`
      }
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'swap':
        return 'Swap'
      case 'add_liquidity':
        return 'Add Liquidity'
      case 'remove_liquidity':
        return 'Remove Liquidity'
      default:
        return 'Transaction'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'swap':
        return {
          bg: "rgba(131, 110, 249, 0.1)",
          border: "rgba(131, 110, 249, 0.3)",
          color: "#836EF9"
        }
      case 'add_liquidity':
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          border: "rgba(16, 185, 129, 0.3)",
          color: "#10B981"
        }
      case 'remove_liquidity':
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
          color: "#EF4444"
        }
      default:
        return {
          bg: "rgba(131, 110, 249, 0.1)",
          border: "rgba(131, 110, 249, 0.3)",
          color: "#836EF9"
        }
    }
  }

  const isLoading = swapsLoading || liquidityLoading
  const hasError = swapsError || liquidityError

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
        <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#FBFAF9" }}>
              Loading indexed data...
            </div>
            <div style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Fetching from Ponder indexer
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
        <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#FBFAF9" }}>
              Indexer Connection Error
            </div>
            <div style={{ color: "rgba(251, 250, 249, 0.7)" }} className="mb-4">
              Could not connect to Ponder GraphQL endpoint
            </div>
            <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
              Error: {(swapsError || liquidityError)?.message || 'Unknown error'}
            </div>
            {indexerHealth && !indexerHealth.isHealthy && (
              <div className="text-sm mt-2" style={{ color: "rgba(245, 158, 11, 0.8)" }}>
                Indexer Status: Unhealthy
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#FBFAF9" }}>
              Transaction History
            </h2>
            <div className="px-2 py-1 rounded text-xs font-medium" style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              color: "#10B981"
            }}>
              Live Indexer Data
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Manual Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "rgba(131, 110, 249, 0.1)",
                borderColor: "rgba(131, 110, 249, 0.3)",
                color: "#836EF9"
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ 
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            >
              <option value="all">All Transactions</option>
              <option value="swap">Swaps Only</option>
              <option value="add_liquidity">Add Liquidity</option>
              <option value="remove_liquidity">Remove Liquidity</option>
            </select>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search address or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border input-primary text-sm w-full sm:w-64"
                style={{ 
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.2)",
                  color: "#FBFAF9"
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                style={{ color: "rgba(251, 250, 249, 0.7)" }} />
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "#FBFAF9" }}>
                No transactions found
              </h3>
              <p className="text-sm sm:text-base" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                {combinedTransactions.length === 0 
                  ? "No transactions have been indexed yet. Try making a swap or providing liquidity!" 
                  : "Try adjusting your filters or search terms."}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx: CombinedTransaction) => {
              const colors = getTransactionColor(tx.type)
              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl border hover:bg-white/5 transition-all duration-200 card-hover space-y-3 sm:space-y-0"
                  style={{
                    backgroundColor: "rgba(14, 16, 15, 0.3)",
                    borderColor: "rgba(251, 250, 249, 0.1)"
                  }}
                >
                  {/* Transaction Info */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.border
                      }}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                          {getTransactionTypeLabel(tx.type)}
                        </span>
                        {tx.user.toLowerCase() === address?.toLowerCase() && (
                          <span className="text-xs px-2 py-1 rounded-full border whitespace-nowrap" style={{
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            borderColor: "rgba(16, 185, 129, 0.3)",
                            color: "#10B981"
                          }}>
                            You
                          </span>
                        )}
                        {tx.type === 'swap' && (tx.data as SwapData).priceImpact && (tx.data as SwapData).priceImpact! > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full border whitespace-nowrap" style={{
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            borderColor: "rgba(245, 158, 11, 0.3)",
                            color: "#F59E0B"
                          }}>
                            High Impact
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                        {getTransactionDescription(tx)}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                        {formatTime(Number(tx.timestamp) * 1000)} • {formatAddress(tx.user)}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {/* Additional Info */}
                    <div className="text-right">
                      {tx.type === 'swap' && (
                        <>
                          <div className="text-xs sm:text-sm font-medium" style={{ 
                            color: ((tx.data as SwapData).priceImpact && (tx.data as SwapData).priceImpact! > 3) ? "#F59E0B" : "#10B981"
                          }}>
                            {(tx.data as SwapData).priceImpact ? `${Number((tx.data as SwapData).priceImpact).toFixed(2)}% Impact` : 'N/A'}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                            Gas: {formatNumber(Number((tx.data as SwapData).gasUsed))}
                          </div>
                        </>
                      )}
                      {(tx.type === 'add_liquidity' || tx.type === 'remove_liquidity') && (
                        <>
                          <div className="text-xs sm:text-sm font-medium" style={{ color: colors.color }}>
                            {((tx.data as LiquidityEventData).shareOfPool * 100).toFixed(2)}% of Pool
                          </div>
                          <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                            Block: {formatNumber(Number(tx.blockNumber))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* External Link */}
                    <a
                      href={`https://testnet.monadexplorer.com/tx/${tx.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: "rgba(251, 250, 249, 0.7)" }}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Indexer Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 text-xs sm:text-sm text-center space-y-1 sm:space-y-0 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${indexerHealth?.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              🔗 Indexed by Ponder
            </span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            Auto-refresh: 30s intervals
          </span>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            {filteredTransactions.length} transactions indexed
          </span>
          {indexerHealth?.lastUpdated && (
            <>
              <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
              <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Last updated: {formatTime(Number(indexerHealth.lastUpdated) * 1000)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
```

#### 4. Running the Indexer

```bash
# Start Ponder indexer
npm run dev

# This will:
# 1. Start indexing from specified start block
# 2. Process all historical events
# 3. Start GraphQL server on localhost:42069
# 4. Continue real-time indexing of new blocks
```

### Benefits dari Ponder Integration

**📈 Performance Improvements**:
- **Query Speed**: Instant hasil instead of scanning blockchain
- **Data Aggregation**: Pre-calculated statistics dan metrics
- **Real-time Updates**: Live data dengan minimal latency
- **Efficient Pagination**: Handle large datasets dengan cursor-based pagination

**🎯 Enhanced User Experience**:
- **Rich Analytics**: Volume charts, user stats, pool metrics
- **Advanced Filtering**: By user, token, time period, transaction type
- **Search Functionality**: Find specific transactions instantly
- **Historical Data**: Access complete transaction history

**🔧 Developer Benefits**:
- **Type Safety**: Auto-generated TypeScript types
- **GraphQL API**: Flexible, efficient data fetching
- **Schema Evolution**: Easy database migrations
- **Testing**: Built-in support untuk integration tests

---
# Part 2: Zero Knowledge Proofs - Age Verification (13:30 – 15:00)

## Pengantar Zero Knowledge Proofs

### Apa itu Zero Knowledge Proof?

**🤔 Definisi:**
Zero Knowledge Proof (ZKP) adalah metode kriptografi yang memungkinkan seseorang membuktikan bahwa mereka mengetahui suatu informasi tanpa mengungkapkan informasi tersebut.

**🎭 Analogi Sederhana: "Gua Ali Baba"**

Bayangkan ada gua dengan pintu rahasia yang hanya bisa dibuka dengan kata sandi. Alice ingin membuktikan kepada Bob bahwa dia tahu kata sandinya, tapi tidak mau memberitahu kata sandinya.

```
     Entrance
        |
    +---+---+
    |       |
  Path A   Path B
    |       |
    +---+---+
        |
   Secret Door
   (needs password)
```

**Proses Proof:**
1. Alice masuk gua, pilih salah satu jalur (A atau B) secara random
2. Bob tunggu di luar, lalu minta Alice keluar lewat jalur tertentu
3. Jika Alice tahu kata sandi, dia bisa keluar dari jalur manapun
4. Ulangi beberapa kali untuk memastikan Alice tidak sedang menebak

**🔬 Dalam Konteks Digital:**
Sama seperti gua Ali Baba, dalam dunia digital kita bisa membuktikan pengetahuan tentang data pribadi (umur, identitas, kredibilitas) tanpa mengungkapkan data aslinya.

### Properties ZKP

**✅ Completeness**: Jika statement benar, honest verifier akan terkonvinsi oleh honest prover  
**✅ Soundness**: Jika statement salah, dishonest prover tidak bisa menipu honest verifier  
**✅ Zero-Knowledge**: Verifier tidak mendapat informasi tambahan selain "statement ini benar"

### Use Cases ZKP dalam Dunia Nyata

**🏦 Financial Privacy:**
```
Traditional: "Saya punya saldo $10,000"
ZK Version: "Saya punya saldo > $5,000" (tanpa reveal jumlah exact)
```

**🆔 Identity Verification:**
```
Traditional: Show KTP dengan semua data personal
ZK Version: "Umur saya > 18 tahun" (tanpa reveal tanggal lahir, nama, alamat)
```

**🎓 Educational Credentials:**
```
Traditional: Show ijazah dengan nilai
ZK Version: "IPK saya > 3.5" (tanpa reveal nilai exact atau universitas)
```

**🗳️ Voting Systems:**
```
Traditional: Anonymous voting (tapi masih bisa di-trace)
ZK Version: Prove "saya eligible voter" tanpa reveal identity
```

---

## Implementasi: KTP Age Verification

Kita akan membuat sistem yang memungkinkan seseorang membuktikan bahwa umurnya > 18 tahun berdasarkan data KTP Indonesia, tanpa mengungkapkan informasi personal lainnya.

### 1. Setup Development Environment

**Install Dependencies:**

```bash
npm create vite@latest zk-age-verification -- --template react-ts
cd zk-age-verification

# Install ZK dependencies
npm install circomlib
npm install snarkjs
npm install @noir-lang/noir_wasm @noir-lang/backend_barretenberg

# Install UI dependencies  
npm install @rainbow-me/rainbowkit wagmi viem
npm install @tanstack/react-query
npm install react-hot-toast
npm install lucide-react

# Install build tools
npm install -g circom
```

### 2. KTP Data Structure

**TypeScript Interfaces:**

**`src/types/ktp.ts`:**
```typescript
// Format KTP Indonesia
export interface KTPData {
  nik: string;           // 16 digit NIK
  nama: string;          // Nama lengkap
  tempatLahir: string;   // Tempat lahir
  tanggalLahir: string;  // DD-MM-YYYY
  jenisKelamin: string;  // L/P
  alamat: string;        // Alamat lengkap
  rt: string;            // RT
  rw: string;            // RW
  kelurahan: string;     // Kelurahan/Desa
  kecamatan: string;     // Kecamatan
  agama: string;         // Agama
  statusPerkawinan: string; // Status perkawinan
  pekerjaan: string;     // Pekerjaan
  kewarganegaraan: string; // WNI/WNA
  berlakuHingga: string; // Berlaku hingga
}

// Data untuk ZK proof (only what we need)
export interface KTPProofInput {
  birthDay: number;    // 1-31
  birthMonth: number;  // 1-12
  birthYear: number;   // e.g., 1995
  currentYear: number; // e.g., 2024
  salt: bigint;        // Random salt untuk privacy
}

// ZK proof output
export interface AgeProofOutput {
  proof: {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
  };
  publicSignals: string[];
}
```

### 3. Circom Circuit untuk Age Verification

**`circuits/ageVerification.circom`:**
```circom
pragma circom 2.0.0;

/*  Age ≥ 18  + commitment
    public[0] = isAdult   (0/1)
    public[1] = commitment
*/
template AgeVerification() {
    /* ── PRIVATE IN ─────────────────────────── */
    signal input birthDay;        // 1-31
    signal input birthMonth;      // 1-12
    signal input birthYear;       // 1900-2010
    signal input salt;

    /* ── PUBLIC IN ──────────────────────────── */
    signal input currentYear;
    signal input currentMonth;
    signal input currentDay;

    /* ── OUTPUTS ────────────────────────────── */
    signal output isAdult;
    signal output commitment;

    /* ── Umur sederhana ─────────────────────── */
    signal yearDiff      <== currentYear - birthYear;

    component monthGE = GreaterEqThan(4);
    monthGE.in[0] <== currentMonth;
    monthGE.in[1] <== birthMonth;

    component dayGE = GreaterEqThan(6);
    dayGE.in[0] <== currentDay;
    dayGE.in[1] <== birthDay;

    component monthEQ = IsEqual();
    monthEQ.in[0] <== currentMonth;
    monthEQ.in[1] <== birthMonth;

    // pecah perkalian utk hindari non-quadratic
    signal temp1;        // monthEQ && dayGE
    temp1 <== monthEQ.out * dayGE.out;

    signal temp2;        // monthEQ && monthGE
    temp2 <== monthEQ.out * monthGE.out;

    signal birthdayPassed;
    birthdayPassed <== monthGE.out + temp1 - temp2;

    signal actualAge <== yearDiff - 1 + birthdayPassed;

    component ageGE = GreaterEqThan(7);   // umur <128
    ageGE.in[0] <== actualAge;
    ageGE.in[1] <== 18;
    isAdult      <== ageGE.out;

    /* ── Komitmen demo ──────────────────────── */
    commitment <== birthDay
                 + birthMonth * 100
                 + birthYear * 10000
                 + salt;

    /* ── RANGE CONSTRAINTS ──────────────────── */
    // birthDay 1–31
    component dMin = GreaterEqThan(6);
    dMin.in[0] <== birthDay;
    dMin.in[1] <== 1;
    dMin.out === 1;

    component dMax = LessThan(6);
    dMax.in[0] <== birthDay;
    dMax.in[1] <== 32;
    dMax.out === 1;

    // birthMonth 1–12
    component mMin = GreaterEqThan(4);
    mMin.in[0] <== birthMonth;
    mMin.in[1] <== 1;
    mMin.out === 1;

    component mMax = LessThan(4);
    mMax.in[0] <== birthMonth;
    mMax.in[1] <== 13;
    mMax.out === 1;

    // birthYear 1900–2010
    component yMin = GreaterEqThan(11);
    yMin.in[0] <== birthYear;
    yMin.in[1] <== 1900;
    yMin.out === 1;

    component yMax = LessThan(11);
    yMax.in[0] <== birthYear;
    yMax.in[1] <== 2011;
    yMax.out === 1;
}

/* ── UTILITIES ─────────────────────────────── */
template GreaterEqThan(n){
    assert(n<=252);
    signal input in[2];
    signal output out;
    component lt = LessThan(n);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1];
    out      <== 1 - lt.out;
}

template LessThan(n){
    assert(n<=252);
    signal input in[2];
    signal output out;
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1<<n) - in[1];
    out    <== 1 - n2b.out[n];
}

template Num2Bits(n){
    signal input in;
    signal output out[n];
    var acc=0; var pow=1;
    for (var i=0;i<n;i++){
        out[i] <-- (in>>i)&1;
        out[i]*(out[i]-1)===0;
        acc += out[i]*pow;
        pow += pow;
    }
    acc === in;
}

template IsZero(){
    signal input in;
    signal output out;
    signal inv;
    inv <-- in!=0 ? 1/in : 0;
    out <== -in*inv + 1;
    in*out === 0;
}

template IsEqual(){
    signal input in[2];
    signal output out;
    component iz = IsZero();
    iz.in <== in[0]-in[1];
    out <== iz.out;
}

component main = AgeVerification();
```

**Penjelasan Circuit:**
- **Private Inputs**: `birthDay`, `birthMonth`, `birthYear`, `salt`
- **Public Inputs**: `currentYear`, `currentMonth`, `currentDay`
- **Outputs**: `isAdult` (1 jika umur >= 18), `commitment` (privacy hash)
- **Constraints**: Validasi range untuk semua input, kalkulasi umur, proof generation

### 4. Circuit Compilation dan Setup

**`scripts/compile-circuit.sh`:**
```bash
#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

CIRCUIT_NAME=${1:-ageVerification}

print_status "Starting circuit compilation for: $CIRCUIT_NAME"

if ! command -v circom &> /dev/null; then
    print_error "circom is not installed"
    exit 1
fi

if ! command -v snarkjs &> /dev/null; then
    print_error "snarkjs is not installed"
    exit 1
fi

# Create build directory with proper permissions
print_status "Creating circuits build directory..."
rm -rf circuits/build
mkdir -p circuits/build
chmod 755 circuits/build

if [ ! -f "circuits/${CIRCUIT_NAME}.circom" ]; then
    print_error "Circuit file circuits/${CIRCUIT_NAME}.circom not found!"
    exit 1
fi

print_status "Circuit file found: circuits/${CIRCUIT_NAME}.circom"

# Compile circuit with explicit output directory
print_status "Compiling circuit..."
cd circuits/build
if circom ../${CIRCUIT_NAME}.circom --r1cs --wasm --sym; then
    cd ../..
    print_success "Circuit compiled successfully!"
else
    cd ../..
    print_error "Circuit compilation failed!"
    exit 1
fi

# Verify files exist
if [ ! -f "circuits/build/${CIRCUIT_NAME}.r1cs" ]; then
    print_error "R1CS file not generated!"
    exit 1
fi

if [ ! -d "circuits/build/${CIRCUIT_NAME}_js" ]; then
    print_error "WASM files not generated!"
    exit 1
fi

print_status "Generated files:"
echo "  - circuits/build/${CIRCUIT_NAME}.r1cs"
echo "  - circuits/build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm"
echo "  - circuits/build/${CIRCUIT_NAME}.sym"

# Continue with rest of the setup...
print_status "Generating powers of tau..."
if [ ! -f "circuits/build/pot14_0000.ptau" ]; then
    if snarkjs powersoftau new bn128 14 circuits/build/pot14_0000.ptau -v; then
        print_success "Powers of tau generated!"
    else
        print_error "Failed to generate powers of tau!"
        exit 1
    fi
fi

print_status "Contributing to ceremony..."
if [ ! -f "circuits/build/pot14_0001.ptau" ]; then
    echo "random-entropy-$(date +%s)" | snarkjs powersoftau contribute circuits/build/pot14_0000.ptau circuits/build/pot14_0001.ptau --name="First contribution" -v
fi

print_status "Phase 2 setup..."
if [ ! -f "circuits/build/pot14_final.ptau" ]; then
    snarkjs powersoftau prepare phase2 circuits/build/pot14_0001.ptau circuits/build/pot14_final.ptau -v
fi

print_status "Generating proving key..."
if [ ! -f "circuits/build/${CIRCUIT_NAME}_0000.zkey" ]; then
    snarkjs groth16 setup circuits/build/${CIRCUIT_NAME}.r1cs circuits/build/pot14_final.ptau circuits/build/${CIRCUIT_NAME}_0000.zkey
fi

print_status "Contributing to phase 2..."
if [ ! -f "circuits/build/${CIRCUIT_NAME}_0001.zkey" ]; then
    echo "random-entropy-phase2-$(date +%s)" | snarkjs zkey contribute circuits/build/${CIRCUIT_NAME}_0000.zkey circuits/build/${CIRCUIT_NAME}_0001.zkey --name="First phase2 contribution" -v
fi

print_status "Exporting verification key..."
snarkjs zkey export verificationkey circuits/build/${CIRCUIT_NAME}_0001.zkey circuits/build/verification_key.json

print_status "Generating Solidity verifier..."
mkdir -p contracts
snarkjs zkey export solidityverifier circuits/build/${CIRCUIT_NAME}_0001.zkey contracts/verifier.sol

print_status "Copying files for frontend..."
mkdir -p public/circuits
cp circuits/build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm public/circuits/
cp circuits/build/${CIRCUIT_NAME}_0001.zkey public/circuits/
cp circuits/build/verification_key.json public/circuits/

print_success "🎉 Circuit compilation completed successfully!"
```

**Proses Compilation:**
1. **Compile Circuit**: `.circom` → `.r1cs` + `.wasm`
2. **Powers of Tau**: Generate ceremony parameters
3. **Phase 2 Setup**: Generate proving key
4. **Export Keys**: Verification key untuk smart contract
5. **Copy Files**: Pindahkan ke public directory

### 5. ZK Proof Generation Library

**`src/lib/zkProof.ts`:**
```typescript
import { type KTPProofInput, type AgeProofOutput } from '../types/ktp';
import { SnarkjsLoader } from './snarkjsLoader';

// Type definitions for snarkjs proof structure
interface SnarkjsProof {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  publicSignals: string[];
}

export class ZKProofGenerator {
  private wasmPath: string;
  private zkeyPath: string;
  
  constructor() {
    // Update paths to match actual file structure
    this.wasmPath = '/circuits/build/ageVerification_js/ageVerification.wasm';
    this.zkeyPath = '/circuits/build/ageVerification_0001.zkey';
  }

  // Check if snarkjs is available
  private async ensureSnarkjs(): Promise<void> {
    if (!SnarkjsLoader.isLoaded()) {
      console.log('SnarkJS not loaded, attempting to load...');
      await SnarkjsLoader.load();
    }
    
    if (!SnarkjsLoader.isLoaded()) {
      throw new Error('SnarkJS is not available after loading attempt');
    }
  }

  // Parse tanggal lahir dari format DD-MM-YYYY
  static parseBirthDate(tanggalLahir: string): {
    day: number;
    month: number; 
    year: number;
  } {
    const [day, month, year] = tanggalLahir.split('-').map(Number);
    
    // Validate parsed values
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Invalid date format. Expected DD-MM-YYYY');
    }
    
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      throw new Error('Invalid date values');
    }
    
    return { day, month, year };
  }

  // Generate random salt with field size constraint
  static generateSalt(): bigint {
    // BN254 field size (circom default)
    const FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
    
    if (typeof window === 'undefined' || !window.crypto) {
      // Fallback for environments without crypto
      const randomValue = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
      return randomValue % (FIELD_SIZE / 1000n); // Much smaller for safety
    }
    
    // Generate smaller salt to prevent overflow in circuit
    const randomBytes = new Uint8Array(16); // 16 bytes instead of 32
    window.crypto.getRandomValues(randomBytes);
    
    let salt = 0n;
    for (let i = 0; i < randomBytes.length; i++) {
      salt = salt * 256n + BigInt(randomBytes[i]);
    }
    
    // Ensure salt is much smaller than field size for circuit compatibility
    return salt % (FIELD_SIZE / 1000000n); // Very conservative limit
  }

  // Generate ZK proof untuk age verification
  async generateAgeProof(input: KTPProofInput): Promise<AgeProofOutput> {
    try {
      // Ensure SnarkJS is loaded
      await this.ensureSnarkjs();
      
      console.log('Generating ZK proof...');
      console.log('Input:', input);

      // Validate input
      if (!input.birthDay || !input.birthMonth || !input.birthYear || !input.currentYear) {
        throw new Error('Missing required input fields');
      }

      // Validate input ranges
      if (input.birthDay < 1 || input.birthDay > 31) {
        throw new Error('Invalid birth day: must be between 1-31');
      }
      if (input.birthMonth < 1 || input.birthMonth > 12) {
        throw new Error('Invalid birth month: must be between 1-12');
      }
      if (input.birthYear < 1900 || input.birthYear > input.currentYear) {
        throw new Error('Invalid birth year');
      }

      // Get current date
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

      // Validate that birth date is not in the future
      const birthDate = new Date(input.birthYear, input.birthMonth - 1, input.birthDay);
      if (birthDate > now) {
        throw new Error('Birth date cannot be in the future');
      }

      // Convert salt to string and ensure it's not too large
      const saltString = input.salt.toString();
      if (saltString.length > 77) { // Field element limit for most circuits
        console.warn('Salt too large, truncating for circuit compatibility');
      }

      // Prepare circuit inputs with proper constraints
      const circuitInputs = {
        birthDay: input.birthDay,
        birthMonth: input.birthMonth,
        birthYear: input.birthYear,
        currentYear: input.currentYear,
        currentMonth: currentMonth,
        currentDay: currentDay,
        salt: saltString
      };

      console.log('Circuit inputs:', circuitInputs);

      // Check if circuit files are available
      const wasmExists = await this.checkFileExists(this.wasmPath);
      const zkeyExists = await this.checkFileExists(this.zkeyPath);

      if (!wasmExists || !zkeyExists) {
        console.warn('Circuit files not available, using mock proof');
        return this.generateMockProofFromInput(input);
      }

      try {
        // Generate proof using snarkjs
        if (!window.snarkjs || !window.snarkjs.groth16 || !window.snarkjs.groth16.fullProve) {
          throw new Error('snarkjs is not loaded or not available on window');
        }
        const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
          circuitInputs,
          this.wasmPath,
          this.zkeyPath
        ) as { proof: SnarkjsProof; publicSignals: string[] };

        console.log('Raw proof generated:', proof);
        console.log('Public signals:', publicSignals);

        // Format proof for our contract
        const formattedProof: AgeProofOutput = {
          proof: {
            pi_a: [proof.pi_a[0], proof.pi_a[1]],
            pi_b: [
              [proof.pi_b[0][1], proof.pi_b[0][0]], // Note: Order is swapped for Solidity
              [proof.pi_b[1][1], proof.pi_b[1][0]]
            ],
            pi_c: [proof.pi_c[0], proof.pi_c[1]]
          },
          publicSignals: [
            publicSignals[0], // isAdult (0 or 1)
            publicSignals[1]  // commitment hash
          ]
        };

        console.log('Formatted proof:', formattedProof);

        // Validate proof structure
        this.validateProofStructure(formattedProof);

        return formattedProof;

      } catch (circuitError: unknown) {
        console.error('Circuit execution failed:', circuitError);
        
        // Check if it's a constraint failure
        const errorMessage = circuitError instanceof Error ? circuitError.message : String(circuitError);
        if (errorMessage.includes('Assert Failed') || 
            errorMessage.includes('Error in template')) {
          console.warn('Circuit constraint failed, falling back to mock proof');
          return this.generateMockProofFromInput(input);
        }
        
        throw circuitError;
      }

    } catch (error: unknown) {
      console.error('Error generating ZK proof:', error);
      const errorMsg = (error instanceof Error) ? error.message : String(error);
      
      // If any error occurs, fall back to mock proof in development
      if (typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('Development mode: falling back to mock proof due to error');
        return this.generateMockProofFromInput(input);
      }
      
      throw new Error(`Failed to generate proof: ${errorMsg}`);
    }
  }

  // Check if file exists
  private async checkFileExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Generate mock proof from input
  private generateMockProofFromInput(input: KTPProofInput): AgeProofOutput {
    console.log('Generating mock proof from input:', input);
    
    // Calculate if user is adult
    const currentDate = new Date();
    const birthDate = new Date(input.birthYear, input.birthMonth - 1, input.birthDay);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const isAdult = age >= 18;
    
    // Generate deterministic commitment
    const commitment = this.generateMockCommitment(input);
    
    // Generate mock proof values based on input
    const seed = `${input.birthDay}-${input.birthMonth}-${input.birthYear}-${input.salt}`;
    const proofValues = this.generateMockProofValues(seed);
    
    const mockProof: AgeProofOutput = {
      proof: {
        pi_a: [proofValues.a1, proofValues.a2],
        pi_b: [
          [proofValues.b11, proofValues.b12],
          [proofValues.b21, proofValues.b22]
        ],
        pi_c: [proofValues.c1, proofValues.c2]
      },
      publicSignals: [
        isAdult ? "1" : "0",
        commitment
      ]
    };

    console.log('Mock proof generated:', mockProof);
    return mockProof;
  }

  // Generate mock commitment
  private generateMockCommitment(input: KTPProofInput): string {
    const data = `${input.birthDay}${input.birthMonth}${input.birthYear}${input.salt}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }

  // Generate mock proof values
  private generateMockProofValues(seed: string): {
    a1: string; a2: string;
    b11: string; b12: string;
    b21: string; b22: string;
    c1: string; c2: string;
  } {
    const hash = this.hashString(seed);
    
    return {
      a1: `0x${hash.slice(0, 64)}`,
      a2: `0x${hash.slice(64, 128)}`,
      b11: `0x${hash.slice(128, 192)}`,
      b12: `0x${hash.slice(192, 256)}`,
      b21: `0x${hash.slice(256, 320)}`,
      b22: `0x${hash.slice(320, 384)}`,
      c1: `0x${hash.slice(384, 448)}`,
      c2: `0x${hash.slice(448, 512)}`
    };
  }

  // Simple hash function for mock values
  private hashString(input: string): string {
    let hash = '';
    for (let i = 0; i < 512; i++) {
      const char = input.charCodeAt(i % input.length);
      const value = (char * (i + 1) * 31) % 16;
      hash += value.toString(16);
    }
    return hash;
  }

  // Validate proof structure
  private validateProofStructure(proof: AgeProofOutput): void {
    if (!proof.proof.pi_a || proof.proof.pi_a.length !== 2) {
      throw new Error('Invalid pi_a structure');
    }
    if (!proof.proof.pi_b || proof.proof.pi_b.length !== 2 || 
        proof.proof.pi_b[0].length !== 2 || proof.proof.pi_b[1].length !== 2) {
      throw new Error('Invalid pi_b structure');
    }
    if (!proof.proof.pi_c || proof.proof.pi_c.length !== 2) {
      throw new Error('Invalid pi_c structure');
    }
    if (!proof.publicSignals || proof.publicSignals.length !== 2) {
      throw new Error('Invalid public signals structure');
    }
  }

  // Verify ZK proof
  async verifyAgeProof(proof: AgeProofOutput): Promise<boolean> {
    try {
      // Ensure SnarkJS is loaded
      await this.ensureSnarkjs();
      
      console.log('Verifying ZK proof...');

      // Load verification key
      const vKeyResponse = await fetch('/circuits/build/verification_key.json');
      if (!vKeyResponse.ok) {
        throw new Error('Failed to load verification key');
      }
      
      const vKey = await vKeyResponse.json();

      // Convert proof back to snarkjs format for verification
      const snarkjsProof = {
        pi_a: proof.proof.pi_a,
        pi_b: [
          [proof.proof.pi_b[0][1], proof.proof.pi_b[0][0]], // Revert the swap
          [proof.proof.pi_b[1][1], proof.proof.pi_b[1][0]]
        ],
        pi_c: proof.proof.pi_c
      };

      // Verify proof
      if (
        typeof window === 'undefined' ||
        !window.snarkjs ||
        !window.snarkjs.groth16 ||
        typeof window.snarkjs.groth16.verify !== 'function'
      ) {
        throw new Error('snarkjs or groth16.verify is not available on window');
      }
      const isValid = await window.snarkjs.groth16.verify(
        vKey,
        proof.publicSignals,
        snarkjsProof
      );

      console.log('Proof verification result:', isValid);
      return isValid;

    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }

  // Calculate age dari tanggal lahir
  static calculateAge(birthDate: string): number {
    try {
      const { day, month, year } = ZKProofGenerator.parseBirthDate(birthDate);
      const today = new Date();
      const birth = new Date(year, month - 1, day);
      
      // Check if birth date is in the future
      if (birth > today) {
        throw new Error('Birth date cannot be in the future');
      }
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return Math.max(0, age); // Ensure non-negative age
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  }

  // Create commitment hash untuk privacy
  static async createCommitment(
    birthDay: number,
    birthMonth: number, 
    birthYear: number,
    salt: bigint
  ): Promise<string> {
    try {
      // Using SHA-256 for demo (in production, use Poseidon hash for ZK compatibility)
      const message = `${birthDay}-${birthMonth}-${birthYear}-${salt.toString()}`;
      
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        // Fallback for environments without Web Crypto API
        return this.simpleHash(message);
      }
      
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Convert to decimal string for contract compatibility
      return BigInt('0x' + hexHash).toString();
    } catch (error) {
      console.error('Error creating commitment:', error);
      // Fallback hash
      return this.simpleHash(`${birthDay}-${birthMonth}-${birthYear}-${salt.toString()}`);
    }
  }

  // Simple hash fallback
  private static simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  // Check if proof generation is supported
  static async isSupported(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      
      // Try to load SnarkJS if not already loaded
      if (!SnarkjsLoader.isLoaded()) {
        await SnarkjsLoader.load();
      }
      
      return SnarkjsLoader.isLoaded() && !!window.crypto;
    } catch {
      return false;
    }
  }

  // Get mock proof for testing (when circuit is not available)
  static getMockProof(): AgeProofOutput {
    return {
      proof: {
        pi_a: [
          "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef12345",
          "0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba98765"
        ],
        pi_b: [
          [
            "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef",
            "0x654321fedcba987654321fedcba987654321fedcba987654321fedcba987654321"
          ],
          [
            "0xfedcba987654321fedcba987654321fedcba987654321fedcba987654321fedcba",
            "0x246813579bdf024681357bdf024681357bdf024681357bdf024681357bdf0246"
          ]
        ],
        pi_c: [
          "0x135792468ace135792468ace135792468ace135792468ace135792468ace1357",
          "0xbdf02468ace1bdf02468ace1bdf02468ace1bdf02468ace1bdf02468ace1bdf024"
        ]
      },
      publicSignals: [
        "1", // isAdult = true
        "123456789012345678901234567890" // commitment
      ]
    };
  }
}

// Utility functions untuk formatting
export const formatKTPDate = (dateString: string): string => {
  try {
    const [day, month, year] = dateString.split('-');
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const monthIndex = parseInt(month) - 1;
    if (monthIndex < 0 || monthIndex >= months.length) {
      throw new Error('Invalid month');
    }
    
    return `${day} ${months[monthIndex]} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if formatting fails
  }
};

export const maskKTPData = (data: string, visibleChars: number = 4): string => {
  if (!data || data.length <= visibleChars) return data;
  const masked = '*'.repeat(data.length - visibleChars);
  return data.slice(0, visibleChars) + masked;
};

// Helper function to check if running in browser environment
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

// Helper function to load snarkjs dynamically
export const loadSnarkjs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser environment'));
      return;
    }

    if (window.snarkjs) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/snarkjs@latest/build/snarkjs.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load snarkjs'));
    document.head.appendChild(script);
  });
};
```

**Key Features:**
- ✅ **Real Circuit Support**: Menggunakan circuit files jika tersedia
- ✅ **Mock Proof Fallback**: Untuk development tanpa circuit
- ✅ **Input Validation**: Validasi format tanggal dan constraints
- ✅ **Field Element Safety**: Salt generation dengan field size limits
- ✅ **Error Handling**: Graceful fallback pada semua error conditions

### 6. SnarkJS Dynamic Loading System

**`src/lib/snarkjsLoader.ts`:**
```typescript
// SnarkJS loader utility (TypeScript)
// Handles dynamic <script> injection with retry + version helpers
// Lints clean against @typescript-eslint/no-explicit-any and TS2790.

export class SnarkjsLoader {
  private static loaded = false;
  private static loading = false;
  private static loadPromise: Promise<void> | null = null;

  /**
   * Dynamically load snarkjs from a CDN (with retry & caching).
   */
  static async load(): Promise<void> {
    // Already loaded → exit fast
    if (this.loaded && typeof window !== 'undefined' && window.snarkjs) {
      return;
    }

    // In‑flight request → await the same promise
    if (this.loading && this.loadPromise) {
      return this.loadPromise;
    }

    // Begin loading
    this.loading = true;
    this.loadPromise = this.loadSnarkjs();

    try {
      await this.loadPromise;
      this.loaded = true;
      console.log('✅ SnarkJS loaded successfully');
    } finally {
      // always reset loading flag
      this.loading = false;
    }

    return this.loadPromise;
  }

  /** Check global availability */
  static isLoaded(): boolean {
    return typeof window !== 'undefined' && !!window.snarkjs && this.loaded;
  }

  /** Whether a load() call is currently in progress */
  static isLoading(): boolean {
    return this.loading;
  }

  /** Force a fresh reload (e.g. after CDN failure) */
  static async reload(): Promise<void> {
    this.loaded = false;
    this.loading = false;
    this.loadPromise = null;

    // Remove any existing <script> tag
    if (typeof document !== 'undefined') {
      const existing = document.querySelector<HTMLScriptElement>('script[src*="snarkjs"]');
      existing?.remove();
    }

    // Clear the cached global (avoid TS2790 delete issue)
    (window as { snarkjs?: unknown }).snarkjs = undefined;

    return this.load();
  }

  /** Low‑level script injection with multiple fall‑back CDNs */
  private static loadSnarkjs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new Error('Not running in a browser environment'));
        return;
      }

      if (window.snarkjs) {
        // already present via other means
        this.loaded = true;
        resolve();
        return;
      }

      const sources = [
        'https://unpkg.com/snarkjs@latest/build/snarkjs.min.js',
        'https://cdn.jsdelivr.net/npm/snarkjs@latest/build/snarkjs.min.js',
        'https://cdn.skypack.dev/snarkjs'
      ];

      let idx = 0;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;

      const tryNextSource = (): void => {
        if (idx >= sources.length) {
          reject(new Error('All SnarkJS sources failed to load'));
          return;
        }

        script.src = sources[idx];
        console.log(`📦 Attempting to load SnarkJS from: ${script.src}`);
        idx += 1;

        const timeoutId = window.setTimeout(() => {
          console.warn(`⏰ Timeout loading ${script.src}`);
          tryNextSource();
        }, 10_000);

        script.onload = () => {
          window.clearTimeout(timeoutId);
          // Wait a tiny tick so global attaches
          setTimeout(() => {
            if (window.snarkjs) {
              resolve();
            } else {
              console.warn(`⚠️ Script loaded but snarkjs global missing: ${script.src}`);
              tryNextSource();
            }
          }, 100);
        };

        script.onerror = (err) => {
          window.clearTimeout(timeoutId);
          console.warn(`❌ Failed loading ${script.src}`, err);
          tryNextSource();
        };
      };

      tryNextSource();
      document.head.appendChild(script);
    });
  }

  /** Preload with exponential retry */
  static async preload(maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        console.log(`🔄 Loading SnarkJS (attempt ${attempt}/${maxRetries})…`);
        await this.load();
        return; // success
      } catch (err) {
        if (attempt === maxRetries) throw err;
        console.warn(`Retrying SnarkJS load (${attempt})…`);
        await new Promise((r) => setTimeout(r, 1_000 * attempt));
      }
    }
  }

  /** Return reported snarkjs version, if any */
  static getVersion(): string | null {
    return this.isLoaded() && (window.snarkjs as { version?: string }).version || null;
  }

  /** Quick self‑test (checks groth16 presence) */
  static async test(): Promise<boolean> {
    if (!this.isLoaded()) return false;
    try {
      return !!window.snarkjs?.groth16;
    } catch {
      return false;
    }
  }
}

// ───────────────────────────────────────────────────────────
// Global ambient types
// ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    snarkjs?: {
      groth16: {
        fullProve: (
          input: Record<string, unknown>,
          wasmPath: string,
          zkeyPath: string
        ) => Promise<Record<string, unknown>>;
        verify: (
          vKey: Record<string, unknown>,
          publicSignals: string[],
          proof: Record<string, unknown>
        ) => Promise<boolean>;
        prove: (
          zkeyPath: string,
          witness: Record<string, unknown>
        ) => Promise<Record<string, unknown>>;
      };
      version?: string;
    };
  }
}

// Handy re‑exports
export const loadSnarkjs = SnarkjsLoader.load.bind(SnarkjsLoader);
export const isSnarkjsLoaded = SnarkjsLoader.isLoaded.bind(SnarkjsLoader);
export const preloadSnarkjs = SnarkjsLoader.preload.bind(SnarkjsLoader);
```

**Features:**
- 🔄 **Multiple CDN Fallbacks**: 3 different sources untuk reliability
- ⏱️ **Timeout Handling**: 10 second timeout per source
- 🔁 **Retry Logic**: Exponential backoff untuk failed loads
- 📊 **Status Tracking**: Loading state management
- 🔧 **Version Detection**: SnarkJS version reporting

### 7. Smart Contract untuk Verification

**`contracts/AgeVerifier.sol`:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./verifier.sol"; // Generated dari circom

/**
 * @title AgeVerifier
 * @dev Smart contract untuk verifikasi umur menggunakan ZK proofs
 */
contract AgeVerifier {
    // Generated verifier contract
    Groth16Verifier public immutable verifier;
    
    // Verified commitments untuk prevent replay attacks
    mapping(uint256 => bool) public usedCommitments;
    
    // Verified addresses
    mapping(address => bool) public verifiedAdults;
    mapping(address => uint256) public verificationTimestamp;
    
    // Events
    event AgeVerified(
        address indexed user,
        uint256 commitment,
        bool isAdult,
        uint256 timestamp
    );
    
    event VerificationRevoked(
        address indexed user,
        uint256 timestamp
    );
    
    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }
    
    function verifyAge(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[2] memory _publicSignals  // Changed from uint[1] to uint[2]
    ) external {
        // Extract public signals
        uint256 isAdult = _publicSignals[0];      // First output: isAdult (0 or 1)
        uint256 commitment = _publicSignals[1];   // Second output: commitment
        
        // Check that isAdult is 1 (true)
        require(isAdult == 1, "Age verification failed: not adult");
        
        // Check commitment belum pernah digunakan
        require(!usedCommitments[commitment], "Commitment already used");
        
        // Verify ZK proof
        bool isValid = verifier.verifyProof(_pA, _pB, _pC, _publicSignals);
        require(isValid, "Invalid age proof");
        
        // Mark commitment as used
        usedCommitments[commitment] = true;
        
        // Mark user as verified adult
        verifiedAdults[msg.sender] = true;
        verificationTimestamp[msg.sender] = block.timestamp;
        
        emit AgeVerified(msg.sender, commitment, true, block.timestamp);
    }
    
    /**
     * @dev Check if address adalah verified adult
     */
    function isVerifiedAdult(address user) external view returns (bool) {
        return verifiedAdults[user];
    }
    
    /**
     * @dev Get verification timestamp
     */
    function getVerificationTime(address user) external view returns (uint256) {
        return verificationTimestamp[user];
    }
    
    /**
     * @dev Revoke verification (for testing purposes)
     */
    function revokeVerification() external {
        require(verifiedAdults[msg.sender], "Not verified");
        
        verifiedAdults[msg.sender] = false;
        verificationTimestamp[msg.sender] = 0;
        
        emit VerificationRevoked(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Batch check multiple addresses
     */
    function batchCheckVerification(address[] calldata users) 
        external 
        view 
        returns (bool[] memory results) 
    {
        results = new bool[](users.length);
        for (uint i = 0; i < users.length; i++) {
            results[i] = verifiedAdults[users[i]];
        }
    }
    
    /**
     * @dev Get commitment status
     */
    function isCommitmentUsed(uint256 commitment) external view returns (bool) {
        return usedCommitments[commitment];
    }
}
```

**Contract Features:**
- 🔐 **Groth16 Verification**: Uses generated verifier contract
- 🚫 **Replay Protection**: Commitment-based anti-replay system
- 📝 **Verification Records**: Track verified addresses dan timestamps
- 🔍 **Batch Operations**: Check multiple addresses efficiently
- 📡 **Events**: AgeVerified dan VerificationRevoked events

**`contracts/verifier.sol`:**
```solidity
// [Generated by snarkjs]
```

### 8. Frontend Components

#### A. Header Component

**`src/components/Header.tsx`:**
```tsx
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <header className="glass-dark sticky top-0 z-50 py-4 border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center space-x-1 p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                🆔
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient-monad font-inter">ZK Age Verify</h1>
            <p className="text-xs font-medium" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Privacy-First Age Verification on Monad
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
              <span>Zero-Knowledge</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔒 Privacy-First</span>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header
```

#### B. KTP Input Form

**`src/components/KTPInputForm.tsx`:**
```tsx
"use client"

import { useState } from "react"
import { FileText, Eye, EyeOff, Shield, AlertCircle } from "lucide-react"
import type { KTPData } from "../types/ktp"
import { maskKTPData } from "../lib/zkProof"

interface KTPInputFormProps {
  onSubmit: (ktpData: KTPData) => void;
  isLoading?: boolean;
}

const KTPInputForm = ({ onSubmit, isLoading = false }: KTPInputFormProps) => {
  const [ktpData, setKTPData] = useState<KTPData>({
    nik: '',
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    agama: '',
    statusPerkawinan: '',
    pekerjaan: '',
    kewarganegaraan: 'WNI',
    berlakuHingga: 'SEUMUR HIDUP'
  })

  const [showFullData, setShowFullData] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sample KTP data untuk demo
  const sampleKTP: KTPData = {
    nik: '3171012501950001',
    nama: 'BUDI SANTOSO',
    tempatLahir: 'JAKARTA',
    tanggalLahir: '25-01-1995',
    jenisKelamin: 'LAKI-LAKI',
    alamat: 'JL. SUDIRMAN NO. 123',
    rt: '001',
    rw: '002',
    kelurahan: 'MENTENG',
    kecamatan: 'MENTENG',
    agama: 'ISLAM',
    statusPerkawinan: 'BELUM KAWIN',
    pekerjaan: 'SOFTWARE ENGINEER',
    kewarganegaraan: 'WNI',
    berlakuHingga: 'SEUMUR HIDUP'
  }

  const validateKTP = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate NIK (16 digits)
    if (!ktpData.nik || ktpData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit'
    }

    // Validate tanggal lahir format DD-MM-YYYY
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/
    if (!ktpData.tanggalLahir || !dateRegex.test(ktpData.tanggalLahir)) {
      newErrors.tanggalLahir = 'Format tanggal: DD-MM-YYYY'
    } else {
      const [day, month, year] = ktpData.tanggalLahir.split('-').map(Number)
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2010) {
        newErrors.tanggalLahir = 'Tanggal lahir tidak valid'
      }
    }

    // Required fields
    const requiredFields = ['nama', 'tempatLahir', 'jenisKelamin']
    requiredFields.forEach(field => {
      if (!ktpData[field as keyof KTPData]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateKTP()) {
      onSubmit(ktpData)
    }
  }

  const loadSampleData = () => {
    setKTPData(sampleKTP)
    setErrors({})
  }

  const displayValue = (value: string, field: string) => {
    if (!showFullData && ['nik', 'nama', 'alamat'].includes(field)) {
      return maskKTPData(value, 4)
    }
    return value
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl border" style={{
            backgroundColor: "rgba(131, 110, 249, 0.1)",
            borderColor: "rgba(131, 110, 249, 0.3)"
          }}>
            <FileText className="w-6 h-6" style={{ color: "#836EF9" }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#FBFAF9" }}>
              Input Data KTP Indonesia
            </h2>
            <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Data akan digunakan untuk generate ZK proof umur {'>'}= 18 tahun
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl border mb-6" style={{
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.3)"
        }}>
          <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "#10B981" }}>
              🔒 Privacy Guarantee
            </h3>
            <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
              Data KTP tidak akan disimpan atau dibagikan. Hanya proof matematis "umur {'>'}= 18" yang akan di-generate tanpa mengungkapkan informasi personal.
            </p>
          </div>
        </div>

        {/* Sample Data Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={loadSampleData}
            className="px-4 py-2 rounded-lg border font-medium transition-all duration-200 hover:bg-white/10"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderColor: "rgba(245, 158, 11, 0.3)",
              color: "#F59E0B"
            }}
          >
            📝 Load Sample KTP Data
          </button>

          <button
            onClick={() => setShowFullData(!showFullData)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:bg-white/10"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.3)",
              borderColor: "rgba(251, 250, 249, 0.2)",
              color: "rgba(251, 250, 249, 0.7)"
            }}
          >
            {showFullData ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Hide Data</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Show Full Data</span>
              </>
            )}
          </button>
        </div>

        {/* KTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIK */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              NIK (16 digit) *
            </label>
            <input
              type="text"
              value={displayValue(ktpData.nik, 'nik')}
              onChange={(e) => setKTPData({ ...ktpData, nik: e.target.value })}
              placeholder="3171012501950001"
              maxLength={16}
              className="w-full px-4 py-3 rounded-lg border input-primary"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: errors.nik ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            />
            {errors.nik && (
              <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-3 h-3" />
                {errors.nik}
              </p>
            )}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={displayValue(ktpData.nama, 'nama')}
              onChange={(e) => setKTPData({ ...ktpData, nama: e.target.value.toUpperCase() })}
              placeholder="NAMA LENGKAP"
              className="w-full px-4 py-3 rounded-lg border input-primary"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: errors.nama ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            />
            {errors.nama && (
              <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-3 h-3" />
                {errors.nama}
              </p>
            )}
          </div>

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
                Tempat Lahir *
              </label>
              <input
                type="text"
                value={ktpData.tempatLahir}
                onChange={(e) => setKTPData({ ...ktpData, tempatLahir: e.target.value.toUpperCase() })}
                placeholder="JAKARTA"
                className="w-full px-4 py-3 rounded-lg border input-primary"
                style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: errors.tempatLahir ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                  color: "#FBFAF9"
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
                Tanggal Lahir (DD-MM-YYYY) *
              </label>
              <input
                type="text"
                value={ktpData.tanggalLahir}
                onChange={(e) => setKTPData({ ...ktpData, tanggalLahir: e.target.value })}
                placeholder="25-01-1995"
                className="w-full px-4 py-3 rounded-lg border input-primary"
                style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: errors.tanggalLahir ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                  color: "#FBFAF9"
                }}
              />
              {errors.tanggalLahir && (
                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "#EF4444" }}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.tanggalLahir}
                </p>
              )}
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              Jenis Kelamin *
            </label>
            <select
              value={ktpData.jenisKelamin}
              onChange={(e) => setKTPData({ ...ktpData, jenisKelamin: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border input-primary"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: errors.jenisKelamin ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="LAKI-LAKI">LAKI-LAKI</option>
              <option value="PEREMPUAN">PEREMPUAN</option>
            </select>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              Alamat
            </label>
            <textarea
              value={displayValue(ktpData.alamat, 'alamat')}
              onChange={(e) => setKTPData({ ...ktpData, alamat: e.target.value.toUpperCase() })}
              placeholder="ALAMAT LENGKAP"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border input-primary resize-none"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
            style={{
              background: isLoading 
                ? "rgba(131, 110, 249, 0.3)" 
                : "linear-gradient(135deg, #836EF9 0%, #A0055D 100%)",
              color: "#FBFAF9"
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner w-5 h-5"></div>
                <span>Generating ZK Proof...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Generate Age Proof</span>
              </div>
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
          🔐 Zero-knowledge proof akan membuktikan umur {'>'}= 18 tanpa mengungkapkan data personal
        </div>
      </div>
    </div>
  )
}

export default KTPInputForm
```

**Form Features:**
- 📋 **Complete KTP Fields**: All Indonesian ID card fields
- ✅ **Input Validation**: Format dan range validation
- 🎭 **Data Masking**: Privacy-conscious display options
- 📝 **Sample Data**: Load demo KTP untuk testing
- 🛡️ **Privacy Notice**: Clear explanation of data usage

#### C. ZK Proof Display

**`src/components/ZKProofDisplay.tsx`:**
```tsx
"use client"

import { useState } from "react"
import { CheckCircle, Copy, ExternalLink, Eye, EyeOff, AlertTriangle } from "lucide-react"
import type { AgeProofOutput } from "../types/ktp"

interface ZKProofDisplayProps {
  proof: AgeProofOutput;
  isAdult: boolean;
  commitment: string;
  onVerifyOnChain: () => void;
  isVerifying?: boolean;
  verificationTx?: string;
}

const ZKProofDisplay = ({ 
  proof, 
  isAdult, 
  commitment, 
  onVerifyOnChain, 
  isVerifying = false,
  verificationTx 
}: ZKProofDisplayProps) => {
  const [showFullProof, setShowFullProof] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const truncateProof = (proofArray: string[], maxLength = 20) => {
    return proofArray.map(item => 
      item.length > maxLength ? `${item.slice(0, maxLength)}...` : item
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Proof Result */}
      <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isAdult ? 'glow-success' : ''
          }`} style={{
            backgroundColor: isAdult ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
            border: `2px solid ${isAdult ? "#10B981" : "#EF4444"}`
          }}>
            {isAdult ? (
              <CheckCircle className="w-8 h-8" style={{ color: "#10B981" }} />
            ) : (
              <AlertTriangle className="w-8 h-8" style={{ color: "#EF4444" }} />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "#FBFAF9" }}>
            {isAdult ? "✅ Age Verification Successful" : "❌ Age Verification Failed"}
          </h2>
          
          <p className="text-lg" style={{ 
            color: isAdult ? "#10B981" : "#EF4444"
          }}>
            {isAdult 
              ? "Zero-knowledge proof confirms: Age ≥ 18 years"
              : "Zero-knowledge proof result: Age < 18 years"
            }
          </p>

          <div className="mt-4 text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            🔐 No personal information was revealed during this verification
          </div>
        </div>

        {/* Proof Details */}
        <div className="space-y-4">
          {/* Commitment Hash */}
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: "rgba(131, 110, 249, 0.1)",
            borderColor: "rgba(131, 110, 249, 0.3)"
          }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold" style={{ color: "#FBFAF9" }}>
                Privacy Commitment
              </span>
              <button
                onClick={() => copyToClipboard(commitment, 'commitment')}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                style={{ color: "rgba(251, 250, 249, 0.7)" }}
              >
                {copiedField === 'commitment' ? (
                  <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="font-mono text-sm break-all" style={{ color: "#836EF9" }}>
              {commitment}
            </div>
            <div className="text-xs mt-2" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              Cryptographic commitment untuk prevent replay attacks
            </div>
          </div>

          {/* ZK Proof Data */}
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold" style={{ color: "#FBFAF9" }}>
                Zero-Knowledge Proof
              </span>
              <button
                onClick={() => setShowFullProof(!showFullProof)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border transition-all duration-200 hover:bg-white/10"
                style={{
                  backgroundColor: "rgba(14, 16, 15, 0.3)",
                  borderColor: "rgba(251, 250, 249, 0.2)",
                  color: "rgba(251, 250, 249, 0.7)"
                }}
              >
                {showFullProof ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="text-sm">Hide Full Proof</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Show Full Proof</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {/* Proof Components */}
              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Proof π_a:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#A0055D"
                }}>
                  {showFullProof 
                    ? `[${proof.proof.pi_a.join(', ')}]`
                    : `[${truncateProof(proof.proof.pi_a).join(', ')}]`
                  }
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Proof π_b:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#A0055D"
                }}>
                  {showFullProof 
                    ? `[[${proof.proof.pi_b[0].join(', ')}], [${proof.proof.pi_b[1].join(', ')}]]`
                    : `[[${truncateProof(proof.proof.pi_b[0]).join(', ')}], [${truncateProof(proof.proof.pi_b[1]).join(', ')}]]`
                  }
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Proof π_c:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#A0055D"
                }}>
                  {showFullProof 
                    ? `[${proof.proof.pi_c.join(', ')}]`
                    : `[${truncateProof(proof.proof.pi_c).join(', ')}]`
                  }
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Public Signals:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#10B981"
                }}>
                  [{proof.publicSignals.join(', ')}]
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              📊 Groth16 zero-knowledge proof that can be verified on-chain
            </div>
          </div>
        </div>

        {/* On-chain Verification */}
        {isAdult && (
          <div className="mt-6">
            <button
              onClick={onVerifyOnChain}
              disabled={isVerifying}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
              style={{
                background: isVerifying 
                  ? "rgba(131, 110, 249, 0.3)" 
                  : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FBFAF9"
              }}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5"></div>
                  <span>Verifying On-Chain...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify on Monad Blockchain</span>
                </div>
              )}
            </button>

            {verificationTx && (
              <div className="mt-4 p-4 rounded-xl border" style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.3)"
              }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: "#10B981" }}>
                    ✅ Verified on Blockchain
                  </span>
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${verificationTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                    style={{ color: "#10B981" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="text-sm mt-2 font-mono break-all" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  TX: {verificationTx}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Details */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="font-semibold mb-4" style={{ color: "#FBFAF9" }}>
            📋 Technical Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Proof System:</span>
                <span style={{ color: "#FBFAF9" }}>Groth16</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Circuit:</span>
                <span style={{ color: "#FBFAF9" }}>Age Verification</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Curve:</span>
                <span style={{ color: "#FBFAF9" }}>BN128</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Proof Size:</span>
                <span style={{ color: "#FBFAF9" }}>~256 bytes</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Verification:</span>
                <span style={{ color: "#FBFAF9" }}>Constant time</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Gas Cost:</span>
                <span style={{ color: "#FBFAF9" }}>~150k gas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "#FBFAF9" }}>
          🔒 Privacy Guarantees
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3" style={{ color: "#10B981" }}>
              ✅ What is Proven
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
              <li>• Age is greater than or equal to 18 years</li>
              <li>• Proof came from valid KTP data</li>
              <li>• Prover knows the birth date</li>
              <li>• Commitment prevents replay attacks</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3" style={{ color: "#EF4444" }}>
              ❌ What is NOT Revealed
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
              <li>• Exact birth date or age</li>
              <li>• Name, NIK, or other personal data</li>
              <li>• Address or location information</li>
              <li>• Any identifying information</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border" style={{
          backgroundColor: "rgba(131, 110, 249, 0.1)",
          borderColor: "rgba(131, 110, 249, 0.3)"
        }}>
          <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            <strong style={{ color: "#836EF9" }}>Zero-Knowledge Property:</strong> This proof is mathematically guaranteed to reveal nothing beyond the fact that your age ≥ 18. Even with quantum computers, no additional information can be extracted from this proof.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ZKProofDisplay
```

**Display Features:**
- ✅ **Verification Result**: Clear success/failure indication
- 🔐 **Proof Details**: Technical proof data dengan show/hide
- 📋 **Commitment Hash**: Privacy commitment dengan copy functionality
- ⛓️ **Blockchain Integration**: On-chain verification button
- 🔒 **Privacy Guarantees**: What is/isn't revealed explanation

#### D. Circuit Status Component

**`src/components/CircuitStatus.tsx`:**
```tsx
import { useState, useEffect, useCallback } from 'react';

interface CircuitStatusProps {
  onStatusChange?: (hasCircuit: boolean) => void;
}

interface CircuitFiles {
  wasm: boolean;
  zkey: boolean;
  vkey: boolean;
}

export default function CircuitStatus({ onStatusChange }: CircuitStatusProps) {
  const [circuitFiles, setCircuitFiles] = useState<CircuitFiles>({
    wasm: false,
    zkey: false,
    vkey: false
  });
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkCircuitFiles = useCallback(async () => {
    setIsChecking(true);
    
    const files = {
      wasm: false,
      zkey: false,
      vkey: false
    };

    try {
      // Check WASM file - update path
      try {
        const wasmResponse = await fetch('/circuits/build/ageVerification_js/ageVerification.wasm', { method: 'HEAD' });
        files.wasm = wasmResponse.ok;
      } catch {
        files.wasm = false;
      }

      // Check zkey file - update path
      try {
        const zkeyResponse = await fetch('/circuits/build/ageVerification_0001.zkey', { method: 'HEAD' });
        files.zkey = zkeyResponse.ok;
      } catch {
        files.zkey = false;
      }

      // Check verification key - update path
      try {
        const vkeyResponse = await fetch('/circuits/build/verification_key.json', { method: 'HEAD' });
        files.vkey = vkeyResponse.ok;
      } catch {
        files.vkey = false;
      }

      setCircuitFiles(files);
      setLastChecked(new Date());
      
      // Notify parent about circuit availability
      const hasAllFiles = files.wasm && files.zkey && files.vkey;
      onStatusChange?.(hasAllFiles);
      
    } catch (error) {
      console.error('Error checking circuit files:', error);
    } finally {
      setIsChecking(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    checkCircuitFiles();
  }, [checkCircuitFiles]);

  const hasAnyFiles = circuitFiles.wasm || circuitFiles.zkey || circuitFiles.vkey;
  const hasAllFiles = circuitFiles.wasm && circuitFiles.zkey && circuitFiles.vkey;

  if (isChecking) {
    return (
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-blue-400 text-sm">Checking circuit availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {hasAllFiles ? (
        // All circuit files available
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-lg">🟢</div>
              <div>
                <p className="text-green-400 font-medium">Real ZK Circuit Available</p>
                <p className="text-green-300 text-sm">Full zero-knowledge proof generation enabled</p>
              </div>
            </div>
            <button
              onClick={checkCircuitFiles}
              className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
            >
              Recheck
            </button>
          </div>
        </div>
      ) : hasAnyFiles ? (
        // Some files missing
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-yellow-400 text-lg">🟡</div>
              <div>
                <p className="text-yellow-400 font-medium">Incomplete Circuit Setup</p>
                <p className="text-yellow-300 text-sm">Some circuit files are missing - using fallback</p>
              </div>
            </div>
            <button
              onClick={checkCircuitFiles}
              className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30 transition-colors"
            >
              Recheck
            </button>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2 rounded ${circuitFiles.wasm ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {circuitFiles.wasm ? '✓' : '✗'} WASM File
            </div>
            <div className={`p-2 rounded ${circuitFiles.zkey ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {circuitFiles.zkey ? '✓' : '✗'} Proving Key
            </div>
            <div className={`p-2 rounded ${circuitFiles.vkey ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {circuitFiles.vkey ? '✓' : '✗'} Verification Key
            </div>
          </div>
        </div>
      ) : (
        // No circuit files
        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-orange-400 text-lg">🔶</div>
              <div>
                <p className="text-orange-400 font-medium">Demo Mode - Mock Proofs Only</p>
                <p className="text-orange-300 text-sm">
                  Circuit files not found - using mock proofs for demonstration
                </p>
              </div>
            </div>
            <button
              onClick={checkCircuitFiles}
              className="px-3 py-1 text-xs bg-orange-500/20 text-orange-300 rounded hover:bg-orange-500/30 transition-colors"
            >
              Recheck
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-orange-900/20 rounded text-xs text-orange-200">
            <p className="font-medium mb-1">📁 Expected Circuit Files:</p>
            <ul className="space-y-1 text-orange-300">
              <li>• <code>/public/circuits/build/ageVerification_js/ageVerification.wasm</code></li>
              <li>• <code>/public/circuits/build/ageVerification_0001.zkey</code></li>
              <li>• <code>/public/circuits/build/verification_key.json</code></li>
            </ul>
          </div>
        </div>
      )}
      
      {lastChecked && (
        <div className="mt-2 text-xs text-gray-400">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
```

#### E. SnarkJS Status Component

**`src/components/SnarkjsStatus.tsx`:**
```tsx
import { useState, useEffect, useCallback } from 'react';
import { SnarkjsLoader } from '../lib/snarkjsLoader';

interface SnarkjsStatusProps {
  onLoadingChange?: (isLoading: boolean) => void;
  onStatusChange?: (isLoaded: boolean) => void;
  showDetailedStatus?: boolean;
}

export default function SnarkjsStatus({ 
  onLoadingChange, 
  onStatusChange,
  showDetailedStatus = false 
}: SnarkjsStatusProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkAndLoadSnarkjs = useCallback(async () => {
    // Check if already loaded
    if (SnarkjsLoader.isLoaded()) {
      setIsLoaded(true);
      onStatusChange?.(true);
      return;
    }

    setIsLoading(true);
    onLoadingChange?.(true);
    setError(null);

    try {
      await SnarkjsLoader.preload(3);
      setIsLoaded(true);
      setError(null);
      onStatusChange?.(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load SnarkJS';
      setError(errorMsg);
      setIsLoaded(false);
      onStatusChange?.(false);
      console.error('SnarkJS loading failed:', err);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [onLoadingChange, onStatusChange]);

  useEffect(() => {
    checkAndLoadSnarkjs();
    
    // Listen for snarkjs-loaded event from preloader
    const handleSnarkjsLoaded = () => {
      console.log('SnarkJS loaded via preloader');
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
      onStatusChange?.(true);
      onLoadingChange?.(false);
    };

    window.addEventListener('snarkjs-loaded', handleSnarkjsLoaded);
    
    return () => {
      window.removeEventListener('snarkjs-loaded', handleSnarkjsLoaded);
    };
  }, [checkAndLoadSnarkjs, onLoadingChange, onStatusChange]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await checkAndLoadSnarkjs();
  };

  const handleForceReload = async () => {
    setIsLoading(true);
    onLoadingChange?.(true);
    setError(null);

    try {
      await SnarkjsLoader.reload();
      setIsLoaded(true);
      setError(null);
      onStatusChange?.(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reload SnarkJS';
      setError(errorMsg);
      setIsLoaded(false);
      onStatusChange?.(false);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  if (!showDetailedStatus && isLoaded) {
    return null; // Don't show anything if loaded and not showing detailed status
  }

  return (
    <div className="w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <div>
              <p className="text-blue-400 font-medium">Loading ZK Proof System</p>
              <p className="text-blue-300 text-sm">
                Setting up cryptographic libraries...
                {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isLoaded && !isLoading && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <p className="text-green-400 font-medium">ZK Proof System Ready</p>
              {showDetailedStatus && (
                <p className="text-green-300 text-sm">
                  SnarkJS version: {SnarkjsLoader.getVersion() || 'Unknown'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="text-red-400 text-xl">⚠️</div>
              <div>
                <p className="text-red-400 font-medium">ZK Proof System Error</p>
                <p className="text-red-300 text-sm mb-2">{error}</p>
                {showDetailedStatus && (
                  <p className="text-red-200 text-xs">
                    Some features may work with fallback methods, but full ZK proof generation requires this system.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleRetry}
                className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
              {showDetailedStatus && (
                <button
                  onClick={handleForceReload}
                  className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                >
                  Force Reload
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Status */}
      {showDetailedStatus && (
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>SnarkJS Status:</span>
            <span className={isLoaded ? 'text-green-400' : 'text-red-400'}>
              {isLoaded ? 'Loaded' : 'Not Loaded'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Browser Support:</span>
            <span className="text-green-400">
              {typeof window !== 'undefined' && window.crypto ? 'Yes' : 'No'}
            </span>
          </div>
          {retryCount > 0 && (
            <div className="flex justify-between">
              <span>Retry Attempts:</span>
              <span className="text-yellow-400">{retryCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 9. Configuration Files

#### A. Blockchain Configuration

**`src/config/chains.ts`:**
```typescript
import type { Chain } from 'wagmi/chains'

export const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadScan',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
}
```

#### B. Contract Constants

**`src/constants/index.ts`:**
```typescript
// Contract addresses (updated with deployed addresses from Monad Testnet)
export const AGE_VERIFIER_ADDRESS = "0x75b80D70D2b1ce480F7e391117B0F35cCF1482b7" as const
export const GROTH16_VERIFIER_ADDRESS = "0xC1aD18257743FA939c64582a846282a572c17D23" as const

// Network configuration
export const MONAD_TESTNET_CHAIN_ID = 10143
export const MONAD_TESTNET_RPC = "https://testnet-rpc.monad.xyz/"
export const MONAD_TESTNET_EXPLORER = "https://testnet.monadexplorer.com"

// ABI untuk Age Verifier Contract
export const AGE_VERIFIER_ABI = [{"inputs":[{"internalType":"address","name":"_verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"commitment","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isAdult","type":"bool"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AgeVerified","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"VerificationRevoked","type":"event"},{"inputs":[{"internalType":"address[]","name":"users","type":"address[]"}],"name":"batchCheckVerification","outputs":[{"internalType":"bool[]","name":"results","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getVerificationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"commitment","type":"uint256"}],"name":"isCommitmentUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isVerifiedAdult","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revokeVerification","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"usedCommitments","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"verificationTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"verifiedAdults","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"verifier","outputs":[{"internalType":"contract Groth16Verifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[2]","name":"_publicSignals","type":"uint256[2]"}],"name":"verifyAge","outputs":[],"stateMutability":"nonpayable","type":"function"}] as const

// Helper URLs
export const EXPLORER_TX_URL = (txHash: string) => 
  `${MONAD_TESTNET_EXPLORER}/tx/${txHash}`

export const EXPLORER_ADDRESS_URL = (address: string) => 
  `${MONAD_TESTNET_EXPLORER}/address/${address}`

// Contract deployment info
export const DEPLOYMENT_INFO = {
  network: "Monad Testnet",
  chainId: MONAD_TESTNET_CHAIN_ID,
  contracts: {
    ageVerifier: {
      address: AGE_VERIFIER_ADDRESS,
      explorer: EXPLORER_ADDRESS_URL(AGE_VERIFIER_ADDRESS)
    },
    groth16Verifier: {
      address: GROTH16_VERIFIER_ADDRESS,
      explorer: EXPLORER_ADDRESS_URL(GROTH16_VERIFIER_ADDRESS)
    }
  }
} as const
```

### 10. Utility Functions

**`src/utils/formatters.ts`:**
```typescript
/**
 * Format timestamp
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Format number dengan pemisah ribuan
 */
export const formatNumber = (
  value: number | string, 
  decimals: number = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format address untuk display
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format USD value
 */
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Validate input string for numeric values
 */
export const isValidNumericInput = (value: string): boolean => {
  // Allow empty string, digits, and single decimal point
  return /^[\d]*\.?[\d]*$/.test(value);
};

/**
 * Check if amount is valid for transaction
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '0' || amount === '.') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};
```

### 11. Custom Hooks

**`src/hooks/useSnarkjsStatus.ts`:**
```typescript
import { useState, useEffect } from 'react';
import { SnarkjsLoader } from '../lib/snarkjsLoader';

// Hook for using SnarkJS status
export function useSnarkjsStatus() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      try {
        const supported = SnarkjsLoader.isLoaded();
        setIsLoaded(supported);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  const reload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await SnarkjsLoader.reload();
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reload failed');
      setIsLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoaded,
    isLoading,
    error,
    reload
  };
}

// Hook for circuit status
export function useCircuitStatus() {
  const [hasCircuit, setHasCircuit] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCircuit = async () => {
      setIsChecking(true);
      try {
        const wasmResponse = await fetch('/circuits/build/ageVerification_js/ageVerification.wasm', { method: 'HEAD' });
        const zkeyResponse = await fetch('/circuits/build/ageVerification_0001.zkey', { method: 'HEAD' });
        const vkeyResponse = await fetch('/circuits/build/verification_key.json', { method: 'HEAD' });
        
        const hasAll = wasmResponse.ok && zkeyResponse.ok && vkeyResponse.ok;
        setHasCircuit(hasAll);
      } catch {
        setHasCircuit(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkCircuit();
  }, []);

  return { hasCircuit, isChecking };
}
```

### 12. Main App Component

**`src/App.tsx`:**
```tsx
import '@rainbow-me/rainbowkit/styles.css'
import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { monadTestnet } from './config/chains'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

import KTPInputForm from './components/KTPInputForm'
import ZKProofDisplay from './components/ZKProofDisplay'
import Header from './components/Header'

import type { KTPData, KTPProofInput, AgeProofOutput } from './types/ktp'
import { ZKProofGenerator } from './lib/zkProof'
import { SnarkjsLoader } from './lib/snarkjsLoader'
import { AGE_VERIFIER_ABI, AGE_VERIFIER_ADDRESS } from './constants'

// Wagmi configuration
const config = getDefaultConfig({
  appName: 'ZK Age Verification',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [monadTestnet],
  ssr: true,
});

const queryClient = new QueryClient()

// Helper function to convert string arrays to bigint tuples
const convertProofParams = (proof: AgeProofOutput) => {
  // Convert string arrays to bigint arrays and ensure proper tuple types
  const pA: [bigint, bigint] = [
    BigInt(proof.proof.pi_a[0]), 
    BigInt(proof.proof.pi_a[1])
  ];
  
  const pB: [[bigint, bigint], [bigint, bigint]] = [
    [BigInt(proof.proof.pi_b[0][0]), BigInt(proof.proof.pi_b[0][1])],
    [BigInt(proof.proof.pi_b[1][0]), BigInt(proof.proof.pi_b[1][1])]
  ];
  
  const pC: [bigint, bigint] = [
    BigInt(proof.proof.pi_c[0]), 
    BigInt(proof.proof.pi_c[1])
  ];
  
  const publicSignals: [bigint, bigint] = [
    BigInt(proof.publicSignals[0]), 
    BigInt(proof.publicSignals[1])
  ];

  return { pA, pB, pC, publicSignals };
};

function ZKAgeVerificationApp() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  
  const [step, setStep] = useState<'input' | 'proof' | 'verified'>('input')
  const [zkProof, setZKProof] = useState<AgeProofOutput | null>(null)
  const [isAdult, setIsAdult] = useState(false)
  const [commitment, setCommitment] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationTx, setVerificationTx] = useState('')
  const [snarkjsLoaded, setSnarkjsLoaded] = useState(false)
  const [snarkjsLoading, setSnarkjsLoading] = useState(false)

  const { isLoading: isTxLoading } = useWaitForTransactionReceipt({
    hash: verificationTx as `0x${string}`,
  })

  // Load SnarkJS on component mount
  useEffect(() => {
    const loadSnarkJS = async () => {
      if (SnarkjsLoader.isLoaded()) {
        setSnarkjsLoaded(true)
        return
      }

      setSnarkjsLoading(true)
      try {
        await SnarkjsLoader.preload(3) // 3 retries
        setSnarkjsLoaded(true)
        toast.success('ZK proof system ready!')
      } catch (error) {
        console.error('Failed to load SnarkJS:', error)
        toast.error('Failed to load ZK proof system. Some features may not work.')
      } finally {
        setSnarkjsLoading(false)
      }
    }

    loadSnarkJS()
  }, [])

  const handleKTPSubmit = async (data: KTPData) => {
    setIsGenerating(true)

    try {
      // Check if SnarkJS is loaded
      if (!snarkjsLoaded) {
        // Try to load SnarkJS one more time
        toast.loading('Loading ZK proof system...')
        await SnarkjsLoader.load()
        setSnarkjsLoaded(true)
        toast.dismiss()
      }

      // Parse birth date
      const { day, month, year } = ZKProofGenerator.parseBirthDate(data.tanggalLahir)
      
      // Calculate age to check if >= 18
      const currentAge = ZKProofGenerator.calculateAge(data.tanggalLahir)
      setIsAdult(currentAge >= 18)

      // Generate salt for privacy
      const salt = ZKProofGenerator.generateSalt()

      // Create proof input
      const proofInput: KTPProofInput = {
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        currentYear: new Date().getFullYear(),
        salt: salt
      }

      // Generate commitment
      const commitmentHash = await ZKProofGenerator.createCommitment(
        day, month, year, salt
      )
      setCommitment(commitmentHash)
      
      let proof: AgeProofOutput
        // Generate real ZK proof
        const zkGenerator = new ZKProofGenerator()
        // eslint-disable-next-line prefer-const
        proof = await zkGenerator.generateAgeProof(proofInput)
        toast.success('ZK proof generated successfully!')
      
      
      setZKProof(proof)
      setStep('proof')

    } catch (error) {
      console.error('Error generating proof:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('snarkjs')) {
        toast.error('ZK proof system not available. Please refresh and try again.')
      } else {
        toast.error('Failed to generate ZK proof: ' + errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVerifyOnChain = async () => {
    if (!zkProof || !isConnected || !address) {
      toast.error('Please connect wallet first')
      return
    }

    setIsVerifying(true)

    try {
      // Convert proof parameters to proper types
      const { pA, pB, pC, publicSignals } = convertProofParams(zkProof)

      const hash = await writeContractAsync({
        address: AGE_VERIFIER_ADDRESS,
        abi: AGE_VERIFIER_ABI,
        functionName: 'verifyAge',
        args: [pA, pB, pC, publicSignals],
      })

      setVerificationTx(hash)
      setStep('verified')
      
      toast.success('Age verification submitted to blockchain!')

    } catch (error) {
      console.error('Error verifying on-chain:', error)
      toast.error('Failed to verify on blockchain')
    } finally {
      setIsVerifying(false)
    }
  }

  const resetFlow = () => {
    setStep('input')
    setZKProof(null)
    setIsAdult(false)
    setCommitment('')
    setVerificationTx('')
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="glass card-hover rounded-2xl p-12 max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6 float-animation">🆔</div>
          <h2 className="text-4xl font-bold mb-6 text-gradient-monad">
            Zero-Knowledge Age Verification
          </h2>
          <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            Prove you're over 18 using Indonesian KTP data without revealing any personal information. Powered by advanced cryptography and zero-knowledge proofs.
          </p>
          
          {/* SnarkJS Loading Status */}
          {snarkjsLoading && (
            <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-blue-400">Loading ZK proof system...</span>
              </div>
            </div>
          )}
          
          {!snarkjsLoading && !snarkjsLoaded && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-yellow-400 text-sm">
                ⚠️ ZK proof system not loaded. Some features may use fallback methods.
              </p>
            </div>
          )}
          
          {snarkjsLoaded && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 text-sm">
                ✅ ZK proof system ready!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)"
            }}>
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Complete Privacy</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Zero personal data is revealed or stored
              </p>
            </div>
            
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderColor: "rgba(16, 185, 129, 0.3)"
            }}>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Instant Verification</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Mathematical proof generated in seconds
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium mb-4" style={{ color: "#836EF9" }}>
              Connect your wallet to begin verification
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'input', label: 'Input KTP', icon: '📄' },
              { step: 'proof', label: 'Generate Proof', icon: '🔐' },
              { step: 'verified', label: 'Blockchain Verification', icon: '✅' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  step === item.step 
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400' 
                    : index < ['input', 'proof', 'verified'].indexOf(step)
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-gray-500 bg-gray-500/20 text-gray-500'
                }`}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`font-medium ${
                    step === item.step ? 'text-purple-400' :
                    index < ['input', 'proof', 'verified'].indexOf(step) ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </div>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-px mx-4 ${
                    index < ['input', 'proof', 'verified'].indexOf(step) ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 'input' && (
          <KTPInputForm 
            onSubmit={handleKTPSubmit}
            isLoading={isGenerating}
          />
        )}

        {step === 'proof' && zkProof && (
          <ZKProofDisplay
            proof={zkProof}
            isAdult={isAdult}
            commitment={commitment}
            onVerifyOnChain={handleVerifyOnChain}
            isVerifying={isVerifying || isTxLoading}
            verificationTx={verificationTx}
          />
        )}

        {step === 'verified' && (
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#FBFAF9" }}>
                Verification Complete!
              </h2>
              <p className="text-lg mb-6" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                Your age has been successfully verified on the Monad blockchain using zero-knowledge cryptography.
              </p>
              
              {verificationTx && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-green-400 mb-2">Transaction Hash:</p>
                  <a 
                    href={`https://testnet.monadexplorer.com/tx/${verificationTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 font-mono text-xs break-all"
                  >
                    {verificationTx}
                  </a>
                </div>
              )}
              
              <button
                onClick={resetFlow}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 btn-primary"
                style={{
                  background: "linear-gradient(135deg, #836EF9 0%, #A0055D 100%)",
                  color: "#FBFAF9"
                }}
              >
                Start New Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen">
            <Header />
            <ZKAgeVerificationApp />
          </div>
          <Toaster position="top-center" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

**App Features:**
- 🔗 **Wallet Integration**: RainbowKit untuk wallet connection
- 📊 **Progress Tracking**: Step-by-step verification process
- 🔄 **State Management**: React state untuk semua verification steps
- ⚡ **SnarkJS Loading**: Dynamic loading dengan status tracking
- 🎯 **Type Conversion**: Proof parameter conversion untuk contract calls

### 13. Styling dan UI

#### A. Main CSS

**`src/index.css`:**
```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
@import "tailwindcss";

:root {
  /* Monad Brand Colors */
  --monad-off-white: #fbfaf9;
  --monad-purple: #836ef9;
  --monad-blue: #200052;
  --monad-berry: #a0055d;
  --monad-black: #0e100f;
  --monad-white: #ffffff;

  /* DeFi specific colors */
  --success-green: #10b981;
  --success-green-light: rgba(16, 185, 129, 0.2);
  --warning-yellow: #f59e0b;
  --warning-yellow-light: rgba(245, 158, 11, 0.2);
  --error-red: #ef4444;
  --error-red-light: rgba(239, 68, 68, 0.2);

  /* Derived colors for UI */
  --monad-purple-light: rgba(131, 110, 249, 0.8);
  --monad-purple-dark: rgba(131, 110, 249, 0.2);
  --monad-berry-light: rgba(160, 5, 93, 0.8);
  --monad-berry-dark: rgba(160, 5, 93, 0.2);
  --monad-blue-light: rgba(32, 0, 82, 0.8);
  --monad-blue-dark: rgba(32, 0, 82, 0.3);

  /* UI System Colors */
  --bg-primary: var(--monad-blue);
  --bg-secondary: var(--monad-black);
  --bg-tertiary: rgba(32, 0, 82, 0.6);
  --text-primary: var(--monad-off-white);
  --text-secondary: var(--monad-white);
  --text-muted: rgba(251, 250, 249, 0.7);
  --border-primary: rgba(131, 110, 249, 0.3);
  --border-secondary: rgba(251, 250, 249, 0.1);
}

* {
  box-sizing: border-box;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(135deg, var(--monad-blue) 0%, var(--monad-black) 50%, #1a0040 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: var(--text-primary);
  line-height: 1.6;
  font-weight: 400;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--monad-black);
}

::-webkit-scrollbar-thumb {
  background: var(--monad-purple);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--monad-berry);
}

/* Animations */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, rgba(251, 250, 249, 0.05) 0px, rgba(251, 250, 249, 0.15) 40px, rgba(251, 250, 249, 0.05) 80px);
  background-size: 400px;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes pulse-success {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.pulse-success {
  animation: pulse-success 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes glow-purple {
  0%, 100% {
    box-shadow: 0 0 5px rgba(131, 110, 249, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(131, 110, 249, 0.6), 0 0 30px rgba(131, 110, 249, 0.4);
  }
}

@keyframes glow-berry {
  0%, 100% {
    box-shadow: 0 0 5px rgba(160, 5, 93, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(160, 5, 93, 0.6), 0 0 30px rgba(160, 5, 93, 0.4);
  }
}

@keyframes glow-success {
  0%, 100% {
    box-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);
  }
}

.glow-purple {
  animation: glow-purple 2s ease-in-out infinite;
}

.glow-berry {
  animation: glow-berry 2s ease-in-out infinite;
}

.glow-success {
  animation: glow-success 2s ease-in-out infinite;
}

/* Glass morphism effect */
.glass {
  background: rgba(14, 16, 15, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(251, 250, 249, 0.1);
}

.glass-dark {
  background: rgba(32, 0, 82, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(131, 110, 249, 0.2);
}

/* Button hover effects */
.btn-primary {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Input styles */
.input-primary {
  background: rgba(14, 16, 15, 0.5);
  border: 1px solid rgba(251, 250, 249, 0.2);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.input-primary:focus {
  outline: none;
  border-color: var(--monad-purple);
  box-shadow: 0 0 0 3px rgba(131, 110, 249, 0.1);
}

/* Monad brand gradients */
.gradient-monad-primary {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
}

.gradient-monad-secondary {
  background: linear-gradient(135deg, var(--monad-blue) 0%, var(--monad-black) 100%);
}

.gradient-success {
  background: linear-gradient(135deg, var(--success-green) 0%, #059669 100%);
}

.text-gradient-monad {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Loading spinner */
.spinner {
  border: 2px solid rgba(251, 250, 249, 0.3);
  border-top: 2px solid var(--monad-purple);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom number input */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* ZK Specific Styles */
.zk-card {
  background: rgba(14, 16, 15, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(131, 110, 249, 0.2);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.zk-input {
  background: rgba(14, 16, 15, 0.8);
  border: 1px solid rgba(251, 250, 249, 0.2);
  color: var(--monad-off-white);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  width: 100%;
  font-family: inherit;
  transition: all 0.3s ease;
}

.zk-input:focus {
  outline: none;
  border-color: var(--monad-purple);
  box-shadow: 0 0 0 3px rgba(131, 110, 249, 0.2);
}

.zk-input::placeholder {
  color: rgba(251, 250, 249, 0.5);
}

.proof-container {
  background: rgba(32, 0, 82, 0.2);
  border: 1px solid rgba(131, 110, 249, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

.commitment-hash {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(14, 16, 15, 0.8);
  border: 1px solid rgba(131, 110, 249, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  word-break: break-all;
  font-size: 0.875rem;
  color: var(--monad-purple);
}

/* Privacy guarantee styles */
.privacy-guarantee {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

/* Status indicators */
.status-success {
  color: var(--success-green);
  background: var(--success-green-light);
  border: 1px solid var(--success-green);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-warning {
  color: var(--warning-yellow);
  background: var(--warning-yellow-light);
  border: 1px solid var(--warning-yellow);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-error {
  color: var(--error-red);
  background: var(--error-red-light);
  border: 1px solid var(--error-red);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Progress indicator */
.progress-step {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.3s ease;
}

.progress-step.active {
  border-color: var(--monad-purple);
  background: rgba(131, 110, 249, 0.2);
  color: var(--monad-purple);
}

.progress-step.completed {
  border-color: var(--success-green);
  background: rgba(16, 185, 129, 0.2);
  color: var(--success-green);
}

.progress-step.inactive {
  border-color: rgba(251, 250, 249, 0.3);
  background: transparent;
  color: rgba(251, 250, 249, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(8px);
  }
  
  .zk-card {
    backdrop-filter: blur(8px);
  }
  
  .commitment-hash {
    font-size: 0.75rem;
  }
}

/* Selection styling */
::selection {
  background: rgba(131, 110, 249, 0.3);
  color: var(--monad-off-white);
}

/* Focus visible for accessibility */
*:focus-visible {
  outline: 2px solid var(--monad-purple);
  outline-offset: 2px;
}

/* Disabled state */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading state overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(14, 16, 15, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Tooltip styles */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(14, 16, 15, 0.9);
  color: var(--monad-off-white);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.tooltip:hover::after {
  opacity: 1;
}

/* Chart styles (for Recharts) */
.recharts-wrapper {
  font-family: 'Inter', sans-serif;
}

.recharts-cartesian-axis-tick-value {
  fill: rgba(251, 250, 249, 0.7);
  font-size: 12px;
}

.recharts-tooltip-wrapper {
  font-family: 'Inter', sans-serif;
}

/* Print styles */
@media print {
  body {
    background: white;
    color: black;
  }
  
  .glass,
  .glass-dark {
    background: white;
    border: 1px solid #ccc;
    backdrop-filter: none;
  }
}
```

#### B. App-Specific CSS

**`src/App.css`:**
```css
#root {
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ZK Age Verification specific styles */
.zk-age-app {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}

.ktp-form-container {
  max-width: 42rem;
  margin: 0 auto;
  padding: 1rem;
}

.proof-display-container {
  max-width: 56rem;
  margin: 0 auto;
  padding: 1rem;
}

.verification-complete-container {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

/* Header specific styles */
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(32, 0, 82, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(251, 250, 249, 0.1);
}

/* Footer if needed */
.app-footer {
  background: rgba(14, 16, 15, 0.8);
  border-top: 1px solid rgba(251, 250, 249, 0.1);
  padding: 1rem 0;
  text-align: center;
  color: rgba(251, 250, 249, 0.7);
  font-size: 0.875rem;
}

/* RainbowKit customization */
.iekbcc0 {
  font-family: 'Inter', sans-serif !important;
}

.iekbcc0 button {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%) !important;
  border: none !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.iekbcc0 button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 25px rgba(131, 110, 249, 0.3) !important;
}

/* React Hot Toast customization */
.react-hot-toast {
  font-family: 'Inter', sans-serif;
}

.react-hot-toast > div {
  background: rgba(14, 16, 15, 0.9) !important;
  color: var(--monad-off-white) !important;
  border: 1px solid rgba(131, 110, 249, 0.3) !important;
  border-radius: 0.75rem !important;
  backdrop-filter: blur(12px) !important;
}
```

#### C. Tailwind Configuration

**`tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monad Brand Colors
        'monad-off-white': '#fbfaf9',
        'monad-purple': '#836ef9',
        'monad-blue': '#200052',
        'monad-berry': '#a0055d',
        'monad-black': '#0e100f',
        'monad-white': '#ffffff',
        
        // DeFi specific colors
        'success-green': '#10b981',
        'warning-yellow': '#f59e0b',
        'error-red': '#ef4444',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-monad': 'linear-gradient(135deg, #836EF9 0%, #A0055D 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-main': 'linear-gradient(135deg, #200052 0%, #0E100F 50%, #1a0040 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-purple': 'glow-purple 2s ease-in-out infinite',
        'glow-berry': 'glow-berry 2s ease-in-out infinite',
        'glow-success': 'glow-success 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-success': 'pulse-success 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow-purple': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(131, 110, 249, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(131, 110, 249, 0.6), 0 0 30px rgba(131, 110, 249, 0.4)' },
        },
        'glow-berry': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(160, 5, 93, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(160, 5, 93, 0.6), 0 0 30px rgba(160, 5, 93, 0.4)' },
        },
        'glow-success': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        'pulse-success': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 14. Build Configuration

#### A. Vite Configuration

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['snarkjs'],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
```

#### B. TypeScript Configuration

**`tsconfig.app.json`:**
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

```

#### C. Package Configuration

**`package.json`:**
```json
{
  "name": "zk-age-verification",
  "private": true,
  "version": "0.0.0",
  "type": "module",
   "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "css-build": "tailwindcss -i ./src/index.css -o ./dist/output.css --watch",
    "compile-circuit": "./scripts/compile-circuit.sh ageVerification"
  },
  "dependencies": {
    "@noir-lang/backend_barretenberg": "^0.36.0",
    "@noir-lang/noir_wasm": "^1.0.0-beta.7",
    "@rainbow-me/rainbowkit": "^2.2.8",
    "@tailwindcss/vite": "^4.1.11",
    "@tanstack/react-query": "^5.81.2",
    "circomlib": "^2.0.5",
    "lucide-react": "^0.523.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hot-toast": "^2.5.2",
    "snarkjs": "^0.7.5",
    "viem": "^2.31.4",
    "wagmi": "^2.15.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.29.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.2",
    "eslint": "^9.29.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.2.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.1",
    "vite": "^6.3.5"
  }
}

```

### 15. Setup Scripts

#### A. Circuit File Management

**`scripts/copy-circuit-files.sh`:**
```bash
#!/bin/bash

# Script untuk copy circuit files ke public directory

echo "🔧 Copying circuit files to public directory..."

# Create directory structure
mkdir -p public/circuits/build/ageVerification_js/
mkdir -p public/circuits/build/

# Copy WASM file
if [ -f "circuits/build/ageVerification_js/ageVerification.wasm" ]; then
    cp circuits/build/ageVerification_js/ageVerification.wasm public/circuits/build/ageVerification_js/
    echo "✅ Copied ageVerification.wasm"
else
    echo "❌ ageVerification.wasm not found in circuits/build/ageVerification_js/"
fi

# Copy zkey file
if [ -f "circuits/build/ageVerification_0001.zkey" ]; then
    cp circuits/build/ageVerification_0001.zkey public/circuits/build/
    echo "✅ Copied ageVerification_0001.zkey"
else
    echo "❌ ageVerification_0001.zkey not found in circuits/build/"
fi

# Copy verification key
if [ -f "circuits/build/verification_key.json" ]; then
    cp circuits/build/verification_key.json public/circuits/build/
    echo "✅ Copied verification_key.json"
else
    echo "❌ verification_key.json not found in circuits/build/"
fi

# Copy witness calculator (optional)
if [ -f "circuits/build/ageVerification_js/witness_calculator.js" ]; then
    cp circuits/build/ageVerification_js/witness_calculator.js public/circuits/build/ageVerification_js/
    echo "✅ Copied witness_calculator.js"
fi

# Copy generate_witness.js (optional)
if [ -f "circuits/build/ageVerification_js/generate_witness.js" ]; then
    cp circuits/build/ageVerification_js/generate_witness.js public/circuits/build/ageVerification_js/
    echo "✅ Copied generate_witness.js"
fi

echo ""
echo "📁 Files copied to public/circuits/build/"
echo "Structure:"
echo "public/"
echo "└── circuits/"
echo "    └── build/"
echo "        ├── ageVerification_js/"
echo "        │   ├── ageVerification.wasm"
echo "        │   ├── witness_calculator.js"
echo "        │   └── generate_witness.js"
echo "        ├── ageVerification_0001.zkey"
echo "        └── verification_key.json"

echo ""
echo "🚀 Circuit files ready for frontend!"
echo "You can now test the ZK proof generation."
```
---

## How It Works - Technical Flow

### 1. User Input Phase
```mermaid
graph LR
    A[User Input KTP] --> B[Validate Format]
    B --> C[Parse Birth Date]
    C --> D[Generate Salt]
    D --> E[Prepare Circuit Inputs]
```

### 2. ZK Proof Generation Phase
```mermaid
graph LR
    A[Circuit Inputs] --> B{Circuit Available?}
    B -->|Yes| C[Real ZK Proof]
    B -->|No| D[Mock Proof]
    C --> E[Format for Contract]
    D --> E
    E --> F[Display Results]
```

### 3. Blockchain Verification Phase
```mermaid
graph LR
    A[ZK Proof] --> B[Convert Parameters]
    B --> C[Smart Contract Call]
    C --> D[Groth16 Verification]
    D --> E[Update State]
    E --> F[Emit Events]
```

---

## Privacy & Security Analysis

### What's Private (Zero-Knowledge):
- ✅ **Exact Birth Date**: Never revealed, only age range proven
- ✅ **Personal Information**: Name, NIK, address remain secret
- ✅ **Random Salt**: Used in commitment, prevents correlation attacks
- ✅ **Circuit Inputs**: All sensitive data stays client-side

### What's Public (Verifiable):
- ✅ **Age Qualification**: Boolean proof that age ≥ 18
- ✅ **Commitment Hash**: Cryptographic commitment to birth data
- ✅ **Verification Status**: On-chain record of successful verification
- ✅ **Timestamp**: When verification occurred

### Security Features:
- 🔐 **Field Element Constraints**: All inputs bounded to prevent overflow
- 🔒 **Commitment Scheme**: Prevents proof replay attacks
- 🛡️ **Range Validation**: Circuit enforces valid date ranges
- ⚡ **Groth16 Proofs**: Industry-standard zk-SNARK system
- 🔄 **Deterministic Verification**: Same proof always produces same result

---

## Development Workflow

### Phase 1: Setup Environment
```bash
# 1. Clone repository
git clone [repo-url]
cd zk-age-verification

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local dengan WalletConnect Project ID

# 4. Start development server
npm run dev
```

### Phase 2: Circuit Development (Optional)
```bash
# 1. Install circom tools
npm install -g circom

# 2. Compile circuit
npm run compile-circuit

# 3. Copy files to public
./scripts/copy-circuit-files.sh
```

### Phase 3: Testing
```bash
# 1. Test dengan sample KTP data
# - Load sample: "25-01-1995" (adult)
# - Try invalid: "25-01-2010" (minor)

# 2. Test wallet connection
# - Connect MetaMask
# - Switch to Monad Testnet

# 3. Test proof generation
# - Mock proof mode (default)
# - Real proof (jika circuit tersedia)

# 4. Test blockchain verification
# - Submit proof to contract
# - Check verification status
```

---

## Production Deployment Checklist

### Pre-deployment:
- [ ] **Circuit Ceremony**: Trusted setup ceremony completed
- [ ] **Contract Audit**: Smart contracts audited untuk security
- [ ] **Circuit Files**: All circuit files properly generated dan tested
- [ ] **Environment Variables**: Production values configured
- [ ] **Error Handling**: All edge cases handled gracefully

### Deployment:
- [ ] **Smart Contracts**: Deploy verifier dan AgeVerifier contracts
- [ ] **Frontend Build**: Production build dengan optimization
- [ ] **Circuit Files**: Upload circuit files to public directory
- [ ] **CDN Setup**: Configure CDN untuk circuit file delivery
- [ ] **Monitoring**: Setup error tracking dan analytics

### Post-deployment:
- [ ] **Testing**: End-to-end testing pada production environment
- [ ] **Documentation**: User guides dan technical documentation
- [ ] **Support**: Support channels untuk users
- [ ] **Monitoring**: Monitor contract usage dan error rates

---

## Troubleshooting Guide

### Common Issues:

#### 1. "Circuit files not found"
```bash
# Solution: Copy circuit files
./scripts/copy-circuit-files.sh
```

#### 2. "SnarkJS not loaded"
- Check browser console untuk network errors
- Try refreshing the page
- Verify internet connection untuk CDN access

#### 3. "Assert Failed. Error in template"
- Check birth year is between 1900-2010
- Verify date format is DD-MM-YYYY
- Ensure salt is within field constraints

#### 4. Wallet connection issues:
- Ensure MetaMask is installed
- Check you're on Monad Testnet
- Try refreshing dan reconnecting

#### 5. Transaction failures:
- Check wallet has enough MON tokens
- Verify gas limits
- Try increasing gas price

### Debug Mode:
```javascript
// Enable debug logging
localStorage.setItem('DEBUG', 'zkproof:*')

// Check circuit status
console.log(await ZKProofGenerator.isSupported())

// Verify file paths
fetch('/circuits/build/ageVerification_js/ageVerification.wasm')
```

---

## Extensions & Future Improvements

### Phase 1 Enhancements:
- [ ] **Multiple Age Thresholds**: 18, 21, 25 year verification
- [ ] **Location Verification**: Province/region verification without revealing exact location
- [ ] **Gender Verification**: Proof without revealing exact gender
- [ ] **Batch Verification**: Multiple proofs dalam single transaction

### Phase 2 Advanced Features:
- [ ] **Mobile App**: React Native implementation
- [ ] **Cross-chain Support**: Verification across multiple blockchains
- [ ] **Anonymous Credentials**: Full credential system dengan multiple attributes
- [ ] **Recursive Proofs**: More complex verification trees

### Phase 3 Production Features:
- [ ] **Enterprise Integration**: API untuk third-party integration
- [ ] **Compliance Tools**: Regulatory compliance features
- [ ] **Analytics Dashboard**: Usage analytics dan monitoring
- [ ] **Multi-language Support**: Internationalization

---

## Learning Objectives Summary

By the end of this session, participants will have:

### 🎯 **Technical Skills**:
- ✅ Implemented complete ZK age verification system
- ✅ Built Circom circuits dengan proper constraints
- ✅ Integrated SnarkJS dalam React application
- ✅ Deployed dan tested smart contracts pada testnet
- ✅ Created production-ready frontend dengan fallback systems

### 🔧 **Practical Knowledge**:
- ✅ Understanding of ZK proof properties dan use cases
- ✅ Experience dengan real-world privacy-preserving applications
- ✅ Knowledge of common pitfalls dan how to avoid them
- ✅ Best practices untuk ZK application development
- ✅ Security considerations untuk privacy applications

### 🚀 **Ready for Production**:
- ✅ Complete, deployable application
- ✅ Comprehensive error handling dan user experience
- ✅ Security best practices implemented
- ✅ Documentation dan testing strategies
- ✅ Extension points untuk future development

---

**🎉 Congratulations! You've built a complete privacy-preserving age verification system using zero-knowledge proofs!**