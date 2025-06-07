---
id: sesi-2
title: "Smart Contract Modular Architecture & Kampus Token Suite"
sidebar_label: "#2 Smart Contract Modular Architecture"
sidebar_position: 2
description: "Implementasi dompet multi-sig BEM dan suite token kampus (ERC-20, ERC-721, ERC-1155) dengan Hardhat Ignition."
---

# Sesi 2: Smart Contract Modular Architecture & Kampus Token Suite

## Informasi Umum Sesi

**Tanggal**: Hari 2  
**Durasi Total**: 8 jam (08:00 - 16:30)  
**Tema Pembelajaran**: Arsitektur Modular & Token Standards Implementation  

Melanjutkan perjalanan pembangunan "Ekosistem Digital Kampus", sesi ini memfokuskan pada implementasi dompet multi-signature untuk tata kelola BEM yang transparan dan suite token kampus yang komprehensif untuk berbagai use-case di lingkungan universitas.

---

## Jadwal Harian Detail

| Waktu            | Aktivitas                                                     | Tujuan                                                    | Materi & Fokus Utama                                                |
|------------------|---------------------------------------------------------------|-----------------------------------------------------------|---------------------------------------------------------------------|
| 09:15 – 09:45    | Kuliah 104 & 105 + Tantangan 1 **BEM MultiSignatureWallet** | Memahami dompet multi-sig & quorum M-of-N                 | Security pattern, struktur contract, governance BEM                |
| 09:45 – 10:00    | Demo Deploy Hardhat Ignition                                  | Memperlihatkan workflow deploy modern                    | Konfigurasi ignition, env vars, verify                             |
| 10:00 – 12:00    | Coding & Unit-Test MultiSig BEM                               | Praktik end-to-end dompet treasury                       | SubmitTx, confirm, execute, revoke, event-driven UX                |
| 13:30 – 14:30    | Kuliah — Smart Contract Modular Architecture                  | Memahami ERC-20/721/1155 & inheritance                   | Interface, library reuse, role-based minting, pause pattern        |
| 14:30 – 16:00    | **ERC Suite Challenge** (CampusCredit, StudentID, CourseBadge)| Implementasi kontrak token kampus                        | OpenZeppelin, mint/burn, pause, access control                     |
| 16:00 – 16:30    | Sesi Evaluasi & Review                                        | Demo, kuis, peer-review                                   | Gas optimisasi, mitigasi risiko, next-steps                        |

---

## Kuliah 104: Error Handling & Code Organization (09:15 - 09:25)

### Error Handling & Reporting

Error handling dalam Solidity adalah fondasi untuk membangun smart contract yang aman dan reliable. Setiap kondisi abnormal harus ditangani dengan baik untuk melindungi user dan funds.

#### Tiga Mekanisme Utama

**1. `require()` - Input Validation & Pre-conditions**

```solidity
// Use Case: Validasi saldo sebelum transfer
function transferFunds(address recipient, uint256 amount) public {
    require(recipient != address(0), "Invalid recipient address");
    require(balances[msg.sender] >= amount, "Insufficient balance");
    require(amount > 0, "Amount must be positive");
    
    balances[msg.sender] -= amount;
    balances[recipient] += amount;
}

// Real Scenario: BEM Treasury withdrawal
function withdrawFromTreasury(uint256 amount) public onlyTreasurer {
    require(amount <= dailyLimit, "Exceeds daily withdrawal limit");
    require(lastWithdrawal + 1 days <= block.timestamp, "Daily limit reached");
    // ... withdrawal logic
}
```

**2. `revert()` - Complex Error Handling**

```solidity
// Use Case: Multi-condition validation dengan custom errors
error InsufficientBalance(uint256 requested, uint256 available);
error UnauthorizedAccess(address caller, string role);

function complexWithdraw(uint256 amount) public {
    if (balances[msg.sender] < amount) {
        revert InsufficientBalance(amount, balances[msg.sender]);
    }
    
    if (!hasRole(TREASURER_ROLE, msg.sender)) {
        revert UnauthorizedAccess(msg.sender, "TREASURER");
    }
    
    // Process withdrawal
}
```

**3. `assert()` - Internal Invariants**

```solidity
// Use Case: Memastikan mathematical invariants
function distributeFunds(address[] memory recipients, uint256[] memory amounts) public {
    uint256 totalBefore = address(this).balance;
    
    for (uint i = 0; i < recipients.length; i++) {
        payable(recipients[i]).transfer(amounts[i]);
    }
    
    // This should NEVER fail - jika fail, ada bug serius
    assert(address(this).balance == totalBefore - sumArray(amounts));
}
```

### Libraries - Reusable Code Modules

Libraries memungkinkan code reuse tanpa deployment berulang, menghemat gas dan meningkatkan maintainability.

#### Library untuk Financial Calculations

```solidity
// Library untuk kalkulasi keuangan kampus
library CampusFinance {
    uint256 constant ADMIN_FEE_PERCENTAGE = 5; // 5%
    uint256 constant LATE_PAYMENT_PENALTY = 2; // 2% per minggu
    
    function calculateAdminFee(uint256 amount) internal pure returns (uint256) {
        return (amount * ADMIN_FEE_PERCENTAGE) / 100;
    }
    
    function calculateLatePenalty(uint256 amount, uint256 weeksLate) 
        internal pure returns (uint256) 
    {
        return (amount * LATE_PAYMENT_PENALTY * weeksLate) / 100;
    }
    
    function splitPayment(uint256 total) 
        internal pure returns (uint256 principal, uint256 fee) 
    {
        fee = calculateAdminFee(total);
        principal = total - fee;
    }
}

// Penggunaan dalam contract
contract TuitionPayment {
    using CampusFinance for uint256;
    
    function payTuition(uint256 amount) public payable {
        (uint256 principal, uint256 adminFee) = amount.splitPayment();
        // Transfer principal ke university account
        // Transfer admin fee ke operational account
    }
}
```

#### Library untuk Array Operations

```solidity
// Library untuk operasi array yang sering digunakan
library ArrayUtils {
    function remove(address[] storage arr, address value) internal {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }
    
    function contains(address[] memory arr, address value) 
        internal pure returns (bool) 
    {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == value) return true;
        }
        return false;
    }
}
```

### Inheritance - Building Complex Systems

Inheritance memungkinkan contract membangun di atas functionality yang sudah ada.

#### Single Inheritance Example

```solidity
// Base contract untuk semua kampus contracts
contract KampusBase {
    address public universityAdmin;
    bool public emergencyStop;
    
    modifier onlyAdmin() {
        require(msg.sender == universityAdmin, "Admin only");
        _;
    }
    
    modifier whenNotPaused() {
        require(!emergencyStop, "Contract paused");
        _;
    }
    
    function pause() external onlyAdmin {
        emergencyStop = true;
    }
}

// Child contract inherit base functionality
contract StudentRegistry is KampusBase {
    mapping(address => bool) public registeredStudents;
    
    function registerStudent(address student) 
        external 
        onlyAdmin 
        whenNotPaused 
    {
        registeredStudents[student] = true;
    }
}
```

