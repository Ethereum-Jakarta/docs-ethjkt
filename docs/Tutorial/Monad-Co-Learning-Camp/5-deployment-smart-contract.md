---
sidebar_position: 5
title: 5. Deployment ke Monad Testnet
description: Deploy TaskManager smart contract ke Monad Testnet dan verifikasi contract di block explorer
keywords: [deployment, monad, testnet, hardhat, smart contract, verify, block explorer]
---

# 5. Deployment ke Monad Testnet

Setelah berhasil membuat dan menguji TaskManager smart contract, langkah selanjutnya adalah men-deploy contract ke Monad Testnet. Deployment adalah proses mengirimkan bytecode contract ke blockchain sehingga dapat digunakan oleh pengguna lain.

## 1. Persiapan Sebelum Deployment

### 1.1 Memastikan Saldo MON di Wallet

Sebelum deployment, pastikan wallet Anda memiliki cukup MON untuk membayar gas fees:

1. Buka MetaMask dan pastikan terhubung ke Monad Testnet
2. Salin alamat wallet Anda
3. Kunjungi [Monad Testnet Faucet](https://faucet.testnet.monad.xyz/)
4. Paste alamat wallet dan request MON testnet

Anda memerlukan sekitar **0.01-0.05 MON** untuk deployment TaskManager contract.

### 1.2 Verifikasi Konfigurasi

Pastikan konfigurasi Hardhat sudah benar:

```bash
# Cek jaringan yang tersedia
npx hardhat --help

# Cek apakah private key sudah diset
npx hardhat vars get PRIVATE_KEY
```

## 2. Membuat Script Deployment

Pertama, kita perlu membuat script deployment yang menggantikan script bawaan Hardhat.

### 2.1 Hapus Script Lama dan Buat Script Baru

1. Hapus file `scripts/deploy.ts`
2. Buat file baru `scripts/deploy-taskmanager.ts`
3. Salin kode berikut:

```typescript
import { ethers } from "hardhat";
import { TaskManager } from "../typechain-types";

async function main() {
  console.log("🚀 Starting TaskManager deployment to Monad Testnet...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployment Details:");
  console.log("├── Deployer address:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("├── Deployer balance:", ethers.formatEther(balance), "MON");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance. Make sure you have enough MON for deployment.");
  }

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("├── Network:", network.name);
  console.log("├── Chain ID:", network.chainId.toString());
  console.log("└── RPC URL:", "https://testnet-rpc.monad.xyz/\n");

  // Deploy TaskManager
  console.log("📦 Deploying TaskManager contract...");
  const TaskManagerFactory = await ethers.getContractFactory("TaskManager");
  
  // Estimate gas
  const deployTx = await TaskManagerFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  console.log("├── Estimated gas:", estimatedGas.toString());

  // Deploy with manual gas limit (adding 20% buffer)
  const gasLimit = (estimatedGas * BigInt(120)) / BigInt(100);
  const taskManager: TaskManager = await TaskManagerFactory.deploy({
    gasLimit: gasLimit
  });

  console.log("├── Transaction hash:", taskManager.deploymentTransaction()?.hash);
  console.log("├── Waiting for deployment confirmation...");

  // Wait for deployment
  await taskManager.waitForDeployment();
  const contractAddress = await taskManager.getAddress();

  console.log("✅ TaskManager deployed successfully!");
  console.log("├── Contract address:", contractAddress);
  console.log("├── Block explorer:", `https://testnet.monadexplorer.com/address/${contractAddress}`);

  // Verify initial state
  console.log("\n🔍 Verifying initial contract state...");
  try {
    const owner = await taskManager.owner();
    const taskCount = await taskManager.taskCount();
    const userTaskCount = await taskManager.userTaskCount(deployer.address);

    console.log("├── Owner:", owner);
    console.log("├── Task count:", taskCount.toString());
    console.log("├── Deployer task count:", userTaskCount.toString());
    
    // Test calculateFee function
    const fee = await taskManager.calculateFee(100);
    console.log("└── Fee calculation (100 -> 2%):", fee.toString());

  } catch (error) {
    console.log("❌ Error verifying contract state:", error);
  }

  // Get deployment cost
  const deploymentTx = taskManager.deploymentTransaction();
  if (deploymentTx) {
    const receipt = await deploymentTx.wait();
    if (receipt) {
      const cost = receipt.gasUsed * receipt.gasPrice;
      console.log("\n💰 Deployment Cost:");
      console.log("├── Gas used:", receipt.gasUsed.toString());
      console.log("├── Gas price:", ethers.formatUnits(receipt.gasPrice, "gwei"), "gwei");
      console.log("└── Total cost:", ethers.formatEther(cost), "MON");
    }
  }

  // Provide next steps
  console.log("\n📋 Next Steps:");
  console.log("1. Save the contract address for future interactions");
  console.log("2. Verify the contract on block explorer (optional)");
  console.log("3. Test contract functions using Hardhat console or frontend");
  console.log("4. Add the contract to your MetaMask for easy interaction");

  // Save deployment info to file
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    network: network.name,
    chainId: network.chainId.toString(),
    blockExplorer: `https://testnet.monadexplorer.com/address/${contractAddress}`,
    timestamp: new Date().toISOString(),
    txHash: deploymentTx?.hash
  };

  // Write to file (optional)
  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, 'taskmanager-monad-testnet.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info saved to: deployments/taskmanager-monad-testnet.json");
  
  return {
    taskManager,
    contractAddress,
    deploymentInfo
  };
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
```

## 3. Menjalankan Deployment

### 3.1 Deploy ke Monad Testnet

Jalankan script deployment dengan perintah:

```bash
npx hardhat run scripts/deploy-taskmanager.ts --network monadTestnet
```

Output yang diharapkan:

```
🚀 Starting TaskManager deployment to Monad Testnet...

