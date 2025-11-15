---
id: pengenalan-indexer
title: "Bagian 1: Pengenalan Blockchain Indexer"
sidebar_position: 1
description: "Memahami apa itu blockchain indexer, mengapa sangat penting, dan solusi modern menggunakan framework Ponder"
---

# Bagian 1: Pengenalan Blockchain Indexer

## 🎯 Tujuan Bagian Ini

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Memahami apa itu blockchain indexer dan use case-nya
- ✅ Mengerti masalah tanpa indexer (dengan cerita menarik!)
- ✅ Tau kenapa aplikasi Web3 populer WAJIB pakai indexer
- ✅ Mengenal framework Ponder dan keunggulannya
- ✅ Siap untuk mulai membangun indexer sendiri

---

## 📖 Cerita: Bayangkan Anda Seorang Detektif

### 🔍 Kasus: "Analitik DEX yang Lambat"

**Skenario:**  
Bos Anda bilang: *"Buat dashboard analytics untuk SimpleDEX! Tampilkan volume 24h, total swaps, dan history semua swap dalam 6 bulan terakhir!"*

#### ❌ CARA 1: Tanpa Indexer (Query Langsung ke Blockchain)

```javascript
// Anda harus melakukan ini:

// Langkah 1: Dapatkan nomor block 6 bulan lalu
const currentBlock = await provider.getBlockNumber(); // Block 1,000,000
const blocksIn6Months = 6 * 30 * 24 * 60 * 5; // ~1,296,000 blocks
const startBlock = currentBlock - blocksIn6Months; // Block 0

// Langkah 2: Loop SETIAP block untuk cari Swap events (1 juta+ blocks!) 😱
const swaps = [];
for (let i = startBlock; i <= currentBlock; i++) {
  // Query Swap events dari setiap block
  const logs = await dexContract.queryFilter('Swap', i, i);
  
  swaps.push(...logs);
  
  // Juga perlu query reserves untuk hitung price & TVL
  const reserves = await dexContract.getReserves(); // RPC call lagi!
  
  // Kena rate limit RPC? Tunggu dulu...
  await sleep(100); // Perlambat untuk hindari rate limit
}

// Langkah 3: Hitung volume 24h (scan lagi!)
const oneDayAgo = currentBlock - (24 * 60 * 5); // 24 jam = ~7200 blocks
let volume24h = 0;
for (let i = oneDayAgo; i <= currentBlock; i++) {
  const logs = await dexContract.queryFilter('Swap', i, i);
  logs.forEach(log => {
    volume24h += parseFloat(log.args.amountBOut || log.args.amountBIn);
  });
}

console.log(`Ditemukan ${swaps.length} swaps!`);
console.log(`Volume 24h: ${volume24h} USDC`);
```

**Hasil:**
```
⏱️ Waktu: 36 JAM (1 juta blocks × 0.13 detik/block)
💸 Biaya: ~$500 kredit RPC (atau kena ban karena rate limit)
😭 Status: Timeout, error, frustrasi!
🔥 Laptop: Panas kayak kompor
```

**Quote Developer:**
> *"Ini gila! Gak mungkin aplikasi production pakai cara ini. Users bakal kabur duluan sebelum data load!"* - Setiap Web3 Developer

---

#### ✅ CARA 2: Dengan Indexer (Menggunakan Ponder)

```javascript
// Ponder sudah index semua data DEX di background!
// Anda tinggal query database:

// Query 1: Pool Statistics (instant!)
const { poolState } = await client.query({
  query: gql`
    query GetPoolStats {
      poolState(id: "POOL") {
        tvl
        totalSwaps
        totalVolume
        volume24h
        price
      }
    }
  `
});

// Query 2: Recent Swaps (instant!)
const { swapEvents } = await client.query({
  query: gql`
    query GetRecentSwaps {
      swapEvents(
        orderBy: "timestamp"
        orderDirection: "desc"
        limit: 100
      ) {
        items {
          user
          amountAIn
          amountBOut
          priceImpact
          timestamp
        }
        totalCount
      }
    }
  `
});

console.log(`TVL: $${poolState.tvl} USDC`);
console.log(`Volume 24h: $${poolState.volume24h} USDC`);
console.log(`Total Swaps: ${poolState.totalSwaps}`);
console.log(`Recent Swaps: ${swapEvents.totalCount}`);
```