#### Multiple Inheritance & Override

```solidity
// Multiple inheritance untuk complex features
contract Timestamped {
    uint256 public createdAt;
    
    constructor() {
        createdAt = block.timestamp;
    }
    
    function age() public view virtual returns (uint256) {
        return block.timestamp - createdAt;
    }
}

contract Expirable is Timestamped {
    uint256 public expiresAt;
    
    constructor(uint256 _duration) {
        expiresAt = createdAt + _duration;
    }
    
    function isExpired() public view returns (bool) {
        return block.timestamp >= expiresAt;
    }
    
    function age() public view virtual override returns (uint256) {
        if (isExpired()) {
            return expiresAt - createdAt;
        }
        return super.age();
    }
}
```

### Interfaces - Contract Communication Standards

Interfaces mendefinisikan contract API tanpa implementation, enabling modularity.

#### Real Use Case: Payment Gateway Interface

```solidity
// Interface untuk berbagai payment methods di kampus
interface IPaymentGateway {
    function processPayment(address payer, uint256 amount) external returns (bool);
    function getTransactionStatus(bytes32 txId) external view returns (string memory);
    function refund(bytes32 txId, uint256 amount) external returns (bool);
}

// Implementation untuk different payment methods
contract CryptoPayment is IPaymentGateway {
    function processPayment(address payer, uint256 amount) 
        external override returns (bool) 
    {
        // Logic untuk crypto payment
        return true;
    }
    
    function getTransactionStatus(bytes32 txId) 
        external view override returns (string memory) 
    {
        // Check on-chain status
        return "completed";
    }
    
    function refund(bytes32 txId, uint256 amount) 
        external override returns (bool) 
    {
        // Process crypto refund
        return true;
    }
}

// Main contract yang use interface
contract TuitionPortal {
    IPaymentGateway public paymentGateway;
    
    function setPaymentGateway(address _gateway) external onlyAdmin {
        paymentGateway = IPaymentGateway(_gateway);
    }
    
    function payTuition() external payable {
        require(paymentGateway.processPayment(msg.sender, msg.value), "Payment failed");
        // Update student payment record
    }
}
```

---

## Kuliah 105: Special Functions & Low-Level Operations (09:25 - 09:45)

### Special & Built-In Functions

Solidity menyediakan global variables dan functions untuk interact dengan blockchain.

#### Message Context Variables

```solidity
contract MessageContext {
    // Track siapa yang melakukan setiap action
    event ActionPerformed(
        address indexed performer,
        uint256 value,
        uint256 timestamp,
        string action
    );
    
    function demonstrateMessageContext() external payable {
        // msg.sender - immediate caller
        address caller = msg.sender;
        
        // msg.value - ETH sent with transaction
        uint256 ethSent = msg.value;
        
        // msg.data - complete calldata
        bytes memory data = msg.data;
        
        // msg.sig - function selector (first 4 bytes)
        bytes4 selector = msg.sig;
        
        emit ActionPerformed(caller, ethSent, block.timestamp, "context_demo");
    }
    
    // Real use case: Donation tracking
    mapping(address => uint256) public donations;
    
    function donate() external payable {
        require(msg.value > 0, "Donation must be positive");
        donations[msg.sender] += msg.value;
        
        // Special reward untuk large donors
        if (msg.value >= 1 ether) {
            // Grant special NFT or privileges
        }
    }
}
```

#### Block Information

```solidity
contract AcademicDeadlines {
    struct Assignment {
        string title;
        uint256 deadline;
        uint256 submittedAt;
    }
    
    mapping(uint256 => Assignment) public assignments;
    
    function submitAssignment(uint256 assignmentId) external {
        Assignment storage assignment = assignments[assignmentId];
        
        // Check deadline using block.timestamp
        require(block.timestamp <= assignment.deadline, "Past deadline");
        
        assignment.submittedAt = block.timestamp;
        
        // Bonus points untuk early submission
        uint256 daysEarly = (assignment.deadline - block.timestamp) / 1 days;
        if (daysEarly >= 3) {
            // Award bonus points
        }
    }
    
    // Randomness untuk lottery (NOT secure for production)
    function pickRandomWinner(address[] memory participants) 
        external view returns (address) 
    {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            block.number,
            participants.length
        )));
        
        return participants[random % participants.length];
    }
}
```

#### Transaction Information

```solidity
contract SecurityAudit {
    // Differentiate between direct calls and contract calls
    modifier onlyDirectCall() {
        require(tx.origin == msg.sender, "No contract calls allowed");
        _;
    }
    
    // High-security function - only EOA dapat call
    function emergencyWithdraw() external onlyDirectCall {
        // Withdraw logic
    }
    
    // Gas management
    function complexCalculation(uint256[] memory data) external {
        uint256 startGas = gasleft();
        
        // Process data...
        for (uint i = 0; i < data.length; i++) {
            // Check gas setiap 100 iterations
            if (i % 100 == 0 && gasleft() < 50000) {
                revert("Insufficient gas for safe completion");
            }
            // Process...
        }
        
        uint256 gasUsed = startGas - gasleft();
        emit GasReport(gasUsed);
    }
}
```

### ABI (Application Binary Interface)

ABI adalah bridge antara high-level Solidity code dan low-level EVM bytecode.

#### Understanding ABI Components

```solidity
// Contract dengan various function types
contract ABIExample {
    // Event - part of ABI
    event DataStored(address indexed user, uint256 value);
    
    // State variable dengan getter - ada di ABI
    uint256 public storedData;
    
    // External function - ada di ABI
    function store(uint256 _data) external {
        storedData = _data;
        emit DataStored(msg.sender, _data);
    }
    
    // External view function - ada di ABI
    function retrieve() external view returns (uint256) {
        return storedData;
    }
    
    // Internal function - TIDAK ada di ABI
    function _internalLogic() internal pure returns (uint256) {
        return 42;
    }
}

/* Generated ABI akan include:
{
  "functions": [
    {
      "name": "store",
      "inputs": [{"name": "_data", "type": "uint256"}],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "name": "retrieve", 
      "inputs": [],
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view"
    }
  ],
  "events": [...],
  ...
}
*/
```

### Function Selectors

Function selectors adalah cara EVM identify function mana yang dipanggil.

#### Computing & Using Function Selectors

```solidity
contract SelectorExample {
    // Function selector = first 4 bytes of keccak256(signature)
    
    function computeSelector() external pure returns (bytes4) {
        // Selector untuk "transfer(address,uint256)"
        return bytes4(keccak256("transfer(address,uint256)"));
        // Returns: 0xa9059cbb
    }
    
    // Manual function routing using selectors
    fallback() external payable {
        bytes4 selector = msg.sig;
        
        if (selector == bytes4(keccak256("customFunction()"))) {
            // Route to custom logic
        } else if (selector == 0xa9059cbb) { // transfer selector
            // Handle transfer
        } else {
            revert("Function not found");
        }
    }
    
    // Real use case: Proxy pattern
    contract MinimalProxy {
        address immutable implementation;
        
        constructor(address _implementation) {
            implementation = _implementation;
        }
        
        fallback() external payable {
            address impl = implementation;
            assembly {
                // Copy calldata to memory
                calldatacopy(0, 0, calldatasize())
                
                // Delegatecall to implementation
                let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
                
                // Copy return data
                returndatacopy(0, 0, returndatasize())
                
                // Return or revert
                switch result
                case 0 { revert(0, returndatasize()) }
                default { return(0, returndatasize()) }
            }
        }
    }
}
```

