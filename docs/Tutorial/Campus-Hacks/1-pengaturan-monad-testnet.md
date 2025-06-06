---
sidebar_position: 1
title: 1. Mengatur Monad Testnet pada MetaMask
description: Panduan langkah demi langkah untuk menambahkan Monad Testnet ke MetaMask berdasarkan situs resmi Monad
keywords: [monad, testnet, blockchain, metamask, jaringan, web3]
---

# 1. Mengatur Monad Testnet pada MetaMask

## Apa itu Monad?

**Monad** adalah blockchain Layer-1 inovatif yang dirancang untuk mengatasi masalah skalabilitas, kecepatan, dan biaya yang sering dihadapi oleh blockchain generasi sebelumnya. Monad dioptimalkan khusus untuk aplikasi DeFi (Decentralized Finance) dan menawarkan beberapa keunggulan:

- **Throughput Tinggi**: Mampu memproses ribuan transaksi per detik
- **Biaya Rendah**: Gas fee yang lebih terjangkau dibandingkan blockchain lainnya
- **Kompatibilitas EVM**: Mendukung smart contract Ethereum, memudahkan migrasi dApp
- **Paralelisme**: Arsitektur yang memungkinkan eksekusi transaksi secara paralel
- **Finality Cepat**: Konfirmasi transaksi dalam hitungan detik

### Monad sebagai Blockchain Layer-1

Monad adalah blockchain **Layer-1** yang berarti:

- **Memiliki Blockchain Sendiri**: Monad mengoperasikan blockchain independen dengan infrastruktur, konsensus, dan mekanisme validasi sendiri, tidak bergantung pada blockchain lain untuk keamanan atau finalisasi.

- **Bukan Solusi Scaling Layer-2**: Berbeda dengan solusi Layer-2 (seperti Optimism, Arbitrum, atau zkSync) yang bergantung pada Ethereum atau blockchain lain untuk keamanan, Monad beroperasi sebagai jaringan mandiri.

- **Konsensus Independen**: Memiliki mekanisme konsensus sendiri untuk memvalidasi transaksi dan mengamankan jaringan, bukan hanya meng-"roll up" transaksi ke blockchain induk.

- **Inovasi Arsitektur**: Menggunakan arsitektur blockchain yang dioptimalkan dari awal dengan fokus pada paralelisme dan throughput tinggi, bukan sekedar menambahkan lapisan di atas blockchain yang sudah ada.

- **Keamanan Native**: Keamanan dan validasi transaksi ditangani langsung oleh validator Monad, bukan bergantung pada blockchain lain untuk konfirmasi dan finalisasi transaksi.

Monad Testnet adalah lingkungan pengujian yang memungkinkan developer untuk membangun dan menguji aplikasi mereka sebelum diluncurkan ke mainnet.

## 1. Mengakses Situs Resmi Monad Testnet

### Langkah-langkah:

1. Buka browser web Anda
2. Kunjungi alamat resmi: [https://testnet.monad.xyz](https://testnet.monad.xyz)
3. Anda akan melihat halaman selamat datang dengan judul "Welcome to Monad Testnet"

![Halaman Utama Monad Testnet](/img/monad-1.png)

Pada halaman utama ini, Anda akan melihat dua pilihan:
- **Native Testnet Support** (Untuk pemula)
- **Manually Add Testnet** (Untuk level menengah)

## 2. Menambahkan Monad Testnet ke MetaMask
### Pilih Tombol "Add Testnet to MetaMask"

1. Pada halaman "Manually add Testnet to your wallet", klik tombol berwarna ungu **"Add Testnet to MetaMask"**
2. MetaMask akan terbuka secara otomatis dengan informasi jaringan yang sudah terisi

![Halaman Penambahan Manual Testnet](/img/monad-2.png)

## 3. Menyetujui Penambahan Jaringan di MetaMask

Setelah mengklik "Add Testnet to MetaMask" atau memasukkan detail secara manual:

1. MetaMask akan menampilkan jendela pop-up untuk menyetujui penambahan jaringan baru
2. Verifikasi informasi jaringan yang ditampilkan:
   - Currency symbol: MON
   - Network URL: https://testnet-rpc.monad.xyz/

3. Klik tombol **"Approve"** untuk menyelesaikan proses

![Persetujuan Penambahan Jaringan di MetaMask](/img/monad-3.png)

## 4. Verifikasi Koneksi dan Saldo

Setelah jaringan berhasil ditambahkan:

1. MetaMask Anda akan secara otomatis beralih ke jaringan Monad Testnet
2. Anda dapat melihat simbol mata uang MON pada antarmuka MetaMask
3. Jika Anda telah menerima token testnet, saldo Anda akan terlihat (misalnya, 83.57999 MON)

![Verifikasi Saldo Monad Testnet](/img/monad-4.png)

## Catatan Penting

- **Chain ID** Monad Testnet adalah **10143**
- Simbol mata uang adalah **MON**, bukan MONAD
- URL Explorer resmi: https://testnet.monadexplorer.com/
- Jika Anda belum memiliki token testnet, Anda mungkin perlu menggunakan faucet resmi Monad untuk meminta token

## Pemecahan Masalah

- **Jika MetaMask tidak terbuka otomatis**: Pastikan ekstensi MetaMask sudah terpasang dan aktif di browser Anda
- **Jika Anda tidak melihat saldo setelah menambahkan jaringan**: Anda mungkin perlu meminta token dari faucet Monad Testnet
- **Jika tombol "Add Testnet to MetaMask" tidak merespons**: Coba refresh halaman atau gunakan metode penambahan manual

---

Selamat! Anda telah berhasil menambahkan Monad Testnet ke dompet MetaMask Anda dan siap untuk mulai menguji aplikasi pada jaringan Monad.