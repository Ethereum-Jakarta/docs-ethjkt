---
sidebar_position: 4
title: "Session 4 - Sprouting Growth: Building Your First DApp"
sidebar_label: "Session 4 - Sprouting Growth"
description: "Turn your contract into something people can actually use! Learn how to connect a smart contract to a frontend and create your first decentralized application (DApp) using Next.js, Panna SDK for account abstraction and gasless transactions, and modern Web3 tools."
keywords: [lisk, nextjs, react, panna-sdk, account-abstraction, gasless-transactions, dapp, frontend, web3, blockchain, thirdweb, typescript, tailwind]
---

# Session 4: Sprouting Growth - Building Your First DApp

**Session Date**: October 29, 2025 | 19:30 - 21:00 (GMT+7)

Turn your contract into something people can actually use! Learn how to connect a smart contract to a frontend and create your first decentralized application (DApp).

**By**: ETH JKT

---

## 🎯 Session Overview

In Session 3, we built a powerful `LiskGarden` smart contract with Hardhat. But there's one big problem: **how can regular users interact with our contract?**

Imagine you have an amazing restaurant (smart contract), but there's no entrance or menu (frontend). People won't be able to enjoy your food!

In this session, we will:
- ✅ Build a **modern frontend** with Next.js 15 and React 19
- ✅ Integrate **Panna SDK** for account abstraction and gasless transactions
- ✅ Connect to **smart contract** using Thirdweb
- ✅ Create a **real-time UI** that's responsive and beautiful
- ✅ Deploy **production-ready DApp** to the internet!

---

## Learning Path

```
Setup Development Environment
    ↓
Frontend 101: Understanding DApps & Next.js Setup
    ↓
Frontend 102: Panna SDK & Account Abstraction
    ↓
Frontend 103: Contract Integration with Thirdweb
    ↓
Frontend 104: Building UI Components
    ↓
Frontend 105: Real-time State Management
    ↓
Frontend 106: Advanced Features & Deployment
```

---

## Prerequisites

Before starting, make sure you have:

### ✅ Completed Previous Sessions
- [x] **Session 1**: Understanding blockchain basics and Lisk ecosystem
- [x] **Session 2**: Deploy your first smart contract on Remix
- [x] **Session 3**: Build LiskGarden contract with Hardhat

### ✅ Technical Requirements
- [x] **Node.js** v18.17 or higher
- [x] **npm** or **pnpm** package manager
- [x] **Git** for version control
- [x] **MetaMask** wallet extension
- [x] **Lisk Sepolia ETH** for testing (from faucet)
- [x] **Code editor** (VS Code recommended)
- [x] **Modern browser** (Chrome/Brave/Firefox)

### ✅ Knowledge Requirements
- [x] Basic HTML/CSS
- [x] JavaScript fundamentals
- [x] React basics (helpful but not required)
- [x] Solidity basics from Session 3

### 🔑 Contract Address
Make sure you have your **deployed contract address** from Session 3. If not, deploy the `LiskGarden` contract to Lisk Sepolia testnet first!

---

## Part 1: Understanding DApps

### What is a DApp?

**DApp (Decentralized Application)** is an application that runs on blockchain, not on centralized servers.

**Key Differences:**

| Aspect | Web2 (Traditional App) | Web3 (DApp) |
|--------|------------------------|-------------|
| **Data Storage** | Centralized servers (AWS, Google Cloud) | Blockchain (decentralized) |
| **Authentication** | Email/password, OAuth | Wallet address (MetaMask) |
| **Payment** | Credit card, PayPal | Cryptocurrency (ETH) |
| **Ownership** | Platform owns your data | You own your data |
| **Transparency** | Opaque (can be manipulated) | Transparent (everything on-chain) |
| **Downtime** | Single point of failure | Always available (distributed) |
| **Censorship** | Can be censored by platform | Censorship-resistant |

### DApp Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  (Next.js + React - Runs in Browser)           │
│                                                 │
│  ┌─────────────┐  ┌──────────────┐            │
│  │ Components  │  │ State Mgmt   │            │
│  │ (UI/UX)     │  │ (Hooks)      │            │
│  └─────────────┘  └──────────────┘            │
└───────────────┬─────────────────────────────────┘
                │
                │ Web3 Libraries
                │ (Panna SDK, Thirdweb, Viem)
                │
┌───────────────▼─────────────────────────────────┐
│         ACCOUNT ABSTRACTION LAYER               │
│            (Panna SDK)                          │
│                                                 │
│  • Gasless transactions (no ETH for gas)        │
│  • Smart wallet management                      │
│  • Simplified UX for users                      │
│  • Session keys & social recovery               │
└───────────────┬─────────────────────────────────┘
                │
                │ JSON-RPC
                │
