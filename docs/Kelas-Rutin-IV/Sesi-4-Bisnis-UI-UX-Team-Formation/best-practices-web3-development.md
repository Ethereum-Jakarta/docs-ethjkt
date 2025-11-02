# Best Practices untuk Web3 DApp Development

**Panduan Komprehensif untuk Build, Deploy, dan Scale**

---

## 📚 **Table of Contents**

1. [Smart Contract Development](#smart-contract-development)
2. [Frontend Development](#frontend-development)
3. [Web3 Integration](#web3-integration)
4. [UI/UX Design](#uiux-design)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Deployment & DevOps](#deployment--devops)
7. [Security](#security)
8. [Team Collaboration](#team-collaboration)
9. [Project Management](#project-management)
10. [Business & Pitching](#business--pitching)

---

## ⚙️ **Smart Contract Development**

### **1. Code Organization & Structure**

**Use Modular Architecture:**

```solidity
// ❌ BAD: Everything in one contract
contract MonolithicContract {
    // 500+ lines of code
    // Hard to test, hard to maintain
}

// ✅ GOOD: Separated concerns
contract PlantNFT is ERC721, Ownable, Pausable {
    // Focus on NFT logic only
}

contract GameMechanics {
    // Focus on game logic only
}

contract Rewards {
    // Focus on rewards distribution only
}
```

**Follow OpenZeppelin Patterns:**

```solidity
// ✅ Use battle-tested libraries
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlantNFT is ERC721, Ownable, Pausable, ReentrancyGuard {
    // Your custom logic here
}
```

---

### **2. Naming Conventions**

**Variables:**
```solidity
// ✅ Clear, descriptive names
uint256 public constant PLANT_COST = 0.001 ether;
uint256 public constant HARVEST_REWARD = 0.003 ether;
mapping(uint256 => PlantData) public plants;

// ❌ Unclear names
uint256 public c = 0.001 ether;
uint256 public r = 0.003 ether;
mapping(uint256 => PlantData) public p;
```

**Functions:**
```solidity
// ✅ Action verbs, clear intent
function mintPlant() external payable { }
function waterPlant(uint256 tokenId) external { }
function harvestPlant(uint256 tokenId) external { }

// ❌ Vague names
function doAction(uint256 id, uint256 type) external { }
```

---

### **3. Gas Optimization**

**Use `uint256` (not smaller uints unless packing):**
```solidity
// ❌ Doesn't save gas (except in structs)
uint8 public count;

// ✅ More gas efficient
uint256 public count;

// ✅ OK in structs (packing)
struct PlantData {
    uint8 stage;        // 1 byte
    uint8 waterLevel;   // 1 byte
    uint48 plantedAt;   // 6 bytes
    // Total: fits in 1 slot (32 bytes)
}
```

**Cache storage reads:**
```solidity
// ❌ Multiple storage reads
function harvest(uint256 tokenId) external {
    if (plants[tokenId].stage != 3) revert NotReady();
    if (plants[tokenId].waterLevel == 0) revert Dead();
    // Reading plants[tokenId] from storage each time = expensive!
}

// ✅ Cache in memory
function harvest(uint256 tokenId) external {
    PlantData memory plant = plants[tokenId]; // Read once
    if (plant.stage != 3) revert NotReady();
    if (plant.waterLevel == 0) revert Dead();
    // Subsequent reads from memory = cheap!
}
```

**Use custom errors (Solidity 0.8.4+):**
```solidity
// ❌ String errors = expensive
require(msg.value == PLANT_COST, "Incorrect payment amount");

// ✅ Custom errors = cheaper
error IncorrectPayment(uint256 sent, uint256 required);

if (msg.value != PLANT_COST) {
    revert IncorrectPayment(msg.value, PLANT_COST);
}
```

---

### **4. Events & Logging**

**Emit events for all state changes:**
```solidity
event PlantMinted(address indexed owner, uint256 indexed tokenId, uint256 timestamp);
event PlantWatered(uint256 indexed tokenId, uint256 newWaterLevel, uint256 timestamp);
event PlantHarvested(uint256 indexed tokenId, address indexed harvester, uint256 reward);

function mintPlant() external payable {
    // ... minting logic ...

    emit PlantMinted(msg.sender, tokenId, block.timestamp);
}
```

**Why?**
- Frontend can listen & update UI
- Indexers (The Graph) can track data
- Easier debugging
- Transparency for users

---

### **5. Access Control & Security**

**Use modifiers for common checks:**
```solidity
modifier onlyPlantOwner(uint256 tokenId) {
    if (ownerOf(tokenId) != msg.sender) revert NotOwner();
    _;
}

modifier plantExists(uint256 tokenId) {
    if (!_exists(tokenId)) revert PlantNotExist();
    _;
}

function waterPlant(uint256 tokenId)
    external
    plantExists(tokenId)
    onlyPlantOwner(tokenId)
{
    // Function logic
}
```

**Protect against reentrancy:**
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlantNFT is ReentrancyGuard {
    function harvest(uint256 tokenId) external nonReentrant {
        // ... logic ...

        // External call (potential reentrancy risk)
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success);
    }
}
```

---

### **6. Testing Best Practices**

**Write comprehensive tests:**
```javascript
// tests/PlantNFT.test.js
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PlantNFT", function () {
  let plantNFT, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const PlantNFT = await ethers.getContractFactory("PlantNFT");
    plantNFT = await PlantNFT.deploy();
  });

  describe("Minting", function () {
    it("Should mint plant with correct payment", async function () {
      const plantCost = await plantNFT.PLANT_COST();

      await expect(
        plantNFT.connect(user1).mintPlant({ value: plantCost })
      ).to.emit(plantNFT, "PlantMinted")
        .withArgs(user1.address, 0, anyValue);

      expect(await plantNFT.ownerOf(0)).to.equal(user1.address);
    });

    it("Should revert if payment incorrect", async function () {
      await expect(
        plantNFT.connect(user1).mintPlant({ value: ethers.parseEther("0.0005") })
      ).to.be.revertedWithCustomError(plantNFT, "IncorrectPayment");
    });
  });

  describe("Watering", function () {
    // ... more tests ...
  });

  // Test edge cases!
  describe("Edge Cases", function () {
    it("Should prevent watering non-existent plant", async function () {
      await expect(
        plantNFT.connect(user1).waterPlant(999)
      ).to.be.revertedWithCustomError(plantNFT, "PlantNotExist");
    });
  });
});
```

**Aim for 70%+ coverage:**
```bash
npx hardhat coverage
```

---

### **7. Contract Documentation**

**Use NatSpec comments:**
```solidity
/**
 * @title PlantNFT
 * @dev ERC-721 NFT representing virtual plants with growth mechanics
 * @notice Players mint plants, water them, and harvest rewards
 */
contract PlantNFT is ERC721, Ownable {

    /**
     * @notice Mint a new plant NFT
     * @dev Requires exact payment of PLANT_COST
     * @return tokenId The ID of newly minted plant
     */
    function mintPlant() external payable returns (uint256 tokenId) {
        // ...
    }

    /**
     * @notice Water a plant to maintain its health
     * @param tokenId The ID of the plant to water
     * @dev Only plant owner can water. Reverts if plant dead.
     */
    function waterPlant(uint256 tokenId) external {
        // ...
    }
}
```

---

## 🎨 **Frontend Development**

### **1. Project Structure**

**Organize by feature, not type:**
```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── garden/
│       └── page.tsx
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── garden/            # Feature-specific components
│   │   ├── PlantCard.tsx
│   │   ├── GardenGrid.tsx
│   │   └── PlantDetailsModal.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/                 # Custom React hooks
│   ├── useContract.ts
│   ├── usePlants.ts
│   └── useWallet.ts
├── lib/                   # Utilities & helpers
│   ├── contracts.ts       # Contract addresses & ABIs
│   ├── utils.ts
│   └── constants.ts
├── types/                 # TypeScript types
│   └── index.ts
└── styles/
    └── globals.css
```

---

### **2. TypeScript Best Practices**

**Define clear interfaces:**
```typescript
// types/index.ts

export interface Plant {
  tokenId: number;
  owner: string;
  stage: number;
  waterLevel: number;
  plantedAt: number;
  lastWatered: number;
}

export interface ContractConfig {
  address: `0x${string}`;
  abi: any[];
}

export enum PlantStage {
  SEED = 0,
  SPROUT = 1,
  GROWING = 2,
  BLOOMING = 3,
}
```

**Use type-safe contract interactions:**
```typescript
// lib/contracts.ts
import { PlantNFT__factory } from "./generated/typechain";

export const PLANT_NFT_ADDRESS = process.env.NEXT_PUBLIC_PLANT_NFT_ADDRESS as `0x${string}`;

// Generated TypeChain types provide autocomplete & type safety
export function getPlantNFTContract(signer: ethers.Signer) {
  return PlantNFT__factory.connect(PLANT_NFT_ADDRESS, signer);
}
```

**Generate TypeChain types from ABIs:**
```bash
# In hardhat project
npx hardhat typechain

# Copy generated types to frontend
cp -r typechain-types ../frontend/src/lib/generated/
```

---

### **3. Custom Hooks for Web3**

**Hook for contract reads:**
```typescript
// hooks/usePlants.ts
import { useReadContract } from 'wagmi';
import { PLANT_NFT_ABI, PLANT_NFT_ADDRESS } from '@/lib/contracts';

export function usePlants(address: `0x${string}` | undefined) {
  const { data: balance } = useReadContract({
    address: PLANT_NFT_ADDRESS,
    abi: PLANT_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: plants } = useReadContract({
    address: PLANT_NFT_ADDRESS,
    abi: PLANT_NFT_ABI,
    functionName: 'getPlantsOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  return {
    balance: balance ? Number(balance) : 0,
    plants: plants || [],
    isLoading: !plants,
  };
}
```

**Hook for contract writes:**
```typescript
// hooks/useWaterPlant.ts
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PLANT_NFT_ABI, PLANT_NFT_ADDRESS } from '@/lib/contracts';

export function useWaterPlant() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const waterPlant = (tokenId: number) => {
    writeContract({
      address: PLANT_NFT_ADDRESS,
      abi: PLANT_NFT_ABI,
      functionName: 'waterPlant',
      args: [BigInt(tokenId)],
    });
  };

  return {
    waterPlant,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}
```

---

### **4. Error Handling**

**Show user-friendly errors:**
```typescript
// components/WaterButton.tsx
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { toast } from 'sonner';

export function WaterButton({ tokenId }: { tokenId: number }) {
  const { waterPlant, isPending, isConfirming, isSuccess } = useWaterPlant();

  const handleWater = async () => {
    try {
      await waterPlant(tokenId);
      toast.success('Plant watered successfully! 💧');
    } catch (error: any) {
      // Parse contract errors
      if (error.message.includes('NotOwner')) {
        toast.error('You can only water your own plants');
      } else if (error.message.includes('AlreadyWatered')) {
        toast.error('Plant was recently watered. Wait a bit!');
      } else {
        toast.error('Failed to water plant. Please try again.');
      }
      console.error('Water error:', error);
    }
  };

  return (
    <button
      onClick={handleWater}
      disabled={isPending || isConfirming}
    >
      {isPending || isConfirming ? 'Watering...' : 'Water Plant'}
    </button>
  );
}
```

---

### **5. Loading States**

**Always show feedback:**
```typescript
// components/PlantCard.tsx
export function PlantCard({ tokenId }: { tokenId: number }) {
  const { data: plant, isLoading, error } = usePlant(tokenId);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48 bg-gray-200" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-red-500">
          Failed to load plant
        </CardContent>
      </Card>
    );
  }

  if (!plant) return null;

  return (
    <Card>
      <CardContent>
        {/* Plant details */}
      </CardContent>
    </Card>
  );
}
```

---

### **6. Real-time Updates**

**Use polling or event listeners:**
```typescript
// hooks/usePlants.ts (with auto-refresh)
import { useReadContract } from 'wagmi';

export function usePlants(address: `0x${string}` | undefined) {
  const { data: plants, refetch } = useReadContract({
    address: PLANT_NFT_ADDRESS,
    abi: PLANT_NFT_ABI,
    functionName: 'getPlantsOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    // Auto-refresh every 5 seconds
    refetchInterval: 5000,
  });

  return { plants, refetch };
}
```

**Listen to contract events:**
```typescript
// hooks/usePlantEvents.ts
import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';

export function usePlantEvents(onNewPlant: (tokenId: bigint) => void) {
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    const unwatch = publicClient.watchContractEvent({
      address: PLANT_NFT_ADDRESS,
      abi: PLANT_NFT_ABI,
      eventName: 'PlantMinted',
      onLogs: (logs) => {
        logs.forEach(log => {
          onNewPlant(log.args.tokenId);
        });
      },
    });

    return () => unwatch();
  }, [publicClient, onNewPlant]);
}
```

---

## 🔗 **Web3 Integration**

### **1. Wallet Connection (Panna SDK)**

**Setup Panna Provider:**
```typescript
// app/providers.tsx
'use client';

