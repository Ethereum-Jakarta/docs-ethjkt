---
id: sesi-8-batch-4-offline
title: "Sesi 8: Blockchain Indexer & Integrasi Frontend"
sidebar_label: "#8 Indexer & Frontend"
sidebar_position: 0
description: "Hari kedelapan Kelas Rutin Batch IV (OFFLINE): Memahami blockchain indexer, menggunakan Ponder framework untuk index SimpleDEX dari Sesi 7, dan integrasi dengan frontend untuk dashboard analytics DEX yang powerful."
---

# Sesi 8: Blockchain Indexer & Integrasi Frontend

> **📌 Catatan Penting:** Sesi ini adalah **kelanjutan langsung dari Sesi 7**. Kita akan menggunakan **SimpleDEX contract** yang sudah dibangun di Sesi 7 dan membuat indexer untuk track semua aktivitas DEX (swap, liquidity, dll) serta membangun dashboard analytics yang lengkap.

## 📋 Informasi Sesi

**Tanggal**: Sabtu, TBD  
**Waktu**: 09:00 - 17:00 WIB (8 jam)  
**Lokasi**: TBD  
**Format**: Workshop tatap muka (offline)  
**Peserta**: 40-80 pengembang  
**Level**: Menengah - Lanjut Pengembangan Web3

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan sesi ini, Anda akan mampu:

1. **Memahami Blockchain Indexer** - Apa itu indexer, mengapa penting untuk DEX, dan bagaimana cara kerjanya
2. **Mengenal Framework Ponder** - Framework modern untuk blockchain indexing yang 10x lebih cepat
3. **Menyiapkan Environment Pengembangan** - Install dan konfigurasi Ponder dengan Lisk Sepolia testnet
4. **Membangun Indexer untuk SimpleDEX** - Membuat indexer untuk track swap, liquidity, dan aktivitas DEX dari Sesi 7
5. **Menggunakan GraphQL API** - Memanfaatkan GraphQL API yang ter-generate otomatis untuk query data DEX
6. **Integrasi Frontend** - Merubah SimpleDEX dari Sesi 7 agar menampilkan data real-time dari indexer

---

## 📅 Jadwal Workshop

| Waktu | Durasi | Aktivitas | Format |
|-------|--------|-----------|--------|
| 08:30 - 09:00 | 30m | Registrasi & Persiapan Environment | Persiapan |
| 09:00 - 09:30 | 30m | Pengantar: Masalah Tanpa Indexer & Solusinya | Pembukaan |
| 09:30 - 10:45 | 75m | **Modul 1**: Pengenalan Indexer & Ponder | Teori + Demo |
| 10:45 - 11:00 | 15m | Istirahat | Istirahat |
| 11:00 - 12:30 | 90m | **Modul 2**: Setup & Konfigurasi Ponder | Hands-on |
| 12:30 - 13:30 | 60m | Istirahat Makan Siang | Makan Siang |
| 13:30 - 15:00 | 90m | **Modul 3**: Indexing SimpleDEX Contract (Kelanjutan Sesi 7) | Hands-on |
| 15:00 - 15:15 | 15m | Istirahat | Istirahat |
| 15:15 - 16:45 | 90m | **Modul 4**: Integrasi Frontend SimpleDEX dengan Indexer | Hands-on |
| 16:45 - 17:00 | 15m | Demo Proyek Final & Penutupan | Penutupan |

---

## 🚀 Prasyarat

### Yang Harus Sudah Dipahami:

**✅ Dasar JavaScript/TypeScript:**
- Async/await, promises
- JavaScript Modern (ES6+)
- Konsep dasar TypeScript
- Manajemen package npm/pnpm

**✅ Fundamental Blockchain:**
- Smart contracts & events
- RPC endpoints
- Dasar wallet (MetaMask)
- **WAJIB: Sudah menyelesaikan Sesi 7** - SimpleDEX contract sudah di-deploy
- Pemahaman dasar AMM & DEX (dari Sesi 7)

