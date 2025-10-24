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

#### Merkle Tree: Struktur Data Blockchain

**Apa itu Merkle Tree?**

Merkle Tree (juga disebut Hash Tree) adalah struktur data yang digunakan blockchain untuk memverifikasi data dengan efisien.

**Visualisasi Merkle Tree:**
```
                    Root Hash
                   (Hash ABCD)
                   /          \
                  /            \
            Hash AB          Hash CD
            /    \            /    \
           /      \          /      \
       Hash A  Hash B    Hash C  Hash D
         |       |         |       |
      Data A  Data B    Data C  Data D
    (Tx 1)  (Tx 2)    (Tx 3)  (Tx 4)
```

**Cara Kerja Merkle Tree:**

1. **Level Paling Bawah**: Setiap transaksi di-hash
   - Data A → Hash A (0x1a2b...)
   - Data B → Hash B (0x3c4d...)
   - Data C → Hash C (0x5e6f...)
   - Data D → Hash D (0x7g8h...)

2. **Level Tengah**: Hash digabungkan berpasangan
   - Hash A + Hash B → Hash AB
   - Hash C + Hash D → Hash CD

3. **Root Hash**: Hash terakhir yang merepresentasikan semua data
   - Hash AB + Hash CD → Root Hash

**Mengapa Penting?**

**1. Verifikasi Efisien**
```
Tanpa Merkle Tree:
- Untuk verifikasi 1 transaksi dari 1000 transaksi
- Harus download semua 1000 transaksi ❌
- Butuh banyak bandwidth dan waktu

Dengan Merkle Tree:
- Hanya perlu download ~10 hash (log₂ 1000) ✅
- Sangat cepat dan hemat bandwidth
```

**2. Integritas Data**
```
Jika satu transaksi berubah:
Data A → Data A' (diubah)
   ↓
Hash A → Hash A' (berubah)
   ↓
Hash AB → Hash AB' (berubah)
   ↓
Root Hash → Root Hash' (berubah)

Semua node langsung tahu ada perubahan! 🚨
```

**Contoh Praktis:**

Misalkan Anda ingin membuktikan Transaksi C ada dalam blok:

```
Yang dibutuhkan:
1. Hash C (transaksi yang ingin dibuktikan)
2. Hash D (pasangan Hash C)
3. Hash AB (untuk menghitung Root)

Verifikasi:
Hash C + Hash D = Hash CD ✅
Hash CD + Hash AB = Root Hash ✅

Terbukti! Transaksi C valid di blok ini.
```

**Keuntungan Merkle Tree:**

✅ **Efisiensi Penyimpanan**
- Tidak perlu simpan semua transaksi untuk verifikasi
- Hanya perlu beberapa hash sebagai "proof"

✅ **Verifikasi Cepat**
- Kompleksitas O(log n) bukan O(n)
- 1000 transaksi hanya perlu 10 hash untuk verifikasi

✅ **Light Client**
- Wallet mobile bisa verifikasi transaksi
- Tanpa download seluruh blockchain

✅ **Integritas Terjamin**
- Satu bit berubah → Root Hash berubah
- Tidak mungkin manipulasi data tanpa ketahuan

**Penggunaan di Ethereum:**

1. **State Tree**: Menyimpan semua account state
2. **Transaction Tree**: Menyimpan semua transaksi dalam blok
3. **Receipt Tree**: Menyimpan semua receipt transaksi

**Analogi Sederhana:**

Bayangkan Merkle Tree seperti **daftar isi buku**:
- Buku memiliki 1000 halaman (transaksi)
- Daftar isi hanya 5 halaman (hash tree)
- Anda bisa cepat verifikasi apakah halaman 537 ada di buku
- Tanpa harus membaca semua 1000 halaman

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

### 3.2 Unit Ethereum: Wei, Gwei, dan ETH

#### Mengapa Ada Unit Berbeda?

Seperti uang Rupiah memiliki sen (Rp0,01), Ethereum juga memiliki unit-unit kecil untuk transaksi presisi tinggi. Unit terkecil disebut **Wei**.

#### Daftar Lengkap Unit Ethereum

**Dari Terkecil ke Terbesar:**

```
┌─────────────┬────────────────┬─────────────────────┬──────────────┐
│ Nama Unit   │ Nilai Wei      │ Nilai Ether         │ Penggunaan   │
├─────────────┼────────────────┼─────────────────────┼──────────────┤
│ Wei         │ 1              │ 10⁻¹⁸ ETH          │ Unit terkecil│
│ Kwei        │ 1.000          │ 10⁻¹⁵ ETH          │ Jarang       │
│ Mwei        │ 1.000.000      │ 10⁻¹² ETH          │ Jarang       │
│ Gwei        │ 1.000.000.000  │ 10⁻⁹ ETH (0,000000001)│ Gas price  │
│ Szabo       │ 10¹²           │ 10⁻⁶ ETH (0,000001) │ Jarang       │
│ Finney      │ 10¹⁵           │ 10⁻³ ETH (0,001)    │ Micro payment│
│ Ether (ETH) │ 10¹⁸           │ 1 ETH               │ Standar      │
└─────────────┴────────────────┴─────────────────────┴──────────────┘
```

#### Unit yang Paling Sering Digunakan

**1. Wei** - Unit Terkecil
```
1 Wei = 0,000000000000000001 ETH

Penggunaan:
- Perhitungan internal smart contract
- Presisi matematis blockchain
- Hindari desimal floating point

Contoh:
1 ETH = 1.000.000.000.000.000.000 Wei
      = 1 × 10¹⁸ Wei
```

**2. Gwei (Gigawei)** - Gas Price
```
1 Gwei = 1.000.000.000 Wei
       = 0,000000001 ETH
       = 10⁻⁹ ETH

Penggunaan:
- Harga gas (gas price)
- Biaya transaksi
- Mudah dibaca untuk manusia

Contoh:
Gas price 50 Gwei = 50.000.000.000 Wei
```

**3. Ether (ETH)** - Standar
```
1 ETH = 1.000.000.000.000.000.000 Wei
      = 1.000.000.000 Gwei
      = 10¹⁸ Wei

Penggunaan:
- Transfer antar user
- Harga token/NFT
- Saldo wallet
- Nilai pasar
```

---

### 3.3 Memahami Desimal dan Notasi Eksponen

#### Sistem Desimal di Blockchain

Blockchain tidak menggunakan desimal (floating point) karena tidak presisi. Sebagai gantinya, semua nilai disimpan sebagai **integer dalam Wei**.

**Mengapa Tidak Pakai Desimal?**

```
Masalah Floating Point:
0,1 + 0,2 = 0,30000000000000004 ❌ (di komputer)

Solusi Blockchain:
100000000000000000 + 200000000000000000 = 300000000000000000 ✅
(0,1 ETH)          + (0,2 ETH)          = (0,3 ETH) dalam Wei
```

#### Notasi Eksponen 10ⁿ

**Apa itu 10ⁿ?**

Notasi untuk bilangan yang sangat besar atau kecil:

```
10⁰  = 1
10¹  = 10
10²  = 100
10³  = 1.000
10⁶  = 1.000.000 (juta)
10⁹  = 1.000.000.000 (miliar)
10¹² = 1.000.000.000.000 (triliun)
10¹⁵ = 1.000.000.000.000.000 (kuadriliun)
10¹⁸ = 1.000.000.000.000.000.000 (ETH dalam Wei!)

Dan negatif:
10⁻¹ = 0,1
10⁻² = 0,01
10⁻³ = 0,001
10⁻⁹ = 0,000000001 (Gwei dalam ETH)
10⁻¹⁸ = 0,000000000000000001 (Wei dalam ETH)
```

#### Konversi Praktis

**Konversi ETH ↔ Wei:**

```
ETH ke Wei:
Kalikan dengan 10¹⁸

Contoh:
1 ETH = 1 × 10¹⁸ Wei = 1000000000000000000 Wei
0,5 ETH = 0,5 × 10¹⁸ Wei = 500000000000000000 Wei
0,001 ETH = 0,001 × 10¹⁸ Wei = 1000000000000000 Wei
```

```
Wei ke ETH:
Bagi dengan 10¹⁸

Contoh:
1000000000000000000 Wei = 1000000000000000000 ÷ 10¹⁸ = 1 ETH
21000000000000 Wei = 21000000000000 ÷ 10¹⁸ = 0,000021 ETH
```

**Konversi Gwei ↔ ETH:**

```
Gwei ke ETH:
Bagi dengan 10⁹ (atau 1.000.000.000)

Contoh:
50 Gwei = 50 ÷ 10⁹ ETH = 0,00000005 ETH
```

```
ETH ke Gwei:
Kalikan dengan 10⁹

Contoh:
0,00000005 ETH = 0,00000005 × 10⁹ Gwei = 50 Gwei
```

#### Contoh Perhitungan Lengkap

**Contoh 1: Hitung Biaya Transaksi dalam Wei**

```
Data:
- Gas Terpakai: 21.000
- Gas Price: 50 Gwei

Langkah 1: Konversi Gwei ke Wei
50 Gwei = 50 × 10⁹ Wei = 50.000.000.000 Wei

Langkah 2: Hitung Total
Biaya = 21.000 × 50.000.000.000 Wei
      = 1.050.000.000.000.000 Wei

Langkah 3: Konversi ke ETH
1.050.000.000.000.000 Wei ÷ 10¹⁸ = 0,00105 ETH

Jawaban: 0,00105 ETH
```

**Contoh 2: Bayar 0,001 ETH, Berapa Wei?**

```
0,001 ETH × 10¹⁸ = 1.000.000.000.000.000 Wei
                  = 1 × 10¹⁵ Wei
                  = 1 Finney
```