import { PannaProvider } from '@panna/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PannaProvider
      config={{
        chainId: 4202, // Lisk Sepolia
        apiKey: process.env.NEXT_PUBLIC_PANNA_API_KEY!,
      }}
    >
      {children}
    </PannaProvider>
  );
}
```

**Connect wallet:**
```typescript
// components/ConnectButton.tsx
import { usePanna } from '@panna/react';

export function ConnectButton() {
  const { address, connect, disconnect, isConnected } = usePanna();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return <button onClick={connect}>Connect Wallet</button>;
}
```

---

### **2. Gasless Transactions**

**With Panna SDK (automatic):**
```typescript
// No special code needed! Panna handles gasless automatically
const { writeContract } = useWriteContract();

writeContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'mintPlant',
  value: parseEther('0.001'),
});
// User signs, but doesn't pay gas → gasless! ⚡
```

---

### **3. Alternative: Standard Wallet (wagmi)**

**Setup wagmi:**
```typescript
// app/providers.tsx
'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'LiskGarden',
    chains: [liskSepolia],
    transports: {
      [liskSepolia.id]: http(process.env.NEXT_PUBLIC_LISK_RPC_URL),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## 🎨 **UI/UX Design**

### **1. Web3 UX Principles**

**Trust & Transparency:**
```typescript
// ✅ GOOD: Show transaction details before submission
<div className="transaction-preview">
  <h3>Transaction Summary</h3>
  <ul>
    <li>Action: Mint Plant</li>
    <li>Cost: 0.001 ETH</li>
    <li>Gas: Free (gasless!) ⚡</li>
    <li>You will receive: Plant NFT #123</li>
  </ul>
  <button onClick={confirm}>Confirm</button>
</div>

// ❌ BAD: No context, just "click here"
<button onClick={doSomething}>Submit</button>
```

**User Ownership:**
```typescript
// ✅ GOOD: Clear display of owned assets
<div className="my-plants">
  <h2>My Plants ({plants.length})</h2>
  <div className="grid">
    {plants.map(plant => (
      <PlantCard key={plant.tokenId} plant={plant} />
    ))}
  </div>

  <div className="ownership-proof">
    <p>You truly own these NFTs. They're in your wallet:</p>
    <code>{address}</code>
    <a href={`https://sepolia-blockscout.lisk.com/address/${address}`}>
      View on Explorer →
    </a>
  </div>
</div>
```

**Security:**
```typescript
// ✅ GOOD: Warning for critical actions
<ConfirmDialog
  title="Harvest Plant #42?"
  description="This will burn your plant NFT and send you 0.003 ETH. This action cannot be undone."
  confirmText="Yes, Harvest"
  cancelText="Cancel"
  variant="destructive"
  onConfirm={handleHarvest}
/>

// ❌ BAD: No warning, immediate action
<button onClick={burnPlant}>Harvest</button>
```

---

### **2. Onboarding Flow**

**Progressive Disclosure:**
```typescript
// components/OnboardingTour.tsx
import { useState } from 'react';

const steps = [
  {
    title: "Welcome to LiskGarden! 🌱",
    description: "Grow virtual plants as NFTs and earn rewards.",
  },
  {
    title: "Connect Your Wallet",
    description: "We'll use your wallet to save your plants on the blockchain. Don't worry, it's free!",
    action: "connect",
  },
  {
    title: "Plant Your First Seed",
    description: "Each seed costs 0.001 ETH. Your plant will grow automatically over 3 minutes.",
    highlight: "buy-seed-button",
  },
  {
    title: "Water Your Plants",
    description: "Keep your plants healthy by watering them. If water reaches 0%, they die!",
    highlight: "water-button",
  },
  {
    title: "Harvest for Rewards",
    description: "When your plant blooms, harvest it to earn 0.003 ETH (3x ROI!)",
    highlight: "harvest-button",
  },
];

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <h2>{step.title}</h2>
        <p>{step.description}</p>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)}>
              Back
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </button>
          ) : (
            <button onClick={onComplete}>Get Started!</button>
          )}

          <button variant="ghost" onClick={onComplete}>
            Skip Tour
          </button>
        </div>

        <div className="progress">
          {currentStep + 1} / {steps.length}
        </div>
      </div>
    </div>
  );
}
```

---

### **3. Design System**

**Define tokens:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          900: '#14532d',
        },
        // ... more colors
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
};
```

