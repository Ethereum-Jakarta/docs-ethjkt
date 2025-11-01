---
id: part-2b-building-ui
title: "Part 2B: Building UI Components (Lanjutan)"
sidebar_label: "Part 2B: Building UI (Lanjutan)"
---

# Part 2B: Building UI Components (Lanjutan)

**Module 3 (continued)** | Building Complete Garden UI - Part 2

---

## 📋 Overview

Ini adalah lanjutan dari Part 2A. Di sini kita akan menyelesaikan semua UI components:

**Yang akan dibuat:**
- ✅ PlantDetailsModal - Modal lengkap untuk plant actions dengan visualisasi
- ✅ PlantSeedModal - Modal untuk plant new seed
- ✅ StatsSidebar - Sidebar dengan statistics & game info
- ✅ Main Page (app/page.tsx) - Menggabungkan semua components

---

## Section C: Plant Modals (60 menit)

### Step 5: Create PlantDetailsModal Component

Modal lengkap dengan plant visualization, growth progress, water level, dan action buttons.

**Create**: `components/plant-details-modal.tsx`

```typescript
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

**💡 Features:**
- **Plant Visualization** - Animated background dengan stage-specific decorations
- **Real-time Progress** - Growth & water level dengan client-side calculation
- **Stage Sync Warning** - Deteksi kalau blockchain state out of sync
- **Dynamic Actions** - Water atau harvest button tergantung plant state
- **Critical Warnings** - Alert kalau water level critical
- **Beautiful Animations** - Smooth transitions & floating effects

---

### Step 6: Create PlantSeedModal Component

Modal untuk plant new seed dengan cost preview & game info.

**Create**: `components/plant-seed-modal.tsx`

```typescript
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Coins } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { PLANT_PRICE } from "@/types/contracts"

interface PlantSeedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PlantSeedModal({ isOpen, onClose }: PlantSeedModalProps) {
  const { plantSeed, loading } = usePlants()

  const handlePlant = async () => {
    await plantSeed()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Plant a New Seed
          </DialogTitle>
          <DialogDescription>Plant a seed and watch it grow!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seed card */}
          <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="font-bold text-xl text-foreground mb-2">Garden Seed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A magical seed that grows through 4 stages over time
              </p>

              {/* Growth stages preview */}
              <div className="flex justify-center gap-2 mb-4">
                <span className="text-2xl" title="Seed">🌱</span>
                <span className="text-xl text-muted-foreground">→</span>
                <span className="text-2xl" title="Sprout">🌿</span>
                <span className="text-xl text-muted-foreground">→</span>
                <span className="text-2xl" title="Growing">🪴</span>
                <span className="text-xl text-muted-foreground">→</span>
                <span className="text-2xl" title="Blooming">🌸</span>
              </div>

              {/* Price */}
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Cost</p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-accent">
                  <Coins className="w-5 h-5" />
                  {PLANT_PRICE} ETH
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Harvest reward: 0.003 ETH (3x profit!)
                </p>
              </div>
            </div>
          </Card>

          {/* Info card */}
          <Card className="p-3 bg-muted/30 border-primary/20">
            <p className="text-xs text-muted-foreground">
              💧 <strong>Watering is FREE</strong> - no cost, just gas!
              <br />
              ⏱️ <strong>Growth time</strong>: 3 minutes from seed to blooming
              <br />
              💰 <strong>Profit</strong>: Earn 3x your investment when you harvest
              <br />
              ⚠️ <strong>Keep watering</strong>: Plant dies if water reaches 0%
            </p>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlant}
              disabled={loading}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Planting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
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

**💡 Features:**
- **Growth Preview** - Visual representation 4 growth stages
- **Cost Display** - Clear pricing & profit information
- **Game Mechanics** - Quick tips untuk new players
- **Loading States** - Disabled buttons during transactions

---

## Section D: Statistics Sidebar (30 menit)

### Step 7: Create StatsSidebar Component

Sidebar dengan garden statistics, wallet info, dan game mechanics information.

**Create**: `components/stats-sidebar.tsx`

