---
id: sesi-6
title: "Sesi 6: L2 Deployment & Multichain Strategy"
sidebar_label: "Sesi 6: L2 Deployment & Multichain Strategy"
description: "Mempelajari teknologi Layer 2, strategi multichain, dan melakukan deployment kontrak ke berbagai L2."
---

# Sesi 6: L2 Deployment & Multichain Strategy

Selamat datang di sesi keenam Bootcamp **Web3 Hacker House**! Pada sesi ini, kita akan mempelajari teknologi Layer 2 (L2) untuk skalabilitas Ethereum, strategi pengembangan multichain, dan melakukan deployment smart contract ke berbagai solusi L2 populer. Di akhir sesi, kita akan melakukan hands-on dengan deployment dan verifikasi kontrak ke multiple chain serta mengintegrasikan dengan block explorer.

---

## Bagian 1: Pengantar Solusi Skalabilitas Layer 2

Ethereum menghadapi tantangan "trilema blockchain" - keseimbangan antara keamanan, desentralisasi, dan skalabilitas. Layer 2 hadir sebagai solusi off-chain yang dibangun di atas blockchain Layer 1 (seperti Ethereum mainnet) untuk meningkatkan skalabilitas tanpa mengorbankan keamanan dan desentralisasi.

### 1.1 Masalah Skalabilitas Ethereum L1

Layer 1 Ethereum menghadapi beberapa batasan:

1. **Throughput Rendah**: Sekitar 15-30 transaksi per detik (TPS)
2. **Biaya Gas Tinggi**: Pada periode congestion, biaya transaksi bisa sangat mahal
3. **Waktu Konfirmasi Lambat**: Membutuhkan beberapa konfirmasi blok untuk finality
4. **Keterbatasan Komputasi**: Gas limit per blok membatasi kompleksitas transaksi

Sejak peluncuran Ethereum Mainnet, komunitas telah bereksperimen dengan berbagai solusi skalabilitas:

- Perubahan pada Layer 1 (mis. Ethereum 2.0/The Merge)
- Sidechains (mis. Polygon PoS)
- Solusi Layer 2 (Rollups, State Channels, Plasma)

### 1.2 Pengantar Layer 2 (L2)

Layer 2 adalah solusi skalabilitas yang beroperasi di atas Layer 1, memanfaatkan keamanan L1 sambil memproses transaksi secara off-chain.

**Kategori Utama L2:**

1. **Rollups**: Mengeksekusi transaksi off-chain tetapi mengirimkan data transaksi ke L1
   - **Optimistic Rollups**: Mengasumsikan transaksi valid, dengan periode challenge untuk keamanan
   - **ZK Rollups**: Menggunakan bukti kriptografis (zero-knowledge proofs) untuk memvalidasi transaksi
   
2. **State Channels**: Membuka channel untuk transaksi berulang antara pihak-pihak yang sama
   
3. **Plasma**: Membuat rantai anak yang berkomunikasi dengan mainnet melalui kontrak root

4. **Validium**: Mirip dengan ZK Rollups tetapi menyimpan data di luar chain

**Perbandingan Dengan Solusi Lain:**

- **Sidechain**: Chain terpisah dengan mekanisme konsensus sendiri, dengan jembatan ke mainnet
- **Appchain/L1 Alternatif**: Blockchain sendiri, dirancang khusus untuk aplikasi/ekosistem tertentu

### 1.3 Optimistic Rollups

Optimistic Rollups adalah solusi L2 yang mengeksekusi komputasi off-chain tetapi mengirimkan data transaksi ke L1 sebagai "calldata".

#### Cara Kerja Optimistic Rollups:

1. **Pengumpulan Transaksi**: Transaksi dikumpulkan dan diproses oleh "sequencer"
2. **Publikasi Batch**: Sequencer mempublikasikan data transaksi ke L1 sebagai calldata
3. **Optimistic Assumption**: Rollup mengasumsikan semua transaksi valid (optimistic)
4. **Periode Challenge**: Terdapat periode challenge (biasanya 7 hari) di mana siapapun dapat membuktikan transaksi invalid
5. **Finalisasi**: Setelah periode challenge berakhir, state dianggap final

#### Kelebihan Optimistic Rollups:

- **EVM Compatible**: Mendukung smart contract Ethereum yang ada dengan sedikit atau tanpa modifikasi
- **Biaya Lebih Rendah**: Biaya gas signifikan lebih rendah dibanding mainnet
- **Throughput Tinggi**: Dapat meningkatkan throughput hingga 10-100x

#### Keterbatasan Optimistic Rollups:

- **Periode Withdrawal Panjang**: Harus menunggu periode challenge untuk menarik dana ke L1
- **Validasi Lambat**: Finality bergantung pada periode challenge
- **Kelemahan MEV**: Masih rentan terhadap Miner Extractable Value (MEV)

#### Contoh Optimistic Rollups:

1. **Optimism**: 
   - EVM equivalent (Bedrock)
   - Fault proofs dalam pengembangan
   - Ecosystem yang besar termasuk Uniswap, Synthetix

2. **Base**:
   - Dibangun oleh Coinbase di atas OP Stack
   - EVM equivalent
   - Fokus pada adopsi mainstream dan UX

3. **Arbitrum**:
   - Interactive fraud proofs
   - Arsitektur multi-rollup (Orbit)
   - Mendukung AnyTrust dan Validium

### 1.4 ZK Rollups

ZK Rollups adalah solusi L2 yang menggunakan bukti kriptografis (zero-knowledge proofs) untuk memvalidasi transaksi tanpa mempublikasikan semua data on-chain.

#### Cara Kerja ZK Rollups:

1. **Pengumpulan Transaksi**: Transaksi dikumpulkan oleh operator ZK Rollup
2. **Komputasi State**: Operator memproses transaksi dan menghitung state baru
3. **Pembuatan Bukti**: Operator menghasilkan zero-knowledge proof untuk transisi state
4. **Verifikasi On-chain**: Proof diverifikasi oleh kontrak on-chain di L1
5. **Finalisasi**: Setelah verifikasi, state baru dianggap valid dan final

#### Jenis Zero-Knowledge Proofs:

1. **zk-SNARKs** (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)
   - Lebih efisien untuk verifikasi on-chain
   - Memerlukan trusted setup
   - Digunakan oleh zkSync Era, Polygon zkEVM

2. **zk-STARKs** (Zero-Knowledge Scalable Transparent Argument of Knowledge)
   - Tidak memerlukan trusted setup
   - Bukti lebih besar, biaya verifikasi lebih tinggi
   - Lebih tahan terhadap komputasi kuantum
   - Digunakan oleh StarkNet

#### Kelebihan ZK Rollups:

- **Finality Cepat**: Tidak ada periode challenge, withdrawal lebih cepat
- **Keamanan Lebih Tinggi**: Jaminan kriptografis untuk validitas state
- **Data On-chain Lebih Sedikit**: Mengurangi biaya calldata
- **Privasi Potensial**: Mendukung fitur privasi (di beberapa implementasi)

#### Keterbatasan ZK Rollups:

