# Session 5: Branching Out - ERC Standards & Modular Design

**Session Date**: November 5, 2025 | 19:30 - 21:00 (GMT+7)

Transform your garden into a tokenized ecosystem! Learn ERC standards by building fungible tokens, NFTs, and staking systems that extend LiskGarden.

**By**: ETH JKT

---

## Learning Path

```
Understanding Token Standards
    ↓
ERC-20: Garden Tokens ($SEED)
    ↓
ERC-721: Plant NFTs (Unique Plants)
    ↓
ERC-1155: Multi-Token (Seeds, Tools, Fertilizers)
    ↓
Modular Architecture: Plugin System
    ↓
Advanced Patterns: Staking & Rewards
    ↓
Composability: Connecting Everything
```

---

## Prerequisites

✅ **From Previous Sessions**:
- [x] Session 3: Built LiskGarden smart contract
- [x] Session 4: Created DApp frontend (optional for this session)
- [x] Understanding of Solidity basics (mappings, structs, modifiers)
- [x] Deployed LiskGarden contract on Lisk Sepolia

✅ **Technical Requirements**:
- [x] Remix IDE or Hardhat environment
- [x] MetaMask with Lisk Sepolia ETH
- [x] Your deployed LiskGarden address

---

## Part 1: Understanding Token Standards

### What are ERCs?

**ERC = Ethereum Request for Comment** - Community-agreed standards for smart contracts

**Why Standards Matter**:

| Without Standards | With Standards |
|------------------|----------------|
| ❌ Every token works differently | ✅ Universal compatibility |
| ❌ Wallets can't support all tokens | ✅ Works with all wallets |
| ❌ No interoperability | ✅ Composable DeFi |
| ❌ Reinvent the wheel | ✅ Battle-tested code |

### Token Types Overview

```
┌─────────────────────────────────────────────────────┐
│                   ERC STANDARDS                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ERC-20 (Fungible Tokens)                          │
│  ├── All tokens identical                          │
│  ├── Divisible (18 decimals)                       │
│  └── Examples: USDC, DAI, LINK                     │
│                                                     │
│  ERC-721 (Non-Fungible Tokens)                     │
│  ├── Each token unique                             │
│  ├── Not divisible                                 │
│  └── Examples: CryptoPunks, BAYC                   │
│                                                     │
│  ERC-1155 (Multi-Token)                            │
│  ├── Both fungible & non-fungible                  │
│  ├── Gas efficient batch operations                │
│  └── Examples: Gaming items, Enjin                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Our Token Ecosystem

In this session, we'll build:

1. **$SEED Token (ERC-20)** - Garden currency
2. **PlantNFT (ERC-721)** - Unique plant collectibles  
3. **GardenItems (ERC-1155)** - Tools, seeds, fertilizers
4. **Staking System** - Earn $SEED by staking PlantNFTs
5. **Marketplace** - Trade with $SEED tokens

---

## Part 2: ERC-20 - Garden Token ($SEED)

### Understanding ERC-20

**What it is**: Standard for fungible tokens (all tokens are identical)

**Core Functions**:

| Function | Purpose | Who Calls |
|----------|---------|-----------|
| `transfer()` | Send tokens to address | Token holder |
| `approve()` | Allow spender to use tokens | Token holder |
| `transferFrom()` | Move approved tokens | Approved spender |
| `balanceOf()` | Check token balance | Anyone |
| `allowance()` | Check approved amount | Anyone |

### Step 1: Basic $SEED Token

Create `SeedToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// OpenZeppelin's battle-tested ERC-20 implementation
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SeedToken is ERC20, Ownable {
    // Constants
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    uint256 public constant REWARD_RATE = 10 * 10**18; // 10 SEED per action

    // Track rewards given
    mapping(address => uint256) public totalRewardsEarned;

    // Events
    event RewardGiven(address indexed user, uint256 amount, string reason);

    constructor() ERC20("Garden Seed", "SEED") Ownable(msg.sender) {
        // Mint initial supply to contract deployer
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // Mint new tokens (only owner - for rewards)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Burn tokens (anyone can burn their own)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Reward user for garden actions
    function rewardUser(address user, string memory reason) external onlyOwner {
        _mint(user, REWARD_RATE);
        totalRewardsEarned[user] += REWARD_RATE;
        emit RewardGiven(user, REWARD_RATE, reason);
    }

    // Get token details
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply()
        );
    }
}
```

**Explanation:**

**Inheritance & Imports:**
- `ERC20` - OpenZeppelin's standard token contract (handles all basic token functions)
- `Ownable` - Adds owner-only functions (only deployer can mint rewards)
- `import` - Reuse battle-tested code instead of writing from scratch

**Constants:**
- `INITIAL_SUPPLY = 1000000 * 10**18` - Creates 1 million tokens (with 18 decimals)
- `REWARD_RATE = 10 * 10**18` - Each reward gives 10 SEED tokens
- `constant` - Values that never change (saves gas!)

**State Variables:**
- `mapping(address => uint256) totalRewardsEarned` - Tracks lifetime rewards per user
- Like a dictionary: user address → total rewards earned

**Constructor:**
- `ERC20("Garden Seed", "SEED")` - Sets token name and symbol
- `Ownable(msg.sender)` - Makes deployer the owner
- `_mint(msg.sender, INITIAL_SUPPLY)` - Creates all tokens and gives to deployer

**Functions:**
- `mint()` - Owner creates new tokens (for rewards)
- `burn()` - Anyone destroys their own tokens (reduces supply)
- `rewardUser()` - Owner gives rewards to users
- `getTokenInfo()` - Anyone can check token details (FREE - it's a view function!)

**How It Works:**
1. Deploy → You get 1 million SEED tokens
2. Call `rewardUser("0xUser", "planted seed")` → User gets 10 SEED
3. User calls `burn(5 * 10**18)` → Destroys 5 of their tokens
4. Call `balanceOf(address)` → Check anyone's balance

**Try it:**
1. Deploy the contract
2. Call `getTokenInfo()` → See name="Garden Seed", symbol="SEED"
3. Check your balance → 1,000,000 tokens!
4. Call `rewardUser()` with a friend's address
5. Check their balance → 10 tokens!

### Step 2: Advanced $SEED with Vesting

Let's add token vesting for team/investors:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SeedTokenAdvanced is ERC20, Ownable {
    // Vesting structure
    struct VestingSchedule {
        uint256 totalAmount;      // Total tokens to vest
        uint256 releasedAmount;   // Tokens already claimed
        uint256 startTime;        // When vesting started
        uint256 duration;         // Total vesting period
        uint256 cliffDuration;    // Lock period before any release
    }
    
    // User vesting schedules
    mapping(address => VestingSchedule) public vestingSchedules;
    
    // Token economics
    uint256 public constant MAX_SUPPLY = 100000000 * 10**18; // 100M max
    uint256 public constant TEAM_ALLOCATION = 20000000 * 10**18; // 20M for team
    uint256 public constant REWARDS_ALLOCATION = 30000000 * 10**18; // 30M for rewards
    uint256 public constant PUBLIC_SALE = 50000000 * 10**18; // 50M public
    
    uint256 public rewardsDistributed;
    
    constructor() ERC20("Garden Seed", "SEED") Ownable(msg.sender) {
        _mint(msg.sender, PUBLIC_SALE);
    }
    
    // Create vesting schedule for team/investors
    function createVesting(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliffDuration
    ) external onlyOwner {
        require(vestingSchedules[beneficiary].totalAmount == 0, "Vesting exists");
        require(amount <= TEAM_ALLOCATION, "Exceeds team allocation");
        
        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: duration,
            cliffDuration: cliffDuration
        });
        
        _mint(address(this), amount);
    }
    
    // Calculate vested amount
    function calculateVestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        if (schedule.totalAmount == 0) return 0;
        
        // Still in cliff period
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }
        
        // After vesting period - all tokens vested
        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }
        
        // During vesting - linear release
        uint256 timeElapsed = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeElapsed) / schedule.duration;
    }
    
    // Claim vested tokens
    function claimVestedTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAmount > 0, "No vesting schedule");
        
        uint256 vestedAmount = calculateVestedAmount(msg.sender);
        uint256 claimable = vestedAmount - schedule.releasedAmount;
        
        require(claimable > 0, "Nothing to claim");
        
        schedule.releasedAmount += claimable;
        _transfer(address(this), msg.sender, claimable);
    }
}
```

