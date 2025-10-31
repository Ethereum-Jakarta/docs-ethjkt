---
id: sesi-2-batch-4-offline
title: "Sesi 2: Professional Development dengan Hardhat & Token Standards"
sidebar_label: "#2 Hardhat & Token Standards"
sidebar_position: 2
description: "Hari kedua Kelas Rutin Batch IV (OFFLINE): Belajar professional development dengan Hardhat 3, memahami Token Standards (ERC-20, ERC-721, ERC-1155), dan membangun ekosistem token untuk game LiskGarden."
---

# Sesi 2: Professional Development dengan Hardhat & Token Standards

## 📋 Informasi Sesi

**Tanggal**: Minggu, 2 November 2025
**Waktu**: 09:00 - 17:00 WIB (8 jam)
**Lokasi**: Jura Kemanggisan
**Format**: Workshop tatap muka (offline)
**Peserta**: 40-80 pengembang pemula
**Level**: Beginner-friendly dengan penjelasan step-by-step

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan sesi ini, Anda akan mampu:

1. **Memahami Token Standards dari Dasar** - Mengerti apa itu ERC-20, ERC-721, dan ERC-1155, kapan menggunakan masing-masing, dan use cases nyata
2. **Setup Development Environment** - Mengatur Hardhat 3 untuk development smart contract secara profesional
3. **Membangun ERC-20 Step-by-Step** - Membuat fungible token dari yang paling sederhana hingga fitur lengkap
4. **Membangun ERC-721 Step-by-Step** - Membuat NFT dengan metadata dan fitur standar
5. **Membangun ERC-1155 Step-by-Step** - Membuat multi-token contract untuk game items
6. **Deploy dan Test Contracts** - Deployment ke Lisk Sepolia dan testing dengan Hardhat
7. **Memulai Integrasi Token** - Memahami cara menggabungkan berbagai token dalam satu aplikasi

---

## 📅 Jadwal Lengkap

| Waktu | Durasi | Aktivitas | Format |
|-------|--------|-----------|--------|
| 08:30 - 09:00 | 30m | Registrasi & Setup Environment | Persiapan |
| 09:00 - 09:15 | 15m | Review Sesi 1 & Pengenalan Token Standards | Pembukaan |
| 09:15 - 10:45 | 90m | **Modul 1**: Hardhat Setup & Pengenalan ERC-20 | Theory + Setup |
| 10:45 - 11:00 | 15m | Istirahat Kopi | Istirahat |
| 11:00 - 12:30 | 90m | **Modul 2**: Membangun ERC-20 Step-by-Step | Hands-on |
| 12:30 - 13:30 | 60m | Istirahat Makan Siang & Networking | Istirahat |
| 13:30 - 15:00 | 90m | **Modul 3**: Memahami & Membangun ERC-721 NFT | Theory + Practice |
| 15:00 - 15:15 | 15m | Istirahat Kopi | Istirahat |
| 15:15 - 16:45 | 90m | **Modul 4**: Memahami & Membangun ERC-1155 | Theory + Practice |
| 16:45 - 17:00 | 15m | Showcase & Assignment Briefing | Penutup |

---

## 📚 Modul 1: Hardhat Setup & Memahami ERC-20 (09:15 - 10:45)

### Gambaran Modul

Modul ini dibagi menjadi dua bagian:
- **Part A (30 menit)**: Quick Hardhat setup untuk development
- **Part B (60 menit)**: Memahami ERC-20 secara mendalam

---

## PART A: Hardhat Quick Setup (30 menit)

Now let's set up a professional development environment using the latest Hardhat 3!

### Why Use Hardhat?

**Remix is great for learning, but Hardhat is better for:**
- ✅ Writing automated tests
- ✅ Deploying to multiple networks
- ✅ Working with teams
- ✅ Version control (Git)
- ✅ Professional workflows

### Step 1: Install Prerequisites

**You need:**
- Node.js version 22 or higher
- npm (comes with Node.js)
- A code editor (VS Code recommended)

**Check your version:**
```bash
node --version
# Should show v22.0.0 or higher

npm --version
# Should show 7.0.0 or higher
```

**Don't have Node.js?**
- Download from [https://nodejs.org](https://nodejs.org)
- Choose the LTS version
- Install it
- Restart your terminal

---

### Step 2: Create Your Project

**1. Create a new folder:**
```bash
mkdir lisk-garden-hardhat
cd lisk-garden-hardhat
```

**2. Initialize npm:**
```bash
npm init -y
```

**Explanation:**
- `mkdir` = creates a new folder
- `cd` = enters the folder
- `npm init -y` = creates package.json (project config file)
- `-y` = says "yes" to all questions automatically

**3. Install Hardhat:**
```bash
npm install --save-dev hardhat
```

**Explanation:**
- `npm install` = downloads and installs packages
- `--save-dev` = saves it as development dependency
- Takes ~30 seconds to install

---

### Step 3: Initialize Hardhat Project

**1. Run Hardhat initialization:**
```bash
npx hardhat --init
```

**2. You'll see the Hardhat 3 wizard:**

```
 _   _               _   _           _     _____
| | | |             | | | |         | |   |____ |
| |_| | __ _ _ __ __| |_| |__   __ _| |_      / /
|  _  |/ _` | '__/ _` | '_ \ / _` | __|     \ \
| | | | (_| | | | (_| | | | | (_| | |_  .___/ /
\_| |_/\__,_|_|  \__,_|_| |_|\__,_|\__| \____/

👷 Welcome to Hardhat v3.0.0 👷‍

? Which version of Hardhat would you like to use? › hardhat-3
? Where would you like to initialize the project? › .
  Please provide either a relative or an absolute path: .

? What type of project would you like to initialize? › node-test-runner-viem
  Hardhat only supports ESM projects. Would you like to turn your project into ESM? (Y/n) › true
✨ Template files copied ✨

? You need to install the necessary dependencies using the following command:
npm install --save-dev "@nomicfoundation/hardhat-toolbox-viem@^3.0.0" ...

Do you want to run it now? (Y/n) › true
```

**3. Select these options:**
- **Version**: Choose `hardhat-3` (latest!)
- **Path**: Just press Enter (uses current directory)
- **Project type**: Choose `node-test-runner-viem`
- **Turn into ESM**: `Y` (yes - this is modern JavaScript)
- **Install dependencies**: `Y` (yes)

**Explanation:**
- `hardhat-3` = the latest version (released 2025)
- ESM = ECMAScript Modules (modern JavaScript standard)
- `node-test-runner-viem` = uses Node.js built-in test runner + viem
- Viem = modern, lightweight library (faster than ethers.js)

**4. Wait for installation:**
- Takes ~1-2 minutes
- Installs 110+ packages
- You'll see: `added 110 packages, and audited 170 packages in 37s`
- Normal output - don't worry!

**5. Installation complete when you see:**
```
✨ Dependencies installed ✨
Give Hardhat a star on GitHub if you're enjoying it! 🌟✨

https://github.com/NomicFoundation/hardhat
```

---

### Step 4: Project Structure

**After setup, you'll see:**
```
lisk-garden-hardhat/
├── contracts/           # Your smart contracts go here
│   └── Counter.sol     # Sample contract (delete this)
│   └── Counter.t.sol   # Sample test in Solidity (delete this)
├── ignition/           # Deployment scripts (Hardhat 3 Ignition)
│   └── modules/
│       └── Counter.ts  # Sample deployment (delete this)
├── test/               # Test files in TypeScript
│   └── Counter.ts      # Sample test (delete this)
├── scripts/            # Custom scripts
│   └── send-op-tx.ts   # Sample script (we'll create our own)
├── node_modules/       # Installed packages (don't touch!)
├── hardhat.config.ts   # Main configuration file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── .gitignore          # Git ignore file
```

**Explanation:**
- `contracts/` = Solidity smart contracts go here
- `Counter.sol` = sample contract using Hardhat 3 features
- `Counter.t.sol` = Solidity test (Foundry-style, new in Hardhat 3!)
- `ignition/modules/` = deployment scripts using Hardhat Ignition
- `test/` = TypeScript/JavaScript tests
- `scripts/` = custom automation scripts
- `hardhat.config.ts` = network config, compiler settings (uses ESM imports)
- `node_modules/` = installed packages (Git ignores this)

**Note:** Hardhat 3 now supports both Solidity tests (`.t.sol`) AND TypeScript tests!

---

### Step 5: Add LiskGarden Contract

**1. Delete the sample files:**
```bash
# Delete sample contracts
rm contracts/Counter.sol
rm contracts/Counter.t.sol

# Delete sample deployment
rm ignition/modules/Counter.ts

# Delete sample test
rm test/Counter.ts
```

**2. Create LiskGarden.sol:**
```bash
# On Windows:
type nul > contracts/LiskGarden.sol

# On Mac/Linux:
touch contracts/LiskGarden.sol
```

**3. Copy your LiskGarden code:**
- Open `contracts/LiskGarden.sol` in VS Code
- Copy the complete LiskGarden contract from section 105 above
- Paste it into the file
- Save the file (Ctrl+S or Cmd+S)

---

### Step 6: Configure for Lisk Sepolia

**1. Install dotenv (for secure keys): & hardhat-ethers**
```bash
npm install --save-dev dotenv
npm install @nomicfoundation/hardhat-ethers
```

**Explanation:**
- `dotenv` = loads secret keys from .env file
- Keeps your private key safe (not in code!)

**2. Create .env file:**
```bash
# On Windows:
type nul > .env

# On Mac/Linux:
touch .env
```

**3. Add your private key to .env:**
```env
PRIVATE_KEY=your_private_key_here
```

**How to get your private key:**
1. Open MetaMask
2. Click the 3 dots → Account Details
3. Click "Show private key"
4. Enter your password
5. Copy the private key
6. Paste in .env file

**⚠️ IMPORTANT:**
- NEVER share your private key!
- NEVER commit .env to Git!
- The .gitignore already protects it

**4. Update hardhat.config.ts:**

Open `hardhat.config.ts` and replace everything with:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatIgnitionViemPlugin, hardhatVerify, hardhatEthers],
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "lisk-sepolia": {
      type: "http",
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 4202,
    },
  },
  chainDescriptors: {
    4202: {
      name: "Lisk Sepolia",
      blockExplorers: {
        blockscout: {
          name: "Blockscout",
          url: "https://sepolia-blockscout.lisk.com/",
          apiUrl: "https://sepolia-blockscout.lisk.com/api",
        },
      },
    },
  },
  verify: {
    blockscout: {
      enabled: true,
    },
  },
};

export default config;

```

**Explanation:**
- `import` = loads packages (ESM/TypeScript style - new in Hardhat 3)
- `hardhatToolboxViemPlugin` = viem-based toolbox for Hardhat 3
- `hardhatIgnitionViemPlugin` = deployment plugin
- `hardhatEthers` = hardhat ethers specific plugin
- `hardhatVerify` = verification plugin for block explorers
- `plugins: [...]` = registers Hardhat 3 plugins
- `dotenv.config()` = loads .env file
- `solidity: "0.8.30"` = compiler version (matches our contract)
- `optimizer: enabled: true` = makes contract use less gas
- `type: "http"` = network type (required in Hardhat 3)
- `networks: "lisk-sepolia"` = Lisk testnet configuration
- `url` = RPC endpoint for Lisk Sepolia
- `accounts` = your private key from .env
- `chainId: 4202` = Lisk Sepolia chain ID
- `chainDescriptors` = tells Hardhat about Lisk Sepolia's block explorer
- `verify: { blockscout: { enabled: true } }` = enables Blockscout verification

---

### Step 7: Compile Your Contract

**1. Compile:**
```bash
npx hardhat compile
```

**Explanation:**
- Compiles your Solidity code to bytecode
- Creates TypeScript types automatically
- Checks for errors

**2. You should see:**
```
Compiled 1 Solidity file successfully
```

**3. Check artifacts folder:**
```
artifacts/
└── contracts/
    └── LiskGarden.sol/
        └── LiskGarden.json  # ABI and bytecode here!
```

---

### Step 8: Write Deployment Script

**1. Delete sample deployment:**
```bash
rm -rf ignition/modules/Lock.ts
```

**2. Create deployment script:**

Create `ignition/modules/LiskGarden.ts`:

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LiskGardenModule = buildModule("LiskGardenModule", (m) => {
  // Deploy LiskGarden contract
  const liskGarden = m.contract("LiskGarden");

  return { liskGarden };
});

export default LiskGardenModule;
```

**Explanation:**
- `buildModule` = Hardhat Ignition's way to deploy
- `m.contract("LiskGarden")` = deploys LiskGarden contract
- No constructor parameters needed (our contract has empty constructor)
- Returns the deployed contract instance

---

### Step 9: Get Test ETH

**You need test ETH on Lisk Sepolia!**