**✅ Pengembangan Web:**
- Dasar React/Next.js
- Konsumsi API
- Pengetahuan dasar GraphQL (nilai plus!)

### Tools yang Dibutuhkan:

**✅ Environment Pengembangan:**
- **Node.js** v18 atau lebih baru
- **pnpm** atau npm/yarn
- **VS Code** atau code editor pilihan
- **Git** untuk version control

**✅ Tools Blockchain:**
- **MetaMask** wallet extension
- **Lisk Sepolia ETH** dari faucet
- **Akses Lisk Sepolia RPC** (gratis!)

**✅ Database:**
- **PostgreSQL** (akan disetup bersama)
- atau **PGlite** (in-memory, lebih mudah untuk development)

---

## 📚 Struktur Dokumentasi

Dokumentasi ini dibagi menjadi 4 bagian yang fokus pada **membangun DEX Analytics Dashboard** sebagai kelanjutan dari SimpleDEX di Sesi 7:

### [📖 Bagian 1: Pengenalan Blockchain Indexer](./01-pengenalan-indexer.md)
**Modul 1 (09:30 - 10:45)**
- Apa itu blockchain indexer?
- Masalah tanpa indexer untuk DEX (cerita menarik!)
- Perbandingan: Query langsung vs Indexer
- Kenapa Ponder? (vs The Graph, Subgraph, dll)
- Use cases di industri DeFi (Uniswap, Curve, dll)
- Arsitektur Ponder

### [📖 Bagian 2: Setup & Konfigurasi Ponder](./02-setup-ponder.md)
**Modul 2 (11:00 - 12:30)**
- Instalasi framework Ponder
- Setup PostgreSQL / PGlite
- Konfigurasi network Lisk Sepolia
- Struktur proyek Ponder
- Membuat proyek indexer untuk SimpleDEX
- Memahami `ponder.config.ts`
- Memahami `ponder.schema.ts`

### [📖 Bagian 3: Indexing SimpleDEX Contract](./03-indexing-simple-dex.md)
**Modul 3 (13:30 - 15:00)**
- **Koneksi ke SimpleDEX dari Sesi 7** - Gunakan contract yang sudah di-deploy
- Konfigurasi contract SimpleDEX dalam Ponder
- Membuat schema untuk data DEX:
  - Pool state (reserves, TVL)
  - Swap history
  - Liquidity events (add/remove)
  - LP token positions
- Menulis fungsi indexing:
  - Indexing event `Swap`
  - Indexing event `LiquidityAdded`
  - Indexing event `LiquidityRemoved`
  - Tracking pool reserves & price
  - Tracking LP positions
- Testing indexer secara lokal
- Query dengan GraphQL
- Troubleshooting masalah umum

### [📖 Bagian 4: Integrasi Frontend - DEX Analytics Dashboard](./04-frontend-integration.md)
**Modul 4 (15:15 - 16:45)**
- Setup proyek Next.js
- Koneksi ke Ponder GraphQL API
- Membuat DEX Analytics Dashboard:
  - **Pool Statistics** - TVL, volume 24h, total swaps
  - **Swap History** - Daftar swap terbaru dengan price impact
  - **Liquidity Events** - Timeline add/remove liquidity
  - **Price Chart** - Grafik harga real-time
  - **LP Positions** - Track posisi liquidity provider
  - **User Analytics** - Statistik per user (swaps, volume, dll)
- Update real-time
- Desain responsive
- Pertimbangan deployment

---

## 🎯 Apa Itu Blockchain Indexer?

### Analogi Dunia Nyata: Perpustakaan vs Google

**Bayangkan Anda mencari buku di perpustakaan besar:**

**Tanpa Indexer (Query Langsung ke Blockchain):**
```
🏃 Anda harus jalan ke setiap rak
📚 Buka satu-satu semua buku
🔍 Cari halaman yang Anda butuhkan
⏱️ Butuh BERJAM-JAM!
💸 Bayar biaya masuk setiap kali
```