**Explanation:**

**Vesting Structure:**
- `totalAmount` - How many tokens will vest over time
- `releasedAmount` - How many already claimed
- `startTime` - When vesting began (timestamp)
- `duration` - Total vesting period (e.g., 365 days)
- `cliffDuration` - Initial lock period (e.g., 90 days)

**Token Economics:**
- `MAX_SUPPLY` - Can never create more than 100M tokens
- `TEAM_ALLOCATION` - 20M reserved for team (vested)
- `REWARDS_ALLOCATION` - 30M for game rewards
- `PUBLIC_SALE` - 50M for immediate distribution

**Vesting Logic:**
1. **Cliff Period**: No tokens available (e.g., first 3 months)
2. **Linear Release**: Tokens unlock gradually over time
3. **Full Vesting**: All tokens available after duration ends

**How Vesting Works:**
```
Day 0:    Create vesting (1000 tokens, 365 days, 90 day cliff)
Day 1-89: Can't claim anything (cliff period)
Day 90:   Can claim ~247 tokens (90/365 * 1000)
Day 180:  Can claim ~493 tokens total
Day 365:  Can claim all 1000 tokens
```

**Try it:**
1. Deploy contract → You get 50M tokens (public sale)
2. Call `createVesting("0xTeamMember", 1000000, 31536000, 7776000)`
   - 1M tokens, 365 days vesting, 90 days cliff
3. Team member waits 90 days
4. Call `calculateVestedAmount()` → See available tokens
5. Call `claimVestedTokens()` → Receive unlocked tokens

---

## Part 3: ERC-721 - Plant NFTs

### Understanding ERC-721

**What it is**: Standard for non-fungible tokens (each token is unique)

**Core Functions**:

| Function | Purpose |
|----------|---------|
| `ownerOf()` | Who owns token #X |
| `transferFrom()` | Transfer ownership |
| `approve()` | Approve one token |
| `setApprovalForAll()` | Approve all tokens |
| `tokenURI()` | Metadata location |

### Step 1: Basic Plant NFT

