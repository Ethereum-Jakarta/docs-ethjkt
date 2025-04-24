---
sidebar_position: 6
title: 6. Interaksi dengan Token di Monad Testnet
description: Men-deploy smart contract ke Monad Testnet dan berinteraksi dengan token ERC20
keywords: [monad, testnet, token, erc20, factory, deployment, interaction, verification, transfer, burning, blockchain, explorer]
---

# 2.5. Interaksi dengan Token di Monad Testnet

Pada bagian ini, kita akan men-deploy TokenFactory ke jaringan Monad Testnet dan berinteraksi dengan smart contract yang sudah di-deploy. Kita akan belajar cara membuat token baru, mentransfer token, dan menggunakan fungsi burning.

## 1. Persiapan Deployment ke Monad Testnet

Sebelum men-deploy ke Monad Testnet, ada beberapa hal yang perlu disiapkan:

### 1.1. Pastikan Akun Sudah Dikonfigurasi

Pastikan Anda telah mengatur private key dengan hardhat-vars:

```bash
npx hardhat vars set PRIVATE_KEY
```

Ingatlah untuk memasukkan private key **tanpa awalan 0x**.

### 1.2. Pastikan Ada Cukup Token MON untuk Gas Fee

Anda memerlukan token MON untuk membayar gas fee. Jika belum memiliki token MON:

