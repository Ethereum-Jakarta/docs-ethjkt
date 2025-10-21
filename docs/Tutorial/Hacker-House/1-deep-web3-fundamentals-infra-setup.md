---
id: sesi-1
title: "Sesi 1: Deep Web3 Fundamentals & Infra Setup"
sidebar_label: "Sesi 1: Deep Web3 Fundamentals & Infra Setup"
description: "Pengantar konsep Web3, EVM, arsitektur wallet, dan setup lingkungan pengembangan untuk smart contract."
---

# Sesi 1: Deep Web3 Fundamentals & Infra Setup

Selamat datang di sesi pertama Bootcamp **Web3 Hacker House**! Pada sesi ini, kita akan membahas dasar-dasar Web3, mengenal EVM dan arsitektur wallet, serta melakukan setup beberapa tools penting seperti Node.js, Hardhat, Foundry, GitHub, dan Alchemy. Di akhir sesi, kita akan melakukan hands-on dengan melakukan deploy smart contract dasar di testnet.

---

## Pendahuluan ke Web3

### Evolusi Web: Dari Web1 ke Web3

Untuk memahami Web3, kita perlu melihat evolusi internet secara keseluruhan:

- **Web1 (1990-2005)** - Era "Read-Only Web"
  - Situs web statis dengan konten yang hanya bisa dibaca
  - Pengguna sebagai konsumen informasi
  - Pemilik situs web sebagai penyedia konten
  - Contoh: situs berita awal, halaman perusahaan sederhana

- **Web2 (2005-sekarang)** - Era "Read-Write Web"
  - Platform interaktif dan dinamis
  - Pengguna bisa membuat dan berbagi konten
  - Model bisnis berbasis data pengguna dan iklan
  - Kontrol terpusat oleh platform besar (Google, Facebook, Amazon)
  - Contoh: media sosial, e-commerce, aplikasi cloud

- **Web3** - Era "Read-Write-Own Web"
  - Internet terdesentralisasi berbasis blockchain
  - Kepemilikan aset digital yang sebenarnya
  - Transparansi dan keamanan melalui kriptografi
  - Infrastruktur tanpa kepercayaan (trustless)
  - Contoh: dApps, DeFi, NFT, DAO

### Konsep Kunci Web3

#### Blockchain
Blockchain adalah teknologi buku besar terdistribusi (distributed ledger) yang menyimpan data dalam blok-blok yang terhubung secara kriptografis. Karakteristik utama blockchain:

1. **Terdesentralisasi**
   - Dijalankan oleh jaringan node independen
   - Tidak ada otoritas pusat yang mengontrol
   - Data tersimpan di banyak lokasi sekaligus

2. **Immutable (Tidak Dapat Diubah)**
   - Setelah data direkam, hampir mustahil dimodifikasi
   - Setiap perubahan membutuhkan konsensus mayoritas
   - Menjamin integritas dan kepercayaan data

3. **Transparan**
   - Semua transaksi dapat diverifikasi oleh siapapun
   - Riwayat lengkap tersedia untuk publik
   - Mencegah penipuan dan manipulasi

4. **Konsensus**
   - Mekanisme untuk mencapai kesepakatan
   - Berbagai algoritma: Proof of Work, Proof of Stake, dll
   - Memastikan validitas transaksi tanpa otoritas pusat

#### Smart Contract
Smart contract adalah program komputer yang berjalan di blockchain dan mengeksekusi perjanjian secara otomatis ketika kondisi tertentu terpenuhi.

1. **Karakteristik Smart Contract**
   - Self-executing: berjalan otomatis tanpa intervensi
   - Deterministic: hasil eksekusi selalu sama dengan input yang sama
   - Transparan: kode dan eksekusi bisa dilihat oleh semua
   - Immutable: setelah di-deploy, sulit diubah

2. **Komponen Smart Contract**
   - Code: logika program yang ditulis dalam bahasa seperti Solidity
   - State: data yang disimpan dalam blockchain
   - Functions: metode yang bisa dipanggil untuk berinteraksi dengan contract
   - Events: notifikasi yang dipancarkan saat terjadi perubahan penting

3. **Use Cases Smart Contract**
   - Keuangan terdesentralisasi (DeFi)
   - Token digital (fungible dan non-fungible)
   - Voting dan tata kelola
   - Supply chain dan tracking
   - Asuransi otomatis
   - Marketplace terdesentralisasi

#### Desentralisasi
Desentralisasi adalah konsep inti Web3 yang merujuk pada distribusi kekuasaan, kontrol, dan pengambilan keputusan di seluruh jaringan.

1. **Tingkat Desentralisasi**
   - Desentralisasi Arsitektur: bagaimana infrastruktur diatur
   - Desentralisasi Politik: siapa yang membuat keputusan
   - Desentralisasi Ekonomi: distribusi nilai dan insentif

2. **Manfaat Desentralisasi**
   - Ketahanan terhadap kegagalan (fault-tolerance)
   - Tahan sensor (censorship-resistance)
   - Mengurangi titik kegagalan tunggal
   - Meningkatkan privasi dan kontrol pengguna
   - Menurunkan risiko monopoli dan penyalahgunaan kekuasaan

