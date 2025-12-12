---
id: gas-optimization-deployment
title: "Part 4: Gas Optimization & Deployment"
sidebar_label: "Part 4: Deploy"
sidebar_position: 4
description: "Mengoptimasi gas EduLoan, deploy ke Mantle Sepolia, verifikasi contract, dan production checklist."
---

# Part 4: Gas Optimization & Deployment

## 🎯 Tujuan

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Memahami dan menerapkan gas optimization techniques
- ✅ Mengukur gas savings dengan snapshots
- ✅ Men-deploy EduLoan ke Mantle Sepolia
- ✅ Memverifikasi contract di explorer
- ✅ Berinteraksi dengan deployed contract
- ✅ Menggunakan production deployment checklist

---

## 💡 Kenapa Gas Optimization Penting?

### Analogi: Bensin Mobil

**Mobil Boros vs Irit:**
```
Jakarta → Bandung (150 km)

Mobil boros (20L/100km):
  Bensin: 30L x Rp 15,000 = Rp 450,000 💸

Mobil irit (8L/100km):
  Bensin: 12L x Rp 15,000 = Rp 180,000 ✅

Hemat: Rp 270,000 per trip!
```

**Smart Contract:**
```
Function call (tanpa optimization):
  Gas: 200,000 x 50 gwei = 0.01 ETH
  Dengan ETH $3000 = $30 per call 💸

Function call (dengan optimization):
  Gas: 50,000 x 50 gwei = 0.0025 ETH
  Dengan ETH $3000 = $7.50 per call ✅

Hemat: $22.50 per call!
1000 users = $22,500 saved!
```

### Mantle Network Advantage

**Gas Comparison:**
```
Ethereum Mainnet:
  Deploy EduLoan: ~$150-300
  Function call: ~$10-50

Mantle Sepolia (Testnet):
  Deploy EduLoan: FREE (testnet)
  Function call: FREE (testnet)

Mantle Mainnet:
  Deploy EduLoan: ~$1-5
  Function call: ~$0.01-0.10

Savings: 95%+ cheaper than Ethereum! ⚡
```

---

## 📊 Measure Current Gas Usage

### Run Gas Report

```bash
forge test --gas-report
```

**Output (before optimization):**

```
| src/EduLoan.sol:EduLoan contract |                 |        |        |        |         |
|----------------------------------|-----------------|--------|--------|--------|---------|
| Deployment Cost                  | Deployment Size |        |        |        |         |
| 1234567                          | 5678            |        |        |        |         |
| Function Name                    | min             | avg    | median | max    | # calls |
| applyLoan                        | 145678          | 156789 | 156789 | 167890 | 15      |
| approveLoan                      | 34567           | 45678  | 45678  | 56789  | 10      |
| disburseLoan                     | 67890           | 78901  | 78901  | 89012  | 8       |
| makePayment                      | 45678           | 56789  | 56789  | 67890  | 12      |
| calculateInterest                | 345             | 345    | 345    | 345    | 5       |
```

### Create Gas Snapshot

```bash
forge snapshot
```

**File `.gas-snapshot` created:**
```
EduLoanTest:test_ApplyLoan() (gas: 156789)
EduLoanTest:test_ApproveLoan() (gas: 112345)
EduLoanTest:test_DisburseLoan() (gas: 189012)
EduLoanTest:test_MakePayment() (gas: 145678)
...
```

---

## ⚡ Gas Optimization Techniques

### Technique 1: Use Custom Errors (Already Done!)

**❌ Expensive:**
```solidity
require(msg.sender == admin, "Hanya admin!");
// String stored on-chain = expensive!
// ~2400 gas
```

**✅ Cheap (what we have):**
```solidity
// Kita sudah pakai require dengan string pendek
// Tapi bisa lebih murah dengan custom errors:
error NotAdmin();

if (msg.sender != admin) revert NotAdmin();
// ~200 gas
```

**Savings: ~2200 gas per check (91% cheaper!)**

### Technique 2: Cache Storage Variables

**❌ Before (multiple storage reads):**
```solidity
function makePayment(uint256 _loanId) public payable {
    require(loans[_loanId].status == LoanStatus.Active);
    loans[_loanId].amountRepaid += msg.value;
    if (loans[_loanId].amountRepaid >= loans[_loanId].totalAmount) {
        loans[_loanId].status = LoanStatus.Repaid;
    }
    // loans[_loanId] dibaca 4 kali = 4 x SLOAD (2100 gas each)
}
```