Create `PlantNFT.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract PlantNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 internal _tokenIdCounter;

    // Plant attributes
    struct PlantAttributes {
        string species;      // "Rose", "Tulip", "Cactus"
        uint256 rarity;      // 1=Common, 2=Rare, 3=Epic, 4=Legendary
        uint256 growthRate;  // Growth speed multiplier (100 = 1x)
        uint256 yieldBonus;  // Harvest reward multiplier (100 = 1x)
        uint256 birthTime;   // When minted
        uint256 generation;  // Breeding generation
        string imageURI;     // IPFS or external image URL
    }

    // Mapping from token ID to attributes
    mapping(uint256 => PlantAttributes) public plantAttributes;

    // Rarity probabilities (out of 100)
    uint256[] public rarityWeights = [60, 25, 10, 5]; // Common, Rare, Epic, Legendary

    // Events
    event PlantMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string species,
        uint256 rarity
    );

    constructor() ERC721("Garden Plant NFT", "PLANT") Ownable(msg.sender) {}

    // Mint new plant NFT with image URI
    function mintPlant(address to, string memory species, string memory imageURI) external returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        // Random rarity (simplified - use Chainlink VRF in production!)
        uint256 rarity = _calculateRarity(newTokenId);

        // Set attributes based on rarity
        uint256 growthRate = 100 + (rarity - 1) * 25; // 100, 125, 150, 175
        uint256 yieldBonus = 100 + (rarity - 1) * 50; // 100, 150, 200, 250

        plantAttributes[newTokenId] = PlantAttributes({
            species: species,
            rarity: rarity,
            growthRate: growthRate,
            yieldBonus: yieldBonus,
            birthTime: block.timestamp,
            generation: 1,
            imageURI: imageURI
        });

        _safeMint(to, newTokenId);

        emit PlantMinted(to, newTokenId, species, rarity);

        return newTokenId;
    }

    // Simple pseudo-random rarity (NOT SECURE - use VRF!)
    function _calculateRarity(uint256 tokenId) private view returns (uint256) {
        uint256 rand = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            tokenId
        ))) % 100;

        uint256 cumulative = 0;
        for (uint256 i = 0; i < rarityWeights.length; i++) {
            cumulative += rarityWeights[i];
            if (rand < cumulative) {
                return i + 1; // Rarity 1-4
            }
        }
        return 1; // Default common
    }

    // Get plant details
    function getPlantDetails(uint256 tokenId) external view returns (
        string memory species,
        uint256 rarity,
        uint256 growthRate,
        uint256 yieldBonus,
        uint256 age
    ) {
        require(_ownerOf(tokenId) != address(0), "Plant doesn't exist");

        PlantAttributes memory attr = plantAttributes[tokenId];
        uint256 plantAge = block.timestamp - attr.birthTime;

        return (
            attr.species,
            attr.rarity,
            attr.growthRate,
            attr.yieldBonus,
            plantAge
        );
    }

    // Get current token ID counter
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // Generate dynamic tokenURI with metadata
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "Plant doesn't exist");

        PlantAttributes memory attr = plantAttributes[tokenId];

        // Rarity names
        string memory rarityName = _getRarityName(attr.rarity);

        // Build JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name":"',
            attr.species,
            ' #',
            Strings.toString(tokenId),
            '","description":"A ',
            rarityName,
            ' plant NFT from the Garden Ecosystem","image":"',
            attr.imageURI,
            '","attributes":[',
            '{"trait_type":"Species","value":"',
            attr.species,
            '"},{"trait_type":"Rarity","value":"',
            rarityName,
            '"},{"trait_type":"Growth Rate","value":',
            Strings.toString(attr.growthRate),
            '},{"trait_type":"Yield Bonus","value":',
            Strings.toString(attr.yieldBonus),
            '},{"trait_type":"Generation","value":',
            Strings.toString(attr.generation),
            '},{"trait_type":"Birth Time","value":',
            Strings.toString(attr.birthTime),
            '}]}'
        ));

        // Encode to base64
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(json))
        ));
    }

    // Helper function to get rarity name
    function _getRarityName(uint256 rarity) private pure returns (string memory) {
        if (rarity == 1) return "Common";
        if (rarity == 2) return "Rare";
        if (rarity == 3) return "Epic";
        if (rarity == 4) return "Legendary";
        return "Unknown";
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

**Explanation:**

**NFT Libraries:**
- `ERC721` - Standard NFT functionality (ownership, transfers)
- `ERC721URIStorage` - Store metadata URIs for each token
- `Strings` - Convert uint256 to string for JSON metadata
- `Base64` - Encode JSON metadata as data URI

**Plant Attributes Struct:**
- `species` - Type of plant ("Rose", "Tulip", etc.)
- `rarity` - 1=Common (60%), 2=Rare (25%), 3=Epic (10%), 4=Legendary (5%)
- `growthRate` - How fast it grows (100=normal, 175=75% faster)
- `yieldBonus` - Harvest multiplier (250=2.5x rewards)
- `birthTime` - When NFT was created
- `generation` - 1 for original, higher for bred plants
- `imageURI` - IPFS or external URL for the plant image

**Dynamic TokenURI Generation:**
The `tokenURI()` function generates metadata on-chain:
- Creates JSON with name, description, image, and attributes
- Uses Base64 encoding for data URI format
- Returns `data:application/json;base64,{encoded_metadata}`
- Marketplaces (OpenSea, Rarible) automatically display the data

**Metadata Structure:**
```json
{
  "name": "Rose #1",
  "description": "A Rare plant NFT from the Garden Ecosystem",
  "image": "ipfs://QmXxx.../rose.png",
  "attributes": [
    {"trait_type": "Species", "value": "Rose"},
    {"trait_type": "Rarity", "value": "Rare"},
    {"trait_type": "Growth Rate", "value": 125},
    {"trait_type": "Yield Bonus", "value": 150},
    {"trait_type": "Generation", "value": 1},
    {"trait_type": "Birth Time", "value": 1730000000}
  ]
}
```

**Rarity System:**
```
Random 0-59:   Common (60% chance)
Random 60-84:  Rare (25% chance)
Random 85-94:  Epic (10% chance)
Random 95-99:  Legendary (5% chance)
```

**Bonuses by Rarity:**
| Rarity | Growth Rate | Yield Bonus |
|--------|-------------|-------------|
| Common | 100% (1x) | 100% (1x) |
| Rare | 125% (1.25x) | 150% (1.5x) |
| Epic | 150% (1.5x) | 200% (2x) |
| Legendary | 175% (1.75x) | 250% (2.5x) |

**How It Works:**
1. Call `mintPlant("0xUser", "Rose", "ipfs://QmXxx.../rose.png")` → Creates NFT #1
2. Random number determines rarity (60% common, 5% legendary)
3. Rarity determines growth and yield bonuses
4. Image URI stored with attributes
5. NFT minted to user with all attributes stored
6. Call `tokenURI(1)` → Returns full metadata with image

**Try it:**
1. Deploy contract
2. Upload plant image to IPFS (use Pinata or NFT.storage) OR use these example plant images:
   - Common plant: `https://cdn.artstation.com/p/thumbnails/000/870/176/thumb.jpg`
   - Rare plant: `https://cdn.artstation.com/p/thumbnails/000/870/173/thumb.jpg`
   - Epic plant: `https://cdn.artstation.com/p/thumbnails/000/870/168/thumb.jpg`
   - Legendary plant: `https://cdn.artstation.com/p/thumbnails/000/870/175/thumb.jpg`