**Option 1: Direct Lisk Faucet**
1. Go to [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
2. Paste your wallet address
3. Click "Request tokens"
4. Wait 30 seconds
5. Check MetaMask!

**Option 2: Bridge from Ethereum Sepolia**
1. Get Sepolia ETH from [https://sepoliafaucet.com](https://sepoliafaucet.com)
2. Go to [https://sepolia-bridge.lisk.com](https://sepolia-bridge.lisk.com)
3. Bridge ETH from Sepolia to Lisk Sepolia
4. Wait ~5 minutes

---

### Step 10: Deploy to Lisk Sepolia!

**1. Deploy:**
```bash
npx hardhat ignition deploy ignition/modules/LiskGarden.ts --network lisk-sepolia
```

**Explanation:**
- `ignition deploy` = Hardhat 3's new deployment system
- `--network lisk-sepolia` = deploy to Lisk Sepolia (not local)

**2. You'll see:**
```
✔ Confirm deploy to network lisk-sepolia (4202)? … yes

Hardhat Ignition 🚀

Deploying [ LiskGardenModule ]

Batch #1
  Executed LiskGardenModule#LiskGarden

[ LiskGardenModule ] successfully deployed 🚀

Deployed Addresses

LiskGardenModule#LiskGarden - 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4
```

**3. SAVE YOUR CONTRACT ADDRESS!**
- Copy the deployed address
- You'll need it to interact with the contract

---

### Step 11: Verify Your Contract

**Verify on block explorer so everyone can see your code:**

```bash
npx hardhat verify --network lisk-sepolia 0xYourContractAddress
```

**Replace `0xYourContractAddress` with your actual deployed address!**

**You'll see:**
```
Successfully submitted source code for contract
contracts/LiskGarden.sol:LiskGarden at 0x742d35Cc...
https://sepolia-blockscout.lisk.com/address/0x742d35Cc...
```

**Explanation:**
- `verify` = uploads source code to block explorer
- People can read your code on Blockscout
- Makes your contract trustworthy!

---

### Step 12: Interact with Your Contract

**Create an interaction script:**

Create `scripts/interact.ts`:

```typescript
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4";

  // Get contract instance
  const LiskGarden = await ethers.getContractAt("LiskGarden", CONTRACT_ADDRESS);

  console.log("LiskGarden contract:", CONTRACT_ADDRESS);
  console.log("");

  // Get plant counter
  const plantCounter = await LiskGarden.plantCounter();
  console.log("Total plants:", plantCounter.toString());

  // Plant a seed (costs 0.001 ETH)
  console.log("\n🌱 Planting a seed...");
  const plantPrice = await LiskGarden.PLANT_PRICE();
  const tx = await LiskGarden.plantSeed({ value: plantPrice });
  await tx.wait();
  console.log("✅ Seed planted! Transaction:", tx.hash);

  // Get new plant ID
  const newPlantCounter = await LiskGarden.plantCounter();
  const plantId = newPlantCounter;
  console.log("Your plant ID:", plantId.toString());

  // Get plant details
  const plant = await LiskGarden.getPlant(plantId);
  console.log("\n🌿 Plant details:");
  console.log("  - ID:", plant.id.toString());
  console.log("  - Owner:", plant.owner);
  console.log("  - Stage:", plant.stage, "(0=SEED, 1=SPROUT, 2=GROWING, 3=BLOOMING)");
  console.log("  - Water Level:", plant.waterLevel.toString());
  console.log("  - Is Alive:", plant.isAlive);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Run it:**
```bash
npx hardhat run scripts/interact.ts --network lisk-sepolia
```

**You'll see:**
```
LiskGarden contract: 0x742d35Cc...

Total plants: 0

🌱 Planting a seed...
✅ Seed planted! Transaction: 0xabc123...
Your plant ID: 1

🌿 Plant details:
  - ID: 1
  - Owner: 0xYourAddress
  - Stage: 0 (SEED)
  - Water Level: 100
  - Is Alive: true
```

---

## Hardhat Commands Cheat Sheet

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Lisk Sepolia
npx hardhat ignition deploy ignition/modules/LiskGarden.ts --network lisk-sepolia

# Verify contract
npx hardhat verify --network lisk-sepolia <address>

# Run script
npx hardhat run scripts/interact.ts --network lisk-sepolia

# Clean artifacts
npx hardhat clean

# Get help
npx hardhat help
```

---

## What You Learned (Hardhat)

**Professional Setup:**
- ✅ Installed latest Hardhat 3
- ✅ Created TypeScript project
- ✅ Configured Lisk Sepolia network
- ✅ Secured private keys with .env

**Development Workflow:**
- ✅ Compiled contracts
- ✅ Deployed with Hardhat Ignition
- ✅ Verified on block explorer
- ✅ Interacted with TypeScript scripts

**Best Practices:**
- ✅ TypeScript for type safety
- ✅ Environment variables for secrets
- ✅ Compiler optimization enabled
- ✅ Professional project structure

---

## PART B: Memahami ERC-20 Secara Mendalam (60 menit)

### 1.3 Apa Itu Token? (Konsep Dasar)

#### Definisi Token dalam Blockchain

**Token** adalah representasi digital dari suatu aset atau utilitas yang ada di blockchain.

```
┌─────────────────────────────────────────────────────┐
│                 DUNIA NYATA                          │
│                                                       │
│  💵 Uang      →  Token Currency (IDR, USD)          │
│  🏠 Properti   →  Token Real Estate                  │
│  🎫 Tiket     →  Token Event Access                 │
│  🏆 Poin      →  Token Loyalty Points                │
│  📜 Saham      →  Token Securities                   │
│                                                       │
└─────────────────────────────────────────────────────┘
                        ↓ TOKENISASI
┌─────────────────────────────────────────────────────┐
│              BLOCKCHAIN (DIGITAL)                    │
│                                                       │
│  📊 ERC-20    →  Fungible Tokens                    │
│  🖼️  ERC-721   →  Non-Fungible Tokens (NFTs)        │
│  🎮 ERC-1155  →  Multi-Token Standard                │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

### 1.4 Apa Itu ERC-20?

#### Definisi

**ERC-20** adalah **standard interface** untuk fungible tokens di Ethereum (dan EVM chains seperti Lisk).

**Penjelasan istilah:**
- **ERC** = Ethereum Request for Comments (proposal standar)
- **20** = Nomor proposal (dibuat tahun 2015 oleh Fabian Vogelsteller)
- **Fungible** = Dapat ditukar 1:1, setiap unit identik

#### Fungible vs Non-Fungible

```
┌─────────────────────────────────────────────────────┐
│           FUNGIBLE (ERC-20)                          │
│  ───────────────────────────────────────────────────│
│                                                       │
│  💵 1 USD coin = 1 USD coin (identik)               │
│  💵 10 USDT milik Ali = 10 USDT milik Budi          │
│                                                       │
│  ✅ Dapat ditukar secara equivalen                   │
│  ✅ Dapat dibagi (divisible): 0.5 token             │
│  ✅ Setiap unit punya nilai sama                     │
│                                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         NON-FUNGIBLE (ERC-721)                       │
│  ───────────────────────────────────────────────────│
│                                                       │
│  🎨 NFT #1 ≠ NFT #2 (unique)                        │
│  🏠 Rumah A ≠ Rumah B (berbeda lokasi, kondisi)     │
│                                                       │
│  ❌ Tidak dapat ditukar 1:1                          │
│  ❌ Tidak dapat dibagi                               │
│  ✅ Setiap unit unik, punya karakteristik sendiri    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

### 1.5 Mengapa ERC-20 Penting?

#### 1. Interoperability (Interoperabilitas)

Karena ERC-20 adalah **standar**, semua token ERC-20 bekerja dengan cara yang sama.

```
┌────────────────────────────────────────────────────┐
│   SEMUA ERC-20 KOMPATIBEL DENGAN:                  │
│                                                     │
│   🦊 Wallet (MetaMask, Trust Wallet, etc)         │
│   🏦 Exchange (Binance, Coinbase, Indodax)         │
│   📊 DeFi (Uniswap, Aave, Compound)                │
│   🎮 Games & dApps                                  │
│   📱 Block Explorers                                │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Contoh:**
- MetaMask tidak perlu update setiap ada token baru
- Uniswap dapat list token baru tanpa code changes
- Indodax dapat list ERC-20 apapun dengan sistem yang sama

#### 2. Standardisasi

Sebelum ERC-20, setiap token punya interface berbeda → chaos!

```
❌ SEBELUM ERC-20 (2015):
   TokenA: send(to, amount)
   TokenB: transfer(recipient, value)
   TokenC: move(destination, quantity)
   → Exchange bingung, tidak scalable!

✅ DENGAN ERC-20:
   Semua: transfer(to, amount)
   → Satu interface, ribuan token kompatibel
```

#### 3. Security & Trust

ERC-20 standard sudah di-battle-test selama 9+ tahun.

- Ribuan security audit
- Milyaran dollar secured
- Best practices established
- Community tested

---

### 1.6 ERC-20 Interface (The Standard)

#### Interface Lengkap

Ini adalah **6 fungsi wajib** dan **2 events** yang harus ada di setiap ERC-20:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ERC-20 Token Standard
 * @dev Interface yang WAJIB diimplementasikan
 */
interface IERC20 {

    // ============ EVENTS ============

    /**
     * @dev Emitted ketika `value` token dipindahkan dari `from` ke `to`
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    /**
     * @dev Emitted ketika `owner` meng-approve `spender` untuk spend `value` token
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Returns total supply token yang ada
     * Contoh: 1,000,000 tokens
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns balance token milik `account`
     * Contoh: alamat 0x123... punya 500 tokens
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Returns jumlah token yang `spender` boleh spend dari `owner`
     * Ini untuk approval mechanism (dijelaskan detail nanti)
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    // ============ STATE-CHANGING FUNCTIONS ============

    /**
     * @dev Transfer `amount` token ke `to`
     * Returns true jika sukses
     * WAJIB emit event Transfer
     */
    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Set `amount` sebagai allowance untuk `spender` dari token caller
     * Returns true jika sukses
     * WAJIB emit event Approval
     *
     * WARNING: Hati-hati dengan race condition (akan dijelaskan)
     */
    function approve(
        address spender,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Transfer `amount` token dari `from` ke `to` menggunakan allowance
     * Returns true jika sukses
     * WAJIB emit event Transfer
     *
     * Caller harus punya allowance >= amount
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
```

#### Penjelasan Setiap Fungsi

**1. `totalSupply()`**

```solidity
function totalSupply() external view returns (uint256);
```

**Tujuan**: Mendapatkan total semua token yang ada.

**Contoh:**
```solidity
// Jika total supply = 1 juta token
totalSupply(); // returns: 1000000000000000000000000 (1M * 10^18)
```

**Real Use Case:**
- CoinMarketCap/CoinGecko ambil data dari sini
- Menghitung market cap = price * totalSupply
- Menentukan scarcity token

---

**2. `balanceOf(address)`**

```solidity
function balanceOf(address account) external view returns (uint256);
```

**Tujuan**: Cek berapa token yang dimiliki suatu address.

**Contoh:**
```solidity
balanceOf(0x123...); // returns: 500000000000000000000 (500 tokens)
```

**Real Use Case:**
- Wallet menampilkan balance user
- Smart contract cek apakah user punya cukup token
- Leaderboard token holders

---

**3. `transfer(address, uint256)`**

```solidity
function transfer(address to, uint256 amount) external returns (bool);
```

**Tujuan**: Transfer token dari caller ke address `to`.

**Flow:**
```
┌──────────────────────────────────────────────────┐
│  TRANSFER FLOW                                   │
│                                                   │
│  1. Alice calls: transfer(Bob, 100 tokens)      │
│  2. Contract checks: Alice punya >= 100?         │
│  3. If yes:                                       │
│     - Alice balance -= 100                        │
│     - Bob balance += 100                          │
│     - Emit Transfer event                         │
│  4. Return true                                   │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Real Use Case:**
- Send token ke teman
- Pembayaran merchant
- Withdraw dari exchange

---

**4. `approve(address, uint256)`**

```solidity
function approve(address spender, uint256 amount) external returns (bool);
```

**Tujuan**: Izinkan `spender` untuk spend token kita sampai `amount`.

**Mengapa butuh approve?**

Bayangkan skenario DeFi:
1. Kamu ingin trade di Uniswap
2. Uniswap contract perlu ambil token kamu untuk swap
3. Kamu harus kasih "izin" (approval) dulu ke Uniswap contract

**Flow:**
```
┌──────────────────────────────────────────────────┐
│  APPROVAL FLOW                                    │
│                                                   │
│  Scenario: Alice ingin trade di Uniswap          │
│                                                   │
│  1. Alice calls: approve(UniswapAddress, 1000)   │
│  2. Contract simpan:                              │
│     allowance[Alice][Uniswap] = 1000              │
│  3. Emit Approval event                           │
│  4. Sekarang Uniswap boleh ambil max 1000 token  │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Real Use Case:**
- Trading di DEX (Uniswap, PancakeSwap)
- Staking di DeFi protocol
- Pembayaran subscription otomatis
- Game yang perlu burn token

---

**5. `allowance(address, address)`**

```solidity
function allowance(address owner, address spender) external view returns (uint256);
```

**Tujuan**: Cek berapa token yang `spender` boleh spend dari `owner`.

**Contoh:**
```solidity
// Setelah Alice approve Uniswap 1000 token
allowance(Alice, Uniswap); // returns: 1000

// Setelah Uniswap pakai 300 token
allowance(Alice, Uniswap); // returns: 700 (sisa)
```

---

**6. `transferFrom(address, address, uint256)`**

```solidity
function transferFrom(
    address from,
    address to,
    uint256 amount
) external returns (bool);
```

**Tujuan**: Transfer token dari `from` ke `to`, menggunakan allowance yang sudah di-approve.

**Flow Lengkap:**
```
┌─────────────────────────────────────────────────────┐
│  TRANSFER FROM FLOW                                  │
│                                                      │
│  Setup:                                              │
│  - Alice punya 5000 token                            │
│  - Alice approve Uniswap 1000 token                  │
│                                                      │
│  Transaction:                                        │
│  1. Uniswap calls:                                   │
│     transferFrom(Alice, Uniswap, 500)                │
│                                                      │
│  2. Contract checks:                                 │
│     ✓ Alice balance >= 500? YES (punya 5000)        │
│     ✓ Allowance[Alice][Uniswap] >= 500? YES (1000)  │
│                                                      │
│  3. Execute:                                         │
│     Alice balance: 5000 → 4500                       │
│     Uniswap balance: 0 → 500                         │
│     Allowance: 1000 → 500                            │
│                                                      │
│  4. Emit Transfer(Alice, Uniswap, 500)              │
│  5. Return true                                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Real Use Case:**
- DEX melakukan swap
- DeFi protocol ambil collateral
- Payment processor charge subscription
- Game burn item cost

---

### 1.7 Real-World Use Cases ERC-20

#### A. Use Cases Global

**1. Stablecoins (Mata Uang Digital)**

| Token | Total Supply | Use Case |
|-------|--------------|----------|
| **USDT** (Tether) | $140 Miliar | Transfer USD secara global, trading |
| **USDC** (Circle) | $33 Miliar | Pembayaran crypto, settlement |
| **DAI** (MakerDAO) | $5 Miliar | Decentralized stablecoin |

**Mengapa penting:**
- Transfer USD ke luar negeri: bank (3 hari) vs USDT (10 menit)
- Biaya: bank ($25-50) vs blockchain ($1-3)
- 24/7 availability

**2. Governance Tokens**

| Token | DAO | Use Case |
|-------|-----|----------|
| **UNI** | Uniswap | Vote untuk fee structure, treasury spending |
| **AAVE** | Aave Protocol | Vote untuk risk parameters, new markets |
| **MKR** | MakerDAO | Vote untuk DAI stability fee, collateral types |

**Cara kerja:**
- 1 token = 1 vote (atau proportional)
- Proposal on-chain
- Voting period (biasanya 3-7 hari)
- Execution otomatis jika passed

**3. Utility Tokens**

| Token | Platform | Utility |
|-------|----------|---------|
| **BNB** | Binance | Trading fee discount, gas fee di BNB Chain |
| **LINK** | Chainlink | Pembayaran untuk oracle services |
| **BAT** | Brave Browser | Reward untuk user, pembayaran ads |

**4. Reward Tokens**

| Token | Platform | Cara Dapat |
|-------|----------|------------|
| **COMP** | Compound | Lending & borrowing |
| **CRV** | Curve Finance | Liquidity provider |
| **MATIC** | Polygon | Staking validator |

**5. Gaming & Metaverse**

| Token | Game | Fungsi |
|-------|------|--------|
| **SAND** | The Sandbox | Buy virtual land, assets |
| **MANA** | Decentraland | Virtual real estate |
| **AXS** | Axie Infinity | Governance, staking |

---

#### B. Use Cases Lokal Indonesia

**1. Loyalty Points (Program Loyalitas)**

```
Contoh: Kopi Kenangan Points

Traditional System:
❌ Centralized database
❌ Tidak bisa transfer ke orang lain
❌ Tidak transparent
❌ Expire sewaktu-waktu

Dengan ERC-20:
✅ On-chain, transparent
✅ Bisa di-trade/gift ke teman
✅ Tidak bisa dihapus sepihak
✅ Bisa di-integrate dengan merchant lain
```

**Implementation:**
```solidity
contract KenangPoints is ERC20 {
    // 1 kopi = 10 points
    // 100 points = 1 free coffee

    function earnPoints(address customer) external {
        // Customer beli kopi → dapat points
        _mint(customer, 10 * 10**18);
    }

    function redeemCoffee() external {
        // Burn 100 points untuk free coffee
        _burn(msg.sender, 100 * 10**18);
    }
}
```

**2. Event Ticketing**

```
Contoh: Java Jazz Festival

Problem Tradisional:
❌ Tiket palsu
❌ Scalping (calo)
❌ Tidak bisa resell dengan aman

Dengan ERC-20:
✅ Authenticity guaranteed (on-chain)
✅ Resell dengan smart contract (royalty ke organizer)
✅ Transfer terverifikasi
✅ Event history permanent
```

**3. Community Token (Komunitas)**

```
Contoh: Indonesia Blockchain Community Token

Use Cases:
- Voting untuk event berikutnya
- Akses exclusive content
- Discount merchandise
- Reward untuk kontributor
```

**4. Kampus Token**

```
Contoh: BINUS Achievement Token

Skenario:
- Student dapat token untuk achievements:
  * Juara lomba: 100 tokens
  * Publikasi paper: 50 tokens
  * Community service: 25 tokens

- Redeem untuk:
  * Tuition discount
  * Library late fee waiver
  * Campus facility booking priority
```

**5. Carbon Credits (Kredit Karbon)**

```
Indonesia: Hutan Hujan Tropis Terbesar ke-3

Traditional System:
❌ Paper-based certificates
❌ Sulit tracking
❌ Fraud risk

Dengan ERC-20:
✅ Tokenize 1 ton CO₂ = 1 token
✅ Transparent trading
✅ Immutable records
✅ Global marketplace access
```

---

### 1.8 ERC-20 Token Economics (Tokenomics)

#### Komponen Tokenomics

**1. Total Supply**

```
Fixed Supply (Like Bitcoin):
contract FixedToken is ERC20 {
    constructor() ERC20("Fixed Token", "FIX") {
        _mint(msg.sender, 21_000_000 * 10**18); // Never change
    }
}

Unlimited Supply:
contract UnlimitedToken is ERC20 {
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount); // Can mint forever
    }
}

Capped Supply:
contract CappedToken is ERC20, ERC20Capped {
    constructor()
        ERC20("Capped Token", "CAP")
        ERC20Capped(100_000_000 * 10**18) // Max 100M
    {}
}
```

**2. Distribution**

```
┌─────────────────────────────────────────────────┐
│  TYPICAL TOKEN DISTRIBUTION                     │
│                                                  │
│  🌱 Team & Founders        20%                  │
│     → Vested 4 tahun, 1 tahun cliff            │
│                                                  │
│  💰 Investors              15%                  │
│     → Vested 2 tahun                            │
│                                                  │
│  🎁 Community Rewards      40%                  │
│     → Emissions selama 10 tahun                 │
│                                                  │
│  🏦 Treasury/DAO           15%                  │
│     → Controlled by governance                  │
│                                                  │
│  💧 Liquidity              10%                  │
│     → For DEX trading                           │
│                                                  │
└─────────────────────────────────────────────────┘
```

**3. Inflation/Deflation**

```
Inflationary (Supply Increases):
- Reward untuk staking
- Incentive liquidity providers
- Community grants

Deflationary (Supply Decreases):
- Token burns
- Transaction fees
- Buy & burn mechanism
```

---

### 1.9 Checkpoint Module 1

Sebelum lanjut ke coding, pastikan Anda paham:

**✅ Konsep Dasar:**
- [ ] Apa itu fungible token
- [ ] Mengapa perlu standarisasi (ERC-20)
- [ ] Perbedaan token vs coin

**✅ ERC-20 Interface:**
- [ ] 6 fungsi wajib: totalSupply, balanceOf, transfer, approve, allowance, transferFrom
- [ ] 2 events: Transfer, Approval
- [ ] Kapan pakai transfer vs transferFrom

**✅ Real Use Cases:**
- [ ] Minimal 3 use case global
- [ ] Minimal 2 use case lokal Indonesia
- [ ] Kenapa ERC-20 cocok untuk use case tersebut

**✅ Tokenomics:**
- [ ] Fixed vs unlimited supply
- [ ] Distribution strategy
- [ ] Inflation vs deflation

**❓ Quiz Cepat:**

1. Apa perbedaan `transfer` dan `transferFrom`?
2. Mengapa Uniswap perlu `approve` sebelum swap?
3. Berikan 1 contoh use case ERC-20 di Indonesia yang belum disebutkan.

**Jawaban di pikiran masing-masing! Instruktur akan bahas setelah break.**

---

**🎯 Coming Up Next:**

Modul 2: Kita akan **MEMBANGUN ERC-20 step-by-step** dari yang paling basic sampai full-featured! Prepare your VS Code! 🚀
## 📚 Modul 2: Membangun ERC-20 Step-by-Step (11:00 - 12:30)

### Gambaran Modul

Di modul ini kita akan **membangun ERC-20 dari nol**, step-by-step:

1. **Level 1**: Basic Token (hanya transfer)
2. **Level 2**: Tambah Metadata (name, symbol, decimals)
3. **Level 3**: Approval System (approve + transferFrom)
4. **Level 4**: Minting & Burning
5. **Level 5**: Menuju GardenToken (foundation untuk homework)

**Pembelajaran**: Incremental, paham setiap baris code

---

## LEVEL 1: Basic Token (Transfer Saja)

### 2.1 Contract Paling Sederhana

Mari kita buat token yang **HANYA bisa transfer**.

**Buat file: `contracts/BasicToken.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title BasicToken
 * @dev Token paling sederhana - hanya transfer
 */
contract BasicToken {

    // ============ STATE VARIABLES ============

    /**
     * @dev Mapping dari address ke balance
     * Contoh: balances[0x123...] = 1000
     */
    mapping(address => uint256) public balances;

    /**
     * @dev Total supply token
     */
    uint256 public totalSupply;

    // ============ EVENTS ============

    /**
     * @dev Event ketika transfer terjadi
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    // ============ CONSTRUCTOR ============

    /**
     * @dev Mint initial supply ke creator
     */
    constructor(uint256 _initialSupply) {
        // Semua token ke creator contract
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

        // Emit transfer dari address(0) = minting
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ============ PUBLIC FUNCTIONS ============

    /**
     * @dev Transfer token ke address lain
     * @param _to Recipient address
     * @param _value Jumlah token
     * @return success True jika berhasil
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // 1. Validasi: punya cukup balance?
        require(balances[msg.sender] >= _value, "Insufficient balance");

        // 2. Validasi: recipient valid?
        require(_to != address(0), "Cannot transfer to zero address");

        // 3. Update balances
        balances[msg.sender] -= _value;  // Kurangi sender
        balances[_to] += _value;          // Tambah recipient

        // 4. Emit event
        emit Transfer(msg.sender, _to, _value);

        // 5. Return success
        return true;
    }

    /**
     * @dev Get balance of address
     * @param _owner Address to check
     * @return balance Token balance
     */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}
```

### Penjelasan Detail

**1. State Variables**

```solidity
mapping(address => uint256) public balances;
```

- `mapping` = seperti dictionary/hash map
- `address => uint256` = key: address, value: number
- `public` = otomatis buat getter function

**2. Constructor**

```solidity
constructor(uint256 _initialSupply) {
    balances[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
    emit Transfer(address(0), msg.sender, _initialSupply);
}
```

- `msg.sender` = address yang deploy contract
- `address(0)` = 0x000...000 = representation of "minting"
- Transfer dari `address(0)` = konvensi untuk minting

**3. Transfer Function**

```solidity
function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balances[msg.sender] >= _value, "Insufficient balance");
    require(_to != address(0), "Cannot transfer to zero address");

    balances[msg.sender] -= _value;
    balances[_to] += _value;

    emit Transfer(msg.sender, _to, _value);
    return true;
}
```

**Langkah-langkah:**
1. **Validasi**: Cek sender punya cukup balance
2. **Validasi**: Cek recipient bukan address(0) (burning)
3. **Update State**: Kurangi sender, tambah recipient
4. **Emit Event**: Notify listeners
5. **Return**: Sukses

---

### 2.2 Compile & Deploy BasicToken

#### Compile

```bash
npx hardhat compile
```

**Expected output:**
```
Compiling 1 file with Solc 0.8.30
Compilation finished successfully
```

#### Deploy ke Lisk Sepolia

**Buat file: `ignition/modules/BasicToken.ts`**

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BasicTokenModule = buildModule("BasicTokenModule", (m) => {

  // Initial supply: 1 juta token
  // Catatan: 1 token = 1 (tanpa decimals dulu)
  const initialSupply = 1_000_000;

  const basicToken = m.contract("BasicToken", [initialSupply]);

  return { basicToken };
});

export default BasicTokenModule;
```

#### Deploy Command

```bash
npx hardhat ignition deploy ignition/modules/BasicToken.ts --network lisk-sepolia
```

**Proses:**
```
✅ Deploying BasicToken...
✅ BasicToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Simpan address ini!**

---

### 2.3 Test BasicToken

**Buat file: `test/BasicToken.test.ts`**

```typescript
import { expect } from "chai";
import hre from "hardhat";

describe("BasicToken", function () {

  async function deployBasicToken() {
    const [owner, addr1, addr2] = await hre.viem.getWalletClients();

    const basicToken = await hre.viem.deployContract("BasicToken", [1_000_000n]);

    const publicClient = await hre.viem.getPublicClient();

    return { basicToken, owner, addr1, addr2, publicClient };
  }

  describe("Deployment", function () {
    it("Should set the right total supply", async function () {
      const { basicToken } = await deployBasicToken();

      expect(await basicToken.read.totalSupply()).to.equal(1_000_000n);
    });

    it("Should assign total supply to owner", async function () {
      const { basicToken, owner } = await deployBasicToken();

      const ownerBalance = await basicToken.read.balanceOf([owner.account.address]);
      expect(ownerBalance).to.equal(1_000_000n);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { basicToken, owner, addr1, publicClient } = await deployBasicToken();

      // Transfer 100 tokens dari owner ke addr1
      const hash = await basicToken.write.transfer([addr1.account.address, 100n]);
      await publicClient.waitForTransactionReceipt({ hash });

      // Check balances
      const addr1Balance = await basicToken.read.balanceOf([addr1.account.address]);
      expect(addr1Balance).to.equal(100n);

      const ownerBalance = await basicToken.read.balanceOf([owner.account.address]);
      expect(ownerBalance).to.equal(999_900n); // 1M - 100
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { basicToken, addr1 } = await deployBasicToken();

      // addr1 punya 0 tokens, coba transfer 100
      await expect(
        basicToken.write.transfer([addr1.account.address, 100n], {
          account: addr1.account,
        })
      ).to.be.rejectedWith("Insufficient balance");
    });

    it("Should emit Transfer events", async function () {
      const { basicToken, owner, addr1, publicClient } = await deployBasicToken();

      const hash = await basicToken.write.transfer([addr1.account.address, 100n]);

      // Get transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Verify event emitted
      // (Viem automatically parses events)
      expect(receipt.status).to.equal("success");
    });
  });
});
```

#### Run Tests

```bash
npx hardhat test test/BasicToken.test.ts
```

**Expected:**
```
  BasicToken
    Deployment
      ✔ Should set the right total supply
      ✔ Should assign total supply to owner
    Transfers
      ✔ Should transfer tokens between accounts (150ms)
      ✔ Should fail if sender doesn't have enough tokens
      ✔ Should emit Transfer events (75ms)

  5 passing (2s)
```

---

### 2.4 Masalah BasicToken

**❌ Problem 1: Tidak Ada Decimals**

```
Saat ini:
- 1 token = 1
- Tidak bisa transfer 0.5 token
- Tidak standar (ERC-20 butuh decimals)
```

**❌ Problem 2: Tidak Ada Name & Symbol**

```
- Token tidak punya nama
- Wallet tidak tahu cara display
- User bingung ini token apa
```

**❌ Problem 3: Tidak Ada Approval System**

```
- Tidak bisa integrate dengan DEX
- Tidak bisa delegate transfer
- Tidak compatible dengan DeFi
```

**✅ Solution: Tambahkan fitur di Level 2!**

---

## LEVEL 2: Tambah Metadata (Name, Symbol, Decimals)

### 2.5 StandardToken dengan Metadata

**Buat file: `contracts/StandardToken.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title StandardToken
 * @dev Token dengan metadata (name, symbol, decimals)
 */
contract StandardToken {

    // ============ METADATA ============

    /**
     * @dev Nama token (contoh: "Garden Token")
     */
    string public name;

    /**
     * @dev Symbol token (contoh: "GDN")
     */
    string public symbol;

    /**
     * @dev Decimals (biasanya 18, sama seperti ETH)
     *
     * Dengan decimals = 18:
     * 1 token = 1 * 10^18 = 1000000000000000000
     */
    uint8 public decimals;

    // ============ BALANCES ============

    mapping(address => uint256) public balances;
    uint256 public totalSupply;

    // ============ EVENTS ============

    event Transfer(address indexed from, address indexed to, uint256 value);

    // ============ CONSTRUCTOR ============

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        // Initial supply SUDAH dalam wei
        // Contoh: 1 juta token = 1_000_000 * 10^18
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ============ FUNCTIONS ============

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Cannot transfer to zero address");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
}
```

### Penjelasan Decimals

**Decimals** adalah jumlah digit di belakang koma.

```
Decimals = 18 (Standard ERC-20):

User UI:           Contract Storage:
1.0 token     →    1000000000000000000
0.5 token     →     500000000000000000
0.001 token   →       1000000000000000

Kenapa 18?
- Sama seperti ETH (1 ETH = 10^18 wei)
- Precision tinggi
- Standard industri
```

**Contoh:**

```solidity
// Deploy dengan 1 juta token (dengan 18 decimals)
constructor() {
    // User perspective: 1,000,000 tokens
    // Contract storage: 1000000 * 10^18

    uint256 supply = 1_000_000 * 10**18;
    balances[msg.sender] = supply;
}
```

**Di Wallet:**

```
MetaMask akan display:
Token: Garden Token (GDN)
Balance: 1,000,000.00 GDN

Internal storage:
1000000000000000000000000
```

---

### 2.6 Deploy StandardToken

**ignition/modules/StandardToken.ts:**

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StandardTokenModule = buildModule("StandardTokenModule", (m) => {

  const name = "Garden Token";
  const symbol = "GDN";
  const decimals = 18;
  const initialSupply = 1_000_000n * 10n**18n; // 1 juta token

  const standardToken = m.contract("StandardToken", [
    name,
    symbol,
    decimals,
    initialSupply,
  ]);

  return { standardToken };
});

export default StandardTokenModule;
```

**Deploy:**

```bash
npx hardhat ignition deploy ignition/modules/StandardToken.ts --network lisk-sepolia
```

---

### 2.7 Masalah StandardToken

**❌ Problem: Masih Tidak Ada Approval System**

Skenario yang tidak bisa dilakukan:

```
1. User ingin trade di DEX
   → DEX tidak bisa ambil token user
   → Butuh approval mechanism

2. User ingin staking
   → Staking contract tidak bisa transfer token user
   → Butuh approval mechanism

3. Game ingin burn item cost
   → Game contract tidak bisa burn token user
   → Butuh approval mechanism
```

**✅ Solution: Level 3!**

---

## LEVEL 3: Approval System

### 2.8 Complete ERC-20 dengan Approval

**Buat file: `contracts/CompleteToken.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title CompleteToken
 * @dev Full ERC-20 implementation dengan approval system
 */
contract CompleteToken {

    // ============ METADATA ============

    string public name;
    string public symbol;
    uint8 public decimals;

    // ============ STATE ============

    mapping(address => uint256) public balances;
    uint256 public totalSupply;

    /**
     * @dev Nested mapping untuk allowances
     * allowances[owner][spender] = amount
     *
     * Contoh:
     * allowances[Alice][Uniswap] = 1000
     * → Uniswap boleh spend 1000 token dari Alice
     */
    mapping(address => mapping(address => uint256)) public allowances;

    // ============ EVENTS ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // ============ CONSTRUCTOR ============

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ============ VIEW FUNCTIONS ============

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    // ============ TRANSFER FUNCTIONS ============

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Cannot transfer to zero address");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // ============ APPROVAL FUNCTIONS ============

    /**
     * @dev Approve spender untuk spend token caller
     * @param _spender Address yang di-approve
     * @param _value Jumlah yang di-approve
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Cannot approve zero address");

        // Set allowance
        allowances[msg.sender][_spender] = _value;

        // Emit event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    /**
     * @dev Transfer dari address lain menggunakan allowance
     * @param _from Owner yang token-nya akan di-transfer
     * @param _to Recipient
     * @param _value Jumlah token
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        // 1. Validasi: from punya cukup balance?
        require(balances[_from] >= _value, "Insufficient balance");

        // 2. Validasi: caller punya allowance cukup?
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        // 3. Validasi: recipient valid?
        require(_to != address(0), "Cannot transfer to zero address");

        // 4. Update balances
        balances[_from] -= _value;
        balances[_to] += _value;

        // 5. Update allowance (kurangi yang sudah dipakai)
        allowances[_from][msg.sender] -= _value;

        // 6. Emit Transfer event
        emit Transfer(_from, _to, _value);

        return true;
    }
}
```

### Penjelasan Approval System

**1. Data Structure**

```solidity
mapping(address => mapping(address => uint256)) public allowances;
```

**Nested mapping:**
```
allowances[owner][spender] = amount

Contoh:
allowances[Alice][Uniswap] = 1000
allowances[Alice][SushiSwap] = 500
allowances[Bob][Aave] = 2000
```

**2. Approve Flow**

```
Step 1: Alice approve Uniswap
────────────────────────────
Alice calls: approve(UniswapAddress, 1000 * 10^18)
Contract sets: allowances[Alice][Uniswap] = 1000
Event: Approval(Alice, Uniswap, 1000)
```

**3. TransferFrom Flow**

```
Step 2: Uniswap transfer dari Alice
────────────────────────────────────
Uniswap calls: transferFrom(Alice, UniswapPool, 500)

Checks:
✓ Alice balance >= 500?
✓ allowances[Alice][Uniswap] >= 500?

Execute:
balances[Alice] -= 500
balances[UniswapPool] += 500
allowances[Alice][Uniswap] -= 500  (1000 → 500 tersisa)

Event: Transfer(Alice, UniswapPool, 500)
```

---

### 2.9 Real-World Approval Examples

**Example 1: Uniswap Swap**

```typescript
// User wants to swap 100 GDN for ETH on Uniswap

// Step 1: Approve Uniswap Router
await gardenToken.write.approve([
  uniswapRouterAddress,
  100n * 10n**18n
]);

// Step 2: Uniswap executes swap
// (Uniswap internally calls transferFrom)
await uniswapRouter.write.swapExactTokensForETH([...params]);
```

**Example 2: Aave Lending**

```typescript
// User wants to lend 1000 GDN to Aave

// Step 1: Approve Aave
await gardenToken.write.approve([
  aavePoolAddress,
  1000n * 10n**18n
]);

// Step 2: Deposit (Aave calls transferFrom)
await aavePool.write.deposit([
  gardenTokenAddress,
  1000n * 10n**18n,
  userAddress,
  0
]);
```

---

## LEVEL 4: Minting & Burning

### 2.10 Token dengan Mint & Burn

Sekarang kita tambahkan kemampuan untuk:
- **Mint**: Buat token baru (increase supply)
- **Burn**: Hancurkan token (decrease supply)

**Buat file: `contracts/MintableToken.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title MintableToken
 * @dev ERC-20 dengan kemampuan mint & burn
 */
contract MintableToken {

    // ============ METADATA ============

    string public name;
    string public symbol;
    uint8 public decimals;

    // ============ STATE ============

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    uint256 public totalSupply;

    /**
     * @dev Owner contract (yang deploy)
     */
    address public owner;

    // ============ EVENTS ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // ============ MODIFIERS ============

    /**
     * @dev Modifier untuk restrict akses hanya owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender; // Set owner

        // Mint initial supply
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ============ VIEW FUNCTIONS ============

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    // ============ TRANSFER FUNCTIONS ============

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Cannot transfer to zero address");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Cannot approve zero address");
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");
        require(_to != address(0), "Cannot transfer to zero address");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // ============ MINT & BURN ============

    /**
     * @dev Mint token baru ke address tertentu
     * @param _to Address recipient
     * @param _amount Jumlah token yang di-mint
     *
     * Hanya owner yang bisa mint!
     */
    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "Cannot mint to zero address");

        // Tambah balance recipient
        balances[_to] += _amount;

        // Tambah total supply
        totalSupply += _amount;

        // Emit Transfer dari address(0) = minting
        emit Transfer(address(0), _to, _amount);
    }

    /**
     * @dev Burn (hancurkan) token caller
     * @param _amount Jumlah token yang di-burn
     *
     * Siapa saja bisa burn token sendiri
     */
    function burn(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance to burn");

        // Kurangi balance caller
        balances[msg.sender] -= _amount;

        // Kurangi total supply
        totalSupply -= _amount;

        // Emit Transfer ke address(0) = burning
        emit Transfer(msg.sender, address(0), _amount);
    }
}
```

### Penjelasan Mint & Burn

**1. Minting**

```
Minting = Buat token baru dari udara

Before mint:
Total Supply: 1,000,000
Alice: 100

Owner calls: mint(Alice, 500)

After mint:
Total Supply: 1,000,500 ← increased!
Alice: 600

Event: Transfer(address(0), Alice, 500)
```

**Use Cases:**
- Reward untuk user
- Staking rewards
- Liquidity mining
- Game rewards

**2. Burning**

```
Burning = Hancurkan token selamanya

Before burn:
Total Supply: 1,000,000
Alice: 600

Alice calls: burn(100)

After burn:
Total Supply: 999,900 ← decreased!
Alice: 500

Event: Transfer(Alice, address(0), 100)
```

**Use Cases:**
- Deflation mechanism
- Buy & burn
- Utility consumption (game item cost)
- Fee burning (seperti ETH EIP-1559)

---

### 2.11 Why Mint/Burn Matters

**Inflationary Tokens (dengan Mint):**

```
Contoh: MATIC (Polygon)

Staking Rewards:
- Validator stake MATIC
- Dapat reward dari newly minted MATIC
- Inflation rate: ~4% per year

Code:
function distributeStakingRewards(address validator, uint256 reward) external {
    mint(validator, reward); // Mint new tokens as reward
}
```

**Deflationary Tokens (dengan Burn):**

```
Contoh: BNB (Binance Coin)

Quarterly Burns:
- Binance burn BNB based on trading volume
- Total supply decrease over time
- Goal: Eventually 100M → 50M tokens

Code:
function quarterlyBurn(uint256 amount) external onlyOwner {
    burn(amount); // Burn to decrease supply
}
```

**Hybrid (Mint & Burn):**

```
Contoh: ETH (setelah EIP-1559)

Mint: Block rewards for validators
Burn: Base fee setiap transaction

Net result:
If burn > mint → Deflationary
If mint > burn → Inflationary
```

---

## LEVEL 5: Menuju GardenToken (Foundation)

### 2.12 GardenToken Skeleton

Sekarang kita mulai membangun **GardenToken** untuk game LiskGarden. Ini adalah **skeleton** (fondasi), bukan implementasi lengkap. **Full implementation akan jadi homework!**

**Apa yang sudah kita punya:**
- ✅ Transfer mechanism
- ✅ Metadata (name, symbol, decimals)
- ✅ Approval system
- ✅ Mint & burn

**Apa yang kita tambahkan untuk GardenToken:**
- Role-based minting (admin saja)
- Reward mechanism (untuk game integration)
- Pausable (untuk emergency)

**Buat file: `contracts/GardenTokenSkeleton.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title GardenTokenSkeleton
 * @dev Foundation untuk GardenToken - akan dilengkapi di homework
 */
contract GardenTokenSkeleton {

    // ============ METADATA ============

    string public constant NAME = "Garden Token";
    string public constant SYMBOL = "GDN";
    uint8 public constant DECIMALS = 18;

    // ============ STATE ============

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    uint256 public totalSupply;

    address public owner;

    /**
     * @dev Game contract address (yang boleh mint rewards)
     */
    address public gameContract;

    /**
     * @dev Paused state (untuk emergency)
     */
    bool public paused;

    // ============ EVENTS ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event GameContractSet(address indexed gameContract);
    event Paused(address account);
    event Unpaused(address account);

    // ============ MODIFIERS ============

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyGameContract() {
        require(msg.sender == gameContract, "Only game contract");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        paused = false;

        // Mint initial supply to owner
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Set game contract address
     * Hanya game contract yang boleh mint rewards
     */
    function setGameContract(address _gameContract) external onlyOwner {
        require(_gameContract != address(0), "Invalid address");
        gameContract = _gameContract;
        emit GameContractSet(_gameContract);
    }

    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ============ VIEW FUNCTIONS ============

    function name() public pure returns (string memory) {
        return NAME;
    }

    function symbol() public pure returns (string memory) {
        return SYMBOL;
    }

    function decimals() public pure returns (uint8) {
        return DECIMALS;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function allowance(address _owner, address spender) public view returns (uint256) {
        return allowances[_owner][spender];
    }

    // ============ TRANSFER FUNCTIONS ============

    function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public whenNotPaused returns (bool) {
        require(spender != address(0), "Invalid spender");

        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public whenNotPaused returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Insufficient allowance");
        require(to != address(0), "Invalid recipient");

        balances[from] -= amount;
        balances[to] += amount;
        allowances[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    // ============ MINT & BURN ============

    /**
     * @dev Mint rewards (hanya game contract)
     * TODO: Implement reward calculation logic (HOMEWORK!)
     */
    function mintReward(address to, uint256 amount) external onlyGameContract whenNotPaused {
        require(to != address(0), "Invalid recipient");

        // TODO: Add reward calculation logic here
        // TODO: Add max supply check
        // TODO: Add daily mint limit

        balances[to] += amount;
        totalSupply += amount;

        emit Transfer(address(0), to, amount);
    }

    /**
     * @dev Burn tokens
     * TODO: Implement burn requirements (HOMEWORK!)
     */
    function burn(uint256 amount) public whenNotPaused {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // TODO: Add burn cooldown
        // TODO: Add minimum burn amount
        // TODO: Track total burned for analytics

        balances[msg.sender] -= amount;
        totalSupply -= amount;

        emit Transfer(msg.sender, address(0), amount);
    }
}
```

---

### 2.13 What's Missing? (Homework Preview)

**GardenTokenSkeleton** adalah fondasi. Di **homework**, Anda akan menambahkan:

**1. Reward System**
```solidity
// Calculate reward based on plant rarity & time
function calculateReward(uint256 plantId) internal view returns (uint256)

// Daily mint limit to prevent inflation
mapping(uint256 => uint256) public dailyMintedAmount;
uint256 public constant MAX_DAILY_MINT = 10_000 * 10**18;
```

**2. Supply Management**
```solidity
// Max supply cap
uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;

// Check before minting
require(totalSupply + amount <= MAX_SUPPLY, "Exceeds max supply");
```

**3. Burn Mechanics**
```solidity
// Track total burned
uint256 public totalBurned;

// Burn cooldown per user
mapping(address => uint256) public lastBurnTime;
uint256 public constant BURN_COOLDOWN = 1 days;
```

**4. Analytics & Events**
```solidity
event RewardMinted(address indexed player, uint256 plantId, uint256 amount);
event TokensBurned(address indexed burner, uint256 amount);

// Get total circulating supply
function circulatingSupply() public view returns (uint256) {
    return totalSupply - balances[address(this)]; // Exclude treasury
}
```

---

## 2.14 Checkpoint Module 2

Pastikan Anda memahami:

**✅ Level 1 - Basic Token:**
- [ ] Transfer mechanism
- [ ] Balance tracking
- [ ] Events

**✅ Level 2 - Metadata:**
- [ ] Name, symbol, decimals
- [ ] Mengapa decimals = 18
- [ ] Wei calculation

**✅ Level 3 - Approval:**
- [ ] approve() function
- [ ] transferFrom() function
- [ ] allowance tracking
- [ ] Use case: DEX, DeFi

**✅ Level 4 - Mint/Burn:**
- [ ] Minting new tokens
- [ ] Burning tokens
- [ ] Supply management
- [ ] Inflationary vs deflationary

**✅ Level 5 - GardenToken:**
- [ ] Role-based access
- [ ] Pausable mechanism
- [ ] Game integration points
- [ ] What to complete in homework

**❓ Quiz:**

1. Mengapa `transfer` pakai `msg.sender` tapi `transferFrom` pakai parameter `from`?
2. Apa yang terjadi jika kita mint tanpa increase totalSupply?
3. Berikan 2 contoh kapan token perlu di-pause.

---

## 2.15 Deploy & Test Exercise

**Exercise: Deploy GardenTokenSkeleton**

```bash
# 1. Compile
npx hardhat compile

# 2. Deploy dengan 1 juta initial supply
npx hardhat ignition deploy ignition/modules/GardenToken.ts --network lisk-sepolia

# 3. Test di Hardhat Network (local)
npx hardhat test test/GardenTokenSkeleton.test.ts

# 4. Verify di Blockscout
npx hardhat verify --network lisk-sepolia [CONTRACT_ADDRESS] [INITIAL_SUPPLY]
```

**Expected Deliverable:**
- Contract deployed ke Lisk Sepolia
- Verified on Blockscout
- Address saved for Module 3

---

**🎯 Coming Up Next:**

**Modul 3**: Kita akan belajar **ERC-721 (NFT)** - token yang **tidak** fungible! Setiap token unik, punya ID sendiri. Perfect untuk PlantNFT di game kita! 🌱
## 📚 Modul 3: Memahami & Membangun ERC-721 NFT (13:30 - 15:00)

### Gambaran Modul

Di modul ini kita akan:
1. **Part A (30 menit)**: Memahami NFT & ERC-721 secara mendalam
2. **Part B (60 menit)**: Membangun NFT step-by-step

**Outcome**: Paham konsep NFT dan bisa build basic NFT contract

---

## PART A: Memahami NFT & ERC-721 (30 menit)

### 3.1 Apa Itu NFT?

#### Definisi

**NFT** = **Non-Fungible Token** = Token yang **tidak dapat ditukar 1:1** karena setiap token **unik**.

```
┌────────────────────────────────────────────────────┐
│  FUNGIBLE vs NON-FUNGIBLE                          │
│                                                     │
│  FUNGIBLE (ERC-20):                                │
│  💵 1 dolar = 1 dolar                              │
│  💵 10 GDN milik Ali = 10 GDN milik Budi           │
│  → Dapat ditukar 1:1, semua identik                │
│                                                     │
│  NON-FUNGIBLE (ERC-721):                           │
│  🖼️  NFT #1 ≠ NFT #2                               │
│  🏠 Rumah A ≠ Rumah B                              │
│  🎨 Lukisan Mona Lisa ≠ Lukisan Starry Night       │
│  → Tidak dapat ditukar 1:1, setiap token unik     │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Karakteristik NFT:**

```
✅ UNIQUE (Unik)
   Setiap NFT punya ID unik
   NFT #1 ≠ NFT #2 ≠ NFT #3

✅ INDIVISIBLE (Tidak dapat dibagi)
   Tidak bisa punya 0.5 NFT
   Ownership: 0 atau 1 (all or nothing)

✅ VERIFIABLE (Dapat diverifikasi)
   On-chain ownership proof
   History permanent di blockchain

✅ TRANSFERABLE (Dapat ditransfer)
   Dapat dijual, dihadiahkan, dipinjamkan
   Full ownership control
```

---

### 3.2 Apa Itu ERC-721?

**ERC-721** adalah **standard interface** untuk NFT di Ethereum dan EVM chains.

**History:**
- **Dibuat**: 2017 oleh Dieter Shirley (CryptoKitties)
- **Approved**: 2018 sebagai final standard
- **First big use**: CryptoKitties (viral pada 2017, clogged Ethereum!)

**Mengapa perlu ERC-721?**

```
❌ SEBELUM ERC-721:
   Setiap game/platform punya format NFT sendiri
   → NFT tidak compatible cross-platform
   → Marketplaces tidak bisa support semua NFT
   → User experience buruk

✅ DENGAN ERC-721:
   Satu standard untuk semua NFT
   → OpenSea bisa list semua ERC-721
   → Wallet otomatis support
   → Cross-platform compatible
```

---

### 3.3 ERC-721 vs ERC-20: Perbedaan Fundamental

| Aspek | ERC-20 | ERC-721 |
|-------|--------|---------|
| **Fungibility** | Fungible (identik) | Non-fungible (unik) |
| **Unit** | Amount (jumlah) | Token ID |
| **Ownership** | Balance (berapa) | Mapping (siapa pemilik ID berapa) |
| **Transfer** | `transfer(to, amount)` | `transferFrom(from, to, tokenId)` |
| **Divisibility** | Bisa dipecah (0.5 token) | Tidak bisa (1 NFT utuh) |
| **Use Case** | Currency, points | Art, collectibles, gaming items |

**Contoh:**

```solidity
// ERC-20: Track balances
mapping(address => uint256) balances;
balances[Alice] = 1000;  // Alice punya 1000 tokens

// ERC-721: Track ownership per ID
mapping(uint256 => address) owners;
owners[1] = Alice;  // Alice pemilik NFT #1
owners[2] = Bob;    // Bob pemilik NFT #2
owners[3] = Alice;  // Alice pemilik NFT #3
```

---

### 3.4 ERC-721 Interface (The Standard)

#### Interface Lengkap

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ERC-721 Non-Fungible Token Standard
 * @dev Interface yang WAJIB diimplementasikan
 */
interface IERC721 {

    // ============ EVENTS ============

    /**
     * @dev Emitted ketika `tokenId` dipindahkan dari `from` ke `to`
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted ketika `owner` approve `approved` untuk transfer `tokenId`
     */
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted ketika `owner` set/unset `operator` untuk semua tokennya
     */
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Returns jumlah NFT yang dimiliki `owner`
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns pemilik `tokenId`
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Returns address yang di-approve untuk transfer `tokenId`
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns apakah `operator` di-approve untuk semua token `owner`
     */
    function isApprovedForAll(
        address owner,
        address operator
    ) external view returns (bool);

    // ============ TRANSFER FUNCTIONS ============

    /**
     * @dev Transfer `tokenId` dari `from` ke `to`
     * Caller harus owner atau approved
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Safe transfer dengan check apakah `to` bisa receive NFT
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Safe transfer dengan data
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    // ============ APPROVAL FUNCTIONS ============

    /**
     * @dev Approve `to` untuk transfer `tokenId`
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Set approval untuk semua token
     */
    function setApprovalForAll(address operator, bool approved) external;
}
```

#### Penjelasan Fungsi Utama

**1. `balanceOf(address)` - Jumlah NFT yang Dimiliki**

```solidity
function balanceOf(address owner) external view returns (uint256);
```

**Perbedaan dengan ERC-20:**
- ERC-20: Returns **berapa token** (contoh: 1000)
- ERC-721: Returns **berapa NFT** (contoh: 5 NFT)

**Contoh:**
```solidity
// Alice owns NFT #1, #3, #7
balanceOf(Alice); // returns: 3

// Bob owns NFT #2
balanceOf(Bob); // returns: 1
```

**Use Case:**
- Cek apakah user punya minimal 1 NFT (membership)
- Leaderboard berdasarkan jumlah NFT
- UI: "You own 5 Plants"

---

**2. `ownerOf(uint256)` - Siapa Pemilik NFT Ini?**

```solidity
function ownerOf(uint256 tokenId) external view returns (address);
```

**Core function NFT!** Ini yang membedakan ERC-721 dari ERC-20.

**Contoh:**
```solidity
// Cek siapa pemilik NFT #42
ownerOf(42); // returns: 0x123...abc (Alice's address)

// Cek siapa pemilik NFT #99
ownerOf(99); // returns: 0x456...def (Bob's address)

// Token doesn't exist
ownerOf(999); // reverts: "ERC721: invalid token ID"
```

**Use Case:**
- Verifikasi ownership sebelum aksi (harvest plant)
- Display owner di marketplace
- Access control (hanya owner bisa upgrade)

---

**3. `transferFrom()` - Transfer NFT**

```solidity
function transferFrom(address from, address to, uint256 tokenId) external;
```

**Perbedaan dengan ERC-20:**
- ERC-20: `transferFrom(from, to, amount)` - transfer sejumlah token
- ERC-721: `transferFrom(from, to, tokenId)` - transfer 1 spesifik NFT

**Flow:**
```
Before:
owners[42] = Alice

Alice calls: transferFrom(Alice, Bob, 42)
OR
Marketplace calls: transferFrom(Alice, Bob, 42)  // if approved

After:
owners[42] = Bob
```

---

**4. `approve()` - Approve Specific NFT**

```solidity
function approve(address to, uint256 tokenId) external;
```

**Approval untuk 1 NFT spesifik.**

**Contoh:**
```solidity
// Alice approve OpenSea untuk jual NFT #42
approve(OpenSeaAddress, 42);

// Sekarang OpenSea boleh transfer NFT #42 milik Alice
```

**Use Case:**
- List NFT di marketplace
- Escrow untuk trade
- Lending protocol

---

**5. `setApprovalForAll()` - Approve Semua NFT**

```solidity
function setApprovalForAll(address operator, bool approved) external;
```

**Approval untuk SEMUA NFT milik caller.**

**Contoh:**
```solidity
// Alice approve OpenSea untuk semua NFT-nya
setApprovalForAll(OpenSeaAddress, true);

// Sekarang OpenSea bisa transfer NFT #1, #3, #7, dst milik Alice
```

**Use Case:**
- List multiple NFT di marketplace sekaligus
- Delegate management ke contract
- Bulk operations

**⚠️ Security Warning:**

```
setApprovalForAll sangat powerful!

✅ AMAN:
- Approve ke marketplace terpercaya (OpenSea, Blur)
- Approve ke game contract yang sudah diaudit

❌ BAHAYA:
- Approve ke contract yang tidak dikenal
- Phishing site yang minta approval
- Jika approved contract vulnerable → ALL NFT bisa dicuri!
```

---

**6. `safeTransferFrom()` - Transfer dengan Safety Check**

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external;
```

**Perbedaan `transferFrom` vs `safeTransferFrom`:**

```solidity
// transferFrom: Tidak cek apakah recipient bisa handle NFT
transferFrom(Alice, ContractX, 42);
→ Jika ContractX tidak bisa handle NFT → NFT stuck forever! 💀

// safeTransferFrom: Cek apakah recipient bisa receive NFT
safeTransferFrom(Alice, ContractX, 42);
→ Jika ContractX tidak implement onERC721Received → REVERT ✅
```

**Best Practice:**
```solidity
// ❌ DON'T
transferFrom(from, to, tokenId);  // Risky!

// ✅ DO
safeTransferFrom(from, to, tokenId);  // Safe!
```

---

### 3.5 Real-World Use Cases ERC-721

#### A. Use Cases Global

**1. Digital Art & Collectibles**

| Project | Description | Impact |
|---------|-------------|--------|
| **Bored Ape Yacht Club (BAYC)** | 10,000 unique ape NFTs | Floor price: ~30 ETH ($50K) |
| **CryptoPunks** | First NFT project (2017) | Most expensive sold: $23.7M |
| **Art Blocks** | Generative art NFTs | Artists earned $1B+ |

**Mengapa penting:**
- Artists dapat royalty selamanya (on-chain)
- Provenance terverifikasi (authentic vs fake)
- Global marketplace 24/7

**2. Gaming Items**

| Game | NFT Use | Economy |
|------|---------|---------|
| **Axie Infinity** | Creatures (Axies) untuk battle | Peak: $4B trading volume |
| **The Sandbox** | Virtual land parcels | Land sold up to $450K |
| **Gods Unchained** | Trading cards | Play-to-earn model |

**Gameplay:**
```
Traditional Game:
- Buy item → tersimpan di server game
- Game shutdown → item hilang
- Tidak bisa trade ke pemain lain

NFT Game:
- Buy item → tersimpan di wallet Anda
- Game shutdown → item tetap punya nilai
- Bisa dijual di marketplace apapun
```

**3. Real Estate (Virtual & Physical)**

| Platform | Type | Example |
|----------|------|---------|
| **Decentraland** | Virtual land | Land sold for $2.4M |
| **Propy** | Physical property | House NFT sold for $650K |
| **RealT** | Fractional real estate | Own fraction of real property |

**4. Membership & Access**

| Project | Use | Benefit |
|---------|-----|---------|
| **VeeFriends** | Gary Vee conference access | Lifetime VeeCon tickets |
| **Flyfish Club** | Restaurant membership | Exclusive dining access in NYC |
| **LinksDAO** | Golf club membership | Access to golf courses |

**Contoh:**
```solidity
contract VIPClub {
    IERC721 public membershipNFT;

    modifier onlyMembers() {
        require(membershipNFT.balanceOf(msg.sender) > 0, "Not a member");
        _;
    }

    function accessVIPLounge() external onlyMembers {
        // Only NFT holders can access
    }
}
```

**5. Identity & Credentials**

| Use Case | Description | Example |
|----------|-------------|---------|
| **Diploma** | Educational certificates | MIT diploma sebagai NFT |
| **Licenses** | Professional licenses | Doctor/lawyer licenses |
| **Achievements** | Proof of achievement | Hackathon winner badge |

---

#### B. Use Cases Lokal Indonesia

**1. Sertifikat Tanah Digital**

```
Problem Tradisional:
❌ Sertifikat palsu
❌ Double certificate (sertifikat ganda)
❌ Lost/damaged physical certificate
❌ Birokrasi panjang transfer ownership

Dengan ERC-721:
✅ Sertifikat on-chain, tidak bisa dipalsukan
✅ One token ID = one property (tidak bisa duplikat)
✅ Permanent record di blockchain
✅ Transfer ownership instant

Implementation:
contract TanahNFT is ERC721 {
    struct TanahMetadata {
        string alamat;
        uint256 luasTanah;  // m²
        string nomorSertifikat;
        uint256 tahunTerbit;
    }

    mapping(uint256 => TanahMetadata) public tanahData;

    function mintSertifikat(
        address pemilik,
        TanahMetadata memory data
    ) external onlyBPN {
        // BPN (Badan Pertanahan Nasional) mint NFT
        uint256 tokenId = nextTokenId++;
        _mint(pemilik, tokenId);
        tanahData[tokenId] = data;
    }
}
```

**2. Event Tickets (Konser, Festival)**

```
Problem:
❌ Tiket palsu (scam)
❌ Scalper (calo) mark-up harga
❌ Tidak bisa resell dengan aman

Dengan NFT:
✅ Authenticity guaranteed
✅ Resell dengan smart contract (organizer dapat royalty)
✅ Transfer terverifikasi
✅ QR code on-chain

Use Case: Java Jazz, Djakarta Warehouse Project, We The Fest

contract EventTicketNFT is ERC721 {
    struct Ticket {
        string eventName;
        uint256 eventDate;
        string seatNumber;
        bool used;  // Sudah dipakai masuk
    }

    mapping(uint256 => Ticket) public tickets;

    // Limit resell price (max 2x original)
    uint256 public constant MAX_RESELL_MULTIPLIER = 2;

    function checkIn(uint256 tokenId) external onlyEventOrganizer {
        require(!tickets[tokenId].used, "Ticket already used");
        tickets[tokenId].used = true;
    }
}
```

**3. Batik & Kerajinan Indonesia**

```
Problem:
❌ Batik cap dipalsukan sebagai batik tulis
❌ Tidak ada certificate of authenticity
❌ Artist tidak dapat royalty dari resale

Dengan NFT:
✅ Certificate of authenticity on-chain
✅ Track provenance (dari artist asli)
✅ Artist dapat royalty 10% setiap resale
✅ Preserve cultural heritage

contract BatikNFT is ERC721Royalty {
    struct BatikMetadata {
        string namaBatik;
        string daerahAsal;
        string pengrajin;
        string teknik;  // "Tulis" atau "Cap"
        uint256 tanggalDibuat;
    }

    // Set royalty 10% ke pengrajin
    function mintBatik(
        address pengrajin,
        BatikMetadata memory data
    ) external {
        uint256 tokenId = nextTokenId++;
        _mint(pengrajin, tokenId);
        _setTokenRoyalty(tokenId, pengrajin, 1000); // 10%
    }
}
```

**4. Student Achievements (Kampus)**

```
Use Case: BINUS, UI, ITB

Skenario:
- Juara lomba → NFT badge
- Lulus cum laude → NFT diploma
- Research publication → NFT certificate
- Volunteer hours → NFT appreciation

Benefit:
✅ Verifiable credentials (employer bisa verify on-chain)
✅ Tidak bisa dipalsukan
✅ Portable (bawa kemana-mana)
✅ Gamification (collect achievements)

contract StudentAchievementNFT is ERC721 {
    struct Achievement {
        string achievementType;  // "Juara 1 Hackathon"
        string institution;       // "BINUS University"
        uint256 date;
        string verifier;          // Who verified this
    }

    mapping(uint256 => Achievement) public achievements;

    // Employer dapat verify
    function verifyAchievement(uint256 tokenId)
        external
        view
        returns (Achievement memory)
    {
        return achievements[tokenId];
    }
}
```

**5. Wayang & Seni Tradisional**

```
Problem:
- Wayang kulit mahal dan fragile
- Generasi muda tidak familiar
- Sulit preserve cultural heritage

Dengan NFT:
✅ Digital preservation of wayang characters
✅ Gamification (collect all wayang characters)
✅ Educational (metadata explain story)
✅ Monetization untuk dalang/seniman

contract WayangNFT is ERC721 {
    struct WayangCharacter {
        string nama;             // "Arjuna", "Bima"
        string cerita;           // "Mahabharata"
        string karakteristik;    // Traits
        string dalangCreator;    // Seniman
        string audioURL;         // Suara dalang
    }

    // Special collections
    mapping(address => bool) public hasCompletePandawa;  // Koleksi 5 Pandawa

    function checkPandawaCollection(address owner) external {
        // If user punya semua 5 Pandawa → unlock special content
    }
}
```

---

### 3.6 NFT Metadata: On-Chain vs Off-Chain

**Metadata** adalah data tentang NFT (gambar, properties, description).

#### On-Chain Metadata

```solidity
// Data tersimpan di contract
contract OnChainNFT is ERC721 {
    struct Metadata {
        string name;
        string description;
        uint8 rarity;
    }

    mapping(uint256 => Metadata) public metadata;
}
```

**✅ Pros:**
- Permanent (tidak bisa hilang)
- Fully decentralized
- Always available

**❌ Cons:**
- Gas expensive (store data on-chain mahal!)
- Limited size (tidak bisa simpan gambar besar)
- Tidak flexible (sulit update)

#### Off-Chain Metadata (dengan IPFS)

```solidity
// Data tersimpan di IPFS, contract hanya simpan hash
contract OffChainNFT is ERC721URIStorage {
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return string(abi.encodePacked(
            "ipfs://QmXyz.../",
            Strings.toString(tokenId),
            ".json"
        ));
    }
}
```

**Metadata JSON di IPFS:**
```json
{
  "name": "Plant #42",
  "description": "A rare golden orchid",
  "image": "ipfs://QmAbc.../42.png",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Species",
      "value": "Golden Orchid"
    }
  ]
}
```

**✅ Pros:**
- Gas efficient
- Bisa simpan gambar/video besar
- Flexible metadata

**⚠️ Cons:**
- Depends on IPFS availability
- Perlu IPFS pinning service

**Best Practice:**
```
Critical data → On-chain (ownership, core properties)
Rich media → Off-chain IPFS (images, descriptions)
```

---

## PART B: Membangun ERC-721 Step-by-Step (60 menit)

### 3.7 Level 1: Basic NFT Contract

Mari kita mulai dari NFT paling sederhana.

**Buat file: `contracts/BasicNFT.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title BasicNFT
 * @dev NFT paling sederhana - mint & transfer saja
 */