**Dengan Indexer (Menggunakan Ponder):**
```
🖥️ Buka katalog digital (seperti Google)
⚡ Ketik keyword → langsung ketemu!
📊 Hasil ter-organize & mudah difilter
⏱️ Dalam HITUNGAN DETIK!
💰 Query sepuasnya, gratis!
```

### Kenapa Indexer SANGAT Penting?

**Masalah Real di Web3:**
1. **❌ Panggilan RPC Mahal** - Setiap query ke blockchain = biaya & rate limit
2. **❌ Lambat** - Scan ribuan block untuk cari data = menit bahkan jam
3. **❌ Tidak Scalable** - Aplikasi dengan banyak user = RPC overload
4. **❌ Data Tidak Terstruktur** - Event logs tidak optimal untuk display di UI

**Solusi dengan Indexer:**
1. **✅ Cepat** - Data sudah di-process & disimpan di database
2. **✅ Murah** - Query ke database lokal/cloud, bukan blockchain
3. **✅ Scalable** - Handle ribuan request per detik
4. **✅ Ramah Developer** - GraphQL API yang mudah digunakan

---

## 💡 Ponder vs Solusi Lain

| Fitur | Ponder | The Graph | Backend Custom |
|---------|---------|-----------|----------------|
| **Kecepatan** | ⚡⚡⚡ 10x lebih cepat | 🐢 Lambat | 🤷 Tergantung |
| **Waktu Setup** | 🚀 5 menit | ⏰ 30+ menit | ⏰ Hari/minggu |
| **Type Safety** | ✅ Full TypeScript | ⚠️ Terbatas | 🤷 Tergantung |
| **Dev Lokal** | ✅ Hot reload | ❌ Deploy dulu | ✅ Ya |
| **GraphQL** | ✅ Auto-generated | ✅ Ya | ❌ Manual |
| **Biaya** | 💰 Gratis (self-host) | 💰💰 Hosting berbayar | 💰💰💰 Biaya infra |
| **Learning Curve** | 📚 Mudah | 📚📚 Sedang | 📚📚📚 Susah |
| **Database** | 🗄️ Postgres | 🗄️ Graph Node | 🗄️ Apapun |

**Kesimpulan:** Ponder = **Kecepatan The Graph** + **Fleksibilitas backend custom** + **Developer experience framework modern**

---

## 🎮 Proyek Yang Akan Dibangun

**DEX Analytics Dashboard** - Dashboard lengkap untuk analitik SimpleDEX yang dibangun di Sesi 7

### Fitur Utama:

**Backend (Ponder Indexer):**
- 📊 **Index Event Swap** - Track semua swap di DEX dengan price impact
- 💧 **Index Event Liquidity** - Track add/remove liquidity
- 📈 **Pool State Tracking** - Real-time reserves, TVL, price
- 👥 **LP Positions** - Track posisi liquidity provider per user
- 📅 **Data Historis** - History swap, liquidity events dengan timestamp
- 💰 **Volume Analytics** - Volume 24h, 7d, total volume

**Frontend (Next.js):**
- 🎨 **UI Cantik** - Desain modern & responsive seperti Uniswap Info
- 📊 **Pool Statistics** - TVL, volume, total swaps, current price
- 📜 **Swap Feed** - List swap real-time dengan amount in/out
- 💧 **Liquidity Timeline** - Timeline add/remove liquidity
- 📈 **Price Chart** - Grafik harga real-time (CAMP/USDC)
- 👤 **User Analytics** - Statistik per user (total swaps, volume, dll)
- 🔍 **Pencarian** - Cari berdasarkan address atau transaction hash
- ⚡ **Loading Cepat** - Query GraphQL yang dioptimasi

