---
sidebar_position: 2
title: "Session 2 - Planting the Seeds: Web3 Fundamentals & Understanding Lisk"
sidebar_label: "Session 2 - Planting the Seeds"
description: "Learn the basics of Web3 and Lisk. Understand how blockchain works, why Lisk matters, and the key concepts like wallets, gas, and transactions. This session prepares the soil for everything you'll build."
keywords: [web3, blockchain, ethereum, lisk, layer2, fundamentals, wallets, gas, transactions, web evolution]
---

# Session 2: Planting the Seeds - Web3 Fundamentals & Understanding Lisk

**Session Date**: October 15, 2025 | 19:30 - 21:00 (GMT+7)

Learn the basics of Web3 and Lisk. Understand how the blockchain works, why Lisk matters, and the key concepts like wallets, gas, and transactions. This session prepares the soil for everything you'll build.

---

## Part 1: The Evolution of the Internet

### Web1 vs Web2 vs Web3

Understanding where we are requires understanding where we've been. Let's explore the evolution of the web:

#### Comparative Overview

| Aspect | Web1 | Web2 | Web3 |
|--------|------|------|------|
| **Time Period** | 1990-2005 | 2005-Present | ? (Emerging) |
| **Features** | Read-Only | Read, Write | Read, Write, Own |
| **Protocol** | Open | Closed | Open |
| **Value** | A Few Builders And Users | A Few Large Corporations | Users |
| **Issues** | Limited Functionality | Centralized, No Ownership | ? (Being solved) |

### Web1: The Read-Only Era (1990-2005)

The early internet was like a digital library:
- **Static websites** with limited interactivity
- Users could only consume information
- Built on **open protocols** (HTTP, HTML)
- Run by a few builders and early adopters

**Example**: Think of early websites like newspapers online - you could read them, but not interact.

### Web2: The Interactive Era (2005-Present)

The internet became a platform for participation:
- **Social media and user-generated content**
- Users can read AND write (post, comment, share)
- Dominated by **large corporations** (Facebook, Google, Amazon)
- **Centralized control** over data and content
- You create content, but platforms own it

**Example**: Facebook, YouTube, Twitter - you create content, but the platform controls it, monetizes it, and can remove it.

### Web3: The Ownership Era (Emerging Now)

The internet is becoming user-owned:
- Users can **read, write, AND own**
- Built on **open protocols** and blockchain
- **Decentralized control** - no single authority
- Value accrues to **users and creators**
- You own your data, content, and digital assets

**Example**: NFTs you create are truly yours, tokens you earn are in your wallet, and your identity is self-sovereign.

---

## Part 2: Understanding Blockchain

Blockchain is the foundational technology that makes Web3 possible.

### What is Blockchain?

**Definition**: A blockchain is a distributed ledger - a list of records stored in "blocks" of data, where each block is chained together with its previous block.

```
Block 1 → Block 2 → Block 3 → ... → Block N
[Header]   [Header]   [Header]         [Header]
[Txs   ]   [Txs   ]   [Txs   ]         [Txs   ]
```

### Core Concepts

1. **List of Records Stored in "Blocks" of Data**
   - Each block contains multiple transactions
   - Blocks have a fixed size limit
   - New blocks are created at regular intervals

2. **Each Block is Chained Together**
   - Every block references the previous block
   - This creates an immutable chain
   - Changing old data breaks the chain

3. **A Series of Transactions**
   - Transactions record value transfers
   - Smart contract executions
   - State changes in the network

### Blockchain Network Properties

#### 1. Transparent
- **Every node has a copy** of the blockchain
- All transactions are visible to network participants
- Anyone can verify the history
- Public blockchains are fully auditable

**Why it matters**: No hidden changes or secret transactions - everything is verifiable.

#### 2. Secure
- **Uses cryptography and digital signatures**
- Public/private key pairs prove identity
- Digital signatures enforce read/write access
- Encryption protects sensitive data

**Why it matters**: Your assets are protected by mathematics, not by trusting a company.