📋 Deployment Details:
├── Deployer address: 0x1234567890123456789012345678901234567890
├── Deployer balance: 0.5 MON
├── Network: unknown
├── Chain ID: 10143
└── RPC URL: https://testnet-rpc.monad.xyz/

📦 Deploying TaskManager contract...
├── Estimated gas: 420000
├── Transaction hash: 0xabcdef1234567890...
├── Waiting for deployment confirmation...
✅ TaskManager deployed successfully!
├── Contract address: 0x9876543210987654321098765432109876543210
├── Block explorer: https://testnet.monadexplorer.com/address/0x9876543210987654321098765432109876543210

🔍 Verifying initial contract state...
├── Owner: 0x1234567890123456789012345678901234567890
├── Task count: 0
├── Deployer task count: 0
└── Fee calculation (100 -> 2%): 2

💰 Deployment Cost:
├── Gas used: 408567
├── Gas price: 1.0 gwei
└── Total cost: 0.000408567 MON

📋 Next Steps:
1. Save the contract address for future interactions
2. Verify the contract on block explorer (optional)
3. Test contract functions using Hardhat console or frontend
4. Add the contract to your MetaMask for easy interaction

💾 Deployment info saved to: deployments/taskmanager-monad-testnet.json
```

### 3.2 Troubleshooting Deployment Issues

#### Gas Issues

Jika mengalami error gas:

```bash
# Error: Transaction ran out of gas
```

**Solusi**: Increase gas limit di script deployment:
```typescript
const gasLimit = (estimatedGas * BigInt(150)) / BigInt(100); // 50% buffer
```

#### Network Issues

Jika mengalami error koneksi:

```bash
# Error: could not detect network
```

**Solusi**: 
1. Periksa koneksi internet
2. Coba RPC URL alternatif
3. Periksa status Monad Testnet

#### Insufficient Funds

```bash
# Error: insufficient funds for gas * price + value
```

**Solusi**: 
1. Tambah MON dari faucet
2. Periksa saldo dengan: `npx hardhat run scripts/check-balance.ts --network monadTestnet`

## 4. Verifikasi Deployment

### 4.1 Verifikasi di Block Explorer

1. Buka [Monad Testnet Explorer](https://testnet.monadexplorer.com/)
2. Paste contract address di search bar
3. Periksa:
   - Contract creation transaction
   - Contract bytecode
   - Contract balance
   - Transaction history

### 4.2 Verifikasi via Hardhat Console

Buka Hardhat console untuk berinteraksi dengan deployed contract:

```bash
npx hardhat console --network monadTestnet
```

Di console, jalankan:

```javascript
// Get contract instance
const TaskManager = await ethers.getContractFactory("TaskManager");
const taskManager = TaskManager.attach("YOUR_CONTRACT_ADDRESS");

