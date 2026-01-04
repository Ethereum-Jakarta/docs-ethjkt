---
id: hands-on-full-stack
title: "Hands-on: Full Stack INFT"
sidebar_position: 4
---

# Hands-on: Mint & Chat with INFT

Tutorial lengkap untuk menjalankan full stack INFT dan chat dengan AI.

## Prerequisites

Sebelum mulai, pastikan sudah selesai dari [Integration Guide](./03-integration-guide.md):

- [x] Monorepo sudah di-clone dan dependencies terinstall
- [x] Contracts sudah di-deploy ke 0G Testnet
- [x] Proxy addresses tersimpan (AgentNFT, Verifier, TEEVerifier)
- [ ] MetaMask connected ke 0G Testnet (Chain ID: 16602)
- [ ] Test OG token dari [faucet](https://faucet.0g.ai)

---

## Part 1: Setup Executor Service

Executor service menangani:
- Penyimpanan config off-chain
- Verifikasi authorization on-chain
- Koneksi ke 0G Compute API

### Step 1.1: Environment Setup

```bash
cd packages/executor-service

# Copy example env
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=3001

# 0G Network
OG_RPC_URL=https://evmrpc-testnet.0g.ai
AGENT_NFT_ADDRESS=0x...  # Your AgentNFT proxy address

# 0G Compute API
OG_COMPUTE_URL=https://api.0g.ai/v1
OG_COMPUTE_API_KEY=your_api_key
```

### Step 1.2: Get 0G Compute API Key

Jalankan dari **root monorepo**:

```bash
cd /path/to/og-inft-monorepo
yarn 0g-compute-cli inference get-secret --provider 0xa48f01287233509FD694a22Bf840225062E67836
```

Copy secret ke `OG_COMPUTE_API_KEY` di `.env`.

### Step 1.3: Start Executor

```bash
cd packages/executor-service
yarn dev
```

Output:
```
Server running on port 3001
Contract: 0x...
```

### Step 1.4: Verify Service

```bash
# Health check
curl http://localhost:3001/health
```

---

## Part 2: Setup Frontend

### Step 2.1: Environment Setup

```bash
cd packages/frontend

# Create .env file
cat > .env << EOF
VITE_EXECUTOR_URL=http://localhost:3001
EOF
```

### Step 2.2: Update Contract Addresses

Edit `src/config/contracts.ts` dengan deployed proxy addresses:

```typescript
export const CONTRACTS = {
  AgentNFT: "0x..." as Address,      // Your AgentNFT proxy
  Verifier: "0x..." as Address,      // Your Verifier proxy
  TEEVerifier: "0x..." as Address,   // Your TEEVerifier proxy
};
```

### Step 2.3: Start Frontend

```bash
yarn dev
```

Open http://localhost:5173

---

## Part 3: Mint INFT via Frontend

### Step 3.1: Connect Wallet

1. Buka http://localhost:5173
2. Click "Connect Wallet"
3. Pilih wallet dan approve connection

### Step 3.2: Go to Mint Page

1. Navigate ke `/mint`
2. Kamu akan melihat form untuk configure agent

### Step 3.3: Configure Agent

Isi form dengan:
- **Name**: Nama agent (e.g., "My Web3 Assistant")
- **Model**: Pilih model AI (e.g., "qwen/qwen-2.5-7b-instruct")
- **System Prompt**: Instruksi untuk AI
- **Personality**: Deskripsi personality
- **Capabilities**: Pilih capabilities
- **Temperature**: Adjust randomness (0-2)
- **Max Tokens**: Max response length

### Step 3.4: Mint

1. Review config dan preview hash
2. Click "Mint INFT"
3. Approve transaction di wallet
4. Tunggu konfirmasi

:::tip Auto-Register
Frontend otomatis register config ke executor service setelah mint berhasil.
:::

---

## Part 4: Authorize Users via Frontend

### Step 4.1: Go to My INFTs Page

1. Navigate ke `/my-infts`
2. Kamu akan melihat list INFT yang kamu miliki

### Step 4.2: Select INFT

Click pada INFT yang ingin di-manage.

### Step 4.3: Authorize User

1. Masukkan address user yang ingin di-authorize
2. Click "Authorize"
3. Approve transaction di wallet

### Step 4.4: Revoke Authorization

1. Pada list authorized users, click "Revoke" di samping address
2. Approve transaction di wallet

---

## Part 5: Chat with INFT

### Step 5.1: Go to Chat Page

1. Navigate ke `/chat`
2. Kamu akan melihat marketplace agents yang tersedia

### Step 5.2: Select Agent

1. Browse agents yang available
2. Status authorization ditampilkan (Owner/Authorized/Not Authorized)
3. Click pada agent yang kamu punya akses

### Step 5.3: Start Chatting

1. Ketik message di input box
2. Click "Send"
3. Sign message di wallet (untuk verifikasi)
4. Tunggu AI response!

```
Flow:
User types → Sign message → Executor verifies →
Check on-chain auth → Load config → Call 0G Compute → Response
```

---

## Part 6: Quick Reference

### Quick Start (3 terminals)

```bash
# Terminal 1: Executor Service
cd packages/executor-service
yarn dev

# Terminal 2: Frontend
cd packages/frontend
yarn dev

# Terminal 3: (Optional) Watch contracts
cd packages/0g-agent-inft
yarn hardhat compile --watch
```

### API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/agents/registered` | List registered agents |
| GET | `/api/auth/:tokenId/:address` | Check authorization |
| GET | `/api/config/:tokenId` | Get agent config |
| POST | `/api/register` | Register config (owner) |
| POST | `/api/inference` | Run AI inference |

---

## (Optional) Using Scripts

Untuk advanced users yang ingin interact langsung dengan contract:

```bash
cd packages/0g-agent-inft

# Mint via script
yarn hardhat run scripts/workshop-mint.ts --network zgTestnet

# Authorize via script
yarn hardhat run scripts/workshop-authorize.ts --network zgTestnet
```

:::warning Off-chain Config
Jika mint via script, config TIDAK otomatis ter-register di executor.
Gunakan frontend untuk flow yang lengkap.
:::

---

## Checkpoint Summary

Setelah menyelesaikan tutorial ini:

- [x] Clone dan setup monorepo
- [x] Deploy contracts dengan Hardhat Ignition
- [x] Executor service running
- [x] Frontend running
- [x] Mint INFT via frontend
- [x] Config auto-registered ke executor
- [x] Authorize user via frontend
- [x] Chat dengan AI via frontend

## Key Functions Reference

| Function | Description |
|----------|-------------|
| `mint(iDatas, to)` | Mint INFT dengan intelligent data |
| `authorizeUsage(tokenId, user)` | Grant usage ke user |
| `batchAuthorizeUsage(tokenId, users)` | Grant ke multiple users |
| `revokeAuthorization(tokenId, user)` | Revoke dari user |
| `clearAuthorizedUsers(tokenId)` | Clear semua users |
| `authorizedUsersOf(tokenId)` | Get authorized users |

## Troubleshooting

### "Insufficient funds"
- Claim test token dari [faucet](https://faucet.0g.ai)

### "Not authorized"
- Pastikan kamu owner atau sudah di-authorize

### "Config not found"
- Mint ulang via frontend (auto-register config)

### Executor tidak respond
- Check apakah `AGENT_NFT_ADDRESS` benar di `.env`
- Pastikan executor running di port 3001

### Frontend tidak connect
- Check `VITE_EXECUTOR_URL` di frontend `.env`
- Pastikan executor running

---

:::tip Next Step
Selesai! Lanjut ke [Homework & Submission](./05-homework-submission.md) untuk submit hasil kerja dan explore 0G Storage integration!
:::
