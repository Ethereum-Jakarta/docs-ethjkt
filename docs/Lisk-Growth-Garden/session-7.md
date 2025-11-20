# Session 7 – Flowing Rivers: DeFi & Automated Market Makers

**Session Date**: November 5, 2025 | 19:30 - 21:00 (GMT+7)

Learn DeFi fundamentals by building a complete decentralized exchange with automated market making, liquidity pools, and token swaps.

**By**: ETH JKT

---

## Learning Path

```
Understanding DeFi & DEX Basics
    ↓
What is an AMM? (Uniswap Model)
    ↓
Token Standards Review (ERC-20)
    ↓
Build Mock Tokens (SEED & USDC)
    ↓
SimpleDEX Core: Liquidity Pools
    ↓
SimpleDEX Core: Token Swaps
    ↓
Testing & Deployment
    ↓
Frontend Integration (Bonus)
```

---

## Prerequisites

✅ **Knowledge Requirements**:
- [x] Solidity basics (functions, modifiers, events)
- [x] Understanding of ERC-20 tokens
- [x] Basic math concepts (multiplication, division, square root)
- [x] Optional: Completed Session 5 (for SEED token context)

✅ **Technical Requirements**:
- [x] Remix IDE or Hardhat environment
- [x] MetaMask with Lisk Sepolia ETH
- [x] Basic understanding of DeFi concepts

---

## Part 1: Understanding Decentralized Exchanges

### What is a DEX?

**DEX = Decentralized Exchange** - A platform for trading tokens without intermediaries

**Traditional Exchange (CEX) vs DEX**:

| Centralized Exchange (CEX) | Decentralized Exchange (DEX) |
|---------------------------|------------------------------|
| ❌ Custodial (they hold your funds) | ✅ Non-custodial (you control funds) |
| ❌ Order book matching | ✅ Automated market making |
| ❌ KYC required | ✅ Permissionless |
| ❌ Single point of failure | ✅ Trustless smart contracts |
| ✅ Fast execution | ⚠️ Gas fees per trade |
| Examples: Coinbase, Binance | Examples: Uniswap, SushiSwap |

### What is an AMM?

**AMM = Automated Market Maker** - An algorithm that automatically sets prices based on supply and demand

**Traditional Order Book**:
```
Sell Orders:
1 ETH @ $2000
1 ETH @ $1999
1 ETH @ $1998

Buy Orders:
1 ETH @ $1997
1 ETH @ $1996
```

**AMM Model**:
```
Liquidity Pool:
- 1000 ETH
- 2,000,000 USDC
- Price = USDC / ETH = $2000 per ETH
- No order matching needed!
```

### The Constant Product Formula

**Formula**: `x * y = k`

Where:
- `x` = Reserve of token A
- `y` = Reserve of token B
- `k` = Constant (never changes)

**Example**:
```
Pool: 100 SEED × 100 USDC = 10,000 (k)

Someone swaps 10 SEED for USDC:
- New SEED reserve: 110
- To maintain k: 110 × y = 10,000
- New USDC reserve: y = 90.91
- User gets: 100 - 90.91 = 9.09 USDC

Price impact: 10 SEED → 9.09 USDC (0.909 USDC per SEED)
Original price: 1 SEED = 1 USDC
Slippage: ~9% (because swap size is 10% of pool)
```

**Key Insight**: Large trades relative to pool size = more slippage!

---

## Part 2: Token Setup - Mock USDC

Before building the DEX, we need tokens to trade. We'll create a mock USDC for testing.

### Understanding USDC

**Real USDC**:
- Stablecoin pegged to $1 USD
- **6 decimals** (not 18 like ETH!)
- Most traded token on Ethereum
- Issued by Circle

### Step 1: Create MockUSDC

Create `MockUSDC.sol`:

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

**Explanation:**

**Why 6 decimals?**
- Real USDC uses 6 decimals for efficiency
- 1 USDC = 1,000,000 (in smallest units)
- Compare to ETH: 1 ETH = 1,000,000,000,000,000,000 (18 decimals)
- Fewer decimals = lower gas costs

**Constructor**:
- Sets name "Mock USDC" and symbol "USDC"
- Mints 1,000,000 USDC to deployer
- Makes deployer the owner

**Functions**:
- `decimals()` - Override to return 6 (default is 18)
- `mint()` - Owner can create more USDC (for testing)
- `burn()` - Anyone can burn their own tokens

**Try it:**
1. Deploy MockUSDC
2. Call `balanceOf(your_address)` → Returns 1,000,000,000,000 (1M USDC)
3. Call `decimals()` → Returns 6
4. Call `symbol()` → Returns "USDC"

---

## Part 3: SimpleDEX - Liquidity Pool Core

Now we'll build the heart of our DEX: the liquidity pool mechanism.

### Understanding Liquidity Pools

**What are Liquidity Providers (LPs)?**
- Users who deposit tokens into the pool
- They earn trading fees (0.3% per swap)
- They receive LP tokens representing their share

