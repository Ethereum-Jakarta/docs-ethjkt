---
sidebar_position: 1
title: 🌐 Unit 1 — Apa itu Web3?
description: Fondasi paling dasar Web3 untuk pemula total — evolusi Web1 ke Web3, blockchain, wallet, token, dan kenapa semua ini penting untuk dunia keuangan.
---

# 🌐 Unit 1 — Apa itu Web3?

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Bisa menjelaskan **beda Web1, Web2, dan Web3** pakai bahasa sendiri
- Paham apa itu **blockchain, wallet, token, dan desentralisasi** tanpa istilah teknis berlebihan
- Tahu **kenapa keuangan** jadi use case paling menarik untuk Web3
- Siap masuk ke Unit 2 tentang Injective
:::

:::note Prasyarat
Tidak ada. Ini benar-benar halaman pertama. Kalau kamu sudah paham Web3 dan pernah pakai wallet, lompat ke [Unit 2 — Apa itu Injective?](./apa-itu-injective)
:::

---

## 🤔 Kenapa Kita Perlu Bahas Ini Dulu?

Injective adalah blockchain untuk keuangan. Tapi kalau kamu belum paham **apa itu blockchain dan kenapa orang repot-repot membuatnya**, semua materi setelah ini akan terasa seperti menghafal istilah.

Jadi kita mulai dari pertanyaan paling dasar: **kenapa internet perlu versi baru?**

---

## 📖 Analogi Sederhana: Evolusi Internet

### 🏪 Web1 (1990–2005) — "Papan Pengumuman"

Bayangkan internet awal sebagai **papan pengumuman raksasa**. Ada yang menempel informasi, sisanya membaca.

- Website statis, cuma bisa **dibaca**
- Kamu **konsumen**, bukan partisipan
- Mau punya suara? Harus bisa bikin website sendiri

**Analoginya:** kamu berdiri di depan papan pengumuman kampus. Bisa baca semua, tapi tidak bisa menempel apa pun.

### 🏢 Web2 (2005–sekarang) — "Mall Milik Konglomerat"

Lalu datang Facebook, YouTube, Instagram, Tokopedia. Sekarang **siapa pun bisa membuat konten**. Ini lompatan besar — dan internet jadi jauh lebih hidup.

Tapi ada harga yang jarang disadari:

- Kamu **menumpang** di platform milik orang lain
- Akun kamu bisa **di-suspend** kapan saja, tanpa banding
- Data kamu jadi **produk** yang dijual ke pengiklan
- Aturan bisa **berubah sepihak** — jangkauan turun, komisi naik, fitur dihapus

**Analoginya:** kamu buka toko di mall. Ramai, nyaman, ada eskalator dan AC. Tapi mall-nya bukan milikmu. Kalau manajemen mall menaikkan sewa 3x, atau memutuskan tokomu tidak sesuai citra mereka, kamu tidak punya pilihan selain menerima.

:::warning Ini bukan teori
Kreator yang kehilangan channel karena salah klaim copyright. Seller yang omzetnya jatuh karena perubahan algoritma. Developer yang aplikasinya mati karena API tiba-tiba ditutup. Semuanya kasus nyata dan sering terjadi.
:::

### 🌐 Web3 (2015–sekarang) — "Pasar Rakyat dengan Buku Besar Publik"

Web3 mencoba menjawab: **bagaimana kalau tidak ada pemilik mall?**

- Aturan ditulis dalam **kode yang bisa diperiksa siapa saja**
- **Tidak ada admin** yang bisa membekukan akunmu sepihak
- Aset dan identitas **milikmu**, tersimpan di wallet-mu sendiri
- Semua transaksi tercatat di **buku besar publik** yang bisa diaudit siapa pun

**Analoginya:** pasar rakyat di mana semua transaksi dicatat di buku besar raksasa di tengah pasar. Siapa pun boleh membaca buku itu. Tidak ada yang bisa diam-diam mengubah catatan, karena ribuan orang punya salinannya.

