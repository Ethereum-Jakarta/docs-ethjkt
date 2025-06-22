---
id: sesi-5
title: "DeFi Deep Dive, Demo Day & Simple DEX Build"
sidebar_label: "#5 DeFi & Demo Day"
sidebar_position: 5
description: "Retrospektif, presentasi proyek ERC, sejarah & teori DeFi yang mudah dipahami, dan hands-on membangun proyek DeFi sederhana."
---

# Sesi 5: DeFi Deep Dive, Demo Day & Simple DEX Build

## Informasi Umum Sesi

**Tanggal**: Hari 5  
**Durasi Total**: 8 jam (09:00 – 16:30)  
**Tema Pembelajaran**: Decentralized Finance Essentials  

Sesi ini menggabungkan showcase hasil belajar dari ERC token suite dengan pendalaman konsep DeFi fundamental. Peserta akan mempresentasikan proyek mereka, memahami evolusi DeFi, dan membangun aplikasi DeFi sederhana yang menggabungkan semua pengetahuan sebelumnya.

---

## Jadwal Harian Detail

| Waktu            | Aktivitas                                             | Tujuan                                                 | Materi & Fokus Utama                                       |
|------------------|-------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|
| 09:00 – 09:30    | Retrospective dan Q&A Session                         | Review lessons & troubleshooting                       | Diskusi gas-cost vs TVL, pengalaman deploy ERC-suite       |
| 09:30 – 12:00    | **Demo Day** — Presentasi Project ERC-20/721/1155    | Showcase & feedback                                    | Live demo, code review, UX critique                        |
| 13:30 – 15:00    | Kuliah — Sejarah & Teori DeFi (bahasa mudah)          | Memahami evolusi & konsep kunci DeFi                   | AMM, lending, stablecoin, yield farming, governance        |

---

## Retrospective & Q&A Session (09:00 – 09:30)

### Highlight Pencapaian Sesi 1-4

**🎓 Learning Journey Completed**:
- ✅ **Sesi 1**: Smart Contract fundamentals & gas optimization
- ✅ **Sesi 2**: Modular architecture & multi-signature wallets  
- ✅ **Sesi 3**: Advanced patterns (RBAC, upgradeable contracts, governance)
- ✅ **Sesi 4**: Token economics & full-stack integration

**🚀 Technical Achievements**:
- ERC-20/721/1155 token suite implemented
- Role-based access control mastered
- Upgradeable proxy patterns understood
- Full-stack Web3 applications deployed

### Common Challenges Identified

**⚡ Gas Optimization vs TVL Balance**:
```solidity
// Challenge: Optimal gas usage untuk liquidity operations
contract GasOptimizedPool {
    // Bad: Multiple storage reads
    function badSwap() external {
        uint256 reserve0 = getReserve0(); // SLOAD
        uint256 reserve1 = getReserve1(); // SLOAD
        // Multiple operations...
    }
    
    // Good: Single storage read dengan caching
    function goodSwap() external {
        (uint256 reserve0, uint256 reserve1) = getReserves(); // Single SLOAD
        // Efficient operations...
    }
}
```

**🔐 Re-entrancy pada Cross-Token Operations**:
```solidity
// Problem: ERC-1155 batch operations dengan ERC-20 swaps
contract SafeMultiToken {
    bool private locked;
    
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    function batchSwapAndMint(
        address[] calldata tokens,
        uint256[] calldata amounts
    ) external nonReentrant {
        // Safe cross-token operations
    }
}
```

### Interactive Q&A Topics

**Typical Developer Questions**:

1. **"Bagaimana cara calculate slippage dengan tepat?"**
   ```solidity
   function calculateSlippage(
       uint256 amountIn,
       uint256 expectedOut,
       uint256 actualOut
   ) pure returns (uint256) {
       if (actualOut >= expectedOut) return 0;
       return ((expectedOut - actualOut) * 10000) / expectedOut; // basis points
   }
   ```

2. **"Kenapa front-end sering stuck di 'pending transaction'?"**
   - Gas price too low untuk network congestion
   - Nonce conflicts dari multiple transactions
   - RPC provider rate limiting