**Example**:
```
Pool is empty:
- Alice deposits: 1000 SEED + 1000 USDC
- Alice receives: 1000 LP tokens (100% of pool)

Bob adds liquidity:
- Bob deposits: 500 SEED + 500 USDC
- Bob receives: 500 LP tokens (33% of pool)

Total pool: 1500 SEED + 1500 USDC
Alice owns: 67% (1000/1500 LP tokens)
Bob owns: 33% (500/1500 LP tokens)
```

### Step 1: Basic DEX Structure

Create `SimpleDEX.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleDEX
 * @dev Simple mini DEX with AMM (Automated Market Maker)
 * Uses the x * y = k formula (constant product)
 */
contract SimpleDEX is ERC20, ReentrancyGuard, Ownable {
    // Tokens being traded
    IERC20 public immutable tokenA; // SEED Token
    IERC20 public immutable tokenB; // Mock USDC

    // Reserves (token reserve in pool)
    uint256 public reserveA;
    uint256 public reserveB;

    // Fee for each swap (0.3%)
    uint256 public constant FEE_PERCENT = 3;      // 0.3%
    uint256 public constant FEE_DENOMINATOR = 1000; // 100%

    // Minimum liquidity to prevent division by zero
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

    // We'll add functions here next...
}
```

**Explanation:**

**Inheritance**:
- `ERC20` - LP tokens are ERC-20 tokens themselves!
- `ReentrancyGuard` - Prevents reentrancy attacks
- `Ownable` - Only owner can perform certain actions

