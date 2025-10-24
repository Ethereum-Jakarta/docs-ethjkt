---
id: sesi-1-batch-4-offline
title: "Sesi 1: Fondasi Web3 & Pengaturan Infrastruktur"
sidebar_label: "#1 Fondasi Web3 & Infrastruktur"
sidebar_position: 1
description: "Hari pertama Kelas Rutin Batch IV (OFFLINE): Membangun fondasi kuat Web3, memahami arsitektur blockchain, dan praktik langsung melakukan deployment smart contract pertama Anda."
---

# Sesi 1: Fondasi Web3 & Pengaturan Infrastruktur

## 📋 Informasi Sesi

**Tanggal**: Sabtu, 25 Oktober 2025
**Waktu**: 09:00 - 17:00 WIB (8 jam)
**Lokasi**: BINUS University Kemanggisan
**Format**: Workshop tatap muka (offline)
**Peserta**: 40-80 pengembang terpilih

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan sesi ini, Anda akan mampu:

1. **Memahami Evolusi Web** - Menjelaskan perbedaan mendasar antara Web1, Web2, dan Web3
2. **Arsitektur Blockchain** - Memahami cara kerja blockchain, mekanisme konsensus, dan blockchain trilemma
3. **Layer 2 & Lisk** - Mengerti solusi skalabilitas dan keunggulan Lisk sebagai Layer 2
4. **Wallet & Kriptografi** - Menguasai konsep private key, public key, address, dan keamanan
5. **Sistem Gas** - Memahami mekanisme gas dan siklus hidup transaksi
6. **Dasar Solidity** - Menulis smart contract sederhana dengan tipe data, fungsi, dan modifier
7. **Deployment Pertama** - Melakukan deployment dan verifikasi smart contract pertama ke Lisk Sepolia testnet

---

## 📅 Jadwal Lengkap

| Waktu | Durasi | Aktivitas | Format |
|-------|--------|-----------|--------|
| 08:30 - 09:00 | 30m | Registrasi & Persiapan | Persiapan |
| 09:00 - 09:30 | 30m | Pembukaan & Ice Breaking | Interaktif |
| 09:30 - 10:45 | 75m | **Modul 1**: Evolusi Web & Fondasi Blockchain | Learning |
| 10:45 - 11:00 | 15m | Istirahat Kopi | Istirahat |
| 11:00 - 12:15 | 75m | **Modul 2**: Layer 2, Lisk & Wallet | Learning |
| 12:15 - 13:15 | 60m | Istirahat Makan Siang & Networking | Istirahat |
| 13:15 - 14:30 | 75m | **Modul 3**: Sistem Gas & Transaksi | Learning |
| 14:30 - 14:45 | 15m | Istirahat Kopi | Istirahat |
| 14:45 - 16:00 | 75m | **Modul 4**: Praktik Solidity | Workshop |
| 16:00 - 16:45 | 45m | **Tantangan**: Deploy Game LiskGarden | Praktik |
| 16:45 - 17:00 | 15m | Penutupan & Preview Sesi 2 | Penutup |

---

## 📚 Modul 1: Evolusi Web & Fondasi Blockchain (09:30 - 10:45)

### 1.1 Evolusi Web: Dari Web1 Hingga Web3

#### Web1 (1990-2005): Era Baca Saja

**Karakteristik:**
```
┌────────────────────────────────────────────┐
│  WEB 1.0: Informasi Statis                 │
│  ----------------------------------------  │
│  • Halaman HTML statis                    │
│  • Komunikasi satu arah                   │
│  • Didominasi pembuat konten              │
│  • Tanpa interaksi pengguna               │
│                                            │
│  Contoh: GeoCities, Altavista, Yahoo      │
└────────────────────────────────────────────┘
```

**Ciri Khas:**
- 📖 **Baca saja**: Pengguna hanya bisa membaca konten
- 🏢 **Tersentralisasi**: Server tunggal mengelola semua data
- 📄 **Statis**: Konten jarang berubah
- 💰 **Model Bisnis**: Iklan banner, direktori listing

#### Web2 (2004-Sekarang): Era Interaktif

**Karakteristik:**
```
┌────────────────────────────────────────────┐
│  WEB 2.0: Platform Interaktif              │
│  ----------------------------------------  │
│  • Konten buatan pengguna                 │
│  • Platform media sosial                  │
│  • Komputasi awan                         │
│  • Pengalaman mobile-first                │
│                                            │
│  Contoh: Facebook, YouTube, Twitter       │
└────────────────────────────────────────────┘
```

**Ciri Khas:**
- ✍️ **Baca-Tulis**: Pengguna dapat membuat dan membagikan konten
- 🏦 **Dikontrol Platform**: Data dikontrol oleh perusahaan besar
- 📊 **Pemanenan Data**: Data pengguna dijadikan produk yang dijual
- 💸 **Model Bisnis**: Periklanan, monetisasi data

**Masalah Nyata Web2:**
```
┌──────────────────────────────────────────────────┐
│  🚨 SISI GELAP WEB2                              │
│  ──────────────────────────────────────────────  │
│                                                   │
│  💰 Biaya platform: Pemotongan 30% dari creator  │
│  🔒 Kebocoran data: Miliaran data pengguna bocor │
│  📉 Deplatforming: Akun bisa diblokir tanpa sebab│
│  🎭 Privasi: Pelacakan tanpa persetujuan         │
│  🌐 Sensor: Platform mengontrol kebebasan bicara │
│                                                   │
│  Kasus Nyata:                                     │
│  • Facebook-Cambridge Analytica (87 juta user)   │
│  • Demonetisasi sewenang-wenang YouTube          │
│  • Pemblokiran akun Twitter                      │
│  • Skandal pengumpulan data TikTok               │
└──────────────────────────────────────────────────┘
```

#### Web3 (2008-Sekarang): Era Kepemilikan

**Karakteristik:**
```
┌────────────────────────────────────────────┐
│  WEB 3.0: Kepemilikan Terdesentralisasi    │
│  ----------------------------------------  │
│  • Data dimiliki pengguna                 │
│  • Infrastruktur terdesentralisasi        │
│  • Cryptocurrency & token                 │
│  • Smart contract                         │
│  • Inovasi tanpa izin                     │
│                                            │
│  Contoh: Uniswap, Aave, OpenSea, ENS      │
└────────────────────────────────────────────┘
```

