---
id: part-2-building-ui
title: "Part 2: Building UI Components"
sidebar_label: "Part 2: Building UI"
---

# Part 2: Building UI Components

**Module 3 (13:30 - 16:45)** | Building Complete Garden UI

---

## 📋 Overview

Di part ini, kita akan build SEMUA UI components untuk LiskGarden DApp yang ada di actual project:

**Components yang akan dibuat:**
- ✅ GardenHeader - Header dengan wallet connection
- ✅ usePlantStageScheduler - Auto-sync plant stages setiap menit
- ✅ GardenGrid - Display semua plants dalam grid layout
- ✅ PlantCard - Individual plant card component
- ✅ PlantDetailsModal - Modal lengkap untuk plant actions
- ✅ PlantSeedModal - Modal untuk plant new seed
- ✅ StatsSidebar - Sidebar dengan statistics
- ✅ Main Page - Menggabungkan semua components

---

## Section A: Header & Auto-Scheduler (30 menit)

### Step 1: Create GardenHeader Component

Header dengan wallet connection menggunakan Panna SDK LoginButton.

**Create**: `components/garden-header.tsx`

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
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lisk Garden</h1>
            <p className="text-xs text-muted-foreground">Web3 Garden Game</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Auto-Sync Indicator */}
          {schedulerRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400 animate-spin" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Auto-Sync Active
              </span>
            </div>
          )}

          {/* Login/Wallet Button dari Panna SDK */}
          <LoginButton chain={liskSepolia} />
        </div>
      </div>
    </header>
  )
}
```

**💡 Key Features:**
- `LoginButton` dari Panna SDK - Automatic wallet connection!
- `schedulerRunning` indicator - Shows status auto-sync
- Sticky header dengan smooth animations
- Responsive design

---

### Step 2: Create usePlantStageScheduler Hook

Background scheduler yang otomatis update plant stages setiap 60 detik.

**Create**: `hooks/usePlantStageScheduler.ts`

```typescript
'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useContract } from './useContract'
import { usePlants } from './usePlants'
import { updatePlantStage as updatePlantStageContract, isStageOutOfSync } from '@/lib/contract'
import { GrowthStage } from '@/types/contracts'

/**
 * Background scheduler yang otomatis update plant stages setiap menit
 * Runs untuk semua user's plants yang butuh stage updates
 */