┌───────────────▼─────────────────────────────────┐
│           BLOCKCHAIN LAYER                      │
│         (Lisk Sepolia Network)                  │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │    LiskGarden Smart Contract     │          │
│  │                                   │          │
│  │  • plantSeed()                    │          │
│  │  • waterPlant()                   │          │
│  │  • harvestPlant()                 │          │
│  │  • updatePlantStage()             │          │
│  │  • getPlant()                     │          │
│  │  • getUserPlants()                │          │
│  └──────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
```

### User Flow Example

Let's trace what happens when a user plants a seed:

1. **User clicks "Plant Seed 🌱" button** in the frontend
2. **Frontend** calls `plantSeed()` function via contract utilities
3. **Panna SDK** handles account abstraction and prepares gasless transaction
4. **User approves** transaction (no gas fees required!)
5. **Transaction** is sent to Lisk Sepolia network via smart wallet
6. **Blockchain** executes smart contract function
7. **Plant state** is created in contract storage (mapping) and assigned to user address
8. **Frontend** detects on-chain changes and **updates UI** in real-time
9. **User sees** new plant appear in their garden! 🎉

**The magic**: All this happens in **seconds** with **full transparency** and **no gas fees** for the user!

### Why Account Abstraction Matters

**Traditional Web3 (Without Account Abstraction)**:
```
❌ User needs ETH for gas fees
❌ Complex wallet management (seed phrases, private keys)
❌ Each transaction costs money
❌ High barrier to entry for new users
❌ Poor UX compared to Web2 apps
```

**Modern Web3 (With Account Abstraction via Panna SDK)**:
```
✅ Gasless transactions - users don't need ETH
✅ Smart wallets with advanced features
✅ Social recovery (recover wallet without seed phrase)
✅ Session keys (don't sign every transaction)
✅ Batch transactions (multiple actions in one)
✅ Web2-like UX for Web3 apps
```

---

## Part 2: Tech Stack Deep Dive

### Frontend Framework

#### Next.js 15 - The React Framework

**What it is**: Production-ready React framework with server-side rendering

**Why we use it**:
- ⚡ **Server-side rendering (SSR)** - Better SEO and performance
- 🚀 **App Router** - Modern routing with React Server Components
- 📦 **Built-in optimization** - Automatic code splitting, image optimization
- 🔥 **Hot reload** - See changes instantly during development
- 🎯 **API routes** - Build backend API alongside frontend
- 📱 **Responsive by default** - Mobile-first approach

**Version**: `15.2.4` (latest stable)

#### React 19 - UI Library

**What it is**: JavaScript library for building user interfaces

**Features we use**:
- 🪝 **Hooks** - useState, useEffect, useCallback for state management
- 🔄 **Real-time updates** - Reactive UI that responds to blockchain changes
- 🎯 **Component-based** - Reusable UI building blocks
- 📊 **Virtual DOM** - Efficient rendering

**Version**: `^19.0.0` (latest stable)

### Styling

#### Tailwind CSS 4.1.9

**What it is**: Utility-first CSS framework

**Why we use it**:
- 🎨 No separate CSS files needed
- 🌈 Consistent design system
- 📱 Responsive design made easy (`md:`, `lg:` breakpoints)
- 🌙 Dark mode support built-in (`dark:` prefix)
- ⚡ Production CSS is tiny (unused styles removed)

**Example**:
```jsx
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
  Click me
</button>
```

#### shadcn/ui - Component Library

**What it is**: Pre-built, customizable UI components

**Components we use**:
- 🃏 **Card** - Container for plant information
- 🔘 **Button** - Interactive buttons with variants
- 🪟 **Dialog** - Modal for plant details
- 📊 **Progress** - Visual progress bars for growth and water levels

**Why it's great**:
- Copy-paste components into your project (you own the code)
- Built with Radix UI primitives (accessible)
- Fully customizable with Tailwind

### Web3 Integration

#### Panna SDK 0.1.0 - Account Abstraction & Gasless Transactions

**What it is**: SDK for implementing account abstraction in your DApp

**Core Features**:

| Feature | Description | User Benefit |
|---------|-------------|--------------|
| **Gasless Transactions** | Users don't pay gas fees | No need to buy ETH first |
| **Smart Wallets** | Advanced wallet functionality | Social recovery, session keys |
| **Account Abstraction** | EIP-4337 implementation | Web2-like UX |
| **Multi-wallet Support** | MetaMask, WalletConnect, etc. | User choice |
| **Auto-connect** | Remember previous sessions | Seamless experience |

**How it works**:
```
Traditional:
User → MetaMask → Pay Gas → Execute Transaction

With Panna SDK:
User → Smart Wallet (via Panna) → Sponsor pays gas → Execute Transaction
```

**Version**: `^0.1.0`

#### Thirdweb SDK 5.69.2 - Contract Interaction

**What it is**: SDK for interacting with smart contracts

**Features we use**:
- 📞 **Read functions** - Call view functions (`getPlant()`, `getUserPlants()`)
- ✍️ **Write functions** - Execute state-changing functions (`plantSeed()`, `waterPlant()`)
- 🔄 **Transaction handling** - Wait for confirmations, handle errors
- 📡 **Event listening** - React to on-chain events in real-time

**Version**: `^5.69.2`

#### Viem 2.23.2 - Ethereum Library

**What it is**: TypeScript library for Ethereum

**Features we use**:
- 🔢 **BigInt handling** - Work with large numbers (token amounts, IDs)
- 🏠 **Address utilities** - Validate and format addresses
- 💰 **Unit conversion** - Convert between ETH and Wei (`toWei()`, `fromWei()`)
- ⚡ **Type-safe** - Catch errors at compile time

**Version**: `^2.23.2`

### Complete Tech Stack Table

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 15.2.4 | React framework with SSR |
| | React | 19.0.0 | UI library |
| **Styling** | Tailwind CSS | 4.1.9 | Utility-first CSS |
| | shadcn/ui | latest | Pre-built components |
| **Web3** | Panna SDK | 0.1.0 | Account abstraction |
| | Thirdweb | 5.69.2 | Contract interaction |
| | Viem | 2.23.2 | Ethereum utilities |
| **Icons** | Lucide React | 0.469.0 | Beautiful icons |
| **Language** | TypeScript | 5 | Type safety |

---

## Frontend 101: Next.js Project Setup

### Step 1: Create Next.js Project

Open terminal and navigate to your working folder:

```bash
cd ~/Documents/work/web3
```

Create new Next.js project with TypeScript:

```bash
npx create-next-app@latest lisk-garden-dapp
```

**Configuration prompts** (answer like this):

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to use Turbopack for next dev? … Yes
✔ Would you like to customize the import alias (@/* by default)? … No
```

**Expected output:**

```
Creating a new Next.js app in /Users/macbook/Documents/work/web3/lisk-garden-dapp.

Using npm.

Initializing project with template: app-tw

Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- postcss
- tailwindcss
- eslint
- eslint-config-next

added 366 packages, and audited 367 packages in 45s

Initialized a git repository.

Success! Created lisk-garden-dapp at /Users/macbook/Documents/work/web3/lisk-garden-dapp
```

Navigate to project folder:

```bash
cd lisk-garden-dapp
```

### Step 2: Install Web3 Dependencies

Install all Web3 libraries we need:

```bash
npm install panna-sdk thirdweb viem lucide-react
```

**What we're installing**:
- `panna-sdk` - Account abstraction and gasless transactions
- `thirdweb` - Contract interaction
- `viem` - Ethereum utilities
- `lucide-react` - Beautiful icons

**Expected output:**

```
added 45 packages, and audited 412 packages in 12s

139 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 2b: Install Theme & Utility Libraries

Install additional packages for theming and utilities:

```bash
npm install next-themes clsx tailwind-merge
```

**What we're installing**:
- `next-themes` - Dark/light mode support with system theme detection
- `clsx` - Utility for conditional CSS classes
- `tailwind-merge` - Merge Tailwind classes intelligently

**Expected output:**

```
added 3 packages, and audited 415 packages in 3s

found 0 vulnerabilities
```

### Step 3: Install shadcn/ui Components

Initialize shadcn/ui:

```bash
npx shadcn@latest init
```

**Configuration prompts:**

```
✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS.

✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Zinc
✔ Would you like to use CSS variables for colors? … yes

✔ Writing components.json.
✔ Checking registry.
✔ Updating tailwind.config.js
✔ Updating app/globals.css

✔ Installing dependencies.

Success! Project initialization completed.
```

Install all components we need for production:

```bash
npx shadcn@latest add button card dialog progress toast separator skeleton
```

**What we're installing**:
- `button` - Interactive buttons with variants
- `card` - Container components
- `dialog` - Modal dialogs
- `progress` - Progress bars
- `toast` - Notification toasts
- `separator` - Visual separators
- `skeleton` - Loading skeletons

**Expected output:**

```
✔ Checking registry.
✔ Installing components.
  ✔ button
  ✔ card
  ✔ dialog
  ✔ progress
  ✔ toast
  ✔ separator
  ✔ skeleton

✔ Done.
```

### Step 4: Setup Environment Variables

Create `.env.local` file:

```bash
touch .env.local
```

Add your configuration:

```env
# Panna SDK Configuration (Account Abstraction)
NEXT_PUBLIC_PANNA_CLIENT_ID=your_panna_client_id_here
NEXT_PUBLIC_PANNA_PARTNER_ID=your_panna_partner_id_here

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=4202
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

**How to get Panna credentials:**

1. Visit [https://panna.xyz](https://panna.xyz)
2. Sign up / Login with your wallet
3. Create new project
4. Copy **Client ID** and **Partner ID**
5. Configure **gasless transactions** settings for your app

**🚨 IMPORTANT**:
- Replace `your_panna_client_id_here` with your actual Client ID
- Replace `your_panna_partner_id_here` with your actual Partner ID
- Replace `your_deployed_contract_address_here` with contract address from Session 3

### Step 5: Create Project Folders

Create folders to organize our code:

```bash
mkdir hooks lib types
```

**Folder structure**:

```
lisk-garden-dapp/
├── app/                    # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks ← NEW
├── lib/                    # Utility functions ← NEW
├── types/                  # TypeScript types ← NEW
├── public/                 # Static assets
├── .env.local              # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Step 6: Verify Installation

Check all dependencies are installed:

```bash
npm list --depth=0
```

**Expected packages:**

```
lisk-garden-dapp@0.1.0
├── lucide-react@0.469.0
├── next@15.2.4
├── panna-sdk@0.1.0
├── react@19.0.0
├── react-dom@19.0.0
├── tailwindcss@4.1.9
├── thirdweb@5.69.2
├── typescript@5.7.2
└── viem@2.23.2
```

### Try It!

Run development server:

```bash
npm run dev
```

**Expected output:**

```
  ▲ Next.js 15.2.4
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.3s
```

Open browser → Visit `http://localhost:3000` → See Next.js welcome page! 🎉

Stop server with `Ctrl + C`.

---

## Frontend 102: Panna SDK & Account Abstraction

### Understanding Account Abstraction

**Traditional Wallet (EOA - Externally Owned Account)**:
```
User
  ↓ (Controls with private key)
Wallet Address (0x123...)
  ↓ (Signs transaction)
Blockchain
```

**Problems**:
- ❌ User must have ETH for gas
- ❌ Lose private key = lose everything
- ❌ Must sign every transaction manually
- ❌ No advanced features

**Smart Wallet (Account Abstraction)**:
```
User
  ↓ (Authenticated)
Smart Contract Wallet
  ↓ (Programmable logic)
  • Session keys
  • Social recovery
  • Gas sponsorship
  • Batch transactions
  ↓
Blockchain
```

**Benefits**:
- ✅ Gasless transactions (sponsor pays)
- ✅ Social recovery (recover with friends/email)
- ✅ Session keys (auto-approve certain actions)
- ✅ Batch transactions (multiple actions at once)
- ✅ Web2-like UX

### Step 1: Create Contract Types

Create `types/contracts.ts`:

```typescript
// Contract type definitions for LiskGarden DApp

// Growth stages enum matching smart contract
export enum GrowthStage {
  SEED = 0,
  SPROUT = 1,
  GROWING = 2,
  BLOOMING = 3,
}

// Plant data structure matching smart contract
export interface Plant {
  id: bigint              // Unique plant ID
  owner: string           // Owner address (0x...)
  stage: GrowthStage      // Current growth stage
  plantedDate: bigint     // Timestamp when planted
  lastWatered: bigint     // Timestamp of last watering
  waterLevel: number      // Water percentage (0-100)
  exists: boolean         // Does this plant exist?
  isDead: boolean         // Is this plant dead?
}

// Contract configuration
export const LISK_GARDEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

// Game constants matching smart contract
export const PLANT_PRICE = '0.001'          // Cost to plant seed (ETH)
export const HARVEST_REWARD = '0.003'       // Reward for harvesting (ETH)
export const STAGE_DURATION = 60            // 60 seconds per stage
export const WATER_DEPLETION_TIME = 30      // 30 seconds between water depletion
export const WATER_DEPLETION_RATE = 20      // Lose 20% water every 30 seconds

// Stage names for UI
export const STAGE_NAMES = {
  [GrowthStage.SEED]: 'seed',
  [GrowthStage.SPROUT]: 'sprout',
  [GrowthStage.GROWING]: 'growing',
  [GrowthStage.BLOOMING]: 'blooming',
}

// Contract ABI (Application Binary Interface)
export const LISK_GARDEN_ABI = [
  // Read functions
  'function getPlant(uint256 plantId) view returns (uint256 id, address owner, uint8 stage, uint256 plantedDate, uint256 lastWatered, uint8 waterLevel, bool exists, bool isDead)',
  'function getUserPlants(address user) view returns (uint256[])',
  'function calculateWaterLevel(uint256 plantId) view returns (uint8)',
  'function plantCounter() view returns (uint256)',

  // Write functions
  'function plantSeed() payable returns (uint256)',
  'function waterPlant(uint256 plantId)',
  'function harvestPlant(uint256 plantId)',
  'function updatePlantStage(uint256 plantId)',
] as const
```

**Code Explanation**:

| Element | Type | Purpose |
|---------|------|---------|
| `GrowthStage` | enum | Four growth stages (0-3) |
| `Plant` | interface | Plant data structure from contract |
| `LISK_GARDEN_ABI` | array | Function signatures for contract calls |
| Constants | numbers | Game mechanics (timing, costs, rewards) |

**Why `bigint`?**
- Solidity `uint256` is huge (up to 2^256-1)
- JavaScript `number` only safe up to 2^53-1
- `bigint` handles large numbers accurately

### Step 1b: Create Utility Functions

Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Code Explanation**:

The `cn()` function is a utility that intelligently merges Tailwind CSS classes. This is essential for shadcn/ui components and custom styling.

**How it works**:

| Library | Purpose | Example |
|---------|---------|---------|
| `clsx` | Conditional class names | `clsx('btn', isActive && 'active')` |
| `twMerge` | Merge Tailwind classes intelligently | Handles conflicting utilities like `px-2 px-4` → `px-4` |

**Usage example**:

```typescript
// Without cn(): Last class may not work as expected
<div className={`px-4 py-2 ${isActive ? 'px-6' : ''}`} />
// Result: both px-4 and px-6 applied = conflict

// With cn(): Intelligently resolves conflicts
<div className={cn('px-4 py-2', isActive && 'px-6')} />
// Result: px-6 wins when active, px-4 otherwise
```

This utility is used throughout shadcn/ui components and makes it easy to handle conditional styling without class conflicts.

### Step 2: Create Provider Components

Instead of creating separate providers, we'll use a centralized `Providers` component that combines Panna SDK, theme support, and toast notifications.

#### Step 2a: Create Theme Provider

Create `components/theme-provider.tsx`:

```typescript
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Purpose**: Wrapper for `next-themes` to enable dark/light mode switching with system theme detection.

#### Step 2b: Create Centralized Providers

Create `components/providers.tsx`:

```typescript
'use client';

import { PannaProvider } from 'panna-sdk';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_PANNA_CLIENT_ID
  const partnerId = process.env.NEXT_PUBLIC_PANNA_PARTNER_ID

  if (!clientId || !partnerId) {
    throw new Error('Missing Panna SDK credentials in .env.local file')
  }

  return (
    <PannaProvider
      clientId={clientId}
      partnerId={partnerId}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </PannaProvider>
  );
}
```

**Component Explanation**:

| Provider | Purpose | Features |
|----------|---------|----------|
| `PannaProvider` | Account abstraction & gasless transactions | Wallet connection, smart wallets, gasless txs |
| `ThemeProvider` | Dark/light mode | System theme detection, manual toggle |
| `Toaster` | Toast notifications | Success/error messages for transactions |

**Why centralized?**
- ✅ Single source of truth for all providers
- ✅ Easy to add new providers
- ✅ Better organization and maintainability
- ✅ Toaster included globally for all pages

### Step 3: Wrap App with Providers

Edit `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lisk Garden - Grow Your Web3 Plants',
  description: 'A decentralized plant growing game on Lisk Sepolia with gasless transactions powered by Panna SDK',
  keywords: ['lisk', 'web3', 'dapp', 'blockchain', 'game', 'gasless'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**What changed?**
1. Imported centralized `Providers` component (not `PannaProvider`)
2. Wrapped `{children}` with `<Providers>`
3. Added `suppressHydrationWarning` to `<html>` for theme support
4. Updated metadata for SEO

**Result**: Now ALL pages have access to:
- ✅ Account abstraction features (Panna SDK)
- ✅ Theme switching (dark/light mode)
- ✅ Toast notifications (for transaction feedback)

### Step 4: Create useContract Hook

Create `hooks/useContract.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useActiveAccount } from 'panna-sdk'
import { createThirdwebClient } from 'thirdweb'

const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_PANNA_CLIENT_ID || ''

export function useContract() {
  const activeAccount = useActiveAccount()
  const [client, setClient] = useState<any>(null)

  // Initialize Thirdweb client on mount
  useEffect(() => {
    const thirdwebClient = createThirdwebClient({
      clientId: THIRDWEB_CLIENT_ID,
    })
    setClient(thirdwebClient)
  }, [])

  return {
    client,                              // Thirdweb client for contract calls
    account: activeAccount || null,      // User account object (smart wallet)
    address: activeAccount?.address || null,  // User address (0x...)
    isConnected: !!activeAccount,        // Is wallet connected?
  }
}
```

**What changed from traditional approach?**
- ✅ Uses `useActiveAccount()` from Panna SDK (simpler API)
- ✅ No need to manually manage connection state
- ✅ No custom `connect`/`disconnect` functions (handled by Panna's `<LoginButton>`)
- ✅ Cleaner and more concise code

**Hook Return Values**:

| Value | Type | Description | Example |
|-------|------|-------------|---------|
| `client` | ThirdwebClient | For contract calls | `readContract({ client, ...})` |
| `account` | Account \| null | Smart wallet object | Used in `sendTransaction()` |
| `address` | string \| null | Wallet address | `'0x1234...5678'` |
| `isConnected` | boolean | Connection status | `true` or `false` |

### Step 5: Test Account Abstraction

Let's test our setup with a simple page using Panna SDK's built-in `<LoginButton>` component.

Edit `app/page.tsx`:

```typescript
'use client'

import { LoginButton, useActiveAccount, liskSepolia } from 'panna-sdk'

export default function Home() {
  const activeAccount = useActiveAccount()

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              🌱 Lisk Garden
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Web3 plant growing game with gasless transactions
            </p>
          </div>
          <LoginButton chain={liskSepolia} />
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          {activeAccount ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                ✅ Wallet Connected!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Address: <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                  {activeAccount.address}
                </code>
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                ⛽ Account abstraction is active - No gas fees required!
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Welcome to Lisk Garden!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your wallet to start growing plants 🌿
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
```

**Key differences from custom approach**:
- ✅ Uses Panna's built-in `<LoginButton>` component (handles all wallet logic internally)
- ✅ Uses `useActiveAccount()` hook for wallet state
- ✅ No need for custom connect/disconnect buttons
- ✅ Professional UI with built-in best practices
- ✅ Automatic network switching to Lisk Sepolia

### Try It!

**Run development server**:

```bash
npm run dev
```

**Test the setup**:
1. Visit `http://localhost:3000`
2. Click the LoginButton in the header
3. Choose a wallet (MetaMask, WalletConnect, etc.)
4. Approve the connection
5. See your wallet address displayed!
6. Try disconnecting and reconnecting

**🎉 Success!** Account abstraction with Panna SDK is working!

**What's next?** In Frontend 103, we'll add contract interaction utilities. In Frontend 104, we'll build production-ready components including:
- Garden Header with scheduler indicator
- Stats Sidebar with game information
- Plant Seed Modal with game preview
- Two-column production layout

---

## Frontend 103: Contract Integration with Thirdweb

### Understanding Contract Interaction

**Read vs Write Operations**:

| Type | Gas Cost | Requires Signing | Examples |
|------|----------|------------------|----------|
| **Read** | Free | No | `getPlant()`, `getUserPlants()` |
| **Write** | Costs gas* | Yes | `plantSeed()`, `waterPlant()` |

_*With Panna SDK, users don't pay gas - sponsor pays!_

### Step 1: Create Contract Utilities

Create `lib/contract.ts`:

```typescript
// Contract interaction utilities for Lisk Garden DApp

import { liskSepolia } from 'panna-sdk'
import { prepareContractCall, sendTransaction, readContract, waitForReceipt } from 'thirdweb/transaction'
import { getContract } from 'thirdweb/contract'
import { toWei } from 'thirdweb/utils'
import {
  LISK_GARDEN_CONTRACT_ADDRESS,
  LISK_GARDEN_ABI,
  Plant,
  GrowthStage,
  STAGE_NAMES,
  PLANT_PRICE,
  HARVEST_REWARD,
  STAGE_DURATION,
  WATER_DEPLETION_TIME,
  WATER_DEPLETION_RATE,
} from '@/types/contracts'

// ==================== DATA PARSING ====================

// Convert raw contract data to typed Plant interface
export function parsePlantData(rawPlant: any): Plant {
  // Handle both array-like tuples and object-like structures
  const isArray = Array.isArray(rawPlant)

  return {
    id: BigInt(isArray ? rawPlant[0] ?? 0 : rawPlant.id ?? 0),
    owner: isArray ? rawPlant[1] ?? '' : rawPlant.owner ?? '',
    stage: Number(isArray ? rawPlant[2] ?? 0 : rawPlant.stage ?? 0) as GrowthStage,
    plantedDate: BigInt(isArray ? rawPlant[3] ?? 0 : rawPlant.plantedDate ?? 0),
    lastWatered: BigInt(isArray ? rawPlant[4] ?? 0 : rawPlant.lastWatered ?? 0),
    waterLevel: Number(isArray ? rawPlant[5] ?? 0 : rawPlant.waterLevel ?? 0),
    exists: Boolean(isArray ? rawPlant[6] ?? false : rawPlant.exists ?? false),
    isDead: Boolean(isArray ? rawPlant[7] ?? false : rawPlant.isDead ?? false),
  }
}

// ==================== WRITE FUNCTIONS ====================

// Plant a new seed (costs PLANT_PRICE ETH)
export async function plantSeed(client: any, account: any) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function plantSeed() payable returns (uint256)',
    params: [],
    value: toWei(PLANT_PRICE), // Convert 0.001 ETH to Wei
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  // Wait for transaction to be mined
  await waitForReceipt(result)

  return result
}

// Water a plant (refills water to 100%)
export async function waterPlant(client: any, account: any, plantId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function waterPlant(uint256 plantId)',
    params: [plantId],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)

  return result
}

// Harvest a blooming plant (receive HARVEST_REWARD ETH)
export async function harvestPlant(client: any, account: any, plantId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function harvestPlant(uint256 plantId)',
    params: [plantId],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)

  return result
}

// Update plant growth stage (advances to next stage if enough time passed)
export async function updatePlantStage(client: any, account: any, plantId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function updatePlantStage(uint256 plantId)',
    params: [plantId],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)

  return result
}

// ==================== READ FUNCTIONS ====================

// Get plant data by ID
export async function getPlant(client: any, plantId: bigint): Promise<Plant> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const rawPlant = await readContract({
    contract,
    method: 'function getPlant(uint256 plantId) view returns (uint256 id, address owner, uint8 stage, uint256 plantedDate, uint256 lastWatered, uint8 waterLevel, bool exists, bool isDead)',
    params: [plantId],
  })

  return parsePlantData(rawPlant)
}

// Calculate current water level (accounts for time-based depletion)
export async function calculateWaterLevel(client: any, plantId: bigint, plant?: Plant): Promise<number> {
  // Optimization: Skip blockchain call for blooming plants
  // Water doesn't deplete at BLOOMING stage (preservation mechanic)
  if (plant && plant.stage === GrowthStage.BLOOMING) {
    return plant.waterLevel
  }

  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const waterLevel = await readContract({
    contract,
    method: 'function calculateWaterLevel(uint256 plantId) view returns (uint8)',
    params: [plantId],
  })

  return Number(waterLevel)
}

// Get all plant IDs for a user
export async function getUserPlants(client: any, userAddress: string): Promise<bigint[]> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const plantIds = await readContract({
    contract,
    method: 'function getUserPlants(address user) view returns (uint256[])',
    params: [userAddress],
  })

  return plantIds.map((id: any) => BigInt(id))
}

// Get total number of plants created
export async function getPlantCounter(client: any): Promise<bigint> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  return BigInt(
    await readContract({
      contract,
      method: 'function plantCounter() view returns (uint256)',
      params: [],
    })
  )
}

// ==================== HELPER FUNCTIONS FOR UI ====================

// Format plant age: "2 days ago" or "5h 30m ago"
export function formatPlantAge(plantedDate: bigint): string {
  const now = Date.now()
  const planted = Number(plantedDate) * 1000 // Convert seconds to milliseconds
  const diff = now - planted

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s ago`
  }
  return `${seconds}s ago`
}

// Format last watered time
export function formatLastWatered(lastWatered: bigint): string {
  return formatPlantAge(lastWatered) // Same format as plant age
}

// Get stage display name
export function getStageDisplayName(stage: GrowthStage): string {
  return STAGE_NAMES[stage]
}

// Check if plant can be harvested
export function canHarvest(plant: Plant): boolean {
  return plant.stage === GrowthStage.BLOOMING && plant.exists && !plant.isDead
}

// Calculate growth progress percentage
export function getPlantProgress(plant: Plant): number {
  if (plant.isDead || !plant.exists) return 0
  if (plant.stage === GrowthStage.BLOOMING) return 100

  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  // Calculate progress within current stage
  const currentStageStart = Number(plant.stage) * STAGE_DURATION
  const currentStageProgress = ((timePassed - currentStageStart) / STAGE_DURATION) * 25

  return Math.min(Number(plant.stage) * 25 + currentStageProgress, 100)
}

// Calculate current water level (client-side, real-time)
export function getClientWaterLevel(plant: Plant): number {
  if (!plant.exists || plant.isDead) {
    return 0
  }

  // BLOOMING plants don't lose water - they're ready to harvest!
  // This prevents plants from dying after reaching full maturity
  if (plant.stage === GrowthStage.BLOOMING) {
    return plant.waterLevel
  }

  const now = Date.now() / 1000
  const timeSinceWatered = now - Number(plant.lastWatered)
  const depletionIntervals = Math.floor(timeSinceWatered / WATER_DEPLETION_TIME)
  const waterLost = depletionIntervals * WATER_DEPLETION_RATE

  if (waterLost >= plant.waterLevel) {
    return 0 // Plant is dead
  }

  return plant.waterLevel - waterLost
}

// Check if plant needs watering (below 50%)
export function needsWater(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  // Blooming plants don't need water - they're preserved at harvest stage
  if (plant.stage === GrowthStage.BLOOMING) return false
  return getClientWaterLevel(plant) < 50
}

// Check if plant is critical (below 20%)
export function isCritical(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  // Blooming plants can't be critical - water is preserved
  if (plant.stage === GrowthStage.BLOOMING) return false
  return getClientWaterLevel(plant) < 20
}

// Calculate expected stage based on time
export function getExpectedStage(plant: Plant): GrowthStage {
  if (plant.isDead || !plant.exists) return plant.stage

  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  // Calculate which stage based on time
  const calculatedStage = Math.min(Math.floor(timePassed / STAGE_DURATION), 3)
  return calculatedStage as GrowthStage
}

// Check if plant stage is out of sync
export function isStageOutOfSync(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  const expectedStage = getExpectedStage(plant)
  return plant.stage < expectedStage
}

export { LISK_GARDEN_CONTRACT_ADDRESS, PLANT_PRICE, HARVEST_REWARD, STAGE_DURATION }
```

**Key Functions Summary**:

| Category | Functions | Purpose |
|----------|-----------|---------|
| **Write** | `plantSeed()`, `waterPlant()`, `harvestPlant()`, `updatePlantStage()` | Change blockchain state |
| **Read** | `getPlant()`, `getUserPlants()`, `calculateWaterLevel()` | Query blockchain data |
| **Helpers** | `formatPlantAge()`, `getClientWaterLevel()`, `needsWater()` | UI utilities |

**Important Mechanics**:

1. **Water Preservation**: Blooming plants don't lose water
2. **Water Depletion**: Plants lose 20% water every 30 seconds (except blooming)
3. **Stage Progression**: Plants advance every 60 seconds (SEED → SPROUT → GROWING → BLOOMING)
4. **Death Condition**: Plant dies when water reaches 0%

### Try It!

Test contract read functions in browser console:

```bash
npm run dev
```

1. Open browser console (F12)
2. Connect wallet
3. Type: `await fetch('/api/test')` (we'll create this next)

---

## Frontend 104: Building UI Components

### Component Hierarchy (Production)

```
App (page.tsx)
  ├── GardenHeader
  │   ├── Logo & Title
  │   ├── Scheduler Indicator (RefreshCw icon)
  │   └── LoginButton (from Panna SDK)
  ├── Main Content (flex layout)
  │   └── GardenGrid
  │       ├── PlantCard (×N)
  │       │   ├── Card (shadcn)
  │       │   ├── Progress (shadcn)
  │       │   └── Visual Indicators
  │       └── EmptyState
  ├── Sidebar
  │   └── StatsSidebar
  │       ├── Garden Stats Card
  │       ├── Wallet Info Card
  │       ├── Game Info Card
  │       ├── How to Play Card
  │       └── Game Mechanics Card
  ├── Modals (managed by parent)
  │   ├── PlantDetailsModal
  │   │   ├── Dialog (shadcn)
  │   │   ├── Progress bars
  │   │   └── Action buttons
  │   └── PlantSeedModal
  │       ├── Seed preview (🌱)
  │       ├── Growth stages preview
  │       ├── Cost & profit info
  │       └── Confirm button
  └── Background Services
      └── usePlantStageScheduler (auto-updates stages)
```

### Step 1: Create PlantCard Component

Create `components/plant-card.tsx`:

```typescript
"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Sparkles, Clock, Skull, RefreshCw } from "lucide-react"
import { Plant, GrowthStage, STAGE_NAMES } from "@/types/contracts"
import {
  formatLastWatered,
  formatPlantAge,
  getPlantProgress,
  getClientWaterLevel,
  isCritical,
  isStageOutOfSync,
} from "@/lib/contract"

// Visual styling for each growth stage
const STAGE_EMOJIS = {
  [GrowthStage.SEED]: "🌱",
  [GrowthStage.SPROUT]: "🌿",
  [GrowthStage.GROWING]: "🪴",
  [GrowthStage.BLOOMING]: "🌸",
}

const STAGE_BACKGROUNDS = {
  [GrowthStage.SEED]: "from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950",
  [GrowthStage.SPROUT]: "from-green-50 to-lime-50 dark:from-green-950 dark:to-lime-950",
  [GrowthStage.GROWING]: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
  [GrowthStage.BLOOMING]: "from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950",
}

const STAGE_BORDERS = {
  [GrowthStage.SEED]: "border-amber-300 dark:border-amber-700",
  [GrowthStage.SPROUT]: "border-green-300 dark:border-green-700",
  [GrowthStage.GROWING]: "border-emerald-300 dark:border-emerald-700",
  [GrowthStage.BLOOMING]: "border-rose-300 dark:border-rose-700",
}

interface PlantCardProps {
  plant: Plant
  onClick?: () => void
}

export default function PlantCard({ plant, onClick }: PlantCardProps) {
  const stageKey = STAGE_NAMES[plant.stage] as keyof typeof STAGE_EMOJIS
  const progress = getPlantProgress(plant)
  const currentWaterLevel = getClientWaterLevel(plant)
  const critical = isCritical(plant)
  const stageOutOfSync = isStageOutOfSync(plant)

  return (
    <Card
      onClick={onClick}
      className={`overflow-hidden transition-all duration-300 ease-out cursor-pointer group hover:shadow-lg hover:-translate-y-1 border-2 ${
        plant.isDead
          ? 'border-gray-500 opacity-75 hover:border-gray-600'
          : `${STAGE_BORDERS[plant.stage]} hover:border-opacity-100`
      }`}
    >
      {/* Plant visualization */}
      <div
        className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
          plant.isDead
            ? 'bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
            : `bg-gradient-to-b ${STAGE_BACKGROUNDS[plant.stage]}`
        }`}
      >
        {plant.isDead ? (
          <div className="text-7xl grayscale opacity-50">💀</div>
        ) : (
          <>
            <div className="text-7xl animate-bounce">{STAGE_EMOJIS[plant.stage]}</div>

            {/* Stage indicators */}
            {stageOutOfSync && (
              <div className="absolute top-3 left-3 animate-pulse">
                <RefreshCw className="w-5 h-5 text-orange-500" />
              </div>
            )}

            {currentWaterLevel > 80 && (
              <div className="absolute top-3 right-3">
                <Droplets className="w-5 h-5 text-blue-500 animate-pulse" />
              </div>
            )}

            {critical && (
              <div className="absolute top-3 right-3 animate-pulse">
                <Skull className="w-6 h-6 text-red-500" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Plant info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              Plant #{plant.id.toString()}
            </h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              {plant.isDead ? (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-300">
                  💀 Dead
                </span>
              ) : (
                <>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-300">
                    {stageKey.charAt(0).toUpperCase() + stageKey.slice(1)}
                  </span>
                  {stageOutOfSync && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-700 dark:text-orange-300">
                      🔄 Needs Update
                    </span>
                  )}
                  {plant.stage === GrowthStage.BLOOMING && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                      Ready to Harvest!
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Growth Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Growth
            </span>
            <span className="text-muted-foreground font-medium">{Math.floor(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Water level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Droplets className={`w-4 h-4 ${plant.isDead ? 'text-gray-400' : 'text-blue-500'}`} />
              Water
            </span>
            <span className="text-muted-foreground font-medium">{currentWaterLevel}%</span>
          </div>
          <Progress value={currentWaterLevel} className="h-2" />
          {!plant.isDead && currentWaterLevel < 50 && currentWaterLevel > 20 && (
            <p className="text-xs text-orange-600 dark:text-orange-400">⚠️ Needs watering soon!</p>
          )}
          {!plant.isDead && currentWaterLevel <= 20 && currentWaterLevel > 0 && (
            <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">
              🚨 Critical! Water immediately!
            </p>
          )}
          {(plant.isDead || currentWaterLevel === 0) && (
            <p className="text-xs text-gray-600 dark:text-gray-400">💀 Plant died from dehydration</p>
          )}
        </div>

        {/* Meta info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
          <p className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            Last watered: {formatLastWatered(plant.lastWatered)}
          </p>
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Planted: {formatPlantAge(plant.plantedDate)}
          </p>
        </div>
      </div>
    </Card>
  )
}
```

This card component does a lot of work! It figures out the current water level using `getClientWaterLevel()` (which calculates water depletion based on time), checks if the plant needs attention, and applies the right styling. Each growth stage gets its own emoji and color scheme. Dead plants get a gray overlay. Plants that need watering show a blue pulsing droplet icon. The whole card is clickable to open the details modal.

### Step 2: Create usePlants Hook

Create `hooks/usePlants.ts`:

```typescript
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useContract } from './useContract'
import {
  getUserPlants as getUserPlantsContract,
  getPlant as getPlantContract,
  plantSeed as plantSeedContract,
  waterPlant as waterPlantContract,
  harvestPlant as harvestPlantContract,
  updatePlantStage as updatePlantStageContract,
} from '@/lib/contract'
import { Plant } from '@/types/contracts'

export function usePlants() {
  const { client, account, address, isConnected } = useContract()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's plants from blockchain
  const fetchPlants = useCallback(async () => {
    if (!client || !address || !isConnected) {
      setPlants([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get plant IDs for user
      const plantIds = await getUserPlantsContract(client, address)

      // Fetch each plant's data
      const plantsData = await Promise.all(
        plantIds.map((id) => getPlantContract(client, id))
      )

      setPlants(plantsData)
    } catch (err) {
      console.error('Error fetching plants:', err)
      setError('Failed to load plants')
    } finally {
      setLoading(false)
    }
  }, [client, address, isConnected])

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchPlants()
  }, [fetchPlants])

  // Auto-refresh every 5 seconds for real-time updates
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      fetchPlants()
    }, 5000)

    return () => clearInterval(interval)
  }, [isConnected, fetchPlants])

  // Plant a new seed
  const plantSeed = useCallback(async () => {
    if (!client || !account) throw new Error('Wallet not connected')

    setLoading(true)
    try {
      await plantSeedContract(client, account)
      await fetchPlants() // Refresh list
    } catch (err) {
      console.error('Error planting seed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [client, account, fetchPlants])

  // Water a plant
  const waterPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) throw new Error('Wallet not connected')

      setLoading(true)
      try {
        await waterPlantContract(client, account, plantId)
        await fetchPlants() // Refresh list
      } catch (err) {
        console.error('Error watering plant:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [client, account, fetchPlants]
  )

  // Harvest a plant
  const harvestPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) throw new Error('Wallet not connected')

      setLoading(true)
      try {
        await harvestPlantContract(client, account, plantId)
        await fetchPlants() // Refresh list
      } catch (err) {
        console.error('Error harvesting plant:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [client, account, fetchPlants]
  )

  // Update plant stage
  const updatePlantStage = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) throw new Error('Wallet not connected')

      setLoading(true)
      try {
        await updatePlantStageContract(client, account, plantId)
        await fetchPlants() // Refresh list
      } catch (err) {
        console.error('Error updating plant stage:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [client, account, fetchPlants]
  )

  return {
    plants,
    loading,
    error,
    fetchPlants,
    plantSeed,
    waterPlant,
    harvestPlant,
    updatePlantStage,
  }
}
```

This hook is the heart of the app's data management. It automatically fetches your plants when the component mounts and keeps them fresh with a 5-second auto-refresh. All the plant actions (water, harvest, update stage, plant seed) are wrapped with loading states and error handling. After each action, it refreshes the plant list so the UI stays up to date. The toast notifications give users immediate feedback on what happened.

### Step 3: Create Garden Grid

Create `components/garden-grid.tsx`:

```typescript
'use client'

import { usePlants } from '@/hooks/usePlants'
import PlantCard from './plant-card'
import { Button } from './ui/button'
import { Sprout, Loader2 } from 'lucide-react'
import { useState } from 'react'
import PlantDetailsModal from './plant-details-modal'
import { Plant } from '@/types/contracts'

export function GardenGrid() {
  const { plants, loading, plantSeed } = usePlants()
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [isPlanting, setIsPlanting] = useState(false)

  const handlePlantSeed = async () => {
    setIsPlanting(true)
    try {
      await plantSeed()
    } catch (err) {
      console.error('Failed to plant seed:', err)
      alert('Failed to plant seed. Check console for details.')
    } finally {
      setIsPlanting(false)
    }
  }

  if (loading && plants.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Plant Seed Button */}
        <div className="flex justify-center">
          <Button
            onClick={handlePlantSeed}
            disabled={isPlanting}
            className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
          >
            {isPlanting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Planting...
              </>
            ) : (
              <>
                <Sprout className="w-5 h-5" />
                Plant Seed 🌱 (0.001 ETH)
              </>
            )}
          </Button>
        </div>

        {/* Plants Grid */}
        {plants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              No plants yet!
            </p>
            <p className="text-sm text-gray-500">
              Click "Plant Seed" to start growing your first plant
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard
                key={plant.id.toString()}
                plant={plant}
                onClick={() => setSelectedPlant(plant)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Plant Details Modal */}
      <PlantDetailsModal
        plant={selectedPlant}
        isOpen={selectedPlant !== null}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  )
}
```

The grid layout is responsive - 1 column on mobile, 2 on tablet, 3 on desktop. The Plant Seed button shows a loading spinner while the transaction is processing. When you don't have any plants yet, there's a friendly empty state to encourage planting your first seed. Each plant card is clickable to open the details modal.

### Step 4: Create Plant Details Modal

Create `components/plant-details-modal.tsx`:

```typescript
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplets, Sparkles, TrendingUp, Coins, Skull, RefreshCw } from "lucide-react"
import { Plant, GrowthStage, STAGE_NAMES, HARVEST_REWARD } from "@/types/contracts"
import {
  formatPlantAge,
  formatLastWatered,
  canHarvest,
  getPlantProgress,
  getClientWaterLevel,
  isCritical,
  isStageOutOfSync,
  getExpectedStage,
} from "@/lib/contract"
import { usePlants } from "@/hooks/usePlants"

const STAGE_EMOJIS = {
  [GrowthStage.SEED]: "🌱",
  [GrowthStage.SPROUT]: "🌿",
  [GrowthStage.GROWING]: "🪴",
  [GrowthStage.BLOOMING]: "🌸",
}

interface PlantDetailsModalProps {
  plant: Plant | null
  isOpen: boolean
  onClose: () => void
}

export default function PlantDetailsModal({ plant, isOpen, onClose }: PlantDetailsModalProps) {
  const { harvestPlant, waterPlant, updatePlantStage, loading } = usePlants()

  if (!plant) return null

  const stageKey = STAGE_NAMES[plant.stage]
  const progress = getPlantProgress(plant)
  const canHarvestPlant = canHarvest(plant)
  const currentWaterLevel = getClientWaterLevel(plant)
  const critical = isCritical(plant)
  const stageOutOfSync = isStageOutOfSync(plant)
  const expectedStage = getExpectedStage(plant)

  const handleHarvest = async () => {
    await harvestPlant(plant.id)
    onClose()
  }

  const handleWater = async () => {
    await waterPlant(plant.id)
  }

  const handleUpdateStage = async () => {
    await updatePlantStage(plant.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{plant.isDead ? '💀' : STAGE_EMOJIS[plant.stage]}</span>
            Plant #{plant.id.toString()}
            {plant.isDead && <span className="text-sm text-gray-500">(Dead)</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plant Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Stage</span>
              <span className="text-sm font-semibold text-foreground capitalize">{stageKey}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Planted</span>
              <span className="text-sm font-semibold text-foreground">{formatPlantAge(plant.plantedDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Last Watered</span>
              <span className="text-sm font-semibold text-foreground">{formatLastWatered(plant.lastWatered)}</span>
            </div>
          </div>

          {/* Growth Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                Growth Progress
              </span>
              <span className="text-sm font-semibold text-foreground">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {plant.stage === GrowthStage.SEED && "🌱 Germinating... Water regularly to sprout!"}
              {plant.stage === GrowthStage.SPROUT && "🌿 Growing strong! Keep watering to reach next stage."}
              {plant.stage === GrowthStage.GROWING && "🪴 Almost there! One more stage until blooming."}
              {plant.stage === GrowthStage.BLOOMING && "🌸 Fully grown! Ready to harvest for rewards!"}
            </p>
          </div>

          {/* Water Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Droplets className={`w-4 h-4 ${plant.isDead ? 'text-gray-400' : 'text-blue-500'}`} />
                Water Level
              </span>
              <span className="text-sm font-semibold text-foreground">{currentWaterLevel}%</span>
            </div>
            <Progress value={currentWaterLevel} className="h-3" />
            {!plant.isDead && currentWaterLevel < 50 && currentWaterLevel > 20 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">⚠️ Water level low! Water your plant soon.</p>
            )}
            {!plant.isDead && currentWaterLevel <= 20 && currentWaterLevel > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">🚨 Critical! Plant will die soon!</p>
            )}
            {plant.isDead && (
              <p className="text-xs text-gray-600 dark:text-gray-400">💀 Plant died from dehydration</p>
            )}
          </div>

          {/* Stage Sync Warning */}
          {!plant.isDead && stageOutOfSync && (
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg space-y-3">
              <div className="text-center space-y-1">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 text-orange-500" />
                  Stage Out of Sync
                </p>
                <p className="text-sm text-muted-foreground">
                  On-chain: {STAGE_NAMES[plant.stage]} → Expected: {STAGE_NAMES[expectedStage]}
                </p>
                <p className="text-xs text-muted-foreground">
                  Update the stage to sync blockchain state with actual growth time
                </p>
              </div>
              <Button
                onClick={handleUpdateStage}
                disabled={loading}
                className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Update Stage
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Harvest Info */}
          {canHarvestPlant && (
            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-lg space-y-2">
              <div className="text-center">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Ready to Harvest!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Harvest this plant to receive
                </p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-primary mt-1">
                  <Coins className="w-5 h-5" />
                  {HARVEST_REWARD} ETH
                </p>
              </div>
            </div>
          )}

          {/* Dead Plant Warning */}
          {plant.isDead && (
            <div className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-500/10 border border-gray-500/30 rounded-lg">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Skull className="w-4 h-4 text-gray-500" />
                  Plant Died
                </p>
                <p className="text-sm text-muted-foreground">
                  This plant died from lack of water. Plant a new seed to try again!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Close
            </Button>
            {!plant.isDead && (
              <>
                {canHarvestPlant ? (
                  <Button
                    onClick={handleHarvest}
                    disabled={loading}
                    className="flex-1 gap-2 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Harvesting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Harvest Plant
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleWater}
                    disabled={loading}
                    className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Watering...
                      </>
                    ) : (
                      <>
                        <Droplets className="w-4 h-4" />
                        Water Plant
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Modal Features**:
- ✅ Detailed plant information
- ✅ Growth and water progress visualization
- ✅ Stage sync detection and update button
- ✅ Harvest button when blooming
- ✅ Water button for growing plants
- ✅ Dead plant warning
- ✅ Loading states for all actions

### Step 5: Create Garden Header (Production)

Now let's add the production header with Panna's built-in `<LoginButton>` and a scheduler indicator.

Create `components/garden-header.tsx`:

```typescript
"use client"

import { Leaf, RefreshCw } from "lucide-react"
import { LoginButton, useActiveAccount, liskSepolia } from "panna-sdk"

interface GardenHeaderProps {
  schedulerRunning?: boolean
}

export default function GardenHeader({ schedulerRunning = false }: GardenHeaderProps) {
  const activeAccount = useActiveAccount()
  const isConnected = !!activeAccount

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lisk Garden</h1>
            <p className="text-xs text-muted-foreground">Web3 Garden Game</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {schedulerRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400 animate-spin" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Auto-Sync Active
              </span>
            </div>
          )}
          <LoginButton chain={liskSepolia} />
        </div>
      </div>
    </header>
  )
}
```

This header is pretty straightforward, but there are a few nice touches worth mentioning. First, we're using Panna's `<LoginButton>` component directly - no need to build our own wallet connection UI. It handles everything: connecting, disconnecting, switching accounts, and even shows the user's balance.

The `schedulerRunning` prop controls that little green indicator that shows when the background auto-sync is active. It's a small detail, but it helps users understand that the app is actively keeping their plants in sync with the blockchain.

The sticky positioning (`sticky top-0 z-50`) means the header stays at the top when you scroll, so the login button is always accessible.

### Step 6: Create Stats Sidebar (Production)

The sidebar shows garden statistics, wallet info, and game mechanics.

Create `components/stats-sidebar.tsx`:

```typescript
"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { GrowthStage, PLANT_PRICE, HARVEST_REWARD, STAGE_DURATION, WATER_DEPLETION_TIME, WATER_DEPLETION_RATE } from "@/types/contracts"
import { Sprout, Droplets, Clock, Coins, TrendingUp, Wallet, Info } from "lucide-react"

