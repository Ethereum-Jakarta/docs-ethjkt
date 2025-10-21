---
id: sesi-5
title: "Sesi 5: DeFi Protocols & Integration"
sidebar_label: "Sesi 5: DeFi Protocols & Integration"
description: "Memahami mekanisme DeFi, integrasi dengan protokol utama, dan membangun frontend untuk swap dan lending."
---

# Sesi 5: DeFi Protocols & Integration

Selamat datang di sesi kelima Bootcamp **Web3 Hacker House**! Pada sesi ini, kita akan membahas protokol DeFi (Decentralized Finance) yang menjadi fondasi ekosistem keuangan terdesentralisasi. Kita akan mempelajari mekanisme AMM (Automated Market Maker), protokol lending/borrowing, dan cara mengintegrasikan SDK populer ke dalam dApp kita. Di akhir sesi, kita akan melakukan hands-on dengan membangun frontend dApp untuk simulasi swap dan lending.

---

## Bagian 1: Mekanisme AMM dan Protokol Swap

Automated Market Makers (AMM) telah merevolusi trading aset kripto dengan menggantikan order book tradisional dengan algoritma berbasis smart contract.

### 1.1 Konsep Dasar AMM

#### Apa itu AMM?

Automated Market Maker (AMM) adalah jenis protokol DEX (Decentralized Exchange) yang memungkinkan pertukaran aset kripto secara otomatis menggunakan smart contract, tanpa memerlukan counterparty (pihak lawan) langsung.

#### Komponen Utama AMM

1. **Liquidity Pools**: Kumpulan token yang disediakan oleh liquidity provider untuk memfasilitasi trading.
2. **Liquidity Providers (LPs)**: Pengguna yang menyetorkan token mereka ke dalam pool untuk mendapatkan imbalan (fee trading).
3. **Price Discovery**: Harga ditentukan oleh rasio token dalam pool, bukan mekanisme order book.
4. **Trading Fee**: Biaya yang dibayarkan trader dan sebagian didistribusikan kepada liquidity providers.
5. **Slippage**: Perbedaan harga yang terjadi antara harga yang diharapkan dan harga eksekusi aktual.

#### Formula AMM Dasar

AMM menggunakan rumus matematika untuk menentukan harga. Formula yang paling umum adalah:

**Constant Product Formula (Uniswap V2)**: x * y = k
- x = jumlah token A dalam pool
- y = jumlah token B dalam pool
- k = konstanta yang harus tetap sama sebelum dan setelah trade

Dengan rumus ini, saat trader membeli token A (mengurangi jumlahnya di pool), harga token A meningkat secara otomatis.

### 1.2 Uniswap V2: Constant Product AMM

Uniswap V2 adalah salah satu implementasi AMM paling populer yang menggunakan formula constant product.

#### Konsep Kunci Uniswap V2

1. **Pair Contract**: Setiap pasangan token memiliki kontrak terpisah yang menyimpan likuiditas.
2. **50/50 Value Ratio**: Liquidity providers harus menyediakan nilai yang sama dari kedua token.
3. **LP Tokens**: Token yang mewakili bagian provider dalam pool likuiditas.
4. **0.3% Fee**: Biaya trading yang sebagian besar didistribusikan ke liquidity providers.

#### Mekanisme Swap di Uniswap V2

Ketika pengguna ingin menukar Token A dengan Token B:

1. Pengguna mengirim Token A ke pair contract.
2. Smart contract menghitung jumlah Token B yang akan diterima pengguna berdasarkan formula x * y = k.
3. Smart contract mengirim Token B ke pengguna.
4. Biaya 0.3% dari Token A dikurangi dan tetap dalam pool sebagai pendapatan bagi liquidity providers.

#### Contoh Perhitungan

Misalkan pool berisi:
- 100 ETH (x)
- 200,000 USDC (y)

Ini membuat k = 100 * 200,000 = 20,000,000

Jika pengguna ingin menukar 10 ETH dengan USDC:
1. Tambahkan 10 ETH ke pool (setelah fee): 100 + 10 * 0.997 = 109.97 ETH
2. Hitung USDC yang akan diterima: y - (k / x) = 200,000 - (20,000,000 / 109.97) = 200,000 - 181,868 = 18,132 USDC

#### Kode Smart Contract (Penyederhanaan)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleUniswapV2Pair {
    uint256 public reserve0;   // Jumlah token0 dalam pool
    uint256 public reserve1;   // Jumlah token1 dalam pool
    
    address public token0;
    address public token1;
    
    uint256 private constant FEE_NUMERATOR = 997;
    uint256 private constant FEE_DENOMINATOR = 1000;
    
    // Simplified swap function
    function swap(uint256 amount0In, uint256 amount1In, address to) external {
        require(amount0In > 0 || amount1In > 0, "Insufficient input amount");
        
        // Calculate amounts
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        
        uint256 amount0Out = 0;
        uint256 amount1Out = 0;
        
        // Token0 is input, token1 is output
        if (amount0In > 0) {
            // Apply the 0.3% fee
            uint256 amount0InWithFee = amount0In * FEE_NUMERATOR / FEE_DENOMINATOR;
            
            // Calculate output amount using the constant product formula
            amount1Out = (reserve1 * amount0InWithFee) / (reserve0 + amount0InWithFee);
            
            // Update reserves
            reserve0 += amount0In;
            reserve1 -= amount1Out;
            
            // Transfer tokens
            IERC20(token1).transfer(to, amount1Out);
        } 
        // Token1 is input, token0 is output
        else {
            // Apply the 0.3% fee
            uint256 amount1InWithFee = amount1In * FEE_NUMERATOR / FEE_DENOMINATOR;
            
            // Calculate output amount using the constant product formula
            amount0Out = (reserve0 * amount1InWithFee) / (reserve1 + amount1InWithFee);
            
            // Update reserves
            reserve1 += amount1In;
            reserve0 -= amount0Out;
            
            // Transfer tokens
            IERC20(token0).transfer(to, amount0Out);
        }
    }
    
    // Add liquidity (simplified)
    function addLiquidity(uint256 amount0, uint256 amount1) external returns (uint256 liquidity) {
        // Transfer tokens to the pair
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        
        // Update reserves
        reserve0 += amount0;
        reserve1 += amount1;
        
        // Mint LP tokens (simplified)
        liquidity = sqrt(amount0 * amount1);
        
        return liquidity;
    }
    
    // Helper function to calculate square root
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
```

#### Kelebihan dan Keterbatasan Uniswap V2

**Kelebihan:**
- Model yang sederhana dan mudah dipahami
- Gas yang relatif efisien
- Likuiditas selalu tersedia untuk setiap harga

**Keterbatasan:**
- Capital inefficiency: Likuiditas tersebar di seluruh kurva harga
- Slippage tinggi untuk trade besar
- Impermanent loss dapat signifikan dalam volatilitas tinggi
- Tidak ada mekanisme untuk mengkonsentrasikan likuiditas di sekitar harga pasar

### 1.3 Uniswap V3: Concentrated Liquidity

Uniswap V3 menyempurnakan model AMM dengan memperkenalkan konsep concentrated liquidity, yang memungkinkan liquidity providers mengalokasikan capital mereka pada range harga tertentu.

#### Inovasi Kunci Uniswap V3

1. **Concentrated Liquidity**: LPs dapat memilih range harga untuk menyediakan likuiditas.
2. **Multiple Fee Tiers**: Pool dengan tingkat fee berbeda (0.05%, 0.3%, 1%) untuk pasangan yang sama.
3. **Non-Fungible Liquidity Positions**: Posisi likuiditas direpresentasikan sebagai NFT (ERC-721).
4. **Oracle Terintegrasi**: Menyediakan TWAPs (Time-Weighted Average Prices) yang lebih akurat.

#### Konsep Range Orders

Dalam Uniswap V3, likuiditas dikonsentrasikan dalam "ticks" atau range harga:

- Likuiditas hanya aktif ketika harga bergerak dalam range tertentu
- LPs dapat membuat posisi yang tumpang tindih di beberapa ranges
- Semakin sempit range, semakin efisien penggunaan capital (jika harga tetap dalam range)

#### Formula Baru: Dikembangkan untuk Concentrated Liquidity

Uniswap V3 masih menggunakan prinsip constant product, tetapi dimodifikasi untuk memperhitungkan likuiditas yang hanya aktif dalam range tertentu. Formula dasarnya menjadi lebih kompleks:

```
L = √(x * y)
```

Di mana L adalah liquidity yang dialokasikan ke range tertentu, dan x dan y adalah jumlah token dalam range tersebut.

#### Contoh Kode Smart Contract (Disederhanakan)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Highly simplified representation of Uniswap V3 concepts
contract UniswapV3PoolSimplified {
    struct Position {
        uint128 liquidity;
        int24 lowerTick;
        int24 upperTick;
        uint256 feeGrowthInside0LastX128;
        uint256 feeGrowthInside1LastX128;
        uint128 tokensOwed0;
        uint128 tokensOwed1;
    }
    
    // Current price tick
    int24 public currentTick;
    
    // Global liquidity state
    uint128 public liquidity;
    
    // Fee
    uint24 public fee;
    
    // Positions mapping (tokenId => Position)
    mapping(uint256 => Position) public positions;
    
    // Liquidity per tick
    mapping(int24 => uint128) public liquidityPerTick;
    
    // Initialize pool
    constructor(uint24 _fee, int24 initialTick) {
        fee = _fee;
        currentTick = initialTick;
    }
    
    // Mint a new position (simplified)
    function mint(
        address recipient,
        int24 lowerTick,
        int24 upperTick,
        uint128 amount
    ) external returns (uint256 tokenId) {
        require(lowerTick < upperTick, "Invalid tick range");
        require(amount > 0, "Amount must be greater than 0");
        
        // Generate tokenId (simplified)
        tokenId = uint256(keccak256(abi.encodePacked(recipient, lowerTick, upperTick)));
        
        // Create position
        Position storage position = positions[tokenId];
        position.liquidity = amount;
        position.lowerTick = lowerTick;
        position.upperTick = upperTick;
        
        // Update liquidity for the ticks
        liquidityPerTick[lowerTick] += amount;
        liquidityPerTick[upperTick] += amount;
        
        // Update global liquidity if the position is in range
        if (currentTick >= lowerTick && currentTick < upperTick) {
            liquidity += amount;
        }
        
        return tokenId;
    }
    
    // Swap tokens (extremely simplified)
    function swap(bool zeroForOne, uint256 amountIn) external returns (uint256 amountOut) {
        // Calculate amountOut based on curve and available liquidity
        // This is a massive simplification of the actual swap logic
        
        uint256 amountInWithFee = (amountIn * (1000000 - fee)) / 1000000;
        
        // Update the current tick based on the new price
        // In reality, this involves complex math with the sqrt price calculations
        
        // For simplicity, let's assume tick moves by 1 in the direction of the swap
        if (zeroForOne) {
            currentTick -= 1;
        } else {
            currentTick += 1;
        }
        
        // Update active liquidity based on the new tick
        _updateLiquidity();
        
        // Simplified output calculation (not accurate)
        amountOut = amountInWithFee / 2;
        
        return amountOut;
    }
    
    // Update liquidity when crossing ticks (simplified)
    function _updateLiquidity() internal {
        // Recalculate active liquidity based on which positions' ranges include the current tick
        // This is a massive simplification
        
        // In reality, Uniswap V3 tracks this through a complex system of tick bitmaps and crossings
    }
}
```

