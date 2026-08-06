---
sidebar_position: 1
title: 📚 Unit 1 — Resources
description: Kumpulan referensi resmi Injective — dokumentasi, endpoint, faucet, explorer, repo, tooling, dan komunitas Indonesia.
---

# 📚 Unit 1 — Resources

:::info Goal Unit Ini
Halaman ini adalah **referensi cepat** yang bisa kamu buka kapan saja — saat camp maupun setelahnya. Tidak perlu dibaca berurutan.
:::

:::note Diverifikasi 30 Juli 2026
Semua endpoint dan URL di halaman ini diverifikasi terhadap dokumentasi resmi pada 30 Juli 2026. Nilai-nilai ini bisa berubah seiring upgrade jaringan.

Kalau ada yang tidak berfungsi, cek [docs.injective.network](https://docs.injective.network) lalu laporkan di grup Telegram supaya halaman ini diperbarui.
:::

---

## 📖 Dokumentasi Resmi

| Sumber | URL |
|---|---|
| Dokumentasi utama | [docs.injective.network](https://docs.injective.network) |
| Dokumentasi EVM | [docs.injective.network/developers-evm](https://docs.injective.network/developers-evm/) |
| Dokumentasi CosmWasm | [docs.injective.network/developers-cosmwasm](https://docs.injective.network/developers-cosmwasm/) |
| API reference TypeScript SDK | [injectivelabs.github.io/injective-ts](https://injectivelabs.github.io/injective-ts/) |
| Situs resmi | [injective.com](https://injective.com) |

---

## 🌐 Endpoint Jaringan

### Injective EVM

| | **Testnet** (dipakai di camp) | **Mainnet** |
|---|---|---|
| Chain ID (desimal) | `1439` | `1776` |
| Chain ID (heksa) | `0x59f` | `0x6f0` |
| JSON-RPC | `https://testnet.sentry.chain.json-rpc.injective.network/` | `https://sentry.evm-rpc.injective.network/` |
| WebSocket | `wss://k8s.testnet.ws.injective.network/` | `wss://sentry.evm-ws.injective.network` |
| Explorer (UI) | [testnet.blockscout.injective.network](https://testnet.blockscout.injective.network/) | [blockscout.injective.network](https://blockscout.injective.network/) |
| Explorer (API) | `https://testnet.blockscout-api.injective.network/api` | `https://blockscout-api.injective.network/api` |
| Mata uang | INJ (18 desimal) | INJ (18 desimal) |

:::danger Dua hal yang sering salah di tabel ini

**1. Jangan pakai RPC testnet `https://k8s.testnet.json-rpc.injective.network/`.**
Endpoint itu menerima transaksi tapi **tidak pernah mengembalikan** `eth_getTransactionReceipt`, sehingga `tx.wait()` dan `waitForDeployment()` menggantung selamanya meski transaksinya sukses. Pakai endpoint **sentry** di tabel.

**2. URL API explorer ≠ URL explorer.**
API-nya ada di host dengan sisipan `-api`, bukan di path `/api` milik UI:

```bash
$ curl -so /dev/null -w "%{http_code}\n" "https://testnet.blockscout.injective.network/api?module=block&action=eth_block_number"
404
$ curl -so /dev/null -w "%{http_code}\n" "https://testnet.blockscout-api.injective.network/api?module=block&action=eth_block_number"
200
```

Ini yang dibutuhkan `hardhat verify` / `forge verify-contract`.
:::

### Injective Cosmos-Native

| | **Testnet** | **Mainnet** |
|---|---|---|
| Chain ID | `injective-888` | `injective-1` |
| Node RPC | `https://testnet.sentry.tm.injective.network:443` | — |

:::danger Testnet vs Mainnet
Semua tugas camp memakai **testnet**. Chain ID `1439` dan `injective-888`.

Jangan pernah menjalankan kode latihan terhadap mainnet. Satu digit yang salah bisa berarti transaksi dengan aset sungguhan.
:::

### Menambahkan jaringan ke MetaMask dengan cepat

| Sumber | URL |
|---|---|
| Chainlist — Injective (testnet aktif) | [chainlist.org/?search=injective&testnets=true](https://chainlist.org/?search=injective&testnets=true) |

[Chainlist](https://chainlist.org) menambahkan jaringan EVM ke MetaMask dalam satu klik, tanpa mengetik manual. Berguna juga untuk mencari **RPC alternatif** kalau endpoint resmi sedang lambat.

:::warning Chainlist adalah agregator pihak ketiga
Datanya dikontribusikan komunitas, bukan diterbitkan Injective. Pilih entri **Injective Testnet (`1439`)**, bukan **Injective (`1776`)** yang merupakan mainnet — dan **baca chain ID di dialog MetaMask sebelum menyetujui.**

Tabel endpoint di atas adalah acuan kebenaran. Langkah lengkapnya di [Phase 0 Unit 4](../Phase-0-Prerequisites/setup-wallet-dan-testnet).
:::

---

## 💧 Faucet Testnet

| Faucet | URL |
|---|---|
| Injective resmi | [testnet.faucet.injective.network](https://testnet.faucet.injective.network/) |
| Google Cloud Web3 | [cloud.google.com/application/web3/faucet/injective/testnet](https://cloud.google.com/application/web3/faucet/injective/testnet) |

:::tip Kalau semua faucet kehabisan
Testnet INJ tidak punya nilai — peserta lain bisa mengirimkannya kepadamu dengan bebas. Tanya saja di grup Telegram.
:::

---

## 👛 Wallet

| Wallet | Untuk | URL |
|---|---|---|
| Keplr | Cosmos (`inj1...`) | [keplr.app](https://www.keplr.app/download) |
| MetaMask | EVM (`0x...`) | [metamask.io](https://metamask.io/download) |

:::warning Hanya pasang dari situs resmi
Ekstensi wallet palsu adalah metode penipuan paling umum di Web3. Jangan pernah memasang dari tautan yang dikirim orang di chat, termasuk di grup camp.
:::

---

## 🛠️ Tooling Developer

### Solidity / EVM

| Alat | Fungsi | URL |
|---|---|---|
| Remix | IDE browser, tanpa install | [remix.ethereum.org](https://remix.ethereum.org) |
| Hardhat | Framework berbasis JavaScript | [hardhat.org](https://hardhat.org) |
| Foundry | Framework cepat berbasis Rust | [book.getfoundry.sh](https://book.getfoundry.sh) |
| OpenZeppelin | Pustaka contract teruji | [openzeppelin.com/contracts](https://www.openzeppelin.com/contracts) |
| ethers.js | Pustaka interaksi chain | [docs.ethers.org](https://docs.ethers.org) |

### Rust / CosmWasm

| Alat | Fungsi | URL |
|---|---|---|
| Rust | Bahasa & toolchain | [rustup.rs](https://rustup.rs) |
| CosmWasm Book | Panduan lengkap CosmWasm | [book.cosmwasm.com](https://book.cosmwasm.com) |
| cw-template | Template project | [github.com/CosmWasm/cw-template](https://github.com/CosmWasm/cw-template) |

### Injective SDK

```bash
npm install @injectivelabs/sdk-ts@^1.20.23 @injectivelabs/networks @injectivelabs/utils
```

:::danger Versi `1.20.21` dikompromikan
Versi `@injectivelabs/sdk-ts@1.20.21` (dirilis 8 Juli 2026) berisi kode yang mencuri private key. **Pakai `1.20.23` atau lebih baru.**

Selalu verifikasi setelah instalasi:

```bash
npm list @injectivelabs/sdk-ts
```

Detailnya di [TS-SDK Unit 1](../Phase-3-Building/TS-SDK/setup-injective-ts-sdk).
:::

---

## 🐙 Repositori

| Repo | Isi |
|---|---|
| [InjectiveLabs](https://github.com/InjectiveLabs) | Organisasi utama |
| [injective-ts](https://github.com/InjectiveLabs/injective-ts) | Monorepo TypeScript SDK |
| [CosmWasm/cw-template](https://github.com/CosmWasm/cw-template) | Template contract |
| [OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) | Contract standar |

---

## 💹 Aplikasi untuk Dipelajari

| Aplikasi | Kenapa dilihat |
|---|---|
| [Helix](https://helixapp.com) | DEX flagship — contoh nyata pemakaian exchange module |
| [Halaman ekosistem Injective](https://injective.com) | Daftar dApp yang sedang berjalan |

:::tip Verifikasi sebuah dApp masih hidup
Daftar ekosistem sering memuat proyek yang sudah lama tidak aktif. Cari alamat contract-nya di explorer dan lihat **kapan transaksi terakhirnya**. Ini kebiasaan riset yang berguna jauh melampaui camp.
:::

---

## 🇮🇩 Komunitas Indonesia

| Komunitas | Keterangan |
|---|---|
| [Grup Telegram CLC11](https://t.me/+5G5ADaRfYvplMDQ1) | Grup resmi camp ini |
| [HackQuest](https://www.hackquest.io) | Platform learning track & program |
| Quack Believers | Alumni network HackQuest Indonesia (undangan untuk graduate) |
| [ETHJKT](https://ethjkt.com) | Komunitas Ethereum Jakarta, meetup offline |

---

## 📱 Kanal Resmi Injective

| Kanal | URL |
|---|---|
| X / Twitter | [@Injective](https://x.com/Injective) |
| Blog | [injective.com/blog](https://injective.com/blog) |
| GitHub | [github.com/InjectiveLabs](https://github.com/InjectiveLabs) |

:::warning Waspadai akun palsu
Akun tiruan yang menawarkan "airdrop" atau "verifikasi wallet" sangat umum. Kanal resmi **tidak pernah** meminta seed phrase atau menyuruhmu menghubungkan wallet ke situs yang dikirim lewat DM.
:::

---

## 🧭 Cara Mencari Jawaban Sendiri

Keterampilan yang paling berguna setelah camp berakhir.

| Kalau kamu butuh | Cari di |
|---|---|
| Nama method SDK terkini | [API reference](https://injectivelabs.github.io/injective-ts/) atau autocomplete editor |
| Endpoint atau chain ID | [docs.injective.network](https://docs.injective.network) |
| Contoh kode nyata | Repo di GitHub — cari kode yang benar-benar dipakai, bukan hanya tutorial |
| Kenapa transaksi gagal | [Blockscout](https://testnet.blockscout.injective.network/) — baca pesan error di detail transaksi |
| Error Solidity | Salin pesan error persis ke mesin pencari |
| Error Rust | **Baca pesan compiler sampai selesai** — biasanya sudah berisi saran perbaikan |

:::tip Urutan yang paling efisien saat macet
1. Baca pesan error **sampai habis** — bukan hanya baris pertama
2. Cek transaksinya di explorer
3. Cari pesan error persisnya di mesin pencari
4. Cek dokumentasi resmi
5. **Tanya di grup Telegram** — sertakan pesan error dan apa yang sudah kamu coba

Langkah kelima jauh lebih cepat mendapat jawaban kalau kamu sudah melakukan empat langkah sebelumnya, dan menunjukkannya.
:::

---

**Lanjut:** [Unit 2 — Glossary](./glossary) 👉