interface StatsSidebarProps {
  selectedPlantId?: bigint | null
}

export default function StatsSidebar({ selectedPlantId }: StatsSidebarProps) {
  const { plants } = usePlants()
  const { isConnected, address } = useContract()

  const totalPlants = plants.length
  const alivePlants = plants.filter((p) => !p.isDead).length
  const deadPlants = plants.filter((p) => p.isDead).length
  const bloomingPlants = plants.filter((p) => p.stage === GrowthStage.BLOOMING && !p.isDead).length
  const growingPlants = plants.filter((p) => p.stage !== GrowthStage.BLOOMING && !p.isDead).length

  return (
    <div className="space-y-4 sticky top-24">
      {/* Garden Stats */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Garden Stats</h2>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Plants</span>
            <span className="text-sm font-semibold text-foreground">{totalPlants}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Alive</span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">{alivePlants}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Blooming</span>
            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{bloomingPlants}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Growing</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{growingPlants}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dead</span>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{deadPlants}</span>
          </div>
        </div>
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Wallet Info</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-xs font-mono text-foreground break-all bg-muted p-2 rounded">
              {address}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              ⛽ Gasless transactions active
            </p>
          </div>
        </Card>
      )}

      {/* Game Info */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Game Info</h2>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Coins className="w-3 h-3" />
              Plant Cost
            </span>
            <span className="text-sm font-semibold text-foreground">{PLANT_PRICE} ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Harvest Reward
            </span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">{HARVEST_REWARD} ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Profit</span>
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">3x</span>
          </div>
        </div>
      </Card>

      {/* How to Play */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">How to Play</h3>
        <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Plant a seed (costs {PLANT_PRICE} ETH)</li>
          <li>Water your plant regularly to keep it alive</li>
          <li>Wait for it to grow through 4 stages (🌱 → 🌿 → 🪴 → 🌸)</li>
          <li>Harvest when blooming to earn {HARVEST_REWARD} ETH</li>
        </ol>
      </Card>

      {/* Game Mechanics */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Game Mechanics</h3>
        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3" />
              <span className="font-medium text-foreground">Growth</span>
            </div>
            <p>Each stage takes {STAGE_DURATION} seconds</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Droplets className="w-3 h-3" />
              <span className="font-medium text-foreground">Water</span>
            </div>
            <p>Loses {WATER_DEPLETION_RATE}% every {WATER_DEPLETION_TIME} seconds</p>
            <p className="text-orange-600 dark:text-orange-400 mt-1">⚠️ Plant dies at 0% water!</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-rose-500">🌸</span>
              <span className="font-medium text-foreground">Blooming</span>
            </div>
            <p className="text-green-600 dark:text-green-400">Water preserved at bloom stage!</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

The sidebar is packed with useful info! At the top you've got your garden stats - how many plants are alive, how many are ready to harvest, how many died. Below that is wallet info showing your connected address (truncated so it doesn't take up too much space).

Then there's game info explaining the economics (what things cost, what you earn), followed by step-by-step instructions on how to play. The last card breaks down all the game mechanics with timing and water depletion rates.

The sticky positioning (`sticky top-24`) is key - it means the sidebar stays visible as you scroll down through your plants, so stats are always accessible.

### Step 7: Create Plant Seed Modal (Production)

Before planting, show users what they're about to buy with game info.

Create `components/plant-seed-modal.tsx`:

```typescript
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Coins, TrendingUp, Clock, Droplets, Loader2 } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { PLANT_PRICE, HARVEST_REWARD, STAGE_DURATION, WATER_DEPLETION_TIME } from "@/types/contracts"
import { useState } from "react"

interface PlantSeedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PlantSeedModal({ isOpen, onClose }: PlantSeedModalProps) {
  const { plantSeed } = usePlants()
  const [isPlanting, setIsPlanting] = useState(false)

  const handlePlant = async () => {
    setIsPlanting(true)
    try {
      await plantSeed()
      onClose()
    } catch (err) {
      console.error('Failed to plant seed:', err)
      alert('Failed to plant seed. Check console for details.')
    } finally {
      setIsPlanting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Plant a Seed</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seed Preview */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
            <div className="text-center space-y-2">
              <div className="text-6xl">🌱</div>
              <h3 className="font-semibold text-foreground">Garden Seed</h3>
              <p className="text-sm text-muted-foreground">Grows into a beautiful blooming plant!</p>
            </div>
          </Card>

          {/* Growth Stages */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Growth Stages</h4>
            <div className="flex items-center justify-center gap-2 text-2xl">
              <span>🌱</span>
              <span className="text-muted-foreground">→</span>
              <span>🌿</span>
              <span className="text-muted-foreground">→</span>
              <span>🪴</span>
              <span className="text-muted-foreground">→</span>
              <span>🌸</span>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Seed → Sprout → Growing → Blooming
            </p>
          </div>

          <Separator />

          {/* Cost & Profit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Cost
              </span>
              <span className="text-sm font-semibold text-foreground">{PLANT_PRICE} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Harvest Reward
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{HARVEST_REWARD} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profit</span>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">3x (0.002 ETH)</span>
            </div>
          </div>

          <Separator />

          {/* Game Rules */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Important</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Each stage takes {STAGE_DURATION} seconds to grow
              </p>
              <p className="flex items-center gap-2">
                <Droplets className="w-3 h-3" />
                Water depletes every {WATER_DEPLETION_TIME} seconds - keep it alive!
              </p>
              <p className="text-orange-600 dark:text-orange-400">⚠️ Plant dies if water reaches 0%</p>
              <p className="text-green-600 dark:text-green-400">✓ Water preserved at blooming stage!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPlanting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlant}
              disabled={isPlanting}
              className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {isPlanting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Planting...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  Plant Seed
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

This modal gives players all the information they need before committing 0.001 ETH to plant a seed. We show the full growth cycle, the economics (what you pay vs. what you get back), and the game rules. The best part? You can plant directly from this modal without closing it first.

The seed preview uses animated gradients to make it feel alive, and we show each growth stage so players know what to expect. We also include important warnings about water depletion - nobody wants their plant to die because they didn't know the rules!

---

### Step 8: Update Garden Grid for Production (Callback Props Pattern)

Here's where things get interesting. Instead of managing modal state inside the Garden Grid component (like we did in the simplified version), we're going to pass callback functions as props. This means the parent component (page.tsx) controls when modals open and close.

Why do this? Two reasons: First, it's much easier to coordinate between multiple components when state lives in one place. Second, if you ever want to open a modal from somewhere else (like a keyboard shortcut or a notification), you can do that without prop drilling.

**Create** `components/garden-grid.tsx`:

```tsx
"use client"

import PlantCard from "@/components/plant-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, Sprout, RefreshCw } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { useToast } from "@/hooks/use-toast"

interface GardenGridProps {
  onSelectPlant: (plantId: bigint) => void
  onPlantSeed: () => void
}

export default function GardenGrid({ onSelectPlant, onPlantSeed }: GardenGridProps) {
  const { plants, loading, fetchPlants } = usePlants()
  const { isConnected } = useContract()
  const { toast } = useToast()

  const handleRefresh = async () => {
    await fetchPlants()
    toast({
      title: "Garden refreshed!",
      description: "All plant conditions have been updated.",
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Garden</h2>
            <p className="text-muted-foreground mt-1">Tend to your plants and watch them grow</p>
          </div>
        </div>

        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <Sprout className="w-16 h-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to view and manage your garden
          </p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Garden</h2>
            <p className="text-muted-foreground mt-1">Tend to your plants and watch them grow</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your plants...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Your Garden</h2>
          <p className="text-muted-foreground mt-1">
            {plants.length === 0
              ? "Start your garden by planting your first seed"
              : `${plants.length} plant${plants.length !== 1 ? "s" : ""} growing`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="gap-2"
            title="Refresh plant conditions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={onPlantSeed}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <Plus className="w-4 h-4" />
            Plant Seed
          </Button>
        </div>
      </div>

      {plants.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Your garden is empty</h3>
          <p className="text-muted-foreground mb-6">
            Plant your first seed and start your Web3 garden journey!
          </p>
          <Button onClick={onPlantSeed} className="gap-2">
            <Plus className="w-4 h-4" />
            Plant Your First Seed
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div key={plant.id.toString()} onClick={() => onSelectPlant(plant.id)} className="cursor-pointer">
              <PlantCard plant={plant} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

Notice the interface at the top - we're expecting two callback functions: `onSelectPlant` when someone clicks a plant card, and `onPlantSeed` when they want to plant a new seed. The component doesn't care what happens when these are called, it just fires them off.

We also added a manual refresh button that uses toast notifications to give feedback. Sometimes you just want to make sure everything is up to date without waiting for the auto-refresh, and this gives users that control.

The loading and connection states are handled with nice empty state screens instead of just showing nothing. This makes the UX feel much more polished.

---

### Step 9: Plant Details Modal (Full Production Version)

This is the big one - the modal that shows when you click on a plant. It's got a lot going on: plant visualization, growth progress, water level tracking, and smart buttons that change based on the plant's state. If a plant is ready to harvest, you see a harvest button. If it needs water, you see a water button. If it's out of sync with the blockchain, you see an update button.

**Create** `components/plant-details-modal.tsx`:

```tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplets, Sparkles, TrendingUp, Coins, Skull, RefreshCw } from "lucide-react"
import { Plant, GrowthStage, STAGE_NAMES } from "@/types/contracts"
import { formatPlantAge, formatLastWatered, canHarvest, getPlantProgress, getClientWaterLevel, isCritical, isStageOutOfSync, getExpectedStage } from "@/lib/contract"
import { usePlants } from "@/hooks/usePlants"
import { HARVEST_REWARD } from "@/types/contracts"

const STAGE_EMOJIS = {
  [GrowthStage.SEED]: "🌱",
  [GrowthStage.SPROUT]: "🌿",
  [GrowthStage.GROWING]: "🪴",
  [GrowthStage.BLOOMING]: "🌸",
}

const STAGE_BACKGROUNDS = {
  [GrowthStage.SEED]: "from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950",
  [GrowthStage.SPROUT]: "from-green-50 to-lime-50 dark:from-green-950 dark:to-lime-950",
  [GrowthStage.GROWING]: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
  [GrowthStage.BLOOMING]: "from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950",
}

interface PlantDetailsModalProps {
  plant: Plant | null
  isOpen: boolean
  onClose: () => void
}

export default function PlantDetailsModal({ plant, isOpen, onClose }: PlantDetailsModalProps) {
  const { harvestPlant, waterPlant, updatePlantStage, loading } = usePlants()

  if (!plant) return null

  const stageKey = STAGE_NAMES[plant.stage]
  const progress = getPlantProgress(plant)
  const canHarvestPlant = canHarvest(plant)
  const currentWaterLevel = getClientWaterLevel(plant)
  const critical = isCritical(plant)
  const stageOutOfSync = isStageOutOfSync(plant)
  const expectedStage = getExpectedStage(plant)

  const handleHarvest = async () => {
    await harvestPlant(plant.id)
    onClose()
  }

  const handleWater = async () => {
    await waterPlant(plant.id)
    onClose()
  }

  const handleUpdateStage = async () => {
    await updatePlantStage(plant.id)
    // Don't close modal - let user see the updated stage
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{plant.isDead ? '💀' : STAGE_EMOJIS[plant.stage]}</span>
            Plant #{plant.id.toString()}
            {plant.isDead && <span className="text-sm text-gray-500">(Dead)</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plant visualization */}
          <div className={`h-40 rounded-lg flex items-center justify-center relative overflow-hidden ${
            plant.isDead
              ? 'bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
              : `bg-gradient-to-b ${STAGE_BACKGROUNDS[plant.stage]}`
          }`}>
            {plant.isDead ? (
              <div className="text-8xl grayscale opacity-50">💀</div>
            ) : (
              <>
                <div className="text-8xl animate-float">{STAGE_EMOJIS[plant.stage]}</div>
                {/* Stage-specific decorations */}
                {plant.stage === GrowthStage.SEED && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 bg-amber-600/20 dark:bg-amber-400/20 rounded-full" />
                    <div className="absolute top-4 right-6 text-3xl opacity-30">☀️</div>
                  </>
                )}
                {plant.stage === GrowthStage.SPROUT && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 bg-green-600/30 dark:bg-green-400/30 rounded-full" />
                    <div className="absolute top-4 left-6 text-2xl opacity-40 animate-pulse">💧</div>
                    <div className="absolute top-4 right-6 text-2xl opacity-40">☀️</div>
                  </>
                )}
                {plant.stage === GrowthStage.GROWING && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-4 bg-emerald-600/40 dark:bg-emerald-400/40 rounded-full" />
                    <div className="absolute top-6 left-8 text-2xl opacity-30 animate-bounce">🍃</div>
                    <div className="absolute bottom-8 right-8 text-2xl opacity-30 animate-bounce delay-100">🍃</div>
                  </>
                )}
                {plant.stage === GrowthStage.BLOOMING && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-5 bg-rose-600/40 dark:bg-rose-400/40 rounded-full" />
                    <div className="absolute top-3 right-3 animate-bounce">
                      <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="absolute top-6 left-6 text-3xl animate-pulse">✨</div>
                    <div className="absolute bottom-8 left-8 text-2xl opacity-50 animate-bounce">🌺</div>
                    <div className="absolute bottom-8 right-8 text-2xl opacity-50 animate-bounce delay-100">🦋</div>
                  </>
                )}
              </>
            )}
            {!plant.isDead && critical && (
              <div className="absolute top-3 left-3 animate-pulse">
                <Skull className="w-6 h-6 text-red-500" />
              </div>
            )}
          </div>

          {/* Plant info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Stage</span>
              <span className="text-sm font-semibold text-foreground capitalize">{stageKey}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Planted</span>
              <span className="text-sm font-semibold text-foreground">{formatPlantAge(plant.plantedDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Last Watered</span>
              <span className="text-sm font-semibold text-foreground">{formatLastWatered(plant.lastWatered)}</span>
            </div>
          </div>

          {/* Growth Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                Growth Progress
              </span>
              <span className="text-sm font-semibold text-foreground">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {plant.stage === GrowthStage.SEED && "🌱 Germinating... Water regularly to sprout!"}
              {plant.stage === GrowthStage.SPROUT && "🌿 Growing strong! Keep watering to reach next stage."}
              {plant.stage === GrowthStage.GROWING && "🪴 Almost there! One more stage until blooming."}
              {plant.stage === GrowthStage.BLOOMING && "🌸 Fully grown! Ready to harvest for rewards!"}
            </p>
          </div>

          {/* Water level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Droplets className={`w-4 h-4 ${plant.isDead ? 'text-gray-400' : 'text-blue-500'}`} />
                Water Level
              </span>
              <span className="text-sm font-semibold text-foreground">{currentWaterLevel}%</span>
            </div>
            <Progress value={currentWaterLevel} className="h-3" />
            {!plant.isDead && currentWaterLevel < 50 && currentWaterLevel > 20 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">⚠️ Water level low! Water your plant soon.</p>
            )}
            {!plant.isDead && currentWaterLevel <= 20 && currentWaterLevel > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">🚨 Critical! Plant will die soon!</p>
            )}
            {plant.isDead && (
              <p className="text-xs text-gray-600 dark:text-gray-400">💀 Plant died from dehydration</p>
            )}
          </div>

          {/* Stage sync warning */}
          {!plant.isDead && stageOutOfSync && (
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 text-orange-500" />
                    Stage Out of Sync
                  </p>
                  <p className="text-sm text-muted-foreground">
                    On-chain: {STAGE_NAMES[plant.stage]} → Expected: {STAGE_NAMES[expectedStage]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Update the stage to sync blockchain state with actual growth time
                  </p>
                </div>
                <Button
                  onClick={handleUpdateStage}
                  disabled={loading}
                  className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Update Stage
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Harvest info */}
          {canHarvestPlant && (
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-green-500/10 border-yellow-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Ready to Harvest!
                </p>
                <p className="text-sm text-muted-foreground">
                  Harvest this plant to receive
                </p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-primary">
                  <Coins className="w-5 h-5" />
                  {HARVEST_REWARD} ETH
                </p>
              </div>
            </Card>
          )}

          {/* Dead plant warning */}
          {plant.isDead && (
            <Card className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-500/10 border-gray-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Skull className="w-4 h-4 text-gray-500" />
                  Plant Died
                </p>
                <p className="text-sm text-muted-foreground">
                  This plant died from lack of water. Plant a new seed to try again!
                </p>
              </div>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Close
            </Button>
            {!plant.isDead && (
              <>
                {canHarvestPlant ? (
                  <Button
                    onClick={handleHarvest}
                    disabled={loading}
                    className="flex-1 gap-2 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Harvesting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Harvest Plant
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleWater}
                    disabled={loading}
                    className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Watering...
                      </>
                    ) : (
                      <>
                        <Droplets className="w-4 h-4" />
                        Water Plant
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

The modal has a ton of visual polish - each growth stage has its own background gradient and decorations (like the sun, water drops, leaves, and butterflies). Dead plants get a gray scale treatment. If water is critically low, you'll see a pulsing skull warning.

One cool detail: when a plant reaches blooming stage but the blockchain state hasn't been updated yet, we show a yellow "Stage Out of Sync" card with a button to fix it. This happens because plants grow based on time, but the on-chain state only updates when someone calls the contract. The auto-sync scheduler usually handles this, but sometimes it's nice to have manual control.

The modal also closes automatically after watering or harvesting (since you'll want to see the updated garden), but stays open when updating the stage (so you can see the change happen).

---

### Step 10: Production App Layout (Two-Column with Auto-Sync)

Alright, let's wire everything together! The app layout is where all our components come together. We've got the header at the top, a two-column layout with the garden on the left and stats sidebar on the right, and both modals ready to pop up when needed.

The key thing here is that all modal state lives in this component. When Garden Grid needs to open a modal, it calls `onSelectPlant` or `onPlantSeed`, which updates state here, which causes the modal to open. This pattern keeps everything coordinated.

**Update** `app/page.tsx`:

```tsx
"use client"

import { useState } from "react"
import GardenHeader from "@/components/garden-header"
import GardenGrid from "@/components/garden-grid"
import StatsSidebar from "@/components/stats-sidebar"
import PlantDetailsModal from "@/components/plant-details-modal"
import PlantSeedModal from "@/components/plant-seed-modal"
import { usePlants } from "@/hooks/usePlants"
import { usePlantStageScheduler } from "@/hooks/usePlantStageScheduler"

export default function Home() {
  const [selectedPlantId, setSelectedPlantId] = useState<bigint | null>(null)
  const [showPlantSeedModal, setShowPlantSeedModal] = useState(false)
  const { plants } = usePlants()

  // Start background scheduler for automatic stage updates
  const { isRunning } = usePlantStageScheduler()

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || null

  return (
    <div className="min-h-screen bg-background">
      <GardenHeader schedulerRunning={isRunning} />
      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        <main className="flex-1">
          <GardenGrid onSelectPlant={setSelectedPlantId} onPlantSeed={() => setShowPlantSeedModal(true)} />
        </main>
        <aside className="w-80">
          <StatsSidebar selectedPlantId={selectedPlantId} />
        </aside>
      </div>

      {/* Modals */}
      <PlantDetailsModal
        plant={selectedPlant}
        isOpen={!!selectedPlantId}
        onClose={() => setSelectedPlantId(null)}
      />
      <PlantSeedModal isOpen={showPlantSeedModal} onClose={() => setShowPlantSeedModal(false)} />
    </div>
  )
}
```

The layout uses a simple flex structure: the main content takes up all available space (`flex-1`) while the sidebar has a fixed width of 320px (`w-80`). The sidebar also uses `sticky top-24` so it stays visible when you scroll down.

The `usePlantStageScheduler()` hook is what makes the auto-sync magic happen. Just by calling it, it starts running in the background, checking every minute if any plants need their stage updated on the blockchain. The `isRunning` value it returns is passed to the header so users can see that sync indicator.

One thing to note: we're finding the selected plant by filtering the `plants` array. This works because `usePlants()` is already running and keeping the plants state fresh. When a plant gets updated (like after watering or harvesting), the `plants` array updates automatically, and so does `selectedPlant`.

---

### Step 11: Add Background Scheduler Hook

Now for the magic that keeps everything in sync! This hook runs in the background while your app is open, checking every 60 seconds if any plants need their growth stage updated on the blockchain.

Why do we need this? Plants grow based on time - every 60 seconds they should move to the next stage. But the blockchain doesn't know about time passing unless someone calls the contract. This scheduler does that automatically for all out-of-sync plants.

**Create** `hooks/usePlantStageScheduler.ts`:

```typescript
'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useContract } from './useContract'
import { usePlants } from './usePlants'
import { updatePlantStage as updatePlantStageContract, isStageOutOfSync } from '@/lib/contract'
import { GrowthStage } from '@/types/contracts'

/**
 * Background scheduler that automatically updates plant stages every minute
 * Runs for all user's plants that need stage updates
 */
export function usePlantStageScheduler() {
  const { client, account, isConnected } = useContract()
  const { plants } = usePlants()
  const isProcessingRef = useRef(false)

  const updatePlantsStages = useCallback(async () => {
    // Skip if already processing or not connected
    if (isProcessingRef.current || !client || !account || !isConnected) {
      return
    }

    // Skip if no plants
    if (plants.length === 0) {
      return
    }

    isProcessingRef.current = true

    try {
      // Filter plants that need stage updates
      const plantsNeedingUpdate = plants.filter((plant) => {
        // Skip dead plants
        if (plant.isDead || !plant.exists) return false

        // Skip plants already at max stage
        if (plant.stage === GrowthStage.BLOOMING) return false

        // Only update if stage is out of sync
        return isStageOutOfSync(plant)
      })

      if (plantsNeedingUpdate.length === 0) {
        console.log('[PlantScheduler] All plants are up to date')
        return
      }

      console.log(`[PlantScheduler] Updating ${plantsNeedingUpdate.length} plant(s) stages...`)

      // Update each plant sequentially to avoid nonce conflicts
      for (const plant of plantsNeedingUpdate) {
        try {
          console.log(`[PlantScheduler] Updating plant #${plant.id}...`)
          await updatePlantStageContract(client, account, plant.id)
          console.log(`[PlantScheduler] Plant #${plant.id} updated successfully`)
        } catch (err) {
          console.error(`[PlantScheduler] Failed to update plant #${plant.id}:`, err)
          // Continue with next plant even if one fails
        }
      }

      console.log('[PlantScheduler] Batch update complete')
    } catch (err) {
      console.error('[PlantScheduler] Error in scheduler:', err)
    } finally {
      isProcessingRef.current = false
    }
  }, [client, account, isConnected, plants])

  // Set up interval to run every minute
  useEffect(() => {
    if (!isConnected || plants.length === 0) {
      return
    }

    console.log('[PlantScheduler] Starting scheduler (runs every 60 seconds)')

    // Run immediately on mount
    updatePlantsStages()

    // Then run every minute
    const intervalId = setInterval(() => {
      updatePlantsStages()
    }, 60000) // 60 seconds

    return () => {
      console.log('[PlantScheduler] Stopping scheduler')
      clearInterval(intervalId)
    }
  }, [isConnected, plants.length, updatePlantsStages])

  return {
    isRunning: isConnected && plants.length > 0,
  }
}
```

The hook is pretty smart about what it does. First, it only runs if you're connected and have plants - no point in running an empty loop. Second, it filters plants to only update ones that are actually out of sync (using the `isStageOutOfSync` helper). Dead plants and already-blooming plants get skipped.

One important detail: we update plants sequentially, not in parallel. Why? Account abstraction transactions need nonces to prevent replay attacks. If you send multiple transactions at once, they might get the same nonce and fail. Processing them one at a time avoids this issue.

The `isProcessingRef` prevents the scheduler from running twice at the same time. If the previous run is still going when the interval fires again, it just skips that cycle.

You'll notice console logs throughout - these are super helpful for debugging when something goes wrong. You can see exactly which plants are being updated and if any fail.

The cleanup function in the useEffect return is crucial - it clears the interval when the component unmounts, preventing memory leaks and unnecessary blockchain calls.

---

## Frontend 105: Real-time State Management

### The Challenge

**Problem**: Plants grow and water depletes over time, but blockchain state is only updated when transactions occur. Users see stale data.

**Solution**: Client-side calculations + auto-refresh

### Water Depletion Mechanic

**How it works**:

```
Plant watered at time 0:
  water = 100%

After 30 seconds:
  water = 80% (lost 20%)

After 60 seconds:
  water = 60% (lost 40%)

After 150 seconds:
  water = 0% → Plant dies 💀
```

**Implementation** (already in `lib/contract.ts`):

```typescript
export function getClientWaterLevel(plant: Plant): number {
  // Special case: Blooming plants don't lose water
  if (plant.stage === GrowthStage.BLOOMING) {
    return plant.waterLevel
  }

  const now = Date.now() / 1000
  const timeSinceWatered = now - Number(plant.lastWatered)
  const depletionIntervals = Math.floor(timeSinceWatered / WATER_DEPLETION_TIME)
  const waterLost = depletionIntervals * WATER_DEPLETION_RATE

  return Math.max(plant.waterLevel - waterLost, 0)
}
```

**Key insight**: We calculate water level based on `lastWatered` timestamp, not blockchain state. This gives real-time updates without transactions!

### Auto-refresh Strategy

**Implementation** (already in `hooks/usePlants.ts`):

```typescript
// Auto-refresh every 5 seconds
useEffect(() => {
  if (!isConnected) return

  const interval = setInterval(() => {
    fetchPlants()
  }, 5000)

  return () => clearInterval(interval)
}, [isConnected, fetchPlants])
```

**Why 5 seconds?**
- ⚡ Fast enough for good UX
- 💰 Not too many RPC calls
- 🎯 Balances responsiveness and performance

### Stage Progression

**Time-based stages**:

```
Planted at time 0 → SEED
After 60 seconds → SPROUT
After 120 seconds → GROWING
After 180 seconds → BLOOMING
```

**Implementation**:

```typescript
export function getExpectedStage(plant: Plant): GrowthStage {
  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  // Calculate which stage based on time
  const calculatedStage = Math.min(Math.floor(timePassed / STAGE_DURATION), 3)
  return calculatedStage as GrowthStage
}

export function isStageOutOfSync(plant: Plant): boolean {
  const expectedStage = getExpectedStage(plant)
  return plant.stage < expectedStage
}
```

**When out of sync**:
- Show "🔄 Needs Update" badge
- User clicks "Update Stage" button
- Calls `updatePlantStage()` on contract
- On-chain state syncs with expected stage

---

## Frontend 106: Advanced Features & Deployment

### Advanced Feature 1: Background Stage Scheduler

**Problem**: Users must manually update plant stages

**Solution**: Auto-update in background

Create `hooks/usePlantStageScheduler.ts`:

```typescript
'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useContract } from './useContract'
import { usePlants } from './usePlants'
import { updatePlantStage as updatePlantStageContract, isStageOutOfSync } from '@/lib/contract'
import { GrowthStage } from '@/types/contracts'

/**
 * Background scheduler that automatically updates plant stages every minute
 */
export function usePlantStageScheduler() {
  const { client, account, isConnected } = useContract()
  const { plants } = usePlants()
  const isProcessingRef = useRef(false)

  const updatePlantsStages = useCallback(async () => {
    // Skip if already processing
    if (isProcessingRef.current || !client || !account || !isConnected) {
      return
    }

    // Skip if no plants
    if (plants.length === 0) {
      return
    }

    isProcessingRef.current = true

    try {
      // Filter plants that need stage updates
      const plantsNeedingUpdate = plants.filter((plant) => {
        // Skip dead plants
        if (plant.isDead || !plant.exists) return false

        // Skip plants already at max stage
        if (plant.stage === GrowthStage.BLOOMING) return false

        // Only update if stage is out of sync
        return isStageOutOfSync(plant)
      })

      if (plantsNeedingUpdate.length === 0) {
        console.log('[PlantScheduler] All plants are up to date')
        return
      }

      console.log(`[PlantScheduler] Updating ${plantsNeedingUpdate.length} plant(s) stages...`)

      // Update each plant sequentially to avoid nonce conflicts
      for (const plant of plantsNeedingUpdate) {
        try {
          console.log(`[PlantScheduler] Updating plant #${plant.id}...`)
          await updatePlantStageContract(client, account, plant.id)
          console.log(`[PlantScheduler] Plant #${plant.id} updated successfully`)
        } catch (err) {
          console.error(`[PlantScheduler] Failed to update plant #${plant.id}:`, err)
          // Continue with next plant even if one fails
        }
      }

      console.log('[PlantScheduler] Batch update complete')
    } catch (err) {
      console.error('[PlantScheduler] Error in scheduler:', err)
    } finally {
      isProcessingRef.current = false
    }
  }, [client, account, isConnected, plants])

  // Set up interval to run every minute
  useEffect(() => {
    if (!isConnected || plants.length === 0) {
      return
    }

    console.log('[PlantScheduler] Starting scheduler (runs every 60 seconds)')

    // Run immediately on mount
    updatePlantsStages()

    // Then run every minute
    const intervalId = setInterval(() => {
      updatePlantsStages()
    }, 60000) // 60 seconds

    return () => {
      console.log('[PlantScheduler] Stopping scheduler')
      clearInterval(intervalId)
    }
  }, [isConnected, plants.length, updatePlantsStages])

  return {
    isRunning: isConnected && plants.length > 0,
  }
}
```

**Use in `app/page.tsx`**:

```typescript
import { usePlantStageScheduler } from '@/hooks/usePlantStageScheduler'

export default function Home() {
  // Auto-update plant stages in background
  usePlantStageScheduler()

  // ... rest of component
}
```

### Advanced Feature 2: Deployment to Vercel

**Step 1: Push to GitHub**

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Create commit
git commit -m "feat: Complete Lisk Garden DApp with account abstraction"

# Create repository on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/lisk-garden-dapp.git
git push -u origin master
```

**Step 2: Deploy to Vercel**

1. Visit [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `lisk-garden-dapp` repository
5. Add environment variables:
   - `NEXT_PUBLIC_PANNA_CLIENT_ID`
   - `NEXT_PUBLIC_PANNA_PARTNER_ID`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
6. Click "Deploy"

**Expected result**:
```
✓ Building...
✓ Deploying...
✓ Success! Your app is live at: https://lisk-garden-dapp.vercel.app
```

**🎉 Your DApp is now live on the internet!**

---

## Part 3: Testing & Best Practices

### Testing Your DApp

**Manual Testing Checklist**:

- [ ] Wallet connection works
- [ ] Can plant seed (costs 0.001 ETH)
- [ ] Plant appears in grid
- [ ] Water level depletes over time
- [ ] Can water plant (refills to 100%)
- [ ] Stage updates after 60 seconds
- [ ] Can update stage manually
- [ ] Plant reaches blooming after 180 seconds
- [ ] Can harvest blooming plant (receive 0.003 ETH)
- [ ] Dead plant shows correctly when water reaches 0%
- [ ] Modal opens/closes properly
- [ ] Real-time updates work
- [ ] Dark mode works
- [ ] Responsive on mobile

### Best Practices

#### 1. Error Handling

**Always wrap contract calls in try-catch**:

```typescript
try {
  await plantSeed()
} catch (err) {
  console.error('Error planting seed:', err)
  alert('Transaction failed. Please try again.')
}
```

#### 2. Loading States

**Show loading indicators**:

```typescript
<Button disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="animate-spin" />
      Processing...
    </>
  ) : (
    'Plant Seed'
  )}
</Button>
```

#### 3. Optimistic UI

**Update UI before blockchain confirmation** (for better UX):

```typescript
// Update local state immediately
setPlants([...plants, newPlant])

// Then wait for blockchain
await plantSeedContract(client, account)
```

#### 4. Gas Optimization

**Batch operations when possible**:

```typescript
// Bad: Multiple transactions
await waterPlant(1)
await waterPlant(2)
await waterPlant(3)

// Good: Batch transaction (requires contract support)
await batchWaterPlants([1, 2, 3])
```

#### 5. Security

**Never store private keys in code**:

```typescript
// ❌ NEVER DO THIS
const privateKey = "0x1234..."

// ✅ Use environment variables
const clientId = process.env.NEXT_PUBLIC_PANNA_CLIENT_ID
```

---

## Troubleshooting

### Common Issues

#### Issue 1: "Missing Panna SDK credentials"

**Solution**:
```bash
# Check .env.local exists
ls -la | grep .env.local

# Check contents
cat .env.local

# Restart dev server
npm run dev
```

#### Issue 2: MetaMask not opening

**Solutions**:
1. Check MetaMask extension is installed
2. Refresh page (F5)
3. Check browser console for errors
4. Try different browser

#### Issue 3: Transaction failing

**Solutions**:
1. Check you have enough ETH on Lisk Sepolia
2. Check contract address is correct
3. Check you're on Lisk Sepolia network
4. View transaction on [Lisk Sepolia Explorer](https://sepolia-blockscout.lisk.com/)

#### Issue 4: Plants not loading

**Solutions**:
1. Check wallet is connected
2. Check contract address in `.env.local`
3. Open browser console for errors
4. Verify RPC endpoint is working

#### Issue 5: Water level not updating

**Solution**: This is client-side calculation. Check:
```typescript
// In browser console:
const plant = await getPlant(client, 1n)
console.log('Last watered:', plant.lastWatered)
console.log('Current water:', getClientWaterLevel(plant))
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Panna SDK Docs](https://docs.panna.xyz)
- [Thirdweb Docs](https://portal.thirdweb.com)
- [Viem Docs](https://viem.sh)

### Tools
- [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com)
- [Lisk Sepolia Explorer](https://sepolia-blockscout.lisk.com)
- [Panna Dashboard](https://panna.xyz)
- [Vercel](https://vercel.com)

### Community
- [Lisk Discord](https://discord.gg/lisk)
- [ETH Jakarta Discord](#)
- [Panna Discord](https://discord.gg/panna)

---

## Next Steps

**🎉 Congratulations!** You've built a complete DApp with:
- ✅ Modern frontend (Next.js + React)
- ✅ Account abstraction (Panna SDK)
- ✅ Gasless transactions
- ✅ Smart contract integration
- ✅ Real-time updates
- ✅ Beautiful UI
- ✅ Production deployment

**What's next?**

### Beginner
- [ ] Add more plant types
- [ ] Customize UI colors
- [ ] Add sound effects
- [ ] Create leaderboard

### Intermediate
- [ ] Add NFT images for plants
- [ ] Implement plant trading
- [ ] Add achievements system
- [ ] Create mobile app with React Native

### Advanced
- [ ] Multi-chain deployment (Ethereum, Base, Optimism)
- [ ] Layer 2 scaling with zkSync
- [ ] Implement DAO for game governance
- [ ] Add DeFi mechanics (staking, yield farming)

---

## Workshop Challenge

**Build a feature and win prizes!** 🏆

Add ONE of these features to your DApp:

1. **Plant Marketplace** - Buy/sell plants between players
2. **Breeding System** - Combine two plants to create rare variants
3. **Seasons** - Different seasons affect growth speed
4. **Achievements** - Unlock badges for milestones
5. **Social Features** - Visit friends' gardens

**Submission**:
- Deploy to Vercel
- Share GitHub repo
- Demo video (2 minutes)

**Prizes**:
- 🥇 1st Place: $500
- 🥈 2nd Place: $300
- 🥉 3rd Place: $200

---

**Thank you for joining Session 4!** 🌱🚀

Remember: **The best way to learn is by building.** Don't just copy code - experiment, break things, and fix them!

See you in the next session! 👋