3. **Tantangan Desentralisasi**
   - Skalabilitas dan kinerja
   - Kompleksitas teknis
   - UX yang lebih menantang
   - Koordinasi dan tata kelola

#### Tokenomics
Tokenomics (Token Economics) adalah studi tentang ekonomi token dalam ekosistem blockchain.

1. **Jenis Token**
   - **Utility Tokens**: memberikan akses ke produk atau layanan
   - **Security Tokens**: merepresentasikan kepemilikan aset finansial
   - **Governance Tokens**: memberikan hak suara dalam DAO
   - **Non-Fungible Tokens (NFT)**: representasi digital aset unik

2. **Mekanisme Token**
   - **Supply & Distribusi**: jumlah total dan bagaimana distribusinya
   - **Utility**: kegunaan token dalam ekosistem
   - **Insentif**: bagaimana token mendorong perilaku tertentu
   - **Staking & Locking**: mekanisme untuk mempertahankan nilai

---

## Memahami Ethereum Virtual Machine (EVM) dan Arsitektur Blockchain

### Arsitektur Ethereum
Ethereum adalah platform komputasi terdistribusi berbasis blockchain yang memungkinkan pembuatan aplikasi terdesentralisasi (dApps) melalui smart contract.

1. **Layer Blockchain**
   - **Consensus Layer**: Menentukan bagaimana node menyepakati status blockchain
   - **Data Layer**: Struktur data yang menyimpan transaksi dan state
   - **Network Layer**: Protokol P2P untuk komunikasi antar node
   - **Application Layer**: Smart contract dan dApps

2. **Blocks & Transactions**
   - **Block**: Kumpulan transaksi dan metadata (timestamp, nonce, dll)
   - **Gas**: Unit pengukuran komputasi di Ethereum
   - **Gas Price**: Harga per unit gas (dalam Gwei)
   - **Gas Limit**: Jumlah maksimum gas yang dapat digunakan

3. **State dalam Ethereum**
   - **World State**: Snapshot semua akun dan kontrak pada waktu tertentu
   - **Account State**: Data spesifik untuk satu akun atau kontrak
   - **Merkle Patricia Trie**: Struktur data untuk menyimpan state secara efisien

### Ethereum Virtual Machine (EVM) Mendalam

EVM adalah lingkungan komputasi terisolasi dan Turing-complete yang mengeksekusi smart contract di jaringan Ethereum.

1. **Komponen EVM**
   - **Stack**: Struktur data LIFO untuk operasi
   - **Memory**: Penyimpanan volatile selama eksekusi kontrak
   - **Storage**: Penyimpanan permanen untuk data kontrak
   - **Environment Variables**: Data kontekstual (sender, value, dll)
   - **Program Counter**: Menunjuk instruksi yang sedang dieksekusi

2. **Execution Model**
   - **Bytecode**: Instruksi tingkat rendah yang dieksekusi EVM
   - **Opcode**: Operasi dasar dalam bytecode (ADD, STORE, CALL, dll)
   - **Gas Calculation**: Setiap opcode memiliki biaya gas tertentu
   - **Call Stack**: Batasan kedalaman panggilan antar kontrak

3. **EVM Languages**
   - **Solidity**: Bahasa high-level utama untuk Ethereum
   - **Vyper**: Alternatif dengan fokus keamanan dan kesederhanaan
   - **Yul**: Bahasa intermediate
   - **Huff**: Bahasa low-level untuk optimasi gas

4. **EVM Compatibility**
   - Banyak blockchain alternatif yang kompatibel dengan EVM:
     - Binance Smart Chain
     - Avalanche C-Chain
     - Polygon
     - Optimism, Arbitrum (L2 solutions)
     - Dan lain-lain
   - Kompatibilitas memungkinkan portabilitas smart contract

### Arsitektur Wallet: Mendalam

Wallet adalah interface untuk berinteraksi dengan blockchain, bukan tempat penyimpanan sebenarnya dari aset kripto.

#### 1. Kriptografi Kunci Publik dan Privat

- **Kunci Privat**:
  - Angka acak 256-bit (64 karakter heksadesimal)
  - Harus dijaga kerahasiaannya
  - Berfungsi sebagai "password" untuk mengakses dan mengelola aset
  - Hilangnya kunci privat berarti hilangnya akses permanen

- **Kunci Publik**:
  - Diturunkan dari kunci privat menggunakan kurva eliptik (ECDSA secp256k1)
  - Digunakan untuk memverifikasi tanda tangan digital
  - Tidak mengekspos kunci privat (one-way function)

- **Alamat**:
  - Diturunkan dari kunci publik melalui hashing (Keccak-256)
  - Format: awalan "0x" diikuti 40 karakter heksadesimal (misalnya 0x71C7656EC7ab88b098defB751B7401B5f6d8976F)
  - Identifikasi akun di blockchain

#### 2. Externally Owned Account (EOA)

EOA adalah jenis akun yang dikontrol langsung oleh pengguna melalui kunci privat.

