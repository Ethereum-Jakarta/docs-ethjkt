---
id: arbitrum-orbit
title: Arbitrum Orbit - Custom L3 Chains
sidebar_position: 5
---

# Arbitrum Orbit - Custom L3 Chains

**Arbitrum Orbit** adalah framework yang memungkinkan siapa pun untuk meluncurkan chain L2 atau L3 kustom menggunakan teknologi Arbitrum. Orbit chain dapat melakukan settlement ke Arbitrum One, Nova, atau bahkan langsung ke Ethereum L1.

---

## Apa itu Orbit?

Orbit memberikan developer **kedaulatan penuh** untuk membuat chain khusus aplikasi (app-specific chains) dengan:

<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:'16px',margin:'20px 0'}}>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>⛽ Token Gas Kustom</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Gunakan token native kamu untuk pembayaran gas (bukan ETH)
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>🏛️ Governance Fleksibel</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Tentukan jalur upgrade dan parameter chain secara independen
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>⚡ Kontrol Throughput</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Atur gas limit dan block time sesuai kebutuhan aplikasi
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>🔐 Permissioned/less</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Pilih siapa yang dapat deploy contract dan berpartisipasi
  </div>
</div>

</div>

---

## L3 Architecture Explained

```
┌─────────────────────────────────────┐
│       Layer 1: Ethereum             │
│   Settlement & Security Root        │
└──────────────┬──────────────────────┘
               │ (Fraud Proofs + Data)
               ↓
┌─────────────────────────────────────┐
│   Layer 2: Arbitrum One / Nova      │
│   Settlement untuk L3 chains        │
└──────────────┬──────────────────────┘
               │ (Settlement + DA)
               ↓
┌─────────────────────────────────────┐
│      Layer 3: Orbit Chains          │
│  ├─ Gaming Chain (XAI)              │
│  ├─ DAO Chain (Rari)                │
│  ├─ Enterprise Chain                │
│  └─ Social App Chain (Sanko)        │
└─────────────────────────────────────┘
```

<div style={{background:'#E3F2FD',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 🎯 **Benefits of L3:**

**1. Even Lower Costs**
- Settle to L2 instead of L1 → drastically cheaper
- L3 → L2 settlement ~10x cheaper than L2 → L1

**2. Customization**
- Custom gas token (your project token!)
- Custom governance model
- Custom privacy features

**3. Dedicated Throughput**
- No competition dengan dApps lain
- Predictable performance
- Can optimize for specific workload

**4. Interoperability**
- Easy bridge to L2 ecosystem
- Access to L2 liquidity
- Shared security model

</div>

:::info L2 vs L3
- **L2:** Shared environment, pay for block space
- **L3:** Dedicated environment, control all parameters

Think: L2 = apartment building, L3 = your own house
:::

---

## Orbit Chain Types

<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'16px',margin:'20px 0'}}>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>🎮</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>Gaming Chains</div>
  <div style={{fontSize:'14px',color:'#666',marginBottom:'12px'}}>
    Dedicated chain untuk satu game atau gaming ecosystem
  </div>
  <div style={{fontSize:'13px',color:'#999'}}>
    <strong>Example:</strong> XAI, Proof of Play<br/>
    <strong>Gas Token:</strong> In-game currency<br/>
    <strong>Benefit:</strong> Free-to-play sustainable
  </div>
</div>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>🏢</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>Enterprise Chains</div>
  <div style={{fontSize:'14px',color:'#666',marginBottom:'12px'}}>
    Permissioned chains untuk corporate use
  </div>
  <div style={{fontSize:'13px',color:'#999'}}>
    <strong>Example:</strong> Private consortium<br/>
    <strong>Gas Token:</strong> Stablecoin/Corporate token<br/>
    <strong>Benefit:</strong> KYC/AML compliance
  </div>
</div>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>🏛️</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>DAO Chains</div>
  <div style={{fontSize:'14px',color:'#666',marginBottom:'12px'}}>
    DAO-governed chains dengan community control
  </div>
  <div style={{fontSize:'13px',color:'#999'}}>
    <strong>Example:</strong> Rari Chain<br/>
    <strong>Gas Token:</strong> Governance token<br/>
    <strong>Benefit:</strong> Community-driven development
  </div>
</div>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>💼</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>App-Specific Chains</div>
  <div style={{fontSize:'14px',color:'#666',marginBottom:'12px'}}>
    Single dApp with dedicated chain
  </div>
  <div style={{fontSize:'13px',color:'#999'}}>
    <strong>Example:</strong> Social app, DeFi protocol<br/>
    <strong>Gas Token:</strong> App token<br/>
    <strong>Benefit:</strong> Full control, capture MEV
  </div>
