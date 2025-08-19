---
id: 0g-storage
title: 0G Storage
sidebar_position: 5
---

# 0G Storage: Dibangun untuk Data Massive

Opsi storage saat ini memaksa tradeoffs yang mustahil:
- **Cloud providers**: Cepat tapi mahal dengan vendor lock-in
- **Opsi terdesentralisasi**: Entah lambat (IPFS), terbatas (Filecoin), atau sangat mahal (Arweave)

## Apa itu 0G Storage?

0G Storage mendobrak tradeoffs ini - jaringan storage terdesentralisasi yang secepat AWS S3 tapi dibangun untuk Web3. Dirancang khusus untuk beban kerja AI dan dataset massive.

<details>
<summary><b>Baru mengenal decentralized storage?</b></summary>

Traditional storage (seperti AWS):
- Satu perusahaan mengontrol data Anda
- Mereka bisa menghapus, menyensor, atau mengubah harga
- Single point of failure

Decentralized storage (seperti 0G):
- Data tersebar di ribuan node
- Tidak ada entitas tunggal yang bisa menghapus atau menyensor
- Selalu tersedia, bahkan jika node offline
</details>

## Mengapa Memilih 0G Storage?

### 🚀 Paket Lengkap

| Yang Anda Dapatkan | Mengapa Penting |
|--------------|----------------|
| **95% lebih murah dari AWS** | Sustainable untuk dataset besar |
| **Retrieval instan** | Tidak menunggu untuk data kritis |
| **Data terstruktur + tidak terstruktur** | Satu solusi untuk semua kebutuhan storage |
| **Kompatibilitas universal** | Bekerja dengan blockchain atau Web2 app apapun |
| **Scale terbukti** | Sudah menangani workload skala TB |

## Cara Kerjanya

0G Storage adalah sistem penyimpanan data terdistribusi yang dirancang dengan elemen on-chain untuk memberikan insentif kepada storage node untuk menyimpan data atas nama pengguna. Siapa pun dapat menjalankan storage node dan menerima reward untuk memeliharanya.

### Arsitektur Teknis

0G Storage menggunakan sistem dua jalur:

<details>
<summary><b>📤 Data Publishing Lane</b></summary>

- Menangani metadata dan availability proofs
- Diverifikasi melalui jaringan 0G Consensus
- Memungkinkan discovery data yang cepat
</details>

<details>
<summary><b>💾 Data Storage Lane</b></summary>

- Mengelola penyimpanan data aktual
- Menggunakan erasure coding: memecah data menjadi chunks dengan redundancy
- Bahkan jika 30% node gagal, data Anda tetap dapat diakses
- Automatic replication mempertahankan availability
</details>

<img src="/img/0G Storage Architecture.png" alt="Arsitektur Storage" />

## Layer Storage untuk Kebutuhan Berbeda

### 📁 Log Layer (Immutable Storage)
**Perfect untuk**: Data training AI, archives, backups
- Append-only (tulis sekali, baca berkali-kali)
- Dioptimalkan untuk file besar
- Biaya lebih rendah untuk storage permanen

**Use cases**:
- Dataset ML
- Arsip video/gambar  
- Riwayat blockchain
- Penyimpanan file besar umum

### 🔑 Key-Value Layer (Mutable Storage)
**Perfect untuk**: Database, konten dinamis, state storage
- Update data yang sudah ada
- Retrieval cepat berbasis key
- Aplikasi real-time

**Use cases**:
- Database on-chain
- Profil pengguna
- Game state
- Dokumen kolaboratif

## Cara Storage Provider Mendapat Earnings

0G Storage dipelihara oleh jaringan miner yang diberi insentif untuk menyimpan dan mengelola data melalui mekanisme consensus unik yang dikenal sebagai **Proof of Random Access (PoRA)**.

### Cara Kerjanya

1. **Random Challenges**: Sistem secara acak meminta miner untuk membuktikan mereka memiliki data tertentu
2. **Cryptographic Proof**: Miner harus menghasilkan hash yang valid (seperti Bitcoin mining)
3. **Quick Response**: Harus merespons cepat untuk membuktikan data mudah diakses
4. **Fair Rewards**: Proof yang berhasil mendapat storage fees

<details>
<summary><b>Apa itu PoRA dalam istilah sederhana?</b></summary>

Bayangkan guru secara acak memeriksa apakah murid mengerjakan PR:
1. Guru memilih murid acak (miner)
2. Meminta halaman tertentu (data chunk)
3. Murid harus menunjukkannya dengan cepat
4. Jika benar, murid mendapat reward

Ini memastikan miner benar-benar menyimpan data yang mereka klaim simpan.
</details>

<img src="/img/pora.png" alt="PoRA" />

### Kompetisi Fair = Reward Fair

Untuk mempromosikan fairness, mining range dibatasi 8 TB data per operasi mining.

**Mengapa limit 8TB?**
- Miner kecil bisa bersaing dengan operasi besar
- Mencegah sentralisasi
- Barrier to entry yang lebih rendah

**Untuk operator besar**: Jalankan multiple instance 8TB.

**Untuk individual**: Fokus pada single 8TB range, masih profitable

<img src="/img/data-chanks.png" alt="Mining Ranges" />

## Perbandingan 0G dengan Solusi Lain

| Solusi | Terbaik Untuk | Limitasi |
|----------|----------|------------|
| **0G Storage** | App AI/Web3 yang butuh speed + scale | Ekosistem baru |
| **AWS S3** | App tradisional | Terpusat, mahal |
| **Filecoin** | Cold storage archival | Retrieval lambat, hanya unstructured |
| **Arweave** | Permanent storage | Sangat mahal |
| **IPFS** | File kecil, hobby projects | Sangat lambat, tidak ada jaminan |

