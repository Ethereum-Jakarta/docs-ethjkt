---
id: integration-guide
title: Integration Guide
sidebar_position: 3
---

# Integration Guide: Membangun dengan AgentNFT

Panduan lengkap untuk mengintegrasikan AgentNFT (INFT) menggunakan contract resmi dari 0G.

## Repository Resmi

```bash
git clone https://github.com/0gfoundation/0g-agent-nft.git
cd 0g-agent-nft
```

## Arsitektur Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │───►│   Executor   │───►│  0G Compute  │  │
│  │  (React/Vue) │    │   Service    │    │  (Inference) │  │
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
│                     └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure (Official Repo)

```
0g-agent-nft/
├── contracts/
│   ├── AgentNFT.sol              # Main INFT contract
│   ├── AgentMarket.sol           # Marketplace
│   ├── TeeVerifier.sol           # TEE oracle verifier
│   ├── Utils.sol                 # Utilities
│   ├── interfaces/
│   │   ├── IERC7857.sol          # Main interface
│   │   ├── IERC7857Metadata.sol  # Metadata interface
│   │   └── IERC7857DataVerifier.sol
│   └── verifiers/
│       └── Verifier.sol
├── scripts/deploy/
│   ├── deploy_agent_nft.ts
│   └── deploy_verifier.ts
├── hardhat.config.ts
└── package.json
```

## Setup Project

### Step 1: Clone & Install

```bash
git clone https://github.com/0gfoundation/0g-agent-nft.git
cd 0g-agent-nft
pnpm install
```

### Step 2: Environment Setup

Buat file `.env`:

```env
# Wallet
PRIVATE_KEY=your_private_key_here

# 0G Network
ZG_RPC_URL=https://evmrpc-testnet.0g.ai
ZG_CHAIN_ID=16601

# NFT Config
ZG_iNFT_NAME=My Agent NFT
ZG_iNFT_SYMBOL=MAGT

# Storage
ZG_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
```

### Step 3: Compile

```bash
pnpm compile
```

## AgentNFT Contract Overview

Contract utama yang mengimplementasikan ERC-7857:

```solidity
// contracts/AgentNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentNFT is
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    IERC7857,
    IERC7857Metadata
{
    struct TokenData {
        address owner;
        address[] authorizedUsers;
        address approvedUser;
        IntelligentData[] iDatas;
    }

    uint256 public constant MAX_AUTHORIZED_USERS = 100;

    /// @notice Mint INFT baru
    function mint(
        IntelligentData[] calldata iDatas,
        address to
    ) public payable returns (uint256 tokenId);

    /// @notice Authorize user untuk menggunakan token
    function authorizeUsage(uint256 tokenId, address to) public;

    /// @notice Batch authorize multiple users
    function batchAuthorizeUsage(
        uint256 tokenId,
        address[] calldata users
    ) public;

    /// @notice Revoke authorization
    function revokeAuthorization(uint256 tokenId, address user) public;

    /// @notice Clear semua authorized users
    function clearAuthorizedUsers(uint256 tokenId) public;

    /// @notice Get authorized users
    function authorizedUsersOf(uint256 tokenId)
        public view returns (address[] memory);

    /// @notice Get intelligent data
    function intelligentDatasOf(uint256 tokenId)
        public view returns (IntelligentData[] memory);
}
```

### IntelligentData Structure

```solidity
struct IntelligentData {
    string dataDescription;  // Deskripsi data (e.g., "AI Agent Config")
    bytes32 dataHash;        // Hash dari encrypted data
}
```

## Deploy ke 0G Testnet

### Deploy Verifier

```bash
pnpm hardhat deploy --tags verifier --network 0g-testnet
```

### Deploy AgentNFT

```bash
pnpm hardhat deploy --tags agentNFT --network 0g-testnet
```

### Atau Deploy Manual

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    // Deploy Verifier first
    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
    console.log("Verifier:", await verifier.getAddress());

    // Deploy AgentNFT
    const AgentNFT = await ethers.getContractFactory("AgentNFT");
    const agentNFT = await AgentNFT.deploy();
    await agentNFT.waitForDeployment();

    // Initialize
    const storageInfo = JSON.stringify({
        chainURL: "https://evmrpc-testnet.0g.ai",
        indexerURL: "https://indexer-storage-testnet-turbo.0g.ai"
    });

    await agentNFT.initialize(
        "My Agent NFT",
        "MAGT",
        storageInfo,
        await verifier.getAddress(),
        deployer.address
    );

    console.log("AgentNFT:", await agentNFT.getAddress());
}

