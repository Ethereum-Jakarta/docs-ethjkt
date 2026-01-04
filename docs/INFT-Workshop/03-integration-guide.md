---
id: integration-guide
title: Integration Guide
sidebar_position: 3
---

# Integration Guide: Setup & Deploy INFT

Panduan lengkap untuk setup, deploy, dan menjalankan full stack INFT application.

## Prerequisites

- Node.js 18+
- Yarn 4 (via corepack)
- Wallet dengan 0G Galileo Testnet token ([faucet](https://faucet.0g.ai))

### Setup Wallet

```
Network Name: 0G Galileo Testnet
RPC URL: https://evmrpc-testnet.0g.ai
Chain ID: 16602
Symbol: OG
Explorer: https://chainscan-galileo.0g.ai
```

---

## Arsitektur Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      INFT Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │───►│   Executor   │───►│  0G Compute  │  │
│  │    (React)   │    │   Service    │    │  (Inference) │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘  │
│         │                   │                               │
│         │                   ▼                               │
│         │           ┌──────────────┐                       │
│         │           │   AgentNFT   │                       │
│         └──────────►│   Contract   │                       │
│                     │  (0G Chain)  │                       │
│                     └──────┬───────┘                       │
│                            │                               │
│                            ▼                               │
│                     ┌──────────────┐                       │
│                     │  0G Storage  │                       │
│                     │  (Homework)  │                       │
│                     └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tanggung Jawab Komponen

| Komponen | Tanggung Jawab |
|----------|----------------|
| **Frontend** | UI untuk mint, authorize, chat |
| **Executor Service** | Penyimpanan config off-chain, verifikasi auth, integrasi 0G Compute |
| **AgentNFT Contract** | Ownership on-chain, authorization, penyimpanan config hash |
| **0G Compute** | AI inference via decentralized compute |
| **0G Storage** | Penyimpanan config decentralized (homework) |

:::info 0G Storage Integration
0G Storage integration belum sepenuhnya diimplementasi. Ini menjadi **homework** untuk peserta!
:::

### Struktur Project

```
og-inft-monorepo/
├── packages/
│   ├── 0g-agent-inft/           # Smart contracts (Hardhat + Solidity)
│   │   ├── contracts/
│   │   │   ├── AgentNFT.sol
│   │   │   ├── AgentMarket.sol
│   │   │   ├── TeeVerifier.sol
│   │   │   └── interfaces/
│   │   ├── ignition/
│   │   │   ├── modules/
│   │   │   └── parameters.example.json
│   │   └── scripts/
│   ├── executor-service/        # Backend API (Hono + TypeScript)
│   │   └── src/
│   └── frontend/                # React frontend (Vite + wagmi)
│       └── src/
├── package.json
└── yarn.lock
```

### Alur Data

**Mint Flow:**
```
1. User configure agent di frontend
2. Frontend generate config hash
3. Frontend panggil AgentNFT.mint() dengan hash
4. Frontend register full config ke executor service
5. Executor simpan config (off-chain, hash-verified)
```

**Inference Flow:**
```
1. User kirim prompt + sign message
2. Executor verifikasi signature
3. Executor cek on-chain authorization
4. Executor load config (verifikasi hash match)
5. Executor panggil 0G Compute API
6. Response dikembalikan ke user
```

**Authorization Flow:**
```
1. Owner panggil authorizeUsage(tokenId, user)
2. User address ditambahkan ke authorizedUsers[]
3. Executor cek authorizedUsersOf() untuk access control
```

---

## Step 1: Clone & Setup Monorepo

### 1.1 Clone Repository

```bash
git clone https://github.com/Ethereum-Jakarta/og-inft-monorepo.git
cd og-inft-monorepo
```

### 1.2 Enable Yarn 4

```bash
corepack enable
```

### 1.3 Install Dependencies

```bash
yarn install
```

---

## Step 2: Deploy Smart Contracts

### 2.1 Setup Environment

```bash
cd packages/0g-agent-inft

# Buat file .env
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
EOF
```

:::warning Private Key
Jangan pernah commit private key ke repository!
:::

### 2.2 Setup Parameters

```bash
# Copy file parameters contoh
cp ignition/parameters.example.json ignition/parameters.json
```

Edit `ignition/parameters.json` dan ganti semua `0xYourDeployerAddress` dengan wallet address kamu.

### 2.3 Compile Contracts

```bash
yarn hardhat compile
```

### 2.4 Deploy ke 0G Galileo Testnet

Deployment menggunakan Hardhat Ignition modules yang menangani full deployment:
- TEEVerifier (TEE verification)
- Verifier (dengan beacon proxy pattern)
- AgentNFT (dengan beacon proxy pattern)

```bash
# Deploy dan verify semua contracts
yarn hardhat ignition deploy ignition/modules/AgentNFT.ts \
  --network zgTestnet \
  --parameters ignition/parameters.json \
  --verify
```

### 2.5 Verifikasi Deployment

Setelah deployment, kamu akan melihat deployed addresses:

**Penting:** Gunakan **proxy addresses** (di bagian bawah, tanpa suffix `Impl` atau `Beacon`):

| Contract | Gunakan Address Dari |
|----------|----------------------|
| TEEVerifier | `TEEVerifierModule#TEEVerifier` |
| Verifier | `VerifierModule#Verifier` |
| AgentNFT | `AgentNFTModule#AgentNFT` |

**JANGAN** gunakan address `*Impl` (implementation) atau `*Beacon` secara langsung.

Simpan proxy addresses ini - kamu akan butuh untuk executor service dan frontend.

### 2.6 Verify di Block Explorer (Opsional)

Jika deploy tanpa `--verify` atau verifikasi gagal, kamu bisa verify manual:

```bash
yarn hardhat ignition verify chain-16602 --network zgTestnet
```

Lihat di explorer: https://chainscan-galileo.0g.ai

---

## AgentNFT Contract Reference

### Core Struct

```solidity
struct IntelligentData {
    string dataDescription;  // e.g., "AI Agent Config v1"
    bytes32 dataHash;        // Hash of encrypted config
}

struct TokenData {
    address owner;
    address[] authorizedUsers;
    address approvedUser;
    IntelligentData[] iDatas;
}
```

### Key Functions

| Function | Deskripsi |
|----------|-----------|
| `mint(iDatas, to)` | Mint INFT dengan intelligent data |
| `authorizeUsage(tokenId, user)` | Grant usage ke user |
| `batchAuthorizeUsage(tokenId, users)` | Grant ke multiple users |
| `revokeAuthorization(tokenId, user)` | Revoke dari user |
| `clearAuthorizedUsers(tokenId)` | Clear semua users |
| `authorizedUsersOf(tokenId)` | Get list authorized users |
| `intelligentDatasOf(tokenId)` | Get intelligent data |
| `ownerOf(tokenId)` | Get token owner |

### Events

```solidity
event Minted(uint256 indexed tokenId, address indexed _creator, address indexed _owner);
event Authorization(address indexed from, address indexed to, uint256 indexed tokenId);
event AuthorizationRevoked(address indexed from, address indexed to, uint256 indexed tokenId);
```

### Constants

- `MAX_AUTHORIZED_USERS = 100` - Maximum authorized users per token

---

## Executor Service API Reference

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/api/agents` | List preset agent types |
| GET | `/api/agents/registered` | List registered agents |
| GET | `/api/auth/:tokenId/:address` | Check authorization |
| GET | `/api/token/:tokenId` | Get token details |
| GET | `/api/config/:tokenId` | Get stored config |
| POST | `/api/register` | Register config (owner) |
| POST | `/api/inference` | Run AI inference |

### Inference Request

```typescript
POST /api/inference
{
  tokenId: number,
  userAddress: string,
  signature: string,      // Signed message
  message: string,        // Original message
  prompt: string,         // User's question
  context?: Message[]     // Chat history
}
```

### Inference Response

```typescript
{
  success: boolean,
  tokenId: number,
  response: string,       // AI response
  model: string,          // Model used
  timestamp: string
}
```

---

## Agent Config Schema

```typescript
interface AgentConfig {
  name: string;           // Nama display agent
  model: string;          // Model ID (e.g., "qwen/qwen-2.5-7b-instruct")
  systemPrompt: string;   // System instructions untuk AI
  personality: string;    // Deskripsi personality
  capabilities: string[]; // List capabilities
  temperature: number;    // 0-2, kontrol randomness
  maxTokens: number;      // 100-4096, max response length
}
```

### Supported Models

- `qwen/qwen-2.5-7b-instruct` - Qwen 2.5 7B
- `qwen/qwen-2.5-72b-instruct` - Qwen 2.5 72B
- `meta-llama/llama-3.1-70b-instruct` - Llama 3.1 70B
- `deepseek-ai/DeepSeek-V3` - DeepSeek V3

---

## Testing

```bash
cd packages/0g-agent-inft
yarn hardhat test
```

---

## Troubleshooting

### "No intelligent data found"
- INFT di-mint tanpa proper config hash
- Re-mint dengan frontend yang auto-registers config

### "Not authorized"
- Kamu bukan owner dan belum di-authorize
- Minta owner untuk panggil `authorizeUsage(tokenId, yourAddress)`

### "Config hash mismatch"
- Stored config tidak match dengan on-chain hash
- Owner perlu re-register config via `/api/register`

### Executor service tidak respond
- Cek apakah service running di port 3001
- Verifikasi AGENT_NFT_ADDRESS benar di .env
- Cek RPC URL accessible

### "Insufficient funds"
- Claim test token dari [faucet](https://faucet.0g.ai)
- Cek balance di explorer

### Deploy gagal
- Check private key di `.env`
- Pastikan punya cukup OG token
- Coba increase gas limit

---

:::tip Next Step
Lanjut ke [Hands-on: Full Stack INFT](./04-hands-on-full-stack.md) untuk setup executor, frontend, dan tutorial mint/chat dengan INFT!
:::
