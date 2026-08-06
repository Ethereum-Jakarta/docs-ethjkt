---
sidebar_position: 4
title: 🎬 Unit 4 — Deploy & Demo
description: Deploy frontend Vite ke Vercel, menulis README yang baik, dan merekam video demo 2-3 menit untuk showcase Townhall 4.
---

# 🎬 Unit 4 — Deploy & Demo

:::info Goal Unit Ini
Di akhir unit ini kamu akan punya:
- Frontend **online dan bisa diakses siapa saja**
- **README** yang membuat orang lain bisa memahami dan menjalankan proyekmu
- **Video demo 2–3 menit** yang siap ditampilkan
- Semua bukti terkumpul untuk **submission kelulusan**
:::

:::note Prasyarat
- ✅ [Unit 3](./frontend-integration) — aplikasi berjalan di localhost
:::

---

## ☁️ Deploy Frontend ke Vercel

Vercel gratis untuk proyek pribadi, dan mendukung Vite tanpa konfigurasi tambahan.

### Step 1 — Push ke GitHub

```bash
git init
git add .
git commit -m "Celengan Target - guided project CLC11"
```

:::danger Sebelum push — periksa dulu
```bash
cat .gitignore
git status
```

Pastikan **tidak ada** file `.env`, private key, atau seed phrase dalam daftar yang akan di-commit. Ingat ada **dua** `.env` di proyek ini:

- `celengan-contract/.env` — berisi `PRIVATE_KEY` ⚠️
- `celengan-ui/.env` — berisi `VITE_WALLETCONNECT_PROJECT_ID`

Keduanya harus terabaikan git.

:::caution Awas soal prefix `VITE_`
Semua variabel berawalan `VITE_` **ikut ter-bundle ke JavaScript yang dikirim ke browser** dan bisa dibaca siapa pun lewat DevTools.

Itu wajar untuk `VITE_WALLETCONNECT_PROJECT_ID` (memang publik). Tapi jangan pernah menaruh private key, API key berbayar, atau rahasia apa pun di variabel berawalan `VITE_` — menamainya "env variable" tidak membuatnya rahasia.
:::

Kalau `.env` sudah terlanjur ter-commit, **jangan cuma menghapusnya di commit berikutnya** — riwayat git tetap menyimpannya. Anggap key itu bocor, buat wallet baru, dan pertimbangkan membuat repo baru dari awal.
:::

Buat repo di GitHub, lalu:

```bash
git remote add origin https://github.com/USERNAME/celengan-target.git
git branch -M main
git push -u origin main
```

### Step 2 — Hubungkan ke Vercel

