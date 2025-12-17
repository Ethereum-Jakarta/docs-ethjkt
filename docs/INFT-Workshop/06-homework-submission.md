---
id: homework-submission
title: Homework & Submission
sidebar_position: 6
---

# Homework & Submission Guide

Selamat! Kamu sudah menyelesaikan workshop INFT. Sekarang saatnya untuk mengerjakan homework dan submit hasil kerja kamu.

:::info Deadline
Pastikan submit sebelum deadline yang diumumkan di channel Discord/Telegram untuk mendapatkan reward!
:::

## Overview Homework

Ada **2 tasks** yang harus diselesaikan:

| Task | Deskripsi | Submission |
|------|-----------|------------|
| **Task 1** | Mint INFT di 0G Test Network | [Typeform 1](https://xsxo494365r.typeform.com/to/VccFRojV) |
| **Task 2** | Deploy AgentNFT + Mint INFT sendiri | [Typeform 2](https://xsxo494365r.typeform.com/to/U7FoSXUa) |

---

## Task 1: Mint INFTs on 0G Test Network

### Objektif
Mint INFT menggunakan contract yang sudah di-deploy oleh tim workshop.

### Langkah-langkah

#### Step 1: Setup Wallet
```
Network Name: 0G Galileo Testnet
RPC URL: https://evmrpc-testnet.0g.ai
Chain ID: 16601
Symbol: OG
Explorer: https://chainscan-galileo.0g.ai
```

#### Step 2: Dapatkan Test Token
Kunjungi faucet untuk mendapatkan OG test token:
- [0G Faucet](https://faucet.0g.ai)

#### Step 3: Mint INFT
1. Buka contract yang diberikan di workshop
2. Connect wallet kamu
3. Panggil fungsi `mint()` dengan parameter:
   - `iDatas`: Array of IntelligentData
   - `to`: Wallet address kamu

4. Approve transaction dan tunggu konfirmasi

#### Step 4: Verifikasi
1. Cek transaction di [0G Explorer](https://chainscan-galileo.0g.ai)
2. Copy transaction hash untuk submission

### Submission Task 1

**Submit di:** [https://xsxo494365r.typeform.com/to/VccFRojV](https://xsxo494365r.typeform.com/to/VccFRojV)

Yang perlu disiapkan:
- [ ] Wallet address kamu
- [ ] Transaction hash mint
- [ ] Token ID yang didapat
- [ ] Screenshot hasil mint

---

## Task 2: Deploy AgentNFT + Mint INFT

### Objektif
Deploy contract AgentNFT dari repository resmi dan mint INFT di atasnya.

### Langkah-langkah

#### Step 1: Clone Repository Resmi

```bash
# Clone repository resmi 0G Agent NFT
git clone https://github.com/0gfoundation/0g-agent-nft.git
cd 0g-agent-nft

# Install dependencies
pnpm install
```

#### Step 2: Setup Environment

Buat file `.env`:

```env
# Private Key (dari wallet testing)
PRIVATE_KEY=your_private_key_here

# 0G Network
ZG_RPC_URL=https://evmrpc-testnet.0g.ai
ZG_CHAIN_ID=16601

# NFT Config
ZG_iNFT_NAME=My Homework INFT
ZG_iNFT_SYMBOL=HWINFT

# Storage
ZG_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
```

#### Step 3: Compile Contracts

```bash
pnpm compile
```

#### Step 4: Deploy ke 0G Testnet

```bash
# Deploy Verifier dulu
pnpm hardhat deploy --tags verifier --network 0g-testnet

# Deploy AgentNFT
pnpm hardhat deploy --tags agentNFT --network 0g-testnet
```

Simpan address contract yang muncul di output!

#### Step 5: Mint INFT

Buat file `scripts/homework-mint.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
    // Ganti dengan address contract yang sudah di-deploy
    const AGENT_NFT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";

    console.log("Minting INFT for Homework...");

    const [owner] = await ethers.getSigners();
    const agentNFT = await ethers.getContractAt("AgentNFT", AGENT_NFT_ADDRESS);

    // Buat agent config unik kamu
    const myAgentConfig = {
        name: "My Personal AI Agent",
        model: "gpt-4",
        systemPrompt: "You are my personal assistant.",
        createdBy: owner.address,
        timestamp: Date.now()
    };

    // Create data hash
    const dataHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(myAgentConfig))
    );

    // Prepare IntelligentData
    const iDatas = [{
        dataDescription: "Homework Agent Config",
        dataHash: dataHash
    }];

    // Mint
    const tx = await agentNFT.mint(iDatas, owner.address);
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed!");

    // Get token ID from event
    for (const log of receipt.logs) {
        try {
            const parsed = agentNFT.interface.parseLog(log);
            if (parsed?.name === "Minted") {
                console.log("\nToken ID:", parsed.args.tokenId.toString());
            }
        } catch {}
    }

    console.log("\nDone! Save transaction hash for submission.");
}

main().catch(console.error);
```

```bash
pnpm hardhat run scripts/homework-mint.ts --network 0g-testnet
```

### Submission Task 2

**Submit di:** [https://xsxo494365r.typeform.com/to/U7FoSXUa](https://xsxo494365r.typeform.com/to/U7FoSXUa)

Yang perlu disiapkan:
- [ ] Contract address AgentNFT yang kamu deploy
- [ ] Deploy transaction hash
- [ ] Mint transaction hash
- [ ] Token ID yang di-mint
- [ ] Link GitHub repo (opsional tapi recommended)
- [ ] Screenshot dari explorer

---

## Feedback Collection

:::warning IMPORTANT
Feedback adalah bagian **WAJIB** dari submission. Tanpa feedback yang lengkap, submission tidak akan diproses.
:::

### Requirements

**Minimum:** 5-8 kalimat yang jelas

### Pertanyaan Feedback

1. **Pengalaman Workshop**
   - Bagaimana pengalaman kamu mengikuti workshop ini?
   - Apa yang paling kamu suka?

2. **Technical Content**
   - Apakah penjelasan tentang INFT dan ERC-7857 mudah dipahami?
   - Bagian mana yang paling challenging?

3. **Hands-on Experience**
   - Apakah tutorial hands-on cukup jelas?
   - Ada kendala teknis yang kamu alami?

4. **Improvement Suggestions**
   - Apa yang bisa ditingkatkan untuk workshop selanjutnya?
   - Topic apa yang ingin kamu pelajari lebih dalam?

5. **0G Ecosystem**
   - Apa pendapat kamu tentang teknologi 0G?
   - Apakah kamu tertarik build project dengan 0G?

### Contoh Feedback yang Baik

```
Workshop ini sangat membantu saya memahami konsep INFT dan bagaimana
NFT bisa menjadi lebih dari sekadar collectible. Penjelasan tentang
ERC-7857 cukup teknis tapi masih bisa diikuti. Bagian yang paling
challenging adalah deploy ke 0G testnet karena pertama kali pakai
network ini. Saya appreciate adanya repository resmi yang bisa
langsung digunakan. Untuk improvement, mungkin bisa ditambahkan
video recording hands-on. Saya tertarik explore 0G lebih lanjut
terutama untuk AI agent marketplace.
```

---

## Checklist Final

Sebelum submit, pastikan:

### Task 1
- [ ] Wallet sudah connect ke 0G Testnet
- [ ] Sudah punya test OG token
- [ ] Mint berhasil
- [ ] Transaction hash tersimpan
- [ ] Screenshot siap

### Task 2
- [ ] Clone repository 0g-agent-nft
- [ ] Compile tanpa error
- [ ] Deploy Verifier berhasil
- [ ] Deploy AgentNFT berhasil
- [ ] Contract address tersimpan
- [ ] Mint INFT berhasil
- [ ] Semua transaction hash tersimpan

### Feedback
- [ ] Minimal 5-8 kalimat
- [ ] Menjawab semua aspek
- [ ] Konstruktif dan detail

---

## Troubleshooting

### "Insufficient funds"
- Pastikan sudah claim dari [faucet](https://faucet.0g.ai)
- Cek balance di explorer

### "pnpm not found"
```bash
npm install -g pnpm
```

### "Compilation failed"
- Pastikan Node.js v18+
- Coba `pnpm install` ulang

### Deploy gagal
- Check private key di `.env`
- Pastikan punya cukup OG token
- Coba increase gas limit

### RPC Connection Error
- Coba beberapa kali (network mungkin busy)
- Pastikan Chain ID benar (16601)

---

## Resources

### Documentation
- [0G Agent NFT Repository](https://github.com/0gfoundation/0g-agent-nft)
- [0G Official Docs](https://docs.0g.ai)
- [ERC-7857 Specification](https://docs.0g.ai/build-with-0g/compute-network/agentic-ai-solution/agent-nft/erc7857)

### Community Support
- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk)
- [Telegram ETHJKT](https://t.me/ethjkt_dev)
- [0G Discord](https://discord.gg/0gLabs)

### Tools
- [0G Explorer](https://chainscan-galileo.0g.ai)
- [0G Faucet](https://faucet.0g.ai)

---

## Rewards & Recognition

Peserta yang berhasil menyelesaikan homework akan mendapatkan:

- **Certificate of Completion** - Digital certificate dari ETHJKT
- **POAP** - Proof of Attendance Protocol NFT (jika available)
- **Community Recognition** - Shoutout di channel komunitas
- **Priority Access** - Akses prioritas untuk workshop selanjutnya

:::tip Pro Tip
Share hasil kerja kamu di Twitter/X dengan mention @ethereumjakarta dan @0g_Labs untuk visibility tambahan!
:::

---

Selamat mengerjakan homework! Jika ada pertanyaan, jangan ragu untuk ask di Discord atau Telegram community.

*Happy Building!*