3. Call `mintPlant(your_address, "Rose", "https://cdn.artstation.com/p/thumbnails/000/870/176/thumb.jpg")`
4. Check `plantAttributes(1)` → See all stats
5. Call `tokenURI(1)` → Get base64-encoded metadata
6. Decode the base64 → See full JSON
7. View on OpenSea → Image and attributes display automatically!

### Step 2: Plant NFT with Breeding

Add genetic breeding mechanics:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./PlantNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PlantNFTBreeding is PlantNFT {
    // Breeding requirements
    uint256 public constant BREEDING_COOLDOWN = 7 days;
    uint256 public constant BREEDING_FEE = 100 * 10**18; // 100 SEED tokens
    
    // Breeding tracking
    mapping(uint256 => uint256) public lastBreedTime;
    mapping(uint256 => uint256) public breedingCount;
    
    // Reference to SEED token
    IERC20 public seedToken;
    
    // Events
    event PlantBred(
        uint256 indexed parent1Id,
        uint256 indexed parent2Id,
        uint256 indexed childId,
        uint256 generation
    );
    
    constructor(address _seedToken) {
        seedToken = IERC20(_seedToken);
    }
    
    // Breed two plants to create new one
    function breedPlants(uint256 parent1Id, uint256 parent2Id) 
        external 
        returns (uint256) 
    {
        // Validation
        require(ownerOf(parent1Id) == msg.sender, "Not owner of parent 1");
        require(ownerOf(parent2Id) == msg.sender, "Not owner of parent 2");
        require(parent1Id != parent2Id, "Can't breed with itself");
        
        // Check breeding cooldown (allow first breeding)
        require(
            lastBreedTime[parent1Id] == 0 || block.timestamp >= lastBreedTime[parent1Id] + BREEDING_COOLDOWN,
            "Parent 1 on cooldown"
        );
        require(
            lastBreedTime[parent2Id] == 0 || block.timestamp >= lastBreedTime[parent2Id] + BREEDING_COOLDOWN,
            "Parent 2 on cooldown"
        );
        
        // Take breeding fee
        require(
            seedToken.transferFrom(msg.sender, address(this), BREEDING_FEE),
            "Breeding fee failed"
        );
        
        // Get parent attributes
        PlantAttributes memory parent1 = plantAttributes[parent1Id];
        PlantAttributes memory parent2 = plantAttributes[parent2Id];
        
        // Create child NFT
        _tokenIdCounter++;
        uint256 childId = _tokenIdCounter;
        
        // Genetic inheritance (simplified)
        uint256 childRarity = _inheritRarity(parent1.rarity, parent2.rarity);
        string memory childSpecies = _inheritSpecies(parent1.species, parent2.species);
        uint256 childGeneration = _max(parent1.generation, parent2.generation) + 1;
        
        // Enhanced stats for higher generations
        uint256 growthRate = 100 + (childRarity - 1) * 25 + (childGeneration - 1) * 10;
        uint256 yieldBonus = 100 + (childRarity - 1) * 50 + (childGeneration - 1) * 20;
        
        // Create child plant
        plantAttributes[childId] = PlantAttributes({
            species: childSpecies,
            rarity: childRarity,
            growthRate: growthRate,
            yieldBonus: yieldBonus,
            birthTime: block.timestamp,
            generation: childGeneration
        });
        
        // Mint to breeder
        _safeMint(msg.sender, childId);
        
        // Update breeding records
        lastBreedTime[parent1Id] = block.timestamp;
        lastBreedTime[parent2Id] = block.timestamp;
        breedingCount[parent1Id]++;
        breedingCount[parent2Id]++;
        
        emit PlantBred(parent1Id, parent2Id, childId, childGeneration);
        
        return childId;
    }
    
    // Inherit rarity (chance for upgrade!)
    function _inheritRarity(uint256 rarity1, uint256 rarity2) 
        private 
        view 
        returns (uint256) 
    {
        uint256 avgRarity = (rarity1 + rarity2) / 2;
        uint256 rand = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao
        ))) % 100;
        
        // 20% chance to upgrade rarity
        if (rand < 20 && avgRarity < 4) {
            return avgRarity + 1;
        }
        
        return avgRarity;
    }
    
    // Combine species names
    function _inheritSpecies(string memory species1, string memory species2)
        private
        pure
        returns (string memory)
    {
        // Simplified - just use first parent's species
        // In production: Create hybrid names
        return species1;
    }
    
    // Utility: Get max of two numbers
    function _max(uint256 a, uint256 b) private pure returns (uint256) {
        return a > b ? a : b;
    }
}
```

**Breeding Mechanics:**
- Two NFTs can breed to create offspring
- Cooldown period prevents spam
- Costs SEED tokens (economic sink)
- Child inherits traits from parents
- Generation bonus for advanced breeding

---

## Part 4: ERC-1155 - Multi-Token Standard

### Understanding ERC-1155

**What it is**: Hybrid standard supporting both fungible and non-fungible tokens

**Advantages**:
- One contract for all items
- Batch operations save gas
- Semi-fungible tokens (limited editions)

### Garden Items System

Create `GardenItems.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract GardenItems is ERC1155, Ownable {
    // Item IDs (like an enum)
    uint256 public constant WATER_CAN = 1;
    uint256 public constant FERTILIZER = 2;
    uint256 public constant GROWTH_BOOST = 3;
    uint256 public constant RARE_SEED = 4;
    uint256 public constant LEGENDARY_SEED = 5;
    uint256 public constant HARVEST_TOOL = 6;

    // Item metadata
    struct Item {
        string name;
        string description;
        uint256 maxSupply;      // Maximum that can exist
        uint256 currentSupply;  // How many exist now
        uint256 price;          // Price in SEED tokens
        bool tradeable;         // Can be traded between users
        bool consumable;        // Destroyed when used
    }

    mapping(uint256 => Item) public items;

    // Effects when used
    mapping(uint256 => uint256) public itemEffects;

    // Reference to SEED token
    IERC20 public seedToken;

    // Events
    event ItemPurchased(address indexed buyer, uint256 indexed itemId, uint256 amount);
    event ItemUsed(address indexed user, uint256 indexed itemId, uint256 targetId);

    constructor(address _seedToken) ERC1155("") Ownable(msg.sender) {
        seedToken = IERC20(_seedToken);
        _initializeItems();
    }

    function _initializeItems() private {
        items[WATER_CAN] = Item({
            name: "Water Can",
            description: "Instantly water your plant",
            maxSupply: 10000,
            currentSupply: 0,
            price: 10 * 10**18,  // 10 SEED
            tradeable: true,
            consumable: true
        });

        items[FERTILIZER] = Item({
            name: "Fertilizer",
            description: "Double growth rate for 1 hour",
            maxSupply: 5000,
            currentSupply: 0,
            price: 50 * 10**18,  // 50 SEED
            tradeable: true,
            consumable: true
        });

        items[GROWTH_BOOST] = Item({
            name: "Growth Boost",
            description: "Instantly advance one growth stage",
            maxSupply: 1000,
            currentSupply: 0,
            price: 200 * 10**18,  // 200 SEED
            tradeable: true,
            consumable: true
        });

        items[RARE_SEED] = Item({
            name: "Rare Seed",
            description: "Guaranteed rare plant or better",
            maxSupply: 500,
            currentSupply: 0,
            price: 500 * 10**18,  // 500 SEED
            tradeable: true,
            consumable: true
        });

        items[LEGENDARY_SEED] = Item({
            name: "Legendary Seed",
            description: "Guaranteed legendary plant",
            maxSupply: 100,
            currentSupply: 0,
            price: 5000 * 10**18,  // 5000 SEED
            tradeable: false,  // Can't trade!
            consumable: true
        });

        items[HARVEST_TOOL] = Item({
            name: "Golden Sickle",
            description: "2x harvest rewards",
            maxSupply: 1000,
            currentSupply: 0,
            price: 100 * 10**18,  // 100 SEED
            tradeable: true,
            consumable: false  // Reusable!
        });

        // Set effects
        itemEffects[WATER_CAN] = 100;      // Restore 100% water
        itemEffects[FERTILIZER] = 200;     // 2x growth rate
        itemEffects[GROWTH_BOOST] = 1;     // Advance 1 stage
        itemEffects[HARVEST_TOOL] = 200;   // 2x harvest
    }

    // Purchase items with SEED tokens
    function purchaseItem(uint256 itemId, uint256 amount) external {
        Item storage item = items[itemId];
        require(item.price > 0, "Item not for sale");
        require(
            item.currentSupply + amount <= item.maxSupply,
            "Exceeds max supply"
        );

        uint256 totalPrice = item.price * amount;

        // Take payment
        require(
            seedToken.transferFrom(msg.sender, address(this), totalPrice),
            "Payment failed"
        );

        // Give items
        item.currentSupply += amount;
        _mint(msg.sender, itemId, amount, "");

        emit ItemPurchased(msg.sender, itemId, amount);
    }

    // Use consumable item
    function useItem(uint256 itemId, uint256 targetId) external {
        require(balanceOf(msg.sender, itemId) > 0, "Don't own item");
        require(items[itemId].consumable, "Item not consumable");

        // Burn if consumable
        _burn(msg.sender, itemId, 1);

        // Effect is handled by game contract
        // targetId = which plant to use on
        emit ItemUsed(msg.sender, itemId, targetId);
    }

    // Batch operations (gas efficient!)
    function purchaseMultipleItems(
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) external {
        require(itemIds.length == amounts.length, "Length mismatch");

        uint256 totalPrice = 0;
        for (uint256 i = 0; i < itemIds.length; i++) {
            Item storage item = items[itemIds[i]];
            require(
                item.currentSupply + amounts[i] <= item.maxSupply,
                "Exceeds max supply"
            );
            totalPrice += item.price * amounts[i];
            item.currentSupply += amounts[i];
        }

        require(
            seedToken.transferFrom(msg.sender, address(this), totalPrice),
            "Payment failed"
        );

        _mintBatch(msg.sender, itemIds, amounts, "");
    }

    // Get item details
    function getItemInfo(uint256 itemId) external view returns (
        string memory name,
        string memory description,
        uint256 price,
        uint256 available,
        uint256 effect
    ) {
        Item memory item = items[itemId];
        return (
            item.name,
            item.description,
            item.price,
            item.maxSupply - item.currentSupply,
            itemEffects[itemId]
        );
    }

    // Check if item is tradeable
    function isItemTradeable(uint256 itemId) external view returns (bool) {
        return items[itemId].tradeable;
    }

    // Override transfer to enforce tradeability
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(items[id].tradeable, "Item not tradeable");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    // Override batch transfer to enforce tradeability
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        for (uint256 i = 0; i < ids.length; i++) {
            require(items[ids[i]].tradeable, "Item not tradeable");
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    // Get image URL for item
    function _getImageURL(uint256 itemId) private pure returns (string memory) {
        if (itemId == WATER_CAN) return "https://cdn-icons-png.flaticon.com/128/2470/2470075.png";
        if (itemId == FERTILIZER) return "https://cdn-icons-png.flaticon.com/128/3072/3072498.png";
        if (itemId == GROWTH_BOOST) return "https://cdn-icons-png.flaticon.com/128/8727/8727041.png";
        if (itemId == RARE_SEED) return "https://cdn-icons-png.flaticon.com/128/346/346195.png";
        if (itemId == LEGENDARY_SEED) return "https://cdn-icons-png.flaticon.com/128/346/346195.png";
        if (itemId == HARVEST_TOOL) return "https://cdn-icons-png.flaticon.com/128/1421/1421599.png";
        return "";
    }

    // Get rarity name for seeds
    function _getRarityName(uint256 itemId) private pure returns (string memory) {
        if (itemId == RARE_SEED) return "Rare";
        if (itemId == LEGENDARY_SEED) return "Legendary";
        return "Common";
    }

    // Generate dynamic tokenURI for ERC-1155
    function uri(uint256 itemId) public view override returns (string memory) {
        require(items[itemId].price > 0, "Item doesn't exist");

        Item memory item = items[itemId];
        string memory imageURL = _getImageURL(itemId);

        // Build attributes based on item properties
        string memory attributes = string(abi.encodePacked(
            '[{"trait_type":"Type","value":"',
            item.consumable ? "Consumable" : "Reusable",
            '"},{"trait_type":"Tradeable","value":"',
            item.tradeable ? "Yes" : "No",
            '"},{"trait_type":"Effect","value":',
            Strings.toString(itemEffects[itemId]),
            '},{"trait_type":"Max Supply","value":',
            Strings.toString(item.maxSupply),
            '},{"trait_type":"Current Supply","value":',
            Strings.toString(item.currentSupply),
            '},{"trait_type":"Price (SEED)","value":',
            Strings.toString(item.price / 10**18)
        ));

        // Add rarity for seeds
        if (itemId == RARE_SEED || itemId == LEGENDARY_SEED) {
            attributes = string(abi.encodePacked(
                attributes,
                '},{"trait_type":"Rarity","value":"',
                _getRarityName(itemId),
                '"'
            ));
        }

        attributes = string(abi.encodePacked(attributes, '}]'));

        // Build JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name":"',
            item.name,
            '","description":"',
            item.description,
            '","image":"',
            imageURL,
            '","attributes":',
            attributes,
            '}'
        ));

        // Encode to base64
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(json))
        ));
    }
}
```

**Explanation:**

**ERC-1155 Basics:**
- One contract for ALL items (fungible AND non-fungible)
- Each item type has an ID (WATER_CAN=1, FERTILIZER=2, etc.)
- Users can own multiple of each item
- More gas efficient than separate contracts

**Item Structure:**
- `name/description` - What the item is
- `maxSupply` - Total that can ever exist (scarcity)
- `currentSupply` - How many exist now
- `price` - Cost in SEED tokens
- `tradeable` - Can users trade it? (marketplace)
- `consumable` - Is it destroyed when used?

**Item Types & Effects:**
| Item | Price | Effect | Consumable |
|------|-------|---------|------------|
| Water Can | 10 SEED | Restore 100% water | Yes |
| Fertilizer | 50 SEED | 2x growth for 1 hour | Yes |
| Growth Boost | 200 SEED | Skip to next stage | Yes |
| Harvest Tool | 100 SEED | 2x harvest rewards | No (reusable!) |

**How It Works:**
1. User has 100 SEED tokens
2. Calls `purchaseItem(WATER_CAN, 5)` → Buys 5 water cans for 50 SEED
3. Later calls `useItem(WATER_CAN, plantId)` → Uses 1 water can
4. Water can is burned, plant gets watered
5. User has 4 water cans left

**Try it:**
1. Deploy with SEED token address
2. Approve SEED spending: `seedToken.approve(itemsAddress, 1000)`
3. Call `purchaseItem(1, 3)` → Buy 3 water cans
4. Check `balanceOf(your_address, 1)` → You have 3!
5. Call `useItem(1, 123)` → Use on plant #123
6. Check balance again → Now have 2!

---

## Part 5: Modular Architecture & Composability

### Master Garden Contract

Create `GardenEcosystem.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface ILiskGarden {
    function plantSeed() external payable returns (uint256);
    function waterPlant(uint256 plantId) external;
    function harvestPlant(uint256 plantId) external;
}