**Contoh 3: Contract Menerima 2.500.000.000.000.000 Wei**

```
2.500.000.000.000.000 Wei ÷ 10¹⁸ = 0,0025 ETH
                                   = 2,5 Finney
```

#### Tabel Konversi Cepat

```
┌──────────────┬─────────────────────────────┬─────────────┐
│   ETH        │          Wei                │    Gwei     │
├──────────────┼─────────────────────────────┼─────────────┤
│ 1 ETH        │ 1.000.000.000.000.000.000   │ 1.000.000.000│
│ 0,1 ETH      │ 100.000.000.000.000.000     │ 100.000.000 │
│ 0,01 ETH     │ 10.000.000.000.000.000      │ 10.000.000  │
│ 0,001 ETH    │ 1.000.000.000.000.000       │ 1.000.000   │
│ 0,0001 ETH   │ 100.000.000.000.000         │ 100.000     │
│ 0,00001 ETH  │ 10.000.000.000.000          │ 10.000      │
│ 0,000001 ETH │ 1.000.000.000.000           │ 1.000       │
│ 0,0000001 ETH│ 100.000.000.000             │ 100         │
│ 0,00000001 ETH│ 10.000.000.000             │ 10          │
│ 0,000000001 ETH│ 1.000.000.000             │ 1           │
└──────────────┴─────────────────────────────┴─────────────┘
```

#### Praktik di Solidity

**Solidity Memiliki Helper untuk Konversi:**

```solidity
// Dalam Solidity, Anda bisa tulis langsung:
uint256 price = 1 ether;  // = 1000000000000000000 Wei
uint256 price = 1 gwei;   // = 1000000000 Wei
uint256 price = 1 wei;    // = 1 Wei

// Contoh penggunaan:
require(msg.value >= 0.001 ether, "Minimum 0.001 ETH");
// Ini otomatis dikonversi ke Wei: 1000000000000000
```

#### Tips Penting

**Untuk Developer:**

✅ **Selalu gunakan Wei** dalam perhitungan smart contract
✅ **Gunakan `ether`** keyword di Solidity untuk readability
✅ **Hindari floating point** - gunakan integer Wei
✅ **Validasi input** untuk mencegah overflow/underflow

**Untuk Pengguna:**