#### 3. Immutable
- **Contains consensus mechanisms** that make it hard to change records
- Once data is recorded, it's extremely difficult to alter
- Would require controlling majority of network
- Historical data is permanent

**Why it matters**: Your ownership records can't be erased or modified by anyone.

---

## Part 3: Ethereum's Journey

Understanding Ethereum's journey helps us appreciate where we are today.

### Ethereum Launch (2015)

**Ethereum's genesis block went live, launching the "Frontier" network**

This barebones release gave developers their first chance to:
- Build decentralized applications
- Experiment with smart contracts
- Test the possibilities of programmable money

**Ethereum's Mission**: An open internet where users control their data, applications run without gatekeepers, and value flows freely between people.

### Key Milestones in Ethereum's Evolution

#### 1. DAI: The Pioneer Stablecoin (December 2015)

**The First Decentralized Stablecoin**

DAI was revolutionary because it:
- Maintained a dollar peg through **cryptocurrency collateral locked in smart contracts**
- Operated through **DAO governance**, making it trustless and community-controlled
- Unlike centralized stablecoins, DAI has **no single point of failure**

**Why it matters**: It proved that decentralized systems could create stable, reliable financial instruments without banks.

#### 2. CryptoKitties and the NFT Frontier (November 2017)

**Digital Ownership Comes to Life**

CryptoKitties was a breakthrough moment:
- Showed how **blockchain could enable new forms of expression**
- Demonstrated **collectibility and culture** online
- Proved Ethereum could scale **beyond finance** into gaming, art, and digital identity
- Opened entirely new creative possibilities

**Impact**: This early NFT game showed the world that blockchain wasn't just for finance - it was for culture, creativity, and community.

#### 3. DeFi Summer (June 2020)

**Finance Reimagined**

The explosive growth of DeFi redefined finance:
- Protocols for **lending, trading, and yield generation** gained massive momentum
- Showcased the power of **open, composable financial infrastructure**
- Brought **billions in value on-chain**
- Established Ethereum as the **home of decentralized finance**

**What happened**: Platforms like Uniswap, Aave, and Compound showed that financial services could be:
- Permissionless (anyone can use them)
- Transparent (all code is open)
- Composable (protocols work together like LEGO)
- Non-custodial (you control your funds)

#### 4. The Merge Update (September 15, 2022)

**Ethereum's Biggest Transformation**

The network transitioned from **energy-intensive Proof-of-Work to Proof-of-Stake**:
- Changed the consensus mechanism while **billions in value** remained on Ethereum
- Compared to "**changing an aircraft's engine mid-flight**"
- **Cut energy consumption by 99.95%**
- **Strengthened network security**
- Set the groundwork for **future scaling upgrades**

**Why it matters**: This unprecedented technical achievement proved that major blockchain upgrades are possible even with massive value at stake.

---

## Part 4: The Blockchain Trilemma

Traditional blockchains face a fundamental challenge - it's extremely difficult to optimize all three properties simultaneously.

### The Three Pillars

```
                Security
              (High attack difficulty)
                    /\
                   /  \
                  /    \
                 /      \
    Decentralization ---- Scalability
    (Low node operator    (High performance
     requirements)         i.e., TPS)
```

### Understanding Each Pillar

#### Security
- High attack difficulty
- Expensive to compromise the network
- Examples: Bitcoin, Ethereum mainnet (PoW networks with high monetary premium)
- Trade-off: Often slower and more expensive

#### Decentralization
- Low node operator requirements
- Anyone can run a node
- No single point of control
- Examples: Ethereum, Cardano (networks with many validators)
- Trade-off: Harder to coordinate upgrades

#### Scalability
- High performance (transactions per second)
- Fast confirmation times
- Low transaction costs
- Examples: Solana, Avalanche (high-throughput blockchains)
- Trade-off: May require powerful hardware or sacrifice some decentralization

### The Challenge

**You can typically optimize for two, but the third suffers:**