contract BasicNFT {

    // ============ STATE VARIABLES ============

    /**
     * @dev Mapping dari token ID ke owner address
     */
    mapping(uint256 => address) public owners;

    /**
     * @dev Mapping dari owner address ke jumlah NFT
     */
    mapping(address => uint256) public balances;

    /**
     * @dev Counter untuk token ID berikutnya
     */
    uint256 public nextTokenId;

    // ============ EVENTS ============

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // ============ FUNCTIONS ============

    /**
     * @dev Mint NFT baru
     * @param to Recipient address
     * @return tokenId The ID of minted NFT
     */
    function mint(address to) external returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");

        // Get next token ID
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        // Set owner
        owners[tokenId] = to;

        // Increase balance
        balances[to]++;

        // Emit transfer from address(0) = minting
        emit Transfer(address(0), to, tokenId);

        return tokenId;
    }

    /**
     * @dev Transfer NFT
     * @param to Recipient
     * @param tokenId NFT to transfer
     */
    function transfer(address to, uint256 tokenId) external {
        // Check ownership
        require(owners[tokenId] == msg.sender, "Not owner");
        require(to != address(0), "Cannot transfer to zero address");

        address from = msg.sender;

        // Update ownership
        owners[tokenId] = to;

        // Update balances
        balances[from]--;
        balances[to]++;

        // Emit event
        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Get owner of token
     */
    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = owners[tokenId];
        require(owner != address(0), "Token doesn't exist");
        return owner;
    }

    /**
     * @dev Get balance of address
     */
    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "Invalid address");
        return balances[owner];
    }
}
```

### Penjelasan

**1. State Variables**

```solidity
mapping(uint256 => address) public owners;
```
- Key: `tokenId` (uint256)
- Value: `address` of owner
- Contoh: `owners[1] = 0x123...abc` (Alice owns NFT #1)

```solidity
mapping(address => uint256) public balances;
```
- Key: `address`
- Value: jumlah NFT yang dimiliki
- Contoh: `balances[Alice] = 5` (Alice punya 5 NFTs)

```solidity
uint256 public nextTokenId;
```
- Auto-increment counter
- Start from 0
- Setiap mint, nextTokenId++

**2. Mint Function**

```solidity
function mint(address to) external returns (uint256) {
    uint256 tokenId = nextTokenId;  // Get current ID
    nextTokenId++;                   // Increment for next mint

    owners[tokenId] = to;            // Set owner
    balances[to]++;                  // Increase balance

    emit Transfer(address(0), to, tokenId);
    return tokenId;
}
```

**Flow:**
```
Initial state:
nextTokenId = 0