✅ **Gas price** selalu dalam Gwei (lebih mudah dibaca)
✅ **Transfer** biasanya dalam ETH
✅ **Periksa kembali** angka sebelum mengirim transaksi
✅ **Gunakan calculator** jika ragu: [eth-converter.com](https://eth-converter.com)

---

### 3.4 EIP-1559: Sistem Gas Modern

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

**Apa itu**: Menyimpan alamat wallet Ethereum (20 bytes, seperti 0x742d35Cc...)

**Mengapa penting**: Untuk identifikasi kepemilikan, pengirim transaksi, dan tujuan pembayaran

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

**Poin Penting:**
- `address` - menyimpan alamat wallet (0x742d35Cc...)
- `msg.sender` - alamat yang memanggil fungsi
- Digunakan untuk kepemilikan, pembayaran, kontrol akses

**Coba:**
1. Deploy → Klik `owner` → Lihat alamat wallet Anda!
2. Salin alamat lain → Tempel di `setGardener`
3. Klik `gardener` → Lihat alamat tersebut

#### 5. 🎯 TANTANGAN: Buat SimplePlant Sendiri!

**Apa yang dipelajari**: Menggabungkan semua tipe data dalam satu contract

**Tujuan**: Tulis contract `SimplePlant.sol` SENDIRI tanpa copy-paste!

---

**📋 Spesifikasi Contract:**

Buat contract yang menggabungkan semua tipe data yang sudah dipelajari:

**State Variables yang dibutuhkan:**
```
1. plantName (tipe: string, public) → nama tanaman
2. waterLevel (tipe: uint256, public) → level air
3. isAlive (tipe: bool, public) → status hidup
4. owner (tipe: address, public) → pemilik
5. plantedTime (tipe: uint256, public) → waktu tanam
```

**Constructor:**
```
- Set plantName = "Rose"
- Set waterLevel = 100
- Set isAlive = true
- Set owner = alamat yang deploy (gunakan msg.sender)
- Set plantedTime = waktu sekarang (gunakan block.timestamp)
```

**Fungsi yang dibutuhkan:**
```
1. water()
   - Tipe: public
   - Aksi: Set waterLevel kembali ke 100

2. getAge()
   - Tipe: public view
   - Return: uint256
   - Aksi: Hitung umur tanaman (waktu sekarang - waktu tanam)
```

---

**🔨 Mulai Coding:**

Buat file baru `SimplePlant.sol` di Remix dan mulai dari template ini:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SimplePlant {
    // TODO 1: Deklarasikan 5 state variables
    // Hint: string public plantName;
    // Hint: uint256 public ...
    // ... tulis 4 lainnya!




    // TODO 2: Buat constructor
    constructor() {
        // Set nilai awal untuk semua variables
        // Hint: plantName = "Rose";
        // Hint: owner = msg.sender;


    }

    // TODO 3: Buat fungsi water()
    // Hint: function water() public { ... }


    // TODO 4: Buat fungsi getAge()
    // Hint: function getAge() public view returns (uint256) { ... }
    // Hint: return block.timestamp - plantedTime;


}
```

---

**✅ Checklist Verifikasi:**

Setelah selesai, cek apakah contract Anda memenuhi ini:

- [ ] Ada 5 state variables (string, uint256, bool, address, uint256)
- [ ] Semua variables adalah `public`
- [ ] Constructor mengatur semua nilai awal
- [ ] Fungsi `water()` mengubah waterLevel ke 100
- [ ] Fungsi `getAge()` adalah `view` dan return `uint256`
- [ ] Fungsi `getAge()` menghitung selisih waktu
- [ ] Contract dapat di-compile tanpa error

---

**🧪 Test Contract Anda:**

1. **Deploy**
   - Klik "Deploy" di Remix
   - Lihat contract muncul di "Deployed Contracts"

2. **Test Variables**
   - Klik `plantName` → Harus tampil "Rose"
   - Klik `waterLevel` → Harus tampil 100
   - Klik `isAlive` → Harus tampil true
   - Klik `owner` → Harus tampil alamat wallet Anda
   - Klik `plantedTime` → Harus tampil angka (Unix timestamp)

3. **Test Fungsi water()**
   - Klik `water` → Popup MetaMask muncul (karena mengubah state)
   - Confirm transaksi
   - Klik `waterLevel` lagi → Masih 100

4. **Test Fungsi getAge()**
   - Klik `getAge` → Langsung tampil angka (GRATIS, no MetaMask popup!)
   - Tunggu 1 menit
   - Klik `getAge` lagi → Angka bertambah ~60 detik!

---

**🎓 Penjelasan Konsep:**

**Variabel Khusus Solidity:**
- `msg.sender` - alamat wallet yang memanggil fungsi
- `block.timestamp` - waktu blok saat ini (Unix timestamp dalam detik)

**Modifier Fungsi:**
- `public` - siapa saja dapat memanggil fungsi
- `view` - hanya membaca, tidak mengubah state → **GRATIS!**
- `returns (uint256)` - fungsi mengembalikan angka

**Cara Kerja:**
1. Constructor berjalan **sekali** saat deploy
2. State variables tersimpan **permanen** di blockchain
3. Fungsi `view` GRATIS dipanggil dari luar (no gas!)
4. Fungsi yang mengubah state butuh gas (popup MetaMask)

---

**💡 Tips Debugging:**

**Error Umum:**

```
"ParserError: Expected ';' but got '}'"
→ Lupa titik koma di akhir statement

"TypeError: Member 'sender' not found"
→ Salah ketik: msg.sender (huruf kecil semua!)

"DeclarationError: Undeclared identifier"
→ Variabel belum dideklarasikan atau typo nama

"TypeError: Different number of arguments"
→ Cek parameter fungsi, apakah sudah sesuai?
```

**Jika Stuck:**
1. Cek kembali 4 contract sebelumnya (String, Number, Boolean, Address)
2. Lihat pattern yang sama
3. Kombinasikan pattern tersebut
4. Jangan menyerah! Ini proses belajar 💪

---

**🏆 Setelah Berhasil:**

Selamat! Anda sudah menguasai:
- ✅ 4 tipe data dasar (string, uint256, bool, address)
- ✅ State variables
- ✅ Constructor
- ✅ Public functions
- ✅ View functions (read-only)
- ✅ Global variables (msg.sender, block.timestamp)

**Selanjutnya**: Pelajari Struct & Enum untuk data yang lebih kompleks!

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

**Penjelasan:**
- `struct Plant { ... }` - membuat tipe kustom baru yang mengelompokkan data terkait
- Seperti membuat template: setiap Plant memiliki id, owner, stage, waterLevel, isAlive
- `Plant public myPlant` - membuat variabel bertipe Plant
- `myPlant = Plant({ ... })` - mengisi struct dengan data (menggunakan nama)
- `myPlant.waterLevel = 100` - akses dan ubah field tertentu
- `myPlant.stage` - akses field tertentu untuk membacanya

**Coba:**
1. Deploy
2. Klik `myPlant` → Lihat semua data: id=1, alamat Anda, stage=0, water=100, alive=true
3. Klik `water` dan `grow` untuk mengubah data
4. Klik `myPlant` lagi untuk melihat perubahan!

---

### 4.3 Solidity 103: Mapping & Array

Pelajari cara mengelola banyak tanaman.

#### 1. Mapping (Kamus)

**Apa itu**: Seperti kamus - memetakan kunci ke nilai (plantId → owner, plantId → water level)

**Mengapa penting**: Mengasosiasikan data dengan identifier unik. Pencarian cepat berdasarkan kunci

Buat `LearnMapping.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnMapping {
    // Mapping: plantId => waterLevel
    mapping(uint256 => uint8) public plantWater;

    // Mapping: plantId => owner
    mapping(uint256 => address) public plantOwner;

    function addPlant(uint256 _plantId) public {
        plantWater[_plantId] = 100;
        plantOwner[_plantId] = msg.sender;
    }

    function waterPlant(uint256 _plantId) public {
        plantWater[_plantId] = 100;
    }
}
```

**Penjelasan:**
- `mapping(uint256 => uint8)` - seperti kamus, memetakan plantId (kunci) ke waterLevel (nilai)
- `mapping(uint256 => address)` - memetakan plantId ke alamat owner
- `plantWater[_plantId] = 100` - mengatur level air untuk plant ID tertentu
- `plantOwner[_plantId] = msg.sender` - mengatur owner untuk plant ID tertentu
- `public` pada mapping otomatis membuat fungsi getter

**Coba:**
1. Deploy
2. Ketik 1 di kotak `addPlant` → Klik
3. Ketik 2 di kotak `addPlant` → Klik
4. Ketik 1 di kotak `plantWater` → Lihat 100
5. Ketik 2 di kotak `plantWater` → Lihat 100
6. Sekarang Anda punya 2 tanaman!

#### 2. Array (Daftar)

**Apa itu**: Daftar berurutan yang dapat bertambah ukurannya ([1, 2, 3, ...])

**Mengapa penting**: Menyimpan koleksi yang dapat diiterasi. Mendapatkan semua item sekaligus

Buat `LearnArray.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnArray {
    // Array untuk menyimpan plant ID
    uint256[] public allPlantIds;

    // Tambah tanaman
    function addPlant(uint256 _plantId) public {
        allPlantIds.push(_plantId);
    }

    // Dapatkan total tanaman
    function getTotalPlants() public view returns (uint256) {
        return allPlantIds.length;
    }

    // Dapatkan semua plant ID
    function getAllPlants() public view returns (uint256[] memory) {
        return allPlantIds;
    }
}
```

**Penjelasan:**
- `uint256[]` - array dinamis (daftar) yang dapat bertambah ukurannya
- `allPlantIds.push(_plantId)` - menambahkan elemen ke akhir array
- `allPlantIds.length` - mengembalikan jumlah elemen dalam array
- `allPlantIds[0]` - akses elemen pertama (array dimulai dari indeks 0!)
- `returns (uint256[] memory)` - mengembalikan seluruh array

**Coba:**
1. Deploy
2. Tambah tanaman dengan ID: 1, 2, 3
3. Klik `getTotalPlants` → Lihat 3
4. Klik `getAllPlants` → Lihat [1, 2, 3]

#### 3. Mapping + Struct (Banyak Tanaman)

**Apa itu**: Menggabungkan mapping dengan struct untuk menyimpan banyak item kompleks (plantId → Plant struct)

**Mengapa penting**: Mengelola banyak item dengan data kompleks. Pola smart contract dunia nyata

Buat `MultiplePlants.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MultiplePlants {
    enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }

    struct Plant {
        uint256 id;
        address owner;
        GrowthStage stage;
        uint8 waterLevel;
        bool exists;
    }

    // Mapping untuk menyimpan tanaman
    mapping(uint256 => Plant) public plants;

    // Counter
    uint256 public plantCounter;

    // Tambah tanaman baru
    function addPlant() public returns (uint256) {
        plantCounter++;

        plants[plantCounter] = Plant({
            id: plantCounter,
            owner: msg.sender,
            stage: GrowthStage.SEED,
            waterLevel: 100,
            exists: true
        });

        return plantCounter;
    }

    // Siram tanaman
    function waterPlant(uint256 _plantId) public {
        plants[_plantId].waterLevel = 100;
    }

    // Dapatkan info tanaman
    function getPlant(uint256 _plantId) public view returns (Plant memory) {
        return plants[_plantId];
    }
}
```

**Penjelasan:**
- `mapping(uint256 => Plant) public plants` - memetakan plantId ke Plant struct
- `plantCounter++` - meningkatkan counter sebesar 1 (membuat ID unik)
- `plants[plantCounter] = Plant({ ... })` - menyimpan tanaman baru di mapping
- `returns (uint256)` - fungsi mengembalikan ID tanaman baru
- `returns (Plant memory)` - fungsi mengembalikan salinan Plant struct
- Menggabungkan mapping + struct untuk mengelola banyak tanaman!

**Coba:**
1. Deploy
2. Klik `addPlant` → Mengembalikan plantId=1
3. Klik `addPlant` lagi → Mengembalikan plantId=2
4. Ketik 1 di `getPlant` → Lihat data tanaman #1
5. Ketik 2 di `getPlant` → Lihat data tanaman #2
6. Ketik 1 di `waterPlant` → Siram tanaman #1!

---

### 4.4 Solidity 104: Modifier & Event

Tambahkan keamanan dan komunikasi.

#### 1. Require (Validasi)

**Apa itu**: Penjaga keamanan yang memeriksa kondisi sebelum menjalankan kode

**Mengapa penting**: Mencegah tindakan tidak sah. Validasi input. Penting untuk keamanan

Buat `LearnRequire.sol`:

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

**Penjelasan:**
- `require(condition, "error message")` - memeriksa apakah kondisi benar
- Jika kondisi FALSE → transaksi gagal dan menampilkan pesan error
- Jika kondisi TRUE → kode berlanjut ke baris berikutnya
- `plantOwner[_plantId] == msg.sender` - memeriksa apakah pemanggil memiliki tanaman
- Digunakan untuk validasi dan pemeriksaan keamanan

**Coba:**
1. Deploy
2. Tambah tanaman dengan ID=1
3. Coba siram → BERHASIL (Anda memilikinya)
4. Ganti ke akun lain di MetaMask
5. Coba siram tanaman #1 → GAGAL dengan "Bukan tanaman Anda!"

#### 2. Modifier (Pemeriksaan Reusable)

**Apa itu**: Pembungkus validasi yang dapat digunakan kembali untuk banyak fungsi

**Mengapa penting**: Hindari pengulangan pemeriksaan require. Kode lebih bersih. Prinsip DRY (Don't Repeat Yourself)

Buat `LearnModifier.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnModifier {
    address public owner;
    mapping(uint256 => address) public plantOwner;
    mapping(uint256 => uint8) public waterLevel;
    uint256 public ownerActionCount;

    constructor() {
        owner = msg.sender;
    }

    // Modifier: hanya owner yang bisa memanggil
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner!");
        _;
    }

    // Modifier: harus memiliki tanaman
    modifier onlyPlantOwner(uint256 _plantId) {
        require(plantOwner[_plantId] == msg.sender, "Bukan tanaman Anda!");
        _;
    }

    function addPlant(uint256 _plantId) public {
        plantOwner[_plantId] = msg.sender;
        waterLevel[_plantId] = 100;
    }

    // Hanya owner yang bisa memanggil ini
    function ownerFunction() public onlyOwner {
        ownerActionCount++;
    }

    // Hanya pemilik tanaman yang bisa menyiram
    function waterPlant(uint256 _plantId) public onlyPlantOwner(_plantId) {
        waterLevel[_plantId] = 100;
    }
}
```

**Penjelasan:**
- `modifier onlyOwner() { ... }` - membuat pemeriksaan yang dapat digunakan kembali
- `_` - placeholder di mana kode fungsi akan berjalan
- `function ownerFunction() public onlyOwner` - menerapkan modifier
- Modifier berjalan SEBELUM fungsi (memeriksa kondisi dulu)
- `ownerActionCount++` - menambah counter (hanya owner yang bisa melakukan ini)
- Lebih bersih daripada menulis require di setiap fungsi!
- Dapat menggunakan beberapa modifier pada satu fungsi

**Coba:**
1. Deploy
2. Klik `ownerActionCount` → Lihat 0
3. Klik `ownerFunction` → BERHASIL (Anda owner)
4. Klik `ownerActionCount` → Sekarang 1!
5. Ganti akun → Coba `ownerFunction` → GAGAL dengan "Hanya owner!"
6. Tambah tanaman dengan ID=1, coba siram → BERHASIL
7. Ganti akun → Coba siram tanaman #1 → GAGAL dengan "Bukan tanaman Anda!"

#### 3. Event (Komunikasi)

**Apa itu**: Menyiarkan log tentang apa yang terjadi di contract Anda (disimpan di blockchain)

**Mengapa penting**: Frontend mendengarkan pembaruan real-time. Melacak riwayat. Alat debugging

Buat `LearnEvents.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEvents {
    // Deklarasi event
    event PlantAdded(address indexed owner, uint256 indexed plantId);
    event PlantWatered(uint256 indexed plantId, uint8 waterLevel);

    mapping(uint256 => address) public plantOwner;
    uint256 public plantCounter;

    function addPlant() public {
        plantCounter++;
        plantOwner[plantCounter] = msg.sender;

        // Emit event
        emit PlantAdded(msg.sender, plantCounter);
    }

    function waterPlant(uint256 _plantId) public {
        // Emit event
        emit PlantWatered(_plantId, 100);
    }
}
```

**Penjelasan:**
- `event PlantAdded(...)` - mendeklarasikan event (data apa yang akan dicatat)
- `indexed` - membuat parameter dapat dicari (maksimal 3 parameter indexed)
- `emit PlantAdded(msg.sender, plantCounter)` - memicu event
- Event disimpan di blockchain tapi TIDAK menghabiskan gas untuk dibaca
- Frontend dapat mendengarkan event secara real-time
- Digunakan untuk: logging, notifikasi, melacak riwayat

**Coba:**
1. Deploy
2. Klik `addPlant`
3. Lihat transaksi di konsol Remix
4. Klik "logs" → Lihat event PlantAdded!
5. Klik `waterPlant` dengan ID=1
6. Lihat event PlantWatered di logs!

---

### 4.5 Solidity 105: Payable & LiskGarden Lengkap

Akhirnya, tambahkan uang (ETH) dan bangun game lengkap!

#### 1. Fungsi Payable

**Apa itu**: Keyword yang memungkinkan fungsi menerima ETH (msg.value)

**Mengapa penting**: Menerima pembayaran, donasi, hadiah. Tanpa ini, mengirim ETH akan gagal

Buat `LearnPayable.sol`:

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

**Penjelasan:**
- `payable` - keyword yang memungkinkan fungsi menerima ETH
- `msg.value` - jumlah ETH yang dikirim dengan transaksi (dalam wei)
- `0.001 ether` - compiler mengkonversi ke wei (1 ether = 10^18 wei)
- `require(msg.value >= 0.001 ether)` - memeriksa pembayaran minimum
- `address(this).balance` - saldo ETH contract
- Tanpa payable, mengirim ETH akan gagal!

**Coba:**
1. Deploy
2. Di Remix, cari field "VALUE" (di atas tombol Deploy)
3. Masukkan 1 dan pilih milliether (= 0,001 ETH)
4. Klik `buyPlant` → Konfirmasi di MetaMask
5. Klik `getBalance` → Lihat 0,001 ETH di contract!

#### 2. Mengirim ETH

**Apa itu**: Mengirim ETH dari contract ke alamat menggunakan `.call\{value: amount\}("")`

**Mengapa penting**: Membayar hadiah, refund, penarikan. Selalu periksa keberhasilan!

Buat `LearnSendETH.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnSendETH {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Terima ETH
    function deposit() public payable {}

    // Kirim ETH ke seseorang
    function sendReward(address _to) public {
        require(msg.sender == owner, "Hanya owner");

        // Kirim 0.001 ETH
        (bool success, ) = _to.call{value: 0.001 ether}("");
        require(success, "Transfer gagal");
    }

    // Cek saldo
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Penjelasan:**
- `function deposit() public payable {}` - menerima ETH tanpa kode (hanya menerima)
- `_to.call\{value: 0.001 ether\}("")` - mengirim ETH ke alamat
- `(bool success, ) = ...` - menangkap apakah transfer berhasil
- `require(success, "Transfer gagal")` - revert jika pengiriman gagal
- `.call` adalah cara modern dan aman untuk mengirim ETH
- Cara lama: `.transfer()` dan `.send()` TIDAK direkomendasikan

**Coba:**
1. Deploy
2. Kirim ETH menggunakan `deposit` (dengan field VALUE)
3. Klik `getBalance` → Lihat deposit Anda
4. Gunakan `sendReward` untuk mengirim 0,001 ETH ke alamat!

---

### 4.6 Solidity 106: Scopes, Visibility & Error Handling

Konsep penting untuk menulis smart contract yang aman dan efisien.

#### 1. Variable Scopes (Lingkup Variabel)

**Apa itu**: Tempat di mana variabel dapat diakses dan berapa lama variabel tersebut hidup

**Mengapa penting**: Memahami biaya gas, keamanan data, dan struktur code yang baik

Buat `LearnScopes.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnScopes {
    // 1. STATE VARIABLE: Disimpan di blockchain storage
    uint256 public plantCounter;  // Permanen, tersimpan selamanya
    address public owner;         // Biaya gas untuk write/update

    // 2. GLOBAL VARIABLES: Built-in Solidity
    function getGlobalVariables() public view returns (
        address sender,
        uint256 timestamp,
        uint256 blockNumber,
        address contractAddress
    ) {
        sender = msg.sender;              // Alamat yang memanggil fungsi
        timestamp = block.timestamp;      // Waktu blok saat ini (Unix)
        blockNumber = block.number;       // Nomor blok saat ini
        contractAddress = address(this);  // Alamat contract ini

        return (sender, timestamp, blockNumber, contractAddress);
    }

    // 3. LOCAL VARIABLES: Temporary dalam function
    function calculateAge(uint256 _plantedTime) public view returns (uint256) {
        // Local variable - hanya ada selama fungsi berjalan
        uint256 currentTime = block.timestamp;
        uint256 age = currentTime - _plantedTime;

        // age dan currentTime hilang setelah fungsi selesai
        return age;
    }

    constructor() {
        owner = msg.sender;
        plantCounter = 0;
    }

    function addPlant() public {
        // Local variable
        uint256 newId = plantCounter + 1;

        // Update state variable (biaya gas!)
        plantCounter = newId;
    }
}
```

**Penjelasan Scopes:**

**State Variables (Blockchain Storage):**
- Disimpan permanen di blockchain
- Biaya gas TINGGI untuk write/update
- Dapat diakses dari semua fungsi dalam contract
- Contoh: `plantCounter`, `owner`

**Local Variables (Memory/Stack):**
- Hanya ada selama fungsi berjalan
- Hilang setelah fungsi selesai
- Biaya gas RENDAH
- Contoh: `newId`, `age`, `currentTime`

**Global Variables (Built-in):**
- `msg.sender` - alamat yang memanggil fungsi
- `msg.value` - jumlah ETH yang dikirim (wei)
- `block.timestamp` - waktu blok Unix (detik)
- `block.number` - nomor blok saat ini
- `tx.origin` - alamat EOA asli (HATI-HATI: security risk!)
- `address(this)` - alamat contract ini

**Coba:**
1. Deploy
2. Klik `getGlobalVariables` → Lihat info blockchain!
3. Klik `addPlant` beberapa kali
4. Klik `plantCounter` → Lihat bertambah (state variable tersimpan)

#### 2. Visibility Modifiers (Pengaturan Akses)

**Apa itu**: Menentukan siapa yang dapat mengakses variabel dan fungsi

**Mengapa penting**: Keamanan contract - batasi akses ke data dan fungsi sensitif

Buat `LearnVisibility.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnVisibility {
    // STATE VARIABLES VISIBILITY
    uint256 public publicVar = 100;      // Otomatis ada getter
    uint256 private privateVar = 200;    // Hanya contract ini
    uint256 internal internalVar = 300;  // Contract ini + turunan

    // PUBLIC: Bisa dipanggil dari mana saja
    function publicFunction() public pure returns (string memory) {
        return "Semua bisa panggil ini";
    }

    // EXTERNAL: Hanya dari LUAR contract (tidak bisa dipanggil internal)
    function externalFunction() external pure returns (string memory) {
        return "Hanya bisa dipanggil dari luar";
    }

    // INTERNAL: Hanya dari contract ini dan turunannya
    function internalFunction() internal pure returns (string memory) {
        return "Hanya untuk internal";
    }

    // PRIVATE: HANYA contract ini
    function privateFunction() private pure returns (string memory) {
        return "Hanya contract ini";
    }

    // Fungsi untuk test internal call
    function testInternalCall() public pure returns (string memory) {
        // Bisa panggil internal function
        return internalFunction();
    }

    // Fungsi untuk akses private variable
    function getPrivateVar() public view returns (uint256) {
        return privateVar;  // Bisa akses karena dalam contract yang sama
    }
}
```

**Penjelasan Visibility:**

**Untuk Fungsi:**

```
┌─────────────┬────────────┬──────────────┬────────────────┐
│ Visibility  │ Contract   │ Turunan      │ External Call  │
├─────────────┼────────────┼──────────────┼────────────────┤
│ public      │ ✅ Ya      │ ✅ Ya        │ ✅ Ya          │
│ external    │ ❌ Tidak*  │ ❌ Tidak*    │ ✅ Ya          │
│ internal    │ ✅ Ya      │ ✅ Ya        │ ❌ Tidak       │
│ private     │ ✅ Ya      │ ❌ Tidak     │ ❌ Tidak       │
└─────────────┴────────────┴──────────────┴────────────────┘

* external bisa dipanggil dengan this.functionName()
```

**Untuk State Variables:**
- `public` - otomatis membuat getter function
- `internal` - default jika tidak disebutkan
- `private` - hanya contract ini (tapi tetap visible di blockchain!)

**Kapan Pakai Apa:**
- `public` - API contract, fungsi utama
- `external` - Lebih hemat gas untuk fungsi yang hanya dipanggil dari luar
- `internal` - Helper functions, dipakai turunan
- `private` - Helper yang sangat spesifik

**Coba:**
1. Deploy
2. Klik `publicVar` → Berhasil (ada getter otomatis)
3. Coba akses `privateVar` → Tidak ada fungsi! (gunakan `getPrivateVar`)
4. Klik `publicFunction` → Berhasil
5. Klik `externalFunction` → Berhasil (dari luar)

#### 3. Function Modifiers (State Mutability)

**Apa itu**: Menentukan apakah fungsi membaca atau mengubah blockchain state

**Mengapa penting**: Optimasi gas dan keamanan - fungsi read-only GRATIS!

Buat `LearnFunctionModifiers.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnFunctionModifiers {
    uint256 public counter = 0;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // VIEW: Membaca state, tidak mengubah (GRATIS!)
    function getCounter() public view returns (uint256) {
        return counter;  // Hanya baca
    }

    function getOwner() public view returns (address) {
        return owner;    // Hanya baca
    }

    function calculateDouble(uint256 x) public pure returns (uint256) {
        // Bisa baca state variable + parameter
        return x * 2;
    }

    // PURE: TIDAK baca dan TIDAK ubah state (GRATIS!)
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        // Hanya kalkulasi murni
        return a + b;
    }

    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }

    // PAYABLE: Dapat menerima ETH
    function deposit() public payable {
        // Terima ETH tanpa kode
    }

    function buyItem() public payable returns (bool) {
        require(msg.value >= 0.001 ether, "Minimal 0.001 ETH");
        return true;
    }

    // REGULAR (no modifier): Mengubah state (BAYAR GAS!)
    function incrementCounter() public {
        counter++;  // Ubah state = butuh gas
    }

    function setCounter(uint256 _newValue) public {
        counter = _newValue;  // Ubah state = butuh gas
    }

    // Check balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Penjelasan Function Modifiers:**

**1. `view` (Read-Only):**
- Membaca state variables
- TIDAK mengubah state
- GRATIS untuk dipanggil (no gas dari external call)
- Contoh: getter functions, calculations dengan state

**2. `pure` (Pure Calculation):**
- TIDAK membaca state
- TIDAK mengubah state
- GRATIS untuk dipanggil
- Contoh: math functions, string operations

**3. `payable` (Dapat Terima ETH):**
- Fungsi dapat menerima Ether
- Akses `msg.value`
- Tanpa `payable`, transfer ETH gagal

**4. Regular (No Modifier):**
- Dapat membaca DAN mengubah state
- BAYAR GAS untuk eksekusi
- Default jika tidak ada modifier

**Perbandingan:**

```
┌──────────┬────────┬────────┬────────┬──────────┐
│ Modifier │ Baca   │ Ubah   │ ETH    │ Gas      │
├──────────┼────────┼────────┼────────┼──────────┤
│ view     │ ✅ Ya  │ ❌ No  │ ❌ No  │ 0 (ext)  │
│ pure     │ ❌ No  │ ❌ No  │ ❌ No  │ 0 (ext)  │
│ payable  │ ✅ Ya  │ ✅ Ya  │ ✅ Ya  │ Bayar    │
│ (none)   │ ✅ Ya  │ ✅ Ya  │ ❌ No  │ Bayar    │
└──────────┴────────┴────────┴────────┴──────────┘
```

**Coba:**
1. Deploy
2. Klik `getCounter` → GRATIS (view)
3. Klik `add(5, 3)` → Hasil 8, GRATIS (pure)
4. Klik `incrementCounter` → Bayar gas (mengubah state)
5. Klik `getCounter` → Lihat bertambah
6. Kirim ETH ke `deposit` dengan VALUE → Berhasil (payable)

#### 4. Error Handling (Penanganan Error)

**Apa itu**: Cara menghentikan eksekusi dan revert transaksi jika ada masalah

**Mengapa penting**: Validasi input, keamanan, dan mencegah state invalid

Buat `LearnErrorHandling.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnErrorHandling {
    address public owner;
    uint256 public balance;
    mapping(address => uint256) public userBalance;

    constructor() {
        owner = msg.sender;
        balance = 100;
    }

    // REQUIRE: Validasi input dan kondisi (yang paling umum!)
    function withdraw(uint256 amount) public {
        // Validasi 1: Cek saldo cukup
        require(balance >= amount, "Saldo tidak cukup");

        // Validasi 2: Cek amount tidak 0
        require(amount > 0, "Amount harus lebih dari 0");

        // Jika semua require pass, jalankan
        balance -= amount;
        userBalance[msg.sender] += amount;
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "Harus deposit lebih dari 0");

        balance += amount;
    }

    // Require dengan kondisi kompleks
    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "Hanya owner");
        require(newOwner != address(0), "Address tidak valid");
        require(newOwner != owner, "Sudah jadi owner");

        owner = newOwner;
    }

    // REVERT: Manual error dengan kondisi custom
    function checkEven(uint256 number) public pure returns (bool) {
        if (number % 2 != 0) {
            revert("Angka harus genap!");
        }
        return true;
    }

    function complexCheck(uint256 value) public pure returns (string memory) {
        if (value < 10) {
            revert("Nilai terlalu kecil");
        }
        if (value > 100) {
            revert("Nilai terlalu besar");
        }
        if (value == 50) {
            revert("Nilai 50 tidak diperbolehkan");
        }

        return "Nilai valid!";
    }

    // ASSERT: Internal error checking (jarang dipakai)
    function internalCheck(uint256 newBalance) public {
        balance = newBalance;

        // Assert untuk cek invariant (kondisi yang HARUS selalu benar)
        // Jika assert gagal = ada BUG di code!
        assert(balance >= 0);  // uint256 selalu >= 0, ini contoh saja
    }
}
```

**Penjelasan Error Handling:**

**1. `require()` - Input Validation (90% use case)**

```solidity
require(kondisi, "pesan error");
```

- Cek kondisi SEBELUM eksekusi
- Jika FALSE → revert + kembalikan gas
- Jika TRUE → lanjut eksekusi
- Untuk: validasi input, permissions, business logic

**Contoh Umum:**
```solidity
require(msg.sender == owner, "Not owner");
require(amount > 0, "Amount must be positive");
require(balance >= amount, "Insufficient balance");
require(address != address(0), "Invalid address");
```

**2. `revert()` - Manual Error**

```solidity
revert("pesan error");
```

- Hentikan eksekusi manual
- Sama seperti `require(false, "pesan")`
- Bagus untuk error handling kompleks
- Gunakan dalam `if/else`

**Contoh:**
```solidity
if (kondisiError) {
    revert("Error terjadi");
}
```

**3. `assert()` - Internal Check (Jarang)**

```solidity
assert(kondisi);
```

- Untuk cek invariant (kondisi yang HARUS selalu benar)
- Jika gagal = ada BUG di contract!
- TIDAK mengembalikan gas (berbeda dengan require)
- Untuk: overflow check, invariant validation

**Kapan Pakai Apa:**

```
┌──────────┬─────────────────────────┬─────────────────┐
│ Function │ Use Case                │ Gas Refund      │
├──────────┼─────────────────────────┼─────────────────┤
│ require  │ Input validation        │ ✅ Ya           │
│          │ Access control          │                 │
│          │ Business logic          │                 │
├──────────┼─────────────────────────┼─────────────────┤
│ revert   │ Complex error handling  │ ✅ Ya           │
│          │ Custom errors           │                 │
├──────────┼─────────────────────────┼─────────────────┤
│ assert   │ Internal invariants     │ ❌ Tidak        │
│          │ Check for bugs          │                 │
└──────────┴─────────────────────────┴─────────────────┘
```

**Best Practices:**
- ✅ Gunakan `require()` untuk 99% kasus
- ✅ Pesan error jelas dan deskriptif
- ✅ Cek kondisi paling murah dulu (gas optimization)
- ✅ `revert()` untuk logika bercabang kompleks
- ⚠️ `assert()` hanya untuk debug internal

**Coba:**
1. Deploy dengan balance = 100
2. Coba `withdraw(150)` → GAGAL "Saldo tidak cukup"
3. Coba `withdraw(50)` → BERHASIL
4. Coba `withdraw(0)` → GAGAL "Amount harus lebih dari 0"
5. Coba `checkEven(5)` → GAGAL "Angka harus genap!"
6. Coba `checkEven(4)` → BERHASIL
7. Coba `complexCheck(50)` → GAGAL "Nilai 50 tidak diperbolehkan"

---

#### 3. Game LiskGarden Lengkap

**Apa itu**: Game blockchain lengkap yang menggabungkan SEMUA konsep - tanam benih, siram tanaman, panen untuk profit

**Mengapa penting**: Contoh dunia nyata yang menunjukkan bagaimana semuanya bekerja bersama

---

## 🏆 TANTANGAN AKHIR: Build LiskGarden Game! (16:00 - 16:45)

**🎮 Apa yang Akan Anda Bangun:**

Game blockchain LENGKAP di mana pemain:
- 🌱 Tanam benih dengan bayar 0.001 ETH
- 💧 Siram tanaman untuk jaga tetap hidup
- ⏳ Tunggu tanaman tumbuh (3 tahap)
- 🌸 Panen saat BLOOMING → dapat 0.003 ETH
- 💰 **PROFIT: 0.002 ETH per tanaman!**

---

### 📚 Review: Konsep yang Digunakan

Contract ini menggunakan **SEMUA** yang sudah Anda pelajari hari ini:

```
✅ Solidity 101: Basic Types
   ├─ string, uint256, bool, address ✓
   ├─ State variables ✓
   └─ Constructor ✓