### Low-Level Calls

Low-level calls memberikan flexibility untuk complex interactions.

#### Types of Low-Level Calls

```solidity
contract LowLevelCalls {
    // 1. Regular CALL - execute di context target contract
    function regularCall(address target, bytes memory data) 
        external payable returns (bool, bytes memory) 
    {
        (bool success, bytes memory result) = target.call{value: msg.value}(data);
        return (success, result);
    }
    
    // 2. STATICCALL - guaranteed no state changes
    function readOnlyCall(address target, bytes memory data) 
        external view returns (bool, bytes memory) 
    {
        (bool success, bytes memory result) = target.staticcall(data);
        return (success, result);
    }
    
    // 3. DELEGATECALL - execute di context contract ini
    function delegateCall(address target, bytes memory data) 
        external returns (bool, bytes memory) 
    {
        (bool success, bytes memory result) = target.delegatecall(data);
        return (success, result);
    }
}
```

#### Real World Use Cases

```solidity
// Multi-call pattern untuk batch operations
contract MultiCall {
    struct Call {
        address target;
        uint256 value;
        bytes data;
    }
    
    function multiCall(Call[] memory calls) 
        external payable returns (bytes[] memory results) 
    {
        results = new bytes[](calls.length);
        
        for (uint i = 0; i < calls.length; i++) {
            (bool success, bytes memory result) = calls[i].target.call{
                value: calls[i].value
            }(calls[i].data);
            
            require(success, string(abi.encodePacked("Call ", i, " failed")));
            results[i] = result;
        }
    }
}

// Safe ETH transfer pattern
contract SafeTransfer {
    function safeTransferETH(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
    }
    
    // Handling contract tanpa receive/fallback
    function forceTransfer(address to, uint256 amount) internal {
        if (!payable(to).send(amount)) {
            // Fallback: Use SELFDESTRUCT pattern (deprecated)
            // Or create intermediate contract
        }
    }
}
```

---

## Demo Deploy Hardhat Ignition (09:45 - 10:00)

### Modern Deployment Workflow

Hardhat Ignition menyediakan declarative deployment system yang trackable dan reproducible.

