---
id: smart-contract-dasar
title: "Part 2: Membuat SimpleBank Smart Contract"
sidebar_label: "Part 2: Build SimpleBank"
sidebar_position: 2
description: "Membuat SimpleBank smart contract lengkap dengan deposit, withdraw, transfer, events, custom errors, dan security patterns."
---

# Part 2: Membuat SimpleBank Smart Contract

## 🎯 Tujuan Module

Setelah menyelesaikan module ini, Anda akan mampu:
- ✅ Memahami development smart contract dengan analogi dunia nyata
- ✅ Membuat SimpleBank contract dari scratch
- ✅ Mengimplementasikan events untuk logging transaksi
- ✅ Menggunakan custom errors untuk efisiensi gas
- ✅ Menerapkan security patterns (CEI, reentrancy protection)
- ✅ Compile contract dan memeriksa ukuran bytecode

---

## 💡 Real-World Analogy: SimpleBank

### Bayangkan Anda Membangun Bank Digital

**Bank tradisional seperti BCA/Mandiri punya:**
- 💰 **Rekening** - Setiap orang punya saldo
- 📥 **Setor tunai** - Deposit uang ke rekening
- 📤 **Tarik tunai** - Withdraw dari rekening
- 🔄 **Transfer** - Kirim uang ke rekening lain
- 📊 **Mutasi** - Log semua transaksi
- 🔒 **Keamanan** - Validasi setiap transaksi

**SimpleBank smart contract akan punya yang sama:**
- 💰 **Balance mapping** - Track saldo setiap address
- 📥 **deposit()** - Terima ETH ke contract
- 📤 **withdraw()** - Tarik ETH dari contract
- 🔄 **transfer()** - Kirim ETH ke address lain
- 📊 **Events** - Log Deposited, Withdrawn, Transferred
- 🔒 **Security** - Checks, validations, reentrancy protection

**Bedanya:** Semua on-chain, transparent, trustless! 🔗

---

## 🏗️ Setup Project

### Step 1: Create New Project

```bash
cd ~/projects  # atau folder pilihan Anda
mkdir simple-bank-foundry
cd simple-bank-foundry
forge init
```

### Step 2: Clean Sample Files

```bash
# Hapus sample files
rm src/Counter.sol
rm test/Counter.t.sol
rm script/Counter.s.sol
```

### Step 3: Update foundry.toml

Edit `foundry.toml`:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.30"

# Optimizer untuk gas efficiency
optimizer = true
optimizer_runs = 200

# Gas reports untuk semua contracts
gas_reports = ["*"]

# Verbosity untuk better error messages
verbosity = 2

[rpc_endpoints]
lisk_sepolia = "${LISK_SEPOLIA_RPC_URL}"
```

---

## 📝 Build SimpleBank Contract - Step by Step

### Phase 1: Basic Structure

Buat file `src/SimpleBank.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title SimpleBank
 * @author Ethereum Jakarta
 * @notice Bank sederhana untuk deposit, withdraw, dan transfer ETH
 * @dev Demo contract untuk Kelas Rutin Batch IV
 */
contract SimpleBank {
    // State variables
    mapping(address => uint256) public balances;

    // Constructor
    constructor() {
        // Empty constructor - no initialization needed
    }
}
```

**Analogy:**
```
mapping(address => uint256) balances
    ↓
Seperti database bank:
┌──────────────────────────┬──────────┐
│ Address (Rekening)       │ Balance  │
├──────────────────────────┼──────────┤
│ 0xAlice...               │ 5.0 ETH  │
│ 0xBob...                 │ 10.0 ETH │
│ 0xCharlie...             │ 2.5 ETH  │
└──────────────────────────┴──────────┘
```

### Phase 2: Events

Tambahkan events untuk logging:

```solidity
contract SimpleBank {
    // State variables
    mapping(address => uint256) public balances;

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    constructor() {}
}
```

**Kenapa Events?**

**Analogi: Events = Mutasi Rekening Bank**

```
Saat Anda transfer di mobile banking:
1. ✅ Transaksi berhasil
2. 📱 Notifikasi push muncul
3. 📊 Muncul di mutasi rekening
4. 📧 Email konfirmasi

