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
npx hardhat init
```

**Penjelasan:**
- `npx` = menjalankan package yang sudah diinstall
- `hardhat init` = memulai wizard setup Hardhat 3

**2. Hardhat 3 Wizard akan muncul:**

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
? What type of project would you like to initialize? › node-test-runner-viem
  Hardhat only supports ESM projects. Would you like to turn your project into ESM? (Y/n) › true
```

**3. Pilih opsi berikut:**

| Pertanyaan | Pilihan | Penjelasan |
|-----------|---------|------------|
| Hardhat version? | `hardhat-3` | Versi terbaru (2025) |
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

Installing dependencies...
added 110 packages, and audited 170 packages in 37s
✨ Dependencies installed ✨
```

**Proses ini:**
- Menginstall ~110 packages
- Memakan waktu 1-2 menit
- Ini normal, jangan khawatir!

**5. Selesai! Anda akan melihat:**
```
Give Hardhat a star on GitHub if you're enjoying it! 🌟✨
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
```

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
      url: "https://rpc.sepolia.org",
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
      enabled: true,
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

---

## Buat dan Deploy Smart Contract Pertama

### Step 9: Buat Smart Contract Sederhana

**1. Buat file `contracts/SimpleStorage.sol`:**

```bash
# Di Windows:
type nul > contracts/SimpleStorage.sol

# Di Mac/Linux:
touch contracts/SimpleStorage.sol
```

**2. Isi dengan kode smart contract:**

Buka `contracts/SimpleStorage.sol` di VS Code dan tulis:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title SimpleStorage
 * @dev Kontrak sederhana untuk menyimpan dan membaca data
 */
contract SimpleStorage {
    // State variable untuk menyimpan angka
    uint256 public favoriteNumber;

    // Event yang di-emit ketika angka berubah
    event NumberChanged(uint256 oldNumber, uint256 newNumber);

    // Struct untuk menyimpan data orang
    struct Person {
        string name;
        uint256 favoriteNumber;
    }

    // Array untuk menyimpan banyak orang
    Person[] public people;

    // Mapping dari nama ke favorite number
    mapping(string => uint256) public nameToFavoriteNumber;

    // Fungsi untuk set favorite number
    function store(uint256 _favoriteNumber) public {
        uint256 oldNumber = favoriteNumber;
        favoriteNumber = _favoriteNumber;
        emit NumberChanged(oldNumber, _favoriteNumber);
    }

    // Fungsi untuk retrieve favorite number
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    // Fungsi untuk tambah person
    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(Person(_name, _favoriteNumber));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }

    // Fungsi untuk get total people
    function getTotalPeople() public view returns (uint256) {
        return people.length;
    }
}
```

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
ls -la artifacts/contracts/SimpleStorage.sol/
```

Anda akan melihat file `SimpleStorage.json` yang berisi ABI dan bytecode.

---

### Step 11: Buat Deployment Script

**1. Buat file `ignition/modules/SimpleStorage.ts`:**

```bash
mkdir -p ignition/modules
```

**2. Isi dengan deployment script:**

Buka/buat file `ignition/modules/SimpleStorage.ts`:

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Hardhat Ignition deployment module untuk SimpleStorage
 */
const SimpleStorageModule = buildModule("SimpleStorageModule", (m) => {
  // Deploy SimpleStorage contract
  const simpleStorage = m.contract("SimpleStorage");

  // Return deployed contract instance
  return { simpleStorage };
});

export default SimpleStorageModule;
```

**Penjelasan:**
- `buildModule` = fungsi Hardhat Ignition untuk membuat deployment module
- `m.contract("SimpleStorage")` = deploy contract SimpleStorage
- Contract tidak butuh constructor parameters
- Return instance untuk digunakan di script lain

---

### Step 12: Dapatkan Testnet ETH

**Untuk deploy ke testnet, Anda butuh ETH testnet:**