main().catch(console.error);
```

## Interacting with Contract

### Menggunakan ethers.js

```typescript
import { ethers } from "ethers";

// Setup
const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract ABI (key functions)
const ABI = [
    "function mint(tuple(string dataDescription, bytes32 dataHash)[] iDatas, address to) returns (uint256)",
    "function authorizeUsage(uint256 tokenId, address to)",
    "function revokeAuthorization(uint256 tokenId, address user)",
    "function batchAuthorizeUsage(uint256 tokenId, address[] users)",
    "function clearAuthorizedUsers(uint256 tokenId)",
    "function authorizedUsersOf(uint256 tokenId) view returns (address[])",
    "function intelligentDatasOf(uint256 tokenId) view returns (tuple(string, bytes32)[])",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "event Minted(uint256 indexed tokenId, address indexed creator, address indexed owner)",
    "event Authorization(address indexed from, address indexed to, uint256 indexed tokenId)",
    "event AuthorizationRevoked(address indexed from, address indexed to, uint256 indexed tokenId)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
```

### Mint INFT

```typescript
async function mintINFT() {
    // Prepare agent config
    const agentConfig = {
        model: "gpt-4",
        systemPrompt: "You are a helpful Web3 assistant",
        temperature: 0.7
    };

    // Create data hash
    const dataHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(agentConfig))
    );

    // Prepare IntelligentData array
    const iDatas = [{
        dataDescription: "AI Agent Config v1",
        dataHash: dataHash
    }];

    console.log("Minting INFT...");
    const tx = await contract.mint(iDatas, wallet.address);
    const receipt = await tx.wait();

    // Parse Minted event
    const event = receipt.logs.find(log => {
        try {
            return contract.interface.parseLog(log)?.name === "Minted";
        } catch { return false; }
    });

    if (event) {
        const parsed = contract.interface.parseLog(event);
        console.log("Token ID:", parsed.args.tokenId.toString());
    }
}
```

### Authorize User

```typescript
async function authorizeUser(tokenId: number, userAddress: string) {
    console.log(`Authorizing ${userAddress} for token ${tokenId}...`);

    const tx = await contract.authorizeUsage(tokenId, userAddress);
    await tx.wait();

    console.log("User authorized!");

    // Verify
    const users = await contract.authorizedUsersOf(tokenId);
    console.log("Authorized users:", users);
}
```

### Batch Authorize

```typescript
async function batchAuthorize(tokenId: number, users: string[]) {
    console.log(`Batch authorizing ${users.length} users...`);

    const tx = await contract.batchAuthorizeUsage(tokenId, users);
    await tx.wait();

    console.log("All users authorized!");
}
```

### Revoke Authorization

```typescript
async function revokeUser(tokenId: number, userAddress: string) {
    const tx = await contract.revokeAuthorization(tokenId, userAddress);
    await tx.wait();
    console.log("Authorization revoked!");
}
```

### Check Authorization

```typescript
async function isUserAuthorized(tokenId: number, user: string): Promise<boolean> {
    // Check if owner
    const owner = await contract.ownerOf(tokenId);
    if (owner.toLowerCase() === user.toLowerCase()) {
        return true;
    }

    // Check authorized users
    const authorizedUsers = await contract.authorizedUsersOf(tokenId);
    return authorizedUsers.some(
        (u: string) => u.toLowerCase() === user.toLowerCase()
    );
}
```

## Executor Service

### Setup Express Server

```typescript
// executor/index.ts
import express from "express";
import { ethers } from "ethers";

const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.ZG_RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Check authorization endpoint
app.get("/api/auth/:tokenId/:address", async (req, res) => {
    const { tokenId, address } = req.params;

    const owner = await contract.ownerOf(tokenId);
    const isOwner = owner.toLowerCase() === address.toLowerCase();

    if (isOwner) {
        return res.json({ authorized: true, role: "owner" });
    }

    const users = await contract.authorizedUsersOf(tokenId);
    const isAuthorized = users.some(
        (u: string) => u.toLowerCase() === address.toLowerCase()
    );

    res.json({ authorized: isAuthorized, role: isAuthorized ? "user" : "none" });
});

