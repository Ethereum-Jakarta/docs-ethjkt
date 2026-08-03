---
sidebar_position: 2
title: 📖 Unit 2 — Glossary
description: Kamus istilah Injective, Cosmos, Solidity, dan Web3 dalam bahasa Indonesia — referensi cepat untuk semua istilah yang muncul selama camp.
---

# 📖 Unit 2 — Glossary

:::info Cara memakai halaman ini
Bukan untuk dibaca dari atas ke bawah. Tekan **Ctrl+F** (atau **Cmd+F**) dan cari istilah yang membingungkanmu.

Setiap entri menyebutkan di unit mana istilah itu dibahas lebih dalam.
:::

---

## 🌐 Web3 Umum

**Blockchain**
Catatan transaksi yang disalin ke banyak komputer sekaligus, disusun sebagai rantai blok. Sulit diubah karena perubahan harus disetujui mayoritas jaringan. → [Phase 0 Unit 1](../Phase-0-Prerequisites/apa-itu-web3)

**Wallet**
Aplikasi yang menyimpan **kunci**, bukan koin. Kunci itulah yang membuktikan kepemilikan asetmu di chain.

**Private key**
Kunci rahasia untuk menandatangani transaksi. Siapa pun yang memilikinya menguasai asetmu sepenuhnya. Tidak pernah dibagikan.

**Seed phrase / Mnemonic**
12 atau 24 kata yang bisa memulihkan seluruh wallet. Setara dengan private key dalam hal risiko. Simpan di kertas fisik.

**Gas**
Biaya untuk menjalankan transaksi. Di Injective dibayar dengan INJ.

**Testnet**
Jaringan tiruan dengan token tanpa nilai, untuk latihan. Injective testnet: chain ID `1439` (EVM) atau `injective-888` (Cosmos).

**Mainnet**
Jaringan sungguhan dengan aset bernilai nyata.

**Faucet**
Layanan yang membagikan token testnet gratis.

**Explorer**
Situs untuk melihat transaksi, alamat, dan contract di chain. Injective memakai Blockscout.

**dApp**
*Decentralized application* — aplikasi yang logikanya berjalan di smart contract, bukan di server tunggal.

**DeFi**
*Decentralized Finance* — layanan keuangan yang berjalan di blockchain tanpa perantara terpusat.

**MEV**
*Maximal Extractable Value* — keuntungan yang bisa diambil dengan mengatur urutan transaksi dalam blok. → [Phase 0 Unit 2](../Phase-0-Prerequisites/apa-itu-injective)

**Front-running**
Bentuk MEV: menyelipkan transaksi di depan transaksi orang lain untuk mengambil selisih harga.

---

## ⚡ Injective

**Injective**
Blockchain Layer 1 yang dibangun khusus untuk aplikasi keuangan, dengan fitur pasar tertanam di level chain. → [Phase 0 Unit 2](../Phase-0-Prerequisites/apa-itu-injective)

**INJ**
Token asli Injective. Dipakai untuk gas, staking, governance, dan jaminan pasar. → [Phase 1 Unit 3](../Phase-1-Fundamentals/Concept-1-Arsitektur/tokenomics-inj)

**Exchange module**
Modul bawaan chain yang menyediakan orderbook dan matching engine. Pembeda utama Injective. → [Phase 1 Unit 2](../Phase-1-Fundamentals/Concept-1-Arsitektur/exchange-module-orderbook)

**Oracle module**
Modul yang memasukkan data harga dari dunia luar ke dalam chain. → [Phase 1 Concept II Unit 2](../Phase-1-Fundamentals/Concept-2-Ekosistem/oracle-bridge-interop)

**Auction module / Burn auction**
Mekanisme yang melelang biaya terkumpul; INJ yang dipakai menawar dibakar permanen. → [Phase 1 Unit 3](../Phase-1-Fundamentals/Concept-1-Arsitektur/tokenomics-inj)

**Peggy**
Modul bridge Injective ke Ethereum.

**Helix**
DEX flagship di Injective, contoh nyata pemakaian exchange module. → [Phase 1 Concept II Unit 1](../Phase-1-Fundamentals/Concept-2-Ekosistem/dapps-dan-helix)