- **High Security + High Decentralization** = Lower Scalability (Bitcoin, Ethereum L1)
- **High Security + High Scalability** = Lower Decentralization (Some DPoS chains)
- **High Decentralization + High Scalability** = Lower Security (Some newer consensus mechanisms)

### The Solution: Layer 2

This is where Layer 2 solutions like Lisk come in - they help solve the trilemma!

---

## Part 5: What is Layer 2?

Layer 2 (L2) solutions are built on top of Ethereum (Layer 1) to solve the scalability problem while maintaining security and decentralization.

### How Layer 2 Works

**Layer 2 is a network built on top of Ethereum that:**
- **Processes transactions off-chain** (outside the main Ethereum blockchain)
- **Settles/anchors transactions on Layer 1** for security
- Makes transactions **faster and cheaper**
- Inherits Ethereum's security guarantees

### Optimistic Rollups Explained

One popular L2 approach is **Optimistic Rollups**:

```
┌─────────────────────────────────────┐
│      Optimistic Rollup (L2)         │
│  ┌──────────────────────────────┐   │
│  │   Execution Nodes            │   │
│  │   ┌────┐ ┌────┐ ┌────┐      │   │
│  │   │ OP │ │ OP │ │ OP │      │   │  ← Fast execution off-chain
│  │   └────┘ └────┘ └────┘      │   │
│  │                              │   │
│  │   Rollup Nodes               │   │
│  │      ┌────┐        ┌────┐   │   │
│  │      │ OP │        │ OP │   │   │  ← Batch & submit to L1
│  │      └────┘        └────┘   │   │
│  │    (Sequences)  (Validators)│   │
│  │         │            │       │   │
│  │   Proving Scheme            │   │
│  │   Cannon (Rollup Geth)      │   │  ← Fraud proofs
│  └──────────────────────────────┘   │
│              │                       │
│   Submit Batches to Layer1          │
│              ↓                       │
└─────────────────────────────────────┘
                │
    Derive Layer2 Block Data
                ↓
┌─────────────────────────────────────┐
│         Ethereum (L1)                │
│  ┌──────────────┐  ┌──────────────┐ │
│  │Bridge Contract│  │Sequencer Queue│ │
│  └──────────────┘  │Contract       │ │
│                     └──────────────┘ │
└─────────────────────────────────────┘
```

### Key Benefits of Layer 2

1. **Scalability**: Thousands of transactions per second vs. ~15 TPS on Ethereum L1
2. **Lower Costs**: Transaction fees are a fraction of L1 costs
3. **Ethereum Security**: All transactions are ultimately secured by Ethereum
4. **EVM Compatibility**: Same tools, same code, same wallets

### How It Works in Practice

1. Users submit transactions to the L2 network
2. L2 executes transactions quickly and cheaply off-chain
3. L2 batches many transactions together
4. The batch is submitted to Ethereum L1 as "calldata" or "blob"
5. If there's fraud, anyone can challenge within a window (usually 7 days)
6. After the challenge period, the transactions are finalized

**Optimistic Assumption**: The system assumes transactions are valid unless proven otherwise, which allows for faster processing.

---

## Part 6: Introducing Lisk

Now let's explore Lisk - a Layer 2 network designed to make blockchain development accessible and scalable.

### What is Lisk?

**Lisk** is a highly efficient, lightning-fast, and easily scalable **Layer 2 (L2) network** built on **Optimism (OP)** and secured by Ethereum.

### Built on Superchain

Lisk is part of the **OP Superchain** ecosystem, which means:
- It leverages proven, battle-tested infrastructure
- Benefits from shared security and development
- Interoperates seamlessly with other OP Stack chains
- Contributes to and benefits from OP Stack improvements

### Key Characteristics

#### 1. Lightning-Fast Performance
- Sub-second transaction confirmation times
- High throughput for demanding applications
- Optimized for real-world use cases

#### 2. Highly Efficient
- Dramatically reduced gas costs compared to Ethereum L1
- Efficient batch processing
- Optimized resource utilization