**State Variables**:
- `tokenA/tokenB` - The two tokens in the pool (immutable = can't change)
- `reserveA/reserveB` - How many tokens are in the pool right now
- `FEE_PERCENT` - 3/1000 = 0.3% fee on each swap
- `MINIMUM_LIQUIDITY` - Tiny amount locked forever (prevents attacks)

**Events**:
- `LiquidityAdded` - Someone added tokens to pool
- `LiquidityRemoved` - Someone withdrew from pool
- `Swap` - Someone traded tokens

**Constructor**:
- Creates LP token with name "SimpleDEX LP" and symbol "SDEX-LP"
- Validates token addresses (can't be same or zero)
- Stores the token addresses

### Step 2: Add Liquidity Function

Add this function to SimpleDEX:

```solidity
    /**
     * @dev Add liquidity to pool
     * @param amountA Amount of token A to be added
     * @param amountB Amount of token B to be added
     * @return liquidity Amount of LP tokens received
     */
    function addLiquidity(uint256 amountA, uint256 amountB)
        external
        nonReentrant
        returns (uint256 liquidity)
    {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        // Transfer tokens from user
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        uint256 totalLiquidity = totalSupply();

        if (totalLiquidity == 0) {
            // First pool - set initial price
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(0xdead), MINIMUM_LIQUIDITY); // Lock minimum liquidity to dead address
        } else {
            // Pool already exists - maintain price ratio
            liquidity = min(
                (amountA * totalLiquidity) / reserveA,
                (amountB * totalLiquidity) / reserveB
            );
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        // Mint LP tokens to user
        _mint(msg.sender, liquidity);

        // Update reserves
        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidity);
    }
```

**Explanation:**

**Step-by-Step Flow**:

1. **Validate amounts**: Both must be > 0
2. **Transfer tokens**: Use `transferFrom` (requires prior approval!)
3. **Calculate liquidity**:
   - **First time**: `sqrt(amountA * amountB)` - geometric mean
   - **After**: Proportional to existing pool
4. **Mint LP tokens**: User gets tokens representing their share
5. **Update reserves**: Track new pool balances
6. **Emit event**: Log what happened

**First Liquidity Provider**:
```
User deposits: 1000 SEED × 1000 USDC
liquidity = sqrt(1000 × 1000) = sqrt(1,000,000) = 1000
Minimum locked: 0.001 LP tokens
User receives: 999.999 LP tokens
```

**Second Liquidity Provider** (pool has 1000:1000):
```
User wants to add: 500 SEED × 500 USDC
Total LP supply: 1000

Option A: (500 × 1000) / 1000 = 500 LP tokens
Option B: (500 × 1000) / 1000 = 500 LP tokens
User receives: min(500, 500) = 500 LP tokens
```

**Why minimum liquidity?**
- Prevents first LP from manipulating pool
- 1000 wei = 0.000000000000001 tokens
- Locked to dead address = gone forever
- Tiny cost for first LP, huge security benefit

### Step 3: Remove Liquidity Function

```solidity
    /**
     * @dev Remove liquidity from pool
     * @param liquidity Amount of LP tokens to burn
     * @return amountA Amount of token A received
     * @return amountB Amount of token B received
     */
    function removeLiquidity(uint256 liquidity)
        external
        nonReentrant
        returns (uint256 amountA, uint256 amountB)
    {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");

        uint256 totalLiquidity = totalSupply();

        // Calculate token amounts based on proportion
        amountA = (liquidity * reserveA) / totalLiquidity;
        amountB = (liquidity * reserveB) / totalLiquidity;

        require(amountA > 0 && amountB > 0, "Insufficient liquidity burned");

        // Burn LP tokens
        _burn(msg.sender, liquidity);

        // Transfer tokens to user
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        // Update reserves
        reserveA -= amountA;
        reserveB -= amountB;

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidity);
    }
```

**Explanation:**

**How it works**:
```
Pool: 1000 SEED + 1000 USDC
Total LP tokens: 1000
Alice has: 500 LP tokens (50% of pool)

Alice burns 500 LP tokens:
- amountA = (500 × 1000) / 1000 = 500 SEED
- amountB = (500 × 1000) / 1000 = 500 USDC
- Alice gets back 50% of pool!
```

**Proportional Withdrawal**:
- You always get the same % of each token
- Can't choose which token to receive
- Protects pool from being drained of one token

---

## Part 4: SimpleDEX - Token Swaps

Now let's add the swap functionality!

### Understanding Token Swaps

**The Math Behind Swaps**:
```
Before: 100 SEED × 100 USDC = 10,000 (k)
User swaps 10 SEED for USDC

Step 1: Add 10 SEED to pool
New SEED: 110

Step 2: Calculate new USDC to maintain k
110 × y = 10,000
y = 90.91 USDC

Step 3: User receives difference
User gets: 100 - 90.91 = 9.09 USDC

Step 4: Apply 0.3% fee
Actual received: 9.09 × 0.997 = 9.06 USDC
```

### Step 1: Calculate Output Amount

```solidity
    /**
     * @dev Calculate output amount for swap (with fee)
     * @param amountIn Input token amount
     * @param reserveIn Input token reserve
     * @param reserveOut Output token reserve
     * @return amountOut Output token amount after fee
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
```

**Explanation:**

**Fee Calculation**:
```
Input: 10 SEED
Fee: 0.3% = 3/1000

amountInWithFee = 10 × (1000 - 3) = 10 × 997 = 9,970

With reserves of 100 SEED and 100 USDC:
numerator = 9,970 × 100 = 997,000
denominator = (100 × 1000) + 9,970 = 109,970
amountOut = 997,000 / 109,970 ≈ 9.06 USDC
```

**Why this formula?**
- Maintains constant product: `x * y = k`
- Applies fee before calculation
- Prevents front-running attacks
- More gas efficient than separate steps

### Step 2: Swap Token A for Token B

```solidity
    /**
     * @dev Swap token A for token B
     * @param amountAIn Amount of token A to swap
     * @param minAmountBOut Minimum token B expected (slippage protection)
     */
    function swapAforB(uint256 amountAIn, uint256 minAmountBOut)
        external
        nonReentrant
    {
        require(amountAIn > 0, "Amount must be greater than 0");
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");

        // Calculate output amount using AMM formula
        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);
        require(amountBOut >= minAmountBOut, "Slippage too high");

        // Transfer input token from user
        tokenA.transferFrom(msg.sender, address(this), amountAIn);

        // Transfer output token to user
        tokenB.transfer(msg.sender, amountBOut);

        // Update reserves
        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit Swap(msg.sender, amountAIn, 0, 0, amountBOut);
    }
```

**Explanation:**

**Slippage Protection**:
```
User wants to swap 10 SEED
getAmountOut() calculates: 9.06 USDC

User sets minAmountBOut = 9.0 USDC
✅ 9.06 >= 9.0 → Swap succeeds

If someone front-runs and price changes:
New calculation: 8.5 USDC
❌ 8.5 < 9.0 → Transaction reverts!
```

**Flow**:
1. Calculate expected output
2. Check slippage tolerance
3. Take input tokens from user
4. Send output tokens to user
5. Update pool reserves
6. Emit event for transparency

### Step 3: Swap Token B for Token A

```solidity
    /**
     * @dev Swap token B for token A
     * @param amountBIn Amount of token B to swap
     * @param minAmountAOut Minimum token A expected
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

        // Transfer input token from user
        tokenB.transferFrom(msg.sender, address(this), amountBIn);

        // Transfer output token to user
        tokenA.transfer(msg.sender, amountAOut);

        // Update reserves
        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit Swap(msg.sender, 0, amountBIn, amountAOut, 0);
    }
```

**Same logic, reversed direction!**

---

## Part 5: View Functions & Utilities

Add helper functions for users and UIs:

```solidity
    /**
     * @dev Get current price (token B per token A)
     */
    function getPrice() external view returns (uint256) {
        require(reserveA > 0, "No liquidity");
        // Price with 18 decimals for precision
        return (reserveB * 1e18) / reserveA;
    }

    /**
     * @dev Get pool info for UI
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
```

**Explanation:**

**getPrice()**:
- Returns USDC per SEED (with 18 decimals for precision)
- Example: If 1 SEED = 2 USDC, returns 2000000000000000000

**getPoolInfo()**:
- Returns all important data in one call
- Gas efficient for frontends
- Shows reserves, LP supply, and current price

**sqrt()**:
- Babylonian method for square root
- Used in first liquidity calculation
- Pure function = no state changes

---

## Part 6: Complete SimpleDEX Contract

Here's the full contract with everything together:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleDEX
 * @dev Simple mini DEX with AMM (Automated Market Maker)
 * Uses the x * y = k formula (constant product)
 */
contract SimpleDEX is ERC20, ReentrancyGuard, Ownable {
    // Tokens being traded
    IERC20 public immutable tokenA; // SEED Token
    IERC20 public immutable tokenB; // Mock USDC

    // Reserves (token reserve in pool)
    uint256 public reserveA;
    uint256 public reserveB;

    // Fee for each swap (0.3%)
    uint256 public constant FEE_PERCENT = 3;      // 0.3%
    uint256 public constant FEE_DENOMINATOR = 1000; // 100%

    // Minimum liquidity to prevent division by zero
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
     * @dev Add liquidity to pool
     * @param amountA Amount of token A to be added
     * @param amountB Amount of token B to be added
     * @return liquidity Amount of LP tokens received
     */
    function addLiquidity(uint256 amountA, uint256 amountB)
        external
        nonReentrant
        returns (uint256 liquidity)
    {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        // Transfer tokens from user
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        uint256 totalLiquidity = totalSupply();

        if (totalLiquidity == 0) {
            // First pool - set initial price
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(0xdead), MINIMUM_LIQUIDITY); // Lock minimum liquidity to dead address
        } else {
            // Pool already exists - maintain price ratio
            liquidity = min(
                (amountA * totalLiquidity) / reserveA,
                (amountB * totalLiquidity) / reserveB
            );
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        // Mint LP tokens to user
        _mint(msg.sender, liquidity);

        // Update reserves
        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @dev Remove liquidity from pool
     * @param liquidity Amount of LP tokens to burn
     * @return amountA Amount of token A received
     * @return amountB Amount of token B received
     */
    function removeLiquidity(uint256 liquidity)
        external
        nonReentrant
        returns (uint256 amountA, uint256 amountB)
    {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");

        uint256 totalLiquidity = totalSupply();

        // Calculate token amounts based on proportion
        amountA = (liquidity * reserveA) / totalLiquidity;
        amountB = (liquidity * reserveB) / totalLiquidity;

        require(amountA > 0 && amountB > 0, "Insufficient liquidity burned");

        // Burn LP tokens
        _burn(msg.sender, liquidity);

        // Transfer tokens to user
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        // Update reserves
        reserveA -= amountA;
        reserveB -= amountB;

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @dev Swap token A for token B
     * @param amountAIn Amount of token A to swap
     * @param minAmountBOut Minimum token B expected (slippage protection)
     */
    function swapAforB(uint256 amountAIn, uint256 minAmountBOut)
        external
        nonReentrant
    {
        require(amountAIn > 0, "Amount must be greater than 0");
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");

        // Calculate output amount using AMM formula
        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);
        require(amountBOut >= minAmountBOut, "Slippage too high");

        // Transfer input token from user
        tokenA.transferFrom(msg.sender, address(this), amountAIn);

        // Transfer output token to user
        tokenB.transfer(msg.sender, amountBOut);

        // Update reserves
        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit Swap(msg.sender, amountAIn, 0, 0, amountBOut);
    }

    /**
     * @dev Swap token B for token A
     * @param amountBIn Amount of token B to swap
     * @param minAmountAOut Minimum token A expected
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

        // Transfer input token from user
        tokenB.transferFrom(msg.sender, address(this), amountBIn);

        // Transfer output token to user
        tokenA.transfer(msg.sender, amountAOut);

        // Update reserves
        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit Swap(msg.sender, 0, amountBIn, amountAOut, 0);
    }

    /**
     * @dev Calculate output amount for swap (with fee)
     * @param amountIn Input token amount
     * @param reserveIn Input token reserve
     * @param reserveOut Output token reserve
     * @return amountOut Output token amount after fee
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
        // Price with 18 decimals for precision
        return (reserveB * 1e18) / reserveA;
    }

    /**
     * @dev Get pool info for UI
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

## Part 7: Deployment & Testing

### Deployment Order

**Deploy in this exact order:**

1. **Deploy SEED Token** (from session-5.md):
   ```solidity
   // If you have it from Session 5, use that address
   // Otherwise deploy SeedToken.sol first
   ```

2. **Deploy MockUSDC**:
   ```
   - No constructor parameters needed
   - Copy deployed address
   ```

3. **Deploy SimpleDEX**:
   ```
   Constructor parameters:
   _tokenA: <SEED_TOKEN_ADDRESS>
   _tokenB: <USDC_TOKEN_ADDRESS>
   ```

### Testing in Remix

**Test 1: Add First Liquidity**

```javascript
// 1. On SEED Token:
approve(dexAddress, 1000000000000000000000) // 1000 SEED

// 2. On MockUSDC:
approve(dexAddress, 1000000000) // 1000 USDC

// 3. On SimpleDEX:
addLiquidity(
  1000000000000000000000,  // 1000 SEED
  1000000000               // 1000 USDC
)

// 4. Check pool:
getPoolInfo()
// Should show:
// reserveA: 1000000000000000000000
// reserveB: 1000000000
// totalLiquidity: ~999999000000000000000

// 5. Check your LP tokens:
balanceOf(yourAddress)
// Should show: ~999999000000000000000 (999.999 LP tokens)
```

**Test 2: Swap SEED for USDC**

```javascript
// 1. Check price before:
getPrice() // Returns ~1000000 (1 USDC per SEED)

// 2. Calculate expected output:
getAmountOut(
  10000000000000000000,  // 10 SEED
  1000000000000000000000, // reserveA
  1000000000              // reserveB
)
// Returns: ~9940358 (9.94 USDC)

// 3. Approve and swap:
// On SEED Token:
approve(dexAddress, 10000000000000000000) // 10 SEED

// On SimpleDEX:
swapAforB(
  10000000000000000000,  // 10 SEED
  9000000                 // min 9 USDC (allow 1 USDC slippage)
)

// 4. Check reserves changed:
getPoolInfo()
// reserveA increased (more SEED)
// reserveB decreased (less USDC)
// Price changed!
```

**Test 3: Swap USDC for SEED**

```javascript
// On MockUSDC:
approve(dexAddress, 10000000) // 10 USDC

// On SimpleDEX:
swapBforA(
  10000000,               // 10 USDC
  9000000000000000000    // min 9 SEED
)
```

**Test 4: Remove Liquidity**

```javascript
// On SimpleDEX:
removeLiquidity(100000000000000000000) // Remove 100 LP tokens

// Check you got both tokens back proportionally
// Check on SEED:
balanceOf(yourAddress) // Increased!

// Check on USDC:
balanceOf(yourAddress) // Increased!
```

---

## Part 8: Understanding Price Impact & Slippage

### Price Impact Demonstration

Let's see how trade size affects price:

**Initial Pool**: 1000 SEED × 1000 USDC = 1,000,000

| Trade Size | USDC Received | Price Per SEED | Price Impact |
|-----------|---------------|----------------|--------------|
| 1 SEED | 0.9970 USDC | 0.9970 | 0.30% |
| 10 SEED | 9.9403 USDC | 0.9940 | 0.60% |
| 50 SEED | 47.6190 USDC | 0.9524 | 4.76% |
| 100 SEED | 90.7029 USDC | 0.9070 | 9.30% |
| 500 SEED | 332.2259 USDC | 0.6645 | 33.55% |

**Key Insights**:
- Larger trades = worse price
- Price impact grows non-linearly
- 0.3% fee + price impact = total cost

### Calculating Slippage Tolerance

```javascript
// Want to swap 10 SEED
expectedOutput = getAmountOut(10 * 10^18, reserveA, reserveB)
// Returns: 9.94 USDC

// 1% slippage tolerance:
minOutput = expectedOutput * 0.99
// = 9.84 USDC

// 5% slippage tolerance:
minOutput = expectedOutput * 0.95
// = 9.44 USDC

// Pass minOutput to swap function
swapAforB(10 * 10^18, minOutput)
```

---

## Part 9: Advanced Concepts

### Impermanent Loss

**What is it?**
- Loss compared to just holding tokens
- Happens when price ratio changes
- Permanent only when you withdraw

**Example**:
```
You deposit: 1 ETH + 1000 USDC (1 ETH = $1000)
Pool value: $2000
You own: 100% of pool

ETH price doubles to $2000:
- Arbitrageurs rebalance pool
- New ratio: 0.707 ETH + 1414 USDC
- Pool value: $2828
- Your value: $2828

If you just held:
- 1 ETH = $2000
- 1000 USDC = $1000
- Total: $3000

Impermanent Loss: $3000 - $2828 = $172 (5.7%)
```

**Mitigation**:
- Choose correlated pairs (ETH/WETH, USDC/DAI)
- Trading fees compensate over time
- Higher volume pools = more fees

### Arbitrage Opportunities

**How prices stay in sync**:

```
Uniswap: 1 ETH = 1800 USDC
Binance: 1 ETH = 2000 USDC

Arbitrageur:
1. Buy 1 ETH on Uniswap for 1800 USDC
2. Sell 1 ETH on Binance for 2000 USDC
3. Profit: 200 USDC (minus fees)

Result:
- Uniswap price increases (bought ETH)
- Prices converge
- Pool stays balanced
```

### Flash Swaps (Advanced)

Flash swaps let you borrow tokens, use them, and pay back in same transaction.

**Not included in SimpleDEX, but possible to add:**
```solidity
function flashSwap(
    uint256 amount,
    address borrower,
    bytes calldata data
) external {
    // Send tokens first
    tokenA.transfer(borrower, amount);

    // Callback to borrower
    IFlashSwapCallback(borrower).callback(amount, data);

    // Check they paid back with fee
    require(tokenA.balanceOf(address(this)) >= originalBalance + fee);
}
```

---

## Student Challenges 🏆

### Challenge 1: Multi-Hop Swaps (Intermediate)

**Goal**: Swap SEED → USDC → DAI in one transaction

Create `MultiHopRouter.sol`:
```solidity
contract MultiHopRouter {
    function swapThroughPath(
        address[] memory pools,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256 finalAmount) {
        // TODO: Execute swaps through multiple pools
        // Calculate optimal route
        // Handle approvals
        // Return final amount
    }
}
```

**Bonus**: Calculate the optimal path automatically!

---

### Challenge 2: Limit Orders (Advanced)

**Goal**: Add limit order functionality to DEX

```solidity
contract LimitOrderBook {
    struct Order {
        address trader;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        uint256 expiry;
    }

    // Place limit order
    function placeLimitOrder(...) external;

    // Execute order when price matches
    function executeOrder(uint256 orderId) external;

    // Cancel unfilled order
    function cancelOrder(uint256 orderId) external;
}
```

**Hint**: Use Chainlink Automation to monitor and execute orders!

---

### Challenge 3: Concentrated Liquidity (Expert)

**Goal**: Implement Uniswap V3 style concentrated liquidity

Instead of full range (0 to ∞), let LPs choose price ranges:

```solidity
function addLiquidityInRange(
    uint256 amountA,
    uint256 amountB,
    uint256 priceLower,  // Start of range
    uint256 priceUpper   // End of range
) external returns (uint256 liquidity);
```

**Benefits**:
- 100x more capital efficient
- LPs earn more fees in their range
- More complex to manage

---

### Challenge 4: Fee Tiers (Intermediate)

**Goal**: Different fee tiers for different pools

```solidity
contract SimpleDEXv2 {
    uint256 public feeTier; // 1 = 0.01%, 5 = 0.05%, 30 = 0.3%

    constructor(
        address _tokenA,
        address _tokenB,
        uint256 _feeTier
    ) {
        // Set custom fee tier
    }
}
```

**Create multiple pools**:
- SEED/USDC (0.01%) - Stablecoin pairs
- SEED/ETH (0.3%) - Standard pairs
- SEED/SHITCOIN (1%) - High volatility pairs

---

### Challenge 5: LP Staking Rewards (Advanced)

**Goal**: Reward LPs with bonus SEED tokens

```solidity
contract LPStaking {
    // Stake LP tokens
    function stake(uint256 lpAmount) external;

    // Calculate rewards based on time staked
    function calculateRewards(address user) external view returns (uint256);

    // Claim rewards
    function claimRewards() external;

    // Unstake LP tokens
    function unstake(uint256 lpAmount) external;
}
```

**Reward calculation**:
```
Reward per block = 10 SEED
User's share = (user's staked LP / total staked LP)
User rewards = User's share × blocks staked × reward per block
```

---

### Challenge 6: Price Oracle (Intermediate)

**Goal**: Create TWAP (Time Weighted Average Price) oracle

```solidity
contract PriceOracle {
    struct Observation {
        uint256 timestamp;
        uint256 price0Cumulative;
        uint256 price1Cumulative;
    }

    Observation[] public observations;

    // Record price every block
    function updateOracle() external;

    // Get TWAP over period
    function getTWAP(uint256 periodInSeconds)
        external
        view
        returns (uint256);
}
```

**Why TWAP?**
- Resistant to flash loan attacks
- More reliable than spot price
- Used by other DeFi protocols

---

## Part 10: Frontend Integration with Panna SDK

### Clone the Complete Project

Instead of building from scratch, clone the complete monorepo with frontend already built:

```bash
# Clone the repository
git clone https://github.com/Ethereum-Jakarta/lisk-garden-swap-mono.git
cd lisk-garden-swap-mono

# Install dependencies
bun install

# Deploy your contracts first (Part 9)
cd packages/contract
# ... deploy SimpleDEX, SEED, USDC tokens ...

# Configure frontend
cd ../frontend
cp .env.example .env
```

### Configure Environment Variables

Edit `.env` with your deployed contract addresses:

```bash
VITE_PANNA_CLIENT_ID=your_panna_client_id
VITE_PANNA_PARTNER_ID=your_panna_partner_id
VITE_SIMPLEDEX_ADDRESS=0x... # Your deployed DEX address
VITE_SEED_TOKEN_ADDRESS=0x... # Your SEED token address
VITE_USDC_TOKEN_ADDRESS=0x... # Your USDC token address
```

**Get Panna SDK credentials** from [Panna Dashboard](https://panna.xyz)

### Frontend Technology Stack

The frontend uses modern Web3 technologies:
- **Panna SDK**: Account abstraction wallet for seamless UX
- **Thirdweb**: Contract interactions
- **React + Vite**: Fast development with TypeScript
- **Tailwind CSS v4**: Garden-themed styling
- **Lucide Icons**: Beautiful UI icons

### Understanding the Frontend Structure

```
packages/frontend/
├── src/
│   ├── components/
│   │   ├── Providers.tsx          # Panna SDK wrapper
│   │   ├── Header.tsx             # Wallet connection UI
│   │   ├── TokenIcons.tsx         # SVG icons for tokens
│   │   ├── SwapInterface.tsx      # Token swap interface
│   │   └── LiquidityInterface.tsx # Liquidity management
│   ├── hooks/
│   │   └── useContract.ts         # Contract connection hook
│   ├── lib/
│   │   └── contract.ts            # Contract interaction functions
│   ├── App.tsx                    # Main app with tabs
│   └── index.css                  # Garden theme styles
└── .env                           # Configuration
```

### Key Implementation Details

**Panna SDK Integration** (`useContract.ts`):
```typescript
import { useActiveAccount, usePanna } from 'panna-sdk';

export function useContract() {
  const activeAccount = useActiveAccount();
  const { client } = usePanna();

  return {
    client: client || null,
    account: activeAccount || null,
    isConnected: !!activeAccount && !!client,
    address: activeAccount?.address || null,
    dexAddress: import.meta.env.VITE_SIMPLEDEX_ADDRESS,
    seedTokenAddress: import.meta.env.VITE_SEED_TOKEN_ADDRESS,
    usdcTokenAddress: import.meta.env.VITE_USDC_TOKEN_ADDRESS,
  };
}
```

**Contract Interactions** (`lib/contract.ts`):
```typescript
import { prepareContractCall, sendTransaction, readContract } from 'thirdweb/transaction';

// Read pool data
export async function getPoolInfo(client: any, dexAddress: string) {
  const contract = getContract({ client, chain: liskSepolia, address: dexAddress });
  const result = await readContract({
    contract,
    method: 'function getPoolInfo() view returns (uint256, uint256, uint256, uint256)',
    params: [],
  });
  return {
    reserveA: BigInt(result[0]),
    reserveB: BigInt(result[1]),
    totalLiquidity: BigInt(result[2]),
    price: BigInt(result[3]),
  };
}

// Execute swap
export async function swapAforB(client: any, account: any, dexAddress: string, amountIn: bigint, minOut: bigint) {
  const tx = prepareContractCall({
    contract: getContract({ client, chain: liskSepolia, address: dexAddress }),
    method: 'function swapAforB(uint256 amountAIn, uint256 minAmountBOut) external',
    params: [amountIn, minOut],
  });
  const result = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(result);
  return result;
}
```

**Debounced Calculations** (SwapInterface):
```typescript
// Prevent lag from rapid typing
useEffect(() => {
  if (!amountIn || !poolInfo) {
    setAmountOut('');
    return;
  }

  let cancelled = false;

  const timeoutId = setTimeout(async () => {
    const output = await getAmountOut(client, dexAddress, input, reserveIn, reserveOut);
    if (!cancelled) {
      setAmountOut((Number(output) / decimals).toFixed(6));
    }
  }, 300);

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
}, [amountIn, direction, poolInfo]);
```

**Features Implemented**:

✅ **Swap Interface**:
- Token swap with direction toggle
- Real-time output calculation (debounced)
- MAX button for balance
- 1% slippage protection
- Token logos (SEED, USDC)
- Pool info display

✅ **Liquidity Interface**:
- Add liquidity with proportional calculations
- Remove liquidity with estimates
- LP token management
- Pool share percentage
- MAX buttons for inputs

✅ **UX Enhancements**:
- Garden theme (emerald green, warm gold)
- Smooth animations
- Loading states
- Error handling
- Success messages
- Responsive design

### Run the Frontend

Start the development server:

```bash
cd packages/frontend
bun run dev
```

Open http://localhost:5173 in your browser!

<img width="1200" height="500" alt="Screenshot 2025-11-19 171532" src="https://github.com/user-attachments/assets/cee83a06-70af-4862-bd2f-6420b221dc18" />
<img width="1200" height="500" alt="Screenshot 2025-11-19 171515" src="https://github.com/user-attachments/assets/4b5524bb-0e45-4a2a-96ee-9dcf3aa2ef05" />


### Using the DEX

1. **Connect Wallet**: Click "Connect Wallet" and follow Panna SDK prompts
2. **Get Test Tokens**:
   - Mint SEED tokens from your deployed contract
   - Mint USDC tokens from your deployed contract
3. **Add Liquidity**:
   - Go to "Liquidity" tab
   - Enter SEED amount (USDC auto-calculates)
   - Click "Add Liquidity"
4. **Swap Tokens**:
   - Go to "Swap" tab
   - Enter amount to swap
   - Toggle direction (SEED ↔ USDC)
   - Click "Swap"

### Frontend Features

✅ **Smart UX**:
- Debounced calculations (no lag when typing)
- MAX buttons for quick balance selection
- Automatic proportional liquidity calculations
- Real-time pool data updates

✅ **Visual Design**:
- Garden theme (emerald green, warm gold)
- Token logos (SEED, USDC, LP)
- Smooth animations
- Responsive layout

✅ **Transaction Flow**:
- Approve → Execute pattern
- Loading states during transactions
- Success/Error messages
- 1% slippage protection

### Explore the Code

The frontend is fully commented and follows modern React patterns:
- Custom hooks for reusability
- Separated contract logic
- TypeScript for type safety
- Tailwind CSS v4 for styling

Feel free to customize:
- Theme colors in `index.css`
- Token icons in `TokenIcons.tsx`
- Add more features like:
  - Transaction history
  - Price charts
  - Multi-token support

---

## Part 11: Security Considerations

### Common Vulnerabilities

**1. Reentrancy Attack**
```solidity
// ❌ VULNERABLE
function removeLiquidity(uint256 liquidity) external {
    uint256 amountA = calculateAmount(liquidity);
    tokenA.transfer(msg.sender, amountA); // External call first!
    _burn(msg.sender, liquidity); // State change after
}

// ✅ PROTECTED
function removeLiquidity(uint256 liquidity) external nonReentrant {
    uint256 amountA = calculateAmount(liquidity);
    _burn(msg.sender, liquidity); // State change first!
    tokenA.transfer(msg.sender, amountA); // External call after
}
```

**2. Front-Running**
```solidity
// ✅ PROTECTED with slippage tolerance
function swap(uint256 amountIn, uint256 minAmountOut) external {
    uint256 actualOut = calculateOutput(amountIn);
    require(actualOut >= minAmountOut, "Slippage too high");
    // Even if front-run, user protected by minAmountOut
}
```

**3. Integer Overflow**
```solidity
// Solidity 0.8+ has automatic overflow protection!
uint256 a = type(uint256).max;
uint256 b = a + 1; // Reverts automatically!

// Before 0.8, needed SafeMath:
// using SafeMath for uint256;
// uint256 b = a.add(1);
```

**4. Price Oracle Manipulation**
```solidity
// ❌ VULNERABLE - spot price easy to manipulate
function getPrice() external view returns (uint256) {
    return reserveB / reserveA; // Can be manipulated in one block!
}

// ✅ BETTER - use TWAP (time-weighted average)
function getTWAP(uint256 period) external view returns (uint256) {
    // Average price over time period
    // Resistant to flash loan attacks
}
```

### Security Checklist

Before deploying to mainnet:

- [ ] Run Slither static analysis
- [ ] Get professional security audit
- [ ] Test on testnet for at least 1 week
- [ ] Implement pause mechanism for emergencies
- [ ] Set up monitoring and alerts
- [ ] Have incident response plan
- [ ] Implement timelocks for upgrades
- [ ] Test with different decimal tokens (6, 8, 18)
- [ ] Consider insurance (Nexus Mutual, etc.)
- [ ] Document all assumptions and edge cases

---

## Resources

### Documentation
- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf) - Original constant product AMM
- [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf) - Concentrated liquidity
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts) - Secure smart contract library
- [Ethers.js Docs](https://docs.ethers.org/v6/) - Frontend integration

### Tools
- [Desmos Graphing Calculator](https://www.desmos.com/calculator) - Visualize bonding curves
- [Tenderly](https://tenderly.co) - Transaction simulator and debugger
- [Slither](https://github.com/crytic/slither) - Security analyzer

### Learn More
- [Uniswap V2 Core Code](https://github.com/Uniswap/v2-core)
- [Curve Finance](https://curve.fi) - Stableswap invariant for low slippage
- [Balancer](https://balancer.fi) - Multi-token pools with weights

---

## What You Learned

✅ **DeFi Fundamentals**:
- Difference between CEX and DEX
- How Automated Market Makers work
- Constant product formula (x * y = k)
- Liquidity pools and LP tokens

✅ **Smart Contract Development**:
- Building a complete DEX from scratch
- ERC-20 token integration
- ReentrancyGuard protection
- Event emission for transparency

✅ **AMM Mechanics**:
- Liquidity provision with proportional shares
- Swap calculations with fees
- Price impact and slippage
- Impermanent loss concept

✅ **Frontend Integration**:
- Panna SDK account abstraction
- Thirdweb contract interactions
- Building intuitive swap interfaces with React
- Debounced calculations for better UX
- Real-time pool data updates

✅ **Security Best Practices**:
- Reentrancy protection
- Slippage tolerance
- Input validation
- Safe math operations

---

## Next Steps

**Customize Your Frontend**:
1. Change theme colors to match your brand
2. Add transaction history tracking
3. Implement price charts (TradingView)
4. Add wallet balance tracking
5. Create your own token logos

**Enhance Your DEX**:
1. Add TWAP oracle for reliable prices
2. Implement multi-hop routing
3. Build limit order functionality
4. Create LP staking rewards
5. Add concentrated liquidity ranges

**Deploy to Production**:
1. Complete security audit
2. Deploy on Lisk mainnet
3. Add liquidity with real assets
4. Market your DEX
5. Build community

**Learn Advanced DeFi**:
- Flash loans and arbitrage
- MEV (Maximal Extractable Value)
- Cross-chain bridges
- Yield aggregators
- Options and derivatives

---

**Remember**: Start small, test thoroughly, and never risk more than you can afford to lose. DeFi is powerful but requires responsibility!

**Happy Building!** 🚀💧

---

**#BuildOnLisk** | **#DeFi** | **#Web3Learning** | **#SimpleDEX**