- **Komputasi yang Intensif**: Pembuatan proof memerlukan komputasi yang intensif
- **Kompatibilitas EVM Terbatas**: Beberapa ZK Rollup memerlukan modifikasi kode Solidity
- **Kompleksitas Teknis**: Lebih kompleks secara matematis dan implementasi

#### Contoh ZK Rollups:

1. **zkSync Era**:
   - Kompatibilitas EVM tingkat tinggi
   - Menggunakan zkEVM untuk eksekusi smart contract
   - Account abstraction native

2. **Polygon zkEVM**:
   - Upaya untuk mencapai kompatibilitas EVM yang lengkap
   - Fokus pada pengalaman developer yang seamless

3. **StarkNet**:
   - Menggunakan bahasa Cairo untuk smart contract
   - Fokus pada keamanan dan skalabilitas
   - Mendukung komputasi paralel

4. **Scroll**:
   - Secara teknis full EVM equivalent
   - Dikembangkan sejalan dengan spesifikasi Ethereum
   - Mendukung native account abstraction

### 1.5 Validium

Validium adalah variasi dari ZK Rollups di mana data state disimpan off-chain (tidak di-commit ke L1). Seperti ZK Rollups, Validium menggunakan zero-knowledge proofs untuk memvalidasi transaksi.

#### Cara Kerja Validium:

1. **Pengumpulan Transaksi**: Transaksi dikumpulkan oleh operator Validium
2. **State Management Off-chain**: Data state disimpan sepenuhnya off-chain
3. **Pembuatan Bukti**: Operator menghasilkan zero-knowledge proof untuk transisi state
4. **Verifikasi On-chain**: Proof diverifikasi oleh kontrak on-chain di L1
5. **Data Availability Committee**: Kelompok yang bertanggung jawab untuk menjaga ketersediaan data

#### Kelebihan Validium:

- **Throughput Sangat Tinggi**: Lebih tinggi dari ZK Rollups karena data tidak perlu on-chain
- **Biaya Terendah**: Menghilangkan biaya calldata L1
- **Finality Cepat**: Seperti ZK Rollups, tidak ada periode challenge
- **Privasi yang Ditingkatkan**: Data transaksi tidak tersedia secara publik

#### Keterbatasan Validium:

- **Risiko Ketersediaan Data**: Jika DAC (Data Availability Committee) berkolusi, dana bisa terkunci
- **Asumsi Kepercayaan**: Mengandalkan DAC untuk menjaga ketersediaan data
- **Kompatibilitas EVM Terbatas**: Mirip dengan ZK Rollups

#### Contoh Validium:

1. **StarkEx**: 
   - Platform untuk aplikasi tertentu seperti dYdX dan ImmutableX
   - Throughput sangat tinggi untuk use case seperti trading dan gaming

2. **DeversiFi**: 
   - Pertukaran terdesentralisasi dengan privasi tinggi
   - Menggunakan StarkEx sebagai teknologi dasar

3. **zkPorter** (bagian dari zkSync): 
   - Hybrid antara ZK Rollup dan Validium
   - Pengguna dapat memilih antara keamanan atau biaya lebih rendah

### 1.6 Perbandingan Solusi L2

| Fitur | Optimistic Rollups | ZK Rollups | Validium |
|-------|-------------------|-----------|----------|
| **Keamanan** | Tinggi (Fraud Proofs) | Sangat Tinggi (ZK Proofs) | Tinggi dengan Trade-offs |
| **Finality** | 7+ hari | Beberapa menit | Beberapa menit |
| **Throughput** | ~1,000 TPS | ~2,000 TPS | ~10,000+ TPS |
| **Biaya** | Rendah | Sangat Rendah | Terendah |
| **Kompatibilitas EVM** | Tinggi | Bervariasi | Bervariasi |
| **Kompleksitas** | Sedang | Tinggi | Tinggi |
| **Ketersediaan Data** | On-chain | On-chain | Off-chain |
| **Pengurangan Biaya** | ~10x | ~50x | ~100x+ |

---

## Bagian 2: Ekosistem L2 dan Strategi Multichain

Dengan berkembangnya berbagai solusi L2, pengembang Web3 harus mempertimbangkan strategi multichain untuk aplikasi mereka. Mari kita telaah ekosistem L2 saat ini dan strategi untuk deployment multichain.

### 2.1 Memahami Ekosistem L2 Saat Ini

#### Optimistic Rollups Utama:

1. **Optimism**
   - **Status**: Mainnet
   - **Token**: OP (governance)
   - **TVL**: ~$3-4 milyar
   - **Gas Savings**: ~70-90% vs L1
   - **Ecosystem**: Uniswap, Synthetix, Aave, 1inch, dYdX

2. **Base** (Coinbase)
   - **Status**: Mainnet
   - **Token**: Belum ada
   - **TVL**: ~$600-700 juta
   - **Gas Savings**: ~70-90% vs L1
   - **Ecosystem**: Berkembang cepat, dukungan dari Coinbase

3. **Arbitrum**
   - **Status**: Mainnet
   - **Token**: ARB (governance)
   - **TVL**: ~$6-7 milyar
   - **Gas Savings**: ~90-95% vs L1
   - **Ecosystem**: GMX, Uniswap, Aave, SushiSwap

#### ZK Rollups Utama:

1. **zkSync Era**
   - **Status**: Mainnet
   - **Token**: Belum ada
   - **TVL**: ~$200-300 juta
   - **Gas Savings**: ~90-95% vs L1
   - **Ecosystem**: Sedang berkembang, SyncSwap, Mute

2. **Polygon zkEVM**
   - **Status**: Mainnet
   - **Token**: MATIC (shared dengan Polygon ecosystem)
   - **TVL**: ~$80-100 juta
   - **Gas Savings**: ~90-95% vs L1
   - **Ecosystem**: Berkembang, QuickSwap, Lens Protocol

3. **Scroll**
   - **Status**: Mainnet
   - **Token**: Belum ada
   - **TVL**: ~$50-60 juta
   - **Gas Savings**: ~90-95% vs L1
   - **Ecosystem**: Sedang berkembang, ScrollSwap

4. **StarkNet**
   - **Status**: Mainnet
   - **Token**: STRK
   - **TVL**: ~$100-150 juta
   - **Gas Savings**: ~95-99% vs L1
   - **Ecosystem**: dYdX, Immutable X, JediSwap

5. **Linea** (Consensys)
   - **Status**: Mainnet
   - **Token**: Belum ada
   - **TVL**: ~$30-40 juta
   - **Gas Savings**: ~90-95% vs L1
   - **Ecosystem**: Sedang berkembang, dukungan dari MetaMask

### 2.2 Memilih L2 untuk Aplikasi: Faktor-Faktor yang Perlu Dipertimbangkan

1. **Kompatibilitas EVM**
   - Seberapa mudah memigrasi kode Solidity yang ada?
   - Apakah memerlukan modifikasi atau compiler khusus?

2. **Keamanan & Maturity**
   - Berapa lama L2 telah beroperasi?
   - Apakah telah diaudit secara eksternal?
   - Apakah ada bug atau exploit sebelumnya?