export function usePlantStageScheduler() {
  const { client, account, isConnected } = useContract()
  const { plants } = usePlants()
  const isProcessingRef = useRef(false)

  const updatePlantsStages = useCallback(async () => {
    // Skip kalau sudah processing atau tidak connected
    if (isProcessingRef.current || !client || !account || !isConnected) {
      return
    }

    // Skip kalau belum ada plants
    if (plants.length === 0) {
      return
    }

    isProcessingRef.current = true

    try {
      // Filter plants yang butuh stage updates
      const plantsNeedingUpdate = plants.filter((plant) => {
        // Skip dead plants
        if (plant.isDead || !plant.exists) return false

        // Skip plants yang sudah blooming
        if (plant.stage === GrowthStage.BLOOMING) return false

        // Hanya update kalau stage out of sync
        return isStageOutOfSync(plant)
      })

      if (plantsNeedingUpdate.length === 0) {
        console.log('[PlantScheduler] All plants are up to date')
        return
      }

      console.log(`[PlantScheduler] Updating ${plantsNeedingUpdate.length} plant(s) stages...`)

      // Update setiap plant sequentially untuk avoid nonce conflicts
      for (const plant of plantsNeedingUpdate) {
        try {
          console.log(`[PlantScheduler] Updating plant #${plant.id}...`)
          await updatePlantStageContract(client, account, plant.id)
          console.log(`[PlantScheduler] Plant #${plant.id} updated successfully`)
        } catch (err) {
          console.error(`[PlantScheduler] Failed to update plant #${plant.id}:`, err)
          // Continue dengan plant berikutnya meskipun ada yang fail
        }
      }

      console.log('[PlantScheduler] Batch update complete')
    } catch (err) {
      console.error('[PlantScheduler] Error in scheduler:', err)
    } finally {
      isProcessingRef.current = false
    }
  }, [client, account, isConnected, plants])

  // Setup interval untuk run setiap menit
  useEffect(() => {
    if (!isConnected || plants.length === 0) {
      return
    }

    console.log('[PlantScheduler] Starting scheduler (runs every 60 seconds)')

    // Run immediately saat mount
    updatePlantsStages()

    // Kemudian run setiap menit
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

**💡 Penjelasan:**
- Runs setiap 60 detik untuk check & update plant stages
- Update semua plants secara sequential (avoid nonce issues)
- Automatic & silent - no user intervention needed
- Returns `isRunning` untuk show indicator di header

---

## ☕ ISTIRAHAT (15:00 - 15:15)

---

## Section B: Plant Components (90 menit)

### Step 3: Create PlantCard Component

Individual card untuk display plant dengan enhanced visualization, real-time water & growth tracking.

**Create**: `components/plant-card.tsx`

```typescript
"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Sparkles, Clock, Skull, RefreshCw } from "lucide-react"
import { Plant, GrowthStage, STAGE_NAMES } from "@/types/contracts"
import { formatLastWatered, formatPlantAge, getPlantProgress, getClientWaterLevel, isCritical, isStageOutOfSync } from "@/lib/contract"

const STAGE_COLORS = {
  seed: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
  sprout: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  growing: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
  blooming: "bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100",
}

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

const STAGE_HOVER_BACKGROUNDS = {
  [GrowthStage.SEED]: "group-hover:from-amber-100 group-hover:to-yellow-100 dark:group-hover:from-amber-900 dark:group-hover:to-yellow-900",
  [GrowthStage.SPROUT]: "group-hover:from-green-100 group-hover:to-lime-100 dark:group-hover:from-green-900 dark:group-hover:to-lime-900",
  [GrowthStage.GROWING]: "group-hover:from-emerald-100 group-hover:to-teal-100 dark:group-hover:from-emerald-900 dark:group-hover:to-teal-900",
  [GrowthStage.BLOOMING]: "group-hover:from-pink-100 group-hover:to-rose-100 dark:group-hover:from-pink-900 dark:group-hover:to-rose-900",
}

const STAGE_BORDERS = {
  [GrowthStage.SEED]: "border-amber-300 dark:border-amber-700",
  [GrowthStage.SPROUT]: "border-green-300 dark:border-green-700",
  [GrowthStage.GROWING]: "border-emerald-300 dark:border-emerald-700",
  [GrowthStage.BLOOMING]: "border-rose-300 dark:border-rose-700",
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const stageKey = STAGE_NAMES[plant.stage] as keyof typeof STAGE_COLORS
  const progress = getPlantProgress(plant)
  const currentWaterLevel = getClientWaterLevel(plant)
  const critical = isCritical(plant)
  const stageOutOfSync = isStageOutOfSync(plant)

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ease-out animate-grow border-2 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        plant.isDead
          ? 'border-gray-500 opacity-75 hover:border-gray-600'
          : `${STAGE_BORDERS[plant.stage]} hover:border-opacity-100`
      }`}
    >
      {/* Plant visualization */}
      <div className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-out ${
        plant.isDead
          ? 'bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
          : `bg-gradient-to-b ${STAGE_BACKGROUNDS[plant.stage]} ${STAGE_HOVER_BACKGROUNDS[plant.stage]}`
      }`}>
        {plant.isDead ? (
          <div className="text-7xl grayscale opacity-50">💀</div>
        ) : (
          <>
            <div className="text-7xl animate-float">{STAGE_EMOJIS[plant.stage]}</div>
            {/* Stage-specific decorations */}
            {plant.stage === GrowthStage.SEED && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-amber-600/20 dark:bg-amber-400/20 rounded-full" />
                <div className="absolute top-4 right-4 text-2xl opacity-30">☀️</div>
              </>
            )}
            {plant.stage === GrowthStage.SPROUT && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-green-600/30 dark:bg-green-400/30 rounded-full" />
                <div className="absolute top-4 left-4 text-xl opacity-40 animate-pulse">💧</div>
                <div className="absolute top-4 right-4 text-xl opacity-40">☀️</div>
              </>
            )}
            {plant.stage === GrowthStage.GROWING && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-emerald-600/40 dark:bg-emerald-400/40 rounded-full" />
                <div className="absolute top-6 left-6 text-lg opacity-30 animate-bounce">🍃</div>
                <div className="absolute bottom-6 right-6 text-lg opacity-30 animate-bounce delay-100">🍃</div>
              </>
            )}
            {plant.stage === GrowthStage.BLOOMING && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-rose-600/40 dark:bg-rose-400/40 rounded-full" />
                <div className="absolute top-3 left-3 animate-bounce-in">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute top-6 right-6 text-2xl animate-pulse">✨</div>
                <div className="absolute bottom-6 left-6 text-xl opacity-50 animate-bounce">🌺</div>
                <div className="absolute bottom-6 right-6 text-xl opacity-50 animate-bounce delay-100">🦋</div>
              </>
            )}
          </>
        )}
        {!plant.isDead && stageOutOfSync && (
          <div className="absolute top-3 left-3 animate-pulse">
            <RefreshCw className="w-5 h-5 text-orange-500" />
          </div>
        )}
        {!plant.isDead && currentWaterLevel > 80 && (
          <div className="absolute top-3 right-3">
            <Droplets className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
        )}
        {!plant.isDead && critical && (
          <div className="absolute top-3 right-3 animate-pulse">
            <Skull className="w-6 h-6 text-red-500" />
          </div>
        )}
      </div>

      {/* Plant info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Plant #{plant.id.toString()}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              {plant.isDead ? (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30">
                  💀 Dead
                </span>
              ) : (
                <>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${STAGE_COLORS[stageKey]}`}>
                    {stageKey.charAt(0).toUpperCase() + stageKey.slice(1)}
                  </span>
                  {stageOutOfSync && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30">
                      🔄 Needs Update
                    </span>
                  )}
                  {plant.stage === GrowthStage.BLOOMING && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
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
            <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">🚨 Critical! Water immediately!</p>
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

**💡 Features:**
- **Enhanced Visualization** - Large 48px high visualization area dengan gradients
- **Stage-Specific Decorations** - Unique decorations untuk setiap growth stage
- **Full Gradient System** - Complete color system dengan backgrounds, hovers, dan borders
- **Status Indicators** - Stage sync warning (🔄), high water (💧), critical warning (💀)
- **Animated Plant Emojis** - 7xl sized dengan float animation
- **Interactive Card** - Hover effects dengan shadow & translate
- **Real-time Data** - Client-side water calculation tanpa blockchain call
- **Multiple Badges** - Stage badge, sync status, harvest ready indicator

---

### Step 4: Create GardenGrid Component

Grid layout untuk display semua plants dengan multiple states: not connected, loading, empty, dan data grid.

**Create**: `components/garden-grid.tsx`

```typescript
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

**💡 Features:**
- **Not Connected State** - Special UI kalau wallet belum connect (dengan Sprout icon)
- **Loading State** - Loader2 animated spinner saat fetching data
- **Empty State** - Onboarding message kalau belum ada plants
- **useContract Hook** - Check wallet connection status
- **useToast Hook** - Toast notifications untuk user feedback
- **handleRefresh Function** - Manual refresh dengan toast notification
- **Responsive Grid** - 1/2/3 columns tergantung screen size
- **Plant Card Wrapper** - Div wrapper dengan onClick untuk handle card selection
- **Dynamic Header** - Shows plant count atau welcome message

---

## 📝 Lanjutan Dokumentasi

Karena keterbatasan ukuran, dokumentasi dilanjutkan ke file terpisah:

**[Continue: Part 2B - Remaining Components →](./02-building-ui-part-b.md)**

Di Part 2B kita akan menyelesaikan:
- PlantDetailsModal (modal lengkap dengan visualization)
- PlantSeedModal (modal untuk planting seeds)
- StatsSidebar (statistics & game info)
- Main page.tsx (menggabungkan semua components)

---

**[← Back: Part 1](./01-setup-contract.md)** | **[Continue: Part 2B →](./02-building-ui-part-b.md)**

---

**#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia**
