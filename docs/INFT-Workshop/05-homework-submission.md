---
id: homework-submission
title: Homework & Submission
sidebar_position: 5
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
| **Task 1** | Deploy AgentNFT + Mint INFT | [Typeform](https://xsxo494365r.typeform.com/to/U7FoSXUa) |
| **Task 2** | Integrate 0G Storage (Bonus) | [Typeform](https://xsxo494365r.typeform.com/to/U7FoSXUa) |

---

## Task 1: Deploy AgentNFT + Mint INFT

### Objektif
Deploy contract AgentNFT menggunakan monorepo dan mint INFT di atasnya.

### Langkah-langkah

#### Step 1: Clone Monorepo

```bash
# Clone monorepo
git clone https://github.com/Ethereum-Jakarta/og-inft-monorepo.git
cd og-inft-monorepo

# Enable Yarn 4
corepack enable

# Install dependencies
yarn install
```

#### Step 2: Setup Environment

```bash
cd packages/0g-agent-inft

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
EOF
```

#### Step 3: Setup Parameters

```bash
# Copy the example parameters file
cp ignition/parameters.example.json ignition/parameters.json
```

Edit `ignition/parameters.json` dan replace semua `0xYourDeployerAddress` dengan wallet address kamu.

#### Step 4: Compile Contracts

```bash
yarn hardhat compile
```

#### Step 5: Deploy ke 0G Testnet

```bash
# Deploy dan verify semua contracts
yarn hardhat ignition deploy ignition/modules/AgentNFT.ts \
  --network zgTestnet \
  --parameters ignition/parameters.json \
  --verify
```

**Penting:** Gunakan **proxy addresses** (tanpa suffix `Impl` atau `Beacon`):
- `AgentNFTModule#AgentNFT` - ini yang dipakai!

#### Step 6: Run Full Stack

```bash
# Terminal 1: Executor service
cd packages/executor-service
cp .env.example .env
# Edit .env dengan AGENT_NFT_ADDRESS kamu
yarn dev

# Terminal 2: Frontend
cd packages/frontend
# Edit src/config/contracts.ts dengan addresses kamu
yarn dev
```

#### Step 7: Mint via Frontend

1. Buka http://localhost:5173
2. Connect wallet
3. Go to Mint page
4. Configure agent dan mint!

### Submission Task 1

**Submit di:** [https://xsxo494365r.typeform.com/to/U7FoSXUa](https://xsxo494365r.typeform.com/to/U7FoSXUa)

Yang perlu disiapkan:
- [ ] Contract address AgentNFT yang kamu deploy
- [ ] Deploy transaction hash
- [ ] Mint transaction hash
- [ ] Token ID yang di-mint
- [ ] Link GitHub repo (opsional tapi recommended)
- [ ] Screenshot dari explorer

---

## Task 2: 0G Storage Integration (Bonus)

:::tip Bonus Task
Task ini **opsional** tapi sangat direkomendasikan untuk pemahaman yang lebih dalam tentang 0G ecosystem!
:::

### Objektif
Integrate 0G Storage untuk menyimpan agent config secara decentralized.

### Background

Saat ini, monorepo menyimpan agent config di executor service (off-chain). Untuk implementasi production yang lebih robust, config seharusnya disimpan di 0G Storage dengan flow:

```
1. User mint INFT → config hash stored on-chain
2. Full config encrypted dan stored di 0G Storage
3. Executor fetches config dari 0G Storage
4. Config decrypted untuk inference
```

### Langkah-langkah

#### Step 1: Setup 0G Storage SDK

```bash
# Di executor-service
yarn add @0glabs/0g-storage-sdk
```

#### Step 2: Implement Storage Service

Buat file `src/services/storage.ts`:

```typescript
import { ZgStorageClient } from "@0glabs/0g-storage-sdk";

const ZG_INDEXER_URL = process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai";

export async function uploadConfig(config: object): Promise<string> {
    // TODO: Implement upload to 0G Storage
    // Return the storage root hash
}

export async function downloadConfig(rootHash: string): Promise<object> {
    // TODO: Implement download from 0G Storage
    // Return the config object
}
```

#### Step 3: Update Mint Flow

Modify frontend mint flow to:
1. Upload config to 0G Storage
2. Get storage root hash
3. Store root hash as `dataHash` in INFT

#### Step 4: Update Executor

Modify executor to:
1. Read `dataHash` from INFT
2. Fetch config from 0G Storage using hash
3. Use config for inference

### Resources

- [0G Storage Documentation](https://docs.0g.ai/build-with-0g/storage-network)
- [0G Storage SDK](https://www.npmjs.com/package/@0glabs/0g-storage-sdk)
- [Example Implementation](https://github.com/0glabs/0g-storage-sdk/tree/main/examples)

### Submission Task 2

Submit bersama Task 1 di [Typeform](https://xsxo494365r.typeform.com/to/U7FoSXUa)

Yang perlu disiapkan:
- [ ] Link ke fork/branch dengan 0G Storage implementation
- [ ] Screenshot upload/download working
- [ ] Brief explanation of your implementation

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
- [ ] Wallet connected ke 0G Testnet
- [ ] Test OG token dari faucet
- [ ] Clone monorepo og-inft-monorepo
- [ ] Setup parameters.json
- [ ] Compile tanpa error
- [ ] Deploy dengan Hardhat Ignition berhasil
- [ ] Proxy contract addresses tersimpan
- [ ] Executor service running
- [ ] Frontend running
- [ ] Mint INFT via frontend berhasil
- [ ] Semua transaction hash tersimpan

### Task 2 (Bonus)
- [ ] 0G Storage SDK installed
- [ ] Upload config to storage works
- [ ] Download config from storage works
- [ ] Integration dengan mint flow

### Feedback
- [ ] Minimal 5-8 kalimat
- [ ] Menjawab semua aspek
- [ ] Konstruktif dan detail

---

## Troubleshooting

### "Insufficient funds"
- Pastikan sudah claim dari [faucet](https://faucet.0g.ai)
- Cek balance di explorer

### "yarn not found"
Pastikan Node.js dan corepack sudah terinstall:
```bash
node -v
corepack enable
yarn -v
```

### "Compilation failed"
- Pastikan Node.js v18+
- Coba `yarn install` ulang

### Deploy gagal
- Check private key di `.env`
- Pastikan punya cukup OG token
- Coba increase gas limit

### RPC Connection Error
- Coba beberapa kali (network mungkin busy)
- Pastikan Chain ID benar (16602)

---

## Resources

### Documentation
- [ETHJKT INFT Monorepo](https://github.com/Ethereum-Jakarta/og-inft-monorepo)
- [0G Agent NFT (Official)](https://github.com/0gfoundation/0g-agent-nft)
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