- **Karakteristik EOA**:
  - Tidak memiliki kode (code)
  - Dapat menginisiasi transaksi
  - Memiliki saldo ETH dan token
  - Interaksi langsung dengan UI wallet seperti MetaMask

- **Komponen Utama EOA**:
  - **Nonce**: Jumlah transaksi yang telah dikirim dari akun
  - **Balance**: Jumlah ETH yang dimiliki akun
  - **storageRoot**: Root dari Merkle Patricia trie untuk storage (selalu kosong untuk EOA)
  - **codeHash**: Hash dari kode akun (konstan untuk EOA)

- **Proses Penandatanganan Transaksi**:
  1. Membuat objek transaksi (to, value, data, gasLimit, gasPrice, nonce)
  2. Hash transaksi dengan keccak256
  3. Menandatangani hash dengan kunci privat menggunakan ECDSA
  4. Broadcast transaksi ke jaringan

#### 3. Smart Contract Wallet

Smart Contract Wallet adalah akun yang dikelola oleh kode dan dapat menambahkan logika kompleks untuk keamanan dan fungsionalitas.

- **Karakteristik Contract Wallet**:
  - Memiliki kode yang menentukan perilaku
  - Tidak dapat menginisiasi transaksi (harus dipicu oleh EOA)
  - Dapat menyimpan token dan ETH
  - Mendukung fitur advanced seperti recovery dan otorisasi

- **Tipe-tipe Contract Wallet**:
  - **Multi-signature**: Memerlukan beberapa tanda tangan untuk otentikasi
  - **Social recovery**: Memungkinkan pemulihan akses melalui jaringan kepercayaan
  - **Session keys**: Memungkinkan aplikasi mengeksekusi transaksi terbatas
  - **Gas abstraction**: Memungkinkan pembayaran gas dalam token selain ETH

- **Keuntungan Contract Wallet**:
  - Keamanan yang lebih tinggi
  - Kontrol granular atas aset
  - Pengalaman pengguna yang lebih baik
  - Kompatibilitas dengan standar masa depan

#### 4. Hierarki Deterministic Wallet (HD Wallet)

HD Wallet memungkinkan pembuatan banyak alamat dari satu seed phrase.

- **Seed Phrase**:
  - 12 atau 24 kata dari daftar BIP-39
  - Dapat merekonstruksi semua kunci privat
  - Perlu diamankan dengan sangat hati-hati

- **Derivation Path**:
  - Format: m/purpose'/coin_type'/account'/change/address_index
  - Contoh: m/44'/60'/0'/0/0 (standar untuk Ethereum)
  - Memungkinkan pembuatan alamat yang berbeda untuk berbagai tujuan

- **Implementasi Populer**:
  - MetaMask
  - Ledger
  - Trezor
  - Trust Wallet

---

## Web3 Ecosystem dan Use Cases

### Decentralized Finance (DeFi)

DeFi menggantikan layanan keuangan tradisional dengan protokol terdesentralisasi.

1. **Komponen Utama DeFi**:
   - **Lending/Borrowing**: Aave, Compound
   - **Decentralized Exchanges (DEX)**: Uniswap, SushiSwap
   - **Stablecoins**: DAI, USDC
   - **Derivatives**: Synthetix, dYdX
   - **Asset Management**: Yearn Finance
   - **Insurance**: Nexus Mutual

2. **Konsep DeFi Penting**:
   - **Liquidity Pools**: Kumpulan token yang disediakan oleh pengguna
   - **Yield Farming**: Strategi untuk memaksimalkan return
   - **Impermanent Loss**: Risiko dalam penyediaan likuiditas
   - **Governance**: Pengambilan keputusan melalui token voting

### Non-Fungible Tokens (NFTs)

NFT adalah aset digital unik yang mewakili kepemilikan item khusus.

1. **Standar NFT**:
   - **ERC-721**: Standar dasar untuk NFT
   - **ERC-1155**: Standar untuk token semi-fungible
   - **ERC-2981**: Standar royalti untuk NFT

2. **Use Cases NFT**:
   - **Digital Art**: Karya seni digital dengan provenance terverifikasi
   - **Gaming**: Item in-game, karakter, land
   - **Collectibles**: Trading cards, memorabilia digital
   - **Music & Media**: Album, konten eksklusif
   - **Identity & Credentials**: Sertifikat, badge

### Decentralized Autonomous Organizations (DAOs)

DAO adalah entitas terdesentralisasi yang dikelola oleh anggotanya melalui smart contract.

1. **Struktur DAO**:
   - **Governance Token**: Memberikan hak suara
   - **Treasury**: Dana yang dikelola oleh DAO
   - **Proposal System**: Mekanisme untuk mengajukan perubahan
   - **Voting Mechanism**: Cara anggota memberikan suara

2. **Contoh DAO**:
   - **Protocol DAOs**: MakerDAO, Uniswap
   - **Investment DAOs**: MetaCartel, Flamingo
   - **Social DAOs**: Friends with Benefits
   - **Service DAOs**: RaidGuild, DeveloperDAO

