---
sidebar_position: 3
title: 🎤 Unit 3 — Showcase & Demo Tips
description: Cara membawakan demo tiga menit di Townhall 4 — struktur, persiapan teknis, menangani hal yang tidak berjalan, dan menjawab pertanyaan.
---

# 🎤 Unit 3 — Showcase & Demo Tips

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Punya **struktur demo** yang jelas untuk 3 menit
- Tahu **persiapan teknis** yang wajib dilakukan sebelum tampil
- Tahu **cara menangani** ketika ada yang tidak berjalan
- Siap menjawab **pertanyaan** dengan percaya diri
:::

:::note Prasyarat
- ✅ Guided project berjalan
- 📅 Townhall 4 — Senin, 10 Agustus 2026, 19:00 WIB
:::

---

## ⏱️ Kamu Punya Sekitar 3 Menit

Itu lebih pendek dari yang kamu kira. Dalam 3 menit kamu tidak bisa menjelaskan semuanya — jadi pilih dengan sengaja apa yang ditampilkan.

### Struktur yang berhasil

| Waktu | Bagian | Isi |
|---|---|---|
| **0:00–0:20** | Kail | Masalah apa yang kamu selesaikan, dalam satu kalimat |
| **0:20–2:00** | Demo | Tunjukkan aplikasinya berjalan. **Ini bagian terpenting** |
| **2:00–2:30** | Teknis | Apa yang kamu pakai dan satu keputusan menarik |
| **2:30–3:00** | Penutup | Satu tantangan, satu keterbatasan, satu rencana lanjutan |

:::danger Kesalahan nomor satu: terlalu lama di pembukaan
Peserta sering menghabiskan 90 detik menjelaskan latar belakang, lalu kehabisan waktu sebelum sempat menunjukkan aplikasinya.

**Tunjukkan produknya dalam 30 detik pertama.** Konteks bisa dijelaskan sambil demo berjalan. Orang ingin melihat sesuatu bekerja, bukan mendengar deskripsi.
:::

---

## 🎬 Struktur Kalimat Pembuka

Rumus yang bisa langsung dipakai:

> "Halo, saya [nama]. Saya membangun **[nama proyek]**, yaitu [apa itu] untuk [siapa]. Masalahnya: [masalah dalam satu kalimat]. Saya tunjukkan langsung."

Contoh:

> "Halo, saya Sari. Saya membangun **Celengan Target**, aplikasi tabungan bersama di Injective. Masalahnya: kalau patungan lewat transfer bank, tidak ada yang tahu progresnya dan uangnya dipegang satu orang. Di sini semuanya on-chain dan transparan. Saya tunjukkan langsung."

Dua puluh detik, dan penonton sudah tahu persis apa yang akan mereka lihat.

---

## 🖥️ Persiapan Teknis — Wajib

:::warning Lakukan semua ini **sebelum** sesi dimulai, bukan saat giliranmu
Waktu setup memakan jatah demo-mu. Peserta yang menghabiskan satu menit mencari tab yang benar kehilangan sepertiga waktunya.
:::

### Checklist sebelum tampil

- [ ] Aplikasi sudah **terbuka di tab browser**, bukan perlu dibuka saat demo
- [ ] Wallet sudah **terhubung** dan ada **saldo testnet INJ**
- [ ] Jaringan sudah di **Injective EVM Testnet**
- [ ] Tab **Blockscout** sudah terbuka di halaman contract-mu
- [ ] Zoom browser diperbesar ke **125–150%**
- [ ] **Tutup semua tab dan notifikasi** yang tidak perlu
- [ ] Sudah **latihan sekali** sambil melihat jam
- [ ] Punya **screenshot atau video cadangan** kalau live gagal

:::tip Cadangan itu bukan tanda pesimis
Testnet publik bisa lambat, terutama saat 70 orang sedang online bersamaan di malam yang sama.

Punya video demo yang sudah direkam sebagai cadangan berarti kamu tetap bisa menampilkan karyamu meskipun jaringan bermasalah. Ini persiapan, bukan keraguan.
:::

---

## 🔴 Saat Demo Berlangsung

### Jelaskan sambil melakukan

Jangan diam menunggu transaksi. Isi jeda dengan konteks:

> "Sekarang saya setor 0,5 INJ ke target ini. Sambil menunggu konfirmasi — perhatikan bahwa aplikasi membedakan status 'konfirmasi di wallet' dan 'menunggu jaringan', supaya pengguna tahu bola ada di tangan siapa..."

Blok Injective cepat, tapi tetap ada jeda. Jeda yang terisi terasa profesional; jeda yang sunyi terasa canggung.

### Tunjukkan di explorer

Ini momen yang paling meyakinkan dalam demo apa pun:

> "Dan ini transaksinya di Blockscout. Ini bukan mock — benar-benar ada di Injective testnet."

Banyak demo pemula terlihat seperti prototipe frontend. Membuka explorer membuktikan chain-nya benar-benar terlibat.

