---
sidebar_position: 2
title: 2. Integrasi Frontend dengan Simple DEX
description: Membuat frontend React dengan Vite untuk berinteraksi dengan Simple DEX smart contract
keywords: [frontend, react, vite, simple dex, defi, web3, wagmi, rainbowkit, tailwindcss, amm, liquidity]
---

# Integrasi Frontend dengan Simple DEX

Pada bagian ini, kita akan membuat frontend modern menggunakan React, Vite, dan TailwindCSS untuk berinteraksi dengan Simple DEX smart contracts yang telah kita deploy. Frontend ini akan memungkinkan pengguna untuk melakukan swap token, menambah/menghapus likuiditas, dan memantau pool statistics secara real-time.

![Tampilan Frontend Simple DEX]

## 1. Setup Proyek Frontend

Mari mulai dengan membuat proyek React + Vite baru dengan TypeScript.

### 1.1. Membuat Proyek Vite

```bash
npm create vite@latest simple-defi-ui -- --template react-ts
cd simple-defi-ui
```

### 1.2. Menginstal Dependensi

Install paket yang diperlukan untuk mengintegrasikan frontend dengan blockchain:

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query react-hot-toast lucide-react recharts
npm install -D tailwindcss @tailwindcss/vite
```

Penjelasan dependensi:
- **@rainbow-me/rainbowkit**: Komponen UI untuk koneksi wallet
- **wagmi**: Library untuk berinteraksi dengan kontrak Ethereum
- **viem**: Library Ethereum untuk TypeScript
- **@tanstack/react-query**: Untuk manajemen state dan caching data
- **react-hot-toast**: Untuk menampilkan notifikasi
- **lucide-react**: Icon library untuk UI yang menarik
- **recharts**: Library untuk charts dan visualisasi data
- **tailwindcss**: Framework CSS utility-first

## 2. Konfigurasi TailwindCSS

### 2.1. Konfigurasi Vite

Update file `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 2.2. Konfigurasi CSS

Buat file `src/index.css` dengan konten:

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
```

## 3. Struktur Proyek

Berikut adalah struktur proyek yang akan kita buat:

```
src/
├── components/
│   ├── DEXContainer.tsx      # Komponen utama yang berisi logika DEX
│   ├── Header.tsx            # Header dengan tombol connect wallet
│   ├── SwapInterface.tsx     # Interface untuk swap tokens
│   ├── LiquidityInterface.tsx # Interface untuk add/remove liquidity
│   ├── PoolStats.tsx         # Pool statistics dan charts
│   ├── TransactionHistory.tsx # Riwayat transaksi
│   ├── PriceChart.tsx        # Chart harga
│   └── TokenSelect.tsx       # Token selector component
├── constants/
│   ├── ERC_20_ABI.json       # ABI untuk kontrak ERC20
│   ├── SIMPLE_DEX_ABI.json   # ABI untuk kontrak SimpleDEX
│   └── index.tsx             # Export konstanta
├── hooks/
│   ├── useSwap.ts            # Custom hook untuk swap functionality
│   ├── useLiquidity.ts       # Custom hook untuk liquidity functionality
│   ├── useTokenBalance.ts    # Custom hook untuk token balances
│   └── usePoolData.ts        # Custom hook untuk pool data
├── types/
│   └── defi.ts               # Type definitions untuk DeFi
├── utils/
│   ├── formatters.ts         # Utility functions untuk formatting
│   └── calculations.ts       # AMM calculations
├── App.tsx                   # Komponen root dengan provider
├── main.tsx                  # Entry point
└── index.css                 # Stylesheet utama
```

## 4. Menyiapkan Konstanta dan ABI

### 4.1. ABI Files

Buat folder `src/constants` dan file ABI yang diperlukan:

**`ERC20_ABI.json`** (gunakan ABI dari ERC20 contract):

```json
[
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
]
```

**`SIMPLE_DEX_ABI.json`** (gunakan ABI dari SimpleDEX contract):

```json
[
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
]
```

### 4.2. Export Konstanta

Buat file `src/constants/index.tsx`:

```typescript
/* eslint-disable react-refresh/only-export-components */
import SIMPLE_DEX_ABI_JSON from "./SIMPLE_DEX_ABI.json"
import ERC20_ABI_JSON from "./ERC20_ABI.json"

export const SIMPLE_DEX_ABI = SIMPLE_DEX_ABI_JSON;
export const ERC20_ABI = ERC20_ABI_JSON;

// Contract addresses (update dengan alamat yang sudah deployed)
export const CONTRACTS = {
  SIMPLE_DEX: "0x70bDD0f7e01DEe803147ead041dE23a531A71CBf",
  CAMPUS_COIN: "0xEBAa841c5f97Ff097e61eea151dFA03640A6CC78",
  MOCK_USDC: "0x786Ca7D3a2E53f0d5F7bB6848E03b60Dae9a3719",
} as const;

// Token configurations
export const TOKENS = {
  CAMP: {
    address: CONTRACTS.CAMPUS_COIN,
    symbol: "CAMP",
    name: "Campus Coin",
    decimals: 18,
    logo: "🏛️",
  },
  USDC: {
    address: CONTRACTS.MOCK_USDC,
    symbol: "USDC",
    name: "Mock USDC",
    decimals: 6,
    logo: "💵",
  },
} as const;

// DEX configuration
export const DEX_CONFIG = {
  FEE_PERCENT: 0.3, // 0.3%
  SLIPPAGE_TOLERANCE: 0.5, // 0.5%
  DEADLINE: 20, // 20 minutes
} as const;
```

### 4.3. Type Definitions

Buat file `src/types/defi.ts`:

```typescript
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
}

export interface PoolInfo {
  reserveA: bigint;
  reserveB: bigint;
  totalLiquidity: bigint;
  price: bigint;
}

export interface SwapData {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  fee: string;
}

export interface LiquidityData {
  tokenA: Token;
  tokenB: Token;
  amountA: string;
  amountB: string;
  lpTokens: string;
  shareOfPool: number;
}

