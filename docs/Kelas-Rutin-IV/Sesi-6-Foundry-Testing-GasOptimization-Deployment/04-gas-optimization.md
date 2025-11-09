---
id: gas-optimization-deployment
title: "Part 4: Optimasi & Deployment SimpleBank"
sidebar_label: "Part 4: Optimize & Deploy"
sidebar_position: 4
description: "Mengoptimasi gas usage SimpleBank, deployment ke Lisk Sepolia, verifikasi di Blockscout, dan production checklist."
---

# Part 4: Optimasi & Deployment SimpleBank

## 🎯 Tujuan Module

Setelah menyelesaikan module ini, Anda akan mampu:
- ✅ Memahami dan menerapkan gas optimization techniques
- ✅ Mengukur gas usage dengan gas snapshots
- ✅ Mengimplementasikan gas-saving patterns pada SimpleBank
- ✅ Men-deploy SimpleBank ke Lisk Sepolia testnet
- ✅ Memverifikasi contract di Blockscout
- ✅ Menggunakan production deployment checklist

---

## 💡 Why Gas Optimization Matters?

### Analogi: Gas = Biaya Bensin

**Berkendara dari Jakarta ke Bandung:**
```
Mobil boros (20L/100km):
- Bensin: 30 liter x Rp 15,000 = Rp 450,000
- Biaya tinggi! 💸

Mobil irit (8L/100km):
- Bensin: 12 liter x Rp 15,000 = Rp 180,000
- Hemat Rp 270,000! ✅

Lesson: Efficiency = uang hemat
```

**Smart Contract di Ethereum:**
```
Contract boros (200,000 gas):
- Gas: 200,000 x 50 gwei = 0.01 ETH
- Dengan ETH @ $3000: $30 per transaksi
- 100 users = $3,000 total cost! 💸

Contract irit (50,000 gas):
- Gas: 50,000 x 50 gwei = 0.0025 ETH
- Dengan ETH @ $3000: $7.50 per transaksi
- 100 users = $750 total cost
- Hemat $2,250! ✅

Lesson: Optimization = happy users
```

### Real Examples:

**Uniswap V3:**
- Setiap 1% gas reduction = millions of dollars saved for users
- Optimization adalah top priority

**OpenSea:**
- Gas optimization membuat NFT trading affordable
- Tanpa optimization = only whales bisa afford

**Takeaway: Optimize = Care about users** 💚

---

## 📊 Measure Current Gas Usage

### Step 1: Run Gas Report

```bash
forge test --gas-report
```

**Current SimpleBank gas usage:**
```
| Function             | min   | avg   | median | max   | # calls |
|---------------------|-------|-------|--------|-------|---------|
| deposit              | 45123 | 56234 | 56012  | 67345 | 15      |
| withdraw             | 32456 | 43567 | 43345  | 54678 | 10      |
| transfer             | 28901 | 39012 | 38890  | 49123 | 8       |
| getBalance           | 567   | 567   | 567    | 567   | 5       |
| getTotalDeposits     | 456   | 456   | 456    | 456   | 3       |
```

**Baseline established!** Now let's optimize.

### Step 2: Create Gas Snapshot

```bash
forge snapshot
```

Creates `.gas-snapshot` file:
```
SimpleBankTest:test_Deposit() (gas: 56789)
SimpleBankTest:test_Withdraw() (gas: 89234)
SimpleBankTest:test_Transfer() (gas: 112345)
...
```

**After optimization, compare:**
```bash
forge snapshot --diff
```

Shows before/after comparison! 📊

---

## ⚡ Gas Optimization Techniques

### Technique 1: Use `uint256` Instead of Smaller Types

**Why? EVM works in 32-byte words.**

**❌ Less efficient:**
```solidity
contract Inefficient {
    uint8 public count;      // Padded to 32 bytes anyway
    uint16 public total;     // Padded to 32 bytes
    uint128 public value;    // Padded to 32 bytes

    function increment() public {
        count++;  // Extra operations untuk mask bits
    }
}
```

**✅ More efficient:**
```solidity
contract Efficient {
    uint256 public count;    // Native 32 bytes
    uint256 public total;    // Native 32 bytes
    uint256 public value;    // Native 32 bytes

    function increment() public {
        count++;  // Direct operation, no masking
    }
}
```

**Gas savings: ~200 gas per operation**