#### Kelebihan dan Tantangan Uniswap V3

**Kelebihan:**
- Capital efficiency yang jauh lebih tinggi (dapat 4000x lebih efisien)
- Slippage lebih rendah untuk trade dalam range yang memiliki likuiditas tinggi
- Potensi pendapatan yang lebih tinggi bagi LPs yang aktif mengelola posisi
- Kisaran fee yang fleksibel untuk berbagai pasangan

**Tantangan:**
- Kompleksitas yang lebih tinggi bagi LPs
- Risiko impermanent loss yang lebih tinggi jika range yang dipilih sempit
- Biaya gas yang lebih tinggi untuk operasi likuiditas
- Memerlukan manajemen aktif untuk posisi yang optimal

#### Perbandingan Uniswap V2 vs V3

| Aspek | Uniswap V2 | Uniswap V3 |
|-------|-----------|-----------|
| **Model Likuiditas** | Tersebar di semua harga | Terkonsentrasi pada range |
| **Representasi LP** | Token fungible (ERC-20) | NFT (ERC-721) |
| **Capital Efficiency** | Rendah | Tinggi |
| **Tingkat Fee** | Single (0.3%) | Multiple (0.05%, 0.3%, 1%) |
| **Kompleksitas UX** | Sederhana | Kompleks |
| **Gas Cost** | Lebih rendah | Lebih tinggi |
| **Manajemen Posisi** | Pasif | Aktif |
| **Impermanent Loss** | Moderat | Potensial lebih tinggi |

### 1.4 Hooks di Uniswap V4 (Preview)

Uniswap V4 memperkenalkan konsep "hooks" yang memungkinkan kustomisasi logika pool dengan cara yang belum pernah ada sebelumnya.

#### Apa itu Hooks?

Hooks adalah smart contract yang dapat dipanggil pada titik-titik tertentu dalam lifecycle pool Uniswap, memungkinkan logika kustom untuk dijalankan sebelum atau sesudah operasi utama seperti swap, mint, atau burn.

#### Jenis Hooks

1. **BeforeSwap/AfterSwap**: Dijalankan sebelum/setelah swap
2. **BeforeMint/AfterMint**: Dijalankan sebelum/setelah menambahkan likuiditas
3. **BeforeBurn/AfterBurn**: Dijalankan sebelum/setelah mengurangi likuiditas
4. **BeforeDonate/AfterDonate**: Dijalankan sebelum/setelah donasi token ke pool

#### Use Cases untuk Hooks

- **Dynamic Fees**: Menyesuaikan fee berdasarkan volatilitas pasar
- **Just-In-Time (JIT) Liquidity**: Menambahkan likuiditas tepat sebelum swap besar
- **TWAP Oracles**: Implementasi oracle harga kustom
- **Limit Orders**: Implementasi limit order on-chain
- **Liquidity Mining**: Program reward dan incentive kustom

#### Contoh Hook Sederhana (Contoh Konseptual)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseHook} from "v4-hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";