**Hasil:**
```
⏱️ Waktu: 50 MILIDETIK! ⚡
💸 Biaya: $0 (query ke database lokal/cloud)
😎 Status: Lancar & instant
✨ Users: Senang & terkesan!
```

**Quote Developer:**
> *"WOW! Ini seperti sulap! Data langsung muncul tanpa loading!"* - Anda, setelah pakai Ponder

---

## 🤔 Apa Itu Blockchain Indexer?

### Definisi Sederhana:

> **Blockchain Indexer** adalah sistem yang:
> 1. **Listen** ke blockchain 24/7 untuk event baru
> 2. **Transform** raw blockchain data menjadi format yang mudah di-query
> 3. **Store** data tersebut di database (biasanya Postgres)
> 4. **Serve** data via API (GraphQL/REST) untuk aplikasi Anda

### Analogi: Google untuk Blockchain

| Konsep | Tanpa Indexer | Dengan Indexer |
|--------|---------------|----------------|
| **Mencari Web** | Buka setiap website satu-satu | Ketik di Google → hasil instant |
| **Cari Buku** | Cek setiap rak perpustakaan | Cari di katalog digital |
| **Belanja** | Ke setiap toko fisik | Buka Tokopedia/Shopee |
| **Data Blockchain** | Query setiap block satu-satu 🐌 | Query indexer → instant! ⚡ |

**Indexer = Google-nya Data Blockchain!**

---

## 💡 Masalah Tanpa Indexer: 5 Pain Points

### 1. ⏰ LAMBAT BANGET!

**Contoh Kasus Real:**
```
Tugas: Tampilkan top 100 pemegang token

Tanpa Indexer:
- Scan SEMUA event Transfer (bisa jutaan+)
- Kalkulasi balance satu-satu
- Sort berdasarkan balance
⏱️ Waktu: 10-30 MENIT (atau timeout!)

Dengan Indexer:
- Query database: "SELECT * FROM accounts ORDER BY balance DESC LIMIT 100"
⏱️ Waktu: 10 MILIDETIK!
```

### 2. 💸 MAHAL!

**Breakdown Biaya RPC:**
```
Alchemy Free Tier: 300 juta compute units/bulan
1 panggilan getLogs: ~250 compute units

Cari data 6 bulan tanpa indexer:
- 1 juta blocks × 250 CU = 250 JUTA CU
- Gratis tier? Habis dalam 1 hari!
- Paket berbayar: $199/bulan untuk 600 juta CU
- 1 query = $80+! 😱

Dengan Indexer:
- Setup: 1 kali index (pakai tier gratis)
- Query: UNLIMITED, GRATIS! 🎉
```

### 3. 🚫 TIDAK SCALABLE

**Skenario:**  
Aplikasi Anda punya 1000 user bersamaan:

```
Tanpa Indexer:
- 1000 users × 1000 panggilan RPC masing-masing
- = 1 JUTA panggilan RPC
- Hasil: Rate limited, app down! ❌

Dengan Indexer:
- 1000 users × query ke database ANDA
- Database handle ribuan query/detik
- Hasil: App berjalan lancar! ✅
```

### 4. 😵 KOMPLEKS & RAWAN ERROR

**Kompleksitas Kode:**
```javascript
// Tanpa Indexer: Anda harus handle SEMUANYA
- Reorganisasi block (chain reorg)
- Missing data / request gagal
- Rate limiting & backoff
- Pagination & manajemen memori
- Konsistensi data
- Optimasi fetching paralel

= 500+ baris kode yang rawan error 😓

// Dengan Indexer (Ponder): Framework handle semuanya!
ponder.on("Token:Transfer", async ({ event, context }) => {
  // Cukup handle logika bisnis
  await context.db.insert(transfers).values({
    from: event.args.from,
    to: event.args.to,
    amount: event.args.value,
  });
});

= Clean, simple, maintainable! 🎉
```

### 5. 📊 DATA TIDAK TERSTRUKTUR

