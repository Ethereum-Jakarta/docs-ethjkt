---
id: indexing-simple-dex
title: "Bagian 3: Indexing SimpleDEX Contract"
sidebar_position: 3
description: "Hands-on: Membuat indexer untuk SimpleDEX contract dari Sesi 7, handle events swap & liquidity dan lainya, via query data GraphQL"
---

# Bagian 3: Indexing SimpleDEX Contract

## 🎯 Tujuan Bagian Ini

Setelah menyelesaikan bagian ini, Anda akan:

- ✅ Menggunakan SimpleDEX contract yang sudah di-deploy di Sesi 7
- ✅ Konfigurasi contract SimpleDEX dalam Ponder
- ✅ Membuat schema untuk data DEX (pool, swaps, liquidity)
- ✅ Menulis fungsi indexing untuk handle events DEX
- ✅ Test indexer secara real-time
- ✅ Query data DEX menggunakan GraphQL
- ✅ Troubleshoot masalah umum

---

## 📋 Apa Yang Akan Kita Index

**Indexer Analytics SimpleDEX** yang akan track:

- ✅ **Pool State** - Reserves, TVL, current price (CAMP/USDC)
- ✅ **Swap Events** - Semua swap dengan amount in/out, price impact
- ✅ **Liquidity Events** - Add & remove liquidity dengan amounts
- ✅ **LP Positions** - Posisi liquidity provider per user
- ✅ **Volume Analytics** - Volume 24h, 7d, total volume
- ✅ **Price History** - History harga untuk chart

---

## 🔗 Langkah 1: Koneksi ke SimpleDEX dari Sesi 7

### Prasyarat: SimpleDEX Sudah Di-deploy

**Pastikan Anda sudah punya:**

1. ✅ SimpleDEX contract ter-deploy di Lisk Sepolia
2. ✅ Address contract SimpleDEX
3. ✅ Address token CampusCoin (CAMP)
4. ✅ Address token MockUSDC
5. ✅ Contract sudah memiliki liquidity (add liquidity sudah dilakukan)

**Jika belum:**

- Kembali ke [Sesi 7 - Part 4](../Sesi-7-DeFi-Protocol-AMM/04-build-simple-dex.md) untuk deploy
- Atau gunakan address contract yang diberikan instruktur

### Catat Address Contracts

```bash
# Simpan di file .env.local atau catat di notes:
SIMPLE_DEX_ADDRESS=0x...  # Address SimpleDEX contract
CAMP_TOKEN_ADDRESS=0x...   # Address CampusCoin
USDC_TOKEN_ADDRESS=0x...   # Address MockUSDC
```

### Dapatkan Private RPC URL (Recommended)