**Pergeseran Paradigma:**
```
Platform Web2 → Protokol Web3
"Anda adalah produk" → "Anda memiliki nilai"
Berbasis izin → Tanpa izin
Risiko platform → Kepastian protokol
```

**Perbandingan:**

| Aspek | Web2 | Web3 |
|-------|------|------|
| **Kepemilikan Data** | Milik platform | Milik pengguna |
| **Identitas** | Dikontrol platform | Berdaulat sendiri |
| **Monetisasi** | Periklanan | Kepemilikan langsung |
| **Tata Kelola** | Korporat | Komunitas |
| **Sensor** | Mungkin terjadi | Tahan sensor |
| **Inovasi** | Perlu izin | Tanpa izin |

---

### 1.2 Teknologi Blockchain Mendalam

#### Apa itu Blockchain?

**Definisi**: Buku besar terdistribusi - daftar catatan yang disimpan dalam "blok" data yang dirantai bersama.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Blok 1    │───▶│   Blok 2    │───▶│   Blok 3    │
│             │    │             │    │             │
│ Prev: 0x00  │    │ Prev: 0xA1  │    │ Prev: 0xB2  │
│ Hash: 0xA1  │    │ Hash: 0xB2  │    │ Hash: 0xC3  │
│ Data: [Txs] │    │ Data: [Txs] │    │ Data: [Txs] │
│ Nonce: 4521 │    │ Nonce: 7832 │    │ Nonce: 1293 │
└─────────────┘    └─────────────┘    └─────────────┘
```

#### Sifat Inti

**1. Transparan**
- Setiap node memiliki salinan blockchain
- Semua transaksi terlihat oleh peserta
- Siapa pun dapat memverifikasi riwayat
- Blockchain publik sepenuhnya dapat diaudit

**2. Aman**
- Menggunakan kriptografi dan tanda tangan digital
- Pasangan kunci publik/privat membuktikan identitas
- Tanda tangan digital memaksakan akses baca/tulis
- Enkripsi melindungi data sensitif

**3. Tidak Dapat Diubah**
- Mekanisme konsensus membuat sulit mengubah catatan
- Data yang sudah dicatat sangat sulit diubah
- Memerlukan kontrol mayoritas jaringan
- Data historis bersifat permanen

#### Fungsi Hash Kriptografi

**Contoh SHA-256:**
```
Input:  "Hello World"
Output: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

Input:  "Hello world"  (huruf w kecil)
Output: 64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c
```

**Properti:**
- ✅ **Deterministik**: Input sama → output sama
- ✅ **Komputasi Cepat**: Cepat untuk dihitung
- ✅ **Resistensi Pre-image**: Tidak bisa dibalik
- ✅ **Efek Longsoran**: Perubahan kecil → perbedaan besar
- ✅ **Tahan Tabrakan**: Hampir mustahil menemukan duplikat

---

### 1.3 Perjalanan Ethereum

#### Peluncuran (2015)

**Misi Ethereum**: Internet terbuka di mana pengguna mengontrol data mereka, aplikasi berjalan tanpa penjaga gerbang, dan nilai mengalir bebas.

#### Pencapaian Penting

**1. DAI: Stablecoin Perintis (Desember 2015)**
- Stablecoin terdesentralisasi pertama
- Mempertahankan patokan dolar melalui jaminan kripto
- Tata kelola DAO
- Tanpa single point of failure

**2. CryptoKitties & Era NFT (November 2017)**
- Game NFT besar pertama
- Menunjukkan blockchain di luar keuangan
- Membuktikan kolektibilitas dan budaya online
- Membuka kemungkinan kreatif

**3. Musim Panas DeFi (Juni 2020)**
- Pertumbuhan eksplosif DeFi
- Peminjaman, perdagangan, generasi hasil
- Infrastruktur keuangan terbuka dan komposabel
- Miliaran nilai on-chain
- Platform: Uniswap, Aave, Compound

**4. Pembaruan The Merge (15 September 2022)**
- Transisi dari Proof of Work ke Proof of Stake
- Memangkas konsumsi energi hingga 99,95%
- Memperkuat keamanan jaringan
- Menetapkan dasar untuk peningkatan skalabilitas masa depan

---

### 1.4 Mekanisme Konsensus

#### Proof of Work (PoW)

**Proses Mining:**
```
┌──────────────────────────────────────────┐
│  PROSES MINING                           │
│  ──────────────────────────────────────  │
│                                          │
│  1. Kumpulkan transaksi dari mempool     │
│  2. Buat blok dengan data transaksi      │
│  3. Temukan nonce di mana:               │
│     Hash(blok) < Target Difficulty       │
│  4. Siarkan blok valid ke jaringan       │
│  5. Jaringan verifikasi & tambahkan      │
│  6. Miner terima hadiah blok             │
│                                          │
│  Bitcoin: 10 menit/blok, 6.25 BTC hadiah │
└──────────────────────────────────────────┘
```

**Karakteristik:**
- ⚡ **Intensif Energi**: Memerlukan daya komputasi tinggi
- 🔒 **Aman**: Serangan 51% sangat mahal
- 🐢 **Lebih Lambat**: Throughput transaksi lebih rendah
- 🎯 **Terbukti**: Bitcoin berjalan 15+ tahun tanpa downtime

#### Proof of Stake (PoS)

**Proses Staking:**
```
┌──────────────────────────────────────────┐
│  PROSES STAKING                          │
│  ──────────────────────────────────────  │
│                                          │
│  1. Kunci cryptocurrency sebagai stake   │
│  2. Terpilih sebagai validator           │
│     (probabilitas ∝ jumlah stake)        │
│  3. Usulkan & validasi blok              │
│  4. Dapatkan hadiah staking              │
│  5. Di-slash jika bertindak jahat        │
│                                          │
│  Ethereum: Minimum 32 ETH stake          │
│  Hadiah staking ~4% APR                  │
└──────────────────────────────────────────┘
```

**Karakteristik:**
- 🌱 **Hemat Energi**: 99,95% lebih sedikit energi
- ⚡ **Lebih Cepat**: Throughput lebih tinggi
- 💰 **Persyaratan Modal**: Perlu stake signifikan
- 🔐 **Keamanan Ekonomi**: Penyerang kehilangan stake mereka

---

### 1.5 Blockchain Trilemma

```
                Keamanan
         (Kesulitan serangan tinggi)
                    /\
                   /  \
                  /    \
                 /      \
   Desentralisasi ---- Skalabilitas
   (Persyaratan node    (Performa tinggi
    operator rendah)     yaitu TPS)