### Identity on Web3

Identitas terdesentralisasi memungkinkan pengguna mengontrol data pribadi.

1. **Self-Sovereign Identity (SSI)**:
   - Pengguna memiliki dan mengontrol identitas digital
   - Tidak bergantung pada otoritas pusat
   - Verifiable Credentials untuk pembuktian klaim

2. **ENS (Ethereum Name Service)**:
   - Mengubah alamat wallet yang kompleks menjadi nama domain yang mudah dibaca
   - Contoh: "myname.eth" alih-alih "0x71C7656EC7ab..."
   - Mendukung resolusi ke berbagai sumber daya (wallet, website, IPFS)

---

## Setup Tools & Lingkungan Pengembangan

Untuk mengembangkan aplikasi Web3, kita memerlukan berbagai tools dan framework. Mari kita bahas secara lebih mendalam.

### 1. Node.js dan NPM

Node.js adalah runtime JavaScript yang memungkinkan eksekusi kode JavaScript di luar browser. NPM (Node Package Manager) adalah package manager untuk ekosistem Node.js.

**Instalasi Node.js**:

Pastikan Node.js telah terinstall. Cek instalasi dengan perintah:
```bash
node -v
npm -v
```

Untuk instalasi:
- **Windows/Mac**: Unduh dari [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**Package.json**:

File konfigurasi untuk proyek Node.js yang menentukan dependencies dan scripts.
```json
{
  "name": "my-web3-project",
  "version": "1.0.0",
  "description": "A Web3 project for the bootcamp",
  "main": "index.js",
  "scripts": {
    "test": "hardhat test",
    "compile": "hardhat compile",
    "deploy": "hardhat run scripts/deploy.js"
  },
  "dependencies": {
    "ethers": "^5.6.8"
  },
  "devDependencies": {
    "hardhat": "^2.9.9",
    "@nomiclabs/hardhat-waffle": "^2.0.3"
  }
}
```

### 2. Hardhat

Hardhat adalah development environment untuk Ethereum software yang menyediakan debugging, testing, dan deployment tools.

**Instalasi Hardhat**:

```bash
npm install --save-dev hardhat
```

**Inisialisasi Proyek Hardhat**:

```bash
npx hardhat
```
Pilih "Create a basic sample project" saat diminta.

**Struktur Proyek Hardhat**:

```
my-project/
├── contracts/        # Smart contracts Solidity
├── scripts/          # Scripts untuk deploy dan interaksi
├── test/             # Test files untuk smart contracts
├── .env              # Environment variables (API keys, private keys)
├── hardhat.config.js # Konfigurasi Hardhat
└── package.json      # Konfigurasi NPM
```

**Fitur Utama Hardhat**:

1. **Hardhat Network**:
   - Blockchain lokal untuk development
   - Built-in Solidity debugging
   - Console.log dalam kontrak Solidity
   - State reset dan fast-forward waktu

2. **Testing Framework**:
   - Integration dengan Mocha, Chai, Waffle
   - Gas reporting
   - Coverage analysis

3. **Task Runner**:
   - Automated workflows
   - Custom tasks

**Contoh Hardhat Config**:

```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: process.env.ALCHEMY_GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.ALCHEMY_MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
```

### 3. Foundry

Foundry adalah toolkit untuk Ethereum application development yang ditulis dalam Rust, menawarkan kinerja tinggi dan fitur canggih.

**Komponen Foundry**:

1. **Forge**: Testing framework untuk smart contracts
2. **Cast**: CLI untuk interaksi dengan EVM
3. **Anvil**: Local Ethereum node
4. **Chisel**: Solidity REPL (Read-Eval-Print Loop)

**Instalasi Foundry**:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Inisialisasi Proyek Foundry**:

```bash
forge init my-forge-project
```

**Struktur Proyek Foundry**:

```
my-forge-project/
├── src/            # Smart contracts
├── test/           # Tests
├── script/         # Deployment scripts
├── lib/            # Dependencies
└── foundry.toml    # Configuration
```

**Keunggulan Foundry**:

- Sangat cepat (ditulis dalam Rust)
- Testing dalam Solidity bukan JavaScript
- Fuzzing dan symbolic execution
- Trace output yang informatif

**Integrasi Hardhat + Foundry**:

Banyak developer menggunakan keduanya:
- Foundry untuk testing dan debugging
- Hardhat untuk deployment dan task automation

### 4. Git dan GitHub

Git adalah version control system yang melacak perubahan code, sementara GitHub adalah platform hosting untuk repositori Git.

**Setup Git**:

```bash
# Instalasi Git (Ubuntu/Debian)
sudo apt-get install git

# Konfigurasi
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Workflow GitHub Dasar**:

```bash
# Inisialisasi repo lokal
git init

# Tambahkan semua file
git add .

# Commit perubahan
git commit -m "Initial commit"

# Tambahkan repo remote
git remote add origin https://github.com/username/repo-name.git

# Push ke GitHub
git push -u origin main
```

**Best Practices Web3 dengan Git**:

- Jangan commit file .env yang berisi private keys
- Gunakan .gitignore untuk mengecualikan node_modules/, cache/, artifacts/
- Gunakan commit yang bermakna dengan pesan deskriptif
- Consider using branching strategy (main, develop, feature branches)

**Contoh .gitignore untuk Proyek Web3**:

```
# Hardhat/Node
node_modules
.env
coverage
coverage.json
typechain
typechain-types
artifacts
cache

# Foundry
out/
forge-cache/

# IDE
.vscode
.idea
*.swp
*.swo

# Misc
.DS_Store
```

### 5. Alchemy

Alchemy adalah platform blockchain developer yang menyediakan API, tools, dan infrastruktur untuk aplikasi Web3.

**Setup Alchemy**:

1. Daftar di [alchemy.com](https://www.alchemy.com/)
2. Buat aplikasi baru
3. Pilih jaringan (Ethereum Mainnet, Goerli, dll)
4. Dapatkan API key

**Integrasi dengan Hardhat**:

```javascript
// hardhat.config.js
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

**Fitur Alchemy**:

1. **Enhanced APIs**:
   - JSON-RPC dengan reliable performance
   - WebSocket support
   - Batch requests

2. **Developer Tools**:
   - Mempool watcher
   - Contract decoder
   - Transaction explorer
   - Gas price recommendations

3. **Analytics**:
   - Request volumes
   - Error rates
   - Response times

**Alternatif Alchemy**:

- Infura
- QuickNode
- Moralis
- Self-hosted nodes

### 6. Development Environment Setup

**VS Code Extensions untuk Web3 Development**:

- Solidity (Juan Blanco)
- Solidity Visual Developer
- Hardhat Solidity
- Solidity Metrics
- ESLint

**Wallet untuk Development**:

- MetaMask
  - Setup Testnet Networks
  - Managing multiple accounts
  - Connecting to local networks

**Faucets untuk Testnet Tokens**:

- Goerli ETH Faucet
- Mumbai (Polygon) Faucet
- Sepolia Faucet

---

## Hands-on: Deploy Smart Contract Dasar di Testnet

Mari kita mulai dengan membuat dan men-deploy smart contract sederhana.

### Langkah 1: Buat Smart Contract

Buat file baru di folder contracts dengan nama SimpleStorage.sol dan isikan dengan kode berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // Variabel state untuk menyimpan nilai
    uint256 public storedData;
    
    // Event yang dipancarkan saat nilai diperbarui
    event DataStored(address indexed caller, uint256 newValue, uint256 timestamp);

    // Constructor dijalankan saat kontrak di-deploy
    constructor(uint256 initialValue) {
        storedData = initialValue;
        emit DataStored(msg.sender, initialValue, block.timestamp);
    }

    // Fungsi untuk mengatur nilai storedData
    function set(uint256 x) public {
        storedData = x;
        emit DataStored(msg.sender, x, block.timestamp);
    }

    // Fungsi untuk mengambil nilai storedData
    function get() public view returns (uint256) {
        return storedData;
    }
    
    // Fungsi untuk menggandakan nilai yang disimpan
    function double() public {
        set(storedData * 2);
    }
    
    // Fungsi untuk mengatur nilai dan mengembalikan nilai lama
    function getAndSet(uint256 newValue) public returns (uint256 oldValue) {
        oldValue = storedData;
        storedData = newValue;
        emit DataStored(msg.sender, newValue, block.timestamp);
    }
}
```

**Penjelasan Kode**:

1. **SPDX-License-Identifier**: Menentukan lisensi kode
2. **pragma solidity ^0.8.0**: Menetapkan versi compiler
3. **storedData**: Variabel state yang menyimpan nilai
4. **DataStored event**: Dipancarkan saat nilai diubah
5. **constructor**: Dijalankan sekali saat deployment
6. **set()**: Mengubah nilai storedData
7. **get()**: Membaca nilai storedData
8. **double()**: Menggandakan nilai storedData
9. **getAndSet()**: Mengembalikan nilai lama dan menetapkan nilai baru

### Langkah 2: Konfigurasi Hardhat untuk Deploy

Buat atau modifikasi file hardhat.config.js dengan menambahkan konfigurasi untuk testnet menggunakan endpoint dari Alchemy:

```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