**✅ After (cache in memory):**
```solidity
function makePayment(uint256 _loanId) public payable {
    Loan storage loan = loans[_loanId]; // 1x SLOAD
    require(loan.status == LoanStatus.Active);
    loan.amountRepaid += msg.value;
    if (loan.amountRepaid >= loan.totalAmount) {
        loan.status = LoanStatus.Repaid;
    }
    // Hanya 1x SLOAD, sisanya memory reads
}
```

**Savings: ~6300 gas (75% cheaper for reads!)**

### Technique 3: Use `external` Instead of `public`

**❌ Less efficient:**
```solidity
function applyLoan(uint256 _amount, string memory _purpose) public {
    // 'public' copies parameters to memory
}
```

**✅ More efficient:**
```solidity
function applyLoan(uint256 _amount, string calldata _purpose) external {
    // 'external' + 'calldata' = no copy, direct read
}
```

**Savings: ~200-1000 gas per call**

### Technique 4: Use `unchecked` for Safe Math

**❌ Default (with overflow checks):**
```solidity
loan.amountRepaid += msg.value;
// Solidity 0.8+ adds overflow check
// Extra ~30 gas per operation
```

**✅ Optimized (when safe):**
```solidity
unchecked {
    loan.amountRepaid += msg.value;
    // No overflow check - we know it's safe because
    // amountRepaid can't exceed totalAmount realistically
}
```

**Savings: ~30 gas per math operation**

### Technique 5: Short-Circuit Conditions

**❌ Expensive first:**
```solidity
if (loans[_loanId].status == LoanStatus.Active && amount > 0) {
    // Storage read happens first, even if amount = 0
}
```

**✅ Cheap first:**
```solidity
if (amount > 0 && loans[_loanId].status == LoanStatus.Active) {
    // If amount = 0, storage read skipped!
}
```

---

## 🔄 Create Optimized EduLoan

### EduLoanOptimized.sol