Alice calls: mint(Alice)
→ tokenId = 0
→ owners[0] = Alice
→ balances[Alice] = 1
→ nextTokenId = 1

Bob calls: mint(Bob)
→ tokenId = 1
→ owners[1] = Bob
→ balances[Bob] = 1
→ nextTokenId = 2
```

---

### 3.8 Level 2: NFT dengan OpenZeppelin

Membuat NFT dari scratch risky. Gunakan OpenZeppelin yang sudah battle-tested!

**Install OpenZeppelin:**

```bash
npm install --save-dev @openzeppelin/contracts
```

**Buat file: `contracts/SimpleNFT.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title SimpleNFT
 * @dev NFT menggunakan OpenZeppelin ERC721
 */
contract SimpleNFT is ERC721 {

    uint256 private _nextTokenId;

    /**
     * @dev Constructor set name & symbol
     */
    constructor() ERC721("Simple NFT", "SNFT") {}

    /**
     * @dev Mint NFT (anyone can mint)
     */
    function mint(address to) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        return tokenId;
    }
}
```

**Penjelasan:**

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
```
- Import ERC721 base contract dari OpenZeppelin
- Sudah implement semua fungsi wajib
- Sudah diaudit dan battle-tested

```solidity
contract SimpleNFT is ERC721 {
```
- `is ERC721` = inheritance (turunan dari ERC721)
- SimpleNFT otomatis punya semua fungsi ERC721

