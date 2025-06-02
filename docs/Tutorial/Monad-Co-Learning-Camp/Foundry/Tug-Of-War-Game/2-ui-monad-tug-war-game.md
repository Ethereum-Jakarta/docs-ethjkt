---
sidebar_position: 2
title: 2. Integrasi Frontend dengan TugWar Game
description: Membuat frontend React dengan Vite untuk berinteraksi dengan TugWar Game smart contract
keywords: [frontend, react, vite, tugwar game, web3, wagmi, rainbowkit, tailwindcss, game, integration]
---

# Integrasi Frontend dengan TugWar Game

Pada bagian ini, kita akan membuat frontend sederhana menggunakan React, Vite, dan TailwindCSS untuk berinteraksi dengan smart contract TugWar Game yang telah kita deploy. Frontend ini akan memungkinkan pengguna untuk bermain tug of war secara real-time dan melihat statistik permainan.

![Tampilan Frontend TugWar Game]

## 1. Setup Proyek Frontend

Mari mulai dengan membuat proyek React + Vite baru dengan TypeScript.

### 1.1. Membuat Proyek Vite

```bash
npm create vite@latest tugwar-game-ui -- --template react-ts
cd tugwar-game-ui
```

### 1.2. Menginstal Dependensi

Install paket yang diperlukan untuk mengintegrasikan frontend dengan blockchain:

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query react-hot-toast lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

Penjelasan dependensi:
- **@rainbow-me/rainbowkit**: Komponen UI untuk koneksi wallet
- **wagmi**: Library untuk berinteraksi dengan kontrak Ethereum
- **viem**: Library Ethereum untuk TypeScript
- **@tanstack/react-query**: Untuk manajemen state dan caching data
- **react-hot-toast**: Untuk menampilkan notifikasi
- **lucide-react**: Icon library untuk UI yang menarik
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
@keyframes rope-shake {
  0%,
  100% {
    transform: translateX(0) translateY(-50%);
  }
  25% {
    transform: translateX(-3px) translateY(-50%);
  }
  75% {
    transform: translateX(3px) translateY(-50%);
  }
}

.rope-shake {
  animation: rope-shake 0.4s ease-in-out;
}

@keyframes victory-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
}