```

**Tantangan**: Hanya bisa mengoptimalkan 2 dari 3

- **Keamanan Tinggi + Desentralisasi Tinggi** = Skalabilitas Rendah (Bitcoin, Ethereum L1)
- **Keamanan Tinggi + Skalabilitas Tinggi** = Desentralisasi Rendah (Beberapa rantai DPoS)
- **Desentralisasi Tinggi + Skalabilitas Tinggi** = Keamanan Rendah (Beberapa mekanisme baru)

**Perbandingan:**
```
┌──────────┬───────────────┬──────────┬─────────────┐
│ Chain    │ Desentralisasi│ Keamanan │ Skalabilitas│
├──────────┼───────────────┼──────────┼─────────────┤
│ Bitcoin  │ ⭐⭐⭐⭐⭐       │ ⭐⭐⭐⭐⭐  │ ⭐☆☆☆☆      │
│ Ethereum │ ⭐⭐⭐⭐☆       │ ⭐⭐⭐⭐⭐  │ ⭐⭐☆☆☆      │
│ BSC      │ ⭐⭐☆☆☆       │ ⭐⭐⭐☆☆  │ ⭐⭐⭐⭐⭐      │
│ Solana   │ ⭐⭐☆☆☆       │ ⭐⭐⭐☆☆  │ ⭐⭐⭐⭐⭐      │
└──────────┴───────────────┴──────────┴─────────────┘
```

---

## 📚 Modul 2: Layer 2, Lisk & Wallet (11:00 - 12:15)

### 2.1 Apa itu Layer 2?

**Definisi**: Jaringan yang dibangun di atas Ethereum (Layer 1) untuk menyelesaikan masalah skalabilitas.

**Cara Kerja Layer 2:**
- **Memproses transaksi off-chain** (di luar blockchain utama Ethereum)
- **Menyelesaikan/menambatkan transaksi pada Layer 1** untuk keamanan
- Membuat transaksi **lebih cepat dan murah**
- Mewarisi jaminan keamanan Ethereum

**Optimistic Rollup:**
```
┌─────────────────────────────────────┐
│      Optimistic Rollup (L2)         │
│  ┌──────────────────────────────┐   │
│  │   Node Eksekusi              │   │
│  │   Eksekusi cepat off-chain   │   │
│  │                              │   │
│  │   Node Rollup                │   │
│  │   Batch & kirim ke L1        │   │
│  │                              │   │
│  │   Skema Pembuktian           │   │
│  │   Fraud proof                │   │
│  └──────────────────────────────┘   │
│              │                       │
│   Kirim Batch ke Layer 1            │
└─────────────────────────────────────┘
                │
    Turunkan Data Blok Layer 2
                ↓
┌─────────────────────────────────────┐
│         Ethereum (L1)                │
│  Keamanan & Penyelesaian             │
└─────────────────────────────────────┘
```

**Manfaat Utama:**
1. **Skalabilitas**: Ribuan TPS vs ~15 TPS di L1
2. **Biaya Lebih Rendah**: Biaya hanya sebagian kecil dari L1
3. **Keamanan Ethereum**: Diamankan oleh Ethereum
4. **Kompatibilitas EVM**: Tool, kode, dan wallet yang sama

---

### 2.2 Memperkenalkan Lisk

**Apa itu Lisk?**

Lisk adalah jaringan **Layer 2 (L2)** yang sangat efisien, sangat cepat, dan mudah diskalakan, dibangun di atas **Optimism (OP)** dan diamankan oleh Ethereum.

**Dibangun di Superchain:**
```
┌─────────────────────────────────────────┐
│      Ekosistem OP Superchain            │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Optimism │  │   Base   │  │  Lisk  ││
│  └──────────┘  └──────────┘  └────────┘│
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Mode    │  │   Zora   │  │  dll   ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                  │
                  │ Keamanan Bersama
                  │ Standar Bersama
                  │ Interoperabilitas
                  ↓
┌─────────────────────────────────────────┐
│            Ethereum (L1)                 │
│      Keamanan & Penyelesaian             │
└─────────────────────────────────────────┘
```

**Karakteristik Utama:**

1. **Performa Sangat Cepat**
   - Konfirmasi transaksi sub-detik
   - Throughput tinggi untuk aplikasi yang menuntut
   - Dioptimalkan untuk kasus penggunaan dunia nyata

2. **Sangat Efisien**
   - Biaya gas berkurang drastis dibanding Ethereum L1
   - Pemrosesan batch yang efisien
   - Pemanfaatan sumber daya optimal

3. **Mudah Diskalakan**
   - Menangani volume transaksi tinggi
   - Dirancang untuk berkembang dengan aplikasi Anda
   - Tanpa mengorbankan desentralisasi

4. **Kompatibel dengan EVM**
   - Gunakan tool yang sama (Hardhat, Foundry, Remix)
   - Deploy smart contract Solidity tanpa perubahan
   - Migrasi mulus dari Ethereum

5. **Keamanan Ethereum**
   - Transaksi diselesaikan di Ethereum
   - Mewarisi model keamanan kuat Ethereum
   - Tidak perlu mempercayai set validator terpisah

**Informasi Jaringan:**

**Lisk Sepolia Testnet** (untuk pengembangan):
- Nama Jaringan: Lisk Sepolia
- RPC URL: `https://rpc.sepolia-api.lisk.com`
- Chain ID: `4202`
- Simbol Mata Uang: `ETH`
- Block Explorer: `https://sepolia-blockscout.lisk.com`