3. **Likuiditas & Userbase**
   - Seberapa banyak TVL (Total Value Locked) di L2?
   - Apakah ada bridge likuiditas yang kuat dengan L1?
   - Berapa banyak pengguna aktif?

4. **Ekosistem & Infrastruktur**
   - Apa toolkit developer yang tersedia?
   - Apakah oracle, indexer, dan layanan infrastruktur lainnya tersedia?
   - Apakah wallet populer mendukungnya?

5. **Biaya & Performa**
   - Berapa biaya gas untuk operasi umum?
   - Berapa TPS dan waktu finality?
   - Berapa lama withdrawal ke L1?

6. **Interoperabilitas**
   - Seberapa baik terintegrasi dengan L1 dan L2 lainnya?
   - Apakah ada bridge yang aman dan efisien?

7. **Tim & Pendanaan**
   - Siapa yang mengembangkan/mengoperasikan L2?
   - Bagaimana model bisnis dan pendanaannya?
   - Apakah ada token dan tokenomics?

8. **Regulator & Compliance**
   - Apakah ada perbedaan dalam posisi regulatori?
   - Apakah L2 memiliki risiko regulatori khusus?

### 2.3 Strategi Deployment Multichain

Pendekatan untuk strategi multichain dapat bervariasi berdasarkan kebutuhan aplikasi:

#### 1. Pendekatan Hub-and-Spoke

- **Konsep**: Deploy versi utama di L1 atau L2 utama, lalu bridge ke chain lain
- **Use Case**: Aplikasi dengan kebutuhan komposabilitas tinggi
- **Contoh**: Aave, Uniswap

```
               ┌─────── L2A ───────┐
               │                    │
L1 Ethereum ◄──┼── Main Deployment ├──► L2B
               │                    │
               └─────── L2C ───────┘
```

#### 2. Pendekatan Chain-Agnostic

- **Konsep**: Desain aplikasi yang dapat berjalan secara identik di berbagai chain
- **Use Case**: Aplikasi yang memerlukan jangkauan pengguna luas
- **Contoh**: 1inch, SushiSwap

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  L1         │    │  L2A        │    │  L2B        │
│  Deployment │    │  Deployment │    │  Deployment │
│  (Identical)│    │  (Identical)│    │  (Identical)│
└─────────────┘    └─────────────┘    └─────────────┘
```

#### 3. Pendekatan Chain-Specific

- **Konsep**: Deploy versi berbeda yang dioptimalkan untuk setiap chain
- **Use Case**: Aplikasi yang memanfaatkan fitur unik setiap chain
- **Contoh**: dYdX, Immutable X

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  L1         │    │  L2A        │    │  L2B        │
│  Core       │    │  Trading    │    │  Gaming     │
│  Governance │    │  Features   │    │  Features   │
└─────────────┘    └─────────────┘    └─────────────┘
```

#### 4. Pendekatan Multichain Sinkronisasi State

- **Konsep**: Menjaga state yang sama di beberapa chain dengan protokol messaging
- **Use Case**: Aplikasi dengan kebutuhan konsistensi state
- **Contoh**: Connext, LayerZero, Axelar, Hyperlane

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  L1         │◄──►│  L2A        │◄──►│  L2B        │
│  Deployment │    │  Deployment │    │  Deployment │
└─────────────┘    └─────────────┘    └─────────────┘
        ▲                 ▲                  ▲
        │                 │                  │
        └────── Cross-Chain Messaging ───────┘
```

### 2.4 Bridging dan Cross-Chain Interoperabilitas

Interoperabilitas antar chain menjadi faktor kritis untuk ekosistem multichain. Beberapa teknologi bridge dan messaging:

#### 1. Optimistic Bridges

- **Cara Kerja**: Menggunakan mekanisme challenge/dispute seperti Optimistic Rollups
- **Contoh**: Nomad, Optimism's Bridge

```solidity
// Simplified Optimistic Bridge Withdrawal
function initiateWithdrawal(
    address _recipient,
    uint256 _amount,
    bytes32 _l2TxHash
) external {
    // Store withdrawal request with timestamp
    withdrawals[nextWithdrawalId] = Withdrawal({
        recipient: _recipient,
        amount: _amount,
        timestamp: block.timestamp,
        l2TxHash: _l2TxHash,
        finalized: false
    });
    
    emit WithdrawalInitiated(nextWithdrawalId, _recipient, _amount, _l2TxHash);
    nextWithdrawalId++;
}

// After challenge period (e.g., 7 days)
function finalizeWithdrawal(uint256 _withdrawalId) external {
    Withdrawal storage withdrawal = withdrawals[_withdrawalId];
    require(block.timestamp >= withdrawal.timestamp + 7 days, "Challenge period not over");
    require(!withdrawal.finalized, "Already finalized");
    
    withdrawal.finalized = true;
    token.transfer(withdrawal.recipient, withdrawal.amount);
    
    emit WithdrawalFinalized(_withdrawalId);
}
```

#### 2. ZK Bridges

- **Cara Kerja**: Menggunakan zero-knowledge proofs untuk memverifikasi state antar chain
- **Contoh**: zkSync Bridge, Polygon zkEVM Bridge

```solidity
// Simplified ZK Bridge Verification
function verifyAndExecute(
    bytes calldata _zkProof,
    bytes calldata _publicInputs
) external {
    // Verify the ZK proof against public inputs
    require(zkVerifier.verify(_zkProof, _publicInputs), "Invalid proof");
    
    // Extract transaction data from public inputs
    (address recipient, uint256 amount) = abi.decode(_publicInputs, (address, uint256));
    
    // Execute the transfer
    token.transfer(recipient, amount);
    
    emit BridgeCompleted(recipient, amount);
}
```

#### 3. Light Client Bridges

- **Cara Kerja**: Melacak header blockchain dan memverifikasi bukti Merkle
- **Contoh**: Rainbow Bridge (Near-Ethereum)

#### 4. External Validator Bridges

- **Cara Kerja**: Mengandalkan set validator untuk verifikasi dan relaying pesan
- **Contoh**: Axelar, Wormhole, LayerZero

#### 5. Framework Messaging Multichain

- **Cara Kerja**: Protokol generik untuk mengirim pesan antar chain
- **Contoh**: LayerZero, Axelar, Hyperlane

```solidity
// Using LayerZero for cross-chain messaging
import "@layerzerolabs/solidity-examples/contracts/interfaces/ILayerZeroEndpoint.sol";

