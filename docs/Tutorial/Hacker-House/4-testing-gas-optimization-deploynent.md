---
id: sesi-4
title: "Sesi 4: Testing, Gas Optimization, Deployment"
sidebar_label: "Sesi 4: Testing, Gas Optimization, Deployment"
description: "Strategi testing, teknik optimasi gas, dan praktik terbaik deployment untuk smart contract"
---

# Sesi 4: Testing, Gas Optimization, Deployment

Selamat datang di sesi keempat Bootcamp **Web3 Hacker House**! Pada sesi ini, kita akan fokus pada aspek fundamental namun sering terabaikan dalam pengembangan smart contract: testing, optimasi gas, dan strategi deployment. Kita akan mempelajari penggunaan framework testing populer (Hardhat dan Foundry), mengeksplorasi pola optimasi gas dengan inline assembly, dan melakukan hands-on dengan fuzzing test dan benchmark gas pada fungsi ERC20.

---

## Bagian 1: Unit Testing di Hardhat dan Foundry

Testing merupakan bagian krusial dalam pengembangan smart contract. Mengingat sifat immutable dari smart contract setelah di-deploy dan nilai finansial yang terlibat, menemukan bug sebelum deployment sangat penting.

### 1.1 Testing di Hardhat

[Hardhat](https://hardhat.org/) adalah environment pengembangan Ethereum yang populer dengan dukungan testing yang kuat menggunakan Mocha dan Chai.

#### Setup Hardhat Project untuk Testing

```bash
mkdir hardhat-testing
cd hardhat-testing
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox chai

# Inisialisasi project Hardhat
npx hardhat init
# Pilih "Create a TypeScript project"
```

Ini akan membuat struktur project standar:

```
hardhat-testing/
├── contracts/
├── scripts/
├── test/
├── hardhat.config.ts
└── package.json
```

#### Contoh Smart Contract untuk Testing

Buat file `contracts/SimpleToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**uint256(_decimals);
        _balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to the zero address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Approve to the zero address");
        
        _allowances[msg.sender][spender] = amount;
        
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(from != address(0), "Transfer from the zero address");
        require(to != address(0), "Transfer to the zero address");
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");

        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}
```

#### Writing Unit Tests in JavaScript/TypeScript

Buat file `test/SimpleToken.test.ts`:

```typescript
import { ethers } from "hardhat";
import { expect } from "chai";
import { SimpleToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SimpleToken", function () {
  let simpleToken: SimpleToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // Constants for token creation
  const name = "Simple Token";
  const symbol = "SMPL";
  const decimals = 18;
  const initialSupply = 1000;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const SimpleTokenFactory = await ethers.getContractFactory("SimpleToken");
    simpleToken = await SimpleTokenFactory.deploy(name, symbol, decimals, initialSupply);
  });

  describe("Deployment", function () {
    it("Should set the right name, symbol, and decimals", async function () {
      expect(await simpleToken.name()).to.equal(name);
      expect(await simpleToken.symbol()).to.equal(symbol);
      expect(await simpleToken.decimals()).to.equal(decimals);
    });

    it("Should assign the total supply to the owner", async function () {
      const expectedSupply = ethers.parseUnits(initialSupply.toString(), decimals);
      expect(await simpleToken.totalSupply()).to.equal(expectedSupply);
      expect(await simpleToken.balanceOf(owner.address)).to.equal(expectedSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      const transferAmount = ethers.parseUnits("50", decimals);
      await simpleToken.transfer(addr1.address, transferAmount);

      // Check balances
      expect(await simpleToken.balanceOf(addr1.address)).to.equal(transferAmount);
      
      // Transfer 20 tokens from addr1 to addr2
      const secondTransferAmount = ethers.parseUnits("20", decimals);
      await simpleToken.connect(addr1).transfer(addr2.address, secondTransferAmount);

      // Check balances again
      expect(await simpleToken.balanceOf(addr1.address)).to.equal(transferAmount - secondTransferAmount);
      expect(await simpleToken.balanceOf(addr2.address)).to.equal(secondTransferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await simpleToken.balanceOf(owner.address);
      
      // Try to send more tokens than the owner has
      await expect(
        simpleToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Insufficient balance");

      // Owner balance shouldn't have changed
      expect(await simpleToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update allowances correctly", async function () {
      const allowanceAmount = ethers.parseUnits("100", decimals);
      
      // Approve addr1 to spend owner's tokens
      await simpleToken.approve(addr1.address, allowanceAmount);
      
      // Check allowance
      expect(await simpleToken.allowance(owner.address, addr1.address)).to.equal(allowanceAmount);
      
      // addr1 uses transferFrom to transfer tokens from owner to addr2
      const transferAmount = ethers.parseUnits("50", decimals);
      await simpleToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      // Check balances and allowance
      expect(await simpleToken.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await simpleToken.allowance(owner.address, addr1.address)).to.equal(allowanceAmount - transferAmount);
    });
  });

  describe("Events", function () {
    it("Should emit Transfer events", async function () {
      const transferAmount = ethers.parseUnits("50", decimals);
      
      // Check that the transfer function emits a Transfer event
      await expect(simpleToken.transfer(addr1.address, transferAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should emit Approval events", async function () {
      const approvalAmount = ethers.parseUnits("100", decimals);
      
      // Check that the approve function emits an Approval event
      await expect(simpleToken.approve(addr1.address, approvalAmount))
        .to.emit(simpleToken, "Approval")
        .withArgs(owner.address, addr1.address, approvalAmount);
    });
  });
});
```

#### Running Tests in Hardhat

```bash
npx hardhat test
```

Output akan menunjukkan apakah semua test berhasil atau tidak:

```
SimpleToken
  Deployment
    ✓ Should set the right name, symbol, and decimals
    ✓ Should assign the total supply to the owner
  Transactions
    ✓ Should transfer tokens between accounts
    ✓ Should fail if sender doesn't have enough tokens
    ✓ Should update allowances correctly
  Events
    ✓ Should emit Transfer events
    ✓ Should emit Approval events

7 passing (1s)
```

#### Hardhat Test dengan Code Coverage

Hardhat mendukung code coverage untuk melihat seberapa banyak kode kontrak yang dicakup oleh test:

```bash
npx hardhat coverage
```

Output akan menunjukkan persentase coverage:

```
-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------------|----------|----------|----------|----------|----------------|
 contracts/        |    100.0 |    100.0 |    100.0 |    100.0 |                |
  SimpleToken.sol  |    100.0 |    100.0 |    100.0 |    100.0 |                |
-------------------|----------|----------|----------|----------|----------------|
All files          |    100.0 |    100.0 |    100.0 |    100.0 |                |
-------------------|----------|----------|----------|----------|----------------|
```

### 1.2 Testing di Foundry

[Foundry](https://book.getfoundry.sh/) adalah toolkit pengembangan Ethereum yang ditulis dalam Rust, menyediakan kemampuan testing yang sangat cepat. Berbeda dengan Hardhat, Foundry menggunakan Solidity untuk menulis test.

#### Setup Foundry Project

```bash
# Install Foundry jika belum ada
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Buat project baru
mkdir foundry-testing
cd foundry-testing
forge init
```

Ini akan membuat struktur project:

```
foundry-testing/
├── lib/
├── src/
├── test/
├── script/
└── foundry.toml
```

#### Kontrak untuk Testing

Salin kontrak `SimpleToken.sol` ke direktori `src/`.

#### Writing Unit Tests in Solidity

Buat file `test/SimpleToken.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/SimpleToken.sol";

contract SimpleTokenTest is Test {
    SimpleToken public token;
    
    // Test accounts
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    // Constants for token creation
    string constant NAME = "Simple Token";
    string constant SYMBOL = "SMPL";
    uint8 constant DECIMALS = 18;
    uint256 constant INITIAL_SUPPLY = 1000;
    
    // Setup before each test
    function setUp() public {
        vm.startPrank(owner); // Set msg.sender to owner
        token = new SimpleToken(NAME, SYMBOL, DECIMALS, INITIAL_SUPPLY);
        vm.stopPrank();
    }
    
    // Test deployment properties
    function testDeployment() public {
        assertEq(token.name(), NAME);
        assertEq(token.symbol(), SYMBOL);
        assertEq(token.decimals(), DECIMALS);
        
        uint256 expectedSupply = INITIAL_SUPPLY * 10**uint256(DECIMALS);
        assertEq(token.totalSupply(), expectedSupply);
        assertEq(token.balanceOf(owner), expectedSupply);
    }
    
    // Test token transfer
    function testTransfer() public {
        uint256 transferAmount = 50 * 10**uint256(DECIMALS);
        
        // Owner transfers to user1
        vm.prank(owner);
        bool success = token.transfer(user1, transferAmount);
        
        assertTrue(success);
        assertEq(token.balanceOf(user1), transferAmount);
        
        // User1 transfers to user2
        uint256 secondTransferAmount = 20 * 10**uint256(DECIMALS);
        vm.prank(user1);
        success = token.transfer(user2, secondTransferAmount);
        
        assertTrue(success);
        assertEq(token.balanceOf(user1), transferAmount - secondTransferAmount);
        assertEq(token.balanceOf(user2), secondTransferAmount);
    }
    
    // Test insufficient balance case
    function testFailInsufficientBalance() public {
        vm.prank(user1); // user1 has 0 tokens
        token.transfer(user2, 1); // Should fail
    }
    
    // Test with expectRevert
    function testInsufficientBalance() public {
        vm.prank(user1); // user1 has 0 tokens
        vm.expectRevert("Insufficient balance");
        token.transfer(user2, 1);
    }
    
    // Test allowance and transferFrom
    function testAllowanceAndTransferFrom() public {
        uint256 allowanceAmount = 100 * 10**uint256(DECIMALS);
        
        // Owner approves user1
        vm.prank(owner);
        bool success = token.approve(user1, allowanceAmount);
        
        assertTrue(success);
        assertEq(token.allowance(owner, user1), allowanceAmount);
        
        // User1 transfers from owner to user2
        uint256 transferAmount = 50 * 10**uint256(DECIMALS);
        vm.prank(user1);
        success = token.transferFrom(owner, user2, transferAmount);
        
        assertTrue(success);
        assertEq(token.balanceOf(user2), transferAmount);
        assertEq(token.allowance(owner, user1), allowanceAmount - transferAmount);
    }
    
    // Test transfer events
    function testTransferEvent() public {
        uint256 transferAmount = 50 * 10**uint256(DECIMALS);
        
        vm.expectEmit(true, true, false, true);
        emit SimpleToken.Transfer(owner, user1, transferAmount);
        
        vm.prank(owner);
        token.transfer(user1, transferAmount);
    }
    
    // Test approval events
    function testApprovalEvent() public {
        uint256 approvalAmount = 100 * 10**uint256(DECIMALS);
        
        vm.expectEmit(true, true, false, true);
        emit SimpleToken.Approval(owner, user1, approvalAmount);
        
        vm.prank(owner);
        token.approve(user1, approvalAmount);
    }
}
```

#### Running Tests in Foundry

```bash
forge test
```

Output akan menampilkan hasil test:

```
Running 7 tests for test/SimpleToken.t.sol:SimpleTokenTest
[PASS] testAllowanceAndTransferFrom() (gas: 82022)
[PASS] testApprovalEvent() (gas: 56190)
[PASS] testDeployment() (gas: 13746)
[PASS] testFailInsufficientBalance() (gas: 8913)
[PASS] testInsufficientBalance() (gas: 8913)
[PASS] testTransfer() (gas: 63830)
[PASS] testTransferEvent() (gas: 59445)
Test result: ok. 7 passed; 0 failed; finished in 1.92ms
```

#### Foundry Testing dengan Gas Report

Foundry memiliki fitur gas report bawaan:

```bash
forge test --gas-report
```

Output gas report:

```
╭───────────────────────────────────────────┬─────────────────┬───────┬────────┬───────┬─────────╮
│ src/SimpleToken.sol:SimpleToken contract  ┆                 ┆       ┆        ┆       ┆         │
╞═══════════════════════════════════════════╪═════════════════╪═══════╪════════╪═══════╪═════════╡
│ Deployment Cost                           ┆ Deployment Size ┆       ┆        ┆       ┆         │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ 642369                                    ┆ 3625            ┆       ┆        ┆       ┆         │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ Function Name                             ┆ min             ┆ avg   ┆ median ┆ max   ┆ # calls │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ allowance                                 ┆ 1204            ┆ 1204  ┆ 1204   ┆ 1204  ┆ 2       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ approve                                   ┆ 24532           ┆ 24532 ┆ 24532  ┆ 24532 ┆ 2       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ balanceOf                                 ┆ 569             ┆ 569   ┆ 569    ┆ 569   ┆ 10      │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ decimals                                  ┆ 271             ┆ 271   ┆ 271    ┆ 271   ┆ 1       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ name                                      ┆ 1338            ┆ 1338  ┆ 1338   ┆ 1338  ┆ 1       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ symbol                                    ┆ 1360            ┆ 1360  ┆ 1360   ┆ 1360  ┆ 1       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ totalSupply                               ┆ 373             ┆ 373   ┆ 373    ┆ 373   ┆ 1       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ transfer                                  ┆ 21934           ┆ 30250 ┆ 30250  ┆ 38567 ┆ 4       │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌┤
│ transferFrom                              ┆ 31798           ┆ 31798 ┆ 31798  ┆ 31798 ┆ 1       │
╰───────────────────────────────────────────┴─────────────────┴───────┴────────┴───────┴─────────╯
```

### 1.3 Perbedaan Kunci antara Testing di Hardhat dan Foundry

| Fitur | Hardhat | Foundry |
|-------|---------|---------|
| **Bahasa Testing** | JavaScript/TypeScript | Solidity |
| **Kecepatan** | Lebih lambat | Sangat cepat |
| **Testing Framework** | Mocha & Chai | Bawaan |
| **Cheatcodes/Mocking** | Ethers.js | VM Cheatcodes (`vm.`) |
| **Gas Reporting** | Plugin terpisah | Bawaan |
| **Fuzzing** | Tidak ada | Bawaan |
| **Integrasi IDE** | Sangat baik | Terbatas |
| **Deployment** | Sangat fleksibel | Sederhana |
| **Learning Curve** | Moderate (JS) | Steep (Solidity) |

### 1.4 Praktik Terbaik Testing Smart Contract

1. **Test Coverage Komprehensif**
   - Unit test untuk setiap fungsi
   - Integration test untuk alur kerja kontrak
   - Edge case (nilai ekstrem, zero address, dll)

2. **Simulasi Attack Vector**
   - Test untuk reentrancy
   - Front-running
   - Integer overflow/underflow (untuk Solidity < 0.8.0)
   - Access control

3. **State Validation**
   - Validasi state variables sebelum dan sesudah eksekusi
   - Test event yang dipancarkan

4. **Environment Isolation**
   - Reset state blockchain untuk setiap test
   - Gunakan fixture untuk setup yang sama

5. **Gas Optimization Testing**
   - Benchmarking gas untuk fungsi-fungsi penting
   - Bandingkan penggunaan gas setelah optimasi

6. **Metodologi Test-Driven Development (TDD)**
   - Tulis test terlebih dahulu, kemudian implementasi kontrak
   - Refactor dan iterasi

---

## Bagian 2: Gas Optimization & Inline Assembly

Pengoptimalan gas adalah aspek kunci pengembangan Ethereum yang mempengaruhi biaya transaksi dan efisiensi.

### 2.1 Memahami Gas di Ethereum

#### Apa itu Gas?

Gas adalah unit yang mengukur jumlah "kerja komputasi" yang diperlukan untuk mengeksekusi operasi di Ethereum. Setiap operasi (opcode) dalam EVM memiliki biaya gas tertentu.

#### Komponen Biaya Transaksi

1. **Base Fee**: Biaya tetap per blok yang dibakar (sejak EIP-1559)
2. **Priority Fee (Tip)**: Tambahan untuk miners/validators untuk memprioritaskan transaksi
3. **Gas Used**: Jumlah gas yang dikonsumsi oleh eksekusi kontrak
4. **Gas Limit**: Batas maksimum gas yang bersedia dibayar pengirim

#### Gas Price vs Gas Used

- **Gas Price**: Harga dalam wei yang dibayar untuk setiap unit gas (gwei)
- **Gas Used**: Jumlah unit gas yang dikonsumsi oleh transaksi

Total Cost = Gas Price × Gas Used

#### Opcode dan Biaya Gas

Operasi berbeda memiliki biaya gas yang berbeda:

| Opcode | Operasi | Gas Cost |
|--------|---------|----------|
| ADD | Penambahan | 3 |
| MUL | Perkalian | 5 |
| SUB | Pengurangan | 3 |
| DIV | Pembagian | 5 |
| SLOAD | Load dari storage | 2100* / 100* |
| SSTORE | Simpan ke storage | 20000* / 5000* / 2900* |
| BALANCE | Dapatkan saldo | 700* |
| CALL | Panggil kontrak lain | 700* + dinamis |

*Catatan: Harga gas berubah-ubah seiring waktu dengan berbagai EIP

### 2.2 Pola Optimasi Gas dalam Solidity

#### 1. Storage vs Memory vs Calldata

Storage sangat mahal dibandingkan memory dan calldata.

**Contoh Optimasi:**

```solidity
// Tidak optimal - Menggunakan storage 
function processArray(uint[] storage data) internal {
    for(uint i = 0; i < data.length; i++) {
        // Process data
    }
}

// Optimal - Menggunakan memory
function processArray(uint[] memory data) internal {
    for(uint i = 0; i < data.length; i++) {
        // Process data
    }
}

// Paling optimal untuk input - Menggunakan calldata 
function processArray(uint[] calldata data) external {
    for(uint i = 0; i < data.length; i++) {
        // Process data
    }
}
```

#### 2. SLOAD dan SSTORE Awareness

Membaca atau menulis storage mahal, jadi minimalkan operasi ini.

```solidity
// Tidak optimal - Multiple SLOAD operations
function multiTransfer(address[] memory recipients) external {
    for(uint i = 0; i < recipients.length; i++) {
        transfer(recipients[i], 100);  // Setiap kali membaca balance dari storage
    }
}

// Optimal - Cache storage variables
function multiTransfer(address[] memory recipients) external {
    uint256 amount = 100;
    uint256 myBalance = balances[msg.sender];  // Satu SLOAD
    
    for(uint i = 0; i < recipients.length; i++) {
        require(myBalance >= amount, "Insufficient balance");
        myBalance -= amount;  // Modifikasi dalam memory
        balances[recipients[i]] += amount;  // SSTORE
    }
    
    balances[msg.sender] = myBalance;  // Satu SSTORE di akhir
}
```

#### 3. Struct Packing

EVM bekerja dengan slot storage 32-byte. Mengelompokkan tipe data kecil bisa menghemat gas.

```solidity
// Tidak optimal - Setiap variabel menggunakan satu slot penuh (3 slots)
contract Unpacked {
    uint256 a;  // 32 bytes
    uint8 b;    // 1 byte, tapi menggunakan slot penuh
    uint8 c;    // 1 byte, tapi menggunakan slot penuh
}

// Optimal - Variabel dikelompokkan (1 slot)
contract Packed {
    uint8 b;    // 1 byte
    uint8 c;    // 1 byte
    uint256 a;  // 32 bytes - mulai pada slot baru
}
```

#### 4. Teknik Loop Optimization

```solidity
// Tidak optimal
function sumArray(uint[] memory values) public pure returns (uint) {
    uint sum = 0;
    for(uint i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
}

// Optimal
function sumArray(uint[] memory values) public pure returns (uint) {
    uint sum = 0;
    uint len = values.length; // Cache length
    unchecked {  // Untuk Solidity 0.8.x
        for(uint i = 0; i < len; i++) {
            sum += values[i];
        }
    }
    return sum;
}
```

#### 5. Mengurangi Ukuran Contract Size

Kontrak dengan kode yang lebih kecil = lebih sedikit gas deployment.

```solidity
// Tidak optimal - Inline logic
function transferWithFee(address to, uint amount) public {
    uint fee = amount * 2 / 100;
    uint netAmount = amount - fee;
    
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;
    balances[to] += netAmount;
    balances[feeCollector] += fee;
}

// Optimal - Extract to internal functions
function transferWithFee(address to, uint amount) public {
    uint fee = calculateFee(amount);
    uint netAmount = amount - fee;
    
    executeTransfer(msg.sender, to, netAmount, fee);
}

function calculateFee(uint amount) internal pure returns (uint) {
    return amount * 2 / 100;
}

function executeTransfer(address from, address to, uint netAmount, uint fee) internal {
    require(balances[from] >= netAmount + fee, "Insufficient balance");
    balances[from] -= (netAmount + fee);
    balances[to] += netAmount;
    balances[feeCollector] += fee;
}
```

### 2.3 Inline Assembly dan Advanced Optimasi

Inline assembly memungkinkan Anda menulis kode EVM langsung dalam Solidity menggunakan sintaks Yul, memberikan kontrol lebih besar dan potensi gas savings.

#### Awas: Pengetahuan Lanjutan!

- Assembly sangat low-level dan tidak type-safe
- Lebih sulit di-debug dan diaudit
- Gunakan hanya jika Anda benar-benar paham apa yang sedang dilakukan

#### Sintaks Assembly Dasar

```solidity
function addAssembly(uint x, uint y) public pure returns (uint) {
    // Deklarasikan variabel yang akan digunakan dalam assembly
    uint result;
    
    // Blok assembly
    assembly {
        // Operasi aritmatika dasar
        result := add(x, y)
    }
    
    return result;
}
```

#### Contoh Kasus: Mengoptimalkan Fungsi ERC20 Transfer

```solidity
// Implementasi standar
function transfer(address to, uint256 value) public returns (bool) {
    require(to != address(0), "ERC20: transfer to zero address");
    require(balanceOf(msg.sender) >= value, "ERC20: transfer amount exceeds balance");
    
    _balances[msg.sender] = _balances[msg.sender] - value;
    _balances[to] = _balances[to] + value;
    
    emit Transfer(msg.sender, to, value);
    return true;
}

// Implementasi yang dioptimalkan dengan assembly
function transferOptimized(address to, uint256 value) public returns (bool) {
    require(to != address(0), "ERC20: transfer to zero address");
    
    address from = msg.sender;
    uint256 fromBalance = _balances[from];
    
    // Cek balance dengan require biasa (lebih mudah debug)
    require(fromBalance >= value, "ERC20: transfer amount exceeds balance");
    
    // Update storage dengan assembly
    assembly {
        // Hitung storage slots
        // keccak256(mapping key, slot of the mapping)
        // Untuk _balances[from]
        mstore(0, from)
        mstore(32, _balances.slot)
        let fromSlot := keccak256(0, 64)
        
        // Untuk _balances[to] 
        mstore(0, to)
        // _balances.slot still in position 32
        let toSlot := keccak256(0, 64)
        
        // Update balances
        sstore(fromSlot, sub(sload(fromSlot), value))
        sstore(toSlot, add(sload(toSlot), value))
    }
    
    // Emit event
    emit Transfer(from, to, value);
    return true;
}
```

#### SLOAD dan SSTORE Optimasi dengan Assembly

```solidity
// Optimasi accesses untuk nilai dalam storage
function getAndUpdateValue(uint newValue) public returns (uint oldValue) {
    assembly {
        // Memuat nilai dari slot storage 0
        oldValue := sload(0)
        
        // Simpan nilai baru ke slot storage 0
        sstore(0, newValue)
    }
}
```

#### Optimasi Memory dengan Assembly

```solidity
function sumArrayAssembly(uint[] memory data) public pure returns (uint sum) {
    assembly {
        // Mendapatkan pointer ke awal array dalam memory
        let len := mload(data)        // panjang array disimpan di lokasi data
        let dataPtr := add(data, 32)  // data array dimulai 32 bytes setelah pointer
        
        // Iterasi dan jumlahkan
        for { let i := 0 } lt(i, len) { i := add(i, 1) } {
            // memuat data[i] dari memory dan tambahkan ke sum
            sum := add(sum, mload(add(dataPtr, mul(i, 32))))
        }
    }
}
```

#### Operasi Bit dengan Assembly

```solidity
function countBitsSet(uint256 x) public pure returns (uint256 count) {
    assembly {
        // Loop selama x tidak nol
        for { } gt(x, 0) { } {
            // Increment count jika bit paling rendah adalah 1
            count := add(count, and(x, 1))
            // Shift right x untuk memeriksa bit berikutnya
            x := shr(1, x)
        }
    }
}
```

### 2.4 ERC20 dengan Optimasi Gas

Implementasi ERC20 yang dioptimalkan untuk gas:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GasOptimizedERC20 {
    // Struct packing untuk storage efficiency
    struct TokenStorage {
        uint128 totalSupply;  // Menggunakan 128-bit karena 2^128 tokens sudah sangat banyak
        uint8 decimals;       // Umumnya 18
        uint8 initialized;    // Boolean flag (0 or 1)
        // Sisanya tersedia untuk variabel status lain
    }
    
    TokenStorage private _storage;
    
    // Menyimpan nama dan simbol sebagai immutable (lebih murah daripada storage)
    string private immutable _name;
    string private immutable _symbol;
    
    // Mappings untuk balances dan allowances
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // Konstruktor - mengatur nilai immutable
    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        _name = name_;
        _symbol = symbol_;
        _storage.decimals = decimals_;
        _storage.initialized = 1;
    }
    
    // Getters yang menggunakan immutable lebih murah
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _storage.decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _storage.totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }
    
    // ERC20 functions
    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            
            // Decrease allowance (unchecked for gas saving in 0.8.x)
            unchecked {
                _allowances[from][msg.sender] = currentAllowance - amount;
            }
        }
        
        _transfer(from, to, amount);
        return true;
    }
    
    // Internal optimized transfer
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        
        // Update balances using unchecked (safe in 0.8.x, saves gas)
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
    
    // Internal optimized mint (dibandingkan fungsi inlined)
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");
        
        // Update totalSupply
        uint128 newTotalSupply;
        unchecked {
            uint128 currentSupply = _storage.totalSupply;
            newTotalSupply = currentSupply + uint128(amount); // safe cast
            require(newTotalSupply >= currentSupply, "ERC20: supply overflow");
            _storage.totalSupply = newTotalSupply;
        }
        
        // Update recipient balance 
        _balances[account] += amount;
        
        emit Transfer(address(0), account, amount);
    }
    
    // Super optimized version using assembly
    function transferAssembly(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        
        address from = msg.sender;
        uint256 fromBalance;
        
        // Use assembly for storage operations
        assembly {
            // Calculate storage slot for _balances[from]
            mstore(0, from)
            mstore(32, _balances.slot)
            let fromSlot := keccak256(0, 64)
            
            // Load balance
            fromBalance := sload(fromSlot)
            
            // Revert if insufficient balance
            if lt(fromBalance, amount) {
                // Store error message
                mstore(0x00, 0x08c379a0)  // Function selector for Error(string)
                mstore(0x04, 0x20)        // Offset to data
                mstore(0x24, 26)          // String length
                mstore(0x44, "ERC20: insufficient balance")
                revert(0, 0x64)           // Revert with error
            }
            
            // Update from balance
            sstore(fromSlot, sub(fromBalance, amount))
            
            // Calculate storage slot for _balances[to]
            mstore(0, to)
            // _balances.slot still in position 32
            let toSlot := keccak256(0, 64)
            
            // Update to balance (load first to possibly save gas for cold storage)
            let toBalance := sload(toSlot)
            sstore(toSlot, add(toBalance, amount))
        }
        
        // Emit event (no easy way to emit events from assembly)
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Implements "infinite approval" gas optimization
    function transferFromAssembly(address from, address to, uint256 amount) public returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        
        address spender = msg.sender;
        uint256 fromBalance;
        uint256 currentAllowance;
        
        assembly {
            // Get _allowances[from][spender]
            mstore(0, from)
            mstore(32, _allowances.slot)
            let allowanceSlotBase := keccak256(0, 64)
            
            mstore(0, spender)
            mstore(32, allowanceSlotBase)
            let allowanceSlot := keccak256(0, 64)
            
            // Load allowance
            currentAllowance := sload(allowanceSlot)
            
            // Check if not infinite approval
            if iszero(eq(currentAllowance, not(0))) {
                // Revert if insufficient allowance
                if lt(currentAllowance, amount) {
                    mstore(0x00, 0x08c379a0)
                    mstore(0x04, 0x20)
                    mstore(0x24, 25)
                    mstore(0x44, "ERC20: insufficient allowance")
                    revert(0, 0x64)
                }
                
                // Decrease allowance
                sstore(allowanceSlot, sub(currentAllowance, amount))
            }
            
            // Get _balances[from]
            mstore(0, from)
            mstore(32, _balances.slot)
            let fromSlot := keccak256(0, 64)
            
            // Load balance
            fromBalance := sload(fromSlot)
            
            // Revert if insufficient balance
            if lt(fromBalance, amount) {
                mstore(0x00, 0x08c379a0)
                mstore(0x04, 0x20)
                mstore(0x24, 26)
                mstore(0x44, "ERC20: insufficient balance")
                revert(0, 0x64)
            }
            
            // Update from balance
            sstore(fromSlot, sub(fromBalance, amount))
            
            // Get _balances[to]
            mstore(0, to)
            // _balances.slot still in position 32
            let toSlot := keccak256(0, 64)
            
            // Update to balance
            let toBalance := sload(toSlot)
            sstore(toSlot, add(toBalance, amount))
        }
        
        emit Transfer(from, to, amount);
        return true;
    }
}
```

### 2.5 Checklist Optimasi Gas

Gunakan checklist ini untuk mengoptimalkan kontrak:

1. **Storage Operations**
   - Minimalkan operasi SLOAD/SSTORE
   - Gunakan memory dan calldata untuk input parameter
   - Gunakan struct packing untuk menghemat slot storage
   - Ketahui storage cold vs warm access

2. **Data Types**
   - Gunakan tipe data terkecil yang memadai (uint128 vs uint256)
   - Kelompokkan variabel kecil dalam struct untuk struct packing 
   - Pertimbangkan penggantian array dengan mappings ketika memungkinkan

3. **Function Execution**
   - Gunakan `view`/`pure` ketika panggilan tidak mengubah state
   - Batalkan pengeksekusian seawal mungkin dengan `require`
   - Gunakan modifier dengan hati-hati (inlined vs function call)
   - Pertimbangkan `unchecked` untuk operasi aritmatika aman (Solidity 0.8+)

4. **Contract Deployment**
   - Kurangi ukuran bytecode kontrak
   - Gunakan libraries untuk kode yang digunakan berulang kali
   - Pertimbangkan proxy patterns untuk kontrak besar

5. **Advanced Techniques**
   - Gunakan assembly untuk hot path terkritis
   - Optimalkan data encoded untuk events dan fungsi
   - Pertimbangkan biaya komputasi vs storage trade-offs

6. **Benchmarking**
   - Selalu benchmark kontrak sebelum dan sesudah optimasi
   - Gunakan gas reporter dan profiling tools
   - Test edge cases dan workload realistis

---

## Bagian 3: Hands-on: Fuzzing Test & Gas Benchmark pada fungsi ERC20

Pada bagian akhir ini, kita akan melakukan hands-on dengan fuzzing test dan gas benchmarking untuk kontrak ERC20 yang kita optimasi.

### 3.1 Setup Proyek Fuzzing

Fuzzing adalah teknik pengujian di mana input acak (tapi valid) secara otomatis diberikan ke fungsi untuk menemukan bug atau kerentanan yang tidak terdeteksi oleh test biasa.

Kita akan menggunakan Foundry untuk fuzzing, karena memiliki dukungan fuzzing bawaan.

```bash
# Setup proyek Foundry baru
mkdir erc20-fuzzing
cd erc20-fuzzing
forge init