Events di blockchain:
1. ✅ Transaction berhasil
2. 📡 Event di-emit (broadcast)
3. 📊 Frontend bisa listen real-time
4. 🔍 Explorer bisa index untuk search

Bedanya: Events PERMANENT di blockchain!
```

**Event best practices:**
- `indexed` parameters = searchable (max 3)
- Use events untuk off-chain tracking
- Emit events setelah state changes

### Phase 3: Custom Errors

```solidity
contract SimpleBank {
    // Custom Errors (lebih gas efficient!)
    error InsufficientBalance(uint256 requested, uint256 available);
    error ZeroAmount();
    error TransferFailed();

    // State variables
    mapping(address => uint256) public balances;

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    constructor() {}
}
```

**Custom Errors vs require string:**

```solidity
// ❌ Old way (expensive!)
require(amount > 0, "Amount must be greater than 0");

// ✅ New way (cheap!)
if (amount == 0) revert ZeroAmount();
```

**Gas comparison:**
- `require` with string: ~2400 gas
- Custom error: ~200 gas
- **Savings: ~2200 gas (91% cheaper!)** ⚡

---

## 💰 Implement Core Functions

### Function 1: Deposit

```solidity
/**
 * @notice Deposit ETH ke bank
 * @dev msg.value akan masuk ke balance user
 */