contract CrossChainApplication {
    ILayerZeroEndpoint public endpoint;
    
    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }
    
    // Send a message to another chain
    function sendMessage(
        uint16 _dstChainId,
        bytes calldata _payload
    ) external payable {
        // Send the message through LayerZero
        endpoint.send{value: msg.value}(
            _dstChainId,           // destination chain id
            abi.encodePacked(address(this)), // destination address (this contract on dst chain)
            _payload,              // payload
            payable(msg.sender),   // refund address
            address(0),            // future parameter
            bytes("")              // adapter parameters
        );
    }
    
    // Receive a message from another chain
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) external {
        // Validate sender
        require(msg.sender == address(endpoint), "Invalid sender");
        
        // Process the received message
        _processReceivedMessage(_srcChainId, _srcAddress, _payload);
    }
    
    function _processReceivedMessage(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        bytes calldata _payload
    ) internal {
        // Application-specific logic
    }
}
```

### 2.5 Tantangan Pengembangan Multichain

Deployment multichain memiliki beberapa tantangan yang harus diatasi:

#### 1. Kompleksitas Manajemen State

- **Tantangan**: Menjaga konsistensi state antar chain
- **Solusi**: Protocols state-sync, sequencer terpusat, atau arsitektur hub-and-spoke

#### 2. UX Fragmentation

- **Tantangan**: Pengalaman pengguna terpecah antar chain
- **Solusi**: Wallet multi-chain, account abstraction, gas abstraction

#### 3. Keamanan Bridges

- **Tantangan**: Bridge sering menjadi target hack dan exploit
- **Solusi**: Audit menyeluruh, batasan withdrawal, multi-sig

#### 4. Tokenomics Lintas Chain

- **Tantangan**: Mengelola token dan likuiditas di beberapa chain
- **Solusi**: Desain tokenomics yang mempertimbangkan penggunaan multichain

#### 5. Pengembangan dan Testing

- **Tantangan**: Testing dan debugging aplikasi multichain kompleks
- **Solusi**: Framework testing khusus multichain, logging dan monitoring terpadu

---

## Bagian 3: Deployment ke L2 Populer

Setelah memahami konsep dasar L2 dan strategi multichain, kita akan mempelajari cara melakukan deployment ke beberapa L2 populer: Scroll, Base, zkSync, dan Linea.

### 3.1 Persiapan Deployment Multichain

Sebelum melakukan deployment ke multiple L2, kita perlu menyiapkan beberapa hal:

#### 1. Setup Environtment Multichain

**Project Directory Structure:**

```
project/
├── contracts/
│   ├── YourContract.sol
│   └── interfaces/
├── scripts/
│   ├── deploy.ts
│   ├── verify.ts
│   └── chains/
│       ├── base.ts
│       ├── scroll.ts
│       ├── zksync.ts
│       └── linea.ts
├── test/
├── hardhat.config.ts
├── zksolc.json          # zkSync compiler config
└── .env                 # Environment variables
```

**Environment Variables (.env):**

```
# Private key and RPC endpoints
PRIVATE_KEY=your_private_key_without_0x_prefix

# Ethereum Sepolia (testnet)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key

# Scroll
SCROLL_SEPOLIA_RPC_URL=https://sepolia-rpc.scroll.io
SCROLLSCAN_API_KEY=your_scrollscan_api_key

# Base
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key

# zkSync Era
ZKSYNC_SEPOLIA_RPC_URL=https://sepolia.era.zksync.dev
ZKSYNC_API_KEY=your_zksync_api_key

# Linea
LINEA_SEPOLIA_RPC_URL=https://rpc.sepolia.linea.build
LINEASCAN_API_KEY=your_lineascan_api_key

# Block Explorer API keys
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### 2. Setup Hardhat Configuration

