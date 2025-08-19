---
id: getting-started
title: Getting Started
sidebar_position: 9
---

# Developer Hub: Memulai dengan 0G

### 🎯 Masalah yang Dipecahkan 0G
Aplikasi AI Anda membutuhkan:
- **Storage massive** untuk training data (TB dataset)
- **GPU compute** untuk model inference ($10K+/bulan di provider terpusat)
- **Data availability cepat** untuk response real-time
- **Desentralisasi** tanpa mengorbankan performance

:::success Infrastruktur Modular
0G menyediakan semua ini dalam satu ekosistem terintegrasi - atau gunakan hanya bagian yang Anda butuhkan.
:::

## Layanan 0G

### ⛓️ 0G Chain
Blockchain EVM-compatible yang dioptimalkan untuk AI
- **[Deploy Contracts](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)**
- **[Precompiles Reference](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/precompiles/precompiles-overview)**
- **[Chain Architecture](https://docs.0g.ai/concepts/chain)**

### 💻 0G Compute
Marketplace GPU terdesentralisasi untuk beban kerja AI
- **[Overview & Architecture](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/overview)**
- **[SDK Reference](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/sdk)**
- **[CLI Usage](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/cli)**
- **[Become a Provider](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference-provider)**

### 🗄️ 0G Storage
High-performance storage untuk dataset massive
- **[SDK Integration](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)**
- **[CLI Commands](https://docs.0g.ai/developer-hub/building-on-0g/storage/storage-cli)**
- **[Architecture Details](https://docs.0g.ai/concepts/storage)**

### 📊 0G DA
Data availability yang scalable untuk chain apapun
- **[Technical Deep Dive](https://docs.0g.ai/developer-hub/building-on-0g/da-deep-dive)**
- **[Integration Guide](https://docs.0g.ai/developer-hub/building-on-0g/da-integration)**
- **[Rollup Integrations](https://docs.0g.ai/developer-hub/building-on-0g/rollups-and-appchains/op-stack-on-0g-da)**

## Quick Start Guide untuk Developer Indonesia

### 1. Pilih Journey Anda

<details>
<summary><b>🚀 AI Developer - Ingin build aplikasi AI</b></summary>

**Perfect untuk:** Startup AI, researcher, individual developer

**Mulai dengan:**
1. [0G Compute](./4-0g-compute.md) - Akses GPU murah untuk inference
2. [0G Storage](./5-0g-storage.md) - Simpan dataset dan model
3. [0G Chain](./3-0g-chain.md) - Deploy smart contracts AI

**Timeline:** 1-2 minggu untuk MVP

</details>

<details>
<summary><b>⛓️ Blockchain Developer - Ingin build dApps</b></summary>

**Perfect untuk:** Web3 developer, DeFi builder, NFT creator

**Mulai dengan:**
1. [0G Chain](./3-0g-chain.md) - EVM compatible, gas murah
2. [0G Storage](./5-0g-storage.md) - On-chain storage untuk metadata
3. [0G DA](./6-0g-da.md) - Scalable data availability

**Timeline:** Beberapa hari untuk migrate dari Ethereum

</details>

<details>
<summary><b>💰 Hardware Owner - Ingin monetize hardware</b></summary>

**Perfect untuk:** Gaming enthusiast, crypto miner, data center owner

**Mulai dengan:**
1. [DePIN Providers](./8-depin-providers.md) - Contribute GPU/storage
2. [AI Alignment Nodes](./7-ai-alignment-nodes.md) - Monitor AI safety
3. Node operation untuk earn passive income

**Timeline:** 1 hari setup, earning immediate

</details>

<details>
<summary><b>🎓 Learner - Ingin belajar teknologi</b></summary>

**Perfect untuk:** Student, career switcher, tech enthusiast

**Mulai dengan:**
1. [Memahami 0G](./1-memahami-0g.md) - Fundamental concepts
2. [Visi & Misi](./2-visi-misi.md) - Why decentralized AI matters
3. Hands-on tutorials dan workshops

**Timeline:** Belajar sambil practice, 1-3 bulan

</details>

### 2. Setup Development Environment

#### Prerequisites
```bash
# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install git

# Install Docker (untuk local testing)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

#### 0G SDK Installation
```bash
# Install 0G client libraries
npm install @0glabs/0g-js-sdk
npm install @0glabs/0g-storage-client
npm install @0glabs/0g-compute-client
```

### 3. First Project: Hello 0G

#### Simple Storage Example
```javascript
import { StorageClient } from '@0glabs/0g-storage-client';

async function helloStorage() {
  const client = new StorageClient({
    url: 'https://rpc-storage-testnet.0g.ai',
    privateKey: 'your-private-key'
  });

  // Upload data
  const result = await client.upload({
    data: 'Hello from Indonesia! 🇮🇩',
    metadata: {
      name: 'First Upload',
      description: 'Learning 0G Storage'
    }
  });

  console.log('Uploaded successfully:', result.root);
  
  // Download data
  const downloaded = await client.download(result.root);
  console.log('Downloaded:', downloaded);
}

helloStorage();
```

#### Simple Compute Example
```javascript
import { ComputeClient } from '@0glabs/0g-compute-client';

async function helloCompute() {
  const client = new ComputeClient({
    apiKey: 'your-api-key'
  });

  // Run AI inference
  const result = await client.inference({
    model: 'gpt-3.5-turbo',
    prompt: 'Explain blockchain in Indonesian language',
    max_tokens: 100
  });

  console.log('AI Response:', result.output);
}

helloCompute();
```

#### Simple Chain Example
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloZeroG {
    string public message;
    
    constructor() {
        message = "Hello from 0G Chain!";
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
```

## Project Ideas untuk Indonesia

### 1. **AI-Powered Bahasa Indonesia NLP**
- **Concept**: Large language model khusus Bahasa Indonesia
- **Tech Stack**: 0G Compute + Storage + Chain
- **Market**: Content creation, customer service, education
- **Estimated Time**: 3-6 bulan

### 2. **Decentralized Medical Records**
- **Concept**: Patient data ownership dengan AI analysis
- **Tech Stack**: 0G Storage + DA + AI Alignment
- **Market**: Healthcare, telemedicine
- **Estimated Time**: 6-12 bulan

### 3. **Supply Chain Transparency untuk Export**
- **Concept**: Track produk Indonesia dari farm ke consumer
- **Tech Stack**: 0G Chain + Storage + IoT integration
- **Market**: Palm oil, coffee, textile industry
- **Estimated Time**: 3-9 bulan

### 4. **Educational AI Assistant**
- **Concept**: AI tutor untuk sistem pendidikan Indonesia
- **Tech Stack**: 0G Compute + Storage + local content
- **Market**: Universities, online learning platforms
- **Estimated Time**: 2-4 bulan

### 5. **Disaster Response Coordination**
- **Concept**: AI-powered emergency response system
- **Tech Stack**: 0G DA + Compute + real-time data
- **Market**: Government, NGOs, emergency services
- **Estimated Time**: 6-18 bulan

## Community Projects & Resources

### Awesome 0G Repository
Explore ecosystem DeAI applications di [awesome-0g](https://github.com/0glabs/awesome-0g) repository, yang showcase community projects, tools, dan resources yang dibangun di 0G.

### Indonesian Community Projects
- **Jakarta Smart Traffic**: AI traffic optimization using 0G
- **Bali Tourism AI**: Personalized travel recommendations
- **Jakarta Flood Prediction**: ML models untuk early warning
- **Indonesian Recipe AI**: Food recommendation engine

## Development Tools & Resources

### 1. **IDE & Extensions**
- **VS Code**: Dengan Solidity extension
- **Remix IDE**: Untuk smart contract development
- **Hardhat**: Development framework untuk Ethereum-compatible chains

### 2. **Testing & Debugging**
```bash
# Local testnet untuk development
npx hardhat node --network 0g-testnet

# Deploy contract ke 0G testnet
npx hardhat deploy --network 0g-testnet

# Verify contract
npx hardhat verify --network 0g-testnet CONTRACT_ADDRESS
```

### 3. **Monitoring & Analytics**
- **0G Explorer**: Block explorer untuk transaction tracking
- **Grafana Dashboards**: Untuk monitor node performance
- **Custom Analytics**: Build dengan 0G SDK

## Learning Path untuk Indonesian Developers

### Beginner (1-2 bulan)
1. **Fundamental Blockchain**: Bitcoin, Ethereum basics
2. **0G Architecture**: Understand modular design
3. **Basic Smart Contracts**: Solidity basics
4. **First dApp**: Deploy hello world contract

### Intermediate (2-4 bulan)
1. **AI Fundamentals**: Machine learning basics
2. **0G Compute**: GPU programming untuk AI
3. **DeFi Concepts**: AMM, lending, yield farming
4. **Complex dApps**: Multi-contract systems

### Advanced (4-6 bulan)
1. **AI Alignment**: Safety mechanisms
2. **DePIN Architecture**: Infrastructure networks
3. **Cross-chain Integration**: Multi-chain dApps
4. **Production Deployment**: Mainnet launch

## Troubleshooting Common Issues

### 1. **Network Connection Issues**
```bash
# Check network connectivity
ping rpc-testnet.0g.ai

# Verify RPC endpoint
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc-testnet.0g.ai
```

### 2. **Gas Fee Issues**
```javascript
// Set appropriate gas prices
const tx = await contract.someFunction({
  gasLimit: 300000,
  gasPrice: ethers.utils.parseUnits('20', 'gwei')
});
```

### 3. **Storage Upload Failures**
```javascript
// Retry logic untuk upload
async function uploadWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.upload(data);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Getting Help & Support

### Indonesian Community
- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk) - Indonesian developer community
- [Telegram](https://t.me/ethjkt_dev) - Daily discussions dan Q&A
- [Workshop ETHJKT](https://ethjkt.com) - Monthly hands-on workshops
- [GitHub](https://github.com/ethereumjakarta) - Code examples dan templates

### Global 0G Community
- [Discord 0G](https://discord.gg/0gLabs) - Global developer support
- [Twitter](https://x.com/0g_Labs) - Latest updates dan announcements
- [GitHub](https://github.com/0glabs) - Official repositories
- [Documentation](https://docs.0g.ai) - Complete technical docs

### Professional Support
- **Enterprise Support**: Untuk corporate implementations
- **Grant Program**: Funding untuk promising projects
- **Accelerator Program**: Mentorship untuk startups
- **Partner Network**: Technical integration support

:::tip Ready to Build?
Pilih service di atas dan mulai dalam hitungan menit, atau [join Discord Indonesian community](https://discord.gg/p5b6RFEnnk) untuk bantuan dalam Bahasa Indonesia!
:::

## Langkah Selanjutnya

Siap untuk deep dive?
- [Testnet Setup](./10-testnet-overview.md) - Setup development environment
- **[Official Advanced Guides](https://docs.0g.ai/developer-hub/building-on-0g)** - Build complex applications
- [Community Contribution](https://discord.gg/p5b6RFEnnk) - Contribute ke ETHJKT ecosystem

---

Ready to build the future of decentralized AI? Mari mulai journey Anda dengan 0G! 🚀