✅ Solidity 102: Struct & Enum
   ├─ enum GrowthStage ✓
   └─ struct Plant ✓

✅ Solidity 103: Mapping & Array
   ├─ mapping(uint256 => Plant) ✓
   ├─ mapping(address => uint256[]) ✓
   └─ Array operations ✓

✅ Solidity 104: Modifiers & Events
   ├─ require() validation ✓
   ├─ modifier (internal) ✓
   └─ Events (5 events!) ✓

✅ Solidity 105: Payable
   ├─ payable functions ✓
   ├─ msg.value ✓
   └─ .call untuk kirim ETH ✓

✅ Solidity 106: Advanced
   ├─ public/external/internal ✓
   ├─ view/pure ✓
   └─ storage vs memory ✓
```

**Ini adalah ujian FINAL untuk skills Anda!** 🔥

---

### 🎯 PILIH LEVEL TANTANGAN ANDA:

Pilih satu level sesuai dengan skill Anda. Klik untuk expand!

---

<details>
<summary><strong>🟢 LEVEL 1: GUIDED (Recommended untuk pemula)</strong></summary>

## 🟢 LEVEL 1: GUIDED CHALLENGE

**Untuk siapa:** Pemula yang baru belajar Solidity hari ini

**Yang didapat:**
- ✅ Template lengkap dengan TODO
- ✅ Hints di setiap bagian
- ✅ Step-by-step instructions
- ✅ Helper functions sudah lengkap

**Estimasi waktu:** 30-45 menit

### 📋 Spesifikasi Contract LiskGarden

**Game Mechanics:**
- Player bayar 0.001 ETH untuk tanam benih
- Tanaman tumbuh melalui 4 stage: SEED → SPROUT → GROWING → BLOOMING
- Setiap stage butuh 1 menit
- Tanaman kehilangan 2% air setiap 30 detik
- Jika air = 0% → Tanaman MATI!
- Player harus siram tanaman untuk jaga hidup
- Panen saat BLOOMING → dapat 0.003 ETH reward
- PROFIT per plant = 0.002 ETH

---

### 🏗️ STRUKTUR CONTRACT (8 Bagian)

```solidity
// BAGIAN 1: Enum & Struct (Data Types)
// BAGIAN 2: State Variables (Storage)
// BAGIAN 3: Constants (Game Parameters)
// BAGIAN 4: Events (Logging)
// BAGIAN 5: Constructor
// BAGIAN 6: Plant Seed Function (Payable)
// BAGIAN 7: Water System (View + Internal)
// BAGIAN 8: Harvest Function (Payable Out)
```

---

### 💻 TEMPLATE CONTRACT

Buat file `LiskGarden.sol` dan isi dengan template ini:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LiskGarden {

    // ============================================
    // BAGIAN 1: ENUM & STRUCT
    // ============================================
    // TODO 1.1: Buat enum GrowthStage dengan 4 nilai:
    // SEED, SPROUT, GROWING, BLOOMING
    // Hint: enum GrowthStage { SEED, SPROUT, GROWING, BLOOMING }


    // TODO 1.2: Buat struct Plant dengan 8 fields:
    // - uint256 id
    // - address owner
    // - GrowthStage stage
    // - uint256 plantedDate
    // - uint256 lastWatered
    // - uint8 waterLevel
    // - bool exists
    // - bool isDead




    // ============================================
    // BAGIAN 2: STATE VARIABLES
    // ============================================
    // TODO 2.1: Mapping plantId ke Plant
    // Hint: mapping(uint256 => Plant) public plants;


    // TODO 2.2: Mapping address ke array plantId (track tanaman user)
    // Hint: mapping(address => uint256[]) public userPlants;


    // TODO 2.3: Counter untuk ID tanaman baru
    // Hint: uint256 public plantCounter;


    // TODO 2.4: Address owner contract
    // Hint: address public owner;


    // ============================================
    // BAGIAN 3: CONSTANTS (Game Parameters)
    // ============================================
    // TODO 3.1: Harga tanam = 0.001 ether
    // Hint: uint256 public constant PLANT_PRICE = 0.001 ether;


    // TODO 3.2: Reward panen = 0.003 ether


    // TODO 3.3: Durasi per stage = 1 menit
    // Hint: uint256 public constant STAGE_DURATION = 1 minutes;


    // TODO 3.4: Waktu deplesi air = 30 detik


    // TODO 3.5: Rate deplesi = 2 (2% setiap interval)
    // Hint: uint8 public constant WATER_DEPLETION_RATE = 2;


    // ============================================
    // BAGIAN 4: EVENTS
    // ============================================
    // TODO 4.1: Event PlantSeeded(address indexed owner, uint256 indexed plantId)


    // TODO 4.2: Event PlantWatered(uint256 indexed plantId, uint8 newWaterLevel)


    // TODO 4.3: Event PlantHarvested(uint256 indexed plantId, address indexed owner, uint256 reward)


    // TODO 4.4: Event StageAdvanced(uint256 indexed plantId, GrowthStage newStage)


    // TODO 4.5: Event PlantDied(uint256 indexed plantId)


    // ============================================
    // BAGIAN 5: CONSTRUCTOR
    // ============================================
    // TODO 5: Set owner = msg.sender
    constructor() {

    }

    // ============================================
    // BAGIAN 6: PLANT SEED (Fungsi Utama #1)
    // ============================================
    // TODO 6: Lengkapi fungsi plantSeed
    // Tipe: external payable, returns uint256
    // Steps:
    // 1. require msg.value >= PLANT_PRICE
    // 2. Increment plantCounter
    // 3. Buat Plant baru dengan struct
    // 4. Simpan ke mapping plants
    // 5. Push plantId ke userPlants
    // 6. Emit PlantSeeded
    // 7. Return plantId

    function plantSeed() external payable returns (uint256) {
        // TODO: Implement fungsi ini
        // Hint: Lihat spesifikasi di atas!




    }

    // ============================================
    // BAGIAN 7: WATER SYSTEM (3 Fungsi)
    // ============================================

    // TODO 7.1: calculateWaterLevel (public view returns uint8)
    // Steps:
    // 1. Ambil plant dari storage
    // 2. Jika !exists atau isDead, return 0
    // 3. Hitung timeSinceWatered = block.timestamp - lastWatered
    // 4. Hitung depletionIntervals = timeSinceWatered / WATER_DEPLETION_TIME
    // 5. Hitung waterLost = depletionIntervals * WATER_DEPLETION_RATE
    // 6. Jika waterLost >= waterLevel, return 0
    // 7. Return waterLevel - waterLost

    function calculateWaterLevel(uint256 plantId) public view returns (uint8) {
        // TODO: Implement




    }

    // TODO 7.2: updateWaterLevel (internal)
    // Steps:
    // 1. Ambil plant dari storage
    // 2. Hitung currentWater dengan calculateWaterLevel
    // 3. Update plant.waterLevel
    // 4. Jika currentWater == 0 && !isDead, set isDead = true dan emit PlantDied

    function updateWaterLevel(uint256 plantId) internal {
        // TODO: Implement



    }

    // TODO 7.3: waterPlant (external)
    // Steps:
    // 1. require exists
    // 2. require owner == msg.sender
    // 3. require !isDead
    // 4. Set waterLevel = 100
    // 5. Set lastWatered = block.timestamp
    // 6. Emit PlantWatered
    // 7. Call updatePlantStage

    function waterPlant(uint256 plantId) external {
        // TODO: Implement





    }

    // ============================================
    // BAGIAN 8: STAGE & HARVEST (2 Fungsi)
    // ============================================

    // TODO 8.1: updatePlantStage (public)
    // Steps:
    // 1. require exists
    // 2. Call updateWaterLevel
    // 3. Jika isDead, return
    // 4. Hitung timeSincePlanted
    // 5. Simpan oldStage
    // 6. Update stage berdasarkan waktu (3 if statements)
    // 7. Jika stage berubah, emit StageAdvanced

    function updatePlantStage(uint256 plantId) public {
        // TODO: Implement






    }

    // TODO 8.2: harvestPlant (external)
    // Steps:
    // 1. require exists
    // 2. require owner
    // 3. require !isDead
    // 4. Call updatePlantStage
    // 5. require stage == BLOOMING
    // 6. Set exists = false
    // 7. Emit PlantHarvested
    // 8. Transfer HARVEST_REWARD dengan .call
    // 9. require success

    function harvestPlant(uint256 plantId) external {
        // TODO: Implement







    }

    // ============================================
    // HELPER FUNCTIONS (Sudah Lengkap)
    // ============================================

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
        (bool success, ) = owner.call\{value: address(this).balance\}("");
        require(success, "Transfer gagal");
    }

    receive() external payable {}
}
```