#### Setup Configuration

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-ignition-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    hardhat: {
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

#### Environment Setup

```bash
# .env file
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
```

#### Ignition Module Structure

```javascript
// ignition/modules/MultiSigDeploy.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MultiSigModule", (m) => {
  // Parameters untuk flexible deployment
  const owners = m.getParameter("owners", [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Ketua BEM
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Bendahara
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"  // Sekretaris
  ]);
  
  const requiredConfirmations = m.getParameter("required", 2);
  
  // Deploy main contract
  const multiSig = m.contract("BEMMultiSigWallet", [owners, requiredConfirmations]);
  
  // Optional: Deploy related contracts
  const treasury = m.contract("TreasuryManager", [multiSig]);
  
  return { multiSig, treasury };
});
```

#### Deployment Commands

```bash
# Deploy ke local hardhat network
npx hardhat ignition deploy ignition/modules/MultiSigDeploy.js

# Deploy ke Sepolia dengan parameters
npx hardhat ignition deploy ignition/modules/MultiSigDeploy.js \
  --network sepolia \
  --parameters '{"owners": ["0x...", "0x...", "0x..."], "required": 2}'

# Verify contract setelah deployment
npx hardhat ignition verify deployment-id --network sepolia
```

---

## Coding & Unit-Test MultiSig BEM (10:00 - 12:00)

### Tantangan 1: BEMMultiSigWallet Implementation

**Real-World Scenario**: BEM mengelola dana dari berbagai sumber (sponsor, universitas, donasi) dan memerlukan sistem transparan untuk pengeluaran dana.

#### Contract Template dengan Hints

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title BEMMultiSigWallet
 * @dev Multi-signature wallet untuk treasury BEM dengan quorum-based execution
 * Real use cases:
 * - Pembayaran vendor untuk event kampus
 * - Distribusi dana bantuan mahasiswa
 * - Pembelian equipment untuk kegiatan BEM
 */
contract BEMMultiSigWallet {
    // Events untuk transparency & off-chain monitoring
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    // State variables
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
        string description; // Deskripsi untuk transparency
        uint256 timestamp;  // Kapan disubmit
    }

    // TODO: Tambahkan mapping untuk tracking konfirmasi
    // mapping(uint => mapping(address => bool)) public isConfirmed;
    
    Transaction[] public transactions;

    // Modifiers menggunakan pattern dari Solidity 104
    modifier onlyOwner() {
        // TODO: Implement dengan require dan error message yang jelas
        // require(isOwner[msg.sender], "BEMMultiSig: caller is not an owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        // TODO: Validasi transaction index
        _;
    }

    modifier notExecuted(uint _txIndex) {
        // TODO: Pastikan belum dieksekusi
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        // TODO: Pastikan caller belum confirm
        _;
    }

    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        // TODO: Implement constructor dengan validasi lengkap
        // Hints:
        // 1. Validate _owners.length > 0
        // 2. Validate _numConfirmationsRequired > 0 && <= _owners.length
        // 3. Check no duplicate owners (use loop)
        // 4. Check no zero addresses
        // 5. Set up isOwner mapping
        // 6. Consider: untuk BEM, minimal 3 owners (Ketua, Bendahara, Sekretaris)
    }

    receive() external payable {
        // TODO: Handle incoming ETH (sponsor payments, etc)
        // emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /**
     * @dev Submit transaction untuk approval
     * Use cases: 
     * - Pembayaran ke vendor event
     * - Transfer dana ke panitia kegiatan
     * - Pembelian inventaris BEM
     */
    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data,
        string memory _description
    ) public onlyOwner {
        // TODO: Create new transaction dengan description
        // Consider adding validation:
        // - _to != address(0)
        // - _value <= address(this).balance
        // - _description not empty for transparency
    }

    /**
     * @dev Confirm transaction oleh owner
     * Real scenario: Bendahara submit, Ketua & Sekretaris confirm
     */
    function confirmTransaction(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        // TODO: Update confirmation status
        // Track siapa saja yang sudah confirm untuk audit
    }

    /**
     * @dev Execute transaction setelah cukup confirmations
     * Use low-level call dari Solidity 105
     */
    function executeTransaction(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        // TODO: Implement execution dengan pattern dari Solidity 105
        // 1. Check cukup confirmations
        // 2. Mark as executed BEFORE calling (prevent reentrancy)
        // 3. Use low-level call: (bool success, ) = _to.call{value: _value}(_data);
        // 4. Require success dengan informative error
        // 5. Emit event dengan details
    }

    /**
     * @dev Revoke confirmation sebelum execution
     * Use case: Owner berubah pikiran atau menemukan error
     */
    function revokeConfirmation(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        // TODO: Allow owner untuk revoke confirmation mereka
        // Update numConfirmations accordingly
    }

    // View functions untuk UI/monitoring
    function getOwners() public view returns (address[] memory) {
        // TODO: Return list of owners
    }

    function getTransactionCount() public view returns (uint) {
        // TODO: Return total transactions
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations,
            string memory description,
            uint256 timestamp
        )
    {
        // TODO: Return complete transaction info
    }

    /**
     * @dev Get pending transactions untuk dashboard
     */
    function getPendingTransactions() public view returns (uint[] memory) {
        // TODO: Return array of unexecuted transaction indices
        // Useful untuk BEM dashboard
    }

    /**
     * @dev Check apakah owner sudah confirm specific transaction
     */
    function getConfirmationStatus(uint _txIndex, address _owner) 
        public view returns (bool) 
    {
        // TODO: Return confirmation status
    }

    // Advanced features untuk BEM use case:
    
    /**
     * @dev Emergency pause - hanya jika semua owners setuju
     */
    bool public paused;
    function emergencyPause() public {
        // TODO: Implement unanimous consent untuk pause
    }

    /**
     * @dev Time-locked transactions untuk planning
     */
    mapping(uint => uint256) public executionTimelock;
    function submitTimelocked(
        address _to,
        uint _value,
        bytes memory _data,
        string memory _description,
        uint256 _executeAfter
    ) public onlyOwner {
        // TODO: Transaction yang hanya bisa diexecute setelah timestamp tertentu
        // Use case: Planned payments untuk event mendatang
    }
}
```

### Testing Strategy & Implementation

```javascript
// test/BEMMultiSigWallet.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BEMMultiSigWallet", function () {
  let multiSig;
  let ketuaBEM, bendahara, sekretaris, vendorEvent, mahasiswa;

  beforeEach(async function () {
    // TODO: Setup realistic BEM scenario
    // Get signers dengan meaningful names
    [ketuaBEM, bendahara, sekretaris, vendorEvent, mahasiswa] = await ethers.getSigners();
    
    // TODO: Deploy contract dengan 3 pengurus BEM
    // Require 2-of-3 untuk execution
  });

  describe("Deployment", function () {
    it("Should set correct BEM officers as owners", async function () {
      // TODO: Verify ketua, bendahara, sekretaris adalah owners
    });

    it("Should reject invalid configurations", async function () {
      // TODO: Test various invalid inputs:
      // - Empty owners array
      // - Required confirmations > owners
      // - Duplicate owners
      // - Zero address as owner
    });
  });

  describe("Treasury Management", function () {
    beforeEach(async function () {
      // Fund treasury dengan sponsor money
      await ketuaBEM.sendTransaction({
        to: multiSig.address,
        value: ethers.utils.parseEther("10.0")
      });
    });

    it("Should handle sponsor deposits correctly", async function () {
      // TODO: Test deposit event emission
      // Verify balance update
    });

    it("Should allow bendahara to submit payment request", async function () {
      // TODO: Bendahara submit pembayaran ke vendor
      // Check transaction stored correctly
      // Verify event emission
    });

    it("Should require multiple confirmations for execution", async function () {
      // TODO: Test 2-of-3 confirmation flow
      // 1. Bendahara submit transaction
      // 2. Ketua confirm
      // 3. Try execute - should fail (only 1 confirmation)
      // 4. Sekretaris confirm
      // 5. Execute - should succeed
    });

    it("Should handle revoke confirmation properly", async function () {
      // TODO: Test scenario where owner changes mind
      // 1. Submit and confirm
      // 2. Revoke confirmation
      // 3. Check confirmation count decreased
    });
  });

  describe("Real-World Scenarios", function () {
    it("Should handle event vendor payment", async function () {
      // TODO: Simulate pembayaran vendor untuk event kampus
      const vendorPayment = ethers.utils.parseEther("2.5");
      
      // Bendahara submit payment request
      // Include description: "Pembayaran sound system untuk Pensi"
      // Multiple owners confirm
      // Execute and verify vendor received payment
    });

    it("Should manage student assistance distribution", async function () {
      // TODO: Test distribusi bantuan ke multiple mahasiswa
      // Use batch transaction dengan data encoding
    });

    it("Should enforce daily withdrawal limits", async function () {
      // TODO: Implement daily limit logic
      // Try multiple withdrawals in same day
      // Should fail if exceeds limit
    });
  });

  describe("Security Features", function () {
    it("Should prevent non-owners from submitting transactions", async function () {
      // TODO: Test access control
      // Random address try submit - should fail
    });

    it("Should prevent double confirmation", async function () {
      // TODO: Owner try confirm twice
      // Second confirmation should fail
    });

    it("Should handle failed transaction execution", async function () {
      // TODO: Test when low-level call fails
      // Create scenario where target contract reverts
    });

    it("Should implement emergency pause", async function () {
      // TODO: Test pause functionality
      // Requires all owners agreement
    });
  });

  describe("Advanced Features", function () {
    it("Should support time-locked transactions", async function () {
      // TODO: Test planned payment
      // Submit with future execution time
      // Try execute before time - should fail
      // Execute after time - should succeed
    });

    it("Should provide comprehensive transaction history", async function () {
      // TODO: Test view functions
      // Get pending transactions
      // Get confirmation status per owner
      // Filter by execution status
    });
  });
});
```

---

## Kuliah — Smart Contract Modular Architecture (13:30 - 14:30)

### Token Standards Overview

Ekosistem kampus digital memerlukan berbagai jenis token untuk different use cases.

#### ERC-20: Fungible Tokens

**Use Cases di Kampus**:
- **Campus Credit**: Saldo untuk kafetaria, printing, laundry
- **Event Points**: Reward partisipasi kegiatan kampus
- **Library Tokens**: Peminjaman buku dan akses resources

```solidity
// Interface ERC-20 standard
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

#### ERC-721: Non-Fungible Tokens (NFTs)

**Use Cases di Kampus**:
- **Student ID Cards**: Kartu mahasiswa digital dengan expiry
- **Achievement Certificates**: Sertifikat prestasi yang unique
- **Event Tickets**: Tiket acara kampus yang tidak bisa diduplikasi

```solidity
// Interface ERC-721 core functions
interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}
```

#### ERC-1155: Multi-Token Standard

**Use Cases di Kampus**:
- **Course Materials**: Different types (video, PDF, quiz) dalam satu contract
- **Mixed Rewards**: Kombinasi fungible points dan unique badges
- **Semester Package**: Bundle berbagai resources mahasiswa

```solidity
// Interface ERC-1155 highlights
interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) 
        external view returns (uint256[] memory);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address account, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
    
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
}
```

### Modular Architecture dengan OpenZeppelin