3. **"Best practice untuk manage multiple token approvals?"**
   ```javascript
   // Frontend dengan wagmi
   const { data: allowance } = useReadContract({
     address: tokenAddress,
     abi: erc20ABI,
     functionName: 'allowance',
     args: [userAddress, spenderAddress],
   });
   
   const needsApproval = allowance < amountToSpend;
   ```

---

## Demo Day — Presentasi Project ERC-suite (09:30 – 12:00)

### Format Presentasi

**📊 Struktur Presentasi** (8 menit per tim):
1. **Live Demo** (5 menit): Tunjukkan semua fitur working
2. **Technical Deep Dive** (2 menit): Architecture & challenges solved  
3. **Q&A Session** (1 menit): Feedback dari judges & peserta

### Checklist Minimum Requirements

**✅ Core Features yang Harus Berfungsi**:

```markdown
**Smart Contract Layer**:
- [ ] ERC-20 Campus Credit dengan proper decimals & supply
- [ ] ERC-721 Student ID dengan soulbound properties
- [ ] ERC-1155 Course Badges dengan batch operations
- [ ] Multi-signature wallet untuk treasury management
- [ ] Role-based access control untuk admin functions

**Frontend Integration**:
- [ ] Wallet connection (MetaMask/WalletConnect)
- [ ] Real-time balance updates
- [ ] Transaction history display
- [ ] Admin panel untuk management
- [ ] Mobile-responsive design

**User Flows**:
- [ ] Student registration & ID minting
- [ ] Credit earning & spending
- [ ] Course completion & badge claiming
- [ ] Admin operations (mint, transfer, etc.)
- [ ] Emergency functions (pause, upgrade)
```

### Penilaian Demo Day

**🏆 Grading Rubric**:

| Kriteria | Bobot | Excellent (90-100) | Good (80-89) | Satisfactory (70-79) | Needs Improvement (60-69) |
|----------|-------|-------------------|--------------|---------------------|---------------------------|
| **Live Demo** | 35% | Semua fitur working flawlessly | Minor bugs, core features work | Most features working | Basic functionality only |
| **Code Quality** | 25% | Clean, optimized, well-documented | Good structure & comments | Readable code | Basic implementation |
| **Innovation** | 20% | Creative solutions & extra features | Some innovative elements | Standard implementation | Meets basic requirements |
| **User Experience** | 15% | Intuitive, polished interface | Good UX design | Functional interface | Basic UI |
| **Presentation** | 5% | Clear, engaging demo | Good explanation | Adequate presentation | Basic demo |

**🌟 Special Awards**:
- **Most Innovative**: Creative use of blockchain features
- **Best UX**: Most user-friendly interface
- **Technical Excellence**: Best code quality & architecture
- **People's Choice**: Voted by all participants
- **Most Practical**: Best real-world applicability

### Live Demo Scenarios

**👨‍🎓 Student Journey Simulation**:
```javascript
// Demo script untuk presentation
const demoFlow = [
  "1. Connect wallet as new student",
  "2. Register & mint Student ID NFT", 
  "3. Receive initial Campus Credits",
  "4. Complete course & earn badge",
  "5. Spend credits at campus merchant",
  "6. View transaction history",
  "7. Admin: mint new credits",
  "8. Emergency: pause system"
];
```

**🔧 Technical Questions to Prepare**:
- Bagaimana handle concurrent transactions?
- Gas optimization strategies yang digunakan?
- Security measures untuk admin functions?
- Scalability considerations untuk 1000+ students?
- Integration dengan existing campus systems?

---

## Kuliah — Sejarah & Teori DeFi (13:30 – 15:00)

### TL;DR Evolusi DeFi

**📈 Timeline DeFi Evolution**:
```
2009 ——————————————————————————————————————————————————————————————> 2024
  │         │         │         │         │         │         │
Bitcoin   MakerDAO   Uniswap   Aave     Curve     L2 Era   Restaking
  │         │         │         │         │         │         │
P2P Cash   CDP      AMM v1    Lending   Stable    zkSync    EigenLayer
         (2017)    (2018)    (2020)    AMM      Arbitrum    LRTs
                                     (2020)   Polygon    (2023)
                                              (2021)
```