**Opsi 1: Sepolia Testnet**
1. Kunjungi [https://sepoliafaucet.com](https://sepoliafaucet.com)
2. Paste address wallet Anda
3. Klik "Request tokens"
4. Tunggu 30 detik

**Opsi 2: Lisk Sepolia**
1. Kunjungi [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
2. Paste address wallet Anda
3. Klik "Request tokens"
4. Tunggu 30 detik

**Check balance di MetaMask** - pastikan ada ETH testnet.

---

### Step 13: Deploy ke Testnet!

**Deploy ke Sepolia Testnet:**

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.ts --network sepolia
```

**Atau deploy ke Lisk Sepolia:**

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.ts --network lisk-sepolia
```

**Proses deployment:**

```
✔ Confirm deploy to network sepolia (11155111)? … yes

Hardhat Ignition 🚀

Deploying [ SimpleStorageModule ]

Batch #1
  Executed SimpleStorageModule#SimpleStorage

[ SimpleStorageModule ] successfully deployed 🚀

Deployed Addresses

SimpleStorageModule#SimpleStorage - 0x1234567890abcdef1234567890abcdef12345678
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
Successfully submitted source code for contract
contracts/SimpleStorage.sol:SimpleStorage at 0x1234...
https://sepolia.etherscan.io/address/0x1234...
```

**Buka link tersebut di browser** - Anda akan lihat contract verified dengan source code!

---

## Interact dengan Contract

### Step 15: Buat Interaction Script

**1. Buat file `scripts/interact.ts`:**

```typescript
import hre from "hardhat";

async function main() {
  // Contract address hasil deployment
  const CONTRACT_ADDRESS = "0xYourContractAddressHere";

  // Get contract instance
  const SimpleStorage = await hre.ethers.getContractAt(
    "SimpleStorage",
    CONTRACT_ADDRESS
  );

  console.log("SimpleStorage contract:", CONTRACT_ADDRESS);
  console.log("");

  // 1. Read initial value
  console.log("📖 Reading initial favorite number...");
  let favoriteNumber = await SimpleStorage.retrieve();
  console.log("Current favorite number:", favoriteNumber.toString());
  console.log("");

  // 2. Store new value
  console.log("💾 Storing new favorite number (42)...");
  const tx1 = await SimpleStorage.store(42);
  await tx1.wait();
  console.log("✅ Stored! Transaction:", tx1.hash);
  console.log("");

  // 3. Read new value
  console.log("📖 Reading updated favorite number...");
  favoriteNumber = await SimpleStorage.retrieve();
  console.log("New favorite number:", favoriteNumber.toString());
  console.log("");

  // 4. Add a person
  console.log("👤 Adding a person...");
  const tx2 = await SimpleStorage.addPerson("Alice", 777);
  await tx2.wait();
  console.log("✅ Person added! Transaction:", tx2.hash);
  console.log("");

  // 5. Get total people
  console.log("📊 Getting total people...");
  const totalPeople = await SimpleStorage.getTotalPeople();
  console.log("Total people:", totalPeople.toString());
  console.log("");

  // 6. Get Alice's favorite number from mapping
  console.log("🔍 Getting Alice's favorite number from mapping...");
  const aliceNumber = await SimpleStorage.nameToFavoriteNumber("Alice");
  console.log("Alice's favorite number:", aliceNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**2. Update CONTRACT_ADDRESS dengan address contract Anda**

**3. Run script:**

```bash
npx hardhat run scripts/interact.ts --network sepolia
```

**Output:**
```
SimpleStorage contract: 0x1234...

📖 Reading initial favorite number...
Current favorite number: 0

💾 Storing new favorite number (42)...
✅ Stored! Transaction: 0xabc...

📖 Reading updated favorite number...
New favorite number: 42

👤 Adding a person...
✅ Person added! Transaction: 0xdef...

📊 Getting total people...
Total people: 1

🔍 Getting Alice's favorite number from mapping...
Alice's favorite number: 777
```

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
- ✅ Konfigurasi multiple networks (Sepolia, Lisk)
- ✅ Secure private keys dengan dotenv

**Development Workflow:**
- ✅ Compile contracts dengan optimization
- ✅ Deploy menggunakan Hardhat Ignition
- ✅ Verify di block explorer
- ✅ Interact dengan TypeScript scripts

**Modern Features:**
- ✅ Viem library (modern alternative ethers.js)
- ✅ TypeScript type safety
- ✅ Plugin architecture
- ✅ Chain descriptors

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