1. Buka [vercel.com](https://vercel.com), masuk dengan GitHub
2. **Add New → Project**, pilih repomu
3. Atur pengaturan build:

   | Pengaturan | Nilai |
   |---|---|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `celengan-ui` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Kalau kamu memakai WalletConnect, tambahkan Environment Variable `VITE_WALLETCONNECT_PROJECT_ID`
5. Klik **Deploy**

:::warning Root Directory itu yang paling sering salah
Repo ini berisi **dua** project (`celengan-contract` dan `celengan-ui`). Kalau Root Directory dibiarkan kosong, Vercel mencoba build dari akar repo, tidak menemukan `index.html`, dan gagal dengan pesan yang membingungkan.

Arahkan ke `celengan-ui`.
:::

Setelah beberapa menit kamu akan mendapat URL publik.

:::tip Uji URL publiknya di HP
Buka aplikasimu di ponsel, atau minta teman membukanya.

Hal yang sering baru ketahuan di sini: layout rusak di layar kecil, atau aplikasi mengasumsikan ekstensi wallet ada padahal browser mobile tidak punya. Kamu tidak harus memperbaikinya semua — tapi lebih baik tahu sebelum demo daripada saat demo.
:::

---

## 📄 Menulis README

README adalah hal pertama yang dilihat reviewer. Ini template yang bisa langsung kamu pakai:

````markdown
# Celengan Target

Aplikasi target tabungan bersama di Injective. Siapa pun bisa membuat target,
dan siapa pun bisa ikut menyetor. Dana hanya bisa dicairkan pembuat setelah
target tercapai; sebelum itu, kontributor bisa menarik kembali setorannya.

Dibuat untuk HackQuest Indonesia Co-Learning Camp #11 — Injective Edition.

## Demo

- **Aplikasi:** https://celengan-target.vercel.app
- **Video:** https://youtu.be/xxxxx
- **Contract:** `0x...` — [lihat di Blockscout](https://testnet.blockscout.injective.network/address/0x...)

## Jaringan

Injective EVM Testnet (chain ID 1439). Butuh testnet INJ dari
[faucet](https://testnet.faucet.injective.network/).

RPC: `https://testnet.sentry.chain.json-rpc.injective.network/`

## Fitur

- Buat target tabungan dengan nama dan jumlah target
- Setor INJ ke target mana pun
- Progress bar realtime dari state on-chain
- Pembuat mencairkan dana setelah target tercapai
- Kontributor menarik kembali sebelum target tercapai
- Daftar target bisa dibaca tanpa menghubungkan wallet

## Teknologi

- Solidity 0.8.20, Hardhat 3
- React + Vite + TypeScript
- wagmi + viem + RainbowKit
- TailwindCSS v4

## Menjalankan secara lokal

```bash
git clone https://github.com/USERNAME/celengan-target.git
cd celengan-target/celengan-ui
npm install
npm run dev
```

Ubah `CELENGAN_CONTRACT` di `src/lib/config/constants/index.ts` kalau kamu
men-deploy contract sendiri.

## Keterbatasan yang diketahui

- Tidak ada tenggat waktu target — dana bisa mengendap tanpa batas jika target tak tercapai
- Daftar target dibaca 2 panggilan per target; tidak skalabel untuk ratusan target
- Konfirmasi transaksi harus di-polling manual karena RPC testnet Injective
  tidak konsisten mengembalikan receipt
- Belum ada penanganan token selain INJ

## Lisensi

MIT
````

:::note Kenapa contoh di atas dibungkus **empat** backtick?
Karena isinya sendiri mengandung blok kode ```` ```bash ````. Kalau pembungkusnya cuma tiga backtick, fence bagian dalam akan menutup fence luar lebih awal — sisa template bocor sebagai teks biasa, dan backtick penutup di akhir malah membuka blok kode baru yang tidak pernah ditutup.

Aturannya: **pembungkus luar harus punya backtick lebih banyak daripada fence terpanjang di dalamnya.**
:::

:::tip Bagian "Keterbatasan yang diketahui" itu penting
Pemula sering menyembunyikan kelemahan proyeknya. Engineer berpengalaman menuliskannya.

Menyebutkan keterbatasan menunjukkan kamu **memahami** karyamu sendiri, bukan sekadar membuatnya berjalan. Reviewer dan calon pemberi kerja memperhatikan hal ini.
:::

---

## 🎥 Merekam Video Demo

Target: **2–3 menit**. Tidak lebih.

### Struktur yang efektif

| Waktu | Isi |
|---|---|
| **0:00–0:20** | Siapa kamu, apa yang kamu bangun, masalah apa yang diselesaikan |
| **0:20–0:40** | Tampilkan aplikasinya — tunjukkan data sudah tampil **sebelum** connect wallet, lalu hubungkan |
| **0:40–1:40** | Demonstrasikan alur utama: buat target → setor → progress naik |
| **1:40–2:10** | Tunjukkan transaksinya di Blockscout — buktikan ini nyata |
| **2:10–2:40** | Singgung teknologinya dan satu tantangan yang kamu hadapi |
| **2:40–3:00** | Keterbatasan dan rencana lanjutan |

### Tips praktis

:::tip Yang membedakan demo bagus dan biasa
1. **Siapkan semuanya sebelum merekam.** Wallet terhubung, ada saldo testnet, tab explorer sudah terbuka. Jangan merekam dirimu mencari-cari faucet.
2. **Isi contract-mu dengan data lebih dulu.** Contract yang baru di-deploy itu kosong, dan demo yang dimulai dari layar kosong sulit dipahami. Jalankan `scripts/seed.js` dari Unit 2 supaya ada beberapa target dengan progress berbeda — termasuk satu yang sudah 100% agar kamu bisa mendemokan **Cairkan Dana**.
3. **Rekam dalam beberapa potongan** kalau perlu, lalu gabungkan. Tidak wajib satu take.
4. **Perbesar tampilan browser** ke 125–150%. Teks kecil tidak terbaca di rekaman.
5. **Tunjukkan transaksi di explorer.** Ini yang membuktikan aplikasimu benar-benar berjalan di chain, bukan mock.
6. **Sebutkan satu hal yang sulit.** "Deploy saya kelihatan menggantung berkali-kali — ternyata RPC-nya menerima transaksi tapi tidak pernah mengembalikan receipt" jauh lebih berkesan daripada demo yang terlalu mulus.
7. **Testnet bisa lambat.** Kalau transaksi lama, jangan panik — jelaskan sambil menunggu, atau potong bagian itu saat edit.
:::

### Alat perekam

| Alat | Platform | Catatan |
|---|---|---|
| OBS Studio | Semua | Gratis, paling fleksibel |
| Loom | Semua | Paling cepat, langsung dapat link |
| Perekam layar bawaan | Windows (Win+G) / macOS (Cmd+Shift+5) | Tidak perlu install |

Unggah ke **YouTube (unlisted)** atau **Google Drive dengan akses publik**. Pastikan tautannya benar-benar bisa dibuka orang lain — **uji dengan jendela penyamaran** sebelum mengumpulkan.

:::warning Kesalahan paling umum saat submission
Tautan Google Drive yang masih dibatasi ke akun sendiri. Reviewer membukanya, melihat "Kamu perlu izin akses", dan submission itu dianggap tidak lengkap.

Selalu uji tautanmu di jendela penyamaran.
:::

---

## 📸 Kumpulkan Bukti Sekarang

Kamu akan membutuhkan semua ini untuk [submission kelulusan](../../Phase-4-Graduation/panduan-submission). Kumpulkan sekarang selagi segar:

- [ ] URL aplikasi yang sudah online
- [ ] URL repo GitHub (pastikan publik)
- [ ] Alamat contract + tautan Blockscout (**terverifikasi**, tab Contract menampilkan source)
- [ ] URL video demo (**diuji di jendela penyamaran**)
- [ ] Screenshot aplikasi berjalan
- [ ] Screenshot transaksi berhasil di explorer

:::tip Simpan semuanya di satu catatan
Buat satu dokumen berisi semua tautan di atas. Saat mengisi form submission nanti, kamu tinggal menyalin — bukan mencari-cari di riwayat browser tanggal 9 Agustus malam.
:::

---

## ✅ Checklist Akhir Guided Project

- [ ] Contract ter-deploy dan **terverifikasi** di testnet
- [ ] Frontend online di URL publik
- [ ] Repo GitHub publik, **tanpa** file rahasia di dalamnya
- [ ] README lengkap termasuk bagian keterbatasan
- [ ] Video demo 2–3 menit terunggah dan tautannya teruji
- [ ] Semua bukti terkumpul di satu catatan

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Periksa `.gitignore` sebelum push pertama** — riwayat git tidak bisa benar-benar dihapus
- Variabel `VITE_` **ikut terkirim ke browser** — jangan taruh rahasia di sana
- Di Vercel, atur **Root Directory ke `celengan-ui`** dan preset **Vite**
- README yang baik punya bagian **"keterbatasan yang diketahui"** — itu kekuatan, bukan kelemahan
- **Isi contract dengan data sebelum merekam** — demo dari layar kosong sulit dipahami
- Video **2–3 menit**, siapkan semuanya sebelum merekam, **perbesar tampilan**
- **Tunjukkan transaksi di explorer** — itu bukti aplikasimu nyata
- Sebutkan **satu tantangan yang kamu hadapi**; demo yang terlalu mulus justru kurang berkesan
- **Uji semua tautan di jendela penyamaran** sebelum mengumpulkan
:::

---

🎉 **Guided project selesai!** Ini mencakup Learning Track Phase 7 dan 8.

**Lanjut:** [Phase 4 — Syarat Kelulusan](../../Phase-4-Graduation/syarat-kelulusan) 👉
