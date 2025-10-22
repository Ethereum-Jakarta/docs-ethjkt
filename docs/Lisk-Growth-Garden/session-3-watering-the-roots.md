---
sidebar_position: 3
title: "Session 3 - Watering the Roots: Solidity Smart Contracts"
sidebar_label: "Session 3 - Watering the Roots"
description: "Learn Solidity step by step - From basic variables to building the complete LiskGarden game"
keywords: [solidity, smart contracts, hardhat, remix, lisk, blockchain development, web3, ethereum, programming, liskgarden]
---

# Session 3: Watering the Roots - Solidity Smart Contracts

**Session Date**: October 22, 2025 | 19:30 - 21:00 (GMT+7)

Learn Solidity step by step by building a blockchain game. Each lesson is simple and focused on ONE concept.

**By**: ETH JKT

---

## Learning Path

```
Setup Remix & MetaMask
    ↓
Solidity 101: Basic Data Types (One at a time!)
    ↓
Solidity 102: Structs & Enums
    ↓
Solidity 103: Mappings & Arrays
    ↓
Solidity 104: Modifiers & Events
    ↓
Solidity 105: Payable & Complete LiskGarden
```

---

## Setup: Remix IDE & MetaMask

### 1. Open Remix IDE

1. Go to [https://remix.ethereum.org](https://remix.ethereum.org)
2. Click "File Explorer" (left side)
3. Create a new file called `LiskGarden.sol`
4. You're ready!

### 2. Setup MetaMask

1. Install MetaMask from [https://metamask.io](https://metamask.io)
2. Create a new wallet (save your seed phrase safely!)
3. Add Lisk Sepolia Network:
   - Network Name: `Lisk Sepolia Testnet`
   - RPC URL: `https://rpc.sepolia-api.lisk.com`
   - Chain ID: `4202`
   - Currency: `ETH`
   - Explorer: `https://sepolia-blockscout.lisk.com`

4. Get test ETH from [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)

### 3. Connect Remix to MetaMask

1. In Remix, click "Deploy & Run Transactions" (left side)
2. Select "Injected Provider - MetaMask"
3. Click "Connect" in MetaMask
4. Done!

---

## Solidity 101: Basic Data Types

We'll learn one data type at a time using plant examples.

### 1. String (Text)

**What it is:** Stores text/words like "Rose" or "Hello World"

**Why you need it:** For names, descriptions, messages - anything readable by humans

Create a new file `LearnString.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnString {
    // String variable to store plant name
    string public plantName;

    // Constructor sets initial value
    constructor() {
        plantName = "Rose";
    }

    // Function to change the name
    function changeName(string memory _newName) public {
        plantName = _newName;
    }
}
```

**Key Points:**

- `string public plantName` - creates readable text variable
- `constructor()` - runs once when deployed
- `memory` - temporary storage for function inputs
- Always use double quotes: `"text here"`

**Common Uses:**
- Token names: `"USD Coin"`
- NFT descriptions
- Error messages
- User data

**Try it:**
1. Deploy → Click `plantName` → See "Rose"
2. Type "Tulip" in `changeName` → Click
3. Click `plantName` → Now "Tulip"!

---

### 2. Number (uint256)

**What it is:** Stores whole numbers from 0 to massive (2^256-1)

**Why you need it:** Everything in blockchain - balances, prices, IDs, timestamps, counters

Create `LearnNumber.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnNumber {
    // Numbers for plant data
    uint256 public plantId;
    uint256 public waterLevel;

    constructor() {
        plantId = 1;
        waterLevel = 100;
    }

    // Function to change plant ID
    function changePlantId(uint256 _newId) public {
        plantId = _newId;
    }

    // Function to add water
    function addWater() public {
        waterLevel = waterLevel + 10;
        // Can also write: waterLevel += 10;
    }
}
```

**Key Points:**

- `uint256` - unsigned integer (no negative numbers)
- `uint8` - smaller number (0-255, saves gas)
- Math: `+` `-` `*` `/` `%`
- Shortcuts: `+=` `-=` `++` `--`

**Common Uses:**
- Token balances: `1000000`
- Prices: `0.001 ETH`
- IDs: `plantId = 42`
- Counters: `totalUsers`
- Time: `block.timestamp`

**Try it:**
1. Deploy → Click `waterLevel` → See 100
2. Click `addWater` 3 times
3. Click `waterLevel` → Now 130!

---

### 3. Boolean (True/False)

**What it is:** Only two values - `true` or `false` (like a light switch: ON/OFF)

**Why you need it:** Every decision in code - status checks, permissions, conditions

Create `LearnBoolean.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnBoolean {
    // Boolean variables for status
    bool public isAlive;
    bool public isBlooming;

    constructor() {
        isAlive = true;
        isBlooming = false;
    }

    // Function to change status
    function changeStatus(bool _status) public {
        isAlive = _status;
    }

    // Function to make it bloom
    function bloom() public {
        isBlooming = true;
    }
}
```

**Key Points:**

- `bool` - only `true` or `false`
- Used in `if` statements: `if (isAlive == true) { ... }`
- Foundation of all decision-making logic

**Common Uses:**
- Status: `isPaused`, `isActive`
- Permissions: `isAdmin`, `hasAccess`
- Voting: `hasVoted`
- Existence: `exists`

**Try it:**
1. Deploy → Click `isAlive` → See true
2. Click `isBlooming` → See false
3. Click `bloom` → Now true!

---

### 4. Address (Wallet Address)

**What it is:** Stores Ethereum wallet addresses (20 bytes, looks like 0x742d35Cc...)

**Why you need it:** To identify who owns what, who sent transactions, and where to send payments

Create `LearnAddress.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnAddress {
    // Address variable for owner
    address public owner;
    address public gardener;

    constructor() {
        owner = msg.sender;  // msg.sender = your wallet address
    }

    // Function to set gardener
    function setGardener(address _gardener) public {
        gardener = _gardener;
    }
}
```

**Key Points:**

- `address` - stores wallet addresses (0x742d35Cc...)
- `msg.sender` - the address calling the function
- Used for ownership, payments, access control

**Try it:**
1. Deploy → Click `owner` → See your wallet address!
2. Copy any address → Paste in `setGardener`
3. Click `gardener` → See that address

---

### 5. All Together - Simple Plant

Now combine everything in `SimplePlant.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SimplePlant {
    // All data types together
    string public plantName;
    uint256 public waterLevel;
    bool public isAlive;
    address public owner;
    uint256 public plantedTime;

    constructor() {
        plantName = "Rose";
        waterLevel = 100;
        isAlive = true;
        owner = msg.sender;
        plantedTime = block.timestamp;
    }

    function water() public {
        waterLevel = 100;
    }

    function getAge() public view returns (uint256) {
        return block.timestamp - plantedTime;
    }
}
```

**Explanation:**

**Data Types Combined:**
- `string plantName` - stores the plant's name ("Rose")
- `uint256 waterLevel` - tracks water amount (0-100)
- `bool isAlive` - plant status (true/false)
- `address owner` - who owns this plant (deployer's wallet)
- `uint256 plantedTime` - when plant was created

**Special Variables:**
- `msg.sender` - wallet address calling the function
- `block.timestamp` - current time in seconds (Unix timestamp)

**Function Types:**
- `public` - anyone can call this function
- `view` - reads data but doesn't change state (FREE to call!)
- `returns (uint256)` - tells Solidity this function returns a number
- `return` - sends value back to caller

**How It Works:**
1. Constructor runs once when deployed → sets all initial values
2. `water()` refills water to 100 (changes state)
3. `getAge()` calculates age by subtracting planted time from now (read-only)

**Try it:**
1. Deploy it
2. Click all variables → See initial values
3. Click `water` → Refills water to 100
4. Wait 1 minute → Click `getAge` → See 60 seconds!
5. Notice: `getAge` is FREE (view function, no MetaMask popup)

---

## Solidity 102: Structs & Enums

Learn to organize data better.

### 1. Enum (Named Numbers)

**What it is:** Creates readable names for numbers (SEED=0, SPROUT=1, GROWING=2, BLOOMING=3)

**Why you need it:** Makes code easier to read than raw numbers. Perfect for stages, status, categories

Create `LearnEnum.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEnum {
    // Enum for growth stages
    enum GrowthStage {
        SEED,      // 0
        SPROUT,    // 1
        GROWING,   // 2
        BLOOMING   // 3
    }

    // Variable using enum
    GrowthStage public currentStage;

    constructor() {
        currentStage = GrowthStage.SEED;
    }

    // Function to grow
    function grow() public {
        if (currentStage == GrowthStage.SEED) {
            currentStage = GrowthStage.SPROUT;
        }
        else if (currentStage == GrowthStage.SPROUT) {
            currentStage = GrowthStage.GROWING;
        }
        else if (currentStage == GrowthStage.GROWING) {
            currentStage = GrowthStage.BLOOMING;
        }
    }
}
```

**Explanation:**

- `enum` = creates named numbers (makes code easier to read)
- `GrowthStage.SEED` = 0, `SPROUT` = 1, `GROWING` = 2, `BLOOMING` = 3
- `GrowthStage public currentStage` = variable of type GrowthStage (enum)
- `if (currentStage == GrowthStage.SEED)` = compares enum values
- Much better than using 0, 1, 2, 3 directly!

**Try it:**
1. Deploy it
2. Click `currentStage` → See 0 (SEED)
3. Click `grow` → Confirm
4. Click `currentStage` → See 1 (SPROUT)
5. Keep clicking `grow` to see it change!

---

### 2. Struct (Group of Data)

**What it is:** Groups related data into one custom type (like a template for Plants)

**Why you need it:** Cleaner than managing separate variables. Organize complex data together

Create `LearnStruct.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnStruct {
    // Enum
    enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }

    // Struct groups related data
    struct Plant {
        uint256 id;
        address owner;
        GrowthStage stage;
        uint8 waterLevel;
        bool isAlive;
    }

    // One plant variable
    Plant public myPlant;

    constructor() {
        myPlant = Plant({
            id: 1,
            owner: msg.sender,
            stage: GrowthStage.SEED,
            waterLevel: 100,
            isAlive: true
        });
    }

    function water() public {
        myPlant.waterLevel = 100;
    }

    function grow() public {
        if (myPlant.stage == GrowthStage.SEED) {
            myPlant.stage = GrowthStage.SPROUT;
        }
    }
}
```

**Explanation:**

- `struct Plant { ... }` = creates a new custom type that groups related data
- Like creating a template: every Plant has id, owner, stage, waterLevel, isAlive
- `Plant public myPlant` = creates a variable of type Plant
- `myPlant = Plant({ ... })` = fills the struct with data (using names)
- `myPlant.waterLevel = 100` = access and change a specific field
- `myPlant.stage` = access a specific field to read it

**Try it:**
1. Deploy it
2. Click `myPlant` → See all data: id=1, your address, stage=0, water=100, alive=true
3. Click `water` and `grow` to change the data
4. Click `myPlant` again to see changes!

---

## Solidity 103: Mappings & Arrays

Learn to manage multiple plants.

### 1. Mapping (Dictionary)

**What it is:** Like a dictionary - maps keys to values (plantId → owner, plantId → water level)

**Why you need it:** Associate data with unique identifiers. Fast lookups by key

Create `LearnMapping.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnMapping {
    // Mapping: plantId => waterLevel
    mapping(uint256 => uint8) public plantWater;

    // Mapping: plantId => owner
    mapping(uint256 => address) public plantOwner;

    function addPlant(uint256 _plantId) public {
        plantWater[_plantId] = 100;
        plantOwner[_plantId] = msg.sender;
    }

    function waterPlant(uint256 _plantId) public {
        plantWater[_plantId] = 100;
    }
}
```

**Explanation:**

- `mapping(uint256 => uint8)` = like a dictionary, maps plantId (key) to waterLevel (value)
- `mapping(uint256 => address)` = maps plantId to owner address
- `plantWater[_plantId] = 100` = sets water level for specific plant ID
- `plantOwner[_plantId] = msg.sender` = sets owner for specific plant ID
- `public` on mapping auto-creates a getter function

**Try it:**
1. Deploy it
2. Type `1` in `addPlant` box → Click it
3. Type `2` in `addPlant` box → Click it
4. Type `1` in `plantWater` box → See 100
5. Type `2` in `plantWater` box → See 100
6. Now you have 2 plants!

---

### 2. Array (List)

**What it is:** Ordered list that can grow in size ([1, 2, 3, ...])

**Why you need it:** Store collections you can iterate over. Get all items at once

Create `LearnArray.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnArray {
    // Array to store plant IDs
    uint256[] public allPlantIds;

    // Add a plant
    function addPlant(uint256 _plantId) public {
        allPlantIds.push(_plantId);
    }

    // Get total plants
    function getTotalPlants() public view returns (uint256) {
        return allPlantIds.length;
    }

    // Get all plant IDs
    function getAllPlants() public view returns (uint256[] memory) {
        return allPlantIds;
    }
}
```

**Explanation:**

- `uint256[]` = dynamic array (list) that can grow in size
- `allPlantIds.push(_plantId)` = adds an element to end of array
- `allPlantIds.length` = returns how many elements in array
- `allPlantIds[0]` = accesses first element (arrays start at index 0!)
- `returns (uint256[] memory)` = returns entire array

**Try it:**
1. Deploy it
2. Add plants with IDs: 1, 2, 3
3. Click `getTotalPlants` → See 3
4. Click `getAllPlants` → See [1, 2, 3]

---

### 3. Mapping + Struct (Multiple Plants)

**What it is:** Combines mapping with struct to store many complex items (plantId → Plant struct)

**Why you need it:** Manage multiple items with complex data. Real-world smart contract pattern

Create `MultiplePlants.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MultiplePlants {
    enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }

    struct Plant {
        uint256 id;
        address owner;
        GrowthStage stage;
        uint8 waterLevel;
        bool exists;
    }

    // Mapping to store plants
    mapping(uint256 => Plant) public plants;

    // Counter
    uint256 public plantCounter;

    // Add a new plant
    function addPlant() public returns (uint256) {
        plantCounter++;

        plants[plantCounter] = Plant({
            id: plantCounter,
            owner: msg.sender,
            stage: GrowthStage.SEED,
            waterLevel: 100,
            exists: true
        });

        return plantCounter;
    }

    // Water a plant
    function waterPlant(uint256 _plantId) public {
        plants[_plantId].waterLevel = 100;
    }

    // Get plant info
    function getPlant(uint256 _plantId) public view returns (Plant memory) {
        return plants[_plantId];
    }
}
```

**Explanation:**

- `mapping(uint256 => Plant) public plants` = maps plantId to Plant struct
- `plantCounter++` = increases counter by 1 (creates unique IDs)
- `plants[plantCounter] = Plant({ ... })` = stores new plant in mapping
- `returns (uint256)` = function returns the new plant ID
- `returns (Plant memory)` = function returns a copy of the Plant struct
- Combines mapping + struct to manage many plants!

**Try it:**
1. Deploy it
2. Click `addPlant` → Returns plantId=1
3. Click `addPlant` again → Returns plantId=2
4. Type `1` in `getPlant` → See plant #1 data
5. Type `2` in `getPlant` → See plant #2 data
6. Type `1` in `waterPlant` → Water plant #1!

---

## Solidity 104: Modifiers & Events

Add safety and communication.

### 1. Require (Validation)

**What it is:** Security guard that checks conditions before executing code

**Why you need it:** Prevent unauthorized actions. Validate inputs. Essential for security

Create `LearnRequire.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnRequire {
    mapping(uint256 => address) public plantOwner;
    mapping(uint256 => uint8) public waterLevel;

    function addPlant(uint256 _plantId) public {
        plantOwner[_plantId] = msg.sender;
        waterLevel[_plantId] = 100;
    }

    function waterPlant(uint256 _plantId) public {
        // Check if caller owns this plant
        require(plantOwner[_plantId] == msg.sender, "Not your plant!");

        waterLevel[_plantId] = 100;
    }
}
```

**Explanation:**

- `require(condition, "error message")` = checks if condition is true
- If condition is FALSE → transaction fails and shows error message
- If condition is TRUE → code continues to next line
- `plantOwner[_plantId] == msg.sender` = checks if caller owns the plant
- Used for validation and security checks

**Try it:**
1. Deploy it
2. Add plant with ID=1
3. Try to water it → SUCCESS (you own it)
4. Switch to another account in MetaMask
5. Try to water plant #1 → FAILS with "Not your plant!"

---

### 2. Modifier (Reusable Check)

**What it is:** Reusable validation wrapper you can apply to multiple functions

**Why you need it:** Avoid repeating `require` checks. Cleaner code. DRY principle (Don't Repeat Yourself)

Create `LearnModifier.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnModifier {
    address public owner;
    mapping(uint256 => address) public plantOwner;
    mapping(uint256 => uint8) public waterLevel;
    uint256 public ownerActionCount;

    constructor() {
        owner = msg.sender;
    }

    // Modifier: only owner can call
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner!");
        _;
    }

    // Modifier: must own plant
    modifier onlyPlantOwner(uint256 _plantId) {
        require(plantOwner[_plantId] == msg.sender, "Not your plant!");
        _;
    }

    function addPlant(uint256 _plantId) public {
        plantOwner[_plantId] = msg.sender;
        waterLevel[_plantId] = 100;
    }

    // Only owner can call this
    function ownerFunction() public onlyOwner {
        ownerActionCount++;
    }

    // Only plant owner can water
    function waterPlant(uint256 _plantId) public onlyPlantOwner(_plantId) {
        waterLevel[_plantId] = 100;
    }
}
```

**Explanation:**

- `modifier onlyOwner() { ... }` = creates a reusable check
- `_` = placeholder where the function code will run
- `function ownerFunction() public onlyOwner` = applies the modifier
- Modifier runs BEFORE function (checks condition first)
- `ownerActionCount++` = increments counter (only owner can do this)
- Cleaner than writing `require` in every function!
- Can use multiple modifiers on one function

**Try it:**
1. Deploy it
2. Click `ownerActionCount` → See 0
3. Click `ownerFunction` → SUCCESS (you're owner)
4. Click `ownerActionCount` → Now 1!
5. Switch account → Try `ownerFunction` → FAILS with "Only owner!"
6. Add plant with ID=1, try watering it → SUCCESS
7. Switch account → Try watering plant #1 → FAILS with "Not your plant!"

---

### 3. Events (Communication)

**What it is:** Broadcasts logs about what happened in your contract (stored on blockchain)

**Why you need it:** Frontends listen for real-time updates. Track history. Debugging tool

Create `LearnEvents.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEvents {
    // Event declaration
    event PlantAdded(address indexed owner, uint256 indexed plantId);
    event PlantWatered(uint256 indexed plantId, uint8 waterLevel);

    mapping(uint256 => address) public plantOwner;
    uint256 public plantCounter;

    function addPlant() public {
        plantCounter++;
        plantOwner[plantCounter] = msg.sender;

        // Emit event
        emit PlantAdded(msg.sender, plantCounter);
    }

    function waterPlant(uint256 _plantId) public {
        // Emit event
        emit PlantWatered(_plantId, 100);
    }
}
```

**Explanation:**

- `event PlantAdded(...)` = declares an event (what data to log)
- `indexed` = makes parameter searchable (max 3 indexed parameters)
- `emit PlantAdded(msg.sender, plantCounter)` = fires the event
- Events are stored on blockchain but DON'T cost gas to read
- Frontends can listen to events in real-time
- Used for: logging, notifications, tracking history

**Try it:**
1. Deploy it
2. Click `addPlant`
3. Look at the transaction in Remix console
4. Click "logs" → See `PlantAdded` event!
5. Click `waterPlant` with ID=1
6. See `PlantWatered` event in logs!

---

## Solidity 105: Payable & Complete LiskGarden

Finally, add money (ETH) and build the complete game!

### 1. Payable Function

**What it is:** Keyword that allows functions to receive ETH (`msg.value`)

**Why you need it:** Accept payments, donations, rewards. Without it, sending ETH fails

Create `LearnPayable.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnPayable {
    uint256 public plantCounter;

    // Payable function can receive ETH
    function buyPlant() public payable returns (uint256) {
        require(msg.value >= 0.001 ether, "Need 0.001 ETH");

        plantCounter++;
        return plantCounter;
    }

    // Check contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Explanation:**

- `payable` = keyword that allows function to receive ETH
- `msg.value` = amount of ETH sent with the transaction (in wei)
- `0.001 ether` = compiler converts to wei (1 ether = 10^18 wei)
- `require(msg.value >= 0.001 ether)` = checks minimum payment
- `address(this).balance` = contract's ETH balance
- Without `payable`, sending ETH will fail!

**Try it:**
1. Deploy it
2. In Remix, find "VALUE" field (above Deploy button)
3. Enter `1` and select `milliether` (= 0.001 ETH)
4. Click `buyPlant` → Confirm in MetaMask
5. Click `getBalance` → See 0.001 ETH in contract!

---

### 2. Sending ETH

**What it is:** Send ETH from contract to an address using `.call{value: amount}("")`

**Why you need it:** Pay rewards, refunds, withdrawals. Always check success!

Create `LearnSendETH.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnSendETH {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Receive ETH
    function deposit() public payable {}

    // Send ETH to someone
    function sendReward(address _to) public {
        require(msg.sender == owner, "Only owner");

        // Send 0.001 ETH
        (bool success, ) = _to.call{value: 0.001 ether}("");
        require(success, "Transfer failed");
    }

    // Check balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Explanation:**

- `function deposit() public payable {}` = accepts ETH with no code (just receives)
- `_to.call{value: 0.001 ether}("")` = sends ETH to address
- `(bool success, ) = ...` = captures whether transfer succeeded
- `require(success, "Transfer failed")` = reverts if send failed
- `.call` is the modern, safe way to send ETH
- Old ways: `.transfer()` and `.send()` are NOT recommended

**Try it:**
1. Deploy it
2. Send some ETH using `deposit` (with VALUE field)
3. Click `getBalance` → See your deposit
4. Use `sendReward` to send 0.001 ETH to an address!

---

### 3. Complete LiskGarden Game

**What it is:** Full blockchain game combining ALL concepts - plant seeds, water plants, harvest for profit

**Why you need it:** Real-world example showing how everything works together

Now the FINAL contract! This is everything combined:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LiskGarden {
    // Enums
    enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }

    // Structs
    struct Plant {
        uint256 id;
        address owner;
        GrowthStage stage;
        uint256 plantedDate;
        uint256 lastWatered;
        uint8 waterLevel;
        bool exists;
        bool isDead;
    }

    // State variables
    mapping(uint256 => Plant) public plants;
    mapping(address => uint256[]) public userPlants;
    uint256 public plantCounter;
    address public owner;

    // Constants
    uint256 public constant PLANT_PRICE = 0.001 ether;
    uint256 public constant HARVEST_REWARD = 0.003 ether;
    uint256 public constant STAGE_DURATION = 1 minutes;
    uint256 public constant WATER_DEPLETION_TIME = 30 seconds;
    uint8 public constant WATER_DEPLETION_RATE = 2;

    // Events
    event PlantSeeded(address indexed owner, uint256 indexed plantId);
    event PlantWatered(uint256 indexed plantId, uint8 newWaterLevel);
    event PlantHarvested(uint256 indexed plantId, address indexed owner, uint256 reward);
    event StageAdvanced(uint256 indexed plantId, GrowthStage newStage);
    event PlantDied(uint256 indexed plantId);

    constructor() {
        owner = msg.sender;
    }

    // Plant a seed
    function plantSeed() external payable returns (uint256) {
        require(msg.value >= PLANT_PRICE, "Need 0.001 ETH to plant");

        plantCounter++;
        uint256 newPlantId = plantCounter;

        plants[newPlantId] = Plant({
            id: newPlantId,
            owner: msg.sender,
            stage: GrowthStage.SEED,
            plantedDate: block.timestamp,
            lastWatered: block.timestamp,
            waterLevel: 100,
            exists: true,
            isDead: false
        });

        userPlants[msg.sender].push(newPlantId);

        emit PlantSeeded(msg.sender, newPlantId);

        return newPlantId;
    }

    // Calculate current water level
    function calculateWaterLevel(uint256 plantId) public view returns (uint8) {
        Plant storage plant = plants[plantId];

        if (!plant.exists || plant.isDead) {
            return 0;
        }

        uint256 timeSinceWatered = block.timestamp - plant.lastWatered;
        uint256 depletionIntervals = timeSinceWatered / WATER_DEPLETION_TIME;

        uint256 waterLost = depletionIntervals * WATER_DEPLETION_RATE;

        if (waterLost >= plant.waterLevel) {
            return 0;
        }

        return plant.waterLevel - uint8(waterLost);
    }

    // Update water level and check if plant died
    function updateWaterLevel(uint256 plantId) internal {
        Plant storage plant = plants[plantId];

        uint8 currentWater = calculateWaterLevel(plantId);
        plant.waterLevel = currentWater;

        if (currentWater == 0 && !plant.isDead) {
            plant.isDead = true;
            emit PlantDied(plantId);
        }
    }

    // Water a plant
    function waterPlant(uint256 plantId) external {
        Plant storage plant = plants[plantId];
        require(plant.exists, "Plant doesn't exist");
        require(plant.owner == msg.sender, "Not your plant");
        require(!plant.isDead, "Plant is dead");

        plant.waterLevel = 100;
        plant.lastWatered = block.timestamp;

        emit PlantWatered(plantId, 100);

        updatePlantStage(plantId);
    }

    // Update plant stage based on time
    function updatePlantStage(uint256 plantId) public {
        Plant storage plant = plants[plantId];
        require(plant.exists, "Plant doesn't exist");

        // Update water level first
        updateWaterLevel(plantId);

        // Dead plants can't grow
        if (plant.isDead) {
            return;
        }

        uint256 timeSincePlanted = block.timestamp - plant.plantedDate;
        GrowthStage oldStage = plant.stage;

        if (timeSincePlanted >= STAGE_DURATION && plant.stage == GrowthStage.SEED) {
            plant.stage = GrowthStage.SPROUT;
        }
        else if (timeSincePlanted >= 2 * STAGE_DURATION && plant.stage == GrowthStage.SPROUT) {
            plant.stage = GrowthStage.GROWING;
        }
        else if (timeSincePlanted >= 3 * STAGE_DURATION && plant.stage == GrowthStage.GROWING) {
            plant.stage = GrowthStage.BLOOMING;
        }

        if (plant.stage != oldStage) {
            emit StageAdvanced(plantId, plant.stage);
        }
    }

    // Harvest a blooming plant
    function harvestPlant(uint256 plantId) external {
        Plant storage plant = plants[plantId];
        require(plant.exists, "Plant doesn't exist");
        require(plant.owner == msg.sender, "Not your plant");
        require(!plant.isDead, "Plant is dead");

        updatePlantStage(plantId);

        require(plant.stage == GrowthStage.BLOOMING, "Plant not ready");

        plant.exists = false;

        emit PlantHarvested(plantId, msg.sender, HARVEST_REWARD);

        (bool success, ) = msg.sender.call{value: HARVEST_REWARD}("");
        require(success, "Transfer failed");
    }

    // Get plant info with current water level
    function getPlant(uint256 plantId) external view returns (Plant memory) {
        Plant memory plant = plants[plantId];
        plant.waterLevel = calculateWaterLevel(plantId);
        return plant;
    }

    // Get user's plants
    function getUserPlants(address user) external view returns (uint256[] memory) {
        return userPlants[user];
    }

    // Owner can withdraw contract balance
    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    // Receive ETH
    receive() external payable {}
}
```

**Explanation of Key Parts:**

- `constant` = value that never changes (saves gas)
- `internal` = function can only be called from inside contract
- `external` = function can only be called from outside
- `Plant storage plant` = points to blockchain storage (changes are saved)
- `Plant memory plant` = creates temporary copy (changes NOT saved)
- `receive() external payable {}` = receives plain ETH transfers

**Game Economics:**
- Pay 0.001 ETH to plant → Wait 3 minutes → Harvest 0.003 ETH
- Profit per plant: 0.002 ETH!
- Must water plants or they die (lose 2% water every 30 seconds)

### How to Play LiskGarden

1. **Plant a Seed (Costs 0.001 ETH)**
   - Set VALUE to 0.001 ETH
   - Click `plantSeed` → Get plantId back

2. **Wait for Growth**
   - Wait 1 minute → Plant becomes SPROUT
   - Wait 2 minutes total → GROWING
   - Wait 3 minutes total → BLOOMING

3. **Water Your Plant**
   - Click `waterPlant` with your plantId
   - Keeps it alive!

4. **Harvest When Ready**
   - When BLOOMING, click `harvestPlant`
   - Receive 0.003 ETH!
   - Profit: 0.002 ETH per plant!

5. **Don't Let It Die**
   - Plants lose 2% water every 30 seconds
   - At 0% water → Plant dies!
   - Dead plants can't be harvested

---

## Deploying to Lisk Sepolia

### Using Remix

1. **Compile**
   - Click "Solidity Compiler"
   - Click "Compile LiskGarden.sol"
   - Green checkmark = Success!

2. **Deploy**
   - Make sure MetaMask is on Lisk Sepolia
   - Make sure you have test ETH
   - Click "Deploy & Run Transactions"
   - Select "Injected Provider - MetaMask"
   - Click "Deploy"
   - Confirm in MetaMask
   - Wait ~10 seconds
   - Your contract is live!

3. **Interact**
   - Contract appears under "Deployed Contracts"
   - Click functions to use them
   - Share the contract address with friends!

4. **View on Explorer**
   - Copy your contract address
   - Go to https://sepolia-blockscout.lisk.com
   - Paste address
   - See your contract on the blockchain!

---

## Professional Development with Hardhat

Now let's set up a professional development environment using the latest Hardhat 3!

### Why Use Hardhat?

**Remix is great for learning, but Hardhat is better for:**
- ✅ Writing automated tests
- ✅ Deploying to multiple networks
- ✅ Working with teams
- ✅ Version control (Git)
- ✅ Professional workflows

### Step 1: Install Prerequisites

**You need:**
- Node.js version 18 or higher
- npm (comes with Node.js)
- A code editor (VS Code recommended)

**Check your version:**
```bash
node --version
# Should show v18.0.0 or higher

npm --version
# Should show 7.0.0 or higher
```

**Don't have Node.js?**
- Download from [https://nodejs.org](https://nodejs.org)
- Choose the LTS version
- Install it
- Restart your terminal

---

### Step 2: Create Your Project

**1. Create a new folder:**
```bash
mkdir lisk-garden-hardhat
cd lisk-garden-hardhat
```

**2. Initialize npm:**
```bash
npm init -y
```

**Explanation:**
- `mkdir` = creates a new folder
- `cd` = enters the folder
- `npm init -y` = creates package.json (project config file)
- `-y` = says "yes" to all questions automatically

**3. Install Hardhat:**
```bash
npm install --save-dev hardhat
```

**Explanation:**
- `npm install` = downloads and installs packages
- `--save-dev` = saves it as development dependency
- Takes ~30 seconds to install

---

### Step 3: Initialize Hardhat Project

**1. Run Hardhat initialization:**
```bash
npx hardhat init
```

**2. You'll see the Hardhat 3 wizard:**

```
 _   _               _   _           _     _____
| | | |             | | | |         | |   |____ |
| |_| | __ _ _ __ __| |_| |__   __ _| |_      / /
|  _  |/ _` | '__/ _` | '_ \ / _` | __|     \ \
| | | | (_| | | | (_| | | | | (_| | |_  .___/ /
\_| |_/\__,_|_|  \__,_|_| |_|\__,_|\__| \____/

👷 Welcome to Hardhat v3.0.0 👷‍

? Which version of Hardhat would you like to use? › hardhat-3
? Where would you like to initialize the project? › .
  Please provide either a relative or an absolute path: .

? What type of project would you like to initialize? › node-test-runner-viem
  Hardhat only supports ESM projects. Would you like to turn your project into ESM? (Y/n) › true
✨ Template files copied ✨

? You need to install the necessary dependencies using the following command:
npm install --save-dev "@nomicfoundation/hardhat-toolbox-viem@^3.0.0" ...

Do you want to run it now? (Y/n) › true
```

**3. Select these options:**
- **Version**: Choose `hardhat-3` (latest!)
- **Path**: Just press Enter (uses current directory)
- **Project type**: Choose `node-test-runner-viem`
- **Turn into ESM**: `Y` (yes - this is modern JavaScript)
- **Install dependencies**: `Y` (yes)

**Explanation:**
- `hardhat-3` = the latest version (released 2025)
- ESM = ECMAScript Modules (modern JavaScript standard)
- `node-test-runner-viem` = uses Node.js built-in test runner + viem
- Viem = modern, lightweight library (faster than ethers.js)

**4. Wait for installation:**
- Takes ~1-2 minutes
- Installs 110+ packages
- You'll see: `added 110 packages, and audited 170 packages in 37s`
- Normal output - don't worry!

**5. Installation complete when you see:**
```
✨ Dependencies installed ✨
Give Hardhat a star on GitHub if you're enjoying it! 🌟✨

https://github.com/NomicFoundation/hardhat
```

---

### Step 4: Project Structure

**After setup, you'll see:**
```
lisk-garden-hardhat/
├── contracts/           # Your smart contracts go here
│   └── Counter.sol     # Sample contract (delete this)
│   └── Counter.t.sol   # Sample test in Solidity (delete this)
├── ignition/           # Deployment scripts (Hardhat 3 Ignition)
│   └── modules/
│       └── Counter.ts  # Sample deployment (delete this)
├── test/               # Test files in TypeScript
│   └── Counter.ts      # Sample test (delete this)
├── scripts/            # Custom scripts
│   └── send-op-tx.ts   # Sample script (we'll create our own)
├── node_modules/       # Installed packages (don't touch!)
├── hardhat.config.ts   # Main configuration file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── .gitignore          # Git ignore file
```

**Explanation:**
- `contracts/` = Solidity smart contracts go here
- `Counter.sol` = sample contract using Hardhat 3 features
- `Counter.t.sol` = Solidity test (Foundry-style, new in Hardhat 3!)
- `ignition/modules/` = deployment scripts using Hardhat Ignition
- `test/` = TypeScript/JavaScript tests
- `scripts/` = custom automation scripts
- `hardhat.config.ts` = network config, compiler settings (uses ESM imports)
- `node_modules/` = installed packages (Git ignores this)

**Note:** Hardhat 3 now supports both Solidity tests (`.t.sol`) AND TypeScript tests!

---

### Step 5: Add LiskGarden Contract

**1. Delete the sample files:**
```bash
# Delete sample contracts
rm contracts/Counter.sol
rm contracts/Counter.t.sol

# Delete sample deployment
rm ignition/modules/Counter.ts

# Delete sample test
rm test/Counter.ts
```

**2. Create LiskGarden.sol:**
```bash
# On Windows:
type nul > contracts/LiskGarden.sol

# On Mac/Linux:
touch contracts/LiskGarden.sol
```

**3. Copy your LiskGarden code:**
- Open `contracts/LiskGarden.sol` in VS Code
- Copy the complete LiskGarden contract from section 105 above
- Paste it into the file
- Save the file (Ctrl+S or Cmd+S)

---

### Step 6: Configure for Lisk Sepolia

**1. Install dotenv (for secure keys):**
```bash
npm install --save-dev dotenv
```

**Explanation:**
- `dotenv` = loads secret keys from .env file
- Keeps your private key safe (not in code!)

**2. Create .env file:**
```bash
# On Windows:
type nul > .env

# On Mac/Linux:
touch .env
```

**3. Add your private key to .env:**
```env
PRIVATE_KEY=your_private_key_here
```

**How to get your private key:**
1. Open MetaMask
2. Click the 3 dots → Account Details
3. Click "Show private key"
4. Enter your password
5. Copy the private key
6. Paste in .env file

**⚠️ IMPORTANT:**
- NEVER share your private key!
- NEVER commit .env to Git!
- The .gitignore already protects it

**4. Update hardhat.config.ts:**

Open `hardhat.config.ts` and replace everything with:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatIgnitionViemPlugin, hardhatVerify],
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "lisk-sepolia": {
      type: "http",
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 4202,
    },
  },
  chainDescriptors: {
    4202: {
      name: "Lisk Sepolia",
      blockExplorers: {
        blockscout: {
          name: "Blockscout",
          url: "https://sepolia-blockscout.lisk.com/",
          apiUrl: "https://sepolia-blockscout.lisk.com/api",
        },
      },
    },
  },
  verify: {
    blockscout: {
      enabled: true,
    },
  },
};

export default config;

```

**Explanation:**
- `import` = loads packages (ESM/TypeScript style - new in Hardhat 3)
- `hardhatToolboxViemPlugin` = viem-based toolbox for Hardhat 3
- `hardhatIgnitionViemPlugin` = deployment plugin
- `hardhatVerify` = verification plugin for block explorers
- `plugins: [...]` = registers Hardhat 3 plugins
- `dotenv.config()` = loads .env file
- `solidity: "0.8.30"` = compiler version (matches our contract)
- `optimizer: enabled: true` = makes contract use less gas
- `type: "http"` = network type (required in Hardhat 3)
- `networks: "lisk-sepolia"` = Lisk testnet configuration
- `url` = RPC endpoint for Lisk Sepolia
- `accounts` = your private key from .env
- `chainId: 4202` = Lisk Sepolia chain ID
- `chainDescriptors` = tells Hardhat about Lisk Sepolia's block explorer
- `verify: { blockscout: { enabled: true } }` = enables Blockscout verification

---

### Step 7: Compile Your Contract

**1. Compile:**
```bash
npx hardhat compile
```

**Explanation:**
- Compiles your Solidity code to bytecode
- Creates TypeScript types automatically
- Checks for errors

**2. You should see:**
```
Compiled 1 Solidity file successfully
```

**3. Check artifacts folder:**
```
artifacts/
└── contracts/
    └── LiskGarden.sol/
        └── LiskGarden.json  # ABI and bytecode here!
```

---

### Step 8: Write Deployment Script

**1. Delete sample deployment:**
```bash
rm -rf ignition/modules/Lock.ts
```

**2. Create deployment script:**

Create `ignition/modules/LiskGarden.ts`:

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LiskGardenModule = buildModule("LiskGardenModule", (m) => {
  // Deploy LiskGarden contract
  const liskGarden = m.contract("LiskGarden");

  return { liskGarden };
});

export default LiskGardenModule;
```

**Explanation:**
- `buildModule` = Hardhat Ignition's way to deploy
- `m.contract("LiskGarden")` = deploys LiskGarden contract
- No constructor parameters needed (our contract has empty constructor)
- Returns the deployed contract instance

---

### Step 9: Get Test ETH

**You need test ETH on Lisk Sepolia!**

**Option 1: Direct Lisk Faucet**
1. Go to [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
2. Paste your wallet address
3. Click "Request tokens"
4. Wait 30 seconds
5. Check MetaMask!

**Option 2: Bridge from Ethereum Sepolia**
1. Get Sepolia ETH from [https://sepoliafaucet.com](https://sepoliafaucet.com)
2. Go to [https://sepolia-bridge.lisk.com](https://sepolia-bridge.lisk.com)
3. Bridge ETH from Sepolia to Lisk Sepolia
4. Wait ~5 minutes

---

### Step 10: Deploy to Lisk Sepolia!

**1. Deploy:**
```bash
npx hardhat ignition deploy ignition/modules/LiskGarden.ts --network lisk-sepolia
```

**Explanation:**
- `ignition deploy` = Hardhat 3's new deployment system
- `--network lisk-sepolia` = deploy to Lisk Sepolia (not local)

**2. You'll see:**
```
✔ Confirm deploy to network lisk-sepolia (4202)? … yes

Hardhat Ignition 🚀

Deploying [ LiskGardenModule ]

Batch #1
  Executed LiskGardenModule#LiskGarden

[ LiskGardenModule ] successfully deployed 🚀

Deployed Addresses

LiskGardenModule#LiskGarden - 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4
```

**3. SAVE YOUR CONTRACT ADDRESS!**
- Copy the deployed address
- You'll need it to interact with the contract

---

### Step 11: Verify Your Contract

**Verify on block explorer so everyone can see your code:**

```bash
npx hardhat verify --network lisk-sepolia 0xYourContractAddress
```

**Replace `0xYourContractAddress` with your actual deployed address!**

**You'll see:**
```
Successfully submitted source code for contract
contracts/LiskGarden.sol:LiskGarden at 0x742d35Cc...
https://sepolia-blockscout.lisk.com/address/0x742d35Cc...
```

**Explanation:**
- `verify` = uploads source code to block explorer
- People can read your code on Blockscout
- Makes your contract trustworthy!

---

### Step 12: Interact with Your Contract

**Create an interaction script:**

Create `scripts/interact.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4";

  // Get contract instance
  const LiskGarden = await ethers.getContractAt("LiskGarden", CONTRACT_ADDRESS);

  console.log("LiskGarden contract:", CONTRACT_ADDRESS);
  console.log("");

  // Get plant counter
  const plantCounter = await LiskGarden.plantCounter();
  console.log("Total plants:", plantCounter.toString());

  // Plant a seed (costs 0.001 ETH)
  console.log("\n🌱 Planting a seed...");
  const plantPrice = await LiskGarden.PLANT_PRICE();
  const tx = await LiskGarden.plantSeed({ value: plantPrice });
  await tx.wait();
  console.log("✅ Seed planted! Transaction:", tx.hash);

  // Get new plant ID
  const newPlantCounter = await LiskGarden.plantCounter();
  const plantId = newPlantCounter;
  console.log("Your plant ID:", plantId.toString());

  // Get plant details
  const plant = await LiskGarden.getPlant(plantId);
  console.log("\n🌿 Plant details:");
  console.log("  - ID:", plant.id.toString());
  console.log("  - Owner:", plant.owner);
  console.log("  - Stage:", plant.stage, "(0=SEED, 1=SPROUT, 2=GROWING, 3=BLOOMING)");
  console.log("  - Water Level:", plant.waterLevel.toString());
  console.log("  - Is Alive:", plant.isAlive);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Run it:**
```bash
npx hardhat run scripts/interact.ts --network lisk-sepolia
```

**You'll see:**
```
LiskGarden contract: 0x742d35Cc...

Total plants: 0

🌱 Planting a seed...
✅ Seed planted! Transaction: 0xabc123...
Your plant ID: 1

🌿 Plant details:
  - ID: 1
  - Owner: 0xYourAddress
  - Stage: 0 (SEED)
  - Water Level: 100
  - Is Alive: true
```

---

## Hardhat Commands Cheat Sheet

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Lisk Sepolia
npx hardhat ignition deploy ignition/modules/LiskGarden.ts --network lisk-sepolia

# Verify contract
npx hardhat verify --network lisk-sepolia <address>

# Run script
npx hardhat run scripts/interact.ts --network lisk-sepolia

# Clean artifacts
npx hardhat clean

# Get help
npx hardhat help
```

---

## What You Learned (Hardhat)

**Professional Setup:**
- ✅ Installed latest Hardhat 3
- ✅ Created TypeScript project
- ✅ Configured Lisk Sepolia network
- ✅ Secured private keys with .env

**Development Workflow:**
- ✅ Compiled contracts
- ✅ Deployed with Hardhat Ignition
- ✅ Verified on block explorer
- ✅ Interacted with TypeScript scripts

**Best Practices:**
- ✅ TypeScript for type safety
- ✅ Environment variables for secrets
- ✅ Compiler optimization enabled
- ✅ Professional project structure

---

## Quick Reference: All Concepts

### Basic Data Types
1. **String** - Text/words (`"Rose"`)
2. **uint256** - Numbers (balances, IDs, counters)
3. **bool** - True/false (status, permissions)
4. **address** - Wallet addresses (`msg.sender`)

### Data Organization
5. **Enum** - Named numbers (SEED=0, SPROUT=1)
6. **Struct** - Group related data (Plant template)
7. **Mapping** - Key→Value dictionary (plantId→owner)
8. **Array** - Ordered list (`push`, `.length`)

### Security & Control
9. **require** - Validation checks (reverts if false)
10. **modifier** - Reusable function wrappers
11. **Events** - Log blockchain activity (`indexed`)

### Money (ETH)
12. **payable** - Receive ETH (`msg.value`)
13. **Sending ETH** - `.call{value}("")` (check success!)

---

## What You Learned (Overall)

**Solidity 101:**
- ✅ String, Number, Boolean, Address
- ✅ Constructor and functions
- ✅ View functions

**Solidity 102:**
- ✅ Enums (named numbers)
- ✅ Structs (group data)

**Solidity 103:**
- ✅ Mappings (dictionaries)
- ✅ Arrays (lists)
- ✅ Storage vs Memory

**Solidity 104:**
- ✅ Require (validation)
- ✅ Modifiers (reusable checks)
- ✅ Events (logging)

**Solidity 105:**
- ✅ Payable functions
- ✅ Sending/receiving ETH
- ✅ Complete game!

---

## Next Session

In Session 4, we'll build a beautiful frontend for LiskGarden using React!

---

## Resources

- [Remix IDE](https://remix.ethereum.org)
- [Lisk Docs](https://docs.lisk.com)
- [Solidity Docs](https://docs.soliditylang.org)
- [Lisk Faucet](https://sepolia-faucet.lisk.com)
- [Block Explorer](https://sepolia-blockscout.lisk.com)

---

**#LiskGrowthGarden** | **#BuildOnLisk** | **#LearnSolidity**