interface ISeedToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
}

interface IPlantNFT {
    function mintPlant(address to, string memory species) external returns (uint256);
}

interface IGardenItems {
    function useItem(uint256 itemId, uint256 targetId) external;
}

contract GardenEcosystem is Ownable {
    // Core contracts
    ILiskGarden public liskGarden;
    ISeedToken public seedToken;
    IPlantNFT public plantNFT;
    IGardenItems public gardenItems;
    
    // Integration settings
    uint256 public constant HARVEST_SEED_REWARD = 100 * 10**18; // 100 SEED per harvest
    uint256 public constant WATER_SEED_REWARD = 5 * 10**18;     // 5 SEED per water
    uint256 public constant NFT_MINT_THRESHOLD = 5;             // Every 5th plant = NFT
    
    // User progress tracking
    mapping(address => uint256) public userPlantCount;
    mapping(address => uint256) public userHarvestCount;
    
    constructor(
        address _liskGarden,
        address _seedToken,
        address _plantNFT,
        address _gardenItems
    ) Ownable(msg.sender) {
        liskGarden = ILiskGarden(_liskGarden);
        seedToken = ISeedToken(_seedToken);
        plantNFT = IPlantNFT(_plantNFT);
        gardenItems = IGardenItems(_gardenItems);
    }
    
    // Enhanced plant with rewards
    function plantSeedEnhanced() external payable returns (uint256) {
        uint256 plantId = liskGarden.plantSeed{value: msg.value}();
        
        userPlantCount[msg.sender]++;
        
        // Milestone reward: NFT every 5th plant
        if (userPlantCount[msg.sender] % NFT_MINT_THRESHOLD == 0) {
            plantNFT.mintPlant(msg.sender, "Milestone Rose");
        }
        
        // Give some SEED tokens for planting
        seedToken.mint(msg.sender, 10 * 10**18);
        
        return plantId;
    }
    
    // Enhanced harvest with token rewards
    function harvestEnhanced(uint256 plantId) external {
        liskGarden.harvestPlant(plantId);
        
        userHarvestCount[msg.sender]++;
        
        // Reward SEED tokens
        seedToken.mint(msg.sender, HARVEST_SEED_REWARD);
        
        // Bonus NFT for 10th harvest
        if (userHarvestCount[msg.sender] % 10 == 0) {
            plantNFT.mintPlant(msg.sender, "Harvest Master");
        }
    }
    
    // Use item on plant
    function useItemOnPlant(uint256 itemId, uint256 plantId) external {
        gardenItems.useItem(itemId, plantId);
        
        // Apply item effect based on itemId
        if (itemId == 1) { // Water Can
            liskGarden.waterPlant(plantId);
            seedToken.mint(msg.sender, WATER_SEED_REWARD);
        }
        // Add more item effects...
    }
}
```

**Explanation:**

**What is Modular Architecture?**
Modular architecture means breaking your application into separate, independent contracts that work together through well-defined interfaces.

**Architecture Diagram:**
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  SeedToken   │    │  PlantNFT    │    │ GardenItems  │
│  (ERC-20)    │◄───┤  (ERC-721)   │◄───┤  (ERC-1155)  │
└──────────────┘    └──────────────┘    └──────────────┘
        ▲                   ▲                   ▲
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                    ┌───────────────┐
                    │ GardenEcosystem│
                    │  (Orchestrator)│
                    └───────────────┘
```

