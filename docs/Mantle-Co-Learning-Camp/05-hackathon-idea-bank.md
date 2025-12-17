---
id: hackathon-idea-bank
title: "Mantle Hackathon 2025 - Idea Bank"
sidebar_label: "Hackathon Idea Bank"
sidebar_position: 5
description: "Kumpulan ide project global dan unique untuk Mantle Global Hackathon 2025 - fokus pada solusi yang dapat diimplementasikan tanpa kompleksitas regulasi."
---

# Mantle Global Hackathon 2025 - Idea Bank

## 🎯 Overview

Dokumen ini berisi kumpulan ide project **global-first** dan **regulation-light** yang dapat dikerjakan untuk **Mantle Global Hackathon 2025**.

### Design Principles

```
✅ DO:
• Build on top of existing compliant RWA protocols (USDY, BUIDL, etc.)
• Focus on infrastructure, tooling, and user experience
• Create protocol-agnostic solutions
• Target DeFi-native users globally

❌ DON'T:
• Tokenize real assets directly (requires licenses)
• Build KYC/AML systems from scratch
• Create country-specific solutions
• Handle custody of real-world assets
```

### Prize Pool: $150,000 USD

| Track | Prize | Focus |
|-------|-------|-------|
| RWA / RealFi | $15,000 | Build ON TOP of existing RWA |
| DeFi & Composability | $15,000 | Composable yield & synthetics |
| AI & Oracles | $15,000 | Automation & data |
| ZK & Privacy | $15,000 | Privacy-preserving solutions |
| Infrastructure | $15,000 | Developer tools |
| GameFi & Social | $15,000 | Consumer apps |
| Grand Prize | $30,000 | Best overall |

---

# 🏆 TRACK 1: RWA / RealFi

> **Strategy:** Build infrastructure and tools ON TOP of existing compliant RWA protocols like Ondo USDY, BlackRock BUIDL, Backed xStocks - not tokenize assets yourself.

---

## 💡 Idea 1.1: RWA Index Protocol

### Uniqueness: ⭐⭐⭐⭐⭐
**First decentralized index fund for RWA tokens on Mantle**

### Problem
- Banyak RWA tokens tersedia (USDY, BUIDL, xStocks) tapi user harus manage sendiri
- Tidak ada cara mudah untuk diversified RWA exposure
- Rebalancing manual mahal dan time-consuming

### Solution
Index protocol yang bundle multiple RWA tokens menjadi satu:
- **$RWA-INDEX**: Single token representing basket of RWA
- **Auto-Rebalance**: Quarterly rebalancing berdasarkan market cap
- **Gas-Efficient**: Users trade 1 token instead of 5-10

### Why No Regulatory Issue?
```
User → Deposits USDC → RWA Index Contract → Buys existing compliant RWA tokens
                                          ↓
                              (USDY, BUIDL, xStocks already KYC-compliant)
```
- Protocol hanya aggregator, bukan issuer
- Underlying assets sudah compliant
- Similar model: DeFi Pulse Index (DPI), Bankless BED Index

### Technical Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                   RWA Index Protocol                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │────►│   Deposit    │────►│   Index      │
│   (USDC)     │     │   Router     │     │   Vault      │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                    ┌───────────────────────────┼───────────────┐
                    │                           │               │
                    ▼                           ▼               ▼
             ┌──────────┐               ┌──────────┐     ┌──────────┐
             │   USDY   │               │  BUIDL   │     │ xStocks  │
             │   40%    │               │   35%    │     │   25%    │
             └──────────┘               └──────────┘     └──────────┘
                    │                           │               │
                    └───────────────────────────┼───────────────┘
                                                │
                                                ▼
                                         ┌──────────┐
                                         │  $RWAIX  │
                                         │  Token   │
                                         └──────────┘
```

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRWAIndex {
    struct Component {
        address token;      // USDY, BUIDL, etc.
        uint256 weight;     // Target weight (basis points, 10000 = 100%)
        address priceFeed;  // Chainlink oracle
    }
}

contract RWAIndexVault is ERC4626 {
    Component[] public components;
    uint256 public constant REBALANCE_THRESHOLD = 500; // 5% deviation triggers rebalance

    function deposit(uint256 assets) external returns (uint256 shares);
    function redeem(uint256 shares) external returns (uint256 assets);
    function rebalance() external; // Anyone can call, incentivized
    function getIndexPrice() external view returns (uint256);
}

contract RebalanceKeeper {
    function checkRebalanceNeeded() external view returns (bool);
    function executeRebalance() external; // Keeper bot calls this
}
```

### Index Composition Example
| Token | Weight | Yield | Category |
|-------|--------|-------|----------|
| Ondo USDY | 40% | ~5% | Tokenized Treasury |
| BlackRock BUIDL | 30% | ~5% | Tokenized Treasury |
| Backed xAAPL | 15% | 0% + price | Tokenized Equity |
| Backed xMSFT | 15% | 0% + price | Tokenized Equity |

### Revenue Model
- Management fee: 0.5% annually (dari AUM)
- Rebalance keeper reward: 0.1% dari trade

### MVP Scope (6 minggu)
- [ ] IndexVault contract (ERC-4626)
- [ ] 3-token index (USDY + 2 mock tokens for testnet)
- [ ] Auto-rebalancing logic
- [ ] Simple frontend: deposit, redeem, view composition
- [ ] Deploy ke Mantle Sepolia

---

## 💡 Idea 1.2: RWA Yield Splitter (Pendle-style)

### Uniqueness: ⭐⭐⭐⭐⭐
**First yield tokenization protocol for RWA on Mantle**

### Problem
- USDY generates ~5% yield, but yield dan principal tied together
- Tidak bisa trade future yield separately
- No way to get fixed yield from variable RWA returns