:::tip Web3 bukan pengganti total Web2
Web3 tidak akan menggantikan semua hal. Kamu tidak butuh blockchain untuk grup WhatsApp keluarga. Web3 unggul di satu hal spesifik: **ketika kepercayaan mahal atau tidak ada.** Dan tidak ada bidang di mana kepercayaan lebih mahal daripada **keuangan.**
:::

---

## 🔑 Konsep Inti Web3 (Wajib Paham)

### 1. Blockchain — "Buku Besar Bersama"

Blockchain adalah **catatan transaksi yang disalin ke ribuan komputer sekaligus.**

Setiap transaksi baru dikelompokkan jadi **blok**, lalu blok itu disambung ke blok sebelumnya — jadi rantai (chain). Untuk mengubah satu transaksi lama, kamu harus mengubah semua blok setelahnya, **di ribuan komputer, secara bersamaan**. Praktis mustahil.

:::tip Analogi Sederhana
Bayangkan 1.000 orang di ruangan, semuanya menulis di buku catatan yang sama. Kalau kamu mau memalsukan satu baris, kamu harus meyakinkan lebih dari setengah ruangan untuk ikut memalsukan baris yang sama persis, di detik yang sama. Itulah kenapa blockchain sulit dicurangi.
:::

Konsekuensi penting: **blockchain itu permanen.** Transaksi yang sudah masuk tidak bisa dibatalkan. Tidak ada tombol "undo", tidak ada customer service.

### 2. Wallet — "KTP + Rekening Bank Digital"

Wallet bukan tempat menyimpan koin. Wallet menyimpan **kunci** yang membuktikan koin itu milikmu.

Isi sebuah wallet:

| Komponen | Fungsi | Boleh dibagikan? |
|---|---|---|
| **Address** (misal `inj1abc...`) | Alamat publik, seperti nomor rekening | ✅ Ya, aman |
| **Private key** | Kunci untuk menandatangani transaksi | ❌ **TIDAK PERNAH** |
| **Seed phrase** (12/24 kata) | Cadangan yang bisa memulihkan seluruh wallet | ❌ **TIDAK PERNAH** |

:::danger Seed Phrase = Uangmu
Siapa pun yang punya seed phrase-mu bisa mengambil **semua** asetmu, dari mana pun di dunia, dalam hitungan detik. Tidak ada bank yang bisa membekukan atau membatalkannya.

Aturan yang tidak boleh dilanggar:
- ❌ Jangan pernah ketik seed phrase di website mana pun
- ❌ Jangan simpan sebagai screenshot, catatan HP, atau file di komputer
- ❌ Jangan kirim ke siapa pun — termasuk yang mengaku "admin HackQuest" atau "support Injective"
- ✅ **Tulis di kertas fisik**, simpan di tempat aman

**Panitia CLC11 tidak akan pernah meminta seed phrase-mu.** Siapa pun yang meminta adalah penipu, tanpa pengecualian.
:::

### 3. Token — "Mata Uang & Alat Insentif"

Token adalah unit nilai di atas blockchain. Fungsinya bisa macam-macam:

- **Bayar biaya transaksi** (di Injective: INJ)
- **Hak suara** dalam pengambilan keputusan protokol (governance)
- **Jaminan** untuk mengamankan jaringan (staking)
- **Mewakili aset lain** — dolar, emas, saham, bahkan properti

### 4. Desentralisasi — "Tidak Ada Bos Tunggal"

Ini pembeda utamanya.

| | Sistem Terpusat (Web2) | Sistem Terdesentralisasi (Web3) |
|---|---|---|
| Siapa yang memutuskan | Satu perusahaan | Aturan di kode + voting pemegang token |
| Bisa membekukan akunmu? | Ya, kapan saja | Tidak |
| Kalau servernya mati? | Layanan mati total | Jalan terus dari node lain |
| Bisa diaudit publik? | Tidak | Ya, semua terbuka |
| Butuh izin untuk ikut? | Ya (KYC, approval) | Tidak, siapa pun bisa |

---

## 💹 Nyambung ke Keuangan — Kenapa Ini Penting

Sekarang bagian yang relevan untuk camp ini.