**Key Concepts:**

**1. Interfaces** - Contracts communicate through interfaces:
```solidity
interface ISeedToken {
    function mint(address to, uint256 amount) external;
}
```
- Define what functions exist without implementation details
- Allow loose coupling between contracts
- Make contracts swappable (upgrade SeedToken without changing Ecosystem)

**2. Separation of Concerns** - Each contract has ONE job:
- `SeedToken` → Only handles ERC-20 token logic
- `PlantNFT` → Only handles NFT minting and attributes
- `GardenItems` → Only handles ERC-1155 items
- `GardenEcosystem` → Coordinates everything together

**3. Composability** - Contracts work together like LEGO blocks:
```solidity
// Ecosystem orchestrates multiple contracts
seedToken.mint(user, reward);           // Give tokens
plantNFT.mintPlant(user, species);      // Mint NFT
gardenItems.useItem(itemId, plantId);   // Use item
```

**Benefits:**

| Aspect | Monolithic | Modular |
|--------|-----------|---------|
| **Upgradability** | ❌ Must redeploy everything | ✅ Upgrade individual modules |
| **Gas Costs** | ❌ High deployment cost | ✅ Deploy only what you need |
| **Testing** | ❌ Complex (test everything) | ✅ Easy (test each module) |
| **Risk** | ❌ One bug breaks all | ✅ Isolated failures |
| **Reusability** | ❌ Can't reuse parts | ✅ Use modules elsewhere |