### Solution
Split RWA tokens into Principal Token (PT) dan Yield Token (YT):
- **PT-USDY**: Claim principal at maturity
- **YT-USDY**: Claim all yield until maturity
- **Fixed Rate Market**: Trade PT/YT untuk lock in rates

### Why No Regulatory Issue?
- Hanya financial engineering di atas existing compliant tokens
- Similar to Pendle (already operating globally)
- No new asset creation, just derivative of existing

### How It Works
```
┌─────────────────────────────────────────────────────────────┐
│                    Yield Splitting Flow                      │
└─────────────────────────────────────────────────────────────┘

Day 0 (Deposit):
┌──────────┐          ┌──────────────┐
│  1 USDY  │────────►│   Splitter   │
│  ($100)  │          │   Contract   │
└──────────┘          └──────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        ┌──────────┐                ┌──────────┐
        │ PT-USDY  │                │ YT-USDY  │
        │ (Principal)               │ (Yield)  │
        │ ~$95.24  │                │ ~$4.76   │
        └──────────┘                └──────────┘

Day 365 (Maturity):
PT-USDY → Redeem for 1 USDY (principal)
YT-USDY → Claim accumulated yield (~$5)
```

### Use Cases
| User | Strategy | Action |
|------|----------|--------|
| **Yield Bull** | "Yield will increase" | Buy YT (leveraged yield exposure) |
| **Yield Bear** | "Want fixed rate" | Sell YT, hold PT (lock in rate) |
| **Arbitrageur** | "Mispricing exists" | Arbitrage PT+YT vs underlying |

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YieldSplitter {
    struct Market {
        address underlying;     // USDY
        uint256 maturity;       // Expiry timestamp
        address principalToken; // PT-USDY
        address yieldToken;     // YT-USDY
    }

    mapping(bytes32 => Market) public markets;

    // Split underlying into PT + YT
    function split(address underlying, uint256 amount, uint256 maturity)
        external returns (uint256 ptAmount, uint256 ytAmount);

    // Combine PT + YT back to underlying
    function combine(bytes32 marketId, uint256 amount)
        external returns (uint256 underlyingAmount);

    // Redeem PT at maturity
    function redeemPT(bytes32 marketId, uint256 amount) external;

    // Claim accumulated yield with YT
    function claimYield(bytes32 marketId) external;
}

contract PTToken is ERC20 {
    uint256 public maturity;
    address public underlying;

    function redeem() external; // Only after maturity
}

contract YTToken is ERC20 {
    function claimYield() external;
    function getAccumulatedYield(address user) external view returns (uint256);
}
```

### Revenue Model
- Split/combine fee: 0.1%
- Trading fee (AMM): 0.05%

### MVP Scope (8 minggu)
- [ ] YieldSplitter contract
- [ ] PT and YT token contracts
- [ ] Basic AMM untuk PT/YT trading
- [ ] Frontend: split, combine, trade, claim
- [ ] 1 market: USDY with 3-month maturity

---

## 💡 Idea 1.3: RWA Insurance Protocol

### Uniqueness: ⭐⭐⭐⭐⭐
**First decentralized insurance specifically for RWA risks**

### Problem
- RWA tokens punya risks unik: issuer default, depegging, regulatory action
- Tidak ada insurance coverage untuk RWA-specific risks
- Existing DeFi insurance (Nexus) tidak cover RWA

### Solution
Decentralized insurance protocol untuk RWA:
- **Coverage Types**: Depeg, issuer default, smart contract bug
- **Underwriting Pool**: Users provide liquidity, earn premiums
- **Claims Process**: Decentralized voting atau oracle-based

### Why No Regulatory Issue?
- Peer-to-peer risk sharing (like Nexus Mutual model)
- Discretionary coverage (bukan insurance license)
- Global, permissionless participation

### Risk Categories
```
┌─────────────────────────────────────────────────────────────┐
│                    RWA Risk Categories                       │
└─────────────────────────────────────────────────────────────┘

1. DEPEG RISK
   └── USDY drops below $0.99 for >24 hours
   └── Payout: Cover amount × depeg percentage

2. SMART CONTRACT RISK
   └── Exploit in RWA token contract
   └── Payout: Up to full cover amount

3. ISSUER DEFAULT RISK
   └── Issuer fails to honor redemptions
   └── Payout: Based on claim assessment

4. ORACLE FAILURE RISK
   └── Price feed manipulation/failure
   └── Payout: Losses attributable to oracle
```

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWAInsurance {
    enum RiskType { Depeg, SmartContract, IssuerDefault, Oracle }

    struct Policy {
        address holder;
        address coveredToken;   // USDY, BUIDL, etc.
        RiskType riskType;
        uint256 coverAmount;
        uint256 premium;
        uint256 expiry;
        bool active;
    }

    struct Claim {
        uint256 policyId;
        string evidence;        // IPFS hash
        uint256 requestedAmount;
        ClaimStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
    }

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;

    // Buy coverage
    function buyPolicy(
        address token,
        RiskType risk,
        uint256 coverAmount,
        uint256 duration
    ) external payable returns (uint256 policyId);

    // Submit claim
    function submitClaim(uint256 policyId, string calldata evidence)
        external returns (uint256 claimId);

    // Vote on claim (for underwriters)
    function voteClaim(uint256 claimId, bool approve) external;

    // Execute approved claim
    function executeClaim(uint256 claimId) external;
}

contract UnderwritingPool {
    mapping(address => uint256) public stakes;
    uint256 public totalStaked;

    function stake() external payable;
    function unstake(uint256 amount) external;
    function claimPremiums() external;
}
```

### Premium Calculation
```
Premium = Cover Amount × Risk Rate × Duration

Risk Rates (annual):
- Depeg (USDY): 0.5%
- Depeg (smaller tokens): 2-5%
- Smart Contract: 1-3%
- Issuer Default: 2-5%
```

### Revenue Model
- Protocol fee: 10% dari premiums
- Claim processing fee: 1%

