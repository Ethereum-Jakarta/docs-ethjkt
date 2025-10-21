---
sidebar_position: 1
title: 1. Smart Contract DeFi Sederhana dengan Foundry dan Monad
description: Membangun Mini DEX sederhana menggunakan Foundry dan deploy ke Monad Testnet
---

# Workshop DeFi Sederhana dengan Foundry dan Monad

Tutorial lengkap untuk membangun Mini DEX (Decentralized Exchange) sederhana menggunakan Foundry dan deploy ke Monad Testnet. Workshop ini fokus pada konsep dasar DeFi dengan implementasi yang mudah dipahami.

## Daftar Isi

1. [Persiapan Environment](#1-persiapan-environment)
2. [Setup Proyek dengan Template Monad](#2-setup-proyek-dengan-template-monad)
3. [Membuat Token ERC-20 Sederhana](#3-membuat-token-erc-20-sederhana)
4. [Implementasi Mini DEX](#4-implementasi-mini-dex)
5. [Testing Smart Contracts](#5-testing-smart-contracts)
6. [Script Deployment](#6-script-deployment)
7. [Deployment ke Monad Testnet](#7-deployment-ke-monad-testnet)
8. [Interaksi dengan DEX](#8-interaksi-dengan-dex)
9. [Best Practices](#10-best-practices)

---

## 1. Persiapan Environment

### Instalasi Foundry

Foundry adalah toolkit modern untuk pengembangan smart contract yang sangat cepat dan mudah digunakan.

#### macOS
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verifikasi instalasi
forge --version
cast --version
anvil --version
```

#### Windows (WSL)
```bash
# Install WSL jika belum ada
# Buka PowerShell sebagai Administrator:
wsl --install

# Restart komputer, lalu buka WSL terminal
# Install Foundry di WSL:
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup

# Verifikasi
forge --version
cast --version
anvil --version
```

## 2. Setup Proyek dengan Template Monad

### Membuat Proyek Baru

```bash
# Buat proyek DeFi dengan template Monad
forge init --template monad-developers/foundry-monad simple-defi
cd simple-defi

# Struktur project:
# simple-defi/
# ├── foundry.toml        # Konfigurasi Foundry
# ├── src/               # Smart contracts
# ├── test/              # Test files
# ├── script/            # Deployment scripts
# ├── lib/               # Dependencies
# └── .env.example       # Environment variables
```

### Install Dependencies

```bash
# OpenZeppelin untuk security standards
forge install OpenZeppelin/openzeppelin-contracts

# Forge-std untuk testing utilities
forge install foundry-rs/forge-std
```

## 3. Membuat Token ERC-20 Sederhana

### Token A: Campus Coin

Buat file `src/CampusCoin.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CampusCoin
 * @dev Token sederhana untuk ekosistem kampus
 */
contract CampusCoin is ERC20, Ownable {
    // Total supply maksimum
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18; // 1 juta token
    
    // Event untuk tracking mint
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor() ERC20("Campus Coin", "CAMP") Ownable(msg.sender) {
        // Mint initial supply ke deployer
        uint256 initialSupply = 100_000 * 10**18; // 100 ribu token
        _mint(msg.sender, initialSupply);
        
        emit TokensMinted(msg.sender, initialSupply);
    }
    
    /**
     * @dev Mint token baru (hanya owner)
     * @param to Address yang menerima token
     * @param amount Jumlah token yang dimint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn token dari caller
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

### Token B: USD Coin (Mock)

Buat file `src/MockUSDC.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing (6 decimals like real USDC)
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000_000 * 10**6); // 1 million USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return 6; // USDC has 6 decimals
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

---

## 4. Implementasi Mini DEX

### Simple DEX Contract

Buat file `src/SimpleDEX.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleDEX
 * @dev Mini DEX sederhana dengan AMM (Automated Market Maker)
 * Menggunakan formula x * y = k (constant product)
 */
contract SimpleDEX is ERC20, ReentrancyGuard, Ownable {
    // Token yang diperdagangkan
    IERC20 public immutable tokenA; // Campus Coin
    IERC20 public immutable tokenB; // Mock USDC
    
    // Reserves (cadangan token di pool)
    uint256 public reserveA;
    uint256 public reserveB;
    
    // Fee untuk setiap swap (0.3%)
    uint256 public constant FEE_PERCENT = 3;      // 0.3%
    uint256 public constant FEE_DENOMINATOR = 1000; // 100%
    
    // Minimum liquidity untuk mencegah division by zero
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    
    // Events
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
    
    constructor(address _tokenA, address _tokenB) 
        ERC20("SimpleDEX LP", "SDEX-LP") 
        Ownable(msg.sender)
    {
        require(_tokenA != _tokenB, "Identical tokens");
        require(_tokenA != address(0) && _tokenB != address(0), "Zero address");
        
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    
    /**
     * @dev Tambah likuiditas ke pool
     * @param amountA Jumlah token A yang ingin ditambahkan
     * @param amountB Jumlah token B yang ingin ditambahkan
     * @return liquidity Jumlah LP token yang diterima
     */
    function addLiquidity(uint256 amountA, uint256 amountB) 
        external 
        nonReentrant 
        returns (uint256 liquidity) 
    {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");
        
        // Transfer token dari user
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        
        uint256 totalLiquidity = totalSupply();
        
        if (totalLiquidity == 0) {
            // Pool pertama kali - set initial price
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(0xdead), MINIMUM_LIQUIDITY); // Lock minimum liquidity to dead address
        } else {
            // Pool sudah ada - maintain price ratio
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
     */
    function removeLiquidity(uint256 liquidity) 
        external 
        nonReentrant 
        returns (uint256 amountA, uint256 amountB) 
    {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");
        
        uint256 totalLiquidity = totalSupply();
        
        // Calculate token amounts berdasarkan proporsi
        amountA = (liquidity * reserveA) / totalLiquidity;
        amountB = (liquidity * reserveB) / totalLiquidity;
        
        require(amountA > 0 && amountB > 0, "Insufficient liquidity burned");
        
        // Burn LP tokens
        _burn(msg.sender, liquidity);
        
        // Transfer tokens ke user
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
        
        // Update reserves
        reserveA -= amountA;
        reserveB -= amountB;
        
        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidity);
    }
    
    /**
     * @dev Swap token A untuk token B
     * @param amountAIn Jumlah token A yang diswap
     * @param minAmountBOut Minimum token B yang diharapkan (slippage protection)
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
    
    /**
     * @dev Calculate output amount untuk swap (dengan fee)
     * @param amountIn Jumlah token input
     * @param reserveIn Reserve token input
     * @param reserveOut Reserve token output
     * @return amountOut Jumlah token output setelah fee
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
     */
    function getPrice() external view returns (uint256) {
        require(reserveA > 0, "No liquidity");
        // Price dengan 18 decimals untuk precision
        return (reserveB * 1e18) / reserveA;
    }
    
    /**
     * @dev Get pool info untuk UI
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
    
    // === UTILITY FUNCTIONS ===
    
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
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
```

---

## 5. Testing Smart Contracts

### Basic Token Tests

Buat file `test/CampusCoin.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

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
        
        // Check initial supply
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
        // Use the new custom error format from OpenZeppelin v5
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        campusCoin.mint(user2, 1000 * 10**18);
    }
    
    function test_MintFailsWhenExceedsMaxSupply() public {
        uint256 excessAmount = campusCoin.MAX_SUPPLY() - campusCoin.totalSupply() + 1;
        
        vm.expectRevert("Exceeds max supply");
        campusCoin.mint(user1, excessAmount);
    }
    
    function test_Burn() public {
        uint256 burnAmount = 1000 * 10**18;
        
        campusCoin.burn(burnAmount);
        
        assertEq(campusCoin.balanceOf(owner), 100_000 * 10**18 - burnAmount);
    }
    
    function test_RemainingSupply() public {
        uint256 expected = campusCoin.MAX_SUPPLY() - campusCoin.totalSupply();
        assertEq(campusCoin.remainingSupply(), expected);
        
        // After minting
        campusCoin.mint(user1, 1000 * 10**18);
        assertEq(campusCoin.remainingSupply(), expected - 1000 * 10**18);
    }
}
```

### DEX Integration Tests

Buat file `test/SimpleDEX.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

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
    
    function test_RemoveLiquidity() public {
        // Add liquidity first
        vm.prank(alice);
        uint256 liquidity = dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        // Remove half liquidity
        uint256 liquidityToRemove = liquidity / 2;
        
        uint256 aliceCampBefore = campusCoin.balanceOf(alice);
        uint256 aliceUsdcBefore = usdc.balanceOf(alice);
        
        vm.prank(alice);
        (uint256 amountA, uint256 amountB) = dex.removeLiquidity(liquidityToRemove);
        
        // Check tokens returned
        assertGt(amountA, 0);
        assertGt(amountB, 0);
        assertEq(campusCoin.balanceOf(alice), aliceCampBefore + amountA);
        assertEq(usdc.balanceOf(alice), aliceUsdcBefore + amountB);
        
        // Check LP tokens burned
        assertEq(dex.balanceOf(alice), liquidity - liquidityToRemove);
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
    
    function test_SwapBforA() public {
        // Add liquidity first
        vm.prank(alice);
        dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        // Bob swaps USDC for CAMP
        uint256 swapAmount = 200 * 10**6; // 200 USDC
        uint256 expectedOut = dex.getAmountOut(swapAmount, USDC_AMOUNT, CAMP_AMOUNT);
        
        uint256 bobCampBefore = campusCoin.balanceOf(bob);
        
        vm.prank(bob);
        dex.swapBforA(swapAmount, expectedOut);
        
        // Check CAMP received
        assertEq(campusCoin.balanceOf(bob), bobCampBefore + expectedOut);
        
        // Check reserves updated
        assertEq(dex.reserveB(), USDC_AMOUNT + swapAmount);
        assertEq(dex.reserveA(), CAMP_AMOUNT - expectedOut);
    }
    
    function test_GetPrice() public {
        vm.prank(alice);
        dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        uint256 price = dex.getPrice();
        // Price should be USDC/CAMP = 2000/1000 = 2 (dengan 18 decimals)
        uint256 expectedPrice = (USDC_AMOUNT * 1e18) / CAMP_AMOUNT;
        assertEq(price, expectedPrice);
    }
    
    function test_SlippageProtection() public {
        vm.prank(alice);
        dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        uint256 swapAmount = 100 * 10**18;
        uint256 expectedOut = dex.getAmountOut(swapAmount, CAMP_AMOUNT, USDC_AMOUNT);
        
        // Try with minimum output too high
        vm.prank(bob);
        vm.expectRevert("Slippage too high");
        dex.swapAforB(swapAmount, expectedOut + 1);
    }
    
    function test_GetPoolInfo() public {
        vm.prank(alice);
        uint256 liquidity = dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        (uint256 reserveA, uint256 reserveB, uint256 totalLiquidity, uint256 price) = dex.getPoolInfo();
        
        assertEq(reserveA, CAMP_AMOUNT);
        assertEq(reserveB, USDC_AMOUNT);
        assertEq(totalLiquidity, liquidity + dex.MINIMUM_LIQUIDITY());
        assertGt(price, 0);
    }
    
    function test_CompleteTradeScenario() public {
        console.log("=== Complete Trade Scenario Test ===");
        
        // Alice adds initial liquidity
        console.log("Alice adds liquidity: 1000 CAMP + 2000 USDC");
        vm.prank(alice);
        uint256 aliceLiquidity = dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        (uint256 reserveA1, uint256 reserveB1, , uint256 price1) = dex.getPoolInfo();
        console.log("Initial price (USDC per CAMP):", price1 / 1e18);
        console.log("Alice LP tokens:", aliceLiquidity);
        
        // Bob swaps CAMP for USDC
        uint256 bobSwapAmount = 50 * 10**18; // 50 CAMP
        uint256 expectedUsdc = dex.getAmountOut(bobSwapAmount, reserveA1, reserveB1);
        
        console.log("Bob swaps CAMP amount:", bobSwapAmount / 10**18);
        console.log("Expected USDC output:", expectedUsdc / 10**6);
        
        vm.prank(bob);
        dex.swapAforB(bobSwapAmount, expectedUsdc);
        
        (uint256 reserveA2, uint256 reserveB2, , uint256 price2) = dex.getPoolInfo();
        console.log("New price after swap:", price2 / 1e18);
        
        // When CAMP is sold for USDC, CAMP supply increases and USDC decreases
        // This makes CAMP cheaper (price should decrease), not more expensive
        console.log("Price change:", price2 < price1 ? "decreased" : "increased");
        
        // Bob swaps back USDC for CAMP
        uint256 usdcSwapAmount = 100 * 10**6; // 100 USDC
        uint256 expectedCamp = dex.getAmountOut(usdcSwapAmount, reserveB2, reserveA2);
        
        console.log("Bob swaps USDC amount:", usdcSwapAmount / 10**6);
        console.log("Expected CAMP output:", expectedCamp / 10**18);
        
        vm.prank(bob);
        dex.swapBforA(usdcSwapAmount, expectedCamp);
        
        (, , , uint256 price3) = dex.getPoolInfo();
        console.log("Final price:", price3 / 1e18);
        
        // Alice removes some liquidity
        uint256 liquidityToRemove = aliceLiquidity / 4; // 25%
        console.log("Alice removes 25% liquidity");
        
        vm.prank(alice);
        (uint256 campOut, uint256 usdcOut) = dex.removeLiquidity(liquidityToRemove);
        
        console.log("Alice receives CAMP:", campOut / 10**18);
        console.log("Alice receives USDC:", usdcOut / 10**6);
        
        assertGt(campOut, 0);
        assertGt(usdcOut, 0);
        
        console.log("=== Scenario completed successfully ===");
    }
    
    function testFuzz_SwapAmounts(uint256 swapAmount) public {
        // Add initial liquidity
        vm.prank(alice);
        dex.addLiquidity(CAMP_AMOUNT, USDC_AMOUNT);
        
        // Bound swap amount to reasonable range (1-100 CAMP)
        swapAmount = bound(swapAmount, 1 * 10**18, 100 * 10**18);
        
        uint256 expectedOut = dex.getAmountOut(swapAmount, CAMP_AMOUNT, USDC_AMOUNT);
        
        vm.prank(bob);
        dex.swapAforB(swapAmount, expectedOut);
        
        // Check that reserves are consistent
        assertGt(dex.reserveA(), CAMP_AMOUNT);
        assertLt(dex.reserveB(), USDC_AMOUNT);
    }
}
```

---

## 6. Script Deployment

### Simple Deployment Script

Buat file `script/DeployDEX.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CampusCoin} from "../src/CampusCoin.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {SimpleDEX} from "../src/SimpleDEX.sol";

contract DeployDEX is Script {
    // Contract instances
    CampusCoin public campusCoin;
    MockUSDC public usdc;
    SimpleDEX public dex;
    
    // Configuration
    uint256 public constant INITIAL_CAMP_LIQUIDITY = 1000 * 10**18;  // 1,000 CAMP
    uint256 public constant INITIAL_USDC_LIQUIDITY = 2000 * 10**6;   // 2,000 USDC
    
    function run() public returns (address, address, address) {
        console.log("Deploying Simple DEX to Monad Testnet...");
        console.log("");
        
        // Get deployer info
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployer);
        console.log("Network: Monad Testnet (Chain ID: 10143)");
        
        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "MON");
        
        if (balance < 0.05 ether) {
            console.log("Warning: Low balance! Get MON from faucet:");
            console.log("https://faucet.testnet.monad.xyz/");
            console.log("");
        }
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy tokens
        console.log("Step 1: Deploying tokens...");
        
        campusCoin = new CampusCoin();
        console.log("CampusCoin deployed at:", address(campusCoin));
        
        usdc = new MockUSDC();
        console.log("MockUSDC deployed at:", address(usdc));
        
        // Step 2: Deploy DEX
        console.log("");
        console.log("Step 2: Deploying DEX...");
        
        dex = new SimpleDEX(address(campusCoin), address(usdc));
        console.log("SimpleDEX deployed at:", address(dex));
        
        // Step 3: Setup initial liquidity
        console.log("");
        console.log("Step 3: Setting up initial liquidity...");
        
        // Mint additional tokens for liquidity
        campusCoin.mint(deployer, INITIAL_CAMP_LIQUIDITY + 5000 * 10**18); // Extra for testing
        usdc.mint(deployer, INITIAL_USDC_LIQUIDITY + 10000 * 10**6);       // Extra for testing
        
        // Approve DEX
        campusCoin.approve(address(dex), type(uint256).max);
        usdc.approve(address(dex), type(uint256).max);
        
        // Add initial liquidity
        uint256 liquidity = dex.addLiquidity(INITIAL_CAMP_LIQUIDITY, INITIAL_USDC_LIQUIDITY);
        console.log("Initial liquidity added:", liquidity, "LP tokens");
        
        vm.stopBroadcast();
        
        // Step 4: Verification
        console.log("");
        console.log("Step 4: Deployment verification...");
        
        _verifyDeployment();
        
        // Step 5: Instructions
        console.log("");
        console.log("Step 5: How to use your DEX...");
        
        _printInstructions();
        
        return (address(campusCoin), address(usdc), address(dex));
    }
    
    function _verifyDeployment() internal view {
        // Verify token properties
        console.log("CampusCoin:");
        console.log("Name:", campusCoin.name());
        console.log("Symbol:", campusCoin.symbol());
        console.log("Total Supply:", campusCoin.totalSupply() / 10**18, "CAMP");
        
        console.log("MockUSDC:");
        console.log("Name:", usdc.name());
        console.log("Symbol:", usdc.symbol());
        console.log("Total Supply:", usdc.totalSupply() / 10**6, "USDC");
        
        // Verify DEX
        (uint256 reserveA, uint256 reserveB, uint256 totalLiquidity, uint256 price) = dex.getPoolInfo();
        console.log("SimpleDEX:");
        console.log("CAMP Reserve:", reserveA / 10**18);
        console.log("USDC Reserve:", reserveB / 10**6);
        console.log("Total Liquidity:", totalLiquidity);
        console.log("Current Price:", price / 1e18, "USDC per CAMP");
    }
    
    function _printInstructions() internal view {
        console.log("1. Get test tokens:");
        console.log("CAMP: Already minted to deployer");
        console.log("USDC: Use faucet() function");
        console.log("");
        
        console.log("2. Add liquidity:");
        console.log("Approve both tokens to DEX");
        console.log("Call addLiquidity(amountCAMP, amountUSDC)");
        console.log("");
        
        console.log("3. Swap tokens:");
        console.log("CAMP to USDC: swapAforB(amount, minOut)");
        console.log("USDC to CAMP: swapBforA(amount, minOut)");
        console.log("");
        
        console.log("4. Remove liquidity:");
        console.log("Call removeLiquidity(lpTokenAmount)");
        console.log("");
        
        console.log("Contract Addresses:");
        console.log("CampusCoin:", address(campusCoin));
        console.log("MockUSDC:  ", address(usdc));
        console.log("SimpleDEX: ", address(dex));
        console.log("");
        
        console.log("Block Explorer:");
        console.log("https://testnet.monadexplorer.com/address/", address(dex));
    }
}
```

### Run Tests

```bash
# Compile contracts
forge build

# Run all tests
forge test

# Run tests with verbose output
forge test -vvv

# Run specific test
forge test --match-test test_AddLiquidity -vvv

# Run with gas report
forge test --gas-report

# Coverage report
forge coverage
```

Expected output:
```
[⠒] Compiling...
[⠢] Compiling 4 files with 0.8.26
[⠆] Solc 0.8.26 finished in 1.23s

Running 10 tests for test/SimpleDEX.t.sol:SimpleDEXTest
[PASS] test_AddLiquidity() (gas: 234567)
[PASS] test_RemoveLiquidity() (gas: 187432)
[PASS] test_SwapAforB() (gas: 156789)
[PASS] test_SwapBforA() (gas: 158234)
[PASS] test_GetPrice() (gas: 87654)
[PASS] test_SlippageProtection() (gas: 123456)
[PASS] test_GetPoolInfo() (gas: 98765)
[PASS] test_CompleteTradeScenario() (gas: 567890)
[PASS] testFuzz_SwapAmounts(uint256) (runs: 256, μ: 178432, ~: 178432)

Test result: ok. 9 passed; 0 failed; 0 skipped; finished in 2.34s
```

---

## 7. Deployment ke Monad Testnet

### Setup Wallet

```bash
# Import wallet dengan private key
cast wallet import deployer --private-key YOUR_PRIVATE_KEY

export PRIVATE_KEY=$(cast wallet private-key --account deployer)

# Atau generate wallet baru
cast wallet new

# Check address
cast wallet address --account deployer

# Check balance
cast balance $(cast wallet address --account deployer) --rpc-url https://testnet-rpc.monad.xyz/
```

### Get Test Tokens

1. **Visit Monad Faucet**: https://faucet.testnet.monad.xyz/
2. **Paste your address**
3. **Request MON tokens**
4. **Wait for transaction confirmation**

### Deploy Contracts

```bash
# Method 1: Using deployment script
forge script script/DeployDEX.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz \
  --account deployer \
  --broadcast

# Method 2: Deploy individually
forge create src/CampusCoin.sol:CampusCoin \
  --rpc-url https://testnet-rpc.monad.xyz \
  --account deployer

forge create src/MockUSDC.sol:MockUSDC \
  --rpc-url https://testnet-rpc.monad.xyz \
  --account deployer

forge create src/SimpleDEX.sol:SimpleDEX \
  --constructor-args $CAMP_ADDRESS $USDC_ADDRESS \
  --rpc-url https://testnet-rpc.monad.xyz \
  --account deployer
```

Expected output:
```
🚀 Deploying Simple DEX to Monad Testnet...

Deployer address: 0x742d35Cc6635C0532925a3b8D40168675c8C44e7
Network: Monad Testnet (Chain ID: 10143)
Deployer balance: 1.0 MON

📦 Step 1: Deploying tokens...
✅ CampusCoin deployed at: 0x1234567890123456789012345678901234567890
✅ MockUSDC deployed at: 0x2345678901234567890123456789012345678901

📦 Step 2: Deploying DEX...
✅ SimpleDEX deployed at: 0x3456789012345678901234567890123456789012

⚙️  Step 3: Setting up initial liquidity...
✅ Initial liquidity added: 44721359549995793928 LP tokens

🔍 Step 4: Deployment verification...
CampusCoin:
├── Name: Campus Coin
├── Symbol: CAMP
└── Total Supply: 106000 CAMP

MockUSDC:
├── Name: Mock USDC
├── Symbol: mUSDC
└── Total Supply: 1012000 USDC

SimpleDEX:
├── CAMP Reserve: 1000
├── USDC Reserve: 2000
├── Total Liquidity: 44721359549995794928
└── Current Price: 2 USDC per CAMP
```

### Verify Contracts

```bash
# 1. Verify CampusCoin
forge verify-contract \
  $CAMPUS_COIN_ADDRESS \
  src/CampusCoin.sol:CampusCoin \
  --chain $CHAIN_ID \
  --verifier sourcify \
  --verifier-url $VERIFIER_URL

# 2. Verify MockUSDC
forge verify-contract \
  $MOCK_USDC_ADDRESS \
  src/MockUSDC.sol:MockUSDC \
  --chain $CHAIN_ID \
  --verifier sourcify \
  --verifier-url $VERIFIER_URL

# 3. Verify SimpleDEX
forge verify-contract \
  $SIMPLE_DEX_ADDRESS \
  src/SimpleDEX.sol:SimpleDEX \
  --chain $CHAIN_ID \
  --verifier sourcify \
  --verifier-url $VERIFIER_URL \
  --constructor-args $(cast abi-encode "constructor(address,address)" $CAMPUS_COIN_ADDRESS $MOCK_USDC_ADDRESS)

# Or manually check deployment
cast call $CONTRACT_ADDRESS "name()" --rpc-url https://testnet-rpc.monad.xyz/
```

---

## 8. Interaksi dengan DEX

### Setup Environment Variables

```bash
# Set contract addresses (ganti dengan address hasil deployment)
export CAMP_TOKEN=0x1234567890123456789012345678901234567890
export USDC_TOKEN=0x2345678901234567890123456789012345678901
export DEX_CONTRACT=0x3456789012345678901234567890123456789012
export RPC_URL=https://testnet-rpc.monad.xyz/
```

### Basic Interactions

```bash
# Check token balances
cast call $CAMP_TOKEN "balanceOf(address)(uint256)" $(cast wallet address --account deployer) --rpc-url $RPC_URL | cast to-dec

cast call $USDC_TOKEN "balanceOf(address)(uint256)" $(cast wallet address --account deployer) --rpc-url $RPC_URL | cast to-dec

# Check DEX reserves (FIXED: Added return types)
cast call $DEX_CONTRACT "getPoolInfo()(uint256,uint256,uint256,uint256)" --rpc-url $RPC_URL

# Get current price (FIXED: Added return type)
cast call $DEX_CONTRACT "getPrice()(uint256)" --rpc-url $RPC_URL | cast to-dec
```

### Mint USDC Tokens

```bash
# owner can mint tokens:
cast send $USDC_TOKEN "mint(address,uint256)" $(cast wallet address --account deployer) 1000000000 \
  --account deployer \
  --rpc-url $RPC_URL
```

### Add Liquidity

```bash
# First approve tokens (CORRECT)
cast send $CAMP_TOKEN "approve(address,uint256)" $DEX_CONTRACT 1000000000000000000000 \
  --account deployer \
  --rpc-url $RPC_URL

cast send $USDC_TOKEN "approve(address,uint256)" $DEX_CONTRACT 2000000000 \
  --account deployer \
  --rpc-url $RPC_URL

# Add liquidity: 100 CAMP + 200 USDC (CORRECT)
cast send $DEX_CONTRACT "addLiquidity(uint256,uint256)" 100000000000000000000 200000000 \
  --account deployer \
  --rpc-url $RPC_URL

# Check LP tokens received (FIXED: Added return type)
cast call $DEX_CONTRACT "balanceOf(address)(uint256)" $(cast wallet address --account deployer) --rpc-url $RPC_URL | cast to-dec
```

### Perform Swaps

```bash
# Swap 10 CAMP for USDC
# First check expected output (FIXED: Added return type)
cast call $DEX_CONTRACT "getAmountOut(uint256,uint256,uint256)(uint256)" 10000000000000000000 1000000000000000000000 2000000000 --rpc-url $RPC_URL

# Perform swap (CORRECT)
cast send $DEX_CONTRACT "swapAforB(uint256,uint256)" 10000000000000000000 19000000 \
  --account deployer \
  --rpc-url $RPC_URL

# Swap 50 USDC for CAMP (FIXED: Added return type)
cast call $DEX_CONTRACT "getAmountOut(uint256,uint256,uint256)(uint256)" 50000000 2000000000 1000000000000000000000 --rpc-url $RPC_URL

cast send $DEX_CONTRACT "swapBforA(uint256,uint256)" 50000000 24000000000000000000 \
  --account deployer \
  --rpc-url $RPC_URL
```

## 9. Best Practices

### Smart Contract Security

#### 1. Access Control
```solidity
// ✅ GOOD: Proper access control
contract SecureDEX is Ownable {
    modifier onlyAuthorized() {
        require(msg.sender == owner() || authorized[msg.sender], "Not authorized");
        _;
    }
    
    function emergencyPause() external onlyAuthorized {
        _pause();
    }
}

// ❌ BAD: No access control
contract InsecureDEX {
    function emergencyPause() external {
        // Anyone can pause!
        _pause();
    }
}
```

#### 2. Reentrancy Protection
```solidity
// ✅ GOOD: Using ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeDEX is ReentrancyGuard {
    function swap() external nonReentrant {
        // Safe from reentrancy attacks
    }
}

// ❌ BAD: No reentrancy protection
contract UnsafeDEX {
    function swap() external {
        // Vulnerable to reentrancy
        token.transfer(msg.sender, amount);
        // External call here could re-enter
    }
}
```

#### 3. Input Validation
```solidity
// ✅ GOOD: Proper validation
function addLiquidity(uint256 amountA, uint256 amountB) external {
    require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");
    require(amountA <= MAX_AMOUNT, "Amount A too large");
    require(amountB <= MAX_AMOUNT, "Amount B too large");
    // Safe operations
}

// ❌ BAD: No validation
function addLiquidity(uint256 amountA, uint256 amountB) external {
    // No checks - dangerous!
    // Could cause overflow or unexpected behavior
}
```

### Gas Optimization Tips

#### 1. Use Events Instead of Storage for Logs
```solidity
// ✅ GOOD: Use events for historical data
event Swap(address indexed user, uint256 amountIn, uint256 amountOut);

function swap(uint256 amountIn) external {
    uint256 amountOut = calculateOutput(amountIn);
    // Process swap...
    emit Swap(msg.sender, amountIn, amountOut);
}

// ❌ BAD: Store everything in storage
mapping(uint256 => SwapRecord) public swapHistory; // Expensive!
```

#### 2. Pack Struct Variables
```solidity
// ✅ GOOD: Packed struct (saves gas)
struct PoolInfo {
    uint128 reserveA;    // 16 bytes
    uint128 reserveB;    // 16 bytes
    // Total: 32 bytes = 1 storage slot
}

// ❌ BAD: Unpacked struct
struct PoolInfo {
    uint256 reserveA;    // 32 bytes
    uint256 reserveB;    // 32 bytes
    // Total: 64 bytes = 2 storage slots
}
```

#### 3. Use Custom Errors
```solidity
// ✅ GOOD: Custom errors (cheaper)
error InsufficientLiquidity();
error SlippageTooHigh();

function swap() external {
    if (liquidity == 0) revert InsufficientLiquidity();
}

// ❌ BAD: String errors (expensive)
function swap() external {
    require(liquidity > 0, "Insufficient liquidity"); // Costs more gas
}
```

### Testing Best Practices

#### 1. Comprehensive Test Coverage
```bash
# Run coverage analysis
forge coverage

# Generate HTML report
forge coverage --report lcov
genhtml lcov.info -o coverage-report

# Target: >95% coverage for production contracts
```

#### 2. Fuzz Testing for Edge Cases
```solidity
// Test with random inputs
function testFuzz_SwapAmounts(uint256 amountIn) public {
    amountIn = bound(amountIn, 1, MAX_SWAP_AMOUNT);
    
    // Setup
    addInitialLiquidity();
    
    // Test
    uint256 amountOut = dex.getAmountOut(amountIn, reserveA, reserveB);
    
    // Assertions
    assertGt(amountOut, 0);
    assertLt(amountOut, reserveB); // Can't drain entire pool
}
```

#### 3. Integration Testing
```solidity
function test_CompleteUserJourney() public {
    // 1. User gets tokens
    usdc.faucet();
    campusCoin.mint(user, 1000 * 10**18);
    
    // 2. User adds liquidity
    vm.startPrank(user);
    campusCoin.approve(address(dex), type(uint256).max);
    usdc.approve(address(dex), type(uint256).max);
    
    uint256 liquidity = dex.addLiquidity(100 * 10**18, 200 * 10**6);
    
    // 3. User performs swaps
    dex.swapAforB(10 * 10**18, 0);
    dex.swapBforA(20 * 10**6, 0);
    
    // 4. User removes liquidity
    dex.removeLiquidity(liquidity / 2);
    
    vm.stopPrank();
    
    // Verify final state
    assertGt(campusCoin.balanceOf(user), 0);
    assertGt(usdc.balanceOf(user), 0);
}
```

### Production Deployment Checklist

#### Pre-Deployment
- [ ] All tests passing: `forge test`
- [ ] Gas usage analyzed: `forge test --gas-report`
- [ ] Code coverage >95%: `forge coverage`
- [ ] Security audit completed (for mainnet)
- [ ] Deployment script tested on testnet
- [ ] Contract verification planned
- [ ] Emergency procedures documented
- [ ] Access control verified
- [ ] Upgrade mechanism (if applicable) tested

#### Deployment
- [ ] Deploy to testnet first
- [ ] Verify all functions work correctly
- [ ] Add initial liquidity
- [ ] Test all user flows
- [ ] Monitor for 24-48 hours
- [ ] Deploy to mainnet
- [ ] Verify contracts on explorer
- [ ] Set up monitoring alerts
- [ ] Announce to community

#### Post-Deployment
- [ ] Update documentation
- [ ] Create user guides
- [ ] Set up analytics dashboard
- [ ] Monitor TVL and trading volume
- [ ] Regular security checks
- [ ] Community support channels
- [ ] Backup critical data

### Common Pitfalls dan Solutions

#### 1. Precision Loss
```solidity
// ❌ PROBLEM: Precision loss in calculations
function badCalculation(uint256 a, uint256 b) public pure returns (uint256) {
    return (a / b) * c; // Loss of precision!
}

// ✅ SOLUTION: Multiply before divide
function goodCalculation(uint256 a, uint256 b) public pure returns (uint256) {
    return (a * c) / b; // Better precision
}
```

#### 2. Front-Running Protection
```solidity
// ✅ GOOD: Slippage protection
function swapWithSlippage(uint256 amountIn, uint256 minAmountOut) external {
    uint256 amountOut = calculateOutput(amountIn);
    require(amountOut >= minAmountOut, "Slippage too high");
    // Execute swap
}

// ✅ GOOD: Deadline protection
modifier ensure(uint256 deadline) {
    require(block.timestamp <= deadline, "Transaction expired");
    _;
}
```

#### 3. Oracle Manipulation
```solidity
// ❌ VULNERABLE: Using spot price
function getPrice() external view returns (uint256) {
    return (reserveB * 1e18) / reserveA; // Can be manipulated!
}

// ✅ BETTER: Time-weighted average price (TWAP)
function getTWAP() external view returns (uint256) {
    // Implementation of TWAP logic
    // More resistant to manipulation
}
```

### Useful Tools dan Resources

#### Development Tools
```bash
# Foundry tools
forge --help          # Smart contract development
cast --help           # Blockchain interactions  
anvil --help          # Local blockchain

# Analysis tools
slither .              # Static analysis
mythril analyze        # Security analysis
```

#### Testing Tools
```bash
# Foundry testing
forge test -vvv                    # Verbose testing
forge test --gas-report           # Gas analysis
forge test --fuzz-runs 10000      # Extensive fuzzing
forge coverage                    # Coverage analysis

# Fork testing
forge test --fork-url $RPC_URL    # Test against mainnet state
```

#### Monitoring Tools
```javascript
// Web3 monitoring script
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz');

// Monitor events
const filter = {
    address: DEX_ADDRESS,
    topics: [
        ethers.id("Swap(address,uint256,uint256,uint256,uint256)")
    ]
};

provider.on(filter, (log) => {
    console.log('New swap detected:', log);
});
```

### Learning Resources

#### Documentation
- [Foundry Book](https://book.getfoundry.sh/) - Complete Foundry documentation
- [OpenZeppelin Docs](https://docs.openzeppelin.com/) - Security standards
- [Solidity Docs](https://docs.soliditylang.org/) - Language reference
- [Monad Docs](https://docs.monad.xyz/) - Monad-specific information

#### DeFi Learning
- [DeFi Pulse](https://defipulse.com/) - DeFi analytics and trends
- [Uniswap Docs](https://docs.uniswap.org/) - AMM reference implementation
- [Compound Docs](https://docs.compound.finance/) - Lending protocols
- [MakerDAO Docs](https://docs.makerdao.com/) - Stablecoin mechanisms

#### Security Resources
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [SWC Registry](https://swcregistry.io/) - Smart contract weaknesses
- [Rekt News](https://rekt.news/) - DeFi security incidents
- [Code4rena](https://code4rena.com/) - Security competitions

### Next Steps

#### Immediate Improvements
1. **Add Price Oracle**: Integrate Chainlink or similar for price feeds
2. **Implement Governance**: Add voting mechanism for protocol changes
3. **Create Staking**: Allow LP token staking for additional rewards
4. **Build Frontend**: Create user-friendly web interface

#### Advanced Features
1. **Multi-Asset Pools**: Support for 3+ token pools
2. **Flash Loans**: Implement uncollateralized loans
3. **Yield Farming**: Liquidity mining with token rewards
4. **Cross-Chain**: Bridge to other networks

#### Scaling Solutions
1. **Layer 2 Integration**: Deploy on Polygon, Arbitrum, etc.
2. **Gas Optimization**: Further reduce transaction costs
3. **Batch Operations**: Allow multiple actions in single transaction
4. **Meta-Transactions**: Gasless transactions for users

---

## Kesimpulan

🎉 **Selamat! Anda telah berhasil membangun Mini DEX dengan Foundry!**

### Yang Telah Dipelajari:
- ✅ **Smart Contract Development**: Membuat ERC-20 tokens dan DEX contract
- ✅ **AMM Implementation**: Automated Market Maker dengan formula x*y=k
- ✅ **Testing Framework**: Comprehensive testing dengan Foundry
- ✅ **Deployment Process**: Deploy ke Monad Testnet
- ✅ **Security Practices**: Access control, reentrancy protection, input validation
- ✅ **Gas Optimization**: Efficient contract design
- ✅ **DeFi Concepts**: Liquidity pools, swaps, slippage protection

### Key Features yang Dibangun:
| Feature | Description |
|---------|-------------|
| **Token Contracts** | CampusCoin (CAMP) dan MockUSDC untuk trading pair |
| **Liquidity Pools** | Add/remove liquidity dengan LP token rewards |
| **Token Swaps** | Swap CAMP ↔ USDC dengan slippage protection |
| **AMM Formula** | Constant product formula (x*y=k) |
| **Fee Mechanism** | 0.3% trading fee untuk sustainability |
| **Security Features** | Reentrancy protection, access control, input validation |

### Architecture Overview:
```
┌─────────────────┐    ┌─────────────────┐
│   CampusCoin    │    │    MockUSDC     │
│   (ERC-20)      │    │   (ERC-20)      │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │   SimpleDEX     │
         │   (AMM Pool)    │
         │                 │
         │  Features:      │
         │  • Add Liquidity│
         │  • Remove Liq.  │
         │  • Swap Tokens  │
         │  • Price Oracle │
         └─────────────────┘
```

### Gas Usage Summary:
| Function | Estimated Gas | Description |
|----------|---------------|-------------|
| `addLiquidity()` | ~150,000 | Add tokens to pool |
| `removeLiquidity()` | ~120,000 | Remove tokens from pool |
| `swapAforB()` | ~100,000 | Swap CAMP for USDC |
| `swapBforA()` | ~100,000 | Swap USDC for CAMP |
| `getAmountOut()` | ~5,000 | Calculate swap output |

### Development Best Practices Implemented:
- 🔒 **Security First**: ReentrancyGuard, access control, input validation
- ⛽ **Gas Efficient**: Optimized storage layout, custom errors
- 🧪 **Well Tested**: Unit tests, integration tests, fuzz testing
- 📚 **Well Documented**: Clear code comments dan documentation
- 🔄 **Modular Design**: Reusable components dan interfaces

### Real-World Applications:
1. **Campus Ecosystem**: Internal token economy untuk universitas
2. **Local Communities**: Community currency dengan USDC backing
3. **Educational Tool**: Learning DeFi concepts secara praktis
4. **Prototype Development**: Foundation untuk DEX yang lebih kompleks

### Next Learning Path:
1. **Advanced DeFi**: Lending protocols, yield farming, governance tokens
2. **Cross-Chain**: Multi-chain deployment dan bridge protocols
3. **MEV Protection**: Flashloan protection, sandwich attack prevention
4. **Scalability**: Layer 2 solutions, state channels
5. **User Experience**: Frontend development dengan React/Next.js

### Community dan Support:
- **Monad Discord**: Join komunitas developer
- **GitHub**: Share your code dan contribute
- **Twitter**: Follow DeFi developments
- **Documentation**: Maintain good docs untuk project Anda

### Final Tips:
- 🚀 **Start Simple**: Master basics before advanced features
- 🔐 **Security Always**: Never skip security considerations
- 🧪 **Test Everything**: Comprehensive testing saves money
- 📖 **Keep Learning**: DeFi space evolves rapidly
- 🤝 **Join Community**: Learn dari other developers

**Congratulations on building your first DeFi protocol! The future of finance is programmable, and you now have the skills to shape it.** 🌟

---

*"The best way to predict the future is to build it."* - Alan Kay

Ready untuk next challenge? Consider building:
- Multi-asset liquidity pools
- Lending/borrowing protocols  
- Yield farming mechanisms
- Cross-chain bridges
- Governance systems

Keep building amazing things! 🚀✨