**MultiVM**
Kemampuan Injective menjalankan dua lingkungan smart contract sekaligus: EVM (Solidity) dan CosmWasm (Rust). → [Phase 0 Unit 3](../Phase-0-Prerequisites/cosmos-ibc-dan-multivm)

**`inj1...`**
Format alamat bech32 untuk sisi Cosmos Injective.

**Frequent Batch Auction**
Mekanisme yang mengeksekusi sekumpulan order pada satu harga kliring bersama, sehingga front-running tidak lagi menguntungkan. → [Phase 1 Unit 2](../Phase-1-Fundamentals/Concept-1-Arsitektur/exchange-module-orderbook)

---

## 🧱 Cosmos

**Cosmos SDK**
Framework untuk membangun blockchain. Injective dibangun di atasnya. → [Phase 0 Unit 3](../Phase-0-Prerequisites/cosmos-ibc-dan-multivm)

**CometBFT / Tendermint**
Mesin konsensus yang memberi Injective instant finality.

**Modul**
Komponen chain yang menangani satu urusan tertentu (bank, staking, exchange, oracle).

**IBC**
*Inter-Blockchain Communication* — protokol standar untuk memindahkan aset dan pesan antar blockchain tanpa perantara terpercaya.

**Bridge**
Jembatan antar chain yang memakai perantara. Lebih luas jangkauannya dari IBC, tapi menambah risiko kepercayaan.

**Validator**
Node yang mengusulkan dan memvalidasi blok, dengan mempertaruhkan INJ sebagai jaminan.

**Staking**
Mengunci token sebagai jaminan keamanan jaringan, dengan imbalan bagian dari emisi.

**Delegasi**
Mempercayakan token-mu ke validator tanpa menjalankan node sendiri.

**Slashing**
Penghangusan sebagian stake sebagai hukuman bagi validator yang berbuat curang.

**Instant finality**
Transaksi final segera setelah blok disetujui mayoritas validator, tanpa perlu menunggu konfirmasi tambahan. → [Phase 1 Unit 1](../Phase-1-Fundamentals/Concept-1-Arsitektur/arsitektur-injective)

**`injectived`**
CLI resmi untuk berinteraksi dengan Injective chain.

---

## 📜 Solidity & EVM

**Smart contract**
Program yang berjalan di blockchain. Tidak bisa diubah setelah di-deploy. → [Phase 2 Solidity Unit 1](../Phase-2-Smart-Contracts/Solidity/solidity-dasar)

**EVM**
*Ethereum Virtual Machine* — lingkungan eksekusi smart contract Solidity.

**Solidity**
Bahasa pemrograman utama untuk contract EVM.

**`0x...`**
Format alamat heksadesimal untuk sisi EVM.

**ABI**
*Application Binary Interface* — deskripsi function dan event sebuah contract; dibutuhkan frontend untuk memanggilnya.

**`msg.sender`**
Alamat yang memanggil sebuah function. Dasar dari hampir semua kontrol akses.

**`view` / `pure`**
Penanda function yang hanya membaca (`view`) atau tidak menyentuh state sama sekali (`pure`). Gratis dipanggil dari luar chain.

**`payable`**
Penanda function yang boleh menerima token.

**Mapping**
Struktur kunci-nilai. Tidak bisa di-loop, dan semua kuncinya bernilai nol secara default.

**Event**
Log yang dipancarkan contract untuk didengarkan aplikasi di luar chain. Jauh lebih murah daripada menyimpan di state.

**Modifier**
Aturan yang bisa dipakai ulang untuk membatasi atau memvalidasi function. → [Phase 2 Solidity Unit 2](../Phase-2-Smart-Contracts/Solidity/solidity-lanjutan)

**Custom error**
Cara melempar error yang lebih murah daripada string `require`, dan bisa membawa data.

**Reentrancy**
Serangan di mana contract penerima memanggil balik function penarikan sebelum state diperbarui, sehingga bisa menarik berkali-kali.

**Checks-Effects-Interactions**
Urutan wajib: validasi dulu, ubah state, baru kirim token atau panggil contract lain. Pencegahan utama reentrancy.

**OpenZeppelin**
Pustaka contract standar yang sudah diaudit luas.

**Hardhat / Foundry**
Dua framework pengembangan smart contract EVM.

**Remix**
IDE Solidity berbasis browser, tanpa perlu instalasi.

**Wei / ether**
Satuan. `1 ether` = `10^18` wei. Di Injective, INJ juga memakai 18 desimal.

