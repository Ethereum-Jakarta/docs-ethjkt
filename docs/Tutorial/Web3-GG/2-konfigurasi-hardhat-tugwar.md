---
sidebar_position: 2
title: 2. Konfigurasi Hardhat untuk TugWar Game di Monad Testnet
description: Mengkonfigurasi Hardhat untuk jaringan Monad Testnet dan menyiapkan pengelolaan private key yang aman untuk TugWar Game
keywords: [hardhat, monad, testnet, typescript, private key, hardhat-vars, vscode, security, tugwar, game]
---

# 2. Konfigurasi Hardhat untuk TugWar Game di Monad Testnet

Setelah mempersiapkan lingkungan pengembangan, langkah selanjutnya adalah mengkonfigurasi Hardhat untuk bekerja dengan jaringan **Monad Testnet** dan menyiapkan pengelolaan private key yang aman untuk deployment **TugWar Game**. Konfigurasi yang benar sangat penting untuk memastikan keberhasilan deployment dan interaksi dengan blockchain game.

## Daftar Isi

1. [Konfigurasi File hardhat.config.ts](#1-konfigurasi-file-hardhatconfigts)
2. [Menyiapkan Private Key Secara Aman](#2-menyiapkan-private-key-secara-aman-dengan-hardhat-vars)
3. [Menginstal Ekstensi VS Code](#3-menginstal-ekstensi-vs-code-yang-berguna)
4. [Menguji Konfigurasi](#4-menguji-konfigurasi)
5. [Menyiapkan Package.json Scripts](#5-menyiapkan-packagejson-scripts)
6. [Pemecahan Masalah](#pemecahan-masalah)

## 1. Konfigurasi File hardhat.config.ts

File `hardhat.config.ts` adalah pusat konfigurasi untuk proyek Hardhat. Mari kita modifikasi file untuk mengatur Hardhat agar bekerja dengan Monad Testnet dan mengoptimalkan untuk game development.

Buka file `hardhat.config.ts` di Visual Studio Code dan ganti isinya dengan konfigurasi berikut:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { vars } from "hardhat/config";
import "hardhat-gas-reporter";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      metadata: {
        bytecodeHash: "none",      // ⬅ prevents IPFS-hash mismatch
        useLiteralContent: true,   // ⬅ embeds the full source in metadata
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com",
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
  etherscan: {
    enabled: false,
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

### Penjelasan Konfigurasi untuk Game Development

Mari kita pahami setiap bagian dari konfigurasi yang dioptimalkan untuk TugWar Game:

#### Import dan Plugin

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { vars } from "hardhat/config";
import "hardhat-gas-reporter";
import "solidity-coverage";
```

Plugin ini memperluas fungsionalitas Hardhat:
- **hardhat-toolbox**: Paket plugin esensial (ethers, waffle, dll)
- **hardhat-verify**: Untuk verifikasi kontrak di explorer
- **vars**: Untuk manajemen variabel terenkripsi
- **hardhat-gas-reporter**: Untuk melaporkan biaya gas (penting untuk game optimization)
- **solidity-coverage**: Untuk laporan cakupan kode test

#### Konfigurasi Solidity untuk Game

```typescript
solidity: {
  version: "0.8.26",
  settings: {
    metadata: {
      bytecodeHash: "none",
      useLiteralContent: true,
    },
    optimizer: {
      enabled: true,
      runs: 200,
      details: {
        yul: true,
        yulDetails: {
          stackAllocation: true,
          optimizerSteps: "dhfoDgvulfnTUtnIf"
        }
      }
    },
    viaIR: true
  }
}
```

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

### Mengatur Additional Variables untuk Game

Untuk TugWar Game, kita juga dapat menyiapkan variabel tambahan:

```bash
# Set private key untuk owner game
npx hardhat vars set GAME_OWNER_KEY

# Set API key untuk monitoring (opsional)
npx hardhat vars set MONITORING_API_KEY

# Set gas price limit untuk deployment
npx hardhat vars set MAX_GAS_PRICE
```

### Verifikasi Private Key

Untuk memastikan private key telah tersimpan dengan benar:

```bash
npx hardhat vars get PRIVATE_KEY
```

Output akan menampilkan beberapa karakter pertama dari private key:

```
Value: 123a...
```

:::warning Perhatian Keamanan
Private key adalah informasi yang sangat sensitif yang memberikan kendali penuh atas alamat Ethereum Anda. 
- Jangan pernah membagikan private key Anda
- Pastikan menggunakan hardhat-vars atau metode aman lainnya
- Jangan menggunakan akun dengan dana nyata yang besar untuk development
- Gunakan akun terpisah khusus untuk testing game
:::

### Keunggulan Hardhat-Vars untuk Game Development

1. **Enkripsi**: Data disimpan dalam bentuk terenkripsi
2. **Multi-Environment**: Mudah switch antara testnet dan mainnet
3. **Team Collaboration**: Setiap developer bisa punya key sendiri
4. **CI/CD Integration**: Aman untuk automated deployment

## 3. Menginstal Ekstensi VS Code yang Berguna

Visual Studio Code dapat ditingkatkan dengan ekstensi untuk memudahkan pengembangan game smart contract. Buka tab Extensions di VS Code (Ctrl+Shift+X atau Cmd+Shift+X) dan instal ekstensi berikut:

### Ekstensi Utama untuk Game Development

| Ekstensi | Deskripsi |
|----------|-----------|
| **Solidity by Juan Blanco** | Syntax highlighting dan validasi untuk Solidity |
| **Hardhat Solidity** | Integrasi dengan Hardhat ecosystem |
| **Error Lens** | Menampilkan error/warning langsung di editor |
| **Solidity Visual Auditor** | Security highlighting untuk smart contracts |

### Ekstensi Tambahan (Opsional)

| Ekstensi | Deskripsi |
|----------|-----------|
| **Prettier - Code formatter** | Merapikan kode dengan format konsisten |
| **Git Graph** | Visualisasi Git history |
| **ESLint** | Linter untuk JavaScript/TypeScript |
| **Thunder Client** | REST API testing untuk backend integration |
| **Markdown All in One** | Better markdown editing untuk dokumentasi |

### Konfigurasi VS Code untuk Game Development

Buat file `.vscode/settings.json`:

```json
{
  "solidity.defaultCompiler": "local",
  "solidity.compileUsingRemoteVersion": "0.8.28",
  "solidity.enabledAsYouTypeCompilationErrorCheck": true,
  "solidity.validationDelay": 1500,
  "files.associations": {
    "*.sol": "solidity"
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 4. Menguji Konfigurasi

Untuk memastikan konfigurasi berjalan dengan baik untuk game development:

### Test Kompilasi

```bash
npx hardhat compile
```

### Test Local Network

```bash
# Start local hardhat network
npx hardhat node

# Di terminal terpisah, test deployment
npx hardhat run scripts/deploy.ts --network hardhat
```

### Test Connection ke Monad Testnet

```bash
# Test connection tanpa deployment
npx hardhat console --network monadTestnet
```

Di console, jalankan:

```javascript
// Get network info
await ethers.provider.getNetwork()

// Check balance
const [signer] = await ethers.getSigners()
await ethers.provider.getBalance(signer.address)
```

## 5. Menyiapkan Package.json Scripts

Tambahkan script yang berguna di `package.json` untuk mempermudah game development:

```json
{
  "name": "monad-tugwar-game",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "compile": "npx hardhat compile",
    "test": "npx hardhat test",
    "test:coverage": "npx hardhat coverage",
    "test:gas": "REPORT_GAS=true npx hardhat test",
    "deploy:local": "npx hardhat run scripts/deploy.ts --network hardhat",
    "deploy:testnet": "npx hardhat run scripts/deploy.ts --network monadTestnet",
    "verify:testnet": "npx hardhat run scripts/verify.ts --network monadTestnet",
    "node": "npx hardhat node",
    "console:local": "npx hardhat console --network hardhat",
    "console:testnet": "npx hardhat console --network monadTestnet",
    "clean": "npx hardhat clean",
    "lint": "eslint . --ext .ts,.js",
    "lint:fix": "eslint . --ext .ts,.js --fix"
  },
  "keywords": ["tugwar", "game", "blockchain", "monad", "hardhat"],
  "author": "",
  "license": "MIT",
  "description": "TugWar Game Smart Contract on Monad Testnet",
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@nomicfoundation/hardhat-verify": "^2.0.13",
    "@openzeppelin/contracts": "^5.0.0",
    "hardhat": "^2.23.0",
    "hardhat-gas-reporter": "^2.0.0",
    "solidity-coverage": "^0.8.0"
  }
}
```

### Penggunaan Scripts

```bash
# Game development workflow
npm run compile          # Kompilasi game contracts
npm run test            # Jalankan game tests
npm run test:gas        # Analisis gas usage untuk game
npm run deploy:local    # Deploy ke local network
npm run deploy:testnet  # Deploy ke Monad Testnet

# Game management
npm run game:start      # Start new game
npm run game:stats      # Get game statistics

# Development utilities
npm run clean           # Clean artifacts
npm run lint           # Check code quality
npm run console:testnet # Interactive console
```

## Pemecahan Masalah

### Masalah Koneksi RPC

Jika mengalami masalah koneksi ke Monad Testnet:

1. **Periksa URL RPC**: Pastikan `https://testnet-rpc.monad.xyz/` masih aktif
2. **Test koneksi manual**:
```bash
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
https://testnet-rpc.monad.xyz/
```
3. **Cek status network**: Verifikasi Monad Testnet status
4. **Alternative RPC**: Coba RPC endpoint lain jika tersedia

### Masalah Private Key

Jika terjadi error terkait private key:

1. **Reset private key**:
```bash
npx hardhat vars delete PRIVATE_KEY
npx hardhat vars set PRIVATE_KEY
```

2. **Verifikasi format**: Pastikan key tanpa prefix 0x

3. **Check balance**: Pastikan akun memiliki MON untuk gas
```bash
npx hardhat console --network monadTestnet
# const [signer] = await ethers.getSigners()
# await ethers.provider.getBalance(signer.address)
```

### Masalah Kompilasi Game Contract

Jika terjadi error kompilasi:

1. **Clear cache**:
```bash
npm run clean
rm -rf node_modules
npm install
npm run compile
```

2. **Check Solidity version**: Pastikan versi di config match dengan contract

3. **Gas limit issues**: Jika contract terlalu besar:
```typescript
// Di hardhat.config.ts
networks: {
  hardhat: {
    allowUnlimitedContractSize: true
  }
}
```

### Masalah Gas Estimation

Untuk game contracts yang kompleks:

1. **Increase gas limit**:
```typescript
// Di deployment script
const tugwar = await TugWar.deploy({
  gasLimit: 5000000
});
```

2. **Use gas estimation**:
```typescript
const gasEstimate = await TugWar.estimateGas.deploy();
console.log("Estimated gas:", gasEstimate.toString());
```

## Kesimpulan

Selamat! Anda telah berhasil:

1. ✅ Mengkonfigurasi Hardhat untuk berinteraksi dengan Monad Testnet
2. ✅ Menyiapkan pengelolaan private key yang aman dengan hardhat-vars
3. ✅ Menginstal ekstensi VS Code yang berguna untuk game development
4. ✅ Menambahkan script npm yang memudahkan game development
5. ✅ Memahami cara troubleshooting masalah umum dalam game development
6. ✅ Mengoptimalkan konfigurasi untuk TugWar Game development

Pengaturan yang benar dan aman merupakan fondasi penting untuk pengembangan game smart contract yang profesional. Konfigurasi yang telah kita buat dioptimalkan khusus untuk game development dengan:

- **Gas optimization** untuk transaksi game yang efisien
- **Multiple accounts** untuk testing multiplayer scenarios
- **Advanced compiler settings** untuk contract optimization
- **Comprehensive testing setup** untuk game mechanics
- **Security best practices** untuk production deployment

Pada bagian selanjutnya, kita akan mulai membangun smart contract TugWar Game dengan semua fitur advanced yang telah direncanakan.