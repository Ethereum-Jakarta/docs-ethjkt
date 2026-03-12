---
id: instalasi-hardhat-terbaru
title: Instalasi Hardhat 3 - Professional Development Setup
sidebar_position: 2
---

# Instalasi Hardhat 3 - Professional Development Setup

Panduan lengkap setup Hardhat 3 (versi terbaru 2025) untuk pengembangan smart contract secara profesional.

---

## Mengapa Menggunakan Hardhat?

**Remix bagus untuk belajar, tapi Hardhat lebih baik untuk:**
- ✅ Menulis automated tests
- ✅ Deploy ke multiple networks
- ✅ Bekerja dalam tim
- ✅ Version control (Git)
- ✅ Professional workflows
- ✅ TypeScript support
- ✅ Modern tooling

---

## Prerequisites (Yang Dibutuhkan)

### 1. Install Node.js

**Minimum Version: Node.js 22 atau lebih tinggi**

**Check versi Node.js Anda:**
```bash
node --version
# Harus menampilkan v22.0.0 atau lebih tinggi

npm --version
# Harus menampilkan 7.0.0 atau lebih tinggi
```

**Belum punya Node.js?**
1. Download dari [https://nodejs.org](https://nodejs.org)
2. Pilih versi LTS (Long Term Support)
3. Install sesuai sistem operasi Anda
4. Restart terminal setelah instalasi

### 2. Install Code Editor

**Rekomendasi: Visual Studio Code**
1. Download dari [https://code.visualstudio.com](https://code.visualstudio.com)
2. Install extensions yang berguna:
   - Solidity (by Juan Blanco)
   - Hardhat Solidity (by Nomic Foundation)
   - ESLint
   - Prettier

---

## Setup Hardhat 3 Project

### Step 1: Buat Folder Project

**1. Buat folder baru:**
```bash
mkdir my-hardhat-project
cd my-hardhat-project
```

**Penjelasan:**
- `mkdir` = membuat folder baru (make directory)
- `cd` = masuk ke dalam folder (change directory)

**2. Initialize npm project:**
```bash
npm init -y
```

**Penjelasan:**
- `npm init` = membuat file package.json (konfigurasi project)
- `-y` = menjawab "yes" untuk semua pertanyaan secara otomatis

**Hasil:** File `package.json` terbuat di folder project Anda

---

### Step 2: Install Hardhat

**Install Hardhat sebagai development dependency:**
```bash
npm install --save-dev hardhat
```

**Penjelasan:**
- `npm install` = mengunduh dan menginstall package
- `--save-dev` = menyimpan sebagai development dependency
- Proses ini memakan waktu ~30 detik

**Tunggu sampai muncul:**
```
added 1 package, and audited 2 packages in 5s
```

---

### Step 3: Initialize Hardhat Project

**1. Jalankan Hardhat initialization wizard:**
```bash
npx hardhat --init
```

**Penjelasan:**
- `npx` = menjalankan package yang sudah diinstall
- `hardhat --init` = memulai wizard setup Hardhat 3

:::warning Perhatikan Flag `--init`
Gunakan `--init` (dengan dua dash), **BUKAN** `init`. Jika Anda menjalankan `npx hardhat init` akan muncul error `HHE3: No Hardhat config file found`.
:::

**2. Hardhat 3 Wizard akan muncul:**

```
 █████  █████                         ███  ███                  ███      ██████
░░███  ░░███                         ░███ ░███                 ░███     ███░░███
 ░███   ░███   ██████  ████████   ███████ ░███████    ██████  ███████  ░░░  ░███
 ░██████████  ░░░░░███░░███░░███ ███░░███ ░███░░███  ░░░░░███░░░███░      ████░
 ░███░░░░███   ███████ ░███ ░░░ ░███ ░███ ░███ ░███   ███████  ░███      ░░░░███
 ░███   ░███  ███░░███ ░███     ░███ ░███ ░███ ░███  ███░░███  ░███ ███ ███ ░███
 █████  █████░░███████ █████    ░░███████ ████ █████░░███████  ░░█████ ░░██████
░░░░░  ░░░░░  ░░░░░░░ ░░░░░      ░░░░░░░ ░░░░ ░░░░░  ░░░░░░░    ░░░░░   ░░░░░░

👷 Welcome to Hardhat v3.1.12 👷

✔ Which version of Hardhat would you like to use? · hardhat-3
✔ Where would you like to initialize the project? · .
✔ What type of project would you like to initialize? · node-test-runner-viem
✔ Hardhat only supports ESM projects. Would you like to change "./package.json" to turn your project into ESM? (Y/n) · true
```

**3. Pilih opsi berikut:**

| Pertanyaan | Pilihan | Penjelasan |
|-----------|---------|------------|
| Hardhat version? | `hardhat-3` | Versi terbaru |
| Initialize path? | `.` (Enter) | Gunakan folder saat ini |
| Project type? | `node-test-runner-viem` | Modern stack dengan Viem |
| Turn into ESM? | `Y` (Yes) | ECMAScript Modules (modern JS) |
| Install dependencies? | `Y` (Yes) | Install semua package yang dibutuhkan |

**Penjelasan:**
- **hardhat-3**: Versi terbaru dengan fitur modern
- **ESM**: ECMAScript Modules adalah JavaScript standard modern
- **node-test-runner-viem**: Menggunakan Node.js test runner + Viem library
- **Viem**: Library modern yang lebih cepat dari ethers.js

**4. Instalasi dependencies:**
```
✨ Template files copied ✨

npm install --save-dev "@nomicfoundation/hardhat-toolbox-viem@^5.0.3" ...

added 111 packages, and audited 198 packages in 53s
✨ Dependencies installed ✨
```

**Proses ini:**
- Menginstall ~111 packages
- Memakan waktu 1-2 menit
- Ini normal, jangan khawatir!

**5. Selesai! Anda akan melihat:**
```
Give Hardhat a star on Github if you're enjoying it! ⭐️✨
https://github.com/NomicFoundation/hardhat
```

---

### Step 4: Struktur Project

**Setelah setup, folder project Anda akan terlihat seperti ini:**

```
my-hardhat-project/
├── contracts/              # Smart contracts Anda
│   └── Counter.sol        # Sample contract (bisa dihapus)
│   └── Counter.t.sol      # Sample Solidity test (bisa dihapus)
├── ignition/              # Deployment scripts
│   └── modules/
│       └── Counter.ts     # Sample deployment (bisa dihapus)
├── test/                  # Test files (TypeScript)
│   └── Counter.ts         # Sample test (bisa dihapus)
├── scripts/               # Custom scripts
│   └── send-op-tx.ts      # Sample script
├── node_modules/          # Installed packages (jangan diubah!)
├── hardhat.config.ts      # Konfigurasi utama Hardhat
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── .gitignore            # Git ignore file
```

**Penjelasan setiap folder:**

| Folder/File | Fungsi |
|------------|--------|
| `contracts/` | Tempat menulis smart contracts (.sol) |
| `Counter.sol` | Sample contract dengan fitur Hardhat 3 |
| `Counter.t.sol` | Solidity test (gaya Foundry, baru di Hardhat 3!) |
| `ignition/modules/` | Deployment scripts menggunakan Hardhat Ignition |
| `test/` | Test files dalam TypeScript/JavaScript |
| `scripts/` | Custom automation scripts |
| `hardhat.config.ts` | Konfigurasi network, compiler, plugins |
| `node_modules/` | Package yang diinstall (diabaikan oleh Git) |

**Note:** Hardhat 3 mendukung Solidity tests (.t.sol) DAN TypeScript tests!

---

### Step 5: Bersihkan Sample Files

**Hapus file-file sample yang tidak diperlukan:**

```bash
# Hapus sample contracts
rm contracts/Counter.sol
rm contracts/Counter.t.sol

# Hapus sample deployment
rm ignition/modules/Counter.ts

# Hapus sample test
rm test/Counter.ts
```

**Opsional:** Anda bisa menyimpan file-file ini untuk dipelajari nanti.

---

## Konfigurasi untuk Testnet

### Step 6: Install Dependencies Tambahan

**1. Install dotenv untuk environment variables:**
```bash
npm install --save-dev dotenv
```

**Penjelasan:**
- `dotenv` = memuat secret keys dari file .env
- Menjaga private key tetap aman (tidak di-commit ke Git)

**2. Install Hardhat Ethers (opsional, untuk compatibility):**
```bash
npm install --save-dev @nomicfoundation/hardhat-ethers ethers
```

---

### Step 7: Setup Environment Variables

**1. Buat file .env:**

```bash
# Di Windows:
type nul > .env

# Di Mac/Linux:
touch .env
```

**2. Tambahkan private key ke .env:**

Buka file `.env` dan tambahkan:

```env
PRIVATE_KEY=your_private_key_here_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Cara mendapatkan Etherscan API Key (untuk verify contract - GRATIS):**
1. Buka [https://etherscan.io](https://etherscan.io) dan buat akun (gratis)
2. Login → Klik username → "API Keys"
3. Klik "Add" → Beri nama (contoh: "hardhat")
4. Copy API Key Token
5. Paste ke file .env

**Cara mendapatkan private key dari MetaMask:**
1. Buka MetaMask extension
2. Klik 3 titik (⋮) → Account Details
3. Klik "Show private key"
4. Masukkan password MetaMask
5. Copy private key
6. Paste ke file .env (tanpa "0x" di awal)

**⚠️ SANGAT PENTING:**
- ❌ JANGAN PERNAH share private key Anda!
- ❌ JANGAN commit .env ke Git!
- ✅ File .gitignore sudah melindunginya
- ✅ Gunakan testnet wallet, bukan wallet utama

---

### Step 8: Konfigurasi Hardhat untuk Testnet

**Edit file `hardhat.config.ts`:**

Ganti semua isi file dengan konfigurasi di bawah ini:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const config: HardhatUserConfig = {
  // Register Hardhat 3 plugins
  plugins: [
    hardhatToolboxViemPlugin,
    hardhatIgnitionViemPlugin,
    hardhatVerify,
  ],

  // Solidity compiler configuration
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // Network configurations
  networks: {
    // Sepolia Testnet
    sepolia: {
      type: "http",
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 11155111,
    },
  },

  // Chain descriptors untuk block explorer
  chainDescriptors: {
    // Ethereum Sepolia
    11155111: {
      name: "Sepolia",
      blockExplorers: {
        etherscan: {
          name: "Etherscan",
          url: "https://sepolia.etherscan.io",
          apiUrl: "https://api-sepolia.etherscan.io/api",
        },
      },
    },
  },

  // Verification settings
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || "",
    },
  },

  // File paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

**Penjelasan konfigurasi:**

| Setting | Penjelasan |
|---------|------------|
| `plugins` | Plugin Hardhat 3 yang digunakan |
| `hardhatToolboxViemPlugin` | Toolbox dengan Viem library |
| `hardhatIgnitionViemPlugin` | Deployment system Hardhat 3 |
| `hardhatVerify` | Plugin untuk verify contract di block explorer |
| `solidity.version` | Versi compiler Solidity |
| `optimizer.enabled` | Optimasi bytecode untuk hemat gas |
| `type: "http"` | Tipe network (wajib di Hardhat 3) |
| `networks.sepolia` | Konfigurasi Sepolia testnet |
| `chainId: 11155111` | Chain ID untuk Sepolia testnet |
| `chainDescriptors` | Informasi block explorer untuk Etherscan |
| `verify.etherscan.apiKey` | API key untuk verify contract di Etherscan |

---

## Deploy CrowdFund Challenge dengan Hardhat

Sekarang kita akan deploy **CrowdFund** contract dari Final Challenge Sesi 1 menggunakan Hardhat 3. Ini adalah cara professional untuk deploy smart contract yang sudah Anda buat di Remix!

### Step 9: Buat Smart Contract CrowdFund

**1. Buat file `contracts/CrowdFund.sol`:**

```bash
# Di Windows:
type nul > contracts/CrowdFund.sol

# Di Mac/Linux:
touch contracts/CrowdFund.sol
```

**2. Isi dengan kode smart contract CrowdFund:**

Buka `contracts/CrowdFund.sol` di VS Code dan tulis implementasi lengkap dari challenge Sesi 1:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title CrowdFund - Decentralized Crowdfunding Platform
/// @notice Platform crowdfunding terdesentralisasi di Ethereum
/// @dev Challenge Final Ethereum Co-Learning Camp

contract CrowdFund {
    // ============================================
    // ENUMS & STRUCTS
    // ============================================

    enum CampaignStatus {
        Active,     // 0: Sedang berjalan, menerima kontribusi
        Successful, // 1: Target tercapai, dana bisa di-claim
        Failed,     // 2: Deadline lewat, target tidak tercapai
        Claimed     // 3: Dana sudah di-claim oleh creator
    }

    struct Campaign {
        uint256 campaignId;
        address creator;
        string title;
        string description;
        uint256 goalAmount;
        uint256 currentAmount;
        uint256 deadline;
        uint256 createdAt;
        CampaignStatus status;
        uint256 contributorCount;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    uint256 public campaignCounter;
    uint256 public constant MIN_GOAL = 0.01 ether;
    uint256 public constant MAX_DURATION = 90 days;
    uint256 public constant MIN_DURATION = 1 days;
    uint256 public constant MIN_CONTRIBUTION = 0.001 ether;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => mapping(address => bool)) public hasContributed;
    mapping(address => uint256[]) public creatorCampaigns;

    // ============================================
    // EVENTS
    // ============================================

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goalAmount, uint256 deadline);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount, uint256 totalRaised);
    event CampaignSuccessful(uint256 indexed campaignId, uint256 totalRaised);
    event FundsClaimed(uint256 indexed campaignId, address indexed creator, uint256 amount);
    event RefundIssued(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event CampaignFailed(uint256 indexed campaignId, uint256 totalRaised, uint256 goalAmount);

    // ============================================
    // MODIFIERS
    // ============================================

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Campaign does not exist");
        _;
    }

    modifier onlyCreator(uint256 _campaignId) {
        require(campaigns[_campaignId].creator == msg.sender, "Only creator can call this");
        _;
    }

    modifier onlyContributor(uint256 _campaignId) {
        require(contributions[_campaignId][msg.sender] > 0, "Only contributors can call this");
        _;
    }

    modifier isActive(uint256 _campaignId) {
        require(campaigns[_campaignId].status == CampaignStatus.Active, "Campaign is not active");
        _;
    }

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    /// @notice Buat campaign crowdfunding baru
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _durationDays
    ) public {
        require(_goalAmount >= MIN_GOAL, "Goal must be >= MIN_GOAL");
        require(_durationDays * 1 days >= MIN_DURATION, "Duration too short");
        require(_durationDays * 1 days <= MAX_DURATION, "Duration too long");

        campaignCounter++;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);

        campaigns[campaignCounter] = Campaign({
            campaignId: campaignCounter,
            creator: msg.sender,
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            currentAmount: 0,
            deadline: deadline,
            createdAt: block.timestamp,
            status: CampaignStatus.Active,
            contributorCount: 0
        });

        creatorCampaigns[msg.sender].push(campaignCounter);
        emit CampaignCreated(campaignCounter, msg.sender, _title, _goalAmount, deadline);
    }

    /// @notice Kontribusi ETH ke campaign
    function contribute(uint256 _campaignId)
        public
        payable
        campaignExists(_campaignId)
        isActive(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign deadline passed");
        require(msg.value >= MIN_CONTRIBUTION, "Contribution too small");
        require(campaign.creator != msg.sender, "Creator cannot contribute");

        contributions[_campaignId][msg.sender] += msg.value;
        campaign.currentAmount += msg.value;

        if (!hasContributed[_campaignId][msg.sender]) {
            hasContributed[_campaignId][msg.sender] = true;
            campaign.contributorCount++;
        }

        if (campaign.currentAmount >= campaign.goalAmount) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignSuccessful(_campaignId, campaign.currentAmount);
        }

        emit ContributionMade(_campaignId, msg.sender, msg.value, campaign.currentAmount);
    }

    /// @notice Creator claim dana setelah campaign sukses
    function claimFunds(uint256 _campaignId)
        public
        campaignExists(_campaignId)
        onlyCreator(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Successful, "Campaign not successful");

        campaign.status = CampaignStatus.Claimed;
        uint256 amount = campaign.currentAmount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsClaimed(_campaignId, msg.sender, amount);
    }

    /// @notice Kontributor refund jika campaign gagal
    function refund(uint256 _campaignId)
        public
        campaignExists(_campaignId)
        onlyContributor(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Failed, "Campaign not failed");

        uint256 amount = contributions[_campaignId][msg.sender];
        contributions[_campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit RefundIssued(_campaignId, msg.sender, amount);
    }

    /// @notice Cek dan update status campaign
    function checkCampaign(uint256 _campaignId) public campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        if (campaign.status != CampaignStatus.Active) return;
        if (block.timestamp < campaign.deadline) return;

        if (campaign.currentAmount >= campaign.goalAmount) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignSuccessful(_campaignId, campaign.currentAmount);
        } else {
            campaign.status = CampaignStatus.Failed;
            emit CampaignFailed(_campaignId, campaign.currentAmount, campaign.goalAmount);
        }
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    function getCampaignDetails(uint256 _campaignId)
        public
        view
        campaignExists(_campaignId)
        returns (Campaign memory)
    {
        return campaigns[_campaignId];
    }

    function getMyContribution(uint256 _campaignId) public view returns (uint256) {
        return contributions[_campaignId][msg.sender];
    }

    function getMyCampaigns() public view returns (uint256[] memory) {
        return creatorCampaigns[msg.sender];
    }

    function getTimeRemaining(uint256 _campaignId)
        public
        view
        campaignExists(_campaignId)
        returns (uint256)
    {
        if (block.timestamp >= campaigns[_campaignId].deadline) return 0;
        return campaigns[_campaignId].deadline - block.timestamp;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

:::tip Koneksi dengan Sesi 1
Contract ini adalah **implementasi lengkap** dari Final Challenge CrowdFund di Sesi 1. Jika Anda sudah membuat versi sendiri di Remix, Anda bisa gunakan versi Anda sendiri!
:::

---

### Step 10: Compile Contract

**Compile smart contract Anda:**

```bash
npx hardhat compile
```

**Output yang diharapkan:**
```
Compiled 1 Solidity file successfully
```

**Hasil compilation:**
- File bytecode dan ABI dibuat di folder `artifacts/`
- TypeScript types di-generate otomatis
- Error akan ditampilkan jika ada masalah di code

**Check hasil compilation:**
```bash
ls -la artifacts/contracts/CrowdFund.sol/
```

Anda akan melihat file `CrowdFund.json` yang berisi ABI dan bytecode.

---

### Step 11: Buat Deployment Script

**1. Buat file `ignition/modules/CrowdFund.ts`:**

```bash
mkdir -p ignition/modules
```

**2. Isi dengan deployment script:**

Buka/buat file `ignition/modules/CrowdFund.ts`:

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Hardhat Ignition deployment module untuk CrowdFund
 */
const CrowdFundModule = buildModule("CrowdFundModule", (m) => {
  // Deploy CrowdFund contract
  const crowdFund = m.contract("CrowdFund");

  // Return deployed contract instance
  return { crowdFund };
});

export default CrowdFundModule;
```

**Penjelasan:**
- `buildModule` = fungsi Hardhat Ignition untuk membuat deployment module
- `m.contract("CrowdFund")` = deploy contract CrowdFund
- Contract tidak butuh constructor parameters
- Return instance untuk digunakan di script lain

---

### Step 12: Dapatkan Testnet ETH

**Untuk deploy ke testnet, Anda butuh ETH testnet:**

**Cara mendapatkan Sepolia ETH:**

**Opsi 1: Sepolia Faucet (sepoliafaucet.com)**
1. Kunjungi [https://sepoliafaucet.com](https://sepoliafaucet.com)
2. Paste address wallet Anda
3. Klik "Request tokens"
4. Tunggu 30 detik - 1 menit

**Opsi 2: Alchemy Sepolia Faucet**
1. Kunjungi [https://sepoliafaucet.com](https://www.alchemy.com/faucets/ethereum-sepolia)
2. Login dengan akun Alchemy (gratis)
3. Paste address wallet Anda
4. Klik "Send Me ETH"

**Opsi 3: Infura Sepolia Faucet**
1. Kunjungi [https://www.infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
2. Login dengan akun Infura (gratis)
3. Paste address wallet Anda
4. Request ETH testnet

**Check balance di MetaMask** - pastikan ada ETH testnet sebelum deploy.

---

### Step 13: Deploy ke Sepolia Testnet!

**Deploy contract ke Sepolia:**

```bash
npx hardhat ignition deploy ignition/modules/CrowdFund.ts --network sepolia
```

**Proses deployment:**

```
✔ Confirm deploy to network sepolia (11155111)? … yes

Hardhat Ignition 🚀

Deploying [ CrowdFundModule ]

Batch #1
  Executed CrowdFundModule#CrowdFund

[ CrowdFundModule ] successfully deployed 🚀

Deployed Addresses

CrowdFundModule#CrowdFund - 0x1234567890abcdef1234567890abcdef12345678
```

**🎉 SAVE CONTRACT ADDRESS INI!**
- Copy address yang muncul
- Anda akan butuh untuk interact dengan contract

---

### Step 14: Verify Contract di Block Explorer

**Verify contract agar orang lain bisa lihat source code:**

```bash
npx hardhat verify --network sepolia 0xYourContractAddress
```

**Ganti `0xYourContractAddress` dengan address contract Anda!**

**Output:**
```
=== Blockscout ===

📤 Submitted source code for verification on Blockscout:

  contracts/CrowdFund.sol:CrowdFund
  Address: 0x1234...

⏳ Waiting for verification result...

✅ Contract verified successfully on Blockscout!

  contracts/CrowdFund.sol:CrowdFund
  Explorer: https://eth-sepolia.blockscout.com/address/0x1234...#code
```

**Buka link Explorer tersebut di browser** - Anda akan lihat contract verified dengan source code!

:::info Etherscan vs Blockscout
Hardhat 3 akan mencoba verify di **Etherscan**, **Blockscout**, dan **Sourcify** sekaligus. Jika Etherscan gagal (karena perlu API key V2), Blockscout biasanya tetap berhasil. Blockscout adalah block explorer open-source yang gratis!
:::

---

## Interact dengan CrowdFund Contract

### Step 15: Buat Interaction Script

**1. Buat file `scripts/interact.ts`:**

```typescript
import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

// Contract address hasil deployment
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

// Connect ke network dan dapatkan viem instance
const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();

// Get contract instance menggunakan Viem (Hardhat 3)
const crowdFund = await viem.getContractAt(
  "CrowdFund",
  CONTRACT_ADDRESS
);

console.log("CrowdFund contract:", CONTRACT_ADDRESS);
console.log("");

// 1. Buat campaign baru
console.log("📝 Creating a new campaign...");
const txHash = await crowdFund.write.createCampaign([
  "Bangun Perpustakaan Web3",           // title
  "Dana untuk buku dan resource web3",  // description
  parseEther("0.05"),                   // goal: 0.05 ETH
  7n,                                   // durasi: 7 hari (bigint)
]);
console.log("✅ Campaign created! Transaction:", txHash);
console.log("");

// Tunggu transaction di-mine
await publicClient.waitForTransactionReceipt({ hash: txHash });

// 2. Lihat campaign counter
console.log("📊 Checking campaign counter...");
const campaignCount = await crowdFund.read.campaignCounter();
console.log("Total campaigns:", campaignCount.toString());
console.log("");

// 3. Lihat detail campaign
console.log("🔍 Getting campaign details...");
const campaign = await crowdFund.read.getCampaignDetails([1n]);
console.log("Title:", campaign.title);
console.log("Goal:", formatEther(campaign.goalAmount), "ETH");
console.log("Current:", formatEther(campaign.currentAmount), "ETH");
console.log("Status:", ["Active", "Successful", "Failed", "Claimed"][Number(campaign.status)]);
console.log("Contributors:", campaign.contributorCount.toString());
console.log("");

// 4. Lihat sisa waktu
console.log("⏰ Checking time remaining...");
const timeLeft = await crowdFund.read.getTimeRemaining([1n]);
const daysLeft = Number(timeLeft) / 86400;
console.log("Time remaining:", daysLeft.toFixed(2), "days");
console.log("");

// 5. Lihat saldo contract
console.log("💰 Contract balance...");
const balance = await crowdFund.read.getContractBalance();
console.log("Balance:", formatEther(balance), "ETH");
console.log("");

// 6. Lihat campaign yang saya buat
console.log("📋 My campaigns...");
const myCampaigns = await crowdFund.read.getMyCampaigns();
console.log("Campaign IDs:", myCampaigns.map((id: bigint) => id.toString()));
```

**Penjelasan Viem di Hardhat 3:**

Hardhat 3 menggunakan **top-level await** (ESM) dan `network.connect()` untuk mendapatkan Viem instance:

```typescript
// Cara Hardhat 3 (Viem)
import { network } from "hardhat";
const { viem } = await network.connect();

// Dapatkan clients
const publicClient = await viem.getPublicClient();   // untuk read
const [walletClient] = await viem.getWalletClients(); // untuk write

// Get contract instance
const contract = await viem.getContractAt("ContractName", "0x...");
```

| Aksi | Syntax Viem | Penjelasan |
|------|-------------|------------|
| Read data | `contract.read.functionName([args])` | Call view/pure function |
| Send tx | `contract.write.functionName([args])` | Kirim transaction, return tx hash |
| Tunggu tx | `publicClient.waitForTransactionReceipt({ hash })` | Tunggu sampai di-mine |
| ETH → wei | `parseEther("1.0")` | Convert string ETH ke bigint wei |
| wei → ETH | `formatEther(amount)` | Convert bigint wei ke string ETH |
| Angka besar | `42n` | Pakai **BigInt** literal (akhiran `n`) |

**2. Update CONTRACT_ADDRESS dengan address contract Anda**

**3. Run script:**

```bash
npx hardhat run scripts/interact.ts --network sepolia
```

**Output:**
```
CrowdFund contract: 0x1234...

📝 Creating a new campaign...
✅ Campaign created! Transaction: 0xabc...

📊 Checking campaign counter...
Total campaigns: 1

🔍 Getting campaign details...
Title: Bangun Perpustakaan Web3
Goal: 0.05 ETH
Current: 0.0 ETH
Status: Active
Contributors: 0

⏰ Checking time remaining...
Time remaining: 7.00 days

💰 Contract balance...
Balance: 0.0 ETH

📋 My campaigns...
Campaign IDs: [1]
```

:::info Untuk Test Contribute & Refund
Script di atas hanya membuat campaign. Untuk test `contribute`, Anda perlu akun **berbeda** dari creator (karena creator tidak boleh kontribusi ke campaign sendiri). Coba buat script kedua atau test di Remix dengan multiple accounts!
:::

---

## Hardhat Commands Cheat Sheet

```bash
# Compile contracts
npx hardhat compile

# Clean artifacts
npx hardhat clean

# Run tests (jika ada)
npx hardhat test

# Deploy menggunakan Ignition
npx hardhat ignition deploy ignition/modules/YourModule.ts --network <network-name>

# Verify contract
npx hardhat verify --network <network-name> <contract-address>

# Run custom script
npx hardhat run scripts/your-script.ts --network <network-name>

# Check Hardhat version
npx hardhat --version

# Get help
npx hardhat help
```

---

## Best Practices

### Security
- ✅ Selalu gunakan `.env` untuk private keys
- ✅ Tambahkan `.env` ke `.gitignore`
- ✅ Jangan hardcode private keys di code
- ✅ Gunakan testnet wallet, bukan wallet utama
- ✅ Test di testnet sebelum deploy ke mainnet

### Code Quality
- ✅ Gunakan TypeScript untuk type safety
- ✅ Enable compiler optimizer
- ✅ Write tests untuk setiap fungsi
- ✅ Verify contracts di block explorer
- ✅ Add comments di code

### Project Structure
- ✅ Organize contracts di folder yang jelas
- ✅ Pisahkan deployment scripts per contract
- ✅ Buat folder tests/ untuk test files
- ✅ Gunakan Git untuk version control

---

## Troubleshooting

### Error: "Module not found"
```bash
# Install missing dependencies
npm install
```

### Error: "Invalid private key"
```bash
# Check .env file
# Pastikan private key tanpa "0x" di awal
PRIVATE_KEY=abc123...  # ✅ Benar
PRIVATE_KEY=0xabc123...  # ❌ Salah
```

### Error: "Insufficient funds"
```bash
# Dapatkan testnet ETH dari faucet
# Check balance di MetaMask
```

### Error: "Network not configured"
```bash
# Check hardhat.config.ts
# Pastikan network name sesuai dengan --network flag
```

---

## Apa yang Sudah Dipelajari

**Setup Professional:**
- ✅ Install Hardhat 3 (versi terbaru 2025)
- ✅ Buat TypeScript project dengan ESM
- ✅ Konfigurasi Sepolia testnet
- ✅ Secure private keys dengan dotenv

**Development Workflow:**
- ✅ Compile CrowdFund contract dengan optimization
- ✅ Deploy menggunakan Hardhat Ignition
- ✅ Verify di block explorer
- ✅ Interact dengan TypeScript scripts (create campaign, check details)

**Modern Features:**
- ✅ Viem library (modern alternative ethers.js)
- ✅ TypeScript type safety
- ✅ Plugin architecture
- ✅ Chain descriptors

**CrowdFund Contract:**
- ✅ Deploy Final Challenge Sesi 1 secara professional
- ✅ Interact dengan crowdfunding functions via script
- ✅ Verifikasi contract di Etherscan

---

## Langkah Selanjutnya

Setelah menguasai Hardhat, lanjut ke:

1. **Writing Tests** - Buat automated tests untuk contracts
2. **Token Standards** - Deploy ERC-20, ERC-721 tokens
3. **Advanced Deployment** - Multi-contract deployments
4. **Gas Optimization** - Optimize contract untuk hemat gas
5. **Security Auditing** - Best practices & common vulnerabilities

---

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Hardhat 3 Release Notes](https://github.com/NomicFoundation/hardhat/releases)
- [Viem Documentation](https://viem.sh)
- [Solidity Documentation](https://docs.soliditylang.org)
- [ETHJKT Discord](https://discord.gg/p5b6RFEnnk)

---

Ready to build with Hardhat 3! 🚀