.victory-pulse {
  animation: victory-pulse 1.2s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
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
  0%,
  100% {
    box-shadow: 0 0 5px rgba(131, 110, 249, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(131, 110, 249, 0.6), 0 0 30px rgba(131, 110, 249, 0.4);
  }
}

@keyframes glow-berry {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(160, 5, 93, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(160, 5, 93, 0.6), 0 0 30px rgba(160, 5, 93, 0.4);
  }
}

.glow-purple {
  animation: glow-purple 2s ease-in-out infinite;
}

.glow-berry {
  animation: glow-berry 2s ease-in-out infinite;
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

/* Monad brand gradients */
.gradient-monad-primary {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
}

.gradient-monad-secondary {
  background: linear-gradient(135deg, var(--monad-blue) 0%, var(--monad-black) 100%);
}

.text-gradient-monad {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

```

## 3. Struktur Proyek

Berikut adalah struktur proyek yang akan kita buat:

```
src/
├── components/
│   ├── Container.tsx      # Komponen utama yang berisi logika game
│   ├── Header.tsx         # Header dengan tombol connect wallet
│   ├── GameBoard.tsx      # Papan permainan dengan rope visualization
│   ├── GameControls.tsx   # Tombol untuk pull team 1 dan team 2
│   ├── GameStats.tsx      # Statistik permainan dan score
│   └── GameHistory.tsx    # Riwayat permainan
├── constants/
│   ├── TUGWAR_ABI.json    # ABI untuk kontrak TugWar
│   └── index.tsx          # Export konstanta
├── types/
│   └── game.ts            # Type definitions untuk game
├── App.tsx                # Komponen root dengan provider
├── main.tsx               # Entry point
└── index.css              # Stylesheet utama
```

## 4. Menyiapkan Konstanta dan ABI

### 4.1. ABI TugWar Contract

Buat folder `src/constants` dan file `TUGWAR_ABI.json` dengan ABI dari kontrak TugWar:

```json
[
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "GameNotStarted",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "GameOver",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidMaxScoreDifference",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OnlyOwner",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "resetter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "newMaxScoreDifference",
                "type": "uint8"
            }
        ],
        "name": "GameReset",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "winningTeam",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "finalScore1",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "finalScore2",
                "type": "uint8"
            }
        ],
        "name": "GameWon",
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
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isTeam1",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "int8",
                "name": "newRopePosition",
                "type": "int8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "team1Score",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "team2Score",
                "type": "uint8"
            }
        ],
        "name": "PullExecuted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "canStartGame",
        "outputs": [
            {
                "internalType": "bool",
                "name": "canStart",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gamesPlayed",
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
        "name": "getGameInfo",
        "outputs": [
            {
                "internalType": "int8",
                "name": "currentRopePos",
                "type": "int8"
            },
            {
                "internalType": "uint8",
                "name": "score1",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "score2",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "maxDiff",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "winner",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "pulls",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "games",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPrediction",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "predictedWinner",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "confidence",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "teamNumber",
                "type": "uint8"
            }
        ],
        "name": "getTeamStats",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "isWinning",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "scoreAdvantage",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWinStatus",
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
        "inputs": [],
        "name": "maxScoreDifference",
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
                "internalType": "bool",
                "name": "isTeam1",
                "type": "bool"
            }
        ],
        "name": "pull",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_maxScoreDifference",
                "type": "uint8"
            }
        ],
        "name": "reSet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ropePosition",
        "outputs": [
            {
                "internalType": "int8",
                "name": "",
                "type": "int8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "team1Score",
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
        "inputs": [],
        "name": "team2Score",
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
        "inputs": [],
        "name": "totalPulls",
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
import TUGWAR_ABI_JSON from "./TUGWAR_ABI.json"

export const TUGWAR_ABI = TUGWAR_ABI_JSON;
export const TUGWAR_CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_TUGWAR_ADDRESS";
```

> ⚠️ **Penting**: Ganti `0xYOUR_DEPLOYED_TUGWAR_ADDRESS` dengan alamat kontrak TugWar yang sudah Anda deploy ke Monad Testnet.

### 4.3. Type Definitions

Buat file `src/types/game.ts`:

```typescript
export interface GameInfo {
  ropePosition: number;
  team1Score: number;
  team2Score: number;
  maxScoreDifference: number;
  winner: number;
  totalPulls: number;
  gamesPlayed: number;
}

export interface TeamStats {
  score: number;
  isWinning: boolean;
  scoreAdvantage: number;
}

export interface GamePrediction {
  predictedWinner: number;
  confidence: number;
}

export interface GameEvent {
  type: 'pull' | 'win' | 'reset';
  player?: string;
  team?: number;
  timestamp: number;
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
import Container from "./components/Container";

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
  appName: 'TugWar Game',
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
          <div className="min-h-scree">
            <Header />
            <Container />
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

## 6. Membuat Komponen Header

Buat file `src/components/Header.tsx`:

```typescript
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Users, Trophy, Zap } from "lucide-react"

const Header = () => {
  return (
    <header className="glass-dark sticky top-0 z-50 py-4 border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center space-x-1 p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10">
              <Users className="w-5 h-5" style={{ color: "#836EF9" }} />
              <Zap className="w-4 h-4" style={{ color: "#FBFAF9" }} />
              <Trophy className="w-5 h-5" style={{ color: "#A0055D" }} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient-monad font-inter">TugWar</h1>
            <p className="text-xs font-medium" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Powered by Monad Testnet
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#836EF9" }}></div>
              <span>Live Game</span>
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

## 7. Membuat Game Board

Buat file `src/components/GameBoard.tsx`:

```typescript
import type { GameInfo } from "../types/game"

interface GameBoardProps {
  gameInfo: GameInfo
  isShaking: boolean
}

const GameBoard = ({ gameInfo, isShaking }: GameBoardProps) => {
  const { ropePosition, team1Score, team2Score, winner } = gameInfo

  // Calculate rope position for visualization (center at position 0)
  const ropeVisualPosition = Math.max(-10, Math.min(10, ropePosition))
  const ropePercentage = ((ropeVisualPosition + 10) / 20) * 100

  const getRopeEmoji = () => {
    if (winner === 1) return "👑"
    if (winner === 2) return "👑"
    return "⚡"
  }

  return (
    <div className="glass rounded-2xl p-8 card-hover border border-white/10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-4 text-gradient-monad font-inter font-bold">Battle Arena</h2>
        <div className="flex justify-between items-center">
          <div
            className={`flex items-center space-x-3 p-4 rounded-xl border ${winner === 1 ? "victory-pulse glow-purple" : ""}`}
            style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)",
            }}
          >
            <span className="text-3xl">🟣</span>
            <div>
              <div className="font-medium text-sm" style={{ color: "#836EF9" }}>
                Team 1
              </div>
              <div className="font-bold text-2xl" style={{ color: "#FBFAF9" }}>
                {team1Score}
              </div>
            </div>
          </div>

          <div
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
              VS
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 p-4 rounded-xl border ${winner === 2 ? "victory-pulse glow-berry" : ""}`}
            style={{
              backgroundColor: "rgba(160, 5, 93, 0.1)",
              borderColor: "rgba(160, 5, 93, 0.3)",
            }}
          >
            <div className="text-right">
              <div className="font-medium text-sm" style={{ color: "#A0055D" }}>
                Team 2
              </div>
              <div className="font-bold text-2xl" style={{ color: "#FBFAF9" }}>
                {team2Score}
              </div>
            </div>
            <span className="text-3xl">🔴</span>
          </div>
        </div>
      </div>

      {/* Rope Visualization */}
      <div className="relative mb-8">
        <div className="flex justify-between text-sm mb-4 px-4" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
          <span className="font-medium">Team 1 Territory</span>
          <span className="font-medium">Neutral Zone</span>
          <span className="font-medium">Team 2 Territory</span>
        </div>

        <div
          className="relative h-16 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm"
          style={{
            background: `linear-gradient(to right, 
                 rgba(131, 110, 249, 0.2) 0%, 
                 rgba(14, 16, 15, 0.3) 50%, 
                 rgba(160, 5, 93, 0.2) 100%)`,
          }}
        >
          {/* Center line */}
          <div
            className="absolute left-1/2 top-2 bottom-2 w-0.5 transform -translate-x-1/2 rounded-full"
            style={{ backgroundColor: "rgba(251, 250, 249, 0.4)" }}
          ></div>

          {/* Grid lines */}
          <div
            className="absolute left-1/4 top-4 bottom-4 w-px"
            style={{ backgroundColor: "rgba(251, 250, 249, 0.2)" }}
          ></div>
          <div
            className="absolute right-1/4 top-4 bottom-4 w-px"
            style={{ backgroundColor: "rgba(251, 250, 249, 0.2)" }}
          ></div>

          {/* Rope indicator */}
          <div
            className={`absolute top-1/2 w-12 h-12 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out ${isShaking ? "rope-shake" : ""}`}
            style={{ left: `${ropePercentage}%` }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-xl shadow-2xl border-2 relative gradient-monad-primary"
              style={{ borderColor: "rgba(251, 250, 249, 0.3)" }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(to bottom right, rgba(251, 250, 249, 0.2), transparent)" }}
              ></div>
              <span className="relative z-10">{getRopeEmoji()}</span>
            </div>
          </div>

          {/* Territory markers */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: "rgba(131, 110, 249, 0.2)",
                borderColor: "rgba(131, 110, 249, 0.4)",
              }}
            >
              <span style={{ color: "#836EF9" }}>🟣</span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: "rgba(160, 5, 93, 0.2)",
                borderColor: "rgba(160, 5, 93, 0.4)",
              }}
            >
              <span style={{ color: "#A0055D" }}>🔴</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs mt-2 px-4" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
          <span>-10</span>
          <span>0</span>
          <span>+10</span>
        </div>
      </div>

      {/* Position indicator */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border"
          style={{
            backgroundColor: "rgba(14, 16, 15, 0.5)",
            borderColor: "rgba(251, 250, 249, 0.2)",
          }}
        >
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Rope Position:</span>
          <span className="font-mono font-bold text-lg" style={{ color: "#FBFAF9" }}>
            {ropePosition}
          </span>
        </div>

        {winner === 0 && (
          <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
            {ropePosition > 0
              ? "🔴 Team 2 is gaining ground!"
              : ropePosition < 0
                ? "🟣 Team 1 is pulling ahead!"
                : "⚖️ Perfect balance!"}
          </p>
        )}
      </div>

      {/* Winner announcement */}
      {winner !== 0 && (
        <div className="mt-8 text-center">
          <div
            className="inline-flex items-center space-x-3 font-bold py-4 px-8 rounded-2xl shadow-2xl victory-pulse border gradient-monad-primary"
            style={{
              color: "#FBFAF9",
              borderColor: "rgba(251, 250, 249, 0.3)",
            }}
          >
            <span className="text-2xl">🎉</span>
            <span className="text-xl">Team {winner} Wins!</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard
```

## 8. Membuat Game Controls

Buat file `src/components/GameControls.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Users, Zap, Loader2 } from "lucide-react"

interface GameControlsProps {
  onPull: (isTeam1: boolean) => void
  isConnected: boolean
  winner: number
  isLoading: boolean
}

const GameControls = ({ onPull, isConnected, winner, isLoading }: GameControlsProps) => {
  const [lastPull, setLastPull] = useState<number | null>(null)

  const handlePull = (isTeam1: boolean) => {
    if (!isConnected || winner !== 0 || isLoading) return

    onPull(isTeam1)
    setLastPull(isTeam1 ? 1 : 2)

    // Reset last pull indicator after 2 seconds
    setTimeout(() => setLastPull(null), 2000)
  }

  const getButtonClass = (isTeam1: boolean) => {
    const baseClass =
      "group relative flex-1 py-8 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform border-2 overflow-hidden"
    const teamNumber = isTeam1 ? 1 : 2

    if (!isConnected || winner !== 0) {
      return `${baseClass} cursor-not-allowed border-opacity-30`
    }

    if (isLoading) {
      return `${baseClass} cursor-not-allowed opacity-50`
    }

    const recentPull = lastPull === teamNumber ? "ring-4 scale-105" : ""
    const hoverEffect = "hover:scale-105 hover:shadow-2xl active:scale-95"

    return `${baseClass} ${recentPull} ${hoverEffect} btn-primary`
  }

  const getButtonStyle = (isTeam1: boolean) => {
    if (!isConnected || winner !== 0) {
      return {
        backgroundColor: "rgba(14, 16, 15, 0.5)",
        borderColor: "rgba(251, 250, 249, 0.2)",
        color: "rgba(251, 250, 249, 0.5)",
      }
    }

    if (isLoading) {
      return isTeam1
        ? {
            backgroundColor: "rgba(131, 110, 249, 0.5)",
            borderColor: "rgba(131, 110, 249, 0.3)",
            color: "#FBFAF9",
          }
        : {
            backgroundColor: "rgba(160, 5, 93, 0.5)",
            borderColor: "rgba(160, 5, 93, 0.3)",
            color: "#FBFAF9",
          }
    }

    return isTeam1
      ? {
          background: "linear-gradient(135deg, #836EF9 0%, #9F7AEA 100%)",
          borderColor: "rgba(131, 110, 249, 0.5)",
          color: "#FBFAF9",
        }
      : {
          background: "linear-gradient(135deg, #A0055D 0%, #C53030 100%)",
          borderColor: "rgba(160, 5, 93, 0.5)",
          color: "#FBFAF9",
        }
  }

  const getRingStyle = (isTeam1: boolean) => {
    if (lastPull === (isTeam1 ? 1 : 2)) {
      return { ringColor: isTeam1 ? "#836EF9" : "#A0055D" }
    }
    return {}
  }

  return (
    <div className="glass rounded-2xl p-8 card-hover border border-white/10">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2" style={{ color: "#FBFAF9" }}>
          Choose Your Side
        </h3>
        <p style={{ color: "rgba(251, 250, 249, 0.7)" }}>Click to pull the rope for your team</p>
      </div>

      {!isConnected && (
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)",
            }}
          >
            <span style={{ color: "#836EF9" }}>⚠️</span>
            <span className="text-sm font-medium" style={{ color: "#836EF9" }}>
              Connect your wallet to play!
            </span>
          </div>
        </div>
      )}

      {winner !== 0 && (
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)",
            }}
          >
            <span style={{ color: "#836EF9" }}>🎉</span>
            <span className="text-sm font-medium" style={{ color: "#836EF9" }}>
              Game Over! Reset to play again.
            </span>
          </div>
        </div>
      )}

      <div className="flex space-x-6">
        <button
          onClick={() => handlePull(true)}
          disabled={!isConnected || winner !== 0 || isLoading}
          className={getButtonClass(true)}
          style={{
            ...getButtonStyle(true),
            ...getRingStyle(true),
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to right, rgba(131, 110, 249, 0.2), transparent)" }}
          ></div>
          <div className="relative flex items-center justify-center space-x-3">
            <Users className="w-6 h-6" />
            <div className="text-center">
              <div className="text-xl font-bold">Pull for Team 1</div>
              <div className="text-sm opacity-90 flex items-center justify-center space-x-1">
                <span>🟣</span>
                <span>Purple Team</span>
              </div>
            </div>
            <Zap className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => handlePull(false)}
          disabled={!isConnected || winner !== 0 || isLoading}
          className={getButtonClass(false)}
          style={{
            ...getButtonStyle(false),
            ...getRingStyle(false),
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to left, rgba(160, 5, 93, 0.2), transparent)" }}
          ></div>
          <div className="relative flex items-center justify-center space-x-3">
            <Zap className="w-5 h-5" />
            <div className="text-center">
              <div className="text-xl font-bold">Pull for Team 2</div>
              <div className="text-sm opacity-90 flex items-center justify-center space-x-1">
                <span>🔴</span>
                <span>Berry Team</span>
              </div>
            </div>
            <Users className="w-6 h-6" />
          </div>
        </button>
      </div>

      {isLoading && (
        <div className="text-center mt-6">
          <div
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-xl border"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#836EF9" }} />
            <span className="font-medium" style={{ color: "#FBFAF9" }}>
              Processing pull...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameControls
```

## 9. Membuat Game Stats

Buat file `src/components/GameStats.tsx`:

```typescript
"use client"

import { BarChart3, Target, Trophy, RotateCcw, Loader2 } from "lucide-react"
import type { GameInfo, TeamStats, GamePrediction } from "../types/game"

interface GameStatsProps {
  gameInfo: GameInfo
  team1Stats: TeamStats
  team2Stats: TeamStats
  prediction: GamePrediction
  isOwner: boolean
  onReset: () => void
  isResetting: boolean
}

const GameStats = ({ gameInfo, team1Stats, team2Stats, prediction, isOwner, onReset, isResetting }: GameStatsProps) => {
  const { maxScoreDifference, totalPulls, gamesPlayed } = gameInfo

  const getProgressPercentage = (score: number) => {
    return Math.min((score / maxScoreDifference) * 100, 100)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Team Statistics */}
      <div className="glass rounded-2xl p-8 card-hover border border-white/10">
        <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: "#FBFAF9" }}>
          <BarChart3 className="w-6 h-6 mr-3" style={{ color: "#836EF9" }} />
          Team Statistics
        </h3>

        <div className="space-y-6">
          {/* Team 1 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#836EF9" }}></div>
                <span className="font-semibold text-lg" style={{ color: "#836EF9" }}>
                  Team 1
                </span>
                {team1Stats.isWinning && (
                  <span
                    className="text-xs px-2 py-1 rounded-full border font-medium"
                    style={{
                      backgroundColor: "rgba(131, 110, 249, 0.2)",
                      color: "#836EF9",
                      borderColor: "rgba(131, 110, 249, 0.3)",
                    }}
                  >
                    Leading
                  </span>
                )}
              </div>
              <span className="font-bold text-xl" style={{ color: "#FBFAF9" }}>
                {team1Stats.score}
              </span>
            </div>
            <div
              className="relative w-full rounded-full h-4 overflow-hidden"
              style={{ backgroundColor: "rgba(14, 16, 15, 0.5)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out relative"
                style={{
                  width: `${getProgressPercentage(team1Stats.score)}%`,
                  background: "linear-gradient(to right, #836EF9, #9F7AEA)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(131, 110, 249, 0.3), transparent)" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              <span>Progress to victory</span>
              <span>Advantage: +{team1Stats.scoreAdvantage}</span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A0055D" }}></div>
                <span className="font-semibold text-lg" style={{ color: "#A0055D" }}>
                  Team 2
                </span>
                {team2Stats.isWinning && (
                  <span
                    className="text-xs px-2 py-1 rounded-full border font-medium"
                    style={{
                      backgroundColor: "rgba(160, 5, 93, 0.2)",
                      color: "#A0055D",
                      borderColor: "rgba(160, 5, 93, 0.3)",
                    }}
                  >
                    Leading
                  </span>
                )}
              </div>
              <span className="font-bold text-xl" style={{ color: "#FBFAF9" }}>
                {team2Stats.score}
              </span>
            </div>
            <div
              className="relative w-full rounded-full h-4 overflow-hidden"
              style={{ backgroundColor: "rgba(14, 16, 15, 0.5)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out relative"
                style={{
                  width: `${getProgressPercentage(team2Stats.score)}%`,
                  background: "linear-gradient(to right, #A0055D, #C53030)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(160, 5, 93, 0.3), transparent)" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              <span>Progress to victory</span>
              <span>Advantage: +{team2Stats.scoreAdvantage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Info & Controls */}
      <div className="glass rounded-2xl p-8 card-hover border border-white/10">
        <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: "#FBFAF9" }}>
          <Target className="w-6 h-6 mr-3" style={{ color: "#A0055D" }} />
          Game Information
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
              }}
            >
              <div className="text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
                Win Condition
              </div>
              <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                {maxScoreDifference} points
              </div>
            </div>
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
              }}
            >
              <div className="text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
                Total Pulls
              </div>
              <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                {totalPulls}
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            <div className="text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              Games Played
            </div>
            <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
              {gamesPlayed}
            </div>
          </div>

          {/* AI Prediction */}
          {prediction.predictedWinner > 0 && (
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "linear-gradient(135deg, rgba(131, 110, 249, 0.2), rgba(160, 5, 93, 0.2))",
                borderColor: "rgba(131, 110, 249, 0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold" style={{ color: "#836EF9" }}>
                    🔮 AI Prediction
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: "#FBFAF9" }}>
                  {prediction.confidence}% confidence
                </span>
              </div>
              <div className="font-bold" style={{ color: "#FBFAF9" }}>
                Team {prediction.predictedWinner} is favored to win
              </div>
            </div>
          )}

          {/* Reset Button for Owner */}
          {isOwner && (
            <button
              onClick={onReset}
              disabled={isResetting}
              className="w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-primary border gradient-monad-primary"
              style={{
                color: "#FBFAF9",
                borderColor: "rgba(251, 250, 249, 0.3)",
              }}
            >
              {isResetting ? (
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resetting Game...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset Game</span>
                  <Trophy className="w-5 h-5" />
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameStats
```

## 10. Implementasi Komponen Container

Buat file `src/components/Container.tsx` yang akan berisi logika utama interaksi dengan kontrak:

```typescript
"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { TUGWAR_ABI, TUGWAR_CONTRACT_ADDRESS } from "../constants"
import { waitForTransactionReceipt } from "@wagmi/core"
import { config } from "../App"
import GameBoard from "./GameBoard"
import GameControls from "./GameControls"
import GameStats from "./GameStats"
import GameHistory from "./GameHistory"
import type { GameInfo, TeamStats, GamePrediction, GameEvent } from "../types/game"

const tugwarContract = {
  address: TUGWAR_CONTRACT_ADDRESS as `0x${string}`,
  abi: TUGWAR_ABI,
}

const Container = () => {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([])

  // Read game information
  const { data: gameInfoData, refetch: refetchGameInfo } = useReadContract({
    ...tugwarContract,
    functionName: "getGameInfo",
    query: {
      enabled: isConnected,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  // Read team 1 stats
  const { data: team1StatsData, refetch: refetchTeam1Stats } = useReadContract({
    ...tugwarContract,
    functionName: "getTeamStats",
    args: [1],
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  })

  // Read team 2 stats
  const { data: team2StatsData, refetch: refetchTeam2Stats } = useReadContract({
    ...tugwarContract,
    functionName: "getTeamStats",
    args: [2],
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  })

  // Read prediction
  const { data: predictionData, refetch: refetchPrediction } = useReadContract({
    ...tugwarContract,
    functionName: "getPrediction",
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  })

  // Read owner
  const { data: ownerData } = useReadContract({
    ...tugwarContract,
    functionName: "owner",
    query: {
      enabled: isConnected,
    },
  })

  // Process data with proper type assertions and checks
  const gameInfo: GameInfo =
    gameInfoData && Array.isArray(gameInfoData)
      ? {
          ropePosition: Number(gameInfoData[0]),
          team1Score: Number(gameInfoData[1]),
          team2Score: Number(gameInfoData[2]),
          maxScoreDifference: Number(gameInfoData[3]),
          winner: Number(gameInfoData[4]),
          totalPulls: Number(gameInfoData[5]),
          gamesPlayed: Number(gameInfoData[6]),
        }
      : {
          ropePosition: 0,
          team1Score: 0,
          team2Score: 0,
          maxScoreDifference: 5,
          winner: 0,
          totalPulls: 0,
          gamesPlayed: 0,
        }

  const team1Stats: TeamStats =
    team1StatsData && Array.isArray(team1StatsData)
      ? {
          score: Number(team1StatsData[0]),
          isWinning: Boolean(team1StatsData[1]),
          scoreAdvantage: Number(team1StatsData[2]),
        }
      : { score: 0, isWinning: false, scoreAdvantage: 0 }

  const team2Stats: TeamStats =
    team2StatsData && Array.isArray(team2StatsData)
      ? {
          score: Number(team2StatsData[0]),
          isWinning: Boolean(team2StatsData[1]),
          scoreAdvantage: Number(team2StatsData[2]),
        }
      : { score: 0, isWinning: false, scoreAdvantage: 0 }

  const prediction: GamePrediction =
    predictionData && Array.isArray(predictionData)
      ? {
          predictedWinner: Number(predictionData[0]),
          confidence: Number(predictionData[1]),
        }
      : { predictedWinner: 0, confidence: 0 }

  const isOwner = address && ownerData && address.toLowerCase() === (ownerData as string).toLowerCase()

  // Watch for contract events
  useWatchContractEvent({
    ...tugwarContract,
    eventName: "PullExecuted",
    onLogs(logs) {
      console.log("Pull executed:", logs)
      triggerShake()
      refetchAll()

      // Add event to history
      const log = logs[0]
      if (log && "args" in log && log.args) {
        const args = log.args as {
          player: string
          isTeam1: boolean
          newRopePosition: number
          team1Score: number
          team2Score: number
        }

        const { player, isTeam1, team1Score, team2Score } = args
        const newEvent: GameEvent = {
          type: "pull",
          player: player,
          team: isTeam1 ? 1 : 2,
          timestamp: Date.now(),
        }
        setGameEvents((prev) => [...prev, newEvent])

        // Show toast notification
        toast.success(`${isTeam1 ? "Team 1" : "Team 2"} pulled! Score: ${team1Score} - ${team2Score}`, {
          style: {
            background: "rgba(32, 0, 82, 0.95)",
            color: "#FBFAF9",
            border: "1px solid rgba(131, 110, 249, 0.3)",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
        })
      }
    },
  })

  useWatchContractEvent({
    ...tugwarContract,
    eventName: "GameWon",
    onLogs(logs) {
      console.log("Game won:", logs)
      refetchAll()

      // Add event to history
      const log = logs[0]
      if (log && "args" in log && log.args) {
        const args = log.args as {
          winningTeam: number
          finalScore1: number
          finalScore2: number
        }

        const { winningTeam, finalScore1, finalScore2 } = args
        const newEvent: GameEvent = {
          type: "win",
          team: Number(winningTeam),
          timestamp: Date.now(),
        }
        setGameEvents((prev) => [...prev, newEvent])

        // Show victory toast
        toast.success(`🎉 Team ${winningTeam} Wins! Final Score: ${finalScore1} - ${finalScore2}`, {
          duration: 5000,
          style: {
            background: "rgba(32, 0, 82, 0.95)",
            color: "#FBFAF9",
            border: "1px solid rgba(131, 110, 249, 0.5)",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
        })
      }
    },
  })

  useWatchContractEvent({
    ...tugwarContract,
    eventName: "GameReset",
    onLogs(logs) {
      console.log("Game reset:", logs)
      refetchAll()

      // Add event to history and clear previous events
      const newEvent: GameEvent = {
        type: "reset",
        timestamp: Date.now(),
      }
      setGameEvents([newEvent]) // Reset history on game reset

      toast.success("Game has been reset!", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(160, 5, 93, 0.3)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })
    },
  })

  // Trigger rope shake animation
  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 400)
  }

  // Refetch all data
  const refetchAll = () => {
    refetchGameInfo()
    refetchTeam1Stats()
    refetchTeam2Stats()
    refetchPrediction()
  }

  // Handle pull action
  const handlePull = async (isTeam1: boolean) => {
    if (!isConnected || gameInfo.winner !== 0) return

    setIsLoading(true)

    toast.loading(`Team ${isTeam1 ? "1" : "2"} is pulling...`, {
      style: {
        background: "rgba(32, 0, 82, 0.95)",
        color: "#FBFAF9",
        border: "1px solid rgba(131, 110, 249, 0.3)",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    })

    try {
      const result = await writeContractAsync({
        ...tugwarContract,
        functionName: "pull",
        args: [isTeam1],
        account: address as `0x${string}`,
      })

      toast.dismiss()
      toast.loading("Confirming pull...", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(131, 110, 249, 0.3)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      })

      toast.dismiss()
      // Success toast will be handled by event listener
    } catch (error) {
      console.error("Pull failed:", error)
      toast.dismiss()
      toast.error("Pull failed. Please try again.", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(160, 5, 93, 0.5)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle reset game (owner only)
  const handleReset = async () => {
    if (!isConnected || !isOwner) return

    setIsResetting(true)

    toast.loading("Resetting game...", {
      style: {
        background: "rgba(32, 0, 82, 0.95)",
        color: "#FBFAF9",
        border: "1px solid rgba(131, 110, 249, 0.3)",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    })

    try {
      const result = await writeContractAsync({
        ...tugwarContract,
        functionName: "reSet",
        args: [5], // Reset with default max score difference of 5
        account: address as `0x${string}`,
      })

      toast.dismiss()
      toast.loading("Confirming reset...", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(131, 110, 249, 0.3)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      })

      toast.dismiss()
      // Success toast will be handled by event listener
    } catch (error) {
      console.error("Reset failed:", error)
      toast.dismiss()
      toast.error("Reset failed. Please try again.", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(160, 5, 93, 0.5)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <main className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {isConnected ? (
          <div className="space-y-8">
            <GameBoard gameInfo={gameInfo} isShaking={isShaking} />
            <GameControls
              onPull={handlePull}
              isConnected={isConnected}
              winner={gameInfo.winner}
              isLoading={isLoading}
            />
            <GameStats
              gameInfo={gameInfo}
              team1Stats={team1Stats}
              team2Stats={team2Stats}
              prediction={prediction}
              isOwner={Boolean(isOwner)}
              onReset={handleReset}
              isResetting={isResetting}
            />
            <GameHistory events={gameEvents} />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass card-hover rounded-2xl p-12 max-w-lg mx-auto text-center">
              <div className="text-8xl mb-6 float-animation">🎮</div>
              <h2 className="text-3xl font-bold mb-4 text-gradient-monad font-inter">Welcome to TugWar</h2>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                Connect your wallet to join the ultimate blockchain tug of war battle. Choose your team and fight for
                victory on the Monad testnet!
              </p>
              <div className="flex justify-center items-center space-x-8 text-sm">
                <div
                  className="flex items-center space-x-2 p-3 rounded-xl border"
                  style={{
                    backgroundColor: "rgba(131, 110, 249, 0.1)",
                    borderColor: "rgba(131, 110, 249, 0.3)",
                  }}
                >
                  <span className="text-2xl">🟣</span>
                  <span className="font-medium" style={{ color: "#836EF9" }}>
                    Team 1
                  </span>
                </div>
                <div className="font-bold text-xl" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
                  VS
                </div>
                <div
                  className="flex items-center space-x-2 p-3 rounded-xl border"
                  style={{
                    backgroundColor: "rgba(160, 5, 93, 0.1)",
                    borderColor: "rgba(160, 5, 93, 0.3)",
                  }}
                >
                  <span className="text-2xl">🔴</span>
                  <span className="font-medium" style={{ color: "#A0055D" }}>
                    Team 2
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Container
```

## 11. Membuat Game History Component

Untuk melengkapi experience, buat file `src/components/GameHistory.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Clock, Trophy, Users, RotateCcw, ChevronDown, ChevronRight } from "lucide-react"
import type { GameEvent } from "../types/game"

interface GameHistoryProps {
  events: GameEvent[]
}

const GameHistory = ({ events }: GameHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "pull":
        return <Users className="w-4 h-4" />
      case "win":
        return <Trophy className="w-4 h-4" style={{ color: "#836EF9" }} />
      case "reset":
        return <RotateCcw className="w-4 h-4" style={{ color: "#A0055D" }} />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getEventMessage = (event: GameEvent) => {
    switch (event.type) {
      case "pull":
        return `Team ${event.team} pulled the rope`
      case "win":
        return `Team ${event.team} won the game!`
      case "reset":
        return `Game was reset`
      default:
        return "Unknown event"
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "pull":
        return {
          backgroundColor: "rgba(131, 110, 249, 0.1)",
          borderColor: "rgba(131, 110, 249, 0.2)",
          hoverBg: "rgba(131, 110, 249, 0.2)",
        }
      case "win":
        return {
          backgroundColor: "rgba(131, 110, 249, 0.15)",
          borderColor: "rgba(131, 110, 249, 0.3)",
          hoverBg: "rgba(131, 110, 249, 0.25)",
        }
      case "reset":
        return {
          backgroundColor: "rgba(160, 5, 93, 0.1)",
          borderColor: "rgba(160, 5, 93, 0.2)",
          hoverBg: "rgba(160, 5, 93, 0.2)",
        }
      default:
        return {
          backgroundColor: "rgba(14, 16, 15, 0.3)",
          borderColor: "rgba(251, 250, 249, 0.1)",
          hoverBg: "rgba(14, 16, 15, 0.5)",
        }
    }
  }

  const getTeamColor = (team?: number) => {
    if (team === 1) return "#836EF9"
    if (team === 2) return "#A0055D"
    return "rgba(251, 250, 249, 0.6)"
  }

  return (
    <div className="glass rounded-2xl p-8 card-hover border border-white/10">
      <button
        className="w-full flex items-center justify-between hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-2xl font-bold flex items-center" style={{ color: "#FBFAF9" }}>
          <Clock className="w-6 h-6 mr-3" style={{ color: "#836EF9" }} />
          Game History
          <span
            className="ml-3 text-lg px-3 py-1 rounded-full border font-medium"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              color: "#FBFAF9",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            {events.length}
          </span>
        </h3>
        <div className="transition-transform duration-200" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 float-animation">🎮</div>
              <h4 className="text-xl font-semibold mb-2" style={{ color: "#FBFAF9" }}>
                No events yet
              </h4>
              <p style={{ color: "rgba(251, 250, 249, 0.6)" }}>Start pulling to see the battle unfold!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {events
                .slice()
                .reverse()
                .map((event, index) => {
                  const colors = getEventColor(event.type)
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01]"
                      style={{
                        backgroundColor: colors.backgroundColor,
                        borderColor: colors.borderColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hoverBg
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.backgroundColor
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border"
                        style={{
                          backgroundColor: "rgba(14, 16, 15, 0.5)",
                          borderColor: "rgba(251, 250, 249, 0.2)",
                        }}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium" style={{ color: getTeamColor(event.team) }}>
                          {getEventMessage(event)}
                        </p>
                        <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {event.player && (
                        <div className="flex-shrink-0">
                          <div
                            className="text-xs font-mono px-2 py-1 rounded border"
                            style={{
                              backgroundColor: "rgba(14, 16, 15, 0.5)",
                              color: "rgba(251, 250, 249, 0.6)",
                              borderColor: "rgba(251, 250, 249, 0.2)",
                            }}
                          >
                            {event.player.slice(0, 6)}...{event.player.slice(-4)}
                          </div>
                        </div>
                      )}

                      {event.type === "win" && (
                        <div className="flex-shrink-0">
                          <span className="text-2xl">🏆</span>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GameHistory
```

## 12. Menjalankan Aplikasi

Setelah semua komponen dibuat, jalankan aplikasi dengan perintah:

```bash
npm run dev
```

Akses aplikasi di `http://localhost:5173/`.

## 13. Penjelasan Kode Container

Mari kita pahami bagian-bagian penting dari kode `Container.tsx`:

### 13.1. Real-time Data Fetching

```typescript
const { data: gameInfoData, refetch: refetchGameInfo } = useReadContract({
  ...tugwarContract,
  functionName: "getGameInfo",
  query: {
    enabled: isConnected,
    refetchInterval: 5000, // Refetch every 5 seconds
  },
});
```

**Keunggulan:**
- **Automatic Updates**: Data di-refresh setiap 5 detik secara otomatis
- **Conditional Fetching**: Hanya fetch data ketika wallet terhubung
- **Manual Refetch**: Dapat di-trigger manual setelah actions

### 13.2. Event Listening untuk Real-time Updates

```typescript
useWatchContractEvent({
  ...tugwarContract,
  eventName: 'PullExecuted',
  onLogs(logs) {
    console.log('Pull executed:', logs);
    triggerShake();
    refetchAll();
    
    // Add to game history
    const newEvent: GameEvent = {
      type: 'pull',
      player: player as string,
      team: isTeam1 ? 1 : 2,
      timestamp: Date.now(),
    };
    setGameEvents(prev => [...prev, newEvent]);
  },
});
```

**Fitur:**
- **Real-time Events**: Listen ke contract events secara real-time
- **UI Animations**: Trigger rope shake animation
- **Game History**: Track semua events untuk history
- **Toast Notifications**: Show user notifications

### 13.3. Game State Processing

```typescript
const gameInfo: GameInfo = gameInfoData ? {
  ropePosition: Number(gameInfoData[0]),
  team1Score: Number(gameInfoData[1]),
  team2Score: Number(gameInfoData[2]),
  maxScoreDifference: Number(gameInfoData[3]),
  winner: Number(gameInfoData[4]),
  totalPulls: Number(gameInfoData[5]),
  gamesPlayed: Number(gameInfoData[6]),
} : {
  // Default values
};
```

**Keunggulan:**
- **Type Safety**: Convert BigInt ke Number dengan type safety
- **Default Values**: Provide default values untuk loading state
- **Clean Data Structure**: Structured data untuk easy consumption

### 13.4. Interactive Game Actions

```typescript
const handlePull = async (isTeam1: boolean) => {
  if (!isConnected || gameInfo.winner !== 0) return;

  setIsLoading(true);
  
  try {
    const result = await writeContractAsync({
      ...tugwarContract,
      functionName: "pull",
      args: [isTeam1],
      account: address as `0x${string}`,
    });

    await waitForTransactionReceipt(config, {
      hash: result as `0x${string}`,
    });
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**
- **Validation**: Check connection dan game state
- **Loading States**: Manage loading untuk better UX
- **Transaction Confirmation**: Wait untuk blockchain confirmation
- **Error Handling**: Comprehensive error handling

## 14. UI/UX Features

### 14.1. Animasi dan Visual Effects

```css
/* Dalam src/index.css */
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
@keyframes rope-shake {
  0%,
  100% {
    transform: translateX(0) translateY(-50%);
  }
  25% {
    transform: translateX(-3px) translateY(-50%);
  }
  75% {
    transform: translateX(3px) translateY(-50%);
  }
}

.rope-shake {
  animation: rope-shake 0.4s ease-in-out;
}

@keyframes victory-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
}

.victory-pulse {
  animation: victory-pulse 1.2s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
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
  0%,
  100% {
    box-shadow: 0 0 5px rgba(131, 110, 249, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(131, 110, 249, 0.6), 0 0 30px rgba(131, 110, 249, 0.4);
  }
}

@keyframes glow-berry {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(160, 5, 93, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(160, 5, 93, 0.6), 0 0 30px rgba(160, 5, 93, 0.4);
  }
}

.glow-purple {
  animation: glow-purple 2s ease-in-out infinite;
}

.glow-berry {
  animation: glow-berry 2s ease-in-out infinite;
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

/* Monad brand gradients */
.gradient-monad-primary {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
}

.gradient-monad-secondary {
  background: linear-gradient(135deg, var(--monad-blue) 0%, var(--monad-black) 100%);
}

.text-gradient-monad {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Animasi:**
- **Rope Shake**: Animasi ketika rope di-pull
- **Victory Pulse**: Pulsing effect untuk winner
- **Smooth Transitions**: Transisi halus untuk UI changes

### 14.2. Progress Bars dan Indicators

```typescript
const getProgressPercentage = (score: number) => {
  return Math.min((score / maxScoreDifference) * 100, 100);
};

// Usage in JSX
<div 
  className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
  style={{ width: `${getProgressPercentage(team1Stats.score)}%` }}
></div>
```

**Features:**
- **Dynamic Progress**: Visual progress menuju victory
- **Smooth Animations**: CSS transitions untuk smooth updates
- **Color Coding**: Team colors untuk easy identification

### 14.3. Real-time Notifications

```typescript
toast.success(
  `${isTeam1 ? 'Team 1' : 'Team 2'} pulled! Score: ${team1Score} - ${team2Score}`,
  {
    style: {
      background: "#2B2F36",
      color: "#fff",
    },
  }
);
```

**Notification Types:**
- **Pull Actions**: Notifications ketika team pull
- **Victory**: Special notifications untuk game wins
- **Game Reset**: Notifications untuk game resets
- **Error Handling**: Error notifications dengan context

## 15. Responsive Design

### 15.1. Mobile Optimization

```typescript
// GameBoard component - responsive rope visualization
<div className="relative h-12 bg-gradient-to-r from-blue-900/50 via-gray-700/50 to-red-900/50 rounded-lg border-2 border-white/30 overflow-hidden">
  {/* Mobile-friendly rope indicator */}
  <div 
    className="absolute top-1/2 w-8 h-8 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
    style={{ left: `${ropePercentage}%` }}
  >
    <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-yellow-300">
      {getRopeEmoji()}
    </div>
  </div>
</div>
```

### 15.2. Grid Layouts

```typescript
// Responsive grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Team Statistics */}
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
    {/* Content */}
  </div>
  
  {/* Game Info */}
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
    {/* Content */}
  </div>
</div>
```

**Responsive Features:**
- **Mobile-first Design**: Mobile-optimized layouts
- **Flexible Grid**: Adaptive grid systems
- **Touch-friendly**: Large buttons untuk mobile interaction
- **Readable Text**: Appropriate font sizes untuk all devices

## 16. Performance Optimization

### 16.1. Efficient Re-rendering

```typescript
// Optimize re-renders dengan useMemo dan useCallback
import { useMemo, useCallback } from 'react';

const Container = () => {
  // Use useMemo untuk expensive calculations
  const memoizedGameInfo = useMemo(() => ({
    ropePosition: Number(gameInfoData?.[0] || 0),
    team1Score: Number(gameInfoData?.[1] || 0),
    team2Score: Number(gameInfoData?.[2] || 0),
    maxScoreDifference: Number(gameInfoData?.[3] || 5),
    winner: Number(gameInfoData?.[4] || 0),
    totalPulls: Number(gameInfoData?.[5] || 0),
    gamesPlayed: Number(gameInfoData?.[6] || 0),
  }), [gameInfoData]);

  // Use useCallback untuk event handlers
  const handlePullCallback = useCallback(
    (isTeam1: boolean) => handlePull(isTeam1),
    [isConnected, gameInfo.winner, isLoading]
  );

  const handleResetCallback = useCallback(
    () => handleReset(),
    [isConnected, isOwner, isResetting]
  );

  // Memoize expensive components
  const memoizedGameBoard = useMemo(
    () => <GameBoard gameInfo={memoizedGameInfo} isShaking={isShaking} />,
    [memoizedGameInfo, isShaking]
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {memoizedGameBoard}
      {/* Other components */}
    </main>
  );
};
```

### 16.2. Debounced Updates

```typescript
// Custom hook untuk debounced values
import { useState, useEffect } from 'react';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage dalam Container
const Container = () => {
  const [ropePosition, setRopePosition] = useState(0);
  const debouncedRopePosition = useDebouncedValue(ropePosition, 100);
  
  // Use debounced value untuk animations
  useEffect(() => {
    if (gameInfoData) {
      setRopePosition(Number(gameInfoData[0]));
    }
  }, [gameInfoData]);

  // Use debounced value untuk heavy operations
  const processRopeAnimation = useMemo(() => {
    return calculateRopeVisualization(debouncedRopePosition);
  }, [debouncedRopePosition]);
};
```

### 16.3. Lazy Loading Components

```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const GameHistory = lazy(() => import('./GameHistory'));
const GameStats = lazy(() => import('./GameStats'));
const SettingsPanel = lazy(() => import('./SettingsPanel'));

// Loading fallback component
const ComponentSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-xl ${className}`}>
    <div className="p-6 space-y-3">
      <div className="h-4 bg-white/20 rounded w-3/4"></div>
      <div className="h-4 bg-white/20 rounded w-1/2"></div>
      <div className="h-8 bg-white/20 rounded"></div>
    </div>
  </div>
);

// Usage with Suspense
const Container = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <GameBoard gameInfo={gameInfo} isShaking={isShaking} />
      <GameControls onPull={handlePull} /* other props */ />
      
      <Suspense fallback={<ComponentSkeleton className="h-64" />}>
        <GameStats 
          gameInfo={gameInfo}
          team1Stats={team1Stats}
          team2Stats={team2Stats}
          prediction={prediction}
          isOwner={Boolean(isOwner)}
          onReset={handleReset}
          isResetting={isResetting}
        />
      </Suspense>
      
      <Suspense fallback={<ComponentSkeleton className="h-32" />}>
        <GameHistory events={gameEvents} />
      </Suspense>
    </main>
  );
};
```

### 16.4. Virtual Scrolling untuk Large Lists

```typescript
// Custom hook untuk virtual scrolling
import { useMemo, useState, useRef, useEffect } from 'react';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  items: any[];
}