---

### 📖 PENJELASAN SETIAP BAGIAN

#### BAGIAN 1: Enum & Struct
**Enum** = Named numbers untuk growth stages
**Struct** = Custom type untuk menyimpan data tanaman

#### BAGIAN 2: State Variables
**plants** = Mapping untuk akses tanaman by ID
**userPlants** = Track semua tanaman milik user
**plantCounter** = Auto-increment ID
**owner** = Contract deployer

#### BAGIAN 3: Constants
**constant** = Nilai tetap, hemat gas!
**ether/minutes/seconds** = Solidity time units

#### BAGIAN 4: Events
Events untuk frontend listen perubahan real-time
**indexed** = Bisa di-filter dan di-search

#### BAGIAN 5: Constructor
Run sekali saat deploy, set owner

#### BAGIAN 6: plantSeed()
**external payable** = Bisa dipanggil dari luar + terima ETH
Buat tanaman baru, simpan ke blockchain

#### BAGIAN 7: Water System
**calculateWaterLevel** = view function (read-only, gratis)
**updateWaterLevel** = internal (helper function)
**waterPlant** = external (public API)

#### BAGIAN 8: Stage & Harvest
**updatePlantStage** = Cek waktu dan update stage
**harvestPlant** = Panen dan kirim reward ETH