### MVP Scope (8 minggu)
- [ ] Insurance contract dengan 1 risk type (Depeg)
- [ ] Underwriting pool
- [ ] Simple claim process (admin-approved for MVP)
- [ ] Frontend: buy policy, view coverage, submit claim
- [ ] Cover 2-3 RWA tokens

---

## 💡 Idea 1.4: RWA Reputation & Rating System

### Uniqueness: ⭐⭐⭐⭐⭐
**On-chain credit rating for RWA protocols**

### Problem
- Tidak ada standardized way untuk evaluate RWA protocol quality
- Users harus research sendiri setiap protocol
- No on-chain track record untuk issuers

### Solution
Decentralized rating system untuk RWA protocols:
- **Protocol Scores**: Transparency, track record, backing quality
- **Community Reviews**: Verified holder reviews
- **On-chain Metrics**: Historical depeg, yield delivery, etc.

### Rating Criteria
```
┌─────────────────────────────────────────────────────────────┐
│                    RWA Rating Framework                      │
└─────────────────────────────────────────────────────────────┘

CATEGORY                    WEIGHT    METRICS
─────────────────────────────────────────────────────────────
1. Transparency             25%       • Audit frequency
                                      • Reserve proof
                                      • Team doxxed

2. Track Record             25%       • Time in market
                                      • Historical depeg events
                                      • Yield delivery accuracy

3. Backing Quality          20%       • Asset type
                                      • Custodian reputation
                                      • Diversification

4. Smart Contract           15%       • Audit status
                                      • Bug bounty program
                                      • Upgrade mechanism

5. Liquidity                15%       • DEX liquidity
                                      • Redemption ease
                                      • Trading volume
─────────────────────────────────────────────────────────────
FINAL SCORE: A+ to D (like S&P ratings)
```

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWARating {
    struct ProtocolRating {
        address protocol;
        uint256 transparencyScore;  // 0-100
        uint256 trackRecordScore;
        uint256 backingScore;
        uint256 contractScore;
        uint256 liquidityScore;
        uint256 overallScore;
        uint256 lastUpdated;
        string reportIPFS;          // Detailed report
    }

    struct Review {
        address reviewer;
        address protocol;
        uint8 rating;               // 1-5 stars
        string comment;
        uint256 timestamp;
        bool verified;              // Reviewer holds the token
    }

    mapping(address => ProtocolRating) public ratings;
    mapping(address => Review[]) public reviews;

    // Submit rating (only authorized raters)
    function submitRating(address protocol, ProtocolRating calldata rating)
        external onlyRater;

    // Submit review (must hold token)
    function submitReview(address protocol, uint8 rating, string calldata comment)
        external;

    // Get overall grade
    function getGrade(address protocol) external view returns (string memory);
}

contract RaterDAO {
    mapping(address => bool) public authorizedRaters;

    function proposeRater(address rater) external;
    function voteRater(address rater, bool approve) external;
}
```

### Revenue Model
- Protocol listing fee: One-time payment
- Premium analytics: Subscription untuk detailed data
- API access: For integrators

### MVP Scope (6 minggu)
- [ ] Rating contract
- [ ] Review system dengan holder verification
- [ ] Frontend: browse ratings, submit review
- [ ] Rate 5-10 RWA protocols
- [ ] Basic API untuk integrators

---

# 🏆 TRACK 2: DeFi & Composability

---

## 💡 Idea 2.1: RWA-Backed Perpetuals

### Uniqueness: ⭐⭐⭐⭐⭐
**Trade leveraged RWA exposure without holding actual tokens**

### Problem
- Want 5x exposure to gold price? Must buy 5x gold tokens
- No leverage available for RWA
- Capital inefficient

### Solution
Perpetual futures untuk RWA exposure:
- **Long/Short**: Bet on RWA price direction
- **Leverage**: Up to 10x
- **No KYC**: Trade synthetic exposure, not actual RWA

### Why No Regulatory Issue?
- Perpetuals are derivatives, not securities
- Similar to GMX, dYdX model
- No custody of underlying assets

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWAPerpetual {
    struct Position {
        address trader;
        bytes32 market;         // "GOLD", "USDY", "SP500"
        bool isLong;
        uint256 size;           // Position size
        uint256 collateral;
        uint256 entryPrice;
        uint256 leverage;
    }

    mapping(bytes32 => Position) public positions;

    function openPosition(
        bytes32 market,
        bool isLong,
        uint256 collateral,
        uint256 leverage
    ) external returns (bytes32 positionId);

    function closePosition(bytes32 positionId) external;

    function liquidate(bytes32 positionId) external;
}

contract PerpPriceFeed {
    // Chainlink integration for RWA prices
    function getPrice(bytes32 market) external view returns (uint256);
}
```

### Available Markets
| Market | Underlying | Oracle |
|--------|------------|--------|
| GOLD-PERP | XAU/USD | Chainlink |
| TREASURY-PERP | US Treasury Index | Custom |
| REALESTATE-PERP | Real Estate Index | Custom |
| COMMODITY-PERP | Commodity Basket | Chainlink |

### Revenue Model
- Trading fee: 0.1%
- Funding rate: Variable (longs pay shorts or vice versa)
- Liquidation fee: 1%

### MVP Scope (8 minggu)
- [ ] Perpetual contract dengan 1 market (GOLD)
- [ ] Position management
- [ ] Liquidation mechanism
- [ ] Basic frontend: open, close, view positions

---

## 💡 Idea 2.2: Yield Arbitrage Vault

### Uniqueness: ⭐⭐⭐⭐
**Automated arbitrage between RWA yield sources**

### Problem
- USDY yield: 5%, BUIDL yield: 5.2%, aUSDC yield: 4%
- Spread exists but manual arbitrage costly
- Retail users can't capture these opportunities