export const useVirtualScroll = ({ itemHeight, containerHeight, items }: UseVirtualScrollOptions) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      index: visibleStart + index,
    }));
  }, [scrollTop, itemHeight, containerHeight, items]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    offsetY,
  };
};

// Usage dalam GameHistory dengan virtual scrolling
const GameHistory = ({ events }: GameHistoryProps) => {
  const containerHeight = 240; // 60 * 4 items visible
  const itemHeight = 60;
  
  const { scrollElementRef, visibleItems, totalHeight, offsetY } = useVirtualScroll({
    itemHeight,
    containerHeight,
    items: events.slice().reverse(),
  });

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Game History ({events.length})</h3>
      
      <div
        ref={scrollElementRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((event) => (
              <GameEventItem 
                key={event.index} 
                event={event} 
                style={{ height: itemHeight }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 16.5. Image Optimization

```typescript
// Optimized image component
import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const OptimizedImage = ({ src, alt, className, placeholder }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />
      
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          {placeholder || <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        </div>
      )}
      
      {isError && (
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">Failed to load</span>
        </div>
      )}
    </div>
  );
};
```

## 17. Testing Strategy

### 17.1. Unit Testing Setup

Install testing dependencies:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Configure `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({ 
    address: '0x1234567890123456789012345678901234567890', 
    isConnected: true 
  })),
  useReadContract: vi.fn(() => ({ 
    data: [0, 0, 0, 5, 0, 0, 0], 
    refetch: vi.fn() 
  })),
  useWriteContract: vi.fn(() => ({ 
    writeContractAsync: vi.fn().mockResolvedValue('0xhash123') 
  })),
  useWatchContractEvent: vi.fn(() => ({})),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}))

// Mock @wagmi/core
vi.mock('@wagmi/core', () => ({
  waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
}))

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button>Connect Wallet</button>,
  RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  getDefaultConfig: vi.fn(() => ({})),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Users: () => <svg data-testid="users-icon" />,
  Trophy: () => <svg data-testid="trophy-icon" />,
  BarChart3: () => <svg data-testid="barchart-icon" />,
  Target: () => <svg data-testid="target-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  Zap: () => <svg data-testid="zap-icon" />,
}))
```

### 17.2. Component Unit Tests

Create `src/components/__tests__/GameBoard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GameBoard from '../GameBoard'
import { GameInfo } from '../../types/game'

const mockGameInfo: GameInfo = {
  ropePosition: -2,
  team1Score: 3,
  team2Score: 1,
  maxScoreDifference: 5,
  winner: 0,
  totalPulls: 4,
  gamesPlayed: 0,
}

describe('GameBoard Component', () => {
  it('renders team scores correctly', () => {
    render(<GameBoard gameInfo={mockGameInfo} isShaking={false} />)
    
    expect(screen.getByText('Team 1: 3')).toBeInTheDocument()
    expect(screen.getByText('Team 2: 1')).toBeInTheDocument()
  })

  it('displays rope position indicator', () => {
    render(<GameBoard gameInfo={mockGameInfo} isShaking={false} />)
    
    expect(screen.getByText('Rope Position:')).toBeInTheDocument()
    expect(screen.getByText('-2')).toBeInTheDocument()
  })

  it('shows appropriate message based on rope position', () => {
    render(<GameBoard gameInfo={mockGameInfo} isShaking={false} />)
    
    expect(screen.getByText('Team 1 is pulling ahead!')).toBeInTheDocument()
  })

  it('displays winner announcement when game is won', () => {
    const winnerGameInfo = { ...mockGameInfo, winner: 1 }
    render(<GameBoard gameInfo={winnerGameInfo} isShaking={false} />)
    
    expect(screen.getByText(/Team 1 Wins!/)).toBeInTheDocument()
  })

  it('applies shake animation class when isShaking is true', () => {
    const { container } = render(<GameBoard gameInfo={mockGameInfo} isShaking={true} />)
    
    const ropeElement = container.querySelector('.rope-shake')
    expect(ropeElement).toBeInTheDocument()
  })

  it('renders rope visualization with correct positioning', () => {
    render(<GameBoard gameInfo={mockGameInfo} isShaking={false} />)
    
    // Check for rope visualization elements
    expect(screen.getByText('Team 1 Territory')).toBeInTheDocument()
    expect(screen.getByText('Team 2 Territory')).toBeInTheDocument()
    expect(screen.getByText('Center')).toBeInTheDocument()
  })
})
```

Create `src/components/__tests__/GameControls.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameControls from '../GameControls'

describe('GameControls Component', () => {
  const mockProps = {
    onPull: vi.fn(),
    isConnected: true,
    winner: 0,
    isLoading: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders pull buttons for both teams', () => {
    render(<GameControls {...mockProps} />)
    
    expect(screen.getByText(/Pull for Team 1/)).toBeInTheDocument()
    expect(screen.getByText(/Pull for Team 2/)).toBeInTheDocument()
  })

  it('calls onPull with correct team when buttons are clicked', () => {
    render(<GameControls {...mockProps} />)
    
    const team1Button = screen.getByText(/Pull for Team 1/)
    const team2Button = screen.getByText(/Pull for Team 2/)
    
    fireEvent.click(team1Button)
    expect(mockProps.onPull).toHaveBeenCalledWith(true)
    
    fireEvent.click(team2Button)
    expect(mockProps.onPull).toHaveBeenCalledWith(false)
  })

  it('disables buttons when not connected', () => {
    render(<GameControls {...mockProps} isConnected={false} />)
    
    const team1Button = screen.getByText(/Pull for Team 1/)
    const team2Button = screen.getByText(/Pull for Team 2/)
    
    expect(team1Button).toBeDisabled()
    expect(team2Button).toBeDisabled()
    expect(screen.getByText('Connect your wallet to play!')).toBeInTheDocument()
  })

  it('disables buttons when game is over', () => {
    render(<GameControls {...mockProps} winner={1} />)
    
    const team1Button = screen.getByText(/Pull for Team 1/)
    const team2Button = screen.getByText(/Pull for Team 2/)
    
    expect(team1Button).toBeDisabled()
    expect(team2Button).toBeDisabled()
    expect(screen.getByText('Game Over! Reset to play again.')).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(<GameControls {...mockProps} isLoading={true} />)
    
    expect(screen.getByText('Processing pull...')).toBeInTheDocument()
    
    const team1Button = screen.getByText(/Pull for Team 1/)
    const team2Button = screen.getByText(/Pull for Team 2/)
    
    expect(team1Button).toBeDisabled()
    expect(team2Button).toBeDisabled()
  })
})
```

### 17.3. Integration Testing

Create `src/components/__tests__/Container.integration.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../Container'

// Mock the App config
vi.mock('../../App', () => ({
  config: {},
}))

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('Container Integration Tests', () => {
  it('renders complete game interface when connected', () => {
    renderWithProviders(<Container />)
    
    expect(screen.getByText('Battle Arena')).toBeInTheDocument()
    expect(screen.getByText('Choose Your Team')).toBeInTheDocument()
    expect(screen.getByText('Team Statistics')).toBeInTheDocument()
    expect(screen.getByText('Game Information')).toBeInTheDocument()
  })

  it('handles game interactions correctly', async () => {
    const mockWriteContract = vi.fn().mockResolvedValue('0xhash123')
    
    vi.mocked(useWriteContract).mockReturnValue({ 
      writeContractAsync: mockWriteContract 
    })

    renderWithProviders(<Container />)
    
    const team1Button = screen.getByText(/Pull for Team 1/)
    fireEvent.click(team1Button)

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalledWith({
        address: expect.any(String),
        abi: expect.any(Array),
        functionName: 'pull',
        args: [true],
        account: expect.any(String),
      })
    })
  })

  it('displays game statistics correctly', () => {
    // Mock game data
    vi.mocked(useReadContract).mockImplementation((config: any) => {
      if (config.functionName === 'getGameInfo') {
        return { data: [2, 3, 1, 5, 0, 4, 0], refetch: vi.fn() }
      }
      if (config.functionName === 'getTeamStats') {
        return { data: [3, true, 2], refetch: vi.fn() }
      }
      if (config.functionName === 'getPrediction') {
        return { data: [1, 75], refetch: vi.fn() }
      }
      return { data: null, refetch: vi.fn() }
    })

    renderWithProviders(<Container />)
    
    expect(screen.getByText('5 points ahead')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument() // Total pulls
    expect(screen.getByText('Team 1 is favored to win')).toBeInTheDocument()
  })

  it('shows owner controls when user is owner', () => {
    // Mock owner address to match connected address
    vi.mocked(useReadContract).mockImplementation((config: any) => {
      if (config.functionName === 'owner') {
        return { data: '0x1234567890123456789012345678901234567890' }
      }
      return { data: [0, 0, 0, 5, 0, 0, 0], refetch: vi.fn() }
    })

    renderWithProviders(<Container />)
    
    expect(screen.getByText('Reset Game')).toBeInTheDocument()
  })
})
```

### 17.4. E2E Testing dengan Playwright

Install Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

Create `tests/e2e/tugwar-game.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('TugWar Game E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays welcome screen when wallet not connected', async ({ page }) => {
    await expect(page.getByText('Welcome to TugWar!')).toBeVisible()
    await expect(page.getByText('Connect your wallet to start playing')).toBeVisible()
  })

  test('shows game interface layout correctly', async ({ page }) => {
    // Mock wallet connection (simplified for testing)
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
    })
    
    await page.reload()
    
    await expect(page.getByText('Battle Arena')).toBeVisible()
    await expect(page.getByText('Choose Your Team')).toBeVisible()
    await expect(page.getByText('Team Statistics')).toBeVisible()
    await expect(page.getByText('Game Information')).toBeVisible()
  })

  test('team pull buttons are interactive', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
    })
    
    await page.reload()
    
    const team1Button = page.getByText(/Pull for Team 1/)
    const team2Button = page.getByText(/Pull for Team 2/)
    
    await expect(team1Button).toBeVisible()
    await expect(team2Button).toBeVisible()
    
    // Test hover effects
    await team1Button.hover()
    await expect(team1Button).toHaveClass(/hover:scale-105/)
    
    await team2Button.hover()
    await expect(team2Button).toHaveClass(/hover:scale-105/)
  })

  test('rope visualization displays correctly', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
    })
    
    await page.reload()
    
    await expect(page.getByText('Team 1 Territory')).toBeVisible()
    await expect(page.getByText('Team 2 Territory')).toBeVisible()
    await expect(page.getByText('Center')).toBeVisible()
    
    // Check for rope indicator
    const ropeIndicator = page.locator('.bg-yellow-400')
    await expect(ropeIndicator).toBeVisible()
  })

  test('game statistics update correctly', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
    })
    
    await page.reload()
    
    // Check initial statistics
    await expect(page.getByText('Win Condition:')).toBeVisible()
    await expect(page.getByText('Total Pulls:')).toBeVisible()
    await expect(page.getByText('Games Played:')).toBeVisible()
    
    // Check team progress bars
    const team1Progress = page.locator('.bg-gradient-to-r.from-blue-500')
    const team2Progress = page.locator('.bg-gradient-to-r.from-red-500')
    
    await expect(team1Progress).toBeVisible()
    await expect(team2Progress).toBeVisible()
  })

  test('mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
    
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
    })
    
    await page.reload()
    
    // Check that elements are still visible on mobile
    await expect(page.getByText('Battle Arena')).toBeVisible()
    await expect(page.getByText('Choose Your Team')).toBeVisible()
    
    // Check button sizes are appropriate for touch
    const team1Button = page.getByText(/Pull for Team 1/)
    const buttonBox = await team1Button.boundingBox()
    expect(buttonBox?.height).toBeGreaterThan(44) // Minimum touch target size
  })

  test('keyboard shortcuts work correctly', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
    })
    
    await page.reload()
    
    // Test keyboard shortcuts
    await page.keyboard.press('1')
    // Should trigger team 1 pull (would need to mock the actual transaction)
    
    await page.keyboard.press('2')
    // Should trigger team 2 pull
    
    await page.keyboard.press('s')
    // Should open settings (if implemented)
  })

  test('error handling displays correctly', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('wagmi.connected', 'true')
      // Mock a contract error
      window.mockContractError = true
    })
    
    await page.reload()
    
    const team1Button = page.getByText(/Pull for Team 1/)
    await team1Button.click()
    
    // Should show error toast (if error handling is implemented)
    await expect(page.getByText(/failed/i)).toBeVisible({ timeout: 5000 })
  })
})
```

## 18. Build dan Deployment

### 18.1. Environment Configuration

Create environment files untuk different stages:

**`.env.development`:**
```env
VITE_TUGWAR_CONTRACT_ADDRESS=0xYourTestnetContractAddress
VITE_WALLETCONNECT_PROJECT_ID=your_test_project_id
VITE_ENVIRONMENT=development
```

**`.env.production`:**
```env
VITE_TUGWAR_CONTRACT_ADDRESS=0xYourMainnetContractAddress
VITE_WALLETCONNECT_PROJECT_ID=your_production_project_id
VITE_ENVIRONMENT=production
```

Update `src/constants/index.tsx`:

```typescript
// Environment validation
const requiredEnvVars = {
  TUGWAR_CONTRACT_ADDRESS: import.meta.env.VITE_TUGWAR_CONTRACT_ADDRESS,
  WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
} as const

// Validate required environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: VITE_${key}`)
  }
})

export const config = {
  TUGWAR_CONTRACT_ADDRESS: requiredEnvVars.TUGWAR_CONTRACT_ADDRESS,
  WALLETCONNECT_PROJECT_ID: requiredEnvVars.WALLETCONNECT_PROJECT_ID,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
} as const

export { TUGWAR_ABI } from './TUGWAR_ABI.json'
```

### 18.2. Build Configuration

Update `vite.config.ts` untuk production optimization:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'web3-vendor': ['wagmi', '@rainbow-me/rainbowkit', 'viem'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
        },
      },
    },
    
    // Optimize for production
    minify: 'terser',
    sourcemap: false,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Define globals
  define: {
    global: 'globalThis',
  },
})
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix"
  }
}
```

### 18.3. Build untuk Production

Jalankan build commands:

```bash
# Install dependencies
npm install

# Type check
npm run tsc

# Lint check
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview build locally
npm run preview
```

Output build akan berada di folder `dist/` dengan struktur:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── react-vendor-[hash].js
│   ├── web3-vendor-[hash].js
│   └── ui-vendor-[hash].js
└── images/
    └── [optimized images]
```

### 18.4. Deploy ke Vercel

Vercel adalah platform yang mudah untuk deploy React applications.

#### Setup Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

#### Deploy Manual

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Auto Deploy dengan GitHub

1. **Push code ke GitHub repository**
2. **Connect repository di [Vercel Dashboard](https://vercel.com)**
3. **Configure environment variables:**
   - `VITE_TUGWAR_CONTRACT_ADDRESS`
   - `VITE_WALLETCONNECT_PROJECT_ID`
   - `VITE_ENVIRONMENT`

4. **Deploy settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 18.5. Deploy ke Netlify

Netlify adalah alternative lain yang mudah untuk deployment.

#### Deploy Manual

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build project
npm run build

# Deploy to preview
netlify deploy --dir=dist

# Deploy to production
netlify deploy --prod --dir=dist
```

#### Auto Deploy dengan GitHub

1. **Connect repository di [Netlify Dashboard](https://netlify.com)**
2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add environment variables:**
   - `VITE_TUGWAR_CONTRACT_ADDRESS`
   - `VITE_WALLETCONNECT_PROJECT_ID`
   - `VITE_ENVIRONMENT`

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### 18.6. Deploy ke GitHub Pages

GitHub Pages dapat digunakan untuk hosting static sites gratis.

#### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        env:
          VITE_TUGWAR_CONTRACT_ADDRESS: ${{ secrets.VITE_TUGWAR_CONTRACT_ADDRESS }}
          VITE_WALLETCONNECT_PROJECT_ID: ${{ secrets.VITE_WALLETCONNECT_PROJECT_ID }}
          VITE_ENVIRONMENT: production
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### Configure Repository

1. **Go to repository Settings → Pages**
2. **Source: GitHub Actions**
3. **Add repository secrets:**
   - `VITE_TUGWAR_CONTRACT_ADDRESS`
   - `VITE_WALLETCONNECT_PROJECT_ID`

### 18.7. Deploy ke Firebase Hosting

Firebase Hosting adalah platform Google untuk static hosting.

#### Setup Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init hosting
```

Configuration saat init:
- Public directory: `dist`
- Single-page app: `Yes`
- Automatic builds and deploys with GitHub: `Yes` (optional)

#### Firebase Configuration

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

#### Deploy Commands

```bash
# Build application
npm run build

# Deploy to preview
firebase hosting:channel:deploy preview

# Deploy to production
firebase deploy --only hosting
```

### 18.8. Environment-specific Builds

Create build scripts untuk different environments:

**`package.json`:**
```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production",
    "deploy:dev": "npm run build:dev && vercel --prod",
    "deploy:staging": "npm run build:staging && netlify deploy --prod --dir=dist",
    "deploy:prod": "npm run build:prod && firebase deploy --only hosting"
  }
}
```

**`.env.staging`:**
```env
VITE_TUGWAR_CONTRACT_ADDRESS=0xYourStagingContractAddress
VITE_WALLETCONNECT_PROJECT_ID=your_staging_project_id
VITE_ENVIRONMENT=staging
```

### 18.9. Post-deployment Checklist

Setelah deployment, pastikan untuk:

#### ✅ **Functional Testing**
- [ ] Wallet connection works
- [ ] Game interactions function properly
- [ ] All UI components render correctly
- [ ] Mobile responsiveness works
- [ ] Error handling displays properly

#### ✅ **Performance Testing**
- [ ] Page load time < 3 seconds
- [ ] Core Web Vitals scores good
- [ ] Bundle size optimized
- [ ] Images load properly
- [ ] No console errors

#### ✅ **Security Testing**
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No sensitive data in build
- [ ] Environment variables secured
- [ ] XSS protection enabled

#### ✅ **SEO & Meta Tags**
```html
<!-- Add to public/index.html -->
<meta name="title" content="TugWar Game - Blockchain Gaming">
<meta name="description" content="Play TugWar, the ultimate blockchain tug of war game on Monad">
<meta name="keywords" content="blockchain, game, tugwar, monad, web3">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="TugWar Game">
<meta property="og:description" content="Ultimate blockchain tug of war game">
<meta property="og:image" content="/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="TugWar Game">
<meta property="twitter:description" content="Ultimate blockchain tug of war game">
<meta property="twitter:image" content="/twitter-image.png">
```

### 18.10. Monitoring dan Analytics

#### Setup Simple Analytics

Add to `src/utils/analytics.ts`:

```typescript
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class SimpleAnalytics {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENVIRONMENT === 'production';
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    // Send to your analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, event.properties);
    }

    // Log for debugging
    console.log('Analytics:', event);
  }

  trackPageView(page: string) {
    this.track({
      name: 'page_view',
      properties: { page }
    });
  }

  trackGameAction(action: string, data?: any) {
    this.track({
      name: 'game_action',
      properties: { action, ...data }
    });
  }
}