**Lisk Mainnet** (untuk produksi):
- Nama Jaringan: Lisk
- RPC URL: `https://rpc.api.lisk.com`
- Chain ID: `1135`
- Simbol Mata Uang: `ETH`
- Block Explorer: `https://blockscout.lisk.com`

---

### 2.3 Memahami Wallet

#### Apa itu Wallet?

**Definisi**: Alat yang menyimpan kunci, mengelola akun, menandatangani transaksi, dan berinteraksi dengan blockchain.

**Penting**: Kripto Anda TIDAK "berada di" wallet - kripto ada di blockchain. Wallet hanya membuktikan Anda memilikinya!

#### Analogi Dunia Nyata: Sistem Kotak Pos

```
🏠 Rumah Anda = Blockchain
📬 Kotak Pos = Akun/Address Anda (0x123...)
🔑 Kunci Kotak Pos = Private Key Anda
📮 Nomor Kotak Pos = Public Address Anda
```

- **Kotak pos (address)** terlihat oleh semua orang
- **Kunci kotak pos (private key)** rahasia, hanya Anda yang bisa membuka
- **Siapa pun bisa melihat nomor kotak pos** untuk mengirim surat
- **Tapi hanya Anda dengan kunci** yang bisa membuka dan mengambil isinya

---

### 2.4 Private Key, Public Key, dan Address

**Proses Pembuatan Kunci:**
```
┌─────────────────────────────────────────────────────┐
│  Langkah 1: Buat Private Key (Angka Acak)          │
│                                                     │
│  Private Key (Rahasia, angka 256-bit):             │
│  0xf8f8a2f43c8376ccb0871305060d7b27b0554d2cc72...  │
│                                                     │
│  ⚠️  JANGAN PERNAH BAGIKAN - Seperti password!     │
└─────────────────────────────────────────────────────┘
                        │
                        │ Matematika Kriptografi (ECDSA)
                        ↓
┌─────────────────────────────────────────────────────┐
│  Langkah 2: Turunkan Public Key                    │
│                                                     │
│  Public Key (Boleh dibagikan):                     │
│  0x04a598a8030da6d86c6bc7f2f5144544beb2dd0d4e... │
│                                                     │
│  ✅ Boleh dibagikan secara publik                  │
└─────────────────────────────────────────────────────┘
                        │
                        │ Hashing (Keccak-256)
                        ↓
┌─────────────────────────────────────────────────────┐
│  Langkah 3: Buat Address                           │
│                                                     │
│  Address (Identitas publik Anda):                  │
│  0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4      │
│                                                     │
│  ✅ Ini yang Anda bagikan untuk terima dana        │
└─────────────────────────────────────────────────────┘
```

**Fungsi Satu Arah:**
```
Private Key --[ECDSA]--> Public Key --[Keccak-256]--> Address

✅ Maju mudah dan cepat
❌ Mundur secara komputasi mustahil
```

#### Seed Phrase: Cadangan Master

**Apa itu**: 12 atau 24 kata acak

**Contoh**: `witch collapse practice feed shame open despair creek road again ice least`

**Cara kerjanya:**
```
Seed Phrase (12-24 kata)
        │
        ├─> Akun 1: 0x742d35Cc...
        ├─> Akun 2: 0x8f3b2e1d...
        ├─> Akun 3: 0xa2c4f7b9...
        └─> ... (jutaan kemungkinan lainnya)
```

**Aturan Keamanan:**
- ❌ JANGAN PERNAH bagikan
- ❌ JANGAN PERNAH simpan secara digital
- ✅ Tulis di kertas
- ✅ Simpan di tempat aman
- ✅ Pertimbangkan cadangan metal

---

### 2.5 Jenis-jenis Wallet

#### Hot Wallet (Perangkat Lunak) 🔥

**Ekstensi Browser:**
- Contoh: MetaMask, Rabby
- Kelebihan: Nyaman, mudah berinteraksi dengan dApp
- Kekurangan: Rentan jika komputer terkompromi

**Wallet Mobile:**
- Contoh: Trust Wallet, Argent
- Kelebihan: Portabel, autentikasi biometrik
- Kekurangan: Risiko kehilangan ponsel

#### Cold Wallet (Hardware) ❄️

**Hardware Wallet:**
- Contoh: Ledger, Trezor
- Kelebihan: Kunci tidak pernah menyentuh internet, konfirmasi fisik
- Kekurangan: Berbayar, kurang praktis

**Perbandingan:**

| Jenis Wallet | Keamanan | Kemudahan | Terbaik Untuk |
|-------------|----------|-----------|---------------|
| Hardware | ⭐⭐⭐⭐⭐ | ⭐⭐ | Jumlah besar |
| Mobile | ⭐⭐⭐ | ⭐⭐⭐⭐ | Penggunaan harian |
| Browser | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Interaksi dApp |

#### Custodial vs Non-Custodial

**Non-Custodial (Self-Custody):**
- Anda mengontrol private key
- Kepemilikan sejati
- Tidak ada yang bisa membekukan akun
- Anda bertanggung jawab atas keamanan

**Custodial (Pihak Ketiga):**
- Perusahaan mengontrol kunci
- Mudah digunakan
- Pemulihan password tersedia
- Dapat dibekukan/dibatasi

**Prinsip**: "Not your keys, not your crypto"

---

### 2.6 Jenis Akun di Ethereum