1. Kunjungi [Monad Testnet Faucet](https://faucet.monad.xyz/)
2. Masukkan alamat wallet Anda
3. Klik "Request Funds"

### 1.3. Verifikasi Konfigurasi Network

Pastikan konfigurasi Monad Testnet di `hardhat.config.ts` sudah benar:

```typescript
monadTestnet: {
  url: "https://testnet-rpc.monad.xyz/",
  chainId: 10143,
  accounts: vars.has("PRIVATE_KEY") ? [`0x${vars.get("PRIVATE_KEY")}`] : [],
  gasPrice: "auto",
}
```

## 2. Deployment TokenFactory ke Monad Testnet

Sekarang kita siap untuk men-deploy TokenFactory ke Monad Testnet.

### 2.1. Menjalankan Script Deployment

Jalankan perintah berikut untuk men-deploy TokenFactory:

```bash
npx hardhat run scripts/deploy-token-factory.ts --network monadTestnet
```

Proses ini mungkin membutuhkan waktu 15-30 detik untuk mendapatkan konfirmasi. Jika berhasil, Anda akan melihat output seperti:

```
Deploying TokenFactory to monadTestnet network...
Initiating deployment transaction...
Waiting for deployment transaction confirmation...
TokenFactory deployed successfully to: 0x1234567890abcdef1234567890abcdef12345678

View your contract on Monad Testnet Explorer:
https://testnet.monadexplorer.com/address/0x1234567890abcdef1234567890abcdef12345678
```

### 2.2. Menyimpan Alamat Kontrak

Catat alamat kontrak TokenFactory yang baru di-deploy (dalam contoh di atas, `0x1234567890abcdef1234567890abcdef12345678`). Anda akan membutuhkannya untuk interaksi selanjutnya.

:::tip
Simpan alamat kontrak di tempat yang aman. Anda juga bisa membuat file konfigurasi sederhana atau menambahkannya sebagai variabel di hardhat-vars:
```bash
npx hardhat vars set FACTORY_ADDRESS 0x1234567890abcdef1234567890abcdef12345678
```
:::

### 2.3. Memeriksa Deployment di Explorer

Kunjungi Monad Testnet Explorer untuk memeriksa kontrak yang telah di-deploy:

1. Buka link yang diberikan di output deployment
2. Periksa bahwa kontrak telah berhasil di-deploy dan siap untuk digunakan

<!-- ![Monad Testnet Explorer Contract View](/img/monad-explorer-contract.png) -->

## 3. Membuat Token Baru Menggunakan TokenFactory

Setelah TokenFactory berhasil di-deploy, kita dapat menggunakannya untuk membuat token ERC20 baru.

### 3.1. Mengupdate Alamat Factory di Script

Edit file `scripts/create-new-token.ts` dan ganti `FACTORY_ADDRESS` dengan alamat TokenFactory yang sebenarnya:

```typescript
// Alamat contract TokenFactory yang sudah di-deploy
// GANTI DENGAN ALAMAT HASIL DEPLOYMENT ANDA!
const FACTORY_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";
```

Anda juga dapat menyesuaikan parameter token sesuai keinginan:

```typescript
// Parameter untuk token baru
const TOKEN_NAME = "Monad Test Token";
const TOKEN_SYMBOL = "MTT";
const INITIAL_SUPPLY = 1000000; // 1 juta token
```

### 3.2. Menjalankan Script Pembuatan Token

Jalankan script untuk membuat token baru:

```bash
npx hardhat run scripts/create-new-token.ts --network monadTestnet
```

Jika berhasil, Anda akan melihat output seperti:

```
Creating token as owner: 0xYourAddress...
Token details:
- Name: Monad Test Token
- Symbol: MTT
- Initial Supply: 1,000,000 tokens

Creating new token via TokenFactory at 0x1234567890abcdef1234567890abcdef12345678...
Transaction sent, waiting for confirmation...

Token created successfully!
New token address: 0xabcdef1234567890abcdef1234567890abcdef12

View the token on Monad Testnet Explorer:
https://testnet.monadexplorer.com/address/0xabcdef1234567890abcdef1234567890abcdef12

Total tokens created by this factory: 1
```

### 3.3. Memeriksa Token di Explorer

Kunjungi alamat token baru di Monad Explorer untuk memverifikasi:

1. Informasi dasar token (nama, simbol)
2. Total supply
3. Balance pemilik

### 3.4. Menambahkan Token ke MetaMask

Anda juga dapat menambahkan token yang baru dibuat ke MetaMask untuk melihat balance:

1. Buka MetaMask dan pastikan Anda berada di jaringan Monad Testnet
2. Klik "Import tokens" di bagian bawah
3. Masukkan alamat token yang baru dibuat
4. MetaMask akan otomatis mendeteksi nama dan simbol token
5. Klik "Import"

<!-- ![Adding Token to MetaMask](/img/metamask-add-token.png) -->

## 4. Berinteraksi dengan Token ERC20

Setelah token berhasil dibuat, mari berinteraksi dengannya menggunakan script.

### 4.1. Membuat Script Interaksi dengan Token

Buat file baru bernama `scripts/interact-token.ts`:

```typescript
// Script untuk berinteraksi dengan token ERC20 yang dibuat
import { ethers } from "hardhat";
import { Token } from "../typechain-types";

// Alamat token ERC20 yang sudah di-deploy
// GANTI DENGAN ALAMAT TOKEN ANDA!
const TOKEN_ADDRESS = "0x58D07200a634D8927ab6DB17981e354fC90275e0";

async function main() {
  try {
    // Dapatkan signers
    const signers = await ethers.getSigners();
    
    if (signers.length === 0) {
      throw new Error("No signers available");
    }
    
    const owner = signers[0];
    const ownerAddress = await owner.getAddress();
    
    console.log(`Using owner address: ${ownerAddress}`);
    console.log(`Interacting with token at ${TOKEN_ADDRESS}`);
    
    // Connect ke Token contract
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.attach(TOKEN_ADDRESS) as Token;
    
    // Dapatkan informasi token
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    
    console.log("\nToken Information:");
    console.log(`- Name: ${name}`);
    console.log(`- Symbol: ${symbol}`);
    console.log(`- Decimals: ${decimals}`);
    console.log(`- Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
    
    // Cek balance owner
    const ownerBalance = await token.balanceOf(ownerAddress);
    console.log(`\nBalance of ${ownerAddress}: ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    
    // Menguji fungsi pembakaran token (hanya owner)
    const burnAmount = 500;
    
    // Verifikasi jika kita memiliki cukup token untuk dibakar
    if (ownerBalance >= ethers.parseUnits(burnAmount.toString(), decimals)) {
      console.log(`\nBurning ${burnAmount} tokens...`);
      const burnTx = await token.burnToken(burnAmount);
      await burnTx.wait();
      
      // Cek total supply dan balance setelah pembakaran
      const newTotalSupply = await token.totalSupply();
      const finalOwnerBalance = await token.balanceOf(ownerAddress);
      
      console.log("\nAfter burning:");
      console.log(`- Total Supply: ${ethers.formatUnits(newTotalSupply, decimals)} ${symbol}`);
      console.log(`- Owner Balance: ${ethers.formatUnits(finalOwnerBalance, decimals)} ${symbol}`);
    } else {
      console.log(`\nInsufficient balance for burning ${burnAmount} tokens.`);
      console.log(`Current balance: ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    }
    
  } catch (error) {
    console.error("Error interacting with token:");
    console.error(error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4.2. Menjalankan Script Interaksi

Jalankan script interaksi:

```bash
npx hardhat run scripts/interact-token.ts --network monadTestnet
```

Output akan menampilkan informasi tentang token, transfer, dan burning:

```
Interacting with token at 0xabcdef1234567890abcdef1234567890abcdef12

Token Information:
- Name: Monad Test Token
- Symbol: MTT
- Decimals: 18
- Total Supply: 1000000 MTT

Balance of 0xYourAddress...: 1000000 MTT

Transferring 1000 MTT to 0xRecipientAddress...
Transaction sent, waiting for confirmation...

Balances after transfer:
- Owner: 999000 MTT
- Recipient: 1000 MTT

Burning 500 tokens...
Transaction sent, waiting for confirmation...

After burning:
- Total Supply: 998500 MTT
- Owner Balance: 998500 MTT
```

### 4.3. Penjelasan Interaksi

Mari kita lihat apa yang terjadi dalam script interaksi:

1. **Mendapatkan Informasi Token**:
   - Mendapatkan nama, simbol, dan jumlah desimal
   - Mendapatkan total supply token

2. **Transfer Token**:
   - Mentransfer 1000 token ke alamat penerima
   - Memeriksa balance setelah transfer

3. **Burning Token**:
   - Membakar 500 token dari akun owner
   - Memeriksa total supply dan balance setelah pembakaran

### 4.4. Memverifikasi Transaksi di Explorer

Untuk setiap transaksi, Anda dapat memeriksa detailnya di Monad Testnet Explorer:

1. Lihat hash transaksi di output
2. Kunjungi `https://testnet.monadexplorer.com/tx/{transaction-hash}`
3. Lihat detail transaksi, seperti jumlah gas yang digunakan, status, dan events yang dipancarkan

<!-- ![Transaction Details in Explorer](/img/monad-explorer-tx.png) -->

## 5. Verifikasi Kontrak pada Explorer (Opsional)

Verifikasi kontrak memungkinkan orang lain melihat kode sumber kontrak Anda di explorer. Ini meningkatkan transparansi dan memungkinkan interaksi langsung dengan kontrak melalui explorer.

### 5.1. Persiapan Verifikasi

Untuk verifikasi kontrak, kita perlu menginstal plugin tambahan:

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

Pastikan plugin sudah ditambahkan di `hardhat.config.ts`:

```typescript
import "@nomicfoundation/hardhat-verify";
```

### 5.2. Konfigurasi API Key (Jika Diperlukan)

Beberapa explorer memerlukan API key untuk verifikasi. Tambahkan ke konfigurasi Hardhat jika diperlukan:

```typescript
etherscan: {
  apiKey: {
    monadTestnet: "YOUR_API_KEY_HERE"
  },
  customChains: [
    {
      network: "monadTestnet",
      chainId: 10143,
      urls: {
        apiURL: "https://testnet.monadexplorer.com/api",
        browserURL: "https://testnet.monadexplorer.com"
      }
    }
  ]
}
```

:::note
Saat dokumentasi ini ditulis, Monad Testnet Explorer mungkin belum mendukung verifikasi kontrak melalui API. Jika fitur ini sudah tersedia, ikuti dokumentasi resmi Monad untuk mendapatkan API key dan konfigurasi yang tepat.
:::

### 5.3. Menjalankan Verifikasi

Jika verifikasi kontrak didukung, Anda dapat menjalankan:

```bash
npx hardhat verify --network monadTestnet FACTORY_ADDRESS
```

Untuk token yang dibuat oleh factory:

```bash
npx hardhat verify --network monadTestnet TOKEN_ADDRESS "CONSTRUCTOR_ARG1" "CONSTRUCTOR_ARG2" ...
```

Jika verifikasi berhasil, Anda akan melihat pesan sukses dan link ke kontrak yang terverifikasi di explorer.

## 6. Berinteraksi dengan Token melalui MetaMask

Selain menggunakan script, Anda juga dapat berinteraksi dengan token menggunakan MetaMask:

### 6.1. Transfer Token

1. Buka MetaMask dan pilih token yang telah diimpor
2. Klik "Send"
3. Masukkan alamat penerima dan jumlah token
4. Konfirmasi transaksi dan bayar gas fee

### 6.2. Berinteraksi dengan Kontrak melalui Explorer (Jika Terverifikasi)

Jika kontrak telah diverifikasi, Anda dapat berinteraksi dengannya melalui explorer:

1. Kunjungi alamat kontrak di explorer
2. Cari tab "Contract" atau "Read Contract"/"Write Contract"
3. Connect wallet Anda
4. Panggil fungsi kontrak seperti `burnToken`

<!-- ![Contract Interaction via Explorer](/img/monad-explorer-interact.png) -->

## 7. Tips dan Pemecahan Masalah

### 7.1. Gas Fee

- Jika transaksi gagal dengan error "gas insufficient", coba tingkatkan gas limit:

```typescript
const tx = await token.transfer(recipient, amount, {
  gasLimit: 100000
});
```

### 7.2. Nonce too high

Jika muncul error "nonce too high", reset akun Monad Testnet di MetaMask:
1. Buka MetaMask > Settings > Advanced
2. Scroll ke bawah dan klik "Reset Account"

### 7.3. Estimasi Gas

Untuk estimasi gas sebelum mengirim transaksi:

```typescript
const estimatedGas = await token.estimateGas.transfer(recipient, amount);
console.log(`Estimated gas: ${estimatedGas}`);
```

### 7.4. Caching Nonce

Untuk transaksi berurutan, lindungi dari error nonce dengan tracking manual:

```typescript
let nonce = await ethers.provider.getTransactionCount(ownerAddress);

const tx1 = await token.transfer(recipient1, amount1, { nonce: nonce++ });
const tx2 = await token.transfer(recipient2, amount2, { nonce: nonce++ });
```

## Kesimpulan

Selamat! Anda telah berhasil:

1. Men-deploy TokenFactory ke Monad Testnet
2. Membuat token ERC20 baru menggunakan TokenFactory
3. Berinteraksi dengan token melalui script (transfer, burning)
4. Mempelajari cara memverifikasi kontrak di explorer (jika didukung)
5. Mengimpor dan berinteraksi dengan token melalui MetaMask

Pengalaman ini memberikan Anda fondasi yang kuat untuk mengembangkan dan berinteraksi dengan smart contract di jaringan Monad. Pada bagian selanjutnya, kita akan membahas cara mengembangkan frontend untuk TokenFactory dan menghubungkannya dengan Monad Testnet.