**Component variants (shadcn/ui pattern):**
```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export function Button({ variant, size, ...props }: VariantProps<typeof buttonVariants>) {
  return <button className={buttonVariants({ variant, size })} {...props} />;
}
```

---

### **4. Responsive Design**

**Mobile-first approach:**
```tsx
// components/GardenGrid.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {plants.map(plant => (
    <PlantCard key={plant.tokenId} plant={plant} />
  ))}
</div>
```

**Breakpoints:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

---

## ✅ **Testing & Quality Assurance**

### **1. Smart Contract Testing**

**Test coverage areas:**
- ✅ Happy paths (normal usage)
- ✅ Edge cases (boundary values)
- ✅ Access control (unauthorized access)
- ✅ Error conditions (reverts)
- ✅ Events emitted correctly
- ✅ State changes as expected

**Example comprehensive test:**
```javascript
describe("PlantNFT - Comprehensive", function () {
  // Setup
  beforeEach(async function () {
    // Deploy contracts, get signers, etc.
  });

  describe("Minting", function () {
    it("Should mint with correct payment");
    it("Should revert with incorrect payment");
    it("Should revert when paused");
    it("Should emit PlantMinted event");
    it("Should increment tokenId");
    it("Should set initial plant data correctly");
  });

  describe("Watering", function () {
    it("Should increase water level");
    it("Should revert if not owner");
    it("Should revert if plant doesn't exist");
    it("Should revert if recently watered");
    it("Should revert if already at max water");
    it("Should emit PlantWatered event");
  });

  describe("Growth Mechanics", function () {
    it("Should advance stage after time passes");
    it("Should decrease water over time");
    it("Should kill plant when water reaches 0");
    it("Should prevent watering dead plants");
  });

  describe("Harvesting", function () {
    it("Should harvest blooming plant");
    it("Should burn NFT on harvest");
    it("Should transfer reward to harvester");
    it("Should revert if not blooming");
    it("Should emit PlantHarvested event");
  });

  describe("Gas Optimization", function () {
    it("Should stay under gas limit for batch operations");
  });

  describe("Pause Functionality", function () {
    it("Owner should pause contract");
    it("Should block minting when paused");
    it("Should allow unpause");
  });
});
```

