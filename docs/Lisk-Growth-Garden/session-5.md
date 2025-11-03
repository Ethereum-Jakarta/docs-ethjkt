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
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply
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

**Key Points**:
- Inherits from OpenZeppelin's `ERC20` (battle-tested code)
- 18 decimals by default (1 token = 10^18 units)
- Owner can mint rewards
- Users can burn tokens (deflationary mechanic)

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
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        uint256 cliffDuration;
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
        // Mint public sale allocation to owner
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
        
        // Mint vested tokens (locked initially)
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
    
    // Distribute rewards (called by garden contracts)
    function distributeReward(address user, uint256 amount) external onlyOwner {
        require(rewardsDistributed + amount <= REWARDS_ALLOCATION, "Exceeds allocation");
        
        rewardsDistributed += amount;
        _mint(user, amount);
    }
    
    // Emergency pause (optional security feature)
    bool public paused;
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    // Override transfer to respect pause
    function transfer(address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }
}
```

**Advanced Features**:
- **Token Vesting**: Team tokens locked with cliff and linear release
- **Max Supply Cap**: Prevents infinite minting
- **Allocation Buckets**: Separate pools for team/rewards/public
- **Emergency Pause**: Circuit breaker for security

### Try It!

1. Deploy `SeedToken` on Remix
2. Call `getTokenInfo()` → See token details
3. Call `balanceOf(your_address)` → See 1M tokens!
4. Try `transfer()` to send tokens
5. Call `rewardUser()` to mint rewards

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
import "@openzeppelin/contracts/utils/Counters.sol";

contract PlantNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Plant attributes
    struct PlantAttributes {
        string species;      // "Rose", "Tulip", "Cactus"
        uint256 rarity;      // 1=Common, 2=Rare, 3=Epic, 4=Legendary
        uint256 growthRate;  // Growth speed multiplier (100 = 1x)
        uint256 yieldBonus;  // Harvest reward multiplier (100 = 1x)
        uint256 birthTime;   // When minted
        uint256 generation;  // Breeding generation
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
    
    // Mint new plant NFT
    function mintPlant(address to, string memory species) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
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
            generation: 1
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
        require(_exists(tokenId), "Plant doesn't exist");
        
        PlantAttributes memory attr = plantAttributes[tokenId];
        uint256 age = block.timestamp - attr.birthTime;
        
        return (
            attr.species,
            attr.rarity,
            attr.growthRate,
            attr.yieldBonus,
            age
        );
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
```

**Key Features**:
- Each plant has unique attributes (species, rarity, bonuses)
- Rarity system affects growth rate and yield
- Generation tracking for breeding system
- Age calculation from mint time

### Step 2: Plant NFT with Breeding