### Analogi Dunia Nyata:
```
DEX Analytics Dashboard = Uniswap Info untuk SimpleDEX Anda!

Fitur penting:
- Lihat statistik pool (TVL, volume, price)
- Track semua swap yang terjadi
- Monitor aktivitas liquidity provider
- Analisis volume & trading patterns
- Dashboard untuk user tracking
```

---

## 🛠️ Tech Stack

### Stack Backend:
- **Ponder** - Framework blockchain indexing
- **PostgreSQL** atau **PGlite** - Database untuk data terindex
- **GraphQL** - API yang ter-generate otomatis oleh Ponder
- **TypeScript** - Pengembangan type-safe
- **Viem** - Library Ethereum (built-in di Ponder)

### Stack Frontend:
- **Next.js 14+** - Framework React dengan App Router
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching & caching
- **GraphQL Request** - Client GraphQL
- **Tailwind CSS** - Styling
- **Shadcn UI** - Library komponen

### Blockchain:
- **Lisk Sepolia Testnet** - Environment testing
- **Contract ERC-20** - Token contract untuk indexing
- **MetaMask** - Interaksi wallet

---

## 📖 Cara Menggunakan Dokumentasi

### Alur Pembelajaran (Perjalanan Linear Token Explorer):

**Bagian 1: Pahami** → Pahami masalah & solusi indexer

**Bagian 2: Setup** → Install Ponder & konfigurasi environment

**Bagian 3: Index** → Bangun indexer untuk contract ERC-20:
- Index event Transfer
- Index event Approval  
- Kalkulasi & simpan balances
- Query dengan GraphQL

**Bagian 4: Bangun UI** → Buat frontend yang consume data:
- Tampilkan info token
- Tampilkan list transfer
- Pencarian & filter
- Update real-time

### Tips Belajar:
- ✅ **Ikuti urutan Bagian 1 → 2 → 3 → 4** - Jangan skip atau loncat-loncat
- ✅ **Hands-on setiap step** - Ketik sendiri, jangan copy-paste semua
- ✅ **Test setiap modul** - Pastikan indexer jalan sebelum lanjut ke frontend
- ✅ **Pahami, jangan hafal** - Mengerti konsepnya, bukan sintaksnya
- ✅ **Eksplor GraphQL** - Main-main dengan queries di GraphQL playground

### Troubleshooting:
- Error koneksi database? Cek setup PostgreSQL/PGlite
- `ponder dev` gagal? Pastikan Node.js v18+
- Indexing terhenti? Periksa RPC URL dan konfigurasi network
- Frontend tidak load data? Verify GraphQL endpoint
- Error TypeScript? Periksa definisi schema

---

## 🌟 Kenapa Framework Ponder?

### Dibandingkan The Graph:

**Performa:**
- ⚡ **10x lebih cepat** sync data (lihat benchmark di website)
- 🗄️ **Database 35x lebih kecil** (31 MB vs 1.1 GB untuk ERC-20)
- 🚀 **Instant hot reload** saat development

**Developer Experience:**
- 💻 **Full TypeScript** - Tulis fungsi indexing di TS
- 🔥 **Tanpa codegen** - Inferensi tipe otomatis
- 🏗️ **Development lokal** - Test tanpa deploy
- 📝 **Error lebih baik** - Pesan error jelas dengan stack traces

**Fleksibilitas:**
- 🗄️ **Akses Postgres langsung** - Query langsung atau via GraphQL
- 🎨 **Custom API routes** - Bukan cuma GraphQL
- 🔌 **Integrasi mudah** - Kerja dengan framework frontend apapun
- 🌐 **Self-hosted** - Deploy dimana saja yang menjalankan Node.js

---

## 🎯 Hasil Pembelajaran

Setelah selesai workshop ini, Anda akan:

**✅ Memahami:**
- Konsep blockchain indexing & use cases
- Arsitektur framework Ponder
- Bagaimana indexer mengubah data blockchain
- Desain schema GraphQL untuk data blockchain
- Pattern integrasi frontend