</div>

</div>

---

## Real Orbit Chains (Live Examples)

| Chain | Type | Use Case | Gas Token | Base Layer |
|-------|------|----------|-----------|------------|
| **XAI** | Gaming L3 | Web3 gaming ecosystem | XAI | Arbitrum One |
| **Sanko** | Social Gaming | Social + gaming hybrid | DMT | Arbitrum One |
| **Rari Chain** | NFT/Creator | Creator economy platform | ETH | Arbitrum One |
| **Proof of Play** | Gaming | Pirate Nation game chain | PIRATE | Arbitrum Nova |

:::success Real-World Adoption
Orbit chains sudah live dengan **ribuan users** dan **jutaan transactions**. Teknologi proven!
:::

---

## How to Launch Orbit Chain

### Step 1: Pilih Base Layer

<div style={{background:'#FFF3E0',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

**Option A: Settle to Arbitrum One**
- ✅ Maximum security
- ✅ Larger ecosystem
- 💰 Moderate settlement costs

**Option B: Settle to Arbitrum Nova**
- ✅ Ultra-low costs
- ✅ Perfect untuk high-volume
- ⚠️ Slight trust assumptions (DAC)

</div>

### Step 2: Konfigurasi Parameter

```json
// orbit-config.json
{
  "chainName": "MyGameChain",
  "chainId": 999999,

  // Base layer (where this L3 settles)
  "baseChain": "arbitrum-one", // or "arbitrum-nova"

  // Data availability mode
  "dataAvailability": "anytrust", // or "rollup"

  // Gas token configuration
  "gasToken": {
    "symbol": "GAME",
    "address": "0x...", // ERC-20 address on base layer
    "decimals": 18
  },

  // Validator configuration
  "validators": [
    "0x...", // Validator 1
    "0x...", // Validator 2
    "0x..."  // Validator 3
  ],

  // Governance
  "owner": "0x...", // Multisig atau DAO contract

  // Chain parameters
  "blockTime": 250, // milliseconds
  "gasLimit": 32000000,

  // Sequencer
  "sequencer": {
    "mode": "centralized", // or "decentralized" (future)
    "address": "0x..."
  }
}
```

### Step 3: Deploy Smart Contracts

```javascript
// Install Orbit SDK
// npm install @arbitrum/orbit-sdk

const { OrbitChainCreator } = require('@arbitrum/orbit-sdk');

const creator = new OrbitChainCreator({
  baseChain: 'arbitrum-one',
  privateKey: process.env.DEPLOYER_PRIVATE_KEY
});

// Deploy rollup contracts to base layer
const contracts = await creator.deployContracts({
  chainConfig: config,
  validators: validatorAddresses,
  batchPoster: batchPosterAddress
});

console.log('✅ Rollup deployed:', contracts.rollupAddress);
console.log('✅ Inbox:', contracts.inboxAddress);
console.log('✅ Outbox:', contracts.outboxAddress);
```

### Step 4: Jalankan Infrastruktur

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

**Required Infrastructure:**

**1. Sequencer Node**
- Mengurutkan transaksi
- Mengeksekusi state transitions
- Post batches ke base layer

**2. Validator Nodes**
- Monitor sequencer output
- Submit fraud proofs jika invalid
- Ensure chain security

**3. RPC Nodes**
- Serve user requests (`eth_call`, etc)
- Broadcast transactions ke sequencer
- Public API endpoints

**4. Block Explorer** (Optional)
- User-facing blockchain explorer
- Transaction history dan analytics

</div>

### Step 5: Bootstrap Likuiditas

```solidity
// If using custom gas token, provide liquidity

// Example: Create Uniswap pair
// GAME/ETH pool on base layer
// Users can buy GAME token to pay for gas on your L3
```

### Step 6: Launch & Onboard

- 🌉 Deploy bridge UI
- 📄 Deploy contracts dari L2
- 👥 Onboard early users
- 📣 Marketing & community building

---

## Orbit SDK Usage

### Installation

```bash
npm install @arbitrum/orbit-sdk ethers
```

### Complete Deployment Script

```javascript
const { OrbitChainCreator } = require('@arbitrum/orbit-sdk');
const { ethers } = require('ethers');

async function main() {
  // 1. Setup provider
  const provider = new ethers.providers.JsonRpcProvider(
    'https://arb1.arbitrum.io/rpc'
  );
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // 2. Initialize creator
  const creator = new OrbitChainCreator({
    baseChain: 'arbitrum-one',
    signer: deployer
  });

  // 3. Deploy contracts
  console.log('Deploying Orbit chain contracts...');
  const deployment = await creator.deployContracts({
    chainConfig: {
      chainId: 999999,
      name: "My Game Chain"
    },
    validators: [deployer.address],
    batchPoster: deployer.address
  });

  console.log('✅ Contracts deployed!');
  console.log('Rollup:', deployment.rollupAddress);
  console.log('Inbox:', deployment.inboxAddress);

  // 4. Initialize chain
  console.log('Initializing chain...');
  await creator.initializeChain({
    rollupAddress: deployment.rollupAddress,
    owner: deployer.address
  });

  console.log('🚀 Orbit chain live!');
}

main().catch(console.error);
```

---

## Keuntungan Orbit

<div style={{background:'#E3F2FD',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 💰 **Kontrol Ekonomi**
- Capture MEV dari chain kamu sendiri
- Set fee structure sesuai model bisnis
- Control token supply dan distribution

### 🎨 **Kustomisasi Penuh**
- Modify consensus mechanism
- Add custom precompiles
- Implement privacy features (ZK, TEE)

### ⚡ **Performa Dedicated**
- No competition dengan dApps lain
- Predictable gas prices
- Optimize untuk workload spesifik

### 🔒 **Compliance & Privacy**
- Implement KYC/AML on-chain
- Geographic restrictions jika needed
- Private transactions jika required

### 🏢 **Branding**
- White-label chain dengan brand kamu
- Custom block explorer
- Your own RPC endpoints

### 🔗 **Interoperabilitas**
- Native bridge ke Arbitrum ecosystem
- Access L2 liquidity
- Shared security guarantees

</div>

---

## Biaya dan Pertimbangan

:::warning ⚠️ **Running Orbit Chain Requires:**

**Infrastructure Costs:**
- $2,000-10,000/month untuk sequencer, validator, RPC nodes
- Higher untuk high-availability setups

**L2 Posting Fees:**
- Pay Arbitrum One/Nova untuk posting batches
- Lebih murah dari posting ke L1, tapi tetap ada cost

**Technical Expertise:**
- Need DevOps team untuk maintain infrastructure
- 24/7 monitoring dan alerting

**Security:**
- Must secure validator set
- Key management critical

**Bootstrap Liquidity:**
- If custom gas token, need liquidity pools
- Users need way to acquire gas token

**User Acquisition:**
- Marketing to attract users dan developers
- Chicken-and-egg problem (users vs dApps)

:::

---

## Kapan Meluncurkan Orbit Chain

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### ✅ **Good Use Cases:**

- Ekosistem gaming besar (jutaan transactions/day)
- Enterprise dengan strict compliance requirements
- DAO yang ingin full governance control
- Platform sosial dengan massive user base
- DeFi protocol ingin capture MEV
- Kamu punya resource untuk operasikan infrastructure (&gt;$5K/month budget)

</div>

<div style={{background:'#FFEBEE',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### ❌ **Mungkin Overkill Jika:**

- Single dApp dengan &lt;100K users
- Budget &lt;$5K/month operational
- Tidak punya DevOps team
- Arbitrum One/Nova sudah cukup untuk kebutuhan
- Don't need custom gas token atau governance

</div>

:::info Start Simple, Scale Later
**Recommendation:** Launch di Arbitrum One/Nova dulu. Migrate ke Orbit ketika:
- User base &gt;100K aktif
- Transaction volume &gt;1M/day
- Clear need untuk customization
- Budget untuk operational costs
:::

---

## Resources

<div style={{background:'#f8f9fa',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 📖 **Documentation**
- [Orbit Docs](https://docs.arbitrum.io/launch-orbit-chain) - Complete guide
- [Orbit SDK](https://github.com/OffchainLabs/orbit-sdk) - GitHub repo
- [Orbit Portal](https://arbitrum.io/orbit) - Landing page

### 🤝 **Support**
- [Discord #orbit](https://discord.gg/arbitrum) - Technical support
- [Forum](https://research.arbitrum.io) - Design discussions

### 🏗️ **Examples**
- [XAI Documentation](https://xai-foundation.gitbook.io/) - Gaming L3
- [Rari Chain Docs](https://docs.rarichain.org/) - Creator L3

</div>

---

## Next Steps

Di modul berikutnya, kita akan explore **Arbitrum Stylus** - revolutionary technology untuk menulis smart contracts dalam **Rust, C++**, dan bahasa lain dengan performance 10-100x!

:::success Own Your Infrastructure 🏗️
Orbit memberikan sovereignty penuh sambil maintain security dari Ethereum!
:::