// Inference endpoint
app.post("/api/inference", async (req, res) => {
    const { tokenId, userAddress, signature, message, prompt } = req.body;

    // 1. Verify signature
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== userAddress.toLowerCase()) {
        return res.status(401).json({ error: "Invalid signature" });
    }

    // 2. Check authorization
    const owner = await contract.ownerOf(tokenId);
    let authorized = owner.toLowerCase() === userAddress.toLowerCase();

    if (!authorized) {
        const users = await contract.authorizedUsersOf(tokenId);
        authorized = users.some(
            (u: string) => u.toLowerCase() === userAddress.toLowerCase()
        );
    }

    if (!authorized) {
        return res.status(403).json({ error: "Not authorized" });
    }

    // 3. Get agent data
    const iDatas = await contract.intelligentDatasOf(tokenId);

    // 4. Run inference (connect to 0G Compute)
    const response = await runInference(iDatas, prompt);

    res.json({ response });
});

app.listen(3001, () => console.log("Executor running on :3001"));
```

## Testing

```typescript
// test/AgentNFT.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgentNFT", function () {
    let agentNFT: any;
    let owner: any, user1: any, user2: any;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();
        // Deploy and initialize...
    });

    it("Should mint INFT", async () => {
        const iDatas = [{
            dataDescription: "Test Agent",
            dataHash: ethers.keccak256(ethers.toUtf8Bytes("test"))
        }];

        await agentNFT.mint(iDatas, owner.address);
        expect(await agentNFT.ownerOf(0)).to.equal(owner.address);
    });

    it("Should authorize user", async () => {
        // Mint first
        await agentNFT.mint([{
            dataDescription: "Test",
            dataHash: ethers.ZeroHash
        }], owner.address);

        // Authorize
        await agentNFT.authorizeUsage(0, user1.address);

        const users = await agentNFT.authorizedUsersOf(0);
        expect(users).to.include(user1.address);
    });

    it("Should batch authorize", async () => {
        await agentNFT.mint([{
            dataDescription: "Test",
            dataHash: ethers.ZeroHash
        }], owner.address);

        await agentNFT.batchAuthorizeUsage(0, [user1.address, user2.address]);

        const users = await agentNFT.authorizedUsersOf(0);
        expect(users).to.include(user1.address);
        expect(users).to.include(user2.address);
    });

    it("Should revoke authorization", async () => {
        await agentNFT.mint([{
            dataDescription: "Test",
            dataHash: ethers.ZeroHash
        }], owner.address);

        await agentNFT.authorizeUsage(0, user1.address);
        await agentNFT.revokeAuthorization(0, user1.address);

        const users = await agentNFT.authorizedUsersOf(0);
        expect(users).to.not.include(user1.address);
    });

    it("Should clear all authorized users", async () => {
        await agentNFT.mint([{
            dataDescription: "Test",
            dataHash: ethers.ZeroHash
        }], owner.address);

        await agentNFT.batchAuthorizeUsage(0, [user1.address, user2.address]);
        await agentNFT.clearAuthorizedUsers(0);

        const users = await agentNFT.authorizedUsersOf(0);
        expect(users.length).to.equal(0);
    });
});
```

Run tests:
```bash
pnpm test
```

---

## Summary: Key Functions

| Function | Description |
|----------|-------------|
| `mint(iDatas, to)` | Mint INFT dengan intelligent data |
| `authorizeUsage(tokenId, user)` | Grant usage ke satu user |
| `batchAuthorizeUsage(tokenId, users)` | Grant usage ke banyak user |
| `revokeAuthorization(tokenId, user)` | Revoke usage dari user |
| `clearAuthorizedUsers(tokenId)` | Clear semua authorized users |
| `authorizedUsersOf(tokenId)` | Get list authorized users |
| `intelligentDatasOf(tokenId)` | Get intelligent data |
| `ownerOf(tokenId)` | Get token owner |

---

:::tip Next Step
Lanjut ke [Hands-on: Mint & Authorize](./04-hands-on-mint-authorize.md) untuk praktek langsung dengan contract resmi!
:::