### Posisi Unik 0G
- **Satu-satunya solusi** yang mendukung data terstruktur dan tidak terstruktur
- **Akses instan** tidak seperti opsi terdesentralisasi lain
- **Dibangun untuk AI** dari ground up

## Analogi Sederhana untuk Pemula

### Seperti Sistem Perpustakaan Modern

**Perpustakaan Tradisional (AWS S3):**
- Satu building, satu manajemen
- Jika building tutup, semua buku tidak bisa diakses
- Aturan dan biaya ditentukan sepihak

**Perpustakaan 0G Storage:**
- Ribuan cabang perpustakaan di seluruh dunia
- Setiap buku ada di multiple lokasi
- Jika satu cabang tutup, masih bisa akses di cabang lain
- Biaya ditentukan kompetisi antar cabang
- Sistem otomatis memastikan buku selalu tersedia

## Use Cases untuk Indonesia

### 1. **Startup Teknologi**
- Backup data user dengan biaya rendah
- Storage untuk konten multimedia (foto, video)
- Archive data historical untuk analytics

### 2. **Institusi Pendidikan**
- Penyimpanan dataset research
- Archive materi pembelajaran
- Backup thesis dan paper akademik

### 3. **Media & Creative Industry**
- Penyimpanan raw footage video
- Archive foto high-resolution
- Backup project files creative

### 4. **E-commerce & Fintech**
- Archive transaksi dan logs
- Backup database customer
- Storage untuk compliance audit

## Frequently Asked Questions

<details>
<summary><b>Apakah data saya benar-benar aman jika node offline?</b></summary>

Ya! Sistem erasure coding memastikan data Anda bertahan dari kegagalan node. Jaringan secara otomatis mempertahankan level redundancy, sehingga data Anda tetap dapat diakses bahkan selama outage yang signifikan.
</details>

<details>
<summary><b>Seberapa cepat saya bisa retrieve file besar?</b></summary>

- Parallel retrieval dari multiple nodes
- Bandwidth hanya dibatasi oleh koneksi Anda
- 200 MBPS retrieval speed bahkan saat network congestion
- Performa seperti CDN melalui distribusi geografis
</details>

<details>
<summary><b>Apa yang terjadi dengan pricing saat jaringan berkembang?</b></summary>

Network fee adalah tetap. Semua pricing transparan dan on-chain, mencegah hidden fees atau perubahan mendadak.
</details>

<details>
<summary><b>Bisakah saya migrasi dari storage yang ada?</b></summary>

Ya, mudah:
1. Pertahankan infrastruktur yang ada
2. Gunakan 0G sebagai overflow atau backup
3. Migrasi bertahap berdasarkan access patterns
</details>

<details>
<summary><b>Bagaimana dengan compliance dan regulasi Indonesia?</b></summary>

0G Storage bisa dikonfigurasi untuk:
- Data residency requirements
- GDPR compliance untuk user EU
- Audit trails untuk regulatory purposes
- Encryption sesuai standar keamanan lokal
</details>

## Perbandingan Biaya Real

### Contoh: Startup E-commerce dengan 10TB data

**AWS S3 Standard:**
- Storage: $230/bulan
- Transfer out: $900/bulan (100TB)
- Requests: $50/bulan
- **Total**: $1,180/bulan

**0G Storage:**
- Storage: $50/bulan (95% lebih murah)
- Transfer: $100/bulan
- Requests: Included
- **Total**: $150/bulan

**Penghematan**: $1,030/bulan = $12,360/tahun

## Tutorial Praktis

### Step 1: Install SDK
```bash
npm install @0glabs/0g-storage-client
```

### Step 2: Upload File
```javascript
import { StorageClient } from '@0glabs/0g-storage-client';

const client = new StorageClient('your-api-key');

// Upload file
const result = await client.upload({
  file: './dataset.csv',
  metadata: {
    name: 'Training Dataset',
    description: 'ML training data'
  }
});

console.log('File uploaded:', result.hash);
```

### Step 3: Retrieve File
```javascript
// Download file
const data = await client.download(result.hash);
console.log('File retrieved successfully');
```

### Step 4: Update Mutable Data
```javascript
// Key-value storage
await client.setKey('user_profile_123', {
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {...}
});

const profile = await client.getKey('user_profile_123');
```

## Mulai Menggunakan

### 🧑‍💻 Untuk Developer
Integrasikan 0G Storage dalam hitungan menit
→ **[Dokumentasi SDK](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)**

### ⛏️ Untuk Storage Provider  
Dapatkan earnings dengan menyediakan kapasitas storage
→ **[Jalankan Storage Node](https://docs.0g.ai/run-a-node/storage-node)**

### 📚 Resources Komunitas Indonesia
- [Workshop ETHJKT](https://ethjkt.com) - Monthly hands-on sessions
- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk) - Indonesian developer community
- [Telegram](https://t.me/ethjkt_dev) - Daily discussion dan Q&A

:::tip Pro Tip
Mulai dengan small dataset untuk testing, lalu scale up setelah familiar dengan workflow. 0G Storage perfect untuk gradual migration!
:::

## Langkah Selanjutnya

Siap untuk explore lebih jauh?
- [0G Data Availability](./6-0g-da.md) - Pelajari tentang DA layer
- [Getting Started Tutorial](./9-getting-started.md) - Build aplikasi pertama dengan 0G
- [Testnet Setup](./10-testnet-overview.md) - Setup development environment

---

*0G Storage: Dibangun khusus untuk kebutuhan data massive AI dan Web3.*