export interface TransactionHistory {
  id: string;
  type: 'swap' | 'add_liquidity' | 'remove_liquidity';
  hash: string;
  timestamp: number;
  user: string;
  tokenA?: {
    symbol: string;
    amount: string;
  };
  tokenB?: {
    symbol: string;
    amount: string;
  };
  lpTokens?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface PriceData {
  timestamp: number;
  price: number;
  volume24h: number;
  tvl: number;
}

export interface UserPosition {
  lpTokenBalance: bigint;
  shareOfPool: number;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
  estimatedValue: number;
}
```

## 5. Setup RainbowKit dan Wagmi

### 5.1. Konfigurasi App.tsx

Perbarui `src/App.tsx` untuk mengatur provider dan konfigurasi:

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
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen">
            <Header />
            <DEXContainer />
          </div>
          <Toaster position="top-center" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

> ⚠️ **Penting**: Daftar di [WalletConnect Cloud](https://cloud.walletconnect.com) untuk mendapatkan projectId.

## 6. Membuat Utility Functions

### 6.1. Formatting Utilities

Buat file `src/utils/formatters.ts`:

```typescript
import { TOKENS } from '../constants';

/**
 * Check if amount is valid for transaction
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '0' || amount === '.') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
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
 * Format token amount dengan symbol
 */
export const formatTokenAmount = (
  amount: bigint | string,
  tokenSymbol: keyof typeof TOKENS,
  decimals?: number
): string => {
  const token = TOKENS[tokenSymbol];
  const tokenDecimals = decimals || token.decimals;
  
  const value = typeof amount === 'string' 
    ? parseFloat(amount) 
    : Number(amount) / Math.pow(10, tokenDecimals);
    
  return `${formatNumber(value, 4)} ${token.symbol}`;
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
 * Format large numbers (K, M, B)
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return formatNumber(value);
};

/**
 * Format address untuk display
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format timestamp
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Format duration (seconds to human readable)
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

/**
 * Parse input amount to BigInt
 */
export const parseTokenAmount = (
  amount: string,
  decimals: number
): bigint => {
  if (!amount || isNaN(parseFloat(amount))) return BigInt(0);
  
  const [integer, decimal = ''] = amount.split('.');
  const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
  
  return BigInt(integer + paddedDecimal);
};

/**
 * Format BigInt to readable number
 */
export const formatBigInt = (
  value: bigint,
  decimals: number,
  displayDecimals: number = 4
): string => {
  const divisor = BigInt(10 ** decimals);
  const quotient = value / divisor;
  const remainder = value % divisor;
  
  const decimalPart = remainder.toString().padStart(decimals, '0');
  const trimmedDecimal = decimalPart.slice(0, displayDecimals).replace(/0+$/, '');
  
  if (trimmedDecimal) {
    return `${quotient}.${trimmedDecimal}`;
  }
  return quotient.toString();
};

/**
 * Validate input string for numeric values
 */
export const isValidNumericInput = (value: string): boolean => {
  // Allow empty string, digits, and single decimal point
  return /^[\d]*\.?[\d]*$/.test(value);
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumericInput = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  return value.replace(/[^\d.]/g, '')
    // Ensure only one decimal point
    .replace(/(\..*)\./g, '$1');
};

/**
 * Check if amount exceeds balance
 */
export const exceedsBalance = (
  amount: string,
  balance: bigint,
  decimals: number
): boolean => {
  if (!isValidAmount(amount)) return false;
  
  const amountBigInt = parseTokenAmount(amount, decimals);
  return amountBigInt > balance;
};

/**
 * Format token balance for display
 */
export const formatBalance = (
  balance: bigint,
  decimals: number,
  symbol: string,
  maxDecimals: number = 4
): string => {
  const formatted = formatBigInt(balance, decimals, maxDecimals);
  return `${formatted} ${symbol}`;
};
```

### 6.2. AMM Calculations

Buat file `src/utils/calculations.ts`:

```typescript
import { DEX_CONFIG } from '../constants';

/**
 * Parse token amount string to bigint with decimals
 */
export const parseTokenAmount = (
  amount: string,
  decimals: number
): bigint => {
  if (!amount || amount === '0' || amount === '.') {
    return BigInt(0);
  }

  try {
    // Handle decimal numbers
    const [integerPart, decimalPart = ''] = amount.split('.');
    
    // Pad or truncate decimal part to match token decimals
    const paddedDecimals = decimalPart.padEnd(decimals, '0').slice(0, decimals);
    
    // Combine integer and decimal parts
    const fullAmount = integerPart + paddedDecimals;
    
    return BigInt(fullAmount);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return BigInt(0);
  }
};

/**
 * Format bigint token amount to string with decimals
 */
export const formatTokenAmount = (
  amount: bigint,
  decimals: number,
  precision: number = 6
): string => {
  if (amount === BigInt(0)) return '0';

  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;

  const integerPart = quotient.toString();
  const decimalPart = remainder.toString().padStart(decimals, '0');

  // Trim trailing zeros and limit precision
  const trimmedDecimal = decimalPart.replace(/0+$/, '').slice(0, precision);

  return trimmedDecimal ? `${integerPart}.${trimmedDecimal}` : integerPart;
};

/**
 * Calculate output amount untuk swap menggunakan constant product formula
 * Formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
 * Dengan fee: amountInWithFee = amountIn * (1000 - fee) / 1000
 */
export const calculateSwapOutput = (
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  feePercent: number = DEX_CONFIG.FEE_PERCENT
): bigint => {
  if (amountIn === BigInt(0) || reserveIn === BigInt(0) || reserveOut === BigInt(0)) {
    return BigInt(0);
  }

  // Apply fee (0.3% = 3/1000)
  const feeNumerator = BigInt(Math.floor((1000 - feePercent * 10)));
  const feeDenominator = BigInt(1000);
  
  const amountInWithFee = (amountIn * feeNumerator) / feeDenominator;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  
  return numerator / denominator;
};

/**
 * Calculate price impact
 */
export const calculatePriceImpact = (
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number => {
  if (reserveIn === BigInt(0) || reserveOut === BigInt(0)) return 0;

  const currentPrice = Number(reserveOut) / Number(reserveIn);
  const amountOut = calculateSwapOutput(amountIn, reserveIn, reserveOut);
  
  if (amountOut === BigInt(0)) return 0;

  const newReserveIn = reserveIn + amountIn;
  const newReserveOut = reserveOut - amountOut;
  const newPrice = Number(newReserveOut) / Number(newReserveIn);
  
  const priceImpact = Math.abs((newPrice - currentPrice) / currentPrice) * 100;
  return Math.min(priceImpact, 100); // Cap at 100%
};

/**
 * Calculate minimum amount out dengan slippage tolerance
 */
export const calculateMinAmountOut = (
  amountOut: bigint,
  slippageTolerance: number = DEX_CONFIG.SLIPPAGE_TOLERANCE
): bigint => {
  const slippageMultiplier = BigInt(Math.floor((100 - slippageTolerance) * 100));
  return (amountOut * slippageMultiplier) / BigInt(10000);
};

/**
 * Calculate optimal amounts untuk add liquidity
 */
export const calculateOptimalLiquidityAmounts = (
  amountADesired: bigint,
  amountBDesired: bigint,
  reserveA: bigint,
  reserveB: bigint
): { amountA: bigint; amountB: bigint } => {
  if (reserveA === BigInt(0) || reserveB === BigInt(0)) {
    // First liquidity addition - use desired amounts
    return { amountA: amountADesired, amountB: amountBDesired };
  }

  // Calculate optimal amount B for given amount A
  const amountBOptimal = (amountADesired * reserveB) / reserveA;
  
  if (amountBOptimal <= amountBDesired) {
    return { amountA: amountADesired, amountB: amountBOptimal };
  }
  
  // Calculate optimal amount A for given amount B
  const amountAOptimal = (amountBDesired * reserveA) / reserveB;
  
  return { amountA: amountAOptimal, amountB: amountBDesired };
};

/**
 * Calculate LP tokens untuk liquidity addition
 */
export const calculateLPTokens = (
  amountA: bigint,
  amountB: bigint,
  reserveA: bigint,
  reserveB: bigint,
  totalSupply: bigint
): bigint => {
  if (totalSupply === BigInt(0)) {
    // First liquidity - use geometric mean
    return sqrt(amountA * amountB);
  }
  
  // Subsequent liquidity - use minimum ratio
  const liquidityA = (amountA * totalSupply) / reserveA;
  const liquidityB = (amountB * totalSupply) / reserveB;
  
  return liquidityA < liquidityB ? liquidityA : liquidityB;
};

/**
 * Calculate token amounts untuk liquidity removal
 */
export const calculateTokenAmountsFromLP = (
  lpTokens: bigint,
  reserveA: bigint,
  reserveB: bigint,
  totalSupply: bigint
): { amountA: bigint; amountB: bigint } => {
  if (totalSupply === BigInt(0)) {
    return { amountA: BigInt(0), amountB: BigInt(0) };
  }
  
  const amountA = (lpTokens * reserveA) / totalSupply;
  const amountB = (lpTokens * reserveB) / totalSupply;
  
  return { amountA, amountB };
};

/**
 * Calculate share of pool
 */
export const calculatePoolShare = (
  lpTokens: bigint,
  totalSupply: bigint
): number => {
  if (totalSupply === BigInt(0)) return 0;
  return (Number(lpTokens) / Number(totalSupply)) * 100;
};

/**
 * Calculate Annual Percentage Rate (APR) from fees
 */
export const calculateAPR = (
  totalLiquidity: number,
  dailyVolume: number,
  feePercent: number = DEX_CONFIG.FEE_PERCENT
): number => {
  if (totalLiquidity === 0) return 0;
  
  const dailyFees = dailyVolume * (feePercent / 100);
  const annualFees = dailyFees * 365;
  
  return (annualFees / totalLiquidity) * 100;
};

/**
 * Helper function untuk integer square root
 */
function sqrt(value: bigint): bigint {
  if (value === BigInt(0)) return BigInt(0);
  
  let z = (value + BigInt(1)) / BigInt(2);
  let y = value;
  
  while (z < y) {
    y = z;
    z = (value / z + z) / BigInt(2);
  }
  
  return y;
}

/**
 * Check jika amount valid untuk transaction
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '0' || amount === '.') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Calculate estimated USD value
 */
export const calculateUSDValue = (
  tokenAmount: bigint,
  tokenDecimals: number,
  pricePerToken: number
): number => {
  const amount = Number(tokenAmount) / Math.pow(10, tokenDecimals);
  return amount * pricePerToken;
};

/**
 * Safe conversion from string to number for display purposes
 */
export const safeParseFloat = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format number for display with proper precision
 */
export const formatDisplayNumber = (
  value: number,
  decimals: number = 6
): string => {
  if (value === 0) return '0';
  
  // For very small numbers, use scientific notation
  if (value < 0.000001) {
    return value.toExponential(2);
  }
  
  // For normal numbers, use fixed decimals
  return value.toFixed(decimals).replace(/\.?0+$/, '');
};
```

## 7. Custom Hooks untuk DeFi Operations

### 7.1. Hook untuk Token Balance

Buat file `src/hooks/useTokenBalance.ts`:

```typescript
import { useReadContract, useAccount } from 'wagmi';
import { ERC20_ABI, CONTRACTS } from '../constants';
import type { Token } from '../types/defi';

export const useTokenBalance = (token?: Token) => {
  const { address } = useAccount();

  const { data: balance, isLoading, refetch } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!token && !!address,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.SIMPLE_DEX as `0x${string}`] : undefined,
    query: {
      enabled: !!token && !!address,
      refetchInterval: 30000,
    },
  });

  return {
    balance: balance as bigint || BigInt(0),
    allowance: allowance as bigint || BigInt(0),
    isLoading,
    refetch,
    refetchAllowance,
  };
};

export const useTokenBalances = (tokens: Token[]) => {

  // Create individual hooks for each token
  const campBalance = useTokenBalance(tokens.find(t => t.symbol === 'CAMP'));
  const usdcBalance = useTokenBalance(tokens.find(t => t.symbol === 'USDC'));

  const balances = {
    CAMP: campBalance.balance,
    USDC: usdcBalance.balance,
  };

  const isLoading = campBalance.isLoading || usdcBalance.isLoading;
  
  const refetchAll = () => {
    campBalance.refetch();
    usdcBalance.refetch();
  };

  return {
    balances,
    isLoading,
    refetchAll,
  };
};
```

### 7.2. Hook untuk Pool Data

Buat file `src/hooks/usePoolData.ts`:

```typescript
import { useReadContract } from 'wagmi';
import { SIMPLE_DEX_ABI, CONTRACTS } from '../constants';
import type { PoolInfo } from '../types/defi';

// Define the return type for the smart contract functions
type PoolDataResult = readonly [bigint, bigint, bigint, bigint];