OpenZeppelin menyediakan battle-tested implementations dengan modular extensions.

#### Common Extensions & Patterns

**1. Access Control**

```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KampusToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    constructor() ERC20("Kampus Token", "KMP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
```

**2. Pausable Pattern**

```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract EmergencyPausable is ERC20, Pausable, Ownable {
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
```

**3. Snapshot Mechanism**

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

contract VotingToken is ERC20, ERC20Snapshot {
    function snapshot() public onlyOwner returns (uint256) {
        return _snapshot();
    }
    
    // Get balance at specific snapshot
    function balanceOfAt(address account, uint256 snapshotId) 
        public view returns (uint256) 
    {
        return super.balanceOfAt(account, snapshotId);
    }
}
```

### Design Patterns untuk Kampus Use Cases

#### 1. Role-Based Minting Pattern

```solidity
contract CampusCredits is ERC20, AccessControl {
    // Different roles untuk different departments
    bytes32 public constant KAFETARIA_MINTER = keccak256("KAFETARIA_MINTER");
    bytes32 public constant LIBRARY_MINTER = keccak256("LIBRARY_MINTER");
    bytes32 public constant ADMIN_MINTER = keccak256("ADMIN_MINTER");
    
    // Rate limits per role
    mapping(bytes32 => uint256) public roleMintLimit;
    mapping(bytes32 => uint256) public lastMintTime;
    mapping(bytes32 => uint256) public mintedToday;
    
    constructor() ERC20("Campus Credits", "CREDIT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        // Set daily limits
        roleMintLimit[KAFETARIA_MINTER] = 10000 * 10**decimals();
        roleMintLimit[LIBRARY_MINTER] = 5000 * 10**decimals();
        roleMintLimit[ADMIN_MINTER] = type(uint256).max;
    }
    
    function mintWithLimit(address to, uint256 amount) public {
        bytes32 role = _getRoleOfSender();
        require(hasRole(role, msg.sender), "Unauthorized minter");
        
        // Check daily limit
        if (block.timestamp > lastMintTime[role] + 1 days) {
            mintedToday[role] = 0;
            lastMintTime[role] = block.timestamp;
        }
        
        require(mintedToday[role] + amount <= roleMintLimit[role], "Exceeds daily limit");
        mintedToday[role] += amount;
        
        _mint(to, amount);
    }
}
```

#### 2. Time-Bound NFT Pattern

```solidity
contract StudentIDCard is ERC721, ERC721URIStorage {
    struct StudentInfo {
        string nim;
        string program;
        uint256 enrollmentYear;
        uint256 expiryDate;
        bool isActive;
    }
    
    mapping(uint256 => StudentInfo) public studentInfo;
    mapping(string => uint256) public nimToTokenId;
    
    function issueStudentID(
        address student,
        string memory nim,
        string memory program,
        string memory tokenURI
    ) public onlyRole(REGISTRAR_ROLE) {
        require(nimToTokenId[nim] == 0, "NIM already registered");
        
        uint256 tokenId = _nextTokenId++;
        uint256 expiryDate = block.timestamp + (4 * 365 days);
        
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        studentInfo[tokenId] = StudentInfo({
            nim: nim,
            program: program,
            enrollmentYear: block.timestamp,
            expiryDate: expiryDate,
            isActive: true
        });
        
        nimToTokenId[nim] = tokenId;
    }
    
    function renewStudentID(uint256 tokenId) public onlyRole(REGISTRAR_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        StudentInfo storage info = studentInfo[tokenId];
        require(info.isActive, "Student not active");
        
        info.expiryDate = block.timestamp + (365 days);
        emit StudentIDRenewed(tokenId, info.expiryDate);
    }
    
    function deactivateStudent(uint256 tokenId) public onlyRole(REGISTRAR_ROLE) {
        studentInfo[tokenId].isActive = false;
        emit StudentDeactivated(tokenId);
    }
}
```

#### 3. Composite Token Pattern (ERC-1155)

```solidity
contract UniversityAssets is ERC1155, AccessControl {
    // Token ID ranges untuk different categories
    uint256 constant COURSE_MATERIALS_START = 1000;
    uint256 constant CERTIFICATES_START = 2000;
    uint256 constant EVENT_TICKETS_START = 3000;
    uint256 constant MERCHANDISE_START = 4000;
    
    // Metadata untuk each token type
    struct TokenMetadata {
        string name;
        string category;
        bool isTransferable;
        bool isBurnable;
        uint256 maxSupply;
        uint256 currentSupply;
    }
    
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    
    function createCourseaterial(
        uint256 courseId,
        string memory materialName,
        uint256 maxSupply
    ) public onlyRole(PROFESSOR_ROLE) returns (uint256) {
        uint256 tokenId = COURSE_MATERIALS_START + courseId;
        
        tokenMetadata[tokenId] = TokenMetadata({
            name: materialName,
            category: "Course Material",
            isTransferable: false,
            isBurnable: true,
            maxSupply: maxSupply,
            currentSupply: 0
        });
        
        emit CourseaterialCreated(tokenId, materialName);
        return tokenId;
    }
    
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public {
        for (uint i = 0; i < ids.length; i++) {
            TokenMetadata storage metadata = tokenMetadata[ids[i]];
            require(
                metadata.currentSupply + amounts[i] <= metadata.maxSupply,
                "Exceeds max supply"
            );
            metadata.currentSupply += amounts[i];
        }
        
        _mintBatch(to, ids, amounts, "");
    }
    
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        // Check transferability for each token
        for (uint i = 0; i < ids.length; i++) {
            if (from != address(0) && to != address(0)) {
                require(
                    tokenMetadata[ids[i]].isTransferable,
                    "Token not transferable"
                );
            }
        }
        
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
```

---

## ERC Suite Challenge (14:30 - 16:00)

### Tantangan 2: Kampus Token Suite Implementation

Implementasikan tiga contract token untuk ekosistem kampus digital dengan real-world functionality.

| Kontrak | Nama | Fungsi Kampus | Fitur Tambahan |
|---------|------|---------------|----------------|
| ERC-20  | **CampusCredit** | Saldo kafetaria / printing | `pause() / unpause()` |
| ERC-721 | **StudentID** | Kartu identitas NFT (kadaluwarsa 4 thn) | Metadata URI, `burnExpired()` |
| ERC-1155| **CourseBadge** | Sertifikat mata kuliah & tiket acara | Batch mint, role MINTER/PAUSER |

### 1. CampusCredit (ERC-20) Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CampusCredit
 * @dev ERC-20 token untuk transaksi dalam kampus
 * Use cases:
 * - Pembayaran di kafetaria
 * - Biaya printing dan fotokopi
 * - Laundry service
 * - Peminjaman equipment
 */
contract CampusCredit is ERC20, ERC20Burnable, Pausable, AccessControl {
    // TODO: Define role constants
    // bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Additional features untuk kampus
    mapping(address => uint256) public dailySpendingLimit;
    mapping(address => uint256) public spentToday;
    mapping(address => uint256) public lastSpendingReset;
    
    // Merchant whitelist
    mapping(address => bool) public isMerchant;
    mapping(address => string) public merchantName;

    constructor() ERC20("Campus Credit", "CREDIT") {
        // TODO: Setup roles
        // Hint:
        // 1. Grant DEFAULT_ADMIN_ROLE ke msg.sender
        // 2. Grant PAUSER_ROLE ke msg.sender
        // 3. Grant MINTER_ROLE ke msg.sender
        // 4. Consider initial mint untuk treasury
    }

    /**
     * @dev Pause all token transfers
     * Use case: Emergency atau maintenance
     */
    function pause() public {
        // TODO: Implement dengan role check
        // Only PAUSER_ROLE can pause
    }

    function unpause() public {
        // TODO: Implement unpause
    }

    /**
     * @dev Mint new tokens
     * Use case: Top-up saldo mahasiswa
     */
    function mint(address to, uint256 amount) public {
        // TODO: Implement dengan role check
        // Only MINTER_ROLE can mint
        // Consider adding minting limits
    }

    /**
     * @dev Register merchant
     * Use case: Kafetaria, toko buku, laundry
     */
    function registerMerchant(address merchant, string memory name) 
        public onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        // TODO: Register merchant untuk accept payments
    }

    /**
     * @dev Set daily spending limit untuk mahasiswa
     * Use case: Parental control atau self-control
     */
    function setDailyLimit(address student, uint256 limit) 
        public onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        // TODO: Set spending limit
    }

    /**
     * @dev Transfer dengan spending limit check
     */
    function transferWithLimit(address to, uint256 amount) public {
        // TODO: Check daily limit before transfer
        // Reset limit if new day
        // Update spent amount
        // Then do normal transfer
    }

    /**
     * @dev Override _beforeTokenTransfer untuk add pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20) {
        // TODO: Add pause check
        // super._beforeTokenTransfer(from, to, amount);
        // require(!paused(), "Token transfers paused");
    }

    /**
     * @dev Cashback mechanism untuk encourage usage
     */
    uint256 public cashbackPercentage = 2; // 2%
    
    function transferWithCashback(address merchant, uint256 amount) public {
        // TODO: Transfer to merchant dengan cashback ke sender
        // Calculate cashback
        // Transfer main amount
        // Mint cashback to sender
    }
}
```

### 2. StudentID (ERC-721) Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StudentID
 * @dev NFT-based student identity card
 * Features:
 * - Auto-expiry after 4 years
 * - Renewable untuk active students
 * - Contains student metadata
 * - Non-transferable (soulbound)
 */
contract StudentID is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    
    struct StudentData {
        string nim;
        string name;
        string major;
        uint256 enrollmentYear;
        uint256 expiryDate;
        bool isActive;
        uint8 semester;
    }
    
    // TODO: Add mappings
    // mapping(uint256 => StudentData) public studentData;
    // mapping(string => uint256) public nimToTokenId; // Prevent duplicate NIM
    // mapping(address => uint256) public addressToTokenId; // One ID per address
    
    // Events
    event StudentIDIssued(
        uint256 indexed tokenId, 
        string nim, 
        address student,
        uint256 expiryDate
    );
    event StudentIDRenewed(uint256 indexed tokenId, uint256 newExpiryDate);
    event StudentStatusUpdated(uint256 indexed tokenId, bool isActive);
    event ExpiredIDBurned(uint256 indexed tokenId);

    constructor() ERC721("Student Identity Card", "SID") Ownable(msg.sender) {}

    /**
     * @dev Issue new student ID
     * Use case: New student enrollment
     */
    function issueStudentID(
        address to,
        string memory nim,
        string memory name,
        string memory major,
        string memory uri
    ) public onlyOwner {
        // TODO: Implement ID issuance
        // Hints:
        // 1. Check NIM tidak duplicate (use nimToTokenId)
        // 2. Check address belum punya ID (use addressToTokenId)
        // 3. Calculate expiry (4 years from now)
        // 4. Mint NFT
        // 5. Set token URI (foto + metadata)
        // 6. Store student data
        // 7. Update mappings
        // 8. Emit event
    }
    
    /**
     * @dev Renew student ID untuk semester baru
     */
    function renewStudentID(uint256 tokenId) public onlyOwner {
        // TODO: Extend expiry date
        // Check token exists
        // Check student is active
        // Add 6 months to expiry
        // Update semester
        // Emit renewal event
    }
    
    /**
     * @dev Update student status (active/inactive)
     * Use case: Cuti, DO, atau lulus
     */
    function updateStudentStatus(uint256 tokenId, bool isActive) public onlyOwner {
        // TODO: Update active status
        // If inactive, maybe reduce privileges
    }
    
    /**
     * @dev Burn expired IDs
     * Use case: Cleanup expired cards
     */
    function burnExpired(uint256 tokenId) public {
        // TODO: Allow anyone to burn if expired
        // Check token exists
        // Check if expired (block.timestamp > expiryDate)
        // Burn token
        // Clean up mappings
        // Emit event
    }
    
    /**
     * @dev Check if ID is expired
     */
    function isExpired(uint256 tokenId) public view returns (bool) {
        // TODO: Return true if expired
    }
    
    /**
     * @dev Get student info by NIM
     */
    function getStudentByNIM(string memory nim) public view returns (
        address owner,
        uint256 tokenId,
        StudentData memory data
    ) {
        // TODO: Lookup student by NIM
    }

    /**
     * @dev Override transfer functions to make non-transferable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        // TODO: Make soulbound (non-transferable)
        // Only allow minting (from == address(0)) and burning (to == address(0))
        // require(from == address(0) || to == address(0), "SID is non-transferable");
        // super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // Override functions required untuk multiple inheritance
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

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        // TODO: Clean up student data when burning
        // delete studentData[tokenId];
        // delete nimToTokenId[studentData[tokenId].nim];
        // delete addressToTokenId[ownerOf(tokenId)];
    }
}
```

### 3. CourseBadge (ERC-1155) Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/**
 * @title CourseBadge
 * @dev Multi-token untuk berbagai badges dan certificates
 * Token types:
 * - Course completion certificates (non-fungible)
 * - Event attendance badges (fungible)
 * - Achievement medals (limited supply)
 * - Workshop participation tokens
 */
contract CourseBadge is ERC1155, AccessControl, Pausable, ERC1155Supply {
    // Role definitions
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token ID ranges untuk organization
    uint256 public constant CERTIFICATE_BASE = 1000;
    uint256 public constant EVENT_BADGE_BASE = 2000;
    uint256 public constant ACHIEVEMENT_BASE = 3000;
    uint256 public constant WORKSHOP_BASE = 4000;
    
    // Token metadata structure
    struct TokenInfo {
        string name;
        string category;
        uint256 maxSupply;
        bool isTransferable;
        uint256 validUntil; // 0 = no expiry
        address issuer;
    }
    
    // TODO: Add mappings
    // mapping(uint256 => TokenInfo) public tokenInfo;
    // mapping(uint256 => string) private _tokenURIs;
    
    // Track student achievements
    // mapping(address => uint256[]) public studentBadges;
    // mapping(uint256 => mapping(address => uint256)) public earnedAt; // Timestamp
    
    // Counter untuk generate unique IDs
    uint256 private _certificateCounter;
    uint256 private _eventCounter;
    uint256 private _achievementCounter;
    uint256 private _workshopCounter;

    constructor() ERC1155("") {
        // TODO: Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Create new certificate type
     * Use case: Mata kuliah baru atau program baru
     */
    function createCertificateType(
        string memory name,
        uint256 maxSupply,
        string memory uri
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        // TODO: Create new certificate type
        // 1. Generate ID: CERTIFICATE_BASE + _certificateCounter++
        // 2. Store token info
        // 3. Set URI
        // 4. Return token ID
    }

    /**
     * @dev Issue certificate to student
     * Use case: Student lulus mata kuliah
     */
    function issueCertificate(
        address student,
        uint256 certificateType,
        string memory additionalData
    ) public onlyRole(MINTER_ROLE) {
        // TODO: Mint certificate
        // 1. Verify certificate type exists
        // 2. Check max supply not exceeded
        // 3. Mint 1 token to student
        // 4. Record timestamp
        // 5. Add to student's badge list
    }

    /**
     * @dev Batch mint event badges
     * Use case: Attendance badges untuk peserta event
     */
    function mintEventBadges(
        address[] memory attendees,
        uint256 eventId,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        // TODO: Batch mint to multiple addresses
        // Use loop to mint to each attendee
        // Record participation
    }

    /**
     * @dev Set metadata URI untuk token
     */
    function setTokenURI(uint256 tokenId, string memory newuri) 
        public onlyRole(URI_SETTER_ROLE) 
    {
        // TODO: Store custom URI per token
    }

    /**
     * @dev Get all badges owned by student
     */
    function getStudentBadges(address student) 
        public view returns (uint256[] memory) 
    {
        // TODO: Return array of token IDs owned by student
    }

    /**
     * @dev Verify badge ownership dengan expiry check
     */
    function verifyBadge(address student, uint256 tokenId) 
        public view returns (bool isValid, uint256 earnedTimestamp) 
    {
        // TODO: Check ownership and validity
        // 1. Check balance > 0
        // 2. Check not expired
        // 3. Return status and when earned
    }

    /**
     * @dev Pause all transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Override transfer to check transferability and pause
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        // TODO: Check transferability for each token
        // for (uint i = 0; i < ids.length; i++) {
        //     if (from != address(0) && to != address(0)) { // Not mint or burn
        //         require(tokenInfo[ids[i]].isTransferable, "Token not transferable");
        //     }
        // }
        
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /**
     * @dev Override to return custom URI per token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        // TODO: Return stored URI for token
        // return _tokenURIs[tokenId];
    }

    /**
     * @dev Check interface support
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Achievement System Functions
    
    /**
     * @dev Grant achievement badge
     * Use case: Dean's list, competition winner, etc
     */
    function grantAchievement(
        address student,
        string memory achievementName,
        uint256 rarity // 1 = common, 2 = rare, 3 = legendary
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        // TODO: Create unique achievement NFT
        // Generate achievement ID
        // Set limited supply based on rarity
        // Mint to deserving student
    }

    /**
     * @dev Create workshop series dengan multiple sessions
     */
    function createWorkshopSeries(
        string memory seriesName,
        uint256 totalSessions
    ) public onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        // TODO: Create multiple related tokens
        // Return array of token IDs for each session
    }
}
```

### Deployment dengan Hardhat Ignition

```javascript
// ignition/modules/TokenSuite.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenSuiteModule", (m) => {
  // Deploy ERC-20: CampusCredit
  const campusCredit = m.contract("CampusCredit");
  
  // Deploy ERC-721: StudentID
  const studentID = m.contract("StudentID");
  
  // Deploy ERC-1155: CourseBadge
  const courseBadge = m.contract("CourseBadge");
  
  // Optional: Setup initial configuration
  m.call(campusCredit, "registerMerchant", [
    "0x...", // Kafetaria address
    "Kafetaria Kampus"
  ]);
  
  return { campusCredit, studentID, courseBadge };
});
```

### Testing Strategy untuk Token Suite

```javascript
// test/CampusCredit.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampusCredit Token", function () {
  let campusCredit;
  let admin, minter, student1, student2, kafetaria;

  beforeEach(async function () {
    [admin, minter, student1, student2, kafetaria] = await ethers.getSigners();
    
    const CampusCredit = await ethers.getContractFactory("CampusCredit");
    campusCredit = await CampusCredit.deploy();
    
    // Setup roles
    await campusCredit.grantRole(
      await campusCredit.MINTER_ROLE(),
      minter.address
    );
  });

  describe("Minting & Supply", function () {
    it("Should allow minter to mint tokens", async function () {
      // TODO: Test minting functionality
    });

    it("Should enforce role-based access", async function () {
      // TODO: Test unauthorized minting fails
    });
  });

  describe("Daily Spending Limits", function () {
    it("Should enforce spending limits", async function () {
      // TODO: Set limit, try exceed, should fail
    });

    it("Should reset limit daily", async function () {
      // TODO: Test limit reset after 24 hours
    });
  });

  describe("Merchant System", function () {
    it("Should register and validate merchants", async function () {
      // TODO: Register merchant, check payment flow
    });

    it("Should apply cashback correctly", async function () {
      // TODO: Test cashback calculation and distribution
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause all transfers when paused", async function () {
      // TODO: Pause and try transfer
    });
  });
});