```solidity
constructor() ERC721("Simple NFT", "SNFT") {}
```
- `ERC721(name, symbol)` = constructor parent contract
- Name: "Simple NFT"
- Symbol: "SNFT"

**Apa yang sudah tersedia otomatis:**
- ✅ `balanceOf()`
- ✅ `ownerOf()`
- ✅ `transferFrom()`
- ✅ `safeTransferFrom()`
- ✅ `approve()`
- ✅ `setApprovalForAll()`
- ✅ `getApproved()`
- ✅ `isApprovedForAll()`

---

### 3.9 Level 3: NFT dengan Metadata

Sekarang kita tambahkan metadata untuk setiap NFT.

**Buat file: `contracts/MetadataNFT.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MetadataNFT
 * @dev NFT dengan on-chain metadata
 */
contract MetadataNFT is ERC721 {

    uint256 private _nextTokenId;

    /**
     * @dev Metadata struct
     */
    struct TokenMetadata {
        string name;
        string description;
        uint8 rarity;  // 1-5
    }

    /**
     * @dev Mapping token ID ke metadata
     */
    mapping(uint256 => TokenMetadata) public tokenMetadata;

    // ============ EVENTS ============

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        uint8 rarity
    );

    // ============ CONSTRUCTOR ============

    constructor() ERC721("Metadata NFT", "MNFT") {}

    // ============ MINT FUNCTION ============

    /**
     * @dev Mint NFT dengan metadata
     */
    function mint(
        address to,
        string memory name,
        string memory description,
        uint8 rarity
    ) external returns (uint256) {
        require(to != address(0), "Invalid address");
        require(rarity >= 1 && rarity <= 5, "Rarity must be 1-5");
        require(bytes(name).length > 0, "Name required");

        // Mint NFT
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);

        // Set metadata
        tokenMetadata[tokenId] = TokenMetadata({
            name: name,
            description: description,
            rarity: rarity
        });

        // Emit event
        emit NFTMinted(tokenId, to, name, rarity);

        return tokenId;
    }

    /**
     * @dev Get metadata
     */
    function getMetadata(uint256 tokenId)
        external
        view
        returns (TokenMetadata memory)
    {
        require(ownerOf(tokenId) != address(0), "Token doesn't exist");
        return tokenMetadata[tokenId];
    }
}
```

**Penggunaan:**

```solidity
// Mint NFT dengan metadata
mint(
    AliceAddress,
    "Golden Rose",           // name
    "A rare golden rose",    // description
    5                         // rarity (1-5)
);

// Get metadata
TokenMetadata memory metadata = getMetadata(tokenId);
console.log(metadata.name);      // "Golden Rose"
console.log(metadata.rarity);    // 5
```

---

### 3.10 Level 4: PlantNFT Skeleton (Foundation)

Sekarang kita mulai membangun **PlantNFT** untuk game LiskGarden. Ini adalah **skeleton** - full implementation jadi **homework!**

**Buat file: `contracts/PlantNFTSkeleton.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PlantNFTSkeleton
 * @dev Foundation untuk PlantNFT - akan dilengkapi di homework
 */
contract PlantNFTSkeleton is ERC721, Ownable {

    uint256 private _nextTokenId;

    // ============ PLANT METADATA ============

    struct PlantMetadata {
        string name;              // Nama tanaman
        string species;           // Jenis (Rose, Orchid, etc)
        uint256 plantedAt;        // Timestamp ditanam
        uint8 rarity;             // 1-5
        uint256 lastWatered;      // Timestamp terakhir disiram
        uint256 growthStage;      // 0=seed, 1=sprout, 2=growing, 3=mature
    }

    mapping(uint256 => PlantMetadata) public plants;

    /**
     * @dev Game contract yang boleh interact
     */
    address public gameContract;

    // ============ EVENTS ============

    event PlantMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string species,
        uint8 rarity
    );

    event PlantWatered(uint256 indexed tokenId, uint256 timestamp);

    event PlantGrown(uint256 indexed tokenId, uint256 newStage);

    // ============ MODIFIERS ============

    modifier onlyGameContract() {
        require(msg.sender == gameContract, "Only game contract");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor() ERC721("Lisk Garden Plant", "PLANT") Ownable(msg.sender) {}

    // ============ ADMIN FUNCTIONS ============

    function setGameContract(address _gameContract) external onlyOwner {
        require(_gameContract != address(0), "Invalid address");
        gameContract = _gameContract;
    }

    // ============ MINT FUNCTION ============

    /**
     * @dev Mint plant NFT
     * TODO: Add minting cost (HOMEWORK!)
     * TODO: Add rarity probability (HOMEWORK!)
     */
    function mintPlant(
        address to,
        string memory name,
        string memory species,
        uint8 rarity
    ) external returns (uint256) {
        require(to != address(0), "Invalid address");
        require(rarity >= 1 && rarity <= 5, "Invalid rarity");

        // TODO: Require payment (ETH or GardenToken)
        // TODO: Calculate rarity based on random

        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);

        plants[tokenId] = PlantMetadata({
            name: name,
            species: species,
            plantedAt: block.timestamp,
            rarity: rarity,
            lastWatered: block.timestamp,
            growthStage: 0  // Start as seed
        });

        emit PlantMinted(tokenId, to, species, rarity);

        return tokenId;
    }

    // ============ GAME FUNCTIONS ============

    /**
     * @dev Water plant
     * TODO: Add water cooldown (HOMEWORK!)
     * TODO: Add boost items integration (HOMEWORK!)
     */
    function waterPlant(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");

        // TODO: Check cooldown (ex: 1 water per day)
        // TODO: Check if plant needs water

        plants[tokenId].lastWatered = block.timestamp;

        emit PlantWatered(tokenId, block.timestamp);

        // TODO: Maybe trigger growth (HOMEWORK!)
    }

    /**
     * @dev Grow plant to next stage
     * TODO: Add growth requirements (HOMEWORK!)
     * TODO: Add time-based growth (HOMEWORK!)
     */
    function growPlant(uint256 tokenId) external onlyGameContract {
        require(plants[tokenId].growthStage < 3, "Already mature");

        // TODO: Check growth requirements:
        // - Time since planted
        // - Number of waterings
        // - Used fertilizer items?

        plants[tokenId].growthStage++;

        emit PlantGrown(tokenId, plants[tokenId].growthStage);
    }

    // ============ VIEW FUNCTIONS ============

    function getPlant(uint256 tokenId)
        external
        view
        returns (PlantMetadata memory)
    {
        require(ownerOf(tokenId) != address(0), "Token doesn't exist");
        return plants[tokenId];
    }

    /**
     * @dev Get all plants owned by address
     * TODO: Optimize for large collections (HOMEWORK!)
     */
    function getPlantsOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory ownedTokens = new uint256[](balance);

        uint256 index = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_ownerOf(i) == owner) {
                ownedTokens[index] = i;
                index++;
            }
        }

        return ownedTokens;
    }
}
```

---

### 3.11 What's Missing? (Homework Preview)

**PlantNFTSkeleton** adalah fondasi. Di **homework**, Anda akan menambahkan:

**1. Minting Cost & Probability**

```solidity
// Minting cost in ETH
uint256 public constant MINT_COST = 0.001 ether;

// Rarity probability
// 60% Common, 25% Rare, 10% Epic, 4% Legendary, 1% Mythic

function mintPlant() external payable {
    require(msg.value >= MINT_COST, "Insufficient payment");

    uint8 rarity = _calculateRarity(); // Random dengan VRF atau blockhash
    // ...
}
```

**2. Growth Mechanics**

```solidity
// Growth requirements
uint256 public constant GROWTH_TIME = 1 days;
uint256 public constant WATERINGS_REQUIRED = 3;

function canGrow(uint256 tokenId) public view returns (bool) {
    PlantMetadata memory plant = plants[tokenId];

    // Check time
    if (block.timestamp - plant.plantedAt < GROWTH_TIME) return false;

    // Check waterings
    if (waterCount[tokenId] < WATERINGS_REQUIRED) return false;

    return true;
}
```

**3. Rewards Integration**

```solidity
// Harvest rewards (GardenToken)
function harvestPlant(uint256 tokenId) external {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    require(plants[tokenId].growthStage == 3, "Not mature");

    uint256 reward = calculateReward(tokenId);
    gardenToken.mintReward(msg.sender, reward);

    // Reset growth or allow continuous harvest
}
```

**4. Items Integration (ERC-1155)**

```solidity
// Use fertilizer item to boost growth
function useFertilizer(uint256 plantId, uint256 itemId) external {
    require(ownerOf(plantId) == msg.sender, "Not owner");
    require(gameItems.balanceOf(msg.sender, itemId) > 0, "No item");

    gameItems.burn(msg.sender, itemId, 1); // Burn item
    growthBoost[plantId] = 2; // 2x growth speed
}
```

---

## 3.12 Checkpoint Module 3

Pastikan Anda memahami:

**✅ Konsep NFT:**
- [ ] Fungible vs non-fungible
- [ ] Karakteristik NFT (unique, indivisible, verifiable)
- [ ] Use cases NFT (art, gaming, real estate, membership)

**✅ ERC-721 Standard:**
- [ ] `ownerOf(tokenId)` - cek pemilik
- [ ] `balanceOf(address)` - cek jumlah NFT
- [ ] `transferFrom()` vs `safeTransferFrom()`
- [ ] `approve()` vs `setApprovalForAll()`

**✅ Metadata:**
- [ ] On-chain vs off-chain
- [ ] IPFS untuk storage
- [ ] Metadata structure (JSON)

**✅ Building NFT:**
- [ ] Basic NFT structure
- [ ] OpenZeppelin ERC721
- [ ] On-chain metadata
- [ ] PlantNFT skeleton

**❓ Quiz:**

1. Apa perbedaan `approve()` dan `setApprovalForAll()`?
2. Mengapa `safeTransferFrom()` lebih aman dari `transferFrom()`?
3. Berikan 1 contoh use case NFT di Indonesia selain yang disebutkan.

---

**🎯 Coming Up Next:**

**Modul 4**: Kita akan belajar **ERC-1155** - multi-token standard! Satu contract untuk BANYAK jenis token (fungible + non-fungible)! Perfect untuk game items! 🎮
## 📚 Modul 4: Memahami & Membangun ERC-1155 (15:15 - 16:45)

### Gambaran Modul

Di modul ini kita akan:
1. **Part A (30 menit)**: Memahami ERC-1155 dan Multi-Token Standard
2. **Part B (60 menit)**: Membangun ERC-1155 step-by-step

**Outcome**: Paham konsep multi-token dan bisa build game items system

---

## PART A: Memahami ERC-1155 Multi-Token Standard (30 menit)

### 4.1 Apa Itu ERC-1155?

#### Definisi

**ERC-1155** adalah **multi-token standard** yang dapat mengelola **berbagai jenis token** (fungible dan non-fungible) dalam **satu contract**.

```
┌────────────────────────────────────────────────────┐
│  TOKEN STANDARDS COMPARISON                         │
│                                                     │
│  ERC-20:    1 contract = 1 token type (fungible)  │
│             Contoh: GardenToken contract           │
│                                                     │
│  ERC-721:   1 contract = 1 collection (NFTs)       │
│             Contoh: PlantNFT contract              │
│                                                     │
│  ERC-1155:  1 contract = BANYAK token types!       │
│             Contoh: GameItems contract             │
│             - ID 0: Sword (fungible, 1000 supply)  │
│             - ID 1: Shield (fungible, 500 supply)  │
│             - ID 2: Legendary Sword (NFT, 1 supply)│
│             - ID 3: Common Potion (fungible, 10K)  │
│                                                     │
└────────────────────────────────────────────────────┘
```

**History:**
- **Dibuat**: 2018 oleh Witek Radomski (Enjin)
- **Motivation**: Efficiency untuk gaming
- **Approved**: 2019 sebagai final standard

---

### 4.2 Mengapa Butuh ERC-1155?

#### Problem: Gaming dengan ERC-20 & ERC-721

Bayangkan game seperti LiskGarden dengan 100 item types:

**❌ Dengan ERC-721 (1 contract per item type):**

```
Item Management:
- Sword NFT contract
- Shield NFT contract
- Potion NFT contract
- ... (97 contracts lainnya!)

Problems:
❌ Deploy 100 contracts = gas cost sangat mahal!
❌ Player must approve 100 contracts
❌ Transfer 10 items = 10 transactions
❌ Management nightmare
```

**❌ Dengan ERC-20 (untuk fungible items):**

```
Item Management:
- Potion Token (ERC-20)
- Arrow Token (ERC-20)
- Wood Token (ERC-20)
- ... (50+ contracts untuk consumables!)

Problems:
❌ Masih banyak contracts
❌ Tidak bisa mix fungible + non-fungible
❌ Inventory management complex
```

**✅ Dengan ERC-1155:**

```
Item Management:
- GameItems contract (1 contract SAJA!)
  ├── ID 0: Wooden Sword (fungible)
  ├── ID 1: Steel Sword (fungible)
  ├── ID 2: Legendary Excalibur (NFT, supply 1)
  ├── ID 3: Health Potion (fungible)
  └── ... (semua items dalam 1 contract!)

Benefits:
✅ 1 contract untuk semua items
✅ 1 approval untuk semua
✅ Batch transfer (gas efficient!)
✅ Mix fungible + non-fungible
```

---

### 4.3 ERC-1155 Key Features

#### 1. Multi-Token dalam 1 Contract

```solidity
// ERC-20: 1 contract = 1 token
balances[Alice] = 1000 GDN

// ERC-721: 1 contract = many NFTs (tapi 1 collection)
owners[tokenId] = Alice

// ERC-1155: 1 contract = banyak token TYPES
balances[Alice][0] = 50;   // Alice punya 50 Wooden Swords
balances[Alice][1] = 30;   // Alice punya 30 Steel Swords
balances[Alice][2] = 1;    // Alice punya 1 Legendary Sword
balances[Alice][3] = 100;  // Alice punya 100 Health Potions
```

#### 2. Batch Operations

```solidity
// Transfer banyak items sekaligus (1 transaction!)
safeBatchTransferFrom(
    Alice,
    Bob,
    [0, 1, 3],        // IDs: Wooden Sword, Steel Sword, Potion
    [10, 5, 20],      // Amounts
    ""
);

// Dibanding ERC-721: butuh 3 transactions
transferFrom(Alice, Bob, tokenId1);  // Tx 1
transferFrom(Alice, Bob, tokenId2);  // Tx 2
transferFrom(Alice, Bob, tokenId3);  // Tx 3
```

**Gas Comparison:**

| Operation | ERC-721 | ERC-1155 | Saving |
|-----------|---------|----------|--------|
| Transfer 1 item | 50,000 gas | 50,000 gas | 0% |
| Transfer 10 items | 500,000 gas | 150,000 gas | **70%!** |
| Transfer 100 items | 5,000,000 gas | 800,000 gas | **84%!** |

#### 3. Fungible & Non-Fungible dalam 1 Contract

```solidity
// Fungible: Supply > 1
createToken(0, 1000);  // ID 0: 1000 Wooden Swords (fungible)

// Non-Fungible: Supply = 1
createToken(1, 1);     // ID 1: 1 Legendary Sword (NFT)

// Semi-Fungible: Limited supply
createToken(2, 10);    // ID 2: 10 Epic Shields (limited edition)
```

---

### 4.4 ERC-1155 Interface

#### Interface Lengkap

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ERC-1155 Multi-Token Standard
 * @dev Interface yang WAJIB diimplementasikan
 */
interface IERC1155 {

    // ============ EVENTS ============

    /**
     * @dev Emitted ketika `value` token type `id` ditransfer dari `from` ke `to`
     */
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    /**
     * @dev Emitted ketika batch transfer
     */
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    /**
     * @dev Emitted ketika approval
     */
    event ApprovalForAll(
        address indexed account,
        address indexed operator,
        bool approved
    );

    /**
     * @dev Emitted ketika URI berubah
     */
    event URI(string value, uint256 indexed id);

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Returns balance token `id` milik `account`
     */
    function balanceOf(
        address account,
        uint256 id
    ) external view returns (uint256);

