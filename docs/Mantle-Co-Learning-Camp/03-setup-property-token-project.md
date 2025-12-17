---
id: setup-property-token-project
title: "Setup IndonesiaPropertyToken Project"
sidebar_label: "Setup PropertyToken"
sidebar_position: 3
description: "Setup Foundry project untuk IndonesiaPropertyToken (RWA), memahami struktur contract KYC & Token, dan compile contracts."
---

# Setup IndonesiaPropertyToken Project

## 🎯 Tujuan

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Membuat Foundry project untuk IndonesiaPropertyToken
- ✅ Memahami arsitektur 2-contract system (KYCRegistry + PropertyToken)
- ✅ Memahami konsep RWA (Real World Asset) tokenization
- ✅ Compile contracts dan memeriksa output
- ✅ Siap untuk menulis automated tests

---

## 🏗️ Setup Project

### Step 1: Buat Project Baru

```bash
# Buat folder project
mkdir property-token-foundry
cd property-token-foundry

# Initialize Foundry project
forge init
```

### Step 2: Hapus Sample Files

```bash
# Hapus sample contract dan test
rm src/Counter.sol
rm test/Counter.t.sol
rm script/Counter.s.sol
```

### Step 3: Update foundry.toml

Edit file `foundry.toml`:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.30"

# Optimizer untuk gas efficiency
optimizer = true
optimizer_runs = 200

# Gas reports
gas_reports = ["*"]

# Verbosity untuk error messages
verbosity = 2

# Mantle Sepolia RPC
[rpc_endpoints]
mantle_sepolia = "https://rpc.sepolia.mantle.xyz"

# Etherscan untuk verification (Mantle explorer)
[etherscan]
mantle_sepolia = { key = "${ETHERSCAN_API_KEY}", url = "https://api-sepolia.mantlescan.xyz/api" }
```

---

## 📝 Smart Contracts

IndonesiaPropertyToken menggunakan **2-contract system**:
1. **KYCRegistry** - Mengelola verifikasi KYC investor
2. **IndonesiaPropertyToken** - ERC-20 token yang merepresentasikan kepemilikan properti

### Buat KYCRegistry.sol

Buat file `src/KYCRegistry.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title KYCRegistry
 * @notice Manages KYC verification for IndonesiaPropertyToken
 * @dev Deploy this contract first, then use its address in PropertyToken
 *
 * Tutorial: https://docs.openzeppelin.com/contracts
 */