**Exception:** Pack multiple small variables into one slot:
```solidity
contract Packed {
    uint128 public a;  // Slot 0 (first half)
    uint128 public b;  // Slot 0 (second half) ✅ Shared slot!
    uint256 public c;  // Slot 1
}
```

---

### Technique 2: Caching Storage Variables

**Analogy:**
```
Storage = Hard disk (expensive to access)
Memory   = RAM (cheap to access)

Reading storage 3 times:
  disk → disk → disk (3x expensive reads)

Caching in memory:
  disk → RAM → RAM → RAM (1x expensive + 2x cheap)
```

**❌ Inefficient (multiple storage reads):**
```solidity
function expensiveFunction() public {
    require(balances[msg.sender] > 0);
    require(balances[msg.sender] >= 1 ether);
    balances[msg.sender] -= 1 ether;
    // balances[msg.sender] read 3 times = 3 x SLOAD (2100 gas each)
    // Total: ~6300 gas just for reads
}
```

**✅ Efficient (cache in memory):**
```solidity
function cheaperFunction() public {
    uint256 userBalance = balances[msg.sender]; // 1x SLOAD (2100 gas)
    require(userBalance > 0);
    require(userBalance >= 1 ether);
    balances[msg.sender] = userBalance - 1 ether; // 1x SSTORE
    // Total: 2100 gas for read (saves 4200 gas!)
}
```

**Gas savings: ~4200 gas (67% reduction for reads!)**

---

### Technique 3: Use Custom Errors Instead of require Strings

**❌ Expensive (store error string):**
```solidity
require(amount > 0, "Amount must be greater than zero");
// String stored on-chain = expensive!
// Gas cost: ~2400 gas
```

**✅ Cheap (custom error):**
```solidity
error ZeroAmount();

if (amount == 0) revert ZeroAmount();
// No string storage!
// Gas cost: ~200 gas
```

**Gas savings: ~2200 gas per error (91% cheaper!)**

**We already did this!** ✅ SimpleBank uses custom errors.

---

### Technique 4: Use `calldata` Instead of `memory` for Read-Only Parameters

**❌ Expensive:**
```solidity
function processData(string memory data) public {
    // data copied to memory
    // Cost: ~1000 gas for copy
}
```

**✅ Cheap:**
```solidity
function processData(string calldata data) public {
    // data stays in calldata (no copy)
    // Cost: ~50 gas
}
```

**When to use `calldata`:**
- External functions only
- Parameter is read-only (not modified)
- Arrays, strings, structs

**Gas savings: ~950 gas per call**

---

### Technique 5: Use `++i` Instead of `i++` in Loops

**❌ Less efficient:**
```solidity
for (uint256 i = 0; i < 10; i++) {
    // i++ creates temporary variable
    // ~5 extra gas per iteration
}
```

**✅ More efficient:**
```solidity
for (uint256 i = 0; i < 10; ++i) {
    // ++i increments directly
    // No temporary variable
}
```

**Or even better - unchecked:**
```solidity
for (uint256 i = 0; i < 10;) {
    // ... code ...

    unchecked { ++i; }  // No overflow check
    // Solidity ^0.8.0 has auto overflow checks
    // In loops, we know i won't overflow
    // Saves ~30 gas per iteration
}
```

**Gas savings: ~30 gas per iteration**

---

### Technique 6: Short-Circuit with `&&` and `||`

**❌ All conditions evaluated:**
```solidity
if (expensiveCheck() && cheapCheck()) {
    // Both always execute
}
```

**✅ Short-circuit evaluation:**
```solidity
if (cheapCheck() && expensiveCheck()) {
    // If cheapCheck() false, expensiveCheck() not called!
    // Saves gas when first condition fails
}
```

**Order matters:**
```solidity
// ✅ Good: cheap first
if (amount > 0 && balances[msg.sender] >= amount) {
    // amount > 0 is cheap (memory read)
    // balances[...] is expensive (storage read)
}

// ❌ Bad: expensive first
if (balances[msg.sender] >= amount && amount > 0) {
    // Always reads storage, even if amount = 0
}
```

---

### Technique 7: Use Events Instead of Storage for Historical Data

**❌ Expensive (store on-chain):**
```solidity
struct Transaction {
    address from;
    address to;
    uint256 amount;
    uint256 timestamp;
}

Transaction[] public allTransactions; // Expensive storage!

function transfer(...) public {
    allTransactions.push(Transaction(...)); // ~20,000 gas per push
}
```

