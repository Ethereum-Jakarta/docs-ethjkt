---
sidebar_position: 5
title: 5. Deployment TugWar Game ke Monad Testnet
description: Deploy TugWar Game smart contract ke Monad Testnet dengan satu script sederhana untuk deployment dan verifikasi
keywords: [deployment, monad, testnet, hardhat, tugwar, game, verify, simple]
---

# 5. Deployment TugWar Game ke Monad Testnet

Setelah mengembangkan dan testing TugWar Game smart contract, sekarang saatnya untuk men-deploy ke **Monad Testnet**. Pada bagian ini, kita akan membuat satu script deployment yang sederhana namun lengkap untuk deploy dan verifikasi contract.

## Daftar Isi

1. [Script Deployment Sederhana](#1-script-deployment-sederhana)
2. [Menjalankan Deployment](#2-menjalankan-deployment)
3. [Interaksi dengan Contract](#3-interaksi-dengan-contract)
4. [Package.json Scripts](#4-packagejson-scripts)

## 1. Script Deployment Sederhana

### Membuat Script Deploy dan Verify

Buat file `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";
import { TugWarContract } from "../typechain-types";

async function main() {
    console.log("🎮 TugWar Game Deployment to Monad Testnet");
    console.log("=" .repeat(50));
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("\n📋 Deployment Info:");
    console.log("   Deployer:", deployer.address);
    console.log("   Network:", network.name);
    console.log("   Chain ID:", network.chainId.toString());
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("   Balance:", ethers.formatEther(balance), "MON");
    
    if (balance < ethers.parseEther("0.1")) {
        console.error("❌ Insufficient balance for deployment");
        console.error("   Required: 0.1 MON minimum");
        process.exit(1);
    }
    
    console.log("✅ Pre-deployment checks passed");
    
    // Deploy TugWar Contract
    console.log("\n🚀 Deploying TugWar Contract...");
    
    const TugWarFactory = await ethers.getContractFactory("TugWarContract");
    
    // Estimate gas
    const gasEstimate = await (await TugWarFactory.getDeployTransaction(deployer.address)).gasLimit;
    const gasPrice = await ethers.provider.getFeeData();
    
    console.log("⛽ Gas Info:");
    console.log("   Estimated gas:", gasEstimate?.toString());
    console.log("   Gas price:", ethers.formatUnits(gasPrice.gasPrice || 0, "gwei"), "gwei");
    
    const tugwar: TugWarContract = await TugWarFactory.deploy(deployer.address);
    
    console.log("⏳ Waiting for deployment...");
    await tugwar.waitForDeployment();
    
    const contractAddress = await tugwar.getAddress();
    const deploymentTx = tugwar.deploymentTransaction();
    
    console.log("✅ Contract deployed successfully!");
    console.log("   Address:", contractAddress);
    console.log("   Transaction:", deploymentTx?.hash);
    console.log("   Block:", deploymentTx?.blockNumber);
    
    // Verify initial state
    console.log("\n🔍 Verifying initial state...");
    try {
        const gameInfo = await tugwar.getGameInfo();
        console.log("   Rope position:", gameInfo.currentRopePos.toString());
        console.log("   Team 1 score:", gameInfo.score1.toString());
        console.log("   Team 2 score:", gameInfo.score2.toString());
        console.log("   Max score diff:", gameInfo.maxDiff.toString());
        console.log("   Owner:", await tugwar.owner());
        console.log("   Can start game:", await tugwar.canStartGame());
    } catch (error) {
        console.warn("⚠️  Could not verify initial state:", error);
    }
    
    // Contract verification
    console.log("\n📋 Contract Verification:");
    console.log("   To verify manually, run:");
    console.log(`   npx hardhat verify --network monadTestnet ${contractAddress} "${deployer.address}"`);
    
    // Save deployment info
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployerAddress: deployer.address,
        network: network.name,
        chainId: network.chainId.toString(),
        transactionHash: deploymentTx?.hash,
        blockNumber: deploymentTx?.blockNumber,
        timestamp: new Date().toISOString(),
        explorerUrl: `https://testnet.monadexplorer.com/address/${contractAddress}`
    };
    
    require('fs').writeFileSync(
        'deployment.json', 
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("📄 Deployment info saved to deployment.json");
    
    // Success summary
    console.log("\n" + "🎉".repeat(20));
    console.log("🎉 DEPLOYMENT SUCCESSFUL! 🎉");
    console.log("🎉".repeat(20));
    
    console.log("\n📝 Summary:");
    console.log("   Contract Address:", contractAddress);
    console.log("   Owner:", deployer.address);
    console.log("   Explorer:", deploymentInfo.explorerUrl);
    
    console.log("\n🎮 Next Steps:");
    console.log("   1. Verify contract (optional)");
    console.log("   2. Test the game:", `npm run play ${contractAddress}`);
    console.log("   3. Share with players!");
    
    console.log("\n🎯 Game Commands:");
    console.log("   • Pull for Team 1: tugwar.pull(true)");
    console.log("   • Pull for Team 2: tugwar.pull(false)");
    console.log("   • Check winner: tugwar.getWinStatus()");
    console.log("   • Reset game: tugwar.reSet(5) [owner only]");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
```

### Script untuk Manual Verification

Buat file `scripts/verify.ts`:

```typescript
import { run } from "hardhat";

async function main() {
    const deploymentInfo = require('../deployment.json');
    const contractAddress = deploymentInfo.contractAddress;
    const constructorArgs = [deploymentInfo.deployerAddress];
    
    console.log("🔍 Verifying TugWar contract...");
    console.log("   Address:", contractAddress);
    console.log("   Constructor args:", constructorArgs);
    
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArgs,
            contract: "contracts/TugWarContract.sol:TugWarContract"
        });
        
        console.log("✅ Contract verified successfully!");
        console.log("🌐 View verified contract:");
        console.log("   https://testnet.monadexplorer.com/address/" + contractAddress);
        
    } catch (error: any) {
        if (error.message.includes("Already Verified")) {
            console.log("ℹ️  Contract already verified");
            console.log("🌐 View contract:");
            console.log("   https://testnet.monadexplorer.com/address/" + contractAddress);
        } else {
            console.error("❌ Verification failed:", error.message);
            console.log("\n🔧 Manual verification command:");
            console.log(`npx hardhat verify --network monadTestnet ${contractAddress} "${constructorArgs[0]}"`);
        }
    }
}

main().catch(console.error);
```

## 2. Menjalankan Deployment

### Deploy ke Monad Testnet

```bash
npx hardhat run scripts/deploy.ts --network monadTestnet
```

### Output Deployment

```
🎮 TugWar Game Deployment to Monad Testnet
==================================================

📋 Deployment Info:
   Deployer: 0x742d35Cc6639C0532fBaBc3CABAa1C2db582aC10
   Network: monadTestnet
   Chain ID: 10143
   Balance: 1.234567 MON
✅ Pre-deployment checks passed

🚀 Deploying TugWar Contract...
⛽ Gas Info:
   Estimated gas: 1234567
   Gas price: 20.0 gwei
⏳ Waiting for deployment...
✅ Contract deployed successfully!
   Address: 0x123...ABC
   Transaction: 0x456...DEF
   Block: 12345

🔍 Verifying initial state...
   Rope position: 0
   Team 1 score: 0
   Team 2 score: 0
   Max score diff: 5
   Owner: 0x742d35Cc6639C0532fBaBc3CABAa1C2db582aC10
   Can start game: true

📋 Contract Verification:
   To verify manually, run:
   npx hardhat verify --network monadTestnet 0x123...ABC "0x742d35Cc6639C0532fBaBc3CABAa1C2db582aC10"

📄 Deployment info saved to deployment.json

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
🎉 DEPLOYMENT SUCCESSFUL! 🎉
🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉

📝 Summary:
   Contract Address: 0x123...ABC
   Owner: 0x742d35Cc6639C0532fBaBc3CABAa1C2db582aC10
   Explorer: https://testnet.monadexplorer.com/address/0x123...ABC

🎮 Next Steps:
   1. Verify contract (optional)
   2. Test the game: npm run play 0x123...ABC
   3. Share with players!

🎯 Game Commands:
   • Pull for Team 1: tugwar.pull(true)
   • Pull for Team 2: tugwar.pull(false)
   • Check winner: tugwar.getWinStatus()
   • Reset game: tugwar.reSet(5) [owner only]
```

### Verify Contract (Opsional)

```bash
npx hardhat run scripts/verify.ts --network monadTestnet
```

### Direct Interaction via Console

```bash
npx hardhat console --network monadTestnet
```

Di console:

```javascript
// Connect to deployed contract
const tugwar = await ethers.getContractAt("TugWarContract", "0x123...ABC");

// Check game info
const gameInfo = await tugwar.getGameInfo();
console.log("Game Info:", gameInfo);

// Pull for Team 1
const tx1 = await tugwar.pull(true);
await tx1.wait();
console.log("Team 1 pulled!");

// Pull for Team 2  
const tx2 = await tugwar.pull(false);
await tx2.wait();
console.log("Team 2 pulled!");

// Check winner
const winner = await tugwar.getWinStatus();
console.log("Winner:", winner); // 0 = ongoing, 1 = team1, 2 = team2

// Get prediction
const prediction = await tugwar.getPrediction();
console.log("Prediction:", prediction);
```

## 4. Package.json Scripts

### Update package.json

```json
{
  "scripts": {
    "deploy": "hardhat run scripts/deploy.ts --network monadTestnet",
    "verify": "hardhat run scripts/verify.ts --network monadTestnet",
    "play": "hardhat run scripts/interact.ts --network monadTestnet --",
    "console": "hardhat console --network monadTestnet",
    "clean": "hardhat clean && rm -f deployment.json"
  }
}
```

### Usage Commands

```bash
# Deploy contract
npm run deploy

# Verify contract  
npm run verify

# Check game status
npm run play 0x123...ABC

# Interactive console
npm run console

# Clean up
npm run clean
```

### File Structure Hasil

```
monad-tugwar-game/
├── scripts/
│   ├── deploy.ts          # Main deployment script
│   ├── verify.ts          # Contract verification
│   └── interact.ts        # Game interaction
├── deployment.json        # Deployment info
└── package.json          # NPM scripts
```

## Kesimpulan

Selamat! Anda telah membuat deployment system yang sederhana namun lengkap untuk TugWar Game dengan:

### ✅ Satu Script Deployment
1. **deploy.ts** - All-in-one deployment dengan validation, gas estimation, dan state verification
2. **Automatic Checks** - Balance validation dan pre-deployment verification
3. **State Verification** - Memastikan contract ter-deploy dengan benar
4. **Info Saving** - Menyimpan deployment info ke deployment.json

### ✅ Supporting Scripts
1. **verify.ts** - Contract verification script
2. **interact.ts** - Game interaction dan status checking
3. **Console access** - Direct contract interaction

### ✅ Simple Commands
```bash
npm run deploy    # Deploy contract
npm run verify    # Verify contract  
npm run play      # Check game status
npm run console   # Interactive mode
```

### ✅ Production Ready
1. **Error Handling** - Comprehensive error checking
2. **Gas Optimization** - Gas estimation dan monitoring
3. **Explorer Integration** - Direct links ke Monad Explorer
4. **User Friendly** - Clear instructions dan game commands

Deployment system ini memberikan workflow yang sederhana namun professional untuk deploy TugWar Game ke Monad Testnet dengan semua tools yang diperlukan untuk testing dan interaction! 🎮🚀