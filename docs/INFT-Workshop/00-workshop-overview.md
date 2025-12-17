---
id: workshop-overview
title: Workshop Overview
sidebar_position: 0
---

# INFT Workshop: Mint, License, Power with 0G

Workshop kolaborasi **Ethereum Jakarta x 0G Labs x HackQuest** untuk membangun Intelligent NFT (INFT) yang dapat di-mint, di-license (rental), dan di-power dengan 0G Inference.

## Apa yang Akan Kamu Pelajari

| Topik | Deskripsi |
|-------|-----------|
| **INFT Concept** | Memahami evolusi NFT dari static ke intelligent |
| **ERC-7857** | Standard baru untuk NFT dengan encrypted metadata |
| **Smart Contract** | Deploy dan interaksi dengan INFT contract |
| **Usage Authorization** | Sistem rental/license untuk AI agent |
| **0G Inference** | Integrasi dengan 0G compute untuk AI responses |

## Prerequisites

### Technical Requirements
- **Node.js** v18+ terinstall
- **MetaMask** atau wallet EVM lainnya
- **Git** untuk clone repositories
- Code editor (VS Code recommended)

### Knowledge Requirements
- Dasar Solidity dan smart contracts
- Familiar dengan ERC-721 (NFT standard)
- Basic JavaScript/TypeScript
- Pengalaman dengan Hardhat atau Foundry (nilai plus)

### Setup Sebelum Workshop
```bash
# Install Node.js (jika belum)
# Download dari https://nodejs.org

# Verify installation
node --version  # Should be v18+
npm --version

# Install Hardhat globally (optional)
npm install -g hardhat
```

### Wallet Setup
1. Install MetaMask extension
2. Tambahkan 0G Galileo Testnet:
   - **Network Name:** 0G Galileo Testnet
   - **RPC URL:** https://evmrpc-testnet.0g.ai
   - **Chain ID:** 16601
   - **Symbol:** OG
   - **Explorer:** https://chainscan-galileo.0g.ai

3. Claim test token dari [0G Faucet](https://faucet.0g.ai)

## Agenda Workshop

### Part 1: Konsep & Teori (30 menit)
- [ ] Apa itu INFT dan mengapa penting
- [ ] Deep dive ERC-7857 standard
- [ ] Arsitektur: TEE vs ZKP implementation
- [ ] Use cases dan aplikasi nyata

### Part 2: Smart Contract (30 menit)
- [ ] Setup development environment
- [ ] Review INFT contract structure
- [ ] Deploy ke 0G Testnet
- [ ] Mint INFT pertama

### Part 3: Usage Authorization (20 menit)
- [ ] Konsep rental/license
- [ ] Implement `grantUsage()` dan `revokeUsage()`
- [ ] Check authorization on-chain

### Part 4: 0G Inference Integration (30 menit)
- [ ] Setup executor service
- [ ] Connect ke 0G inference API
- [ ] Build simple AI-powered endpoint
- [ ] End-to-end demo

### Wrap-up & Homework (10 menit)
- [ ] Homework explanation
- [ ] Submission links
- [ ] Q&A session

## Tech Stack

```
Frontend:        React/Next.js + ethers.js/wagmi
Smart Contract:  Solidity 0.8.20 + OpenZeppelin
Development:     Hardhat / Foundry
Network:         0G Galileo Testnet (Chain ID: 16601)
AI Inference:    0G Compute Network
```

## Workshop Checkpoints

Gunakan checklist ini untuk track progress kamu:

### Checkpoint 1: Environment Ready
- [ ] Node.js terinstall
- [ ] Wallet connected ke 0G Testnet
- [ ] Test token claimed dari faucet
- [ ] Project folder created

### Checkpoint 2: Contract Deployed
- [ ] Hardhat project initialized
- [ ] INFT contract compiled
- [ ] Contract deployed ke testnet
- [ ] Contract address saved

### Checkpoint 3: INFT Minted
- [ ] Mint function called
- [ ] Token ID received
- [ ] Verified di explorer
- [ ] Agent config stored

### Checkpoint 4: Authorization Works
- [ ] `grantUsage()` berhasil
- [ ] `isAuthorized()` return true
- [ ] `revokeUsage()` tested

### Checkpoint 5: Inference Connected
- [ ] Executor service running
- [ ] 0G API connected
- [ ] AI response received
- [ ] End-to-end flow works

## Resources

### Official Documentation
- [0G INFT Overview](https://docs.0g.ai/build-with-0g/compute-network/agentic-ai-solution/agent-nft/overview)
- [ERC-7857 Specification](https://docs.0g.ai/build-with-0g/compute-network/agentic-ai-solution/agent-nft/erc7857)
- [Integration Guide](https://docs.0g.ai/build-with-0g/compute-network/agentic-ai-solution/agent-nft/integration-guide)

### GitHub Repositories
- [0G Agent NFT](https://github.com/0gfoundation/0g-agent-nft/tree/eip-7857-draft)
- [ETHJKT Examples](https://github.com/ethereumjakarta)

### Community
- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk)
- [Telegram ETHJKT](https://t.me/ethjkt_dev)
- [0G Discord](https://discord.gg/0gLabs)

---

:::tip Ready to Start?
Lanjut ke [Mengenal INFT](./01-mengenal-inft.md) untuk memahami konsep dasar Intelligent NFT!
:::