**🧱 Building Blocks dari DeFi**:
1. **Cryptocurrency** (Bitcoin 2009): Digital money
2. **Smart Contracts** (Ethereum 2015): Programmable agreements  
3. **Collateralized Debt** (MakerDAO 2017): DAI stablecoin
4. **Automated Market Makers** (Uniswap 2018): Decentralized exchange
5. **Composability** (DeFi Summer 2020): Money legos
6. **Layer 2 Scaling** (2021): Cheaper transactions
7. **Liquid Staking** (2022): Productive capital
8. **Restaking** (2023): Securing multiple protocols

### Konsep Kunci DeFi

#### 1. Automated Market Makers (AMM)

**🧮 The Magic Formula: x * y = k**

```solidity
// Simplified Uniswap V2 Logic
contract SimpleDEX {
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public constant k = reserveA * reserveB;
    
    function swap(uint256 amountAIn) external returns (uint256 amountBOut) {
        require(amountAIn > 0, "Invalid input");
        
        // Calculate output using constant product formula
        // (x + Δx) * (y - Δy) = k
        // Δy = (y * Δx) / (x + Δx)
        
        amountBOut = (reserveB * amountAIn) / (reserveA + amountAIn);
        
        // Apply 0.3% fee
        amountBOut = (amountBOut * 997) / 1000;
        
        // Update reserves
        reserveA += amountAIn;
        reserveB -= amountBOut;
        
        require(reserveA * reserveB >= k, "K invariant violated");
    }
    
    function addLiquidity(uint256 amountA, uint256 amountB) 
        external 
        returns (uint256 lpTokens) 
    {
        if (reserveA == 0 && reserveB == 0) {
            // First liquidity provider sets the price
            lpTokens = sqrt(amountA * amountB);
        } else {
            // Maintain current price ratio
            require(amountA * reserveB == amountB * reserveA, "Price mismatch");
            lpTokens = min(
                (amountA * totalSupply) / reserveA,
                (amountB * totalSupply) / reserveB
            );
        }
        
        reserveA += amountA;
        reserveB += amountB;
        _mint(msg.sender, lpTokens);
    }
}
```

**💡 Analogi Ember Air**:
Bayangkan dua ember air yang terhubung. Jika Anda tuang air ke ember A, level air di ember B akan turun. Semakin banyak air di A, semakin "mahal" untuk menuangkan lebih banyak air (slippage meningkat).

#### 2. Lending & Borrowing

**🏦 Aave-style Lending Protocol**:

```solidity
contract SimpleLending {
    struct Market {
        uint256 totalSupply;
        uint256 totalBorrow;
        uint256 supplyAPY;
        uint256 borrowAPY;
        uint256 collateralFactor; // 80% = 8000 basis points
    }
    
    mapping(address => Market) public markets;
    mapping(address => mapping(address => uint256)) public userDeposits;
    mapping(address => mapping(address => uint256)) public userBorrows;
    
    function supply(address asset, uint256 amount) external {
        // Transfer tokens to pool
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Update user balance
        userDeposits[msg.sender][asset] += amount;
        markets[asset].totalSupply += amount;
        
        // Calculate and update interest rates
        updateInterestRates(asset);
    }
    
    function borrow(address asset, uint256 amount) external {
        // Check collateral health factor
        require(getHealthFactor(msg.sender) > 1e18, "Insufficient collateral");
        
        // Transfer borrowed tokens to user
        IERC20(asset).transfer(msg.sender, amount);
        
        // Update borrow balance
        userBorrows[msg.sender][asset] += amount;
        markets[asset].totalBorrow += amount;
        
        updateInterestRates(asset);
    }
    
    function getHealthFactor(address user) public view returns (uint256) {
        uint256 totalCollateralValue = 0;
        uint256 totalBorrowValue = 0;
        
        // Calculate across all assets
        // healthFactor = totalCollateralValue / totalBorrowValue
        // If > 1, user is safe. If < 1, liquidation risk.
        
        return totalCollateralValue * 1e18 / totalBorrowValue;
    }
}
```