**Data Blockchain Mentah:**
```solidity
// Event: Transfer
event Transfer(address indexed from, address indexed to, uint256 value);

// Di blockchain tersimpan sebagai:
{
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "0x000000000000000000000000a1b2c3...", // from
    "0x000000000000000000000000d4e5f6...", // to
  ],
  data: "0x000000000000000000000000000000000000000000000000000000003b9aca00" // value
}

// 😵 Sulit dibaca & tidak ada konteks!
```

**Dengan Indexer (Data Terstruktur):**
```javascript
// Data tersimpan di database dengan schema jelas:
{
  id: "transfer-123",
  from: "0xa1b2c3...",
  to: "0xd4e5f6...",
  amount: "1000000000", // 1 USDC
  amountFormatted: "1.00", // Mudah dibaca manusia
  timestamp: "2025-01-15T10:30:00Z",
  blockNumber: 1234567,
  transactionHash: "0xabc123...",
  token: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6
  }
}

// ✨ Terstruktur, mudah dibaca, siap ditampilkan!
```

---

## 🌟 Use Cases Real di Industri

### 1. **Analitik Uniswap** 📊

**Tanpa Indexer:**
- Mustahil track semua swap, liquidity, volume real-time
- Data terlalu banyak (ribuan swap per menit)
- Query reserves untuk setiap request = lambat & mahal