export const analytics = new SimpleAnalytics();
```

#### Usage in Components

```typescript
// In Container.tsx
import { analytics } from '../utils/analytics';

const handlePull = async (isTeam1: boolean) => {
  analytics.trackGameAction('pull', { team: isTeam1 ? 1 : 2 });
  // ... rest of function
};
```

#### Error Tracking

Add simple error boundary:

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Send to error tracking service
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      // Send to your error tracking service
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-white/10 rounded-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-300 mb-6">
              The game encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 19. Kesimpulan

Selamat! Anda telah berhasil membuat frontend lengkap untuk TugWar Game. Frontend ini menyediakan:

### ✅ **Fitur Lengkap:**
- **Interactive Game Interface** dengan real-time updates
- **Responsive Design** untuk semua devices
- **Web3 Integration** dengan RainbowKit dan Wagmi
- **Real-time Events** dari smart contract
- **Modern UI/UX** dengan TailwindCSS dan animasi
- **Performance Optimization** dengan lazy loading dan caching

### ✅ **Production Ready:**
- **Multiple deployment options** (Vercel, Netlify, Firebase, GitHub Pages)
- **Environment configuration** untuk development dan production
- **Testing strategy** dengan unit tests dan E2E tests
- **Error handling** dan user feedback
- **Analytics integration** untuk monitoring

### ✅ **Best Practices:**
- **TypeScript** untuk type safety
- **Component architecture** yang scalable
- **Performance optimization** dengan React best practices
- **Security considerations** dengan proper validation
- **Accessibility** dengan semantic HTML dan proper contrast

### 🚀 **Next Steps:**

1. **Enhanced Features:**
   - Tournament system
   - Player profiles dan statistics
   - NFT rewards integration
   - Multi-language support

2. **Advanced Integrations:**
   - Social features (sharing, leaderboards)
   - Mobile app dengan React Native
   - Discord/Telegram bot integration
   - Analytics dashboard untuk game owners

3. **Scale and Optimize:**
   - CDN integration untuk faster loading
   - Progressive Web App (PWA) features
   - Advanced caching strategies
   - Performance monitoring dengan Core Web Vitals

Frontend TugWar ini memberikan foundation yang solid untuk blockchain gaming experience yang engaging dan user-friendly. Dengan deployment yang mudah dan monitoring yang proper, game ini siap untuk digunakan oleh players di seluruh dunia!

**Happy gaming! 🎮🚀**