#### 3. Yield Farming & Liquidity Mining

**🌾 Incentivizing Liquidity Provision**:

```solidity
contract YieldFarm {
    struct PoolInfo {
        IERC20 lpToken;           // LP token contract
        uint256 allocPoint;       // Allocation points for this pool
        uint256 lastRewardBlock;  // Last block that reward distribution occurred
        uint256 accRewardPerShare; // Accumulated reward per share
    }
    
    struct UserInfo {
        uint256 amount;           // LP tokens staked
        uint256 rewardDebt;       // Reward debt for calculations
    }
    
    IERC20 public rewardToken;
    uint256 public rewardPerBlock;
    
    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    
    function deposit(uint256 _pid, uint256 _amount) external {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        
        updatePool(_pid);
        
        // If user has existing stake, claim pending rewards
        if (user.amount > 0) {
            uint256 pending = (user.amount * pool.accRewardPerShare / 1e12) - user.rewardDebt;
            rewardToken.transfer(msg.sender, pending);
        }
        
        // Deposit LP tokens
        pool.lpToken.transferFrom(msg.sender, address(this), _amount);
        user.amount += _amount;
        user.rewardDebt = user.amount * pool.accRewardPerShare / 1e12;
    }
    
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        
        if (block.number <= pool.lastRewardBlock) return;
        
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        
        uint256 blocks = block.number - pool.lastRewardBlock;
        uint256 reward = blocks * rewardPerBlock * pool.allocPoint / totalAllocPoint;
        
        pool.accRewardPerShare += reward * 1e12 / lpSupply;
        pool.lastRewardBlock = block.number;
    }
}
```

### Real-World Use Cases

#### **💰 Liquidity Provision Example**

**Scenario**: Alice & Bob menyediakan likuiditas di ETH/USDC pool

```javascript
// Alice deposits 1 ETH + 2000 USDC (price = $2000)
// Bob deposits 0.5 ETH + 1000 USDC
// Total pool: 1.5 ETH + 3000 USDC

const aliceLP = sqrt(1 * 2000) = 44.72 LP tokens (66.67%)
const bobLP = sqrt(0.5 * 1000) = 22.36 LP tokens (33.33%)

// Trading fees earned proportionally:
// If pool earns 30 USDC in fees per day
// Alice earns: 30 * 0.6667 = 20 USDC
// Bob earns: 30 * 0.3333 = 10 USDC
```

#### **🏦 Lending/Borrowing Simulation**

**Scenario**: Charlie menggunakan ETH sebagai collateral untuk borrow USDC

```solidity
// Charlie's position:
// Collateral: 2 ETH @ $2000 = $4000 value
// Collateral Factor: 80%
// Max Borrow: $4000 * 0.8 = $3200 USDC

// Health Factor calculation:
// Collateral Value = $4000 * 0.8 = $3200
// Borrowed Value = $2000 USDC
// Health Factor = $3200 / $2000 = 1.6 (Safe)

// If ETH price drops to $1600:
// New Collateral Value = $3200 * 0.8 = $2560
// Health Factor = $2560 / $2000 = 1.28 (Still safe)

// If ETH price drops to $1250:
// New Collateral Value = $2500 * 0.8 = $2000
// Health Factor = $2000 / $2000 = 1.0 (Liquidation risk!)
```

### DeFi Risk Vectors

**⚠️ Common Risks untuk dipahami**:

1. **Smart Contract Risk**: Bugs dalam kode
2. **Impermanent Loss**: LP tokens vs holding assets
3. **Liquidation Risk**: Collateral value drops
4. **Slippage**: Price impact dari large trades
5. **Governance Risk**: Protocol changes via voting
6. **Oracle Risk**: Price feed manipulation

```solidity
// Slippage protection example
function swapWithSlippage(
    uint256 amountIn,
    uint256 minAmountOut,
    address[] calldata path
) external {
    uint256 amountOut = performSwap(amountIn, path);
    require(amountOut >= minAmountOut, "Slippage exceeded");
}
```

## Resources & Tools