contract KYCRegistry {

    // ============ STATE VARIABLES ============

    address public admin;

    // KYC Levels
    enum KYCLevel {
        NONE,           // 0 - Belum KYC
        BASIC,          // 1 - KYC dasar (KTP)
        VERIFIED,       // 2 - KYC lengkap (KTP + NPWP)
        ACCREDITED      // 3 - Investor terakreditasi
    }

    struct Investor {
        KYCLevel level;
        uint256 expiryDate;
        uint16 countryCode;     // 360 = Indonesia
        bool isActive;
    }

    // Mapping: wallet address => investor data
    mapping(address => Investor) public investors;

    // Total registered investors
    uint256 public totalInvestors;

    // ============ EVENTS ============

    event InvestorRegistered(address indexed investor, KYCLevel level);
    event InvestorUpdated(address indexed investor, KYCLevel newLevel);
    event InvestorRevoked(address indexed investor);

    // ============ MODIFIERS ============

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor() {
        admin = msg.sender;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Register new investor after KYC verification
     * @param _investor Wallet address of investor
     * @param _level KYC level (1-3)
     * @param _countryCode Country code (360 for Indonesia)
     * @param _validDays How many days KYC is valid
     */
    function registerInvestor(
        address _investor,
        KYCLevel _level,
        uint16 _countryCode,
        uint256 _validDays
    ) external onlyAdmin {
        require(_investor != address(0), "Invalid address");
        require(_level != KYCLevel.NONE, "Invalid KYC level");
        require(!investors[_investor].isActive, "Already registered");

        investors[_investor] = Investor({
            level: _level,
            expiryDate: block.timestamp + (_validDays * 1 days),
            countryCode: _countryCode,
            isActive: true
        });

        totalInvestors++;
        emit InvestorRegistered(_investor, _level);
    }

    /**
     * @notice Update investor KYC level
     */
    function updateInvestor(
        address _investor,
        KYCLevel _newLevel
    ) external onlyAdmin {
        require(investors[_investor].isActive, "Not registered");
        investors[_investor].level = _newLevel;
        emit InvestorUpdated(_investor, _newLevel);
    }

    /**
     * @notice Revoke investor KYC (blacklist)
     */
    function revokeInvestor(address _investor) external onlyAdmin {
        require(investors[_investor].isActive, "Not registered");
        investors[_investor].isActive = false;
        totalInvestors--;
        emit InvestorRevoked(_investor);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Check if investor is verified and active
     */
    function isVerified(address _investor) public view returns (bool) {
        Investor memory inv = investors[_investor];

        if (!inv.isActive) return false;
        if (inv.level == KYCLevel.NONE) return false;
        if (block.timestamp > inv.expiryDate) return false;

        return true;
    }

    /**
     * @notice Check if investor meets minimum KYC level
     */
    function meetsLevel(
        address _investor,
        KYCLevel _requiredLevel
    ) public view returns (bool) {
        if (!isVerified(_investor)) return false;
        return uint8(investors[_investor].level) >= uint8(_requiredLevel);
    }

    /**
     * @notice Get investor details
     */
    function getInvestor(address _investor) external view returns (
        KYCLevel level,
        uint256 expiryDate,
        uint16 countryCode,
        bool isActive
    ) {
        Investor memory inv = investors[_investor];
        return (inv.level, inv.expiryDate, inv.countryCode, inv.isActive);
    }
}
```

---

### Buat IndonesiaPropertyToken.sol

Buat file `src/IndonesiaPropertyToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title IndonesiaPropertyToken
 * @notice ERC-20 token representing fractional ownership of Indonesian real estate
 * @dev Implements compliance checks via KYCRegistry
 *
 * Reference: https://www.erc3643.org/
 */
contract IndonesiaPropertyToken {

    // ============ TOKEN METADATA ============

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    // ============ PROPERTY INFO ============

    struct PropertyInfo {
        string propertyName;        // "Apartemen Sudirman Tower"
        string location;            // "Jakarta Selatan"
        uint256 totalValue;         // Total property value in IDR
        uint256 totalTokens;        // Total tokens representing 100%
        string legalDocument;       // IPFS hash of legal docs
        bool isActive;
    }

    PropertyInfo public property;

    // ============ COMPLIANCE ============

    address public admin;
    address public kycRegistry;     // KYCRegistry contract address

    mapping(address => bool) public frozen;     // Frozen accounts
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    // Investment limits
    uint256 public minInvestment = 1 ether;         // Min 1 token
    uint256 public maxInvestment = 1000 ether;      // Max 1000 tokens

    // ============ EVENTS ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event PropertyUpdated(string propertyName, uint256 totalValue);

    // ============ MODIFIERS ============

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier notFrozen(address _account) {
        require(!frozen[_account], "Account is frozen");
        _;
    }

    modifier onlyVerified(address _account) {
        require(_isVerified(_account), "Not KYC verified");
        _;
    }

    // ============ CONSTRUCTOR ============

    /**
     * @notice Deploy property token
     * @param _name Token name (e.g., "Sudirman Tower Token")
     * @param _symbol Token symbol (e.g., "SDMN")
     * @param _kycRegistry Address of deployed KYCRegistry
     * @param _propertyName Name of the property
     * @param _location Property location
     * @param _totalValue Total property value in IDR
     * @param _totalTokens Total tokens to mint (representing 100%)
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _kycRegistry,
        string memory _propertyName,
        string memory _location,
        uint256 _totalValue,
        uint256 _totalTokens
    ) {
        require(_kycRegistry != address(0), "Invalid KYC registry");

        name = _name;
        symbol = _symbol;
        admin = msg.sender;
        kycRegistry = _kycRegistry;

        property = PropertyInfo({
            propertyName: _propertyName,
            location: _location,
            totalValue: _totalValue,
            totalTokens: _totalTokens,
            legalDocument: "",
            isActive: true
        });

        // Mint all tokens to admin initially
        totalSupply = _totalTokens;
        balances[msg.sender] = _totalTokens;
        emit Transfer(address(0), msg.sender, _totalTokens);
    }

    // ============ ERC-20 FUNCTIONS ============

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    /**
     * @notice Transfer tokens with compliance checks
     * @dev Both sender and receiver must be KYC verified and not frozen
     */
    function transfer(
        address _to,
        uint256 _value
    )
        public
        notFrozen(msg.sender)
        notFrozen(_to)
        returns (bool)
    {
        require(_to != address(0), "Invalid recipient");
        require(_isVerified(msg.sender), "Not KYC verified");
        require(_isVerified(_to), "Not KYC verified");
        require(balances[msg.sender] >= _value, "Insufficient balance");

        // Check investment limits for receiver
        uint256 newBalance = balances[_to] + _value;
        require(newBalance <= maxInvestment, "Exceeds max investment");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        notFrozen(_from)
        notFrozen(_to)
        returns (bool)
    {
        require(_to != address(0), "Invalid recipient");
        require(_isVerified(_from), "Not KYC verified");
        require(_isVerified(_to), "Not KYC verified");
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        uint256 newBalance = balances[_to] + _value;
        require(newBalance <= maxInvestment, "Exceeds max investment");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Freeze account (for AML/compliance)
     */
    function freezeAccount(
        address _account,
        string calldata _reason
    ) external onlyAdmin {
        frozen[_account] = true;
        emit AccountFrozen(_account, _reason);
    }

    /**
     * @notice Unfreeze account
     */
    function unfreezeAccount(address _account) external onlyAdmin {
        frozen[_account] = false;
        emit AccountUnfrozen(_account);
    }

    /**
     * @notice Force transfer (for legal compliance, recovery)
     */
    function forceTransfer(
        address _from,
        address _to,
        uint256 _value
    ) external onlyAdmin {
        require(balances[_from] >= _value, "Insufficient balance");

        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    /**
     * @notice Update property legal documents
     */
    function setLegalDocument(string calldata _ipfsHash) external onlyAdmin {
        property.legalDocument = _ipfsHash;
    }

    /**
     * @notice Update investment limits
     */
    function setInvestmentLimits(
        uint256 _min,
        uint256 _max
    ) external onlyAdmin {
        require(_min < _max, "Invalid limits");
        minInvestment = _min;
        maxInvestment = _max;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get ownership percentage
     */
    function getOwnershipPercent(address _owner) public view returns (uint256) {
        if (totalSupply == 0) return 0;
        return (balances[_owner] * 10000) / totalSupply; // Returns basis points (100% = 10000)
    }

    /**
     * @notice Get token value in IDR
     */
    function getTokenValueIDR() public view returns (uint256) {
        if (property.totalTokens == 0) return 0;
        return property.totalValue / (property.totalTokens / 1 ether);
    }

    /**
     * @notice Check if transfer would be allowed
     */
    function canTransfer(
        address _from,
        address _to,
        uint256 _value
    ) public view returns (bool, string memory) {
        if (frozen[_from]) return (false, "Sender is frozen");
        if (frozen[_to]) return (false, "Receiver is frozen");
        if (!_isVerified(_from)) return (false, "Sender not KYC verified");
        if (!_isVerified(_to)) return (false, "Receiver not KYC verified");
        if (balances[_from] < _value) return (false, "Insufficient balance");
        if (balances[_to] + _value > maxInvestment) return (false, "Exceeds max investment");

        return (true, "Transfer allowed");
    }

    // ============ INTERNAL FUNCTIONS ============

    function _isVerified(address _account) internal view returns (bool) {
        // Admin is always verified
        if (_account == admin) return true;

        // Check KYC registry
        (bool success, bytes memory data) = kycRegistry.staticcall(
            abi.encodeWithSignature("isVerified(address)", _account)
        );

        if (!success) return false;
        return abi.decode(data, (bool));
    }
}
```

---

## 💡 Memahami Arsitektur Contract

### Kenapa 2-Contract System?

```
┌─────────────────────────────────────────────────────────────────┐
│                 RWA Token Architecture                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐           ┌─────────────────────────────────┐
│   KYCRegistry   │◄──────────│   IndonesiaPropertyToken        │
│                 │  calls    │                                 │
│ • Register      │  isVerified()                               │
│ • Update        │           │ • ERC-20 standard               │
│ • Revoke        │           │ • Compliance checks             │
│ • isVerified()  │           │ • Investment limits             │
│ • meetsLevel()  │           │ • Freeze/Unfreeze               │
└─────────────────┘           └─────────────────────────────────┘
      │                                    │
      │                                    │
      ▼                                    ▼
┌─────────────────┐           ┌─────────────────────────────────┐
│   Investor DB   │           │        Property Data            │
│                 │           │                                 │
│ • KYC Level     │           │ • Property Name                 │
│ • Country Code  │           │ • Location                      │
│ • Expiry Date   │           │ • Total Value (IDR)             │
│ • Active Status │           │ • Legal Documents (IPFS)        │
└─────────────────┘           └─────────────────────────────────┘
```

**Keuntungan:**
1. **Separation of Concerns** - KYC logic terpisah dari token logic
2. **Reusable** - 1 KYCRegistry bisa dipakai multiple property tokens
3. **Upgradeable** - Bisa ganti KYCRegistry tanpa redeploy token
4. **Compliance** - Memenuhi standar ERC-3643 untuk security tokens

---

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│               IndonesiaPropertyToken Flow                       │
└─────────────────────────────────────────────────────────────────┘

  ADMIN                                     INVESTOR
    │                                          │
    │ 1. Deploy KYCRegistry                    │
    ▼                                          │
┌────────────────┐                             │
│  KYCRegistry   │                             │
└────────────────┘                             │
    │                                          │
    │ 2. Deploy PropertyToken                  │
    ▼                                          │
┌────────────────────────┐                     │
│ IndonesiaPropertyToken │                     │
│ (Admin gets 100% tokens)                     │
└────────────────────────┘                     │
    │                                          │
    │ 3. registerInvestor()                    │
    │    (KYC verification)                    │
    ▼                                          ▼
┌────────────────┐                     ┌───────────────┐
│ KYC VERIFIED   │────────────────────►│   INVESTOR    │
└────────────────┘                     │ (KYC Level 1+) │
    │                                  └───────────────┘
    │ 4. transfer() tokens                     │
    │    to verified investors                 │
    ▼                                          ▼
┌────────────────────────────────────────────────────┐
│  Verified investors can:                           │
│  • Receive tokens                                  │
│  • Transfer to other verified investors            │
│  • Check ownership percentage                      │
│  • View token value in IDR                         │
└────────────────────────────────────────────────────┘
    │
    │ Admin can:
    ├─── freezeAccount() ─── Block suspicious activity
    ├─── forceTransfer() ─── Legal compliance/recovery
    └─── setInvestmentLimits() ─── Update min/max
```

---

### KYC Levels

| Level | Kode | Nama | Persyaratan | Limit |
|-------|------|------|-------------|-------|
| 0 | `NONE` | Belum KYC | - | Tidak bisa transfer |
| 1 | `BASIC` | KYC Dasar | KTP | Transfer standar |
| 2 | `VERIFIED` | KYC Lengkap | KTP + NPWP | Transfer lebih besar |
| 3 | `ACCREDITED` | Investor Terakreditasi | KTP + NPWP + Bukti Aset | Unlimited |

### Compliance Features

| Feature | Deskripsi | Fungsi Terkait |
|---------|-----------|----------------|
| **KYC Check** | Verifikasi identitas investor | `_isVerified()` |
| **Freeze Account** | Blokir akun mencurigakan (AML) | `freezeAccount()` |
| **Force Transfer** | Transfer paksa untuk legal compliance | `forceTransfer()` |
| **Investment Limits** | Batasan investasi per akun | `minInvestment`, `maxInvestment` |
| **Transfer Validation** | Cek sebelum transfer | `canTransfer()` |

---

### Perhitungan Kepemilikan

```solidity
// Ownership dalam basis points (100% = 10000)
// Contoh: 1000 tokens dari 10000 total = 10% ownership

function getOwnershipPercent(address _owner) public view returns (uint256) {
    return (balances[_owner] * 10000) / totalSupply;
}

// Contoh:
// balances[investor] = 1000 ether (1000 tokens)
// totalSupply = 10000 ether (10000 tokens)
// ownershipPercent = (1000 * 10000) / 10000 = 1000 basis points = 10%
```

### Perhitungan Nilai Token

```solidity
// Contoh Properti:
// propertyName: "Apartemen Sudirman Tower"
// totalValue: 50_000_000_000 (Rp 50 Miliar)
// totalTokens: 10000 ether (10,000 tokens)

function getTokenValueIDR() public view returns (uint256) {
    return property.totalValue / property.totalTokens;
}

// tokenValueIDR = 50_000_000_000 / 10000 = 5_000_000 (Rp 5 Juta per token)
```

---

## 🔨 Compile Contracts

### Build

```bash
forge build
```

**Output yang diharapkan:**
```
[⠊] Compiling...
[⠒] Compiling 2 files with Solc 0.8.30
[⠢] Solc 0.8.30 finished in 1.45s
Compiler run successful!
```

### Check Contract Sizes

```bash
forge build --sizes
```

**Output:**
```
| Contract                | Size (KB) | Margin (KB) |
|-------------------------|-----------|-------------|
| KYCRegistry             | 2.156     | 22.420      |
| IndonesiaPropertyToken  | 4.892     | 19.684      |
```

**Size limit:** 24.576 KB (EIP-170)
- **KYCRegistry:** ~2.2 KB ✅ (9% of limit)
- **IndonesiaPropertyToken:** ~4.9 KB ✅ (20% of limit)

### Inspect ABI

```bash
# KYCRegistry ABI
forge inspect KYCRegistry abi | head -50

# PropertyToken ABI
forge inspect IndonesiaPropertyToken abi | head -50
```

---

## 📊 Struktur File Project

Setelah setup, struktur project Anda:

```
property-token-foundry/
├── lib/
│   └── forge-std/              # Foundry standard library
├── script/
│   └── (kosong - akan dibuat di Part 4)
├── src/
│   ├── KYCRegistry.sol         # ✅ Contract KYC
│   └── IndonesiaPropertyToken.sol  # ✅ Contract Token
├── test/
│   └── (kosong - akan dibuat di Part 3)
├── .gitignore
├── foundry.toml                # ✅ Config updated
└── README.md
```

---

## 🎯 Memahami Functions

### KYCRegistry Functions

#### Admin Functions

| Function | Deskripsi | Access |
|----------|-----------|--------|
| `registerInvestor(address, level, countryCode, validDays)` | Daftarkan investor baru | Admin |
| `updateInvestor(address, newLevel)` | Update KYC level investor | Admin |
| `revokeInvestor(address)` | Cabut KYC (blacklist) | Admin |

#### View Functions

| Function | Deskripsi | Returns |
|----------|-----------|---------|
| `isVerified(address)` | Cek apakah investor verified & active | bool |
| `meetsLevel(address, level)` | Cek apakah memenuhi minimum level | bool |
| `getInvestor(address)` | Ambil detail investor | (level, expiry, country, active) |

---

### IndonesiaPropertyToken Functions

#### ERC-20 Standard

| Function | Deskripsi | Compliance |
|----------|-----------|------------|
| `transfer(to, value)` | Transfer tokens | KYC + Not Frozen |
| `transferFrom(from, to, value)` | Transfer dengan approval | KYC + Not Frozen |
| `approve(spender, value)` | Approve spender | - |
| `allowance(owner, spender)` | Cek allowance | - |
| `balanceOf(owner)` | Cek balance | - |

#### Admin Functions

| Function | Deskripsi | Use Case |
|----------|-----------|----------|
| `freezeAccount(account, reason)` | Freeze akun | AML/Suspicious activity |
| `unfreezeAccount(account)` | Unfreeze akun | Clear investigation |
| `forceTransfer(from, to, value)` | Transfer paksa | Legal compliance |
| `setLegalDocument(ipfsHash)` | Update dokumen legal | New legal docs |
| `setInvestmentLimits(min, max)` | Update investment limits | Regulatory change |

#### View Functions

| Function | Deskripsi | Returns |
|----------|-----------|---------|
| `getOwnershipPercent(owner)` | Persentase kepemilikan | uint256 (basis points) |
| `getTokenValueIDR()` | Nilai per token dalam IDR | uint256 |
| `canTransfer(from, to, value)` | Cek apakah transfer allowed | (bool, string) |

---

## 💡 Key Concepts Review

### 1. External Contract Calls

```solidity
// Low-level call ke KYCRegistry
function _isVerified(address _account) internal view returns (bool) {
    // staticcall = read-only call (tidak bisa modify state)
    (bool success, bytes memory data) = kycRegistry.staticcall(
        abi.encodeWithSignature("isVerified(address)", _account)
    );

    if (!success) return false;
    return abi.decode(data, (bool));
}
```

**Kenapa pakai `staticcall`?**
- **Security:** Mencegah reentrancy attack
- **Gas efficient:** View function tidak butuh write access
- **Safe:** Jika KYCRegistry error, tidak affect token contract

### 2. Multiple Modifiers

```solidity
function transfer(address _to, uint256 _value)
    public
    notFrozen(msg.sender)      // 1. Cek sender tidak frozen
    notFrozen(_to)             // 2. Cek receiver tidak frozen
    onlyVerified(msg.sender)   // 3. Cek sender KYC verified
    onlyVerified(_to)          // 4. Cek receiver KYC verified
    returns (bool)
{
    // Semua modifier harus pass sebelum masuk sini
}
```

### 3. Compliance-First Design

```solidity
// Check before transfer
function canTransfer(address _from, address _to, uint256 _value)
    public view returns (bool, string memory)
{
    if (frozen[_from]) return (false, "Sender is frozen");
    if (frozen[_to]) return (false, "Receiver is frozen");
    if (!_isVerified(_from)) return (false, "Sender not KYC verified");
    if (!_isVerified(_to)) return (false, "Receiver not KYC verified");
    if (balances[_from] < _value) return (false, "Insufficient balance");
    if (balances[_to] + _value > maxInvestment) return (false, "Exceeds max investment");

    return (true, "Transfer allowed");
}
```

**Use case:** Frontend bisa check dulu sebelum user submit transaction.

### 4. Struct untuk Property Info

```solidity
struct PropertyInfo {
    string propertyName;    // Nama properti
    string location;        // Lokasi
    uint256 totalValue;     // Nilai total (IDR)
    uint256 totalTokens;    // Total token = 100%
    string legalDocument;   // IPFS hash dokumen legal
    bool isActive;          // Status aktif
}

PropertyInfo public property;
```

---

## ✅ Checklist Sebelum Lanjut

Sebelum melanjutkan ke testing, pastikan:

- [ ] Project `property-token-foundry` sudah dibuat
- [ ] `KYCRegistry.sol` ada di folder `src/`
- [ ] `IndonesiaPropertyToken.sol` ada di folder `src/`
- [ ] `forge build` berhasil tanpa error
- [ ] Memahami 2-contract system (KYCRegistry + PropertyToken)
- [ ] Memahami KYC levels (NONE → BASIC → VERIFIED → ACCREDITED)
- [ ] Memahami compliance features (freeze, force transfer, limits)
- [ ] Memahami perhitungan ownership dan token value

---

## 🎓 Ringkasan

Dalam modul ini, Anda telah mempelajari:

1. **Setup Foundry Project** untuk RWA token development
2. **2-Contract Architecture** - memisahkan KYC logic dari token logic
3. **KYCRegistry Contract** - mengelola verifikasi investor
4. **IndonesiaPropertyToken Contract** - ERC-20 dengan compliance built-in
5. **Compliance Features** - freeze, force transfer, investment limits

**Selamat!** Anda sekarang memiliki foundation yang kuat untuk membangun RWA tokens yang compliant dengan regulasi.

---

**Build compliant RWA tokens! 🏠🪙**
