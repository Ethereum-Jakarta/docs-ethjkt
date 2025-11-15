---
sidebar_position: 5
title: "Part 5: Frontend Integration - Build DEX User Interface"
---

# Part 5: Frontend Integration - Build DEX User Interface

## 📋 Tujuan Pembelajaran

Setelah menyelesaikan bagian ini, Anda akan mampu:

- ✅ Membangun frontend modern untuk DEX menggunakan React + Vite
- ✅ Mengintegrasikan smart contract dengan UI menggunakan Wagmi dan Viem
- ✅ Mengimplementasikan wallet connection dengan RainbowKit
- ✅ Membuat swap interface dengan real-time price calculation
- ✅ Membuat liquidity management interface
- ✅ Menampilkan pool statistics dan price charts
- ✅ Menangani transaction history dari blockchain events
- ✅ Deploy frontend ke production

---

## 🎯 Apa yang Akan Kita Bangun?

Kita akan membangun **SimpleDEX UI** - sebuah aplikasi web modern dengan fitur:

### **Fitur Utama**
- 🔄 **Token Swapping**: Tukar CAMP ↔ USDC dengan real-time price calculation
- 💧 **Liquidity Management**: Add/remove liquidity dengan auto-calculation
- 📊 **Pool Analytics**: TVL, volume, APR, dan price charts
- 📜 **Transaction History**: Real-time tracking dari blockchain events
- 👛 **Wallet Integration**: Connect dengan MetaMask, WalletConnect, dll
- ⚡ **Real-time Updates**: Live data menggunakan contract event listeners

### **Tech Stack**
- **Framework**: React 18 + Vite + TypeScript
- **Blockchain**: Wagmi v2 + Viem (Ethereum library)
- **Wallet**: RainbowKit (wallet connection UI)
- **State**: TanStack React Query (caching & state)
- **Styling**: TailwindCSS v4
- **Charts**: Recharts (data visualization)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 📁 Struktur Project

```
simple-dex-ui/
├── public/
│   └── dex-logo.png                 # Logo aplikasi
├── src/
│   ├── components/
│   │   ├── DEXContainer.tsx         # Container utama dengan tabs
│   │   ├── Header.tsx               # Header dengan wallet connection
│   │   ├── SwapInterface.tsx        # UI untuk swap tokens
│   │   ├── LiquidityInterface.tsx   # UI untuk add/remove liquidity
│   │   ├── PoolStats.tsx            # Statistik pool (TVL, volume, APR)
│   │   ├── PriceChart.tsx           # Real-time price chart
│   │   └── TransactionHistory.tsx   # Riwayat transaksi
│   ├── hooks/
│   │   ├── useTokenBalance.ts       # Hook untuk balance & allowance
│   │   ├── usePoolData.ts           # Hook untuk data pool
│   │   ├── useSwap.ts               # Hook untuk swap operations
│   │   └── useLiquidity.ts          # Hook untuk liquidity operations
│   ├── constants/
│   │   ├── ERC20_ABI.json           # ABI untuk ERC20
│   │   ├── SIMPLE_DEX_ABI.json      # ABI untuk SimpleDEX
│   │   └── index.tsx                # Contract addresses & config
│   ├── types/
│   │   └── defi.ts                  # TypeScript types
│   ├── utils/
│   │   ├── formatters.ts            # Formatting utilities
│   │   └── calculations.ts          # AMM calculations
│   ├── App.tsx                      # Root component dengan providers
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── .env.local                       # Environment variables
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
└── tailwind.config.js               # TailwindCSS config
```

---

## 🚀 Part 1: Setup Project

### **Step 1: Create Vite Project**

```bash
# Create project dengan Vite
npm create vite@latest simple-dex-ui -- --template react-ts

# Masuk ke folder project
cd simple-dex-ui
```

### **Step 2: Install Dependencies**

```bash
# Install semua dependencies yang diperlukan
npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
npm install react-hot-toast lucide-react recharts
npm install -D tailwindcss @tailwindcss/vite
```

**Penjelasan Dependencies:**

| Package | Fungsi |
|---------|--------|
| `@rainbow-me/rainbowkit` | UI untuk wallet connection (MetaMask, WalletConnect, dll) |
| `wagmi` | React hooks untuk Ethereum (read/write contracts) |
| `viem` | TypeScript Ethereum library (modern replacement untuk ethers.js) |
| `@tanstack/react-query` | State management & caching untuk data fetching |
| `react-hot-toast` | Notifikasi untuk transaction success/error |
| `lucide-react` | Icon library (modern, lightweight) |
| `recharts` | Library untuk charts dan visualisasi data |
| `tailwindcss` | Utility-first CSS framework |

### **Step 3: Configure Vite**

Buat file `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### **Step 4: Configure TailwindCSS**

Buat file `tailwind.config.js`:

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
        primary: '#3B82F6',    // Blue
        secondary: '#8B5CF6',  // Purple
        accent: '#10B981',     // Green
      },
      animation: {
        'pulse-success': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
```

### **Step 5: Setup Environment Variables**

Buat file `.env.local`:

```bash
# Contract Addresses (ganti dengan address Anda dari Part 4)
VITE_SIMPLE_DEX_ADDRESS=0xYourSimpleDEXAddress
VITE_CAMPUS_COIN_ADDRESS=0xYourCampusCoinAddress
VITE_MOCK_USDC_ADDRESS=0xYourMockUSDCAddress

# WalletConnect Project ID (dapatkan dari https://cloud.walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

> **💡 Cara Mendapatkan WalletConnect Project ID:**
> 1. Buka https://cloud.walletconnect.com
> 2. Sign up / Login
> 3. Create New Project → masukkan nama project
> 4. Copy Project ID yang diberikan

---

## 🎨 Part 2: Setup Global Styles

Buat file `src/index.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
@import "tailwindcss";