**✅ Cheap (use events):**
```solidity
event Transfer(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

function transfer(...) public {
    emit Transfer(msg.sender, to, amount, block.timestamp);
    // Only ~1,500 gas!
}

// Frontend can query events for history
// Events stored in logs (much cheaper)
```

**Gas savings: ~18,500 gas per transaction (93% cheaper!)**

**We already did this!** ✅ SimpleBank emits events.

---

## 🔄 Optimize SimpleBank Contract

Let's apply optimizations to SimpleBank:

### Create SimpleBankOptimized.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title SimpleBankOptimized
 * @notice Gas-optimized version of SimpleBank
 */
contract SimpleBankOptimized {
    // ============ Custom Errors (Already optimized!) ============

    error InsufficientBalance(uint256 requested, uint256 available);
    error ZeroAmount();
    error TransferFailed();

    // ============ State Variables ============

    mapping(address => uint256) public balances;

    // ============ Events (Already optimized!) ============

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    // ============ Functions ============

    function deposit() external payable {
        // Optimization: Use external instead of public
        // External = cheaper for external calls (calldata instead of memory)

        if (msg.value == 0) revert ZeroAmount();

        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        // Optimization: Cache storage variable
        uint256 userBalance = balances[msg.sender]; // 1x SLOAD

        if (amount == 0) revert ZeroAmount();

        if (userBalance < amount) {
            revert InsufficientBalance(amount, userBalance);
        }

        // CEI Pattern: Update state before transfer
        unchecked {
            // Safe: we checked userBalance >= amount above
            balances[msg.sender] = userBalance - amount;
        }

        // Transfer ETH
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) external {
        // Optimization: Cache storage variable
        uint256 senderBalance = balances[msg.sender]; // 1x SLOAD

        if (amount == 0) revert ZeroAmount();

        if (senderBalance < amount) {
            revert InsufficientBalance(amount, senderBalance);
        }

        // Update balances
        unchecked {
            // Safe: we checked senderBalance >= amount above
            balances[msg.sender] = senderBalance - amount;
        }
        balances[to] += amount; // 1x SLOAD, 1x SSTORE

        emit Transferred(msg.sender, to, amount);
    }

    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }

    function getTotalDeposits() external view returns (uint256) {
        return address(this).balance;
    }
}
```

**Key optimizations applied:**

1. ✅ `external` instead of `public` (cheaper for external calls)
2. ✅ Cache storage variables in memory
3. ✅ `unchecked` for safe arithmetic (no overflow checks)
4. ✅ Custom errors (already had this!)
5. ✅ Events instead of storage (already had this!)

---

## 📊 Compare Gas Usage

### Run Gas Comparison

```bash
# Original contract
forge test --gas-report --match-contract SimpleBankTest

# Optimized contract
forge test --gas-report --match-contract SimpleBankOptimizedTest
```

**Expected savings:**

| Function | Original | Optimized | Savings |
|----------|----------|-----------|---------|
| deposit  | 56,234   | 50,123    | ~11%    |
| withdraw | 43,567   | 38,234    | ~12%    |
| transfer | 39,012   | 34,567    | ~11%    |

**Total savings: ~10-12% gas reduction!** ⚡

### Snapshot Comparison

```bash
# Create snapshot for original
forge snapshot --snap original.snap

# Make optimizations
# ...

# Create snapshot for optimized
forge snapshot --snap optimized.snap

# Compare
forge snapshot --diff original.snap
```

**Output:**
```
testDeposit() (gas: -3111 ⬇️ 5.5%)
testWithdraw() (gas: -2765 ⬇️ 6.3%)
testTransfer() (gas: -2234 ⬇️ 5.7%)
```

Green numbers = savings! ✅

---

## 🚀 Deployment Scripts

### Create Deployment Script

Buat file `script/DeploySimpleBank.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {SimpleBank} from "../src/SimpleBank.sol";

/**
 * @title DeploySimpleBank
 * @notice Script untuk deploy SimpleBank contract
 */
