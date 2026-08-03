---
sidebar_position: 4
title: 🎬 Unit 4 — Deploy & Demo
description: Deploy frontend ke Vercel, menulis README yang baik, dan merekam video demo 2-3 menit untuk showcase Townhall 4.
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

Vercel gratis untuk proyek pribadi dan paling mudah untuk Next.js.

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

Pastikan **tidak ada** file `.env`, private key, atau seed phrase dalam daftar yang akan di-commit.

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
3. Vercel mendeteksi Next.js otomatis — biarkan pengaturan bawaan
4. Klik **Deploy**

Setelah beberapa menit kamu akan mendapat URL publik.

:::tip Uji URL publiknya di HP
Buka aplikasimu di ponsel, atau minta teman membukanya.

Hal yang sering baru ketahuan di sini: layout rusak di layar kecil, atau aplikasi mengasumsikan ekstensi wallet ada padahal browser mobile tidak punya. Kamu tidak harus memperbaikinya semua — tapi lebih baik tahu sebelum demo daripada saat demo.
:::

---

## 📄 Menulis README

README adalah hal pertama yang dilihat reviewer. Ini template yang bisa langsung kamu pakai:

```markdown
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

## Fitur

- Buat target tabungan dengan nama dan jumlah target
- Setor INJ ke target mana pun
- Progress bar realtime
- Pembuat mencairkan dana setelah target tercapai
- Kontributor menarik kembali sebelum target tercapai

## Teknologi

- Solidity 0.8.20, Hardhat
- Next.js (App Router), TypeScript
- ethers.js v6

## Menjalankan secara lokal

```bash
git clone https://github.com/USERNAME/celengan-target.git
cd celengan-target
npm install
npm run dev
```

Ubah `CONTRACT_ADDRESS` di `lib/config.ts` kalau kamu men-deploy contract sendiri.

## Keterbatasan yang diketahui

- Tidak ada tenggat waktu target — dana bisa mengendap tanpa batas jika target tak tercapai
- Daftar target dibaca dengan loop per item; tidak skalabel untuk ratusan target
- Belum ada penanganan token selain INJ

## Lisensi

MIT
```

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
| **0:20–0:40** | Tampilkan aplikasinya — hubungkan wallet |
| **0:40–1:40** | Demonstrasikan alur utama: buat target → setor → progress naik |
| **1:40–2:10** | Tunjukkan transaksinya di Blockscout — buktikan ini nyata |
| **2:10–2:40** | Singgung teknologinya dan satu tantangan yang kamu hadapi |
| **2:40–3:00** | Keterbatasan dan rencana lanjutan |

### Tips praktis

:::tip Yang membedakan demo bagus dan biasa
1. **Siapkan semuanya sebelum merekam.** Wallet terhubung, ada saldo testnet, tab explorer sudah terbuka. Jangan merekam dirimu mencari-cari faucet.
2. **Rekam dalam beberapa potongan** kalau perlu, lalu gabungkan. Tidak wajib satu take.
3. **Perbesar tampilan browser** ke 125–150%. Teks kecil tidak terbaca di rekaman.
4. **Tunjukkan transaksi di explorer.** Ini yang membuktikan aplikasimu benar-benar berjalan di chain, bukan mock.
5. **Sebutkan satu hal yang sulit.** "Saya butuh waktu lama memahami kenapa transaksinya gagal — ternyata karena..." jauh lebih berkesan daripada demo yang terlalu mulus.
6. **Testnet bisa lambat.** Kalau transaksi lama, jangan panik — jelaskan sambil menunggu, atau potong bagian itu saat edit.
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
- [ ] Alamat contract + tautan Blockscout
- [ ] URL video demo (**diuji di jendela penyamaran**)
- [ ] Screenshot aplikasi berjalan
- [ ] Screenshot transaksi berhasil di explorer

:::tip Simpan semuanya di satu catatan
Buat satu dokumen berisi semua tautan di atas. Saat mengisi form submission nanti, kamu tinggal menyalin — bukan mencari-cari di riwayat browser tanggal 9 Agustus malam.
:::

---

## ✅ Checklist Akhir Guided Project

- [ ] Contract ter-deploy dan terverifikasi di testnet
- [ ] Frontend online di URL publik
- [ ] Repo GitHub publik, **tanpa** file rahasia di dalamnya
- [ ] README lengkap termasuk bagian keterbatasan
- [ ] Video demo 2–3 menit terunggah dan tautannya teruji
- [ ] Semua bukti terkumpul di satu catatan

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Periksa `.gitignore` sebelum push pertama** — riwayat git tidak bisa benar-benar dihapus
- README yang baik punya bagian **"keterbatasan yang diketahui"** — itu kekuatan, bukan kelemahan
- Video **2–3 menit**, siapkan semuanya sebelum merekam, **perbesar tampilan**
- **Tunjukkan transaksi di explorer** — itu bukti aplikasimu nyata
- Sebutkan **satu tantangan yang kamu hadapi**; demo yang terlalu mulus justru kurang berkesan
- **Uji semua tautan di jendela penyamaran** sebelum mengumpulkan
:::

---

🎉 **Guided project selesai!** Ini mencakup Learning Track Phase 7 dan 8.

**Lanjut:** [Phase 4 — Syarat Kelulusan](../../Phase-4-Graduation/syarat-kelulusan) 👉