Konfigurasi Hardhat untuk mendukung deployment multichain:

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync-solc"; // For zkSync
import "@matterlabs/hardhat-zksync-deploy"; // For zkSync
import "@matterlabs/hardhat-zksync-verify"; // For zkSync verification
import "hardhat-deploy";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure private key exists
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // zkSync specific compiler settings
  zksolc: {
    version: "1.3.13",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    // Ethereum testnet
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [PRIVATE_KEY],
    },
    // Scroll testnet
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC_URL || "https://sepolia-rpc.scroll.io",
      accounts: [PRIVATE_KEY],
    },
    // Base testnet
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
    },
    // zkSync testnet
    zkSyncSepolia: {
      url: process.env.ZKSYNC_SEPOLIA_RPC_URL || "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      accounts: [PRIVATE_KEY],
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    // Linea testnet
    lineaSepolia: {
      url: process.env.LINEA_SEPOLIA_RPC_URL || "https://rpc.sepolia.linea.build",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      // Ethereum
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      // Scroll
      scrollSepolia: process.env.SCROLLSCAN_API_KEY || "",
      // Base
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      // Linea
      lineaSepolia: process.env.LINEASCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.dev/api",
          browserURL: "https://sepolia.scrollscan.dev/",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/",
        },
      },
      {
        network: "lineaSepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build/",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

#### 3. Smart Contract yang Kompatibel Multichain

Mari buat contoh smart contract yang akan kita deploy ke berbagai L2. Kita akan membuat kontrak sederhana yang mencatat pesan antar chain:

```solidity
// contracts/CrossChainRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title CrossChainRegistry
 * @dev A simple registry contract for logging messages across different chains
 */
contract CrossChainRegistry {
    // Chain ID => message count
    mapping(uint256 => uint256) public messageCount;
    
    // Chain ID => index => message
    mapping(uint256 => mapping(uint256 => string)) public messages;
    
    // Metadata about chain
    string public chainName;
    uint256 public deploymentTimestamp;
    address public deployer;
    
    // Events
    event MessageLogged(uint256 indexed chainId, uint256 indexed index, string message);
    event ChainInfoUpdated(string chainName, uint256 timestamp);
    
    constructor(string memory _chainName) {
        chainName = _chainName;
        deploymentTimestamp = block.timestamp;
        deployer = msg.sender;
        
        emit ChainInfoUpdated(_chainName, block.timestamp);
    }
    
    /**
     * @dev Log a message for the current chain
     * @param message The message to log
     */
    function logMessage(string memory message) external {
        uint256 chainId = getChainId();
        uint256 index = messageCount[chainId];
        
        messages[chainId][index] = message;
        messageCount[chainId]++;
        
        emit MessageLogged(chainId, index, message);
    }
    
    /**
     * @dev Get the most recent message for a specific chain
     * @param chainId The chain ID to query
     * @return The most recent message or "No messages" if none exists
     */
    function getLatestMessage(uint256 chainId) external view returns (string memory) {
        if (messageCount[chainId] == 0) {
            return "No messages";
        }
        
        uint256 latestIndex = messageCount[chainId] - 1;
        return messages[chainId][latestIndex];
    }
    
    /**
     * @dev Get information about this deployment
     * @return Chain name, chain ID, deployment timestamp, and deployer address
     */
    function getDeploymentInfo() external view returns (
        string memory _chainName,
        uint256 _chainId,
        uint256 _deploymentTimestamp,
        address _deployer
    ) {
        return (
            chainName,
            getChainId(),
            deploymentTimestamp,
            deployer
        );
    }
    
    /**
     * @dev Get the current chain ID
     */
    function getChainId() public view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }
}
```

Kontrak ini memiliki beberapa fitur:
1. Menyimpan pesan untuk setiap chain berdasarkan chain ID
2. Mencatat metadata tentang chain tempat kontrak di-deploy
3. Event untuk logging aktivitas
4. Fungsi untuk mendapatkan informasi antar chain

### 3.2 Deployment ke Scroll

[Scroll](https://scroll.io/) adalah ZK Rollup yang didesain untuk kompatibilitas EVM secara lengkap (EVM equivalent) dan efisiensi yang tinggi.

#### Instalasi Dependensi

```bash
npm install @openzeppelin/contracts dotenv
```

#### Script Deployment Scroll

```typescript
// scripts/chains/scroll.ts
import { ethers } from "hardhat";
import { verifyContract } from "../verify";

async function main() {
  console.log("Deploying CrossChainRegistry to Scroll...");

  // Deploy the contract
  const CrossChainRegistry = await ethers.getContractFactory("CrossChainRegistry");
  const registry = await CrossChainRegistry.deploy("Scroll Sepolia");

  await registry.deployed();

  console.log(`CrossChainRegistry deployed to Scroll at: ${registry.address}`);

  // Get chain ID for verification
  const chainId = await registry.getChainId();
  console.log(`Chain ID: ${chainId}`);

  // Log a test message
  const tx = await registry.logMessage("Hello from Scroll Sepolia!");
  await tx.wait();
  console.log("Test message logged");

  // Verify the contract
  console.log("Verifying contract on Scrollscan...");
  try {
    await verifyContract("scrollSepolia", registry.address, ["Scroll Sepolia"]);
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  return registry.address;
}

// Execute deployment if this script is run directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
```

#### Script Verifikasi Kontrak

```typescript
// scripts/verify.ts
import { run } from "hardhat";

export async function verifyContract(
  network: string,
  contractAddress: string,
  constructorArguments: any[]
) {
  try {
    // Add delay to allow explorer to index the contract
    console.log("Waiting for contract to be indexed...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds

    await run("verify:verify", {
      network: network,
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
}
```

#### Deployment ke Scroll

```bash
npx hardhat run scripts/chains/scroll.ts --network scrollSepolia
```

### 3.3 Deployment ke Base

[Base](https://base.org/) adalah Optimistic Rollup yang dikembangkan oleh Coinbase, menggunakan teknologi dari OP Stack (Optimism).

#### Script Deployment Base

```typescript
// scripts/chains/base.ts
import { ethers } from "hardhat";
import { verifyContract } from "../verify";

async function main() {
  console.log("Deploying CrossChainRegistry to Base...");

  // Deploy the contract
  const CrossChainRegistry = await ethers.getContractFactory("CrossChainRegistry");
  const registry = await CrossChainRegistry.deploy("Base Sepolia");

  await registry.deployed();

  console.log(`CrossChainRegistry deployed to Base at: ${registry.address}`);

  // Get chain ID for verification
  const chainId = await registry.getChainId();
  console.log(`Chain ID: ${chainId}`);

  // Log a test message
  const tx = await registry.logMessage("Hello from Base Sepolia!");
  await tx.wait();
  console.log("Test message logged");

  // Verify the contract
  console.log("Verifying contract on Basescan...");
  try {
    await verifyContract("baseSepolia", registry.address, ["Base Sepolia"]);
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  return registry.address;
}

// Execute deployment if this script is run directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
```

#### Deployment ke Base

```bash
npx hardhat run scripts/chains/base.ts --network baseSepolia
```

### 3.4 Deployment ke zkSync Era

[zkSync Era](https://zksync.io/) adalah ZK Rollup dengan fokus pada skalabilitas, keamanan, dan pengalaman developer yang baik. Deployment ke zkSync sedikit berbeda karena memerlukan library khusus.

#### Instalasi Dependensi

```bash
npm install @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify zksync-web3
```

#### Script Deployment zkSync

```typescript
// scripts/chains/zksync.ts
import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";

dotenv.config();

// load hardhat.config.ts
const hre = require("hardhat");

async function main() {
  console.log("Deploying CrossChainRegistry to zkSync Era...");

  // Initialize the wallet
  const privateKey = process.env.PRIVATE_KEY || "";
  if (!privateKey) throw new Error("PRIVATE_KEY is not set");

  // Initialize the provider
  const provider = new ethers.providers.JsonRpcProvider(process.env.ZKSYNC_SEPOLIA_RPC_URL);
  const wallet = new Wallet(privateKey).connect(provider);

  // Create deployer
  const deployer = new Deployer(hre, wallet);

  // Deploy the contract
  const artifact = await deployer.loadArtifact("CrossChainRegistry");
  const registry = await deployer.deploy(artifact, ["zkSync Era Sepolia"]);

  console.log(`CrossChainRegistry deployed to zkSync at: ${registry.address}`);

  // Get chain ID
  const chainId = await registry.getChainId();
  console.log(`Chain ID: ${chainId}`);

  // Log a test message
  const tx = await registry.logMessage("Hello from zkSync Era Sepolia!");
  await tx.wait();
  console.log("Test message logged");

  // Verify the contract
  console.log("Verifying contract on zkSync Explorer...");
  try {
    await hre.run("verify:verify", {
      address: registry.address,
      contract: "contracts/CrossChainRegistry.sol:CrossChainRegistry",
      constructorArguments: ["zkSync Era Sepolia"],
      bytecode: artifact.bytecode,
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  return registry.address;
}

// Execute deployment if this script is run directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
```

#### Deployment ke zkSync

```bash
npx hardhat run scripts/chains/zksync.ts --network zkSyncSepolia
```

### 3.5 Deployment ke Linea

[Linea](https://linea.build/) adalah ZK Rollup yang dikembangkan oleh ConsenSys, pembuat MetaMask, yang fokus pada kompatibilitas EVM dan integrasi MetaMask.

#### Script Deployment Linea

```typescript
// scripts/chains/linea.ts
import { ethers } from "hardhat";
import { verifyContract } from "../verify";

async function main() {
  console.log("Deploying CrossChainRegistry to Linea...");

  // Deploy the contract
  const CrossChainRegistry = await ethers.getContractFactory("CrossChainRegistry");
  const registry = await CrossChainRegistry.deploy("Linea Sepolia");

  await registry.deployed();

  console.log(`CrossChainRegistry deployed to Linea at: ${registry.address}`);

  // Get chain ID for verification
  const chainId = await registry.getChainId();
  console.log(`Chain ID: ${chainId}`);

  // Log a test message
  const tx = await registry.logMessage("Hello from Linea Sepolia!");
  await tx.wait();
  console.log("Test message logged");

  // Verify the contract
  console.log("Verifying contract on Lineascan...");
  try {
    await verifyContract("lineaSepolia", registry.address, ["Linea Sepolia"]);
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  return registry.address;
}

// Execute deployment if this script is run directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
```

#### Deployment ke Linea

```bash
npx hardhat run scripts/chains/linea.ts --network lineaSepolia
```

### 3.6 Script Deployment Multichain

Sekarang mari buat script untuk mendeploy kontrak ke semua chain sekaligus dan melacak alamat deployment:

```typescript
// scripts/deploy-all.ts
import { writeFileSync } from "fs";
import scrollDeploy from "./chains/scroll";
import baseDeploy from "./chains/base";
import zksyncDeploy from "./chains/zksync";
import lineaDeploy from "./chains/linea";

async function main() {
  console.log("Starting multichain deployment...");
  
  const deployments: Record<string, string> = {};
  
  try {
    // Deploy to Scroll
    console.log("\n=== Deploying to Scroll ===");
    deployments.scroll = await scrollDeploy();
    
    // Deploy to Base
    console.log("\n=== Deploying to Base ===");
    deployments.base = await baseDeploy();
    
    // Deploy to zkSync
    console.log("\n=== Deploying to zkSync ===");
    deployments.zksync = await zksyncDeploy();
    
    // Deploy to Linea
    console.log("\n=== Deploying to Linea ===");
    deployments.linea = await lineaDeploy();
    
    // Save deployment addresses
    console.log("\n=== Deployment Summary ===");
    console.log(JSON.stringify(deployments, null, 2));
    
    // Write to deployments.json
    writeFileSync(
      "deployments.json",
      JSON.stringify(deployments, null, 2)
    );
    
    console.log("\nDeployments saved to deployments.json");
  } catch (error) {
    console.error("Error during deployment:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

#### Menjalankan Deployment Multichain

```bash
npx hardhat run scripts/deploy-all.ts
```

---

## Bagian 4: Hands-on: Deploy & Verifikasi Kontrak Multichain + Explorer Integration

Dalam bagian terakhir ini, kita akan mengembangkan frontend sederhana untuk berinteraksi dengan kontrak yang sudah di-deploy di berbagai L2 dan melihat bagaimana mengintegrasikan dengan block explorer.

### 4.1 Frontend untuk Aplikasi Multichain

Kita akan membuat aplikasi React sederhana yang dapat berinteraksi dengan kontrak kita di berbagai chain.

#### Setup Project

```bash
npx create-react-app multichain-frontend
cd multichain-frontend
npm install ethers@5.7.2 @web3modal/ethereum @web3modal/react wagmi viem
```

#### Configuration

```typescript
// src/config.ts
import { Chain } from "wagmi";

// Contract deployed addresses
export const CONTRACT_ADDRESSES = {
  scroll: "0x...", // Ganti dengan alamat kontrak Anda di Scroll
  base: "0x...",   // Ganti dengan alamat kontrak Anda di Base
  zksync: "0x...", // Ganti dengan alamat kontrak Anda di zkSync
  linea: "0x...",  // Ganti dengan alamat kontrak Anda di Linea
};

// Chain configurations
export const SUPPORTED_CHAINS: Record<string, Chain> = {
  scroll: {
    id: 534351,
    name: "Scroll Sepolia",
    network: "scroll-sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia-rpc.scroll.io"],
      },
      public: {
        http: ["https://sepolia-rpc.scroll.io"],
      },
    },
    blockExplorers: {
      default: {
        name: "ScrollScan",
        url: "https://sepolia.scrollscan.dev",
      },
    },
  },
  base: {
    id: 84532,
    name: "Base Sepolia",
    network: "base-sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia.base.org"],
      },
      public: {
        http: ["https://sepolia.base.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "BaseScan",
        url: "https://sepolia.basescan.org",
      },
    },
  },
  zksync: {
    id: 300,
    name: "zkSync Era Sepolia",
    network: "zksync-era-sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia.era.zksync.dev"],
      },
      public: {
        http: ["https://sepolia.era.zksync.dev"],
      },
    },
    blockExplorers: {
      default: {
        name: "zkSync Explorer",
        url: "https://sepolia.explorer.zksync.io",
      },
    },
  },
  linea: {
    id: 59141,
    name: "Linea Sepolia",
    network: "linea-sepolia",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.sepolia.linea.build"],
      },
      public: {
        http: ["https://rpc.sepolia.linea.build"],
      },
    },
    blockExplorers: {
      default: {
        name: "LineaScan",
        url: "https://sepolia.lineascan.build",
      },
    },
  },
};