**Run tests:**
```bash
npx hardhat test
npx hardhat coverage
```

---

### **2. Frontend Testing**

**Unit tests (Jest + React Testing Library):**
```typescript
// __tests__/components/PlantCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PlantCard } from '@/components/PlantCard';

describe('PlantCard', () => {
  const mockPlant = {
    tokenId: 1,
    stage: 2,
    waterLevel: 80,
    plantedAt: Date.now() - 60000,
  };

  it('renders plant information', () => {
    render(<PlantCard plant={mockPlant} />);

    expect(screen.getByText('Plant #1')).toBeInTheDocument();
    expect(screen.getByText(/Growing/i)).toBeInTheDocument();
    expect(screen.getByText(/80%/i)).toBeInTheDocument();
  });

  it('shows water button for owner', () => {
    render(<PlantCard plant={mockPlant} isOwner={true} />);

    expect(screen.getByRole('button', { name: /water/i })).toBeInTheDocument();
  });

  it('hides water button for non-owner', () => {
    render(<PlantCard plant={mockPlant} isOwner={false} />);

    expect(screen.queryByRole('button', { name: /water/i })).not.toBeInTheDocument();
  });
});
```

---

### **3. Manual Testing Checklist**

**Before deployment:**
- [ ] Connect wallet (MetaMask, Rainbow, etc.)
- [ ] Test on correct network (Lisk Sepolia)
- [ ] Mint asset (happy path)
- [ ] Try invalid inputs (error handling)
- [ ] Test mobile responsiveness
- [ ] Check loading states
- [ ] Verify error messages user-friendly
- [ ] Test all user flows end-to-end
- [ ] Check on different browsers (Chrome, Firefox, Safari)
- [ ] Test with slow internet (throttling)

