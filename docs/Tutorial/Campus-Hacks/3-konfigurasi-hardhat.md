---
sidebar_position: 3
title: 3. Konfigurasi Hardhat untuk Monad Testnet
description: Mengkonfigurasi Hardhat untuk jaringan Monad Testnet dan menyiapkan pengelolaan private key yang aman
keywords: [hardhat, monad, testnet, typescript, private key, hardhat-vars, vscode, security]
---

# 3. Konfigurasi Hardhat untuk Monad Testnet

Setelah mempersiapkan lingkungan pengembangan, langkah selanjutnya adalah mengkonfigurasi Hardhat untuk bekerja dengan jaringan **Monad Testnet** dan menyiapkan pengelolaan private key yang aman. Konfigurasi yang benar sangat penting untuk memastikan keberhasilan deployment dan interaksi dengan blockchain.

## 1. Konfigurasi File hardhat.config.ts

File `hardhat.config.ts` adalah pusat konfigurasi untuk proyek Hardhat. Mari kita modifikasi file untuk mengatur Hardhat agar bekerja dengan Monad Testnet.

Buka file `hardhat.config.ts` di Visual Studio Code dan ganti isinya dengan konfigurasi berikut:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-vars";
import { vars } from "hardhat/config";
import "hardhat-gas-reporter";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Konfigurasi untuk localhost development
    hardhat: {
      chainId: 31337,
    },
    // Konfigurasi untuk Monad Testnet
    monadTestnet: {
      url: "https://testnet-rpc.monad.xyz/",
      chainId: 10143,
      accounts: vars.has("PRIVATE_KEY") ? [`0x${vars.get("PRIVATE_KEY")}`] : [],
      gasPrice: "auto",
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
```

### Penjelasan Konfigurasi

Mari kita pahami setiap bagian dari konfigurasi:

#### Import dan Plugin

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-vars";
import { vars } from "hardhat/config";
import "hardhat-gas-reporter";
import "solidity-coverage";
```

Plugin ini memperluas fungsionalitas Hardhat:
- **hardhat-toolbox**: Paket plugin esensial (ethers, waffle, dll)
- **hardhat-verify**: Untuk verifikasi kontrak di explorer
- **hardhat-vars**: Untuk manajemen variabel terenkripsi
- **hardhat-gas-reporter**: Untuk melaporkan biaya gas
- **solidity-coverage**: Untuk laporan cakupan kode test

#### Konfigurasi Solidity

```typescript
solidity: {
  version: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

- **version**: Menentukan versi compiler Solidity (0.8.28)
- **optimizer**: Mengaktifkan optimizer untuk menghemat gas dengan pengaturan runs 200

#### Konfigurasi Jaringan

```typescript
networks: {
  // Konfigurasi untuk localhost development
  hardhat: {
    chainId: 31337,
  },
  // Konfigurasi untuk Monad Testnet
  monadTestnet: {
    url: "https://testnet-rpc.monad.xyz/",
    chainId: 10143,
    accounts: vars.has("PRIVATE_KEY") ? [`0x${vars.get("PRIVATE_KEY")}`] : [],
    gasPrice: "auto",
  }
}
```

- **hardhat**: Jaringan lokal untuk development dan testing
- **monadTestnet**: Konfigurasi untuk Monad Testnet dengan:
  - **url**: URL endpoint RPC Monad
  - **chainId**: ID rantai Monad Testnet (10143)
  - **accounts**: Array kunci privat (diambil dari hardhat-vars)
  - **gasPrice**: Setting harga gas otomatis

#### Gas Reporter

```typescript
gasReporter: {
  enabled: true,
  currency: 'USD',
  outputFile: "gas-report.txt",
  noColors: true,
}
```

Konfigurasi untuk menganalisis biaya gas kontrak Anda:
- **enabled**: Mengaktifkan fitur gas reporter
- **currency**: Menampilkan biaya gas dalam USD
- **outputFile**: Menyimpan laporan dalam file
- **noColors**: Format teks tanpa warna, cocok untuk file

#### Path

```typescript
paths: {
  sources: "./contracts",
  tests: "./test",
  cache: "./cache",
  artifacts: "./artifacts"
}
```

Menentukan lokasi folder kunci dalam proyek Hardhat.

## 2. Menyiapkan Private Key Secara Aman dengan Hardhat-Vars

Hardhat-vars menyediakan cara yang aman untuk menyimpan informasi sensitif seperti private key. Tidak seperti file `.env` yang menyimpan data dalam teks biasa, hardhat-vars mengenkripsi data sensitive.

### Mengatur Private Key

Jalankan perintah berikut untuk mengatur private key Anda:

```bash
npx hardhat vars set PRIVATE_KEY
```

Anda akan diminta untuk memasukkan private key. Masukkan private key **tanpa awalan 0x**:

```
? Enter value: ········
✓ Value set successfully
```

![Setup hardhat-vars](/img/hardhat-vars.png)

:::warning Perhatian
Private key adalah informasi yang sangat sensitif yang memberikan kendali penuh atas alamat Ethereum Anda. 
- Jangan pernah membagikan private key Anda
- Pastikan menggunakan hardhat-vars atau metode aman lainnya
- Jangan menggunakan akun dengan dana nyata yang besar untuk development
:::

### Verifikasi Private Key

Untuk memastikan private key telah tersimpan dengan benar, Anda dapat memverifikasinya (tanpa menampilkan key secara penuh):

```bash
npx hardhat vars get PRIVATE_KEY
```

Output akan menampilkan beberapa karakter pertama dari private key untuk konfirmasi:

```
Value: 123a...
```

### Keunggulan Hardhat-Vars

Dibandingkan dengan metode penyimpanan lain seperti file `.env`, hardhat-vars menawarkan:

1. **Enkripsi**: Data disimpan dalam bentuk terenkripsi, bukan plaintext
2. **Keamanan**: File tidak disimpan dalam direktori proyek
3. **Portabilitas**: Tidak perlu khawatir menambahkan file ke `.gitignore`
4. **Kemudahan**: Manajemen variabel dengan CLI yang sederhana

## 3. Menginstal Ekstensi VS Code yang Berguna

Visual Studio Code dapat ditingkatkan dengan beberapa ekstensi untuk memudahkan pengembangan smart contract. Buka tab Extensions di VS Code (Ctrl+Shift+X atau Cmd+Shift+X) dan instal ekstensi berikut:


### Ekstensi Utama

| Ekstensi | Deskripsi |
|----------|-----------|
| **Solidity by Juan Blanco** | Syntax highlighting dan validasi untuk Solidity |
| **Hardhat Solidity** | Integrasi dengan Hardhat ecosystem |
| **Error Lens** | Menampilkan error/warning langsung di editor |

### Ekstensi Tambahan (Opsional)

| Ekstensi | Deskripsi |
|----------|-----------|
| **Prettier - Code formatter** | Merapikan kode dengan format konsisten |
| **Git Graph** | Visualisasi Git history |
| **ESLint** | Linter untuk JavaScript/TypeScript |
| **Import Cost** | Menampilkan ukuran paket yang diimpor |

## 4. Menguji Konfigurasi

Untuk memastikan konfigurasi berjalan dengan baik, mari jalankan task Hardhat sederhana:

```bash
npx hardhat compile
```

Jika tidak ada error, berarti konfigurasi Anda sudah benar.

## Pemecahan Masalah

### Masalah Koneksi RPC

Jika mengalami masalah koneksi ke Monad Testnet:

1. Periksa apakah URL RPC sudah benar (`https://testnet-rpc.monad.xyz/`)
2. Periksa koneksi internet Anda
3. Verifikasi status Monad Testnet (bisa saja sedang down)

### Masalah Private Key

Jika terjadi error terkait private key:

1. Pastikan private key telah diatur dengan benar:
```bash
npx hardhat vars set PRIVATE_KEY
```
2. Verifikasi bahwa key valid dan memiliki cukup MON untuk gas
3. Pastikan kunci dimasukkan tanpa awalan 0x

## Kesimpulan

Selamat! Anda telah berhasil:

1. Mengkonfigurasi Hardhat untuk berinteraksi dengan Monad Testnet
2. Menyiapkan pengelolaan private key yang aman dengan hardhat-vars
3. Menginstal ekstensi VS Code yang berguna untuk pengembangan smart contract

Pengaturan yang benar dan aman merupakan fondasi penting untuk pengembangan smart contract yang profesional. Pada bagian selanjutnya, kita akan mulai membangun smart contract Token Factory.