// Contract ABI
export const CONTRACT_ABI = [
  "function logMessage(string memory message) external",
  "function getLatestMessage(uint256 chainId) external view returns (string memory)",
  "function getDeploymentInfo() external view returns (string memory _chainName, uint256 _chainId, uint256 _deploymentTimestamp, address _deployer)",
  "function getChainId() public view returns (uint256)",
  "event MessageLogged(uint256 indexed chainId, uint256 indexed index, string message)",
];
```

#### Web3 Context

```tsx
// src/contexts/Web3Context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABI, SUPPORTED_CHAINS } from "../config";

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  switchNetwork: (chainKey: string) => Promise<void>;
  currentChain: string | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  connectWallet: async () => {},
  switchNetwork: async () => {},
  currentChain: null,
  contract: null,
  isConnected: false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [currentChain, setCurrentChain] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  
  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // Create ethers provider and signer
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        const ethersSigner = ethersProvider.getSigner();
        const ethersAddress = await ethersSigner.getAddress();
        const network = await ethersProvider.getNetwork();
        
        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setAddress(ethersAddress);
        setChainId(network.chainId);
        
        // Determine current chain
        const chainKey = getChainKeyFromChainId(network.chainId);
        setCurrentChain(chainKey);
        
        // Initialize contract
        if (chainKey && CONTRACT_ADDRESSES[chainKey]) {
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESSES[chainKey],
            CONTRACT_ABI,
            ethersSigner
          );
          setContract(contractInstance);
        }
        
        return true;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return false;
      }
    } else {
      alert("Please install MetaMask!");
      return false;
    }
  };
  
  // Switch network
  const switchNetwork = async (chainKey: string) => {
    if (!provider) return;
    
    const chain = SUPPORTED_CHAINS[chainKey];
    if (!chain) {
      console.error(`Chain ${chainKey} not supported`);
      return;
    }
    
    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chain.id.toString(16)}` }],
      });
      
      // After switching, update provider and signer
      const updatedProvider = new ethers.providers.Web3Provider(window.ethereum);
      const updatedSigner = updatedProvider.getSigner();
      const network = await updatedProvider.getNetwork();
      
      setProvider(updatedProvider);
      setSigner(updatedSigner);
      setChainId(network.chainId);
      setCurrentChain(chainKey);
      
      // Initialize contract for this chain
      if (CONTRACT_ADDRESSES[chainKey]) {
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESSES[chainKey],
          CONTRACT_ABI,
          updatedSigner
        );
        setContract(contractInstance);
      }
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chain.id.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default.http,
                blockExplorerUrls: [chain.blockExplorers?.default.url],
              },
            ],
          });
          
          // Try switching again
          await switchNetwork(chainKey);
        } catch (addError) {
          console.error("Error adding chain:", addError);
        }
      } else {
        console.error("Error switching network:", error);
      }
    }
  };
  
  // Helper to get chain key from chain ID
  const getChainKeyFromChainId = (id: number): string | null => {
    for (const [key, chain] of Object.entries(SUPPORTED_CHAINS)) {
      if (chain.id === id) {
        return key;
      }
    }
    return null;
  };
  
  // Listen for network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        const chainKey = getChainKeyFromChainId(newChainId);
        setCurrentChain(chainKey);
        
        // Update contract
        if (chainKey && CONTRACT_ADDRESSES[chainKey] && signer) {
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESSES[chainKey],
            CONTRACT_ABI,
            signer
          );
          setContract(contractInstance);
        } else {
          setContract(null);
        }
      };
      
      window.ethereum.on("chainChanged", handleChainChanged);
      
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [signer]);
  
  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        connectWallet,
        switchNetwork,
        currentChain,
        contract,
        isConnected: !!address,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
```