Buat `src/EduLoanOptimized.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title EduLoanOptimized - Gas-Optimized Version
/// @notice Sistem pinjaman dengan gas optimization

contract EduLoanOptimized {
    // ============================================
    // CUSTOM ERRORS (Gas Efficient!)
    // ============================================

    error NotAdmin();
    error NotBorrower();
    error LoanNotFound();
    error InvalidStatus();
    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();

    // ============================================
    // ENUMS & STRUCTS
    // ============================================

    enum LoanStatus {
        Pending,
        Approved,
        Active,
        Repaid,
        Defaulted,
        Rejected
    }

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 principalAmount;
        uint256 interestRate;
        uint256 totalAmount;
        uint256 amountRepaid;
        uint256 applicationTime;
        uint256 approvalTime;
        uint256 deadline;
        LoanStatus status;
        string purpose;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    address public admin;
    uint256 public loanCounter;

    uint256 public constant INTEREST_RATE = 500;
    uint256 public constant LOAN_DURATION = 365 days;
    uint256 public constant MIN_LOAN = 0.01 ether;
    uint256 public constant MAX_LOAN = 10 ether;

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;

    // ============================================
    // EVENTS
    // ============================================

    event LoanApplied(uint256 indexed loanId, address indexed borrower, uint256 amount, string purpose);
    event LoanApproved(uint256 indexed loanId, address indexed borrower, uint256 totalAmount);
    event LoanRejected(uint256 indexed loanId, address indexed borrower, string reason);
    event LoanDisbursed(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 remaining);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event FundsDeposited(address indexed admin, uint256 amount);
    event FundsWithdrawn(address indexed admin, uint256 amount);

    // ============================================
    // MODIFIERS (Gas Optimized)
    // ============================================

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyBorrower(uint256 _loanId) {
        if (loans[_loanId].borrower != msg.sender) revert NotBorrower();
        _;
    }

    modifier loanExists(uint256 _loanId) {
        if (_loanId == 0 || _loanId > loanCounter) revert LoanNotFound();
        _;
    }

    modifier inStatus(uint256 _loanId, LoanStatus _status) {
        if (loans[_loanId].status != _status) revert InvalidStatus();
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() {
        admin = msg.sender;
    }

    // ============================================
    // MAIN FUNCTIONS (Optimized)
    // ============================================

    /// @notice Mahasiswa mengajukan pinjaman
    function applyLoan(uint256 _amount, string calldata _purpose) external {
        // Cheap checks first
        if (_amount < MIN_LOAN) revert InvalidAmount();
        if (_amount > MAX_LOAN) revert InvalidAmount();

        // Increment counter
        uint256 newLoanId;
        unchecked {
            newLoanId = ++loanCounter;
        }

        // Calculate interest
        uint256 interest = calculateInterest(_amount);
        uint256 total;
        unchecked {
            total = _amount + interest;
        }

        // Create loan
        loans[newLoanId] = Loan({
            loanId: newLoanId,
            borrower: msg.sender,
            principalAmount: _amount,
            interestRate: INTEREST_RATE,
            totalAmount: total,
            amountRepaid: 0,
            applicationTime: block.timestamp,
            approvalTime: 0,
            deadline: 0,
            status: LoanStatus.Pending,
            purpose: _purpose
        });

        borrowerLoans[msg.sender].push(newLoanId);

        emit LoanApplied(newLoanId, msg.sender, _amount, _purpose);
    }

    /// @notice Admin menyetujui pinjaman
    function approveLoan(uint256 _loanId)
        external
        onlyAdmin
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        Loan storage loan = loans[_loanId]; // Cache storage pointer
        loan.status = LoanStatus.Approved;
        loan.approvalTime = block.timestamp;

        emit LoanApproved(_loanId, loan.borrower, loan.totalAmount);
    }

    /// @notice Admin menolak pinjaman
    function rejectLoan(uint256 _loanId, string calldata _reason)
        external
        onlyAdmin
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        Loan storage loan = loans[_loanId];
        loan.status = LoanStatus.Rejected;

        emit LoanRejected(_loanId, loan.borrower, _reason);
    }

    /// @notice Admin mencairkan dana
    function disburseLoan(uint256 _loanId)
        external
        onlyAdmin
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Approved)
    {
        Loan storage loan = loans[_loanId];
        uint256 amount = loan.principalAmount;

        if (address(this).balance < amount) revert InsufficientBalance();

        unchecked {
            loan.deadline = block.timestamp + LOAN_DURATION;
        }
        loan.status = LoanStatus.Active;

        (bool success, ) = loan.borrower.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit LoanDisbursed(_loanId, loan.borrower, amount);
    }

    /// @notice Borrower membayar cicilan
    function makePayment(uint256 _loanId)
        external
        payable
        loanExists(_loanId)
        onlyBorrower(_loanId)
        inStatus(_loanId, LoanStatus.Active)
    {
        if (msg.value == 0) revert InvalidAmount();

        Loan storage loan = loans[_loanId];

        unchecked {
            loan.amountRepaid += msg.value;
        }

        uint256 remaining;
        if (loan.totalAmount > loan.amountRepaid) {
            unchecked {
                remaining = loan.totalAmount - loan.amountRepaid;
            }
        }

        if (loan.amountRepaid >= loan.totalAmount) {
            loan.status = LoanStatus.Repaid;
            emit LoanRepaid(_loanId, msg.sender);
        }

        emit PaymentMade(_loanId, msg.sender, msg.value, remaining);
    }

    /// @notice Cek default
    function checkDefault(uint256 _loanId) external loanExists(_loanId) {
        Loan storage loan = loans[_loanId];

        if (loan.status != LoanStatus.Active) revert InvalidStatus();

        if (block.timestamp > loan.deadline && loan.amountRepaid < loan.totalAmount) {
            loan.status = LoanStatus.Defaulted;
            emit LoanDefaulted(_loanId, loan.borrower);
        }
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    function getLoanDetails(uint256 _loanId)
        external
        view
        loanExists(_loanId)
        returns (Loan memory)
    {
        return loans[_loanId];
    }

    function getMyLoans() external view returns (uint256[] memory) {
        return borrowerLoans[msg.sender];
    }

    function calculateInterest(uint256 _principal) public pure returns (uint256) {
        return (_principal * INTEREST_RATE) / 10000;
    }

    function getRemainingAmount(uint256 _loanId)
        external
        view
        loanExists(_loanId)
        returns (uint256)
    {
        Loan memory loan = loans[_loanId];
        if (loan.amountRepaid >= loan.totalAmount) return 0;
        unchecked {
            return loan.totalAmount - loan.amountRepaid;
        }
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTotalLoans() external view returns (uint256) {
        return loanCounter;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    function depositFunds() external payable onlyAdmin {
        if (msg.value == 0) revert InvalidAmount();
        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _amount) external onlyAdmin {
        if (_amount == 0) revert InvalidAmount();
        if (address(this).balance < _amount) revert InsufficientBalance();

        (bool success, ) = admin.call{value: _amount}("");
        if (!success) revert TransferFailed();

        emit FundsWithdrawn(msg.sender, _amount);
    }

    function transferAdmin(address _newAdmin) external onlyAdmin {
        if (_newAdmin == address(0)) revert InvalidAmount();
        admin = _newAdmin;
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
```

