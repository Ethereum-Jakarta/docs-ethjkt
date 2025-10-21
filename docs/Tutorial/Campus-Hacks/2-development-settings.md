---
sidebar_position: 2
title: 2. Persiapan Lingkungan untuk Token Factory
description: Mempersiapkan lingkungan pengembangan dengan Node.js, VS Code, dan Hardhat untuk pengembangan token pada jaringan Monad Testnet
keywords: [hardhat, vscode, ethereum, development, smart contract, web3, monad, testnet, typescript, token, erc20, factory]
---

# 2. Persiapan Lingkungan untuk Token Factory

Panduan ini akan membantu Anda mempersiapkan lingkungan pengembangan untuk membuat **Token Factory** pada jaringan **Monad Testnet**. Token Factory adalah platform untuk menciptakan token ERC20 secara dinamis menggunakan smart contract.

## Prasyarat Pengembangan

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/en/download/) (v18+ direkomendasikan)
- [Visual Studio Code](https://code.visualstudio.com/)
- [MetaMask](https://metamask.io/) browser extension (sudah dikonfigurasi dengan Monad Testnet)
- [Git](https://git-scm.com/downloads) (opsional tetapi direkomendasikan)

## 1. Membuat Direktori Proyek

### Langkah-langkah Detail:

1. Buka Terminal (macOS/Linux) atau Command Prompt (Windows)
2. Navigasikan ke lokasi di mana Anda ingin membuat proyek baru
3. Buat direktori proyek dengan perintah:

```bash
mkdir monad-token-factory
```

4. Pindah ke direktori yang baru dibuat:

```bash
cd monad-token-factory
```

## 2. Inisialisasi Proyek Node.js

Buat file `package.json` yang akan mengatur dependensi proyek Anda:

```bash
npm init -y
```

Perintah ini akan membuat file `package.json` dengan konfigurasi default. Output di terminal akan terlihat seperti ini:

```
Wrote to /path/to/monad-token-factory/package.json:

{
  "name": "monad-token-factory",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## 3. Menginstal Hardhat dan Dependensi

Instal Hardhat dan plugin yang diperlukan dengan perintah berikut:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

**Catatan**: Proses instalasi ini mungkin membutuhkan waktu beberapa menit tergantung pada kecepatan internet Anda.

### Penjelasan Dependensi

| Paket | Deskripsi |
|-------|-----------|
| **hardhat** | Framework pengembangan Ethereum untuk professional |
| **hardhat-toolbox** | Kumpulan plugin untuk Hardhat (ethers.js, chai, mocha, dll) |
| **@openzeppelin/contracts** | Library standar untuk kontrak yang aman dan teruji |

## 4. Inisialisasi Proyek Hardhat dengan TypeScript

Setelah instalasi selesai, buat konfigurasi Hardhat awal:

```bash
npx hardhat init
```

Anda akan melihat prompt seperti ini:

```
✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · /path/to/monad-token-factory
✔ Do you want to add a .gitignore? (Y/n) · y
```

Pilih opsi:
- **Create a TypeScript project** untuk menggunakan TypeScript
- Terima direktori proyek default yang disarankan dengan menekan Enter
- Ketik `y` untuk menambahkan file `.gitignore`

![Inisialisasi proyek Hardhat](/img/hardhat-init.png)

Setelah proses selesai, Anda akan melihat pesan sukses:

```
✨ Project created ✨

See the README.md file for how to run the project.
```

## 5. Membuka Proyek di Visual Studio Code

Buka proyek di VS Code:

```bash
code .
```

Anda akan melihat struktur folder proyek yang dibuat oleh Hardhat dengan TypeScript:

```
monad-token-factory/
├── contracts/            # Folder untuk smart contract
│   └── Lock.sol          # Contoh contract bawaan
├── scripts/              # Script deployment dan interaksi
│   └── deploy.ts         # Script deploy bawaan
├── test/                 # Test untuk contract
│   └── Lock.ts           # Test bawaan
├── hardhat.config.ts     # File konfigurasi Hardhat
├── package.json          # Konfigurasi npm
├── tsconfig.json         # Konfigurasi TypeScript
└── .gitignore            # File yang diabaikan Git
```

<!-- ![Struktur folder di VS Code](/img/hardhat-vscode.png) -->

## 6. Memahami Struktur Proyek

Mari kita pahami fungsi dari setiap folder dan file penting:

### Folder Utama

| Folder/File | Deskripsi |
|-------------|-----------|
| **contracts/** | Tempat untuk menulis smart contract Solidity |
| **scripts/** | Berisi script untuk deployment dan interaksi dengan contract |
| **test/** | Berisi file test untuk menguji contract |
| **artifacts/** | (akan dibuat) Hasil kompilasi contract |
| **typechain-types/** | (akan dibuat) TypeScript bindings untuk contract |

### File Konfigurasi

| File | Deskripsi |
|------|-----------|
| **hardhat.config.ts** | File konfigurasi utama untuk Hardhat |
| **tsconfig.json** | Konfigurasi TypeScript |
| **package.json** | Konfigurasi npm dan dependensi |
| **.gitignore** | Daftar file yang tidak dimasukkan ke Git |

:::info
File `Lock.sol` dan `deploy.ts` adalah contoh yang dibuat otomatis oleh Hardhat. Kita akan mengganti file-file ini dengan smart contract Token Factory kita pada bagian selanjutnya.
:::

## Verifikasi Instalasi

Untuk memastikan bahwa Hardhat telah terinstal dengan benar, jalankan perintah:

```bash
npx hardhat --version
```

Anda akan melihat versi Hardhat yang terinstal, contohnya:
```
Hardhat version 2.17.0
```

## Kesimpulan

Selamat! Anda telah berhasil:

1. Membuat direktori proyek baru untuk Token Factory
2. Menginisialisasi proyek Node.js
3. Menginstal Hardhat dan dependensi yang diperlukan
4. Menginisialisasi proyek Hardhat dengan TypeScript
5. Memahami struktur folder proyek

Pada bagian selanjutnya, kita akan mengkonfigurasi Hardhat untuk bekerja dengan Monad Testnet dan mempersiapkan pengelolaan private key secara aman.