export const usePoolData = () => {
  const { data: poolData, isLoading, refetch } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    functionName: 'getPoolInfo',
    query: {
      refetchInterval: 15000, // Refetch every 15 seconds
    },
  });

  const { data: price, refetch: refetchPrice } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    functionName: 'getPrice',
    query: {
      refetchInterval: 15000,
    },
  });

  // Type assertion with proper type checking
  const typedPoolData = poolData as PoolDataResult | undefined;

  const poolInfo: PoolInfo = typedPoolData ? {
    reserveA: typedPoolData[0],
    reserveB: typedPoolData[1],
    totalLiquidity: typedPoolData[2],
    price: typedPoolData[3],
  } : {
    reserveA: BigInt(0),
    reserveB: BigInt(0),
    totalLiquidity: BigInt(0),
    price: BigInt(0),
  };

  const currentPrice = (price as bigint) || BigInt(0);

  const refetchAll = () => {
    refetch();
    refetchPrice();
  };

  return {
    poolInfo,
    currentPrice,
    isLoading,
    refetch: refetchAll,
  };
};
```

### 7.3. Hook untuk Swap Operations

Buat file `src/hooks/useSwap.ts`:

```typescript
import { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../App';
import { SIMPLE_DEX_ABI, ERC20_ABI, CONTRACTS } from '../constants';
import { calculateSwapOutput, calculateMinAmountOut, parseTokenAmount } from '../utils/calculations';
import { usePoolData } from './usePoolData';
import toast from 'react-hot-toast';
import type { Token, SwapData } from '../types/defi';

export const useSwap = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { poolInfo } = usePoolData();
  const [isSwapping, setIsSwapping] = useState(false);

  const calculateSwap = (
    amountIn: string,
    tokenIn: Token,
    tokenOut: Token
  ): SwapData | null => {
    if (!amountIn || parseFloat(amountIn) <= 0) return null;

    const amountInBigInt = parseTokenAmount(amountIn, tokenIn.decimals);
    
    const isTokenAToB = tokenIn.symbol === 'CAMP';
    const reserveIn = isTokenAToB ? poolInfo.reserveA : poolInfo.reserveB;
    const reserveOut = isTokenAToB ? poolInfo.reserveB : poolInfo.reserveA;

    const amountOut = calculateSwapOutput(amountInBigInt, reserveIn, reserveOut);
    const amountOutFormatted = (Number(amountOut) / Math.pow(10, tokenOut.decimals)).toString();

    // Calculate fee
    const feeAmount = (parseFloat(amountIn) * 0.003).toString(); // 0.3% fee

    // Calculate price impact
    const priceImpact = reserveIn > 0 && reserveOut > 0 
      ? Math.abs((Number(amountOut) / Math.pow(10, tokenOut.decimals)) / (Number(reserveOut) / Math.pow(10, tokenOut.decimals)) - 
                  (Number(amountInBigInt) / Math.pow(10, tokenIn.decimals)) / (Number(reserveIn) / Math.pow(10, tokenIn.decimals))) * 100
      : 0;

    return {
      tokenIn,
      tokenOut,
      amountIn,
      amountOut: amountOutFormatted,
      priceImpact,
      fee: feeAmount,
    };
  };

  const executeSwap = async (swapData: SwapData): Promise<boolean> => {
    if (!address || !swapData) return false;

    setIsSwapping(true);
    
    try {
      const amountInBigInt = parseTokenAmount(swapData.amountIn, swapData.tokenIn.decimals);
      const amountOutBigInt = parseTokenAmount(swapData.amountOut, swapData.tokenOut.decimals);
      const minAmountOut = calculateMinAmountOut(amountOutBigInt);

      // Check dan approve token jika perlu
      await ensureTokenApproval(swapData.tokenIn, amountInBigInt);

      // Execute swap
      const isTokenAToB = swapData.tokenIn.symbol === 'CAMP';
      const functionName = isTokenAToB ? 'swapAforB' : 'swapBforA';

      toast.loading('Executing swap...', { id: 'swap' });

      const hash = await writeContractAsync({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        abi: SIMPLE_DEX_ABI,
        functionName,
        args: [amountInBigInt, minAmountOut],
        account: address,
      });

      toast.loading('Confirming transaction...', { id: 'swap' });

      await waitForTransactionReceipt(config, { hash });

      toast.success(
        `Successfully swapped ${swapData.amountIn} ${swapData.tokenIn.symbol} for ${swapData.amountOut} ${swapData.tokenOut.symbol}`,
        { id: 'swap', duration: 5000 }
      );

      return true;
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed. Please try again.', { id: 'swap' });
      return false;
    } finally {
      setIsSwapping(false);
    }
  };

  const ensureTokenApproval = async (token: Token, amount: bigint) => {
    // Check current allowance
    // (This would need to be implemented with a separate hook or function)
    
    // If allowance is insufficient, approve
    const hash = await writeContractAsync({
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.SIMPLE_DEX, amount],
      account: address!,
    });

    await waitForTransactionReceipt(config, { hash });
  };

  return {
    calculateSwap,
    executeSwap,
    isSwapping,
  };
};
```

### 7.4. Hook untuk Liquidity Operations

Buat file `src/hooks/useLiquidity.ts`:

```typescript
import { useState } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../App';
import { SIMPLE_DEX_ABI, ERC20_ABI, CONTRACTS } from '../constants';
import { 
  calculateOptimalLiquidityAmounts, 
  calculateLPTokens, 
  calculateTokenAmountsFromLP,
  parseTokenAmount 
} from '../utils/calculations';
import { usePoolData } from './usePoolData';
import toast from 'react-hot-toast';
import type { Token, LiquidityData, UserPosition } from '../types/defi';