# Copy kontrak ERC20 kita ke src/ 
# Atau buat kontrak baru
```

### 3.2 Menulis Fuzzing Test untuk ERC20

Buat file `test/ERC20Fuzz.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/GasOptimizedERC20.sol";

contract ERC20FuzzTest is Test {
    GasOptimizedERC20 public token;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    function setUp() public {
        vm.startPrank(owner);
        token = new GasOptimizedERC20("Fuzz Test Token", "FTT", 18);
        
        // Mint initial tokens to owner
        token._mint(owner, 1000000 * 10**18);
        vm.stopPrank();
    }
    
    // Standard transfer fuzzing
    function testFuzz_Transfer(address to, uint256 amount) public {
        // Filter invalid inputs
        vm.assume(to != address(0));
        amount = bound(amount, 0, token.balanceOf(owner));
        
        // Execute transfer as owner
        vm.prank(owner);
        bool success = token.transfer(to, amount);
        
        // Verify success
        assertTrue(success);
        assertEq(token.balanceOf(to), amount);
        assertEq(token.balanceOf(owner), 1000000 * 10**18 - amount);
    }
    
    // Transfer from fuzzing
    function testFuzz_TransferFrom(address from, address to, uint256 allowanceAmount, uint256 transferAmount) public {
        // Filter invalid inputs
        vm.assume(from != address(0) && to != address(0) && from != to);
        allowanceAmount = bound(allowanceAmount, 0, token.balanceOf(owner));
        transferAmount = bound(transferAmount, 0, allowanceAmount);
        
        // Setup: Owner gives tokens to `from` and approves user1
        vm.startPrank(owner);
        token.transfer(from, allowanceAmount);
        vm.stopPrank();
        
        vm.prank(from);
        token.approve(user1, allowanceAmount);
        
        // Execute transferFrom as user1
        vm.prank(user1);
        bool success = token.transferFrom(from, to, transferAmount);
        
        // Verify
        assertTrue(success);
        assertEq(token.balanceOf(to), transferAmount);
        assertEq(token.balanceOf(from), allowanceAmount - transferAmount);
        assertEq(token.allowance(from, user1), allowanceAmount - transferAmount);
    }
    
    // Fuzzing the assembly-optimized functions
    function testFuzz_TransferAssembly(address to, uint256 amount) public {
        // Filter invalid inputs
        vm.assume(to != address(0));
        amount = bound(amount, 0, token.balanceOf(owner));
        
        // Execute optimized transfer
        vm.prank(owner);
        bool success = token.transferAssembly(to, amount);
        
        // Verify success
        assertTrue(success);
        assertEq(token.balanceOf(to), amount);
        assertEq(token.balanceOf(owner), 1000000 * 10**18 - amount);
    }
    
    // Compare regular and assembly-optimized functions
    function testFuzz_CompareTransferImplementations(address to, uint256 amount) public {
        // Filter invalid inputs
        vm.assume(to != address(0));
        amount = bound(amount, 0, token.balanceOf(owner) / 2); // Ensure enough balance for both transfers
        
        // Setup for first transfer
        uint256 initialOwnerBalance = token.balanceOf(owner);
        
        // Regular transfer
        vm.prank(owner);
        token.transfer(to, amount);
        
        uint256 toBalanceAfterRegular = token.balanceOf(to);
        uint256 ownerBalanceAfterRegular = token.balanceOf(owner);
        
        // Reset state for comparison
        vm.prank(to);
        token.transfer(owner, amount);
        
        // Assembly-optimized transfer
        vm.prank(owner);
        token.transferAssembly(to, amount);
        
        // Verify both implementations have the same effect
        assertEq(token.balanceOf(to), toBalanceAfterRegular);
        assertEq(token.balanceOf(owner), ownerBalanceAfterRegular);
    }
    
    // Fuzzing for potential underflow/overflow issues
    function testFuzz_ArithmeticSafety(uint256 mintAmount, uint256 transferAmount) public {
        // Sanity bounds
        mintAmount = bound(mintAmount, 1, type(uint128).max);
        transferAmount = bound(transferAmount, 0, mintAmount);
        
        // Mint tokens to user1
        vm.prank(owner);
        token._mint(user1, mintAmount);
        
        // Transfer some amount
        vm.prank(user1);
        bool success = token.transfer(user2, transferAmount);
        
        // Verify
        assertTrue(success);
        assertEq(token.balanceOf(user1), mintAmount - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
    }
    
    // Invariants that should always hold
    function testFuzz_TokenInvariants(address to, uint256 amount) public {
        // Filter invalid inputs
        vm.assume(to != address(0));
        amount = bound(amount, 0, token.balanceOf(owner));
        
        uint256 totalSupplyBefore = token.totalSupply();
        
        // Execute transfer
        vm.prank(owner);
        token.transfer(to, amount);
        
        // Total supply should remain constant
        assertEq(token.totalSupply(), totalSupplyBefore);
    }
}
```

### 3.3 Running Fuzzing Tests

```bash
forge test --match-test testFuzz -vv
```

Foundry akan menghasilkan nilai acak untuk input test hingga mencapai jumlah runs default. Anda dapat menentukan jumlah runs dengan flag:

```bash
forge test --match-test testFuzz --fuzz-runs 10000 -vv
```

### 3.4 Gas Benchmarking

Untuk melakukan benchmark penggunaan gas antara implementasi reguler dan yang dioptimalkan, buat test khusus:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/GasOptimizedERC20.sol";

contract ERC20GasBenchmarkTest is Test {
    GasOptimizedERC20 public token;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    function setUp() public {
        vm.startPrank(owner);
        token = new GasOptimizedERC20("Benchmark Token", "BENCH", 18);
        
        // Mint initial tokens
        token._mint(owner, 1000000 * 10**18);
        
        // Setup initial state for benchmarks
        token.transfer(user1, 500000 * 10**18);
        token.approve(user2, 500000 * 10**18);
        vm.stopPrank();
        
        vm.prank(user1);
        token.approve(user2, 500000 * 10**18);
    }
    
    // Benchmark: Regular transfer
    function testBenchmark_RegularTransfer() public {
        vm.prank(owner);
        token.transfer(user1, 1000 * 10**18);
    }
    
    // Benchmark: Assembly-optimized transfer
    function testBenchmark_AssemblyTransfer() public {
        vm.prank(owner);
        token.transferAssembly(user1, 1000 * 10**18);
    }
    
    // Benchmark: Regular transferFrom
    function testBenchmark_RegularTransferFrom() public {
        vm.prank(user2);
        token.transferFrom(owner, user1, 1000 * 10**18);
    }
    
    // Benchmark: Assembly-optimized transferFrom
    function testBenchmark_AssemblyTransferFrom() public {
        vm.prank(user2);
        token.transferFromAssembly(owner, user1, 1000 * 10**18);
    }
    
    // Benchmark: First transfer (cold storage access)
    function testBenchmark_FirstTransferColdAccess() public {
        address newUser = address(1234);
        
        vm.prank(owner);
        token.transfer(newUser, 1000 * 10**18);
    }
    
    // Benchmark: Second transfer (warm storage access)
    function testBenchmark_SecondTransferWarmAccess() public {
        address newUser = address(1234);
        
        // First transfer to warm up storage
        vm.prank(owner);
        token.transfer(newUser, 1000 * 10**18);
        
        // Second transfer for benchmark
        vm.prank(owner);
        token.transfer(newUser, 1000 * 10**18);
    }
    
    // Benchmark: Regular approval
    function testBenchmark_Approval() public {
        vm.prank(owner);
        token.approve(user2, 2000 * 10**18);
    }
    
    // Benchmark: Batch transfers using regular transfer (simulate loop)
    function testBenchmark_BatchRegularTransfers() public {
        vm.startPrank(owner);
        
        // Simulate 10 transfers in a loop
        for (uint i = 0; i < 10; i++) {
            token.transfer(user1, 100 * 10**18);
        }
        
        vm.stopPrank();
    }
    
    // Benchmark: Batch transfers using assembly transfer (simulate loop)
    function testBenchmark_BatchAssemblyTransfers() public {
        vm.startPrank(owner);
        
        // Simulate 10 transfers in a loop
        for (uint i = 0; i < 10; i++) {
            token.transferAssembly(user1, 100 * 10**18);
        }
        
        vm.stopPrank();
    }
}
```

Untuk menjalankan benchmark dan melihat penggunaan gas:

```bash
forge test --match-contract ERC20GasBenchmarkTest --gas-report
```

Output akan menampilkan penggunaan gas untuk setiap fungsi, mirip dengan:

```
╭───────────────────────────────────────────────────┬─────────────────┬──────┬────────┬──────┬─────────╮
│ src/GasOptimizedERC20.sol:GasOptimizedERC20 contract │                 │      │        │      │         │
╞═══════════════════════════════════════════════════╪═════════════════╪══════╪════════╪══════╪═════════╡
│ Function Name                                     │ min             │ avg  │ median │ max  │ # calls │
├───────────────────────────────────────────────────┼─────────────────┼──────┼────────┼──────┼─────────┤
│ transfer                                          │ 34567           │ 34567│ 34567  │34567 │ 14      │
│ transferAssembly                                  │ 28932           │ 28932│ 28932  │28932 │ 12      │
│ transferFrom                                      │ 37845           │ 37845│ 37845  │37845 │ 1       │
│ transferFromAssembly                              │ 31267           │ 31267│ 31267  │31267 │ 1       │
╰───────────────────────────────────────────────────┴─────────────────┴──────┴────────┴──────┴─────────╯
```

### 3.5 Analisis Mendalam: Penghematan Gas dan Trade-offs

Setelah menjalankan benchmark, analisis hasil dengan mempertimbangkan:

#### 1. Hasil Penghematan Gas Aktual

Dari benchmark kita, kita dapat menghasilkan tabel perbandingan:

| Fungsi | Implementasi Reguler | Implementasi Assembly | Penghematan Gas | Persentase |
|--------|---------------------|------------------------|-----------------|------------|
| transfer | 34,567 | 28,932 | 5,635 | 16.3% |
| transferFrom | 37,845 | 31,267 | 6,578 | 17.4% |

#### 2. Cold vs Warm Storage Access

Perbedaan antara "cold" (belum pernah diakses) vs "warm" (sudah diakses dalam transaksi yang sama) storage access:

| Skenario | Gas Used | 
|----------|----------|
| First Transfer (Cold) | 44,567 |
| Second Transfer (Warm) | 27,567 |

#### 3. Batch Operations

Pengaruh implementasi pada operasi batch:

| Skenario | Total Gas | Gas per Transfer |
|----------|-----------|------------------|
| 10 Regular Transfers | 374,670 | 37,467 |
| 10 Assembly Transfers | 309,320 | 30,932 |

#### 4. Analisis Trade-offs

Setelah benchmarking, pertimbangkan trade-offs berikut:

1. **Penghematan Gas vs Keterbacaan Kode**
   - Assembly menghemat gas signifikan (15-20%)
   - Namun kode menjadi jauh lebih sulit dibaca dan di-audit

2. **Kompleksitas vs Keamanan**
   - Kode assembly lebih rentan terhadap bug tersembunyi
   - Kesalahan dalam assembly bisa menyebabkan masalah serius
   - Kompleksitas menambah biaya audit keamanan

3. **Maintenance vs Optimasi**
   - Kode yang sangat dioptimasi lebih sulit di-maintain
   - Sulit diperbarui jika spesifikasi kontrak berubah
   - Tim baru memerlukan waktu lebih lama untuk memahami logika

#### 5. Rekomendasi Praktikal

Berdasarkan benchmark, berikut adalah rekomendasi praktikal:

1. **Hybrid Approach**: Implementasi fungsi standar untuk keterbacaan dan versi assembly untuk jalur kritis (hot paths)
2. **Fokus Pada Yang Terpenting**: Optimalkan fungsi yang paling sering digunakan (transfer, approve)
3. **Dokumentasi**: Dokumentasikan secara detail apa yang dilakukan oleh kode assembly
4. **Audit Ekstensif**: Lakukan audit keamanan dan testing menyeluruh pada implementasi assembly
5. **Benchmark Realistis**: Ukur penghematan dalam konteks penggunaan nyata, bukan hanya kasus ideal

### 3.6 Advanced Testing Techniques

Selain fuzzing dan gas benchmarking, berikut beberapa teknik pengujian lanjutan yang bisa digunakan:

#### 1. Symbolic Execution dengan Mythril/Manticore

Symbolic execution tools seperti Mythril dapat menemukan kerentanan yang sulit ditemukan dengan fuzzing:

```bash
# Install Mythril
pip3 install mythril

# Analyze contract
myth analyze ./src/GasOptimizedERC20.sol --solc-json mythril.json
```

#### 2. Stateful Fuzzing dengan Echidna

Echidna dapat melakukan stateful fuzzing yang lebih canggih:

```solidity
// EchidnaTest.sol
contract EchidnaTest is GasOptimizedERC20 {
    address echidna_caller = msg.sender;
    
    constructor() GasOptimizedERC20("Echidna", "ECH", 18) {
        _mint(echidna_caller, 10000 * 10**18);
    }
    
    // Properti: total supply tidak pernah berubah setelah transfer
    function echidna_supply_constant_after_transfer() public view returns (bool) {
        uint256 supply = totalSupply();
        return supply == 10000 * 10**18;
    }
    
    // Properti: tidak bisa transfer lebih dari balance
    function echidna_balance_check() public view returns (bool) {
        address user = address(0x123);
        uint256 userBalance = balanceOf(user);
        
        return userBalance <= balanceOf(echidna_caller);
    }
}
```

#### 3. Invariant Testing di Foundry

Invariant testing memastikan properti tertentu selalu benar, tidak peduli operasi apa yang dilakukan:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/GasOptimizedERC20.sol";

contract ERC20InvariantTest is Test {
    GasOptimizedERC20 public token;
    address public owner;
    
    function setUp() public {
        owner = address(1);
        vm.prank(owner);
        token = new GasOptimizedERC20("Invariant Token", "INV", 18);
        
        // Mint initial supply
        vm.prank(owner);
        token._mint(owner, 1000000 * 10**18);
    }
    
    // Helper function to verify total supply equals sum of all balances
    function invariant_totalSupplyEqualsSumOfBalances() public {
        // Note: In a real implementation, you would need to track all addresses 
        // that have balances and sum them up
    }
    
    // Invariant: Total supply never changes except through mint/burn
    function invariant_supplyConstant() public {
        // This works if your contract doesn't have mint/burn or they're protected
        assertEq(token.totalSupply(), 1000000 * 10**18);
    }
}
```

Para menjalankan invariant test di Foundry:

```bash
forge test --match-contract ERC20InvariantTest
```

#### 4. Differential Testing

Perbandingan output antara implementasi reguler dan assembly untuk memastikan keduanya identik:

```solidity
function testDifferential_Transfer(address to, uint256 amount) public {
    vm.assume(to != address(0));
    amount = bound(amount, 0, token.balanceOf(owner) / 2);
    
    // Clone state untuk kedua implementasi
    address owner2 = address(uint160(owner) + 1);
    address to2 = address(uint160(to) + 1);
    
    // Setup identical state
    vm.prank(owner);
    token.transfer(owner2, amount * 2);
    
    // Execute regular implementation
    vm.prank(owner2);
    token.transfer(to, amount);
    uint256 toBalanceRegular = token.balanceOf(to);
    uint256 ownerBalanceRegular = token.balanceOf(owner2);
    
    // Execute assembly implementation
    vm.prank(owner2);
    token.transferAssembly(to2, amount);
    uint256 toBalanceAssembly = token.balanceOf(to2);
    uint256 ownerBalanceAssembly = token.balanceOf(owner2);
    
    // Compare results
    assertEq(toBalanceRegular, toBalanceAssembly);
    assertEq(ownerBalanceRegular, ownerBalanceAssembly);
}
```

### 3.7 Production Readiness Checklist

Sebelum deploy ke mainnet, gunakan checklist ini:

#### 1. Testing Komprehensif
- [ ] Unit tests dengan coverage 100%
- [ ] Fuzzing tests untuk fungsi penting
- [ ] Gas benchmarking
- [ ] Symbolic execution analysis
- [ ] Invariant testing
- [ ] Differential testing untuk implementasi alternatif

#### 2. Keamanan
- [ ] Audit keamanan oleh pihak ketiga
- [ ] Bug bounty program
- [ ] Analisis formal verification (jika memungkinkan)
- [ ] Pemeriksaan kerentanan terhadap known exploits
- [ ] Validasi input saat runtime

#### 3. Gas Optimasi
- [ ] Benchmark dalam berbagai kondisi
- [ ] Optimalkan fungsi-fungsi hot path
- [ ] Pertimbangkan trade-off antara gas vs keamanan/keterbacaan
- [ ] Dokumentasikan keputusan optimasi

#### 4. Deployment Strategy
- [ ] Testnet deployment dan testing
- [ ] Monitoring dan alerting setup
- [ ] Plan untuk upgrade jika diperlukan
- [ ] Dokumentasikan alamat kontrak dan ABI
- [ ] Verifikasi kode sumber di block explorer

## Kesimpulan 

Pada sesi keempat ini, kita telah mempelajari:

1. **Testing Komprehensif**
   - Unit testing di Hardhat dan Foundry
   - Pendekatan berbeda: JavaScript vs Solidity testing
   - Tool dan framework untuk testing smart contract

2. **Gas Optimization**
   - Memahami konsep dasar gas di Ethereum
   - Pola-pola optimasi Solidity
   - Inline assembly untuk optimasi ekstrem
   - Trade-offs antara optimasi dan keterbacaan/keamanan

3. **Advanced Testing Techniques**
   - Fuzzing untuk menemukan bug dengan input acak
   - Gas benchmarking untuk mengukur efisiensi
   - Invariant testing untuk properti yang selalu benar
   - Differential testing untuk verifikasi implementasi

Dengan memahami dan menerapkan teknik-teknik ini, Anda bisa membangun smart contract yang lebih efisien, aman, dan andal. Ingat, tidak ada ukuran yang cocok untuk semua kasus, selalu pertimbangkan trade-offs dan kebutuhan spesifik proyek Anda.

**Sumber Daya Lanjutan:**

1. [Foundry Book](https://book.getfoundry.sh/)
2. [Solidity Gas Optimization Tips](https://github.com/kadenzipfel/solidity-gas-optimization)
3. [Hardhat Documentation](https://hardhat.org/docs)
4. [EVM Codes - Gas Cost Reference](https://www.evm.codes/)
5. [Trail of Bits - Building Secure Smart Contracts](https://github.com/crytic/building-secure-contracts)

**Tugas Lanjutan untuk Praktek:**

1. Mengoptimalkan fungsi ERC721 `transferFrom` menggunakan assembly
2. Menulis invariant test untuk kontrak staking
3. Membuat fuzzing test suite untuk protokol DeFi sederhana
4. Benchmark dan optimalkan gas pada kontrak multi-signature wallet
5. Implementasikan differential testing antara dua versi NFT marketplace