---

## 🚀 **Deployment & DevOps**

### **1. Smart Contract Deployment**

**Hardhat Ignition (v3):**
```typescript
// ignition/modules/PlantNFT.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PlantNFTModule", (m) => {
  const plantNFT = m.contract("PlantNFT", [
    "LiskGarden Plant",
    "PLANT",
  ]);

  return { plantNFT };
});
```

**Deploy:**
```bash
npx hardhat ignition deploy ./ignition/modules/PlantNFT.ts --network liskSepolia
```

**Verify on Blockscout:**
```bash
npx hardhat verify --network liskSepolia <CONTRACT_ADDRESS> "LiskGarden Plant" "PLANT"
```

---

### **2. Frontend Deployment (Vercel)**

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_LISK_RPC_URL": "@lisk-rpc-url",
    "NEXT_PUBLIC_PANNA_API_KEY": "@panna-api-key",
    "NEXT_PUBLIC_PLANT_NFT_ADDRESS": "@plant-nft-address"
  }
}
```

**Deploy steps:**
1. Push code to GitHub
2. Import repo in Vercel dashboard
3. Configure environment variables
4. Deploy!

**Or via CLI:**
```bash
npm install -g vercel
vercel --prod
```

---

### **3. Environment Variables**

**.env.example:**
```bash
# Network
NEXT_PUBLIC_CHAIN_ID=4202
NEXT_PUBLIC_LISK_RPC_URL=https://rpc.sepolia-api.lisk.com