contract DynamicFeeHook is BaseHook {
    // Mapping untuk menyimpan waktu swap terakhir untuk setiap pool
    mapping(bytes32 => uint256) public lastSwapTime;
    
    // Mapping untuk menyimpan volatilitas untuk setiap pool
    mapping(bytes32 => uint256) public poolVolatility;
    
    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}
    
    // Hook yang dijalankan sebelum swap
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params
    ) external override returns (bytes4) {
        bytes32 poolId = keccak256(abi.encode(key));
        
        // Hitung waktu sejak swap terakhir
        uint256 timeSinceLastSwap = block.timestamp - lastSwapTime[poolId];
        
        // Update waktu swap terakhir
        lastSwapTime[poolId] = block.timestamp;
        
        // Logika untuk menyesuaikan fee berdasarkan volatilitas
        if (timeSinceLastSwap < 60) { // < 1 menit, aktivitas tinggi
            poolVolatility[poolId] = min(poolVolatility[poolId] + 10, 100);
        } else if (timeSinceLastSwap > 3600) { // > 1 jam, aktivitas rendah
            poolVolatility[poolId] = max(poolVolatility[poolId] - 10, 10);
        }
        
        // Perhitungan fee dinamis berdasarkan volatilitas
        uint24 dynamicFee = calculateDynamicFee(poolVolatility[poolId]);
        
        // Set fee baru untuk pool ini (implementasi tergantung pada V4 final API)
        // poolManager.setFee(key, dynamicFee);
        
        return BaseHook.beforeSwap.selector;
    }
    
    // Fungsi helper untuk menghitung fee dinamis
    function calculateDynamicFee(uint256 volatility) internal pure returns (uint24) {
        // Contoh sederhana: fee antara 0.05% dan 1% berdasarkan volatilitas
        return uint24(500 + (volatility * 500 / 100)); // 500 = 0.05%, 1000 = 0.1%
    }
    
    // Helper function untuk min
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    // Helper function untuk max
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
    
    // Implement fungsi hook lainnya yang diperlukan
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        IPoolManager.SwapResults calldata results
    ) external override returns (bytes4) {
        return BaseHook.afterSwap.selector;
    }
    
    // Implementasikan fungsi hook lainnya...
}
```

**Note**: Implementasi di atas adalah konseptual karena Uniswap V4 masih dalam pengembangan dan API finalnya mungkin berbeda.

#### Dampak Hooks pada Ekosistem

Hooks di Uniswap V4 diharapkan membawa inovasi signifikan:

1. **Customization**: DEX bisa disesuaikan untuk use case spesifik
2. **Eksperimen**: Pengembang dapat bereksperimen dengan model likuiditas baru
3. **Efisiensi**: Mekanisme trading yang lebih efisien seperti JIT liquidity
4. **Composability**: Integrasi yang lebih baik dengan protokol DeFi lainnya

---

## Bagian 2: Lending & Borrowing Protocols

Protokol lending dan borrowing memungkinkan pengguna meminjam dan meminjamkan aset kripto secara terdesentralisasi.

### 2.1 Konsep Dasar DeFi Lending

#### Komponen Utama Protokol Lending/Borrowing

1. **Money Markets**: Pool token yang tersedia untuk dipinjam dan dipinjamkan.
2. **Collateral**: Aset yang dijaminkan untuk mendapatkan pinjaman.
3. **Loan-to-Value (LTV)**: Rasio antara nilai pinjaman dan nilai jaminan.
4. **Interest Rates**: Suku bunga yang dinamis atau statis untuk peminjam dan pemberi pinjaman.
5. **Liquidation Mechanism**: Proses untuk menyelesaikan pinjaman yang berisiko karena penurunan nilai jaminan.

#### Alur Umum Lending/Borrowing

1. **Supply/Lending**: Pengguna menyetorkan aset ke dalam protokol.
2. **Borrowing**: Pengguna meminjam aset dengan menjaminkan aset lain sebagai collateral.
3. **Repayment**: Peminjam membayar kembali pinjaman beserta bunga.
4. **Liquidation**: Jika nilai jaminan turun di bawah threshold, sebagian jaminan dilikuidasi.
5. **Withdrawal**: Pemberi pinjaman menarik aset mereka beserta bunga yang diperoleh.

### 2.2 Aave Protocol

[Aave](https://aave.com/) adalah protokol lending dan borrowing terdesentralisasi terkemuka yang menawarkan berbagai fitur canggih.

#### Fitur Utama Aave

1. **Isolated Lending**: Strategi baru di mana aset dikategorikan berdasarkan risikonya.
2. **Stable & Variable Rates**: Opsi suku bunga stabil (lebih tinggi tapi konsisten) atau variabel (fluktuatif).
3. **Flash Loans**: Pinjaman tanpa jaminan yang harus dikembalikan dalam satu transaksi.
4. **Credit Delegation**: Pengguna dapat mendelegasikan limit kredit mereka kepada pengguna lain.
5. **Rate Switching**: Peminjam dapat beralih antara suku bunga stabil dan variabel.

#### Tokenomics Aave

- **aTokens**: Mewakili deposit pengguna yang menghasilkan bunga (mis. aDAI untuk DAI yang didepositkan).
- **Debt Tokens**: Mewakili pinjaman pengguna (stable & variable debt tokens).
- **AAVE Token**: Token governance protokol yang juga dapat digunakan sebagai insentif keamanan.

#### Mekanisme Suku Bunga

Aave menggunakan algoritma suku bunga yang merespons permintaan dan penawaran pasar:

```
Utilization Rate (U) = Total Borrowed / Total Available
```

Suku bunga variabel (variable rate) dihitung dengan formula:
```
Variable Rate = Base Rate + (Utilization Rate * Rate Slope1)
```

Jika utilization rate > Optimal Utilization Rate (80%):
```
Variable Rate = Base Rate + (0.8 * Rate Slope1) + ((U - 0.8) * Rate Slope2)
```

#### Likuidasi di Aave

Proses likuidasi terjadi ketika health factor (rasio keamanan) peminjam turun di bawah 1:

```
Health Factor = Total Collateral Value * Liquidation Threshold / Total Borrowed Value
```

Ketika Health Factor < 1, likuidator dapat melikuidasi hingga 50% dari pinjaman, dan sebagai imbalan mereka menerima diskon pada jaminan yang dilikuidasi (biasanya 5-10%).

#### Contoh Kode Smart Contract Aave (Penyederhanaan)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Simplified Aave LendingPool contract
contract SimplifiedAaveLendingPool {
    struct UserAccountData {
        uint256 totalCollateralETH;
        uint256 totalDebtETH;
        uint256 availableBorrowsETH;
        uint256 currentLiquidationThreshold;
        uint256 ltv;
        uint256 healthFactor;
    }
    
    struct ReserveData {
        uint256 availableLiquidity;
        uint256 totalBorrows;
        uint256 utilizationRate;
        uint256 liquidityRate;         // Interest rate for lenders
        uint256 variableBorrowRate;    // Variable interest rate for borrowers
        uint256 stableBorrowRate;      // Stable interest rate for borrowers
        address aTokenAddress;
        address stableDebtTokenAddress;
        address variableDebtTokenAddress;
    }
    
    // Mapping of asset address to its reserve data
    mapping(address => ReserveData) public reserves;
    
    // Mapping of user address to their account data
    mapping(address => UserAccountData) public usersAccountData;
    
    // Oracle for price data
    address public priceOracle;
    
    // Deposit assets into the protocol
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        // Transfer the asset from the user to the protocol
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Mint aTokens to the user (representing their deposit)
        // In a real implementation, this would mint aTokens to onBehalfOf
        
        // Update reserve data
        ReserveData storage reserve = reserves[asset];
        reserve.availableLiquidity += amount;
        
        // Recalculate the user's account data
        _updateUserAccountData(onBehalfOf);
    }
    
    // Borrow assets from the protocol
    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) external {
        UserAccountData storage userData = usersAccountData[onBehalfOf];
        ReserveData storage reserve = reserves[asset];
        
        // Check if user has enough collateral
        require(userData.availableBorrowsETH >= _convertToETH(asset, amount), "Not enough collateral");
        
        // Transfer the borrowed asset to the user
        IERC20(asset).transfer(msg.sender, amount);
        
        // Mint debt tokens to track the user's debt (not implemented here)
        // This would mint either stable or variable debt tokens based on interestRateMode
        
        // Update reserve data
        reserve.availableLiquidity -= amount;
        reserve.totalBorrows += amount;
        reserve.utilizationRate = reserve.totalBorrows * 1e18 / (reserve.availableLiquidity + reserve.totalBorrows);
        
        // Update the user's account data
        _updateUserAccountData(onBehalfOf);
    }
    
    // Repay a loan
    function repay(
        address asset,
        uint256 amount,
        uint256 rateMode,
        address onBehalfOf
    ) external returns (uint256) {
        // Transfer the asset from the user to the protocol
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Burn debt tokens (not implemented here)
        
        // Update reserve data
        ReserveData storage reserve = reserves[asset];
        reserve.availableLiquidity += amount;
        reserve.totalBorrows -= amount; // Simplified, should account for interest
        reserve.utilizationRate = reserve.totalBorrows * 1e18 / (reserve.availableLiquidity + reserve.totalBorrows);
        
        // Update the user's account data
        _updateUserAccountData(onBehalfOf);
        
        return amount;
    }
    
    // Liquidate a position that's below the health threshold
    function liquidationCall(
        address collateralAsset,
        address debtAsset,
        address user,
        uint256 debtToCover,
        bool receiveAToken
    ) external {
        UserAccountData storage userData = usersAccountData[user];
        
        // Check if the position is eligible for liquidation
        require(userData.healthFactor < 1e18, "Health factor not below threshold");
        
        // Calculate how much collateral can be liquidated
        uint256 collateralAmount = _calculateLiquidatableCollateral(
            collateralAsset,
            debtAsset,
            debtToCover,
            userData
        );
        
        // Transfer the debt asset from liquidator to the protocol
        IERC20(debtAsset).transferFrom(msg.sender, address(this), debtToCover);
        
        // Transfer the collateral asset to the liquidator
        IERC20(collateralAsset).transfer(msg.sender, collateralAmount);
        
        // Update user account data
        _updateUserAccountData(user);
    }
    
    // Helper function to update a user's account data
    function _updateUserAccountData(address user) internal {
        // In a real implementation, this would recalculate:
        // - Total collateral value
        // - Total debt value
        // - Available borrows
        // - Health factor
        
        // This is a simplified placeholder
        UserAccountData storage userData = usersAccountData[user];
        
        // For simplicity, let's assume we have a way to get these values
        userData.totalCollateralETH = _calculateUserTotalCollateral(user);
        userData.totalDebtETH = _calculateUserTotalDebt(user);
        
        // Calculate available borrows (LTV * collateral - debt)
        userData.availableBorrowsETH = (userData.totalCollateralETH * userData.ltv / 10000) - userData.totalDebtETH;
        
        // Calculate health factor
        if (userData.totalDebtETH == 0) {
            userData.healthFactor = type(uint256).max; // Max value if no debt
        } else {
            userData.healthFactor = (userData.totalCollateralETH * userData.currentLiquidationThreshold / 10000) * 1e18 / userData.totalDebtETH;
        }
    }
    
    // Helper functions (simplified placeholder implementations)
    function _convertToETH(address asset, uint256 amount) internal view returns (uint256) {
        // Get the price from oracle and convert to ETH value
        return amount; // Placeholder
    }
    
    function _calculateLiquidatableCollateral(
        address collateralAsset,
        address debtAsset,
        uint256 debtToCover,
        UserAccountData storage userData
    ) internal view returns (uint256) {
        // In a real implementation, this would calculate the exact amount
        // based on debt amount, bonus for liquidator, etc.
        return debtToCover; // Placeholder
    }
    
    function _calculateUserTotalCollateral(address user) internal view returns (uint256) {
        // Placeholder
        return 0;
    }
    
    function _calculateUserTotalDebt(address user) internal view returns (uint256) {
        // Placeholder
        return 0;
    }
}
```

### 2.3 Compound Protocol

