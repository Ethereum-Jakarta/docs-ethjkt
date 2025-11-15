---
id: setup-ponder
title: "Bagian 2: Setup & Konfigurasi Ponder"
sidebar_position: 2
description: "Install framework Ponder, setup database, dan konfigurasi network Lisk Sepolia untuk mulai membangun indexer"
---

# Bagian 2: Setup & Konfigurasi Ponder

## 🎯 Tujuan Bagian Ini

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Install framework Ponder di komputer
- ✅ Setup database (PostgreSQL atau PGlite)
- ✅ Konfigurasi network Lisk Sepolia
- ✅ Membuat proyek Ponder pertama
- ✅ Memahami struktur proyek Ponder
- ✅ Siap untuk mulai indexing!

---

## 📋 Cek Prasyarat

Sebelum mulai, pastikan sudah punya:

```bash
# 1. Node.js v18 atau lebih baru
node --version
# Output: v18.0.0 atau lebih tinggi ✅

# 2. pnpm (direkomendasikan) atau npm/yarn
pnpm --version
# Output: 8.0.0 atau lebih tinggi ✅

# 3. Git
git --version
# Output: git version 2.x.x ✅
```

**Belum punya?** Install dulu:
- **Node.js**: [https://nodejs.org](https://nodejs.org) (pilih versi LTS)
- **pnpm**: `npm install -g pnpm` (lebih cepat dari npm!)
- **Git**: [https://git-scm.com](https://git-scm.com)

---

## 🚀 Langkah 1: Membuat Proyek Ponder

### Opsi A: Menggunakan `create-ponder` (Direkomendasikan!)

Cara tercepat untuk memulai:

```bash
# Buat directory untuk workshop
mkdir ponder-workshop
cd ponder-workshop

# Buat proyek Ponder
pnpm create ponder
```

### Prompts & Pilihan:

```bash
✔ What's the name of your project? 
› lisk-token-explorer

✔ Which template would you like to use?
› Default  # <-- Pilih Default, kita akan setup sendiri untuk SimpleDEX!

✔ Installed packages with pnpm.
✔ Initialized git repository.

Success! Created lisk-token-explorer at /path/to/lisk-token-explorer

Get started:
  cd lisk-token-explorer
  pnpm dev
```

**Penjelasan Opsi Template:**
- **Default** ⭐ - Pilih ini! Kita akan setup sendiri untuk indexing SimpleDEX dari Sesi 7
- **ERC-20 example** - Contoh indexing ERC-20 (tidak kita pakai)
- **Etherscan template** - Import dari contract address Etherscan
- **Subgraph template** - Migrasi dari subgraph The Graph

---

### Opsi B: Setup Manual (Kalau Opsi A Gagal)

```bash
# Buat directory
mkdir lisk-token-explorer
cd lisk-token-explorer

# Initialize proyek npm
pnpm init

# Install Ponder
pnpm add ponder viem

# Buat struktur file dasar
mkdir src
touch ponder.config.ts ponder.schema.ts src/index.ts
```

---

## 📁 Langkah 2: Memahami Struktur Proyek

Setelah buat proyek, struktur foldernya seperti ini:

```
lisk-token-explorer/
├── abis/                       # File ABI
│   └── ExampleContractAbi.ts   # ABI contract dalam bentuk typescript
├── src/                        # Fungsi indexing (kode Anda!)
│   └── index.ts               # Logika indexing utama
├── ponder.config.ts           # Config: networks & contracts
├── ponder.schema.ts           # Schema: tabel database
├── package.json               # Dependencies
├── tsconfig.json              # Konfigurasi TypeScript
├── .env.local                 # Environment variables (buat ini!)
└── .gitignore                 # Git ignore
```

### Penjelasan Setiap File:

#### 1. `ponder.config.ts` - Konfigurasi Network & Contract

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

#### 2. `ponder.schema.ts` - Schema Database

```typescript
import { onchainTable } from "ponder";

// Definisikan tabel database
export const account = onchainTable("account", (t) => ({
  address: t.hex().primaryKey(),
  balance: t.bigint().notNull(),
}));
```

#### 3. `src/index.ts` - Fungsi Indexing

```typescript
import { ponder } from "ponder:registry";
import { account } from "ponder:schema";

// Handle event blockchain
ponder.on("Token:Transfer", async ({ event, context }) => {
  // Transform & simpan data
});
```

---

## 🗄️ Langkah 3: Setup Database

Ponder butuh database untuk menyimpan data ter-index. Ada 2 opsi:

### Opsi A: PGlite (Direkomendasikan untuk Workshop!)

**PGlite** = In-memory Postgres, super mudah, tanpa instalasi!

```bash
# Install PGlite
pnpm add @electric-sql/pglite
```

**Konfigurasi** - Edit `ponder.config.ts`:

```typescript
import { createConfig } from "ponder";
import { http } from "viem";

export default createConfig({
  database: {
    kind: "pglite",
    // Data disimpan di .ponder/sqlite
  },
  // ... sisa config
});
```

**Kelebihan:**
- ✅ Tanpa instalasi!
- ✅ Sempurna untuk development
- ✅ Setup cepat

**Kekurangan:**
- ⚠️ Data hilang saat restart (kecuali configure persistence)
- ⚠️ Tidak untuk production

---

### Opsi B: PostgreSQL (Production-Ready)

**Untuk production atau data persisten:**

#### Instalasi Windows:

1. **Download PostgreSQL:**
   - Kunjungi: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Download installer (versi 14+)
   - Jalankan installer, set password untuk user `postgres`

2. **Buat Database:**
```bash
# Buka Command Prompt atau PowerShell
psql -U postgres

# Di prompt PostgreSQL:
CREATE DATABASE ponder_dev;
\q
```

#### Instalasi Mac:

```bash
# Install via Homebrew
brew install postgresql@14

# Start service PostgreSQL
brew services start postgresql@14

# Buat database
createdb ponder_dev
```

#### Instalasi Linux:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Buat database
sudo -u postgres createdb ponder_dev
```

#### Konfigurasi - `.env.local`:

```bash
# Buat file .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/ponder_dev"
```

**Update `ponder.config.ts`:**

```typescript
export default createConfig({
  database: {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL,
  },
  // ... sisa config
});
```

---

## 🌐 Langkah 4: Konfigurasi Network Lisk Sepolia

### Tambahkan Lisk Sepolia ke MetaMask:

**Detail Network:**
```
Nama Network: Lisk Sepolia Testnet
RPC URL: https://rpc.sepolia-api.lisk.com
Chain ID: 4202
Simbol Currency: ETH
Block Explorer: https://sepolia-blockscout.lisk.com
```

**Langkah-langkah:**
1. Buka MetaMask
2. Klik dropdown network → "Add network"
3. Klik "Add a network manually"
4. Isi detail di atas
5. Klik "Save"

### Dapatkan Testnet ETH:

```
Faucet: https://sepolia-faucet.lisk.com

Langkah:
1. Koneksikan wallet
2. Request 0.05 ETH
3. Tunggu ~30 detik
4. Cek balance di MetaMask ✅
```

---

### Update Konfigurasi Ponder untuk Lisk Sepolia:

Edit `ponder.config.ts`:

```typescript
import { createConfig } from "ponder";
import { http } from "viem";

export default createConfig({
  database: {
    kind: "pglite", // atau "postgres"
  },
  
  chains: {
    // Tambahkan network Lisk Sepolia
    liskSepolia: {
      id: 4202,
      rpc: http("https://rpc.sepolia-api.lisk.com"),
    },
  },
  
  contracts: {
    // Kita akan tambahkan konfigurasi contract di Bagian 3!
  },
});
```

**Tips Pro:** Untuk production, pakai provider RPC seperti Alchemy/Infura:
```typescript
transport: http(process.env.PONDER_RPC_URL_4202),
```

Lalu di `.env.local`:
```bash
PONDER_RPC_URL_4202="https://lisk-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
```

---

## 📝 Langkah 5: Buat Environment Variables

Buat file `.env.local` di root proyek:

```bash
# .env.local

# Database (jika pakai PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ponder_dev"

# RPC URLs (opsional tapi direkomendasikan)
PONDER_RPC_URL_4202="https://rpc.sepolia-api.lisk.com"

# Telemetry (opsional)
PONDER_TELEMETRY_DISABLED="true"
```

**Tambahkan ke `.gitignore`:**

```bash
# .gitignore
.env.local
.ponder/
node_modules/
```

---

## ✅ Langkah 6: Verifikasi Setup

### Test 1: Cek Dependencies

```bash
pnpm install
```

Output harus tanpa error ✅

### Test 2: Cek TypeScript

```bash
pnpm tsc --noEmit
```

Jika ada error, perbaiki dulu!

### Test 3: Start Dev Server (Akan fail, it's OK!)

```bash
pnpm dev
```

**Output yang Diharapkan:**
```bash
○ Watching for file changes in /path/to/project

○ Starting build...

✓ Build completed in 234 ms

12:00:00.000 INFO  Connected to database type=pglite
12:00:00.100 WARN  No contracts specified in ponder.config.ts

Server listening at http://localhost:42069
```

**Catatan:** Server akan start tapi belum ada indexing karena belum ada konfigurasi contract. Kita akan tambahkan di Bagian 3!

Tekan `Ctrl+C` untuk stop server.

---

## 🧪 Langkah 7: Eksplorasi Dev Server Ponder

Start lagi dev server:

```bash
pnpm dev
```

### Buka GraphQL Playground:

```
URL: http://localhost:42069/graphql
```

**Seharusnya** buka di browser dan lihat interface GraphQL playground:

![GraphQL Playground](https://ponder.sh/graphql-playground.png)

Belum ada data atau schema karena belum configure contract, tapi UI-nya sudah jalan! ✅

---

## 📚 Langkah 8: Memahami Dev Tools Ponder

Ponder menyediakan beberapa endpoints saat development:

### 1. **GraphQL API** (Port 42069)
```
http://localhost:42069/graphql
```
- Eksplorasi schema
- Test queries
- Lihat dokumentasi

### 2. **Health Check**
```
http://localhost:42069/health
```
Response:
```json
{ "status": "healthy" }
```

### 3. **Metrics** (Prometheus)
```
http://localhost:42069/metrics
```
- Track progress sync
- Monitor performa

---

## 🔍 Deep Dive: Konfigurasi Ponder

### Memahami `ponder.config.ts`:

```typescript
import { createConfig } from "ponder";
import { http } from "viem";
import { ERC20Abi } from "./abis/ERC20Abi";

export default createConfig({
  // Konfigurasi database
  database: {
    kind: "pglite", // atau "postgres"
  },
  
  // Network blockchain
  chains: {
    liskSepolia: {
      id: 4202,
      rpc: http("https://rpc.sepolia-api.lisk.com"),
      
      // Opsional: Interval polling (default: 4000ms)
      pollingInterval: 4_000,
      
      // Opsional: Max request per detik (rate limiting)
      maxRequestsPerSecond: 50,
    },
  },
  
  // Smart contracts untuk di-index
  contracts: {
    Token: {
      chain: "liskSepolia",
      address: process.env.USDC_TOKEN_ADDRESS as `0x${string}`,
      abi: ERC20Abi,
      startBlock: 13142655,
      
      // Opsional: End block
      endBlock: 1000000,
      
      // Opsional: Max block range per request
      maxBlockRange: 10000,
    },
  },
});
```

### Best Practices Konfigurasi:

#### 1. **Gunakan Environment Variables:**
```typescript
networks: {
  liskSepolia: {
    transport: http(process.env.PONDER_RPC_URL_4202 || "default_url"),
  },
}
```

#### 2. **Set Start Block yang Tepat:**
```typescript
contracts: {
  MyToken: {
    startBlock: 123456, // Block saat contract di-deploy
    // Jangan mulai dari 0 kecuali perlu!
  },
}
```

#### 3. **Rate Limiting:**
```typescript
networks: {
  liskSepolia: {
    maxRequestsPerSecond: 50, // Jangan overwhelm RPC
  },
}
```

---

## 🎯 Memahami Schema Ponder

### Tipe Schema di `ponder.schema.ts`:

```typescript
import { onchainTable, index } from "ponder";

export const myTable = onchainTable("my_table", (t) => ({
  // Tipe kolom:
  id: t.text().primaryKey(),           // Primary key
  address: t.hex().notNull(),          // Address Ethereum
  amount: t.bigint().notNull(),        // Angka besar (uint256)
  count: t.integer().default(0),       // Angka biasa
  name: t.text(),                      // String
  isActive: t.boolean().notNull(),     // True/false
  timestamp: t.integer().notNull(),    // Unix timestamp
  
  // Relationships (akan dibahas nanti!)
}));

// Opsional: Tambahkan indexes untuk performa
export const myTableAddressIndex = index("my_table")
  .on("address");
```

### Mapping Tipe Kolom:

| Tipe Solidity | Tipe Schema Ponder | Contoh |
|---------------|-------------------|---------|
| `address` | `t.hex()` | `0x123...` |
| `uint256` | `t.bigint()` | `1000000000000000000n` |
| `uint8/16/32` | `t.integer()` | `100` |
| `bool` | `t.boolean()` | `true` |
| `string` | `t.text()` | `"Hello"` |
| `bytes32` | `t.hex()` | `0xabc...` |

---

## 🧪 Testing Setup Anda

### Buat Test Schema:

Edit `ponder.schema.ts`:

```typescript
import { onchainTable } from "ponder";

export const testTable = onchainTable("test_table", (t) => ({
  id: t.text().primaryKey(),
  message: t.text().notNull(),
  createdAt: t.integer().notNull(),
}));
```

### Start Dev Server:

```bash
pnpm dev
```

**Cek Logs:**
```bash
12:00:00.000 INFO  Connected to database type=pglite
12:00:00.100 INFO  Created database tables count=1 tables=["test_table"]
12:00:00.200 INFO  Created HTTP server port=42069
```

Tabel ter-create! ✅

### Query di GraphQL:

Buka `http://localhost:42069/graphql` dan coba:

```graphql
query {
  testTables {
    items {
      id
      message
      createdAt
    }
  }
}
```

Hasil (kosong, it's OK!):
```json
{
  "data": {
    "testTables": {
      "items": []
    }
  }
}
```

---

## 🎓 Masalah Umum & Solusi

### Masalah 1: `pnpm command not found`

**Solusi:**
```bash
npm install -g pnpm
```

### Masalah 2: `Cannot connect to database`

**Untuk PGlite:**
- Pastikan sudah install: `pnpm add @electric-sql/pglite`
- Cek config: `database: { kind: "pglite" }`

**Untuk PostgreSQL:**
- Cek service running: `pg_ctl status`
- Verifikasi connection string di `.env.local`
- Test koneksi: `psql postgresql://postgres:password@localhost:5432/ponder_dev`

### Masalah 3: Error TypeScript

**Solusi:**
```bash
# Regenerate types
pnpm ponder codegen

# Cek TypeScript
pnpm tsc --noEmit
```

### Masalah 4: Port 42069 sudah digunakan

**Solusi:**
```bash
# Kill process di port
# Mac/Linux:
lsof -ti:42069 | xargs kill -9

# Windows:
netstat -ano | findstr :42069
taskkill /PID <PID> /F
```

Atau ubah port di `ponder.config.ts`:
```typescript
export default createConfig({
  server: {
    port: 3000, // Gunakan port berbeda
  },
  // ...
});
```

### Masalah 5: Hot reload tidak bekerja

**Solusi:**
```bash
# Restart dev server
# Ctrl+C lalu:
pnpm dev
```

### Masalah 6: Error RPC

```
Error: Too Many Requests
```

**Solusi:**
- Gunakan rate limiting: `maxRequestsPerSecond: 10`
- Gunakan provider RPC berbayar (Alchemy, Infura)
- Tingkatkan `pollingInterval`

---

## ✅ Checklist Setup

Sebelum lanjut ke Bagian 3, verify semua ini:

- [ ] ✅ Node.js v18+ ter-install (`node --version`)
- [ ] ✅ pnpm ter-install (`pnpm --version`)
- [ ] ✅ Proyek ter-create (`pnpm create ponder` sukses)
- [ ] ✅ Database ter-konfigurasi (PGlite atau PostgreSQL)
- [ ] ✅ Lisk Sepolia ditambahkan ke MetaMask
- [ ] ✅ Dapat testnet ETH dari faucet
- [ ] ✅ File `.env.local` ter-create
- [ ] ✅ `ponder.config.ts` ter-konfigurasi dengan Lisk Sepolia
- [ ] ✅ Dev server start sukses (`pnpm dev`)
- [ ] ✅ GraphQL playground dapat diakses (http://localhost:42069/graphql)
- [ ] ✅ Test schema ter-create & tabel ter-generate

**Semua ✅?** Mantap! Anda siap untuk indexing! 🚀

---

## 🎯 Referensi Cepat Commands

```bash
# Buat proyek Ponder baru
pnpm create ponder

# Install dependencies
pnpm install

# Start development server (dengan hot reload!)
pnpm dev

# Build untuk production
pnpm build

# Start production server
pnpm start

# Generate types
pnpm ponder codegen

# Clear cache & restart
rm -rf .ponder/cache && pnpm dev
```

---

## 📚 Sumber Daya Tambahan

**Dokumentasi:**
- [Referensi Config Ponder](https://ponder.sh/docs/config/networks)
- [Panduan Schema Ponder](https://ponder.sh/docs/schema/tables)
- [Opsi Database](https://ponder.sh/docs/config/database)

**Tutorial Video:**
- Cari: "Ponder setup tutorial"
- Workshop ETHGlobal

**Komunitas:**
- [Telegram Ponder](https://t.me/pondersh)
- [GitHub Discussions](https://github.com/ponder-sh/ponder/discussions)

---

## 🚀 Langkah Selanjutnya

Setup selesai! 🎉

Di Bagian 3, kita akan:
1. **Deploy contract ERC-20** ke Lisk Sepolia (atau gunakan yang sudah ada)
2. **Configure contract** di Ponder
3. **Tulis schema** untuk data token
4. **Buat fungsi indexing** untuk handle events
5. **Query data** via GraphQL!

**[📖 Bagian 3: Indexing SimpleDEX Contract →](./03-indexing-simple-dex.md)**

---

**Sampai jumpa di Bagian 3! Saatnya bangun sesuatu yang keren! 🔥**