### Development Resources

**Smart Contract**:
- [Uniswap V2 Core](https://github.com/Uniswap/v2-core) - Reference implementation
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/4.x/) - Security standards
- [Foundry Book](https://book.getfoundry.sh/) - Testing framework

**Frontend**:
- [wagmi Documentation](https://wagmi.sh/) - React hooks untuk Ethereum
- [Uniswap Interface](https://github.com/Uniswap/interface) - UI reference
- [SushiSwap Interface](https://github.com/sushiswap/sushiswap-interface) - Alternative reference

**DeFi Education**:
- [DeFi Pulse](https://defipulse.com/) - Protocol analytics
- [Finematics](https://finematics.com/) - DeFi explainers
- [The Defiant](https://thedefiant.io/) - DeFi news

### Judging Criteria

**🏆 Evaluation Rubric**:

| Criteria | Weight | Excellent (90-100) | Good (80-89) | Satisfactory (70-79) | Needs Improvement (60-69) |
|----------|--------|-------------------|--------------|---------------------|---------------------------|
| **Functionality** | 40% | All features working perfectly | Core swaps working, minor issues | Basic swap working | Limited functionality |
| **Code Quality** | 25% | Clean, optimized, documented | Well-structured code | Readable implementation | Basic code structure |
| **UX Design** | 20% | Intuitive, polished interface | Good user experience | Functional interface | Basic UI |
| **Security** | 10% | Comprehensive security measures | Basic security implemented | Some security considerations | Minimal security |
| **Presentation** | 5% | Engaging, clear demonstration | Good explanation | Adequate presentation | Basic demo |

---

## Kesimpulan Sesi 5

🎉 **DeFi Mastery Achieved!**

**Today's Accomplishments**:
- 🏆 **Demo Day Success**: Showcase dari 4 sesi pembelajaran
- 📚 **DeFi Fundamentals**: Understanding evolusi dan core concepts
- 🔄 **AMM Implementation**: Hands-on building decentralized exchange
- 💱 **Swap Mechanics**: Price discovery dengan constant product formula
- 🌊 **Liquidity Provision**: LP tokens dan yield generation
- 🛡️ **Security Patterns**: Slippage protection dan reentrancy guards

**Key DeFi Concepts Mastered**:
- **Automated Market Makers**: x*y=k formula implementation
- **Liquidity Mining**: Incentivizing capital provision
- **Impermanent Loss**: Risk-reward balance untuk LPs
- **Price Impact**: Large trade effects pada token prices
- **Composability**: Building blocks dari DeFi ecosystem

**Technical Skills Acquired**:
- DEX smart contract development
- AMM pricing algorithm implementation
- Frontend integration dengan swap interfaces
- Transaction slippage protection
- Liquidity pool management

**Real-World Applications**:
- **Campus Finance**: Internal token economy dengan external liquidity
- **Microfinance**: Small-scale lending dan borrowing
- **Local Commerce**: Community-based trading platforms
- **Educational DeFi**: Safe environment untuk learning financial concepts

**Complete Learning Journey**:
```
Sesi 1: Fundamentals → Sesi 2: Architecture → Sesi 3: Advanced Patterns
    ↓                      ↓                       ↓
Sesi 4: Integration → Sesi 5: DeFi → Real-World Applications
```

**Portfolio Completed**:
1. ✅ **ERC Token Suite**: 20/721/1155 dengan full integration
2. ✅ **DeFi Protocol**: Functional DEX dengan liquidity provision
3. ✅ **Full-Stack dApp**: End-to-end Web3 application
4. ✅ **Security Best Practices**: Production-ready smart contracts
5. ✅ **Modern Tooling**: Foundry, wagmi, TypeScript integration

**Next Steps Beyond Bootcamp**:
- Deploy to mainnet dengan proper security audits
- Implement advanced DeFi features (farming, governance)
- Explore cross-chain integration
- Build pada Layer 2 solutions
- Contribute to open-source DeFi protocols

*"The future of finance is programmable, and you now have the skills to build it!"* 🚀✨

---

Ready untuk the next chapter in your Web3 development journey! 🌟