```
┌─────────────────────────────────────────────────┐
│          AKUN ETHEREUM                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────┐  ┌─────────────────┐│
│  │ Externally Owned     │  │ Contract        ││
│  │ Account (EOA)        │  │ Account         ││
│  │                      │  │                 ││
│  │ Dikontrol oleh       │  │ Dikontrol oleh  ││
│  │ Private Key          │  │ Kode Smart      ││
│  │                      │  │ Contract        ││
│  └──────────────────────┘  └─────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

**EOA (Externally Owned Account):**
- Dikontrol oleh private key
- Dapat memulai transaksi
- Akun MetaMask Anda
- Tanpa kode

**Contract Account:**
- Dikontrol oleh kode
- Tidak dapat memulai transaksi
- Memiliki kode yang dapat dieksekusi
- Memiliki penyimpanan persisten
- Contoh: Uniswap, token USDC

**Perbedaan Utama:**

| Fitur | EOA | Contract Account |
|-------|-----|------------------|
| **Dikontrol Oleh** | Private Key | Kode Smart Contract |
| **Dapat Memulai Transaksi** | ✅ Ya | ❌ Tidak |
| **Memiliki Kode** | ❌ Tidak | ✅ Ya |
| **Biaya Pembuatan** | Gratis | Memerlukan gas |
| **Contoh** | Wallet MetaMask | Uniswap, USDC |

---

## 📚 Modul 3: Sistem Gas & Transaksi (13:15 - 14:30)

### 3.1 Apa itu Gas?

**Definisi**: Unit yang mengukur pekerjaan komputasi yang diperlukan untuk menjalankan operasi di Ethereum.

#### Analogi Restoran

```
┌────────────────────────────────────────────┐
│         🍽️  ANALOGI RESTORAN               │
├────────────────────────────────────────────┤
│                                            │
│  Item Menu       = Operasi                │
│  (Salad Sederhana) (Transaksi sederhana)  │
│                                            │
│  Harga per Item  = Gas Price (Gwei)       │
│  (Rp150.000/item)  (50 Gwei per gas)      │
│                                            │
│  Jumlah Item     = Gas Limit              │
│  (Pesan 3 item)    (Perlu 21.000 gas)     │
│                                            │
│  Total Tagihan   = Transaction Fee        │
│  (Rp450.000)       (21.000 × 50 Gwei)     │
│                                            │
│  Tip             = Priority Fee           │
│  (Layanan cepat)   (Konfirmasi lebih cepat)│
│                                            │
└────────────────────────────────────────────┘
```

#### Komponen Gas

**1. Gas Limit** (Berapa banyak pekerjaan yang diperlukan):
```
Operasi                        Biaya Gas
─────────────────────────────────────────
Kirim ETH (transfer sederhana) 21.000
Transfer token ERC-20          ~65.000
Swap token Uniswap             ~150.000
Deploy contract sederhana      ~200.000+
Mint NFT                       ~80.000
```

**2. Gas Price** (Berapa yang Anda bayar per unit):
- Diukur dalam **Gwei** (gigawei)
- 1 Gwei = 0,000000001 ETH = 10^-9 ETH
- Bervariasi berdasarkan kemacetan jaringan

**Gas Price Tipikal:**
```
Status Jaringan        Gas Price
──────────────────────────────────
🟢 Tidak Sibuk        5-20 Gwei
🟡 Sedang             20-50 Gwei
🔴 Macet              50-100 Gwei
🔥 Sangat Sibuk       100+ Gwei
```

**3. Transaction Fee** (Total biaya):
```
Biaya Transaksi = Gas Terpakai × Gas Price

Contoh:
─────────────────────────────────────
Gas Terpakai: 21.000
Gas Price: 50 Gwei

Biaya = 21.000 × 50 Gwei
      = 1.050.000 Gwei
      = 0,00105 ETH

Jika ETH = $2.000:
Biaya = $2,10
```

---

### 3.2 EIP-1559: Sistem Gas Modern

**Sistem Lama** (Sebelum EIP-1559):
```
Anda tentukan: Gas Price (satu nilai)
```

**Sistem Baru** (EIP-1559):
```
┌──────────────────────────────────────┐
│  Base Fee (otomatis)                 │  ← Ditentukan protokol (dibakar 🔥)
│  +                                   │
│  Priority Fee (tip Anda)             │  ← Anda tentukan (untuk validator)
│  =                                   │
│  Max Fee Per Gas (maksimum Anda)     │  ← Anda tentukan (perlindungan)
└──────────────────────────────────────┘
```

**Contoh:**
```
Base Fee: 30 Gwei (dibakar)
Priority Fee: 2 Gwei (untuk validator)
Max Fee: 100 Gwei (perlindungan Anda)

Biaya Aktual Per Gas: 30 + 2 = 32 Gwei ✅
(Lebih rendah dari maksimum 100 Gwei)

Total Biaya: 21.000 × 32 Gwei = 0,000672 ETH
```

---

### 3.3 Gas di Layer 2 (Lisk)

**Mengapa L2 lebih murah:**

```
Layer 1 (Ethereum Mainnet):
────────────────────────────────
Kirim ETH: 21.000 gas × 50 Gwei
Biaya: $2-10+ per transaksi 💸

Layer 2 (Lisk):
────────────────────────────────
Kirim ETH: 21.000 gas × 0,001 Gwei
Biaya: $0,001-0,01 per transaksi ✨
```

**Mengapa berbeda?**
1. **Kompetisi lebih sedikit**: Lebih sedikit pengguna per L2
2. **Batching**: Banyak transaksi L2 → satu transaksi L1
3. **Eksekusi optimal**: Efisiensi lebih baik
4. **Kompresi data**: Data yang dikirim ke L1 lebih sedikit

**Contoh Perbandingan:**
```
Swap Uniswap di L1:
  Gas: 180.000 × 50 Gwei = $18 💸

Swap Uniswap di Lisk L2:
  Gas: 180.000 × 0,001 Gwei = $0,00036 ✨

L2 lebih murah ~50.000 kali!
```

---

### 3.4 Anatomi Transaksi

```
┌─────────────────────────────────────────────┐
│            TRANSAKSI                        │
├─────────────────────────────────────────────┤
│                                             │
│  From: 0x742d35Cc6634C0532925a3b844Bc...  │  ← Pengirim
│  To: 0x3f5CE5FBFe3E9af3B33d4e456Cd3...    │  ← Penerima
│  Value: 0.5 ETH                            │  ← Jumlah
│  Data: 0xa9059cbb000000000000000...        │  ← Pemanggilan fungsi
│  Gas Limit: 21000                          │  ← Maksimum gas
│  Max Fee: 50 Gwei                          │  ← Harga maksimum
│  Nonce: 42                                 │  ← Nomor transaksi
│  Signature: 0x8f3b2e1d4c5a6f7b8...        │  ← Bukti
│                                             │
└─────────────────────────────────────────────┘
```

---

### 3.5 Siklus Hidup Transaksi

```
Langkah 1: Buat Transaksi
│  Pengguna: "Saya ingin mengirim 0,5 ETH"
│  Wallet mengisi detail
↓