    /**
     * @dev Returns batch balances
     * Efficient untuk cek multiple items sekaligus
     */
    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) external view returns (uint256[] memory);

    /**
     * @dev Returns apakah `operator` di-approve untuk semua token `account`
     */
    function isApprovedForAll(
        address account,
        address operator
    ) external view returns (bool);

    // ============ TRANSFER FUNCTIONS ============

    /**
     * @dev Transfer token type `id` sejumlah `amount`
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    /**
     * @dev Batch transfer banyak token types sekaligus
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;

    // ============ APPROVAL FUNCTIONS ============

    /**
     * @dev Set approval untuk semua token
     * (Tidak ada per-token approval seperti ERC-721!)
     */
    function setApprovalForAll(address operator, bool approved) external;
}
```

#### Penjelasan Fungsi Utama

**1. `balanceOf(address, uint256)` - Cek Balance Specific Item**

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256);
```

**Perbedaan dengan standar lain:**

```solidity
// ERC-20: balanceOf(address) → total tokens
balanceOf(Alice);  // 1000 GDN

// ERC-721: balanceOf(address) → jumlah NFTs
balanceOf(Alice);  // 5 NFTs

// ERC-1155: balanceOf(address, id) → balance for specific item
balanceOf(Alice, 0);  // 50 Wooden Swords
balanceOf(Alice, 1);  // 30 Steel Swords
balanceOf(Alice, 2);  // 1 Legendary Sword
```

**Use Case:**
```solidity
// Check if player has enough potions
require(balanceOf(msg.sender, POTION_ID) >= 5, "Need 5 potions");
```

---

**2. `balanceOfBatch()` - Cek Multiple Balances Sekaligus**

```solidity
function balanceOfBatch(
    address[] calldata accounts,
    uint256[] calldata ids
) external view returns (uint256[] memory);
```

**Super efficient untuk inventory!**

```solidity
// Check inventory untuk 1 player, multiple items
address[] memory accounts = [Alice, Alice, Alice];
uint256[] memory ids = [0, 1, 2];  // Sword, Shield, Potion

uint256[] memory balances = balanceOfBatch(accounts, ids);
// Returns: [50, 30, 100]

// Atau check 1 item across multiple players
address[] memory players = [Alice, Bob, Charlie];
uint256[] memory itemIds = [0, 0, 0];  // Wooden Sword

uint256[] memory amounts = balanceOfBatch(players, itemIds);
// Returns: [50, 20, 15]  (each player's Wooden Sword balance)
```

---

**3. `safeTransferFrom()` - Transfer Satu Item**

```solidity
function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes calldata data
) external;
```

**Contoh:**

```solidity
// Alice transfer 10 Wooden Swords ke Bob
safeTransferFrom(
    Alice,
    Bob,
    0,      // ID: Wooden Sword
    10,     // Amount
    ""      // Data (usually empty)
);

// Before:
// balanceOf(Alice, 0) = 50
// balanceOf(Bob, 0) = 20

// After:
// balanceOf(Alice, 0) = 40
// balanceOf(Bob, 0) = 30
```

---

**4. `safeBatchTransferFrom()` - Transfer Banyak Items Sekaligus!**

```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata data
) external;
```

**Ini yang membuat ERC-1155 powerful!**

```solidity
// Alice kirim full equipment set ke Bob (1 transaction!)
safeBatchTransferFrom(
    Alice,
    Bob,
    [0, 1, 2, 3],           // IDs: Sword, Shield, Helmet, Armor
    [1, 1, 1, 1],           // Amounts: 1 each
    ""
);

// Atau Alice jual inventory ke marketplace
safeBatchTransferFrom(
    Alice,
    Marketplace,
    [0, 3, 5],              // IDs: Swords, Potions, Arrows
    [10, 50, 100],          // Amounts
    ""
);
```

**Gas Efficiency:**
- 1 transaction instead of 4
- ~70% gas saving
- Better UX (single approval)

---

**5. `setApprovalForAll()` - Approve Semua Items**

```solidity
function setApprovalForAll(address operator, bool approved) external;
```

**Catatan Penting:**

```
ERC-721: Bisa approve per NFT (approve) atau semua (setApprovalForAll)
ERC-1155: HANYA setApprovalForAll (all or nothing!)

Alasan: Karena multi-token, per-item approval tidak efisien
```

**Contoh:**

```solidity
// Alice approve marketplace untuk semua items
setApprovalForAll(MarketplaceAddress, true);

// Sekarang marketplace bisa transfer items apapun milik Alice:
// - Swords
// - Potions
// - Armors
// - Everything!
```

---

### 4.5 Real-World Use Cases ERC-1155

#### A. Use Cases Global

**1. Gaming (Mayoritas Use Case!)**

| Game | Items | Token Types |
|------|-------|-------------|
| **Enjin Multiverse** | Weapons, armors, consumables | 100K+ item types |
| **Skyweaver** | Trading cards | 500+ cards |
| **Decentraland Wearables** | Avatars, clothes | 10K+ wearables |

**Mengapa gaming cocok dengan ERC-1155:**

```
Typical Game Inventory:
├── Weapons (fungible dalam tier)
│   ├── 50x Wooden Sword (common)
│   ├── 20x Steel Sword (rare)
│   └── 1x Legendary Excalibur (unique)
├── Consumables (fungible)
│   ├── 100x Health Potion
│   ├── 50x Mana Potion
│   └── 20x Buff Scroll
└── Collectibles (NFTs)
    ├── Achievement Badge #1
    ├── Seasonal Skin #42
    └── Event Trophy

→ Perfect untuk ERC-1155! Semua dalam 1 contract!
```

**2. Loyalty Programs**

| Program | Use Case | Items |
|---------|----------|-------|
| **Starbucks Odyssey** | Collectible journey stamps | NFT badges + points |
| **Nike .SWOOSH** | Virtual sneakers | Limited editions |

**Contoh:**

```solidity
contract LoyaltyProgram is ERC1155 {
    uint256 public constant POINTS = 0;       // Fungible
    uint256 public constant BRONZE_BADGE = 1;  // NFT
    uint256 public constant SILVER_BADGE = 2;  // NFT
    uint256 public constant GOLD_BADGE = 3;    // NFT

    // User dapat points + badges dalam 1 contract
    function earnReward(address user, uint256 tier) external {
        _mint(user, POINTS, 100, "");          // 100 points
        _mint(user, tier, 1, "");              // 1 badge (tier-based)
    }
}
```

**3. Digital Fashion & Wearables**

```
Decentraland:
- T-Shirts (fungible, 1000 supply)
- Unique Designer Dress (NFT, 1 supply)
- Limited Sneakers (10 supply)

Semua dalam 1 contract, bisa trade di marketplace yang sama!
```

**4. Music & Media**

```
Artist Album Release:
- Regular Album (fungible, unlimited)
- Deluxe Edition (limited, 100 copies)
- Backstage Pass (NFT, 10 copies)
- Signed Copy (NFT, 1 copy)
```

---

#### B. Use Cases Lokal Indonesia

**1. Game Items Lokal**

```
Game Mobile Indonesia (ex: Point Blank, Mobile Legends style):

contract GameItemsID is ERC1155 {
    // Weapons (fungible dalam tier)
    uint256 constant BAMBU_RUNCING = 0;      // Common weapon
    uint256 constant KERIS_PUSAKA = 1;       // Rare weapon
    uint256 constant MANDAU_LEGENDARY = 2;   // Legendary (limited)

    // Consumables
    uint256 constant JAMU_KUAT = 10;         // Power boost
    uint256 constant RAMUAN_SEHAT = 11;      // Health potion

    // Collectibles (Cultural NFTs)
    uint256 constant WAYANG_ARJUNA = 100;    // Unique skin
    uint256 constant BATIK_PATTERN = 101;    // Limited pattern
}
```

**Benefit:**
- 1 approval untuk semua items
- Batch trade di marketplace
- Mix consumables + collectibles
- Gas efficient untuk mobile gamers

**2. Event Tickets & Merchandise**

```
Use Case: Konser Musik (Dewa 19, Sheila on 7, etc)

contract KonserNFT is ERC1155 {
    uint256 constant GA_TICKET = 0;          // Fungible (1000 tickets)
    uint256 constant VIP_TICKET = 1;         // Fungible (100 tickets)
    uint256 constant MEET_GREET = 2;         // NFT (10 slots)

    uint256 constant MERCHANDISE_SHIRT = 10;  // Fungible
    uint256 constant SIGNED_POSTER = 11;      // NFT (limited)

    // Buy package: VIP ticket + merchandise (1 transaction!)
    function buyVIPPackage() external payable {
        require(msg.value >= 0.1 ether, "Insufficient payment");

        uint256[] memory ids = new uint256[](3);
        ids[0] = VIP_TICKET;
        ids[1] = MERCHANDISE_SHIRT;
        ids[2] = SIGNED_POSTER;

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1;  // 1 VIP ticket
        amounts[1] = 1;  // 1 shirt
        amounts[2] = 1;  // 1 signed poster

        _mintBatch(msg.sender, ids, amounts, "");
    }
}
```

**3. Koleksi Digital Budaya**

```
Use Case: Museum Digital Indonesia

contract MuseumNusantara is ERC1155 {
    // Wayang Collection
    uint256 constant WAYANG_GATOTKACA = 0;
    uint256 constant WAYANG_BIMA = 1;
    // ... (100+ wayang characters)

    // Batik Patterns
    uint256 constant BATIK_PARANG = 100;
    uint256 constant BATIK_KAWUNG = 101;
    // ... (50+ patterns)

    // Historical Artifacts (NFTs)
    uint256 constant BOROBUDUR_3D = 200;     // Unique 3D model
    uint256 constant KERIS_MPU_GANDRING = 201;  // Legendary artifact

    // Educational Content
    uint256 constant HISTORY_LESSON = 300;   // Fungible (everyone can access)

    // Users dapat collect semua dalam 1 contract!
}
```

**4. Membership & Vouchers**

```
Use Case: Co-working Space Jakarta

contract CoworkingMembership is ERC1155 {
    // Membership tiers (NFTs)
    uint256 constant BASIC_MEMBER = 0;       // 1 month
    uint256 constant PREMIUM_MEMBER = 1;     // 3 months
    uint256 constant VIP_MEMBER = 2;         // 1 year

    // Vouchers (fungible)
    uint256 constant COFFEE_VOUCHER = 10;    // 100 supply
    uint256 constant MEETING_ROOM = 11;      // 50 hours
    uint256 constant PRINTER_CREDITS = 12;   // 1000 pages

    // Buy membership + vouchers bundle
    function buyPremiumBundle() external payable {
        _mintBatch(
            msg.sender,
            [PREMIUM_MEMBER, COFFEE_VOUCHER, MEETING_ROOM],
            [1, 20, 10],  // 1 membership, 20 coffees, 10 hours
            ""
        );
    }
}
```

**5. Sertifikat & Achievements Kampus**

```
Use Case: BINUS University Achievement System

contract BINUSAchievements is ERC1155 {
    // Academic (NFTs - unique per semester)
    uint256 constant DEAN_LIST_2024_1 = 0;
    uint256 constant DEAN_LIST_2024_2 = 1;

    // Competition (NFTs - per event)
    uint256 constant HACKATHON_WINNER = 100;
    uint256 constant BUSINESS_CASE_WINNER = 101;

    // Activity Points (fungible)
    uint256 constant ACTIVITY_POINTS = 200;

    // Certificates (fungible - course completion)
    uint256 constant BLOCKCHAIN_CERT = 300;
    uint256 constant AI_CERT = 301;

    // Student dapat collect:
    // - NFT achievements (unique, flex di LinkedIn!)
    // - Activity points (untuk redeem merch)
    // - Course certificates (proof of learning)
    // Semua dalam 1 wallet!
}
```

---

### 4.6 Fungible vs Non-Fungible dalam ERC-1155

**Bagaimana ERC-1155 membedakan?**

```solidity
// Answer: SUPPLY!

// Fungible: Max supply > 1 (atau unlimited)
createToken(0, type(uint256).max);  // Unlimited Wooden Swords

// Semi-Fungible: Limited supply > 1
createToken(1, 100);  // 100 Epic Shields (limited edition)

// Non-Fungible: Max supply = 1
createToken(2, 1);    // 1 Legendary Excalibur (NFT)
```

**Tracking:**

```solidity
// Fungible
balanceOf(Alice, 0) = 50;  // Alice punya 50 (dari jutaan)

// Non-Fungible
balanceOf(Alice, 2) = 1;   // Alice punya 1 (satu-satunya!)
balanceOf(Bob, 2) = 0;     // Bob tidak punya
```

---

## PART B: Membangun ERC-1155 Step-by-Step (60 menit)

### 4.7 Level 1: Basic Multi-Token Contract

Mari kita mulai dari yang paling sederhana.

**Install OpenZeppelin (jika belum):**

```bash
npm install --save-dev @openzeppelin/contracts
```

**Buat file: `contracts/BasicMultiToken.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title BasicMultiToken
 * @dev ERC-1155 paling sederhana
 */
contract BasicMultiToken is ERC1155 {

    uint256 public nextTokenId;

    /**
     * @dev Constructor dengan base URI
     * URI format: https://game.example/api/item/{id}.json
     */
    constructor() ERC1155("https://game.example/api/item/{id}.json") {}

    /**
     * @dev Mint token baru
     * @param to Recipient
     * @param amount Jumlah token
     */
    function mint(
        address to,
        uint256 amount
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId, amount, "");
        return tokenId;
    }
}
```

### Penjelasan

**1. Import & Inheritance**

```solidity
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract BasicMultiToken is ERC1155 {
```

OpenZeppelin ERC1155 sudah implement semua fungsi wajib:
- ✅ `balanceOf()`
- ✅ `balanceOfBatch()`
- ✅ `safeTransferFrom()`
- ✅ `safeBatchTransferFrom()`
- ✅ `setApprovalForAll()`
- ✅ `isApprovedForAll()`

**2. Constructor dengan URI**

```solidity
constructor() ERC1155("https://game.example/api/item/{id}.json") {}
```

- `{id}` = placeholder untuk token ID
- Contoh final URL:
  - Token ID 0 → `https://game.example/api/item/0.json`
  - Token ID 1 → `https://game.example/api/item/1.json`

**3. Mint Function**

```solidity
function mint(address to, uint256 amount) external returns (uint256) {
    uint256 tokenId = nextTokenId++;
    _mint(to, tokenId, amount, "");
    return tokenId;
}
```

**Penggunaan:**

```solidity
// Create fungible item (supply 1000)
mint(Alice, 1000);  // Alice dapat 1000 dari token ID 0

// Create NFT (supply 1)
mint(Bob, 1);       // Bob dapat 1 (unique) dari token ID 1
```

---

### 4.8 Level 2: Multi-Token dengan Item Types

Sekarang kita buat contract dengan pre-defined item types.

**Buat file: `contracts/GameItems.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameItems
 * @dev ERC-1155 untuk game items dengan pre-defined types
 */
contract GameItems is ERC1155, Ownable {

    // ============ ITEM IDS (Constants) ============

    uint256 public constant WOODEN_SWORD = 0;
    uint256 public constant STEEL_SWORD = 1;
    uint256 public constant LEGENDARY_SWORD = 2;
    uint256 public constant HEALTH_POTION = 3;
    uint256 public constant MANA_POTION = 4;

    // ============ STATE ============

    /**
     * @dev Track total minted per item
     */
    mapping(uint256 => uint256) public totalSupply;

    /**
     * @dev Max supply per item (0 = unlimited)
     */
    mapping(uint256 => uint256) public maxSupply;

    // ============ EVENTS ============

    event ItemMinted(
        address indexed to,
        uint256 indexed id,
        uint256 amount
    );

    // ============ CONSTRUCTOR ============

    constructor()
        ERC1155("https://liskgarden.example/api/item/{id}.json")
        Ownable(msg.sender)
    {
        // Set max supplies
        maxSupply[WOODEN_SWORD] = 0;           // Unlimited
        maxSupply[STEEL_SWORD] = 0;            // Unlimited
        maxSupply[LEGENDARY_SWORD] = 100;      // Limited!
        maxSupply[HEALTH_POTION] = 0;          // Unlimited
        maxSupply[MANA_POTION] = 0;            // Unlimited
    }

    // ============ MINT FUNCTIONS ============

    /**
     * @dev Mint specific item
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        // Check max supply
        if (maxSupply[id] > 0) {
            require(
                totalSupply[id] + amount <= maxSupply[id],
                "Exceeds max supply"
            );
        }

        // Mint
        _mint(to, id, amount, "");

        // Update total supply
        totalSupply[id] += amount;

        emit ItemMinted(to, id, amount);
    }

    /**
     * @dev Mint batch items
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyOwner {
        // Check all supplies
        for (uint256 i = 0; i < ids.length; i++) {
            if (maxSupply[ids[i]] > 0) {
                require(
                    totalSupply[ids[i]] + amounts[i] <= maxSupply[ids[i]],
                    "Exceeds max supply"
                );
            }
            totalSupply[ids[i]] += amounts[i];
        }

        _mintBatch(to, ids, amounts, "");
    }

    // ============ UTILITY FUNCTIONS ============

    /**
     * @dev Get item name (for frontend)
     */
    function getItemName(uint256 id) public pure returns (string memory) {
        if (id == WOODEN_SWORD) return "Wooden Sword";
        if (id == STEEL_SWORD) return "Steel Sword";
        if (id == LEGENDARY_SWORD) return "Legendary Sword";
        if (id == HEALTH_POTION) return "Health Potion";
        if (id == MANA_POTION) return "Mana Potion";
        return "Unknown Item";
    }
}
```

### Penggunaan

```solidity
// Mint 10 Wooden Swords ke player
mint(playerAddress, WOODEN_SWORD, 10);

// Mint starter pack (batch!)
mintBatch(
    playerAddress,
    [WOODEN_SWORD, HEALTH_POTION, MANA_POTION],
    [1, 5, 3]  // 1 sword, 5 health, 3 mana
);

// Try mint Legendary Sword (max 100)
mint(playerAddress, LEGENDARY_SWORD, 1);  // OK (99 left)
mint(playerAddress, LEGENDARY_SWORD, 200); // REVERT! Exceeds max supply
```

---

### 4.9 Level 3: Items dengan Pricing

Tambahkan sistem buy items dengan ETH.

**Buat file: `contracts/ShopItems.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ShopItems
 * @dev Game items yang bisa dibeli dengan ETH
 */
contract ShopItems is ERC1155, Ownable {

    // ============ ITEM IDS ============

    uint256 public constant SEED = 0;
    uint256 public constant FERTILIZER = 1;
    uint256 public constant WATER_CAN = 2;
    uint256 public constant PESTICIDE = 3;
    uint256 public constant GOLDEN_SHOVEL = 4;  // Rare item!

    // ============ STATE ============

    /**
     * @dev Item prices in wei
     */
    mapping(uint256 => uint256) public itemPrice;

    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public maxSupply;

    // ============ EVENTS ============

    event ItemPurchased(
        address indexed buyer,
        uint256 indexed itemId,
        uint256 amount,
        uint256 totalCost
    );

    // ============ CONSTRUCTOR ============

    constructor()
        ERC1155("https://liskgarden.example/api/item/{id}.json")
        Ownable(msg.sender)
    {
        // Set prices (in wei)
        itemPrice[SEED] = 0.0001 ether;
        itemPrice[FERTILIZER] = 0.0002 ether;
        itemPrice[WATER_CAN] = 0.0005 ether;
        itemPrice[PESTICIDE] = 0.0003 ether;
        itemPrice[GOLDEN_SHOVEL] = 0.01 ether;  // Expensive!

        // Set max supplies
        maxSupply[SEED] = 0;              // Unlimited
        maxSupply[FERTILIZER] = 0;        // Unlimited
        maxSupply[WATER_CAN] = 0;         // Unlimited
        maxSupply[PESTICIDE] = 0;         // Unlimited
        maxSupply[GOLDEN_SHOVEL] = 1000;  // Limited!
    }

    // ============ BUY FUNCTIONS ============

    /**
     * @dev Buy single item type
     */
    function buyItem(uint256 id, uint256 amount) external payable {
        uint256 cost = itemPrice[id] * amount;
        require(msg.value >= cost, "Insufficient payment");

        // Check max supply
        if (maxSupply[id] > 0) {
            require(
                totalSupply[id] + amount <= maxSupply[id],
                "Exceeds max supply"
            );
        }

        // Mint item
        _mint(msg.sender, id, amount, "");
        totalSupply[id] += amount;

        // Refund excess payment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit ItemPurchased(msg.sender, id, amount, cost);
    }

    /**
     * @dev Buy batch items (1 transaction!)
     */
    function buyBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    ) external payable {
        require(ids.length == amounts.length, "Length mismatch");

        // Calculate total cost
        uint256 totalCost = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            totalCost += itemPrice[ids[i]] * amounts[i];

            // Check max supply
            if (maxSupply[ids[i]] > 0) {
                require(
                    totalSupply[ids[i]] + amounts[i] <= maxSupply[ids[i]],
                    "Exceeds max supply"
                );
            }

            totalSupply[ids[i]] += amounts[i];
        }

        require(msg.value >= totalCost, "Insufficient payment");

        // Mint batch
        _mintBatch(msg.sender, ids, amounts, "");

        // Refund excess
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Update item price
     */
    function setItemPrice(uint256 id, uint256 price) external onlyOwner {
        itemPrice[id] = price;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

### Penggunaan

```solidity
// Buy 5 seeds
buyItem(SEED, 5);  // Send 0.0005 ETH (0.0001 * 5)