**How It Works:**

1. **User calls Ecosystem**: `plantSeedEnhanced()`
2. **Ecosystem orchestrates**:
   - Calls `liskGarden.plantSeed()` → Creates plant
   - Calls `seedToken.mint()` → Rewards 10 SEED
   - Tracks user count
   - If 5th plant → Calls `plantNFT.mintPlant()` → Bonus NFT!
3. **User gets**: Plant + tokens + maybe NFT (all in one transaction!)

**Advanced Pattern - Milestone Rewards:**
```solidity
// Every 5th plant = NFT
if (userPlantCount[msg.sender] % NFT_MINT_THRESHOLD == 0) {
    plantNFT.mintPlant(msg.sender, "Milestone Rose");
}
```

**Try it:**
1. Deploy all contracts (SeedToken, PlantNFT, GardenItems)
2. Deploy GardenEcosystem with all addresses
3. Grant minting permissions to Ecosystem contract
4. Call `plantSeedEnhanced()` → Get rewards automatically!
5. Plant 5 times → Get bonus NFT!

---

## Part 6: Security Best Practices

### Common Vulnerabilities & Solutions

| Vulnerability | Risk | Solution |
|--------------|------|----------|
| **Reentrancy** | Drain funds | Use `ReentrancyGuard` |
| **Integer Overflow** | Break math | Solidity 0.8+ auto-checks |
| **Front-running** | MEV attacks | Commit-reveal scheme |
| **Centralization** | Admin abuse | Multi-sig, timelock |
| **Oracle Manipulation** | Fake randomness | Chainlink VRF |

### Security Checklist

```solidity
// ✅ GOOD: Checks-Effects-Interactions pattern
function withdraw() external {
    uint256 amount = balances[msg.sender];  // Check
    balances[msg.sender] = 0;               // Effect
    payable(msg.sender).transfer(amount);   // Interaction
}

// ❌ BAD: Vulnerable to reentrancy
function withdraw() external {
    uint256 amount = balances[msg.sender];
    payable(msg.sender).transfer(amount);   // Interaction first!
    balances[msg.sender] = 0;               // Effect after = vulnerable
}

// ✅ GOOD: Access control
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

// ✅ GOOD: Input validation
function setPrice(uint256 _price) external onlyOwner {
    require(_price > 0 && _price < 1000000 * 10**18, "Invalid price");
    price = _price;
}

// ✅ GOOD: Pull over push for payments
mapping(address => uint256) public pendingWithdrawals;

function withdrawPayment() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
```


## Student Challenges 🏆

### Challenge 1: Frontend Integration (Beginner)
**Goal**: Connect existing Session 4 frontend to new token contracts

**Tasks**:
1. Display SEED token balance in UI
2. Add "Claim Daily Reward" button (mints 50 SEED)
3. Show Plant NFT collection in gallery view
4. Add purchase button for Garden Items

**Hints**:
- Use existing `useContract` hook
- Add new contract addresses to `.env`
- Create `useSeedToken` hook similar to `usePlants`

---

### Challenge 2: Marketplace Contract (Intermediate)
**Goal**: Build P2P marketplace for trading

**Requirements**:
```solidity
contract GardenMarketplace {
    // List plant NFT for sale (price in SEED)
    function listPlant(uint256 plantId, uint256 price) external;

    // Buy listed plant with SEED tokens
    function buyPlant(uint256 listingId) external;

    // List garden items for sale
    function listItem(uint256 itemId, uint256 amount, uint256 pricePerUnit) external;

    // Cancel listing
    function cancelListing(uint256 listingId) external;
}
```

**Bonus**: Add auction functionality with bidding!

---

### Challenge 3: Achievements System (Intermediate)
**Goal**: Create achievement NFTs for milestones