#### 3. Easily Scalable
- Handles high transaction volumes
- Designed to grow with your application
- No compromise on decentralization

#### 4. EVM Compatible
- Use the same tools you know (Hardhat, Foundry, Remix)
- Deploy Solidity smart contracts without changes
- Seamless migration from Ethereum or other EVM chains

#### 5. Ethereum Security
- Transactions are ultimately settled on Ethereum
- Inherits Ethereum's robust security model
- No need to trust a separate validator set

---

## Part 7: Why Build with Lisk?

### Developer-Friendly Features

#### 1. Low-Cost Transactions
- **Gas fees are a fraction** of Ethereum mainnet costs
- Makes micro-transactions economically viable
- Enables new business models that weren't possible before

**Example**: A transaction that costs $50 on Ethereum L1 might cost less than $0.01 on Lisk.

#### 2. EVM Compatibility
- **Use the same tools and frameworks** you already know
- No need to learn new programming languages
- Migrate existing contracts with minimal changes
- Works with MetaMask, Hardhat, Foundry, Remix, and more

**Example**: If you built a dApp on Ethereum, you can deploy it to Lisk with minimal or no code changes.

#### 3. Comprehensive Developer Support
- **Access essential technical materials** for your development journey
- Extensive documentation and tutorials
- Active developer community
- Regular workshops and events (like this one!)

#### 4. All Major Framework Support
Lisk supports every major Ethereum development framework:
- **Hardhat** - Most popular development environment
- **Foundry** - Fast, modern toolkit written in Rust
- **Remix** - Browser-based IDE
- **Truffle** - Established development suite
- **Brownie** - Python-based framework

### Real-World Advantages

#### For DApp Developers
- Deploy once, work everywhere (thanks to EVM compatibility)
- Lower costs mean more users can afford to use your app
- Fast confirmations improve user experience
- Ethereum security gives users confidence

#### For Users
- Affordable transaction fees
- Fast confirmation times
- Familiar wallet experience (MetaMask, etc.)
- Backed by Ethereum security

#### For Businesses
- Cost-effective blockchain integration
- Scalable infrastructure
- Enterprise-ready performance
- Established ecosystem and tooling

---

## Part 8: Lisk's Position in the Ecosystem

### Part of the OP Superchain

Lisk is built on the **OP Stack**, which means:

```
┌─────────────────────────────────────────┐
│         OP Superchain Ecosystem         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Optimism │  │   Base   │  │  Lisk  ││
│  └──────────┘  └──────────┘  └────────┘│
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Mode    │  │   Zora   │  │  etc.  ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                  │
                  │ Shared Security
                  │ Shared Standards
                  │ Interoperability
                  ↓
┌─────────────────────────────────────────┐
│            Ethereum (L1)                 │
│         Security & Settlement            │
└─────────────────────────────────────────┘
```

### Benefits of Being in the Superchain

1. **Shared Infrastructure**: Leverage improvements made across the ecosystem
2. **Interoperability**: Easy bridging between Superchain networks
3. **Network Effects**: Benefit from the entire ecosystem's growth
4. **Proven Technology**: Built on battle-tested OP Stack

---

## Part 9: Lisk Architecture Overview

### How Lisk Processes Transactions

```
User Transaction
      ↓
┌─────────────────────┐
│   Lisk L2 Network   │
│                     │
│  1. Receive Tx      │
│  2. Execute Tx      │
│  3. Update State    │
│  4. Batch Txs       │
└─────────────────────┘
      ↓
┌─────────────────────┐
│  Submit to Ethereum │
│  (L1 Settlement)    │
│                     │
│  - Batch Data       │
│  - State Roots      │
│  - Fraud Proofs     │
└─────────────────────┘
      ↓
   Finalized!
```

### Key Components

#### 1. Sequencer
- Orders and executes transactions
- Provides instant transaction confirmation
- Batches transactions for L1 submission
- Operated by Lisk initially (decentralization roadmap)

#### 2. Batch Submitter
- Posts transaction data to Ethereum L1
- Ensures data availability
- Makes Lisk transparent and verifiable

