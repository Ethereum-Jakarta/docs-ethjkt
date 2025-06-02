---
sidebar_position: 4
title: Integrasi Frontend dengan TugWar Game
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
@import "tailwindcss";

body {
  font-family: "Inter", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@keyframes rope-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.rope-shake {
  animation: rope-shake 0.3s ease-in-out;
}

@keyframes victory-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.victory-pulse {
  animation: victory-pulse 0.8s ease-in-out infinite;
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
          <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
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
import { Users, Trophy } from "lucide-react"

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm py-4 border-b border-white/10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Users className="w-6 h-6 text-blue-400" />
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TugWar Game</h1>
            <p className="text-xs text-gray-300">Powered by Monad</p>
          </div>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}

export default Header
```

## 7. Membuat Game Board

Buat file `src/components/GameBoard.tsx`:

```typescript
import type { GameInfo } from "../types/game";

interface GameBoardProps {
  gameInfo: GameInfo;
  isShaking: boolean;
}

const GameBoard = ({ gameInfo, isShaking }: GameBoardProps) => {
  const { ropePosition, team1Score, team2Score, winner } = gameInfo;
  
  // Calculate rope position for visualization (center at position 0)
  const ropeVisualPosition = Math.max(-10, Math.min(10, ropePosition));
  const ropePercentage = ((ropeVisualPosition + 10) / 20) * 100;

  const getRopeEmoji = () => {
    if (winner === 1) return "🏆";
    if (winner === 2) return "🏆";
    return "🔥";
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Battle Arena</h2>
        <div className="flex justify-between items-center text-lg">
          <div className={`text-blue-400 font-bold ${winner === 1 ? 'victory-pulse' : ''}`}>
            Team 1: {team1Score}
          </div>
          <div className="text-white">VS</div>
          <div className={`text-red-400 font-bold ${winner === 2 ? 'victory-pulse' : ''}`}>
            Team 2: {team2Score}
          </div>
        </div>
      </div>

      {/* Rope Visualization */}
      <div className="relative mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Team 1 Territory</span>
          <span>Center</span>
          <span>Team 2 Territory</span>
        </div>
        
        <div className="relative h-12 bg-gradient-to-r from-blue-900/50 via-gray-700/50 to-red-900/50 rounded-lg border-2 border-white/30 overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/60 transform -translate-x-1/2"></div>
          
          {/* Rope indicator */}
          <div 
            className={`absolute top-1/2 w-8 h-8 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ${isShaking ? 'rope-shake' : ''}`}
            style={{ left: `${ropePercentage}%` }}
          >
            <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-yellow-300">
              {getRopeEmoji()}
            </div>
          </div>
          
          {/* Territory markers */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 font-bold">🔵</div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400 font-bold">🔴</div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>-10</span>
          <span>0</span>
          <span>+10</span>
        </div>
      </div>

      {/* Position indicator */}
      <div className="text-center">
        <p className="text-white">
          Rope Position: <span className="font-mono font-bold">{ropePosition}</span>
        </p>
        {winner === 0 && (
          <p className="text-gray-300 text-sm mt-1">
            {ropePosition > 0 ? "Team 2 is pulling ahead!" : ropePosition < 0 ? "Team 1 is pulling ahead!" : "Perfect balance!"}
          </p>
        )}
      </div>

      {/* Winner announcement */}
      {winner !== 0 && (
        <div className="mt-4 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 px-6 rounded-lg shadow-lg victory-pulse">
            🎉 Team {winner} Wins! 🎉
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
```

## 8. Membuat Game Controls

Buat file `src/components/GameControls.tsx`:

```typescript
import { useState } from "react";
import { Users, Zap } from "lucide-react";

interface GameControlsProps {
  onPull: (isTeam1: boolean) => void;
  isConnected: boolean;
  winner: number;
  isLoading: boolean;
}

const GameControls = ({ onPull, isConnected, winner, isLoading }: GameControlsProps) => {
  const [lastPull, setLastPull] = useState<number | null>(null);

  const handlePull = (isTeam1: boolean) => {
    if (!isConnected || winner !== 0 || isLoading) return;
    
    onPull(isTeam1);
    setLastPull(isTeam1 ? 1 : 2);
    
    // Reset last pull indicator after 2 seconds
    setTimeout(() => setLastPull(null), 2000);
  };

  const getButtonClass = (isTeam1: boolean) => {
    const baseClass = "flex-1 py-6 px-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg border-2";
    const teamNumber = isTeam1 ? 1 : 2;
    
    if (!isConnected || winner !== 0) {
      return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600`;
    }
    
    if (isLoading) {
      return `${baseClass} ${isTeam1 ? 'bg-blue-500 border-blue-400' : 'bg-red-500 border-red-400'} opacity-50 cursor-not-allowed text-white`;
    }
    
    const recentPull = lastPull === teamNumber ? 'ring-4 ring-yellow-400 scale-105' : '';
    
    return `${baseClass} ${isTeam1 ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border-blue-400 text-white' : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border-red-400 text-white'} ${recentPull}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
      <h3 className="text-xl font-bold text-white text-center mb-4">Choose Your Team</h3>
      
      {!isConnected && (
        <div className="text-center mb-4">
          <p className="text-yellow-300 text-sm">⚠️ Connect your wallet to play!</p>
        </div>
      )}
      
      {winner !== 0 && (
        <div className="text-center mb-4">
          <p className="text-green-300 text-sm">🎉 Game Over! Reset to play again.</p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => handlePull(true)}
          disabled={!isConnected || winner !== 0 || isLoading}
          className={getButtonClass(true)}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="w-6 h-6" />
            <div>
              <div>Pull for Team 1</div>
              <div className="text-sm opacity-80">🔵 Blue Team</div>
            </div>
            <Zap className="w-5 h-5" />
          </div>
        </button>
        
        <button
          onClick={() => handlePull(false)}
          disabled={!isConnected || winner !== 0 || isLoading}
          className={getButtonClass(false)}
        >
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5" />
            <div>
              <div>Pull for Team 2</div>
              <div className="text-sm opacity-80">🔴 Red Team</div>
            </div>
            <Users className="w-6 h-6" />
          </div>
        </button>
      </div>

      {isLoading && (
        <div className="text-center mt-4">
          <div className="inline-flex items-center space-x-2 text-yellow-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-300"></div>
            <span className="text-sm">Processing pull...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;
```

## 9. Membuat Game Stats

Buat file `src/components/GameStats.tsx`:

```typescript
import { BarChart3, Target, Trophy } from "lucide-react";
import type { GameInfo, TeamStats, GamePrediction } from "../types/game";

interface GameStatsProps {
  gameInfo: GameInfo;
  team1Stats: TeamStats;
  team2Stats: TeamStats;
  prediction: GamePrediction;
  isOwner: boolean;
  onReset: () => void;
  isResetting: boolean;
}

const GameStats = ({ 
  gameInfo, 
  team1Stats, 
  team2Stats, 
  prediction, 
  isOwner, 
  onReset, 
  isResetting 
}: GameStatsProps) => {
  const { maxScoreDifference, totalPulls, gamesPlayed } = gameInfo;

  const getProgressPercentage = (score: number) => {
    return Math.min((score / maxScoreDifference) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Team Statistics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Team Statistics
        </h3>
        
        <div className="space-y-4">
          {/* Team 1 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-400 font-semibold">🔵 Team 1</span>
              <span className="text-white">{team1Stats.score} points</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(team1Stats.score)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{team1Stats.isWinning ? "🏆 Leading" : "📈 Catching up"}</span>
              <span>Advantage: +{team1Stats.scoreAdvantage}</span>
            </div>
          </div>

          {/* Team 2 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-400 font-semibold">🔴 Team 2</span>
              <span className="text-white">{team2Stats.score} points</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(team2Stats.score)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{team2Stats.isWinning ? "🏆 Leading" : "📈 Catching up"}</span>
              <span>Advantage: +{team2Stats.scoreAdvantage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Info & Prediction */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Game Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Win Condition:</span>
            <span className="text-white font-semibold">{maxScoreDifference} points ahead</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-300">Total Pulls:</span>
            <span className="text-white font-semibold">{totalPulls}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-300">Games Played:</span>
            <span className="text-white font-semibold">{gamesPlayed}</span>
          </div>

          {/* Prediction */}
          {prediction.predictedWinner > 0 && (
            <div className="mt-4 p-3 bg-purple-900/50 rounded-lg border border-purple-600/50">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 text-sm font-semibold">🔮 AI Prediction</span>
                <span className="text-white text-sm">{prediction.confidence}% confidence</span>
              </div>
              <div className="text-white font-bold mt-1">
                Team {prediction.predictedWinner} is favored to win
              </div>
            </div>
          )}

          {/* Reset Button for Owner */}
          {isOwner && (
            <button
              onClick={onReset}
              disabled={isResetting}
              className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Reset Game</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
```

## 10. Implementasi Komponen Container

Buat file `src/components/Container.tsx` yang akan berisi logika utama interaksi dengan kontrak:

```typescript
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { TUGWAR_ABI, TUGWAR_CONTRACT_ADDRESS } from "../constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../App";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import GameStats from "./GameStats";
import GameHistory from "./GameHistory";
import type { GameInfo, TeamStats, GamePrediction, GameEvent } from "../types/game";

const tugwarContract = {
  address: TUGWAR_CONTRACT_ADDRESS as `0x${string}`,
  abi: TUGWAR_ABI,
};

const Container = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  // Read game information
  const { data: gameInfoData, refetch: refetchGameInfo } = useReadContract({
    ...tugwarContract,
    functionName: "getGameInfo",
    query: {
      enabled: isConnected,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  // Read team 1 stats
  const { data: team1StatsData, refetch: refetchTeam1Stats } = useReadContract({
    ...tugwarContract,
    functionName: "getTeamStats",
    args: [1],
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  });

  // Read team 2 stats
  const { data: team2StatsData, refetch: refetchTeam2Stats } = useReadContract({
    ...tugwarContract,
    functionName: "getTeamStats",
    args: [2],
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  });

  // Read prediction
  const { data: predictionData, refetch: refetchPrediction } = useReadContract({
    ...tugwarContract,
    functionName: "getPrediction",
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  });

  // Read owner
  const { data: ownerData } = useReadContract({
    ...tugwarContract,
    functionName: "owner",
    query: {
      enabled: isConnected,
    },
  });

  // Process data with proper type assertions and checks
  const gameInfo: GameInfo = gameInfoData && Array.isArray(gameInfoData) ? {
    ropePosition: Number(gameInfoData[0]),
    team1Score: Number(gameInfoData[1]),
    team2Score: Number(gameInfoData[2]),
    maxScoreDifference: Number(gameInfoData[3]),
    winner: Number(gameInfoData[4]),
    totalPulls: Number(gameInfoData[5]),
    gamesPlayed: Number(gameInfoData[6]),
  } : {
    ropePosition: 0,
    team1Score: 0,
    team2Score: 0,
    maxScoreDifference: 5,
    winner: 0,
    totalPulls: 0,
    gamesPlayed: 0,
  };

  const team1Stats: TeamStats = team1StatsData && Array.isArray(team1StatsData) ? {
    score: Number(team1StatsData[0]),
    isWinning: Boolean(team1StatsData[1]),
    scoreAdvantage: Number(team1StatsData[2]),
  } : { score: 0, isWinning: false, scoreAdvantage: 0 };

  const team2Stats: TeamStats = team2StatsData && Array.isArray(team2StatsData) ? {
    score: Number(team2StatsData[0]),
    isWinning: Boolean(team2StatsData[1]),
    scoreAdvantage: Number(team2StatsData[2]),
  } : { score: 0, isWinning: false, scoreAdvantage: 0 };

  const prediction: GamePrediction = predictionData && Array.isArray(predictionData) ? {
    predictedWinner: Number(predictionData[0]),
    confidence: Number(predictionData[1]),
  } : { predictedWinner: 0, confidence: 0 };

  const isOwner = address && ownerData && address.toLowerCase() === (ownerData as string).toLowerCase();

  // Watch for contract events
  useWatchContractEvent({
    ...tugwarContract,
    eventName: 'PullExecuted',
    onLogs(logs) {
      console.log('Pull executed:', logs);
      triggerShake();
      refetchAll();
      
      // Add event to history
      const log = logs[0];
      if (log && 'args' in log && log.args) {
        const args = log.args as {
          player: string;
          isTeam1: boolean;
          newRopePosition: number;
          team1Score: number;
          team2Score: number;
        };
        
        const { player, isTeam1, team1Score, team2Score } = args;
        const newEvent: GameEvent = {
          type: 'pull',
          player: player,
          team: isTeam1 ? 1 : 2,
          timestamp: Date.now(),
        };
        setGameEvents(prev => [...prev, newEvent]);
        
        // Show toast notification
        toast.success(
          `${isTeam1 ? 'Team 1' : 'Team 2'} pulled! Score: ${team1Score} - ${team2Score}`,
          {
            style: {
              background: "#2B2F36",
              color: "#fff",
            },
          }
        );
      }
    },
  });

  useWatchContractEvent({
    ...tugwarContract,
    eventName: 'GameWon',
    onLogs(logs) {
      console.log('Game won:', logs);
      refetchAll();
      
      // Add event to history
      const log = logs[0];
      if (log && 'args' in log && log.args) {
        const args = log.args as {
          winningTeam: number;
          finalScore1: number;
          finalScore2: number;
        };
        
        const { winningTeam, finalScore1, finalScore2 } = args;
        const newEvent: GameEvent = {
          type: 'win',
          team: Number(winningTeam),
          timestamp: Date.now(),
        };
        setGameEvents(prev => [...prev, newEvent]);
        
        // Show victory toast
        toast.success(
          `🎉 Team ${winningTeam} Wins! Final Score: ${finalScore1} - ${finalScore2}`,
          {
            duration: 5000,
            style: {
              background: "#2B2F36",
              color: "#fff",
            },
          }
        );
      }
    },
  });

  useWatchContractEvent({
    ...tugwarContract,
    eventName: 'GameReset',
    onLogs(logs) {
      console.log('Game reset:', logs);
      refetchAll();
      
      // Add event to history and clear previous events
      const newEvent: GameEvent = {
        type: 'reset',
        timestamp: Date.now(),
      };
      setGameEvents([newEvent]); // Reset history on game reset
      
      toast.success('Game has been reset!', {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });
    },
  });

  // Trigger rope shake animation
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  // Refetch all data
  const refetchAll = () => {
    refetchGameInfo();
    refetchTeam1Stats();
    refetchTeam2Stats();
    refetchPrediction();
  };

  // Handle pull action
  const handlePull = async (isTeam1: boolean) => {
    if (!isConnected || gameInfo.winner !== 0) return;

    setIsLoading(true);
    
    toast.loading(`Team ${isTeam1 ? '1' : '2'} is pulling...`, {
      style: {
        background: "#2B2F36",
        color: "#fff",
      },
    });

    try {
      const result = await writeContractAsync({
        ...tugwarContract,
        functionName: "pull",
        args: [isTeam1],
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Confirming pull...", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });

      toast.dismiss();
      // Success toast will be handled by event listener
      
    } catch (error) {
      console.error("Pull failed:", error);
      toast.dismiss();
      toast.error("Pull failed. Please try again.", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset game (owner only)
  const handleReset = async () => {
    if (!isConnected || !isOwner) return;

    setIsResetting(true);
    
    toast.loading("Resetting game...", {
      style: {
        background: "#2B2F36",
        color: "#fff",
      },
    });

    try {
      const result = await writeContractAsync({
        ...tugwarContract,
        functionName: "reSet",
        args: [5], // Reset with default max score difference of 5
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Confirming reset...", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });

      toast.dismiss();
      // Success toast will be handled by event listener
      
    } catch (error) {
      console.error("Reset failed:", error);
      toast.dismiss();
      toast.error("Reset failed. Please try again.", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {isConnected ? (
        <div className="space-y-6">
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
        <div className="text-center py-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-white/20">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to TugWar!</h2>
            <p className="text-gray-300 mb-6">
              Connect your wallet to start playing the ultimate blockchain tug of war game. 
              Choose your team and battle for victory!
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <span>🔵</span>
                <span>Team 1</span>
              </div>
              <div>VS</div>
              <div className="flex items-center space-x-1">
                <span>🔴</span>
                <span>Team 2</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Container;
```

## 11. Membuat Game History Component

Untuk melengkapi experience, buat file `src/components/GameHistory.tsx`:

```typescript
import { useState } from "react";
import { Clock, Trophy, Users, RotateCcw } from "lucide-react";
import type { GameEvent } from "../types/game";

interface GameHistoryProps {
  events: GameEvent[];
}

const GameHistory = ({ events }: GameHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'pull': return <Users className="w-4 h-4" />;
      case 'win': return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'reset': return <RotateCcw className="w-4 h-4 text-orange-400" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getEventMessage = (event: GameEvent) => {
    switch (event.type) {
      case 'pull':
        return `Team ${event.team} pulled the rope`;
      case 'win':
        return `🎉 Team ${event.team} won the game!`;
      case 'reset':
        return `🔄 Game was reset`;
      default:
        return 'Unknown event';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'pull': return 'bg-blue-900/50 border-blue-600/50';
      case 'win': return 'bg-yellow-900/50 border-yellow-600/50';
      case 'reset': return 'bg-orange-900/50 border-orange-600/50';
      default: return 'bg-gray-900/50 border-gray-600/50';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-bold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Game History ({events.length})
        </h3>
        <div className="text-white text-xl">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-gray-400">No events yet</p>
              <p className="text-gray-500 text-sm">Start pulling to see game history!</p>
            </div>
          ) : (
            events.slice().reverse().map((event, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${getEventColor(event.type)}`}
              >
                <div className="text-gray-300">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{getEventMessage(event)}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {event.player && (
                  <div className="text-xs text-gray-400 font-mono max-w-20 truncate">
                    {event.player.slice(0, 6)}...{event.player.slice(-4)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory;
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
@keyframes rope-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.rope-shake {
  animation: rope-shake 0.3s ease-in-out;
}

@keyframes victory-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.victory-pulse {
  animation: victory-pulse 0.8s ease-in-out infinite;
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