### Solution
Automated vault that captures yield arbitrage:
- **Monitor Yields**: Track all RWA yield sources
- **Auto-Rotate**: Move funds to highest yield
- **Gas-Optimized**: Batch operations, minimize costs

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YieldArbitrageVault is ERC4626 {
    struct YieldSource {
        address token;
        address yieldOracle;
        uint256 currentAPY;
        uint256 minAllocation;
        uint256 maxAllocation;
    }

    YieldSource[] public sources;
    uint256 public constant ROTATION_THRESHOLD = 50; // 0.5% APY difference

    function deposit(uint256 assets) external returns (uint256 shares);

    function checkRotation() external view returns (bool needed, uint256 fromIndex, uint256 toIndex);

    function executeRotation() external; // Keeper calls this

    function getCurrentAPY() external view returns (uint256);
}
```

### Revenue Model
- Management fee: 0.3% annually
- Performance fee: 10% dari excess yield (above baseline)

### MVP Scope (6 minggu)
- [ ] Vault contract
- [ ] 3 yield sources integration
- [ ] Rotation logic
- [ ] Keeper bot
- [ ] Dashboard showing APY comparison

---

## 💡 Idea 2.3: RWA Liquidity Aggregator

### Uniqueness: ⭐⭐⭐⭐
**Best execution for RWA token swaps**

### Problem
- RWA tokens fragmented across DEXes
- Poor liquidity = high slippage
- No aggregator focuses on RWA

### Solution
Aggregator khusus RWA tokens:
- **Multi-DEX Routing**: Find best price across all venues
- **RWA-Optimized**: Understand RWA-specific liquidity patterns
- **Limit Orders**: For large RWA trades

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWAAggregator {
    struct Route {
        address[] path;
        address[] dexes;
        uint256[] amounts;
        uint256 expectedOutput;
    }

    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (Route memory bestRoute);

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        Route calldata route
    ) external returns (uint256 amountOut);

    function placeLimitOrder(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 targetPrice
    ) external returns (bytes32 orderId);
}
```

### MVP Scope (6 minggu)
- [ ] Aggregator contract
- [ ] Integration 3 DEXes
- [ ] Best route finder
- [ ] Simple frontend
- [ ] Limit order book

---

# 🏆 TRACK 3: AI & Oracles

---

## 💡 Idea 3.1: RWA Yield Oracle Network

### Uniqueness: ⭐⭐⭐⭐⭐
**Decentralized oracle for real-time RWA yields**

### Problem
- RWA yields change daily (treasury rates fluctuate)
- No reliable on-chain source for current yields
- DeFi protocols need accurate yield data

### Solution
Decentralized oracle network untuk RWA yield data:
- **Multiple Sources**: Aggregate from issuers, exchanges, APIs
- **Consensus Mechanism**: Validators agree on yield values
- **Historical Data**: On-chain yield history

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWAYieldOracle {
    struct YieldData {
        address token;
        uint256 currentAPY;     // Basis points
        uint256 timestamp;
        uint256 confidence;     // 0-100
    }

    mapping(address => YieldData) public yields;
    mapping(address => YieldData[]) public yieldHistory;

    // Validators submit yield data
    function submitYield(address token, uint256 apy) external onlyValidator;

    // Aggregate and finalize
    function finalizeYield(address token) external;

    // Get current yield
    function getYield(address token) external view returns (uint256 apy, uint256 confidence);

    // Get historical average
    function getAverageYield(address token, uint256 period) external view returns (uint256);
}

contract ValidatorRegistry {
    mapping(address => uint256) public stakes;

    function registerValidator() external payable;
    function slash(address validator, uint256 amount) external;
}
```

### Revenue Model
- Data subscription: Protocol pays for access
- Validator rewards: From protocol fees

### MVP Scope (8 minggu)
- [ ] Oracle contract
- [ ] 3-5 validator setup
- [ ] Data feeds untuk 5 RWA tokens
- [ ] API untuk easy integration
- [ ] Dashboard showing yields

---

## 💡 Idea 3.2: AI Portfolio Manager

### Uniqueness: ⭐⭐⭐⭐⭐
**AI agent yang manage RWA portfolio berdasarkan market conditions**

### Problem
- Managing RWA portfolio requires constant monitoring
- Market conditions change (rate hikes, risk events)
- Most users don't have time/expertise

### Solution
AI-powered portfolio management:
- **Market Analysis**: AI analyzes macro conditions
- **Auto-Rebalancing**: Adjust allocation based on signals
- **Risk Management**: Reduce exposure during high-risk periods

### Technical Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                 AI Portfolio Manager                         │
└─────────────────────────────────────────────────────────────┘

DATA INPUTS                    AI ENGINE                    ACTIONS
───────────                    ─────────                    ───────

┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│ Market Data  │────────►│                  │────────►│  Rebalance   │
│ (Prices)     │         │   LLM Analysis   │         │  Portfolio   │
└──────────────┘         │   +              │         └──────────────┘
                         │   ML Prediction  │
┌──────────────┐         │                  │         ┌──────────────┐
│ News/Events  │────────►│                  │────────►│  Risk        │
│ (Sentiment)  │         │                  │         │  Adjustment  │
└──────────────┘         └──────────────────┘         └──────────────┘
                                │
┌──────────────┐                │                     ┌──────────────┐
│ On-chain     │────────────────┘                     │  Alerts &    │
│ Metrics      │                                      │  Reports     │
└──────────────┘                                      └──────────────┘
```

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AIPortfolioVault is ERC4626 {
    address public aiAgent; // Address authorized to execute strategies

    struct Strategy {
        address[] tokens;
        uint256[] weights;
        uint256 riskLevel;      // 1-10
        uint256 lastUpdated;
    }

    Strategy public currentStrategy;

    // AI agent updates strategy
    function updateStrategy(
        address[] calldata tokens,
        uint256[] calldata weights,
        uint256 riskLevel
    ) external onlyAI;

    // Execute rebalance based on strategy
    function executeStrategy() external onlyAI;

    // Emergency: user can exit anytime
    function emergencyWithdraw() external;
}