---

### ✅ CHECKLIST IMPLEMENTASI

#### Bagian 1-2: Data Structures
- [ ] Enum GrowthStage dengan 4 nilai
- [ ] Struct Plant dengan 8 fields
- [ ] 2 mappings (plants, userPlants)
- [ ] 2 state variables (plantCounter, owner)

#### Bagian 3-4: Constants & Events
- [ ] 5 constants dengan nilai benar
- [ ] 5 events dengan indexed parameters

#### Bagian 5-6: Constructor & Plant
- [ ] Constructor set owner
- [ ] plantSeed: require, create, store, emit, return

#### Bagian 7: Water System
- [ ] calculateWaterLevel: 7 steps logic
- [ ] updateWaterLevel: update + emit death
- [ ] waterPlant: 3 requires + update + emit

#### Bagian 8: Harvest
- [ ] updatePlantStage: time-based stage update
- [ ] harvestPlant: validations + ETH transfer

---

### 🧪 TEST CONTRACT ANDA

#### Test 1: Deploy & Initial State
```
1. Compile contract (no errors)
2. Deploy ke Remix VM atau Lisk Sepolia
3. Cek owner == your address
4. Cek plantCounter == 0
```

#### Test 2: Plant Seed
```
1. Set VALUE = 0.001 ETH (1000000000000000 wei)
2. Call plantSeed()
3. Cek return value = 1 (plantId)
4. Cek plantCounter == 1
5. Call getPlant(1) → lihat data plant
```