Add genetic breeding mechanics:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// ... previous imports ...

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
        
        // Check breeding cooldown
        require(
            block.timestamp >= lastBreedTime[parent1Id] + BREEDING_COOLDOWN,
            "Parent 1 on cooldown"
        );
        require(
            block.timestamp >= lastBreedTime[parent2Id] + BREEDING_COOLDOWN,
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
        _tokenIds.increment();
        uint256 childId = _tokenIds.current();
        
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

**Breeding Mechanics**:
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
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 price;      // Price in SEED tokens
        bool tradeable;
        bool consumable;
    }
    
    mapping(uint256 => Item) public items;
    
    // Effects when used
    mapping(uint256 => uint256) public itemEffects; // itemId => effect value
    
    // Crafting recipes
    struct Recipe {
        uint256[] inputIds;
        uint256[] inputAmounts;
        uint256 outputId;
        uint256 outputAmount;
    }
    
    mapping(uint256 => Recipe) public recipes;
    uint256 public recipeCount;
    
    // Reference to SEED token
    IERC20 public seedToken;
    
    // Events
    event ItemPurchased(address indexed buyer, uint256 indexed itemId, uint256 amount);
    event ItemUsed(address indexed user, uint256 indexed itemId, uint256 targetId);
    event ItemCrafted(address indexed crafter, uint256 indexed recipeId, uint256 amount);
    
    constructor(address _seedToken) ERC1155("") Ownable(msg.sender) {
        seedToken = IERC20(_seedToken);
        _initializeItems();
        _initializeRecipes();
    }
    
    function _initializeItems() private {
        items[WATER_CAN] = Item({
            name: "Water Can",
            description: "Instantly water your plant",
            maxSupply: 10000,
            currentSupply: 0,
            price: 10 * 10**18, // 10 SEED
            tradeable: true,
            consumable: true
        });
        
        items[FERTILIZER] = Item({
            name: "Fertilizer",
            description: "Double growth rate for 1 hour",
            maxSupply: 5000,
            currentSupply: 0,
            price: 50 * 10**18, // 50 SEED
            tradeable: true,
            consumable: true
        });
        
        items[GROWTH_BOOST] = Item({
            name: "Growth Boost",
            description: "Instantly advance one growth stage",
            maxSupply: 1000,
            currentSupply: 0,
            price: 200 * 10**18, // 200 SEED
            tradeable: true,
            consumable: true
        });
        
        items[RARE_SEED] = Item({
            name: "Rare Seed",
            description: "Guaranteed rare plant or better",
            maxSupply: 500,
            currentSupply: 0,
            price: 500 * 10**18, // 500 SEED
            tradeable: true,
            consumable: true
        });
        
        items[LEGENDARY_SEED] = Item({
            name: "Legendary Seed",
            description: "Guaranteed legendary plant",
            maxSupply: 100,
            currentSupply: 0,
            price: 5000 * 10**18, // 5000 SEED
            tradeable: false, // Can't trade!
            consumable: true
        });
        
        items[HARVEST_TOOL] = Item({
            name: "Golden Sickle",
            description: "2x harvest rewards",
            maxSupply: 1000,
            currentSupply: 0,
            price: 100 * 10**18, // 100 SEED
            tradeable: true,
            consumable: false // Reusable!
        });
        
        // Set effects
        itemEffects[WATER_CAN] = 100;      // Restore 100% water
        itemEffects[FERTILIZER] = 200;     // 2x growth rate
        itemEffects[GROWTH_BOOST] = 1;     // Advance 1 stage
        itemEffects[HARVEST_TOOL] = 200;   // 2x harvest
    }
    
    function _initializeRecipes() private {
        // Recipe: 3 Water Cans + 2 Fertilizer = 1 Growth Boost
        recipes[0] = Recipe({
            inputIds: [WATER_CAN, FERTILIZER],
            inputAmounts: [3, 2],
            outputId: GROWTH_BOOST,
            outputAmount: 1
        });
        recipeCount = 1;
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
        require(
            seedToken.transferFrom(msg.sender, address(this), totalPrice),
            "Payment failed"
        );
        
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
        emit ItemUsed(msg.sender, itemId, targetId);
    }
    
    // Craft items using recipe
    function craftItem(uint256 recipeId, uint256 amount) external {
        Recipe memory recipe = recipes[recipeId];
        require(recipe.outputId > 0, "Invalid recipe");
        
        // Check user has required inputs
        for (uint256 i = 0; i < recipe.inputIds.length; i++) {
            require(
                balanceOf(msg.sender, recipe.inputIds[i]) >= 
                recipe.inputAmounts[i] * amount,
                "Insufficient ingredients"
            );
        }
        
        // Burn inputs
        for (uint256 i = 0; i < recipe.inputIds.length; i++) {
            _burn(
                msg.sender, 
                recipe.inputIds[i], 
                recipe.inputAmounts[i] * amount
            );
        }
        
        // Mint output
        _mint(msg.sender, recipe.outputId, recipe.outputAmount * amount, "");
        
        emit ItemCrafted(msg.sender, recipeId, amount);
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
    function canTrade(uint256 itemId) external view returns (bool) {
        return items[itemId].tradeable;
    }
}
```

**Key Features**:
- Multiple item types in one contract
- Items can be consumable or permanent
- Crafting system to combine items
- Batch operations for gas efficiency
- Supply limits for scarcity

---

## Part 5: Modular Architecture - Plugin System

### Why Modular Design?

**Traditional Approach**: Everything in one contract
**Modular Approach**: Separate contracts that interact

**Benefits**:
- ✅ Upgradeable components
- ✅ Gas optimization
- ✅ Separation of concerns
- ✅ Risk isolation

### Garden Registry Pattern

Create `GardenRegistry.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract GardenRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant GARDEN_ROLE = keccak256("GARDEN");
    bytes32 public constant PLUGIN_ROLE = keccak256("PLUGIN");
    
    // Core contracts
    address public liskGarden;
    address public seedToken;
    address public plantNFT;
    address public gardenItems;
    
    // Plugin registry
    mapping(string => address) public plugins;
    mapping(address => bool) public isPlugin;
    string[] public pluginList;
    
    // User data aggregation
    struct UserStats {
        uint256 plantsOwned;
        uint256 seedBalance;
        uint256 itemsOwned;
        uint256 totalHarvests;
        uint256 level;
        uint256 experience;
    }
    
    mapping(address => UserStats) public userStats;
    
    // Events
    event PluginRegistered(string name, address pluginAddress);
    event PluginRemoved(string name);
    event ContractUpdated(string contractType, address newAddress);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // Set core contracts
    function setCoreContracts(
        address _liskGarden,
        address _seedToken,
        address _plantNFT,
        address _gardenItems
    ) external onlyRole(ADMIN_ROLE) {
        liskGarden = _liskGarden;
        seedToken = _seedToken;
        plantNFT = _plantNFT;
        gardenItems = _gardenItems;
        
        // Grant roles
        _grantRole(GARDEN_ROLE, _liskGarden);
    }
    
    // Register new plugin
    function registerPlugin(
        string memory name,
        address pluginAddress
    ) external onlyRole(ADMIN_ROLE) {
        require(plugins[name] == address(0), "Plugin exists");
        
        plugins[name] = pluginAddress;
        isPlugin[pluginAddress] = true;
        pluginList.push(name);
        
        _grantRole(PLUGIN_ROLE, pluginAddress);
        
        emit PluginRegistered(name, pluginAddress);
    }
    
    // Remove plugin
    function removePlugin(string memory name) external onlyRole(ADMIN_ROLE) {
        address pluginAddress = plugins[name];
        require(pluginAddress != address(0), "Plugin not found");
        
        delete plugins[name];
        isPlugin[pluginAddress] = false;
        
        _revokeRole(PLUGIN_ROLE, pluginAddress);
        
        emit PluginRemoved(name);
    }
    
    // Update user stats (called by authorized contracts)
    function updateUserStats(
        address user,
        uint256 plantsChange,
        uint256 seedChange,
        uint256 itemsChange,
        uint256 harvestsChange,
        uint256 expChange
    ) external onlyRole(GARDEN_ROLE) {
        UserStats storage stats = userStats[user];
        
        stats.plantsOwned += plantsChange;
        stats.seedBalance += seedChange;
        stats.itemsOwned += itemsChange;
        stats.totalHarvests += harvestsChange;
        stats.experience += expChange;
        
        // Level calculation (every 100 XP = 1 level)
        stats.level = stats.experience / 100;
    }
    
    // Get all user data in one call
    function getUserData(address user) external view returns (
        UserStats memory stats,
        address[] memory contracts
    ) {
        contracts = new address[](4);
        contracts[0] = liskGarden;
        contracts[1] = seedToken;
        contracts[2] = plantNFT;
        contracts[3] = gardenItems;
        
        return (userStats[user], contracts);
    }
    
    // Check if address is authorized
    function isAuthorized(address account) external view returns (bool) {
        return hasRole(GARDEN_ROLE, account) || 
               hasRole(PLUGIN_ROLE, account) ||
               hasRole(ADMIN_ROLE, account);
    }
}
```

---

## Part 6: Staking & Rewards System

### Plant NFT Staking

Create `PlantStaking.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlantStaking is ReentrancyGuard, Ownable {
    IERC721 public plantNFT;
    IERC20 public seedToken;
    
    // Staking info
    struct Stake {
        address owner;
        uint256 timestamp;
        uint256 plantId;
        uint256 rarity;      // Higher rarity = more rewards
        uint256 claimed;     // Rewards claimed so far
    }
    
    // Staking state
    mapping(uint256 => Stake) public stakes; // plantId => Stake
    mapping(address => uint256[]) public userStakes; // user => plantIds[]
    
    // Reward configuration
    uint256 public constant BASE_REWARD_RATE = 10 * 10**18; // 10 SEED per day
    uint256 public constant RARITY_MULTIPLIER = 50; // +50% per rarity level
    uint256 public constant MIN_STAKE_TIME = 1 days;
    
    // Pool info
    uint256 public totalStaked;
    uint256 public rewardPool;
    
    // Events
    event PlantStaked(address indexed user, uint256 indexed plantId);
    event PlantUnstaked(address indexed user, uint256 indexed plantId);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardPoolFunded(uint256 amount);
    
    constructor(address _plantNFT, address _seedToken) Ownable(msg.sender) {
        plantNFT = IERC721(_plantNFT);
        seedToken = IERC20(_seedToken);
    }
    
    // Stake plant NFT
    function stakePlant(uint256 plantId, uint256 rarity) external nonReentrant {
        require(plantNFT.ownerOf(plantId) == msg.sender, "Not owner");
        require(stakes[plantId].owner == address(0), "Already staked");
        
        // Transfer NFT to this contract
        plantNFT.transferFrom(msg.sender, address(this), plantId);
        
        // Record stake
        stakes[plantId] = Stake({
            owner: msg.sender,
            timestamp: block.timestamp,
            plantId: plantId,
            rarity: rarity,
            claimed: 0
        });
        
        userStakes[msg.sender].push(plantId);
        totalStaked++;
        
        emit PlantStaked(msg.sender, plantId);
    }
    
    // Calculate pending rewards
    function calculateRewards(uint256 plantId) public view returns (uint256) {
        Stake memory stake = stakes[plantId];
        if (stake.owner == address(0)) return 0;
        
        uint256 timeStaked = block.timestamp - stake.timestamp;
        
        // Base reward calculation
        uint256 baseReward = (timeStaked * BASE_REWARD_RATE) / 1 days;
        
        // Apply rarity multiplier: 1x, 1.5x, 2x, 2.5x for rarity 1-4
        uint256 multiplier = 100 + (stake.rarity - 1) * RARITY_MULTIPLIER;
        uint256 totalReward = (baseReward * multiplier) / 100;
        
        // Subtract already claimed
        return totalReward - stake.claimed;
    }
    
    // Claim rewards without unstaking
    function claimRewards(uint256 plantId) external nonReentrant {
        Stake storage stake = stakes[plantId];
        require(stake.owner == msg.sender, "Not stake owner");
        
        uint256 reward = calculateRewards(plantId);
        require(reward > 0, "No rewards");
        require(reward <= rewardPool, "Insufficient pool");
        
        stake.claimed += reward;
        rewardPool -= reward;
        
        seedToken.transfer(msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }
    
    // Unstake plant and claim all rewards
    function unstakePlant(uint256 plantId) external nonReentrant {
        Stake memory stake = stakes[plantId];
        require(stake.owner == msg.sender, "Not stake owner");
        require(
            block.timestamp >= stake.timestamp + MIN_STAKE_TIME,
            "Min stake time not met"
        );
        
        // Calculate and send rewards
        uint256 reward = calculateRewards(plantId);
        if (reward > 0 && reward <= rewardPool) {
            rewardPool -= reward;
            seedToken.transfer(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }
        
        // Return NFT
        plantNFT.transferFrom(address(this), msg.sender, plantId);
        
        // Clean up state
        delete stakes[plantId];
        _removeFromUserStakes(msg.sender, plantId);
        totalStaked--;
        
        emit PlantUnstaked(msg.sender, plantId);
    }
    
    // Batch operations for gas efficiency
    function stakeMultiple(uint256[] memory plantIds, uint256[] memory rarities) 
        external 
        nonReentrant 
    {
        require(plantIds.length == rarities.length, "Length mismatch");
        
        for (uint256 i = 0; i < plantIds.length; i++) {
            // Reuse single stake logic
            require(plantNFT.ownerOf(plantIds[i]) == msg.sender, "Not owner");
            require(stakes[plantIds[i]].owner == address(0), "Already staked");
            
            plantNFT.transferFrom(msg.sender, address(this), plantIds[i]);
            
            stakes[plantIds[i]] = Stake({
                owner: msg.sender,
                timestamp: block.timestamp,
                plantId: plantIds[i],
                rarity: rarities[i],
                claimed: 0
            });
            
            userStakes[msg.sender].push(plantIds[i]);
            totalStaked++;
            
            emit PlantStaked(msg.sender, plantIds[i]);
        }
    }
    
    // Fund reward pool (owner only)
    function fundRewardPool(uint256 amount) external onlyOwner {
        seedToken.transferFrom(msg.sender, address(this), amount);
        rewardPool += amount;
        emit RewardPoolFunded(amount);
    }
    
    // Get all user stakes
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }
    
    // Get staking stats
    function getStakingStats(address user) external view returns (
        uint256 stakedCount,
        uint256 totalPendingRewards,
        uint256 totalClaimed
    ) {
        uint256[] memory stakeIds = userStakes[user];
        stakedCount = stakeIds.length;
        
        for (uint256 i = 0; i < stakeIds.length; i++) {
            totalPendingRewards += calculateRewards(stakeIds[i]);
            totalClaimed += stakes[stakeIds[i]].claimed;
        }
        
        return (stakedCount, totalPendingRewards, totalClaimed);
    }
    
    // Internal helper
    function _removeFromUserStakes(address user, uint256 plantId) private {
        uint256[] storage stakeIds = userStakes[user];
        for (uint256 i = 0; i < stakeIds.length; i++) {
            if (stakeIds[i] == plantId) {
                stakeIds[i] = stakeIds[stakeIds.length - 1];
                stakeIds.pop();
                break;
            }
        }
    }
}
```

**Staking Mechanics**:
- Stake Plant NFTs to earn SEED tokens
- Higher rarity = more rewards
- Compound rewards or claim anytime
- Minimum stake period for unstaking

---

## Part 7: Composability - Connecting Everything

### Master Garden Contract

Connect all modules together:

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

---

## Part 8: Security Best Practices

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

---

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

### Challenge 4: Governance DAO (Advanced)
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

### Challenge 5: Cross-Chain Bridge (Expert)
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
- ERC-20 for fungible tokens
- ERC-721 for NFTs
- ERC-1155 for multi-tokens

✅ **DeFi Mechanics**:
- Staking & rewards
- Token economics
- Marketplace dynamics

✅ **Architecture Patterns**:
- Modular design
- Registry pattern
- Plugin system

✅ **Advanced Features**:
- Token vesting
- NFT breeding
- Item crafting
- Batch operations

---

## Next Session Preview

**Session 6: Bearing Fruit - DeFi Integration & Yield Farming**
- Liquidity pools
- AMM integration  
- Yield farming
- Flash loans
- Advanced DeFi strategies

---

**Remember**: The best way to learn is by building! Pick a challenge and start coding. Break things, fix them, and learn from the process.

**Happy Building!** 🌱🚀

---

**#LiskGrowthGarden** | **#BuildOnLisk** | **#Web3Learning**