[Compound](https://compound.finance/) adalah salah satu protokol lending tertua dan paling terpercaya di ekosistem DeFi.

#### Arsitektur Compound

Arsitektur Compound terdiri dari:

1. **cTokens**: Token yang mewakili deposit pengguna dan tumbuh seiring waktu (mis. cDAI untuk DAI yang didepositkan).
2. **Comptroller**: Kontrak yang mengatur kepatuhan terhadap aturan protokol, termasuk faktor kolateral dan batasan pinjaman.
3. **Interest Rate Models**: Smart contract yang mendefinisikan logika suku bunga untuk setiap aset.
4. **Price Oracles**: Menyediakan data harga untuk aset yang didukung.

#### Perbedaan dengan Aave

**Representasi Token**:
- Aave: satu aToken untuk deposit, dua debt token terpisah (stable dan variable)
- Compound: satu cToken untuk deposit dan pinjaman (saldo cToken bertambah untuk pemberi pinjaman, menurun untuk peminjam)

**Model Suku Bunga**:
- Aave: Mendukung pinjaman dengan suku bunga stabil dan variabel
- Compound: Hanya menawarkan suku bunga variabel

**Tokenomics**:
- Aave: Token AAVE untuk governance dan safety module
- Compound: Token COMP untuk governance dan insentif

#### Exchange Rate Mechanism

Di Compound, nilai cToken relatif terhadap underlying asset terus bertambah seiring waktu:

```
Exchange Rate = (Cash + Total Borrows - Reserves) / Total cToken Supply
```

Ketika pengguna menyetor aset, mereka menerima cToken sesuai dengan exchange rate saat itu. Dengan berjalannya waktu, satu cToken dapat ditukarkan dengan jumlah underlying asset yang lebih banyak.

#### Contoh Kode Compound (Penyederhanaan)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Simplified Compound cToken contract
contract SimplifiedCToken is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 8; // cTokens use 8 decimals
    
    uint256 private totalSupply_;
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    
    // Underlying asset
    IERC20 public underlying;
    
    // Interest rate model contract
    address public interestRateModel;
    
    // Compound Comptroller
    address public comptroller;
    
    // Accumulated borrows and reserves
    uint256 public totalBorrows;
    uint256 public totalReserves;
    
    // Current exchange rate (scaled by 1e18)
    uint256 public exchangeRateCurrent;
    
    // Borrow balance of accounts
    mapping(address => uint256) public borrowBalances;
    
    // Events
    event Mint(address minter, uint256 mintAmount, uint256 mintTokens);
    event Redeem(address redeemer, uint256 redeemAmount, uint256 redeemTokens);
    event Borrow(address borrower, uint256 borrowAmount);
    event RepayBorrow(address payer, address borrower, uint256 repayAmount);
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _underlying,
        address _comptroller,
        address _interestRateModel
    ) {
        name = _name;
        symbol = _symbol;
        underlying = IERC20(_underlying);
        comptroller = _comptroller;
        interestRateModel = _interestRateModel;
        
        // Initial exchange rate 1:1 (scaled by 1e18)
        exchangeRateCurrent = 1e18;
    }
    
    // Mint cTokens by supplying underlying asset
    function mint(uint256 mintAmount) external returns (uint256) {
        // Transfer underlying tokens from sender to this contract
        underlying.transferFrom(msg.sender, address(this), mintAmount);
        
        // Calculate cTokens to mint based on exchange rate
        uint256 mintTokens = mintAmount * 1e18 / exchangeRateCurrent;
        
        // Update user's cToken balance
        balances[msg.sender] += mintTokens;
        totalSupply_ += mintTokens;
        
        emit Mint(msg.sender, mintAmount, mintTokens);
        return mintTokens;
    }
    
    // Redeem cTokens for underlying asset
    function redeem(uint256 redeemTokens) external returns (uint256) {
        require(balances[msg.sender] >= redeemTokens, "Insufficient balance");
        
        // Calculate underlying amount to return
        uint256 redeemAmount = redeemTokens * exchangeRateCurrent / 1e18;
        
        // Ensure the contract has enough liquidity
        require(underlying.balanceOf(address(this)) >= redeemAmount, "Insufficient liquidity");
        
        // Update balances
        balances[msg.sender] -= redeemTokens;
        totalSupply_ -= redeemTokens;
        
        // Transfer underlying tokens back to user
        underlying.transfer(msg.sender, redeemAmount);
        
        emit Redeem(msg.sender, redeemAmount, redeemTokens);
        return redeemAmount;
    }
    
    // Borrow underlying asset
    function borrow(uint256 borrowAmount) external returns (uint256) {
        // Check with Comptroller if user has enough collateral
        // (Not implemented here)
        
        // Update borrow balance for user
        borrowBalances[msg.sender] += borrowAmount;
        totalBorrows += borrowAmount;
        
        // Transfer underlying tokens to user
        underlying.transfer(msg.sender, borrowAmount);
        
        emit Borrow(msg.sender, borrowAmount);
        return borrowAmount;
    }
    
    // Repay borrowed amount
    function repayBorrow(uint256 repayAmount) external returns (uint256) {
        uint256 borrowBalance = borrowBalances[msg.sender];
        
        // Cap repayment at current borrow balance
        uint256 actualRepayAmount = repayAmount > borrowBalance 
            ? borrowBalance 
            : repayAmount;
        
        // Transfer underlying tokens from user to this contract
        underlying.transferFrom(msg.sender, address(this), actualRepayAmount);
        
        // Update borrow balance
        borrowBalances[msg.sender] -= actualRepayAmount;
        totalBorrows -= actualRepayAmount;
        
        emit RepayBorrow(msg.sender, msg.sender, actualRepayAmount);
        return actualRepayAmount;
    }
    
    // ERC20 functions
    function totalSupply() external view override returns (uint256) {
        return totalSupply_;
    }
    
    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }
    
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function allowance(address owner, address spender) external view override returns (uint256) {
        return allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        allowances[sender][msg.sender] -= amount;
        balances[sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
```

### 2.4 Perbandingan Aave vs Compound

| Fitur | Aave | Compound |
|-------|------|----------|
| **Token Model** | aTokens (deposit), Debt Tokens (borrow) | cTokens (untuk keduanya) |
| **Rate Options** | Variable & Stable | Variable only |
| **Flash Loans** | Ya | Tidak |
| **Interest Rate Algorithm** | Complex, multiple slopes | Simple, single slope |
| **Collateral Management** | Per-asset settings | Global settings |
| **Delegation** | Credit delegation | No delegation |
| **Liquidation Factor** | 0.5 (50%) | 0.5 (50%) |
| **User Interface** | Feature-rich | Simple & straightforward |
| **Governance Token** | AAVE | COMP |

---

## Bagian 3: Integrasi SDK: Uniswap, Aave, Compound

Setelah memahami mekanisme protokol DeFi utama, sekarang kita akan melihat cara mengintegrasikan SDK (Software Development Kit) mereka ke dalam aplikasi kita.

### 3.1 Integrasi Uniswap SDK

[Uniswap SDK](https://docs.uniswap.org/sdk/v3/overview) menyediakan tools untuk berinteraksi dengan protokol Uniswap dari aplikasi frontend dan backend.

#### Instalasi Uniswap SDK

```bash
npm install @uniswap/sdk-core @uniswap/v3-sdk @uniswap/smart-order-router
```

#### Contoh Penggunaan SDK untuk Swap

```typescript
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import { AlphaRouter } from '@uniswap/smart-order-router'
import { ethers, BigNumber } from 'ethers'

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL')

// Initialize AlphaRouter
const router = new AlphaRouter({ chainId: 1, provider })

// Define tokens (ETH and USDC on Ethereum)
const WETH = new Token(
  1,  // chainId
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  // WETH address
  18, 
  'WETH',
  'Wrapped Ether'
)

const USDC = new Token(
  1,  // chainId
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC address
  6, 
  'USDC',
  'USD Coin'
)

async function getSwapRoute(
  tokenIn: Token,
  tokenOut: Token,
  amountIn: string
) {
  // Convert the amount to the proper decimal representation
  const wei = ethers.utils.parseUnits(
    amountIn,
    tokenIn.decimals
  )
  
  // Create a Currency Amount with the input token and amount
  const currencyAmount = CurrencyAmount.fromRawAmount(
    tokenIn,
    BigNumber.from(wei).toString()
  )
  
  // Get the route for the swap
  const route = await router.route(
    currencyAmount,
    tokenOut,
    TradeType.EXACT_INPUT,
    {
      recipient: 'YOUR_WALLET_ADDRESS',
      slippageTolerance: new Percent(5, 100),  // 5% slippage tolerance
      deadline: Math.floor(Date.now() / 1000 + 1800)  // 30 minutes from now
    }
  )
  
  return route
}

// Example usage
async function swapExample() {
  try {
    const route = await getSwapRoute(WETH, USDC, '0.1')  // Swap 0.1 ETH for USDC
    
    if (route) {
      console.log('Estimated amount out:', route.quote.toFixed(6))
      console.log('Gas adjusted quote:', route.quoteGasAdjusted.toFixed(6))
      console.log('Gas used:', route.estimatedGasUsed.toString())
      
      // The transaction data to send
      console.log('Transaction calldata:', route.methodParameters?.calldata)
      console.log('Transaction value:', route.methodParameters?.value)
      
      // This could be sent to the blockchain with a signer
      const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider)
      const tx = {
        data: route.methodParameters?.calldata,
        to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // SwapRouter02 address
        value: route.methodParameters?.value,
        from: wallet.address,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: ethers.utils.hexlify(1000000)
      }
      
      // Send the transaction
      // const response = await wallet.sendTransaction(tx)
      // console.log('Transaction hash:', response.hash)
    }
  } catch (error) {
    console.error('Error getting swap route:', error)
  }
}

// Call the function
swapExample()
```

#### Uniswap V3 Position Management dengan SDK

```typescript
import { Pool, Position, nearestUsableTick } from '@uniswap/v3-sdk'
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { ethers } from 'ethers'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import INonfungiblePositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json'

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL')

// Token definitions (same as before)
const WETH = new Token(/* ... */)
const USDC = new Token(/* ... */)

// Pool and position manager addresses
const POOL_ADDRESS = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8' // USDC/WETH 0.3% pool
const POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

async function createPosition(
  tokenA: Token,
  tokenB: Token,
  amountA: string,
  amountB: string,
  fee: number,
  tickLower: number,
  tickUpper: number
) {
  try {
    // Get pool data
    const poolContract = new ethers.Contract(
      POOL_ADDRESS,
      IUniswapV3PoolABI.abi,
      provider
    )
    
    const [slot0, liquidity] = await Promise.all([
      poolContract.slot0(),
      poolContract.liquidity()
    ])
    
    const sqrtPriceX96 = slot0.sqrtPriceX96
    
    // Create Pool instance
    const pool = new Pool(
      tokenA,
      tokenB,
      fee,
      sqrtPriceX96.toString(),
      liquidity.toString(),
      slot0.tick
    )
    
    // Parse amounts
    const amountADesired = CurrencyAmount.fromRawAmount(
      tokenA,
      ethers.utils.parseUnits(amountA, tokenA.decimals).toString()
    )
    
    const amountBDesired = CurrencyAmount.fromRawAmount(
      tokenB,
      ethers.utils.parseUnits(amountB, tokenB.decimals).toString()
    )
    
    // Create position
    const position = Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0: tokenA.sortsBefore(tokenB) ? amountADesired.quotient.toString() : amountBDesired.quotient.toString(),
      amount1: tokenA.sortsBefore(tokenB) ? amountBDesired.quotient.toString() : amountADesired.quotient.toString(),
      useFullPrecision: true
    })
    
    // Get mint parameters
    const mintParams = {
      token0: tokenA.sortsBefore(tokenB) ? tokenA.address : tokenB.address,
      token1: tokenA.sortsBefore(tokenB) ? tokenB.address : tokenA.address,
      fee: fee,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0Desired: tokenA.sortsBefore(tokenB) ? amountADesired.quotient.toString() : amountBDesired.quotient.toString(),
      amount1Desired: tokenA.sortsBefore(tokenB) ? amountBDesired.quotient.toString() : amountADesired.quotient.toString(),
      amount0Min: 0, // Should be calculated with slippage tolerance
      amount1Min: 0, // Should be calculated with slippage tolerance
      recipient: 'YOUR_WALLET_ADDRESS',
      deadline: Math.floor(Date.now() / 1000 + 1800)
    }
    
    // This transaction would need to be sent with a signer
    const positionManagerContract = new ethers.Contract(
      POSITION_MANAGER_ADDRESS,
      INonfungiblePositionManagerABI.abi,
      provider
    )
    
    console.log('Position parameters:', mintParams)
    
    // Call mint on the contract (would need a signer)
    // const tx = await positionManagerContract.connect(wallet).mint(mintParams)
    // console.log('Transaction hash:', tx.hash)
    
    return { position, mintParams }
  } catch (error) {
    console.error('Error creating position:', error)
    throw error
  }
}

// Example usage
async function createPositionExample() {
  try {
    // Get nearest usable ticks for range
    const pool = new Pool(
      WETH,
      USDC,
      3000, // 0.3% fee tier
      '0', // We'll get the actual sqrtPriceX96 from the chain
      '0', // We'll get the actual liquidity from the chain
      0    // We'll get the actual tick from the chain
    )
    
    // Get current tick from chain and calculate tick range
    const poolContract = new ethers.Contract(
      POOL_ADDRESS,
      IUniswapV3PoolABI.abi,
      provider
    )
    
    const slot0 = await poolContract.slot0()
    const currentTick = slot0.tick
    
    // Set range to current price +/- 10%
    const tickSpacing = 60 // For 0.3% pool
    const tickLower = nearestUsableTick(currentTick - 200, tickSpacing)
    const tickUpper = nearestUsableTick(currentTick + 200, tickSpacing)
    
    console.log('Creating position with tick range:', { tickLower, tickUpper, currentTick })
    
    // Create position with 0.1 ETH and equivalent USDC
    const result = await createPosition(
      WETH,
      USDC,
      '0.1', // 0.1 ETH
      '200', // Approximately equivalent USDC (would need price oracle)
      3000,  // 0.3% fee tier
      tickLower,
      tickUpper
    )
    
    console.log('Position created:', result)
  } catch (error) {
    console.error('Error in position example:', error)
  }
}