#### Test 3: Water Plant
```
1. Call waterPlant(1)
2. Cek PlantWatered event emitted
3. Call getPlant(1) → waterLevel = 100
```

#### Test 4: Growth Stages
```
1. Tunggu 1 menit
2. Call updatePlantStage(1)
3. Call getPlant(1) → stage = 1 (SPROUT)
4. Tunggu 2 menit total
5. Call updatePlantStage(1) → stage = 2 (GROWING)
6. Tunggu 3 menit total → stage = 3 (BLOOMING)
```

#### Test 5: Harvest
```
1. Pastikan stage = BLOOMING
2. Cek balance Anda sebelum harvest
3. Call harvestPlant(1)
4. Cek balance Anda → bertambah 0.003 ETH!
5. Call getPlant(1) → exists = false
```

#### Test 6: Death Mechanic
```
1. Plant seed baru (plantId = 2)
2. JANGAN siram
3. Tunggu 50 detik × 25 interval = ~25 menit
4. Call getPlant(2) → waterLevel = 0, isDead = true
5. Try waterPlant(2) → REVERT "Tanaman sudah mati"
```

---

### 💡 TIPS DEBUGGING

**Error Umum:**

```
"Stack too deep" error
→ Terlalu banyak local variables
→ Solusi: Pecah fungsi jadi lebih kecil

"Out of gas" error
→ Loop atau kalkulasi terlalu kompleks
→ Cek logic calculateWaterLevel

"Transfer failed"
→ Contract tidak punya cukup ETH
→ Pastikan plant beberapa seed dulu sebelum harvest

"Tanaman belum siap"
→ Stage masih belum BLOOMING
→ Call updatePlantStage dulu, tunggu 3 menit

Type conversion errors
→ uint8 vs uint256 mismatch
→ Gunakan uint8(value) untuk cast
```

**Debug Strategy:**
1. Compile error → Cek syntax, semicolon, brackets
2. Revert error → Baca error message, cek require
3. Wrong result → Tambah emit events, track values
4. Gas issue → Simplify logic, avoid loops

---

### 🏆 SETELAH SELESAI

**Selamat! Anda telah menguasai:**

✅ Complete smart contract development
✅ Complex data structures (enum, struct, mapping)
✅ State management & storage
✅ Time-based logic (block.timestamp)
✅ Payable functions & ETH transfers
✅ Event emission & indexing
✅ Access control & validation
✅ Internal vs external functions
✅ View vs state-changing functions
✅ Game mechanics implementation

**Ini adalah FULL-STACK smart contract developer skill!** 🚀

</details>

---

<details>
<summary><strong>🟡 LEVEL 2: INTERMEDIATE (Untuk yang sudah familiar)</strong></summary>

## 🟡 LEVEL 2: INTERMEDIATE CHALLENGE

**Untuk siapa:** Developer yang sudah pernah coding Solidity sebelumnya

**Yang didapat:**
- ✅ Spesifikasi lengkap
- ✅ Architecture overview
- ✅ Requirements checklist
- ❌ Tidak ada template atau hints

**Estimasi waktu:** 20-30 menit

---

### 📋 Requirements Checklist:

**Data Structures:**
- [ ] Enum: GrowthStage (4 values: SEED, SPROUT, GROWING, BLOOMING)
- [ ] Struct: Plant (8 fields)
- [ ] Mapping: plantId → Plant
- [ ] Mapping: address → uint256[] (user plants)
- [ ] State: plantCounter, owner

**Game Parameters (Constants):**
- [ ] PLANT_PRICE = 0.001 ether
- [ ] HARVEST_REWARD = 0.003 ether
- [ ] STAGE_DURATION = 1 minutes
- [ ] WATER_DEPLETION_TIME = 30 seconds
- [ ] WATER_DEPLETION_RATE = 2

**Events:**
- [ ] PlantSeeded(address indexed owner, uint256 indexed plantId)
- [ ] PlantWatered(uint256 indexed plantId, uint8 newWaterLevel)
- [ ] PlantHarvested(uint256 indexed plantId, address indexed owner, uint256 reward)
- [ ] StageAdvanced(uint256 indexed plantId, GrowthStage newStage)
- [ ] PlantDied(uint256 indexed plantId)

**Core Functions:**
- [ ] constructor() - set owner
- [ ] plantSeed() external payable returns (uint256) - create plant
- [ ] calculateWaterLevel(uint256) public view returns (uint8) - compute water
- [ ] updateWaterLevel(uint256) internal - update & check death
- [ ] waterPlant(uint256) external - refresh water to 100%
- [ ] updatePlantStage(uint256) public - time-based stage update
- [ ] harvestPlant(uint256) external - validate & send reward
- [ ] getPlant(uint256) external view returns (Plant) - with current water
- [ ] getUserPlants(address) external view returns (uint256[]) - user's plants
- [ ] withdraw() external - owner withdraw balance
- [ ] receive() external payable - accept ETH

---

### 🏗️ Architecture Overview:

```solidity
contract LiskGarden {
    // 1. Data Types
    enum GrowthStage { ... }
    struct Plant { ... }

    // 2. State
    mapping(...) plants;
    mapping(...) userPlants;
    uint256 plantCounter;
    address owner;

    // 3. Constants
    uint256 constant PLANT_PRICE = ...;
    // ... 4 more

    // 4. Events
    event PlantSeeded(...);
    // ... 4 more

    // 5. Constructor
    constructor() { ... }

    // 6. Main Functions (8 functions)
    function plantSeed() external payable { ... }
    function calculateWaterLevel(...) public view { ... }
    function updateWaterLevel(...) internal { ... }
    function waterPlant(...) external { ... }
    function updatePlantStage(...) public { ... }
    function harvestPlant(...) external { ... }

    // 7. Helper Functions (3 functions)
    function getPlant(...) external view { ... }
    function getUserPlants(...) external view { ... }
    function withdraw() external { ... }

    // 8. Receive ETH
    receive() external payable {}
}
```

---

### 🎯 Function Logic:

**plantSeed():**
1. Validate payment >= PLANT_PRICE
2. Increment plantCounter
3. Create Plant struct with initial values
4. Store in plants mapping
5. Add to userPlants array
6. Emit PlantSeeded
7. Return plantId

**calculateWaterLevel():**
1. Get plant from storage
2. Return 0 if !exists or isDead
3. Calculate time since last watered
4. Calculate depletion intervals (time / WATER_DEPLETION_TIME)
5. Calculate water lost (intervals * RATE)
6. Return max(0, waterLevel - waterLost)

**waterPlant():**
1. Validate exists, owner, !isDead
2. Set waterLevel = 100
3. Update lastWatered = block.timestamp
4. Emit PlantWatered
5. Call updatePlantStage

**harvestPlant():**
1. Validate exists, owner, !isDead
2. Call updatePlantStage
3. Require stage == BLOOMING
4. Set exists = false
5. Emit PlantHarvested
6. Transfer HARVEST_REWARD dengan .call
7. Validate transfer success

---

### 💡 Implementation Tips:

- Use `Plant storage plant = plants[plantId]` untuk modify
- Use `Plant memory plant = plants[plantId]` untuk read-only
- Cast uint256 → uint8: `uint8(value)`
- Time units: `1 minutes`, `30 seconds` work in Solidity
- ETH units: `0.001 ether` auto-converts to wei
- .call syntax: `recipient.call{value: amount}("")`

**Kode sendiri tanpa copy-paste!** Gunakan dokumentasi di atas sebagai referensi.

</details>

---

<details>
<summary><strong>🔴 LEVEL 3: EXPERT (Hardcore Challenge!)</strong></summary>

## 🔴 LEVEL 3: EXPERT CHALLENGE

**Untuk siapa:** Expert developer yang ingin test pure skills

**Yang didapat:**
- ✅ High-level requirements only
- ❌ Tidak ada spesifikasi detail
- ❌ Tidak ada template
- ❌ Tidak ada hints
- ❌ Tidak ada architecture

**Estimasi waktu:** 15-20 menit (jika expert) atau 1+ jam (jika stuck)

---

### 🎯 Requirements:

Build a **blockchain farming game** with these specifications:

**Game Concept:**
- Players invest small amount of ETH to plant seeds
- Plants grow over time through multiple stages
- Players must maintain plants (watering mechanic)
- Neglected plants die (lose investment)
- Successfully grown plants can be harvested for profit
- Harvest reward > initial investment (profitable for players)

**Technical Requirements:**
- Use enum for growth stages
- Use struct for plant data
- Track multiple plants per user
- Time-based growth mechanics
- Water depletion over time (death mechanic)
- Payable function for planting
- Payable function for harvesting (send rewards)
- Event emissions for all major actions
- Access control (owner functions)
- View functions for game state

**Economics:**
- Must be profitable for successful players
- Balance risk/reward (death mechanic)
- Consider gas costs in pricing
- Testable on testnet (use small amounts)

**Quality Standards:**
- Gas efficient
- Secure (validate all inputs)
- No obvious exploits
- Clean code structure
- Proper use of visibility modifiers
- Proper use of state mutability (view/pure/payable)

---