// test/StudentID.test.js
describe("StudentID NFT", function () {
  // Similar structure for StudentID tests
  // Focus on:
  // - Non-transferability
  // - Expiry mechanism
  // - NIM uniqueness
  // - Renewal process
});

// test/CourseBadge.test.js
describe("CourseBadge Multi-Token", function () {
  // Test ERC-1155 functionality
  // - Multiple token types
  // - Batch operations
  // - Role-based minting
  // - URI management
});
```

---

## Sesi Evaluasi & Review (16:00 - 16:30)

### Demo & Presentation

**Contract Demonstration Checklist**:

1. **MultiSig Wallet Operations**
   - Show 2-of-3 approval flow on Etherscan
   - Demonstrate failed execution with insufficient approvals
   - Display transaction history and status

2. **Token Functionality**
   - Mint CampusCredit and show balance
   - Issue StudentID NFT with metadata
   - Batch mint CourseBadge for event

3. **Integration Scenarios**
   - MultiSig controlling token contract ownership
   - Treasury funding student wallets
   - Badge verification system

### Technical Quiz

1. **Apa perbedaan utama antara `require()`, `revert()`, dan `assert()` dalam error handling?**
   - `require()`: Pre-condition checks, refund gas
   - `revert()`: Custom errors, flexible
   - `assert()`: Invariants, consumes all gas

2. **Mengapa menggunakan library dalam Solidity? Berikan contoh use case.**
   - Code reuse, gas efficiency, cleaner contracts
   - Example: SafeMath, Address utils

3. **Jelaskan konsep function selector dan bagaimana digunakan dalam low-level calls.**
   - First 4 bytes of keccak256 hash
   - Used to identify which function to call

4. **Apa keuntungan ERC-1155 dibanding ERC-20 dan ERC-721?**
   - Single contract for multiple token types
   - Batch operations
   - Gas efficient for games/complex systems

5. **Bagaimana cara implement pause mechanism yang aman?**
   - Use OpenZeppelin Pausable
   - Role-based pause control
   - Override transfer functions

### Gas Optimization Analysis

**Tips untuk Optimize Gas**:

```solidity
// Bad: Multiple storage reads
function bad() public {
    for (uint i = 0; i < owners.length; i++) {
        if (owners[i] == msg.sender) {
            // do something
        }
    }
}