**Achievements to implement**:
- "First Plant" - Plant your first seed
- "Green Thumb" - Own 10 plants simultaneously
- "Harvest Master" - Harvest 50 plants total
- "Whale" - Own 10,000 SEED tokens
- "Breeder" - Successfully breed plants
- "Collector" - Own one of each garden item

**Hints**:
- Use ERC-721 for achievement badges
- Track progress in mappings
- Auto-mint when milestone reached

---

### Challenge 4: Plant NFT Staking System (Advanced)
**Goal**: Create staking contract where users lock Plant NFTs to earn SEED rewards

**Requirements**:
```solidity
contract PlantStaking {
    // Stake plant NFT to earn rewards
    function stakePlant(uint256 plantId, uint256 rarity) external;

    // Calculate pending rewards based on time and rarity
    function calculateRewards(uint256 plantId) external view returns (uint256);

    // Claim rewards without unstaking
    function claimRewards(uint256 plantId) external;

    // Unstake plant and claim all rewards
    function unstakePlant(uint256 plantId) external;
}
```

**Features to implement**:
- Base reward rate: 10 SEED per day
- Rarity multipliers: Common (1x), Rare (1.5x), Epic (2x), Legendary (2.5x)
- Minimum stake time: 24 hours
- Reward pool system (owner can fund)
- ReentrancyGuard protection

**Hints**:
- Use `block.timestamp` for time calculations
- Store stake info in a struct (owner, timestamp, plantId, rarity, claimed)
- Calculate rewards: `(timeStaked * baseRate * rarityMultiplier) / 1 days`

---

### Challenge 5: Modular Registry & Composability (Advanced)
**Goal**: Create a registry contract that connects all garden contracts together

**Part A - Garden Registry**:
```solidity
contract GardenRegistry {
    // Register core contracts (SeedToken, PlantNFT, GardenItems, etc.)
    function setCoreContracts(...) external;

    // Register plugins for extensibility
    function registerPlugin(string memory name, address pluginAddress) external;

    // Track user stats across all contracts
    function updateUserStats(address user, ...) external;

    // Get all user data in one call
    function getUserData(address user) external view returns (...);
}
```

### Challenge 6: Governance DAO (Expert)
**Goal**: Create DAO for community governance

**Features**:
```solidity
contract GardenDAO {
    // Propose changes (new items, reward rates, etc.)
    function propose(string memory description, bytes memory calldata) external;

    // Vote with SEED tokens
    function vote(uint256 proposalId, bool support) external;

    // Execute passed proposals
    function execute(uint256 proposalId) external;

    // Delegate voting power
    function delegate(address delegatee) external;
}
```

**Requirements**:
- Voting power = SEED balance
- 3-day voting period
- 10% quorum required
- Timelock for execution

---

### Challenge 7: Cross-Chain Bridge (Expert)
**Goal**: Deploy on multiple chains with bridge

**Tasks**:
1. Deploy contracts on Lisk + Base testnet
2. Implement message passing between chains
3. Allow NFT transfers cross-chain
4. Sync SEED token balance

**Tools**: LayerZero, Chainlink CCIP, or Axelar

---

## Quick Reference

### Contract Addresses (Deploy These!)
```javascript
// After deploying, save these addresses
const CONTRACTS = {
    SEED_TOKEN: "0x...",
    PLANT_NFT: "0x...",
    GARDEN_ITEMS: "0x...",
    PLANT_STAKING: "0x...",
    GARDEN_REGISTRY: "0x...",
}
```

### Key Functions Cheat Sheet

**SEED Token (ERC-20)**:
```solidity
balanceOf(address) → uint256
transfer(address, uint256) → bool
approve(address, uint256) → bool
```

**Plant NFT (ERC-721)**:
```solidity
ownerOf(uint256) → address
transferFrom(address, address, uint256)
mintPlant(address, string) → uint256
```

**Garden Items (ERC-1155)**:
```solidity
balanceOf(address, uint256) → uint256
safeTransferFrom(address, address, uint256, uint256, bytes)
purchaseItem(uint256, uint256)
```

---

## Testing Your Contracts

### In Remix

1. **Deploy Order**:
   ```
   1. SeedToken
   2. PlantNFT (pass SeedToken address)
   3. GardenItems (pass SeedToken address)
   4. PlantStaking (pass PlantNFT, SeedToken addresses)
   ```

2. **Test Flow**:
   ```
   - Mint SEED tokens
   - Purchase garden items
   - Mint plant NFT
   - Stake NFT for rewards
   - Claim staking rewards
   - Trade on marketplace
   ```

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "ERC20: insufficient allowance" | Not approved | Call `approve()` first |
| "Not owner" | Wrong wallet | Switch account |
| "Exceeds max supply" | Supply limit | Check availability |
| "Min stake time not met" | Too early | Wait 24 hours |

---

## Resources

### Documentation
- [OpenZeppelin Docs](https://docs.openzeppelin.com/contracts)
- [ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [ERC-1155 Standard](https://eips.ethereum.org/EIPS/eip-1155)

### Tools
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/) - Generate token code
- [Remix IDE](https://remix.ethereum.org) - Deploy & test
- [Tenderly](https://tenderly.co) - Debug transactions

---

## What You Learned

✅ **Token Standards**:
- ERC-20 for fungible tokens (SEED Token)
- ERC-721 for NFTs (Plant NFTs with dynamic metadata)
- ERC-1155 for multi-tokens (Garden Items)

✅ **NFT Advanced Features**:
- Dynamic on-chain metadata generation
- Base64 encoding for data URIs
- Image URI integration (IPFS support)
- Attribute system for gaming NFTs

✅ **Token Economics**:
- Token vesting schedules
- Reward distribution systems
- Supply management (max supply, minting, burning)

✅ **ERC-1155 Item System**:
- Fungible and non-fungible in one contract
- Consumable vs reusable items
- Batch operations for gas efficiency
- Item effects and metadata

---


**Remember**: The best way to learn is by building! Pick a challenge and start coding. Break things, fix them, and learn from the process.

**Happy Building!** 🌱🚀

---

**#LiskGrowthGarden** | **#BuildOnLisk** | **#Web3Learning**