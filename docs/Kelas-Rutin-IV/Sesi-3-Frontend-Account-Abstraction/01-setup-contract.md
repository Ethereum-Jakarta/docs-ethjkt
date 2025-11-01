---
id: part-1-setup-contract
title: "Part 1: Setup & Contract Integration"
sidebar_label: "Part 1: Setup & Contract"
---

# Part 1: Setup & Contract Integration

**Module 1 & 2 (09:15 - 12:30)** | Setup + Contract Integration

---

## 📋 Overview

Di part ini, kita akan:
- ✅ Setup Next.js 15 + React 19 project
- ✅ Install Panna SDK, Thirdweb, dan dependencies lainnya
- ✅ Configure Lisk Sepolia network
- ✅ Setup contract types & ABI
- ✅ Create contract interaction utilities
- ✅ Build custom React hooks

---

## Module 1: Project Setup (90 menit)

### Step 1: Create Next.js Project

Buka terminal dan jalankan:

```bash
npx create-next-app@latest lisk-garden-dapp
```

Pilih options berikut:
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to use Turbopack for next dev? … No
✔ Would you like to customize the import alias (@/* by default)? … No
```

Masuk ke project directory:
```bash
cd lisk-garden-dapp
```

---

### Step 2: Install Dependencies

Install semua dependencies yang dibutuhkan menggunakan **yarn**:

```bash
yarn add panna-sdk ethers@^6 lucide-react next-themes sonner date-fns @vercel/analytics
```

**Penjelasan packages:**
- `panna-sdk` - Wallet connection + Account Abstraction (gasless transactions!)
- `ethers@^6` - Ethereum utilities
- `lucide-react` - Icon library
- `next-themes` - Dark/light mode support
- `sonner` - Toast notifications
- `date-fns` - Date formatting utilities
- `@vercel/analytics` - Vercel analytics (optional)

---

### Step 3: Install shadcn/ui

shadcn/ui adalah component library yang akan kita gunakan.

**Initialize shadcn/ui:**
```bash
npx shadcn@latest init
```

Pilih options:
```
✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS.
✔ Validating import alias.

✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Zinc
✔ Would you like to use CSS variables for theming? › yes
```

**Install components yang dibutuhkan:**
```bash
npx shadcn@latest add card button dialog input label progress separator sheet skeleton textarea toast tooltip toggle
```

Components ini akan digunakan untuk build UI garden kita.

---

### Step 4: Setup Environment Variables

Create file `.env.local` di root project:

```bash
touch .env.local
```

Isi dengan:
```env
# Panna SDK Credentials (dari https://panna.network)
NEXT_PUBLIC_PANNA_CLIENT_ID=your_panna_client_id_here
NEXT_PUBLIC_PANNA_PARTNER_ID=your_panna_partner_id_here

# Lisk Sepolia Network
NEXT_PUBLIC_CHAIN_ID=4202

# LiskGarden Contract Address (dari Sesi 1)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

**📝 Cara dapat Panna credentials:**
1. Buka [panna.network](https://panna.network)
2. Sign up / Login
3. Create new project
4. Copy `Client ID` dan `Partner ID`
5. Paste ke `.env.local`

**🔒 Security Note:**
File `.env.local` sudah auto-ignored oleh Next.js. Jangan commit ke git!

---

### Step 5: Setup Contract Types & ABI

Create folder `types` dan file `contracts.ts`:

```bash
mkdir types
touch types/contracts.ts
```

**File**: `types/contracts.ts`

```typescript
// Contract Types and Constants untuk LiskGarden DApp

// Growth stages enum (matching Solidity contract)
export enum GrowthStage {
  SEED = 0,
  SPROUT = 1,
  GROWING = 2,
  BLOOMING = 3,
}

// Plant interface (matching contract struct)
export interface Plant {
  id: bigint
  owner: string
  stage: GrowthStage
  plantedDate: bigint // timestamp dalam seconds
  lastWatered: bigint // timestamp dalam seconds
  waterLevel: number // 0-100
  exists: boolean
  isDead: boolean // apakah plant mati karena kurang air
}

// Growth stage display names
export const STAGE_NAMES = {
  [GrowthStage.SEED]: 'seed',
  [GrowthStage.SPROUT]: 'sprout',
  [GrowthStage.GROWING]: 'growing',
  [GrowthStage.BLOOMING]: 'blooming',
} as const

// Contract constants (sesuai dengan smart contract)
export const PLANT_PRICE = '0.001' // ETH
export const HARVEST_REWARD = '0.003' // ETH
export const STAGE_DURATION = 60 // 60 seconds = 1 menit per stage
export const WATER_DEPLETION_TIME = 30 // 30 seconds
export const WATER_DEPLETION_RATE = 20 // 20% per interval

// Contract address dari environment variable
export const LISK_GARDEN_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

// Contract ABI (Application Binary Interface)
// Ini adalah interface untuk berinteraksi dengan smart contract
export const LISK_GARDEN_ABI = [
  // Constructor
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},

  // Events
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"PlantDied","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"PlantHarvested","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"PlantSeeded","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"newWaterLevel","type":"uint8"}],"name":"PlantWatered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"plantId","type":"uint256"},{"indexed":false,"internalType":"enum LiskGarden.GrowthStage","name":"newStage","type":"uint8"}],"name":"StageAdvanced","type":"event"},

  // View functions (read-only)
  {"inputs":[],"name":"HARVEST_REWARD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PLANT_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"STAGE_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"WATER_DEPLETION_RATE","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"WATER_DEPLETION_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"calculateWaterLevel","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"getPlant","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"enum LiskGarden.GrowthStage","name":"stage","type":"uint8"},{"internalType":"uint256","name":"plantedDate","type":"uint256"},{"internalType":"uint256","name":"lastWatered","type":"uint256"},{"internalType":"uint8","name":"waterLevel","type":"uint8"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"isDead","type":"bool"}],"internalType":"struct LiskGarden.Plant","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserPlants","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"plantCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  // Write functions (state-changing)
  {"inputs":[],"name":"plantSeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"waterPlant","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"updatePlantStage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"plantId","type":"uint256"}],"name":"harvestPlant","outputs":[],"stateMutability":"nonpayable","type":"function"},
] as const
```

**💡 Penjelasan:**
- `GrowthStage` enum untuk tracking tahap pertumbuhan
- `Plant` interface untuk type safety
- `LISK_GARDEN_ABI` adalah contract interface - seperti "menu" fungsi yang tersedia
- Constants seperti `PLANT_PRICE`, `HARVEST_REWARD` untuk referensi

---

### Step 6: Setup Contract Utilities

Create folder `lib` dan file `contract.ts`:

```bash
mkdir lib
touch lib/contract.ts
```

**File**: `lib/contract.ts`

```typescript
// Contract interaction utilities untuk LiskGarden DApp
// Menggunakan Panna SDK & Thirdweb untuk berinteraksi dengan smart contract

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

// ============================================
// HELPER FUNCTIONS
// ============================================

// Convert raw contract data menjadi typed Plant object
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

// ============================================
// CONTRACT WRITE FUNCTIONS (Mengubah state)
// ============================================

// Plant a new seed (payable - butuh ETH)
export async function plantSeed(client: any, account: any) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function plantSeed() payable returns (uint256)',
    params: [],
    value: toWei(PLANT_PRICE), // Convert 0.001 ETH ke wei
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  // Wait sampai transaction di-mine
  await waitForReceipt(result)

  return result
}

// Water a plant
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

// Harvest a blooming plant
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

// Update plant stage manually (sync dengan blockchain)
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

// ============================================
// CONTRACT READ FUNCTIONS (Read-only, tidak butuh gas)
// ============================================

// Get single plant data
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

// Calculate current water level dari blockchain
export async function calculateWaterLevel(client: any, plantId: bigint, plant?: Plant): Promise<number> {
  // Optimization: Skip blockchain call untuk blooming plants
  // Blooming plants tidak kehilangan air
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

// Get all plants milik user
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

// ============================================
// CLIENT-SIDE HELPER FUNCTIONS (Tidak hit blockchain)
// ============================================

// Format plant age menjadi human-readable string
export function formatPlantAge(plantedDate: bigint): string {
  const now = Date.now()
  const planted = Number(plantedDate) * 1000
  const diff = now - planted

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) return `${days} hari lalu`
  if (hours > 0) return `${hours}j ${minutes}m lalu`
  if (minutes > 0) return `${minutes}m ${seconds}d lalu`
  return `${seconds}d lalu`
}

// Format last watered time
export function formatLastWatered(lastWatered: bigint): string {
  return formatPlantAge(lastWatered)
}

// Get stage display name
export function getStageDisplayName(stage: GrowthStage): string {
  return STAGE_NAMES[stage]
}

// Check apakah plant bisa di-harvest
export function canHarvest(plant: Plant): boolean {
  return plant.stage === GrowthStage.BLOOMING && plant.exists && !plant.isDead
}

// Calculate plant progress percentage
export function getPlantProgress(plant: Plant): number {
  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  if (plant.stage === GrowthStage.BLOOMING) return 100

  // Use STAGE_DURATION constant (60 seconds per stage)
  const currentStageStart = Number(plant.stage) * STAGE_DURATION
  const currentStageProgress = ((timePassed - currentStageStart) / STAGE_DURATION) * 25

  return Math.min(Number(plant.stage) * 25 + currentStageProgress, 100)
}

// Calculate current water level (client-side, no blockchain call)
export function getClientWaterLevel(plant: Plant): number {
  if (!plant.exists || plant.isDead) return 0

  // Blooming plants tidak kehilangan air - mereka siap panen!
  if (plant.stage === GrowthStage.BLOOMING) {
    return plant.waterLevel
  }

  const now = Date.now() / 1000
  const timeSinceWatered = now - Number(plant.lastWatered)
  const depletionIntervals = Math.floor(timeSinceWatered / WATER_DEPLETION_TIME)
  const waterLost = depletionIntervals * WATER_DEPLETION_RATE

  if (waterLost >= plant.waterLevel) return 0

  return plant.waterLevel - waterLost
}

// Check apakah plant butuh disiram (di bawah 50%)
export function needsWater(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  if (plant.stage === GrowthStage.BLOOMING) return false
  return getClientWaterLevel(plant) < 50
}

// Check apakah plant dalam kondisi kritis (di bawah 20%)
export function isCritical(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  if (plant.stage === GrowthStage.BLOOMING) return false
  return getClientWaterLevel(plant) < 20
}

// Calculate expected stage berdasarkan waktu
export function getExpectedStage(plant: Plant): GrowthStage {
  if (plant.isDead || !plant.exists) return plant.stage

  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  // Calculate stage berdasarkan waktu
  const calculatedStage = Math.min(Math.floor(timePassed / STAGE_DURATION), 3)
  return calculatedStage as GrowthStage
}

// Check apakah plant stage perlu di-sync
export function isStageOutOfSync(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  const expectedStage = getExpectedStage(plant)
  return plant.stage < expectedStage
}

// Export constants
export { LISK_GARDEN_CONTRACT_ADDRESS, PLANT_PRICE, HARVEST_REWARD, STAGE_DURATION }
```

**💡 Key Points:**
- Functions dibagi 3 kategori: **Write** (ubah state), **Read** (dari blockchain), **Helper** (client-side)
- **Write functions** menggunakan Panna SDK - GASLESS otomatis!
- **Read functions** tidak butuh gas
- **Helper functions** pure JavaScript, tidak hit blockchain

---

### ☕ ISTIRAHAT (10:45 - 11:00)

Setelah istirahat, kita lanjut ke Module 2!

---

## Module 2: Custom React Hooks (90 menit)

### Step 7: Create useContract Hook

Create file `hooks/useContract.ts`:

```bash
mkdir hooks
touch hooks/useContract.ts
```

**File**: `hooks/useContract.ts`

```typescript
'use client'

import { useMemo } from 'react'
import { useActiveAccount, usePanna } from 'panna-sdk'
import { LISK_GARDEN_CONTRACT_ADDRESS } from '@/lib/contract'

/**
 * Hook untuk get Panna client dan active account
 * Returns client, account, dan wallet connection status
 */
export function useContract() {
  const activeAccount = useActiveAccount()
  const { client } = usePanna()

  const contractInfo = useMemo(() => {
    return {
      client: client || null,
      account: activeAccount || null,
      isConnected: !!activeAccount && !!client,
      address: activeAccount?.address || null,
      contractAddress: LISK_GARDEN_CONTRACT_ADDRESS,
    }
  }, [activeAccount, client])

  return contractInfo
}
```

**💡 Penjelasan:**
- `useActiveAccount()` - Hook dari Panna SDK untuk get connected account
- `usePanna()` - Hook untuk get Panna client
- `useMemo` - Optimize performance, hanya re-calculate kalau dependencies berubah
- Returns object dengan `client`, `account`, `isConnected`, `address`

---

### Step 8: Create usePlants Hook

Create file `hooks/usePlants.ts`:

```bash
touch hooks/usePlants.ts
```

**File**: `hooks/usePlants.ts`

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import {
  getUserPlants,
  getPlant,
  plantSeed as plantSeedContract,
  waterPlant as waterPlantContract,
  harvestPlant as harvestPlantContract,
  updatePlantStage as updatePlantStageContract,
  isStageOutOfSync,
} from '@/lib/contract'
import { Plant } from '@/types/contracts'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook untuk manage user's plants
 * Fetch plants dari contract dan provides plant operations
 */
export function usePlants() {
  const { client, account, isConnected, address } = useContract()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch user's plants (dengan optional silent mode untuk auto-refresh)
  const fetchPlants = useCallback(async (silent = false) => {
    if (!client || !address) {
      setPlants([])
      return
    }

    // Hanya show loading state kalau bukan silent (user-initiated actions)
    if (!silent) {
      setLoading(true)
    }
    setError(null)

    try {
      // Get user's plant IDs
      const plantIds = await getUserPlants(client, address)

      // Fetch data setiap plant
      const plantPromises = plantIds.map(async (id) => {
        try {
          const plant = await getPlant(client, id)
          return plant.exists ? plant : null
        } catch (err) {
          console.error(`Error fetching plant ${id}:`, err)
          return null
        }
      })

      const fetchedPlants = await Promise.all(plantPromises)
      const validPlants = fetchedPlants.filter((p): p is Plant => p !== null)

      setPlants(validPlants)
    } catch (err) {
      console.error('Error fetching plants:', err)
      setError(err as Error)

      // Hanya show error toast kalau bukan silent
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Gagal mengambil data plants. Silakan coba lagi.',
          variant: 'destructive',
        })
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [client, address, toast])

  // Plant new seed
  const plantSeed = useCallback(async () => {
    if (!client || !account) {
      toast({
        title: 'Wallet belum terkoneksi',
        description: 'Silakan connect wallet terlebih dahulu',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // Send transaction dan wait untuk receipt
      await plantSeedContract(client, account)

      toast({
        title: 'Seed berhasil ditanam!',
        description: 'Plant Anda berhasil dibuat. Cost: 0.001 ETH',
      })

      // Transaction confirmed, refresh plants
      await fetchPlants()
    } catch (err: any) {
      console.error('Error planting seed:', err)
      toast({
        title: 'Error',
        description: err.message || 'Gagal menanam seed. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [client, account, toast, fetchPlants])

  // Water a plant
  const waterPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet belum terkoneksi',
          description: 'Silakan connect wallet terlebih dahulu',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        // Check apakah stage perlu update
        const plant = await getPlant(client, plantId)
        const needsStageUpdate = isStageOutOfSync(plant)

        if (needsStageUpdate) {
          toast({
            title: 'Syncing stage...',
            description: 'Update plant stage terlebih dahulu, lalu watering.',
          })
          await updatePlantStageContract(client, account, plantId)
        }

        // Send transaction
        await waterPlantContract(client, account, plantId)

        toast({
          title: 'Plant berhasil disiram!',
          description: needsStageUpdate
            ? 'Stage di-sync dan plant disiram!'
            : 'Plant Anda berhasil disiram. GRATIS - hanya gas!',
        })

        // Refresh plants
        await fetchPlants()
      } catch (err: any) {
        console.error('Error watering plant:', err)
        toast({
          title: 'Error',
          description: err.message || 'Gagal menyiram plant. Silakan coba lagi.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Harvest a plant
  const harvestPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet belum terkoneksi',
          description: 'Silakan connect wallet terlebih dahulu',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        // Check apakah stage perlu update sebelum harvest
        const plant = await getPlant(client, plantId)
        const needsStageUpdate = isStageOutOfSync(plant)

        if (needsStageUpdate) {
          toast({
            title: 'Syncing stage...',
            description: 'Update ke blooming stage sebelum harvest.',
          })
          await updatePlantStageContract(client, account, plantId)
        }

        // Send transaction
        await harvestPlantContract(client, account, plantId)

        toast({
          title: 'Plant berhasil dipanen!',
          description: needsStageUpdate
            ? 'Stage di-sync dan di-harvest! Anda menerima 0.003 ETH 🎉'
            : 'Anda menerima 0.003 ETH reward! 🎉',
        })

        // Refresh plants
        await fetchPlants()
      } catch (err: any) {
        console.error('Error harvesting plant:', err)
        toast({
          title: 'Error',
          description: err.message || 'Gagal panen plant. Silakan coba lagi.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Update plant stage manually
  const updatePlantStage = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet belum terkoneksi',
          description: 'Silakan connect wallet terlebih dahulu',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        await updatePlantStageContract(client, account, plantId)

        toast({
          title: 'Stage berhasil di-update!',
          description: 'Plant stage sudah di-sync dengan blockchain.',
        })

        await fetchPlants()
      } catch (err: any) {
        console.error('Error updating plant stage:', err)
        toast({
          title: 'Error',
          description: err.message || 'Gagal update plant stage. Silakan coba lagi.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Auto-fetch plants saat connected
  useEffect(() => {
    if (isConnected && address) {
      fetchPlants()
    }
  }, [isConnected, address, fetchPlants])

  // Auto-refresh data setiap 5 detik (silent mode untuk seamless updates)
  useEffect(() => {
    if (!isConnected || !address) {
      return
    }

    // Set interval untuk refetch setiap 5 detik dalam silent mode
    const intervalId = setInterval(() => {
      fetchPlants(true) // true = silent mode (no loading state)
    }, 5000)

    // Cleanup interval on unmount atau dependencies change
    return () => clearInterval(intervalId)
  }, [isConnected, address, fetchPlants])

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

**💡 Key Features:**
- `fetchPlants` - Dengan silent mode untuk auto-refresh tanpa loading flicker
- `plantSeed`, `waterPlant`, `harvestPlant` - All actions dengan proper error handling
- Auto-sync stage sebelum water/harvest kalau perlu
- Auto-refresh setiap 5 detik untuk real-time updates
- Toast notifications untuk user feedback

---

### Step 9: Setup Providers

Create file `components/providers.tsx`:

```bash
mkdir components
touch components/providers.tsx
```

**File**: `components/providers.tsx`

```typescript
'use client'

import { PannaProvider } from 'panna-sdk'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PANNA_PARTNER_ID}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </PannaProvider>
  )
}
```

**💡 Penjelasan:**
- `PannaProvider` - Setup Panna SDK dengan credentials dari `.env.local`
- **GASLESS OTOMATIS AKTIF** via Panna SDK! 🎉
- `ThemeProvider` - Dark/light mode support
- `Toaster` - Toast notifications component

---

### Step 10: Create ThemeProvider

Create file `components/theme-provider.tsx`:

```bash
touch components/theme-provider.tsx
```

**File**: `components/theme-provider.tsx`

```typescript
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

---

### Step 11: Update Root Layout

Update `app/layout.tsx`:

```typescript
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lisk Garden - Web3 Garden Game",
  description: "Grow your virtual garden on the Lisk blockchain",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
```

---

## ✅ Testing Setup

Test apakah setup berhasil:

```bash
yarn dev
```

Buka http://localhost:3000

**Checklist:**
- [ ] App running tanpa error
- [ ] No TypeScript errors
- [ ] Environment variables loaded
- [ ] Ready untuk build UI components!

---

## 🎯 Module 1 & 2 Complete!

Sekarang kita sudah punya:
- ✅ Next.js 15 + React 19 project
- ✅ Panna SDK setup (gasless otomatis!)
- ✅ Thirdweb SDK untuk contract interactions
- ✅ Contract types & ABI
- ✅ Contract interaction utilities
- ✅ Custom React hooks (`useContract`, `usePlants`)

**Istirahat Makan Siang (12:30 - 13:30)** 🍽️

Setelah makan siang, kita akan build UI components!

---

**[← Back to Main Index](./sesi-3-kelas-rutin-batch-4.md)** | **[Next: Part 2A - Building UI Components →](./02-building-ui-COMPLETE.md)**

---

**#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia**