Agar indexer terhubung lancar dan cepat, kita akan menggunakan **Private RPC URL** dari [Gelato Cloud](https://app.gelato.cloud). Berikut langkah-langkahnya:

1. **Akses website:**  
   Buka [app.gelato.cloud](https://app.gelato.cloud) di browser Anda.

2. **Registrasi akun & company:**  
   Daftar menggunakan email, lalu buat *company* asal sesuai instruksi.

3. **Masuk ke menu Private RPC:**  
   Setelah login, pada sidebar pilih **Private RPC**.

4. **Buat Key baru:**  
   Klik tombol **Create Key** / **Add Key** dan beri nama sesuai kebutuhan (misal: `simple-dex-indexer`).

5. **Pergi ke menu Networks (dalam Private RPC):**  
   Setelah key berhasil dibuat, klik pada key tersebut untuk membuka detail. Kemudian navigasi ke tab/menu **Networks**.

6. **Cari Lisk Sepolia Testnet dan copy RPC URL:**  
   Temukan **Lisk Sepolia Testnet** di daftar network. Klik untuk reveal **RPC URL**.  
   **Copy URL** ini dan simpan, misal ke file `.env` sebagai `PONDER_RPC_URL_1`.

Sekarang, Anda sudah punya endpoint Private RPC-nya!  
Gunakan URL ini di konfigurasi Ponder agar akses blockchain cepat dan andal.

---

## 📄 Langkah 2: Dapatkan ABI Contracts

### Dapatkan ABI SimpleDEX

**Opsi A: Dari Contract Code (Sesi 7)**

- Copy ABI dari contract SimpleDEX yang sudah di-compile
- Atau generate dari Remix/Foundry

**Opsi B: Dari Blockscout**

1. Kunjungi address SimpleDEX di Blockscout
2. Tab "Contract" → "Contract ABI"
3. Copy ABI

### Simpan ABI Files

Buat struktur folder:

```
abis/
├── SimpleDEXAbi.ts
├── ERC20Abi.ts  # Untuk token CAMP & USDC
```

**File `abis/SimpleDEXAbi.ts`:**

```typescript
export const SimpleDEXAbi = [
    {
      "inputs": [
        { "internalType": "address", "name": "_tokenA", "type": "address" },
        { "internalType": "address", "name": "_tokenB", "type": "address" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "allowance", "type": "uint256" },
        { "internalType": "uint256", "name": "needed", "type": "uint256" }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "sender", "type": "address" },
        { "internalType": "uint256", "name": "balance", "type": "uint256" },
        { "internalType": "uint256", "name": "needed", "type": "uint256" }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "approver", "type": "address" }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "receiver", "type": "address" }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "sender", "type": "address" }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "account", "type": "address" }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" },
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
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "FEE_PERCENT",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MINIMUM_LIQUIDITY",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "amountA", "type": "uint256" },
        { "internalType": "uint256", "name": "amountB", "type": "uint256" }
      ],
      "name": "addLiquidity",
      "outputs": [
        { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" },
        { "internalType": "address", "name": "spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "account", "type": "address" }
      ],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
        { "internalType": "uint256", "name": "reserveIn", "type": "uint256" },
        { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }
      ],
      "name": "getAmountOut",
      "outputs": [
        { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPoolInfo",
      "outputs": [
        { "internalType": "uint256", "name": "_reserveA", "type": "uint256" },
        { "internalType": "uint256", "name": "_reserveB", "type": "uint256" },
        {
          "internalType": "uint256",
          "name": "_totalLiquidity",
          "type": "uint256"
        },
        { "internalType": "uint256", "name": "_price", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPrice",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
      ],
      "name": "removeLiquidity",
      "outputs": [
        { "internalType": "uint256", "name": "amountA", "type": "uint256" },
        { "internalType": "uint256", "name": "amountB", "type": "uint256" }
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
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reserveB",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "amountAIn", "type": "uint256" },
        { "internalType": "uint256", "name": "minAmountBOut", "type": "uint256" }
      ],
      "name": "swapAforB",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "amountBIn", "type": "uint256" },
        { "internalType": "uint256", "name": "minAmountAOut", "type": "uint256" }
      ],
      "name": "swapBforA",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenA",
      "outputs": [
        { "internalType": "contract IERC20", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenB",
      "outputs": [
        { "internalType": "contract IERC20", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "from", "type": "address" },
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "newOwner", "type": "address" }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;
```

**File `abis/ERC20Abi.ts`:**
```typescript
export const ERC20Abi = [
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
```
---

## ⚙️ Langkah 3: Konfigurasi Contract di Ponder

Update `ponder.config.ts`:

```typescript
import { createConfig } from "ponder";
import { http } from "viem";
import { SimpleDEXAbi } from "./abis/SimpleDEXAbi";
import { ERC20Abi } from "./abis/ERC20Abi";

export default createConfig({
  database: {
    kind: "pglite", // atau "postgres"
  },

  chains: {
    liskSepolia: {
      id: 4202,
      rpc: http(
        process.env.PONDER_RPC_URL_4202 || "https://rpc.sepolia-api.lisk.com"
      ),
      pollingInterval: 5_000,
      maxRequestsPerSecond: 50,
    },
  },

  contracts: {
    SimpleDEX: {
      chain: "liskSepolia",
      abi: SimpleDEXAbi,
      address: process.env.SIMPLE_DEX_ADDRESS as `0x${string}`,
      startBlock: 28938350, // Sesuaikan dengan block awal saat deploy!
    },
    CampusCoin: {
      chain: "liskSepolia",
      abi: ERC20Abi,
      address: process.env.CAMP_TOKEN_ADDRESS as `0x${string}`,
      startBlock: 28938350, // Sesuaikan dengan block awal saat deploy!
    },
    MockUSDC: {
      chain: "liskSepolia",
      abi: ERC20Abi,
      address: process.env.USDC_TOKEN_ADDRESS as `0x${string}`,
      startBlock: 28938350, // Sesuaikan dengan block awal saat deploy!
    },
  },
});
```

**Cari Start Block:**

```
1. Kunjungi Blockscout
2. Cari address SimpleDEX
3. Lihat transaksi "Contract creation"
4. Catat nomor block → gunakan sebagai startBlock
```

---

## 🗄️ Langkah 4: Desain Schema Database

Edit `ponder.schema.ts`:

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

**Penjelasan Schema:**

- **swaps** - Menyimpan event swap, termasuk user, token yang ditukar, amount, price impact, dan info gas/block.
- **liquidity_events** - Menyimpan event add/remove liquidity, tipe tindakan (ADD/REMOVE), provider, jumlah, share pool, dsb.
- **transfers** - Menyimpan semua token transfer (token, from, to, amount, dst) untuk tracking pergerakan token.
- **daily_volumes** - Statistik volume harian: tanggal, total volume USD, jumlah tx, user unik, rata-rata gas.
- **pool_stats** - Statistik pool: cadangan token, total liquidity, harga, TVL, volume 24h, waktu update terakhir.
- **user_stats** - Statistik per user: jumlah swap, volume USD, liquidity yang pernah diberikan, fee yang didapat, waktu aktif, dsb.

---

## 📝 Langkah 5: Tulis Fungsi Indexing

Edit `src/index.ts`:

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

**Penjelasan Kode:**

1. **Handler Swap (`SimpleDEX:Swap`)**: Menangani event swap pada SimpleDEX. Menyimpan data swap ke tabel swaps serta memperbarui daily volume, statistik user, dan pool stats.
2. **Handler LiquidityAdded (`SimpleDEX:LiquidityAdded`)**: Menangani event penambahan liquidity, mencatat event ke liquidityEvents, dan memperbarui statistik user terkait liquidity.
3. **Handler LiquidityRemoved (`SimpleDEX:LiquidityRemoved`)**: Menangani event pengurangan liquidity, mencatat event ke liquidityEvents, dan memperbarui statistik user terkait liquidity.
4. **Handler Transfer (LP Token & ERC20:Transfer)**: Mencatat perpindahan token baik LP token (SimpleDEX) ataupun token ERC20 (CampusCoin/MockUSDC) ke tabel transfers untuk tracking aktivitas token.
5. **Helper & Updater Functions**:
    - `calculatePriceImpact`: Estimasi price impact swap (sederhana untuk demo).
    - `calculatePoolShare`: Hitungan sederhana share pool user.
    - `updateDailyVolume`: Update statistik volume harian berdasarkan transaksi swap.
    - `calculateVolumeUSD`: Konversi nominal token jadi nilai USD (asumsi harga tetap).
    - `updateUserStats`: Update statistik total swap & volume user.
    - `updateUserLiquidityStats`: Update statistik liquidity provided/removed user.
    - `updatePoolStats`: Update data pool state seperti reserve, total liquidity, price, TVL (placeholder, perlu query kontrak asli jika real).

---

## 🚀 Langkah 7: Mulai Indexing!

### 1. Start Dev Server:

```bash
pnpm dev
```

**Output yang Diharapkan:**

```bash
12:00:00.000 INFO  Connected to database type=pglite
12:00:00.100 INFO  Connected to JSON-RPC chain=liskSepolia
12:00:00.200 INFO  Created database tables...
12:00:00.300 INFO  ✅ Pool state ter-load: 1000.0 CAMP / 2000.0 USDC
12:00:00.400 INFO     Price: 2.0 USDC per CAMP
12:00:00.500 INFO     TVL: $4000.0 USDC
12:00:00.600 INFO  Started backfill indexing...
12:00:00.700 INFO  🔄 Swap: 0x123... - 1000000000000000000 CAMP in / 1800000000 USDC out
12:00:00.800 INFO  💧 Liquidity Added: 0x456... - 50000000000000000000 CAMP + 100000000000 USDC
```

### 2. Monitor Progress:

Ponder akan:

- ✅ Load state awal pool
- ✅ Scan block historis untuk events
- ✅ Process semua Swap & Liquidity events
- ✅ Update pool state real-time
- ✅ Track LP positions
- ✅ Lalu, listen untuk events baru real-time!

---

## 🔍 Langkah 8: Query Data dengan GraphQL

### Query 1: Get Recent Swaps

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

### Query 2: Get Recent Liquidity Events

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

### Query 3: Get Volume Analytics

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

---

## 🧪 Langkah 9: Test Real-Time Indexing

### Lakukan Swap di DEX:

1. **Buka frontend DEX dari Sesi 7** (atau via Remix)
2. **Lakukan swap** CAMP → USDC
3. **Perhatikan logs Ponder:**

```bash
12:05:00.100 INFO  🔄 Swap: 0xYourAddress - 1000000000000000000 CAMP in / 1800000000 USDC out
12:05:00.200 INFO  Indexed block range event_count=1 block_range=[12345,12345]
```

4. **Query GraphQL segera:**

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

**Hasil:** Data langsung muncul! ⚡

---

## ✅ Checklist Verifikasi

Sebelum lanjut ke Bagian 4, verifikasi:

- [ ] ✅ SimpleDEX contract ter-konfigurasi di `ponder.config.ts`
- [ ] ✅ ABI files tersimpan (`SimpleDEXAbi.ts`, `ERC20Abi.ts`)
- [ ] ✅ Schema terdefinisi di `ponder.schema.ts`
- [ ] ✅ Handler swap bekerja (cek logs)
- [ ] ✅ Handler liquidity bekerja
- [ ] ✅ Dev server running tanpa errors
- [ ] ✅ GraphQL playground dapat diakses
- [ ] ✅ Bisa query pool statistics
- [ ] ✅ Bisa query swap events
- [ ] ✅ Bisa query liquidity events
- [ ] ✅ Indexing real-time bekerja (test dengan swap)

**Semua ✅?** Sempurna! Backend indexer DEX siap! 🎉

---

## 🚀 Langkah Selanjutnya

Backend indexer DEX selesai! 🎉

Sekarang kita punya:

- ✅ Pool state ter-track real-time
- ✅ Swap history tersimpan
- ✅ Liquidity events tersimpan
- ✅ LP positions ter-track
- ✅ GraphQL API ready

Di Bagian 4, kita akan:

2. **Koneksi FrontEnd SimpleDEX Sesi 7 ke Ponder GraphQL API**
4. **Tampilkan pool stats, swap feed, price chart**
5. **Tambah user analytics & LP tracking**
6. **Update real-time!**

**[📖 Bagian 4: Integrasi Frontend - DEX Analytics Dashboard →](./04-frontend-integration.md)**

---

**Selamat! Anda sekarang seorang Ponder indexer untuk DEX! 🎊**