// Buy starter pack (batch!)
buyBatch(
    [SEED, FERTILIZER, WATER_CAN],
    [10, 5, 1]
);
// Cost: (0.0001 * 10) + (0.0002 * 5) + (0.0005 * 1)
//     = 0.001 + 0.001 + 0.0005
//     = 0.0025 ETH
```

---

### 4.10 Level 4: GameItems Skeleton untuk LiskGarden

Sekarang kita buat **GameItemsSkeleton** untuk game LiskGarden. Ini **fondasi** - full implementation jadi **homework!**

**Buat file: `contracts/GameItemsSkeleton.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameItemsSkeleton
 * @dev Foundation untuk LiskGarden game items - akan dilengkapi di homework
 */
contract GameItemsSkeleton is ERC1155, Ownable {

    // ============ ITEM CATEGORIES ============

    // Consumables (unlimited supply)
    uint256 public constant SEED = 0;
    uint256 public constant FERTILIZER = 1;
    uint256 public constant WATER_CAN = 2;
    uint256 public constant PESTICIDE = 3;

    // Tools (limited supply)
    uint256 public constant GOLDEN_SHOVEL = 10;      // Rare
    uint256 public constant RAINBOW_WATERING_CAN = 11;  // Epic
    uint256 public constant MYSTICAL_FERTILIZER = 12;   // Legendary

    // Boosts (consumable, limited)
    uint256 public constant GROWTH_BOOST_1H = 20;    // 1 hour boost
    uint256 public constant GROWTH_BOOST_24H = 21;   // 24 hour boost
    uint256 public constant RARE_SEED_BOOST = 22;    // Increase rarity chance

    // ============ STATE ============

    mapping(uint256 => uint256) public itemPrice;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public maxSupply;

    /**
     * @dev Item effects (untuk game mechanics)
     * TODO: Implement effect system (HOMEWORK!)
     */
    struct ItemEffect {
        uint256 growthMultiplier;   // 100 = 1x, 200 = 2x
        uint256 rarityBoost;        // Percentage boost
        uint256 durationSeconds;    // Untuk timed boosts
        bool isConsumable;          // Habis pakai atau permanent
    }

    mapping(uint256 => ItemEffect) public itemEffects;

    /**
     * @dev Track active boosts per player per plant
     * TODO: Implement boost tracking (HOMEWORK!)
     */
    mapping(address => mapping(uint256 => uint256)) public activeBoosts;

    // ============ EVENTS ============

    event ItemPurchased(address indexed buyer, uint256 indexed id, uint256 amount);
    event ItemUsed(address indexed user, uint256 indexed plantId, uint256 indexed itemId);
    event BoostActivated(address indexed user, uint256 indexed plantId, uint256 boost);

    // ============ CONSTRUCTOR ============

    constructor()
        ERC1155("https://api.liskgarden.example/item/{id}.json")
        Ownable(msg.sender)
    {
        _initializeItems();
    }

    function _initializeItems() private {
        // Set prices
        itemPrice[SEED] = 0.0001 ether;
        itemPrice[FERTILIZER] = 0.0002 ether;
        itemPrice[WATER_CAN] = 0.0003 ether;
        itemPrice[PESTICIDE] = 0.0002 ether;
        itemPrice[GOLDEN_SHOVEL] = 0.01 ether;
        itemPrice[RAINBOW_WATERING_CAN] = 0.02 ether;
        itemPrice[MYSTICAL_FERTILIZER] = 0.05 ether;
        itemPrice[GROWTH_BOOST_1H] = 0.001 ether;
        itemPrice[GROWTH_BOOST_24H] = 0.005 ether;
        itemPrice[RARE_SEED_BOOST] = 0.003 ether;

        // Set max supplies
        maxSupply[GOLDEN_SHOVEL] = 1000;
        maxSupply[RAINBOW_WATERING_CAN] = 500;
        maxSupply[MYSTICAL_FERTILIZER] = 100;

        // TODO: Set item effects (HOMEWORK!)
        // itemEffects[FERTILIZER] = ItemEffect(200, 0, 0, true);  // 2x growth
        // itemEffects[GROWTH_BOOST_1H] = ItemEffect(300, 0, 3600, true);  // 3x for 1h
    }

    // ============ BUY FUNCTIONS ============

    function buyItem(uint256 id, uint256 amount) external payable {
        uint256 cost = itemPrice[id] * amount;
        require(msg.value >= cost, "Insufficient payment");

        // Check max supply
        if (maxSupply[id] > 0) {
            require(totalSupply[id] + amount <= maxSupply[id], "Sold out");
        }

        _mint(msg.sender, id, amount, "");
        totalSupply[id] += amount;

        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit ItemPurchased(msg.sender, id, amount);
    }

    function buyBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    ) external payable {
        require(ids.length == amounts.length, "Length mismatch");

        uint256 totalCost = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            totalCost += itemPrice[ids[i]] * amounts[i];

            if (maxSupply[ids[i]] > 0) {
                require(totalSupply[ids[i]] + amounts[i] <= maxSupply[ids[i]], "Sold out");
            }

            totalSupply[ids[i]] += amounts[i];
        }

        require(msg.value >= totalCost, "Insufficient payment");
        _mintBatch(msg.sender, ids, amounts, "");

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    // ============ GAME FUNCTIONS ============

    /**
     * @dev Use item on plant
     * TODO: Implement usage logic (HOMEWORK!)
     */
    function useItem(uint256 plantId, uint256 itemId) external {
        require(balanceOf(msg.sender, itemId) > 0, "Don't have item");

        // TODO: Verify ownership of plantId
        // TODO: Apply item effect to plant
        // TODO: If consumable, burn item
        // TODO: If timed boost, track expiry

        // For now, just burn if consumable
        // _burn(msg.sender, itemId, 1);

        emit ItemUsed(msg.sender, plantId, itemId);
    }

    /**
     * @dev Batch use items
     * TODO: Implement batch usage (HOMEWORK!)
     */
    function useItemBatch(
        uint256 plantId,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) external {
        // TODO: Implement efficient batch item usage
    }

    // ============ VIEW FUNCTIONS ============

    function getItemInfo(uint256 id)
        external
        view
        returns (
            string memory name,
            uint256 price,
            uint256 supply,
            uint256 maxSupp
        )
    {
        return (
            _getItemName(id),
            itemPrice[id],
            totalSupply[id],
            maxSupply[id]
        );
    }

    function _getItemName(uint256 id) internal pure returns (string memory) {
        if (id == SEED) return "Seed";
        if (id == FERTILIZER) return "Fertilizer";
        if (id == WATER_CAN) return "Water Can";
        if (id == PESTICIDE) return "Pesticide";
        if (id == GOLDEN_SHOVEL) return "Golden Shovel";
        if (id == RAINBOW_WATERING_CAN) return "Rainbow Watering Can";
        if (id == MYSTICAL_FERTILIZER) return "Mystical Fertilizer";
        if (id == GROWTH_BOOST_1H) return "1-Hour Growth Boost";
        if (id == GROWTH_BOOST_24H) return "24-Hour Growth Boost";
        if (id == RARE_SEED_BOOST) return "Rare Seed Boost";
        return "Unknown";
    }

    // ============ ADMIN FUNCTIONS ============

    function setItemPrice(uint256 id, uint256 price) external onlyOwner {
        itemPrice[id] = price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

---

### 4.11 What's Missing? (Homework Preview)

**GameItemsSkeleton** adalah fondasi. Di **homework**, Anda akan menambahkan:

**1. Item Effects System**

```solidity
// Define effects untuk setiap item
itemEffects[FERTILIZER] = ItemEffect({
    growthMultiplier: 200,    // 2x growth speed
    rarityBoost: 0,
    durationSeconds: 0,
    isConsumable: true
});

itemEffects[GROWTH_BOOST_1H] = ItemEffect({
    growthMultiplier: 300,    // 3x growth speed
    rarityBoost: 0,
    durationSeconds: 3600,    // 1 hour
    isConsumable: true
});
```

**2. Boost Tracking**

```solidity
// Track active boosts with expiry
struct ActiveBoost {
    uint256 itemId;
    uint256 expiryTime;
    uint256 multiplier;
}

mapping(address => mapping(uint256 => ActiveBoost[])) public activeBoosts;

function getEffectiveGrowthRate(address user, uint256 plantId)
    public
    view
    returns (uint256)
{
    // Calculate total multiplier from active boosts
    // Remove expired boosts
    // Return final growth rate
}
```

**3. Item Usage Logic**

```solidity
function useItem(uint256 plantId, uint256 itemId) external {
    // 1. Verify ownership
    require(plantNFT.ownerOf(plantId) == msg.sender, "Not owner");

    // 2. Check item balance
    require(balanceOf(msg.sender, itemId) > 0, "No item");

    // 3. Apply effect
    ItemEffect memory effect = itemEffects[itemId];

    if (effect.durationSeconds > 0) {
        // Timed boost
        activeBoosts[msg.sender][plantId].push(ActiveBoost({
            itemId: itemId,
            expiryTime: block.timestamp + effect.durationSeconds,
            multiplier: effect.growthMultiplier
        }));
    } else {
        // Instant effect
        // Apply directly to plant growth
    }

    // 4. Burn if consumable
    if (effect.isConsumable) {
        _burn(msg.sender, itemId, 1);
    }
}
```

**4. Integration dengan PlantNFT**

```solidity
// GameItems contract needs PlantNFT address
address public plantNFTAddress;

// When using fertilizer on plant
function useFertilizer(uint256 plantId) external {
    require(balanceOf(msg.sender, FERTILIZER) > 0, "No fertilizer");

    // Call PlantNFT to boost growth
    IPlantNFT(plantNFTAddress).applyGrowthBoost(plantId, 200); // 2x

    // Burn fertilizer
    _burn(msg.sender, FERTILIZER, 1);
}
```

---

## 4.12 Checkpoint Module 4

Pastikan Anda memahami:

**✅ Konsep ERC-1155:**
- [ ] Multi-token dalam 1 contract
- [ ] Fungible + Non-fungible dalam 1 contract
- [ ] Batch operations (gas efficiency!)
- [ ] Use cases (gaming, loyalty, bundles)

**✅ ERC-1155 Interface:**
- [ ] `balanceOf(address, id)` - balance specific item
- [ ] `balanceOfBatch()` - batch balance check
- [ ] `safeTransferFrom()` - transfer item
- [ ] `safeBatchTransferFrom()` - batch transfer!
- [ ] `setApprovalForAll()` - approve semua items

**✅ Building ERC-1155:**
- [ ] OpenZeppelin ERC1155 base
- [ ] Item pricing system
- [ ] Max supply tracking
- [ ] Buy & batch buy
- [ ] GameItems skeleton

**❓ Quiz:**

1. Apa keuntungan utama ERC-1155 dibanding ERC-721 untuk gaming?
2. Bagaimana ERC-1155 membedakan fungible vs non-fungible items?
3. Mengapa batch transfer lebih gas-efficient?

---

## 4.13 Final Workshop Exercise

**Deploy semua contracts:**

```bash
# 1. Compile semua
npx hardhat compile

# 2. Deploy GardenToken (ERC-20)
npx hardhat ignition deploy ignition/modules/GardenToken.ts --network lisk-sepolia

# 3. Deploy PlantNFT (ERC-721)
npx hardhat ignition deploy ignition/modules/PlantNFT.ts --network lisk-sepolia

# 4. Deploy GameItems (ERC-1155)
npx hardhat ignition deploy ignition/modules/GameItems.ts --network lisk-sepolia

# 5. Verify semua di Blockscout
npx hardhat verify --network lisk-sepolia [ADDRESS] [...ARGS]
```

**Test interaksi:**

```typescript
// Buy items
await gameItems.buyItem(SEED, 10, { value: ethers.parseEther("0.001") });

// Check balance
const balance = await gameItems.balanceOf(playerAddress, SEED);
console.log("Seeds:", balance); // 10

// Batch transfer ke friend
await gameItems.safeBatchTransferFrom(
  playerAddress,
  friendAddress,
  [SEED, FERTILIZER],
  [5, 3],
  "0x"
);
```

---

**🎯 SELESAI!**

Anda telah mempelajari **3 token standards**:
- ✅ **ERC-20**: Fungible tokens (GardenToken)
- ✅ **ERC-721**: Non-fungible tokens (PlantNFT)
- ✅ **ERC-1155**: Multi-token standard (GameItems)

**Next: Homework Assignment & Integration!** 🚀
## 🎯 Showcase & Penutupan (16:45 - 17:00)

### 4.14 Showcase Time!

**Beberapa participants akan showcase:**

1. **Deployed Contracts**
   - Show contract di Blockscout
   - Explain token yang dibuat
   - Demo transfer/mint

2. **Unique Use Cases**
   - Ide kreatif untuk ERC-20/721/1155
   - Indonesian local use cases
   - Share learning insights

3. **Q&A Session**
   - Pertanyaan terakhir
   - Troubleshooting bersama
   - Tips & tricks sharing

---

## 📝 HOMEWORK ASSIGNMENT (PENTING!)

### Assignment Overview

**Deadline**: Sebelum Sesi 3 (Minggu berikutnya, 9 November 2025)
**Submission**: GitHub repository link di grup Telegram
**Bobot**: Will be reviewed di Sesi 3!

---

### 🎯 Tugas Utama: Complete LiskGarden Token Ecosystem

Anda akan **melengkapi** skeleton contracts yang sudah dibuat hari ini menjadi **full implementation**.

```
┌────────────────────────────────────────────────────┐
│  LISKGARDEN FULL ECOSYSTEM                         │
│                                                     │
│  1. GardenToken (ERC-20)        ← COMPLETE THIS!  │
│  2. PlantNFT (ERC-721)          ← COMPLETE THIS!  │
│  3. GameItems (ERC-1155)        ← COMPLETE THIS!  │
│  4. LiskGarden (Integration)    ← COMPLETE THIS!  │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

### Task 1: Complete GardenToken (ERC-20)

**Base**: `GardenTokenSkeleton.sol` dari Modul 2

**What to add:**

#### A. Reward System

```solidity
/**
 * Calculate reward based on plant rarity & growth stage
 *
 * Formula:
 * Base reward = 10 GDN
 * Rarity multiplier:
 *   - Common (1): 1x
 *   - Rare (2): 2x
 *   - Epic (3): 3x
 *   - Legendary (4): 5x
 *   - Mythic (5): 10x
 * Growth stage multiplier:
 *   - Seed (0): 0x (no reward)
 *   - Sprout (1): 0.5x
 *   - Growing (2): 0.75x
 *   - Mature (3): 1x
 */
function calculateReward(uint8 rarity, uint256 growthStage)
    public
    pure
    returns (uint256)
{
    // TODO: Implement calculation
}
```

#### B. Supply Management

```solidity
/**
 * Max supply cap: 100 million GDN
 * Daily mint limit: 10,000 GDN per day
 */
uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
uint256 public constant MAX_DAILY_MINT = 10_000 * 10**18;

mapping(uint256 => uint256) public dailyMintedAmount;  // day => amount

function mintReward(address to, uint256 amount) external onlyGameContract {
    // TODO: Check max supply
    // TODO: Check daily limit
    // TODO: Mint
}
```

#### C. Burn Mechanics

```solidity
/**
 * Burn cooldown: 1 day per user
 * Minimum burn: 10 GDN
 * Track total burned for analytics
 */
mapping(address => uint256) public lastBurnTime;
uint256 public totalBurned;

function burn(uint256 amount) public {
    // TODO: Check minimum amount
    // TODO: Check cooldown
    // TODO: Burn & update stats
}
```

#### D. Events & Analytics

```solidity
event RewardMinted(address indexed player, uint256 amount, uint8 rarity, uint256 stage);
event TokensBurned(address indexed burner, uint256 amount, uint256 totalBurned);

function circulatingSupply() public view returns (uint256) {
    // TODO: Return supply minus treasury
}

function burnRate() public view returns (uint256) {
    // TODO: Calculate burn rate percentage
}
```

**Acceptance Criteria:**
- [ ] All functions implemented
- [ ] Supply caps working
- [ ] Daily limit enforced
- [ ] Burn cooldown working
- [ ] Events emitted correctly
- [ ] Tests passing (minimum 10 tests)

---

### Task 2: Complete PlantNFT (ERC-721)

**Base**: `PlantNFTSkeleton.sol` dari Modul 3

**What to add:**

#### A. Minting Cost & Rarity

```solidity
/**
 * Minting cost: 0.001 ETH
 * Rarity probability:
 *   - Common (1): 60%
 *   - Rare (2): 25%
 *   - Epic (3): 10%
 *   - Legendary (4): 4%
 *   - Mythic (5): 1%
 */
uint256 public constant MINT_COST = 0.001 ether;

function mintPlant(string memory name, string memory species)
    external
    payable
    returns (uint256)
{
    require(msg.value >= MINT_COST, "Insufficient payment");

    uint8 rarity = _calculateRarity();  // TODO: Implement with random
    // TODO: Mint NFT with metadata
}

function _calculateRarity() private view returns (uint8) {
    // TODO: Use blockhash or Chainlink VRF for randomness
    // TODO: Map random number to rarity tiers
}
```

#### B. Growth Mechanics

```solidity
/**
 * Growth requirements:
 * - Time: 1 day per stage
 * - Waterings: 3 waterings per stage
 * - Max stage: 3 (mature)
 */
uint256 public constant STAGE_DURATION = 1 days;
uint256 public constant WATERINGS_PER_STAGE = 3;

mapping(uint256 => uint256) public waterCount;
mapping(uint256 => uint256) public lastGrowthTime;

function waterPlant(uint256 tokenId) external {
    // TODO: Check ownership
    // TODO: Check water cooldown (1 per 8 hours)
    // TODO: Increment water count
    // TODO: Check if can grow
}

function growPlant(uint256 tokenId) external {
    // TODO: Check growth requirements
    // TODO: Increment growth stage
    // TODO: Emit event
}

function canGrow(uint256 tokenId) public view returns (bool) {
    // TODO: Check time elapsed
    // TODO: Check water count
    // TODO: Check current stage < 3
}
```

#### C. Harvest Rewards

```solidity
/**
 * Harvest mature plants for GardenToken rewards
 * After harvest: reset growth or allow continuous harvest
 */
function harvestPlant(uint256 tokenId) external {
    // TODO: Check ownership
    // TODO: Check plant is mature
    // TODO: Calculate reward (call GardenToken.calculateReward)
    // TODO: Mint reward to player
    // TODO: Update harvest timestamp or reset growth
}

mapping(uint256 => uint256) public lastHarvestTime;
uint256 public constant HARVEST_COOLDOWN = 1 days;
```

#### D. Items Integration

```solidity
/**
 * Use items from GameItems contract on plants
 */
address public gameItemsContract;

function useItemOnPlant(uint256 plantId, uint256 itemId) external {
    // TODO: Verify ownership of plant
    // TODO: Verify ownership of item (check GameItems balance)
    // TODO: Apply item effect (growth boost, rarity boost, etc)
    // TODO: Call GameItems.burn() to consume item
}
```

**Acceptance Criteria:**
- [ ] Minting with cost implemented
- [ ] Rarity calculation working
- [ ] Growth mechanics complete
- [ ] Water cooldown enforced
- [ ] Harvest rewards working
- [ ] Item integration functional
- [ ] Tests passing (minimum 15 tests)

---

### Task 3: Complete GameItems (ERC-1155)

**Base**: `GameItemsSkeleton.sol` dari Modul 4

**What to add:**

#### A. Item Effects System

```solidity
/**
 * Define effects for each item type
 */
struct ItemEffect {
    uint256 growthMultiplier;   // 100 = 1x, 200 = 2x
    uint256 rarityBoost;        // Percentage increase
    uint256 durationSeconds;    // 0 = instant, >0 = timed boost
    bool isConsumable;          // Burn after use?
}

mapping(uint256 => ItemEffect) public itemEffects;

function _initializeItemEffects() private {
    // Fertilizer: 2x growth, instant, consumable
    itemEffects[FERTILIZER] = ItemEffect(200, 0, 0, true);

    // Growth Boost 1H: 3x growth, 1 hour, consumable
    itemEffects[GROWTH_BOOST_1H] = ItemEffect(300, 0, 3600, true);

    // TODO: Add effects for all items
}
```

#### B. Boost Tracking

```solidity
/**
 * Track active boosts per player per plant
 */
struct ActiveBoost {
    uint256 itemId;
    uint256 expiryTime;
    uint256 multiplier;
}

mapping(address => mapping(uint256 => ActiveBoost[])) public activeBoosts;

function getActiveBoosts(address player, uint256 plantId)
    external
    view
    returns (ActiveBoost[] memory)
{
    // TODO: Return active (non-expired) boosts
}

function getEffectiveGrowthRate(address player, uint256 plantId)
    public
    view
    returns (uint256)
{
    // TODO: Calculate total multiplier from all active boosts
    // TODO: Remove expired boosts
}
```

#### C. Item Usage Logic

```solidity
/**
 * Use item on plant - apply effects
 */
function useItem(uint256 plantId, uint256 itemId) external {
    // TODO: Check item balance
    // TODO: Check plant ownership (call PlantNFT)
    // TODO: Apply effect based on item type

    ItemEffect memory effect = itemEffects[itemId];

    if (effect.durationSeconds > 0) {
        // Timed boost
        activeBoosts[msg.sender][plantId].push(ActiveBoost({
            itemId: itemId,
            expiryTime: block.timestamp + effect.durationSeconds,
            multiplier: effect.growthMultiplier
        }));
    } else {
        // Instant effect - call PlantNFT to apply
    }

    // TODO: Burn if consumable
    if (effect.isConsumable) {
        _burn(msg.sender, itemId, 1);
    }
}

function useItemBatch(
    uint256 plantId,
    uint256[] memory itemIds,
    uint256[] memory amounts
) external {
    // TODO: Implement batch usage for gas efficiency
}
```

#### D. Analytics

```solidity
/**
 * Track item usage statistics
 */
mapping(uint256 => uint256) public itemUsageCount;
mapping(address => mapping(uint256 => uint256)) public playerItemUsage;

event ItemUsed(
    address indexed player,
    uint256 indexed plantId,
    uint256 indexed itemId,
    uint256 timestamp
);

function getMostUsedItems(uint256 count)
    external
    view
    returns (uint256[] memory itemIds, uint256[] memory usageCounts)
{
    // TODO: Return top N most used items
}
```

**Acceptance Criteria:**
- [ ] All item effects defined
- [ ] Boost tracking working
- [ ] Item usage logic complete
- [ ] Consumables burned correctly
- [ ] Timed boosts expire correctly
- [ ] Batch operations working
- [ ] Tests passing (minimum 15 tests)

---

### Task 4: Complete LiskGarden Integration Contract

**Create**: `contracts/LiskGarden.sol` (completely new!)

**Purpose**: Orchestrate semua token contracts menjadi satu game

#### A. Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./GardenToken.sol";
import "./PlantNFT.sol";
import "./GameItems.sol";

/**
 * @title LiskGarden
 * @dev Main game contract yang orchestrate semua token contracts
 */
contract LiskGarden {

    GardenToken public immutable gardenToken;
    PlantNFT public immutable plantNFT;
    GameItems public immutable gameItems;

    address public owner;

    constructor(
        address _gardenToken,
        address _plantNFT,
        address _gameItems
    ) {
        gardenToken = GardenToken(_gardenToken);
        plantNFT = PlantNFT(_plantNFT);
        gameItems = GameItems(_gameItems);
        owner = msg.sender;
    }

    // TODO: Implement game logic
}
```

#### B. Core Game Functions

```solidity
/**
 * 1. Plant a seed (requires SEED item + ETH)
 */
function plantSeed(string memory name, string memory species)
    external
    payable
    returns (uint256)
{
    // TODO: Check player has SEED item
    // TODO: Require payment (0.001 ETH + 1 SEED)
    // TODO: Burn SEED item
    // TODO: Mint PlantNFT
    // TODO: Return plant ID
}

/**
 * 2. Water plant (requires WATER_CAN item or cooldown)
 */
function waterPlant(uint256 plantId) external {
    // TODO: Check ownership
    // TODO: Check cooldown OR has WATER_CAN item
    // TODO: If using WATER_CAN, burn it
    // TODO: Call plantNFT.waterPlant()
}

/**
 * 3. Use fertilizer (requires FERTILIZER item)
 */
function useFertilizer(uint256 plantId) external {
    // TODO: Check ownership
    // TODO: Check has FERTILIZER
    // TODO: Call gameItems.useItem()
    // TODO: Apply boost to plant
}

/**
 * 4. Harvest mature plant
 */
function harvestPlant(uint256 plantId) external {
    // TODO: Check ownership
    // TODO: Check plant is mature
    // TODO: Calculate reward
    // TODO: Mint GardenToken reward
    // TODO: Reset plant or allow continuous harvest
}

/**
 * 5. Batch operations
 */
function harvestAll() external {
    // TODO: Get all mature plants owned by player
    // TODO: Harvest all in one transaction
}
```

#### C. Game Mechanics

```solidity
/**
 * Leaderboard tracking
 */
mapping(address => uint256) public totalHarvested;
mapping(address => uint256) public totalPlantsOwned;

function getTopFarmers(uint256 count)
    external
    view
    returns (address[] memory farmers, uint256[] memory harvests)
{
    // TODO: Return top farmers by total harvested
}

/**
 * Achievements system
 */
enum Achievement {
    FIRST_PLANT,
    TENTH_PLANT,
    HUNDREDTH_PLANT,
    FIRST_LEGENDARY,
    MASTER_FARMER
}

mapping(address => mapping(Achievement => bool)) public achievements;
mapping(address => mapping(Achievement => uint256)) public achievementTimestamp;

event AchievementUnlocked(
    address indexed player,
    Achievement indexed achievement,
    uint256 timestamp
);

function checkAndUnlockAchievements(address player) internal {
    // TODO: Check various conditions
    // TODO: Unlock achievements
    // TODO: Maybe reward bonus GDN
}
```

#### D. Economics & Treasury

```solidity
/**
 * Game treasury management
 */
uint256 public treasuryBalance;

function withdraw() external onlyOwner {
    // TODO: Withdraw ETH from game fees
}

/**
 * Dynamic pricing
 */
function updateMintCost(uint256 newCost) external onlyOwner {
    // TODO: Update plant minting cost
}

/**
 * Game statistics
 */
struct GameStats {
    uint256 totalPlantsMinted;
    uint256 totalHarvests;
    uint256 totalGDNMinted;
    uint256 totalItemsSold;
}

function getGameStats() external view returns (GameStats memory) {
    // TODO: Return aggregated stats
}
```

**Acceptance Criteria:**
- [ ] All token contracts integrated
- [ ] Core game flow working (plant → water → grow → harvest)
- [ ] Item usage integrated
- [ ] Leaderboard functional
- [ ] Achievements working
- [ ] Tests passing (minimum 20 tests!)

---

### 📋 Submission Requirements

#### 1. GitHub Repository

**Structure:**

```
liskgarden-hardhat/
├── contracts/
│   ├── GardenToken.sol         ✅ Complete
│   ├── PlantNFT.sol            ✅ Complete
│   ├── GameItems.sol           ✅ Complete
│   └── LiskGarden.sol          ✅ Complete
├── test/
│   ├── GardenToken.test.ts     ✅ Min 10 tests
│   ├── PlantNFT.test.ts        ✅ Min 15 tests
│   ├── GameItems.test.ts       ✅ Min 15 tests
│   └── LiskGarden.test.ts      ✅ Min 20 tests
├── ignition/modules/
│   ├── GardenToken.ts          ✅ Deployment script
│   ├── PlantNFT.ts             ✅ Deployment script
│   ├── GameItems.ts            ✅ Deployment script
│   └── LiskGarden.ts           ✅ Deployment script
├── README.md                    ✅ Documentation
└── DEPLOYMENT.md                ✅ Deployment guide
```

#### 2. Deployed Contracts (Lisk Sepolia)

**Submit:**
- ✅ GardenToken address + Blockscout link
- ✅ PlantNFT address + Blockscout link
- ✅ GameItems address + Blockscout link
- ✅ LiskGarden address + Blockscout link
- ✅ All contracts verified on Blockscout

#### 3. README.md

**Must include:**

```markdown
# LiskGarden - Token Ecosystem

## Overview
[Brief description of your implementation]

## Contracts

### GardenToken (ERC-20)
- Address: 0x...
- Blockscout: https://...
- Features:
  - [List implemented features]

### PlantNFT (ERC-721)
- Address: 0x...
- [Details...]

### GameItems (ERC-1155)
- Address: 0x...
- [Details...]

### LiskGarden (Main Game)
- Address: 0x...
- [Details...]

## Setup & Testing

```bash
npm install
npx hardhat test
npx hardhat coverage
```

## Deployment

[Step-by-step deployment guide]

## Game Flow

[Explain how to play the game]

## Unique Features

[Any creative additions you made!]

## Challenges & Solutions

[What challenges did you face? How did you solve them?]
```

#### 4. Test Coverage

**Minimum requirements:**

```
✅ GardenToken: 80% coverage
✅ PlantNFT: 80% coverage
✅ GameItems: 80% coverage
✅ LiskGarden: 75% coverage
```

**Run coverage:**

```bash
npx hardhat coverage
```

#### 5. Video Demo (Optional, Bonus Points!)

**3-5 minutes video showing:**
- Contract deployment
- Minting plants
- Using items
- Harvesting rewards
- Full game flow

---

### 🎁 Bonus Challenges (Optional)

Want to go beyond? Try these:

#### Bonus 1: Frontend Integration (Preview)

```typescript
// Simple React app to interact with contracts
// Will be covered in Sesi 3, but you can start early!

import { useAccount, useContractWrite } from 'wagmi';

function PlantButton() {
  const { write: plantSeed } = useContractWrite({
    address: liskGardenAddress,
    abi: liskGardenABI,
    functionName: 'plantSeed',
  });

  return (
    <button onClick={() => plantSeed({ args: ['My Plant', 'Rose'] })}>
      Plant Seed
    </button>
  );
}
```

#### Bonus 2: Advanced Randomness dengan Chainlink VRF

```solidity
// Use Chainlink VRF for truly random rarity
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract PlantNFT is ERC721, VRFConsumerBaseV2 {
    // Implement verifiable randomness for rarity calculation
}
```

#### Bonus 3: Metadata Generator

```typescript
// Generate JSON metadata for items
const metadata = {
  name: `Plant #${tokenId}`,
  description: "A beautiful plant in LiskGarden",
  image: `ipfs://QmXxx/${tokenId}.png`,
  attributes: [
    { trait_type: "Rarity", value: rarity },
    { trait_type: "Species", value: species },
    { trait_type: "Growth Stage", value: stage },
  ],
};