:root {
  /* Lisk Brand Colors - Adapted from Monad */
  --lisk-off-white: #fbfaf9;
  --lisk-primary: #3B82F6;     /* Blue */
  --lisk-secondary: #8B5CF6;   /* Purple */
  --lisk-accent: #10B981;      /* Green */
  --lisk-dark: #0f172a;
  --lisk-black: #0e100f;
  --lisk-white: #ffffff;

  /* DeFi specific colors */
  --success-green: #10b981;
  --success-green-light: rgba(16, 185, 129, 0.2);
  --warning-yellow: #f59e0b;
  --warning-yellow-light: rgba(245, 158, 11, 0.2);
  --error-red: #ef4444;
  --error-red-light: rgba(239, 68, 68, 0.2);

  /* Derived colors for UI */
  --lisk-primary-light: rgba(59, 130, 246, 0.8);
  --lisk-primary-dark: rgba(59, 130, 246, 0.2);
  --lisk-secondary-light: rgba(139, 92, 246, 0.8);
  --lisk-secondary-dark: rgba(139, 92, 246, 0.2);
  --lisk-accent-light: rgba(16, 185, 129, 0.8);
  --lisk-accent-dark: rgba(16, 185, 129, 0.2);

  /* UI System Colors */
  --bg-primary: var(--lisk-dark);
  --bg-secondary: var(--lisk-black);
  --bg-tertiary: rgba(15, 23, 42, 0.6);
  --text-primary: var(--lisk-off-white);
  --text-secondary: var(--lisk-white);
  --text-muted: rgba(251, 250, 249, 0.7);
  --border-primary: rgba(59, 130, 246, 0.3);
  --border-secondary: rgba(139, 92, 246, 0.2);

  /* Glass Effect */
  --glass-bg: rgba(30, 41, 59, 0.7);
  --glass-border: rgba(148, 163, 184, 0.1);
  --glass-dark-bg: rgba(15, 23, 42, 0.9);
  --glass-dark-border: rgba(100, 116, 139, 0.2);
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--lisk-primary-dark);
  border-radius: 4px;
  transition: background 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--lisk-primary-light);
}

