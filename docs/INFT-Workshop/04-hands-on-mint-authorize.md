---
id: hands-on-mint-authorize
title: "Hands-on: Mint & Authorize"
sidebar_position: 4
---

# Hands-on: Mint INFT & Grant Authorization

Tutorial step-by-step menggunakan contract resmi `AgentNFT` dari 0G.

## Prerequisites Checklist

Sebelum mulai, pastikan:

- [ ] Node.js v18+ terinstall
- [ ] MetaMask terinstall dan setup
- [ ] 0G Testnet sudah ditambahkan ke wallet
- [ ] Test OG token sudah di-claim dari [faucet](https://faucet.0g.ai)
- [ ] Code editor siap (VS Code recommended)

## Part 1: Setup Project

### Step 1.1: Clone Repository Resmi

```bash
# Clone repository resmi
git clone https://github.com/0gfoundation/0g-agent-nft.git
cd 0g-agent-nft

# Install dependencies
npm install
```

### Step 1.2: Setup Environment

Buat file `.env`:

```env
# Private Key (dari wallet testing)
PRIVATE_KEY=your_private_key_here

# 0G Network
ZG_RPC_URL=https://evmrpc-testnet.0g.ai
ZG_CHAIN_ID=16601

# NFT Config
ZG_iNFT_NAME=Workshop INFT
ZG_iNFT_SYMBOL=WINFT

# Storage
ZG_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
```

:::warning Keamanan
- JANGAN commit `.env` ke git
- Gunakan private key dari wallet testing
- Pastikan `.env` ada di `.gitignore`
:::

### Step 1.3: Compile Contracts

```bash
npm run compile
```

Output yang diharapkan:
```
Compiled X Solidity files successfully
```

## Part 2: Deploy AgentNFT

### Step 2.1: Deploy Verifier

AgentNFT membutuhkan Verifier contract untuk validasi proof:

```bash
npx hardhat deploy --tags verifier --network 0g-testnet
```

Simpan address Verifier yang muncul di output.

### Step 2.2: Deploy AgentNFT

```bash
npx hardhat deploy --tags agentNFT --network 0g-testnet
```

Output:
```
🚀 Deploying AgentNFT with account: 0x...
📋 Using Verifier at: 0x...
📝 Deploying AgentNFT with Beacon Proxy...
✅ AgentNFT deployed at: 0x1234...5678
```

:::tip Simpan Address
Copy AgentNFT address untuk digunakan nanti:
```
AGENT_NFT_ADDRESS=0x1234...5678
```
:::

## Part 3: Mint INFT

### Step 3.1: Buat Mint Script

Buat file `scripts/workshop-mint.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
    // Config
    const AGENT_NFT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";

    console.log("=".repeat(50));
    console.log("Minting INFT on AgentNFT Contract");
    console.log("=".repeat(50));

    // Get signer
    const [owner] = await ethers.getSigners();
    console.log("\nMinter:", owner.address);

    // Connect to contract
    const agentNFT = await ethers.getContractAt("AgentNFT", AGENT_NFT_ADDRESS);

    // Prepare AI agent config
    const agentConfig = {
        name: "My Web3 Assistant",
        model: "gpt-4",
        systemPrompt: "You are a helpful Web3 assistant that explains blockchain concepts.",
        personality: "friendly and educational",
        capabilities: ["explain", "code", "analyze"]
    };

    console.log("\nAgent Config:");
    console.log(JSON.stringify(agentConfig, null, 2));

    // Create data hash
    const configJson = JSON.stringify(agentConfig);
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(configJson));
    console.log("\nData Hash:", dataHash);

    // Prepare IntelligentData array
    const iDatas = [{
        dataDescription: "AI Agent Config v1.0",
        dataHash: dataHash
    }];

    // Mint
    console.log("\nMinting INFT...");
    const tx = await agentNFT.mint(iDatas, owner.address);
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed!");

    // Parse Minted event untuk dapat token ID
    for (const log of receipt.logs) {
        try {
            const parsed = agentNFT.interface.parseLog(log);
            if (parsed?.name === "Minted") {
                console.log("\n✅ INFT Minted Successfully!");
                console.log("   Token ID:", parsed.args.tokenId.toString());
                console.log("   Creator:", parsed.args._creator);
                console.log("   Owner:", parsed.args._owner);
            }
        } catch {}
    }

    // Verify on-chain
    const tokenOwner = await agentNFT.ownerOf(0);
    console.log("\n📋 On-chain Verification:");
    console.log("   Owner:", tokenOwner);

    const intelligentData = await agentNFT.intelligentDatasOf(0);
    console.log("   Data Description:", intelligentData[0].dataDescription);
    console.log("   Data Hash:", intelligentData[0].dataHash);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
```

### Step 3.2: Run Mint Script

```bash
npx hardhat run scripts/workshop-mint.ts --network 0g-testnet
```

Output:
```
==================================================
Minting INFT on AgentNFT Contract
==================================================

Minter: 0x...

Agent Config:
{
  "name": "My Web3 Assistant",
  "model": "gpt-4",
  ...
}

Data Hash: 0x...

Minting INFT...
Transaction sent: 0x...
Transaction confirmed!

✅ INFT Minted Successfully!
   Token ID: 0
   Creator: 0x...
   Owner: 0x...
```

## Part 4: Authorize User

### Step 4.1: Buat Authorize Script

Buat file `scripts/workshop-authorize.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
    const AGENT_NFT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
    const TOKEN_ID = 0;
    const USER_TO_AUTHORIZE = "0x..."; // Ganti dengan address user

    console.log("=".repeat(50));
    console.log("Authorizing User for INFT");
    console.log("=".repeat(50));

    const [owner] = await ethers.getSigners();
    console.log("\nOwner:", owner.address);
    console.log("User to authorize:", USER_TO_AUTHORIZE);

    // Connect to contract
    const agentNFT = await ethers.getContractAt("AgentNFT", AGENT_NFT_ADDRESS);

    // Check ownership
    const tokenOwner = await agentNFT.ownerOf(TOKEN_ID);
    console.log("\nToken Owner:", tokenOwner);

    if (tokenOwner.toLowerCase() !== owner.address.toLowerCase()) {
        console.log("❌ You are not the owner of this token!");
        return;
    }

    // Authorize
    console.log("\nAuthorizing user...");
    const tx = await agentNFT.authorizeUsage(TOKEN_ID, USER_TO_AUTHORIZE);
    console.log("Transaction sent:", tx.hash);

    await tx.wait();
    console.log("Transaction confirmed!");

    // Verify authorization
    const authorizedUsers = await agentNFT.authorizedUsersOf(TOKEN_ID);
    console.log("\n✅ User Authorized!");
    console.log("   Authorized Users:", authorizedUsers);
}

main().catch(console.error);
```

### Step 4.2: Run Authorize

Ganti `USER_TO_AUTHORIZE` dengan address yang ingin di-authorize, lalu:

```bash
npx hardhat run scripts/workshop-authorize.ts --network 0g-testnet
```

## Part 5: Batch Authorize

Untuk authorize banyak user sekaligus:

```typescript
import { ethers } from "hardhat";

async function main() {
    const AGENT_NFT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
    const TOKEN_ID = 0;
    const USERS = [
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222",
        "0x3333333333333333333333333333333333333333"
    ];

    const agentNFT = await ethers.getContractAt("AgentNFT", AGENT_NFT_ADDRESS);

    console.log("Batch authorizing", USERS.length, "users...");
    const tx = await agentNFT.batchAuthorizeUsage(TOKEN_ID, USERS);
    await tx.wait();

    const authorizedUsers = await agentNFT.authorizedUsersOf(TOKEN_ID);
    console.log("All authorized users:", authorizedUsers);
}

main().catch(console.error);
```

## Part 6: Revoke Authorization

### Step 6.1: Buat Revoke Script

```typescript
import { ethers } from "hardhat";

async function main() {
    const AGENT_NFT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
    const TOKEN_ID = 0;
    const USER_TO_REVOKE = "0x...";

    const agentNFT = await ethers.getContractAt("AgentNFT", AGENT_NFT_ADDRESS);

    // Check current status
    const usersBefore = await agentNFT.authorizedUsersOf(TOKEN_ID);
    console.log("Users before:", usersBefore);

    // Revoke
    console.log("\nRevoking authorization...");
    const tx = await agentNFT.revokeAuthorization(TOKEN_ID, USER_TO_REVOKE);
    await tx.wait();

    // Verify
    const usersAfter = await agentNFT.authorizedUsersOf(TOKEN_ID);
    console.log("Users after:", usersAfter);
    console.log("\n✅ Authorization revoked!");
}

main().catch(console.error);
```

## Part 7: Clear All Authorizations

```typescript
import { ethers } from "hardhat";

async function main() {
    const AGENT_NFT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
    const TOKEN_ID = 0;

    const agentNFT = await ethers.getContractAt("AgentNFT", AGENT_NFT_ADDRESS);

    console.log("Clearing all authorized users...");
    const tx = await agentNFT.clearAuthorizedUsers(TOKEN_ID);
    await tx.wait();

    const users = await agentNFT.authorizedUsersOf(TOKEN_ID);
    console.log("Authorized users:", users); // Should be empty
    console.log("\n✅ All authorizations cleared!");
}

main().catch(console.error);
```

## Checkpoint Summary

Setelah menyelesaikan part ini, kamu seharusnya sudah:

- [x] Clone repository 0g-agent-nft
- [x] Setup environment variables
- [x] Compile contracts
- [x] Deploy Verifier
- [x] Deploy AgentNFT
- [x] Mint INFT dengan IntelligentData
- [x] Authorize user
- [x] Batch authorize multiple users
- [x] Revoke authorization
- [x] Clear all authorizations

## Key Functions Summary

| Function | Description |
|----------|-------------|
| `mint(iDatas, to)` | Mint INFT dengan intelligent data |
| `authorizeUsage(tokenId, user)` | Grant usage ke satu user |
| `batchAuthorizeUsage(tokenId, users)` | Grant usage ke banyak user |
| `revokeAuthorization(tokenId, user)` | Revoke usage dari user |
| `clearAuthorizedUsers(tokenId)` | Clear semua authorized users |
| `authorizedUsersOf(tokenId)` | Get list authorized users |
| `ownerOf(tokenId)` | Get token owner |

## Troubleshooting

### "Insufficient funds"
```bash
# Claim test token dari faucet
# https://faucet.0g.ai
```

### "Not owner"
- Pastikan wallet yang dipakai adalah owner token

### "Too many authorized users"
- Max 100 authorized users per token
- Gunakan `clearAuthorizedUsers()` untuk reset

### Transaction pending lama
- Check network congestion di explorer
- Coba increase gas price

---

:::tip Lanjut ke Inference
INFT sudah siap! Lanjut ke [0G Inference Integration](./05-hands-on-0g-inference.md) untuk connect dengan AI!
:::