// Upload to IPFS
```

#### Bonus 4: Gas Optimization

```solidity
// Optimize untuk reduce gas costs
// - Use uint256 instead of uint8 where possible
// - Pack structs efficiently
// - Use events instead of storage where appropriate
// - Batch operations
```

**Bonus points akan dihitung di Sesi 3!**

---

## 📊 Grading Rubric

| Kriteria | Bobot | Detail |
|----------|-------|--------|
| **Functionality** | 40% | Semua fitur working as expected |
| **Code Quality** | 20% | Clean code, comments, best practices |
| **Testing** | 20% | Comprehensive tests, good coverage |
| **Deployment** | 10% | Deployed & verified di Lisk Sepolia |
| **Documentation** | 10% | README, DEPLOYMENT guide lengkap |
| **Bonus** | +20% | Creative additions, optimizations |

**Total possible: 120% (dengan bonus)**

---

## 📚 Resources untuk Homework

### Official Docs

1. **OpenZeppelin Contracts**
   - https://docs.openzeppelin.com/contracts/
   - ERC20, ERC721, ERC1155 documentation

2. **Hardhat Documentation**
   - https://hardhat.org/docs
   - Testing, deployment, verification

3. **Solidity by Example**
   - https://solidity-by-example.org/
   - Patterns & examples

### Video Tutorials

1. **Patrick Collins - Solidity Course**
   - https://www.youtube.com/watch?v=umepbfKp5rI
   - Comprehensive Solidity tutorial

2. **Smart Contract Programmer**
   - https://www.youtube.com/@smartcontractprogrammer
   - Short, focused tutorials

### Community Help

1. **Ethereum Jakarta Telegram**
   - Ask questions di grup!
   - Saling bantu sesama participants

2. **Stack Overflow Ethereum**
   - https://ethereum.stackexchange.com/
   - Technical Q&A

3. **OpenZeppelin Forum**
   - https://forum.openzeppelin.com/
   - Security & best practices

---

## 🎓 Summary: Apa yang Sudah Dipelajari Hari Ini?

### Konsep Fundamental

**✅ Token Standards**
- ERC-20: Fungible tokens (mata uang, points, rewards)
- ERC-721: Non-fungible tokens (NFTs, collectibles, unique items)
- ERC-1155: Multi-token standard (game items, bundles)

**✅ Smart Contract Development**
- Professional workflow dengan Hardhat
- Testing automation
- Deployment & verification
- Best practices

**✅ Token Economics**
- Supply management (fixed, unlimited, capped)
- Distribution strategies
- Inflation/deflation mechanics
- Reward systems

### Skills yang Dikuasai

**✅ Technical Skills**
- Setup Hardhat project
- Write Solidity contracts
- Use OpenZeppelin libraries
- Write automated tests
- Deploy to testnet
- Verify contracts on explorer

**✅ Blockchain Concepts**
- On-chain vs off-chain data
- Gas optimization
- Events & logging
- Access control
- Security considerations

### Real-World Applications

**✅ Global Use Cases**
- DeFi (stablecoins, governance, yield farming)
- NFT art & collectibles
- Gaming (play-to-earn, virtual items)
- Membership & access tokens

**✅ Indonesia Local Use Cases**
- Digital land certificates
- Event ticketing
- Cultural heritage preservation (Batik, Wayang)
- Campus achievements
- Co-working memberships

---

## 🚀 Next Session Preview

### Sesi 3: Frontend Development dengan React, Wagmi & Viem

**Tanggal**: Minggu, 9 November 2025
**Waktu**: 09:00 - 17:00 WIB
**Lokasi**: Jura Kemanggisan

**Apa yang akan dipelajari:**

**✅ Frontend Stack Modern**
- React + TypeScript + Vite
- TailwindCSS untuk styling
- Wagmi untuk wallet connection
- Viem untuk contract interaction

**✅ Wallet Integration**
- Connect wallet (MetaMask, WalletConnect)
- Network switching
- Account management
- Transaction signing

**✅ Contract Interaction**
- Read contract data (balances, metadata)
- Write to contracts (mint, transfer, etc)
- Event listening (real-time updates)
- Error handling

**✅ Build Complete dApp**
- Dashboard (inventory, stats)
- Plant management UI
- Item shop
- Harvesting interface
- Leaderboard

**✅ UX Best Practices**
- Loading states
- Transaction confirmations
- Error messages
- Responsive design

**Persiapan untuk Sesi 3:**

```bash
# Install Node.js 18+ (jika belum)
node --version  # Should be 18+

# Familiar dengan React basics
# Tutorial: https://react.dev/learn

# Selesaikan homework Sesi 2!
# Frontend akan interact dengan contracts Anda
```

---

## 🙏 Terima Kasih!

Selamat! Anda telah menyelesaikan Sesi 2: Professional Development dengan Hardhat & Token Standards! 🎉

### Key Takeaways

**🌟 Professional Tools**
- Hardhat untuk development
- TypeScript untuk type safety
- Testing untuk quality assurance
- Git untuk version control

**🌟 Token Standards**
- ERC-20 untuk fungible tokens
- ERC-721 untuk NFTs
- ERC-1155 untuk multi-token
- Each has specific use cases

**🌟 OpenZeppelin**
- Battle-tested contracts
- Security best practices
- Don't reinvent the wheel
- Community audited

**🌟 Testing is Critical**
- Test before deploy
- Mainnet tidak bisa di-undo!
- Automated tests save lives
- 80%+ coverage target

**🌟 Real-World Impact**
- Blockchain for good
- Solve real problems
- Indonesian use cases
- Build for the future

### Final Words

Homework adalah **essential** untuk Sesi 3! Frontend development akan interact dengan contracts yang Anda build hari ini.

**Jangan ragu untuk:**
- Bertanya di grup Telegram
- Share progress
- Help teman-teman
- Explore beyond requirements

**Remember:**
```
"Code is like humor.
When you have to explain it, it's bad."
- Cory House
```

Write clean, self-documenting code! 🚀

---

## 📞 Contact & Support

**Instruktur:**
- Telegram: @ethereumjakarta
- Email: hello@ethereum.id

**Community:**
- Telegram Group: Ethereum Jakarta - Kelas Rutin IV
- Discord: discord.gg/ethereumjakarta
- Twitter: @eth_jakarta

**Technical Support:**
- GitHub Issues: github.com/ethereum-jakarta/kelas-rutin-iv
- Office Hours: Weekdays 19:00-21:00 WIB

---

## 🤝 Credits

**Organized by**: Ethereum Jakarta
**Supported by**: Lisk
**Location**: Jura Kemanggisan
**Tanggal**: Minggu, 2 November 2025

**Special Thanks to:**
- All participants untuk antusiasme & participation
- Lisk team untuk support & resources
- Jura untuk venue
- OpenZeppelin untuk amazing contracts
- Hardhat team untuk great tools

**#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia** 🇮🇩

---

**Sampai jumpa di Sesi 3!** 🚀

Don't forget:
- ✅ Complete homework
- ✅ Deploy to Lisk Sepolia
- ✅ Submit GitHub repo
- ✅ Prepare untuk frontend development

**Let's build the future of Web3 in Indonesia!** 🌱🇮🇩