function deposit() public payable {
    // Validasi: amount harus > 0
    if (msg.value == 0) revert ZeroAmount();

    // Update balance
    balances[msg.sender] += msg.value;

    // Emit event
    emit Deposited(msg.sender, msg.value);
}
```

**Line-by-line explanation:**

```solidity
function deposit() public payable {
```
- `public` = siapa saja bisa call
- `payable` = function bisa menerima ETH (msg.value)

```solidity
if (msg.value == 0) revert ZeroAmount();
```
- Check: jangan terima deposit 0 ETH
- `revert` = batalkan transaksi & kembalikan gas

```solidity
balances[msg.sender] += msg.value;
```
- Update saldo user
- `msg.sender` = address yang call function
- `msg.value` = jumlah ETH yang dikirim

```solidity
emit Deposited(msg.sender, msg.value);
```
- Emit event untuk logging
- Frontend bisa listen event ini

**Analogy:**
```
User datang ke bank dengan cash:
1. Teller check: uang lebih dari 0? ✅
2. Teller update saldo di sistem (+msg.value)
3. Teller print bukti setor (emit event)
4. User dapat notifikasi di mobile banking
```

---

### Function 2: Withdraw

```solidity
/**
 * @notice Withdraw ETH dari bank
 * @param amount Jumlah ETH yang ingin ditarik
 */
function withdraw(uint256 amount) public {
    // Validasi: amount harus > 0
    if (amount == 0) revert ZeroAmount();

    // Validasi: balance cukup?
    uint256 currentBalance = balances[msg.sender];
    if (currentBalance < amount) {
        revert InsufficientBalance(amount, currentBalance);
    }

    // Update balance SEBELUM transfer (CEI pattern!)
    balances[msg.sender] -= amount;

    // Transfer ETH ke user
    (bool success, ) = msg.sender.call{value: amount}("");
    if (!success) revert TransferFailed();

    // Emit event
    emit Withdrawn(msg.sender, amount);
}
```

**Security: CEI Pattern (Checks-Effects-Interactions)**

```solidity
// ✅ CORRECT (CEI Pattern):
balances[msg.sender] -= amount;           // 1. Effect (update state)
(bool success, ) = msg.sender.call{...};  // 2. Interaction (external call)

// ❌ WRONG (Vulnerable to reentrancy):
(bool success, ) = msg.sender.call{...};  // 1. Interaction FIRST
balances[msg.sender] -= amount;           // 2. Effect AFTER (DANGER!)
```

**Why CEI matters:**

**Without CEI (Vulnerable):**
```
1. Attacker calls withdraw(10 ETH)
2. Contract sends 10 ETH (balance not updated yet)
3. Attacker's fallback re-enters withdraw()
4. Contract sees balance still 10 ETH
5. Sends another 10 ETH
6. Repeat until contract drained! 💀
```

**With CEI (Safe):**
```
1. Attacker calls withdraw(10 ETH)
2. Contract updates balance to 0 FIRST
3. Contract sends 10 ETH
4. Attacker's fallback re-enters withdraw()
5. Contract sees balance = 0
6. Revert InsufficientBalance! ✅
```

**Analogy:**
```
Bank tanpa CEI (BAHAYA):
1. Teller kasih uang dulu
2. Baru update saldo
❌ User bisa minta lagi sebelum saldo diupdate!

Bank dengan CEI (AMAN):
1. Teller update saldo dulu
2. Baru kasih uang
✅ User gabisa minta lagi, saldo sudah 0!
```

---

### Function 3: Transfer

```solidity
/**
 * @notice Transfer ETH ke user lain
 * @param to Address tujuan
 * @param amount Jumlah ETH yang akan ditransfer
 */
function transfer(address to, uint256 amount) public {
    // Validasi: amount harus > 0
    if (amount == 0) revert ZeroAmount();

    // Validasi: balance cukup?
    uint256 currentBalance = balances[msg.sender];
    if (currentBalance < amount) {
        revert InsufficientBalance(amount, currentBalance);
    }

    // Update balances (CEI pattern)
    balances[msg.sender] -= amount;
    balances[to] += amount;

    // Emit event
    emit Transferred(msg.sender, to, amount);
}
```

**Kenapa transfer() aman dari reentrancy?**

```solidity
// Transfer hanya update STATE, tidak kirim ETH
balances[msg.sender] -= amount;  // Internal state change
balances[to] += amount;           // Internal state change

// No external call = No reentrancy risk! ✅
```

**Analogy:**
```
Transfer antar rekening di bank yang sama:
1. Kurangi saldo Alice (-10 ETH)
2. Tambah saldo Bob (+10 ETH)
3. Uang tidak keluar bank (internal transfer)
4. Instant & aman!

Real blockchain transfer:
1. Update state di contract
2. Tidak ada external call
3. Gas efficient!
```

---

### Function 4: Getter Functions (Helpers)

```solidity
/**
 * @notice Get balance dari address tertentu
 * @param account Address yang ingin dicek
 * @return Balance dari account tersebut
 */
function getBalance(address account) public view returns (uint256) {
    return balances[account];
}

/**
 * @notice Get total ETH yang ada di contract
 * @return Total ETH di contract
 */
function getTotalDeposits() public view returns (uint256) {
    return address(this).balance;
}
```

**View functions:**
- `view` = hanya baca state, tidak ubah
- GRATIS untuk call (no gas!)
- Perfect untuk frontend queries

---

## 🎯 Complete SimpleBank.sol

Gabungkan semua code di atas:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title SimpleBank
 * @author Ethereum Jakarta
 * @notice Bank sederhana untuk deposit, withdraw, dan transfer ETH
 * @dev Demo contract untuk Kelas Rutin Batch IV - Foundry Workshop
 */
contract SimpleBank {
    // ============ Custom Errors ============

    error InsufficientBalance(uint256 requested, uint256 available);
    error ZeroAmount();
    error TransferFailed();

    // ============ State Variables ============

    /// @notice Mapping untuk track balance setiap user
    mapping(address => uint256) public balances;

    // ============ Events ============

    /// @notice Event di-emit ketika user deposit
    event Deposited(address indexed user, uint256 amount);

    /// @notice Event di-emit ketika user withdraw
    event Withdrawn(address indexed user, uint256 amount);

    /// @notice Event di-emit ketika user transfer ke user lain
    event Transferred(address indexed from, address indexed to, uint256 amount);

    // ============ Functions ============

    /**
     * @notice Deposit ETH ke bank
     * @dev msg.value akan masuk ke balance user
     */
    function deposit() public payable {
        if (msg.value == 0) revert ZeroAmount();

        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw ETH dari bank
     * @param amount Jumlah ETH yang ingin ditarik
     */
    function withdraw(uint256 amount) public {
        if (amount == 0) revert ZeroAmount();

        uint256 currentBalance = balances[msg.sender];
        if (currentBalance < amount) {
            revert InsufficientBalance(amount, currentBalance);
        }

        // CEI Pattern: Update state BEFORE external call
        balances[msg.sender] -= amount;

        // Transfer ETH
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Transfer ETH ke user lain (internal transfer)
     * @param to Address tujuan
     * @param amount Jumlah ETH yang akan ditransfer
     */
    function transfer(address to, uint256 amount) public {
        if (amount == 0) revert ZeroAmount();

        uint256 currentBalance = balances[msg.sender];
        if (currentBalance < amount) {
            revert InsufficientBalance(amount, currentBalance);
        }

        // Update balances
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transferred(msg.sender, to, amount);
    }

    /**
     * @notice Get balance dari address tertentu
     * @param account Address yang ingin dicek
     * @return Balance dari account tersebut
     */
    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }

    /**
     * @notice Get total ETH yang ada di contract
     * @return Total ETH di contract
     */
    function getTotalDeposits() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Contract size:** ~2KB (very efficient!)

---

## 🔨 Compile Contract

### Build Contract

```bash
forge build
```

**Expected output:**
```
[⠊] Compiling...
[⠒] Compiling 1 files with 0.8.30
[⠢] Solc 0.8.30 finished in 823ms
Compiler run successful!
```

### Check Compiled Files

```bash
ls -la out/SimpleBank.sol/
```

**Files created:**
```
out/SimpleBank.sol/
├── SimpleBank.json       # ABI + Bytecode
└── SimpleBank.dbg.json   # Debug info
```

### Inspect Contract

```bash
forge inspect SimpleBank abi
```

**ABI output (excerpt):**
```json
[
  {
    "type": "function",
    "name": "deposit",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [{"name": "amount", "type": "uint256"}],
    "outputs": []
  },
  ...
]
```

### Check Bytecode Size

```bash
forge build --sizes
```

**Output:**
```
| Contract    | Size (KB) | Margin (KB) |
|-------------|-----------|-------------|
| SimpleBank  | 2.134     | 22.414      |
```

**Size limit:** 24.576 KB (EIP-170)
**Our contract:** 2.134 KB ✅ (Only 8.7% of limit!)

---

## 📊 Understanding Contract Structure

### Layout Best Practice

```solidity
contract MyContract {
    // 1. Custom Errors (top)
    error MyError();

    // 2. State Variables
    uint256 public myVar;

    // 3. Events
    event MyEvent();

    // 4. Modifiers (jika ada)
    modifier onlyOwner() { ... }

    // 5. Constructor
    constructor() {}

    // 6. External Functions
    function externalFunc() external {}

    // 7. Public Functions
    function publicFunc() public {}

    // 8. Internal Functions
    function _internalFunc() internal {}

    // 9. Private Functions
    function _privateFunc() private {}

    // 10. View/Pure Functions
    function viewFunc() public view returns (uint256) {}
}
```

**Why this order?**
- Errors at top = easy to find & understand failures
- State variables = understand contract state
- Events = understand contract logs
- Functions = ordered by visibility (external → private)

---

## 🛡️ Security Checklist

Anda sudah implement security best practices! ✅

**✅ CEI Pattern:**
```solidity
// Update state BEFORE external call
balances[msg.sender] -= amount;
(bool success, ) = msg.sender.call{value: amount}("");
```

**✅ Custom Errors:**
```solidity
// Gas efficient error handling
if (amount == 0) revert ZeroAmount();
```

**✅ Input Validation:**
```solidity
// Check all inputs
if (amount == 0) revert ZeroAmount();
if (currentBalance < amount) revert InsufficientBalance(...);
```

**✅ Safe Transfer:**
```solidity
// Use .call instead of .transfer or .send
(bool success, ) = msg.sender.call{value: amount}("");
if (!success) revert TransferFailed();
```

**✅ Events for Transparency:**
```solidity
// Emit events untuk audit trail
emit Deposited(msg.sender, msg.value);
```

---

## 🎯 Interactive Exercise

### Test Contract Manually with Chisel

Start chisel:
```bash
chisel
```

Load contract:
```solidity
➜ !load src/SimpleBank.sol
➜ SimpleBank bank = new SimpleBank();
➜ bank.deposit{value: 1 ether}();
➜ bank.balances(address(this))
Type: uint256
└ Decimal: 1000000000000000000 (1 ETH)

➜ bank.withdraw(0.5 ether);
➜ bank.balances(address(this))
Type: uint256
└ Decimal: 500000000000000000 (0.5 ETH)
```

Exit:
```
➜ !quit
```

---

## 📚 Comparison with Real Bank

| Feature | Bank Tradisional | SimpleBank Contract |
|---------|-----------------|-------------------|
| **Account** | Nomor rekening | Ethereum address |
| **Deposit** | Setor tunai | `deposit()` payable |
| **Withdraw** | Tarik tunai | `withdraw(amount)` |
| **Transfer** | Transfer antar rekening | `transfer(to, amount)` |
| **Balance** | Cek saldo | `balances[address]` mapping |
| **History** | Mutasi rekening | Events (Deposited, Withdrawn) |
| **Security** | PIN, password | Private key signature |
| **Operating Hours** | 08:00-16:00 | 24/7/365 ⚡ |
| **Trust** | Trust bank | Trustless (code is law) |
| **Fees** | Admin fee monthly | Only gas fees |
| **Transparency** | Private | Public on blockchain |

---

## 💡 Key Concepts Learned

### 1. Payable Functions
```solidity
function deposit() public payable {
    // Can receive ETH via msg.value
}
```

### 2. Custom Errors (Gas Efficient)
```solidity
error InsufficientBalance(uint256 requested, uint256 available);

if (balance < amount) {
    revert InsufficientBalance(amount, balance);
}
```

### 3. Events for Logging
```solidity
event Deposited(address indexed user, uint256 amount);
emit Deposited(msg.sender, msg.value);
```

### 4. CEI Pattern (Reentrancy Protection)
```solidity
// 1. Checks
if (balance < amount) revert;

// 2. Effects
balance -= amount;

// 3. Interactions
(bool success, ) = user.call{value: amount}("");
```

### 5. Safe ETH Transfer
```solidity
// ✅ Recommended
(bool success, ) = recipient.call{value: amount}("");
if (!success) revert TransferFailed();

// ❌ Avoid
recipient.transfer(amount);  // Can fail with >2300 gas
recipient.send(amount);      // Can silently fail
```

---

## ✅ Checklist: Ready for Testing?

Sebelum lanjut ke Part 3, pastikan:

- [ ] `SimpleBank.sol` ada di folder `src/`
- [ ] Contract compile tanpa error (`forge build`)
- [ ] Understand semua functions (deposit, withdraw, transfer)
- [ ] Understand CEI pattern untuk security
- [ ] Understand custom errors untuk gas efficiency
- [ ] Contract size < 24KB limit

**Semua checked?** ✅ Let's write comprehensive tests!

---

## 🎓 Summary

**Apa yang sudah dibuat:**

✅ **SimpleBank Contract:**
- Deposit ETH ke contract
- Withdraw ETH dengan validasi
- Transfer ETH antar users (internal)
- Track balance per address
- Events untuk logging

✅ **Security Best Practices:**
- CEI pattern (Checks-Effects-Interactions)
- Custom errors untuk gas efficiency
- Input validation
- Safe ETH transfers

✅ **Code Quality:**
- Comprehensive comments
- NatSpec documentation
- Organized structure
- Gas optimized

**Real-world features:**
- Just like bank account system
- Transparent & trustless
- 24/7 operation
- Immutable code

---

## 🚀 Next Steps

Contract sudah ready! Tapi bagaimana kita tahu contract ini aman?

**Part 3 akan cover:**
- Unit testing di Solidity (bukan JavaScript!)
- Test happy paths & edge cases
- Fuzz testing untuk find bugs
- Test coverage measurement
- Testing best practices

**[📖 Part 3: Unit Testing & Fuzzing →](./03-unit-testing.md)**

---

**Let's make sure our bank is secure! 🔒⚡**