**Dengan Indexer (Subgraph Uniswap v3):**
- Track SEMUA pool, swap, position real-time
- Kalkulasi TVL, volume, fees otomatis
- Dukung dashboard seperti [info.uniswap.org](https://info.uniswap.org)
- **Ini yang akan kita bangun untuk SimpleDEX!**

**Tech:** The Graph (pendahulu Ponder) → Kita pakai Ponder untuk SimpleDEX!

---

### 2. **Marketplace NFT OpenSea** 🖼️

**Tanpa Indexer:**
- Load setiap metadata NFT satu-satu? Impossible!
- Pencarian & filter? Nightmare!

**Dengan Indexer:**
- Index semua NFT listings, bids, sales
- Pencarian cepat berdasarkan koleksi, traits, harga
- Sort berdasarkan rarity, floor price, volume

**Impact:** UX yang lancar, users senang, penjualan meningkat!

---

### 3. **Protokol Lending Aave** 💰

**Use Case:**
- Track deposit, borrow, liquidasi user
- Kalkulasi health factor real-time
- Notifikasi user sebelum liquidation

**Dengan Indexer:**
```graphql
query UserPositions($user: String!) {
  deposits: deposits(where: { user: $user }) {
    asset
    amount
    apy
  }
  borrows: borrows(where: { user: $user }) {
    asset
    amount
    healthFactor  # <-- CRITICAL! 
  }
}
```

**Hasil:** Users bisa monitoring posisi & hindari liquidation!

---

### 4. **Explorer Domain ENS** 🌐

**Tantangan:**
- Track semua registrasi domain .eth
- Monitor expiration & renewal
- Pencarian berdasarkan domain atau owner

**Solusi (dengan Indexer):**
- Index event `NameRegistered`, `NameRenewed`, `Transfer`
- Simpan data terstruktur: domain, owner, expiry, price
- Dukung UI seperti [ens.domains](https://ens.domains)

---

## 🚀 Kenapa Ponder? (vs The Graph & Alternatif Lain)

### Perbandingan Lengkap:

#### **Ponder** 🌟

**Kelebihan:**
- ⚡ **10x lebih cepat** dari The Graph (benchmark terbukti!)
- 🔥 **Hot reload** - Feedback instant saat development
- 💻 **Full TypeScript** - Type-safe dari ujung ke ujung
- 🗄️ **Akses Postgres langsung** - Fleksibilitas query maksimal
- 🏠 **Self-hosted** - Tanpa vendor lock-in, deploy dimana saja
- 📦 **Database lebih kecil** - 35x lebih kecil dibanding The Graph!
- 🆓 **Gratis** - Tanpa biaya hosting

**Kekurangan:**
- 🆕 Lebih baru (tapi didukung tim yang kuat)
- 📚 Komunitas lebih kecil (tapi bertumbuh cepat!)

**Cocok Untuk:**
- Aplikasi dApp production yang butuh performa
- Proyek yang butuh kustomisasi
- Developer yang familiar TypeScript
- Infrastruktur self-hosted

---

#### **The Graph** 📊

**Kelebihan:**
- 🏆 Standar industri (digunakan Uniswap, Aave, dll)
- 🌍 Network terdesentralisasi (hosted service + network)
- 📚 Ekosistem matang & komunitas besar
- 📖 Dokumentasi ekstensif

**Kekurangan:**
- 🐌 Sync lebih lambat (6 menit vs 37 detik untuk ERC-20)
- 🗄️ Database bloat (1.1 GB vs 31 MB untuk ERC-20)
- 💰 Biaya hosting ($$$)
- 🔧 Tanpa hot reload (harus deploy untuk test)
- 📝 Kurang type-safe (butuh codegen)

**Cocok Untuk:**
- Proyek yang butuh desentralisasi
- Prototype cepat (hosted service)
- Mengikuti standar industri

---

#### **Indexer Custom (DIY)** 🛠️

**Kelebihan:**
- 🎨 Fleksibilitas ultimate
- 🔧 Kontrol penuh

**Kekurangan:**
- ⏰ Waktu development: Minggu/bulan
- 🐛 Banyak edge case yang harus di-handle
- 💰 Biaya maintenance tinggi
- 🔥 Ciptakan ulang roda

**Cocok Untuk:**
- Requirements unik yang framework lain tidak support
- Tim dengan resources & expertise

---

### Matrix Keputusan:

| Kebutuhan | Ponder | The Graph | Custom |
|-------------|--------|-----------|--------|
| Waktu sync cepat | ✅✅✅ | ⚠️ | 🤷 |
| Biaya rendah | ✅ | ❌ | ⚠️ |
| Type safety | ✅ | ⚠️ | 🤷 |
| Development cepat | ✅ | ✅ | ❌ |
| Terdesentralisasi | ❌ | ✅ | ❌ |
| Kustomisasi | ✅ | ⚠️ | ✅ |
| Development aktif | ✅ | ✅ | 🤷 |

**Rekomendasi untuk Workshop:**  
✅ **Ponder** - Sempurna untuk belajar, development cepat, dan production-ready!

---

## 🏗️ Arsitektur Ponder: Cara Kerjanya

### Arsitektur High-Level:

```
┌─────────────────────────────────────────────────┐
│           BLOCKCHAIN (Lisk Sepolia)             │
│  Smart Contracts → Events → Data Transaksi      │
└────────────────┬────────────────────────────────┘
                 │
                 │ Koneksi RPC
                 ↓
┌─────────────────────────────────────────────────┐
│              FRAMEWORK PONDER                    │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │     1. SYNC ENGINE (Pendengar Event)     │   │
│  │  - Dengarkan blockchain 24/7             │   │
│  │  - Fetch logs & transaksi                │   │
│  │  - Handle reorgs & finality              │   │
│  └──────────────┬───────────────────────────┘   │
│                 │                                │
│                 ↓                                │
│  ┌──────────────────────────────────────────┐   │
│  │     2. FUNGSI INDEXING (Kode Anda!)      │   │
│  │  - ponder.on("Event", handler)           │   │
│  │  - Transform data blockchain             │   │
│  │  - Logika bisnis                         │   │
│  └──────────────┬───────────────────────────┘   │
│                 │                                │
│                 ↓                                │
│  ┌──────────────────────────────────────────┐   │
│  │     3. LAYER DATABASE (Postgres)         │   │
│  │  - Simpan data ter-index                 │   │
│  │  - Migrasi otomatis                      │   │
│  │  - Query yang dioptimasi                 │   │
│  └──────────────┬───────────────────────────┘   │
│                 │                                │
└─────────────────┼────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│          4. API SERVER (Auto-Generated)         │
│  - GraphQL API (port default: 42069)            │
│  - SQL over HTTP (opsional)                     │
│  - Custom API routes (opsional)                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP/GraphQL
                 ↓
┌─────────────────────────────────────────────────┐
│          FRONTEND (Next.js / React)             │
│  Query data → Tampilkan ke users → 🎉          │
└─────────────────────────────────────────────────┘
```

### Alur Data Contoh (Event Transfer):

```
1. USER TRANSFER TOKEN
   → Transaksi di Lisk Sepolia
   
2. PONDER DETEKSI EVENT
   → Sync engine tangkap event Transfer
   
3. KODE ANDA PROSES
   ponder.on("Token:Transfer", async ({ event, context }) => {
     // Update balance pengirim
     await context.db.update(accounts)
       .set({ balance: balance - amount })
       .where({ address: event.args.from });
     
     // Update balance penerima  
     await context.db.update(accounts)
       .set({ balance: balance + amount })
       .where({ address: event.args.to });
     
     // Simpan record transfer
     await context.db.insert(transfers).values({
       from: event.args.from,
       to: event.args.to,
       amount: event.args.value,
       timestamp: event.block.timestamp,
     });
   });
   
4. DATA TERSIMPAN DI POSTGRES
   → Tersedia langsung via GraphQL!
   
5. FRONTEND QUERY DATA
   → User lihat balance ter-update instant! ✨
```

---

## 🎓 Konsep Kunci di Ponder

### 1. **Konfigurasi Contracts** (`ponder.config.ts`)

Definisikan smart contract yang mau di-index:

```typescript
import { createConfig } from "ponder";
import { http } from "viem";
import { ERC20Abi } from "./abis/ERC20Abi";

export default createConfig({
  // Definisikan network blockchain
  chains: {
    mainnet: {
      id: 1,
      rpc: http(process.env.PONDER_RPC_URL_1),
    },
  },
  
  // Definisikan contracts yang akan di-index
  contracts: {
    Token: {
      chain: "mainnet",
      address: process.env.USDC_TOKEN_ADDRESS as `0x${string}`,
      abi: ERC20Abi,
      startBlock: 13142655,
    },
  },
});
```

### 2. **Schema** (`ponder.schema.ts`)

Definisikan struktur data:

```typescript
import { onchainTable } from "ponder";

export const accounts = onchainTable("accounts", (t) => ({
  address: t.hex().primaryKey(),
  balance: t.bigint().notNull(),
  transactionCount: t.integer().notNull().default(0),
}));

export const transfers = onchainTable("transfers", (t) => ({
  id: t.text().primaryKey(),
  from: t.hex().notNull(),
  to: t.hex().notNull(),
  amount: t.bigint().notNull(),
  timestamp: t.integer().notNull(),
  blockNumber: t.integer().notNull(),
}));
```

### 3. **Fungsi Indexing** (`src/index.ts`)

Transform event menjadi data:

```typescript
import { ponder } from "ponder:registry";
import { accounts, transfers } from "ponder:schema";

ponder.on("MyToken:Transfer", async ({ event, context }) => {
  // Logika bisnis Anda di sini!
  // context.db = Akses database
  // event = Data event blockchain
});
```

### 4. **GraphQL API** (Ter-generate otomatis!)

Query data yang sudah di-index:

```graphql
query {
  accounts(orderBy: "balance", orderDirection: "desc", limit: 10) {
    items {
      address
      balance
      transactionCount
    }
  }
}
```

---

## 💪 Kenapa Harus Belajar Indexer?

### 1. **Skill yang Dicari Industri** 💼

```
Lowongan Kerja di Web3:
- "Pengalaman dengan The Graph atau solusi indexing sejenis"
- "Pengetahuan infrastruktur data blockchain"
- "Familiar dengan GraphQL API untuk data blockchain"

→ Skill indexer = Keunggulan kompetitif! 🚀
```

### 2. **Bangun dApps Lebih Baik** 🏗️

```
Tanpa Indexer:
- Loading lambat
- UX buruk
- Users frustrasi
→ App gagal ❌

Dengan Indexer:
- Data instant
- UX lancar
- Users senang
→ App sukses! ✅
```

### 3. **Peluang Karir** 🌟

```
Peran yang butuh pengetahuan indexer:
- Full-stack Web3 Developer
- Blockchain Data Engineer
- Developer dApp
- Protocol Developer
- Web3 Infrastructure Engineer

Range gaji: $80k - $200k+ 💰
```

### 4. **Skill Future-Proof** 🔮

```
Pertumbuhan Web3 → Lebih banyak dApps → Lebih banyak data → Lebih banyak indexers!

Market cap The Graph: $2.6 miliar
Ponder: Leader yang sedang berkembang
→ Peluang besar! 🚀
```

---

## 🎯 Kuis: Test Pemahaman Anda!

### Pertanyaan 1:
**Apa masalah UTAMA tanpa menggunakan indexer?**

A) Blockchain tidak bisa diakses  
B) Smart contract tidak bisa di-deploy  
C) Query data lambat dan mahal 💡  
D) Tidak bisa membuat frontend  