// Call the function
createPositionExample()
```

### 3.2 Integrasi Aave SDK

[Aave.js](https://github.com/aave/aave-js) adalah SDK untuk berinteraksi dengan protokol Aave.

#### Instalasi Aave SDK

```bash
npm install @aave/protocol-js
```

#### Contoh Penggunaan Aave SDK

```typescript
import { ethers } from 'ethers'
import { 
  LendingPool,
  LendingPoolAddressesProvider,
  EthereumTransactionTypeExtended,
  Market,
  Network
} from '@aave/protocol-js'

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL')
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider)

// Initialize Aave Protocol
const lendingPoolAddressProvider = new LendingPoolAddressesProvider({
  LENDING_POOL_ADDRESSES_PROVIDER: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5', // Mainnet
  LENDING_POOL: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9' // Mainnet
})

const lendingPool = new LendingPool(lendingPoolAddressProvider)

// Function to deposit into Aave
async function depositToAave(
  asset: string,
  amount: string,
  interestRateMode: number
) {
  try {
    const userAddress = await signer.getAddress()
    
    // Create transaction data for deposit
    const txs: EthereumTransactionTypeExtended[] = await lendingPool.deposit({
      user: userAddress,
      reserve: asset,
      amount,
      onBehalfOf: userAddress,
      referralCode: '0',
    })
    
    // Submit transaction
    const extendedTxData = txs[0].tx
    const { from, ...txData } = extendedTxData
    const tx = await signer.sendTransaction({
      ...txData,
      value: txData.value ? txData.value.toString() : '0',
    })
    
    console.log('Deposit transaction hash:', tx.hash)
    
    const receipt = await tx.wait(1)
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error) {
    console.error('Error depositing to Aave:', error)
    throw error
  }
}

// Function to borrow from Aave
async function borrowFromAave(
  asset: string,
  amount: string,
  interestRateMode: number
) {
  try {
    const userAddress = await signer.getAddress()
    
    // Create transaction data for borrow
    const txs: EthereumTransactionTypeExtended[] = await lendingPool.borrow({
      user: userAddress,
      reserve: asset,
      amount,
      interestRateMode, // 1 for stable, 2 for variable
      debtTokenAddress: '0x', // Will be filled by the SDK
      onBehalfOf: userAddress,
      referralCode: '0',
    })
    
    // Submit transaction
    const extendedTxData = txs[0].tx
    const { from, ...txData } = extendedTxData
    const tx = await signer.sendTransaction({
      ...txData,
      value: txData.value ? txData.value.toString() : '0',
    })
    
    console.log('Borrow transaction hash:', tx.hash)
    
    const receipt = await tx.wait(1)
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error) {
    console.error('Error borrowing from Aave:', error)
    throw error
  }
}

// Function to get user account data
async function getUserAccountData() {
  try {
    const userAddress = await signer.getAddress()
    
    const userAccountData = await lendingPool.getUserAccountData({
      user: userAddress,
    })
    
    console.log('User Account Data:', {
      totalCollateralETH: userAccountData.totalCollateralETH,
      totalDebtETH: userAccountData.totalDebtETH,
      availableBorrowsETH: userAccountData.availableBorrowsETH,
      currentLiquidationThreshold: userAccountData.currentLiquidationThreshold,
      ltv: userAccountData.ltv,
      healthFactor: userAccountData.healthFactor,
    })
    
    return userAccountData
  } catch (error) {
    console.error('Error getting user account data:', error)
    throw error
  }
}

// Function to repay loan
async function repayLoan(
  asset: string,
  amount: string,
  interestRateMode: number
) {
  try {
    const userAddress = await signer.getAddress()
    
    const txs: EthereumTransactionTypeExtended[] = await lendingPool.repay({
      user: userAddress,
      reserve: asset,
      amount,
      interestRateMode, // 1 for stable, 2 for variable
      onBehalfOf: userAddress,
    })
    
    const extendedTxData = txs[0].tx
    const { from, ...txData } = extendedTxData
    const tx = await signer.sendTransaction({
      ...txData,
      value: txData.value ? txData.value.toString() : '0',
    })
    
    console.log('Repay transaction hash:', tx.hash)
    
    const receipt = await tx.wait(1)
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error) {
    console.error('Error repaying loan:', error)
    throw error
  }
}

// Example usage
async function aaveExample() {
  // DAI address on Ethereum Mainnet
  const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  
  try {
    // First, deposit some DAI into Aave
    await depositToAave(
      DAI_ADDRESS,
      ethers.utils.parseUnits('100', 18).toString(), // 100 DAI
      0 // Not used for deposit
    )
    
    // Check account data after deposit
    await getUserAccountData()
    
    // Borrow some USDC using our DAI as collateral
    const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    await borrowFromAave(
      USDC_ADDRESS,
      ethers.utils.parseUnits('50', 6).toString(), // 50 USDC
      2 // Variable interest rate
    )
    
    // Check account data after borrow
    await getUserAccountData()
    
    // Later, repay the loan
    await repayLoan(
      USDC_ADDRESS,
      ethers.utils.parseUnits('50', 6).toString(), // 50 USDC
      2 // Variable interest rate
    )
    
    // Check final account data
    await getUserAccountData()
  } catch (error) {
    console.error('Error in Aave example:', error)
  }
}

// Call the example function
// aaveExample()
```

### 3.3 Integrasi Compound SDK

[Compound.js](https://github.com/compound-finance/compound-js) adalah library untuk berinteraksi dengan protokol Compound.

#### Instalasi Compound SDK

```bash
npm install compound-js
```

#### Contoh Penggunaan Compound SDK

```typescript
import Compound from 'compound-js'
import { ethers } from 'ethers'

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL')
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider)

// Initialize Compound with provider
const compound = new Compound(provider, { from: signer.address })

// Function to supply assets to Compound
async function supplyToCompound(asset: string, amount: string) {
  try {
    const userAddress = await signer.getAddress()
    
    // First, approve the cToken contract to spend the underlying
    const cTokenAddress = Compound.util.getAddress(`c${asset}`)
    const underlyingAddress = Compound.util.getAddress(asset)
    
    // Create ERC20 contract instance
    const erc20Contract = new ethers.Contract(
      underlyingAddress,
      ['function approve(address spender, uint256 amount) public returns (bool)'],
      signer
    )
    
    // Approve cToken to spend our tokens
    const approveTx = await erc20Contract.approve(
      cTokenAddress,
      ethers.constants.MaxUint256 // Infinite approval (use with caution)
    )
    
    console.log('Approval transaction hash:', approveTx.hash)
    await approveTx.wait(1)
    
    // Supply to Compound
    const tx = await compound.supply(asset, amount)
    
    console.log('Supply transaction hash:', tx.hash)
    const receipt = await tx.wait(1)
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error) {
    console.error('Error supplying to Compound:', error)
    throw error
  }
}

// Function to borrow from Compound
async function borrowFromCompound(asset: string, amount: string) {
  try {
    // Borrow from Compound
    const tx = await compound.borrow(asset, amount)
    
    console.log('Borrow transaction hash:', tx.hash)
    const receipt = await tx.wait(1)
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error) {
    console.error('Error borrowing from Compound:', error)
    throw error
  }
}

// Function to repay a Compound loan
async function repayCompoundLoan(asset: string, amount: string) {
  try {
    const userAddress = await signer.getAddress()
    
    // First, approve the cToken contract to spend the underlying
    const cTokenAddress = Compound.util.getAddress(`c${asset}`)
    const underlyingAddress = Compound.util.getAddress(asset)
    
    // Create ERC20 contract instance
    const erc20Contract = new ethers.Contract(
      underlyingAddress,
      ['function approve(address spender, uint256 amount) public returns (bool)'],
      signer
    )
    
    // Approve cToken to spend our tokens
    const approveTx = await erc20Contract.approve(
      cTokenAddress,
      amount
    )
    
    console.log('Approval transaction hash:', approveTx.hash)
    await approveTx.wait(1)
    
    // Repay loan
    const tx = await compound.repayBorrow(asset, amount)
    
    console.log('Repay transaction hash:', tx.hash)
    const receipt = await tx.wait(1)
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error) {
    console.error('Error repaying Compound loan:', error)
    throw error
  }
}

// Function to get account liquidity
async function getAccountLiquidity() {
  try {
    const userAddress = await signer.getAddress()
    
    const accountLiquidity = await compound.getAccountLiquidity(userAddress)
    
    console.log('Account Liquidity:', {
      error: accountLiquidity.error,
      liquidity: ethers.utils.formatEther(accountLiquidity.liquidity),
      shortfall: ethers.utils.formatEther(accountLiquidity.shortfall),
    })
    
    return accountLiquidity
  } catch (error) {
    console.error('Error getting account liquidity:', error)
    throw error
  }
}

// Example usage
async function compoundExample() {
  try {
    // Supply DAI to Compound
    await supplyToCompound(
      'DAI',
      ethers.utils.parseUnits('100', 18).toString() // 100 DAI
    )
    
    // Check account liquidity after supply
    await getAccountLiquidity()
    
    // Borrow USDC using our DAI as collateral
    await borrowFromCompound(
      'USDC',
      ethers.utils.parseUnits('50', 6).toString() // 50 USDC
    )
    
    // Check account liquidity after borrow
    await getAccountLiquidity()
    
    // Later, repay the loan
    await repayCompoundLoan(
      'USDC',
      ethers.utils.parseUnits('50', 6).toString() // 50 USDC
    )
    
    // Check final account liquidity
    await getAccountLiquidity()
  } catch (error) {
    console.error('Error in Compound example:', error)
  }
}