#### 3. Proposer
- Submits state root proposals to L1
- Allows verification of L2 state

#### 4. Challenger
- Anyone can challenge invalid state transitions
- 7-day challenge period for fraud proofs
- Ensures system integrity

---

## Part 10: Getting Started with Lisk

### Network Information

**Lisk Sepolia Testnet** (for development):
- Network Name: Lisk Sepolia
- RPC URL: `https://rpc.sepolia-api.lisk.com`
- Chain ID: `4202`
- Currency Symbol: `ETH`
- Block Explorer: `https://sepolia-blockscout.lisk.com`

<button onClick={() => {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x106A',
        chainName: 'Lisk Sepolia',
        nativeCurrency: {
          name: 'Sepolia Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
        blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
      }]
    }).catch((error) => {
      console.error(error);
    });
  } else {
    alert('Please install MetaMask to add this network');
  }
}} style={{
  backgroundColor: '#0D102D',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
  marginBottom: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.3s ease'
}} onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = '#1a1f4d';
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
}} onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = '#0D102D';
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'none';
}}>
  <img src="/img/metamask.svg" alt="MetaMask" style={{width: '20px', height: '20px', flexShrink: '0'}} />
  <span>Add Lisk Sepolia to MetaMask</span>
</button>

**Lisk Mainnet** (for production):
- Network Name: Lisk
- RPC URL: `https://rpc.api.lisk.com`
- Chain ID: `1135`
- Currency Symbol: `ETH`
- Block Explorer: `https://blockscout.lisk.com`

<button onClick={() => {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x46F',
        chainName: 'Lisk',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://rpc.api.lisk.com'],
        blockExplorerUrls: ['https://blockscout.lisk.com']
      }]
    }).catch((error) => {
      console.error(error);
    });
  } else {
    alert('Please install MetaMask to add this network');
  }
}} style={{
  backgroundColor: '#0D102D',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
  marginBottom: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.3s ease'
}} onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = '#1a1f4d';
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
}} onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = '#0D102D';
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'none';
}}>
  <img src="/img/metamask.svg" alt="MetaMask" style={{width: '20px', height: '20px', flexShrink: '0'}} />
  <span>Add Lisk Mainnet to MetaMask</span>
</button>

### Essential Resources