contract DeploySimpleBank is Script {
    function run() external returns (SimpleBank) {
        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy contract
        SimpleBank bank = new SimpleBank();

        console.log("SimpleBank deployed to:", address(bank));

        // Stop broadcasting
        vm.stopBroadcast();

        return bank;
    }
}
```

**Script explanation:**

```solidity
contract DeploySimpleBank is Script {
```
- Deploy scripts inherit from `Script`
- Naming: `Deploy<ContractName>`

```solidity
vm.startBroadcast();
```
- Start recording transactions untuk broadcast
- Transactions akan di-sign dengan private key dari env

```solidity
SimpleBank bank = new SimpleBank();
```
- Deploy contract
- Returns deployed instance

```solidity
vm.stopBroadcast();
```
- Stop recording transactions

---

## 🌐 Deploy to Lisk Sepolia Testnet

**📚 Dokumentasi ini mengikuti best practices dari:**
- [Lisk Official Developer Docs](https://docs.lisk.com/building-on-lisk/deploying-smart-contract)
- Foundry + Blockscout integration
- Production-ready deployment workflow

### Step 1: Setup Environment Variables

Buat file `.env`:

```bash
# Private key (NO 0x prefix!)
PRIVATE_KEY=your_private_key_here

# RPC URL
LISK_SEPOLIA_RPC_URL=https://rpc.sepolia-api.lisk.com

# Etherscan API key (gunakan dummy value untuk Blockscout)
ETHERSCAN_API_KEY=123
```

**⚠️ SECURITY:**
- Never commit `.env` to git!
- Use testnet wallet only!
- Gitignore already includes `.env`

### Step 2: Load Environment Variables

```bash
source .env
```

Or use `--env-file` flag with forge.

### Step 3: Deploy to Lisk Sepolia

Ada 2 cara untuk deploy contract ke Lisk Sepolia:

#### Opsi 1: forge create (Recommended - Simple & Fast)

**Sesuai dokumentasi resmi Lisk:**

```bash
forge create --rpc-url $LISK_SEPOLIA_RPC_URL \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --verify \
    --verifier blockscout \
    --verifier-url https://sepolia-blockscout.lisk.com/api \
    --private-key $PRIVATE_KEY \
    src/SimpleBank.sol:SimpleBank
```

**Flags explanation:**
- `--rpc-url` = Lisk Sepolia RPC endpoint
- `--etherscan-api-key 123` = Dummy value (Blockscout tidak perlu API key)
- `--verify` = Auto-verify setelah deploy
- `--verifier blockscout` = Use Blockscout verifier
- `--verifier-url` = Blockscout API endpoint
- `--private-key` = Your private key untuk deploy

**💡 Best Practice:** Gunakan metode ini untuk contract sederhana (no constructor params atau simple params)

#### Opsi 2: forge script (Advanced - For Complex Deployments)

**Untuk deployment dengan logic kompleks:**

```bash
# Dry run (simulation)
forge script script/DeploySimpleBank.s.sol --rpc-url $LISK_SEPOLIA_RPC_URL

# Deploy for real
forge script script/DeploySimpleBank.s.sol \
    --rpc-url $LISK_SEPOLIA_RPC_URL \
    --broadcast \
    --verify \
    --verifier blockscout \
    --verifier-url https://sepolia-blockscout.lisk.com/api \
    -vvvv
```

**💡 Use Case:** Multi-contract deployments, complex initialization, atau deployment dengan conditional logic

---

### Step 4: Expected Output

#### Output dari `forge create` (Opsi 1):

```bash
[⠒] Compiling...
[⠢] Compiling 1 files with Solc 0.8.30
[⠆] Solc 0.8.30 finished in 1.23s
Compiler run successful!

Deployer: 0x5e1A92F84cA1CE280B3Cb29d79C3368f45b41EBB
Deployed to: 0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5
Transaction hash: 0xf465528f43e5cbc9b5206e46048feba0b920179813c3eb8c3bdbccbfd13d731e

Starting contract verification...
Waiting for blockscout to detect contract deployment...

Start verifying contract `0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5` deployed on 4202

Submitting verification for [src/SimpleBank.sol:SimpleBank] 0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5.
Submitted contract for verification:
        Response: `OK`
        GUID: `108872f713a27bc22ca1db8ceefcac8cbeddf9e565e71790`
        URL: https://sepolia-blockscout.lisk.com/address/0x108872f713a27bc22ca1db8ceefcac8cbeddf9e5

Contract verification status:
Response: `OK`
Details: `Pending in queue`

Contract verification status:
Response: `OK`
Details: `Pass - Verified`

Contract successfully verified
```

🎉 **Deployed & Verified on Lisk Sepolia!**

**📝 Save this information:**
- Contract Address: `0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5`
- Transaction Hash: `0xf465528f43e5cbc9b5206e46048feba0b920179813c3eb8c3bdbccbfd13d731e`
- Block Explorer: https://sepolia-blockscout.lisk.com/address/0x108872f713a27bc22ca1db8ceefcac8cbeddf9e5

**💰 Gas Savings on Lisk:**
- Ethereum Sepolia: ~0.01 ETH (20 gwei gas price)
- **Lisk Sepolia: ~0.0003 ETH (0.5 gwei gas price)**
- **Savings: 97% cheaper!** ⚡

---

## 🔍 Verify Contract Manually

Jika auto-verify gagal saat deployment, Anda bisa verify contract secara manual.

**Sesuai dokumentasi resmi Lisk:**

```bash
forge verify-contract <CONTRACT_ADDRESS> \
    src/SimpleBank.sol:SimpleBank \
    --chain 4202 \
    --watch \
    --verifier blockscout \
    --verifier-url https://sepolia-blockscout.lisk.com/api
```

**Example:**
```bash
forge verify-contract 0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5 \
    src/SimpleBank.sol:SimpleBank \
    --chain 4202 \
    --watch \
    --verifier blockscout \
    --verifier-url https://sepolia-blockscout.lisk.com/api
```

**Expected Output:**
```bash
Starting contract verification...
Waiting for blockscout to detect contract deployment...

Start verifying contract `0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5` deployed on 4202

Submitting verification for [src/SimpleBank.sol:SimpleBank] 0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5.
Submitted contract for verification:
       Response: `OK`
       GUID: `108872f713a27bc22ca1db8ceefcac8cbeddf9e565e71790`
       URL: https://sepolia-blockscout.lisk.com/address/0x108872f713a27bc22ca1db8ceefcac8cbeddf9e5

Contract verification status:
Response: `OK`
Details: `Pending in queue`

Contract verification status:
Response: `OK`
Details: `Pass - Verified`

Contract successfully verified
```

**💡 Important Notes:**
- No API key needed untuk Blockscout!
- `--chain 4202` = Chain ID untuk Lisk Sepolia
- `--watch` = Monitor verification status real-time
- Gunakan contract address dari deployment output

**Check verification di Blockscout:**
```
https://sepolia-blockscout.lisk.com/address/0xYourContractAddress
```

Should show "Verified" badge ✅ dengan source code visible!

**⚠️ Already Verified Error:**

Jika contract sudah pernah diverify, Anda akan melihat:
```
Contract [src/SimpleBank.sol:SimpleBank] "0x108872F713A27bc22ca1db8CEefCAC8CbeDdF9E5" is already verified. Skipping verification.
```

Ini normal! Contract identik tidak perlu diverify ulang.

**Blockscout Features:**
- ✅ No API key needed
- ✅ Instant verification
- ✅ Better UI dengan code reader
- ✅ Contract interaction tools built-in
- ✅ Real-time verification status dengan `--watch`

---

## 🧪 Test Deployed Contract

### Use Cast to Interact

**1. Read balance:**
```bash
cast call 0xYourContractAddress "balances(address)" 0xYourWalletAddress --rpc-url $LISK_SEPOLIA_RPC_URL
```

**2. Deposit ETH:**
```bash
cast send 0xYourContractAddress "deposit()" \
    --value 0.01ether \
    --private-key $PRIVATE_KEY \
    --rpc-url $LISK_SEPOLIA_RPC_URL
```

**Output:**
```
blockHash               0xabc...
blockNumber             5123457
from                    0xYourAddress
gasUsed                 45123
status                  1 (success)
transactionHash         0xdef...
```

**3. Check balance again:**
```bash
cast call 0xYourContractAddress "balances(address)" 0xYourWalletAddress --rpc-url $LISK_SEPOLIA_RPC_URL

# Convert hex to decimal
cast to-dec 0x002386f26fc10000
# Output: 10000000000000000 (0.01 ETH in wei)
```

**4. Withdraw:**
```bash
cast send 0xYourContractAddress "withdraw(uint256)" 5000000000000000 \
    --private-key $PRIVATE_KEY \
    --rpc-url $LISK_SEPOLIA_RPC_URL
```

**💡 Alternative:** Gunakan Blockscout UI untuk interact dengan contract secara visual!
```
https://sepolia-blockscout.lisk.com/address/0xYourContractAddress#write-contract
```

---

## ✅ Production Deployment Checklist

### Pre-Deployment

**Code Review:**
- [ ] All tests passing (`forge test`)
- [ ] 100% test coverage (`forge coverage`)
- [ ] No compiler warnings
- [ ] Code reviewed by team
- [ ] Security audit (for mainnet!)

**Gas Optimization:**
- [ ] Gas report reviewed
- [ ] Optimizations applied
- [ ] Gas snapshots compared
- [ ] Contract size < 24KB

**Documentation:**
- [ ] NatSpec comments complete
- [ ] README with contract description
- [ ] Deployment guide written

### Deployment

**Environment:**
- [ ] Private key secured (hardware wallet for mainnet!)
- [ ] RPC endpoint reliable
- [ ] Sufficient ETH for gas
- [ ] Gas price checked (don't overpay!)

**Deployment Process:**
- [ ] Dry run successful
- [ ] Deployment script tested on testnet first
- [ ] Deploy transaction confirmed
- [ ] Contract address saved securely

**Post-Deployment:**
- [ ] Contract verified on Blockscout
- [ ] Source code visible & matches
- [ ] Initial smoke tests passed
- [ ] Contract ownership renounced/transferred (if applicable)

### Mainnet Additional Steps

**Security:**
- [ ] Professional audit completed
- [ ] Audit issues resolved
- [ ] Multi-sig for admin functions
- [ ] Timelocks for upgrades (if upgradeable)
- [ ] Bug bounty program (for large contracts)

**Monitoring:**
- [ ] Events monitoring setup
- [ ] Alert system for critical functions
- [ ] Gas price tracker
- [ ] Frontend integration tested

**Documentation:**
- [ ] User guide published
- [ ] Developer documentation
- [ ] Contract addresses listed
- [ ] Emergency procedures documented

---

## 🎯 Best Practices Summary

### Gas Optimization

1. ✅ Use `uint256` for most variables
2. ✅ Cache storage variables in memory
3. ✅ Use custom errors instead of require strings
4. ✅ Use `calldata` for read-only parameters
5. ✅ Use `external` instead of `public` when possible
6. ✅ Use `unchecked` for safe arithmetic
7. ✅ Use events instead of storage for history
8. ✅ Short-circuit boolean conditions
9. ✅ Use `++i` instead of `i++` in loops
10. ✅ Pack variables into slots when possible

### Testing

1. ✅ Write tests BEFORE deployment
2. ✅ Aim for 100% coverage
3. ✅ Test happy paths & edge cases
4. ✅ Use fuzz testing
5. ✅ Test on testnet before mainnet

### Deployment

1. ✅ Use deployment scripts
2. ✅ Verify contracts on Blockscout (no API key needed!)
3. ✅ Test deployed contract
4. ✅ Document everything
5. ✅ Security audit for mainnet

---

## 📚 Foundry Commands Reference

```bash
# Building
forge build                          # Compile contracts
forge build --sizes                  # Show contract sizes
forge clean                          # Clean build artifacts

# Testing
forge test                           # Run all tests
forge test -vvvv                     # Verbose output
forge test --gas-report              # Show gas usage
forge test --match-test <name>       # Run specific test
forge coverage                       # Test coverage

# Gas Analysis
forge snapshot                       # Create gas snapshot
forge snapshot --diff <file>         # Compare snapshots

# Deployment (Lisk Sepolia)
# Opsi 1: Simple deployment dengan forge create (Recommended)
forge create --rpc-url $LISK_SEPOLIA_RPC_URL \
    --etherscan-api-key 123 \
    --verify \
    --verifier blockscout \
    --verifier-url https://sepolia-blockscout.lisk.com/api \
    --private-key $PRIVATE_KEY \
    src/Contract.sol:ContractName

# Opsi 2: Complex deployment dengan forge script
forge script script/Deploy.s.sol --rpc-url $LISK_SEPOLIA_RPC_URL --broadcast

# Manual Verification
forge verify-contract <address> \
    src/Contract.sol:ContractName \
    --chain 4202 \
    --watch \
    --verifier blockscout \
    --verifier-url https://sepolia-blockscout.lisk.com/api

# Interaction (Cast)
cast call <address> "func()"         # Call view function
cast send <address> "func()" --private-key <key> # Send transaction
cast balance <address>               # Get balance
cast to-dec <hex>                    # Convert hex to decimal
cast to-wei <amount> <unit>          # Convert to wei

# Utilities
forge inspect <contract> abi         # Show ABI
forge inspect <contract> bytecode    # Show bytecode
forge fmt                            # Format Solidity code
forge doc                            # Generate documentation
```

---

## 🎓 Final Summary

**Apa yang sudah dipelajari:**

✅ **Gas Optimization:**
- 10+ optimization techniques
- Gas savings measurement
- Before/after comparison
- 10-12% gas reduction achieved

✅ **Deployment:**
- Deployment scripts di Solidity
- Deploy to Lisk Sepolia testnet
- Auto-verification on Blockscout (no API key!)
- Contract interaction with cast
- 97% cheaper gas fees vs Ethereum

✅ **Best Practices:**
- Pre-deployment checklist
- Testing requirements
- Security considerations
- Production-ready workflow

**Your SimpleBank contract:**
```
✅ Fully tested (100% coverage)
✅ Gas optimized (10-12% savings)
✅ Deployed to Lisk Sepolia
✅ Verified on Blockscout
✅ 97% cheaper gas fees
✅ Production ready!
```

---

## 🏆 Congratulations!

Anda sudah menguasai Foundry! 🎉

**Skills acquired:**
- ⚡ Foundry suite (forge, cast, anvil, chisel)
- 🔨 Smart contract development
- 🧪 Comprehensive testing in Solidity
- 🎲 Fuzz testing for edge cases
- ⚡ Gas optimization techniques
- 🚀 Professional deployment workflow
- 🔍 Contract verification

**You can now:**
- Build production-grade smart contracts
- Write comprehensive test suites
- Optimize gas efficiently
- Deploy confidently to mainnet
- Contribute to DeFi protocols
- Participate in audit contests

---

## 🚀 Next Steps

### Continue Learning:

**Advanced Foundry:**
- Invariant testing
- Symbolic execution with Halmos
- Gas profiling with `forge geiger`
- Multi-contract deployments

**Security:**
- Smart contract security patterns
- Common vulnerabilities (reentrancy, overflow, etc.)
- Audit tools (Slither, Mythril, Echidna)
- Participate in Code4rena/Sherlock

**DeFi:**
- DEX mechanics (Uniswap-style)
- Lending protocols (Aave-style)
- Staking & rewards
- Governance tokens

### Resources:

- [Foundry Book](https://book.getfoundry.sh) - Official Foundry documentation
- [Lisk Developer Docs](https://docs.lisk.com/building-on-lisk/deploying-smart-contract) - Official Lisk deployment guide
- [Lisk Sepolia Blockscout](https://sepolia-blockscout.lisk.com) - Block explorer & contract verification
- [Solidity by Example](https://solidity-by-example.org) - Learn Solidity patterns
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/) - Security best practices
- [Ethereum Jakarta Discord](https://discord.gg/p5b6RFEnnk) - Community support

---

## 🙏 Thank You!

Terima kasih sudah mengikuti workshop Foundry!

**Feedback & Questions:**
- Ethereum Jakarta Telegram
- Foundry Discord
- GitHub Issues

**Keep Building! 🔨⚡**

---

## 📚 Official Documentation Compliance

**Workshop ini menggunakan commands yang sesuai dengan:**

✅ **Lisk Official Documentation**
- Deployment: `forge create` dengan Blockscout verification
- Verification: `forge verify-contract` dengan `--chain 4202` dan `--watch`
- Reference: https://docs.lisk.com/building-on-lisk/deploying-smart-contract

✅ **Foundry Best Practices**
- Modern ESM & TypeScript setup
- Gas optimization techniques
- Comprehensive testing approach
- Reference: https://book.getfoundry.sh

✅ **Blockscout Integration**
- No API key needed
- Real-time verification monitoring
- Contract interaction tools
- Reference: https://sepolia-blockscout.lisk.com

**[← Back to Main Page](./sesi-6-kelas-rutin-batch-4.md)**

---

**#BuildWithFoundry** | **#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia**