// Pengecekan environment variables
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!ALCHEMY_API_URL || !PRIVATE_KEY) {
  console.error("Please set your ALCHEMY_API_URL and PRIVATE_KEY in a .env file");
  process.exit(1);
}

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: ALCHEMY_API_URL,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.2  // Menambahkan sedikit gas untuk menghindari kegagalan transaksi
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
```

Buat file .env pada root proyek dan tambahkan variabel:

```
ALCHEMY_API_URL="https://eth-goerli.g.alchemy.com/v2/YOUR_API_KEY"
PRIVATE_KEY="your_wallet_private_key_here"
```

**PENTING**: Jangan pernah meng-commit file .env ke repositori publik! Tambahkan .env ke file .gitignore Anda.

### Langkah 3: Buat Script Deploy

Buat file scripts/deploy.js dengan isi:

```javascript
async function main() {
  // Mendapatkan signer (akun yang men-deploy kontrak)
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // Compile contract dan dapatkan factory
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  
  // Deploy dengan nilai awal 42
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await SimpleStorage.deploy(42);
  
  // Tunggu hingga kontrak benar-benar di-deploy
  await simpleStorage.deployed();
  
  console.log("SimpleStorage deployed to:", simpleStorage.address);
  console.log("Initial value:", (await simpleStorage.get()).toString());
  
  // Interaksi dasar dengan kontrak
  console.log("Setting value to 100...");
  const tx = await simpleStorage.set(100);
  await tx.wait(); // Tunggu konfirmasi
  
  console.log("New value:", (await simpleStorage.get()).toString());
  
  // Simpan informasi kontrak untuk verifikasi dan interaksi selanjutnya
  console.log("\nMenyimpan informasi deployment untuk verifikasi kontrak...");
  
  const data = {
    address: simpleStorage.address,
    network: network.name,
    deployedBy: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  // Informasi ini bisa disimpan ke file JSON untuk kemudahan akses selanjutnya
  fs.writeFileSync(
    `deployment-info-${network.name}.json`,
    JSON.stringify(data, null, 2)
  );
  
  console.log("Deployment selesai!");
}

// Pastikan untuk menangani error dengan benar
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error saat deploy:", error);
    process.exit(1);
  });