/* Glass Morphism Effects */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-dark {
  background: var(--glass-dark-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-dark-border);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--lisk-primary) 0%, var(--lisk-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.text-gradient-accent {
  background: linear-gradient(135deg, var(--lisk-accent) 0%, var(--lisk-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Animations */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes pulse-success {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 var(--success-green-light);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 10px transparent;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow-primary {
  0%, 100% {
    box-shadow: 0 0 20px var(--lisk-primary-dark);
  }
  50% {
    box-shadow: 0 0 30px var(--lisk-primary-light);
  }
}

@keyframes glow-accent {
  0%, 100% {
    box-shadow: 0 0 20px var(--lisk-accent-dark);
  }
  50% {
    box-shadow: 0 0 30px var(--lisk-accent-light);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Utility Animation Classes */
.shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    to right,
    rgba(30, 41, 59, 0.4) 4%,
    rgba(51, 65, 85, 0.6) 25%,
    rgba(30, 41, 59, 0.4) 36%
  );
  background-size: 1000px 100%;
}

.pulse-success {
  animation: pulse-success 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.float {
  animation: float 3s ease-in-out infinite;
}

.glow-primary {
  animation: glow-primary 2s ease-in-out infinite;
}

.glow-accent {
  animation: glow-accent 2s ease-in-out infinite;
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Button Styles */
.btn-primary {
  background: linear-gradient(135deg, var(--lisk-primary) 0%, var(--lisk-secondary) 100%);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 var(--lisk-primary-dark);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 var(--lisk-primary-light);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--glass-bg);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-primary);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: var(--glass-dark-bg);
  border-color: var(--lisk-primary-light);
}

/* Input Styles */
.input-primary {
  background: var(--glass-dark-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-primary:focus {
  outline: none;
  border-color: var(--lisk-primary-light);
  box-shadow: 0 0 0 3px var(--lisk-primary-dark);
}

.input-primary::placeholder {
  color: var(--text-muted);
}

/* Card Styles */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
}

/* Loading States */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(30, 41, 59, 0.4) 25%,
    rgba(51, 65, 85, 0.6) 50%,
    rgba(30, 41, 59, 0.4) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.5rem;
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: rgba(100, 116, 139, 0.3);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--lisk-primary) 0%, var(--lisk-accent) 100%);
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

/* Badge Styles */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-success {
  background: var(--success-green-light);
  color: var(--success-green);
  border: 1px solid var(--success-green);
}

.badge-warning {
  background: var(--warning-yellow-light);
  color: var(--warning-yellow);
  border: 1px solid var(--warning-yellow);
}

.badge-error {
  background: var(--error-red-light);
  color: var(--error-red);
  border: 1px solid var(--error-red);
}

/* Responsive Design */
@media (max-width: 768px) {
  .btn-primary,
  .btn-secondary {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .input-primary {
    font-size: 0.875rem;
    padding: 0.75rem 0.875rem;
  }
}
```

---

## 📦 Part 3: Constants & Types

### **Step 1: ERC20 ABI**

Buat file `src/constants/ERC20_ABI.json`:

```json
[
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
]
```

### **Step 2: SimpleDEX ABI**

Buat file `src/constants/SIMPLE_DEX_ABI.json`:

```json
[
  {
    "inputs": [
      {"name": "amountA", "type": "uint256"},
      {"name": "amountB", "type": "uint256"}
    ],
    "name": "addLiquidity",
    "outputs": [{"name": "liquidity", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "liquidity", "type": "uint256"}],
    "name": "removeLiquidity",
    "outputs": [
      {"name": "amountA", "type": "uint256"},
      {"name": "amountB", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "amountAIn", "type": "uint256"},
      {"name": "minAmountBOut", "type": "uint256"}
    ],
    "name": "swapAforB",
    "outputs": [{"name": "amountBOut", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "amountBIn", "type": "uint256"},
      {"name": "minAmountAOut", "type": "uint256"}
    ],
    "name": "swapBforA",
    "outputs": [{"name": "amountAOut", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolInfo",
    "outputs": [
      {"name": "reserveA", "type": "uint256"},
      {"name": "reserveB", "type": "uint256"},
      {"name": "totalLiquidity", "type": "uint256"},
      {"name": "price", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "amountIn", "type": "uint256"},
      {"name": "reserveIn", "type": "uint256"},
      {"name": "reserveOut", "type": "uint256"}
    ],
    "name": "getAmountOut",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reserveA",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reserveB",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "FEE_PERCENT",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "FEE_DENOMINATOR",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "user", "type": "address"},
      {"indexed": false, "name": "amountAIn", "type": "uint256"},
      {"indexed": false, "name": "amountBOut", "type": "uint256"}
    ],
    "name": "Swap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "provider", "type": "address"},
      {"indexed": false, "name": "amountA", "type": "uint256"},
      {"indexed": false, "name": "amountB", "type": "uint256"},
      {"indexed": false, "name": "liquidity", "type": "uint256"}
    ],
    "name": "LiquidityAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "provider", "type": "address"},
      {"indexed": false, "name": "amountA", "type": "uint256"},
      {"indexed": false, "name": "amountB", "type": "uint256"},
      {"indexed": false, "name": "liquidity", "type": "uint256"}
    ],
    "name": "LiquidityRemoved",
    "type": "event"
  }
]
```

### **Step 3: Constants Configuration**

Buat file `src/constants/index.tsx`:

```typescript
import ERC20_ABI from './ERC20_ABI.json'
import SIMPLE_DEX_ABI from './SIMPLE_DEX_ABI.json'

// Contract Addresses (dari environment variables)
export const CONTRACTS = {
  SIMPLE_DEX: import.meta.env.VITE_SIMPLE_DEX_ADDRESS as `0x${string}`,
  CAMPUS_COIN: import.meta.env.VITE_CAMPUS_COIN_ADDRESS as `0x${string}`,
  MOCK_USDC: import.meta.env.VITE_MOCK_USDC_ADDRESS as `0x${string}`,
}

// Token Configuration
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
}

// DEX Configuration
export const DEX_CONFIG = {
  FEE_PERCENT: 0.3,           // 0.3% trading fee
  SLIPPAGE_TOLERANCE: 0.5,    // 0.5% default slippage
  DEADLINE: 20,               // 20 minutes transaction deadline
}

// Export ABIs
export { ERC20_ABI, SIMPLE_DEX_ABI }

// Type definitions
export interface Token {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
}
```

### **Step 4: TypeScript Types**

Buat file `src/types/defi.ts`:

```typescript
export interface Token {
  address: `0x${string}`;
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
  status: 'pending' | 'success' | 'failed';
  amountA?: string;
  amountB?: string;
  liquidity?: string;
}

export interface UserPosition {
  lpTokenBalance: bigint;
  shareOfPool: number;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
  estimatedValue: number;
}
```

---

## ⚙️ Part 4: Utility Functions

### **Step 1: Formatting Utilities**

Buat file `src/utils/formatters.ts`:

```typescript
/**
 * Validasi apakah string adalah angka valid
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '') return false
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

/**
 * Format angka dengan thousands separator
 */
export const formatNumber = (
  value: number | string,
  decimals: number = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0.00'

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Format token amount dengan symbol
 */
export const formatTokenAmount = (
  amount: string | number,
  tokenSymbol: string,
  decimals: number = 2
): string => {
  return `${formatNumber(amount, decimals)} ${tokenSymbol}`
}

/**
 * Format nilai USD
 */
export const formatUSD = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '$0.00'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${formatNumber(value, decimals)}%`
}

/**
 * Format angka besar dengan K, M, B suffix
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toFixed(2)
}

/**
 * Format address (0x1234...5678)
 */
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format timestamp menjadi human-readable
 */
export const formatTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp * 1000

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

/**
 * Parse user input menjadi BigInt dengan decimals
 */
export const parseTokenAmount = (
  amount: string,
  decimals: number
): bigint => {
  if (!isValidAmount(amount)) return 0n

  // Split integer dan decimal parts
  const [integer, decimal = ''] = amount.split('.')

  // Pad atau truncate decimal part
  const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals)

  // Combine dan convert ke BigInt
  const combined = integer + paddedDecimal
  return BigInt(combined)
}

/**
 * Format BigInt menjadi decimal string
 */
export const formatBigInt = (
  value: bigint,
  decimals: number,
  displayDecimals: number = 4
): string => {
  if (value === 0n) return '0'

  const str = value.toString().padStart(decimals + 1, '0')
  const integerPart = str.slice(0, -decimals) || '0'
  const decimalPart = str.slice(-decimals).slice(0, displayDecimals)

  // Remove trailing zeros
  const trimmedDecimal = decimalPart.replace(/0+$/, '')

  if (trimmedDecimal === '') return integerPart
  return `${integerPart}.${trimmedDecimal}`
}

/**
 * Cek apakah amount melebihi balance
 */
export const exceedsBalance = (
  amount: string,
  balance: bigint,
  decimals: number
): boolean => {
  if (!isValidAmount(amount)) return false
  const amountBigInt = parseTokenAmount(amount, decimals)
  return amountBigInt > balance
}

/**
 * Format balance dengan decimals dan symbol
 */
export const formatBalance = (
  balance: bigint,
  decimals: number,
  symbol: string,
  maxDecimals: number = 4
): string => {
  const formatted = formatBigInt(balance, decimals, maxDecimals)
  return `${formatted} ${symbol}`
}
```

### **Step 2: AMM Calculation Utilities**

Buat file `src/utils/calculations.ts`:

```typescript
/**
 * Calculate output amount untuk swap menggunakan constant product formula
 * Formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
 * Dengan fee: amountInWithFee = amountIn * (1000 - fee) / 1000
 */
export const calculateSwapOutput = (
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  feePercent: number = 3 // 0.3% = 3/1000
): bigint => {
  if (amountIn === 0n || reserveIn === 0n || reserveOut === 0n) {
    return 0n
  }

  // Apply fee: 0.3% fee means user gets 99.7% of input
  const FEE_DENOMINATOR = 1000n
  const fee = BigInt(feePercent)
  const amountInWithFee = (amountIn * (FEE_DENOMINATOR - fee)) / FEE_DENOMINATOR

  // Constant product formula
  const numerator = amountInWithFee * reserveOut
  const denominator = reserveIn + amountInWithFee

  return numerator / denominator
}

/**
 * Calculate price impact dari swap
 * Price impact = |newPrice - oldPrice| / oldPrice * 100
 */
export const calculatePriceImpact = (
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number => {
  if (reserveIn === 0n || reserveOut === 0n) return 0

  // Old price (reserveOut / reserveIn)
  const oldPrice = Number(reserveOut * 10000n / reserveIn) / 10000

  // New reserves after swap
  const newReserveIn = reserveIn + amountIn
  const amountOut = calculateSwapOutput(amountIn, reserveIn, reserveOut)
  const newReserveOut = reserveOut - amountOut

  // New price
  const newPrice = Number(newReserveOut * 10000n / newReserveIn) / 10000

  // Price impact percentage
  const impact = Math.abs((newPrice - oldPrice) / oldPrice) * 100

  return impact
}

/**
 * Calculate minimum amount out dengan slippage tolerance
 */
export const calculateMinAmountOut = (
  amountOut: bigint,
  slippageTolerance: number // e.g., 0.5 for 0.5%
): bigint => {
  const slippage = BigInt(Math.floor(slippageTolerance * 100))
  return (amountOut * (10000n - slippage)) / 10000n
}

/**
 * Calculate optimal liquidity amounts berdasarkan pool ratio
 */
export const calculateOptimalLiquidityAmounts = (
  amountADesired: bigint,
  amountBDesired: bigint,
  reserveA: bigint,
  reserveB: bigint
): { amountA: bigint; amountB: bigint } => {
  // Jika pool kosong, gunakan amounts yang diinginkan
  if (reserveA === 0n || reserveB === 0n) {
    return { amountA: amountADesired, amountB: amountBDesired }
  }

  // Calculate optimal amountB berdasarkan amountA
  const optimalAmountB = (amountADesired * reserveB) / reserveA

  if (optimalAmountB <= amountBDesired) {
    return { amountA: amountADesired, amountB: optimalAmountB }
  } else {
    // Calculate optimal amountA berdasarkan amountB
    const optimalAmountA = (amountBDesired * reserveA) / reserveB
    return { amountA: optimalAmountA, amountB: amountBDesired }
  }
}

/**
 * Calculate LP tokens yang akan di-mint
 * First liquidity: sqrt(amountA * amountB)
 * Subsequent: min(amountA * totalSupply / reserveA, amountB * totalSupply / reserveB)
 */
export const calculateLPTokens = (
  amountA: bigint,
  amountB: bigint,
  reserveA: bigint,
  reserveB: bigint,
  totalSupply: bigint
): bigint => {
  if (totalSupply === 0n) {
    // First liquidity provider
    return sqrt(amountA * amountB)
  }

  // Subsequent liquidity providers
  const liquidityA = (amountA * totalSupply) / reserveA
  const liquidityB = (amountB * totalSupply) / reserveB

  return liquidityA < liquidityB ? liquidityA : liquidityB
}

/**
 * Calculate token amounts dari LP tokens saat remove liquidity
 */
export const calculateTokenAmountsFromLP = (
  lpTokens: bigint,
  reserveA: bigint,
  reserveB: bigint,
  totalSupply: bigint
): { amountA: bigint; amountB: bigint } => {
  if (totalSupply === 0n) {
    return { amountA: 0n, amountB: 0n }
  }

  const amountA = (lpTokens * reserveA) / totalSupply
  const amountB = (lpTokens * reserveB) / totalSupply

  return { amountA, amountB }
}

/**
 * Calculate share of pool dari LP tokens
 */
export const calculatePoolShare = (
  lpTokens: bigint,
  totalSupply: bigint
): number => {
  if (totalSupply === 0n) return 0
  return Number((lpTokens * 10000n) / totalSupply) / 100
}

/**
 * Calculate APR dari trading fees
 * APR = (dailyVolume * feePercent * 365) / totalLiquidity * 100
 */
export const calculateAPR = (
  totalLiquidity: number,
  dailyVolume: number,
  feePercent: number = 0.3
): number => {
  if (totalLiquidity === 0) return 0

  const dailyFees = dailyVolume * (feePercent / 100)
  const annualFees = dailyFees * 365

  return (annualFees / totalLiquidity) * 100
}

/**
 * Integer square root untuk BigInt (untuk LP token calculation)
 */
export const sqrt = (value: bigint): bigint => {
  if (value < 0n) {
    throw new Error('Square root of negative numbers is not supported')
  }

  if (value < 2n) {
    return value
  }

  // Newton's method
  let x = value
  let y = (x + 1n) / 2n

  while (y < x) {
    x = y
    y = (x + value / x) / 2n
  }

  return x
}

/**
 * Calculate USD value dari token amount
 */
export const calculateUSDValue = (
  tokenAmount: bigint,
  tokenDecimals: number,
  pricePerToken: number
): number => {
  const amount = Number(tokenAmount) / Math.pow(10, tokenDecimals)
  return amount * pricePerToken
}
```

**🧮 Penjelasan Fungsi Matematika:**

**1. `calculateSwapOutput` - Constant Product Formula**
```
Input: 100 CAMP
Reserve CAMP: 1000
Reserve USDC: 2000

Step 1: Apply fee (0.3%)
amountInWithFee = 100 * (1000 - 3) / 1000 = 99.7 CAMP

Step 2: Calculate output
amountOut = (99.7 * 2000) / (1000 + 99.7)
          = 199,400 / 1099.7
          = 181.34 USDC
```

**2. `calculatePriceImpact`**
```
Old price = 2000 / 1000 = 2.0 USDC per CAMP
New reserves = 1099.7 CAMP, 1818.66 USDC
New price = 1818.66 / 1099.7 = 1.654 USDC per CAMP

Price impact = |1.654 - 2.0| / 2.0 * 100 = 17.3%
```

**3. `calculateLPTokens` - First Liquidity**
```
amountA = 1000 CAMP
amountB = 2000 USDC

LP tokens = sqrt(1000 * 2000) = sqrt(2,000,000) = 1414.21
```

---

## 🔌 Part 5: Custom React Hooks

### **Hook 1: useTokenBalance**

Buat file `src/hooks/useTokenBalance.ts`:

```typescript
import { useAccount, useReadContract } from 'wagmi'
import { ERC20_ABI, CONTRACTS } from '../constants'
import type { Token } from '../types/defi'

export const useTokenBalance = (token?: Token) => {
  const { address } = useAccount()

  // Get token balance
  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance
  } = useReadContract({
    address: token?.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!token,
      refetchInterval: 30000, // Refetch setiap 30 detik
    }
  })

  // Get allowance untuk SimpleDEX contract
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance
  } = useReadContract({
    address: token?.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.SIMPLE_DEX] : undefined,
    query: {
      enabled: !!address && !!token,
      refetchInterval: 30000,
    }
  })

  return {
    balance: (balance as bigint) ?? 0n,
    allowance: (allowance as bigint) ?? 0n,
    isLoading: isLoadingBalance || isLoadingAllowance,
    refetch: () => {
      refetchBalance()
      refetchAllowance()
    }
  }
}
```

**📝 Cara Kerja:**
- `useReadContract` membaca data dari blockchain tanpa gas fee
- `balanceOf`: Mendapatkan balance token user
- `allowance`: Cek berapa banyak SimpleDEX boleh menggunakan token user
- `refetchInterval`: Auto-update setiap 30 detik
- Return `balance` dan `allowance` sebagai BigInt

### **Hook 2: usePoolData**

Buat file `src/hooks/usePoolData.ts`:

```typescript
import { useReadContract } from 'wagmi'
import { SIMPLE_DEX_ABI, CONTRACTS } from '../constants'
import type { PoolInfo } from '../types/defi'

export const usePoolData = () => {
  // Get pool info dari SimpleDEX contract
  const {
    data: poolData,
    isLoading,
    refetch
  } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: SIMPLE_DEX_ABI,
    functionName: 'getPoolInfo',
    query: {
      refetchInterval: 15000, // Refetch setiap 15 detik untuk real-time data
    }
  })

  // Parse data menjadi PoolInfo object
  const poolInfo: PoolInfo | null = poolData ? {
    reserveA: (poolData as any)[0] as bigint,
    reserveB: (poolData as any)[1] as bigint,
    totalLiquidity: (poolData as any)[2] as bigint,
    price: (poolData as any)[3] as bigint,
  } : null

  // Calculate current price (USDC per CAMP)
  const currentPrice = poolInfo && poolInfo.reserveA > 0n
    ? Number(poolInfo.reserveB * 1000000n / poolInfo.reserveA) / 1000000
    : 0

  return {
    poolInfo,
    currentPrice,
    isLoading,
    refetch
  }
}
```

**📊 Pool Info Structure:**
```typescript
{
  reserveA: 1000000000000000000000n,  // 1000 CAMP (18 decimals)
  reserveB: 2000000000n,               // 2000 USDC (6 decimals)
  totalLiquidity: 1414213562373095048n, // 1414.21 LP tokens
  price: 2000000n                      // 2.0 USDC per CAMP
}
```

### **Hook 3: useSwap**

Buat file `src/hooks/useSwap.ts`:

```typescript
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'react-hot-toast'
import { SIMPLE_DEX_ABI, ERC20_ABI, CONTRACTS, TOKENS, DEX_CONFIG } from '../constants'
import { usePoolData } from './usePoolData'
import {
  parseTokenAmount,
  formatBigInt,
  calculateSwapOutput,
  calculatePriceImpact,
  calculateMinAmountOut
} from '../utils'
import type { SwapData, Token } from '../types/defi'
import { config } from '../App'

export const useSwap = () => {
  const { address } = useAccount()
  const { poolInfo } = usePoolData()
  const { writeContractAsync } = useWriteContract()
  const [isSwapping, setIsSwapping] = useState(false)

  /**
   * Calculate swap details (output, price impact, fee)
   */
  const calculateSwap = (
    amountIn: string,
    tokenIn: Token,
    tokenOut: Token
  ): SwapData | null => {
    if (!poolInfo || !amountIn || parseFloat(amountIn) === 0) {
      return null
    }

    // Parse input amount
    const amountInBigInt = parseTokenAmount(amountIn, tokenIn.decimals)

    // Determine reserves berdasarkan swap direction
    const isTokenAToB = tokenIn.symbol === TOKENS.CAMP.symbol
    const reserveIn = isTokenAToB ? poolInfo.reserveA : poolInfo.reserveB
    const reserveOut = isTokenAToB ? poolInfo.reserveB : poolInfo.reserveA

    // Calculate output menggunakan AMM formula
    const amountOutBigInt = calculateSwapOutput(
      amountInBigInt,
      reserveIn,
      reserveOut,
      3 // 0.3% fee
    )

    const amountOut = formatBigInt(amountOutBigInt, tokenOut.decimals, 6)

    // Calculate price impact
    const priceImpact = calculatePriceImpact(amountInBigInt, reserveIn, reserveOut)

    // Calculate fee
    const fee = (parseFloat(amountIn) * DEX_CONFIG.FEE_PERCENT / 100).toFixed(6)

    return {
      tokenIn,
      tokenOut,
      amountIn,
      amountOut,
      priceImpact,
      fee: `${fee} ${tokenIn.symbol}`
    }
  }

  /**
   * Ensure token approval sebelum swap
   */
  const ensureTokenApproval = async (
    token: Token,
    amount: bigint
  ): Promise<void> => {
    try {
      const hash = await writeContractAsync({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.SIMPLE_DEX, amount]
      })

      toast.loading('Approving token...', { id: 'approve' })

      // Wait for approval confirmation
      await waitForTransactionReceipt(config, { hash })

      toast.success('Token approved!', { id: 'approve' })
    } catch (error: any) {
      toast.error(`Approval failed: ${error.message}`, { id: 'approve' })
      throw error
    }
  }

  /**
   * Execute swap transaction
   */
  const executeSwap = async (swapData: SwapData): Promise<void> => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    setIsSwapping(true)

    try {
      // Parse amounts
      const amountIn = parseTokenAmount(swapData.amountIn, swapData.tokenIn.decimals)
      const amountOut = parseTokenAmount(swapData.amountOut, swapData.tokenOut.decimals)

      // Calculate minimum output dengan slippage protection
      const minAmountOut = calculateMinAmountOut(
        amountOut,
        DEX_CONFIG.SLIPPAGE_TOLERANCE
      )

      // Step 1: Ensure token approval
      toast.loading('Checking token approval...', { id: 'swap' })
      await ensureTokenApproval(swapData.tokenIn, amountIn)

      // Step 2: Execute swap
      const isTokenAToB = swapData.tokenIn.symbol === TOKENS.CAMP.symbol
      const functionName = isTokenAToB ? 'swapAforB' : 'swapBforA'

      toast.loading('Executing swap...', { id: 'swap' })

      const hash = await writeContractAsync({
        address: CONTRACTS.SIMPLE_DEX,
        abi: SIMPLE_DEX_ABI,
        functionName,
        args: [amountIn, minAmountOut]
      })

      // Step 3: Wait for confirmation
      toast.loading('Waiting for confirmation...', { id: 'swap' })

      await waitForTransactionReceipt(config, { hash })

      toast.success(
        `Swapped ${swapData.amountIn} ${swapData.tokenIn.symbol} for ${swapData.amountOut} ${swapData.tokenOut.symbol}!`,
        { id: 'swap', duration: 5000 }
      )
    } catch (error: any) {
      console.error('Swap error:', error)
      toast.error(
        error.message.includes('rejected')
          ? 'Transaction rejected'
          : `Swap failed: ${error.shortMessage || error.message}`,
        { id: 'swap' }
      )
    } finally {
      setIsSwapping(false)
    }
  }

  return {
    calculateSwap,
    executeSwap,
    isSwapping
  }
}

// Helper function (import dari wagmi/actions)
async function waitForTransactionReceipt(
  config: any,
  { hash }: { hash: `0x${string}` }
) {
  return new Promise((resolve, reject) => {
    const checkReceipt = async () => {
      try {
        // Implementasi sederhana - gunakan wagmi's waitForTransactionReceipt
        const receipt = await config.publicClient.waitForTransactionReceipt({ hash })
        resolve(receipt)
      } catch (error) {
        reject(error)
      }
    }
    checkReceipt()
  })
}
```

**🔄 Swap Flow:**
```
1. User memasukkan amount → calculateSwap() dipanggil
2. Calculate output menggunakan x*y=k formula
3. Calculate price impact dan fee
4. User klik "Swap" → executeSwap() dipanggil
5. Check/request token approval
6. Execute swap transaction
7. Wait for confirmation
8. Show success/error notification
```

### **Hook 4: useLiquidity**

Buat file `src/hooks/useLiquidity.ts`:

```typescript
import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { toast } from 'react-hot-toast'
import { SIMPLE_DEX_ABI, ERC20_ABI, CONTRACTS, TOKENS } from '../constants'
import { usePoolData } from './usePoolData'
import {
  parseTokenAmount,
  formatBigInt,
  calculateOptimalLiquidityAmounts,
  calculateLPTokens,
  calculateTokenAmountsFromLP,
  calculatePoolShare
} from '../utils'
import type { LiquidityData, UserPosition } from '../types/defi'
import { config } from '../App'

export const useLiquidity = () => {
  const { address } = useAccount()
  const { poolInfo } = usePoolData()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)

  // Get user's LP token balance
  const { data: lpBalance } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000
    }
  })

  /**
   * Calculate add liquidity details
   */
  const calculateAddLiquidity = (
    amountA: string,
    amountB: string
  ): LiquidityData | null => {
    if (!poolInfo || !amountA || !amountB) {
      return null
    }

    // Parse amounts
    const amountABigInt = parseTokenAmount(amountA, TOKENS.CAMP.decimals)
    const amountBBigInt = parseTokenAmount(amountB, TOKENS.USDC.decimals)

    // Calculate optimal amounts berdasarkan pool ratio
    const optimal = calculateOptimalLiquidityAmounts(
      amountABigInt,
      amountBBigInt,
      poolInfo.reserveA,
      poolInfo.reserveB
    )

    // Calculate LP tokens yang akan diterima
    const lpTokens = calculateLPTokens(
      optimal.amountA,
      optimal.amountB,
      poolInfo.reserveA,
      poolInfo.reserveB,
      poolInfo.totalLiquidity
    )

    // Calculate share of pool
    const shareOfPool = calculatePoolShare(
      lpTokens,
      poolInfo.totalLiquidity + lpTokens
    )

    return {
      tokenA: TOKENS.CAMP,
      tokenB: TOKENS.USDC,
      amountA: formatBigInt(optimal.amountA, TOKENS.CAMP.decimals, 6),
      amountB: formatBigInt(optimal.amountB, TOKENS.USDC.decimals, 6),
      lpTokens: formatBigInt(lpTokens, 18, 6),
      shareOfPool
    }
  }

  /**
   * Execute add liquidity
   */
  const executeAddLiquidity = async (liquidityData: LiquidityData): Promise<void> => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    setIsLoading(true)

    try {
      const amountA = parseTokenAmount(liquidityData.amountA, TOKENS.CAMP.decimals)
      const amountB = parseTokenAmount(liquidityData.amountB, TOKENS.USDC.decimals)

      // Step 1: Approve both tokens
      toast.loading('Approving tokens...', { id: 'liquidity' })

      const approveA = writeContractAsync({
        address: TOKENS.CAMP.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.SIMPLE_DEX, amountA]
      })

      const approveB = writeContractAsync({
        address: TOKENS.USDC.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.SIMPLE_DEX, amountB]
      })

      await Promise.all([approveA, approveB])

      // Step 2: Add liquidity
      toast.loading('Adding liquidity...', { id: 'liquidity' })

      const hash = await writeContractAsync({
        address: CONTRACTS.SIMPLE_DEX,
        abi: SIMPLE_DEX_ABI,
        functionName: 'addLiquidity',
        args: [amountA, amountB]
      })

      // Step 3: Wait for confirmation
      toast.loading('Waiting for confirmation...', { id: 'liquidity' })

      await waitForTransactionReceipt(config, { hash })

      toast.success(
        `Added ${liquidityData.amountA} CAMP and ${liquidityData.amountB} USDC to pool!`,
        { id: 'liquidity', duration: 5000 }
      )
    } catch (error: any) {
      console.error('Add liquidity error:', error)
      toast.error(
        error.message.includes('rejected')
          ? 'Transaction rejected'
          : `Failed: ${error.shortMessage || error.message}`,
        { id: 'liquidity' }
      )
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Execute remove liquidity
   */
  const executeRemoveLiquidity = async (percentage: number): Promise<void> => {
    if (!address || !lpBalance) {
      toast.error('No liquidity position found')
      return
    }

    setIsLoading(true)

    try {
      // Calculate LP amount to remove
      const lpAmount = ((lpBalance as bigint) * BigInt(percentage)) / 100n

      toast.loading('Removing liquidity...', { id: 'liquidity' })

      const hash = await writeContractAsync({
        address: CONTRACTS.SIMPLE_DEX,
        abi: SIMPLE_DEX_ABI,
        functionName: 'removeLiquidity',
        args: [lpAmount]
      })

      toast.loading('Waiting for confirmation...', { id: 'liquidity' })

      await waitForTransactionReceipt(config, { hash })

      toast.success(
        `Removed ${percentage}% of your liquidity!`,
        { id: 'liquidity', duration: 5000 }
      )
    } catch (error: any) {
      console.error('Remove liquidity error:', error)
      toast.error(
        error.message.includes('rejected')
          ? 'Transaction rejected'
          : `Failed: ${error.shortMessage || error.message}`,
        { id: 'liquidity' }
      )
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Get user's liquidity position
   */
  const getUserPosition = (): UserPosition | null => {
    if (!poolInfo || !lpBalance || lpBalance === 0n) {
      return null
    }

    const lpTokenBalance = lpBalance as bigint

    // Calculate share of pool
    const shareOfPool = calculatePoolShare(lpTokenBalance, poolInfo.totalLiquidity)

    // Calculate token amounts
    const { amountA, amountB } = calculateTokenAmountsFromLP(
      lpTokenBalance,
      poolInfo.reserveA,
      poolInfo.reserveB,
      poolInfo.totalLiquidity
    )

    // Estimate USD value (simplified - assume 1 USDC = $1)
    const estimatedValue = Number(formatBigInt(amountB, TOKENS.USDC.decimals, 2)) * 2

    return {
      lpTokenBalance,
      shareOfPool,
      tokenAAmount: amountA,
      tokenBAmount: amountB,
      estimatedValue
    }
  }

  return {
    calculateAddLiquidity,
    executeAddLiquidity,
    executeRemoveLiquidity,
    getUserPosition,
    isLoading
  }
}

// Helper function
async function waitForTransactionReceipt(
  config: any,
  { hash }: { hash: `0x${string}` }
) {
  return new Promise((resolve, reject) => {
    const checkReceipt = async () => {
      try {
        const receipt = await config.publicClient.waitForTransactionReceipt({ hash })
        resolve(receipt)
      } catch (error) {
        reject(error)
      }
    }
    checkReceipt()
  })
}
```

**💧 Liquidity Flow:**
```
Add Liquidity:
1. User masukkan amount CAMP → auto-calculate USDC (atau sebaliknya)
2. calculateAddLiquidity() → optimal amounts berdasarkan pool ratio
3. Calculate LP tokens yang akan diterima
4. User klik "Add" → approve kedua tokens
5. Execute addLiquidity transaction
6. Receive LP tokens

Remove Liquidity:
1. Show user's position (LP tokens, share %, token amounts)
2. User pilih percentage (25%, 50%, 75%, 100%)
3. Calculate tokens yang akan diterima
4. Execute removeLiquidity transaction
5. Burn LP tokens, receive CAMP + USDC
```

---

## 🎨 Part 6: Main App Setup

### **Step 1: Configure Wagmi & RainbowKit**

Buat file `src/App.tsx`:

```typescript
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'
import { Toaster } from 'react-hot-toast'
import DEXContainer from './components/DEXContainer'
import Header from './components/Header'

// Define Lisk Sepolia Testnet
const liskSepolia = defineChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lisk Sepolia Explorer',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
})

// Configure Wagmi
export const config = getDefaultConfig({
  appName: 'SimpleDEX',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  chains: [liskSepolia],
  ssr: false,
})

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <DEXContainer />
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#f8fafc',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#f8fafc',
                  },
                },
              }}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

**🔧 Penjelasan Konfigurasi:**

1. **Lisk Sepolia Chain Definition**
   - Chain ID: 4202
   - RPC: https://rpc.sepolia-api.lisk.com
   - Explorer: https://sepolia-blockscout.lisk.com

2. **Wagmi Config**
   - `getDefaultConfig`: Setup otomatis untuk RainbowKit + Wagmi
   - `projectId`: WalletConnect project ID dari environment variable
   - `chains`: Array of supported chains (hanya Lisk Sepolia)

3. **QueryClient**
   - State management untuk blockchain data
   - `refetchOnWindowFocus: false` - Tidak auto-refetch saat tab aktif
   - `retry: 1` - Retry 1x jika request gagal

4. **Providers Hierarchy**
   ```
   WagmiProvider
   └── QueryClientProvider
       └── RainbowKitProvider
           └── App Content
   ```

### **Step 2: Entry Point**

Buat file `src/main.tsx`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### **Step 3: Create Placeholder Components**

Untuk sementara, buat placeholder components agar app bisa running:

**`src/components/Header.tsx`:**

```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Header() {
  return (
    <header className="glass border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔄</div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">SimpleDEX</h1>
              <p className="text-sm text-slate-400">Decentralized Exchange on Lisk</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Live</span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
```

**`src/components/DEXContainer.tsx`:**

```typescript
import { useAccount } from 'wagmi'

export default function DEXContainer() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">👛</div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-slate-400">
            Connect your wallet to start trading on SimpleDEX
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Swap Interface</h2>
      <p className="text-slate-400">
        Swap interface akan ditambahkan di sini...
      </p>
    </div>
  )
}
```

---

## 🚀 Part 7: Running the Application

### **Step 1: Run Development Server**

```bash
# Jalankan dev server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173/`

### **Step 2: Test Wallet Connection**

1. ✅ Click "Connect Wallet" di header
2. ✅ Pilih MetaMask (atau wallet lain)
3. ✅ Approve connection
4. ✅ Switch network ke Lisk Sepolia jika diminta

### **Step 3: Verify Connection**

Setelah terhubung, Anda harus melihat:
- ✅ Address Anda di header (0x1234...5678)
- ✅ Green "Live" indicator
- ✅ Wallet balance (jika ada)
- ✅ "Connect Your Wallet" screen hilang

---

## 📦 Part 8: Package.json

Buat file `package.json` dengan scripts yang diperlukan:

```json
{
  "name": "simple-dex-ui",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@rainbow-me/rainbowkit": "^2.1.0",
    "@tanstack/react-query": "^5.28.0",
    "lucide-react": "^0.index: 363.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.12.0",
    "viem": "^2.9.0",
    "wagmi": "^2.5.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0-alpha.25",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "tailwindcss": "^4.0.0-alpha.25",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

---

## 🎯 Part 9: Next Steps - Building Full UI Components

Sampai di sini, Anda sudah memiliki:
- ✅ Project structure yang lengkap
- ✅ All utilities (formatters, calculations, hooks)
- ✅ Wagmi + RainbowKit configured untuk Lisk Sepolia
- ✅ Basic app yang bisa connect wallet

**Untuk melanjutkan membangun full UI, Anda perlu membuat:**

### **1. SwapInterface Component** (`src/components/SwapInterface.tsx`)
- Input fields untuk token amounts
- Token selector (CAMP ↔ USDC)
- Swap direction button
- Real-time price calculation
- Slippage settings
- Price impact warning
- Execute swap button

### **2. LiquidityInterface Component** (`src/components/LiquidityInterface.tsx`)
- Add Liquidity tab:
  - Dual token input (auto-calculate ratio)
  - LP tokens preview
  - Pool share percentage
- Remove Liquidity tab:
  - User position display
  - Percentage selector (25%, 50%, 75%, 100%)
  - Expected output preview

### **3. PoolStats Component** (`src/components/PoolStats.tsx`)
- Total Value Locked (TVL)
- 24h Volume
- Current Price
- APR calculation
- Pool composition (reserves)

### **4. PriceChart Component** (`src/components/PriceChart.tsx`)
- Real-time price chart menggunakan Recharts
- Time frame selector (1H, 1D, 1W, 1M)
- Historical data dari blockchain events

### **5. TransactionHistory Component** (`src/components/TransactionHistory.tsx`)
- Real-time transaction list
- Filter by type (Swap, Add, Remove)
- Links to block explorer

---

## 🔥 Quick Reference - Key Hooks Usage

### **1. Reading Token Balance**
```typescript
import { useTokenBalance } from './hooks/useTokenBalance'
import { TOKENS } from './constants'

function MyComponent() {
  const { balance, allowance } = useTokenBalance(TOKENS.CAMP)

  return <div>Balance: {formatBalance(balance, 18, 'CAMP')}</div>
}
```

### **2. Reading Pool Data**
```typescript
import { usePoolData } from './hooks/usePoolData'

function MyComponent() {
  const { poolInfo, currentPrice } = usePoolData()

  if (!poolInfo) return <div>Loading...</div>

  return (
    <div>
      <p>Reserve CAMP: {formatBigInt(poolInfo.reserveA, 18)}</p>
      <p>Reserve USDC: {formatBigInt(poolInfo.reserveB, 6)}</p>
      <p>Price: ${currentPrice.toFixed(4)}</p>
    </div>
  )
}
```

### **3. Executing a Swap**
```typescript
import { useState } from 'react'
import { useSwap } from './hooks/useSwap'
import { TOKENS } from './constants'

function SwapComponent() {
  const [amountIn, setAmountIn] = useState('')
  const { calculateSwap, executeSwap, isSwapping } = useSwap()

  const swapData = calculateSwap(amountIn, TOKENS.CAMP, TOKENS.USDC)

  const handleSwap = () => {
    if (swapData) {
      executeSwap(swapData)
    }
  }

  return (
    <div>
      <input
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        placeholder="Amount"
      />
      {swapData && (
        <div>
          <p>You receive: {swapData.amountOut} USDC</p>
          <p>Price impact: {swapData.priceImpact.toFixed(2)}%</p>
        </div>
      )}
      <button onClick={handleSwap} disabled={isSwapping}>
        {isSwapping ? 'Swapping...' : 'Swap'}
      </button>
    </div>
  )
}
```

### **4. Adding Liquidity**
```typescript
import { useState } from 'react'
import { useLiquidity } from './hooks/useLiquidity'

function LiquidityComponent() {
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const { calculateAddLiquidity, executeAddLiquidity, isLoading } = useLiquidity()

  const liquidityData = calculateAddLiquidity(amountA, amountB)

  const handleAdd = () => {
    if (liquidityData) {
      executeAddLiquidity(liquidityData)
    }
  }

  return (
    <div>
      <input
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
        placeholder="CAMP Amount"
      />
      <input
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
        placeholder="USDC Amount"
      />
      {liquidityData && (
        <div>
          <p>LP Tokens: {liquidityData.lpTokens}</p>
          <p>Pool Share: {liquidityData.shareOfPool.toFixed(4)}%</p>
        </div>
      )}
      <button onClick={handleAdd} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Liquidity'}
      </button>
    </div>
  )
}
```

---

## 🎓 Learning Outcomes

Setelah menyelesaikan Part 5 ini, Anda telah belajar:

### **Technical Skills:**
- ✅ Setup modern React project dengan Vite + TypeScript
- ✅ Configure Wagmi untuk blockchain interactions
- ✅ Implement wallet connection dengan RainbowKit
- ✅ Create custom React hooks untuk DeFi operations
- ✅ Handle BigInt untuk precise token calculations
- ✅ Implement AMM formulas dalam TypeScript
- ✅ Setup TailwindCSS untuk modern UI

### **DeFi Concepts:**
- ✅ Constant Product Formula (x × y = k) implementation
- ✅ Price impact calculation
- ✅ Slippage protection
- ✅ LP token mechanics
- ✅ Token approval flow
- ✅ Transaction lifecycle (approval → execution → confirmation)

### **Best Practices:**
- ✅ Separation of concerns (hooks, utils, components)
- ✅ Type safety dengan TypeScript
- ✅ Error handling dengan try-catch dan user feedback
- ✅ Loading states untuk better UX
- ✅ Real-time data updates dengan refetchInterval
- ✅ Responsive design dengan TailwindCSS

---

## 📚 Resources

### **Documentation:**
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://www.rainbowkit.com)
- [Viem Docs](https://viem.sh)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Lisk Sepolia Testnet](https://docs.lisk.com/building-on-lisk/testnet)

### **Tools:**
- [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com)
- [Lisk Sepolia Explorer](https://sepolia-blockscout.lisk.com)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

### **Next Tutorials:**
Untuk implementasi lengkap semua UI components (SwapInterface, LiquidityInterface, PoolStats, dll), lihat repository example atau lanjutkan dengan membangun components sendiri menggunakan hooks yang sudah tersedia.

---

## 🐛 Troubleshooting

### **"Cannot read properties of undefined"**
- ✅ Pastikan wallet sudah connected
- ✅ Check network adalah Lisk Sepolia (Chain ID 4202)
- ✅ Verify contract addresses di `.env.local` benar

### **"User rejected transaction"**
- ✅ Normal jika user cancel di wallet
- ✅ App akan show error toast

### **"Insufficient funds"**
- ✅ Pastikan ada ETH untuk gas fees
- ✅ Dapatkan dari [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com)

### **"Allowance too low"**
- ✅ Hook `useSwap` dan `useLiquidity` sudah handle approval otomatis
- ✅ Jika masih error, coba manual approve dengan lebih banyak

### **RPC Errors**
- ✅ Lisk Sepolia RPC kadang slow, tunggu beberapa saat
- ✅ Refresh page dan coba lagi

---

## 🎉 Summary

Congratulations! 🎊

Anda telah berhasil membangun **foundation yang solid** untuk SimpleDEX frontend:

- ✅ **Complete project structure** dengan best practices
- ✅ **All utilities** untuk formatting dan AMM calculations
- ✅ **Custom hooks** untuk semua DeFi operations
- ✅ **Wagmi + RainbowKit** configured untuk Lisk Sepolia
- ✅ **Type-safe** dengan TypeScript
- ✅ **Ready to build** full UI components

**Next Step:** Build UI components (SwapInterface, LiquidityInterface, dll) menggunakan hooks yang sudah tersedia, atau deploy basic version ini dan iterate!

**Happy Building! 🚀**

---

**Prepared by:** Ethereum Jakarta x Lisk
**Part 5 - Frontend Integration**
**Version:** 1.0