contract AIOracle {
    // Store AI decisions on-chain for transparency
    struct Decision {
        uint256 timestamp;
        string reasoning;       // IPFS hash of AI reasoning
        bytes32 actionHash;
    }

    Decision[] public decisions;

    function recordDecision(string calldata reasoning, bytes32 actionHash) external;
}
```

### AI Features
| Feature | Description |
|---------|-------------|
| **Macro Analysis** | Fed rate decisions, inflation data |
| **Sentiment** | News sentiment about RWA sector |
| **Technical** | Price trends, volume analysis |
| **Risk Scoring** | Dynamic risk assessment |

### Revenue Model
- Management fee: 1% annually
- Performance fee: 15% dari profit

### MVP Scope (10 minggu)
- [ ] Portfolio vault contract
- [ ] AI agent (Python) dengan basic logic
- [ ] News sentiment analysis
- [ ] Simple rebalancing rules
- [ ] Dashboard dengan AI reasoning display

---

## 💡 Idea 3.3: RWA Due Diligence Bot

### Uniqueness: ⭐⭐⭐⭐
**AI yang analyze dan summarize RWA protocol documentation**

### Problem
- RWA protocols punya complex documentation
- Legal terms sulit dipahami
- Time-consuming untuk research setiap protocol

### Solution
AI bot yang baca dan summarize:
- **Document Analysis**: Parse whitepapers, legal docs
- **Risk Extraction**: Identify key risks
- **Comparison**: Side-by-side protocol comparison

### Features
```
┌─────────────────────────────────────────────────────────────┐
│                  Due Diligence Bot Features                  │
└─────────────────────────────────────────────────────────────┘

INPUT: Protocol documentation URL

OUTPUT:
├── Executive Summary (2-3 paragraphs)
├── Key Risks Identified
│   ├── Smart Contract Risks
│   ├── Counterparty Risks
│   └── Regulatory Risks
├── Yield Mechanism Explained
├── Redemption Process
├── Comparison with Similar Protocols
└── Overall Risk Score (1-10)
```

### MVP Scope (6 minggu)
- [ ] Document parser
- [ ] LLM integration (GPT-4/Claude)
- [ ] Risk extraction prompts
- [ ] Web interface
- [ ] Report generation

---

# 🏆 TRACK 4: ZK & Privacy

---

## 💡 Idea 4.1: ZK Portfolio Proof

### Uniqueness: ⭐⭐⭐⭐⭐
**Prove portfolio characteristics without revealing holdings**

### Problem
- Want to prove "I have >$100k in RWA" for whitelist access
- Don't want to reveal exact holdings
- Current: Either full disclosure or nothing

### Solution
ZK proofs untuk portfolio characteristics:
- **Prove Threshold**: "Balance > X" without revealing actual balance
- **Prove Diversification**: "Hold 5+ different RWA" without revealing which
- **Prove Yield**: "Earning >5% APY" without revealing positions

### Use Cases
| Use Case | Proof Type | Privacy Preserved |
|----------|------------|-------------------|
| Whitelist access | Balance > threshold | Exact balance |
| Credit scoring | Yield history | Specific positions |
| DAO voting weight | Token holdings | Exact amounts |

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZKPortfolioVerifier {
    // Verify balance threshold proof
    function verifyBalanceThreshold(
        bytes calldata proof,
        uint256 threshold,
        address user
    ) external view returns (bool);

    // Verify diversification proof
    function verifyDiversification(
        bytes calldata proof,
        uint256 minTokenCount,
        address user
    ) external view returns (bool);

    // Verify yield proof
    function verifyMinYield(
        bytes calldata proof,
        uint256 minAPY,
        address user
    ) external view returns (bool);
}

contract ZKCredentialRegistry {
    mapping(address => mapping(bytes32 => bool)) public credentials;

    // Store verified credential
    function storeCredential(
        address user,
        bytes32 credentialType,
        bytes calldata proof
    ) external;

    // Check credential
    function hasCredential(address user, bytes32 credentialType)
        external view returns (bool);
}
```

### ZK Circuit (Circom)
```circom
// BalanceThreshold.circom
template BalanceThreshold() {
    signal input balance;           // Private
    signal input threshold;         // Public
    signal output isAboveThreshold;

    // Prove balance >= threshold without revealing balance
    component gte = GreaterEqThan(252);
    gte.in[0] <== balance;
    gte.in[1] <== threshold;
    isAboveThreshold <== gte.out;
}
```

### MVP Scope (10 minggu)
- [ ] ZK circuits (Circom) - 2 proof types
- [ ] Verifier contracts
- [ ] Proof generation (client-side)
- [ ] Frontend untuk generate & verify proofs
- [ ] Integration example dengan whitelist

---

## 💡 Idea 4.2: Anonymous RWA Governance

### Uniqueness: ⭐⭐⭐⭐
**Vote on RWA protocol decisions without revealing identity**

### Problem
- Governance votes are public
- Large holders dapat di-target
- Privacy concerns prevent participation