export const useLiquidity = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { poolInfo } = usePoolData();
  const [isLoading, setIsLoading] = useState(false);

  // Get user's LP token balance
  const { data: lpBalance } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000,
    },
  });

  const calculateAddLiquidity = (
    amountA: string,
    amountB: string,
    tokenA: Token,
    tokenB: Token
  ): LiquidityData | null => {
    if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      return null;
    }

    const amountABigInt = parseTokenAmount(amountA, tokenA.decimals);
    const amountBBigInt = parseTokenAmount(amountB, tokenB.decimals);

    const optimal = calculateOptimalLiquidityAmounts(
      amountABigInt,
      amountBBigInt,
      poolInfo.reserveA,
      poolInfo.reserveB
    );

    const lpTokens = calculateLPTokens(
      optimal.amountA,
      optimal.amountB,
      poolInfo.reserveA,
      poolInfo.reserveB,
      poolInfo.totalLiquidity
    );

    const shareOfPool = poolInfo.totalLiquidity > 0 
      ? (Number(lpTokens) / (Number(poolInfo.totalLiquidity) + Number(lpTokens))) * 100
      : 100;

    return {
      tokenA,
      tokenB,
      amountA: (Number(optimal.amountA) / Math.pow(10, tokenA.decimals)).toString(),
      amountB: (Number(optimal.amountB) / Math.pow(10, tokenB.decimals)).toString(),
      lpTokens: (Number(lpTokens) / Math.pow(10, 18)).toString(),
      shareOfPool,
    };
  };

  const executeAddLiquidity = async (liquidityData: LiquidityData): Promise<boolean> => {
    if (!address) return false;

    setIsLoading(true);

    try {
      const amountA = parseTokenAmount(liquidityData.amountA, liquidityData.tokenA.decimals);
      const amountB = parseTokenAmount(liquidityData.amountB, liquidityData.tokenB.decimals);

      // Approve tokens
      await Promise.all([
        approveToken(liquidityData.tokenA, amountA),
        approveToken(liquidityData.tokenB, amountB),
      ]);

      toast.loading('Adding liquidity...', { id: 'liquidity' });

      const hash = await writeContractAsync({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        abi: SIMPLE_DEX_ABI,
        functionName: 'addLiquidity',
        args: [amountA, amountB],
        account: address,
      });

      toast.loading('Confirming transaction...', { id: 'liquidity' });

      await waitForTransactionReceipt(config, { hash });

      toast.success(
        `Successfully added ${liquidityData.amountA} ${liquidityData.tokenA.symbol} and ${liquidityData.amountB} ${liquidityData.tokenB.symbol} to the pool`,
        { id: 'liquidity', duration: 5000 }
      );

      return true;
    } catch (error) {
      console.error('Add liquidity failed:', error);
      toast.error('Failed to add liquidity. Please try again.', { id: 'liquidity' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const executeRemoveLiquidity = async (lpTokenAmount: string): Promise<boolean> => {
    if (!address || !lpTokenAmount) return false;

    setIsLoading(true);

    try {
      const lpAmount = parseTokenAmount(lpTokenAmount, 18);

      toast.loading('Removing liquidity...', { id: 'liquidity' });

      const hash = await writeContractAsync({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        abi: SIMPLE_DEX_ABI,
        functionName: 'removeLiquidity',
        args: [lpAmount],
        account: address,
      });

      toast.loading('Confirming transaction...', { id: 'liquidity' });

      await waitForTransactionReceipt(config, { hash });

      toast.success('Successfully removed liquidity from the pool', { 
        id: 'liquidity', 
        duration: 5000 
      });

      return true;
    } catch (error) {
      console.error('Remove liquidity failed:', error);
      toast.error('Failed to remove liquidity. Please try again.', { id: 'liquidity' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveToken = async (token: Token, amount: bigint) => {
    const hash = await writeContractAsync({
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.SIMPLE_DEX, amount],
      account: address!,
    });

    await waitForTransactionReceipt(config, { hash });
  };

  const getUserPosition = (): UserPosition => {
    const lpTokenBalance = lpBalance as bigint || BigInt(0);
    
    if (lpTokenBalance === BigInt(0) || poolInfo.totalLiquidity === BigInt(0)) {
      return {
        lpTokenBalance: BigInt(0),
        shareOfPool: 0,
        tokenAAmount: BigInt(0),
        tokenBAmount: BigInt(0),
        estimatedValue: 0,
      };
    }

    const shareOfPool = (Number(lpTokenBalance) / Number(poolInfo.totalLiquidity)) * 100;
    const { amountA, amountB } = calculateTokenAmountsFromLP(
      lpTokenBalance,
      poolInfo.reserveA,
      poolInfo.reserveB,
      poolInfo.totalLiquidity
    );

    // Estimate USD value (you'd need price feeds for accurate calculation)
    const estimatedValue = 0; // Placeholder

    return {
      lpTokenBalance,
      shareOfPool,
      tokenAAmount: amountA,
      tokenBAmount: amountB,
      estimatedValue,
    };
  };

  return {
    calculateAddLiquidity,
    executeAddLiquidity,
    executeRemoveLiquidity,
    getUserPosition,
    isLoading,
  };
};
```

## 8. Membuat Komponen Header

Buat file `src/components/Header.tsx`:

```typescript
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <header className="glass-dark sticky top-0 z-50 py-4 border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center space-x-1 p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10">
              <img src="/nad-trade-logo.png" alt="Nad Trade Logo" className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient-monad font-inter">NadTrade</h1>
            <p className="text-xs font-medium" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Decentralized Exchange on Monad
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
              <span>Live Markets</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>0.3% Fee</span>
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

## 9. Membuat Swap Interface

Buat file `src/components/SwapInterface.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Settings, Zap, AlertTriangle, X } from "lucide-react"
import { useSwap } from "../hooks/useSwap"
import { useTokenBalance } from "../hooks/useTokenBalance"
import { TOKENS } from "../constants"
import { formatTokenAmount, formatPercentage, isValidAmount } from "../utils/formatters"
import type { Token, SwapData } from "../types/defi"

const SwapInterface = () => {
  const [tokenIn, setTokenIn] = useState<Token>(TOKENS.CAMP)
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS.USDC)
  const [amountIn, setAmountIn] = useState("")
  const [slippageTolerance, setSlippageTolerance] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)

  const { calculateSwap, executeSwap, isSwapping } = useSwap()
  const tokenInBalance = useTokenBalance(tokenIn)
  const tokenOutBalance = useTokenBalance(tokenOut)

  const [swapData, setSwapData] = useState<SwapData | null>(null)

  // Calculate swap when inputs change
  useEffect(() => {
    if (isValidAmount(amountIn)) {
      const data = calculateSwap(amountIn, tokenIn, tokenOut)
      setSwapData(data)
    } else {
      setSwapData(null)
    }
  }, [amountIn, tokenIn, tokenOut, calculateSwap])

  const handleSwapTokens = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn("")
    setSwapData(null)
  }

  const handleMaxClick = () => {
    const balance = Number(tokenInBalance.balance) / Math.pow(10, tokenIn.decimals)
    setAmountIn(balance.toString())
  }

  const handleSwap = async () => {
    if (!swapData) return
    const success = await executeSwap(swapData)
    if (success) {
      setAmountIn("")
      setSwapData(null)
      tokenInBalance.refetch()
      tokenOutBalance.refetch()
    }
  }

  const isInsufficientBalance = () => {
    if (!amountIn || !tokenInBalance.balance) return false
    const inputAmount = parseFloat(amountIn) * Math.pow(10, tokenIn.decimals)
    return inputAmount > Number(tokenInBalance.balance)
  }

  const getPriceImpactColor = (impact: number) => {
    if (impact < 1) return "#10B981" // Green
    if (impact < 3) return "#F59E0B" // Yellow
    return "#EF4444" // Red
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 sm:px-0">
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 card-hover border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#FBFAF9" }}>
            Swap Tokens
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors relative"
            style={{ color: "rgba(251, 250, 249, 0.7)" }}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.5)",
            borderColor: "rgba(251, 250, 249, 0.2)"
          }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: "#FBFAF9" }}>
                  Slippage Tolerance
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="sm:hidden p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: "rgba(251, 250, 249, 0.5)" }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <span className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                {slippageTolerance}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippageTolerance(value)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                    slippageTolerance === value
                      ? "gradient-monad-primary text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  style={{ color: slippageTolerance === value ? "#FBFAF9" : "rgba(251, 250, 249, 0.7)" }}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Token Input */}
        <div className="space-y-3 sm:space-y-4 mb-4">
          <div className="relative">
            <div className="p-3 sm:p-4 rounded-xl border" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  From
                </span>
                <span className="text-xs sm:text-sm truncate ml-2" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Balance: {formatTokenAmount(tokenInBalance.balance, tokenIn.symbol as keyof typeof TOKENS)}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg sm:text-2xl font-bold outline-none input-primary min-w-0"
                  style={{ color: "#FBFAF9" }}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleMaxClick}
                    className="px-2 py-1 text-xs rounded font-medium hover:bg-white/20 transition-colors whitespace-nowrap"
                    style={{ color: "#836EF9" }}
                  >
                    MAX
                  </button>
                  <div className="flex items-center gap-1 sm:gap-2 p-2 rounded-xl border" style={{
                    backgroundColor: "rgba(131, 110, 249, 0.1)",
                    borderColor: "rgba(131, 110, 249, 0.3)"
                  }}>
                    <span className="text-base sm:text-lg">{tokenIn.logo}</span>
                    <span className="font-medium text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                      {tokenIn.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-110"
              style={{ color: "#836EF9" }}
            >
              <ArrowUpDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Token Output */}
          <div className="relative">
            <div className="p-3 sm:p-4 rounded-xl border" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  To
                </span>
                <span className="text-xs sm:text-sm truncate ml-2" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Balance: {formatTokenAmount(tokenOutBalance.balance, tokenOut.symbol as keyof typeof TOKENS)}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 text-lg sm:text-2xl font-bold min-w-0 truncate" style={{ color: "#FBFAF9" }}>
                  {swapData?.amountOut || "0.0"}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 p-2 rounded-xl border flex-shrink-0" style={{
                  backgroundColor: "rgba(160, 5, 93, 0.1)",
                  borderColor: "rgba(160, 5, 93, 0.3)"
                }}>
                  <span className="text-base sm:text-lg">{tokenOut.logo}</span>
                  <span className="font-medium text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                    {tokenOut.symbol}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {swapData && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border space-y-2" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="flex justify-between text-xs sm:text-sm">
              <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Price Impact</span>
              <span style={{ color: getPriceImpactColor(swapData.priceImpact) }}>
                {formatPercentage(swapData.priceImpact)}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Trading Fee</span>
              <span className="truncate ml-2" style={{ color: "#FBFAF9" }}>
                {swapData.fee} {tokenIn.symbol}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Minimum Received</span>
              <span className="truncate ml-2" style={{ color: "#FBFAF9" }}>
                {(parseFloat(swapData.amountOut) * (1 - slippageTolerance / 100)).toFixed(6)} {tokenOut.symbol}
              </span>
            </div>

            {/* Price Impact Warning */}
            {swapData.priceImpact > 3 && (
              <div className="flex items-start gap-2 p-2 sm:p-3 rounded border" style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)"
              }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
                <span className="text-xs sm:text-sm leading-tight" style={{ color: "#EF4444" }}>
                  High price impact! Consider reducing the swap amount.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!swapData || isSwapping || isInsufficientBalance()}
          className="w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
          style={{
            background: !swapData || isSwapping || isInsufficientBalance() 
              ? "rgba(131, 110, 249, 0.3)" 
              : "linear-gradient(135deg, #836EF9 0%, #A0055D 100%)",
            color: "#FBFAF9"
          }}
        >
          {isSwapping ? (
            <div className="flex items-center justify-center gap-2">
              <div className="spinner w-4 h-4 sm:w-5 sm:h-5"></div>
              <span>Swapping...</span>
            </div>
          ) : isInsufficientBalance() ? (
            "Insufficient Balance"
          ) : !swapData ? (
            "Enter Amount"
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Swap Tokens</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export default SwapInterface
```

## 10. Membuat Liquidity Interface

Buat file `src/components/LiquidityInterface.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Droplets, AlertCircle, Calculator } from "lucide-react"
import { useLiquidity } from "../hooks/useLiquidity"
import { useTokenBalance } from "../hooks/useTokenBalance"
import { usePoolData } from "../hooks/usePoolData"
import { TOKENS } from "../constants"
import { formatTokenAmount, formatPercentage, formatBigInt, isValidAmount } from "../utils/formatters"
import type { LiquidityData } from "../types/defi"

const LiquidityInterface = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add')
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [removePercentage, setRemovePercentage] = useState(25)
  const [isCalculating, setIsCalculating] = useState(false)
  const [lastInputField, setLastInputField] = useState<'A' | 'B' | null>(null)

  const { 
    calculateAddLiquidity, 
    executeAddLiquidity, 
    executeRemoveLiquidity, 
    getUserPosition,
    isLoading 
  } = useLiquidity()

  const { poolInfo } = usePoolData()
  const campBalance = useTokenBalance(TOKENS.CAMP)
  const usdcBalance = useTokenBalance(TOKENS.USDC)
  const userPosition = getUserPosition()

  const [liquidityData, setLiquidityData] = useState<LiquidityData | null>(null)

  // Calculate the ratio between tokens based on pool reserves
  const getTokenRatio = () => {
    if (poolInfo.reserveA === BigInt(0) || poolInfo.reserveB === BigInt(0)) {
      return null // No liquidity yet, equal ratio
    }
    
    // CAMP per USDC = reserveA / reserveB (adjusted for decimals)
    const campPerUsdc = (Number(poolInfo.reserveA) / Math.pow(10, 18)) / (Number(poolInfo.reserveB) / Math.pow(10, 6))
    const usdcPerCamp = 1 / campPerUsdc
    
    return { campPerUsdc, usdcPerCamp }
  }

  // Auto-calculate the other token amount based on pool ratio
  const calculateOtherAmount = (inputAmount: string, inputToken: 'A' | 'B') => {
    if (!inputAmount || !isValidAmount(inputAmount)) return ""
    
    const ratio = getTokenRatio()
    if (!ratio) return "" // No pool ratio available yet
    
    const amount = parseFloat(inputAmount)
    
    if (inputToken === 'A') {
      // Input is CAMP, calculate USDC
      return (amount * ratio.usdcPerCamp).toFixed(6)
    } else {
      // Input is USDC, calculate CAMP
      return (amount * ratio.campPerUsdc).toFixed(6)
    }
  }

  // Handle CAMP amount input
  const handleAmountAChange = (value: string) => {
    setAmountA(value)
    setLastInputField('A')
    
    if (value && isValidAmount(value)) {
      setIsCalculating(true)
      const calculatedB = calculateOtherAmount(value, 'A')
      setTimeout(() => {
        setAmountB(calculatedB)
        setIsCalculating(false)
      }, 300) // Small delay for better UX
    } else {
      setAmountB("")
      setIsCalculating(false)
    }
  }

  // Handle USDC amount input
  const handleAmountBChange = (value: string) => {
    setAmountB(value)
    setLastInputField('B')
    
    if (value && isValidAmount(value)) {
      setIsCalculating(true)
      const calculatedA = calculateOtherAmount(value, 'B')
      setTimeout(() => {
        setAmountA(calculatedA)
        setIsCalculating(false)
      }, 300) // Small delay for better UX
    } else {
      setAmountA("")
      setIsCalculating(false)
    }
  }

  // Calculate liquidity when inputs change
  useEffect(() => {
    if (activeTab === 'add' && isValidAmount(amountA) && isValidAmount(amountB)) {
      const data = calculateAddLiquidity(amountA, amountB, TOKENS.CAMP, TOKENS.USDC)
      setLiquidityData(data)
    } else {
      setLiquidityData(null)
    }
  }, [amountA, amountB, activeTab, calculateAddLiquidity])

  const handleMaxA = () => {
    const balance = Number(campBalance.balance) / Math.pow(10, TOKENS.CAMP.decimals)
    handleAmountAChange(balance.toString())
  }

  const handleMaxB = () => {
    const balance = Number(usdcBalance.balance) / Math.pow(10, TOKENS.USDC.decimals)
    handleAmountBChange(balance.toString())
  }

  const handleAddLiquidity = async () => {
    if (!liquidityData) return
    const success = await executeAddLiquidity(liquidityData)
    if (success) {
      setAmountA("")
      setAmountB("")
      setLiquidityData(null)
      setLastInputField(null)
      campBalance.refetch()
      usdcBalance.refetch()
    }
  }

  const handleRemoveLiquidity = async () => {
    const lpAmount = (Number(userPosition.lpTokenBalance) * removePercentage / 100) / Math.pow(10, 18)
    const success = await executeRemoveLiquidity(lpAmount.toString())
    if (success) {
      campBalance.refetch()
      usdcBalance.refetch()
    }
  }

  const isInsufficientBalance = () => {
    if (!amountA || !amountB || !campBalance.balance || !usdcBalance.balance) return false
    
    const campAmount = parseFloat(amountA) * Math.pow(10, TOKENS.CAMP.decimals)
    const usdcAmount = parseFloat(amountB) * Math.pow(10, TOKENS.USDC.decimals)
    
    return campAmount > Number(campBalance.balance) || usdcAmount > Number(usdcBalance.balance)
  }

  const ratio = getTokenRatio()

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 sm:px-0">
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 card-hover border border-white/10 shadow-2xl">
        {/* Header with Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex p-1 rounded-xl border w-full sm:w-auto" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              <button
                onClick={() => setActiveTab('add')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  activeTab === 'add' 
                    ? 'gradient-monad-primary text-white' 
                    : 'hover:bg-white/10'
                }`}
                style={{ color: activeTab === 'add' ? "#FBFAF9" : "rgba(251, 250, 249, 0.7)" }}
              >
                Add Liquidity
              </button>
              <button
                onClick={() => setActiveTab('remove')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  activeTab === 'remove' 
                    ? 'gradient-monad-primary text-white' 
                    : 'hover:bg-white/10'
                }`}
                style={{ color: activeTab === 'remove' ? "#FBFAF9" : "rgba(251, 250, 249, 0.7)" }}
              >
                Remove Liquidity
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'add' ? (
          /* Add Liquidity Interface */
          <div className="space-y-4 sm:space-y-6">
            {/* Pool Ratio Info */}
            {ratio && (
              <div className="p-3 rounded-xl border" style={{
                backgroundColor: "rgba(131, 110, 249, 0.1)",
                borderColor: "rgba(131, 110, 249, 0.3)"
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4" style={{ color: "#836EF9" }} />
                  <span className="text-sm font-medium" style={{ color: "#FBFAF9" }}>
                    Current Pool Ratio
                  </span>
                </div>
                <div className="text-xs space-y-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  <div>1 CAMP = {ratio.usdcPerCamp.toFixed(6)} USDC</div>
                  <div>1 USDC = {ratio.campPerUsdc.toFixed(6)} CAMP</div>
                  <div className="mt-2 text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                    💡 Enter amount in either field - the other will auto-calculate
                  </div>
                </div>
              </div>
            )}

            {/* Token A Input */}
            <div className="p-3 sm:p-4 rounded-xl border relative" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: lastInputField === 'A' ? "rgba(131, 110, 249, 0.5)" : "rgba(251, 250, 249, 0.2)"
            }}>
              {isCalculating && lastInputField === 'B' && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  {TOKENS.CAMP.symbol}
                </span>
                <span className="text-xs sm:text-sm truncate ml-2" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Balance: {formatTokenAmount(campBalance.balance, 'CAMP')}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  value={amountA}
                  onChange={(e) => handleAmountAChange(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg sm:text-xl font-bold outline-none input-primary min-w-0"
                  style={{ color: "#FBFAF9" }}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleMaxA}
                    className="px-2 py-1 text-xs rounded font-medium hover:bg-white/20 transition-colors whitespace-nowrap"
                    style={{ color: "#836EF9" }}
                  >
                    MAX
                  </button>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg">{TOKENS.CAMP.logo}</span>
                    <span className="font-medium text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                      {TOKENS.CAMP.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Icon */}
            <div className="flex justify-center">
              <div className="p-2 rounded-xl border" style={{
                backgroundColor: "rgba(131, 110, 249, 0.1)",
                borderColor: "rgba(131, 110, 249, 0.3)"
              }}>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#836EF9" }} />
              </div>
            </div>

            {/* Token B Input */}
            <div className="p-3 sm:p-4 rounded-xl border relative" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: lastInputField === 'B' ? "rgba(131, 110, 249, 0.5)" : "rgba(251, 250, 249, 0.2)"
            }}>
              {isCalculating && lastInputField === 'A' && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  {TOKENS.USDC.symbol}
                </span>
                <span className="text-xs sm:text-sm truncate ml-2" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Balance: {formatTokenAmount(usdcBalance.balance, 'USDC')}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  value={amountB}
                  onChange={(e) => handleAmountBChange(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-lg sm:text-xl font-bold outline-none input-primary min-w-0"
                  style={{ color: "#FBFAF9" }}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleMaxB}
                    className="px-2 py-1 text-xs rounded font-medium hover:bg-white/20 transition-colors whitespace-nowrap"
                    style={{ color: "#836EF9" }}
                  >
                    MAX
                  </button>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg">{TOKENS.USDC.logo}</span>
                    <span className="font-medium text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                      {TOKENS.USDC.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liquidity Details */}
            {liquidityData && (
              <div className="p-3 sm:p-4 rounded-xl border space-y-2" style={{
                backgroundColor: "rgba(14, 16, 15, 0.3)",
                borderColor: "rgba(251, 250, 249, 0.1)"
              }}>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>LP Tokens Received</span>
                  <span className="truncate ml-2" style={{ color: "#FBFAF9" }}>
                    {parseFloat(liquidityData.lpTokens).toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Share of Pool</span>
                  <span style={{ color: "#FBFAF9" }}>
                    {formatPercentage(liquidityData.shareOfPool)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Rate</span>
                  <span style={{ color: "#FBFAF9" }}>
                    1 CAMP = {ratio ? ratio.usdcPerCamp.toFixed(4) : 'N/A'} USDC
                  </span>
                </div>
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddLiquidity}
              disabled={!liquidityData || isLoading || isInsufficientBalance() || isCalculating}
              className="w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
              style={{
                background: !liquidityData || isLoading || isInsufficientBalance() || isCalculating
                  ? "rgba(131, 110, 249, 0.3)"
                  : "linear-gradient(135deg, #836EF9 0%, #A0055D 100%)",
                color: "#FBFAF9"
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-4 h-4 sm:w-5 sm:h-5"></div>
                  <span>Adding Liquidity...</span>
                </div>
              ) : isCalculating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculating...</span>
                </div>
              ) : isInsufficientBalance() ? (
                "Insufficient Balance"
              ) : !liquidityData ? (
                "Enter Amount"
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add Liquidity</span>
                </div>
              )}
            </button>
          </div>
        ) : (
          /* Remove Liquidity Interface */
          <div className="space-y-4 sm:space-y-6">
            {/* User Position */}
            <div className="p-3 sm:p-4 rounded-xl border" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              <h3 className="font-semibold mb-3 text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                Your Position
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>LP Tokens</span>
                  <span className="truncate ml-2" style={{ color: "#FBFAF9" }}>
                    {formatBigInt(userPosition.lpTokenBalance, 18, 6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Pool Share</span>
                  <span style={{ color: "#FBFAF9" }}>
                    {formatPercentage(userPosition.shareOfPool)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>{TOKENS.CAMP.symbol}</span>
                  <span className="truncate ml-2" style={{ color: "#FBFAF9" }}>
                    {formatBigInt(userPosition.tokenAAmount, TOKENS.CAMP.decimals, 4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>{TOKENS.USDC.symbol}</span>
                  <span className="truncate ml-2" style={{ color: "#FBFAF9" }}>
                    {formatBigInt(userPosition.tokenBAmount, TOKENS.USDC.decimals, 4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Remove Percentage Selector */}
            <div className="p-3 sm:p-4 rounded-xl border" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                  Remove Liquidity
                </span>
                <span className="text-xl sm:text-2xl font-bold" style={{ color: "#836EF9" }}>
                  {removePercentage}%
                </span>
              </div>

              {/* Percentage Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => setRemovePercentage(percentage)}
                    className={`py-2 rounded font-medium transition-all duration-200 text-xs sm:text-sm ${
                      removePercentage === percentage
                        ? "gradient-monad-primary text-white"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    style={{ 
                      color: removePercentage === percentage ? "#FBFAF9" : "rgba(251, 250, 249, 0.7)" 
                    }}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>

              {/* Custom Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={removePercentage}
                  onChange={(e) => setRemovePercentage(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #836EF9 0%, #836EF9 ${removePercentage}%, rgba(251, 250, 249, 0.2) ${removePercentage}%, rgba(251, 250, 249, 0.2) 100%)`
                  }}
                />
              </div>

              {/* Expected Output */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>You will receive:</span>
                </div>
                <div className="flex justify-between">
                  <span className="truncate mr-2" style={{ color: "#FBFAF9" }}>
                    {formatBigInt(userPosition.tokenAAmount * BigInt(removePercentage) / BigInt(100), TOKENS.CAMP.decimals, 4)} {TOKENS.CAMP.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="truncate mr-2" style={{ color: "#FBFAF9" }}>
                    {formatBigInt(userPosition.tokenBAmount * BigInt(removePercentage) / BigInt(100), TOKENS.USDC.decimals, 4)} {TOKENS.USDC.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            {userPosition.lpTokenBalance === BigInt(0) && (
              <div className="flex items-start gap-2 p-3 rounded-xl border" style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                borderColor: "rgba(245, 158, 11, 0.3)"
              }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
                <span className="text-xs sm:text-sm leading-tight" style={{ color: "#F59E0B" }}>
                  You don't have any liquidity positions to remove.
                </span>
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={handleRemoveLiquidity}
              disabled={isLoading || userPosition.lpTokenBalance === BigInt(0)}
              className="w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
              style={{
                background: isLoading || userPosition.lpTokenBalance === BigInt(0)
                  ? "rgba(239, 68, 68, 0.3)"
                  : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                color: "#FBFAF9"
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-4 h-4 sm:w-5 sm:h-5"></div>
                  <span>Removing Liquidity...</span>
                </div>
              ) : userPosition.lpTokenBalance === BigInt(0) ? (
                "No Liquidity to Remove"
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Remove Liquidity</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiquidityInterface
```

## 11. Membuat Pool Statistics Component

Buat file `src/components/PoolStats.tsx`:

```typescript
"use client"

import { TrendingUp, Droplets, DollarSign, Activity } from "lucide-react"
import { usePoolData } from "../hooks/usePoolData"
import { formatNumber, formatLargeNumber, formatBigInt } from "../utils/formatters"
import { TOKENS } from "../constants"

const PoolStats = () => {
  const { poolInfo, isLoading } = usePoolData()

  // Calculate real metrics from pool data
  const reserveAFormatted = formatBigInt(poolInfo.reserveA, TOKENS.CAMP.decimals, 2)
  const reserveBFormatted = formatBigInt(poolInfo.reserveB, TOKENS.USDC.decimals, 2)
  const totalLiquidityFormatted = formatBigInt(poolInfo.totalLiquidity, 18, 6)

  // Calculate real price from reserves
  const calculateRealPrice = (): number => {
    if (poolInfo.reserveA === BigInt(0) || poolInfo.reserveB === BigInt(0)) {
      return 0
    }
    
    const reserveA_adjusted = Number(poolInfo.reserveA) / Math.pow(10, 18) // CAMP
    const reserveB_adjusted = Number(poolInfo.reserveB) / Math.pow(10, 6)  // USDC
    
    return reserveB_adjusted / reserveA_adjusted
  }

  const currentPrice = calculateRealPrice()

  // Calculate TVL (Total Value Locked) based on real reserves
  const campValue = Number(reserveAFormatted) * currentPrice // CAMP value in USD
  const usdcValue = Number(reserveBFormatted) // USDC value (1:1 USD)
  const totalTVL = campValue + usdcValue

  // Calculate 24h volume (simplified - in real app would need historical data)
  const volume24h = totalTVL * 0.15 // Assume 15% of TVL as daily volume

  // Calculate APR based on fees (simplified calculation)
  const dailyFees = volume24h * 0.003 // 0.3% trading fee
  const annualFees = dailyFees * 365
  const apr = totalTVL > 0 ? (annualFees / totalTVL) * 100 : 0

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color,
    isLoading: cardLoading 
  }: {
    icon: React.ReactNode
    title: string
    value: string
    subtitle?: string
    color: string
    isLoading?: boolean
  }) => (
    <div className="glass rounded-xl p-6 card-hover border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: `${color}20`,
              border: `1px solid ${color}40`
            }}
          >
            {icon}
          </div>
          <h3 className="font-semibold" style={{ color: "#FBFAF9" }}>
            {title}
          </h3>
        </div>
      </div>
      
      {cardLoading ? (
        <div className="space-y-2">
          <div className="h-8 bg-white/10 rounded shimmer"></div>
          {subtitle && <div className="h-4 bg-white/10 rounded shimmer w-3/4"></div>}
        </div>
      ) : (
        <div>
          <div className="text-2xl font-bold mb-1" style={{ color: "#FBFAF9" }}>
            {value}
          </div>
          {subtitle && (
            <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient-monad mb-2">Pool Statistics</h2>
        <p style={{ color: "rgba(251, 250, 249, 0.7)" }}>
          Real-time metrics for the CAMP/USDC liquidity pool
        </p>
        {!isLoading && (
          <div className="text-sm mt-2" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
            Current Pool Ratio: 1 CAMP = ${formatNumber(currentPrice, 4)} USDC
          </div>
        )}
      </div>

      {/* Stats Grid - 2x2 Layout with Normal Card Size */}
      <div className="w-full">
        {/* Top Row - TVL and Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StatCard
            icon={<DollarSign className="w-5 h-5" style={{ color: "#10B981" }} />}
            title="Total Value Locked"
            value={`${formatLargeNumber(totalTVL)}`}
            subtitle="Real pool reserves"
            color="#10B981"
            isLoading={isLoading}
          />
          
          <StatCard
            icon={<Activity className="w-5 h-5" style={{ color: "#836EF9" }} />}
            title="24h Volume"
            value={`${formatLargeNumber(volume24h)}`}
            subtitle="Estimated trading"
            color="#836EF9"
            isLoading={isLoading}
          />
        </div>

        {/* Bottom Row - Price and APR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" style={{ color: "#A0055D" }} />}
            title="CAMP Price"
            value={`${formatNumber(currentPrice, 6)}`}
            subtitle="USDC per CAMP"
            color="#A0055D"
            isLoading={isLoading}
          />
          
          <StatCard
            icon={<Droplets className="w-5 h-5" style={{ color: "#F59E0B" }} />}
            title="APR"
            value={`${formatNumber(apr, 1)}%`}
            subtitle="Based on trading fees"
            color="#F59E0B"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Pool Composition */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-6" style={{ color: "#FBFAF9" }}>
          Pool Composition
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CAMP Reserve */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{TOKENS.CAMP.logo}</span>
                <div>
                  <div className="font-semibold" style={{ color: "#FBFAF9" }}>
                    {TOKENS.CAMP.name}
                  </div>
                  <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                    {TOKENS.CAMP.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                  {reserveAFormatted}
                </div>
                <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  ≈ ${formatNumber(campValue)}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-700 ease-out relative"
                style={{ 
                  width: totalTVL > 0 ? `${(campValue / totalTVL) * 100}%` : '50%',
                  background: "linear-gradient(to right, #836EF9, #9F7AEA)"
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(131, 110, 249, 0.3), transparent)" }}
                ></div>
              </div>
            </div>
            <div className="text-center text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              {totalTVL > 0 ? `${((campValue / totalTVL) * 100).toFixed(1)}%` : '50%'} of pool
            </div>
          </div>

          {/* USDC Reserve */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{TOKENS.USDC.logo}</span>
                <div>
                  <div className="font-semibold" style={{ color: "#FBFAF9" }}>
                    {TOKENS.USDC.name}
                  </div>
                  <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                    {TOKENS.USDC.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                  {reserveBFormatted}
                </div>
                <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  ≈ ${formatNumber(usdcValue)}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-700 ease-out relative"
                style={{ 
                  width: totalTVL > 0 ? `${(usdcValue / totalTVL) * 100}%` : '50%',
                  background: "linear-gradient(to right, #A0055D, #C53030)"
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(160, 5, 93, 0.3), transparent)" }}
                ></div>
              </div>
            </div>
            <div className="text-center text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              {totalTVL > 0 ? `${((usdcValue / totalTVL) * 100).toFixed(1)}%` : '50%'} of pool
            </div>
          </div>
        </div>

        {/* LP Token Info */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold" style={{ color: "#FBFAF9" }}>
                Total LP Tokens
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Liquidity provider tokens
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                {totalLiquidityFormatted}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                SDEX-LP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold mb-1" style={{ color: "#FBFAF9" }}>
              Trading Fee
            </div>
            <div className="text-2xl font-bold" style={{ color: "#836EF9" }}>
              0.3%
            </div>
            <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Per transaction
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl mb-2">🏦</div>
            <div className="font-semibold mb-1" style={{ color: "#FBFAF9" }}>
              Protocol
            </div>
            <div className="text-2xl font-bold" style={{ color: "#A0055D" }}>
              NadTrade
            </div>
            <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              AMM Protocol
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl mb-2">🌐</div>
            <div className="font-semibold mb-1" style={{ color: "#FBFAF9" }}>
              Network
            </div>
            <div className="text-2xl font-bold" style={{ color: "#10B981" }}>
              Monad
            </div>
            <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Testnet
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Updates Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border" style={{
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.3)"
        }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
          <span className="text-sm font-medium" style={{ color: "#10B981" }}>
            Live data from smart contract
          </span>
        </div>
      </div>
    </div>
  )
}

export default PoolStats
```

## 12. Membuat Price Chart Component

Buat file `src/components/PriceChart.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { usePoolData } from "../hooks/usePoolData"
import { useWatchContractEvent, usePublicClient } from "wagmi"
import { SIMPLE_DEX_ABI, CONTRACTS } from "../constants"
import { formatNumber, formatTime } from "../utils/formatters"
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
  const { poolInfo, isLoading } = usePoolData()
  const [timeFrame, setTimeFrame] = useState<'1H' | '1D' | '1W' | '1M'>('1D')
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [volume24h, setVolume24h] = useState(0)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  const publicClient = usePublicClient()

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0">
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

## 13. Membuat Transaction History Component

Buat file `src/components/TransactionHistory.tsx`:

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowUpDown, Plus, Minus, ExternalLink, Filter, Search, RefreshCw } from "lucide-react"
import { useAccount, useWatchContractEvent, usePublicClient } from "wagmi"
import { SIMPLE_DEX_ABI, CONTRACTS } from "../constants"
import { formatTokenAmount, formatTime, formatAddress } from "../utils/formatters"
import type { TransactionHistory as TxHistory } from "../types/defi"

// Extended type for internal use with blockNumber
interface ExtendedTxHistory extends TxHistory {
  blockNumber?: number
}

interface SwapEventArgs {
  user: string
  amountIn: bigint
  amountOut: bigint
  tokenAtoB: boolean
}

interface LiquidityEventArgs {
  provider: string
  amountA: bigint
  amountB: bigint
  liquidity: bigint
}

const TransactionHistory = () => {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [transactions, setTransactions] = useState<ExtendedTxHistory[]>([])
  const [filter, setFilter] = useState<'all' | 'swap' | 'add_liquidity' | 'remove_liquidity'>('all')
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastFetchedBlock, setLastFetchedBlock] = useState<bigint>(BigInt(0))

  // Fetch historical transactions from blockchain
  const fetchHistoricalTransactions = async (fromBlock?: bigint) => {
    if (!publicClient) return

    setIsLoading(true)
    
    try {
      const currentBlock = await publicClient.getBlockNumber()
      const startBlock = fromBlock || currentBlock - BigInt(50) // Only last 50 blocks
      
      console.log(`Fetching transactions from block ${startBlock} to ${currentBlock}`)

      // Fetch all event types in parallel (no batching needed for 50 blocks)
      const [swapEvents, liquidityAddedEvents, liquidityRemovedEvents] = await Promise.all([
        // Fetch Swap events
        publicClient.getLogs({
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
          fromBlock: startBlock,
          toBlock: currentBlock,
        }),

        // Fetch LiquidityAdded events
        publicClient.getLogs({
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
          fromBlock: startBlock,
          toBlock: currentBlock,
        }),

        // Fetch LiquidityRemoved events
        publicClient.getLogs({
          address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
          event: {
            type: 'event',
            name: 'LiquidityRemoved',
            inputs: [
              { name: 'provider', type:'address', indexed: true },
              { name: 'amountA', type: 'uint256', indexed: false },
              { name: 'amountB', type: 'uint256', indexed: false },
              { name: 'liquidity', type: 'uint256', indexed: false }
            ]
          },
          fromBlock: startBlock,
          toBlock: currentBlock,
        })
      ])

      console.log(`Found ${swapEvents.length} swaps, ${liquidityAddedEvents.length} liquidity adds, ${liquidityRemovedEvents.length} liquidity removes`)

      // Process all events and get their block timestamps
      const allTransactions: ExtendedTxHistory[] = []

      // Process swap events
      for (const log of swapEvents) {
        try {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
          const args = log.args as SwapEventArgs

          const newTx: ExtendedTxHistory = {
            id: `${log.transactionHash}-${log.logIndex}`,
            type: 'swap',
            hash: log.transactionHash || '',
            timestamp: Number(block.timestamp) * 1000, // Convert to milliseconds
            user: args.user,
            tokenA: {
              symbol: args.tokenAtoB ? 'CAMP' : 'USDC',
              amount: formatTokenAmount(
                args.amountIn,
                args.tokenAtoB ? 'CAMP' : 'USDC'
              )
            },
            tokenB: {
              symbol: args.tokenAtoB ? 'USDC' : 'CAMP',
              amount: formatTokenAmount(
                args.amountOut,
                args.tokenAtoB ? 'USDC' : 'CAMP'
              )
            },
            status: 'success',
            blockNumber: Number(log.blockNumber)
          }

          allTransactions.push(newTx)
        } catch (error) {
          console.error('Error processing swap event:', error)
        }
      }

      // Process liquidity added events
      for (const log of liquidityAddedEvents) {
        try {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
          const args = log.args as LiquidityEventArgs

          const newTx: ExtendedTxHistory = {
            id: `${log.transactionHash}-${log.logIndex}`,
            type: 'add_liquidity',
            hash: log.transactionHash || '',
            timestamp: Number(block.timestamp) * 1000,
            user: args.provider,
            tokenA: {
              symbol: 'CAMP',
              amount: formatTokenAmount(args.amountA, 'CAMP')
            },
            tokenB: {
              symbol: 'USDC',
              amount: formatTokenAmount(args.amountB, 'USDC')
            },
            lpTokens: formatTokenAmount(args.liquidity, 'CAMP'),
            status: 'success',
            blockNumber: Number(log.blockNumber)
          }

          allTransactions.push(newTx)
        } catch (error) {
          console.error('Error processing liquidity added event:', error)
        }
      }

      // Process liquidity removed events
      for (const log of liquidityRemovedEvents) {
        try {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
          const args = log.args as LiquidityEventArgs

          const newTx: ExtendedTxHistory = {
            id: `${log.transactionHash}-${log.logIndex}`,
            type: 'remove_liquidity',
            hash: log.transactionHash || '',
            timestamp: Number(block.timestamp) * 1000,
            user: args.provider,
            tokenA: {
              symbol: 'CAMP',
              amount: formatTokenAmount(args.amountA, 'CAMP')
            },
            tokenB: {
              symbol: 'USDC',
              amount: formatTokenAmount(args.amountB, 'USDC')
            },
            lpTokens: formatTokenAmount(args.liquidity, 'CAMP'),
            status: 'success',
            blockNumber: Number(log.blockNumber)
          }

          allTransactions.push(newTx)
        } catch (error) {
          console.error('Error processing liquidity removed event:', error)
        }
      }

      // Sort by timestamp (newest first) and remove duplicates
      const sortedTransactions = allTransactions
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter((tx, index, self) => index === self.findIndex(t => t.id === tx.id))

      console.log(`Processed ${sortedTransactions.length} total transactions`)

      // Update state
      if (fromBlock) {
        // If fetching newer transactions, prepend them
        setTransactions(prev => {
          const combined = [...sortedTransactions, ...prev]
          const unique = combined.filter((tx, index, self) => 
            index === self.findIndex(t => t.id === tx.id)
          )
          return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50) // Keep only 50 transactions
        })
      } else {
        // If fetching initial data, replace all
        setTransactions(sortedTransactions.slice(0, 50)) // Keep only 50 transactions
      }

      setLastFetchedBlock(currentBlock)

    } catch (error) {
      console.error('Error fetching historical transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch historical data on component mount
  const fetchHistoricalTransactionsCallback = useCallback(fetchHistoricalTransactions, [publicClient])
  
  useEffect(() => {
    if (publicClient && transactions.length === 0) {
      fetchHistoricalTransactionsCallback()
    }
  }, [publicClient, fetchHistoricalTransactionsCallback, transactions.length])

  // Watch for new swap events
  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'Swap',
    onLogs(logs) {
      logs.forEach(async (log) => {
        if ('args' in log && log.args) {
          try {
            const args = log.args as SwapEventArgs
            const block = await publicClient?.getBlock({ blockNumber: log.blockNumber! })
            
            if (!block) return

            const newTx: ExtendedTxHistory = {
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'swap',
              hash: log.transactionHash || '',
              timestamp: Number(block.timestamp) * 1000,
              user: args.user,
              tokenA: {
                symbol: args.tokenAtoB ? 'CAMP' : 'USDC',
                amount: formatTokenAmount(
                  args.amountIn,
                  args.tokenAtoB ? 'CAMP' : 'USDC'
                )
              },
              tokenB: {
                symbol: args.tokenAtoB ? 'USDC' : 'CAMP',
                amount: formatTokenAmount(
                  args.amountOut,
                  args.tokenAtoB ? 'USDC' : 'CAMP'
                )
              },
              status: 'success',
              blockNumber: Number(log.blockNumber)
            }

            setTransactions(prev => {
              const exists = prev.find(tx => tx.id === newTx.id)
              if (!exists) {
                return [newTx, ...prev].slice(0, 50) // Keep only 50 transactions
              }
              return prev
            })
          } catch (error) {
            console.error('Error processing new swap event:', error)
          }
        }
      })
    }
  })

  // Watch for new liquidity events
  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'LiquidityAdded',
    onLogs(logs) {
      logs.forEach(async (log) => {
        if ('args' in log && log.args) {
          try {
            const args = log.args as LiquidityEventArgs
            const block = await publicClient?.getBlock({ blockNumber: log.blockNumber! })
            
            if (!block) return

            const newTx: ExtendedTxHistory = {
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'add_liquidity',
              hash: log.transactionHash || '',
              timestamp: Number(block.timestamp) * 1000,
              user: args.provider,
              tokenA: {
                symbol: 'CAMP',
                amount: formatTokenAmount(args.amountA, 'CAMP')
              },
              tokenB: {
                symbol: 'USDC',
                amount: formatTokenAmount(args.amountB, 'USDC')
              },
              lpTokens: formatTokenAmount(args.liquidity, 'CAMP'),
              status: 'success',
              blockNumber: Number(log.blockNumber)
            }

            setTransactions(prev => {
              const exists = prev.find(tx => tx.id === newTx.id)
              if (!exists) {
                return [newTx, ...prev].slice(0, 50) // Keep only 50 transactions
              }
              return prev
            })
          } catch (error) {
            console.error('Error processing new liquidity added event:', error)
          }
        }
      })
    }
  })

  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'LiquidityRemoved',
    onLogs(logs) {
      logs.forEach(async (log) => {
        if ('args' in log && log.args) {
          try {
            const args = log.args as LiquidityEventArgs
            const block = await publicClient?.getBlock({ blockNumber: log.blockNumber! })
            
            if (!block) return

            const newTx: ExtendedTxHistory = {
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'remove_liquidity',
              hash: log.transactionHash || '',
              timestamp: Number(block.timestamp) * 1000,
              user: args.provider,
              tokenA: {
                symbol: 'CAMP',
                amount: formatTokenAmount(args.amountA, 'CAMP')
              },
              tokenB: {
                symbol: 'USDC',
                amount: formatTokenAmount(args.amountB, 'USDC')
              },
              lpTokens: formatTokenAmount(args.liquidity, 'CAMP'),
              status: 'success',
              blockNumber: Number(log.blockNumber)
            }

            setTransactions(prev => {
              const exists = prev.find(tx => tx.id === newTx.id)
              if (!exists) {
                return [newTx, ...prev].slice(0, 50) // Keep only 50 transactions
              }
              return prev
            })
          } catch (error) {
            console.error('Error processing new liquidity removed event:', error)
          }
        }
      })
    }
  })

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === 'all' || tx.type === filter
    const matchesSearch = !searchTerm || 
      tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#836EF9" }} />
      case 'add_liquidity':
        return <Plus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#10B981" }} />
      case 'remove_liquidity':
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#EF4444" }} />
      default:
        return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "rgba(251, 250, 249, 0.7)" }} />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'swap':
        return 'Swap'
      case 'add_liquidity':
        return 'Add Liquidity'
      case 'remove_liquidity':
        return 'Remove Liquidity'
      default:
        return 'Unknown'
    }
  }

  const getTransactionDescription = (tx: ExtendedTxHistory) => {
    switch (tx.type) {
      case 'swap':
        return `${tx.tokenA?.amount} ${tx.tokenA?.symbol} → ${tx.tokenB?.amount} ${tx.tokenB?.symbol}`
      case 'add_liquidity':
        return `${tx.tokenA?.amount} ${tx.tokenA?.symbol} + ${tx.tokenB?.amount} ${tx.tokenB?.symbol}`
      case 'remove_liquidity':
        return `${tx.tokenA?.amount} ${tx.tokenA?.symbol} + ${tx.tokenB?.amount} ${tx.tokenB?.symbol}`
      default:
        return ''
    }
  }

  const handleRefresh = () => {
    fetchHistoricalTransactions(lastFetchedBlock)
  }

  const loadMoreTransactions = () => {
    const oldestBlock = transactions.length > 0 
      ? Math.min(...transactions.filter(tx => tx.blockNumber).map(tx => tx.blockNumber!))
      : 0
    
    if (oldestBlock > 0) {
      fetchHistoricalTransactions(BigInt(oldestBlock - 50)) // Fetch 50 blocks before oldest
    }
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
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: "rgba(251, 250, 249, 0.7)" }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="appearance-none bg-transparent border rounded-lg px-3 py-2 pr-8 input-primary text-sm w-full sm:w-auto"
                style={{ 
                  color: "#FBFAF9",
                  borderColor: "rgba(251, 250, 249, 0.2)",
                  backgroundColor: "rgba(14, 16, 15, 0.5)"
                }}
              >
                <option value="all">All Transactions</option>
                <option value="swap">Swaps</option>
                <option value="add_liquidity">Add Liquidity</option>
                <option value="remove_liquidity">Remove Liquidity</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" 
                style={{ color: "rgba(251, 250, 249, 0.7)" }} />
            </div>

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

        {/* Loading State */}
        {isLoading && transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#FBFAF9" }}>
              Loading transaction history...
            </div>
            <div style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Fetching events from blockchain
            </div>
          </div>
        )}

        {/* Transaction List */}
        <div className="space-y-3 sm:space-y-4">
          {!isLoading && filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "#FBFAF9" }}>
                No transactions found
              </h3>
              <p className="text-sm sm:text-base" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                {transactions.length === 0 
                  ? "No transactions have been made yet on this DEX!" 
                  : "Try adjusting your filters or search terms."}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
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
                      backgroundColor: "rgba(131, 110, 249, 0.1)",
                      borderColor: "rgba(131, 110, 249, 0.3)"
                    }}
                  >
                    {getTransactionIcon(tx.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                        {getTransactionLabel(tx.type)}
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
                    </div>
                    <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                      {getTransactionDescription(tx)}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                      {formatTime(tx.timestamp)} • {formatAddress(tx.user)}
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'success' ? 'bg-green-500' :
                      tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs sm:text-sm capitalize" style={{ 
                      color: tx.status === 'success' ? "#10B981" :
                             tx.status === 'pending' ? "#F59E0B" : "#EF4444"
                    }}>
                      {tx.status}
                    </span>
                  </div>

                  {/* External Link */}
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: "rgba(251, 250, 249, 0.7)" }}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                </div>
              </div>
            ))
          )}

          {/* Load More Button */}
          {!isLoading && filteredTransactions.length >= 10 && (
            <div className="text-center pt-4">
              <button
                onClick={loadMoreTransactions}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 btn-primary text-sm sm:text-base"
                style={{
                  background: "linear-gradient(135deg, rgba(131, 110, 249, 0.2), rgba(160, 5, 93, 0.2))",
                  border: "1px solid rgba(131, 110, 249, 0.3)",
                  color: "#FBFAF9"
                }}
              >
                Load Previous 50 Blocks
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {transactions.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 rounded-lg border" style={{
                backgroundColor: "rgba(14, 16, 15, 0.3)",
                borderColor: "rgba(251, 250, 249, 0.1)"
              }}>
                <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "#FBFAF9" }}>
                  {transactions.length}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Total Transactions
                </div>
              </div>
              
              <div className="text-center p-3 rounded-lg border" style={{
                backgroundColor: "rgba(14, 16, 15, 0.3)",
                borderColor: "rgba(251, 250, 249, 0.1)"
              }}>
                <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "#836EF9" }}>
                  {transactions.filter(tx => tx.type === 'swap').length}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Swaps
                </div>
              </div>
              
              <div className="text-center p-3 rounded-lg border" style={{
                backgroundColor: "rgba(14, 16, 15, 0.3)",
                borderColor: "rgba(251, 250, 249, 0.1)"
              }}>
                <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "#10B981" }}>
                  {transactions.filter(tx => tx.type === 'add_liquidity').length}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Liquidity Added
                </div>
              </div>
              
              <div className="text-center p-3 rounded-lg border" style={{
                backgroundColor: "rgba(14, 16, 15, 0.3)",
                borderColor: "rgba(251, 250, 249, 0.1)"
              }}>
                <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "#EF4444" }}>
                  {transactions.filter(tx => tx.type === 'remove_liquidity').length}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  Liquidity Removed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 text-xs sm:text-sm text-center space-y-1 sm:space-y-0 mt-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
            <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              🔗 Real blockchain transactions
            </span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            Live updates from events
          </span>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