// Call the example function
// compoundExample()
```

---

## Bagian 4: Hands-on: DApp Frontend Swap & Lending Simulation

Sekarang kita akan membangun frontend dApp sederhana yang menggabungkan swap pada DEX (Uniswap) dan lending/borrowing (Aave) dalam satu aplikasi.

### 4.1 Setup Proyek

Kita akan menggunakan Next.js dengan TypeScript, Ethers.js untuk interaksi blockchain, dan Tailwind CSS untuk styling.

```bash
# Create new Next.js project
npx create-next-app@latest defi-frontend --typescript
cd defi-frontend

# Install dependencies
npm install ethers@5.7.2 @uniswap/sdk-core @uniswap/v3-sdk @aave/protocol-js
npm install @headlessui/react @heroicons/react
npm install react-toastify

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4.2 Struktur Proyek

```
defi-frontend/
├── components/
│   ├── ConnectButton.tsx
│   ├── Header.tsx
│   ├── Swap.tsx
│   ├── LendingPool.tsx
│   ├── TokenSelect.tsx
│   ├── AmountInput.tsx
│   └── Layout.tsx
├── contexts/
│   └── Web3Context.tsx
├── hooks/
│   ├── useUniswap.ts
│   └── useAave.ts
├── utils/
│   ├── constants.ts
│   ├── tokens.ts
│   └── helpers.ts
├── pages/
│   ├── index.tsx
│   ├── swap.tsx
│   └── lending.tsx
├── styles/
│   └── globals.css
└── public/
    └── tokens/
        ├── eth.svg
        ├── dai.svg
        └── ...
```

### 4.3 Setup Tailwind CSS

Ubah `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f8ff',
          100: '#e4ebfa',
          200: '#d1dfff',
          300: '#a6c0ff',
          400: '#7b9eff',
          500: '#507cff',
          600: '#3366ff', // Primary
          700: '#2952cc',
          800: '#1f3d99',
          900: '#162b66',
        },
      },
    },
  },
  plugins: [],
}
```

### 4.4 Web3 Context

Buat file `contexts/Web3Context.tsx`:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

interface Web3ContextProps {
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  account: string | null
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
}