### Solution
Anonymous voting untuk RWA governance:
- **Private Voting**: Vote without revealing which way
- **Weighted**: Voting power based on holdings (proven via ZK)
- **Verifiable**: Results are correct and auditable

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZKGovernance {
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 endTime;
        mapping(bytes32 => bool) nullifiers; // Prevent double voting
    }

    mapping(uint256 => Proposal) public proposals;

    // Submit anonymous vote with ZK proof
    function vote(
        uint256 proposalId,
        bytes calldata proof,
        bytes32 nullifier,
        uint256 votingPower,
        bool support
    ) external;

    // Verify voter eligibility without revealing identity
    function verifyVoter(bytes calldata proof, uint256 votingPower)
        internal view returns (bool);
}
```

### MVP Scope (10 minggu)
- [ ] Voting circuit (Circom)
- [ ] Governance contract
- [ ] Nullifier system (prevent double vote)
- [ ] Voting frontend
- [ ] Results display

---

## 💡 Idea 4.3: Private Yield Aggregator

### Uniqueness: ⭐⭐⭐⭐
**Earn yield without revealing deposit amounts**

### Problem
- Depositing into yield protocols reveals your balance
- Competitors/attackers can see positions
- Privacy-conscious users avoid DeFi

### Solution
Shielded yield vault:
- **Private Deposits**: Deposit amount hidden
- **Private Withdrawals**: Withdrawal amount hidden
- **Public Yield**: Yield rate is public, individual earnings private

### Technical Approach
```
┌─────────────────────────────────────────────────────────────┐
│                 Private Yield Aggregator                     │
└─────────────────────────────────────────────────────────────┘

DEPOSIT FLOW:
User → Deposit USDC → ZK Commitment → Shielded Pool → Yield Protocol
                           ↓
                    Note (private)

WITHDRAW FLOW:
User → ZK Proof (I have valid note) → Shielded Pool → USDC + Yield
                                           ↓
                                    Nullifier (prevent reuse)
```

### MVP Scope (12 minggu)
- [ ] Shielded pool contract
- [ ] Deposit/withdraw circuits
- [ ] Yield distribution mechanism
- [ ] Frontend dengan note management
- [ ] Integration dengan 1 yield source

---

# 🏆 TRACK 5: Infrastructure & Tooling

---

## 💡 Idea 5.1: RWA Subgraph & Indexer

### Uniqueness: ⭐⭐⭐⭐
**Comprehensive indexing untuk semua RWA activity di Mantle**

### Problem
- No unified data source untuk RWA on Mantle
- Each protocol has different event structures
- Analytics tools lack RWA-specific data

### Solution
Specialized indexer untuk RWA:
- **Unified Schema**: Standardized data model
- **Real-time Indexing**: All RWA events
- **GraphQL API**: Easy querying
- **Analytics Dashboard**: Pre-built visualizations

### Data Schema
```graphql
type RWAToken @entity {
  id: ID!
  name: String!
  symbol: String!
  totalSupply: BigInt!
  currentYield: BigDecimal!
  underlyingAsset: String!
  issuer: String!
  holders: [Holder!]! @derivedFrom(field: "token")
  transfers: [Transfer!]! @derivedFrom(field: "token")
  yieldHistory: [YieldSnapshot!]! @derivedFrom(field: "token")
}

type Holder @entity {
  id: ID!
  address: Bytes!
  token: RWAToken!
  balance: BigInt!
  yieldEarned: BigInt!
  firstInteraction: BigInt!
}

type Transfer @entity {
  id: ID!
  token: RWAToken!
  from: Bytes!
  to: Bytes!
  amount: BigInt!
  timestamp: BigInt!
  txHash: Bytes!
}

type YieldSnapshot @entity {
  id: ID!
  token: RWAToken!
  apy: BigDecimal!
  timestamp: BigInt!
}
```

### Features
| Feature | Description |
|---------|-------------|
| **Token Tracker** | All RWA tokens, supplies, yields |
| **Holder Analytics** | Top holders, distribution |
| **Yield History** | Historical APY for each token |
| **Transfer Monitor** | Large transfers, flow analysis |

### MVP Scope (6 minggu)
- [ ] Subgraph schema design
- [ ] Indexer untuk 5 RWA tokens
- [ ] GraphQL API
- [ ] Basic dashboard
- [ ] Documentation

---

## 💡 Idea 5.2: RWA Dev Kit (SDK)

### Uniqueness: ⭐⭐⭐⭐
**All-in-one SDK untuk building RWA applications**

### Problem
- Building RWA apps requires many integrations
- No standard library untuk common operations
- Each developer reinvents the wheel

### Solution
Comprehensive SDK:
- **Contract Interactions**: Typed wrappers for RWA protocols
- **Price Feeds**: Unified interface for yields/prices
- **React Hooks**: Ready-to-use UI components
- **Testing Utils**: Mock contracts, fixtures

### Package Structure
```
@rwa-devkit/
├── core/                    # Core utilities
│   ├── constants.ts         # RWA token addresses
│   ├── abis/               # Contract ABIs
│   └── types.ts            # TypeScript types
│
├── contracts/              # Contract interaction
│   ├── usdy.ts            # Ondo USDY wrapper
│   ├── buidl.ts           # BlackRock BUIDL wrapper
│   └── generic.ts         # Generic RWA interface
│
├── react/                  # React components
│   ├── hooks/
│   │   ├── useRWABalance.ts
│   │   ├── useRWAYield.ts
│   │   └── useRWATransfer.ts
│   └── components/
│       ├── RWABalanceCard.tsx
│       ├── YieldChart.tsx
│       └── TransferForm.tsx
│
├── testing/               # Testing utilities
│   ├── mocks/
│   │   ├── MockRWAToken.sol
│   │   └── MockYieldOracle.sol
│   └── fixtures/
│       └── testSetup.ts
│
└── examples/              # Example apps
    ├── simple-portfolio/
    └── yield-dashboard/
```

### Usage Example
```typescript
import { useRWABalance, useRWAYield } from '@rwa-devkit/react';
import { USDY } from '@rwa-devkit/contracts';