<details>
<summary>Lihat Jawaban</summary>

**Jawaban: C**

Tanpa indexer, setiap query harus scan blockchain secara langsung yang sangat lambat (bisa menit/jam) dan mahal (biaya RPC). Indexer mengatasi ini dengan pre-processing data dan menyimpan ke database yang cepat di-query!

</details>

### Pertanyaan 2:
**Kenapa Ponder lebih cepat dari The Graph?**

A) Ponder pakai bahasa pemrograman yang lebih cepat  
B) Arsitektur lebih efisien & database lebih kecil 💡  
C) Ponder tidak index semua data  
D) The Graph sengaja dibuat lambat  

<details>
<summary>Lihat Jawaban</summary>

**Jawaban: B**

Arsitektur Ponder lebih modern dan efisien. Database footprint 35x lebih kecil (31 MB vs 1.1 GB) dan waktu sync 10x lebih cepat (37s vs 5m 28s) untuk contract ERC-20 yang sama!

</details>

### Pertanyaan 3:
**Aplikasi Web3 mana yang WAJIB pakai indexer?**

A) UI transfer token sederhana  
B) DEX dengan trading charts & analytics 💡  
C) Website faucet  
D) Generator wallet  

<details>
<summary>Lihat Jawaban</summary>

**Jawaban: B**