# Contracts
NEXT_PUBLIC_PLANT_NFT_ADDRESS=0x...
NEXT_PUBLIC_GAME_ITEMS_ADDRESS=0x...

# Panna SDK (if using)
NEXT_PUBLIC_PANNA_API_KEY=your_api_key

# WalletConnect (if using)
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-...
```

**Security:**
- ✅ Commit `.env.example` (template)
- ❌ Never commit `.env` or `.env.local` (secrets)
- ✅ Use `NEXT_PUBLIC_` prefix for client-side vars
- ❌ Don't expose private keys or sensitive data

---

## 🔒 **Security**

### **1. Smart Contract Security**

**Common vulnerabilities & fixes:**

**Reentrancy:**
```solidity
// ❌ VULNERABLE
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] = 0; // ⚠️ State updated AFTER external call
}

// ✅ SECURE (Checks-Effects-Interactions)
function withdraw() external nonReentrant {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0; // ✅ State updated BEFORE external call

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

**Integer Overflow (Solidity versions below 0.8):**
```solidity
// Solidity 0.8+ has built-in overflow protection
// No need for SafeMath anymore!

uint256 public count;

function increment() external {
    count++; // ✅ Will revert on overflow (max uint256)
}
```

**Access Control:**
```solidity
// ❌ VULNERABLE (anyone can pause!)
function pause() external {
    _pause();
}

// ✅ SECURE (only owner)
function pause() external onlyOwner {
    _pause();
}
```

---

### **2. Frontend Security**

**Prevent XSS:**
```typescript
// ✅ React automatically escapes content
<div>{userInput}</div> // Safe

// ❌ dangerouslySetInnerHTML (use sparingly!)
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Unsafe!
```

**Validate user inputs:**
```typescript
// components/MintForm.tsx
function validateAmount(amount: string) {
  const parsed = parseFloat(amount);

  if (isNaN(parsed)) return "Please enter a valid number";
  if (parsed <= 0) return "Amount must be positive";
  if (parsed > 1000) return "Amount too large";

  return null; // Valid
}
```

**Secure API calls:**
```typescript
// ✅ GOOD: Validate responses
async function fetchPlantData(tokenId: number) {
  try {
    const response = await fetch(`/api/plants/${tokenId}`);

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();

    // Validate data shape
    if (!data.tokenId || !data.owner) {
      throw new Error('Invalid data format');
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

---

### **3. Private Key Management**

**NEVER:**
- ❌ Commit private keys to Git
- ❌ Store private keys in frontend code
- ❌ Share private keys (even on testnet!)
- ❌ Use same key for testnet & mainnet

**ALWAYS:**
- ✅ Use `.env` for local development (never commit!)
- ✅ Use secure secret management in production (Vercel env vars, AWS Secrets Manager)
- ✅ Use separate accounts for deployment vs user testing
- ✅ Educate users to protect their seed phrases

---

## 👥 **Team Collaboration**

### **1. Git Workflow**

**Branch strategy:**
```
main (production)
  └── develop (integration)
       ├── feature/smart-contracts
       ├── feature/frontend-ui
       ├── feature/wallet-integration
       └── fix/water-bug
```

**Workflow:**
```bash
# 1. Create feature branch
git checkout -b feature/plant-nft

# 2. Make changes, commit often
git add .
git commit -m "Add PlantNFT contract"

# 3. Push to remote
git push origin feature/plant-nft

# 4. Create Pull Request on GitHub
# 5. Review & merge to develop

# 6. When ready for deployment, merge develop → main
```

**Commit messages:**
```bash
# ✅ GOOD: Clear, descriptive
git commit -m "Add water function to PlantNFT contract"
git commit -m "Fix: Prevent watering dead plants"
git commit -m "Design: Improve PlantCard responsiveness"

# ❌ BAD: Vague
git commit -m "Update"
git commit -m "Fix stuff"
git commit -m "WIP"
```

---

### **2. Code Reviews**

**Pull Request template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Deployed to testnet

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Checklist
- [ ] Code follows project style guide
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No breaking changes (or documented if yes)
```

---

### **3. Communication**

**Daily Standup (async OK):**
```markdown
**Yesterday:**
- Completed PlantNFT smart contract
- Deployed to Lisk Sepolia

**Today:**
- Integrate contract with frontend
- Test minting flow

**Blockers:**
- None
```

**Tools:**
- **Code**: GitHub (PRs, issues)
- **Chat**: Discord, Telegram, Slack
- **Calls**: Google Meet, Zoom (for complex discussions)
- **Docs**: Notion, Google Docs (shared notes)
- **Tasks**: GitHub Projects, Trello, Linear

---

## 📊 **Project Management**

### **1. Task Breakdown**

**Use SMART goals:**
- **Specific**: "Implement water function" (not "work on contract")
- **Measurable**: "Complete 5 UI screens"
- **Achievable**: Realistic given time & skills
- **Relevant**: Aligns with project goals
- **Time-bound**: "Finish by Thursday"

**Example task board:**
```
To Do
├── Smart Contracts
│   ├── [ ] Implement ERC-721 PlantNFT
│   ├── [ ] Add growth mechanics
│   └── [ ] Write tests (80% coverage)
├── Frontend
│   ├── [ ] Setup Next.js project
│   ├── [ ] Design system (Tailwind config)
│   └── [ ] Connect wallet flow
└── Design
    ├── [ ] Wireframes (5 screens)
    └── [ ] High-fidelity mockups

In Progress
├── [IP] Deploy contracts to testnet
└── [IP] Build PlantCard component

Done
├── [✓] Project setup
├── [✓] Team formation
└── [✓] Idea brainstorming
```

---

### **2. Time Management (6 Days)**

**Sample schedule:**
```
Day 1 (Monday)
├── Morning: Design wireframes + contract architecture
├── Afternoon: Setup projects (Hardhat, Next.js)
└── Evening: Start contract implementation

Day 2 (Tuesday)
├── Morning: Finish contracts, write tests
├── Afternoon: Deploy to testnet, verify
└── Evening: Frontend setup + wallet integration

Day 3 (Wednesday)
├── Morning: Complete UI designs (Figma)
├── Afternoon: Integrate contracts with frontend
└── Evening: Implement core features (mint, water)

Day 4 (Thursday)
├── Morning: Feature completion
├── Afternoon: Bug fixes, edge cases
└── Evening: Internal testing

Day 5 (Friday)
├── Morning: Final polish, deploy frontend
├── Afternoon: Pitch deck, documentation
└── Evening: Rehearse pitch, final checks

Day 6 (Saturday)
└── DEMO DAY! 🎉
```

---

### **3. Risk Management**

**Identify risks early:**
```markdown
**Technical Risks:**
- Risk: Contract bug discovered late
  Mitigation: Test thoroughly on Day 2

- Risk: Frontend deployment fails
  Mitigation: Deploy early (Day 4), leave buffer

**Team Risks:**
- Risk: Team member unavailable
  Mitigation: Cross-train, document everything

**Scope Risks:**
- Risk: Over-ambitious features
  Mitigation: Define MVP, nice-to-haves separate
```

---

## 💼 **Business & Pitching**

### **1. Crafting Your Narrative**

**Problem-Solution-Impact:**
```markdown
**Problem (30 sec):**
"Meet Sarah, a casual gamer who spent $500 on in-game skins.
When the game shut down, she lost everything. This happens to
millions of gamers who spend $40B/year on virtual items they
don't truly own."

**Solution (60 sec):**
"LiskGarden lets players own their game assets as NFTs. Plant
seeds, grow them, and harvest for rewards - all stored on
blockchain. When the game evolves or even shuts down, players
still own their plants. Forever."

**Impact (30 sec):**
"We're reimagining gaming with true ownership. Players earn
while playing, and have full control over their assets. This
is the future of gaming."
```

---

### **2. Pitch Delivery Techniques**

**The Hook (first 30 seconds):**
```
❌ BAD: "Hi, we're Team X. We built a blockchain app using
Solidity and Next.js with Panna SDK..."
(Too technical, boring!)

✅ GOOD: "What if I told you that $40 billion worth of gaming
items disappear every year when games shut down? We're fixing
that with blockchain. I'm [name], and this is LiskGarden."
(Intriguing, relatable!)
```

**Show, Don't Tell:**
```
❌ BAD: "Our app has a user-friendly interface and seamless UX."
(Generic claims)

✅ GOOD: [Opens app] "Watch this: I'm buying a plant... notice
there's no gas fee popup... transaction confirmed in 2 seconds...
and my plant appears instantly. That's gasless Web3."
(Demonstrable proof!)
```

---

### **3. Handling Tough Questions**

**"Why blockchain?"**
```
✅ Answer: "Traditional games store items on company servers.
If the company decides to delete your account or shut down,
you lose everything. Blockchain gives players true ownership -
provable, permanent, and transferable. You can even sell your
plants to others."
```

**"What's your competitive advantage?"**
```
✅ Answer: "Unlike other Web3 games that require gas fees and
crypto knowledge, we use Panna SDK for gasless transactions.
This makes our game accessible to mainstream users, not just
crypto natives. Plus, our 3-minute gameplay loop is designed
for casual players."
```

**"How will you make money?"**
```
✅ Answer: "We take a 3% marketplace fee when players trade
plants with each other. We also sell premium seeds with unique
traits. Based on our projections, if we reach 10,000 active
players, that's $50K/month in sustainable revenue."
```

---

### **4. Building Credibility**

**Leverage your team:**
```
"Our smart contract developer [name] has 3 years of Solidity
experience and previously built [impressive project]. Our
designer [name] worked with [recognizable company]. Together,
we have the skills to execute this vision."
```

**Show traction (even small):**
```
"In just 6 days, we've:
- Deployed 3 smart contracts to Lisk Sepolia
- Built a fully functional frontend
- Implemented gasless transactions
- Achieved 80% test coverage

If we can ship this in 6 days, imagine what we can do with 6 months."
```

---

## 🎓 **Continuous Learning**

**After Demo Day, keep learning:**

### **Smart Contracts:**
- Advanced Solidity patterns (upgradeable contracts, proxy patterns)
- Security auditing (Slither, Mythril)
- Gas optimization techniques
- Layer 2 solutions (Optimism, Arbitrum)

### **Frontend:**
- Advanced React patterns (Server Components, Suspense)
- Performance optimization (code splitting, lazy loading)
- Accessibility (a11y best practices)
- Animation libraries (Framer Motion)

### **Web3:**
- The Graph (indexing & querying blockchain data)
- IPFS (decentralized storage)
- ENS (Ethereum Name Service)
- DAOs & governance

### **Business:**
- Tokenomics design
- Community building & growth
- Fundraising strategies
- Legal & compliance (especially in Indonesia)

---

## 📚 **Resources**

### **Documentation:**
- Solidity: https://docs.soliditylang.org
- Hardhat: https://hardhat.org/docs
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- wagmi: https://wagmi.sh
- Panna SDK: https://docs.panna.network

### **Tools:**
- Remix IDE: https://remix.ethereum.org
- OpenZeppelin Wizard: https://wizard.openzeppelin.com
- Etherscan (Blockscout for Lisk): https://sepolia-blockscout.lisk.com
- Faucet: https://sepolia-faucet.lisk.com

### **Learning:**
- CryptoZombies: https://cryptozombies.io
- Buildspace: https://buildspace.so
- Ethereum.org: https://ethereum.org/en/developers
- Smart Contract Programmer (YouTube): https://youtube.com/@smartcontractprogrammer

### **Community:**
- Ethereum Jakarta Discord: discord.gg/ethereumjakarta
- Lisk Community: https://lisk.com/community
- Developer DAO: https://developerdao.com

---

## 🎯 **Final Checklist**

**Smart Contracts:**
- [ ] Following OpenZeppelin patterns
- [ ] Custom errors instead of strings
- [ ] Events emitted for all state changes
- [ ] Access control implemented (Ownable, etc.)
- [ ] Tested (70%+ coverage)
- [ ] Deployed & verified on Lisk Sepolia
- [ ] NatSpec documentation

**Frontend:**
- [ ] TypeScript for type safety
- [ ] Custom hooks for Web3 logic
- [ ] Error handling & user feedback
- [ ] Loading states everywhere
- [ ] Responsive design (mobile-friendly)
- [ ] Deployed & live (Vercel/Netlify)
- [ ] Environment variables configured

**Design:**
- [ ] Web3 UX principles applied (Trust, Transparency, Ownership)
- [ ] Clear onboarding flow
- [ ] Consistent design system
- [ ] Accessible (good contrast, readable fonts)
- [ ] Professional & polished

**Documentation:**
- [ ] README.md complete
- [ ] Getting started instructions
- [ ] Contract addresses & links
- [ ] Live demo URL
- [ ] Team members listed

**Pitch:**
- [ ] 10-12 slides following framework
- [ ] Clear problem & solution
- [ ] Working demo (or backup video)
- [ ] Practiced delivery (5-7 minutes)
- [ ] Prepared for Q&A

---

**You've got this! Now go build something amazing! 🚀**

---

*Best Practices Guide untuk Kelas Rutin Batch IV - Ethereum Jakarta x Lisk*
*Last updated: 2 November 2025*