---

## 📊 Compare Gas Usage

### Run Comparison

```bash
# Original
forge test --match-contract EduLoanTest --gas-report

# Optimized (create test for optimized version)
forge test --match-contract EduLoanOptimizedTest --gas-report
```

### Expected Savings

| Function | Original | Optimized | Savings |
|----------|----------|-----------|---------|
| applyLoan | 156,789 | 142,345 | ~9% |
| approveLoan | 45,678 | 38,901 | ~15% |
| disburseLoan | 78,901 | 68,234 | ~14% |
| makePayment | 56,789 | 48,123 | ~15% |
| **Modifiers** | ~2,400 each | ~200 each | **91%** |

### Snapshot Comparison

```bash
# Create baseline
forge snapshot --snap baseline.snap

# After optimization
forge snapshot --diff baseline.snap
```

**Output:**
```
test_ApplyLoan() (gas: -14444 ⬇️ 9.2%)
test_ApproveLoan() (gas: -6777 ⬇️ 14.8%)
test_MakePayment() (gas: -8666 ⬇️ 15.3%)
```

---

## 🚀 Deploy to Mantle Sepolia

### Step 1: Setup Environment

Buat file `.env`:

```bash
# Private Key (TANPA 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URL
MANTLE_SEPOLIA_RPC=https://rpc.sepolia.mantle.xyz

# Explorer API (optional for Mantle)
ETHERSCAN_API_KEY=your_api_key
```

**⚠️ SECURITY:**
- Jangan commit `.env` ke git!
- Gunakan wallet testnet saja!

### Step 2: Create Deploy Script

Buat `script/DeployEduLoan.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {EduLoan} from "../src/EduLoan.sol";

contract DeployEduLoan is Script {
    function run() external returns (EduLoan) {
        // Load private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting
        vm.startBroadcast(deployerPrivateKey);

        // Deploy
        EduLoan eduLoan = new EduLoan();

        console.log("EduLoan deployed to:", address(eduLoan));
        console.log("Admin:", eduLoan.admin());

        vm.stopBroadcast();

        return eduLoan;
    }
}
```

### Step 3: Load Environment

```bash
source .env
```

### Step 4: Deploy

**Dry Run (Simulation):**
```bash
forge script script/DeployEduLoan.s.sol --rpc-url $MANTLE_SEPOLIA_RPC
```

**Deploy for Real:**
```bash
forge script script/DeployEduLoan.s.sol \
    --rpc-url $MANTLE_SEPOLIA_RPC \
    --broadcast \
    -vvvv
```

**Expected Output:**
```
[⠊] Compiling...
No files changed, compilation skipped

Script ran successfully.

== Logs ==
  EduLoan deployed to: 0x1234567890abcdef1234567890abcdef12345678
  Admin: 0xYourWalletAddress

## Setting up 1 EVM.
==========================
Chain 5003
Estimated gas price: 0.05 gwei
Estimated total gas used for script: 1234567
Estimated amount required: 0.0000617283 ETH
==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

Transactions saved to: broadcast/DeployEduLoan.s.sol/5003/run-latest.json
```

### Step 5: Save Contract Address

```bash
# Contract address dari output
export EDULOAN_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

---

## 🔍 Verify Contract

### Method 1: Forge Verify (If Explorer Supports)

```bash
forge verify-contract $EDULOAN_ADDRESS \
    src/EduLoan.sol:EduLoan \
    --chain 5003 \
    --watch
```

### Method 2: Manual Verification

1. Buka https://sepolia.mantlescan.xyz
2. Search contract address
3. Klik "Contract" tab
4. Klik "Verify and Publish"
5. Pilih:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.30
   - License: MIT
6. Paste source code
7. Submit

---

## 🧪 Test Deployed Contract

### Using Cast

**1. Check Admin:**
```bash
cast call $EDULOAN_ADDRESS "admin()" --rpc-url $MANTLE_SEPOLIA_RPC
```

**2. Check Balance:**
```bash
cast call $EDULOAN_ADDRESS "getContractBalance()" --rpc-url $MANTLE_SEPOLIA_RPC
```

**3. Deposit Funds (Admin):**
```bash
cast send $EDULOAN_ADDRESS "depositFunds()" \
    --value 1ether \
    --private-key $PRIVATE_KEY \
    --rpc-url $MANTLE_SEPOLIA_RPC
