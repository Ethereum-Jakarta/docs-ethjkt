---
id: setup-eduloan-project
title: "Part 2: Setup EduLoan Project"
sidebar_label: "Part 2: Setup Project"
sidebar_position: 2
description: "Setup Foundry project untuk EduLoan, memahami struktur contract, compile dan testing manual."
---

# Part 2: Setup EduLoan Project

## 🎯 Tujuan

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Membuat Foundry project untuk EduLoan
- ✅ Memahami struktur dan flow EduLoan contract
- ✅ Compile contract dan memeriksa output
- ✅ Testing manual dengan Chisel
- ✅ Siap untuk menulis automated tests

---

## 🏗️ Setup Project

### Step 1: Buat Project Baru

```bash
# Buat folder project
mkdir eduloan-foundry
cd eduloan-foundry

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

## 📝 EduLoan Smart Contract

### Buat EduLoan.sol

Buat file `src/EduLoan.sol` dengan contract berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title EduLoan - Decentralized Student Loan System
/// @author Ethereum Jakarta
/// @notice Sistem pinjaman pendidikan terdesentralisasi di Mantle Network
/// @dev Challenge Final Mantle Co-Learning Camp

contract EduLoan {
    // ============================================
    // ENUMS & STRUCTS
    // ============================================

    enum LoanStatus {
        Pending,    // 0: Menunggu approval
        Approved,   // 1: Disetujui, menunggu pencairan
        Active,     // 2: Sudah dicairkan, dalam masa cicilan
        Repaid,     // 3: Sudah lunas
        Defaulted,  // 4: Gagal bayar (melewati deadline)
        Rejected    // 5: Ditolak oleh admin
    }

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 principalAmount;    // Jumlah pinjaman pokok
        uint256 interestRate;       // Bunga dalam basis points (100 = 1%)
        uint256 totalAmount;        // Total yang harus dibayar (pokok + bunga)
        uint256 amountRepaid;       // Jumlah yang sudah dibayar
        uint256 applicationTime;    // Waktu pengajuan
        uint256 approvalTime;       // Waktu disetujui
        uint256 deadline;           // Batas waktu pelunasan
        LoanStatus status;
        string purpose;             // Tujuan pinjaman (SPP, buku, dll)
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    address public admin;
    uint256 public loanCounter;

    uint256 public constant INTEREST_RATE = 500; // 5% dalam basis points (500/10000)
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
    // MODIFIERS
    // ============================================

    modifier onlyAdmin() {
        require(msg.sender == admin, "Hanya admin!");
        _;
    }

    modifier onlyBorrower(uint256 _loanId) {
        require(loans[_loanId].borrower == msg.sender, "Bukan borrower!");
        _;
    }

    modifier loanExists(uint256 _loanId) {
        require(_loanId > 0 && _loanId <= loanCounter, "Loan tidak ditemukan!");
        _;
    }

    modifier inStatus(uint256 _loanId, LoanStatus _status) {
        require(loans[_loanId].status == _status, "Status loan tidak sesuai!");
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() {
        admin = msg.sender;
    }

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    /// @notice Mahasiswa mengajukan pinjaman
    /// @param _amount Jumlah pinjaman yang diajukan
    /// @param _purpose Tujuan pinjaman
    function applyLoan(uint256 _amount, string memory _purpose) public {
        require(_amount >= MIN_LOAN, "Pinjaman terlalu kecil! Min 0.01 ETH");
        require(_amount <= MAX_LOAN, "Pinjaman terlalu besar! Max 10 ETH");

        loanCounter++;

        uint256 interest = calculateInterest(_amount);
        uint256 total = _amount + interest;

        Loan memory newLoan = Loan({
            loanId: loanCounter,
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

        loans[loanCounter] = newLoan;
        borrowerLoans[msg.sender].push(loanCounter);

        emit LoanApplied(loanCounter, msg.sender, _amount, _purpose);
    }

    /// @notice Admin menyetujui pinjaman
    function approveLoan(uint256 _loanId)
        public
        onlyAdmin
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        loans[_loanId].status = LoanStatus.Approved;
        loans[_loanId].approvalTime = block.timestamp;

        emit LoanApproved(_loanId, loans[_loanId].borrower, loans[_loanId].totalAmount);
    }

    /// @notice Admin menolak pinjaman
    function rejectLoan(uint256 _loanId, string memory _reason)
        public
        onlyAdmin
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Pending)
    {
        loans[_loanId].status = LoanStatus.Rejected;

        emit LoanRejected(_loanId, loans[_loanId].borrower, _reason);
    }

    /// @notice Admin mencairkan dana pinjaman
    function disburseLoan(uint256 _loanId)
        public
        onlyAdmin
        loanExists(_loanId)
        inStatus(_loanId, LoanStatus.Approved)
    {
        Loan storage loan = loans[_loanId];

        require(address(this).balance >= loan.principalAmount, "Saldo contract tidak cukup!");

        loan.deadline = block.timestamp + LOAN_DURATION;
        loan.status = LoanStatus.Active;

        (bool success, ) = loan.borrower.call{value: loan.principalAmount}("");
        require(success, "Transfer gagal!");

        emit LoanDisbursed(_loanId, loan.borrower, loan.principalAmount);
    }

    /// @notice Borrower membayar cicilan
    function makePayment(uint256 _loanId)
        public
        payable
        loanExists(_loanId)
        onlyBorrower(_loanId)
        inStatus(_loanId, LoanStatus.Active)
    {
        require(msg.value > 0, "Pembayaran harus lebih dari 0!");

        Loan storage loan = loans[_loanId];

        loan.amountRepaid += msg.value;

        uint256 remaining = 0;
        if (loan.totalAmount > loan.amountRepaid) {
            remaining = loan.totalAmount - loan.amountRepaid;
        }

        if (loan.amountRepaid >= loan.totalAmount) {
            loan.status = LoanStatus.Repaid;
            emit LoanRepaid(_loanId, msg.sender);
        }

        emit PaymentMade(_loanId, msg.sender, msg.value, remaining);
    }

    /// @notice Cek apakah pinjaman sudah default
    function checkDefault(uint256 _loanId)
        public
        loanExists(_loanId)
    {
        Loan storage loan = loans[_loanId];

        require(loan.status == LoanStatus.Active, "Loan tidak dalam status Active!");

        if (block.timestamp > loan.deadline && loan.amountRepaid < loan.totalAmount) {
            loan.status = LoanStatus.Defaulted;
            emit LoanDefaulted(_loanId, loan.borrower);
        }
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    function getLoanDetails(uint256 _loanId)
        public
        view
        loanExists(_loanId)
        returns (Loan memory)
    {
        return loans[_loanId];
    }

    function getMyLoans() public view returns (uint256[] memory) {
        return borrowerLoans[msg.sender];
    }

    function calculateInterest(uint256 _principal) public pure returns (uint256) {
        return (_principal * INTEREST_RATE) / 10000;
    }

    function getRemainingAmount(uint256 _loanId)
        public
        view
        loanExists(_loanId)
        returns (uint256)
    {
        Loan memory loan = loans[_loanId];

        if (loan.amountRepaid >= loan.totalAmount) {
            return 0;
        }

        return loan.totalAmount - loan.amountRepaid;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalLoans() public view returns (uint256) {
        return loanCounter;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    function depositFunds() public payable onlyAdmin {
        require(msg.value > 0, "Deposit harus lebih dari 0!");
        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _amount) public onlyAdmin {
        require(_amount > 0, "Amount harus lebih dari 0!");
        require(address(this).balance >= _amount, "Saldo tidak cukup!");

        (bool success, ) = admin.call{value: _amount}("");
        require(success, "Withdraw gagal!");

        emit FundsWithdrawn(msg.sender, _amount);
    }

    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Address tidak valid!");
        admin = _newAdmin;
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
```