```typescript
"use client"

import { Card } from "@/components/ui/card"
import { Leaf, Sparkles, Coins, Skull, Droplets, Clock } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { GrowthStage } from "@/types/contracts"
import {
  PLANT_PRICE,
  HARVEST_REWARD,
  STAGE_DURATION,
  WATER_DEPLETION_TIME,
  WATER_DEPLETION_RATE
} from "@/types/contracts"

interface StatsSidebarProps {
  selectedPlantId: bigint | null
}

export default function StatsSidebar({ selectedPlantId }: StatsSidebarProps) {
  const { plants } = usePlants()
  const { isConnected, address } = useContract()

  const bloomingPlants = plants.filter((p) => p.stage === GrowthStage.BLOOMING && !p.isDead).length
  const growingPlants = plants.filter((p) => p.stage !== GrowthStage.BLOOMING && !p.isDead).length
  const deadPlants = plants.filter((p) => p.isDead).length
  const alivePlants = plants.filter((p) => !p.isDead).length

  return (
    <div className="space-y-4 sticky top-24">
      {/* Garden Stats */}
      <Card className="p-4 bg-gradient-to-br from-card to-card/50 border border-border animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Garden Stats
        </h3>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-primary" />
                Total Plants
              </span>
              <span className="font-semibold text-foreground">{plants.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-green-500" />
                Alive
              </span>
              <span className="font-semibold text-foreground">{alivePlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Blooming
              </span>
              <span className="font-semibold text-foreground">{bloomingPlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-emerald-500" />
                Growing
              </span>
              <span className="font-semibold text-foreground">{growingPlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Skull className="w-4 h-4 text-gray-500" />
                Dead
              </span>
              <span className="font-semibold text-foreground">{deadPlants}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Connect wallet to view stats</p>
        )}
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card
          className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Wallet
          </h3>
          <div className="space-y-2">
            <div className="p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Info */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Game Info
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Plant Cost</p>
            <p className="font-semibold text-foreground">{PLANT_PRICE} ETH</p>
          </div>
          <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Harvest Reward</p>
            <p className="font-semibold text-foreground">{HARVEST_REWARD} ETH</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Watering Cost</p>
            <p className="font-semibold text-primary">FREE (gas only)</p>
          </div>
        </div>
      </Card>

      {/* How to Play */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-semibold text-foreground mb-3">How to Play</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>1. Plant a seed (costs {PLANT_PRICE} ETH)</p>
          <p>2. Water it regularly (FREE!)</p>
          <p>3. Wait 3 minutes for full growth</p>
          <p>4. Harvest for {HARVEST_REWARD} ETH reward</p>
          <p className="text-primary font-semibold pt-2">💰 3x profit on every harvest!</p>
          <p className="text-red-500 font-semibold pt-2">⚠️ Keep water above 0% or plant dies!</p>
        </div>
      </Card>

      {/* Game Mechanics */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Growth & Water
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Stage Duration</p>
            <p className="font-semibold text-foreground">{STAGE_DURATION} seconds each</p>
          </div>
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-muted-foreground mb-1">Water Depletion</p>
            <p className="font-semibold text-foreground">{WATER_DEPLETION_RATE}% every {WATER_DEPLETION_TIME}s</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

**💡 Features:**
- **Garden Statistics** - Real-time count untuk plants by status
- **Wallet Information** - Display connected wallet address
- **Game Economics** - Plant cost, harvest reward, watering cost
- **How to Play** - Step-by-step game instructions
- **Game Mechanics** - Growth & water depletion timing info
- **Staggered Animations** - Cards animate dengan delay untuk smooth effect

---

## Section E: Main Page (20 menit)

### Step 8: Create Main Page (app/page.tsx)

Main application page yang menggabungkan semua components.

**Update**: `app/page.tsx`

```typescript
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

**💡 Penjelasan:**
- **State Management** - Local state untuk selected plant & modal visibility
- **usePlantStageScheduler** - Auto-scheduler running di background
- **Layout** - Flex layout dengan main content (flex-1) & sidebar (fixed width)
- **Modal Control** - PlantDetailsModal & PlantSeedModal dengan controlled state
- **Plant Selection** - Find selected plant dari plants array

---

## 🎉 Testing Complete Application

Sekarang semua components sudah selesai! Mari test aplikasi:

### 1. Start Development Server

```bash
yarn dev
```

### 2. Test Flow Lengkap

**A. Wallet Connection:**
- Buka http://localhost:3000
- Click "Login" button di header
- Connect wallet (MetaMask atau provider lainnya)
- Pastikan network: Lisk Sepolia (Chain ID 4202)

**B. Plant First Seed:**
- Click "Plant Seed" button
- Modal akan muncul dengan seed preview
- Click "Plant Seed" untuk confirm
- Approve transaction di wallet (bayar 0.001 ETH)
- Wait transaction confirm
- Plant card baru akan muncul di grid!