```

**4. Apply Loan:**
```bash
cast send $EDULOAN_ADDRESS \
    "applyLoan(uint256,string)" 10000000000000000 "SPP" \
    --private-key $PRIVATE_KEY \
    --rpc-url $MANTLE_SEPOLIA_RPC
```

**5. Check Loan Details:**
```bash
cast call $EDULOAN_ADDRESS "getLoanDetails(uint256)" 1 \
    --rpc-url $MANTLE_SEPOLIA_RPC
```

---

## ✅ Production Deployment Checklist

### Pre-Deployment

**Code Quality:**
- [ ] All tests passing (`forge test`)
- [ ] 100% test coverage (`forge coverage`)
- [ ] No compiler warnings
- [ ] Code reviewed

**Gas Optimization:**
- [ ] Gas report reviewed
- [ ] Optimizations applied
- [ ] Contract size < 24KB

**Security:**
- [ ] Access control verified
- [ ] Reentrancy protection (CEI pattern)
- [ ] Input validation complete
- [ ] Custom errors implemented

### Deployment

**Environment:**
- [ ] Private key secured
- [ ] RPC endpoint working
- [ ] Enough MNT for gas
- [ ] Testnet deployment successful

**Process:**
- [ ] Dry run successful
- [ ] Deploy transaction confirmed
- [ ] Contract address saved
- [ ] Verification submitted

### Post-Deployment

**Verification:**
- [ ] Contract verified on explorer
- [ ] Source code matches
- [ ] Admin address correct

**Testing:**
- [ ] depositFunds() working
- [ ] applyLoan() working
- [ ] approveLoan() working
- [ ] Full flow tested

---

## 📚 Command Reference

```bash
# === Build ===
forge build                    # Compile
forge build --sizes            # With sizes

# === Test ===
forge test                     # Run tests
forge test --gas-report        # With gas
forge coverage                 # Coverage

# === Gas Analysis ===
forge snapshot                 # Create snapshot
forge snapshot --diff <file>   # Compare

# === Deploy ===
forge script <script> --rpc-url <url>              # Dry run
forge script <script> --rpc-url <url> --broadcast  # Deploy

# === Verify ===
forge verify-contract <address> <contract> --chain <id>

# === Interact ===
cast call <address> "function()" --rpc-url <url>   # Read
cast send <address> "function()" --rpc-url <url>   # Write
```

---

## 🎓 Summary

**Apa yang sudah dipelajari:**

✅ **Gas Optimization:**
- Custom errors vs require strings (91% savings)
- Storage caching
- external vs public
- unchecked math
- Short-circuit conditions

✅ **Deployment:**
- Deployment scripts di Solidity
- Deploy ke Mantle Sepolia
- Environment variables
- Contract verification

✅ **Production Workflow:**
- Pre-deployment checklist
- Testing requirements
- Post-deployment verification

**EduLoan Contract:**
```
✅ Fully tested (100% coverage)
✅ Gas optimized
✅ Deployed to Mantle Sepolia
✅ Verified on explorer
✅ Production ready!
```

---

## 🏆 Congratulations!

Anda telah menyelesaikan Foundry Workshop untuk EduLoan! 🎉

**Skills yang Anda kuasai:**
- ⚒️ Foundry suite (forge, cast, anvil, chisel)
- 🧪 Comprehensive testing dalam Solidity
- 🎲 Fuzz testing untuk edge cases
- ⚡ Gas optimization techniques
- 🚀 Professional deployment workflow

**You're now ready to:**
- Build production-grade smart contracts
- Contribute to DeFi protocols
- Participate in audit contests
- Deploy confidently to mainnet

---

## 🔗 Resources

- [Foundry Book](https://book.getfoundry.sh)
- [Mantle Docs](https://docs.mantle.xyz)
- [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz)
- [Mantle Faucet](https://faucet.sepolia.mantle.xyz)
- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk)

---

**[← Back to Workshop Overview](./00-foundry-eduloan-workshop.md)**

---

**#BuildWithFoundry** | **#MantleNetwork** | **#EthereumJakarta**