---

## 💡 Memahami EduLoan Contract

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      EduLoan Flow                               │
└─────────────────────────────────────────────────────────────────┘

  ADMIN                           MAHASISWA
    │                                 │
    │ depositFunds()                  │
    ▼                                 │
┌───────────┐                         │
│ Contract  │◄────────────────────────┤ applyLoan()
│ Balance   │                         │
└───────────┘                         ▼
    │                           ┌──────────┐
    │                           │ PENDING  │
    │                           └──────────┘
    │ approveLoan()                   │
    ▼                                 │
┌──────────┐                          │
│ APPROVED │◄─────────────────────────┘
└──────────┘
    │
    │ disburseLoan()
    ▼
┌──────────┐     ETH      ┌───────────────┐
│  ACTIVE  │─────────────►│   MAHASISWA   │
└──────────┘              └───────────────┘
    │                            │
    │                            │ makePayment()
    │◄───────────────────────────┘
    │
    ├─── Lunas ───► [REPAID] ✅
    │
    └─── Deadline + Belum Lunas ───► [DEFAULTED] ❌
```

### Status Pinjaman

| Status | Kode | Deskripsi |
|--------|------|-----------|
| `Pending` | 0 | Menunggu approval admin |
| `Approved` | 1 | Disetujui, menunggu pencairan |
| `Active` | 2 | Dana dicairkan, dalam masa cicilan |
| `Repaid` | 3 | Sudah lunas |
| `Defaulted` | 4 | Gagal bayar (melewati deadline) |
| `Rejected` | 5 | Ditolak oleh admin |

### Konstanta

```solidity
INTEREST_RATE = 500      // 5% (500 basis points)
LOAN_DURATION = 365 days // 1 tahun deadline
MIN_LOAN = 0.01 ether    // Minimum pinjaman
MAX_LOAN = 10 ether      // Maximum pinjaman
```

### Perhitungan Bunga

```solidity
// Formula: (principal * INTEREST_RATE) / 10000
// Contoh: 1 ETH pinjaman
// Bunga = (1 ETH * 500) / 10000 = 0.05 ETH (5%)
// Total bayar = 1 ETH + 0.05 ETH = 1.05 ETH
```

---

## 🔨 Compile Contract

### Build

```bash
forge build
```

**Output yang diharapkan:**
```
[⠊] Compiling...
[⠒] Compiling 1 files with Solc 0.8.30
[⠢] Solc 0.8.30 finished in 1.23s
Compiler run successful!
```

### Check Contract Size

```bash
forge build --sizes
```

**Output:**
```
| Contract | Size (KB) | Margin (KB) |
|----------|-----------|-------------|
| EduLoan  | 5.234     | 19.314      |
```

**Size limit:** 24.576 KB (EIP-170)
**EduLoan:** ~5.2 KB ✅ (21% of limit)

### Inspect ABI

```bash
forge inspect EduLoan abi | head -50
```

**Output (excerpt):**
```json
[
  {
    "type": "function",
    "name": "applyLoan",
    "inputs": [
      {"name": "_amount", "type": "uint256"},
      {"name": "_purpose", "type": "string"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  ...
]
```

---

## 🧪 Testing Manual dengan Chisel

Mari test EduLoan secara interaktif:

### Start Chisel

```bash
chisel
```

### Test Calculate Interest

```solidity
➜ uint256 INTEREST_RATE = 500;

➜ uint256 principal = 1 ether;

➜ uint256 interest = (principal * INTEREST_RATE) / 10000;

➜ interest
Type: uint256
├ Hex: 0x00b1a2bc2ec50000
└ Decimal: 50000000000000000

➜ // 0.05 ETH = 5% dari 1 ETH ✅
```

### Test Loan Total

```solidity
➜ uint256 total = principal + interest;

➜ total
Type: uint256
└ Decimal: 1050000000000000000

➜ // 1.05 ETH total yang harus dibayar ✅
```

### Exit Chisel

```solidity
➜ !quit
```

---

## 📊 Struktur File Project

Setelah setup, struktur project Anda:

```
eduloan-foundry/
├── lib/
│   └── forge-std/           # Foundry standard library
├── script/
│   └── (kosong - akan dibuat di Part 4)
├── src/
│   └── EduLoan.sol          # ✅ Contract utama
├── test/
│   └── (kosong - akan dibuat di Part 3)
├── .gitignore
├── foundry.toml             # ✅ Config updated
└── README.md
```

---

## 🎯 Memahami Functions

### Admin Functions

| Function | Deskripsi | Payable |
|----------|-----------|---------|
| `depositFunds()` | Deposit ETH ke contract | ✅ |
| `withdrawFunds(amount)` | Withdraw ETH dari contract | ❌ |
| `approveLoan(loanId)` | Setujui pengajuan | ❌ |
| `rejectLoan(loanId, reason)` | Tolak pengajuan | ❌ |
| `disburseLoan(loanId)` | Cairkan dana ke borrower | ❌ |
| `transferAdmin(newAdmin)` | Transfer admin role | ❌ |

### Borrower Functions

| Function | Deskripsi | Payable |
|----------|-----------|---------|
| `applyLoan(amount, purpose)` | Ajukan pinjaman | ❌ |
| `makePayment(loanId)` | Bayar cicilan | ✅ |
| `getMyLoans()` | Lihat loan IDs milik sendiri | ❌ |

### Public Functions

| Function | Deskripsi | View |
|----------|-----------|------|
| `checkDefault(loanId)` | Update status jika default | ❌ |
| `getLoanDetails(loanId)` | Lihat detail loan | ✅ |
| `getRemainingAmount(loanId)` | Lihat sisa bayar | ✅ |
| `getContractBalance()` | Lihat saldo contract | ✅ |
| `getTotalLoans()` | Lihat total loans | ✅ |
| `calculateInterest(principal)` | Hitung bunga | ✅ |

---

## 💡 Key Concepts Review

### 1. Modifiers

```solidity
modifier onlyAdmin() {
    require(msg.sender == admin, "Hanya admin!");
    _;  // ← Kode fungsi dijalankan di sini
}

// Penggunaan:
function approveLoan(uint256 _loanId) public onlyAdmin {
    // Hanya admin yang bisa masuk sini
}
```

### 2. Events

```solidity
event LoanApplied(
    uint256 indexed loanId,    // indexed = searchable
    address indexed borrower,  // indexed = searchable
    uint256 amount,            // tidak indexed
    string purpose             // tidak indexed
);

// Emit event
emit LoanApplied(loanCounter, msg.sender, _amount, _purpose);
```

### 3. Payable Functions

```solidity
// Fungsi yang MENERIMA ETH
function depositFunds() public payable onlyAdmin {
    // msg.value = jumlah ETH yang dikirim
}

// Fungsi yang MENGIRIM ETH
function disburseLoan(uint256 _loanId) public {
    (bool success, ) = borrower.call{value: amount}("");
    require(success, "Transfer gagal!");
}
```

### 4. Storage vs Memory

```solidity
// Storage: permanent di blockchain (mahal)
Loan storage loan = loans[_loanId];
loan.status = LoanStatus.Active;  // Langsung update di blockchain

// Memory: temporary (murah)
Loan memory loan = loans[_loanId];
return loan;  // Hanya untuk return, tidak update blockchain
```

---

## ✅ Checklist Sebelum Lanjut

Sebelum ke Part 3, pastikan:

- [ ] Project `eduloan-foundry` sudah dibuat
- [ ] `EduLoan.sol` ada di folder `src/`
- [ ] `forge build` berhasil tanpa error
- [ ] Memahami flow EduLoan (apply → approve → disburse → payment)
- [ ] Memahami status pinjaman (Pending → Approved → Active → Repaid/Defaulted)
- [ ] Memahami perhitungan bunga (5%)
- [ ] Sudah coba Chisel untuk test manual

**Semua checked?** ✅ Lanjut ke Part 3!

---

## 🚀 Next: Testing EduLoan

Contract sudah siap! Tapi bagaimana kita memastikan contract ini aman dan berfungsi dengan benar?

**Part 3 akan cover:**
- Filosofi testing smart contract
- Unit tests untuk semua fungsi
- Fuzz testing untuk edge cases
- Test coverage 100%
- Testing best practices

**[📖 Part 3: Testing EduLoan →](./03-testing-eduloan.md)**

---

**Build with confidence! 🔨**
