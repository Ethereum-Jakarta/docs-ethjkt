---
sidebar_position: 1
title: 1. Persiapan Lingkungan untuk TugWar Game
description: Mempersiapkan lingkungan pengembangan dengan Node.js, VS Code, dan Hardhat untuk pengembangan TugWar Game pada jaringan Monad Testnet
keywords: [hardhat, vscode, ethereum, development, smart contract, web3, monad, testnet, typescript, tugwar, game]
---

# 1. Persiapan Lingkungan untuk TugWar Game

Panduan ini akan membantu Anda mempersiapkan lingkungan pengembangan untuk membuat **TugWar Game** pada jaringan **Monad Testnet** menggunakan **Hardhat**. TugWar Game adalah smart contract game interaktif di mana dua tim bersaing dalam permainan tarik tambang virtual dengan mechanics yang kompleks dan real-time statistics.

## Daftar Isi

1. [Prasyarat Pengembangan](#prasyarat-pengembangan)
2. [Membuat Direktori Proyek](#1-membuat-direktori-proyek)
3. [Inisialisasi Proyek Node.js](#2-inisialisasi-proyek-nodejs)
4. [Menginstal Hardhat dan Dependensi](#3-menginstal-hardhat-dan-dependensi)
5. [Inisialisasi Proyek Hardhat dengan TypeScript](#4-inisialisasi-proyek-hardhat-dengan-typescript)
6. [Membuka Proyek di Visual Studio Code](#5-membuka-proyek-di-visual-studio-code)
7. [Memahami Struktur Proyek](#6-memahami-struktur-proyek)
8. [Verifikasi Instalasi](#verifikasi-instalasi)

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
mkdir monad-tugwar-game
```

4. Pindah ke direktori yang baru dibuat:

```bash
cd monad-tugwar-game
```

## 2. Inisialisasi Proyek Node.js

Buat file `package.json` yang akan mengatur dependensi proyek Anda:

```bash
npm init -y
```

Perintah ini akan membuat file `package.json` dengan konfigurasi default. Output di terminal akan terlihat seperti ini:

```
Wrote to /path/to/monad-tugwar-game/package.json:

{
  "name": "monad-tugwar-game",
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

Instal Hardhat dan plugin yang diperlukan untuk pengembangan game dengan perintah berikut:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify hardhat-gas-reporter solidity-coverage @openzeppelin/contracts
```

**Catatan**: Proses instalasi ini mungkin membutuhkan waktu beberapa menit tergantung pada kecepatan internet Anda.

### Penjelasan Dependensi

| Paket | Deskripsi |
|-------|-----------|
| **hardhat** | Framework pengembangan Ethereum untuk professional |
| **hardhat-toolbox** | Kumpulan plugin untuk Hardhat (ethers.js, chai, mocha, dll) |
| **hardhat-verify** | Plugin untuk verifikasi kontrak di explorer |
| **hardhat-gas-reporter** | Plugin untuk analisis biaya gas |
| **solidity-coverage** | Plugin untuk menganalisis test coverage |
| **@openzeppelin/contracts** | Library kontrak yang aman dan teruji untuk game development |

## 4. Inisialisasi Proyek Hardhat dengan TypeScript

Setelah instalasi selesai, buat konfigurasi Hardhat awal:

```bash
npx hardhat init
```

Anda akan melihat prompt seperti ini:

```
✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · /path/to/monad-tugwar-game
✔ Do you want to add a .gitignore? (Y/n) · y
```

Pilih opsi:
- **Create a TypeScript project** untuk menggunakan TypeScript
- Terima direktori proyek default yang disarankan dengan menekan Enter
- Ketik `y` untuk menambahkan file `.gitignore`

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
monad-tugwar-game/
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

## 6. Memahami Struktur Proyek

Mari kita pahami fungsi dari setiap folder dan file penting untuk pengembangan TugWar Game:

### Folder Utama

| Folder/File | Deskripsi |
|-------------|-----------|
| **contracts/** | Tempat untuk menulis smart contract Solidity (TugWarContract.sol) |
| **scripts/** | Berisi script untuk deployment dan interaksi dengan game contract |
| **test/** | Berisi file test untuk menguji game mechanics |
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
File `Lock.sol` dan `deploy.ts` adalah contoh yang dibuat otomatis oleh Hardhat. Kita akan mengganti file-file ini dengan smart contract TugWar Game kita pada bagian selanjutnya.
:::

### Struktur Game Contract yang Akan Dibuat

Berikut adalah gambaran struktur yang akan kita bangun:

```
contracts/
├── TugWarContract.sol    # Main game contract
├── interfaces/
│   └── ITugWarGame.sol   # Interface untuk game
└── libraries/
    └── GameMath.sol      # Library untuk kalkulasi game (opsional)
```

## Verifikasi Instalasi

Untuk memastikan bahwa Hardhat telah terinstal dengan benar, jalankan perintah:

```bash
npx hardhat --version
```

Anda akan melihat versi Hardhat yang terinstal, contohnya:
```
Hardhat version 2.23.0
```

### Test Kompilasi

Mari jalankan kompilasi untuk memastikan semuanya berjalan dengan baik:

```bash
npx hardhat compile
```

Jika berhasil, Anda akan melihat output seperti:
```
Compiled 1 Solidity file successfully
```

## Konsep TugWar Game

Sebelum melanjutkan ke konfigurasi, mari kita pahami konsep game yang akan kita bangun:

### Game Mechanics

- **Rope Position**: Posisi tali virtual (-127 hingga +127)
- **Team Competition**: Dua tim bersaing menarik tali
- **Win Condition**: Tim yang mencapai selisih skor tertentu menang
- **Real-time Statistics**: Tracking performa tim dan prediksi
- **Owner Management**: Kontrol game dan reset functionality

### Fitur Advanced

- **Event-Driven Updates**: Real-time game events
- **Player Statistics**: Individual dan team analytics
- **Prediction System**: AI-like prediction berdasarkan trends
- **Multi-Game Support**: Tournament dan seasonal gameplay
- **Gas Optimization**: Efficient contract design

## Kesimpulan

Selamat! Anda telah berhasil:

1. ✅ Membuat direktori proyek baru untuk TugWar Game
2. ✅ Menginisialisasi proyek Node.js
3. ✅ Menginstal Hardhat dan dependensi yang diperlukan
4. ✅ Menginisialisasi proyek Hardhat dengan TypeScript
5. ✅ Memahami struktur folder proyek
6. ✅ Verifikasi instalasi dan kompilasi

Pada bagian selanjutnya, kita akan mengkonfigurasi Hardhat untuk bekerja dengan Monad Testnet dan mempersiapkan pengelolaan private key secara aman untuk deployment TugWar Game.