```

**Penjelasan Script Deploy**:

1. **Mendapatkan Signer**: `ethers.getSigners()` mengembalikan array signer (wallet) yang dikonfigurasi di hardhat.config.js.
2. **Contract Factory**: Object yang dapat men-deploy kontrak baru dari bytecode dan ABI.
3. **Deploy Kontrak**: `.deploy(42)` mengirimkan transaksi deployment dengan nilai awal 42.
4. **Menunggu Deployment**: `.deployed()` menunggu hingga transaksi dikonfirmasi.
5. **Interaksi dengan Kontrak**: Memanggil fungsi `set()` dan `get()` untuk menunjukkan interaksi.
6. **Simpan Info Deployment**: Menyimpan informasi penting seperti alamat kontrak untuk digunakan nanti.

### Langkah 4: Deploy ke Testnet

Untuk men-deploy kontrak ke testnet, jalankan perintah berikut:

```bash
npx hardhat run scripts/deploy.js --network goerli
```

**Penjelasan Proses Deploy**:

1. **Initiation**: Hardhat memulai task deployment.
2. **Compilation**: Semua smart contract dicompile jika ada perubahan.
3. **Provider Connection**: Terhubung ke node Ethereum melalui Alchemy.
4. **Transaction Creation**: Membuat transaksi deployment dengan compiled bytecode.
5. **Transaction Broadcast**: Mengirim transaksi ke network.
6. **Confirmation**: Menunggu konfirmasi blockhain (biasanya 1-2 menit di testnet).
7. **Address Assignment**: Mendapatkan alamat kontrak yang di-deploy.

**Memahami Transaksi Deployment**:

Setiap transaksi deployment melibatkan:
- **Nonce**: Jumlah transaksi yang sudah dikirim oleh akun.
- **Gas Price**: Harga per unit gas (dalam Gwei).
- **Gas Limit**: Jumlah maksimum gas untuk transaksi.
- **To**: Kosong untuk transaksi deployment (karena membuat kontrak baru).
- **Value**: ETH yang dikirim bersama transaksi (biasanya 0 untuk deployment).
- **Data**: Bytecode kontrak dan parameter constructor yang di-encoded.
- **Signature (v, r, s)**: Tanda tangan digital dari pengirim.

### Langkah 5: Verifikasi Kontrak 

Verifikasi kontrak di Etherscan memungkinkan orang lain melihat dan berinteraksi dengan kode kontrak Anda.

**Plugin Hardhat Etherscan**:

Tambahkan plugin verifikasi ke project:

```bash
npm install --save-dev @nomiclabs/hardhat-etherscan
```

Perbarui hardhat.config.js:

```javascript
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  // ... konfigurasi lainnya
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

**Proses Verifikasi**:

```bash
npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS "42"
```

Ganti `DEPLOYED_CONTRACT_ADDRESS` dengan alamat kontrak yang baru di-deploy. Parameter "42" adalah argumen constructor yang digunakan saat deployment.

**Manfaat Verifikasi**:

- Transparansi: Semua orang dapat melihat kode kontrak.
- Kemudahan interaksi: UI Etherscan untuk interaksi dengan kontrak.
- Kredibilitas: Menunjukkan bahwa kontrak Anda terbuka untuk diinspeksi.

### Langkah 6: Interaksi dengan Kontrak yang Sudah Dibangun

Setelah kontrak di-deploy, kita dapat berinteraksi dengannya melalui script terpisah.

**Buat File scripts/interact.js**:

```javascript
async function main() {
  // Inisialisasi kontrak dengan alamat yang sudah di-deploy
  const contractAddress = "DEPLOYED_CONTRACT_ADDRESS"; // Ganti dengan alamat kontrak Anda
  
  // Dapatkan kontrak dari alamatnya
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.attach(contractAddress);
  
  // Baca nilai saat ini
  const currentValue = await simpleStorage.get();
  console.log("Nilai saat ini:", currentValue.toString());
  
  // Update nilai
  console.log("Mengupdate nilai...");
  const tx = await simpleStorage.set(888);
  await tx.wait();
  
  // Baca nilai baru
  const newValue = await simpleStorage.get();
  console.log("Nilai baru:", newValue.toString());
  
  // Coba fungsi double
  console.log("Menjalankan fungsi double...");
  const doubleTx = await simpleStorage.double();
  await doubleTx.wait();
  
  // Baca nilai setelah double
  const doubledValue = await simpleStorage.get();
  console.log("Nilai setelah double:", doubledValue.toString());
  
  // Contoh penggunaan getAndSet
  console.log("Menjalankan getAndSet dengan nilai 123...");
  const oldValue = await simpleStorage.getAndSet(123);
  console.log("Nilai lama yang dikembalikan:", oldValue.toString());
  
  // Baca nilai final
  const finalValue = await simpleStorage.get();
  console.log("Nilai final:", finalValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
```

**Jalankan Script Interaksi**:

```bash
npx hardhat run scripts/interact.js --network goerli
```

## Integrasi dengan Frontend

Untuk mengintegrasikan smart contract dengan frontend, kita bisa menggunakan ethers.js atau web3.js. Berikut adalah contoh sederhana dengan ethers.js:

### Setup Proyek Frontend

```bash
# Buat direktori baru untuk frontend
mkdir frontend
cd frontend

# Inisialisasi proyek
npm init -y

# Install dependensi
npm install ethers react react-dom
```

### Contoh Integrasi Ethers.js dengan React

**App.js**:

```javascript
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleStorageABI from './SimpleStorage.json'; // ABI dari kompilasi Hardhat

function App() {
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState(0);
  const [newValue, setNewValue] = useState('');
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  
  // Inisialisasi kontrak dan provider saat komponen dimuat
  useEffect(() => {
    const init = async () => {
      // Cek apakah window.ethereum tersedia (MetaMask)
      if (window.ethereum) {
        try {
          // Minta akses ke akun pengguna
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          setAccount(accounts[0]);
          
          // Setup provider dan signer
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          
          // Inisialisasi kontrak
          const simpleStorageContract = new ethers.Contract(
            contractAddress,
            SimpleStorageABI.abi,
            signer
          );
          
          setContract(simpleStorageContract);
          
          // Load nilai awal
          const currentValue = await simpleStorageContract.get();
          setValue(currentValue.toString());
        } catch (error) {
          console.error("Error initializing:", error);
        }
      } else {
        alert("Please install MetaMask to use this dApp!");
      }
    };
    
    init();
  }, []);
  
  // Update nilai di kontrak
  const updateValue = async () => {
    if (contract && newValue) {
      setIsLoading(true);
      try {
        const tx = await contract.set(newValue);
        await tx.wait();
        
        // Refresh nilai setelah update
        const updatedValue = await contract.get();
        setValue(updatedValue.toString());
        setNewValue('');
      } catch (error) {
        console.error("Error updating value:", error);
      }
      setIsLoading(false);
    }
  };
  
  // Double nilai saat ini
  const doubleValue = async () => {
    if (contract) {
      setIsLoading(true);
      try {
        const tx = await contract.double();
        await tx.wait();
        
        // Refresh nilai setelah double
        const updatedValue = await contract.get();
        setValue(updatedValue.toString());
      } catch (error) {
        console.error("Error doubling value:", error);
      }
      setIsLoading(false);
    }
  };
  
  return (
    <div className="App">
      <h1>SimpleStorage dApp</h1>
      
      <p>Connected Account: {account ? account : "Not connected"}</p>
      
      <div>
        <h2>Current Value: {value}</h2>
        
        <div>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new value"
          />
          <button onClick={updateValue} disabled={isLoading}>
            {isLoading ? "Processing..." : "Update Value"}
          </button>
        </div>
        
        <button onClick={doubleValue} disabled={isLoading}>
          {isLoading ? "Processing..." : "Double Value"}
        </button>
      </div>
    </div>
  );
}

export default App;
```

## Keamanan Smart Contract

Keamanan sangat penting dalam pengembangan smart contract karena kesalahan bisa mengakibatkan kerugian finansial nyata.

### Vulnerabilitas Umum

1. **Reentrancy**
   - Terjadi ketika fungsi eksternal dipanggil sebelum efek internal kontrak selesai
   - Solusi: Pola Checks-Effects-Interactions, ReentrancyGuard

   ```solidity
   // Vulnerable
   function withdraw() public {
       uint amount = balances[msg.sender];
       (bool success, ) = msg.sender.call{value: amount}("");
       require(success);
       balances[msg.sender] = 0; // Terlalu terlambat!
   }
   
   // Fixed
   function withdraw() public {
       uint amount = balances[msg.sender];
       balances[msg.sender] = 0; // Update state dulu
       (bool success, ) = msg.sender.call{value: amount}("");
       require(success);
   }
   ```