#### Komponen Chain Selector

```tsx
// src/components/ChainSelector.tsx
import React from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { SUPPORTED_CHAINS } from "../config";

const ChainSelector: React.FC = () => {
  const { currentChain, switchNetwork, isConnected } = useWeb3();
  
  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = event.target.value;
    switchNetwork(newChain);
  };
  
  return (
    <div className="chain-selector">
      <label htmlFor="chain-select">Chain: </label>
      <select
        id="chain-select"
        value={currentChain || ""}
        onChange={handleChainChange}
        disabled={!isConnected}
      >
        <option value="" disabled>
          Select a chain
        </option>
        {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => (
          <option key={key} value={key}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChainSelector;
```

#### Komponen Pesan

```tsx
// src/components/MessageForm.tsx
import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";

const MessageForm: React.FC = () => {
  const { contract, currentChain, isConnected } = useWeb3();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !message) return;
    
    setIsLoading(true);
    setError(null);
    setTxHash(null);
    
    try {
      // Send transaction
      const tx = await contract.logMessage(message);
      setTxHash(tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      
      // Clear form
      setMessage("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="message-form">
      <h2>Log Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected || isLoading}
            placeholder="Enter your message"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={!isConnected || !message || isLoading}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
      
      {txHash && (
        <div className="tx-info">
          <p>Transaction sent! Hash: </p>
          <a
            href={`${SUPPORTED_CHAINS[currentChain!]?.blockExplorers?.default.url}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
          </a>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default MessageForm;
```

#### Komponen Info Deployment

```tsx
// src/components/DeploymentInfo.tsx
import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { SUPPORTED_CHAINS } from "../config";

interface DeploymentData {
  chainName: string;
  chainId: number;
  deploymentTimestamp: number;
  deployer: string;
}