### 🏆 Bonus Challenges:

If you finish quickly, add these features:

1. **Multiple plant types** with different growth rates and rewards
2. **Fertilizer system** to speed up growth (pay extra ETH)
3. **Disease mechanic** - random chance of plant getting sick
4. **Leaderboard** - track most profitable farmers
5. **Seasons** - time windows with bonus rewards

---

### 📝 Deliverables:

- [ ] Complete working contract
- [ ] Deployed to Lisk Sepolia testnet
- [ ] At least 1 successful plant → harvest cycle
- [ ] Contract verified on block explorer (optional)
- [ ] README explaining your implementation choices

**No hints. No templates. Pure skills.** 💪

**Show what you're made of!** 🔥

</details>

---

## 📱 CARA BERMAIN LISKGARDEN

### Game Flow:

```
START → PLANT (pay 0.001 ETH) → WATER (keep alive) → WAIT (3 min) → HARVEST (get 0.003 ETH) → PROFIT!
```

### Step-by-Step Guide:

#### 1. 🌱 **Tanam Benih** (Biaya 0.001 ETH)
```
1. Di Remix, set VALUE = 0.001 ETH
   (atau 1000000000000000 Wei)
2. Klik plantSeed()
3. Konfirmasi di MetaMask
4. Lihat plantId di return value (contoh: 1)
5. Save plantId ini!
```

**Economics:**
- Biaya: 0.001 ETH
- Reward: 0.003 ETH
- **PROFIT: 0.002 ETH (200%!)**

#### 2. ⏳ **Tunggu Pertumbuhan** (Otomatis)
```
Timeline:
0 min  → SEED 🌱
1 min  → SPROUT 🌿
2 min  → GROWING 🌳
3 min  → BLOOMING 🌸 (siap panen!)
```

**Cara Cek Stage:**
```
1. Call getPlant(plantId)
2. Lihat field "stage":
   - 0 = SEED
   - 1 = SPROUT
   - 2 = GROWING
   - 3 = BLOOMING ← Target!
```

#### 3. 💧 **Siram Tanaman** (Wajib!)
```
1. Call waterPlant(plantId)
2. Confirm transaksi
3. Water level reset ke 100%
4. Timer deplesi reset
```

**⚠️ PENTING:**
- Tanaman kehilangan 2% air every 30 seconds
- Jika air = 0% → **TANAMAN MATI!**
- Tanaman mati = tidak bisa harvest = **RUGI!**
- Siram setiap ~20 menit untuk aman

**Death Timer:**
```
100% water / 2% per 30sec = 50 intervals
50 × 30 seconds = 1500 seconds = 25 menit

Jadi: Siram minimal setiap 20 menit!
```

#### 4. 🌸 **Panen Saat Siap** (Profit Time!)
```
1. Tunggu sampai stage = BLOOMING (3 menit)
2. Call harvestPlant(plantId)
3. Confirm transaksi
4. Cek wallet Anda → +0.003 ETH! 💰
5. Plant sudah exists = false (harvested)
```

**Profit Calculation:**
```
Investment: 0.001 ETH
Reward:     0.003 ETH
────────────────────────
PROFIT:     0.002 ETH (200% ROI!)

Example:
10 plants = 0.01 ETH invest → 0.03 ETH return = 0.02 ETH profit
```

#### 5. 🎮 **Strategy Tips**

**Beginner Strategy:**
- Plant 1 seed pertama
- Set timer 20 menit untuk siram
- Harvest setelah 3 menit
- Repeat dengan profit!

**Advanced Strategy:**
- Plant multiple seeds
- Stagger planting (1 menit apart)
- Harvest pipeline: ada yang selalu siap
- Scale up dengan profit

**Common Mistakes:**
- ❌ Lupa siram → tanaman mati
- ❌ Harvest sebelum BLOOMING → revert
- ❌ Plant tanpa cukup ETH → revert
- ✅ Set reminder untuk siram!

---

## 🚀 LANGKAH DEPLOYMENT

### Persiapan:

**Yang Dibutuhkan:**
- ✅ Remix IDE terbuka
- ✅ MetaMask terinstall
- ✅ Lisk Sepolia testnet ETH (dari faucet)
- ✅ Contract LiskGarden sudah selesai ditulis

---

### Step 1: Kompilasi Contract

```
1. Buka Remix IDE
2. Pastikan LiskGarden.sol sudah lengkap
3. Klik tab "Solidity Compiler" (icon kompilasi)
4. Pilih Compiler Version: 0.8.30
5. Klik "Compile LiskGarden.sol"
6. Tunggu beberapa detik
7. Lihat ✅ hijau = Sukses!
```

**Jika ada error:**
- Baca error message dengan teliti
- Cek syntax: semicolons, brackets, spelling
- Gunakan tips debugging di atas
- Jangan lanjut sampai compile sukses!

---

### Step 2: Setup Lisk Sepolia Testnet

**Add Network ke MetaMask:**

```
Network Name: Lisk Sepolia
RPC URL: https://rpc.sepolia-api.lisk.com
Chain ID: 4202
Currency Symbol: ETH
Block Explorer: https://sepolia-blockscout.lisk.com
```

**Get Testnet ETH:**
1. Kunjungi: https://sepolia-faucet.lisk.com
2. Connect wallet
3. Request ETH (biasanya 0.05 ETH)
4. Tunggu 1-2 menit
5. Cek MetaMask → ada ETH!

---

### Step 3: Deploy Contract

```
1. Klik tab "Deploy & Run Transactions"
2. Environment: Pilih "Injected Provider - MetaMask"
3. MetaMask popup → Klik "Connect"
4. Pastikan Network = Lisk Sepolia
5. Pastikan Account punya ETH
6. Contract: Pilih "LiskGarden"
7. Klik "Deploy" (tombol orange)
8. MetaMask popup → Klik "Confirm"
9. Tunggu transaksi (10-30 detik)
10. Lihat "Deployed Contracts" muncul! 🎉
```

**Save Info Penting:**
```
Contract Address: 0x... (copy ini!)
Transaction Hash: 0x... (bukti deploy)
Deployer Address: Your wallet address
Timestamp: Waktu deploy
```

---

### Step 4: Verifikasi Deployment

**Test Basic Functions:**

```
1. Expand contract di "Deployed Contracts"
2. Klik "owner" → Harus = your address ✅
3. Klik "plantCounter" → Harus = 0 ✅
4. Klik "PLANT_PRICE" → Harus = 1000000000000000 Wei ✅
```

**Test Plant Seed:**

```
1. Set VALUE = 0.001 ETH
2. Klik "plantSeed"
3. Confirm MetaMask
4. Cek return: plantId = 1
5. Klik "getPlant" dengan input: 1
6. Lihat data plant lengkap! ✅
```

---

### Step 5: Lihat di Block Explorer

```
1. Copy contract address
2. Buka: https://sepolia-blockscout.lisk.com
3. Paste address di search
4. BOOM! Contract Anda live di blockchain! 🚀
```

**Yang Bisa Dilihat:**
- ✅ Balance contract
- ✅ Transaction history
- ✅ Contract creation
- ✅ Internal transactions
- ✅ Events emitted
- ✅ Contract source (jika verified)

---

### Step 6: Share Your Achievement!

**Screenshot ini:**
1. Contract address di explorer
2. First plantSeed transaction
3. First harvest transaction (setelah 3 menit)
4. Your wallet balance +0.003 ETH

**Post Format:**
```
🎉 I just deployed LiskGarden to Lisk Sepolia!

Contract: 0x...
Explorer: [link]

Features:
✅ Plant seeds (0.001 ETH)
✅ Time-based growth (3 minutes)
✅ Water depletion mechanic
✅ Harvest reward (0.003 ETH)
✅ 200% ROI!

Built with 100% Solidity skills learned in Session 1!
#LiskGarden #Web3 #Solidity #EthereumJakarta
```

---

## 📤 DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [ ] Contract compiled successfully (no errors)
- [ ] All functions implemented
- [ ] All TODOs completed
- [ ] MetaMask has testnet ETH
- [ ] Network set to Lisk Sepolia

### Deployment:
- [ ] Contract deployed successfully
- [ ] Contract address copied & saved
- [ ] Transaction hash saved
- [ ] Verified in block explorer

### Post-Deployment Testing:
- [ ] owner check ✅
- [ ] plantCounter = 0 ✅
- [ ] plantSeed works ✅
- [ ] getPlant returns data ✅
- [ ] waterPlant works ✅
- [ ] updatePlantStage works ✅
- [ ] harvestPlant works ✅
- [ ] Received 0.003 ETH reward ✅

### Documentation:
- [ ] Screenshots taken
- [ ] Contract info documented
- [ ] Code pushed to GitHub
- [ ] README written
- [ ] Refleksi ditulis

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
│   ├── 01-LearnString.sol
│   ├── 02-LearnNumber.sol
│   ├── 03-LearnBoolean.sol
│   ├── 04-LearnAddress.sol
│   ├── 05-SimplePlant.sol
│   ├── 06-LearnEnum.sol
│   ├── 07-LearnStruct.sol
│   ├── 08-LearnMapping.sol
│   ├── 09-LearnArray.sol
│   ├── 10-MultiplePlants.sol
│   ├── 11-LearnRequire.sol
│   ├── 12-LearnModifier.sol
│   ├── 13-LearnEvents.sol
│   ├── 14-LearnPayable.sol
│   ├── 15-LearnSendETH.sol
│   ├── 16-LearnScopes.sol
│   ├── 17-LearnVisibility.sol
│   ├── 18-LearnFunctionModifiers.sol
│   ├── 19-LearnErrorHandling.sol
│   └── 20-LiskGarden.sol
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