function Portfolio() {
  const { balance, loading } = useRWABalance(USDY.address);
  const { apy } = useRWAYield(USDY.address);

  return (
    <div>
      <p>Balance: {balance} USDY</p>
      <p>Current APY: {apy}%</p>
    </div>
  );
}
```

### MVP Scope (8 minggu)
- [ ] Core package (types, constants)
- [ ] Contract wrappers (3 protocols)
- [ ] React hooks (5 hooks)
- [ ] React components (3 components)
- [ ] Documentation site
- [ ] Example app

---

## 💡 Idea 5.3: RWA Simulation Environment

### Uniqueness: ⭐⭐⭐⭐⭐
**Test RWA integrations dengan realistic mock data**

### Problem
- Testing RWA integrations hard (real tokens require KYC)
- No way to simulate yield accrual
- Testnet RWA tokens don't behave like mainnet

### Solution
Simulation environment untuk RWA development:
- **Mock Tokens**: Realistic RWA token behavior
- **Yield Simulation**: Configurable yield accrual
- **Time Travel**: Test yield over "months" in minutes
- **Scenario Testing**: Simulate depeg, default, etc.

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockRWAToken is ERC20 {
    uint256 public baseYield; // APY in basis points
    uint256 public lastYieldUpdate;
    mapping(address => uint256) public accruedYield;

    function setYield(uint256 newYield) external onlyOwner;

    function accrueYield() external; // Called by keeper/test

    function claimYield() external;

    // Time travel for testing
    function warpTime(uint256 secondsToAdd) external onlyOwner;

    // Simulate depeg
    function simulateDepeg(uint256 newPrice) external onlyOwner;
}

contract RWASimulator {
    MockRWAToken[] public tokens;

    // Create new mock token
    function createMockToken(
        string memory name,
        string memory symbol,
        uint256 initialYield
    ) external returns (address);

    // Run scenario
    function runScenario(bytes calldata scenario) external;
}
```

### Scenarios
| Scenario | Description |
|----------|-------------|
| **Yield Spike** | Sudden yield increase (Fed rate hike) |
| **Yield Drop** | Sudden yield decrease |
| **Depeg Event** | Token drops below peg |
| **Recovery** | Token recovers from depeg |
| **Default** | Issuer fails to honor redemption |

### MVP Scope (6 minggu)
- [ ] MockRWAToken contract
- [ ] RWASimulator contract
- [ ] 3 pre-built scenarios
- [ ] CLI untuk running simulations
- [ ] Documentation

---

# 🏆 TRACK 6: GameFi & Social

---

## 💡 Idea 6.1: RWA Prediction Market

### Uniqueness: ⭐⭐⭐⭐⭐
**Bet on RWA market events**

### Problem
- No way to express views on RWA market events
- "Will USDY yield stay above 5%?" - can't bet on this
- Information markets untuk RWA don't exist

### Solution
Prediction market untuk RWA events:
- **Yield Predictions**: Will APY be above/below X?
- **Depeg Predictions**: Will token maintain peg?
- **Adoption Predictions**: Will TVL reach X?