// Good: Cache array length
function good() public {
    uint256 length = owners.length;
    for (uint i = 0; i < length; i++) {
        if (owners[i] == msg.sender) {
            // do something
        }
    }
}

// Better: Use mapping for O(1) lookup
mapping(address => bool) public isOwner;
```

### Security Best Practices Review

**Critical Security Patterns**:

1. **Reentrancy Protection**
   ```solidity
   // Update state BEFORE external call
   balances[msg.sender] -= amount;
   (bool success, ) = msg.sender.call{value: amount}("");
   require(success, "Transfer failed");
   ```

2. **Access Control**
   ```solidity
   // Use role-based access from OpenZeppelin
   onlyRole(MINTER_ROLE)
   ```

3. **Integer Overflow** (Solidity 0.8+ has built-in protection)

4. **Front-running Prevention**
   - Use commit-reveal schemes
   - Time-locks for sensitive operations

### Peer Review Session

**Code Review Checklist**:
- [ ] Proper error handling implemented
- [ ] Access control on all admin functions
- [ ] Events emitted for all state changes
- [ ] Gas-efficient patterns used
- [ ] No security vulnerabilities
- [ ] Clear documentation and comments

---

## Deliverables

### 1. **Repo GitHub `sesi-2-digital-kampus/`**

```
contracts/
├─ BEMMultiSigWallet.sol
├─ CampusCredit.sol
├─ StudentID.sol
└─ CourseBadge.sol
ignition/
├─ modules/
│  ├─ MultiSigDeploy.js
│  └─ TokenSuite.js
test/
├─ BEMMultiSigWallet.test.js
├─ CampusCredit.test.js
├─ StudentID.test.js
└─ CourseBadge.test.js
scripts/
├─ deploy.js
└─ verify.js
.env.example
hardhat.config.js
package.json
README.md
```

### 2. Kontrak ter-verifikasi di Sepolia Etherscan

**Verification Checklist**:
- [ ] BEMMultiSigWallet deployed & verified
- [ ] CampusCredit deployed & verified
- [ ] StudentID deployed & verified
- [ ] CourseBadge deployed & verified
- [ ] All source code readable on Etherscan

### 3. **REFLEKSI.md**

```markdown
# Refleksi Pembelajaran Sesi 2