Langkah 2: Tanda Tangani Transaksi
│  Wallet: "Silakan konfirmasi"
│  Pengguna klik "Konfirmasi"
│  Wallet tanda tangani dengan private key
↓

Langkah 3: Siarkan ke Jaringan
│  Wallet kirim ke node RPC
│  Node siarkan ke mempool
↓

Langkah 4: Menunggu di Mempool
│  Transaksi dalam status "pending"
│  Gas price lebih tinggi = prioritas lebih tinggi
↓

Langkah 5: Masuk ke Blok
│  Validator pilih transaksi
│  Eksekusi transaksi
│  Masukkan ke blok
↓

Langkah 6: Konfirmasi Blok
│  Blok ditambahkan ke blockchain
│  Transaksi memiliki "1 konfirmasi"
↓

Langkah 7: Terfinalisasi
│  Setelah konfirmasi cukup
│  Di Lisk L2: Biasanya 1-2 detik!
```

---

## 💻 Modul 4: Praktik Solidity (14:45 - 16:00)

### Persiapan: Remix IDE & MetaMask

#### 1. Buka Remix IDE

1. Kunjungi [https://remix.ethereum.org](https://remix.ethereum.org)
2. Klik "File Explorer"
3. Siap!

#### 2. Persiapan MetaMask

1. Install MetaMask dari [https://metamask.io](https://metamask.io)
2. Buat wallet (simpan seed phrase dengan aman!)
3. Tambahkan Jaringan Lisk Sepolia:
   - Nama Jaringan: `Lisk Sepolia`
   - RPC URL: `https://rpc.sepolia-api.lisk.com`
   - Chain ID: `4202`
   - Mata Uang: `ETH`
   - Explorer: `https://sepolia-blockscout.lisk.com`

4. Dapatkan ETH testnet: [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)

#### 3. Hubungkan Remix ke MetaMask

1. Di Remix: "Deploy & Run Transactions"
2. Pilih "Injected Provider - MetaMask"
3. Klik "Connect"
4. Selesai!

---

### 4.1 Solidity 101: Tipe Data Dasar

Kita akan belajar satu tipe data per waktu menggunakan contoh tanaman.

#### 1. String (Teks)

**Apa itu**: Menyimpan teks seperti "Rose" atau "Hello World"

Buat file `LearnString.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnString {
    // Variabel string untuk menyimpan nama tanaman
    string public plantName;

    // Constructor mengatur nilai awal
    constructor() {
        plantName = "Rose";
    }

    // Fungsi untuk mengubah nama
    function changeName(string memory _newName) public {
        plantName = _newName;
    }
}
```

**Coba:**
1. Deploy → Klik `plantName` → Lihat "Rose"
2. Ketik "Tulip" → Klik `changeName`
3. Klik `plantName` → Sekarang "Tulip"!

#### 2. Number (uint256)

**Apa itu**: Menyimpan bilangan bulat dari 0 hingga sangat besar (2^256-1)

Buat `LearnNumber.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnNumber {
    // Angka untuk data tanaman
    uint256 public plantId;
    uint256 public waterLevel;

    constructor() {
        plantId = 1;
        waterLevel = 100;
    }

    function changePlantId(uint256 _newId) public {
        plantId = _newId;
    }

    function addWater() public {
        waterLevel = waterLevel + 10;
        // Bisa juga ditulis: waterLevel += 10;
    }
}
```

**Coba:**
1. Deploy → Klik `waterLevel` → Lihat 100
2. Klik `addWater` 3 kali
3. Klik `waterLevel` → Sekarang 130!

#### 3. Boolean (Benar/Salah)

**Apa itu**: Hanya dua nilai - `true` atau `false`

Buat `LearnBoolean.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnBoolean {
    bool public isAlive;
    bool public isBlooming;

    constructor() {
        isAlive = true;
        isBlooming = false;
    }

    function changeStatus(bool _status) public {
        isAlive = _status;
    }

    function bloom() public {
        isBlooming = true;
    }
}
```

#### 4. Address (Alamat Wallet)

Buat `LearnAddress.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnAddress {
    address public owner;
    address public gardener;

    constructor() {
        owner = msg.sender;  // msg.sender = alamat wallet Anda
    }

    function setGardener(address _gardener) public {
        gardener = _gardener;
    }
}
```

---

### 4.2 Solidity 102: Struct & Enum

#### Enum (Angka Bernama)

Buat `LearnEnum.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEnum {
    enum GrowthStage {
        SEED,      // 0
        SPROUT,    // 1
        GROWING,   // 2
        BLOOMING   // 3
    }

    GrowthStage public currentStage;

    constructor() {
        currentStage = GrowthStage.SEED;
    }

    function grow() public {
        if (currentStage == GrowthStage.SEED) {
            currentStage = GrowthStage.SPROUT;
        }
        else if (currentStage == GrowthStage.SPROUT) {
            currentStage = GrowthStage.GROWING;
        }
        else if (currentStage == GrowthStage.GROWING) {
            currentStage = GrowthStage.BLOOMING;
        }
    }
}
```

#### Struct (Kelompok Data)

Buat `LearnStruct.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnStruct {
    enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }

    struct Plant {
        uint256 id;
        address owner;
        GrowthStage stage;
        uint8 waterLevel;
        bool isAlive;
    }

    Plant public myPlant;

    constructor() {
        myPlant = Plant({
            id: 1,
            owner: msg.sender,
            stage: GrowthStage.SEED,
            waterLevel: 100,
            isAlive: true
        });
    }

    function water() public {
        myPlant.waterLevel = 100;
    }

    function grow() public {
        if (myPlant.stage == GrowthStage.SEED) {
            myPlant.stage = GrowthStage.SPROUT;
        }
    }
}
```

---

### 4.3 Solidity 103: Modifier & Event