### Market Examples
```
┌─────────────────────────────────────────────────────────────┐
│                 Sample Prediction Markets                    │
└─────────────────────────────────────────────────────────────┘

MARKET 1: "USDY yield > 5% on Dec 31, 2025?"
├── YES: $0.65 (65% probability)
├── NO: $0.35 (35% probability)
└── Resolution: Oracle checks USDY yield on date

MARKET 2: "Total RWA TVL on Mantle > $1B by Q1 2026?"
├── YES: $0.40
├── NO: $0.60
└── Resolution: TVL oracle

MARKET 3: "BlackRock BUIDL maintains >$500M AUM?"
├── YES: $0.80
├── NO: $0.20
└── Resolution: On-chain data
```

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWAPredictionMarket {
    struct Market {
        string question;
        uint256 resolutionTime;
        address oracle;
        bytes32 oracleQuery;
        uint256 yesPool;
        uint256 noPool;
        bool resolved;
        bool outcome;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesPositions;
    mapping(uint256 => mapping(address => uint256)) public noPositions;

    function createMarket(
        string calldata question,
        uint256 resolutionTime,
        address oracle,
        bytes32 oracleQuery
    ) external returns (uint256 marketId);

    function buyYes(uint256 marketId) external payable;
    function buyNo(uint256 marketId) external payable;

    function resolve(uint256 marketId) external;
    function claim(uint256 marketId) external;
}
```

### Revenue Model
- Market creation fee: 0.1 ETH
- Trading fee: 1%
- Resolution fee: 0.5%

### MVP Scope (6 minggu)
- [ ] Prediction market contract
- [ ] 3 sample markets
- [ ] Oracle integration
- [ ] Trading frontend
- [ ] Leaderboard

---

## 💡 Idea 6.2: Learn-to-Earn RWA Academy

### Uniqueness: ⭐⭐⭐⭐
**Learn about RWA, earn rewards**

### Problem
- RWA is complex, steep learning curve
- No incentive to learn
- Knowledge gap prevents adoption

### Solution
Educational platform dengan token rewards:
- **Courses**: Structured learning paths
- **Quizzes**: Test understanding
- **Certificates**: On-chain credentials (NFT)
- **Rewards**: Token rewards untuk completion

### Course Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    RWA Academy Courses                       │
└─────────────────────────────────────────────────────────────┘

LEVEL 1: RWA Fundamentals (Free)
├── What is RWA? (10 pts)
├── Types of RWA (10 pts)
├── Benefits & Risks (10 pts)
└── Quiz (20 pts) → Certificate NFT

LEVEL 2: RWA on Mantle (50 pts required)
├── Mantle Network Overview
├── RWA Protocols on Mantle
├── How to Use USDY
└── Hands-on: First RWA Transaction

LEVEL 3: Advanced RWA (100 pts required)
├── Yield Optimization
├── Risk Management
├── Portfolio Construction
└── Final Project
```

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RWAAcademy {
    struct Course {
        string name;
        uint256 requiredPoints;
        uint256 rewardPoints;
        address certificateNFT;
    }

    struct Student {
        uint256 totalPoints;
        mapping(uint256 => bool) completedCourses;
        mapping(uint256 => bool) completedQuizzes;
    }

    mapping(uint256 => Course) public courses;
    mapping(address => Student) public students;

    function completeCourse(uint256 courseId, bytes calldata proof) external;
    function submitQuiz(uint256 quizId, bytes32[] calldata answers) external;
    function claimCertificate(uint256 courseId) external;
    function claimRewards() external;
}

contract CertificateNFT is ERC721 {
    function mint(address student, uint256 courseId) external;
}
```

### Revenue Model
- Sponsored courses (protocols pay for visibility)
- Premium content subscription
- Certificate verification API

### MVP Scope (6 minggu)
- [ ] Academy contract
- [ ] 3 courses content
- [ ] Quiz system
- [ ] Certificate NFT
- [ ] Learning dashboard

---

## 💡 Idea 6.3: RWA Social Trading

### Uniqueness: ⭐⭐⭐⭐
**Follow and copy successful RWA investors**

### Problem
- Don't know how to build RWA portfolio
- Want to learn from successful investors
- No social layer for RWA investing

### Solution
Social trading platform untuk RWA:
- **Public Portfolios**: Opt-in share your holdings
- **Performance Tracking**: Compare returns
- **Copy Trading**: Automatically mirror positions
- **Discussions**: Comment on strategies

### Smart Contracts
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SocialTrading {
    struct Trader {
        address wallet;
        bool isPublic;
        uint256 followers;
        uint256 totalReturn; // Basis points since start
    }

    struct CopyPosition {
        address follower;
        address trader;
        uint256 allocation; // Percentage to copy
        bool active;
    }

    mapping(address => Trader) public traders;
    mapping(address => CopyPosition[]) public copyPositions;

    function makePublic() external;
    function follow(address trader, uint256 allocation) external;
    function unfollow(address trader) external;

    // When trader makes a trade, copy to followers
    function executeCopy(address trader, bytes calldata tradeData) external;
}
```

### Features
| Feature | Description |
|---------|-------------|
| **Leaderboard** | Top performers by return |
| **Risk Metrics** | Sharpe ratio, max drawdown |
| **Trade History** | All trades with reasoning |
| **Notifications** | When followed trader moves |

### MVP Scope (8 minggu)
- [ ] Social trading contract
- [ ] Copy mechanism
- [ ] Performance tracking
- [ ] Frontend: profiles, follow, leaderboard
- [ ] Basic trade copying

---

# 📋 Final Recommendation Matrix

## Selection Criteria
- **Uniqueness**: Is this novel in the RWA/Mantle ecosystem?
- **Feasibility**: Can MVP be built in 6-10 weeks?
- **Impact**: Does it solve a real problem?
- **Regulatory**: Minimal regulatory complexity?

## Top Recommendations by Track

| Track | Recommended Idea | Why |
|-------|-----------------|-----|
| **RWA** | RWA Index Protocol | Clear value prop, builds on existing protocols |
| **RWA** | Yield Splitter | Novel for Mantle, proven model (Pendle) |
| **DeFi** | RWA Perpetuals | High uniqueness, clear demand |
| **AI** | AI Portfolio Manager | Hot topic, practical value |
| **ZK** | ZK Portfolio Proof | Privacy need is real, technically impressive |
| **Infra** | RWA Dev Kit | Enables ecosystem growth |
| **GameFi** | Prediction Market | Fun, engaging, information value |

## Winning Strategy Combinations

### Strategy A: "Technical Excellence"
**Target: Grand Prize + ZK Track + Best Mantle Integration**
```
Primary: ZK Portfolio Proof
Add-on: Integration dengan 3+ RWA protocols
Polish: Clean UX untuk proof generation
```

### Strategy B: "Maximum Impact"
**Target: RWA Track + Community Choice + Best UX**
```
Primary: RWA Index Protocol
Add-on: Beautiful dashboard, mobile-friendly
Polish: Educational content, community engagement
```

### Strategy C: "Innovation Play"
**Target: AI Track + Best Mantle Integration**
```
Primary: AI Portfolio Manager
Add-on: RWA Yield Oracle integration
Polish: Transparent AI reasoning, audit trail
```

### Strategy D: "Developer Ecosystem"
**Target: Infrastructure Track + Incubation Grant**
```
Primary: RWA Dev Kit
Add-on: Comprehensive documentation
Polish: Example apps, video tutorials
```

---

# ✅ Submission Checklist

## Required Deliverables
- [ ] **GitHub Repository**
  - [ ] Clean code dengan comments
  - [ ] README dengan installation steps
  - [ ] Deployment instructions
  - [ ] License file

- [ ] **Demo**
  - [ ] Working URL (testnet OK)
  - [ ] 3-5 minute video walkthrough
  - [ ] Cover all main features

- [ ] **Documentation**
  - [ ] One-pager pitch deck
  - [ ] Problem/Solution/Business Model
  - [ ] Technical architecture diagram
  - [ ] Roadmap (3-6 months)

- [ ] **Team**
  - [ ] Team member bios
  - [ ] Contact information
  - [ ] Role assignments

## Quality Checklist
- [ ] Smart contracts tested (>80% coverage)
- [ ] No critical vulnerabilities
- [ ] Gas optimized
- [ ] Frontend responsive
- [ ] Error handling proper
- [ ] Loading states implemented

## Bonus Points
- [ ] Deployed on Mantle Mainnet
- [ ] Integration dengan 2+ existing Mantle protocols
- [ ] Active community engagement
- [ ] Builder Story Spotlight participation

---

**Good luck, builders! 🚀**

*Real Assets. Real Yield. Real Builders.*

---

## Quick Links
- [Mantle Docs](https://docs.mantle.xyz)
- [Mantle Faucet](https://faucet.sepolia.mantle.xyz)
- [Hackathon Page](https://www.hackquest.io/hackathon/Mantle-Global-Hackathon-2025)