2. **Integer Overflow/Underflow**
   - Terjadi ketika hasil operasi aritmatika keluar dari batas tipe data
   - Solisi: Gunakan SafeMath untuk Solidity < 0.8.0 atau gunakan Solidity ≥ 0.8.0

   ```solidity
   // Solidity ≥ 0.8.0 sudah aman secara default
   // Untuk Solidity < 0.8.0, gunakan SafeMath:
   using SafeMath for uint256;
   function increment(uint256 x) public pure returns (uint256) {
       return x.add(1); // Menggunakan SafeMath add
   }
   ```

3. **Unauthorized Access**
   - Fungsi sensitif tidak memiliki kontrol akses yang cukup
   - Solusi: Modifier untuk membatasi akses

   ```solidity
   // Access control modifier
   modifier onlyOwner() {
       require(msg.sender == owner, "Not owner");
       _;
   }
   
   // Terapkan pada fungsi sensitif
   function withdraw() public onlyOwner {
       // ...
   }
   ```

4. **Front-Running**
   - Penyerang melihat transaksi di mempool dan mengirim transaksi dengan gas price lebih tinggi
   - Solusi: Commitment scheme, batasan minimum/maksimum

5. **Denial of Service (DoS)**
   - Kontrak menjadi tidak dapat dioperasikan karena kesalahan logika
   - Solusi: Hindari loop eksternal, gunakan pola pull payment

### Tools & Best Practices

1. **Testing**
   - Unit testing dengan Hardhat atau Foundry
   - Integration testing dengan testnet
   - Fuzz testing untuk menemukan edge cases

2. **Auditing**
   - Peer review
   - Formal verification
   - Professional audit

3. **Standards & Libraries**
   - OpenZeppelin Contracts: Library standar yang sudah diaudit
   - EIPs (Ethereum Improvement Proposals): Standar implementasi

4. **Design Patterns**
   - Checks-Effects-Interactions
   - Emergency Stop (Circuit Breaker)
   - Upgradeable Contracts dengan proxy pattern

## Referensi & Tools Lanjutan

### Dokumentasi & Tutorial

1. **Ethereum Development Documentation**:
   - [Ethereum Developer Portal](https://ethereum.org/developers/)
   - [Solidity Documentation](https://docs.soliditylang.org/)
   - [Ethers.js Documentation](https://docs.ethers.io/)

2. **Community Resources**:
   - [CryptoZombies](https://cryptozombies.io/) - Tutorial interaktif
   - [Solidity by Example](https://solidity-by-example.org/)
   - [Ethereum Stackexchange](https://ethereum.stackexchange.com/)

### Tools Lanjutan

1. **Development Frameworks**:
   - Truffle Suite
   - Brownie (Python-based)
   - Remix IDE (Web-based)

2. **Testing & Analysis**:
   - Slither: Static analyzer
   - MythX: Security analysis platform
   - Tenderly: Debug transactions

3. **Monitoring & Analytics**:
   - The Graph: Indexing protocol
   - Dune Analytics: Data visualization

### Komunitas & Pembelajaran

1. **Communities**:
   - Ethereum Magicians Forum
   - Discord communities (Ethereum, DAOs, etc.)
   - Local Ethereum meetups

2. **Ongoing Education**:
   - ETHGlobal Hackathons
   - Developer grants programs
   - Academic courses & certifications

## Kesimpulan

Pada sesi pertama ini, Anda telah:

1. Mempelajari konsep dasar Web3, blockchain, dan aplikasi terdesentralisasi
2. Memahami cara kerja Ethereum Virtual Machine (EVM) dan implikasinya
3. Mengenal perbedaan antara EOA dan Smart Contract Wallet
4. Belajar tentang keamanan dalam pengembangan smart contract
5. Menyiapkan lingkungan pengembangan dengan tools modern (Node.js, Hardhat, Foundry)
6. Berhasil men-deploy dan berinteraksi dengan smart contract di testnet

Sesi ini merupakan fondasi penting untuk memperdalam pemahaman Anda tentang ekosistem Web3 dan pengembangan aplikasi terdesentralisasi. Pastikan untuk terus bereksperimen dengan konsep dan kode yang telah dipelajari.

**Tugas untuk Dikerjakan**:

1. Modifikasi kontrak SimpleStorage untuk menambahkan fitur baru (misalnya, tambahkan fungsi increment/decrement)
2. Deploy kontrak custom Anda ke testnet lain (seperti Sepolia atau Mumbai)
3. Buat frontend sederhana untuk berinteraksi dengan kontrak menggunakan ethers.js
4. Eksplorasi penggunaan library OpenZeppelin untuk menerapkan standar kontrak umum

**Catatan Penting**: Selalu prioritaskan keamanan dalam pengembangan Web3. Jangan pernah menyimpan private key dalam kode atau repository publik, dan selalu uji kontrak secara menyeluruh sebelum men-deploy ke mainnet.

Selamat datang di dunia Web3 Development! Semoga perjalanan Anda menyenangkan dan bermanfaat!