Sistem keuangan tradisional dibangun di atas **perantara yang harus dipercaya**: bank, bursa, kliring, kustodian. Setiap perantara menambah biaya, waktu tunggu, dan satu titik yang bisa gagal.

Coba pikirkan pengalaman nyata:

- Transfer antar negara butuh **2–5 hari kerja** dan biaya beberapa persen
- Bursa saham **tutup** di akhir pekan dan hari libur
- Untuk mengakses banyak produk investasi, kamu butuh **izin, minimum modal, dan domisili tertentu**
- Kalau bursa membekukan perdagangan sebuah saham, kamu **tidak bisa apa-apa**

Web3 menawarkan versi lain: pasar yang **buka 24/7**, **settlement dalam hitungan detik**, **tanpa izin**, dan **aturannya bisa dibaca siapa saja**.

:::info Di sinilah Injective masuk
Kebanyakan blockchain dibangun untuk tujuan umum — bisa dipakai apa saja, tapi tidak dioptimalkan untuk apa pun secara spesifik. Injective mengambil pendekatan berbeda: **dibangun khusus untuk keuangan**, dengan fitur pasar keuangan tertanam langsung di level chain.

Apa artinya secara teknis, dan kenapa itu penting — kita bahas di [Unit 2](./apa-itu-injective).
:::

---

## 🆚 Perbandingan Cepat: Web2 vs Web3 Finance

| Aspek | Bank / Bursa (Web2) | DeFi (Web3) |
|---|---|---|
| Jam operasional | Jam kerja, hari kerja | 24/7/365 |
| Waktu settlement | T+1 sampai T+3 hari | Detik |
| Butuh izin? | Ya — KYC, approval, domisili | Tidak |
| Biaya perantara | Berlapis | Biaya jaringan saja |
| Transparansi | Laporan berkala | Real-time, publik |
| Kalau ada sengketa | Ada jalur hukum & asuransi | ⚠️ Sebagian besar tidak ada |
| Kalau kamu salah kirim | Bisa diusahakan dibatalkan | ⚠️ Hilang permanen |

:::warning Dua kolom terakhir itu serius
Web3 memberi kamu kendali penuh — termasuk **tanggung jawab penuh**. Tidak ada yang menyelamatkanmu kalau salah kirim atau tertipu. Selama camp ini kita **hanya pakai testnet** (uang mainan), jadi ini tempat yang aman untuk membuat kesalahan. Lakukan semua kesalahanmu di sini, bukan nanti dengan uang sungguhan.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Web1** = baca saja · **Web2** = baca-tulis tapi menumpang · **Web3** = baca-tulis-**miliki**
- **Blockchain** = buku besar bersama yang disalin ribuan komputer; permanen dan sulit dicurangi
- **Wallet** menyimpan kunci, bukan koin. **Seed phrase = uangmu**, jangan pernah dibagikan
- **Desentralisasi** artinya tidak ada pihak tunggal yang bisa membekukan atau mengubah aturan sepihak
- Keuangan adalah use case terkuat Web3 karena di sanalah **kepercayaan paling mahal**
- Kendali penuh = **tanggung jawab penuh**. Karena itu kita latihan di testnet dulu
:::

### ✅ Quick Check

Coba jawab tanpa membuka lagi ke atas:

1. Apa satu perbedaan paling penting antara "punya akun di Instagram" dan "punya wallet Web3"?
2. Kenapa transaksi blockchain tidak bisa dibatalkan?
3. Kalau seseorang di Telegram mengaku admin CLC11 dan meminta 12 kata seed phrase-mu untuk "verifikasi kelulusan" — apa yang kamu lakukan?
4. Sebutkan dua hal yang bisa dilakukan DeFi tapi sulit dilakukan bursa tradisional.

:::note Jawaban #3
Kamu **abaikan dan laporkan**. Tidak ada situasi apa pun — tidak ada verifikasi, hadiah, airdrop, atau troubleshooting — yang membutuhkan seed phrase-mu.
:::

---

**Lanjut:** [Unit 2 — Apa itu Injective?](./apa-itu-injective) 👉