**C. Watch Plant Grow:**
- Plant dimulai sebagai 🌱 Seed
- Background scheduler akan auto-update stage setiap 60 detik
- Stage progression: Seed → Sprout → Growing → Blooming
- Total growth time: 3 menit

**D. Water Your Plant:**
- Click plant card untuk open details modal
- Lihat water level berkurang setiap 30 detik (-20%)
- Click "Water Plant" button (GRATIS via Panna SDK!)
- Water level akan kembali ke 100%
- Modal akan close otomatis setelah success

**E. Harvest Rewards:**
- Wait hingga plant mencapai 🌸 Blooming stage
- Click plant card
- Modal akan show "Ready to Harvest!"
- Click "Harvest Plant" button
- Receive 0.003 ETH reward (3x profit!)

**F. Monitor Statistics:**
- Sidebar shows real-time stats:
  - Total plants
  - Alive/dead count
  - Blooming plants
  - Game mechanics info

---

## 🔍 Component Architecture Review

**Component Hierarchy:**

```
app/page.tsx (Main)
├── GardenHeader
│   └── LoginButton (dari Panna SDK)
├── GardenGrid
│   └── PlantCard (map dari plants array)
├── StatsSidebar
│   ├── Garden Stats
│   ├── Wallet Info
│   ├── Game Info
│   ├── How to Play
│   └── Game Mechanics
├── PlantDetailsModal (conditional)
│   ├── Plant Visualization
│   ├── Growth Progress
│   ├── Water Level
│   ├── Stage Sync Warning
│   └── Action Buttons (Water/Harvest)
└── PlantSeedModal (conditional)
    ├── Seed Preview
    ├── Growth Stages
    ├── Cost Display
    └── Game Tips
```

**State Management:**

```typescript
// Global State (via hooks)
- usePlants() → plants, loading, plantSeed(), waterPlant(), harvestPlant()
- useContract() → client, account, isConnected, address
- usePlantStageScheduler() → isRunning

// Local State (page.tsx)
- selectedPlantId → untuk PlantDetailsModal
- showPlantSeedModal → untuk PlantSeedModal control
```

**Data Flow:**

```
1. User connects wallet → Panna SDK (automatic gasless setup!)
2. usePlants hook fetches data → blockchain via Thirdweb
3. Auto-refresh setiap 5 detik → real-time updates
4. Background scheduler runs setiap 60 detik → auto-update stages
5. User actions (water/harvest) → gasless transactions via Panna
6. UI updates automatically → React state + hooks
```

---

## ✅ Checklist Completion

**All UI Components Complete:**
- ✅ GardenHeader dengan Panna SDK LoginButton
- ✅ usePlantStageScheduler untuk auto-sync
- ✅ PlantCard dengan real-time water calculation
- ✅ GardenGrid dengan loading, empty, dan data states
- ✅ PlantDetailsModal dengan visualization & actions
- ✅ PlantSeedModal untuk planting
- ✅ StatsSidebar dengan complete game info
- ✅ Main page.tsx yang menggabungkan semua

**All Features Working:**
- ✅ Wallet connection (gasless!)
- ✅ Plant seeds (payable transaction)
- ✅ Water plants (free gasless transaction)
- ✅ Harvest rewards (receive ETH)
- ✅ Auto-refresh data setiap 5 detik
- ✅ Auto-update stages setiap 60 detik
- ✅ Real-time water depletion calculation
- ✅ Stage sync detection & manual update
- ✅ Dark/light mode support
- ✅ Responsive layout
- ✅ Loading states & error handling

---

## 🎯 Next Steps

Sekarang aplikasi sudah complete! Lanjut ke **Part 3** untuk deployment:

**[Continue: Part 3 - Deployment & Production →](./03-deployment.md)**

Di Part 3 kita akan:
- Build production-ready application
- Setup environment variables
- Deploy ke Vercel
- Testing production deployment
- Setup custom domain (optional)

---

**Congratulations! 🎉**

Anda sudah berhasil build COMPLETE LiskGarden DApp dengan:
- Modern React 19 & Next.js 15
- Gasless transactions via Panna SDK
- Real-time blockchain interactions
- Beautiful UI dengan animations
- Auto-refresh & auto-sync features

**Keep building! 🚀**

---

**[← Back: Part 2A](./02-building-ui-COMPLETE.md)** | **[Next: Part 3 - Deployment →](./03-deployment.md)**

---

**#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia**