## Konsep yang Dipelajari

### Solidity 104: Error Handling & Code Organization
- [Jelaskan pemahaman tentang require, revert, assert]
- [Bagaimana libraries membantu code reuse]
- [Penggunaan inheritance dalam kontrak]
- [Peran interfaces dalam modular architecture]

### Solidity 105: Special Functions & Low-Level Operations
- [Global variables yang paling berguna]
- [Pemahaman tentang ABI dan function selectors]
- [Kapan menggunakan low-level calls]

### Multi-Signature Wallet
- [Mengapa penting untuk treasury management]
- [Challenge dalam implementasi]
- [Real-world applications]

### Token Standards
- [Perbedaan use case ERC-20, 721, 1155]
- [Pentingnya OpenZeppelin]
- [Security considerations]

## Hambatan Teknis

### Challenge 1: Multi-Sig Implementation
- [Kesulitan yang dihadapi]
- [Bagaimana mengatasi]

### Challenge 2: Token Suite
- [Complex inheritance issues]
- [Gas optimization challenges]

## Solusi & Learning

### Problem Solving Approach
- [Strategi debugging]
- [Resource yang membantu]
- [Collaboration dengan peers]

## Rencana Kedepan

### Skills untuk Ditingkatkan
- [ ] Gas optimization techniques
- [ ] Advanced security patterns
- [ ] Testing strategies

### Proyek Lanjutan
- [Ide untuk extend contracts]
- [Integration possibilities]
```

---

## Resources

### Documentation
- [Hardhat Ignition Docs](https://hardhat.org/ignition/docs/getting-started)
- [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x/)
- [Ethereum Development Tutorials](https://ethereum.org/id/developers/tutorials/)

### Security Resources
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [SWC Registry](https://swcregistry.io/)
- [Audit Reports Collection](https://github.com/0xNazgul/Blockchain-Security-Audit-List)

### Testing Resources
- [Hardhat Testing Guide](https://hardhat.org/tutorial/testing-contracts)
- [Chai Matchers for Ethereum](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)

### Gas Optimization
- [Gas Optimization Techniques](https://github.com/iskdrews/awesome-solidity-gas-optimization)
- [EVM Codes](https://www.evm.codes/)

---

## Kesimpulan Sesi 2

🏆 **Achievement Unlocked!** Anda telah berhasil membangun fondasi governance dan ekonomi token untuk ekosistem kampus digital.

**Pencapaian Hari Ini**:
- 🏛️ Implementasi multi-sig wallet untuk transparansi keuangan BEM
- 💰 Deploy sistem token untuk ekonomi internal kampus
- 🎓 Create NFT identity system untuk mahasiswa
- 🏅 Build multi-token platform untuk achievements
- 🔒 Master advanced Solidity patterns dan security

**Skills yang Dikuasai**:
- Error handling & defensive programming
- Modular architecture dengan libraries & inheritance
- Low-level operations untuk advanced functionality
- Token standards implementation (ERC-20/721/1155)
- Role-based access control
- Gas optimization awareness

Ekosistem digital kampus kini memiliki:
- **Financial Layer**: Multi-sig treasury untuk governance
- **Economic Layer**: Fungible tokens untuk transaksi
- **Identity Layer**: NFT untuk verifikasi mahasiswa
- **Achievement Layer**: Multi-token untuk badges & certificates

**Persiapan Sesi 3**: Frontend integration akan menghidupkan smart contracts ini dengan user interface yang intuitif. Account Abstraction akan membuat Web3 accessible untuk semua mahasiswa, bahkan yang non-technical!

---

```
---
id: sesi-3
title: "Sesi 3: Frontend Integration + Account Abstraction (AA)"
sidebar_label: "Sesi 3: Frontend Integration + Account Abstraction (AA)"
description: "Integrasi frontend Web3 modern dan implementasi Account Abstraction (ERC-4337)"
---
```

*"Code without users is just philosophy. Mari kita build bridges antara smart contracts dan real users!" 🚀*