// Test contract functions
const owner = await taskManager.owner();
console.log("Owner:", owner);

const taskCount = await taskManager.taskCount();
console.log("Task count:", taskCount.toString());

// Add a task
const tx = await taskManager.addTask();
await tx.wait();
console.log("Task added!");

// Check updated count
const newCount = await taskManager.taskCount();
console.log("New task count:", newCount.toString());
```

### 4.3 Membuat Script Interaksi

Buat file `scripts/interact-taskmanager.ts` untuk interaksi mudah:

```typescript
import { ethers } from "hardhat";

async function main() {
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x9876543210987654321098765432109876543210";
  
  const [signer] = await ethers.getSigners();
  console.log("Interacting with contract as:", signer.address);
  
  // Get contract instance
  const TaskManager = await ethers.getContractFactory("TaskManager");
  const taskManager = TaskManager.attach(CONTRACT_ADDRESS);
  
  // Read current state
  console.log("\n📊 Current State:");
  console.log("Owner:", await taskManager.owner());
  console.log("Total tasks:", (await taskManager.taskCount()).toString());
  console.log("Your tasks:", (await taskManager.userTaskCount(signer.address)).toString());
  
  // Add a task
  console.log("\n➕ Adding a task...");
  const tx = await taskManager.addTask();
  await tx.wait();
  console.log("Task added! Transaction:", tx.hash);
  
  // Read updated state
  console.log("\n📊 Updated State:");
  console.log("Total tasks:", (await taskManager.taskCount()).toString());
  console.log("Your tasks:", (await taskManager.userTaskCount(signer.address)).toString());
  
  // Test fee calculation
  console.log("\n🧮 Fee Calculations:");
  console.log("Fee for 100:", (await taskManager.calculateFee(100)).toString());
  console.log("Fee for 1000:", (await taskManager.calculateFee(1000)).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Jalankan dengan:

```bash
npx hardhat run scripts/interact-taskmanager.ts --network monadTestnet
```

## 5. Contract Verification (Opsional)

Verifikasi source code di block explorer memungkinkan pengguna lain untuk melihat dan memahami contract Anda.

### 5.1 Menggunakan Hardhat Verify

**Catatan**: Fitur ini masih dalam pengembangan untuk Monad Testnet. Jika tersedia, gunakan:

```bash
npx hardhat verify --network monadTestnet DEPLOYED_CONTRACT_ADDRESS
```

### 5.2 Manual Verification

Jika automatic verification tidak tersedia:

1. Buka Monad Block Explorer
2. Navigate ke contract address
3. Klik "Verify Contract" (jika tersedia)
4. Upload source code dan metadata

## 6. Best Practices untuk Production

### 6.1 Security Checklist

- [ ] Contract telah diuji secara menyeluruh
- [ ] Private key disimpan dengan aman
- [ ] Gas limits telah dioptimasi
- [ ] Error handling telah diimplementasikan
- [ ] Contract address telah disimpan dengan aman

### 6.2 Documentation

Dokumentasikan deployment Anda:

```json
{
  "contractName": "TaskManager",
  "network": "Monad Testnet", 
  "address": "0x...",
  "deployer": "0x...",
  "deploymentDate": "2025-05-27",
  "gasUsed": 408567,
  "verified": false,
  "notes": "Initial deployment for testing"
}
```

## Kesimpulan

Selamat! Anda telah berhasil:

1. **Mempersiapkan deployment** dengan memeriksa saldo dan konfigurasi
2. **Membuat script deployment** yang comprehensive dengan error handling
3. **Men-deploy TaskManager** ke Monad Testnet dengan sukses
4. **Memverifikasi deployment** melalui block explorer dan interaksi
5. **Membuat script interaksi** untuk testing post-deployment
6. **Memahami troubleshooting** untuk masalah umum deployment

TaskManager contract Anda sekarang live di Monad Testnet dan siap digunakan! Contract address dapat dibagikan dengan pengguna lain, dan mereka dapat berinteraksi dengan contract melalui MetaMask atau aplikasi Web3 lainnya.

Pada bagian selanjutnya, kita akan membuat frontend sederhana untuk berinteraksi dengan TaskManager contract menggunakan React dan ethers.js.