DEX dengan analytics (seperti Uniswap) butuh track ribuan swap, kalkulasi volume, TVL, dan price charts real-time. Mustahil tanpa indexer! Opsi lain bisa bekerja tanpa indexer karena kebutuhan data lebih sederhana.

</details>

---

## ✅ Checklist: Apakah Anda Siap Lanjut?

Sebelum lanjut ke Bagian 2, pastikan Anda sudah:

- [ ] **Memahami masalah tanpa indexer** (lambat, mahal, tidak scalable)
- [ ] **Tau apa itu blockchain indexer** (sistem yang listen, transform, store, serve data)
- [ ] **Memahami use cases indexer** (Uniswap, OpenSea, Aave, dll)
- [ ] **Tau kenapa Ponder** (10x lebih cepat, type-safe, gratis, self-hosted)
- [ ] **Memahami arsitektur Ponder** (sync engine → kode Anda → database → API)
- [ ] **Excited untuk membangun!** 🚀

Jika semua sudah ✅, mari lanjut setup Ponder!

---

## 🚀 Langkah Selanjutnya

Sekarang Anda sudah paham KENAPA indexer itu penting dan BAGAIMANA Ponder bekerja.

Selanjutnya, kita akan:
1. **Install framework Ponder**
2. **Setup environment pengembangan**
3. **Konfigurasi network Lisk Sepolia**
4. **Buat proyek pertama Anda!**

**[📖 Bagian 2: Setup & Konfigurasi Ponder →](./02-setup-ponder.md)**

---

## 📚 Sumber Daya Tambahan

**Untuk Dibaca:**
- [Dokumentasi Resmi Ponder](https://ponder.sh/docs/get-started) - Panduan memulai
- [Kenapa Ponder?](https://ponder.sh/docs/why-ponder) - Filosofi & perbandingan
- [Benchmark Ponder](https://github.com/ponder-sh/ponder/tree/main/benchmarks) - Bukti performa
- [The Graph untuk Perbandingan](https://thegraph.com/docs/en/) - Standar industri

**Video (Opsional):**
- Cari di YouTube: "Ponder blockchain indexer tutorial"
- Lihat: Talks ETHGlobal tentang indexing

**Komunitas:**
- [Telegram Ponder](https://t.me/pondersh) - Komunitas aktif
- [GitHub Discussions](https://github.com/ponder-sh/ponder/discussions) - Tanya jawab

---

**Sampai jumpa di Bagian 2! Selamat belajar! 🎉**