const Web3Context = createContext<Web3ContextProps>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Handle account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  // Try to reconnect on mount if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            connectWallet()
          }
        } catch (error) {
          console.error('Failed to check connection:', error)
        }
      }
    }
    
    checkConnection()
  }, [])

  // Handle account change
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
      toast.info('Wallet disconnected')
    } else if (accounts[0] !== account) {
      setAccount(accounts[0])
      toast.success(`Connected to account: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`)
    }
  }

  // Handle chain change
  const handleChainChanged = (chainIdHex: string) => {
    const newChainId = parseInt(chainIdHex, 16)
    setChainId(newChainId)
    window.location.reload()
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet found. Please install MetaMask')
      return
    }
    
    setIsConnecting(true)
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
      const ethersSigner = ethersProvider.getSigner()
      const network = await ethersProvider.getNetwork()
      
      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setAccount(accounts[0])
      setChainId(network.chainId)
      
      toast.success(`Connected to account: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
  }

  return (
    <Web3Context.Provider 
      value={{ 
        provider, 
        signer, 
        account, 
        chainId, 
        connectWallet, 
        disconnectWallet, 
        isConnecting 
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
```

### 4.5 Uniswap Custom Hook

Buat file `hooks/useUniswap.ts`:

```typescript
import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Pool, Route, SwapQuoter, SwapRouter, Trade } from '@uniswap/v3-sdk'
import { useWeb3 } from '../contexts/Web3Context'
import { SUPPORTED_TOKENS, SWAP_ROUTER_ADDRESS } from '../utils/constants'
import { toast } from 'react-toastify'

// SwapRouter ABI (minimal for swap function)
const SWAP_ROUTER_ABI = [
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'
]

interface SwapParams {
  tokenIn: Token
  tokenOut: Token
  amountIn: string
  slippageTolerance: number
}

interface QuoteResult {
  amountOut: string
  priceImpact: string
  loading: boolean
  error: string | null
}

export function useUniswap() {
  const { provider, signer, account } = useWeb3()
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    amountOut: '0',
    priceImpact: '0',
    loading: false,
    error: null
  })

  // Get quote for swap
  const getQuote = useCallback(async (params: SwapParams) => {
    if (!provider || !account) {
      setQuoteResult(prev => ({ ...prev, error: 'Wallet not connected' }))
      return
    }

    setQuoteResult(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { tokenIn, tokenOut, amountIn, slippageTolerance } = params
      
      // NOTE: In a real implementation, you would:
      // 1. Fetch the pool state from the chain
      // 2. Create a Pool instance
      // 3. Calculate the quote using the Pool
      // 
      // This is simplified for the example
      
      // Simulate getting a quote
      const parsedAmount = ethers.utils.parseUnits(amountIn, tokenIn.decimals)
      
      // Simulated delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate quote calculation
      // In a real implementation, this would come from querying the pool
      const simulatedRate = tokenIn.symbol === 'ETH' ? 1800 : 1/1800
      const rawAmountOut = Number(amountIn) * simulatedRate
      const amountOut = rawAmountOut.toFixed(tokenOut.decimals)
      
      // Simulate price impact
      const priceImpact = (Number(amountIn) / 1000).toFixed(2)
      
      setQuoteResult({
        amountOut,
        priceImpact: priceImpact,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error getting quote:', error)
      setQuoteResult({
        amountOut: '0',
        priceImpact: '0',
        loading: false,
        error: 'Failed to get quote'
      })
    }
  }, [provider, account])

  // Execute swap
  const executeSwap = useCallback(async (params: SwapParams) => {
    if (!provider || !signer || !account) {
      toast.error('Wallet not connected')
      return
    }

    try {
      const { tokenIn, tokenOut, amountIn, slippageTolerance } = params
      
      // Parse amount
      const parsedAmountIn = ethers.utils.parseUnits(amountIn, tokenIn.decimals)
      
      // Get quote
      await getQuote(params)
      
      // Calculate amount out minimum with slippage
      const parsedAmountOut = ethers.utils.parseUnits(quoteResult.amountOut, tokenOut.decimals)
      const slippageFactor = 10000 - slippageTolerance * 100 // Convert percent to basis points
      const amountOutMinimum = parsedAmountOut.mul(slippageFactor).div(10000)
      
      // Create swap router contract
      const swapRouterContract = new ethers.Contract(
        SWAP_ROUTER_ADDRESS,
        SWAP_ROUTER_ABI,
        signer
      )
      
      // Prepare swap parameters
      const swapParams = {
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        fee: 3000, // 0.3%
        recipient: account,
        deadline: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
        amountIn: parsedAmountIn.toString(),
        amountOutMinimum: amountOutMinimum.toString(),
        sqrtPriceLimitX96: 0
      }
      
      // Execute swap
      const tx = await swapRouterContract.exactInputSingle(swapParams)
      
      toast.info('Swap transaction submitted')
      
      // Wait for transaction to be mined
      const receipt = await tx.wait()
      
      toast.success('Swap successful!')
      
      return receipt
    } catch (error) {
      console.error('Error executing swap:', error)
      toast.error('Swap failed')
    }
  }, [provider, signer, account, quoteResult, getQuote])

  return {
    getQuote,
    executeSwap,
    quoteResult
  }
}
```

### 4.6 Aave Custom Hook

Buat file `hooks/useAave.ts`:

```typescript
import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '../contexts/Web3Context'
import { toast } from 'react-toastify'
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from '../utils/constants'

interface LendingPoolState {
  userAccountData: {
    totalCollateralETH: string
    totalDebtETH: string
    availableBorrowsETH: string
    currentLiquidationThreshold: string
    ltv: string
    healthFactor: string
  } | null
  loading: boolean
  error: string | null
}

export function useAave() {
  const { provider, signer, account } = useWeb3()
  const [lendingPoolState, setLendingPoolState] = useState<LendingPoolState>({
    userAccountData: null,
    loading: false,
    error: null
  })

  // Get user account data
  const getUserAccountData = useCallback(async () => {
    if (!provider || !account) {
      setLendingPoolState(prev => ({ ...prev, error: 'Wallet not connected' }))
      return
    }

    setLendingPoolState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const lendingPoolContract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LENDING_POOL_ABI,
        provider
      )
      
      const result = await lendingPoolContract.getUserAccountData(account)
      
      setLendingPoolState({
        userAccountData: {
          totalCollateralETH: ethers.utils.formatEther(result.totalCollateralETH),
          totalDebtETH: ethers.utils.formatEther(result.totalDebtETH),
          availableBorrowsETH: ethers.utils.formatEther(result.availableBorrowsETH),
          currentLiquidationThreshold: result.currentLiquidationThreshold.toString(),
          ltv: result.ltv.toString(),
          healthFactor: ethers.utils.formatEther(result.healthFactor)
        },
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error getting user account data:', error)
      setLendingPoolState({
        userAccountData: null,
        loading: false,
        error: 'Failed to get user account data'
      })
    }
  }, [provider, account])

  // Deposit to Aave
  const deposit = useCallback(async (
    asset: string,
    amount: string,
    decimals: number
  ) => {
    if (!provider || !signer || !account) {
      toast.error('Wallet not connected')
      return
    }

    try {
      // Create ERC20 contract instance for approval
      const erc20Contract = new ethers.Contract(
        asset,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      )
      
      // Approve lending pool to spend tokens
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)
      const approveTx = await erc20Contract.approve(LENDING_POOL_ADDRESS, parsedAmount)
      
      toast.info('Approval transaction submitted')
      await approveTx.wait()
      
      // Create lending pool contract instance
      const lendingPoolContract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LENDING_POOL_ABI,
        signer
      )
      
      // Execute deposit
      const tx = await lendingPoolContract.deposit(
        asset,
        parsedAmount,
        account,
        0 // referralCode
      )
      
      toast.info('Deposit transaction submitted')
      
      // Wait for transaction to be mined
      const receipt = await tx.wait()
      
      toast.success('Deposit successful!')
      
      // Refresh user account data
      getUserAccountData()
      
      return receipt
    } catch (error) {
      console.error('Error depositing to Aave:', error)
      toast.error('Deposit failed')
    }
  }, [provider, signer, account, getUserAccountData])

  // Borrow from Aave
  const borrow = useCallback(async (
    asset: string,
    amount: string,
    decimals: number,
    interestRateMode: number
  ) => {
    if (!provider || !signer || !account) {
      toast.error('Wallet not connected')
      return
    }

    try {
      // Create lending pool contract instance
      const lendingPoolContract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LENDING_POOL_ABI,
        signer
      )
      
      // Execute borrow
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)
      const tx = await lendingPoolContract.borrow(
        asset,
        parsedAmount,
        interestRateMode, // 1 for stable, 2 for variable
        0, // referralCode
        account
      )
      
      toast.info('Borrow transaction submitted')
      
      // Wait for transaction to be mined
      const receipt = await tx.wait()
      
      toast.success('Borrow successful!')
      
      // Refresh user account data
      getUserAccountData()
      
      return receipt
    } catch (error) {
      console.error('Error borrowing from Aave:', error)
      toast.error('Borrow failed')
    }
  }, [provider, signer, account, getUserAccountData])

// Repay loan
  const repay = useCallback(async (
    asset: string,
    amount: string,
    decimals: number,
    interestRateMode: number
  ) => {
    if (!provider || !signer || !account) {
      toast.error('Wallet not connected')
      return
    }

    try {
      // Create ERC20 contract instance for approval
      const erc20Contract = new ethers.Contract(
        asset,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      )
      
      // Approve lending pool to spend tokens
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)
      const approveTx = await erc20Contract.approve(LENDING_POOL_ADDRESS, parsedAmount)
      
      toast.info('Approval transaction submitted')
      await approveTx.wait()
      
      // Create lending pool contract instance
      const lendingPoolContract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LENDING_POOL_ABI,
        signer
      )
      
      // Execute repay
      const tx = await lendingPoolContract.repay(
        asset,
        parsedAmount,
        interestRateMode, // 1 for stable, 2 for variable
        account
      )
      
      toast.info('Repay transaction submitted')
      
      // Wait for transaction to be mined
      const receipt = await tx.wait()
      
      toast.success('Repay successful!')
      
      // Refresh user account data
      getUserAccountData()
      
      return receipt
    } catch (error) {
      console.error('Error repaying loan:', error)
      toast.error('Repay failed')
    }
  }, [provider, signer, account, getUserAccountData])

  return {
    getUserAccountData,
    deposit,
    borrow,
    repay,
    lendingPoolState
  }
}
```

### 4.7 UI Components

#### Connect Button Component

```tsx
// components/ConnectButton.tsx
import React from 'react'
import { useWeb3 } from '../contexts/Web3Context'

export const ConnectButton: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3()

  return (
    <div>
      {!account ? (
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium bg-gray-100 py-1 px-3 rounded-full">
            {account.substring(0, 6)}...{account.substring(38)}
          </span>
          <button
            className="text-sm text-gray-600 hover:text-red-600"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
```

#### Header Component

```tsx
// components/Header.tsx
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ConnectButton } from './ConnectButton'

export const Header: React.FC = () => {
  const router = useRouter()
  
  const isActive = (path: string) => router.pathname === path

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold text-primary-600">DeFi Hub</a>
            </Link>
            <nav className="ml-8 flex items-center space-x-4">
              <Link href="/swap">
                <a className={`px-3 py-2 rounded-lg ${
                  isActive('/swap') 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Swap
                </a>
              </Link>
              <Link href="/lending">
                <a className={`px-3 py-2 rounded-lg ${
                  isActive('/lending') 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Lending
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
```

#### Token Select Component

```tsx
// components/TokenSelect.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { SUPPORTED_TOKENS } from '../utils/constants'

interface TokenSelectProps {
  value: string
  onChange: (tokenAddress: string) => void
}

export const TokenSelect: React.FC<TokenSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedToken = SUPPORTED_TOKENS.find(token => token.address === value)
  
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={() => setIsOpen(true)}
      >
        {selectedToken && (
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 relative">
              <Image
                src={`/tokens/${selectedToken.symbol.toLowerCase()}.svg`}
                alt={selectedToken.symbol}
                layout="fill"
              />
            </div>
            <span>{selectedToken.symbol}</span>
          </div>
        )}
        <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
      </button>
      
      <Transition
        show={isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            
            <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Select a token
              </Dialog.Title>
              
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {SUPPORTED_TOKENS.map(token => (
                  <button
                    key={token.address}
                    className="w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      onChange(token.address)
                      setIsOpen(false)
                    }}
                  >
                    <div className="w-8 h-8 relative mr-3">
                      <Image
                        src={`/tokens/${token.symbol.toLowerCase()}.svg`}
                        alt={token.symbol}
                        layout="fill"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{token.symbol}</p>
                      <p className="text-sm text-gray-500">{token.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
```

#### Amount Input Component

```tsx
// components/AmountInput.tsx
import React from 'react'

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  max?: string
  onMaxClick?: () => void
  disabled?: boolean
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  placeholder = '0.0',
  max,
  onMaxClick,
  disabled = false
}) => {
  return (
    <div className="relative rounded-md shadow-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          // Only allow numbers and a single decimal point
          const regex = /^[0-9]*[.]?[0-9]*$/
          if (e.target.value === '' || regex.test(e.target.value)) {
            onChange(e.target.value)
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-20 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {onMaxClick && max && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={onMaxClick}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            MAX
          </button>
        </div>
      )}
    </div>
  )
}
```

#### Swap Component

```tsx
// components/Swap.tsx
import React, { useState, useEffect } from 'react'
import { TokenSelect } from './TokenSelect'
import { AmountInput } from './AmountInput'
import { useUniswap } from '../hooks/useUniswap'
import { useWeb3 } from '../contexts/Web3Context'
import { SUPPORTED_TOKENS } from '../utils/constants'
import { ArrowDownIcon, SwitchVerticalIcon } from '@heroicons/react/solid'

export const Swap: React.FC = () => {
  const { account } = useWeb3()
  const { getQuote, executeSwap, quoteResult } = useUniswap()
  
  const [tokenInAddress, setTokenInAddress] = useState(SUPPORTED_TOKENS[0].address)
  const [tokenOutAddress, setTokenOutAddress] = useState(SUPPORTED_TOKENS[1].address)
  const [amountIn, setAmountIn] = useState('')
  const [slippage, setSlippage] = useState(0.5) // 0.5%
  
  const tokenIn = SUPPORTED_TOKENS.find(token => token.address === tokenInAddress)
  const tokenOut = SUPPORTED_TOKENS.find(token => token.address === tokenOutAddress)
  
  // Get quote when inputs change
  useEffect(() => {
    if (tokenIn && tokenOut && amountIn && Number(amountIn) > 0) {
      getQuote({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn,
        slippageTolerance: slippage
      })
    }
  }, [tokenIn, tokenOut, amountIn, slippage, getQuote])
  
  // Swap tokens function
  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn || Number(amountIn) <= 0) return
    
    await executeSwap({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      amountIn,
      slippageTolerance: slippage
    })
  }
  
  // Switch tokens function
  const handleSwitchTokens = () => {
    setTokenInAddress(tokenOutAddress)
    setTokenOutAddress(tokenInAddress)
    setAmountIn('')
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Swap Tokens</h2>
      
      <div className="space-y-4">
        {/* From token section */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">From</label>
            {account && tokenIn && (
              <span className="text-sm text-gray-500">
                Balance: [User balance would show here]
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <AmountInput
                value={amountIn}
                onChange={setAmountIn}
                placeholder="0.0"
                // In a real app, you would use the actual balance here
                max="1000"
                onMaxClick={() => setAmountIn('1000')}
                disabled={!account}
              />
            </div>
            <TokenSelect value={tokenInAddress} onChange={setTokenInAddress} />
          </div>
        </div>
        
        {/* Swap direction button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwitchTokens}
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <SwitchVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* To token section */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">To</label>
            {account && tokenOut && (
              <span className="text-sm text-gray-500">
                Balance: [User balance would show here]
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="flex items-center h-full rounded-md bg-gray-100 px-3">
                <span className="block w-full text-gray-700">
                  {quoteResult.loading 
                    ? 'Loading...' 
                    : quoteResult.amountOut !== '0' 
                      ? quoteResult.amountOut 
                      : '0.0'
                  }
                </span>
              </div>
            </div>
            <TokenSelect value={tokenOutAddress} onChange={setTokenOutAddress} />
          </div>
        </div>
        
        {/* Price information */}
        {quoteResult.amountOut !== '0' && !quoteResult.loading && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price</span>
              <span className="text-gray-900 font-medium">
                1 {tokenIn?.symbol} = {parseFloat(quoteResult.amountOut) / parseFloat(amountIn)} {tokenOut?.symbol}
              </span>
            </div>
            
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Price Impact</span>
              <span className="text-gray-900 font-medium">
                {quoteResult.priceImpact}%
              </span>
            </div>
            
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Slippage Tolerance</span>
              <span className="text-gray-900 font-medium">
                {slippage}%
              </span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {quoteResult.error && (
          <div className="mt-2 text-sm text-red-600">
            {quoteResult.error}
          </div>
        )}
        
        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={!account || !amountIn || Number(amountIn) <= 0 || quoteResult.loading}
          className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {!account 
            ? 'Connect Wallet' 
            : quoteResult.loading 
              ? 'Loading...' 
              : 'Swap'
          }
        </button>
      </div>
    </div>
  )
}
```

#### Lending Pool Component

```tsx
// components/LendingPool.tsx
import React, { useState, useEffect } from 'react'
import { TokenSelect } from './TokenSelect'
import { AmountInput } from './AmountInput'
import { useAave } from '../hooks/useAave'
import { useWeb3 } from '../contexts/Web3Context'
import { SUPPORTED_TOKENS } from '../utils/constants'
import { Tab } from '@headlessui/react'

export const LendingPool: React.FC = () => {
  const { account } = useWeb3()
  const { getUserAccountData, deposit, borrow, repay, lendingPoolState } = useAave()
  
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(SUPPORTED_TOKENS[0].address)
  const [amount, setAmount] = useState('')
  const [interestRateMode, setInterestRateMode] = useState(2) // 2 = Variable
  
  const selectedToken = SUPPORTED_TOKENS.find(token => token.address === selectedTokenAddress)
  
  // Get user account data when component mounts or account changes
  useEffect(() => {
    if (account) {
      getUserAccountData()
    }
  }, [account, getUserAccountData])
  
  // Handle deposit
  const handleDeposit = async () => {
    if (!selectedToken || !amount || Number(amount) <= 0) return
    
    await deposit(
      selectedToken.address,
      amount,
      selectedToken.decimals
    )
  }
  
  // Handle borrow
  const handleBorrow = async () => {
    if (!selectedToken || !amount || Number(amount) <= 0) return
    
    await borrow(
      selectedToken.address,
      amount,
      selectedToken.decimals,
      interestRateMode
    )
  }
  
  // Handle repay
  const handleRepay = async () => {
    if (!selectedToken || !amount || Number(amount) <= 0) return
    
    await repay(
      selectedToken.address,
      amount,
      selectedToken.decimals,
      interestRateMode
    )
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Lending Pool</h2>
      
      {/* Account overview */}
      {account && lendingPoolState.userAccountData && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Account</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Collateral</p>
              <p className="text-sm font-medium">{parseFloat(lendingPoolState.userAccountData.totalCollateralETH).toFixed(4)} ETH</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Debt</p>
              <p className="text-sm font-medium">{parseFloat(lendingPoolState.userAccountData.totalDebtETH).toFixed(4)} ETH</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Available to Borrow</p>
              <p className="text-sm font-medium">{parseFloat(lendingPoolState.userAccountData.availableBorrowsETH).toFixed(4)} ETH</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Health Factor</p>
              <p className={`text-sm font-medium ${
                parseFloat(lendingPoolState.userAccountData.healthFactor) < 1.1 
                  ? 'text-red-600' 
                  : parseFloat(lendingPoolState.userAccountData.healthFactor) < 1.5 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
              }`}>
                {parseFloat(lendingPoolState.userAccountData.healthFactor).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-300 focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-800'
                }
              `
            }
          >
            Deposit
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-300 focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-800'
                }
              `
            }
          >
            Borrow
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-300 focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-800'
                }
              `
            }
          >
            Repay
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Deposit Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Asset</label>
                  {account && selectedToken && (
                    <span className="text-sm text-gray-500">
                      Balance: [User balance would show here]
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <AmountInput
                      value={amount}
                      onChange={setAmount}
                      placeholder="0.0"
                      // In a real app, you would use the actual balance here
                      max="1000"
                      onMaxClick={() => setAmount('1000')}
                      disabled={!account}
                    />
                  </div>
                  <TokenSelect value={selectedTokenAddress} onChange={setSelectedTokenAddress} />
                </div>
              </div>
              
              <button
                onClick={handleDeposit}
                disabled={!account || !amount || Number(amount) <= 0 || lendingPoolState.loading}
                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {!account 
                  ? 'Connect Wallet' 
                  : lendingPoolState.loading 
                    ? 'Loading...' 
                    : 'Deposit'
                }
              </button>
            </div>
          </Tab.Panel>
          
          {/* Borrow Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Asset</label>
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <AmountInput
                      value={amount}
                      onChange={setAmount}
                      placeholder="0.0"
                      disabled={!account}
                    />
                  </div>
                  <TokenSelect value={selectedTokenAddress} onChange={setSelectedTokenAddress} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate Type</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                      interestRateMode === 1
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setInterestRateMode(1)}
                  >
                    Stable
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                      interestRateMode === 2
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setInterestRateMode(2)}
                  >
                    Variable
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleBorrow}
                disabled={
                  !account || 
                  !amount || 
                  Number(amount) <= 0 || 
                  lendingPoolState.loading ||
                  !lendingPoolState.userAccountData ||
                  parseFloat(lendingPoolState.userAccountData.availableBorrowsETH) <= 0
                }
                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {!account 
                  ? 'Connect Wallet' 
                  : lendingPoolState.loading 
                    ? 'Loading...' 
                    : !lendingPoolState.userAccountData || parseFloat(lendingPoolState.userAccountData.availableBorrowsETH) <= 0
                      ? 'Not Enough Collateral'
                      : 'Borrow'
                }
              </button>
            </div>
          </Tab.Panel>
          
          {/* Repay Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Asset</label>
                  {account && selectedToken && (
                    <span className="text-sm text-gray-500">
                      Balance: [User balance would show here]
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <AmountInput
                      value={amount}
                      onChange={setAmount}
                      placeholder="0.0"
                      // In a real app, you would use the actual balance here
                      max="1000"
                      onMaxClick={() => setAmount('1000')}
                      disabled={!account}
                    />
                  </div>
                  <TokenSelect value={selectedTokenAddress} onChange={setSelectedTokenAddress} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate Type</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                      interestRateMode === 1
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setInterestRateMode(1)}
                  >
                    Stable
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                      interestRateMode === 2
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setInterestRateMode(2)}
                  >
                    Variable
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleRepay}
                disabled={!account || !amount || Number(amount) <= 0 || lendingPoolState.loading}
                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {!account 
                  ? 'Connect Wallet' 
                  : lendingPoolState.loading 
                    ? 'Loading...' 
                    : 'Repay'
                }
              </button>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
```

#### Layout Component

```tsx
// components/Layout.tsx
import React from 'react'
import { Header } from './Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
```

### 4.8 Pages

#### Index Page

```tsx
// pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>DeFi Hub - Home</title>
        <meta name="description" content="Your gateway to decentralized finance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-12 bg-white shadow rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">DeFi Hub</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your gateway to decentralized finance
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Swap tokens, supply liquidity, borrow, and lend - all in one place.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Token Swaps</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Swap tokens instantly using our integration with leading DEXes.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link href="/swap">
                      <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        Go to Swap
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Lending & Borrowing</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Supply assets to earn interest or borrow assets using your collateral.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link href="/lending">
                      <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        Go to Lending
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
```

#### Swap Page

```tsx
// pages/swap.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from '../components/Layout'
import { Swap } from '../components/Swap'

const SwapPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>DeFi Hub - Swap</title>
        <meta name="description" content="Swap tokens instantly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-xl mx-auto">
        <Swap />
      </div>
    </Layout>
  )
}

export default SwapPage
```

#### Lending Page

```tsx
// pages/lending.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from '../components/Layout'
import { LendingPool } from '../components/LendingPool'

const LendingPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>DeFi Hub - Lending</title>
        <meta name="description" content="Supply and borrow assets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-xl mx-auto">
        <LendingPool />
      </div>
    </Layout>
  )
}

export default LendingPage
```

### 4.9 Constants and Utils

#### Constants

```tsx
// utils/constants.ts
import { Token } from '@uniswap/sdk-core'

// Supported Chain ID (Ethereum Mainnet)
export const CHAIN_ID = 1

// Supported Tokens
export const SUPPORTED_TOKENS = [
  new Token(
    CHAIN_ID,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  new Token(
    CHAIN_ID,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    6,
    'USDC',
    'USD Coin'
  ),
  new Token(
    CHAIN_ID,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  new Token(
    CHAIN_ID,
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  )
]

// Uniswap Addresses
export const SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

// Aave Addresses
export const LENDING_POOL_ADDRESS = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'

// Minimal ABI for LendingPool
export const LENDING_POOL_ABI = [
  'function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)',
  'function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)',
  'function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) returns (uint256)'
]
```

### 4.10 Menjalankan Aplikasi

Dengan semua komponen, halaman, dan utilitas yang sudah disiapkan, kita sekarang dapat menjalankan aplikasi frontend DeFi kita:

```bash
npm run dev
```

Aplikasi akan tersedia di http://localhost:3000. Pengguna dapat bernavigasi antara antarmuka swap dan peminjaman, menghubungkan dompet mereka, dan berinteraksi dengan protokol DeFi yang disimulasikan.

## Kesimpulan

Dalam sesi ini, kita telah membahas:

1. **Mekanisme Protokol DeFi**:
   - Memahami mekanisme AMM (Automated Market Maker) di Uniswap V2, V3, dan fitur hooks yang akan datang di V4
   - Mempelajari protokol peminjaman & pinjaman seperti Aave dan Compound

2. **Integrasi SDK**:
   - Menggunakan SDK Uniswap untuk pertukaran token dan penyediaan likuiditas
   - Mengimplementasikan SDK Aave untuk peminjaman, pinjaman, dan pembayaran kembali
   - Bekerja dengan SDK Compound untuk operasi peminjaman serupa

3. **Pengembangan Frontend**:
   - Membangun antarmuka yang ramah pengguna untuk operasi DeFi
   - Mengimplementasikan koneksi dompet dan pengelolaan transaksi
   - Membuat komponen yang dapat digunakan kembali untuk pemilihan token dan input jumlah

4. **Praktik Terbaik**:
   - Penanganan kesalahan dan umpan balik pengguna dengan notifikasi toast
   - Desain responsif untuk berbagai ukuran layar
   - Pemisahan tanggung jawab dengan custom hooks

Proyek hands-on ini menunjukkan bagaimana menggabungkan beberapa protokol DeFi menjadi satu aplikasi, memberikan pengguna pengalaman terpadu untuk menukar token dan mengelola posisi peminjaman. Meskipun implementasi ini menggunakan data simulasi untuk tujuan demonstrasi, pola yang sama dapat diterapkan untuk membuat aplikasi DeFi siap produksi.

Langkah selanjutnya untuk meningkatkan aplikasi ini bisa meliputi:

1. **Menambahkan sumber data nyata** untuk harga token dan saldo
2. **Mengimplementasikan lebih banyak protokol DeFi** seperti yield farming atau staking
3. **Mendukung beberapa blockchain** untuk operasi DeFi lintas rantai
4. **Menambahkan fitur analitik dan pelacakan portofolio**
5. **Meningkatkan keamanan** dengan alur konfirmasi transaksi yang tepat

Dengan fondasi yang telah dibangun di sini, pengembang dapat memperluas dan menyesuaikan aplikasi untuk memenuhi kasus penggunaan DeFi tertentu dan kebutuhan pengguna.