---
sidebar_position: 2
title: 📋 Aturan Main & Eligibility
description: Empat aturan main Monad Blitz dan enam syarat wajib yang harus dipenuhi setiap project agar sah untuk dinilai.
---

# 📋 Aturan Main & Eligibility

:::info Goal Halaman Ini
Di akhir halaman ini kamu akan:
- Hafal **4 aturan main** Monad Blitz
- Hafal **6 syarat eligibility** yang membuat project-mu sah dinilai
- Punya **checklist siap-submit** yang bisa kamu centang satu per satu
:::

:::danger Baca Ini Dulu
Halaman ini adalah bagian paling administratif dari seluruh dokumentasi — dan justru yang paling sering membuat tim bagus gugur. Project yang tidak memenuhi syarat **tidak bisa maju pitching**, seberapa pun kerennya.
:::

---

## ⚖️ Empat Aturan Main

### 01 — Mulai dari Nol

> **Start fresh.** All project code must be written today.

Seluruh kode project harus ditulis **hari ini**. Tidak boleh memakai project pribadi yang sudah ada sebelumnya.

**Yang diperbolehkan:** library standar, package dari npm/crates.io, template starter publik, dan tentu saja bantuan AI coding assistant.

**Yang tidak diperbolehkan:** melanjutkan repo lama milikmu sendiri lalu mengaku dibuat hari ini.

:::tip Cara Aman
Buat repo baru pagi ini dan commit sejak awal. Riwayat commit adalah bukti paling jelas bahwa kode ditulis hari ini.
:::

### 02 — Deploy Live, Bukan Lokal

> **Ship live deployments.** Locally-hosted projects will be disqualified.

Setiap submission harus **ter-deploy dengan demo link yang bisa diakses**. Project yang hanya jalan di `localhost` **didiskualifikasi**.

Artinya kamu butuh dua deployment:
1. **Smart contract** ke Monad Testnet atau Mainnet
2. **Frontend** ke hosting publik (Vercel, Netlify, Cloudflare Pages, dan sejenisnya)

### 03 — Repository Publik

> **Public repositories.**

Kode harus berada di **repo GitHub yang publik**, agar semua orang bisa melihat dan belajar darinya.

:::warning Cek Ulang Visibility
Repo yang dibuat lewat beberapa tool default-nya *private*. Buka Settings → General → Danger Zone → **Change visibility → Public** sebelum submit.
:::

### 04 — Siap Demo dalam Tiga Menit

> **Be ready to demo in three minutes.**

Urutan pitching ditentukan oleh **urutan submission**. Slide bersifat opsional — **demo-nya yang jadi inti**.

---

## ✅ Enam Syarat Eligibility

Ini daftar resmi yang harus dilewati setiap project agar sah untuk pitching.

| No | Syarat | Detail |
|---|---|---|
| **01** | **Repo publik** | Pastikan repository project bersifat publik |
| **02** | **README yang layak** | Jelaskan setup, apa yang project ini lakukan, dan cara menjalankannya |
| **03** | **Deploy di Monad** | Live di Monad Testnet atau Mainnet |
| **04** | **Deploy saat Blitz** | Kontrak harus di-deploy dalam rentang waktu acara |
| **05** | **Live di web** | Aplikasi yang benar-benar ter-deploy, bukan sekadar slide |
| **06** | **Cantumkan contract address** | Tulis alamat kontrak yang sudah di-deploy di README GitHub |

:::danger Dua Syarat yang Paling Sering Terlewat
**Syarat 04 dan 06.**

Syarat 04: kontrak yang kamu deploy kemarin malam untuk latihan **tidak sah**. Deploy ulang hari ini.

Syarat 06: banyak tim lupa menempelkan contract address di README karena sibuk mengejar demo. Lakukan ini **segera setelah deploy**, jangan ditunda.
:::

---

## 📝 Template README Minimal

Supaya syarat 02 dan 06 langsung beres, pakai kerangka ini:

````markdown
# Nama Project

Satu kalimat: project ini apa dan menyelesaikan masalah apa.

## Demo
- Live app: https://project-kamu.vercel.app
- Video demo (opsional): ...

## Deployed Contracts (Monad Testnet)
| Contract | Address |
|---|---|
| NamaKontrak | 0x... |

Explorer: https://testnet.monadvision.com/address/0x...

## Cara Kerja
Penjelasan singkat alur aplikasi dan bagian mana yang memanfaatkan Monad.

## Tech Stack
Solidity, Foundry, Next.js, viem, dst.

## Setup Lokal
```bash
git clone https://github.com/user/repo
cd repo
npm install
npm run dev
```

## Tim
- Nama — peran
````

:::tip Hemat Waktu
Isi bagian **Deployed Contracts** tepat setelah perintah deploy selesai, selagi alamatnya masih ada di terminal. Jangan tunggu sampai menit-menit terakhir.
:::

---

## 🧾 Checklist Siap Submit

Centang semuanya sebelum menekan tombol submit:

**Repository**
- [ ] Repo GitHub sudah dibuat **hari ini**
- [ ] Visibility sudah **Public**
- [ ] README berisi: deskripsi, cara setup, cara menjalankan
- [ ] README mencantumkan **contract address**

**Deployment**
- [ ] Smart contract ter-deploy ke Monad Testnet/Mainnet **hari ini**
- [ ] Alamat kontrak sudah diverifikasi bisa dibuka di explorer
- [ ] Frontend ter-deploy ke hosting publik
- [ ] Link demo sudah dibuka dari **perangkat lain / mode incognito** untuk memastikan benar-benar publik

**Demo**
- [ ] Alur demo sudah dicoba dari awal sampai akhir, minimal sekali
- [ ] Durasi demo di bawah **3 menit**
- [ ] Form dan data contoh sudah disiapkan lebih dulu (lihat [Tips Presentasi](../Setelah-Blitz/tips-presentasi))

**Submission**
- [ ] Submit di [blitz.devnads.com](https://blitz.devnads.com) **sebelum 17:45**
- [ ] Ingat: submit lebih awal = pitching lebih awal

---

:::tip Lanjut
Sudah paham syaratnya? Sekarang pahami bagaimana project-mu akan dinilai di [Demo, Penjurian & Hadiah](./demo-penjurian-dan-hadiah).
:::