#### Official Documentation
- **Website**: [https://lisk.com](https://lisk.com)
- **Docs**: [https://docs.lisk.com](https://docs.lisk.com)
- **GitHub**: [https://github.com/LiskHQ](https://github.com/LiskHQ)

#### Developer Tools
- **Bridge**: [https://bridge.lisk.com](https://bridge.lisk.com)
- **Faucet** (Testnet): [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
- **Explorer**: [https://blockscout.lisk.com](https://blockscout.lisk.com)

#### Community
- **Discord**: Join the Lisk developer community
- **Twitter/X**: [@LiskHQ](https://twitter.com/LiskHQ)
- **Forum**: Community discussions and support

---

## Hands-On Practice: Your First Steps on Lisk

Now that you understand the fundamentals, let's get hands-on! Follow along with the instructor to complete these practical exercises.

### Activity 1: Request Test ETH from Faucet 💰

Let's get some test ETH so you can start experimenting!

**Steps**:
1. Make sure you've added Lisk Sepolia network to MetaMask (use the button above)
2. Copy your wallet address from MetaMask
3. Visit the Lisk Sepolia Faucet: [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
4. Paste your address and request test ETH
5. Wait a few seconds and check your MetaMask balance

**What you'll see**:
- Balance updates in MetaMask
- Notification of incoming transaction

**Why this matters**: You need test ETH to deploy smart contracts and interact with the blockchain. Test ETH has no real value - it's just for learning!

---

### Activity 2: Send Your First Transaction 🚀

Experience how blockchain transactions work by sending test ETH to yourself.

**Steps**:
1. In MetaMask, click your account icon → **"Add account or hardware wallet"** → **"Add a new account"**
2. Name it "Test Account 2"
3. Copy the address of your new account
4. Switch back to Account 1
5. Click **"Send"** in MetaMask
6. Paste your Account 2 address
7. Enter amount: **0.001 ETH** (a small test amount)
8. Review gas fees and click **"Confirm"**
9. Watch the transaction status change from "Pending" to "Confirmed"

**What you'll learn**:
- How transactions work
- What gas fees are
- Transaction confirmation times (usually a few seconds on Lisk!)

---

### Activity 3: Explore the Block Explorer 🔍

See your transaction on the public blockchain!

**Steps**:
1. After your transaction confirms, click on it in MetaMask
2. Click **"View on block explorer"**
3. The Lisk Sepolia block explorer will open

**Things to explore**:
- **Transaction Hash**: Unique ID for your transaction
- **From**: Your Account 1 address
- **To**: Your Account 2 address
- **Value**: 0.001 ETH
- **Gas Used**: How much computational work was needed
- **Block Number**: Which block includes your transaction

**Try this**:
- Click on your address to see all your transactions
- Click on any block number to see what else was in that block
- Search for a contract address (like `0x...`) and see the "Contract" tab

**Why this matters**: Block explorers let anyone verify transactions. This transparency is a key feature of blockchain!

---

### Activity 4: Introduction to Remix IDE 🛠️

Let's explore the tool we'll use to write smart contracts in Session 3.

**Steps**:
1. Open Remix IDE: [https://remix.ethereum.org](https://remix.ethereum.org)
2. Look at the interface:
   - **Left sidebar**: File Explorer, Solidity Compiler, Deploy & Run Transactions
   - **Middle**: Code editor
   - **Right**: Plugin manager and terminal

3. In the File Explorer, expand **contracts/** folder
4. Click on **1_Storage.sol** to view it

**What you're looking at**:
```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Storage {
    uint256 number;  // ← A variable that stores a number

    function store(uint256 num) public {  // ← Function to save a number
        number = num;
    }

    function retrieve() public view returns (uint256){  // ← Function to read the number
        return number;
    }
}
```

**Try to identify** (instructor will explain):
- Contract name: `Storage`
- Variable: `number` (stores data)
- Two functions: `store()` (writes data) and `retrieve()` (reads data)

Don't worry about understanding every detail - we'll learn Solidity deeply in Session 3!

---

### Activity 5: Deploy Your First Smart Contract 🎉

Let's deploy the Storage contract to Lisk Sepolia - no coding required!

**Steps**:

1. **Compile the Contract**:
   - In Remix, click the **"Solidity Compiler"** icon (left sidebar)
   - Click **"Compile 1_Storage.sol"**
   - You should see a green checkmark ✅

2. **Connect MetaMask**:
   - Click the **"Deploy & run transactions"** icon
   - In "Environment" dropdown, select **"Injected Provider - MetaMask"**
   - MetaMask will popup - click **"Connect"**
   - Verify it shows "Custom (4202) network" (Lisk Sepolia)

3. **Deploy the Contract**:
   - Make sure "Storage" is selected in the "Contract" dropdown
   - Click the orange **"Deploy"** button
   - MetaMask will popup asking to confirm
   - Check the gas fee and click **"Confirm"**
   - Wait for the transaction to confirm

4. **Your Contract is Live!** 🎊
   - You'll see the deployed contract appear under "Deployed Contracts"
   - Click the dropdown arrow to see the functions

**Interact with Your Contract**:

1. **Store a number**:
   - Expand the "store" function
   - Enter a number like `42`
   - Click the **"store"** button (orange - because it changes data)
   - Confirm the transaction in MetaMask
   - Wait for confirmation

2. **Retrieve the number**:
   - Click the **"retrieve"** button (blue - because it only reads)
   - You should see `42` appear below!
   - No MetaMask popup because reading data is free!

**Find Your Contract on Block Explorer**:
1. Copy the contract address from Remix (shown under "Deployed Contracts")
2. Go to [https://sepolia-blockscout.lisk.com](https://sepolia-blockscout.lisk.com)
3. Paste the address in the search bar
4. See your contract on the blockchain!
5. Click the "Transactions" tab to see your interactions

**🎉 Congratulations!** You just deployed and interacted with your first smart contract!

---

### Activity 6: Wallet Security Basics 🔐

Before we finish, let's discuss keeping your wallet safe.

**Key Security Principles**:

1. **Private Key = Your Money**
   - Never share your private key or seed phrase with anyone
   - Not even "support" (they will never ask)
   - If someone gets your private key, they can take everything

2. **Seed Phrase is Your Backup**
   - Write it down on paper (not digital!)
   - Store it somewhere safe
   - Anyone with your seed phrase can recreate your wallet

3. **Public Address is Safe to Share**
   - Your address (0x...) is like your email - safe to give to others
   - Use it to receive funds or share your work

4. **Test Networks vs Mainnet**
   - Test ETH (Sepolia) = No value, for learning
   - Real ETH (Mainnet) = Real money
   - Always practice on testnets first!

5. **Scam Warning Signs** 🚨
   - "Send me ETH and I'll send double back" ❌
   - "Verify your wallet by entering seed phrase" ❌
   - Messages asking for private keys ❌
   - Websites that look like official sites but with wrong URLs ❌

**Best Practices**:
- ✅ Keep seed phrase offline
- ✅ Use hardware wallet for large amounts
- ✅ Double-check addresses before sending
- ✅ Start with small test transactions
- ✅ Verify URLs (bookmark official sites)

---

## Session 2 Checklist ✅

Before moving to Session 3, make sure you've completed:

- ✅ Added Lisk Sepolia network to MetaMask
- ✅ Received test ETH from faucet
- ✅ Sent a test transaction between your accounts
- ✅ Explored your transaction on block explorer
- ✅ Opened and explored Remix IDE
- ✅ Deployed the Storage contract to Lisk Sepolia
- ✅ Interacted with your deployed contract (store and retrieve)
- ✅ Found your contract on the block explorer
- ✅ Understand basic wallet security

**Questions?** Ask the instructor or join our Discord community!

---

## Summary: Key Takeaways

### Web3 Evolution
- **Web1**: Read-only, static content
- **Web2**: Read-write, centralized platforms
- **Web3**: Read-write-own, decentralized ownership

### Blockchain Fundamentals
- **Transparent**: All transactions are visible
- **Secure**: Protected by cryptography
- **Immutable**: Records can't be changed

### The Blockchain Trilemma
- **Security, Decentralization, Scalability** - pick two
- **Layer 2 solutions** help solve this challenge

### Lisk Advantages
- **Lightning-fast** transactions
- **Low-cost** gas fees
- **EVM compatible** - use familiar tools
- **Ethereum security** - backed by L1
- **Part of Superchain** - shared infrastructure

---

## Next Steps

Ready to start building? In the upcoming sessions, you'll learn:

- **Session 3**: Solidity Smart Contracts - Write your first smart contract
- **Session 4**: Building Your First DApp - Connect frontend to smart contracts
- **Session 5**: ERC Standards & Modular Design - Build professional-grade tokens
- **Session 7**: DeFi & Automated Market Makers - Create DeFi protocols
- **Session 9**: From Hack to Startup - Turn your project into a venture

---

## Additional Resources

### Learning Resources
- [Ethereum Documentation](https://ethereum.org/developers)
- [Lisk Documentation](https://docs.lisk.com)
- [Solidity by Example](https://solidity-by-example.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Development Tools
- [Hardhat](https://hardhat.org)
- [Foundry](https://book.getfoundry.sh)
- [Remix IDE](https://remix.ethereum.org)
- [MetaMask](https://metamask.io)

### Community
- **Ethereum Jakarta**: Your local Web3 community
- **Lisk Discord**: Connect with other Lisk developers
- **GitHub Discussions**: Ask questions and share knowledge

**Welcome to the Lisk Growth Garden! Let's build the future together.** 🌱