**✅ Bisa Membuat:**
- Proyek Ponder indexer dari scratch
- Schema untuk index event blockchain
- Fungsi indexing untuk handle events
- Query GraphQL untuk fetch data
- Aplikasi dApp full-stack dengan backend indexer

**✅ Siap Untuk:**
- Bangun dApps production-grade dengan Ponder
- Index protokol DeFi kompleks (Uniswap, Aave, dll)
- Buat dashboard analytics blockchain
- Kontribusi ke proyek Web3 yang menggunakan indexers

---

## 📝 Catatan Penting

### Info Network Lisk Sepolia:

**Detail Network:**
```
Nama Network: Lisk Sepolia Testnet
Chain ID: 4202
RPC URL: https://rpc.sepolia-api.lisk.com
Simbol Currency: ETH
Block Explorer: https://sepolia-blockscout.lisk.com
```

**Faucet:**
- Lisk Sepolia Faucet: [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
- Gratis! Request 0.05 ETH per hari

**Tambahkan ke MetaMask:**
1. Buka MetaMask
2. Klik Networks → Add Network
3. Add Network Manually
4. Masukkan detail di atas
5. Save & Switch

### Kebutuhan Sistem:

**Minimum:**
- Node.js v18.0 atau lebih baru
- 4 GB RAM
- 2 GB ruang disk kosong
- Koneksi internet (untuk sync data blockchain)

**Rekomendasi:**
- Node.js v20+
- 8 GB RAM
- 5 GB ruang disk
- Internet stabil (indexing membutuhkan bandwidth)

### Persiapan Sebelum Workshop:

**1 Hari Sebelum:**
- Install Node.js v18+ (verifikasi: `node --version`)
- Install pnpm (atau npm/yarn)
- Setup MetaMask dengan Lisk Sepolia
- Dapatkan testnet ETH dari faucet
- Install PostgreSQL (opsional, bisa pakai PGlite)

**Pagi Hari Workshop:**
- Charge laptop full battery
- Bawa charger!
- Download VS Code extensions (ESLint, Prettier, dll)
- Test koneksi internet

---

## 🚀 Siap Untuk Memulai?

Mari kita mulai perjalanan menjadi blockchain indexer expert!

**Struktur workshop:**
1. 📚 **Pahami Masalah** - Kenapa indexer itu game-changer
2. 🔧 **Setup Ponder** - Environment pengembangan siap
3. ⚡ **Bangun Indexer** - Index contract ERC-20 real-time
4. 🎨 **Buat UI** - Frontend cantik untuk explore data
5. 🚀 **Deploy** - Aplikasi dApp production-ready

**[📖 Bagian 1: Pengenalan Blockchain Indexer →](./01-pengenalan-indexer.md)**

---

## 📞 Dukungan & Sumber Daya

**Jika mengalami masalah:**
- Tanya instruktur di workshop
- Cek grup Telegram: Kelas Rutin Batch IV
- Discord Ponder: [https://t.me/pondersh](https://t.me/pondersh)
- GitHub Issues: [https://github.com/ponder-sh/ponder](https://github.com/ponder-sh/ponder)

**Sumber Daya Belajar:**
- [Dokumentasi Ponder](https://ponder.sh/docs) - Dokumentasi resmi
- [Contoh-contoh Ponder](https://github.com/ponder-sh/ponder/tree/main/examples) - Contoh kode
- [Dokumentasi Lisk Developer](https://docs.lisk.com) - Dokumentasi Lisk
- [The Graph (untuk perbandingan)](https://thegraph.com/docs) - Solusi alternatif

**Komunitas:**
- Telegram Ponder (sangat aktif!)
- Telegram Ethereum Jakarta
- Discord Lisk
- #PonderDev di X/Twitter

---

**Mari bangun masa depan infrastruktur data Web3! 🚀**

**#BuildWithPonder** | **#EthereumJakarta** | **#LiskSepolia** | **#Web3Indonesia**