### Kalau ada yang gagal

Ini terjadi pada semua orang, termasuk presenter berpengalaman. Yang membedakan adalah reaksimu.

| Jangan | Lakukan |
|---|---|
| Panik atau minta maaf berulang kali | Tetap tenang, akui singkat |
| Mencoba lagi berkali-kali sambil diam | Beralih ke cadangan |
| Menyalahkan jaringan panjang lebar | Sebutkan sekali, lanjut jalan |

Contoh kalimat penyelamat:

> "Sepertinya testnet-nya sedang lambat. Saya lanjut pakai rekaman yang sudah saya siapkan — alurnya sama persis."

Sepuluh detik, dan kamu kembali menguasai panggung. Penonton teknis sangat memaklumi hal ini; yang mereka nilai adalah cara kamu menanganinya.

---

## 💬 Menjawab Pertanyaan

### Pertanyaan yang sering muncul

**"Kenapa Injective, bukan chain lain?"**
Jawab dengan alasan teknis, bukan alasan camp. Misalnya: on-chain orderbook, finality cepat, atau MultiVM yang memungkinkan Solidity dan Rust berdampingan.

**"Apa bagian yang paling sulit?"**
Jawab dengan spesifik. "Awalnya saya membalik urutan checks-effects-interactions dan baru sadar setelah membaca soal reentrancy" jauh lebih berkesan daripada "semuanya cukup menantang".

**"Apa yang akan kamu tambahkan?"**
Punya jawaban siap. Ini menunjukkan kamu memikirkan proyek ini melampaui deadline camp.

**"Apakah aman?"**
Jawab jujur. "Saya menerapkan checks-effects-interactions dan kontrol akses, dan menulis test untuk kasus penolakan. Tapi belum diaudit, dan saya tidak akan menaruh dana sungguhan di sana tanpa review."

:::tip "Saya tidak tahu" adalah jawaban yang baik
Kalau ditanya sesuatu yang tidak kamu ketahui, katakan: **"Saya belum menggali bagian itu — tapi menarik, saya akan cek."**

Mengarang jawaban selalu terlihat, dan merusak kredibilitas semua jawabanmu yang lain. Mengakui batas pengetahuanmu justru menunjukkan kematangan.
:::

---

## 🌟 Yang Membuat Demo Berkesan

Berdasarkan camp-camp sebelumnya, ini yang diingat orang:

| Yang berkesan | Kenapa |
|---|---|
| **Produk ditunjukkan cepat** | Menghormati waktu penonton |
| **Menyebut satu kegagalan nyata** | Terasa jujur dan menunjukkan pembelajaran |
| **Menyebut keterbatasan sendiri** | Menunjukkan kamu paham karyamu |
| **Transaksi ditunjukkan di explorer** | Membuktikan ini nyata |
| **Sudut lokal yang jelas** | Membedakanmu dari demo generik |
| **Selesai tepat waktu** | Menunjukkan persiapan |

Dan yang **tidak** berkesan: slide arsitektur yang panjang, daftar fitur yang tidak ditunjukkan, dan janji roadmap yang muluk.

:::tip Kamu tidak sedang berkompetisi menjadi yang paling canggih
Kamu sedang menunjukkan bahwa kamu **bisa membangun sesuatu yang bekerja dan memahami apa yang kamu bangun.**

Peserta dengan proyek sederhana yang dipresentasikan dengan jernih hampir selalu lebih berkesan daripada peserta dengan proyek rumit yang tidak sempat ditunjukkan.
:::

---

## ✅ Checklist Hari-H

**Sebelum sesi:**
- [ ] Latihan sekali sambil melihat jam
- [ ] Semua tab disiapkan, wallet terhubung, saldo cukup
- [ ] Video cadangan siap
- [ ] Koneksi internet dicek
- [ ] Kalimat pembuka sudah dihafal

**Saat presentasi:**
- [ ] Tunjukkan produk dalam 30 detik pertama
- [ ] Jelaskan sambil transaksi berjalan
- [ ] Tunjukkan explorer
- [ ] Sebutkan satu tantangan dan satu keterbatasan
- [ ] Selesai tepat waktu

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Tunjukkan produk dalam 30 detik pertama** — jangan habiskan waktu di pembukaan
- Semua persiapan teknis dilakukan **sebelum** giliranmu
- **Isi jeda** dengan penjelasan saat transaksi diproses
- **Tunjukkan explorer** — itu membuktikan aplikasimu nyata
- Punya **video cadangan**; kalau gagal, akui singkat lalu beralih
- **"Saya tidak tahu"** lebih baik daripada mengarang
- Menyebut **kegagalan dan keterbatasan** membuatmu lebih kredibel, bukan kurang
- **Sederhana dan jelas** mengalahkan rumit dan berantakan
:::

---

🎉 Sampai jumpa di Townhall 4!

**Lanjut:** [Phase 5 — Resources](../Phase-5-Resources/resources) 👉