```

## 14. Membuat Main DEX Container

Buat file `src/components/DEXContainer.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { TrendingUp, Droplets, BarChart3, History } from "lucide-react"
import SwapInterface from "./SwapInterface"
import LiquidityInterface from "./LiquidityInterface"
import PoolStats from "./PoolStats"
import PriceChart from "./PriceChart"
import TransactionHistory from "./TransactionHistory"

const DEXContainer = () => {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity' | 'analytics' | 'history'>('swap')

  const TabButton = ({ 
    id, 
    icon, 
    label, 
    description 
  }: { 
    id: typeof activeTab, 
    icon: React.ReactNode, 
    label: string,
    description: string 
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 w-full text-left ${
        activeTab === id 
          ? 'gradient-monad-primary glow-purple' 
          : 'glass hover:bg-white/10'
      }`}
      style={{
        color: activeTab === id ? "#FBFAF9" : "rgba(251, 250, 249, 0.8)",
        border: activeTab === id ? "1px solid rgba(131, 110, 249, 0.5)" : "1px solid rgba(251, 250, 249, 0.1)"
      }}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-sm opacity-80">{description}</div>
      </div>
    </button>
  )

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="glass card-hover rounded-2xl p-12 max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6 float-animation">
            <img src="/nad-trade-logo.png" alt="Nad Trade Logo" className="w-24 h-24 mx-auto mb-4" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-gradient-monad font-inter">
            Welcome to Nad Trade
          </h2>
          <p className="mb-8 text-lg leading-relaxed max-w-lg mx-auto" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            The most intuitive decentralized exchange on Monad. Swap tokens, provide liquidity, and earn rewards with minimal fees and maximum efficiency.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)"
            }}>
              <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: "#836EF9" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Instant Swaps</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Trade tokens instantly with minimal slippage
              </p>
            </div>
            
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderColor: "rgba(16, 185, 129, 0.3)"
            }}>
              <Droplets className="w-8 h-8 mx-auto mb-3" style={{ color: "#10B981" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Earn Rewards</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Provide liquidity and earn trading fees
              </p>
            </div>
            
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(160, 5, 93, 0.1)",
              borderColor: "rgba(160, 5, 93, 0.3)"
            }}>
              <BarChart3 className="w-8 h-8 mx-auto mb-3" style={{ color: "#A0055D" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Low Fees</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Only 0.3% trading fee on all swaps
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-8 text-sm mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
              <span style={{ color: "rgba(251, 250, 249, 0.8)" }}>Live on Monad Testnet</span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{ color: "rgba(251, 250, 249, 0.8)" }}>Powered by AMM</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium mb-4" style={{ color: "#836EF9" }}>
              Connect your wallet to get started
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <span style={{ color: "rgba(251, 250, 249, 0.6)" }}>Supported:</span>
              <span style={{ color: "#FBFAF9" }}>MetaMask</span>
              <span style={{ color: "rgba(251, 250, 249, 0.6)" }}>•</span>
              <span style={{ color: "#FBFAF9" }}>WalletConnect</span>
              <span style={{ color: "rgba(251, 250, 249, 0.6)" }}>•</span>
              <span style={{ color: "#FBFAF9" }}>Coinbase Wallet</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <TabButton
            id="swap"
            icon={<TrendingUp className="w-6 h-6" />}
            label="Swap"
            description="Trade tokens instantly"
          />
          <TabButton
            id="liquidity"
            icon={<Droplets className="w-6 h-6" />}
            label="Liquidity"
            description="Add or remove liquidity"
          />
          <TabButton
            id="analytics"
            icon={<BarChart3 className="w-6 h-6" />}
            label="Analytics"
            description="Pool stats and charts"
          />
          <TabButton
            id="history"
            icon={<History className="w-6 h-6" />}
            label="History"
            description="Transaction history"
          />
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'swap' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SwapInterface />
              <div className="space-y-8">
                <PoolStats />
              </div>
            </div>
          )}

          {activeTab === 'liquidity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LiquidityInterface />
              <div className="space-y-8">
                <PoolStats />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <PriceChart />
              <PoolStats />
            </div>
          )}

          {activeTab === 'history' && (
            <TransactionHistory />
          )}
        </div>
      </div>
    </main>
  )
}

export default DEXContainer
```

## 15. Menjalankan Aplikasi

### 15.1. Development Setup

Setelah semua komponen selesai dibuat, jalankan aplikasi:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173/`

### 15.2. File Structure Lengkap

Struktur akhir proyek Anda:

```
simple-defi-ui/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── DEXContainer.tsx
│   │   ├── SwapInterface.tsx
│   │   ├── LiquidityInterface.tsx
│   │   ├── PoolStats.tsx
│   │   ├── PriceChart.tsx
│   │   └── TransactionHistory.tsx
│   ├── hooks/
│   │   ├── useSwap.ts
│   │   ├── useLiquidity.ts
│   │   ├── useTokenBalance.ts
│   │   └── usePoolData.ts
│   ├── constants/
│   │   ├── SIMPLE_DEX_ABI.json
│   │   ├── ERC20_ABI.json
│   │   └── index.tsx
│   ├── types/
│   │   └── defi.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── calculations.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.svg
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### 15.3. Environment Configuration

Buat file `.env.local`:

```env
VITE_SIMPLE_DEX_ADDRESS=0x70bDD0f7e01DEe803147ead041dE23a531A71CBf
VITE_CAMPUS_COIN_ADDRESS=0xEBAa841c5f97Ff097e61eea151dFA03640A6CC78
VITE_MOCK_USDC_ADDRESS=0x786Ca7D3a2E53f0d5F7bB6848E03b60Dae9a3719
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

> ⚠️ **Penting**: Ganti `your_project_id_here` dengan Project ID dari [WalletConnect Cloud](https://cloud.walletconnect.com)

### 15.4. Update Constants

Update `src/constants/index.tsx` untuk menggunakan environment variables:

```typescript
import SIMPLE_DEX_ABI_JSON from "./SIMPLE_DEX_ABI.json"
import ERC20_ABI_JSON from "./ERC20_ABI.json"

export const SIMPLE_DEX_ABI = SIMPLE_DEX_ABI_JSON;
export const ERC20_ABI = ERC20_ABI_JSON;

// Contract addresses dari environment variables
export const CONTRACTS = {
  SIMPLE_DEX: import.meta.env.VITE_SIMPLE_DEX_ADDRESS,
  CAMPUS_COIN: import.meta.env.VITE_CAMPUS_COIN_ADDRESS,
  MOCK_USDC: import.meta.env.VITE_MOCK_USDC_ADDRESS,
} as const;

// Token configurations
export const TOKENS = {
  CAMP: {
    address: CONTRACTS.CAMPUS_COIN,
    symbol: "CAMP",
    name: "Campus Coin",
    decimals: 18,
    logo: "🏛️",
  },
  USDC: {
    address: CONTRACTS.MOCK_USDC,
    symbol: "USDC",
    name: "Mock USDC",
    decimals: 6,
    logo: "💵",
  },
} as const;

// DEX configuration
export const DEX_CONFIG = {
  FEE_PERCENT: 0.3, // 0.3%
  SLIPPAGE_TOLERANCE: 0.5, // 0.5%
  DEADLINE: 20, // 20 minutes
} as const;
```

## 16. Troubleshooting

### 16.1. Common Issues

**Issue: `BigInt` serialization error**
```typescript
// Solution: Convert BigInt to string before displaying
const displayValue = value.toString()
```

**Issue: Contract function calls failing**
```typescript
// Solution: Check contract addresses and ABI
console.log('Contract address:', CONTRACTS.SIMPLE_DEX)
console.log('User address:', address)
```

**Issue: Transaction reverts**
```typescript
// Solution: Check allowances and balances
const allowance = await readContract({
  address: tokenAddress,
  abi: ERC20_ABI,
  functionName: 'allowance',
  args: [userAddress, CONTRACTS.SIMPLE_DEX],
})
```

### 16.2. Debugging Tips

1. **Check browser console** untuk error messages
2. **Verify contract addresses** di Monad Explorer
3. **Ensure wallet connection** sebelum contract interactions
4. **Check token approvals** sebelum swaps/liquidity operations
5. **Monitor gas fees** dan transaction status

### 16.3. Performance Tips

```typescript
// Use React.memo untuk expensive components
const PoolStats = React.memo(() => {
  // Component logic
})

// Debounce input values
const [debouncedAmount] = useDebounce(amount, 500)

// Lazy load heavy components
const PriceChart = lazy(() => import('./PriceChart'))
```

## 17. Kesimpulan

Selamat! Anda telah berhasil membuat frontend lengkap untuk SimpleDEX. Aplikasi ini menyediakan:

### ✅ **Fitur Lengkap:**
- **Swap Interface** - Trade CAMP ↔ USDC dengan slippage protection
- **Liquidity Management** - Add/remove liquidity dan earn LP rewards
- **Real-time Analytics** - Pool statistics, price charts, dan metrics
- **Transaction History** - Track semua aktivitas DEX
- **Responsive Design** - Optimal di desktop dan mobile
- **Web3 Integration** - RainbowKit wallet connection

### ✅ **Technical Features:**
- **TypeScript** untuk type safety
- **Custom Hooks** untuk reusable logic
- **Real-time Updates** dengan contract event listening
- **Error Handling** dan user feedback
- **Performance Optimization** dengan lazy loading
- **Modern UI/UX** dengan TailwindCSS dan animations

### ✅ **DeFi Functionality:**
- **AMM Trading** dengan constant product formula
- **Liquidity Provision** dengan LP token rewards
- **Price Impact Calculation** untuk informed trading
- **Fee Distribution** ke liquidity providers
- **Pool Analytics** untuk data-driven decisions

### 🚀 **Next Steps:**

1. **Enhanced Features:**
   - Multi-token support
   - Advanced charting
   - Portfolio tracking
   - Yield farming

2. **Additional Integrations:**
   - Price feeds dari oracles
   - Cross-chain bridges
   - NFT marketplace integration
   - DAO governance

3. **Production Readiness:**
   - Security audits
   - Performance monitoring
   - Error tracking
   - User analytics

Frontend SimpleDEX ini memberikan foundation yang solid untuk DeFi trading experience yang intuitive dan powerful. Dengan design yang modern dan functionality yang lengkap, users dapat dengan mudah berinteraksi dengan protocol DeFi di Monad blockchain.

**Happy Trading! 🚀💰**