const DeploymentInfo: React.FC = () => {
  const { contract, currentChain, isConnected } = useWeb3();
  const [info, setInfo] = useState<DeploymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchDeploymentInfo = async () => {
      if (!contract) return;
      
      setIsLoading(true);
      try {
        const [chainName, chainId, deploymentTimestamp, deployer] = await contract.getDeploymentInfo();
        
        setInfo({
          chainName,
          chainId: chainId.toNumber(),
          deploymentTimestamp: deploymentTimestamp.toNumber(),
          deployer
        });
      } catch (error) {
        console.error("Error fetching deployment info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contract) {
      fetchDeploymentInfo();
    } else {
      setInfo(null);
    }
  }, [contract]);
  
  if (!isConnected || !currentChain) {
    return <div className="deployment-info">Connect your wallet to view deployment info</div>;
  }
  
  if (isLoading) {
    return <div className="deployment-info">Loading deployment info...</div>;
  }
  
  if (!info) {
    return <div className="deployment-info">No deployment information available</div>;
  }
  
  // Format timestamp to readable date
  const deployDate = new Date(info.deploymentTimestamp * 1000).toLocaleString();
  
  return (
    <div className="deployment-info">
      <h2>Deployment Information</h2>
      <div className="info-grid">
        <div className="info-row">
          <span className="label">Chain Name:</span>
          <span className="value">{info.chainName}</span>
        </div>
        <div className="info-row">
          <span className="label">Chain ID:</span>
          <span className="value">{info.chainId}</span>
        </div>
        <div className="info-row">
          <span className="label">Deployed On:</span>
          <span className="value">{deployDate}</span>
        </div>
        <div className="info-row">
          <span className="label">Deployer:</span>
          <span className="value">
            <a
              href={`${SUPPORTED_CHAINS[currentChain]?.blockExplorers?.default.url}/address/${info.deployer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {info.deployer.substring(0, 6)}...{info.deployer.substring(38)}
            </a>
          </span>
        </div>
        <div className="info-row">
          <span className="label">Contract:</span>
          <span className="value">
            <a
              href={`${SUPPORTED_CHAINS[currentChain]?.blockExplorers?.default.url}/address/${contract?.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contract?.address.substring(0, 6)}...{contract?.address.substring(38)}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeploymentInfo;
```

#### Komponen Message Viewer

```tsx
// src/components/MessageViewer.tsx
import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { SUPPORTED_CHAINS } from "../config";

interface ChainMessage {
  chainId: number;
  chainKey: string;
  message: string;
}

const MessageViewer: React.FC = () => {
  const { contract, isConnected } = useWeb3();
  const [messages, setMessages] = useState<ChainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!contract) return;
      
      setIsLoading(true);
      
      try {
        const chainMessages: ChainMessage[] = [];
        
        // Fetch messages from all chains
        for (const [chainKey, chain] of Object.entries(SUPPORTED_CHAINS)) {
          try {
            const message = await contract.getLatestMessage(chain.id);
            
            chainMessages.push({
              chainId: chain.id,
              chainKey,
              message: message === "No messages" ? message : message
            });
          } catch (error) {
            console.error(`Error fetching message for ${chain.name}:`, error);
            chainMessages.push({
              chainId: chain.id,
              chainKey,
              message: "Error fetching message"
            });
          }
        }
        
        setMessages(chainMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contract) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [contract]);
  
  if (!isConnected) {
    return <div className="message-viewer">Connect your wallet to view messages</div>;
  }
  
  if (isLoading) {
    return <div className="message-viewer">Loading messages...</div>;
  }
  
  return (
    <div className="message-viewer">
      <h2>Latest Messages Across Chains</h2>
      
      {messages.length === 0 ? (
        <p>No messages available</p>
      ) : (
        <div className="message-list">
          {messages.map((item) => (
            <div key={item.chainId} className="message-card">
              <div className="chain-name">{SUPPORTED_CHAINS[item.chainKey]?.name}</div>
              <div className="message-content">{item.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageViewer;
```

#### Komponen Utama

```tsx
// src/App.tsx
import React from "react";
import { Web3Provider } from "./contexts/Web3Context";
import ChainSelector from "./components/ChainSelector";
import MessageForm from "./components/MessageForm";
import DeploymentInfo from "./components/DeploymentInfo";
import MessageViewer from "./components/MessageViewer";
import "./App.css";

function App() {
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Web3Provider>
      <div className="App">
        <header className="App-header">
          <h1>Multichain Registry</h1>
          <div className="wallet-section">
            <ConnectButton onClick={connectWallet} />
            <ChainSelector />
          </div>
        </header>
        
        <main className="App-main">
          <div className="grid-container">
            <div className="card">
              <DeploymentInfo />
            </div>
            
            <div className="card">
              <MessageForm />
            </div>
            
            <div className="card wide">
              <MessageViewer />
            </div>
          </div>
        </main>
      </div>
    </Web3Provider>
  );
}

// Simple connect button component
const ConnectButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { isConnected, address } = useWeb3();
  
  return (
    <button onClick={onClick} disabled={isConnected}>
      {isConnected
        ? `Connected: ${address?.substring(0, 6)}...${address?.substring(
            address.length - 4
          )}`
        : "Connect Wallet"}
    </button>
  );
};

export default App;
```

#### CSS untuk Styling

```css
/* src/App.css */
.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

.App-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wallet-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chain-selector {
  margin-left: 10px;
}

.chain-selector select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  background-color: #4c6ef5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

button:hover {
  background-color: #3b5bdb;
}

button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wide {
  grid-column: span 2;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.tx-info {
  margin-top: 15px;
  font-size: 14px;
  color: #4c6ef5;
}

.error {
  margin-top: 15px;
  color: #e03131;
  font-size: 14px;
}

.info-grid {
  display: grid;
  gap: 10px;
}

.info-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
}

.label {
  font-weight: 500;
  color: #495057;
}

.message-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.message-card {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #dee2e6;
}

.chain-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: #4c6ef5;
}

a {
  color: #4c6ef5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h2 {
  margin-top: 0;
  font-size: 1.25rem;
  color: #212529;
}
```

### 4.2 Menjalankan Aplikasi Frontend

```bash
cd multichain-frontend
npm start
```

Aplikasi akan berjalan di `http://localhost:3000` dan pengguna dapat:

1. Menghubungkan wallet mereka
2. Memilih chain (Scroll, Base, zkSync, Linea)
3. Mengirim pesan ke kontrak pada chain yang dipilih
4. Melihat pesan terbaru dari semua chain
5. Melihat informasi deployment untuk kontrak pada chain yang dipilih
6. Mengklik tautan untuk melihat alamat dan transaksi di explorer masing-masing

### 4.3 Integrasi dengan Block Explorer

Setiap chain L2 memiliki block explorer mereka sendiri:

1. **Scroll**: ScrollScan - https://scrollscan.com (mainnet) / https://sepolia.scrollscan.dev (testnet)
2. **Base**: BaseScan - https://basescan.org (mainnet) / https://sepolia.basescan.org (testnet)
3. **zkSync Era**: zkSync Explorer - https://explorer.zksync.io (mainnet) / https://sepolia.explorer.zksync.io (testnet)
4. **Linea**: LineaScan - https://lineascan.build (mainnet) / https://sepolia.lineascan.build (testnet)

#### Verifikasi Kontrak di Block Explorer

Kontrak yang telah diverifikasi memungkinkan pengguna berinteraksi dengan kontrak langsung dari block explorer. Kita telah menyediakan langkah-langkah verifikasi otomatis dalam script deployment kami.

Jika verifikasi otomatis gagal, kita dapat melakukan verifikasi manual:

1. **Scroll, Base, dan Linea** (karena kompatibel dengan Etherscan):
   - Kunjungi block explorer chain yang sesuai
   - Temukan kontrak Anda
   - Klik tab "Contract"
   - Klik "Verify and Publish"
   - Masukkan informasi kontrak (nama, versi compiler, optimasi)
   - Unggah kode sumber atau masukkan secara langsung
   - Tambahkan argumen konstruktor (nama chain) dengan encoding yang benar

2. **zkSync Era** (memiliki proses verifikasi khusus):
   - Kunjungi explorer zkSync
   - Temukan kontrak Anda
   - Klik "Verify Contract"
   - Unggah semua file kontrak dan dependencies
   - Tambahkan deployment arguments

### 4.4 Memantau Event dan Aktivitas Multichain

Untuk memantau aktivitas kontrak di berbagai chain, kita dapat menggunakan berbagai metode:

#### 1. Event Listener di Frontend

```typescript
// Mendengarkan event MessageLogged pada chain aktif
useEffect(() => {
  if (!contract) return;
  
  const messageFilter = contract.filters.MessageLogged();
  
  const handleMessageEvent = (chainId, index, message) => {
    console.log(`New message on chain ${chainId}: ${message}`);
    // Update UI or state
  };
  
  contract.on(messageFilter, handleMessageEvent);
  
  return () => {
    contract.off(messageFilter, handleMessageEvent);
  };
}, [contract]);
```

#### 2. Subgraph untuk Indexing (The Graph)

Untuk aplikasi produksi, menggunakan The Graph untuk indexing event cross-chain akan lebih skalabel:

1. Buat subgraph untuk setiap chain
2. Deploy subgraph ke The Graph hosted service atau self-hosted
3. Query data dengan GraphQL

#### 3. Explorer API

Beberapa block explorer menyediakan API untuk mengakses data chain:

```typescript
// Contoh penggunakan API explorer untuk mendapatkan transaksi kontrak
async function getContractTransactions(chainId, contractAddress, apiKey) {
  let apiUrl;
  
  switch(chainId) {
    case 534351: // Scroll Sepolia
      apiUrl = `https://api-sepolia.scrollscan.dev/api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}`;
      break;
    case 84532: // Base Sepolia
      apiUrl = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}`;
      break;
    // ... untuk chain lainnya
  }
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  if (data.status === '1') {
    return data.result;
  }
  
  return [];
}
```

## Kesimpulan

Pada sesi keenam ini, kita telah membahas:

1. **Teknologi Layer 2 untuk Skalabilitas**
   - Memahami ZK Rollups, Optimistic Rollups, dan Validium
   - Perbandingan berbagai solusi L2

2. **Strategi Pengembangan Multichain**
   - Pendekatan Hub-and-Spoke, Chain-Agnostic, Chain-Specific
   - Pertimbangan dalam memilih L2 untuk aplikasi

3. **Deployment ke Berbagai L2**
   - Setup untuk Scroll, Base, zkSync, dan Linea
   - Script deployment yang dapat digunakan kembali

4. **Integrasi dan Verifikasi Kontrak**
   - Integrasi dengan block explorer
   - Verifikasi kontrak otomatis

5. **Frontend untuk Aplikasi Multichain**
   - UI untuk interaksi dengan kontrak di berbagai chain
   - Pemantauan aktivitas cross-chain

Dengan menguasai deployment dan strategi multichain, kita dapat memaksimalkan manfaat dari ekosistem Ethereum L2 yang beragam. Setiap L2 memiliki kelebihan dan karakteristik khusus, dan memahami bagaimana menghubungkan aplikasi kita ke berbagai chain akan memperluas jangkauan dan kemampuan dApp kita.

Sesi hands-on ini memberikan dasar yang kuat untuk pengembangan multichain, yang akan menjadi semakin penting seiring berkembangnya ekosistem Web3 menuju masa depan yang lebih terdesentralisasi dan terhubung.

**Langkah Selanjutnya untuk Eksplorasi:**

1. Implementasi messaging cross-chain dengan protokol seperti LayerZero, Axelar, atau Hyperlane
2. Pengembangan token bridge kustom antar L2
3. Penerapan state sinkronisasi untuk aplikasi multichain yang kompleks
4. Desain tokenomics yang optimal untuk ekosistem multichain
5. Optimasi gas dan performa untuk setiap L2 berdasarkan karakteristik uniknya