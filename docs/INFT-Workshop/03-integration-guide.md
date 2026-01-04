---
id: integration-guide
title: Integration Guide
sidebar_position: 3
---

# Integration Guide: Arsitektur AgentNFT

Panduan arsitektur dan referensi untuk memahami bagaimana komponen INFT bekerja bersama.

:::tip Hands-on Tutorial
Untuk tutorial langkah-demi-langkah, lihat [Hands-on: Full Stack INFT](./04-hands-on-full-stack.md).
:::

## Repository Workshop

```bash
git clone https://github.com/Ethereum-Jakarta/og-inft-monorepo.git
```

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

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Frontend** | UI untuk mint, authorize, chat |
| **Executor Service** | Off-chain config storage, auth verification, 0G Compute integration |
| **AgentNFT Contract** | On-chain ownership, authorization, config hash storage |
| **0G Compute** | AI inference via decentralized compute |
| **0G Storage** | Decentralized config storage (homework) |

:::info 0G Storage Integration
0G Storage integration belum sepenuhnya diimplementasi. Ini menjadi **homework** untuk peserta!
:::

## Project Structure

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

## Data Flow

### Mint Flow

```
1. User configures agent di frontend
2. Frontend generates config hash
3. Frontend calls AgentNFT.mint() with hash
4. Frontend registers full config ke executor service
5. Executor stores config (off-chain, hash-verified)
```

### Inference Flow

```
1. User sends prompt + signs message
2. Executor verifies signature
3. Executor checks on-chain authorization
4. Executor loads config (verifies hash match)
5. Executor calls 0G Compute API
6. Response returned to user
```

### Authorization Flow

```
1. Owner calls authorizeUsage(tokenId, user)
2. User address added to authorizedUsers[]
3. Executor checks authorizedUsersOf() for access control
```

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

| Function | Description |
|----------|-------------|
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

## Executor Service API

| Method | Endpoint | Description |
|--------|----------|-------------|
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

## Deploy Reference

### Using Hardhat Ignition

```bash
cd packages/0g-agent-inft

# Setup parameters
cp ignition/parameters.example.json ignition/parameters.json
# Edit parameters.json with your address

# Deploy & verify
yarn hardhat ignition deploy ignition/modules/AgentNFT.ts \
  --network zgTestnet \
  --parameters ignition/parameters.json \
  --verify
```

### Deployed Addresses

Use **proxy addresses** (without `Impl` or `Beacon` suffix):

| Contract | Use Address From |
|----------|------------------|
| TEEVerifier | `TEEVerifierModule#TEEVerifier` |
| Verifier | `VerifierModule#Verifier` |
| AgentNFT | `AgentNFTModule#AgentNFT` |

---

## Testing

```bash
cd packages/0g-agent-inft
yarn hardhat test
```

---

:::tip Ready to Build?
Lanjut ke [Hands-on: Full Stack INFT](./04-hands-on-full-stack.md) untuk tutorial lengkap dari deploy hingga chat!
:::