---

## 🦀 Rust & CosmWasm

**Rust**
Bahasa pemrograman yang dipakai menulis contract CosmWasm. → [Phase 2 Rust Unit 1](../Phase-2-Smart-Contracts/Rust-CosmWasm/rust-untuk-web3)

**CosmWasm**
Framework smart contract untuk chain Cosmos, berbasis WebAssembly.

**Wasm**
*WebAssembly* — format biner portabel yang dijalankan chain. Target kompilasi contract CosmWasm.

**Ownership**
Aturan Rust: setiap nilai punya satu pemilik; memberikannya ke tempat lain **memindahkan** kepemilikan.

**Borrowing**
Meminjam nilai tanpa mengambil alih kepemilikan. `&` untuk baca, `&mut` untuk tulis.

**`Option`**
Tipe untuk nilai yang mungkin tidak ada. Pengganti `null` di Rust.

**`Result`**
Tipe untuk operasi yang mungkin gagal. Berisi `Ok` atau `Err`.

**Operator `?`**
Jalan pintas: kalau `Ok` ambil isinya, kalau `Err` hentikan function dan teruskan error.

**`instantiate` / `execute` / `query`**
Tiga entry point contract CosmWasm. Padanan constructor, function biasa, dan function `view` di Solidity. → [Phase 2 Rust Unit 2](../Phase-2-Smart-Contracts/Rust-CosmWasm/cosmwasm-starter)

**`code_id`**
Pengenal kode Wasm yang sudah diunggah ke chain. Satu `code_id` bisa di-instantiate menjadi banyak contract.

**`Item` / `Map`**
Struktur penyimpanan CosmWasm. `Item` untuk satu nilai, `Map` untuk kunci-nilai.

**`info.sender`**
Padanan `msg.sender` di CosmWasm.

**`DepsMut` / `Deps`**
Akses storage yang bisa menulis (`DepsMut`) atau hanya membaca (`Deps`).

**`Uint128`**
Tipe angka CosmWasm untuk jumlah token. Selalu pakai ini, bukan `u128`.

**`Addr`**
Tipe alamat CosmWasm yang sudah tervalidasi. Selalu pakai ini, bukan `String`.

**cargo**
Build tool dan package manager Rust.

**rust-optimizer**
Image Docker yang mengecilkan Wasm agar cukup kecil untuk di-deploy.

---

## 📊 Trading & Pasar

**Orderbook**
Daftar order beli dan jual yang menunggu dipertemukan. → [Phase 1 Unit 2](../Phase-1-Fundamentals/Concept-1-Arsitektur/exchange-module-orderbook)

**CLOB**
*Central Limit Order Book* — model orderbook klasik yang dipakai bursa saham dan Injective.

**AMM**
*Automated Market Maker* — model alternatif tanpa orderbook; harga ditentukan rumus dari rasio kolam likuiditas.

**Bid / Ask**
Order beli (`bid`) dan order jual (`ask`).

**Spread**
Selisih antara bid tertinggi dan ask terendah.

**Limit order**
Order dengan harga yang ditentukan. Kepastian harga, tapi belum tentu tereksekusi.

**Market order**
Order yang langsung dieksekusi di harga terbaik yang tersedia. Pasti jadi, tapi harganya tidak pasti.

**Maker / Taker**
Maker memasang order dan menyediakan likuiditas; taker mengambil order yang sudah ada.

**Slippage**
Selisih antara harga yang kamu harapkan dan harga yang benar-benar kamu dapat.

**Likuiditas**
Seberapa mudah aset diperdagangkan tanpa menggerakkan harganya banyak.

**Shared liquidity**
Di Injective, semua aplikasi berbagi orderbook yang sama, sehingga likuiditas tidak terpecah antar dApp.

**Perpetual futures**
Kontrak derivatif tanpa tanggal jatuh tempo, biasanya dengan leverage.

**Oracle manipulation**
Serangan dengan mendistorsi harga yang dilaporkan oracle, untuk mengeksploitasi protokol yang bergantung padanya.

**TWAP**
*Time-Weighted Average Price* — harga rata-rata sepanjang periode. Lebih tahan manipulasi daripada harga sesaat.

---

**Lanjut:** [Unit 3 — Setelah Camp](./setelah-camp) 👉
