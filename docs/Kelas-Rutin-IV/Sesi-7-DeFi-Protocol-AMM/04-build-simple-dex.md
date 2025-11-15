---
sidebar_position: 5
title: "Part 4: Hands-on Lab - Build Simple DEX"
---

# Part 4: Hands-on Lab - Build Your Own DEX

> **"The best way to learn is by doing. Mari kita bangun DEX sungguhan!"**

---

## 📚 Overview

Di Part 4 ini, kita akan membangun **Mini DEX (Decentralized Exchange)** yang lengkap dengan:
- ✅ Dua ERC-20 tokens (CampusCoin & MockUSDC)
- ✅ Liquidity Pool dengan AMM formula (x × y = k)
- ✅ Add & Remove Liquidity functions
- ✅ Swap functions dengan slippage protection
- ✅ LP Token untuk Liquidity Providers
- ✅ Trading fee 0.3%

**Durasi:** 150 menit (2.5 jam)

**Tech Stack:**
- Foundry (development & testing)
- Solidity ^0.8.30
- OpenZeppelin Contracts
- Lisk Sepolia Testnet

---

## 🗂️ Table of Contents

1. [Setup Project dengan Foundry](#1-setup-project-dengan-foundry)
2. [Membuat Token ERC-20](#2-membuat-token-erc-20)
3. [Implementasi SimpleDEX Contract](#3-implementasi-simpledex-contract)
4. [Testing Contracts](#4-testing-contracts)
5. [Deployment Script](#5-deployment-script)
6. [Deploy ke Lisk Sepolia](#6-deploy-ke-lisk-sepolia)
7. [Interaksi dengan DEX](#7-interaksi-dengan-dex)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Setup Project dengan Foundry

### 1.1 Instalasi Foundry

#### macOS / Linux

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Restart terminal, lalu jalankan:
foundryup

# Verifikasi instalasi
forge --version
cast --version
anvil --version
```

**Expected output:**
```
forge 0.2.0 (latest)
cast 0.2.0 (latest)
anvil 0.2.0 (latest)
```

---

#### Windows (menggunakan WSL)

```bash
# 1. Install WSL (jika belum)
# Buka PowerShell sebagai Administrator:
wsl --install

# 2. Restart komputer

# 3. Buka WSL terminal dan install Foundry:
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup

# 4. Verifikasi
forge --version
```

---

### 1.2 Membuat Project Baru

```bash
# Buat folder project
mkdir simple-dex-lisk
cd simple-dex-lisk

# Initialize Foundry project
forge init

# Struktur project:
# simple-dex-lisk/
# ├── foundry.toml        # Konfigurasi Foundry
# ├── src/               # Smart contracts
# ├── test/              # Test files
# ├── script/            # Deployment scripts
# ├── lib/               # Dependencies
# └── .env               # Environment variables (buat nanti)
```

---

### 1.3 Install Dependencies

```bash
# Install OpenZeppelin Contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Verify installation
ls lib/
# Output should show: forge-std  openzeppelin-contracts
```

---

### 1.4 Konfigurasi Foundry

Edit file `foundry.toml`:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.30"
optimizer = true
optimizer_runs = 200
via_ir = false

# Remappings untuk imports
remappings = [
    '@openzeppelin/=lib/openzeppelin-contracts/',
    'forge-std/=lib/forge-std/src/'
]

# Lisk Sepolia configuration
[rpc_endpoints]
lisk_sepolia = "https://rpc.sepolia-api.lisk.com"

[etherscan]
lisk_sepolia = { key = "${BLOCKSCOUT_API_KEY}", url = "https://sepolia-blockscout.lisk.com/api" }

# Testing configuration
[fuzz]
runs = 256
max_test_rejects = 65536

[invariant]
runs = 256
depth = 15
```

---

### 1.5 Setup Environment Variables

Buat file `.env`:

```bash
# Lisk Sepolia RPC URL
LISK_SEPOLIA_RPC_URL=https://rpc.sepolia-api.lisk.com

# Your private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Blockscout API (optional, untuk verification)
BLOCKSCOUT_API_KEY=123

# Chain ID
CHAIN_ID=4202
```

**⚠️ IMPORTANT: Tambahkan `.env` ke `.gitignore`!**

```bash
echo ".env" >> .gitignore
```

Load environment variables:

```bash
source .env
```

---

## 2. Membuat Token ERC-20

### 2.1 CampusCoin (Token A)

Buat file `src/CampusCoin.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CampusCoin
 * @dev Token ERC-20 sederhana dengan supply maksimum
 */
contract CampusCoin is ERC20, Ownable {
    // Total supply maksimum: 1 juta token
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;

    // Event untuk tracking mint
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @dev Constructor - mint initial supply ke deployer
     */
    constructor() ERC20("Campus Coin", "CAMP") Ownable(msg.sender) {
        // Mint 100 ribu token initial supply
        uint256 initialSupply = 100_000 * 10**18;
        _mint(msg.sender, initialSupply);

        emit TokensMinted(msg.sender, initialSupply);
    }

    /**
     * @dev Mint token baru (hanya owner)
     * @param to Address penerima token
     * @param amount Jumlah token yang di-mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn token milik caller
     * @param amount Jumlah token yang diburn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Cek sisa supply yang bisa dimint
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
```

---

### 2.2 MockUSDC (Token B)

Buat file `src/MockUSDC.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token untuk testing (6 decimals seperti USDC asli)
 */
contract MockUSDC is ERC20, Ownable {
    /**
     * @dev Constructor - mint 1 juta USDC ke deployer
     */
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint 1 million USDC (remember: 6 decimals!)
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    /**
     * @dev Override decimals untuk match USDC asli
     */
    function decimals() public pure override returns (uint8) {
        return 6; // USDC menggunakan 6 decimals, bukan 18
    }

    /**
     * @dev Mint token baru (hanya owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn token
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

**💡 Key Points:**
- CampusCoin menggunakan 18 decimals (default ERC-20)
- MockUSDC menggunakan 6 decimals (seperti USDC asli)
- Ini penting untuk kalkulasi price di DEX!

---

## 3. Implementasi SimpleDEX Contract

### 3.1 SimpleDEX Contract

Buat file `src/SimpleDEX.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleDEX
 * @dev Mini DEX dengan Automated Market Maker (AMM)
 * Menggunakan formula: x × y = k (Constant Product)
 *
 * Fitur:
 * - Add/Remove Liquidity
 * - Swap tokens (A ↔ B)
 * - LP tokens untuk liquidity providers
 * - Trading fee 0.3%
 * - Slippage protection
 */
contract SimpleDEX is ERC20, ReentrancyGuard, Ownable {
    // ========== STATE VARIABLES ==========

    // Token yang diperdagangkan
    IERC20 public immutable tokenA; // Campus Coin
    IERC20 public immutable tokenB; // Mock USDC

    // Reserves (cadangan token di pool)
    uint256 public reserveA;
    uint256 public reserveB;

    // Fee configuration (0.3% fee)
    uint256 public constant FEE_PERCENT = 3;       // 0.3%
    uint256 public constant FEE_DENOMINATOR = 1000; // 100%

    // Minimum liquidity untuk mencegah division by zero
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;

    // ========== EVENTS ==========

    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );

    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );

    event Swap(
        address indexed user,
        uint256 amountAIn,
        uint256 amountBIn,
        uint256 amountAOut,
        uint256 amountBOut
    );

    // ========== CONSTRUCTOR ==========

    constructor(address _tokenA, address _tokenB)
        ERC20("SimpleDEX LP", "SDEX-LP")
        Ownable(msg.sender)
    {
        require(_tokenA != _tokenB, "Identical tokens");
        require(_tokenA != address(0) && _tokenB != address(0), "Zero address");

        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // ========== LIQUIDITY FUNCTIONS ==========

    /**
     * @dev Tambah likuiditas ke pool
     * @param amountA Jumlah token A yang ingin ditambahkan
     * @param amountB Jumlah token B yang ingin ditambahkan
     * @return liquidity Jumlah LP token yang diterima
     *
     * Formula LP tokens:
     * - First LP: liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY
     * - Subsequent LPs: liquidity = min(
     *     (amountA * totalSupply) / reserveA,
     *     (amountB * totalSupply) / reserveB
     *   )
     */
    function addLiquidity(uint256 amountA, uint256 amountB)
        external
        nonReentrant
        returns (uint256 liquidity)
    {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        // Transfer token dari user ke contract
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        uint256 totalLiquidity = totalSupply();

        if (totalLiquidity == 0) {
            // Pool pertama kali - set initial price
            // Menggunakan geometric mean untuk fair valuation
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;

            // Lock minimum liquidity forever untuk mencegah division by zero
            _mint(address(0xdead), MINIMUM_LIQUIDITY);
        } else {
            // Pool sudah ada - maintain price ratio
            // LP mendapat share proporsional terhadap kontribusinya
            liquidity = min(
                (amountA * totalLiquidity) / reserveA,
                (amountB * totalLiquidity) / reserveB
            );
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        // Mint LP token ke user
        _mint(msg.sender, liquidity);

        // Update reserves
        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @dev Hapus likuiditas dari pool
     * @param liquidity Jumlah LP token yang ingin diburn
     * @return amountA Jumlah token A yang diterima
     * @return amountB Jumlah token B yang diterima
     *
     * Formula:
     * amountA = (liquidity * reserveA) / totalSupply
     * amountB = (liquidity * reserveB) / totalSupply
     */
    function removeLiquidity(uint256 liquidity)
        external
        nonReentrant
        returns (uint256 amountA, uint256 amountB)
    {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");

        uint256 totalLiquidity = totalSupply();

        // Calculate token amounts berdasarkan proporsi LP tokens
        amountA = (liquidity * reserveA) / totalLiquidity;
        amountB = (liquidity * reserveB) / totalLiquidity;

        require(amountA > 0 && amountB > 0, "Insufficient liquidity burned");

        // Burn LP tokens dari user
        _burn(msg.sender, liquidity);

        // Transfer tokens kembali ke user
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        // Update reserves
        reserveA -= amountA;
        reserveB -= amountB;

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidity);
    }

    // ========== SWAP FUNCTIONS ==========

    /**
     * @dev Swap token A untuk token B
     * @param amountAIn Jumlah token A yang diswap
     * @param minAmountBOut Minimum token B yang diharapkan (slippage protection)
     *
     * Formula AMM (dengan fee):
     * amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
     *
     * Note: 997/1000 = 0.997 (0.3% fee)
     */
    function swapAforB(uint256 amountAIn, uint256 minAmountBOut)
        external
        nonReentrant
    {
        require(amountAIn > 0, "Amount must be greater than 0");
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");

        // Calculate output amount menggunakan formula AMM
        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);
        require(amountBOut >= minAmountBOut, "Slippage too high");

        // Transfer input token dari user
        tokenA.transferFrom(msg.sender, address(this), amountAIn);

        // Transfer output token ke user
        tokenB.transfer(msg.sender, amountBOut);

        // Update reserves
        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit Swap(msg.sender, amountAIn, 0, 0, amountBOut);
    }

    /**
     * @dev Swap token B untuk token A
     * @param amountBIn Jumlah token B yang diswap
     * @param minAmountAOut Minimum token A yang diharapkan
     */
    function swapBforA(uint256 amountBIn, uint256 minAmountAOut)
        external
        nonReentrant
    {
        require(amountBIn > 0, "Amount must be greater than 0");
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");

        // Calculate output amount
        uint256 amountAOut = getAmountOut(amountBIn, reserveB, reserveA);
        require(amountAOut >= minAmountAOut, "Slippage too high");

        // Transfer input token dari user
        tokenB.transferFrom(msg.sender, address(this), amountBIn);

        // Transfer output token ke user
        tokenA.transfer(msg.sender, amountAOut);

        // Update reserves
        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit Swap(msg.sender, 0, amountBIn, amountAOut, 0);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @dev Calculate output amount untuk swap (dengan fee)
     * @param amountIn Jumlah token input
     * @param reserveIn Reserve token input
     * @param reserveOut Reserve token output
     * @return amountOut Jumlah token output setelah fee
     *
     * Formula: (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
     *
     * Penjelasan:
     * - amountIn * 997: Apply 0.3% fee (99.7% dari input yang masuk pool)
     * - reserveIn * 1000: Reserve awal dikali 1000 untuk match denominator
     * - x * y = k tetap terjaga setelah fee dihitung
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");

        // Apply fee (0.3%)
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_PERCENT);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;

        amountOut = numerator / denominator;
    }

    /**
     * @dev Get current price (token B per token A)
     * Returns price dengan 18 decimals precision
     */
    function getPrice() external view returns (uint256) {
        require(reserveA > 0, "No liquidity");
        // Price dengan 18 decimals untuk precision
        return (reserveB * 1e18) / reserveA;
    }

    /**
     * @dev Get complete pool info untuk UI
     */
    function getPoolInfo() external view returns (
        uint256 _reserveA,
        uint256 _reserveB,
        uint256 _totalLiquidity,
        uint256 _price
    ) {
        _reserveA = reserveA;
        _reserveB = reserveB;
        _totalLiquidity = totalSupply();
        _price = reserveA > 0 ? (reserveB * 1e18) / reserveA : 0;
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * @dev Square root function (Babylonian method)
     * Digunakan untuk calculate initial liquidity
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Return minimum dari dua numbers
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
```

**🔑 Key Concepts dalam Code:**

1. **LP Tokens**: User mendapat LP tokens sebagai proof of liquidity
2. **Minimum Liquidity**: 1000 wei di-lock forever untuk mencegah division by zero
3. **Fee Mechanism**: 0.3% fee dari setiap swap masuk ke pool (benefit untuk LPs)
4. **Slippage Protection**: User set minimum output yang acceptable
5. **ReentrancyGuard**: Protect dari reentrancy attacks

---

## 4. Testing Contracts

### 4.1 Basic Token Test

Buat file `test/CampusCoin.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/CampusCoin.sol";

contract CampusCoinTest is Test {
    CampusCoin public campusCoin;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        campusCoin = new CampusCoin();
    }

    function test_InitialState() public view {
        // Check basic properties
        assertEq(campusCoin.name(), "Campus Coin");
        assertEq(campusCoin.symbol(), "CAMP");
        assertEq(campusCoin.decimals(), 18);

        // Check initial supply (100,000 CAMP)
        uint256 expectedInitial = 100_000 * 10**18;
        assertEq(campusCoin.totalSupply(), expectedInitial);
        assertEq(campusCoin.balanceOf(owner), expectedInitial);
    }

    function test_Mint() public {
        uint256 mintAmount = 1000 * 10**18;

        campusCoin.mint(user1, mintAmount);

        assertEq(campusCoin.balanceOf(user1), mintAmount);
        assertEq(campusCoin.totalSupply(), 100_000 * 10**18 + mintAmount);
    }

    function test_MintFailsWhenNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        campusCoin.mint(user2, 1000 * 10**18);
    }

    function test_Burn() public {
        uint256 burnAmount = 1000 * 10**18;

        campusCoin.burn(burnAmount);

        assertEq(campusCoin.balanceOf(owner), 100_000 * 10**18 - burnAmount);
    }
}
```

---

### 4.2 DEX Integration Test

Buat file `test/SimpleDEX.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/CampusCoin.sol";
import "../src/MockUSDC.sol";
import "../src/SimpleDEX.sol";

contract SimpleDEXTest is Test {
    CampusCoin public campusCoin;
    MockUSDC public usdc;
    SimpleDEX public dex;

    address public owner;
    address public alice;
    address public bob;

    uint256 public constant CAMP_AMOUNT = 1000 * 10**18; // 1000 CAMP
    uint256 public constant USDC_AMOUNT = 2000 * 10**6;  // 2000 USDC

    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // Deploy contracts
        campusCoin = new CampusCoin();
        usdc = new MockUSDC();
        dex = new SimpleDEX(address(campusCoin), address(usdc));

        // Setup balances
        campusCoin.mint(alice, 10_000 * 10**18);
        campusCoin.mint(bob, 5_000 * 10**18);

        usdc.mint(alice, 20_000 * 10**6);
        usdc.mint(bob, 10_000 * 10**6);

        // Approve DEX
        vm.prank(alice);
        campusCoin.approve(address(dex), type(uint256).max);
        vm.prank(alice);
        usdc.approve(address(dex), type(uint256).max);

        vm.prank(bob);
        campusCoin.approve(address(dex), type(uint256).max);
        vm.prank(bob);
        usdc.approve(address(dex), type(uint256).max);
    }

    function test_AddLiquidity() public {
        vm.prank(alice);
        uint256 liquidity = dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);

        // Check LP tokens minted
        assertGt(liquidity, 0);
        assertEq(dex.balanceOf(alice), liquidity);

        // Check reserves updated
        assertEq(dex.reserveA(), CAMP_AMOUNT);
        assertEq(dex.reserveB(), USDC_AMOUNT);

        // Check tokens transferred
        assertEq(campusCoin.balanceOf(address(dex)), CAMP_AMOUNT);
        assertEq(usdc.balanceOf(address(dex)), USDC_AMOUNT);
    }

    function test_SwapAforB() public {
        // Add liquidity first
        vm.prank(alice);
        dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);

        // Bob swaps CAMP for USDC
        uint256 swapAmount = 100 * 10**18; // 100 CAMP
        uint256 expectedOut = dex.getAmountOut(swapAmount, CAMP_AMOUNT, USDC_AMOUNT);

        uint256 bobUsdcBefore = usdc.balanceOf(bob);

        vm.prank(bob);
        dex.swapAforB(swapAmount, expectedOut);

        // Check USDC received
        assertEq(usdc.balanceOf(bob), bobUsdcBefore + expectedOut);

        // Check reserves updated
        assertEq(dex.reserveA(), CAMP_AMOUNT + swapAmount);
        assertEq(dex.reserveB(), USDC_AMOUNT - expectedOut);
    }

    function test_CompleteScenario() public {
        console.log("=== Complete DEX Scenario ===");

        // Alice adds liquidity
        vm.prank(alice);
        uint256 liquidity = dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        console.log("Alice LP tokens:", liquidity);

        // Bob swaps
        uint256 swapAmount = 50 * 10**18;
        uint256 expectedOut = dex.getAmountOut(swapAmount, CAMP_AMOUNT, USDC_AMOUNT);

        vm.prank(bob);
        dex.swapAforB(swapAmount, expectedOut);
        console.log("Bob swapped 50 CAMP for", expectedOut / 10**6, "USDC");

        // Alice removes liquidity
        vm.prank(alice);
        (uint256 campOut, uint256 usdcOut) = dex.removeLiquidity(liquidity / 2);
        console.log("Alice removed liquidity:", campOut / 10**18, "CAMP,", usdcOut / 10**6, "USDC");

        assertGt(campOut, 0);
        assertGt(usdcOut, 0);
    }
}
```

---

### 4.3 Jalankan Tests

```bash
# Compile contracts
forge build

# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test test_AddLiquidity -vvv

# Run with gas report
forge test --gas-report

# Check coverage
forge coverage
```

**Expected output:**
```
[⠊] Compiling...
[⠢] Compiling 10 files with Solc 0.8.30
[⠆] Solc 0.8.30 finished in 1.45s
Compiler run successful!

Ran 5 tests for test/SimpleDEX.t.sol:SimpleDEXTest
[PASS] test_AddLiquidity() (gas: 234567)
[PASS] test_SwapAforB() (gas: 156789)
[PASS] test_CompleteScenario() (gas: 567890)
Suite result: ok. 3 passed; 0 failed; 0 skipped; finished in 2.14s
```

---

## 5. Deployment Script

### 5.1 Create Deployment Script

Buat file `script/DeployDEX.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {CampusCoin} from "../src/CampusCoin.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {SimpleDEX} from "../src/SimpleDEX.sol";

contract DeployDEX is Script {
    // Contract instances
    CampusCoin public campusCoin;
    MockUSDC public usdc;
    SimpleDEX public dex;

    // Initial liquidity amounts
    uint256 public constant INITIAL_CAMP_LIQUIDITY = 1000 * 10**18;  // 1,000 CAMP
    uint256 public constant INITIAL_USDC_LIQUIDITY = 2000 * 10**6;   // 2,000 USDC

    function run() public returns (address, address, address) {
        console.log("========================================");
        console.log("Deploying Simple DEX to Lisk Sepolia...");
        console.log("========================================");
        console.log("");

        // Get deployer info
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deployer address:", deployer);
        console.log("Network: Lisk Sepolia Testnet");
        console.log("Chain ID: 4202");
        console.log("");

        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "ETH");

        if (balance < 0.01 ether) {
            console.log("");
            console.log("WARNING: Low balance!");
            console.log("Get test ETH from faucet:");
            console.log("https://sepolia-faucet.lisk.com");
            console.log("");
        }

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy tokens
        console.log("Step 1: Deploying tokens...");
        console.log("----------------------------");

        campusCoin = new CampusCoin();
        console.log("CampusCoin deployed at:", address(campusCoin));

        usdc = new MockUSDC();
        console.log("MockUSDC deployed at  :", address(usdc));
        console.log("");

        // Step 2: Deploy DEX
        console.log("Step 2: Deploying DEX...");
        console.log("-------------------------");

        dex = new SimpleDEX(address(campusCoin), address(usdc));
        console.log("SimpleDEX deployed at :", address(dex));
        console.log("");

        // Step 3: Setup initial liquidity
        console.log("Step 3: Setting up initial liquidity...");
        console.log("----------------------------------------");

        // Mint additional tokens untuk liquidity + testing
        campusCoin.mint(deployer, INITIAL_CAMP_LIQUIDITY + 5000 * 10**18);
        usdc.mint(deployer, INITIAL_USDC_LIQUIDITY + 10000 * 10**6);

        // Approve DEX
        campusCoin.approve(address(dex), type(uint256).max);
        usdc.approve(address(dex), type(uint256).max);

        // Add initial liquidity
        uint256 liquidity = dex.addLiquidity(INITIAL_CAMP_LIQUIDITY, INITIAL_USDC_LIQUIDITY);
        console.log("Initial liquidity added");
        console.log("LP tokens minted:", liquidity);
        console.log("");

        vm.stopBroadcast();

        // Step 4: Verification
        console.log("Step 4: Deployment verification...");
        console.log("------------------------------------");
        _verifyDeployment();
        console.log("");

        // Step 5: Instructions
        console.log("Step 5: Next steps...");
        console.log("----------------------");
        _printInstructions();

        return (address(campusCoin), address(usdc), address(dex));
    }

    function _verifyDeployment() internal view {
        // Token info
        console.log("CampusCoin:");
        console.log("  Name        :", campusCoin.name());
        console.log("  Symbol      :", campusCoin.symbol());
        console.log("  Total Supply:", campusCoin.totalSupply() / 10**18, "CAMP");
        console.log("");

        console.log("MockUSDC:");
        console.log("  Name        :", usdc.name());
        console.log("  Symbol      :", usdc.symbol());
        console.log("  Total Supply:", usdc.totalSupply() / 10**6, "USDC");
        console.log("");

        // DEX info
        (uint256 reserveA, uint256 reserveB, uint256 totalLiquidity, uint256 price) = dex.getPoolInfo();
        console.log("SimpleDEX Pool:");
        console.log("  CAMP Reserve:", reserveA / 10**18, "CAMP");
        console.log("  USDC Reserve:", reserveB / 10**6, "USDC");
        console.log("  Total LP    :", totalLiquidity);
        console.log("  Price       :", price / 1e18, "USDC per CAMP");
    }

    function _printInstructions() internal view {
        console.log("Contract Addresses:");
        console.log("  CampusCoin :", address(campusCoin));
        console.log("  MockUSDC   :", address(usdc));
        console.log("  SimpleDEX  :", address(dex));
        console.log("");

        console.log("Block Explorer:");
        console.log("  https://sepolia-blockscout.lisk.com/address/%s", address(dex));
        console.log("");

        console.log("How to interact:");
        console.log("  1. Add liquidity: dex.addLiquidity(campAmount, usdcAmount)");
        console.log("  2. Swap CAMP->USDC: dex.swapAforB(campAmount, minUsdcOut)");
        console.log("  3. Swap USDC->CAMP: dex.swapBforA(usdcAmount, minCampOut)");
        console.log("  4. Remove liquidity: dex.removeLiquidity(lpAmount)");
        console.log("");

        console.log("Save these addresses for later use!");
    }
}
```

---

## 6. Deploy ke Lisk Sepolia

### 6.1 Get Test ETH

1. **Visit Lisk Sepolia Faucet**: https://sepolia-faucet.lisk.com
2. **Paste your wallet address**
3. **Request ETH**
4. **Wait ~30 seconds** untuk konfirmasi

**Check balance:**
```bash
cast balance YOUR_ADDRESS --rpc-url https://rpc.sepolia-api.lisk.com
```

---

### 6.2 Deploy Contracts

```bash
# Method 1: Using deployment script (RECOMMENDED)
forge script script/DeployDEX.s.sol \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api

# Method 2: Deploy individually
forge create src/CampusCoin.sol:CampusCoin \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --private-key $PRIVATE_KEY

# Simpan address, lalu deploy MockUSDC
forge create src/MockUSDC.sol:MockUSDC \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --private-key $PRIVATE_KEY

# Deploy SimpleDEX dengan constructor args
forge create src/SimpleDEX.sol:SimpleDEX \
  --constructor-args $CAMP_ADDRESS $USDC_ADDRESS \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --private-key $PRIVATE_KEY
```

**Expected output:**
```
========================================
Deploying Simple DEX to Lisk Sepolia...
========================================

Deployer address: 0x742d35Cc6635C0532925a3b8D40168675c8C44e7
Network: Lisk Sepolia Testnet
Chain ID: 4202

Deployer balance: 0.5 ETH

Step 1: Deploying tokens...
----------------------------
CampusCoin deployed at: 0x1234...
MockUSDC deployed at  : 0x5678...

Step 2: Deploying DEX...
-------------------------
SimpleDEX deployed at : 0x9abc...

Step 3: Setting up initial liquidity...
----------------------------------------
Initial liquidity added
LP tokens minted: 44721359549995793928

Step 4: Deployment verification...
------------------------------------
CampusCoin:
  Name        : Campus Coin
  Symbol      : CAMP
  Total Supply: 106000 CAMP

MockUSDC:
  Name        : Mock USDC
  Symbol      : USDC
  Total Supply: 1012000 USDC

SimpleDEX Pool:
  CAMP Reserve: 1000 CAMP
  USDC Reserve: 2000 USDC
  Total LP    : 44721359549995794928
  Price       : 2 USDC per CAMP

Step 5: Next steps...
----------------------
Contract Addresses:
  CampusCoin : 0x1234...
  MockUSDC   : 0x5678...
  SimpleDEX  : 0x9abc...

Block Explorer:
  https://sepolia-blockscout.lisk.com/address/0x9abc...

Save these addresses for later use!
```

---

### 6.3 Verify Contracts (if not auto-verified)

```bash
# Verify CampusCoin
forge verify-contract \
  $CAMPUS_COIN_ADDRESS \
  src/CampusCoin.sol:CampusCoin \
  --chain 4202 \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api

# Verify MockUSDC
forge verify-contract \
  $MOCK_USDC_ADDRESS \
  src/MockUSDC.sol:MockUSDC \
  --chain 4202 \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api

# Verify SimpleDEX
forge verify-contract \
  $SIMPLE_DEX_ADDRESS \
  src/SimpleDEX.sol:SimpleDEX \
  --chain 4202 \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api \
  --constructor-args $(cast abi-encode "constructor(address,address)" $CAMPUS_COIN_ADDRESS $MOCK_USDC_ADDRESS)
```

---

## 7. Interaksi dengan DEX

### 7.1 Setup Environment

```bash
# Set contract addresses (ganti dengan hasil deployment Anda)
export CAMP_TOKEN=0x1234567890123456789012345678901234567890
export USDC_TOKEN=0x5678901234567890123456789012345678901234
export DEX_CONTRACT=0x9abc012345678901234567890123456789012345
export RPC_URL=https://rpc.sepolia-api.lisk.com
```

---

### 7.2 Read Functions

```bash
# Check token balances
cast call $CAMP_TOKEN "balanceOf(address)(uint256)" YOUR_ADDRESS --rpc-url $RPC_URL

# Check DEX reserves
cast call $DEX_CONTRACT "getPoolInfo()(uint256,uint256,uint256,uint256)" --rpc-url $RPC_URL

# Get current price
cast call $DEX_CONTRACT "getPrice()(uint256)" --rpc-url $RPC_URL | cast to-dec
```

---

### 7.3 Write Functions

#### Mint Tokens

```bash
# Mint CAMP (owner only)
cast send $CAMP_TOKEN \
  "mint(address,uint256)" \
  YOUR_ADDRESS \
  1000000000000000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

# Mint USDC (owner only)
cast send $USDC_TOKEN \
  "mint(address,uint256)" \
  YOUR_ADDRESS \
  1000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL
```

#### Add Liquidity

```bash
# 1. Approve tokens
cast send $CAMP_TOKEN \
  "approve(address,uint256)" \
  $DEX_CONTRACT \
  1000000000000000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

cast send $USDC_TOKEN \
  "approve(address,uint256)" \
  $DEX_CONTRACT \
  2000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

# 2. Add liquidity: 100 CAMP + 200 USDC
cast send $DEX_CONTRACT \
  "addLiquidity(uint256,uint256)" \
  100000000000000000000 \
  200000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

# 3. Check LP tokens received
cast call $DEX_CONTRACT \
  "balanceOf(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url $RPC_URL
```

#### Perform Swaps

```bash
# Swap 10 CAMP for USDC
# 1. Check expected output
cast call $DEX_CONTRACT \
  "getAmountOut(uint256,uint256,uint256)(uint256)" \
  10000000000000000000 \
  1000000000000000000000 \
  2000000000 \
  --rpc-url $RPC_URL

# 2. Perform swap
cast send $DEX_CONTRACT \
  "swapAforB(uint256,uint256)" \
  10000000000000000000 \
  19000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL
```

---

## 8. Troubleshooting

### Common Issues

#### Issue 1: "Insufficient balance"

**Problem:** Tidak punya cukup test ETH

**Solution:**
```bash
# Check balance
cast balance YOUR_ADDRESS --rpc-url $RPC_URL

# Get from faucet
# Visit: https://sepolia-faucet.lisk.com
```

---

#### Issue 2: "Slippage too high"

**Problem:** Price berubah saat transaction pending

**Solution:**
```bash
# Increase slippage tolerance (lower minAmountOut)
# Atau check pool reserves dulu:
cast call $DEX_CONTRACT "getPoolInfo()(uint256,uint256,uint256,uint256)" --rpc-url $RPC_URL
```

---

#### Issue 3: "Insufficient liquidity"

**Problem:** Pool belum punya liquidity

**Solution:**
```bash
# Add liquidity terlebih dahulu
# Atau check apakah ada reserves:
cast call $DEX_CONTRACT "reserveA()(uint256)" --rpc-url $RPC_URL
cast call $DEX_CONTRACT "reserveB()(uint256)" --rpc-url $RPC_URL
```

---

#### Issue 4: Verification gagal

**Problem:** Contract verification error

**Solution:**
```bash
# Make sure compiler version match
forge --version

# Try manual verification di Blockscout UI:
# https://sepolia-blockscout.lisk.com/address/YOUR_CONTRACT/verify-via-flattened-code
```

---

## 🎉 Kesimpulan

**Selamat!** Anda telah berhasil:

1. ✅ Setup Foundry development environment
2. ✅ Membuat 2 ERC-20 tokens (CAMP & USDC)
3. ✅ Implementasi SimpleDEX dengan AMM formula (x × y = k)
4. ✅ Writing comprehensive tests
5. ✅ Deploy ke Lisk Sepolia testnet
6. ✅ Verifikasi contracts di Blockscout
7. ✅ Interaksi dengan DEX via command line

**Yang Telah Dibangun:**

| Component | Description |
|-----------|-------------|
| **CampusCoin** | ERC-20 token dengan max supply & minting |
| **MockUSDC** | ERC-20 dengan 6 decimals (seperti USDC asli) |
| **SimpleDEX** | AMM DEX dengan liquidity pools & swap functions |
| **LP Tokens** | ERC-20 tokens untuk Liquidity Providers |
| **Testing Suite** | Unit & integration tests dengan Foundry |
| **Deployment Scripts** | Automated deployment dengan verification |

**Gas Usage:**
- Add Liquidity: ~150,000 gas
- Remove Liquidity: ~120,000 gas
- Swap A for B: ~100,000 gas
- Swap B for A: ~100,000 gas

**Key Learnings:**
1. 📐 AMM formula: x × y = k
2. 💧 Liquidity pools & LP tokens
3. 💱 Token swaps dengan slippage protection
4. 🔒 Security: ReentrancyGuard, access control
5. 🧪 Testing dengan Foundry
6. 🚀 Deployment ke testnet

---

## 🔜 Next Steps

**Improvements you can add:**
1. Price oracle integration
2. Multi-hop swaps (A → B → C)
3. Concentrated liquidity (like Uniswap V3)
4. Frontend web interface
5. Flash loan support
6. Governance token & voting

**Continue learning:** [Part 5: Advanced Topics →](./05-advanced-defi.md)

---

**Prepared by:** Ethereum Jakarta x Lisk
**Last Updated:** November 2025
**Version:** 1.0