#### Require (Validasi)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnRequire {
    mapping(uint256 => address) public plantOwner;
    mapping(uint256 => uint8) public waterLevel;

    function addPlant(uint256 _plantId) public {
        plantOwner[_plantId] = msg.sender;
        waterLevel[_plantId] = 100;
    }

    function waterPlant(uint256 _plantId) public {
        // Cek apakah pemanggil memiliki tanaman ini
        require(plantOwner[_plantId] == msg.sender, "Bukan tanaman Anda!");

        waterLevel[_plantId] = 100;
    }
}
```

#### Event (Logging)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEvents {
    event PlantAdded(address indexed owner, uint256 indexed plantId);
    event PlantWatered(uint256 indexed plantId, uint8 waterLevel);

    mapping(uint256 => address) public plantOwner;
    uint256 public plantCounter;

    function addPlant() public {
        plantCounter++;
        plantOwner[plantCounter] = msg.sender;

        emit PlantAdded(msg.sender, plantCounter);
    }

    function waterPlant(uint256 _plantId) public {
        emit PlantWatered(_plantId, 100);
    }
}
```

---

### 4.4 Solidity 104: Fungsi Payable

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnPayable {
    uint256 public plantCounter;

    // Fungsi payable dapat menerima ETH
    function buyPlant() public payable returns (uint256) {
        require(msg.value >= 0.001 ether, "Perlu 0.001 ETH");

        plantCounter++;
        return plantCounter;
    }

    // Cek saldo contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Coba:**
1. Di Remix, atur VALUE ke `1` milliether (= 0,001 ETH)
2. Klik `buyPlant`
3. Klik `getBalance` → Lihat 0,001 ETH!

---

## 🎯 Tantangan: Deploy Game LiskGarden (16:00 - 16:45)

### Contract LiskGarden Lengkap

Sekarang deploy contract game FINAL! Salin kode lengkap ini:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LiskGarden {
    enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }

    struct Plant {
        uint256 id;
        address owner;
        GrowthStage stage;
        uint256 plantedDate;
        uint256 lastWatered;
        uint8 waterLevel;
        bool exists;
        bool isDead;
    }

    mapping(uint256 => Plant) public plants;
    mapping(address => uint256[]) public userPlants;
    uint256 public plantCounter;
    address public owner;

    uint256 public constant PLANT_PRICE = 0.001 ether;
    uint256 public constant HARVEST_REWARD = 0.003 ether;
    uint256 public constant STAGE_DURATION = 1 minutes;
    uint256 public constant WATER_DEPLETION_TIME = 30 seconds;
    uint8 public constant WATER_DEPLETION_RATE = 2;

    event PlantSeeded(address indexed owner, uint256 indexed plantId);
    event PlantWatered(uint256 indexed plantId, uint8 newWaterLevel);
    event PlantHarvested(uint256 indexed plantId, address indexed owner, uint256 reward);
    event StageAdvanced(uint256 indexed plantId, GrowthStage newStage);
    event PlantDied(uint256 indexed plantId);

    constructor() {
        owner = msg.sender;
    }

    function plantSeed() external payable returns (uint256) {
        require(msg.value >= PLANT_PRICE, "Perlu 0.001 ETH");

        plantCounter++;
        uint256 newPlantId = plantCounter;

        plants[newPlantId] = Plant({
            id: newPlantId,
            owner: msg.sender,
            stage: GrowthStage.SEED,
            plantedDate: block.timestamp,
            lastWatered: block.timestamp,
            waterLevel: 100,
            exists: true,
            isDead: false
        });

        userPlants[msg.sender].push(newPlantId);
        emit PlantSeeded(msg.sender, newPlantId);

        return newPlantId;
    }

    function calculateWaterLevel(uint256 plantId) public view returns (uint8) {
        Plant storage plant = plants[plantId];

        if (!plant.exists || plant.isDead) {
            return 0;
        }

        uint256 timeSinceWatered = block.timestamp - plant.lastWatered;
        uint256 depletionIntervals = timeSinceWatered / WATER_DEPLETION_TIME;
        uint256 waterLost = depletionIntervals * WATER_DEPLETION_RATE;

        if (waterLost >= plant.waterLevel) {
            return 0;
        }

        return plant.waterLevel - uint8(waterLost);
    }

    function updateWaterLevel(uint256 plantId) internal {
        Plant storage plant = plants[plantId];

        uint8 currentWater = calculateWaterLevel(plantId);
        plant.waterLevel = currentWater;

        if (currentWater == 0 && !plant.isDead) {
            plant.isDead = true;
            emit PlantDied(plantId);
        }
    }

    function waterPlant(uint256 plantId) external {
        Plant storage plant = plants[plantId];
        require(plant.exists, "Tanaman tidak ada");
        require(plant.owner == msg.sender, "Bukan tanaman Anda");
        require(!plant.isDead, "Tanaman sudah mati");

        plant.waterLevel = 100;
        plant.lastWatered = block.timestamp;

        emit PlantWatered(plantId, 100);
        updatePlantStage(plantId);
    }

    function updatePlantStage(uint256 plantId) public {
        Plant storage plant = plants[plantId];
        require(plant.exists, "Tanaman tidak ada");

        updateWaterLevel(plantId);

        if (plant.isDead) {
            return;
        }

        uint256 timeSincePlanted = block.timestamp - plant.plantedDate;
        GrowthStage oldStage = plant.stage;

        if (timeSincePlanted >= STAGE_DURATION && plant.stage == GrowthStage.SEED) {
            plant.stage = GrowthStage.SPROUT;
        }
        else if (timeSincePlanted >= 2 * STAGE_DURATION && plant.stage == GrowthStage.SPROUT) {
            plant.stage = GrowthStage.GROWING;
        }
        else if (timeSincePlanted >= 3 * STAGE_DURATION && plant.stage == GrowthStage.GROWING) {
            plant.stage = GrowthStage.BLOOMING;
        }

        if (plant.stage != oldStage) {
            emit StageAdvanced(plantId, plant.stage);
        }
    }

    function harvestPlant(uint256 plantId) external {
        Plant storage plant = plants[plantId];
        require(plant.exists, "Tanaman tidak ada");
        require(plant.owner == msg.sender, "Bukan tanaman Anda");
        require(!plant.isDead, "Tanaman sudah mati");

        updatePlantStage(plantId);
        require(plant.stage == GrowthStage.BLOOMING, "Tanaman belum siap");

        plant.exists = false;
        emit PlantHarvested(plantId, msg.sender, HARVEST_REWARD);

        (bool success, ) = msg.sender.call{value: HARVEST_REWARD}("");
        require(success, "Transfer gagal");
    }

    function getPlant(uint256 plantId) external view returns (Plant memory) {
        Plant memory plant = plants[plantId];
        plant.waterLevel = calculateWaterLevel(plantId);
        return plant;
    }

    function getUserPlants(address user) external view returns (uint256[] memory) {
        return userPlants[user];
    }

    function withdraw() external {
        require(msg.sender == owner, "Bukan owner");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer gagal");
    }

    receive() external payable {}
}
```

### Cara Bermain

1. **Tanam Benih** (Biaya 0,001 ETH)
   - Atur VALUE ke 0,001 ETH
   - Klik `plantSeed` → Dapatkan plantId

2. **Tunggu Pertumbuhan**
   - Tunggu 1 menit → SPROUT
   - Tunggu 2 menit total → GROWING
   - Tunggu 3 menit total → BLOOMING

3. **Siram Tanaman Anda**
   - Klik `waterPlant` dengan plantId
   - Jaga agar tetap hidup!

4. **Panen Saat Siap**
   - Saat BLOOMING, klik `harvestPlant`
   - Terima 0,003 ETH!
   - Profit: 0,002 ETH per tanaman!

5. **Jangan Biarkan Mati**
   - Tanaman kehilangan 2% air setiap 30 detik
   - Pada 0% air → Tanaman mati!

### Langkah Deployment

1. **Kompilasi**:
   - Klik "Solidity Compiler"
   - Klik "Compile LiskGarden.sol"
   - Centang hijau = Berhasil!

2. **Deploy**:
   - Pastikan MetaMask di Lisk Sepolia
   - Klik "Deploy & Run Transactions"
   - Pilih "Injected Provider"
   - Klik "Deploy"
   - Konfirmasi di MetaMask

3. **Berinteraksi**:
   - Contract muncul di "Deployed Contracts"
   - Coba semua fungsi!

4. **Lihat di Explorer**:
   - Salin alamat contract
   - Kunjungi https://sepolia-blockscout.lisk.com
   - Tempel alamat
   - Lihat contract Anda di blockchain!

---

## 📝 Hasil yang Harus Diserahkan

### Hasil Wajib

✅ **1. Contract LiskGarden yang Ter-deploy**
- Contract ter-deploy ke Lisk Sepolia
- Alamat contract terdokumentasi
- Hash transaksi tercatat

✅ **2. Repository GitHub**
- Semua file contract
- README dengan instruksi
- Alamat deployment

✅ **3. Refleksi Pembelajaran**
- Apa yang dipelajari hari ini
- Tantangan yang dihadapi
- Tujuan untuk sesi berikutnya

### Format Pengumpulan

```
sesi-1-liskgarden/
├── contracts/
│   ├── LearnString.sol
│   ├── LearnNumber.sol
│   ├── LearnBoolean.sol
│   ├── LearnAddress.sol
│   ├── LearnEnum.sol
│   ├── LearnStruct.sol
│   ├── LearnRequire.sol
│   ├── LearnEvents.sol
│   ├── LearnPayable.sol
│   └── LiskGarden.sol
├── README.md
└── REFLEKSI.md
```

**Batas Waktu**: Sebelum Sesi 2 (Minggu, 26 Oktober 2025)

---

## 📖 Ringkasan & Langkah Selanjutnya

### Pencapaian Hari Ini 🎉

**Modul 1: Evolusi Web & Blockchain**
- ✅ Memahami Web1, Web2, Web3
- ✅ Fondasi blockchain
- ✅ Mekanisme konsensus
- ✅ Blockchain trilemma

**Modul 2: Layer 2, Lisk & Wallet**
- ✅ Memahami Layer 2
- ✅ Pengenalan Lisk
- ✅ Teknologi wallet
- ✅ Jenis-jenis akun

**Modul 3: Sistem Gas**
- ✅ Mekanika gas
- ✅ EIP-1559
- ✅ Keuntungan gas L2
- ✅ Siklus hidup transaksi

**Modul 4: Praktik Solidity**
- ✅ Tipe data dasar
- ✅ Struct & Enum
- ✅ Modifier & Event
- ✅ Fungsi payable
- ✅ Game LiskGarden lengkap ter-deploy!

---

### Preview: Sesi 2 - Arsitektur Modular Smart Contract

**Minggu, 26 Oktober 2025** (09:00-17:00 @ JURA Kemanggisan):

Topik:
- Standar Token ERC (ERC-20, ERC-721, ERC-1155)
- Inheritance & komposisi contract
- Library OpenZeppelin
- Pola proxy untuk contract yang dapat diupgrade
- Implementasi pola factory
- Sistem multi-contract

Proyek:
- Deploy token ERC-20 lengkap
- Buat koleksi NFT
- Bangun token factory

---

## 📚 Sumber Belajar

**Link Penting:**
- [Dokumentasi Lisk](https://docs.lisk.com)
- [Remix IDE](https://remix.ethereum.org)
- [Dokumentasi Solidity](https://docs.soliditylang.org)
- [Faucet Lisk Sepolia](https://sepolia-faucet.lisk.com)
- [Explorer Lisk Sepolia](https://sepolia-blockscout.lisk.com)

**Komunitas:**
- Discord: Ethereum Jakarta
- Telegram: BlockDevID
- Twitter: @ethjkt

---

## 🎉 Terima Kasih!

Selamat! Anda telah menyelesaikan Sesi 1 dari Kelas Rutin Batch IV.

Fondasi yang dibangun hari ini adalah batu loncatan untuk menjadi pengembang Web3 profesional.

**Ingat:**
> "Setiap ahli dulunya pemula. Terus bangun, terus belajar!"

**Sampai jumpa besok di Sesi 2! 🚀**

---

**Kontak & Dukungan:**
- Discord: [Ethereum Jakarta](https://discord.gg/ethjkt)
- Email: hello@ethjkt.com
- Twitter: [@ethjkt](https://twitter.com/ethjkt)

---

*Dibuat dengan ❤️ untuk Kelas Rutin BlockDevID Batch IV*
*Komunitas Ethereum Jakarta © 2025*
